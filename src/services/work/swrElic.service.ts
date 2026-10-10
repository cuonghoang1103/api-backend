/**
 * CT Work — CTW đợt 6b (11/10/2026) SWR-4 "Elicitation & stakeholder" — phần có DB. Luật thuần ở swr6b.ts.
 *
 *   R3  Sổ stakeholder SH-n (vai, tổ chức, lớp người dùng, ảnh hưởng/quan tâm 1–5, thái độ, champion, quyền quyết định)
 *       + lưới quyền lực × quan tâm + ma trận RACI (hoạt động × stakeholder, đúng một A mỗi hoạt động).
 *   R1  Sổ phiên elicitation ELC-n: 6 kỹ thuật, kế hoạch, câu hỏi soạn trước (+ câu trả lời), người tham gia + vai đóng,
 *       ghi chú/kết quả; nối họp K-2 (tạo/gắn cuộc họp loại Elicitation ⇒ ghi âm, phiên âm Groq, biên bản AI có sẵn).
 *       AI đọc transcript + câu trả lời + ghi chú ⇒ ĐỀ XUẤT yêu cầu có bằng chứng (dòng + trích dẫn kiểm được) ⇒ người
 *       duyệt bấm Nhận thì mới thành thẻ REQUIREMENT (nguồn = phiên + stakeholder, ghi vào "Source" của Wiegers).
 *   R2  Khảo sát SV-n: soạn câu hỏi, mở link công khai (không cần tài khoản, có trần lượt gọi), thu kết quả, tổng hợp,
 *       xuất .xlsx; khảo sát của phiên kỹ thuật SURVEY là nguồn cho AI đề xuất.
 *   Truy vết: yêu cầu ↔ phiên ↔ stakeholder (work_requirement_origins) + báo cáo elicitation .docx/.pdf.
 *
 * Quyền như SRS (`srsCtx`): xem = đội dự án + giảng viên; sửa = issue.edit; agent: không xoá, không nhận/bỏ đề xuất,
 * không mở/đóng khảo sát công khai (đối ngoại), không đổi RACI — người làm.
 */

import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { config } from '../../config/env.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { displayName } from './common.js';
import { renderDocx, renderPdf, type ExportMeta } from './docExport.js';
import { emitWorkEvent } from './events.js';
import { can } from './permissions.js';
import { srsCtx } from './srs.service.js';
import {
  checkProposals, DEFAULT_RACI_ACTIVITIES, elcKey, elicitationReportDoc, normalizeQuestions, normalizeSurveyQuestions, parseSurveyQuestions,
  proposalsOut, proposalsPrompt, quadrantOf, QUADRANTS, raciProblems, RACI_ROLES, registerWarnings, sessionQuestionInput, SESSION_STATUSES,
  shKey, shLabel, shNumber, sourceLines, sourceText, STAKEHOLDER_KINDS, ATTITUDES, summarizeSurvey, surveyQuestion, surveySheets, svKey,
  TECHNIQUES, validateAnswers, QUESTION_BANK, type ReportData, type SessionQuestion, type StakeholderLite, type Technique, elcNumber,
} from './swr6b.js';
import { LIFECYCLE_LABEL, PRIORITY3, REQ_TYPES, type Lifecycle } from './swr.js';
import { AI_TURNS_MAX, parseTurns, stakeholderPrompt, turnsAsTranscript, type AiTurn } from './swrPack.js';
import { writeXlsx } from './xlsxStyled.js';

const clean = (s: string | null | undefined, n: number) => { const v = (s ?? '').trim(); return v ? v.slice(0, n) : null; };
const touch = (projectId: number, userId: number) => emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
const view = (u: number, p: number) => srsCtx(u, p, 'view');
async function edit(u: number, p: number, opts: { noAgent?: string } = {}) {
  const ctx = await srsCtx(u, p, 'edit');
  if (opts.noAgent && ctx.isAgent) throw new ForbiddenError(opts.noAgent);
  return ctx;
}
async function projectInfo(projectId: number) {
  return prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true, workspace: { select: { slug: true } } } });
}
const fileName = (s: string) => s.replace(/[^\w.-]+/g, '_').replace(/_+/g, '_').slice(0, 80);

// ═══ R3 Stakeholder ══════════════════════════════════════════════

const rating = z.number().int().min(1).max(5);
export const stakeholderInput = z.object({
  name: z.string().trim().min(1).max(160),
  role: z.string().max(160).nullable().optional(),
  organization: z.string().max(160).nullable().optional(),
  kind: z.enum(STAKEHOLDER_KINDS).optional(),
  userClass: z.string().max(120).nullable().optional(),
  influence: rating.optional(),
  interest: rating.optional(),
  attitude: z.enum(ATTITUDES).nullable().optional(),
  isChampion: z.boolean().optional(),
  decisionRights: z.string().max(4000).nullable().optional(),
  majorValue: z.string().max(4000).nullable().optional(),
  interests: z.string().max(4000).nullable().optional(),
  constraints: z.string().max(4000).nullable().optional(),
  contact: z.string().max(200).nullable().optional(),
  notes: z.string().max(8000).nullable().optional(),
  /** Actor SRS tương ứng (id) — lớp người dùng trong use case. */
  actorId: z.number().int().positive().nullable().optional(),
  /** Thành viên dự án (người trong hệ thống). */
  userId: z.number().int().positive().nullable().optional(),
  position: z.number().int().min(0).max(10_000).optional(),
});
export type StakeholderInput = z.infer<typeof stakeholderInput>;

const toLite = (s: Prisma.WorkStakeholderGetPayload<object>): StakeholderLite => ({
  id: s.id, number: s.number, name: s.name, role: s.role, organization: s.organization, kind: s.kind, userClass: s.userClass, influence: s.influence,
  interest: s.interest, attitude: s.attitude, isChampion: s.isChampion, decisionRights: s.decisionRights, majorValue: s.majorValue, interests: s.interests,
  constraints: s.constraints, contact: s.contact, notes: s.notes,
});

export async function loadStakeholders(projectId: number): Promise<StakeholderLite[]> {
  return (await prisma.workStakeholder.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { number: 'asc' }] })).map(toLite);
}

async function stakeholderByRef(projectId: number, ref: unknown) {
  const n = shNumber(ref);
  const s = n ? await prisma.workStakeholder.findFirst({ where: { projectId, number: n } }) : null;
  if (!s) throw new NotFoundError(`Stakeholder ${String(ref)} not found`);
  return s;
}

async function assertLinks(projectId: number, input: Partial<StakeholderInput>) {
  if (input.actorId && !(await prisma.workSrsActor.count({ where: { id: input.actorId, projectId } }))) throw new BadRequestError('Actor not found in this project', 'WORK_BAD_ACTOR');
  if (input.userId && !(await prisma.workProjectMember.count({ where: { projectId, userId: input.userId } }))) throw new BadRequestError('The person must be a member of this project', 'VALIDATION_ERROR');
}

function stakeholderData(input: Partial<StakeholderInput>) {
  const o: Record<string, unknown> = {};
  if (input.name !== undefined) o.name = input.name.trim();
  for (const [k, n] of [['role', 160], ['organization', 160], ['userClass', 120], ['decisionRights', 4000], ['majorValue', 4000], ['interests', 4000], ['constraints', 4000], ['contact', 200], ['notes', 8000]] as const) {
    if (input[k] !== undefined) o[k] = clean(input[k] as string | null, n);
  }
  for (const k of ['kind', 'influence', 'interest', 'attitude', 'isChampion', 'actorId', 'userId', 'position'] as const) if (input[k] !== undefined) o[k] = input[k];
  return o;
}

export async function listStakeholders(userId: number, projectId: number) {
  const ctx = await view(userId, projectId);
  const [rows, actors, members, sessions, origins] = await Promise.all([
    prisma.workStakeholder.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { number: 'asc' }] }),
    prisma.workSrsActor.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, name: true, kind: true } }),
    prisma.workProjectMember.findMany({ where: { projectId, user: { kind: { not: 'AGENT' } } }, select: { userId: true, user: { select: { username: true, fullName: true, displayName: true } } } }),
    prisma.workElicitationParticipant.findMany({ where: { session: { projectId } }, select: { stakeholderId: true, session: { select: { number: true } } } }),
    prisma.workRequirementOrigin.findMany({ where: { projectId, stakeholderId: { not: null }, issue: { deletedAt: null } }, select: { stakeholderId: true, issueId: true } }),
  ]);
  const list = rows.map(toLite);
  return {
    stakeholders: rows.map((s) => ({
      ...toLite(s), key: shKey(s.number), actorId: s.actorId, userId: s.userId, position: s.position, rev: s.rev,
      quadrant: quadrantOf(s.influence, s.interest),
      sessions: sessions.filter((p) => p.stakeholderId === s.id).map((p) => elcKey(p.session.number)),
      requirements: new Set(origins.filter((o) => o.stakeholderId === s.id).map((o) => o.issueId)).size,
    })),
    grid: Object.fromEntries(QUADRANTS.map((q) => [q, list.filter((s) => quadrantOf(s.influence, s.interest) === q).map((s) => shKey(s.number))])),
    warnings: registerWarnings(list),
    actors, members: members.map((m) => ({ id: m.userId, name: displayName(m.user) })),
    canEdit: ctx.canEdit, canConfigure: ctx.canEdit && !ctx.isAgent,
  };
}

