/**
 * CT Work — CTW đợt 5 (10/10/2026): LUỒNG LỚP HỌC (D6).
 *
 *   Giảng viên (hoặc trưởng nhóm) tạo LỚP (môn, mã lớp, kỳ) ⇒ có MÃ LỚP 8 ký tự + link `/work/classes?join=<mã>`.
 *   Sinh viên nhập mã ⇒ chọn nhóm có sẵn hoặc tự lập nhóm ⇒ nhóm mới = KHÔNG GIAN RIÊNG của nhóm + dự án từ mẫu môn
 *   (SWP391 / SWT301 / SWR302 / Capstone). Giảng viên của lớp được thêm vào mọi dự án nhóm với vai TEACHER (không gian:
 *   GUEST) ⇒ hub giảng viên đọc xuyên không gian; nhóm khác nhau ở không gian khác nhau nên KHÔNG thấy nhau.
 *   Danh sách sinh viên nhập từ CSV/xlsx (MSSV, họ tên, email) ⇒ xem trước lỗi từng dòng ⇒ xác nhận ⇒ gửi lời mời theo lô
 *   (thư có thương hiệu CT Work — cùng khung `renderWorkEmail` + `deliverWorkEmail` của thư mời không gian; giới hạn tốc độ
 *   ở `INVITE_LIMITS`).
 *
 * Quyền: người tạo lớp (OWNER) + giảng viên của lớp (TEACHER) quản lý lớp; sinh viên của lớp chỉ thấy tên nhóm + số người
 * (không thấy email/MSSV người khác). Người ngoài ⇒ 404. Agent ⇒ 403 ở mọi lệnh ghi (assertHumanActor).
 */

import { randomBytes } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { displayName, frontendUrl, PUBLIC_USER } from './common.js';
import { notifyWork } from './notify.js';
import { assertHumanActor, requireProject } from './permissions.js';
import { createProject, projectMembers } from './projects.service.js';
import { createWorkspace } from './workspaces.service.js';
import { deliverWorkEmail, renderWorkEmail } from './workEmail.js';
import { readXlsx } from './xlsxStyled.js';
import { validTz } from './projectTime.js';
import {
  CLASS_SUBJECTS, INVITE_LIMITS, MAX_CLASS_STUDENTS, MAX_GROUP_SIZE, SUBJECT_KEY, SUBJECT_TEMPLATE, canResendInvite, formatJoinCode,
  generateJoinCode, isWellFormedJoinCode, joinState, normalizeJoinCode, parseCsv, rosterFromTable, type ClassSubject, type RosterRow,
} from './teachingRules.js';

const DAY = 86_400_000;
const dbDate = (s: string | null | undefined) => (s ? new Date(`${s.slice(0, 10)}T00:00:00Z`) : null);
const iso = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : null);

// ─── Chặn dò mã lớp: 10 lần sai / 10 phút / người ────────────────

const JOIN_FAIL_MAX = 10;
const JOIN_FAIL_WINDOW = 10 * 60_000;
const joinFails = new Map<number, { n: number; until: number }>();
function assertJoinRate(userId: number) {
  const f = joinFails.get(userId);
  if (f && f.until > Date.now() && f.n >= JOIN_FAIL_MAX) {
    throw new AppError('Too many wrong class codes. Try again in a few minutes.', 429, 'WORK_CLASS_RATE');
  }
}
function noteJoinFail(userId: number) {
  const f = joinFails.get(userId);
  if (!f || f.until <= Date.now()) joinFails.set(userId, { n: 1, until: Date.now() + JOIN_FAIL_WINDOW });
  else f.n += 1;
}
/** CHỈ cho test. */
export function _resetJoinRate() { joinFails.clear(); }

// ─── Quyền trên lớp ─────────────────────────────────────────────

export type ClassRole = 'OWNER' | 'TEACHER' | 'STUDENT';

/** Vai của người trong lớp (null = không thuộc lớp). Dùng chung cho 9a/9b/9c. */
export async function classRole(userId: number, classId: number): Promise<{ role: ClassRole; cls: NonNullable<Awaited<ReturnType<typeof loadClass>>> } | null> {
  const cls = await loadClass(classId);
  if (!cls) return null;
  if (cls.ownerId === userId) return { role: 'OWNER', cls };
  if (cls.teacherId === userId) return { role: 'TEACHER', cls };
  const seat = await prisma.workClassStudent.findFirst({ where: { classId, userId }, select: { id: true } });
  return seat ? { role: 'STUDENT', cls } : null;
}

function loadClass(classId: number) {
  return prisma.workClass.findUnique({
    where: { id: classId },
    include: { owner: { select: PUBLIC_USER }, teacher: { select: PUBLIC_USER } },
  });
}

export async function requireClass(userId: number, classId: number, manage: boolean) {
  const r = await classRole(userId, classId);
  if (!r) throw new NotFoundError('Class not found');
  if (manage && r.role === 'STUDENT') throw new ForbiddenError('Only the lecturer and the class owner can do this');
  return r;
}

// ─── Lớp: tạo / đọc / sửa ─────────────────────────────────────────

export interface ClassInput {
  name?: string | null;
  subject: ClassSubject;
  classCode: string;
  term: string;
  /** Người tạo là giảng viên của lớp (mặc định). Sai ⇒ trưởng nhóm tạo hộ, có thể nêu email giảng viên. */
  iAmTeacher?: boolean;
  teacherEmail?: string | null;
  maxGroupSize?: number;
  joinExpiresInDays?: number | null;
  week1Start?: string | null;
  timezone?: string | null;
}

