<script lang="ts">
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
				<label class="input input-bordered flex items-center gap-2">
					<svg class="h-5 w-5 opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H8m8 0l-8-4m0 0l8 4m-8-4v8m8-8v8" />
					</svg>
					<input type="email" name="email" placeholder="Email" bind:value={email} required class="grow" />
				</label>

				<!-- Username -->
				<label class="input input-bordered flex items-center gap-2">
					<svg class="h-5 w-5 opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4a4 4 0 110 8 4 4 0 010-8zM6 20a6 6 0 1112 0H6z" />
					</svg>
					<input type="text" name="username" placeholder="Username" bind:value={username} required class="grow" />
				</label>

				<!-- Role -->
				<select name="role" required class="select select-bordered w-full">
					<option disabled selected>Select Role</option>
					<option value="client">Client</option>
					<option value="therapist">Therapist</option>
				</select>

				<!-- Password -->
				<label class="input input-bordered flex items-center gap-2">
					<svg class="h-5 w-5 opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c.338 0 .675.034 1 .1a3.001 3.001 0 015.9.9v2.6a3.001 3.001 0 01-5.9.9A5.978 5.978 0 0112 16a5.978 5.978 0 01-1-.1 3.001 3.001 0 01-5.9-.9v-2.6a3.001 3.001 0 015.9-.9c.325-.066.662-.1 1-.1z" />
					</svg>
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