/**
 * Cross-user isolation test for MoneyFlow (the anti-data-leak guard).
 * Run: tsx scripts/test-finance-scoping.ts [userA] [userB]   (default 3, 7)
 *
 * Creates data owned by user B, then asserts user A can neither READ nor
 * MUTATE any of it (every attempt must throw / affect 0 rows). Also asserts
 * A's own lists never contain B's rows. Cleans up all rows it creates.
 */
import assert from 'node:assert/strict';
import { prisma } from '../src/config/database.js';
import * as wallet from '../src/services/finance/wallet.service.js';
import * as expense from '../src/services/finance/expense.service.js';
import * as income from '../src/services/finance/income.service.js';
import * as debt from '../src/services/finance/debt.service.js';
import * as investment from '../src/services/finance/investment.service.js';
import * as savings from '../src/services/finance/savings.service.js';

const A = Number(process.argv[2] || 3);
const B = Number(process.argv[3] || 7);

let passed = 0;
async function denied(label: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    throw new Error(`LEAK: ${label} — expected rejection but it SUCCEEDED`);
  } catch (e) {
    const msg = (e as Error).message;
    if (msg.startsWith('LEAK:')) throw e;
    console.log(`  ✓ blocked: ${label}`);
    passed++;
  }
}
function ok(label: string, cond: boolean) { assert.ok(cond, `FAIL: ${label}`); console.log(`  ✓ ${label}`); passed++; }

