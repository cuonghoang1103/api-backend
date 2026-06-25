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

interface Room {
  id: string;
  hostId: number;
  hostName: string;
  members: Map<number, Member>;
  state: RoomState;
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
    audioUrl: t.audioUrl != null ? String(t.audioUrl) : null,
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
        cb({ ok: true, roomId: id, hostId: room.hostId, members: membersDTO(room), state: effectiveState(room) });
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
      cb({ ok: true, roomId: id, hostId: room.hostId, members: membersDTO(room), state: effectiveState(room) });
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
      updatedAt: Date.now(),
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
