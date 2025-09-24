<script>
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	// import Header from './Header.svelte';
	// import { AuthService } from '$lib/services/authService.js';
	// import { TodoService } from '$lib/services/todoService.js';

	// for clearing localStorage when testing
	// if (browser) {
	// 	StorageService.clearTodos();
	// 	console.log('localStorage cleared!');
	// }
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
	<div class="text-center space-y-6" in:fly={{ y: 30, duration: 600 }}>
		<!-- logo in header -->
		<div class="mb-8">
			<img
				src="src/lib/images/logo.jpg"
				alt="Smart Todo App Logo"
				class="mx-auto h-24 w-24 rounded-full shadow-lg border-4 border-white/30"
			/>
		</div>

		<h1 class="text-5xl font-bold text-white mb-8 drop-shadow-lg">Smart Todo App</h1>
		<p class="text-xl text-white/90 mb-8 max-w-md mx-auto">
			Welcome to jeiko todo-app for cast lms training!
		</p>

		<!-- navigation buttons -->
		<div class="space-y-4">
			<a
				href="/login"
				class="block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
				aria-label="Go to login page"
			>
				Login to Your Account
			</a>
			<a
				href="/todos"
				class="block bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 transform hover:-translate-y-1"
				aria-label="Go to todos page if already logged in"
			>
				Go to Todos (if logged in)
			</a>
		</div>
	</div>
</div>
