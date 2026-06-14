import OpenAI from 'openai';
import { AppError } from '../middleware/errorHandler.js';
import { config } from '../config/env.js';

/**
 * AI Provider abstraction.
 *
 * Mục đích: Chuẩn hoá việc dùng nhiều AI provider (Groq, OpenAI, OpenRouter,
 * self-host llama.cpp, ...) thông qua 1 interface duy nhất.
 *
 * Ưu điểm:
 * 1. Đổi provider = đổi .env, KHÔNG cần sửa code.
 * 2. Auto-fallback: Groq down → thử OpenRouter → thử OpenAI.
 * 3. Retry với exponential backoff cho mỗi provider.
 * 4. Tracking thời gian + số lần retry để debug.
 *
 * Sau này muốn thêm provider (Claude, Gemini, Bedrock, ...) chỉ cần thêm 1
 * entry vào `PROVIDERS` array. Cấu trúc này đảm bảo code gọi AI ở
 * `ai.service.ts` KHÔNG CẦN thay đổi khi đổi provider.
 */

export interface AIProviderConfig {
  /** Tên hiển thị (chỉ để log) */
  name: string;
  /** Tên biến env chứa API key. Nếu rỗng → provider bị skip */
  apiKeyEnv: string;
  /** Tên biến env chứa model. Nếu rỗng → dùng default */
  modelEnv: string;
  /** Model mặc định nếu không set env */
  defaultModel: string;
  /** baseURL cho OpenAI-compatible API. null = OpenAI mặc định */
  baseURL: string | null;
  /** Ưu tiên (1 = cao nhất, thử trước) */
  priority: number;
  /** Bật/tắt provider này */
  enabled: boolean;
}

