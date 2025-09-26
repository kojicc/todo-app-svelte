<script>
	import { fly } from 'svelte/transition';

	// props from parent component
	let { user, stats } = $props();

	// state for mobile menu toggle
	let isMobileMenuOpen = $state(false);

	// toggles mobile menu visibility
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	// closes mobile menu when clicking outside or on links
	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}
</script>

<!-- responsive navigation bar -->
<header class="bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center py-4">
			<!-- left side - user info and logo -->
			<div class="flex items-center space-x-4">
				<!-- user avatar -->
				<img
					src={user.image || 'src/lib/images/logo.jpg'}
					alt="User avatar"
					class="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-blue-200"
				/>
				<div class="hidden sm:block">
					<h1 class="text-xl sm:text-2xl font-bold text-gray-900">Smart Todo App</h1>
					<p class="text-xs sm:text-sm text-gray-600">
						Welcome, {user.firstName}
						{user.lastName}!
					</p>
				</div>
				<!-- mobile title -->
				<div class="sm:hidden">
					<h1 class="text-lg font-bold text-gray-900">Smart Todo</h1>
				</div>
			</div>

			<!-- right side - desktop menu -->
			<div class="hidden md:flex items-center space-x-4">
				<!-- completion stats -->
				<div class="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
					<span class="font-medium">{stats.completed}/{stats.total}</span> completed
				</div>
				<!-- logout button -->
				<form method="POST" action="/login?/logout">
					<button
						type="submit"
						class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
						aria-label="Change account and logout"
					>
						Change Account
					</button>
				</form>
				<a
					href="/"
					onclick={closeMobileMenu}
					class="block hover:bg-gray-100 rounded-lg transition-colors bg-blue-600 text-white px-4 py-2 text-center font-medium"
				>
					Home
				</a>
			</div>

			<!-- mobile menu button -->
			<div class="md:hidden">
				<button
					onclick={toggleMobileMenu}
					class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
					aria-label="Toggle mobile menu"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if isMobileMenuOpen}
							<!-- close icon -->
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						{:else}
							<!-- hamburger icon -->
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							></path>
						{/if}
					</svg>
				</button>
			</div>
		</div>

		<!-- mobile menu dropdown -->
		{#if isMobileMenuOpen}
			<div
				class="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm"
				in:fly={{ y: -10, duration: 200 }}
				out:fly={{ y: -10, duration: 200 }}
			>
				<div class="px-4 py-4 space-y-4">
					<!-- mobile user info -->
					<div class="flex items-center space-x-3 pb-3 border-b border-gray-200">
						<img
							src={user.image || 'src/lib/images/logo.jpg'}
							alt="User avatar"
							class="h-8 w-8 rounded-full object-cover border border-blue-200"
						/>
						<div>
							<p class="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
							<p class="text-xs text-gray-600">{user.email || 'Smart Todo User'}</p>
						</div>
					</div>

					<!-- mobile completion stats -->
					<div class="bg-gray-50 px-3 py-2 rounded-lg">
						<p class="text-sm text-gray-600">
							<span class="font-medium">{stats.completed}/{stats.total}</span> todos completed
						</p>
						<div class="w-full bg-gray-200 rounded-full h-2 mt-2">
							<div
								class="bg-green-500 h-2 rounded-full transition-all duration-300"
								style="width: {stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%"
							></div>
						</div>
					</div>

					<!-- mobile navigation links -->
					<div class="space-y-2">
						<!-- <a 
							href="/todos" 
							onclick={closeMobileMenu}
							class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
						>
							My Todos
						</a> -->
						<a
							href="/"
							onclick={closeMobileMenu}
							class="block hover:bg-gray-100 rounded-lg transition-colors bg-blue-600 text-white px-4 py-2 text-center font-medium"
						>
							Home
						</a>
					</div>

					<!-- mobile logout button -->
					<form method="POST" action="/login?/logout" class="pt-3 border-t border-gray-200">
						<button
							type="submit"
							onclick={closeMobileMenu}
							class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
							aria-label="Change account and logout"
						>
							Change Account
						</button>
					</form>
				</div>
			</div>
		{/if}
	</div>
</header>

<!-- backdrop for mobile menu -->
{#if isMobileMenuOpen}
	<button
		class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden border-none p-0 cursor-default"
		onclick={closeMobileMenu}
		onkeydown={(e) => e.key === 'Escape' && closeMobileMenu()}
		aria-label="Close mobile menu"
		in:fly={{ opacity: 0, duration: 200 }}
		out:fly={{ opacity: 0, duration: 200 }}
	></button>
{/if}
