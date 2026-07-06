/**
 * MoneyFlow — Wallet service (per-user).
 * ────────────────────────────────────────────────────────────
 * Wallets hold balances. Balances are ONLY ever changed through
 * `applyWalletDelta()` inside a `$transaction`, so income/expense/
 * debt-payment/transfer/adjustment can never leave a balance drifting.
 * Every query is scoped by `userId`; ownership is re-checked inside the
 * transaction before any mutation (the cross-tenant guard).
 */
import { prisma } from '../../config/database.js';
import { Prisma } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { D, round2, isPositive } from './money.js';
import { assertId, assertOneOf, pageParams } from './helpers.js';
import { CURRENCIES, getCurrentFxRate, toVnd, vndToUsd } from './fx.service.js';

type Tx = Prisma.TransactionClient;

export const WALLET_TYPES = ['CASH', 'BANK', 'EWALLET', 'OTHER'] as const;

/**
 * Verify the wallet belongs to `userId`, then atomically add `delta`
 * (signed) to its balance. Returns the wallet row with the NEW balance.
 * MUST be called inside a `$transaction`. Uses an atomic `increment` so
 * concurrent mutations cannot lose updates.
 */
export async function applyWalletDelta(
  tx: Tx,
  userId: number,
  walletId: number,
  delta: Prisma.Decimal | number | string,
): Promise<{ id: number; balance: Prisma.Decimal; currency: string }> {
  const owned = await tx.wallet.findFirst({
    where: { id: walletId, userId },
    select: { id: true },
  });
  if (!owned) throw new NotFoundError('Không tìm thấy ví');
  const updated = await tx.wallet.update({
    where: { id: walletId },
    data: { balance: { increment: round2(delta) } },
    select: { id: true, balance: true, currency: true },
  });
  return updated;
}

// ─── CRUD ────────────────────────────────────────────────────

export async function listWallets(userId: number, includeArchived = false) {
  return prisma.wallet.findMany({
    where: { userId, ...(includeArchived ? {} : { isArchived: false }) },
    orderBy: [{ isArchived: 'asc' }, { order: 'asc' }, { id: 'asc' }],
  });
}

export async function getWallet(userId: number, id: number) {
  assertId(id, 'walletId');
  const wallet = await prisma.wallet.findFirst({ where: { id, userId } });
  if (!wallet) throw new NotFoundError('Không tìm thấy ví');
  return wallet;
}

export async function createWallet(
  userId: number,
  data: {
    name?: string;
    type?: string;
    icon?: string | null;
    color?: string | null;
    balance?: number | string;
    currency?: string;
    order?: number;
  },
) {
  const name = String(data.name ?? '').trim();
  if (!name) throw new BadRequestError('Tên ví không được để trống');
  const type = assertOneOf(data.type ?? 'CASH', WALLET_TYPES, 'Loại ví');
  const balance = round2(D(data.balance ?? 0));
  const currency = assertOneOf(data.currency ?? 'VND', CURRENCIES, 'Tiền tệ');

  const count = await prisma.wallet.count({ where: { userId } });
  return prisma.wallet.create({
    data: {
      userId,
      name,
      type,
      icon: data.icon?.toString().slice(0, 40) || null,
      color: data.color?.toString().slice(0, 20) || null,
      balance,
      currency,
      order: Number.isFinite(data.order) ? Number(data.order) : count,
    },
  });
}

export async function updateWallet(
  userId: number,
  id: number,
  data: {
    name?: string;
    type?: string;
    icon?: string | null;
    color?: string | null;
    order?: number;
    isArchived?: boolean;
  },
) {
  assertId(id, 'walletId');
  const patch: Prisma.WalletUpdateInput = {};
  if (data.name !== undefined) {
    const name = String(data.name).trim();
    if (!name) throw new BadRequestError('Tên ví không được để trống');
    patch.name = name;
  }
  if (data.type !== undefined) patch.type = assertOneOf(data.type, WALLET_TYPES, 'Loại ví');
  if (data.icon !== undefined) patch.icon = data.icon?.toString().slice(0, 40) || null;
  if (data.color !== undefined) patch.color = data.color?.toString().slice(0, 20) || null;
  if (data.order !== undefined) patch.order = Math.floor(Number(data.order) || 0);
  if (data.isArchived !== undefined) patch.isArchived = Boolean(data.isArchived);

  const res = await prisma.wallet.updateMany({ where: { id, userId }, data: patch });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy ví');
  return prisma.wallet.findUnique({ where: { id } });
}

