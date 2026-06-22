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
  } catch (err) {
    // Never let a notification failure break the user-visible
    // action (like / comment / etc.). Just log and move on.
    logger.warn('pushNotification failed', { error: (err as Error).message });
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
      html: `<p>A new post has been submitted and is awaiting review.</p>`,
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
      html: `<p>A new project has been submitted and is awaiting review.</p>`,
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
      html: `<p>A new blog post has been submitted and is awaiting review.</p>`,
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
      html: `<p>Your password was recently changed. If this wasn't you, please contact support immediately.</p>`,
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
