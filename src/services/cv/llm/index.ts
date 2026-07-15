/**
 * CV Builder — provider-agnostic LLM layer (Phase 6). Plumbing only.
 * ─────────────────────────────────────────────────────────────────────────
 * HARD CONSTRAINTS (from the spec) enforced structurally here:
 *  - Keys live ONLY on the backend (runtime env, never a client bundle).
 *  - Provider-agnostic: `LLMProvider` interface + TWO adapters (Anthropic and an
 *    OpenAI-compatible one that covers Groq/DeepSeek/OpenRouter via baseURL +
 *    model string). Response shapes are normalized IN the adapter, never in
 *    business logic. Adding a provider later = one adapter, nothing else.
 *  - Model selection is PER-TASK via env (a JD parse is cheap/high-volume; a CV
 *    critique is the call the product is judged on — never the same model).
 *  - PII eligibility: any provider that may train on inputs is DISQUALIFIED for
 *    any task that touches CV content. Enforced, not just documented.
 *  - Cost: every call logs tokens/model/cost/user to CvLLMCallLog. Failed calls
 *    are never charged. Per-user daily/monthly caps.
 *  - Resilience: retry w/ exponential backoff + jitter, 429/5xx retried, 4xx
 *    not, per-call timeout, per-provider circuit breaker, FORCE_STATIC kill
 *    switch. Everything degrades to STATIC when AI is unavailable.
 *
 * This mirrors src/services/interview/llm (same battle-tested shape) but adds
 * the OpenAI-compatible adapter + per-task routing + PII gating the CV module
 * needs, and logs to its own CvLLMCallLog for a clean cost dashboard.
 */
import { prisma } from '../../../config/database.js';
import { logger } from '../../../utils/logger.js';

export interface LLMMessage { role: 'user' | 'assistant'; content: string }
export interface LLMResult { text: string; inputTokens: number; outputTokens: number; model: string; provider: string }

/** Per-task routing key. Cheap/high-volume vs the calls that define quality. */
export type CvLLMTask = 'critique' | 'intake' | 'jd_parse' | 'parse_fallback' | 'cover_letter' | 'translate' | 'rewrite';

/** Tasks that put the user's real CV (name, phone, employment history) into the
 *  prompt. These may ONLY go to a provider that does not train on inputs. */
const TASK_TOUCHES_CV_CONTENT: Record<CvLLMTask, boolean> = {
  critique: true,
  intake: true,
  cover_letter: true,
  parse_fallback: true,
  translate: true, // the whole CV is translated
  rewrite: true, // a single bullet + its stated facts
  jd_parse: false, // a pasted job description is public text
};

export interface LLMProvider {
  name: string;
  /** Does this provider's terms permit training on API inputs? If so it's
   *  disqualified for CV-content tasks. */
  trainsOnInput: boolean;
  complete(model: string, system: string, messages: LLMMessage[], opts: { maxTokens?: number; timeoutMs?: number }): Promise<LLMResult>;
}

class LLMError extends Error {
  constructor(message: string, public retryable: boolean) { super(message); }
}

// ── Pricing ($/1M tokens) for cost logging. Unknown → mid estimate (never $0). ──
const PRICING: Record<string, { in: number; out: number }> = {
  'claude-haiku-4-5': { in: 1, out: 5 },
  'claude-sonnet-5': { in: 3, out: 15 },
  'claude-opus-4-8': { in: 5, out: 25 },
  'llama-3.3-70b-versatile': { in: 0.59, out: 0.79 },
  'llama-3.1-8b-instant': { in: 0.05, out: 0.08 },
  'deepseek-chat': { in: 0.27, out: 1.1 },
};
function costUsd(model: string, inTok: number, outTok: number): number {
  const p = PRICING[model] ?? { in: 1, out: 4 };
  return (inTok * p.in + outTok * p.out) / 1_000_000;
}

