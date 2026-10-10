/**
 * CT Work — CTW đợt 9b (13/10/2026): LỚP HỌC — BÀI TẬP (Classwork) + NỘP BÀI + TRẢ BÀI.
 *
 * Giảng viên (OWNER/TEACHER của lớp) giao bài: cá nhân hoặc nhóm (nhóm lớp sẵn có ⇒ MỘT bài nộp chung, điểm chỉnh được
 * từng người), mô tả giàu định dạng (TipTap JSON), tệp đính kèm, hạn, điểm tối đa, rubric (rubric của giảng viên —
 * dùng lại `normalizeCriteria/validateScores/weightedTotal` của đợt 5), loại + chủ đề/tuần (trọng số sổ điểm), giao cả lớp
 * hoặc một số nhóm/SV, lên lịch giao, nộp muộn (cho phép / khoá, mức trừ %/ngày có trần).
 *
 * Sinh viên nộp tệp / link / văn bản; nộp lại có lịch sử phiên bản; huỷ nộp; "muộn" tự đánh dấu. Tệp: ≤ 25 MB,
 * chặn đuôi nguy hiểm, chữ ký đầu tệp khớp đuôi (`checkClassFile`). Tệp đi QUA backend (app desktop chặn PUT thẳng R2).
 *
 * Chấm & trả: danh sách Đã nộp / Chưa nộp / Muộn / Đã trả; chấm theo rubric hoặc điểm số; nhận xét riêng tư hai chiều;
 * trả theo lô ⇒ chuông. ĐIỂM NHÁP chỉ giảng viên thấy — sinh viên chỉ nhận bản đã trả (`studentGrade`).
 *
 * Nhắc hạn: cron (cron.service.ts) gọi `runDueReminders` — bài sắp tới hạn trong 24 giờ, chưa nhắc ⇒ GIÀNH cờ
 * `reminded_at` bằng updateMany có điều kiện (hai tiến trình chạy cùng lúc chỉ một bên thắng) ⇒ chuông cho người chưa nộp.
 * Lên lịch giao: `runScheduledAnnouncements` giành `announced_at` ⇒ đăng bảng tin (9a) + chuông, đúng một lần.
 *
 * Quyền: người ngoài lớp ⇒ 404; sinh viên ⇒ chỉ bài được giao + bài nộp CỦA MÌNH (bài nhóm: của nhóm mình);
 * agent ⇒ 403 ở MỌI lệnh (đọc lẫn ghi). Sổ điểm: `classGradebook.service.ts` (nguồn bài tập đăng ký ở cuối tệp này).
 */

import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { deleteObject, getSignedDownloadUrl, putObject } from '../../config/r2.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { displayName, PUBLIC_USER } from './common.js';
import { notifyWork } from './notify.js';
import { assertWritable, classCtx, postStreamItem, removeStreamItem, type ClassCtx } from './classStream.service.js';
import { normalizeCriteria, RubricError, validateScores, weightedTotal, type RubricCriterion } from './teachingRules.js';
import { tiptapToText } from './tiptapText.js';
import {
  ASSIGNMENT_KINDS, LinkError, MAX_FILES_PER_ASSIGNMENT, MAX_FILES_PER_SUBMISSION, MAX_TEXT, assignedSeats, canTurnIn, checkClassFile,
  finalPointsFor, lateInfo, latePenaltyPct, normalizeLinks, ownerKeyOf, rubricToPoints, studentGrade, workState, type AssignmentKind, type Seat,
} from './classworkRules.js';
import { registerGradebookSource, type GradebookCell, type GradebookCtx, type GradebookItem } from './classGradebookSources.js';

const HOUR = 3_600_000;

// ─── Kho tệp (thay được trong test; mặc định R2 — sandbox tự bật khi test / STORAGE_SANDBOX=1) ─────

export interface ClassFileStore {
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  del(key: string): Promise<void>;
  url(key: string, fileName: string): Promise<string>;
}
const r2Store: ClassFileStore = {
  async put(key, body, ct) { await putObject(key, body, ct, 'private, max-age=0, no-store'); },
  del: (key) => deleteObject(key),
  url: (key, fileName) => getSignedDownloadUrl(key, 300, fileName),
};
let store: ClassFileStore = r2Store;
export function _setClassFileStoreForTests(s: ClassFileStore | null) { store = s ?? r2Store; }

// ─── Ngữ cảnh lớp + quyền: DÙNG CHUNG với 9a (classStream.service.ts — agent ⇒ 403 mọi lệnh, người ngoài ⇒ 404) ─────

export { classCtx };
export type { ClassCtx };

async function seatsOf(classId: number): Promise<Array<Seat & { studentCode: string | null; fullName: string | null; email: string | null }>> {
  return prisma.workClassStudent.findMany({ where: { classId }, orderBy: [{ studentCode: 'asc' }, { id: 'asc' }], select: { id: true, userId: true, groupId: true, studentCode: true, fullName: true, email: true } });
}

// ─── Bài tập: đọc ─────────────────────────────────────────────────

const ASSIGNMENT_SELECT = {
  id: true, classId: true, authorId: true, title: true, description: true, descriptionText: true, kind: true, category: true, topic: true,
  maxPoints: true, rubricId: true, dueAt: true, publishAt: true, announcedAt: true, allowLate: true, latePenaltyPct: true, latePenaltyMaxPct: true,
  targetAll: true, targetGroupIds: true, targetStudentIds: true, createdAt: true, updatedAt: true,
} as const;
type AssignmentRow = Prisma.WorkClassAssignmentGetPayload<{ select: typeof ASSIGNMENT_SELECT }>;

const FILE_SELECT = { id: true, fileName: true, mime: true, size: true, uploaderId: true, createdAt: true } as const;

export type PublishState = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
const publishState = (a: { publishAt: Date | null }, now: Date): PublishState => (!a.publishAt ? 'DRAFT' : a.publishAt.getTime() > now.getTime() ? 'SCHEDULED' : 'PUBLISHED');
const isVisible = (a: { publishAt: Date | null; deletedAt?: Date | null }, now: Date) => !a.deletedAt && !!a.publishAt && a.publishAt.getTime() <= now.getTime();

/** Sinh viên có được giao bài này không (bài nhóm: phải đã có nhóm được giao). */
function isAssignedTo(a: Pick<AssignmentRow, 'kind' | 'targetAll' | 'targetGroupIds' | 'targetStudentIds'>, seat: { id: number; groupId: number | null } | null, userId: number): boolean {
  if (!seat) return false;
  return assignedSeats(a, [{ id: seat.id, userId, groupId: seat.groupId }]).length > 0;
}

async function rubricOf(rubricId: number | null) {
  if (!rubricId) return null;
  const r = await prisma.workRubric.findUnique({ where: { id: rubricId }, select: { id: true, name: true, criteria: true, scaleMax: true } });
  return r ? { ...r, criteria: (Array.isArray(r.criteria) ? r.criteria : []) as unknown as RubricCriterion[] } : null;
}

