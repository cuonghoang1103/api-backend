/**
 * ============================================================
 * Academy — gia sư AI hỏi-đáp trong TỪNG bài học (Pro only)
 * ============================================================
 *
 * Khác Code Lab (có bản giảng cache + chat), ở đây Academy chưa từng có AI nào.
 * Đây là bản chat THUẦN, luôn sẵn sàng: học viên mở một bài học bất kỳ và hỏi
 * ngay — bắt đầu từ đâu, chỗ chưa hiểu, kiến thức nền còn thiếu, xin bài tập
 * luyện + nhờ chữa bài, review. Ngữ cảnh = nội dung bài + tên môn, nên câu trả
 * lời bám đúng bài đang học chứ không chung chung.
 *
 * Pro-gate ở cả route lẫn service (một service tin caller cho quyền là một lần
 * refactor nữa sẽ thành miễn phí cho tất cả). Không lưu hội thoại — hỏi-đáp là
 * của riêng từng người, từng lúc; frontend gửi kèm `history` để nối mạch.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable, aiOffReason, circuitReopensInMs } from './interview/llm/index.js';
import { isProEffective } from './pro.service.js';

const MAX_QUESTION = 1500;
const MAX_HISTORY = 12;

export interface TutorMessage { role: 'user' | 'assistant'; content: string }

async function assertPro(userId: number | null | undefined) {
  if (!(await isProEffective(userId))) {
    throw new ForbiddenError('Hỏi AI là tính năng Pro.');
  }
  // Dùng chung "cầu dao" (circuit breaker) nhóm 'codelab' với Code Lab: cùng là
  // gia sư tương tác, gộp trạng thái AI-sống/chết cho gọn.
  if (!isAiAvailable('codelab')) {
    const reason = aiOffReason('codelab');
    throw new BadRequestError(
      reason === 'circuit'
        ? `AI đang nghỉ sau vài lỗi cổng — mở lại sau khoảng ${Math.ceil(circuitReopensInMs('codelab') / 1000)}s. Thử lại lúc đó nhé.`
        : reason === 'static'
          ? 'AI đang tắt trên máy chủ này (FORCE_STATIC_MODE).'
          : 'Dịch vụ AI chưa được cấu hình trên máy chủ này.',
    );
  }
  if (userId && !(await checkTokenQuota(userId))) {
    throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay.');
  }
}

/** Bóc HTML về text thuần cho ngữ cảnh (không cần đẹp, chỉ cần đọc được). */
function plain(html: string | null | undefined, cap = 8000): string {
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

async function loadLesson(lessonId: number) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      content: true,
      lessonType: true,
      details: { select: { teachingNotes: true } },
      section: {
        select: {
          title: true,
          course: { select: { courseCode: true, title: true } },
        },
      },
    },
  });
  if (!lesson) throw new NotFoundError('Không tìm thấy bài học.');
  return lesson;
}

// Phần chung của prompt (khả năng + luật + cách trình bày). Ngôn ngữ tách riêng
// bên dưới để đổi VI/EN mà không nhân đôi cả prompt.
const TUTOR_SYSTEM_BASE = `You are a patient tutor for FPT University students, embedded inside ONE
specific course lesson the student is studying. You know the course and the lesson content below.

You help with anything about learning THIS lesson/course:
- Where to start and how to study this lesson if the student is lost.
- Clarifying whatever part the student does not understand, in plain words.
- Filling prerequisite gaps from earlier FPTU courses when they block this lesson.
- Generating practice exercises on request, AND grading / reviewing the student's pasted
  attempt (code, answers, essays) with concrete, actionable feedback.
- Reviewing and explaining code or answers step by step.

Rules:
- Be concrete and refer to the lesson content; quote its own terms. Generic advice that
  would fit any lesson is not useful.
- Teach to UNDERSTAND. Do NOT just hand over full solutions to graded assignments or exams;
  guide the student to the answer and explain the reasoning.
- When you generate practice, number the exercises and say what each one drills.
- If the question is not about this course/lesson or about studying it, say so briefly and
  steer back.

FORMATTING — your answer is rendered as RICH markdown (bold, lists, tables, highlighted
code, KaTeX math, SVG figures). Use it well; keep it clean and scannable, never a wall of text:
- Short paragraphs + bullet/numbered lists; **bold** key terms; use a markdown table when comparing.
- Code: fenced blocks WITH a language — \`\`\`java … \`\`\`, \`\`\`jsx … \`\`\`, \`\`\`sql … \`\`\`.
- Math: LaTeX only inside math delimiters — inline $…$, display $$…$$ (e.g. $O(n^2)$,
  $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$). Never write \\frac, ^, _ outside $…$.
- Diagrams / flowcharts / trees / UML when they clarify a STRUCTURE: output ONE small,
  self-contained SVG inside a \`\`\`svg fence (viewBox; simple <rect>/<line>/<text>; no external
  refs/scripts). Prefer a diagram over a long verbal description.`;

