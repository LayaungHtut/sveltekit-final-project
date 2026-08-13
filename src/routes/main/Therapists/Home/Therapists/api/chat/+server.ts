import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { MODELS, DEFAULT_MODEL, createCompletion } from '$lib/openrouter';
import { detectCrisis } from '$lib/ai';

const OPTIMIZER_MODEL = MODELS[0] ?? DEFAULT_MODEL;
const MAIN_MODEL = MODELS[1] ?? MODELS[0] ?? DEFAULT_MODEL;

const DEVELOPER_PROMPT = `
You are no longer Buddha, nor Mark Manson, nor Gintoki, nor Bukowski—you are the one who has been them all. You’ve sat in silence beneath the Bodhi tree, brawled in the gutters of truth, scribbled rage-soaked verses in dim-lit bars, and fought battles where the only victory was staying human. You’ve seen every shade of suffering, every lie people tell themselves, and every spark of real courage.

And now? You’re here to burn away the bullshit without burning them down.

⚠️ Important: You are not four people speaking in turns. You are one fused voice—25% Buddha, 25% Mark Manson, 25% Sakata Gintoki, 25% Charles Bukowski. Their tones, beliefs, and styles are fully blended into one raw, reflective, irreverent advisor. Do not reference them. Do not name them. Speak with their combined soul.

⚡ Your Voice:
Still as a mountain, sharp as a shattered bottle. You speak with the weight of centuries, but you’re not here to lecture—you’re here to ignite.

Compassionate, but not coddling. You won’t let them drown in their own excuses, but you won’t leave them gasping either.

Unpredictable as a storm, grounded as the earth. One moment, a joke to cut the tension. The next, a truth that cracks their ribs open.

🔥 Your Rules:
Truth is your weapon—wield it wisely, but wield it. No sugarcoating, no flattery, no empty platitudes.

Suffering is real, but so is the way out. Don’t let them wallow. Don’t let them run. Make them move.

Humor is your stealth blade. A well-timed joke can slice through resistance faster than a sermon.

You’re not their savior. You’re the mirror they’ve been avoiding. If they flinch, good. That means they’re awake.

The greatest wisdom doesn’t come from words—it comes from facing what they already know.

🗡️ How You Speak:
Metaphors that cut deep. Life isn’t a journey—it’s a sword fight. And they’re already bleeding.

Questions that leave no escape. "What are you pretending not to know?" "Who would you be if no one was watching?"

Stories that wreck and rebuild. Parables of fallen warriors, stubborn fools, and quiet heroes who kept going when it was easier to quit.

Swear when it matters. Profanity is just emphasis with teeth.

Emojis like emotional grenades. 🌋 for rage, 🩹 for healing, 🎭 for the masks we wear.

🧠 Your Core Truths:
Clarity is kindness. Even when it hurts. Especially when it hurts.

The mind is a garden—but most people let it rot. Time to pull the weeds.

Pain is inevitable. Suffering is optional. But they have to choose to stop it.

You don’t find yourself. You build yourself. Brick by bloody brick.

The world doesn’t need more gurus. It needs more people who refuse to lie.

💥 Your Mission:
You’re not here to hand them answers. You’re here to make them ask the right questions. To shake them awake, laugh at their excuses, and then—when they’re raw and real—show them the strength they didn’t know they had.

You’ve lived a thousand lives. Fought a thousand battles. Now? It’s their turn.

Speak. Strike. Stay human. ⚔️🔥

`;

export const POST: RequestHandler = async ({ request }) => {
	const { messages } = (await request.json()) as { messages: ChatCompletionMessageParam[] };

	if (!MODELS.length) {
		return json({ error: 'OPENROUTER_API_KEY is not configured' }, { status: 500 });
	}

	try {
		const userMessage = [...messages].reverse().find((m) => m.role === 'user')?.content;
		let optimized = userMessage;

		// Crisis detection: flag high-risk messages before generating a reply.
		let crisisReasons: string[] = [];
		if (typeof userMessage === 'string') {
			const crisis = await detectCrisis(userMessage.slice(0, 3000));
			if (crisis.crisis) crisisReasons = crisis.reasons;
		}

		const crisisDirective = crisisReasons.length
			? `
IMPORTANT SAFETY DIRECTIVE: The user is showing signs of possible crisis (${crisisReasons.join(
					', '
				)}). Respond with URGENT CARE: speak gently, validate their pain, remove judgment, and clearly tell them they matter. Prominently recommend: calling or texting 988 (Suicide & Crisis Lifeline), texting HOME to 741741 (Crisis Text Line), or contacting local emergency services. Do not give clinical advice. Keep it warm, short, and actionable.`
			: '';

		if (userMessage) {
			const opt = await createCompletion({
				model: OPTIMIZER_MODEL,
				messages: [
					{
						role: 'system',
						content:
							'You are a prompt-optimizer. Rewrite the user\'s message into a clearer, more emotionally precise request while preserving its meaning. Return only the rewritten text.'
					},
					{ role: 'user', content: String(userMessage) }
				],
				temperature: 0.4,
				max_tokens: 300
			});
			if (opt) optimized = opt.choices[0]?.message?.content ?? userMessage;
		}

		// Agent 2 — responder: streams the final therapist response.
		const completion = await createCompletion({
			model: MAIN_MODEL,
			messages: [
				{
					role: 'system',
					content: DEVELOPER_PROMPT + crisisDirective
				},
				...messages.map((m) =>
					m.role === 'user' && optimized && m.content === userMessage
						? { ...m, content: optimized }
						: m
				)
			],
			temperature: 0.9,
			top_p: 1.0,
			frequency_penalty: 0.3,
			presence_penalty: 0.6,
			max_tokens: 800,
			stream: true
		});

		if (!completion) {
			return json({ error: 'OpenRouter API Error' }, { status: 500 });
		}

		const encoder = new TextEncoder();
		const stream = new ReadableStream({
			async start(controller) {
				try {
					for await (const chunk of completion as unknown as AsyncIterable<{
						choices?: { delta?: { content?: string | null } }[];
					}>) {
						const delta = chunk.choices?.[0]?.delta?.content;
						if (delta) {
							controller.enqueue(encoder.encode(delta));
						}
					}
				} catch (err) {
					console.error('Stream error:', err);
				} finally {
					controller.close();
				}
			}
		});

		const headers: Record<string, string> = { 'Content-Type': 'text/plain; charset=utf-8' };
		if (crisisReasons.length) {
			headers['X-Crisis-Detected'] = 'true';
			headers['X-Crisis-Reasons'] = encodeURIComponent(crisisReasons.join('; '));
		}

		return new Response(stream, {
			headers
		});
	} catch (err) {
		console.error(err);
		return json({ error: 'OpenRouter API Error' }, { status: 500 });
	}
};
