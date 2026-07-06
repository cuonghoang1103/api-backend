/**
 * MoneyFlow — Income service (per-user).
 * ────────────────────────────────────────────────────────────
 * Income sources (salary/freelance), hourly work logs with OT math, and
 * actual income entries that CREDIT a wallet. "Expected vs actual" compares
 * computed expected pay (base salary + work-log OT) against real entries.
 * Every query scoped by `userId`; entries adjust wallets inside `$transaction`.
 */
import { prisma } from '../../config/database.js';
import { Prisma } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { D, round2, sum, isPositive } from './money.js';
import { assertId, assertOneOf, toDateOnly, monthWindow, yearWindow } from './helpers.js';
import { applyWalletDelta } from './wallet.service.js';

export const SOURCE_TYPES = ['SALARY', 'FREELANCE', 'PART_TIME', 'OTHER'] as const;
export const PAY_TYPES = ['MONTHLY', 'HOURLY', 'PER_JOB'] as const;
export const INCOME_TYPES = ['SALARY', 'BONUS', 'OT_PAYOUT', 'FREELANCE', 'OTHER'] as const;

// ─── Income sources ──────────────────────────────────────────

export async function listSources(userId: number) {
  return prisma.incomeSource.findMany({ where: { userId }, orderBy: [{ isActive: 'desc' }, { id: 'asc' }] });
}

export async function createSource(
  userId: number,
  data: {
    name?: string; type?: string; payType?: string;
    baseSalary?: number | string | null; hourlyRate?: number | string | null;
    otMultiplierNormal?: number | string; otMultiplierHoliday?: number | string;
    note?: string | null;
  },
) {
  const name = String(data.name ?? '').trim();
  if (!name) throw new BadRequestError('Tên nguồn thu không được để trống');
  const type = assertOneOf(data.type ?? 'SALARY', SOURCE_TYPES, 'Loại nguồn thu');
  const payType = assertOneOf(data.payType ?? 'MONTHLY', PAY_TYPES, 'Hình thức trả');
  return prisma.incomeSource.create({
    data: {
      userId, name, type, payType,
      baseSalary: data.baseSalary != null ? round2(D(data.baseSalary)) : null,
      hourlyRate: data.hourlyRate != null ? round2(D(data.hourlyRate)) : null,
      otMultiplierNormal: data.otMultiplierNormal != null ? D(data.otMultiplierNormal) : new Prisma.Decimal(1.5),
      otMultiplierHoliday: data.otMultiplierHoliday != null ? D(data.otMultiplierHoliday) : new Prisma.Decimal(2.0),
      note: data.note?.toString().slice(0, 1000) || null,
    },
  });
}

export async function updateSource(userId: number, id: number, data: Record<string, unknown>) {
  assertId(id, 'sourceId');
  const patch: Prisma.IncomeSourceUpdateInput = {};
  if (data.name !== undefined) { const n = String(data.name).trim(); if (!n) throw new BadRequestError('Tên không được để trống'); patch.name = n; }
  if (data.type !== undefined) patch.type = assertOneOf(data.type, SOURCE_TYPES, 'Loại nguồn thu');
  if (data.payType !== undefined) patch.payType = assertOneOf(data.payType, PAY_TYPES, 'Hình thức trả');
  if (data.baseSalary !== undefined) patch.baseSalary = data.baseSalary === null ? null : round2(D(data.baseSalary as never));
  if (data.hourlyRate !== undefined) patch.hourlyRate = data.hourlyRate === null ? null : round2(D(data.hourlyRate as never));
  if (data.otMultiplierNormal !== undefined) patch.otMultiplierNormal = D(data.otMultiplierNormal as never);
  if (data.otMultiplierHoliday !== undefined) patch.otMultiplierHoliday = D(data.otMultiplierHoliday as never);
  if (data.isActive !== undefined) patch.isActive = Boolean(data.isActive);
  if (data.note !== undefined) patch.note = (data.note as string)?.toString().slice(0, 1000) || null;

  const res = await prisma.incomeSource.updateMany({ where: { id, userId }, data: patch });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy nguồn thu');
  return prisma.incomeSource.findUnique({ where: { id } });
}

export async function deleteSource(userId: number, id: number) {
  assertId(id, 'sourceId');
  const owned = await prisma.incomeSource.findFirst({ where: { id, userId }, select: { id: true } });
  if (!owned) throw new NotFoundError('Không tìm thấy nguồn thu');
  // work logs cascade (FK); income entries keep history with sourceId set null (FK SetNull)
  await prisma.incomeSource.delete({ where: { id } });
  return { id };
}

// ─── Work logs (hourly + OT) ─────────────────────────────────

async function assertSourceOwned(userId: number, sourceId: number) {
  const s = await prisma.incomeSource.findFirst({ where: { id: sourceId, userId }, select: { id: true } });
  if (!s) throw new NotFoundError('Không tìm thấy nguồn thu');
}

