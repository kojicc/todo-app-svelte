import { writable } from 'svelte/store';

// create a writable store for toasts
export const toastStore = writable([]);

let nextId = 1;

// function to add a toast
export function showToast(message, type = 'success', duration = 4000) {
	const id = nextId++;
	const toast = {
		id,
		message,
		type,
		duration
	};

	// add to store
	toastStore.update((toasts) => [...toasts, toast]);

	// auto remove after duration
	setTimeout(() => {
		removeToast(id);
	}, duration);
}

// function to remove a toast
export function removeToast(id) {
	toastStore.update((toasts) => toasts.filter((toast) => toast.id !== id));
}

// function to clear all toasts
export function clearToasts() {
	toastStore.set([]);
}
