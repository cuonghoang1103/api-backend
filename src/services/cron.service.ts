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
import { sendDueReminders } from './myLanguage.reminder.service.js';
import { submitSitemapToIndexNow } from './indexnow.service.js';

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

  // ─── Nhắc việc cho robot — MỖI PHÚT ───
  //
  // Nhịp một phút vì đây là báo thức: chậm 5 phút thì nó không còn là
  // báo thức nữa. Mỗi nhịp là một truy vấn có chỉ mục trên `maker_plans`
  // (`active = true`), thường trả về vài dòng — rẻ hơn nhiều so với
  // đống job hằng giờ ngay dưới.
  //
  // Đặt `timezone: 'UTC'` cho khớp mọi job khác, và điều đó KHÔNG sao:
  // lịch chạy mỗi phút nên múi giờ của cron không ảnh hưởng gì. Toàn bộ
  // phần giờ địa phương do `gioDiaPhuong()` trong `keHoach.ts` lo, theo
  // đúng `tz` của TỪNG kế hoạch.
  cron.schedule('* * * * *', async () => {
    try {
      const { nhipNhacViec } = await import('./makerlab/nhacViec.js');
      const n = await nhipNhacViec();
      if (n) logger.info('cron đã nhắc việc cho robot', { soLoiNhac: n });
    } catch (err) {
      // Nuốt lỗi tại đây: một nhịp hỏng không được phép làm cron tự gỡ
      // lịch, nếu không thì một lỗi thoáng qua làm câm báo thức vĩnh
      // viễn cho tới lần restart sau.
      logger.error('cron nhắc việc lỗi', { error: (err as Error).message });
    }
  }, { timezone: 'UTC' });

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

  // ─── Notes trash retention @ 03:30 Vietnam (20:30 UTC) ─────
  // Soft-deleted notes are recoverable for 30 full days. The delete
  // cascades to attachments, links, vocab and immutable versions.
  cron.schedule('30 20 * * *', async () => {
    try {
      const { purgeExpiredDeletedNotes } = await import('./notes.service.js');
      const { notes, filesDeleted } = await purgeExpiredDeletedNotes(30);
      if (notes > 0) {
        logger.info('cron notes trash retention', { notes, filesDeleted, retentionDays: 30 });
      }
    } catch (err) {
      logger.error('cron notes trash retention failed', { error: (err as Error).message });
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

      // ─── Đơn shop / nạp ví / gói Pro + lượt chuyển khoản (13/09/2026) ──
      // Ba loại đơn này mang `expiresAt` riêng (đặt lúc tạo đơn) chứ không
      // dùng chung TTL của khoá học, nên chúng tự biết khi nào hết hạn —
      // ở đây chỉ quét và lật trạng thái.
      const { donDonQuaHan } = await import('./billing.service.js');
      const { hetHanLuotCu } = await import('./bankTransfer.service.js');
      await donDonQuaHan();
      const ckHetHan = await hetHanLuotCu();
      if (ckHetHan > 0) logger.info('cron hết hạn lượt chuyển khoản chưa nhận', { count: ckHetHan });
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

  // ─── My Language — hourly practice reminder emails ───
  // Each user picks their own reminder hour; this job fires every hour and
  // emails only those whose hour matches now (VN) and who haven't practiced
  // or been reminded today. Best-effort; degrades to no-op without RESEND key.
  cron.schedule('0 * * * *', async () => {
    try {
      const r = await sendDueReminders();
      if (r.sent > 0) logger.info('cron lang reminders sent', r);
    } catch (err) {
      logger.error('cron lang reminder failed', { error: (err as Error).message });
    }
  }, { timezone: 'UTC' });

  // ─── Tech Trends news bulletin ───
  //
  // Two jobs, deliberately split. Ingestion is cheap and idempotent, so it runs
  // often and keeps the candidate pool warm. Generation costs tokens and writes
  // a public article, so it runs once, at a fixed hour, and only if ingestion
  // has actually produced something new.
  //
  // Times are Vietnam-local expressed in UTC (VN = UTC+7):
  //   ingest   every 2 hours
  //   bulletin 07:30 VN  = 00:30 UTC
  //   sweep    every 5 min, publishes anything whose scheduled time has passed
  // MẶC ĐỊNH TẮT (đổi 11/08/2026). Trước đây mặc định là BẬT, nghĩa là chỉ cần
  // dựng máy mới hoặc quên một biến môi trường là mỗi 07:30 sáng lại có một bài
  // báo được sinh ra và tính tiền — không ai đặt lệnh, không ai đọc log.
  //
  // Việc chạy nền phải là thứ người ta CHỌN bật, không phải thứ phải nhớ tắt.
  // Bật lại: TECH_NEWS_AUTOPOST=true trong /opt/cuonghoangdev/.env rồi dựng lại
  // container. Nút "chạy ngay" của admin không bị ảnh hưởng.
  const newsEnabled = String(process.env.TECH_NEWS_AUTOPOST ?? 'false').toLowerCase() === 'true';

  cron.schedule('15 */2 * * *', async () => {
    if (!newsEnabled) return;
    try {
      const { ingestAllFeeds } = await import('./techTrends/newsIngest.service.js');
      const r = await ingestAllFeeds();
      logger.info('cron news ingest done', { new: r.itemsNew, ok: r.ok, failed: r.failed });
    } catch (err) {
      logger.error('cron news ingest failed', { error: (err as Error).message });
    }
  }, { timezone: 'UTC' });

  cron.schedule('30 0 * * *', async () => {
    if (!newsEnabled) return;
    try {
      const authorId = Number(process.env.TECH_NEWS_AUTHOR_ID ?? 1);
      const { ingestAllFeeds } = await import('./techTrends/newsIngest.service.js');
      const { runDailyBulletin } = await import('./techTrends/news.service.js');
      await ingestAllFeeds();
      const article = await runDailyBulletin({ authorId });
      logger.info('cron news bulletin published', article);
    } catch (err) {
      // NOT_ENOUGH_NEWS on a quiet day is expected, not a failure worth alerting on.
      const msg = (err as Error).message;
      logger.warn('cron news bulletin skipped', { reason: msg.slice(0, 200) });
    }
  }, { timezone: 'UTC' });

  cron.schedule('*/5 * * * *', async () => {
    try {
      const { publishDueScheduled } = await import('./techTrends/news.service.js');
      await publishDueScheduled();
    } catch (err) {
      logger.error('cron scheduled-publish sweep failed', { error: (err as Error).message });
    }
  }, { timezone: 'UTC' });

  // ─── Maker Lab housekeeping (hourly) ───
  // Telemetry is the only table on the site that grows purely with
  // wall-clock time (one row per device per 10s), and the VPS disk is
  // already at 77%. Also reconciles devices whose socket died without
  // a clean close, so the console doesn't show a dead robot as ONLINE.
  cron.schedule('7 * * * *', async () => {
    try {
      const svc = await import('./makerlab/makerLab.service.js');
      // Hội thoại robot lớn nhanh như telemetry (2 dòng mỗi lượt nói),
      // nên dọn chung một chỗ — thêm bảng mà quên dọn là đầy đĩa VPS,
      // đúng thứ đã có lần giết Postgres.
      const { donHoiThoaiCu } = await import('./makerlab/voiceLoop.js');
      const days = Number(process.env.MAKERLAB_TELEMETRY_RETENTION_DAYS) || 30;
      const [deleted, offline, expired, hoiThoai] = await Promise.all([
        svc.pruneTelemetry(days),
        svc.reconcileStaleDevices(),
        svc.expireStaleCommands(),
        donHoiThoaiCu(),
      ]);
      if (deleted || offline || expired || hoiThoai) {
        logger.info('cron maker-lab housekeeping', { deleted, offline, expired, hoiThoai });
      }
    } catch (err) {
      logger.error('cron maker-lab housekeeping failed', { error: (err as Error).message });
    }
  }, { timezone: 'UTC' });

  // ─── Nhắc gói Pro sắp hết hạn — 09:00 giờ VN ────────────────────
  //
  // ⚠️ Container chạy giờ UTC (xem CLAUDE.md), nên 09:00 Việt Nam là 02:00
  // UTC. Đặt '0 9' ở đây là thông báo rơi vào 16:00 chiều — đúng lúc không ai
  // nhìn điện thoại.
  //
  // Nhắc ở hai mốc: còn 2 ngày và còn 1 ngày. Job chạy mỗi ngày một lần nên
  // mỗi người nhận tối đa hai lần — không cần cột đánh dấu "đã nhắc", thứ mà
  // muốn có thì phải thêm migration.
  //
  // KHÔNG nhắc người dùng vĩnh viễn (`proExpiresAt = null`) và không nhắc
  // người đã hết hạn — người đã hết hạn nhận câu khác, ngay tại cổng tính
  // năng (`cauChanPro`).
  cron.schedule('0 2 * * *', async () => {
    try {
      const { nhacSapHetPro } = await import('./notification.service.js');
      const bayGio = new Date();
      const hanChot = new Date(bayGio.getTime() + 2 * 24 * 60 * 60 * 1000);

      const sapHet = await prisma.user.findMany({
        where: { isPro: true, proExpiresAt: { gt: bayGio, lte: hanChot } },
        select: { id: true, proExpiresAt: true },
      });
      if (sapHet.length === 0) return;

      // Người gửi phải là một tài khoản THẬT khác người nhận. Lấy admin đầu
      // tiên; không có admin nào thì thôi, chứ đừng gửi với id bịa.
      const admin = await prisma.user.findFirst({
        where: { roles: { some: { role: { name: { in: ['ADMIN', 'ROLE_ADMIN'] } } } } },
        select: { id: true },
        orderBy: { id: 'asc' },
      });
      if (!admin) {
        logger.warn('cron nhắc Pro: không tìm thấy admin nào để làm người gửi');
        return;
      }

      let daGui = 0;
      for (const u of sapHet) {
        if (!u.proExpiresAt) continue;
        const conLai = Math.ceil((u.proExpiresAt.getTime() - bayGio.getTime()) / (24 * 60 * 60 * 1000));
        if (conLai !== 1 && conLai !== 2) continue;
        if (await nhacSapHetPro(u.id, conLai, u.proExpiresAt, admin.id)) daGui += 1;
      }
      if (daGui) logger.info('cron nhắc Pro sắp hết hạn', { daGui, xet: sapHet.length });
    } catch (err) {
      logger.error('cron nhắc Pro sắp hết hạn failed', { error: (err as Error).message });
    }
  }, { timezone: 'UTC' });

  // ─── IndexNow — báo Bing/Coc Coc/Yandex crawl URL (mỗi 6 giờ) ───
  // Nộp toàn bộ URL trong sitemap.xml cho IndexNow. Rẻ, idempotent,
  // và service tự nuốt mọi lỗi (không bao giờ throw) — nên đây chỉ
  // cần gọi và ghi log. Tắt tay bằng INDEXNOW_ENABLED=false.
  cron.schedule('0 */6 * * *', async () => {
    try {
      const r = await submitSitemapToIndexNow();
      logger.info('cron IndexNow submit', { ok: r.ok, submitted: r.submitted, status: r.status });
    } catch (err) {
      logger.error('cron IndexNow submit failed', { error: (err as Error).message });
    }
  }, { timezone: 'UTC' });

  // Nộp một lần ~2 phút sau khởi động, để lần deploy đầu tự báo ngay
  // mà không phải chờ tới mốc cron kế tiếp.
  setTimeout(() => {
    submitSitemapToIndexNow().catch(() => {});
  }, 120000);

  // ─── Startup recovery ───
  void recoverPendingJobs();

  logger.info('cron all jobs registered', {
  jobs: [
  'Nightly cleanup @ 03:00 Vietnam',
  'Notes trash retention daily @ 03:30 Vietnam (30 days)',
  'Weekly re-embed @ Sun 02:00 Vietnam',
  'Hourly health check',
  `Stale PENDING order cleanup every 15 min (course TTL ${ttlMinutes}m; shop/nạp ví/Pro + chuyển khoản theo expiresAt riêng)`,
  `Dashboard archive daily @ 04:00 Vietnam (archive ${archiveDays}d, purge ${purgeDays}d, completed-expiry ${COMPLETED_TASK_RETENTION_DAYS}d)`,
  'Orphaned upload cleanup every 4 hours (24h TTL, 50/batch)',
  // Nói đúng trạng thái THẬT. Dòng này từng ghi cứng "bulletin 07:30 VN" kể cả
  // khi job đã tắt — đọc log rồi tin là nó đang chạy thì còn tệ hơn không log.
  newsEnabled
    ? 'Tech news ingest every 2h; bulletin 07:30 VN; scheduled-publish sweep every 5 min'
    : 'Tech news: TẮT (TECH_NEWS_AUTOPOST chưa bật) — chỉ còn scheduled-publish sweep, không gọi AI',
  'Maker Lab housekeeping hourly (telemetry prune, stale devices, expired commands)',
  'IndexNow sitemap submit every 6h (+ once ~2 min after startup)',
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
