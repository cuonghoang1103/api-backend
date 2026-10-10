/**
 * CT Work đợt 7a (11/10/2026) — OKR cấp KHÔNG GIAN và cấp DỰ ÁN (C7).
 *
 *   Chu kỳ (quý) thuộc không gian ⇒ Objective (cấp không gian: projectId null, hoặc cấp dự án; căn chỉnh qua parentId)
 *   ⇒ Key result có số đo (PERCENT/NUMBER/BOOLEAN, bắt đầu → mục tiêu, hiện tại) ⇒ tiến độ nhập tay (check-in) HOẶC tự
 *   tính từ thẻ/epic/sprint liên kết (ISSUES: thẻ xong/tổng, POINTS: điểm xong/tổng) ⇒ check-in hằng tuần có độ tự tin
 *   ⇒ chấm điểm cuối kỳ 0–1 (đóng chu kỳ tự chấm KR còn trống bằng tiến độ cuối).
 *
 * Quyền:
 *   · Objective dự án — xem: đội dự án (không khách); sửa: ADMIN/MEMBER (người); check-in: thêm người phụ trách KR.
 *   · Objective không gian — xem: thành viên không gian trừ GUEST; sửa: OWNER/ADMIN không gian hoặc người phụ trách
 *     objective; check-in: thêm người phụ trách KR.
 *   · Chu kỳ — tạo: ai tạo được dự án (OWNER/ADMIN/MEMBER); đóng/mở/xoá: OWNER/ADMIN hoặc người tạo.
 *   · AI agent: chỉ đọc.
 * Luật số (tiến độ, trạng thái, điểm) ở agileRules.ts.
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { emitAgile, usersById } from './agileCommon.js';
import {
  cycleElapsed, krProgress, KR_LINK_KINDS, KR_METRICS, KR_SOURCES, linkedProgress, objectiveProgress, objectiveScore, okrStatus,
  scoreBand, suggestedScore, weekStartVN, type KrMetric, type LinkedIssue, type OkrStatus,
} from './agileRules.js';
import { auditProject, audit } from './audit.js';
import type { PublicUser } from './common.js';
import { isClientScoped, loadProjectAccess, loadWorkspaceAccess } from './permissions.js';

// ─── Đầu vào ─────────────────────────────────────────────────────

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
export const cycleInput = z.object({ name: z.string().trim().min(1).max(80), startDate: day, endDate: day });
export const cyclePatch = z.object({ name: z.string().trim().min(1).max(80).optional(), startDate: day.optional(), endDate: day.optional(), status: z.enum(['ACTIVE', 'CLOSED']).optional() });
const krBase = {
  title: z.string().trim().min(1).max(200),
  metric: z.enum(KR_METRICS).default('NUMBER'),
  unit: z.string().trim().max(16).nullable().optional(),
  startValue: z.number().finite().default(0),
  targetValue: z.number().finite().default(100),
  currentValue: z.number().finite().optional(),
  source: z.enum(KR_SOURCES).default('MANUAL'),
  ownerId: z.number().int().positive().nullable().optional(),
};
export const krInput = z.object(krBase);
export const krPatch = z.object({
  title: krBase.title.optional(), metric: z.enum(KR_METRICS).optional(), unit: krBase.unit, startValue: z.number().finite().optional(),
  targetValue: z.number().finite().optional(), source: z.enum(KR_SOURCES).optional(), ownerId: krBase.ownerId, position: z.number().int().min(0).max(1000).optional(),
});
export const objectiveInput = z.object({
  cycleId: z.number().int().positive(),
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).nullable().optional(),
  ownerId: z.number().int().positive().nullable().optional(),
  parentId: z.number().int().positive().nullable().optional(),
  keyResults: z.array(krInput).max(10).optional(),
});
export const objectivePatch = z.object({
  title: z.string().trim().min(1).max(200).optional(), description: z.string().max(5000).nullable().optional(),
  ownerId: z.number().int().positive().nullable().optional(), parentId: z.number().int().positive().nullable().optional(),
  position: z.number().int().min(0).max(1000).optional(),
});
export const linkInput = z.object({
  links: z.array(z.object({
    kind: z.enum(KR_LINK_KINDS),
    projectId: z.number().int().positive().optional(),
    number: z.number().int().positive().optional(),
    sprintId: z.number().int().positive().optional(),
  })).max(50),
});
export const checkinInput = z.object({ value: z.number().finite().optional(), confidence: z.number().int().min(0).max(10), note: z.string().max(2000).nullable().optional() });
export const scoreInput = z.object({
  krScores: z.array(z.object({ id: z.number().int().positive(), score: z.number().min(0).max(1) })).max(10),
  score: z.number().min(0).max(1).nullable().optional(),
  note: z.string().max(1000).nullable().optional(),
});

// ─── Quyền ───────────────────────────────────────────────────────

async function canSeeProject(userId: number, projectId: number) {
  const a = await loadProjectAccess(userId, projectId);
  if (!a || a.role === 'CLIENT' || isClientScoped(a)) return null;
  return a;
}

async function wsMember(userId: number, workspaceId: number) {
  const a = await loadWorkspaceAccess(userId, workspaceId);
  if (!a || a.role === 'GUEST') throw new NotFoundError('Workspace not found');
  return a;
}

type ObjRow = { id: number; cycleId: number; projectId: number | null; ownerId: number | null; cycle: { workspaceId: number; status: string } };

/** Quyền trên một objective: view / edit (sửa objective + KR) — 404 nếu không thấy. */
async function objectiveRights(userId: number, o: ObjRow): Promise<{ edit: boolean; human: boolean; projectId: number | null; workspaceId: number }> {
  if (o.projectId) {
    const a = await canSeeProject(userId, o.projectId);
    if (!a) throw new NotFoundError('Objective not found');
    const human = a.principal === 'HUMAN';
    return { edit: human && (a.role === 'ADMIN' || a.role === 'MEMBER'), human, projectId: o.projectId, workspaceId: a.workspaceId };
  }
  const w = await loadWorkspaceAccess(userId, o.cycle.workspaceId);
  if (!w || w.role === 'GUEST') throw new NotFoundError('Objective not found');
  const human = w.principal === 'HUMAN';
  return { edit: human && (w.role === 'OWNER' || w.role === 'ADMIN' || o.ownerId === userId), human, projectId: null, workspaceId: o.cycle.workspaceId };
}

