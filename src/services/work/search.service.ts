/**
 * CT Work — tìm kiếm bằng JQL, bộ lọc đã lưu, dashboard + số liệu widget.
 */

import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { CARD_SELECT, toCard } from './issues.service.js';
import { compileJql, JqlError, parseJql, type JqlContext } from './jql.js';
import { requireProject } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { estimateOf, estimationOf, vnDay } from './sprints.service.js';

async function jqlContext(projectId: number, userId: number, key: string): Promise<JqlContext> {
  const [statuses, types, labels, components, members, sprints, customFields] = await Promise.all([
    prisma.workStatus.findMany({ where: { workflow: { projectId } }, select: { id: true, name: true, category: true } }),
    prisma.workIssueType.findMany({ where: { projectId }, select: { id: true, key: true, name: true } }),
    prisma.workLabel.findMany({ where: { projectId }, select: { id: true, name: true } }),
    prisma.workComponent.findMany({ where: { projectId }, select: { id: true, name: true } }),
    projectMembers(projectId),
    prisma.workSprint.findMany({ where: { projectId }, select: { id: true, name: true, state: true } }),
    prisma.workCustomField.findMany({ where: { projectId }, select: { id: true, name: true, kind: true, options: true } }),
  ]);
  return {
    projectKey: key, userId, statuses, types, labels, components,
    members: members.map((m) => ({ id: m.id, username: m.username })),
    sprints,
    customFields: customFields.map((f) => ({ ...f, options: (f.options as Array<{ id: string; label: string }>) ?? [] })),
  };
}

/** Dịch JQL ⇒ where của Prisma; lỗi cú pháp/tên thành 400 kèm vị trí. */
export async function compileFor(userId: number, projectId: number, query: string) {
  const access = await requireProject(userId, projectId, 'project.view');
  try {
    const ctx = await jqlContext(projectId, userId, access.key);
    const compiled = compileJql(parseJql(query.slice(0, 4000)), ctx);
    return { access, ...compiled };
  } catch (err) {
    if (err instanceof JqlError) throw new AppError(err.message, 400, 'WORK_JQL_ERROR', { position: err.pos, ...(err.suggestion ? { suggestion: err.suggestion } : {}) });
    throw err;
  }
}

export async function search(userId: number, projectId: number, query: string, opts: { limit?: number; offset?: number } = {}) {
  const { where, orderBy } = await compileFor(userId, projectId, query);
  const full: Prisma.WorkIssueWhereInput = { AND: [{ projectId, deletedAt: null }, where] };
  const limit = Math.min(Math.max(opts.limit ?? 100, 1), 500);
  const offset = Math.max(opts.offset ?? 0, 0);
  const [total, rows] = await Promise.all([
    prisma.workIssue.count({ where: full }),
    prisma.workIssue.findMany({ where: full, orderBy, skip: offset, take: limit, select: CARD_SELECT }),
  ]);
  return { total, items: rows.map(toCard), offset, limit };
}

/**
 * Như compileFor nhưng KHÔNG kiểm quyền người gọi — cho luật tự động chạy
 * dưới danh nghĩa hệ thống. currentUser() trỏ vào actorUserId (người tạo luật).
 */
export async function compileForSystem(projectId: number, query: string, actorUserId: number | null) {
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true } });
  try {
    return compileJql(parseJql(query.slice(0, 4000)), await jqlContext(projectId, actorUserId ?? 0, p.key));
  } catch (err) {
    if (err instanceof JqlError) throw new AppError(err.message, 400, 'WORK_JQL_ERROR', { position: err.pos, ...(err.suggestion ? { suggestion: err.suggestion } : {}) });
    throw err;
  }
}

// ─── Bộ lọc đã lưu ───────────────────────────────────────────────

export async function listFilters(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  return prisma.workSavedFilter.findMany({
    where: { projectId, OR: [{ ownerId: userId }, { shared: true }] },
    orderBy: [{ name: 'asc' }],
    select: { id: true, name: true, query: true, shared: true, ownerId: true, updatedAt: true, owner: { select: { username: true } } },
  });
}

