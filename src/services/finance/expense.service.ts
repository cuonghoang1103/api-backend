/**
 * MoneyFlow — Expense service (per-user).
 * ────────────────────────────────────────────────────────────
 * Expenses debit a wallet. Every create/update/delete adjusts the linked
 * wallet balance inside a `$transaction` via `applyWalletDelta`, so the
 * money-out and the balance change are always consistent. Categories carry
 * an optional monthly budget. All queries scoped by `userId`.
 */
import { prisma } from '../../config/database.js';
import { Prisma } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { D, round2, isPositive, formatVnd } from './money.js';
import { assertId, toDateOnly, monthWindow, pageParams } from './helpers.js';
import { applyWalletDelta } from './wallet.service.js';

// ─── Categories ──────────────────────────────────────────────

export async function listCategories(userId: number) {
  return prisma.expenseCategory.findMany({
    where: { userId },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
  });
}

export async function createCategory(
  userId: number,
  data: { name?: string; icon?: string | null; color?: string | null; monthlyBudget?: number | string | null },
) {
  const name = String(data.name ?? '').trim();
  if (!name) throw new BadRequestError('Tên danh mục không được để trống');
  const count = await prisma.expenseCategory.count({ where: { userId } });
  return prisma.expenseCategory.create({
    data: {
      userId,
      name,
      icon: data.icon?.toString().slice(0, 40) || null,
      color: data.color?.toString().slice(0, 20) || null,
      monthlyBudget: data.monthlyBudget != null ? round2(D(data.monthlyBudget)) : null,
      order: count,
    },
  });
}

export async function updateCategory(
  userId: number,
  id: number,
  data: { name?: string; icon?: string | null; color?: string | null; monthlyBudget?: number | string | null; order?: number },
) {
  assertId(id, 'categoryId');
  const patch: Prisma.ExpenseCategoryUpdateInput = {};
  if (data.name !== undefined) {
    const name = String(data.name).trim();
    if (!name) throw new BadRequestError('Tên danh mục không được để trống');
    patch.name = name;
  }
  if (data.icon !== undefined) patch.icon = data.icon?.toString().slice(0, 40) || null;
  if (data.color !== undefined) patch.color = data.color?.toString().slice(0, 20) || null;
  if (data.order !== undefined) patch.order = Math.floor(Number(data.order) || 0);
  if (data.monthlyBudget !== undefined)
    patch.monthlyBudget = data.monthlyBudget === null ? null : round2(D(data.monthlyBudget));

  const res = await prisma.expenseCategory.updateMany({ where: { id, userId }, data: patch });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy danh mục');
  return prisma.expenseCategory.findUnique({ where: { id } });
}

export async function reorderCategories(userId: number, orderedIds: number[]) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) throw new BadRequestError('Danh sách thứ tự không hợp lệ');
  const owned = await prisma.expenseCategory.findMany({ where: { id: { in: orderedIds }, userId }, select: { id: true } });
  const ownedSet = new Set(owned.map((c) => c.id));
  await prisma.$transaction(
    orderedIds.filter((id) => ownedSet.has(id)).map((id, index) =>
      prisma.expenseCategory.update({ where: { id }, data: { order: index } }),
    ),
  );
  return listCategories(userId);
}

/** Delete a category; if it has expenses, require reassigning them first. */
export async function deleteCategory(userId: number, id: number, reassignToId?: number | null) {
  assertId(id, 'categoryId');
  const owned = await prisma.expenseCategory.findFirst({ where: { id, userId }, select: { id: true } });
  if (!owned) throw new NotFoundError('Không tìm thấy danh mục');
  const used = await prisma.expense.count({ where: { userId, categoryId: id } });
  if (used > 0) {
    if (!reassignToId) throw new BadRequestError('Danh mục đang có chi tiêu — hãy chọn danh mục để chuyển sang trước khi xoá');
    assertId(reassignToId, 'reassignToId');
    const target = await prisma.expenseCategory.findFirst({ where: { id: reassignToId, userId }, select: { id: true } });
    if (!target) throw new NotFoundError('Không tìm thấy danh mục đích');
    await prisma.$transaction([
      prisma.expense.updateMany({ where: { userId, categoryId: id }, data: { categoryId: reassignToId } }),
      prisma.expenseCategory.delete({ where: { id } }),
    ]);
  } else {
    await prisma.expenseCategory.delete({ where: { id } });
  }
  return { id };
}

// ─── Expenses CRUD (wallet-aware) ────────────────────────────

async function assertCategoryOwned(userId: number, categoryId: number) {
  const c = await prisma.expenseCategory.findFirst({ where: { id: categoryId, userId }, select: { id: true } });
  if (!c) throw new NotFoundError('Không tìm thấy danh mục');
}

