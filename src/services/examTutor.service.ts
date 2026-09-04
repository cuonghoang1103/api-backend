/**
 * ============================================================
 * CuongMini — AI đồng hành khi thi (Pro only)
 * ============================================================
 *
 * "Start Exam with CuongMini" mở một attempt với `aiAssisted=true`. Trong lúc
 * làm bài, mỗi câu có 3 gợi ý dựng sẵn (làm sao/nhớ sao/kiến thức gì) + chat
 * tự do + nút "Hiện đáp án". Model chính đi cổng rambo riêng của người dùng
 * (purpose 'exam_tutor', xem gateway.ts) — họ xác nhận rõ dùng thoải mái,
 * không lo phí. Có dự phòng tự động sang gpt-5.6-sol qua modelapi.vn (purpose
 * 'chat_max') khi rambo lỗi, và cho chọn tay qua `provider`.
 *
 * Không lưu hội thoại — giống course_tutor, frontend gửi kèm `history`.
 * "Hiện đáp án" KHÔNG gọi AI — tra thẳng correctIndexes/explanation đã có sẵn
 * trên ExamQuestion, rẻ và không cần đợi.
 */
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable, aiOffReason, circuitReopensInMs } from './interview/llm/index.js';
import { isProEffective } from './pro.service.js';

const MAX_QUESTION = 1500;
const MAX_HISTORY = 12;

export interface TutorMessage { role: 'user' | 'assistant'; content: string }
export type TutorMode = 'how_to_solve' | 'how_to_remember' | 'knowledge' | 'free_qa';
export type TutorProvider = 'opus' | 'sol';

export interface ExamTutorAskOpts {
  userId: number;
  attemptId: number;
  questionId: number;
  mode: TutorMode;
  /** Bắt buộc khi mode === 'free_qa'. */
  question?: string;
  history?: TutorMessage[];
  /** Bỏ trống = tự động (opus trước, lỗi thì lùi về sol). Chọn tay thì gọi thẳng. */
  provider?: TutorProvider;
}

async function assertPro(userId: number) {
  if (!(await isProEffective(userId))) {
    throw new AppError('CuongMini là tính năng Pro.', 403);
  }
}

async function assertAiReady(userId: number) {
  if (!isAiAvailable('exam')) {
    const reason = aiOffReason('exam');
    throw new AppError(
      reason === 'circuit'
        ? `AI đang nghỉ sau vài lỗi cổng — mở lại sau khoảng ${Math.ceil(circuitReopensInMs('exam') / 1000)}s.`
        : reason === 'static'
          ? 'AI đang tắt trên máy chủ này (FORCE_STATIC_MODE).'
          : 'Dịch vụ AI chưa được cấu hình trên máy chủ này.',
      400,
    );
  }
  if (!(await checkTokenQuota(userId))) {
    throw new AppError('Bạn đã dùng hết hạn mức AI hôm nay.', 400);
  }
}

/** Bóc HTML về text thuần cho ngữ cảnh. */
function plain(html: string | null | undefined, cap = 6000): string {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|pre|tr|div)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, cap);
}

/** Attempt của đúng user, đang làm dở, đã bật CuongMini + câu hỏi thuộc đúng đề. */
async function loadAiAssistedContext(attemptId: number, questionId: number, userId: number) {
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: {
      exam: {
        include: { questions: true, course: { select: { courseCode: true } } },
      },
    },
  });
  if (!attempt || attempt.userId !== userId) throw new AppError('Không tìm thấy bài thi.', 404);
  if (!attempt.aiAssisted) throw new AppError('Bài thi này chưa bật CuongMini.', 403);
  if (attempt.status !== 'IN_PROGRESS') throw new AppError('Bài thi đã nộp, không thể hỏi CuongMini nữa.', 400);
  const question = attempt.exam.questions.find((q) => q.id === questionId);
  if (!question) throw new AppError('Không tìm thấy câu hỏi.', 404);
  return { attempt, question, courseLabel: attempt.exam.course?.courseCode || attempt.exam.title };
}

/** "Hiện đáp án" — KHÔNG gọi AI, tra thẳng dữ liệu đã có. */
export async function revealAnswer(attemptId: number, questionId: number, userId: number) {
  await assertPro(userId);
  const { question } = await loadAiAssistedContext(attemptId, questionId, userId);
  return {
    correctIndexes: question.correctIndexes,
    explanation: question.explanation,
  };
}

const MODE_INSTRUCTION: Record<TutorMode, string> = {
  how_to_solve: 'Học viên hỏi "Câu này làm như nào?" — hướng dẫn CÁCH GIẢI từng bước, dẫn tới đáp án đúng nhưng đừng chỉ đọc chữ cái, giải thích LOGIC.',
  how_to_remember: 'Học viên hỏi "Câu này nhớ như nào?" — đưa mẹo/liên tưởng/quy tắc ngắn gọn giúp nhớ lâu, không lặp lại toàn bộ đề bài.',
  knowledge: 'Học viên hỏi "Câu này kiến thức là gì?" — giải thích khái niệm/kiến thức nền câu hỏi đang kiểm tra, có ví dụ khác ngoài đề nếu giúp hiểu rõ hơn.',
  free_qa: 'Học viên hỏi tự do về câu này — trả lời đúng trọng tâm câu hỏi của họ.',
};

