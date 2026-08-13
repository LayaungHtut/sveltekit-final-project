<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { INITIAL_MESSAGE } from '$lib/config';

	let userInput = $state('');
	let chatHistory = $state<{ role: 'user' | 'assistant'; content: string }[]>([]);
	let rawHistory = $state<{ role: 'user' | 'assistant'; content: string }[]>([]);
	let loading = $state(false);
	let chatBox: HTMLDivElement | undefined;
	let crisis = $state<{ reasons: string[]; resources: string[] } | null>(null);
	let summarizing = $state(false);
	let summarySaved = $state(false);
	let summaryError = $state(false);

	function scrollToBottom() {
		setTimeout(() => {
			chatBox?.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
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
		if (!userInput.trim() || loading) return;

		const userText = userInput;
		userInput = '';
		chatHistory.push({ role: 'user', content: userText });
		rawHistory.push({ role: 'user', content: userText });

		const apiMessages = chatHistory.map((m) => ({ role: m.role, content: m.content }));
		const assistantIndex = chatHistory.length;
		chatHistory.push({ role: 'assistant', content: '' });
		rawHistory.push({ role: 'assistant', content: '' });

		loading = true;
		scrollToBottom();

		const res = await fetch('/main/Therapists/Home/Therapists/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: apiMessages })
		});

		if (res.headers.get('X-Crisis-Detected') === 'true') {
			const reasons = decodeURIComponent(res.headers.get('X-Crisis-Reasons') ?? '')
				.split('; ')
				.filter(Boolean);
			crisis = {
				reasons,
				resources: [
					'988 Suicide & Crisis Lifeline — Call or text 988',
					'Crisis Text Line — Text HOME to 741741',
					'Emergency services — Call 911 or your local emergency number'
				]
			};
		}

		if (!res.ok || !res.body) {
			chatHistory[assistantIndex].content = await marked(
				'Sorry, something went wrong while reaching the AI. Please try again.'
			);
			loading = false;
			return;
		}

		const reader = res.body.getReader();
		const decoder = new TextDecoder();
		let buffer = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			rawHistory[assistantIndex].content = buffer;
			chatHistory[assistantIndex].content = await marked(buffer);
			scrollToBottom();
		}

		loading = false;
	}

	async function saveSessionSummary() {
		if (summarizing) return;
		summarizing = true;
		summarySaved = false;
		summaryError = false;
		try {
			const res = await fetch('/main/Therapists/Home/Therapists/api/summarize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: rawHistory })
			});
			const data = await res.json();
			if (res.ok && data.saved) {
				summarySaved = true;
			} else {
				summaryError = true;
			}
		} catch (err) {
			console.error('Summarize error:', err);
			summaryError = true;
		} finally {
			summarizing = false;
		}
	}
</script>

<div class="flex">
	<div class="mx-auto mt-10 max-w-6xl flex-1 space-y-6 p-4">
		<h1 class="text-base-content text-center text-3xl font-bold">Talk to AI therapist</h1>
		<p>
			This is an AI therapist that will exist only when you are online and no history will be saved
		</p>

		{#if crisis}
			<div class="alert alert-error shadow-lg" role="alert">
				<div>
					<h2 class="font-bold text-lg">You matter. Help is available right now.</h2>
					<p class="text-sm">
						The AI flagged your last message for possible crisis{#if crisis.reasons.length}
							({crisis.reasons.join(', ')}){/if}. Please reach out to one of these resources — a
						real person will respond immediately.
					</p>
					<ul class="mt-2 list-inside text-sm">
						{#each crisis.resources as resource (resource)}
							<li>• {resource}</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}

		<div
			bind:this={chatBox}
			class="chat-box bg-base-100 rounded-box border-base-300 max-h-[500px] space-y-4 overflow-y-auto border p-4 shadow-lg"
		>
			{#each chatHistory as msg, i (i)}
				<div class="chat {msg.role === 'user' ? 'chat-end' : 'chat-start'}">
					<div class="chat-image avatar">
						<div class="w-10 rounded-full">
							{#if msg.role === 'user'}
								<span class="text-2xl">👤</span>
							{:else}
								<span class="text-2xl">🤖</span>
							{/if}
						</div>
					</div>
					<div class="chat-bubble {msg.role === 'user' ? 'chat-bubble text-white' : 'chat-bubble'}">
						{#if loading && i === chatHistory.length - 1 && msg.content === ''}
							<span class="loading loading-dots loading-sm"></span>
						{:else}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html msg.content}
						{/if}
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
				disabled={loading}
				onkeydown={(e) => e.key === 'Enter' && sendMessage()}
			/>
			<button onclick={sendMessage} class="btn btn-primary" disabled={!userInput.trim() || loading}>
				{#if loading}
					<span class="loading loading-spinner"></span>
				{:else}
					Send
				{/if}
			</button>
		</div>

		<div class="flex flex-col items-center gap-2">
			<button
				onclick={saveSessionSummary}
				class="btn btn-outline btn-accent btn-sm"
				disabled={summarizing || rawHistory.length < 2}
			>
				{#if summarizing}
					<span class="loading loading-spinner loading-sm"></span> Summarizing session...
				{:else}
					Save session summary to notes
				{/if}
			</button>
			{#if summarySaved}
				<div class="text-sm text-success">Session summary saved to your notes.</div>
			{/if}
			{#if summaryError}
				<div class="text-sm text-error">Failed to save session summary. Please try again.</div>
			{/if}
		</div>
	</div>
</div>
