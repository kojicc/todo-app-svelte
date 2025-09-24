<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { fly, slide } from 'svelte/transition';

	// get data and form from props
	let { data, form } = $props();

	// state variables for forms and editing
	let newTodo = $state({
		title: '',
		description: '',
		dueDate: '',
		priority: 'medium'
	});
	let editingTodo = $state(null);
	let isAddingTodo = $state(false);
	let isLoading = $state(false);

	// handles logout by redirecting to login page
	function handleLogout() {
		return async ({ result, update }) => {
			if (result.type === 'redirect') {
				goto(result.location);
			}
			await update();
		};
	}

	// handles adding new todo by resetting form on success
	function handleAddTodo() {
		return async ({ result, update }) => {
			isLoading = false;
			if (result.type === 'success') {
				// reset form when successful
				newTodo = { title: '', description: '', dueDate: '', priority: 'medium' };
				isAddingTodo = false;
			}
			await update();
		};
	}

	// handles updating existing todo by closing edit mode
	function handleUpdateTodo() {
		return async ({ result, update }) => {
			isLoading = false;
			if (result.type === 'success') {
				editingTodo = null; // close edit mode on success
			}
			await update();
		};
	}

	// handles toggle completion status
	function handleToggleTodo() {
		return async ({ result, update }) => {
			await update();
		};
	}

	// handles delete todo confirmation
	function handleDeleteTodo() {
		return async ({ result, update }) => {
			await update();
		};
	}

	// starts editing mode for todo
	function startEdit(todo) {
		editingTodo = { ...todo };
	}

	// cancels editing mode
	function cancelEdit() {
		editingTodo = null;
	}

	// gets priority color classes based on priority level
	// high priority is red
	// medium priority is yellow
	// low priority is green
	// default gray
	function getPriorityClass(priority) {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'low':
				return 'bg-green-100 text-green-800 border-green-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	// gets priority select option colors
	function getPrioritySelectClass(priority) {
		switch (priority) {
			case 'high':
				return 'text-red-600 bg-red-50';
			case 'medium':
				return 'text-yellow-600 bg-yellow-50';
			case 'low':
				return 'text-green-600 bg-green-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	}

	// formats date to readable format
	function formatDate(dateString) {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString();
	}

	// toggles todo completion by clicking anywhere on todo
	function toggleTodoCompletion(todoId) {
		// don't trigger when in edit mode
		if (editingTodo && editingTodo.id === todoId) return;

		// find and submit the form to toggle completion
		const form = document.querySelector(`form[data-todo-id="${todoId}"]`);
		if (form) {
			const submitButton = form.querySelector('button[type="submit"]');
			if (submitButton) {
				submitButton.click();
			}
		}
	}
</script>

<svelte:head>
	<title>Smart Todo App - {data.user.firstName} {data.user.lastName}</title>
	<script src="https://cdn.tailwindcss.com"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="min-h-screen bg-[url('src/lib/images/bg.jpg')] bg-cover bg-center bg-fixed">
	<div class="min-h-screen bg-blue-400/70 backdrop-blur-sm">
		<!-- navigation bar at the top -->
		<header class="bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div class="flex justify-between items-center">
					<div class="flex items-center space-x-4">
						<!-- user avatar using user image if available -->
						<img
							src={data.user.image || 'src/lib/images/logo.jpg'}
							alt="User avatar"
							class="h-12 w-12 rounded-full object-cover border-2 border-blue-200"
						/>
						<div>
							<h1 class="text-2xl font-bold text-gray-900">Smart Todo App</h1>
							<p class="text-sm text-gray-600">
								Welcome, {data.user.firstName}
								{data.user.lastName}!
							</p>
						</div>
					</div>
					<div class="flex items-center space-x-4">
						<!-- shows completion stats -->
						<div class="text-sm text-gray-600">
							<span class="font-medium">{data.stats.completed}/{data.stats.total}</span> completed
						</div>
						<!-- logout button to change account -->
						<form method="POST" action="/login?/logout">
							<button
								type="submit"
								class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
								aria-label="Change account and logout"
							>
								Change Account
							</button>
						</form>
						<a href="/"
							class="bg-blue-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
							aria-label="Go to home page"
						>
							Home
						</a>
					</div>
				</div>
			</div>
		</header>

		<!-- main content area -->
		<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- cards showing todo statistics -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<!-- total todos counter -->
				<div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Total Todos</p>
							<p class="text-3xl font-bold text-blue-600">{data.stats.total}</p>
						</div>
						<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
							<svg
								class="w-6 h-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- completed todos counter -->
				<div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Completed</p>
							<p class="text-3xl font-bold text-green-600">{data.stats.completed}</p>
						</div>
						<div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
							<svg
								class="w-6 h-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- remaining todos counter -->
				<div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Remaining</p>
							<p class="text-3xl font-bold text-orange-600">{data.stats.incomplete}</p>
						</div>
						<div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
							<svg
								class="w-6 h-6 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- button to add new todo -->
			<div class="mb-6">
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

			<!-- form for adding new todo -->
			{#if isAddingTodo}
				<div
					class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 mb-6"
					in:fly={{ y: -20, duration: 300 }}
					out:slide={{ duration: 300 }}
				>
					<h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Todo</h3>

					{#if form?.error}
						<div class="mb-4 text-red-600 bg-red-50 p-3 rounded-lg">
							{form.error}
						</div>
					{/if}

					<form method="POST" action="?/addTodo" use:enhance={handleAddTodo} class="space-y-4">
						<div>
							<label for="title" class="block text-sm font-medium text-gray-700 mb-2">Title *</label
							>
							<input
								type="text"
								id="title"
								name="title"
								bind:value={newTodo.title}
								required
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter todo title"
							/>
						</div>

						<div>
							<label for="description" class="block text-sm font-medium text-gray-700 mb-2"
								>Description</label
							>
							<textarea
								id="description"
								name="description"
								bind:value={newTodo.description}
								rows="3"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter todo description"
							></textarea>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label for="dueDate" class="block text-sm font-medium text-gray-700 mb-2"
									>Due Date</label
								>
								<input
									required
									type="date"
									id="dueDate"
									name="dueDate"
									bind:value={newTodo.dueDate}
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>

							<div>
								<label for="priority" class="block text-sm font-medium text-gray-700 mb-2"
									>Priority</label
								>
								<select
									id="priority"
									name="priority"
									bind:value={newTodo.priority}
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent {getPrioritySelectClass(
										newTodo.priority
									)}"
								>
									<option value="low" class="text-green-600 bg-green-50">🟢 Low Priority</option>
									<option value="medium" class="text-yellow-600 bg-yellow-50"
										>🟡 Medium Priority</option
									>
									<option value="high" class="text-red-600 bg-red-50">🔴 High Priority</option>
								</select>
							</div>
						</div>

						<div class="flex space-x-4">
							<button
								type="submit"
								disabled={isLoading}
								class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
								aria-label="Add new todo item"
							>
								{isLoading ? 'Adding...' : 'Add Todo'}
							</button>
							<button
								type="button"
								onclick={() => (isAddingTodo = false)}
								class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
								aria-label="Cancel adding todo"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			{/if}

			<!-- list of all todos -->
			<div class="space-y-4">
				{#each data.todos as todo (todo.id)}
					<div
						class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden {!editingTodo ||
						editingTodo.id !== todo.id
							? 'cursor-pointer hover:shadow-xl transition-all duration-200'
							: ''}"
						in:fly={{ y: 20, duration: 300 }}
						out:slide={{ duration: 300 }}
						onclick={(e) => {
							// only toggle if we're not in edit mode and didn't click a button/form
							if (
								(!editingTodo || editingTodo.id !== todo.id) &&
								!e.target.closest('button') &&
								!e.target.closest('form')
							) {
								e.preventDefault();
								toggleTodoCompletion(todo.id);
							}
						}}
						onkeydown={(e) => {
							// handle keyboard activation (Enter or Space)
							if (
								(e.key === 'Enter' || e.key === ' ') &&
								(!editingTodo || editingTodo.id !== todo.id)
							) {
								e.preventDefault();
								toggleTodoCompletion(todo.id);
							}
						}}
						role="button"
						tabindex="0"
						aria-label={!editingTodo || editingTodo.id !== todo.id
							? `Click to ${todo.completed ? 'mark as incomplete' : 'mark as complete'}: ${todo.title}`
							: undefined}
					>
						{#if editingTodo && editingTodo.id === todo.id}
							<!-- editing mode for todo -->
							<div class="p-6">
								<form
									method="POST"
									action="?/updateTodo"
									use:enhance={handleUpdateTodo}
									class="space-y-4"
								>
									<input type="hidden" name="id" value={todo.id} />

									<div>
										<label for="edit-title" class="block text-sm font-medium text-gray-700 mb-2"
											>Title *</label
										>
										<input
											type="text"
											id="edit-title"
											name="title"
											bind:value={editingTodo.title}
											required
											class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>

									<div>
										<label
											for="edit-description"
											class="block text-sm font-medium text-gray-700 mb-2">Description</label
										>
										<textarea
											id="edit-description"
											name="description"
											bind:value={editingTodo.description}
											rows="3"
											class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										></textarea>
									</div>

									<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label for="edit-dueDate" class="block text-sm font-medium text-gray-700 mb-2"
												>Due Date</label
											>
											<input
												type="date"
												id="edit-dueDate"
												name="dueDate"
												bind:value={editingTodo.dueDate}
												class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>

										<div>
											<label
												for="edit-priority"
												class="block text-sm font-medium text-gray-700 mb-2">Priority</label
											>
											<select
												id="edit-priority"
												name="priority"
												bind:value={editingTodo.priority}
												class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent {getPrioritySelectClass(
													editingTodo.priority
												)}"
											>
												<option value="low" class="text-green-600 bg-green-50"
													>🟢 Low Priority</option
												>
												<option value="medium" class="text-yellow-600 bg-yellow-50"
													>🟡 Medium Priority</option
												>
												<option value="high" class="text-red-600 bg-red-50">🔴 High Priority</option
												>
											</select>
										</div>
									</div>

									<div class="flex space-x-4">
										<button
											type="submit"
											disabled={isLoading}
											class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
											aria-label="Save todo changes"
										>
											{isLoading ? 'Saving...' : 'Save Changes'}
										</button>
										<button
											type="button"
											onclick={cancelEdit}
											class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
											aria-label="Cancel editing todo"
										>
											Cancel
										</button>
									</div>
								</form>
							</div>
						{:else}
							<!-- viewing mode for todo -->
							<div class="p-6">
								<div class="flex items-start justify-between">
									<div class="flex items-start space-x-4 flex-1">
										<!-- toggle completion checkbox -->
										<form
											method="POST"
											action="?/toggleTodo"
											use:enhance={handleToggleTodo}
											data-todo-id={todo.id}
										>
											<input type="hidden" name="id" value={todo.id} />
											<button
												type="submit"
												class="mt-1 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center {todo.completed
													? 'bg-green-500 border-green-500'
													: 'hover:border-green-500'} transition-colors"
												aria-label={todo.completed
													? 'Mark todo as incomplete'
													: 'Mark todo as complete'}
											>
												{#if todo.completed}
													<svg
														class="w-3 h-3 text-white"
														fill="currentColor"
														viewBox="0 0 20 20"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clip-rule="evenodd"
														></path>
													</svg>
												{/if}
											</button>
										</form>

										<div class="flex-1">
											<div class="flex items-center space-x-2 mb-2">
												<h3
													class="text-lg font-semibold text-gray-900 {todo.completed
														? 'line-through text-gray-500'
														: ''}"
												>
													{todo.title}
												</h3>
												<span
													class="px-2 py-1 text-xs font-medium rounded-full border {getPriorityClass(
														todo.priority
													)}"
												>
													{todo.priority.toUpperCase()}
												</span>
											</div>

											{#if todo.description}
												<p class="text-gray-600 mb-2 {todo.completed ? 'line-through' : ''}">
													{todo.description}
												</p>
											{/if}

											<!-- todo meta information -->
											<div class="flex items-center space-x-4 text-sm text-gray-500">
												{#if todo.dueDate}
													<span class="flex items-center space-x-1">
														<svg
															class="w-4 h-4"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
															aria-hidden="true"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
															></path>
														</svg>
														<span>Due: {formatDate(todo.dueDate)}</span>
													</span>
												{/if}
												<span class="flex items-center space-x-1">
													<svg
														class="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden="true"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
														></path>
													</svg>
													<span>Created: {formatDate(todo.createdAt)}</span>
												</span>
											</div>

											<p class="text-xs text-gray-400 mt-2 italic">
												Click anywhere to {todo.completed
													? 'mark as incomplete'
													: 'mark as complete'}
											</p>
										</div>
									</div>

									<!-- action buttons for edit and delete -->
									<div class="flex items-center space-x-2 ml-4">
										<button
											aria-label="Edit todo item"
											onclick={() => startEdit(todo)}
											class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
											title="Edit todo"
										>
											<svg
												class="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												></path>
											</svg>
										</button>

										<form
											method="POST"
											action="?/deleteTodo"
											use:enhance={handleDeleteTodo}
											class="inline"
										>
											<input type="hidden" name="id" value={todo.id} />
											<button
												aria-label="Delete todo item"
												type="submit"
												onclick={() => confirm('Are you sure you want to delete this todo?')}
												class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
												title="Delete todo"
											>
												<svg
													class="w-4 h-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
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
				{:else}
					<!-- shown when no todos exist -->
					<div
						class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20 text-center"
					>
						<svg
							class="w-16 h-16 text-gray-400 mx-auto mb-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							></path>
						</svg>
						<h3 class="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
						<p class="text-gray-600 mb-4">Get started by adding your first todo!</p>
						<button
							onclick={() => (isAddingTodo = true)}
							class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
							aria-label="Add your first todo item"
						>
							Add Your First Todo
						</button>
					</div>
				{/each}
			</div>
		</main>
	</div>
</div>
