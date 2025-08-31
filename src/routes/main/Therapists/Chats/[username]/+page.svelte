<script lang="ts">
	import { supabase } from "$lib/superbaseClient";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";
	import type { PageServerData } from "./$types";
	import { conversationId } from "$lib/conversation";
	import { ArrowLeft, Send } from "lucide-svelte";

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

	let message = $state("");
	let chatWindow: HTMLDivElement | undefined;
	const messages = writable<Message[]>([]);

	async function fetchMessages() {
		const { data: rows, error } = await supabase
			.from<Message>("messages")
			.select("*")
			.eq("conversation_id", convoId)
			.order("created_at", { ascending: true });

		if (!error) {
			messages.set(rows ?? []);
			scrollToBottomSoon();
		} else {
			console.error("Fetch error:", error);
		}
	}

	async function sendMessage() {
		if (!message.trim()) return;

		const payload = {
			content: message,
			sender_id: me.id,
			receiver_id: partner.id,
			conversation_id: convoId
		};

		const { error } = await supabase.from("messages").insert(payload);
		if (error) {
			console.error("Insert error:", error);
			return;
		}
		message = "";
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
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `conversation_id=eq.${convoId}`
				},
				(payload) => {
					messages.update((m) => [...m, payload.new]);
					scrollToBottomSoon();
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	});
</script>

<main class="max-w-2xl mx-auto mt-6 px-4">
	<!-- Chat Header -->
	<header class="flex items-center justify-between mb-4 bg-base-100 p-3 rounded-xl shadow">
		<a href="/main/Therapists/Chats" class="btn btn-ghost btn-sm flex items-center gap-2">
			<ArrowLeft class="w-4 h-4" /> Back
		</a>
		<h1 class="text-lg font-semibold text-primary text-center">
			Chat with {partner.username} <span class="text-sm opacity-70">({partner.role})</span>
		</h1>
		<div class="w-10"></div> <!-- spacer -->
	</header>

	<!-- Chat Window -->
	<section class="flex flex-col h-[70vh] bg-base-200 rounded-2xl shadow-lg overflow-hidden">
		<div
			bind:this={chatWindow}
			class="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-base-300"
		>
			{#each $messages as msg}
				<div class="chat {msg.sender_id === me.id ? 'chat-end' : 'chat-start'}">
					<div
						class="chat-bubble text-sm leading-relaxed 
							{msg.sender_id === me.id 
								? 'chat-bubble-primary shadow-md' 
								: 'chat-bubble-secondary shadow-sm'}"
					>
						{msg.content}
					</div>
					<div class="chat-footer opacity-70 text-xs mt-1">
						{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</div>
				</div>
			{/each}
		</div>

		<!-- Input Area -->
		<div class="flex items-end gap-2 border-t border-base-300 bg-base-100 p-3">
			<textarea
				bind:value={message}
				placeholder={`Message ${partner.username}...`}
				class="textarea textarea-bordered w-full rounded-2xl resize-none overflow-hidden leading-relaxed"
				rows="1"
				oninput={(e) => {
					const el = e.currentTarget as HTMLTextAreaElement;
					el.style.height = "auto";
					el.style.height = el.scrollHeight + "px";
				}}
				onkeydown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						sendMessage();
					}
				}}
			></textarea>
			<button
				onclick={sendMessage}
				class="btn btn-primary btn-circle self-end"
			>
				<Send class="w-5 h-5" />
			</button>
		</div>
	</section>
</main>
