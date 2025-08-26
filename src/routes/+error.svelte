<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
import {
		goBackRoute,
		goToRoute
	} from '$lib/utils/sveltekit/router.sveltekit.util';

	function handleGoToHome() {
		goToRoute('/');
	}
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
	<h1 class="text-5xl font-bold text-gray-800 mb-4">404 Not Found</h1>
	<p class="text-gray-600 mb-8">The page <strong>{$page.url.pathname}</strong> does not exist.</p>
	<div class="flex gap-4">
		<button
			onclick={handleGoToHome}
			class="px-6 py-2 rounded-2xl bg-blue-600 text-white shadow hover:bg-blue-700 transition"
		>
			Home
		</button>
		<button
			onclick={goBackRoute}
			class="px-6 py-2 rounded-2xl bg-gray-400 text-white shadow hover:bg-gray-500 transition"
		>
			Go Back
		</button>
	</div>
</div>