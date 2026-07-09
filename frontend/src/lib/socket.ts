'use client';

/**
 * ============================================================
 * Socket.IO Client Wrapper — Direct Messaging
 * ============================================================
 *
 * Lazy singleton. We don't want to open a WebSocket on every
 * page load — the messaging store decides when to connect
 * (after the user logs in) and when to disconnect (on logout).
 *
 * The token comes from the auth store. The backend
 * `/socket.io/` handshake accepts a JWT via `auth.token`,
 * and verifies it against the database (roleVersion check).
 */

import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

let socket: Socket | null = null;
let connecting: Promise<Socket> | null = null;

function getToken(): string | null {
  // The JWT lives in the httpOnly `backend_token` cookie and is NOT
  // directly readable from JS. We rely on the auth store having
  // already hydrated the user from /profile, but the *real* token
  // must reach the server. The simplest robust path: let the
  // browser send the cookie via `withCredentials` (Socket.IO
  // forwards it on the upgrade request). The server's
  // `auth.ts` `extractToken()` falls back to the `backend_token`
  // cookie when the explicit `auth.token` is absent.
  //
  // We still attempt to attach `auth.token` from the store for
  // cases where the cookie is partitioned (Safari ITP).
  const state = useAuthStore.getState();
  return (state as any).token ?? null;
}

export async function connectSocket(): Promise<Socket> {
  if (socket?.connected) return socket;
  if (connecting) return connecting;

  connecting = new Promise<Socket>((resolve, reject) => {
    const token = getToken();
    const url = typeof window === 'undefined' ? '' : window.location.origin;

    const s = io(url, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: token ? { token } : undefined,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 10000,
    });

    let settled = false;
    const finish = (err: Error | null) => {
      if (settled) return;
      settled = true;
      if (err) {
        connecting = null;
        reject(err);
      } else {
        socket = s;
        resolve(s);
      }
    };

    s.once('connect', () => finish(null));
    s.once('connect_error', (err) => {
      // First-attempt error — surface so the store can show a
      // user-visible message. After the first connection we
      // let Socket.IO's reconnection logic handle retries.
      if (!socket) finish(err);
    });

    // Safety timeout in case neither event fires
    setTimeout(() => {
      if (!settled) {
        if (s.connected) finish(null);
        else finish(new Error('Socket connection timed out'));
      }
    }, 12000);
  });

  return connecting;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    connecting = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

export function joinThread(threadId: number) {
  // Socket may not be connected yet (e.g. on a fresh page load
  // the store calls openThread before the 'connect' event
  // resolves). Queue the join: store the room and re-emit on
  // next 'connect' so the request never gets lost.
  if (!socket) return;
  if (socket.connected) {
    socket.emit('thread:join', threadId);
    return;
  }
  // Listen for the next connect and re-emit
  const s = socket as Socket;
  s.once('connect', () => s.emit('thread:join', threadId));
}

export function leaveThread(threadId: number) {
  socket?.emit('thread:leave', threadId);
}

/**
 * Subscribe to per-post reaction rooms so this client receives
 * `post:reacted` for the posts currently in its feed (the backend now
 * emits reactions per-`post:<id>` room instead of a global broadcast).
 * Queues on the next `connect` if the socket isn't up yet, mirroring
 * `joinThread`, so subscriptions survive a fresh page load / reconnect.
 */
export function subscribePosts(ids: number[]) {
  if (!socket || ids.length === 0) return;
  if (socket.connected) {
    socket.emit('post:subscribe', ids);
    return;
  }
  const s = socket as Socket;
  s.once('connect', () => s.emit('post:subscribe', ids));
}

export function unsubscribePosts(ids: number[]) {
  if (!socket?.connected || ids.length === 0) return;
  socket.emit('post:unsubscribe', ids);
}

export function emitTyping(threadId: number, isTyping: boolean) {
  if (!socket?.connected) return;
  socket.emit('thread:typing', { threadId, isTyping });
}

// ════════════════════════════════════════════════════════════════
// Phase 3: Listen Together — synchronized listening rooms.
// Reuses the SAME singleton socket above (never opens a second one).
// All helpers no-op safely when the socket isn't connected.
// ════════════════════════════════════════════════════════════════

export interface ListenTrackMeta {
  id: string;
  title: string;
  artist: string;
  audioUrl: string | null;
  coverImage: string | null;
  durationSeconds: number | null;
}
export interface ListenState {
  roomId?: string;
  track: ListenTrackMeta | null;
  isPlaying: boolean;
  positionSec: number;
  updatedAt?: number;
}
export interface ListenMember { userId: number; username: string }

// Promise wrapper around an ack-based emit with a timeout so the UI
// never hangs if the server doesn't answer.
function emitAck<T>(event: string, payload: unknown, timeoutMs = 6000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error('Socket not connected'));
      return;
    }
    let done = false;
    const t = setTimeout(() => {
      if (!done) {
        done = true;
        reject(new Error('Listen request timed out'));
      }
    }, timeoutMs);
    socket.emit(event, payload, (res: T) => {
      if (done) return;
      done = true;
      clearTimeout(t);
      resolve(res);
    });
  });
}

export function listenCreate(init: {
  track: ListenTrackMeta | null;
  isPlaying: boolean;
  positionSec: number;
}): Promise<{ ok: boolean; roomId?: string; hostId?: number; members?: ListenMember[]; state?: ListenState; error?: string }> {
  return emitAck('listen:create', init);
}

export function listenJoin(roomId: string): Promise<{
  ok: boolean;
  hostId?: number;
  members?: ListenMember[];
  state?: ListenState;
  error?: string;
}> {
  return emitAck('listen:join', { roomId });
}

export function listenLeave(roomId: string) {
  socket?.emit('listen:leave', { roomId });
}

export function listenControl(payload: {
  roomId: string;
  track: ListenTrackMeta | null;
  isPlaying: boolean;
  positionSec: number;
}) {
  if (!socket?.connected) return;
  socket.emit('listen:control', payload);
}

export function listenSyncRequest(roomId: string): Promise<{
  ok: boolean;
  state?: ListenState;
  members?: ListenMember[];
  hostId?: number;
}> {
  return emitAck('listen:sync-request', { roomId });
}

// Subscriptions — each returns an unsubscribe fn.
export function onListenState(cb: (s: ListenState) => void): () => void {
  socket?.on('listen:state', cb);
  return () => { socket?.off('listen:state', cb); };
}
export function onListenMembers(
  cb: (p: { roomId: string; members: ListenMember[]; hostId: number }) => void,
): () => void {
  socket?.on('listen:members', cb);
  return () => { socket?.off('listen:members', cb); };
}
export function onListenClosed(cb: (p: { roomId: string }) => void): () => void {
  socket?.on('listen:closed', cb);
  return () => { socket?.off('listen:closed', cb); };
}

// ── Now-listening presence (best-effort; only when connected) ──
export function emitNowPlaying(track: ListenTrackMeta | null) {
  if (!socket?.connected) return;
  socket.emit('nowplaying:set', { track });
}
export function requestNowPlaying(): Promise<{
  ok: boolean;
  items?: Array<{ userId: number; username: string; track: ListenTrackMeta }>;
}> {
  return emitAck('nowplaying:list', {});
}
export function onNowPlaying(
  cb: (p: { userId: number; username: string; track: ListenTrackMeta | null }) => void,
): () => void {
  socket?.on('nowplaying:update', cb);
  return () => { socket?.off('nowplaying:update', cb); };
}
