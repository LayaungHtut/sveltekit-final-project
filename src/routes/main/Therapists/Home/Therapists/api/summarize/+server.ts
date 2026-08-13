import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { notes } from '$lib/server/db/schema';
import { summarizeSession } from '$lib/ai';
import type { RequestHandler } from '@sveltejs/kit';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const body = await request.json().catch(() => null);
	const messages = body?.messages;
	if (!Array.isArray(messages) || messages.length === 0) {
		return json({ error: 'messages is required' }, { status: 400 });
	}

	try {
		const summary = await summarizeSession(messages as ChatCompletionMessageParam[]);
		if (!summary) {
			return json({ error: 'No OpenRouter API key configured' }, { status: 500 });
		}

		const fullContent = [
			summary.content,
			summary.themes.length ? `\n\nThemes: ${summary.themes.join(', ')}` : ''
		].join('');

		await db.insert(notes).values({
			userId: locals.session.userId,
			title: summary.title,
			content: fullContent,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return json({ ...summary, saved: true });
	} catch (err) {
		console.error('Summarize error:', err);
		return json({ error: 'Summarization failed' }, { status: 500 });
	}
};