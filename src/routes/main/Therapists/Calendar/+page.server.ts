import { fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { appointments } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session;
	if (!session) throw redirect(302, '/auth/lucia/login-page');

	const rows = await db
		.select({
			date: appointments.date,
			note: appointments.note
		})
		.from(appointments)
		.where(eq(appointments.userId, session.userId))
		.all();

	const byDate: Record<string, string> = {};
	for (const row of rows) byDate[row.date] = row.note;

	return { appointments: byDate, user: locals.user };
};

export const actions: Actions = {
	saveAppointment: async ({ request, locals }) => {
		const session = locals.session;
		if (!session) throw redirect(302, '/auth/lucia/login-page');

		const formData = await request.formData();
		const date = formData.get('date');
		const note = formData.get('note');

		if (typeof date !== 'string' || !DATE_PATTERN.test(date)) {
			return fail(400, { message: 'Invalid date' });
		}
		if (typeof note !== 'string' || note.trim() === '') {
			return fail(400, { message: 'Note cannot be empty' });
		}

		const trimmed = note.trim();

		try {
			await db
				.update(appointments)
				.set({ note: trimmed, updatedAt: new Date() })
				.where(and(eq(appointments.userId, session.userId), eq(appointments.date, date)))
				.run();

			await db
				.insert(appointments)
				.values({
					userId: session.userId,
					date,
					note: trimmed,
					createdAt: new Date(),
					updatedAt: new Date()
				})
				.onConflictDoNothing()
				.run();

			return { success: true };
		} catch (error) {
			console.error('Error saving appointment:', error);
			return fail(500, { message: 'Failed to save appointment' });
		}
	},

	deleteAppointment: async ({ request, locals }) => {
		const session = locals.session;
		if (!session) throw redirect(302, '/auth/lucia/login-page');

		const formData = await request.formData();
		const date = formData.get('date');

		if (typeof date !== 'string' || !DATE_PATTERN.test(date)) {
			return fail(400, { message: 'Invalid date' });
		}

		try {
			await db
				.delete(appointments)
				.where(and(eq(appointments.userId, session.userId), eq(appointments.date, date)))
				.run();
			return { success: true };
		} catch (error) {
			console.error('Error deleting appointment:', error);
			return fail(500, { message: 'Failed to delete appointment' });
		}
	}
};