export async function createExpense(
  userId: number,
  data: {
    categoryId: number;
    walletId: number;
    amount: number | string;
    date?: string;
    description?: string;
    receiptUrl?: string | null;
  },
) {
  assertId(data.categoryId, 'categoryId');
  assertId(data.walletId, 'walletId');
  const amount = round2(D(data.amount));
  if (!isPositive(amount)) throw new BadRequestError('Số tiền chi phải lớn hơn 0');
  await assertCategoryOwned(userId, data.categoryId);
  const date = data.date ? toDateOnly(data.date) : toDateOnly(new Date());

  return prisma.$transaction(async (tx) => {
    // debit the wallet (ownership verified inside applyWalletDelta)
    const wallet = await applyWalletDelta(tx, userId, data.walletId, amount.negated());
    return tx.expense.create({
      data: {
        userId,
        categoryId: data.categoryId,
        walletId: data.walletId,
        amount,
        currency: wallet.currency,
        date,
        description: data.description?.toString().slice(0, 500) || null,
        receiptUrl: data.receiptUrl?.toString().slice(0, 500) || null,
      },
    });
  });
}

export async function updateExpense(
  userId: number,
  id: number,
  data: {
    categoryId?: number;
    walletId?: number;
    amount?: number | string;
    date?: string;
    description?: string | null;
    receiptUrl?: string | null;
  },
) {
  assertId(id, 'expenseId');
  return prisma.$transaction(async (tx) => {
    const existing = await tx.expense.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Không tìm thấy khoản chi');

    const newWalletId = data.walletId ?? existing.walletId;
    const newAmount = data.amount !== undefined ? round2(D(data.amount)) : D(existing.amount);
    if (!isPositive(newAmount)) throw new BadRequestError('Số tiền chi phải lớn hơn 0');
    if (data.categoryId !== undefined) {
      assertId(data.categoryId, 'categoryId');
      await assertCategoryOwned(userId, data.categoryId);
    }
    if (data.walletId !== undefined) assertId(data.walletId, 'walletId');

    // Reverse the old debit, then apply the new one (handles wallet change).
    await applyWalletDelta(tx, userId, existing.walletId, D(existing.amount)); // credit back old
    const newWallet = await applyWalletDelta(tx, userId, newWalletId, newAmount.negated()); // debit new

    return tx.expense.update({
      where: { id },
      data: {
        categoryId: data.categoryId ?? existing.categoryId,
        walletId: newWalletId,
        amount: newAmount,
        currency: newWallet.currency,
        date: data.date ? toDateOnly(data.date) : existing.date,
        description: data.description !== undefined ? (data.description?.toString().slice(0, 500) || null) : existing.description,
        receiptUrl: data.receiptUrl !== undefined ? (data.receiptUrl?.toString().slice(0, 500) || null) : existing.receiptUrl,
      },
    });
  });
}

export async function deleteExpense(userId: number, id: number) {
  assertId(id, 'expenseId');
  return prisma.$transaction(async (tx) => {
    const existing = await tx.expense.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Không tìm thấy khoản chi');
    await applyWalletDelta(tx, userId, existing.walletId, D(existing.amount)); // credit back
    await tx.expense.delete({ where: { id } });
    return { id };
  });
}

// ─── Listing / filters / day grouping ────────────────────────

export interface ExpenseFilter {
  categoryId?: number;
  walletId?: number;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

function buildWhere(userId: number, f: ExpenseFilter): Prisma.ExpenseWhereInput {
  const where: Prisma.ExpenseWhereInput = { userId };
  if (f.categoryId) where.categoryId = Number(f.categoryId);
  if (f.walletId) where.walletId = Number(f.walletId);
  if (f.from || f.to) {
    where.date = {};
    if (f.from) where.date.gte = toDateOnly(f.from);
    if (f.to) where.date.lte = toDateOnly(f.to);
  }
  if (f.search?.trim()) where.description = { contains: f.search.trim(), mode: 'insensitive' };
  return where;
}

export async function listExpenses(userId: number, f: ExpenseFilter) {
  const where = buildWhere(userId, f);
  const { page, limit, skip } = pageParams(f.page, f.limit, 30);
  const [items, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
      skip,
      take: limit,
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    }),
    prisma.expense.count({ where }),
  ]);

  // group the page into day buckets with subtotals (sticky-header friendly)
  const groups: Record<string, { date: string; total: Prisma.Decimal; items: typeof items }> = {};
  for (const it of items) {
    const key = it.date.toISOString().slice(0, 10);
    if (!groups[key]) groups[key] = { date: key, total: new Prisma.Decimal(0), items: [] };
    groups[key].total = groups[key].total.plus(D(it.amount));
    groups[key].items.push(it);
  }
  const days = Object.values(groups).sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    items,
    days,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

// ─── Summaries (chart-ready) ─────────────────────────────────

