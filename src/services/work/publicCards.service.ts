/**
 * CT Work UX-D (09/10/2026) — dữ liệu RÚT GỌN cho ảnh xem trước link (Open Graph) và trang mời.
 *
 * Người dùng gửi link mời qua Messenger, ô xem trước hiện ảnh CHUNG của cả site ⇒ người nhận tưởng link rác.
 * Các hàm ở đây trả ĐÚNG những gì ô xem trước được phép lộ — không hơn:
 *
 *   inviteCard     tên workspace (+ logo), tên dự án + bìa/màu/emoji, tên + ảnh người mời, số thành viên (người,
 *                  không tính AI agent) — đúng những gì lời mời Slack/Notion vẫn hiện. KHÔNG email (kể cả việc lời
 *                  mời có gắn email hay không), không vai trò. Token sai / hết hạn / hết lượt / bị thu hồi ⇒ CÙNG một
 *                  `{ status: 'UNAVAILABLE' }` (không dò được token nào từng tồn tại).
 *   shareCard      link công khai chỉ đọc: tên dự án + workspace, bìa, % tiến độ và sprint hiện tại — chỉ khi link
 *                  vốn cho xem board/backlog/reports (thứ người cầm link đã thấy). Không tăng lượt xem.
 *   workspaceCard  trang /work/** cần đăng nhập: CHỈ tên + logo workspace (ô xem trước ghi "Sign in to view").
 *   portalCard     cổng khách: tên + logo workspace + màu dự án — KHÔNG tên dự án (trang cần đăng nhập).
 *
 * Tất cả gọi qua tuyến công khai có rate-limit riêng (work.uxd.routes.ts).
 */

import { prisma } from '../../config/database.js';
import { displayName, sha256 } from './common.js';
import { modulesOf } from './studio.js';
import { clampCoverY } from './covers.js';

const UNAVAILABLE = { status: 'UNAVAILABLE' as const };
const HUMAN = { NOT: { user: { kind: 'AGENT' } } } as const;

const brandOf = (p: { key: string; name: string; coverUrl: string | null; coverPositionY: number | null; color: string | null; iconEmoji: string | null; avatarUrl: string | null }) => ({
  key: p.key, name: p.name, coverUrl: p.coverUrl, coverPositionY: clampCoverY(p.coverPositionY ?? 50), color: p.color, iconEmoji: p.iconEmoji, avatarUrl: p.avatarUrl,
});
const BRAND_SELECT = { key: true, name: true, coverUrl: true, coverPositionY: true, color: true, iconEmoji: true, avatarUrl: true, deletedAt: true } as const;

export type InviteCard =
  | typeof UNAVAILABLE
  | {
      status: 'VALID';
      workspace: { name: string; logoUrl: string | null };
      project: ReturnType<typeof brandOf> | null;
      inviter: { name: string; avatarUrl: string | null } | null;
      memberCount: number;
    };

/** Phần thẻ của một lời mời ĐÃ biết là dùng được (previewInvite gọi lại để trang mời hiện cùng dữ liệu). */
export async function inviteCardOf(invite: { workspaceId: number; projectId: number | null; invitedById: number; workspace: { name: string } }): Promise<InviteCard> {
  const [ws, project, inviter] = await Promise.all([
    prisma.workSpace.findUnique({ where: { id: invite.workspaceId }, select: { logoUrl: true } }),
    invite.projectId ? prisma.workProject.findUnique({ where: { id: invite.projectId }, select: BRAND_SELECT }) : null,
    prisma.user.findUnique({ where: { id: invite.invitedById }, select: { username: true, fullName: true, displayName: true, avatarUrl: true } }),
  ]);
  if (invite.projectId && (!project || project.deletedAt)) return UNAVAILABLE;
  const memberCount = project
    ? await prisma.workProjectMember.count({ where: { projectId: invite.projectId!, ...HUMAN } })
    : await prisma.workMember.count({ where: { workspaceId: invite.workspaceId, ...HUMAN } });
  return {
    status: 'VALID',
    workspace: { name: invite.workspace.name, logoUrl: ws?.logoUrl ?? null },
    project: project ? brandOf(project) : null,
    inviter: inviter ? { name: displayName(inviter), avatarUrl: inviter.avatarUrl } : null,
    memberCount,
  };
}

