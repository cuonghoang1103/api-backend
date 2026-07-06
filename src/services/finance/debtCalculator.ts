/**
 * ============================================================
 * MoneyFlow — Debt interest calculator (PURE, no DB)
 * ============================================================
 *
 * Given a debt's terms, produce its full payment schedule and interest
 * totals. Four interest models are supported:
 *
 *   FLAT_MONTHLY     interest = principal × rate% every month (rate is %/month).
 *                    Interest is constant; principal is split evenly.
 *   REDUCING_BALANCE standard amortization — a fixed EMI, interest charged on
 *                    the declining balance (rate is %/month).
 *   DAILY_PERCENT    common for VN loan apps — interest = remaining × rate% per
 *                    DAY (rate is %/day). Exposes interest-per-day and accrual.
 *   NO_INTEREST      personal borrowing; principal only, split evenly.
 *
 * Every number is a Prisma.Decimal — no floating point. Rounding is 2 dp
 * HALF_UP per step; the FINAL installment absorbs any rounding remainder so
 * `sum(principalPart) === principal` exactly.
 *
 * This module is deliberately DB-free and deterministic so it can be unit
 * tested (see scripts/test-finance-calc.ts).
 */
import { Prisma } from '@prisma/client';
import { D, round2, pct, type Dec, type DecInput } from './money.js';

export type InterestType =
  | 'FLAT_MONTHLY'
  | 'REDUCING_BALANCE'
  | 'DAILY_PERCENT'
  | 'NO_INTEREST';

export interface DebtCalcInput {
  principal: DecInput;
  interestType: InterestType;
  /** %/month for FLAT_MONTHLY & REDUCING_BALANCE, %/day for DAILY_PERCENT. */
  interestRate: DecInput;
  startDate: Date;
  termMonths?: number | null;
  /** Day of month the payment is due (1-31); defaults to startDate's day. */
  paymentDay?: number | null;
}

export interface ScheduleItem {
  installmentNo: number;
  dueDate: Date;
  amountDue: Dec;
  principalPart: Dec;
  interestPart: Dec;
}

export interface DebtComputation {
  interestType: InterestType;
  schedule: ScheduleItem[];
  totalPrincipal: Dec;
  totalInterest: Dec;
  totalPayable: Dec;
  /** DAILY_PERCENT only: interest accrued per day on the full principal. */
  interestPerDay?: Dec;
}

// ─── Date helpers (UTC to match @db.Date storage; no TZ drift) ────────────

