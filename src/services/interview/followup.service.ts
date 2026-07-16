/**
 * Phase 2 — Follow-up (probing) questions.
 *
 * A senior-interviewer persona asks ONE probing follow-up based on the
 * candidate's answer, then gives brief coaching on their follow-up answer.
 * Stateless by design: nothing is persisted and it does NOT affect the turn
 * score — it's live coaching layered on top of a graded turn. Requires the AI
 * gateway + a Pro/admin account (same gate as AI grading).
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { isProEffective } from '../pro.service.js';
import { isAiAvailable, llmComplete, extractJson } from './llm/index.js';

type Lang = 'VI' | 'EN';

async function loadOwnedTurn(userId: number, sessionId: number, order: number) {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    select: { userId: true, language: true },
  });
  if (!session) throw new NotFoundError('Phiên phỏng vấn không tồn tại');
  if (session.userId !== userId) throw new ForbiddenError('Bạn không có quyền với phiên này');
  const turn = await prisma.interviewTurn.findUnique({
    where: { uk_interview_turn_order: { sessionId, order } },
    select: { questionText: true, userAnswer: true },
  });
  if (!turn) throw new NotFoundError('Câu hỏi không tồn tại trong phiên');
  return { lang: (session.language === 'EN' ? 'EN' : 'VI') as Lang, turn };
}

async function ensureAllowed(userId: number): Promise<void> {
  if (!isAiAvailable()) throw new BadRequestError('Tính năng hỏi vặn cần AI (hiện đang tắt).');
  if (!(await isProEffective(userId))) throw new ForbiddenError('Hỏi vặn dành cho tài khoản Pro/Max.');
}

/** Safe JSON parse — falls back to the raw text for a given field. */
function pick(text: string, field: string): string {
  try {
    const obj = extractJson<Record<string, unknown>>(text);
    const v = obj?.[field];
    if (typeof v === 'string' && v.trim()) return v.trim();
  } catch { /* not JSON — fall through */ }
  return (text || '').trim();
}

/**
 * Generate ONE probing follow-up from the candidate's answer. `previous` lets the
 * caller avoid repeats across rounds.
 */
export async function generateFollowup(
  userId: number,
  sessionId: number,
  order: number,
  previous?: string[],
): Promise<{ question: string }> {
  await ensureAllowed(userId);
  const { lang, turn } = await loadOwnedTurn(userId, sessionId, order);
  const langName = lang === 'EN' ? 'English' : 'Vietnamese';
  const system =
    `You are a senior technical interviewer. Ask exactly ONE concise, probing follow-up question (max 2 sentences) that digs deeper into the candidate's previous answer — challenge a weak point, an edge case, a trade-off, or ask them to go one level deeper. Do NOT restate the original question and do NOT answer it yourself. Write the question in ${langName}. Return ONLY JSON: {"question": string}.`;
  const prev = previous?.length
    ? `\n\nFollow-ups already asked (do NOT repeat these):\n- ${previous.slice(0, 5).join('\n- ')}`
    : '';
  const user = `Original question:\n${turn.questionText}\n\nCandidate's answer:\n${turn.userAnswer || '(no written answer)'}${prev}`;
  const res = await llmComplete({
    step: 'interview', feature: 'interview',
    system,
    messages: [{ role: 'user', content: user }],
    maxTokens: 300,
    maxRetries: 1,
    timeoutMs: 25_000,
    userId,
    sessionId,
  });
  const question = pick(res.text, 'question');
  if (!question) throw new BadRequestError('Không tạo được câu hỏi vặn');
  return { question };
}

/** Brief coaching feedback on the candidate's follow-up answer (not scored). */
export async function assessFollowup(
  userId: number,
  sessionId: number,
  order: number,
  followupQuestion: string,
  answer: string,
): Promise<{ feedback: string }> {
  await ensureAllowed(userId);
  const { lang } = await loadOwnedTurn(userId, sessionId, order);
  if (!followupQuestion.trim()) throw new BadRequestError('Thiếu câu hỏi vặn');
  const langName = lang === 'EN' ? 'English' : 'Vietnamese';
  const system =
    `You are a senior technical interviewer giving brief, direct coaching (2-4 sentences) on the candidate's follow-up answer: say whether it's strong, what's missing or wrong, and one concrete tip. Be encouraging but honest. Write in ${langName}. Return ONLY JSON: {"feedback": string}.`;
  const user = `Follow-up question:\n${followupQuestion}\n\nCandidate's answer:\n${answer || '(no answer)'}`;
  const res = await llmComplete({
    step: 'interview', feature: 'interview',
    system,
    messages: [{ role: 'user', content: user }],
    maxTokens: 400,
    maxRetries: 1,
    timeoutMs: 25_000,
    userId,
    sessionId,
  });
  const feedback = pick(res.text, 'feedback');
  if (!feedback) throw new BadRequestError('Không tạo được nhận xét');
  return { feedback };
}