const OBJ_HEAD = { id: true, cycleId: true, projectId: true, ownerId: true, cycle: { select: { workspaceId: true, status: true } } } as const;

async function loadObjective(userId: number, id: number, needEdit: boolean) {
  const o = await prisma.workObjective.findUnique({ where: { id }, select: OBJ_HEAD });
  if (!o) throw new NotFoundError('Objective not found');
  const r = await objectiveRights(userId, o);
  if (needEdit) {
    if (!r.human) throw new ForbiddenError('AI agents can read OKRs but cannot change them');
    if (!r.edit) throw new ForbiddenError('You cannot edit this objective');
  }
  return { o, r };
}

async function loadKr(userId: number, krId: number) {
  const kr = await prisma.workKeyResult.findUnique({ where: { id: krId }, select: { id: true, objectiveId: true, ownerId: true, metric: true, startValue: true, targetValue: true, currentValue: true, source: true } });
  if (!kr) throw new NotFoundError('Key result not found');
  const { o, r } = await loadObjective(userId, kr.objectiveId, false);
  return { kr, o, r };
}

function assertOpen(o: { cycle: { status: string } }) {
  if (o.cycle.status === 'CLOSED') throw new BadRequestError('This OKR cycle is closed — reopen it to make changes', 'WORK_OKR_CYCLE_CLOSED');
}

/** Người phụ trách phải vào được nơi chứa objective (dự án / không gian). */
async function assertOwner(ownerId: number | null | undefined, projectId: number | null, workspaceId: number) {
  if (!ownerId) return;
  if (projectId) {
    const a = await loadProjectAccess(ownerId, projectId);
    if (!a || a.role === 'CLIENT') throw new BadRequestError('The owner must be a member of this project', 'WORK_OKR_BAD_OWNER');
  } else {
    const w = await loadWorkspaceAccess(ownerId, workspaceId);
    if (!w || w.role === 'GUEST') throw new BadRequestError('The owner must be a member of this workspace', 'WORK_OKR_BAD_OWNER');
  }
}

async function emitFor(projectId: number | null, id: number, action: string) {
  if (projectId) emitAgile(projectId, 'okr', id, action);
}

// ─── Chu kỳ ──────────────────────────────────────────────────────

const toDate = (s: string) => new Date(`${s}T00:00:00.000Z`);
const ymd = (d: Date) => d.toISOString().slice(0, 10);

export async function listCycles(userId: number, workspaceId: number) {
  await wsMember(userId, workspaceId);
  const rows = await prisma.workOkrCycle.findMany({ where: { workspaceId }, orderBy: [{ startDate: 'desc' }, { id: 'desc' }], select: { id: true, name: true, startDate: true, endDate: true, status: true, createdById: true, _count: { select: { objectives: true } } } });
  return rows.map((c) => ({ id: c.id, name: c.name, startDate: ymd(c.startDate), endDate: ymd(c.endDate), status: c.status, createdById: c.createdById, objectives: c._count.objectives }));
}

export async function createCycle(userId: number, workspaceId: number, input: z.infer<typeof cycleInput>) {
  const w = await wsMember(userId, workspaceId);
  if (w.principal === 'AGENT') throw new ForbiddenError('AI agents can read OKRs but cannot change them');
  if (input.endDate < input.startDate) throw new BadRequestError('The cycle must end after it starts', 'WORK_OKR_BAD_DATES');
  const c = await prisma.workOkrCycle.create({ data: { workspaceId, name: input.name, startDate: toDate(input.startDate), endDate: toDate(input.endDate), createdById: userId } });
  await audit({ workspaceId, actorId: userId, action: 'okr.cycle.create', targetType: 'okr_cycle', targetId: c.id, summary: `Created OKR cycle "${c.name}"` });
  return { id: c.id };
}

async function cycleForManage(userId: number, workspaceId: number, cycleId: number) {
  const w = await wsMember(userId, workspaceId);
  const c = await prisma.workOkrCycle.findFirst({ where: { id: cycleId, workspaceId } });
  if (!c) throw new NotFoundError('OKR cycle not found');
  if (w.principal === 'AGENT' || !(w.role === 'OWNER' || w.role === 'ADMIN' || c.createdById === userId)) {
    throw new ForbiddenError('Only workspace admins or the person who created this cycle can manage it');
  }
  return c;
}

