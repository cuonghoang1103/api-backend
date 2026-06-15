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
        io?.to(buildThreadRoom(payload)) /* no-op, just to keep tree-shake honest */;
        // Re-emit to per-user rooms so each participant's sidebar updates
        if (event === 'thread:new-message') {
          const p = payload as MessageEventPayload;
          for (const uid of p.participantIds) io?.to(`user:${uid}`).emit('thread:updated', p);
        } else if (event === 'thread:read') {
          const p = payload as ReadEventPayload;
          for (const uid of p.participantIds) io?.to(`user:${uid}`).emit('thread:updated', p);
        }
      },
    };
  }
  return emitter;
}

function buildThreadRoom(payload: unknown): string {
  const p = payload as { threadId?: number };
  return p.threadId ? `thread:${p.threadId}` : '';
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
    // user opens the panel for that thread). Idempotent.
    socket.on('thread:join', (threadId: number) => {
      if (typeof threadId === 'number') socket.join(`thread:${threadId}`);
    });
    socket.on('thread:leave', (threadId: number) => {
      if (typeof threadId === 'number') socket.leave(`thread:${threadId}`);
    });

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
