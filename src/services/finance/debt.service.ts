/**
 * MoneyFlow — Debt service (per-user).
 * ────────────────────────────────────────────────────────────
 * Owns debts, their generated payment schedules, and payments. All interest
 * math is delegated to the pure `debtCalculator`. Ticking a schedule item paid
 * records a DebtPayment, deducts the chosen wallet, recomputes the remaining
 * balance, and auto-marks the debt PAID_OFF — all inside one `$transaction`.
 * Every query scoped by `userId`.
 */
import { prisma } from '../../config/database.js';
import { Prisma } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { D, round2, sum, isPositive, clampZero } from './money.js';
import { assertId, assertOneOf, toDateOnly, monthWindow, todayUtc } from './helpers.js';
import { applyWalletDelta } from './wallet.service.js';
import {
  computeDebt,
  type InterestType,
  type DebtCalcInput,
} from './debtCalculator.js';

export const LENDER_TYPES = ['LOAN_APP', 'BANK', 'PERSON', 'CREDIT_CARD', 'OTHER'] as const;
export const INTEREST_TYPES = ['FLAT_MONTHLY', 'REDUCING_BALANCE', 'DAILY_PERCENT', 'NO_INTEREST'] as const;

type DebtRow = Prisma.DebtGetPayload<{ include: { schedule: true; payments: true } }>;

function toCalcInput(d: {
  principal: Prisma.Decimal | number | string;
  interestType: string;
  interestRate: Prisma.Decimal | number | string;
  startDate: Date;
  termMonths: number | null;
  paymentDay: number | null;
}): DebtCalcInput {
  return {
    principal: d.principal,
    interestType: d.interestType as InterestType,
    interestRate: d.interestRate,
    startDate: d.startDate,
    termMonths: d.termMonths,
    paymentDay: d.paymentDay,
  };
}

// ─── Live preview (no persistence) ───────────────────────────

export function previewSchedule(input: {
  principal: number | string;
  interestType: string;
  interestRate: number | string;
  startDate?: string;
  termMonths?: number | null;
  paymentDay?: number | null;
}) {
  assertOneOf(input.interestType, INTEREST_TYPES, 'Loại lãi');
  const start = input.startDate ? toDateOnly(input.startDate) : todayUtc();
  const comp = computeDebt(toCalcInput({
    principal: input.principal,
    interestType: input.interestType,
    interestRate: input.interestRate,
    startDate: start,
    termMonths: input.termMonths ?? null,
    paymentDay: input.paymentDay ?? null,
  }));
  return comp;
}

// ─── CRUD ────────────────────────────────────────────────────

function validateDebtCore(data: Record<string, unknown>) {
  const lenderName = String(data.lenderName ?? '').trim();
  if (!lenderName) throw new BadRequestError('Tên bên cho vay không được để trống');
  const lenderType = assertOneOf(data.lenderType ?? 'OTHER', LENDER_TYPES, 'Loại bên cho vay');
  const interestType = assertOneOf(data.interestType ?? 'NO_INTEREST', INTEREST_TYPES, 'Loại lãi');
  const principal = round2(D(data.principal as never));
  if (!isPositive(principal)) throw new BadRequestError('Số tiền vay phải lớn hơn 0');
  const interestRate = D((data.interestRate as string | number | null | undefined) ?? 0);
  if (interestRate.isNegative()) throw new BadRequestError('Lãi suất không hợp lệ');
  const termMonths = data.termMonths != null ? Math.floor(Number(data.termMonths)) : null;
  if (interestType !== 'DAILY_PERCENT' && (!termMonths || termMonths <= 0)) {
    throw new BadRequestError('Kỳ hạn (số tháng) là bắt buộc với loại lãi này');
  }
  const paymentDay = data.paymentDay != null ? Math.min(31, Math.max(1, Math.floor(Number(data.paymentDay)))) : null;
  return { lenderName, lenderType, interestType, principal, interestRate, termMonths, paymentDay };
}

async function persistSchedule(tx: Prisma.TransactionClient, userId: number, debtId: number, comp: ReturnType<typeof computeDebt>) {
  if (comp.schedule.length === 0) return;
  await tx.debtScheduleItem.createMany({
    data: comp.schedule.map((s) => ({
      userId,
      debtId,
      installmentNo: s.installmentNo,
      dueDate: s.dueDate,
      amountDue: s.amountDue,
      principalPart: s.principalPart,
      interestPart: s.interestPart,
    })),
  });
}

