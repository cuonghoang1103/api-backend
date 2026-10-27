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
import { greetingFor, renderSiteEmail } from './emailLayout.js';
import { logger } from '../utils/logger.js';

const TZ_OFFSET_MS = 7 * 60 * 60 * 1000; // Asia/Ho_Chi_Minh
const MAX_PER_RUN = 500;

function dayStr(d: Date): string {
  return new Date(d.getTime() + TZ_OFFSET_MS).toISOString().slice(0, 10);
}

/** Thư nhắc luyện tập trên khung chung (27/10/2026). HÀM THUẦN. */
export function buildReminderEmail(name: string, streak: number, languageName: string, code: string): { subject: string; html: string; text: string } {
  const base = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
  const url = `${base}/language/${code}/practice`;
  const { html, text } = renderSiteEmail({
    preheader: streak > 0 ? `Chuỗi ${streak} ngày đang chờ bạn — chỉ cần 5 phút hôm nay.` : `5 phút luyện ${languageName} hôm nay là đủ để bắt đầu chuỗi ngày.`,
    eyebrow: `Luyện ${languageName}`,
    heading: streak > 0 ? `Giữ chuỗi ${streak} ngày của bạn nhé` : `Đến giờ luyện ${languageName} rồi`,
    greeting: greetingFor(name),
    blocks: [
      { type: 'p', text: streak > 0
        ? `Bạn đang có chuỗi **${streak} ngày** luyện ${languageName} liên tiếp. Hôm nay bạn chưa luyện — vài phút thôi là giữ được chuỗi.`
        : `Hôm nay là một ngày tốt để luyện **${languageName}**. Học đều mỗi ngày một chút hiệu quả hơn nhiều so với học dồn.` },
      { type: 'button', label: 'Luyện tập ngay', url, fallback: false },
      { type: 'p', muted: true, text: 'Không muốn nhận nhắc nữa? Tắt công tắc "Nhắc học hằng ngày" ở cuối trang Luyện tập.' },
    ],
    reason: 'Bạn nhận thư này vì đã bật nhắc luyện tập hằng ngày trong My Language trên CuongThai.com.',
  });
  return { subject: streak > 0 ? `Giữ chuỗi ${streak} ngày luyện ${languageName} nhé` : `Đến giờ luyện ${languageName} rồi`, html, text };
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
      const res = await emailService.send({ to: email, ...buildReminderEmail(name, r.streak, r.language.name, r.language.code) });
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
