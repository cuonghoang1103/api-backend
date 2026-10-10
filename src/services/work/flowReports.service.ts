/**
 * CT Work — báo cáo dòng chảy + KPI dự án (UX-B, 10/10/2026). Tải dữ liệu rồi giao phép tính cho flowMetrics.ts
 * (hàm thuần, có test đáp án tay). Không cần bảng chụp mới: mọi thứ dựng lại từ work_history.
 *
 * Hiệu năng: một lượt đọc = thẻ tầng 0 của dự án + dòng lịch sử statusId của chúng (+ fixVersionId cho release).
 * Dự án cỡ LFD (~400 thẻ, vài nghìn dòng lịch sử) đo dưới 300 ms mỗi tuyến (flowReports.db.test.ts in số đo).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { openIssueWhere } from './openIssues.js';
import { projectCached } from './projectCache.js';
import { requireProject } from './permissions.js';
import { activeSprintPace } from './sprintPace.js';
import { estimateOf, estimationOf, vnDay } from './sprints.service.js';
import {
  FLOW_SCOPE_TEXT, FLOW_TZ, cfdBands, computeAgingWip, computeCfd, computeCycleTimes, computeReleaseBurnup, computeThroughput,
  dayRange, percentiles, type FieldChange, type FlowIssue, type FlowStatus,
} from './flowMetrics.js';
import { addDays, dayDiff, dayKey } from './contribRules.js';

const DAY_MS = 86_400_000;

/** Thẻ "việc" của dòng chảy: tầng 0, chưa xoá, không phải test case. */
const FLOW_ISSUE_WHERE = { deletedAt: null, type: { level: 0 }, testCase: { is: null } } as const;

async function loadStatuses(projectId: number): Promise<FlowStatus[]> {
  const rows = await prisma.workStatus.findMany({
    where: { workflow: { projectId } },
    select: { id: true, name: true, category: true, position: true, color: true, workflow: { select: { isDefault: true } } },
  });
  return rows.map((s) => ({ id: s.id, name: s.name, category: s.category, position: s.position, color: s.color, isDefaultWorkflow: s.workflow.isDefault }));
}

/**
 * Đợt 6 (D3): đường nhanh SQL thô cho hai bộ lọc hay gặp (không lọc thêm / `resolvedAt >= from`) — 10k thẻ: 65 ms (Prisma,
 * hai truy vấn con type + testCase) ⇒ ~28 ms. Bộ lọc khác (WIP, release) vẫn đi Prisma như cũ.
 */
async function loadFlowIssuesFast(projectId: number, resolvedFrom: Date | null) {
  type R = { id: number; number: number; title: string; createdAt: Date; resolvedAt: Date | null; statusId: number; assigneeId: number | null; fixVersionId: number | null; storyPoints: number | null; originalEstimateMin: number | null };
  const since = resolvedFrom ? Prisma.sql`AND i.resolved_at >= ${resolvedFrom}` : Prisma.empty;
  return prisma.$queryRaw<R[]>`
    SELECT i.id, i.number, i.title, i.created_at AS "createdAt", i.resolved_at AS "resolvedAt", i.status_id AS "statusId",
           i.assignee_id AS "assigneeId", i.fix_version_id AS "fixVersionId", i.story_points AS "storyPoints", i.original_estimate_min AS "originalEstimateMin"
    FROM work_issues i JOIN work_issue_types t ON t.id = i.type_id
    WHERE i.project_id = ${projectId} AND i.deleted_at IS NULL AND t.level = 0
      AND NOT EXISTS (SELECT 1 FROM work_test_cases c WHERE c.issue_id = i.id) ${since}`;
}

async function loadFlowIssues(projectId: number, extra: Record<string, unknown> = {}) {
  const mode = await estimationOf(projectId);
  const keys = Object.keys(extra);
  const gte = (extra.resolvedAt as { gte?: unknown } | undefined)?.gte;
  if (!keys.length || (keys.length === 1 && gte instanceof Date && Object.keys(extra.resolvedAt as object).length === 1)) {
    const rows = await loadFlowIssuesFast(projectId, keys.length ? (gte as Date) : null);
    return { issues: rows.map((r): FlowIssue => ({ ...r, estimate: estimateOf(r, mode) })), unit: mode };
  }
  const rows = await prisma.workIssue.findMany({
    where: { projectId, ...FLOW_ISSUE_WHERE, ...extra },
    select: {
      id: true, number: true, title: true, createdAt: true, resolvedAt: true, statusId: true, assigneeId: true, fixVersionId: true,
      storyPoints: true, originalEstimateMin: true,
    },
  });
  const issues: FlowIssue[] = rows.map((r) => ({
    id: r.id, number: r.number, title: r.title, createdAt: r.createdAt, resolvedAt: r.resolvedAt, statusId: r.statusId,
    assigneeId: r.assigneeId, fixVersionId: r.fixVersionId, estimate: estimateOf(r, mode),
  }));
  return { issues, unit: mode };
}

