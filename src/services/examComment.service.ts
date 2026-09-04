/**
 * ============================================================
 * Bình luận theo câu hỏi Exam Room
 * ============================================================
 *
 * Mở cho MỌI tài khoản đã đăng nhập, không cần Pro, không cần đang thi câu
 * đó — giống các mục bình luận khác trong site (Tech Trends, Social). Một
 * cấp trả lời qua parentId (theo đúng mẫu ArticleComments/TechTrendComment).
 *
 * Bot "cuongmini" (tạo sẵn bằng migration 20260863000000) tự đăng câu trả
 * lời CuongMini vào đây, đánh dấu isAi=true — xem postAiAnswerComment(),
 * gọi từ examTutor.service.ts sau mỗi lượt AI trả lời thành công.
 */
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const MAX_CONTENT = 3000;

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

export async function createComment(questionId: number, userId: number, content: string, parentId?: number | null) {
  const text = (content || '').trim();
  if (!text) throw new AppError('Bình luận trống.', 400);
  if (text.length > MAX_CONTENT) throw new AppError('Bình luận dài quá.', 400);

  const question = await prisma.examQuestion.findUnique({ where: { id: questionId }, select: { id: true } });
  if (!question) throw new AppError('Không tìm thấy câu hỏi.', 404);

  if (parentId) {
    const parent = await prisma.examQuestionComment.findUnique({ where: { id: parentId }, select: { questionId: true, parentId: true } });
    if (!parent || parent.questionId !== questionId) throw new AppError('Không tìm thấy bình luận gốc.', 404);
    if (parent.parentId) throw new AppError('Chỉ trả lời được 1 cấp.', 400);
  }

  const created = await prisma.examQuestionComment.create({
    data: { questionId, userId, parentId: parentId || null, content: text },
    include: { user: { select: AUTHOR_SELECT } },
  });
  return { id: created.id, content: created.content, isAi: created.isAi, isEdited: created.isEdited, likesCount: created.likesCount, createdAt: created.createdAt, author: authorShape(created.user), replies: [] as unknown[] };
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
 */
export async function findCachedAiAnswer(questionId: number, askedText: string): Promise<string | null> {
  const botId = await getBotUserId();
  if (!botId || !askedText.trim()) return null;
  const norm = askedText.trim().toLowerCase();
  const rows = await prisma.examQuestionComment.findMany({
    where: { questionId, userId: botId, parentId: null },
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

/** Đăng câu trả lời CuongMini vào bình luận của đúng câu — không chặn/ném lỗi
 * ra caller nếu hỏng (không được để lỗi ghi comment làm hỏng câu trả lời AI
 * người dùng đang chờ). */
export async function postAiAnswerComment(questionId: number, mode: string, question: string | undefined, answer: string): Promise<void> {
  try {
    const botId = await getBotUserId();
    if (!botId) return; // migration bot user chưa chạy tới — bỏ qua, không lỗi
    const askedText = buildAskedLabel(mode, question);
    const content = `**Hỏi:** ${askedText}\n\n**CuongMini trả lời:**\n${answer}`.slice(0, MAX_CONTENT);
    await prisma.examQuestionComment.create({ data: { questionId, userId: botId, content, isAi: true } });
  } catch { /* đăng bình luận hỏng thì thôi, không ảnh hưởng câu trả lời chính */ }
}
