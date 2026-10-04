/**
 * CT Work — CỔNG KHÁCH (đợt S2b, 04/10/2026, mô-đun `clientPortal`).
 *
 * Mọi tuyến /projects/:pid/portal/** đi qua đây. Hai kiểu người xem:
 *   - KHÁCH bị cách ly (vai CLIENT + clientPortal): luôn xem "như khách".
 *   - NHÂN VIÊN: mặc định xem chế độ quản lý (mời khách, tạo UAT, danh sách khách);
 *     `?as=client` = "Preview as client" — trả ĐÚNG dữ liệu khách thấy, CHỈ ĐỌC
 *     (mọi lệnh ghi trong chế độ xem trước ⇒ 403), không đăng nhập hộ ai.
 *
 * Dữ liệu "như khách" (một luật duy nhất, dùng chung cho cả hai kiểu):
 *   thẻ clientVisible · bình luận PUBLIC · tệp clientVisible trên thẻ đã chia sẻ ·
 *   trang tài liệu visibility CLIENT · phê duyệt có một KHÁCH của dự án đứng tên ·
 *   giai đoạn (tên + trạng thái + %) · version có hạng mục đã chia sẻ.
 *
 * Nghiệm thu UAT: một WorkApproval targetType UAT + một WorkUatRequest. Khách
 * Approve (có thể kèm điều kiện) / Reject (bắt buộc lý do) — từ chối thì mỗi điểm
 * khách nêu thành một thẻ BUG/CR (clientVisible, nhãn from-client). Chữ ký =
 * contentHash của cả bộ hạng mục + tài liệu + tệp (approvalContent.ts uatContent).
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, PUBLIC_USER } from './common.js';
import { FROM_CLIENT_LABEL, type ApprovalMode, type PortalRequestKind } from './constants.js';
import { currentTargetHash, signedHash } from './approvalContent.js';
import { afterCreate, approvalForClient, approvalTargetSharedWithClient, createApprovalTx, decideApproval } from './approvals.service.js';
import { clientPeopleIds, maskUser, TEAM_NAME, type PeopleFilter } from './clientPeople.js';
import { emitWorkEvent } from './events.js';
import { createIssue } from './issueChange.js';
import { notifyWork } from './notify.js';
import { actionableSteps, can, canViewPage, isClientScoped, loadProjectAccess, requireProject, type ProjectAccess } from './permissions.js';
import { clientMemberIds, notifyClientsOfProject, portalPath } from './portalNotify.js';
import { assertModule } from './studio.js';

// ─── Ngữ cảnh người xem ──────────────────────────────────────────

export interface PortalCtx {
  access: ProjectAccess;
  userId: number;
  /** Xem như khách (khách thật HOẶC nhân viên bấm Preview as client). */
  clientView: boolean;
  /** Nhân viên đang xem trước — chỉ đọc. */
  preview: boolean;
  /** Khách của dự án (để biết phê duyệt nào là của khách). */
  clientIds: number[];
  /** Người được hiện tên khi xem như khách (clientPeople.ts); null = nhân viên (không lọc). */
  people: PeopleFilter;
}

export async function portalCtx(userId: number, projectId: number, opts: { asClient?: boolean } = {}): Promise<PortalCtx> {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'clientPortal');
  const scoped = isClientScoped(access);
  const preview = !scoped && opts.asClient === true;
  const clientView = scoped || preview;
  // Xem trước: không thêm chính nhân viên vào tập — thấy ĐÚNG như khách thấy.
  const people = clientView ? await clientPeopleIds(projectId, scoped ? userId : null) : null;
  return { access, userId, clientView, preview, clientIds: await clientMemberIds(projectId), people };
}

function assertNotPreview(ctx: PortalCtx) {
  if (ctx.preview) throw new ForbiddenError('Preview as client is read-only');
}

function assertStaff(ctx: PortalCtx) {
  if (ctx.clientView) throw new ForbiddenError('Only the project team can do this');
}

/** Phê duyệt "của khách": có ít nhất một khách của dự án đứng tên duyệt. */
function clientApprovalWhere(ctx: PortalCtx): Prisma.WorkApprovalWhereInput {
  return { projectId: ctx.access.projectId, steps: { some: { approverId: { in: ctx.clientIds.length ? ctx.clientIds : [-1] } } } };
}

const textDoc = (text: string) => ({
  type: 'doc',
  content: text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) => ({ type: 'paragraph', content: [{ type: 'text', text: p }] })),
});

const userName = (u: { username: string; displayName: string | null; fullName: string | null } | null) => (u ? displayName(u) : 'Someone');

// ─── Overview ────────────────────────────────────────────────────

