/**
 * CT Work — YÊU CẦU THAY ĐỔI (CR, đợt S3b, mô-đun `changeRequests`).
 *
 * Chuẩn tham chiếu: PMBOK® 7 "Perform Integrated Change Control" (mọi thay đổi phạm vi
 * được phân tích ảnh hưởng rồi người có thẩm quyền quyết bằng văn bản), PRINCE2 "change
 * authority" (người duyệt = người đứng tên trong phê duyệt, có thể là khách).
 *
 * QUYẾT ĐỊNH THIẾT KẾ — CR là ĐỐI TƯỢNG RIÊNG (bảng work_change_requests), KHÔNG phải loại
 * thẻ `CR` hay một cờ trên thẻ:
 *   - loại thẻ là dữ liệu của từng dự án (work_issue_types) — thêm loại `CR` phải chép vào
 *     mọi dự án, đụng ISSUE_TYPE_KEYS, JQL `type = …`, board, báo cáo, xuất/nhập Jira;
 *   - vòng đời CR (Draft → Submitted → Under review → Approved/Rejected → Implemented)
 *     không phải quy trình board, và trạng thái duyệt chỉ được đặt bởi phê duyệt;
 *   - cờ trên thẻ thì CR hiện trên board/JQL/cổng khách như một thẻ thường — lộ chi phí.
 * CR nối với thẻ bằng liên kết (AFFECTED / IMPLEMENTS) + `sourceIssueId` (thẻ gốc, vd yêu
 * cầu CHANGE khách gửi qua cổng). Chi tiết thẻ có khu "Change requests" đọc ngược lại.
 *
 * Duyệt: approvals.service `createCrApproval` (targetType CR, hash = phân tích ảnh hưởng).
 * Khách chỉ thấy CR qua phê duyệt của chính họ, và chỉ khi CR đã chia sẻ (`clientVisible`).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import type { CrLinkRole, CrStatus, CrUrgency } from './constants.js';
import { getTemplate } from './docTemplates.js';
import { emitWorkEvent } from './events.js';
import { crManualTransitionAllowed, crPending, crTotals } from './governance.js';
import { dayOf, govCtx, markdownDoc, nextNumber } from './governanceDb.js';
import { createIssueAs } from './issues.service.js';
import { canDeleteGovernance, governanceAccess, loadProjectAccess, assertHumanActor } from './permissions.js';
import { tiptapToText } from './tiptapText.js';
import { trashSoft } from './trashBin.service.js'; // 22/10/2026: thùng rác dữ liệu 30 ngày
import { childCrKey, cleanCrOptions, cleanImpactMatrix, cleanSyncChecklist, impactOverall, IMPACT_DIMENSIONS, SYNC_ITEMS, SYNC_LABEL, syncDone, type ImpactMatrix } from './dm5g4Rules.js';

const DAY = 86_400_000;

const CR_LIST_SELECT = {
  id: true, number: true, title: true, status: true, urgency: true, scheduleDays: true, costAmount: true, costCurrency: true,
  clientVisible: true, submittedAt: true, decidedAt: true, implementedAt: true, createdAt: true, updatedAt: true,
  owner: { select: PUBLIC_USER }, requester: { select: PUBLIC_USER },
  approvals: { where: { status: 'PENDING' }, select: { id: true }, take: 1 },
  // dm5 G4 (C8): CR con (CR-3a/b) + mức ảnh hưởng chung.
  parentId: true, parent: { select: { number: true } }, impactMatrix: true,
} satisfies Prisma.WorkChangeRequestSelect;

function listRow(r: Prisma.WorkChangeRequestGetPayload<{ select: typeof CR_LIST_SELECT }>, now: Date, splitKey: string | null = null) {
  const { approvals, parent, impactMatrix, ...rest } = r;
  return {
    ...rest,
    key: `CR-${r.number}`,
    parentNumber: parent?.number ?? null,
    splitKey,
    impactLevel: impactOverall(impactMatrix as ImpactMatrix | null),
    pendingApprovalId: approvals[0]?.id ?? null,
    // Tuổi của CR đang chờ quyết định (từ lúc gửi) — cùng số với luật portfolio.
    waitingDays: crPending(r.status) && r.submittedAt ? Math.floor((now.getTime() - r.submittedAt.getTime()) / DAY) : null,
  };
}

export async function listChangeRequests(userId: number, projectId: number, q: { status?: CrStatus } = {}) {
  const ctx = await govCtx(userId, projectId, 'changeRequests');
  const all = await prisma.workChangeRequest.findMany({
    where: { projectId, deletedAt: null },
    orderBy: { number: 'desc' },
    take: 1000,
    select: CR_LIST_SELECT,
  });
  const now = new Date();
  // CR con: "CR-3a", "CR-3b" theo thứ tự số trong cùng CR cha.
  const kids = new Map<number, number[]>();
  for (const r of [...all].sort((a, b) => a.number - b.number)) if (r.parentId) kids.set(r.parentId, [...(kids.get(r.parentId) ?? []), r.id]);
  const split = (r: (typeof all)[number]) => (r.parentId && r.parent ? childCrKey(r.parent.number, kids.get(r.parentId)!.indexOf(r.id)) : null);
  return {
    items: all.filter((r) => !q.status || r.status === q.status).map((r) => listRow(r, now, split(r))),
    totals: crTotals(all),
    canEdit: ctx.canEdit,
    canRequestApproval: ctx.canEdit && ctx.access.modules.approvals,
    portalOn: ctx.access.modules.clientPortal,
  };
}

// ─── Tạo / sửa ───────────────────────────────────────────────────

export interface CrInput {
  title?: string;
  descriptionJson?: Prisma.InputJsonValue | null;
  reason?: string | null;
  urgency?: CrUrgency;
  impactScope?: string | null;
  scheduleDays?: number | null;
  costAmount?: number | null;
  costCurrency?: string | null;
  impactRisk?: string | null;
  alternatives?: string | null;
  ownerId?: number | null;
  requesterId?: number | null;
  sourceIssueNumber?: number | null;
  /** dm5 G4 (C8): ma trận ảnh hưởng 6 chiều + tối đa 3 phương án. */
  impactMatrix?: unknown;
  options?: unknown;
}