async function uniqueJoinCode(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const code = generateJoinCode((n) => randomBytes(n));
    if (!(await prisma.workClass.findUnique({ where: { joinCode: code }, select: { id: true } }))) return code;
  }
  throw new AppError('Could not create a class code, try again', 500, 'WORK_CLASS_CODE');
}

const cleanCode = (s: string, max: number) => s.trim().toUpperCase().replace(/\s+/g, '').slice(0, max);

export async function createClass(userId: number, input: ClassInput) {
  await assertHumanActor(userId, 'create classes');
  if (!CLASS_SUBJECTS.includes(input.subject)) throw new BadRequestError('Unknown subject', 'WORK_CLASS_BAD');
  const classCode = cleanCode(input.classCode ?? '', 32);
  const term = cleanCode(input.term ?? '', 16);
  if (!classCode) throw new BadRequestError('Class code is required (e.g. SE1840)', 'WORK_CLASS_BAD');
  if (!term) throw new BadRequestError('Term is required (e.g. FA26)', 'WORK_CLASS_BAD');
  const owned = await prisma.workClass.count({ where: { ownerId: userId, archivedAt: null } });
  if (owned >= 50) throw new BadRequestError('You can run at most 50 active classes', 'WORK_LIMIT');
  const iAmTeacher = input.iAmTeacher !== false;
  const teacherEmail = !iAmTeacher && input.teacherEmail?.trim() ? input.teacherEmail.trim().toLowerCase().slice(0, 100) : null;
  if (teacherEmail && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(teacherEmail)) throw new BadRequestError('The lecturer email is not valid', 'WORK_CLASS_BAD');
  const days = input.joinExpiresInDays ?? 30;
  const cls = await prisma.workClass.create({
    data: {
      name: (input.name?.trim() || `${input.subject} · ${classCode} · ${term}`).slice(0, 120),
      subject: input.subject, classCode, term, ownerId: userId,
      teacherId: iAmTeacher ? userId : null, teacherEmail,
      joinCode: await uniqueJoinCode(),
      joinExpiresAt: days ? new Date(Date.now() + Math.min(Math.max(days, 1), 180) * DAY) : null,
      maxGroupSize: Math.min(Math.max(input.maxGroupSize ?? 6, 1), MAX_GROUP_SIZE),
      week1Start: dbDate(input.week1Start),
      timezone: input.timezone && validTz(input.timezone) ? input.timezone : 'Asia/Ho_Chi_Minh',
    },
    select: { id: true },
  });
  return getClass(userId, cls.id);
}

/** Lớp của tôi: tôi tạo, tôi dạy, tôi học. */
export async function listMyClasses(userId: number) {
  const [owned, seats] = await Promise.all([
    prisma.workClass.findMany({
      where: { OR: [{ ownerId: userId }, { teacherId: userId }] },
      orderBy: [{ archivedAt: { sort: 'asc', nulls: 'first' } }, { createdAt: 'desc' }],
      select: { id: true, name: true, subject: true, classCode: true, term: true, ownerId: true, teacherId: true, archivedAt: true, _count: { select: { groups: true, students: true } } },
    }),
    prisma.workClassStudent.findMany({
      where: { userId },
      select: { class: { select: { id: true, name: true, subject: true, classCode: true, term: true, ownerId: true, teacherId: true, archivedAt: true } }, group: { select: { id: true, name: true, project: { select: { key: true, workspace: { select: { slug: true } } } } } } },
    }),
  ]);
  return {
    teaching: owned.map((c) => ({ ...c, role: (c.ownerId === userId ? 'OWNER' : 'TEACHER') as ClassRole, groups: c._count.groups, students: c._count.students })),
    enrolled: seats.filter((s) => !owned.some((o) => o.id === s.class.id)).map((s) => ({
      ...s.class, role: 'STUDENT' as ClassRole,
      group: s.group ? { id: s.group.id, name: s.group.name, href: s.group.project ? `/work/${s.group.project.workspace.slug}/${s.group.project.key}` : null } : null,
    })),
  };
}

async function groupsOf(classId: number) {
  const rows = await prisma.workClassGroup.findMany({
    where: { classId },
    orderBy: { number: 'asc' },
    select: {
      id: true, number: true, name: true, leaderId: true, createdAt: true,
      project: { select: { id: true, key: true, name: true, deletedAt: true, workspace: { select: { slug: true, deletedAt: true } } } },
      _count: { select: { students: true } },
    },
  });
  return rows.map((g) => ({
    id: g.id, number: g.number, name: g.name, leaderId: g.leaderId, members: g._count.students,
    project: g.project && !g.project.deletedAt && !g.project.workspace.deletedAt
      ? { id: g.project.id, key: g.project.key, name: g.project.name, href: `/work/${g.project.workspace.slug}/${g.project.key}` }
      : null,
  }));
}