async function loadChanges(issueIds: number[], field: 'statusId' | 'fixVersionId'): Promise<FieldChange[]> {
  if (!issueIds.length) return [];
  // Đợt 6 (D3): một tham số mảng (`= ANY`) thay cho 10k tham số `IN (…)` của Prisma — 15k dòng: 70 ms ⇒ ~40 ms.
  return prisma.$queryRaw<FieldChange[]>`
    SELECT issue_id AS "issueId", from_value AS "from", to_value AS "to", created_at AS "at"
    FROM work_history WHERE issue_id = ANY(${issueIds}::int[]) AND field = ${field}
    ORDER BY created_at ASC, id ASC`;
}

const catMap = (statuses: FlowStatus[]) => new Map(statuses.map((s) => [s.id, s.category]));

function clampDays(n: number | undefined, def: number, min: number, max: number) {
  if (n === undefined || !Number.isFinite(n)) return def;
  return Math.min(max, Math.max(min, Math.round(n)));
}

// ─── CFD ─────────────────────────────────────────────────────────

export async function cfd(userId: number, projectId: number, q: { days?: number } = {}) {
  await requireProject(userId, projectId, 'project.view');
  const days = clampDays(q.days, 30, 7, 180);
  const now = new Date();
  const today = vnDay(now);
  const range = dayRange(addDays(today, -(days - 1)), today);
  // Đợt 6 (D3): kết quả không phụ thuộc người xem ⇒ đệm ngắn theo dự án (single-flight + xoá khi dự án đổi).
  return projectCached(projectId, `cfd:${days}:${today}`, async () => {
    const [statuses, { issues }] = await Promise.all([loadStatuses(projectId), loadFlowIssues(projectId)]);
    // Thẻ đã xong TRƯỚC khoảng vẫn nằm trong dải Done (đúng nghĩa "tích luỹ").
    const statusChanges = await loadChanges(issues.map((i) => i.id), 'statusId');
    const r = computeCfd({ days: range, tz: FLOW_TZ, now, statuses, issues, statusChanges });
    return { scope: FLOW_SCOPE_TEXT, days, from: range[0], to: today, bands: r.bands.map(({ statusIds: _s, ...b }) => b), points: r.points };
  });
}

// ─── Cycle / lead time ───────────────────────────────────────────

export async function cycleTime(userId: number, projectId: number, q: { days?: number } = {}) {
  await requireProject(userId, projectId, 'project.view');
  const days = clampDays(q.days, 90, 14, 365);
  const now = new Date();
  const from = new Date(now.getTime() - days * DAY_MS);
  return projectCached(projectId, `cycle:${days}:${vnDay(now)}`, async () => {
    const [statuses, { issues }] = await Promise.all([loadStatuses(projectId), loadFlowIssues(projectId, { resolvedAt: { gte: from } })]);
    const statusChanges = await loadChanges(issues.map((i) => i.id), 'statusId');
    const r = computeCycleTimes({ issues, statusChanges, statusCat: catMap(statuses), tz: FLOW_TZ, from });
    return { scope: FLOW_SCOPE_TEXT, days, from: dayKey(from, FLOW_TZ), to: vnDay(now), ...r };
  });
}

// ─── Throughput ──────────────────────────────────────────────────

export async function throughput(userId: number, projectId: number, q: { weeks?: number } = {}) {
  await requireProject(userId, projectId, 'project.view');
  const weeks = clampDays(q.weeks, 12, 4, 52);
  const now = new Date();
  const from = new Date(now.getTime() - (weeks + 1) * 7 * DAY_MS);
  const { issues, unit } = await loadFlowIssues(projectId, { resolvedAt: { gte: from } });
  const r = computeThroughput({ issues, tz: FLOW_TZ, today: vnDay(now), weeks });
  return { scope: FLOW_SCOPE_TEXT, unit, ...r };
}

// ─── Aging WIP ───────────────────────────────────────────────────

