/**
 * CT Work — CTW đợt 4 (09/10/2026): Q&A LOG (A22) — câu hỏi làm rõ yêu cầu với giảng viên / khách hàng.
 *
 * Lưu là MỘT dòng sổ RAID loại `QUESTION` (đánh số chung với sổ RAID, mã "Q-n", trạng thái riêng OPEN · ANSWERED ·
 * CANCELLED) + phần riêng ở `work_raid_questions` (ngày hỏi, ai hỏi, hỏi ai, ưu tiên, câu trả lời). Đúng các cột sheet
 * Q&A của Report2_Project Tracking: Date · Question · By · To · Priority · Due Date · Status · Notes (answers).
 *
 * Tương thích dữ liệu cũ: trước đợt 4, đội ghi Q&A bằng dòng RAID nhóm "Q&A"/"Question" (đợt 3B đọc theo nhóm). Các dòng
 * đó VẪN được đọc (danh sách + sheet Q&A, đánh dấu `legacy`), không bị chuyển hay xoá; "Convert" đổi một dòng cũ thành
 * câu hỏi thật (giữ số, giữ lịch sử).
 *
 * Quyền: như sổ RAID (governanceAccess) nhưng KHÔNG cần bật mô-đun raid — dự án đồ án nào cũng có Q&A. Giảng viên
 * (TEACHER) xem được và TRẢ LỜI được (chỉ câu trả lời + trạng thái); khách/GUEST không thấy.
 */

import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { displayName, PUBLIC_USER } from './common.js';
import { QUESTION_STATUSES } from './constants.js';
import { emitWorkEvent } from './events.js';
import { dayOf, nextNumber } from './governanceDb.js';
import { canDeleteGovernance, governanceAccess, isClientScoped, requireProject } from './permissions.js';
import { vnDay } from './sprints.service.js';

export const QA_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
const PRIORITY_TEXT: Record<string, string> = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };
/** Trạng thái ⇒ chữ trong danh sách thả xuống của mẫu (Open, Closed, Cancelled). */
export const qaStatusText = (s: string) => (s === 'ANSWERED' || s === 'CLOSED' || s === 'VALIDATED' ? 'Closed' : s === 'CANCELLED' || s === 'INVALID' ? 'Cancelled' : 'Open');
/** Dòng RAID cũ ghi Q&A theo nhóm (trước đợt 4). */
export const isLegacyQa = (r: { type: string; category: string | null }) => r.type !== 'QUESTION' && !!r.category && /^(q\s*&\s*a|qa|question)/i.test(r.category.trim());

const dateArg = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
export const questionInput = z.object({
  question: z.string().trim().min(1).max(255),
  details: z.string().max(10_000).nullable().optional(),
  askedOn: dateArg.optional(),
  askedBy: z.string().max(120).nullable().optional(),
  askedTo: z.string().max(120).nullable().optional(),
  priority: z.enum(QA_PRIORITIES).optional(),
  due: dateArg.nullable().optional(),
  ownerId: z.number().int().positive().nullable().optional(),
  status: z.enum(QUESTION_STATUSES).optional(),
  answer: z.string().max(20_000).nullable().optional(),
});
export type QuestionInput = z.infer<typeof questionInput>;

async function qaCtx(userId: number, projectId: number, mode: 'view' | 'edit' | 'answer' = 'view') {
  const access = await requireProject(userId, projectId, 'project.view');
  const g = governanceAccess(access.role, access.workspaceRole);
  if (!g.view || isClientScoped(access)) throw new AppError('The Q&A log is only available to the project team', 403, 'WORK_INTERNAL_ONLY');
  const canAnswer = g.edit || access.role === 'TEACHER';
  if (mode === 'edit' && !g.edit) throw new ForbiddenError('You can view but not change the Q&A log');
  if (mode === 'answer' && !canAnswer) throw new ForbiddenError('You can view but not answer questions');
  return { access, canEdit: g.edit, canAnswer };
}

