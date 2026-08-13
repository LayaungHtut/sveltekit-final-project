<script lang="ts">
	import type { ActionData } from './$types';
	import { goto } from '$app/navigation';
	import { KeyIcon, UserIcon } from 'lucide-svelte';
	import logoImage from '$lib/assets/images/Doppelganger.png';

	let { form }: { form: ActionData } = $props();
</script>

<main class="bg-base-200 flex min-h-screen items-center justify-center p-4">
	<div class="card bg-base-100 w-full max-w-md shadow-xl">
		<div class="card-body">
			<div class="mb-2 flex flex-col items-center gap-2">
				<img src={logoImage} alt="SerenityHaven logo" class="h-16 w-16 rounded-full" />
				<h1 class="text-primary text-center text-2xl font-bold">Welcome Back 👋</h1>
				<p class="text-center text-sm text-gray-500">Login to continue</p>
			</div>

			<form method="post" action="?/login" class="space-y-4">
				<!-- Username -->
				<label class="input input-bordered flex w-full items-center gap-2">
					<UserIcon class="h-4 w-4 opacity-60" />
					<input type="text" name="username" placeholder="Username" class="grow" required />
				</label>

				<!-- Password -->
				<label class="input input-bordered flex w-full items-center gap-2">
					<KeyIcon class="h-4 w-4 opacity-60" />
					<input type="password" name="password" placeholder="Password" class="grow" required />
				</label>

				<!-- Forgot password -->
				<div class="flex justify-end">
					<button
						type="button"
						class="link link-primary text-sm"
						onclick={() => goto('/auth/lucia/forgotpassword-page')}
					>
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
					<button
						type="button"
						class="btn btn-outline w-full"
						onclick={() => goto('/auth/lucia/signup-page')}
					>
						Register
					</button>
				</div>
			</form>
		</div>
	</div>
</main>
