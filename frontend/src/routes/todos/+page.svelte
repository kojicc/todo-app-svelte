<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { fly, slide, scale } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import {
		Navbar,
		TodoItem,
		TodoForm,
		TodoStats,
		LoadingSpinner,
		BulkActions,
		ToastContainer
	} from '$lib/components';
	import { showToast } from '$lib/stores/toastStore.js';

	// get data and form from props
	let { data, form } = $props();

	// state variables for component interactions
	let editingTodo = $state(null);
	let isAddingTodo = $state(false);
	let selectedTodos = $state([]);

	// smart selection guard - pag may una nang selected, same type lang pwede i-select
	let selectionMode = $derived.by(() => {
		if (selectedTodos.length === 0) {
			return null; // walang selection yet
		}

		const firstSelected = data.todos.find((todo) => todo.id === selectedTodos[0]);
		return firstSelected ? firstSelected.completed : null;
	});

	// derived value para sa selected todos data
	let selectedTodosData = $derived.by(() => {
		return data.todos.filter((todo) => selectedTodos.includes(todo.id));
	});

	// mga event handlers para sa components
	function handleFormSubmit(result) {
		if (result.type === 'success') {
			isAddingTodo = false;
			showToast('Todo added successfully!', 'success');
		} else if (result.type === 'failure') {
			showToast('Failed to add todo', 'error');
		}
	}

	function handleTodoUpdate(result) {
		if (result.type === 'success') {
			editingTodo = null;
			showToast('Todo updated successfully!', 'success');
		} else if (result.type === 'failure') {
			showToast('Failed to update todo', 'error');
		}
	}

	function startEdit(todo) {
		editingTodo = { ...todo };
	}

	function cancelEdit() {
		editingTodo = null;
	}

	function cancelForm() {
		isAddingTodo = false;
	}

	function toggleTodoSelection(todoId) {
		// cleanup stale selections first - baka may leftover IDs
		selectedTodos = selectedTodos.filter((id) => data.todos.some((todo) => todo.id === id));

		if (selectedTodos.includes(todoId)) {
			// i-remove pag nandun na
			selectedTodos = selectedTodos.filter((id) => id !== todoId);
		} else {
			// smart guard - check kung pwede ba i-select
			const todoToSelect = data.todos.find((todo) => todo.id === todoId);

			if (!todoToSelect) {
				console.error('Todo not found!', todoId);
				showToast('Error: Todo not found!', 'error');
				return;
			}

			// check kung pwede i-select using smart selection guard
			const currentSelectionMode = selectionMode;
			const canSelect =
				currentSelectionMode === null || todoToSelect.completed === currentSelectionMode;

			if (canSelect) {
				// pwede i-select kasi either first selection or same type
				selectedTodos = [...selectedTodos, todoId];
				if (currentSelectionMode === null) {
					showToast(
						`Selected first ${todoToSelect.completed ? 'completed' : 'incomplete'} todo`,
						'info'
					);
				} else {
					showToast(`Added to selection (${selectedTodos.length} todos)`, 'success');
				}
			} else {
				// different type, show clearer warning message
				const currentType = currentSelectionMode ? 'completed' : 'incomplete';
				const tryingToSelect = todoToSelect.completed ? 'completed' : 'incomplete';
				showToast(
					`Can't select ${tryingToSelect} todos! You already have ${currentType} todos selected.`,
					'warning'
				);
			}
		}
	}

	function handleToggleComplete(result) {
		// server na bahala sa update
		if (result.type === 'success') {
			showToast('Todo status updated!', 'success');
		}
	}

	function handleDelete(result) {
		// server na bahala sa deletion
		if (result.type === 'success') {
			showToast('Todo deleted successfully!', 'success');
		} else if (result.type === 'failure') {
			showToast('Failed to delete todo', 'error');
		}
	}

	function clearSelection() {
		selectedTodos = []; // i-clear lahat ng selection
	}
</script>

<svelte:head>
	<title>Smart Todo App - {data.user.firstName} {data.user.lastName}</title>
	<script src="https://cdn.tailwindcss.com"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="min-h-screen bg-[url('src/lib/images/bg.jpg')] bg-cover bg-center bg-fixed">
	<div class="min-h-screen bg-blue-400/70 backdrop-blur-sm">
		<!-- responsive navbar component -->
		<Navbar user={data.user} stats={data.stats} />

		<!-- main content area -->
		<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- todo statistics component -->
			<TodoStats stats={data.stats} />

			<!-- button to add new todo -->
			<div class="mb-6 flex gap-4">
				<button
					onclick={() => (isAddingTodo = !isAddingTodo)}
					class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
					aria-label="Add new todo item"
				>
					<svg
						class="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						></path>
					</svg>
					<span>Add New Todo</span>
				</button>
			</div>

			<!-- todo form component -->
			<TodoForm isVisible={isAddingTodo} onCancel={cancelForm} onSubmit={handleFormSubmit} />

			<!-- bulk actions component -->
			<BulkActions {selectedTodos} {selectedTodosData} onClearSelection={clearSelection} />

			<!-- display form validation errors -->
			{#if form?.error}
				<div class="mb-6 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
					<div class="flex items-center">
						<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							></path>
						</svg>
						{form.error}
					</div>
				</div>
			{/if}

			<!-- list of todos -->
			<div class="space-y-4" in:fly={{ y: 20, duration: 600, delay: 200 }}>
				{#if data.todos.length === 0}
					<!-- empty state -->
					<div class="text-center py-12">
						<div
							class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-8"
						>
							<svg
								class="w-16 h-16 mx-auto text-gray-400 mb-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								></path>
							</svg>
							<h3 class="text-xl font-semibold text-gray-900 mb-2">No todos yet</h3>
							<p class="text-gray-600 mb-4">Get started by adding your first todo item!</p>
							<button
								onclick={() => (isAddingTodo = true)}
								class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
							>
								Add Your First Todo
							</button>
						</div>
					</div>
				{:else}
					<!-- todo items with smart selection -->
					{#each data.todos as todo (todo.id)}
						<TodoItem
							{todo}
							{editingTodo}
							isSelected={selectedTodos.includes(todo.id)}
							{selectionMode}
							onStartEdit={startEdit}
							onCancelEdit={cancelEdit}
							onToggleComplete={handleToggleComplete}
							onDelete={handleDelete}
							onUpdate={handleTodoUpdate}
							onToggleSelection={toggleTodoSelection}
						/>
					{/each}
				{/if}
			</div>
		</main>
	</div>
</div>

<!-- toast notifications -->
<ToastContainer />
