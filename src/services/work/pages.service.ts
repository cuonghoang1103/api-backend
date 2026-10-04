/**
 * CT Work — TÀI LIỆU DỰ ÁN kiểu Confluence (đợt S2a, 04/10/2026, mô-đun `docs`).
 *
 * Trang (`work_pages`) xếp thành cây theo dự án, nội dung TipTap JSON (cùng
 * trình soạn thảo với thẻ, thêm bảng), trạng thái DRAFT → IN_REVIEW → APPROVED
 * (→ ARCHIVED), phiên bản, liên kết thẻ hai chiều, bình luận có @nhắc tên,
 * xuất Markdown, tạo từ 36 mẫu của quy trình nhận dự án.
 *
 * Luật giữ dự án cũ y nguyên: MỌI hàm ở đây gọi `assertModule(access, 'docs')`
 * — dự án không có settings.modules.docs ⇒ 403 MODULE_DISABLED, không đọc/ghi gì.
 *
 * Quyền (permissions.ts docAccess — bảng DUY NHẤT):
 *   - xem: thành viên dự án; khách (vai CLIENT / GUEST) CHỈ trang visibility CLIENT,
 *     trang khác trả 404 (không lộ là có tồn tại);
 *   - sửa: MEMBER+; xoá / khôi phục phiên bản / đổi hiển thị: chủ trang hoặc ADMIN;
 *   - VIEWER / TEACHER chỉ xem (bình luận theo luật comment.create của thẻ).
 *
 * Phiên bản: mỗi lần lưu có ĐỔI nội dung/tiêu đề ⇒ bản chụp. Lưu liên tiếp của
 * CÙNG người trong MERGE_WINDOW_MS gộp vào bản EDIT cuối (tự lưu mỗi vài giây
 * không đẻ hàng trăm bản). Bản CREATE / RESTORE / MANUAL (có ghi chú) không bao
 * giờ bị gộp. Giữ tối đa MAX_VERSIONS bản mới nhất.
 *
 * Phê duyệt tài liệu đi qua approvals.service (targetType DOC, hash = tiêu đề +
 * chữ trơn — approvalContent.ts pageContent).
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError, AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { currentTargetHash, signedHash } from './approvalContent.js';
import { auditProject } from './audit.js';
import { maskUser, peopleFilterFor } from './clientPeople.js';
import { PUBLIC_USER, slugify } from './common.js';
import type { PageStatus, PageVisibility } from './constants.js';
import { lineDiff, tiptapToMarkdown, type PmNode } from './docMarkdown.js';
import { getTemplate, listTemplates, stageTemplateMap } from './docTemplates.js';
import { emitWorkEvent, type PageEventAction } from './events.js';
import { mentionedUserIds, notifyWork } from './notify.js';
import {
  can, canManagePage, canModifyComment, canViewPage, docAccess, isClientScoped, loadProjectAccess, requireProject, type ProjectAccess,
} from './permissions.js';
import { assertModule, modulesOf, stableStringify } from './studio.js';
import { tiptapToText } from './tiptapText.js';

type Tx = Prisma.TransactionClient;

export const MERGE_WINDOW_MS = 10 * 60 * 1000;
export const MAX_VERSIONS = 100;
const MAX_PAGES_PER_PROJECT = 2000;
const MAX_DEPTH = 10;

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };

// ─── Truy cập ────────────────────────────────────────────────────

export interface DocCtx {
  access: ProjectAccess;
  da: ReturnType<typeof docAccess>;
}

/** Vào được dự án + mô-đun docs bật. Người ngoài ⇒ 404, mô-đun tắt ⇒ 403 MODULE_DISABLED. */
export async function docCtx(userId: number, projectId: number): Promise<DocCtx> {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'docs');
  return { access, da: docAccess(access.role, access.workspaceRole) };
}

function requireEdit(ctx: DocCtx) {
  if (!ctx.da.edit) throw new ForbiddenError('You can read documents in this project but not edit them');
}

const LIST_SELECT = {
  id: true, number: true, parentId: true, title: true, status: true, visibility: true, stageId: true,
  position: true, ownerId: true, templateKey: true, createdAt: true, updatedAt: true,
} satisfies Prisma.WorkPageSelect;

/** Trang theo số; không thấy được (đã xoá / trang nội bộ với khách) ⇒ 404. */
async function findPage(ctx: DocCtx, num: number) {
  const p = await prisma.workPage.findFirst({
    where: { projectId: ctx.access.projectId, number: num, deletedAt: null },
    select: { ...LIST_SELECT, contentJson: true, contentText: true, version: true, lastEditedById: true },
  });
  if (!p || !canViewPage(ctx.access.role, ctx.access.workspaceRole, p.visibility)) throw new NotFoundError('Document not found');
  return p;
}

function emitPage(projectId: number, pageId: number, number: number, action: PageEventAction, userId: number) {
  emitWorkEvent({ type: 'page.updated', projectId, pageId, number, action, actor: { kind: 'USER', userId } });
}

/** Số trang tiếp theo — gọi TRONG transaction đã khoá dòng dự án. */
async function nextNumber(tx: Tx, projectId: number): Promise<number> {
  const r = await tx.workPage.aggregate({ where: { projectId }, _max: { number: true } });
  return (r._max.number ?? 0) + 1;
}

async function lockProject(tx: Tx, projectId: number) {
  await tx.$queryRaw`SELECT id FROM work_projects WHERE id = ${projectId} FOR UPDATE`;
}

function normDoc(doc: unknown): { json: Prisma.InputJsonValue; text: string } {
  const d = (doc && typeof doc === 'object' && (doc as { type?: string }).type === 'doc' ? doc : EMPTY_DOC) as object;
  return { json: d as Prisma.InputJsonValue, text: tiptapToText(d).slice(0, 1_000_000) };
}

// ─── Phiên bản ───────────────────────────────────────────────────

/**
 * Ghi bản chụp sau khi trang đã đổi (TRONG transaction). Trả số phiên bản hiện
 * hành của trang. Không đổi gì so với bản cuối ⇒ không ghi.
 */
