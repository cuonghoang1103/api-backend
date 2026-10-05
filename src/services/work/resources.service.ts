/**
 * CT Work — RESOURCES (06/10/2026, mô-đun `resources`): thư viện link/tài nguyên của dự án.
 *
 * Chủ web hỏi "có chỗ ghim link GitHub nhóm, source tham khảo, âm thanh, Mixamo… sắp theo nhóm cho đỡ bới tìm
 * không?" — trước đây KHÔNG (chỉ có 1 repo/dự án cho webhook, đính kèm theo thẻ, link gõ trong Docs). Mô-đun này:
 *
 *   - Nhóm (WorkResourceGroup) + link (WorkResource): CRUD, kéo-thả (rank), ghim ⭐, ghim lên sidebar, mở (đếm lượt),
 *     nhập hàng loạt Markdown/CSV, tìm bỏ dấu, lọc nhóm/nhãn/loại.
 *   - Nhóm mặc định (Source code · Docs · Design · Audio · 3D & Images · References · Environments · Meetings &
 *     calendars) tạo LẦN ĐẦU dự án mở thư viện (chưa có nhóm nào và chưa có link nào).
 *   - Web links trên thẻ (WorkIssueWebLink) kiểu Jira: chọn từ Resources hoặc gõ url + tiêu đề, "Save to Resources".
 *   - Xem trước GitHub (API công khai, không khoá, cache 6 giờ, timeout 5 s, lỗi thì bỏ qua; dự phòng bằng bảng
 *     github_repos sẵn có của web) · favicon Google s2 (chỉ lưu URL).
 *   - "Add link" tự điền tiêu đề từ <title>/OpenGraph — gọi ra ngoài QUA safeFetch (chặn SSRF: chỉ http/https, cổng
 *     80/443/8080/8443, phân giải DNS rồi chặn IP nội bộ, bám chuyển hướng tay và kiểm lại MỖI chặng).
 *   - Job kiểm link chết hằng tuần (cron.service.ts, tắt bằng WORK_LINK_CHECK_ENABLED=false): HEAD rồi GET, tối đa
 *     WORK_LINK_CHECK_LIMIT link/lượt (mặc định 200); vừa chuyển sang BROKEN ⇒ báo người tạo một lần.
 *
 * Quyền (permissions.resourceAccess): MEMBER thêm + sửa link của mình, ADMIN sửa tất + quản lý nhóm, VIEWER/TEACHER
 * chỉ đọc, khách chỉ thấy visibility=CLIENT (qua /portal/resources khi bị cách ly) và KHÔNG thấy linkStatus/openCount.
 */

import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName } from './common.js';
import type { ResourceVisibility } from './constants.js';
import { emitWorkEvent } from './events.js';
import { can, canModifyResource, isClientScoped, requireProject, resourceAccess, type ProjectAccess } from './permissions.js';
import {
  DEFAULT_GROUPS, RESOURCE_TITLE_MAX, blockedAddress, blockedHostname, detectKind, extractPageInfo, faviconFor, githubRepoOf,
  linkStatusFrom, matchesQuery, normTags, normalizeUrl, parseImport, titleFromUrl,
} from './resourceRules.js';
import { assertModule, modulesOf } from './studio.js';

// ─── Ngữ cảnh + quyền ────────────────────────────────────────────

interface ResCtx {
  access: ProjectAccess;
  ra: ReturnType<typeof resourceAccess>;
  userId: number;
}

async function resCtx(userId: number, projectId: number, opts: { edit?: boolean; manage?: boolean } = {}): Promise<ResCtx> {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'resources');
  const ra = resourceAccess(access.role, access.workspaceRole);
  if (!ra.view) throw new NotFoundError('Project not found');
  if (opts.edit && !ra.edit) throw new ForbiddenError('You can view but not change resources in this project');
  if (opts.manage && !ra.manage) throw new ForbiddenError('Only a project admin can do this');
  return { access, ra, userId };
}

const emit = (projectId: number, userId: number, action: string, extra: { resourceId?: number | null; issueNumber?: number | null } = {}) =>
  emitWorkEvent({ type: 'resources.updated', projectId, action, ...extra, actor: { kind: 'USER', userId } });

// ─── Nhóm mặc định ───────────────────────────────────────────────

/**
 * Lần đầu dự án mở thư viện (chưa nhóm nào VÀ chưa link nào) ⇒ tạo 8 nhóm mặc định. Khoá tư vấn theo dự án để hai
 * tab mở cùng lúc không đẻ hai bộ. Người dùng xoá hết nhóm mà vẫn còn link ⇒ không tạo lại (đúng ý họ).
 */
