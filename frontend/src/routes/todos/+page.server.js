import { fail, redirect } from '@sveltejs/kit';
import { generateShortId } from '../../lib/utils/idGenerator.js';
import { validateTodo } from '$lib/utils/todoHelpers.js';

// Load function to get todos for the logged-in user
export async function load({ cookies }) {
	const isLoggedIn = cookies.get('isLoggedIn');
	const userInfo = cookies.get('userInfo');

	// Redirect to login if not authenticated
	if (!isLoggedIn || isLoggedIn !== 'true' || !userInfo) {
		throw redirect(302, '/login');
	}

	// Parse user info
	let user;
	try {
		user = JSON.parse(userInfo);
	} catch (error) {
		throw redirect(302, '/login');
	}

	// Get user-specific todos from cookies (or initialize empty array)
	const todosKey = `todos_${user.id}`;
	const savedTodos = cookies.get(todosKey);
	let todos = [];

	if (savedTodos) {
		try {
			todos = JSON.parse(savedTodos);
		} catch (error) {
			console.error('Failed to parse todos:', error);
			todos = [];
		}
	}

	// Sort todos by priority and creation date
	todos.sort((a, b) => {
		const priorityOrder = { high: 3, medium: 2, low: 1 };
		const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
		if (priorityDiff !== 0) return priorityDiff;
		return new Date(b.createdAt) - new Date(a.createdAt);
	});

	// Calculate stats
	const stats = {
		total: todos.length,
		completed: todos.filter((todo) => todo.completed).length,
		incomplete: todos.filter((todo) => !todo.completed).length
	};

	return {
		todos,
		user,
		stats
	};
}

