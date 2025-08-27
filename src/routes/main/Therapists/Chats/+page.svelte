<script lang="ts">
  let { data } = $props();
  const me = data.user;
  const partners = data.partners;
</script>

<main class="mx-auto mt-6 max-w-2xl p-4">
  <h1 class="mb-6 text-2xl font-bold text-primary text-center">
    {me.role === 'client' ? 'Available Therapists' : 'Available Clients'}
  </h1>

  {#if partners.length === 0}
    <div class="text-center text-gray-500 py-10">
      <p class="text-lg">😔 No {me.role === 'client' ? 'therapists' : 'clients'} online yet.</p>
    </div>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2">
      {#each partners as partner}
        <a
          href={`/main/Therapists/Chats/${partner.username}`}
          class="card bg-base-100 border border-base-300 shadow-md hover:shadow-lg transition rounded-xl"
        >
          <div class="card-body p-4 flex flex-col items-center text-center">
            <div class="avatar placeholder mb-2">
              <div class="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center">
                <span class="text-lg font-bold">
                  {partner.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <h2 class="card-title text-lg">{partner.username}</h2>
            <p class="text-sm text-gray-500">Role: {partner.role}</p>
            <button class="btn btn-sm btn-primary mt-3 w-full">Chat</button>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</main>
