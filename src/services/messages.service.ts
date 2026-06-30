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
 *   - setThreadPreference / clearThreadPreference (pin/mute/archive/markUnread)
 *   - archiveThread (soft-delete a thread for the current user)
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { registerSocketEmitter, type MessageEventPayload } from '../socket/messaging.socket.js';
import { messagingSafetyService } from './messaging-safety.service.js';
import { getStorageProvider } from '../storage/StorageProvider.js';

const MAX_CONTENT_LENGTH = 4000;
const MAX_ATTACHMENTS_PER_MESSAGE = 5;

// Build a full public URL for a stored file.
// `filePath` in the DB is either an R2 key ("images/chat/abc.webp")
// or a legacy local path ("uploads/foo/bar.pdf" / "/uploads/foo/bar.pdf").
// The storage provider's publicUrl() expects a bare key without the
// leading "uploads/" prefix, so we strip it before calling.
function buildAttachmentUrl(filePath: string): string {
  const key = filePath.replace(/^\/+/, '').replace(/^uploads\//, '');
  return getStorageProvider().publicUrl(key);
}

/**
 * Per-user thread preferences. Stored in the MessageThread JSONB
 * `preferences` column keyed by userId so each participant can
 * independently pin / mute / archive / mark-unread the thread
 * without affecting the other side's view.
 */
export interface ThreadPreference {
  pinnedAt?: string;       // ISO timestamp; presence = pinned
  mutedUntil?: string;     // ISO timestamp; suppress notifications until then
  archivedAt?: string;     // ISO timestamp; hide from default inbox
  markedUnreadAt?: string; // ISO timestamp; "Mark as unread" badge
  deletedAt?: string;      // ISO timestamp; hard-delete from viewer's sidebar
}

type ThreadPreferencesMap = Record<string, ThreadPreference>;

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
   *
   * Emits `thread:created` over socket ONLY when a new thread is
   * actually created (not on idempotent re-fetch). This is the
   * bugfix for the sidebar not refreshing when the other side
   * starts a new conversation.
   */
  async getOrCreateAdminThread(userId: number) {
    const existing = await prisma.messageThread.findFirst({
      where: { type: 'ADMIN', userId, adminUserId: { not: null } },
      include: this.threadIncludeForViewer(userId),
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

    const created = await prisma.messageThread.create({
      data: { type: 'ADMIN', userId, adminUserId: adminId },
      include: this.threadIncludeForViewer(userId),
    });

    this.emitThreadCreated(created);
    return created;
  }

  /**
   * Return the user↔user thread between `userId` and `peerId`,
   * creating one if it doesn't exist. Participants are stored
   * in canonical order (smaller id first) to keep the unique
   * index from creating duplicate threads.
   *
   * Emits `thread:created` on socket when a new thread is created
   * so BOTH participants see it in their sidebar without a refresh.
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
      include: this.threadIncludeForViewer(userId),
    });
    if (existing) return existing;

    if (!peer.allowMessagesFromStrangers) {
      throw new AppError(
        'Người dùng này hiện không nhận tin nhắn từ người lạ',
        403,
        'MESSAGES_DISABLED',
      );
    }

    // Block check: if either side has blocked the other, refuse
    // to start a new thread. Existing threads are unaffected
    // (the block hides the row, the thread itself is still in
    // the DB so unblock restores access).
    if (await messagingSafetyService.isBlockedEitherDirection(userId, peerId)) {
      throw new AppError(
        'Bạn không thể bắt đầu cuộc trò chuyện với người dùng này',
        403,
        'USER_BLOCKED',
      );
    }

    const created = await prisma.messageThread.create({
      data: { type: 'USER', userAId: a, userBId: b },
      include: this.threadIncludeForViewer(userId),
    });

    this.emitThreadCreated(created);
    return created;
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
            mediaKind: true,
            attachments: { select: { id: true, mimeType: true, fileName: true } },
          },
        },
      },
    });

    // Hide threads whose peer is in our blocklist (we blocked them
    // OR they blocked us). The thread row stays in the DB so
    // unblocking restores the conversation immediately.
    const blockedIds = await this.getBlockedIds(userId);
    const filtered = threads.filter((t) => {
      const peers = this.collectThreadPeerIds(t);
      if (peers.some((pid) => blockedIds.has(pid))) return false;
      // Hard-deleted threads leave the sidebar entirely. We keep
      // the row in the DB so the other participant still has their
      // copy, but the deleter sees no trace in any tab.
      const pref = this.getPreferenceForViewer(t.preferences, userId);
      if (pref?.deletedAt) return false;
      return true;
    });

    const reads = await prisma.messageRead.findMany({
      where: { userId, threadId: { in: filtered.map((t) => t.id) } },
    });
    const readMap = new Map(reads.map((r) => [r.threadId, r.lastReadAt]));

    // Batch-fetch all nicknames for these threads so serializeThreadAsync
    // doesn't make one DB call per thread (N+1 fix).
    const peerIds = [...new Set(filtered.map((t) => {
      const p = t.type === 'ADMIN'
        ? (t.userId === userId ? t.adminUser?.id : t.user?.id)
        : (t.userAId === userId ? t.userB?.id : t.userA?.id);
      return p;
    }).filter(Boolean))] as number[];

    const nicknameRows = peerIds.length > 0
      ? await prisma.threadNickname.findMany({
          where: {
            ownerId: userId,
            targetId: { in: peerIds },
            threadId: { in: filtered.map((t) => t.id) },
          },
          select: { threadId: true, targetId: true, alias: true },
        })
      : [];

    const nicknameByThreadAndPeer = new Map<string, string | null>();
    for (const row of nicknameRows) {
      nicknameByThreadAndPeer.set(`${row.threadId}-${row.targetId}`, row.alias || null);
    }

    const serialized = await Promise.all(
      filtered.map((t) => this.serializeThreadAsync(t, userId, nicknameByThreadAndPeer)),
    );

    return filtered.map((t, idx) => {
      const lastMsg = t.messages[0] ?? null;
      const lastRead = readMap.get(t.id) ?? new Date(0);
      // Per-thread unread: count own-recipient messages newer than lastRead.
      // We don't store this in the row to keep the model simple; the
      // list endpoint already pays one query for messages, so we
      // piggyback on it. The store keeps a running count in memory
      // and refreshes from this endpoint on every load.
      const unread = lastMsg && lastMsg.senderId !== userId && lastMsg.createdAt > lastRead ? 1 : 0;
      return {
        ...serialized[idx],
        lastMessage: lastMsg ? this.serializeMessagePreview(lastMsg) : null,
        unreadCount: unread,
        preferences: this.getPreferenceForViewer(t.preferences, userId),
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
            mediaKind: true,
            attachments: { select: { id: true, mimeType: true, fileName: true } },
          },
        },
      },
    });

    // Hide threads the admin hard-deleted for themselves.
    // Mirrors the per-viewer filter in `listThreadsForUser`
    // (dòng 244) so the inbox doesn't re-populate deleted
    // chats after an F5 / sign-out / sign-in. The other side
    // of the conversation still has their own copy in the DB.
    const filtered = threads.filter((t) => {
      const pref = this.getPreferenceForViewer(t.preferences, adminId);
      if (pref?.deletedAt) return false;
      return true;
    });

    const reads = await prisma.messageRead.findMany({
      where: { userId: adminId, threadId: { in: filtered.map((t) => t.id) } },
    });
    const readMap = new Map(reads.map((r) => [r.threadId, r.lastReadAt]));

    // Batch-fetch all nicknames for these threads (N+1 fix).
    const peerIds = [...new Set(filtered.map((t) => {
      const p = t.userId === adminId ? t.adminUser?.id : t.user?.id;
      return p;
    }).filter(Boolean))] as number[];

    const nicknameRows = peerIds.length > 0
      ? await prisma.threadNickname.findMany({
          where: {
            ownerId: adminId,
            targetId: { in: peerIds },
            threadId: { in: filtered.map((t) => t.id) },
          },
          select: { threadId: true, targetId: true, alias: true },
        })
      : [];

    const nicknameByThreadAndPeer = new Map<string, string | null>();
    for (const row of nicknameRows) {
      nicknameByThreadAndPeer.set(`${row.threadId}-${row.targetId}`, row.alias || null);
    }

    const serialized = await Promise.all(
      filtered.map((t) => this.serializeThreadAsync(t, adminId, nicknameByThreadAndPeer)),
    );

    return filtered.map((t, idx) => {
      const lastMsg = t.messages[0] ?? null;
      const lastRead = readMap.get(t.id) ?? new Date(0);
      // For admin, unread means the user sent something the admin hasn't read
      const unread =
        lastMsg && lastMsg.senderId !== adminId && lastMsg.createdAt > lastRead ? 1 : 0;
      return {
        ...serialized[idx],
        lastMessage: lastMsg ? this.serializeMessagePreview(lastMsg) : null,
        unreadCount: unread,
        preferences: this.getPreferenceForViewer(t.preferences, adminId),
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
        parentMessage: {
          select: {
            id: true,
            senderId: true,
            content: true,
            deletedAt: true,
            recalledAt: true,
            sender: { select: { displayName: true, fullName: true, username: true } },
          },
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
    data: {
      content?: string;
      fileIds?: number[];
      parentMessageId?: number | null;
      postShare?: { postId: number };
      // Rich media: GIF (from GIPHY) or a sticker (our storage).
      media?: { url: string; kind: 'gif' | 'sticker' };
    },
  ) {
    const thread = await prisma.messageThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new AppError('Thread not found', 404, 'THREAD_NOT_FOUND');
    this.assertParticipant(thread, senderId);

    // Block check: enforce bidirectionally. If either side has
    // blocked the other, refuse to send (the row stays in the
    // DB for the other side, but we don't accept new writes).
    const peers = this.collectThreadPeerIds(thread);
    for (const peerId of peers) {
      if (peerId === senderId) continue;
      if (await messagingSafetyService.isBlockedEitherDirection(senderId, peerId)) {
        throw new AppError(
          'Không thể gửi tin nhắn: người dùng đã bị chặn',
          403,
          'USER_BLOCKED',
        );
      }
    }

    const content = (data.content ?? '').trim();
    const fileIds = Array.isArray(data.fileIds) ? data.fileIds.slice(0, MAX_ATTACHMENTS_PER_MESSAGE) : [];
    const hasPostShare = !!data.postShare;

    // Rich media (GIF / sticker). We accept a single URL + kind.
    // GIF urls come from GIPHY's CDN; sticker urls come from our own
    // sticker list (the client only ever sends URLs we served). We
    // validate the kind and basic URL shape; the URL is stored as-is.
    let mediaUrl: string | null = null;
    let mediaKind: string | null = null;
    if (data.media && data.media.url) {
      const kind = data.media.kind;
      if (kind !== 'gif' && kind !== 'sticker') {
        throw new AppError('Invalid media kind', 400, 'INVALID_MEDIA_KIND');
      }
      const url = data.media.url.trim();
      if (!/^https?:\/\//i.test(url) || url.length > 2000) {
        throw new AppError('Invalid media url', 400, 'INVALID_MEDIA_URL');
      }
      mediaUrl = url;
      mediaKind = kind;
    }

    if (!content && fileIds.length === 0 && !hasPostShare && !mediaUrl) {
      throw new AppError('Message must include text, files, media, or a post share', 400, 'EMPTY_MESSAGE');
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

    // Validate parentMessageId belongs to the same thread
    if (data.parentMessageId) {
      const parent = await prisma.message.findFirst({
        where: { id: data.parentMessageId, threadId },
        select: { id: true },
      });
      if (!parent) {
        throw new AppError('Parent message not found in this thread', 404, 'PARENT_NOT_FOUND');
      }
    }

    // Phase 6: Build post share preview data if a post share is included
    let postShareData: {
      postId: number;
      authorUsername: string;
      authorDisplay: string | null;
      authorAvatar: string | null;
      contentPreview: string;
      mediaThumbnail: string | null;
    } | null = null;

    if (hasPostShare && data.postShare) {
      const post = await prisma.socialPost.findUnique({
        where: { id: data.postShare.postId },
        include: {
          author: { select: { username: true, displayName: true, avatarUrl: true } },
          media: { where: { type: 'IMAGE' }, take: 1, orderBy: { sortOrder: 'asc' } },
        },
      });
      if (!post) throw new AppError('Bài viết không tồn tại', 404, 'POST_NOT_FOUND');

      postShareData = {
        postId: post.id,
        authorUsername: post.author.username,
        authorDisplay: post.author.displayName,
        authorAvatar: post.author.avatarUrl,
        contentPreview: post.content.slice(0, 200),
        mediaThumbnail: post.media[0]?.thumbnail ?? post.media[0]?.url ?? null,
      };
    }

    const message = await prisma.message.create({
      data: {
        threadId,
        senderId,
        content,
        mediaUrl,
        mediaKind,
        parentMessageId: data.parentMessageId ?? null,
        attachments: fileIds.length
          ? {
              create: await this.buildAttachmentCreates(fileIds),
            }
          : undefined,
        // Phase 6: Post share preview
        postShare: postShareData
          ? {
              create: postShareData,
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
        parentMessage: {
          select: {
            id: true,
            senderId: true,
            content: true,
            deletedAt: true,
            recalledAt: true,
            sender: { select: { displayName: true, fullName: true, username: true } },
          },
        },
        // Phase 6: Include post share in response
        postShare: postShareData ? true : false,
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

  // ─── Blocklist helpers (called by the listing code) ───

  /**
   * Return the set of userIds that the given viewer has blocked
   * OR has been blocked by. We use both directions so a row
   * disappears from BOTH sidebars once a block lands.
   *
   * Cached on the request via `getBlockedIds` — for now this
   * runs once per listThreads call which is fine (one query
   * per page load).
   */
  private async getBlockedIds(userId: number): Promise<Set<number>> {
    const rows = await prisma.userBlock.findMany({
      where: {
        OR: [
          { blockerId: userId },
          { blockedId: userId },
        ],
      },
      select: { blockerId: true, blockedId: true },
    });
    const ids = new Set<number>();
    for (const r of rows) {
      // Always add the OTHER side of the relationship (the peer
      // whose messages we want to hide from this viewer's
      // sidebar). If we blocked them, hide them; if they
      // blocked us, hide us from our own view.
      ids.add(r.blockerId === userId ? r.blockedId : r.blockerId);
    }
    return ids;
  }

  /**
   * Return the set of peer userIds for a thread, regardless of
   * thread type. Used to filter against the blocklist in
   * `listThreadsForUser`.
   */
  private collectThreadPeerIds(thread: {
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

  // ─── Thread preferences (per-user pin/mute/archive/mark-unread) ───

  /**
   * Per-user preference helper. The DB column is JSONB keyed by
   * userId, so two participants can pin/mute independently.
   * Read returns `null` (NOT undefined) when there's no entry so
   * JSON serialisation round-trips cleanly.
   */
  private getPreferenceForViewer(
    preferences: unknown,
    viewerId: number,
  ): ThreadPreference | null {
    if (!preferences || typeof preferences !== 'object') return null;
    const map = preferences as ThreadPreferencesMap;
    return map[String(viewerId)] ?? null;
  }

  /**
   * Set or clear a single preference slot for the current viewer
   * (e.g. `pinnedAt = now` or `mutedUntil = "2026-06-19T00:00:00Z"`).
   * Pass `null` to clear that slot.
   *
   * Emits a `thread:updated` socket event so other devices of the
   * same user see the change immediately.
   */
  async setThreadPreference(
    threadId: number,
    userId: number,
    slot: keyof ThreadPreference,
    value: string | null,
  ) {
    const thread = await prisma.messageThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new AppError('Thread not found', 404, 'THREAD_NOT_FOUND');
    this.assertParticipant(thread, userId);

    const current = (thread.preferences ?? {}) as ThreadPreferencesMap;
    const mine = { ...(current[String(userId)] ?? {}) };
    if (value === null) delete mine[slot];
    else mine[slot] = value;

    const next: ThreadPreferencesMap = { ...current, [String(userId)]: mine };
    await prisma.messageThread.update({
      where: { id: threadId },
      data: { preferences: next as any },
    });

    this.emitThreadUpdated(thread, { preferenceChanged: { userId, slot, value } });
    return this.getPreferenceForViewer(next, userId);
  }

  /**
   * "Archive" a thread for the current user. Sets `archivedAt`
   * so the sidebar can hide it under a separate "Archived" tab
   * without removing the messages.
   */
  async archiveThread(threadId: number, userId: number) {
    return this.setThreadPreference(threadId, userId, 'archivedAt', new Date().toISOString());
  }

  async unarchiveThread(threadId: number, userId: number) {
    return this.setThreadPreference(threadId, userId, 'archivedAt', null);
  }

  /**
   * Hard-delete a thread for the current viewer only. We set a
   * `deletedAt` slot in preferences (in addition to archivedAt)
   * so the sidebar can fully exclude the row from every tab.
   *
   * The row stays in the DB so the other participant keeps
   * their copy. This is the "Delete chat" UX in Messenger —
   * local-only, reversible by un-deleting via a future "Hidden"
   * tab if needed.
   */
  async deleteThreadForViewer(threadId: number, userId: number) {
    const now = new Date().toISOString();
    const thread = await prisma.messageThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new AppError('Thread not found', 404, 'THREAD_NOT_FOUND');
    this.assertParticipant(thread, userId);

    const current = (thread.preferences ?? {}) as ThreadPreferencesMap;
    const mine = { ...(current[String(userId)] ?? {}) };
    mine.archivedAt = now;
    mine.deletedAt = now;
    const next: ThreadPreferencesMap = { ...current, [String(userId)]: mine };
    await prisma.messageThread.update({
      where: { id: threadId },
      data: { preferences: next as any },
    });

    this.emitThreadUpdated(thread, { preferenceChanged: { userId, slot: 'deletedAt', value: now } });
    return this.getPreferenceForViewer(next, userId);
  }

  /**
   * "Mark as unread" — sets `markedUnreadAt` to "now" so the
   * sidebar shows a bold dot + the last-message timestamp
   * without bumping the row to the top. (The inbox re-sort
   * uses lastMessageAt; this just makes the row visually
   * appear as unread until the user clicks into it.)
   */
  async markThreadUnread(threadId: number, userId: number) {
    return this.setThreadPreference(threadId, userId, 'markedUnreadAt', new Date().toISOString());
  }

  /**
   * "Mute for X minutes" — Facebook-style. We accept a duration
   * in minutes and compute `mutedUntil = now + Xm`. Passing 0
   * clears the mute entirely (same as toggleMute off).
   *
   * Allowed durations: 0 / 15 / 60 / 480 (8h) / 1440 (24h) /
   * null (indefinite). We use the standard "minutes" value
   * so the client can post `{ durationMinutes: 0 }` for unmute.
   */
  async muteThreadFor(threadId: number, userId: number, durationMinutes: number | null) {
    let value: string | null;
    if (durationMinutes === null) {
      // Indefinite: use a far-future date (year 9999). Server
      // side check just compares to now, so any far-future
      // string works. We pick a real ISO date for clarity.
      value = '9999-12-31T23:59:59.999Z';
    } else if (durationMinutes === 0) {
      value = null;
    } else {
      value = new Date(Date.now() + durationMinutes * 60_000).toISOString();
    }
    return this.setThreadPreference(threadId, userId, 'mutedUntil', value);
  }

  /**
   * Generic "preference update" channel used by the route handler
   * for arbitrary `{ slot: 'pinnedAt' | 'mutedUntil' | 'archivedAt' | 'markedUnreadAt', value: ISOString | null }`
   * payloads. Keeps the route surface area small.
   */
  async updateThreadPreference(
    threadId: number,
    userId: number,
    slot: keyof ThreadPreference,
    value: string | null,
  ) {
    return this.setThreadPreference(threadId, userId, slot, value);
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
          // Only image files use the path as a thumbnail URL;
          // docs/PDFs/ZIPs have no thumbnail.
          thumbnailUrl: f.contentType.startsWith('image/') ? f.filePath : null,
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
    /** Pre-fetched nickname map: key = `${threadId}-${peerId}`, value = alias string */
    nicknameByThreadAndPeer?: Map<string, string | null>,
  ) {
    const peer = t.type === 'ADMIN'
      ? (t.userId === viewerId ? t.adminUser : t.user)
      : (t.userAId === viewerId ? t.userB : t.userA);

    let alias: string | null = null;
    if (peer) {
      const key = `${t.id}-${peer.id}`;
      alias = nicknameByThreadAndPeer?.get(key) ?? null;
    }

    // Read the per-viewer preference set straight from the row.
    // The `getThread` route includes `preferences` already; the
    // `listThreads` route reads it via `select` and passes it
    // through `getPreferenceForViewer`.
    const rawPrefs = (t as any).preferences;
    const preferences = rawPrefs !== undefined
      ? this.getPreferenceForViewer(rawPrefs, viewerId)
      : null;

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
      preferences,
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
    mediaKind?: string | null;
    attachments: { id: number; mimeType: string; fileName: string }[];
  }) {
    // For media-only messages the content is empty, so give the inbox
    // a friendly preview label instead of a blank last-message line.
    const content =
      m.content ||
      (m.mediaKind === 'gif' ? '🎬 GIF' : m.mediaKind === 'sticker' ? '🪄 Nhãn dán' : '');
    return {
      id: m.id,
      content,
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
    parentMessage?: {
      id: number;
      senderId: number;
      content: string;
      deletedAt: Date | null;
      recalledAt: Date | null;
      sender: { displayName: string | null; fullName: string | null; username: string };
    } | null;
  }) {
    return {
      id: m.id,
      threadId: m.threadId,
      senderId: m.senderId,
      // Recalled: content wiped, show empty (UI shows a stub).
      // Deleted: same — UI shows the "đã xoá" stub.
      content: m.deletedAt || m.recalledAt ? '' : m.content,
      // Rich media (GIF / sticker). Wiped on delete/recall like content.
      mediaUrl: m.deletedAt || m.recalledAt ? null : ((m as any).mediaUrl ?? null),
      mediaKind: m.deletedAt || m.recalledAt ? null : ((m as any).mediaKind ?? null),
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
        url: buildAttachmentUrl(a.file.filePath),
        thumbnailUrl: a.thumbnailUrl ? buildAttachmentUrl(a.thumbnailUrl) : null,
      })),
      parentMessageId: (m as any).parentMessageId ?? null,
      parentMessage: m.parentMessage
        ? {
            id: m.parentMessage.id,
            senderId: m.parentMessage.senderId,
            senderName:
              m.parentMessage.sender.displayName ??
              m.parentMessage.sender.fullName ??
              m.parentMessage.sender.username,
            content:
              m.parentMessage.deletedAt || m.parentMessage.recalledAt
                ? ''
                : m.parentMessage.content,
          }
        : null,
    };
  }

  // ─── Realtime fan-out ──────────────────────────────────

  private emitThreadCreated(thread: {
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
  }) {
    const emitter = this.getEmitter();
    if (!emitter) return;
    const participantIds = this.collectParticipantIds(thread);
    const payload = {
      threadId: thread.id,
      threadType: thread.type,
      participantIds,
      thread,
    };
    // Fire to BOTH participants so the freshly-created thread shows
    // up in the sidebar of whoever didn't initiate the create.
    // Sender will also receive it (so its own UI is consistent),
    // and the store treats it idempotently.
    for (const uid of participantIds) {
      emitter.emit('thread:created', { ...payload, viewerId: uid });
    }
  }

  private threadIncludeForViewer(_viewerId: number) {
    return {
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
    } as const;
  }

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