export async function getClass(userId: number, classId: number) {
  const { role, cls } = await requireClass(userId, classId, false);
  const manage = role !== 'STUDENT';
  const groups = await groupsOf(classId);
  const me = await prisma.workClassStudent.findFirst({ where: { classId, userId }, select: { id: true, groupId: true, studentCode: true } });
  const base = {
    id: cls.id, name: cls.name, subject: cls.subject, classCode: cls.classCode, term: cls.term, role,
    owner: cls.owner, teacher: cls.teacher, maxGroupSize: cls.maxGroupSize, week1Start: iso(cls.week1Start), timezone: cls.timezone,
    archivedAt: cls.archivedAt, joinState: joinState(cls, new Date()), groups, me,
  };
  if (!manage) return { ...base, manage: false as const };
  const students = await prisma.workClassStudent.findMany({
    where: { classId },
    orderBy: [{ groupId: { sort: 'asc', nulls: 'last' } }, { studentCode: 'asc' }, { id: 'asc' }],
    select: { id: true, email: true, studentCode: true, fullName: true, groupId: true, source: true, invitedAt: true, inviteCount: true, joinedAt: true, user: { select: PUBLIC_USER } },
  });
  return {
    ...base, manage: true as const,
    joinCode: cls.joinCode, joinCodeDisplay: formatJoinCode(cls.joinCode), joinExpiresAt: cls.joinExpiresAt, joinOpen: cls.joinOpen,
    joinUrl: frontendUrl(`/work/classes?join=${cls.joinCode}`),
    teacherEmail: role === 'OWNER' ? cls.teacherEmail : null,
    students, inviteLimits: INVITE_LIMITS,
  };
}

export interface ClassPatch {
  name?: string; maxGroupSize?: number; joinOpen?: boolean; teacherEmail?: string | null; week1Start?: string | null;
  archived?: boolean; timezone?: string;
}

export async function updateClass(userId: number, classId: number, patch: ClassPatch) {
  await assertHumanActor(userId, 'manage classes');
  const { role } = await requireClass(userId, classId, true);
  const data: Prisma.WorkClassUpdateInput = {};
  if (patch.name !== undefined) { const n = patch.name.trim(); if (!n) throw new BadRequestError('Class name is required', 'WORK_CLASS_BAD'); data.name = n.slice(0, 120); }
  if (patch.maxGroupSize !== undefined) data.maxGroupSize = Math.min(Math.max(Math.round(patch.maxGroupSize), 1), MAX_GROUP_SIZE);
  if (patch.joinOpen !== undefined) data.joinOpen = patch.joinOpen;
  if (patch.week1Start !== undefined) data.week1Start = dbDate(patch.week1Start);
  if (patch.timezone !== undefined) { if (!validTz(patch.timezone)) throw new BadRequestError('Unknown time zone', 'WORK_BAD_TIMEZONE'); data.timezone = patch.timezone; }
  if (patch.archived !== undefined) data.archivedAt = patch.archived ? new Date() : null;
  if (patch.teacherEmail !== undefined) {
    if (role !== 'OWNER') throw new ForbiddenError('Only the class owner can change the lecturer');
    const e = patch.teacherEmail?.trim().toLowerCase() || null;
    if (e && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e)) throw new BadRequestError('The lecturer email is not valid', 'WORK_CLASS_BAD');
    data.teacherEmail = e;
  }
  await prisma.workClass.update({ where: { id: classId }, data });
  return getClass(userId, classId);
}

/** Mã mới (mã cũ hết hiệu lực ngay) + hạn mới. */
export async function regenerateJoinCode(userId: number, classId: number, input: { expiresInDays?: number | null }) {
  await assertHumanActor(userId, 'manage classes');
  await requireClass(userId, classId, true);
  const days = input.expiresInDays === null ? null : Math.min(Math.max(input.expiresInDays ?? 30, 1), 180);
  await prisma.workClass.update({
    where: { id: classId },
    data: { joinCode: await uniqueJoinCode(), joinOpen: true, joinExpiresAt: days ? new Date(Date.now() + days * DAY) : null },
  });
  return getClass(userId, classId);
}

// ─── Vào lớp bằng mã ────────────────────────────────────────────

async function classByCode(userId: number, raw: string) {
  assertJoinRate(userId);
  const code = normalizeJoinCode(raw);
  const cls = isWellFormedJoinCode(code) ? await prisma.workClass.findUnique({ where: { joinCode: code }, include: { owner: { select: PUBLIC_USER }, teacher: { select: PUBLIC_USER } } }) : null;
  if (!cls) {
    noteJoinFail(userId);
    throw new AppError('This class code is not valid. Check it with your lecturer.', 404, 'WORK_CLASS_CODE_INVALID');
  }
  const st = joinState(cls, new Date());
  if (st === 'EXPIRED') throw new AppError('This class code has expired. Ask your lecturer for a new one.', 410, 'WORK_CLASS_CODE_EXPIRED');
  if (st === 'CLOSED' || st === 'ARCHIVED') throw new AppError('This class is not accepting new students.', 403, 'WORK_CLASS_CLOSED');
  return cls;
}

export async function previewJoin(userId: number, raw: string) {
  const cls = await classByCode(userId, raw);
  const [me, groups, user] = await Promise.all([
    prisma.workClassStudent.findFirst({ where: { classId: cls.id, userId }, select: { id: true, groupId: true } }),
    groupsOf(cls.id),
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true } }),
  ]);
  const roster = me ? null : await prisma.workClassStudent.findFirst({ where: { classId: cls.id, userId: null, email: user.email.toLowerCase() }, select: { studentCode: true, fullName: true } });
  return {
    class: { id: cls.id, name: cls.name, subject: cls.subject, classCode: cls.classCode, term: cls.term, maxGroupSize: cls.maxGroupSize, owner: cls.owner, teacher: cls.teacher },
    groups: groups.map((g) => ({ id: g.id, number: g.number, name: g.name, members: g.members, full: g.members >= cls.maxGroupSize })),
    me: me ? { joined: true, groupId: me.groupId } : { joined: false, groupId: null },
    onRoster: roster,
    isTeacher: cls.teacherId === userId,
    canTeach: !cls.teacherId && !!cls.teacherEmail && cls.teacherEmail === user.email.toLowerCase(),
    template: SUBJECT_TEMPLATE[cls.subject as ClassSubject] ?? 'BLANK',
  };
}

