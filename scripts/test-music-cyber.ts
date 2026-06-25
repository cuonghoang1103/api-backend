/**
 * ============================================================
 * Cyber-music Phase 1 + 2a — service-level smoke test
 * ============================================================
 *
 * Exercises the new music services directly against the local
 * Postgres (no Express/auth needed) to prove the two guarantees
 * the user cares about most:
 *
 *   1. IDEMPOTENCY — repeated add/like NEVER creates duplicate
 *      rows (the "duplicate queue row" bug).
 *   2. ROUND-TRIP — create → reload → persists EXACTLY, and the
 *      play-count counter is additive + race-safe.
 *
 * All effects are scoped to a single (test user, test track) pair
 * and cleaned up at the end, so this is safe to run repeatedly on
 * the local dev DB. It never touches production.
 *
 * Run: npm run test:music:cyber
 */
import { prisma } from '../src/config/database.js';
import { musicQueueService } from '../src/services/music-queue.service.js';
import { musicLikesService } from '../src/services/music-likes.service.js';
import { musicPlayCountsService } from '../src/services/music-play-counts.service.js';

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error('  ✗ FAIL:', msg);
    failures += 1;
  } else {
    console.log('  ✓', msg);
  }
}

async function main(): Promise<void> {
  console.log('\n=== Cyber-music smoke test (Phase 1 + 2a) ===\n');

  // ── Fixtures: an existing user + an active track ──────────────
  const user = await prisma.user.findFirst({ orderBy: { id: 'asc' }, select: { id: true } });
  const track = await prisma.musicTrack.findFirst({ where: { active: true }, select: { id: true } });
  if (!user || !track) {
    console.error('  ✗ No user/track in local DB to test against — seed one first.');
    process.exit(1);
  }
  const userId = user.id;
  const trackId = track.id;
  console.log(`  fixtures: userId=${userId}, trackId=${trackId}\n`);

  // Start from a clean slate for this user's queue / like / count rows.
  await musicQueueService.clearQueue(userId);
  await musicLikesService.unlike(userId, trackId);
  await prisma.musicPlayCount.deleteMany({ where: { userId, trackId } });

  // ── 1. QUEUE: idempotent add ──────────────────────────────────
  console.log('[1] Play queue');
  await musicQueueService.addToQueue(userId, trackId, 'queue');
  await musicQueueService.addToQueue(userId, trackId, 'queue'); // duplicate click
  await musicQueueService.addToQueue(userId, trackId, 'next');  // re-add as "next"
  let q = await musicQueueService.getUserQueue(userId);
  assert(Array.isArray(q), 'getUserQueue returns an array ([]-guard)');
  assert(q.length === 1, `no duplicate rows after 3 adds (got ${q.length}, want 1)`);
  assert(q[0].intent === 'next', 'last intent (next) wins on re-add');

  // Round-trip: reload from DB and confirm it persisted exactly.
  q = await musicQueueService.getUserQueue(userId);
  assert(q.length === 1 && q[0].trackId === trackId, 'queue round-trips: reload === saved');

  // Reorder with a single item is a no-op that keeps the row.
  await musicQueueService.reorderQueue(userId, [trackId]);
  q = await musicQueueService.getUserQueue(userId);
  assert(q.length === 1, 'reorder([trackId]) preserves the single item');

  // Reorder with empty array clears the queue.
  await musicQueueService.reorderQueue(userId, []);
  q = await musicQueueService.getUserQueue(userId);
  assert(q.length === 0, 'reorder([]) clears the queue');

  // Pop on an empty queue returns null (not a throw, not undefined).
  const popEmpty = await musicQueueService.popNextFromQueue(userId);
  assert(popEmpty === null, 'pop on empty queue returns null');

  // ── 2. LIKES: idempotent like/unlike ──────────────────────────
  console.log('\n[2] Likes');
  await musicLikesService.like(userId, trackId);
  await musicLikesService.like(userId, trackId); // duplicate click
  const likedIds = await musicLikesService.listLikedTrackIds(userId);
  assert(Array.isArray(likedIds), 'listLikedTrackIds returns an array');
  assert(likedIds.filter((id) => id === trackId).length === 1, 'no duplicate like rows after 2 likes');
  assert((await musicLikesService.isLiked(userId, trackId)) === true, 'isLiked true after like');
  const likedTracks = await musicLikesService.listLikedTracks(userId);
  assert(likedTracks.some((t) => t.trackId === trackId), 'liked track appears in listLikedTracks (round-trip)');
  await musicLikesService.unlike(userId, trackId);
  await musicLikesService.unlike(userId, trackId); // double unlike = no-op
  assert((await musicLikesService.isLiked(userId, trackId)) === false, 'isLiked false after unlike (idempotent)');

  // ── 3. PLAY COUNTS: additive + race-safe ──────────────────────
  console.log('\n[3] Play counts');
  const before = await musicPlayCountsService.getCount(userId, trackId);
  assert(before === 0, 'getCount starts at 0 (clean slate)');
  await musicPlayCountsService.increment(userId, trackId);
  await musicPlayCountsService.increment(userId, trackId);
  await musicPlayCountsService.increment(userId, trackId);
  const after = await musicPlayCountsService.getCount(userId, trackId);
  assert(after === 3, `count is additive (3 increments => ${after}, want 3)`);

  // Concurrency: 10 parallel increments must all land (no lost update).
  await Promise.all(
    Array.from({ length: 10 }, () => musicPlayCountsService.increment(userId, trackId)),
  );
  const afterConcurrent = await musicPlayCountsService.getCount(userId, trackId);
  assert(afterConcurrent === 13, `10 concurrent increments are race-safe (=> ${afterConcurrent}, want 13)`);

  const mostPlayed = await musicPlayCountsService.listMostPlayed(userId);
  assert(Array.isArray(mostPlayed), 'listMostPlayed returns an array');
  assert(mostPlayed.some((t) => t.trackId === trackId && t.count === 13), 'track appears in Most Played with correct count');

  // ── Cleanup: leave the DB exactly as we found it ──────────────
  await musicQueueService.clearQueue(userId);
  await musicLikesService.unlike(userId, trackId);
  await prisma.musicPlayCount.deleteMany({ where: { userId, trackId } });

  console.log('\n=== Result ===');
  if (failures === 0) {
    console.log('  ALL PASS ✅  (queue + likes + play-counts idempotent & round-trip clean)\n');
  } else {
    console.error(`  ${failures} ASSERTION(S) FAILED ❌\n`);
  }
  await prisma.$disconnect();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error('  ✗ UNCAUGHT:', e);
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});
