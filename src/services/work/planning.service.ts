/**
 * CT Work — kế hoạch dài hạn (đợt 6): version/release, timeline + đường găng,
 * capacity theo người + ngày nghỉ, ghi giờ (worklog) + báo cáo thời gian.
 *
 * Mọi thay đổi trường của thẻ vẫn đi qua applyIssueChange (lịch sử, 409,
 * sự kiện). Riêng worklog cập nhật timeSpentMin/remainingEstimateMin trong
 * cùng transaction với dòng worklog để tổng không bao giờ lệch.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { PUBLIC_USER, displayName } from './common.js';
import { emitWorkEvent, type WorkActor } from './events.js';
import { applyIssueChange } from './issueChange.js';
import { CARD_SELECT, toCard } from './issues.service.js';
import { loadProjectAccess, requireProject, requireWorkspace } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { estimateOf, estimationOf, vnDay } from './sprints.service.js';

const userActor = (userId: number): WorkActor => ({ kind: 'USER', userId });
const DAY = 86_400_000;
const round1 = (n: number) => Math.round(n * 10) / 10;

// ═══ Version / release ════════════════════════════════════════════

export const VERSION_STATUSES = ['UNRELEASED', 'RELEASED', 'ARCHIVED'] as const;

const VERSION_SELECT = {
  id: true, name: true, description: true, startDate: true, releaseDate: true, status: true, releasedAt: true,
  releaseNotes: true, position: true, createdAt: true,
} satisfies Prisma.WorkVersionSelect;

/** Tiến độ từng version: đếm thẻ tầng 0 (giống sprint — việc con không đếm đôi). */
export async function listVersions(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const [versions, counts] = await Promise.all([
    prisma.workVersion.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: VERSION_SELECT }),
    prisma.workIssue.groupBy({
      by: ['fixVersionId'],
      where: { projectId, deletedAt: null, fixVersionId: { not: null }, type: { level: { gte: 0 } } },
      _count: { _all: true },
    }),
    // Không dùng groupBy cho "xong" vì cần điều kiện resolvedAt — gộp ở dưới.
  ]);
  const done = await prisma.workIssue.groupBy({
    by: ['fixVersionId'],
    where: { projectId, deletedAt: null, fixVersionId: { not: null }, resolvedAt: { not: null }, type: { level: { gte: 0 } } },
    _count: { _all: true },
  });
  const today = vnDay();
  return versions.map((v) => {
    const total = counts.find((c) => c.fixVersionId === v.id)?._count._all ?? 0;
    const doneN = done.find((c) => c.fixVersionId === v.id)?._count._all ?? 0;
    const due = v.releaseDate ? v.releaseDate.toISOString().slice(0, 10) : null;
    return { ...v, total, done: doneN, overdue: v.status === 'UNRELEASED' && !!due && due < today };
  });
}

function dateOrNull(s: string | null | undefined): Date | null | undefined {
  if (s === undefined) return undefined;
  if (s === null || s === '') return null;
  return new Date(`${s}T00:00:00Z`);
}

export async function createVersion(userId: number, projectId: number, input: { name: string; description?: string | null; startDate?: string | null; releaseDate?: string | null }) {
  await requireProject(userId, projectId, 'sprint.manage');
  const name = input.name.trim().slice(0, 60);
  if (!name) throw new BadRequestError('Version name is required', 'WORK_NAME_REQUIRED');
  const start = dateOrNull(input.startDate) ?? null;
  const release = dateOrNull(input.releaseDate) ?? null;
  if (start && release && start > release) throw new BadRequestError('Start date must be before the release date', 'WORK_BAD_DATES');
  const max = await prisma.workVersion.aggregate({ where: { projectId }, _max: { position: true } });
  try {
    const v = await prisma.workVersion.create({
      data: { projectId, name, description: input.description?.trim() || null, startDate: start, releaseDate: release, position: (max._max.position ?? -1) + 1 },
      select: VERSION_SELECT,
    });
    emitWorkEvent({ type: 'project.updated', projectId, actor: userActor(userId) });
    return v;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictError(`A version named "${name}" already exists`);
    throw e;
  }
}

