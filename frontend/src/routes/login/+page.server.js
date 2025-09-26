import { log } from 'console';
import { fail, redirect } from '@sveltejs/kit';
import { isLoggedIn, userInfo } from '$lib/stores/authStore.js';
// login action that accepts user credentials

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return fail(400, {
				error: 'Please fill in all fields.',
				username
			});
		}

		try {
			const response = await fetch('https://dummyjson.com/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			const userData = await response.json();

			if (!response.ok) {
				return fail(400, {
					error: userData.message || 'Invalid credentials',
					username
				});
			}

			// Set cookies for session management
			cookies.set('isLoggedIn', 'true', {
				path: '/',
				maxAge: 60 * 60 * 24 * 7, // 7 days
				httpOnly: false, // Allow client-side access
				secure: false // Set to true in production with HTTPS
			});

			cookies.set('userInfo', JSON.stringify(userData), {
				path: '/',
				maxAge: 60 * 60 * 24 * 7, // 7 days
				httpOnly: false, // Allow client-side access
				secure: false // Set to true in production with HTTPS
			});

			// redirect to todos page after successful login
			throw redirect(302, '/todos');
		} catch (error) {
			if (error.status === 302) {
				// re-throw redirect errors
				throw error;
			}
			return fail(500, {
				error: error.message || 'An error occurred',
				username
			});
		}
	},

	logout: async ({ cookies }) => {
		// Clear cookies
		cookies.delete('isLoggedIn', { path: '/' });
		cookies.delete('userInfo', { path: '/' });

		return { success: true };
	}
};
