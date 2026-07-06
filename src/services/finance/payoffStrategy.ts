/**
 * MoneyFlow — Debt payoff strategy comparison (PURE, no DB).
 *
 * A neutral CALCULATION AID (not financial advice): compares two common
 * orderings for directing an extra monthly payment across several debts —
 *   Snowball:  smallest remaining balance first (motivation)
 *   Avalanche: highest interest rate first (least total interest)
 *
 * Each debt is reduced to a monthly model {balance, monthlyRatePct, minPayment}.
 * We simulate month-by-month: accrue interest, pay each debt's minimum, then
 * throw the whole leftover budget at the highest-priority unpaid debt. Decimal
 * throughout. Simulation is capped so a mis-parameterized input can't loop.
 */
import { Prisma } from '@prisma/client';
import { D, round2, sum, type Dec, type DecInput } from './money.js';

export interface PayoffDebt {
  id: number;
  name: string;
  balance: DecInput;
  monthlyRatePct: DecInput; // effective %/month
  minPayment: DecInput;
}

export interface PayoffResult {
  strategy: 'SNOWBALL' | 'AVALANCHE';
  order: Array<{ id: number; name: string }>;
  months: number;
  totalInterest: Dec;
  totalPaid: Dec;
}

const MAX_MONTHS = 600;

function orderFor(strategy: 'SNOWBALL' | 'AVALANCHE', debts: PayoffDebt[]): PayoffDebt[] {
  const copy = [...debts];
  if (strategy === 'SNOWBALL') copy.sort((a, b) => D(a.balance).minus(D(b.balance)).toNumber());
  else copy.sort((a, b) => D(b.monthlyRatePct).minus(D(a.monthlyRatePct)).toNumber());
  return copy;
}

function simulate(strategy: 'SNOWBALL' | 'AVALANCHE', debts: PayoffDebt[], monthlyBudget: Dec): PayoffResult {
  const ordered = orderFor(strategy, debts);
  const state = ordered.map((d) => ({ ref: d, bal: round2(d.balance), rate: D(d.monthlyRatePct).dividedBy(100), min: round2(d.minPayment) }));
  let totalInterest = new Prisma.Decimal(0);
  let totalPaid = new Prisma.Decimal(0);
  let months = 0;

  while (state.some((s) => s.bal.greaterThan(0)) && months < MAX_MONTHS) {
    months++;
    // accrue interest
    for (const s of state) {
      if (s.bal.lessThanOrEqualTo(0)) continue;
      const interest = round2(s.bal.times(s.rate));
      s.bal = s.bal.plus(interest);
      totalInterest = totalInterest.plus(interest);
    }
    let budget = monthlyBudget;
    // pay minimums first (capped at balance)
    for (const s of state) {
      if (s.bal.lessThanOrEqualTo(0) || budget.lessThanOrEqualTo(0)) continue;
      const pay = Prisma.Decimal.min(s.bal, s.min, budget);
      s.bal = round2(s.bal.minus(pay));
      budget = budget.minus(pay);
      totalPaid = totalPaid.plus(pay);
    }
    // throw the rest at the highest-priority unpaid debt (ordered)
    for (const s of state) {
      if (budget.lessThanOrEqualTo(0)) break;
      if (s.bal.lessThanOrEqualTo(0)) continue;
      const pay = Prisma.Decimal.min(s.bal, budget);
      s.bal = round2(s.bal.minus(pay));
      budget = budget.minus(pay);
      totalPaid = totalPaid.plus(pay);
    }
  }

  return {
    strategy,
    order: ordered.map((d) => ({ id: d.id, name: d.name })),
    months,
    totalInterest: round2(totalInterest),
    totalPaid: round2(totalPaid),
  };
}

/**
 * Compare snowball vs avalanche. `extraMonthly` is money beyond the sum of the
 * minimum payments; with 0 extra both strategies are identical (they only ever
 * pay minimums), so the UI should encourage entering an extra amount.
 */
export function comparePayoff(debts: PayoffDebt[], extraMonthly: DecInput = 0) {
  const active = debts.filter((d) => D(d.balance).greaterThan(0));
  if (active.length === 0) return null;
  const minSum = sum(active.map((d) => d.minPayment));
  const budget = round2(minSum.plus(D(extraMonthly)));

  const snowball = simulate('SNOWBALL', active, budget);
  const avalanche = simulate('AVALANCHE', active, budget);
  const interestSaved = round2(snowball.totalInterest.minus(avalanche.totalInterest));

  return {
    monthlyBudget: budget,
    minimumsSum: round2(minSum),
    extraMonthly: round2(D(extraMonthly)),
    snowball,
    avalanche,
    // avalanche usually wins on interest; snowball may clear a debt sooner
    avalancheInterestSaved: interestSaved, // positive = avalanche cheaper
    recommendationNote:
      'Đây chỉ là công cụ tính toán tham khảo, không phải lời khuyên tài chính. Avalanche thường trả ít lãi hơn; Snowball có thể tất toán khoản nhỏ sớm hơn để tạo động lực.',
  };
}