// Mặc định: TIẾNG VIỆT (giữ thuật ngữ tiếng Anh). Không trả lời hai thứ tiếng
// một lúc nữa — vừa phí token vừa dài. Cần bản tiếng Anh thì bấm nút riêng.
const LANG_VI = `\n\nLANGUAGE — Answer ENTIRELY in Vietnamese, natural and clear. KEEP the following in
English (do NOT translate): technical terms, code identifiers, library / API / framework /
class / method names, and standard technical phrases (e.g. "component", "state", "props",
"commit", "unit test", "requirement", "endpoint", "pull request"). Do NOT write a separate
English version — Vietnamese only.`;

const LANG_EN = `\n\nLANGUAGE — Answer ENTIRELY in English.`;

const tutorSystem = (english?: boolean): string => TUTOR_SYSTEM_BASE + (english ? LANG_EN : LANG_VI);

export interface TutorAskOpts {
  userId: number;
  question: string;
  history?: TutorMessage[];
  /** true ⇒ trả lời bằng tiếng Anh (nút "Bản tiếng Anh"); mặc định tiếng Việt. */
  english?: boolean;
}

// Dựng system + messages một chỗ để bản STREAM và bản thường luôn giống hệt nhau.
async function buildTutorCall(
  lessonId: number,
  opts: TutorAskOpts,
): Promise<{ system: string; messages: TutorMessage[] }> {
  const question = (opts.question || '').trim();
  if (!question) throw new BadRequestError('Hãy nhập câu hỏi.');
  if (question.length > MAX_QUESTION) throw new BadRequestError('Câu hỏi dài quá.');

  await assertPro(opts.userId);
  const lesson = await loadLesson(lessonId);

  const course = lesson.section?.course;
  const heading = [course?.courseCode, course?.title].filter(Boolean).join(' — ') || 'Khoá học';
  const notes = lesson.details?.teachingNotes ? `\n\nGHI CHÚ GIẢNG DẠY\n${plain(lesson.details.teachingNotes, 3000)}` : '';

  const messages: TutorMessage[] = [
    {
      role: 'user',
      content:
        `THE LESSON\n${heading}\nBài: ${lesson.title}\n\n` +
        `NỘI DUNG BÀI\n${plain(lesson.content, 8000) || '(bài này chủ yếu là video/không có nội dung chữ)'}` +
        notes,
    },
    { role: 'assistant', content: 'Đã rõ. Tôi đang xem bài học này và sẵn sàng giúp.' },
    ...(opts.history || []).slice(-MAX_HISTORY),
    { role: 'user', content: question },
  ];
  return { system: tutorSystem(opts.english), messages };
}

/** Trả lời một câu (không stream) — dùng làm đường lùi khi SSE hỏng. Không lưu. */
export async function askCourseTutor(lessonId: number, opts: TutorAskOpts): Promise<{ answer: string }> {
  const { system, messages } = await buildTutorCall(lessonId, opts);
  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab', // gộp cầu dao/nhóm với gia sư Code Lab
    purpose: 'course_tutor', // → Claude Opus 4.8 (chat nhỏ, không dính rate-limit)
    system,
    messages,
    maxTokens: 4000,
    maxRetries: 2,
    timeoutMs: 180_000,
    userId: opts.userId,
  });
  const answer = (res.text || '').trim();
  if (!answer) throw new BadRequestError('AI chưa trả lời được. Thử lại nhé.');
  return { answer };
}

/**
 * Bản STREAM: gọi `onToken` mỗi mẩu chữ để frontend hiện dần ("gõ từng chữ").
 * Trả về câu trả lời ĐẦY ĐỦ cuối cùng (route gửi nó ở khung "done" làm bản chuẩn
 * — nếu stream có lặp do retry thì frontend thay bằng bản này). maxRetries 1 để
 * hạn chế phát lại từ đầu.
 */
export async function streamCourseTutor(
  lessonId: number,
  opts: TutorAskOpts,
  onToken: (delta: string) => void,
): Promise<{ answer: string }> {
  const { system, messages } = await buildTutorCall(lessonId, opts);
  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    purpose: 'course_tutor',
    system,
    messages,
    maxTokens: 4000,
    maxRetries: 1,
    timeoutMs: 180_000,
    userId: opts.userId,
    onToken,
  });
  const answer = (res.text || '').trim();
  if (!answer) throw new BadRequestError('AI chưa trả lời được. Thử lại nhé.');
  return { answer };
}