function buildQuestionBlock(q: { sortOrder: number; prompt: string; options: unknown; correctIndexes: number[]; explanation: string | null }): string {
  const opts = Array.isArray(q.options)
    ? (q.options as Array<{ text?: string }>).map((o, i) => `  ${String.fromCharCode(65 + i)}. ${plain(o?.text, 400)}`).join('\n')
    : '';
  const correct = (q.correctIndexes || []).map((i) => String.fromCharCode(65 + i)).join(', ') || '?';
  const expl = q.explanation ? `\nGiải thích có sẵn: ${plain(q.explanation, 1000)}` : '';
  return `CÂU ĐANG THI (câu ${q.sortOrder + 1}):\n${plain(q.prompt, 2000)}\n${opts}\nĐáp án đúng: ${correct}${expl}`;
}

const TUTOR_SYSTEM = `You are CuongMini, an AI study companion embedded in an FPT University exam room.
The student is actively taking a real exam and asked about ONE specific question — you already
know its full text, options, correct answer and explanation (given below). Teach so they UNDERSTAND
and remember, don't just restate the answer letter. Keep answers focused and reasonably short —
this is a live exam, not a lecture. Answer entirely in Vietnamese (keep technical terms/code in
English). Formatting: short paragraphs, **bold** key terms, fenced code blocks with a language
when quoting code, inline $…$ / display $$…$$ LaTeX for math.`;

async function buildTutorCall(opts: ExamTutorAskOpts): Promise<{ system: string; messages: TutorMessage[] }> {
  if (opts.mode === 'free_qa') {
    const q = (opts.question || '').trim();
    if (!q) throw new AppError('Hãy nhập câu hỏi.', 400);
    if (q.length > MAX_QUESTION) throw new AppError('Câu hỏi dài quá.', 400);
  }
  const { question, courseLabel } = await loadAiAssistedContext(opts.attemptId, opts.questionId, opts.userId);
  const questionBlock = buildQuestionBlock(question);
  const userTurn = opts.mode === 'free_qa' ? (opts.question || '').trim() : MODE_INSTRUCTION[opts.mode];

  const messages: TutorMessage[] = [
    { role: 'user', content: `MÔN: ${courseLabel}\n\n${questionBlock}` },
    { role: 'assistant', content: 'Đã rõ. Tôi đang xem câu hỏi này và sẵn sàng giúp.' },
    ...(opts.history || []).slice(-MAX_HISTORY),
    { role: 'user', content: userTurn },
  ];
  return { system: TUTOR_SYSTEM, messages };
}

async function callTutor(system: string, messages: TutorMessage[], userId: number, provider: TutorProvider | undefined, onToken?: (delta: string) => void) {
  const call = (purpose: 'exam_tutor' | 'chat_max', timeoutMs: number, onTok?: (delta: string) => void) => llmComplete({
    step: 'generation',
    feature: 'exam',
    purpose,
    system,
    messages,
    maxTokens: 3000,
    maxRetries: 2,
    timeoutMs,
    userId,
    onToken: onTok,
  });

  // Người dùng tự chọn tay — gọi thẳng, đợi đủ lâu (180s), không lùi.
  if (provider === 'sol') return call('chat_max', 180_000, onToken);
  if (provider === 'opus') return call('exam_tutor', 180_000, onToken);

  // Tự động: rambo (opus) trước, nhưng chỉ đợi 25s — quan sát thật cho thấy
  // opus qua rambo trả mẩu chữ đầu trong ~4-5s khi khoẻ; 25s không thấy gì
  // là có vấn đề, đừng bắt người dùng "đang soạn…" suốt 3 phút mới biết.
  // Nếu ĐàCÓ mẩu chữ nào về rồi mới hỏng giữa chừng thì KHÔNG lùi — trộn
  // output của 2 model khác nhau vào cùng một câu trả lời còn tệ hơn báo lỗi.
  let gotDelta = false;
  const wrapped = onToken ? (d: string) => { gotDelta = true; onToken(d); } : undefined;
  try {
    return await call('exam_tutor', 25_000, wrapped);
  } catch (e) {
    if (gotDelta) throw e;
    return call('chat_max', 180_000, onToken);
  }
}

export async function askExamTutorStream(opts: ExamTutorAskOpts, onToken: (delta: string) => void): Promise<{ answer: string }> {
  await assertPro(opts.userId);
  await assertAiReady(opts.userId);
  const { system, messages } = await buildTutorCall(opts);
  const res = await callTutor(system, messages, opts.userId, opts.provider, onToken);
  const answer = (res.text || '').trim();
  if (!answer) throw new AppError('CuongMini chưa trả lời được. Thử lại nhé.', 400);
  return { answer };
}

export async function askExamTutor(opts: ExamTutorAskOpts): Promise<{ answer: string }> {
  await assertPro(opts.userId);
  await assertAiReady(opts.userId);
  const { system, messages } = await buildTutorCall(opts);
  const res = await callTutor(system, messages, opts.userId, opts.provider);
  const answer = (res.text || '').trim();
  if (!answer) throw new AppError('CuongMini chưa trả lời được. Thử lại nhé.', 400);
  return { answer };
}
