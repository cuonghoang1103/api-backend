/**
 * CT Work — CTW-18 (08/10/2026): NGÀY theo múi giờ của dự án, không theo UTC.
 *
 * Lúc 00:40 ngày 06/10 giờ VN (= 17:40Z ngày 05/10), xem trước báo cáo tuần ra "30/09–06/10" (tính
 * theo giờ VN) còn AI weekly-report ra "28/09–05/10" (now − 7 ngày, in bằng toISOString = UTC). Cùng lỗi:
 * AI gợi ý action họp viết "Tóm tắt M-2 (5/10/2026)" cho cuộc họp lúc 01:00 ngày 6/10 giờ VN.
 *
 * Quy tắc: cột `@db.Date` (dueDate, releaseDate…) là ngày lịch, in bằng toISOString vẫn đúng. Cột
 * DateTime (startsAt, updatedAt, sprint startAt/endAt, "hôm nay") phải đổi sang ngày theo múi giờ —
 * dùng `dayInZone`. Múi giờ dự án: lịch báo cáo khách (`work_report_schedules.timezone`) ⇒
 * `settings.timezone` ⇒ Asia/Ho_Chi_Minh.
 */

import { prisma } from '../../config/database.js';

export const DEFAULT_TZ = 'Asia/Ho_Chi_Minh';
const DAY = 86_400_000;

export function validTz(tz: unknown): tz is string {
  if (typeof tz !== 'string' || !tz) return false;
  try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return true; } catch { return false; }
}

/** Ngày lịch (YYYY-MM-DD) của thời điểm `d` tại múi giờ `tz`. */
export function dayInZone(d: Date, tz: string = DEFAULT_TZ): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: validTz(tz) ? tz : DEFAULT_TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export const addDays = (day: string, n: number) => new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);

/** Độ lệch (ms) của `tz` so với UTC tại thời điểm `t`. */
function offsetMs(t: number, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(t));
  const g = (k: string) => Number(parts.find((p) => p.type === k)?.value);
  return Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second')) - Math.floor(t / 1000) * 1000;
}

/** 00:00 của ngày `day` tại `tz`, dưới dạng Date (UTC). */
export function zonedMidnight(day: string, tz: string = DEFAULT_TZ): Date {
  const zone = validTz(tz) ? tz : DEFAULT_TZ;
  const guess = Date.parse(`${day}T00:00:00Z`);
  let t = guess - offsetMs(guess, zone);
  t = guess - offsetMs(t, zone); // lần hai cho đúng quanh giờ đổi mùa
  return new Date(t);
}

/** Kỳ "7 ngày gần nhất" như xem trước báo cáo tuần: hôm nay (theo tz) lùi 6 ngày, tính cả hai đầu. */
export function lastWeekPeriod(now: Date, tz: string = DEFAULT_TZ): { from: string; to: string; since: Date; tz: string } {
  const zone = validTz(tz) ? tz : DEFAULT_TZ;
  const to = dayInZone(now, zone);
  const from = addDays(to, -6);
  return { from, to, since: zonedMidnight(from, zone), tz: zone };
}

/** Múi giờ của dự án (xem đầu tệp). */
export async function projectTimezone(projectId: number): Promise<string> {
  const [sched, project] = await Promise.all([
    prisma.workReportSchedule.findUnique({ where: { projectId }, select: { timezone: true } }),
    prisma.workProject.findUnique({ where: { id: projectId }, select: { settings: true } }),
  ]);
  if (validTz(sched?.timezone)) return sched!.timezone;
  const s = (project?.settings as { timezone?: unknown } | null)?.timezone;
  return validTz(s) ? s : DEFAULT_TZ;
}
