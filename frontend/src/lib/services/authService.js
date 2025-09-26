// // kumuha ng user data from dummyjson api
// import { writable } from 'svelte/store';
// import {cookies} from 'svelte-cookie';

// const userInfo = writable(null);

// export class AuthService {
// 	// login function na tumatanggap ng credentials
// 	static async login(username, password) {
// 		if (!username || !password) {
// 			throw new Error('Please fill in all fields.');
// 		}

// 		try {
// 			const response = await fetch('https://dummyjson.com/auth/login', {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({ username, password })
// 			});

//             const data = await response.json();
//             cookies.set('svelte-userInfo', JSON.stringify(data));
//             cookies.set('svelte-isLoggedIn', 'true');

//             userInfo.set(data);


// 			if (!response.ok) {
// 				throw new Error(data.message || 'Invalid credentials');
// 			}

// 			return data; // return yung user info
// 		} catch (error) {
// 			throw error; // pass through yung error
// 		}
// 	}

// 	// logout function na walang parameters
// 	static logout() {
// 		// clear lang sa browser storage
// 		if (typeof window !== 'undefined') {
// 			localStorage.removeItem('svelte-userInfo');
// 			localStorage.setItem('svelte-isLoggedIn', 'false');
// 		}
// 	}

// 	// validate kung valid pa yung session
// 	static validateSession(userInfo) {
// 		return userInfo && userInfo.token && userInfo.username;
// 	}
// }