export async function ensureDefaultGroups(projectId: number): Promise<void> {
  if (await prisma.workResourceGroup.count({ where: { projectId } })) return;
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(31010::int, ${projectId}::int)`;
    const [g, r] = await Promise.all([tx.workResourceGroup.count({ where: { projectId } }), tx.workResource.count({ where: { projectId } })]);
    if (g || r) return;
    await tx.workResourceGroup.createMany({ data: DEFAULT_GROUPS.map((d, i) => ({ projectId, name: d.name, icon: d.icon, color: d.color, rank: i, isDefault: true })) });
  });
}

// ─── Trình bày ───────────────────────────────────────────────────

const RES_SELECT = {
  id: true, groupId: true, title: true, url: true, description: true, tags: true, kind: true, faviconUrl: true, pinned: true,
  pinnedToSidebar: true, visibility: true, rank: true, createdById: true, lastOpenedAt: true, openCount: true, linkStatus: true,
  checkedAt: true, meta: true, createdAt: true, updatedAt: true,
} satisfies Prisma.WorkResourceSelect;
type ResRow = Prisma.WorkResourceGetPayload<{ select: typeof RES_SELECT }>;

interface GithubMeta { fullName: string; stars: number; lastCommitAt: string | null; description: string | null; defaultBranch: string | null; language: string | null; source: 'api' | 'catalog' }

function metaOf(r: { meta: Prisma.JsonValue | null }): Record<string, unknown> {
  return r.meta && typeof r.meta === 'object' && !Array.isArray(r.meta) ? (r.meta as Record<string, unknown>) : {};
}

async function creatorNames(ids: Array<number | null>): Promise<Map<number, string>> {
  const uniq = [...new Set(ids.filter((x): x is number => !!x))];
  if (!uniq.length) return new Map();
  const users = await prisma.user.findMany({ where: { id: { in: uniq } }, select: { id: true, username: true, fullName: true, displayName: true } });
  return new Map(users.map((u) => [u.id, displayName(u)]));
}

/** Một link cho người xem này. Khách: bỏ trạng thái kiểm link, số lượt mở, người tạo, ghi chú kiểm. */
function present(ctx: ResCtx, r: ResRow, names: Map<number, string>, groupName: string | null) {
  const m = metaOf(r);
  const github = (m.github ?? null) as GithubMeta | null;
  const base = {
    id: r.id, groupId: r.groupId, groupName, title: r.title, url: r.url, description: r.description, tags: r.tags ?? [], kind: r.kind,
    faviconUrl: r.faviconUrl, pinned: r.pinned, pinnedToSidebar: r.pinnedToSidebar, visibility: r.visibility, rank: r.rank,
    github, createdAt: r.createdAt, updatedAt: r.updatedAt,
  };
  if (ctx.ra.view !== 'ALL') return base;
  return {
    ...base,
    createdById: r.createdById,
    createdByName: r.createdById ? names.get(r.createdById) ?? null : null,
    lastOpenedAt: r.lastOpenedAt, openCount: r.openCount, linkStatus: r.linkStatus, checkedAt: r.checkedAt,
    check: (m.check ?? null) as { status?: number; error?: string; at?: string } | null,
    canEdit: canModifyResource(ctx.access.role, ctx.access.workspaceRole, ctx.userId, r.createdById),
  };
}

const visWhere = (ctx: ResCtx): Prisma.WorkResourceWhereInput => (ctx.ra.view === 'ALL' ? {} : { visibility: 'CLIENT' });

// ─── Đọc ─────────────────────────────────────────────────────────

export interface ResourceQuery { q?: string; groupId?: number | null; tag?: string; kind?: string; pinned?: boolean; status?: string }

async function listFor(ctx: ResCtx, projectId: number, q: ResourceQuery) {
  await ensureDefaultGroups(projectId);
  const [groups, rows] = await Promise.all([
    prisma.workResourceGroup.findMany({ where: { projectId }, orderBy: [{ rank: 'asc' }, { id: 'asc' }] }),
    prisma.workResource.findMany({ where: { projectId, ...visWhere(ctx) }, orderBy: [{ rank: 'asc' }, { id: 'asc' }], take: 3000, select: RES_SELECT }),
  ]);
  const gName = new Map(groups.map((g) => [g.id, g.name]));
  const names = ctx.ra.view === 'ALL' ? await creatorNames(rows.map((r) => r.createdById)) : new Map<number, string>();
  const all = rows.map((r) => present(ctx, r, names, r.groupId ? gName.get(r.groupId) ?? null : null));
  const tagLc = q.tag?.toLowerCase();
  const items = all.filter((r) => (q.groupId === undefined || r.groupId === q.groupId)
    && (!tagLc || r.tags.some((t) => t.toLowerCase() === tagLc))
    && (!q.kind || r.kind === q.kind)
    && (q.pinned === undefined || r.pinned === q.pinned)
    && (!q.status || ctx.ra.view !== 'ALL' || (r as { linkStatus?: string }).linkStatus === q.status)
    && (!q.q || matchesQuery(r, q.q)));
  const tagCount = new Map<string, number>();
  for (const r of all) for (const t of r.tags) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
  const kindCount = new Map<string, number>();
  for (const r of all) kindCount.set(r.kind, (kindCount.get(r.kind) ?? 0) + 1);
  const count = (gid: number | null) => all.filter((r) => r.groupId === gid).length;
  const visibleGroups = groups
    .map((g) => ({ id: g.id, name: g.name, icon: g.icon, color: g.color, rank: g.rank, isDefault: g.isDefault, count: count(g.id) }))
    // Khách không thấy tên nhóm nội bộ trống (chỉ nhóm có link đã chia sẻ).
    .filter((g) => ctx.ra.view === 'ALL' || g.count > 0);
  return {
    groups: visibleGroups,
    ungrouped: count(null),
    items,
    total: all.length,
    tags: [...tagCount.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag, n]) => ({ tag, count: n })),
    kinds: [...kindCount.entries()].sort((a, b) => b[1] - a[1]).map(([kind, n]) => ({ kind, count: n })),
    canEdit: ctx.ra.edit,
    canManage: ctx.ra.manage,
    ...(ctx.ra.view === 'ALL' ? { broken: all.filter((r) => (r as { linkStatus?: string }).linkStatus === 'BROKEN').length } : {}),
  };
}

export async function listResources(userId: number, projectId: number, q: ResourceQuery = {}) {
  return listFor(await resCtx(userId, projectId), projectId, q);
}

/** Link ghim lên sidebar dự án. Mô-đun tắt / không xem được ⇒ rỗng (sidebar không bao giờ lỗi). */
export async function sidebarResources(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const ra = resourceAccess(access.role, access.workspaceRole);
  if (!access.modules.resources || !ra.view) return { enabled: false, items: [] };
  const rows = await prisma.workResource.findMany({
    where: { projectId, pinnedToSidebar: true, ...(ra.view === 'ALL' ? {} : { visibility: 'CLIENT' }) },
    orderBy: [{ rank: 'asc' }, { id: 'asc' }], take: 30,
    select: { id: true, title: true, url: true, kind: true, faviconUrl: true },
  });
  return { enabled: true, items: rows };
}

async function findRes(ctx: ResCtx, projectId: number, id: number) {
  const r = await prisma.workResource.findFirst({ where: { id, projectId, ...visWhere(ctx) }, select: RES_SELECT });
  if (!r) throw new NotFoundError('Resource not found');
  return r;
}

async function presentOne(ctx: ResCtx, projectId: number, r: ResRow) {
  const g = r.groupId ? await prisma.workResourceGroup.findUnique({ where: { id: r.groupId }, select: { name: true } }) : null;
  return present(ctx, r, await creatorNames([r.createdById]), g?.name ?? null);
}

export async function getResource(userId: number, projectId: number, id: number) {
  const ctx = await resCtx(userId, projectId);
  return presentOne(ctx, projectId, await findRes(ctx, projectId, id));
}

/** Mở một link: tăng đếm + trả url (frontend mở tab mới). Khách mở link CLIENT cũng được đếm. */
export async function openResource(userId: number, projectId: number, id: number) {
  const ctx = await resCtx(userId, projectId);
  const r = await findRes(ctx, projectId, id);
  await prisma.workResource.update({ where: { id: r.id }, data: { openCount: { increment: 1 }, lastOpenedAt: new Date() } });
  return { id: r.id, url: r.url };
}

// ─── Ghi ─────────────────────────────────────────────────────────

export interface ResourceInput {
  title?: string | null;
  url?: string;
  description?: string | null;
  tags?: string[];
  groupId?: number | null;
  pinned?: boolean;
  pinnedToSidebar?: boolean;
  visibility?: ResourceVisibility;
}

function cleanUrl(raw: string): string {
  const u = normalizeUrl(raw);
  if (!u) throw new BadRequestError('Enter a valid http(s) or mailto link (up to 2000 characters)', 'WORK_BAD_URL');
  return u;
}

async function assertGroup(projectId: number, groupId: number | null | undefined) {
  if (groupId === null || groupId === undefined) return;
  const g = await prisma.workResourceGroup.findFirst({ where: { id: groupId, projectId }, select: { id: true } });
  if (!g) throw new BadRequestError('That group does not belong to this project', 'WORK_BAD_GROUP');
}

async function nextRank(projectId: number, groupId: number | null): Promise<number> {
  const agg = await prisma.workResource.aggregate({ where: { projectId, groupId }, _max: { rank: true } });
  return (agg._max.rank ?? -1) + 1;
}

export async function createResource(userId: number, projectId: number, input: ResourceInput & { url: string }) {
  const ctx = await resCtx(userId, projectId, { edit: true });
  const url = cleanUrl(input.url);
  await assertGroup(projectId, input.groupId);
  const dup = await prisma.workResource.findFirst({ where: { projectId, url }, select: { id: true, title: true } });
  if (dup) throw new AppError(`This link is already in Resources as "${dup.title}"`, 409, 'WORK_RESOURCE_DUPLICATE', { id: dup.id });
  const groupId = input.groupId ?? null;
  const r = await prisma.workResource.create({
    data: {
      projectId, groupId, url,
      title: (input.title?.trim() || titleFromUrl(url)).slice(0, RESOURCE_TITLE_MAX),
      description: input.description?.trim() || null,
      tags: normTags(input.tags ?? []),
      kind: detectKind(url),
      faviconUrl: faviconFor(url),
      pinned: input.pinned ?? false,
      pinnedToSidebar: input.pinnedToSidebar ?? false,
      visibility: input.visibility ?? 'TEAM',
      rank: await nextRank(projectId, groupId),
      createdById: userId,
    },
    select: RES_SELECT,
  });
  await auditProject(projectId, { actorId: userId, action: 'resource.create', targetType: 'resource', targetId: r.id, summary: `Added resource "${r.title}"`, detail: { url, kind: r.kind } });
  emit(projectId, userId, 'created', { resourceId: r.id });
  if (r.kind === 'github') void refreshGithubMeta(r.id).catch(() => undefined);
  return presentOne(ctx, projectId, r);
}

export async function updateResource(userId: number, projectId: number, id: number, patch: ResourceInput) {
  const ctx = await resCtx(userId, projectId, { edit: true });
  const r = await findRes(ctx, projectId, id);
  if (!canModifyResource(ctx.access.role, ctx.access.workspaceRole, userId, r.createdById)) {
    throw new ForbiddenError('Only the person who added this link or a project admin can change it');
  }
  const data: Prisma.WorkResourceUncheckedUpdateInput = {};
  if (patch.url !== undefined) {
    const url = cleanUrl(patch.url);
    if (url !== r.url) {
      const dup = await prisma.workResource.findFirst({ where: { projectId, url, id: { not: r.id } }, select: { id: true, title: true } });
      if (dup) throw new AppError(`This link is already in Resources as "${dup.title}"`, 409, 'WORK_RESOURCE_DUPLICATE', { id: dup.id });
      Object.assign(data, { url, kind: detectKind(url), faviconUrl: faviconFor(url), linkStatus: 'UNKNOWN', checkedAt: null, meta: Prisma.DbNull });
    }
  }
  if (patch.title !== undefined) data.title = (patch.title?.trim() || titleFromUrl(String(data.url ?? r.url))).slice(0, RESOURCE_TITLE_MAX);
  if (patch.description !== undefined) data.description = patch.description?.trim() || null;
  if (patch.tags !== undefined) data.tags = normTags(patch.tags);
  if (patch.groupId !== undefined && patch.groupId !== r.groupId) {
    await assertGroup(projectId, patch.groupId);
    data.groupId = patch.groupId;
    data.rank = await nextRank(projectId, patch.groupId);
  }
  if (patch.pinned !== undefined) data.pinned = patch.pinned;
  if (patch.pinnedToSidebar !== undefined) data.pinnedToSidebar = patch.pinnedToSidebar;
  if (patch.visibility !== undefined) data.visibility = patch.visibility;
  const next = await prisma.workResource.update({ where: { id: r.id }, data, select: RES_SELECT });
  if (patch.visibility !== undefined && patch.visibility !== r.visibility) {
    await auditProject(projectId, { actorId: userId, action: 'resource.visibility', targetType: 'resource', targetId: r.id, summary: `${patch.visibility === 'CLIENT' ? 'Shared' : 'Unshared'} resource "${next.title}" ${patch.visibility === 'CLIENT' ? 'with' : 'from'} the client` });
  }
  emit(projectId, userId, 'updated', { resourceId: r.id });
  if (next.kind === 'github' && data.url) void refreshGithubMeta(r.id).catch(() => undefined);
  return presentOne(ctx, projectId, next);
}

export async function deleteResource(userId: number, projectId: number, id: number) {
  const ctx = await resCtx(userId, projectId, { edit: true });
  const r = await findRes(ctx, projectId, id);
  if (!canModifyResource(ctx.access.role, ctx.access.workspaceRole, userId, r.createdById)) {
    throw new ForbiddenError('Only the person who added this link or a project admin can delete it');
  }
  await prisma.workResource.delete({ where: { id: r.id } });
  await auditProject(projectId, { actorId: userId, action: 'resource.delete', targetType: 'resource', targetId: r.id, summary: `Deleted resource "${r.title}"`, detail: { url: r.url } });
  emit(projectId, userId, 'deleted', { resourceId: r.id });
  return { deleted: true };
}

/**
 * Kéo-thả: `ids` là thứ tự MỚI của nhóm `groupId` (null = Ungrouped). Đổi thứ tự trong nhóm: mọi người được thêm
 * link đều làm được (chỉ là sắp xếp). CHUYỂN link sang nhóm khác: chỉ người sửa được link đó (người tạo / ADMIN).
 */
export async function reorderResources(userId: number, projectId: number, input: { groupId: number | null; ids: number[] }) {
  const ctx = await resCtx(userId, projectId, { edit: true });
  await assertGroup(projectId, input.groupId);
  const ids = [...new Set(input.ids)];
  const rows = await prisma.workResource.findMany({ where: { projectId, id: { in: ids } }, select: { id: true, groupId: true, createdById: true } });
  if (rows.length !== ids.length) throw new BadRequestError('Some links do not belong to this project', 'WORK_BAD_RESOURCE');
  for (const r of rows) {
    if (r.groupId !== input.groupId && !canModifyResource(ctx.access.role, ctx.access.workspaceRole, userId, r.createdById)) {
      throw new ForbiddenError('You can only move links you added to another group');
    }
  }
  await prisma.$transaction(ids.map((rid, i) => prisma.workResource.update({ where: { id: rid }, data: { groupId: input.groupId, rank: i } })));
  emit(projectId, userId, 'reordered');
  return listFor(ctx, projectId, {});
}

// ─── Nhóm ────────────────────────────────────────────────────────

export interface GroupInput { name?: string; icon?: string | null; color?: string | null }

/** Thành viên tạo được nhóm (nhập hàng loạt cũng tạo nhóm); đổi tên / xoá / sắp xếp nhóm: ADMIN. */
export async function createGroup(userId: number, projectId: number, input: GroupInput & { name: string }) {
  await resCtx(userId, projectId, { edit: true });
  const name = input.name.trim().slice(0, 80);
  if (!name) throw new BadRequestError('Group name is required', 'VALIDATION_ERROR');
  const agg = await prisma.workResourceGroup.aggregate({ where: { projectId }, _max: { rank: true } });
  const g = await prisma.workResourceGroup.create({ data: { projectId, name, icon: input.icon || null, color: input.color || null, rank: (agg._max.rank ?? -1) + 1 } });
  await auditProject(projectId, { actorId: userId, action: 'resource.group', targetType: 'resourceGroup', targetId: g.id, summary: `Created resource group "${name}"` });
  emit(projectId, userId, 'group');
  return g;
}

export async function updateGroup(userId: number, projectId: number, groupId: number, input: GroupInput) {
  await resCtx(userId, projectId, { manage: true });
  await assertGroup(projectId, groupId);
  const data: Prisma.WorkResourceGroupUpdateInput = {};
  if (input.name !== undefined) {
    const name = input.name.trim().slice(0, 80);
    if (!name) throw new BadRequestError('Group name is required', 'VALIDATION_ERROR');
    data.name = name;
  }
  if (input.icon !== undefined) data.icon = input.icon || null;
  if (input.color !== undefined) data.color = input.color || null;
  const g = await prisma.workResourceGroup.update({ where: { id: groupId }, data });
  emit(projectId, userId, 'group');
  return g;
}

/** Xoá nhóm: link trong nhóm về "Ungrouped" (FK SetNull) — không mất link nào. */
export async function deleteGroup(userId: number, projectId: number, groupId: number) {
  await resCtx(userId, projectId, { manage: true });
  const g = await prisma.workResourceGroup.findFirst({ where: { id: groupId, projectId } });
  if (!g) throw new NotFoundError('Group not found');
  const moved = await prisma.workResource.count({ where: { groupId } });
  await prisma.workResourceGroup.delete({ where: { id: groupId } });
  await auditProject(projectId, { actorId: userId, action: 'resource.group', targetType: 'resourceGroup', targetId: groupId, summary: `Deleted resource group "${g.name}" (${moved} link${moved === 1 ? '' : 's'} moved to Ungrouped)` });
  emit(projectId, userId, 'group');
  return { deleted: true, moved };
}

export async function reorderGroups(userId: number, projectId: number, ids: number[]) {
  const ctx = await resCtx(userId, projectId, { manage: true });
  const uniq = [...new Set(ids)];
  const n = await prisma.workResourceGroup.count({ where: { projectId, id: { in: uniq } } });
  if (n !== uniq.length) throw new BadRequestError('Some groups do not belong to this project', 'WORK_BAD_GROUP');
  await prisma.$transaction(uniq.map((gid, i) => prisma.workResourceGroup.update({ where: { id: gid }, data: { rank: i } })));
  emit(projectId, userId, 'group');
  return listFor(ctx, projectId, {});
}

// ─── Nhập hàng loạt ──────────────────────────────────────────────

/**
 * Dán danh sách Markdown (`## Nhóm` + `- [Tiêu đề](url) mô tả #nhãn`) hoặc CSV (`title, url, group, tags`).
 * Link đã có trong dự án (cùng url) ⇒ bỏ qua. Tên nhóm khớp không phân biệt hoa thường/dấu; chưa có ⇒ tạo nhóm.
 * `dryRun` ⇒ chỉ báo sẽ thêm gì.
 */
export async function importResources(userId: number, projectId: number, input: { text: string; format?: 'auto' | 'markdown' | 'csv'; groupId?: number | null; dryRun?: boolean }) {
  await resCtx(userId, projectId, { edit: true });
  await ensureDefaultGroups(projectId);
  await assertGroup(projectId, input.groupId);
  const parsed = parseImport(input.text, input.format ?? 'auto');
  const { foldVi } = await import('./fold.js');
  const groups = await prisma.workResourceGroup.findMany({ where: { projectId }, select: { id: true, name: true } });
  const byName = new Map(groups.map((g) => [foldVi(g.name).trim(), g.id]));
  const existing = new Set((await prisma.workResource.findMany({ where: { projectId }, select: { url: true } })).map((r) => r.url));
  const plan: Array<{ line: number; title: string; url: string; group: string | null; tags: string[]; description: string | null; status: 'new' | 'duplicate' }> = [];
  const newGroups: string[] = [];
  for (const row of parsed.rows) {
    const dup = existing.has(row.url);
    if (!dup) existing.add(row.url);
    if (!dup && row.group && !byName.has(foldVi(row.group).trim()) && !newGroups.some((n) => foldVi(n).trim() === foldVi(row.group!).trim())) newGroups.push(row.group);
    plan.push({ line: row.line, title: row.title ?? titleFromUrl(row.url), url: row.url, group: row.group, tags: row.tags, description: row.description, status: dup ? 'duplicate' : 'new' });
  }
  const summary = { format: parsed.format, rows: plan, errors: parsed.errors, willCreate: plan.filter((p) => p.status === 'new').length, duplicates: plan.filter((p) => p.status === 'duplicate').length, newGroups };
  if (input.dryRun) return { ...summary, created: 0 };
  for (const name of newGroups) {
    const g = await createGroup(userId, projectId, { name });
    byName.set(foldVi(g.name).trim(), g.id);
  }
  const ranks = new Map<number | null, number>();
  let created = 0;
  for (const p of plan) {
    if (p.status !== 'new') continue;
    const gid = p.group ? byName.get(foldVi(p.group).trim()) ?? null : input.groupId ?? null;
    if (!ranks.has(gid)) ranks.set(gid, await nextRank(projectId, gid));
    const rank = ranks.get(gid)!;
    ranks.set(gid, rank + 1);
    await prisma.workResource.create({
      data: {
        projectId, groupId: gid, url: p.url, title: p.title.slice(0, RESOURCE_TITLE_MAX), description: p.description, tags: p.tags,
        kind: detectKind(p.url), faviconUrl: faviconFor(p.url), rank, createdById: userId,
      },
    });
    created += 1;
  }
  await auditProject(projectId, { actorId: userId, action: 'resource.import', targetType: 'project', targetId: projectId, summary: `Imported ${created} resource link${created === 1 ? '' : 's'} (${parsed.format})`, detail: { created, duplicates: summary.duplicates, errors: parsed.errors.length, newGroups } });
  emit(projectId, userId, 'imported');
  return { ...summary, created };
}

// ─── Gọi ra ngoài: chống SSRF ────────────────────────────────────

export type FetchError = 'DNS' | 'TIMEOUT' | 'NETWORK' | 'BLOCKED';

export class OutboundError extends Error {
  constructor(public readonly kind: FetchError, message: string) { super(message); }
}

interface TestHooks {
  fetch?: (url: string, init: RequestInit) => Promise<Response>;
  lookup?: (host: string) => Promise<Array<{ address: string }>>;
}
let hooks: TestHooks = {};
/** Test: thay fetch / phân giải DNS (máy test không có mạng, và server test nằm ở 127.0.0.1 — bị chặn đúng luật). */
export function _setResourceNetForTests(h: TestHooks | null): void {
  hooks = h ?? {};
  githubCache.clear();
}

const ALLOWED_PORTS = new Set(['', '80', '443', '8080', '8443']);

/** Kiểm MỘT chặng: giao thức, cổng, tên host, mọi IP mà tên miền trỏ tới. */
async function checkTarget(u: URL): Promise<void> {
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new OutboundError('BLOCKED', 'Only http(s) links can be fetched');
  if (!ALLOWED_PORTS.has(u.port)) throw new OutboundError('BLOCKED', `Port ${u.port} is not allowed`);
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (blockedHostname(host)) throw new OutboundError('BLOCKED', 'Internal addresses cannot be fetched');
  if (isIP(host)) {
    if (blockedAddress(host)) throw new OutboundError('BLOCKED', 'Internal addresses cannot be fetched');
    return;
  }
  let addrs: Array<{ address: string }>;
  try {
    addrs = hooks.lookup ? await hooks.lookup(host) : await lookup(host, { all: true });
  } catch {
    throw new OutboundError('DNS', `The domain ${host} does not resolve`);
  }
  if (!addrs.length) throw new OutboundError('DNS', `The domain ${host} does not resolve`);
  // MỌI địa chỉ phải sạch — không chọn được bản ghi nào sẽ được dùng.
  if (addrs.some((a) => blockedAddress(a.address))) throw new OutboundError('BLOCKED', 'This domain points to an internal address');
}

/**
 * fetch an toàn: kiểm từng chặng (redirect: manual, tối đa 4 lần), timeout, trần byte đọc thân. Trả status cuối +
 * thân (chữ) nếu `readBody`. Lỗi mạng ⇒ OutboundError (DNS/TIMEOUT/NETWORK/BLOCKED).
 */
export async function safeFetch(raw: string, opts: { method?: 'GET' | 'HEAD'; timeoutMs?: number; maxBytes?: number; headers?: Record<string, string>; readBody?: boolean } = {}) {
  let u: URL;
  try { u = new URL(raw); } catch { throw new OutboundError('BLOCKED', 'Not a valid URL'); }
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), opts.timeoutMs ?? 5000);
  try {
    let res: Response | null = null;
    for (let hop = 0; hop <= 4; hop++) {
      await checkTarget(u);
      const init: RequestInit = {
        method: opts.method ?? 'GET', redirect: 'manual', signal: ctl.signal,
        headers: { 'User-Agent': 'CTWork-LinkCheck/1.0 (+https://cuongthai.com/work)', Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.5', ...(opts.headers ?? {}) },
      };
      try {
        res = hooks.fetch ? await hooks.fetch(u.toString(), init) : await fetch(u.toString(), init);
      } catch (err) {
        if ((err as Error).name === 'AbortError') throw new OutboundError('TIMEOUT', 'The site took too long to answer');
        throw new OutboundError('NETWORK', 'Could not reach the site');
      }
      if (res.status < 300 || res.status >= 400) break;
      const loc = res.headers.get('location');
      if (!loc) break;
      void res.body?.cancel().catch(() => undefined);
      u = new URL(loc, u);
      if (hop === 4) throw new OutboundError('NETWORK', 'Too many redirects');
    }
    if (!res) throw new OutboundError('NETWORK', 'No response');
    let body: string | null = null;
    if (opts.readBody && opts.method !== 'HEAD' && res.body) {
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let bytes = 0;
      body = '';
      const max = opts.maxBytes ?? 256 * 1024;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        body += dec.decode(value, { stream: true });
        if (bytes >= max) { void reader.cancel().catch(() => undefined); break; }
      }
    } else {
      void res.body?.cancel().catch(() => undefined);
    }
    return { status: res.status, finalUrl: u.toString(), contentType: res.headers.get('content-type') ?? '', body };
  } catch (err) {
    if (err instanceof OutboundError) throw err;
    if ((err as Error).name === 'AbortError') throw new OutboundError('TIMEOUT', 'The site took too long to answer');
    throw new OutboundError('NETWORK', 'Could not reach the site');
  } finally {
    clearTimeout(timer);
  }
}