export const actions = {
	// Add new todo
	addTodo: async ({ request, cookies }) => {
		const userInfo = cookies.get('userInfo');
		if (!userInfo) {
			return fail(401, { error: 'Not authenticated' });
		}

		let user;
		try {
			user = JSON.parse(userInfo);
		} catch (error) {
			return fail(401, { error: 'Invalid user data' });
		}

		const data = await request.formData();
		const title = data.get('title');
		const description = data.get('description');
		const dueDate = data.get('dueDate');
		const priority = data.get('priority') || 'medium';

		if (!title) {
			return fail(400, {
				error: 'Title is required',
				title,
				description,
				dueDate,
				priority
			});
		}

		try {
			validateTodo({ title, description, dueDate, priority });
		} catch (error) {
			return fail(400, {
				error: error.message,
				title,
				description,
				dueDate,
				priority
			});
		}

		// Get existing todos
		const todosKey = `todos_${user.id}`;
		const savedTodos = cookies.get(todosKey);
		let todos = [];

		if (savedTodos) {
			try {
				todos = JSON.parse(savedTodos);
			} catch (error) {
				todos = [];
			}
		}

		// Create new todo
		const newTodo = {
			id: generateShortId(),
			title,
			description,
			dueDate,
			priority,
			completed: false,
			createdAt: new Date().toISOString()
		};

		todos.push(newTodo);

		// Save updated todos
		cookies.set(todosKey, JSON.stringify(todos), {
			path: '/',
			maxAge: 60 * 60 * 24 * 30, // 30 days
			httpOnly: false,
			secure: false
		});

		return { success: true };
	},

	// Update todo
	updateTodo: async ({ request, cookies }) => {
		const userInfo = cookies.get('userInfo');
		if (!userInfo) {
			return fail(401, { error: 'Not authenticated' });
		}

		let user;
		try {
			user = JSON.parse(userInfo);
		} catch (error) {
			return fail(401, { error: 'Invalid user data' });
		}

		const data = await request.formData();
		const id = data.get('id');
		const title = data.get('title');
		const description = data.get('description');
		const dueDate = data.get('dueDate');
		const priority = data.get('priority');

		if (!id) {
			return fail(400, { error: 'Todo ID is required' });
		}

		if (title !== null && !title) {
			return fail(400, { error: 'Title is required' });
		}

		// Get existing todos
		const todosKey = `todos_${user.id}`;
		const savedTodos = cookies.get(todosKey);
		let todos = [];

		if (savedTodos) {
			try {
				todos = JSON.parse(savedTodos);
			} catch (error) {
				return fail(500, { error: 'Failed to load todos' });
			}
		}

		// Find and update todo
		const todoIndex = todos.findIndex((todo) => todo.id === id);
		if (todoIndex === -1) {
			return fail(404, { error: 'Todo not found' });
		}

		const updates = {};
		if (title !== null) updates.title = title;
		if (description !== null) updates.description = description;
		if (dueDate !== null) updates.dueDate = dueDate;
		if (priority !== null) updates.priority = priority;
		updates.updatedAt = new Date().toISOString();

		todos[todoIndex] = { ...todos[todoIndex], ...updates };

		// Save updated todos
		cookies.set(todosKey, JSON.stringify(todos), {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			httpOnly: false,
			secure: false
		});

		return { success: true };
	},

	// Toggle todo completion
	toggleTodo: async ({ request, cookies }) => {
		const userInfo = cookies.get('userInfo');
		if (!userInfo) {
			return fail(401, { error: 'Not authenticated' });
		}

		let user;
		try {
			user = JSON.parse(userInfo);
		} catch (error) {
			return fail(401, { error: 'Invalid user data' });
		}

		const data = await request.formData();
		const id = data.get('id');

		if (!id) {
			return fail(400, { error: 'Todo ID is required' });
		}

		// Get existing todos
		const todosKey = `todos_${user.id}`;
		const savedTodos = cookies.get(todosKey);
		let todos = [];

		if (savedTodos) {
			try {
				todos = JSON.parse(savedTodos);
			} catch (error) {
				return fail(500, { error: 'Failed to load todos' });
			}
		}

		// Find and toggle todo
		const todoIndex = todos.findIndex((todo) => todo.id === id);
		if (todoIndex === -1) {
			return fail(404, { error: 'Todo not found' });
		}

		todos[todoIndex].completed = !todos[todoIndex].completed;
		todos[todoIndex].updatedAt = new Date().toISOString();

		// Save updated todos
		cookies.set(todosKey, JSON.stringify(todos), {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			httpOnly: false,
			secure: false
		});

		return { success: true };
	},

	// Delete todo
	deleteTodo: async ({ request, cookies }) => {
		const userInfo = cookies.get('userInfo');
		if (!userInfo) {
			return fail(401, { error: 'Not authenticated' });
		}

		let user;
		try {
			user = JSON.parse(userInfo);
		} catch (error) {
			return fail(401, { error: 'Invalid user data' });
		}

		const data = await request.formData();
		const id = data.get('id');

		if (!id) {
			return fail(400, { error: 'Todo ID is required' });
		}

		// Get existing todos
		const todosKey = `todos_${user.id}`;
		const savedTodos = cookies.get(todosKey);
		let todos = [];

		if (savedTodos) {
			try {
				todos = JSON.parse(savedTodos);
			} catch (error) {
				return fail(500, { error: 'Failed to load todos' });
			}
		}

		// Filter out the todo to delete
		const originalLength = todos.length;
		todos = todos.filter((todo) => todo.id !== id);

		if (todos.length === originalLength) {
			return fail(404, { error: 'Todo not found' });
		}

		// Save updated todos
		cookies.set(todosKey, JSON.stringify(todos), {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			httpOnly: false,
			secure: false
		});

		return { success: true };
	},

	// bulk toggle completion status for multiple todos
	bulkToggleComplete: async ({ request, cookies }) => {
		const isLoggedIn = cookies.get('isLoggedIn');
		const userInfo = cookies.get('userInfo');

		if (!isLoggedIn || isLoggedIn !== 'true' || !userInfo) {
			throw redirect(302, '/login');
		}

		let user;
		try {
			user = JSON.parse(userInfo);
		} catch (error) {
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const ids = data.getAll('ids');

		if (!ids || ids.length === 0) {
			return fail(400, { error: 'No todos selected' });
		}

		// get user's todos
		const todosKey = `todos_${user.id}`;
		const savedTodos = cookies.get(todosKey);
		let todos = [];

		if (savedTodos) {
			try {
				todos = JSON.parse(savedTodos);
			} catch (error) {
				return fail(500, { error: 'Failed to load todos' });
			}
		}

		// toggle completion for selected todos
		let updatedCount = 0;
		todos = todos.map((todo) => {
			if (ids.includes(todo.id)) {
				updatedCount++;
				return { ...todo, completed: !todo.completed };
			}
			return todo;
		});

		// save updated todos
		cookies.set(todosKey, JSON.stringify(todos), {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			httpOnly: false,
			secure: false
		});

		return { success: `Updated ${updatedCount} todo(s)` };
	},

	// bulk delete multiple todos
	bulkDelete: async ({ request, cookies }) => {
		const isLoggedIn = cookies.get('isLoggedIn');
		const userInfo = cookies.get('userInfo');

		if (!isLoggedIn || isLoggedIn !== 'true' || !userInfo) {
			throw redirect(302, '/login');
		}

		let user;
		try {
			user = JSON.parse(userInfo);
		} catch (error) {
			throw redirect(302, '/login');
		}

		const data = await request.formData();
		const ids = data.getAll('ids');

		if (!ids || ids.length === 0) {
			return fail(400, { error: 'No todos selected' });
		}

		// get user's todos
		const todosKey = `todos_${user.id}`;
		const savedTodos = cookies.get(todosKey);
		let todos = [];

		if (savedTodos) {
			try {
				todos = JSON.parse(savedTodos);
			} catch (error) {
				return fail(500, { error: 'Failed to load todos' });
			}
		}

		// remove selected todos
		const initialCount = todos.length;
		todos = todos.filter((todo) => !ids.includes(todo.id));
		const deletedCount = initialCount - todos.length;

		// save updated todos
		cookies.set(todosKey, JSON.stringify(todos), {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			httpOnly: false,
			secure: false
		});

		return { success: `Deleted ${deletedCount} todo(s)` };
	}
};
