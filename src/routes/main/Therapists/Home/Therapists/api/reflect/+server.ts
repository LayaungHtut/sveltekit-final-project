import { json } from '@sveltejs/kit';
import { reflectOnEntry } from '$lib/ai';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const body = await request.json().catch(() => null);
	const content = body?.content;
	if (typeof content !== 'string' || !content.trim()) {
		return json({ error: 'content is required' }, { status: 400 });
	}

	try {
		const result = await reflectOnEntry(content.slice(0, 4000));
		if (!result) {
			return json({ error: 'No OpenRouter API key configured' }, { status: 500 });
		}
		return json(result);
	} catch (err) {
		console.error('Reflect error:', err);
		return json({ error: 'Reflection failed' }, { status: 500 });
	}
};