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

export async function getDashboard(userId: number, month?: string) {
  // lazy maintenance — safe & idempotent
  await runDue(userId).catch(() => undefined);
  await sweepOverdue(userId).catch(() => undefined);

  const { start, end, year, month: mNum } = monthWindow(month);
  const today = todayUtc();
  const in14 = addDaysUtc(today, 14);

  const [wallets, incomeAgg, expenseAgg, budgetCats, debts, upcomingItems, cashflowRows, savingsAccounts, assetInvestments] =
    await Promise.all([
      prisma.wallet.findMany({ where: { userId, isArchived: false }, orderBy: [{ order: 'asc' }] }),
      prisma.incomeEntry.aggregate({ where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } }),
      prisma.expenseCategory.findMany({ where: { userId, monthlyBudget: { not: null } }, select: { id: true, name: true, icon: true, color: true, monthlyBudget: true } }),
      prisma.debt.findMany({ where: { userId }, include: { schedule: true } }),
      prisma.debtScheduleItem.findMany({
        where: { userId, isPaid: false, dueDate: { lte: in14 } },
        include: { debt: { select: { id: true, lenderName: true, lenderType: true } } },
        orderBy: { dueDate: 'asc' },
      }),
      prisma.expense.findMany({ where: { userId, date: { gte: start, lt: end } }, select: { amount: true, date: true } }),
      prisma.savingsAccount.findMany({ where: { userId, status: { not: 'WITHDRAWN' } }, select: { amount: true } }),
      prisma.investment.findMany({ where: { userId, type: 'ASSET', status: { not: 'SOLD' } }, select: { amount: true, currentValue: true } }),
    ]);

  const totalBalance = sum(wallets.map((w) => w.balance));
  const incomeThisMonth = D(incomeAgg._sum.amount ?? 0);
  const expenseThisMonth = D(expenseAgg._sum.amount ?? 0);

  // per-category budget status
  const perCat = await prisma.expense.groupBy({
    by: ['categoryId'],
    where: { userId, date: { gte: start, lt: end }, categoryId: { in: budgetCats.map((c) => c.id) } },
    _sum: { amount: true },
  });
  const spentByCat = new Map(perCat.map((g) => [g.categoryId, D(g._sum.amount ?? 0)]));
  const budgets = budgetCats.map((c) => {
    const used = spentByCat.get(c.id) ?? new Prisma.Decimal(0);
    const budget = D(c.monthlyBudget);
    const ratio = budget.isZero() ? 0 : round2(used.dividedBy(budget).times(100)).toNumber();
    return { category: { id: c.id, name: c.name, icon: c.icon, color: c.color }, budget, used, ratio, status: ratio > 100 ? 'over' : ratio >= 70 ? 'warn' : 'ok' };
  });

  // net worth = wallets + savings + asset investments − remaining debt
  const totalRemainingDebt = sum(
    debts
      .filter((dbt) => dbt.status !== 'PAID_OFF')
      .map((dbt) => clampZero(round2(D(dbt.principal).minus(sum(dbt.schedule.filter((s) => s.isPaid).map((s) => s.principalPart)))))),
  );
  const totalSavings = sum(savingsAccounts.map((s) => s.amount));
  const totalAssetValue = sum(assetInvestments.map((i) => i.currentValue ?? i.amount));
  const netWorth = round2(totalBalance.plus(totalSavings).plus(totalAssetValue).minus(totalRemainingDebt));

  // income vs expense per DAY for the month (chart-ready)
  const dayMap = new Map<string, { income: Prisma.Decimal; expense: Prisma.Decimal }>();
  const incomeRows = await prisma.incomeEntry.findMany({ where: { userId, date: { gte: start, lt: end } }, select: { amount: true, date: true } });
  for (let d = new Date(start); d < end; d = addDaysUtc(d, 1)) {
    dayMap.set(d.toISOString().slice(0, 10), { income: new Prisma.Decimal(0), expense: new Prisma.Decimal(0) });
  }
  for (const r of incomeRows) { const k = r.date.toISOString().slice(0, 10); const e = dayMap.get(k); if (e) e.income = e.income.plus(D(r.amount)); }
  for (const r of cashflowRows) { const k = r.date.toISOString().slice(0, 10); const e = dayMap.get(k); if (e) e.expense = e.expense.plus(D(r.amount)); }
  const cashflow = [...dayMap.entries()].map(([date, v]) => ({ date, income: v.income, expense: v.expense }));

  // expense donut by category
  const donutAgg = await prisma.expense.groupBy({ by: ['categoryId'], where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } });
  const allCats = await prisma.expenseCategory.findMany({ where: { userId }, select: { id: true, name: true, icon: true, color: true } });
  const catMap = new Map(allCats.map((c) => [c.id, c]));
  const expenseByCategory = donutAgg
    .map((g) => ({ category: catMap.get(g.categoryId) ?? null, total: D(g._sum.amount ?? 0) }))
    .sort((a, b) => b.total.minus(a.total).toNumber());

  const spendingVsIncomePct = incomeThisMonth.isZero() ? null : round2(expenseThisMonth.dividedBy(incomeThisMonth).times(100)).toNumber();

  return {
    month: `${year}-${String(mNum).padStart(2, '0')}`,
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
      dueDate: i.dueDate,
      amountDue: i.amountDue,
      isOverdue: i.dueDate.getTime() < today.getTime(),
    })),
  };
}