export interface ChatRequest {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ChatResponse {
  text: string;
  provider: string;
  model: string;
  durationMs: number;
  attempts: number;
}

/**
 * Danh sách providers, xếp theo priority.
 *
 * Thứ tự thử khi fallback:
 * 1. Groq (free, nhanh, OpenAI-compatible) — ưu tiên #1
 * 2. OpenRouter (1 key cho 200+ models) — fallback #1
 * 3. OpenAI (trả phí, chất lượng cao nhất) — fallback #2
 *
 * Mỗi provider có apiKey riêng → có thể tắt/bật độc lập qua .env.
 */
const PROVIDERS: AIProviderConfig[] = [
  {
    name: 'groq',
    apiKeyEnv: 'GROQ_API_KEY',
    modelEnv: 'GROQ_CHAT_MODEL',
    defaultModel: 'llama-3.1-8b-instant',
    baseURL: 'https://api.groq.com/openai/v1',
    priority: 1,
    enabled: true,
  },
  {
    name: 'openrouter',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    modelEnv: 'OPENROUTER_CHAT_MODEL',
    defaultModel: 'meta-llama/llama-3.1-8b-instruct:free',
    baseURL: 'https://openrouter.ai/api/v1',
    priority: 2,
    enabled: true,
  },
  {
    name: 'openai',
    apiKeyEnv: 'OPENAI_API_KEY',
    modelEnv: 'OPENAI_CHAT_MODEL',
    defaultModel: 'gpt-4o-mini',
    baseURL: null,
    priority: 3,
    enabled: true,
  },
];

/**
 * Cache client theo tên provider. Lazy init.
 */
const _clients: Record<string, OpenAI> = {};

function getClient(provider: AIProviderConfig): OpenAI {
  if (_clients[provider.name]) return _clients[provider.name];

  const apiKey = process.env[provider.apiKeyEnv];
  if (!apiKey) {
    throw new AppError(
      `${provider.apiKeyEnv} is not configured`,
      503,
      'AI_NOT_CONFIGURED',
    );
  }

  const clientConfig: ConstructorParameters<typeof OpenAI>[0] = { apiKey };
  if (provider.baseURL) clientConfig.baseURL = provider.baseURL;

  _clients[provider.name] = new OpenAI(clientConfig);
  console.log(
    `[AIProviders] Initialized client: ${provider.name} → ${provider.baseURL ?? 'api.openai.com'}`,
  );
  return _clients[provider.name];
}

function getModel(provider: AIProviderConfig): string {
  return process.env[provider.modelEnv] || provider.defaultModel;
}

/**
 * Lấy danh sách providers khả dụng (có apiKey) theo priority.
 */
function getAvailableProviders(): AIProviderConfig[] {
  return PROVIDERS.filter((p) => {
    if (!p.enabled) return false;
    return !!process.env[p.apiKeyEnv];
  }).sort((a, b) => a.priority - b.priority);
}

/**
 * Retry config: 3 lần với exponential backoff (1s, 2s, 4s).
 */
const MAX_RETRIES_PER_PROVIDER = 3;
const RETRY_BASE_DELAY_MS = 1000;

// ============================================================
// CIRCUIT BREAKER (skip providers đang lỗi tạm thời)
// ============================================================
//
// Khi 1 provider fail nhiều lần (429, 5xx, timeout), ta "mở cầu dao"
// → skip nó trong 1 khoảng thời gian → không waste request.
// Sau khi hết cooldown, tự động thử lại (half-open).
// Nếu thành công → đóng cầu dao, ưu tiên lại provider đó.
//
// Lợi ích:
// - Latency thấp hơn khi 1 provider down (không phải đợi retry 7s)
// - Tự động "quay lại" provider yêu thích (Groq) khi nó recover
// - Admin không cần manually disable provider
//
// Cooldown duration phụ thuộc vào loại lỗi:
// - 401/403 (auth fail): 5 phút (admin cần fix key)
// - 429 (rate limit): 60s (Groq reset quota nhanh)
// - 5xx/timeout: 60s (server thường recover trong vài chục giây)
// ============================================================

interface CircuitState {
  consecutiveFailures: number;
  cooldownUntil: number | null;
  lastError: string | null;
  lastErrorCode: 'AUTH' | 'RATE_LIMIT' | 'SERVER_ERROR' | 'TIMEOUT' | 'UNKNOWN' | null;
  openedAt: number | null;
}

const COOLDOWN_MS = {
  AUTH: 5 * 60 * 1000,        // 5 phút cho 401/403
  RATE_LIMIT: 60 * 1000,      // 60s cho 429
  SERVER_ERROR: 60 * 1000,    // 60s cho 5xx
  TIMEOUT: 30 * 1000,         // 30s cho timeout
  UNKNOWN: 45 * 1000,         // 45s mặc định
};

const FAILURE_THRESHOLD = 2;  // Số lần fail liên tiếp trước khi mở cầu dao

const _circuitState: Record<string, CircuitState> = {};

/**
 * Lấy trạng thái circuit của 1 provider (auto init).
 */
function getCircuit(name: string): CircuitState {
  if (!_circuitState[name]) {
    _circuitState[name] = {
      consecutiveFailures: 0,
      cooldownUntil: null,
      lastError: null,
      lastErrorCode: null,
      openedAt: null,
    };
  }
  return _circuitState[name];
}

/**
 * Phân loại lỗi để quyết định cooldown duration.
 */
function classifyError(errMsg: string): 'AUTH' | 'RATE_LIMIT' | 'SERVER_ERROR' | 'TIMEOUT' | 'UNKNOWN' {
  const m = errMsg.toLowerCase();
  if (m.includes('401') || m.includes('403') || m.includes('unauthorized') || m.includes('forbidden')) return 'AUTH';
  if (m.includes('429') || m.includes('rate limit') || m.includes('quota')) return 'RATE_LIMIT';
  if (m.includes('timeout') || m.includes('econnreset') || m.includes('etimedout')) return 'TIMEOUT';
  if (m.includes('500') || m.includes('502') || m.includes('503') || m.includes('504')) return 'SERVER_ERROR';
  return 'UNKNOWN';
}

/**
 * Kiểm tra provider có đang trong cooldown không.
 * Tự động "half-open" (cho phép thử lại 1 lần) nếu đã hết cooldown.
 */
function isCircuitOpen(name: string): { open: boolean; reason?: string; retryIn?: number } {
  const c = getCircuit(name);
  if (!c.cooldownUntil) return { open: false };

  const now = Date.now();
  if (now >= c.cooldownUntil) {
    console.log(`[CircuitBreaker] ${name} cooldown expired, half-open (try 1 request)`);
    return { open: false };
  }

  const retryIn = Math.ceil((c.cooldownUntil - now) / 1000);
  return { open: true, reason: c.lastError || 'unknown', retryIn };
}

/**
 * Mở cầu dao (skip provider trong X giây).
 */
function tripCircuit(name: string, errMsg: string): void {
  const c = getCircuit(name);
  c.consecutiveFailures += 1;
  c.lastError = errMsg;
  c.lastErrorCode = classifyError(errMsg);

  // Sau N lần fail liên tiếp (hoặc 1 lần với 429/401) → mở cầu dao
  const shouldTrip = c.consecutiveFailures >= FAILURE_THRESHOLD;
  const isCriticalError = c.lastErrorCode === 'AUTH' || c.lastErrorCode === 'RATE_LIMIT';

  if (shouldTrip || isCriticalError) {
    const errorCode = c.lastErrorCode ?? 'UNKNOWN';
    const cooldown = COOLDOWN_MS[errorCode];
    c.cooldownUntil = Date.now() + cooldown;
    c.openedAt = Date.now();
    console.warn(
      `[CircuitBreaker] ⚡ OPENED ${name} for ${cooldown / 1000}s ` +
      `(${c.lastErrorCode}, ${c.consecutiveFailures} consecutive fails): ${errMsg.slice(0, 100)}`,
    );
  } else {
    console.warn(
      `[CircuitBreaker] ${name} failure ${c.consecutiveFailures}/${FAILURE_THRESHOLD}: ${errMsg.slice(0, 100)}`,
    );
  }
}

/**
 * Đóng cầu dao (reset counter khi provider work).
 */
function closeCircuit(name: string): void {
  const c = getCircuit(name);
  if (c.consecutiveFailures > 0 || c.cooldownUntil) {
    console.log(
      `[CircuitBreaker] ✓ CLOSED ${name} (recovered after ${c.consecutiveFailures} fails)`,
    );
  }
  c.consecutiveFailures = 0;
  c.cooldownUntil = null;
  c.lastError = null;
  c.lastErrorCode = null;
  c.openedAt = null;
}

/**
 * Sleep helper.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Kiểm tra lỗi có nên retry không.
 * - 429 (rate limit): retry
 * - 5xx (server error): retry
 * - 408 (timeout): retry
 * - Network errors: retry
 * - 4xx khác (400, 401, 403, 404): KHÔNG retry (lỗi cấu hình)
 */
function isRetryable(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  if (msg.includes('429') || msg.includes('rate limit')) return true;
  if (msg.includes('500') || msg.includes('502') || msg.includes('503') || msg.includes('504')) return true;
  if (msg.includes('timeout') || msg.includes('econnreset') || msg.includes('etimedout')) return true;
  if (msg.includes('api key') || msg.includes('unauthorized') || msg.includes('401')) return false;
  if (msg.includes('model') && msg.includes('not found')) return false;
  return true; // Default: retry (cho network errors)
}

/**
 * Gọi 1 provider, có retry với exponential backoff.
 */
async function callProvider(
  provider: AIProviderConfig,
  request: ChatRequest,
  attemptLog: string[],
): Promise<{ text: string; durationMs: number; attempts: number }> {
  const client = getClient(provider);
  const model = getModel(provider);
  const start = Date.now();

  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES_PER_PROVIDER; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model,
        messages: request.messages,
        max_tokens: request.maxTokens ?? config.aiMaxTokens,
        temperature: request.temperature ?? config.aiTemperature,
        stream: false, // Non-streaming only, để dễ fallback
      });

      const text = response.choices[0]?.message?.content || '';
      const durationMs = Date.now() - start;
      attemptLog.push(`${provider.name}✓ (${attempt} attempt, ${durationMs}ms)`);
      return { text, durationMs, attempts: attempt };
    } catch (err) {
      lastErr = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      const willRetry = attempt < MAX_RETRIES_PER_PROVIDER && isRetryable(err);
      attemptLog.push(
        `${provider.name}✗ (attempt ${attempt}/${MAX_RETRIES_PER_PROVIDER}, ${
          willRetry ? 'retry' : 'skip'
        }): ${errMsg.slice(0, 80)}`,
      );

      if (!willRetry) break;

      // Exponential backoff: 1s, 2s, 4s
      const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }

  throw lastErr;
}