export interface JoinInput {
  action: 'JOIN' | 'JOIN_GROUP' | 'CREATE_GROUP' | 'TEACH';
  groupId?: number;
  groupName?: string;
  projectKey?: string;
  studentCode?: string;
}

/** Người vào dự án: không gian (không hạ vai đang có) + dự án (không hạ ADMIN). */
async function addToGroupProject(tx: Prisma.TransactionClient, projectId: number, userId: number, wsRole: 'GUEST' | 'MEMBER', projectRole: 'MEMBER' | 'TEACHER') {
  const p = await tx.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { workspaceId: true } });
  const wm = await tx.workMember.findFirst({ where: { workspaceId: p.workspaceId, userId }, select: { id: true, role: true } });
  if (!wm) await tx.workMember.create({ data: { workspaceId: p.workspaceId, userId, role: wsRole } });
  const pm = await tx.workProjectMember.findFirst({ where: { projectId, userId }, select: { id: true, role: true } });
  if (!pm) await tx.workProjectMember.create({ data: { projectId, userId, role: projectRole } });
  else if (pm.role !== 'ADMIN' && pm.role !== projectRole) await tx.workProjectMember.update({ where: { id: pm.id }, data: { role: projectRole } });
}

/** Ghế của người trong lớp: có sẵn ⇒ dùng; dòng danh sách trùng email ⇒ gắn vào; không thì tạo dòng JOIN. */
async function ensureSeat(tx: Prisma.TransactionClient, classId: number, userId: number, studentCode?: string) {
  const mine = await tx.workClassStudent.findFirst({ where: { classId, userId } });
  if (mine) return mine;
  const user = await tx.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true, fullName: true, displayName: true, username: true } });
  const email = user.email.toLowerCase();
  const roster = await tx.workClassStudent.findFirst({ where: { classId, userId: null, email } });
  if (roster) return tx.workClassStudent.update({ where: { id: roster.id }, data: { userId, joinedAt: new Date() } });
  const count = await tx.workClassStudent.count({ where: { classId } });
  if (count >= MAX_CLASS_STUDENTS) throw new BadRequestError(`A class can have at most ${MAX_CLASS_STUDENTS} students`, 'WORK_LIMIT');
  const code = studentCode?.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20) || null;
  const codeTaken = code ? await tx.workClassStudent.findFirst({ where: { classId, studentCode: code }, select: { id: true } }) : null;
  return tx.workClassStudent.create({
    data: {
      classId, userId, email, studentCode: codeTaken ? null : code, fullName: (user.fullName || user.displayName || user.username).slice(0, 120),
      source: 'JOIN', joinedAt: new Date(),
    },
  });
}

/** Thêm sinh viên vào danh sách sinh viên của mẫu báo cáo FPT (Course & group) nếu chưa có. */
async function appendReportStudent(projectId: number, seat: { studentCode: string | null; fullName: string | null }, role: string) {
  const doc = await prisma.workFptReportDoc.findUnique({ where: { projectId }, select: { students: true } });
  const list = (Array.isArray(doc?.students) ? doc!.students : []) as Array<{ code: string; name: string; role: string; aiTools: string }>;
  const name = seat.fullName ?? '';
  if (list.some((s) => (seat.studentCode && s.code === seat.studentCode) || (!seat.studentCode && s.name === name))) return;
  list.push({ code: seat.studentCode ?? '', name, role, aiTools: '' });
  await prisma.workFptReportDoc.upsert({ where: { projectId }, create: { projectId, students: list as unknown as Prisma.InputJsonValue }, update: { students: list as unknown as Prisma.InputJsonValue } });
}

/** Đưa giảng viên vào mọi dự án nhóm của lớp (GUEST không gian + TEACHER dự án). */
async function attachTeacherToGroups(classId: number, teacherId: number) {
  const groups = await prisma.workClassGroup.findMany({ where: { classId, projectId: { not: null } }, select: { projectId: true } });
  for (const g of groups) {
    await prisma.$transaction((tx) => addToGroupProject(tx, g.projectId!, teacherId, 'GUEST', 'TEACHER')).catch((err) => logger.warn('[work] class: gắn giảng viên lỗi', { err: (err as Error).message }));
  }
}

