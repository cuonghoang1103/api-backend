/**
 * CT Work — báo cáo "giờ người / chi phí agent" (CTW-33 §5.2, GĐ1 A12). Hợp đồng: docs/ctw-dot-2-hop-dong-api.md.
 *
 *   - projectAgentReport   GET /projects/:pid/reports/agents?from&to&sprintId
 *   - workspaceAgentDashboard  GET /workspaces/:wsId/agents/dashboard?days
 *
 * Định nghĩa (đếm được bằng tay trong test):
 *   - "xong" (resolved) = thẻ ĐANG giao cho người đó có resolvedAt trong khoảng (agent không tự Done ⇒ người duyệt
 *     kéo Review → Done, công vẫn tính cho agent được giao);
 *   - "bị trả lại" = dòng lịch sử statusId do NGƯỜI (actorKind USER) từ cột Review/Done về To-do/In-progress, trên
 *     thẻ đang giao cho agent (lấy assignee hiện tại — chấp nhận sai số như thiết kế);
 *   - returnRate = returned / (resolved + returned);
 *   - tiền agent: work_agent_usage (REPORTED = tự khai, GATEWAY = đo) — USD ước lượng, luôn kèm nguồn.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { displayName, PUBLIC_USER } from './common.js';
import { financeAccess, weekStartOf } from './financeRules.js';
import { addDays, zonedMidnight } from './projectTime.js';
import { agentForbidden, isClientScoped, loadWorkspaceAccess, requireProject } from './permissions.js';
import { modulesOf } from './studio.js';
import { vnDay } from './sprints.service.js';

const DAY = 86_400_000;
const REVIEW_NAME = /review|qa|verify|kiểm|duyệt/i;
const r2 = (n: number) => Math.round(n * 100) / 100;
const r4 = (n: number) => Math.round(n * 10_000) / 10_000;
const ratio = (a: number, b: number) => (b > 0 ? r4(a / b) : null);

interface Range { from: string; to: string; since: Date; until: Date }

function rangeOf(from: string | undefined, to: string | undefined, defDays: number, maxDays: number): Range {
  const t = to ?? vnDay();
  const f = from ?? addDays(t, -(defDays - 1));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f) || !/^\d{4}-\d{2}-\d{2}$/.test(t)) throw new BadRequestError('Use YYYY-MM-DD dates', 'WORK_BAD_DATES');
  if (f > t) throw new BadRequestError('"From" must be before "to"', 'WORK_BAD_DATES');
  if ((Date.parse(t) - Date.parse(f)) / DAY + 1 > maxDays) throw new BadRequestError(`Pick a range of at most ${maxDays} days`, 'WORK_BAD_DATES');
  return { from: f, to: t, since: zonedMidnight(f), until: zonedMidnight(addDays(t, 1)) };
}

/** Lần "bị trả lại" (Review/Done ⇒ việc) do người làm, trên thẻ đang giao cho một trong `assigneeIds`. */
async function returnedEvents(projectIds: number[], assigneeIds: number[], range: Range, issueWhere: Prisma.WorkIssueWhereInput = {}) {
  if (!assigneeIds.length || !projectIds.length) return [];
  const [rows, statuses] = await Promise.all([
    prisma.workHistory.findMany({
      where: { field: 'statusId', actorKind: 'USER', createdAt: { gte: range.since, lt: range.until }, issue: { projectId: { in: projectIds }, assigneeId: { in: assigneeIds }, deletedAt: null, ...issueWhere } },
      select: { fromValue: true, toValue: true, createdAt: true, issue: { select: { id: true, assigneeId: true } } },
    }),
    prisma.workStatus.findMany({ where: { workflow: { projectId: { in: projectIds } } }, select: { id: true, name: true, category: true } }),
  ]);
  const st = new Map(statuses.map((s) => [s.id, s]));
  return rows.filter((h) => {
    const from = st.get(Number(h.fromValue));
    const to = st.get(Number(h.toValue));
    const fromReview = from && (from.category === 'DONE' || (from.category === 'IN_PROGRESS' && REVIEW_NAME.test(from.name)));
    const toWork = to && (to.category === 'TODO' || (to.category === 'IN_PROGRESS' && !REVIEW_NAME.test(to.name)));
    return !!fromReview && !!toWork;
  }).map((h) => ({ issueId: h.issue.id, assigneeId: h.issue.assigneeId!, at: h.createdAt }));
}