export async function overview(userId: number, projectId: number, opts: { asClient?: boolean } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  const pid = projectId;
  const [project, stages, stageIssues, versions, pending, sharedOpen, sharedDone, fromClientOpen] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { key: true, name: true, description: true, workspace: { select: { name: true, slug: true } }, clientRequest: { select: { organization: true, code: true } } } }),
    ctx.access.modules.stages
      ? prisma.workStage.findMany({ where: { projectId: pid }, orderBy: { n: 'asc' }, select: { id: true, n: true, slug: true, name: true, status: true, startedAt: true, completedAt: true } })
      : Promise.resolve([]),
    // % theo giai đoạn: đếm TỔNG số (không lộ thẻ nào) — chỉ ra con số phần trăm.
    prisma.workIssue.groupBy({ by: ['stageId'], where: { projectId: pid, deletedAt: null, stageId: { not: null } }, _count: { _all: true } }),
    prisma.workVersion.findMany({
      where: { projectId: pid, status: { not: 'ARCHIVED' }, OR: [{ issues: { some: { clientVisible: true, deletedAt: null } } }, { uatRequests: { some: {} } }] },
      orderBy: [{ releaseDate: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }],
      select: { id: true, name: true, status: true, releaseDate: true, releasedAt: true, issues: { where: { clientVisible: true, deletedAt: null }, select: { resolvedAt: true } } },
    }),
    prisma.workApproval.findMany({
      where: { ...clientApprovalWhere(ctx), status: 'PENDING' },
      orderBy: [{ dueAt: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }],
      select: {
        id: true, title: true, description: true, targetType: true, issueId: true, pageId: true, dueAt: true, mode: true, createdAt: true,
        issue: { select: { number: true, title: true, clientVisible: true } }, page: { select: { number: true, title: true, visibility: true } }, stage: { select: { n: true, name: true } },
        changeRequestId: true, changeRequest: { select: { number: true, title: true, clientVisible: true } },
        steps: { select: { id: true, approverId: true, position: true, decision: true } },
      },
    }),
    prisma.workIssue.count({ where: { projectId: pid, deletedAt: null, clientVisible: true, resolvedAt: null, type: { level: { not: 1 } } } }),
    prisma.workIssue.count({ where: { projectId: pid, deletedAt: null, clientVisible: true, resolvedAt: { not: null }, type: { level: { not: 1 } } } }),
    prisma.workIssue.count({ where: { projectId: pid, deletedAt: null, clientVisible: true, resolvedAt: null, labels: { some: { label: { name: FROM_CLIENT_LABEL } } } } }),
  ]);
  const doneByStage = new Map(
    (await prisma.workIssue.groupBy({ by: ['stageId'], where: { projectId: pid, deletedAt: null, stageId: { not: null }, resolvedAt: { not: null } }, _count: { _all: true } }))
      .map((r) => [r.stageId, r._count._all]),
  );
  const totalByStage = new Map(stageIssues.map((r) => [r.stageId, r._count._all]));
  const clientSet = new Set(ctx.clientIds);
  const waiting = pending
    .filter((a) => actionableSteps(a.mode, a.steps).some((s) => (ctx.preview ? clientSet.has(s.approverId) : s.approverId === userId || (!ctx.clientView && clientSet.has(s.approverId)))))
    .map((a) => ({ id: a.id, title: (ctx.clientView ? approvalForClient(a) : a).title, kind: a.targetType === 'UAT' ? 'UAT' : 'APPROVAL', dueAt: a.dueAt, createdAt: a.createdAt }));
  const stageRows = stages.map((s) => {
    const total = totalByStage.get(s.id) ?? 0;
    const done = doneByStage.get(s.id) ?? 0;
    const percent = s.status === 'DONE' ? 100 : total ? Math.round((done / total) * 100) : 0;
    return { id: s.id, n: s.n, name: s.name, status: s.status, percent, startedAt: s.startedAt, completedAt: s.completedAt };
  });
  const current = stageRows.find((s) => s.status === 'ACTIVE' || s.status === 'GATE_REVIEW') ?? null;
  const overall = stageRows.length ? Math.round(stageRows.reduce((a, s) => a + s.percent, 0) / stageRows.length) : null;
  return {
    project: { key: project.key, name: project.name, description: ctx.clientView ? null : project.description, workspaceName: project.workspace.name, organization: project.clientRequest?.organization ?? null },
    viewer: viewerInfo(ctx),
    stages: stageRows,
    currentStage: current,
    overallPercent: overall,
    milestones: versions.map((v) => ({
      id: v.id, name: v.name, status: v.status, releaseDate: v.releaseDate, releasedAt: v.releasedAt,
      items: v.issues.length, done: v.issues.filter((i) => i.resolvedAt).length,
    })),
    waitingOnClient: waiting,
    counts: { sharedOpen, sharedDone, requestsOpen: fromClientOpen },
  };
}

function viewerInfo(ctx: PortalCtx) {
  return {
    clientView: ctx.clientView,
    preview: ctx.preview,
    isClient: isClientScoped(ctx.access),
    canManage: !ctx.clientView && can(ctx.access.role, 'issue.edit'),
    canInvite: !ctx.clientView && ctx.access.role === 'ADMIN',
    canRequestUat: !ctx.clientView && can(ctx.access.role, 'approval.create') && ctx.access.modules.approvals,
    canSubmitRequest: !ctx.preview && can(ctx.access.role, 'issue.create'),
  };
}

// ─── Requests (thẻ đã chia sẻ + yêu cầu khách gửi) ───────────────

export async function listRequests(userId: number, projectId: number, opts: { asClient?: boolean; filter?: 'all' | 'open' | 'done' | 'mine' } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  const where: Prisma.WorkIssueWhereInput = {
    projectId, deletedAt: null, clientVisible: true, type: { level: { not: 1 } },
    ...(opts.filter === 'open' ? { resolvedAt: null } : opts.filter === 'done' ? { resolvedAt: { not: null } } : {}),
    ...(opts.filter === 'mine' ? { reporterId: userId } : {}),
  };
  const rows = await prisma.workIssue.findMany({
    where,
    orderBy: [{ resolvedAt: { sort: 'asc', nulls: 'first' } }, { updatedAt: 'desc' }],
    take: 300,
    select: {
      id: true, number: true, title: true, priority: true, createdAt: true, updatedAt: true, resolvedAt: true, clientSharedAt: true, reporterId: true,
      type: { select: { key: true, name: true, icon: true, color: true } },
      status: { select: { name: true, category: true, color: true } },
      stage: { select: { n: true, name: true } },
      labels: { select: { label: { select: { name: true } } } },
      _count: { select: { comments: { where: { deletedAt: null, visibility: 'PUBLIC' } }, attachments: { where: { clientVisible: true } } } },
    },
  });
  return {
    viewer: viewerInfo(ctx),
    items: rows.map((r) => ({
      number: r.number, key: `${ctx.access.key}-${r.number}`, title: r.title, priority: r.priority, type: r.type, status: r.status,
      stage: r.stage ? `${r.stage.n}. ${r.stage.name}` : null,
      fromClient: r.labels.some((l) => l.label.name === FROM_CLIENT_LABEL),
      mine: r.reporterId === userId,
      replies: r._count.comments, files: r._count.attachments,
      createdAt: r.createdAt, updatedAt: r.updatedAt, resolvedAt: r.resolvedAt, sharedAt: r.clientSharedAt,
    })),
  };
}

