<script lang="ts">
	import type { ActionData } from './$types';
	import { goto } from '$app/navigation';
	import { KeyIcon, UserIcon } from 'lucide-svelte';

	let { form }: { form: ActionData } = $props();
</script>

<main class="min-h-screen flex items-center justify-center bg-base-200">
	<div class="card w-full max-w-md shadow-xl bg-base-100">
		<div class="card-body">
			<h1 class="text-2xl font-bold text-center text-primary">Welcome Back 👋</h1>
			<p class="text-sm text-center text-gray-500 mb-4">Login to continue</p>

			<form method="post" action="?/login"  class="space-y-4">
				<!-- Username -->
				<label class="input input-bordered w-full flex items-center gap-2">
						<UserIcon />
					<input type="text" name="username" placeholder="Username" class="grow" required />
				</label>

				<!-- Password -->
				<label class="input input-bordered w-full flex items-center gap-2">
					<KeyIcon />
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
