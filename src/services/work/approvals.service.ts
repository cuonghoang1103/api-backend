/**
 * CT Work — PHÊ DUYỆT (lớp studio đợt S1, mô-đun `approvals`).
 *
 * Một yêu cầu phê duyệt có N bước, mỗi bước là MỘT người đứng tên:
 *   - SEQUENTIAL: lần lượt theo `position` — người sau chỉ quyết khi người
 *     trước đã duyệt; PARALLEL: ai cũng quyết được ngay.
 *   - Một người TỪ CHỐI ⇒ cả yêu cầu REJECTED (bước còn chờ thành SKIPPED).
 *   - Mọi bước DUYỆT ⇒ APPROVED.
 * Không ai quyết THAY người khác — kể cả ADMIN (ADMIN chỉ huỷ được cả yêu cầu).
 *
 * "Chữ ký": lúc quyết, bước lưu IP + `contentHash` = SHA-256 nội dung đối tượng
 * NGAY LÚC ĐÓ (approvalContent.ts). Đối tượng đổi sau khi duyệt ⇒ khi đọc trả
 * `contentChanged: true` — chỉ CẢNH BÁO, không tự huỷ phê duyệt.
 *
 * Phê duyệt cổng giai đoạn (STAGE_GATE) có hiệu ứng phụ trên giai đoạn: duyệt
 * xong ⇒ giai đoạn DONE; bị từ chối / huỷ ⇒ giai đoạn về ACTIVE. Hiệu ứng chạy
 * TRONG cùng transaction với quyết định nên không thể lệch nhau.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import type { ApprovalMode } from './constants.js';
import { currentTargetHash, signedHash } from './approvalContent.js';
import { emitWorkEvent } from './events.js';
import { notifyWork } from './notify.js';
import {
  actionableSteps, can, canCancelApproval, canDecideApprovalStep, loadProjectAccess, requireProject, type ProjectAccess,
} from './permissions.js';
import { approvalOutcome, assertModule, modulesOf } from './studio.js';

type Tx = Prisma.TransactionClient;

const MAX_APPROVERS = 10;

export const APPROVAL_SELECT = {
  id: true, projectId: true, targetType: true, issueId: true, stageId: true, title: true, description: true,
  mode: true, status: true, dueAt: true, contentHash: true, decidedAt: true, createdAt: true, updatedAt: true,
  createdBy: { select: PUBLIC_USER },
  issue: { select: { id: true, number: true, title: true } },
  stage: { select: { id: true, n: true, slug: true, name: true, status: true } },
  steps: {
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
    select: { id: true, approverId: true, position: true, decision: true, comment: true, decidedAt: true, contentHash: true, approver: { select: PUBLIC_USER } },
  },
} satisfies Prisma.WorkApprovalSelect;

type ApprovalRow = Prisma.WorkApprovalGetPayload<{ select: typeof APPROVAL_SELECT }>;

/** Bản trả cho client: thêm cờ "nội dung đã đổi" + bước nào người xem quyết được. IP không bao giờ trả ra. */
async function present(a: ApprovalRow, viewer: { userId: number; role: ProjectAccess['role'] }, projectKey: string) {
  const now = await currentTargetHash(prisma, a);
  const signed = signedHash(a);
  const anyDecided = a.steps.some((s) => s.decidedAt);
  return {
    ...a,
    issueKey: a.issue ? `${projectKey}-${a.issue.number}` : null,
    currentHash: now,
    signedHash: signed,
    // Đã có người ký mà nội dung bây giờ khác lúc ký ⇒ cảnh báo (không tự huỷ).
    contentChanged: anyDecided && now !== null && signed !== null && now !== signed,
    // Còn chờ mà nội dung đã khác lúc gửi duyệt.
    changedSinceRequest: a.status === 'PENDING' && now !== null && a.contentHash !== null && now !== a.contentHash,
    myStepId: a.steps.find((s) => s.approverId === viewer.userId)?.id ?? null,
    canDecide: a.steps.some((s) => canDecideApprovalStep(viewer.role, viewer.userId, a, s.id)),
    canCancel: a.status === 'PENDING' && canCancelApproval(viewer.role, viewer.userId, a.createdBy?.id ?? null),
    waitingOn: actionableSteps(a.mode, a.steps).map((s) => s.approverId),
  };
}