/**
 * Gọi AI với auto-fallback qua nhiều providers, có circuit breaker.
 *
 * Flow:
 * 1. Lấy danh sách providers có apiKey (theo priority)
 * 2. Với mỗi provider:
 *    a. Check circuit breaker → nếu open → skip ngay
 *    b. Nếu closed/half-open → thử gọi
 *    c. Thành công → close circuit, ưu tiên lại provider
 *    d. Fail → trip circuit, chuyển provider tiếp theo
 * 3. Nếu TẤT CẢ providers fail → throw lỗi cuối cùng
 *
 * @returns ChatResponse kèm metadata: provider nào đã trả lời, số attempts, thời gian
 */
export async function chatWithFallback(
  request: ChatRequest,
): Promise<ChatResponse> {
  const available = getAvailableProviders();
  if (available.length === 0) {
    throw new AppError(
      'No AI provider is configured. Set GROQ_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY in .env',
      503,
      'AI_NOT_CONFIGURED',
    );
  }

  const attemptLog: string[] = [];
  const skippedLog: string[] = [];
  const totalStart = Date.now();
  let lastErr: unknown;

  for (const provider of available) {
    // Check circuit breaker TRƯỚC khi gọi
    const circuit = isCircuitOpen(provider.name);
    if (circuit.open) {
      skippedLog.push(`${provider.name}⏸️ (circuit open, retry in ${circuit.retryIn}s)`);
      console.warn(
        `[AIProviders] ⏸️ Skipping ${provider.name} (circuit open, retry in ${circuit.retryIn}s): ${circuit.reason}`,
      );
      continue;
    }

    try {
      const result = await callProvider(provider, request, attemptLog);
      const totalDuration = Date.now() - totalStart;
      // Đóng circuit khi provider work
      closeCircuit(provider.name);
      console.log(
        `[AIProviders] ✓ Answered by ${provider.name} (${result.durationMs}ms, ${result.attempts} attempt, total ${totalDuration}ms): ${attemptLog.join(' → ')}`,
      );
      return {
        text: result.text,
        provider: provider.name,
        model: getModel(provider),
        durationMs: totalDuration,
        attempts: result.attempts,
      };
    } catch (err) {
      lastErr = err;
      // Mở circuit khi provider fail
      const errMsg = err instanceof Error ? err.message : String(err);
      tripCircuit(provider.name, errMsg);
      // Log chi tiết, rồi tiếp tục thử provider tiếp theo
      console.warn(
        `[AIProviders] Provider ${provider.name} failed after retries, trying next: ${errMsg}`,
      );
    }
  }

  // Tất cả providers đều fail (hoặc bị circuit-open)
  const errMsg = lastErr instanceof Error ? lastErr.message : 'All providers circuit-open or failed';
  const skipped = skippedLog.length > 0 ? ` Skipped: ${skippedLog.join(', ')}.` : '';
  throw new AppError(
    `All AI providers failed: ${errMsg}. Attempted: ${attemptLog.join(' → ')}.${skipped}`,
    503,
    'AI_ALL_PROVIDERS_FAILED',
  );
}

