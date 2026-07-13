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
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    // Base URL is configurable → works with the official Anthropic API OR any
    // Anthropic-compatible gateway (e.g. a self-hosted proxy). Endpoint is
    // always `<base>/v1/messages`, auth is `x-api-key`.
    const base = (process.env.LLM_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
    try {
      const res = await fetch(`${base}/v1/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ model, max_tokens: opts.maxTokens ?? 1500, system, messages }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const retryable = res.status === 429 || res.status === 529 || res.status >= 500;
        throw new LLMError(`anthropic HTTP ${res.status}`, retryable);
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

function getProvider(): LLMProvider {
  // Only Anthropic implemented in Phase 4. Add adapters here keyed by LLM_PROVIDER.
  return anthropicProvider;
}

// ── Model selection per step (configurable via env, not hardcoded in logic) ──
export function modelForStep(step: LLMStep): string {
  if (step === 'report') return process.env.LLM_MODEL_REPORT || 'claude-opus-4-8';
  if (step === 'generation') return process.env.LLM_MODEL_GENERATION || 'claude-sonnet-5';
  return process.env.LLM_MODEL_INTERVIEW || 'claude-haiku-4-5'; // cheaper model for routine turns
}

// ── Kill switch + availability ────────────────────────────────────
export function isForceStatic(): boolean {
  return String(process.env.FORCE_STATIC_MODE ?? '').toLowerCase() === 'true';
}
export function hasKey(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

// ── Circuit breaker (in-memory; per backend instance) ─────────────
let cbFailures = 0;
let cbOpenUntil = 0;
const CB_THRESHOLD = 5;
const CB_COOLDOWN_MS = 60_000;
function circuitOpen(): boolean {
  return Date.now() < cbOpenUntil;
}
function recordFailure(): void {
  cbFailures += 1;
  if (cbFailures >= CB_THRESHOLD) {
    cbOpenUntil = Date.now() + CB_COOLDOWN_MS;
    cbFailures = 0;
  }
}
function recordSuccess(): void {
  cbFailures = 0;
}

/** Whether AI can be used right now. Everything downstream falls back to STATIC when false. */
export function isAiAvailable(): boolean {
  return hasKey() && !isForceStatic() && !circuitOpen();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function logLlmCall(d: {
  userId?: number | null;
  sessionId?: number | null;
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
}): Promise<LLMResult> {
  const provider = getProvider();
  const model = modelForStep(opts.step);
  const maxRetries = Number(process.env.LLM_MAX_RETRIES) || 3;
  let lastErr: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await provider.complete(model, opts.system, opts.messages, { maxTokens: opts.maxTokens });
      recordSuccess();
      await logLlmCall({ userId: opts.userId, sessionId: opts.sessionId, step: opts.step, model, inputTokens: result.inputTokens, outputTokens: result.outputTokens, success: true }).catch(() => {});
      return result;
    } catch (e) {
      lastErr = e;
      if (e instanceof LLMError && !e.retryable) break; // 4xx / no-key → don't retry
      if (attempt < maxRetries) await sleep(Math.min(8000, 500 * 2 ** attempt)); // exp backoff
    }
  }
  recordFailure();
  // Never charge quota for a failed call → log with zero tokens.
  await logLlmCall({ userId: opts.userId, sessionId: opts.sessionId, step: opts.step, model, inputTokens: 0, outputTokens: 0, success: false }).catch(() => {});
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
  let t = (text || "").trim();
  t = t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first >= 0 && last > first) t = t.slice(first, last + 1);
  // Repair unescaped raw control chars inside strings ("Bad control character").
  t = t.replace(/[\x00-\x1F]+/g, " ");
  return JSON.parse(t) as T;
}
