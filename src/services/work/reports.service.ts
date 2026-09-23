/**
 * CT Work — báo cáo: burndown, velocity, báo cáo sprint, tiến độ epic,
 * đóng góp từng thành viên.
 *
 * Mọi con số ở đây do MÃ tính từ dữ liệu, không qua AI — trợ lý AI (đợt 4)
 * chỉ được đọc các con số này rồi diễn đạt lại.
 */

import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../middleware/errorHandler.js';
import { PUBLIC_USER } from './common.js';
import { requireProject } from './permissions.js';
import {
  computeSprintReport, estimateOf, estimationOf, snapshotSprint, vnDay, type SprintReport,
} from './sprints.service.js';

const round1 = (n: number) => Math.round(n * 10) / 10;

async function sprintOf(projectId: number, sprintId: number) {
  const s = await prisma.workSprint.findFirst({
    where: { id: sprintId, projectId },
    select: { id: true, name: true, goal: true, state: true, startAt: true, endAt: true, completedAt: true, committedPoints: true, completedPoints: true, report: true },
  });
  if (!s) throw new NotFoundError('Sprint not found');
  return s;
}

/** Danh sách ngày YYYY-MM-DD (giờ VN) từ a tới b, gồm cả hai đầu. */
function daysBetween(a: Date, b: Date): string[] {
  const out: string[] = [];
  const end = vnDay(b);
  let cur = new Date(`${vnDay(a)}T12:00:00+07:00`);
  for (let i = 0; i < 400; i++) {
    const d = vnDay(cur);
    out.push(d);
    if (d >= end) break;
    cur = new Date(cur.getTime() + 86_400_000);
  }
  return out;
}

/**
 * Burndown/burnup của một sprint: một điểm mỗi ngày từ ngày bắt đầu tới ngày
 * kết thúc dự kiến (hoặc hôm nay nếu đã quá hạn). Ngày chưa có số liệu (máy chủ
 * tắt, cron chưa kịp chạy) lấy số của ngày trước đó; ngày tương lai để trống.
 */
export async function burndown(userId: number, projectId: number, sprintId: number) {
  await requireProject(userId, projectId, 'project.view');
  const s = await sprintOf(projectId, sprintId);
  if (!s.startAt) return { sprint: s, unit: await estimationOf(projectId), points: [] };
  // Sprint đang chạy: cập nhật điểm hôm nay để biểu đồ khớp board ngay lúc xem.
  if (s.state === 'ACTIVE') await snapshotSprint(sprintId);
  const snaps = await prisma.workSprintSnapshot.findMany({ where: { sprintId }, orderBy: { day: 'asc' } });
  const byDay = new Map(snaps.map((x) => [x.day, x]));
  const lastDay = s.completedAt ?? (s.endAt && s.endAt > new Date() ? s.endAt : new Date());
  const planEnd = s.endAt ?? lastDay;
  const days = daysBetween(s.startAt, lastDay > planEnd ? lastDay : planEnd);
  const today = vnDay();
  const committed = s.committedPoints ?? snaps[0]?.totalPoints ?? 0;
  let prev: (typeof snaps)[number] | undefined;
  const points = days.map((day, i) => {
    const hit = byDay.get(day);
    if (hit) prev = hit;
    const future = day > today;
    return {
      day,
      remaining: future ? null : prev ? prev.remainingPoints : committed,
      total: future ? null : prev ? prev.totalPoints : committed,
      done: future ? null : prev ? round1(prev.totalPoints - prev.remainingPoints) : 0,
      // Đường lý tưởng: giảm đều từ điểm cam kết về 0 vào ngày kết thúc dự kiến.
      ideal: round1(Math.max(0, committed * (1 - i / Math.max(1, daysBetween(s.startAt!, planEnd).length - 1)))),
    };
  });
  return { sprint: s, unit: await estimationOf(projectId), points };
}

/** Velocity: cam kết vs hoàn thành của 7 sprint đã đóng gần nhất. */
export async function velocity(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const closed = await prisma.workSprint.findMany({
    where: { projectId, state: 'CLOSED' },
    orderBy: { completedAt: 'desc' },
    take: 7,
    select: { id: true, name: true, committedPoints: true, completedPoints: true, completedAt: true },
  });
  const sprints = closed.reverse().map((s) => ({ ...s, committedPoints: s.committedPoints ?? 0, completedPoints: s.completedPoints ?? 0 }));
  const recent = sprints.slice(-3);
  const average = recent.length ? round1(recent.reduce((a, s) => a + s.completedPoints, 0) / recent.length) : null;
  return { unit: await estimationOf(projectId), sprints, average };
}

export async function sprintReport(userId: number, projectId: number, sprintId: number): Promise<{ sprint: Awaited<ReturnType<typeof sprintOf>>; report: SprintReport }> {
  await requireProject(userId, projectId, 'project.view');
  const s = await sprintOf(projectId, sprintId);
  // Sprint đã đóng: dùng bản chụp lúc đóng (thẻ chưa xong đã dời đi rồi).
  const report = s.state === 'CLOSED' && s.report ? (s.report as unknown as SprintReport) : await computeSprintReport(projectId, sprintId);
  return { sprint: s, report };
}

