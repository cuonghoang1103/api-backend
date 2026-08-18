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
import { logger } from '../../../utils/logger.js';
import { budgetMessage, checkBudget } from '../../llm/budget.js';
import {
  chatCompletionsUrl,
  chatUrlOf,
  costUsd as gatewayCostUsd,
  fallbackEndpoint,
  gatewayConfigured,
  gatewayKey,
  messagesUrl,
  modelFor,
  xinDiemCuoi,
  type LlmEndpoint,
  type LlmPurpose,
} from '../../llm/gateway.js';

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

/**
 * Interface every provider implements.
 *
 * `opts.ep` là ĐIỂM CUỐI đã được chọn cho lượt gọi này — máy nhà hay cổng.
 * Bỏ trống = cổng, giữ nguyên hành vi cũ cho những chỗ gọi thẳng provider.
 * Có nó thì địa chỉ + khoá lấy từ đó, chứ KHÔNG lấy từ `gatewayKey()` nữa:
 * đó chính là cái làm 5 việc trong `LLM_LOCAL_PURPOSES` âm thầm đi cổng suốt
 * từ 13/08 dù env đã khai báo đúng.
 */
export interface LLMProvider {
  name: string;
  complete(model: string, system: string, messages: LLMMessage[], opts: { maxTokens?: number; timeoutMs?: number; ep?: LlmEndpoint }): Promise<LLMResult>;
}

// ── Pricing lives in ONE place now: src/services/llm/gateway.ts. The table
//    used to be copied here and in cv/llm, and the two had already drifted
//    apart (this one still priced `rb-*`, a gateway that no longer exists).
const costUsd = gatewayCostUsd;

class LLMError extends Error {
  constructor(message: string, public retryable: boolean) {
    super(message);
  }
}

// ── Anthropic adapter (raw fetch — no SDK dep) ────────────────────
//
// Tuyến `/v1/messages` của cổng. Lõi này chỉ gửi văn bản nên tuyến OpenAI bên
// dưới phục vụ được hết; giữ tuyến này để ép bằng `LLM_PROVIDER=anthropic` khi
// cần so sánh hai đường, và vì AI Chat (ảnh + PDF) vẫn phải đi lối này.
const anthropicProvider: LLMProvider = {
  name: 'anthropic',
  async complete(model, system, messages, opts) {
    const key = gatewayKey();
    if (!key) throw new LLMError('Thiếu khoá cổng LLM (LLM_GATEWAY_API_KEY / OPENAI_COMPAT_API_KEY)', false);
    const timeoutMs = opts.timeoutMs ?? (Number(process.env.LLM_TIMEOUT_MS) || 60_000);
    const ctrl = new AbortController();
    let timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const url = messagesUrl();

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
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': key,
          // Cổng New API nhận cả hai kiểu xác thực; gửi cả hai để một cấu hình
          // upstream chỉ đọc Bearer vẫn qua được.
          authorization: `Bearer ${key}`,
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

// ── Tuyến OpenAI của cổng — ĐƯỜNG MẶC ĐỊNH ────────────────────────
//
// Đây là đường đã chạy thật trên production (CV Builder, Jobs AI, robot Maker
// Lab), nên nó là đường mặc định cho toàn bộ phần còn lại của web. Nó nhận
// được MỌI model của cổng, kể cả họ Claude — cổng tự dịch sang giao thức của
// nhà cung cấp gốc.
//
// KHÔNG gửi `response_format: {type:'json_object'}`: đi qua cổng gộp nhiều
// nhà, trường đó là thứ vỡ đầu tiên (có nhà trả 400, tính năng câm, log chỉ
// có "HTTP 400"). Các lời gọi ở đây yêu cầu JSON bằng prompt rồi vớt bằng
// `extractJson`, cách đó chạy được với mọi model.
const openAiCompatProvider: LLMProvider = {
  name: 'openai_compat',
  async complete(model, system, messages, opts) {
    const key = opts.ep?.key ?? gatewayKey();
    if (!key) throw new LLMError('Thiếu khoá cổng LLM (LLM_GATEWAY_API_KEY / OPENAI_COMPAT_API_KEY)', false);
    const url = opts.ep ? chatUrlOf(opts.ep) : chatCompletionsUrl();
    const timeoutMs = opts.timeoutMs ?? (Number(process.env.LLM_TIMEOUT_MS) || 60_000);
    const ctrl = new AbortController();
    let timer = setTimeout(() => ctrl.abort(), timeoutMs);

    // Cùng lý do với tuyến Anthropic: câu trả lời dài mà không stream thì
    // proxy nào đó trên đường đi sẽ bỏ cuộc trước khi model viết xong.
    const maxTokens = opts.maxTokens ?? 1500;
    const useStream = maxTokens > 4000;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [{ role: 'system', content: system }, ...messages],
          ...(useStream ? { stream: true, stream_options: { include_usage: true } } : {}),
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const retryable = res.status === 429 || res.status === 529 || res.status >= 500;
        throw new LLMError(`openai_compat HTTP ${res.status}`, retryable);
      }

      if (useStream) {
        return await readOpenAiStream(res, model, () => {
          clearTimeout(timer);
          timer = setTimeout(() => ctrl.abort(), timeoutMs);
        });
      }

      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      const text = json.choices?.[0]?.message?.content ?? '';
      const u = json.usage ?? {};
      return { text, inputTokens: u.prompt_tokens ?? 0, outputTokens: u.completion_tokens ?? 0, model };
    } catch (e) {
      if ((e as Error).name === 'AbortError') throw new LLMError('LLM timeout', true);
      throw e;
    } finally {
      clearTimeout(timer);
    }
  },
};