export async function createDebt(userId: number, data: Record<string, unknown>) {
  const core = validateDebtCore(data);
  const startDate = data.startDate ? toDateOnly(data.startDate as string) : todayUtc();
  const comp = computeDebt(toCalcInput({ ...core, startDate }));

  return prisma.$transaction(async (tx) => {
    const debt = await tx.debt.create({
      data: {
        userId,
        lenderName: core.lenderName,
        lenderType: core.lenderType,
        principal: core.principal,
        interestType: core.interestType,
        interestRate: core.interestRate,
        startDate,
        termMonths: core.termMonths,
        paymentDay: core.paymentDay,
        status: 'ACTIVE',
        note: (data.note as string)?.toString().slice(0, 2000) || null,
        attachmentUrl: (data.attachmentUrl as string)?.toString().slice(0, 500) || null,
      },
    });
    await persistSchedule(tx, userId, debt.id, comp);
    return tx.debt.findUnique({ where: { id: debt.id }, include: { schedule: { orderBy: { installmentNo: 'asc' } }, payments: true } });
  });
}

/**
 * Update a debt. Term-affecting fields can only change while NO installment has
 * been paid (otherwise the schedule/paid history would be inconsistent — the
 * user should create a new debt). Non-term fields are always editable.
 */
export async function updateDebt(userId: number, id: number, data: Record<string, unknown>) {
  assertId(id, 'debtId');
  const existing = await prisma.debt.findFirst({ where: { id, userId }, include: { schedule: true, payments: true } });
  if (!existing) throw new NotFoundError('Không tìm thấy khoản nợ');

  const termFields = ['principal', 'interestType', 'interestRate', 'startDate', 'termMonths', 'paymentDay'];
  const changingTerms = termFields.some((f) => data[f] !== undefined);
  const hasPaid = existing.schedule.some((s) => s.isPaid) || existing.payments.length > 0;

  if (changingTerms && hasPaid) {
    throw new BadRequestError('Không thể đổi điều khoản khi đã có kỳ thanh toán — hãy tạo khoản nợ mới');
  }

  return prisma.$transaction(async (tx) => {
    const patch: Prisma.DebtUpdateInput = {};
    if (data.lenderName !== undefined) { const n = String(data.lenderName).trim(); if (!n) throw new BadRequestError('Tên bên cho vay không được để trống'); patch.lenderName = n; }
    if (data.lenderType !== undefined) patch.lenderType = assertOneOf(data.lenderType, LENDER_TYPES, 'Loại bên cho vay');
    if (data.status !== undefined) patch.status = assertOneOf(data.status, ['ACTIVE', 'PAID_OFF', 'OVERDUE'] as const, 'Trạng thái');
    if (data.note !== undefined) patch.note = (data.note as string)?.toString().slice(0, 2000) || null;
    if (data.attachmentUrl !== undefined) patch.attachmentUrl = (data.attachmentUrl as string)?.toString().slice(0, 500) || null;

    if (changingTerms) {
      const merged = {
        principal: data.principal ?? existing.principal,
        interestType: data.interestType ?? existing.interestType,
        interestRate: data.interestRate ?? existing.interestRate,
        termMonths: data.termMonths ?? existing.termMonths,
        paymentDay: data.paymentDay ?? existing.paymentDay,
        lenderName: existing.lenderName,
        lenderType: existing.lenderType,
      };
      const core = validateDebtCore(merged);
      const startDate = data.startDate ? toDateOnly(data.startDate as string) : existing.startDate;
      patch.principal = core.principal;
      patch.interestType = core.interestType;
      patch.interestRate = core.interestRate;
      patch.termMonths = core.termMonths;
      patch.paymentDay = core.paymentDay;
      patch.startDate = startDate;
      // regenerate schedule from scratch (safe: no paid items)
      await tx.debtScheduleItem.deleteMany({ where: { debtId: id, userId } });
      const comp = computeDebt(toCalcInput({ ...core, startDate }));
      await persistSchedule(tx, userId, id, comp);
    }

    await tx.debt.update({ where: { id }, data: patch });
    return tx.debt.findUnique({ where: { id }, include: { schedule: { orderBy: { installmentNo: 'asc' } }, payments: { orderBy: { date: 'desc' } } } });
  });
}

export async function deleteDebt(userId: number, id: number) {
  assertId(id, 'debtId');
  const res = await prisma.debt.deleteMany({ where: { id, userId } });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy khoản nợ');
  return { id }; // schedule + payments cascade via FK
}

// ─── Read (with computed remaining / interest wording) ───────