async function assertPerson(projectId: number, uid: number | null | undefined, what: string) {
  if (!uid) return;
  const a = await loadProjectAccess(uid, projectId);
  if (!a) throw new BadRequestError(`The ${what} must be a member of this project`, 'WORK_BAD_USER');
}

/** Khung mô tả từ mẫu phieu-yeu-cau-thay-doi.md: phần 1 (Đề nghị) + 2 (Phân loại). Mẫu thiếu ⇒ null. */
async function templateDescription(): Promise<Prisma.InputJsonValue | null> {
  try {
    const t = await getTemplate('phieu-yeu-cau-thay-doi');
    const body = t.markdown.split(/\n---\n/)[1] ?? t.markdown;
    const parts = body.split(/\n(?=## )/).filter((s) => /^## [12]\./.test(s.trim()));
    return parts.length ? markdownDoc(parts.join('\n\n')) : null;
  } catch {
    return null;
  }
}

function dataOf(input: CrInput) {
  const d: Prisma.WorkChangeRequestUncheckedUpdateInput = {};
  if (input.title !== undefined) d.title = input.title.trim().slice(0, 255);
  if (input.descriptionJson !== undefined) {
    d.descriptionJson = input.descriptionJson === null ? Prisma.DbNull : input.descriptionJson;
    d.descriptionText = input.descriptionJson ? tiptapToText(input.descriptionJson).slice(0, 100_000) || null : null;
  }
  for (const k of ['reason', 'impactScope', 'impactRisk', 'alternatives'] as const) {
    if (input[k] !== undefined) d[k] = input[k]?.trim() || null;
  }
  if (input.urgency !== undefined) d.urgency = input.urgency;
  if (input.scheduleDays !== undefined) d.scheduleDays = input.scheduleDays;
  if (input.costAmount !== undefined) d.costAmount = input.costAmount;
  if (input.costCurrency !== undefined) d.costCurrency = input.costCurrency?.trim().slice(0, 16) || null;
  if (input.ownerId !== undefined) d.ownerId = input.ownerId;
  if (input.requesterId !== undefined) d.requesterId = input.requesterId;
  if (input.impactMatrix !== undefined) { const m = cleanImpactMatrix(input.impactMatrix); d.impactMatrix = m ? (m as unknown as Prisma.InputJsonValue) : Prisma.DbNull; }
  if (input.options !== undefined) { const o = cleanCrOptions(input.options); d.options = o ? (o as unknown as Prisma.InputJsonValue) : Prisma.DbNull; }
  return d;
}

export async function createChangeRequest(userId: number, projectId: number, input: CrInput & { title: string; useTemplate?: boolean }) {
  const ctx = await govCtx(userId, projectId, 'changeRequests', { edit: true });
  const title = input.title.trim();
  if (!title) throw new BadRequestError('Title is required', 'WORK_TITLE_REQUIRED');
  await assertPerson(projectId, input.ownerId, 'owner');
  await assertPerson(projectId, input.requesterId, 'requester');
  let sourceIssueId: number | null = null;
  if (input.sourceIssueNumber) {
    const i = await prisma.workIssue.findFirst({ where: { projectId, number: input.sourceIssueNumber, deletedAt: null }, select: { id: true } });
    if (!i) throw new BadRequestError('Source issue not found in this project', 'WORK_BAD_ISSUE');
    sourceIssueId = i.id;
  }
  const descriptionJson = input.descriptionJson !== undefined ? input.descriptionJson : (input.useTemplate === false ? null : await templateDescription());
  const created = await prisma.$transaction(async (tx) => {
    const number = await nextNumber(tx, 'cr', projectId);
    return tx.workChangeRequest.create({
      data: {
        ...(dataOf({ ...input, descriptionJson }) as Prisma.WorkChangeRequestUncheckedCreateInput),
        projectId, number, title: title.slice(0, 255), createdById: userId,
        ownerId: input.ownerId ?? userId, requesterId: input.requesterId ?? null, sourceIssueId,
      },
      select: { id: true, number: true },
    });
  });
  if (sourceIssueId) await prisma.workChangeRequestLink.create({ data: { changeRequestId: created.id, issueId: sourceIssueId, role: 'AFFECTED', createdById: userId } });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'cr', number: created.number, action: 'created', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'cr.create', targetType: 'change_request', targetId: created.id, summary: `Created CR-${created.number}: ${title}`.slice(0, 300) });
  void ctx;
  return getChangeRequest(userId, projectId, created.number);
}

