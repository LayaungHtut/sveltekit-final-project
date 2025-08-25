<script lang="ts">
	import { page } from '$app/state';
	import conditions from '$lib/data/conditions.json';
	import { goBackRoute } from '$lib/utils/sveltekit/router.sveltekit.util';

	type Condition = {
		id: string;
		title: string;
		description: string;
		causes: string[];
		treatments: string[];
	};

	let condition: Condition | undefined = conditions.find((c) => c.id === page.params.id);
</script>

{#if condition}
	<div class="mx-auto mt-8 max-w-4xl">
		<div class="card bg-base-100 p-6 shadow-xl">
			<h1 class="text-success mb-4 text-4xl font-bold">{condition.title}</h1>
			<p class="mb-6 text-lg leading-relaxed">
				{condition.description}
			</p>

			<div class="divider">Causes</div>
			<ul class="list-inside list-disc space-y-3">
				{#each condition.causes as cause}
					<li>{cause}</li>
				{/each}
			</ul>

			<div class="divider mt-8">Treatments</div>
			<ul class="space-y-3">
				{#each condition.treatments as treatment}
					<li class="flex items-start gap-2">
						<span class="badge badge-outline badge-success mt-1">✓</span>
						<span>{treatment}</span>
					</li>
				{/each}
			</ul>

			<div class="mt-10">
				<div class="mt-10">
					<button type="button" class="btn btn-soft btn-success" onclick={goBackRoute}>
						← Back to Conditions
					</button>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="py-20 text-center">
		<h2 class="mb-4 text-2xl font-semibold">Condition not found</h2>
		<button type="button" class="btn btn-soft btn-success" onclick={goBackRoute}>
			Back to Lists
		</button>
	</div>
{/if}
