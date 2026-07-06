/**
 * ============================================================
 * MoneyFlow — decimal-safe money helpers
 * ============================================================
 *
 * All money in this module is a Prisma.Decimal (backed by decimal.js,
 * shipped with @prisma/client). NEVER use JS floats for money math —
 * `0.1 + 0.2 !== 0.3` corrupts balances. Every arithmetic step goes
 * through these helpers so rounding is consistent (2 dp, HALF_UP).
 *
 * VND has no minor unit in practice, but the schema stores Decimal(18,2)
 * for currency-readiness; the display layer formats without decimals.
 */
import { Prisma } from '@prisma/client';

export type Dec = Prisma.Decimal;
export type DecInput = Prisma.Decimal.Value;

const SCALE = 2;
const ROUND = Prisma.Decimal.ROUND_HALF_UP;

/** Coerce anything (number | string | Decimal | null) into a Decimal. */
export function D(v: DecInput | null | undefined): Dec {
  if (v === null || v === undefined || v === '') return new Prisma.Decimal(0);
  return new Prisma.Decimal(v);
}

/** Round to 2 decimal places (the storage scale). */
export function round2(v: DecInput): Dec {
  return D(v).toDecimalPlaces(SCALE, ROUND);
}

/** Sum a list of decimal-ish values. */
export function sum(vals: DecInput[]): Dec {
  return vals.reduce<Dec>((acc, v) => acc.plus(D(v)), new Prisma.Decimal(0));
}

/** Convert a percentage (e.g. 1.5 meaning 1.5%) to a fraction (0.015). */
export function pct(percent: DecInput): Dec {
  return D(percent).dividedBy(100);
}

export function isPositive(v: DecInput): boolean {
  return D(v).greaterThan(0);
}

export function isNonNegative(v: DecInput): boolean {
  return D(v).greaterThanOrEqualTo(0);
}

export function eq(a: DecInput, b: DecInput): boolean {
  return D(a).equals(D(b));
}

/** Max(0, v) — used to floor a computed balance at zero. */
export function clampZero(v: DecInput): Dec {
  const d = D(v);
  return d.isNegative() ? new Prisma.Decimal(0) : d;
}

/**
 * Format a value as VND for server-side output (CSV export, logs).
 * The frontend has its own `formatVnd`; this mirrors it: "1.234.567 ₫".
 */
export function formatVnd(v: DecInput): string {
  const n = round2(v).toNumber();
  return `${n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} ₫`;
}