const SELECT = {
  id: true, number: true, type: true, title: true, description: true, category: true, status: true, reviewDate: true,
  createdAt: true, updatedAt: true, closedAt: true, createdById: true, version: true,
  owner: { select: PUBLIC_USER }, createdBy: { select: PUBLIC_USER }, question: true,
} satisfies Prisma.WorkRaidItemSelect;
type Row = Prisma.WorkRaidItemGetPayload<{ select: typeof SELECT }>;

function present(r: Row) {
  const q = r.question;
  const legacy = r.type !== 'QUESTION';
  return {
    number: r.number,
    key: `${legacy ? ({ RISK: 'R', ASSUMPTION: 'A', ISSUE: 'I', DEPENDENCY: 'D' } as Record<string, string>)[r.type] ?? 'R' : 'Q'}-${r.number}`,
    legacy,
    question: r.title,
    details: r.description,
    askedOn: q ? dayOf(q.askedOn) : r.createdAt.toISOString().slice(0, 10),
    askedBy: q?.askedBy ?? (r.createdBy ? displayName(r.createdBy) : null),
    askedTo: q?.askedTo ?? (legacy && r.owner ? displayName(r.owner) : null),
    priority: q?.priority ?? 'MEDIUM',
    priorityText: PRIORITY_TEXT[q?.priority ?? 'MEDIUM'],
    due: dayOf(r.reviewDate),
    status: r.status,
    statusText: qaStatusText(r.status),
    answer: q?.answer ?? (legacy ? r.description : null),
    answeredAt: q?.answeredAt ?? null,
    owner: r.owner,
    version: r.version,
    createdById: r.createdById,
    overdue: !!r.reviewDate && dayOf(r.reviewDate)! < vnDay() && qaStatusText(r.status) === 'Open',
  };
}
export type QuestionView = ReturnType<typeof present>;

/** Đọc thô (KHÔNG kiểm quyền) — sheet Q&A của Project Tracking dùng chung. */
export async function loadQuestions(projectId: number): Promise<QuestionView[]> {
  const rows = await prisma.workRaidItem.findMany({
    where: { projectId, deletedAt: null, OR: [{ type: 'QUESTION' }, { category: { not: null } }] },
    orderBy: { number: 'asc' }, take: 5000, select: SELECT,
  });
  return rows.filter((r) => r.type === 'QUESTION' || isLegacyQa(r)).map(present);
}

export async function listQuestions(userId: number, projectId: number, q: { status?: 'open' | 'closed' | 'all' } = {}) {
  const ctx = await qaCtx(userId, projectId);
  const all = await loadQuestions(projectId);
  const items = all.filter((x) => !q.status || q.status === 'all' || (q.status === 'open' ? x.statusText === 'Open' : x.statusText !== 'Open')).reverse();
  return {
    items,
    counts: { total: all.length, open: all.filter((x) => x.statusText === 'Open').length, overdue: all.filter((x) => x.overdue).length, legacy: all.filter((x) => x.legacy).length },
    canEdit: ctx.canEdit, canAnswer: ctx.canAnswer,
  };
}

async function findRow(projectId: number, number: number) {
  const r = await prisma.workRaidItem.findFirst({ where: { projectId, number, deletedAt: null }, select: SELECT });
  if (!r || (r.type !== 'QUESTION' && !isLegacyQa(r))) throw new NotFoundError('Question not found');
  return r;
}

export async function getQuestion(userId: number, projectId: number, number: number) {
  await qaCtx(userId, projectId);
  return present(await findRow(projectId, number));
}

const asDate = (d: string | null | undefined) => (d ? new Date(`${d}T00:00:00Z`) : null);

