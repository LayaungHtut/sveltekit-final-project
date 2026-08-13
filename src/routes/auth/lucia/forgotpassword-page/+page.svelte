<script lang="ts">
	import { Mail } from 'lucide-svelte';
	import logoImage from '$lib/assets/images/Doppelganger.png';

	let email = $state('');
	let message = $state('');
	let success = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		const res = await fetch('/auth/lucia/forgotpassword-page', {
			method: 'POST',
			body: new FormData(event.target as HTMLFormElement)
		});
		const data = await res.json();
		if (data.success) {
			success = true;
			message = 'Check your email for the password reset link.';
		} else {
			message = 'Error sending reset link. Please try again.';
		}
	}
</script>

<main class="bg-base-200 flex min-h-screen items-center justify-center p-4">
	<div class="card bg-base-100 w-full max-w-md shadow-xl">
		<div class="card-body">
			<div class="mb-2 flex flex-col items-center gap-2">
				<img src={logoImage} alt="SerenityHaven logo" class="h-16 w-16 rounded-full" />
				<h2 class="text-primary text-center text-2xl font-bold">Forgot Password</h2>
				<p class="text-center text-sm text-gray-500">Enter your email to receive a reset link</p>
			</div>

			<form method="POST" onsubmit={submit} class="space-y-4">
				<label class="input input-bordered flex w-full items-center gap-2">
					<Mail class="h-4 w-4 opacity-60" />
					<input
						type="email"
						name="email"
						placeholder="Email"
						bind:value={email}
						required
						class="grow"
					/>
				</label>

				{#if message}
					<p class="text-center text-sm {success ? 'text-success' : 'text-error'}">{message}</p>
				{/if}

				<div class="form-control mt-4 space-y-2">
					<button type="submit" class="btn btn-primary w-full">Send Reset Link</button>
					<a href="/auth/lucia/login-page" class="link link-primary block text-center"
						>Back to login</a
					>
				</div>
			</form>
		</div>
	</div>
</main>
