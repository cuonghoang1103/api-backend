/**
 * CT Work UX-C (11/10/2026) — dữ liệu cho:
 *   · Team overview (trưởng nhóm): ai đang làm gì, tải theo người, trễ, kẹt, review đang chờ, họp sắp tới, hồ sơ FPT còn
 *     thiếu, tín hiệu Đóng góp, Q&A chờ giảng viên. DÙNG LẠI phép tính sẵn có: tải theo người = flowReports.loadByPerson,
 *     P85 cycle time = flowMetrics.computeCycleTimes, hồ sơ/Q&A/đóng góp/health = teaching.groupRowOf (y hub giảng viên),
 *     họp = meetings.listMeetings. Chỉ phần "kẹt" là mới (uxcRules.computeStuck).
 *   · Timeline: mốc (sprint / version / giai đoạn) + baseline (C5) lưu và so.
 *   · WBS kéo-thả: đổi thứ tự / đổi cha qua applyIssueChange (lịch sử, 409, sự kiện, luật cha đúng tầng).
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { displayName, PUBLIC_USER } from './common.js';
import type { WorkActor } from './events.js';
import { computeCycleTimes, FLOW_TZ, type FieldChange } from './flowMetrics.js';
import { loadByPerson } from './flowReports.service.js';
import { applyIssueChange } from './issueChange.js';
import { listMeetings } from './meetings.service.js';
import { openIssueWhere } from './openIssues.js';
import { governanceAccess, isClientScoped, requireProject } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { loadQuestions } from './qna.service.js';
import { rankBetween } from './rank.js';
import { vnDay } from './sprints.service.js';
import { groupRowOf } from './teaching.service.js';
import { timeline } from './planning.service.js';
import { compareBaseline, computeStuck, isReviewStatus, planWbsMove, snapshotPlan, statusAges, type BaselineRow } from './uxcRules.js';

const DAY_MS = 86_400_000;
const userActor = (userId: number): WorkActor => ({ kind: 'USER', userId });
const day = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : null);

// ═══ Team overview ═══════════════════════════════════════════════

export async function teamOverview(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  if (isClientScoped(access) || (access.role as string) === 'CLIENT') {
    throw new ForbiddenError('Team overview is only available to the project team');
  }
  const t0 = Date.now();
  const now = new Date();
  const today = vnDay(now);

  const [statuses, members, load, openRows] = await Promise.all([
    prisma.workStatus.findMany({ where: { workflow: { projectId } }, select: { id: true, name: true, category: true } }),
    projectMembers(projectId),
    loadByPerson(userId, projectId),
    prisma.workIssue.findMany({
      where: { projectId, ...openIssueWhere(), type: { level: 0 }, testCase: { is: null } },
      select: {
        id: true, number: true, title: true, statusId: true, assigneeId: true, createdAt: true, dueDate: true, flaggedAt: true, updatedAt: true,
        priority: true,
      },
      take: 3000,
    }),
  ]);
  const statusById = new Map(statuses.map((s) => [s.id, s]));
  const inProgress = openRows.filter((r) => statusById.get(r.statusId)?.category === 'IN_PROGRESS');

  // P85 cycle time 90 ngày qua — cùng phép tính của Aging WIP (UX-B), làm ngưỡng "kẹt" cho trạng thái đang làm.
  const from = new Date(now.getTime() - 90 * DAY_MS);
  const doneRows = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { level: 0 }, testCase: { is: null }, resolvedAt: { gte: from } },
    select: { id: true, number: true, title: true, createdAt: true, resolvedAt: true, statusId: true, assigneeId: true },
    take: 2000,
  });
  const ids = [...inProgress.map((r) => r.id), ...doneRows.map((r) => r.id)];
  const changes: FieldChange[] = ids.length
    ? (await prisma.workHistory.findMany({
      where: { issueId: { in: ids }, field: 'statusId' },
      select: { issueId: true, fromValue: true, toValue: true, createdAt: true },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    })).map((h) => ({ issueId: h.issueId, from: h.fromValue, to: h.toValue, at: h.createdAt }))
    : [];
  const statusCat = new Map(statuses.map((s) => [s.id, s.category]));
  const ref = computeCycleTimes({
    issues: doneRows.map((r) => ({ ...r, fixVersionId: null })), statusChanges: changes, statusCat, tz: FLOW_TZ, from,
  }).cycle;
  const stuck = computeStuck({ issues: inProgress, statusChanges: changes, statuses, now, p85: ref.p85 });
  // Ngày ở trạng thái hiện tại cho MỌI thẻ đang làm (cột "doing" của từng người).
  const ages = statusAges(inProgress, changes, now);
  const daysIn = (id: number) => ages.get(id) ?? null;

  const reviews = inProgress
    .filter((r) => isReviewStatus(statusById.get(r.statusId)?.name ?? ''))
    .map((r) => ({ number: r.number, title: r.title, statusId: r.statusId, assigneeId: r.assigneeId, days: daysIn(r.id) }))
    .sort((a, b) => (b.days ?? 0) - (a.days ?? 0));

  const overdue = openRows
    .filter((r) => r.dueDate && day(r.dueDate)! < today)
    .map((r) => ({
      number: r.number, title: r.title, statusId: r.statusId, assigneeId: r.assigneeId, dueDate: day(r.dueDate),
      daysLate: Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${day(r.dueDate)}T00:00:00Z`)) / DAY_MS),
    }))
    .sort((a, b) => b.daysLate - a.daysLate);

  // Ai đang làm gì: thẻ đang làm theo người (mới cập nhật trước).
  const team = members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');
  const loadOf = new Map(load.people.map((p) => [p.user?.id ?? 0, p]));
  const people = team.map((m) => {
    const l = loadOf.get(m.id);
    const doing = inProgress
      .filter((r) => r.assigneeId === m.id)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5)
      .map((r) => ({ number: r.number, title: r.title, statusId: r.statusId, days: daysIn(r.id), flagged: !!r.flaggedAt }));
    return {
      user: { id: m.id, username: m.username, fullName: m.fullName, displayName: m.displayName, avatarUrl: m.avatarUrl, kind: m.kind },
      name: displayName(m), role: m.role,
      todo: l?.todo ?? 0, inProgress: l?.inProgress ?? 0, overdue: l?.overdue ?? 0, blocked: l?.blocked ?? 0, estimate: l?.estimate ?? 0, total: l?.total ?? 0,
      stuck: stuck.filter((s) => s.assigneeId === m.id).length,
      reviews: reviews.filter((r) => r.assigneeId === m.id).length,
      doing,
      signals: [] as Array<{ code: string; text: string; level?: string }>,
      contribStatus: null as string | null,
    };
  }).sort((a, b) => Number(b.user.kind !== 'AGENT') - Number(a.user.kind !== 'AGENT') || b.total - a.total || a.name.localeCompare(b.name));
  const unassigned = loadOf.get(0) ?? null;

  // Họp sắp tới (14 ngày) — mô-đun họp tắt / không có quyền ⇒ bỏ qua, không làm hỏng cả trang.
  let meetings: Array<{ number: number; title: string; startsAt: string; endsAt: string; type: string; url: string | null }> | null = null;
  try {
    const m = await listMeetings(userId, projectId, { scope: 'upcoming' });
    const horizon = now.getTime() + 14 * DAY_MS;
    meetings = m.items
      .filter((x) => new Date(x.startsAt).getTime() <= horizon && x.status !== 'CANCELLED')
      .slice(0, 6)
      .map((x) => ({ number: x.number, title: x.title, startsAt: new Date(x.startsAt).toISOString(), endsAt: new Date(x.endsAt).toISOString(), type: String(x.type), url: x.meetingUrl ?? null }));
  } catch { meetings = null; }

  // Hồ sơ FPT + Q&A + tín hiệu đóng góp + health: đúng phép tính hub giảng viên.
  let group: Awaited<ReturnType<typeof groupRowOf>> = null;
  try { group = await groupRowOf(userId, projectId); } catch (err) { logger.warn('[work] team overview: groupRow lỗi', { projectId, err: (err as Error).message }); }
  if (group) {
    for (const p of people) {
      const g = group.members.find((x) => x.id === p.user.id);
      if (g) { p.signals = g.signalItems ?? g.signals.map((text) => ({ code: '', text })); p.contribStatus = g.status; }
    }
  }

  // Q&A chờ trả lời (sổ Q&A đợt 4) — đội xem được, giảng viên cũng thấy.
  let qna: { open: number; overdue: number; oldestDays: number; items: Array<{ number: number; key: string; question: string; askedTo: string | null; askedOn: string | null; days: number; overdue: boolean }> } | null = null;
  if (governanceAccess(access.role, access.workspaceRole).view || access.role === 'TEACHER') {
    const all = await loadQuestions(projectId);
    const open = all.filter((q) => q.statusText === 'Open');
    const daysSince = (d: string | null) => !d ? 0 : Math.max(0, Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${d}T00:00:00Z`)) / DAY_MS));
    qna = {
      open: open.length,
      overdue: open.filter((q) => q.overdue).length,
      oldestDays: open.length ? Math.max(...open.map((q) => daysSince(q.askedOn))) : 0,
      items: open.map((q) => ({ number: q.number, key: q.key, question: q.question, askedTo: q.askedTo, askedOn: q.askedOn, days: daysSince(q.askedOn), overdue: q.overdue }))
        .sort((a, b) => b.days - a.days).slice(0, 8),
    };
  }

  return {
    asOf: now.toISOString(),
    unit: load.unit,
    totals: {
      members: team.length,
      open: openRows.length,
      inProgress: inProgress.length,
      overdue: overdue.length,
      stuck: stuck.length,
      reviews: reviews.length,
      unassigned: unassigned?.total ?? 0,
    },
    stuckRule: { reviewDays: 2, inProgressDays: Math.max(3, Math.ceil(ref.p85 ?? 0)), p85: ref.p85, samples: ref.n },
    people,
    unassigned: unassigned ? { todo: unassigned.todo, inProgress: unassigned.inProgress, overdue: unassigned.overdue, total: unassigned.total } : null,
    overdue: overdue.slice(0, 20),
    stuck: stuck.slice(0, 20),
    reviews: reviews.slice(0, 20),
    meetings,
    docs: group ? { subject: group.subject, states: group.docs, expected: group.docsExpected, submitted: group.docsSubmitted, missing: group.docsMissing } : null,
    contrib: group?.contrib ?? null,
    sprint: group?.sprint ?? null,
    risks: group?.risks ?? null,
    health: group?.health ?? null,
    qna,
    tookMs: Date.now() - t0,
  };
}

// ═══ Timeline: mốc ════════════════════════════════════════════════

/** Dải sprint, mốc version (start/release), giai đoạn (bắt đầu/xong) — vẽ trên trục Timeline và làm ngày lùi cho thẻ chưa có ngày. */
export async function timelineMarkers(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const [sprints, versions, stages] = await Promise.all([
    prisma.workSprint.findMany({
      where: { projectId }, orderBy: [{ startAt: 'asc' }, { id: 'asc' }], take: 200,
      select: { id: true, name: true, state: true, startAt: true, endAt: true, completedAt: true },
    }),
    prisma.workVersion.findMany({
      where: { projectId, status: { not: 'ARCHIVED' } }, orderBy: [{ releaseDate: 'asc' }, { id: 'asc' }], take: 200,
      select: { id: true, name: true, status: true, startDate: true, releaseDate: true, releasedAt: true },
    }),
    access.modules.stages
      ? prisma.workStage.findMany({ where: { projectId }, orderBy: { n: 'asc' }, select: { id: true, n: true, name: true, status: true, startedAt: true, completedAt: true } })
      : Promise.resolve([]),
  ]);
  return {
    sprints: sprints.map((s) => ({ id: s.id, name: s.name, status: s.state, start: day(s.startAt), end: day(s.completedAt ?? s.endAt) })),
    versions: versions.map((v) => ({ id: v.id, name: v.name, status: v.status, start: day(v.startDate), release: day(v.releasedAt ?? v.releaseDate) })),
    stages: stages.map((s) => ({ id: s.id, n: s.n, name: s.name, status: s.status, start: day(s.startedAt), end: day(s.completedAt) })),
  };
}