export async function createStakeholder(userId: number, projectId: number, input: StakeholderInput) {
  await edit(userId, projectId);
  await assertLinks(projectId, input);
  const s = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(31071::int, ${projectId}::int)`;
    if (await tx.workStakeholder.findFirst({ where: { projectId, name: { equals: input.name.trim(), mode: 'insensitive' }, role: input.role?.trim() || null }, select: { id: true } })) {
      throw new ConflictError(`"${input.name.trim()}" is already in the stakeholder register`);
    }
    const agg = await tx.workStakeholder.aggregate({ where: { projectId }, _max: { number: true, position: true } });
    return tx.workStakeholder.create({
      data: { ...(stakeholderData(input) as Prisma.WorkStakeholderUncheckedCreateInput), projectId, name: input.name.trim(), number: (agg._max.number ?? 0) + 1, position: input.position ?? (agg._max.position ?? -1) + 1, createdById: userId },
    });
  });
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'swr.stakeholder.create', targetType: 'stakeholder', targetId: s.id, summary: `Added ${shKey(s.number)}: ${s.name}`.slice(0, 300) });
  return { ...toLite(s), key: shKey(s.number) };
}

export async function updateStakeholder(userId: number, projectId: number, ref: number | string, input: Partial<StakeholderInput> & { rev?: number }) {
  await edit(userId, projectId);
  const cur = await stakeholderByRef(projectId, ref);
  await assertLinks(projectId, input);
  const r = await prisma.workStakeholder.updateMany({
    where: { id: cur.id, ...(input.rev !== undefined ? { rev: input.rev } : {}) },
    data: { ...(stakeholderData(input) as Prisma.WorkStakeholderUncheckedUpdateManyInput), rev: { increment: 1 } },
  });
  if (!r.count) throw new ConflictError('Someone else changed this stakeholder — reload to see their version');
  touch(projectId, userId);
  const s = await prisma.workStakeholder.findUniqueOrThrow({ where: { id: cur.id } });
  return { ...toLite(s), key: shKey(s.number), rev: s.rev };
}

export async function deleteStakeholder(userId: number, projectId: number, ref: number | string) {
  await edit(userId, projectId, { noAgent: 'An AI agent cannot delete stakeholders' });
  const cur = await stakeholderByRef(projectId, ref);
  await prisma.workStakeholder.delete({ where: { id: cur.id } });
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'swr.stakeholder.delete', targetType: 'stakeholder', targetId: cur.id, summary: `Deleted ${shKey(cur.number)}: ${cur.name}`.slice(0, 300) });
  return { deleted: true };
}

/** Tạo stakeholder từ các actor PERSON chưa có trong sổ (lớp người dùng = tên actor). */
export async function seedFromActors(userId: number, projectId: number) {
  await edit(userId, projectId);
  const [actors, have] = await Promise.all([
    prisma.workSrsActor.findMany({ where: { projectId, kind: { not: 'SYSTEM' } }, orderBy: [{ position: 'asc' }, { id: 'asc' }] }),
    prisma.workStakeholder.findMany({ where: { projectId }, select: { actorId: true, name: true } }),
  ]);
  const add = actors.filter((a) => !have.some((h) => h.actorId === a.id || h.name.toLowerCase() === a.name.toLowerCase()));
  for (const a of add) await createStakeholder(userId, projectId, { name: a.name, kind: 'GROUP', userClass: a.name, actorId: a.id, notes: a.description ?? null });
  return { added: add.length };
}

// ─── RACI ────────────────────────────────────────────────────────

export async function getRaci(userId: number, projectId: number) {
  const ctx = await view(userId, projectId);
  const [activities, stakeholders] = await Promise.all([
    prisma.workRaciActivity.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], include: { cells: true } }),
    prisma.workStakeholder.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { number: 'asc' }], select: { id: true, number: true, name: true, role: true } }),
  ]);
  const cells = activities.flatMap((a) => a.cells.map((c) => ({ activityId: a.id, stakeholderId: c.stakeholderId, role: c.role })));
  return {
    activities: activities.map((a) => ({ id: a.id, name: a.name, position: a.position })),
    stakeholders: stakeholders.map((s) => ({ id: s.id, key: shKey(s.number), name: s.name, role: s.role })),
    cells, problems: raciProblems(activities, cells), defaults: DEFAULT_RACI_ACTIVITIES,
    canEdit: ctx.canEdit && !ctx.isAgent,
  };
}

const RACI_DENY = 'An AI agent cannot change who is responsible or accountable — a person decides';

export async function addRaciActivity(userId: number, projectId: number, input: { name?: string; defaults?: boolean }) {
  await edit(userId, projectId, { noAgent: RACI_DENY });
  const names = input.defaults ? DEFAULT_RACI_ACTIVITIES : input.name?.trim() ? [input.name.trim().slice(0, 160)] : [];
  if (!names.length) throw new BadRequestError('Give an activity name', 'VALIDATION_ERROR');
  let pos = ((await prisma.workRaciActivity.aggregate({ where: { projectId }, _max: { position: true } }))._max.position ?? -1) + 1;
  let added = 0;
  for (const name of names) {
    const exists = await prisma.workRaciActivity.findFirst({ where: { projectId, name: { equals: name, mode: 'insensitive' } }, select: { id: true } });
    if (exists) { if (!input.defaults) throw new ConflictError(`"${name}" is already in the RACI matrix`); continue; }
    await prisma.workRaciActivity.create({ data: { projectId, name, position: pos++ } });
    added++;
  }
  touch(projectId, userId);
  return { added };
}

export async function deleteRaciActivity(userId: number, projectId: number, id: number) {
  await edit(userId, projectId, { noAgent: RACI_DENY });
  const r = await prisma.workRaciActivity.deleteMany({ where: { id, projectId } });
  if (!r.count) throw new NotFoundError('Activity not found');
  touch(projectId, userId);
  return { deleted: true };
}

/** Đặt một ô (role null = xoá ô). A là duy nhất mỗi hoạt động: đặt A mới ⇒ A cũ (nếu có) thành R. */
export async function setRaciCell(userId: number, projectId: number, input: { activityId: number; stakeholder: number | string; role: (typeof RACI_ROLES)[number] | null }) {
  await edit(userId, projectId, { noAgent: RACI_DENY });
  const a = await prisma.workRaciActivity.findFirst({ where: { id: input.activityId, projectId }, select: { id: true } });
  if (!a) throw new NotFoundError('Activity not found');
  const s = await stakeholderByRef(projectId, input.stakeholder);
  await prisma.$transaction(async (tx) => {
    if (input.role === null) { await tx.workRaciCell.deleteMany({ where: { activityId: a.id, stakeholderId: s.id } }); return; }
    if (input.role === 'A') await tx.workRaciCell.updateMany({ where: { activityId: a.id, role: 'A', stakeholderId: { not: s.id } }, data: { role: 'R' } });
    await tx.workRaciCell.upsert({ where: { activityId_stakeholderId: { activityId: a.id, stakeholderId: s.id } }, create: { activityId: a.id, stakeholderId: s.id, role: input.role }, update: { role: input.role } });
  });
  touch(projectId, userId);
  return getRaci(userId, projectId);
}

// ═══ R1 Phiên elicitation ════════════════════════════════════════

export const sessionInput = z.object({
  title: z.string().trim().min(1).max(200),
  technique: z.enum(TECHNIQUES),
  status: z.enum(SESSION_STATUSES).optional(),
  scheduledAt: z.coerce.date().nullable().optional(),
  durationMin: z.number().int().min(5).max(24 * 60).nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  objective: z.string().max(8000).nullable().optional(),
  plan: z.string().max(20_000).nullable().optional(),
  questions: z.array(sessionQuestionInput).max(100).optional(),
  notes: z.string().max(100_000).nullable().optional(),
  outcome: z.string().max(20_000).nullable().optional(),
  aiSimulated: z.boolean().optional(),
  participants: z.array(z.object({ stakeholder: z.union([z.number().int().positive(), z.string().max(12)]), rolePlayed: z.string().max(120).nullable().optional() })).max(60).optional(),
  /** Điền sẵn câu hỏi gợi ý của kỹ thuật khi tạo (không ghi đè câu đã gửi). */
  suggestQuestions: z.boolean().optional(),
});
export type SessionInput = z.infer<typeof sessionInput>;

async function sessionByRef(projectId: number, ref: unknown) {
  const n = elcNumber(ref);
  const s = n ? await prisma.workElicitationSession.findFirst({ where: { projectId, number: n } }) : null;
  if (!s) throw new NotFoundError(`Elicitation session ${String(ref)} not found`);
  return s;
}

async function setParticipants(tx: Prisma.TransactionClient, projectId: number, sessionId: number, list: NonNullable<SessionInput['participants']>) {
  const ids: Array<{ id: number; rolePlayed: string | null }> = [];
  for (const p of list) {
    const n = shNumber(p.stakeholder);
    const s = n ? await tx.workStakeholder.findFirst({ where: { projectId, number: n }, select: { id: true } }) : null;
    if (!s) throw new BadRequestError(`Stakeholder ${String(p.stakeholder)} not found — add them to the register first`, 'WORK_BAD_STAKEHOLDER');
    if (!ids.some((x) => x.id === s.id)) ids.push({ id: s.id, rolePlayed: clean(p.rolePlayed, 120) });
  }
  await tx.workElicitationParticipant.deleteMany({ where: { sessionId } });
  if (ids.length) await tx.workElicitationParticipant.createMany({ data: ids.map((x) => ({ sessionId, stakeholderId: x.id, rolePlayed: x.rolePlayed })) });
}

function sessionData(input: Partial<SessionInput>) {
  const o: Record<string, unknown> = {};
  if (input.title !== undefined) o.title = input.title.trim();
  for (const k of ['technique', 'status', 'scheduledAt', 'durationMin', 'aiSimulated'] as const) if (input[k] !== undefined) o[k] = input[k];
  for (const [k, n] of [['location', 200], ['objective', 8000], ['plan', 20_000], ['notes', 100_000], ['outcome', 20_000]] as const) if (input[k] !== undefined) o[k] = clean(input[k] as string | null, n);
  if (input.questions !== undefined) o.questions = normalizeQuestions(input.questions) as unknown as Prisma.InputJsonValue;
  return o;
}

export async function createSession(userId: number, projectId: number, input: SessionInput) {
  await edit(userId, projectId);
  const questions = input.questions?.length ? input.questions : input.suggestQuestions ? QUESTION_BANK[input.technique].map((text) => ({ text })) : [];
  const s = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(31072::int, ${projectId}::int)`;
    const agg = await tx.workElicitationSession.aggregate({ where: { projectId }, _max: { number: true } });
    const row = await tx.workElicitationSession.create({
      data: { ...(sessionData({ ...input, questions }) as Prisma.WorkElicitationSessionUncheckedCreateInput), projectId, title: input.title.trim(), technique: input.technique, number: (agg._max.number ?? 0) + 1, createdById: userId },
    });
    if (input.participants?.length) await setParticipants(tx, projectId, row.id, input.participants);
    return row;
  });
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'swr.elicitation.create', targetType: 'elicitation', targetId: s.id, summary: `Planned ${elcKey(s.number)}: ${s.title}`.slice(0, 300) });
  return getSession(userId, projectId, s.number);
}

