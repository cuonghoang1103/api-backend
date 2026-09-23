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
 *   - Thay đổi không có người gửi (SYSTEM) ⇒ bỏ qua: chuông cần một người
 *     gửi. Luật tự động mang userId của người tạo luật nên vẫn báo được.
 *   - Mỗi thông báo trong web kèm một email theo cài đặt của người nhận
 *     (ngay / thư gộp 08:00 / tắt, có giờ im lặng) — xem notifyWork() dưới.
 */

import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { notifyWork as pushWork } from '../notification.service.js';
import { logger } from '../../utils/logger.js';
import { frontendUrl, sendWorkEmail } from './common.js';
import { onWorkEvent } from './events.js';

// ─── Email (đợt 6.6) ─────────────────────────────────────────────

export const EMAIL_MODES = ['INSTANT', 'DIGEST', 'OFF'] as const;
export type EmailMode = (typeof EMAIL_MODES)[number];

type WorkNotifyArgs = Parameters<typeof pushWork>[0];

const SUBJECT: Record<WorkNotifyArgs['type'], (p: Record<string, unknown>) => string> = {
  WORK_INVITE: (p) => `You were added to ${p.workspaceName ?? 'a workspace'}`,
  WORK_ASSIGN: (p) => `${p.issueKey} was assigned to you: ${p.title}`,
  WORK_COMMENT: (p) => `New comment on ${p.issueKey}: ${p.title}`,
  WORK_MENTION: (p) => `You were mentioned in ${p.issueKey}: ${p.title}`,
  WORK_ALERT: (p) => `${p.issueKey}: ${p.message ?? 'needs your attention'}`,
};

/** Giờ hiện tại theo giờ VN (0–23). */
function vnHour(d = new Date()): number {
  return Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', hour12: false }).format(d)) % 24;
}

/** Trong giờ im lặng không? Khoảng có thể vắt qua nửa đêm (22 → 7). */
export function inQuietHours(start: number | null, end: number | null, hour: number): boolean {
  if (start === null || end === null || start === end) return false;
  return start < end ? hour >= start && hour < end : hour >= start || hour < end;
}

export async function getNotifySettings(userId: number) {
  const s = await prisma.workNotifySetting.findUnique({ where: { userId } });
  return { emailMode: (s?.emailMode ?? 'INSTANT') as EmailMode, quietStart: s?.quietStart ?? null, quietEnd: s?.quietEnd ?? null };
}

export async function setNotifySettings(userId: number, input: { emailMode?: EmailMode; quietStart?: number | null; quietEnd?: number | null }) {
  const cur = await getNotifySettings(userId);
  const next = { ...cur, ...input };
  if ((next.quietStart === null) !== (next.quietEnd === null)) throw new BadRequestError('Set both the start and end of quiet hours', 'WORK_BAD_QUIET');
  await prisma.workNotifySetting.upsert({ where: { userId }, create: { userId, ...next }, update: next });
  return next;
}

/**
 * Email kèm theo thông báo trong web. Tắt toàn cục bằng
 * WORK_EMAIL_NOTIFICATIONS=false. Theo người: INSTANT gửi ngay (trừ giờ im
 * lặng — dồn sang thư gộp), DIGEST dồn hết vào thư gộp 08:00, OFF không gửi.
 * Lời mời (WORK_INVITE) đã có email riêng lúc mời nên không gửi lần hai.
 */
async function emailFor(args: WorkNotifyArgs): Promise<void> {
  if (process.env.WORK_EMAIL_NOTIFICATIONS === 'false' || args.type === 'WORK_INVITE') return;
  if (args.receiverId === args.senderId) return;
  const settings = await getNotifySettings(args.receiverId);
  if (settings.emailMode === 'OFF') return;
  const subject = SUBJECT[args.type](args.payload).slice(0, 240);
  const url = typeof args.payload.url === 'string' ? args.payload.url : null;
  if (settings.emailMode === 'DIGEST' || inQuietHours(settings.quietStart, settings.quietEnd, vnHour())) {
    await prisma.workEmailQueue.create({ data: { userId: args.receiverId, kind: args.type, subject, url } });
    return;
  }
  const user = await prisma.user.findUnique({ where: { id: args.receiverId }, select: { email: true, enabled: true } });
  if (!user?.enabled || !user.email) return;
  const excerpt = typeof args.payload.excerpt === 'string' ? args.payload.excerpt : null;
  await sendWorkEmail({
    to: user.email,
    subject: `CT Work: ${subject}`,
    heading: subject,
    lines: [excerpt ? `“${excerpt}”` : '', 'Change how you get these emails in CT Work → My work → Notification settings.'].filter(Boolean),
    cta: url ? { label: 'Open in CT Work', url: frontendUrl(url) } : undefined,
  });
}

/** Chuông + email trong một nhịp. Lỗi email chỉ ghi log. */
export async function notifyWork(args: WorkNotifyArgs): Promise<void> {
  await pushWork(args);
  await emailFor(args).catch((err) => logger.warn('[work] email thông báo lỗi', { err: (err as Error).message }));
}

/** Cron 08:00 giờ VN: mỗi người một thư gộp mọi mục đang chờ. */
export async function sendDigests(): Promise<number> {
  if (process.env.WORK_EMAIL_NOTIFICATIONS === 'false') return 0;
  const users = await prisma.workEmailQueue.findMany({ where: { sentAt: null }, distinct: ['userId'], select: { userId: true } });
  let sent = 0;
  for (const { userId } of users) {
    try {
      const items = await prisma.workEmailQueue.findMany({ where: { userId, sentAt: null }, orderBy: { id: 'asc' }, take: 200 });
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, enabled: true } });
      const now = new Date();
      if (user?.enabled && user.email && items.length) {
        await sendWorkEmail({
          to: user.email,
          subject: `CT Work: ${items.length} ${items.length === 1 ? 'update' : 'updates'} since your last digest`,
          heading: 'Your CT Work digest',
          lines: items.slice(0, 50).map((i) => `• ${i.subject}`).concat(items.length > 50 ? [`…and ${items.length - 50} more`] : []),
          cta: { label: 'Open My work', url: frontendUrl('/work?tab=my-work') },
        });
        sent += 1;
      }
      await prisma.workEmailQueue.updateMany({ where: { id: { in: items.map((i) => i.id) } }, data: { sentAt: now } });
      await prisma.workNotifySetting.upsert({ where: { userId }, create: { userId, lastDigestAt: now }, update: { lastDigestAt: now } });
    } catch (err) {
      logger.warn('[work] digest failed', { userId, err: (err as Error).message });
    }
  }
  // Dọn hàng đợi đã gửi quá 30 ngày.
  await prisma.workEmailQueue.deleteMany({ where: { sentAt: { lt: new Date(Date.now() - 30 * 86_400_000) } } });
  return sent;
}

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