export async function snapshotTx(
  tx: Tx, pageId: number, userId: number | null,
  cur: { title: string; contentJson: unknown; contentText: string | null },
  kind: 'CREATE' | 'EDIT' | 'RESTORE' | 'MANUAL', note?: string | null, now = new Date(),
): Promise<number> {
  const last = await tx.workPageVersion.findFirst({
    where: { pageId }, orderBy: { n: 'desc' },
    select: { id: true, n: true, kind: true, authorId: true, createdAt: true, title: true, contentJson: true },
  });
  const same = !!last && last.title === cur.title && stableStringify(last.contentJson) === stableStringify(cur.contentJson);
  if (same && kind === 'EDIT') return last!.n;
  const data = { title: cur.title, contentJson: (cur.contentJson ?? undefined) as Prisma.InputJsonValue | undefined, contentText: cur.contentText };
  if (
    kind === 'EDIT' && last && last.kind === 'EDIT' && last.authorId === userId
    && now.getTime() - last.createdAt.getTime() < MERGE_WINDOW_MS
  ) {
    await tx.workPageVersion.update({ where: { id: last.id }, data });
    return last.n;
  }
  const n = (last?.n ?? 0) + 1;
  await tx.workPageVersion.create({ data: { pageId, n, kind, authorId: userId, note: note?.trim().slice(0, 500) || null, ...data } });
  if (n > MAX_VERSIONS) await tx.workPageVersion.deleteMany({ where: { pageId, n: { lte: n - MAX_VERSIONS } } });
  return n;
}

// ─── Đọc cây ─────────────────────────────────────────────────────

/** Cha hiển thị được gần nhất (khách thấy trang CLIENT nằm dưới trang nội bộ ⇒ nổi lên gốc). */
function visibleParent(rows: Array<{ id: number; parentId: number | null }>, visible: Set<number>, id: number): number | null {
  const byId = new Map(rows.map((r) => [r.id, r.parentId]));
  let p = byId.get(id) ?? null;
  let guard = 0;
  while (p !== null && !visible.has(p) && guard++ < 50) p = byId.get(p) ?? null;
  return p;
}

export async function listPages(userId: number, projectId: number, q: { stageId?: number } = {}) {
  const ctx = await docCtx(userId, projectId);
  const rows = await prisma.workPage.findMany({
    where: { projectId, deletedAt: null },
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
    select: { ...LIST_SELECT, owner: { select: PUBLIC_USER } },
    take: MAX_PAGES_PER_PROJECT,
  });
  const seen = rows.filter((r) => canViewPage(ctx.access.role, ctx.access.workspaceRole, r.visibility));
  const visible = new Set(seen.map((r) => r.id));
  // Khách của cổng: chủ trang ngoài phạm vi người khách được thấy ⇒ "Project team" (clientPeople.ts).
  const people = await peopleFilterFor(ctx.access, userId);
  const pages = seen
    .map((r) => ({ ...r, owner: maskUser(r.owner, people), parentId: ctx.da.view === 'ALL' ? r.parentId : visibleParent(rows, visible, r.id) }))
    .filter((r) => (q.stageId ? r.stageId === q.stageId : true));
  return {
    pages,
    canEdit: ctx.da.edit,
    canManage: ctx.da.manage,
    approvalsOn: ctx.access.modules.approvals,
    stagesOn: ctx.access.modules.stages,
  };
}

const ISSUE_BRIEF = {
  id: true, number: true, title: true, resolvedAt: true,
  status: { select: { name: true, category: true } },
  type: { select: { key: true, name: true, icon: true, color: true } },
} satisfies Prisma.WorkIssueSelect;

/** Phê duyệt mới nhất của trang + cờ lệch chữ ký (sửa sau khi duyệt). */
async function latestApproval(pageId: number) {
  const a = await prisma.workApproval.findFirst({
    where: { pageId }, orderBy: { id: 'desc' },
    select: { id: true, status: true, targetType: true, issueId: true, stageId: true, pageId: true, contentHash: true, decidedAt: true, createdAt: true, steps: { select: { contentHash: true, decidedAt: true } } },
  });
  if (!a) return null;
  const now = await currentTargetHash(prisma, a);
  const signed = signedHash(a);
  const anyDecided = a.steps.some((s) => s.decidedAt);
  return {
    id: a.id, status: a.status, decidedAt: a.decidedAt, createdAt: a.createdAt,
    contentChanged: anyDecided && now !== null && signed !== null && now !== signed,
    changedSinceRequest: a.status === 'PENDING' && now !== null && a.contentHash !== null && now !== a.contentHash,
  };
}

export async function getPage(userId: number, projectId: number, num: number) {
  const ctx = await docCtx(userId, projectId);
  const p = await findPage(ctx, num);
  const [full, versions, links, ancestors, children] = await Promise.all([
    prisma.workPage.findUniqueOrThrow({
      where: { id: p.id },
      select: {
        owner: { select: PUBLIC_USER }, lastEditedBy: { select: PUBLIC_USER },
        stage: { select: { id: true, n: true, slug: true, name: true, status: true } },
      },
    }),
    prisma.workPageVersion.aggregate({ where: { pageId: p.id }, _max: { n: true }, _count: true }),
    // Khách bị cách ly (cổng khách S2b): chỉ thấy thẻ ĐÃ CHIA SẺ trong danh sách thẻ liên kết.
    pageIssues(p.id, ctx.access.key, isClientScoped(ctx.access)),
    ancestorsOf(ctx, p.parentId),
    prisma.workPage.findMany({ where: { parentId: p.id, deletedAt: null }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, number: true, title: true, status: true, visibility: true } }),
  ]);
  const people = await peopleFilterFor(ctx.access, userId);
  return {
    ...p,
    ...full,
    owner: maskUser(full.owner, people),
    lastEditedBy: maskUser(full.lastEditedBy, people),
    projectKey: ctx.access.key,
    currentVersion: versions._max.n ?? 0,
    versionCount: versions._count,
    issues: links,
    ancestors,
    children: children.filter((c) => canViewPage(ctx.access.role, ctx.access.workspaceRole, c.visibility)),
    approval: ctx.access.modules.approvals ? await latestApproval(p.id) : null,
    approvalsOn: ctx.access.modules.approvals,
    canEdit: ctx.da.edit,
    canManage: canManagePage(ctx.access.role, ctx.access.workspaceRole, userId, p.ownerId),
    // Bình luận trang là trao đổi nội bộ của đội — khách bị cách ly không đọc/viết (tuyến bị chặn).
    canComment: can(ctx.access.role, 'comment.create') && !isClientScoped(ctx.access),
    canRequestApproval: ctx.access.modules.approvals && ctx.da.edit && can(ctx.access.role, 'approval.create'),
  };
}

