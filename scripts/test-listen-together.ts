/**
 * ============================================================
 * Listen Together — room logic smoke test (Phase 3)
 * ============================================================
 *
 * Drives the real `registerListenTogether` handlers with minimal
 * in-process io/socket mocks (no network, no JWT) to prove the room
 * lifecycle + the host-only authority model:
 *
 *   create → join → host controls sync to guests → guest control is
 *   ignored → late-joiner sync → leave → host-disconnect closes room.
 *
 * Run: npm run test:listen
 */
import { registerListenTogether, __listenRooms } from '../src/socket/listen-together.js';

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error('  ✗ FAIL:', msg);
    failures += 1;
  } else {
    console.log('  ✓', msg);
  }
}

interface Emitted { room: string; event: string; payload: any }

function makeIO(emitted: Emitted[]) {
  return {
    to: (room: string) => ({
      emit: (event: string, payload: any) => emitted.push({ room, event, payload }),
    }),
  } as any;
}

function makeClient(io: any, emitted: Emitted[], userId: number, username: string) {
  const handlers = new Map<string, (...a: any[]) => void>();
  const joined = new Set<string>();
  const socket = {
    id: `sock-${userId}-${Math.random().toString(36).slice(2)}`,
    join: (r: string) => joined.add(r),
    leave: (r: string) => joined.delete(r),
    to: (room: string) => ({
      // socket.to(room).emit = broadcast to room excluding sender
      emit: (event: string, payload: any) => emitted.push({ room, event, payload }),
    }),
    on: (ev: string, h: (...a: any[]) => void) => handlers.set(ev, h),
  } as any;
  registerListenTogether(io, socket, { id: userId, username, roles: [] });
  return {
    socket,
    joined,
    fire: (ev: string, payload?: any) =>
      new Promise<any>((resolve) => {
        const h = handlers.get(ev);
        if (!h) return resolve(undefined);
        // handlers take (payload, cb?) — pass a resolving cb
        h(payload, (res: any) => resolve(res));
        // for handlers without a cb (leave/control/disconnect) resolve next tick
        setTimeout(() => resolve(undefined), 0);
      }),
  };
}

async function main(): Promise<void> {
  console.log('\n=== Listen Together smoke test (Phase 3) ===\n');
  const emitted: Emitted[] = [];
  const io = makeIO(emitted);

  const trackA = { id: 5, title: 'Song A', artist: 'X', audioUrl: 'http://a', coverImage: null, durationSeconds: 200 };
  const trackB = { id: 9, title: 'Song B', artist: 'Y', audioUrl: 'http://b', coverImage: null, durationSeconds: 180 };

  const host = makeClient(io, emitted, 1, 'host');
  const guest = makeClient(io, emitted, 2, 'guest');

  // [1] CREATE
  console.log('[1] Create room');
  const created = await host.fire('listen:create', { track: trackA, isPlaying: true, positionSec: 10 });
  assert(created?.ok === true && typeof created.roomId === 'string', 'create returns ok + roomId');
  const roomId = created.roomId;
  assert(__listenRooms.has(roomId), 'room exists in registry');
  assert(created.hostId === 1, 'hostId is the creator');
  assert(created.members.length === 1 && created.members[0].userId === 1, 'host is the sole member');
  assert(host.joined.has(`listen:${roomId}`), 'host socket joined the room');

  // [2] JOIN
  console.log('\n[2] Guest joins');
  const joined = await guest.fire('listen:join', { roomId });
  assert(joined?.ok === true, 'join returns ok');
  assert(joined.state?.track?.id === '5', 'guest receives current track on join');
  assert(joined.state?.positionSec >= 10, 'guest position synced (>= host position, advanced by elapsed)');
  assert(joined.members.length === 2, 'members now host + guest');
  assert(guest.joined.has(`listen:${roomId}`), 'guest socket joined the room');
  assert(
    emitted.some((e) => e.event === 'listen:members' && e.payload.roomId === roomId && e.payload.members.length === 2),
    'listen:members broadcast on join',
  );

  // [3] HOST CONTROL → guest sync
  console.log('\n[3] Host controls playback');
  emitted.length = 0;
  await host.fire('listen:control', { roomId, track: trackB, isPlaying: false, positionSec: 42 });
  const stateEvt = emitted.find((e) => e.event === 'listen:state' && e.payload.roomId === roomId);
  assert(!!stateEvt, 'listen:state broadcast on host control');
  assert(stateEvt?.payload.track?.id === '9', 'state carries the new track');
  assert(stateEvt?.payload.isPlaying === false && stateEvt?.payload.positionSec === 42, 'state carries pause + seek');
  assert(__listenRooms.get(roomId)?.state.track?.id === '9', 'room state updated server-side');

  // [4] GUEST CONTROL is ignored (host-only authority)
  console.log('\n[4] Guest control is rejected');
  emitted.length = 0;
  await guest.fire('listen:control', { roomId, track: trackA, isPlaying: true, positionSec: 0 });
  assert(emitted.find((e) => e.event === 'listen:state') === undefined, 'no state broadcast from guest control');
  assert(__listenRooms.get(roomId)?.state.track?.id === '9', 'room state unchanged by guest (still track B)');

  // [5] SYNC REQUEST (late-joiner / resync)
  console.log('\n[5] Sync request');
  const sync = await guest.fire('listen:sync-request', { roomId });
  assert(sync?.ok === true && sync.state?.track?.id === '9', 'sync-request returns current state');
  assert(sync.hostId === 1, 'sync-request returns hostId');

  // [6] GUEST LEAVE
  console.log('\n[6] Guest leaves');
  emitted.length = 0;
  await guest.fire('listen:leave', { roomId });
  assert(__listenRooms.has(roomId), 'room still alive after guest leaves (host present)');
  assert(__listenRooms.get(roomId)?.members.size === 1, 'only host remains');
  assert(
    emitted.some((e) => e.event === 'listen:members' && e.payload.members.length === 1),
    'listen:members broadcast on leave',
  );

  // [7] HOST DISCONNECT closes the room
  console.log('\n[7] Host disconnect closes room');
  emitted.length = 0;
  await host.fire('disconnect');
  assert(!__listenRooms.has(roomId), 'room deleted when host disconnects');
  assert(
    emitted.some((e) => e.event === 'listen:closed' && e.payload.roomId === roomId),
    'listen:closed broadcast to room',
  );

  // [8] JOIN a non-existent room
  console.log('\n[8] Join missing room');
  const missing = await guest.fire('listen:join', { roomId: 'ZZZZZZ' });
  assert(missing?.ok === false && missing.error === 'not_found', 'join missing room → not_found');

  console.log('\n=== Result ===');
  if (failures === 0) {
    console.log('  ALL PASS ✅  (room lifecycle + host-only authority + cleanup clean)\n');
  } else {
    console.error(`  ${failures} ASSERTION(S) FAILED ❌\n`);
  }
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('  ✗ UNCAUGHT:', e);
  process.exit(1);
});
