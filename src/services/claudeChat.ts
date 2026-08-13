/**
 * Hai bậc model mạnh của AI Chat Bot ("CuongMini Pro" / "CuongMini Max").
 * ─────────────────────────────────────────────────────────────────────────
 * Bậc mặc định (CuongMini3.11) chạy Groq — nhanh, miễn phí, dành cho khách
 * vãng lai. Hai bậc ở đây là quyền lợi Pro và đi qua cổng modelapi.vn
 * (`src/services/llm/gateway.ts`): Pro = Claude Sonnet 5, Max = Claude Opus 5.
 *
 * VÌ SAO ĐI TUYẾN `/v1/messages` CHỨ KHÔNG PHẢI `/v1/chat/completions`:
 * đây là chỗ duy nhất trên web gửi ẢNH và FILE PDF kèm câu hỏi. Khối
 * `document` (PDF đọc được cả chữ lẫn bố cục) chỉ tồn tại trong giao thức
 * Anthropic — tuyến OpenAI không có gì tương đương, đổi sang đó là âm thầm
 * vứt mất file người dùng vừa đính kèm rồi trả lời như chưa từng thấy nó.
 *
 * Hai cách gọi, theo thứ tự ưu tiên:
 *  1. streamClaudeChat()   — stream thật (SSE). Chữ chảy ra ngay nên người
 *     dùng không nhìn con quay, và không proxy nào trên đường thấy kết nối
 *     đứng im đủ lâu để cắt.
 *  2. completeClaudeChat() — không stream, dùng khi (1) hỏng.
 * Hỏng cả hai thì `ai.service.ts` tụt về model mặc định và nút chọn model
 * trên giao diện tự bật lại — người dùng luôn có câu trả lời.
 *
 * Lượt CHỈ CÓ CHỮ (không ảnh, không PDF) còn một lưới đỡ nữa: tuyến OpenAI
 * của chính cổng đó. Nó là đường đã chạy thật ở production, nên khi tuyến
 * Anthropic của cổng trục trặc, Pro/Max vẫn trả lời bằng đúng model đã chọn
 * thay vì tụt hẳn xuống bậc miễn phí.
 *
 * Độ dài câu trả lời: hai bậc này được đặt `max_tokens` CAO (10k/15k) — đó
 * chính là lý do tồn tại của chúng, câu trả lời không bị cụt như bậc nhanh.
 */
import { chatCompletionsUrl, gatewayConfigured, gatewayKey, messagesUrl, modelFor } from './llm/gateway.js';

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
/** A document block (base64 PDF) — the Sonnet/Opus tiers read text+layout. */
export interface ClaudeDocumentBlock {
  type: 'document';
  source: { type: 'base64'; media_type: 'application/pdf'; data: string };
}
export type ClaudeContentBlock = ClaudeTextBlock | ClaudeImageBlock | ClaudeDocumentBlock;

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  /** Plain text, OR a content-block array (text + images) for vision turns. */
  content: string | ClaudeContentBlock[];
}

/** Cổng đã có khoá chưa. */
export function claudeChatAvailable(): boolean {
  return gatewayConfigured();
}

/** Model của bậc "Pro". Đổi bằng `LLM_MODEL_CHAT_PRO`, không sửa mã. */
export function proModel(): string {
  return process.env.AI_CHAT_MODEL_PRO || modelFor('chat_pro');
}
/** Model của bậc "Max". Đổi bằng `LLM_MODEL_CHAT_MAX`. */
export function maxModel(): string {
  return process.env.AI_CHAT_MODEL_MAX || modelFor('chat_max');
}

/**
 * Model cho một lượt CÓ ẢNH — luôn là model nhìn được thật, kể cả ở bậc Pro.
 *
 * Đo 11/08/2026 với một ảnh 1×1 pixel: `gpt-5.6-sol` trả lời đúng "1×1";
 * `gpt-5.5`, `gpt-5.6-terra`, `gpt-5.4-mini` đều nhận ảnh, không báo lỗi, và
 * nói chắc nịch "16×16". Chúng đoán chứ không nhìn. Nâng bậc ở đây rẻ hơn
 * nhiều so với việc người dùng tin một câu trả lời bịa về ảnh của họ.
 */
export function visionModel(): string {
  return process.env.AI_CHAT_MODEL_VISION || modelFor('chat_vision');
}