/** Chi tiết một thẻ "như khách thấy" (khách thật hoặc xem trước). */
export async function getRequest(userId: number, projectId: number, number: number, opts: { asClient?: boolean } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  const i = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null, clientVisible: true },
    select: {
      id: true, number: true, title: true, descriptionJson: true, priority: true, createdAt: true, updatedAt: true, resolvedAt: true, clientSharedAt: true, dueDate: true,
      type: { select: { key: true, name: true, icon: true, color: true } },
      status: { select: { name: true, category: true, color: true } },
      stage: { select: { n: true, name: true, status: true } },
      // Epic chứa thẻ: chỉ TÊN (khách không mở được epic chưa chia sẻ).
      parent: { select: { number: true, title: true, clientVisible: true } },
      fixVersion: { select: { name: true, releaseDate: true, status: true } },
      reporter: { select: PUBLIC_USER },
      labels: { select: { label: { select: { name: true } } } },
      attachments: { where: { clientVisible: true }, orderBy: { createdAt: 'asc' }, select: { id: true, fileName: true, mime: true, size: true, createdAt: true, deliverable: true, uploader: { select: PUBLIC_USER } } },
      comments: { where: { deletedAt: null, visibility: 'PUBLIC' }, orderBy: { createdAt: 'asc' }, take: 500, select: { id: true, bodyJson: true, createdAt: true, editedAt: true, isAi: true, author: { select: PUBLIC_USER } } },
    },
  });
  if (!i) throw new NotFoundError('Issue not found');
  const { labels, parent, ...rest } = i;
  return {
    ...rest,
    reporter: maskUser(rest.reporter, ctx.people),
    attachments: rest.attachments.map((a) => ({ ...a, uploader: maskUser(a.uploader, ctx.people) })),
    comments: rest.comments.map((c) => ({ ...c, author: maskUser(c.author, ctx.people) })),
    key: `${ctx.access.key}-${i.number}`,
    fromClient: labels.some((l) => l.label.name === FROM_CLIENT_LABEL),
    parent: parent ? { title: parent.title, number: parent.clientVisible ? parent.number : null } : null,
    viewer: viewerInfo(ctx),
    clientIds: ctx.clientIds,
  };
}

/** Bộ phận nhận yêu cầu khách theo loại (mã bộ phận của mẫu dự án khách); không có ⇒ PM ⇒ để trống. */
const REQUEST_ROUTING: Record<PortalRequestKind, { typeKeys: string[]; teams: string[]; label: string }> = {
  BUG: { typeKeys: ['BUG', 'TASK'], teams: ['QA', 'DEV', 'PM'], label: 'Bug report' },
  CHANGE: { typeKeys: ['STORY', 'TASK'], teams: ['BA', 'PM'], label: 'Change request' },
  QUESTION: { typeKeys: ['TASK', 'STORY'], teams: ['PM', 'SUPPORT'], label: 'Question' },
  FEEDBACK: { typeKeys: ['TASK', 'STORY'], teams: ['PM', 'SUPPORT'], label: 'Feedback' },
};

async function fromClientLabel(projectId: number): Promise<number> {
  const l = await prisma.workLabel.upsert({
    where: { uk_work_label: { projectId, name: FROM_CLIENT_LABEL } },
    create: { projectId, name: FROM_CLIENT_LABEL, color: '#0891b2' },
    update: {},
    select: { id: true },
  });
  return l.id;
}

/**
 * Tạo thẻ từ yêu cầu của khách (cũng dùng khi UAT bị từ chối). Thẻ luôn
 * clientVisible + nhãn from-client, vào hàng đợi bộ phận phù hợp (mô-đun teams
 * bật), để trống người làm. Không kiểm quyền — người gọi đã kiểm.
 */
export async function createClientIssue(
  projectId: number, actorId: number,
  input: { kind: PortalRequestKind; title: string; description?: string | null; priority?: number; extraText?: string | null },
) {
  const route = REQUEST_ROUTING[input.kind];
  const [types, access] = await Promise.all([
    prisma.workIssueType.findMany({ where: { projectId, archived: false, level: 0 }, select: { id: true, key: true } }),
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { workspaceId: true, settings: true } }),
  ]);
  const type = route.typeKeys.map((k) => types.find((t) => t.key === k)).find(Boolean) ?? types[0];
  if (!type) throw new BadRequestError('This project has no issue type for requests', 'WORK_BAD_TYPE');
  let teamId: number | null = null;
  const { modulesOf } = await import('./studio.js');
  if (modulesOf(access.settings).teams) {
    const teams = await prisma.workTeam.findMany({ where: { workspaceId: access.workspaceId, archivedAt: null, key: { in: route.teams } }, select: { id: true, key: true } });
    teamId = route.teams.map((k) => teams.find((t) => t.key === k)?.id).find((x) => x !== undefined) ?? null;
  }
  const body = [input.description?.trim(), input.extraText?.trim()].filter(Boolean).join('\n\n');
  const issue = await createIssue({
    projectId, typeId: type.id, title: input.title.trim().slice(0, 255), priority: input.priority ?? 3,
    descriptionJson: body ? (textDoc(body) as Prisma.InputJsonValue) : undefined,
    teamId, reporterId: actorId,
  }, { kind: 'USER', userId: actorId });
  const labelId = await fromClientLabel(projectId);
  await prisma.$transaction([
    prisma.workIssue.update({ where: { id: issue.id }, data: { clientVisible: true, clientSharedAt: new Date() } }),
    prisma.workIssueLabel.createMany({ data: [{ issueId: issue.id, labelId }], skipDuplicates: true }),
    prisma.workHistory.create({ data: { issueId: issue.id, actorId, actorKind: 'USER', field: 'clientVisible', fromValue: 'false', toValue: 'true' } }),
  ]);
  return { id: issue.id, number: issue.number, teamId, kind: route.label };
}

/** Báo cho đội: trưởng bộ phận nhận (nếu có), không thì ADMIN dự án. */
async function notifyTeamOfRequest(projectId: number, senderId: number, created: { id: number; number: number; teamId: number | null }, title: string, message: string) {
  try {
    const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, workspace: { select: { slug: true } } } });
    let to: number[] = [];
    if (created.teamId) {
      to = (await prisma.workTeamMember.findMany({ where: { teamId: created.teamId, role: 'LEAD' }, select: { userId: true } })).map((m) => m.userId);
    }
    if (!to.length) {
      const { projectMembers } = await import('./projects.service.js');
      to = (await projectMembers(projectId)).filter((m) => m.role === 'ADMIN').map((m) => m.id);
    }
    for (const uid of new Set(to)) {
      if (uid === senderId) continue;
      await notifyWork({
        receiverId: uid, senderId, type: 'WORK_ALERT', entityId: created.id,
        payload: { issueKey: `${p.key}-${created.number}`, title, message, url: `/work/${p.workspace.slug}/${p.key}/issue/${created.number}` },
      });
    }
  } catch (err) {
    logger.warn('[work] báo đội về yêu cầu khách lỗi', { projectId, err: (err as Error).message });
  }
}

