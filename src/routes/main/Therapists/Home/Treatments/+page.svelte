<script lang="ts">
	import conditionsData from '$lib/data/conditions.json';
	import { Search } from 'lucide-svelte';

	type Condition = {
		id: string;
		title: string;
		description: string;
		causes: string[];
		treatments: string[];
	};

	function truncateWords(text: string, maxWords = 40): string {
		const words = text.split(' ');
		if (words.length <= maxWords) return text;
		return words.slice(0, maxWords).join(' ') + '...';
	}

	let currentPage = $state(1);
	const itemsPerPage = 9;

	let conditions: Condition[] = $state(conditionsData);
	let query = $state('');

	let filteredConditions = $derived(
		conditions.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
	);

	let totalPages = $derived(Math.max(1, Math.ceil(filteredConditions.length / itemsPerPage)));

	let paginatedConditions = $derived(
		filteredConditions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}
</script>

<h1 class="mt-6 mb-4 text-center text-2xl font-bold">Find suitable Treatment</h1>
<div class="mx-auto w-[80%]">
	<label class="input input-bordered flex w-full items-center gap-2">
		<Search />
		<input type="text" placeholder="Enter condition" bind:value={query} required />
	</label>
</div>

<div class="mt-6 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3">
	{#each paginatedConditions as condition (condition.id)}
		<div class="card card-dash bg-base-100 w-75 border">
			<div class="card-body">
				<h2 class="card-title">{condition.title}</h2>
				<p>{truncateWords(condition.description, 20)}</p>
				<div class="card-actions justify-end">
					<a href={`/main/Therapists/Home/Treatments/conditions/${condition.id}`}
						><button class="btn btn-soft btn-success">Read more</button></a
					>
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