export async function updateVersion(
  userId: number, projectId: number, versionId: number,
  input: { name?: string; description?: string | null; startDate?: string | null; releaseDate?: string | null; status?: 'UNRELEASED' | 'ARCHIVED'; releaseNotes?: string | null },
) {
  await requireProject(userId, projectId, 'sprint.manage');
  const v = await prisma.workVersion.findFirst({ where: { id: versionId, projectId } });
  if (!v) throw new NotFoundError('Version not found');
  const data: Prisma.WorkVersionUpdateInput = {};
  if (input.name !== undefined) {
    const name = input.name.trim().slice(0, 60);
    if (!name) throw new BadRequestError('Version name is required', 'WORK_NAME_REQUIRED');
    data.name = name;
  }
  if (input.description !== undefined) data.description = input.description?.trim() || null;
  if (input.startDate !== undefined) data.startDate = dateOrNull(input.startDate);
  if (input.releaseDate !== undefined) data.releaseDate = dateOrNull(input.releaseDate);
  if (input.releaseNotes !== undefined) data.releaseNotes = input.releaseNotes?.slice(0, 50_000) || null;
  // "Bỏ phát hành" (RELEASED → UNRELEASED) được phép — phát hành nhầm là chuyện thường.
  if (input.status !== undefined) {
    data.status = input.status;
    if (input.status === 'UNRELEASED') data.releasedAt = null;
  }
  const s = (data.startDate ?? v.startDate) as Date | null;
  const r = (data.releaseDate ?? v.releaseDate) as Date | null;
  if (s && r && s > r) throw new BadRequestError('Start date must be before the release date', 'WORK_BAD_DATES');
  try {
    const out = await prisma.workVersion.update({ where: { id: v.id }, data, select: VERSION_SELECT });
    emitWorkEvent({ type: 'project.updated', projectId, actor: userActor(userId) });
    return out;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictError('A version with that name already exists');
    throw e;
  }
}

/**
 * Phát hành: thẻ chưa xong phải đi đâu đó — sang version khác hoặc bỏ khỏi
 * version. Phát hành mà để thẻ dở dang nằm lại thì release notes nói dối.
 */
export async function releaseVersion(userId: number, projectId: number, versionId: number, input: { moveUnresolvedTo: number | null; releaseDate?: string | null }) {
  await requireProject(userId, projectId, 'sprint.manage');
  const v = await prisma.workVersion.findFirst({ where: { id: versionId, projectId } });
  if (!v) throw new NotFoundError('Version not found');
  if (v.status === 'RELEASED') throw new BadRequestError('This version is already released', 'WORK_VERSION_RELEASED');
  if (input.moveUnresolvedTo !== null) {
    if (input.moveUnresolvedTo === versionId) throw new BadRequestError('Pick a different version for unfinished issues', 'WORK_BAD_VERSION');
    const target = await prisma.workVersion.findFirst({ where: { id: input.moveUnresolvedTo, projectId, status: 'UNRELEASED' } });
    if (!target) throw new BadRequestError('Target version must be an unreleased version of this project', 'WORK_BAD_VERSION');
  }
  const open = await prisma.workIssue.findMany({ where: { projectId, fixVersionId: versionId, deletedAt: null, resolvedAt: null }, select: { id: true } });
  for (const i of open) await applyIssueChange(i.id, { fixVersionId: input.moveUnresolvedTo }, userActor(userId));
  const out = await prisma.workVersion.update({
    where: { id: v.id },
    data: { status: 'RELEASED', releasedAt: new Date(), releaseDate: dateOrNull(input.releaseDate) ?? v.releaseDate ?? new Date(`${vnDay()}T00:00:00Z`) },
    select: VERSION_SELECT,
  });
  emitWorkEvent({ type: 'project.updated', projectId, actor: userActor(userId) });
  return { version: out, moved: open.length };
}

export async function deleteVersion(userId: number, projectId: number, versionId: number) {
  await requireProject(userId, projectId, 'sprint.manage');
  const v = await prisma.workVersion.findFirst({ where: { id: versionId, projectId } });
  if (!v) throw new NotFoundError('Version not found');
  // FK SET NULL gỡ version khỏi thẻ; ghi lịch sử từng thẻ thì đi qua cửa ghi.
  const tagged = await prisma.workIssue.findMany({ where: { projectId, fixVersionId: versionId, deletedAt: null }, select: { id: true } });
  for (const i of tagged) await applyIssueChange(i.id, { fixVersionId: null }, userActor(userId));
  await prisma.workVersion.delete({ where: { id: v.id } });
  emitWorkEvent({ type: 'project.updated', projectId, actor: userActor(userId) });
}

