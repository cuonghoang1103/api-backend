/**
 * Provider-agnostic LLM layer for the Interview Simulator (Phase 4).
 *
 * HARD CONSTRAINTS honoured here:
 * - The Anthropic API key lives ONLY on the backend (read from runtime env,
 *   never shipped to the client).
 * - Provider-agnostic: `LLMProvider` is an interface; `anthropicProvider` is
 *   one implementation. Adding OpenAI later = one more adapter, nothing else.
 * - Cost control: every call logs input/output tokens, model, cost_usd,
 *   user_id, session_id to InterviewLLMCallLog. Quota is checked before calls;
 *   FAILED calls are never charged (decrement only on real token counts).
 * - Resilience: retry w/ exponential backoff, 429/529/5xx retried, 4xx not;
 *   per-call timeout; in-memory circuit breaker.
 * - Kill switch: FORCE_STATIC_MODE=true disables all LLM calls platform-wide.
 *
 * The whole module DEGRADES to STATIC when no key / forced / circuit open — so
 * the product works with the AI turned off (see isAiAvailable()).
 */
import { prisma } from '../../../config/database.js';

export interface LLMMessage {
  role: 'user' | 'assistant';
  content: string;
}
export interface LLMResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
}
export type LLMStep = 'interview' | 'report' | 'generation';

/** Interface every provider implements. */
export interface LLMProvider {
  name: string;
  complete(model: string, system: string, messages: LLMMessage[], opts: { maxTokens?: number; timeoutMs?: number }): Promise<LLMResult>;
}

// ── Pricing ($ per 1M tokens) — used for cost logging. Keep in sync with the
//    models actually configured via LLM_MODEL_* env. Unknown models fall back
//    to a mid estimate so cost is never silently zero.
const PRICING: Record<string, { in: number; out: number }> = {
  'claude-haiku-4-5': { in: 1, out: 5 },
  'claude-sonnet-5': { in: 3, out: 15 },
  'claude-opus-4-8': { in: 5, out: 25 },
  'claude-opus-4-7': { in: 5, out: 25 },
  // Rambo-AI gateway model ids (Anthropic-compatible). Costs are ESTIMATES at
  // Anthropic list prices — the reseller bills by its own plan, so treat
  // cost_usd as informational only.
  'rb-haiku-4-5': { in: 1, out: 5 },
  'rb-sonnet-4-6': { in: 3, out: 15 },
  'rb-sonnet-5': { in: 3, out: 15 },
  'rb-opus-4-6': { in: 5, out: 25 },
  'rb-opus-4-7': { in: 5, out: 25 },
  'rb-opus-4-8': { in: 5, out: 25 },
};
function costUsd(model: string, inTok: number, outTok: number): number {
  const p = PRICING[model] ?? { in: 3, out: 15 };
  return (inTok * p.in + outTok * p.out) / 1_000_000;
}

class LLMError extends Error {
  constructor(message: string, public retryable: boolean) {
    super(message);
  }
}

