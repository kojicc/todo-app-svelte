<script>
	import { browser } from '$app/environment';

	// if (browser) {
	// 	localStorage.removeItem('svelte-todos');
	// 	localStorage.removeItem('svelte-nextId');
	// 	localStorage.removeItem('svelte-isLoggedIn');
	// 	localStorage.removeItem('svelte-userInfo');
	// 	console.log('localStorage cleared!');
	// }

	let isLoggedIn = $state(false);
	let userInfo = $state(null);
	let username = $state('');
	let password = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);
	let searchQuery = $state('');

	//todo variables
	// interface Todo { id: number; title: string; description: string; dueDate: string; priority: 'low'|'medium'|'high'; completed: boolean; }
	let todos = $state([
		{
			id: 1,
			title: 'Learn Svelte 5 Runes',
			description: 'Master $state, $derived, and $effect runes',
			dueDate: '2025-09-20',
			priority: 'high',
			completed: false
		},
		{
			id: 2,
			title: 'Build Todo App',
			description: 'Create a fully functional todo application with login',
			dueDate: '2025-09-25',
			priority: 'medium',
			completed: false
		},
		{
			id: 3,
			title: 'Study TypeScript',
			description: 'Learn type definitions and interfaces',
			dueDate: '2025-09-18',
			priority: 'low',
			completed: true
		},
		{
			id: 4,
			title: 'Practice Responsive Design',
			description: 'Make apps work on mobile and desktop',
			dueDate: '2025-09-22',
			priority: 'medium',
			completed: false
		}
	]);
	let newTodo = $state({
		title: '',
		description: '',
		dueDate: '',
		priority: 'medium'
	});
	let editingTodo = $state(null);
	let nextId = $state(5);

	let sortedbyPriorityandCompletionTodos = $derived.by(() => {
		const priorityOrder = { high: 3, medium: 2, low: 1 };
		return [...todos].sort((a, b) => {
			if (a.completed !== b.completed) {
				return a.completed - b.completed;
			}
			return priorityOrder[b.priority] - priorityOrder[a.priority];
		});
	});

	let incompleteCount = $derived.by(() => {
		return todos.filter((todo) => !todo.completed).length;
	});

	let completedCount = $derived.by(() => {
		return todos.filter((todo) => todo.completed).length;
	});

	let totalCount = $derived.by(() => {
		return todos.length;
	});

	//to load from local storage on initial render
	$effect(() => {
		if (browser) {
			const userName = userInfo?.username;
			const savedTodos = userName ? localStorage.getItem(`svelte-todos-${userName}`) : null;
			const savedNextId = userName ? localStorage.getItem(`svelte-nextId-${userName}`) : null;
			const savedLoginState = localStorage.getItem('svelte-isLoggedIn');
			const savedUserInfo = localStorage.getItem('svelte-userInfo');

			if (savedTodos && userName) {
				todos = JSON.parse(savedTodos);
			} else if (userName) {
				todos = [...todos];
			}

			if (savedNextId && userName) {
				nextId = parseInt(savedNextId);
			} else if (userName) {
				nextId = 4;
			}

			if (savedLoginState === 'true' && savedUserInfo) {
				isLoggedIn = true;
				userInfo = JSON.parse(savedUserInfo);
			}
		}
	});

	//to set sa local storage when todos, nextId, isLoggedIn, or userInfo changes
	$effect(() => {
		if (browser) {
			const userName = userInfo?.username;

			if (userName) {
				localStorage.setItem(`svelte-todos-${userName}`, JSON.stringify(todos));
				localStorage.setItem(`svelte-nextId-${userName}`, nextId.toString());
			}

			localStorage.setItem('svelte-isLoggedIn', isLoggedIn.toString());
			if (userInfo) {
				localStorage.setItem('svelte-userInfo', JSON.stringify(userInfo));
			}
		}
	});

	let filteredTodos = $derived.by(() => {
		if (!searchQuery.trim()) return sortedbyPriorityandCompletionTodos;
		return sortedbyPriorityandCompletionTodos.filter(
			(todo) =>
				todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				todo.description.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	//login functions
	async function handleLogin() {
		if (!username || !password) {
			errorMessage = 'Please fill in all fields.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const response = await fetch('https://dummyjson.com/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Invalid credentials');
			}

			userInfo = data;
			isLoggedIn = true;
		} catch (error) {
			errorMessage = error.message;
		} finally {
			isLoading = false;
		}
	}

	function logout() {
		isLoggedIn = false;
		userInfo = null;
		username = '';
		password = '';
		errorMessage = '';
		todos = [];
		nextId = 1;

		if (browser) {
			localStorage.removeItem('svelte-userInfo');
			localStorage.setItem('svelte-isLoggedIn', 'false');
		}
	}

	//todo functions

	function addTodo() {
		try {
			if (newTodo.title.trim() === '') {
				alert('Title is required');
				return;
			}
			todos = [...todos, { id: nextId, ...newTodo, completed: false }];
			nextId += 1;
			newTodo = { title: '', description: '', dueDate: '', priority: 'medium' };
		} catch (error) {
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
			if (!editingTodo || editingTodo.title.trim() === '') {
				alert('Title is required');
				return;
			}
			todos = todos.map((todo) => (todo.id === editingTodo.id ? editingTodo : todo));
			editingTodo = null;
		} catch (error) {
			console.error('Error saving edit:', error);
		}
	}

	function cancelEdit() {
		editingTodo = null;
	}

	function toggleComplete(id) {
		try {
			todos = todos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			);
		} catch (error) {
			console.error('Error toggling completion:', error);
		}
	}

	function deleteTodo(id) {
		try {
			if (id === undefined) {
				throw new Error('Invalid todo id for deletion');
			}
			todos = todos.filter((todo) => todo.id !== id);
		} catch (error) {
			console.error('Error deleting todo:', error);
		}
	}

	function getPriorityColor(priority) {
		const colors = {
			high: 'border-red-300 bg-red-50',
			medium: 'border-yellow-300 bg-yellow-50',
			low: 'border-green-300 bg-green-50'
		};
		return colors[priority] || colors.medium;
	}
</script>

<svelte:head>
	<title>{isLoggedIn ? 'Smart Todo App' : 'Login'}</title>
	<script src="https://cdn.tailwindcss.com"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div
	class="min-h-screen flex items-center justify-center md:bg-blue-500 bg-[url('src/lib/images/bg.jpg')] bg-cover lg:blend-normal md:bg-blend-darken sm:bg-blend-overlay p-4"
>
	{#if !isLoggedIn}
		<!-- login form -->
		<div>
			<div
				class="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full border border-white/20"
			>
				<div class="text-center mb-6">
					<img src="src/lib/images/logo.jpg" alt="Logo" class="mx-auto" />
				</div>
				<h2 class="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back!</h2>

				{#if errorMessage}
					<div class="mb-4 text-red-600 text-center bg-red-50 p-3 rounded-lg">
						{errorMessage}
					</div>
				{/if}

				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleLogin();
					}}
					class="space-y-4"
				>
					<div>
						<label for="username" class="block text-sm font-medium text-gray-700 mb-1">
							Username
						</label>
						<input
							type="text"
							id="username"
							bind:value={username}
							placeholder="Try: emilys"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label for="password" class="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							placeholder="Try: emilyspass"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
					>
						{isLoading ? 'Signing In...' : 'Sign In'}
					</button>
				</form>

				<div class="mt-6 text-sm text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
					<p><strong>Test:</strong> emilys / emilyspass</p>
					<p>
						You can use any user's credentials from
						<a href="https://dummyjson.com/users">
							<span style="color:blue"> dummyjson.com/users </span></a
						>. Tokens are returned in the response and set as cookies.
					</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="max-w-6xl mx-auto space-y-4 sm:space-y-6">
			<!-- Header -->
			<div
				class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-white/20"
			>
				<div class="flex flex-col md:flex-row sm:items-center justify-between gap-4">
					<div class="flex items-center gap-3 sm:gap-4">
						<img
							src={userInfo.image ||
								`https://dummyjson.com/icon/${userInfo.firstName?.toLowerCase() || 'user'}/128`}
							alt="Profile"
							class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-purple-200"
						/>

						<div>
							<h1 class="text-xl sm:text-2xl font-bold text-gray-800">
								Welcome, {userInfo.firstName}! 👋
							</h1>
							<p class="text-sm sm:text-base text-gray-600">
								{incompleteCount} Incomplete • {completedCount} Completed
							</p>
						</div>
					</div>
					<button
						onclick={logout}
						class="w-full sm:w-auto bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
					>
						Logout
					</button>
				</div>
			</div>

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
									<option value="low">Low Priority</option>
									<option value="medium">Medium Priority</option>
									<option value="high">High Priority</option>
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
									{totalCount} Total
								</span>
								<span class="bg-yellow-100 px-2 py-1 rounded-full">
									{incompleteCount} Pending
								</span>
								<span class="bg-green-100 px-2 py-1 rounded-full">
									{completedCount} Done
								</span>
							</div>
						</div>

						{#if todos.length === 0}
							<!-- No todos at all -->
							<div class="text-center py-12 text-gray-500">
								<div class="text-4xl mb-4">🎉</div>
								<p class="text-lg font-medium">No tasks yet!</p>
								<p class="text-sm mt-2">Add one above to get started.</p>
							</div>
						{:else if filteredTodos.length === 0 && searchQuery.trim()}
							<!-- Have todos but search returned nothing -->
							<div class="text-center py-12 text-gray-500">
								<div class="text-4xl mb-4"></div>
								<p class="text-lg font-medium">No tasks match your search!</p>
								<p class="text-sm mt-2">Try a different search term.</p>
							</div>
						{:else}
							<!-- Show todos - either all todos (no search) or filtered results -->
							<div class="space-y-3">
								{#each searchQuery.trim() ? filteredTodos : sortedbyPriorityandCompletionTodos as todo (todo.id)}
									<div
										class="border-2 rounded-lg p-3 sm:p-4 transition-all hover:shadow-md w-full {getPriorityColor(
											todo.priority
										)} {todo.completed ? 'opacity-60' : ''}"
										role="button"
										tabindex="0"
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
															💾 Save
														</button>
														<button
															onclick={(e) => {
																e.stopPropagation();
																cancelEdit();
															}}
															class="flex-1 sm:flex-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
														>
															❌ Cancel
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
														toggleComplete(todo.id);
													}}
													class="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500"
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
																	Priority: {todo.priority}
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
																✏️
															</button>
															<button
																onclick={(e) => {
																	e.stopPropagation();
																	deleteTodo(todo.id);
																}}
																class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
																title="Delete task"
															>
																🗑️
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
	{/if}
</div>
