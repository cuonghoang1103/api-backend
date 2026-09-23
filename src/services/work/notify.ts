/**
 * CT Work — thông báo trong web (chuông) cho các sự kiện của dự án.
 *
 * Nghe bus sự kiện (events.ts) thay vì được gọi rải rác từ route: thay đổi
 * đến từ web, từ trợ lý AI hay từ luật tự động đều sinh đúng một thông báo.
 *
 * Luật chống spam:
 *   - Không bao giờ tự báo cho chính mình (pushNotification đã chặn).
 *   - Người được @nhắc trong một bình luận nhận WORK_MENTION, KHÔNG nhận
 *     thêm WORK_COMMENT cho cùng bình luận đó.
 *   - Thay đổi do SYSTEM/AUTOMATION không có người gửi ⇒ bỏ qua ở đợt này
 *     (chuông cần một người gửi; đợt 6 thêm thông báo hệ thống).
 */

import { prisma } from '../../config/database.js';
import { notifyWork } from '../notification.service.js';
import { logger } from '../../utils/logger.js';
import { onWorkEvent } from './events.js';

interface IssueRef {
  issueKey: string;
  title: string;
  url: string;
  projectId: number;
}

async function issueRef(issueId: number): Promise<IssueRef | null> {
  const i = await prisma.workIssue.findUnique({
    where: { id: issueId },
    select: { number: true, title: true, projectId: true, project: { select: { key: true, workspace: { select: { slug: true } } } } },
  });
  if (!i) return null;
  const issueKey = `${i.project.key}-${i.number}`;
  return { issueKey, title: i.title, projectId: i.projectId, url: `/work/${i.project.workspace.slug}/${i.project.key}/issue/${i.number}` };
}

/** Lấy id người được @nhắc trong JSON TipTap (node `mention`, attrs.id = userId). */
export function mentionedUserIds(doc: unknown): number[] {
  const ids = new Set<number>();
  const walk = (n: unknown) => {
    if (!n || typeof n !== 'object') return;
    const node = n as { type?: string; attrs?: { id?: unknown }; content?: unknown[] };
    if (node.type === 'mention') {
      const id = Number(node.attrs?.id);
      if (Number.isInteger(id) && id > 0) ids.add(id);
    }
    if (Array.isArray(node.content)) node.content.forEach(walk);
  };
  walk(doc);
  return [...ids];
}

/** Chỉ báo cho người còn quyền xem dự án — người đã rời nhóm không nhận tin nữa. */
async function canStillSee(userIds: number[], projectId: number): Promise<number[]> {
  if (!userIds.length) return [];
  const project = await prisma.workProject.findUnique({ where: { id: projectId }, select: { workspaceId: true, visibility: true } });
  if (!project) return [];
  const [wsMembers, projMembers] = await Promise.all([
    prisma.workMember.findMany({ where: { workspaceId: project.workspaceId, userId: { in: userIds } }, select: { userId: true, role: true } }),
    prisma.workProjectMember.findMany({ where: { projectId, userId: { in: userIds } }, select: { userId: true } }),
  ]);
  const explicit = new Set(projMembers.map((m) => m.userId));
  return wsMembers
    .filter((m) => m.role === 'OWNER' || m.role === 'ADMIN' || explicit.has(m.userId) || (m.role === 'MEMBER' && project.visibility === 'WORKSPACE'))
    .map((m) => m.userId);
}

export async function notifyWorkInvite(receiverId: number, senderId: number, workspaceId: number, name: string, slug: string) {
  await notifyWork({
    receiverId, senderId, type: 'WORK_INVITE', entityId: workspaceId,
    payload: { workspaceName: name, url: `/work/${slug}` },
  });
}

let registered = false;

/** Gọi một lần lúc khởi động (work.routes.ts import). */
export function registerWorkNotifications(): void {
  if (registered) return;
  registered = true;

  onWorkEvent(async (e) => {
    if (e.actor.userId === null) return;
    const sender = e.actor.userId;

    if (e.type === 'issue.created' || e.type === 'issue.updated') {
      let assignee: number | null = null;
      if (e.type === 'issue.updated') {
        const ch = e.changes.find((c) => c.field === 'assigneeId');
        if (ch?.to) assignee = Number(ch.to);
      } else {
        const i = await prisma.workIssue.findUnique({ where: { id: e.issueId }, select: { assigneeId: true } });
        assignee = i?.assigneeId ?? null;
      }
      if (!assignee || assignee === sender) return;
      const ref = await issueRef(e.issueId);
      if (!ref) return;
      await notifyWork({
        receiverId: assignee, senderId: sender, type: 'WORK_ASSIGN', entityId: e.issueId,
        payload: { issueKey: ref.issueKey, title: ref.title, url: ref.url },
      });
      return;
    }

    if (e.type === 'comment.created') {
      const [ref, comment, watchers] = await Promise.all([
        issueRef(e.issueId),
        prisma.workComment.findUnique({ where: { id: e.commentId }, select: { bodyJson: true, bodyText: true } }),
        prisma.workWatcher.findMany({ where: { issueId: e.issueId }, select: { userId: true } }),
      ]);
      if (!ref || !comment) return;
      const excerpt = comment.bodyText.slice(0, 140);
      const mentioned = new Set(await canStillSee(mentionedUserIds(comment.bodyJson), ref.projectId));
      const watching = await canStillSee(watchers.map((w) => w.userId), ref.projectId);
      const payload = { issueKey: ref.issueKey, title: ref.title, url: `${ref.url}?comment=${e.commentId}`, excerpt };
      for (const uid of mentioned) {
        await notifyWork({ receiverId: uid, senderId: sender, type: 'WORK_MENTION', entityId: e.issueId, secondaryEntityId: e.commentId, payload });
      }
      for (const uid of watching) {
        if (mentioned.has(uid)) continue;
        await notifyWork({ receiverId: uid, senderId: sender, type: 'WORK_COMMENT', entityId: e.issueId, secondaryEntityId: e.commentId, payload });
      }
    }
  });

  logger.info('[work] thông báo CT Work đã đăng ký');
}
