<script>
	// props from parent component
	let { size = 'medium', color = 'blue', text = 'Loading...' } = $props();

	// size configurations
	function getSizeClass(size) {
		switch (size) {
			case 'small':
				return 'w-4 h-4';
			case 'large':
				return 'w-8 h-8';
			case 'xl':
				return 'w-12 h-12';
			default: // medium
				return 'w-6 h-6';
		}
	}

	// color configurations
	function getColorClass(color) {
		switch (color) {
			case 'red':
				return 'text-red-600';
			case 'green':
				return 'text-green-600';
			case 'yellow':
				return 'text-yellow-600';
			case 'gray':
				return 'text-gray-600';
			default: // blue
				return 'text-blue-600';
		}
	}
</script>

<!-- loading spinner component -->
<div class="flex items-center justify-center space-x-2">
	<!-- animated spinner -->
	<svg
		class="{getSizeClass(size)} {getColorClass(color)} animate-spin"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
	>
		<circle
			class="opacity-25"
			cx="12"
			cy="12"
			r="10"
			stroke="currentColor"
			stroke-width="4"
		></circle>
		<path
			class="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path>
	</svg>
	
	<!-- loading text -->
	{#if text}
		<span class="text-sm {getColorClass(color)} font-medium">
			{text}
		</span>
	{/if}
</div>