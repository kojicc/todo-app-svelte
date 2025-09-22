// storage service para sa localStorage operations
export class StorageService {
	static KEYS = {
		TODOS: 'svelte-todos',
		NEXT_ID: 'svelte-nextId' // keep lang for backwards compatibility
	};

	// save yung todos sa localStorage
	static saveTodos(todos) {
		try {
			localStorage.setItem(this.KEYS.TODOS, JSON.stringify(todos));
		} catch (error) {
			console.error('Failed to save todos:', error);
		}
	}

	// load yung mga todos from localStorage
	static loadTodos() {
		try {
			const saved = localStorage.getItem(this.KEYS.TODOS);
			return saved ? JSON.parse(saved) : [];
		} catch (error) {
			console.error('Failed to load todos:', error);
			return [];
		}
	}

	// clear lahat ng todos sa localStorage
	static clearTodos() {
		try {
			localStorage.removeItem(this.KEYS.TODOS);
			localStorage.removeItem(this.KEYS.NEXT_ID); // linisin yung old format
		} catch (error) {
			console.error('Failed to clear todos:', error);
		}
	}
}
