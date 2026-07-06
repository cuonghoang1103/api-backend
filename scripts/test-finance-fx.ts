/**
 * Functional test for MoneyFlow dual-currency (VND↔USD) support.
 * Run against a scratch DB:
 *   DATABASE_URL=postgresql://...  npx tsx scripts/test-finance-fx.ts
 *
 * Covers: fx rate CRUD + bounds, wallet currency validation, entries
 * inheriting the wallet currency, cross-currency transfers at the current
 * rate, dashboard/report VND conversion, the no-rate USD flag, and that a
 * VND-only user sees identical numbers to the pre-FX behaviour.
 * Creates its own users' data under ids 990101/990102/990103 and wipes it.
 */
import assert from 'node:assert/strict';
import { prisma } from '../src/config/database.js';
import * as fx from '../src/services/finance/fx.service.js';
import * as wallet from '../src/services/finance/wallet.service.js';
import * as expense from '../src/services/finance/expense.service.js';
import * as income from '../src/services/finance/income.service.js';
import { getDashboard } from '../src/services/finance/dashboard.service.js';
import { monthlyReport } from '../src/services/finance/reports.service.js';

const U = 990101; // main dual-currency user
const U_NORATE = 990102; // has USD but never set a rate
const U_VND = 990103; // pure-VND user (must be unaffected)

let passed = 0;
function ok(label: string, cond: boolean, actual?: unknown) {
  assert.ok(cond, `FAIL: ${label}${actual !== undefined ? ` (actual: ${actual})` : ''}`);
  console.log(`  ✓ ${label}`);
  passed++;
}
async function rejected(label: string, fn: () => Promise<unknown>) {
  try { await fn(); assert.fail(`FAIL: ${label} — expected rejection`); }
  catch (e) { if ((e as Error).message.startsWith('FAIL:')) throw e; console.log(`  ✓ rejected: ${label}`); passed++; }
}
const num = (v: unknown) => Number(String(v));

async function cleanup() {
  const users = { userId: { in: [U, U_NORATE, U_VND] } };
  await prisma.expense.deleteMany({ where: users });
  await prisma.incomeEntry.deleteMany({ where: users });
  await prisma.expenseCategory.deleteMany({ where: users });
  await prisma.walletAdjustment.deleteMany({ where: users });
  await prisma.wallet.deleteMany({ where: users });
  await prisma.financeFxRate.deleteMany({ where: users });
}