export async function joinClass(userId: number, raw: string, input: JoinInput) {
  await assertHumanActor(userId, 'join classes');
  const cls = await classByCode(userId, raw);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true, ...PUBLIC_USER } });

  if (input.action === 'TEACH') {
    if (cls.teacherId === userId) return { classId: cls.id, role: 'TEACHER' as const, project: null };
    if (cls.teacherId) throw new ConflictError('This class already has a lecturer');
    if (!cls.teacherEmail || cls.teacherEmail !== user.email.toLowerCase()) throw new ForbiddenError('Only the lecturer named by the class owner can join as lecturer');
    await prisma.workClass.update({ where: { id: cls.id }, data: { teacherId: userId } });
    await attachTeacherToGroups(cls.id, userId);
    return { classId: cls.id, role: 'TEACHER' as const, project: null };
  }
  // Giảng viên không vào nhóm như sinh viên (người tạo lớp là trưởng nhóm thì vẫn vào nhóm bình thường).
  if (cls.teacherId === userId) return { classId: cls.id, role: 'TEACHER' as const, project: null };

  if (input.action === 'JOIN') {
    await prisma.$transaction((tx) => ensureSeat(tx, cls.id, userId, input.studentCode));
    return { classId: cls.id, role: 'STUDENT' as const, project: null };
  }

  if (input.action === 'JOIN_GROUP') {
    if (!input.groupId) throw new BadRequestError('Pick a group', 'WORK_CLASS_BAD');
    const out = await prisma.$transaction(async (tx) => {
      const seat = await ensureSeat(tx, cls.id, userId, input.studentCode);
      const g = await tx.workClassGroup.findFirst({ where: { id: input.groupId, classId: cls.id }, select: { id: true, name: true, projectId: true } });
      if (!g) throw new NotFoundError('Group not found');
      if (seat.groupId === g.id) return { g, seat, already: true };
      if (seat.groupId) throw new ConflictError('You are already in another group of this class. Ask your lecturer to move you.');
      const size = await tx.workClassStudent.count({ where: { groupId: g.id } });
      if (size >= cls.maxGroupSize) throw new AppError(`This group is full (${cls.maxGroupSize} people)`, 409, 'WORK_CLASS_GROUP_FULL');
      await tx.workClassStudent.update({ where: { id: seat.id }, data: { groupId: g.id, joinedAt: seat.joinedAt ?? new Date() } });
      if (g.projectId) await addToGroupProject(tx, g.projectId, userId, 'MEMBER', 'MEMBER');
      return { g, seat, already: false };
    });
    if (out.g.projectId && !out.already) await appendReportStudent(out.g.projectId, out.seat, 'Member').catch(() => undefined);
    return { classId: cls.id, role: 'STUDENT' as const, project: await projectLink(out.g.projectId) };
  }

  // CREATE_GROUP: nhóm mới ⇒ không gian riêng + dự án theo mẫu môn.
  const seat = await prisma.$transaction((tx) => ensureSeat(tx, cls.id, userId, input.studentCode));
  if (seat.groupId) throw new ConflictError('You are already in a group of this class');
  const subject = cls.subject as ClassSubject;
  const last = await prisma.workClassGroup.findFirst({ where: { classId: cls.id }, orderBy: { number: 'desc' }, select: { number: true } });
  const number = (last?.number ?? 0) + 1;
  const groupName = (input.groupName?.trim() || `Group ${number}`).slice(0, 80);
  const ws = await createWorkspace(userId, { name: `${cls.classCode} · ${groupName}`.slice(0, 100), description: `${cls.subject} · ${cls.classCode} · ${cls.term}` });
  const key = (input.projectKey?.trim().toUpperCase() || SUBJECT_KEY[subject]).slice(0, 10);
  const project = await createProject(userId, ws.id, {
    key, name: `${cls.subject} ${cls.classCode} — ${groupName}`.slice(0, 120), type: 'SCRUM', template: SUBJECT_TEMPLATE[subject], kind: 'SCHOOL', visibility: 'WORKSPACE',
  });
  try {
    await prisma.$transaction(async (tx) => {
      const g = await tx.workClassGroup.create({ data: { classId: cls.id, number, name: groupName, projectId: project.id, leaderId: userId }, select: { id: true } });
      await tx.workClassStudent.update({ where: { id: seat.id }, data: { groupId: g.id } });
      return g;
    });
  } catch (err) {
    // Hai người lập nhóm cùng lúc lấy trùng số ⇒ thử số kế tiếp một lần.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const n2 = ((await prisma.workClassGroup.findFirst({ where: { classId: cls.id }, orderBy: { number: 'desc' }, select: { number: true } }))?.number ?? 0) + 1;
      await prisma.$transaction(async (tx) => {
        const g = await tx.workClassGroup.create({ data: { classId: cls.id, number: n2, name: groupName, projectId: project.id, leaderId: userId }, select: { id: true } });
        await tx.workClassStudent.update({ where: { id: seat.id }, data: { groupId: g.id } });
        return g;
      });
    } else throw err;
  }
  // Múi giờ của lớp ⇒ múi giờ dự án (việc định kỳ, báo cáo tuần chia ngày theo đó).
  await prisma.$transaction(async (tx) => {
    const cur = await tx.workProject.findUniqueOrThrow({ where: { id: project.id }, select: { settings: true } });
    await tx.workProject.update({ where: { id: project.id }, data: { settings: { ...((cur.settings ?? {}) as Record<string, unknown>), timezone: cls.timezone } as Prisma.InputJsonValue } });
  });
  // Thông tin môn học cho báo cáo FPT (Course & group) + giảng viên vào dự án với vai TEACHER.
  const teacher = cls.teacher;
  await prisma.workFptReportDoc.upsert({
    where: { projectId: project.id },
    create: {
      projectId: project.id, subjectCode: cls.subject === 'OTHER' ? null : cls.subject, classCode: cls.classCode, semester: cls.term,
      lecturer: teacher ? displayName(teacher) : null, groupCode: `${cls.classCode}-G${number}`, projectTitle: groupName, week1Start: cls.week1Start,
      students: [{ code: seat.studentCode ?? '', name: seat.fullName ?? displayName(user), role: 'Leader', aiTools: '' }] as unknown as Prisma.InputJsonValue,
    },
    update: {},
  });
  if (cls.teacherId) {
    await prisma.$transaction((tx) => addToGroupProject(tx, project.id, cls.teacherId!, 'GUEST', 'TEACHER'));
    await notifyWork({
      receiverId: cls.teacherId, senderId: userId, type: 'WORK_ALERT', entityId: project.id,
      payload: { issueKey: project.key, title: groupName, message: `${displayName(user)} created ${groupName} in ${cls.classCode}`, url: `/work/${ws.slug}/${project.key}` },
    }).catch(() => undefined);
  }
  return { classId: cls.id, role: 'STUDENT' as const, project: { id: project.id, key: project.key, href: `/work/${ws.slug}/${project.key}` } };
}

