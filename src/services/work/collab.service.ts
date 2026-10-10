/**
 * CTW K-3b — dịch vụ ĐỒNG SOẠN THẢO Docs: cấp mã phiên cho phòng Yjs, kiểm quyền (lúc vào + mỗi 5 giây), công tắc
 * theo dự án/trang, tác giả theo đoạn, ghi ngay trạng thái đang sống, BÌNH LUẬN GẮN ĐOẠN VĂN (K19/K7).
 *
 * Quyền đi qua đúng bảng của Docs (permissions.ts docAccess / canViewPage) + luật thuần `collabRoomMode`
 * (collabRules.ts) — agent, khách cổng không vào phòng; VIEWER/TEACHER chỉ xem; khoá chỉnh sửa (editLock) ⇒ chỉ xem.
 */

import jwt from 'jsonwebtoken';
import * as Y from 'yjs';
import { config } from '../../config/env.js';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import { blockAuthors, collabRoomMode, projectCollabOn, type CollabMode } from './collabRules.js';
import { emitWorkEvent } from './events.js';
import { canManagePage, docAccess, isClientScoped, loadProjectAccess, requireProject } from './permissions.js';
import { moduleOn } from './studio.js';
import type { WorkCollabContext } from '../../socket/work-docs-collaboration.gateway.js';

const TOKEN_ISSUER = 'cuongthai-work';
const TOKEN_AUDIENCE = 'work-docs-collaboration';
const TOKEN_TTL_SECONDS = 5 * 60;

interface TokenPayload { kind: 'work-doc-collab'; userId: number; projectId: number; pageId: number; roleVersion: number }

const gateway = () => import('../../socket/work-docs-collaboration.gateway.js');

/** Màu con trỏ ổn định theo người (đủ tương phản trên nền sáng lẫn `theme-dark`). */
export function collabColor(userId: number): string {
  const palette = ['#0f766e', '#1d4ed8', '#7c3aed', '#be185d', '#c2410c', '#0e7490', '#4338ca', '#15803d', '#b45309', '#9333ea'];
  return palette[Math.abs(userId) % palette.length];
}

// ─── Quyền ───────────────────────────────────────────────────────

async function pageRow(projectId: number, where: { id?: number; number?: number }) {
  return prisma.workPage.findFirst({
    where: { projectId, ...where },
    select: { id: true, number: true, projectId: true, title: true, status: true, visibility: true, ownerId: true, deletedAt: true, collab: { select: { disabled: true, createdAt: true, state: true } } },
  });
}

/** Chế độ vào phòng của `userId` với trang (DB). */
export async function collabModeFor(userId: number, projectId: number, pageId: number): Promise<{ mode: CollabMode; reason: string }> {
  const [access, page, lock, project] = await Promise.all([
    loadProjectAccess(userId, projectId),
    pageRow(projectId, { id: pageId }),
    prisma.workEditLock.findUnique({ where: { userId_projectId: { userId, projectId } }, select: { userId: true } }),
    prisma.workProject.findUnique({ where: { id: projectId }, select: { settings: true } }),
  ]);
  if (!access || !page) return { mode: 'deny', reason: 'Document not found' };
  const da = docAccess(access.role, access.workspaceRole);
  const room = collabRoomMode({
    role: access.role,
    principal: access.principal,
    clientScoped: isClientScoped(access),
    docsModule: moduleOn(access, 'docs'),
    view: da.view,
    edit: da.edit,
    pageVisibility: page.visibility,
    pageStatus: page.status,
    pageDeleted: !!page.deletedAt,
    editLocked: !!lock,
    collabEnabled: projectCollabOn(project?.settings) && !page.collab?.disabled,
  });
  // Đợt 6 (R21): trang thuộc baseline đang khoá (chưa có CR APPROVED) ⇒ vào phòng chỉ xem.
  if (room.mode === 'edit') {
    const locked = await (await import('./quality.service.js')).baselineLockReason(projectId, 'DOC', pageId);
    if (locked) return { mode: 'read', reason: locked };
  }
  return room;
}

// ─── Phiên ───────────────────────────────────────────────────────

/**
 * GET /projects/:pid/pages/:num/collab — trạng thái đồng soạn + mã phiên (nếu được vào). `enabled:false` ⇒ client
 * dùng trình soạn REST như cũ (tự lưu + khoá lạc quan 409).
 */