async function main() {
  await cleanup();
  console.log('\n── FX rate CRUD + bounds ──');
  await rejected('rate below sane bound (500)', () => fx.setFxRate(U, { vndPerUsd: 500 }));
  await rejected('rate above sane bound (2,000,000)', () => fx.setFxRate(U, { vndPerUsd: 2_000_000 }));
  const r1 = await fx.setFxRate(U, { vndPerUsd: 24_000 });
  const r2 = await fx.setFxRate(U, { vndPerUsd: 25_000, note: 'test rate' });
  const cur = await fx.getCurrentFxRate(U);
  ok('current rate = newest entry (25,000)', num(cur!.vndPerUsd) === 25_000, num(cur!.vndPerUsd));
  ok('current rate keeps its note', cur!.note === 'test rate');
  const his = await fx.listFxRates(U);
  ok('history has 2 entries, newest first', his.total === 2 && his.items[0].id === r2.id);
  await fx.deleteFxRate(U, r1.id);
  ok('history entry deletable', (await fx.listFxRates(U)).total === 1);
  await rejected("deleting another user's rate row", () => fx.deleteFxRate(U_NORATE, r2.id));

  console.log('\n── Wallet currency ──');
  await rejected('wallet with unsupported currency EUR', () => wallet.createWallet(U, { name: 'x', currency: 'EUR' }));
  const wVnd = await wallet.createWallet(U, { name: 'Ví ₫', type: 'CASH', balance: 1_000_000 });
  const wUsd = await wallet.createWallet(U, { name: 'Ví $', type: 'BANK', currency: 'USD', balance: 100 });
  ok('default currency is VND', wVnd.currency === 'VND');
  ok('USD wallet created', wUsd.currency === 'USD');

  console.log('\n── Entries inherit the wallet currency ──');
  const incUsd = await income.createIncomeEntry(U, { walletId: wUsd.id, amount: 200, type: 'SALARY' });
  const incVnd = await income.createIncomeEntry(U, { walletId: wVnd.id, amount: 500_000, type: 'SALARY' });
  ok('income into $ wallet stored as USD', incUsd.currency === 'USD');
  ok('income into ₫ wallet stored as VND', incVnd.currency === 'VND');
  const cat = await expense.createCategory(U, { name: 'FX-test' });
  const expUsd = await expense.createExpense(U, { categoryId: cat.id, walletId: wUsd.id, amount: 50 });
  const expVnd = await expense.createExpense(U, { categoryId: cat.id, walletId: wVnd.id, amount: 100_000 });
  ok('expense from $ wallet stored as USD', expUsd.currency === 'USD');
  ok('expense from ₫ wallet stored as VND', expVnd.currency === 'VND');
  const balUsd = await wallet.getWallet(U, wUsd.id);
  const balVnd = await wallet.getWallet(U, wVnd.id);
  ok('$ wallet balance 100+200−50 = 250', num(balUsd.balance) === 250, num(balUsd.balance));
  ok('₫ wallet balance 1tr+500k−100k = 1.400.000', num(balVnd.balance) === 1_400_000, num(balVnd.balance));

  console.log('\n── Cross-currency transfer @25,000 ──');
  await wallet.transferBetweenWallets(U, { fromWalletId: wUsd.id, toWalletId: wVnd.id, amount: 10 });
  ok('$→₫: $ side −10 → 240', num((await wallet.getWallet(U, wUsd.id)).balance) === 240);
  ok('$→₫: ₫ side +10×25,000 → 1.650.000', num((await wallet.getWallet(U, wVnd.id)).balance) === 1_650_000);
  await wallet.transferBetweenWallets(U, { fromWalletId: wVnd.id, toWalletId: wUsd.id, amount: 250_000 });
  ok('₫→$: ₫ side −250k → 1.400.000', num((await wallet.getWallet(U, wVnd.id)).balance) === 1_400_000);
  ok('₫→$: $ side +250k/25,000 → 250', num((await wallet.getWallet(U, wUsd.id)).balance) === 250);

  const nrV = await wallet.createWallet(U_NORATE, { name: 'nr-vnd', balance: 100_000 });
  const nrU = await wallet.createWallet(U_NORATE, { name: 'nr-usd', currency: 'USD', balance: 10 });
  await rejected('cross-currency transfer without a rate', () =>
    wallet.transferBetweenWallets(U_NORATE, { fromWalletId: nrU.id, toWalletId: nrV.id, amount: 1 }));

  console.log('\n── Dashboard conversion (rate 25,000) ──');
  const dash = await getDashboard(U);
  ok('totalBalance = 1.400.000 + 250×25k = 7.650.000', num(dash.totalBalance) === 7_650_000, num(dash.totalBalance));
  ok('incomeThisMonth = 500k + 200×25k = 5.500.000', num(dash.incomeThisMonth) === 5_500_000, num(dash.incomeThisMonth));
  ok('expenseThisMonth = 100k + 50×25k = 1.350.000', num(dash.expenseThisMonth) === 1_350_000, num(dash.expenseThisMonth));
  ok('fx payload present with rate', dash.fx !== null && num(dash.fx!.rate) === 25_000);
  ok('no unconverted-USD flag when rate set', dash.hasUnconvertedUsd === false);

  const dashNr = await getDashboard(U_NORATE);
  ok('no-rate user: USD excluded from totals (100k only)', num(dashNr.totalBalance) === 100_000, num(dashNr.totalBalance));
  ok('no-rate user: hasUnconvertedUsd = true', dashNr.hasUnconvertedUsd === true);
  ok('no-rate user: fx = null', dashNr.fx === null);

  console.log('\n── Pure-VND user unaffected ──');
  const vw = await wallet.createWallet(U_VND, { name: 'chỉ ₫', balance: 750_000 });
  await income.createIncomeEntry(U_VND, { walletId: vw.id, amount: 100_000, type: 'SALARY' });
  const dashV = await getDashboard(U_VND);
  ok('VND-only totalBalance = 850.000 (identical to old math)', num(dashV.totalBalance) === 850_000, num(dashV.totalBalance));
  ok('VND-only incomeThisMonth = 100.000', num(dashV.incomeThisMonth) === 100_000);
  ok('VND-only: fx null + no flag', dashV.fx === null && dashV.hasUnconvertedUsd === false);

  console.log('\n── Monthly report conversion ──');
  const rep = await monthlyReport(U);
  ok('report income = 5.500.000', num(rep.income) === 5_500_000, num(rep.income));
  ok('report expense = 1.350.000', num(rep.expense) === 1_350_000, num(rep.expense));
  ok('report net = 4.150.000', num(rep.net) === 4_150_000);

  await cleanup();
  console.log(`\n✅ ALL ${passed} CHECKS PASSED\n`);
}

main()
  .catch(async (e) => { console.error('\n❌', (e as Error).message); await cleanup().catch(() => undefined); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