/** Danh sách bài của lớp. Giảng viên: mọi bài (kể cả nháp / đã lên lịch) + số liệu. Sinh viên: bài đã giao cho mình + trạng thái của mình. */
export async function listAssignments(userId: number, classId: number) {
  const c = await classCtx(userId, classId);
  const now = new Date();
  const rows = await prisma.workClassAssignment.findMany({
    where: { classId, deletedAt: null, ...(c.manage ? {} : { publishAt: { lte: now } }) },
    orderBy: [{ topic: { sort: 'asc', nulls: 'first' } }, { dueAt: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }],
    select: { ...ASSIGNMENT_SELECT, _count: { select: { files: true } } },
  });
  if (c.manage) {
    const seats = await seatsOf(classId);
    const subs = await prisma.workClassSubmission.findMany({ where: { assignmentId: { in: rows.map((r) => r.id) } }, select: { assignmentId: true, ownerKey: true, status: true, late: true, points: true, returnedAt: true } });
    return {
      manage: true as const,
      assignments: rows.map((a) => {
        const owners = ownersOf(a, seats);
        const mine = subs.filter((s) => s.assignmentId === a.id && owners.keys.has(s.ownerKey));
        const st = (k: string) => mine.find((s) => s.ownerKey === k) ?? null;
        const states = [...owners.keys].map((k) => workState(st(k), a.dueAt, now));
        return {
          ...strip(a), state: publishState(a, now), files: a._count.files,
          counts: {
            assigned: owners.keys.size,
            turnedIn: states.filter((s) => s === 'TURNED_IN' || s === 'LATE').length,
            late: states.filter((s) => s === 'LATE').length,
            missing: states.filter((s) => s === 'MISSING').length,
            returned: states.filter((s) => s === 'RETURNED').length,
            graded: mine.filter((s) => s.points !== null).length,
          },
        };
      }),
    };
  }
  const mine = rows.filter((a) => isAssignedTo(a, c.seat, userId));
  const keys = mine.map((a) => ownerKeyOf(a.kind, userId, c.seat?.groupId ?? null)).filter(Boolean) as string[];
  const subs = await prisma.workClassSubmission.findMany({ where: { assignmentId: { in: mine.map((a) => a.id) }, ownerKey: { in: keys } } });
  return {
    manage: false as const,
    assignments: mine.map((a) => {
      const s = subs.find((x) => x.assignmentId === a.id && x.ownerKey === ownerKeyOf(a.kind, userId, c.seat?.groupId ?? null)) ?? null;
      return { ...strip(a), state: 'PUBLISHED' as const, files: a._count.files, my: { state: workState(s, a.dueAt, now), late: s?.late ?? false, submittedAt: s?.submittedAt ?? null, grade: s ? studentGrade(s, userId) : null } };
    }),
  };
}

/** Bỏ trường nội bộ trước khi trả về. */
function strip<T extends AssignmentRow & { _count?: unknown }>(a: T) {
  const { _count: _c, ...rest } = a as T & { _count?: unknown };
  return rest;
}

/** Chủ bài nộp được giao: cá nhân ⇒ 'U<id>' mỗi sinh viên; nhóm ⇒ 'G<id>' mỗi nhóm có người được giao. */
function ownersOf<S extends Seat>(a: Pick<AssignmentRow, 'kind' | 'targetAll' | 'targetGroupIds' | 'targetStudentIds'>, seats: S[]) {
  const assigned = assignedSeats(a, seats);
  const keys = new Set<string>();
  for (const s of assigned) { const k = ownerKeyOf(a.kind, s.userId!, s.groupId); if (k) keys.add(k); }
  return { keys, seats: assigned };
}

async function loadAssignment(c: ClassCtx, aid: number, now = new Date()) {
  const a = await prisma.workClassAssignment.findFirst({ where: { id: aid, classId: c.classId, deletedAt: null }, select: ASSIGNMENT_SELECT });
  if (!a) throw new NotFoundError('Assignment not found');
  if (!c.manage && (!isVisible(a, now) || !isAssignedTo(a, c.seat, -1 /* chỉ dùng seat */))) throw new NotFoundError('Assignment not found');
  return a;
}

export async function getAssignment(userId: number, classId: number, aid: number) {
  const c = await classCtx(userId, classId);
  const now = new Date();
  const a = await loadAssignment(c, aid, now);
  const [files, rubric, author] = await Promise.all([
    prisma.workClassFile.findMany({ where: { assignmentId: a.id, submissionId: null }, orderBy: { id: 'asc' }, select: FILE_SELECT }),
    rubricOf(a.rubricId),
    a.authorId ? prisma.user.findUnique({ where: { id: a.authorId }, select: PUBLIC_USER }) : null,
  ]);
  const base = { ...a, state: publishState(a, now), files, rubric, author };
  if (c.manage) {
    const groups = await prisma.workClassGroup.findMany({ where: { classId }, orderBy: { number: 'asc' }, select: { id: true, number: true, name: true } });
    const students = await prisma.workClassStudent.findMany({ where: { classId }, select: { id: true, fullName: true, studentCode: true, groupId: true, userId: true } });
    return { ...base, manage: true as const, groups, students };
  }
  return { ...base, manage: false as const, submission: await mySubmissionView(c, a, userId, now) };
}

// ─── Bài tập: ghi (giảng viên) ───────────────────────────────────

export interface AssignmentInput {
  title?: string;
  description?: unknown;
  kind?: AssignmentKind;
  category?: string;
  topic?: string | null;
  maxPoints?: number;
  rubricId?: number | null;
  dueAt?: string | null;
  /** NOW = giao ngay · SCHEDULE = lên lịch (publishAt) · DRAFT = lưu nháp. Không gửi ⇒ giữ nguyên. */
  publish?: 'NOW' | 'SCHEDULE' | 'DRAFT';
  publishAt?: string | null;
  allowLate?: boolean;
  latePenaltyPct?: number;
  latePenaltyMaxPct?: number;
  targetAll?: boolean;
  targetGroupIds?: number[];
  targetStudentIds?: number[];
}

function parseDate(s: string | null | undefined, field: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) throw new BadRequestError(`${field}: not a valid date`, 'WORK_CLASSWORK_BAD');
  return d;
}

async function checkRubric(userId: number, rubricId: number | null | undefined, current: number | null) {
  if (!rubricId || rubricId === current) return;
  const r = await prisma.workRubric.findFirst({ where: { id: rubricId, ownerId: userId, archivedAt: null }, select: { criteria: true, scaleMax: true } });
  if (!r) throw new BadRequestError('Pick one of your rubrics (Lecturer hub → Rubrics)', 'WORK_CLASSWORK_BAD');
  try { normalizeCriteria(r.criteria, r.scaleMax); } catch (e) { if (e instanceof RubricError) throw new BadRequestError(e.message, 'WORK_RUBRIC_BAD'); throw e; }
}

async function checkTargets(classId: number, groupIds: number[], studentIds: number[]) {
  if (groupIds.length && (await prisma.workClassGroup.count({ where: { classId, id: { in: groupIds } } })) !== new Set(groupIds).size) throw new BadRequestError('A selected group is not in this class', 'WORK_CLASSWORK_BAD');
  if (studentIds.length && (await prisma.workClassStudent.count({ where: { classId, id: { in: studentIds } } })) !== new Set(studentIds).size) throw new BadRequestError('A selected student is not in this class', 'WORK_CLASSWORK_BAD');
}