export async function submitRequest(
  userId: number, projectId: number,
  input: { kind: PortalRequestKind; title: string; description?: string | null; priority?: number },
) {
  const ctx = await portalCtx(userId, projectId);
  if (!can(ctx.access.role, 'issue.create')) throw new ForbiddenError('You cannot submit requests in this project');
  const title = input.title.trim();
  if (!title) throw new BadRequestError('Give your request a short title', 'WORK_TITLE_REQUIRED');
  const created = await createClientIssue(projectId, userId, { ...input, title });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: created.id, actor: { kind: 'USER', userId }, changes: [{ field: 'clientVisible', from: 'false', to: 'true' }] });
  await auditProject(projectId, { actorId: userId, action: 'portal.request', targetType: 'issue', targetId: created.id, summary: `Client request ${ctx.access.key}-${created.number} (${created.kind}): ${title.slice(0, 120)}` });
  await notifyTeamOfRequest(projectId, userId, created, title, `New ${created.kind.toLowerCase()} from the client portal`);
  return { number: created.number, key: `${ctx.access.key}-${created.number}` };
}

// ─── Approvals (khách duyệt bước của chính mình) ─────────────────

const PORTAL_APPROVAL_SELECT = {
  id: true, targetType: true, issueId: true, stageId: true, pageId: true, title: true, description: true, mode: true, status: true, dueAt: true, decidedAt: true, createdAt: true, contentHash: true,
  createdBy: { select: PUBLIC_USER },
  issue: { select: { number: true, title: true, clientVisible: true } },
  stage: { select: { n: true, name: true, status: true } },
  page: { select: { number: true, title: true, visibility: true } },
  // CR (đợt S3b): khách chỉ thấy CR đã chia sẻ (approvalForClient che phần còn lại).
  changeRequestId: true,
  changeRequest: { select: { id: true, number: true, title: true, clientVisible: true } },
  steps: { orderBy: [{ position: 'asc' as const }, { id: 'asc' as const }], select: { id: true, approverId: true, position: true, decision: true, comment: true, decidedAt: true, contentHash: true, approver: { select: PUBLIC_USER } } },
  uat: { select: { id: true, round: true, environment: true, build: true, conditions: true, itemIssueIds: true, pageNumbers: true, attachmentIds: true, createdIssueIds: true, version: { select: { id: true, name: true, releaseDate: true } }, stage: { select: { id: true, n: true, name: true } } } },
} satisfies Prisma.WorkApprovalSelect;

type PortalApprovalRow = Prisma.WorkApprovalGetPayload<{ select: typeof PORTAL_APPROVAL_SELECT }>;

async function presentApproval(ctx: PortalCtx, row: PortalApprovalRow, detail = false) {
  // Như khách: đối tượng đã bỏ chia sẻ ⇒ "Item no longer shared"; cổng giai đoạn ⇒ chỉ tên giai đoạn.
  const a = ctx.clientView ? approvalForClient(row) : row;
  const shared = !ctx.clientView || approvalTargetSharedWithClient(row);
  const clientSet = new Set(ctx.clientIds);
  const actionable = actionableSteps(a.mode, a.steps);
  const now = await currentTargetHash(prisma, a);
  const signed = signedHash(a);
  const anyDecided = a.steps.some((s) => s.decidedAt);
  const myStep = a.steps.find((s) => s.approverId === ctx.userId) ?? null;
  const out = {
    id: a.id, targetType: a.targetType, title: a.title, description: a.description, mode: a.mode, status: a.status,
    dueAt: a.dueAt, decidedAt: a.decidedAt, createdAt: a.createdAt, createdBy: maskUser(a.createdBy, ctx.people),
    issue: a.issue ? { number: a.issue.number, title: a.issue.title, key: `${ctx.access.key}-${a.issue.number}`, shared: a.issue.clientVisible } : null,
    stage: a.stage ? { n: a.stage.n, name: a.stage.name, status: a.stage.status } : null,
    page: a.page && (!ctx.clientView || a.page.visibility === 'CLIENT') ? { number: a.page.number, title: a.page.title } : null,
    steps: a.steps.map((s) => ({
      id: s.id, position: s.position, decision: s.decision, decidedAt: s.decidedAt, approver: maskUser(s.approver, ctx.people), isClient: clientSet.has(s.approverId),
      // Ghi chú của người duyệt nội bộ không hiện cho khách.
      comment: !ctx.clientView || clientSet.has(s.approverId) ? s.comment : null,
      signature: s.decidedAt ? s.contentHash : null,
    })),
    waitingOnClient: a.status === 'PENDING' && actionable.some((s) => clientSet.has(s.approverId)),
    canDecide: shared && !ctx.preview && a.status === 'PENDING' && !!myStep && actionable.some((s) => s.id === myStep.id),
    contentChanged: anyDecided && now !== null && signed !== null && now !== signed,
    signedHash: signed,
    uat: null as null | Awaited<ReturnType<typeof uatDetail>>,
    /** Phân tích ảnh hưởng của CR — chỉ khi CR đã chia sẻ (crForClient tự lọc clientVisible). */
    changeRequest: null as null | Awaited<ReturnType<typeof import('./changeRequests.service.js')['crForClient']>>,
  };
  if (a.uat) out.uat = await uatDetail(ctx, a.uat, detail);
  if (a.targetType === 'CR' && a.changeRequestId && shared) {
    const { crForClient } = await import('./changeRequests.service.js');
    out.changeRequest = await crForClient(a.changeRequestId);
  }
  return out;
}

async function uatDetail(ctx: PortalCtx, u: NonNullable<PortalApprovalRow['uat']>, detail: boolean) {
  const ids = (u.itemIssueIds as number[]) ?? [];
  const items = await prisma.workIssue.findMany({
    where: { id: { in: ids }, deletedAt: null, ...(ctx.clientView ? { clientVisible: true } : {}) },
    orderBy: { number: 'asc' },
    select: { number: true, title: true, resolvedAt: true, status: { select: { name: true, category: true } }, type: { select: { key: true, name: true } } },
  });
  const created = ((u.createdIssueIds as number[]) ?? []);
  const [pages, files, createdIssues] = detail
    ? await Promise.all([
      prisma.workPage.findMany({ where: { projectId: ctx.access.projectId, number: { in: (u.pageNumbers as number[]) ?? [] }, deletedAt: null, ...(ctx.clientView ? { visibility: 'CLIENT' } : {}) }, select: { number: true, title: true, status: true } }),
      prisma.workAttachment.findMany({ where: { id: { in: (u.attachmentIds as number[]) ?? [] }, ...(ctx.clientView ? { clientVisible: true, issue: { clientVisible: true } } : {}) }, select: { id: true, fileName: true, size: true } }),
      prisma.workIssue.findMany({ where: { id: { in: created }, deletedAt: null }, orderBy: { number: 'asc' }, select: { number: true, title: true, type: { select: { key: true, name: true } }, status: { select: { name: true, category: true } } } }),
    ])
    : [[], [], []];
  return {
    round: u.round, environment: u.environment, build: u.build, conditions: u.conditions,
    version: u.version, stage: u.stage ? { id: u.stage.id, n: u.stage.n, name: u.stage.name } : null,
    items: items.map((i) => ({ number: i.number, key: `${ctx.access.key}-${i.number}`, title: i.title, done: !!i.resolvedAt, status: i.status, type: i.type })),
    itemCount: ids.length,
    pages, files,
    createdIssues: createdIssues.map((i) => ({ ...i, key: `${ctx.access.key}-${i.number}` })),
  };
}