async function ancestorsOf(ctx: DocCtx, parentId: number | null) {
  const out: Array<{ id: number; number: number; title: string }> = [];
  let cur = parentId;
  for (let i = 0; cur && i < MAX_DEPTH + 2; i++) {
    const a = await prisma.workPage.findFirst({ where: { id: cur, deletedAt: null }, select: { id: true, number: true, title: true, parentId: true, visibility: true } });
    if (!a) break;
    if (canViewPage(ctx.access.role, ctx.access.workspaceRole, a.visibility)) out.unshift({ id: a.id, number: a.number, title: a.title });
    cur = a.parentId;
  }
  return out;
}

async function pageIssues(pageId: number, projectKey: string, sharedOnly = false) {
  const rows = await prisma.workPageIssueLink.findMany({
    where: { pageId, issue: { deletedAt: null, ...(sharedOnly ? { clientVisible: true } : {}) } },
    orderBy: { id: 'asc' },
    select: { id: true, createdAt: true, issue: { select: ISSUE_BRIEF } },
  });
  return rows.map((r) => ({ linkId: r.id, linkedAt: r.createdAt, ...r.issue, key: `${projectKey}-${r.issue.number}` }));
}

// ─── Tạo / sửa / di chuyển / xoá ─────────────────────────────────

async function parentIdOf(projectId: number, parentNumber: number | null | undefined): Promise<number | null> {
  if (!parentNumber) return null;
  const parent = await prisma.workPage.findFirst({ where: { projectId, number: parentNumber, deletedAt: null }, select: { id: true } });
  if (!parent) throw new BadRequestError('Parent document not found', 'WORK_PAGE_PARENT');
  return parent.id;
}

async function depthOf(tx: Tx | typeof prisma, pageId: number | null): Promise<number> {
  let d = 0;
  let cur = pageId;
  while (cur && d <= MAX_DEPTH + 1) {
    const r: { parentId: number | null } | null = await tx.workPage.findUnique({ where: { id: cur }, select: { parentId: true } });
    cur = r?.parentId ?? null;
    d++;
  }
  return d;
}

async function assertStage(projectId: number, stageId: number | null | undefined) {
  if (!stageId) return;
  const s = await prisma.workStage.findFirst({ where: { id: stageId, projectId }, select: { id: true } });
  if (!s) throw new BadRequestError('Stage not found in this project', 'WORK_BAD_STAGE');
}

export interface CreatePageInput {
  title?: string;
  parentNumber?: number | null;
  templateKey?: string | null;
  stageId?: number | null;
  contentJson?: unknown;
  visibility?: PageVisibility;
}

export async function createPage(userId: number, projectId: number, input: CreatePageInput) {
  const ctx = await docCtx(userId, projectId);
  requireEdit(ctx);
  const parentId = await parentIdOf(projectId, input.parentNumber);
  if (parentId && (await depthOf(prisma, parentId)) >= MAX_DEPTH) throw new BadRequestError(`Documents can be nested at most ${MAX_DEPTH} levels deep`, 'WORK_PAGE_DEPTH');
  let doc: unknown = input.contentJson ?? EMPTY_DOC;
  let title = input.title?.trim() ?? '';
  let stageId = input.stageId ?? null;
  if (input.templateKey) {
    const t = await getTemplate(input.templateKey);
    if (!input.contentJson) doc = t.doc;
    if (!title) title = t.title;
    // Mẫu thuộc giai đoạn nào thì gắn giai đoạn đó (nếu dự án có giai đoạn cùng slug).
    if (!stageId && t.stages.length) {
      const s = await prisma.workStage.findFirst({ where: { projectId, slug: { in: t.stages.map((x) => x.slug) } }, orderBy: { n: 'asc' }, select: { id: true } });
      stageId = s?.id ?? null;
    }
  }
  await assertStage(projectId, stageId);
  if (!title) title = 'Untitled';
  const { json, text } = normDoc(doc);
  const page = await prisma.$transaction(async (tx) => {
    await lockProject(tx, projectId);
    if ((await tx.workPage.count({ where: { projectId, deletedAt: null } })) >= MAX_PAGES_PER_PROJECT) {
      throw new BadRequestError(`A project can have at most ${MAX_PAGES_PER_PROJECT} documents`, 'WORK_LIMIT');
    }
    const number = await nextNumber(tx, projectId);
    const last = await tx.workPage.aggregate({ where: { projectId, parentId, deletedAt: null }, _max: { position: true } });
    const p = await tx.workPage.create({
      data: {
        projectId, number, parentId, title: title.slice(0, 255), contentJson: json, contentText: text,
        status: 'DRAFT', visibility: input.visibility ?? 'INTERNAL', ownerId: userId, lastEditedById: userId,
        templateKey: input.templateKey ?? null, stageId, position: (last._max.position ?? -1) + 1,
      },
      select: { id: true, number: true, title: true },
    });
    await snapshotTx(tx, p.id, userId, { title: p.title, contentJson: json, contentText: text }, 'CREATE', input.templateKey ? `Created from template “${title}”` : null);
    return p;
  });
  emitPage(projectId, page.id, page.number, 'created', userId);
  await auditProject(projectId, { actorId: userId, action: 'page.create', targetType: 'page', targetId: page.id, summary: `Created document ${page.number}: ${page.title}${input.templateKey ? ` (template ${input.templateKey})` : ''}` });
  return getPage(userId, projectId, page.number);
}

