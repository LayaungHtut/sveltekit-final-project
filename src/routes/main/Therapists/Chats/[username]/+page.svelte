<!-- src/routes/chat/[username]/+page.svelte -->
<script lang="ts">
	import { supabase } from '$lib/superbaseClient';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PageServerData } from './$types';
	import { conversationId } from '$lib/conversation';

	let { data }: { data: PageServerData } = $props();

	type Message = {
		id: number;
		content: string;
		sender_id: string;
		receiver_id: string;
		conversation_id: string | null;
		created_at: string;
	};

	const me = data.user;
	const partner = data.partner;
	const convoId = conversationId(me.id, partner.id);

	let message = $state('');
	let chatWindow: HTMLDivElement | undefined;
	const messages = writable<Message[]>([]);

	async function fetchMessages() {
		const { data: rows, error } = await supabase
			.from<Message>('messages')
			.select('*')
			.eq('conversation_id', convoId)
			.order('created_at', { ascending: true });

		if (error) {
			console.error('Fetch error:', error);
			return;
		}

		messages.set(rows ?? []);
		scrollToBottomSoon();
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
		// allow DOM to paint first
		setTimeout(() => {
			if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
		}, 0);
	}


onMount(() => {
  // 1. Load history when component mounts
  fetchMessages();

  // 2. Subscribe to realtime inserts for this conversation
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
        console.log("Realtime payload:", payload);
        messages.update((m) => [...m, payload.new]);
        scrollToBottomSoon?.();
      }
    )
    .subscribe();

  // Cleanup when component unmounts
  return () => {
    supabase.removeChannel(channel);
  };
});


</script>

<main class="max-w-2xl mx-auto mt-6 px-4">
	<header class="flex items-center justify-between mb-4">
		<h1 class="text-2xl font-bold text-primary">Chat with {partner.username} ({partner.role})</h1>
		<a href="/main/Therapists/Chats" class="btn btn-sm btn-outline btn-primary">Back</a>
	</header>

	<section class="flex flex-col h-[70vh] bg-base-200 rounded-2xl shadow-md overflow-hidden">
		<div bind:this={chatWindow} class="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-base-300">
			{#each $messages as msg}
				<div class="chat {msg.sender_id === me.id ? 'chat-end' : 'chat-start'}">
					<div class="chat-bubble chat-bubble-{msg.sender_id === me.id ? 'primary' : 'secondary'}">
						{msg.content}
					</div>
					<div class="chat-footer opacity-70 text-xs mt-1">
						{new Date(msg.created_at).toLocaleString()}
					</div>
				</div>
			{/each}
		</div>



        <div class="flex items-end gap-2 border-t border-base-300 p-3">
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<textarea
		bind:value={message}
		placeholder={`Message ${partner.username}...`}
		class="textarea textarea-bordered w-full rounded-2xl resize-none overflow-hidden leading-relaxed"
		rows="1"
		oninput={(e) => {
			const el = e.currentTarget as HTMLTextAreaElement;
			el.style.height = "auto"; // reset height
			el.style.height = el.scrollHeight + "px"; // grow with content
		}}
		onkeydown={(e) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				sendMessage();
			}
		}}
	/>
	<button
		onclick={sendMessage}
		class="btn btn-primary rounded-full px-6 self-end"
	>
		Send
	</button>
</div>
	</section>
</main>