function buildData(input: AssignmentInput, cur: AssignmentRow | null, now: Date) {
  const data: Prisma.WorkClassAssignmentUncheckedUpdateInput = {};
  if (input.title !== undefined) {
    const t = input.title.trim();
    if (!t) throw new BadRequestError('Give the assignment a title', 'WORK_CLASSWORK_BAD');
    data.title = t.slice(0, 200);
  } else if (!cur) throw new BadRequestError('Give the assignment a title', 'WORK_CLASSWORK_BAD');
  if (input.description !== undefined) {
    const doc = input.description && typeof input.description === 'object' ? input.description : null;
    const json = doc ? JSON.stringify(doc) : '';
    if (json.length > 400_000) throw new BadRequestError('The description is too long', 'WORK_CLASSWORK_BAD');
    data.description = doc ? (doc as Prisma.InputJsonValue) : Prisma.DbNull;
    data.descriptionText = doc ? tiptapToText(doc).slice(0, 20_000) || null : null;
  }
  if (input.kind !== undefined) {
    if (!ASSIGNMENT_KINDS.includes(input.kind)) throw new BadRequestError('Unknown assignment type', 'WORK_CLASSWORK_BAD');
    data.kind = input.kind;
  }
  if (input.category !== undefined) data.category = input.category.trim().slice(0, 40) || 'Assignment';
  if (input.topic !== undefined) data.topic = input.topic?.trim().slice(0, 80) || null;
  if (input.maxPoints !== undefined) {
    if (!(input.maxPoints > 0 && input.maxPoints <= 1000)) throw new BadRequestError('Points must be between 1 and 1000', 'WORK_CLASSWORK_BAD');
    data.maxPoints = Math.round(input.maxPoints * 100) / 100;
  }
  if (input.rubricId !== undefined) data.rubricId = input.rubricId;
  if (input.dueAt !== undefined) data.dueAt = parseDate(input.dueAt, 'Due');
  if (input.allowLate !== undefined) data.allowLate = input.allowLate;
  if (input.latePenaltyPct !== undefined) data.latePenaltyPct = Math.min(Math.max(input.latePenaltyPct, 0), 100);
  if (input.latePenaltyMaxPct !== undefined) data.latePenaltyMaxPct = Math.min(Math.max(input.latePenaltyMaxPct, 0), 100);
  if (input.targetAll !== undefined) data.targetAll = input.targetAll;
  if (input.targetGroupIds !== undefined) data.targetGroupIds = [...new Set(input.targetGroupIds)].slice(0, 200);
  if (input.targetStudentIds !== undefined) data.targetStudentIds = [...new Set(input.targetStudentIds)].slice(0, 500);
  if (input.publish === 'NOW') data.publishAt = cur?.publishAt && cur.publishAt.getTime() <= now.getTime() ? cur.publishAt : now;
  else if (input.publish === 'DRAFT') {
    if (cur && cur.publishAt && cur.publishAt.getTime() <= now.getTime()) throw new ConflictError('This assignment is already assigned — it cannot go back to draft');
    data.publishAt = null;
  } else if (input.publish === 'SCHEDULE') {
    const at = parseDate(input.publishAt, 'Schedule');
    if (!at || at.getTime() <= now.getTime()) throw new BadRequestError('Pick a schedule time in the future', 'WORK_CLASSWORK_BAD');
    if (cur && cur.publishAt && cur.publishAt.getTime() <= now.getTime()) throw new ConflictError('This assignment is already assigned');
    data.publishAt = at;
  }
  return data;
}

function validateMerged(m: { targetAll: boolean; targetGroupIds: number[]; targetStudentIds: number[]; kind: string; dueAt: Date | null; publishAt: Date | null }) {
  if (!m.targetAll && !m.targetGroupIds.length && !m.targetStudentIds.length) throw new BadRequestError('Assign it to the whole class or pick groups / students', 'WORK_CLASSWORK_BAD');
  if (m.kind === 'GROUP' && !m.targetAll && !m.targetGroupIds.length) throw new BadRequestError('A group assignment needs the whole class or some groups', 'WORK_CLASSWORK_BAD');
  if (m.dueAt && m.publishAt && m.dueAt.getTime() <= m.publishAt.getTime()) throw new BadRequestError('The due date must be after the time it is assigned', 'WORK_CLASSWORK_BAD');
}

export async function createAssignment(userId: number, classId: number, input: AssignmentInput) {
  assertWritable(await classCtx(userId, classId, true));
  const now = new Date();
  if ((await prisma.workClassAssignment.count({ where: { classId, deletedAt: null } })) >= 500) throw new BadRequestError('A class can have at most 500 assignments', 'WORK_LIMIT');
  await checkRubric(userId, input.rubricId, null);
  await checkTargets(classId, input.targetGroupIds ?? [], input.targetStudentIds ?? []);
  const data = buildData({ publish: 'DRAFT', ...input }, null, now);
  validateMerged({
    targetAll: (data.targetAll as boolean | undefined) ?? true, targetGroupIds: (data.targetGroupIds as number[] | undefined) ?? [], targetStudentIds: (data.targetStudentIds as number[] | undefined) ?? [],
    kind: (data.kind as string | undefined) ?? 'INDIVIDUAL', dueAt: (data.dueAt as Date | null | undefined) ?? null, publishAt: (data.publishAt as Date | null | undefined) ?? null,
  });
  const a = await prisma.workClassAssignment.create({ data: { ...(data as Prisma.WorkClassAssignmentUncheckedCreateInput), classId, authorId: userId, title: data.title as string }, select: ASSIGNMENT_SELECT });
  await syncStream(a, userId);
  if (isVisible(a, now)) await announce(a.id, userId);
  return getAssignment(userId, classId, a.id);
}

export async function updateAssignment(userId: number, classId: number, aid: number, input: AssignmentInput) {
  assertWritable(await classCtx(userId, classId, true));
  const now = new Date();
  const cur = await prisma.workClassAssignment.findFirst({ where: { id: aid, classId, deletedAt: null }, select: ASSIGNMENT_SELECT });
  if (!cur) throw new NotFoundError('Assignment not found');
  await checkRubric(userId, input.rubricId, cur.rubricId);
  if (input.kind !== undefined && input.kind !== cur.kind && (await prisma.workClassSubmission.count({ where: { assignmentId: aid, OR: [{ version: { gt: 0 } }, { points: { not: null } }] } }))) {
    throw new ConflictError('Students have already turned in work — the assignment type cannot change');
  }
  if (input.rubricId !== undefined && input.rubricId !== cur.rubricId && (await prisma.workClassSubmission.count({ where: { assignmentId: aid, points: { not: null } } }))) {
    throw new ConflictError('Some work is already graded — the rubric cannot change');
  }
  await checkTargets(classId, input.targetGroupIds ?? [], input.targetStudentIds ?? []);
  const data = buildData(input, cur, now);
  validateMerged({
    targetAll: (data.targetAll as boolean | undefined) ?? cur.targetAll, targetGroupIds: (data.targetGroupIds as number[] | undefined) ?? cur.targetGroupIds,
    targetStudentIds: (data.targetStudentIds as number[] | undefined) ?? cur.targetStudentIds, kind: (data.kind as string | undefined) ?? cur.kind,
    dueAt: data.dueAt !== undefined ? (data.dueAt as Date | null) : cur.dueAt, publishAt: data.publishAt !== undefined ? (data.publishAt as Date | null) : cur.publishAt,
  });
  // Hạn đổi ⇒ được nhắc lại cho hạn mới (vẫn đúng một lần cho mỗi hạn).
  if (data.dueAt !== undefined && (data.dueAt as Date | null)?.getTime() !== cur.dueAt?.getTime()) data.remindedAt = null;
  const a = await prisma.workClassAssignment.update({ where: { id: aid }, data, select: ASSIGNMENT_SELECT });
  await syncStream(a, userId);
  if (isVisible(a, now) && !a.announcedAt) await announce(a.id, userId);
  return getAssignment(userId, classId, aid);
}

export async function deleteAssignment(userId: number, classId: number, aid: number) {
  assertWritable(await classCtx(userId, classId, true));
  const r = await prisma.workClassAssignment.updateMany({ where: { id: aid, classId, deletedAt: null }, data: { deletedAt: new Date() } });
  if (!r.count) throw new NotFoundError('Assignment not found');
  await removeStreamItem(classId, 'ASSIGNMENT', aid).catch(() => undefined);
}

// ─── Đăng bảng tin + chuông (đúng một lần) ───────────────────────

const classUrl = (classId: number, aid: number, extra = '') => `/work/classes?id=${classId}&tab=classwork&a=${aid}${extra}`;

/**
 * Dòng bảng tin của 9a (`postStreamItem` — upsert theo (lớp, 'ASSIGNMENT', id), tự đăng đúng giờ giao). notify:false vì
 * chuông của bài tập do 9b tự gửi đúng NGƯỜI ĐƯỢC GIAO (announce). Bài giao riêng vài SV ⇒ KHÔNG lên bảng tin chung
 * (tên bài không lộ cho người không được giao). Nháp / bị xoá ⇒ gỡ dòng.
 */