async function projectLink(projectId: number | null) {
  if (!projectId) return null;
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { id: true, key: true, workspace: { select: { slug: true } } } });
  return p ? { id: p.id, key: p.key, href: `/work/${p.workspace.slug}/${p.key}` } : null;
}

// ─── Danh sách sinh viên ──────────────────────────────────────────

export interface RosterSource { csv?: string; xlsxBase64?: string }

function tableOf(src: RosterSource): string[][] {
  if (src.csv !== undefined) {
    if (src.csv.length > 1_000_000) throw new BadRequestError('The file is too large (max 1 MB)', 'WORK_ROSTER_BAD');
    return parseCsv(src.csv);
  }
  if (src.xlsxBase64) {
    const buf = Buffer.from(src.xlsxBase64, 'base64');
    if (buf.length > 2_000_000) throw new BadRequestError('The file is too large (max 2 MB)', 'WORK_ROSTER_BAD');
    let sheets;
    try { sheets = readXlsx(buf); } catch { throw new BadRequestError('This is not an .xlsx file', 'WORK_ROSTER_BAD'); }
    const first = sheets.find((s) => s.maxRow > 0 && s.maxCol > 0);
    if (!first) return [];
    const out: string[][] = [];
    for (let r = 1; r <= Math.min(first.maxRow, 1000); r++) {
      const row: string[] = [];
      for (let c = 1; c <= Math.min(first.maxCol, 30); c++) row.push(first.text(r, c).trim());
      out.push(row);
    }
    return out;
  }
  throw new BadRequestError('Upload a .csv or .xlsx file', 'WORK_ROSTER_BAD');
}

async function existingKeys(classId: number) {
  const rows = await prisma.workClassStudent.findMany({ where: { classId }, select: { email: true, studentCode: true } });
  return { emails: new Set(rows.map((r) => r.email).filter(Boolean) as string[]), codes: new Set(rows.map((r) => r.studentCode).filter(Boolean) as string[]) };
}

function summarize(rows: RosterRow[]) {
  const valid = rows.filter((r) => !r.errors.length);
  return { rows, total: rows.length, valid: valid.length, invalid: rows.length - valid.length };
}

/** Xem trước: đọc tệp, kiểm từng dòng — KHÔNG ghi gì. */
export async function previewRoster(userId: number, classId: number, src: RosterSource) {
  await requireClass(userId, classId, true);
  return summarize(rosterFromTable(tableOf(src), await existingKeys(classId)));
}

/** Nhập (sau khi người dùng đã xem trước và bấm xác nhận): đọc LẠI tệp ở máy chủ, chỉ ghi dòng hợp lệ. */
export async function importRoster(userId: number, classId: number, src: RosterSource & { confirm?: boolean }) {
  await assertHumanActor(userId, 'manage classes');
  await requireClass(userId, classId, true);
  if (src.confirm !== true) throw new BadRequestError('Review the preview and confirm the import', 'WORK_CONFIRM_REQUIRED');
  const res = summarize(rosterFromTable(tableOf(src), await existingKeys(classId)));
  const count = await prisma.workClassStudent.count({ where: { classId } });
  const valid = res.rows.filter((r) => !r.errors.length);
  if (count + valid.length > MAX_CLASS_STUDENTS) throw new BadRequestError(`A class can have at most ${MAX_CLASS_STUDENTS} students`, 'WORK_LIMIT');
  // Người đã có tài khoản (cùng email) ⇒ gắn sẵn userId để họ thấy lớp ngay sau khi đăng nhập.
  const users = await prisma.user.findMany({ where: { email: { in: valid.map((r) => r.email!), mode: 'insensitive' }, kind: 'HUMAN' }, select: { id: true, email: true } });
  const byEmail = new Map(users.map((u) => [u.email.toLowerCase(), u.id]));
  const taken = new Set((await prisma.workClassStudent.findMany({ where: { classId, userId: { in: users.map((u) => u.id) } }, select: { userId: true } })).map((s) => s.userId));
  const r = await prisma.workClassStudent.createMany({
    data: valid.map((v) => {
      const uid = byEmail.get(v.email!) ?? null;
      return { classId, email: v.email, studentCode: v.studentCode, fullName: v.fullName, source: 'ROSTER', userId: uid && !taken.has(uid) ? uid : null };
    }),
    skipDuplicates: true,
  });
  return { ...res, imported: r.count, skipped: res.total - r.count };
}

export async function removeStudent(userId: number, classId: number, studentId: number) {
  await assertHumanActor(userId, 'manage classes');
  await requireClass(userId, classId, true);
  const s = await prisma.workClassStudent.findFirst({ where: { id: studentId, classId }, select: { id: true, groupId: true } });
  if (!s) throw new NotFoundError('Student not found');
  if (s.groupId) throw new BadRequestError('This student is in a group — remove them from the group project first', 'WORK_CLASS_IN_GROUP');
  await prisma.workClassStudent.delete({ where: { id: s.id } });
}

/**
 * Gửi lời mời theo lô. Không `confirm` ⇒ CHỈ trả bản xem trước (bao nhiêu thư sẽ đi, bao nhiêu bị bỏ qua và vì sao).
 * `confirm: true` ⇒ gửi. Trần: ≤ perBatch thư / lần, ≤ perClassPerDay thư / lớp / 24 giờ, mỗi người cách ≥ 24 giờ,
 * tối đa maxPerStudent lần. Người đã vào lớp không nhận thư.
 */