// ═══ Timeline: baseline (C5) ══════════════════════════════════════

const MAX_BASELINES = 20;

export async function listBaselines(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const rows = await prisma.workTimelineBaseline.findMany({
    where: { projectId }, orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, note: true, itemCount: true, createdAt: true, createdById: true },
  });
  const users = await prisma.user.findMany({ where: { id: { in: rows.map((r) => r.createdById).filter((x): x is number => !!x) } }, select: PUBLIC_USER });
  return rows.map((r) => ({ ...r, createdBy: users.find((u) => u.id === r.createdById) ?? null }));
}

/** Chụp kế hoạch hiện tại (ngày của mọi thẻ trên Timeline). Ai sửa được thẻ thì chụp được; xoá chỉ ADMIN hoặc người chụp. */
export async function createBaseline(userId: number, projectId: number, input: { name: string; note?: string | null }) {
  await requireProject(userId, projectId, 'issue.edit');
  const name = input.name.trim().slice(0, 120);
  if (!name) throw new BadRequestError('Give the baseline a name', 'VALIDATION_ERROR');
  const count = await prisma.workTimelineBaseline.count({ where: { projectId } });
  if (count >= MAX_BASELINES) throw new BadRequestError(`A project keeps at most ${MAX_BASELINES} baselines — delete an old one first`, 'WORK_LIMIT');
  const tl = await timeline(userId, projectId);
  const items = snapshotPlan(tl.items.map((i) => ({ id: i.id, number: i.number, start: i.start, due: i.due })));
  if (!items.length) throw new BadRequestError('Nothing on the timeline has dates yet — schedule some issues first', 'WORK_BASELINE_EMPTY');
  const row = await prisma.workTimelineBaseline.create({
    data: { projectId, name, note: input.note?.trim().slice(0, 500) || null, items: items as unknown as Prisma.InputJsonValue, itemCount: items.length, createdById: userId },
    select: { id: true, name: true, note: true, itemCount: true, createdAt: true, createdById: true },
  });
  return row;
}