export async function updateSession(userId: number, projectId: number, ref: number | string, input: Partial<SessionInput> & { rev?: number }) {
  await edit(userId, projectId);
  const cur = await sessionByRef(projectId, ref);
  await prisma.$transaction(async (tx) => {
    const r = await tx.workElicitationSession.updateMany({ where: { id: cur.id, ...(input.rev !== undefined ? { rev: input.rev } : {}) }, data: { ...(sessionData(input) as Prisma.WorkElicitationSessionUncheckedUpdateManyInput), rev: { increment: 1 } } });
    if (!r.count) throw new ConflictError('Someone else changed this session — reload to see their version');
    if (input.participants) await setParticipants(tx, projectId, cur.id, input.participants);
  });
  touch(projectId, userId);
  return getSession(userId, projectId, cur.number);
}

export async function deleteSession(userId: number, projectId: number, ref: number | string) {
  await edit(userId, projectId, { noAgent: 'An AI agent cannot delete elicitation sessions' });
  const cur = await sessionByRef(projectId, ref);
  await prisma.workElicitationSession.delete({ where: { id: cur.id } });
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'swr.elicitation.delete', targetType: 'elicitation', targetId: cur.id, summary: `Deleted ${elcKey(cur.number)}: ${cur.title}`.slice(0, 300) });
  return { deleted: true };
}

async function meetingRef(projectId: number, meetingId: number | null) {
  if (!meetingId) return null;
  const m = await prisma.workMeeting.findFirst({ where: { id: meetingId, projectId, deletedAt: null }, select: { id: true, number: true, title: true, status: true, startsAt: true, _count: { select: { recordings: true } } } });
  return m ? { number: m.number, title: m.title, status: m.status, startsAt: m.startsAt, recordings: m._count.recordings } : null;
}

async function surveyRef(projectId: number, surveyId: number | null) {
  if (!surveyId) return null;
  const s = await prisma.workSurvey.findFirst({ where: { id: surveyId, projectId }, select: { number: true, title: true, status: true, _count: { select: { responses: true } } } });
  return s ? { number: s.number, key: svKey(s.number), title: s.title, status: s.status, responses: s._count.responses } : null;
}

export async function listSessions(userId: number, projectId: number) {
  const ctx = await view(userId, projectId);
  const rows = await prisma.workElicitationSession.findMany({
    where: { projectId }, orderBy: [{ number: 'desc' }],
    include: { participants: { include: { stakeholder: { select: { number: true, name: true, role: true } } } }, _count: { select: { origins: true } }, proposals: { select: { status: true } } },
  });
  return {
    sessions: rows.map((s) => ({
      number: s.number, key: elcKey(s.number), title: s.title, technique: s.technique, status: s.status, scheduledAt: s.scheduledAt, durationMin: s.durationMin,
      aiSimulated: s.aiSimulated, meetingId: s.meetingId, surveyId: s.surveyId,
      participants: s.participants.map((p) => ({ key: shKey(p.stakeholder.number), name: p.stakeholder.name, role: p.stakeholder.role, rolePlayed: p.rolePlayed })),
      questions: normalizeQuestions(s.questions).length, answered: normalizeQuestions(s.questions).filter((q) => q.answer).length,
      requirements: s._count.origins, pending: s.proposals.filter((p) => p.status === 'PENDING').length,
    })),
    techniques: TECHNIQUES, questionBank: QUESTION_BANK,
    canEdit: ctx.canEdit, canApprove: ctx.canApprove,
  };
}

export async function getSession(userId: number, projectId: number, ref: number | string) {
  const ctx = await view(userId, projectId);
  const s = await sessionByRef(projectId, ref);
  const { key } = await projectInfo(projectId);
  const [participants, proposals, origins, meeting, survey] = await Promise.all([
    prisma.workElicitationParticipant.findMany({ where: { sessionId: s.id }, include: { stakeholder: { select: { id: true, number: true, name: true, role: true, userId: true } } } }),
    prisma.workReqProposal.findMany({ where: { sessionId: s.id }, orderBy: [{ id: 'asc' }], include: { stakeholder: { select: { number: true, name: true } } } }),
    prisma.workRequirementOrigin.findMany({ where: { sessionId: s.id, issue: { deletedAt: null } }, include: { issue: { select: { number: true, title: true, requirementInfo: { select: { lifecycle: true } } } }, stakeholder: { select: { number: true, name: true } } } }),
    meetingRef(projectId, s.meetingId), surveyRef(projectId, s.surveyId),
  ]);
  const issueNums = new Map((await prisma.workIssue.findMany({ where: { id: { in: proposals.map((p) => p.issueId).filter((x): x is number => !!x) } }, select: { id: true, number: true } })).map((i) => [i.id, i.number]));
  return {
    number: s.number, key: elcKey(s.number), title: s.title, technique: s.technique, status: s.status, scheduledAt: s.scheduledAt, durationMin: s.durationMin,
    location: s.location, objective: s.objective, plan: s.plan, questions: normalizeQuestions(s.questions), notes: s.notes, outcome: s.outcome,
    aiSimulated: s.aiSimulated, rev: s.rev, meeting, survey, sourceText: sourceText(s),
    // CTW đợt 8c (R28): hỏi–đáp với stakeholder do AI đóng vai (bằng chứng nguồn, ghi rõ AI-simulated).
    aiTranscript: parseTurns(s.aiTranscript), aiPersona: await personaRef(projectId, s.aiPersonaId),
    participants: participants.map((p) => ({ stakeholderId: p.stakeholder.id, key: shKey(p.stakeholder.number), name: p.stakeholder.name, role: p.stakeholder.role, rolePlayed: p.rolePlayed, userId: p.stakeholder.userId })),
    proposals: proposals.map((p) => ({
      id: p.id, title: p.title, text: p.text, reqType: p.reqType, priority: p.priority, status: p.status, model: p.model,
      stakeholder: p.stakeholder ? { key: shKey(p.stakeholder.number), name: p.stakeholder.name } : null,
      evidence: (Array.isArray(p.evidence) ? p.evidence : []) as Array<{ line: number; quote: string }>,
      issue: p.issueId && issueNums.has(p.issueId) ? `${key}-${issueNums.get(p.issueId)}` : null,
    })),
    requirements: origins.map((o) => ({
      originId: o.id, key: `${key}-${o.issue.number}`, number: o.issue.number, title: o.issue.title, lifecycle: (o.issue.requirementInfo?.lifecycle ?? 'PROPOSED') as Lifecycle,
      stakeholder: o.stakeholder ? { key: shKey(o.stakeholder.number), name: o.stakeholder.name } : null, note: o.note,
    })),
    questionBank: QUESTION_BANK[s.technique as Technique] ?? [],
    canEdit: ctx.canEdit, canApprove: ctx.canApprove,
  };
}

