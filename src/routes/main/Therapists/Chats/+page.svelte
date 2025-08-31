<script lang="ts">
  import { MessageCircle, User } from "lucide-svelte";

  let { data } = $props();
  const me = data.user;
  const partners = data.partners;
</script>

<main class="mx-auto mt-10 max-w-4xl p-6">
  <h1 class="mb-10 text-3xl font-extrabold text-primary text-center">
    {me.role === "client" ? "Available Therapists" : "Available Clients"}
  </h1>

  {#if partners.length === 0}
    <div class="flex flex-col items-center justify-center py-16 text-gray-400">
      <User class="w-12 h-12 mb-3 opacity-60" />
      <p class="text-lg">
        😔 No {me.role === "client" ? "therapists" : "clients"} online yet.
      </p>
    </div>
  {:else}
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each partners as partner}
        <a
          href={`/main/Therapists/Chats/${partner.username}`}
          class="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition duration-300 rounded-2xl"
        >
          <div class="card-body p-6 flex flex-col items-center text-center">
            <div class="avatar avatar-placeholder mb-4">
              <div class="mask mask-squircle bg-primary text-primary-content w-16 h-16 flex items-center justify-center">
                <span class="text-xl font-bold">
                  {partner.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <h2 class="card-title text-lg font-semibold">
              {partner.username}
            </h2>
            <p class="text-sm text-gray-500 mb-4">
              Role: <span class="font-medium capitalize">{partner.role}</span>
            </p>

            <button class="btn btn-primary btn-sm w-full flex items-center gap-2">
              <MessageCircle class="w-4 h-4" /> Chat
            </button>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</main>