/** Chi tiết một version: thẻ theo nhóm trạng thái (dùng cho trang release + release notes). */
export async function versionDetail(userId: number, projectId: number, versionId: number) {
  await requireProject(userId, projectId, 'project.view');
  const v = await prisma.workVersion.findFirst({ where: { id: versionId, projectId }, select: VERSION_SELECT });
  if (!v) throw new NotFoundError('Version not found');
  const rows = await prisma.workIssue.findMany({
    where: { projectId, fixVersionId: versionId, deletedAt: null },
    orderBy: [{ rank: 'asc' }, { id: 'asc' }],
    select: CARD_SELECT,
  });
  return { version: v, issues: rows.map(toCard) };
}

// ═══ Timeline + đường găng ════════════════════════════════════════

/**
 * Dữ liệu timeline: epic + thẻ tầng 0 có ngày, phụ thuộc BLOCKS, và đường
 * găng (chuỗi phụ thuộc dài nhất tính theo số ngày) của các thẻ chưa xong.
 * Thẻ thiếu ngày bắt đầu lấy ngày tạo; thiếu hạn thì không vẽ thanh.
 */
export async function timeline(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const rows = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { level: { gte: 0 } } },
    orderBy: [{ rank: 'asc' }, { id: 'asc' }],
    take: 1500,
    select: {
      id: true, number: true, title: true, typeId: true, statusId: true, parentId: true, assigneeId: true, sprintId: true,
      fixVersionId: true, startDate: true, dueDate: true, resolvedAt: true, createdAt: true,
      type: { select: { level: true } },
      linksOut: { where: { type: 'BLOCKS', toIssue: { deletedAt: null } }, select: { toIssueId: true } },
      children: { where: { deletedAt: null }, select: { resolvedAt: true } },
    },
  });
  const ids = new Set(rows.map((r) => r.id));
  const day = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);
  const items = rows.map((r) => ({
    id: r.id, number: r.number, title: r.title, typeId: r.typeId, statusId: r.statusId, parentId: r.parentId,
    assigneeId: r.assigneeId, sprintId: r.sprintId, fixVersionId: r.fixVersionId, level: r.type.level,
    start: day(r.startDate) ?? (r.dueDate ? day(r.createdAt) : null),
    due: day(r.dueDate),
    done: !!r.resolvedAt,
    progress: r.children.length ? r.children.filter((c) => c.resolvedAt).length / r.children.length : r.resolvedAt ? 1 : 0,
  }));
  const deps = rows.flatMap((r) => r.linksOut.filter((l) => ids.has(l.toIssueId)).map((l) => ({ from: r.id, to: l.toIssueId })));
  const cp = criticalPath(items, deps);

  // Thẻ bị chặn mà bắt đầu trước khi thẻ chặn nó xong hạn — xung đột lịch.
  const byId = new Map(items.map((i) => [i.id, i]));
  const conflicts = deps
    .filter((d) => {
      const a = byId.get(d.from), b = byId.get(d.to);
      return a && b && !a.done && a.due && b.start && b.start < a.due;
    })
    .map((d) => ({ from: d.from, to: d.to }));
  return { items, dependencies: deps, criticalPath: cp.path, criticalDays: cp.days, conflicts };
}

/** Thời lượng (ngày, tối thiểu 1) của một thẻ trên timeline. */
function durationDays(i: { start: string | null; due: string | null }): number {
  if (!i.start || !i.due) return 1;
  return Math.max(1, Math.round((Date.parse(i.due) - Date.parse(i.start)) / DAY) + 1);
}

/**
 * Đường găng trên đồ thị BLOCKS (from chặn to) của các thẻ CHƯA xong: đường
 * có tổng thời lượng lớn nhất. Có chu trình (A chặn B chặn A) thì bỏ các cạnh
 * khép vòng thay vì treo — dữ liệu người nhập không đảm bảo là DAG.
 */