async function projectRef(projectId: number) {
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, workspace: { select: { slug: true } } } });
  return { key: p.key, url: (approvalId: number) => `/work/${p.workspace.slug}/${p.key}/approvals?id=${approvalId}` };
}

/** Người được đứng tên duyệt: còn vào được dự án với vai có quyền 'approval.decide'. */
async function assertApprovers(projectId: number, ids: number[]) {
  if (!ids.length) throw new BadRequestError('Add at least one approver', 'WORK_NO_APPROVERS');
  if (ids.length > MAX_APPROVERS) throw new BadRequestError(`At most ${MAX_APPROVERS} approvers`, 'WORK_LIMIT');
  for (const uid of ids) {
    const a = await loadProjectAccess(uid, projectId);
    if (!a || !can(a.role, 'approval.decide')) {
      throw new BadRequestError('Every approver must be a project member who can approve (viewers cannot)', 'WORK_BAD_APPROVER');
    }
  }
}

async function notifyApprovers(approvalId: number, senderId: number) {
  try {
    const a = await prisma.workApproval.findUnique({ where: { id: approvalId }, select: APPROVAL_SELECT });
    if (!a || a.status !== 'PENDING') return;
    const ref = await projectRef(a.projectId);
    for (const s of actionableSteps(a.mode, a.steps)) {
      await notifyWork({
        receiverId: s.approverId, senderId, type: 'WORK_ALERT', entityId: a.issueId ?? a.id,
        payload: { issueKey: a.issue ? `${ref.key}-${a.issue.number}` : `${ref.key} · ${a.stage?.name ?? 'Approval'}`, title: a.title, message: `Your approval is requested: ${a.title}`, url: ref.url(a.id), approvalId: a.id },
      });
    }
  } catch (err) {
    logger.warn('[work] báo người duyệt lỗi', { approvalId, err: (err as Error).message });
  }
}

async function notifyCreator(approvalId: number, senderId: number, message: string) {
  try {
    const a = await prisma.workApproval.findUnique({ where: { id: approvalId }, select: { id: true, projectId: true, title: true, createdById: true, stage: { select: { name: true } }, issue: { select: { number: true } }, issueId: true } });
    if (!a?.createdById) return;
    const ref = await projectRef(a.projectId);
    await notifyWork({
      receiverId: a.createdById, senderId, type: 'WORK_ALERT', entityId: a.issueId ?? a.id,
      payload: { issueKey: a.issue ? `${ref.key}-${a.issue.number}` : `${ref.key} · ${a.stage?.name ?? 'Approval'}`, title: a.title, message, url: ref.url(a.id), approvalId: a.id },
    });
  } catch (err) {
    logger.warn('[work] báo người tạo phê duyệt lỗi', { approvalId, err: (err as Error).message });
  }
}

// ─── Tạo ─────────────────────────────────────────────────────────

export interface CreateApprovalInput {
  targetType: 'ISSUE' | 'STAGE_GATE';
  issueNumber?: number;
  stageId?: number;
  title?: string;
  description?: string | null;
  mode?: ApprovalMode;
  approverIds: number[];
  dueAt?: Date | null;
}

/**
 * Tạo trong transaction có sẵn (stages.service gọi khi gửi duyệt cổng). Không
 * kiểm quyền người gọi — lớp trên đã kiểm. Trả id.
 */
