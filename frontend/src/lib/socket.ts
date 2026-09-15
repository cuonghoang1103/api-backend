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

/**
 * ─── Cửa cho app desktop cắm socket CỦA NÓ vào ───────────────
 *
 * Web nối tới `window.location.origin`. App desktop chạy ở `app://cuongthai`,
 * nơi origin đó không phải máy chủ — nên nếu không có cửa này thì toàn bộ cây
 * messenger dùng lại được ở desktop sẽ nối vào hư không.
 *
 * ⚠️ Vì sao GẮN SOCKET CÓ SẴN chứ không chỉ truyền vào một URL: app desktop đã
 * có một socket của riêng nó (`realtime/socket.ts`) cho cuộc gọi và cho phiên
 * đăng nhập. Mở thêm một socket thứ hai cho cùng một người thì máy chủ vẫn
 * chịu được (nó đếm theo NGƯỜI, xem `messaging.socket.ts`), nhưng mọi sự kiện
 * sẽ tới hai nơi và app phải tự chống xử lý trùng — thêm một lớp có thể sai mà
 * không đổi lấy gì.
 *
 * Trên web thì biến này luôn `null` và mọi thứ chạy y như trước.
 */
let nhaCungCapNgoai: (() => Socket | Promise<Socket> | null) | null = null;

/**
 * Cắm socket từ bên ngoài. Gọi TRƯỚC khi dựng cây messenger.
 *
 * Truyền `null` để trả lại hành vi mặc định của web.
 */
export function datNguonSocket(f: (() => Socket | Promise<Socket> | null) | null): void {
  nhaCungCapNgoai = f;
  /* Bỏ socket cũ do chính mô-đun này tạo — giữ lại thì `getSocket()` vẫn trả
     về nó và cửa vừa mở thành vô nghĩa. */
  if (f && socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    connecting = null;
  }
}

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
  if (nhaCungCapNgoai) {
    const s = await nhaCungCapNgoai();
    if (!s) throw new Error('Chưa có kết nối realtime.');
    socket = s;
    return s;
  }
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
  /* Socket do bên ngoài cấp thì bên ngoài đóng — đóng hộ ở đây sẽ cắt luôn
     cuộc gọi và phiên đăng nhập của app desktop, hai thứ không liên quan gì
     tới việc rời trang tin nhắn. */
  if (nhaCungCapNgoai) { socket = null; connecting = null; return; }
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    connecting = null;
  }
}

export function getSocket(): Socket | null {
  /* Hỏi lại nguồn ngoài mỗi lần, không dùng bản đã nhớ: app desktop nối lại
     socket khi token được làm mới (`noiLaiVoiTokenMoi`), và khi đó bản nhớ ở
     đây trỏ vào một socket đã chết — cửa hàng tin nhắn sẽ gắn listener lên
     xác chết đó và im lặng vĩnh viễn. */
  if (nhaCungCapNgoai) {
    const s = nhaCungCapNgoai();
    return s && !(s instanceof Promise) ? s : socket;
  }
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

// ── Maker Lab: live device console ────────────────────────────
// The device gateway (`/device-ws`) fans every board event into the
// socket.io room `maker:device:<id>`; the backend re-checks ownership
// on join, so a room name alone grants nothing.

export interface MakerTelemetryEvent {
  deviceId: number;
  payload: Record<string, number | string | boolean>;
  recordedAt: string;
}
export interface MakerLogEvent {
  deviceId: number;
  level: string;
  message: string;
  at: string;
}
export interface MakerStatusEvent {
  deviceId: number;
  status: 'ONLINE' | 'OFFLINE' | 'ERROR' | 'UPDATING';
  firmwareVersion?: string;
  ipAddress?: string;
  rssi?: number;
  batteryPct?: number;
}
export interface MakerTranscriptEvent {
  deviceId: number;
  role: 'user' | 'bot';
  text: string;
  at: string;
}
export interface MakerCommandEvent {
  id: number;
  status: 'SENT' | 'ACKED' | 'FAILED';
}

/** Join a device room. Queues on the next connect, like joinThread. */
export function joinDeviceRoom(deviceId: number) {
  if (!socket) return;
  if (socket.connected) {
    socket.emit('maker:device:join', deviceId);
    return;
  }
  const s = socket as Socket;
  s.once('connect', () => s.emit('maker:device:join', deviceId));
}

export function leaveDeviceRoom(deviceId: number) {
  socket?.emit('maker:device:leave', deviceId);
}

/** One subscription helper per event; each returns its own unsubscribe. */
function onMaker<T>(event: string, cb: (p: T) => void): () => void {
  socket?.on(event, cb as (...args: unknown[]) => void);
  return () => {
    socket?.off(event, cb as (...args: unknown[]) => void);
  };
}

export const onDeviceTelemetry = (cb: (p: MakerTelemetryEvent) => void) =>
  onMaker<MakerTelemetryEvent>('maker:device:telemetry', cb);
export const onDeviceLog = (cb: (p: MakerLogEvent) => void) =>
  onMaker<MakerLogEvent>('maker:device:log', cb);
export const onDeviceStatus = (cb: (p: MakerStatusEvent) => void) =>
  onMaker<MakerStatusEvent>('maker:device:status', cb);
export const onDeviceTranscript = (cb: (p: MakerTranscriptEvent) => void) =>
  onMaker<MakerTranscriptEvent>('maker:device:transcript', cb);
export const onDeviceCommand = (cb: (p: MakerCommandEvent) => void) =>
  onMaker<MakerCommandEvent>('maker:command:update', cb);
