<script lang="ts">
	import {  ArrowLeft } from "lucide-svelte";
	import jsonData from "$lib/data/articles.json";

	let articles = jsonData.articles.map((a) => {
		const preview = a.content.slice(0, 120) + "...";
		return {
			title: a.title,
			preview,
			paragraphs: a.content.split("\n\n")
		};
	});

	let expanded = $state<Record<number, boolean>>({});
</script>

<div class="articles-container">
	<button 
		class="btn btn-outline btn-primary mb-6 flex items-center gap-2"
		onclick={() => history.back()}
	>
		<ArrowLeft class="w-5 h-5" />
		<span>Back</span>
	</button>

	<h1 class="text-center text-3xl font-bold text-primary mb-8">Therapy Articles</h1>

	<div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
		{#each articles as article, i}
			<div class="card bg-base-100 shadow-md hover:shadow-lg transition p-4">
				<h2 class="text-lg font-semibold text-primary mb-2">{article.title}</h2>

				{#if expanded[i]}
					{#each article.paragraphs as p}
						<p class="mb-3 leading-relaxed">{p}</p>
					{/each}
				{:else}
					<p class="text-base text-base-content">{article.preview}</p>
				{/if}

				<button
					class="btn btn-primary mt-3"
					onclick={() => (expanded[i] = !expanded[i])}
				>
					{expanded[i] ? 'Read Less' : 'Read More'}
				</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.articles-container {
		max-width: 1100px;
		margin: 2rem auto;
		padding: 2rem;
	}
</style>