export async function archiveWallet(userId: number, id: number, archived = true) {
  return updateWallet(userId, id, { isArchived: archived });
}

/**
 * Hard-delete a wallet, but only if nothing references it (expenses, income,
 * debt payments, recurring). Otherwise the caller should archive instead, so
 * historical records keep a valid wallet reference.
 */
export async function deleteWallet(userId: number, id: number) {
  assertId(id, 'walletId');
  const owned = await prisma.wallet.findFirst({ where: { id, userId }, select: { id: true } });
  if (!owned) throw new NotFoundError('Không tìm thấy ví');

  const [expenses, incomes, payments, recurrings] = await Promise.all([
    prisma.expense.count({ where: { userId, walletId: id } }),
    prisma.incomeEntry.count({ where: { userId, walletId: id } }),
    prisma.debtPayment.count({ where: { userId, walletId: id } }),
    prisma.recurringTransaction.count({ where: { userId, walletId: id } }),
  ]);
  if (expenses + incomes + payments + recurrings > 0) {
    throw new BadRequestError(
      'Ví đang có giao dịch liên kết — hãy lưu trữ (archive) thay vì xoá để giữ lịch sử',
    );
  }
  await prisma.wallet.delete({ where: { id } });
  return { id };
}

export async function reorderWallets(userId: number, orderedIds: number[]) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    throw new BadRequestError('Danh sách thứ tự không hợp lệ');
  }
  const owned = await prisma.wallet.findMany({
    where: { id: { in: orderedIds }, userId },
    select: { id: true },
  });
  const ownedSet = new Set(owned.map((w) => w.id));
  await prisma.$transaction(
    orderedIds
      .filter((id) => ownedSet.has(id))
      .map((id, index) =>
        prisma.wallet.update({ where: { id }, data: { order: index } }),
      ),
  );
  return listWallets(userId);
}

// ─── Transfer & adjust (atomic, audited) ─────────────────────

export async function transferBetweenWallets(
  userId: number,
  input: { fromWalletId: number; toWalletId: number; amount: number | string; note?: string },
) {
  const { fromWalletId, toWalletId } = input;
  assertId(fromWalletId, 'fromWalletId');
  assertId(toWalletId, 'toWalletId');
  if (fromWalletId === toWalletId) throw new BadRequestError('Không thể chuyển vào cùng một ví');
  const amount = round2(D(input.amount));
  if (!isPositive(amount)) throw new BadRequestError('Số tiền chuyển phải lớn hơn 0');

  // Cross-currency transfers convert at the user's current rate. `amount`
  // is always in the SOURCE wallet's currency; the destination is credited
  // with the converted figure and the rate is stamped into the audit note.
  const [fromWallet, toWallet] = await Promise.all([
    prisma.wallet.findFirst({ where: { id: fromWalletId, userId }, select: { currency: true } }),
    prisma.wallet.findFirst({ where: { id: toWalletId, userId }, select: { currency: true } }),
  ]);
  if (!fromWallet || !toWallet) throw new NotFoundError('Không tìm thấy ví');

  let creditAmount = amount;
  let fxNote: string | null = null;
  if (fromWallet.currency !== toWallet.currency) {
    const fx = await getCurrentFxRate(userId);
    if (!fx) throw new BadRequestError('Hai ví khác tiền tệ — hãy đặt tỷ giá trong mục Tỷ giá trước khi chuyển');
    const rate = D(fx.vndPerUsd);
    creditAmount = fromWallet.currency === 'USD' ? toVnd(amount, 'USD', rate) : vndToUsd(amount, rate);
    fxNote = `Tỷ giá ${round2(rate).toFixed(0)} ₫/$`;
  }

  return prisma.$transaction(async (tx) => {
    const from = await applyWalletDelta(tx, userId, fromWalletId, amount.negated());
    const to = await applyWalletDelta(tx, userId, toWalletId, creditAmount);
    const userNote = input.note?.toString().slice(0, 480) || null;
    const note = [userNote, fxNote].filter(Boolean).join(' · ') || null;
    await tx.walletAdjustment.createMany({
      data: [
        {
          userId,
          walletId: fromWalletId,
          kind: 'TRANSFER',
          amount: amount.negated(),
          balanceAfter: from.balance,
          counterpartyWalletId: toWalletId,
          reason: note,
        },
        {
          userId,
          walletId: toWalletId,
          kind: 'TRANSFER',
          amount: creditAmount,
          balanceAfter: to.balance,
          counterpartyWalletId: fromWalletId,
          reason: note,
        },
      ],
    });
    return { from, to };
  });
}