export async function saveFilter(userId: number, projectId: number, input: { id?: number; name: string; query: string; shared?: boolean }) {
  await compileFor(userId, projectId, input.query); // chỉ lưu truy vấn hợp lệ
  const name = input.name.trim().slice(0, 100);
  if (!name) throw new BadRequestError('Filter name is required', 'WORK_NAME_REQUIRED');
  if (input.id) {
    const f = await prisma.workSavedFilter.findFirst({ where: { id: input.id, projectId } });
    if (!f) throw new NotFoundError('Filter not found');
    if (f.ownerId !== userId) throw new ForbiddenError('Only the owner can change this filter');
    return prisma.workSavedFilter.update({ where: { id: f.id }, data: { name, query: input.query, shared: input.shared ?? f.shared } });
  }
  return prisma.workSavedFilter.create({ data: { projectId, ownerId: userId, name, query: input.query, shared: input.shared ?? false } });
}

export async function deleteFilter(userId: number, projectId: number, filterId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const f = await prisma.workSavedFilter.findFirst({ where: { id: filterId, projectId } });
  if (!f) throw new NotFoundError('Filter not found');
  if (f.ownerId !== userId && access.role !== 'ADMIN') throw new ForbiddenError('Only the owner can delete this filter');
  await prisma.workSavedFilter.delete({ where: { id: f.id } });
}

// ─── Số liệu cho widget ──────────────────────────────────────────

export const GROUP_BYS = ['status', 'statusCategory', 'assignee', 'type', 'priority', 'label', 'sprint', 'component'] as const;
export type GroupBy = (typeof GROUP_BYS)[number];

/** Đếm (và cộng điểm) các thẻ khớp JQL theo một chiều. */
export async function stats(userId: number, projectId: number, query: string, groupBy: GroupBy) {
  const { where } = await compileFor(userId, projectId, query);
  const mode = await estimationOf(projectId);
  const rows = await prisma.workIssue.findMany({
    where: { AND: [{ projectId, deletedAt: null }, where] },
    take: 5000,
    select: {
      storyPoints: true, originalEstimateMin: true, priority: true, sprintId: true, assigneeId: true,
      status: { select: { id: true, name: true, category: true, color: true } },
      type: { select: { id: true, name: true, color: true } },
      labels: { select: { label: { select: { id: true, name: true, color: true } } } },
      components: { select: { component: { select: { id: true, name: true } } } },
    },
  });
  const [members, sprints] = await Promise.all([projectMembers(projectId), prisma.workSprint.findMany({ where: { projectId }, select: { id: true, name: true } })]);
  const PRI = ['', 'Highest', 'High', 'Medium', 'Low', 'Lowest'];
  const CAT: Record<string, string> = { TODO: 'To do', IN_PROGRESS: 'In progress', DONE: 'Done' };
  const buckets = new Map<string, { key: string; label: string; color?: string; count: number; points: number }>();
  const add = (key: string, label: string, pts: number, color?: string) => {
    const b = buckets.get(key) ?? { key, label, color, count: 0, points: 0 };
    b.count += 1;
    b.points = Math.round((b.points + pts) * 10) / 10;
    buckets.set(key, b);
  };
  for (const r of rows) {
    const pts = estimateOf(r, mode);
    switch (groupBy) {
      case 'status': add(`s${r.status.name}`, r.status.name, pts, r.status.color); break;
      case 'statusCategory': add(r.status.category, CAT[r.status.category] ?? r.status.category, pts); break;
      case 'assignee': {
        const m = members.find((x) => x.id === r.assigneeId);
        add(m ? `u${m.id}` : 'none', m ? m.displayName || m.fullName || m.username : 'Unassigned', pts);
        break;
      }
      case 'type': add(`t${r.type.name}`, r.type.name, pts, r.type.color); break;
      case 'priority': add(`p${r.priority}`, PRI[r.priority] ?? String(r.priority), pts); break;
      case 'sprint': {
        const s = sprints.find((x) => x.id === r.sprintId);
        add(s ? `sp${s.id}` : 'none', s ? s.name : 'Backlog', pts);
        break;
      }
      case 'label':
        if (!r.labels.length) add('none', 'No label', pts);
        for (const l of r.labels) add(`l${l.label.id}`, l.label.name, pts, l.label.color);
        break;
      case 'component':
        if (!r.components.length) add('none', 'No component', pts);
        for (const c of r.components) add(`c${c.component.id}`, c.component.name, pts);
        break;
    }
  }
  const list = [...buckets.values()].sort((a, b) => (groupBy === 'priority' ? a.key.localeCompare(b.key) : b.count - a.count));
  return { unit: mode, total: rows.length, groups: list };
}