/** Lượt hỏi này có ảnh không (quyết định việc nâng model). */
export function hasImage(messages: ClaudeMessage[]): boolean {
  return messages.some((m) => Array.isArray(m.content) && m.content.some((b) => b.type === 'image'));
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
  return Number.isFinite(n) && n > 0 ? n : 20_000;
}
/**
 * Trần token RA cho bậc Max.
 *
 * ⚠️ TOKEN SUY LUẬN ĂN CHUNG TRẦN NÀY. Từ 13/08/2026 mọi lượt trả phí gửi
 * `reasoning_effort`, và cổng tính token suy luận vào `completion_tokens`.
 * Đo thật: một câu hỏi hình học NGẮN đã tốn 4.142 token chỉ để suy luận, còn
 * lại 3.611 cho lời giải. Với đề dài (hai bài + ảnh) suy luận ăn gần hết
 * 15.000 cũ và lời giải bị cắt ngang giữa công thức — người dùng gặp thật
 * ngay tối hôm bật tính năng, câu trả lời dừng ở `E\left(0,-\frac{bh`.
 *
 * Nâng trần KHÔNG làm model nghĩ nhiều hơn (mức nghĩ do `reasoning_effort`
 * quyết định) và KHÔNG tự khắc tốn thêm tiền — chỉ trả tiền cho token thật sự
 * sinh ra. Nó chỉ mở đủ chỗ để phần lời giải được viết trọn.
 */
export function maxMaxTokens(): number {
  const n = Number(process.env.AI_CHAT_MAX_TOKENS_MAX);
  return Number.isFinite(n) && n > 0 ? n : 32_000;
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
  /**
   * Bật phần SUY LUẬN của model (`reasoning_effort` của tuyến OpenAI).
   *
   * Đo thật 13/08/2026 trên modelapi.vn: KHÔNG gửi tham số này thì `delta` chỉ
   * có `role` + `content`; gửi vào thì có thêm `reasoning_content` — mỗi bước
   * là một tiêu đề in đậm kiểu `**Proving A,H,D,C cyclic via right angles**`.
   * Cả bốn model `gpt-5.6-sol` / `gpt-5.5` / `gpt-5.6-terra` / `gpt-5.4-mini`
   * đều nhận, cả ba mức `low` / `medium` / `high` đều chạy.
   *
   * Không đặt ⇒ không gửi ⇒ y như cũ. Token suy luận tính vào token RA nên
   * mức càng cao càng tốn — xem chỗ gọi trong `ai.service.ts`.
   */
  reasoningEffort?: 'low' | 'medium' | 'high';
}

/**
 * Một mẩu chảy về từ model.
 *
 * Chuỗi = chữ của câu trả lời (giữ nguyên kiểu cũ nên mọi chỗ đang cộng dồn
 * chuỗi không phải sửa). Đối tượng = một bước suy luận, KHÔNG phải câu trả
 * lời — đừng cộng nó vào nội dung tin nhắn.
 */
export type ChatStreamPart =
  | string
  | { type: 'reasoning'; text: string }
  /** Hình thứ `thuTu` đã được kiểm bằng số, thấy sai và vẽ lại — client thay tại chỗ. */
  | { type: 'figure_fix'; thuTu: number; svg: string };

/** Bỏ lượt rỗng và giữ đúng thứ tự lượt mà API đòi. */
function usableMessages(messages: ClaudeMessage[]): ClaudeMessage[] {
  return messages.filter((m) =>
    typeof m.content === 'string'
      ? m.content.trim().length > 0
      : Array.isArray(m.content) && m.content.length > 0,
  );
}

function buildBody(p: ClaudeCallParams, stream: boolean): string {
  return JSON.stringify({
    model: p.model,
    max_tokens: p.maxTokens ?? claudeMaxTokens(),
    system: p.system,
    messages: usableMessages(p.messages),
    stream,
  });
}

function requireKey(): string {
  const key = gatewayKey();
  if (!key) throw new Error('Thiếu khoá cổng LLM (LLM_GATEWAY_API_KEY / OPENAI_COMPAT_API_KEY)');
  return key;
}

/** Header xác thực cho tuyến Anthropic của cổng. Gửi cả `x-api-key` lẫn
 *  `Bearer` vì cổng nhận cả hai, còn nhà upstream thì mỗi nơi đọc một kiểu. */
function messagesHeaders(key: string, sse: boolean): Record<string, string> {
  return {
    'x-api-key': key,
    authorization: `Bearer ${key}`,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
    ...(sse ? { accept: 'text/event-stream' } : {}),
  };
}

/**
 * Lượt này có file PDF không.
 *
 * Có thì cấm đổi sang tuyến OpenAI: bên đó không có khối `document`, chuyển
 * qua là mất file mà câu trả lời vẫn trôi chảy — kiểu hỏng tệ nhất, vì không
 * ai nhìn ra.
 */
export function hasDocument(messages: ClaudeMessage[]): boolean {
  return messages.some(
    (m) => Array.isArray(m.content) && m.content.some((b) => b.type === 'document'),
  );
}

