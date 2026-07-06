/**
 * MoneyFlow — Dashboard aggregation (per-user).
 * ────────────────────────────────────────────────────────────
 * One call assembles everything the dashboard needs for a given month:
 * total wallet balance, income vs expense, upcoming debt payments (14d),
 * per-category budget status, and a spending-vs-income ratio. It also lazily
 * runs due recurring transactions and sweeps overdue debts so no cron is
 * required. All queries scoped by `userId`.
 */
import { prisma } from '../../config/database.js';
import { Prisma } from '@prisma/client';
import { D, round2, sum, clampZero } from './money.js';
import { monthWindow, todayUtc, addDaysUtc } from './helpers.js';
import { runDue } from './recurring.service.js';
import { sweepOverdue } from './debt.service.js';
import { getCurrentFxRate, toVnd } from './fx.service.js';

export async function getDashboard(userId: number, month?: string) {
  // lazy maintenance — safe & idempotent
  await runDue(userId).catch(() => undefined);
  await sweepOverdue(userId).catch(() => undefined);

  const { start, end, year, month: mNum } = monthWindow(month);
  const today = todayUtc();
  const in14 = addDaysUtc(today, 14);

  const [fxRow, wallets, incomeByCur, expenseByCur, budgetCats, debts, upcomingItems, cashflowRows, savingsAccounts, assetInvestments] =
    await Promise.all([
      getCurrentFxRate(userId),
      prisma.wallet.findMany({ where: { userId, isArchived: false }, orderBy: [{ order: 'asc' }] }),
      prisma.incomeEntry.groupBy({ by: ['currency'], where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } }),
      prisma.expense.groupBy({ by: ['currency'], where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } }),
      prisma.expenseCategory.findMany({ where: { userId, monthlyBudget: { not: null } }, select: { id: true, name: true, icon: true, color: true, monthlyBudget: true } }),
      prisma.debt.findMany({ where: { userId }, include: { schedule: true } }),
      prisma.debtScheduleItem.findMany({
        where: { userId, isPaid: false, dueDate: { lte: in14 } },
        include: { debt: { select: { id: true, lenderName: true, lenderType: true, currency: true } } },
        orderBy: { dueDate: 'asc' },
      }),
      prisma.expense.findMany({ where: { userId, date: { gte: start, lt: end } }, select: { amount: true, date: true, currency: true } }),
      prisma.savingsAccount.findMany({ where: { userId, status: { not: 'WITHDRAWN' } }, select: { amount: true, currency: true } }),
      prisma.investment.findMany({ where: { userId, type: 'ASSET', status: { not: 'SOLD' } }, select: { amount: true, currentValue: true, currency: true } }),
    ]);

  // Every aggregate below is expressed in VND: USD amounts convert through
  // the user's latest self-entered rate. Pure-VND users hit the identity
  // path (`toVnd` returns the value untouched), so nothing changes for them.
  const rate = fxRow ? D(fxRow.vndPerUsd) : null;
  let usdSeen = false;
  const conv = (amount: Prisma.Decimal.Value | null | undefined, currency: string | null | undefined) => {
    if (currency === 'USD') usdSeen = true;
    return toVnd(amount ?? 0, currency, rate);
  };

  const totalBalance = round2(sum(wallets.map((w) => conv(w.balance, w.currency))));
  const incomeThisMonth = round2(sum(incomeByCur.map((g) => conv(g._sum.amount, g.currency))));
  const expenseThisMonth = round2(sum(expenseByCur.map((g) => conv(g._sum.amount, g.currency))));

  // per-category budget status (budgets are VND; USD spend converts in)
  const perCat = await prisma.expense.groupBy({
    by: ['categoryId', 'currency'],
    where: { userId, date: { gte: start, lt: end }, categoryId: { in: budgetCats.map((c) => c.id) } },
    _sum: { amount: true },
  });
  const spentByCat = new Map<number, Prisma.Decimal>();
  for (const g of perCat) {
    const prev = spentByCat.get(g.categoryId) ?? new Prisma.Decimal(0);
    spentByCat.set(g.categoryId, prev.plus(conv(g._sum.amount, g.currency)));
  }
  const budgets = budgetCats.map((c) => {
    const used = spentByCat.get(c.id) ?? new Prisma.Decimal(0);
    const budget = D(c.monthlyBudget);
    const ratio = budget.isZero() ? 0 : round2(used.dividedBy(budget).times(100)).toNumber();
    return { category: { id: c.id, name: c.name, icon: c.icon, color: c.color }, budget, used, ratio, status: ratio > 100 ? 'over' : ratio >= 70 ? 'warn' : 'ok' };
  });

  // net worth = wallets + savings + asset investments − remaining debt
  const totalRemainingDebt = round2(sum(
    debts
      .filter((dbt) => dbt.status !== 'PAID_OFF')
      .map((dbt) => conv(clampZero(round2(D(dbt.principal).minus(sum(dbt.schedule.filter((s) => s.isPaid).map((s) => s.principalPart))))), dbt.currency)),
  ));
  const totalSavings = round2(sum(savingsAccounts.map((s) => conv(s.amount, s.currency))));
  const totalAssetValue = round2(sum(assetInvestments.map((i) => conv(i.currentValue ?? i.amount, i.currency))));
  const netWorth = round2(totalBalance.plus(totalSavings).plus(totalAssetValue).minus(totalRemainingDebt));

  // income vs expense per DAY for the month (chart-ready)
  const dayMap = new Map<string, { income: Prisma.Decimal; expense: Prisma.Decimal }>();
  const incomeRows = await prisma.incomeEntry.findMany({ where: { userId, date: { gte: start, lt: end } }, select: { amount: true, date: true, currency: true } });
  for (let d = new Date(start); d < end; d = addDaysUtc(d, 1)) {
    dayMap.set(d.toISOString().slice(0, 10), { income: new Prisma.Decimal(0), expense: new Prisma.Decimal(0) });
  }
  for (const r of incomeRows) { const k = r.date.toISOString().slice(0, 10); const e = dayMap.get(k); if (e) e.income = e.income.plus(conv(r.amount, r.currency)); }
  for (const r of cashflowRows) { const k = r.date.toISOString().slice(0, 10); const e = dayMap.get(k); if (e) e.expense = e.expense.plus(conv(r.amount, r.currency)); }
  const cashflow = [...dayMap.entries()].map(([date, v]) => ({ date, income: v.income, expense: v.expense }));

  // expense donut by category
  const donutAgg = await prisma.expense.groupBy({ by: ['categoryId', 'currency'], where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } });
  const allCats = await prisma.expenseCategory.findMany({ where: { userId }, select: { id: true, name: true, icon: true, color: true } });
  const catMap = new Map(allCats.map((c) => [c.id, c]));
  const donutByCat = new Map<number, Prisma.Decimal>();
  for (const g of donutAgg) {
    const prev = donutByCat.get(g.categoryId) ?? new Prisma.Decimal(0);
    donutByCat.set(g.categoryId, prev.plus(conv(g._sum.amount, g.currency)));
  }
  const expenseByCategory = [...donutByCat.entries()]
    .map(([categoryId, total]) => ({ category: catMap.get(categoryId) ?? null, total }))
    .sort((a, b) => b.total.minus(a.total).toNumber());

  const spendingVsIncomePct = incomeThisMonth.isZero() ? null : round2(expenseThisMonth.dividedBy(incomeThisMonth).times(100)).toNumber();

  return {
    month: `${year}-${String(mNum).padStart(2, '0')}`,
    fx: fxRow ? { rate: fxRow.vndPerUsd, updatedAt: fxRow.createdAt } : null,
    // true = user has USD amounts but never set a rate → they are NOT
    // included in the VND totals; the UI nudges toward the Tỷ giá page.
    hasUnconvertedUsd: usdSeen && !rate,
    totalBalance,
    netWorth,
    totalRemainingDebt,
    totalSavings,
    totalAssetValue,
    incomeThisMonth,
    expenseThisMonth,
    savingsThisMonth: round2(incomeThisMonth.minus(expenseThisMonth)),
    spendingVsIncomePct,
    wallets,
    budgets,
    cashflow,
    expenseByCategory,
    upcomingPayments: upcomingItems.map((i) => ({
      id: i.id,
      debtId: i.debtId,
      lenderName: i.debt.lenderName,
      lenderType: i.debt.lenderType,
      currency: i.debt.currency,
      dueDate: i.dueDate,
      amountDue: i.amountDue,
      isOverdue: i.dueDate.getTime() < today.getTime(),
    })),
  };
}