/**
 * Gom một luồng SSE kiểu OpenAI thành một kết quả.
 *
 * Khác Anthropic ở hai chỗ đáng nhớ: khung kết thúc là chuỗi `[DONE]` chứ
 * không phải một sự kiện JSON, và `usage` chỉ có ở khung áp chót — và chỉ khi
 * đã xin `stream_options.include_usage`. Thiếu nó thì mọi lượt stream đều ghi
 * 0 token vào sổ chi phí, tức là bảng tiền lặng lẽ sai chứ không báo lỗi.
 */
async function readOpenAiStream(
  res: Response,
  model: string,
  onChunk: () => void,
): Promise<LLMResult> {
  const body = res.body;
  if (!body) throw new LLMError('openai_compat stream had no body', true);

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
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      for (const line of frame.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        let evt: {
          choices?: Array<{ delta?: { content?: string } }>;
          usage?: { prompt_tokens?: number; completion_tokens?: number };
          error?: { message?: string };
        };
        try {
          evt = JSON.parse(payload);
        } catch {
          continue;
        }
        if (evt.error) throw new LLMError(`openai_compat stream error: ${evt.error.message ?? 'unknown'}`, true);
        const delta = evt.choices?.[0]?.delta?.content;
        if (delta) text += delta;
        if (evt.usage) {
          inputTokens = evt.usage.prompt_tokens ?? inputTokens;
          outputTokens = evt.usage.completion_tokens ?? outputTokens;
        }
      }
    }
  }

  if (!text.trim()) throw new LLMError('openai_compat stream produced no text', true);
  return { text, inputTokens, outputTokens, model };
}


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

/**
 * Đường ra Internet. Mặc định là tuyến OpenAI của cổng — đường duy nhất đã
 * chạy thật ở production. Đặt `LLM_PROVIDER=anthropic` để ép tuyến
 * `/v1/messages` (hữu ích khi cần so hai đường trên cùng một model).
 */
function getProvider(): LLMProvider {
  return String(process.env.LLM_PROVIDER ?? '').toLowerCase() === 'anthropic'
    ? anthropicProvider
    : openAiCompatProvider;
}

// ── Chọn model ───────────────────────────────────────────────────
//
// Bản đồ thật nằm ở `src/services/llm/gateway.ts` (`modelFor(purpose)`), nơi
// mọi tính năng của web cùng tra một bảng. Ở đây chỉ là chuyện dịch cặp
// (step, feature) của module này sang cái tên công việc bên đó.
//
// Các biến `LLM_MODEL_INTERVIEW / _REPORT / _GENERATION` cũ vẫn được tôn
// trọng nếu VPS còn đặt chúng — nhưng đừng đặt mới; chúng chỉ biết ba mức
// trong khi bản đồ mới biết từng tính năng một.
function purposeFor(step: LLMStep, feature?: LLMFeature | null): LlmPurpose {
  if (step === 'report') return 'interview_report';
  if (step === 'generation') {
    switch (feature) {
      case 'language': return 'language_bulk';
      case 'codelab': return 'codelab_bulk';
      case 'exphub': return 'exphub_doc';
      case 'bulk_gen': return 'codelab_bulk';
      default: return 'interview_generate';
    }
  }
  switch (feature) {
    case 'language': return 'language_tutor';
    case 'codelab': return 'codelab_coach';
    case 'cv': return 'cv_writing';
    case 'chat': return 'chat_pro';
    case 'exphub': return 'exphub_doc';
    default: return 'interview_grade';
  }
}

