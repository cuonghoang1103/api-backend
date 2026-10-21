/**
 * CT Work — Bảng tin: tầng ĐỌC DB của quyền (luật thuần ở feedRules.ts). Một chỗ cho REST, socket, MCP.
 *
 *   feedScopesFor(userId)            mọi phạm vi người này ĐỌC được (bảng tin gộp, socket, bộ lọc, chọn nơi đăng)
 *   accessFor(userId, wsId, pid?)    quyền trên MỘT phạm vi (đọc/đăng/quản trị) — không thấy ⇒ NO_ACCESS
 *   scopeReaders(wsId, pid?)         những NGƯỜI đọc được một phạm vi (thông báo, @nhắc) — không khách, không agent
 *
 * Agent ⇒ `assertFeedPerson` ném 403 WORK_AGENT_FORBIDDEN ở cửa mọi lệnh. Không gian ép 2FA mà phiên chưa đạt ⇒ phạm vi
 * đó bị BỎ khỏi danh sách gộp (gatedWorkspaceIds), còn lệnh trên đúng phạm vi đó ném 403 như mọi tuyến CT Work.
 */

import { prisma } from '../../config/database.js';
import { PUBLIC_USER, type PublicUser } from './common.js';
import type { ProjectRole, ProjectVisibility, WorkspaceRole } from './constants.js';
import { feedProjectAccess, feedWorkspaceAccess, NO_ACCESS, type FeedAccess } from './feedRules.js';
import {
  agentForbidden, effectiveProjectRole, effectiveWorkspaceRole, loadProjectAccess, loadWorkspaceAccess, portalOnlyUserIds,
  portalOnlyWorkspaceIds, principalOf,
} from './permissions.js';
import { gatedWorkspaceIds } from './twoFactor.js';

export interface WsScope {
  id: number; slug: string; name: string; logoUrl: string | null;
  role: WorkspaceRole; access: FeedAccess;
}
export interface ProjectScope {
  id: number; key: string; name: string; workspaceId: number;
  role: ProjectRole; access: FeedAccess;
}
export interface FeedScopes {
  userId: number;
  /** Không gian đọc được bảng tin cấp không gian. */
  workspaces: Map<number, WsScope>;
  /** Dự án đọc được bảng tin dự án. */
  projects: Map<number, ProjectScope>;
  /** Mọi không gian người này có mặt (kể cả khi chỉ đọc được bảng tin dự án) — tên/slug cho thẻ bài. */
  wsInfo: Map<number, { id: number; slug: string; name: string; logoUrl: string | null }>;
}

/** Cửa vào mọi lệnh bảng tin: agent ⇒ 403. */
export async function assertFeedPerson(userId: number): Promise<void> {
  if ((await principalOf(userId)) === 'AGENT') throw await agentForbidden(userId, 'use the team feed');
}

export async function feedScopesFor(userId: number): Promise<FeedScopes> {
  const out: FeedScopes = { userId, workspaces: new Map(), projects: new Map(), wsInfo: new Map() };
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { kind: true } });
  if (!u || u.kind === 'AGENT') return out;
  const gated = new Set(gatedWorkspaceIds(userId));
  const [members, portalOnly] = await Promise.all([
    prisma.workMember.findMany({
      where: { userId, workspace: { deletedAt: null } },
      select: { role: true, workspace: { select: { id: true, slug: true, name: true, logoUrl: true } } },
    }),
    portalOnlyWorkspaceIds(userId),
  ]);
  const roles = new Map<number, WorkspaceRole>();
  for (const m of members) {
    const ws = m.workspace;
    if (gated.has(ws.id) || portalOnly.has(ws.id)) continue;
    const role = effectiveWorkspaceRole(m.role as WorkspaceRole, false);
    roles.set(ws.id, role);
    out.wsInfo.set(ws.id, ws);
    const access = feedWorkspaceAccess({ role, principal: 'HUMAN', portalOnly: false });
    if (access.read) out.workspaces.set(ws.id, { ...ws, role, access });
  }
  if (!roles.size) return out;
  const projects = await prisma.workProject.findMany({
    where: { workspaceId: { in: [...roles.keys()] }, deletedAt: null },
    select: { id: true, key: true, name: true, workspaceId: true, visibility: true, members: { where: { userId }, select: { role: true } } },
    orderBy: [{ workspaceId: 'asc' }, { name: 'asc' }],
  });
  for (const p of projects) {
    const role = effectiveProjectRole({
      workspaceRole: roles.get(p.workspaceId) ?? null,
      projectRole: (p.members[0]?.role ?? null) as ProjectRole | null,
      visibility: p.visibility as ProjectVisibility,
    });
    const access = feedProjectAccess({ role, principal: 'HUMAN' });
    if (access.read && role) out.projects.set(p.id, { id: p.id, key: p.key, name: p.name, workspaceId: p.workspaceId, role, access });
  }
  return out;
}

