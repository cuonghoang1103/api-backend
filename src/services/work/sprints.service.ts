/**
 * CT Work — sprint, backlog, sửa hàng loạt, số liệu hằng ngày.
 *
 * Quy ước tính điểm (dùng chung cho burndown, velocity, báo cáo):
 *   - Chỉ tính thẻ TẦNG 0 (story/task/bug…). Việc con đi theo cha, tính cả
 *     hai là đếm đôi; epic không bao giờ nằm trong sprint.
 *   - "Xong" = resolvedAt khác null (applyIssueChange đặt nó khi vào cột
 *     thuộc nhóm DONE) — không đọc tên cột.
 *   - Dự án ước lượng theo GIỜ (settings.estimation = 'HOURS') thì "điểm" là
 *     số giờ của originalEstimateMin.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import { emitWorkEvent, type WorkActor } from './events.js';
import { applyIssueChange, type IssuePatch } from './issueChange.js';
import { CARD_SELECT, deleteIssueAs, toCard, updateIssueAs } from './issues.service.js';
import { requireProject } from './permissions.js';

const userActor = (userId: number): WorkActor => ({ kind: 'USER', userId });

/** YYYY-MM-DD theo giờ Việt Nam (máy chủ chạy UTC — xem bài học UTC/+07). */
export function vnDay(d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export type EstimationMode = 'POINTS' | 'HOURS';

export async function estimationOf(projectId: number): Promise<EstimationMode> {
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { settings: true } });
  return (p?.settings as { estimation?: string } | null)?.estimation === 'HOURS' ? 'HOURS' : 'POINTS';
}

