/**
 * Shared helpers for MoneyFlow services: id validation, date/month ranges
 * (UTC, to match @db.Date columns), and small guards. Every finance service
 * scopes its queries by `userId` — these helpers do not touch the DB, they
 * just keep validation/date logic consistent across services.
 */
import { BadRequestError } from '../../middleware/errorHandler.js';

/**
 * ⚠️ MÚI GIỜ (sửa 28/09/2026). Container chạy UTC, người dùng sống ở +07.
 * Trước đây "hôm nay" = ngày UTC ⇒ từ 0h tới 7h sáng giờ VN, app coi hôm nay
 * là HÔM QUA: khoản chi ghi lúc 6h sáng rơi sang ngày trước, kỳ nợ tới hạn
 * hôm qua chưa bị đánh dấu quá hạn, và ngày 1 đầu tháng lúc 3h sáng vẫn mở
 * báo cáo của tháng trước. Mọi mốc "hôm nay / tháng này / năm nay" đi qua
 * `ngayVN()` bên dưới.
 */
const MUI_GIO_VN_MS = 7 * 60 * 60 * 1000;

/** Ngày lịch Việt Nam của một thời điểm, dạng `YYYY-MM-DD`. */
export function ngayVN(luc: Date = new Date()): string {
  return new Date(luc.getTime() + MUI_GIO_VN_MS).toISOString().slice(0, 10);
}

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
    const [ys, ms] = ngayVN().split('-');
    y = Number(ys);
    m = Number(ms) - 1;
  }
  const start = new Date(Date.UTC(y, m, 1));
  const end = new Date(Date.UTC(y, m + 1, 1));
  return { start, end, year: y, month: m + 1 };
}

export function yearWindow(year?: string | number | null): { start: Date; end: Date; year: number } {
  const y = year ? Number(year) : Number(ngayVN().slice(0, 4));
  return { start: new Date(Date.UTC(y, 0, 1)), end: new Date(Date.UTC(y + 1, 0, 1)), year: y };
}

/**
 * A UTC Date at midnight for a given calendar day, matching @db.Date semantics.
 * `"YYYY-MM-DD"` giữ nguyên ngày đó. Một THỜI ĐIỂM (Date, hay chuỗi ISO có
 * giờ) thì lấy ngày lịch VN của nó — `2026-09-27T18:30:00Z` là 01:30 sáng
 * 28/09 ở VN, phải lưu là 28/09 chứ không phải 27/09.
 */
export function toDateOnly(value: string | Date): Date {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    const d = new Date(`${value.trim()}T00:00:00.000Z`);
    if (Number.isNaN(d.getTime())) throw new BadRequestError('Ngày không hợp lệ');
    return d;
  }
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) throw new BadRequestError('Ngày không hợp lệ');
  return new Date(`${ngayVN(d)}T00:00:00.000Z`);
}

/** Hôm nay THEO LỊCH VIỆT NAM, ở nửa đêm UTC (khớp cột @db.Date). */
export function todayUtc(): Date {
  return new Date(`${ngayVN()}T00:00:00.000Z`);
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
