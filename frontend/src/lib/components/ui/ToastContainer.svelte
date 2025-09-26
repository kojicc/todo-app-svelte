<script>
	import Toast from './Toast.svelte';
	import { toastStore, removeToast } from '$lib/stores/toastStore.js';
</script>

<!-- toast container -->
<div class="fixed top-4 right-4 z-50 space-y-2">
	{#each $toastStore as toast (toast.id)}
		<Toast
			message={toast.message}
			type={toast.type}
			duration={toast.duration}
			onClose={() => removeToast(toast.id)}
		/>
	{/each}
</div>