export function criticalPath(
  items: Array<{ id: number; start: string | null; due: string | null; done: boolean }>,
  deps: Array<{ from: number; to: number }>,
): { path: number[]; days: number } {
  const open = new Map(items.filter((i) => !i.done).map((i) => [i.id, i]));
  const out = new Map<number, number[]>();
  const indeg = new Map<number, number>();
  for (const id of open.keys()) { out.set(id, []); indeg.set(id, 0); }
  for (const d of deps) {
    if (!open.has(d.from) || !open.has(d.to) || d.from === d.to) continue;
    out.get(d.from)!.push(d.to);
    indeg.set(d.to, (indeg.get(d.to) ?? 0) + 1);
  }
  // Kahn: đỉnh còn lại sau khi hết đỉnh bậc 0 nằm trên chu trình → bỏ qua.
  const queue = [...indeg].filter(([, n]) => n === 0).map(([id]) => id);
  const best = new Map<number, number>();
  const prev = new Map<number, number | null>();
  for (const id of queue) { best.set(id, durationDays(open.get(id)!)); prev.set(id, null); }
  while (queue.length) {
    const u = queue.shift()!;
    for (const v of out.get(u)!) {
      const cand = best.get(u)! + durationDays(open.get(v)!);
      if (cand > (best.get(v) ?? 0)) { best.set(v, cand); prev.set(v, u); }
      indeg.set(v, indeg.get(v)! - 1);
      if (indeg.get(v) === 0) queue.push(v);
    }
  }
  let end: number | null = null;
  let max = 0;
  for (const [id, d] of best) {
    // Chỉ có ý nghĩa khi có ít nhất một phụ thuộc — một thẻ lẻ không phải "đường".
    if (d > max && (prev.get(id) !== null || out.get(id)!.length)) { max = d; end = id; }
  }
  const path: number[] = [];
  for (let c: number | null = end; c !== null; c = prev.get(c) ?? null) path.unshift(c);
  return { path: path.length > 1 ? path : [], days: path.length > 1 ? max : 0 };
}

/** Kéo thanh trên timeline: đổi ngày bắt đầu / hạn (qua cửa ghi chung). */
export async function scheduleIssue(userId: number, projectId: number, number: number, input: { startDate: string | null; dueDate: string | null; version?: number }) {
  await requireProject(userId, projectId, 'issue.edit');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  const start = dateOrNull(input.startDate) ?? null;
  const due = dateOrNull(input.dueDate) ?? null;
  if (start && due && start > due) throw new BadRequestError('Start date must be on or before the due date', 'WORK_BAD_DATES');
  const r = await applyIssueChange(issue.id, { startDate: start, dueDate: due }, userActor(userId), { expectedVersion: input.version });
  return { number, version: r.issue.version };
}

// ═══ Capacity + ngày nghỉ ═════════════════════════════════════════

/** Số ngày làm việc (T2–T6) trong [from, to], trừ ngày nghỉ. Ngày dạng YYYY-MM-DD. */
export function workingDays(from: string, to: string, off: Array<{ start: string; end: string }> = []): number {
  let n = 0;
  for (let t = Date.parse(`${from}T00:00:00Z`); t <= Date.parse(`${to}T00:00:00Z`); t += DAY) {
    const dow = new Date(t).getUTCDay();
    if (dow === 0 || dow === 6) continue;
    const d = new Date(t).toISOString().slice(0, 10);
    if (off.some((o) => d >= o.start && d <= o.end)) continue;
    n += 1;
  }
  return n;
}

/**
 * Capacity của một sprint (hoặc khoảng ngày): giờ có thể làm của từng người
 * = giờ/ngày × ngày làm việc (trừ nghỉ), so với khối việc đang giao trong
 * sprint. Dự án ước lượng bằng điểm thì "load" là điểm, kèm cờ unit.
 */
