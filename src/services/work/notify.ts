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
import { pushPrefsFrom, type PushPrefs } from '../push/goiDayCtw.js';
import { frontendUrl, sendWorkEmail } from './common.js';
import { buildDigestEmail, buildGitEmail, buildNotifyEmail, loadGitEmailInput, loadIssueInfo, loadSender } from './notifyEmail.js';
import { deliverWorkEmail } from './workEmail.js';
import { onWorkEvent } from './events.js';
import { clientEmailContent, clientMemberIds, registerPortalNotifications, routeForClient } from './portalNotify.js';

// ─── Email (đợt 6.6) ─────────────────────────────────────────────

export const EMAIL_MODES = ['INSTANT', 'DIGEST', 'OFF'] as const;
export type EmailMode = (typeof EMAIL_MODES)[number];

type WorkNotifyArgs = Parameters<typeof pushWork>[0];

/** Giờ hiện tại (0–23) theo múi giờ của người nhận — NULL/sai ⇒ giờ VN như trước 18/10/2026. */
export function hourIn(tz: string | null | undefined, d = new Date()): number {
  try {
    return Number(new Intl.DateTimeFormat('en-GB', { timeZone: tz || 'Asia/Ho_Chi_Minh', hour: '2-digit', hour12: false }).format(d)) % 24;
  } catch {
    return Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', hour12: false }).format(d)) % 24;
  }
}

/** Múi giờ IANA hợp lệ không (Intl nhận được). */
export function validTimezone(tz: string): boolean {
  try { new Intl.DateTimeFormat('en-GB', { timeZone: tz }); return true; } catch { return false; }
}

/** Trong giờ im lặng không? Khoảng có thể vắt qua nửa đêm (22 → 7). */
export function inQuietHours(start: number | null, end: number | null, hour: number): boolean {
  if (start === null || end === null || start === end) return false;
  return start < end ? hour >= start && hour < end : hour >= start || hour < end;
}

export async function getNotifySettings(userId: number) {
  const s = await prisma.workNotifySetting.findUnique({ where: { userId } });
  return {
    emailMode: (s?.emailMode ?? 'INSTANT') as EmailMode, quietStart: s?.quietStart ?? null, quietEnd: s?.quietEnd ?? null,
    // 18/10/2026 (app iOS CT Work): công tắc đẩy theo loại + múi giờ của giờ im lặng.
    push: pushPrefsFrom(s?.pushPrefs), timezone: s?.timezone ?? null,
  };
}

export async function setNotifySettings(userId: number, input: {
  emailMode?: EmailMode; quietStart?: number | null; quietEnd?: number | null; push?: Partial<PushPrefs>; timezone?: string | null;
}) {
  const cur = await getNotifySettings(userId);
  const next = { ...cur, ...input, push: { ...cur.push, ...(input.push ?? {}) } };
  if ((next.quietStart === null) !== (next.quietEnd === null)) throw new BadRequestError('Set both the start and end of quiet hours', 'WORK_BAD_QUIET');
  if (next.timezone !== null && !validTimezone(next.timezone)) throw new BadRequestError('Unknown time zone — use an IANA name like Asia/Ho_Chi_Minh', 'WORK_BAD_TIMEZONE');
  const data = { emailMode: next.emailMode, quietStart: next.quietStart, quietEnd: next.quietEnd, pushPrefs: next.push, timezone: next.timezone };
  await prisma.workNotifySetting.upsert({ where: { userId }, create: { userId, ...data }, update: data });
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
  // CTW K-3: tin chat không gửi email tức thì (chat là nhịp nhanh) — chỉ thư gộp "tin chưa đọc" khi người dùng BẬT.
  if (args.payload.chat === true) return;
  // Bảng tin (21/10/2026): bài mới + cảm xúc chỉ chuông/đẩy — email chỉ cho @nhắc / bình luận (theo cài đặt như thường).
  if (args.payload.noEmail === true) return;
  if (args.receiverId === args.senderId) return;
  const settings = await getNotifySettings(args.receiverId);
  if (settings.emailMode === 'OFF') return;
  const url = typeof args.payload.url === 'string' ? args.payload.url : null;
  if (args.payload.portal === true) {
    // Thư cho KHÁCH (cổng khách S2b): mẫu riêng (tiếng Anh), chỉ dữ liệu đã chia sẻ, link vào cổng khách.
    const c = clientEmailContent(args.payload);
    if (await queueIfDeferred(args, settings, c.subject.slice(0, 240), url)) return;
    const to = await recipientEmail(args.receiverId);
    if (!to) return;
    const project = String(args.payload.projectName ?? 'Your project');
    await sendWorkEmail({
      to,
      subject: `${project}: ${c.subject}`.slice(0, 240),
      heading: c.heading,
      lines: [...c.lines.filter(Boolean), 'You can change how you receive these emails in the client portal → Notification settings.'],
      cta: url ? { label: c.cta, url: frontendUrl(url) } : undefined,
      brand: `${project} · Client portal`,
      footer: 'You received this email because you are a client on this project.',
    });
    return;
  }
  // 27/10/2026: thư tiếng Việt có chi tiết — Git (secondaryEntityId = WorkGitEvent) / thẻ (entityId = thẻ) / còn lại.
  const sender = await loadSender(args.senderId);
  const git = args.payload.git === true && args.secondaryEntityId ? await loadGitEmailInput(args.secondaryEntityId, args.payload) : null;
  const issue = !git && ISSUE_KINDS.has(args.type) ? await loadIssueInfo(args.entityId) : null;
  const mail = git ? buildGitEmail(git) : buildNotifyEmail({ type: args.type, payload: args.payload, sender, issue });
  const subject = mail.subject.slice(0, 240);
  if (await queueIfDeferred(args, settings, subject, url)) return;
  const to = await recipientEmail(args.receiverId);
  if (!to) return;
  await deliverWorkEmail({ to, subject, html: mail.html, text: mail.text });
}