// ─── Xem trước GitHub ────────────────────────────────────────────

const GITHUB_TTL_MS = 6 * 3600_000;
const githubCache = new Map<string, { at: number; data: GithubMeta | null }>();

/** Metadata repo công khai: API GitHub (không khoá) ⇒ dự phòng bảng github_repos ⇒ null. Cache 6 giờ trong tiến trình. */
export async function githubMeta(owner: string, repo: string, force = false): Promise<GithubMeta | null> {
  const key = `${owner}/${repo}`.toLowerCase();
  const hit = githubCache.get(key);
  if (!force && hit && Date.now() - hit.at < GITHUB_TTL_MS) return hit.data;
  let data: GithubMeta | null = null;
  try {
    const r = await safeFetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
      timeoutMs: 5000, readBody: true, maxBytes: 512 * 1024, headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    });
    if (r.status === 200 && r.body) {
      const j = JSON.parse(r.body) as { full_name?: string; stargazers_count?: number; pushed_at?: string | null; description?: string | null; default_branch?: string | null; language?: string | null };
      data = {
        fullName: j.full_name ?? `${owner}/${repo}`, stars: Number(j.stargazers_count ?? 0), lastCommitAt: j.pushed_at ?? null,
        description: j.description ?? null, defaultBranch: j.default_branch ?? null, language: j.language ?? null, source: 'api',
      };
    }
  } catch (err) {
    logger.debug?.('[work] github preview lỗi', { repo: key, err: (err as Error).message });
  }
  if (!data) {
    // Bảng github_repos (trang /repos của web) — có sẵn sao + mô tả + lần push cuối cho repo đã đăng.
    const row = await prisma.githubRepo.findFirst({
      where: { owner: { equals: owner, mode: 'insensitive' }, repoName: { equals: repo, mode: 'insensitive' } },
      select: { owner: true, repoName: true, stars: true, pushedAt: true, description: true, language: true },
    }).catch(() => null);
    if (row) data = { fullName: `${row.owner}/${row.repoName}`, stars: row.stars, lastCommitAt: row.pushedAt?.toISOString() ?? null, description: row.description, defaultBranch: null, language: row.language, source: 'catalog' };
  }
  githubCache.set(key, { at: Date.now(), data });
  return data;
}

