<script lang="ts">
	import { enhance } from '$app/forms';

	type MoodResult = {
		mood: string;
		intensity: number;
		positive: boolean;
		summary: string;
		suggestions: string[];
	};

	let { data } = $props<{
		notes: Array<{ id: number; title: string; content: string }>;
		user: { id: string; username: string } | null;
	}>();

	let editNote = $state<{ id: number | null; title: string; content: string }>({
		id: null,
		title: '',
		content: ''
	});

	let reflecting = $state<Record<number, boolean>>({});
	let reflections = $state<Record<number, MoodResult>>({});

	function startEdit(note: { id: number; title: string; content: string }) {
		editNote.id = note.id;
		editNote.title = note.title;
		editNote.content = note.content;
	}

	function cancelEdit() {
		editNote.id = null;
		editNote.title = '';
		editNote.content = '';
	}

	async function reflect(noteId: number, content: string) {
		if (reflecting[noteId]) return;
		reflecting[noteId] = true;
		try {
			const res = await fetch('/main/Therapists/Home/Therapists/api/reflect', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content })
			});
			const data = await res.json();
			if (res.ok) reflections[noteId] = data;
		} catch (err) {
			console.error('Reflect error:', err);
		} finally {
			reflecting[noteId] = false;
		}
	}
</script>

<main class="mx-auto mt-2 max-w-3xl p-4">
	<h1 class="text-primary mb-8 text-center text-3xl font-bold">My Notes</h1>

	<!-- Create new note -->
	<div class="card bg-base-100 mb-8 shadow-md">
		<div class="card-body">
			<h2 class="card-title mb-2 text-lg">Create New Note</h2>
			<form method="POST" action="?/createNote" use:enhance class="space-y-3">
				<input
					name="title"
					type="text"
					placeholder="Note title"
					required
					class="input input-bordered w-full"
				/>
				<textarea
					name="content"
					placeholder="Note content"
					rows="4"
					required
					class="textarea textarea-bordered w-full"
				></textarea>
				<button type="submit" class="btn btn-primary w-full">Create Note</button>
			</form>
		</div>
	</div>

	<!-- Notes list -->
	<div class="space-y-4">
		{#each data.notes as note (note.id)}
			<div class="card bg-base-100 shadow-md">
				<div class="card-body">
					{#if editNote.id === note.id}
						<form
							method="POST"
							action="?/updateNote"
							use:enhance
							onsubmit={cancelEdit}
							class="space-y-3"
						>
							<input type="hidden" name="id" value={note.id} />
							<input
								name="title"
								type="text"
								bind:value={editNote.title}
								required
								class="input input-bordered w-full"
							/>
							<textarea
								name="content"
								bind:value={editNote.content}
								rows="4"
								required
								class="textarea textarea-bordered w-full"
							></textarea>
							<div class="flex justify-end gap-2">
								<button type="submit" class="btn btn-success">Save</button>
								<button type="button" onclick={cancelEdit} class="btn btn-outline btn-error">
									Cancel
								</button>
							</div>
						</form>
					{:else}
						<h3 class="text-xl font-semibold">{note.title}</h3>
						<p class="whitespace-pre-wrap text-gray-600">{note.content}</p>

						{#if reflections[note.id]}
							<div class="bg-base-200 mt-4 rounded-xl p-4">
								<div class="flex flex-wrap items-center gap-2">
									<span class="badge badge-primary badge-lg">Mood: {reflections[note.id].mood}</span>
									<span
										class="badge badge-lg {reflections[note.id].positive
											? 'badge-success'
											: 'badge-warning'}"
									>
										{reflections[note.id].positive ? 'Positive' : 'Heavy'}
									</span>
									<span class="badge badge-ghost badge-lg"
										>Intensity: {reflections[note.id].intensity}/5</span
									>
								</div>
								<p class="mt-3 text-sm">{reflections[note.id].summary}</p>
								{#if reflections[note.id].suggestions.length}
									<ul class="mt-2 space-y-1 text-sm">
										{#each reflections[note.id].suggestions as s}
											<li class="list-disc">• {s}</li>
										{/each}
									</ul>
								{/if}
							</div>
						{/if}

						<div class="mt-3 flex justify-end gap-2">
							<button
								onclick={() => reflect(note.id, note.content)}
								class="btn btn-outline btn-info"
								disabled={reflecting[note.id]}
							>
								{#if reflecting[note.id]}
									<span class="loading loading-spinner loading-sm"></span> Reflecting...
								{:else}
									Reflect
								{/if}
							</button>
							<button onclick={() => startEdit(note)} class="btn btn-outline btn-success">
								Edit
							</button>
							<form method="POST" action="?/deleteNote" use:enhance>
								<input type="hidden" name="id" value={note.id} />
								<button type="submit" class="btn btn-outline btn-error">Delete</button>
							</form>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</main>