export async function updateCycle(userId: number, workspaceId: number, cycleId: number, input: z.infer<typeof cyclePatch>) {
  const c = await cycleForManage(userId, workspaceId, cycleId);
  const start = input.startDate ?? ymd(c.startDate);
  const end = input.endDate ?? ymd(c.endDate);
  if (end < start) throw new BadRequestError('The cycle must end after it starts', 'WORK_OKR_BAD_DATES');
  let autoScored = 0;
  if (input.status === 'CLOSED' && c.status !== 'CLOSED') autoScored = await autoScoreCycle(c.id);
  await prisma.workOkrCycle.update({
    where: { id: c.id },
    data: {
      name: input.name, startDate: input.startDate ? toDate(input.startDate) : undefined, endDate: input.endDate ? toDate(input.endDate) : undefined,
      status: input.status, closedAt: input.status === 'CLOSED' ? new Date() : input.status === 'ACTIVE' ? null : undefined,
    },
  });
  if (input.status && input.status !== c.status) {
    await audit({ workspaceId, actorId: userId, action: `okr.cycle.${input.status === 'CLOSED' ? 'close' : 'reopen'}`, targetType: 'okr_cycle', targetId: c.id, summary: `${input.status === 'CLOSED' ? 'Closed' : 'Reopened'} OKR cycle "${c.name}"` });
  }
  return { ok: true, autoScored };
}

export async function deleteCycle(userId: number, workspaceId: number, cycleId: number) {
  const c = await cycleForManage(userId, workspaceId, cycleId);
  const n = await prisma.workObjective.count({ where: { cycleId: c.id } });
  if (n) throw new BadRequestError('Delete or move the objectives in this cycle first', 'WORK_OKR_CYCLE_NOT_EMPTY');
  await prisma.workOkrCycle.delete({ where: { id: c.id } });
  return { ok: true };
}

/** Đóng chu kỳ: KR chưa chấm ⇒ điểm gợi ý (tiến độ cuối, làm tròn 0.1); objective chưa chấm ⇒ trung bình KR. */
async function autoScoreCycle(cycleId: number): Promise<number> {
  const objs = await prisma.workObjective.findMany({ where: { cycleId }, select: { id: true, score: true } });
  const computed = await computeObjectives(objs.map((o) => o.id), new Date());
  let n = 0;
  for (const o of computed) {
    for (const kr of o.krs) {
      if (kr.score === null) { await prisma.workKeyResult.update({ where: { id: kr.id }, data: { score: kr.suggestedScore } }); n++; }
    }
    if (o.score === null) {
      const s = objectiveScore(o.krs.map((k) => (k.score ?? k.suggestedScore)));
      await prisma.workObjective.update({ where: { id: o.id }, data: { score: s ?? 0, scoredAt: new Date() } });
    }
  }
  return n;
}

// ─── Tính tiến độ ────────────────────────────────────────────────

const KR_SELECT = {
  id: true, objectiveId: true, title: true, metric: true, unit: true, startValue: true, targetValue: true, currentValue: true, source: true,
  ownerId: true, position: true, score: true,
  links: { select: { id: true, kind: true, issueId: true, sprintId: true } },
  checkins: { orderBy: { weekStart: 'desc' as const }, take: 26, select: { id: true, userId: true, weekStart: true, value: true, progress: true, confidence: true, note: true, updatedAt: true } },
} satisfies Prisma.WorkKeyResultSelect;
type KrRow = Prisma.WorkKeyResultGetPayload<{ select: typeof KR_SELECT }>;

interface IssueLite { id: number; projectId: number; number: number; title: string; parentId: number | null; sprintId: number | null; storyPoints: number | null; done: boolean; projectKey: string }

/** Thẻ liên kết của nhiều KR — một lượt truy vấn. */
async function linkedIssues(krs: KrRow[]): Promise<{ byKr: Map<number, IssueLite[]>; issues: Map<number, IssueLite>; sprints: Map<number, { id: number; name: string; projectId: number }> }> {
  const issueIds = new Set<number>();
  const epicIds = new Set<number>();
  const sprintIds = new Set<number>();
  for (const k of krs) for (const l of k.links) {
    if (l.kind === 'SPRINT' && l.sprintId) sprintIds.add(l.sprintId);
    else if (l.issueId) { issueIds.add(l.issueId); if (l.kind === 'EPIC') epicIds.add(l.issueId); }
  }
  const or: Prisma.WorkIssueWhereInput[] = [];
  if (issueIds.size) or.push({ id: { in: [...issueIds] } });
  if (epicIds.size) or.push({ parentId: { in: [...epicIds] } });
  if (sprintIds.size) or.push({ sprintId: { in: [...sprintIds] } });
  const rows = or.length ? await prisma.workIssue.findMany({
    where: { deletedAt: null, OR: or },
    select: { id: true, projectId: true, number: true, title: true, parentId: true, sprintId: true, storyPoints: true, status: { select: { category: true } }, project: { select: { key: true } } },
    take: 5000,
  }) : [];
  const issues = new Map<number, IssueLite>(rows.map((r) => [r.id, { id: r.id, projectId: r.projectId, number: r.number, title: r.title, parentId: r.parentId, sprintId: r.sprintId, storyPoints: r.storyPoints, done: r.status.category === 'DONE', projectKey: r.project.key }]));
  const sprintRows = sprintIds.size ? await prisma.workSprint.findMany({ where: { id: { in: [...sprintIds] } }, select: { id: true, name: true, projectId: true } }) : [];
  const sprints = new Map(sprintRows.map((s) => [s.id, s]));
  const byKr = new Map<number, IssueLite[]>();
  const all = [...issues.values()];
  for (const k of krs) {
    const out: IssueLite[] = [];
    for (const l of k.links) {
      if (l.kind === 'SPRINT') { if (l.sprintId && sprints.has(l.sprintId)) out.push(...all.filter((i) => i.sprintId === l.sprintId)); continue; }
      if (!l.issueId) continue;
      const i = issues.get(l.issueId);
      if (i) out.push(i);
      if (l.kind === 'EPIC') out.push(...all.filter((c) => c.parentId === l.issueId));
    }
    byKr.set(k.id, out);
  }
  return { byKr, issues, sprints };
}

