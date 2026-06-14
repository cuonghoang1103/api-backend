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
 * Gọi AI với auto-fallback qua nhiều providers.
 *
 * Flow:
 * 1. Lấy danh sách providers có apiKey (theo priority)
 * 2. Thử từng provider cho đến khi thành công
 * 3. Mỗi provider retry 3 lần với exponential backoff
 * 4. Nếu TẤT CẢ providers fail → throw lỗi cuối cùng
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
  const totalStart = Date.now();
  let lastErr: unknown;

  for (const provider of available) {
    try {
      const result = await callProvider(provider, request, attemptLog);
      const totalDuration = Date.now() - totalStart;
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
      // Log chi tiết, rồi tiếp tục thử provider tiếp theo
      console.warn(
        `[AIProviders] Provider ${provider.name} failed after retries, trying next: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  }

  // Tất cả providers đều fail
  const errMsg = lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new AppError(
    `All AI providers failed: ${errMsg}. Attempted: ${attemptLog.join(' → ')}`,
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

import { pipeline, env } from '@xenova/transformers';

// Allow model download to be cached in /app (in container)
// Default cache is in node_modules — works in dev, persists in /app in prod
env.cacheDir = process.env.TRANSFORMERS_CACHE || '/app/.cache/transformers';

let _embedder: any = null;
let _initPromise: Promise<any> | null = null;
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';
export const EMBEDDING_DIM = 384;

async function getEmbedder() {
  if (_embedder) return _embedder;
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
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
