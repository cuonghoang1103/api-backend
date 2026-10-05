/**
 * ============================================================
 * Listen Together — synchronized listening rooms (Phase 3)
 * ============================================================
 *
 * Reuses the EXISTING Socket.IO server (see messaging.socket.ts).
 * `registerListenTogether(io, socket, user)` is called once per
 * connection from inside the existing `io.on('connection')` block —
 * it ONLY adds new `listen:*` handlers + `listen:<roomId>` rooms and
 * never touches the chat/thread/presence logic.
 *
 * Rooms are in-memory and ephemeral: a room lives while its host is
 * connected and dies when the host leaves (guests get `listen:closed`).
 * No DB table / migration — this is live sync, not durable state.
 *
 * Authority model: only the HOST may push playback state
 * (`listen:control`). The server timestamps every state update so a
 * late joiner can compute the host's *current* position (position +
 * elapsed-since-update) and start in sync.
 *
 * Events (client → server):
 *   listen:create        {track?,isPlaying?,positionSec?} → ack {roomId,...}
 *   listen:join          {roomId}                          → ack {state,members,hostId}
 *   listen:leave         {roomId}
 *   listen:control       {roomId,track,isPlaying,positionSec}  (host only)
 *   listen:sync-request  {roomId}                          → ack {state,members,hostId}
 *
 * Events (server → clients in room):
 *   listen:state    {roomId,track,isPlaying,positionSec,updatedAt}
 *   listen:members  {roomId,members:[{userId,username}],hostId}
 *   listen:closed   {roomId}
 */

import type { Server as IOServer, Socket } from 'socket.io';
import { logger } from '../utils/logger.js';

interface TrackMeta {
  id: string;
  title: string;
  artist: string;
  audioUrl: string | null;
  coverImage: string | null;
  durationSeconds: number | null;
}

interface RoomState {
  track: TrackMeta | null;
  isPlaying: boolean;
  positionSec: number;
  updatedAt: number; // epoch ms when positionSec was captured
}

interface Member {
  userId: number;
  username: string;
  sockets: Set<string>;
}

interface ChatMsg { userId: number; username: string; text: string; at: number }
interface Room {
  id: string;
  hostId: number;
  hostName: string;
  members: Map<number, Member>;
  state: RoomState;
  /* 05/10/2026 — phòng nghe chung kiểu Discord (app desktop): tên, công khai, chat, hàng chờ chung. */
  name: string;
  isPublic: boolean;
  chat: ChatMsg[];
  queue: TrackMeta[];
}

// Module-level registry — survives across connections (one process).
const rooms = new Map<string, Room>();

// ── Now-listening presence (Phase 3) ──────────────────────────────
// userId → what they're currently playing. Broadcast to everyone so
// friends/profiles can show a "🎧 đang nghe …" badge. Cleared when the
// user pauses/stops or their last socket disconnects. Best-effort,
// non-durable (in-memory).
const nowListening = new Map<number, { username: string; track: TrackMeta; at: number }>();

function nowPlayingList(): Array<{ userId: number; username: string; track: TrackMeta }> {
  return Array.from(nowListening.entries()).map(([userId, v]) => ({
    userId,
    username: v.username,
    track: v.track,
  }));
}

interface ConnUser {
  id: number;
  username: string;
  roles: string[];
}

const roomKey = (id: string) => `listen:${id}`;

function genRoomId(): string {
  let id = '';
  do {
    id = Math.random().toString(36).slice(2, 8).toUpperCase();
  } while (rooms.has(id));
  return id;
}

function membersDTO(room: Room): Array<{ userId: number; username: string }> {
  return Array.from(room.members.values()).map((m) => ({
    userId: m.userId,
    username: m.username,
  }));
}

// The host's *current* state, advancing position by the time elapsed
// since the last update (only while playing). Lets a late joiner start
// in sync instead of at a stale timestamp.
function effectiveState(room: Room): RoomState {
  const s = room.state;
  if (!s.isPlaying || !s.track) return { ...s };
  const elapsed = (Date.now() - s.updatedAt) / 1000;
  return {
    track: s.track,
    isPlaying: true,
    positionSec: Math.max(0, s.positionSec + elapsed),
    updatedAt: Date.now(),
  };
}

function sanitizeTrack(raw: unknown): TrackMeta | null {
  if (!raw || typeof raw !== 'object') return null;
  const t = raw as Record<string, unknown>;
  if (t.id === undefined || t.id === null) return null;
  return {
    id: String(t.id),
    title: String(t.title ?? 'Unknown'),
    artist: String(t.artist ?? ''),
    // Chặn lược đồ nguy hiểm (`javascript:`/`file:`/`data:`) — key R2 trần và link http vẫn qua như cũ.
    audioUrl: t.audioUrl != null && !/^\s*(javascript|data|file|vbscript):/i.test(String(t.audioUrl)) ? String(t.audioUrl).slice(0, 700) : null,
    coverImage: t.coverImage != null ? String(t.coverImage) : null,
    durationSeconds: Number.isFinite(Number(t.durationSeconds)) ? Number(t.durationSeconds) : null,
  };
}