export interface ComputedKr {
  id: number; objectiveId: number; title: string; metric: string; unit: string | null; startValue: number; targetValue: number; currentValue: number;
  source: string; ownerId: number | null; position: number; score: number | null; progress: number; suggestedScore: number;
  linkSummary: { done: number; total: number; unit: 'issues' | 'points' } | null;
  links: Array<{ id: number; kind: string; issueId: number | null; sprintId: number | null }>;
  confidence: number | null;
  checkins: KrRow['checkins'];
}

async function computeKrs(krs: KrRow[]): Promise<{ list: ComputedKr[]; linked: Awaited<ReturnType<typeof linkedIssues>> }> {
  const linked = await linkedIssues(krs);
  const list = krs.map((k) => {
    let progress: number;
    let linkSummary: ComputedKr['linkSummary'] = null;
    let current = k.currentValue;
    if (k.source === 'MANUAL') {
      progress = krProgress(k.metric as KrMetric, k.startValue, k.targetValue, k.currentValue);
    } else {
      const lp = linkedProgress(k.source === 'POINTS' ? 'POINTS' : 'ISSUES', (linked.byKr.get(k.id) ?? []).map<LinkedIssue>((i) => ({ id: i.id, done: i.done, points: i.storyPoints })));
      progress = lp.progress;
      linkSummary = { done: lp.done, total: lp.total, unit: lp.unit };
      current = Math.round(progress * 1000) / 10; // KR tự tính hiện dưới dạng %
    }
    return {
      id: k.id, objectiveId: k.objectiveId, title: k.title, metric: k.source === 'MANUAL' ? k.metric : 'PERCENT', unit: k.source === 'MANUAL' ? k.unit : '%',
      startValue: k.source === 'MANUAL' ? k.startValue : 0, targetValue: k.source === 'MANUAL' ? k.targetValue : 100, currentValue: current,
      source: k.source, ownerId: k.ownerId, position: k.position, score: k.score, progress, suggestedScore: suggestedScore(progress), linkSummary,
      links: k.links, confidence: k.checkins[0]?.confidence ?? null, checkins: k.checkins,
    };
  });
  return { list, linked };
}

async function computeObjectives(ids: number[], now: Date) {
  if (!ids.length) return [];
  const objs = await prisma.workObjective.findMany({
    where: { id: { in: ids } }, orderBy: [{ position: 'asc' }, { id: 'asc' }],
    select: {
      id: true, cycleId: true, projectId: true, parentId: true, title: true, description: true, ownerId: true, position: true, score: true, scoreNote: true, scoredAt: true,
      createdAt: true, cycle: { select: { startDate: true, endDate: true, status: true, workspaceId: true } }, project: { select: { key: true, name: true } },
      parent: { select: { id: true, title: true } },
      keyResults: { orderBy: [{ position: 'asc' }, { id: 'asc' }], select: KR_SELECT },
    },
  });
  const { list, linked } = await computeKrs(objs.flatMap((o) => o.keyResults));
  const byObj = new Map<number, ComputedKr[]>();
  for (const k of list) byObj.set(k.objectiveId, [...(byObj.get(k.objectiveId) ?? []), k]);
  return objs.map((o) => {
    const krs = byObj.get(o.id) ?? [];
    const progress = objectiveProgress(krs.map((k) => k.progress));
    const elapsed = cycleElapsed(o.cycle.startDate, o.cycle.endDate, now);
    const confs = krs.map((k) => k.confidence).filter((c): c is number => c !== null);
    const confidence = confs.length ? Math.min(...confs) : null;
    const status: OkrStatus = okrStatus(progress, elapsed, confidence, o.score !== null);
    return { ...o, krs, progress, elapsed, status, confidence, linked };
  });
}

// ─── Hình dạng trả về ────────────────────────────────────────────

type Computed = Awaited<ReturnType<typeof computeObjectives>>[number];