async function syncStream(a: { id: number; classId: number; title: string; kind: string; publishAt: Date | null; targetAll: boolean; targetGroupIds: number[]; targetStudentIds: number[]; deletedAt?: Date | null }, actorId: number | null) {
  try {
    const personal = !a.targetAll && a.targetStudentIds.length > 0;
    if (!a.publishAt || a.deletedAt || personal) { await removeStreamItem(a.classId, 'ASSIGNMENT', a.id); return; }
    await postStreamItem({
      classId: a.classId, kind: 'ASSIGNMENT', refType: 'ASSIGNMENT', refId: a.id, title: a.title, url: classUrl(a.classId, a.id), actorId,
      audienceGroupIds: a.targetAll ? [] : a.targetGroupIds, publishAt: a.publishAt, notify: false,
    });
  } catch (err) {
    logger.warn('[work] classwork: bảng tin lỗi', { assignmentId: a.id, err: (err as Error).message });
  }
}

/** Giành `announced_at` ⇒ bảng tin + chuông cho người được giao. Trả true nếu lượt này thắng. */
export async function announce(aid: number, actorId: number): Promise<boolean> {
  const now = new Date();
  const won = await prisma.workClassAssignment.updateMany({ where: { id: aid, announcedAt: null, deletedAt: null, publishAt: { lte: now } }, data: { announcedAt: now } });
  if (!won.count) return false;
  const a = await prisma.workClassAssignment.findUniqueOrThrow({ where: { id: aid }, select: { ...ASSIGNMENT_SELECT, class: { select: { classCode: true, name: true, ownerId: true, teacherId: true } } } });
  const sender = a.authorId ?? a.class.teacherId ?? a.class.ownerId;
  void actorId;
  const seats = assignedSeats(a, await seatsOf(a.classId));
  for (const s of seats) {
    await notifyWork({
      receiverId: s.userId!, senderId: sender, type: 'WORK_ALERT', entityId: a.classId,
      payload: { issueKey: a.class.classCode, title: a.title, message: `New assignment: ${a.title}${a.dueAt ? ` — due ${a.dueAt.toISOString().slice(0, 16).replace('T', ' ')} UTC` : ''}`, url: classUrl(a.classId, a.id) },
    }).catch(() => undefined);
  }
  return true;
}

/** Cron: bài đã tới giờ lên lịch mà chưa đăng ⇒ đăng (mỗi bài đúng một lần). */
export async function runScheduledAnnouncements(now = new Date()): Promise<number> {
  const due = await prisma.workClassAssignment.findMany({ where: { deletedAt: null, announcedAt: null, publishAt: { lte: now } }, select: { id: true, authorId: true }, take: 200 });
  let n = 0;
  for (const a of due) if (await announce(a.id, a.authorId ?? 0).catch(() => false)) n += 1;
  return n;
}

/**
 * Cron: nhắc hạn 24 giờ. Bài đã giao, chưa nhắc, hạn nằm trong (now, now + 24h] ⇒ GIÀNH `reminded_at` (updateMany có
 * điều kiện `reminded_at IS NULL` — chạy song song chỉ một bên thắng) ⇒ chuông cho người được giao CHƯA nộp.
 * Trả số người đã nhắc.
 */
export async function runDueReminders(now = new Date()): Promise<number> {
  const list = await prisma.workClassAssignment.findMany({
    where: { deletedAt: null, remindedAt: null, publishAt: { lte: now }, dueAt: { gt: now, lte: new Date(now.getTime() + 24 * HOUR) } },
    select: { id: true }, take: 500,
  });
  let sent = 0;
  for (const { id } of list) {
    const won = await prisma.workClassAssignment.updateMany({ where: { id, remindedAt: null }, data: { remindedAt: now } });
    if (!won.count) continue;
    try {
      const a = await prisma.workClassAssignment.findUniqueOrThrow({ where: { id }, select: { ...ASSIGNMENT_SELECT, class: { select: { classCode: true, ownerId: true, teacherId: true } } } });
      const seats = assignedSeats(a, await seatsOf(a.classId));
      const done = new Set((await prisma.workClassSubmission.findMany({ where: { assignmentId: id, status: { in: ['TURNED_IN', 'RETURNED'] } }, select: { ownerKey: true } })).map((s) => s.ownerKey));
      const sender = a.authorId ?? a.class.teacherId ?? a.class.ownerId;
      for (const s of seats) {
        const k = ownerKeyOf(a.kind, s.userId!, s.groupId);
        if (!k || done.has(k)) continue;
        await notifyWork({
          receiverId: s.userId!, senderId: sender, type: 'WORK_ALERT', entityId: a.classId,
          payload: { issueKey: a.class.classCode, title: a.title, message: `Due in less than 24 hours: ${a.title}`, url: classUrl(a.classId, a.id), reminder: true },
        }).catch(() => undefined);
        sent += 1;
      }
    } catch (err) {
      logger.warn('[work] classwork: nhắc hạn lỗi', { assignmentId: id, err: (err as Error).message });
    }
  }
  return sent;
}

// ─── Tệp ─────────────────────────────────────────────────────────

const fileKey = (classId: number, scope: string, fileName: string) => `work/class/${classId}/${scope}/${crypto.randomUUID()}/${fileName.replace(/[^\w.\- ]+/g, '_').slice(-120) || 'file'}`;

function checked(input: { buffer: Buffer; fileName: string }) {
  const r = checkClassFile(input.fileName, input.buffer);
  if (!r.ok) throw new AppError(r.message, r.code === 'FILE_TOO_BIG' ? 413 : 400, `WORK_CLASS_${r.code}`);
  return r;
}

export async function uploadAssignmentFile(userId: number, classId: number, aid: number, input: { buffer: Buffer; fileName: string }) {
  const c = await classCtx(userId, classId, true);
  assertWritable(c);
  const a = await loadAssignment(c, aid);
  const f = checked(input);
  if ((await prisma.workClassFile.count({ where: { assignmentId: a.id, submissionId: null } })) >= MAX_FILES_PER_ASSIGNMENT) throw new BadRequestError(`At most ${MAX_FILES_PER_ASSIGNMENT} files per assignment`, 'WORK_LIMIT');
  const key = fileKey(classId, `a${a.id}`, f.fileName);
  await store.put(key, input.buffer, f.mime);
  return prisma.workClassFile.create({ data: { classId, assignmentId: a.id, uploaderId: userId, r2Key: key, fileName: f.fileName, mime: f.mime, size: input.buffer.length }, select: FILE_SELECT });
}

export async function removeAssignmentFile(userId: number, classId: number, aid: number, fid: number) {
  await classCtx(userId, classId, true);
  const f = await prisma.workClassFile.findFirst({ where: { id: fid, classId, assignmentId: aid, submissionId: null } });
  if (!f) throw new NotFoundError('File not found');
  await prisma.workClassFile.delete({ where: { id: f.id } });
  await store.del(f.r2Key).catch(() => undefined);
}

/** Link tải (ký sẵn 5 phút) — sau khi kiểm quyền: tệp đề ⇒ ai thấy bài; tệp nộp ⇒ giảng viên hoặc CHỦ bài nộp. */
export async function fileUrl(userId: number, classId: number, fid: number) {
  const c = await classCtx(userId, classId);
  const f = await prisma.workClassFile.findFirst({ where: { id: fid, classId }, select: { id: true, r2Key: true, fileName: true, assignmentId: true, submissionId: true } });
  if (!f) throw new NotFoundError('File not found');
  if (!c.manage) {
    if (f.submissionId) {
      const s = await prisma.workClassSubmission.findUnique({ where: { id: f.submissionId }, select: { userId: true, groupId: true } });
      if (!s || !ownsSubmission(c, s, userId)) throw new NotFoundError('File not found');
    } else if (f.assignmentId) await loadAssignment(c, f.assignmentId);
  }
  return { url: await store.url(f.r2Key, f.fileName), fileName: f.fileName };
}

// ─── Bài nộp của sinh viên ───────────────────────────────────────

