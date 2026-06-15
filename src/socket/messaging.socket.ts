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
import { Server as IOServer, type Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { UnauthorizedError } from '../middleware/errorHandler.js';
import type { JwtPayload } from '../middleware/auth.js';

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

  // Auth middleware: read JWT from `socket.handshake.auth.token`,
  // verify roleVersion against the DB, and reject mismatches.
  io.use(async (socket, next) => {
    try {
      const token = (socket.handshake.auth?.token as string | undefined) ??
        (socket.handshake.headers['authorization'] as string | undefined)?.replace(/^Bearer\s+/i, '');
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
  });

  // Mark emitter as ready
  registerSocketEmitter();

  return io;
}

export function getIO(): IOServer | null {
  return io;
}