export async function createQuestion(userId: number, projectId: number, input: QuestionInput) {
  await qaCtx(userId, projectId, 'edit');
  if (input.ownerId) {
    const a = await requireProject(input.ownerId, projectId, 'project.view').catch(() => null);
    if (!a || !governanceAccess(a.role, a.workspaceRole).view) throw new BadRequestError('The owner must be a member of the project team', 'WORK_BAD_USER');
  }
  const me = await prisma.user.findUnique({ where: { id: userId }, select: { username: true, fullName: true, displayName: true } });
  const status = input.status ?? (input.answer?.trim() ? 'ANSWERED' : 'OPEN');
  const row = await prisma.$transaction(async (tx) => {
    const number = await nextNumber(tx, 'raid', projectId);
    const r = await tx.workRaidItem.create({
      data: {
        projectId, number, type: 'QUESTION', title: input.question.trim().slice(0, 255), description: input.details?.trim() || null,
        ownerId: input.ownerId ?? userId, status, reviewDate: asDate(input.due), createdById: userId, closedAt: status === 'OPEN' ? null : new Date(),
      },
      select: { id: true, number: true },
    });
    await tx.workRaidQuestion.create({
      data: {
        raidId: r.id, askedOn: asDate(input.askedOn) ?? new Date(`${vnDay()}T00:00:00Z`), askedBy: (input.askedBy?.trim() || (me ? displayName(me) : null))?.slice(0, 120) ?? null,
        askedTo: input.askedTo?.trim().slice(0, 120) || null, priority: input.priority ?? 'MEDIUM',
        answer: input.answer?.trim() || null, answeredAt: input.answer?.trim() ? new Date() : null, answeredById: input.answer?.trim() ? userId : null,
      },
    });
    await tx.workRaidHistory.create({ data: { raidId: r.id, actorId: userId, field: 'created', toValue: `QUESTION · ${status}` } });
    return r;
  });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'raid', number: row.number, action: 'created', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'raid.create', targetType: 'raid', targetId: row.id, summary: `Asked Q-${row.number}: ${input.question}`.slice(0, 300) });
  return getQuestion(userId, projectId, row.number);
}

/** Sửa câu hỏi. Giảng viên (không có quyền sửa) chỉ được trả lời + đổi trạng thái. Có câu trả lời mới mà không nói trạng thái ⇒ ANSWERED. */
export async function updateQuestion(userId: number, projectId: number, number: number, input: Partial<QuestionInput> & { version?: number }) {
  const ctx = await qaCtx(userId, projectId, 'answer');
  const cur = await findRow(projectId, number);
  const onlyAnswer = Object.keys(input).every((k) => ['answer', 'status', 'version'].includes(k));
  if (!ctx.canEdit && !onlyAnswer) throw new ForbiddenError('You can answer this question but not change it');
  if (cur.type !== 'QUESTION') throw new BadRequestError('This is an older Q&A entry in the RAID log — convert it to a question first', 'WORK_QA_LEGACY');
  let status = input.status ?? cur.status;
  const answer = input.answer !== undefined ? (input.answer?.trim() || null) : undefined;
  if (answer && input.status === undefined && cur.status === 'OPEN') status = 'ANSWERED';
  if (!(QUESTION_STATUSES as readonly string[]).includes(status)) throw new BadRequestError(`Status ${status} is not valid for a question`, 'VALIDATION_ERROR');
  const closed = (s: string) => s !== 'OPEN';
  const raidData: Prisma.WorkRaidItemUncheckedUpdateManyInput = {
    ...(input.question !== undefined ? { title: input.question.trim().slice(0, 255) } : {}),
    ...(input.details !== undefined ? { description: input.details?.trim() || null } : {}),
    ...(input.due !== undefined ? { reviewDate: asDate(input.due), reviewNotifiedFor: null } : {}),
    ...(input.ownerId !== undefined ? { ownerId: input.ownerId } : {}),
    status,
    ...(closed(status) && !closed(cur.status) ? { closedAt: new Date() } : !closed(status) && closed(cur.status) ? { closedAt: null } : {}),
  };
  const qData: { askedOn?: Date; askedBy?: string | null; askedTo?: string | null; priority?: string; answer?: string | null; answeredAt?: Date | null; answeredById?: number | null } = {
    ...(input.askedOn !== undefined ? { askedOn: asDate(input.askedOn)! } : {}),
    ...(input.askedBy !== undefined ? { askedBy: input.askedBy?.trim().slice(0, 120) || null } : {}),
    ...(input.askedTo !== undefined ? { askedTo: input.askedTo?.trim().slice(0, 120) || null } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(answer !== undefined ? { answer, answeredAt: answer ? new Date() : null, answeredById: answer ? userId : null } : {}),
  };
  const changes: Array<{ field: string; fromValue: string | null; toValue: string | null }> = [];
  if (status !== cur.status) changes.push({ field: 'status', fromValue: cur.status, toValue: status });
  if (answer !== undefined && answer !== (cur.question?.answer ?? null)) changes.push({ field: 'answer', fromValue: cur.question?.answer?.slice(0, 2000) ?? null, toValue: answer?.slice(0, 2000) ?? null });
  if (input.question !== undefined && input.question.trim() !== cur.title) changes.push({ field: 'title', fromValue: cur.title, toValue: input.question.trim() });
  await prisma.$transaction(async (tx) => {
    const r = await tx.workRaidItem.updateMany({ where: { id: cur.id, ...(input.version !== undefined ? { version: input.version } : {}) }, data: { ...raidData, version: { increment: 1 } } });
    if (!r.count) throw new ConflictError('Someone else changed this question — reload to see their version');
    await tx.workRaidQuestion.upsert({
      where: { raidId: cur.id },
      create: { askedOn: cur.createdAt, priority: 'MEDIUM', ...qData, raidId: cur.id },
      update: qData,
    });
    if (changes.length) await tx.workRaidHistory.createMany({ data: changes.map((c) => ({ raidId: cur.id, actorId: userId, ...c })) });
  });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'raid', number, action: 'updated', actor: { kind: 'USER', userId } });
  return getQuestion(userId, projectId, number);
}

