/**
 * Money-math unit tests (P1-13). Run with the built-in node:test runner
 * via tsx (`npm test`). Pure functions — no DB, no network — so they run
 * fast and deterministically in CI.
 *
 * Guards the invariants that matter for correctness of every balance:
 * decimal-safe arithmetic (never JS floats) and HALF_UP rounding, plus a
 * worked debt-schedule example whose numbers are hand-verifiable.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { round2, sum, pct } from './money.js';
import { computeDebt } from './debtCalculator.js';

test('sum is decimal-safe — 0.1 + 0.2 === 0.3 (no float drift)', () => {
  assert.equal(sum([0.1, 0.2]).toString(), '0.3');
  assert.equal(sum([1_000_000, 120_000, 320_000]).toString(), '1440000');
});

test('round2 rounds to 2 decimal places, HALF_UP', () => {
  assert.equal(round2('10.005').toString(), '10.01');
  assert.equal(round2('2.344').toString(), '2.34');
  assert.equal(round2('2.345').toString(), '2.35');
});

test('pct converts a percentage to a fraction', () => {
  assert.equal(pct(1.5).toString(), '0.015');
  assert.equal(pct(100).toString(), '1');
});

test('computeDebt FLAT_MONTHLY: 12,000,000 @ 1%/mo × 12 matches the worked example', () => {
  const r = computeDebt({
    principal: 12_000_000,
    interestType: 'FLAT_MONTHLY',
    interestRate: 1,
    startDate: new Date(Date.UTC(2026, 0, 15)),
    termMonths: 12,
    paymentDay: 15,
  });
  assert.equal(r.schedule.length, 12);
  assert.ok(r.schedule[0].interestPart.equals(120_000), 'monthly interest = 120,000');
  assert.ok(r.schedule[0].principalPart.equals(1_000_000), 'monthly principal = 1,000,000');
  assert.ok(r.schedule[0].amountDue.equals(1_120_000), 'monthly due = 1,120,000');
  assert.ok(r.totalInterest.equals(1_440_000), 'total interest = 1,440,000');
  assert.ok(r.totalPayable.equals(13_440_000), 'total payable = 13,440,000');
});
