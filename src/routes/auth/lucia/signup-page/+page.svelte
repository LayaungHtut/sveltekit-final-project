<script lang="ts">
	import { Key, Mail, User } from "lucide-svelte";

	let username = $state('');
	let password = $state('');
	let email = $state('');
	let message = $state('');

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);
		const response = await fetch('/auth/lucia/signup-page', {
			method: 'POST',
			body: formData
		});

		if (response.redirected) {
			window.location.href = response.url;
			return;
		}

		try {
			const data = await response.json();
			message = data.message || 'Email or username already exists';
		} catch {
			message = 'An error occurred';
		}
	};
</script>
<main class="min-h-screen flex items-center justify-center bg-base-200">
	<div class="card w-full max-w-md shadow-xl bg-base-100">
		<div class="card-body">
			<h2 class="text-2xl font-bold text-center text-primary">Create an Account</h2>
			<p class="text-sm text-center text-gray-500 mb-4">Join us and get started</p>

			<form onsubmit={handleSubmit} class="space-y-4">
				<!-- Email -->
				<label class="input w-full input-bordered flex items-center gap-2">
					<Mail />
					<input type="email" name="email" placeholder="Email" bind:value={email} required class="grow" />
				</label>

				<!-- Username -->
				<label class="input w-full input-bordered flex items-center gap-2">
					<User />
					<input type="text" name="username" placeholder="Username" bind:value={username} required class="grow" />
				</label>

				<!-- Role -->
				<select name="role" required class="select select-bordered w-full">
					<option disabled selected>Select Role</option>
					<option value="client">Client</option>
					<option value="therapist">Therapist</option>
				</select>

				<!-- Password -->
				<label class="input input-bordered  w-full flex items-center gap-2">
					<Key />
					<input type="password" name="password" placeholder="Password" bind:value={password} required class="grow" />
				</label>

				<!-- Error message -->
				{#if message}
					<p class="text-error text-sm text-center">{message}</p>
				{/if}

				<!-- Actions -->
				<div class="form-control mt-4 space-y-2">
					<button type="submit" class="btn btn-primary w-full">Register</button>
					<p class="text-center text-sm">
						Already have an account?
						<a href="/auth/lucia/login-page" class="link link-primary">Login here</a>
					</p>
				</div>
			</form>
		</div>
	</div>
</main>