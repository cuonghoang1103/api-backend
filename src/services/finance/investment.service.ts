/**
 * MoneyFlow — Investment service (per-user).
 * ────────────────────────────────────────────────────────────
 * Two kinds: SELF (courses/skills — track expected outcome, complete with a
 * result note) and ASSET (stocks/gold/crypto — track current value, gain/loss,
 * sell). Putting money in optionally debits a wallet; selling optionally credits
 * one — both inside `$transaction`, audited via WalletAdjustment. Scoped by userId.
 */
import { prisma } from '../../config/database.js';
import { Prisma } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { D, round2, sum, isPositive } from './money.js';
import { assertId, assertOneOf, toDateOnly, yearWindow } from './helpers.js';
import { applyWalletDelta } from './wallet.service.js';

export const INVESTMENT_TYPES = ['SELF', 'ASSET'] as const;

export async function listInvestments(userId: number, type?: string) {
  const where: Prisma.InvestmentWhereInput = { userId };
  if (type) where.type = String(type);
  return prisma.investment.findMany({ where, orderBy: [{ status: 'asc' }, { date: 'desc' }] });
}

export async function createInvestment(
  userId: number,
  data: {
    type?: string; name?: string; amount: number | string; date?: string; walletId?: number | null;
    expectedOutcome?: string; currentValue?: number | string | null; note?: string;
  },
) {
  const type = assertOneOf(data.type ?? 'ASSET', INVESTMENT_TYPES, 'Loại đầu tư');
  const name = String(data.name ?? '').trim();
  if (!name) throw new BadRequestError('Tên khoản đầu tư không được để trống');
  const amount = round2(D(data.amount));
  if (!isPositive(amount)) throw new BadRequestError('Số tiền đầu tư phải lớn hơn 0');
  const date = data.date ? toDateOnly(data.date) : toDateOnly(new Date());

  return prisma.$transaction(async (tx) => {
    if (data.walletId) {
      assertId(data.walletId, 'walletId');
      const updated = await applyWalletDelta(tx, userId, data.walletId, amount.negated());
      await tx.walletAdjustment.create({ data: { userId, walletId: data.walletId, kind: 'INVESTMENT', amount: amount.negated(), balanceAfter: updated.balance, reason: `Đầu tư: ${name}` } });
    }
    return tx.investment.create({
      data: {
        userId, type, name, amount, date, walletId: data.walletId ?? null,
        expectedOutcome: type === 'SELF' ? (data.expectedOutcome?.toString().slice(0, 2000) || null) : null,
        currentValue: type === 'ASSET' && data.currentValue != null ? round2(D(data.currentValue)) : (type === 'ASSET' ? amount : null),
        note: data.note?.toString().slice(0, 2000) || null,
      },
    });
  });
}

export async function updateInvestment(userId: number, id: number, data: Record<string, unknown>) {
  assertId(id, 'investmentId');
  const patch: Prisma.InvestmentUpdateInput = {};
  if (data.name !== undefined) { const n = String(data.name).trim(); if (!n) throw new BadRequestError('Tên không được để trống'); patch.name = n; }
  if (data.expectedOutcome !== undefined) patch.expectedOutcome = (data.expectedOutcome as string)?.toString().slice(0, 2000) || null;
  if (data.currentValue !== undefined) patch.currentValue = data.currentValue === null ? null : round2(D(data.currentValue as never));
  if (data.note !== undefined) patch.note = (data.note as string)?.toString().slice(0, 2000) || null;
  const res = await prisma.investment.updateMany({ where: { id, userId }, data: patch });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy khoản đầu tư');
  return prisma.investment.findUnique({ where: { id } });
}

/** SELF: mark completed with a result note. */
export async function completeInvestment(userId: number, id: number, outcomeNote?: string) {
  assertId(id, 'investmentId');
  const res = await prisma.investment.updateMany({ where: { id, userId, type: 'SELF' }, data: { status: 'COMPLETED', outcomeNote: outcomeNote?.toString().slice(0, 2000) || null } });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy khoản đầu tư SELF');
  return prisma.investment.findUnique({ where: { id } });
}

/** ASSET: sell — mark SOLD, optionally credit a wallet with the sale proceeds. */
export async function sellInvestment(userId: number, id: number, input: { saleAmount?: number | string; walletId?: number | null }) {
  assertId(id, 'investmentId');
  return prisma.$transaction(async (tx) => {
    const inv = await tx.investment.findFirst({ where: { id, userId, type: 'ASSET' } });
    if (!inv) throw new NotFoundError('Không tìm thấy tài sản');
    const proceeds = input.saleAmount != null ? round2(D(input.saleAmount)) : D(inv.currentValue ?? inv.amount);
    if (input.walletId) {
      assertId(input.walletId, 'walletId');
      const updated = await applyWalletDelta(tx, userId, input.walletId, proceeds);
      await tx.walletAdjustment.create({ data: { userId, walletId: input.walletId, kind: 'INVESTMENT', amount: proceeds, balanceAfter: updated.balance, reason: `Bán: ${inv.name}` } });
    }
    return tx.investment.update({ where: { id }, data: { status: 'SOLD', currentValue: proceeds } });
  });
}

export async function deleteInvestment(userId: number, id: number) {
  assertId(id, 'investmentId');
  const res = await prisma.investment.deleteMany({ where: { id, userId } });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy khoản đầu tư');
  return { id };
}

export async function investmentSummary(userId: number) {
  const all = await prisma.investment.findMany({ where: { userId } });
  const self = all.filter((i) => i.type === 'SELF');
  const assets = all.filter((i) => i.type === 'ASSET');
  const totalInvested = sum(all.map((i) => i.amount));
  const currentAssetValue = sum(assets.map((i) => i.currentValue ?? i.amount));
  const assetCost = sum(assets.map((i) => i.amount));
  const unrealizedGain = round2(currentAssetValue.minus(assetCost));

  const { start, end } = yearWindow();
  const selfThisYear = sum(self.filter((i) => i.date >= start && i.date < end).map((i) => i.amount));

  return {
    totalInvested,
    selfInvested: sum(self.map((i) => i.amount)),
    selfInvestedThisYear: selfThisYear,
    assetCost,
    currentAssetValue,
    unrealizedGain,
    unrealizedGainPct: assetCost.isZero() ? 0 : round2(unrealizedGain.dividedBy(assetCost).times(100)).toNumber(),
    counts: { self: self.length, asset: assets.length },
  };
}
