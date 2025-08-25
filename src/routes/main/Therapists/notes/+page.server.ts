import { db } from '$lib/server/db';
import { notes } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session;
	if (!session) throw redirect(302, 'auth/lucia/login-page');

	const userNotes = await db
		.select({
			id: notes.id,
			title: notes.title,
			content: notes.content
		})
		.from(notes)
		.where(eq(notes.userId, session.userId))
		.all();

	return {
		notes: userNotes,
		user: locals.user
	};
};

export const actions: Actions = {
	createNote: async ({ request, locals }) => {
		const session = locals.session;
		if (!session) throw redirect(302, '/login-page');

		const formData = await request.formData();
		const title = formData.get('title');
		const content = formData.get('content');

		if (typeof title !== 'string' || typeof content !== 'string') {
			return fail(400, { message: 'Invalid input' });
		}

		try {
			await db.insert(notes).values({
				userId: session.userId,
				title,
				content,
				createdAt: new Date(),
				updatedAt: new Date()
			});
			return { success: true };
		} catch (error) {
			console.error('Error creating note:', error);
			return fail(500, { message: 'Failed to create note' });
		}
	},

	updateNote: async ({ request, locals }) => {
		const session = locals.session;
		if (!session) throw redirect(302, '/login-page');

		const formData = await request.formData();
		const id = formData.get('id');
		const title = formData.get('title');
		const content = formData.get('content');

		if (!id || typeof title !== 'string' || typeof content !== 'string' || isNaN(Number(id))) {
			return fail(400, { message: 'Invalid input' });
		}

		try {
			const note = await db
				.select()
				.from(notes)
				.where(eq(notes.id, Number(id)))
				.get();

			if (!note || note.userId !== session.userId) {
				return fail(403, { message: 'Unauthorized' });
			}

			await db
				.update(notes)
				.set({ title, content, updatedAt: new Date() })
				.where(eq(notes.id, Number(id)))
				.run();

			return { success: true };
		} catch (error) {
			console.error('Error updating note:', error);
			return fail(500, { message: 'Failed to update note' });
		}
	},

	deleteNote: async ({ request, locals }) => {
		const session = locals.session;
		if (!session) throw redirect(302, '/login-page');

		const formData = await request.formData();
		const id = formData.get('id');

		if (!id || isNaN(Number(id))) return fail(400, { message: 'Invalid input' });

		try {
			const note = await db
				.select()
				.from(notes)
				.where(eq(notes.id, Number(id)))
				.get();

			if (!note || note.userId !== session.userId) {
				return fail(403, { message: 'Unauthorized' });
			}

			await db
				.delete(notes)
				.where(eq(notes.id, Number(id)))
				.run();

			return { success: true };
		} catch (error) {
			console.error('Error deleting note:', error);
			return fail(500, { message: 'Failed to delete note' });
		}
	},
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' }); 
		throw redirect(302, '/main');
	}
};