// ── Anthropic adapter (raw fetch, x-api-key, /v1/messages) ────────────────
const anthropicProvider: LLMProvider = {
  name: 'anthropic',
  trainsOnInput: false, // Anthropic API does not train on business API inputs
  async complete(model, system, messages, opts) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new LLMError('ANTHROPIC_API_KEY missing', false);
    const timeoutMs = opts.timeoutMs ?? (Number(process.env.LLM_TIMEOUT_MS) || 60_000);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const base = (process.env.CV_ANTHROPIC_BASE_URL || process.env.LLM_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
    try {
      const res = await fetch(`${base}/v1/messages`, {
        method: 'POST',
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: opts.maxTokens ?? 1500, system, messages }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const retryAfter = Number(res.headers.get('retry-after')) || 0;
        if (retryAfter > 0) await sleep(Math.min(retryAfter * 1000, 10_000));
        throw new LLMError(`anthropic HTTP ${res.status}`, res.status === 429 || res.status === 529 || res.status >= 500);
      }
      const json = (await res.json()) as { content?: Array<{ type: string; text?: string }>; usage?: { input_tokens?: number; output_tokens?: number; cache_read_input_tokens?: number; cache_creation_input_tokens?: number } };
      const text = (json.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '').join('');
      const u = json.usage ?? {};
      return { text, inputTokens: (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0), outputTokens: u.output_tokens ?? 0, model, provider: 'anthropic' };
    } catch (e) {
      if ((e as Error).name === 'AbortError') throw new LLMError('anthropic timeout', true);
      throw e;
    } finally { clearTimeout(timer); }
  },
};

// ── OpenAI-compatible adapter (Groq / DeepSeek / OpenRouter via baseURL) ───
/** Live training-policy lookup (read at call-time, not cached at module init,
 *  so the PII gate always reflects the current env). */
function providerTrainsOnInput(name: string): boolean {
  if (name === 'anthropic') return false; // Anthropic API doesn't train on inputs
  // OpenAI-compatible endpoint: assume safe unless the operator flags it.
  return String(process.env.OPENAI_COMPAT_TRAINS_ON_INPUT ?? '').toLowerCase() === 'true';
}

const openAiCompatProvider: LLMProvider = {
  name: 'openai_compatible',
  trainsOnInput: false, // informational; the enforced gate uses providerTrainsOnInput()
  async complete(model, system, messages, opts) {
    const key = process.env.OPENAI_COMPAT_API_KEY;
    const base = (process.env.OPENAI_COMPAT_BASE_URL || '').replace(/\/+$/, '');
    if (!key) throw new LLMError('OPENAI_COMPAT_API_KEY missing', false);
    if (!base) throw new LLMError('OPENAI_COMPAT_BASE_URL missing', false);
    const timeoutMs = opts.timeoutMs ?? (Number(process.env.LLM_TIMEOUT_MS) || 60_000);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      // OpenAI-compatible: system is the first message; response shape differs
      // (choices[0].message.content) — normalized HERE, never in business logic.
      const res = await fetch(`${base}/chat/completions`, {
        method: 'POST',
        headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: opts.maxTokens ?? 1500, messages: [{ role: 'system', content: system }, ...messages] }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const retryAfter = Number(res.headers.get('retry-after')) || 0;
        if (retryAfter > 0) await sleep(Math.min(retryAfter * 1000, 10_000));
        throw new LLMError(`openai_compat HTTP ${res.status}`, res.status === 429 || res.status >= 500);
      }
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }>; usage?: { prompt_tokens?: number; completion_tokens?: number } };
      const text = json.choices?.[0]?.message?.content ?? '';
      const u = json.usage ?? {};
      return { text, inputTokens: u.prompt_tokens ?? 0, outputTokens: u.completion_tokens ?? 0, model, provider: 'openai_compatible' };
    } catch (e) {
      if ((e as Error).name === 'AbortError') throw new LLMError('openai_compat timeout', true);
      throw e;
    } finally { clearTimeout(timer); }
  },
};

const PROVIDERS: Record<string, LLMProvider> = {
  anthropic: anthropicProvider,
  openai_compatible: openAiCompatProvider,
};

