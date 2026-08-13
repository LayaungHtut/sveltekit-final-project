import { MODELS, DEFAULT_MODEL, createCompletion } from './openrouter';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const CHEAP_MODEL = MODELS[0] ?? DEFAULT_MODEL;
const MAIN_MODEL = MODELS[1] ?? MODELS[0] ?? DEFAULT_MODEL;

export type MoodResult = {
	mood: string;
	intensity: number; // 1-5
	positive: boolean;
	summary: string;
	suggestions: string[];
};

export type SummaryResult = {
	title: string;
	content: string;
	themes: string[];
};

export type CrisisResult = {
	crisis: boolean;
	reasons: string[];
	resources: string[];
};

const CRISIS_KEYWORDS = [
	'kill myself',
	'kill me',
	'suicide',
	'suicidal',
	'end my life',
	'want to die',
	'want die',
	'better off dead',
	'die',
	'no reason to live',
	'self harm',
	'self-harm',
	'hurt myself',
	'hurt me'
];

const RESOURCES = [
	{ name: '988 Suicide & Crisis Lifeline', contact: 'Call or text 988' },
	{ name: 'Crisis Text Line', contact: 'Text HOME to 741741' },
	{ name: 'Emergency services', contact: 'Call 911 or your local emergency number' }
];

async function getText(params: {
	model: string;
	system: string;
	user: string;
	temperature?: number;
	maxTokens?: number;
}): Promise<string | null> {
	const completion = await createCompletion({
		model: params.model,
		messages: [
			{ role: 'system', content: params.system },
			{ role: 'user', content: params.user }
		],
		temperature: params.temperature ?? 0.6,
		max_tokens: params.maxTokens ?? 700
	});

	if (!completion) return null;
	const content = completion.choices[0]?.message?.content;
	return content ?? null;
}

function parseJson<T>(raw: string | null): T | null {
	if (!raw) return null;
	const match = raw.match(/\{[\s\S]*\}/);
	if (!match) return null;
	try {
		return JSON.parse(match[0]) as T;
	} catch {
		return null;
	}
}

/**
 * Agent 1 → mood. Agent 2 → insights. Uses two different models.
 * Returns structured mood analysis for a journal entry.
 */
export async function reflectOnEntry(entry: string): Promise<MoodResult | null> {
	const moodJson = await getText({
		model: CHEAP_MODEL,
		temperature: 0.3,
		maxTokens: 200,
		system:
			'You are a mood analysis engine. Analyze the journal entry and return ONLY a JSON object with keys: "mood" (one short label, e.g. anxious, hopeful, empty), "intensity" (1-5, 5 being extreme), "positive" (boolean). No other text.',
		user: entry
	});

	const mood = parseJson<{ mood: string; intensity: number; positive: boolean }>(moodJson);

	const insights = await getText({
		model: MAIN_MODEL,
		temperature: 0.7,
		maxTokens: 500,
		system:
			'You are a compassionate mental-health reflection coach. Based on the detected mood and the journal entry, write 2-3 sentences of gentle insight (what the entry suggests), then a short list of 3 practical suggestions. Return a JSON object with keys: "summary" (string) and "suggestions" (array of strings). No other text.',
		user: `Detected mood: ${mood?.mood ?? 'unknown'}\n\nJournal entry:\n${entry}`
	});

	const parsedInsights = parseJson<{ summary: string; suggestions: string[] }>(insights);

	return {
		mood: mood?.mood ?? 'unclear',
		intensity: mood?.intensity ?? 3,
		positive: mood?.positive ?? false,
		summary:
			parsedInsights?.summary ??
			'Reflection could not be generated. Please try again.',
		suggestions: parsedInsights?.suggestions ?? ['Take a short break and breathe.', 'Talk to someone you trust.']
	};
}

/**
 * Builds a session summary from chat history using multiple models.
 * Returns summary + suggested note title/themes.
 */
export async function summarizeSession(messages: ChatCompletionMessageParam[]): Promise<SummaryResult | null> {
	const transcript = messages
		.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${String(m.content)}`)
		.join('\n');

	const titles = await getText({
		model: CHEAP_MODEL,
		temperature: 0.3,
		maxTokens: 120,
		system:
			'Suggest a short, meaningful note title (max 8 words) for this therapy chat session. Return ONLY a JSON object with keys "title" (string) and "themes" (array of short theme strings). No other text.',
		user: transcript
	});

	const parsed = parseJson<{ title?: string; themes?: string[] }>(titles);

	const summary = await getText({
		model: MAIN_MODEL,
		temperature: 0.5,
		maxTokens: 600,
		system:
			'You are a therapy session summarizer. Summarize the chat conversation concisely (4-6 sentences): key concerns discussed, any insights or action items, and the emotional tone. Focus on what is helpful to revisit later. No markdown headers.',
		user: transcript
	});

	if (!summary) return null;

	return {
		title: parsed?.title ?? 'Therapy session summary',
		themes: parsed?.themes ?? [],
		content: summary.trim()
	};
}

/**
 * Checks text for crisis indicators (keywords OR AI judgment).
 * Returns whether help should be offered and which resources to show.
 */
export async function detectCrisis(text: string): Promise<CrisisResult> {
	const lower = text.toLowerCase();
	const keywordHits = CRISIS_KEYWORDS.filter((k) => lower.includes(k));
	const resources = RESOURCES.map((r) => `${r.name} — ${r.contact}`);

	if (keywordHits.length > 0) {
		return { crisis: true, reasons: keywordHits, resources };
	}

	const verdict = await getText({
		model: CHEAP_MODEL,
		temperature: 0,
		maxTokens: 60,
		system:
			'You are a safety screener. Return ONLY a JSON object: {"crisis": boolean, "reasons": [string]}. Set crisis true ONLY if the text expresses clear intent to harm oneself or is in immediate crisis. Object literal like {"crisis":true,"reasons":["..."]}',
		user: text
	});

	const parsed = parseJson<{ crisis?: boolean; reasons?: string[] }>(verdict);
	if (parsed?.crisis) {
		return { crisis: true, reasons: parsed.reasons ?? [], resources };
	}

	return { crisis: false, reasons: [], resources };
}