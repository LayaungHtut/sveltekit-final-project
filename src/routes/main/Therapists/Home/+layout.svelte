<script lang="ts">
	import { goto } from "$app/navigation";
    import { HomeRoute } from "$lib/dataRoute/InterfaceHomeRoute/home.data";

    let { children } = $props();
</script>

<div class="tabs tabs-lift">
{#each HomeRoute as route, i}
  <label class="tab">
    <input type="radio" onclick={() => {goto(route.path)}} 
    checked={i === 0}
    name="my_tabs_4" />
    {#if route.icon}
    {@const Icon = route.icon}
    <Icon class="h-5 w-5" />
    {/if}
    {route.name}
  </label>
  {/each}
</div>

{@render children()}

