/**
 * CT Work — GIAI ĐOẠN + CỔNG (lớp studio đợt S1, mô-đun `stages`).
 *
 * Vòng đời một giai đoạn: NOT_STARTED → ACTIVE → GATE_REVIEW → DONE.
 *   - Kích hoạt (→ ACTIVE): mọi giai đoạn đứng trước phải DONE. ADMIN được
 *     GHI ĐÈ khi có lý do — ghi audit log (`stage.override`).
 *   - Gửi duyệt cổng (→ GATE_REVIEW): tạo một WorkApproval STAGE_GATE với người
 *     duyệt cấu hình ở settings.stageGate (mặc định: ADMIN dự án). Cần cả mô-đun
 *     `approvals`.
 *   - DONE: CHỈ khi phê duyệt cổng APPROVED (approvals.service đổi trong cùng
 *     transaction). Không có đường nào khác — kể cả ADMIN.
 *   - Bị từ chối / huỷ ⇒ về ACTIVE, sửa rồi gửi lại.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { createApprovalTx, afterCreate, getApproval } from './approvals.service.js';
import { emitWorkEvent } from './events.js';
import { can, loadProjectAccess, requireProject } from './permissions.js';
import { stageGateOf } from './projects.service.js';
import { assertModule, stageActivationBlocker } from './studio.js';
// Đợt S6: cổng "Spec Fidelity gate" khi xin duyệt cổng giai đoạn đặc tả.
import { gateSummary, stageGateCheck } from './specReview.service.js';

const MAX_STAGES = 60;
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;

const STAGE_SELECT = {
  id: true, n: true, slug: true, name: true, status: true, gateIssueId: true, startedAt: true, completedAt: true, createdAt: true,
  gateIssue: { select: { id: true, number: true, title: true, resolvedAt: true } },
} satisfies Prisma.WorkStageSelect;

async function requireStages(userId: number, projectId: number, action: 'project.view' | 'stage.manage' | 'stage.requestGate') {
  const access = await requireProject(userId, projectId, action);
  assertModule(access, 'stages');
  return access;
}

export async function listStages(userId: number, projectId: number) {
  const access = await requireStages(userId, projectId, 'project.view');
  const [stages, counts, pending] = await Promise.all([
    prisma.workStage.findMany({ where: { projectId }, orderBy: { n: 'asc' }, select: STAGE_SELECT }),
    prisma.workIssue.groupBy({
      by: ['stageId', 'resolvedAt'],
      where: { projectId, deletedAt: null, stageId: { not: null } },
      _count: { _all: true },
    }),
    prisma.workApproval.findMany({ where: { projectId, targetType: 'STAGE_GATE', status: 'PENDING' }, select: { id: true, stageId: true } }),
  ]);
  return stages.map((s) => {
    const mine = counts.filter((c) => c.stageId === s.id);
    const total = mine.reduce((n, c) => n + c._count._all, 0);
    const done = mine.filter((c) => c.resolvedAt !== null).reduce((n, c) => n + c._count._all, 0);
    return {
      ...s,
      gateIssueKey: s.gateIssue ? `${access.key}-${s.gateIssue.number}` : null,
      issueCount: total,
      doneCount: done,
      pendingApprovalId: pending.find((p) => p.stageId === s.id)?.id ?? null,
    };
  });
}

async function findStage(projectId: number, stageId: number) {
  const s = await prisma.workStage.findFirst({ where: { id: stageId, projectId }, select: STAGE_SELECT });
  if (!s) throw new NotFoundError('Stage not found');
  return s;
}

async function gateIssueIdOf(projectId: number, number: number | null | undefined): Promise<number | null | undefined> {
  if (number === undefined) return undefined;
  if (number === null) return null;
  const i = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!i) throw new BadRequestError('Gate issue not found in this project', 'WORK_BAD_GATE_ISSUE');
  return i.id;
}

export async function createStage(userId: number, projectId: number, input: { n?: number; slug: string; name: string; gateIssueNumber?: number | null }) {
  await requireStages(userId, projectId, 'stage.manage');
  const slug = input.slug.trim().toLowerCase();
  if (!SLUG_RE.test(slug)) throw new BadRequestError('Stage slug must be lowercase letters, digits and dashes', 'WORK_BAD_SLUG');
  const name = input.name.trim().slice(0, 160);
  if (!name) throw new BadRequestError('Stage name is required', 'WORK_NAME_REQUIRED');
  const count = await prisma.workStage.count({ where: { projectId } });
  if (count >= MAX_STAGES) throw new BadRequestError('This project has too many stages', 'WORK_LIMIT');
  const last = await prisma.workStage.findFirst({ where: { projectId }, orderBy: { n: 'desc' }, select: { n: true } });
  const n = input.n ?? (last ? last.n + 1 : 0);
  try {
    const s = await prisma.workStage.create({
      data: { projectId, n, slug, name, gateIssueId: (await gateIssueIdOf(projectId, input.gateIssueNumber)) ?? null },
      select: STAGE_SELECT,
    });
    emitWorkEvent({ type: 'stage.updated', projectId, stageId: s.id, status: s.status, actor: { kind: 'USER', userId } });
    return s;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('A stage with that number or slug already exists');
    throw err;
  }
}

/** Sửa tên/slug/số thứ tự/thẻ cổng. Trạng thái KHÔNG đổi ở đây (có route riêng). */
export async function updateStage(userId: number, projectId: number, stageId: number, input: { n?: number; slug?: string; name?: string; gateIssueNumber?: number | null }) {
  await requireStages(userId, projectId, 'stage.manage');
  await findStage(projectId, stageId);
  const data: Prisma.WorkStageUncheckedUpdateInput = {};
  if (input.slug !== undefined) {
    const slug = input.slug.trim().toLowerCase();
    if (!SLUG_RE.test(slug)) throw new BadRequestError('Stage slug must be lowercase letters, digits and dashes', 'WORK_BAD_SLUG');
    data.slug = slug;
  }
  if (input.name !== undefined) {
    const name = input.name.trim().slice(0, 160);
    if (!name) throw new BadRequestError('Stage name is required', 'WORK_NAME_REQUIRED');
    data.name = name;
  }
  if (input.n !== undefined) data.n = input.n;
  const gate = await gateIssueIdOf(projectId, input.gateIssueNumber);
  if (gate !== undefined) data.gateIssueId = gate;
  try {
    const s = await prisma.workStage.update({ where: { id: stageId }, data, select: STAGE_SELECT });
    emitWorkEvent({ type: 'stage.updated', projectId, stageId, status: s.status, actor: { kind: 'USER', userId } });
    return s;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('A stage with that number or slug already exists');
    throw err;
  }
}