/** Nối họp K-2: tạo cuộc họp loại Elicitation (mời người tham gia là thành viên) hoặc gắn cuộc họp đã có; null = bỏ gắn. */
export async function linkMeeting(userId: number, projectId: number, ref: number | string, input: { create?: boolean; meeting?: number | null }) {
  await edit(userId, projectId);
  const s = await sessionByRef(projectId, ref);
  let meetingId: number | null = null;
  if (input.create) {
    const { createMeeting } = await import('./meetings.service.js');
    const parts = await prisma.workElicitationParticipant.findMany({ where: { sessionId: s.id }, select: { stakeholder: { select: { userId: true } } } });
    const members = new Set((await prisma.workProjectMember.findMany({ where: { projectId }, select: { userId: true } })).map((m) => m.userId));
    const attendeeIds = [...new Set(parts.map((p) => p.stakeholder.userId).filter((x): x is number => !!x && members.has(x)))];
    const startsAt = s.scheduledAt && s.scheduledAt.getTime() > Date.now() - 7 * 864e5 ? s.scheduledAt : new Date(Math.ceil(Date.now() / 900_000) * 900_000);
    const endsAt = new Date(startsAt.getTime() + (s.durationMin ?? 60) * 60_000);
    const m = await createMeeting(userId, projectId, { title: `${elcKey(s.number)} ${s.title}`.slice(0, 255), type: 'ELICITATION', startsAt, endsAt, attendeeIds, location: s.location ?? undefined, sendInvites: false });
    meetingId = (await prisma.workMeeting.findFirstOrThrow({ where: { projectId, number: (m as { number: number }).number }, select: { id: true } })).id;
  } else if (input.meeting) {
    const m = await prisma.workMeeting.findFirst({ where: { projectId, number: input.meeting, deletedAt: null }, select: { id: true } });
    if (!m) throw new BadRequestError(`Meeting ${input.meeting} not found in this project`, 'WORK_BAD_MEETING');
    meetingId = m.id;
  }
  await prisma.workElicitationSession.update({ where: { id: s.id }, data: { meetingId, rev: { increment: 1 } } });
  touch(projectId, userId);
  return { meeting: await meetingRef(projectId, meetingId) };
}

// ─── AI đề xuất yêu cầu ──────────────────────────────────────────

type Ask = (system: string, user: string) => Promise<{ text: string; model: string | null }>;
let askOverride: ((system: string, user: string) => Promise<string>) | null = null;
/** CHỈ cho test: thay model (null = gọi thật). */
export function _setElicitationAskForTests(fn: ((system: string, user: string) => Promise<string>) | null): void { askOverride = fn; }

export async function askerFor(userId: number, isAgent: boolean, canUseAi: boolean): Promise<Ask> {
  if (askOverride) { const f = askOverride; return async (s, u) => ({ text: await f(s, u), model: 'test-model' }); }
  if (!isAgent && !canUseAi) throw new ForbiddenError('Using the AI assistant needs a member or admin role');
  const { checkTokenQuota, isAiAvailable, llmComplete } = await import('../interview/llm/index.js');
  if (!isAiAvailable('work')) throw new AppError('The AI assistant is temporarily unavailable. Please try again later.', 503, 'WORK_AI_UNAVAILABLE');
  if (!(await checkTokenQuota(userId))) throw new AppError('You have reached today’s AI usage limit.', 429, 'WORK_AI_TOKEN_CAP');
  if (!isAgent) {
    const { aiQuota } = await import('./ai.service.js');
    const q = await aiQuota(userId);
    if (q.limit !== null && (q.remaining ?? 0) <= 0) throw new AppError(`You have used all ${q.limit} free AI requests for today. Upgrade to Pro to keep using the AI assistant.`, 402, 'WORK_AI_QUOTA_EXCEEDED', { limit: q.limit, used: q.used, upgradeUrl: '/pro' });
  }
  // purpose `work_assistant` (sẵn có, không đụng gateway.ts) — đề xuất purpose riêng `work_elicitation` trong báo cáo.
  return async (system, user) => {
    const r = await llmComplete({ step: 'report', system, messages: [{ role: 'user', content: user }], maxTokens: 4000, userId, feature: 'work', purpose: 'work_assistant', timeoutMs: 120_000, maxRetries: 1 });
    return { text: r.text, model: r.model ?? null };
  };
}

async function transcriptOf(userId: number, projectId: number, meetingId: number | null): Promise<Array<{ text: string; who: string | null }>> {
  if (!meetingId) return [];
  const m = await prisma.workMeeting.findFirst({ where: { id: meetingId, projectId, deletedAt: null }, select: { number: true } });
  if (!m) return [];
  try {
    const { getTranscript } = await import('./meetingRec.service.js');
    const t = await getTranscript(userId, projectId, m.number);
    const who = new Map(t.speakers.map((u) => [u.id, displayName(u)]));
    return t.recordings.flatMap((r) => r.lines.map((l) => ({ text: l.text, who: l.speakerId ? who.get(l.speakerId) ?? null : null })));
  } catch {
    return []; // mô-đun họp tắt / không có quyền đọc họp ⇒ chỉ dùng ghi chú
  }
}

async function surveyLines(projectId: number, surveyId: number | null): Promise<Array<{ text: string }>> {
  if (!surveyId) return [];
  const s = await prisma.workSurvey.findFirst({ where: { id: surveyId, projectId }, select: { questions: true, responses: { select: { answers: true }, take: 500 } } });
  if (!s) return [];
  const qs = parseSurveyQuestions(s.questions);
  const out: Array<{ text: string }> = [];
  for (const q of summarizeSurvey(qs, s.responses)) {
    if (q.counts) out.push({ text: `Survey "${q.text}": ${q.counts.map((c) => `${c.option} ${c.n}`).join(', ')}` });
    else if (q.distribution) out.push({ text: `Survey "${q.text}": average ${q.average ?? '-'} of ${q.distribution.length}` });
    else if (q.yes !== undefined) out.push({ text: `Survey "${q.text}": yes ${q.yes}, no ${q.no ?? 0}` });
    else for (const a of (q.texts ?? []).slice(0, 60)) out.push({ text: `Survey "${q.text}" answer: ${a}` });
  }
  return out;
}