async function findCr(projectId: number, number: number) {
  const cr = await prisma.workChangeRequest.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, number: true, status: true, version: true, title: true, createdById: true, clientVisible: true } });
  if (!cr) throw new NotFoundError('Change request not found');
  return cr;
}

export async function getChangeRequest(userId: number, projectId: number, number: number) {
  const ctx = await govCtx(userId, projectId, 'changeRequests');
  const cr = await prisma.workChangeRequest.findFirst({
    where: { projectId, number, deletedAt: null },
    select: {
      ...CR_LIST_SELECT,
      descriptionJson: true, reason: true, impactScope: true, impactRisk: true, alternatives: true, clientSharedAt: true, version: true,
      options: true, syncChecklist: true,
      children: { where: { deletedAt: null }, orderBy: { number: 'asc' }, select: { id: true, number: true, title: true, status: true } },
      createdById: true, createdBy: { select: PUBLIC_USER },
      sourceIssue: { select: { number: true, title: true, deletedAt: true } },
      links: {
        orderBy: { id: 'asc' },
        select: {
          id: true, role: true, createdAt: true,
          issue: { select: { number: true, title: true, deletedAt: true, resolvedAt: true, status: { select: { name: true, category: true } }, type: { select: { key: true, name: true, color: true, icon: true } } } },
          stage: { select: { id: true, n: true, name: true, status: true } },
          version: { select: { id: true, name: true, status: true, releaseDate: true } },
        },
      },
      raidLinks: { select: { raid: { select: { number: true, type: true, title: true, status: true, probability: true, impact: true, deletedAt: true } } } },
    },
  });
  if (!cr) throw new NotFoundError('Change request not found');
  const now = new Date();
  const { links, raidLinks, sourceIssue, children, options, syncChecklist, ...rest } = cr;
  const key = ctx.access.key;
  // dm5 G4 (C8): khoá con "CR-3a" của chính CR này (nếu là CR con).
  let splitKey: string | null = null;
  if (rest.parentId && rest.parent) {
    const sib = await prisma.workChangeRequest.findMany({ where: { parentId: rest.parentId, deletedAt: null }, orderBy: { number: 'asc' }, select: { id: true } });
    splitKey = childCrKey(rest.parent.number, Math.max(0, sib.findIndex((x) => x.id === cr.id)));
  }
  return {
    ...listRow(rest, now, splitKey),
    impactMatrix: (rest.impactMatrix as ImpactMatrix | null) ?? null, impactDimensions: IMPACT_DIMENSIONS,
    options: (options as unknown[] | null) ?? [],
    children: children.map((c, i) => ({ number: c.number, key: `CR-${c.number}`, splitKey: childCrKey(cr.number, i), title: c.title, status: c.status })),
    syncChecklist: syncChecklist ?? null,
    syncItems: SYNC_ITEMS.map((k) => ({ key: k, label: SYNC_LABEL[k], done: (syncChecklist as Record<string, unknown> | null)?.[k] === true })),
    syncDone: syncDone(syncChecklist), syncTotal: SYNC_ITEMS.length,
    // Checklist đồng bộ chỉ có nghĩa khi CR đã được duyệt.
    syncOpen: cr.status === 'APPROVED' || cr.status === 'IMPLEMENTED',
    sourceIssue: sourceIssue && !sourceIssue.deletedAt ? { number: sourceIssue.number, title: sourceIssue.title, key: `${key}-${sourceIssue.number}` } : null,
    links: links
      .filter((l) => !l.issue || !l.issue.deletedAt)
      .map((l) => ({
        id: l.id, role: l.role as CrLinkRole, createdAt: l.createdAt,
        issue: l.issue ? { number: l.issue.number, key: `${key}-${l.issue.number}`, title: l.issue.title, done: !!l.issue.resolvedAt, status: l.issue.status, type: l.issue.type } : null,
        stage: l.stage, version: l.version ? { ...l.version, releaseDate: dayOf(l.version.releaseDate) } : null,
      })),
    risks: raidLinks.map((l) => l.raid).filter((r) => !r.deletedAt).map(({ deletedAt: _d, ...r }) => r),
    canEdit: ctx.canEdit,
    canDelete: canDeleteGovernance(ctx.access.role, ctx.access.workspaceRole, userId, cr.createdById) && ['DRAFT', 'SUBMITTED', 'REJECTED'].includes(cr.status),
    canRequestApproval: ctx.canEdit && ctx.access.modules.approvals && (cr.status === 'DRAFT' || cr.status === 'SUBMITTED'),
    portalOn: ctx.access.modules.clientPortal,
    approvalsOn: ctx.access.modules.approvals,
    // Approved ⇒ gợi ý thẻ thực hiện (ĐỀ XUẤT — chỉ tạo khi người dùng bấm áp dụng).
    suggestions: cr.status === 'APPROVED' || cr.status === 'IMPLEMENTED' ? implementationSuggestions(cr, key, links) : [],
  };
}

