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
import { CURRENCIES, getCurrentFxRate, toVnd, vndToUsd } from './fx.service.js';

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
    name?: string; type?: string; payType?: string; currency?: string;
    baseSalary?: number | string | null; hourlyRate?: number | string | null;
    otMultiplierNormal?: number | string; otMultiplierHoliday?: number | string;
    note?: string | null;
  },
) {
  const name = String(data.name ?? '').trim();
  if (!name) throw new BadRequestError('Tên nguồn thu không được để trống');
  const type = assertOneOf(data.type ?? 'SALARY', SOURCE_TYPES, 'Loại nguồn thu');
  const payType = assertOneOf(data.payType ?? 'MONTHLY', PAY_TYPES, 'Hình thức trả');
  const currency = assertOneOf(data.currency ?? 'VND', CURRENCIES, 'Tiền tệ');
  return prisma.incomeSource.create({
    data: {
      userId, name, type, payType, currency,
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
  if (data.currency !== undefined) patch.currency = assertOneOf(data.currency, CURRENCIES, 'Tiền tệ');
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
  source: { hourlyRate: Prisma.Decimal | null; otMultiplierNormal: Prisma.Decimal; otMultiplierHoliday: Prisma.Decimal; currency?: string | null } | null,
) {
  const hoursNormal = sum(logs.map((l) => l.hoursNormal));
  const hoursOT = sum(logs.map((l) => l.hoursOT));
  const hoursOTHoliday = sum(logs.map((l) => l.hoursOTHoliday));
  const rate = D(source?.hourlyRate ?? 0);
  const mOt = D(source?.otMultiplierNormal ?? 1.5);
  const mHol = D(source?.otMultiplierHoliday ?? 2.0);
  // expected pay = normal×rate + OT×rate×mult + holidayOT×rate×holidayMult
  // (in the source's own currency — the FE formats it with `currency`).
  const expectedPay = round2(
    hoursNormal.times(rate)
      .plus(hoursOT.times(rate).times(mOt))
      .plus(hoursOTHoliday.times(rate).times(mHol)),
  );
  return { hoursNormal, hoursOT, hoursOTHoliday, expectedPay, currency: source?.currency ?? 'VND' };
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
  const inputAmount = round2(D(data.amount));
  if (!isPositive(inputAmount)) throw new BadRequestError('Số tiền thu phải lớn hơn 0');
  const type = assertOneOf(data.type ?? 'SALARY', INCOME_TYPES, 'Loại thu nhập');
  // The typed amount is in the source's currency (USD job → USD amount). With no
  // source it defaults to the wallet's currency (unchanged legacy behaviour).
  let sourceCurrency: string | null = null;
  if (data.sourceId) {
    const s = await prisma.incomeSource.findFirst({ where: { id: data.sourceId, userId }, select: { currency: true } });
    if (!s) throw new NotFoundError('Không tìm thấy nguồn thu');
    sourceCurrency = s.currency;
  }
  const date = data.date ? toDateOnly(data.date) : toDateOnly(new Date());

  return prisma.$transaction(async (tx) => {
    const walletRow = await tx.wallet.findFirst({ where: { id: data.walletId, userId }, select: { currency: true } });
    if (!walletRow) throw new NotFoundError('Không tìm thấy ví');
    const { creditAmount, fxNote } = await convertForWallet(userId, inputAmount, sourceCurrency ?? walletRow.currency, walletRow.currency);
    const wallet = await applyWalletDelta(tx, userId, data.walletId, creditAmount); // credit
    const userNote = data.note?.toString().slice(0, 1000) || null;
    const note = [userNote, fxNote].filter(Boolean).join(' · ') || null;
    return tx.incomeEntry.create({
      // entry currency + amount always follow the wallet it lands in
      data: { userId, sourceId: data.sourceId ?? null, walletId: data.walletId, amount: creditAmount, currency: wallet.currency, date, type, note },
    });
  });
}

/**
 * Convert `amount` (in `fromCurrency`) into `toCurrency` at the user's current
 * FX rate. Identity when the currencies match. Mirrors the cross-currency rule
 * used by wallet transfers; throws if a rate is needed but not set.
 */
async function convertForWallet(
  userId: number,
  amount: Prisma.Decimal,
  fromCurrency: string,
  toCurrency: string,
): Promise<{ creditAmount: Prisma.Decimal; fxNote: string | null }> {
  if (fromCurrency === toCurrency) return { creditAmount: amount, fxNote: null };
  const fx = await getCurrentFxRate(userId);
  if (!fx) throw new BadRequestError('Nguồn thu khác tiền tệ với ví — hãy đặt tỷ giá trong mục Tỷ giá trước');
  const rate = D(fx.vndPerUsd);
  const creditAmount = fromCurrency === 'USD' ? toVnd(amount, 'USD', rate) : vndToUsd(amount, rate);
  return { creditAmount, fxNote: `Tỷ giá ${round2(rate).toFixed(0)} ₫/$` };
}

export async function updateIncomeEntry(
  userId: number,
  id: number,
  data: { sourceId?: number | null; walletId?: number; amount?: number | string; date?: string; type?: string; note?: string | null },
) {
  assertId(id, 'incomeEntryId');
  if (data.walletId !== undefined) assertId(data.walletId, 'walletId');
  return prisma.$transaction(async (tx) => {
    const existing = await tx.incomeEntry.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Không tìm thấy khoản thu');
    const newWalletId = data.walletId ?? existing.walletId;
    const newSourceId = data.sourceId !== undefined ? data.sourceId : existing.sourceId;
    const inputAmount = data.amount !== undefined ? round2(D(data.amount)) : D(existing.amount);
    if (!isPositive(inputAmount)) throw new BadRequestError('Số tiền thu phải lớn hơn 0');

    const walletRow = await tx.wallet.findFirst({ where: { id: newWalletId, userId }, select: { currency: true } });
    if (!walletRow) throw new NotFoundError('Không tìm thấy ví');
    // A freshly-typed amount is in the source's currency; an untouched amount is
    // already stored in the wallet's currency, so leave it as-is (identity).
    let inputCurrency = walletRow.currency;
    if (data.amount !== undefined && newSourceId) {
      const s = await tx.incomeSource.findFirst({ where: { id: newSourceId, userId }, select: { currency: true } });
      if (!s) throw new NotFoundError('Không tìm thấy nguồn thu');
      inputCurrency = s.currency;
    }
    const { creditAmount } = await convertForWallet(userId, inputAmount, inputCurrency, walletRow.currency);

    // reverse old credit, apply new credit
    await applyWalletDelta(tx, userId, existing.walletId, D(existing.amount).negated());
    const newWallet = await applyWalletDelta(tx, userId, newWalletId, creditAmount);

    return tx.incomeEntry.update({
      where: { id },
      data: {
        sourceId: newSourceId,
        walletId: newWalletId,
        amount: creditAmount,
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
  const [sources, logs, fx, entries] = await Promise.all([
    prisma.incomeSource.findMany({ where: { userId, isActive: true } }),
    prisma.workLog.findMany({ where: { userId, date: { gte: start, lt: end } } }),
    getCurrentFxRate(userId),
    prisma.incomeEntry.findMany({ where: { userId, date: { gte: start, lt: end } }, select: { sourceId: true, amount: true, currency: true } }),
  ]);
  const rate = fx ? D(fx.vndPerUsd) : null;
  const logsBySource = new Map<number, typeof logs>();
  for (const l of logs) {
    const arr = logsBySource.get(l.sourceId) ?? [];
    arr.push(l);
    logsBySource.set(l.sourceId, arr);
  }

  // Expected pay is in the source's own currency; keep a native figure for the
  // per-source row and a VND-normalised figure for the cross-source totals.
  const perSource = sources.map((s) => {
    let expected: Prisma.Decimal;
    if (s.payType === 'MONTHLY') {
      expected = round2(D(s.baseSalary ?? 0));
    } else if (s.payType === 'HOURLY') {
      expected = workLogTotals(logsBySource.get(s.id) ?? [], s).expectedPay;
    } else {
      expected = new Prisma.Decimal(0); // PER_JOB: no formula, actuals only
    }
    return { source: { id: s.id, name: s.name, type: s.type, payType: s.payType, currency: s.currency }, expected, expectedVnd: toVnd(expected, s.currency, rate) };
  });

  // Actuals: entries already store their wallet currency → convert each to VND.
  const actualVndBySource = new Map<number | null, Prisma.Decimal>();
  const actualNativeBySource = new Map<number | null, Prisma.Decimal>();
  for (const e of entries) {
    const vnd = toVnd(e.amount, e.currency, rate);
    actualVndBySource.set(e.sourceId, (actualVndBySource.get(e.sourceId) ?? new Prisma.Decimal(0)).plus(vnd));
    actualNativeBySource.set(e.sourceId, (actualNativeBySource.get(e.sourceId) ?? new Prisma.Decimal(0)).plus(D(e.amount)));
  }

  const rows = perSource.map((p) => {
    const actual = actualNativeBySource.get(p.source.id) ?? new Prisma.Decimal(0);
    const actualVnd = actualVndBySource.get(p.source.id) ?? new Prisma.Decimal(0);
    return { source: p.source, expected: p.expected, actual, difference: round2(actual.minus(p.expected)), expectedVnd: p.expectedVnd, actualVnd, differenceVnd: round2(actualVnd.minus(p.expectedVnd)) };
  });
  const totalExpected = sum(perSource.map((p) => p.expectedVnd));
  const totalActual = sum(entries.map((e) => toVnd(e.amount, e.currency, rate)));

  return { rows, totalExpected, totalActual, difference: round2(totalActual.minus(totalExpected)) };
}

/** Income per month for a year, split by source (stacked bar friendly). */
export async function incomeByMonth(userId: number, year?: string) {
  const { start, end } = yearWindow(year);
  const [entries, sources, fx] = await Promise.all([
    prisma.incomeEntry.findMany({
      where: { userId, date: { gte: start, lt: end } },
      select: { amount: true, currency: true, date: true, sourceId: true },
    }),
    prisma.incomeSource.findMany({ where: { userId }, select: { id: true, name: true } }),
    getCurrentFxRate(userId),
  ]);
  const rate = fx ? D(fx.vndPerUsd) : null;
  const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: new Prisma.Decimal(0), bySource: {} as Record<string, Prisma.Decimal> }));
  for (const e of entries) {
    const m = e.date.getUTCMonth();
    const vnd = toVnd(e.amount, e.currency, rate); // normalise USD → VND for a single-currency chart
    months[m].total = months[m].total.plus(vnd);
    const key = String(e.sourceId ?? 0);
    months[m].bySource[key] = (months[m].bySource[key] ?? new Prisma.Decimal(0)).plus(vnd);
  }
  return { year: start.getUTCFullYear(), sources, months };
}
