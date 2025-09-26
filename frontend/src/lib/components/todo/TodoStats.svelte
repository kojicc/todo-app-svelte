<script>
	import { fly } from 'svelte/transition';

	// props from parent component
	let { stats } = $props();

	// calculated values using derived state
	let completionPercentage = $derived(
		stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
	);
	let pendingTodos = $derived(stats.total - stats.completed);

	// gets completion status color
	function getCompletionColor(percentage) {
		if (percentage === 100) return 'text-green-600';
		if (percentage >= 70) return 'text-blue-600';
		if (percentage >= 40) return 'text-yellow-600';
		return 'text-red-600';
	}

	// gets progress bar color
	function getProgressBarColor(percentage) {
		if (percentage === 100) return 'bg-green-500';
		if (percentage >= 70) return 'bg-blue-500';
		if (percentage >= 40) return 'bg-yellow-500';
		return 'bg-red-500';
	}
</script>

<!-- todo statistics cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
	<!-- total todos counter -->
	<div
		class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 text-center hover:shadow-xl transition-all duration-300"
		in:fly={{ x: -20, duration: 300, delay: 100 }}
	>
		<div class="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
		<div class="text-gray-600 font-medium">Total Todos</div>
		<div class="text-sm text-gray-500 mt-1">
			{stats.total === 0
				? 'No todos yet'
				: stats.total === 1
					? '1 todo created'
					: `${stats.total} todos created`}
		</div>
	</div>

	<!-- completed todos counter -->
	<div
		class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 text-center hover:shadow-xl transition-all duration-300"
		in:fly={{ x: 0, duration: 300, delay: 200 }}
	>
		<div class="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
		<div class="text-gray-600 font-medium">Completed</div>
		<div class="text-sm text-gray-500 mt-1">
			{stats.completed === 0
				? 'Nothing completed yet'
				: stats.completed === 1
					? '1 todo done'
					: `${stats.completed} todos done`}
		</div>
	</div>

	<!-- pending todos counter -->
	<div
		class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 text-center hover:shadow-xl transition-all duration-300"
		in:fly={{ x: 20, duration: 300, delay: 300 }}
	>
		<div class="text-3xl font-bold text-orange-600 mb-2">{pendingTodos}</div>
		<div class="text-gray-600 font-medium">Pending</div>
		<div class="text-sm text-gray-500 mt-1">
			{pendingTodos === 0
				? 'All caught up!'
				: pendingTodos === 1
					? '1 todo remaining'
					: `${pendingTodos} todos remaining`}
		</div>
	</div>
</div>

<!-- completion progress card -->
{#if stats.total > 0}
	<div
		class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 mb-8 hover:shadow-xl transition-all duration-300"
		in:fly={{ y: 20, duration: 300, delay: 400 }}
	>
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Progress Overview</h3>
			<div class="text-2xl font-bold {getCompletionColor(completionPercentage)}">
				{completionPercentage}%
			</div>
		</div>

		<!-- progress bar -->
		<div class="w-full bg-gray-200 rounded-full h-3 mb-4">
			<div
				class="{getProgressBarColor(
					completionPercentage
				)} h-3 rounded-full transition-all duration-500 ease-out"
				style="width: {completionPercentage}%"
			></div>
		</div>

		<!-- progress details -->
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
			<div>
				<div class="font-medium text-gray-600">Total</div>
				<div class="text-lg font-bold text-blue-600">{stats.total}</div>
			</div>
			<div>
				<div class="font-medium text-gray-600">Done</div>
				<div class="text-lg font-bold text-green-600">{stats.completed}</div>
			</div>
			<div>
				<div class="font-medium text-gray-600">Pending</div>
				<div class="text-lg font-bold text-orange-600">{pendingTodos}</div>
			</div>
			<div>
				<div class="font-medium text-gray-600">Progress</div>
				<div class="text-lg font-bold {getCompletionColor(completionPercentage)}">
					{completionPercentage}%
				</div>
			</div>
		</div>

		<!-- motivational message -->
		<div class="mt-4 p-3 bg-gray-50 rounded-lg text-center">
			<p class="text-sm text-gray-600">
				{#if completionPercentage === 100}
					Congrats! Tapos ka na! wow pano yan
				{:else if completionPercentage >= 80}
					hmmm malapit na...
				{:else if completionPercentage >= 50}
					kalahati palang tho
				{:else if completionPercentage > 0}
					more pa! kaya mo yan!
				{:else}
					start time!
				{/if}
			</p>
		</div>
	</div>
{/if}
