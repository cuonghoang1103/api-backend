// Shared helpers for the dashboard route. Kept in src/utils/ so
// future cron jobs (dashboard archive) can reuse the date math
// without re-implementing it. The frontend has its own copies
// because we don't want to import server-only code into Next.js.

/**
 * Today's date in the user's "calendar day" sense. We use UTC
 * because the DB column is TIMESTAMP WITHOUT TIME ZONE in the
 * existing schema; mixing local + UTC has been a source of bugs
 * in the past. A user in UTC+7 will see their "today" flip at
 * 00:00 local time, which is the same behavior as the old
 * client-side `new Date().toISOString().slice(0, 10)`.
 */
export function todayIso(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/**
 * YYYY-MM-DD validator. Strict — no slashes, no time, no extra
 * whitespace. We do this rather than `new Date(s)` because that
 * constructor accepts a huge range of inputs (e.g. "Wed Jun 16
 * 2026") which is exactly the kind of silent bug we want to
 * avoid.
 */
export function isValidIsoDate(s: string): boolean {
  if (typeof s !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  // Reject impossible dates like Feb 30.
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

/**
 * Normalize any date-ish string into YYYY-MM-DD. Accepts
 * ISO timestamps, "2026-06-16", and "06/16/2026". Throws on
 * anything we can't parse — better to fail loudly than store
 * a malformed date.
 */
export function normalizeDate(s: string): string {
  if (typeof s !== 'string' || s.length === 0) {
    throw new Error('date khong hop le');
  }
  // Already canonical.
  if (isValidIsoDate(s)) return s;
  // Try ISO with time.
  const dt = new Date(s);
  if (!isNaN(dt.getTime())) {
    return dt.toISOString().slice(0, 10);
  }
  throw new Error(`Khong the parse date: ${s}`);
}

/**
 * How long a COMPLETED task stays visible before it auto-expires.
 * After this many days past `completedAt`, the task is hidden from
 * the dashboard (query-time filter in GET) and eventually hard-
 * deleted by the daily cron. This is the single knob to tune the
 * retention window — change it here and both the read filter and
 * the cron pick it up. Overridable via DASHBOARD_COMPLETED_RETENTION_DAYS.
 *
 * Note: this only applies to *completed* tasks. Active (unfinished)
 * tasks never auto-expire — the user must finish or delete them.
 * Manually deleted tasks are removed immediately and permanently.
 */
export const COMPLETED_TASK_RETENTION_DAYS = (() => {
  const raw = parseInt(process.env.DASHBOARD_COMPLETED_RETENTION_DAYS || '', 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 7;
})();

/**
 * The cutoff Date for completed-task expiry: any task with
 * `done = true` and `completedAt < this` is considered expired
 * and should no longer be shown to the user.
 */
export function completedExpiryCutoff(now: Date = new Date()): Date {
  return new Date(now.getTime() - COMPLETED_TASK_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

export type TaskScope = 'today' | 'week' | 'month';

/**
 * Returns the canonical date string for a given scope. Used
 * by the bulk-seed endpoint so a client calling without
 * a date gets the right "this week" or "this month" stamp.
 */
export function scopeDate(scope: TaskScope, ref: Date = new Date()): string {
  if (scope === 'today') return todayIso(ref);
  if (scope === 'week') {
    const d = new Date(ref);
    const day = d.getUTCDay() || 7; // 1..7, with Monday=1
    d.setUTCDate(d.getUTCDate() - (day - 1));
    return d.toISOString().slice(0, 10);
  }
  // month
  return `${ref.getUTCFullYear()}-${String(ref.getUTCMonth() + 1).padStart(2, '0')}-01`;
}
