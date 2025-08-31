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
			<img src="/src/lib/assets/images/doppelganger.png" alt="doppelganger" class="h-12 w-12" />
			{#if data.user}
				<div class="dropdown">
					<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
						<Menu />
					</div>
					<ul
						class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
					>
						<li><a href="/main/Therapists">Homepage</a></li>
						<li><a href="/main/Therapists/Dashboard">Dashboard</a></li>
						<li><a href="/main/Therapists/Chats">Chats</a></li>
						<li><a href="/main/Therapists/notes">Notes</a></li>
						<li><a href="/main/Therapists/Calendar">Calender</a></li>
					</ul>
				</div>
			{/if}
		</div>
		<div class="navbar-center">
			<a
				href="/"
				class="btn btn-ghost text-xl"
				style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;"
				>SerenityHaven</a
			>
		</div>
		<div class="navbar-end">
			{#if data.user}
				<p>{data.user.username} ({data.user.role})</p>

				
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
	<div class="tabs tabs-lift tabs-bottom">
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
	style="background-image: url('/src/lib/assets/images/360_F_209499600_LyFap3lMZtLV6XXP1CUfPfI30KettOG5.jpg');"
>

				<div class="hero-overlay"></div>
				<div class="hero-content text-neutral-content text-center">
					<div class="max-w-md">
						<h1 class="mb-5 text-5xl font-bold">Hello there</h1>
						<p class="mb-5">
							Welcome to SerenityHaven. Here, you can explore your thoughts, track your feelings, and
							take small steps toward a calmer mind
						</p>
						<button onclick={() => goto('/auth/lucia/login-page')} class="btn btn-primary">Get Started</button>
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

		<input type="radio" name="my_tabs_5" class="tab" aria-label="Sign up" style="background-color: #60885E; color:antiquewhite;"/>

		<div class="tab-content p-0">
			<div class="hero bg-base-200 min-h-screen">
				<div class="hero-content flex-col gap-10 lg:flex-row-reverse">
					<!-- Left: Welcome text -->
					<div class="max-w-md text-center lg:text-left">
						<h1 class="text-primary text-5xl font-extrabold">Welcome back!</h1>
						<p class="text-base-content/70 py-6">
							 Great to see you again! Log in to explore exercises, guides, and tools to support your wellbeing.
						</p>
					</div>

					<!-- Right: Login card -->
					<div class="card bg-base-100 w-full max-w-sm shadow-2xl">
						<div class="card-body space-y-4">
							{#if data.user}
								<div class="space-y-2 text-center">
									<h2 class="text-primary text-xl font-bold">
										👋 Hi {data.user.username}!
									</h2>
									<p class="text-sm opacity-70">Role: {data.user.role}</p>
									<p class="text-sm opacity-70">Email: {data.user.email}</p>
									<form method="post" action="?/logout" use:enhance>
					<button class="btn btn-dash btn-error mr-5 ml-5">Sign out</button>
				</form>
								</div>
							{:else}
								<div class="text-center">
									<h2 class="mb-4 text-lg font-semibold">Ready to start?</h2>
									<button
										class="btn btn-success flex w-full items-center gap-2"
										onclick={() => goto('auth/lucia/login-page')}
									>
										Login
									</button>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-2">
		<aside>
			<p>Copyright © {new Date().getFullYear()} - All right reserved by SerenityHaven UIT</p>
		</aside>
	</footer>
</div>
