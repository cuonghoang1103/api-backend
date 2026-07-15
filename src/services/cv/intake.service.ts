/**
 * CV Builder — Intake Mode (Phase 8c, Workflow A).
 * ─────────────────────────────────────────────────────────────────────────
 * For a user staring at a blank page. The AI runs a structured intake
 * conversation — behaving like a good recruiter debriefing a candidate — to
 * pull real, specific content out of them, then drafts bullets FROM THEIR
 * ANSWERS ONLY, with provenance. The user confirms each bullet before it is
 * saved; nothing is invented.
 *
 * Stateless multi-turn: the client holds the transcript and sends it each turn,
 * so no session table is needed. Degrades cleanly when AI is off.
 *
 * It must be able to say "there's nothing here yet" — if a project genuinely has
 * nothing quantifiable or hard, the honest move is to tell the user, not to pad.
 */
import { cvLlmComplete, isAiAvailable, checkTokenQuota, extractJson } from './llm/index.js';
import { INJECTION_SYSTEM_NOTE } from './llm/injection.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { assertCvAiPro, cvAiIsPro } from './proGate.js';
import { z } from 'zod';

const SYSTEM_PROMPT = [
  'Bạn là một nhà tuyển dụng kỹ thuật giỏi, đang phỏng vấn khai thác (debrief) một ứng viên IT để rút ra nội dung CV MẠNH.',
  'Ứng viên đang đối mặt trang trắng — nhiệm vụ của bạn là hỏi để moi ra chi tiết cụ thể, rồi viết thành các dòng thành tích.',
  '',
  'CÁCH HỎI: hỏi TỪNG câu một, đào đúng những thứ làm bullet mạnh, ví dụ:',
  '- Dùng công nghệ/nhà cung cấp nào, vì sao chọn nó?',
  '- Bạn làm một mình hay dẫn dắt/đóng góp phần nào?',
  '- Phần khó/vỡ ra là gì? (phần khó thường là phần thú vị)',
  '- Xử lý lỗi/thất bại thế nào (retry, idempotency, reconciliation)?',
  '- Có gì đo được thay đổi không? (thời gian, tỉ lệ lỗi, quy mô, số giao dịch, tải hỗ trợ)',
  '- Đã lên production chưa? Bao lâu? Bao nhiêu user/giao dịch?',
  '',
  'LUẬT BẮT BUỘC:',
  '- Chỉ viết bullet TỪ ĐIỀU ỨNG VIÊN THỰC SỰ NÓI. KHÔNG bịa số liệu, công nghệ, phạm vi.',
  '- Mỗi draft bullet phải kèm "userStatedFacts" = đúng lời/ý ứng viên đã cung cấp làm căn cứ.',
  '- Cần một con số mà ứng viên chưa cho? ĐỪNG đoán — hỏi thêm.',
  '- Nếu dự án THỰC SỰ không có gì đo được và không có gì khó để kể, hãy nói thẳng thật thà: "Cái này như mô tả chưa làm bạn nổi bật — còn gì khác bạn đã xây không?" Một coach giỏi nói vậy; đừng nhồi cho có.',
  '',
  INJECTION_SYSTEM_NOTE,
  '',
  'MỖI LƯỢT chỉ trả về JSON hợp lệ, không kèm chữ nào khác:',
  '{',
  '  "reply": "câu hỏi tiếp theo HOẶC nhận xét ngắn (tiếng Việt)",',
  '  "draftBullets": [{ "text": "dòng thành tích", "userStatedFacts": "căn cứ từ lời ứng viên" }],  // để [] nếu chưa đủ thông tin để viết',
  '  "done": false  // true khi đã khai thác đủ và không cần hỏi thêm',
  '}',
  'Khi thông tin còn ít, để draftBullets rỗng và tiếp tục hỏi. Chỉ draft khi đã có đủ chất liệu thật.',
].join('\n');

const turnSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(6000),
  })).min(1).max(40),
});

export interface IntakeDraftBullet { text: string; userStatedFacts: string }
export interface IntakeTurnResult { reply: string; draftBullets: IntakeDraftBullet[]; done: boolean }

export async function intakeTurn(userId: number, body: unknown): Promise<IntakeTurnResult> {
  await assertCvAiPro(userId); // AI is Pro-only
  if (!isAiAvailable('intake')) {
    throw new BadRequestError('AI chưa sẵn sàng (chưa cấu hình khoá). Chế độ phỏng vấn cần AI — bạn vẫn có thể nhập tay ở trình chỉnh sửa hồ sơ.');
  }
  if (!(await checkTokenQuota(userId))) {
    throw new BadRequestError('Bạn đã dùng hết hạn mức AI trong ngày.');
  }
  const { messages } = turnSchema.parse(body);

  const result = await cvLlmComplete({
    task: 'intake',
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: 1200,
    userId,
  });

  let parsed: Partial<IntakeTurnResult>;
  try {
    parsed = extractJson<Partial<IntakeTurnResult>>(result.text);
  } catch {
    // If the model didn't return JSON, treat the whole text as a plain reply.
    return { reply: result.text.trim() || 'Kể thêm cho tôi nghe đi.', draftBullets: [], done: false };
  }

  const drafts = Array.isArray(parsed.draftBullets)
    ? parsed.draftBullets
        .filter((b) => b && typeof b.text === 'string' && b.text.trim())
        .slice(0, 8)
        .map((b) => ({ text: String(b.text).trim(), userStatedFacts: String(b.userStatedFacts ?? '').trim() }))
    : [];

  return {
    reply: String(parsed.reply ?? '').trim(),
    draftBullets: drafts,
    done: !!parsed.done,
  };
}

export async function intakeStatus(userId: number) {
  const isPro = await cvAiIsPro(userId);
  return { available: isAiAvailable('intake') && isPro, needPro: isAiAvailable('intake') && !isPro };
}
