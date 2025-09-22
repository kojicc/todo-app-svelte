import { generateShortId } from '../utils/idGenerator.js';
import { validateTodo } from '../utils/todoHelpers.js';

// todo service para sa lahat ng todo operations
export class TodoService {
	// gumawa ng new todo with auto generated ID
	static createTodo(todoData) {
		validateTodo(todoData);

		return {
			id: generateShortId(),
			...todoData,
			completed: false,
			createdAt: new Date().toISOString()
		};
	}

	// update yung existing todo
	static updateTodo(todos, id, updates) {
		if (updates.title !== undefined) {
			validateTodo(updates);
		}

		return todos.map((todo) =>
			todo.id === id ? { ...todo, ...updates, updatedAt: new Date().toISOString() } : todo
		);
	}

	// delete todo by ID lang
	static deleteTodo(todos, id) {
		if (!id) {
			throw new Error('Invalid todo ID for deletion');
		}
		return todos.filter((todo) => todo.id !== id);
	}

	// toggle yung completion status ng todo
	static toggleCompletion(todos, id) {
		return this.updateTodo(todos, id, {
			completed: !todos.find((todo) => todo.id === id)?.completed
		});
	}

	// compute yung stats ng todos para sa dashboard
	static getStats(todos) {
		return {
			total: todos.length,
			completed: todos.filter((todo) => todo.completed).length,
			incomplete: todos.filter((todo) => !todo.completed).length
		};
	}
}
