<script>
	import { browser } from '$app/environment';
	import { isLoggedIn } from '$lib/stores/authStore.js';
	import { fly } from 'svelte/transition';
	// import Header from './Header.svelte';
	// import { AuthService } from '$lib/services/authService.js';
	// import { TodoService } from '$lib/services/todoService.js';

	// for clearing localStorage when testing
	// if (browser) {
	// 	StorageService.clearTodos();
	// 	console.log('localStorage cleared!');
	// }

	// get data from props
	let { data } = $props();
</script>

<svelte:head>
	<title>Smart Todo App - Home</title>
	<script src="https://cdn.tailwindcss.com"></script>

	<meta name="description" content="A smart todo app built with SvelteKit and Tailwind CSS" />
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<!-- main landing page -->
<div
	class="min-h-screen flex items-center justify-center md:bg-blue-500 bg-[url('src/lib/images/bg.jpg')] bg-cover lg:blend-normal md:bg-blend-darken sm:bg-blend-overlay p-4"
>
	<div
		class="bg-white/55 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full border border-white/20 items-center text-center flex flex-col"
		in:fly={{ y: 30, duration: 600 }}
	>
		<!-- logo in header -->
		<div class="mb-8">
			<img src="src/lib/images/logo.jpg" alt="Logo" class="mx-auto" />
		</div>

		<h1 class="text-5xl font-bold text-white mb-8 drop-shadow-lg">Smart Todo App</h1>
		<p class="text-xl text-black/90 mb-8 max-w-md mx-auto">
			Welcome to jeiko todo-app for cast lms training!
		</p>

		<!-- navigation buttons -->
		<div class="space-y-4">
			{#if data.isLoggedIn && data.user}
				<a
					href={isLoggedIn ? '/todos' : '/login'}
					class="block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full text-center"
					aria-label="goto or come back"
				>
					Welcome Back {data.user.firstName}!
				</a>
				<form method="POST" action="/login?/logout" class="w-full">
					<button
						type="submit"
						class="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
						aria-label="Change account and logout"
					>
						Change Account
					</button>
				</form>
			{:else}
				<a
					href="/login"
					class="block bg-primary hover:bg-black/30 text-black px-8 py-4 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 transform hover:-translate-y-1"
					aria-label="switcheroo"
				>
					{#if data.isLoggedIn && data.user}
						Switch Account
					{:else}
						Login to Your Account
					{/if}
				</a>
			{/if}
		</div>
	</div>
</div>
