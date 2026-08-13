<script lang="ts">
	import { onMount } from 'svelte';
	import { MessageCircle, User } from 'lucide-svelte';
	import { supabase } from '$lib/superbaseClient';
	import { conversationId } from '$lib/conversation';

	let { data } = $props<{
		user: { id: string; username: string; role: string };
		partners: { id: string; username: string; role: string }[];
	}>();

	const me = $derived(data.user);
	const partners: { id: string; username: string; role: string }[] = $derived(data.partners);

	const online = $state<Record<string, boolean>>({});
	const lastMessages = $state<Record<string, string>>({});

	type Partner = { id: string; username: string; role: string };

	async function loadLastMessages() {
		const conversationIds = partners.map((p) => conversationId(me.id, p.id));
		if (conversationIds.length === 0) return;

		const { data: rows } = await supabase
			.from('messages')
			.select('conversation_id, content')
			.in('conversation_id', conversationIds)
			.order('created_at', { ascending: false });

		if (!rows) return;

		const seen = new Set<string>();
		for (const row of rows) {
			if (seen.has(row.conversation_id)) continue;
			seen.add(row.conversation_id);
			lastMessages[row.conversation_id] = row.content;
		}
	}

	function previewFor(partner: Partner): string | null {
		const key = conversationId(me.id, partner.id);
		return lastMessages[key] ?? null;
	}

	onMount(() => {
		loadLastMessages();

		// Shared presence channel: every signed-in user tracks their id as the presence key.
		const channel = supabase.channel('online-users', {
			config: { presence: { key: me.id } }
		});

		channel.on('presence', { event: 'sync' }, () => {
			const state = channel.presenceState<{ online_at?: string }>();
			for (const id in state) {
				online[id] = true;
			}
		});

		channel.on('presence', { event: 'join' }, ({ key }) => {
			online[key as string] = true;
		});

		channel.on('presence', { event: 'leave' }, ({ key }) => {
			online[key] = false;
		});

		channel.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				await channel.track({ online_at: new Date().toISOString() });
			}
		});

		return () => {
			supabase.removeChannel(channel);
		};
	});
</script>

<main class="mx-auto mt-10 max-w-4xl p-6">
	<h1 class="text-primary mb-10 text-center text-3xl font-extrabold">
		{me.role === 'client' ? 'Available Therapists' : 'Available Clients'}
	</h1>

	{#if partners.length === 0}
		<div class="flex flex-col items-center justify-center py-16 text-gray-400">
			<User class="mb-3 h-12 w-12 opacity-60" />
			<p class="text-lg">
				😔 No {me.role === 'client' ? 'therapists' : 'clients'} available right now.
			</p>
		</div>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each partners as partner (partner.username)}
				<a
					href={`/main/Therapists/Chats/${partner.username}`}
					class="card bg-base-100 border-base-300 group rounded-2xl border shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="card-body flex h-full flex-col items-center p-6 text-center">
						<div class="avatar avatar-placeholder relative mb-4">
							<div
								class="mask mask-squircle bg-primary text-primary-content flex h-16 w-16 items-center justify-center transition group-hover:scale-105"
							>
								<span class="text-xl font-bold">
									{partner.username.charAt(0).toUpperCase()}
								</span>
							</div>
							{#if online[partner.id]}
								<span
									class="bg-success absolute right-0 bottom-0 h-4 w-4 rounded-full border-2 border-white"
									title="Online"
								></span>
							{/if}
						</div>

						<h2 class="card-title text-lg font-semibold">
							{partner.username}
						</h2>
						<p class="mb-4 text-sm text-gray-500">
							Role: <span class="font-medium capitalize">{partner.role}</span>
							{#if online[partner.id]}
								<span class="text-success ml-1 font-semibold">· Online</span>
							{/if}
						</p>

						{#if previewFor(partner)}
							<p class="mb-3 line-clamp-1 max-w-full text-sm text-gray-400">
								{previewFor(partner)}
							</p>
						{/if}

						<span
							class="btn btn-primary btn-sm mt-auto flex w-full items-center justify-center gap-2"
						>
							<MessageCircle class="h-4 w-4" /> Chat
						</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</main>