export function registerListenTogether(io: IOServer, socket: Socket, user: ConnUser): void {
  // Add this socket as a member of `room` (multi-tab safe).
  const addMember = (room: Room) => {
    let m = room.members.get(user.id);
    if (!m) {
      m = { userId: user.id, username: user.username, sockets: new Set() };
      room.members.set(user.id, m);
    }
    m.sockets.add(socket.id);
    socket.join(roomKey(room.id));
  };

  // Remove THIS socket from `room`. Returns true if the user has no
  // remaining sockets in the room (i.e. they fully left).
  const removeSocket = (room: Room): boolean => {
    const m = room.members.get(user.id);
    if (!m) return false;
    m.sockets.delete(socket.id);
    socket.leave(roomKey(room.id));
    if (m.sockets.size === 0) {
      room.members.delete(user.id);
      return true;
    }
    return false;
  };

  // Called when the user fully leaves a room (last socket gone, or
  // explicit leave). Closes the room if the host left.
  const finalizeLeave = (room: Room) => {
    if (room.hostId === user.id) {
      io.to(roomKey(room.id)).emit('listen:closed', { roomId: room.id });
      rooms.delete(room.id);
    } else {
      io.to(roomKey(room.id)).emit('listen:members', {
        roomId: room.id,
        members: membersDTO(room),
        hostId: room.hostId,
      });
      if (room.members.size === 0) rooms.delete(room.id);
    }
  };

  socket.on('listen:create', (payload: any, cb?: (res: unknown) => void) => {
    try {
      const id = genRoomId();
      const room: Room = {
        id,
        hostId: user.id,
        hostName: user.username,
        members: new Map(),
        name: String(payload?.name ?? '').trim().slice(0, 60) || `Phòng của ${user.username}`,
        isPublic: payload?.isPublic !== false,
        chat: [],
        queue: [],
        state: {
          track: sanitizeTrack(payload?.track),
          isPlaying: !!payload?.isPlaying,
          positionSec: Number(payload?.positionSec) || 0,
          updatedAt: Date.now(),
        },
      };
      rooms.set(id, room);
      addMember(room);
      if (typeof cb === 'function') {
        cb({ ok: true, roomId: id, hostId: room.hostId, members: membersDTO(room), state: effectiveState(room), name: room.name, chat: room.chat, queue: room.queue, serverNow: Date.now() });
      }
      io.to(roomKey(id)).emit('listen:members', { roomId: id, members: membersDTO(room), hostId: room.hostId });
    } catch (err) {
      logger.error('[listen] create failed', { error: err instanceof Error ? err.message : String(err) });
      if (typeof cb === 'function') cb({ ok: false, error: 'create_failed' });
    }
  });

  socket.on('listen:join', (payload: any, cb?: (res: unknown) => void) => {
    const id = String(payload?.roomId ?? '').toUpperCase();
    const room = rooms.get(id);
    if (!room) {
      if (typeof cb === 'function') cb({ ok: false, error: 'not_found' });
      return;
    }
    addMember(room);
    if (typeof cb === 'function') {
      cb({ ok: true, roomId: id, hostId: room.hostId, members: membersDTO(room), state: effectiveState(room), name: room.name, chat: room.chat, queue: room.queue, serverNow: Date.now() });
    }
    io.to(roomKey(id)).emit('listen:members', { roomId: id, members: membersDTO(room), hostId: room.hostId });
  });

  socket.on('listen:leave', (payload: any) => {
    const id = String(payload?.roomId ?? '').toUpperCase();
    const room = rooms.get(id);
    if (!room) return;
    const fullyLeft = removeSocket(room);
    if (fullyLeft) finalizeLeave(room);
  });

  socket.on('listen:control', (payload: any) => {
    const id = String(payload?.roomId ?? '').toUpperCase();
    const room = rooms.get(id);
    // Only the host may drive playback.
    if (!room || room.hostId !== user.id) return;
    room.state = {
      track: sanitizeTrack(payload?.track) ?? room.state.track,
      isPlaying: !!payload?.isPlaying,
      positionSec: Number(payload?.positionSec) || 0,
      // App desktop gửi kèm `at` = giờ MÁY CHỦ (đã đồng bộ đồng hồ) lúc chụp vị trí ⇒ bù được
      // độ trễ chặng chủ phòng → máy chủ. Lệch quá 3 giây coi như sai, dùng giờ nhận.
      updatedAt: Number.isFinite(Number(payload?.at)) && Math.abs(Date.now() - Number(payload.at)) < 3000 ? Number(payload.at) : Date.now(),
    };
    // Broadcast to everyone in the room EXCEPT the host (sender).
    socket.to(roomKey(id)).emit('listen:state', { roomId: id, ...room.state });
  });

  socket.on('listen:sync-request', (payload: any, cb?: (res: unknown) => void) => {
    const id = String(payload?.roomId ?? '').toUpperCase();
    const room = rooms.get(id);
    if (!room) {
      if (typeof cb === 'function') cb({ ok: false, error: 'not_found' });
      return;
    }
    if (typeof cb === 'function') {
      cb({ ok: true, state: effectiveState(room), members: membersDTO(room), hostId: room.hostId });
    }
  });

  /* ── Phòng nghe chung mở rộng (05/10/2026) ───────────────────────────── */
  const laThanhVien = (room: Room) => room.members.has(user.id);
  // Đồng bộ đồng hồ (kiểu NTP): client đo khứ hồi, lấy mẫu RTT nhỏ nhất ⇒ lệch đồng hồ vài ms.
  socket.on('listen:time', (_p: any, cb?: (res: unknown) => void) => { if (typeof cb === 'function') cb({ serverNow: Date.now() }); });
  socket.on('listen:list', (_p: any, cb?: (res: unknown) => void) => {
    if (typeof cb !== 'function') return;
    cb({ ok: true, rooms: Array.from(rooms.values()).filter((r) => r.isPublic).slice(0, 50).map((r) => ({
      roomId: r.id, name: r.name, hostId: r.hostId, hostName: r.hostName, members: r.members.size,
      isPlaying: r.state.isPlaying, track: r.state.track ? { title: r.state.track.title, artist: r.state.track.artist, coverImage: r.state.track.coverImage } : null,
    })) });
  });
  let chatGanNhat = 0;
  socket.on('listen:chat', (payload: any) => {
    const room = rooms.get(String(payload?.roomId ?? '').toUpperCase());
    const text = String(payload?.text ?? '').trim().slice(0, 300);
    if (!room || !laThanhVien(room) || !text || Date.now() - chatGanNhat < 400) return;
    chatGanNhat = Date.now();
    const msg: ChatMsg = { userId: user.id, username: user.username, text, at: Date.now() };
    room.chat.push(msg);
    if (room.chat.length > 50) room.chat.shift();
    io.to(roomKey(room.id)).emit('listen:chat', { roomId: room.id, ...msg });
  });
  let camXucGanNhat = 0;
  socket.on('listen:react', (payload: any) => {
    const room = rooms.get(String(payload?.roomId ?? '').toUpperCase());
    const emoji = String(payload?.emoji ?? '').slice(0, 8);
    if (!room || !laThanhVien(room) || !emoji || Date.now() - camXucGanNhat < 250) return;
    camXucGanNhat = Date.now();
    io.to(roomKey(room.id)).emit('listen:react', { roomId: room.id, userId: user.id, username: user.username, emoji });
  });
  // Hàng chờ chung: thành viên nào cũng đề xuất được; chủ phòng gỡ/phát.
  socket.on('listen:queue-add', (payload: any) => {
    const room = rooms.get(String(payload?.roomId ?? '').toUpperCase());
    const t = sanitizeTrack(payload?.track);
    if (!room || !laThanhVien(room) || !t || (!t.audioUrl && !/^\d+$/.test(t.id)) || room.queue.length >= 50) return;
    if (room.queue.some((q) => q.id === t.id)) return;
    room.queue.push(t);
    io.to(roomKey(room.id)).emit('listen:queue', { roomId: room.id, queue: room.queue, by: user.username, added: t.title });
  });
  socket.on('listen:queue-remove', (payload: any) => {
    const room = rooms.get(String(payload?.roomId ?? '').toUpperCase());
    if (!room || room.hostId !== user.id) return;
    const id = String(payload?.trackId ?? '');
    room.queue = room.queue.filter((q) => q.id !== id);
    io.to(roomKey(room.id)).emit('listen:queue', { roomId: room.id, queue: room.queue });
  });

  // ── Now-listening presence handlers ──
  socket.on('nowplaying:set', (payload: any) => {
    const track = sanitizeTrack(payload?.track);
    if (track) {
      nowListening.set(user.id, { username: user.username, track, at: Date.now() });
    } else {
      nowListening.delete(user.id);
    }
    // Broadcast to everyone else (the sender already knows their own).
    socket.broadcast.emit('nowplaying:update', {
      userId: user.id,
      username: user.username,
      track: track ?? null,
    });
  });

  socket.on('nowplaying:list', (_payload: any, cb?: (res: unknown) => void) => {
    if (typeof cb === 'function') cb({ ok: true, items: nowPlayingList() });
  });

  // Cleanup: when this socket disconnects, drop it from every room it
  // was in. Uses its OWN disconnect listener (additive) so the existing
  // presence/disconnect handler in messaging.socket.ts is untouched.
  socket.on('disconnect', () => {
    for (const room of Array.from(rooms.values())) {
      const m = room.members.get(user.id);
      if (m && m.sockets.has(socket.id)) {
        const fullyLeft = removeSocket(room);
        if (fullyLeft) finalizeLeave(room);
      }
    }

    // Clear now-listening only if this was the user's LAST socket
    // (multi-tab safe — another tab may still be playing).
    if (nowListening.has(user.id)) {
      const stillConnected = Array.from(io.sockets.sockets.values()).some(
        (s) => s.id !== socket.id && (s.data.user as { id?: number } | undefined)?.id === user.id,
      );
      if (!stillConnected) {
        nowListening.delete(user.id);
        socket.broadcast.emit('nowplaying:update', { userId: user.id, username: user.username, track: null });
      }
    }
  });
}

// Exposed for tests.
export const __listenRooms = rooms;
