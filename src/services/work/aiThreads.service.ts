/**
 * CT Work — hội thoại AI lưu ở SERVER, dùng chung trong dự án (25/09/2026).
 *
 * Trước đây lịch sử chỉ nằm trong sessionStorage của trình duyệt: đóng tab là
 * mất câu trả lời vừa trả tiền token để có, và người khác trong nhóm không bao
 * giờ thấy. Giờ mỗi dự án có danh sách hội thoại:
 *
 *   • PROJECT (mặc định) — mọi thành viên xem được dự án đều đọc được, thấy ai
 *     hỏi gì, và hỏi tiếp (người hỏi tiếp trả hạn mức AI của CHÍNH họ).
 *   • PRIVATE — chỉ người tạo thấy. Cho câu hỏi không muốn cả nhóm đọc.
 *
 * Quyền: đọc = `project.view` + thấy được hội thoại; hỏi = `ai.use` (kiểm ở
 * ai.service). Đổi tên / đổi chế độ / xoá = người tạo hoặc ADMIN của dự án.
 * Xoá là xoá MỀM (deletedAt) — không có đường nào làm mất hội thoại ngoài ý muốn.
 *
 * Người lạ đoán id hội thoại của dự án khác ⇒ 404, không phải 403 (không để lộ
 * rằng nó tồn tại) — cùng quy ước với `requireProject`.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { requireProject, type ProjectAccess } from './permissions.js';

export type ThreadVisibility = 'PROJECT' | 'PRIVATE';
export type StoredActionStatus = 'pending' | 'applying' | 'done' | 'error' | 'dismissed';

/** Một đề xuất AI kèm trạng thái — lưu trong cột JSON `actions` của tin nhắn. */
export interface StoredAction {
  action: unknown;
  status: StoredActionStatus;
  summary?: string;
  number?: number;
  error?: string;
  byId?: number;
  byName?: string;
  at?: string;
}

const HISTORY_TURNS = 10;
const MAX_MESSAGES = 300;

const AUTHOR_SELECT = { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } as const;
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

type ThreadRow = { id: number; projectId: number; createdById: number | null; visibility: string; deletedAt: Date | null };

function canSee(t: ThreadRow, userId: number): boolean {
  return !t.deletedAt && (t.visibility === 'PROJECT' || t.createdById === userId);
}

/** Hội thoại mà người này được XEM trong dự án đã kiểm quyền — không thì 404. */
export async function visibleThread(userId: number, projectId: number, threadId: number) {
  const t = await prisma.workAiThread.findUnique({
    where: { id: threadId },
    select: { id: true, projectId: true, createdById: true, visibility: true, deletedAt: true, issueNumber: true, title: true },
  });
  if (!t || t.projectId !== projectId || !canSee(t, userId)) throw new NotFoundError('Conversation not found');
  return t;
}

/** Mở hội thoại để hỏi tiếp, hoặc tạo mới (tiêu đề = câu hỏi đầu tiên). */
export async function openThread(userId: number, access: ProjectAccess, input: { threadId?: number | null; seed: string; issueNumber?: number | null }) {
  if (input.threadId) return visibleThread(userId, access.projectId, input.threadId);
  const title = clip(input.seed.replace(/\s+/g, ' ').trim() || 'New conversation', 160);
  return prisma.workAiThread.create({
    data: { projectId: access.projectId, createdById: userId, title, issueNumber: input.issueNumber ?? null },
    select: { id: true, projectId: true, createdById: true, visibility: true, deletedAt: true, issueNumber: true, title: true },
  });
}

/**
 * Lịch sử gửi cho model: 10 lượt gần nhất TRƯỚC `beforeId` (nếu có), bỏ câu
 * hỏi chưa được trả lời. Ghi rõ AI ai hỏi — hội thoại chung có nhiều người.
 */
export async function historyText(threadId: number, beforeId?: number): Promise<string> {
  const rows = await prisma.workAiMessage.findMany({
    where: { threadId, error: null, ...(beforeId ? { id: { lt: beforeId } } : {}) },
    orderBy: { id: 'desc' },
    take: HISTORY_TURNS,
    select: { role: true, content: true, title: true, author: { select: { username: true } } },
  });
  return rows.reverse().map((m) => (m.role === 'user'
    ? `User @${m.author?.username ?? 'former-member'}: ${clip(m.content, 2500)}`
    : `Assistant${m.title ? ` (${m.title})` : ''}: ${clip(m.content, 2500)}`)).join('\n');
}

