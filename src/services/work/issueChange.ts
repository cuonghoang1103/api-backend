/**
 * CT Work — CỬA DUY NHẤT để tạo và sửa thẻ.
 *
 * createIssue() / applyIssueChange() / moveIssue() làm cùng lúc bốn việc
 * trong một nhịp: kiểm dữ liệu hợp lệ, ghi DB, ghi lịch sử từng trường, rồi
 * (sau commit) phát sự kiện cho socket + thông báo + luật tự động. Route,
 * trợ lý AI và luật tự động đều đi qua đây, nên bốn thứ đó không thể lệch.
 *
 * ⚠️ Ở tầng này KHÔNG kiểm quyền "người này có được sửa không" — đó là việc
 * của lớp gọi (issues.service.ts dùng requireProject). Tầng này chỉ kiểm
 * dữ liệu có hợp lệ với dự án không (trạng thái thuộc đúng quy trình, cha
 * đúng tầng, người được giao có trong dự án…), vì luật tự động chạy dưới
 * danh nghĩa SYSTEM cũng phải tuân theo đúng những luật đó.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import { PRIORITY_DEFAULT, PRIORITY_MAX, PRIORITY_MIN } from './constants.js';
import { emitWorkEvent, type FieldChange, type WorkActor, type WorkEvent } from './events.js';
import { can, loadProjectAccess } from './permissions.js';
import { rankAfter, rankBetween, rankInitial } from './rank.js';
import { tiptapToText } from './tiptapText.js';

type Tx = Prisma.TransactionClient;

/** Các trường sửa được qua applyIssueChange. rank/status đổi qua moveIssue. */
export interface IssuePatch {
  title?: string;
  descriptionJson?: Prisma.InputJsonValue | null;
  priority?: number;
  assigneeId?: number | null;
  storyPoints?: number | null;
  originalEstimateMin?: number | null;
  remainingEstimateMin?: number | null;
  startDate?: Date | null;
  dueDate?: Date | null;
  parentId?: number | null;
  sprintId?: number | null;
  fixVersionId?: number | null;
  statusId?: number;
}

export interface CreateIssueInput extends Omit<IssuePatch, 'statusId'> {
  projectId: number;
  typeId: number;
  title: string;
  statusId?: number;
  reporterId?: number | null;
}

const MAX_DESCRIPTION_TEXT = 100_000;

// ─── Kiểm dữ liệu dùng chung ─────────────────────────────────────

async function workflowIdForType(tx: Tx, projectId: number, typeWorkflowId: number | null): Promise<number> {
  if (typeWorkflowId) return typeWorkflowId;
  const wf = await tx.workWorkflow.findFirst({ where: { projectId, isDefault: true }, select: { id: true } });
  if (!wf) throw new BadRequestError('Project has no default workflow', 'WORK_NO_WORKFLOW');
  return wf.id;
}

async function assertStatusInWorkflow(tx: Tx, statusId: number, workflowId: number) {
  const st = await tx.workStatus.findFirst({ where: { id: statusId, workflowId }, select: { id: true, category: true } });
  if (!st) throw new BadRequestError('Status does not belong to this issue type workflow', 'WORK_BAD_STATUS');
  return st;
}

/** Quy trình không có luồng chuyển nào = chuyển tự do. Có thì phải khớp một dòng. */
async function assertTransitionAllowed(tx: Tx, workflowId: number, fromStatusId: number, toStatusId: number) {
  if (fromStatusId === toStatusId) return;
  const total = await tx.workTransition.count({ where: { workflowId } });
  if (total === 0) return;
  const ok = await tx.workTransition.count({
    where: { workflowId, toStatusId, OR: [{ fromStatusId }, { fromStatusId: null }] },
  });
  if (!ok) throw new BadRequestError('This status change is not allowed by the workflow', 'WORK_TRANSITION_DENIED');
}

