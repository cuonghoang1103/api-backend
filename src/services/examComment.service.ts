/**
 * ============================================================
 * Bình luận theo câu hỏi Exam Room
 * ============================================================
 *
 * Mở cho MỌI tài khoản đã đăng nhập, không cần Pro, không cần đang thi câu
 * đó — giống các mục bình luận khác trong site (Tech Trends, Social). Một
 * cấp trả lời qua parentId (theo đúng mẫu ArticleComments/TechTrendComment).
 *
 * BỀN qua re-seed đề: deploy.sh "Exam Room seed" xoá+tạo lại TOÀN BỘ
 * ExamQuestion mỗi deploy (id đổi). questionId trên bình luận là CACHE
 * nhanh — mỗi bình luận còn lưu examId (không đổi) + promptHash (nội dung
 * câu, CÙNG thuật toán scripts/_exam-hash.mjs, PHẢI khớp để
 * scripts/exam-reapply-comments.mjs nối lại đúng câu sau mỗi deploy — xem
 * hàm bên dưới, đừng đổi một bên mà quên bên kia).
 *
 * Bot "cuongmini" (tạo sẵn bằng migration 20260863000000) tự đăng câu trả
 * lời CuongMini vào đây, đánh dấu isAi=true — xem postAiAnswerComment(),
 * gọi từ examTutor.service.ts sau mỗi lượt AI trả lời thành công.
 */
import { createHash } from 'node:crypto';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const MAX_CONTENT = 3000;
// Trả lời CuongMini là lời giải nhiều bước/nhiều cách (đã thấy thật 5 cách
// giải cho 1 câu) — 3000 ký tự cắt cụt giữa chừng, không phải bị "giới hạn
// câu trả lời" (LLM không giới hạn độ dài) mà là bị CẮT LÚC ĐĂNG BÌNH LUẬN,
// im lặng không báo, người đọc tưởng bài giải viết dở dang. Người thật gõ
// tay thì 3000 vẫn đủ (chặn spam bài dài); AI thì nới hẳn — TEXT trong
// Postgres không có trần thật sự.
const MAX_AI_CONTENT = 20000;

// PHẢI khớp hệt scripts/_exam-hash.mjs (dùng bởi exam-reapply-comments.mjs
// và exam-classify-chapters.mjs) — lệch một ký tự chuẩn hoá là promptHash
// không bao giờ khớp lại được sau reseed.
function normalizePrompt(prompt: string): string {
  return String(prompt || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .slice(0, 600);
}
function promptHash(prompt: string): string {
  return createHash('sha256').update(normalizePrompt(prompt)).digest('hex');
}

function authorShape(u: { id: number; username: string; displayName: string | null; fullName: string | null; avatarUrl: string | null }) {
  return { id: u.id, username: u.username, displayName: u.displayName, fullName: u.fullName, avatarUrl: u.avatarUrl };
}

const AUTHOR_SELECT = { id: true, username: true, displayName: true, fullName: true, avatarUrl: true } as const;

export async function listComments(questionId: number) {
  const rows = await prisma.examQuestionComment.findMany({
    where: { questionId, parentId: null },
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: AUTHOR_SELECT },
      replies: {
        orderBy: { createdAt: 'asc' },
        include: { user: { select: AUTHOR_SELECT } },
      },
    },
  });
  return rows.map((c) => ({
    id: c.id, content: c.content, isAi: c.isAi, isEdited: c.isEdited, likesCount: c.likesCount,
    createdAt: c.createdAt, author: authorShape(c.user),
    replies: c.replies.map((r) => ({
      id: r.id, content: r.content, isAi: r.isAi, isEdited: r.isEdited, likesCount: r.likesCount,
      createdAt: r.createdAt, author: authorShape(r.user),
    })),
  }));
}

async function createCommentInternal(questionId: number, userId: number, content: string, parentId: number | null | undefined, isAi: boolean) {
  const text = (content || '').trim();
  if (!text) throw new AppError('Bình luận trống.', 400);
  if (text.length > (isAi ? MAX_AI_CONTENT : MAX_CONTENT)) throw new AppError('Bình luận dài quá.', 400);

  const question = await prisma.examQuestion.findUnique({ where: { id: questionId }, select: { id: true, examId: true, prompt: true } });
  if (!question) throw new AppError('Không tìm thấy câu hỏi.', 404);

  if (parentId) {
    const parent = await prisma.examQuestionComment.findUnique({ where: { id: parentId }, select: { examId: true, parentId: true } });
    if (!parent || parent.examId !== question.examId) throw new AppError('Không tìm thấy bình luận gốc.', 404);
    if (parent.parentId) throw new AppError('Chỉ trả lời được 1 cấp.', 400);
  }

  const created = await prisma.examQuestionComment.create({
    data: {
      questionId, examId: question.examId, promptHash: promptHash(question.prompt),
      userId, parentId: parentId || null, content: text, isAi,
    },
    include: { user: { select: AUTHOR_SELECT } },
  });
  return { id: created.id, content: created.content, isAi: created.isAi, isEdited: created.isEdited, likesCount: created.likesCount, createdAt: created.createdAt, author: authorShape(created.user), replies: [] as unknown[] };
}

export async function createComment(questionId: number, userId: number, content: string, parentId?: number | null) {
  return createCommentInternal(questionId, userId, content, parentId, false);
}

export async function updateComment(commentId: number, userId: number, content: string) {
  const text = (content || '').trim();
  if (!text) throw new AppError('Bình luận trống.', 400);
  const existing = await prisma.examQuestionComment.findUnique({ where: { id: commentId }, select: { userId: true } });
  if (!existing) throw new AppError('Không tìm thấy bình luận.', 404);
  if (existing.userId !== userId) throw new AppError('Chỉ sửa được bình luận của chính mình.', 403);
  await prisma.examQuestionComment.update({ where: { id: commentId }, data: { content: text, isEdited: true } });
}