async function main() {
  console.log(`\nCross-user scoping: A=#${A} must NOT touch B=#${B}'s data\n`);
  const created: { wallets: number[]; debts: number[]; expenses: number[]; income: number[]; cats: number[]; investments: number[]; savings: number[]; goals: number[] } = { wallets: [], debts: [], expenses: [], income: [], cats: [], investments: [], savings: [], goals: [] };

  // ── Seed data owned by B ──
  const bWallet = await wallet.createWallet(B, { name: 'B-secret-wallet', type: 'CASH', balance: 1_000_000 });
  created.wallets.push(bWallet.id);
  const bCat = await expense.createCategory(B, { name: 'B-cat' }); created.cats.push(bCat.id);
  const bExpense = await expense.createExpense(B, { categoryId: bCat.id, walletId: bWallet.id, amount: 50_000 });
  created.expenses.push(bExpense.id);
  const bIncome = await income.createIncomeEntry(B, { walletId: bWallet.id, amount: 200_000, type: 'SALARY' });
  created.income.push(bIncome.id);
  const bDebt = await debt.createDebt(B, { lenderName: 'B-lender', lenderType: 'PERSON', principal: 3_000_000, interestType: 'NO_INTEREST', termMonths: 3, paymentDay: 5 });
  created.debts.push(bDebt!.id);
  const bItem = bDebt!.schedule![0];

  // Phase 2 data owned by B
  const bInvest = await investment.createInvestment(B, { type: 'ASSET', name: 'B-gold', amount: 1_000_000, currentValue: 1_200_000 });
  created.investments.push(bInvest.id);
  const bSavings = await savings.createSavingsAccount(B, { bankName: 'B-bank', amount: 5_000_000, interestRatePerYear: 6, termMonths: 6 });
  created.savings.push(bSavings.id);
  const bGoal = await savings.createSavingsGoal(B, { name: 'B-goal', targetAmount: 10_000_000 });
  created.goals.push(bGoal.id);

  // Also give A its own wallet so list checks are meaningful
  const aWallet = await wallet.createWallet(A, { name: 'A-wallet', type: 'CASH', balance: 500_000 });
  created.wallets.push(aWallet.id);

  console.log('READ isolation:');
  await denied('A reads B wallet', () => wallet.getWallet(A, bWallet.id));
  await denied('A reads B debt', () => debt.getDebt(A, bDebt!.id));
  ok('A wallet list excludes B wallet', (await wallet.listWallets(A)).every((w) => w.id !== bWallet.id));
  ok('A debt list excludes B debt', (await debt.listDebts(A)).every((d) => d.id !== bDebt!.id));
  ok('A income list excludes B income', (await income.listIncomeEntries(A, { month: bIncome.date.toISOString().slice(0, 7) })).every((e) => e.id !== bIncome.id));
  ok('A expense list excludes B expense', (await expense.listExpenses(A, { limit: 500 })).items.every((e) => e.id !== bExpense.id));

  console.log('\nMUTATE isolation:');
  await denied('A updates B wallet', () => wallet.updateWallet(A, bWallet.id, { name: 'hacked' }));
  await denied('A deletes B wallet', () => wallet.deleteWallet(A, bWallet.id));
  await denied('A adjusts B wallet balance', () => wallet.adjustWalletBalance(A, bWallet.id, { targetBalance: 0 }));
  await denied('A transfers FROM B wallet', () => wallet.transferBetweenWallets(A, { fromWalletId: bWallet.id, toWalletId: aWallet.id, amount: 100 }));
  await denied('A deletes B expense', () => expense.deleteExpense(A, bExpense.id));
  await denied('A updates B expense', () => expense.updateExpense(A, bExpense.id, { amount: 1 }));
  await denied('A deletes B income entry', () => income.deleteIncomeEntry(A, bIncome.id));
  await denied('A updates B debt', () => debt.updateDebt(A, bDebt!.id, { note: 'x' }));
  await denied('A deletes B debt', () => debt.deleteDebt(A, bDebt!.id));
  await denied('A pays B debt schedule item', () => debt.payScheduleItem(A, bDebt!.id, bItem.id, {}));
  await denied('A updates B investment', () => investment.updateInvestment(A, bInvest.id, { name: 'x' }));
  await denied('A sells B investment', () => investment.sellInvestment(A, bInvest.id, {}));
  await denied('A deletes B investment', () => investment.deleteInvestment(A, bInvest.id));
  await denied('A withdraws B savings account', () => savings.withdrawSavingsAccount(A, bSavings.id, {}));
  await denied('A deletes B savings account', () => savings.deleteSavingsAccount(A, bSavings.id));
  await denied('A contributes to B goal', () => savings.contributeToGoal(A, bGoal.id, { amount: 1000 }));
  await denied('A deletes B goal', () => savings.deleteSavingsGoal(A, bGoal.id));
  ok('A investment list excludes B investment', (await investment.listInvestments(A)).every((i) => i.id !== bInvest.id));
  ok('A savings list excludes B account', (await savings.listSavingsAccounts(A)).every((s) => s.id !== bSavings.id));
  ok('A goal list excludes B goal', (await savings.listSavingsGoals(A)).every((g) => g.id !== bGoal.id));

  // ── Verify B's data is intact (nothing A did leaked through) ──
  console.log('\nIntegrity after attacks:');
  const bWalletAfter = await wallet.getWallet(B, bWallet.id);
  ok('B wallet name unchanged', bWalletAfter.name === 'B-secret-wallet');
  ok('B wallet balance unchanged', Number(bWalletAfter.balance) === 1_000_000 - 50_000 + 200_000);
  ok('B debt still ACTIVE + unpaid', (await debt.getDebt(B, bDebt!.id)).schedule!.every((s) => !s.isPaid));

  // ── Cleanup ──
  for (const id of created.investments) await prisma.investment.deleteMany({ where: { id } });
  for (const id of created.savings) await prisma.savingsAccount.deleteMany({ where: { id } });
  for (const id of created.goals) await prisma.savingsGoal.deleteMany({ where: { id } });
  for (const id of created.debts) await prisma.debt.deleteMany({ where: { id } });
  for (const id of created.expenses) await prisma.expense.deleteMany({ where: { id } });
  for (const id of created.income) await prisma.incomeEntry.deleteMany({ where: { id } });
  for (const id of created.cats) await prisma.expenseCategory.deleteMany({ where: { id } });
  for (const id of created.wallets) await prisma.wallet.deleteMany({ where: { id } });

  console.log(`\n✅ All ${passed} isolation checks passed. No cross-user leakage.\n`);
}

main().catch((e) => { console.error('\n❌', e.message, '\n'); process.exit(1); }).finally(() => prisma.$disconnect());