/**
 * Reset client cache — dùng khi đổi API key mà không restart process.
 */
export function resetProviderClients(): void {
  Object.keys(_clients).forEach((k) => delete _clients[k]);
  console.log('[AIProviders] All client caches reset');
}

/**
 * Lấy danh sách providers đang hoạt động (cho admin debug endpoint).
 */
export function listActiveProviders(): Array<{
  name: string;
  model: string;
  baseURL: string | null;
  priority: number;
}> {
  return getAvailableProviders().map((p) => ({
    name: p.name,
    model: getModel(p),
    baseURL: p.baseURL,
    priority: p.priority,
  }));
}

/**
 * Lấy trạng thái circuit breaker của tất cả providers (cho admin debug).
 */
export function getAllCircuitStates(): Record<string, {
  consecutiveFailures: number;
  cooldownUntil: string | null;
  cooldownRemainingSec: number | null;
  lastError: string | null;
  lastErrorCode: string | null;
  status: 'closed' | 'open' | 'half-open';
}> {
  const out: Record<string, ReturnType<typeof getAllCircuitStates>[string]> = {};
  const providers = ['groq', 'openrouter', 'openai'];
  for (const name of providers) {
    const c = getCircuit(name);
    const now = Date.now();
    let status: 'closed' | 'open' | 'half-open' = 'closed';
    let remaining: number | null = null;
    if (c.cooldownUntil) {
      if (now >= c.cooldownUntil) {
        status = 'half-open';
      } else {
        status = 'open';
        remaining = Math.ceil((c.cooldownUntil - now) / 1000);
      }
    }
    out[name] = {
      consecutiveFailures: c.consecutiveFailures,
      cooldownUntil: c.cooldownUntil ? new Date(c.cooldownUntil).toISOString() : null,
      cooldownRemainingSec: remaining,
      lastError: c.lastError,
      lastErrorCode: c.lastErrorCode,
      status,
    };
  }
  return out;
}

