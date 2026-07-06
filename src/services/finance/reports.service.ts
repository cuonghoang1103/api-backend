/**
 * MoneyFlow — Reports (per-user). Monthly and yearly report payloads plus a CSV
 * export. Pure aggregation over the finance tables; scoped by userId.
 */
import { prisma } from '../../config/database.js';
import { Prisma } from '@prisma/client';
import { D, round2, sum, formatVnd } from './money.js';
import { monthWindow, yearWindow } from './helpers.js';
import { getCurrentFxRate, toVnd } from './fx.service.js';

export async function monthlyReport(userId: number, month?: string) {
  const { start, end, year, month: mNum } = monthWindow(month);
  const prevStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - 1, 1));

  const [fxRow, incByCur, expByCur, prevIncByCur, prevExpByCur, catGroup, topExpenses, paidItems, cats] = await Promise.all([
    getCurrentFxRate(userId),
    prisma.incomeEntry.groupBy({ by: ['currency'], where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } }),
    prisma.expense.groupBy({ by: ['currency'], where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } }),
    prisma.incomeEntry.groupBy({ by: ['currency'], where: { userId, date: { gte: prevStart, lt: start } }, _sum: { amount: true } }),
    prisma.expense.groupBy({ by: ['currency'], where: { userId, date: { gte: prevStart, lt: start } }, _sum: { amount: true } }),
    prisma.expense.groupBy({ by: ['categoryId', 'currency'], where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } }),
    prisma.expense.findMany({ where: { userId, date: { gte: start, lt: end } }, orderBy: { amount: 'desc' }, take: 10, include: { category: { select: { name: true, icon: true } } } }),
    prisma.debtScheduleItem.findMany({ where: { userId, isPaid: true, paidAt: { gte: start, lt: end } }, select: { principalPart: true, interestPart: true, debt: { select: { currency: true } } } }),
    prisma.expenseCategory.findMany({ where: { userId }, select: { id: true, name: true, icon: true, color: true } }),
  ]);

  // All report figures are VND; USD converts through the user's rate.
  const rate = fxRow ? D(fxRow.vndPerUsd) : null;
  const conv = (amount: Prisma.Decimal.Value | null | undefined, currency: string | null | undefined) => toVnd(amount ?? 0, currency, rate);
  const sumGroups = (groups: { currency: string; _sum: { amount: Prisma.Decimal | null } }[]) =>
    round2(sum(groups.map((g) => conv(g._sum.amount, g.currency))));

  const income = sumGroups(incByCur);
  const expense = sumGroups(expByCur);
  const catMap = new Map(cats.map((c) => [c.id, c]));
  const byCat = new Map<number, Prisma.Decimal>();
  for (const g of catGroup) {
    const prev = byCat.get(g.categoryId) ?? new Prisma.Decimal(0);
    byCat.set(g.categoryId, prev.plus(conv(g._sum.amount, g.currency)));
  }
  const categoryBreakdown = [...byCat.entries()]
    .map(([categoryId, total]) => ({ category: catMap.get(categoryId) ?? null, total }))
    .sort((a, b) => b.total.minus(a.total).toNumber());
  const debtPrincipalPaid = round2(sum(paidItems.map((i) => conv(i.principalPart, i.debt.currency))));
  const debtInterestPaid = round2(sum(paidItems.map((i) => conv(i.interestPart, i.debt.currency))));

  return {
    month: `${year}-${String(mNum).padStart(2, '0')}`,
    income, expense,
    net: round2(income.minus(expense)),
    savingsRate: income.isZero() ? null : round2(income.minus(expense).dividedBy(income).times(100)).toNumber(),
    vsPrev: {
      income: sumGroups(prevIncByCur),
      expense: sumGroups(prevExpByCur),
    },
    categoryBreakdown,
    topExpenses: topExpenses.map((e) => ({ id: e.id, amount: e.amount, currency: e.currency, date: e.date, description: e.description, category: e.category })),
    debtPaid: { principal: debtPrincipalPaid, interest: debtInterestPaid, total: round2(debtPrincipalPaid.plus(debtInterestPaid)) },
  };
}

export async function yearlyReport(userId: number, year?: string) {
  const { start, end, year: y } = yearWindow(year);
  const [fxRow, incomes, expenses, paidItems, selfInv] = await Promise.all([
    getCurrentFxRate(userId),
    prisma.incomeEntry.findMany({ where: { userId, date: { gte: start, lt: end } }, select: { amount: true, date: true, currency: true } }),
    prisma.expense.findMany({ where: { userId, date: { gte: start, lt: end } }, select: { amount: true, date: true, currency: true } }),
    prisma.debtScheduleItem.findMany({ where: { userId, isPaid: true, paidAt: { gte: start, lt: end } }, select: { interestPart: true, debt: { select: { currency: true } } } }),
    prisma.investment.findMany({ where: { userId, type: 'SELF', date: { gte: start, lt: end } }, select: { amount: true, currency: true } }),
  ]);

  const rate = fxRow ? D(fxRow.vndPerUsd) : null;
  const conv = (amount: Prisma.Decimal.Value | null | undefined, currency: string | null | undefined) => toVnd(amount ?? 0, currency, rate);

  const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, income: new Prisma.Decimal(0), expense: new Prisma.Decimal(0), net: new Prisma.Decimal(0), cumulative: new Prisma.Decimal(0) }));
  for (const r of incomes) months[r.date.getUTCMonth()].income = months[r.date.getUTCMonth()].income.plus(conv(r.amount, r.currency));
  for (const r of expenses) months[r.date.getUTCMonth()].expense = months[r.date.getUTCMonth()].expense.plus(conv(r.amount, r.currency));
  let running = new Prisma.Decimal(0);
  for (const m of months) { m.net = round2(m.income.minus(m.expense)); running = round2(running.plus(m.net)); m.cumulative = running; }

  return {
    year: y,
    months,
    totalIncome: round2(sum(incomes.map((r) => conv(r.amount, r.currency)))),
    totalExpense: round2(sum(expenses.map((r) => conv(r.amount, r.currency)))),
    totalInterestPaid: round2(sum(paidItems.map((i) => conv(i.interestPart, i.debt.currency)))),
    selfInvested: round2(sum(selfInv.map((i) => conv(i.amount, i.currency)))),
  };
}

export async function monthlyReportCsv(userId: number, month?: string): Promise<string> {
  const r = await monthlyReport(userId, month);
  const esc = (v: unknown) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const lines: string[] = [];
  lines.push(`Báo cáo tháng,${r.month}`);
  lines.push(`Thu nhập,${formatVnd(r.income)}`);
  lines.push(`Chi tiêu,${formatVnd(r.expense)}`);
  lines.push(`Chênh lệch,${formatVnd(r.net)}`);
  lines.push(`Tỷ lệ tiết kiệm,${r.savingsRate ?? 0}%`);
  lines.push('');
  lines.push('Danh mục,Số tiền');
  for (const c of r.categoryBreakdown) lines.push(`${esc(c.category?.name ?? 'Khác')},${formatVnd(c.total)}`);
  lines.push('');
  lines.push('Top chi tiêu,Ngày,Số tiền');
  for (const e of r.topExpenses) lines.push(`${esc(e.description ?? e.category?.name ?? '')},${e.date.toISOString().slice(0, 10)},${formatVnd(e.amount)}`);
  return '﻿' + lines.join('\n');
}