/** Đề xuất thẻ thực hiện — tất định (không AI): một thẻ chính + một thẻ cập nhật cho mỗi thẻ bị ảnh hưởng còn mở. */
function implementationSuggestions(
  cr: { number: number; title: string; impactScope: string | null; scheduleDays: number | null },
  key: string,
  links: Array<{ role: string; issue: { number: number; title: string; deletedAt: Date | null; resolvedAt: Date | null } | null }>,
) {
  const done = new Set(links.filter((l) => l.role === 'IMPLEMENTS' && l.issue).map((l) => l.issue!.title));
  const out: Array<{ title: string; description: string; typeKey: 'STORY' | 'TASK' }> = [];
  const main = `Implement CR-${cr.number}: ${cr.title}`.slice(0, 255);
  if (!done.has(main)) out.push({ title: main, description: cr.impactScope?.trim() || `Deliver the change approved in CR-${cr.number}.`, typeKey: 'STORY' });
  for (const l of links) {
    if (l.role !== 'AFFECTED' || !l.issue || l.issue.deletedAt) continue;
    const t = `Update ${key}-${l.issue.number} for CR-${cr.number}: ${l.issue.title}`.slice(0, 255);
    if (!done.has(t) && out.length < 10) out.push({ title: t, description: `Adjust ${key}-${l.issue.number} to the change approved in CR-${cr.number}.`, typeKey: 'TASK' });
  }
  return out;
}