/** Gắn metadata GitHub vào meta.github của một link (lỗi ⇒ bỏ qua, giữ bản cũ). */
export async function refreshGithubMeta(resourceId: number, force = false): Promise<void> {
  const r = await prisma.workResource.findUnique({ where: { id: resourceId }, select: { url: true, meta: true } });
  if (!r) return;
  const gh = githubRepoOf(r.url);
  if (!gh) return;
  const data = await githubMeta(gh.owner, gh.repo, force);
  if (!data) return;
  await prisma.workResource.update({ where: { id: resourceId }, data: { meta: { ...metaOf(r), github: { ...data, fetchedAt: new Date().toISOString() } } as Prisma.InputJsonValue } }).catch(() => undefined);
}

/** Nút "Refresh preview" (GitHub) — người thêm link được. */
export async function refreshResource(userId: number, projectId: number, id: number) {
  const ctx = await resCtx(userId, projectId, { edit: true });
  const r = await findRes(ctx, projectId, id);
  if (r.kind === 'github') await refreshGithubMeta(r.id, true);
  return presentOne(ctx, projectId, await findRes(ctx, projectId, id));
}

// ─── "Add link": tự điền tiêu đề ────────────────────────────────

/**
 * Dán URL ⇒ tiêu đề + mô tả (GitHub: owner/repo + mô tả repo; trang khác: OpenGraph/<title>). Địa chỉ nội bộ ⇒
 * 400 WORK_URL_BLOCKED. Trang không trả lời ⇒ tiêu đề dự phòng từ URL (`fetched: false`) — không lỗi.
 */