async function shape(userId: number, rows: Computed[], visibleProjects: Set<number>, rightsOf: (o: Computed) => { edit: boolean; checkin: (kr: ComputedKr) => boolean }) {
  const users = await usersById(rows.flatMap((o) => [o.ownerId, ...o.krs.flatMap((k) => [k.ownerId, ...k.checkins.map((c) => c.userId)])]));
  const u = (id: number | null): PublicUser | null => (id ? users.get(id) ?? null : null);
  return rows.map((o) => {
    const rights = rightsOf(o);
    const linked = o.linked;
    return {
      id: o.id, cycleId: o.cycleId, projectId: o.projectId, project: o.project, parent: o.parent, title: o.title, description: o.description,
      owner: u(o.ownerId), position: o.position, progress: o.progress, expected: o.elapsed, status: o.status, confidence: o.confidence,
      score: o.score, scoreBand: o.score === null ? null : scoreBand(o.score), scoreNote: o.scoreNote, scoredAt: o.scoredAt,
      suggestedScore: objectiveScore(o.krs.map((k) => k.score ?? k.suggestedScore)),
      canEdit: rights.edit,
      keyResults: o.krs.map((k) => ({
        id: k.id, title: k.title, metric: k.metric, unit: k.unit, startValue: k.startValue, targetValue: k.targetValue, currentValue: k.currentValue,
        source: k.source, owner: u(k.ownerId), position: k.position, progress: k.progress, score: k.score, suggestedScore: k.suggestedScore,
        linkSummary: k.linkSummary, confidence: k.confidence, canCheckin: rights.checkin(k),
        links: k.links.map((l) => {
          if (l.kind === 'SPRINT') {
            const s = l.sprintId ? linked.sprints.get(l.sprintId) : undefined;
            if (!s) return { id: l.id, kind: l.kind, missing: true };
            if (!visibleProjects.has(s.projectId)) return { id: l.id, kind: l.kind, hidden: true };
            return { id: l.id, kind: l.kind, sprintId: s.id, name: s.name, projectId: s.projectId };
          }
          const i = l.issueId ? linked.issues.get(l.issueId) : undefined;
          if (!i) return { id: l.id, kind: l.kind, missing: true };
          if (!visibleProjects.has(i.projectId)) return { id: l.id, kind: l.kind, hidden: true };
          return { id: l.id, kind: l.kind, issueId: i.id, projectId: i.projectId, key: `${i.projectKey}-${i.number}`, number: i.number, title: i.title, done: i.done };
        }),
        checkins: k.checkins.map((c) => ({ id: c.id, weekStart: ymd(c.weekStart), value: c.value, progress: c.progress, confidence: c.confidence, note: c.note, at: c.updatedAt, user: u(c.userId) })),
      })),
    };
  });
}

/** Số liệu dashboard: đếm trạng thái, tiến độ theo tuần (check-in) so với nhịp mong đợi, độ tự tin. */
interface DashObj { progress: number; status: string; score: number | null; keyResults: Array<{ progress: number; confidence: number | null; checkins: Array<{ weekStart: string; progress: number; confidence: number }> }> }
function dashboard(objs: DashObj[], cycle: { startDate: Date; endDate: Date } | null, now: Date) {
  const statusCounts: Record<string, number> = {};
  for (const o of objs) statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  const krs = objs.flatMap((o) => o.keyResults);
  const weeks: Array<{ week: string; actual: number | null; expected: number; confidence: number | null }> = [];
  if (cycle) {
    const end = Math.min(cycle.endDate.getTime(), now.getTime());
    for (let t = new Date(`${weekStartVN(cycle.startDate)}T00:00:00Z`).getTime(); t <= end + 7 * 86_400_000 && weeks.length < 60; t += 7 * 86_400_000) {
      const w = new Date(t).toISOString().slice(0, 10);
      if (t > now.getTime()) break;
      const last = krs.map((k) => k.checkins.filter((c) => c.weekStart <= w).sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1))[0] ?? null);
      const prog = last.filter((x): x is NonNullable<typeof x> => !!x);
      weeks.push({
        week: w,
        actual: prog.length ? Math.round((last.reduce((s, c) => s + (c?.progress ?? 0), 0) / Math.max(1, krs.length)) * 1000) / 10 : null,
        expected: Math.round(cycleElapsed(cycle.startDate, cycle.endDate, new Date(t + 6 * 86_400_000)) * 1000) / 10,
        confidence: prog.length ? Math.round((prog.reduce((s, c) => s + c.confidence, 0) / prog.length) * 10) / 10 : null,
      });
    }
  }
  const scored = objs.filter((o) => o.score !== null);
  return {
    objectives: objs.length,
    keyResults: krs.length,
    statusCounts,
    avgProgress: objs.length ? Math.round((objs.reduce((s, o) => s + o.progress, 0) / objs.length) * 1000) / 10 : 0,
    avgScore: scored.length ? Math.round((scored.reduce((s, o) => s + (o.score ?? 0), 0) / scored.length) * 100) / 100 : null,
    avgConfidence: (() => { const c = krs.map((k) => k.confidence).filter((x): x is number => x !== null); return c.length ? Math.round((c.reduce((a, b) => a + b, 0) / c.length) * 10) / 10 : null; })(),
    weeks,
  };
}

async function pickCycle(workspaceId: number, cycleId?: number | null) {
  const cycles = await prisma.workOkrCycle.findMany({ where: { workspaceId }, orderBy: [{ startDate: 'desc' }, { id: 'desc' }] });
  const now = new Date();
  const cur = cycleId ? cycles.find((c) => c.id === cycleId) : (cycles.find((c) => c.status === 'ACTIVE' && c.startDate <= now && c.endDate.getTime() + 86_400_000 >= now.getTime()) ?? cycles.find((c) => c.status === 'ACTIVE') ?? cycles[0]);
  if (cycleId && !cur) throw new NotFoundError('OKR cycle not found');
  return { cycles, cycle: cur ?? null };
}

const cycleOut = (c: { id: number; name: string; startDate: Date; endDate: Date; status: string; createdById: number | null }) => ({ id: c.id, name: c.name, startDate: ymd(c.startDate), endDate: ymd(c.endDate), status: c.status, createdById: c.createdById });

// ─── Đọc ─────────────────────────────────────────────────────────

