/**
 * Notification service
 * ====================
 *
 * Two responsibilities, depending on the caller:
 *
 *   1. Email-only admin alerts (the original contract):
 *      notifyAdminPost, notifyAdminProject, notifyAdminBlog,
 *      notifyPasswordChanged. These were restored as stubs to
 *      satisfy existing imports in admin.routes.ts, blog.routes.ts,
 *      and auth.routes.ts. They still call the EmailService.
 *
 *   2. In-app social notifications (added 2026-06-20):
 *      notifyPostReaction, notifyPostComment, notifyCommentReply,
 *      notifyMention. Each helper:
 *        a) inserts a `SocialNotification` row,
 *        b) emits a `social:notification` socket event to the
 *           receiver's personal `user:{id}` room so the bell icon
 *           updates in real time.
 *      The socket emit is best-effort — if the socket server
 *      hasn't initialised yet, the DB row is still written and
 *      the next REST poll (or a refresh) will catch the user up.
 *
 * The Prisma schema now carries a `SocialNotification` model.
 */

import { prisma } from '../config/database.js';
import { emailService } from './email.service.js';
import { registerSocketEmitter } from '../socket/messaging.socket.js';
import { logger } from '../utils/logger.js';

/** Allowed notification types — locked at the service layer so a
 *  bad caller can't insert a row with a typo and break the
 *  client-side filter UI. The DB column is VARCHAR(20) so adding
 *  a new type is just a code change + UI change, no migration. */