export async function updateChangeRequest(userId: number, projectId: number, number: number, input: CrInput, expectedVersion?: number) {
  await govCtx(userId, projectId, 'changeRequests', { edit: true });
  const cr = await findCr(projectId, number);
  if (cr.status === 'IMPLEMENTED') throw new ConflictError('An implemented change request is read-only — raise a new change request instead');
  if (input.title !== undefined && !input.title.trim()) throw new BadRequestError('Title is required', 'WORK_TITLE_REQUIRED');
  await assertPerson(projectId, input.ownerId, 'owner');
  await assertPerson(projectId, input.requesterId, 'requester');
  const res = await prisma.workChangeRequest.updateMany({
    where: { id: cr.id, ...(expectedVersion !== undefined ? { version: expectedVersion } : {}) },
    data: { ...(dataOf(input) as Prisma.WorkChangeRequestUncheckedUpdateManyInput), version: { increment: 1 } },
  });
  if (!res.count) throw new ConflictError('Someone else changed this change request — reload to see their version');
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'cr', number, action: 'updated', actor: { kind: 'USER', userId } });
  return getChangeRequest(userId, projectId, number);
}

/** Chuyển tay: Draft ⇄ Submitted, Rejected → Draft, Approved → Implemented (governance.ts). */
export async function setChangeRequestStatus(userId: number, projectId: number, number: number, to: CrStatus) {
  await govCtx(userId, projectId, 'changeRequests', { edit: true });
  const cr = await findCr(projectId, number);
  if (!crManualTransitionAllowed(cr.status, to)) {
    throw new ConflictError(
      to === 'APPROVED' || to === 'REJECTED' || to === 'UNDER_REVIEW'
        ? 'Approval decisions are made through an approval request — send the change request for approval'
        : `A change request cannot move from ${cr.status} to ${to}`,
    );
  }
  const now = new Date();
  await prisma.workChangeRequest.update({
    where: { id: cr.id },
    data: {
      status: to, version: { increment: 1 },
      ...(to === 'SUBMITTED' ? { submittedAt: now } : {}),
      ...(to === 'DRAFT' ? { submittedAt: null, decidedAt: null } : {}),
      ...(to === 'IMPLEMENTED' ? { implementedAt: now } : {}),
    },
  });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'cr', number, action: 'status', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'cr.status', targetType: 'change_request', targetId: cr.id, summary: `CR-${number}: ${cr.status} → ${to}` });
  return getChangeRequest(userId, projectId, number);
}

/** Chia sẻ CR với khách (cổng khách bật) — điều kiện để khách đứng tên duyệt. */
export async function setChangeRequestClientVisible(userId: number, projectId: number, number: number, visible: boolean) {
  await assertHumanActor(userId, 'share change requests with clients'); // CTW-28: tầng hành động — agent bị chặn bất kể gọi từ tuyến nào
  const ctx = await govCtx(userId, projectId, 'changeRequests', { edit: true });
  if (!ctx.access.modules.clientPortal) throw new BadRequestError('Turn on the client portal to share change requests with the client', 'WORK_PORTAL_OFF');
  const cr = await findCr(projectId, number);
  await prisma.workChangeRequest.update({ where: { id: cr.id }, data: { clientVisible: visible, clientSharedAt: visible ? new Date() : null } });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'cr', number, action: 'shared', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'cr.share', targetType: 'change_request', targetId: cr.id, summary: `${visible ? 'Shared' : 'Unshared'} CR-${number} ${visible ? 'with' : 'from'} the client` });
  return getChangeRequest(userId, projectId, number);
}