export async function previewUrl(userId: number, projectId: number, raw: string) {
  await resCtx(userId, projectId, { edit: true });
  const url = cleanUrl(raw);
  const base = { url, kind: detectKind(url), faviconUrl: faviconFor(url), duplicateOf: null as null | { id: number; title: string } };
  const dup = await prisma.workResource.findFirst({ where: { projectId, url }, select: { id: true, title: true } });
  base.duplicateOf = dup;
  if (!/^https?:/i.test(url)) return { ...base, title: titleFromUrl(url), description: null, fetched: false, github: null };
  const gh = githubRepoOf(url);
  if (gh) {
    const meta = await githubMeta(gh.owner, gh.repo);
    return { ...base, title: meta?.fullName ?? `${gh.owner}/${gh.repo}`, description: meta?.description ?? null, fetched: !!meta, github: meta };
  }
  try {
    const r = await safeFetch(url, { readBody: true, maxBytes: 256 * 1024 });
    const info = /html|xml/i.test(r.contentType) && r.body ? extractPageInfo(r.body) : { title: null, description: null, siteName: null };
    return { ...base, title: info.title ?? titleFromUrl(url), description: info.description, fetched: !!info.title, github: null };
  } catch (err) {
    if (err instanceof OutboundError && err.kind === 'BLOCKED') throw new AppError(err.message, 400, 'WORK_URL_BLOCKED');
    return { ...base, title: titleFromUrl(url), description: null, fetched: false, github: null };
  }
}

