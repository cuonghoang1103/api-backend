/**
 * Shared helpers for MoneyFlow services: id validation, date/month ranges
 * (UTC, to match @db.Date columns), and small guards. Every finance service
 * scopes its queries by `userId` — these helpers do not touch the DB, they
 * just keep validation/date logic consistent across services.
 */
import { BadRequestError } from '../../middleware/errorHandler.js';

export function assertId(id: number, label = 'id'): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError(`${label} không hợp lệ`);
  }
}

export function assertOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  label: string,
): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    throw new BadRequestError(`${label} phải là một trong: ${allowed.join(', ')}`);
  }
  return value as T;
}

/** Parse "YYYY-MM" (or a Date) into a UTC [start, end) month window. */
export function monthWindow(month?: string | null): { start: Date; end: Date; year: number; month: number } {
  let y: number;
  let m: number; // 0-based
  if (month && /^\d{4}-\d{1,2}$/.test(month)) {
    const [ys, ms] = month.split('-');
    y = Number(ys);
    m = Number(ms) - 1;
  } else {
    const now = new Date();
    y = now.getUTCFullYear();
    m = now.getUTCMonth();
  }
  const start = new Date(Date.UTC(y, m, 1));
  const end = new Date(Date.UTC(y, m + 1, 1));
  return { start, end, year: y, month: m + 1 };
}

export function yearWindow(year?: string | number | null): { start: Date; end: Date; year: number } {
  const y = year ? Number(year) : new Date().getUTCFullYear();
  return { start: new Date(Date.UTC(y, 0, 1)), end: new Date(Date.UTC(y + 1, 0, 1)), year: y };
}

/** A UTC Date at midnight for a given day, matching @db.Date semantics. */
export function toDateOnly(value: string | Date): Date {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) throw new BadRequestError('Ngày không hợp lệ');
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Today at UTC midnight. */
export function todayUtc(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
}

export function addDaysUtc(base: Date, days: number): Date {
  return new Date(base.getTime() + days * 86_400_000);
}

/** Clamp/normalize a page+limit pair for list endpoints. */
export function pageParams(page?: unknown, limit?: unknown, defLimit = 30, maxLimit = 200) {
  const p = Math.max(1, Math.floor(Number(page) || 1));
  const l = Math.min(maxLimit, Math.max(1, Math.floor(Number(limit) || defLimit)));
  return { page: p, limit: l, skip: (p - 1) * l };
}