/**
 * Biến cũ có còn trỏ vào chỗ SỐNG không.
 *
 * ⚠️ ĐÂY LÀ MỘT LỖI ĐÃ SỐNG TRÊN PRODUCTION, không phải phòng xa. 18/08/2026
 * `/opt/cuonghoangdev/.env` vẫn còn `LLM_MODEL_REPORT=rb-opus-4-8` và
 * `LLM_MODEL_INTERVIEW=rb-sonnet-5` — tên model của cổng **Rambo đã chết**.
 * Nhánh này đứng TRƯỚC bản đồ model, nên nó nuốt luôn mọi phân công mới: báo
 * cáo phỏng vấn AI gọi `rb-opus-4-8`, cổng trả `model_not_found`, và
 * `aiReport.ts` nuốt lỗi trả `null`. Người dùng thấy "không có báo cáo", không
 * thấy lỗi nào, và không ai đi tìm trong env.
 *
 * Nên biến cũ chỉ được tôn trọng khi nó trỏ vào một cái tên CÒN SỐNG. Cái tên
 * `rb-*` thì không — xem ghi chú về cổng Rambo trong `gateway.ts`.
 */
const daKeuRb = new Set<string>();
function conSong(model: string, step: string): boolean {
  if (!model.startsWith('rb-')) return true;
  if (!daKeuRb.has(step)) {
    daKeuRb.add(step);
    logger.warn(
      `[llm] bỏ qua biến cũ cho bước "${step}": "${model}" là model của cổng Rambo ĐÃ CHẾT. `
      + 'Hãy xoá dòng đó khỏi .env của VPS; trong lúc chờ, bước này dùng bản đồ model mới.',
    );
  }
  return false;
}

export function modelForStep(step: LLMStep, feature?: LLMFeature | null, purpose?: LlmPurpose, ep?: LlmEndpoint): string {
  if (purpose) return modelFor(purpose, ep);
  // Biến cũ (chỉ khi VPS còn đặt) — giữ để một máy chưa cập nhật env không đổi
  // hành vi đột ngột.
  //
  // ⚠️ Nhưng chúng chỉ biết tên model của CỔNG. Đi máy nhà mà vẫn đọc chúng
  // là gửi `gpt-5.6-terra` sang llama-server, một cái tên nó không phục vụ.
  if (!ep?.local) {
    const cu = step === 'report' ? process.env.LLM_MODEL_REPORT
      : step === 'generation' ? process.env.LLM_MODEL_GENERATION
        : step === 'interview' ? process.env.LLM_MODEL_INTERVIEW
          : undefined;
    if (cu?.trim() && conSong(cu.trim(), step)) return cu.trim();
  }
  return modelFor(purposeFor(step, feature), ep);
}