/** Xoá giai đoạn: thẻ về "chưa có giai đoạn" (FK SET NULL); yêu cầu cổng của nó bị xoá theo. */
export async function deleteStage(userId: number, projectId: number, stageId: number) {
  await requireStages(userId, projectId, 'stage.manage');
  const s = await findStage(projectId, stageId);
  await prisma.workStage.delete({ where: { id: stageId } });
  await auditProject(projectId, { actorId: userId, action: 'stage.delete', targetType: 'stage', targetId: stageId, summary: `Deleted stage ${s.n}. ${s.name}` });
  emitWorkEvent({ type: 'stage.updated', projectId, stageId, status: 'DELETED', actor: { kind: 'USER', userId } });
}

/**
 * Kích hoạt giai đoạn. Giai đoạn trước chưa DONE ⇒ 409 WORK_STAGE_BLOCKED (kèm
 * giai đoạn đang chặn). ADMIN gửi `override: { reason }` để vượt — ghi audit.
 */
export async function activateStage(userId: number, projectId: number, stageId: number, input: { override?: { reason: string } | null } = {}) {
  const access = await requireStages(userId, projectId, 'stage.manage');
  const result = await prisma.$transaction(async (tx) => {
    // Khoá các giai đoạn của dự án: hai lệnh kích hoạt/duyệt cùng lúc không đọc trạng thái cũ.
    await tx.$queryRaw`SELECT id FROM work_stages WHERE project_id = ${projectId} FOR UPDATE`;
    const stages = await tx.workStage.findMany({ where: { projectId }, select: { id: true, n: true, status: true, name: true } });
    const target = stages.find((s) => s.id === stageId);
    if (!target) throw new NotFoundError('Stage not found');
    if (target.status !== 'NOT_STARTED') throw new ConflictError(`This stage is already ${target.status.replace('_', ' ').toLowerCase()}`);
    const blocker = stageActivationBlocker(stages, stageId);
    let overridden = false;
    if (blocker) {
      const reason = input.override?.reason?.trim() ?? '';
      if (!input.override) {
        throw new AppError(
          `Stage ${blocker.n}. ${blocker.name} is not done yet. Finish its gate first, or override with a reason.`,
          409, 'WORK_STAGE_BLOCKED', { blockingStage: { id: blocker.id, n: blocker.n, name: blocker.name, status: blocker.status } },
        );
      }
      if (!can(access.role, 'stage.manage')) throw new AppError('Only a project admin can override the stage order', 403, 'FORBIDDEN');
      if (reason.length < 3) throw new BadRequestError('Give a reason for overriding the stage order', 'WORK_OVERRIDE_REASON');
      overridden = true;
    }
    await tx.workStage.update({ where: { id: stageId }, data: { status: 'ACTIVE', startedAt: new Date() } });
    return { target, blocker, overridden };
  });
  if (result.overridden) {
    await auditProject(projectId, {
      actorId: userId, action: 'stage.override', targetType: 'stage', targetId: stageId,
      summary: `Activated stage ${result.target.n}. ${result.target.name} before stage ${result.blocker!.n}. ${result.blocker!.name} was done — ${input.override!.reason.trim().slice(0, 300)}`,
      detail: { blockingStageId: result.blocker!.id, reason: input.override!.reason.trim() },
    });
  } else {
    await auditProject(projectId, { actorId: userId, action: 'stage.activate', targetType: 'stage', targetId: stageId, summary: `Activated stage ${result.target.n}. ${result.target.name}` });
  }
  emitWorkEvent({ type: 'stage.updated', projectId, stageId, status: 'ACTIVE', actor: { kind: 'USER', userId } });
  return findStage(projectId, stageId);
}

