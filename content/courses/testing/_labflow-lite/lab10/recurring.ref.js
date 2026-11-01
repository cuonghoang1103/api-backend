// BR-10 — a lecturer books the same slot every week for a class (Lab 10, built test-first).
export const MAX_WEEKS = 15;

const DAY = 24 * 60 * 60 * 1000;
const toDay = (iso) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10))) / DAY;
const toIso = (day) => new Date(day * DAY).toISOString().slice(0, 10);

// firstDate, until: "YYYY-MM-DD" (until = last day of the term, inclusive); holidays: ["YYYY-MM-DD", …]
export function weeklyDates({ firstDate, weeks, until, holidays = [] }) {
  if (!Number.isInteger(weeks) || weeks < 1 || weeks > MAX_WEEKS) return { ok: false, code: 'BAD_WEEKS' };
  if (toDay(firstDate) > toDay(until)) return { ok: false, code: 'STARTS_AFTER_TERM' };
  const dates = [];
  const skipped = [];
  for (let i = 0; i < weeks; i++) {
    const date = toIso(toDay(firstDate) + 7 * i);
    if (toDay(date) > toDay(until)) skipped.push({ date, reason: 'AFTER_TERM' });
    else if (holidays.includes(date)) skipped.push({ date, reason: 'HOLIDAY' });
    else dates.push(date);
  }
  return { ok: true, dates, skipped };
}