const ISSUE_KINDS = new Set<WorkNotifyArgs['type']>(['WORK_ASSIGN', 'WORK_COMMENT', 'WORK_MENTION']);

/** DIGEST hoặc đang giờ im lặng ⇒ dồn vào thư gộp 08:00 (true = đã dồn). */
async function queueIfDeferred(args: WorkNotifyArgs, settings: Awaited<ReturnType<typeof getNotifySettings>>, subject: string, url: string | null): Promise<boolean> {
  if (settings.emailMode !== 'DIGEST' && !inQuietHours(settings.quietStart, settings.quietEnd, hourIn(settings.timezone))) return false;
  await prisma.workEmailQueue.create({ data: { userId: args.receiverId, kind: args.type, subject, url } });
  return true;
}

async function recipientEmail(userId: number): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, enabled: true } });
  return user?.enabled && user.email ? user.email : null;
}

/**
 * Chuông + email trong một nhịp. Lỗi email chỉ ghi log.
 * Cửa cuối của cổng khách (S2b): người nhận là khách bị cách ly ⇒ routeForClient
 * chỉ cho qua loại khách được biết (trả lời PUBLIC, phê duyệt của chính họ…) và
 * viết lại link vào cổng khách; còn lại bỏ hẳn.
 */
export async function notifyWork(args: WorkNotifyArgs): Promise<void> {
  // Danh sách chặn (/messages/blocks) áp phía máy chủ (18/10/2026): người nhận đã chặn người gửi ⇒ không chuông/đẩy/email
  // cho NỘI DUNG của người đó (bình luận, @nhắc, tin chat). Giao việc / phê duyệt / nhắc hạn vẫn tới — đó là việc.
  if ((args.type === 'WORK_COMMENT' || args.type === 'WORK_MENTION') && (await isBlockedBy(args.receiverId, args.senderId))) return;
  const routed = await routeForClient(args);
  if (!routed) return;
  await pushWork(routed);
  await emailFor(routed).catch((err) => logger.warn('[work] email thông báo lỗi', { err: (err as Error).message }));
}

/** `receiverId` đã chặn `senderId` chưa (bảng user_blocks của tin nhắn). */
export async function isBlockedBy(receiverId: number, senderId: number): Promise<boolean> {
  if (receiverId === senderId) return false;
  const b = await prisma.userBlock.findUnique({ where: { uk_block_pair: { blockerId: receiverId, blockedId: senderId } }, select: { id: true } }).catch(() => null);
  return !!b;
}