// ─── Kiểm link chết (cron hằng tuần) ─────────────────────────────

/** Một link: HEAD trước (rẻ), máy chủ không nhận HEAD / lỗi lạ ⇒ GET (đọc tối đa 16 KB). */
export async function checkLink(url: string): Promise<{ status?: number; error?: FetchError }> {
  try {
    const h = await safeFetch(url, { method: 'HEAD', timeoutMs: 5000 });
    if (h.status < 400 || h.status === 404 || h.status === 410) return { status: h.status };
  } catch (err) {
    if (err instanceof OutboundError && (err.kind === 'BLOCKED' || err.kind === 'DNS')) return { error: err.kind };
  }
  try {
    const g = await safeFetch(url, { method: 'GET', timeoutMs: 8000, readBody: true, maxBytes: 16 * 1024 });
    return { status: g.status };
  } catch (err) {
    return { error: err instanceof OutboundError ? err.kind : 'NETWORK' };
  }
}

/** Người "gửi" thông báo (chuông bỏ qua tự-báo-cho-mình): lead dự án, ADMIN dự án, chủ không gian — khác người nhận. */
async function senderFor(projectId: number, receiver: number): Promise<number | null> {
  const p = await prisma.workProject.findUnique({
    where: { id: projectId },
    select: {
      leadId: true,
      members: { where: { role: 'ADMIN' }, select: { userId: true } },
      workspace: { select: { members: { where: { role: { in: ['OWNER', 'ADMIN'] } }, select: { userId: true } } } },
    },
  });
  const cands = [p?.leadId ?? null, ...(p?.members.map((m) => m.userId) ?? []), ...(p?.workspace.members.map((m) => m.userId) ?? [])];
  return cands.find((u): u is number => !!u && u !== receiver) ?? null;
}

