<script lang="ts">
	import { navigating } from '$app/state';
	import logoImage from '$lib/assets/images/Doppelganger.png';

	const visible = $derived(navigating !== null);
	const route = $derived(navigating?.to?.route.id ?? null);
</script>

{#if visible}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-base-100" role="status" aria-live="polite">
		<div class="flex flex-col items-center gap-6">
			<img
				src={logoImage}
				alt="SerenityHaven"
				class="h-24 w-24 animate-bounce opacity-90"
			/>
			<span class="loading loading-spinner loading-lg text-primary"></span>
			{#if route}
				<p class="text-sm opacity-60">Loading {route}</p>
			{/if}
		</div>
	</div>
{/if}
