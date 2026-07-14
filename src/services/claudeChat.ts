/**
 * Claude chat models for the AI Chat Bot ("CuongMini Pro/Max").
 * ─────────────────────────────────────────────────────────────────────────
 * The chatbot's default model is Groq Llama (fast, streamed) via aiProviders.
 * This module adds the stronger Claude models, reached through the SAME
 * Anthropic-compatible gateway the Interview Simulator already uses in prod
 * (LLM_BASE_URL + ANTHROPIC_API_KEY) — no new secret.
 *
 * Two ways to call, in order of preference:
 *  1. streamClaudeChat() — REAL token streaming (Anthropic SSE). Tokens flow
 *     immediately so the user never stares at a blank spinner and the SSE
 *     connection never idles out.
 *  2. completeClaudeChat() — non-streaming fallback (the proven interview
 *     path) for the rare gateway that rejects stream:true.
 * On any failure the caller degrades to the default Groq model.
 *
 * Output length: Claude models get a HIGH max_tokens (default 8192, override
 * AI_CHAT_CLAUDE_MAX_TOKENS) so full answers are never truncated like the fast
 * default model — this is the whole point of the Pro/Max tiers.
 */

/** A text block inside a multi-part message. */
export interface ClaudeTextBlock {
  type: 'text';
  text: string;
}
/** An image block (base64) — vision input for the Sonnet/Opus tiers. */
export interface ClaudeImageBlock {
  type: 'image';
  source: { type: 'base64'; media_type: string; data: string };
}
export type ClaudeContentBlock = ClaudeTextBlock | ClaudeImageBlock;

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  /** Plain text, OR a content-block array (text + images) for vision turns. */
  content: string | ClaudeContentBlock[];
}

/** Whether the Claude gateway is configured (key present). */
export function claudeChatAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

/** Gateway model id for the "Pro" tier (Sonnet). Default matches the interview
 *  gateway's Sonnet id; override with AI_CHAT_MODEL_PRO. */
export function proModel(): string {
  return process.env.AI_CHAT_MODEL_PRO || 'rb-sonnet-5';
}
/** Gateway model id for the "Max" tier (Opus). */
export function maxModel(): string {
  return process.env.AI_CHAT_MODEL_MAX || 'rb-opus-4-8';
}

/** Generic Claude output cap (fallback when a tier doesn't specify one). */
export function claudeMaxTokens(): number {
  const n = Number(process.env.AI_CHAT_CLAUDE_MAX_TOKENS);
  return Number.isFinite(n) && n > 0 ? n : 8192;
}
/** Max output tokens for the "Pro" (Sonnet) tier. Cap, not target — a long
 *  answer can use up to this; short answers cost/stream the same as before. */
export function proMaxTokens(): number {
  const n = Number(process.env.AI_CHAT_MAX_TOKENS_PRO);
  return Number.isFinite(n) && n > 0 ? n : 10_000;
}
/** Max output tokens for the "Max" (Opus) tier. */
export function maxMaxTokens(): number {
  const n = Number(process.env.AI_CHAT_MAX_TOKENS_MAX);
  return Number.isFinite(n) && n > 0 ? n : 15_000;
}

function gatewayBase(): string {
  return (process.env.LLM_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
}
function claudeTimeoutMs(): number {
  // Generous: a maxed-out (10k–15k token) answer can legitimately take a while.
  return Number(process.env.AI_CHAT_CLAUDE_TIMEOUT_MS) || 220_000;
}

interface ClaudeCallParams {
  model: string;
  system: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
  timeoutMs?: number;
}

function buildBody(p: ClaudeCallParams, stream: boolean): string {
  // Drop empty messages and ensure the turn order the API expects. A message is
  // non-empty if it's a non-blank string OR a content-block array with items.
  const messages = p.messages.filter((m) =>
    typeof m.content === 'string'
      ? m.content.trim().length > 0
      : Array.isArray(m.content) && m.content.length > 0,
  );
  return JSON.stringify({
    model: p.model,
    max_tokens: p.maxTokens ?? claudeMaxTokens(),
    system: p.system,
    messages,
    stream,
  });
}

function requireKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY missing');
  return key;
}

/**
 * REAL streaming completion. Async generator yielding text deltas as they
 * arrive. Throws on HTTP/network error (caller falls back). If it throws AFTER
 * yielding some text, the caller keeps the partial answer.
 */
export async function* streamClaudeChat(p: ClaudeCallParams): AsyncGenerator<string, void, unknown> {
  const key = requireKey();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), p.timeoutMs ?? claudeTimeoutMs());
  try {
    const res = await fetch(`${gatewayBase()}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        accept: 'text/event-stream',
      },
      body: buildBody(p, true),
      signal: ctrl.signal,
    });
    if (!res.ok || !res.body) throw new Error(`claude stream HTTP ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const raw = trimmed.slice(5).trim();
        if (!raw || raw === '[DONE]') continue;
        try {
          const evt = JSON.parse(raw) as {
            type?: string;
            delta?: { type?: string; text?: string };
            error?: { message?: string };
          };
          if (evt.type === 'error') throw new Error(evt.error?.message || 'claude stream error event');
          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta' && evt.delta.text) {
            yield evt.delta.text;
          }
        } catch (e) {
          // A JSON parse hiccup on one frame shouldn't kill the stream; but an
          // explicit error event (rethrown above) should.
          if (e instanceof Error && e.message.startsWith('claude stream error')) throw e;
        }
      }
    }
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new Error('claude stream timeout');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * One NON-streaming completion (fallback). Throws on any error.
 */
export async function completeClaudeChat(p: ClaudeCallParams): Promise<string> {
  const key = requireKey();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), p.timeoutMs ?? claudeTimeoutMs());
  try {
    const res = await fetch(`${gatewayBase()}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: buildBody(p, false),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`claude gateway HTTP ${res.status}`);
    const json = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = (json.content ?? [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text ?? '')
      .join('')
      .trim();
    if (!text) throw new Error('claude gateway returned empty text');
    return text;
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new Error('claude gateway timeout');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
