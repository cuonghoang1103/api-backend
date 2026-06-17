/**
 * ============================================================
 * Messaging Safety Service — Block & Report
 * ============================================================
 *
 * Owns the per-user blocklist and the thread-report moderation
 * queue. Both are user-driven safety controls for the direct
 * messaging system; they don't touch messages directly.
 *
 * - UserBlock: when A blocks B, B can no longer send A messages
 *   or start a new thread with A. A still keeps their own copy
 *   of any existing thread.
 *
 * - ThreadReport: free-form "report this chat" submissions
 *   stored for moderators. ResolvedBy is set when a moderator
 *   acts; the row stays in the DB for audit.
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const ALLOWED_BLOCK_REASONS = new Set([
  'spam',
  'harassment',
  'hate',
  'impersonation',
  'other',
]);

const MAX_REPORT_REASON = 200;
const MAX_BLOCK_REASON = 200;

export class MessagingSafetyService {
  // ─── Block / Unblock ─────────────────────────────────

  /**
   * Block a user. Idempotent: re-blocking a blocked user is a
   * no-op (we just refresh the `reason` if a new one is given).
   * Blocks A→B are independent of B→A; either side can block
   * the other independently.
   */
  async blockUser(blockerId: number, blockedId: number, reason?: string | null) {
    if (blockerId === blockedId) {
      throw new AppError('Không thể tự chặn chính mình', 400, 'SELF_BLOCK');
    }
    const target = await prisma.user.findUnique({
      where: { id: blockedId },
      select: { id: true, enabled: true },
    });
    if (!target) {
      throw new AppError('Người dùng không tồn tại', 404, 'USER_NOT_FOUND');
    }
    const cleanReason = reason ? String(reason).trim().slice(0, MAX_BLOCK_REASON) : null;

    await prisma.userBlock.upsert({
      where: { uk_block_pair: { blockerId, blockedId } },
      create: { blockerId, blockedId, reason: cleanReason },
      update: cleanReason !== null ? { reason: cleanReason } : {},
    });
    return { ok: true, blockedId };
  }

  async unblockUser(blockerId: number, blockedId: number) {
    await prisma.userBlock
      .delete({
        where: { uk_block_pair: { blockerId, blockedId } },
      })
      .catch(() => null);
    return { ok: true, blockedId };
  }

  /**
   * List users the current viewer has blocked. Returns a lean
   * shape (id, username, displayName, avatarUrl, blockedAt) so
   * the /messages page can show a "Blocked users" list.
   */
  async listBlockedUsers(blockerId: number) {
    const rows = await prisma.userBlock.findMany({
      where: { blockerId },
      orderBy: { createdAt: 'desc' },
    });
    if (rows.length === 0) return [];
    const users = await prisma.user.findMany({
      where: { id: { in: rows.map((r) => r.blockedId) } },
      select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
    });
    const byId = new Map(users.map((u) => [u.id, u]));
    return rows
      .map((r) => {
        const u = byId.get(r.blockedId);
        if (!u) return null;
        return {
          id: u.id,
          username: u.username,
          displayName: u.displayName ?? u.fullName ?? u.username,
          avatarUrl: u.avatarUrl,
          reason: r.reason,
          blockedAt: r.createdAt,
        };
      })
      .filter(Boolean) as Array<{
        id: number;
        username: string;
        displayName: string;
        avatarUrl: string | null;
        reason: string | null;
        blockedAt: Date;
      }>;
  }

  /**
   * Quick O(1)-ish check used by the messages.service hot path
   * (sendMessage, getOrCreateUserThread, etc.) to reject
   * blocked users. We don't return a full result — just a bool.
   *
   * Note: this is `viewer → target`. We also want to enforce
   * the reverse direction (target blocked viewer), so callers
   * should pass both directions and AND them.
   */
  async isBlockedEitherDirection(a: number, b: number): Promise<boolean> {
    if (a === b) return false;
    const found = await prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: a, blockedId: b },
          { blockerId: b, blockedId: a },
        ],
      },
      select: { id: true },
    });
    return !!found;
  }

  // ─── Thread reports ──────────────────────────────────

  async reportThread(reporterId: number, threadId: number, reason: string, category?: string | null) {
    if (!reason || !reason.trim()) {
      throw new AppError('Lý do báo cáo là bắt buộc', 400, 'EMPTY_REASON');
    }
    const trimmed = reason.trim().slice(0, MAX_REPORT_REASON);
    const cleanCategory = category ? String(category).toLowerCase() : null;
    if (cleanCategory && !ALLOWED_BLOCK_REASONS.has(cleanCategory)) {
      throw new AppError('Loại báo cáo không hợp lệ', 400, 'INVALID_CATEGORY');
    }

    const thread = await prisma.messageThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new AppError('Thread not found', 404, 'THREAD_NOT_FOUND');

    // Reporter must be a participant of the thread.
    const isParticipant =
      thread.userId === reporterId ||
      thread.adminUserId === reporterId ||
      thread.userAId === reporterId ||
      thread.userBId === reporterId;
    if (!isParticipant) {
      throw new AppError('Bạn không tham gia cuộc trò chuyện này', 403, 'NOT_PARTICIPANT');
    }

    const created = await prisma.threadReport.create({
      data: {
        reporterId,
        threadId,
        reason: trimmed,
        category: cleanCategory,
      },
    });
    return { id: created.id, createdAt: created.createdAt };
  }
}

export const messagingSafetyService = new MessagingSafetyService();