function ownsSubmission(c: ClassCtx, s: { userId: number | null; groupId: number | null }, userId: number): boolean {
  if (s.userId !== null) return s.userId === userId;
  return s.groupId !== null && c.seat?.groupId === s.groupId;
}

const SUB_SELECT = {
  id: true, assignmentId: true, ownerKey: true, userId: true, groupId: true, status: true, text: true, links: true, submittedAt: true, submittedById: true,
  late: true, version: true, points: true, scores: true, memberPoints: true, penaltyPct: true, gradedAt: true, graderId: true,
  returnedAt: true, returnedPoints: true, returnedScores: true, returnedMemberPoints: true, returnedPenaltyPct: true, returnCount: true, createdAt: true, updatedAt: true,
} as const;
type SubRow = Prisma.WorkClassSubmissionGetPayload<{ select: typeof SUB_SELECT }>;

/** Bài nộp của tôi cho một bài (tạo dòng trống nếu chưa có). Bài nhóm: chưa có nhóm ⇒ 409. */
async function ensureMySubmission(c: ClassCtx, a: AssignmentRow, userId: number): Promise<SubRow> {
  const key = ownerKeyOf(a.kind, userId, c.seat?.groupId ?? null);
  if (!key) throw new AppError('Join a group of this class first — this is a group assignment', 409, 'WORK_CLASSWORK_NO_GROUP');
  const found = await prisma.workClassSubmission.findUnique({ where: { assignmentId_ownerKey: { assignmentId: a.id, ownerKey: key } }, select: SUB_SELECT });
  if (found) return found;
  try {
    return await prisma.workClassSubmission.create({
      data: { assignmentId: a.id, ownerKey: key, userId: a.kind === 'GROUP' ? null : userId, groupId: a.kind === 'GROUP' ? c.seat!.groupId : null },
      select: SUB_SELECT,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return prisma.workClassSubmission.findUniqueOrThrow({ where: { assignmentId_ownerKey: { assignmentId: a.id, ownerKey: key } }, select: SUB_SELECT });
    }
    throw err;
  }
}

async function studentAssignment(userId: number, classId: number, aid: number) {
  const c = await classCtx(userId, classId);
  assertWritable(c);
  if (c.manage) throw new ForbiddenError('Lecturers do not turn in work — open the student list to grade');
  const a = await loadAssignment(c, aid);
  return { c, a };
}

async function peopleMap(ids: number[]) {
  const us = ids.length ? await prisma.user.findMany({ where: { id: { in: [...new Set(ids)] } }, select: PUBLIC_USER }) : [];
  return new Map(us.map((u) => [u.id, u]));
}

/** Góc nhìn sinh viên: nội dung bài nộp + tệp + lịch sử + nhận xét riêng + điểm ĐÃ TRẢ (không bao giờ điểm nháp). */
async function mySubmissionView(c: ClassCtx, a: AssignmentRow, userId: number, now: Date) {
  const key = ownerKeyOf(a.kind, userId, c.seat?.groupId ?? null);
  if (!key) return { needsGroup: true as const };
  const s = await prisma.workClassSubmission.findUnique({ where: { assignmentId_ownerKey: { assignmentId: a.id, ownerKey: key } }, select: SUB_SELECT });
  const latePreview = lateInfo(a.dueAt, now);
  const base = {
    needsGroup: false as const,
    canTurnIn: canTurnIn(a, now),
    lateIfNow: latePreview.late, penaltyIfNow: latePenaltyPct(a, latePreview.daysLate),
  };
  if (!s) return { ...base, id: null, state: workState(null, a.dueAt, now), status: 'ASSIGNED', text: null, links: [], files: [], versions: [], comments: [], grade: null, late: false, submittedAt: null, version: 0 };
  const [files, versions, comments] = await Promise.all([
    prisma.workClassFile.findMany({ where: { submissionId: s.id, detachedAt: null }, orderBy: { id: 'asc' }, select: FILE_SELECT }),
    prisma.workClassSubmissionVersion.findMany({ where: { submissionId: s.id }, orderBy: { id: 'desc' }, take: 50 }),
    prisma.workClassSubmissionComment.findMany({ where: { submissionId: s.id }, orderBy: { id: 'asc' }, take: 500 }),
  ]);
  const people = await peopleMap([...comments.map((x) => x.authorId), ...versions.map((v) => v.actorId)]);
  const versionFiles = await prisma.workClassFile.findMany({ where: { id: { in: versions.flatMap((v) => v.fileIds) } }, select: FILE_SELECT });
  return {
    ...base,
    id: s.id, state: workState(s, a.dueAt, now), status: s.status, text: s.text, links: s.links, files, late: s.late, submittedAt: s.submittedAt, version: s.version,
    versions: versions.map((v) => ({ ...v, actor: people.get(v.actorId) ?? null, files: versionFiles.filter((f) => v.fileIds.includes(f.id)) })),
    comments: comments.map((x) => ({ id: x.id, body: x.body, createdAt: x.createdAt, author: people.get(x.authorId) ?? null, mine: x.authorId === userId })),
    grade: studentGrade(s, userId),
  };
}

function assertEditable(s: SubRow) {
  if (s.status === 'TURNED_IN') throw new AppError('Unsubmit first to change your work', 409, 'WORK_CLASSWORK_TURNED_IN');
}

export async function saveDraft(userId: number, classId: number, aid: number, input: { text?: string | null; links?: unknown }) {
  const { c, a } = await studentAssignment(userId, classId, aid);
  const s = await ensureMySubmission(c, a, userId);
  assertEditable(s);
  const data: Prisma.WorkClassSubmissionUpdateInput = {};
  if (input.text !== undefined) data.text = input.text?.slice(0, MAX_TEXT) || null;
  if (input.links !== undefined) {
    try { data.links = normalizeLinks(input.links) as unknown as Prisma.InputJsonValue; } catch (e) { if (e instanceof LinkError) throw new BadRequestError(e.message, 'WORK_CLASSWORK_BAD_LINK'); throw e; }
  }
  await prisma.workClassSubmission.update({ where: { id: s.id }, data });
  return getAssignment(userId, classId, aid);
}

export async function uploadSubmissionFile(userId: number, classId: number, aid: number, input: { buffer: Buffer; fileName: string }) {
  const { c, a } = await studentAssignment(userId, classId, aid);
  const f = checked(input);
  const s = await ensureMySubmission(c, a, userId);
  assertEditable(s);
  if ((await prisma.workClassFile.count({ where: { submissionId: s.id, detachedAt: null } })) >= MAX_FILES_PER_SUBMISSION) throw new BadRequestError(`At most ${MAX_FILES_PER_SUBMISSION} files per submission`, 'WORK_LIMIT');
  const key = fileKey(classId, `s${s.id}`, f.fileName);
  await store.put(key, input.buffer, f.mime);
  return prisma.workClassFile.create({ data: { classId, assignmentId: a.id, submissionId: s.id, uploaderId: userId, r2Key: key, fileName: f.fileName, mime: f.mime, size: input.buffer.length }, select: FILE_SELECT });
}

export async function removeSubmissionFile(userId: number, classId: number, aid: number, fid: number) {
  const { c, a } = await studentAssignment(userId, classId, aid);
  const s = await ensureMySubmission(c, a, userId);
  assertEditable(s);
  const f = await prisma.workClassFile.findFirst({ where: { id: fid, submissionId: s.id, detachedAt: null } });
  if (!f) throw new NotFoundError('File not found');
  // Tệp đã nằm trong một lần nộp ⇒ chỉ gỡ khỏi bản nháp (lịch sử vẫn mở được); chưa ⇒ xoá hẳn.
  const inHistory = await prisma.workClassSubmissionVersion.count({ where: { submissionId: s.id, fileIds: { has: f.id } } });
  if (inHistory) await prisma.workClassFile.update({ where: { id: f.id }, data: { detachedAt: new Date() } });
  else { await prisma.workClassFile.delete({ where: { id: f.id } }); await store.del(f.r2Key).catch(() => undefined); }
}

export async function turnIn(userId: number, classId: number, aid: number) {
  const { c, a } = await studentAssignment(userId, classId, aid);
  const now = new Date();
  if (!canTurnIn(a, now)) throw new AppError('The due date has passed and late work is closed for this assignment', 409, 'WORK_CLASSWORK_LATE_LOCKED');
  const s = await ensureMySubmission(c, a, userId);
  if (s.status === 'TURNED_IN') throw new AppError('Already turned in', 409, 'WORK_CLASSWORK_TURNED_IN');
  const files = await prisma.workClassFile.findMany({ where: { submissionId: s.id, detachedAt: null }, select: { id: true } });
  const links = Array.isArray(s.links) ? s.links : [];
  if (!files.length && !links.length && !s.text?.trim()) throw new BadRequestError('Add a file, a link or some text before turning in', 'WORK_CLASSWORK_EMPTY');
  const { late, daysLate } = lateInfo(a.dueAt, now);
  const version = s.version + 1;
  await prisma.$transaction(async (tx) => {
    const r = await tx.workClassSubmission.updateMany({
      where: { id: s.id, status: { not: 'TURNED_IN' } },
      data: { status: 'TURNED_IN', submittedAt: now, submittedById: userId, late, version, penaltyPct: latePenaltyPct(a, daysLate) },
    });
    if (!r.count) throw new AppError('Already turned in', 409, 'WORK_CLASSWORK_TURNED_IN');
    await tx.workClassSubmissionVersion.create({ data: { submissionId: s.id, version, action: 'TURN_IN', text: s.text, links: links as Prisma.InputJsonValue, fileIds: files.map((f) => f.id), late, actorId: userId } });
  });
  return getAssignment(userId, classId, aid);
}

export async function unsubmit(userId: number, classId: number, aid: number) {
  const { c, a } = await studentAssignment(userId, classId, aid);
  const s = await ensureMySubmission(c, a, userId);
  if (s.status !== 'TURNED_IN') throw new AppError('Nothing to unsubmit', 409, 'WORK_CLASSWORK_NOT_TURNED_IN');
  await prisma.$transaction(async (tx) => {
    await tx.workClassSubmission.update({ where: { id: s.id }, data: { status: s.returnedAt ? 'RETURNED' : 'ASSIGNED' } });
    const files = await tx.workClassFile.findMany({ where: { submissionId: s.id, detachedAt: null }, select: { id: true } });
    await tx.workClassSubmissionVersion.create({ data: { submissionId: s.id, version: s.version, action: 'UNSUBMIT', text: s.text, links: s.links as Prisma.InputJsonValue, fileIds: files.map((f) => f.id), late: s.late, actorId: userId } });
  });
  // Đã trả trước đó + huỷ nộp lần nộp lại ⇒ trạng thái về "Đã trả" nhưng vẫn sửa được (không khoá như TURNED_IN).
  return getAssignment(userId, classId, aid);
}

// ─── Nhận xét riêng tư hai chiều ─────────────────────────────────

async function submissionForComment(c: ClassCtx, userId: number, sid: number) {
  const s = await prisma.workClassSubmission.findFirst({ where: { id: sid, assignment: { classId: c.classId, deletedAt: null } }, select: { id: true, userId: true, groupId: true, assignmentId: true, assignment: { select: ASSIGNMENT_SELECT } } });
  if (!s) throw new NotFoundError('Submission not found');
  if (!c.manage) {
    if (!ownsSubmission(c, s, userId) || !isVisible(s.assignment, new Date())) throw new NotFoundError('Submission not found');
  }
  return s;
}

/** Nhận xét riêng: sinh viên dùng `sid` của bài nộp mình (hoặc aid ⇒ tự tạo bài nộp trống). */
export async function addComment(userId: number, classId: number, input: { submissionId?: number; assignmentId?: number; body: string }) {
  const c = await classCtx(userId, classId);
  assertWritable(c);
  const body = input.body.trim().slice(0, 4000);
  if (!body) throw new BadRequestError('Write a comment', 'WORK_CLASSWORK_BAD');
  let sid = input.submissionId;
  if (!sid) {
    if (c.manage || !input.assignmentId) throw new BadRequestError('Pick the submission', 'WORK_CLASSWORK_BAD');
    const a = await loadAssignment(c, input.assignmentId);
    sid = (await ensureMySubmission(c, a, userId)).id;
  }
  const s = await submissionForComment(c, userId, sid);
  const row = await prisma.workClassSubmissionComment.create({ data: { submissionId: s.id, authorId: userId, body } });
  // Chuông: sinh viên viết ⇒ giảng viên; giảng viên viết ⇒ chủ bài nộp (cá nhân) hoặc cả nhóm.
  const cls = await prisma.workClass.findUniqueOrThrow({ where: { id: classId }, select: { classCode: true, ownerId: true, teacherId: true } });
  const receivers = new Set<number>();
  if (c.manage) {
    if (s.userId) receivers.add(s.userId);
    else if (s.groupId) for (const m of await prisma.workClassStudent.findMany({ where: { classId, groupId: s.groupId, userId: { not: null } }, select: { userId: true } })) receivers.add(m.userId!);
  } else {
    receivers.add(cls.teacherId ?? cls.ownerId);
    if (s.groupId) for (const m of await prisma.workClassStudent.findMany({ where: { classId, groupId: s.groupId, userId: { not: null } }, select: { userId: true } })) receivers.add(m.userId!);
  }
  receivers.delete(userId);
  for (const r of receivers) {
    await notifyWork({
      receiverId: r, senderId: userId, type: 'WORK_COMMENT', entityId: classId,
      payload: { issueKey: cls.classCode, title: s.assignment.title, message: 'New private comment', url: classUrl(classId, s.assignmentId, r === (cls.teacherId ?? cls.ownerId) ? `&s=${s.id}` : '') },
    }).catch(() => undefined);
  }
  return { id: row.id, body: row.body, createdAt: row.createdAt };
}

// ─── Giảng viên: danh sách bài nộp, chấm, trả ────────────────────

/** Danh sách theo chủ bài nộp (SV hoặc nhóm) được giao: trạng thái + điểm nháp + điểm đã trả. */
export async function listSubmissions(userId: number, classId: number, aid: number) {
  const c = await classCtx(userId, classId, true);
  const now = new Date();
  const a = await loadAssignment(c, aid, now);
  const seats = await seatsOf(classId);
  const { keys, seats: assigned } = ownersOf(a, seats);
  const subs = await prisma.workClassSubmission.findMany({ where: { assignmentId: a.id }, select: { ...SUB_SELECT, _count: { select: { comments: true, files: true } } } });
  const users = await peopleMap(assigned.map((s) => s.userId!));
  const groups = new Map((await prisma.workClassGroup.findMany({ where: { classId }, select: { id: true, number: true, name: true } })).map((g) => [g.id, g]));
  const rows = [...keys].map((k) => {
    const s = subs.find((x) => x.ownerKey === k) ?? null;
    const members = assigned.filter((x) => ownerKeyOf(a.kind, x.userId!, x.groupId) === k).map((x) => ({
      userId: x.userId!, seatId: x.id, studentCode: x.studentCode, name: x.fullName || (users.get(x.userId!) ? displayName(users.get(x.userId!)!) : `#${x.userId}`),
      draftPoints: s ? finalPointsFor(s, x.userId!, 'draft') : null, returnedPoints: s?.returnedAt ? finalPointsFor(s, x.userId!, 'returned') : null,
      memberPoints: s ? ((s.memberPoints as Record<string, number>)[String(x.userId)] ?? null) : null,
    }));
    const g = k.startsWith('G') ? groups.get(Number(k.slice(1))) ?? null : null;
    return {
      ownerKey: k, submissionId: s?.id ?? null, group: g, members,
      state: workState(s, a.dueAt, now), status: s?.status ?? 'ASSIGNED', late: s?.late ?? false, submittedAt: s?.submittedAt ?? null, version: s?.version ?? 0,
      points: s?.points ?? null, penaltyPct: s?.penaltyPct ?? 0, returnedAt: s?.returnedAt ?? null, returnedPoints: s?.returnedPoints ?? null,
      graded: s?.points !== null && s?.points !== undefined, regradedSinceReturn: !!s?.returnedAt && !!s.gradedAt && s.gradedAt > s.returnedAt,
      comments: s?._count.comments ?? 0, files: s?._count.files ?? 0,
    };
  });
  rows.sort((x, y) => (x.group?.number ?? 0) - (y.group?.number ?? 0) || (x.members[0]?.studentCode ?? x.members[0]?.name ?? '').localeCompare(y.members[0]?.studentCode ?? y.members[0]?.name ?? ''));
  return { assignment: { id: a.id, title: a.title, kind: a.kind, maxPoints: a.maxPoints, dueAt: a.dueAt, rubricId: a.rubricId }, rows };
}

/** Giảng viên mở MỘT bài nộp (theo ownerKey — kể cả chưa nộp, để chấm "thiếu bài"). */
export async function getSubmission(userId: number, classId: number, aid: number, ownerKey: string) {
  const c = await classCtx(userId, classId, true);
  const a = await loadAssignment(c, aid);
  const seats = await seatsOf(classId);
  const { keys, seats: assigned } = ownersOf(a, seats);
  if (!keys.has(ownerKey)) throw new NotFoundError('Submission not found');
  const s = await prisma.workClassSubmission.findUnique({ where: { assignmentId_ownerKey: { assignmentId: a.id, ownerKey } }, select: SUB_SELECT });
  const [files, versions, comments, rubric] = await Promise.all([
    s ? prisma.workClassFile.findMany({ where: { submissionId: s.id, detachedAt: null }, orderBy: { id: 'asc' }, select: FILE_SELECT }) : [],
    s ? prisma.workClassSubmissionVersion.findMany({ where: { submissionId: s.id }, orderBy: { id: 'desc' }, take: 50 }) : [],
    s ? prisma.workClassSubmissionComment.findMany({ where: { submissionId: s.id }, orderBy: { id: 'asc' }, take: 500 }) : [],
    rubricOf(a.rubricId),
  ]);
  const members = assigned.filter((x) => ownerKeyOf(a.kind, x.userId!, x.groupId) === ownerKey);
  const people = await peopleMap([...members.map((m) => m.userId!), ...comments.map((x) => x.authorId), ...versions.map((v) => v.actorId)]);
  const versionFiles = await prisma.workClassFile.findMany({ where: { id: { in: versions.flatMap((v) => v.fileIds) } }, select: FILE_SELECT });
  return {
    ownerKey, assignment: { id: a.id, title: a.title, kind: a.kind, maxPoints: a.maxPoints, dueAt: a.dueAt, latePenaltyPct: a.latePenaltyPct, latePenaltyMaxPct: a.latePenaltyMaxPct },
    rubric,
    members: members.map((m) => ({ userId: m.userId!, studentCode: m.studentCode, name: m.fullName || (people.get(m.userId!) ? displayName(people.get(m.userId!)!) : `#${m.userId}`), user: people.get(m.userId!) ?? null })),
    submission: s ? { ...s, files } : null,
    state: workState(s, a.dueAt, new Date()),
    versions: versions.map((v) => ({ ...v, actor: people.get(v.actorId) ?? null, files: versionFiles.filter((f) => v.fileIds.includes(f.id)) })),
    comments: comments.map((x) => ({ id: x.id, body: x.body, createdAt: x.createdAt, author: people.get(x.authorId) ?? null, mine: x.authorId === userId })),
  };
}

export interface GradeSubmissionInput {
  ownerKey: string;
  /** Điểm số trực tiếp (thang maxPoints). Bỏ qua khi có rubric và chấm đủ tiêu chí. null = xoá điểm. */
  points?: number | null;
  /** Điểm từng tiêu chí rubric. */
  scores?: Record<string, number | null>;
  /** Bài nhóm: điểm chỉnh riêng từng người (userId ⇒ điểm; null = về điểm chung). */
  memberPoints?: Record<string, number | null>;
  /** Mức trừ muộn (%), giảng viên chỉnh tay. */
  penaltyPct?: number;
}

/** Lưu điểm NHÁP (sinh viên chưa thấy cho tới khi trả). */
export async function gradeSubmission(userId: number, classId: number, aid: number, input: GradeSubmissionInput) {
  const c = await classCtx(userId, classId, true);
  assertWritable(c);
  const a = await loadAssignment(c, aid);
  const seats = await seatsOf(classId);
  const { keys, seats: assigned } = ownersOf(a, seats);
  if (!keys.has(input.ownerKey)) throw new NotFoundError('Submission not found');
  const members = new Set(assigned.filter((x) => ownerKeyOf(a.kind, x.userId!, x.groupId) === input.ownerKey).map((x) => String(x.userId)));
  const cur = await ensureOwnerSubmission(a, input.ownerKey);
  const rubric = await rubricOf(a.rubricId);
  const data: Prisma.WorkClassSubmissionUpdateInput = { gradedAt: new Date(), graderId: userId };
  const bound = (n: number, label: string) => {
    if (!Number.isFinite(n) || n < 0 || n > a.maxPoints * 2) throw new BadRequestError(`${label} must be between 0 and ${a.maxPoints * 2}`, 'WORK_CLASSWORK_BAD_POINTS');
    return Math.round(n * 100) / 100;
  };
  let points: number | null | undefined = input.points === undefined ? undefined : input.points === null ? null : bound(input.points, 'Points');
  if (input.scores !== undefined) {
    if (!rubric) throw new BadRequestError('This assignment has no rubric', 'WORK_CLASSWORK_BAD');
    let scores: Record<string, number>;
    try { scores = validateScores(rubric.criteria, input.scores, rubric.scaleMax); } catch (e) { if (e instanceof RubricError) throw new BadRequestError(e.message, 'WORK_RUBRIC_BAD'); throw e; }
    data.scores = scores as Prisma.InputJsonValue;
    const fromRubric = rubricToPoints(weightedTotal(rubric.criteria, scores), rubric.scaleMax, a.maxPoints);
    if (fromRubric !== null) points = fromRubric;
  }
  if (points !== undefined) data.points = points;
  if (input.memberPoints !== undefined) {
    if (a.kind !== 'GROUP') throw new BadRequestError('Per-member points are for group assignments', 'WORK_CLASSWORK_BAD');
    const merged = { ...((cur.memberPoints ?? {}) as Record<string, number>) };
    for (const [k, v] of Object.entries(input.memberPoints)) {
      if (!members.has(k)) throw new BadRequestError('That student is not in this group', 'WORK_CLASSWORK_BAD');
      if (v === null) delete merged[k]; else merged[k] = bound(v, 'Member points');
    }
    data.memberPoints = merged as Prisma.InputJsonValue;
  }
  if (input.penaltyPct !== undefined) data.penaltyPct = Math.min(Math.max(input.penaltyPct, 0), 100);
  await prisma.workClassSubmission.update({ where: { id: cur.id }, data });
  return getSubmission(userId, classId, aid, input.ownerKey);
}

async function ensureOwnerSubmission(a: AssignmentRow, ownerKey: string) {
  const isGroup = ownerKey.startsWith('G');
  const ref = Number(ownerKey.slice(1));
  return prisma.workClassSubmission.upsert({
    where: { assignmentId_ownerKey: { assignmentId: a.id, ownerKey } },
    create: { assignmentId: a.id, ownerKey, userId: isGroup ? null : ref, groupId: isGroup ? ref : null },
    update: {},
    select: SUB_SELECT,
  });
}

/** Trả bài theo lô: chép điểm nháp ⇒ bản đã trả (sinh viên thấy), trạng thái RETURNED, chuông cho chủ bài nộp. */
export async function returnSubmissions(userId: number, classId: number, aid: number, input: { ownerKeys: string[] }) {
  const c = await classCtx(userId, classId, true);
  assertWritable(c);
  const a = await loadAssignment(c, aid);
  const seats = await seatsOf(classId);
  const { keys, seats: assigned } = ownersOf(a, seats);
  const want = [...new Set(input.ownerKeys)].slice(0, 500);
  if (!want.length) throw new BadRequestError('Pick the work to return', 'WORK_CLASSWORK_BAD');
  for (const k of want) if (!keys.has(k)) throw new NotFoundError('Submission not found');
  const now = new Date();
  let returned = 0;
  const notified = new Set<number>();
  for (const k of want) {
    const s = await ensureOwnerSubmission(a, k);
    await prisma.workClassSubmission.update({
      where: { id: s.id },
      data: {
        status: 'RETURNED', returnedAt: now, returnedPoints: s.points, returnedScores: s.scores as Prisma.InputJsonValue,
        returnedMemberPoints: s.memberPoints as Prisma.InputJsonValue, returnedPenaltyPct: s.penaltyPct, returnCount: { increment: 1 },
      },
    });
    returned += 1;
    for (const m of assigned.filter((x) => ownerKeyOf(a.kind, x.userId!, x.groupId) === k)) notified.add(m.userId!);
  }
  const cls = await prisma.workClass.findUniqueOrThrow({ where: { id: classId }, select: { classCode: true } });
  for (const r of notified) {
    await notifyWork({ receiverId: r, senderId: userId, type: 'WORK_ALERT', entityId: classId, payload: { issueKey: cls.classCode, title: a.title, message: `Your work was returned: ${a.title}`, url: classUrl(classId, a.id) } }).catch(() => undefined);
  }
  return { returned };
}

// ─── Lịch lớp (9a): hạn bài trong khoảng ─────────────────────────

/** Hạn bài cho lịch lớp — sinh viên chỉ thấy bài đã giao cho mình. */
export async function assignmentDeadlines(userId: number, classId: number, range: { from: Date; to: Date }) {
  const c = await classCtx(userId, classId);
  const now = new Date();
  const rows = await prisma.workClassAssignment.findMany({
    where: { classId, deletedAt: null, dueAt: { gte: range.from, lte: range.to }, ...(c.manage ? { publishAt: { not: null } } : { publishAt: { lte: now } }) },
    orderBy: { dueAt: 'asc' }, select: ASSIGNMENT_SELECT,
  });
  return rows.filter((a) => c.manage || isAssignedTo(a, c.seat, userId)).map((a) => ({
    kind: 'ASSIGNMENT' as const, refId: a.id, title: a.title, at: a.dueAt!, topic: a.topic, link: { tab: 'classwork', a: String(a.id) },
  }));
}

// ─── Nguồn điểm của sổ điểm ──────────────────────────────────────

registerGradebookSource({
  kind: 'assignment',
  async items(ctx: GradebookCtx): Promise<GradebookItem[]> {
    const rows = await prisma.workClassAssignment.findMany({
      where: { classId: ctx.classId, deletedAt: null, publishAt: ctx.viewer.manage ? { not: null } : { lte: ctx.now } },
      orderBy: [{ dueAt: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }], select: ASSIGNMENT_SELECT,
    });
    let visible = rows;
    if (!ctx.viewer.manage) {
      const seat = await prisma.workClassStudent.findFirst({ where: { classId: ctx.classId, userId: ctx.viewer.userId }, select: { id: true, groupId: true } });
      visible = rows.filter((a) => isAssignedTo(a, seat, ctx.viewer.userId));
    }
    return visible.map((a) => ({
      key: `assignment:${a.id}`, kind: 'assignment', refId: a.id, title: a.title, category: a.category, topic: a.topic, maxPoints: a.maxPoints, dueAt: a.dueAt,
      importable: true, link: { tab: 'classwork', a: String(a.id) },
    }));
  },
  async cells(ctx: GradebookCtx, items: GradebookItem[]): Promise<GradebookCell[]> {
    const mine = items.filter((i) => i.kind === 'assignment');
    if (!mine.length) return [];
    const [assignments, seats] = await Promise.all([
      prisma.workClassAssignment.findMany({ where: { id: { in: mine.map((i) => i.refId) } }, select: ASSIGNMENT_SELECT }),
      seatsOf(ctx.classId),
    ]);
    const wanted = new Set(ctx.userIds);
    const subs = await prisma.workClassSubmission.findMany({ where: { assignmentId: { in: assignments.map((a) => a.id) } }, select: SUB_SELECT });
    const out: GradebookCell[] = [];
    for (const a of assignments) {
      const assigned = assignedSeats(a, seats).filter((s) => wanted.has(s.userId!));
      const assignedIds = new Set(assigned.map((s) => s.userId!));
      for (const uid of ctx.userIds) {
        const key = `assignment:${a.id}`;
        if (!assignedIds.has(uid)) { out.push({ itemKey: key, userId: uid, points: null, released: true, state: 'NOT_ASSIGNED' }); continue; }
        const seat = assigned.find((s) => s.userId === uid)!;
        const s = subs.find((x) => x.assignmentId === a.id && x.ownerKey === ownerKeyOf(a.kind, uid, seat.groupId)) ?? null;
        const st = workState(s, a.dueAt, ctx.now);
        if (!ctx.viewer.manage) {
          // Sinh viên: CHỈ bản đã trả.
          out.push({ itemKey: key, userId: uid, points: s ? studentGrade(s, uid).points : null, released: true, state: st, late: s?.late ?? false });
          continue;
        }
        const draft = s ? finalPointsFor(s, uid, 'draft') : null;
        const ret = s?.returnedAt ? finalPointsFor(s, uid, 'returned') : null;
        const regraded = !!s?.returnedAt && draft !== ret;
        out.push({
          itemKey: key, userId: uid, points: regraded || !s?.returnedAt ? draft : ret, released: !!s?.returnedAt && !regraded,
          state: st === 'RETURNED' ? 'RETURNED' : draft !== null ? 'GRADED' : st, late: s?.late ?? false,
        });
      }
    }
    return out;
  },
  async importCells(ctx: GradebookCtx, cells) {
    let n = 0;
    const ids = [...new Set(cells.map((c) => Number(c.itemKey.split(':')[1])))];
    const assignments = await prisma.workClassAssignment.findMany({ where: { id: { in: ids }, classId: ctx.classId, deletedAt: null }, select: ASSIGNMENT_SELECT });
    const seats = await seatsOf(ctx.classId);
    for (const cell of cells) {
      const a = assignments.find((x) => `assignment:${x.id}` === cell.itemKey);
      if (!a) continue;
      const seat = assignedSeats(a, seats).find((s) => s.userId === cell.userId);
      if (!seat) continue;
      const key = ownerKeyOf(a.kind, cell.userId, seat.groupId);
      if (!key) continue;
      const s = await ensureOwnerSubmission(a, key);
      const pts = Math.round(cell.points * 100) / 100;
      // Bài nhóm: điểm nhập theo từng người ⇒ điểm chỉnh riêng của người đó.
      const data: Prisma.WorkClassSubmissionUpdateInput = a.kind === 'GROUP'
        ? { memberPoints: { ...((s.memberPoints ?? {}) as Record<string, number>), [String(cell.userId)]: pts } as Prisma.InputJsonValue }
        : { points: pts };
      // Điểm nhập là điểm CUỐI ⇒ bỏ mức trừ muộn đã tính (không trừ hai lần).
      await prisma.workClassSubmission.update({ where: { id: s.id }, data: { ...data, penaltyPct: 0, gradedAt: new Date(), graderId: ctx.viewer.userId } });
      n += 1;
    }
    return n;
  },
});
