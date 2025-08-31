<script lang="ts">
  import { page } from "$app/state";
  import philosophies from "$lib/data/philosopy.json";
  import { goBackRoute } from "$lib/utils/sveltekit/router.sveltekit.util";

  type Philosophy = {
    id: string;
    name: string;
    description: string;
    category: string;
    key_ideas: string[];
    resources: { type: string; title: string; url: string }[];
    date_added: string;
    tags: string[];
  };

  let philosophy: Philosophy | undefined = philosophies.find(
    (p) => p.id === page.params.id
  );
</script>

{#if philosophy}
  <div class="mx-auto mt-8 max-w-4xl">
    <div class="card bg-base-100 p-6 shadow-xl">
      <h1 class="text-success mb-4 text-4xl font-bold">{philosophy.name}</h1>
      <p class="mb-6 text-lg leading-relaxed">{philosophy.description}</p>

      <div class="divider">Key Ideas</div>
      <ul class="list-inside list-disc space-y-3">
        {#each philosophy.key_ideas as idea}
          <li>{idea}</li>
        {/each}
      </ul>

      <div class="divider mt-8">Resources</div>
      <ul class="space-y-3">
        {#each philosophy.resources as r}
          <li>
            <a class="link text-success" href={r.url} target="_blank">
              {r.title} ({r.type})
            </a>
          </li>
        {/each}
      </ul>

      <div class="mt-10">
        <button type="button" class="btn btn-soft btn-success" onclick={goBackRoute}>
          ← Back to Philosophies
        </button>
      </div>
    </div>
  </div>
{:else}
  <div class="py-20 text-center">
    <h2 class="mb-4 text-2xl font-semibold">Philosophy not found</h2>
    <button type="button" class="btn btn-soft btn-success" onclick={goBackRoute}>
      Back to Lists
    </button>
  </div>
{/if}