export async function collabSession(userId: number, projectId: number, num: number, viaApiToken = false) {
  const access = await requireProject(userId, projectId, 'project.view');
  const page = await pageRow(projectId, { number: num });
  if (!page || page.deletedAt) throw new NotFoundError('Document not found');
  const da = docAccess(access.role, access.workspaceRole);
  if (da.view === null || (da.view === 'CLIENT' && page.visibility !== 'CLIENT')) throw new NotFoundError('Document not found');
  const project = await prisma.workProject.findUnique({ where: { id: projectId }, select: { settings: true } });
  const projectOn = projectCollabOn(project?.settings);
  const pageOn = !page.collab?.disabled;
  const canToggle = canManagePage(access.role, access.workspaceRole, userId, page.ownerId);
  const canToggleProject = access.role === 'ADMIN' && access.principal === 'HUMAN';
  const base = { projectEnabled: projectOn, pageEnabled: pageOn, canToggle, canToggleProject };
  const g = await gateway();
  if (viaApiToken) return { ...base, enabled: false as const, mode: 'deny' as const, reason: 'Live editing needs a browser session' };
  const { mode, reason } = await collabModeFor(userId, projectId, page.id);
  if (mode === 'deny' || !g.workCollabServer()) {
    return { ...base, enabled: false as const, mode: 'deny' as const, reason: g.workCollabServer() ? reason : 'Live editing is not running on this server' };
  }
  const row = await g.ensureCollabRow(page.id);
  if (!row) throw new NotFoundError('Document not found');
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { ...PUBLIC_USER, roleVersion: true } });
  if (!user) throw new NotFoundError('User not found');
  const payload: TokenPayload = { kind: 'work-doc-collab', userId, projectId, pageId: page.id, roleVersion: Number(user.roleVersion) };
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: TOKEN_TTL_SECONDS, issuer: TOKEN_ISSUER, audience: TOKEN_AUDIENCE });
  return {
    ...base,
    enabled: true as const,
    mode,
    reason,
    canEdit: mode === 'edit',
    token,
    expiresIn: TOKEN_TTL_SECONDS,
    documentName: g.docNameOf(page.id),
    websocketPath: g.WORK_COLLAB_PATH,
    pageId: page.id,
    /** dòng dõi Yjs của trang — khoá bộ nhớ offline phía client (đổi ⇒ bỏ bản offline cũ, tránh nhân đôi nội dung) */
    lineage: row.createdAt.getTime(),
    user: {
      id: user.id,
      name: user.displayName || user.fullName || user.username,
      avatarUrl: user.avatarUrl ?? null,
      color: collabColor(user.id),
    },
  };
}

/** Xác thực mã phiên khi WebSocket bắt tay (gateway.onAuthenticate). Ném lỗi ⇒ từ chối. */
export async function authenticateCollabToken(token: string, documentName: string): Promise<WorkCollabContext> {
  if (!token) throw new Error('Missing live-editing token');
  const d = jwt.verify(token, config.jwtSecret, { issuer: TOKEN_ISSUER, audience: TOKEN_AUDIENCE }) as TokenPayload;
  const m = /^workpage:(\d+)$/.exec(documentName);
  if (!m || d.kind !== 'work-doc-collab' || Number(m[1]) !== d.pageId) throw new Error('This token is for a different document');
  const user = await prisma.user.findUnique({ where: { id: d.userId }, select: { enabled: true, accountNonLocked: true, roleVersion: true, kind: true } });
  if (!user || !user.enabled || !user.accountNonLocked || Number(user.roleVersion) !== Number(d.roleVersion) || user.kind === 'AGENT') {
    throw new Error('Your session is no longer valid');
  }
  const { mode, reason } = await collabModeFor(d.userId, d.projectId, d.pageId);
  if (mode === 'deny') throw new Error(reason || 'Access denied');
  return { userId: d.userId, projectId: d.projectId, pageId: d.pageId, mode, checkedAt: Date.now() };
}

export async function recheckCollab(ctx: WorkCollabContext): Promise<CollabMode> {
  return (await collabModeFor(ctx.userId, ctx.projectId, ctx.pageId)).mode;
}

// ─── Công tắc ────────────────────────────────────────────────────