/**
 * Cron hằng tuần: kiểm tối đa N link (lâu chưa kiểm nhất trước) của dự án bật mô-đun. Link vừa chuyển sang
 * BROKEN ⇒ báo người tạo (chuông + email theo cài đặt) ĐÚNG MỘT LẦN cho lần hỏng đó. Không gọi LLM.
 */
export async function runLinkChecks(opts: { limit?: number; now?: Date; projectId?: number } = {}): Promise<{ checked: number; broken: number; notified: number }> {
  const out = { checked: 0, broken: 0, notified: 0 };
  if (process.env.WORK_LINK_CHECK_ENABLED === 'false') return out;
  const limit = Math.max(1, Math.min(opts.limit ?? (Number(process.env.WORK_LINK_CHECK_LIMIT) || 200), 2000));
  const now = opts.now ?? new Date();
  const stale = new Date(now.getTime() - 6 * 24 * 3600_000);
  const rows = await prisma.workResource.findMany({
    where: {
      ...(opts.projectId ? { projectId: opts.projectId } : {}),
      url: { startsWith: 'http' },
      OR: [{ checkedAt: null }, { checkedAt: { lt: stale } }],
      project: { deletedAt: null, archivedAt: null, workspace: { deletedAt: null } },
    },
    orderBy: [{ checkedAt: { sort: 'asc', nulls: 'first' } }, { id: 'asc' }],
    take: limit * 3,
    select: {
      id: true, url: true, kind: true, title: true, linkStatus: true, createdById: true, meta: true,
      project: { select: { id: true, key: true, settings: true, workspace: { select: { slug: true } } } },
    },
  });
  const todo = rows.filter((r) => modulesOf(r.project.settings).resources).slice(0, limit);
  const { notifyWork } = await import('./notify.js');
  for (const r of todo) {
    try {
      const res = await checkLink(r.url);
      const status = linkStatusFrom(res, r.kind);
      const meta = { ...metaOf(r), check: { status: res.status ?? null, error: res.error ?? null, at: now.toISOString() } };
      await prisma.workResource.update({ where: { id: r.id }, data: { linkStatus: status, checkedAt: now, meta: meta as Prisma.InputJsonValue } });
      out.checked += 1;
      if (status === 'BROKEN') out.broken += 1;
      if (status === 'BROKEN' && r.linkStatus !== 'BROKEN' && r.createdById) {
        const sender = await senderFor(r.project.id, r.createdById);
        const why = res.error === 'DNS' ? 'the domain no longer exists' : `HTTP ${res.status}`;
        const payload = {
          issueKey: `${r.project.key} · Resources`, title: r.title,
          message: `Broken link: ${r.title} (${why})`.slice(0, 200),
          url: `/work/${r.project.workspace.slug}/${r.project.key}/resources?status=BROKEN`,
        };
        if (sender) {
          await notifyWork({ receiverId: r.createdById, senderId: sender, type: 'WORK_ALERT', entityId: r.id, payload });
          out.notified += 1;
        }
      }
      if (r.kind === 'github') {
        const gh = (metaOf(r).github ?? null) as { fetchedAt?: string } | null;
        if (!gh?.fetchedAt || now.getTime() - Date.parse(gh.fetchedAt) > GITHUB_TTL_MS) await refreshGithubMeta(r.id);
      }
    } catch (err) {
      logger.warn('[work] kiểm link lỗi', { resourceId: r.id, err: (err as Error).message });
    }
  }
  return out;
}

/** "Check links now" (ADMIN dự án) — chạy ngay cho dự án này, tối đa 50 link chưa kiểm/lâu chưa kiểm. */
export async function checkProjectLinks(userId: number, projectId: number) {
  await resCtx(userId, projectId, { manage: true });
  const r = await runLinkChecks({ projectId, limit: 50, now: new Date(Date.now() + 7 * 24 * 3600_000) });
  emit(projectId, userId, 'checked');
  return r;
}

// ─── Cổng khách ──────────────────────────────────────────────────

/**
 * /portal/resources: khách (hoặc nhân viên "Preview as client") thấy link visibility=CLIENT. Cổng khách phải bật
 * (như mọi tab cổng); mô-đun resources tắt ⇒ rỗng (`enabled: false`), không lỗi.
 */
export async function portalResources(userId: number, projectId: number, opts: { asClient?: boolean } = {}) {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'clientPortal');
  if (!access.modules.resources) return { enabled: false, groups: [], items: [] };
  const clientView = isClientScoped(access) || opts.asClient === true;
  // Tab này là "khách thấy gì": nhân viên (kể cả không Preview) cũng chỉ thấy link CLIENT, không số liệu nội bộ.
  const list = await listFor({ access, userId, ra: { view: 'CLIENT', edit: false, manage: false } }, projectId, {});
  return { enabled: true, staffView: !clientView, groups: list.groups, items: list.items, ungrouped: list.ungrouped };
}

export async function portalOpenResource(userId: number, projectId: number, id: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'clientPortal');
  assertModule(access, 'resources');
  const r = await prisma.workResource.findFirst({ where: { id, projectId, visibility: 'CLIENT' }, select: { id: true, url: true } });
  if (!r) throw new NotFoundError('Resource not found');
  await prisma.workResource.update({ where: { id: r.id }, data: { openCount: { increment: 1 }, lastOpenedAt: new Date() } });
  return r;
}