/**
 * Reset thủ công circuit breaker cho 1 provider (admin tool).
 */
export function resetCircuitManually(name: string): void {
  closeCircuit(name);
  console.log(`[CircuitBreaker] Manual reset for ${name}`);
}

// ============================================================
// EMBEDDINGS (local, no external API)
// ============================================================
//
// Uses @xenova/transformers (Transformers.js) running an ONNX model
// locally — no API key, no network, no cost.
//
// Model: Xenova/all-MiniLM-L6-v2
//   - 384-dim embeddings
//   - ~22MB ONNX model (downloaded once on first use, then cached)
//   - Trained on 1B+ sentence pairs (great general-purpose quality)
//   - ~50-200ms per embedding on CPU
//
// For corpora < 10K chunks this is plenty fast. If we ever need
// better quality we can swap to Xenova/bge-small-en-v1.5 (384-dim,
// higher quality) or Xenova/bge-large-en-v1.5 (1024-dim, best).
//
// We update the storage type from `vector(768)` to `vector(384)` in
// the column comment; the JSONB column itself is dimension-agnostic.

// IMPORTANT: `@xenova/transformers` brings in `onnxruntime-node`, a native
// binding that requires glibc. Alpine containers in production (and many
// minimal Docker base images) use musl — loading the module crashes the
// whole process with `ERR_DLOPEN_FAILED` because it can't find
// `ld-linux-x86-64.so.2`. To keep the AI / embeddings service usable on
// Alpine WITHOUT crashing the entire server, we lazy-load transformers
// inside `getEmbedder()`. The top-level import has been removed; nothing
// references these symbols before they're actually needed.
let _pipeline: typeof import('@xenova/transformers').pipeline | null = null;
let _env: typeof import('@xenova/transformers').env | null = null;

async function loadTransformers() {
  if (!_pipeline || !_env) {
    const mod = await import('@xenova/transformers');
    _pipeline = mod.pipeline;
    _env = mod.env;
    // Allow model download to be cached in /app (in container)
    _env.cacheDir = process.env.TRANSFORMERS_CACHE || '/app/.cache/transformers';
  }
  return { pipeline: _pipeline!, env: _env! };
}

let _embedder: any = null;
let _initPromise: Promise<any> | null = null;
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';
export const EMBEDDING_DIM = 384;

async function getEmbedder() {
  if (_embedder) return _embedder;
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    const { pipeline } = await loadTransformers();
    console.log(`[Embeddings] Loading local model ${EMBEDDING_MODEL}...`);
    const start = Date.now();
    _embedder = await pipeline('feature-extraction', EMBEDDING_MODEL);
    console.log(`[Embeddings] Model loaded in ${Date.now() - start}ms`);
    return _embedder;
  })();
  return _initPromise;
}

/**
 * Compute embedding vector for a single text using local model.
 * Returns a 384-dim float array (L2-normalized).
 */
export async function computeEmbedding(text: string): Promise<number[]> {
  const embedder = await getEmbedder();
  const result = await embedder(text.slice(0, 512), { pooling: 'mean', normalize: true });
  return Array.from(result.data as Float32Array);
}

/**
 * Compute embeddings for multiple texts sequentially.
 * (Local model is single-threaded, parallel calls would not help.)
 */
export async function computeEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const embedder = await getEmbedder();
  const out: number[][] = [];
  for (const text of texts) {
    const result = await embedder(text.slice(0, 512), { pooling: 'mean', normalize: true });
    out.push(Array.from(result.data as Float32Array));
  }
  return out;
}

/**
 * Cosine similarity between two vectors. Returns value in [-1, 1].
 * For normalized embeddings (which OpenAI/Groq returns) it's in [0, 1].
 *
 * O(N) where N is the embedding dimension (768 for nomic-embed-text-v1.5).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
