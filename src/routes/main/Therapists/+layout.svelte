<script lang="ts">
	import { goto } from '$app/navigation';
	import { MainRoute } from '$lib/dataRoute/TherapistsInterfaceRoute/route.data';
	import { Menu, Moon, SunMedium } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { PageServerData } from '../$types';

	onMount(() => {
		if (MainRoute.length > 0) {
			goto(MainRoute[0].path); // go to the first route
		}
	});

	let { children, data }: { children: () => any; data: PageServerData } = $props();
</script>

<div class="drawer lg:drawer-open min-h-screen">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />

	<!-- main layout -->
	<div class="drawer-content flex min-h-screen flex-col">
		<!-- navbar -->
		<div class="navbar bg-base-100 shadow-sm">
			<div class="flex-none lg:hidden">
				<label for="my-drawer" class="btn btn-square btn-ghost">
					<Menu />
				</label>
			</div>
			<div class="flex-1 px-2 text-xl">Mind Space</div>
			<div class="flex-none">
				<label class="swap swap-rotate">
					<input type="checkbox" class="theme-controller" value="synthwave" />
					<SunMedium />
					<Moon />
				</label>
			</div>
		</div>

		<!-- page content grows -->
		<main class="flex-1 p-6">
			{@render children()}
		</main>

		<!-- footer sticks at bottom -->
		<footer
			class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content mt-auto p-4"
		>
			<aside>
				<p>
					Copyright © {new Date().getFullYear()} - All rights reserved by ACME Industries Ltd
				</p>
			</aside>
		</footer>
	</div>

	<!-- sidebar -->
	<div class="drawer-side">
		<label for="my-drawer" class="drawer-overlay"></label>
		<aside
			class="bg-neutral text-neutral-content flex min-h-full w-64 flex-col justify-between p-6"
		>
			<div>
				<div class="avatar mb-4 flex justify-center">
					<div class="ring-primary ring-offset-base-100 w-20 rounded-full ring ring-offset-1">
						 {data.user.username.charAt(0).toUpperCase()}
					</div>
				</div>
				<h1 class="mb-2 text-center text-xl font-bold">{data.user.username}</h1>
				<h2 class="mb-5 text-center text-xs">{data.user.email}</h2>

				<ul class="menu space-y-5 ">
					{#each MainRoute as route}
						{#if route.icon}
							{@const Icon = route.icon}
							<li>
								<a href={route.path} class="flex items-center gap-2">
									<Icon class="h-5 w-5" />
									{route.name}
								</a>
							</li>
						{/if}
					{/each}
				</ul>
				 
			</div>

			<div class="p-4">
				<form method="post" action="?/logout">
					<button class="btn btn-ghost btn-error" title="Sign out">Sign Out</button>
				</form>
			</div>
		</aside>
	</div>
</div>