export async function listPortalApprovals(userId: number, projectId: number, opts: { asClient?: boolean } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  const rows = await prisma.workApproval.findMany({ where: clientApprovalWhere(ctx), orderBy: { id: 'desc' }, take: 200, select: PORTAL_APPROVAL_SELECT });
  return { viewer: viewerInfo(ctx), items: await Promise.all(rows.map((a) => presentApproval(ctx, a))) };
}

export async function getPortalApproval(userId: number, projectId: number, approvalId: number, opts: { asClient?: boolean } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  const a = await prisma.workApproval.findFirst({ where: { ...clientApprovalWhere(ctx), id: approvalId }, select: PORTAL_APPROVAL_SELECT });
  if (!a) throw new NotFoundError('Approval request not found');
  return presentApproval(ctx, a, true);
}

// ─── Documents & Deliverables ────────────────────────────────────

export async function documents(userId: number, projectId: number, opts: { asClient?: boolean } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  const [pages, files] = await Promise.all([
    ctx.access.modules.docs
      ? prisma.workPage.findMany({
        where: { projectId, deletedAt: null, visibility: 'CLIENT' },
        orderBy: [{ updatedAt: 'desc' }],
        take: 500,
        select: { number: true, title: true, status: true, updatedAt: true, stage: { select: { n: true, name: true } } },
      })
      : Promise.resolve([]),
    prisma.workAttachment.findMany({
      where: { clientVisible: true, deliverable: false, issue: { projectId, deletedAt: null, clientVisible: true } },
      orderBy: { createdAt: 'desc' },
      take: 300,
      select: { id: true, fileName: true, mime: true, size: true, createdAt: true, uploader: { select: PUBLIC_USER }, issue: { select: { number: true, title: true } } },
    }),
  ]);
  return {
    viewer: viewerInfo(ctx),
    pages: pages.map((p) => ({ ...p, stage: p.stage ? `${p.stage.n}. ${p.stage.name}` : null })),
    files: files.map((f) => ({ ...f, uploader: maskUser(f.uploader, ctx.people), issue: { ...f.issue, key: `${ctx.access.key}-${f.issue.number}` } })),
  };
}

/** Đọc một trang tài liệu "như khách" (khách thật dùng được cả GET /pages/:num; xem trước cần đường này). */
export async function portalPage(userId: number, projectId: number, number: number, opts: { asClient?: boolean } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  assertModule(ctx.access, 'docs');
  const p = await prisma.workPage.findFirst({
    where: { projectId, number, deletedAt: null },
    select: { id: true, number: true, title: true, status: true, visibility: true, contentJson: true, updatedAt: true, stage: { select: { n: true, name: true } }, owner: { select: PUBLIC_USER } },
  });
  if (!p || (ctx.clientView && p.visibility !== 'CLIENT') || (!ctx.clientView && !canViewPage(ctx.access.role, ctx.access.workspaceRole, p.visibility))) throw new NotFoundError('Document not found');
  return { ...p, owner: maskUser(p.owner, ctx.people), stage: p.stage ? `${p.stage.n}. ${p.stage.name}` : null };
}

export async function deliverables(userId: number, projectId: number, opts: { asClient?: boolean } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  const [files, releases] = await Promise.all([
    prisma.workAttachment.findMany({
      where: { deliverable: true, clientVisible: true, issue: { projectId, deletedAt: null, clientVisible: true } },
      orderBy: [{ deliveredAt: { sort: 'desc', nulls: 'last' } }, { id: 'desc' }],
      take: 300,
      select: { id: true, fileName: true, mime: true, size: true, deliveredAt: true, createdAt: true, issue: { select: { number: true, title: true, fixVersion: { select: { name: true } } } } },
    }),
    prisma.workVersion.findMany({
      where: { projectId, status: 'RELEASED', issues: { some: { clientVisible: true, deletedAt: null } } },
      orderBy: { releasedAt: 'desc' },
      select: { id: true, name: true, releasedAt: true, releaseDate: true, issues: { where: { clientVisible: true, deletedAt: null }, select: { number: true, title: true } } },
    }),
  ]);
  return {
    viewer: viewerInfo(ctx),
    files: files.map((f) => ({ ...f, issue: { number: f.issue.number, title: f.issue.title, key: `${ctx.access.key}-${f.issue.number}`, version: f.issue.fixVersion?.name ?? null } })),
    // Bản phát hành: chỉ tên + ngày + hạng mục ĐÃ CHIA SẺ (release notes là văn bản nội bộ, không trả).
    releases: releases.map((r) => ({ id: r.id, name: r.name, releasedAt: r.releasedAt ?? r.releaseDate, items: r.issues.map((i) => ({ ...i, key: `${ctx.access.key}-${i.number}` })) })),
  };
}

// ─── Activity (chỉ sự kiện công khai) ────────────────────────────

