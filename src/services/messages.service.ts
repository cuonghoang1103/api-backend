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

    return threads.map((t) => {
      const lastMsg = t.messages[0] ?? null;
      const lastRead = readMap.get(t.id) ?? new Date(0);
      const unread = lastMsg && lastMsg.senderId !== userId && lastMsg.createdAt > lastRead ? 1 : 0;
      return {
        ...this.serializeThread(t, userId),
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

    return threads.map((t) => {
      const lastMsg = t.messages[0] ?? null;
      const lastRead = readMap.get(t.id) ?? new Date(0);
      // For admin, unread means the user sent something the admin hasn't read
      const unread =
        lastMsg && lastMsg.senderId !== adminId && lastMsg.createdAt > lastRead ? 1 : 0;
      return {
        ...this.serializeThread(t, adminId),
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
      },
    });

    return messages.reverse().map((m) => this.serializeMessage(m));
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
    await prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
    });
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

  private serializeThread(
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
      ? (t.userId === viewerId ? t.adminUser : t.user)
      : (t.userAId === viewerId ? t.userB : t.userA);

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
      content: m.deletedAt ? '' : m.content,
      deleted: m.deletedAt !== null,
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
