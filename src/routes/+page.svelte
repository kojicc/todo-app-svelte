<script>
	import { browser } from '$app/environment';
	import Header from './Header.svelte';

	// Import our services and utilities
	import { TodoService } from '$lib/services/todoService.js';
	import { StorageService } from '$lib/services/storageService.js';
	import {
		getPriorityColor,
		getPriorityEmoji,
		sortTodosByPriorityAndCompletion,
		filterTodos
	} from '$lib/utils/todoHelpers.js';

	// Clear localStorage if needed for testing
	// if (browser) {
	// 	StorageService.clearTodos();
	// 	console.log('localStorage cleared!');
	// }

	let searchQuery = $state('');

	//todo variables
	// interface
	// Todo { id: string; title: string; description: string; dueDate: string; priority: 'low'|'medium'|'high'; completed: boolean; }
	let todos = $state([]);
	let newTodo = $state({
		title: '',
		description: '',
		dueDate: '',
		priority: 'medium'
	});
	let editingTodo = $state(null);
	let isInitialized = $state(false);

	// Derived reactive values using our helper functions
	let sortedTodos = $derived.by(() => {
		return sortTodosByPriorityAndCompletion(todos);
	});

	let filteredTodos = $derived.by(() => {
		return filterTodos(sortedTodos, searchQuery);
	});

	let stats = $derived.by(() => {
		return TodoService.getStats(todos);
	});

	//to load from local storage on initial render
	$effect(() => {
		if (browser && !isInitialized) {
			todos = StorageService.loadTodos();
			isInitialized = true;
		}
	});

	//to save to local storage when todos changes
	$effect(() => {
		if (browser && isInitialized) {
			StorageService.saveTodos(todos);
		}
	});

	//todo functions
	function addTodo() {
		try {
			const newTodoItem = TodoService.createTodo(newTodo);
			todos = [...todos, newTodoItem];
			// Reset form
			newTodo = { title: '', description: '', dueDate: '', priority: 'medium' };
		} catch (error) {
			alert(error.message);
			console.error('Error adding todo:', error);
		}
	}

	function editTodo(todo) {
		try {
			editingTodo = { ...todo };
		} catch (error) {
			console.error('Error editing todo:', error);
		}
	}

	function saveEdit() {
		try {
			todos = TodoService.updateTodo(todos, editingTodo.id, editingTodo);
			editingTodo = null;
		} catch (error) {
			alert(error.message);
			console.error('Error saving edit:', error);
		}
	}

	function cancelEdit() {
		editingTodo = null;
	}

	function toggleComplete(id, event) {
		try {
			// Stop event propagation to prevent conflicts
			if (event) {
				event.stopPropagation();
			}
			todos = TodoService.toggleCompletion(todos, id);
		} catch (error) {
			console.error('Error toggling completion:', error);
		}
	}

	function deleteTodo(id, event) {
		try {
			// Stop event propagation and confirm deletion
			if (event) {
				event.stopPropagation();
			}

			// Add confirmation for better UX
			const todo = todos.find((t) => t.id === id);
			if (todo && confirm(`Are you sure you want to delete "${todo.title}"?`)) {
				todos = TodoService.deleteTodo(todos, id);
			}
		} catch (error) {
			alert(error.message);
			console.error('Error deleting todo:', error);
		}
	}
</script>