export const NOTIFICATION_TYPES = [
  'NEW_POST',
  'NEW_REACTION',
  'NEW_COMMENT',
  'NEW_REPLY',
  'NEW_MENTION',
  'NEW_MESSAGE',
  // ─── Friend graph + follow (additive) ───────────────────
  // entityId = the actor's user id (sender) so the bell can
  // deep-link to /friends or /profile/:id without an extra blob.
  'FRIEND_REQUEST',
  'FRIEND_ACCEPT',
  'NEW_FOLLOW',
  // ─── Sharing notifications (added 2026-07-02) ─────────────
  'NOTE_SHARE',   // Note subject (folder) was shared with recipient
  'NOTE_COMMENT', // New root discussion on a note
  'NOTE_REPLY',   // Reply to a note discussion
  'NOTE_MENTION', // Mention inside a note discussion
  'HUB_SHARE',    // Hub folder/file/link was shared with recipient
  // ─── Admin announcement (added 2026-08-08) ────────────────
  // Was previously socket-only: the client fabricated a bell entry with a
  // NEGATIVE id and bumped its own unread counter. That entry vanished on
  // reload and left the badge permanently out of step with the server
  // (the server had never heard of it). Now it's a real row per user.
  // 18 chars — fits the VARCHAR(20) `type` column.
  'ADMIN_ANNOUNCEMENT',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

function safeType(t: string): NotificationType {
  return (NOTIFICATION_TYPES as readonly string[]).includes(t)
    ? (t as NotificationType)
    : 'NEW_POST';
}

/**
 * Insert a notification row AND emit a socket event to the
 * receiver. Centralised so all four notifyXxx helpers below use
 * exactly the same payload shape and the same emit pattern.
 *
 * Returns the created row (or null if `receiverId === senderId`
 * — we never notify yourself, no point spamming the bell).
 */
async function pushNotification(args: {
  receiverId: number;
  senderId: number;
  type: NotificationType;
  entityId?: number | null;
  secondaryEntityId?: number | null;
  payload?: Record<string, unknown> | null;
}): Promise<void> {
  if (args.receiverId === args.senderId) return; // self-events are silent

  try {
    const row = await prisma.socialNotification.create({
      data: {
        receiverId: args.receiverId,
        senderId: args.senderId,
        type: safeType(args.type),
        entityId: args.entityId ?? null,
        secondaryEntityId: args.secondaryEntityId ?? null,
        payload: (args.payload as any) ?? undefined,
      },
      include: {
        sender: {
          select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
        },
      },
    });

    // Real-time fan-out. We emit on the receiver's personal
    // `user:{id}` room (already set up by messaging.socket.ts at
    // connect time). The client bell listens for this event.
    const emitter = registerSocketEmitter();
    emitter?.emit('social:notification' as any, {
      id: row.id,
      type: row.type,
      entityId: row.entityId,
      secondaryEntityId: row.secondaryEntityId,
      payload: row.payload,
      isRead: row.isRead,
      createdAt: row.createdAt,
      receiverId: row.receiverId,
      // Send the actor's public profile so the bell can render
      // the avatar + name without an extra /users/:id round-trip.
      sender: row.sender,
    });
    // ─── Đẩy ra ngoài app (2026-08-21) ────────────────────────
    //
    // Trước bản này `guiThongBao` CHỈ được gọi từ `messages.service.ts`, nên
    // app chỉ báo tin nhắn. Bình luận, cảm xúc, lời mời kết bạn… chỉ tạo hàng
    // trong bảng + bắn socket — người dùng không mở app thì không biết gì.
    //
    // Cắm ở ĐÂY chứ không ở từng chỗ gọi: cả 16 loại đều đi qua hàm này, nên
    // một chỗ sửa là đủ, và loại thứ 17 thêm sau tự có đẩy mà không phải nhớ.
    //
    // KHÔNG `await`: đẩy hỏng, chậm, hay APNs sập đều không được phép làm hỏng
    // việc người dùng vừa bấm — cùng lối với `dayThongBaoTinMoi`.
    void dayRaNgoaiApp(row);
  } catch (err) {
    // Never let a notification failure break the user-visible
    // action (like / comment / etc.). Just log and move on.
    logger.warn('pushNotification failed', { error: (err as Error).message });
  }
}

/** Tên hiển thị của người gây ra thông báo. */
function tenNguoiGui(s: { displayName?: string | null; fullName?: string | null; username?: string | null } | null): string {
  return s?.displayName?.trim() || s?.fullName?.trim() || s?.username?.trim() || 'Ai đó';
}

/**
 * Câu chữ trên thông báo đẩy — chép ĐÚNG bộ chữ của web
 * (`frontend/src/app/notifications/page.tsx`) để hai nơi nói giống nhau.
 * Lệch chữ giữa web và app là thứ người dùng nhận ra ngay.
 */
function chuThongBao(type: string, ten: string, payload: unknown): string {
  const p = (payload ?? {}) as Record<string, unknown>;
  switch (type) {
    case 'NEW_REACTION': {
      const t = String(p.reactionType ?? '');
      const dong = t === 'LOVE' ? 'đã thả ❤️ vào'
        : t === 'HAHA' ? 'đã thả 😆 vào'
        : t === 'SAD' ? 'đã thả 😢 vào'
        : t === 'ANGRY' ? 'đã thả 😡 vào'
        : t === 'WOW' ? 'đã thả 😮 vào'
        : t === 'CARE' ? 'đã thả 🥰 vào'
        : 'đã thích';
      return `${ten} ${dong} bài viết của bạn`;
    }
    case 'NEW_COMMENT': return `${ten} đã bình luận về bài viết của bạn`;
    case 'NEW_REPLY': return `${ten} đã trả lời bình luận của bạn`;
    case 'NEW_MENTION': return `${ten} đã nhắc đến bạn trong một bình luận`;
    case 'FRIEND_REQUEST': return `${ten} đã gửi cho bạn lời mời kết bạn`;
    case 'FRIEND_ACCEPT': return `${ten} đã chấp nhận lời mời kết bạn`;
    case 'NEW_FOLLOW': return `${ten} đã bắt đầu theo dõi bạn`;
    case 'NOTE_SHARE': return `${ten} đã chia sẻ một ghi chú với bạn`;
    case 'NOTE_COMMENT': return `${ten} đã bình luận trên ghi chú của bạn`;
    case 'NOTE_REPLY': return `${ten} đã trả lời thảo luận trong ghi chú`;
    case 'NOTE_MENTION': return `${ten} đã nhắc đến bạn trong một ghi chú`;
    case 'HUB_SHARE': return `${ten} đã chia sẻ một thư mục tài liệu với bạn`;
    case 'ADMIN_ANNOUNCEMENT': return String(p.title ?? 'Thông báo mới từ Admin');
    case 'NEW_POST':
    default: return `${ten} đã đăng bài viết mới`;
  }
}

/**
 * Gửi thông báo đẩy cho một hàng vừa tạo.
 *
 * Huy hiệu = tin chưa đọc + thông báo chưa đọc, khớp cách app tự tính
 * (`AppState.dongBoHuyHieu`). Sai lệch ở đây là biểu tượng app nhảy số lung
 * tung mỗi lần có đẩy.
 */
async function dayRaNgoaiApp(row: {
  id: number; type: string; receiverId: number; entityId: number | null;
  payload: unknown;
  sender: { displayName?: string | null; fullName?: string | null; username?: string | null } | null;
}): Promise<void> {
  try {
    const { guiThongBao, apnsSanSang } = await import('./push/apns.js');
    if (!apnsSanSang()) return;

    const ten = tenNguoiGui(row.sender);
    const [soTin, soTb] = await Promise.all([
      // `messagesService` là bản dựng sẵn được xuất ra ở cuối file đó —
      // không có `default`, nên gọi thẳng tên.
      import('./messages.service.js')
        .then((m) => m.messagesService.getUnreadCount(row.receiverId))
        .catch(() => 0),
      prisma.socialNotification.count({ where: { receiverId: row.receiverId, isRead: false } }),
    ]);

    await guiThongBao(row.receiverId, {
      tieuDe: row.type === 'ADMIN_ANNOUNCEMENT' ? 'Thông báo từ Admin' : ten,
      than: chuThongBao(row.type, ten, row.payload),
      huyHieu: (typeof soTin === 'number' ? soTin : 0) + soTb,
      // Gom theo LOẠI để iOS xếp chồng thông báo cùng nhóm, thay vì rải ra
      // 20 dòng riêng khi ai đó thả cảm xúc hàng loạt.
      nhom: `xh-${row.type}`,
      // `loai` khác `tin-nhan` để app biết đây là thông báo mạng xã hội và
      // định tuyến khác — xem `ThongBaoDay.didReceive`.
      duLieu: {
        loai: 'xa-hoi',
        kieu: row.type,
        thongBaoId: row.id,
        entityId: row.entityId ?? 0,
      },
    });
  } catch (err) {
    logger.warn('đẩy thông báo xã hội hỏng', { error: (err as Error).message });
  }
}

/* ─── In-app social notifications (NEW 2026-06-20) ─────────── */

export async function notifyPostReaction(
  recipientId: number,
  reactorId: number,
  postId: number,
  reactionType: string,
): Promise<void> {
  await pushNotification({
    receiverId: recipientId,
    senderId: reactorId,
    type: 'NEW_REACTION',
    entityId: postId,
    payload: { type: reactionType },
  });
}

export async function notifyPostComment(
  recipientId: number,
  commenterId: number,
  postId: number,
  commentId: number,
): Promise<void> {
  await pushNotification({
    receiverId: recipientId,
    senderId: commenterId,
    type: 'NEW_COMMENT',
    entityId: postId,
    secondaryEntityId: commentId,
  });
}

export async function notifyCommentReply(
  recipientId: number,
  replierId: number,
  postId: number,
  commentId: number,
  parentCommentId: number,
): Promise<void> {
  await pushNotification({
    receiverId: recipientId,
    senderId: replierId,
    type: 'NEW_REPLY',
    entityId: postId,
    secondaryEntityId: commentId,
    payload: { parentCommentId },
  });
}

export async function notifyMention(
  recipientId: number,
  mentionerId: number,
  postId: number,
  commentId: number,
): Promise<void> {
  await pushNotification({
    receiverId: recipientId,
    senderId: mentionerId,
    type: 'NEW_MENTION',
    entityId: postId,
    secondaryEntityId: commentId,
  });
}

/** Back-compat: original name from the email-stub era. We keep
 *  the old function signature so the rest of the codebase can
 *  call it without rewrites; it just no-ops the email side
 *  (the in-app notifyPostReaction path is the new authoritative
 *  source). */
export async function notifyPostLike(
  recipientId: number,
  likerId: number | string,
  postId: number,
): Promise<void> {
  // Legacy: numeric id or string. We coerce so old call sites
  // that pass a UUID-shaped string still work.
  const numericLiker = typeof likerId === 'string' ? parseInt(likerId, 10) : likerId;
  if (!Number.isFinite(numericLiker)) return;
  await notifyPostReaction(recipientId, numericLiker, postId, 'LIKE');
}

/* ─── Friend graph + follow notifications (NEW) ─────────────── */

/** Someone sent the recipient a friend request. entityId = sender. */
export async function notifyFriendRequest(
  recipientId: number,
  senderId: number,
): Promise<void> {
  await pushNotification({
    receiverId: recipientId,
    senderId,
    type: 'FRIEND_REQUEST',
    entityId: senderId,
  });
}

/** The recipient's friend request was accepted. entityId = sender
 *  (the person who accepted), so the bell links to their profile. */
export async function notifyFriendAccept(
  recipientId: number,
  senderId: number,
): Promise<void> {
  await pushNotification({
    receiverId: recipientId,
    senderId,
    type: 'FRIEND_ACCEPT',
    entityId: senderId,
  });
}

/** Someone started following the recipient. entityId = follower. */
export async function notifyNewFollow(
  recipientId: number,
  followerId: number,
): Promise<void> {
  await pushNotification({
    receiverId: recipientId,
    senderId: followerId,
    type: 'NEW_FOLLOW',
    entityId: followerId,
  });
}

/* ─── Sharing notifications (added 2026-07-02) ─────────────── */

/** User shared a note subject (folder) with the recipient. */
export async function notifyNoteShare(
  recipientId: number,
  senderId: number,
  subjectId: number,
  subjectName: string,
  subjectEmoji: string | null,
  permission: string,
): Promise<void> {
  await pushNotification({
    receiverId: recipientId,
    senderId,
    type: 'NOTE_SHARE',
    entityId: subjectId,
    payload: { subjectName, subjectEmoji, permission },
  });
}

export async function notifyNoteCollaboration(
  recipientId: number,
  senderId: number,
  type: 'NOTE_COMMENT' | 'NOTE_REPLY' | 'NOTE_MENTION',
  noteId: number,
  commentId: number,
  payload?: Record<string, unknown>,
): Promise<void> {
  await pushNotification({
    receiverId: recipientId,
    senderId,
    type,
    entityId: noteId,
    secondaryEntityId: commentId,
    payload: { ...(payload ?? {}), surface: 'notes' },
  });
}

/** User shared a hub folder/file/link with the recipient. */
export async function notifyHubShare(
  recipientId: number,
  senderId: number,
  hubFolderId: number,
  folderName: string,
  permission: string,
): Promise<void> {
  await pushNotification({
    receiverId: recipientId,
    senderId,
    type: 'HUB_SHARE',
    entityId: hubFolderId,
    payload: { folderName, permission },
  });
}

/* ─── Admin announcement fan-out (added 2026-08-08) ─────────── */

/**
 * Write one persisted bell notification per user for a new admin
 * announcement, so it survives a reload and the unread badge matches the
 * server. The realtime `admin:announcement` broadcast stays as-is — the
 * client reacts to it by re-fetching, which picks these rows up.
 *
 * Deliberately NOT transactional with the announcement itself: an
 * announcement must never fail to publish because the fan-out hiccuped.
 * Callers should not await-and-throw on this — see announcement.routes.ts.
 *
 * Batched at 500 rows to keep a single INSERT from growing unbounded as
 * the user table does.
 */
export async function fanoutAnnouncement(args: {
  announcementId: number;
  title: string;
  authorId: number | null;
}): Promise<number> {
  // senderId is NOT NULL with an FK to users — without a real author we
  // have nobody to attribute the row to, so skip the fan-out entirely
  // (the socket broadcast still fires and the /forum page still shows it).
  if (!args.authorId) return 0;

  const recipients = await prisma.user.findMany({
    where: { enabled: true, id: { not: args.authorId } },
    select: { id: true },
  });
  if (recipients.length === 0) return 0;

  const payload = { title: args.title.slice(0, 200) };
  let written = 0;

  for (let i = 0; i < recipients.length; i += 500) {
    const chunk = recipients.slice(i, i + 500);
    try {
      const result = await prisma.socialNotification.createMany({
        data: chunk.map((r) => ({
          receiverId: r.id,
          senderId: args.authorId as number,
          type: 'ADMIN_ANNOUNCEMENT',
          entityId: args.announcementId,
          payload,
        })),
        skipDuplicates: true,
      });
      written += result.count;
    } catch (err) {
      logger.warn('fanoutAnnouncement chunk failed', {
        error: (err as Error).message,
        announcementId: args.announcementId,
        from: i,
      });
    }
  }

  return written;
}

/* ─── Email-only admin alerts (unchanged contract) ─────────── */

/** Send admin alert when a new post is submitted */
export async function notifyAdminPost(
  _userId: number | string,
  _slug: string,
  _contentPreview?: string,
): Promise<void> {
  try {
    await emailService.send({
      to: 'cuongthaihnhe176322@gmail.com',
      subject: '[CuongThai] New post submitted',
      html: '<p>A new post has been submitted and is awaiting review.</p>',
    });
  } catch (err) {
    logger.warn('notifyAdminPost failed', { error: (err as Error).message });
  }
}

/** Send admin alert when a new project is submitted */
export async function notifyAdminProject(
  _userId: number | string,
  _slug: string,
  _title?: string,
): Promise<void> {
  try {
    await emailService.send({
      to: 'cuongthaihnhe176322@gmail.com',
      subject: '[CuongThai] New project submitted',
      html: '<p>A new project has been submitted and is awaiting review.</p>',
    });
  } catch (err) {
    logger.warn('notifyAdminProject failed', { error: (err as Error).message });
  }
}

/** Send admin alert when a new blog post is submitted */
export async function notifyAdminBlog(
  _userId: number | string,
  _slug: string,
  _title?: string,
): Promise<void> {
  try {
    await emailService.send({
      to: 'cuongthaihnhe176322@gmail.com',
      subject: '[CuongThai] New blog post submitted',
      html: '<p>A new blog post has been submitted and is awaiting review.</p>',
    });
  } catch (err) {
    logger.warn('notifyAdminBlog failed', { error: (err as Error).message });
  }
}

/** Send password change confirmation email */
export async function notifyPasswordChanged(
  _userId: number | string,
  _ip?: string,
): Promise<void> {
  try {
    await emailService.send({
      to: 'cuongthaihnhe176322@gmail.com',
      subject: '[CuongThai] Password changed',
      html: '<p>Your password was recently changed. If this wasn\'t you, please contact support immediately.</p>',
    });
  } catch (err) {
    logger.warn('notifyPasswordChanged failed', { error: (err as Error).message });
  }
}

/** Back-compat noop kept for old callers — the real "comment"
 *  path is now notifyPostComment above. */
export async function notifyPostRepost(
  _recipientId: number,
  _reposterId: number | string,
  _postId: number,
): Promise<void> {
  // In-app repost notification not part of the v1 cut.
}