export async function createApprovalTx(
  tx: Tx,
  projectId: number,
  creatorId: number,
  input: { targetType: 'ISSUE' | 'STAGE_GATE'; issueId?: number | null; stageId?: number | null; title: string; description?: string | null; mode: ApprovalMode; approverIds: number[]; dueAt?: Date | null },
): Promise<number> {
  const hash = await currentTargetHash(tx, { targetType: input.targetType, issueId: input.issueId ?? null, stageId: input.stageId ?? null });
  const a = await tx.workApproval.create({
    data: {
      projectId, targetType: input.targetType, issueId: input.issueId ?? null, stageId: input.stageId ?? null,
      title: input.title.slice(0, 200), description: input.description?.trim() || null, mode: input.mode,
      createdById: creatorId, dueAt: input.dueAt ?? null, contentHash: hash,
      steps: { create: input.approverIds.map((approverId, position) => ({ approverId, position })) },
    },
    select: { id: true },
  });
  return a.id;
}

export async function createApproval(userId: number, projectId: number, input: CreateApprovalInput) {
  const access = await requireProject(userId, projectId, 'approval.create');
  assertModule(access, 'approvals');
  // Cổng giai đoạn chỉ tạo qua POST /stages/:sid/request-gate (có kiểm thứ tự + đổi trạng thái giai đoạn).
  if (input.targetType !== 'ISSUE') throw new BadRequestError('Stage gate approvals are requested from the stage', 'WORK_BAD_APPROVAL_TARGET');
  if (!input.issueNumber) throw new BadRequestError('issueNumber is required', 'VALIDATION_ERROR');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number: input.issueNumber, deletedAt: null }, select: { id: true, number: true, title: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  const approverIds = [...new Set(input.approverIds)];
  await assertApprovers(projectId, approverIds);
  const id = await prisma.$transaction(async (tx) => {
    // Một đối tượng chỉ một yêu cầu đang chờ — hai yêu cầu song song thì không biết cái nào có hiệu lực.
    await tx.$queryRaw`SELECT id FROM work_issues WHERE id = ${issue.id} FOR UPDATE`;
    const open = await tx.workApproval.count({ where: { issueId: issue.id, status: 'PENDING' } });
    if (open) throw new ConflictError('This issue already has a pending approval request');
    return createApprovalTx(tx, projectId, userId, {
      targetType: 'ISSUE', issueId: issue.id, title: input.title?.trim() || `Approve ${access.key}-${issue.number}: ${issue.title}`,
      description: input.description, mode: input.mode ?? 'SEQUENTIAL', approverIds, dueAt: input.dueAt,
    });
  });
  await afterCreate(id, projectId, userId);
  return getApproval(userId, projectId, id);
}

export async function afterCreate(approvalId: number, projectId: number, userId: number) {
  const a = await prisma.workApproval.findUniqueOrThrow({ where: { id: approvalId }, select: { status: true, targetType: true, issueId: true, stageId: true, title: true } });
  emitWorkEvent({ type: 'approval.updated', projectId, approvalId, status: a.status, targetType: a.targetType, targetIssueId: a.issueId, stageId: a.stageId, actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'approval.create', targetType: 'approval', targetId: approvalId, summary: `Requested approval: ${a.title}` });
  await notifyApprovers(approvalId, userId);
}

// ─── Đọc ─────────────────────────────────────────────────────────

export async function getApproval(userId: number, projectId: number, approvalId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'approvals');
  const a = await prisma.workApproval.findFirst({ where: { id: approvalId, projectId }, select: APPROVAL_SELECT });
  if (!a) throw new NotFoundError('Approval request not found');
  return present(a, { userId, role: access.role }, access.key);
}

export async function listApprovals(
  userId: number, projectId: number,
  q: { status?: string; targetType?: string; issueNumber?: number; stageId?: number; limit?: number },
) {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'approvals');
  let issueId: number | undefined;
  if (q.issueNumber) {
    const i = await prisma.workIssue.findFirst({ where: { projectId, number: q.issueNumber }, select: { id: true } });
    if (!i) return [];
    issueId = i.id;
  }
  const rows = await prisma.workApproval.findMany({
    where: {
      projectId,
      ...(q.status ? { status: q.status } : {}),
      ...(q.targetType ? { targetType: q.targetType } : {}),
      ...(issueId ? { issueId } : {}),
      ...(q.stageId ? { stageId: q.stageId } : {}),
    },
    orderBy: { id: 'desc' },
    take: Math.min(Math.max(q.limit ?? 50, 1), 200),
    select: APPROVAL_SELECT,
  });
  return Promise.all(rows.map((a) => present(a, { userId, role: access.role }, access.key)));
}