async function assertParent(tx: Tx, projectId: number, parentId: number, childLevel: number, childId?: number) {
  if (childId !== undefined && parentId === childId) throw new BadRequestError('An issue cannot be its own parent', 'WORK_BAD_PARENT');
  const parent = await tx.workIssue.findFirst({
    where: { id: parentId, projectId, deletedAt: null },
    select: { id: true, sprintId: true, type: { select: { level: true } } },
  });
  if (!parent) throw new BadRequestError('Parent issue not found in this project', 'WORK_BAD_PARENT');
  if (parent.type.level !== childLevel + 1) {
    throw new BadRequestError(
      childLevel === -1 ? 'A sub-task must belong to a story, task or bug' : 'Only an epic can be the parent of this issue',
      'WORK_BAD_PARENT',
    );
  }
  return parent;
}

async function assertVersion(tx: Tx, projectId: number, versionId: number) {
  const v = await tx.workVersion.findFirst({ where: { id: versionId, projectId }, select: { status: true } });
  if (!v) throw new BadRequestError('Version not found in this project', 'WORK_BAD_VERSION');
  if (v.status === 'ARCHIVED') throw new BadRequestError('This version is archived', 'WORK_VERSION_ARCHIVED');
}

async function assertSprint(tx: Tx, projectId: number, sprintId: number) {
  const sp = await tx.workSprint.findFirst({ where: { id: sprintId, projectId }, select: { state: true } });
  if (!sp) throw new BadRequestError('Sprint not found in this project', 'WORK_BAD_SPRINT');
  if (sp.state === 'CLOSED') throw new BadRequestError('Cannot add issues to a closed sprint', 'WORK_SPRINT_CLOSED');
}

/** Chỉ người có quyền sửa thẻ mới được giao việc (không giao cho giảng viên/khách). */
async function assertAssignable(projectId: number, userId: number) {
  const access = await loadProjectAccess(userId, projectId);
  if (!access || !can(access.role, 'issue.edit')) {
    throw new BadRequestError('This person cannot be assigned issues in this project', 'WORK_BAD_ASSIGNEE');
  }
}

function assertPriority(p: number) {
  if (!Number.isInteger(p) || p < PRIORITY_MIN || p > PRIORITY_MAX) {
    throw new BadRequestError(`Priority must be ${PRIORITY_MIN}–${PRIORITY_MAX}`, 'WORK_BAD_PRIORITY');
  }
}

function descriptionFields(json: Prisma.InputJsonValue | null | undefined) {
  if (json === undefined) return {};
  if (json === null) return { descriptionJson: Prisma.DbNull, descriptionText: null };
  const text = tiptapToText(json).slice(0, MAX_DESCRIPTION_TEXT);
  return { descriptionJson: json, descriptionText: text || null };
}

