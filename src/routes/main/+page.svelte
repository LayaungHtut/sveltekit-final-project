<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

this is main page

<form method="post" action="?/logout">
							<button class="signout-button btn btn-ghost btn-error" title="Sign out"
								>Sign Out</button
							>
						</form>