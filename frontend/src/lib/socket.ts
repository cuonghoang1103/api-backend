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
  socket?.emit('thread:join', threadId);
}

export function leaveThread(threadId: number) {
  socket?.emit('thread:leave', threadId);
}

export function emitTyping(threadId: number, isTyping: boolean) {
  socket?.emit('thread:typing', { threadId, isTyping });
}
