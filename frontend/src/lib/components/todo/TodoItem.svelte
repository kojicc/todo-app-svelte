<script>
	import { enhance } from '$app/forms';
	import { fly, slide, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	// mga props galing sa parent
	let {
		todo,
		editingTodo,
		onStartEdit,
		onCancelEdit,
		onToggleComplete,
		onDelete,
		onUpdate,
		isSelected = false,
		onToggleSelection,
		selectionMode = null // para sa smart selection guard
	} = $props();

	// local loading state para sa todo
	let isLoading = $state(false);

	// check kung pwede i-select base sa current selection mode
	let canSelect = $derived(() => {
		if (selectionMode === null) return true; // walang selection pa
		return todo.completed === selectionMode; // same type lang
	});

	// mga colors para sa priority - mas readable, with completed state support
	function getPriorityClass(priority) {
		const baseClasses = {
			high: todo.completed
				? 'bg-red-800 text-red-100 border-red-700'
				: 'bg-red-100 text-red-800 border-red-200',
			medium: todo.completed
				? 'bg-yellow-700 text-yellow-100 border-yellow-600'
				: 'bg-yellow-100 text-yellow-800 border-yellow-200',
			low: todo.completed
				? 'bg-green-700 text-green-100 border-green-600'
				: 'bg-green-100 text-green-800 border-green-200',
			default: todo.completed
				? 'bg-gray-700 text-gray-100 border-gray-600'
				: 'bg-gray-100 text-gray-800 border-gray-200'
		};

		return baseClasses[priority] || baseClasses.default;
	}

	// priority text na mas human-readable
	function getPriorityText(priority) {
		switch (priority) {
			case 'high':
				return 'High';
			case 'medium':
				return 'Medium';
			case 'low':
				return 'Low';
			default:
				return 'Normal';
		}
	}

	// pag nag-click sa todo body - for selection lang
	function handleTodoClick(event) {
		// wag mag-trigger pag nag-click sa buttons or forms
		if (
			event.target.tagName === 'BUTTON' ||
			event.target.tagName === 'INPUT' ||
			event.target.tagName === 'TEXTAREA' ||
			event.target.tagName === 'SELECT' ||
			event.target.closest('button') ||
			event.target.closest('form')
		) {
			return;
		}

		// wag din pag nag-edit mode
		if (editingTodo && editingTodo.id === todo.id) return;

		// pwede lang mag-select pag di conflicting
		if (canSelect && onToggleSelection) {
			onToggleSelection(todo.id);
		}
	}

	// gets priority select option colors
	function getPrioritySelectClass(priority) {
		switch (priority) {
			case 'high':
				return 'text-red-600';
			case 'medium':
				return 'text-yellow-600';
			case 'low':
				return 'text-green-600';
			default:
				return 'text-gray-600';
		}
	}

	// handles form submission for updates
	function handleUpdate() {
		return async ({ result, update }) => {
			isLoading = false;
			if (result.type === 'success') {
				onCancelEdit(); // close edit mode on success
			}
			await update();
			if (onUpdate) onUpdate(result);
		};
	}

	// handles toggle completion
	function handleToggle() {
		return async ({ result, update }) => {
			await update();
			if (onToggleComplete) onToggleComplete(result);
		};
	}

	// handles delete confirmation
	function handleDelete() {
		return async ({ result, update }) => {
			await update();
			if (onDelete) onDelete(result);
		};
	}

	// formats date to readable format
	function formatDate(dateString) {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// checks if todo is overdue
	function isOverdue(dueDate) {
		if (!dueDate) return false;
		return new Date(dueDate) < new Date() && !todo.completed;
	}
</script>

<!-- todo card - may visual feedback pag di pwede i-select -->
<div
	class="backdrop-blur-sm rounded-xl shadow-lg border p-6 transition-all duration-500 transform
		{isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50 border-blue-300' : ''}
		{canSelect ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : 'opacity-60 cursor-not-allowed'}
		{todo.completed
		? 'bg-gray-600/80 border-gray-500/50 text-gray-100'
		: 'bg-white/90 border-white/30 text-gray-900'}"
	onclick={handleTodoClick}
	onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleTodoClick(e)}
	role="button"
	tabindex="0"
	aria-label={isSelected
		? 'Deselect todo'
		: canSelect
			? 'Select todo'
			: 'Cannot select - different completion status'}
	in:fly={{ y: 30, duration: 500, easing: quintOut }}
	out:fly={{ y: -30, duration: 400, easing: quintOut }}
>
	{#if editingTodo && editingTodo.id === todo.id}
		<!-- edit mode form -->
		<form method="POST" action="?/updateTodo" use:enhance={handleUpdate}>
			<input type="hidden" name="id" value={todo.id} />
			<div class="space-y-4">
				<!-- title input -->
				<div>
					<label for="edit-title-{todo.id}" class="block text-sm font-medium text-gray-700 mb-2">
						Title
					</label>
					<input
						id="edit-title-{todo.id}"
						type="text"
						name="title"
						bind:value={editingTodo.title}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="Enter todo title"
						required
					/>
				</div>

				<!-- description textarea -->
				<div>
					<label
						for="edit-description-{todo.id}"
						class="block text-sm font-medium text-gray-700 mb-2"
					>
						Description
					</label>
					<textarea
						id="edit-description-{todo.id}"
						name="description"
						bind:value={editingTodo.description}
						rows="3"
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
						placeholder="Enter description (optional)"
					></textarea>
				</div>

				<!-- due date and priority row -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<!-- due date input -->
					<div>
						<label
							for="edit-dueDate-{todo.id}"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Due Date
						</label>
						<input
							required
							id="edit-dueDate-{todo.id}"
							type="date"
							name="dueDate"
							bind:value={editingTodo.dueDate}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<!-- priority select -->
					<div>
						<label
							for="edit-priority-{todo.id}"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Priority
						</label>
						<select
							id="edit-priority-{todo.id}"
							name="priority"
							bind:value={editingTodo.priority}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent {getPrioritySelectClass(
								editingTodo.priority
							)}"
						>
							<option value="low" class="text-green-600">Low Priority</option>
							<option value="medium" class="text-yellow-600">Medium Priority</option>
							<option value="high" class="text-red-600">High Priority</option>
						</select>
					</div>
				</div>

				<!-- action buttons -->
				<div class="flex flex-col sm:flex-row gap-3 pt-4">
					<button
						type="submit"
						disabled={isLoading}
						class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors font-medium"
					>
						{isLoading ? 'Updating...' : 'Update Todo'}
					</button>
					<button
						type="button"
						onclick={onCancelEdit}
						class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
					>
						Cancel
					</button>
				</div>
			</div>
		</form>
	{:else}
		<!-- display mode -->
		<div class="space-y-4">
			<!-- header with title and actions -->
			<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
				<div class="flex-1 flex gap-3">
					<!-- selection checkbox (always visible) -->
					<div class="flex-shrink-0 pt-1">
						<input
							type="checkbox"
							checked={isSelected}
							onchange={() => onToggleSelection && onToggleSelection(todo.id)}
							class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
							aria-label="Select this todo"
						/>
					</div>

					<div class="flex-1">
						<!-- priority badge and title -->
						<div class="flex items-start gap-3 mb-2">
							<span
								class="inline-block px-2 py-1 rounded-full text-xs font-medium border {getPriorityClass(
									todo.priority
								)}"
							>
								{getPriorityText(todo.priority)}
							</span>
							{#if isOverdue(todo.dueDate)}
								<span
									class="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white"
								>
									Overdue
								</span>
							{/if}
						</div>

						<!-- todo title -->
						<h3
							class="text-lg font-semibold text-gray-900 {todo.completed
								? 'line-through text-gray-500'
								: ''}"
						>
							{todo.title}
						</h3>

						<!-- todo description -->
						{#if todo.description}
							<p class="text-gray-600 mt-2 {todo.completed ? 'line-through' : ''}">
								{todo.description}
							</p>
						{/if}

						<!-- due date -->
						{#if todo.dueDate}
							<p class="text-sm text-gray-500 mt-2">
								Due: {formatDate(todo.dueDate)}
							</p>
						{/if}
					</div>
				</div>

				<!-- action buttons -->
				<div class="flex flex-row gap-1 sm:ml-4">
					<!-- completion toggle - i-balik na natin -->
					<form method="POST" action="?/toggleTodo" use:enhance={handleToggle} class="inline">
						<input type="hidden" name="id" value={todo.id} />
						<button
							type="submit"
							class="p-2 rounded-lg transition-colors hover:bg-gray-100
								{todo.completed ? 'text-yellow-600' : 'text-green-600'}"
							aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
							title={todo.completed ? 'Undo completion' : 'Mark as done'}
						>
							{#if todo.completed}
								<!-- undo icon - pang-undo ng completion -->
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
									></path>
								</svg>
							{:else}
								<!-- check icon - pang-mark as done -->
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
							{/if}
						</button>
					</form>

					<!-- edit button -->
					<button
						type="button"
						onclick={() => onStartEdit(todo)}
						class="p-2 rounded-lg transition-colors hover:bg-gray-100 text-blue-600"
						aria-label="Edit todo"
						title="Edit todo"
					>
						<!-- edit icon -->
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							></path>
						</svg>
					</button>

					<!-- delete button -->
					<form method="POST" action="?/deleteTodo" use:enhance={handleDelete} class="inline">
						<input type="hidden" name="id" value={todo.id} />
						<button
							type="submit"
							onclick={() => confirm('Are you sure you want to delete this todo?')}
							class="p-2 rounded-lg transition-colors hover:bg-gray-100 text-red-600"
							aria-label="Delete todo"
							title="Delete todo"
						>
							<!-- delete icon -->
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								></path>
							</svg>
						</button>
					</form>
				</div>
			</div>
		</div>
	{/if}
</div>