/** Giá trị lưu vào lịch sử: chuỗi hoặc null. Ngày → YYYY-MM-DD. */
function historyValue(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

function sameValue(a: unknown, b: unknown): boolean {
  return historyValue(a) === historyValue(b);
}

// ─── Tạo thẻ ─────────────────────────────────────────────────────

export async function createIssue(input: CreateIssueInput, actor: WorkActor) {
  const title = input.title.trim();
  if (!title) throw new BadRequestError('Title is required', 'WORK_TITLE_REQUIRED');
  if (input.priority !== undefined) assertPriority(input.priority);
  if (input.assigneeId) await assertAssignable(input.projectId, input.assigneeId);

  const issue = await prisma.$transaction(async (tx) => {
    // Khoá dòng dự án + cấp số. Mọi lệnh tạo thẻ khác của cùng dự án xếp hàng
    // sau khoá này tới khi commit ⇒ vừa không trùng số, vừa không trùng rank.
    const rows = await tx.$queryRaw<Array<{ issue_counter: number }>>`
      UPDATE work_projects SET issue_counter = issue_counter + 1
      WHERE id = ${input.projectId} AND deleted_at IS NULL
      RETURNING issue_counter`;
    if (!rows.length) throw new NotFoundError('Project not found');
    const number = rows[0].issue_counter;

    const type = await tx.workIssueType.findFirst({
      where: { id: input.typeId, projectId: input.projectId, archived: false },
      select: { level: true, workflowId: true },
    });
    if (!type) throw new BadRequestError('Issue type not found in this project', 'WORK_BAD_TYPE');

    const workflowId = await workflowIdForType(tx, input.projectId, type.workflowId);
    let statusId = input.statusId;
    if (statusId) {
      await assertStatusInWorkflow(tx, statusId, workflowId);
    } else {
      const first = await tx.workStatus.findFirst({ where: { workflowId }, orderBy: { position: 'asc' }, select: { id: true } });
      if (!first) throw new BadRequestError('Workflow has no statuses', 'WORK_NO_STATUS');
      statusId = first.id;
    }

    let sprintId = input.sprintId ?? null;
    if (type.level === -1 && !input.parentId) throw new BadRequestError('A sub-task needs a parent issue', 'WORK_BAD_PARENT');
    if (type.level === 1 && input.parentId) throw new BadRequestError('An epic cannot have a parent', 'WORK_BAD_PARENT');
    if (input.parentId) {
      const parent = await assertParent(tx, input.projectId, input.parentId, type.level);
      // Việc con luôn đi theo sprint của cha (như Jira) — không thì burndown đếm đôi.
      if (type.level === -1) sprintId = parent.sprintId;
    }
    if (sprintId && type.level !== -1) await assertSprint(tx, input.projectId, sprintId);
    // Epic không nằm trong sprint.
    if (type.level === 1) sprintId = null;
    if (input.fixVersionId) await assertVersion(tx, input.projectId, input.fixVersionId);

    const last = await tx.workIssue.findFirst({
      where: { projectId: input.projectId },
      orderBy: { rank: 'desc' },
      select: { rank: true },
    });
    const rank = last ? rankAfter(last.rank) : rankInitial();

    const created = await tx.workIssue.create({
      data: {
        projectId: input.projectId,
        number,
        typeId: input.typeId,
        statusId,
        parentId: input.parentId ?? null,
        sprintId,
        fixVersionId: input.fixVersionId ?? null,
        title: title.slice(0, 255),
        ...descriptionFields(input.descriptionJson),
        priority: input.priority ?? PRIORITY_DEFAULT,
        assigneeId: input.assigneeId ?? null,
        reporterId: input.reporterId ?? actor.userId,
        storyPoints: input.storyPoints ?? null,
        originalEstimateMin: input.originalEstimateMin ?? null,
        remainingEstimateMin: input.remainingEstimateMin ?? input.originalEstimateMin ?? null,
        startDate: input.startDate ?? null,
        dueDate: input.dueDate ?? null,
        rank,
      },
    });

    await tx.workHistory.create({
      data: { issueId: created.id, actorId: actor.userId, actorKind: actor.kind, field: 'created', toValue: `${number}` },
    });
    // Người báo và người được giao tự theo dõi thẻ — họ là người cần biết đầu tiên.
    const watchers = [...new Set([created.reporterId, created.assigneeId].filter((x): x is number => !!x))];
    if (watchers.length) {
      await tx.workWatcher.createMany({ data: watchers.map((userId) => ({ issueId: created.id, userId })), skipDuplicates: true });
    }
    return created;
  });

  emitWorkEvent({ type: 'issue.created', projectId: issue.projectId, issueId: issue.id, actor });
  return issue;
}

// ─── Sửa thẻ ─────────────────────────────────────────────────────

export interface ApplyOptions {
  /** Số version client đang cầm. Lệch ⇒ 409, không đè thay đổi của người khác. */
  expectedVersion?: number;
  /** Đổi rank cùng lúc (moveIssue dùng). */
  rank?: string;
}

export async function applyIssueChange(issueId: number, patch: IssuePatch, actor: WorkActor, opts: ApplyOptions = {}) {
  if (patch.priority !== undefined) assertPriority(patch.priority);
  if (patch.title !== undefined && !patch.title.trim()) throw new BadRequestError('Title is required', 'WORK_TITLE_REQUIRED');

  const head = await prisma.workIssue.findFirst({ where: { id: issueId, deletedAt: null }, select: { projectId: true } });
  if (!head) throw new NotFoundError('Issue not found');
  if (patch.assigneeId) await assertAssignable(head.projectId, patch.assigneeId);

  const result = await prisma.$transaction(async (tx) => {
    // Khoá dòng thẻ rồi mới đọc "trước". Đọc ngoài transaction thì hai lệnh
    // chạy cùng lúc (người kéo thẻ + luật tự động) cùng thấy một "trước" và
    // lịch sử ghi sai giá trị cũ.
    await tx.$queryRaw`SELECT id FROM work_issues WHERE id = ${issueId} FOR UPDATE`;
    const before = await tx.workIssue.findFirst({
      where: { id: issueId, deletedAt: null },
      include: { type: { select: { level: true, workflowId: true } }, status: { select: { category: true } } },
    });
    if (!before) throw new NotFoundError('Issue not found');
    const data: Prisma.WorkIssueUncheckedUpdateInput = {};
    const changes: FieldChange[] = [];
    const track = (field: string, from: unknown, to: unknown) => {
      if (!sameValue(from, to)) changes.push({ field, from: historyValue(from), to: historyValue(to) });
    };

    if (patch.title !== undefined) {
      const t = patch.title.trim().slice(0, 255);
      track('title', before.title, t);
      data.title = t;
    }
    if (patch.descriptionJson !== undefined) {
      const d = descriptionFields(patch.descriptionJson);
      const newText = 'descriptionText' in d ? d.descriptionText : null;
      if ((before.descriptionText ?? null) !== newText) {
        // Mô tả dài: lịch sử chỉ giữ 500 ký tự đầu, đủ để biết đã đổi gì.
        changes.push({ field: 'description', from: before.descriptionText?.slice(0, 500) ?? null, to: newText?.slice(0, 500) ?? null });
      }
      Object.assign(data, d);
    }
    const simple: Array<keyof IssuePatch & keyof typeof before> = [
      'priority', 'assigneeId', 'storyPoints', 'originalEstimateMin', 'remainingEstimateMin', 'startDate', 'dueDate',
    ];
    for (const f of simple) {
      if (patch[f] !== undefined) {
        track(f, before[f], patch[f]);
        (data as Record<string, unknown>)[f] = patch[f];
      }
    }

    if (patch.parentId !== undefined && patch.parentId !== before.parentId) {
      if (patch.parentId === null) {
        if (before.type.level === -1) throw new BadRequestError('A sub-task needs a parent issue', 'WORK_BAD_PARENT');
      } else {
        const parent = await assertParent(tx, before.projectId, patch.parentId, before.type.level, before.id);
        if (before.type.level === -1) data.sprintId = parent.sprintId;
      }
      track('parentId', before.parentId, patch.parentId);
      data.parentId = patch.parentId;
    }

    if (patch.sprintId !== undefined && patch.sprintId !== before.sprintId) {
      if (before.type.level === -1) throw new BadRequestError('Move the parent issue to change a sub-task sprint', 'WORK_SUBTASK_SPRINT');
      if (before.type.level === 1) throw new BadRequestError('Epics are not planned into sprints', 'WORK_EPIC_SPRINT');
      if (patch.sprintId !== null) await assertSprint(tx, before.projectId, patch.sprintId);
      track('sprintId', before.sprintId, patch.sprintId);
      data.sprintId = patch.sprintId;
    }

    if (patch.fixVersionId !== undefined && patch.fixVersionId !== before.fixVersionId) {
      if (patch.fixVersionId !== null) await assertVersion(tx, before.projectId, patch.fixVersionId);
      track('fixVersionId', before.fixVersionId, patch.fixVersionId);
      data.fixVersionId = patch.fixVersionId;
    }

    if (patch.statusId !== undefined && patch.statusId !== before.statusId) {
      const workflowId = await workflowIdForType(tx, before.projectId, before.type.workflowId);
      const target = await assertStatusInWorkflow(tx, patch.statusId, workflowId);
      await assertTransitionAllowed(tx, workflowId, before.statusId, patch.statusId);
      track('statusId', before.statusId, patch.statusId);
      data.statusId = patch.statusId;
      // Vào cột DONE thì ghi thời điểm xong; rời DONE thì xoá — báo cáo
      // velocity/burndown đọc resolvedAt chứ không đọc tên cột.
      if (target.category === 'DONE' && before.status.category !== 'DONE') {
        data.resolvedAt = new Date();
        data.resolution = before.resolution ?? 'DONE';
      } else if (target.category !== 'DONE' && before.status.category === 'DONE') {
        data.resolvedAt = null;
        data.resolution = null;
      }
    }

    if (opts.rank !== undefined) data.rank = opts.rank;
    if (!changes.length && opts.rank === undefined) {
      const { type: _t, status: _s, ...plain } = before;
      return { issue: plain, changes };
    }

    data.version = { increment: 1 };
    const updated = await tx.workIssue.updateMany({
      where: { id: issueId, deletedAt: null, ...(opts.expectedVersion !== undefined ? { version: opts.expectedVersion } : {}) },
      data,
    });
    if (updated.count === 0) {
      throw new ConflictError('Someone else just changed this issue. Reload to see the latest version.');
    }

    if (changes.length) {
      await tx.workHistory.createMany({
        data: changes.map((c) => ({
          issueId, actorId: actor.userId, actorKind: actor.kind, field: c.field, fromValue: c.from, toValue: c.to,
        })),
      });
    }
    // Việc con đi theo sprint của cha.
    if (data.sprintId !== undefined && before.type.level === 0) {
      await tx.workIssue.updateMany({ where: { parentId: issueId, deletedAt: null }, data: { sprintId: data.sprintId as number | null } });
    }
    if (patch.assigneeId) {
      await tx.workWatcher.createMany({ data: [{ issueId, userId: patch.assigneeId }], skipDuplicates: true });
    }

    const issue = await tx.workIssue.findUniqueOrThrow({ where: { id: issueId } });
    return { issue, changes };
  });

  if (result.changes.length || opts.rank !== undefined) {
    const event: WorkEvent = { type: 'issue.updated', projectId: head.projectId, issueId, actor, changes: result.changes };
    emitWorkEvent(event);
  }
  return result;
}

// ─── Kéo thả ─────────────────────────────────────────────────────

export interface MoveInput {
  /** Cột đích (đổi trạng thái). Bỏ trống = giữ nguyên. */
  statusId?: number;
  /** Sprint đích; null = về backlog. Bỏ trống = giữ nguyên. */
  sprintId?: number | null;
  /** Thẻ đứng ngay trên/dưới chỗ thả. Cả hai trống = cuối danh sách. */
  beforeIssueId?: number | null;
  afterIssueId?: number | null;
  expectedVersion?: number;
}

export async function moveIssue(issueId: number, input: MoveInput, actor: WorkActor) {
  const issue = await prisma.workIssue.findFirst({ where: { id: issueId, deletedAt: null }, select: { projectId: true } });
  if (!issue) throw new NotFoundError('Issue not found');

  const neighbour = async (id: number | null | undefined) => {
    if (!id) return null;
    const n = await prisma.workIssue.findFirst({ where: { id, projectId: issue.projectId, deletedAt: null }, select: { rank: true } });
    if (!n) throw new BadRequestError('Neighbour issue not found', 'WORK_BAD_NEIGHBOUR');
    return n.rank;
  };
  const above = await neighbour(input.beforeIssueId);
  const below = await neighbour(input.afterIssueId);

  let rank: string | undefined;
  if (above !== null || below !== null) {
    try {
      rank = rankBetween(above, below);
    } catch {
      // Hai hàng xóm sai thứ tự = client đang cầm board cũ.
      throw new ConflictError('The board changed while you were dragging. Reload and try again.');
    }
  }

  return applyIssueChange(
    issueId,
    { statusId: input.statusId, sprintId: input.sprintId },
    actor,
    { expectedVersion: input.expectedVersion, rank },
  );
}