/** Người duyệt cổng: cấu hình (còn hợp lệ) → trưởng dự án (nếu là ADMIN) → ADMIN dự án có tên → chủ không gian. */
export async function gateApprovers(projectId: number): Promise<{ ids: number[]; mode: 'SEQUENTIAL' | 'PARALLEL'; configured: boolean }> {
  const p = await prisma.workProject.findUniqueOrThrow({
    where: { id: projectId },
    select: { settings: true, leadId: true, workspace: { select: { ownerId: true } }, members: { where: { role: 'ADMIN' }, orderBy: { id: 'asc' }, select: { userId: true } } },
  });
  const cfg = stageGateOf(p.settings);
  const valid = async (uid: number) => {
    const a = await loadProjectAccess(uid, projectId);
    return !!a && can(a.role, 'approval.decide');
  };
  if (cfg.approverIds.length) {
    const ids: number[] = [];
    for (const uid of cfg.approverIds) if (await valid(uid)) ids.push(uid);
    if (ids.length) return { ids, mode: cfg.mode, configured: true };
  }
  if (p.leadId && (await loadProjectAccess(p.leadId, projectId))?.role === 'ADMIN') return { ids: [p.leadId], mode: 'SEQUENTIAL', configured: false };
  for (const m of p.members) if ((await loadProjectAccess(m.userId, projectId))?.role === 'ADMIN') return { ids: [m.userId], mode: 'SEQUENTIAL', configured: false };
  return { ids: [p.workspace.ownerId], mode: 'SEQUENTIAL', configured: false };
}

