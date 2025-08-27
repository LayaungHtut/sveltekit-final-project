<script lang="ts">
	import type { ActionData } from './$types';
	import { goto } from '$app/navigation';

	let { form }: { form: ActionData } = $props();
</script>

<main class="min-h-screen flex items-center justify-center bg-base-200">
	<div class="card w-full max-w-md shadow-xl bg-base-100">
		<div class="card-body">
			<h1 class="text-2xl font-bold text-center text-primary">Welcome Back 👋</h1>
			<p class="text-sm text-center text-gray-500 mb-4">Login to continue</p>

			<form method="post" action="?/login"  class="space-y-4">
				<!-- Username -->
				<label class="input input-bordered flex items-center gap-2">
					<svg class="h-5 w-5 opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1119.07 3.87M12 7v.01M12 12v.01M12 17h.01" />
					</svg>
					<input type="text" name="username" placeholder="Username" class="grow" required />
				</label>

				<!-- Password -->
				<label class="input input-bordered flex items-center gap-2">
					<svg class="h-5 w-5 opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c.338 0 .675.034 1 .1a3.001 3.001 0 015.9.9v2.6a3.001 3.001 0 01-5.9.9A5.978 5.978 0 0112 16a5.978 5.978 0 01-1-.1 3.001 3.001 0 01-5.9-.9v-2.6a3.001 3.001 0 015.9-.9c.325-.066.662-.1 1-.1z" />
					</svg>
					<input type="password" name="password" placeholder="Password" class="grow" required />
				</label>

				<!-- Forgot password -->
				<div class="flex justify-end">
					<button type="button" class="link link-primary text-sm"
						onclick={() => goto('/auth/lucia/forgotpassword-page')}>
						Forgot password?
					</button>
				</div>

				<!-- Error message -->
				{#if form?.message}
					<p class="text-error text-center text-sm">{form.message}</p>
				{/if}

				<!-- Actions -->
				<div class="form-control mt-4 space-y-2">
					<button type="submit" class="btn btn-primary w-full">Login</button>
					<button type="button" class="btn btn-outline w-full"
						onclick={() => goto('/auth/lucia/signup-page')}>
						Register
					</button>
				</div>
			</form>
		</div>
	</div>
</main>