export async function deleteBaseline(userId: number, projectId: number, baselineId: number) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  const row = await prisma.workTimelineBaseline.findFirst({ where: { id: baselineId, projectId }, select: { id: true, createdById: true } });
  if (!row) throw new NotFoundError('Baseline not found');
  if (access.role !== 'ADMIN' && row.createdById !== userId) throw new ForbiddenError('Only a project admin or the person who saved it can delete a baseline');
  await prisma.workTimelineBaseline.delete({ where: { id: row.id } });
  return { deleted: true };
}

/** So một baseline với kế hoạch hiện tại — trả cả dòng gốc (để vẽ thanh mờ) lẫn tóm tắt trễ/sớm. */
export async function compareWithBaseline(userId: number, projectId: number, baselineId: number) {
  await requireProject(userId, projectId, 'project.view');
  const b = await prisma.workTimelineBaseline.findFirst({ where: { id: baselineId, projectId }, select: { id: true, name: true, createdAt: true, items: true, itemCount: true } });
  if (!b) throw new NotFoundError('Baseline not found');
  const tl = await timeline(userId, projectId);
  const base = (Array.isArray(b.items) ? b.items : []) as unknown as BaselineRow[];
  const cmp = compareBaseline(tl.items.map((i) => ({ id: i.id, number: i.number, start: i.start, due: i.due })), base);
  return { baseline: { id: b.id, name: b.name, createdAt: b.createdAt, itemCount: b.itemCount }, items: base, ...cmp };
}

