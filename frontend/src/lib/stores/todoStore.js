import { writable } from 'svelte/store';

const todos = writable([]);
const nextId = writable(1);

export { todos, nextId };
