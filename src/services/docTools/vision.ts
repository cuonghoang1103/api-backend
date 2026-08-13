/**
 * Một lời gọi model CÓ ẢNH, cho nhóm công cụ tài liệu.
 * ─────────────────────────────────────────────────────────────────────────
 * Vì sao không dùng `llmComplete` của interview/llm: hàm đó nhận `content` là
 * CHUỖI, không có đường nào nhét khối ảnh vào. Nên ở đây gọi thẳng tuyến
 * OpenAI của cổng (`/v1/chat/completions`, khối `image_url`) — đúng cái đã đo
 * chạy thật ngày 13/08 — nhưng vẫn đi qua đủ ba chốt chặn chung của cả web:
 * cầu dao ngân sách, trần token mỗi người mỗi ngày, và ghi log chi phí.
 *
 * Điểm cuối lấy từ `endpointFor('doc_ocr')`. Việc này nằm trong
 * `VISION_PURPOSES` nên gateway KHÔNG bao giờ đẩy nó về máy nhà — model ở đó
 * không có mắt và sẽ bịa trơn tru thay vì báo lỗi.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { budgetMessage, checkBudget } from '../llm/budget.js';
import { chatUrlOf, costUsd, endpointFor, modelFor } from '../llm/gateway.js';
import { checkTokenQuota } from '../interview/llm/index.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

export interface VisionImage {
  /** base64 THUẦN, không kèm tiền tố `data:` */
  data: string;
  mediaType: string;
}

export interface VisionResult {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

const TIMEOUT_MS = Number(process.env.DOCTOOL_TIMEOUT_MS) || 120_000;

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/**
 * Gọi một lượt. Ném lỗi khi hỏng hẳn — người gọi quyết định báo gì cho người
 * dùng; ở tính năng này KHÔNG có đường lùi "trả về đại một kết quả", vì một
 * bản chép sai lặng lẽ còn tệ hơn một thông báo lỗi.
 */
export async function visionComplete(opts: {
  system: string;
  userText: string;
  images: VisionImage[];
  maxTokens?: number;
  userId?: number | null;
  maxRetries?: number;
}): Promise<VisionResult> {
  const verdict = await checkBudget('interactive');
  if (!verdict.allowed) throw new BadRequestError(budgetMessage(verdict));

  if (opts.userId && !(await checkTokenQuota(opts.userId))) {
    throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.');
  }

  const ep = endpointFor('doc_ocr');
  if (!ep.key) throw new BadRequestError('Chưa cấu hình khoá cổng LLM (LLM_GATEWAY_API_KEY).');
  const model = modelFor('doc_ocr', ep);
  const maxRetries = opts.maxRetries ?? 2;

  let lastErr: unknown;
  for (let lan = 0; lan <= maxRetries; lan++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(chatUrlOf(ep), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ep.key}` },
        signal: ctrl.signal,
        body: JSON.stringify({
          model,
          max_tokens: opts.maxTokens ?? 4000,
          messages: [
            { role: 'system', content: opts.system },
            {
              role: 'user',
              content: [
                ...opts.images.map((img) => ({
                  type: 'image_url' as const,
                  image_url: { url: `data:${img.mediaType};base64,${img.data}` },
                })),
                { type: 'text' as const, text: opts.userText },
              ],
            },
          ],
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        const retryable = res.status === 429 || res.status >= 500;
        if (!retryable || lan === maxRetries) {
          throw new Error(`cổng LLM trả HTTP ${res.status}: ${body.slice(0, 200)}`);
        }
        lastErr = new Error(`HTTP ${res.status}`);
        await sleep(Math.min(8000, 800 * 2 ** lan));
        continue;
      }

      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      const text = json.choices?.[0]?.message?.content ?? '';
      const inputTokens = json.usage?.prompt_tokens ?? 0;
      const outputTokens = json.usage?.completion_tokens ?? 0;
      const tien = costUsd(model, inputTokens, outputTokens);

      await ghiLog({ userId: opts.userId, model, inputTokens, outputTokens, success: true });

      // Trả về rỗng mà không báo lỗi là kiểu hỏng khó thấy nhất: người dùng
      // nhận một trang trắng và tưởng ảnh của mình có vấn đề.
      if (!text.trim()) throw new Error('cổng LLM trả về nội dung rỗng');

      return { text, model, inputTokens, outputTokens, costUsd: tien };
    } catch (e) {
      lastErr = e;
      const aborted = (e as Error).name === 'AbortError';
      if (lan < maxRetries && aborted) {
        await sleep(500);
        continue;
      }
      if (lan >= maxRetries) break;
      if (!(e instanceof Error) || !e.message.startsWith('HTTP')) break;
    } finally {
      clearTimeout(timer);
    }
  }

  await ghiLog({ userId: opts.userId, model, inputTokens: 0, outputTokens: 0, success: false });
  logger.warn('docTools: lời gọi có ảnh thất bại', { model, error: lastErr instanceof Error ? lastErr.message : String(lastErr) });
  throw lastErr instanceof Error ? lastErr : new Error('Gọi model thất bại');
}

/** Lượt hỏng ghi 0 token — không bao giờ tính tiền một lời gọi không ra kết quả. */
async function ghiLog(d: {
  userId?: number | null;
  model: string;
  inputTokens: number;
  outputTokens: number;
  success: boolean;
}): Promise<void> {
  await prisma.interviewLLMCallLog
    .create({
      data: {
        userId: d.userId ?? null,
        feature: 'doctool',
        step: 'generation',
        provider: 'openai_compatible',
        model: d.model,
        inputTokens: d.inputTokens,
        outputTokens: d.outputTokens,
        costUsd: costUsd(d.model, d.inputTokens, d.outputTokens),
        success: d.success,
      },
    })
    .catch(() => {});
}