export async function inviteCard(token: string): Promise<InviteCard> {
  if (!token || token.length > 200) return UNAVAILABLE;
  const invite = await prisma.workInvite.findUnique({
    where: { tokenHash: sha256(token) },
    select: { workspaceId: true, projectId: true, invitedById: true, maxUses: true, usedCount: true, expiresAt: true, revokedAt: true, workspace: { select: { name: true, deletedAt: true } } },
  });
  if (!invite || invite.revokedAt || invite.workspace.deletedAt || invite.expiresAt < new Date() || invite.usedCount >= invite.maxUses) return UNAVAILABLE;
  return inviteCardOf(invite);
}

export async function shareCard(token: string) {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return UNAVAILABLE;
  const link = await prisma.workPublicLink.findUnique({
    where: { token },
    select: { revokedAt: true, expiresAt: true, options: true, project: { select: { id: true, type: true, settings: true, archivedAt: true, ...BRAND_SELECT, workspace: { select: { name: true, logoUrl: true, deletedAt: true } } } } },
  });
  if (!link || link.revokedAt || (link.expiresAt && link.expiresAt < new Date()) || link.project.deletedAt || link.project.workspace.deletedAt) return UNAVAILABLE;
  const p = link.project;
  const o = { board: true, backlog: true, reports: true, tests: true, ...(link.options as Record<string, boolean>) };
  const seesIssues = !!(o.board || o.backlog || o.reports);
  // Cổng khách bật ⇒ link công khai chỉ thấy thẻ ĐÃ chia sẻ (share.service) — tiến độ cũng chỉ tính trên đó.
  const shared = modulesOf(p.settings).clientPortal ? { clientVisible: true } : {};
  let progress: { percent: number; done: number; total: number } | null = null;
  let sprint: { name: string; endAt: Date | null } | null = null;
  if (seesIssues) {
    const where = { projectId: p.id, deletedAt: null, type: { level: { gte: 0 } }, ...shared };
    const [total, done] = await Promise.all([prisma.workIssue.count({ where }), prisma.workIssue.count({ where: { ...where, resolvedAt: { not: null } } })]);
    progress = total ? { percent: Math.round((done / total) * 100), done, total } : null;
  }
  if (o.board || o.backlog) {
    const s = await prisma.workSprint.findFirst({ where: { projectId: p.id, state: 'ACTIVE' }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { name: true, endAt: true } });
    sprint = s ? { name: s.name, endAt: s.endAt } : null;
  }
  return {
    status: 'VALID' as const,
    workspace: { name: p.workspace.name, logoUrl: p.workspace.logoUrl },
    project: { ...brandOf(p), archived: !!p.archivedAt },
    progress, sprint,
  };
}

export async function workspaceCard(slug: string) {
  if (!/^[a-z0-9-]{1,60}$/i.test(slug)) return UNAVAILABLE;
  const ws = await prisma.workSpace.findFirst({ where: { slug, deletedAt: null }, select: { name: true, logoUrl: true } });
  return ws ? { status: 'VALID' as const, workspace: ws } : UNAVAILABLE;
}

export async function portalCard(slug: string, key: string) {
  if (!/^[a-z0-9-]{1,60}$/i.test(slug) || !/^[A-Za-z0-9]{1,10}$/.test(key)) return UNAVAILABLE;
  const p = await prisma.workProject.findFirst({
    where: { key: key.toUpperCase(), deletedAt: null, workspace: { slug, deletedAt: null } },
    select: { color: true, workspace: { select: { name: true, logoUrl: true } } },
  });
  // Dự án không tồn tại ⇒ thẻ workspace trơn. Không trả cờ "có bật cổng khách" (không cho dò dự án nào có cổng).
  if (!p) return workspaceCard(slug);
  return { status: 'VALID' as const, workspace: p.workspace, color: p.color };
}