export async function deleteComment(commentId: number, userId: number, isAdmin: boolean) {
  const existing = await prisma.examQuestionComment.findUnique({ where: { id: commentId }, select: { userId: true } });
  if (!existing) throw new AppError('Không tìm thấy bình luận.', 404);
  if (existing.userId !== userId && !isAdmin) throw new AppError('Chỉ xoá được bình luận của chính mình.', 403);
  await prisma.examQuestionComment.delete({ where: { id: commentId } });
}

// ── Bot "cuongmini" ──────────────────────────────────────────────────
let botUserIdCache: number | null = null;
async function getBotUserId(): Promise<number | null> {
  if (botUserIdCache) return botUserIdCache;
  const bot = await prisma.user.findUnique({ where: { username: 'cuongmini' }, select: { id: true } });
  botUserIdCache = bot?.id ?? null;
  return botUserIdCache;
}

const MODE_LABEL: Record<string, string> = {
  how_to_solve: 'Câu này làm như nào?',
  how_to_remember: 'Câu này nhớ như nào?',
  knowledge: 'Câu này kiến thức là gì?',
  why_others_wrong: 'Vì sao các đáp án khác sai?',
  similar_example: 'Cho ví dụ tương tự để luyện thêm',
  common_mistakes: 'Lỗi hay gặp khi làm câu này?',
  summary_rule: 'Tóm tắt công thức/quy tắc liên quan',
};

export function buildAskedLabel(mode: string, question: string | undefined): string {
  return mode === 'free_qa' ? (question || '').trim() : (MODE_LABEL[mode] || mode);
}

const AI_COMMENT_RE = /^\*\*Hỏi:\*\* ([\s\S]*?)\n\n\*\*CuongMini trả lời:\*\*\n([\s\S]*)$/;

/**
 * "Tiết kiệm" — hỏi CuongMini đúng câu ĐÃ có bình luận CuongMini trả lời rồi
 * cho đúng câu hỏi này (cùng chữ, không phân biệt hoa/thường) thì trả lại
 * NGAY câu trả lời cũ, khỏi gọi AI lần nữa (đặc biệt rẻ với 3 gợi ý dựng sẵn,
 * vì mọi Pro user hỏi cùng 1 câu FIXED cho cùng 1 câu hỏi đề thi).
 *
 * Tìm cả GỐC lẫn REPLY (không lọc parentId) — từ khi các câu trả lời trùng
 * hỏi được gộp thành reply của bản gốc (xem postAiAnswerComment), câu trả
 * lời "còn sống" có thể nằm ở reply, không chỉ ở gốc.
 */
export async function findCachedAiAnswer(questionId: number, askedText: string): Promise<string | null> {
  const botId = await getBotUserId();
  if (!botId || !askedText.trim()) return null;
  const norm = askedText.trim().toLowerCase();
  const rows = await prisma.examQuestionComment.findMany({
    where: { questionId, userId: botId },
    orderBy: { createdAt: 'desc' },
    select: { content: true },
    take: 30,
  });
  for (const r of rows) {
    const m = r.content.match(AI_COMMENT_RE);
    if (m && m[1].trim().toLowerCase() === norm) return m[2];
  }
  return null;
}

/**
 * Tìm bình luận GỐC (parentId=null, isAi=true) của CuongMini đã trả lời
 * ĐÚNG câu hỏi này rồi (so nhãn "Hỏi:", không phân biệt hoa/thường) — dùng
 * để GỘP câu trả lời mới vào làm reply của gốc đó thay vì tạo một bình luận
 * gốc mới đứng riêng (tránh spam nhiều mục cho cùng 1 câu hỏi khi 2 câu trả
 * lời khác nhau cho cùng 1 câu hỏi được sinh ra — ví dụ race 2 request gần
 * như đồng thời trước khi cache kịp thấy nhau).
 */
async function findRootAiCommentId(questionId: number, askedText: string): Promise<number | null> {
  const botId = await getBotUserId();
  if (!botId) return null;
  const norm = askedText.trim().toLowerCase();
  const rows = await prisma.examQuestionComment.findMany({
    where: { questionId, userId: botId, parentId: null },
    orderBy: { createdAt: 'asc' },
    select: { id: true, content: true },
    take: 30,
  });
  for (const r of rows) {
    const m = r.content.match(AI_COMMENT_RE);
    if (m && m[1].trim().toLowerCase() === norm) return r.id;
  }
  return null;
}

/** Đăng câu trả lời CuongMini vào bình luận của đúng câu — không chặn/ném lỗi
 * ra caller nếu hỏng (không được để lỗi ghi comment làm hỏng câu trả lời AI
 * người dùng đang chờ). Đã có bình luận gốc trả lời ĐÚNG câu hỏi này rồi thì
 * đăng làm REPLY của gốc đó (1 câu hỏi = 1 mục, nhiều cách giải nằm gọn bên
 * trong), chưa có thì mới tạo gốc mới. */
export async function postAiAnswerComment(questionId: number, mode: string, question: string | undefined, answer: string): Promise<void> {
  try {
    const botId = await getBotUserId();
    if (!botId) return; // migration bot user chưa chạy tới — bỏ qua, không lỗi
    const askedText = buildAskedLabel(mode, question);
    const content = `**Hỏi:** ${askedText}\n\n**CuongMini trả lời:**\n${answer}`.slice(0, MAX_AI_CONTENT);
    const parentId = await findRootAiCommentId(questionId, askedText);
    await createCommentInternal(questionId, botId, content, parentId, true);
  } catch { /* đăng bình luận hỏng thì thôi, không ảnh hưởng câu trả lời chính */ }
}
