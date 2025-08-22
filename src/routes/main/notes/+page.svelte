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

	async function handleDelete(noteId: number) {
		try {
			const response = await fetch('?/deleteNote', {
				method: 'DELETE',
				body: JSON.stringify({ id: noteId })
			});
			if (response.ok) {
				data.notes = data.notes.filter((note: any) => note.id !== noteId);
			}
		} catch (error) {
			console.error('Delete failed:', error);
		}
	}

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

<div class="notes-container">
	<h1>My Notes</h1>

	<form method="POST" action="?/createNote" use:enhance class="note-form">
		<h2>Create New Note</h2>
		<input name="title" type="text" placeholder="Note title" required class="input input-success" />
		<textarea
			name="content"
			placeholder="Note content"
			rows="4"
			required
			class="textarea textarea-success"
		></textarea>
		<button type="submit" class="btn btn-soft btn-info">Create Note</button>
	</form>

	<div class="notes-list">
		{#each data.notes as note (note.id)}
			<div class="note-card">
				{#if editNote.id === note.id}
					<form method="POST" action="?/updateNote" use:enhance onsubmit={() => cancelEdit()}>
						<input type="hidden" name="id" value={note.id} class="input input-success" />
						<input
							name="title"
							type="text"
							bind:value={editNote.title}
							required
							class="input input-success"
						/>
						<textarea
							name="content"
							bind:value={editNote.content}
							rows="4"
							required
							class="textarea textarea-success"
						></textarea>
						<div class="form-actions">
							<button type="submit" class="btn btn-soft btn-success">Save</button>
							<button type="button" onclick={cancelEdit} class="btn btn-soft btn-error"
								>Cancel</button
							>
						</div>
					</form>
				{:else}
					<h3>{note.title}</h3>
					<pre>{note.content}</pre>
					<div class="note-actions">
						<button onclick={() => startEdit(note)} class="btn btn-soft btn-success">Edit</button>
						<form method="POST" action="?/deleteNote" use:enhance>
							<input type="hidden" name="id" value={note.id} />
							<button type="submit" class="btn btn-soft btn-error">Delete</button>
						</form>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.notes-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;

		& .note-form,
		& .note-card {
			padding: 20px;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			margin-bottom: 20px;
		}

		input,
		textarea {
			width: 100%;
			margin-bottom: 10px;
			padding: 8px;
			border: 1px solid #ddd;
			border-radius: 4px;
		}

		.note-actions {
			margin-top: 10px;
			display: flex;
			gap: 10px;
		}

		.notes-list {
			margin-top: 30px;

			.note-card {
				h3 {
					font-size: 1.25rem;
					color: #333;
				}

				pre {
					white-space: pre-wrap;
					font-family: inherit;
					color: #444;
					margin: 10px 0;
				}

				.note-actions {
					display: flex;
					gap: 10px;
				}
			}
		}
	}
</style>
