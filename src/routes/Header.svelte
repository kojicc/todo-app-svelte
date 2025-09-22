<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { incompleteCount = 0, completedCount = 0, isInitialized = false } = $props();
</script>

<header class="bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20">
	<div class="max-w-6xl mx-auto px-4 py-3">
		<div class="flex flex-col md:flex-row sm:items-center justify-between gap-4">
			<div class="flex items-center gap-3 sm:gap-4">
				<div>
					<h1 class="text-xl sm:text-2xl font-bold text-gray-800">Todo App</h1>
					<p class="text-sm sm:text-base text-gray-600">
						{#if isInitialized}
							{incompleteCount} Incomplete • {completedCount} Completed
						{:else}
							Loading...
						{/if}
					</p>
				</div>
			</div>
		</div>
	</div>
</header>