/**
 * "Chờ tôi duyệt" — mọi dự án: bước của tôi đang tới lượt, yêu cầu còn chờ,
 * tôi còn quyền đứng tên duyệt và dự án còn bật mô-đun approvals.
 */
export async function myPendingApprovals(userId: number) {
  const steps = await prisma.workApprovalStep.findMany({
    where: { approverId: userId, decision: 'PENDING', approval: { status: 'PENDING', project: { deletedAt: null, workspace: { deletedAt: null } } } },
    select: { approvalId: true },
    take: 500,
  });
  const ids = [...new Set(steps.map((s) => s.approvalId))];
  if (!ids.length) return [];
  const rows = await prisma.workApproval.findMany({
    where: { id: { in: ids } },
    orderBy: [{ dueAt: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }],
    select: { ...APPROVAL_SELECT, project: { select: { id: true, key: true, name: true, settings: true, workspace: { select: { slug: true } } } } },
  });
  const out = [];
  for (const r of rows) {
    const { project, ...a } = r;
    if (!modulesOf(project.settings).approvals) continue;
    const access = await loadProjectAccess(userId, project.id);
    if (!access) continue;
    const myStep = a.steps.find((s) => s.approverId === userId);
    if (!myStep || !canDecideApprovalStep(access.role, userId, a, myStep.id)) continue;
    out.push({
      ...(await present(a, { userId, role: access.role }, project.key)),
      project: { id: project.id, key: project.key, name: project.name, workspaceSlug: project.workspace.slug },
    });
  }
  return out;
}

// ─── Quyết định ──────────────────────────────────────────────────

/** Hiệu ứng lên giai đoạn khi yêu cầu cổng kết thúc. Chạy TRONG transaction quyết định. */
async function applyStageEffect(tx: Tx, stageId: number | null, status: 'APPROVED' | 'REJECTED' | 'CANCELLED') {
  if (!stageId) return;
  if (status === 'APPROVED') {
    await tx.workStage.update({ where: { id: stageId }, data: { status: 'DONE', completedAt: new Date() } });
  } else {
    await tx.workStage.updateMany({ where: { id: stageId, status: 'GATE_REVIEW' }, data: { status: 'ACTIVE' } });
  }
}

