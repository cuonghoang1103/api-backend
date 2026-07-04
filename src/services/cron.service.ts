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
import { logger } from '../utils/logger.js';
import { completedExpiryCutoff, COMPLETED_TASK_RETENTION_DAYS } from '../utils/dashboard.js';
import { deleteByKey } from '../storage/uploadService.js';

let _started = false;

/**
 * Start all cron jobs. Idempotent — safe to call multiple times.
 */
export function startCronJobs(): void {
  if (_started) {
    logger.info('cron already started, skipping');
    return;
  }
  _started = true;

  // ─── Nightly cleanup @ 03:00 Vietnam (20:00 UTC) ───
  cron.schedule('0 20 * * *', async () => {
 logger.info('cron running nightly cleanup job');
 try {
 const job = enqueueJob('cleanup_garbage', {});
 logger.info('cron cleanup enqueued', { jobId: job.id });
 } catch (err) {
 logger.error('cron cleanup enqueue failed', { error: (err as Error).message });
 }
  }, { timezone: 'UTC' });

  // ─── Weekly re-embed check @ Sunday 02:00 Vietnam (19:00 UTC Sat) ───
  cron.schedule('0 19 * * 6', async () => {
 logger.info('cron running weekly re-embed check');
 try {
 const job = enqueueJob('reembed_all', {});
 logger.info('cron re-embed enqueued', { jobId: job.id });
 } catch (err) {
 logger.error('cron re-embed enqueue failed', { error: (err as Error).message });
 }
  }, { timezone: 'UTC' });

  // ─── Hourly health check ───
  cron.schedule('0 * * * *', async () => {
    const redisOk = await pingQuotaRedis();
    if (!redisOk) {
      logger.warn('cron Redis unreachable — quota service running in Postgres fallback mode');
    }
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      logger.error('cron Postgres unreachable', { error: (err as Error).message });
    }
  }, { timezone: 'UTC' });

  // ─── Orphaned upload cleanup (every 4 hours) ────────────────────────────
  // Find PendingUpload rows that:
  //   1. Are still PENDING (not confirmed by a successful post)
  //   2. Have expired (expiresAt < now)
  // Mark them as EXPIRED and delete the corresponding R2 objects.
  // This handles cases where:
  //   - User navigated away mid-upload
  //   - Browser crashed after upload but before post submission
  //   - Network timeout caused the post to fail silently
  //
  // The 24h TTL on each pending upload gives users ~24h to complete
  // their post before the R2 object gets cleaned up. Videos that
  // were successfully POSTED are marked CONFIRMED by createPost and
  // are skipped by this job.
  cron.schedule('0 */4 * * *', async () => {
    logger.info('cron orphaned upload cleanup starting');
    try {
      // Get pending uploads that have expired (TTL exceeded)
      const expiredUploads = await prisma.pendingUpload.findMany({
        where: {
          status: 'PENDING',
          expiresAt: { lt: new Date() },
        },
        select: {
          id: true,
          r2Key: true,
          url: true,
          userId: true,
        },
        take: 50, // Process in batches to avoid overwhelming R2
      });

      if (expiredUploads.length === 0) {
        logger.info('cron orphaned upload cleanup: no expired uploads found');
        return;
      }

      logger.info('cron orphaned upload cleanup', { count: expiredUploads.length });

      for (const upload of expiredUploads) {
        try {
          // Delete from R2
          await deleteByKey(upload.r2Key);
          // Mark as expired in DB
          await prisma.pendingUpload.update({
            where: { id: upload.id },
            data: { status: 'EXPIRED' },
          });
          logger.info('cron orphaned upload cleaned up', {
            uploadId: upload.id,
            r2Key: upload.r2Key,
            userId: upload.userId,
          });
        } catch (err) {
          logger.error('cron failed to clean up orphaned upload', {
            uploadId: upload.id,
            r2Key: upload.r2Key,
            error: (err as Error).message,
          });
        }
      }

      // Delete all EXPIRED uploads older than 7 days to keep the table lean
      const cleanupCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const { count: deletedCount } = await prisma.pendingUpload.deleteMany({
        where: {
          status: 'EXPIRED',
          updatedAt: { lt: cleanupCutoff },
        },
      });
      if (deletedCount > 0) {
        logger.info('cron purged expired upload records', { count: deletedCount });
      }
    } catch (err) {
      logger.error('cron orphaned upload cleanup failed', { error: (err as Error).message });
    }
  }, { timezone: 'UTC' });

  // ─── Payment order cleanup (every 15 min) ───
  // Mark CourseOrder rows that have been PENDING for more than the
  // configured TTL (default 15 min) as FAILED. The IPN handler will
  // still accept a late callback from VNPay — it only marks PAID, so
  // a FAILED → PAID transition is fine. This stops the UI from
  // showing a "stuck" PENDING order indefinitely.
  const ttlMinutes = parseInt(process.env.VNPAY_ORDER_TTL_MINUTES || '15', 10);
  cron.schedule('*/15 * * * *', async () => {
    try {
      const cutoff = new Date(Date.now() - ttlMinutes * 60 * 1000);
      const { count } = await prisma.courseOrder.updateMany({
        where: { status: 'PENDING', createdAt: { lt: cutoff } },
        data: { status: 'FAILED' },
      });
      if (count > 0) {
        logger.info('cron expired stale PENDING orders', { count, ttlMinutes });
      }
    } catch (err) {
      logger.error('cron order cleanup failed', { error: (err as Error).message });
    }
  }, { timezone: 'UTC' });

  // ─── Dashboard archive (daily @ 04:00 Vietnam / 21:00 UTC) ───
  // Two-phase retention to keep user data "forever" without
  // bloating the DB:
  //   1. Hard-archive any active tasks whose date is more than
  //      DASHBOARD_ARCHIVE_DAYS ago (default 30). The user can
  //      still see them in /export for another 6 months.
  //   2. Hard-delete any archived tasks more than
  //      DASHBOARD_PURGE_DAYS ago (default 180) to bound the
  //      table size. Celebrations follow the same retention.
  // Both are silent no-ops when the table is empty.
  const archiveDays = parseInt(process.env.DASHBOARD_ARCHIVE_DAYS || '30', 10);
  const purgeDays = parseInt(process.env.DASHBOARD_PURGE_DAYS || '180', 10);
  cron.schedule('0 21 * * *', async () => {
    try {
      const archiveCutoff = new Date(Date.now() - archiveDays * 24 * 60 * 60 * 1000);
      const archiveDate = archiveCutoff.toISOString().slice(0, 10);

      const archived = await prisma.dashboardTask.updateMany({
        where: { archivedAt: null, date: { lt: archiveDate } },
        data: { archivedAt: new Date() },
      });
      if (archived.count > 0) {
        logger.info('cron archived dashboard tasks', { count: archived.count, archiveDays });
      }

      // Auto-expiry: physically remove COMPLETED tasks whose
      // completedAt is older than the retention window (default 7d).
      // The GET endpoint already hides these at read time; this step
      // keeps the table from growing unbounded with stale done rows.
      // Active (unfinished) tasks are never touched here.
      const expiredCompleted = await prisma.dashboardTask.deleteMany({
        where: { done: true, completedAt: { lt: completedExpiryCutoff() } },
      });
      if (expiredCompleted.count > 0) {
        logger.info('cron purged expired completed dashboard tasks', {
          count: expiredCompleted.count,
          retentionDays: COMPLETED_TASK_RETENTION_DAYS,
        });
      }

      const purgeCutoff = new Date(Date.now() - purgeDays * 24 * 60 * 60 * 1000);
      const purged = await prisma.dashboardTask.deleteMany({
        where: { archivedAt: { lt: purgeCutoff } },
      });
      if (purged.count > 0) {
        logger.info('cron purged archived dashboard tasks', { count: purged.count, purgeDays });
      }

      // Celebration history is cheap to keep — capped at ~3 years
      // for the same reason. After 3 years, the user's streak
      // graph is still readable from the level/exp fields in
      // dashboard_state, which never expire.
      const celebrationPurgeCutoff = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000);
      const purgedCeleb = await prisma.dashboardCelebration.deleteMany({
        where: { createdAt: { lt: celebrationPurgeCutoff } },
      });
      if (purgedCeleb.count > 0) {
        logger.info('cron purged old celebration records', { count: purgedCeleb.count });
      }
    } catch (err) {
      logger.error('cron dashboard archive failed', { error: (err as Error).message });
    }
  }, { timezone: 'UTC' });

  // ─── Startup recovery ───
  void recoverPendingJobs();

  logger.info('cron all jobs registered', {
  jobs: [
  'Nightly cleanup @ 03:00 Vietnam',
  'Weekly re-embed @ Sun 02:00 Vietnam',
  'Hourly health check',
  `Stale PENDING order cleanup every 15 min (TTL ${ttlMinutes}m)`,
  `Dashboard archive daily @ 04:00 Vietnam (archive ${archiveDays}d, purge ${purgeDays}d, completed-expiry ${COMPLETED_TASK_RETENTION_DAYS}d)`,
  'Orphaned upload cleanup every 4 hours (24h TTL, 50/batch)',
  ],
  });
}

/**
 * Stop all cron jobs (for graceful shutdown / tests).
 */
export function stopCronJobs(): void {
  // node-cron doesn't have a built-in stopAll — destroying tasks is verbose.
  // We just flip the flag so future startCronJobs() calls become no-ops.
  _started = false;
  logger.info('cron stopped (flag flipped)');
}