/** Dịch khối nội dung Anthropic sang khối của tuyến OpenAI (chữ + ảnh). */
function toOpenAiContent(content: string | ClaudeContentBlock[]): unknown {
  if (typeof content === 'string') return content;
  return content
    .filter((b) => b.type !== 'document')
    .map((b) =>
      b.type === 'text'
        ? { type: 'text', text: b.text }
        : { type: 'image_url', image_url: { url: `data:${b.source.media_type};base64,${b.source.data}` } },
    );
}

function toOpenAiBody(p: ClaudeCallParams, stream: boolean): string {
  return JSON.stringify({
    model: p.model,
    max_tokens: p.maxTokens ?? claudeMaxTokens(),
    messages: [
      { role: 'system', content: p.system },
      ...usableMessages(p.messages).map((m) => ({ role: m.role, content: toOpenAiContent(m.content) })),
    ],
    ...(stream ? { stream: true } : {}),
    ...(p.reasoningEffort ? { reasoning_effort: p.reasoningEffort } : {}),
  });
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
    const res = await fetch(messagesUrl(), {
      method: 'POST',
      headers: messagesHeaders(key, true),
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
    const res = await fetch(messagesUrl(), {
      method: 'POST',
      headers: messagesHeaders(key, false),
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

/**
 * Stream qua tuyến OpenAI — ĐƯỜNG CHÍNH của AI Chat từ 11/08/2026.
 *
 * Vì sao đổi: khoá của web không mua được model Claude nào (503 "no available
 * channel"), nên tuyến `/v1/messages` chỉ còn phục vụ model `gpt-*` — cổng có
 * dịch giao thức, nhưng đi đường vòng chẳng được gì. Tuyến OpenAI thì nhận
 * ảnh theo đúng chuẩn `image_url`, và đó là thứ đã đo chạy thật.
 */
export async function* streamViaOpenAiRoute(p: ClaudeCallParams): AsyncGenerator<ChatStreamPart, void, unknown> {
  if (hasDocument(p.messages)) throw new Error('tuyến OpenAI không đọc được PDF');
  const key = requireKey();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), p.timeoutMs ?? claudeTimeoutMs());
  // Cổng báo vì sao nó dừng. `length` = chạm trần token — phải NÓI RA, vì lúc
  // đó câu trả lời đứt ngang giữa công thức và người đọc không có cách nào
  // biết là mình đang đọc một lời giải chưa xong.
  let lyDoDung: string | null = null;
  try {
    const res = await fetch(chatCompletionsUrl(), {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', accept: 'text/event-stream' },
      body: toOpenAiBody(p, true),
      signal: ctrl.signal,
    });
    if (!res.ok || !res.body) throw new Error(`openai route stream HTTP ${res.status}`);

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
        // Khác Anthropic: kết thúc là chuỗi `[DONE]`, không phải sự kiện JSON.
        if (!raw || raw === '[DONE]') continue;
        try {
          const evt = JSON.parse(raw) as {
            choices?: Array<{
              delta?: { content?: string; reasoning_content?: string; reasoning?: string };
              finish_reason?: string | null;
            }>;
            error?: { message?: string };
          };
          if (evt.error) throw new Error(`openai route stream error: ${evt.error.message ?? 'unknown'}`);
          if (evt.choices?.[0]?.finish_reason) lyDoDung = evt.choices[0].finish_reason;
          const d = evt.choices?.[0]?.delta;
          // Suy luận về TRƯỚC câu trả lời. Hai tên vì các cổng gộp đặt khác
          // nhau; modelapi.vn dùng `reasoning_content` (đo 13/08).
          const think = d?.reasoning_content ?? d?.reasoning;
          if (think) yield { type: 'reasoning', text: think };
          if (d?.content) yield d.content;
        } catch (e) {
          if (e instanceof Error && e.message.startsWith('openai route stream error')) throw e;
        }
      }
    }
    if (lyDoDung === 'length') {
      yield '\n\n> ⚠️ **Câu trả lời bị cắt vì chạm trần độ dài.** Nhắn "viết tiếp" để tôi làm nốt phần còn lại.\n';
    }
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new Error('openai route stream timeout');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Bản không stream của đường trên.
 *
 * Từ chối thẳng khi lượt hỏi có PDF (xem `hasDocument`) — thà báo lỗi còn hơn
 * trả lời trôi chảy một câu hỏi về file mà nó không hề đọc được.
 */
export async function completeViaOpenAiRoute(p: ClaudeCallParams): Promise<string> {
  if (hasDocument(p.messages)) throw new Error('tuyến OpenAI không đọc được PDF — không hạ tuyến');
  const key = requireKey();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), p.timeoutMs ?? claudeTimeoutMs());
  try {
    const res = await fetch(chatCompletionsUrl(), {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: toOpenAiBody(p, false),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`openai route HTTP ${res.status}`);
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = (json.choices?.[0]?.message?.content ?? '').trim();
    if (!text) throw new Error('openai route returned empty text');
    return text;
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new Error('openai route timeout');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