/** Tạo mới vs hoàn thành mỗi ngày trong N ngày (giờ VN). */
export async function createdVsResolved(userId: number, projectId: number, days: number, query = '') {
  const { where } = await compileFor(userId, projectId, query);
  const n = Math.min(Math.max(days, 7), 90);
  const since = new Date(Date.now() - n * 86_400_000);
  const base: Prisma.WorkIssueWhereInput = { AND: [{ projectId, deletedAt: null }, where] };
  const [created, resolved] = await Promise.all([
    prisma.workIssue.findMany({ where: { AND: [base, { createdAt: { gte: since } }] }, select: { createdAt: true } }),
    prisma.workIssue.findMany({ where: { AND: [base, { resolvedAt: { gte: since } }] }, select: { resolvedAt: true } }),
  ]);
  const map = new Map<string, { day: string; created: number; resolved: number }>();
  for (let i = n; i >= 0; i--) {
    const d = vnDay(new Date(Date.now() - i * 86_400_000));
    map.set(d, { day: d, created: 0, resolved: 0 });
  }
  for (const c of created) { const b = map.get(vnDay(c.createdAt)); if (b) b.created += 1; }
  for (const r of resolved) { const b = map.get(vnDay(r.resolvedAt!)); if (b) b.resolved += 1; }
  return [...map.values()];
}

// ─── Dashboard ───────────────────────────────────────────────────

export const WIDGET_KINDS = ['filter', 'pie', 'bar', 'counter', 'created_resolved', 'burndown', 'my_issues', 'text', 'health'] as const;
export interface Widget {
  id: string;
  kind: (typeof WIDGET_KINDS)[number];
  title: string;
  query?: string;
  groupBy?: GroupBy;
  sprintId?: number | null;
  days?: number;
  text?: string;
  size?: 'half' | 'full';
}

async function validateWidgets(userId: number, projectId: number, widgets: Widget[]) {
  if (widgets.length > 30) throw new BadRequestError('A dashboard can have at most 30 widgets', 'WORK_LIMIT');
  for (const w of widgets) {
    if (!WIDGET_KINDS.includes(w.kind)) throw new BadRequestError(`Unknown widget "${w.kind}"`, 'WORK_BAD_WIDGET');
    if (w.query) await compileFor(userId, projectId, w.query);
    if ((w.kind === 'pie' || w.kind === 'bar') && !GROUP_BYS.includes(w.groupBy as GroupBy)) throw new BadRequestError('Choose what to group by', 'WORK_BAD_WIDGET');
  }
  return widgets.map((w) => ({ ...w, id: w.id || randomUUID().slice(0, 8), title: (w.title ?? '').slice(0, 80), text: w.text?.slice(0, 5000) }));
}

export async function listDashboards(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  return prisma.workDashboard.findMany({
    where: { projectId, OR: [{ ownerId: userId }, { shared: true }] },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, shared: true, ownerId: true, widgets: true, updatedAt: true },
  });
}

export async function saveDashboard(userId: number, projectId: number, input: { id?: number; name: string; shared?: boolean; widgets: Widget[] }) {
  const access = await requireProject(userId, projectId, 'project.view');
  const name = input.name.trim().slice(0, 100);
  if (!name) throw new BadRequestError('Dashboard name is required', 'WORK_NAME_REQUIRED');
  const widgets = await validateWidgets(userId, projectId, input.widgets);
  if (input.id) {
    const d = await prisma.workDashboard.findFirst({ where: { id: input.id, projectId } });
    if (!d) throw new NotFoundError('Dashboard not found');
    // Dashboard dùng chung: chủ hoặc ADMIN dự án sửa được.
    if (d.ownerId !== userId && access.role !== 'ADMIN') throw new ForbiddenError('Only the owner can change this dashboard');
    return prisma.workDashboard.update({ where: { id: d.id }, data: { name, shared: input.shared ?? d.shared, widgets: widgets as unknown as Prisma.InputJsonValue } });
  }
  return prisma.workDashboard.create({ data: { projectId, ownerId: userId, name, shared: input.shared ?? true, widgets: widgets as unknown as Prisma.InputJsonValue } });
}

export async function deleteDashboard(userId: number, projectId: number, dashboardId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const d = await prisma.workDashboard.findFirst({ where: { id: dashboardId, projectId } });
  if (!d) throw new NotFoundError('Dashboard not found');
  if (d.ownerId !== userId && access.role !== 'ADMIN') throw new ForbiddenError('Only the owner can delete this dashboard');
  await prisma.workDashboard.delete({ where: { id: d.id } });
}
