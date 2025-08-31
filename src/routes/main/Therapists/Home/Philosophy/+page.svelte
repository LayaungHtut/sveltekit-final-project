<script lang="ts">
  import philosophies from "$lib/data/philosopy.json";
  import { Search } from "lucide-svelte";

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

  function truncateWords(text: string, maxWords = 40): string {
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  }

  let query = $state("");
  let currentPage = $state(1);
  const itemsPerPage = 9;

  let filtered = $derived(
    philosophies.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
  );

  let totalPages = $derived(
    Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  );

  let paginated = $derived(
    filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  );

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }
</script>

<h1 class="text-2xl font-bold mt-6 mb-4 text-center">Explore Philosophies</h1>

<div class="w-[80%] mx-auto">
  <label class="input input-bordered flex items-center gap-2 w-full">
    <Search />
    <input type="text" placeholder="Search philosophy..." bind:value={query} />
  </label>
</div>

<div class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
  {#each paginated as philosophy}
    <div class="card border bg-base-100 w-75">
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

    {#each Array(totalPages) as _, i}
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
