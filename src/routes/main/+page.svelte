<script lang="ts">
	import { goto } from '$app/navigation';
	import { Menu, Moon, Search, Sun } from 'lucide-svelte';
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { form, data }: { form: ActionData; data: PageServerData } = $props();

</script>

<div class="mainbd">
	<div class="navbar bg-base-100 shadow-sm">
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
					<Menu />
				</div>
				<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
					<li><a href="/">Homepage</a></li>
					<li><a href="/">Dashboard</a></li>
					<li><a href="/">Chats</a></li>
					<li><a href="/main/notes">Notes</a></li>
					<li><a href="/main/Calender">Calender</a></li>
				</ul>
			</div>
		</div>
		<div class="navbar-center">
			<a
				href="/"
				class="btn btn-ghost text-xl"
				style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;"
				>MindSpace</a
			>
		</div>
		<div class="navbar-end">
			<button aria-label="Search" class="btn btn-ghost btn-circle">
				<Search />
			</button>
			<button aria-label="Notifications" class="btn btn-ghost btn-circle">
				<div class="indicator">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
						/>
					</svg>
					<span class="badge badge-xs badge-primary indicator-item"></span>
				</div>
			</button>

			{#if data.user}
				<p>{data.user.username} ({data.user.role})</p>
			
			<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>
				{/if}

			<label class="swap swap-rotate">
				<!-- this hidden checkbox controls the state -->
				<input type="checkbox" class="theme-controller" value="abyss" hidden />

				<!-- sun icon -->
				<svg
					class="swap-off h-10 w-10 fill-current"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
					/>
				</svg>

				<!-- moon icon -->
				<svg
					class="swap-on h-10 w-10 fill-current"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
					/>
				</svg>
			</label>
		</div>
	</div>
	<!-- name of each tab group should be unique -->
	<div class="tabs tabs-lift tabs-bottom" >
		<input
			type="radio"
			name="my_tabs_5"
			class="tab"
			aria-label="Home"
			style="background-color: #60885E; color:antiquewhite;"
			checked
		/>
		<div class="tab-content p-0">
			<div
				class="hero min-h-screen"
				style="background-image: url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp);"
			>
				<div class="hero-overlay"></div>
				<div class="hero-content text-neutral-content text-center">
					<div class="max-w-md">
						<h1 class="mb-5 text-5xl font-bold">Hello there</h1>
						<p class="mb-5">
							Welcome to MindSpace. Here, you can explore your thoughts, track your feelings, and
							take small steps toward a calmer mind
						</p>
						<button class="btn btn-primary">Get Started</button>
					</div>
				</div>
			</div>
		</div>

		<input
			type="radio"
			name="my_tabs_5"
			class="tab"
			aria-label="About"
			style="background-color: #60885E; color:antiquewhite;"
		/>
		<div class="tab-content p-0">
			<div class="hero bg base-200 min-h-screen">
				<div class="hero-content flex-col text-white lg:flex-row">
					<img
						src="/src/lib/assets/images/workspace.jpg"
						class="max-w-xs rounded-lg shadow-2xl"
						alt="chill"
					/>
					<div>
						<h1 class="text-5xl font-bold">Your Space for Healing</h1>
						<p class="py-6">
							Our mission is to bridge the gap between therapists and patients. We provide a safe,
							accessible space where people can explore therapy options, connect with qualified
							professionals, and take steps toward better mental well-being.
						</p>
						<button onclick={() => goto('/main/mainComponents/Articles')} class="btn btn-primary"
							>Read More</button
						>
					</div>
				</div>
			</div>
		</div>

		<input
			type="radio"
			name="my_tabs_5"
			class="tab"
			aria-label="Sign up"
			style="background-color: #60885E; color:antiquewhite;"
		/>
		<div class="tab-content p-0">
			<div class="hero min-h-screen">
				<div class="hero-content flex-col  lg:flex-row-reverse">
					<div class="text-center lg:text-left">
						<h1 class="text-5xl font-bold">Login now!</h1>
						<p class="py-6">
							Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
							exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
						</p>
					</div>
					<div class="card w-full max-w-sm shrink-0 shadow-2xl">
						<div class="card-body">
							{#if data.user}

									<p>Logged in as {data.user.username}</p>
									 <p>Role: {data.user.role}</p>
									 <p>Email: {data.user.email}</p>
									
								{:else}
									<form method="post" action="?/login" use:enhance>
										<label class="input validator">
											<svg
												class="h-[1em] opacity-50"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
											>
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
											<svg
												class="h-[1em] opacity-50"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
											>
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

										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<span
											role="button"
											tabindex="0"
											onclick={() => goto('auth/lucia/forgot-password')}>Forgot Password?</span
										>
										<!-- <p style="color: red">{form?.errors ?? ''}</p> -->
										<button>Login</button>
										<button onclick={() => goto('auth/lucia/register')}>Register</button>
									</form>
								{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-2">
		<aside>
			<p>Copyright © {new Date().getFullYear()} - All right reserved by MindSpace UIT</p>
		</aside>
	</footer>
</div>
