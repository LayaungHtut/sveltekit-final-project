import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'https://openrouter.ai/api/v1';

const keys = [
	process.env.OPENROUTER_API_KEY,
	process.env.OPENROUTER_API_KEY_2,
	process.env.OPENROUTER_API_KEY_3
].filter((k): k is string => Boolean(k));

export const MODELS = [
	process.env.OPENROUTER_MODEL,
	process.env.OPENROUTER_MODEL_2,
	process.env.OPENROUTER_MODEL_3
].filter((m): m is string => Boolean(m));

export const DEFAULT_MODEL = process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini';

// Disable the SDK's internal retries so our own failover logic below is the
// single source of truth for retry/backoff/failover decisions.
export const openrouterClients: OpenAI[] = keys.map(
	(apiKey) =>
		new OpenAI({
			baseURL: BASE_URL,
			apiKey,
			maxRetries: 0
		})
);

/** Backwards-compatible single client (primary key). */
export const openrouter = openrouterClients[0] ?? null;

// ---------------------------------------------------------------------------
// Failover tuning (all overridable via environment variables)
// ---------------------------------------------------------------------------

const RETRY_BASE_MS = Number(process.env.OPENROUTER_RETRY_BASE_MS ?? 400);
const RETRY_MAX_MS = Number(process.env.OPENROUTER_RETRY_MAX_MS ?? 4000);
const MAX_RETRY_AFTER_MS = Number(process.env.OPENROUTER_MAX_RETRY_AFTER_MS ?? 8000);
const MAX_RETRIES_PER_COMBO = Number(process.env.OPENROUTER_MAX_RETRIES_PER_COMBO ?? 2);
const MAX_TOTAL_ATTEMPTS = Number(process.env.OPENROUTER_MAX_TOTAL_ATTEMPTS ?? 12);

// ---------------------------------------------------------------------------
// Provider routing (OpenRouter `provider` body object) — optional & env-driven.
//   OPENROUTER_PROVIDER_ORDER=anthropic,google-vertex   (tried in order)
//   OPENROUTER_PROVIDER_SORT=price|throughput|latency
//   OPENROUTER_ALLOW_FALLBACKS=true|false
// ---------------------------------------------------------------------------

const PROVIDER_ORDER = parseList(process.env.OPENROUTER_PROVIDER_ORDER);
const PROVIDER_SORT = process.env.OPENROUTER_PROVIDER_SORT ?? undefined;
const PROVIDER_ALLOW_FALLBACKS = parseBool(process.env.OPENROUTER_ALLOW_FALLBACKS);