/** PUT /projects/:pid/pages/:num/collab { enabled } — chủ trang hoặc ADMIN. */
export async function setPageCollab(userId: number, projectId: number, num: number, enabled: boolean) {
  const access = await requireProject(userId, projectId, 'project.view');
  if (!moduleOn(access, 'docs')) throw new ForbiddenError('The docs module is turned off for this project');
  const page = await pageRow(projectId, { number: num });
  if (!page || page.deletedAt) throw new NotFoundError('Document not found');
  if (!canManagePage(access.role, access.workspaceRole, userId, page.ownerId)) throw new ForbiddenError('Only the document owner or a project admin can turn live editing on or off');
  const g = await gateway();
  // Tắt: ghi ngay bản đang sống rồi đóng phòng (client tự về trình soạn thường, không mất chữ).
  if (!enabled) await g.flushPageCollab(page.id).catch(() => false);
  await prisma.workPageCollab.upsert({ where: { pageId: page.id }, create: { pageId: page.id, disabled: !enabled }, update: { disabled: !enabled } });
  g.closePageCollab(page.id);
  emitWorkEvent({ type: 'page.updated', projectId, pageId: page.id, number: page.number, action: 'updated', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'page.update', targetType: 'page', targetId: page.id, summary: `Document ${page.number}: live editing ${enabled ? 'on' : 'off'}` });
  return collabSession(userId, projectId, num);
}

/** PUT /projects/:pid/docs/collab { enabled } — ADMIN dự án (settings.collab.enabled). */
export async function setProjectCollab(userId: number, projectId: number, enabled: boolean) {
  const access = await requireProject(userId, projectId, 'project.settings');
  if (access.principal !== 'HUMAN') throw new ForbiddenError('Only people can change project settings');
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
  const settings = { ...((p.settings as Record<string, unknown> | null) ?? {}), collab: { enabled } };
  await prisma.workProject.update({ where: { id: projectId }, data: { settings } });
  if (!enabled) {
    const g = await gateway();
    const live = await prisma.workPageCollab.findMany({ where: { page: { projectId } }, select: { pageId: true } });
    for (const r of live) { await g.flushPageCollab(r.pageId).catch(() => false); g.closePageCollab(r.pageId); }
  }
  await auditProject(projectId, { actorId: userId, action: 'project.settings', targetType: 'project', targetId: projectId, summary: `Live editing in docs ${enabled ? 'on' : 'off'}` });
  return { enabled };
}

/** POST /projects/:pid/pages/:num/collab/flush — ghi ngay bản đang sống (trước khi xuất/tóm tắt). */
export async function flushCollab(userId: number, projectId: number, num: number) {
  await requireProject(userId, projectId, 'project.view');
  const page = await pageRow(projectId, { number: num });
  if (!page || page.deletedAt) throw new NotFoundError('Document not found');
  const { mode } = await collabModeFor(userId, projectId, page.id);
  if (mode === 'deny') throw new NotFoundError('Document not found');
  const g = await gateway();
  return { flushed: await g.flushPageCollab(page.id) };
}

// ─── Tác giả theo đoạn ───────────────────────────────────────────

/**
 * GET /projects/:pid/pages/:num/collab/authors — mỗi khối cấp cao nhất: ai viết bao nhiêu ký tự còn sống. Chữ có từ
 * trước khi bật đồng soạn (gieo từ trang cũ) ⇒ `userId: null` ("Before live editing").
 */
export async function pageAuthors(userId: number, projectId: number, num: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const page = await pageRow(projectId, { number: num });
  if (!page || page.deletedAt) throw new NotFoundError('Document not found');
  const da = docAccess(access.role, access.workspaceRole);
  if (da.view !== 'ALL' || access.principal === 'AGENT') throw new NotFoundError('Document not found');
  const g = await gateway();
  await g.flushPageCollab(page.id).catch(() => false);
  const row = await prisma.workPageCollab.findUnique({ where: { pageId: page.id }, select: { state: true, clientUsers: true } });
  if (!row?.state) return { live: false, blocks: [], totals: [] };
  const doc = new Y.Doc();
  Y.applyUpdate(doc, new Uint8Array(row.state));
  const map = (row.clientUsers as Record<string, number> | null) ?? {};
  const blocks = blockAuthors(doc.getXmlFragment('default'));
  doc.destroy();
  const ids = [...new Set(Object.values(map))];
  const people = new Map((await prisma.user.findMany({ where: { id: { in: ids } }, select: PUBLIC_USER })).map((u) => [u.id, u]));
  const totals = new Map<number | null, number>();
  const out = blocks.map((b) => {
    const per = new Map<number | null, number>();
    for (const [client, n] of Object.entries(b.chars)) {
      const uid = map[client] ?? null;
      per.set(uid, (per.get(uid) ?? 0) + n);
      totals.set(uid, (totals.get(uid) ?? 0) + n);
    }
    return {
      index: b.index, type: b.type, preview: b.preview,
      authors: [...per.entries()].sort((a, c) => c[1] - a[1]).map(([uid, chars]) => ({ userId: uid, chars, user: uid ? people.get(uid) ?? null : null })),
    };
  });
  return {
    live: true,
    blocks: out,
    totals: [...totals.entries()].sort((a, c) => c[1] - a[1]).map(([uid, chars]) => ({ userId: uid, chars, user: uid ? people.get(uid) ?? null : null })),
  };
}