/** Tập người (trong `userIds`) đã chặn `senderId`. */
export async function blockersOf(senderId: number, userIds: number[]): Promise<Set<number>> {
  if (!userIds.length) return new Set();
  const rows = await prisma.userBlock.findMany({ where: { blockedId: senderId, blockerId: { in: userIds } }, select: { blockerId: true } });
  return new Set(rows.map((r) => r.blockerId));
}

/** Cron 08:00 giờ VN: mỗi người một thư gộp mọi mục đang chờ. */
export async function sendDigests(): Promise<number> {
  if (process.env.WORK_EMAIL_NOTIFICATIONS === 'false') return 0;
  // CTW K-3: người bật "Email digest of unread chat" ⇒ một dòng tóm tắt vào cùng thư gộp (mặc định TẮT).
  await import('./chat.service.js').then((m) => m.queueChatDigests()).catch((err) => logger.warn('[work] chat digest lỗi', { err: (err as Error).message }));
  const users = await prisma.workEmailQueue.findMany({ where: { sentAt: null }, distinct: ['userId'], select: { userId: true } });
  let sent = 0;
  for (const { userId } of users) {
    try {
      const items = await prisma.workEmailQueue.findMany({ where: { userId, sentAt: null }, orderBy: { id: 'asc' }, take: 200 });
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, enabled: true } });
      const now = new Date();
      if (user?.enabled && user.email && items.length) {
        const mail = buildDigestEmail(items.map((i) => ({ subject: i.subject, url: i.url })));
        await deliverWorkEmail({ to: user.email, subject: mail.subject, html: mail.html, text: mail.text });
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
  const [wsMembers, projMembers, portalOnly] = await Promise.all([
    prisma.workMember.findMany({ where: { workspaceId: project.workspaceId, userId: { in: userIds } }, select: { userId: true, role: true } }),
    prisma.workProjectMember.findMany({ where: { projectId, userId: { in: userIds } }, select: { userId: true } }),
    // MEMBER chỉ là khách cổng ⇒ GUEST: không nhận tin của dự án mở cho không gian (permissions.portalOnlyUserIds).
    import('./permissions.js').then((m) => m.portalOnlyUserIds(project.workspaceId)),
  ]);
  const explicit = new Set(projMembers.map((m) => m.userId));
  return wsMembers
    .filter((m) => m.role === 'OWNER' || m.role === 'ADMIN' || explicit.has(m.userId) || (m.role === 'MEMBER' && project.visibility === 'WORKSPACE' && !portalOnly.has(m.userId)))
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
  registerPortalNotifications();

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
      // Khách bị cách ly KHÔNG nhận qua đường này (kể cả bị @nhắc trong ghi chú nội bộ):
      // trả lời PUBLIC tới khách đi đường riêng (portalNotify) — không trùng, không lộ.
      const clients = new Set(await clientMemberIds(ref.projectId));
      const mentioned = new Set((await canStillSee(mentionedUserIds(comment.bodyJson), ref.projectId)).filter((u) => !clients.has(u)));
      const watching = (await canStillSee(watchers.map((w) => w.userId), ref.projectId)).filter((u) => !clients.has(u));
      const payload = { issueKey: ref.issueKey, title: ref.title, url: `${ref.url}?comment=${e.commentId}`, excerpt };
      for (const uid of mentioned) {
        await notifyWork({ receiverId: uid, senderId: sender, type: 'WORK_MENTION', entityId: e.issueId, secondaryEntityId: e.commentId, payload });
      }
      // K-1 (đợt 5b): người được trả lời nhận "New reply" (kể cả khi đã bỏ theo dõi thẻ), một lần — không thêm WORK_COMMENT.
      let replied: number | null = null;
      if (e.replyTo && e.replyTo !== sender && !mentioned.has(e.replyTo) && !clients.has(e.replyTo) && (await canStillSee([e.replyTo], ref.projectId)).length) {
        replied = e.replyTo;
        await notifyWork({ receiverId: replied, senderId: sender, type: 'WORK_COMMENT', entityId: e.issueId, secondaryEntityId: e.commentId, payload: { ...payload, reply: true } });
      }
      for (const uid of watching) {
        if (mentioned.has(uid) || uid === replied) continue;
        await notifyWork({ receiverId: uid, senderId: sender, type: 'WORK_COMMENT', entityId: e.issueId, secondaryEntityId: e.commentId, payload });
      }
    }
  });

  logger.info('[work] thông báo CT Work đã đăng ký');
}