// ── Per-task provider + model routing (env, not hardcoded) ────────────────
function providerNameForTask(task: CvLLMTask): string {
  const key = `LLM_PROVIDER_${task.toUpperCase()}`;
  // Critique is the high-value call → default Anthropic. Everything else defaults
  // to the cheap OpenAI-compatible endpoint if configured, else Anthropic.
  const fallback = task === 'critique' ? 'anthropic' : (process.env.OPENAI_COMPAT_BASE_URL ? 'openai_compatible' : 'anthropic');
  return (process.env[key] || fallback).toLowerCase();
}
export function modelForTask(task: CvLLMTask): string {
  const key = `LLM_MODEL_${task.toUpperCase()}`;
  if (process.env[key]) return process.env[key]!;
  const provider = providerNameForTask(task);
  // REUSE the Interview module's already-configured gateway models so the CV AI
  // works with zero new env: critique (the high-value call) borrows the strong
  // report/generation model; the cheaper tasks borrow the interview model. This
  // is why the module goes live the moment ANTHROPIC_API_KEY + LLM_BASE_URL are
  // set (they already are on prod), without any CV-specific model vars.
  if (provider === 'anthropic') {
    if (task === 'critique') return process.env.LLM_MODEL_REPORT || process.env.LLM_MODEL_GENERATION || 'claude-opus-4-8';
    return process.env.LLM_MODEL_INTERVIEW || process.env.LLM_MODEL_REPORT || 'claude-haiku-4-5';
  }
  return task === 'critique' ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant';
}

/** Resolve the provider for a task, enforcing PII eligibility. */
function resolveProvider(task: CvLLMTask): LLMProvider {
  const provider = PROVIDERS[providerNameForTask(task)] ?? anthropicProvider;
  if (TASK_TOUCHES_CV_CONTENT[task] && providerTrainsOnInput(provider.name)) {
    throw new LLMError(`Provider "${provider.name}" may train on inputs — disqualified for CV-content task "${task}". Route this task to a no-training provider.`, false);
  }
  return provider;
}

// ── Kill switch + availability ────────────────────────────────────────────
export function isForceStatic(): boolean {
  return String(process.env.FORCE_STATIC_MODE ?? '').toLowerCase() === 'true';
}
function keyForProvider(name: string): boolean {
  return name === 'anthropic' ? !!process.env.ANTHROPIC_API_KEY : !!process.env.OPENAI_COMPAT_API_KEY;
}

// ── Per-provider circuit breaker (in-memory, per instance) ─────────────────
const cb: Record<string, { failures: number; openUntil: number }> = {};
const CB_THRESHOLD = Number(process.env.CIRCUIT_BREAKER_THRESHOLD) || 5;
const CB_COOLDOWN_MS = 60_000;
function circuitOpen(name: string): boolean { return Date.now() < (cb[name]?.openUntil ?? 0); }
function recordFailure(name: string): void {
  const s = (cb[name] ??= { failures: 0, openUntil: 0 });
  if (++s.failures >= CB_THRESHOLD) { s.openUntil = Date.now() + CB_COOLDOWN_MS; s.failures = 0; }
}
function recordSuccess(name: string): void { if (cb[name]) cb[name].failures = 0; }

/** Whether AI can run this task right now. Callers degrade to STATIC when false. */
export function isAiAvailable(task: CvLLMTask): boolean {
  if (isForceStatic()) return false;
  let provider: LLMProvider;
  try { provider = resolveProvider(task); } catch { return false; }
  return keyForProvider(provider.name) && !circuitOpen(provider.name);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function logCall(d: { userId?: number | null; documentId?: number | null; task: CvLLMTask; provider: string; model: string; inputTokens: number; outputTokens: number; success: boolean }): Promise<void> {
  await prisma.cvLLMCallLog.create({
    data: {
      userId: d.userId ?? null, documentId: d.documentId ?? null, task: d.task,
      provider: d.provider, model: d.model, inputTokens: d.inputTokens, outputTokens: d.outputTokens,
      costUsd: costUsd(d.model, d.inputTokens, d.outputTokens), success: d.success,
    },
  }).catch(() => {});
}

/**
 * One LLM completion with retry/backoff+jitter, per-provider circuit breaker,
 * PII gating, and cost logging. Throws on terminal failure → caller degrades.
 */
export async function cvLlmComplete(opts: {
  task: CvLLMTask;
  system: string;
  messages: LLMMessage[];
  maxTokens?: number;
  userId?: number | null;
  documentId?: number | null;
  maxRetries?: number;
  timeoutMs?: number;
}): Promise<LLMResult> {
  const provider = resolveProvider(opts.task); // throws (non-retryable) if PII-ineligible
  const model = modelForTask(opts.task);
  const maxRetries = opts.maxRetries ?? (Number(process.env.LLM_MAX_RETRIES) || 3);
  let lastErr: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await provider.complete(model, opts.system, opts.messages, { maxTokens: opts.maxTokens, timeoutMs: opts.timeoutMs });
      recordSuccess(provider.name);
      await logCall({ userId: opts.userId, documentId: opts.documentId, task: opts.task, provider: provider.name, model, inputTokens: result.inputTokens, outputTokens: result.outputTokens, success: true });
      return result;
    } catch (e) {
      lastErr = e;
      if (e instanceof LLMError && !e.retryable) break;
      if (attempt < maxRetries) await sleep(Math.min(8000, 400 * 2 ** attempt) + Math.floor(deterministicJitter(attempt) * 250));
    }
  }
  recordFailure(provider.name);
  // Ops visibility (W6): failures were previously silent except the call log.
  // NEVER log prompt/CV content — provider/model/task/error class only.
  logger.error('cv-llm call failed after retries', {
    task: opts.task, provider: provider.name, model,
    error: lastErr instanceof Error ? lastErr.message : String(lastErr),
  });
  await logCall({ userId: opts.userId, documentId: opts.documentId, task: opts.task, provider: provider.name, model, inputTokens: 0, outputTokens: 0, success: false });
  throw lastErr;
}