export async function proposeRequirements(userId: number, projectId: number, ref: number | string, input: { language?: 'vi' | 'en' } = {}) {
  const ctx = await edit(userId, projectId);
  const s = await sessionByRef(projectId, ref);
  const [p, transcript, survey, stakeholders, parts, existingReqs] = await Promise.all([
    projectInfo(projectId), transcriptOf(userId, projectId, s.meetingId), surveyLines(projectId, s.surveyId),
    prisma.workStakeholder.findMany({ where: { projectId }, select: { id: true, number: true, name: true, role: true } }),
    prisma.workElicitationParticipant.findMany({ where: { sessionId: s.id }, select: { stakeholderId: true } }),
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null, type: { key: 'REQUIREMENT' } }, select: { title: true }, take: 400 }),
  ]);
  const questions = normalizeQuestions(s.questions);
  // CTW đợt 8c (R28): transcript hỏi–đáp với stakeholder do AI đóng vai cũng là nguồn (dòng ghi "(AI-simulated)").
  const aiTurns = parseTurns(s.aiTranscript);
  const aiWho = aiTurns.length ? (await personaRef(projectId, s.aiPersonaId))?.name ?? 'Stakeholder' : '';
  const src = sourceLines({ transcript: [...transcript, ...turnsAsTranscript(aiTurns, aiWho), ...survey.map((x) => ({ text: x.text, who: null }))], questions, notes: s.notes, outcome: s.outcome });
  if (!src.lines.length) throw new BadRequestError('There is nothing to read yet — record the session (meeting), answer the questions or write notes first', 'WORK_ELC_NO_SOURCE');
  const pending = await prisma.workReqProposal.findMany({ where: { sessionId: s.id, status: { in: ['PENDING', 'ACCEPTED'] } }, select: { title: true } });
  const existing = [...existingReqs.map((r) => r.title), ...pending.map((x) => x.title)];
  const partIds = new Set(parts.map((x) => x.stakeholderId));
  const shList = stakeholders.filter((x) => partIds.size === 0 || partIds.has(x.id));
  const prompt = proposalsPrompt({
    language: input.language ?? 'en', title: s.title, technique: s.technique, objective: s.objective, systemName: p.name,
    stakeholders: shList.map((x) => ({ key: shKey(x.number), name: x.name, role: x.role })), lines: src.lines, truncated: src.truncated, existing,
  });
  const ask = await askerFor(userId, ctx.isAgent, can(ctx.access.role, 'ai.use', ctx.access.options, ctx.access.principal));
  const { extractJson } = await import('../interview/llm/index.js');
  let parsed: z.infer<typeof proposalsOut> | null = null;
  let model: string | null = null;
  let user = prompt.user;
  for (let attempt = 0; attempt < 2 && !parsed; attempt++) {
    const r = await ask(prompt.system, user);
    model = r.model;
    try {
      const v = proposalsOut.safeParse(extractJson(r.text));
      if (v.success) parsed = v.data;
    } catch { /* hỏi lại một lần */ }
    if (!parsed) user = `${prompt.user}\n\nYour previous answer was not valid JSON of the requested shape. Answer with the JSON object only.`;
  }
  if (!parsed) throw new AppError('The AI answer could not be read — try again', 422, 'WORK_AI_BAD_ANSWER');
  const { kept, dropped } = checkProposals(parsed, src.lines, stakeholders, existing);
  if (kept.length) {
    await prisma.workReqProposal.createMany({
      data: kept.map((k) => ({
        projectId, sessionId: s.id, title: k.title, text: k.text, reqType: k.reqType, priority: k.priority, stakeholderId: k.stakeholderId,
        evidence: k.evidence.map((e) => ({ line: e.line, quote: e.quote, text: src.lines.find((l) => l.n === e.line)?.text.slice(0, 400) ?? '' })) as unknown as Prisma.InputJsonValue,
        model: model?.slice(0, 80) ?? null, createdById: userId,
      })),
    });
  }
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'swr.elicitation.propose', targetType: 'elicitation', targetId: s.id, summary: `AI proposed ${kept.length} requirement(s) from ${elcKey(s.number)} (${dropped} dropped without evidence)` });
  return { added: kept.length, dropped, notes: parsed.notes ?? [], model, sources: { transcriptLines: transcript.length, surveyLines: survey.length, truncated: src.truncated }, session: await getSession(userId, projectId, s.number) };
}

/** Người tự thêm một đề xuất (vd từ ghi chú tay) — cùng luồng duyệt. */
export async function addProposal(userId: number, projectId: number, ref: number | string, input: { title: string; text?: string | null; reqType?: string; priority?: string | null; stakeholder?: number | string | null }) {
  await edit(userId, projectId);
  const s = await sessionByRef(projectId, ref);
  const sh = input.stakeholder ? await stakeholderByRef(projectId, input.stakeholder) : null;
  const p = await prisma.workReqProposal.create({
    data: { projectId, sessionId: s.id, title: input.title.trim().slice(0, 300), text: clean(input.text, 4000), reqType: input.reqType ?? 'FUNCTIONAL', priority: input.priority ?? null, stakeholderId: sh?.id ?? null, createdById: userId },
  });
  touch(projectId, userId);
  return { id: p.id };
}

export const decideInput = z.object({
  accept: z.boolean(),
  title: z.string().trim().min(3).max(300).optional(),
  text: z.string().max(4000).nullable().optional(),
  reqType: z.enum(REQ_TYPES).optional(),
  priority: z.enum(PRIORITY3).nullable().optional(),
  stakeholder: z.union([z.number().int().positive(), z.string().max(12)]).nullable().optional(),
  /** Nhận xong duyệt luôn (vòng đời Wiegers Proposed ⇒ Approved). */
  approve: z.boolean().optional(),
});

function proposalDoc(text: string | null, source: string, evidence: Array<{ line: number; quote: string }>) {
  const p = (t: string) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] });
  const content: unknown[] = [];
  if (text) for (const x of text.split(/\n{2,}/).map((y) => y.trim()).filter(Boolean)) content.push(p(x));
  content.push({ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Source' }] }, p(source));
  if (evidence.length) {
    content.push({ type: 'blockquote', content: evidence.map((e) => p(`“${e.quote}” (line ${e.line})`)) });
  }
  return { type: 'doc', content } as Prisma.InputJsonValue;
}

/** Nhận ⇒ thẻ REQUIREMENT (loại/ưu tiên/nguồn Wiegers) + nguồn gốc (phiên + stakeholder); bỏ ⇒ DISMISSED. Agent không quyết. */
export async function decideProposal(userId: number, projectId: number, ref: number | string, proposalId: number, input: z.infer<typeof decideInput>) {
  const ctx = await srsCtx(userId, projectId, 'view');
  if (ctx.isAgent) throw new ForbiddenError('An AI agent cannot accept or dismiss requirement proposals — a person reviews them');
  if (!ctx.canEdit) throw new ForbiddenError('You can read the requirements but not change them');
  const s = await sessionByRef(projectId, ref);
  const prop = await prisma.workReqProposal.findFirst({ where: { id: proposalId, sessionId: s.id } });
  if (!prop) throw new NotFoundError('Proposal not found');
  if (prop.status !== 'PENDING') throw new ConflictError(`This proposal was already ${prop.status === 'ACCEPTED' ? 'accepted' : 'dismissed'}`);
  if (!input.accept) {
    await prisma.workReqProposal.update({ where: { id: prop.id }, data: { status: 'DISMISSED', decidedById: userId, decidedAt: new Date() } });
    touch(projectId, userId);
    return { status: 'DISMISSED' as const, issue: null };
  }
  const shId = input.stakeholder !== undefined ? (input.stakeholder ? (await stakeholderByRef(projectId, input.stakeholder)).id : null) : prop.stakeholderId;
  const sh = shId ? await prisma.workStakeholder.findUnique({ where: { id: shId } }) : null;
  // Khoá lạc quan trước khi tạo thẻ: hai người bấm Nhận cùng lúc ⇒ một người thắng.
  const claim = await prisma.workReqProposal.updateMany({ where: { id: prop.id, status: 'PENDING' }, data: { status: 'ACCEPTED', decidedById: userId, decidedAt: new Date() } });
  if (!claim.count) throw new ConflictError('Someone else just decided this proposal — reload');
  try {
    const { typeIdFromKey } = await import('./issueRefs.js');
    const { createIssueAs } = await import('./issues.service.js');
    const { setRequirementInfo, setLifecycle } = await import('./swr.service.js');
    const typeId = await typeIdFromKey(projectId, 'REQUIREMENT');
    const source = sourceText(s, sh);
    const title = (input.title ?? prop.title).trim().slice(0, 255);
    const issue = await createIssueAs(userId, projectId, { typeId, title, descriptionJson: proposalDoc(input.text !== undefined ? clean(input.text, 4000) : prop.text, source, (Array.isArray(prop.evidence) ? prop.evidence : []) as Array<{ line: number; quote: string }>) });
    const reqType = input.reqType ?? ((REQ_TYPES as readonly string[]).includes(prop.reqType) ? prop.reqType as (typeof REQ_TYPES)[number] : 'FUNCTIONAL');
    await setRequirementInfo(userId, projectId, issue.number, { reqType, priority: input.priority !== undefined ? input.priority : (prop.priority as 'HIGH' | 'MEDIUM' | 'LOW' | null), source });
    await prisma.workRequirementOrigin.create({ data: { projectId, issueId: issue.id, sessionId: s.id, stakeholderId: shId, note: `From proposal #${prop.id}`, createdById: userId } });
    await prisma.workReqProposal.update({ where: { id: prop.id }, data: { issueId: issue.id, stakeholderId: shId } });
    if (input.approve) await setLifecycle(userId, projectId, issue.number, 'APPROVED', `Accepted from ${elcKey(s.number)}`);
    touch(projectId, userId);
    await auditProject(projectId, { actorId: userId, action: 'swr.elicitation.accept', targetType: 'issue', targetId: issue.id, summary: `Accepted a requirement from ${elcKey(s.number)}: ${title}`.slice(0, 300) });
    const { key } = await projectInfo(projectId);
    return { status: 'ACCEPTED' as const, issue: { number: issue.number, key: `${key}-${issue.number}` } };
  } catch (err) {
    await prisma.workReqProposal.updateMany({ where: { id: prop.id, issueId: null }, data: { status: 'PENDING', decidedById: null, decidedAt: null } });
    throw err;
  }
}

// ─── Truy vết nguồn ──────────────────────────────────────────────

export const originInput = z.object({
  issue: z.union([z.number().int().positive(), z.string().max(30)]),
  session: z.union([z.number().int().positive(), z.string().max(12)]).nullable().optional(),
  stakeholder: z.union([z.number().int().positive(), z.string().max(12)]).nullable().optional(),
  note: z.string().max(300).nullable().optional(),
});

export async function addOrigin(userId: number, projectId: number, input: z.infer<typeof originInput>) {
  await edit(userId, projectId);
  const { parseIssueRef } = await import('./issueRefs.js');
  const r = parseIssueRef(input.issue);
  const issue = r ? await prisma.workIssue.findFirst({ where: { projectId, number: r.number, deletedAt: null }, select: { id: true, number: true } }) : null;
  if (!issue) throw new BadRequestError(`Issue ${String(input.issue)} not found in this project`, 'WORK_BAD_ISSUE');
  const session = input.session ? await sessionByRef(projectId, input.session) : null;
  const sh = input.stakeholder ? await stakeholderByRef(projectId, input.stakeholder) : null;
  if (!session && !sh) throw new BadRequestError('Give a session (ELC-n) or a stakeholder (SH-n)', 'VALIDATION_ERROR');
  const dup = await prisma.workRequirementOrigin.findFirst({ where: { issueId: issue.id, sessionId: session?.id ?? null, stakeholderId: sh?.id ?? null }, select: { id: true } });
  if (dup) return { id: dup.id, duplicate: true };
  const o = await prisma.workRequirementOrigin.create({ data: { projectId, issueId: issue.id, sessionId: session?.id ?? null, stakeholderId: sh?.id ?? null, note: clean(input.note, 300), createdById: userId } });
  touch(projectId, userId);
  return { id: o.id, duplicate: false };
}

export async function removeOrigin(userId: number, projectId: number, id: number) {
  await edit(userId, projectId, { noAgent: 'An AI agent cannot remove traceability links' });
  const r = await prisma.workRequirementOrigin.deleteMany({ where: { id, projectId } });
  if (!r.count) throw new NotFoundError('Link not found');
  touch(projectId, userId);
  return { removed: true };
}

/** Ma trận yêu cầu ↔ phiên ↔ stakeholder (mọi thẻ REQUIREMENT; thẻ chưa có nguồn ghi rõ "no source"). */
export async function traceData(projectId: number) {
  const { key } = await projectInfo(projectId);
  const [reqs, origins] = await Promise.all([
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null, type: { key: 'REQUIREMENT' } }, orderBy: { number: 'asc' }, take: 2000, select: { id: true, number: true, title: true, requirementInfo: { select: { lifecycle: true, source: true, reqType: true } } } }),
    prisma.workRequirementOrigin.findMany({ where: { projectId }, include: { session: { select: { number: true, title: true, technique: true } }, stakeholder: { select: { number: true, name: true, role: true } } } }),
  ]);
  return reqs.map((r) => {
    const mine = origins.filter((o) => o.issueId === r.id);
    return {
      issueNumber: r.number, key: `${key}-${r.number}`, title: r.title, lifecycle: (r.requirementInfo?.lifecycle ?? 'PROPOSED') as Lifecycle, reqType: r.requirementInfo?.reqType ?? null,
      source: r.requirementInfo?.source ?? null,
      origins: mine.map((o) => ({ id: o.id, session: o.session ? { key: elcKey(o.session.number), title: o.session.title, technique: o.session.technique } : null, stakeholder: o.stakeholder ? { key: shKey(o.stakeholder.number), name: o.stakeholder.name, role: o.stakeholder.role } : null, note: o.note })),
    };
  });
}

