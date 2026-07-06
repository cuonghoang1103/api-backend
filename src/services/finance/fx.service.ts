/**
 * MoneyFlow — user-managed VND↔USD exchange rate (per-user).
 * ────────────────────────────────────────────────────────────
 * The rate is append-only history: every update inserts a row and the
 * newest row is the current rate. Aggregations (dashboard/reports) convert
 * USD amounts into VND through `toVnd()` so totals stay single-currency.
 * A user who never touches USD never hits any of this — VND is a no-op.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { D, round2, type Dec, type DecInput } from './money.js';
import { assertId, pageParams } from './helpers.js';

export const CURRENCIES = ['VND', 'USD'] as const;
export type Currency = (typeof CURRENCIES)[number];

// Sanity bounds for a VND-per-USD rate — wide enough for decades of drift,
// tight enough to catch a fat-finger (e.g. typing dong-amount into the field).
const RATE_MIN = 1_000;
const RATE_MAX = 1_000_000;

/** Newest rate row for the user, or null if they never set one. */
export async function getCurrentFxRate(userId: number) {
  return prisma.financeFxRate.findFirst({
    where: { userId },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  });
}

/** Record a new rate (becomes current). Returns the created row. */
export async function setFxRate(userId: number, input: { vndPerUsd: number | string; note?: string | null }) {
  const rate = round2(D(input.vndPerUsd));
  if (rate.lessThan(RATE_MIN) || rate.greaterThan(RATE_MAX)) {
    throw new BadRequestError(`Tỷ giá phải nằm trong khoảng ${RATE_MIN.toLocaleString('vi-VN')} – ${RATE_MAX.toLocaleString('vi-VN')} ₫/$`);
  }
  return prisma.financeFxRate.create({
    data: { userId, vndPerUsd: rate, note: input.note?.toString().slice(0, 200) || null },
  });
}

/** Paginated rate history, newest first. */
export async function listFxRates(userId: number, page?: unknown, limit?: unknown) {
  const { skip, limit: take, page: p } = pageParams(page, limit, 20, 100);
  const [items, total] = await Promise.all([
    prisma.financeFxRate.findMany({ where: { userId }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip, take }),
    prisma.financeFxRate.count({ where: { userId } }),
  ]);
  return { items, total, page: p, limit: take };
}

/** Delete one history row (undo a mistyped rate). */
export async function deleteFxRate(userId: number, id: number) {
  assertId(id, 'fxRateId');
  const { count } = await prisma.financeFxRate.deleteMany({ where: { id, userId } });
  if (count === 0) throw new NotFoundError('Không tìm thấy bản ghi tỷ giá');
  return { deleted: true };
}

/**
 * Convert an amount in `currency` to VND using `rate` (VND per USD).
 * VND passes through untouched. USD without a rate converts to 0 —
 * callers surface that through a `hasUnconvertedUsd` flag instead of
 * silently mixing currencies in one sum.
 */
export function toVnd(amount: DecInput, currency: string | null | undefined, rate: Dec | null): Dec {
  if (currency !== 'USD') return D(amount);
  if (!rate) return D(0);
  return round2(D(amount).times(rate));
}

/** Convert VND → USD at `rate` (used by cross-currency wallet transfers). */
export function vndToUsd(amount: DecInput, rate: Dec): Dec {
  return round2(D(amount).dividedBy(rate));
}