export interface UpdatePageInput {
  title?: string;
  contentJson?: unknown;
  status?: PageStatus;
  visibility?: PageVisibility;
  ownerId?: number;
  stageId?: number | null;
  /** Số `version` client đang cầm — lệch ⇒ 409 WORK_PAGE_CONFLICT (có người vừa lưu trước). */
  version?: number;
  /** Ghi chú ⇒ ép một phiên bản RIÊNG ("Save version"). */
  versionNote?: string | null;
}

export async function updatePage(userId: number, projectId: number, num: number, input: UpdatePageInput) {
  const ctx = await docCtx(userId, projectId);
  requireEdit(ctx);
  const p = await findPage(ctx, num);
  const manage = canManagePage(ctx.access.role, ctx.access.workspaceRole, userId, p.ownerId);
  const data: Prisma.WorkPageUncheckedUpdateInput = {};
  const audits: string[] = [];

  if (input.visibility !== undefined && input.visibility !== p.visibility) {
    if (!manage) throw new ForbiddenError('Only the document owner or a project admin can change who can see it');
    data.visibility = input.visibility;
    audits.push(`visibility ${p.visibility} → ${input.visibility}`);
  }
  if (input.ownerId !== undefined && input.ownerId !== p.ownerId) {
    if (!manage) throw new ForbiddenError('Only the document owner or a project admin can change the owner');
    const a = await loadProjectAccess(input.ownerId, projectId);
    if (!a || !docAccess(a.role, a.workspaceRole).edit) throw new BadRequestError('The owner must be a project member who can edit documents', 'WORK_BAD_OWNER');
    data.ownerId = input.ownerId;
    audits.push(`owner → user #${input.ownerId}`);
  }
  if (input.status !== undefined && input.status !== p.status) {
    // APPROVED / IN_REVIEW chỉ đi qua phê duyệt khi mô-đun approvals bật; tắt thì ADMIN đặt tay được APPROVED.
    if (input.status === 'IN_REVIEW' || input.status === 'APPROVED') {
      if (ctx.access.modules.approvals) {
        throw new BadRequestError('Send the document for approval instead — it becomes Approved when every approver signs', 'WORK_PAGE_APPROVAL_REQUIRED');
      }
      if (input.status === 'APPROVED' && !ctx.da.manage) throw new ForbiddenError('Only a project admin can mark a document as approved');
    }
    if (p.status === 'IN_REVIEW' && ctx.access.modules.approvals) {
      const pending = await prisma.workApproval.count({ where: { pageId: p.id, status: 'PENDING' } });
      if (pending) throw new ConflictError('This document is waiting for approval — cancel the request first');
    }
    data.status = input.status;
    audits.push(`status ${p.status} → ${input.status}`);
  }
  if (input.stageId !== undefined && input.stageId !== p.stageId) {
    await assertStage(projectId, input.stageId);
    data.stageId = input.stageId;
  }
  let json: Prisma.InputJsonValue | undefined;
  let text: string | undefined;
  if (input.contentJson !== undefined) ({ json, text } = normDoc(input.contentJson));
  // Gửi lại y nguyên nội dung đang có (tự lưu không có gì mới) ⇒ KHÔNG tính là sửa:
  // không tăng version, không đổi "Edited by", không đẻ phiên bản.
  const bodyChanged = json !== undefined && stableStringify(json) !== stableStringify(p.contentJson);
  const contentChange = bodyChanged || (input.title !== undefined && (input.title.trim() || 'Untitled') !== p.title);
  const title = input.title !== undefined ? (input.title.trim() || 'Untitled').slice(0, 255) : p.title;
  if (contentChange) {
    if (p.status === 'ARCHIVED' && input.status === undefined) throw new BadRequestError('This document is archived — move it back to Draft to edit it', 'WORK_PAGE_ARCHIVED');
    data.title = title;
    if (bodyChanged) { data.contentJson = json; data.contentText = text; }
  }
  if (!Object.keys(data).length && !input.versionNote) return getPage(userId, projectId, num);
  data.lastEditedById = userId;
  data.version = { increment: 1 };

  const r = await prisma.$transaction(async (tx) => {
    // Ghi có điều kiện theo version ⇒ hai người lưu cùng lúc không đè nhau.
    const where = { id: p.id, ...(input.version !== undefined ? { version: input.version } : {}) };
    const upd = await tx.workPage.updateMany({ where, data: data as Prisma.WorkPageUncheckedUpdateManyInput });
    if (!upd.count) {
      const now = await tx.workPage.findUnique({ where: { id: p.id }, select: { version: true, lastEditedBy: { select: PUBLIC_USER } } });
      throw new AppError('Someone else saved this document a moment ago. Reload to see their changes.', 409, 'WORK_PAGE_CONFLICT', { version: now?.version ?? null, by: now?.lastEditedBy ?? null });
    }
    const cur = await tx.workPage.findUniqueOrThrow({ where: { id: p.id }, select: { title: true, contentJson: true, contentText: true, version: true } });
    if (contentChange || input.versionNote) {
      await snapshotTx(tx, p.id, userId, cur, input.versionNote ? 'MANUAL' : 'EDIT', input.versionNote);
    }
    return cur;
  });
  emitPage(projectId, p.id, p.number, data.status ? 'status' : 'updated', userId);
  if (audits.length) await auditProject(projectId, { actorId: userId, action: 'page.update', targetType: 'page', targetId: p.id, summary: `Document ${p.number} (${title}): ${audits.join(', ')}`.slice(0, 500) });
  return { ...(await getPage(userId, projectId, num)), version: r.version };
}