let nextKey = 0;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseList(raw?: string): string[] {
	return (raw ?? '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

function parseBool(raw?: string): boolean | undefined {
	if (raw === undefined || raw === '') return undefined;
	return raw === 'true' || raw === '1'
}

function buildProviderPrefs(): Record<string, unknown> | undefined {
	const prefs: Record<string, unknown> = {};
	if (PROVIDER_ORDER.length) prefs.order = PROVIDER_ORDER;
	if (PROVIDER_SORT) prefs.sort = PROVIDER_SORT;
	if (PROVIDER_ALLOW_FALLBACKS !== undefined) prefs.allow_fallbacks = PROVIDER_ALLOW_FALLBACKS;
	return Object.keys(prefs).length ? prefs : undefined;
}

const providerPrefs = buildProviderPrefs();

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Ordered models to try: requested first, then every configured model, with
 * duplicates removed (so if the requested model is already OPENROUTER_MODEL_2
 * it is never tried twice).
 */
function buildModelCandidates(requested: string): string[] {
	const candidates: string[] = [];
	const seen = new Set<string>();
	const add = (m?: string) => {
		if (m && !seen.has(m)) {
			seen.add(m);
			candidates.push(m);
		}
	};
	add(requested);
	for (const m of MODELS) add(m);
	if (candidates.length === 0) candidates.push(DEFAULT_MODEL);
	return candidates;
}

function isRetryableError(err: unknown): boolean {
	if (err instanceof OpenAI.APIConnectionError || err instanceof OpenAI.APIConnectionTimeoutError) {
		return true;
	}
	if (err instanceof OpenAI.RateLimitError) return true; // 429
	if (err instanceof OpenAI.InternalServerError) return true; // >= 500
	if (err instanceof OpenAI.ConflictError) return true; // 409
	const status = (err as { status?: number })?.status;
	if (typeof status !== 'number') return false;
	return status === 408 || status === 409 || status === 429 || status >= 500;
}

/**
 * OpenRouter reports `limit_source: "upstream_provider_shared_pool"` when the
 * upstream provider (not the account) is rate-limited. Rotating keys will NOT
 * help in that case, so we skip straight to the next model.
 */
function isSharedPoolRateLimit(err: unknown): boolean {
	const metadata = (err as { error?: { metadata?: { limit_source?: string } } })?.error?.metadata;
	return metadata?.limit_source === 'upstream_provider_shared_pool';
}

function providerName(err: unknown): string | undefined {
	const metadata = (err as { error?: { metadata?: { provider_name?: string } } })?.error?.metadata;
	return metadata?.provider_name;
}

function describeError(err: unknown): string {
	const status = (err as { status?: number })?.status;
	const provider = providerName(err);
	const msg = err instanceof Error ? err.message : String(err);
	return `${status ? `HTTP ${status}` : 'network'}${provider ? ` (provider: ${provider})` : ''}${msg ? `: ${msg}` : ''}`;
}

/** Backoff in ms, honouring Retry-After / retry-after-ms within a sane cap. */
function retryDelay(err: unknown, retry: number): number {
	const headers = (err as { headers?: { get?: (name: string) => string | null } })?.headers;
	if (headers?.get) {
		const ms = headers.get('retry-after-ms');
		const sec = headers.get('retry-after');
		if (ms) {
			const v = Number.parseFloat(ms);
			if (!Number.isNaN(v)) return Math.min(Math.max(v, 0), MAX_RETRY_AFTER_MS);
		}
		if (sec) {
			const v = Number.parseFloat(sec);
			if (!Number.isNaN(v)) return Math.min(Math.max(v * 1000, 0), MAX_RETRY_AFTER_MS);
			const t = Date.parse(sec);
			if (!Number.isNaN(t)) return Math.min(Math.max(t - Date.now(), 0), MAX_RETRY_AFTER_MS);
		}
	}
	return Math.min(RETRY_BASE_MS * Math.pow(2, retry - 1), RETRY_MAX_MS);
}

function buildFinalError(lastError: unknown, candidates: string[], attempts: number): Error {
	const status = (lastError as { status?: number })?.status;
	const provider = providerName(lastError);
	const msg = lastError instanceof Error ? lastError.message : String(lastError);
	const parts = [
		`OpenRouter request failed after ${attempts} attempt(s)`,
		`models tried: ${candidates.join(', ')}`,
		status ? `HTTP ${status}` : 'network error',
		status === 429 ? 'rate-limited' : '',
		provider ? `provider: ${provider}` : '',
		msg ? `last error: ${msg}` : ''
	].filter(Boolean);
	const error = new Error(parts.join('; '));
	(error as Error & { status?: number }).status = status;
	return error;
}

// ---------------------------------------------------------------------------
// createCompletion — model fallback + key rotation + retry/backoff
// ---------------------------------------------------------------------------

/**
 * Rotate across accounts, retry temporary failures (429/5xx/timeouts) with
 * exponential backoff, and fall back to the next configured model when the
 * requested model keeps failing. Returns null when no key is set.
 *
 * NOTE on streaming: the OpenAI SDK performs the HTTP request eagerly, so
 * retryable failures surface when awaiting `create()` — BEFORE any streamed
 * output exists. Failover/retry therefore always happen before output begins.
 * A mid-stream failure (after bytes were sent) is NOT retried; callers must
 * handle that themselves.
 */
export async function createCompletion(params: {
	model: string;
	messages: OpenAI.Chat.ChatCompletionMessageParam[];
	stream?: boolean;
	temperature?: number;
	top_p?: number;
	frequency_penalty?: number;
	presence_penalty?: number;
	max_tokens?: number;
}) {
	if (openrouterClients.length === 0) return null;

	const candidates = buildModelCandidates(params.model ?? DEFAULT_MODEL);
	const startKey = nextKey % openrouterClients.length;

	let lastError: unknown = null;
	let totalAttempts = 0;

	for (let mi = 0; mi < candidates.length; mi++) {
		const model = candidates[mi];
		const nextModel = candidates[mi + 1];

		for (let keyOffset = 0; keyOffset < openrouterClients.length; keyOffset++) {
			const client = openrouterClients[(startKey + keyOffset) % openrouterClients.length];
			nextKey++;

			for (let retry = 0; retry <= MAX_RETRIES_PER_COMBO; retry++) {
				totalAttempts++;
				if (totalAttempts > MAX_TOTAL_ATTEMPTS) {
					throw buildFinalError(
						lastError ?? new Error('No usable attempt succeeded'),
						candidates,
						totalAttempts
					);
				}

				if (retry > 0) {
					const delay = retryDelay(lastError, retry);
					console.warn(
						`[OpenRouter] retrying model ${model} in ${delay}ms (retry ${retry}/${MAX_RETRIES_PER_COMBO})`
					);
					await sleep(delay);
				}

				try {
					const body = {
						model,
						messages: params.messages,
						stream: params.stream ?? false,
						temperature: params.temperature,
						top_p: params.top_p,
						frequency_penalty: params.frequency_penalty,
						presence_penalty: params.presence_penalty,
						max_tokens: params.max_tokens,
						...(providerPrefs ? { provider: providerPrefs } : {})
					} as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming &
						OpenAI.Chat.ChatCompletionCreateParamsStreaming;

					return await client.chat.completions.create(body);
				} catch (err) {
					lastError = err;

					// Permanent errors (bad key, bad request, invalid model) — don't retry.
					if (!isRetryableError(err)) break;

					// Shared-pool upstream rate limit: rotating keys won't help, move to next model.
					if (isSharedPoolRateLimit(err)) {
						console.warn(
							`[OpenRouter] ${describeError(err)} from model ${model}; shared provider pool — skipping remaining keys`
						);
						keyOffset = openrouterClients.length; // skip rest of keys for this model
						break;
					}
				}
			}
		}

		if (lastError && nextModel) {
			console.warn(
				`[OpenRouter] ${describeError(lastError)} from model ${model}, trying fallback model ${nextModel}`
			);
		}
	}

	throw buildFinalError(
		lastError ?? new Error('No usable attempt succeeded'),
		candidates,
		totalAttempts
	);
}

/**
 * Agent chaining: run the given steps in order, passing the previous
 * step's output into the next step's input. Each step uses a different
 * model (and rotates accounts automatically). Benefits from createCompletion's
 * failover automatically.
 */
export async function chainAgents(
	steps: { system: string; user: string }[],
	options: {
		model?: string;
		temperature?: number;
		maxTokens?: number;
	} = {}
) {
	let output = '';

	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		const model = options.model ?? MODELS[i % MODELS.length] ?? DEFAULT_MODEL;

		const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
			{ role: 'system', content: step.system }
		];

		if (i === 0) {
			messages.push({ role: 'user', content: step.user });
		} else {
			// Feed the previous agent's output as the *user* context.
			messages.push({ role: 'assistant', content: output });
			messages.push({ role: 'user', content: step.user });
		}

		const completion = await createCompletion({
			model,
			messages,
			temperature: options.temperature ?? 0.7,
			max_tokens: options.maxTokens ?? 800
		});

		if (!completion) throw new Error('No OpenRouter API key configured');

		output = completion.choices[0]?.message?.content ?? '';
	}

	return output;
}
