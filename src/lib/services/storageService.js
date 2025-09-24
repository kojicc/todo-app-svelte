<<<<<<< Updated upstream
// storage service para sa localStorage operations
export class StorageService {
	static KEYS = {
		TODOS: 'svelte-todos',
		NEXT_ID: 'svelte-nextId' // keep lang for backwards compatibility
	};

	// save yung todos sa localStorage
=======
// storage service for localStorage operations
export class StorageService {
	static KEYS = {
		TODOS: 'svelte-todos',
		NEXT_ID: 'svelte-nextId' // keeping for backwards compatibility
	};

	// saves todos to localStorage
>>>>>>> Stashed changes
	static saveTodos(todos) {
		try {
			localStorage.setItem(this.KEYS.TODOS, JSON.stringify(todos));
		} catch (error) {
			console.error('Failed to save todos:', error);
		}
	}

<<<<<<< Updated upstream
	// load yung mga todos from localStorage
=======
	// loads todos from localStorage
>>>>>>> Stashed changes
	static loadTodos() {
		try {
			const saved = localStorage.getItem(this.KEYS.TODOS);
			return saved ? JSON.parse(saved) : [];
		} catch (error) {
			console.error('Failed to load todos:', error);
			return [];
		}
	}

<<<<<<< Updated upstream
	// clear lahat ng todos sa localStorage
	static clearTodos() {
		try {
			localStorage.removeItem(this.KEYS.TODOS);
			localStorage.removeItem(this.KEYS.NEXT_ID); // linisin yung old format
=======
	// clears all todos from localStorage
	static clearTodos() {
		try {
			localStorage.removeItem(this.KEYS.TODOS);
			localStorage.removeItem(this.KEYS.NEXT_ID); // clean up old format
>>>>>>> Stashed changes
		} catch (error) {
			console.error('Failed to clear todos:', error);
		}
	}
}
