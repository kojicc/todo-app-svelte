<script>
	import { enhance } from '$app/forms';
	import { fly, slide, scale } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';

	// props from parent component
	let { isVisible, onCancel, onSubmit } = $props();

	// form state
	let newTodo = $state({
		title: '',
		description: '',
		dueDate: '',
		priority: 'medium'
	});
	let isLoading = $state(false);

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

	// handles form submission
	function handleSubmit() {
		return async ({ result, update }) => {
			isLoading = false;
			if (result.type === 'success') {
				// reset form when successful
				newTodo = { title: '', description: '', dueDate: '', priority: 'medium' };
				if (onCancel) onCancel(); // close form
			}
			await update();
			if (onSubmit) onSubmit(result);
		};
	}

	// cancels form and resets
	function handleCancel() {
		newTodo = { title: '', description: '', dueDate: '', priority: 'medium' };
		if (onCancel) onCancel();
	}
</script>

{#if isVisible}
	<!-- add new todo form -->
	<div
		class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 mb-8 transform"
		in:fly={{ y: -30, duration: 500, easing: quintOut }}
		out:slide={{ duration: 400, easing: quintOut }}
	>
		<h2 class="text-xl font-bold text-gray-900 mb-6">Add New Todo</h2>

		<form method="POST" action="?/addTodo" use:enhance={handleSubmit}>
			<div class="space-y-4">
				<!-- title input -->
				<div>
					<label for="new-title" class="block text-sm font-medium text-gray-700 mb-2">
						Title *
					</label>
					<input
						id="new-title"
						type="text"
						name="title"
						bind:value={newTodo.title}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="What needs to be done?"
						required
					/>
				</div>

				<!-- description textarea -->
				<div>
					<label for="new-description" class="block text-sm font-medium text-gray-700 mb-2">
						Description
					</label>
					<textarea
						id="new-description"
						name="description"
						bind:value={newTodo.description}
						rows="3"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
						placeholder="Add more details about this todo (optional)"
					></textarea>
				</div>

				<!-- due date and priority row -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<!-- due date input -->
					<div>
						<label for="new-dueDate" class="block text-sm font-medium text-gray-700 mb-2">
							Due Date
						</label>
						<input
							required
							id="new-dueDate"
							type="date"
							name="dueDate"
							bind:value={newTodo.dueDate}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<!-- priority select -->
					<div>
						<label for="new-priority" class="block text-sm font-medium text-gray-700 mb-2">
							Priority
						</label>
						<select
							id="new-priority"
							name="priority"
							bind:value={newTodo.priority}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent {getPrioritySelectClass(
								newTodo.priority
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
						disabled={isLoading || !newTodo.title.trim()}
						class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors font-medium"
					>
						{isLoading ? 'Adding...' : 'Add Todo'}
					</button>
					<button
						type="button"
						onclick={handleCancel}
						class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
					>
						Cancel
					</button>
				</div>
			</div>
		</form>
	</div>
{/if}