function decorate(debt: DebtRow) {
  const principal = D(debt.principal);
  const paidPrincipal = sum(debt.schedule.filter((s) => s.isPaid).map((s) => s.principalPart));
  const remaining = clampZero(round2(principal.minus(paidPrincipal)));
  const interestPaid = sum(debt.schedule.filter((s) => s.isPaid).map((s) => s.interestPart));
  const projectedInterest = sum(debt.schedule.map((s) => s.interestPart));
  const nextDue = debt.schedule
    .filter((s) => !s.isPaid)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0] ?? null;

  let interestPerDay: Prisma.Decimal | null = null;
  if (debt.interestType === 'DAILY_PERCENT') {
    interestPerDay = round2(remaining.times(D(debt.interestRate).dividedBy(100)));
  }

  return {
    ...debt,
    computed: {
      remaining,
      paidPrincipal,
      interestPaid,
      projectedInterest,
      progressPct: principal.isZero() ? 0 : round2(paidPrincipal.dividedBy(principal).times(100)).toNumber(),
      nextDueDate: nextDue?.dueDate ?? null,
      nextDueAmount: nextDue?.amountDue ?? null,
      interestPerDay,
    },
  };
}

export async function listDebts(userId: number, status?: string) {
  await sweepOverdue(userId);
  const where: Prisma.DebtWhereInput = { userId };
  if (status) where.status = String(status);
  const debts = await prisma.debt.findMany({
    where,
    include: { schedule: true, payments: true },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  });
  return debts.map(decorate);
}

export async function getDebt(userId: number, id: number) {
  assertId(id, 'debtId');
  await sweepOverdue(userId, id);
  const debt = await prisma.debt.findFirst({
    where: { id, userId },
    include: { schedule: { orderBy: { installmentNo: 'asc' } }, payments: { orderBy: { date: 'desc' } } },
  });
  if (!debt) throw new NotFoundError('Không tìm thấy khoản nợ');
  return decorate(debt);
}

// ─── Tick-to-pay ─────────────────────────────────────────────

export async function payScheduleItem(
  userId: number,
  debtId: number,
  itemId: number,
  input: { walletId?: number | null; actualAmount?: number | string; date?: string; note?: string },
) {
  assertId(debtId, 'debtId');
  assertId(itemId, 'scheduleItemId');

  return prisma.$transaction(async (tx) => {
    const debt = await tx.debt.findFirst({ where: { id: debtId, userId }, include: { schedule: true } });
    if (!debt) throw new NotFoundError('Không tìm thấy khoản nợ');
    const item = debt.schedule.find((s) => s.id === itemId);
    if (!item) throw new NotFoundError('Không tìm thấy kỳ thanh toán');
    if (item.isPaid) throw new BadRequestError('Kỳ này đã được thanh toán');

    const amount = input.actualAmount !== undefined ? round2(D(input.actualAmount)) : D(item.amountDue);
    if (!isPositive(amount)) throw new BadRequestError('Số tiền thanh toán phải lớn hơn 0');
    const date = input.date ? toDateOnly(input.date) : todayUtc();

    // optional wallet deduction (verifies ownership inside applyWalletDelta)
    let walletId: number | null = null;
    if (input.walletId) {
      assertId(input.walletId, 'walletId');
      await applyWalletDelta(tx, userId, input.walletId, amount.negated());
      walletId = input.walletId;
    }

    const payment = await tx.debtPayment.create({
      data: { userId, debtId, walletId, amount, date, note: input.note?.toString().slice(0, 1000) || null },
    });
    await tx.debtScheduleItem.update({
      where: { id: itemId },
      data: { isPaid: true, paidAt: new Date(), paymentId: payment.id },
    });

    // recompute: PAID_OFF when every installment is settled
    const remainingUnpaid = debt.schedule.filter((s) => s.id !== itemId && !s.isPaid).length;
    const newStatus = remainingUnpaid === 0 ? 'PAID_OFF' : (debt.status === 'OVERDUE' ? 'ACTIVE' : debt.status);
    await tx.debt.update({ where: { id: debtId }, data: { status: newStatus } });

    return tx.debt.findUnique({
      where: { id: debtId },
      include: { schedule: { orderBy: { installmentNo: 'asc' } }, payments: { orderBy: { date: 'desc' } } },
    }).then((d) => decorate(d as DebtRow));
  });
}

