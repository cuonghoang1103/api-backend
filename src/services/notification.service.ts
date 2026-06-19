/**
 * Notification service — sends admin email alerts for new posts, projects,
 * blog submissions, and account events.
 *
 * This file was restored as a stub to satisfy existing imports in
 * admin.routes.ts, auth.routes.ts, blog.routes.ts, and social.routes.ts.
 * The actual email-sending logic is delegated to the EmailService.
 *
 * The Prisma schema has no `Notification` model — admin alerts are sent
 * via email only (no in-app notification table yet).
 */

import { emailService } from './email.service.js';

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
    console.warn('[NotificationService] notifyAdminPost failed:', (err as Error).message);
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
    console.warn('[NotificationService] notifyAdminProject failed:', (err as Error).message);
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
    console.warn('[NotificationService] notifyAdminBlog failed:', (err as Error).message);
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
    console.warn('[NotificationService] notifyPasswordChanged failed:', (err as Error).message);
  }
}

/** Send notification when a post is liked */
export async function notifyPostLike(
  _recipientId: number,
  _likerId: number | string,
  _postId: number,
): Promise<void> {
  // In-app notification not yet implemented — email stub only
}

/** Send notification when a post receives a comment */
export async function notifyPostComment(
  _recipientId: number,
  _commenterId: number | string,
  _postId: number,
  _commentId?: number,
): Promise<void> {
  // In-app notification not yet implemented — email stub only
}

/** Send notification when a post is reposted */
export async function notifyPostRepost(
  _recipientId: number,
  _reposterId: number | string,
  _postId: number,
): Promise<void> {
  // In-app notification not yet implemented — email stub only
}