/** Upsert a day's hours for a source (unique per user+source+date). */
export async function upsertWorkLog(
  userId: number,
  data: { sourceId: number; date: string; hoursNormal?: number | string; hoursOT?: number | string; hoursOTHoliday?: number | string; note?: string | null },
) {
  assertId(data.sourceId, 'sourceId');
  await assertSourceOwned(userId, data.sourceId);
  const date = toDateOnly(data.date);
  const payload = {
    hoursNormal: D(data.hoursNormal ?? 0),
    hoursOT: D(data.hoursOT ?? 0),
    hoursOTHoliday: D(data.hoursOTHoliday ?? 0),
    note: data.note?.toString().slice(0, 500) || null,
  };
  return prisma.workLog.upsert({
    where: { uk_fin_worklog_user_source_date: { userId, sourceId: data.sourceId, date } },
    create: { userId, sourceId: data.sourceId, date, ...payload },
    update: payload,
  });
}

export async function deleteWorkLog(userId: number, id: number) {
  assertId(id, 'workLogId');
  const res = await prisma.workLog.deleteMany({ where: { id, userId } });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy bản ghi công');
  return { id };
}

export async function listWorkLogs(userId: number, sourceId: number, month?: string) {
  assertId(sourceId, 'sourceId');
  await assertSourceOwned(userId, sourceId);
  const { start, end } = monthWindow(month);
  const logs = await prisma.workLog.findMany({
    where: { userId, sourceId, date: { gte: start, lt: end } },
    orderBy: { date: 'asc' },
  });
  const source = await prisma.incomeSource.findUnique({ where: { id: sourceId } });
  const totals = workLogTotals(logs, source);
  return { logs, totals };
}

function workLogTotals(
  logs: Array<{ hoursNormal: Prisma.Decimal; hoursOT: Prisma.Decimal; hoursOTHoliday: Prisma.Decimal }>,
  source: { hourlyRate: Prisma.Decimal | null; otMultiplierNormal: Prisma.Decimal; otMultiplierHoliday: Prisma.Decimal } | null,
) {
  const hoursNormal = sum(logs.map((l) => l.hoursNormal));
  const hoursOT = sum(logs.map((l) => l.hoursOT));
  const hoursOTHoliday = sum(logs.map((l) => l.hoursOTHoliday));
  const rate = D(source?.hourlyRate ?? 0);
  const mOt = D(source?.otMultiplierNormal ?? 1.5);
  const mHol = D(source?.otMultiplierHoliday ?? 2.0);
  // expected pay = normal×rate + OT×rate×mult + holidayOT×rate×holidayMult
  const expectedPay = round2(
    hoursNormal.times(rate)
      .plus(hoursOT.times(rate).times(mOt))
      .plus(hoursOTHoliday.times(rate).times(mHol)),
  );
  return { hoursNormal, hoursOT, hoursOTHoliday, expectedPay };
}

// ─── Income entries (credit a wallet) ────────────────────────

export async function listIncomeEntries(
  userId: number,
  f: { month?: string; sourceId?: number; type?: string },
) {
  const where: Prisma.IncomeEntryWhereInput = { userId };
  if (f.month) { const { start, end } = monthWindow(f.month); where.date = { gte: start, lt: end }; }
  if (f.sourceId) where.sourceId = Number(f.sourceId);
  if (f.type) where.type = String(f.type);
  return prisma.incomeEntry.findMany({ where, orderBy: [{ date: 'desc' }, { id: 'desc' }] });
}

export async function createIncomeEntry(
  userId: number,
  data: { sourceId?: number | null; walletId: number; amount: number | string; date?: string; type?: string; note?: string },
) {
  assertId(data.walletId, 'walletId');
  const amount = round2(D(data.amount));
  if (!isPositive(amount)) throw new BadRequestError('Số tiền thu phải lớn hơn 0');
  const type = assertOneOf(data.type ?? 'SALARY', INCOME_TYPES, 'Loại thu nhập');
  if (data.sourceId) await assertSourceOwned(userId, data.sourceId);
  const date = data.date ? toDateOnly(data.date) : toDateOnly(new Date());

  return prisma.$transaction(async (tx) => {
    const wallet = await applyWalletDelta(tx, userId, data.walletId, amount); // credit
    return tx.incomeEntry.create({
      // entry currency always follows the wallet it lands in
      data: { userId, sourceId: data.sourceId ?? null, walletId: data.walletId, amount, currency: wallet.currency, date, type, note: data.note?.toString().slice(0, 1000) || null },
    });
  });
}