// ── Kill switch + availability ────────────────────────────────────
export function isForceStatic(): boolean {
  return String(process.env.FORCE_STATIC_MODE ?? '').toLowerCase() === 'true';
}
export function hasKey(): boolean {
  return gatewayConfigured();
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
export type LLMFeature = 'interview' | 'language' | 'cv' | 'chat' | 'bulk_gen' | 'exphub' | 'codelab' | 'news' | 'voice' | 'exam' | 'agent';

/**
 * Không ai ngồi chờ những lời gọi này: chúng chạy theo cron hoặc theo một
 * lệnh sinh hàng loạt của admin rồi tự chạy tiếp hàng giờ. Đó cũng chính là
 * lý do chúng là thứ đầu tiên bị cắt khi tiền chạm trần mềm.
 */
const BACKGROUND_FEATURES = new Set<LLMFeature>(['bulk_gen', 'news']);
function isBackgroundFeature(feature?: LLMFeature | null): boolean {
  return !!feature && BACKGROUND_FEATURES.has(feature);
}

/**
 * CÔNG TẮC TỔNG cho mọi lời gọi AI không có người ngồi chờ. MẶC ĐỊNH TẮT.
 *
 * Trần token chặn một người tiêu nhiều; trần tiền chặn một ngày tiêu nhiều.
 * Cái này chặn thứ khác hẳn: một tiến trình chạy hàng giờ mà chủ web không
 * nhớ là mình đã khởi động. Các script sinh nội dung hàng loạt chạy tách rời
 * (`docker exec … node scripts/*-bulk-gen.mjs`) sống lâu hơn cả phiên làm việc
 * dựng ra chúng, và chúng đi đúng con đường này.
 *
 * Tắt mặc định nghĩa là: muốn tiêu tiền cho việc chạy nền thì phải nói ra.
 *   • Chạy một đợt sinh nội dung:
 *       docker exec -e LLM_BACKGROUND_ENABLED=true cuonghoangdev_backend node scripts/…
 *     (biến chỉ sống trong tiến trình đó, đợt sau lại phải khai báo lại)
 *   • Bật lâu dài: LLM_BACKGROUND_ENABLED=true trong /opt/cuonghoangdev/.env
 *
 * KHÔNG chạm tới thứ người dùng đang bấm: chat, chấm bài, gia sư, kèm code,
 * mổ CV đều không nằm trong `BACKGROUND_FEATURES`.
 */
export function backgroundLlmEnabled(): boolean {
  return String(process.env.LLM_BACKGROUND_ENABLED ?? 'false').toLowerCase() === 'true';
}

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
  /** Tên công việc trong bản đồ model (`src/services/llm/gateway.ts`). Đây là
   *  cách CHÍNH để chọn model; `step`+`feature` chỉ là đường suy ra khi caller
   *  chưa khai báo. */
  purpose?: LlmPurpose;
  maxRetries?: number; // override — latency-sensitive callers use fewer
  timeoutMs?: number; // override per-call timeout
}): Promise<LLMResult> {
  const maxRetries = opts.maxRetries ?? (Number(process.env.LLM_MAX_RETRIES) || 3);
  let lastErr: unknown;

  const isBackground = isBackgroundFeature(opts.feature);
  const purpose = opts.purpose ?? purposeFor(opts.step, opts.feature);

  // Công tắc tổng: việc chạy nền phải được bật ra mặt mới đi tiếp.
  //
  // Phép này đứng TRƯỚC lúc xin slot máy nhà, có chủ ý: một lời gọi sắp bị
  // chặn thì không được phép chiếm chỗ của ai cả.
  if (isBackground && !backgroundLlmEnabled()) {
    logger.warn('llm: chặn lời gọi chạy nền (LLM_BACKGROUND_ENABLED chưa bật)', { feature: opts.feature, step: opts.step, purpose });
    throw new LLMError(
      'Việc AI chạy nền đang TẮT (mặc định, để khỏi âm thầm tốn tiền). Bật bằng LLM_BACKGROUND_ENABLED=true — cho cả máy trong /opt/cuonghoangdev/.env, hoặc chỉ cho một đợt: docker exec -e LLM_BACKGROUND_ENABLED=true …',
      false,
    );
  }

  // ── Máy nhà hay cổng? ────────────────────────────────────────────
  //
  // `xinDiemCuoi` vừa chọn nơi vừa xếp hàng: việc nào có tên trong
  // `LLM_LOCAL_PURPOSES` thì xin một slot trên máy nhà, và nếu robot đang giữ
  // máy hay hàng đã dài thì nó tự đổi sang cổng thay vì bắt người dùng chờ.
  // Xem `src/services/llm/hangDoi.ts`.
  const xin = await xinDiemCuoi(purpose);
  let ep = xin.ep;
  let model = modelForStep(opts.step, opts.feature, opts.purpose, ep);

  try {
    // Cầu dao ngân sách. Việc chạy nền bị cắt trước, ở mức thấp hơn — nó là thứ
    // duy nhất có thể tiêu tiền cả đêm mà không ai biết.
    //
    // ⚠️ Máy nhà KHÔNG qua cầu dao này: nó chạy bằng điện nhà, không có hoá
    // đơn nào để mà chặn. Chặn nó nghĩa là hết hạn mức tiền thì cả những việc
    // MIỄN PHÍ cũng ngừng — đúng ngược với lý do dựng máy nhà.
    if (!ep.local) {
      const verdict = await checkBudget(isBackground ? 'background' : 'interactive');
      if (!verdict.allowed) {
        logger.warn('llm budget chặn lời gọi', { feature: opts.feature ?? null, step: opts.step, model, reason: verdict.reason, spentUsd: Number(verdict.spentUsd.toFixed(4)) });
        throw new LLMError(budgetMessage(verdict), false);
      }
    }

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Tuyến Anthropic (`/v1/messages`) KHÔNG tồn tại trên máy nhà —
        // llama.cpp chỉ mở tuyến OpenAI. Ép đúng adapter, nếu không thì đặt
        // `LLM_PROVIDER=anthropic` một lần là mọi việc cục bộ chết 404.
        const provider = ep.local ? openAiCompatProvider : getProvider();
        const result = await provider.complete(model, opts.system, opts.messages, { maxTokens: opts.maxTokens, timeoutMs: opts.timeoutMs, ep });
        recordSuccess(opts.feature);
        await logLlmCall({ userId: opts.userId, sessionId: opts.sessionId, feature: opts.feature, step: opts.step, model, inputTokens: result.inputTokens, outputTokens: result.outputTokens, success: true }).catch(() => {});
        return result;
      } catch (e) {
        lastErr = e;

        // ⭐ MÁY NHÀ HỎNG THÌ TỤT XUỐNG CỔNG NGAY, ĐỪNG THỬ LẠI NÓ.
        //
        // Máy nhà mất điện / mất mạng / đang bận train giọng là chuyện thường,
        // và nó KHÔNG được phép làm chết tính năng. Thử lại cùng một máy đã
        // chết chỉ tốn thêm ba nhịp chờ rồi vẫn hỏng. Đổi đích rồi đi tiếp:
        // lượt này vẫn ra kết quả, người dùng không thấy gì cả.
        if (ep.local) {
          logger.warn('llm: máy nhà hỏng, lượt này chuyển sang cổng', {
            purpose, feature: opts.feature ?? null, model,
            error: e instanceof Error ? e.message : String(e),
          });
          xin.tra();                 // trả slot NGAY, đừng giữ chỗ trên một máy đã chết
          xin.tra = () => {};        // `finally` bên dưới không được trả lần hai
          ep = fallbackEndpoint();
          model = modelForStep(opts.step, opts.feature, opts.purpose, ep);
          // ⚠️ `attempt--` RỒI mới `continue`: `continue` trong vòng `for` VẪN
          // chạy phép tăng, nên nếu không lùi lại thì việc đổi đích tự ăn mất
          // một lượt thử. Với caller đặt `maxRetries: 0` (những chỗ nhạy độ
          // trễ) thì vòng lặp kết thúc LUÔN và cổng không bao giờ được gọi —
          // máy nhà cúp điện là tính năng chết hẳn, đúng thứ nhánh này sinh ra
          // để chống. Đo thật 14/08 mới lộ: đường chính xanh, đường lùi hỏng.
          // Không sợ lặp vô hạn: `ep` giờ không còn local nên nhánh này không
          // vào lại được nữa.
          attempt--;
          continue;
        }

        if (e instanceof LLMError && !e.retryable) break; // 4xx / no-key → don't retry
        if (attempt < maxRetries) await sleep(Math.min(8000, 500 * 2 ** attempt)); // exp backoff
      }
    }
    recordFailure(opts.feature);
    // Never charge quota for a failed call → log with zero tokens.
    await logLlmCall({ userId: opts.userId, sessionId: opts.sessionId, feature: opts.feature, step: opts.step, model, inputTokens: 0, outputTokens: 0, success: false }).catch(() => {});
    throw lastErr;
  } finally {
    xin.tra();
  }
}

