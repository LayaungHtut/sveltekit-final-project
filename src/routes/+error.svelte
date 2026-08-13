<script>
	import { page } from '$app/stores';
	import { goBackRoute, goToRoute } from '$lib/utils/sveltekit/router.sveltekit.util';

	function handleGoToHome() {
		goToRoute('/');
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center">
	<h1 class="mb-4 text-5xl font-bold text-gray-800">404 Not Found</h1>
	<p class="mb-8 text-gray-600">The page <strong>{$page.url.pathname}</strong> does not exist.</p>
	<div class="flex gap-4">
		<button
			onclick={handleGoToHome}
			class="rounded-2xl bg-blue-600 px-6 py-2 text-white shadow transition hover:bg-blue-700"
		>
			Home
		</button>
		<button
			onclick={goBackRoute}
			class="rounded-2xl bg-gray-400 px-6 py-2 text-white shadow transition hover:bg-gray-500"
		>
			Go Back
		</button>
	</div>
</div>