export async function updateIncomeEntry(
  userId: number,
  id: number,
  data: { sourceId?: number | null; walletId?: number; amount?: number | string; date?: string; type?: string; note?: string | null },
) {
  assertId(id, 'incomeEntryId');
  return prisma.$transaction(async (tx) => {
    const existing = await tx.incomeEntry.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Không tìm thấy khoản thu');
    const newWalletId = data.walletId ?? existing.walletId;
    const newAmount = data.amount !== undefined ? round2(D(data.amount)) : D(existing.amount);
    if (!isPositive(newAmount)) throw new BadRequestError('Số tiền thu phải lớn hơn 0');
    if (data.walletId !== undefined) assertId(data.walletId, 'walletId');
    if (data.sourceId) await assertSourceOwned(userId, data.sourceId);

    // reverse old credit, apply new credit
    await applyWalletDelta(tx, userId, existing.walletId, D(existing.amount).negated());
    const newWallet = await applyWalletDelta(tx, userId, newWalletId, newAmount);

    return tx.incomeEntry.update({
      where: { id },
      data: {
        sourceId: data.sourceId !== undefined ? data.sourceId : existing.sourceId,
        walletId: newWalletId,
        amount: newAmount,
        currency: newWallet.currency,
        date: data.date ? toDateOnly(data.date) : existing.date,
        type: data.type ? assertOneOf(data.type, INCOME_TYPES, 'Loại thu nhập') : existing.type,
        note: data.note !== undefined ? (data.note?.toString().slice(0, 1000) || null) : existing.note,
      },
    });
  });
}

export async function deleteIncomeEntry(userId: number, id: number) {
  assertId(id, 'incomeEntryId');
  return prisma.$transaction(async (tx) => {
    const existing = await tx.incomeEntry.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Không tìm thấy khoản thu');
    await applyWalletDelta(tx, userId, existing.walletId, D(existing.amount).negated()); // remove credit
    await tx.incomeEntry.delete({ where: { id } });
    return { id };
  });
}

// ─── Expected vs actual, year view ───────────────────────────

export async function expectedVsActual(userId: number, month?: string) {
  const { start, end } = monthWindow(month);
  const sources = await prisma.incomeSource.findMany({ where: { userId, isActive: true } });
  const logs = await prisma.workLog.findMany({ where: { userId, date: { gte: start, lt: end } } });
  const logsBySource = new Map<number, typeof logs>();
  for (const l of logs) {
    const arr = logsBySource.get(l.sourceId) ?? [];
    arr.push(l);
    logsBySource.set(l.sourceId, arr);
  }

  const perSource = sources.map((s) => {
    let expected: Prisma.Decimal;
    if (s.payType === 'MONTHLY') {
      expected = round2(D(s.baseSalary ?? 0));
    } else if (s.payType === 'HOURLY') {
      expected = workLogTotals(logsBySource.get(s.id) ?? [], s).expectedPay;
    } else {
      expected = new Prisma.Decimal(0); // PER_JOB: no formula, actuals only
    }
    return { source: { id: s.id, name: s.name, type: s.type, payType: s.payType }, expected };
  });

  const actualAgg = await prisma.incomeEntry.groupBy({
    by: ['sourceId'],
    where: { userId, date: { gte: start, lt: end } },
    _sum: { amount: true },
  });
  const actualBySource = new Map(actualAgg.map((a) => [a.sourceId, D(a._sum.amount ?? 0)]));

  const rows = perSource.map((p) => {
    const actual = actualBySource.get(p.source.id) ?? new Prisma.Decimal(0);
    return { ...p, actual, difference: round2(actual.minus(p.expected)) };
  });
  const totalExpected = sum(rows.map((r) => r.expected));
  const totalActual = sum(await prisma.incomeEntry.findMany({ where: { userId, date: { gte: start, lt: end } }, select: { amount: true } }).then((es) => es.map((e) => e.amount)));

  return { rows, totalExpected, totalActual, difference: round2(totalActual.minus(totalExpected)) };
}

/** Income per month for a year, split by source (stacked bar friendly). */
export async function incomeByMonth(userId: number, year?: string) {
  const { start, end } = yearWindow(year);
  const entries = await prisma.incomeEntry.findMany({
    where: { userId, date: { gte: start, lt: end } },
    select: { amount: true, date: true, sourceId: true },
  });
  const sources = await prisma.incomeSource.findMany({ where: { userId }, select: { id: true, name: true } });
  const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: new Prisma.Decimal(0), bySource: {} as Record<string, Prisma.Decimal> }));
  for (const e of entries) {
    const m = e.date.getUTCMonth();
    months[m].total = months[m].total.plus(D(e.amount));
    const key = String(e.sourceId ?? 0);
    months[m].bySource[key] = (months[m].bySource[key] ?? new Prisma.Decimal(0)).plus(D(e.amount));
  }
  return { year: start.getUTCFullYear(), sources, months };
}