/** Kéo thả trong cây: đổi cha (null = gốc) + vị trí trong anh em. */
export async function movePage(userId: number, projectId: number, num: number, input: { parentNumber: number | null; index: number }) {
  const ctx = await docCtx(userId, projectId);
  requireEdit(ctx);
  const p = await findPage(ctx, num);
  const parentId = await parentIdOf(projectId, input.parentNumber);
  await prisma.$transaction(async (tx) => {
    await lockProject(tx, projectId);
    // Không được thả vào chính nó hay con cháu của nó (thành vòng).
    let cur = parentId;
    for (let i = 0; cur && i < 100; i++) {
      if (cur === p.id) throw new BadRequestError('A document cannot be moved inside itself', 'WORK_PAGE_CYCLE');
      const r: { parentId: number | null } | null = await tx.workPage.findUnique({ where: { id: cur }, select: { parentId: true } });
      cur = r?.parentId ?? null;
    }
    if (parentId && (await depthOf(tx, parentId)) >= MAX_DEPTH) throw new BadRequestError(`Documents can be nested at most ${MAX_DEPTH} levels deep`, 'WORK_PAGE_DEPTH');
    const siblings = await tx.workPage.findMany({
      where: { projectId, parentId, deletedAt: null, id: { not: p.id } },
      orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, position: true },
    });
    const idx = Math.max(0, Math.min(input.index, siblings.length));
    const order = [...siblings.slice(0, idx).map((s) => s.id), p.id, ...siblings.slice(idx).map((s) => s.id)];
    for (const [pos, id] of order.entries()) {
      const s = siblings.find((x) => x.id === id);
      if (id === p.id) await tx.workPage.update({ where: { id }, data: { parentId, position: pos } });
      else if (s && s.position !== pos) await tx.workPage.update({ where: { id }, data: { position: pos } });
    }
  });
  emitPage(projectId, p.id, p.number, 'moved', userId);
  return listPages(userId, projectId);
}

/** Xoá mềm trang + mọi trang con cháu; huỷ phê duyệt đang chờ của chúng. */
export async function deletePage(userId: number, projectId: number, num: number) {
  const ctx = await docCtx(userId, projectId);
  const p = await findPage(ctx, num);
  if (!canManagePage(ctx.access.role, ctx.access.workspaceRole, userId, p.ownerId)) throw new ForbiddenError('Only the document owner or a project admin can delete it');
  const all = await prisma.workPage.findMany({ where: { projectId, deletedAt: null }, select: { id: true, parentId: true } });
  const ids = new Set([p.id]);
  for (let grew = true; grew;) {
    grew = false;
    for (const r of all) if (r.parentId !== null && ids.has(r.parentId) && !ids.has(r.id)) { ids.add(r.id); grew = true; }
  }
  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await tx.workPage.updateMany({ where: { id: { in: [...ids] } }, data: { deletedAt: now } });
    const pending = await tx.workApproval.findMany({ where: { pageId: { in: [...ids] }, status: 'PENDING' }, select: { id: true } });
    if (pending.length) {
      await tx.workApprovalStep.updateMany({ where: { approvalId: { in: pending.map((a) => a.id) }, decision: 'PENDING' }, data: { decision: 'SKIPPED' } });
      await tx.workApproval.updateMany({ where: { id: { in: pending.map((a) => a.id) } }, data: { status: 'CANCELLED', decidedAt: now } });
    }
  });
  emitPage(projectId, p.id, p.number, 'deleted', userId);
  await auditProject(projectId, { actorId: userId, action: 'page.delete', targetType: 'page', targetId: p.id, summary: `Deleted document ${p.number}: ${p.title}${ids.size > 1 ? ` and ${ids.size - 1} child document(s)` : ''}` });
  return { deleted: ids.size };
}

// ─── Phiên bản: liệt kê / xem / so sánh / khôi phục ─────────────

export async function listVersions(userId: number, projectId: number, num: number) {
  const ctx = await docCtx(userId, projectId);
  const p = await findPage(ctx, num);
  const rows = await prisma.workPageVersion.findMany({
    where: { pageId: p.id }, orderBy: { n: 'desc' },
    select: { id: true, n: true, kind: true, title: true, note: true, createdAt: true, updatedAt: true, author: { select: PUBLIC_USER }, contentText: true },
  });
  return rows.map(({ contentText, ...v }) => ({ ...v, chars: contentText?.length ?? 0 }));
}

async function versionRow(pageId: number, n: number) {
  const v = await prisma.workPageVersion.findUnique({
    where: { uk_work_page_version: { pageId, n } },
    select: { id: true, n: true, kind: true, title: true, note: true, contentJson: true, contentText: true, createdAt: true, updatedAt: true, author: { select: PUBLIC_USER } },
  });
  if (!v) throw new NotFoundError('Version not found');
  return v;
}

export async function getVersion(userId: number, projectId: number, num: number, n: number) {
  const ctx = await docCtx(userId, projectId);
  const p = await findPage(ctx, num);
  return versionRow(p.id, n);
}

/**
 * So sánh hai phiên bản (hoặc một phiên bản với bản hiện tại) theo DÒNG của bản
 * Markdown — thấy được cả đề mục, bảng, checklist chứ không chỉ chữ trơn.
 */
export async function compareVersions(userId: number, projectId: number, num: number, from: number, to: number | 'current') {
  const ctx = await docCtx(userId, projectId);
  const p = await findPage(ctx, num);
  const a = await versionRow(p.id, from);
  const b = to === 'current'
    ? { n: null as number | null, title: p.title, contentJson: p.contentJson, createdAt: null as Date | null }
    : await versionRow(p.id, to);
  const mdA = tiptapToMarkdown(a.contentJson, a.title);
  const mdB = tiptapToMarkdown(b.contentJson, b.title);
  const d = lineDiff(mdA, mdB);
  return {
    from: { n: a.n, title: a.title, createdAt: a.createdAt },
    to: { n: b.n, title: b.title, createdAt: b.createdAt, current: to === 'current' },
    ...d,
  };
}

