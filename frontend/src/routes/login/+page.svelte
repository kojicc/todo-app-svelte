<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	// use $props() for Svelte 5 runes mode
	let { form } = $props();

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);

	// handles login form submission with loading states
	function handleLogin({ formData, cancel }) {
		isLoading = true;

		return async ({ result, update }) => {
			isLoading = false;
			if (result.type === 'redirect') {
				goto(result.location);
			}
			await update();
		};
	}

	// check if already logged in
	$effect(() => {
		if (browser) {
			// check cookies for login state
			const cookies = document.cookie.split(';').reduce((acc, cookie) => {
				const [key, value] = cookie.trim().split('=');
				acc[key] = decodeURIComponent(value || '');
				return acc;
			}, {});

			if (cookies.isLoggedIn === 'true' && cookies.userInfo) {
				goto('/todos');
			}
		}
	});
</script>

<svelte:head>
	<title>{form?.incorrect ? 'Login Error' : 'Login'}</title>
	<script src="https://cdn.tailwindcss.com"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div
	class="min-h-screen flex items-center justify-center md:bg-blue-500 bg-[url('src/lib/images/bg.jpg')] bg-cover lg:blend-normal md:bg-blend-darken sm:bg-blend-overlay p-4"
>
	<div
		class="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full border border-white/20"
	>
		<div class="flex justify-end mb-4">
			<a
				href="/"
				class="bg-blue-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
				aria-label="Go to home page"
			>
				← Go to Home Page
			</a>
		</div>
		<div class="text-center mb-6">
			<img src="src/lib/images/logo.jpg" alt="Logo" class="mx-auto" />
		</div>
		<h2 class="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back!</h2>

		{#if form?.missing}
			<div class="mb-4 text-red-600 text-center bg-red-50 p-3 rounded-lg">
				Please fill in all fields.
			</div>
		{/if}

		{#if form?.incorrect}
			<div class="mb-4 text-red-600 text-center bg-red-50 p-3 rounded-lg">
				Invalid username or password.
			</div>
		{/if}

		{#if form?.error}
			<div class="mb-4 text-red-600 text-center bg-red-50 p-3 rounded-lg">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-4" action="?/login" use:enhance={handleLogin}>
			<div>
				<label for="username" class="block text-sm font-medium text-gray-700 mb-2">
					Username
				</label>
				<input
					type="text"
					id="username"
					name="username"
					bind:value={username}
					placeholder="Try: emilys"
					required
					disabled={isLoading}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					title="Enter your username here"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
					Password
				</label>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					placeholder="Try: emilyspass"
					required
					disabled={isLoading}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					title="Enter your password here"
				/>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				class="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				title="Click to login to your account"
			>
				{isLoading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>

		<div class="mt-6 text-sm text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
			<p class="font-medium mb-2">Demo Accounts:</p>
			<p><strong>emilys</strong> / emilyspass</p>
			<p><strong>michaelw</strong> / michaelwpass</p>
			<p><strong>sophiab</strong> / sophiabpass</p>
		</div>
	</div>
</div>
