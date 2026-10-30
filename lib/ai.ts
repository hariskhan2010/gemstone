/**
 * One small adapter so the store can use either Claude (Anthropic) or OpenAI.
 * Server-only: reads secret keys. Choose with env vars:
 *   AI_PROVIDER=anthropic + ANTHROPIC_API_KEY   (default model: claude-sonnet-5-5)
 *   AI_PROVIDER=openai    + OPENAI_API_KEY + AI_MODEL (the OpenAI model name you want to pay for)
 * AI_MODEL overrides the model for either provider. ANTHROPIC_BASE_URL / OPENAI_BASE_URL are optional (proxies, testing).
 */
export type Provider = 'anthropic' | 'openai';

export function aiConfigured(): { ok: true; provider: Provider; model: string } | { ok: false; reason: string } {
  const provider = (process.env.AI_PROVIDER || (process.env.ANTHROPIC_API_KEY ? 'anthropic' : process.env.OPENAI_API_KEY ? 'openai' : '')) as Provider | '';
  if (provider === 'anthropic') {
    if (!process.env.ANTHROPIC_API_KEY) return { ok: false, reason: 'ANTHROPIC_API_KEY is not set.' };
    return { ok: true, provider, model: process.env.AI_MODEL || 'claude-sonnet-5-5' };
  }
  if (provider === 'openai') {
    if (!process.env.OPENAI_API_KEY) return { ok: false, reason: 'OPENAI_API_KEY is not set.' };
    if (!process.env.AI_MODEL) return { ok: false, reason: 'Set AI_MODEL to the OpenAI model you want to use.' };
    return { ok: true, provider, model: process.env.AI_MODEL };
  }
  return { ok: false, reason: 'No AI provider yet. Set AI_PROVIDER and its API key (see REDESIGN_README.md).' };
}

export async function generate({ system, prompt, maxTokens = 3000 }: { system: string; prompt: string; maxTokens?: number }): Promise<string> {
  const cfg = aiConfigured();
  if (!cfg.ok) throw new Error(cfg.reason);
  if (cfg.provider === 'anthropic') {
    const r = await fetch(`${process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com'}/v1/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: cfg.model, max_tokens: maxTokens, system, messages: [{ role: 'user', content: prompt }] }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(`Claude API ${r.status}: ${j?.error?.message ?? 'error'}`);
    return (j.content as { type: string; text?: string }[]).filter(c => c.type === 'text').map(c => c.text).join('');
  }
  const r = await fetch(`${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: cfg.model, max_completion_tokens: maxTokens, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }] }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`OpenAI API ${r.status}: ${j?.error?.message ?? 'error'}`);
  return j.choices?.[0]?.message?.content ?? '';
}

/** Ask for JSON and parse it, tolerating a ```json fence. */
export async function generateJSON<T>(args: { system: string; prompt: string; maxTokens?: number }): Promise<T> {
  const text = await generate({ ...args, system: `${args.system}\nReply with one JSON object only. No prose before or after it.` });
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('The AI did not return JSON.');
  return JSON.parse(m[0]) as T;
}