/** Set a wallet to an exact target balance, recording the delta for audit. */
export async function adjustWalletBalance(
  userId: number,
  walletId: number,
  input: { targetBalance: number | string; reason?: string },
) {
  assertId(walletId, 'walletId');
  const target = round2(D(input.targetBalance));

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findFirst({
      where: { id: walletId, userId },
      select: { id: true, balance: true },
    });
    if (!wallet) throw new NotFoundError('Không tìm thấy ví');
    const delta = round2(target.minus(D(wallet.balance)));
    if (delta.isZero()) return wallet;

    const updated = await applyWalletDelta(tx, userId, walletId, delta);
    await tx.walletAdjustment.create({
      data: {
        userId,
        walletId,
        kind: 'ADJUSTMENT',
        amount: delta,
        balanceAfter: updated.balance,
        reason: input.reason?.toString().slice(0, 500) || null,
      },
    });
    return updated;
  });
}

// ─── Unified transaction history for one wallet ──────────────

type LedgerRow = {
  kind: 'INCOME' | 'EXPENSE' | 'DEBT_PAYMENT' | 'ADJUSTMENT' | 'TRANSFER';
  refId: number;
  date: Date;
  amount: Prisma.Decimal; // signed (+ in, - out)
  label: string;
};

/**
 * Combined ledger for a wallet across every record type, newest first, with a
 * running balance column. Running balance is computed backwards from the
 * wallet's CURRENT balance over the most recent `cap` events, then paginated.
 */
export async function getWalletHistory(
  userId: number,
  walletId: number,
  opts: { page?: number; limit?: number } = {},
) {
  const wallet = await getWallet(userId, walletId);
  const cap = 1000;

  const [incomes, expenses, payments, adjustments] = await Promise.all([
    prisma.incomeEntry.findMany({
      where: { userId, walletId }, orderBy: { date: 'desc' }, take: cap,
      select: { id: true, amount: true, date: true, type: true, note: true },
    }),
    prisma.expense.findMany({
      where: { userId, walletId }, orderBy: { date: 'desc' }, take: cap,
      select: { id: true, amount: true, date: true, description: true },
    }),
    prisma.debtPayment.findMany({
      where: { userId, walletId }, orderBy: { date: 'desc' }, take: cap,
      select: { id: true, amount: true, date: true, note: true },
    }),
    prisma.walletAdjustment.findMany({
      where: { userId, walletId }, orderBy: { createdAt: 'desc' }, take: cap,
      select: { id: true, amount: true, createdAt: true, kind: true, reason: true },
    }),
  ]);

  const rows: LedgerRow[] = [
    ...incomes.map((r): LedgerRow => ({ kind: 'INCOME', refId: r.id, date: r.date, amount: D(r.amount), label: r.note || r.type })),
    ...expenses.map((r): LedgerRow => ({ kind: 'EXPENSE', refId: r.id, date: r.date, amount: D(r.amount).negated(), label: r.description || 'Chi tiêu' })),
    ...payments.map((r): LedgerRow => ({ kind: 'DEBT_PAYMENT', refId: r.id, date: r.date, amount: D(r.amount).negated(), label: r.note || 'Trả nợ' })),
    ...adjustments.map((r): LedgerRow => ({ kind: r.kind === 'TRANSFER' ? 'TRANSFER' : 'ADJUSTMENT', refId: r.id, date: r.createdAt, amount: D(r.amount), label: r.reason || (r.kind === 'TRANSFER' ? 'Chuyển ví' : 'Điều chỉnh') })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Running balance: start from current balance and subtract each event as we
  // walk into the past (balanceBefore = balanceAfter - amount).
  let running = D(wallet.balance);
  const withRunning = rows.map((r) => {
    const balanceAfter = running;
    running = round2(running.minus(r.amount));
    return { ...r, balanceAfter };
  });

  const { page, limit, skip } = pageParams(opts.page, opts.limit, 30);
  const slice = withRunning.slice(skip, skip + limit);
  return {
    wallet,
    rows: slice,
    pagination: { page, limit, total: withRunning.length, totalPages: Math.ceil(withRunning.length / limit) || 1 },
  };
}
