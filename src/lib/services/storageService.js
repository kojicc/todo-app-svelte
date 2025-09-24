// storage service for localStorage operations
export class StorageService {
	static KEYS = {
		TODOS: 'svelte-todos',
		NEXT_ID: 'svelte-nextId' // keeping for backwards compatibility
	};

	// saves todos to localStorage
	static saveTodos(todos) {
		try {
			localStorage.setItem(this.KEYS.TODOS, JSON.stringify(todos));
		} catch (error) {
			console.error('Failed to save todos:', error);
		}
	}

	// loads todos from localStorage
	static loadTodos() {
		try {
			const saved = localStorage.getItem(this.KEYS.TODOS);
			return saved ? JSON.parse(saved) : [];
		} catch (error) {
			console.error('Failed to load todos:', error);
			return [];
		}
	}

	// clears all todos from localStorage
	static clearTodos() {
		try {
			localStorage.removeItem(this.KEYS.TODOS);
			localStorage.removeItem(this.KEYS.NEXT_ID); // clean up old format
		} catch (error) {
			console.error('Failed to clear todos:', error);
		}
	}
}
