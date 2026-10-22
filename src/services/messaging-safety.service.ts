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
import { logger } from '../utils/logger.js';

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

  /**
   * Báo cáo một hội thoại — hoặc MỘT tin nhắn cụ thể trong đó (`messageId`, 22/10/2026).
   * - Ghi `thread_reports` (hàng chờ /admin/reports) VÀ báo admin như mọi báo cáo khác (`baoAdmin` BAO_CAO:
   *   hộp thư /admin + chuông socket + Telegram) — trước bản này báo cáo tin nhắn riêng nằm im, không ai được báo.
   * - Có `messageId` ⇒ tin đó ẨN với chính người báo cáo ngay (listMessages lọc), người kia vẫn thấy cho tới khi
   *   admin xử lý. Không báo cáo được tin của chính mình.
   */
  async reportThread(reporterId: number, threadId: number, reason: string, category?: string | null, messageId?: number | null) {
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

    let msg: { id: number; senderId: number; content: string; mediaUrl: string | null; createdAt: Date } | null = null;
    if (messageId != null) {
      if (!Number.isInteger(messageId) || messageId <= 0) throw new AppError('Invalid message ID', 400, 'INVALID_ID');
      msg = await prisma.message.findFirst({
        where: { id: messageId, threadId },
        select: { id: true, senderId: true, content: true, mediaUrl: true, createdAt: true },
      });
      if (!msg) throw new AppError('Tin nhắn không tồn tại', 404, 'MESSAGE_NOT_FOUND');
      if (msg.senderId === reporterId) {
        throw new AppError('Không thể báo cáo tin nhắn của chính mình', 400, 'REPORT_SELF');
      }
    }

    const created = await prisma.threadReport.create({
      data: {
        reporterId,
        threadId,
        reason: trimmed,
        category: cleanCategory,
        messageId: msg?.id ?? null,
      },
    });

    await this.alertAdmin(created.id, reporterId, thread, trimmed, cleanCategory, msg);
    return { id: created.id, createdAt: created.createdAt, hiddenMessageId: msg?.id ?? null };
  }

  /** BAO_CAO cho admin site (hộp thư + Telegram), cùng đường với báo cáo Bảng tin / CT Work. Không bao giờ ném lỗi. */
  private async alertAdmin(
    reportId: number,
    reporterId: number,
    thread: { id: number; type: string; userId: number | null; adminUserId: number | null; userAId: number | null; userBId: number | null },
    reason: string,
    category: string | null,
    msg: { id: number; senderId: number; content: string; mediaUrl: string | null } | null,
  ) {
    try {
      const peers = [...new Set([thread.userId, thread.adminUserId, thread.userAId, thread.userBId])]
        .filter((x): x is number => typeof x === 'number' && x !== reporterId);
      const users = await prisma.user.findMany({ where: { id: { in: [reporterId, ...peers] } }, select: { id: true, username: true } });
      const ten = (id: number) => `@${users.find((u) => u.id === id)?.username ?? '?'} (#${id})`;
      // Nguyên văn cho admin: tin bị báo cáo, không có thì 3 tin gần nhất của người bị báo cáo trong hội thoại.
      const mau = msg
        ? [msg]
        : await prisma.message.findMany({
            where: { threadId: thread.id, senderId: { in: peers }, recalledAt: null },
            orderBy: { id: 'desc' }, take: 3,
            select: { id: true, senderId: true, content: true, mediaUrl: true },
          });
      const dong = mau.map((m) => `#${m.id} ${ten(m.senderId)}: ${(m.content || m.mediaUrl || '[tệp]').slice(0, 300)}`);
      const { baoAdmin } = await import('./thongBaoAdmin.service.js');
      await baoAdmin({
        loai: 'BAO_CAO',
        mucDo: 'can_xu_ly',
        tieuDe: `Báo cáo tin nhắn riêng: ${msg ? `tin #${msg.id}` : `hội thoại #${thread.id}`} (${category ?? 'other'})`,
        noiDung: [
          `Lý do: ${reason}`,
          `Người báo cáo: ${ten(reporterId)}`,
          peers.length ? `Bị báo cáo: ${peers.map(ten).join(', ')}` : null,
          dong.length ? `${msg ? 'Tin bị báo cáo' : 'Tin gần nhất'}:\n${dong.join('\n')}` : null,
        ].filter(Boolean).join('\n'),
        duongDan: '/admin/reports',
        userId: reporterId,
        entityId: reportId,
        khoaChongTrung: `dm-report:${reportId}`,
      });
    } catch (err) {
      logger.warn('[messaging-safety] báo admin về báo cáo tin nhắn lỗi', { reportId, error: (err as Error).message });
    }
  }

  /** Id các tin trong hội thoại mà người xem đã báo cáo ⇒ ẩn với họ. */
  async hiddenMessageIdsFor(viewerId: number, threadId: number): Promise<number[]> {
    const rows = await prisma.threadReport.findMany({
      where: { threadId, reporterId: viewerId, messageId: { not: null } },
      select: { messageId: true },
    });
    return rows.map((r) => r.messageId!).filter(Boolean);
  }

  /**
   * Admin-only: list thread reports. Pagination via ?cursor=
   * (id of last seen row) and ?take= (max 50). Default ordering
   * is unresolved first, then newest. We expose the reporter's
   * username/avatar so the admin UI can render the "real-time
   * ticker" view without a separate /users/<id> fetch.
   */
  async listReports(opts: { cursor?: number; take?: number; status?: 'open' | 'resolved' } = {}) {
    const take = Math.min(opts.take ?? 30, 50);
    const where: any = {};
    if (opts.status === 'open') where.resolvedAt = null;
    if (opts.status === 'resolved') where.resolvedAt = { not: null };

    const rows = await prisma.threadReport.findMany({
      where,
      orderBy: [{ resolvedAt: 'asc' }, { id: 'desc' }],
      take: take + 1,
      ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
      include: {
        reporter: { select: { id: true, username: true, displayName: true, fullName: true, avatarUrl: true } },
        thread: {
          select: {
            id: true,
            type: true,
            userA: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
            userB: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { id: true, content: true, senderId: true, createdAt: true },
            },
          },
        },
        resolver: { select: { id: true, username: true, displayName: true } },
        message: { select: { id: true, content: true, senderId: true, mediaUrl: true, createdAt: true, recalledAt: true } },
      },
    });
    const nextCursor = rows.length > take ? rows[take].id : null;
    const slice = rows.slice(0, take).map((r) => ({
      id: r.id,
      reason: r.reason,
      category: r.category,
      createdAt: r.createdAt,
      resolvedAt: r.resolvedAt,
      resolution: r.resolution,
      reporter: r.reporter,
      resolver: r.resolver,
      reportedMessage: r.message ?? null,
      thread: r.thread
        ? {
            id: r.thread.id,
            type: r.thread.type,
            userA: r.thread.userA,
            userB: r.thread.userB,
            lastMessage: r.thread.messages[0] ?? null,
          }
        : null,
    }));
    return { rows: slice, nextCursor };
  }

  /**
   * Aggregated stats for the admin dashboard's header cards.
   * Cheaper than fetching all rows and counting client-side.
   */
  async reportStats() {
    const [open, resolved24h, total] = await Promise.all([
      prisma.threadReport.count({ where: { resolvedAt: null } }),
      prisma.threadReport.count({
        where: {
          resolvedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.threadReport.count(),
    ]);
    return { open, resolved24h, total };
  }

  /**
   * Mark a report as resolved. Stores a free-form resolution
   * note so future moderators can see what was done.
   */
  async resolveReport(reportId: number, resolverId: number, resolution?: string) {
    const updated = await prisma.threadReport.update({
      where: { id: reportId },
      data: {
        resolvedAt: new Date(),
        resolvedBy: resolverId,
        resolution: resolution ? String(resolution).slice(0, 500) : null,
      },
    });
    return updated;
  }
}

export const messagingSafetyService = new MessagingSafetyService();
