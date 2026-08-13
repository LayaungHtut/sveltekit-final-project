<script lang="ts">
	import philosophies from '$lib/data/philosopy.json';
	import { Search } from 'lucide-svelte';

	function truncateWords(text: string, maxWords = 40): string {
		const words = text.split(' ');
		if (words.length <= maxWords) return text;
		return words.slice(0, maxWords).join(' ') + '...';
	}

	let query = $state('');
	let currentPage = $state(1);
	const itemsPerPage = 9;

	let filtered = $derived(
		philosophies.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
	);

	let totalPages = $derived(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));

	let paginated = $derived(
		filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}
</script>

<h1 class="mt-6 mb-4 text-center text-2xl font-bold">Explore Philosophies</h1>

<div class="mx-auto w-[80%]">
	<label class="input input-bordered flex w-full items-center gap-2">
		<Search />
		<input type="text" placeholder="Search philosophy..." bind:value={query} />
	</label>
</div>

<div class="mt-6 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3">
	{#each paginated as philosophy (philosophy.id)}
		<div class="card bg-base-100 w-75 border">
			<div class="card-body">
				<h2 class="card-title">{philosophy.name}</h2>
				<p>{truncateWords(philosophy.description, 20)}</p>
				<div class="card-actions justify-end">
					<a href={`/main/Therapists/Home/Philosophy/conditions/${philosophy.id}`}>
						<button class="btn btn-soft btn-success">Read more</button>
					</a>
				</div>
			</div>
		</div>
	{/each}
</div>

<div class="mt-6 flex justify-center">
	<div class="join">
		<button
			class="join-item btn"
			onclick={() => goToPage(currentPage - 1)}
			disabled={currentPage === 1}
		>
			«
		</button>

		{#each Array(totalPages) as _, i (i)}
			<input
				type="radio"
				name="pagination"
				class="join-item btn btn-square"
				aria-label={String(i + 1)}
				checked={currentPage === i + 1}
				onclick={() => goToPage(i + 1)}
			/>
		{/each}

		<button
			class="join-item btn"
			onclick={() => goToPage(currentPage + 1)}
			disabled={currentPage === totalPages}
		>
			»
		</button>
	</div>
</div>
