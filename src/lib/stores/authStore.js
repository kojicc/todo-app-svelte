import { writable } from 'svelte/store';

const userInfo = writable(null);
const isLoggedIn = writable(false);

export { userInfo, isLoggedIn };