export async function capacity(userId: number, projectId: number, q: { sprintId?: number; from?: string; to?: string }) {
  const access = await requireProject(userId, projectId, 'project.view');
  let from = q.from, to = q.to, sprintId = q.sprintId;
  if (sprintId) {
    const sp = await prisma.workSprint.findFirst({ where: { id: sprintId, projectId } });
    if (!sp) throw new NotFoundError('Sprint not found');
    from = sp.startAt ? vnDay(sp.startAt) : vnDay();
    to = sp.endAt ? vnDay(sp.endAt) : vnDay(new Date(Date.now() + 13 * DAY));
  }
  if (!from || !to) {
    from = vnDay();
    to = vnDay(new Date(Date.now() + 13 * DAY));
  }
  if (from > to) throw new BadRequestError('"From" must be before "to"', 'WORK_BAD_DATES');
  const [members, timeOff, mode, issues] = await Promise.all([
    prisma.workProjectMember.findMany({ where: { projectId }, select: { userId: true, capacityHours: true, role: true, user: { select: PUBLIC_USER } } }),
    prisma.workTimeOff.findMany({
      where: { workspaceId: access.workspaceId, startDate: { lte: new Date(`${to}T00:00:00Z`) }, endDate: { gte: new Date(`${from}T00:00:00Z`) } },
      select: { id: true, userId: true, startDate: true, endDate: true, note: true },
    }),
    estimationOf(projectId),
    prisma.workIssue.findMany({
      where: {
        projectId, deletedAt: null, resolvedAt: null, type: { level: 0 }, assigneeId: { not: null },
        ...(sprintId ? { sprintId } : { OR: [{ dueDate: { gte: new Date(`${from}T00:00:00Z`), lte: new Date(`${to}T00:00:00Z`) } }, { sprint: { state: 'ACTIVE' } }] }),
      },
      select: { assigneeId: true, storyPoints: true, originalEstimateMin: true, remainingEstimateMin: true },
    }),
  ]);
  // Thành viên ngầm (vai trò lấy từ không gian) không có dòng work_project_members —
  // vẫn hiện nếu đang được giao việc.
  const all = await projectMembers(projectId);
  const rows = all
    .filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER')
    .map((m) => {
      const explicit = members.find((x) => x.userId === m.id);
      const off = timeOff.filter((t) => t.userId === m.id).map((t) => ({ id: t.id, start: t.startDate.toISOString().slice(0, 10), end: t.endDate.toISOString().slice(0, 10), note: t.note }));
      const days = workingDays(from!, to!, off);
      const perDay = explicit?.capacityHours ?? null;
      const mine = issues.filter((i) => i.assigneeId === m.id);
      // Giờ còn lại: remaining nếu có, không thì original.
      const loadHours = round1(mine.reduce((s, i) => s + (i.remainingEstimateMin ?? i.originalEstimateMin ?? 0), 0) / 60);
      const loadPoints = round1(mine.reduce((s, i) => s + estimateOf(i, 'POINTS'), 0));
      const capacityHours = perDay === null ? null : round1(perDay * days);
      return {
        user: { id: m.id, username: m.username, fullName: m.fullName, displayName: m.displayName, avatarUrl: m.avatarUrl },
        hoursPerDay: perDay, workingDays: days, timeOff: off, capacityHours,
        issues: mine.length, loadHours, loadPoints,
        utilization: capacityHours ? round1((loadHours / capacityHours) * 100) : null,
      };
    });
  return { from, to, unit: mode, sprintId: sprintId ?? null, members: rows };
}

export async function setCapacity(userId: number, projectId: number, memberId: number, hoursPerDay: number | null) {
  await requireProject(userId, projectId, 'sprint.manage');
  if (hoursPerDay !== null && (hoursPerDay < 0 || hoursPerDay > 24)) throw new BadRequestError('Hours per day must be 0–24', 'WORK_BAD_CAPACITY');
  const target = await loadProjectAccess(memberId, projectId);
  if (!target) throw new BadRequestError('This person is not a member of the project', 'WORK_NOT_MEMBER');
  const existing = await prisma.workProjectMember.findUnique({ where: { uk_work_project_member: { projectId, userId: memberId } } });
  if (existing) {
    await prisma.workProjectMember.update({ where: { id: existing.id }, data: { capacityHours: hoursPerDay } });
  } else {
    // Thành viên ngầm: tạo dòng với đúng vai trò hiện hành để không đổi quyền của họ.
    await prisma.workProjectMember.create({ data: { projectId, userId: memberId, role: target.role, capacityHours: hoursPerDay } });
  }
}