export async function deleteChangeRequest(userId: number, projectId: number, number: number) {
  const ctx = await govCtx(userId, projectId, 'changeRequests');
  const cr = await findCr(projectId, number);
  if (!canDeleteGovernance(ctx.access.role, ctx.access.workspaceRole, userId, cr.createdById)) throw new ForbiddenError('Only the author or a project admin can delete this change request');
  if (!['DRAFT', 'SUBMITTED', 'REJECTED'].includes(cr.status)) throw new ConflictError('Change requests under review, approved or implemented are kept for the record');
  await prisma.workChangeRequest.update({ where: { id: cr.id }, data: { deletedAt: new Date() } });
  const trashId = await trashSoft({ projectId, userId, table: 'work_change_requests', id: cr.id, label: `Change request CR-${number}: ${cr.title}` });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'cr', number, action: 'deleted', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'cr.delete', targetType: 'change_request', targetId: cr.id, summary: `Deleted CR-${number}: ${cr.title}`.slice(0, 300) });
  return { deleted: true, trashId };
}

// ─── Liên kết ────────────────────────────────────────────────────

export async function addChangeRequestLink(
  userId: number, projectId: number, number: number,
  input: { role?: CrLinkRole; issueNumber?: number; stageId?: number; versionId?: number },
) {
  await govCtx(userId, projectId, 'changeRequests', { edit: true });
  const cr = await findCr(projectId, number);
  const given = [input.issueNumber, input.stageId, input.versionId].filter((x) => x !== undefined && x !== null).length;
  if (given !== 1) throw new BadRequestError('Link exactly one issue, stage or version', 'VALIDATION_ERROR');
  const role = input.role ?? 'AFFECTED';
  const data: Prisma.WorkChangeRequestLinkUncheckedCreateInput = { changeRequestId: cr.id, role, createdById: userId };
  if (input.issueNumber) {
    const i = await prisma.workIssue.findFirst({ where: { projectId, number: input.issueNumber, deletedAt: null }, select: { id: true } });
    if (!i) throw new BadRequestError('Issue not found in this project', 'WORK_BAD_ISSUE');
    data.issueId = i.id;
  } else if (input.stageId) {
    if (role !== 'AFFECTED') throw new BadRequestError('Only issues can implement a change request', 'VALIDATION_ERROR');
    const st = await prisma.workStage.findFirst({ where: { id: input.stageId, projectId }, select: { id: true } });
    if (!st) throw new BadRequestError('Stage not found in this project', 'WORK_BAD_STAGE');
    data.stageId = st.id;
  } else if (input.versionId) {
    if (role !== 'AFFECTED') throw new BadRequestError('Only issues can implement a change request', 'VALIDATION_ERROR');
    const v = await prisma.workVersion.findFirst({ where: { id: input.versionId, projectId }, select: { id: true } });
    if (!v) throw new BadRequestError('Version not found in this project', 'WORK_BAD_VERSION');
    data.versionId = v.id;
  }
  const dup = await prisma.workChangeRequestLink.findFirst({
    where: { changeRequestId: cr.id, role, issueId: data.issueId ?? null, stageId: data.stageId ?? null, versionId: data.versionId ?? null },
    select: { id: true },
  });
  if (dup) throw new ConflictError('Already linked');
  await prisma.workChangeRequestLink.create({ data });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'cr', number, action: 'links', actor: { kind: 'USER', userId } });
  return getChangeRequest(userId, projectId, number);
}

export async function removeChangeRequestLink(userId: number, projectId: number, number: number, linkId: number) {
  await govCtx(userId, projectId, 'changeRequests', { edit: true });
  const cr = await findCr(projectId, number);
  const r = await prisma.workChangeRequestLink.deleteMany({ where: { id: linkId, changeRequestId: cr.id } });
  if (!r.count) throw new NotFoundError('Link not found');
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'cr', number, action: 'links', actor: { kind: 'USER', userId } });
  return getChangeRequest(userId, projectId, number);
}

// ─── Áp dụng đề xuất: tạo thẻ thực hiện ──────────────────────────

/**
 * Tạo thẻ thực hiện cho CR đã DUYỆT (người dùng đã xem + sửa đề xuất rồi bấm "Create issues").
 * Mỗi thẻ được nối IMPLEMENTS. Loại thẻ theo `typeKey` (thiếu trong dự án ⇒ loại tầng 0 đầu tiên).
 */