// ═══ WBS kéo-thả ═════════════════════════════════════════════════

const MOVE_ERR: Record<string, string> = {
  NOT_FOUND: 'Issue not found',
  SELF: 'An issue cannot be its own parent',
  CYCLE: 'You cannot move an issue under one of its own children',
  BAD_PARENT_LEVEL: 'That parent is the wrong level — stories go under epics, sub-tasks under stories',
  SUBTASK_NEEDS_PARENT: 'A sub-task must stay under a story, task or bug',
  EPIC_NO_PARENT: 'An epic cannot have a parent',
  BAD_NEIGHBOR: 'The drop position is out of date — reload the WBS',
};

/**
 * Kéo-thả trong WBS: `parentNumber` (null = gốc), `beforeNumber` / `afterNumber` = anh em cạnh chỗ thả. Đổi cha và rank
 * trong MỘT lần applyIssueChange (lịch sử + 409 + sự kiện realtime). Rank là rank CHUNG của dự án — thứ tự trên
 * backlog cũng đổi theo (như Jira: một thứ tự ưu tiên).
 */
export async function moveWbsItem(userId: number, projectId: number, number: number, input: { parentNumber: number | null; beforeNumber?: number | null; afterNumber?: number | null; version?: number }) {
  await requireProject(userId, projectId, 'issue.edit');
  const nums = [number, input.parentNumber, input.beforeNumber, input.afterNumber].filter((x): x is number => typeof x === 'number');
  const named = await prisma.workIssue.findMany({ where: { projectId, deletedAt: null, number: { in: nums } }, select: { id: true, number: true } });
  const idOf = (n: number | null | undefined) => (n == null ? null : named.find((x) => x.number === n)?.id ?? -1);
  const me = idOf(number);
  if (!me || me < 0) throw new NotFoundError('Issue not found');
  const parentId = idOf(input.parentNumber);
  if (parentId === -1) throw new BadRequestError('Parent issue not found in this project', 'WORK_BAD_PARENT');
  // Chỉ cần nút liên quan: chính nó, cha mới, anh em ở cha mới, và chuỗi tổ tiên của cha mới (kiểm vòng).
  const nodes = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, OR: [{ id: me }, { parentId: parentId ?? null }, ...(parentId ? [{ id: parentId }] : [])] },
    select: { id: true, parentId: true, rank: true, type: { select: { level: true, key: true } } },
  });
  // Tổ tiên của cha mới (tối đa 3 tầng: sub-task ⊂ story ⊂ epic).
  let cursor = nodes.find((n) => n.id === parentId)?.parentId ?? null;
  for (let k = 0; cursor && k < 4; k++) {
    if (nodes.some((n) => n.id === cursor)) break;
    const up = await prisma.workIssue.findFirst({ where: { id: cursor, projectId }, select: { id: true, parentId: true, rank: true, type: { select: { level: true, key: true } } } });
    if (!up) break;
    nodes.push(up);
    cursor = up.parentId;
  }
  // Gốc WBS chỉ gồm thẻ không có cha CÒN TỒN TẠI — đúng như buildWbs; bug/test không vào WBS nhưng vẫn là anh em hợp lệ.
  const plan = planWbsMove(
    nodes.map((n) => ({ id: n.id, parentId: n.parentId, level: n.type.level, rank: n.rank, typeKey: n.type.key })),
    { id: me, parentId, beforeId: idOf(input.beforeNumber) ?? null, afterId: idOf(input.afterNumber) ?? null },
  );
  if ('error' in plan) throw new BadRequestError(MOVE_ERR[plan.error] ?? 'Cannot move here', `WORK_WBS_${plan.error}`);
  let rank: string;
  try {
    rank = rankBetween(plan.prevRank, plan.nextRank);
  } catch {
    throw new BadRequestError('The drop position is out of date — reload the WBS', 'WORK_WBS_BAD_NEIGHBOR');
  }
  const r = await applyIssueChange(me, plan.parentChanged ? { parentId: plan.parentId } : {}, userActor(userId), { expectedVersion: input.version, rank });
  return { number, parentNumber: input.parentNumber, rank, version: r.issue.version };
}
