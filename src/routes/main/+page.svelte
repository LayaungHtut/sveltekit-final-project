<script lang="ts">
	import { goto } from "$app/navigation";
	import { Menu, Moon, Search, Sun } from "lucide-svelte";
	import type { PageServerData } from "./$types"; 


	let { data } : { data: PageServerData } = $props();

</script>
 
<div class="mainbd">
	<div class="navbar bg-base-100 shadow-sm">
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
					<Menu />
				</div>
				<ul
					class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
				>
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
			<label class="swap swap-rotate">
				<!-- this hidden checkbox controls the state -->
				<input type="checkbox" class="theme-controller" value="synthwave" />

				<!-- sun icon -->
					<Sun />

				<!-- moon icon -->
					<Moon />
			</label>
		</div>
	</div>
	<!-- name of each tab group should be unique -->
	<div class="tabs tabs-lift tabs-bottom" style="background-color:#60885E;">
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
								Welcome to MindSpace. Here, you can explore your thoughts, track your feelings, and take small steps toward a calmer mind
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
			<div class="hero bg base-200 min-h-screen bg-[#60885E]">
				<div class="hero-content flex-col text-white lg:flex-row">
					<img src="/src/lib/assets/images/workspace.jpg" class="max-w-xs rounded-lg shadow-2xl" alt="chill" />
					<div>
						<h1 class="text-5xl font-bold">Your Space for Healing</h1>
						<p class="py-6">
							Our mission is to bridge the gap between therapists and patients. We provide a safe,
							accessible space where people can explore therapy options, connect with qualified
							professionals, and take steps toward better mental well-being.
						</p>
						<button onclick={() => goto('/main/mainComponents/Articles')} class="btn btn-primary">Read More</button>
						
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
			<div class="hero min-h-screen bg-[#60885E]">
				<div class="hero-content flex-col text-white lg:flex-row-reverse">
					<div class="text-center lg:text-left">
						<h1 class="text-5xl font-bold">Login now!</h1>
						<p class="py-6">
							Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
							exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
						</p>
					</div>
					<div class="card w-full max-w-sm shrink-0 bg-[#60885E] text-black shadow-2xl">
						<div class="card-body">
							{#if data.user}
							<fieldset class="fieldset">
								<label class="label" for="email">Email</label>
								<input type="email" id="email" class="input" placeholder="Email" />
								<label class="label" for="password">Password</label>
								<input type="password" id="password" class="input" placeholder="Password" />
								<div><a href="/" class="link link-hover">Forgot password?</a></div>
								<button class="btn btn-neutral mt-4">Login</button>
							</fieldset>
							{:else}
							not add
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
