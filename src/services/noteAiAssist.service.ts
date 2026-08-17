/**
 * AI trong trình soạn thảo Notes — bôi đen chữ rồi nhờ AI làm một việc.
 *
 * ─── Bề mặt ĐÓNG có chủ đích ───
 * Chỉ nhận một `action` trong danh sách liệt kê, không nhận prompt tự do. Cho
 * gửi prompt tự do lên đây là biến endpoint này thành một cổng chat không giới
 * hạn: mọi hạn mức và mọi bản đồ model của web đều đi vòng qua nó, và không ai
 * nhìn vào log biết được token đang chảy đi đâu. Người dùng cần chat tự do thì
 * đã có /chat.
 *
 * ─── Model theo VIỆC, không theo module ───
 * Đây là việc TƯƠNG TÁC — người dùng ngồi đợi ngay trước màn hình — nên đi
 * `codelab_coach` (gpt-5.5, ~2s) chứ không phải `chat_max` (gpt-5.6-sol,
 * ~5,5s). Xem CLAUDE.md, mục cổng LLM.
 */
import { BadRequestError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';

/** Trần chữ gửi đi mỗi lượt. Bôi cả một ghi chú dài rồi bấm là hết hạn mức. */
const MAX_INPUT_CHARS = 6000;

interface ActionSpec {
  label: string;
  system: string;
  /** Dựng lời nhắc từ đoạn chữ người dùng bôi đen. */
  build: (text: string) => string;
}

const VIETNAMESE_RULE =
  'Trả lời BẰNG TIẾNG VIỆT trừ khi được yêu cầu dịch sang ngôn ngữ khác. '
  + 'Chỉ trả về nội dung đã xử lý, KHÔNG thêm lời dẫn, KHÔNG thêm dấu ``` bao quanh, '
  + 'KHÔNG giải thích mình đã làm gì.';

export const AI_ACTIONS: Record<string, ActionSpec> = {
  continue: {
    label: 'Viết tiếp',
    system: `Bạn viết tiếp đoạn văn đang dở, giữ nguyên giọng văn và mức độ trang trọng. ${VIETNAMESE_RULE}`,
    build: (t) => `Viết tiếp đoạn sau, khoảng 2-3 câu:\n\n${t}`,
  },
  improve: {
    label: 'Viết lại cho hay hơn',
    system: `Bạn biên tập văn bản cho rõ ràng và gọn hơn mà KHÔNG đổi ý. ${VIETNAMESE_RULE}`,
    build: (t) => `Viết lại đoạn sau cho rõ và gọn hơn:\n\n${t}`,
  },
  fix: {
    label: 'Sửa chính tả và ngữ pháp',
    // "Chỉ sửa lỗi" nói hai lần có chủ đích: model rất hay tiện tay viết lại
    // cả câu cho "hay hơn", và người dùng bấm nút này thì không muốn thế.
    system: `Bạn CHỈ sửa lỗi chính tả, dấu câu và ngữ pháp. Giữ NGUYÊN cách dùng từ và cấu trúc câu của tác giả — không viết lại cho hay hơn. ${VIETNAMESE_RULE}`,
    build: (t) => `Sửa lỗi chính tả và ngữ pháp trong đoạn sau:\n\n${t}`,
  },
  shorten: {
    label: 'Rút gọn',
    system: `Bạn rút gọn văn bản, giữ mọi ý chính. ${VIETNAMESE_RULE}`,
    build: (t) => `Rút gọn đoạn sau còn khoảng một nửa:\n\n${t}`,
  },
  summarize: {
    label: 'Tóm tắt',
    system: `Bạn tóm tắt nội dung thành các ý gạch đầu dòng ngắn gọn. ${VIETNAMESE_RULE}`,
    build: (t) => `Tóm tắt đoạn sau thành tối đa 5 gạch đầu dòng:\n\n${t}`,
  },
  checklist: {
    label: 'Chuyển thành checklist',
    system: `Bạn chuyển văn bản thành danh sách việc cần làm. Mỗi việc một dòng, bắt đầu bằng "- [ ] ". ${VIETNAMESE_RULE}`,
    build: (t) => `Chuyển đoạn sau thành checklist:\n\n${t}`,
  },
  tasks: {
    label: 'Rút trích nhiệm vụ',
    system: `Bạn rút các nhiệm vụ ra khỏi văn bản. Mỗi dòng: "- [ ] <việc> — <người phụ trách nếu có> — <hạn nếu có>". Không bịa người hay hạn không có trong văn bản. ${VIETNAMESE_RULE}`,
    build: (t) => `Rút trích nhiệm vụ, người phụ trách và hạn từ đoạn sau:\n\n${t}`,
  },
  table: {
    label: 'Tạo bảng',
    system: `Bạn chuyển văn bản thành một bảng Markdown. Chỉ trả về bảng. ${VIETNAMESE_RULE}`,
    build: (t) => `Chuyển đoạn sau thành bảng Markdown:\n\n${t}`,
  },
  translate_en: {
    label: 'Dịch sang tiếng Anh',
    system: 'Bạn dịch sang tiếng Anh tự nhiên. Chỉ trả về bản dịch, không thêm lời dẫn hay giải thích.',
    build: (t) => `Dịch đoạn sau sang tiếng Anh:\n\n${t}`,
  },
  translate_vi: {
    label: 'Dịch sang tiếng Việt',
    system: 'Bạn dịch sang tiếng Việt tự nhiên. Chỉ trả về bản dịch, không thêm lời dẫn hay giải thích.',
    build: (t) => `Dịch đoạn sau sang tiếng Việt:\n\n${t}`,
  },
};

export function listAiActions() {
  return Object.entries(AI_ACTIONS).map(([key, spec]) => ({ key, label: spec.label }));
}

export interface AiAssistResult {
  text: string;
  action: string;
}

export async function runAiAssist(
  userId: number,
  action: unknown,
  selection: unknown,
): Promise<AiAssistResult> {
  const key = String(action ?? '');
  const spec = AI_ACTIONS[key];
  if (!spec) throw new BadRequestError(`Thao tác AI không hỗ trợ: ${key}`);

  const text = String(selection ?? '').trim();
  if (!text) throw new BadRequestError('Chưa chọn đoạn chữ nào');
  if (text.length > MAX_INPUT_CHARS) {
    throw new BadRequestError(`Đoạn chọn quá dài (tối đa ${MAX_INPUT_CHARS} ký tự). Bôi đen phần ngắn hơn.`);
  }

  if (!isAiAvailable()) throw new BadRequestError('Tính năng AI chưa được cấu hình.');
  // Kiểm hạn mức TRƯỚC khi gọi. Kiểm sau thì token đã tiêu rồi mới báo hết
  // hạn mức — người dùng vừa mất lượt vừa không nhận được gì.
  if (!(await checkTokenQuota(userId))) {
    throw new BadRequestError('Đã hết hạn mức AI hôm nay. Thử lại vào ngày mai.');
  }

  const res = await llmComplete({
    step: 'generation',
    feature: 'notes',
    purpose: 'codelab_coach',
    system: spec.system,
    messages: [{ role: 'user', content: spec.build(text) }],
    // Trần đầu ra ~gấp rưỡi đầu vào: mọi thao tác ở đây đều BIẾN ĐỔI đoạn chữ
    // chứ không sinh bài mới, nên kết quả dài gấp nhiều lần là dấu hiệu model
    // đi lạc, không phải dấu hiệu cần thêm chỗ.
    maxTokens: Math.min(4000, Math.max(500, Math.ceil(text.length * 1.5))),
    maxRetries: 1,
    timeoutMs: 60_000,
    userId,
  } as never);

  const out = String((res as { text?: unknown }).text ?? '').trim();
  if (!out) throw new BadRequestError('AI không trả về nội dung. Thử lại.');

  /* Bóc rào ``` nếu model vẫn bọc dù đã dặn không.
   * Dặn trong system prompt là chưa đủ — model bọc mã theo phản xạ, và một
   * đoạn văn bị bọc trong ``` sẽ được chèn vào ghi chú thành khối mã. */
  const fenced = /^```[a-z]*\n([\s\S]*?)\n?```$/i.exec(out);
  return { text: fenced?.[1]?.trim() ?? out, action: key };
}