/**
 * Trần token mỗi người mỗi ngày.
 *
 * ⚠️ Biến `INTERVIEW_DAILY_TOKEN_CAP` để trống từng có nghĩa là KHÔNG GIỚI HẠN,
 * và mọi tính năng dùng chung lõi này (Language, Code Lab, Exp Hub, phòng thi,
 * Voice Hub) đều gọi qua đây. Tức là chốt chặn chi phí duy nhất của cả web phụ
 * thuộc vào việc có ai đó nhớ đặt một biến môi trường hay không. Giờ thì
 * KHÔNG: không đặt gì cũng có trần.
 *
 * Người dùng Pro được trần rộng gấp hơn ba lần — họ trả tiền, và một buổi học
 * hay một buổi phỏng vấn thử dài hơi không được phép chạm trần. Muốn tắt hẳn
 * thì đặt `INTERVIEW_DAILY_TOKEN_CAP=0`.
 */
const DEFAULT_DAILY_TOKEN_CAP = 300_000;
const DEFAULT_DAILY_TOKEN_CAP_PRO = 1_000_000;

export async function checkTokenQuota(userId: number): Promise<boolean> {
  const raw = process.env.INTERVIEW_DAILY_TOKEN_CAP;
  const explicit = raw !== undefined && raw !== '' ? Number(raw) : NaN;
  if (Number.isFinite(explicit) && explicit <= 0) return true;   // 0 = tắt trần, có chủ ý

  let cap = Number.isFinite(explicit) ? explicit : DEFAULT_DAILY_TOKEN_CAP;
  if (!Number.isFinite(explicit)) {
    // Chỉ hỏi trạng thái Pro khi đang dùng mức mặc định — một biến env đặt tay
    // thì người đặt đã biết mình muốn gì.
    const { isProEffective } = await import('../../pro.service.js');
    if (await isProEffective(userId).catch(() => false)) cap = DEFAULT_DAILY_TOKEN_CAP_PRO;
  }

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