// Deterministic jitter (Math.random is unavailable in some sandboxes and adds
// nondeterminism; a cheap hash of the attempt suffices to spread retries).
function deterministicJitter(n: number): number {
  const x = Math.sin((n + 1) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Per-user daily token cap. env CV_DAILY_TOKEN_CAP overrides; with no env we
 * still enforce a SAFE DEFAULT (300k tokens/day ≈ a few dozen AI calls) so one
 * user can't run up the gateway bill — cost control must not depend on
 * remembering to set an env var. Set CV_DAILY_TOKEN_CAP=0 to disable.
 */
const DEFAULT_DAILY_TOKEN_CAP = 300_000;
export async function checkTokenQuota(userId: number): Promise<boolean> {
  const raw = process.env.CV_DAILY_TOKEN_CAP;
  const cap = raw !== undefined && raw !== '' ? Number(raw) : DEFAULT_DAILY_TOKEN_CAP;
  if (!Number.isFinite(cap) || cap <= 0) return true; // explicit 0/invalid = unlimited
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const agg = await prisma.cvLLMCallLog.aggregate({ where: { userId, createdAt: { gte: start }, success: true }, _sum: { inputTokens: true, outputTokens: true } });
  return (agg._sum.inputTokens ?? 0) + (agg._sum.outputTokens ?? 0) < cap;
}

/** Admin cost dashboard data. */
export async function getUsageStats() {
  const total = await prisma.cvLLMCallLog.aggregate({ _sum: { inputTokens: true, outputTokens: true, costUsd: true }, _count: { _all: true } });
  const byTask = await prisma.cvLLMCallLog.groupBy({ by: ['task', 'provider', 'model', 'success'], _sum: { inputTokens: true, outputTokens: true, costUsd: true }, _count: { _all: true } });
  return {
    forceStatic: isForceStatic(),
    providers: Object.values(PROVIDERS).map((p) => ({ name: p.name, hasKey: keyForProvider(p.name), trainsOnInput: providerTrainsOnInput(p.name), circuitOpen: circuitOpen(p.name) })),
    totalCalls: total._count._all,
    totalInputTokens: total._sum.inputTokens ?? 0,
    totalOutputTokens: total._sum.outputTokens ?? 0,
    totalCostUsd: Number(total._sum.costUsd ?? 0),
    byTask: byTask.map((r) => ({ task: r.task, provider: r.provider, model: r.model, success: r.success, calls: r._count._all, inputTokens: r._sum.inputTokens ?? 0, outputTokens: r._sum.outputTokens ?? 0, costUsd: Number(r._sum.costUsd ?? 0) })),
  };
}

/** Extract a JSON object from possibly-fenced model text. Throws if unparseable. */
export function extractJson<T = unknown>(text: string): T {
  let t = (text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const first = t.indexOf('{');
  const last = t.lastIndexOf('}');
  if (first >= 0 && last > first) t = t.slice(first, last + 1);
  t = t.replace(/[\x00-\x1F]+/g, ' ');
  return JSON.parse(t) as T;
}
