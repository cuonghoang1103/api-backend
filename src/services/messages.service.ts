/**
 * ============================================================
 * Direct Messaging Service
 * ============================================================
 *
 * Handles user↔admin support chat and user↔user private chat.
 * Pure persistence layer — emits realtime events via the
 * socket module which is registered as a listener.
 *
 * Public API:
 *   - getOrCreateAdminThread(userId)
 *   - getOrCreateUserThread(userId, peerId)
 *   - listThreadsForUser(userId)
 *   - listThreadsForAdmin(adminId)
 *   - getThread(threadId, viewerId)
 *   - listMessages(threadId, viewerId, opts)
 *   - sendMessage(threadId, senderId, data)
 *   - markRead(threadId, userId)
 *   - getUnreadCount(userId)
 *   - softDeleteMessage(messageId, requesterId)
 *   - attachFilesToMessage(messageId, fileIds)
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { registerSocketEmitter, type MessageEventPayload } from '../socket/messaging.socket.js';

const MAX_CONTENT_LENGTH = 4000;
const MAX_ATTACHMENTS_PER_MESSAGE = 5;

function isAdmin(user: { roles: { role: { name: string } }[] }): boolean {
  return user.roles.some(
    (ur) =>
      ur.role.name.toUpperCase().replace('ROLE_', '') === 'ADMIN' ||
      ur.role.name.toUpperCase() === 'ADMIN',
  );
}

async function findFirstAdminUserId(): Promise<number | null> {
  const adminRole = await prisma.role.findFirst({ where: { name: 'admin' } });
  if (!adminRole) return null;
  const link = await prisma.userRole.findFirst({
    where: { roleId: adminRole.id },
    orderBy: { userId: 'asc' },
  });
  return link?.userId ?? null;
}

export class MessagesService {
  // ─── Thread resolution ────────────────────────────────

  /**
   * Return the user's existing admin support thread, creating one
   * if it doesn't exist. Idempotent — repeated calls return the
   * same thread. Admin-side threads are 1:1 (one user ↔ one admin),
   * not a group; the current architecture assumes a single admin
   * recipient (or the first admin found) for support routing.
   */
  async getOrCreateAdminThread(userId: number) {
    const existing = await prisma.messageThread.findFirst({
      where: { type: 'ADMIN', userId, adminUserId: { not: null } },
    });
    if (existing) return existing;

    const adminId = await findFirstAdminUserId();
    if (!adminId) {
      throw new AppError(
        'Admin support is not configured yet. Please try again later.',
        503,
        'NO_ADMIN_AVAILABLE',
      );
    }

    return prisma.messageThread.create({
      data: { type: 'ADMIN', userId, adminUserId: adminId },
    });
  }

  /**
   * Return the user↔user thread between `userId` and `peerId`,
   * creating one if it doesn't exist. Participants are stored
   * in canonical order (smaller id first) to keep the unique
   * index from creating duplicate threads.
   */
  async getOrCreateUserThread(userId: number, peerId: number) {
    if (userId === peerId) {
      throw new AppError('Cannot start a conversation with yourself', 400, 'SELF_CHAT');
    }

    const peer = await prisma.user.findUnique({
      where: { id: peerId },
      include: { roles: { include: { role: true } } },
    });
    if (!peer) {
      throw new AppError('Người dùng không tồn tại', 404, 'USER_NOT_FOUND');
    }
    if (!peer.enabled) {
      throw new AppError('Người dùng này đã bị vô hiệu hoá', 403, 'USER_DISABLED');
    }

    // First-contact gate: if the peer has opted out of messages
    // from strangers, refuse to start a brand-new thread. We only
    // enforce this when no existing thread exists — once two
    // users have a thread, they can keep using it.
    const [a, b] = userId < peerId ? [userId, peerId] : [peerId, userId];
    const existing = await prisma.messageThread.findFirst({
      where: { type: 'USER', userAId: a, userBId: b },
    });
    if (existing) return existing;

    if (!peer.allowMessagesFromStrangers) {
      throw new AppError(
        'Người dùng này hiện không nhận tin nhắn từ người lạ',
        403,
        'MESSAGES_DISABLED',
      );
    }

    return prisma.messageThread.create({
      data: { type: 'USER', userAId: a, userBId: b },
    });
  }

  async getThread(threadId: number, viewerId: number) {
    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
      include: {
        user: {
          select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
        },
        adminUser: {
          select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
        },
        userA: {
          select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
        },
        userB: {
          select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
        },
      },
    });
    if (!thread) throw new AppError('Thread not found', 404, 'THREAD_NOT_FOUND');
    this.assertParticipant(thread, viewerId);
    return thread;
  }

  // ─── Listing ───────────────────────────────────────────

  /**
   * Return the threads the viewer participates in, sorted by
   * most recent activity. We compute the unread count per thread
   * in a single pass via a follow-up readStates query, then
   * merge. Each row also returns the other participant's public
   * profile so the frontend can render the sidebar without a
   * second round-trip.
   */
  async listThreadsForUser(userId: number) {
    const threads = await prisma.messageThread.findMany({
      where: {
        OR: [
          { type: 'ADMIN', userId },
          { type: 'USER', OR: [{ userAId: userId }, { userBId: userId }] },
        ],
      },
      orderBy: [{ lastMessageAt: { sort: 'desc', nulls: 'last' } }, { id: 'desc' }],
      include: {
        user: { select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } },
        adminUser: { select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } },
        userA: { select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } },
        userB: { select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
            attachments: { select: { id: true, mimeType: true, fileName: true } },
          },
        },
      },
    });

    const reads = await prisma.messageRead.findMany({
      where: { userId, threadId: { in: threads.map((t) => t.id) } },
    });
    const readMap = new Map(reads.map((r) => [r.threadId, r.lastReadAt]));

    const serialized = await Promise.all(
      threads.map((t) => this.serializeThreadAsync(t, userId)),
    );

    return threads.map((t, idx) => {
      const lastMsg = t.messages[0] ?? null;
      const lastRead = readMap.get(t.id) ?? new Date(0);
      const unread = lastMsg && lastMsg.senderId !== userId && lastMsg.createdAt > lastRead ? 1 : 0;
      return {
        ...serialized[idx],
        lastMessage: lastMsg ? this.serializeMessagePreview(lastMsg) : null,
        unreadCount: unread,
      };
    });
  }

  async listThreadsForAdmin(adminId: number) {
    const threads = await prisma.messageThread.findMany({
      where: { type: 'ADMIN', adminUserId: adminId },
      orderBy: [{ lastMessageAt: { sort: 'desc', nulls: 'last' } }, { id: 'desc' }],
      include: {
        user: { select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } },
        adminUser: { select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } },
        userA: { select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } },
        userB: { select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
            attachments: { select: { id: true, mimeType: true, fileName: true } },
          },
        },
      },
    });

    const reads = await prisma.messageRead.findMany({
      where: { userId: adminId, threadId: { in: threads.map((t) => t.id) } },
    });
    const readMap = new Map(reads.map((r) => [r.threadId, r.lastReadAt]));

    const serialized = await Promise.all(
      threads.map((t) => this.serializeThreadAsync(t, adminId)),
    );

    return threads.map((t, idx) => {
      const lastMsg = t.messages[0] ?? null;
      const lastRead = readMap.get(t.id) ?? new Date(0);
      // For admin, unread means the user sent something the admin hasn't read
      const unread =
        lastMsg && lastMsg.senderId !== adminId && lastMsg.createdAt > lastRead ? 1 : 0;
      return {
        ...serialized[idx],
        lastMessage: lastMsg ? this.serializeMessagePreview(lastMsg) : null,
        unreadCount: unread,
      };
    });
  }

  // ─── Messages ──────────────────────────────────────────

  async listMessages(
    threadId: number,
    viewerId: number,
    opts: { cursor?: number; limit?: number } = {},
  ) {
    const thread = await prisma.messageThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new AppError('Thread not found', 404, 'THREAD_NOT_FOUND');
    this.assertParticipant(thread, viewerId);

    const limit = Math.min(opts.limit ?? 50, 100);
    const messages = await prisma.message.findMany({
      where: {
        threadId,
        ...(opts.cursor ? { id: { lt: opts.cursor } } : {}),
      },
      orderBy: { id: 'desc' },
      take: limit,
      include: {
        sender: {
          select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
        },
        attachments: {
          include: { file: { select: { id: true, filePath: true } } },
        },
        reactions: {
          select: { emoji: true, userId: true },
        },
      },
    });

    const ids = messages.map((m) => m.id);
    const reactionsByMsg = new Map<number, Array<{ emoji: string; count: number; userIds: number[] }>>();
    for (const m of messages) {
      if (m.reactions.length === 0) continue;
      const byEmoji = new Map<string, number[]>();
      for (const r of m.reactions) {
        const arr = byEmoji.get(r.emoji) ?? [];
        arr.push(r.userId);
        byEmoji.set(r.emoji, arr);
      }
      reactionsByMsg.set(
        m.id,
        Array.from(byEmoji.entries()).map(([emoji, userIds]) => ({
          emoji,
          count: userIds.length,
          userIds,
        })),
      );
    }
    void ids;

    return messages.reverse().map((m) => ({
      ...this.serializeMessage(m),
      reactions: reactionsByMsg.get(m.id) ?? [],
    }));
  }

  async sendMessage(
    threadId: number,
    senderId: number,
    data: { content?: string; fileIds?: number[] },
  ) {
    const thread = await prisma.messageThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new AppError('Thread not found', 404, 'THREAD_NOT_FOUND');
    this.assertParticipant(thread, senderId);

    const content = (data.content ?? '').trim();
    const fileIds = Array.isArray(data.fileIds) ? data.fileIds.slice(0, MAX_ATTACHMENTS_PER_MESSAGE) : [];
    if (!content && fileIds.length === 0) {
      throw new AppError('Message must include text or at least one file', 400, 'EMPTY_MESSAGE');
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      throw new AppError(
        `Message is too long (max ${MAX_CONTENT_LENGTH} characters)`,
        400,
        'MESSAGE_TOO_LONG',
      );
    }

    // Validate attachment ownership — the sender must have
    // uploaded the file. This prevents someone from attaching
    // another user's private file to a chat message.
    if (fileIds.length > 0) {
      const files = await prisma.fileAttachment.findMany({
        where: { id: { in: fileIds } },
        select: { id: true, uploadedBy: true, filePath: true, originalName: true, contentType: true, fileSize: true },
      });
      if (files.length !== fileIds.length) {
        throw new AppError('One or more files not found', 404, 'FILE_NOT_FOUND');
      }
      const notOwner = files.find((f) => f.uploadedBy !== senderId);
      if (notOwner) {
        throw new AppError('You can only attach files you uploaded', 403, 'FILE_NOT_OWNED');
      }
    }

    const message = await prisma.message.create({
      data: {
        threadId,
        senderId,
        content,
        attachments: fileIds.length
          ? {
              create: await this.buildAttachmentCreates(fileIds),
            }
          : undefined,
      },
      include: {
        sender: {
          select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
        },
        attachments: {
          include: { file: { select: { id: true, filePath: true } } },
        },
      },
    });

    await prisma.messageThread.update({
      where: { id: threadId },
      data: { lastMessageAt: message.createdAt },
    });

    const serialized = this.serializeMessage(message);
    this.emitNewMessage(thread, serialized);
    return serialized;
  }

  async markRead(threadId: number, userId: number) {
    const thread = await prisma.messageThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new AppError('Thread not found', 404, 'THREAD_NOT_FOUND');
    this.assertParticipant(thread, userId);

    const now = new Date();
    await prisma.messageRead.upsert({
      where: { uk_read_thread_user: { threadId, userId } },
      create: { threadId, userId, lastReadAt: now },
      update: { lastReadAt: now },
    });

    this.emitRead(thread, userId, now);
  }

  async getUnreadCount(userId: number) {
    const threads = await prisma.messageThread.findMany({
      where: {
        OR: [
          { type: 'ADMIN', userId },
          { type: 'USER', OR: [{ userAId: userId }, { userBId: userId }] },
        ],
      },
      select: {
        id: true,
        messages: {
          orderBy: { id: 'desc' },
          take: 1,
          select: { id: true, senderId: true, createdAt: true },
        },
      },
    });
    const reads = await prisma.messageRead.findMany({
      where: { userId, threadId: { in: threads.map((t) => t.id) } },
    });
    const readMap = new Map(reads.map((r) => [r.threadId, r.lastReadAt]));

    let count = 0;
    for (const t of threads) {
      const last = t.messages[0];
      if (!last) continue;
      const lastRead = readMap.get(t.id) ?? new Date(0);
      if (last.senderId !== userId && last.createdAt > lastRead) count += 1;
    }
    return count;
  }

  async softDeleteMessage(messageId: number, requesterId: number) {
    const msg = await prisma.message.findUnique({
      where: { id: messageId },
      include: { thread: true },
    });
    if (!msg) throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');

    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
      include: { roles: { include: { role: true } } },
    });
    const isRequesterAdmin = requester ? isAdmin(requester) : false;
    if (msg.senderId !== requesterId && !isRequesterAdmin) {
      throw new AppError('You can only delete your own messages', 403, 'NOT_MESSAGE_OWNER');
    }
    if (msg.recalledAt) {
      // Already recalled — the "delete" semantics are essentially
      // the same as recall from the UI's perspective.
      return;
    }
    await prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
    });
    this.emitMessageUpdated(msg.thread, messageId, { deleted: true });
  }

  /**
   * Recall (withdraw) a message. Only the sender may recall, and
   * only within a short window (default 5 min) — past that, the
   * recipient has already seen it and we shouldn't allow silent
   * un-sending. The message row stays for audit; `recalledAt` is
   * set and the content is wiped. The UI shows "Tin nhắn đã thu hồi".
   */
  async recallMessage(messageId: number, requesterId: number) {
    const RECALL_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
    const msg = await prisma.message.findUnique({
      where: { id: messageId },
      include: { thread: true },
    });
    if (!msg) throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');
    if (msg.senderId !== requesterId) {
      throw new AppError('Bạn chỉ có thể thu hồi tin nhắn của mình', 403, 'NOT_MESSAGE_OWNER');
    }
    if (msg.recalledAt) return; // idempotent
    if (msg.deletedAt) {
      // Already deleted; recall would be meaningless.
      return;
    }
    const age = Date.now() - new Date(msg.createdAt).getTime();
    if (age > RECALL_WINDOW_MS) {
      throw new AppError(
        'Chỉ có thể thu hồi tin nhắn trong vòng 5 phút sau khi gửi',
        400,
        'RECALL_WINDOW_EXPIRED',
      );
    }
    const now = new Date();
    await prisma.message.update({
      where: { id: messageId },
      data: { recalledAt: now, content: '' },
    });
    this.emitMessageUpdated(msg.thread, messageId, { recalled: true, recalledAt: now });
  }

  // ─── Reactions ─────────────────────────────────────────

  /**
   * Toggle a reaction (e.g. "👍") on a message by the current
   * user. If the user has already reacted with this emoji, the
   * reaction is removed (un-react). Otherwise it's added. This
   * is the same UX model Slack/iMessage use.
   */
  async toggleReaction(messageId: number, userId: number, emoji: string) {
    if (!emoji || emoji.length > 16) {
      throw new AppError('Emoji không hợp lệ', 400, 'INVALID_EMOJI');
    }
    const msg = await prisma.message.findUnique({
      where: { id: messageId },
      include: { thread: true },
    });
    if (!msg) throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');
    this.assertParticipant(msg.thread, userId);

    const existing = await prisma.messageReaction.findUnique({
      where: {
        uk_reaction_user_emoji: { messageId, userId, emoji },
      },
    });

    let action: 'added' | 'removed';
    if (existing) {
      await prisma.messageReaction.delete({ where: { id: existing.id } });
      action = 'removed';
    } else {
      await prisma.messageReaction.create({
        data: { messageId, userId, emoji },
      });
      action = 'added';
    }

    // Return the up-to-date reaction summary so the client can
    // update without a separate fetch.
    const summary = await this.getReactionSummary(messageId);
    this.emitMessageUpdated(msg.thread, messageId, { reactions: summary });
    return { action, summary };
  }

  private async getReactionSummary(messageId: number): Promise<Array<{ emoji: string; count: number; userIds: number[] }>> {
    const rows = await prisma.messageReaction.findMany({
      where: { messageId },
      orderBy: { createdAt: 'asc' },
    });
    const byEmoji = new Map<string, number[]>();
    for (const r of rows) {
      const arr = byEmoji.get(r.emoji) ?? [];
      arr.push(r.userId);
      byEmoji.set(r.emoji, arr);
    }
    return Array.from(byEmoji.entries()).map(([emoji, userIds]) => ({
      emoji,
      count: userIds.length,
      userIds,
    }));
  }

  // ─── Nicknames ─────────────────────────────────────────

  /**
   * Set a per-thread nickname for the "other" participant.
   * The nickname is local to `ownerId` — it does not affect how
   * `targetId` sees the thread. Empty string clears the alias.
   */
  async setNickname(threadId: number, ownerId: number, targetId: number, alias: string) {
    const thread = await prisma.messageThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new AppError('Thread not found', 404, 'THREAD_NOT_FOUND');
    this.assertParticipant(thread, ownerId);
    if (ownerId === targetId) {
      throw new AppError('Không thể đặt biệt danh cho chính mình', 400, 'SELF_NICKNAME');
    }
    const trimmed = (alias ?? '').trim().slice(0, 100);
    const updated = await prisma.threadNickname.upsert({
      where: {
        uk_nickname_per_user: { threadId, ownerId, targetId },
      },
      create: { threadId, ownerId, targetId, alias: trimmed },
      update: { alias: trimmed },
    });
    this.emitThreadUpdated(thread, { nicknameChanged: true, ownerId, targetId, alias: trimmed });
    return updated;
  }

  /**
   * Get the nicknames the current user has set in any of their
   * threads. Returns a map keyed by `${threadId}:${targetId}` so
   * the frontend can look up the alias per (thread, peer) pair
   * without N+1 queries.
   */
  async listNicknamesForUser(userId: number): Promise<Array<{ threadId: number; targetId: number; alias: string }>> {
    const rows = await prisma.threadNickname.findMany({
      where: { ownerId: userId },
      select: { threadId: true, targetId: true, alias: true },
    });
    return rows.filter((r) => r.alias.length > 0);
  }

  // ─── Helpers ───────────────────────────────────────────

  private async buildAttachmentCreates(fileIds: number[]) {
    const files = await prisma.fileAttachment.findMany({
      where: { id: { in: fileIds } },
      select: {
        id: true,
        contentType: true,
        originalName: true,
        fileSize: true,
        filePath: true,
      },
    });
    // Preserve caller-supplied order
    return fileIds
      .map((fid) => {
        const f = files.find((x) => x.id === fid);
        if (!f) return null;
        return {
          fileId: f.id,
          mimeType: f.contentType,
          fileName: f.originalName,
          fileSize: f.fileSize,
          thumbnailUrl: f.filePath,
        };
      })
      .filter(Boolean) as Array<{
        fileId: number;
        mimeType: string;
        fileName: string;
        fileSize: bigint;
        thumbnailUrl: string;
      }>;
  }

  private assertParticipant(
    thread: { type: string; userId: number | null; adminUserId: number | null; userAId: number | null; userBId: number | null },
    viewerId: number,
  ) {
    if (thread.type === 'ADMIN') {
      if (thread.userId !== viewerId && thread.adminUserId !== viewerId) {
        throw new AppError('You are not a participant in this thread', 403, 'NOT_PARTICIPANT');
      }
    } else {
      if (thread.userAId !== viewerId && thread.userBId !== viewerId) {
        throw new AppError('You are not a participant in this thread', 403, 'NOT_PARTICIPANT');
      }
    }
  }

  /**
   * Format a thread row for the API. Exposes the "other" participant
   * as `peer` so the frontend can render the sidebar / chat header
   * without knowing about the underlying userId/userAId/userBId
   * columns. Public so route handlers (e.g. GET /threads/:id) can
   * reuse the same serialisation that the list endpoints use.
   */
  public async serializeThreadAsync(
    t: {
      id: number;
      type: string;
      userId: number | null;
      adminUserId: number | null;
      userAId: number | null;
      userBId: number | null;
      lastMessageAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
      user?: { id: number; username: string; fullName: string | null; displayName?: string | null; avatarUrl: string | null } | null;
      adminUser?: { id: number; username: string; fullName: string | null; displayName?: string | null; avatarUrl: string | null } | null;
      userA?: { id: number; username: string; fullName: string | null; displayName?: string | null; avatarUrl: string | null } | null;
      userB?: { id: number; username: string; fullName: string | null; displayName?: string | null; avatarUrl: string | null } | null;
    },
    viewerId: number,
  ) {
    const peer = t.type === 'ADMIN'
      ? (t.userId === viewerId ? t.adminUser : t.user)
      : (t.userAId === viewerId ? t.userB : t.userA);

    let alias: string | null = null;
    if (peer) {
      const nick = await prisma.threadNickname.findUnique({
        where: { uk_nickname_per_user: { threadId: t.id, ownerId: viewerId, targetId: peer.id } },
        select: { alias: true },
      });
      if (nick && nick.alias.length > 0) alias = nick.alias;
    }

    return {
      id: t.id,
      type: t.type,
      lastMessageAt: t.lastMessageAt,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      peer: peer
        ? {
            id: peer.id,
            username: peer.username,
            displayName: alias ?? peer.displayName ?? peer.fullName ?? peer.username,
            avatarUrl: peer.avatarUrl,
            alias,
          }
        : null,
    };
  }

  public serializeThread(
    t: {
      id: number;
      type: string;
      userId: number | null;
      adminUserId: number | null;
      userAId: number | null;
      userBId: number | null;
      lastMessageAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
      user?: { id: number; username: string; fullName: string | null; displayName?: string | null; avatarUrl: string | null } | null;
      adminUser?: { id: number; username: string; fullName: string | null; displayName?: string | null; avatarUrl: string | null } | null;
      userA?: { id: number; username: string; fullName: string | null; displayName?: string | null; avatarUrl: string | null } | null;
      userB?: { id: number; username: string; fullName: string | null; displayName?: string | null; avatarUrl: string | null } | null;
    },
    viewerId: number,
  ) {
    // For the sidebar, expose the "other" participant as `peer`
    const peer = t.type === 'ADMIN'
      ? (t.userId === viewerId ? t.adminUser : t.user)      : (t.userAId === viewerId ? t.userB : t.userA);

    return {
      id: t.id,
      type: t.type,
      lastMessageAt: t.lastMessageAt,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      peer: peer
        ? {
            id: peer.id,
            username: peer.username,
            displayName: peer.displayName ?? peer.fullName ?? peer.username,
            avatarUrl: peer.avatarUrl,
            alias: null as string | null,
          }
        : null,
    };
  }

  private serializeMessagePreview(m: {
    id: number;
    content: string;
    senderId: number;
    createdAt: Date;
    attachments: { id: number; mimeType: string; fileName: string }[];
  }) {
    return {
      id: m.id,
      content: m.content,
      senderId: m.senderId,
      createdAt: m.createdAt,
      hasAttachment: m.attachments.length > 0,
      attachmentMime: m.attachments[0]?.mimeType ?? null,
      attachmentName: m.attachments[0]?.fileName ?? null,
    };
  }

  private serializeMessage(m: {
    id: number;
    threadId: number;
    senderId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    recalledAt: Date | null;
    sender: { id: number; username: string; fullName: string | null; displayName: string | null; avatarUrl: string | null };
    attachments: {
      id: number;
      fileId: number;
      mimeType: string;
      fileName: string;
      fileSize: bigint;
      thumbnailUrl: string | null;
      file: { id: number; filePath: string };
    }[];
  }) {
    return {
      id: m.id,
      threadId: m.threadId,
      senderId: m.senderId,
      // Recalled: content wiped, show empty (UI shows a stub).
      // Deleted: same — UI shows the "đã xoá" stub.
      content: m.deletedAt || m.recalledAt ? '' : m.content,
      deleted: m.deletedAt !== null,
      recalled: m.recalledAt !== null,
      recalledAt: m.recalledAt,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      sender: {
        id: m.sender.id,
        username: m.sender.username,
        displayName: m.sender.displayName ?? m.sender.fullName ?? m.sender.username,
        avatarUrl: m.sender.avatarUrl,
      },
      attachments: m.attachments.map((a) => ({
        id: a.id,
        fileId: a.fileId,
        mimeType: a.mimeType,
        fileName: a.fileName,
        fileSize: Number(a.fileSize),
        // Public URL served by Nginx from /uploads/. The DB stores
        // the relative path; the frontend concatenates with the
        // API base URL via `lib/api.ts`.
        url: `/uploads/${a.file.filePath.replace(/^uploads\//, '')}`,
        thumbnailUrl: a.thumbnailUrl ? `/uploads/${a.thumbnailUrl.replace(/^uploads\//, '')}` : null,
      })),
    };
  }

  // ─── Realtime fan-out ──────────────────────────────────

  private emitNewMessage(
    thread: { id: number; type: string; userId: number | null; adminUserId: number | null; userAId: number | null; userBId: number | null },
    message: unknown,
  ) {
    const emitter = this.getEmitter();
    if (!emitter) return;
    const payload: MessageEventPayload = {
      threadId: thread.id,
      threadType: thread.type,
      participantIds: this.collectParticipantIds(thread),
      message,
    };
    emitter.emit('thread:new-message', payload);
  }

  /**
   * Emit a targeted "message updated" event for in-place state
   * changes (recall, delete, reactions). Recipients are the
   * thread's participants — we use both the thread room AND
   * each participant's user room so users see the update
   * regardless of whether they have the thread open.
   */
  private emitMessageUpdated(
    thread: { id: number; type: string; userId: number | null; adminUserId: number | null; userAId: number | null; userBId: number | null },
    messageId: number,
    changes: { deleted?: boolean; recalled?: boolean; recalledAt?: Date; reactions?: unknown },
  ) {
    const emitter = this.getEmitter();
    if (!emitter) return;
    const payload = {
      threadId: thread.id,
      threadType: thread.type,
      participantIds: this.collectParticipantIds(thread),
      messageId,
      changes,
    };
    emitter.emit('message:updated', payload);
  }

  private emitThreadUpdated(
    thread: { id: number; type: string; userId: number | null; adminUserId: number | null; userAId: number | null; userBId: number | null },
    changes: Record<string, unknown>,
  ) {
    const emitter = this.getEmitter();
    if (!emitter) return;
    const payload = {
      threadId: thread.id,
      threadType: thread.type,
      participantIds: this.collectParticipantIds(thread),
      changes,
    };
    emitter.emit('thread:updated', payload);
  }

  private emitRead(
    thread: { id: number; type: string; userId: number | null; adminUserId: number | null; userAId: number | null; userBId: number | null },
    userId: number,
    at: Date,
  ) {
    const emitter = this.getEmitter();
    if (!emitter) return;
    emitter.emit('thread:read', {
      threadId: thread.id,
      threadType: thread.type,
      participantIds: this.collectParticipantIds(thread),
      readerId: userId,
      readAt: at,
    });
  }

  private collectParticipantIds(thread: {
    type: string;
    userId: number | null;
    adminUserId: number | null;
    userAId: number | null;
    userBId: number | null;
  }): number[] {
    if (thread.type === 'ADMIN') {
      return [thread.userId, thread.adminUserId].filter((x): x is number => x !== null);
    }
    return [thread.userAId, thread.userBId].filter((x): x is number => x !== null);
  }

  private getEmitter() {
    return registerSocketEmitter();
  }
}

export const messagesService = new MessagesService();