/** OKR của MỘT dự án (+ objective cấp không gian của chu kỳ để chọn căn chỉnh). */
export async function projectOkrs(userId: number, projectId: number, cycleId?: number | null) {
  const a = await canSeeProject(userId, projectId);
  if (!a) throw new NotFoundError('Project not found');
  const { cycles, cycle } = await pickCycle(a.workspaceId, cycleId);
  const now = new Date();
  const human = a.principal === 'HUMAN';
  const write = human && (a.role === 'ADMIN' || a.role === 'MEMBER');
  const ids = cycle ? (await prisma.workObjective.findMany({ where: { cycleId: cycle.id, projectId }, select: { id: true } })).map((o) => o.id) : [];
  const rows = await computeObjectives(ids, now);
  const objectives = await shape(userId, rows, new Set([projectId]), () => ({ edit: write, checkin: (k) => write || (human && k.ownerId === userId) }));
  const wsObjectives = cycle ? await prisma.workObjective.findMany({ where: { cycleId: cycle.id, projectId: null }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, title: true } }) : [];
  const ws = await loadWorkspaceAccess(userId, a.workspaceId);
  return {
    scope: 'project' as const, projectId, workspaceId: a.workspaceId,
    cycles: cycles.map(cycleOut), cycle: cycle ? cycleOut(cycle) : null,
    canEdit: write && cycle?.status !== 'CLOSED',
    canCreateCycle: human && !!ws && ws.role !== 'GUEST',
    canManageCycle: !!cycle && human && !!ws && (ws.role === 'OWNER' || ws.role === 'ADMIN' || cycle.createdById === userId),
    alignTo: wsObjectives,
    objectives,
    dashboard: dashboard(objectives, cycle, now),
  };
}

/** OKR của KHÔNG GIAN: objective cấp không gian + objective của mọi dự án người xem thấy (theo chu kỳ). */
export async function workspaceOkrs(userId: number, workspaceId: number, cycleId?: number | null) {
  const w = await wsMember(userId, workspaceId);
  const { cycles, cycle } = await pickCycle(workspaceId, cycleId);
  const now = new Date();
  const human = w.principal === 'HUMAN';
  const projects = await prisma.workProject.findMany({ where: { workspaceId, deletedAt: null }, select: { id: true, key: true, name: true } });
  const visible = new Set<number>();
  const projRole = new Map<number, string>();
  for (const p of projects) {
    const a = await canSeeProject(userId, p.id);
    if (a) { visible.add(p.id); projRole.set(p.id, a.role); }
  }
  const ids = cycle ? (await prisma.workObjective.findMany({ where: { cycleId: cycle.id, OR: [{ projectId: null }, { projectId: { in: [...visible] } }] }, select: { id: true } })).map((o) => o.id) : [];
  const rows = await computeObjectives(ids, now);
  const wsAdmin = w.role === 'OWNER' || w.role === 'ADMIN';
  const objectives = await shape(userId, rows, visible, (o) => {
    const edit = human && (o.projectId ? ['ADMIN', 'MEMBER'].includes(projRole.get(o.projectId) ?? '') : wsAdmin || o.ownerId === userId);
    return { edit, checkin: (k) => edit || (human && k.ownerId === userId) };
  });
  return {
    scope: 'workspace' as const, workspaceId,
    cycles: cycles.map(cycleOut), cycle: cycle ? cycleOut(cycle) : null,
    canEdit: human && wsAdmin && cycle?.status !== 'CLOSED',
    canCreateCycle: human,
    canManageCycle: !!cycle && human && (wsAdmin || cycle.createdById === userId),
    projects: projects.filter((p) => visible.has(p.id)),
    objectives,
    dashboard: dashboard(objectives, cycle, now),
  };
}

// ─── Ghi: objective / KR ─────────────────────────────────────────

async function createKrRows(tx: Prisma.TransactionClient, objectiveId: number, krs: Array<z.infer<typeof krInput>>, startPos = 0) {
  let pos = startPos;
  for (const k of krs) {
    if (k.metric === 'BOOLEAN') { k.startValue = 0; k.targetValue = 1; }
    if (k.metric === 'PERCENT' && k.targetValue === undefined) k.targetValue = 100;
    await tx.workKeyResult.create({
      data: {
        objectiveId, title: k.title, metric: k.metric, unit: k.metric === 'PERCENT' ? '%' : k.unit?.trim() || null, startValue: k.startValue, targetValue: k.targetValue,
        currentValue: k.currentValue ?? k.startValue, source: k.source, ownerId: k.ownerId ?? null, position: pos++,
      },
    });
  }
}

export async function createObjective(userId: number, scope: { workspaceId?: number; projectId?: number }, input: z.infer<typeof objectiveInput>) {
  let workspaceId: number;
  const projectId = scope.projectId ?? null;
  if (projectId) {
    const a = await canSeeProject(userId, projectId);
    if (!a) throw new NotFoundError('Project not found');
    if (a.principal === 'AGENT') throw new ForbiddenError('AI agents can read OKRs but cannot change them');
    if (!(a.role === 'ADMIN' || a.role === 'MEMBER')) throw new ForbiddenError('Only project admins and members can add objectives');
    workspaceId = a.workspaceId;
  } else {
    workspaceId = scope.workspaceId!;
    const w = await wsMember(userId, workspaceId);
    if (w.principal === 'AGENT') throw new ForbiddenError('AI agents can read OKRs but cannot change them');
    if (!(w.role === 'OWNER' || w.role === 'ADMIN')) throw new ForbiddenError('Only workspace admins can add workspace objectives');
  }
  const cycle = await prisma.workOkrCycle.findFirst({ where: { id: input.cycleId, workspaceId } });
  if (!cycle) throw new NotFoundError('OKR cycle not found');
  assertOpen({ cycle });
  await assertOwner(input.ownerId, projectId, workspaceId);
  for (const k of input.keyResults ?? []) await assertOwner(k.ownerId, projectId, workspaceId);
  if (input.parentId) {
    const p = await prisma.workObjective.findFirst({ where: { id: input.parentId, cycleId: cycle.id, projectId: null } });
    if (!p || !projectId) throw new BadRequestError('Align project objectives with a workspace objective of the same cycle', 'WORK_OKR_BAD_PARENT');
  }
  const pos = await prisma.workObjective.count({ where: { cycleId: cycle.id, projectId } });
  const o = await prisma.$transaction(async (tx) => {
    const o = await tx.workObjective.create({
      data: { cycleId: cycle.id, projectId, parentId: input.parentId ?? null, title: input.title, description: input.description?.trim() || null, ownerId: input.ownerId ?? userId, position: pos, createdById: userId },
    });
    await createKrRows(tx, o.id, input.keyResults ?? []);
    return o;
  });
  if (projectId) await auditProject(projectId, { actorId: userId, action: 'okr.objective.create', targetType: 'okr_objective', targetId: o.id, summary: `Added objective "${o.title}"` });
  else await audit({ workspaceId, actorId: userId, action: 'okr.objective.create', targetType: 'okr_objective', targetId: o.id, summary: `Added workspace objective "${o.title}"` });
  await emitFor(projectId, o.id, 'created');
  return { id: o.id };
}