// ─── Web links trên thẻ ──────────────────────────────────────────

async function issueOf(ctx: ResCtx, projectId: number, number: number) {
  const i = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, number: true, clientVisible: true } });
  if (!i) throw new NotFoundError('Issue not found');
  // Khách không bị cách ly (dự án không bật cổng) vẫn thấy thẻ; người bị hạn chế chỉ thấy link trỏ tới resource CLIENT.
  return i;
}

const WEB_LINK_SELECT = {
  id: true, url: true, title: true, resourceId: true, createdById: true, createdAt: true,
  resource: { select: { id: true, title: true, url: true, kind: true, faviconUrl: true, visibility: true } },
} satisfies Prisma.WorkIssueWebLinkSelect;

export async function listWebLinks(userId: number, projectId: number, number: number) {
  const ctx = await resCtx(userId, projectId);
  const i = await issueOf(ctx, projectId, number);
  const rows = await prisma.workIssueWebLink.findMany({ where: { issueId: i.id }, orderBy: { id: 'asc' }, select: WEB_LINK_SELECT });
  const canEdit = can(ctx.access.role, 'issue.edit', ctx.access.options) && ctx.ra.edit;
  const items = rows
    .filter((r) => ctx.ra.view === 'ALL' || r.resource?.visibility === 'CLIENT')
    .map((r) => {
      const url = r.resource?.url ?? r.url;
      return {
        id: r.id, resourceId: r.resourceId, title: r.resource?.title ?? r.title, url, kind: r.resource?.kind ?? detectKind(url),
        faviconUrl: r.resource?.faviconUrl ?? faviconFor(url), inResources: !!r.resourceId, createdAt: r.createdAt,
        canDelete: canEdit,
      };
    });
  return { items, canEdit };
}

export async function addWebLink(userId: number, projectId: number, number: number, input: { resourceId?: number | null; url?: string | null; title?: string | null }) {
  const ctx = await resCtx(userId, projectId, { edit: true });
  if (!can(ctx.access.role, 'issue.edit', ctx.access.options)) throw new ForbiddenError('You cannot edit issues in this project');
  const i = await issueOf(ctx, projectId, number);
  let data: { resourceId: number | null; url: string; title: string };
  if (input.resourceId) {
    const r = await prisma.workResource.findFirst({ where: { id: input.resourceId, projectId }, select: { id: true, url: true, title: true } });
    if (!r) throw new BadRequestError('That resource does not belong to this project', 'WORK_BAD_RESOURCE');
    if (await prisma.workIssueWebLink.count({ where: { issueId: i.id, resourceId: r.id } })) throw new AppError('This link is already on the issue', 409, 'WORK_WEB_LINK_DUPLICATE');
    data = { resourceId: r.id, url: r.url, title: r.title };
  } else {
    if (!input.url) throw new BadRequestError('Choose a resource or enter a URL', 'VALIDATION_ERROR');
    const url = cleanUrl(input.url);
    if (await prisma.workIssueWebLink.count({ where: { issueId: i.id, url } })) throw new AppError('This link is already on the issue', 409, 'WORK_WEB_LINK_DUPLICATE');
    // Đã có trong Resources (cùng url) ⇒ trỏ luôn vào đó.
    const hit = await prisma.workResource.findFirst({ where: { projectId, url }, select: { id: true, title: true } });
    data = { resourceId: hit?.id ?? null, url, title: (input.title?.trim() || hit?.title || titleFromUrl(url)).slice(0, RESOURCE_TITLE_MAX) };
  }
  await prisma.workIssueWebLink.create({ data: { issueId: i.id, ...data, createdById: userId } });
  await prisma.workHistory.create({ data: { issueId: i.id, actorId: userId, actorKind: 'USER', field: 'webLink', fromValue: null, toValue: data.title.slice(0, 2000) } }).catch(() => undefined);
  emit(projectId, userId, 'weblinks', { issueNumber: i.number });
  return listWebLinks(userId, projectId, number);
}

export async function deleteWebLink(userId: number, projectId: number, number: number, linkId: number) {
  const ctx = await resCtx(userId, projectId, { edit: true });
  if (!can(ctx.access.role, 'issue.edit', ctx.access.options)) throw new ForbiddenError('You cannot edit issues in this project');
  const i = await issueOf(ctx, projectId, number);
  const l = await prisma.workIssueWebLink.findFirst({ where: { id: linkId, issueId: i.id }, select: { id: true, title: true } });
  if (!l) throw new NotFoundError('Link not found');
  await prisma.workIssueWebLink.delete({ where: { id: l.id } });
  await prisma.workHistory.create({ data: { issueId: i.id, actorId: userId, actorKind: 'USER', field: 'webLink', fromValue: l.title.slice(0, 2000), toValue: null } }).catch(() => undefined);
  emit(projectId, userId, 'weblinks', { issueNumber: i.number });
  return listWebLinks(userId, projectId, number);
}

/** "Save to Resources": link gõ thẳng trên thẻ ⇒ thành một Resource (nhóm tuỳ chọn) và thẻ trỏ vào nó. */
export async function saveWebLinkToResources(userId: number, projectId: number, number: number, linkId: number, input: { groupId?: number | null; tags?: string[] }) {
  const ctx = await resCtx(userId, projectId, { edit: true });
  const i = await issueOf(ctx, projectId, number);
  const l = await prisma.workIssueWebLink.findFirst({ where: { id: linkId, issueId: i.id } });
  if (!l) throw new NotFoundError('Link not found');
  if (l.resourceId) return { resourceId: l.resourceId, created: false };
  const hit = await prisma.workResource.findFirst({ where: { projectId, url: l.url }, select: { id: true } });
  let resourceId = hit?.id;
  if (!resourceId) {
    const r = await createResource(userId, projectId, { url: l.url, title: l.title, groupId: input.groupId ?? null, tags: input.tags });
    resourceId = r.id;
  }
  await prisma.workIssueWebLink.update({ where: { id: l.id }, data: { resourceId } });
  emit(projectId, userId, 'weblinks', { issueNumber: i.number });
  return { resourceId, created: !hit };
}