export async function inviteRoster(userId: number, classId: number, input: { studentIds?: number[]; confirm?: boolean }) {
  await assertHumanActor(userId, 'send class invitations');
  const { cls } = await requireClass(userId, classId, true);
  const st = joinState(cls, new Date());
  if (st !== 'OK') throw new AppError('Open the class code (or create a new one) before inviting students', 409, 'WORK_CLASS_CLOSED');
  const now = new Date();
  const students = await prisma.workClassStudent.findMany({
    where: { classId, email: { not: null }, ...(input.studentIds?.length ? { id: { in: input.studentIds } } : {}) },
    select: { id: true, email: true, fullName: true, invitedAt: true, inviteCount: true, joinedAt: true, userId: true },
  });
  const sentToday = await prisma.workClassStudent.count({ where: { classId, invitedAt: { gte: new Date(now.getTime() - DAY) } } });
  const budget = Math.max(0, Math.min(INVITE_LIMITS.perBatch, INVITE_LIMITS.perClassPerDay - sentToday));
  const skipped = { joined: 0, tooSoon: 0, max: 0, overLimit: 0 };
  const send: typeof students = [];
  for (const s of students) {
    const ok = canResendInvite(s, now);
    if (ok === 'JOINED') skipped.joined += 1;
    else if (ok === 'TOO_SOON') skipped.tooSoon += 1;
    else if (ok === 'MAX') skipped.max += 1;
    else if (send.length >= budget) skipped.overLimit += 1;
    else send.push(s);
  }
  const plan = { willSend: send.length, skipped, limits: INVITE_LIMITS, sentLast24h: sentToday };
  if (input.confirm !== true) return { ...plan, sent: 0, confirmed: false };

  const inviter = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true, ...PUBLIC_USER } });
  const url = frontendUrl(`/work/classes?join=${cls.joinCode}`);
  for (const s of send) {
    const mail = buildClassInviteEmail({
      to: s.email!, studentName: s.fullName, inviter: { name: displayName(inviter), avatarUrl: inviter.avatarUrl },
      cls: { name: cls.name, subject: cls.subject, classCode: cls.classCode, term: cls.term, code: formatJoinCode(cls.joinCode), expiresAt: cls.joinExpiresAt },
      url,
    });
    void deliverWorkEmail({ to: s.email!, ...mail, replyTo: inviter.email, refId: `ctw-class-${classId}-${s.id}-${Date.now().toString(36)}` });
    if (s.userId) {
      await notifyWork({ receiverId: s.userId, senderId: userId, type: 'WORK_ALERT', entityId: classId, payload: { issueKey: cls.classCode, title: cls.name, message: `You were invited to ${cls.name}. Class code ${formatJoinCode(cls.joinCode)}`, url: `/work/classes?join=${cls.joinCode}` } }).catch(() => undefined);
    }
  }
  if (send.length) {
    await prisma.workClassStudent.updateMany({ where: { id: { in: send.map((s) => s.id) } }, data: { invitedAt: now, inviteCount: { increment: 1 } } });
  }
  return { ...plan, sent: send.length, confirmed: true };
}

/** Thư mời vào lớp — cùng khung thương hiệu với thư mời không gian (workEmail.ts), song ngữ Việt/Anh. */
export function buildClassInviteEmail(i: {
  to: string; studentName: string | null; inviter: { name: string; avatarUrl?: string | null };
  cls: { name: string; subject: string; classCode: string; term: string; code: string; expiresAt: Date | null }; url: string;
}): { subject: string; html: string; text: string } {
  const exp = i.cls.expiresAt ? i.cls.expiresAt.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' }) : null;
  const subject = `${i.inviter.name} mời bạn vào lớp ${i.cls.subject} ${i.cls.classCode} trên CT Work`;
  const { html, text } = renderWorkEmail({
    lang: 'vi',
    preheader: `Mã lớp ${i.cls.code} — vào lớp, chọn hoặc lập nhóm, nhận dự án mẫu ${i.cls.subject}.`,
    hero: { url: null, color: '#4f5bd5', alt: '' },
    person: { name: i.inviter.name, avatarUrl: i.inviter.avatarUrl, caption: 'mời bạn vào lớp' },
    heading: `Lớp ${i.cls.subject} · ${i.cls.classCode} · ${i.cls.term}`,
    lines: [
      `${i.studentName ? `Chào ${i.studentName}, ` : ''}${i.inviter.name} đã thêm bạn vào danh sách lớp "${i.cls.name}" trên CT Work — công cụ quản lý dự án (board, sprint, tài liệu, báo cáo theo mẫu FPT) mà lớp dùng cho đồ án.`,
      'Bấm nút bên dưới (hoặc nhập mã lớp ở trang Classes), rồi chọn nhóm có sẵn hoặc tự lập nhóm — nhóm mới nhận ngay dự án theo mẫu môn và giảng viên tự được thêm vào.',
    ],
    details: [
      { label: 'Môn (subject)', value: i.cls.subject },
      { label: 'Lớp (class)', value: `${i.cls.classCode} · ${i.cls.term}` },
      { label: 'Mã lớp (class code)', value: i.cls.code },
      ...(exp ? [{ label: 'Hạn mã (expires)', value: exp }] : []),
    ],
    note: `Đăng ký hoặc đăng nhập bằng email ${i.to} để lớp nhận ra bạn đúng theo danh sách (MSSV, họ tên).`,
    cta: { label: 'Vào lớp', url: i.url },
    secondary: [`${i.inviter.name} added you to the class roster of ${i.cls.subject} ${i.cls.classCode} (${i.cls.term}) on CT Work.`, `Open the link or enter the class code ${i.cls.code}, then join or create your group.`],
    reason: `Bạn nhận thư này vì ${i.inviter.name} đã nhập địa chỉ ${i.to} vào danh sách lớp trên CT Work (cuongthai.com).`,
    ignore: 'Nếu bạn không học lớp này hoặc nhận nhầm, cứ bỏ qua thư — không có tài khoản nào được tạo.',
  });
  return { subject, html, text };
}

