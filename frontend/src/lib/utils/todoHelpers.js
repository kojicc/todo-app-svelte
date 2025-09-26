// kumuha ng color classes para sa priority styling
export function getPriorityColor(priority) {
	const colors = {
		high: 'border-red-300 bg-red-50',
		medium: 'border-yellow-300 bg-yellow-50',
		low: 'border-green-300 bg-green-50'
	};
	return colors[priority] || colors.medium;
}

// emoji para sa priority, para visual lang
export function getPriorityEmoji(priority) {
	const emojis = {
		high: '🔥',
		medium: '⚡',
		low: '🌱'
	};
	return emojis[priority] || emojis.medium;
}

// sort yung todos by completion tapos priority
export function sortTodosByPriorityAndCompletion(todos) {
	const priorityOrder = { high: 3, medium: 2, low: 1 };
	return [...todos].sort((a, b) => {
		if (a.completed !== b.completed) {
			return a.completed - b.completed;
		}
		return priorityOrder[b.priority] - priorityOrder[a.priority];
	});
}

// filter todos kung may hinahanap na text
export function filterTodos(todos, searchQuery) {
	if (!searchQuery.trim()) return todos;
	return todos.filter(
		(todo) =>
			todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			todo.description.toLowerCase().includes(searchQuery.toLowerCase())
	);
}

// check kung valid yung todo data na input
export function validateTodo(todo) {
	if (!todo.title?.trim()) {
		throw new Error('Title is required');
	}

	const validPriorities = ['low', 'medium', 'high'];
	if (!validPriorities.includes(todo.priority)) {
		throw new Error('Invalid priority level');
	}
}