function leaseMinutes(l: { claimedAt: Date; releasedAt: Date | null; expiresAt: Date; status: string }, now: Date): number {
  const end = l.releasedAt ?? (l.status === 'ACTIVE' ? now : l.expiresAt);
  return Math.max(0, Math.round((Math.min(end.getTime(), now.getTime()) - l.claimedAt.getTime()) / 60_000));
}

const AGENT_SEL = {
  id: true, userId: true, model: true, status: true, lastSeenAt: true,
  user: { select: { username: true, fullName: true, displayName: true } },
  owner: { select: PUBLIC_USER },
} satisfies Prisma.WorkAgentSelect;
type AgentRow = Prisma.WorkAgentGetPayload<{ select: typeof AGENT_SEL }>;
const agentView = (a: AgentRow) => ({ id: a.id, userId: a.userId, username: a.user.username, displayName: displayName(a.user), model: a.model, status: a.status, owner: a.owner });

// ─── Báo cáo dự án ───────────────────────────────────────────────

export async function projectAgentReport(userId: number, projectId: number, q: { from?: string; to?: string; sprintId?: number }) {
  const access = await requireProject(userId, projectId, 'project.view');
  if (isClientScoped(access)) throw new ForbiddenError('Not available in the client portal');
  let from = q.from;
  let to = q.to;
  if (q.sprintId) {
    const s = await prisma.workSprint.findFirst({ where: { id: q.sprintId, projectId }, select: { startAt: true, endAt: true, completedAt: true, createdAt: true } });
    if (!s) throw new NotFoundError('Sprint not found');
    from ??= vnDay(s.startAt ?? s.createdAt);
    to ??= vnDay(s.completedAt ?? s.endAt ?? new Date());
    if (to < from) to = from;
  }
  const range = rangeOf(from, to, 30, 92);
  const issueWhere: Prisma.WorkIssueWhereInput = q.sprintId ? { sprintId: q.sprintId } : {};
  const now = new Date();

  const agents = await prisma.workAgent.findMany({ where: { workspaceId: access.workspaceId }, orderBy: { id: 'asc' }, select: AGENT_SEL });
  const agentUserIds = agents.map((a) => a.userId);
  const sprintIssueIds = q.sprintId ? (await prisma.workIssue.findMany({ where: { projectId, sprintId: q.sprintId }, select: { id: true } })).map((i) => i.id) : null;

  const [resolved, returned, leases, logs, usage, touchedHist, touchedComments, projMembers, project] = await Promise.all([
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, resolvedAt: { gte: range.since, lt: range.until }, assigneeId: { not: null }, ...issueWhere },
      select: { id: true, assigneeId: true, storyPoints: true },
    }),
    returnedEvents([projectId], agentUserIds, range, issueWhere),
    prisma.workAgentLease.findMany({
      where: { projectId, agentId: { in: agents.map((a) => a.id) }, claimedAt: { gte: range.since, lt: range.until }, ...(sprintIssueIds ? { issueId: { in: sprintIssueIds } } : {}) },
      select: { agentId: true, issueId: true, claimedAt: true, releasedAt: true, expiresAt: true, status: true },
    }),
    prisma.workWorklog.findMany({
      where: { issue: { projectId, deletedAt: null, ...issueWhere }, startedAt: { gte: range.since, lt: range.until } },
      select: { userId: true, minutes: true, source: true, user: { select: PUBLIC_USER } },
    }),
    prisma.workAgentUsage.findMany({
      where: { projectId, createdAt: { gte: range.since, lt: range.until }, ...(sprintIssueIds ? { issueId: { in: sprintIssueIds } } : {}) },
      select: { agentId: true, issueId: true, inputTokens: true, outputTokens: true, cacheReadTokens: true, costUsd: true, source: true },
    }),
    agentUserIds.length ? prisma.workHistory.findMany({
      where: { actorId: { in: agentUserIds }, createdAt: { gte: range.since, lt: range.until }, issue: { projectId, ...issueWhere } },
      select: { actorId: true, issueId: true }, distinct: ['actorId', 'issueId'],
    }) : Promise.resolve([]),
    agentUserIds.length ? prisma.workComment.findMany({
      where: { authorId: { in: agentUserIds }, createdAt: { gte: range.since, lt: range.until }, deletedAt: null, issue: { projectId, ...issueWhere } },
      select: { authorId: true, issueId: true }, distinct: ['authorId', 'issueId'],
    }) : Promise.resolve([]),
    prisma.workProjectMember.findMany({ where: { projectId, userId: { in: agentUserIds } }, select: { userId: true } }),
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } }),
  ]);
  const memberSet = new Set(projMembers.map((m) => m.userId));

  const rows = agents.map((a) => {
    const res = resolved.filter((i) => i.assigneeId === a.userId);
    const ret = returned.filter((r) => r.assigneeId === a.userId).length;
    const ls = leases.filter((l) => l.agentId === a.id);
    const us = usage.filter((u) => u.agentId === a.id);
    const wl = logs.filter((l) => l.userId === a.userId);
    const touched = new Set<number>([
      ...touchedHist.filter((h) => h.actorId === a.userId).map((h) => h.issueId),
      ...touchedComments.filter((c) => c.authorId === a.userId).map((c) => c.issueId),
      ...ls.map((l) => l.issueId),
      ...us.map((u) => u.issueId).filter((x): x is number => !!x),
    ]);
    const cost = us.reduce((s, u) => s + Number(u.costUsd), 0);
    const reported = us.filter((u) => u.source !== 'GATEWAY').reduce((s, u) => s + Number(u.costUsd), 0);
    const points = res.reduce((s, i) => s + (i.storyPoints ?? 0), 0);
    return {
      agent: agentView(a),
      issuesTouched: touched.size,
      issuesResolved: res.length,
      pointsResolved: points,
      returnedCount: ret,
      returnRate: ratio(ret, res.length + ret) ?? 0,
      leaseMinutes: ls.reduce((s, l) => s + leaseMinutes(l, now), 0),
      worklogMinutes: wl.reduce((s, l) => s + l.minutes, 0),
      autoWorklogMinutes: wl.filter((l) => l.source === 'AGENT_AUTO').reduce((s, l) => s + l.minutes, 0),
      tokens: { in: us.reduce((s, u) => s + u.inputTokens, 0), out: us.reduce((s, u) => s + u.outputTokens, 0), cacheRead: us.reduce((s, u) => s + u.cacheReadTokens, 0) },
      costUsd: r4(cost),
      costSource: { reported: r4(reported), gateway: r4(cost - reported) },
      costPerPoint: ratio(cost, points),
      costPerResolved: ratio(cost, res.length),
      _member: memberSet.has(a.userId),
    };
  }).filter((r) => (r._member && r.agent.status !== 'RETIRED') || r.issuesTouched || r.issuesResolved || r.returnedCount || r.worklogMinutes || r.costUsd || r.leaseMinutes)
    .map(({ _member, ...r }) => r);

  // ── Người ──
  const settings = project.settings;
  const financeOn = modulesOf(settings).finance;
  const fa = financeAccess(access.role, access.workspaceRole, false);
  const showCost = financeOn && fa.manage && access.principal === 'HUMAN';
  const humanLogs = logs.filter((l) => l.user.kind !== 'AGENT');
  const humanIds = new Set<number>([...humanLogs.map((l) => l.userId), ...resolved.filter((i) => !agentUserIds.includes(i.assigneeId!)).map((i) => i.assigneeId!)]);
  const users = await prisma.user.findMany({ where: { id: { in: [...humanIds] } }, select: PUBLIC_USER });
  const costByUser = new Map<number, number>();
  if (showCost && humanIds.size) {
    const lines = await prisma.workTimesheetLine.findMany({
      where: { timesheet: { projectId, status: 'APPROVED', userId: { in: [...humanIds] } }, day: { gte: new Date(`${range.from}T00:00:00Z`), lte: new Date(`${range.to}T00:00:00Z`) }, ...(sprintIssueIds ? { issueId: { in: sprintIssueIds } } : {}) },
      select: { cost: true, timesheet: { select: { userId: true } } },
    });
    for (const l of lines) costByUser.set(l.timesheet.userId, (costByUser.get(l.timesheet.userId) ?? 0) + (l.cost ?? 0));
  }
  const humans = users.filter((u) => u.kind !== 'AGENT').map((u) => {
    const min = humanLogs.filter((l) => l.userId === u.id).reduce((s, l) => s + l.minutes, 0);
    return {
      user: u, worklogMinutes: min, hours: r2(min / 60),
      cost: showCost ? r2(costByUser.get(u.id) ?? 0) : null,
      issuesResolved: resolved.filter((i) => i.assigneeId === u.id).length,
    };
  }).sort((a, b) => b.worklogMinutes - a.worklogMinutes);

  const sum = <T>(xs: T[], f: (x: T) => number) => xs.reduce((s, x) => s + f(x), 0);
  const aCost = sum(rows, (r) => r.costUsd);
  const aRes = sum(rows, (r) => r.issuesResolved);
  const aRet = sum(rows, (r) => r.returnedCount);
  const aPts = sum(rows, (r) => r.pointsResolved);
  const currency = showCost ? ((await prisma.workFinanceSettings.findUnique({ where: { projectId }, select: { currency: true } }))?.currency ?? 'VND') : null;
  const hMin = sum(humans, (h) => h.worklogMinutes);
  return {
    from: range.from, to: range.to, sprintId: q.sprintId ?? null,
    agents: rows,
    humans,
    totals: {
      agents: {
        issuesResolved: aRes, returnedCount: aRet, returnRate: ratio(aRet, aRes + aRet) ?? 0, pointsResolved: aPts,
        costUsd: r4(aCost), costSource: { reported: r4(sum(rows, (r) => r.costSource.reported)), gateway: r4(sum(rows, (r) => r.costSource.gateway)) },
        tokens: { in: sum(rows, (r) => r.tokens.in), out: sum(rows, (r) => r.tokens.out), cacheRead: sum(rows, (r) => r.tokens.cacheRead) },
        leaseMinutes: sum(rows, (r) => r.leaseMinutes), worklogMinutes: sum(rows, (r) => r.worklogMinutes),
        costPerPoint: ratio(aCost, aPts), costPerResolved: ratio(aCost, aRes),
      },
      humans: { hours: r2(hMin / 60), worklogMinutes: hMin, cost: showCost ? r2(sum(humans, (h) => h.cost ?? 0)) : null, issuesResolved: sum(humans, (h) => h.issuesResolved) },
    },
    currency,
  };
}

