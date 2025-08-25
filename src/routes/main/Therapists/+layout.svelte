<script lang="ts">
	import { MainRoute } from '$lib/dataRoute/TherapistsInterfaceRoute/route.data';
	import { Menu, Moon, SunMedium } from 'lucide-svelte';

	let { children } = $props();
</script>

<div class="drawer lg:drawer-open min-h-screen">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />

	<!-- main layout -->
	<div class="drawer-content flex flex-col min-h-screen">
		<!-- navbar -->
		<div class="navbar bg-base-100 shadow-sm">
			<div class="flex-none lg:hidden">
				<label for="my-drawer" class="btn btn-square btn-ghost">
					<Menu />
				</label>
			</div>
			<div class="flex-1 px-2 text-xl">daisyUI</div>
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
		<footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 mt-auto">
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
		<aside class="bg-neutral text-neutral-content w-64 min-h-full p-6 flex flex-col justify-between">
			<div>
				<div class="avatar mb-4 flex justify-center">
					<div class="ring-primary ring-offset-base-100 w-20 rounded-full ring ring-offset-1">
						<img src="https://i.pravatar.cc/100" alt="User Avatar" />
					</div>
				</div>

				<h1 class="mb-2 text-xl font-bold text-center">La Yung Htut</h1>
				<h2 class="mb-5 text-xs text-center">layunghtut11@gmail.com</h2>

				<ul class="menu">
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
				<a href="/" class="btn btn-sm w-full">
					<i class="fa fa-sign-out"></i> Log Out
				</a>
			</div>
		</aside>
	</div>
</div>
