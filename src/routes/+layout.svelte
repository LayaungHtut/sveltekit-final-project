<script lang="ts">
	import '../app.css';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';

	let { children } = $props();
</script>

<LoadingScreen />
{@render children()}
