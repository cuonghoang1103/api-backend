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
import { logger } from '../../utils/logger.js';
import { BadRequestError, ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import { PRIORITY_DEFAULT, PRIORITY_MAX, PRIORITY_MIN } from './constants.js';
import { emitWorkEvent, type FieldChange, type WorkActor, type WorkEvent } from './events.js';
import { can, loadProjectAccess } from './permissions.js';
import { rankAfter, rankBetween, rankInitial } from './rank.js';
import { tiptapToText } from './tiptapText.js';
import { assertModule, hasRules, transitionRulesOf } from './studio.js';
import { currentTargetHash, signedHash } from './approvalContent.js';
// Đợt S6: nguồn gốc AI + luật "AI-assisted work needs an independent reviewer".
import { AI_SOURCE, assertAiIndependentReview, assistantModel, provenanceValue } from './provenance.js';

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
  /** Bộ phận phụ trách (mô-đun teams). null = bỏ trống — luôn được phép. */
  teamId?: number | null;
  /** Giai đoạn (mô-đun stages). null = bỏ trống — luôn được phép. */
  stageId?: number | null;
  statusId?: number;
  /** Đợt S6: gắn / gỡ nhãn "AI-assisted" bằng tay. */
  aiAssisted?: boolean;
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

/** Cài đặt dự án: trường phải có giá trị trước khi thẻ vào cột DONE (vd Evidence — Definition of Done SWP391). */
export interface DoneRequirements { fieldIds: number[]; typeKeys?: string[] | null }

/**
 * Chặn chuyển sang DONE khi thiếu trường bắt buộc (25/09/2026). Chạy TRONG cửa ghi
 * chung nên kéo trên board, sửa hàng loạt, app mobile hay AI "Apply" đều bị chặn
 * như nhau. Không áp cho luật tự động / hệ thống (PR merge của GitHub/GitLab):
 * những đường đó do admin tự cấu hình, và chặn im lặng thì luật trông như hỏng.
 */
export async function assertDoneRequirements(tx: Tx, projectId: number, issueId: number, typeKey: string, issueKey: string) {
  const p = await tx.workProject.findUnique({ where: { id: projectId }, select: { settings: true } });
  const req = (p?.settings as { doneRequirements?: DoneRequirements } | null)?.doneRequirements;
  if (!req?.fieldIds?.length) return;
  if (req.typeKeys?.length && !req.typeKeys.includes(typeKey)) return;
  const fields = await tx.workCustomField.findMany({ where: { projectId, id: { in: req.fieldIds } }, select: { id: true, name: true, typeKeys: true } });
  const applicable = fields.filter((f) => !Array.isArray(f.typeKeys) || (f.typeKeys as string[]).includes(typeKey));
  if (!applicable.length) return;
  const values = await tx.workCustomValue.findMany({ where: { issueId, fieldId: { in: applicable.map((f) => f.id) } }, select: { fieldId: true, value: true } });
  const filled = (v: unknown) => v !== null && v !== undefined && v !== false && !(typeof v === 'string' && !v.trim()) && !(Array.isArray(v) && !v.length);
  const missing = applicable.filter((f) => !filled(values.find((x) => x.fieldId === f.id)?.value)).map((f) => f.name);
  if (missing.length) {
    throw new BadRequestError(`Fill in ${missing.join(', ')} on ${issueKey} before moving it to Done (Definition of Done).`, 'WORK_DONE_REQUIREMENTS');
  }
}

/**
 * Quy trình không có luồng chuyển nào = chuyển tự do. Có thì phải khớp một dòng.
 *
 * Luật của dòng khớp (WorkTransition.rules — đợt S1, trước đó là cột chết):
 *   - teamIds: chỉ thành viên các bộ phận này (hoặc ADMIN dự án) được chuyển;
 *   - requireApproval: thẻ phải có một phê duyệt ISSUE đã APPROVED mà nội dung
 *     chưa đổi kể từ lúc ký (hash còn khớp) — ADMIN cũng không vượt được.
 * Dòng cụ thể (from = trạng thái hiện tại) thắng dòng "từ bất kỳ đâu". Chỉ áp
 * cho người và AI; luật tự động/hệ thống không bị chặn (cùng lý do Done rules).
 */
async function assertTransitionAllowed(
  tx: Tx, workflowId: number, fromStatusId: number, toStatusId: number,
  ctx?: { issueId: number; projectId: number; actor: WorkActor },
) {
  if (fromStatusId === toStatusId) return;
  const total = await tx.workTransition.count({ where: { workflowId } });
  if (total === 0) return;
  const rows = await tx.workTransition.findMany({
    where: { workflowId, toStatusId, OR: [{ fromStatusId }, { fromStatusId: null }] },
    select: { fromStatusId: true, rules: true },
  });
  if (!rows.length) throw new BadRequestError('This status change is not allowed by the workflow', 'WORK_TRANSITION_DENIED');
  const rules = transitionRulesOf((rows.find((r) => r.fromStatusId === fromStatusId) ?? rows[0]).rules);
  if (!hasRules(rules) || !ctx || (ctx.actor.kind !== 'USER' && ctx.actor.kind !== 'AI') || !ctx.actor.userId) return;
  const userId = ctx.actor.userId;
  if (rules.teamIds?.length) {
    const access = await loadProjectAccess(userId, ctx.projectId);
    if (access?.role !== 'ADMIN') {
      const inTeam = await tx.workTeamMember.count({ where: { userId, teamId: { in: rules.teamIds } } });
      if (!inTeam) {
        const names = (await tx.workTeam.findMany({ where: { id: { in: rules.teamIds } }, select: { name: true } })).map((t) => t.name);
        throw new BadRequestError(`Only members of ${names.join(', ') || 'the assigned team'} can make this status change`, 'WORK_TRANSITION_TEAM');
      }
    }
  }
  if (rules.requireApproval) {
    const approvals = await tx.workApproval.findMany({
      where: { issueId: ctx.issueId, targetType: 'ISSUE', status: 'APPROVED' },
      select: { targetType: true, issueId: true, stageId: true, contentHash: true, steps: { select: { contentHash: true, decidedAt: true } } },
    });
    const now = approvals.length ? await currentTargetHash(tx, approvals[0]) : null;
    if (!approvals.some((a) => signedHash(a) === now)) {
      throw new BadRequestError(
        approvals.length
          ? 'This issue changed after it was approved. Request approval again before making this status change.'
          : 'This status change needs an approved approval request on the issue first',
        'WORK_TRANSITION_APPROVAL',
      );
    }
  }
}

/** Bộ phận phải thuộc cùng không gian, chưa lưu trữ; mô-đun teams phải bật. */
async function assertTeam(tx: Tx, projectId: number, teamId: number) {
  const p = await tx.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { workspaceId: true, settings: true } });
  assertModule(p, 'teams');
  const t = await tx.workTeam.findFirst({ where: { id: teamId, workspaceId: p.workspaceId, archivedAt: null }, select: { id: true } });
  if (!t) throw new BadRequestError('Team not found in this workspace', 'WORK_BAD_TEAM');
}

