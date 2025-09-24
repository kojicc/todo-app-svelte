
import { fail, redirect } from '@sveltejs/kit';
export async function load({ cookies }) {
    const isLoggedIn = cookies.get('isLoggedIn');
    const userInfo = cookies.get('userInfo');

    // if (!isLoggedIn || isLoggedIn !== 'true' || !userInfo) {
    //     throw redirect(302, '/login');
    // }

   
    let user;
    try {
        user = JSON.parse(userInfo);
    } catch (error) {
        // throw redirect(302, '/login');
        user = null;
        console.error('Error parsing user info from cookies:', error);
    }

  
    return {
			user,
			isLoggedIn
		};
}