function addMonthsClampDay(base: Date, monthsToAdd: number, day?: number | null): Date {
  const y = base.getUTCFullYear();
  const totalMonth = base.getUTCMonth() + monthsToAdd;
  const targetY = y + Math.floor(totalMonth / 12);
  const targetM = ((totalMonth % 12) + 12) % 12;
  const daysInTarget = new Date(Date.UTC(targetY, targetM + 1, 0)).getUTCDate();
  const wanted = day ?? base.getUTCDate();
  const d = Math.min(Math.max(1, wanted), daysInTarget);
  return new Date(Date.UTC(targetY, targetM, d));
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

// ─── Public API ───────────────────────────────────────────────────────────

/**
 * Compute the full schedule + totals for a debt. `termMonths` is required for a
 * schedule with all types except DAILY_PERCENT (which may be open-ended — then
 * the schedule is empty but interestPerDay is still returned).
 */
export function computeDebt(input: DebtCalcInput): DebtComputation {
  const principal = round2(input.principal);
  if (principal.lessThanOrEqualTo(0)) {
    return emptyComputation(input.interestType, principal);
  }
  switch (input.interestType) {
    case 'FLAT_MONTHLY':
      return flatMonthly(input, principal);
    case 'REDUCING_BALANCE':
      return reducingBalance(input, principal);
    case 'DAILY_PERCENT':
      return dailyPercent(input, principal);
    case 'NO_INTEREST':
      return noInterest(input, principal);
    default:
      throw new Error(`Unknown interestType: ${input.interestType as string}`);
  }
}

/**
 * Interest accrued on a remaining balance from `startDate` to `asOf`, for a
 * DAILY_PERCENT loan. rate is %/day. Used for "interest accrued to date".
 */
export function dailyInterestAccrued(
  remainingPrincipal: DecInput,
  ratePercentPerDay: DecInput,
  startDate: Date,
  asOf: Date,
): Dec {
  const days = Math.max(0, daysBetween(startDate, asOf));
  return round2(D(remainingPrincipal).times(pct(ratePercentPerDay)).times(days));
}

/** Simple savings interest at maturity: amount × rate%/yr × termMonths/12. */
export function savingsMaturityInterest(
  amount: DecInput,
  ratePercentPerYear: DecInput,
  termMonths: number,
): Dec {
  return round2(
    D(amount).times(pct(ratePercentPerYear)).times(D(termMonths).dividedBy(12)),
  );
}

// ─── Per-type implementations ───────────────────────────────────────────────

function flatMonthly(input: DebtCalcInput, principal: Dec): DebtComputation {
  const n = normalizeTerm(input.termMonths);
  const rate = pct(input.interestRate); // fraction / month
  const monthlyInterest = round2(principal.times(rate));
  const basePrincipal = round2(principal.dividedBy(n));

  const schedule: ScheduleItem[] = [];
  let allocated = new Prisma.Decimal(0);
  for (let i = 1; i <= n; i++) {
    const principalPart = i === n ? round2(principal.minus(allocated)) : basePrincipal;
    allocated = allocated.plus(principalPart);
    schedule.push(makeItem(input, i, principalPart, monthlyInterest));
  }
  const totalInterest = round2(monthlyInterest.times(n));
  return finalize('FLAT_MONTHLY', principal, totalInterest, schedule);
}

function noInterest(input: DebtCalcInput, principal: Dec): DebtComputation {
  const n = normalizeTerm(input.termMonths);
  const basePrincipal = round2(principal.dividedBy(n));
  const schedule: ScheduleItem[] = [];
  let allocated = new Prisma.Decimal(0);
  for (let i = 1; i <= n; i++) {
    const principalPart = i === n ? round2(principal.minus(allocated)) : basePrincipal;
    allocated = allocated.plus(principalPart);
    schedule.push(makeItem(input, i, principalPart, new Prisma.Decimal(0)));
  }
  return finalize('NO_INTEREST', principal, new Prisma.Decimal(0), schedule);
}

function reducingBalance(input: DebtCalcInput, principal: Dec): DebtComputation {
  const n = normalizeTerm(input.termMonths);
  const r = pct(input.interestRate); // fraction / month
  if (r.isZero()) {
    // No interest → identical to an even principal split.
    return { ...noInterest(input, principal), interestType: 'REDUCING_BALANCE' };
  }

  // EMI = P·r·(1+r)^n / ((1+r)^n − 1)
  const onePlusR = r.plus(1);
  const pow = onePlusR.pow(n);
  const emi = round2(principal.times(r).times(pow).dividedBy(pow.minus(1)));

  const schedule: ScheduleItem[] = [];
  let balance = principal;
  let totalInterest = new Prisma.Decimal(0);
  for (let i = 1; i <= n; i++) {
    const interestPart = round2(balance.times(r));
    let principalPart: Dec;
    if (i === n) {
      principalPart = round2(balance); // clear whatever remains
    } else {
      principalPart = round2(emi.minus(interestPart));
    }
    balance = balance.minus(principalPart);
    totalInterest = totalInterest.plus(interestPart);
    schedule.push(makeItem(input, i, principalPart, interestPart));
  }
  return finalize('REDUCING_BALANCE', principal, round2(totalInterest), schedule);
}

function dailyPercent(input: DebtCalcInput, principal: Dec): DebtComputation {
  const dr = pct(input.interestRate); // fraction / day
  const interestPerDay = round2(principal.times(dr));

  // Open-ended (no term): no fixed schedule, but expose the per-day rate so the
  // UI can show "≈ X ₫/ngày" and the service can accrue to any date.
  const term = input.termMonths ?? 0;
  if (term <= 0) {
    return {
      interestType: 'DAILY_PERCENT',
      schedule: [],
      totalPrincipal: principal,
      totalInterest: new Prisma.Decimal(0),
      totalPayable: principal,
      interestPerDay,
    };
  }

  // Fixed term: split principal evenly; each installment's interest is the
  // remaining balance × daily-rate × days elapsed in that period.
  const n = term;
  const basePrincipal = round2(principal.dividedBy(n));
  const schedule: ScheduleItem[] = [];
  let balance = principal;
  let allocated = new Prisma.Decimal(0);
  let totalInterest = new Prisma.Decimal(0);
  let prevDate = input.startDate;
  for (let i = 1; i <= n; i++) {
    const dueDate = addMonthsClampDay(input.startDate, i, input.paymentDay);
    const days = Math.max(0, daysBetween(prevDate, dueDate));
    const interestPart = round2(balance.times(dr).times(days));
    const principalPart = i === n ? round2(principal.minus(allocated)) : basePrincipal;
    allocated = allocated.plus(principalPart);
    balance = balance.minus(principalPart);
    totalInterest = totalInterest.plus(interestPart);
    schedule.push({
      installmentNo: i,
      dueDate,
      principalPart,
      interestPart,
      amountDue: round2(principalPart.plus(interestPart)),
    });
    prevDate = dueDate;
  }
  return {
    interestType: 'DAILY_PERCENT',
    schedule,
    totalPrincipal: principal,
    totalInterest: round2(totalInterest),
    totalPayable: round2(principal.plus(totalInterest)),
    interestPerDay,
  };
}

// ─── Small builders ─────────────────────────────────────────────────────────

function makeItem(
  input: DebtCalcInput,
  installmentNo: number,
  principalPart: Dec,
  interestPart: Dec,
): ScheduleItem {
  return {
    installmentNo,
    dueDate: addMonthsClampDay(input.startDate, installmentNo, input.paymentDay),
    principalPart,
    interestPart,
    amountDue: round2(principalPart.plus(interestPart)),
  };
}

function finalize(
  interestType: InterestType,
  principal: Dec,
  totalInterest: Dec,
  schedule: ScheduleItem[],
): DebtComputation {
  return {
    interestType,
    schedule,
    totalPrincipal: principal,
    totalInterest,
    totalPayable: round2(principal.plus(totalInterest)),
  };
}

function emptyComputation(interestType: InterestType, principal: Dec): DebtComputation {
  return {
    interestType,
    schedule: [],
    totalPrincipal: principal,
    totalInterest: new Prisma.Decimal(0),
    totalPayable: principal,
    ...(interestType === 'DAILY_PERCENT' ? { interestPerDay: new Prisma.Decimal(0) } : {}),
  };
}

function normalizeTerm(termMonths?: number | null): number {
  const n = Math.floor(termMonths ?? 0);
  if (n <= 0) {
    throw new Error('termMonths must be a positive integer for this interest type');
  }
  return n;
}