export async function createImplementationIssues(
  userId: number, projectId: number, number: number,
  items: Array<{ title: string; description?: string | null; typeKey?: string; assigneeId?: number | null; dueDate?: Date | null }>,
) {
  const ctx = await govCtx(userId, projectId, 'changeRequests', { edit: true });
  const cr = await findCr(projectId, number);
  if (cr.status !== 'APPROVED' && cr.status !== 'IMPLEMENTED') throw new ConflictError('Only an approved change request can be turned into implementation issues');
  if (!items.length) throw new BadRequestError('Pick at least one issue to create', 'VALIDATION_ERROR');
  const types = await prisma.workIssueType.findMany({ where: { projectId, archived: false, level: 0 }, orderBy: { id: 'asc' }, select: { id: true, key: true } });
  if (!types.length) throw new BadRequestError('This project has no issue type for implementation work', 'WORK_BAD_TYPE');
  const created: Array<{ number: number; key: string; title: string }> = [];
  for (const it of items) {
    const type = types.find((t) => t.key === it.typeKey) ?? types.find((t) => t.key === 'TASK') ?? types[0];
    const description = it.description?.trim();
    const issue = await createIssueAs(userId, projectId, {
      typeId: type.id, title: it.title.trim().slice(0, 255),
      descriptionJson: description ? ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: description }] }] } as Prisma.InputJsonValue) : undefined,
      assigneeId: it.assigneeId ?? undefined, dueDate: it.dueDate ?? undefined,
    });
    await prisma.workChangeRequestLink.create({ data: { changeRequestId: cr.id, issueId: issue.id, role: 'IMPLEMENTS', createdById: userId } });
    created.push({ number: issue.number, key: `${ctx.access.key}-${issue.number}`, title: issue.title });
  }
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'cr', number, action: 'links', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'cr.implement', targetType: 'change_request', targetId: cr.id, summary: `Created ${created.length} implementation issue${created.length === 1 ? '' : 's'} for CR-${number}: ${created.map((c) => c.key).join(', ')}`.slice(0, 300) });
  return { created, changeRequest: await getChangeRequest(userId, projectId, number) };
}

// ─── Đọc từ phía thẻ + cổng khách ────────────────────────────────

/**
 * Khu "Change requests" + "Risks" trong chi tiết thẻ. Không ném MODULE_DISABLED — mô-đun nào
 * tắt / người xem không đọc được thì phần đó rỗng (thẻ vẫn mở được như cũ).
 */
export async function issueGovernance(userId: number, projectId: number, issueNumber: number) {
  const access = await loadProjectAccess(userId, projectId);
  if (!access) throw new NotFoundError('Project not found');
  const view = governanceAccess(access.role, access.workspaceRole).view;
  const crOn = view && access.modules.changeRequests;
  const raidOn = view && access.modules.raid;
  if (!crOn && !raidOn) return { changeRequests: null, risks: null };
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number: issueNumber, deletedAt: null }, select: { id: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  const [crs, raids] = await Promise.all([
    crOn
      ? prisma.workChangeRequestLink.findMany({
        where: { issueId: issue.id, changeRequest: { deletedAt: null } },
        select: { role: true, changeRequest: { select: { number: true, title: true, status: true, scheduleDays: true } } },
      })
      : Promise.resolve(null),
    raidOn
      ? prisma.workRaidLink.findMany({
        where: { issueId: issue.id, raid: { deletedAt: null } },
        select: { raid: { select: { number: true, type: true, title: true, status: true, probability: true, impact: true } } },
      })
      : Promise.resolve(null),
  ]);
  const crRows = crs ? [...new Map(crs.map((l) => [`${l.changeRequest.number}:${l.role}`, { ...l.changeRequest, role: l.role }])).values()] : null;
  return {
    changeRequests: crRows?.sort((a, b) => b.number - a.number) ?? null,
    risks: raids?.map((l) => ({ ...l.raid, score: l.raid.probability && l.raid.impact ? l.raid.probability * l.raid.impact : null })).sort((a, b) => (b.score ?? 0) - (a.score ?? 0)) ?? null,
  };
}

/**
 * Phần CR KHÁCH được đọc trong phê duyệt của họ (portal.service): chỉ khi CR đã chia sẻ.
 * Không có người phụ trách nội bộ, không có liên kết thẻ nội bộ — chỉ phân tích ảnh hưởng.
 */