export async function getTrace(userId: number, projectId: number) {
  const ctx = await view(userId, projectId);
  const rows = await traceData(projectId);
  return { rows, counts: { requirements: rows.length, traced: rows.filter((r) => r.origins.length).length, withSourceText: rows.filter((r) => r.origins.length || r.source).length }, canEdit: ctx.canEdit };
}

// ═══ R2 Khảo sát ═════════════════════════════════════════════════

export const surveyInput = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(8000).nullable().optional(),
  questions: z.array(surveyQuestion).min(1).max(50).optional(),
  collectName: z.boolean().optional(),
  closesAt: z.coerce.date().nullable().optional(),
  maxResponses: z.number().int().min(1).max(100_000).nullable().optional(),
  session: z.union([z.number().int().positive(), z.string().max(12)]).nullable().optional(),
});

async function surveyByRef(projectId: number, ref: unknown) {
  const m = /^\s*(?:SV\s*-?\s*)?(\d{1,6})\s*$/i.exec(String(ref ?? ''));
  const s = m ? await prisma.workSurvey.findFirst({ where: { projectId, number: Number(m[1]) } }) : null;
  if (!s) throw new NotFoundError(`Survey ${String(ref)} not found`);
  return s;
}

const publicPath = (token: string | null) => (token ? `/work/survey/${token}` : null);

function surveyView(s: Prisma.WorkSurveyGetPayload<object>, responses: number, sessionKey: string | null) {
  return {
    number: s.number, key: svKey(s.number), title: s.title, description: s.description, status: s.status, questions: parseSurveyQuestions(s.questions),
    collectName: s.collectName, closesAt: s.closesAt, maxResponses: s.maxResponses, responses, publicPath: s.status === 'OPEN' ? publicPath(s.token) : null,
    session: sessionKey, rev: s.rev, createdAt: s.createdAt, updatedAt: s.updatedAt,
  };
}

export async function listSurveys(userId: number, projectId: number) {
  const ctx = await view(userId, projectId);
  const rows = await prisma.workSurvey.findMany({ where: { projectId }, orderBy: { number: 'desc' }, include: { _count: { select: { responses: true } } } });
  const sess = new Map((await prisma.workElicitationSession.findMany({ where: { projectId, id: { in: rows.map((r) => r.sessionId).filter((x): x is number => !!x) } }, select: { id: true, number: true } })).map((x) => [x.id, elcKey(x.number)]));
  return { surveys: rows.map((s) => surveyView(s, s._count.responses, s.sessionId ? sess.get(s.sessionId) ?? null : null)), canEdit: ctx.canEdit, canPublish: ctx.canEdit && !ctx.isAgent };
}