export async function updateObjective(userId: number, id: number, input: z.infer<typeof objectivePatch>) {
  const { o, r } = await loadObjective(userId, id, true);
  assertOpen(o);
  await assertOwner(input.ownerId, o.projectId, r.workspaceId);
  if (input.parentId) {
    const p = await prisma.workObjective.findFirst({ where: { id: input.parentId, cycleId: o.cycleId, projectId: null } });
    if (!p || !o.projectId) throw new BadRequestError('Align project objectives with a workspace objective of the same cycle', 'WORK_OKR_BAD_PARENT');
  }
  await prisma.workObjective.update({
    where: { id },
    data: { title: input.title, description: input.description === undefined ? undefined : input.description?.trim() || null, ownerId: input.ownerId, parentId: input.parentId, position: input.position },
  });
  await emitFor(o.projectId, id, 'updated');
  return { ok: true };
}

export async function deleteObjective(userId: number, id: number) {
  const { o } = await loadObjective(userId, id, true);
  const row = await prisma.workObjective.delete({ where: { id }, select: { title: true } });
  if (o.projectId) await auditProject(o.projectId, { actorId: userId, action: 'okr.objective.delete', targetType: 'okr_objective', targetId: id, summary: `Deleted objective "${row.title}"` });
  else await audit({ workspaceId: o.cycle.workspaceId, actorId: userId, action: 'okr.objective.delete', targetType: 'okr_objective', targetId: id, summary: `Deleted workspace objective "${row.title}"` });
  await emitFor(o.projectId, id, 'deleted');
  return { ok: true };
}

export async function addKeyResult(userId: number, objectiveId: number, input: z.infer<typeof krInput>) {
  const { o, r } = await loadObjective(userId, objectiveId, true);
  assertOpen(o);
  await assertOwner(input.ownerId, o.projectId, r.workspaceId);
  const n = await prisma.workKeyResult.count({ where: { objectiveId } });
  if (n >= 10) throw new BadRequestError('An objective can have at most 10 key results', 'WORK_OKR_TOO_MANY_KR');
  await prisma.$transaction((tx) => createKrRows(tx, objectiveId, [input], n));
  await emitFor(o.projectId, objectiveId, 'updated');
  return { ok: true };
}

export async function updateKeyResult(userId: number, krId: number, input: z.infer<typeof krPatch>) {
  const { kr, o, r } = await loadKr(userId, krId);
  if (!r.human) throw new ForbiddenError('AI agents can read OKRs but cannot change them');
  if (!r.edit) throw new ForbiddenError('You cannot edit this key result');
  assertOpen(o);
  await assertOwner(input.ownerId, o.projectId, r.workspaceId);
  const metric = input.metric ?? kr.metric;
  const data: Prisma.WorkKeyResultUpdateInput = {
    title: input.title, metric: input.metric, unit: input.unit === undefined ? undefined : input.unit?.trim() || null,
    startValue: input.startValue, targetValue: input.targetValue, source: input.source, ownerId: input.ownerId, position: input.position,
  };
  if (metric === 'BOOLEAN') { data.startValue = 0; data.targetValue = 1; }
  if (metric === 'PERCENT') data.unit = '%';
  await prisma.workKeyResult.update({ where: { id: krId }, data });
  await emitFor(o.projectId, o.id, 'updated');
  return { ok: true };
}

export async function deleteKeyResult(userId: number, krId: number) {
  const { o, r } = await loadKr(userId, krId);
  if (!r.human || !r.edit) throw new ForbiddenError('You cannot edit this key result');
  assertOpen(o);
  await prisma.workKeyResult.delete({ where: { id: krId } });
  await emitFor(o.projectId, o.id, 'updated');
  return { ok: true };
}

