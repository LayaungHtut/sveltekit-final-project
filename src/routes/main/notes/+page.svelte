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