export async function restoreVersion(userId: number, projectId: number, num: number, n: number) {
  const ctx = await docCtx(userId, projectId);
  requireEdit(ctx);
  const p = await findPage(ctx, num);
  if (!canManagePage(ctx.access.role, ctx.access.workspaceRole, userId, p.ownerId)) throw new ForbiddenError('Only the document owner or a project admin can restore a version');
  const v = await versionRow(p.id, n);
  const { json, text } = normDoc(v.contentJson);
  await prisma.$transaction(async (tx) => {
    await tx.workPage.update({ where: { id: p.id }, data: { title: v.title, contentJson: json, contentText: text, lastEditedById: userId, version: { increment: 1 } } });
    await snapshotTx(tx, p.id, userId, { title: v.title, contentJson: json, contentText: text }, 'RESTORE', `Restored version ${n}`);
  });
  emitPage(projectId, p.id, p.number, 'restored', userId);
  await auditProject(projectId, { actorId: userId, action: 'page.restore', targetType: 'page', targetId: p.id, summary: `Restored document ${p.number} (${v.title}) to version ${n}` });
  return getPage(userId, projectId, num);
}

// ─── Liên kết thẻ ────────────────────────────────────────────────

async function issueByNumber(projectId: number, issueNumber: number) {
  const i = await prisma.workIssue.findFirst({ where: { projectId, number: issueNumber, deletedAt: null }, select: { id: true, number: true } });
  if (!i) throw new NotFoundError('Issue not found');
  return i;
}

export async function linkIssue(userId: number, projectId: number, num: number, issueNumber: number) {
  const ctx = await docCtx(userId, projectId);
  requireEdit(ctx);
  const p = await findPage(ctx, num);
  const i = await issueByNumber(projectId, issueNumber);
  if ((await prisma.workPageIssueLink.count({ where: { pageId: p.id } })) >= 200) throw new BadRequestError('A document can link at most 200 issues', 'WORK_LIMIT');
  await prisma.workPageIssueLink.upsert({
    where: { uk_work_page_issue: { pageId: p.id, issueId: i.id } },
    create: { pageId: p.id, issueId: i.id, createdById: userId },
    update: {},
  });
  emitPage(projectId, p.id, p.number, 'links', userId);
  return pageIssues(p.id, ctx.access.key);
}

export async function unlinkIssue(userId: number, projectId: number, num: number, issueNumber: number) {
  const ctx = await docCtx(userId, projectId);
  requireEdit(ctx);
  const p = await findPage(ctx, num);
  const i = await issueByNumber(projectId, issueNumber);
  await prisma.workPageIssueLink.deleteMany({ where: { pageId: p.id, issueId: i.id } });
  emitPage(projectId, p.id, p.number, 'links', userId);
  return pageIssues(p.id, ctx.access.key);
}

/** "Linked docs" của một thẻ — chỉ trang người xem đọc được. */
export async function issuePages(userId: number, projectId: number, issueNumber: number) {
  const ctx = await docCtx(userId, projectId);
  const i = await issueByNumber(projectId, issueNumber);
  // Khách bị cách ly: thẻ chưa chia sẻ ⇒ 404 như thẻ không tồn tại.
  if (isClientScoped(ctx.access) && !(await prisma.workIssue.count({ where: { id: i.id, clientVisible: true } }))) throw new NotFoundError('Issue not found');
  const rows = await prisma.workPageIssueLink.findMany({
    where: { issueId: i.id, page: { deletedAt: null, projectId } },
    orderBy: { id: 'asc' },
    select: { id: true, page: { select: { id: true, number: true, title: true, status: true, visibility: true, updatedAt: true } } },
  });
  return {
    pages: rows.filter((r) => canViewPage(ctx.access.role, ctx.access.workspaceRole, r.page.visibility)).map((r) => ({ linkId: r.id, ...r.page })),
    canEdit: ctx.da.edit,
  };
}

// ─── Bình luận ───────────────────────────────────────────────────

const COMMENT_SELECT = {
  id: true, bodyJson: true, bodyText: true, createdAt: true, editedAt: true, authorId: true, author: { select: PUBLIC_USER },
} satisfies Prisma.WorkPageCommentSelect;

export async function listComments(userId: number, projectId: number, num: number) {
  const ctx = await docCtx(userId, projectId);
  const p = await findPage(ctx, num);
  const rows = await prisma.workPageComment.findMany({ where: { pageId: p.id, deletedAt: null }, orderBy: { id: 'asc' }, take: 500, select: COMMENT_SELECT });
  return rows.map((c) => ({ ...c, canDelete: canModifyComment(ctx.access.role, userId, c.authorId) }));
}

export async function addComment(userId: number, projectId: number, num: number, bodyJson: unknown) {
  const ctx = await docCtx(userId, projectId);
  if (!can(ctx.access.role, 'comment.create')) throw new ForbiddenError('You cannot comment in this project');
  const p = await findPage(ctx, num);
  const { json, text } = normDoc(bodyJson);
  if (!text.trim()) throw new BadRequestError('Write something first', 'VALIDATION_ERROR');
  const c = await prisma.workPageComment.create({ data: { pageId: p.id, authorId: userId, bodyJson: json, bodyText: text.slice(0, 20_000) }, select: COMMENT_SELECT });
  emitPage(projectId, p.id, p.number, 'comment', userId);
  await notifyComment(ctx, p, c.id, json, text, userId);
  return { ...c, canDelete: true };
}

