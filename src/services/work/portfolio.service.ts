/**
 * CT Work — DANH MỤC DỰ ÁN (portfolio) + KHỐI LƯỢNG VIỆC nhiều dự án (đợt S3a, 04/10/2026).
 *
 * CHỈ ĐỌC dữ liệu sẵn có — không bảng mới, không ghi gì. Luật tính (RAG, quy đổi
 * giờ, năng lực) nằm THUẦN ở portfolioRules.ts; file này chỉ đọc DB và gọi luật.
 *
 * Quyền — hỏi permissions.ts, không tự so vai trò dự án:
 *   - Portfolio: thành viên không gian (requireWorkspace 'workspace.view'); mỗi dự án
 *     chỉ hiện khi `effectiveProjectRole` khác null ⇒ GUEST/VIEWER chỉ thấy dự án mình
 *     được thêm vào, dự án PRIVATE không lộ. Dự án mà người xem là khách bị cách ly
 *     (cổng khách S2b, `clientScopedProjectIds`) KHÔNG vào portfolio — số đếm nội bộ
 *     (quá hạn, sprint, phê duyệt) là chuyện của đội.
 *     Phụ thuộc liên dự án: phía dự án người xem KHÔNG thấy ⇒ chỉ báo "một dự án khác",
 *     không lộ mã/tiêu đề.
 *   - Workload: OWNER/ADMIN không gian xem mọi người; trưởng bộ phận (LEAD) xem người
 *     trong các bộ phận mình dẫn (+ chính mình); còn lại chỉ xem của mình. Thẻ chỉ lấy
 *     từ dự án người xem thấy được (`visibleProjectIds`, đã loại dự án cổng khách).
 */

import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError } from '../../middleware/errorHandler.js';
import { PUBLIC_USER } from './common.js';
import type { ProjectRole, ProjectVisibility } from './constants.js';
import { visibleProjectIds } from './myWork.service.js';
import { clientScopedProjectIds, effectiveProjectRole, governanceAccess, portalOnlyUserIds, requireWorkspace } from './permissions.js';
import {
  RAG_RULES, RAG_RULE_TEXT, WORKLOAD_RULES, addDays, daysBetween, issueHours, loadTone, mondayOf, personWeeks, ragOf, weeksOf,
  type HoursSource,
} from './portfolioRules.js';
import { activeSprintPace } from './sprintPace.js';
import { vnDay } from './sprints.service.js';
import { modulesOf, projectKindOf } from './studio.js';

const DAY = 86_400_000;
const r1 = (n: number) => Math.round(n * 10) / 10;
const dayOf = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : null);
/** Ngày DATE (00:00Z) của một chuỗi YYYY-MM-DD — so sánh với cột @db.Date. */
const dbDate = (s: string) => new Date(`${s}T00:00:00Z`);

/** Dự án người xem thấy trong không gian (kể cả đã lưu trữ), trừ dự án cổng khách. */
async function projectsInView(userId: number, workspaceId: number) {
  const wsRole = await requireWorkspace(userId, workspaceId, 'workspace.view');
  const [rows, portalOnly] = await Promise.all([
    prisma.workProject.findMany({
      where: { workspaceId, deletedAt: null },
      orderBy: [{ archivedAt: { sort: 'asc', nulls: 'first' } }, { name: 'asc' }],
      select: {
        id: true, key: true, name: true, type: true, template: true, kind: true, visibility: true, settings: true, archivedAt: true,
        clientRequest: { select: { id: true } },
        lead: { select: PUBLIC_USER },
        members: { where: { userId }, select: { role: true } },
      },
    }),
    clientScopedProjectIds(userId, workspaceId),
  ]);
  const out: Array<(typeof rows)[number] & { role: ProjectRole }> = [];
  for (const p of rows) {
    const role = effectiveProjectRole({
      workspaceRole: wsRole,
      projectRole: (p.members[0]?.role ?? null) as ProjectRole | null,
      visibility: p.visibility as ProjectVisibility,
    });
    if (!role || portalOnly.has(p.id)) continue;
    out.push({ ...p, role });
  }
  return { wsRole, projects: out };
}

