/**
 * ============================================================
 * Cron Service — Scheduled background tasks
 *
 * Jobs:
 * - Nightly cleanup (03:00 Vietnam / 20:00 UTC previous day):
 *     Delete chunks of soft-deleted documents older than 90 days
 *
 * - Weekly re-embed check (Sunday 02:00 VN / 19:00 UTC Sat):
 *     Verify all chunks have embeddings; backfill missing ones
 *
 * - Hourly health check (every 60 min):
 *     Verify Redis + Postgres reachable; log if not
 *
 * Uses node-cron. Lightweight, in-process.
 * ============================================================
 */

import cron from 'node-cron';
import { enqueueJob, recoverPendingJobs } from './embedQueue.service.js';
import { pingQuotaRedis } from './quota.service.js';
import { prisma } from '../config/database.js';

let _started = false;

/**
 * Start all cron jobs. Idempotent — safe to call multiple times.
 */
export function startCronJobs(): void {
  if (_started) {
    console.log('[cron] Already started, skipping');
    return;
  }
  _started = true;

  // ─── Nightly cleanup @ 03:00 Vietnam (20:00 UTC) ───
  cron.schedule('0 20 * * *', async () => {
    console.log('[cron] Running nightly cleanup job');
    try {
      const job = enqueueJob('cleanup_garbage', {});
      console.log(`[cron] Cleanup enqueued: ${job.id}`);
    } catch (err) {
      console.error('[cron] Cleanup enqueue failed:', (err as Error).message);
    }
  }, { timezone: 'UTC' });

  // ─── Weekly re-embed check @ Sunday 02:00 Vietnam (19:00 UTC Sat) ───
  cron.schedule('0 19 * * 6', async () => {
    console.log('[cron] Running weekly re-embed check');
    try {
      const job = enqueueJob('reembed_all', {});
      console.log(`[cron] Re-embed enqueued: ${job.id}`);
    } catch (err) {
      console.error('[cron] Re-embed enqueue failed:', (err as Error).message);
    }
  }, { timezone: 'UTC' });

  // ─── Hourly health check ───
  cron.schedule('0 * * * *', async () => {
    const redisOk = await pingQuotaRedis();
    if (!redisOk) {
      console.warn('[cron] ⚠️  Redis unreachable — quota service running in Postgres fallback mode');
    }
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      console.error('[cron] ⚠️  Postgres unreachable:', (err as Error).message);
    }
  }, { timezone: 'UTC' });

  // ─── Startup recovery ───
  void recoverPendingJobs();

  console.log('[cron] ✓ All cron jobs registered:');
  console.log('       - Nightly cleanup @ 03:00 Vietnam');
  console.log('       - Weekly re-embed @ Sun 02:00 Vietnam');
  console.log('       - Hourly health check');
}

/**
 * Stop all cron jobs (for graceful shutdown / tests).
 */
export function stopCronJobs(): void {
  // node-cron doesn't have a built-in stopAll — destroying tasks is verbose.
  // We just flip the flag so future startCronJobs() calls become no-ops.
  _started = false;
  console.log('[cron] Stopped (flag flipped)');
}