export function estimateOf(i: { storyPoints: number | null; originalEstimateMin: number | null }, mode: EstimationMode): number {
  if (mode === 'HOURS') return i.originalEstimateMin ? Math.round((i.originalEstimateMin / 60) * 10) / 10 : 0;
  return i.storyPoints ?? 0;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Thẻ tầng 0 của một sprint, kèm những gì cần để tính điểm. */
async function sprintIssues(tx: Prisma.TransactionClient | typeof prisma, sprintId: number) {
  return tx.workIssue.findMany({
    where: { sprintId, deletedAt: null, type: { level: 0 } },
    select: { id: true, number: true, title: true, storyPoints: true, originalEstimateMin: true, resolvedAt: true, createdAt: true, assigneeId: true },
  });
}

// ─── Sprint ──────────────────────────────────────────────────────

const SPRINT_SELECT = {
  id: true, name: true, goal: true, state: true, startAt: true, endAt: true, completedAt: true,
  committedPoints: true, completedPoints: true, position: true,
} satisfies Prisma.WorkSprintSelect;

export async function listSprints(userId: number, projectId: number, includeClosed = false) {
  await requireProject(userId, projectId, 'project.view');
  return prisma.workSprint.findMany({
    where: { projectId, ...(includeClosed ? {} : { state: { not: 'CLOSED' } }) },
    orderBy: [{ completedAt: { sort: 'desc', nulls: 'first' } }, { position: 'asc' }, { id: 'asc' }],
    select: SPRINT_SELECT,
  });
}

async function findSprint(projectId: number, sprintId: number) {
  const s = await prisma.workSprint.findFirst({ where: { id: sprintId, projectId }, select: { ...SPRINT_SELECT, report: true } });
  if (!s) throw new NotFoundError('Sprint not found');
  return s;
}

/**
 * Tên mặc định "Sprint N" — N = số sprint của dự án + 1, nhưng nhảy qua số đã
 * có người đặt (xoá sprint rồi tạo lại không ra hai "Sprint 3"). Nhận cả tên
 * kiểu cũ "KEY Sprint N".
 */
export async function nextSprintName(projectId: number): Promise<string> {
  const rows = await prisma.workSprint.findMany({ where: { projectId }, select: { name: true } });
  const used = rows.map((r) => /^(?:[A-Z][A-Z0-9]* )?Sprint (\d+)$/i.exec(r.name.trim())?.[1]).filter(Boolean).map(Number);
  return `Sprint ${Math.max(rows.length, ...used) + 1}`;
}

export async function createSprint(userId: number, projectId: number, input: { name?: string; goal?: string | null } = {}) {
  await requireProject(userId, projectId, 'sprint.manage');
  const [defaultName, last] = await Promise.all([
    nextSprintName(projectId),
    prisma.workSprint.findFirst({ where: { projectId }, orderBy: { position: 'desc' }, select: { position: true } }),
  ]);
  const sprint = await prisma.workSprint.create({
    data: {
      projectId,
      name: input.name?.trim().slice(0, 100) || defaultName,
      goal: input.goal?.trim() || null,
      position: (last?.position ?? 0) + 1,
    },
    select: SPRINT_SELECT,
  });
  emitWorkEvent({ type: 'sprint.updated', projectId, sprintId: sprint.id, actor: userActor(userId) });
  return sprint;
}

export async function updateSprint(
  userId: number,
  projectId: number,
  sprintId: number,
  input: { name?: string; goal?: string | null; startAt?: Date | null; endAt?: Date | null },
) {
  await requireProject(userId, projectId, 'sprint.manage');
  const s = await findSprint(projectId, sprintId);
  if (s.state === 'CLOSED') throw new BadRequestError('A completed sprint cannot be edited', 'WORK_SPRINT_CLOSED');
  const startAt = input.startAt !== undefined ? input.startAt : s.startAt;
  const endAt = input.endAt !== undefined ? input.endAt : s.endAt;
  if (startAt && endAt && endAt <= startAt) throw new BadRequestError('The end date must be after the start date', 'WORK_BAD_DATES');
  const data: Prisma.WorkSprintUpdateInput = {};
  if (input.name !== undefined) {
    const n = input.name.trim();
    if (!n) throw new BadRequestError('Sprint name is required', 'WORK_NAME_REQUIRED');
    data.name = n.slice(0, 100);
  }
  if (input.goal !== undefined) data.goal = input.goal?.trim() || null;
  if (input.startAt !== undefined) data.startAt = input.startAt;
  if (input.endAt !== undefined) data.endAt = input.endAt;
  const updated = await prisma.workSprint.update({ where: { id: sprintId }, data, select: SPRINT_SELECT });
  emitWorkEvent({ type: 'sprint.updated', projectId, sprintId, actor: userActor(userId) });
  return updated;
}

/** Chỉ xoá được sprint chưa bắt đầu; thẻ trong đó về backlog. */
export async function deleteSprint(userId: number, projectId: number, sprintId: number) {
  await requireProject(userId, projectId, 'sprint.manage');
  const s = await findSprint(projectId, sprintId);
  if (s.state !== 'PLANNED') throw new BadRequestError('Only a sprint that has not started can be deleted', 'WORK_SPRINT_STARTED');
  await prisma.$transaction(async (tx) => {
    const moved = await tx.workIssue.findMany({ where: { sprintId, deletedAt: null }, select: { id: true } });
    await tx.workIssue.updateMany({ where: { sprintId }, data: { sprintId: null, version: { increment: 1 } } });
    if (moved.length) {
      await tx.workHistory.createMany({
        data: moved.map((i) => ({ issueId: i.id, actorId: userId, actorKind: 'USER', field: 'sprintId', fromValue: String(sprintId), toValue: null })),
      });
    }
    await tx.workSprint.delete({ where: { id: sprintId } });
  });
  emitWorkEvent({ type: 'sprint.updated', projectId, sprintId, actor: userActor(userId) });
}

export async function startSprint(
  userId: number,
  projectId: number,
  sprintId: number,
  input: { name?: string; goal?: string | null; startAt: Date; endAt: Date },
) {
  await requireProject(userId, projectId, 'sprint.manage');
  if (input.endAt <= input.startAt) throw new BadRequestError('The end date must be after the start date', 'WORK_BAD_DATES');
  const mode = await estimationOf(projectId);
  const sprint = await prisma.$transaction(async (tx) => {
    // Khoá dòng dự án: hai người bấm Start cùng lúc thì người sau thấy sprint đầu đã ACTIVE.
    await tx.$queryRaw`SELECT id FROM work_projects WHERE id = ${projectId} FOR UPDATE`;
    const active = await tx.workSprint.findFirst({ where: { projectId, state: 'ACTIVE' }, select: { name: true } });
    if (active) throw new ConflictError(`${active.name} is still running. Complete it before starting another sprint.`);
    const s = await tx.workSprint.findFirst({ where: { id: sprintId, projectId }, select: { state: true } });
    if (!s) throw new NotFoundError('Sprint not found');
    if (s.state !== 'PLANNED') throw new BadRequestError('This sprint has already started', 'WORK_SPRINT_STARTED');
    const issues = await sprintIssues(tx, sprintId);
    const committed = round1(issues.reduce((sum, i) => sum + estimateOf(i, mode), 0));
    return tx.workSprint.update({
      where: { id: sprintId },
      data: {
        state: 'ACTIVE',
        startAt: input.startAt,
        endAt: input.endAt,
        committedPoints: committed,
        // Mốc cam kết: thẻ có mặt LÚC BẤM Start. "Thêm/bỏ giữa sprint" so với
        // danh sách này, không so theo ngày startAt (người dùng được chọn ngày
        // bắt đầu lùi về quá khứ — so theo ngày thì mọi thẻ lên kế hoạch sau
        // ngày đó đều bị tính nhầm là "thêm giữa chừng"; test đã bắt được).
        report: { committedIssueIds: issues.map((i) => i.id) } as Prisma.InputJsonValue,
        ...(input.name?.trim() ? { name: input.name.trim().slice(0, 100) } : {}),
        ...(input.goal !== undefined ? { goal: input.goal?.trim() || null } : {}),
      },
      select: SPRINT_SELECT,
    });
  });
  await snapshotSprint(sprintId);
  emitWorkEvent({ type: 'sprint.updated', projectId, sprintId, actor: userActor(userId) });
  return sprint;
}

export interface SprintReportItem { id: number; number: number; title: string; points: number }
export interface SprintReport {
  completed: SprintReportItem[];
  incomplete: SprintReportItem[];
  /** Số thẻ được thêm vào sprint SAU khi bắt đầu (đổi phạm vi). */
  added: number[];
  /** Số thẻ bị bỏ ra khỏi sprint sau khi bắt đầu. */
  removed: number[];
  committedPoints: number;
  completedPoints: number;
  unit: EstimationMode;
}

/** Tính báo cáo từ trạng thái HIỆN TẠI (sprint đang chạy, hoặc ngay trước khi đóng). */
export async function computeSprintReport(projectId: number, sprintId: number): Promise<SprintReport> {
  const mode = await estimationOf(projectId);
  const s = await prisma.workSprint.findUniqueOrThrow({ where: { id: sprintId }, select: { startAt: true, committedPoints: true, report: true } });
  const issues = await sprintIssues(prisma, sprintId);
  const baseline = (s.report as { committedIssueIds?: number[] } | null)?.committedIssueIds;
  const item = (i: (typeof issues)[number]): SprintReportItem => ({ id: i.id, number: i.number, title: i.title, points: estimateOf(i, mode) });
  const completed = issues.filter((i) => i.resolvedAt).map(item);
  const incomplete = issues.filter((i) => !i.resolvedAt).map(item);

  let added: number[] = [];
  let removed: number[] = [];
  if (baseline) {
    const base = new Set(baseline);
    const now = new Set(issues.map((i) => i.id));
    added = issues.filter((i) => !base.has(i.id)).map((i) => i.number);
    const gone = baseline.filter((id) => !now.has(id));
    if (gone.length) {
      const rows = await prisma.workIssue.findMany({ where: { id: { in: gone }, deletedAt: null }, select: { number: true } });
      removed = rows.map((r) => r.number);
    }
  } else if (s.startAt) {
    // Sprint bắt đầu trước khi có mốc cam kết: suy từ lịch sử (kém chính xác hơn).
    const moves = await prisma.workHistory.findMany({
      where: {
        field: 'sprintId',
        createdAt: { gt: s.startAt },
        OR: [{ toValue: String(sprintId) }, { fromValue: String(sprintId) }],
        issue: { projectId, deletedAt: null, type: { level: 0 } },
      },
      select: { toValue: true, fromValue: true, issue: { select: { number: true } } },
    });
    const addedSet = new Set(moves.filter((m) => m.toValue === String(sprintId)).map((m) => m.issue.number));
    // Thẻ tạo thẳng vào sprint sau khi bắt đầu cũng là thêm phạm vi.
    for (const i of issues) if (i.createdAt > s.startAt) addedSet.add(i.number);
    const removedSet = new Set(moves.filter((m) => m.fromValue === String(sprintId)).map((m) => m.issue.number));
    const inSprint = new Set(issues.map((i) => i.number));
    added = [...addedSet].filter((n) => inSprint.has(n));
    removed = [...removedSet].filter((n) => !inSprint.has(n));
  }
  return {
    completed,
    incomplete,
    added: added.sort((a, b) => a - b),
    removed: removed.sort((a, b) => a - b),
    committedPoints: s.committedPoints ?? 0,
    completedPoints: round1(completed.reduce((sum, i) => sum + i.points, 0)),
    unit: mode,
  };
}

/**
 * Kết thúc sprint. Thẻ chưa xong (và việc con của chúng) dời sang `moveTo`:
 * 'backlog', 'new' (tạo sprint mới), hoặc id một sprint chưa bắt đầu.
 */
export async function completeSprint(userId: number, projectId: number, sprintId: number, moveTo: 'backlog' | 'new' | number) {
  await requireProject(userId, projectId, 'sprint.manage');
  const s = await findSprint(projectId, sprintId);
  if (s.state !== 'ACTIVE') throw new BadRequestError('Only the running sprint can be completed', 'WORK_SPRINT_NOT_ACTIVE');
  await snapshotSprint(sprintId);
  const report = await computeSprintReport(projectId, sprintId);

  let targetId: number | null = null;
  if (moveTo === 'new') {
    const name = await nextSprintName(projectId);
    const last = await prisma.workSprint.findFirst({ where: { projectId }, orderBy: { position: 'desc' }, select: { position: true } });
    targetId = (await prisma.workSprint.create({ data: { projectId, name, position: (last?.position ?? 0) + 1 } })).id;
  } else if (typeof moveTo === 'number') {
    const t = await prisma.workSprint.findFirst({ where: { id: moveTo, projectId }, select: { state: true } });
    if (!t || t.state !== 'PLANNED' || moveTo === sprintId) throw new BadRequestError('Choose a sprint that has not started', 'WORK_BAD_SPRINT');
    targetId = moveTo;
  }

  const incompleteIds = report.incomplete.map((i) => i.id);
  await prisma.$transaction(async (tx) => {
    if (incompleteIds.length) {
      // Tăng version: client đang cầm bản cũ phải nhận 409 thay vì ghi đè sprint mới.
      await tx.workIssue.updateMany({ where: { id: { in: incompleteIds } }, data: { sprintId: targetId, version: { increment: 1 } } });
      // Việc con chưa xong đi theo cha; việc con đã xong ở lại sprint cũ (đúng lịch sử).
      await tx.workIssue.updateMany({ where: { parentId: { in: incompleteIds }, sprintId, resolvedAt: null }, data: { sprintId: targetId, version: { increment: 1 } } });
      await tx.workHistory.createMany({
        data: incompleteIds.map((issueId) => ({
          issueId, actorId: userId, actorKind: 'USER', field: 'sprintId', fromValue: String(sprintId), toValue: targetId === null ? null : String(targetId),
        })),
      });
    }
    await tx.workSprint.update({
      where: { id: sprintId },
      data: {
        state: 'CLOSED',
        completedAt: new Date(),
        completedPoints: report.completedPoints,
        report: report as unknown as Prisma.InputJsonValue,
      },
    });
  });
  emitWorkEvent({ type: 'sprint.updated', projectId, sprintId, actor: userActor(userId) });
  return { report, movedTo: targetId };
}

// ─── Số liệu hằng ngày ───────────────────────────────────────────

export async function snapshotSprint(sprintId: number): Promise<void> {
  const s = await prisma.workSprint.findUnique({ where: { id: sprintId }, select: { projectId: true, state: true } });
  if (!s || s.state !== 'ACTIVE') return;
  const mode = await estimationOf(s.projectId);
  const issues = await sprintIssues(prisma, sprintId);
  const total = round1(issues.reduce((sum, i) => sum + estimateOf(i, mode), 0));
  const remaining = round1(issues.filter((i) => !i.resolvedAt).reduce((sum, i) => sum + estimateOf(i, mode), 0));
  const day = vnDay();
  const data = { totalPoints: total, remainingPoints: remaining, totalIssues: issues.length, doneIssues: issues.filter((i) => i.resolvedAt).length };
  await prisma.workSprintSnapshot.upsert({
    where: { uk_work_sprint_snapshot: { sprintId, day } },
    create: { sprintId, day, ...data },
    update: data,
  });
}

/** Cron gọi mỗi giờ: ghi đè số liệu hôm nay của mọi sprint đang chạy. */
export async function snapshotActiveSprints(): Promise<number> {
  const active = await prisma.workSprint.findMany({ where: { state: 'ACTIVE' }, select: { id: true } });
  for (const s of active) await snapshotSprint(s.id);
  return active.length;
}

// ─── Backlog ─────────────────────────────────────────────────────

/**
 * Mọi thứ trang Backlog cần trong một lượt: sprint chưa đóng (đang chạy trước),
 * thẻ tầng 0 của chúng, thẻ chưa vào sprint nào (chưa xong), và epic kèm tiến độ.
 */
export async function getBacklog(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const mode = await estimationOf(projectId);
  const [sprints, issues, epics] = await Promise.all([
    prisma.workSprint.findMany({
      where: { projectId, state: { not: 'CLOSED' } },
      orderBy: [{ state: 'asc' }, { position: 'asc' }, { id: 'asc' }], // 'ACTIVE' < 'PLANNED'
      select: SPRINT_SELECT,
    }),
    prisma.workIssue.findMany({
      where: {
        projectId, deletedAt: null, type: { level: 0 },
        OR: [{ sprint: { state: { not: 'CLOSED' } } }, { sprintId: null, resolvedAt: null }],
      },
      orderBy: [{ rank: 'asc' }, { id: 'asc' }],
      take: 3000,
      select: { ...CARD_SELECT, originalEstimateMin: true },
    }),
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, type: { level: 1 } },
      orderBy: [{ rank: 'asc' }, { id: 'asc' }],
      select: {
        id: true, number: true, title: true, statusId: true, resolvedAt: true,
        children: { where: { deletedAt: null }, select: { resolvedAt: true, storyPoints: true, originalEstimateMin: true } },
      },
    }),
  ]);
  return {
    unit: mode,
    sprints,
    issues: issues.map((i) => {
      const { originalEstimateMin, ...card } = i;
      return { ...toCard(card), originalEstimateMin, estimate: estimateOf(i, mode) };
    }),
    epics: epics.map((e) => ({
      id: e.id, number: e.number, title: e.title, statusId: e.statusId, done: !!e.resolvedAt,
      total: e.children.length,
      completed: e.children.filter((c) => c.resolvedAt).length,
      points: round1(e.children.reduce((s, c) => s + estimateOf(c, mode), 0)),
      pointsDone: round1(e.children.filter((c) => c.resolvedAt).reduce((s, c) => s + estimateOf(c, mode), 0)),
    })),
  };
}