export async function createSurvey(userId: number, projectId: number, input: z.infer<typeof surveyInput>) {
  await edit(userId, projectId);
  const q = normalizeSurveyQuestions(input.questions ?? [{ kind: 'LONG_TEXT', text: 'What is the biggest problem you want the new system to solve?', required: true }]);
  if (q.error) throw new BadRequestError(q.error, 'VALIDATION_ERROR');
  const session = input.session ? await sessionByRef(projectId, input.session) : null;
  const s = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(31073::int, ${projectId}::int)`;
    const agg = await tx.workSurvey.aggregate({ where: { projectId }, _max: { number: true } });
    const row = await tx.workSurvey.create({
      data: {
        projectId, number: (agg._max.number ?? 0) + 1, title: input.title.trim(), description: clean(input.description, 8000), questions: q.questions as unknown as Prisma.InputJsonValue,
        collectName: input.collectName ?? false, closesAt: input.closesAt ?? null, maxResponses: input.maxResponses ?? null, sessionId: session?.id ?? null, createdById: userId,
      },
    });
    if (session) await tx.workElicitationSession.update({ where: { id: session.id }, data: { surveyId: row.id } });
    return row;
  });
  touch(projectId, userId);
  return surveyView(s, 0, session ? elcKey(session.number) : null);
}

export async function updateSurvey(userId: number, projectId: number, ref: number | string, input: Partial<z.infer<typeof surveyInput>> & { rev?: number }) {
  await edit(userId, projectId);
  const cur = await surveyByRef(projectId, ref);
  const responses = await prisma.workSurveyResponse.count({ where: { surveyId: cur.id } });
  let questions: Prisma.InputJsonValue | undefined;
  if (input.questions) {
    const q = normalizeSurveyQuestions(input.questions);
    if (q.error) throw new BadRequestError(q.error, 'VALIDATION_ERROR');
    if (responses) {
      // Đã có người trả lời ⇒ không đổi id/loại câu hỏi cũ (chỉ sửa chữ, thêm câu) — kết quả cũ vẫn đọc được.
      const old = parseSurveyQuestions(cur.questions);
      for (const o of old) {
        const n = q.questions.find((x) => x.id === o.id);
        if (!n || n.kind !== o.kind) throw new AppError('This survey already has responses — you can reword or add questions, but not remove them or change their type', 409, 'WORK_SURVEY_LOCKED');
      }
    }
    questions = q.questions as unknown as Prisma.InputJsonValue;
  }
  const session = input.session !== undefined ? (input.session ? await sessionByRef(projectId, input.session) : null) : undefined;
  const r = await prisma.workSurvey.updateMany({
    where: { id: cur.id, ...(input.rev !== undefined ? { rev: input.rev } : {}) },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}), ...(input.description !== undefined ? { description: clean(input.description, 8000) } : {}),
      ...(questions ? { questions } : {}), ...(input.collectName !== undefined ? { collectName: input.collectName } : {}),
      ...(input.closesAt !== undefined ? { closesAt: input.closesAt } : {}), ...(input.maxResponses !== undefined ? { maxResponses: input.maxResponses } : {}),
      ...(session !== undefined ? { sessionId: session?.id ?? null } : {}), rev: { increment: 1 },
    },
  });
  if (!r.count) throw new ConflictError('Someone else changed this survey — reload to see their version');
  if (session) await prisma.workElicitationSession.update({ where: { id: session.id }, data: { surveyId: cur.id } });
  touch(projectId, userId);
  return getSurvey(userId, projectId, cur.number);
}

/** Mở link công khai (tạo token nếu chưa có) / đóng. Đối ngoại ⇒ chỉ người. */
export async function setSurveyStatus(userId: number, projectId: number, ref: number | string, status: 'OPEN' | 'CLOSED' | 'DRAFT') {
  await edit(userId, projectId, { noAgent: 'An AI agent cannot publish or close a public survey — a person does' });
  const cur = await surveyByRef(projectId, ref);
  const token = status === 'OPEN' ? cur.token ?? crypto.randomBytes(18).toString('base64url') : cur.token;
  await prisma.workSurvey.update({ where: { id: cur.id }, data: { status, token, rev: { increment: 1 } } });
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: `swr.survey.${status.toLowerCase()}`, targetType: 'survey', targetId: cur.id, summary: `${status === 'OPEN' ? 'Opened' : status === 'CLOSED' ? 'Closed' : 'Moved back to draft'} ${svKey(cur.number)} ${cur.title}`.slice(0, 300) });
  return getSurvey(userId, projectId, cur.number);
}

/** Đổi link (link cũ chết ngay) — khi link lỡ gửi nhầm chỗ. */
export async function rotateSurveyLink(userId: number, projectId: number, ref: number | string) {
  await edit(userId, projectId, { noAgent: 'An AI agent cannot change a public survey link' });
  const cur = await surveyByRef(projectId, ref);
  await prisma.workSurvey.update({ where: { id: cur.id }, data: { token: crypto.randomBytes(18).toString('base64url'), rev: { increment: 1 } } });
  touch(projectId, userId);
  return getSurvey(userId, projectId, cur.number);
}

export async function deleteSurvey(userId: number, projectId: number, ref: number | string) {
  await edit(userId, projectId, { noAgent: 'An AI agent cannot delete surveys' });
  const cur = await surveyByRef(projectId, ref);
  await prisma.$transaction([
    prisma.workElicitationSession.updateMany({ where: { projectId, surveyId: cur.id }, data: { surveyId: null } }),
    prisma.workSurvey.delete({ where: { id: cur.id } }),
  ]);
  touch(projectId, userId);
  return { deleted: true };
}

export async function getSurvey(userId: number, projectId: number, ref: number | string) {
  const ctx = await view(userId, projectId);
  const s = await surveyByRef(projectId, ref);
  const responses = await prisma.workSurveyResponse.findMany({ where: { surveyId: s.id }, orderBy: { createdAt: 'asc' }, take: 5000, select: { id: true, answers: true, respondentName: true, createdAt: true } });
  const session = s.sessionId ? await prisma.workElicitationSession.findUnique({ where: { id: s.sessionId }, select: { number: true } }) : null;
  const qs = parseSurveyQuestions(s.questions);
  return {
    ...surveyView(s, responses.length, session ? elcKey(session.number) : null),
    summary: summarizeSurvey(qs, responses),
    recent: responses.slice(-50).reverse().map((r) => ({ id: r.id, at: r.createdAt, name: r.respondentName, answers: r.answers })),
    canEdit: ctx.canEdit, canPublish: ctx.canEdit && !ctx.isAgent,
  };
}

export async function exportSurvey(userId: number, projectId: number, ref: number | string) {
  await view(userId, projectId);
  const s = await surveyByRef(projectId, ref);
  const p = await projectInfo(projectId);
  const responses = await prisma.workSurveyResponse.findMany({ where: { surveyId: s.id }, orderBy: { createdAt: 'asc' }, take: 20_000, select: { answers: true, respondentName: true, createdAt: true } });
  const buffer = writeXlsx(surveySheets({ key: svKey(s.number), title: s.title, collectName: s.collectName }, parseSurveyQuestions(s.questions), responses, p.name), { title: `${svKey(s.number)} ${s.title}`, creator: 'CT Work' });
  return { buffer, file: `${p.key}_${svKey(s.number)}_${fileName(s.title)}.xlsx` };
}

// ─── Khảo sát công khai (không đăng nhập) ────────────────────────

const closedReason = (s: { status: string; closesAt: Date | null; maxResponses: number | null }, n: number): string | null =>
  s.status !== 'OPEN' ? 'CLOSED' : s.closesAt && s.closesAt.getTime() < Date.now() ? 'EXPIRED' : s.maxResponses && n >= s.maxResponses ? 'FULL' : null;

async function openSurvey(token: string) {
  if (!/^[A-Za-z0-9_-]{16,48}$/.test(token)) throw new NotFoundError('Survey not found');
  const s = await prisma.workSurvey.findUnique({ where: { token }, include: { project: { select: { name: true, deletedAt: true } }, _count: { select: { responses: true } } } });
  // Nháp (chưa mở) ⇒ 404 như không tồn tại; đã đóng ⇒ vẫn trả tiêu đề + lý do (người mở link biết vì sao).
  if (!s || s.project.deletedAt || s.status === 'DRAFT') throw new NotFoundError('Survey not found');
  return s;
}

export async function publicSurvey(token: string) {
  const s = await openSurvey(token);
  const closed = closedReason(s, s._count.responses);
  return { title: s.title, description: s.description, project: s.project.name, collectName: s.collectName, questions: closed ? [] : parseSurveyQuestions(s.questions), closed };
}

export async function submitPublicSurvey(token: string, body: { answers?: unknown; name?: unknown }, ip: string) {
  const s = await openSurvey(token);
  const closed = closedReason(s, s._count.responses);
  if (closed) throw new AppError('This survey is no longer accepting answers', 410, 'WORK_SURVEY_CLOSED', { reason: closed });
  const qs = parseSurveyQuestions(s.questions);
  const v = validateAnswers(qs, body.answers);
  if (v.errors.length) throw new AppError('Some answers are missing or invalid', 400, 'WORK_SURVEY_INVALID', { errors: v.errors });
  if (!Object.keys(v.answers).length) throw new AppError('Answer at least one question', 400, 'WORK_SURVEY_INVALID', { errors: [] });
  const ipHash = crypto.createHash('sha256').update(`${ip}|${config.jwtSecret}|ctw-survey`).digest('hex');
  const name = s.collectName && typeof body.name === 'string' ? clean(body.name, 120) : null;
  await prisma.workSurveyResponse.create({ data: { surveyId: s.id, answers: v.answers as unknown as Prisma.InputJsonValue, respondentName: name, ipHash } });
  emitWorkEvent({ type: 'project.updated', projectId: s.projectId, actor: { kind: 'SYSTEM', userId: null } });
  return { ok: true };
}

// ═══ Báo cáo elicitation (.docx / .pdf) ══════════════════════════

export async function reportData(projectId: number): Promise<ReportData> {
  const p = await projectInfo(projectId);
  const [stakeholders, raci, sessions, surveys, trace] = await Promise.all([
    loadStakeholders(projectId),
    prisma.workRaciActivity.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], include: { cells: true } }),
    prisma.workElicitationSession.findMany({
      where: { projectId }, orderBy: { number: 'asc' },
      include: {
        participants: { include: { stakeholder: { select: { number: true, name: true, role: true } } } },
        origins: { where: { issue: { deletedAt: null } }, include: { issue: { select: { number: true, title: true, requirementInfo: { select: { lifecycle: true } } } }, stakeholder: { select: { name: true } } } },
        proposals: { where: { status: 'PENDING' }, select: { id: true } },
      },
    }),
    prisma.workSurvey.findMany({ where: { projectId, status: { not: 'DRAFT' } }, orderBy: { number: 'asc' }, include: { responses: { select: { answers: true }, take: 5000 } } }),
    traceData(projectId),
  ]);
  const meetings = new Map((await prisma.workMeeting.findMany({ where: { projectId, id: { in: sessions.map((s) => s.meetingId).filter((x): x is number => !!x) } }, select: { id: true, number: true, title: true, deletedAt: true } })).filter((m) => !m.deletedAt).map((m) => [m.id, `Meeting #${m.number} ${m.title}`]));
  const svName = new Map(surveys.map((s) => [s.id, `${svKey(s.number)} ${s.title}`]));
  const shRows = stakeholders.filter((s) => raci.some((a) => a.cells.some((c) => c.stakeholderId === s.id)));
  const fmt = (d: Date | null) => (d ? `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}` : '');
  return {
    projectName: p.name, generatedAt: new Date(), stakeholders,
    raci: { activities: raci.map((a) => a.name), rows: shRows.map((s) => ({ name: shLabel(s), roles: raci.map((a) => a.cells.find((c) => c.stakeholderId === s.id)?.role ?? '') })) },
    sessions: sessions.map((s) => ({
      key: elcKey(s.number), title: s.title, technique: s.technique, status: s.status, when: fmt(s.scheduledAt), duration: s.durationMin, location: s.location,
      objective: s.objective, plan: s.plan, aiSimulated: s.aiSimulated,
      participants: s.participants.map((x) => ({ key: shKey(x.stakeholder.number), name: x.stakeholder.name, role: x.stakeholder.role, rolePlayed: x.rolePlayed })),
      questions: normalizeQuestions(s.questions) as SessionQuestion[], notes: s.notes, outcome: s.outcome,
      meeting: s.meetingId ? meetings.get(s.meetingId) ?? null : null, survey: s.surveyId ? svName.get(s.surveyId) ?? null : null,
      requirements: s.origins.map((o) => ({ key: `${p.key}-${o.issue.number}`, title: o.issue.title, status: LIFECYCLE_LABEL[(o.issue.requirementInfo?.lifecycle ?? 'PROPOSED') as Lifecycle], stakeholder: o.stakeholder?.name ?? null })),
      pending: s.proposals.length,
    })),
    surveys: surveys.map((s) => ({ key: svKey(s.number), title: s.title, status: s.status, responses: s.responses.length, summary: summarizeSurvey(parseSurveyQuestions(s.questions), s.responses) })),
    trace: trace.filter((r) => r.origins.length).map((r) => ({
      requirement: r.key, title: r.title,
      sessions: [...new Set(r.origins.map((o) => o.session?.key).filter(Boolean))].join(', '),
      stakeholders: [...new Set(r.origins.map((o) => o.stakeholder?.name).filter(Boolean))].join(', '),
    })),
  };
}