/** Tiến độ từng epic: số thẻ con, đã xong, điểm. */
export async function epicReport(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const mode = await estimationOf(projectId);
  const epics = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { level: 1 } },
    orderBy: [{ rank: 'asc' }, { id: 'asc' }],
    select: {
      id: true, number: true, title: true, statusId: true, resolvedAt: true, dueDate: true,
      children: { where: { deletedAt: null }, select: { resolvedAt: true, storyPoints: true, originalEstimateMin: true, assigneeId: true } },
    },
  });
  return {
    unit: mode,
    epics: epics.map((e) => {
      const done = e.children.filter((c) => c.resolvedAt);
      const points = round1(e.children.reduce((s, c) => s + estimateOf(c, mode), 0));
      const pointsDone = round1(done.reduce((s, c) => s + estimateOf(c, mode), 0));
      return {
        id: e.id, number: e.number, title: e.title, statusId: e.statusId, dueDate: e.dueDate, resolved: !!e.resolvedAt,
        total: e.children.length, completed: done.length, points, pointsDone,
        percent: e.children.length ? Math.round((done.length / e.children.length) * 100) : 0,
      };
    }),
  };
}

/**
 * Đóng góp từng người trong một khoảng thời gian (mặc định: toàn bộ dự án).
 * Tính công theo NGƯỜI THẬT: thao tác của AI/luật tự động không cộng cho ai.
 * "Hoàn thành" = thẻ tầng 0 đã xong trong khoảng, tính cho người đang được giao.
 */
export async function contributions(userId: number, projectId: number, range: { from?: Date; to?: Date; sprintId?: number }) {
  await requireProject(userId, projectId, 'project.view');
  const mode = await estimationOf(projectId);
  let from = range.from;
  let to = range.to;
  if (range.sprintId) {
    const s = await sprintOf(projectId, range.sprintId);
    from = s.startAt ?? undefined;
    to = s.completedAt ?? undefined;
  }
  const inRange = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };
  const hasRange = !!(from || to);

  const [resolved, created, comments, actions, open, members] = await Promise.all([
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, resolvedAt: hasRange ? inRange : { not: null }, assigneeId: { not: null } },
      select: { assigneeId: true, storyPoints: true, originalEstimateMin: true, type: { select: { level: true } } },
    }),
    // "Tạo" đếm theo dòng lịch sử 'created' do NGƯỜI làm — thẻ AI soạn rồi
    // người dùng bấm Apply có actorKind AI nên không cộng công.
    prisma.workHistory.groupBy({
      by: ['actorId'],
      where: { issue: { projectId, deletedAt: null }, field: 'created', actorKind: 'USER', actorId: { not: null }, ...(hasRange ? { createdAt: inRange } : {}) },
      _count: { _all: true },
    }),
    prisma.workComment.groupBy({
      by: ['authorId'],
      where: { issue: { projectId }, deletedAt: null, isAi: false, authorId: { not: null }, ...(hasRange ? { createdAt: inRange } : {}) },
      _count: { _all: true },
    }),
    prisma.workHistory.groupBy({
      by: ['actorId'],
      where: { issue: { projectId }, actorKind: 'USER', actorId: { not: null }, field: { notIn: ['created'] }, ...(hasRange ? { createdAt: inRange } : {}) },
      _count: { _all: true },
    }),
    prisma.workIssue.groupBy({
      by: ['assigneeId'],
      where: { projectId, deletedAt: null, resolvedAt: null, assigneeId: { not: null }, type: { level: { not: 1 } } },
      _count: { _all: true },
    }),
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { workspaceId: true } }).then((p) =>
      prisma.workMember.findMany({ where: { workspaceId: p.workspaceId }, select: { user: { select: PUBLIC_USER } } })),
  ]);

  type Row = { user: (typeof members)[number]['user']; resolved: number; points: number; subtasks: number; created: number; comments: number; updates: number; open: number };
  const rows = new Map<number, Row>();
  const row = (id: number) => {
    let r = rows.get(id);
    if (!r) {
      const u = members.find((m) => m.user.id === id)?.user;
      if (!u) return null; // người đã rời không gian: không hiện
      r = { user: u, resolved: 0, points: 0, subtasks: 0, created: 0, comments: 0, updates: 0, open: 0 };
      rows.set(id, r);
    }
    return r;
  };
  for (const i of resolved) {
    const r = row(i.assigneeId!);
    if (!r) continue;
    if (i.type.level === -1) r.subtasks += 1;
    else if (i.type.level === 0) { r.resolved += 1; r.points = round1(r.points + estimateOf(i, mode)); }
  }
  for (const c of created) { const r = row(c.actorId!); if (r) r.created = c._count._all; }
  for (const c of comments) { const r = row(c.authorId!); if (r) r.comments = c._count._all; }
  for (const a of actions) { const r = row(a.actorId!); if (r) r.updates = a._count._all; }
  for (const o of open) { const r = row(o.assigneeId!); if (r) r.open = o._count._all; }

  const list = [...rows.values()].sort((a, b) => b.points - a.points || b.resolved - a.resolved || b.updates - a.updates);
  const totalPoints = round1(list.reduce((s, r) => s + r.points, 0));
  return {
    unit: mode,
    from: from ?? null,
    to: to ?? null,
    members: list.map((r) => ({ ...r, share: totalPoints ? Math.round((r.points / totalPoints) * 100) : 0 })),
  };
}