export async function crForClient(crId: number) {
  const c = await prisma.workChangeRequest.findFirst({
    where: { id: crId, deletedAt: null, clientVisible: true },
    select: {
      number: true, title: true, status: true, descriptionJson: true, reason: true, urgency: true, impactScope: true,
      scheduleDays: true, costAmount: true, costCurrency: true, impactRisk: true, alternatives: true,
    },
  });
  return c ? { ...c, key: `CR-${c.number}` } : null;
}

// ─── dm5 G4 (C8): tách CR con + checklist đồng bộ khi Approve ──────

/** Tách một CR thành 2–5 CR con (CR-3a, CR-3b…): mỗi con là CR DRAFT riêng (duyệt riêng), giữ người yêu cầu / chủ / mức khẩn. */
export async function splitChangeRequest(userId: number, projectId: number, number: number, parts: Array<{ title: string; impactScope?: string | null; scheduleDays?: number | null }>) {
  await govCtx(userId, projectId, 'changeRequests', { edit: true });
  const cr = await prisma.workChangeRequest.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, number: true, title: true, status: true, parentId: true, urgency: true, ownerId: true, requesterId: true, sourceIssueId: true } });
  if (!cr) throw new NotFoundError('Change request not found');
  if (cr.parentId) throw new BadRequestError('This is already a sub-request — split the parent change request instead', 'WORK_CR_SPLIT_NESTED');
  if (cr.status === 'IMPLEMENTED' || cr.status === 'REJECTED') throw new ConflictError('Implemented or rejected change requests cannot be split');
  const clean = parts.map((p) => ({ ...p, title: p.title.trim().slice(0, 255) })).filter((p) => p.title);
  if (clean.length < 1 || clean.length > 5) throw new BadRequestError('Split into 1–5 parts', 'VALIDATION_ERROR');
  const existing = await prisma.workChangeRequest.count({ where: { parentId: cr.id, deletedAt: null } });
  if (existing + clean.length > 26) throw new BadRequestError('Too many sub-requests', 'WORK_LIMIT');
  const created: number[] = [];
  await prisma.$transaction(async (tx) => {
    for (const p of clean) {
      const n = await nextNumber(tx, 'cr', projectId);
      await tx.workChangeRequest.create({
        data: {
          projectId, number: n, title: p.title, parentId: cr.id, urgency: cr.urgency, ownerId: cr.ownerId ?? userId, requesterId: cr.requesterId, sourceIssueId: cr.sourceIssueId,
          impactScope: p.impactScope?.trim() || null, scheduleDays: p.scheduleDays ?? null, reason: `Split from CR-${cr.number}: ${cr.title}`.slice(0, 10_000), createdById: userId,
        },
      });
      created.push(n);
    }
  });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'cr', number, action: 'updated', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'cr.split', targetType: 'change_request', targetId: cr.id, summary: `Split CR-${number} into ${created.map((n, i) => `CR-${n} (${childCrKey(number, existing + i)})`).join(', ')}`.slice(0, 300) });
  return { created: created.map((n, i) => ({ number: n, key: `CR-${n}`, splitKey: childCrKey(number, existing + i) })), changeRequest: await getChangeRequest(userId, projectId, number) };
}

/** Checklist đồng bộ 5 điểm sau khi CR được duyệt: SRS RoC · Tracking Q&A · Tracking Issues · Tracking WBS · RTM. */
export async function setChangeRequestSync(userId: number, projectId: number, number: number, input: Record<string, unknown>) {
  await govCtx(userId, projectId, 'changeRequests', { edit: true });
  const cr = await prisma.workChangeRequest.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, status: true, syncChecklist: true } });
  if (!cr) throw new NotFoundError('Change request not found');
  if (cr.status !== 'APPROVED' && cr.status !== 'IMPLEMENTED') throw new ConflictError('The sync checklist opens once the change request is approved');
  const next = cleanSyncChecklist(input, cr.syncChecklist, userId);
  await prisma.workChangeRequest.update({ where: { id: cr.id }, data: { syncChecklist: next as unknown as Prisma.InputJsonValue } });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'cr', number, action: 'updated', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'cr.sync', targetType: 'change_request', targetId: cr.id, summary: `CR-${number}: sync checklist ${syncDone(next)}/${SYNC_ITEMS.length}` });
  return getChangeRequest(userId, projectId, number);
}