export async function addTimeOff(userId: number, workspaceId: number, input: { userId?: number; startDate: string; endDate: string; note?: string | null }) {
  const role = await requireWorkspace(userId, workspaceId, 'workspace.view');
  const target = input.userId ?? userId;
  // Tự khai ngày nghỉ của mình; khai hộ người khác thì phải là quản trị không gian.
  if (target !== userId && role !== 'OWNER' && role !== 'ADMIN') throw new ForbiddenError('Only workspace admins can add time off for others');
  if (target !== userId) {
    const m = await prisma.workMember.findFirst({ where: { workspaceId, userId: target } });
    if (!m) throw new BadRequestError('This person is not in the workspace', 'WORK_NOT_MEMBER');
  }
  if (input.startDate > input.endDate) throw new BadRequestError('Start date must be on or before the end date', 'WORK_BAD_DATES');
  if (Date.parse(input.endDate) - Date.parse(input.startDate) > 366 * DAY) throw new BadRequestError('Time off can span at most one year', 'WORK_BAD_DATES');
  return prisma.workTimeOff.create({
    data: { workspaceId, userId: target, startDate: new Date(`${input.startDate}T00:00:00Z`), endDate: new Date(`${input.endDate}T00:00:00Z`), note: input.note?.trim().slice(0, 200) || null },
  });
}

export async function listTimeOff(userId: number, workspaceId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.view');
  return prisma.workTimeOff.findMany({
    where: { workspaceId, endDate: { gte: new Date(Date.now() - 30 * DAY) } },
    orderBy: { startDate: 'asc' },
    select: { id: true, userId: true, startDate: true, endDate: true, note: true, user: { select: PUBLIC_USER } },
  });
}

export async function deleteTimeOff(userId: number, workspaceId: number, id: number) {
  const role = await requireWorkspace(userId, workspaceId, 'workspace.view');
  const t = await prisma.workTimeOff.findFirst({ where: { id, workspaceId } });
  if (!t) throw new NotFoundError('Time off not found');
  if (t.userId !== userId && role !== 'OWNER' && role !== 'ADMIN') throw new ForbiddenError('You can only remove your own time off');
  await prisma.workTimeOff.delete({ where: { id } });
}

// ═══ Worklog ══════════════════════════════════════════════════════

const WORKLOG_SELECT = {
  id: true, minutes: true, startedAt: true, note: true, createdAt: true, userId: true, user: { select: PUBLIC_USER },
} satisfies Prisma.WorkWorklogSelect;

export async function listWorklogs(userId: number, projectId: number, number: number) {
  await requireProject(userId, projectId, 'project.view');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  return prisma.workWorklog.findMany({ where: { issueId: issue.id }, orderBy: { startedAt: 'desc' }, select: WORKLOG_SELECT });
}

/**
 * Ghi giờ. remaining: 'auto' = trừ số phút vừa ghi (không âm, như Jira),
 * số = đặt thẳng, 'keep' = giữ nguyên.
 */