export async function activity(userId: number, projectId: number, opts: { asClient?: boolean; limit?: number } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  const take = Math.min(Math.max(opts.limit ?? 80, 1), 200);
  const key = ctx.access.key;
  const [history, comments, stages, steps, files, pages] = await Promise.all([
    // Lịch sử của thẻ ĐÃ chia sẻ — CHỈ các trường công khai: tạo, trạng thái, chia sẻ.
    prisma.workHistory.findMany({
      where: { issue: { projectId, deletedAt: null, clientVisible: true }, field: { in: ['created', 'statusId', 'clientVisible'] } },
      orderBy: { createdAt: 'desc' }, take,
      select: { id: true, field: true, toValue: true, createdAt: true, actor: { select: PUBLIC_USER }, issue: { select: { number: true, title: true, clientSharedAt: true } } },
    }),
    prisma.workComment.findMany({
      where: { deletedAt: null, visibility: 'PUBLIC', issue: { projectId, deletedAt: null, clientVisible: true } },
      orderBy: { createdAt: 'desc' }, take,
      select: { id: true, createdAt: true, bodyText: true, author: { select: PUBLIC_USER }, issue: { select: { number: true, title: true } } },
    }),
    ctx.access.modules.stages ? prisma.workStage.findMany({ where: { projectId, OR: [{ startedAt: { not: null } }, { completedAt: { not: null } }] }, select: { id: true, n: true, name: true, startedAt: true, completedAt: true } }) : Promise.resolve([]),
    prisma.workApprovalStep.findMany({
      where: { decidedAt: { not: null }, decision: { in: ['APPROVED', 'REJECTED'] }, approval: clientApprovalWhere(ctx) },
      orderBy: { decidedAt: 'desc' }, take,
      select: {
        id: true, decision: true, decidedAt: true, approverId: true, approver: { select: PUBLIC_USER },
        approval: {
          select: {
            id: true, title: true, description: true, targetType: true, issueId: true, pageId: true,
            issue: { select: { number: true, title: true, clientVisible: true } }, page: { select: { number: true, title: true, visibility: true } }, stage: { select: { n: true, name: true } },
            changeRequestId: true, changeRequest: { select: { number: true, title: true, clientVisible: true } },
          },
        },
      },
    }),
    prisma.workAttachment.findMany({
      where: { deliverable: true, clientVisible: true, deliveredAt: { not: null }, issue: { projectId, deletedAt: null, clientVisible: true } },
      orderBy: { deliveredAt: 'desc' }, take,
      select: { id: true, fileName: true, deliveredAt: true },
    }),
    ctx.access.modules.docs ? prisma.workPage.findMany({ where: { projectId, deletedAt: null, visibility: 'CLIENT' }, orderBy: { updatedAt: 'desc' }, take: 30, select: { number: true, title: true, updatedAt: true, createdAt: true } }) : Promise.resolve([]),
  ]);
  const statusIds = [...new Set(history.filter((h) => h.field === 'statusId' && h.toValue).map((h) => Number(h.toValue)).filter(Number.isInteger))];
  const statuses = new Map((await prisma.workStatus.findMany({ where: { id: { in: statusIds } }, select: { id: true, name: true } })).map((s) => [s.id, s.name]));
  const clientSet = new Set(ctx.clientIds);
  // Tên người: chỉ người khách được thấy (clientPeople.ts); còn lại "The team".
  const actorName = (u: { id: number; username: string; displayName: string | null; fullName: string | null } | null) =>
    (u && ctx.people && !ctx.people.has(u.id) ? TEAM_NAME : userName(u));
  type Ev = { id: string; at: Date; kind: string; text: string; actor: string | null; issueNumber?: number | null; pageNumber?: number | null; approvalId?: number | null };
  const ev: Ev[] = [];
  for (const h of history) {
    const ref = `${key}-${h.issue.number}`;
    if (h.field === 'created') ev.push({ id: `h${h.id}`, at: h.createdAt, kind: 'created', text: `${ref} was created: ${h.issue.title}`, actor: actorName(h.actor), issueNumber: h.issue.number });
    else if (h.field === 'clientVisible' && h.toValue === 'true') ev.push({ id: `h${h.id}`, at: h.createdAt, kind: 'shared', text: `${ref} was shared with you: ${h.issue.title}`, actor: null, issueNumber: h.issue.number });
    else if (h.field === 'statusId' && statuses.get(Number(h.toValue))) ev.push({ id: `h${h.id}`, at: h.createdAt, kind: 'status', text: `${ref} moved to ${statuses.get(Number(h.toValue))}`, actor: actorName(h.actor), issueNumber: h.issue.number });
  }
  for (const c of comments) ev.push({ id: `c${c.id}`, at: c.createdAt, kind: 'reply', text: `${actorName(c.author)} replied on ${key}-${c.issue.number}: “${c.bodyText.slice(0, 120)}”`, actor: actorName(c.author), issueNumber: c.issue.number });
  for (const s of stages) {
    if (s.startedAt) ev.push({ id: `s${s.id}a`, at: s.startedAt, kind: 'stage', text: `Stage ${s.n}. ${s.name} started`, actor: null });
    if (s.completedAt) ev.push({ id: `s${s.id}b`, at: s.completedAt, kind: 'stage', text: `Stage ${s.n}. ${s.name} completed`, actor: null });
  }
  for (const st of steps) {
    // Quyết định của người duyệt nội bộ: chỉ báo "được duyệt", không kèm tên/ghi chú.
    const who = clientSet.has(st.approverId) ? userName(st.approver) : TEAM_NAME;
    const title = (ctx.clientView ? approvalForClient(st.approval) : st.approval).title;
    ev.push({ id: `a${st.id}`, at: st.decidedAt!, kind: 'approval', text: `${who} ${st.decision === 'APPROVED' ? 'approved' : 'rejected'} “${title}”`, actor: who, approvalId: st.approval.id });
  }
  for (const f of files) ev.push({ id: `f${f.id}`, at: f.deliveredAt!, kind: 'deliverable', text: `New deliverable: ${f.fileName}`, actor: null });
  for (const p of pages) ev.push({ id: `p${p.number}`, at: p.updatedAt, kind: 'document', text: `Document updated: ${p.title}`, actor: null, pageNumber: p.number });
  ev.sort((a, b) => b.at.getTime() - a.at.getTime());
  return { viewer: viewerInfo(ctx), items: ev.slice(0, take) };
}

// ─── Khách của dự án (nhân viên) ─────────────────────────────────

export async function listClients(userId: number, projectId: number) {
  const ctx = await portalCtx(userId, projectId);
  assertStaff(ctx);
  const [users, invites] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: ctx.clientIds } }, select: { ...PUBLIC_USER, email: ctx.access.role === 'ADMIN' } }),
    ctx.access.role === 'ADMIN'
      ? prisma.workInvite.findMany({ where: { projectId, projectRole: 'CLIENT', revokedAt: null, expiresAt: { gt: new Date() }, email: { not: null } }, select: { id: true, email: true, expiresAt: true, usedCount: true, maxUses: true } })
      : Promise.resolve([]),
  ]);
  return { clients: users, pendingInvites: invites.filter((i) => i.usedCount < i.maxUses) };
}

export async function inviteClients(userId: number, projectId: number, emails: string[]) {
  const ctx = await portalCtx(userId, projectId);
  assertStaff(ctx);
  if (ctx.access.role !== 'ADMIN') throw new ForbiddenError('Only a project admin can invite clients');
  const { inviteByEmail } = await import('./workspaces.service.js');
  const res = await inviteByEmail(userId, ctx.access.workspaceId, { emails, role: 'GUEST', projectId, projectRole: 'CLIENT' });
  await auditProject(projectId, { actorId: userId, action: 'portal.invite', targetType: 'project', targetId: projectId, summary: `Invited ${emails.length} client${emails.length === 1 ? '' : 's'} to the client portal` });
  return res;
}