export async function decideApproval(
  userId: number, projectId: number, approvalId: number,
  input: { decision: 'APPROVE' | 'REJECT'; comment?: string | null },
  meta: { ip?: string | null } = {},
) {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'approvals');
  const comment = input.comment?.trim() || null;
  if (input.decision === 'REJECT' && !comment) throw new BadRequestError('Say why you are rejecting', 'WORK_REJECT_REASON');

  const result = await prisma.$transaction(async (tx) => {
    // Khoá yêu cầu: hai người quyết cùng lúc (song song) không được cùng đọc "còn chờ".
    await tx.$queryRaw`SELECT id FROM work_approvals WHERE id = ${approvalId} FOR UPDATE`;
    const a = await tx.workApproval.findFirst({
      where: { id: approvalId, projectId },
      select: { id: true, status: true, mode: true, targetType: true, issueId: true, stageId: true, steps: { select: { id: true, approverId: true, position: true, decision: true } } },
    });
    if (!a) throw new NotFoundError('Approval request not found');
    const mine = a.steps.find((s) => s.approverId === userId);
    if (!mine) throw new ForbiddenError('You are not an approver on this request. Nobody can approve on behalf of someone else.');
    if (a.status !== 'PENDING') throw new ConflictError(`This request is already ${a.status.toLowerCase()}`);
    if (mine.decision !== 'PENDING') throw new ConflictError('You have already decided on this request');
    if (!canDecideApprovalStep(access.role, userId, a, mine.id)) {
      if (!can(access.role, 'approval.decide')) throw new ForbiddenError('Your project role cannot approve');
      throw new AppError('It is not your turn yet — earlier approvers decide first', 409, 'WORK_APPROVAL_NOT_YOUR_TURN');
    }
    const hash = await currentTargetHash(tx, a);
    const decision = input.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    await tx.workApprovalStep.update({
      where: { id: mine.id },
      data: { decision, comment, decidedAt: new Date(), ip: meta.ip?.slice(0, 64) ?? null, contentHash: hash },
    });
    const steps = a.steps.map((s) => (s.id === mine.id ? { ...s, decision } : s));
    const outcome = approvalOutcome(steps);
    if (outcome !== 'PENDING') {
      if (outcome === 'REJECTED') {
        await tx.workApprovalStep.updateMany({ where: { approvalId, decision: 'PENDING' }, data: { decision: 'SKIPPED' } });
      }
      await tx.workApproval.update({ where: { id: approvalId }, data: { status: outcome, decidedAt: new Date() } });
      if (a.targetType === 'STAGE_GATE') await applyStageEffect(tx, a.stageId, outcome);
    }
    return { outcome, decision, targetType: a.targetType, issueId: a.issueId, stageId: a.stageId };
  });

  emitWorkEvent({ type: 'approval.updated', projectId, approvalId, status: result.outcome, targetType: result.targetType, targetIssueId: result.issueId, stageId: result.stageId, actor: { kind: 'USER', userId } });
  if (result.stageId && result.outcome !== 'PENDING') {
    emitWorkEvent({ type: 'stage.updated', projectId, stageId: result.stageId, status: result.outcome === 'APPROVED' ? 'DONE' : 'ACTIVE', actor: { kind: 'USER', userId } });
  }
  await auditProject(projectId, {
    actorId: userId, action: input.decision === 'APPROVE' ? 'approval.approve' : 'approval.reject', targetType: 'approval', targetId: approvalId,
    summary: `${input.decision === 'APPROVE' ? 'Approved' : 'Rejected'} approval request #${approvalId}${result.outcome !== 'PENDING' ? ` (request is now ${result.outcome})` : ''}`,
    detail: { ip: meta.ip ?? null, comment },
  });
  if (result.outcome === 'PENDING') await notifyApprovers(approvalId, userId);
  else await notifyCreator(approvalId, userId, result.outcome === 'APPROVED' ? 'Approval request approved' : 'Approval request rejected');
  return getApproval(userId, projectId, approvalId);
}

export async function cancelApproval(userId: number, projectId: number, approvalId: number, reason?: string | null) {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'approvals');
  const r = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_approvals WHERE id = ${approvalId} FOR UPDATE`;
    const a = await tx.workApproval.findFirst({ where: { id: approvalId, projectId }, select: { id: true, status: true, createdById: true, targetType: true, issueId: true, stageId: true, title: true } });
    if (!a) throw new NotFoundError('Approval request not found');
    if (!canCancelApproval(access.role, userId, a.createdById)) throw new ForbiddenError('Only the requester or a project admin can cancel this request');
    if (a.status !== 'PENDING') throw new ConflictError(`This request is already ${a.status.toLowerCase()}`);
    await tx.workApprovalStep.updateMany({ where: { approvalId, decision: 'PENDING' }, data: { decision: 'SKIPPED' } });
    await tx.workApproval.update({ where: { id: approvalId }, data: { status: 'CANCELLED', decidedAt: new Date() } });
    if (a.targetType === 'STAGE_GATE') await applyStageEffect(tx, a.stageId, 'CANCELLED');
    return a;
  });
  emitWorkEvent({ type: 'approval.updated', projectId, approvalId, status: 'CANCELLED', targetType: r.targetType, targetIssueId: r.issueId, stageId: r.stageId, actor: { kind: 'USER', userId } });
  if (r.stageId) emitWorkEvent({ type: 'stage.updated', projectId, stageId: r.stageId, status: 'ACTIVE', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'approval.cancel', targetType: 'approval', targetId: approvalId, summary: `Cancelled approval request: ${r.title}${reason ? ` — ${reason.slice(0, 200)}` : ''}` });
  return getApproval(userId, projectId, approvalId);
}
