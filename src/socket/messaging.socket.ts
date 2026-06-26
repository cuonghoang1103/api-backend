/**
 * ============================================================
 * Socket.IO Bridge — Direct Messaging
 * ============================================================
 *
 * Lazily initialised Socket.IO server attached to the shared
 * HTTP server in `src/index.ts`. Authentication reuses the
 * same JWT pattern as the REST middleware (`roleVersion` is
 * re-checked against the database to defeat stale tokens).
 *
 * Rooms:
 *   - user:<id>      per-user room (one socket can be in many)
 *   - admin:<id>     admin's "all threads" fan-out
 *   - thread:<id>    thread room (both participants join)
 *
 * Events emitted by the server:
 *   - thread:new-message  { threadId, threadType, participantIds, message }
 *   - thread:read         { threadId, threadType, participantIds, readerId, readAt }
 *
 * The actual Socket.IO instance is created in `initSocketServer()`
 * (called from index.ts). Until then `registerSocketEmitter()` returns
 * null so service code that fires events during boot doesn't crash.
 */

import type { Server as HttpServer } from 'http';
import type { Request } from 'express';
import { Server as IOServer, type Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { UnauthorizedError } from '../middleware/errorHandler.js';
import { extractToken, type JwtPayload } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
// Phase 3: Listen Together. Additive — registers its own listen:* socket
// handlers + listen:<roomId> rooms; does not touch the messaging logic.
import { registerListenTogether } from './listen-together.js';

export interface MessageEventPayload {
  threadId: number;
  threadType: string;
  participantIds: number[];
  message: unknown;
}

export interface ReadEventPayload {
  threadId: number;
  threadType: string;
  participantIds: number[];
  readerId: number;
  readAt: Date;
}

export interface MessagingEmitter {
  emit(event: 'thread:new-message', payload: MessageEventPayload): void;
  emit(event: 'thread:read', payload: ReadEventPayload): void;
  emit(event: 'message:updated' | 'thread:updated' | 'thread:created', payload: unknown): void;
  // ─── Social notifications (added 2026-06-20) ────────────────
  // The notification service emits this event to a single
  // receiver's `user:{id}` room. The shape is the row from
  // the SocialNotification table plus the embedded sender
  // profile (we keep the type loose to avoid a circular
  // import on the Prisma model).
  emit(event: 'social:notification', payload: { receiverId: number; [k: string]: unknown }): void;
  // ─── Feed has-new (Phase 5 home upgrade) ──────────────────
  // Lightweight ping so the feed banner can show "X bài viết mới"
  // without the client having to poll. Carries no payload besides
  // the viewerId so we know which user room to route to. The
  // client then calls /api/v1/social/posts?cursor=firstSeenId to
  // fetch the new ones (keeps the socket payload tiny).
  emit(event: 'feed:has-new', payload: { viewerId: number; count: number }): void;
  // ─── Post reactions (real-time breakdown) ───────────────
  // Emitted by reactPost() after the SocialLike row is written.
  // The frontend listener (usePostReactionsSocket) patches the
  // matching PostCard in place via updatePostReactions so every
  // connected viewer sees the new count without a refresh.
  // The `actorId` is included so the receiver can ignore their
  // own broadcast (their card already shows the optimistic
  // update from the click handler).
  emit(event: 'post:reacted', payload: {
    postId: number;
    likesCount: number;
    breakdown: Record<string, number>;
    actorId: number;
  }): void;
  emit(event: string, payload: unknown): void;
}

let io: IOServer | null = null;
let emitter: MessagingEmitter | null = null;

/**
 * Returns the shared emitter if the socket server has been
 * initialised, otherwise null. Service code calls this on every
 * message and silently no-ops if realtime isn't ready yet
 * (the next REST poll will catch the user up).
 */
  export function registerSocketEmitter(): MessagingEmitter | null {
    if (!emitter && io) {
      emitter = {
        emit(event: string, payload: unknown) {
          const p = payload as {
            threadId?: number;
            threadType?: string;
            participantIds?: number[];
            // ─── Social notifications (added 2026-06-20) ──────
            // The notification service emits events with
            // `receiverId` (single user) instead of a thread id.
            // We route them to the receiver's `user:{id}` room.
            receiverId?: number;
            // ─── Post reactions (added 2026-06-26) ───────────
            // Carries the postId whose counts just changed.
            postId?: number;
            actorId?: number;
          };

          // Notification path: route to the receiver's personal
          // room only. We deliberately don't broadcast to a
          // "global" room because notifications are 1-to-1.
          if (event === 'social:notification' && p && typeof p.receiverId === 'number') {
            io?.to(`user:${p.receiverId}`).emit(event, payload);
            return;
          }

          // Feed has-new: same 1-to-1 pattern — ping the viewer's
          // user room so only that user sees the banner. The
          // payload is tiny on purpose so the socket cost stays
          // negligible regardless of follower count.
          if (event === 'feed:has-new' && p && typeof (p as { viewerId?: number }).viewerId === 'number') {
            io?.to(`user:${(p as { viewerId: number }).viewerId}`).emit(event, payload);
            return;
          }

          // Post reactions: broadcast to the global feed room so
          // every connected viewer whose feed includes the post
          // can patch the count in place. We don't track per-post
          // rooms (would need a join on every feed page load);
          // the global fan-out is small (one event per reaction
          // click, payload is just counts) and the receiver-side
          // updatePostReactions no-ops if the post isn't in the
          // local feed slice.
          if (event === 'post:reacted' && p && typeof p.postId === 'number') {
            io?.emit('post:reacted', payload);
            return;
          }

          if (!p || !p.threadId) return;

        // Broadcast the event into the per-thread room so anyone
        // who has joined the conversation (both the sender's
        // other devices and the recipient) sees the new
        // message in real time.
        io?.to(`thread:${p.threadId}`).emit(event, payload);

        // ALSO broadcast to each participant's personal user room.
        // This is the bugfix for "user side không nhận được tin
        // nhắn": previously we only emitted to the thread room,
        // so a user who had the thread listed in the sidebar
        // but hadn't clicked into it yet (and therefore hadn't
        // joined the thread room) never got the update.
        if (Array.isArray(p.participantIds)) {
          for (const uid of p.participantIds) {
            io?.to(`user:${uid}`).emit(event, payload);
          }
        }
      },
    };
  }
  return emitter;
}

/**
 * Track the set of user IDs currently connected. Used so we can
 * tell a freshly-connected client "user X is online" and tell
 * peers when a user goes offline.
 */
const onlineUserIds = new Set<number>();

export function getOnlineUserIds(): number[] {
  return Array.from(onlineUserIds);
}

/**
 * Attach a Socket.IO server to the existing HTTP server. Idempotent
 * — calling twice is a no-op so hot reload doesn't double-bind.
 */
export function initSocketServer(httpServer: HttpServer): IOServer {
  if (io) return io;

  io = new IOServer(httpServer, {
    cors: {
      // Mirror the Express CORS allow-list logic by accepting
      // any origin here. Express CORS is the source of truth for
      // HTTP — we just need to hand the upgrade through.
      origin: true,
      credentials: true,
    },
    // Long-poll fallback is enabled by default; WebSocket-only would
    // break users behind corporate proxies that strip the upgrade header.
    transports: ['websocket', 'polling'],
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  // Auth middleware: read JWT from the same places the Express
  // middleware does (auth.token, Authorization header, or the
  // httpOnly `backend_token` cookie via `extractToken`). The
  // cookie path is the production case — the JWT lives in an
  // httpOnly cookie and is never exposed to JS.
  io.use(async (socket, next) => {
    try {
      const token = extractToken(socket.request as unknown as Request);
      if (!token) {
        return next(new UnauthorizedError('No authentication token provided'));
      }
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { roles: { include: { role: true } } },
      });
      if (!user || !user.enabled || !user.accountNonLocked) {
        return next(new UnauthorizedError('Invalid session'));
      }
      const userRoles = user.roles.map((ur) => ur.role.name.toUpperCase().replace('ROLE_', ''));
      // roleVersion may have advanced if the user changed password or
      // was re-assigned a role; if so, the old token is stale.
      if (Number(user.roleVersion) !== Number(decoded.roleVersion)) {
        return next(new UnauthorizedError('Session has been invalidated'));
      }
      socket.data.user = {
        id: user.id,
        username: user.username,
        roles: userRoles,
      };
      return next();
    } catch (err) {
      return next(err instanceof Error ? err : new UnauthorizedError('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as { id: number; username: string; roles: string[] };
    socket.join(`user:${user.id}`);
    if (user.roles.includes('ADMIN')) {
      socket.join(`admin:${user.id}`);
    }

    // AUTO-JOIN all thread rooms this user is a participant in.
    // This is the critical bugfix: previously a connected user
    // only received realtime events for threads they had
    // explicitly joined via `thread:join`. As a result, a user
    // who was on /messages (sidebar visible) but had not yet
    // clicked into a specific thread did NOT receive the
    // "new message" event when the other side sent something.
    // The sidebar's "đang hoạt động" indicator would freeze and
    // the unread badge would not update until they refreshed.
    //
    // We now eagerly join every thread this user is a
    // participant in. The set is small (one per conversation),
    // and the rooms are pre-keyed so the cost is just a few
    // hash lookups per connection. Reconnect logic is also
    // covered — the rooms are re-established on every
    // `connect` event.
    void (async () => {
      try {
        const threads = await prisma.messageThread.findMany({
          where: {
            OR: [
              { type: 'ADMIN', OR: [{ userId: user.id }, { adminUserId: user.id }] },
              { type: 'USER', OR: [{ userAId: user.id }, { userBId: user.id }] },
            ],
          },
          select: { id: true },
        });
        for (const t of threads) {
          socket.join(`thread:${t.id}`);
        }
      } catch (err) {
        // Non-fatal: realtime still works for explicit joins
        // and the user:* room below.
        logger.error('auto-join threads failed', { error: err instanceof Error ? err.message : String(err) });
      }
    })();

    // Track this connection. A user can be connected from multiple
    // tabs/devices — only mark them offline once every connection
    // for that user has closed.
    const wasOffline = !onlineUserIds.has(user.id);
    onlineUserIds.add(user.id);
    socket.data.isLastSocket = false;

    if (wasOffline) {
      // Broadcast "came online" to everyone (cheap — one event per
      // status change, not per socket).
      socket.broadcast.emit('presence:update', {
        userId: user.id,
        online: true,
        lastSeen: Date.now(),
      });
    }

    // Client can opt-in to a thread room explicitly (e.g. when the
    // user opens the panel for that thread). Idempotent — already
    // auto-joined, but this lets the client ensure join happens
    // even for threads created AFTER connect.
    socket.on('thread:join', (threadId: number) => {
      if (typeof threadId === 'number') socket.join(`thread:${threadId}`);
    });
    socket.on('thread:leave', (threadId: number) => {
      if (typeof threadId === 'number') socket.leave(`thread:${threadId}`);
    });

    // Phase 3: Listen Together — register the listen:* handlers for this
    // connection. Self-contained (own rooms + own disconnect listener),
    // so it can't interfere with messaging/presence above.
    registerListenTogether(io!, socket, user);

    // Typing indicator — broadcast to the other side of the
    // conversation (excludes the sender by default).
    socket.on('thread:typing', (payload: { threadId: number; isTyping: boolean }) => {
      if (!payload || typeof payload.threadId !== 'number') return;
      socket.to(`thread:${payload.threadId}`).emit('thread:typing', {
        threadId: payload.threadId,
        userId: user.id,
        isTyping: !!payload.isTyping,
      });
    });

    socket.on('disconnect', () => {
      // Only mark offline if this was the last open socket for the
      // user (multi-tab case).
      const socketsForUser = Array.from(io?.sockets.sockets.values() ?? [])
        .filter((s) => (s.data.user as { id: number } | undefined)?.id === user.id);
      if (socketsForUser.length === 0) {
        onlineUserIds.delete(user.id);
        // Broadcast "went offline" to everyone
        io?.emit('presence:update', {
          userId: user.id,
          online: false,
          lastSeen: Date.now(),
        });
      }
    });
  });

  // Mark emitter as ready
  registerSocketEmitter();

  return io;
}

export function getIO(): IOServer | null {
  return io;
}