/**
 * Gửi giai đoạn đang ACTIVE đi duyệt cổng ⇒ GATE_REVIEW + một yêu cầu phê duyệt STAGE_GATE.
 *
 * Đợt S6: giai đoạn có cổng Spec Fidelity (settings.specGate bật, giai đoạn `dac-ta-yeu-cau` hoặc giai đoạn chọn) ⇒
 * lần chấm mới nhất của giai đoạn được ĐÍNH KÈM vào phê duyệt (specReviewId + một dòng trong mô tả). Chưa chấm / dưới
 * ngưỡng ⇒ 409 WORK_SPEC_GATE; ADMIN gửi `override: { reason }` để vượt — ghi audit `spec.gate.override`.
 */
export async function requestGate(userId: number, projectId: number, stageId: number, input: { description?: string | null; dueAt?: Date | null; override?: { reason: string } | null } = {}) {
  const access = await requireStages(userId, projectId, 'stage.requestGate');
  assertModule(access, 'approvals');
  const stageRow = await prisma.workStage.findFirst({ where: { id: stageId, projectId }, select: { id: true, slug: true, n: true, name: true } });
  if (!stageRow) throw new NotFoundError('Stage not found');
  const spec = await stageGateCheck(projectId, stageRow);
  let overrideReason: string | null = null;
  if (spec.applies && !spec.pass) {
    if (!input.override) {
      throw new AppError(
        `Spec Fidelity gate: ${spec.reasons.join('; ')}. Run "Check spec quality" and fix the findings, or ask a project admin to override with a reason.`,
        409, 'WORK_SPEC_GATE', { specGate: spec },
      );
    }
    if (access.role !== 'ADMIN') throw new AppError('Only a project admin can override the Spec Fidelity gate', 403, 'FORBIDDEN');
    overrideReason = input.override.reason?.trim() ?? '';
    if (overrideReason.length < 3) throw new BadRequestError('Give a reason for overriding the Spec Fidelity gate', 'WORK_OVERRIDE_REASON');
  }
  const specLine = spec.applies ? gateSummary(spec, overrideReason) : null;
  const description = specLine ? [input.description?.trim(), specLine].filter(Boolean).join('\n\n') : input.description;
  const approvers = await gateApprovers(projectId);
  const approvalId = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_stages WHERE id = ${stageId} AND project_id = ${projectId} FOR UPDATE`;
    const s = await tx.workStage.findFirst({ where: { id: stageId, projectId }, select: { id: true, n: true, name: true, status: true } });
    if (!s) throw new NotFoundError('Stage not found');
    if (s.status !== 'ACTIVE') throw new ConflictError(s.status === 'GATE_REVIEW' ? 'This stage is already waiting for gate approval' : 'Only an active stage can be sent for gate approval');
    await tx.workStage.update({ where: { id: stageId }, data: { status: 'GATE_REVIEW' } });
    return createApprovalTx(tx, projectId, userId, {
      targetType: 'STAGE_GATE', stageId, title: `Gate: ${s.n}. ${s.name}`.slice(0, 200), description,
      mode: approvers.mode, approverIds: approvers.ids, dueAt: input.dueAt, specReviewId: spec.applies ? spec.review?.id ?? null : null,
    });
  });
  if (overrideReason !== null) {
    await auditProject(projectId, {
      actorId: userId, action: 'spec.gate.override', targetType: 'stage', targetId: stageId,
      summary: `Sent stage ${stageRow.n}. ${stageRow.name} for gate approval below the Spec Fidelity threshold — ${overrideReason.slice(0, 300)}`,
      detail: { reasons: spec.reasons, reviewId: spec.review?.id ?? null, scores: spec.review?.scores ?? null, reason: overrideReason },
    });
  }
  emitWorkEvent({ type: 'stage.updated', projectId, stageId, status: 'GATE_REVIEW', actor: { kind: 'USER', userId } });
  await afterCreate(approvalId, projectId, userId);
  return { stage: await findStage(projectId, stageId), approval: await getApproval(userId, projectId, approvalId) };
}
