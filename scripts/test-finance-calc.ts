/**
 * Unit tests for the MoneyFlow debt calculator + savings interest.
 * Run: npm run test:finance
 *
 * Uses node:assert (no test-runner dep) to match the repo's scripts/test-*.ts
 * convention. Prints the worked examples that also appear in the Phase-1
 * manual-test checklist so the numbers can be hand-verified.
 */
import assert from 'node:assert/strict';
import {
  computeDebt,
  dailyInterestAccrued,
  savingsMaturityInterest,
} from '../src/services/finance/debtCalculator.js';
import { comparePayoff } from '../src/services/finance/payoffStrategy.js';

let passed = 0;
function check(label: string, cond: boolean, detail?: string) {
  assert.ok(cond, `${label}${detail ? ` — ${detail}` : ''}`);
  passed++;
  console.log(`  ✓ ${label}`);
}
function n(v: { toString(): string }): string {
  return Number(v.toString()).toLocaleString('en-US');
}

const START = new Date(Date.UTC(2026, 0, 15)); // 2026-01-15

console.log('\n── FLAT_MONTHLY ─────────────────────────────');
{
  // 12,000,000₫ @ 1%/month, 12 months.
  const r = computeDebt({
    principal: 12_000_000,
    interestType: 'FLAT_MONTHLY',
    interestRate: 1,
    startDate: START,
    termMonths: 12,
    paymentDay: 15,
  });
  console.log(
    `  principal 12.000.000 @ 1%/mo × 12 → monthly ${n(r.schedule[0].amountDue)}, ` +
      `total interest ${n(r.totalInterest)}, payable ${n(r.totalPayable)}`,
  );
  check('12 installments', r.schedule.length === 12);
  check('monthly interest = 120.000', r.schedule[0].interestPart.equals(120_000));
  check('monthly principal = 1.000.000', r.schedule[0].principalPart.equals(1_000_000));
  check('monthly amountDue = 1.120.000', r.schedule[0].amountDue.equals(1_120_000));
  check('total interest = 1.440.000', r.totalInterest.equals(1_440_000));
  check('total payable = 13.440.000', r.totalPayable.equals(13_440_000));
  const sumP = r.schedule.reduce((a, s) => a.plus(s.principalPart), r.schedule[0].principalPart.minus(r.schedule[0].principalPart));
  check('sum(principal) = principal', sumP.equals(12_000_000), `got ${n(sumP)}`);
}

console.log('\n── REDUCING_BALANCE ─────────────────────────');
{
  // 12,000,000₫ @ 1%/month, 12 months. Standard amortization.
  const r = computeDebt({
    principal: 12_000_000,
    interestType: 'REDUCING_BALANCE',
    interestRate: 1,
    startDate: START,
    termMonths: 12,
    paymentDay: 15,
  });
  console.log(
    `  principal 12.000.000 @ 1%/mo × 12 → EMI≈${n(r.schedule[0].amountDue)}, ` +
      `total interest ${n(r.totalInterest)}, payable ${n(r.totalPayable)}`,
  );
  check('12 installments', r.schedule.length === 12);
  check('month 1 interest = 120.000 (1% of 12M)', r.schedule[0].interestPart.equals(120_000));
  // Interest strictly decreases as balance reduces.
  check(
    'interest decreases month over month',
    r.schedule.every((s, i) => i === 0 || s.interestPart.lessThanOrEqualTo(r.schedule[i - 1].interestPart)),
  );
  const sumP = r.schedule.reduce((a, s) => a.plus(s.principalPart), computeDebt({ principal: 0, interestType: 'NO_INTEREST', interestRate: 0, startDate: START, termMonths: 1 }).totalPrincipal);
  check('sum(principal) = principal exactly', sumP.equals(12_000_000), `got ${n(sumP)}`);
  const sumI = r.schedule.reduce((a, s) => a.plus(s.interestPart), r.totalInterest.minus(r.totalInterest));
  check('totalInterest = sum(interestPart)', r.totalInterest.equals(sumI));
  check('total interest ≈ 780k–800k', r.totalInterest.greaterThan(780_000) && r.totalInterest.lessThan(800_000), `got ${n(r.totalInterest)}`);
  check('EMI constant for months 1..11', r.schedule.slice(0, 11).every((s) => s.amountDue.equals(r.schedule[0].amountDue)));
}

