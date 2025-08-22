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


<div class="form-container">
	<form onsubmit={handleSubmit}>
		<h2>Create an Account</h2>

		<div class="input-group">
			<label class="input validator">
				<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<g
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke-width="2.5"
						fill="none"
						stroke="currentColor"
					>
						<rect width="20" height="16" x="2" y="4" rx="2"></rect>
						<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
					</g>
				</svg>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					placeholder="Enter your email"
					required
				/>
			</label>
			<div class="validator-hint hidden">Enter valid email address</div>

			<label class="input validator">
				<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<g
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke-width="2.5"
						fill="none"
						stroke="currentColor"
					>
						<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
						<circle cx="12" cy="7" r="4"></circle>
					</g>
				</svg>
				<input
					type="text"
					id="username"
					name="username"
					bind:value={username}
					placeholder="Enter your username"
					required
				/>
			</label>

			{#if message && message.includes('username')}
				<div class="error">{message}</div>
			{/if}
		</div>

		<div class="input-group">
			<label class="input validator">
				<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<g
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke-width="2.5"
						fill="none"
						stroke="currentColor"
					>
						<path
							d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
						></path>
						<circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
					</g>
				</svg>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					placeholder="Enter your password"
					required
				/>
			</label>

			{#if message && message.includes('password')}
				<div class="error">{message}</div>
			{/if}
		</div>

		<button type="submit">Register</button>

		{#if message && !message.includes('username') && !message.includes('password')}
			<div class="message">{message}</div>
		{/if}

		<p class="message">
			Already have an account? <a href="/auth/lucia/login-page" class="link">Login here</a>
		</p>
	</form>
</div>

<style>
	.form-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: #f0f2f5;

		& form {
			background: white;
			padding: 30px;
			border-radius: 8px;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
			width: 100%;
			max-width: 400px;

			& h2 {
				text-align: center;
				margin-bottom: 20px;
				font-size: 24px;
				color: #333;
			}

			& .input-group {
				margin-bottom: 15px;

				& .error {
					color: red;
					font-size: 12px;
					margin-top: 5px;
				}
			}

			& button {
				width: 100%;
				padding: 12px;
				background-color: #5a9df0;
				color: white;
				border: none;
				border-radius: 4px;
				font-size: 16px;
				cursor: pointer;
				transition: background-color 0.3s ease;

				&:hover {
					background-color: #3a8fd4;
				}
			}

			& .message {
				text-align: center;
				margin-top: 10px;
				font-size: 14px;
				color: #e74c3c;
			}

			& .link {
				color: #5a9df0;
				text-decoration: none;
			}
		}
	}
</style>
