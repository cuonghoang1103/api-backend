/**
 * MoneyFlow — Savings service (per-user): term deposits + goals.
 * ────────────────────────────────────────────────────────────
 * SavingsAccount: a bank term deposit. maturityDate computed on create; simple
 * interest projected via debtCalculator.savingsMaturityInterest. Auto-flips to
 * MATURED past maturity. Withdrawal optionally credits a wallet with principal +
 * interest. SavingsGoal: target with "+ nạp thêm" that debits a wallet. All
 * wallet moves run in `$transaction` and are audited; scoped by userId.
 */
import { prisma } from '../../config/database.js';
import { Prisma } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { D, round2, sum, isPositive } from './money.js';
import { assertId, toDateOnly, todayUtc } from './helpers.js';
import { savingsMaturityInterest } from './debtCalculator.js';
import { applyWalletDelta } from './wallet.service.js';

function addMonths(base: Date, months: number): Date {
  const y = base.getUTCFullYear();
  const m = base.getUTCMonth() + months;
  const targetY = y + Math.floor(m / 12);
  const targetM = ((m % 12) + 12) % 12;
  const dim = new Date(Date.UTC(targetY, targetM + 1, 0)).getUTCDate();
  return new Date(Date.UTC(targetY, targetM, Math.min(base.getUTCDate(), dim)));
}

function decorateAccount(a: Prisma.SavingsAccountGetPayload<object>) {
  const projectedInterest = savingsMaturityInterest(a.amount, a.interestRatePerYear, a.termMonths);
  const today = todayUtc();
  const daysToMaturity = Math.round((a.maturityDate.getTime() - today.getTime()) / 86_400_000);
  return {
    ...a,
    computed: {
      projectedInterest,
      maturityValue: round2(D(a.amount).plus(projectedInterest)),
      daysToMaturity,
      isMatured: daysToMaturity <= 0,
    },
  };
}

// ─── Accounts ────────────────────────────────────────────────
export async function sweepMaturedSavings(userId: number) {
  const today = todayUtc();
  await prisma.savingsAccount.updateMany({ where: { userId, status: 'ACTIVE', maturityDate: { lte: today } }, data: { status: 'MATURED' } });
}

export async function listSavingsAccounts(userId: number) {
  await sweepMaturedSavings(userId);
  const accounts = await prisma.savingsAccount.findMany({ where: { userId }, orderBy: [{ status: 'asc' }, { maturityDate: 'asc' }] });
  return accounts.map(decorateAccount);
}

export async function createSavingsAccount(
  userId: number,
  data: { bankName?: string; amount: number | string; interestRatePerYear: number | string; termMonths: number; startDate?: string; autoRenew?: boolean; walletId?: number | null; note?: string },
) {
  const bankName = String(data.bankName ?? '').trim();
  if (!bankName) throw new BadRequestError('Tên ngân hàng không được để trống');
  const amount = round2(D(data.amount));
  if (!isPositive(amount)) throw new BadRequestError('Số tiền gửi phải lớn hơn 0');
  const termMonths = Math.floor(Number(data.termMonths));
  if (!termMonths || termMonths <= 0) throw new BadRequestError('Kỳ hạn (tháng) không hợp lệ');
  const rate = D(data.interestRatePerYear ?? 0);
  if (rate.isNegative()) throw new BadRequestError('Lãi suất không hợp lệ');
  const startDate = data.startDate ? toDateOnly(data.startDate) : todayUtc();
  const maturityDate = addMonths(startDate, termMonths);

  return prisma.$transaction(async (tx) => {
    if (data.walletId) {
      assertId(data.walletId, 'walletId');
      const updated = await applyWalletDelta(tx, userId, data.walletId, amount.negated());
      await tx.walletAdjustment.create({ data: { userId, walletId: data.walletId, kind: 'SAVINGS', amount: amount.negated(), balanceAfter: updated.balance, reason: `Gửi tiết kiệm: ${bankName}` } });
    }
    const created = await tx.savingsAccount.create({
      data: { userId, bankName, amount, interestRatePerYear: rate, termMonths, startDate, maturityDate, autoRenew: Boolean(data.autoRenew), walletId: data.walletId ?? null, note: data.note?.toString().slice(0, 1000) || null },
    });
    return decorateAccount(created);
  });
}

