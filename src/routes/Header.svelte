<script>
	let {
		isLoggedIn = false,
		userInfo = null,
		onLogout = () => {},
		incompleteCount = 0,
		completedCount = 0
	} = $props();
</script>

<header class="bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20">
	<div class="max-w-6xl mx-auto px-4 py-3">
		{#if isLoggedIn && userInfo}
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
							Welcome, {userInfo.firstName}!
						</h1>
						<p class="text-sm sm:text-base text-gray-600">
							{incompleteCount} Incomplete • {completedCount} Completed
						</p>
					</div>
				</div>
				<button
					onclick={onLogout}
					class="w-full sm:w-auto bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
				>
					Logout
				</button>
			</div>
		{:else}
			<div class="text-center">
				<h1 class="text-2xl font-bold text-gray-800">Welcome to Your Todo App</h1>
				<p class="text-sm text-gray-600">Please log in to manage your tasks</p>
			</div>
		{/if}
	</div>
</header>
