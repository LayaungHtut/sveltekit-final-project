<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { goto } from '$app/navigation';

	let { form }: { form: ActionData } = $props();
</script>


<div class="page-container">
	<form method="post" action="?/login" use:enhance>
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
			<input name="username" />
		</label>

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
			<input type="password" name="password" />
		</label>

		<button type="button" class="link-button" onclick={() => goto('/auth/lucia/forgotpassword-page')}>
			Forgot Password?
		</button>
		<p style="color: red">{form?.message ?? ''}</p>
		<button>Login</button>
		<button onclick={() => goto('/auth/lucia/signup-page')}>Register</button>
	</form>
</div>

<style>
	.page-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: linear-gradient(to right, #e0eafc, #cfdef3);
		padding: 20px;

		& form {
			background-color: #ffffff;
			border-radius: 12px;
			box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
			padding: 40px 30px;
			max-width: 400px;
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: 20px;
			animation: fadeIn 0.5s ease-in-out;

			& p {
				text-align: center;
				color: #e74c3c;
				font-size: 14px;
				margin-top: 10px;
			}

			& button {
				padding: 12px;
				border: none;
				border-radius: 6px;
				background-color: #5a9df0;
				color: white;
				font-size: 15px;
				cursor: pointer;
				transition: background-color 0.3s ease;

				&:hover {
					background-color: #3a8fd4;
				}
			}
		}
	}

	button + button {
		background-color: #6c63ff;

		&:hover {
			background-color: #5848d9;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
