<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { INITIAL_MESSAGE } from '$lib/config';

	let userInput = $state('');
	let chatHistory = $state<{ role: 'user' | 'assistant'; content: string }[]>([]);
	let loading = $state(false);
	let displayedResponse = $state('');

	function scrollToBottom() {
		setTimeout(() => {
			document.querySelector('.chat-box')?.scrollTo({ top: 99999, behavior: 'smooth' });
		}, 10);
	}

	onMount(async () => {
		if (chatHistory.length === 0) {
			const initialContent = await marked(INITIAL_MESSAGE);
			chatHistory.push({ role: 'assistant', content: initialContent });
			scrollToBottom();
		}
	});

	async function sendMessage() {
		if (!userInput.trim()) return;

		chatHistory.push({ role: 'user', content: userInput });
		const messages = [...chatHistory];

		userInput = '';
		loading = true;
		scrollToBottom();

		const res = await fetch('/main/Therapists/Home/Therapists/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages })
		});

		const data = await res.json();

		if (data.response) {
			chatHistory.push({ role: 'assistant', content: '' });
			const index = chatHistory.length - 1;
			displayedResponse = '';

			for (let i = 0; i < data.response.length; i++) {
				displayedResponse += data.response[i];
				await new Promise((r) => setTimeout(r, 15));
				chatHistory[index].content = await marked(displayedResponse);
				scrollToBottom();
			}
		}

		loading = false;
	}
</script>

<div class="flex">
	<div class="mx-auto mt-10 max-w-6xl flex-1 space-y-6 p-4">
		<h1 class="text-base-content text-center text-3xl font-bold">Talk to AI therapist</h1>
		<p>This is an AI therapist that will exist only when you are online and no history will be saved</p>

		<div
			class="chat-box bg-base-100 rounded-box border-base-300 max-h-[500px] space-y-4 overflow-y-auto border p-4 shadow-lg"
		>
			{#each chatHistory as msg}
				<div class="chat {msg.role === 'user' ? 'chat-end' : 'chat-start'}">
					<div class="chat-image avatar">
						<div class="w-10 rounded-full">
							{#if msg.role === 'user'}
								<span class="text-2xl">👤</span>
							{:else}
								<span class="text-2xl">👤</span>
							{/if}
						</div>
					</div>
					<div class="chat-bubble {msg.role === 'user' ? 'chat-bubble text-white' : 'chat-bubble'}">
						{@html msg.content}
					</div>
				</div>
			{/each}
		</div>

		<div class="flex items-center gap-2">
			<input
				type="text"
				class="input input-bordered input-info w-full"
				placeholder="Say something..."
				bind:value={userInput}
				onkeydown={(e) => e.key === 'Enter' && sendMessage()}
			/>
			<button onclick={sendMessage} class="btn btn-primary" disabled={loading}>
				{#if loading}
					<span class="loading loading-spinner"></span>
				{:else}
					Send
				{/if}
			</button>
		</div>
	</div>
</div>