export async function addMessage(threadId: number, data: {
  role: 'user' | 'assistant'; authorId?: number | null; content: string; title?: string | null;
  issueNumber?: number | null; actions?: StoredAction[] | null;
}) {
  const [msg] = await prisma.$transaction([
    prisma.workAiMessage.create({
      data: {
        threadId, role: data.role, authorId: data.authorId ?? null, content: data.content,
        title: data.title ? clip(data.title, 120) : null, issueNumber: data.issueNumber ?? null,
        actions: data.actions?.length ? (data.actions as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
      select: MESSAGE_SELECT,
    }),
    prisma.workAiThread.update({ where: { id: threadId }, data: { messageCount: { increment: 1 }, lastMessageAt: new Date() } }),
  ]);
  return serializeMessage(msg);
}

/** Câu hỏi không được trả lời (cổng AI hỏng…) — GIỮ câu hỏi, đánh dấu để bấm "Retry". */
export async function markFailed(messageId: number, err: unknown) {
  const text = err instanceof Error ? err.message : String(err);
  await prisma.workAiMessage.update({ where: { id: messageId }, data: { error: clip(text || 'The AI could not answer', 300) } }).catch(() => undefined);
}

export async function clearFailed(messageId: number) {
  await prisma.workAiMessage.update({ where: { id: messageId }, data: { error: null } });
}

/** Tạo hội thoại trống TRƯỚC câu hỏi đầu tiên — để câu đầu mà hỏng thì client vẫn biết hội thoại nào có nút "Retry". */
export async function createThread(userId: number, projectId: number, input: { title: string; issueNumber?: number | null; visibility?: ThreadVisibility }) {
  await requireProject(userId, projectId, 'ai.use');
  const t = await prisma.workAiThread.create({
    data: {
      projectId, createdById: userId, title: clip(input.title.replace(/\s+/g, ' ').trim() || 'New conversation', 160),
      issueNumber: input.issueNumber ?? null, visibility: input.visibility ?? 'PROJECT',
    },
    select: { id: true },
  });
  return getThread(userId, projectId, t.id);
}

// ─── Đọc ─────────────────────────────────────────────────────────

const MESSAGE_SELECT = {
  id: true, threadId: true, role: true, content: true, title: true, issueNumber: true, actions: true, error: true, createdAt: true,
  author: { select: AUTHOR_SELECT },
} as const;

type MessageRow = Prisma.WorkAiMessageGetPayload<{ select: typeof MESSAGE_SELECT }>;

export function serializeMessage(m: MessageRow) {
  const actions = Array.isArray(m.actions) ? (m.actions as unknown as StoredAction[]) : [];
  return {
    id: m.id, threadId: m.threadId, role: m.role as 'user' | 'assistant', content: m.content, title: m.title,
    issueNumber: m.issueNumber, error: m.error, createdAt: m.createdAt.toISOString(), author: m.author,
    actions: actions.map((a, index) => ({ index, ...a })),
  };
}
export type AiMessageDto = ReturnType<typeof serializeMessage>;

export async function listThreads(userId: number, projectId: number, opts: { scope?: 'all' | 'mine'; q?: string | null; limit?: number }) {
  await requireProject(userId, projectId, 'project.view');
  const q = opts.q?.trim();
  const and: Prisma.WorkAiThreadWhereInput[] = [{ OR: [{ visibility: 'PROJECT' }, { createdById: userId }] }];
  if (opts.scope === 'mine') and.push({ OR: [{ createdById: userId }, { messages: { some: { authorId: userId } } }] });
  if (q) and.push({ OR: [{ title: { contains: q, mode: 'insensitive' } }, { messages: { some: { content: { contains: q, mode: 'insensitive' } } } }] });
  // messageCount > 0: hội thoại tạo ra mà câu hỏi đầu chưa kịp tới server thì không làm rác danh sách.
  const where: Prisma.WorkAiThreadWhereInput = { projectId, deletedAt: null, messageCount: { gt: 0 }, AND: and };
  const rows = await prisma.workAiThread.findMany({
    where, orderBy: { lastMessageAt: 'desc' }, take: Math.min(opts.limit ?? 50, 100),
    select: {
      id: true, title: true, visibility: true, issueNumber: true, messageCount: true, lastMessageAt: true, createdAt: true, createdById: true,
      createdBy: { select: AUTHOR_SELECT },
    },
  });
  // Những ai đã hỏi trong từng hội thoại (hiện avatar chồng nhau trong danh sách).
  const who = rows.length ? await prisma.workAiMessage.findMany({
    where: { threadId: { in: rows.map((r) => r.id) }, role: 'user', authorId: { not: null } },
    distinct: ['threadId', 'authorId'],
    select: { threadId: true, author: { select: AUTHOR_SELECT } },
  }) : [];
  return rows.map((r) => ({
    ...r,
    lastMessageAt: r.lastMessageAt.toISOString(),
    createdAt: r.createdAt.toISOString(),
    participants: who.filter((w) => w.threadId === r.id && w.author).map((w) => w.author!),
    mine: r.createdById === userId,
  }));
}

export async function getThread(userId: number, projectId: number, threadId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  await visibleThread(userId, projectId, threadId);
  const t = await prisma.workAiThread.findUniqueOrThrow({
    where: { id: threadId },
    select: {
      id: true, title: true, visibility: true, issueNumber: true, messageCount: true, lastMessageAt: true, createdAt: true, createdById: true,
      createdBy: { select: AUTHOR_SELECT },
    },
  });
  const messages = await prisma.workAiMessage.findMany({ where: { threadId }, orderBy: { id: 'asc' }, take: MAX_MESSAGES, select: MESSAGE_SELECT });
  return {
    ...t,
    lastMessageAt: t.lastMessageAt.toISOString(),
    createdAt: t.createdAt.toISOString(),
    canManage: t.createdById === userId || access.role === 'ADMIN',
    messages: messages.map(serializeMessage),
  };
}

async function requireManage(userId: number, projectId: number, threadId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const t = await visibleThread(userId, projectId, threadId);
  if (t.createdById !== userId && access.role !== 'ADMIN') throw new ForbiddenError('Only the person who started this conversation (or a project admin) can change it');
  return t;
}

export async function updateThread(userId: number, projectId: number, threadId: number, input: { title?: string; visibility?: ThreadVisibility }) {
  await requireManage(userId, projectId, threadId);
  const title = input.title?.replace(/\s+/g, ' ').trim();
  if (input.title !== undefined && !title) throw new BadRequestError('Title cannot be empty');
  await prisma.workAiThread.update({
    where: { id: threadId },
    data: { ...(title ? { title: clip(title, 160) } : {}), ...(input.visibility ? { visibility: input.visibility } : {}) },
  });
  return getThread(userId, projectId, threadId);
}

export async function deleteThread(userId: number, projectId: number, threadId: number) {
  await requireManage(userId, projectId, threadId);
  await prisma.workAiThread.update({ where: { id: threadId }, data: { deletedAt: new Date() } });
  return { ok: true };
}

// ─── Trạng thái đề xuất (khoá chống áp dụng trùng) ─────────────────

/** Sau bao lâu một lượt "đang áp dụng" bị coi là treo (tiến trình chết giữa chừng) và được giành lại. */
const APPLY_STALE_MS = 2 * 60_000;

/**
 * GIÀNH quyền áp dụng đề xuất `index` của tin nhắn — trong MỘT transaction có
 * `FOR UPDATE` trên đúng dòng tin nhắn. Hai người bấm Apply cùng lúc: người sau
 * chờ khoá, đọc thấy `applying`/`done` và bị từ chối, nên thẻ không bị tạo hai lần.
 */
export async function claimAction(userId: number, userName: string, messageId: number, index: number): Promise<StoredAction> {
  return prisma.$transaction(async (tx) => {
    const locked = await tx.$queryRaw<Array<{ actions: unknown }>>`SELECT actions FROM work_ai_messages WHERE id = ${messageId} FOR UPDATE`;
    const list = Array.isArray(locked[0]?.actions) ? (locked[0].actions as StoredAction[]) : [];
    const item = list[index];
    if (!item) throw new NotFoundError('Suggestion not found');
    const stale = item.status === 'applying' && item.at && Date.now() - Date.parse(item.at) > APPLY_STALE_MS;
    if (item.status === 'done') throw new BadRequestError(`Already applied${item.byName ? ` by @${item.byName}` : ''}`, 'WORK_AI_ALREADY_APPLIED');
    if (item.status === 'applying' && !stale) throw new BadRequestError(`@${item.byName ?? 'someone'} is applying this right now`, 'WORK_AI_APPLYING');
    if (item.status === 'dismissed') throw new BadRequestError('This suggestion was dismissed — restore it first', 'WORK_AI_DISMISSED');
    list[index] = { ...item, status: 'applying', error: undefined, byId: userId, byName: userName, at: new Date().toISOString() };
    await tx.workAiMessage.update({ where: { id: messageId }, data: { actions: list as unknown as Prisma.InputJsonValue } });
    return item;
  });
}

/** Ghi kết quả áp dụng / bỏ qua vào đúng phần tử (cũng dưới khoá dòng). */
export async function patchAction(messageId: number, index: number, patch: Partial<StoredAction>, onlyFrom?: StoredActionStatus[]) {
  return prisma.$transaction(async (tx) => {
    const locked = await tx.$queryRaw<Array<{ actions: unknown }>>`SELECT actions FROM work_ai_messages WHERE id = ${messageId} FOR UPDATE`;
    const list = Array.isArray(locked[0]?.actions) ? (locked[0].actions as StoredAction[]) : [];
    const item = list[index];
    if (!item) throw new NotFoundError('Suggestion not found');
    if (onlyFrom && !onlyFrom.includes(item.status)) throw new BadRequestError(`This suggestion is already ${item.status}`, 'WORK_AI_ACTION_STATE');
    list[index] = { ...item, ...patch };
    await tx.workAiMessage.update({ where: { id: messageId }, data: { actions: list as unknown as Prisma.InputJsonValue } });
    return { index, ...list[index] };
  });
}

/** Tin nhắn thuộc hội thoại người này xem được trong dự án — không thì 404. */
export async function visibleMessage(userId: number, projectId: number, messageId: number) {
  const m = await prisma.workAiMessage.findUnique({
    where: { id: messageId },
    select: { id: true, role: true, content: true, error: true, issueNumber: true, threadId: true, authorId: true, thread: { select: { id: true, projectId: true, createdById: true, visibility: true, deletedAt: true } } },
  });
  if (!m || m.thread.projectId !== projectId || !canSee(m.thread, userId)) throw new NotFoundError('Message not found');
  return m;
}
