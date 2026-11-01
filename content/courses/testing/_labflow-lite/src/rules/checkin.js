// Check-in and no-show rules (Chapter 8, Lab 8).
import { parseTime } from './time.js';

export const EARLY = 10;          // BR-07: check-in opens 10 minutes before the start …
export const GRACE = 15;          // … and closes 15 minutes after it; later is a no-show
export const STRIKES = 3;         // BR-08: 3 no-shows within 30 days …
export const LOOKBACK_DAYS = 30;
export const BAN_DAYS = 7;        // … block new bookings until 7 days after the last one

// now is "HH:MM" on the day of the booking.
export function checkIn(booking, now) {
  if (booking.status !== 'CONFIRMED') return { ok: false, code: 'NOT_CONFIRMED' };
  const start = parseTime(booking.start);
  const t = parseTime(now);
  if (t < start - EARLY) return { ok: false, code: 'TOO_EARLY' };
  if (t > start + GRACE) return { ok: false, code: 'NO_SHOW' };
  return { ok: true, late: t > start };
}

const DAY = 24 * 60 * 60 * 1000;
const dayNumber = (iso) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10))) / DAY;
const isoDate = (n) => new Date(n * DAY).toISOString().slice(0, 10);

// noShows: dates "YYYY-MM-DD" of earlier no-shows. Returns the last day the student is banned, or null.
export function bannedUntil(noShows, today) {
  const t = dayNumber(today);
  const recent = noShows.map(dayNumber).filter((d) => d <= t && t - d < LOOKBACK_DAYS);
  if (recent.length < STRIKES) return null;
  const end = Math.max(...recent) + BAN_DAYS;
  return end < t ? null : isoDate(end);
}

// A small in-memory log of no-shows per student.
export function createNoShowLog() {
  const byUser = new Map();
  return {
    record(userId, date) {
      byUser.set(userId, [...(byUser.get(userId) ?? []), date]);
    },
    datesFor(userId) {
      return byUser.get(userId) ?? [];
    },
  };
}