// ─── Sửa hàng loạt ───────────────────────────────────────────────

export interface BulkPatch {
  sprintId?: number | null;
  assigneeId?: number | null;
  priority?: number;
  statusId?: number;
  parentId?: number | null;
  addLabelIds?: number[];
  delete?: boolean;
}

/**
 * Áp một thay đổi cho nhiều thẻ. Mỗi thẻ đi qua đúng cửa ghi thường ngày nên
 * lịch sử/thông báo/socket y như sửa tay. Thẻ nào hỏng (vd quy trình Bug không
 * cho chuyển thẳng sang Done) thì báo riêng thẻ đó, các thẻ khác vẫn đi.
 */
export async function bulkUpdate(userId: number, projectId: number, numbers: number[], patch: BulkPatch) {
  await requireProject(userId, projectId, patch.delete ? 'project.view' : 'issue.edit');
  const uniq = [...new Set(numbers)].slice(0, 200);
  const issues = await prisma.workIssue.findMany({ where: { projectId, number: { in: uniq }, deletedAt: null }, select: { id: true, number: true } });
  const updated: number[] = [];
  const failed: Array<{ number: number; error: string }> = [];
  for (const n of uniq) if (!issues.some((i) => i.number === n)) failed.push({ number: n, error: 'Issue not found' });

  for (const i of issues) {
    try {
      if (patch.delete) {
        await deleteIssueAs(userId, projectId, i.number);
      } else {
        const p: IssuePatch = {};
        if (patch.sprintId !== undefined) p.sprintId = patch.sprintId;
        if (patch.assigneeId !== undefined) p.assigneeId = patch.assigneeId;
        if (patch.priority !== undefined) p.priority = patch.priority;
        if (patch.statusId !== undefined) p.statusId = patch.statusId;
        if (patch.parentId !== undefined) p.parentId = patch.parentId;
        if (Object.keys(p).length) await applyIssueChange(i.id, p, userActor(userId));
        if (patch.addLabelIds?.length) {
          // Qua cửa sửa thẻ thường ngày (thay cả tập nhãn) để có lịch sử + socket.
          const cur = await prisma.workIssueLabel.findMany({ where: { issueId: i.id }, select: { labelId: true } });
          const merged = [...new Set([...cur.map((c) => c.labelId), ...patch.addLabelIds])];
          await updateIssueAs(userId, projectId, i.number, { labelIds: merged });
        }
      }
      updated.push(i.number);
    } catch (err) {
      failed.push({ number: i.number, error: err instanceof Error ? err.message : 'Failed' });
    }
  }
  return { updated, failed };
}