export async function exportReport(userId: number, projectId: number, format: 'docx' | 'pdf') {
  await view(userId, projectId);
  const p = await projectInfo(projectId);
  const doc = elicitationReportDoc(await reportData(projectId));
  const meta: ExportMeta = { title: `Requirements Elicitation Report — ${p.name}`, projectName: p.name, projectKey: p.key, docLabel: 'SWR302', version: null, date: new Date(), capstone: false };
  const opts = { stripGuides: true, toc: true, cover: true, resolveImage: async () => null };
  const buffer = format === 'docx' ? await renderDocx(doc, meta, opts) : await renderPdf(doc, meta, opts);
  await auditProject(projectId, { actorId: userId, action: 'swr.elicitation.export', targetType: 'project', targetId: projectId, summary: `Exported the elicitation report (${format})` });
  return { buffer, file: `${p.key}_Elicitation_Report.${format}` };
}

// ═══ CTW đợt 8c — R28 STAKEHOLDER DO AI ĐÓNG VAI ════════════════════
//
// Đề SWR302 cho phép "AI-assisted inquiry" nếu GIỮ transcript làm bằng chứng nguồn. Người phân tích hỏi, AI trả lời trong
// vai một stakeholder ĐÃ CÓ trong sổ (R3: vai, giá trị, mối quan tâm, ràng buộc, thái độ). Transcript lưu ngay trong phiên
// elicitation (`ai_transcript`), phiên được đánh dấu AI-simulated, và "AI đề xuất yêu cầu" đọc transcript đó như mọi nguồn
// khác — mỗi yêu cầu phải trích dòng có thật. Agent ngoài (MCP) không dùng tuyến này (không tiêu lượt AI của web).

async function personaRef(projectId: number, id: number | null) {
  if (!id) return null;
  const sh = await prisma.workStakeholder.findFirst({ where: { id, projectId }, select: { number: true, name: true, role: true } });
  return sh ? { key: shKey(sh.number), name: sh.name, role: sh.role } : null;
}

export const stakeholderAskInput = z.object({
  stakeholder: z.union([z.number().int().positive(), z.string().min(1).max(12)]).nullable().optional(),
  question: z.string().trim().min(1).max(2000),
  language: z.enum(['vi', 'en']).optional(),
});

export async function askStakeholder(userId: number, projectId: number, ref: number | string, input: z.infer<typeof stakeholderAskInput>) {
  const ctx = await edit(userId, projectId, { noAgent: 'An AI agent cannot run the simulated stakeholder interview — a person interviews' });
  const s = await sessionByRef(projectId, ref);
  // Vai: stakeholder gửi kèm ⇒ đổi vai (chỉ khi transcript còn trống, tránh một nhân vật "đổi người" giữa chừng).
  let personaId = s.aiPersonaId;
  const turns = parseTurns(s.aiTranscript);
  if (input.stakeholder !== undefined && input.stakeholder !== null) {
    const n = shNumber(input.stakeholder);
    const sh = n ? await prisma.workStakeholder.findFirst({ where: { projectId, number: n }, select: { id: true } }) : null;
    if (!sh) throw new BadRequestError(`Stakeholder ${String(input.stakeholder)} not found — add them to the register first`, 'WORK_BAD_STAKEHOLDER');
    if (turns.length && personaId && sh.id !== personaId) throw new ConflictError('This interview already has a stakeholder — clear the transcript to talk to someone else');
    personaId = sh.id;
  }
  if (!personaId) {
    const first = await prisma.workElicitationParticipant.findFirst({ where: { sessionId: s.id }, orderBy: { stakeholderId: 'asc' }, select: { stakeholderId: true } });
    personaId = first?.stakeholderId ?? null;
  }
  if (!personaId) throw new BadRequestError('Pick the stakeholder the AI should play (from the stakeholder register)', 'WORK_ELC_NO_PERSONA');
  if (turns.length >= AI_TURNS_MAX - 1) throw new BadRequestError(`This interview reached ${AI_TURNS_MAX / 2} questions — start another session for more`, 'WORK_LIMIT');
  const persona = await prisma.workStakeholder.findFirstOrThrow({ where: { id: personaId, projectId } });
  const p = await projectInfo(projectId);
  const prompt = stakeholderPrompt({
    persona: { name: persona.name, role: persona.role, organization: persona.organization, userClass: persona.userClass, attitude: persona.attitude, majorValue: persona.majorValue, interests: persona.interests, constraints: persona.constraints, decisionRights: persona.decisionRights, notes: persona.notes },
    systemName: p.name, objective: s.objective, language: input.language ?? 'en', turns, question: input.question,
  });
  let answer: string;
  if (askOverride) {
    answer = await askOverride(prompt.system, prompt.messages.map((m) => `${m.role}: ${m.content}`).join('\n'));
  } else {
    // Cùng cổng quota/AI của "AI đề xuất yêu cầu" (askerFor ném lỗi nếu hết lượt / không có quyền AI).
    await askerFor(userId, ctx.isAgent, can(ctx.access.role, 'ai.use', ctx.access.options, ctx.access.principal));
    const { llmComplete } = await import('../interview/llm/index.js');
    const r = await llmComplete({ step: 'report', system: prompt.system, messages: prompt.messages, maxTokens: 600, userId, feature: 'work', purpose: 'work_assistant', timeoutMs: 60_000, maxRetries: 1 });
    answer = r.text;
  }
  answer = String(answer ?? '').trim().slice(0, 4000) || '…';
  const now = new Date().toISOString();
  const next: AiTurn[] = [...turns, { role: 'analyst', text: input.question.trim(), at: now }, { role: 'stakeholder', text: answer, at: now }];
  await prisma.workElicitationSession.update({ where: { id: s.id }, data: { aiTranscript: next as unknown as Prisma.InputJsonValue, aiPersonaId: personaId, aiSimulated: true, rev: { increment: 1 } } });
  touch(projectId, userId);
  return { turns: next, persona: await personaRef(projectId, personaId), answer };
}

export async function clearStakeholderTranscript(userId: number, projectId: number, ref: number | string) {
  await edit(userId, projectId, { noAgent: 'An AI agent cannot change the simulated stakeholder interview' });
  const s = await sessionByRef(projectId, ref);
  await prisma.workElicitationSession.update({ where: { id: s.id }, data: { aiTranscript: [], aiPersonaId: null, rev: { increment: 1 } } });
  await auditProject(projectId, { actorId: userId, action: 'swr.elicitation.ai_clear', targetType: 'elicitation', targetId: s.id, summary: `Cleared the AI-simulated stakeholder transcript of ${elcKey(s.number)}` });
  touch(projectId, userId);
  return { cleared: true };
}
