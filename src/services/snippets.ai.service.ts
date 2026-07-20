/**
 * EXP_Hub — AI assist for code entries.
 *
 * One-shot, stateless helpers that reuse the shared interview LLM gateway
 * (cheap/fast model) — no new provider or key. Three modes:
 *   - explain:  giải thích đoạn code bằng tiếng Việt
 *   - install:  sinh lệnh cài đặt & thiết lập cho một công nghệ
 *   - optimize: rà lỗi + gợi ý cải thiện
 * Output is Vietnamese markdown. Reading is not cached (short, cheap); abuse
 * is bounded by the per-user daily token quota.
 */
import { BadRequestError } from '../middleware/errorHandler.js';
import { llmComplete, isAiAvailable, checkTokenQuota } from './interview/llm/index.js';

export type ExplainMode = 'explain' | 'install' | 'optimize';

const MAX_CODE = 12_000;

const SYSTEM: Record<ExplainMode, string> = {
  explain:
    'Bạn là trợ lý lập trình. Giải thích đoạn code người dùng đưa bằng TIẾNG VIỆT, ' +
    'ngắn gọn, rõ ràng, dùng markdown. Trình bày: (1) mục đích tổng quát, ' +
    '(2) giải thích các phần/dòng chính, (3) lưu ý hoặc bẫy thường gặp nếu có. ' +
    'KHÔNG chép lại toàn bộ code. Không bịa API không tồn tại.',
  install:
    'Bạn là kỹ sư DevOps. Đưa ra các lệnh CÀI ĐẶT và THIẾT LẬP MÔI TRƯỜNG cho công nghệ ' +
    'được yêu cầu, bằng TIẾNG VIỆT, dùng markdown với các khối code lệnh (bash/shell). ' +
    'Chia bước ngắn gọn: cài đặt → kiểm tra phiên bản → cấu hình cơ bản → chạy thử. ' +
    'Ưu tiên cách phổ biến, ổn định. Nêu rõ khi lệnh khác nhau giữa Ubuntu/macOS/Windows.',
  optimize:
    'Bạn là senior engineer review code. Rà đoạn code người dùng đưa và trả lời bằng TIẾNG VIỆT, ' +
    'markdown. Chỉ ra: lỗi/bug tiềm ẩn, vấn đề hiệu năng hoặc bảo mật, và đề xuất cải thiện ' +
    'kèm ví dụ sửa ngắn gọn. Nếu code đã ổn, nói rõ và gợi ý tinh chỉnh nhỏ.',
};

export async function assistCode(opts: {
  mode: ExplainMode;
  code?: string;
  language?: string;
  title?: string;
  userId: number;
}): Promise<{ text: string }> {
  const { mode, userId } = opts;
  if (!SYSTEM[mode]) throw new BadRequestError('Chế độ AI không hợp lệ');
  if (!isAiAvailable('exphub')) throw new BadRequestError('Tính năng AI hiện chưa sẵn sàng.');

  const code = (opts.code ?? '').slice(0, MAX_CODE);
  const language = (opts.language ?? '').trim();
  const title = (opts.title ?? '').trim();

  // install mode can work from just a technology name; the others need code.
  if (mode !== 'install' && !code.trim()) throw new BadRequestError('Không có code để xử lý');
  if (mode === 'install' && !title && !code.trim()) throw new BadRequestError('Cần tên công nghệ');

  if (!(await checkTokenQuota(userId))) {
    throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay, vui lòng thử lại vào ngày mai.');
  }

  const user =
    mode === 'install'
      ? `Sinh lệnh cài đặt & thiết lập môi trường cho: ${title || language}${code.trim() ? `\n\nNgữ cảnh:\n${code}` : ''}`
      : `Ngôn ngữ: ${language || 'không rõ'}${title ? `\nTiêu đề: ${title}` : ''}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``;

  try {
    const res = await llmComplete({
      step: 'interview', // cheap/fast model — enough for explanations
      feature: 'exphub',
      system: SYSTEM[mode],
      messages: [{ role: 'user', content: user }],
      maxTokens: 1400,
      maxRetries: 1,
      timeoutMs: 40_000,
      userId,
    });
    const text = (res.text ?? '').trim();
    if (!text) throw new Error('empty');
    return { text };
  } catch {
    throw new BadRequestError('Trợ lý AI đang bận, vui lòng thử lại sau giây lát.');
  }
}