export async function updateSavingsAccount(userId: number, id: number, data: Record<string, unknown>) {
  assertId(id, 'savingsAccountId');
  const patch: Prisma.SavingsAccountUpdateInput = {};
  if (data.bankName !== undefined) { const n = String(data.bankName).trim(); if (!n) throw new BadRequestError('Tên ngân hàng không được để trống'); patch.bankName = n; }
  if (data.autoRenew !== undefined) patch.autoRenew = Boolean(data.autoRenew);
  if (data.note !== undefined) patch.note = (data.note as string)?.toString().slice(0, 1000) || null;
  const res = await prisma.savingsAccount.updateMany({ where: { id, userId }, data: patch });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy sổ tiết kiệm');
  return prisma.savingsAccount.findUnique({ where: { id } }).then((a) => decorateAccount(a!));
}

/** Withdraw: mark WITHDRAWN; optionally credit a wallet with principal + interest. */
export async function withdrawSavingsAccount(userId: number, id: number, input: { walletId?: number | null; includeInterest?: boolean }) {
  assertId(id, 'savingsAccountId');
  return prisma.$transaction(async (tx) => {
    const acc = await tx.savingsAccount.findFirst({ where: { id, userId } });
    if (!acc) throw new NotFoundError('Không tìm thấy sổ tiết kiệm');
    if (acc.status === 'WITHDRAWN') throw new BadRequestError('Sổ này đã tất toán');
    const interest = input.includeInterest === false ? new Prisma.Decimal(0) : savingsMaturityInterest(acc.amount, acc.interestRatePerYear, acc.termMonths);
    const proceeds = round2(D(acc.amount).plus(interest));
    if (input.walletId) {
      assertId(input.walletId, 'walletId');
      const updated = await applyWalletDelta(tx, userId, input.walletId, proceeds);
      await tx.walletAdjustment.create({ data: { userId, walletId: input.walletId, kind: 'SAVINGS', amount: proceeds, balanceAfter: updated.balance, reason: `Tất toán tiết kiệm: ${acc.bankName}` } });
    }
    return tx.savingsAccount.update({ where: { id }, data: { status: 'WITHDRAWN' } });
  });
}

export async function deleteSavingsAccount(userId: number, id: number) {
  assertId(id, 'savingsAccountId');
  const res = await prisma.savingsAccount.deleteMany({ where: { id, userId } });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy sổ tiết kiệm');
  return { id };
}

// ─── Goals ───────────────────────────────────────────────────
function decorateGoal(g: Prisma.SavingsGoalGetPayload<object>) {
  const target = D(g.targetAmount);
  const current = D(g.currentAmount);
  const pct = target.isZero() ? 0 : round2(current.dividedBy(target).times(100)).toNumber();
  let perMonthHint: Prisma.Decimal | null = null;
  if (g.deadline) {
    const today = todayUtc();
    const monthsLeft = Math.max(1, Math.ceil((g.deadline.getTime() - today.getTime()) / (30 * 86_400_000)));
    const remaining = target.minus(current);
    perMonthHint = remaining.greaterThan(0) ? round2(remaining.dividedBy(monthsLeft)) : new Prisma.Decimal(0);
  }
  return { ...g, computed: { pct: Math.min(100, pct), remaining: round2(Prisma.Decimal.max(0, target.minus(current))), perMonthHint } };
}

export async function listSavingsGoals(userId: number) {
  const goals = await prisma.savingsGoal.findMany({ where: { userId }, orderBy: [{ status: 'asc' }, { id: 'asc' }] });
  return goals.map(decorateGoal);
}