// ─── Bình luận gắn đoạn văn (K19/K7) ─────────────────────────────

const ANCHOR_RE = /^[A-Za-z0-9_-]{6,40}$/;

/** POST /projects/:pid/pages/:num/inline-comments { anchorId, quote, bodyJson } — tạo bình luận gốc + neo. */
export async function addInlineComment(userId: number, projectId: number, num: number, input: { anchorId: string; quote: string; bodyJson?: unknown }) {
  if (!ANCHOR_RE.test(input.anchorId)) throw new BadRequestError('Invalid anchor id', 'VALIDATION_ERROR');
  const quote = input.quote.replace(/\s+/g, ' ').trim().slice(0, 500);
  if (!quote) throw new BadRequestError('Select some text to comment on', 'VALIDATION_ERROR');
  const pages = await import('./pages.service.js');
  const page = await pageRow(projectId, { number: num });
  if (!page || page.deletedAt) throw new NotFoundError('Document not found');
  if (await prisma.workPageAnchor.findUnique({ where: { uk_work_page_anchor: { pageId: page.id, anchorId: input.anchorId } }, select: { id: true } })) {
    throw new BadRequestError('This anchor already has a comment', 'WORK_ANCHOR_TAKEN');
  }
  // Cùng đường với bình luận trang thường: quyền comment.create, khách bị cách ly bị chặn ở chốt route, @nhắc tên báo.
  const c = await pages.addComment(userId, projectId, num, input.bodyJson);
  const a = await prisma.workPageAnchor.create({ data: { pageId: page.id, commentId: c.id, anchorId: input.anchorId, quote } });
  return { ...c, anchor: { anchorId: a.anchorId, quote: a.quote, resolvedAt: null, resolvedBy: null } };
}

/** POST /projects/:pid/pages/:num/inline-comments/:cid/resolve { resolved } — người sửa được trang hoặc tác giả. */
export async function resolveInlineComment(userId: number, projectId: number, num: number, commentId: number, resolved: boolean) {
  const access = await requireProject(userId, projectId, 'project.view');
  const page = await pageRow(projectId, { number: num });
  if (!page || page.deletedAt) throw new NotFoundError('Document not found');
  const a = await prisma.workPageAnchor.findFirst({ where: { pageId: page.id, commentId, comment: { deletedAt: null } }, select: { id: true, comment: { select: { authorId: true } } } });
  if (!a) throw new NotFoundError('Comment not found');
  const da = docAccess(access.role, access.workspaceRole);
  if (da.view !== 'ALL') throw new NotFoundError('Comment not found');
  if (!da.edit && a.comment.authorId !== userId) throw new ForbiddenError('Only people who can edit this document (or the comment author) can resolve it');
  const r = await prisma.workPageAnchor.update({
    where: { id: a.id },
    data: resolved ? { resolvedAt: new Date(), resolvedById: userId } : { resolvedAt: null, resolvedById: null },
    select: { anchorId: true, quote: true, resolvedAt: true, resolvedById: true },
  });
  emitWorkEvent({ type: 'page.updated', projectId, pageId: page.id, number: page.number, action: 'comment', actor: { kind: 'USER', userId } });
  const by = r.resolvedById ? await prisma.user.findUnique({ where: { id: r.resolvedById }, select: PUBLIC_USER }) : null;
  return { commentId, anchorId: r.anchorId, quote: r.quote, resolvedAt: r.resolvedAt, resolvedBy: by };
}