// ── Anthropic adapter (raw fetch — no SDK dep) ────────────────────
const anthropicProvider: LLMProvider = {
  name: 'anthropic',
  async complete(model, system, messages, opts) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new LLMError('ANTHROPIC_API_KEY missing', false);
    const timeoutMs = opts.timeoutMs ?? (Number(process.env.LLM_TIMEOUT_MS) || 60_000);
    const ctrl = new AbortController();
    let timer = setTimeout(() => ctrl.abort(), timeoutMs);
    // Base URL is configurable → works with the official Anthropic API OR any
    // Anthropic-compatible gateway (e.g. a self-hosted proxy). Endpoint is
    // always `<base>/v1/messages`, auth is `x-api-key`.
    const base = (process.env.LLM_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');

    // A big answer has to STREAM, or it never arrives.
    //
    // A non-streaming request sends nothing until the whole reply is finished.
    // Ask for 16k tokens of Opus and that silence lasts minutes — long enough
    // for the gateway's own proxy to give up and answer `HTTP 524` on a request
    // the model was still happily working on. Measured on production 21/07: a
    // 500-LOC exercise explanation failed with 524 after 251 seconds, every
    // time, while short ones on the same endpoint were fine.
    //
    // Streaming fixes it at the cause: tokens arrive continuously, so no proxy
    // in the chain ever sees an idle connection. Small calls stay non-streaming
    // — there is nothing to gain and one more thing to parse.
    const maxTokens = opts.maxTokens ?? 1500;
    const useStream = maxTokens > 4000;

    try {
      const res = await fetch(`${base}/v1/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model, max_tokens: maxTokens, system, messages,
          ...(useStream ? { stream: true } : {}),
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const retryable = res.status === 429 || res.status === 529 || res.status >= 500;
        throw new LLMError(`anthropic HTTP ${res.status}`, retryable);
      }

      if (useStream) {
        // The timeout becomes an IDLE timeout: as long as tokens keep coming we
        // are not stuck, however long the whole answer takes. A total deadline
        // here would just reintroduce the bug one level down.
        return await readStream(res, model, () => {
          clearTimeout(timer);
          timer = setTimeout(() => ctrl.abort(), timeoutMs);
        });
      }

      const json = (await res.json()) as {
        content?: Array<{ type: string; text?: string }>;
        usage?: { input_tokens?: number; output_tokens?: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number };
      };
      // Only text blocks (ignore thinking blocks a gateway may return).
      const text = (json.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '').join('');
      const u = json.usage ?? {};
      const inputTokens = (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);
      return { text, inputTokens, outputTokens: u.output_tokens ?? 0, model };
    } catch (e) {
      if ((e as Error).name === 'AbortError') throw new LLMError('LLM timeout', true);
      throw e;
    } finally {
      clearTimeout(timer);
    }
  },
};


/**
 * Collect an Anthropic SSE stream into one result.
 *
 * Only `text_delta` counts. The gateway also emits `thinking` blocks and their
 * `signature_delta`s; folding those into the answer would paste the model's
 * scratch work into the middle of a lesson.
 *
 * `onChunk` resets the caller's idle timer — that is what makes a long answer
 * safe without giving a stuck connection forever.
 */
async function readStream(
  res: Response,
  model: string,
  onChunk: () => void,
): Promise<LLMResult> {
  const body = res.body;
  if (!body) throw new LLMError('anthropic stream had no body', true);

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  let inputTokens = 0;
  let outputTokens = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk();
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line; keep the tail, it may be a
    // half-received frame.
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      for (const line of frame.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        let evt: {
          type?: string;
          delta?: { type?: string; text?: string };
          message?: { usage?: { input_tokens?: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number } };
          usage?: { output_tokens?: number };
          error?: { message?: string };
        };
        try {
          evt = JSON.parse(payload);
        } catch {
          continue;                       // a frame we cannot read is not fatal
        }
        if (evt.type === 'error') {
          throw new LLMError(`anthropic stream error: ${evt.error?.message ?? 'unknown'}`, true);
        }
        if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
          text += evt.delta.text ?? '';
        } else if (evt.type === 'message_start') {
          const u = evt.message?.usage ?? {};
          inputTokens = (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);
        } else if (evt.type === 'message_delta') {
          outputTokens = evt.usage?.output_tokens ?? outputTokens;
        }
      }
    }
  }

  if (!text.trim()) throw new LLMError('anthropic stream produced no text', true);
  return { text, inputTokens, outputTokens, model };
}

function getProvider(): LLMProvider {
  // Only Anthropic implemented in Phase 4. Add adapters here keyed by LLM_PROVIDER.
  return anthropicProvider;
}

// ── Model selection per step (configurable via env, not hardcoded in logic) ──
export function modelForStep(step: LLMStep): string {
  if (step === 'report') return process.env.LLM_MODEL_REPORT || 'claude-opus-4-8';
  // Question generation uses the STRONGEST model (Opus 4.8) — deep, professional
  // questions + accurate model answers. Grading stays on the interview step model.
  if (step === 'generation') return process.env.LLM_MODEL_GENERATION || 'claude-opus-4-8';
  // Per-answer grading (Pass C). Default to Sonnet, not Haiku: if LLM_MODEL_INTERVIEW
  // is ever unset (fresh env / forgotten var), grading must NOT silently drop to the
  // weakest model — Sonnet is the floor we're willing to grade a candidate on.
  return process.env.LLM_MODEL_INTERVIEW || 'rb-sonnet-5';

}

// ── Kill switch + availability ────────────────────────────────────
export function isForceStatic(): boolean {
  return String(process.env.FORCE_STATIC_MODE ?? '').toLowerCase() === 'true';
}
export function hasKey(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

// ── Circuit breaker (in-memory; per backend instance, PER FEATURE) ─
//
// This used to be ONE global counter, and that made a background job able to
// switch the product off for everyone. The bulk generators fail in bursts
// (gateway 502s); five failures opened the breaker; and for the next 60
// seconds every interactive click — the Code Lab explainer, the language
// tutor — was told "the AI service is not configured" without ever reaching
// the gateway.
//
// That is not hypothetical. Production, 21/07: 1,840 failed background calls
// in one day (exphub 865 + bulk_gen 975) and ZERO failed `codelab` calls —
// because the codelab calls never happened. The user pressed the button and
// got an error the logs could not explain.
//
// One bucket per feature. A feature that is really broken still stops
// hammering the gateway, but it can only take itself down.
type CbKey = LLMFeature | 'unknown';
interface CbState { failures: number; openUntil: number }
const CB_THRESHOLD = 5;
const CB_COOLDOWN_MS = 60_000;
const cbBuckets = new Map<CbKey, CbState>();

function cbState(feature?: LLMFeature | null): CbState {
  const key: CbKey = feature ?? 'unknown';
  let state = cbBuckets.get(key);
  if (!state) {
    state = { failures: 0, openUntil: 0 };
    cbBuckets.set(key, state);
  }
  return state;
}
function circuitOpen(feature?: LLMFeature | null): boolean {
  return Date.now() < cbState(feature).openUntil;
}
function recordFailure(feature?: LLMFeature | null): void {
  const state = cbState(feature);
  state.failures += 1;
  if (state.failures >= CB_THRESHOLD) {
    state.openUntil = Date.now() + CB_COOLDOWN_MS;
    state.failures = 0;
  }
}
function recordSuccess(feature?: LLMFeature | null): void {
  cbState(feature).failures = 0;
}

/**
 * Whether AI can be used right now, for THIS feature.
 *
 * Pass the same feature you will pass to llmComplete — otherwise you are
 * asking about a different bucket than the one your call will trip.
 */
export function isAiAvailable(feature?: LLMFeature | null): boolean {
  return hasKey() && !isForceStatic() && !circuitOpen(feature);
}

/**
 * WHY the AI is unavailable — because the answers differ by hours.
 *
 * 'circuit' lasts 60 seconds and heals itself; 'nokey' and 'static' last until
 * someone changes the environment. A caller that cannot tell them apart has to
 * treat a one-minute wobble like a permanent outage, and a long autonomous run
 * will quit over it. That is not hypothetical: a burst of gateway 502s opened
 * the breaker for one minute and killed four bulk-generation shards that had
 * hours of work left.
 */
export function aiOffReason(feature?: LLMFeature | null): 'none' | 'nokey' | 'static' | 'circuit' {
  if (!hasKey()) return 'nokey';
  if (isForceStatic()) return 'static';
  if (circuitOpen(feature)) return 'circuit';
  return 'none';
}

/** ms until this feature's breaker closes; 0 when it is already closed. */
export function circuitReopensInMs(feature?: LLMFeature | null): number {
  return Math.max(0, cbState(feature).openUntil - Date.now());
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Which product spent the tokens. `step` only picks a model tier, so without
 *  this the Interview grader and the My Language tutor were the same row. */
export type LLMFeature = 'interview' | 'language' | 'cv' | 'chat' | 'bulk_gen' | 'exphub' | 'codelab';

async function logLlmCall(d: {
  userId?: number | null;
  sessionId?: number | null;
  feature?: LLMFeature | null;
  step: LLMStep;
  model: string;
  inputTokens: number;
  outputTokens: number;
  success: boolean;
}): Promise<void> {
  await prisma.interviewLLMCallLog.create({
    data: {
      userId: d.userId ?? null,
      sessionId: d.sessionId ?? null,
      feature: d.feature ?? null,
      step: d.step,
      provider: getProvider().name,
      model: d.model,
      inputTokens: d.inputTokens,
      outputTokens: d.outputTokens,
      costUsd: costUsd(d.model, d.inputTokens, d.outputTokens),
      success: d.success,
    },
  });
}

/**
 * Run one LLM completion with retry/backoff + circuit breaker + cost logging.
 * Throws on terminal failure — the caller degrades to STATIC.
 */
export async function llmComplete(opts: {
  step: LLMStep;
  system: string;
  messages: LLMMessage[];
  maxTokens?: number;
  userId?: number | null;
  sessionId?: number | null;
  /** Which product is spending the tokens. Optional so existing callers keep
   *  compiling; unlabelled calls simply report as "không rõ" in the admin view
   *  rather than being attributed to the wrong feature. */
  feature?: LLMFeature | null;
  maxRetries?: number; // override — latency-sensitive callers use fewer
  timeoutMs?: number; // override per-call timeout
}): Promise<LLMResult> {
  const provider = getProvider();
  const model = modelForStep(opts.step);
  const maxRetries = opts.maxRetries ?? (Number(process.env.LLM_MAX_RETRIES) || 3);
  let lastErr: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await provider.complete(model, opts.system, opts.messages, { maxTokens: opts.maxTokens, timeoutMs: opts.timeoutMs });
      recordSuccess(opts.feature);
      await logLlmCall({ userId: opts.userId, sessionId: opts.sessionId, feature: opts.feature, step: opts.step, model, inputTokens: result.inputTokens, outputTokens: result.outputTokens, success: true }).catch(() => {});
      return result;
    } catch (e) {
      lastErr = e;
      if (e instanceof LLMError && !e.retryable) break; // 4xx / no-key → don't retry
      if (attempt < maxRetries) await sleep(Math.min(8000, 500 * 2 ** attempt)); // exp backoff
    }
  }
  recordFailure(opts.feature);
  // Never charge quota for a failed call → log with zero tokens.
  await logLlmCall({ userId: opts.userId, sessionId: opts.sessionId, feature: opts.feature, step: opts.step, model, inputTokens: 0, outputTokens: 0, success: false }).catch(() => {});
  throw lastErr;
}

/** Per-user daily token cap. Returns true if the user is under cap (or no cap set). */
export async function checkTokenQuota(userId: number): Promise<boolean> {
  const cap = Number(process.env.INTERVIEW_DAILY_TOKEN_CAP);
  if (!Number.isFinite(cap) || cap <= 0) return true;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const agg = await prisma.interviewLLMCallLog.aggregate({
    where: { userId, createdAt: { gte: start }, success: true },
    _sum: { inputTokens: true, outputTokens: true },
  });
  const used = (agg._sum.inputTokens ?? 0) + (agg._sum.outputTokens ?? 0);
  return used < cap;
}

/** Admin cost dashboard data: spend + token totals + per-model breakdown. */
export async function getUsageStats() {
  const total = await prisma.interviewLLMCallLog.aggregate({
    _sum: { inputTokens: true, outputTokens: true, costUsd: true },
    _count: { _all: true },
  });
  const byModel = await prisma.interviewLLMCallLog.groupBy({
    by: ['model', 'success'],
    _sum: { inputTokens: true, outputTokens: true, costUsd: true },
    _count: { _all: true },
  });
  return {
    aiAvailable: isAiAvailable(),
    forceStatic: isForceStatic(),
    hasKey: hasKey(),
    totalCalls: total._count._all,
    totalInputTokens: total._sum.inputTokens ?? 0,
    totalOutputTokens: total._sum.outputTokens ?? 0,
    totalCostUsd: Number(total._sum.costUsd ?? 0),
    byModel: byModel.map((r) => ({
      model: r.model,
      success: r.success,
      calls: r._count._all,
      inputTokens: r._sum.inputTokens ?? 0,
      outputTokens: r._sum.outputTokens ?? 0,
      costUsd: Number(r._sum.costUsd ?? 0),
    })),
  };
}

/** Extract a JSON object from possibly-fenced model text. Throws if unparseable. */
export function extractJson<T = unknown>(text: string): T {
  let t = (text || '').trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const first = t.indexOf('{');
  const last = t.lastIndexOf('}');
  if (first >= 0 && last > first) t = t.slice(first, last + 1);
  // Repair unescaped raw control chars inside strings ("Bad control character").
  t = t.replace(/[\x00-\x1F]+/g, ' ');
  return JSON.parse(t) as T;
}
