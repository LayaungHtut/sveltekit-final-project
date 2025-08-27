<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props<{
		notes: Array<{ id: number; title: string; content: string }>;
		user: { id: number; username: string };
	}>();

	let editNote = $state<{ id: number | null; title: string; content: string }>({
		id: null,
		title: '',
		content: ''
	});

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
</script>

<main class="max-w-3xl mx-auto mt-2 p-4">
	<h1 class="text-3xl font-bold text-center text-primary mb-8">My Notes</h1>

	<!-- Create new note -->
	<div class="card bg-base-100 shadow-md mb-8">
		<div class="card-body">
			<h2 class="card-title text-lg mb-2">Create New Note</h2>
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
						<form method="POST" action="?/updateNote" use:enhance onsubmit={cancelEdit} class="space-y-3">
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
							<div class="flex gap-2 justify-end">
								<button type="submit" class="btn btn-success">Save</button>
								<button type="button" onclick={cancelEdit} class="btn btn-outline btn-error">
									Cancel
								</button>
							</div>
						</form>
					{:else}
						<h3 class="text-xl font-semibold">{note.title}</h3>
						<p class="text-gray-600 whitespace-pre-wrap">{note.content}</p>
						<div class="flex gap-2 justify-end mt-3">
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