/** @nhắc tên ⇒ WORK_MENTION (chỉ người ĐỌC được trang); chủ trang ⇒ WORK_COMMENT. */
async function notifyComment(ctx: DocCtx, p: { id: number; number: number; title: string; ownerId: number | null; visibility: string }, commentId: number, json: unknown, text: string, sender: number) {
  try {
    const ws = await prisma.workProject.findUnique({ where: { id: ctx.access.projectId }, select: { workspace: { select: { slug: true } } } });
    const url = `/work/${ws?.workspace.slug}/${ctx.access.key}/docs/${p.number}?comment=${commentId}`;
    const payload = { issueKey: `${ctx.access.key} · Doc ${p.number}`, title: p.title, url, excerpt: text.slice(0, 140) };
    const told = new Set<number>([sender]);
    for (const uid of mentionedUserIds(json)) {
      if (told.has(uid)) continue;
      const a = await loadProjectAccess(uid, ctx.access.projectId);
      if (!a || !canViewPage(a.role, a.workspaceRole, p.visibility)) continue;
      told.add(uid);
      await notifyWork({ receiverId: uid, senderId: sender, type: 'WORK_MENTION', entityId: p.id, secondaryEntityId: commentId, payload });
    }
    if (p.ownerId && !told.has(p.ownerId)) {
      const a = await loadProjectAccess(p.ownerId, ctx.access.projectId);
      if (a && canViewPage(a.role, a.workspaceRole, p.visibility)) {
        await notifyWork({ receiverId: p.ownerId, senderId: sender, type: 'WORK_COMMENT', entityId: p.id, secondaryEntityId: commentId, payload });
      }
    }
  } catch (err) {
    logger.warn('[work] báo bình luận tài liệu lỗi', { pageId: p.id, err: (err as Error).message });
  }
}

export async function deleteComment(userId: number, projectId: number, num: number, commentId: number) {
  const ctx = await docCtx(userId, projectId);
  const p = await findPage(ctx, num);
  const c = await prisma.workPageComment.findFirst({ where: { id: commentId, pageId: p.id, deletedAt: null }, select: { id: true, authorId: true } });
  if (!c) throw new NotFoundError('Comment not found');
  if (!canModifyComment(ctx.access.role, userId, c.authorId)) throw new ForbiddenError('You can only delete your own comments');
  await prisma.workPageComment.update({ where: { id: c.id }, data: { deletedAt: new Date() } });
  emitPage(projectId, p.id, p.number, 'comment', userId);
  return { deleted: true };
}

// ─── Tìm kiếm ────────────────────────────────────────────────────

function snippet(text: string | null, q: string): string {
  const t = (text ?? '').replace(/\s+/g, ' ');
  const i = t.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return t.slice(0, 160);
  const start = Math.max(0, i - 60);
  return `${start ? '…' : ''}${t.slice(start, i + q.length + 100)}${i + q.length + 100 < t.length ? '…' : ''}`;
}

function searchWhere(q: string): Prisma.WorkPageWhereInput {
  return { OR: [{ title: { contains: q, mode: 'insensitive' } }, { contentText: { contains: q, mode: 'insensitive' } }] };
}

export async function searchPages(userId: number, projectId: number, qRaw: string, limit = 30) {
  const ctx = await docCtx(userId, projectId);
  const q = qRaw.trim().slice(0, 200);
  if (q.length < 2) return [];
  const rows = await prisma.workPage.findMany({
    where: {
      projectId, deletedAt: null, ...searchWhere(q),
      ...(ctx.da.view === 'ALL' ? {} : { visibility: 'CLIENT' }),
    },
    orderBy: { updatedAt: 'desc' },
    take: Math.min(Math.max(limit, 1), 50),
    select: { id: true, number: true, title: true, status: true, contentText: true, updatedAt: true },
  });
  return rows.map(({ contentText, ...r }) => ({ ...r, snippet: snippet(contentText, q) }));
}

/** Tìm tài liệu ở MỌI dự án bật docs mà người gọi vào được (trang /work/search). */
export async function searchDocsGlobal(userId: number, qRaw: string, limit = 20) {
  const q = qRaw.trim().slice(0, 200);
  if (q.length < 2) return [];
  const projects = await prisma.workProject.findMany({
    where: { deletedAt: null, archivedAt: null, workspace: { deletedAt: null, members: { some: { userId } } } },
    select: { id: true, key: true, name: true, settings: true, workspace: { select: { slug: true } } },
    take: 500,
  });
  const ok: Array<{ id: number; key: string; name: string; slug: string; da: ReturnType<typeof docAccess> }> = [];
  for (const p of projects) {
    if (!modulesOf(p.settings).docs) continue;
    const a = await loadProjectAccess(userId, p.id);
    if (!a) continue;
    ok.push({ id: p.id, key: p.key, name: p.name, slug: p.workspace.slug, da: docAccess(a.role, a.workspaceRole) });
  }
  if (!ok.length) return [];
  const rows = await prisma.workPage.findMany({
    where: {
      deletedAt: null,
      AND: [
        searchWhere(q),
        {
          OR: [
            { projectId: { in: ok.filter((p) => p.da.view === 'ALL').map((p) => p.id) } },
            { projectId: { in: ok.filter((p) => p.da.view === 'CLIENT').map((p) => p.id) }, visibility: 'CLIENT' },
          ],
        },
      ],
    },
    orderBy: { updatedAt: 'desc' },
    take: Math.min(Math.max(limit, 1), 50),
    select: { id: true, projectId: true, number: true, title: true, status: true, contentText: true, updatedAt: true },
  });
  const byId = new Map(ok.map((p) => [p.id, p]));
  return rows.map(({ contentText, ...r }) => {
    const p = byId.get(r.projectId)!;
    return { ...r, snippet: snippet(contentText, q), project: { id: p.id, key: p.key, name: p.name, workspaceSlug: p.slug } };
  });
}

// ─── Xuất Markdown ───────────────────────────────────────────────

export async function exportMarkdown(userId: number, projectId: number, num: number) {
  const ctx = await docCtx(userId, projectId);
  const p = await findPage(ctx, num);
  return {
    filename: `${ctx.access.key}-DOC-${p.number}-${slugify(p.title, 60) || 'document'}.md`,
    markdown: tiptapToMarkdown(p.contentJson, p.title),
  };
}

// ─── Mẫu ─────────────────────────────────────────────────────────

/** Thư viện mẫu — mô-đun docs phải bật ở dự án đang mở. */
export async function templateLibrary(userId: number, projectId: number) {
  await docCtx(userId, projectId);
  return listTemplates();
}