/** Un-tick a schedule item (revert an accidental payment). */
export async function unpayScheduleItem(userId: number, debtId: number, itemId: number) {
  assertId(debtId, 'debtId');
  assertId(itemId, 'scheduleItemId');
  return prisma.$transaction(async (tx) => {
    const item = await tx.debtScheduleItem.findFirst({ where: { id: itemId, debtId, userId } });
    if (!item) throw new NotFoundError('Không tìm thấy kỳ thanh toán');
    if (!item.isPaid) throw new BadRequestError('Kỳ này chưa thanh toán');
    if (item.paymentId) {
      const payment = await tx.debtPayment.findFirst({ where: { id: item.paymentId, userId } });
      if (payment?.walletId) await applyWalletDelta(tx, userId, payment.walletId, D(payment.amount)); // refund wallet
      if (payment) await tx.debtPayment.delete({ where: { id: payment.id } });
    }
    await tx.debtScheduleItem.update({ where: { id: itemId }, data: { isPaid: false, paidAt: null, paymentId: null } });
    await tx.debt.update({ where: { id: debtId }, data: { status: 'ACTIVE' } });
    return tx.debt.findUnique({ where: { id: debtId }, include: { schedule: { orderBy: { installmentNo: 'asc' } }, payments: { orderBy: { date: 'desc' } } } }).then((d) => decorate(d as DebtRow));
  });
}

// ─── Overdue sweep ───────────────────────────────────────────

/** Flip debts with past-due unpaid installments to OVERDUE (idempotent). */
export async function sweepOverdue(userId: number, debtId?: number) {
  const today = todayUtc();
  const overdueDebtIds = await prisma.debtScheduleItem.findMany({
    where: { userId, isPaid: false, dueDate: { lt: today }, ...(debtId ? { debtId } : {}) },
    select: { debtId: true },
    distinct: ['debtId'],
  });
  const ids = overdueDebtIds.map((r) => r.debtId);
  if (ids.length) {
    await prisma.debt.updateMany({ where: { userId, id: { in: ids }, status: 'ACTIVE' }, data: { status: 'OVERDUE' } });
  }
}

// ─── Summary & calendar ──────────────────────────────────────

export async function debtSummary(userId: number, month?: string) {
  await sweepOverdue(userId);
  const { start, end } = monthWindow(month);
  const debts = await prisma.debt.findMany({ where: { userId }, include: { schedule: true, payments: true } });
  const active = debts.filter((d) => d.status !== 'PAID_OFF');

  const decorated = debts.map(decorate);
  const totalRemaining = sum(decorated.filter((d) => d.status !== 'PAID_OFF').map((d) => d.computed.remaining));
  const totalInterestPaid = sum(decorated.map((d) => d.computed.interestPaid));
  const projectedTotalInterest = sum(decorated.map((d) => d.computed.projectedInterest));

  const dueThisMonthItems = await prisma.debtScheduleItem.findMany({
    where: { userId, isPaid: false, dueDate: { gte: start, lt: end } },
    include: { debt: { select: { id: true, lenderName: true, lenderType: true } } },
    orderBy: { dueDate: 'asc' },
  });
  const dueThisMonth = sum(dueThisMonthItems.map((i) => i.amountDue));

  return {
    totalRemaining,
    dueThisMonth,
    dueThisMonthItems,
    activeLenders: active.length,
    totalInterestPaid,
    projectedTotalInterest,
    perLender: decorated.map((d) => ({
      id: d.id,
      lenderName: d.lenderName,
      lenderType: d.lenderType,
      interestType: d.interestType,
      status: d.status,
      remaining: d.computed.remaining,
      nextDueDate: d.computed.nextDueDate,
      nextDueAmount: d.computed.nextDueAmount,
    })),
  };
}

export async function debtCalendar(userId: number, month?: string) {
  const { start, end } = monthWindow(month);
  const items = await prisma.debtScheduleItem.findMany({
    where: { userId, dueDate: { gte: start, lt: end } },
    include: { debt: { select: { id: true, lenderName: true, lenderType: true } } },
    orderBy: { dueDate: 'asc' },
  });
  const byDay: Record<string, { date: string; total: Prisma.Decimal; items: typeof items }> = {};
  for (const it of items) {
    const key = it.dueDate.toISOString().slice(0, 10);
    if (!byDay[key]) byDay[key] = { date: key, total: new Prisma.Decimal(0), items: [] };
    byDay[key].total = byDay[key].total.plus(D(it.amountDue));
    byDay[key].items.push(it);
  }
  return { month: monthWindow(month).month, year: monthWindow(month).year, days: Object.values(byDay) };
}