/** Quyền trên MỘT phạm vi (ném 403 cổng 2FA như mọi tuyến; người lạ/khách/agent ⇒ NO_ACCESS). */
export async function accessFor(userId: number, workspaceId: number, projectId: number | null): Promise<{ access: FeedAccess; role: string | null }> {
  if (projectId) {
    const a = await loadProjectAccess(userId, projectId);
    if (!a || a.workspaceId !== workspaceId) return { access: NO_ACCESS, role: null };
    return { access: feedProjectAccess({ role: a.role, principal: a.principal }), role: a.role };
  }
  const wa = await loadWorkspaceAccess(userId, workspaceId);
  if (!wa) return { access: NO_ACCESS, role: null };
  const portalOnly = (await portalOnlyWorkspaceIds(userId, workspaceId)).has(workspaceId);
  return { access: feedWorkspaceAccess({ role: wa.role, principal: wa.principal, portalOnly }), role: wa.role };
}

export type Reader = PublicUser;

/** Người đọc được một phạm vi (cho thông báo + @nhắc): không khách cổng / vai CLIENT, không agent. */
export async function scopeReaders(workspaceId: number, projectId: number | null): Promise<Reader[]> {
  if (projectId) {
    const { projectMembers } = await import('./projects.service.js');
    const rows = await projectMembers(projectId);
    return rows.filter((m) => m.role !== 'CLIENT' && m.kind !== 'AGENT').map(({ role: _r, explicit: _e, ...u }) => u as Reader);
  }
  const [members, portalOnly] = await Promise.all([
    prisma.workMember.findMany({ where: { workspaceId, workspace: { deletedAt: null } }, select: { user: { select: PUBLIC_USER } } }),
    portalOnlyUserIds(workspaceId),
  ]);
  return members.map((m) => m.user as Reader).filter((u) => u.kind !== 'AGENT' && !portalOnly.has(u.id));
}

/** Vai của tác giả trong phạm vi bài (chip trên thẻ bài). Một lượt cho cả trang. */
export async function authorRoles(posts: Array<{ workspaceId: number; projectId: number | null; authorId: number; projectVisibility?: string | null }>): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (!posts.length) return out;
  const wsIds = [...new Set(posts.map((p) => p.workspaceId))];
  const authorIds = [...new Set(posts.map((p) => p.authorId))];
  const projIds = [...new Set(posts.map((p) => p.projectId).filter((x): x is number => !!x))];
  const [wm, pm] = await Promise.all([
    prisma.workMember.findMany({ where: { workspaceId: { in: wsIds }, userId: { in: authorIds } }, select: { workspaceId: true, userId: true, role: true } }),
    projIds.length ? prisma.workProjectMember.findMany({ where: { projectId: { in: projIds }, userId: { in: authorIds } }, select: { projectId: true, userId: true, role: true } }) : [],
  ]);
  const wr = new Map(wm.map((m) => [`${m.workspaceId}:${m.userId}`, m.role as WorkspaceRole]));
  const pr = new Map(pm.map((m) => [`${m.projectId}:${m.userId}`, m.role as ProjectRole]));
  for (const p of posts) {
    const ws = wr.get(`${p.workspaceId}:${p.authorId}`) ?? null;
    if (!p.projectId) { if (ws) out.set(`${p.workspaceId}:0:${p.authorId}`, ws); continue; }
    const role = effectiveProjectRole({ workspaceRole: ws, projectRole: pr.get(`${p.projectId}:${p.authorId}`) ?? null, visibility: (p.projectVisibility ?? 'WORKSPACE') as ProjectVisibility });
    if (role) out.set(`${p.workspaceId}:${p.projectId}:${p.authorId}`, role);
  }
  return out;
}