/** Dòng RAID cũ nhóm "Q&A" ⇒ câu hỏi thật (giữ số, mô tả cũ thành câu trả lời nếu dòng đã đóng). */
export async function convertLegacy(userId: number, projectId: number, number: number) {
  await qaCtx(userId, projectId, 'edit');
  const cur = await findRow(projectId, number);
  if (cur.type === 'QUESTION') return present(cur);
  const status = qaStatusText(cur.status) === 'Closed' ? 'ANSWERED' : qaStatusText(cur.status) === 'Cancelled' ? 'CANCELLED' : 'OPEN';
  await prisma.$transaction([
    prisma.workRaidItem.update({ where: { id: cur.id }, data: { type: 'QUESTION', status, version: { increment: 1 } } }),
    prisma.workRaidQuestion.upsert({
      where: { raidId: cur.id },
      create: { raidId: cur.id, askedOn: cur.createdAt, askedBy: cur.createdBy ? displayName(cur.createdBy) : null, askedTo: cur.owner ? displayName(cur.owner) : null, priority: 'MEDIUM', answer: status === 'ANSWERED' ? cur.description : null },
      update: {},
    }),
    prisma.workRaidHistory.create({ data: { raidId: cur.id, actorId: userId, field: 'type', fromValue: cur.type, toValue: 'QUESTION' } }),
  ]);
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'raid', number, action: 'updated', actor: { kind: 'USER', userId } });
  return getQuestion(userId, projectId, number);
}

export async function deleteQuestion(userId: number, projectId: number, number: number) {
  const ctx = await qaCtx(userId, projectId, 'edit');
  const cur = await findRow(projectId, number);
  if (!canDeleteGovernance(ctx.access.role, ctx.access.workspaceRole, userId, cur.createdById)) throw new ForbiddenError('Only the author or a project admin can delete this question');
  await prisma.workRaidItem.update({ where: { id: cur.id }, data: { deletedAt: new Date() } });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'raid', number, action: 'deleted', actor: { kind: 'USER', userId } });
  return { deleted: true };
}