export async function agingWip(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const now = new Date();
  const statuses = await loadStatuses(projectId);
  const inProgress = statuses.filter((s) => s.category === 'IN_PROGRESS').map((s) => s.id);
  const from = new Date(now.getTime() - 90 * DAY_MS);
  const [{ issues: wip }, { issues: done }] = await Promise.all([
    loadFlowIssues(projectId, { resolvedAt: null, statusId: { in: inProgress } }),
    loadFlowIssues(projectId, { resolvedAt: { gte: from } }),
  ]);
  const [wipChanges, doneChanges] = await Promise.all([
    loadChanges(wip.map((i) => i.id), 'statusId'),
    loadChanges(done.map((i) => i.id), 'statusId'),
  ]);
  const cat = catMap(statuses);
  const bands = cfdBands(statuses).filter((b) => b.category === 'IN_PROGRESS');
  const items = computeAgingWip({ issues: wip, statusChanges: wipChanges, statusCat: cat, bands, now });
  // Mốc tham chiếu: phân vị cycle time 90 ngày qua — thẻ già hơn P85 là thẻ đáng hỏi.
  const ref = computeCycleTimes({ issues: done, statusChanges: doneChanges, statusCat: cat, tz: FLOW_TZ, from }).cycle;
  return { scope: FLOW_SCOPE_TEXT, bands: bands.map(({ statusIds: _s, ...b }) => b), items, reference: ref };
}

// ─── Release burnup ──────────────────────────────────────────────

export async function releaseBurnup(userId: number, projectId: number, versionId: number, q: { by?: 'count' | 'estimate' } = {}) {
  await requireProject(userId, projectId, 'project.view');
  const v = await prisma.workVersion.findFirst({
    where: { id: versionId, projectId },
    select: { id: true, name: true, status: true, startDate: true, releaseDate: true, releasedAt: true, createdAt: true },
  });
  if (!v) throw new NotFoundError('Version not found');
  const now = new Date();
  const today = vnDay(now);
  // Thẻ từng gắn version (kể cả đã gỡ) — lịch sử fixVersionId nhắc tới version này, cộng thẻ đang gắn.
  const touched = await prisma.workHistory.findMany({
    where: { field: 'fixVersionId', issue: { projectId }, OR: [{ fromValue: String(versionId) }, { toValue: String(versionId) }] },
    select: { issueId: true },
    distinct: ['issueId'],
  });
  const { issues, unit } = await loadFlowIssues(projectId, { OR: [{ fixVersionId: versionId }, { id: { in: touched.map((t) => t.issueId) } }] });
  const ids = issues.map((i) => i.id);
  const [statuses, statusChanges, versionChanges] = await Promise.all([loadStatuses(projectId), loadChanges(ids, 'statusId'), loadChanges(ids, 'fixVersionId')]);
  const startDay = v.startDate ? v.startDate.toISOString().slice(0, 10) : dayKey(v.createdAt, FLOW_TZ);
  const releaseDay = v.releaseDate ? v.releaseDate.toISOString().slice(0, 10) : null;
  const releasedDay = v.releasedAt ? dayKey(v.releasedAt, FLOW_TZ) : null;
  const endDay = releasedDay ?? today;
  if (dayDiff(startDay, endDay) < 0) {
    return { version: v, unit, byCount: false, points: [], scope: FLOW_SCOPE_TEXT, forecast: null };
  }
  const estimated = issues.some((i) => (i.estimate ?? 0) > 0);
  const byCount = q.by === 'count' || !estimated;
  const days = dayRange(startDay, endDay, 180);
  const points = computeReleaseBurnup({
    versionId, days, tz: FLOW_TZ, now, issues, versionChanges, statusChanges, statusCat: catMap(statuses), byCount, releaseDay,
  });
  // Dự báo đơn giản: tốc độ xong trung bình mỗi ngày từ đầu ⇒ ngày còn lại = remaining / tốc độ.
  const last = points[points.length - 1];
  const first = points[0];
  let forecast: string | null = null;
  if (last && first && !releasedDay) {
    const elapsed = Math.max(1, dayDiff(first.day, last.day));
    const rate = (last.done - first.done) / elapsed;
    if (last.remaining <= 0) forecast = last.day;
    else if (rate > 0) forecast = addDays(last.day, Math.ceil(last.remaining / rate));
  }
  return { version: v, unit, byCount, points, scope: FLOW_SCOPE_TEXT, forecast };
}

// ─── Tải theo người (widget) ─────────────────────────────────────