/** Đặt LẠI toàn bộ liên kết của KR (thay thế). KR dự án chỉ liên kết thẻ/sprint của chính dự án đó. */
export async function setKeyResultLinks(userId: number, krId: number, input: z.infer<typeof linkInput>) {
  const { o, r } = await loadKr(userId, krId);
  if (!r.human || !r.edit) throw new ForbiddenError('You cannot edit this key result');
  assertOpen(o);
  const rows: Array<{ kind: string; issueId: number | null; sprintId: number | null }> = [];
  const seen = new Set<string>();
  for (const l of input.links) {
    const pid = l.projectId ?? o.projectId;
    if (!pid) throw new BadRequestError('Choose the project of the linked item', 'WORK_OKR_BAD_LINK');
    if (o.projectId && pid !== o.projectId) throw new BadRequestError('Project key results can only link to this project', 'WORK_OKR_BAD_LINK');
    const a = await canSeeProject(userId, pid);
    if (!a || a.workspaceId !== r.workspaceId) throw new BadRequestError('Linked items must belong to a project you can see in this workspace', 'WORK_OKR_BAD_LINK');
    if (l.kind === 'SPRINT') {
      if (!l.sprintId) throw new BadRequestError('Choose a sprint', 'WORK_OKR_BAD_LINK');
      const s = await prisma.workSprint.findFirst({ where: { id: l.sprintId, projectId: pid }, select: { id: true } });
      if (!s) throw new BadRequestError('Sprint not found in that project', 'WORK_OKR_BAD_LINK');
      const k = `S${s.id}`;
      if (!seen.has(k)) { seen.add(k); rows.push({ kind: 'SPRINT', issueId: null, sprintId: s.id }); }
    } else {
      if (!l.number) throw new BadRequestError('Choose an issue', 'WORK_OKR_BAD_LINK');
      const i = await prisma.workIssue.findFirst({ where: { projectId: pid, number: l.number, deletedAt: null }, select: { id: true } });
      if (!i) throw new BadRequestError(`Issue ${a.key}-${l.number} not found`, 'WORK_OKR_BAD_LINK');
      const k = `${l.kind}${i.id}`;
      if (!seen.has(k)) { seen.add(k); rows.push({ kind: l.kind, issueId: i.id, sprintId: null }); }
    }
  }
  await prisma.$transaction([
    prisma.workKeyResultLink.deleteMany({ where: { keyResultId: krId } }),
    prisma.workKeyResultLink.createMany({ data: rows.map((x) => ({ keyResultId: krId, ...x })) }),
  ]);
  await emitFor(o.projectId, o.id, 'updated');
  return { ok: true, links: rows.length };
}

/** Check-in tuần: giá trị (KR nhập tay) + độ tự tin 0–10 + ghi chú. Một dòng mỗi tuần (ghi đè trong tuần). */
export async function checkin(userId: number, krId: number, input: z.infer<typeof checkinInput>) {
  const { kr, o, r } = await loadKr(userId, krId);
  if (!r.human) throw new ForbiddenError('AI agents can read OKRs but cannot change them');
  if (!r.edit && kr.ownerId !== userId) throw new ForbiddenError('Only the owner of this key result or the team can check in');
  assertOpen(o);
  let value: number;
  let progress: number;
  if (kr.source === 'MANUAL') {
    if (input.value === undefined) throw new BadRequestError('Enter the current value', 'WORK_OKR_VALUE_REQUIRED');
    value = kr.metric === 'BOOLEAN' ? (input.value >= 1 ? 1 : 0) : input.value;
    progress = krProgress(kr.metric as KrMetric, kr.startValue, kr.targetValue, value);
  } else {
    const [c] = (await computeKrs(await prisma.workKeyResult.findMany({ where: { id: krId }, select: KR_SELECT }))).list;
    progress = c.progress;
    value = c.currentValue;
  }
  const weekStart = new Date(`${weekStartVN(new Date())}T00:00:00.000Z`);
  await prisma.$transaction([
    prisma.workOkrCheckin.upsert({
      where: { keyResultId_weekStart: { keyResultId: krId, weekStart } },
      create: { keyResultId: krId, userId, weekStart, value, progress, confidence: input.confidence, note: input.note?.trim() || null },
      update: { userId, value, progress, confidence: input.confidence, note: input.note?.trim() || null },
    }),
    ...(kr.source === 'MANUAL' ? [prisma.workKeyResult.update({ where: { id: krId }, data: { currentValue: value } })] : []),
  ]);
  await emitFor(o.projectId, o.id, 'checkin');
  return { ok: true, value, progress, weekStart: ymd(weekStart) };
}

/** Chấm điểm cuối kỳ (0–1) cho từng KR + objective. Không gửi điểm objective ⇒ trung bình điểm KR. */
export async function scoreObjective(userId: number, id: number, input: z.infer<typeof scoreInput>) {
  const { o } = await loadObjective(userId, id, true);
  const krIds = new Set((await prisma.workKeyResult.findMany({ where: { objectiveId: id }, select: { id: true } })).map((k) => k.id));
  for (const s of input.krScores) if (!krIds.has(s.id)) throw new BadRequestError('Key result does not belong to this objective', 'WORK_OKR_BAD_SCORE');
  const round = (n: number) => Math.round(n * 100) / 100;
  await prisma.$transaction(input.krScores.map((s) => prisma.workKeyResult.update({ where: { id: s.id }, data: { score: round(s.score) } })));
  const all = await prisma.workKeyResult.findMany({ where: { objectiveId: id }, select: { score: true } });
  const score = input.score ?? objectiveScore(all.map((k) => k.score));
  if (score === null) throw new BadRequestError('Score at least one key result', 'WORK_OKR_BAD_SCORE');
  await prisma.workObjective.update({ where: { id }, data: { score: round(score), scoreNote: input.note?.trim() || null, scoredAt: new Date() } });
  await emitFor(o.projectId, id, 'scored');
  return { ok: true, score: round(score), band: scoreBand(score) };
}
