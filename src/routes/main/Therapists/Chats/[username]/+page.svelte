<script lang="ts">
	import { supabase } from '$lib/superbaseClient';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PageServerData } from './$types';
	import { conversationId } from '$lib/conversation';
	import { ArrowLeft, Send } from 'lucide-svelte';

	let { data }: { data: PageServerData } = $props();

	type Message = {
		id: string;
		content: string;
		sender_id: string;
		receiver_id: string | null;
		conversation_id: string | null;
		created_at: string;
	};

	const me = $derived(data.user);
	const partner = $derived(data.partner);
	const convoId = $derived(conversationId(me.id, partner.id));

	let message = $state('');
	let chatWindow: HTMLDivElement | undefined;
	let partnerOnline = $state(false);
	let loading = $state(true);
	const messages = writable<Message[]>([]);

	async function fetchMessages() {
		const { data: rows, error } = await supabase
			.from('messages')
			.select('*')
			.eq('conversation_id', convoId)
			.order('created_at', { ascending: true });

		if (!error) {
			messages.set((rows ?? []) as Message[]);
			scrollToBottomSoon();
		} else {
			console.error('Fetch error:', error);
		}
		loading = false;
	}

	async function sendMessage() {
		if (!message.trim()) return;

		const payload = {
			content: message,
			sender_id: me.id,
			receiver_id: partner.id,
			conversation_id: convoId
		};

		const { error } = await supabase.from('messages').insert(payload);
		if (error) {
			console.error('Insert error:', error);
			return;
		}
		message = '';
	}

	function scrollToBottomSoon() {
		setTimeout(() => {
			if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
		}, 50);
	}

	onMount(() => {
		fetchMessages();

		const channel = supabase
			.channel(`dm:${convoId}`)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'messages',
					filter: `conversation_id=eq.${convoId}`
				},
				(payload) => {
					messages.update((m) => [...m, payload.new as Message]);
					scrollToBottomSoon();
				}
			)
			.subscribe();

		// Monitor partner's presence via the shared online-users channel.
		const presence = supabase.channel('online-users', {
			config: { presence: { key: me.id } }
		});

		const setPresence = (state?: Record<string, unknown>) => {
			if (!state) return;
			partnerOnline = partner.id in state;
		};

		presence
			.on('presence', { event: 'sync' }, () => setPresence(presence.presenceState()))
			.on('presence', { event: 'join' }, ({ key }) => {
				if (key === partner.id) partnerOnline = true;
			})
			.on('presence', { event: 'leave' }, ({ key }) => {
				if (key === partner.id) partnerOnline = false;
			})
			.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					await presence.track({ online_at: new Date().toISOString() });
				}
			});

		return () => {
			supabase.removeChannel(channel);
			supabase.removeChannel(presence);
		};
	});
</script>

<main class="mx-auto mt-6 max-w-2xl px-4">
	<!-- Chat Header -->
	<header class="bg-base-100 mb-4 grid grid-cols-3 items-center rounded-xl p-3 shadow">
		<a
			href="/main/Therapists/Chats"
			class="btn btn-ghost btn-sm justify-self-start"
			aria-label="Back to chats"
		>
			<ArrowLeft class="h-4 w-4" />
		</a>
		<div class="justify-self-center text-center">
			<h1 class="text-primary text-lg font-semibold">
				Chat with {partner.username}
				<span class="text-sm opacity-70">({partner.role})</span>
			</h1>
			{#if partnerOnline}
				<span class="badge badge-success badge-sm">Online</span>
			{:else}
				<span class="badge badge-ghost badge-sm">Offline</span>
			{/if}
		</div>
		<div class="justify-self-end opacity-0">
			<ArrowLeft class="h-4 w-4" />
		</div>
		<!-- spacer for balanced layout -->
	</header>

	<!-- Chat Window -->
	<section class="bg-base-200 flex h-[70vh] flex-col overflow-hidden rounded-2xl shadow-lg">
		<div
			bind:this={chatWindow}
			class="scrollbar-thin scrollbar-thumb-base-300 flex-1 space-y-4 overflow-y-auto p-4"
		>
			{#if loading}
				<div class="flex h-full items-center justify-center text-sm opacity-60">
					<span class="loading loading-spinner loading-sm"></span>
					<span class="ml-2">Loading messages...</span>
				</div>
			{:else if $messages.length === 0}
				<div class="flex h-full items-center justify-center text-sm opacity-60">
					No messages yet — say hello to {partner.username}!
				</div>
			{:else}
				{#each $messages as msg (msg.id)}
					<div class="chat {msg.sender_id === me.id ? 'chat-end' : 'chat-start'}">
						<div class="chat-image avatar avatar-placeholder">
							<div class="bg-primary text-primary-content w-10 rounded-full">
								<span>{(msg.sender_id === me.id ? me.username : partner.username).charAt(0).toUpperCase()}</span>
							</div>
						</div>
						<div
							class="chat-bubble text-sm leading-relaxed
							{msg.sender_id === me.id ? 'chat-bubble-primary shadow-md' : 'chat-bubble-secondary shadow-sm'}"
						>
							{msg.content}
						</div>
						<div class="chat-footer mt-1 text-xs opacity-70">
							{new Date(msg.created_at).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit'
							})}
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Input Area -->
		<div class="border-base-300 bg-base-100 flex items-end gap-2 border-t p-3">
			<textarea
				bind:value={message}
				placeholder={`Message ${partner.username}...`}
				class="textarea textarea-bordered w-full resize-none overflow-hidden rounded-2xl leading-relaxed"
				rows="1"
				oninput={(e) => {
					const el = e.currentTarget as HTMLTextAreaElement;
					el.style.height = 'auto';
					el.style.height = el.scrollHeight + 'px';
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault();
						sendMessage();
					}
				}}
			></textarea>
			<button onclick={sendMessage} class="btn btn-primary btn-circle self-end">
				<Send class="h-5 w-5" />
			</button>
		</div>
	</section>
</main>