// ─── UAT sign-off ────────────────────────────────────────────────

export interface CreateUatInput {
  title?: string;
  description?: string | null;
  versionId?: number | null;
  stageId?: number | null;
  issueNumbers: number[];
  pageNumbers?: number[];
  attachmentIds?: number[];
  approverIds: number[];
  mode?: ApprovalMode;
  environment?: string | null;
  build?: string | null;
  dueAt?: Date | null;
}

export async function createUat(userId: number, projectId: number, input: CreateUatInput) {
  const ctx = await portalCtx(userId, projectId);
  assertStaff(ctx);
  if (!can(ctx.access.role, 'approval.create')) throw new ForbiddenError('You cannot request sign-offs in this project');
  assertModule(ctx.access, 'approvals');
  const nums = [...new Set(input.issueNumbers)];
  if (!nums.length) throw new BadRequestError('Add at least one item to accept', 'WORK_UAT_EMPTY');
  if (nums.length > 300) throw new BadRequestError('A sign-off can cover at most 300 items', 'WORK_LIMIT');
  const items = await prisma.workIssue.findMany({ where: { projectId, number: { in: nums }, deletedAt: null }, select: { id: true, number: true, clientVisible: true } });
  if (items.length !== nums.length) throw new BadRequestError('Some items were not found in this project', 'WORK_UAT_ITEMS');
  const hidden = items.filter((i) => !i.clientVisible).map((i) => `${ctx.access.key}-${i.number}`);
  if (hidden.length) throw new BadRequestError(`Share these issues with the client first: ${hidden.slice(0, 10).join(', ')}`, 'WORK_ISSUE_NOT_SHARED');
  const pageNums = [...new Set(input.pageNumbers ?? [])];
  if (pageNums.length) {
    const ok = await prisma.workPage.count({ where: { projectId, number: { in: pageNums }, deletedAt: null, visibility: 'CLIENT' } });
    if (ok !== pageNums.length) throw new BadRequestError('Attached documents must exist and be shared with the client (visibility: Client)', 'WORK_UAT_DOCS');
  }
  const attIds = [...new Set(input.attachmentIds ?? [])];
  if (attIds.length) {
    const ok = await prisma.workAttachment.count({ where: { id: { in: attIds }, clientVisible: true, issue: { projectId, clientVisible: true, deletedAt: null } } });
    if (ok !== attIds.length) throw new BadRequestError('Attached files must be shared with the client', 'WORK_UAT_FILES');
  }
  if (input.versionId && !(await prisma.workVersion.count({ where: { id: input.versionId, projectId } }))) throw new BadRequestError('Version not found', 'WORK_BAD_VERSION');
  if (input.stageId && !(await prisma.workStage.count({ where: { id: input.stageId, projectId } }))) throw new BadRequestError('Stage not found', 'WORK_BAD_STAGE');
  const approverIds = [...new Set(input.approverIds)];
  if (!approverIds.length) throw new BadRequestError('Pick who signs off (usually the client)', 'WORK_NO_APPROVERS');
  if (approverIds.length > 10) throw new BadRequestError('At most 10 approvers', 'WORK_LIMIT');
  for (const uid of approverIds) {
    const a = await loadProjectAccess(uid, projectId);
    if (!a || !can(a.role, 'approval.decide')) throw new BadRequestError('Every approver must be a project member who can approve', 'WORK_BAD_APPROVER');
  }
  if (!approverIds.some((id) => ctx.clientIds.includes(id))) throw new BadRequestError('A UAT sign-off needs at least one client approver — invite the client first', 'WORK_UAT_NO_CLIENT');

  const scopeName = input.versionId
    ? (await prisma.workVersion.findUniqueOrThrow({ where: { id: input.versionId }, select: { name: true } })).name
    : input.stageId ? (await prisma.workStage.findUniqueOrThrow({ where: { id: input.stageId }, select: { n: true, name: true } })).name : null;
  const id = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_projects WHERE id = ${projectId} FOR UPDATE`;
    const open = await tx.workUatRequest.count({ where: { projectId, versionId: input.versionId ?? null, stageId: input.stageId ?? null, approval: { status: 'PENDING' } } });
    if (open) throw new ConflictError('This milestone already has a pending UAT sign-off');
    const round = (await tx.workUatRequest.count({ where: { projectId, versionId: input.versionId ?? null, stageId: input.stageId ?? null } })) + 1;
    const title = input.title?.trim() || `UAT sign-off${scopeName ? ` — ${scopeName}` : ''}${round > 1 ? ` (round ${round})` : ''}`;
    const aid = await createApprovalTx(tx, projectId, userId, {
      targetType: 'UAT', title, description: input.description, mode: input.mode ?? 'PARALLEL', approverIds, dueAt: input.dueAt,
    });
    await tx.workUatRequest.create({
      data: {
        projectId, approvalId: aid, versionId: input.versionId ?? null, stageId: input.stageId ?? null, round,
        environment: input.environment?.trim().slice(0, 200) || null, build: input.build?.trim().slice(0, 120) || null,
        itemIssueIds: items.map((i) => i.id), pageNumbers: pageNums, attachmentIds: attIds,
      },
    });
    // Chữ ký gốc: băm cả bộ hạng mục lúc gửi (createApprovalTx chưa thấy bản ghi UAT).
    await tx.workApproval.update({ where: { id: aid }, data: { contentHash: await currentTargetHash(tx, { id: aid, targetType: 'UAT', issueId: null, stageId: null }) } });
    return aid;
  });
  await afterCreate(id, projectId, userId);
  return getPortalApproval(userId, projectId, id);
}

export interface UatDecisionInput {
  decision: 'APPROVE' | 'REJECT';
  comment?: string | null;
  conditions?: string | null;
  points?: Array<{ title: string; kind: 'BUG' | 'CHANGE'; detail?: string | null }>;
}

/**
 * Khách quyết nghiệm thu. Duyệt: kèm điều kiện (tuỳ chọn, ghi lên biên bản). Từ
 * chối: bắt buộc lý do; mỗi điểm khách nêu ⇒ một thẻ BUG / CR (không nêu điểm nào
 * ⇒ một thẻ BUG mang chính lý do). Thẻ sinh ra clientVisible + from-client.
 */
export async function decideUat(userId: number, projectId: number, approvalId: number, input: UatDecisionInput, meta: { ip?: string | null } = {}) {
  const ctx = await portalCtx(userId, projectId);
  assertNotPreview(ctx);
  const u = await prisma.workUatRequest.findFirst({ where: { approvalId, projectId }, select: { id: true, round: true, approval: { select: { title: true, status: true } } } });
  if (!u) throw new NotFoundError('UAT sign-off not found');
  const comment = input.comment?.trim() || null;
  const points = (input.points ?? []).map((p) => ({ ...p, title: p.title.trim() })).filter((p) => p.title);
  if (input.decision === 'REJECT' && !comment) throw new BadRequestError('Say why you are rejecting', 'WORK_REJECT_REASON');
  const conditions = input.decision === 'APPROVE' ? input.conditions?.trim().slice(0, 5000) || null : null;
  const stepComment = conditions ? [comment, `Conditions: ${conditions}`].filter(Boolean).join('\n') : comment;
  await decideApproval(userId, projectId, approvalId, { decision: input.decision, comment: stepComment }, { ip: meta.ip, viaUat: true });
  const after = await prisma.workApproval.findUniqueOrThrow({ where: { id: approvalId }, select: { status: true } });
  if (conditions) {
    const prev = await prisma.workUatRequest.findUniqueOrThrow({ where: { id: u.id }, select: { conditions: true } });
    await prisma.workUatRequest.update({ where: { id: u.id }, data: { conditions: [prev.conditions, conditions].filter(Boolean).join('\n') } });
  }
  if (input.decision === 'REJECT') {
    const list = points.length ? points : [{ title: `UAT finding: ${comment!.split('\n')[0].slice(0, 200)}`, kind: 'BUG' as const, detail: comment }];
    const ids: number[] = [];
    for (const p of list.slice(0, 30)) {
      const c = await createClientIssue(projectId, userId, {
        kind: p.kind === 'CHANGE' ? 'CHANGE' : 'BUG', title: p.title, description: p.detail ?? null, priority: p.kind === 'CHANGE' ? 3 : 2,
        extraText: `Raised during “${u.approval.title}” (UAT round ${u.round}). Reason given: ${comment}`,
      });
      ids.push(c.id);
      emitWorkEvent({ type: 'issue.updated', projectId, issueId: c.id, actor: { kind: 'USER', userId }, changes: [{ field: 'clientVisible', from: 'false', to: 'true' }] });
      await notifyTeamOfRequest(projectId, userId, c, p.title, `UAT rejected — new ${p.kind === 'CHANGE' ? 'change request' : 'bug'} from the client`);
    }
    const prev = await prisma.workUatRequest.findUniqueOrThrow({ where: { id: u.id }, select: { createdIssueIds: true } });
    await prisma.workUatRequest.update({ where: { id: u.id }, data: { createdIssueIds: [...((prev.createdIssueIds as number[]) ?? []), ...ids] } });
    await auditProject(projectId, { actorId: userId, action: 'portal.uat_reject', targetType: 'approval', targetId: approvalId, summary: `UAT rejected — ${ids.length} issue${ids.length === 1 ? '' : 's'} created from the client's findings` });
  } else if (after.status === 'APPROVED') {
    await auditProject(projectId, { actorId: userId, action: 'portal.uat_accept', targetType: 'approval', targetId: approvalId, summary: `UAT accepted${conditions ? ' with conditions' : ''}: ${u.approval.title}` });
    await notifyClientsOfProject(projectId, userId, { kind: 'stage', title: u.approval.title, section: 'approvals', message: 'The acceptance certificate is available in the client portal.' });
  }
  return getPortalApproval(userId, projectId, approvalId);
}