export async function loadByPerson(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const today = vnDay();
  const mode = await estimationOf(projectId);
  const rows = await prisma.workIssue.findMany({
    where: { projectId, ...openIssueWhere(), type: { level: { gte: 0, not: 1 } } },
    select: { assigneeId: true, dueDate: true, storyPoints: true, originalEstimateMin: true, status: { select: { category: true } }, flaggedAt: true },
  });
  const users = await prisma.user.findMany({
    where: { id: { in: [...new Set(rows.map((r) => r.assigneeId).filter((x): x is number => !!x))] } },
    select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
  });
  const by = new Map<number | null, { todo: number; inProgress: number; overdue: number; blocked: number; estimate: number }>();
  for (const r of rows) {
    const k = r.assigneeId ?? null;
    const a = by.get(k) ?? { todo: 0, inProgress: 0, overdue: 0, blocked: 0, estimate: 0 };
    if (r.status.category === 'IN_PROGRESS') a.inProgress += 1; else a.todo += 1;
    if (r.dueDate && r.dueDate.toISOString().slice(0, 10) < today) a.overdue += 1;
    if (r.flaggedAt) a.blocked += 1;
    a.estimate = Math.round((a.estimate + estimateOf(r, mode)) * 10) / 10;
    by.set(k, a);
  }
  const people = [...by.entries()].map(([id, v]) => ({ user: id ? users.find((u) => u.id === id) ?? null : null, ...v, total: v.todo + v.inProgress }))
    .sort((a, b) => Number(!a.user) - Number(!b.user) || b.total - a.total);
  return { unit: mode, people };
}

// ─── KPI dự án (widget, dashboard "Project overview") ─────────────

/**
 * Hàng KPI có XU HƯỚNG so với 7 ngày trước. Số "tuần trước" dựng lại từ dữ liệu (createdAt/resolvedAt/dueDate),
 * không cần bảng chụp:
 *   open(t)    = thẻ tầng ≥ 0 (không sub-task) tạo trước t và chưa xong tại t (định nghĩa chung openIssues.ts)
 *   overdue(t) = open(t) có hạn < ngày của t
 * Blocked không dựng lại được (cờ không có lịch sử) ⇒ không có xu hướng.
 */
export async function projectKpis(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * DAY_MS);
  const today = vnDay(now);
  const dayAgo = vnDay(weekAgo);
  const rows = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { level: { gte: 0 } }, OR: [{ resolvedAt: null }, { resolvedAt: { gte: weekAgo } }] },
    select: { createdAt: true, resolvedAt: true, dueDate: true, flaggedAt: true },
  });
  const openAt = (t: Date) => rows.filter((r) => r.createdAt <= t && (!r.resolvedAt || r.resolvedAt > t));
  const due = (r: { dueDate: Date | null }) => (r.dueDate ? r.dueDate.toISOString().slice(0, 10) : null);
  const openNow = openAt(now);
  const openThen = openAt(weekAgo);
  const overdueNow = openNow.filter((r) => { const d = due(r); return !!d && d < today; }).length;
  const overdueThen = openThen.filter((r) => { const d = due(r); return !!d && d < dayAgo; }).length;
  const blocked = openNow.filter((r) => r.flaggedAt).length;

  const pace = await activeSprintPace(projectId, now);
  let highRisks: number | null = null;
  if (access.modules.raid) {
    const risks = await prisma.workRaidItem.findMany({
      where: { projectId, deletedAt: null, type: 'RISK', status: { in: ['OPEN', 'MONITORING'] }, probability: { not: null }, impact: { not: null } },
      select: { probability: true, impact: true },
    });
    highRisks = risks.filter((r) => (r.probability ?? 0) * (r.impact ?? 0) >= 15).length;
  }
  return {
    asOf: now.toISOString(),
    open: { value: openNow.length, previous: openThen.length },
    overdue: { value: overdueNow, previous: overdueThen },
    blocked: { value: blocked, previous: null as number | null },
    sprint: pace ? {
      name: pace.sprint, status: pace.status, daysLeft: pace.daysLeft, total: pace.total, done: pace.done,
      pctDone: pace.total > 0 ? Math.round((pace.done / pace.total) * 100) : null,
    } : null,
    highRisks,
  };
}

/** Tham số sai ⇒ 400 rõ ràng (tuyến dùng). */
export function assertVersionId(n: number) {
  if (!Number.isInteger(n) || n <= 0) throw new BadRequestError('Pick a version', 'WORK_BAD_VERSION');
}

/** Dùng lại cho test: dải trạng thái của dự án. */
export const _test = { loadStatuses, loadFlowIssues, loadChanges, percentiles };