export async function addWorklog(
  userId: number, projectId: number, number: number,
  input: { minutes: number; startedAt?: string; note?: string | null; remaining?: 'auto' | 'keep' | number },
) {
  await requireProject(userId, projectId, 'issue.edit');
  if (!Number.isInteger(input.minutes) || input.minutes < 1 || input.minutes > 24 * 60) throw new BadRequestError('Time spent must be between 1 minute and 24 hours', 'WORK_BAD_WORKLOG');
  const startedAt = input.startedAt ? new Date(input.startedAt) : new Date();
  if (Number.isNaN(startedAt.getTime())) throw new BadRequestError('Invalid start time', 'WORK_BAD_WORKLOG');
  if (startedAt.getTime() > Date.now() + DAY) throw new BadRequestError('You cannot log time in the future', 'WORK_BAD_WORKLOG');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  const log = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_issues WHERE id = ${issue.id} FOR UPDATE`;
    const cur = await tx.workIssue.findUniqueOrThrow({ where: { id: issue.id }, select: { timeSpentMin: true, remainingEstimateMin: true } });
    const created = await tx.workWorklog.create({ data: { issueId: issue.id, userId, minutes: input.minutes, startedAt, note: input.note?.trim().slice(0, 1000) || null }, select: WORKLOG_SELECT });
    let remaining = cur.remainingEstimateMin;
    if (input.remaining === 'auto' || input.remaining === undefined) remaining = cur.remainingEstimateMin === null ? null : Math.max(0, cur.remainingEstimateMin - input.minutes);
    else if (typeof input.remaining === 'number') remaining = Math.max(0, Math.round(input.remaining));
    await tx.workIssue.update({ where: { id: issue.id }, data: { timeSpentMin: cur.timeSpentMin + input.minutes, remainingEstimateMin: remaining, version: { increment: 1 } } });
    await tx.workHistory.create({
      data: { issueId: issue.id, actorId: userId, actorKind: 'USER', field: 'timeSpentMin', fromValue: String(cur.timeSpentMin), toValue: String(cur.timeSpentMin + input.minutes) },
    });
    return created;
  });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: issue.id, actor: userActor(userId), changes: [] });
  return log;
}

export async function deleteWorklog(userId: number, projectId: number, number: number, worklogId: number) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  const log = await prisma.workWorklog.findFirst({ where: { id: worklogId, issueId: issue.id } });
  if (!log) throw new NotFoundError('Work log not found');
  if (log.userId !== userId && access.role !== 'ADMIN') throw new ForbiddenError('You can only delete your own work logs');
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_issues WHERE id = ${issue.id} FOR UPDATE`;
    const cur = await tx.workIssue.findUniqueOrThrow({ where: { id: issue.id }, select: { timeSpentMin: true } });
    await tx.workWorklog.delete({ where: { id: log.id } });
    const next = Math.max(0, cur.timeSpentMin - log.minutes);
    await tx.workIssue.update({ where: { id: issue.id }, data: { timeSpentMin: next, version: { increment: 1 } } });
    await tx.workHistory.create({
      data: { issueId: issue.id, actorId: userId, actorKind: 'USER', field: 'timeSpentMin', fromValue: String(cur.timeSpentMin), toValue: String(next) },
    });
  });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: issue.id, actor: userActor(userId), changes: [] });
}

/** Báo cáo thời gian: giờ theo người × ngày trong khoảng (giờ VN), kèm từng thẻ. */
export async function timeReport(userId: number, projectId: number, q: { from: string; to: string; userId?: number }) {
  await requireProject(userId, projectId, 'project.view');
  if (q.from > q.to) throw new BadRequestError('"From" must be before "to"', 'WORK_BAD_DATES');
  if (Date.parse(q.to) - Date.parse(q.from) > 92 * DAY) throw new BadRequestError('Pick a range of at most 3 months', 'WORK_BAD_DATES');
  // Mốc giờ VN (+07): 00:00 VN = 17:00 UTC hôm trước.
  const since = new Date(Date.parse(`${q.from}T00:00:00+07:00`));
  const until = new Date(Date.parse(`${q.to}T00:00:00+07:00`) + DAY);
  const logs = await prisma.workWorklog.findMany({
    where: { issue: { projectId, deletedAt: null }, startedAt: { gte: since, lt: until }, ...(q.userId ? { userId: q.userId } : {}) },
    select: { minutes: true, startedAt: true, userId: true, user: { select: PUBLIC_USER }, issue: { select: { number: true, title: true } } },
    orderBy: { startedAt: 'asc' },
  });
  const people = new Map<number, { user: (typeof logs)[number]['user']; totalMin: number; byDay: Record<string, number>; byIssue: Map<number, { number: number; title: string; minutes: number }> }>();
  for (const l of logs) {
    let p = people.get(l.userId);
    if (!p) { p = { user: l.user, totalMin: 0, byDay: {}, byIssue: new Map() }; people.set(l.userId, p); }
    const d = vnDay(l.startedAt);
    p.totalMin += l.minutes;
    p.byDay[d] = (p.byDay[d] ?? 0) + l.minutes;
    const bi = p.byIssue.get(l.issue.number) ?? { number: l.issue.number, title: l.issue.title, minutes: 0 };
    bi.minutes += l.minutes;
    p.byIssue.set(l.issue.number, bi);
  }
  return {
    from: q.from, to: q.to,
    totalMin: logs.reduce((s, l) => s + l.minutes, 0),
    people: [...people.values()]
      .map((p) => ({ user: p.user, name: displayName(p.user), totalMin: p.totalMin, byDay: p.byDay, issues: [...p.byIssue.values()].sort((a, b) => b.minutes - a.minutes) }))
      .sort((a, b) => b.totalMin - a.totalMin),
  };
}