<svelte:head>
	<title>Smart Todo App</title>
	<script src="https://cdn.tailwindcss.com"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div>
	<Header incompleteCount={stats.incomplete} completedCount={stats.completed} {isInitialized} />

	<div class="p-4">
		<div class="max-w-6xl mx-auto space-y-4 sm:space-y-6">
			<div class="flex flex-col md:flex-row sm:items-center justify-between gap-4">
				<!-- add todo form -->
				<div
					class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-white/20"
				>
					<h2 class="text-lg sm:text-xl font-bold mb-4 text-gray-800">Add New Task</h2>
					<form
						onsubmit={(e) => {
							e.preventDefault();
							addTodo();
						}}
						class="space-y-4"
					>
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<div>
								<label for="todo-title" class="block text-sm font-medium text-gray-700 mb-1"
									>Title *</label
								>
								<input
									id="todo-title"
									bind:value={newTodo.title}
									placeholder="What needs to be done?"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
									required
								/>
							</div>
							<div>
								<label for="todo-due-date" class="block text-sm font-medium text-gray-700 mb-1"
									>Due Date</label
								>
								<input
									id="todo-due-date"
									type="date"
									bind:value={newTodo.dueDate}
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
								/>
							</div>
						</div>

						<div>
							<label for="todo-description" class="block text-sm font-medium text-gray-700 mb-1"
								>Description</label
							>
							<textarea
								id="todo-description"
								bind:value={newTodo.description}
								placeholder="Add more details..."
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
								rows="3"
							></textarea>
						</div>

						<div class="flex flex-col sm:flex-row gap-4 sm:items-end">
							<div class="flex-1 sm:flex-none">
								<label for="todo-priority" class="block text-sm font-medium text-gray-700 mb-1"
									>Priority</label
								>
								<select
									id="todo-priority"
									bind:value={newTodo.priority}
									class="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
								>
									<option value="low">🌱 Low Priority</option>
									<option value="medium">⚡ Medium Priority</option>
									<option value="high">🔥 High Priority</option>
								</select>
							</div>
							<button
								type="submit"
								class="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-medium"
							>
								Add Task
							</button>
						</div>
					</form>
				</div>

				<div class="flex flex-col gap-4">
					<!-- search box-->
					<div
						class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-white/20"
					>
						<div class="relative">
							<label for="search-todos" class="sr-only">Search todos</label>
							<input
								id="search-todos"
								bind:value={searchQuery}
								placeholder="Search todos..."
								class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
							/>
							{#if searchQuery}
								<button
									onclick={() => (searchQuery = '')}
									class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									✕
								</button>
							{/if}
						</div>
					</div>
					<!-- todo list -->
					<div
						class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-white/20"
					>
						<div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
							<h2 class="text-lg sm:text-xl font-bold text-gray-800">Your Tasks</h2>
							<div class="flex items-center gap-4 text-sm text-gray-600">
								<span class="bg-purple-100 px-2 py-1 rounded-full">
									{stats.total} Total
								</span>
								<span class="bg-yellow-100 px-2 py-1 rounded-full">
									{stats.incomplete} Pending
								</span>
								<span class="bg-green-100 px-2 py-1 rounded-full">
									{stats.completed} Done
								</span>
							</div>
						</div>

						{#if !isInitialized}
							<div class="text-center py-12 text-gray-500">
								<div class="flex animate-pulse space-x-4">
									<div class="flex-1 space-y-6 py-1">
										<div class="h-2 rounded bg-gray-200"></div>
										<div class="space-y-3">
											<div class="grid grid-cols-3 gap-4">
												<div class="col-span-2 h-2 rounded bg-gray-200"></div>
												<div class="col-span-1 h-2 rounded bg-gray-200"></div>
											</div>
											<div class="h-2 rounded bg-gray-200"></div>
										</div>
									</div>
								</div>
								<p class="mt-5 text-lg font-medium">Loading your todos...</p>
							</div>
						{:else if todos.length === 0}
							<div class="text-center py-12 text-gray-500">
								<p class="text-lg font-medium">No tasks yet!</p>
								<p class="text-sm mt-2">Add one above to get started.</p>
							</div>
						{:else if filteredTodos.length === 0 && searchQuery.trim()}
							<div class="text-center py-12 text-gray-500">
								<p class="text-lg font-medium">No tasks match your search!</p>
								<p class="text-sm mt-2">Try a different search term.</p>
							</div>
						{:else}
							<div class="space-y-3">
								{#each filteredTodos as todo (todo.id)}
									<div
										class="border-2 rounded-lg p-3 sm:p-4 transition-all hover:shadow-md w-full cursor-pointer {getPriorityColor(
											todo.priority
										)} {todo.completed ? 'opacity-60' : ''}"
										role="button"
										tabindex="0"
										title="Click '{todo.title}' to mark as complete"
										onclick={() => toggleComplete(todo.id)}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												toggleComplete(todo.id);
											}
										}}
									>
										{#if editingTodo && editingTodo.id === todo.id}
											<div class="space-y-3">
												<input
													bind:value={editingTodo.title}
													class="w-full font-medium bg-white border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
													placeholder="Task title..."
													onclick={(e) => e.stopPropagation()}
													onkeydown={(e) => e.stopPropagation()}
												/>
												<textarea
													bind:value={editingTodo.description}
													class="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 resize-none"
													rows="3"
													placeholder="Task description..."
													onclick={(e) => e.stopPropagation()}
													onkeydown={(e) => e.stopPropagation()}
												></textarea>
												<div class="flex flex-col sm:flex-row gap-2 sm:items-center">
													<input
														type="date"
														bind:value={editingTodo.dueDate}
														class="bg-white border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
														onclick={(e) => e.stopPropagation()}
														onkeydown={(e) => e.stopPropagation()}
													/>
													<select
														bind:value={editingTodo.priority}
														class="bg-white border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
														onclick={(e) => e.stopPropagation()}
														onkeydown={(e) => e.stopPropagation()}
													>
														<option value="low">🌱 Low Priority</option>
														<option value="medium">⚡ Medium Priority</option>
														<option value="high">🔥 High Priority</option>
													</select>
													<div class="flex gap-2">
														<button
															onclick={(e) => {
																e.stopPropagation();
																saveEdit();
															}}
															class="flex-1 sm:flex-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
														>
															Save
														</button>
														<button
															onclick={(e) => {
																e.stopPropagation();
																cancelEdit();
															}}
															class="flex-1 sm:flex-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
														>
															Cancel
														</button>
													</div>
												</div>
											</div>
										{:else}
											<div class="flex items-start gap-3">
												<input
													type="checkbox"
													checked={todo.completed}
													onchange={(e) => {
														e.stopPropagation();
														toggleComplete(todo.id, e);
													}}
													class="mt-1 w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
													title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
												/>
												<div class="flex-1 min-w-0">
													<div
														class="flex flex-col sm:flex-row sm:items-start justify-between gap-2"
													>
														<div class="flex-1 min-w-0">
															<h3
																class="font-medium text-gray-800 break-words"
																class:line-through={todo.completed}
															>
																{todo.title}
															</h3>
															{#if todo.description}
																<p
																	class="text-sm text-gray-600 mt-1 break-words"
																	class:line-through={todo.completed}
																>
																	{todo.description}
																</p>
															{/if}
															<div class="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
																{#if todo.dueDate}
																	<span class="bg-blue-100 px-2 py-1 rounded-full">
																		Due: {new Date(todo.dueDate).toLocaleDateString()}
																	</span>
																{/if}
																<span class="bg-gray-100 px-2 py-1 rounded-full capitalize">
																	{getPriorityEmoji(todo.priority)} Priority: {todo.priority}
																</span>
															</div>
														</div>
														<div class="flex gap-1 flex-shrink-0">
															<button
																onclick={(e) => {
																	e.stopPropagation();
																	editTodo(todo);
																}}
																class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
																title="Edit task"
															>
																Edit
															</button>
															<button
																onclick={(e) => deleteTodo(todo.id, e)}
																class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
																title="Delete task"
															>
																Delete
															</button>
														</div>
													</div>
												</div>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