export async function expenseSummary(
  userId: number,
  opts: { from?: string; to?: string; groupBy?: 'day' | 'month' | 'category' },
) {
  const groupBy = opts.groupBy || 'category';
  const where: Prisma.ExpenseWhereInput = { userId };
  if (opts.from || opts.to) {
    where.date = {};
    if (opts.from) where.date.gte = toDateOnly(opts.from);
    if (opts.to) where.date.lte = toDateOnly(opts.to);
  }

  if (groupBy === 'category') {
    const grouped = await prisma.expense.groupBy({
      by: ['categoryId'],
      where,
      _sum: { amount: true },
      _count: { _all: true },
    });
    const cats = await prisma.expenseCategory.findMany({ where: { userId }, select: { id: true, name: true, icon: true, color: true } });
    const catMap = new Map(cats.map((c) => [c.id, c]));
    const rows = grouped
      .map((g) => ({
        categoryId: g.categoryId,
        category: catMap.get(g.categoryId) || null,
        total: g._sum.amount ?? new Prisma.Decimal(0),
        count: g._count._all,
      }))
      .sort((a, b) => D(b.total).minus(D(a.total)).toNumber());
    return { groupBy, rows };
  }

  // day / month: bucket in JS (portable across SQLite/PG, avoids raw SQL)
  const items = await prisma.expense.findMany({ where, select: { amount: true, date: true }, orderBy: { date: 'asc' } });
  const buckets = new Map<string, Prisma.Decimal>();
  for (const it of items) {
    const key = groupBy === 'day' ? it.date.toISOString().slice(0, 10) : it.date.toISOString().slice(0, 7);
    buckets.set(key, (buckets.get(key) ?? new Prisma.Decimal(0)).plus(D(it.amount)));
  }
  const rows = [...buckets.entries()].map(([bucket, total]) => ({ bucket, total })).sort((a, b) => (a.bucket < b.bucket ? -1 : 1));
  return { groupBy, rows };
}

/** Month strip: total spent, vs last month, remaining budget (all categories). */
export async function monthExpenseOverview(userId: number, month?: string) {
  const { start, end } = monthWindow(month);
  const prevStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - 1, 1));

  const [thisMonth, lastMonth, categories] = await Promise.all([
    prisma.expense.aggregate({ where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } }),
    prisma.expense.aggregate({ where: { userId, date: { gte: prevStart, lt: start } }, _sum: { amount: true } }),
    prisma.expenseCategory.findMany({ where: { userId, monthlyBudget: { not: null } }, select: { id: true, name: true, icon: true, color: true, monthlyBudget: true } }),
  ]);
  const spent = D(thisMonth._sum.amount ?? 0);
  const prev = D(lastMonth._sum.amount ?? 0);

  const perCat = await prisma.expense.groupBy({
    by: ['categoryId'],
    where: { userId, date: { gte: start, lt: end }, categoryId: { in: categories.map((c) => c.id) } },
    _sum: { amount: true },
  });
  const spentByCat = new Map(perCat.map((g) => [g.categoryId, D(g._sum.amount ?? 0)]));

  const budgets = categories.map((c) => {
    const used = spentByCat.get(c.id) ?? new Prisma.Decimal(0);
    const budget = D(c.monthlyBudget);
    const ratio = budget.isZero() ? 0 : round2(used.dividedBy(budget).times(100)).toNumber();
    return {
      category: { id: c.id, name: c.name, icon: c.icon, color: c.color },
      budget,
      used,
      ratio,
      status: ratio > 100 ? 'over' : ratio >= 70 ? 'warn' : 'ok',
    };
  });

  return {
    spent,
    prevMonthSpent: prev,
    changePct: prev.isZero() ? null : round2(spent.minus(prev).dividedBy(prev).times(100)).toNumber(),
    budgets,
  };
}

// ─── CSV export (UTF-8 BOM so Excel reads Vietnamese) ────────

export async function exportExpensesCsv(userId: number, f: ExpenseFilter): Promise<string> {
  const where = buildWhere(userId, f);
  const items = await prisma.expense.findMany({
    where,
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
    include: { category: { select: { name: true } } },
  });
  const wallets = await prisma.wallet.findMany({ where: { userId }, select: { id: true, name: true } });
  const walletName = new Map(wallets.map((w) => [w.id, w.name]));

  const esc = (v: unknown) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = ['Ngày', 'Danh mục', 'Ví', 'Số tiền', 'Số tiền (₫)', 'Mô tả'];
  const lines = items.map((e) =>
    [
      e.date.toISOString().slice(0, 10),
      e.category?.name ?? '',
      walletName.get(e.walletId) ?? '',
      D(e.amount).toFixed(0),
      formatVnd(e.amount),
      e.description ?? '',
    ].map(esc).join(','),
  );
  return '﻿' + [header.join(','), ...lines].join('\n');
}
