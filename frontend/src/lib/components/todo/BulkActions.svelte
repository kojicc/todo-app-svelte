<script>
	import { enhance } from '$app/forms';
	import { fly, slide, scale } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import { showToast } from '$lib/stores/toastStore.js';

	// props from parent component
	let { selectedTodos, selectedTodosData, onClearSelection } = $props();

	// state for bulk actions
	let isBulkLoading = $state(false);

	// derived values
	let selectedCount = $derived(selectedTodos.length);
	let hasSelection = $derived(selectedCount > 0);

	// check kung ano type ng selected todos - completed ba or hindi
	let selectedType = $derived.by(() => {
		if (selectedTodosData.length === 0) return null;
		return selectedTodosData[0].completed ? 'completed' : 'incomplete';
	});

	// handles bulk completion toggle
	function handleBulkComplete() {
		const count = selectedCount; // capture count before clearing
		return async ({ result, update }) => {
			isBulkLoading = false;
			await update();

			if (result.type === 'success') {
				// Show success toast
				showToast(`${count} todo${count === 1 ? '' : 's'} updated!`, 'success');
				// Clear selection after successful bulk action
				if (onClearSelection) onClearSelection();
			} else if (result.type === 'failure') {
				// Show error toast
				showToast('Failed to update todos', 'error');
			}
		};
	}

	// handles bulk delete
	function handleBulkDelete() {
		const count = selectedCount; // capture count before clearing
		return async ({ result, update }) => {
			isBulkLoading = false;
			await update();

			if (result.type === 'success') {
				// Show success toast
				showToast(`${count} todo${count === 1 ? '' : 's'} deleted!`, 'success');
				// Clear selection after successful bulk action
				if (onClearSelection) onClearSelection();
			} else if (result.type === 'failure') {
				// Show error toast
				showToast('Failed to delete todos', 'error');
			}
		};
	}
</script>

{#if hasSelection}
	<!-- bulk actions toolbar -->
	<div
		class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 sticky top-20 z-40 transform"
		in:fly={{ y: -20, duration: 400, easing: backOut }}
		out:slide={{ duration: 300, easing: quintOut }}
	>
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<!-- selection info - mas descriptive -->
			<div class="flex items-center gap-4">
				<span class="text-sm font-medium text-blue-800">
					{selectedCount}
					{selectedType} todo{selectedCount === 1 ? '' : 's'} selected
				</span>
			</div>

			<!-- bulk actions -->
			<div class="flex flex-wrap gap-2">
				<!-- bulk complete -->
				<form
					method="POST"
					action="?/bulkToggleComplete"
					use:enhance={handleBulkComplete}
					class="inline"
				>
					{#each selectedTodos as todoId}
						<input type="hidden" name="ids" value={todoId} />
					{/each}
					<button
						type="submit"
						disabled={isBulkLoading}
						class="px-4 py-2 {selectedType === 'completed'
							? 'bg-yellow-600 hover:bg-yellow-700'
							: 'bg-green-600 hover:bg-green-700'} disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
						title={selectedType === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
					>
						{#if selectedType === 'completed'}
							<!-- undo icon para sa completed todos -->
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
								></path>
							</svg>
							{isBulkLoading ? 'Processing...' : 'Mark Incomplete'}
						{:else}
							<!-- check icon para sa incomplete todos -->
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								></path>
							</svg>
							{isBulkLoading ? 'Processing...' : 'Mark Complete'}
						{/if}
					</button>
				</form>

				<!-- bulk delete -->
				<form method="POST" action="?/bulkDelete" use:enhance={handleBulkDelete} class="inline">
					{#each selectedTodos as todoId}
						<input type="hidden" name="ids" value={todoId} />
					{/each}
					<button
						type="submit"
						disabled={isBulkLoading}
						onclick={() => confirm(`Are you sure you want to delete ${selectedCount} todo(s)?`)}
						class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
						title="Delete selected todos"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							></path>
						</svg>
						{isBulkLoading ? 'Deleting...' : 'Delete Selected'}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