/**
 * Biên bản nghiệm thu (theo mẫu content/quy-trinh/mau/bien-ban-nghiem-thu-uat.md, bản
 * tiếng Anh) — dữ liệu cho trang in được (window.print). Chỉ khi yêu cầu đã có quyết
 * định; nhân viên và khách đều tải được (khách: chỉ yêu cầu của khách).
 */
export async function uatCertificate(userId: number, projectId: number, approvalId: number, opts: { asClient?: boolean } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  const a = await getPortalApproval(userId, projectId, approvalId, opts);
  if (!a.uat) throw new NotFoundError('UAT sign-off not found');
  const p = await prisma.workProject.findUniqueOrThrow({
    where: { id: projectId },
    select: { name: true, key: true, workspace: { select: { name: true } }, clientRequest: { select: { organization: true, name: true, code: true } } },
  });
  const decided = a.steps.filter((s) => s.decidedAt);
  const passed = a.uat.items.filter((i) => i.done).length;
  return {
    project: { name: p.name, key: p.key },
    vendor: p.workspace.name,
    client: p.clientRequest?.organization || p.clientRequest?.name || null,
    requestCode: p.clientRequest?.code ?? null,
    title: a.title,
    status: a.status,
    round: a.uat.round,
    milestone: a.uat.version?.name ?? (a.uat.stage ? `${a.uat.stage.n}. ${a.uat.stage.name}` : null),
    environment: a.uat.environment,
    build: a.uat.build,
    requestedAt: a.createdAt,
    decidedAt: a.decidedAt,
    items: a.uat.items,
    results: { total: a.uat.items.length, passed, failed: a.uat.items.length - passed },
    documents: a.uat.pages,
    files: a.uat.files,
    conditions: a.uat.conditions,
    findings: a.uat.createdIssues,
    conclusion: a.status === 'APPROVED' ? (a.uat.conditions ? 'ACCEPTED_WITH_CONDITIONS' : 'ACCEPTED') : a.status === 'REJECTED' ? 'NOT_ACCEPTED' : 'PENDING',
    signatures: decided.map((s) => ({ name: userName(s.approver), side: s.isClient ? 'CLIENT' : 'VENDOR', decision: s.decision, at: s.decidedAt, signature: s.signature, comment: s.comment })),
    contentHash: a.signedHash,
    contentChanged: a.contentChanged,
    viewer: viewerInfo(ctx),
    generatedAt: new Date(),
  };
}

/** Đường cổng khách của dự án (cho trang tra cứu phiếu, thư mời…). */
export async function portalUrlFor(projectId: number): Promise<string | null> {
  const p = await prisma.workProject.findFirst({ where: { id: projectId, deletedAt: null, workspace: { deletedAt: null } }, select: { key: true, settings: true, workspace: { select: { slug: true } } } });
  if (!p) return null;
  const { modulesOf } = await import('./studio.js');
  return modulesOf(p.settings).clientPortal ? portalPath(p.workspace.slug, p.key) : null;
}
