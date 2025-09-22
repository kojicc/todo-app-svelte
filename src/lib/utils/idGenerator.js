// gumawa ng full UUID v4 identifier
export function generateId() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// mas maikli na ID lang, easier to read
export function generateShortId() {
	return Math.random().toString(36).substr(2, 9);
}