// ─── Dashboard không gian ────────────────────────────────────────

export async function workspaceAgentDashboard(callerId: number, workspaceId: number, q: { days?: number }) {
  const wa = await loadWorkspaceAccess(callerId, workspaceId);
  if (!wa) throw new NotFoundError('Workspace not found');
  if (wa.principal === 'AGENT') throw await agentForbidden(callerId, 'see the agents dashboard');
  if (wa.role === 'GUEST') throw new ForbiddenError('Guests cannot see the agents dashboard');
  const isAdmin = wa.role === 'OWNER' || wa.role === 'ADMIN';
  const days = Math.min(Math.max(Math.round(q.days ?? 30), 7), 180);
  const range = rangeOf(undefined, undefined, days, 180);
  const now = new Date();

  const [agents, projects] = await Promise.all([
    prisma.workAgent.findMany({ where: { workspaceId, ...(isAdmin ? {} : { ownerId: callerId }) }, orderBy: { id: 'asc' }, select: AGENT_SEL }),
    prisma.workProject.findMany({ where: { workspaceId, deletedAt: null }, select: { id: true } }),
  ]);
  const pids = projects.map((p) => p.id);
  const agentUserIds = agents.map((a) => a.userId);
  const [resolved, returned, usage, leases, activeLeases, humanLogs] = await Promise.all([
    prisma.workIssue.findMany({
      where: { projectId: { in: pids }, deletedAt: null, resolvedAt: { gte: range.since, lt: range.until }, assigneeId: isAdmin ? { not: null } : { in: agentUserIds } },
      select: { assigneeId: true, storyPoints: true, resolvedAt: true, assignee: { select: { kind: true } } },
    }),
    returnedEvents(pids, agentUserIds, range),
    prisma.workAgentUsage.findMany({ where: { agentId: { in: agents.map((a) => a.id) }, createdAt: { gte: range.since, lt: range.until } }, select: { agentId: true, inputTokens: true, outputTokens: true, cacheReadTokens: true, costUsd: true, source: true, createdAt: true } }),
    prisma.workAgentLease.findMany({ where: { agentId: { in: agents.map((a) => a.id) }, claimedAt: { gte: range.since, lt: range.until } }, select: { agentId: true, claimedAt: true, releasedAt: true, expiresAt: true, status: true } }),
    prisma.workAgentLease.groupBy({ by: ['agentId'], where: { agentId: { in: agents.map((a) => a.id) }, status: 'ACTIVE' }, _count: { _all: true } }),
    isAdmin ? prisma.workWorklog.findMany({ where: { issue: { projectId: { in: pids } }, startedAt: { gte: range.since, lt: range.until }, user: { kind: 'HUMAN' } }, select: { minutes: true, startedAt: true } }) : Promise.resolve([]),
  ]);
  const agentSet = new Set(agentUserIds);
  const wk = (d: Date) => weekStartOf(vnDay(d));
  const weeks: string[] = [];
  for (let w = weekStartOf(range.from); w <= weekStartOf(range.to); w = addDays(w, 7)) weeks.push(w);
  const weekRows = weeks.map((w) => ({
    weekStart: w,
    humanResolved: isAdmin ? resolved.filter((i) => i.assignee?.kind !== 'AGENT' && wk(i.resolvedAt!) === w).length : null,
    agentResolved: resolved.filter((i) => agentSet.has(i.assigneeId!) && wk(i.resolvedAt!) === w).length,
    agentReturned: returned.filter((r) => wk(r.at) === w).length,
    agentCostUsd: r4(usage.filter((u) => wk(u.createdAt) === w).reduce((s, u) => s + Number(u.costUsd), 0)),
    humanHours: isAdmin ? r2(humanLogs.filter((l) => wk(l.startedAt) === w).reduce((s, l) => s + l.minutes, 0) / 60) : null,
  }));
  const rows = agents.map((a) => {
    const res = resolved.filter((i) => i.assigneeId === a.userId);
    const ret = returned.filter((r) => r.assigneeId === a.userId).length;
    const us = usage.filter((u) => u.agentId === a.id);
    const cost = us.reduce((s, u) => s + Number(u.costUsd), 0);
    const reported = us.filter((u) => u.source !== 'GATEWAY').reduce((s, u) => s + Number(u.costUsd), 0);
    const points = res.reduce((s, i) => s + (i.storyPoints ?? 0), 0);
    return {
      agent: { ...agentView(a), lastSeenAt: a.lastSeenAt },
      issuesResolved: res.length, pointsResolved: points, returnedCount: ret, returnRate: ratio(ret, res.length + ret) ?? 0,
      costUsd: r4(cost), costSource: { reported: r4(reported), gateway: r4(cost - reported) }, costPerPoint: ratio(cost, points),
      tokens: { in: us.reduce((s, u) => s + u.inputTokens, 0), out: us.reduce((s, u) => s + u.outputTokens, 0), cacheRead: us.reduce((s, u) => s + u.cacheReadTokens, 0) },
      leaseMinutes: leases.filter((l) => l.agentId === a.id).reduce((s, l) => s + leaseMinutes(l, now), 0),
      activeLeases: activeLeases.find((x) => x.agentId === a.id)?._count._all ?? 0,
    };
  }).filter((r) => r.agent.status !== 'RETIRED' || r.issuesResolved || r.costUsd || r.leaseMinutes);
  const aRes = rows.reduce((s, r) => s + r.issuesResolved, 0);
  const aRet = rows.reduce((s, r) => s + r.returnedCount, 0);
  const aCost = rows.reduce((s, r) => s + r.costUsd, 0);
  return {
    days, from: range.from, to: range.to, scope: isAdmin ? 'ALL' : 'OWN',
    weeks: weekRows,
    agents: rows,
    totals: {
      humanResolved: isAdmin ? resolved.filter((i) => i.assignee?.kind !== 'AGENT').length : null,
      agentResolved: aRes, agentReturned: aRet, agentReturnRate: ratio(aRet, aRes + aRet) ?? 0,
      agentCostUsd: r4(aCost),
      humanHours: isAdmin ? r2(humanLogs.reduce((s, l) => s + l.minutes, 0) / 60) : null,
      costSource: { reported: r4(rows.reduce((s, r) => s + r.costSource.reported, 0)), gateway: r4(rows.reduce((s, r) => s + r.costSource.gateway, 0)) },
    },
  };
}