/** Người xem có được xem workload của người khác không (dùng cho cả sidebar). */
async function workloadScope(userId: number, workspaceId: number, wsRole: string) {
  if (wsRole === 'OWNER' || wsRole === 'ADMIN') return { scope: 'ALL' as const, leadTeamIds: [] as number[] };
  if (wsRole === 'GUEST') return { scope: 'SELF' as const, leadTeamIds: [] as number[] };
  const led = await prisma.workTeamMember.findMany({
    where: { userId, role: 'LEAD', team: { workspaceId, archivedAt: null } },
    select: { teamId: true },
  });
  return led.length ? { scope: 'TEAMS' as const, leadTeamIds: led.map((t) => t.teamId) } : { scope: 'SELF' as const, leadTeamIds: [] };
}

// ═══ Portfolio ═════════════════════════════════════════════════════

export async function portfolio(userId: number, workspaceId: number, opts: { includeArchived?: boolean } = {}) {
  const { wsRole, projects: all } = await projectsInView(userId, workspaceId);
  const visibleIds = new Set(all.map((p) => p.id));
  const projects = all.filter((p) => opts.includeArchived || !p.archivedAt);
  const ids = projects.map((p) => p.id);
  const today = vnDay();
  const now = new Date();
  const since14 = new Date(now.getTime() - 14 * DAY);
  const wl = await workloadScope(userId, workspaceId, wsRole);

  if (!ids.length) {
    return {
      today, rules: RAG_RULE_TEXT, thresholds: RAG_RULES, projects: [], milestones: [], blockers: [],
      canSeeWorkload: wsRole !== 'GUEST', workloadScope: wl.scope,
    };
  }

  const issueBase = { projectId: { in: ids }, deletedAt: null, type: { level: 0 } };
  const [openG, overdueG, doneG, approvalsG, versions, stages, links] = await Promise.all([
    prisma.workIssue.groupBy({ by: ['projectId'], where: { ...issueBase, resolvedAt: null }, _count: { _all: true } }),
    prisma.workIssue.groupBy({ by: ['projectId'], where: { ...issueBase, resolvedAt: null, dueDate: { lt: dbDate(today) } }, _count: { _all: true } }),
    prisma.workIssue.groupBy({ by: ['projectId'], where: { ...issueBase, resolvedAt: { gte: since14 } }, _count: { _all: true } }),
    prisma.workApproval.groupBy({ by: ['projectId'], where: { projectId: { in: ids }, status: 'PENDING' }, _count: { _all: true }, _min: { createdAt: true } }),
    prisma.workVersion.findMany({
      where: { projectId: { in: ids }, status: 'UNRELEASED', releaseDate: { not: null } },
      orderBy: [{ releaseDate: 'asc' }, { id: 'asc' }],
      select: { id: true, projectId: true, name: true, releaseDate: true },
    }),
    prisma.workStage.findMany({
      where: { projectId: { in: ids } },
      orderBy: [{ projectId: 'asc' }, { n: 'asc' }],
      select: { id: true, projectId: true, n: true, name: true, slug: true, status: true },
    }),
    // BLOCKS lưu một chiều "from chặn to". Lấy mọi cạnh chạm dự án trong danh mục, rồi giữ cạnh liên dự án.
    prisma.workIssueLink.findMany({
      where: {
        type: 'BLOCKS',
        fromIssue: { deletedAt: null, resolvedAt: null, project: { deletedAt: null } },
        toIssue: { deletedAt: null, resolvedAt: null, project: { deletedAt: null } },
        OR: [{ fromIssue: { projectId: { in: ids } } }, { toIssue: { projectId: { in: ids } } }],
      },
      take: 2000,
      select: {
        id: true, createdAt: true,
        fromIssue: { select: { id: true, number: true, title: true, projectId: true, dueDate: true, project: { select: { key: true, name: true } } } },
        toIssue: { select: { id: true, number: true, title: true, projectId: true, dueDate: true, project: { select: { key: true, name: true } } } },
      },
    }),
  ]);
  const versionCounts = versions.length
    ? await prisma.workIssue.groupBy({
      by: ['fixVersionId', 'resolvedAt'],
      where: { fixVersionId: { in: versions.map((v) => v.id) }, deletedAt: null, type: { level: { gte: 0 } } },
      _count: { _all: true },
    })
    : [];
  const count = (g: Array<{ projectId: number; _count: { _all: number } }>, pid: number) => g.find((x) => x.projectId === pid)?._count._all ?? 0;

  // Đợt S3b: rủi ro OPEN đã chấm điểm + CR chờ quyết định — chỉ dự án bật mô-đun tương ứng.
  const raidIds = projects.filter((p) => modulesOf(p.settings).raid).map((p) => p.id);
  const crIds = projects.filter((p) => modulesOf(p.settings).changeRequests).map((p) => p.id);
  const [openRiskRows, pendingCrRows] = await Promise.all([
    raidIds.length
      ? prisma.workRaidItem.findMany({
        where: { projectId: { in: raidIds }, deletedAt: null, type: 'RISK', status: 'OPEN', probability: { not: null }, impact: { not: null } },
        select: { projectId: true, number: true, title: true, probability: true, impact: true },
        take: 5000,
      })
      : Promise.resolve([]),
    crIds.length
      ? prisma.workChangeRequest.findMany({
        where: { projectId: { in: crIds }, deletedAt: null, status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
        select: { projectId: true, number: true, submittedAt: true, createdAt: true },
        take: 5000,
      })
      : Promise.resolve([]),
  ]);

  // Đợt S5a: SLA service desk — chỉ dự án bật serviceDesk (một lượt đọc cho mọi dự án).
  const deskIds = projects.filter((p) => modulesOf(p.settings).serviceDesk).map((p) => p.id);
  const slaByProject = deskIds.length ? await (await import('./serviceDesk.service.js')).portfolioSla(deskIds, now.getTime()) : new Map();

  // Phụ thuộc liên dự án — ẩn mã/tiêu đề phía dự án người xem không thấy.
  const side = (i: (typeof links)[number]['fromIssue']) => (visibleIds.has(i.projectId)
    ? { hidden: false as const, projectId: i.projectId, key: `${i.project.key}-${i.number}`, projectKey: i.project.key, projectName: i.project.name, number: i.number, title: i.title, dueDate: dayOf(i.dueDate) }
    : { hidden: true as const, projectId: null, key: null, projectKey: null, projectName: null, number: null, title: null, dueDate: null });
  const cross = links.filter((l) => l.fromIssue.projectId !== l.toIssue.projectId);
  const blockers = cross
    .filter((l) => visibleIds.has(l.fromIssue.projectId) || visibleIds.has(l.toIssue.projectId))
    .map((l) => ({ id: l.id, since: l.createdAt, blocker: side(l.fromIssue), blocked: side(l.toIssue) }));

  const ws = await prisma.workSpace.findUniqueOrThrow({ where: { id: workspaceId }, select: { slug: true } });
  const rows = [];
  for (const p of projects) {
    const modules = modulesOf(p.settings);
    const unit = (p.settings as { estimation?: string } | null)?.estimation === 'HOURS' ? 'HOURS' as const : 'POINTS' as const;
    const pace = await activeSprintPace(p.id, now);
    const sprint = pace ? {
      name: pace.sprint, status: pace.status, summary: pace.summary, daysLeft: pace.daysLeft, remaining: pace.remaining,
      total: pace.total, done: pace.done, neededPerDay: pace.neededPerDay, recentPerDay: pace.recentPerDay, unit,
    } : null;

    // Giai đoạn: chỉ khi mô-đun stages bật (dự án cũ không có giai đoạn ⇒ null).
    let stage = null as null | { current: { n: number; name: string; slug: string; status: string } | null; done: number; total: number; percent: number };
    if (modules.stages) {
      const mine = stages.filter((s) => s.projectId === p.id);
      if (mine.length) {
        const doneN = mine.filter((s) => s.status === 'DONE').length;
        const cur = mine.find((s) => s.status === 'ACTIVE' || s.status === 'GATE_REVIEW') ?? (doneN === mine.length ? mine[mine.length - 1] : mine.find((s) => s.status !== 'DONE')) ?? null;
        stage = {
          current: cur ? { n: cur.n, name: cur.name, slug: cur.slug, status: cur.status } : null,
          done: doneN, total: mine.length, percent: Math.round((doneN / mine.length) * 100),
        };
      }
    }

    const milestones = versions.filter((v) => v.projectId === p.id).map((v) => {
      const date = dayOf(v.releaseDate)!;
      const vc = versionCounts.filter((c) => c.fixVersionId === v.id);
      const total = vc.reduce((n, c) => n + c._count._all, 0);
      const done = vc.filter((c) => c.resolvedAt !== null).reduce((n, c) => n + c._count._all, 0);
      return { id: v.id, name: v.name, date, daysUntil: daysBetween(today, date), total, done };
    });

    const ap = approvalsG.find((a) => a.projectId === p.id);
    const pendingApprovals = ap?._count._all ?? 0;
    const oldestPendingApprovalDays = ap?._min.createdAt ? Math.floor((now.getTime() - ap._min.createdAt.getTime()) / DAY) : null;
    const blockedIssues = new Set(cross.filter((l) => l.toIssue.projectId === p.id).map((l) => l.toIssue.id));
    const blockingIssues = new Set(cross.filter((l) => l.fromIssue.projectId === p.id).map((l) => l.fromIssue.id));
    const open = count(openG, p.id);
    const overdue = count(overdueG, p.id);
    // Người không đọc được sổ RAID/CR của dự án (khách GUEST không phải giảng viên) ⇒ không tính luật S3b.
    const govView = governanceAccess(p.role, wsRole).view;
    const openRisks = openRiskRows.filter((r) => govView && r.projectId === p.id).map((r) => ({ key: `R-${r.number}`, title: r.title, score: r.probability! * r.impact! }));
    const pendingChangeRequests = pendingCrRows.filter((c) => govView && c.projectId === p.id)
      .map((c) => ({ key: `CR-${c.number}`, waitingDays: Math.floor((now.getTime() - (c.submittedAt ?? c.createdAt).getTime()) / DAY) }));
    const health = ragOf({
      open, overdue, sprint, milestones, blockedBy: blockedIssues.size, pendingApprovals, oldestPendingApprovalDays,
      openRisks, pendingChangeRequests,
      // Người không đọc được hàng đợi service desk (khách/GUEST) ⇒ không tính luật S5a (cùng luật "người của đội").
      sla: govView ? slaByProject.get(p.id) ?? null : null,
    });

    rows.push({
      id: p.id, key: p.key, name: p.name, type: p.type, role: p.role, archivedAt: p.archivedAt,
      kind: projectKindOf({ kind: p.kind, template: p.template, fromClientRequest: !!p.clientRequest }),
      lead: p.lead,
      url: `/work/${ws.slug}/${p.key}/board`,
      modules: { stages: modules.stages, approvals: modules.approvals, teams: modules.teams },
      counts: { open, overdue, done14: count(doneG, p.id) },
      sprint,
      stage,
      approvals: { pending: pendingApprovals, oldestDays: oldestPendingApprovalDays },
      milestones,
      nextMilestone: milestones.find((m) => m.daysUntil >= 0) ?? null,
      dependencies: { blockedBy: blockedIssues.size, blocking: blockingIssues.size },
      health,
    });
  }

  // Dải mốc gộp các dự án: trễ + 90 ngày tới, theo ngày.
  const allMilestones = rows
    .flatMap((r) => r.milestones.filter((m) => m.daysUntil <= 90).map((m) => ({ ...m, projectId: r.id, projectKey: r.key, projectName: r.name, url: `/work/${ws.slug}/${r.key}/releases` })))
    .sort((a, b) => a.date.localeCompare(b.date) || a.projectKey.localeCompare(b.projectKey));

  return {
    today, rules: RAG_RULE_TEXT, thresholds: RAG_RULES, projects: rows, milestones: allMilestones, blockers,
    canSeeWorkload: wsRole !== 'GUEST', workloadScope: wl.scope,
  };
}

// ═══ Workload ══════════════════════════════════════════════════════

export interface WorkloadQuery {
  from?: string;
  to?: string;
  teamId?: number;
  projectId?: number;
  hoursPerPoint?: number;
}

export async function workload(userId: number, workspaceId: number, q: WorkloadQuery = {}) {
  const wsRole = await requireWorkspace(userId, workspaceId, 'workspace.view');
  const wl = await workloadScope(userId, workspaceId, wsRole);
  const today = vnDay();
  const from = mondayOf(q.from ?? today);
  const to0 = q.to ?? addDays(from, 27);
  if (to0 < from) throw new BadRequestError('"to" must be on or after "from"', 'WORK_BAD_DATES');
  const weeks = weeksOf(from, to0);
  const to = weeks[weeks.length - 1].end;
  const hoursPerPoint = q.hoursPerPoint ?? WORKLOAD_RULES.DEFAULT_HOURS_PER_POINT;

  // Dự án trong phạm vi: người xem thấy được (đã loại cổng khách), thuộc không gian này, chưa lưu trữ.
  const visible = new Set(await visibleProjectIds(userId));
  const wsProjects = await prisma.workProject.findMany({
    where: { workspaceId, deletedAt: null, archivedAt: null, id: { in: [...visible] } },
    select: { id: true, key: true, name: true },
  });
  let projectIds = wsProjects.map((p) => p.id);
  if (q.projectId) {
    if (!projectIds.includes(q.projectId)) throw new BadRequestError('Project not found in this workspace', 'WORK_BAD_PROJECT');
    projectIds = [q.projectId];
  }

  // Bộ phận của không gian (cho gộp nhóm + lọc).
  const teams = wsRole === 'GUEST' ? [] : await prisma.workTeam.findMany({
    where: { workspaceId, archivedAt: null },
    orderBy: { name: 'asc' },
    select: { id: true, key: true, name: true, color: true, members: { select: { userId: true, role: true } } },
  });
  if (q.teamId) {
    const t = teams.find((x) => x.id === q.teamId);
    if (!t) throw new BadRequestError('Team not found', 'WORK_BAD_TEAM');
    if (wl.scope === 'SELF' || (wl.scope === 'TEAMS' && !wl.leadTeamIds.includes(t.id))) {
      throw new ForbiddenError('Only workspace admins and the team’s leads can see a team’s workload');
    }
  }

  // Người trong phạm vi.
  let people: number[];
  if (wl.scope === 'ALL') {
    const [m, portalOnly] = await Promise.all([
      prisma.workMember.findMany({ where: { workspaceId, role: { not: 'GUEST' } }, select: { userId: true } }),
      portalOnlyUserIds(workspaceId),
    ]);
    // MEMBER chỉ là khách cổng là khách, không phải nhân lực của đội.
    people = m.map((x) => x.userId).filter((u) => !portalOnly.has(u));
  } else if (wl.scope === 'TEAMS') {
    people = [...new Set([userId, ...teams.filter((t) => wl.leadTeamIds.includes(t.id)).flatMap((t) => t.members.map((m) => m.userId))])];
  } else {
    people = [userId];
  }
  if (q.teamId) {
    const t = teams.find((x) => x.id === q.teamId)!;
    const inTeam = new Set(t.members.map((m) => m.userId));
    people = people.filter((u) => inTeam.has(u));
  }

  const issues = projectIds.length && people.length ? await prisma.workIssue.findMany({
    where: {
      projectId: { in: projectIds }, assigneeId: { in: people }, deletedAt: null, resolvedAt: null,
      type: { level: { not: 1 } },
      OR: [{ dueDate: null }, { dueDate: { lte: dbDate(to) } }],
    },
    orderBy: [{ dueDate: { sort: 'asc', nulls: 'last' } }, { priority: 'asc' }, { id: 'asc' }],
    take: 5000,
    select: {
      id: true, number: true, title: true, priority: true, assigneeId: true, projectId: true, startDate: true, dueDate: true,
      storyPoints: true, originalEstimateMin: true, remainingEstimateMin: true, timeSpentMin: true, teamId: true,
      status: { select: { name: true, category: true } },
      type: { select: { key: true, name: true, color: true } },
      _count: { select: { children: { where: { deletedAt: null, OR: [{ originalEstimateMin: { not: null } }, { remainingEstimateMin: { not: null } }, { storyPoints: { not: null } }] } } } },
    },
  }) : [];

  // Thẻ quá hạn hơn khoảng xem mà hôm nay nằm ngoài khoảng ⇒ không vào lưới (allocate dồn về hôm nay).
  const [users, caps, timeOff, ws] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: people } }, select: PUBLIC_USER }),
    prisma.workProjectMember.findMany({
      where: { userId: { in: people }, projectId: { in: q.projectId ? [q.projectId] : wsProjects.map((p) => p.id) }, capacityHours: { not: null } },
      select: { userId: true, projectId: true, capacityHours: true },
    }),
    prisma.workTimeOff.findMany({
      where: { workspaceId, userId: { in: people }, startDate: { lte: dbDate(to) }, endDate: { gte: dbDate(from) } },
      select: { userId: true, startDate: true, endDate: true, note: true },
    }),
    prisma.workSpace.findUniqueOrThrow({ where: { id: workspaceId }, select: { slug: true } }),
  ]);
  const projById = new Map(wsProjects.map((p) => [p.id, p]));

  const rows = people.map((uid) => {
    const user = users.find((u) => u.id === uid);
    const myCaps = caps.filter((c) => c.userId === uid);
    const set = myCaps.reduce((s, c) => s + (c.capacityHours ?? 0), 0);
    const hoursPerDay = myCaps.length ? Math.min(WORKLOAD_RULES.MAX_HOURS_PER_DAY, r1(set)) : WORKLOAD_RULES.DEFAULT_HOURS_PER_DAY;
    const off = timeOff.filter((t) => t.userId === uid).map((t) => ({ start: dayOf(t.startDate)!, end: dayOf(t.endDate)!, note: t.note }));
    const mine = issues.filter((i) => i.assigneeId === uid).map((i) => {
      const h = issueHours({ ...i, hasEstimatedChildren: i._count.children > 0 }, hoursPerPoint);
      const p = projById.get(i.projectId)!;
      const due = dayOf(i.dueDate);
      return {
        id: i.id, key: `${p.key}-${i.number}`, number: i.number, title: i.title, priority: i.priority,
        project: { id: p.id, key: p.key, name: p.name }, teamId: i.teamId,
        start: dayOf(i.startDate), due, overdue: !!due && due < today,
        hours: h.hours, source: h.source as HoursSource,
        status: i.status, type: i.type,
        url: `/work/${ws.slug}/${p.key}/issue/${i.number}`,
      };
    });
    const weeksOut = personWeeks({ weeks, from, to, today, hoursPerDay, off, issues: mine });
    const totalHours = r1(weeksOut.reduce((s, w) => s + w.hours, 0));
    const totalCapacity = r1(weeksOut.reduce((s, w) => s + w.capacity, 0));
    const inGrid = new Set(weeksOut.flatMap((w) => w.issueIds));
    return {
      user: user ?? { id: uid, username: `user${uid}`, fullName: null, displayName: null, avatarUrl: null },
      teamIds: teams.filter((t) => t.members.some((m) => m.userId === uid)).map((t) => t.id),
      hoursPerDay,
      capacitySource: myCaps.length ? 'projects' as const : 'default' as const,
      timeOff: off,
      weeks: weeksOut,
      totalHours,
      totalCapacity,
      ...loadTone(totalHours, totalCapacity),
      overloaded: weeksOut.some((w) => w.overloaded),
      overloadedWeeks: weeksOut.filter((w) => w.overloaded).map((w) => w.start),
      unscheduled: mine.filter((i) => !i.due).length,
      unestimated: mine.filter((i) => i.source === 'none' && inGrid.has(i.id)).length,
      issues: mine.filter((i) => inGrid.has(i.id) || !i.due),
    };
  }).sort((a, b) => Number(b.overloaded) - Number(a.overloaded) || (b.pct ?? 0) - (a.pct ?? 0) || a.user.username.localeCompare(b.user.username));

  // Gộp theo bộ phận (chỉ bộ phận có người trong phạm vi).
  const teamRows = teams
    .filter((t) => !q.teamId || t.id === q.teamId)
    .map((t) => {
      const ids = new Set(t.members.map((m) => m.userId));
      const members = rows.filter((r) => ids.has(r.user.id));
      if (!members.length) return null;
      const tw = weeks.map((w, i) => {
        const hours = r1(members.reduce((s, m) => s + m.weeks[i].hours, 0));
        const capacity = r1(members.reduce((s, m) => s + m.weeks[i].capacity, 0));
        return { start: w.start, end: w.end, hours, capacity, ...loadTone(hours, capacity) };
      });
      return {
        id: t.id, key: t.key, name: t.name, color: t.color, memberIds: members.map((m) => m.user.id),
        leadIds: t.members.filter((m) => m.role === 'LEAD').map((m) => m.userId),
        weeks: tw, overloadedPeople: members.filter((m) => m.overloaded).length,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return {
    from, to, today, weeks, scope: wl.scope, hoursPerPoint,
    rules: {
      defaultHoursPerDay: WORKLOAD_RULES.DEFAULT_HOURS_PER_DAY, overloadPct: WORKLOAD_RULES.OVERLOAD_PCT, highPct: WORKLOAD_RULES.HIGH_PCT,
      conversion: [
        'Remaining estimate if set; otherwise original estimate minus time logged.',
        `No time estimate: story points × ${hoursPerPoint} h.`,
        'Nothing estimated: 0 h (counted as unestimated, never guessed).',
        'A parent whose sub-tasks are estimated counts 0 h itself (the sub-tasks carry the hours).',
        'Hours are spread evenly over working days from max(start date, today) to the due date; overdue work lands on the next working day from today.',
        `Capacity: the sum of hours/day set on each project (Reports → Capacity); none set ⇒ ${WORKLOAD_RULES.DEFAULT_HOURS_PER_DAY} h/day. Weekends and time off count as 0.`,
      ],
    },
    teams: teamRows,
    teamOptions: wl.scope === 'ALL' ? teams.map((t) => ({ id: t.id, key: t.key, name: t.name, color: t.color }))
      : teams.filter((t) => wl.leadTeamIds.includes(t.id)).map((t) => ({ id: t.id, key: t.key, name: t.name, color: t.color })),
    projectOptions: wsProjects.map((p) => ({ id: p.id, key: p.key, name: p.name })),
    people: rows,
    truncated: issues.length >= 5000,
  };
}
