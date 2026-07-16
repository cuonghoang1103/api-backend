/**
 * My Language — daily practice reminder emails.
 *
 * Called hourly by the cron service. For each user with `reminderEnabled` whose
 * `reminderHour` equals the current Vietnam hour, who hasn't practiced today and
 * hasn't already been reminded today, sends a friendly "keep your streak" email.
 * Best-effort: email failures are logged, never thrown; `emailService` already
 * degrades to a no-op when RESEND_API_KEY is missing.
 */
import { prisma } from '../config/database.js';
import { emailService } from './email.service.js';
import { logger } from '../utils/logger.js';

const TZ_OFFSET_MS = 7 * 60 * 60 * 1000; // Asia/Ho_Chi_Minh
const MAX_PER_RUN = 500;

function dayStr(d: Date): string {
  return new Date(d.getTime() + TZ_OFFSET_MS).toISOString().slice(0, 10);
}

function reminderHtml(name: string, streak: number, languageName: string, code: string): string {
  const base = process.env.FRONTEND_URL || 'http://localhost:3000';
  const url = `${base}/language/${code}/practice`;
  const streakLine = streak > 0
    ? `Bạn đang có chuỗi <strong>${streak} ngày</strong> — đừng để mất nhé!`
    : `Học một chút hôm nay để bắt đầu chuỗi ngày của bạn nhé!`;
  return `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1f2937">
      <h2 style="margin:0 0 8px">Xin chào ${name} 👋</h2>
      <p style="margin:0 0 4px">Đã đến giờ luyện <strong>${languageName}</strong> rồi.</p>
      <p style="margin:0 0 16px">${streakLine}</p>
      <a href="${url}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 22px;border-radius:9999px;font-weight:600">Luyện tập ngay</a>
      <p style="margin:20px 0 0;font-size:12px;color:#6b7280">Chỉ 5 phút mỗi ngày. Bạn có thể tắt nhắc trong phần Luyện tập.</p>
    </div>`;
}

/**
 * Send reminders due for the current hour. Returns counts for logging/tests.
 */
export async function sendDueReminders(now: Date = new Date()): Promise<{ candidates: number; sent: number; skipped: number }> {
  const vnHour = new Date(now.getTime() + TZ_OFFSET_MS).getUTCHours();

  const rows = await prisma.langGameState.findMany({
    where: { reminderEnabled: true, reminderHour: vnHour },
    select: {
      id: true,
      streak: true,
      lastPracticeDate: true,
      lastReminderAt: true,
      language: { select: { code: true, name: true } },
      user: { select: { email: true, username: true, displayName: true, fullName: true } },
    },
    take: MAX_PER_RUN,
  });

  const todayS = dayStr(now);
  let sent = 0;
  let skipped = 0;

  for (const r of rows) {
    const email = r.user?.email;
    const practicedToday = r.lastPracticeDate ? dayStr(r.lastPracticeDate) === todayS : false;
    const remindedToday = r.lastReminderAt ? dayStr(r.lastReminderAt) === todayS : false;
    if (!email || practicedToday || remindedToday) { skipped++; continue; }

    const name = r.user.displayName || r.user.fullName || r.user.username;
    try {
      const res = await emailService.send({
        to: email,
        subject: r.streak > 0 ? `⏰ Giữ chuỗi ${r.streak} ngày ${r.language.name} nhé!` : `⏰ Đến giờ luyện ${r.language.name} rồi!`,
        html: reminderHtml(name, r.streak, r.language.name, r.language.code),
      });
      // Mark reminded today regardless of provider result, to avoid re-sending
      // within the same day if the hourly job overlaps.
      await prisma.langGameState.update({ where: { id: r.id }, data: { lastReminderAt: now } }).catch(() => {});
      if (res.success) sent++; else skipped++;
    } catch (err) {
      skipped++;
      logger.warn('lang reminder send failed', { error: (err as Error).message });
    }
  }

  logger.info('lang practice reminder run', { vnHour, candidates: rows.length, sent, skipped });
  return { candidates: rows.length, sent, skipped };
}