export async function createSavingsGoal(userId: number, data: { name?: string; targetAmount: number | string; deadline?: string | null; icon?: string; currentAmount?: number | string }) {
  const name = String(data.name ?? '').trim();
  if (!name) throw new BadRequestError('Tên mục tiêu không được để trống');
  const targetAmount = round2(D(data.targetAmount));
  if (!isPositive(targetAmount)) throw new BadRequestError('Số tiền mục tiêu phải lớn hơn 0');
  const created = await prisma.savingsGoal.create({
    data: { userId, name, targetAmount, currentAmount: data.currentAmount != null ? round2(D(data.currentAmount)) : new Prisma.Decimal(0), deadline: data.deadline ? toDateOnly(data.deadline) : null, icon: data.icon?.toString().slice(0, 40) || null },
  });
  return decorateGoal(created);
}

export async function updateSavingsGoal(userId: number, id: number, data: Record<string, unknown>) {
  assertId(id, 'goalId');
  const patch: Prisma.SavingsGoalUpdateInput = {};
  if (data.name !== undefined) { const n = String(data.name).trim(); if (!n) throw new BadRequestError('Tên không được để trống'); patch.name = n; }
  if (data.targetAmount !== undefined) patch.targetAmount = round2(D(data.targetAmount as never));
  if (data.deadline !== undefined) patch.deadline = data.deadline ? toDateOnly(data.deadline as string) : null;
  if (data.icon !== undefined) patch.icon = (data.icon as string)?.toString().slice(0, 40) || null;
  const res = await prisma.savingsGoal.updateMany({ where: { id, userId }, data: patch });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy mục tiêu');
  return prisma.savingsGoal.findUnique({ where: { id } }).then((g) => decorateGoal(g!));
}

/** "+ nạp thêm": move money from a wallet into the goal. */
export async function contributeToGoal(userId: number, id: number, input: { amount: number | string; walletId?: number | null }) {
  assertId(id, 'goalId');
  const amount = round2(D(input.amount));
  if (!isPositive(amount)) throw new BadRequestError('Số tiền nạp phải lớn hơn 0');
  return prisma.$transaction(async (tx) => {
    const goal = await tx.savingsGoal.findFirst({ where: { id, userId } });
    if (!goal) throw new NotFoundError('Không tìm thấy mục tiêu');
    if (input.walletId) {
      assertId(input.walletId, 'walletId');
      const updated = await applyWalletDelta(tx, userId, input.walletId, amount.negated());
      await tx.walletAdjustment.create({ data: { userId, walletId: input.walletId, kind: 'GOAL', amount: amount.negated(), balanceAfter: updated.balance, reason: `Nạp mục tiêu: ${goal.name}` } });
    }
    const newCurrent = round2(D(goal.currentAmount).plus(amount));
    const achieved = newCurrent.greaterThanOrEqualTo(D(goal.targetAmount));
    const saved = await tx.savingsGoal.update({ where: { id }, data: { currentAmount: newCurrent, status: achieved ? 'ACHIEVED' : 'ACTIVE' } });
    return decorateGoal(saved);
  });
}

export async function deleteSavingsGoal(userId: number, id: number) {
  assertId(id, 'goalId');
  const res = await prisma.savingsGoal.deleteMany({ where: { id, userId } });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy mục tiêu');
  return { id };
}

export async function savingsSummary(userId: number) {
  const [accounts, goals] = await Promise.all([listSavingsAccounts(userId), listSavingsGoals(userId)]);
  const activeAccounts = accounts.filter((a) => a.status !== 'WITHDRAWN');
  return {
    totalSaved: sum(activeAccounts.map((a) => a.amount)),
    projectedInterest: sum(activeAccounts.map((a) => a.computed.projectedInterest)),
    accountsCount: activeAccounts.length,
    goalsSaved: sum(goals.map((g) => g.currentAmount)),
    goalsCount: goals.length,
  };
}