// ─── "Tuần 1 làm gì" cho dự án môn học ────────────────────────────

export const WEEK1_ITEMS = ['course', 'team', 'roles', 'charter', 'backlog', 'sprint', 'github', 'chat', 'recurring', 'mentorMeeting', 'qna', 'subject'] as const;
export type Week1Item = (typeof WEEK1_ITEMS)[number];

/**
 * Checklist tuần đầu — mỗi mục đọc từ DỮ LIỆU THẬT (làm ở chỗ khác vẫn được tích), kèm đường dẫn tới đúng tính năng.
 * Chữ hiển thị ở giao diện (i18n miền `classroom`, có bản tiếng Việt). Khách cổng không thấy (chốt cổng khách).
 */
export async function week1(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const [p, doc, members, pages, gh, gl, msgs, issues, sprint, recurring, meetings, questions, useCases, tests, group] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { template: true, key: true, workspace: { select: { slug: true } } } }),
    prisma.workFptReportDoc.findUnique({ where: { projectId }, select: { subjectCode: true, classCode: true, lecturer: true, students: true } }),
    projectMembers(projectId),
    prisma.workPage.count({ where: { projectId, deletedAt: null, OR: [{ templateKey: { in: ['fpt-report1-project-introduction', 'bien-ban-kick-off', 'ke-hoach-du-an'] } }, { title: { contains: 'charter', mode: 'insensitive' } }, { title: { contains: 'kick-off', mode: 'insensitive' } }], contentText: { not: null } } }),
    prisma.workGithubConnection.count({ where: { projectId } }),
    prisma.workGitlabConnection.count({ where: { projectId } }),
    prisma.workChannelMessage.count({ where: { channel: { projectId }, deletedAt: null } }),
    prisma.workIssue.count({ where: { projectId, deletedAt: null } }),
    prisma.workSprint.count({ where: { projectId, issues: { some: { deletedAt: null } } } }),
    prisma.workAutomationRule.count({ where: { projectId, trigger: 'scheduled.recurring' } }),
    prisma.workMeeting.count({ where: { projectId } }),
    prisma.workRaidItem.count({ where: { projectId, type: 'QUESTION' } }),
    prisma.workUseCase.count({ where: { projectId } }),
    prisma.workTestCase.count({ where: { issue: { projectId, deletedAt: null } } }).catch(() => 0),
    prisma.workClassGroup.findUnique({ where: { projectId }, select: { class: { select: { subject: true, classCode: true, term: true } } } }),
  ]);
  const team = members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');
  const students = (Array.isArray(doc?.students) ? doc!.students : []) as Array<{ role?: string }>;
  const subject = (group?.class.subject ?? doc?.subjectCode ?? p.template ?? '').toUpperCase();
  const testing = subject === 'SWT301';
  const base = `/work/${p.workspace.slug}/${p.key}`;
  const items: Array<{ id: Week1Item; done: boolean; href: string; variant?: string }> = [
    { id: 'course', done: !!(doc?.subjectCode && doc.classCode && doc.lecturer), href: `${base}/school?tab=course` },
    { id: 'team', done: team.length >= 2, href: `${base}/settings?tab=members` },
    { id: 'roles', done: students.length >= 2 && students.every((s) => !!s.role?.trim()), href: `${base}/school?tab=course` },
    { id: 'charter', done: pages > 0, href: `${base}/docs` },
    { id: 'backlog', done: issues >= 5, href: `${base}/backlog` },
    { id: 'sprint', done: sprint > 0, href: `${base}/backlog` },
    { id: 'github', done: gh + gl > 0, href: `${base}/settings?tab=github` },
    { id: 'chat', done: msgs > 0, href: `${base}/chat` },
    { id: 'recurring', done: recurring > 0, href: `${base}/settings?tab=recurring` },
    { id: 'mentorMeeting', done: meetings > 0, href: access.modules.meetings ? `${base}/meetings` : `${base}/settings?tab=studio` },
    { id: 'qna', done: questions > 0, href: `${base}/school?tab=qna` },
    testing
      ? { id: 'subject', variant: 'tests', done: tests > 0, href: `${base}/tests` }
      : { id: 'subject', variant: 'requirements', done: useCases > 0, href: `${base}/requirements` },
  ];
  return {
    subject: subject || null,
    class: group?.class ?? null,
    items,
    done: items.filter((i) => i.done).length,
    total: items.length,
    canEdit: access.role === 'ADMIN' || access.role === 'MEMBER',
  };
}

/** Lớp gắn với dự án (cho hub + trang dự án). */
export async function classOfProject(projectId: number) {
  const g = await prisma.workClassGroup.findUnique({ where: { projectId }, select: { id: true, number: true, name: true, class: { select: { id: true, subject: true, classCode: true, term: true, name: true } } } });
  return g;
}