export async function templatePreview(userId: number, projectId: number, key: string) {
  await docCtx(userId, projectId);
  const t = await getTemplate(key);
  return { key: t.key, title: t.title, titleVi: t.titleVi, stages: t.stages, sections: t.sections, summary: t.summary, contentJson: t.doc };
}

// ─── Dự án CLIENT từ phiếu khách: dựng sẵn cây tài liệu ─────────

type TNode = PmNode;
const txt = (text: string, marks?: TNode['marks']): TNode => (marks ? { type: 'text', text, marks } : { type: 'text', text });
const para = (...c: TNode[]): TNode => (c.length ? { type: 'paragraph', content: c } : { type: 'paragraph' });
const link = (text: string, href: string) => txt(text, [{ type: 'link', attrs: { href, target: null, rel: 'noopener noreferrer nofollow' } }]);

export interface ClientStageRef { id: number; n: number; slug: string; name: string }

/**
 * Cây tài liệu cho dự án khách: một trang gốc "Project documents" → mỗi giai đoạn
 * một trang con (gắn `stageId`) → các mẫu của giai đoạn đó (ánh xạ từ
 * client-project-template.json). Một mẫu dùng ở NHIỀU giai đoạn (CR form, runbook,
 * báo cáo tuần…) chỉ tạo MỘT trang ở giai đoạn đầu tiên dùng nó; trang của các
 * giai đoạn sau liệt kê và trỏ link tới trang đó — sửa một chỗ, không phải đồng
 * bộ bốn bản sao. Tất cả trong MỘT transaction. Trả số trang đã tạo.
 */
export async function createClientDocsTree(userId: number, projectId: number, stages: ClientStageRef[], base: string): Promise<number> {
  const stageMap = await stageTemplateMap();
  const ordered = [...stages].sort((a, b) => a.n - b.n);
  const tpl = new Map<string, Awaited<ReturnType<typeof getTemplate>>>();
  for (const s of ordered) for (const k of stageMap.get(s.slug)?.keys ?? []) {
    if (!tpl.has(k)) {
      try { tpl.set(k, await getTemplate(k)); } catch { logger.warn('[work] mẫu tài liệu thiếu tệp — bỏ qua', { key: k }); }
    }
  }
  return prisma.$transaction(async (tx) => {
    await lockProject(tx, projectId);
    let number = await nextNumber(tx, projectId);
    let created = 0;
    const make = async (data: { parentId: number | null; title: string; doc: unknown; stageId?: number | null; templateKey?: string | null; position: number; note?: string }) => {
      const { json, text } = normDoc(data.doc);
      const p = await tx.workPage.create({
        data: {
          projectId, number: number++, parentId: data.parentId, title: data.title.slice(0, 255), contentJson: json, contentText: text,
          ownerId: userId, lastEditedById: userId, stageId: data.stageId ?? null, templateKey: data.templateKey ?? null, position: data.position,
        },
        select: { id: true, number: true, title: true },
      });
      await snapshotTx(tx, p.id, userId, { title: p.title, contentJson: json, contentText: text }, 'CREATE', data.note ?? null);
      created++;
      return p;
    };
    const root = await make({
      parentId: null, title: 'Project documents', position: 0,
      doc: { type: 'doc', content: [
        para(txt('Every document this project produces, one page per stage. Templates come from the studio process — fill them in, link the issues they cover, and send them for approval when they are ready.')),
        para(txt('Documents are '), txt('internal', [{ type: 'bold' }]), txt(' by default. Mark one as visible to the client when it is ready for them to read.')),
      ] },
    });
    const home = new Map<string, { number: number; title: string; stage: ClientStageRef }>();
    const stagePages: Array<{ id: number; stage: ClientStageRef; keys: string[] }> = [];
    for (const [i, s] of ordered.entries()) {
      const sp = await make({ parentId: root.id, title: `${String(s.n).padStart(2, '0')}. ${s.name}`, stageId: s.id, position: i, doc: EMPTY_DOC });
      const keys = (stageMap.get(s.slug)?.keys ?? []).filter((k) => tpl.has(k));
      stagePages.push({ id: sp.id, stage: s, keys });
      let pos = 0;
      for (const k of keys) {
        if (home.has(k)) continue;
        const t = tpl.get(k)!;
        const d = await make({ parentId: sp.id, title: t.title, doc: t.doc, stageId: s.id, templateKey: k, position: pos++, note: `Created from template “${t.title}”` });
        home.set(k, { number: d.number, title: t.title, stage: s });
      }
    }
    // Nội dung trang giai đoạn: hướng dẫn + danh sách tài liệu (kể cả tài liệu nằm ở giai đoạn trước).
    for (const sp of stagePages) {
      const items: TNode[] = sp.keys.map((k) => {
        const h = home.get(k)!;
        const own = h.stage.id === sp.stage.id;
        return { type: 'listItem', content: [para(link(h.title, `${base}/${h.number}`), ...(own ? [] : [txt(` — kept under stage ${String(h.stage.n).padStart(2, '0')}`)]))] };
      });
      const doc = { type: 'doc', content: [
        para(txt('Stage '), txt(`${String(sp.stage.n).padStart(2, '0')} · ${sp.stage.name}`, [{ type: 'bold' }]), txt('. Process guide: '), link('/about/quy-trinh/' + sp.stage.slug, `/about/quy-trinh/${sp.stage.slug}`)),
        ...(items.length ? [{ type: 'heading', attrs: { level: 2 }, content: [txt('Documents for this stage')] }, { type: 'bulletList', content: items }] : [para(txt('No template for this stage — add pages as you need them.'))]),
      ] };
      const { json, text } = normDoc(doc);
      await tx.workPage.update({ where: { id: sp.id }, data: { contentJson: json, contentText: text } });
      await tx.workPageVersion.updateMany({ where: { pageId: sp.id, n: 1 }, data: { contentJson: json, contentText: text } });
    }
    return created;
  }, { timeout: 60_000, maxWait: 10_000 });
}