console.log('\n── DAILY_PERCENT ────────────────────────────');
{
  // 10,000,000₫ @ 0.05%/day.
  const r = computeDebt({
    principal: 10_000_000,
    interestType: 'DAILY_PERCENT',
    interestRate: 0.05,
    startDate: START,
    termMonths: 3,
    paymentDay: 15,
  });
  console.log(
    `  principal 10.000.000 @ 0,05%/ngày → ${n(r.interestPerDay!)} ₫/ngày; ` +
      `30-day accrual ${n(dailyInterestAccrued(10_000_000, 0.05, START, new Date(Date.UTC(2026, 1, 14))))}`,
  );
  check('interest per day = 5.000', r.interestPerDay!.equals(5_000));
  const accrued30 = dailyInterestAccrued(10_000_000, 0.05, START, new Date(Date.UTC(2026, 1, 14)));
  check('30-day accrual = 150.000', accrued30.equals(150_000), `got ${n(accrued30)}`);
  check('0-day accrual = 0', dailyInterestAccrued(10_000_000, 0.05, START, START).equals(0));
  check('term schedule has 3 installments', r.schedule.length === 3);
  const sumP = r.schedule.reduce((a, s) => a.plus(s.principalPart), r.totalPrincipal.minus(r.totalPrincipal));
  check('sum(principal) = principal', sumP.equals(10_000_000), `got ${n(sumP)}`);
  check('total interest > 0', r.totalInterest.greaterThan(0));

  // Open-ended (no term): schedule empty, per-day rate still exposed.
  const open = computeDebt({ principal: 10_000_000, interestType: 'DAILY_PERCENT', interestRate: 0.05, startDate: START });
  check('open-ended: no schedule', open.schedule.length === 0);
  check('open-ended: interestPerDay = 5.000', open.interestPerDay!.equals(5_000));
}

console.log('\n── NO_INTEREST ──────────────────────────────');
{
  // 6,000,000₫, 6 months, personal loan.
  const r = computeDebt({
    principal: 6_000_000,
    interestType: 'NO_INTEREST',
    interestRate: 0,
    startDate: START,
    termMonths: 6,
    paymentDay: 15,
  });
  console.log(`  principal 6.000.000 × 6 tháng → ${n(r.schedule[0].amountDue)}/tháng, lãi ${n(r.totalInterest)}`);
  check('6 installments', r.schedule.length === 6);
  check('monthly = 1.000.000', r.schedule[0].amountDue.equals(1_000_000));
  check('zero interest', r.totalInterest.equals(0));
  check('total payable = principal', r.totalPayable.equals(6_000_000));
}

console.log('\n── Rounding remainder (odd principal) ───────');
{
  // 10,000,000 / 3 → 3,333,333.33 with last installment absorbing remainder.
  const r = computeDebt({ principal: 10_000_000, interestType: 'NO_INTEREST', interestRate: 0, startDate: START, termMonths: 3 });
  const sumP = r.schedule.reduce((a, s) => a.plus(s.principalPart), r.totalPrincipal.minus(r.totalPrincipal));
  check('sum still exactly = principal despite rounding', sumP.equals(10_000_000), `got ${n(sumP)}`);
}

console.log('\n── Due dates ────────────────────────────────');
{
  const r = computeDebt({ principal: 3_000_000, interestType: 'NO_INTEREST', interestRate: 0, startDate: START, termMonths: 3, paymentDay: 15 });
  check('installment 1 due 2026-02-15', r.schedule[0].dueDate.toISOString().startsWith('2026-02-15'));
  check('installment 3 due 2026-04-15', r.schedule[2].dueDate.toISOString().startsWith('2026-04-15'));
}

console.log('\n── SAVINGS simple interest ──────────────────');
{
  // 100,000,000₫ @ 6%/yr for 6 months = 3,000,000.
  const i = savingsMaturityInterest(100_000_000, 6, 6);
  console.log(`  100.000.000 @ 6%/năm × 6 tháng → lãi đáo hạn ${n(i)}`);
  check('6-month interest = 3.000.000', i.equals(3_000_000), `got ${n(i)}`);
  check('12-month @ 6% = 6.000.000', savingsMaturityInterest(100_000_000, 6, 12).equals(6_000_000));
  check('3-month @ 5% on 50M = 625.000', savingsMaturityInterest(50_000_000, 5, 3).equals(625_000));
}

console.log('\n── PAYOFF: snowball vs avalanche ─────────────');
{
  // Two debts: small balance @ low rate, big balance @ high rate.
  const debts = [
    { id: 1, name: 'Nhỏ-rẻ', balance: 2_000_000, monthlyRatePct: 1, minPayment: 200_000 },
    { id: 2, name: 'To-đắt', balance: 8_000_000, monthlyRatePct: 5, minPayment: 300_000 },
  ];
  const r = comparePayoff(debts, 2_000_000)!; // 2tr extra/month
  console.log(`  budget ${n(r.monthlyBudget)}/tháng → avalanche tiết kiệm lãi ${n(r.avalancheInterestSaved)} (snowball ${n(r.snowball.totalInterest)} vs avalanche ${n(r.avalanche.totalInterest)})`);
  check('snowball orders smallest-balance first', r.snowball.order[0].id === 1);
  check('avalanche orders highest-rate first', r.avalanche.order[0].id === 2);
  check('avalanche pays ≤ interest than snowball', r.avalanche.totalInterest.lessThanOrEqualTo(r.snowball.totalInterest));
  check('both strategies clear the debt (months < cap)', r.snowball.months < 600 && r.avalanche.months < 600);
  check('empty debt list → null', comparePayoff([]) === null);
}

console.log(`\n✅ All ${passed} assertions passed.\n`);
