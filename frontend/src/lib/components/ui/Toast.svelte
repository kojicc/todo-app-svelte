<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	// props
	let {
		message,
		type = 'success', // 'success', 'error', 'warning', 'info'
		duration = 4000,
		onClose
	} = $props();

	// auto dismiss after duration
	onMount(() => {
		const timer = setTimeout(() => {
			if (onClose) onClose();
		}, duration);

		return () => clearTimeout(timer);
	});

	// get toast styling based on type
	function getToastClasses(type) {
		const baseClasses = 'flex items-center p-4 rounded-lg shadow-lg border max-w-sm';
		
		switch (type) {
			case 'success':
				return `${baseClasses} bg-green-50 border-green-200 text-green-800`;
			case 'error':
				return `${baseClasses} bg-red-50 border-red-200 text-red-800`;
			case 'warning':
				return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800`;
			case 'info':
				return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`;
			default:
				return `${baseClasses} bg-gray-50 border-gray-200 text-gray-800`;
		}
	}

	// get icon for toast type
	function getIcon(type) {
		switch (type) {
			case 'success':
				return '✓';
			case 'error':
				return '✕';
			case 'warning':
				return '⚠';
			case 'info':
				return 'ℹ';
			default:
				return '';
		}
	}
</script>

<div
	class={getToastClasses(type)}
	in:fly={{ x: 300, duration: 300 }}
	out:fly={{ x: 300, duration: 200 }}
>
	<!-- icon -->
	<div class="flex-shrink-0 mr-3">
		<span class="text-lg font-bold">{getIcon(type)}</span>
	</div>
	
	<!-- message -->
	<div class="flex-1 text-sm font-medium">
		{message}
	</div>
	
	<!-- close button -->
	<button
		onclick={() => onClose && onClose()}
		class="flex-shrink-0 ml-3 text-lg hover:opacity-70 transition-opacity"
		aria-label="Close notification"
	>
		×
	</button>
</div>