/** Giai đoạn phải thuộc dự án; mô-đun stages phải bật. */
async function assertStage(tx: Tx, projectId: number, stageId: number) {
  const p = await tx.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
  assertModule(p, 'stages');
  const st = await tx.workStage.findFirst({ where: { id: stageId, projectId }, select: { id: true } });
  if (!st) throw new BadRequestError('Stage not found in this project', 'WORK_BAD_STAGE');
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
  // Đợt S6: thẻ do AI đề xuất (actor AI) hoặc gắn tay ⇒ AI-assisted ngay từ lúc tạo.
  const aiMark = actor.kind === 'AI'
    ? { model: actor.model ?? (await assistantModel()), appliedById: actor.userId, source: AI_SOURCE.apply }
    : input.aiAssisted ? { model: null, appliedById: null, source: AI_SOURCE.manual } : null;

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
    if (input.teamId) await assertTeam(tx, input.projectId, input.teamId);
    if (input.stageId) await assertStage(tx, input.projectId, input.stageId);

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
        teamId: input.teamId ?? null,
        stageId: input.stageId ?? null,
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
        ...(aiMark ? { aiAssisted: true, aiModel: aiMark.model, aiAssistedAt: new Date(), aiAppliedById: aiMark.appliedById } : {}),
      },
    });

    await tx.workHistory.create({
      data: { issueId: created.id, actorId: actor.userId, actorKind: actor.kind, field: 'created', toValue: `${number}` },
    });
    if (aiMark) {
      await tx.workHistory.create({
        data: { issueId: created.id, actorId: actor.userId, actorKind: actor.kind, field: 'aiAssisted', toValue: provenanceValue(aiMark.model, aiMark.source) },
      });
    }
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
  /**
   * Đợt S6: gắn AI-assisted kèm nguồn (commit/PR có trailer Co-Authored-By, gợi ý Spec Fidelity…). Actor kind AI có
   * đổi tiêu đề/mô tả thì tự gắn, không cần truyền.
   */
  aiProvenance?: { model: string | null; source: string; appliedById: number | null };
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
      include: { type: { select: { level: true, workflowId: true, key: true } }, status: { select: { category: true } }, project: { select: { key: true } } },
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

    if (patch.teamId !== undefined && patch.teamId !== before.teamId) {
      if (patch.teamId !== null) await assertTeam(tx, before.projectId, patch.teamId);
      track('teamId', before.teamId, patch.teamId);
      data.teamId = patch.teamId;
    }

    if (patch.stageId !== undefined && patch.stageId !== before.stageId) {
      if (patch.stageId !== null) await assertStage(tx, before.projectId, patch.stageId);
      track('stageId', before.stageId, patch.stageId);
      data.stageId = patch.stageId;
    }

    if (patch.statusId !== undefined && patch.statusId !== before.statusId) {
      const workflowId = await workflowIdForType(tx, before.projectId, before.type.workflowId);
      const target = await assertStatusInWorkflow(tx, patch.statusId, workflowId);
      await assertTransitionAllowed(tx, workflowId, before.statusId, patch.statusId, { issueId, projectId: before.projectId, actor });
      track('statusId', before.statusId, patch.statusId);
      data.statusId = patch.statusId;
      // Vào cột DONE thì ghi thời điểm xong; rời DONE thì xoá — báo cáo
      // velocity/burndown đọc resolvedAt chứ không đọc tên cột.
      if (target.category === 'DONE' && before.status.category !== 'DONE') {
        if (actor.kind === 'USER' || actor.kind === 'AI') {
          await assertDoneRequirements(tx, before.projectId, issueId, before.type.key, `${before.project.key}-${before.number}`);
          // Đợt S6: thẻ AI-assisted + luật duyệt độc lập bật ⇒ cần người khác người tạo/người áp dụng AI duyệt.
          await assertAiIndependentReview(tx, before.projectId, before, `${before.project.key}-${before.number}`);
        }
        data.resolvedAt = new Date();
        data.resolution = before.resolution ?? 'DONE';
      } else if (target.category !== 'DONE' && before.status.category === 'DONE') {
        data.resolvedAt = null;
        data.resolution = null;
      }
    }

    // ── Đợt S6: nguồn gốc AI ──
    // Đề xuất AI đổi NỘI DUNG (tiêu đề/mô tả) ⇒ AI-assisted; chỉ kéo cột / đổi sprint thì không phải "AI viết".
    const contentByAi = actor.kind === 'AI' && changes.some((c) => c.field === 'title' || c.field === 'description');
    const prov = opts.aiProvenance
      ?? (contentByAi ? { model: actor.model ?? (await assistantModel()), source: AI_SOURCE.apply, appliedById: actor.userId } : null);
    if (prov) {
      data.aiAssisted = true;
      data.aiModel = prov.model?.slice(0, 120) ?? null;
      data.aiAssistedAt = new Date();
      if (prov.appliedById) data.aiAppliedById = prov.appliedById;
      // Luôn ghi (kể cả cùng model): mỗi lần áp dụng là một mốc provenance — người + thời điểm = actor + createdAt.
      changes.push({ field: 'aiAssisted', from: before.aiAssisted ? (before.aiModel ?? 'yes') : null, to: provenanceValue(prov.model, prov.source) });
    } else if (patch.aiAssisted !== undefined && patch.aiAssisted !== before.aiAssisted) {
      data.aiAssisted = patch.aiAssisted;
      if (patch.aiAssisted) data.aiAssistedAt = new Date();
      changes.push({ field: 'aiAssisted', from: before.aiAssisted ? (before.aiModel ?? 'yes') : null, to: patch.aiAssisted ? provenanceValue(null, AI_SOURCE.manual) : null });
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
  // Đợt S5a: đổi trạng thái của thẻ service desk ⇒ sự kiện SLA (giải quyết / mở lại / chờ khách / trả lời).
  // Gọi thẳng sau commit (không qua bus) để lệnh trả về là SLA đã đúng; lỗi chỉ ghi log, không làm hỏng lệnh.
  if (result.changes.some((c) => c.field === 'statusId')) {
    await import('./serviceDesk.service.js')
      .then((m) => m.onIssueChanged(issueId, result.changes, actor))
      .catch((err) => logger.warn('[work] desk: cập nhật SLA sau đổi trạng thái lỗi', { issueId, err: (err as Error).message }));
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
