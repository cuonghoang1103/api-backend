/**
 * MoneyFlow — Recurring transactions (per-user).
 * ────────────────────────────────────────────────────────────
 * A RecurringTransaction is a template ("Tiền nhà", "Netflix") that
 * materializes into a real Expense or IncomeEntry when it comes due.
 * `runDue()` is idempotent: it only creates records for periods whose
 * `nextRunAt` has passed and advances `nextRunAt` forward, so calling it
 * repeatedly (it runs lazily on dashboard load — no cron needed) never
 * double-creates. Each materialization adjusts the wallet in a `$transaction`.
 */
import { prisma } from '../../config/database.js';
import { Prisma } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { D, round2, isPositive } from './money.js';
import { assertId, assertOneOf } from './helpers.js';
import { applyWalletDelta } from './wallet.service.js';

export const RECURRING_KINDS = ['EXPENSE', 'INCOME'] as const;
export const FREQUENCIES = ['MONTHLY', 'WEEKLY', 'YEARLY'] as const;

function advance(date: Date, frequency: string, dayOfMonth?: number | null): Date {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  if (frequency === 'WEEKLY') return new Date(date.getTime() + 7 * 86_400_000);
  if (frequency === 'YEARLY') return new Date(Date.UTC(y + 1, m, d));
  // MONTHLY (default): next month, clamped to dayOfMonth or the same day.
  const targetM = m + 1;
  const daysInTarget = new Date(Date.UTC(y, targetM + 1, 0)).getUTCDate();
  const wanted = dayOfMonth ?? d;
  return new Date(Date.UTC(y, targetM, Math.min(Math.max(1, wanted), daysInTarget)));
}

export async function listRecurring(userId: number) {
  return prisma.recurringTransaction.findMany({
    where: { userId },
    orderBy: [{ isActive: 'desc' }, { nextRunAt: 'asc' }],
  });
}

export async function createRecurring(
  userId: number,
  data: {
    kind?: string;
    amount: number | string;
    categoryId?: number | null;
    walletId: number;
    description?: string;
    frequency?: string;
    dayOfMonth?: number | null;
    nextRunAt?: string;
  },
) {
  const kind = assertOneOf(data.kind ?? 'EXPENSE', RECURRING_KINDS, 'Loại');
  const frequency = assertOneOf(data.frequency ?? 'MONTHLY', FREQUENCIES, 'Tần suất');
  const amount = round2(D(data.amount));
  if (!isPositive(amount)) throw new BadRequestError('Số tiền phải lớn hơn 0');
  assertId(data.walletId, 'walletId');
  const desc = String(data.description ?? '').trim();
  if (!desc) throw new BadRequestError('Mô tả không được để trống');

  // wallet must belong to the user
  const wallet = await prisma.wallet.findFirst({ where: { id: data.walletId, userId }, select: { id: true } });
  if (!wallet) throw new NotFoundError('Không tìm thấy ví');
  if (kind === 'EXPENSE' && data.categoryId) {
    const cat = await prisma.expenseCategory.findFirst({ where: { id: data.categoryId, userId }, select: { id: true } });
    if (!cat) throw new NotFoundError('Không tìm thấy danh mục');
  }

  const nextRunAt = data.nextRunAt ? new Date(data.nextRunAt) : new Date();
  if (Number.isNaN(nextRunAt.getTime())) throw new BadRequestError('Ngày chạy kế tiếp không hợp lệ');

  return prisma.recurringTransaction.create({
    data: {
      userId,
      kind,
      amount,
      categoryId: kind === 'EXPENSE' ? data.categoryId ?? null : null,
      walletId: data.walletId,
      description: desc.slice(0, 200),
      frequency,
      dayOfMonth: data.dayOfMonth ?? null,
      nextRunAt,
      isActive: true,
    },
  });
}

export async function updateRecurring(
  userId: number,
  id: number,
  data: Partial<{ amount: number | string; description: string; dayOfMonth: number | null; nextRunAt: string; isActive: boolean; frequency: string; categoryId: number | null }>,
) {
  assertId(id, 'recurringId');
  const patch: Prisma.RecurringTransactionUpdateInput = {};
  if (data.amount !== undefined) {
    const a = round2(D(data.amount));
    if (!isPositive(a)) throw new BadRequestError('Số tiền phải lớn hơn 0');
    patch.amount = a;
  }
  if (data.description !== undefined) patch.description = String(data.description).trim().slice(0, 200);
  if (data.dayOfMonth !== undefined) patch.dayOfMonth = data.dayOfMonth;
  if (data.frequency !== undefined) patch.frequency = assertOneOf(data.frequency, FREQUENCIES, 'Tần suất');
  if (data.isActive !== undefined) patch.isActive = Boolean(data.isActive);
  if (data.nextRunAt !== undefined) {
    const n = new Date(data.nextRunAt);
    if (Number.isNaN(n.getTime())) throw new BadRequestError('Ngày chạy kế tiếp không hợp lệ');
    patch.nextRunAt = n;
  }
  const res = await prisma.recurringTransaction.updateMany({ where: { id, userId }, data: patch });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy giao dịch định kỳ');
  return prisma.recurringTransaction.findUnique({ where: { id } });
}

export async function deleteRecurring(userId: number, id: number) {
  assertId(id, 'recurringId');
  const res = await prisma.recurringTransaction.deleteMany({ where: { id, userId } });
  if (res.count === 0) throw new NotFoundError('Không tìm thấy giao dịch định kỳ');
  return { id };
}

/**
 * Materialize every due recurring transaction. Idempotent & safe to call on
 * every dashboard load. Returns the count of records created.
 */
export async function runDue(userId: number, now: Date = new Date()): Promise<{ created: number }> {
  const due = await prisma.recurringTransaction.findMany({
    where: { userId, isActive: true, nextRunAt: { lte: now } },
  });
  let created = 0;

  for (const r of due) {
    await prisma.$transaction(async (tx) => {
      let cursor = r.nextRunAt;
      let guard = 0;
      // catch up any missed periods, capped to avoid runaway loops
      while (cursor.getTime() <= now.getTime() && guard < 60) {
        const dateOnly = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate()));
        if (r.kind === 'EXPENSE') {
          await applyWalletDelta(tx, userId, r.walletId, D(r.amount).negated());
          // a recurring expense needs a category; skip if it was deleted
          if (r.categoryId) {
            await tx.expense.create({
              data: {
                userId,
                categoryId: r.categoryId,
                walletId: r.walletId,
                amount: r.amount,
                date: dateOnly,
                description: r.description,
                isRecurring: true,
                recurringId: r.id,
              },
            });
            created++;
          }
        } else {
          await applyWalletDelta(tx, userId, r.walletId, D(r.amount));
          await tx.incomeEntry.create({
            data: { userId, walletId: r.walletId, amount: r.amount, date: dateOnly, type: 'OTHER', note: r.description },
          });
          created++;
        }
        cursor = advance(cursor, r.frequency, r.dayOfMonth);
        guard++;
      }
      await tx.recurringTransaction.update({ where: { id: r.id }, data: { nextRunAt: cursor } });
    });
  }
  return { created };
}
