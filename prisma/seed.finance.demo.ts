/* eslint-disable */
/**
 * MoneyFlow DEMO seed — rich, realistic Vietnamese sample data for one user.
 * Run:  npm run db:seed:finance:demo -- [userId] [--force]     (default userId 1)
 *
 * Builds data THROUGH THE SERVICES so wallet balances, debt schedules and
 * goal/savings state stay internally consistent (same $transaction paths the
 * app uses). Not idempotent: guarded to skip if the user already has demo
 * investments unless you pass --force.
 *
 * Populates: wallet starting balances, category budgets, income sources + a
 * work-log, income entries (this + last month), ~22 expenses across ~40 days,
 * 2 recurring txns, 3 debts (one part-paid), 4 investments (gain + loss + SELF),
 * 2 savings accounts + 2 goals.
 */
import { PrismaClient } from '@prisma/client';
import * as wallet from '../src/services/finance/wallet.service.js';
import * as expense from '../src/services/finance/expense.service.js';
import * as income from '../src/services/finance/income.service.js';
import * as recurring from '../src/services/finance/recurring.service.js';
import * as debt from '../src/services/finance/debt.service.js';
import * as investment from '../src/services/finance/investment.service.js';
import * as savings from '../src/services/finance/savings.service.js';

const prisma = new PrismaClient();

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

const WALLETS = [
  { name: 'Tiền mặt', type: 'CASH', icon: '💵', color: '#22c55e', start: 3_000_000 },
  { name: 'Ngân hàng', type: 'BANK', icon: '🏦', color: '#3b82f6', start: 150_000_000 },
  { name: 'Momo', type: 'EWALLET', icon: '📱', color: '#d946ef', start: 8_000_000 },
];
const CATEGORIES = [
  { name: 'Ăn uống', icon: '🍜', color: '#f97316', budget: 3_000_000 },
  { name: 'Đi lại', icon: '🛵', color: '#06b6d4', budget: 800_000 },
  { name: 'Nhà cửa', icon: '🏠', color: '#8b5cf6', budget: null },
  { name: 'Hóa đơn', icon: '💡', color: '#eab308', budget: 1_500_000 },
  { name: 'Mua sắm', icon: '🛍️', color: '#ec4899', budget: 2_000_000 },
  { name: 'Giải trí', icon: '🎮', color: '#a855f7', budget: 1_000_000 },
  { name: 'Sức khỏe', icon: '💊', color: '#ef4444', budget: null },
  { name: 'Học tập', icon: '📚', color: '#0ea5e9', budget: null },
  { name: 'Cà phê', icon: '☕', color: '#92400e', budget: 500_000 },
  { name: 'Khác', icon: '📦', color: '#64748b', budget: null },
];

// [daysAgo, categoryName, amount, walletName, description]
const EXPENSES: [number, string, number, string, string][] = [
  [0, 'Cà phê', 40000, 'Momo', 'Cà phê sáng'],
  [1, 'Ăn uống', 65000, 'Tiền mặt', 'Bún bò'],
  [1, 'Đi lại', 50000, 'Momo', 'Xăng xe'],
  [2, 'Ăn uống', 120000, 'Tiền mặt', 'Cơm trưa nhóm'],
  [3, 'Cà phê', 35000, 'Tiền mặt', 'Highlands'],
  [4, 'Giải trí', 180000, 'Ngân hàng', 'Xem phim'],
  [5, 'Mua sắm', 450000, 'Ngân hàng', 'Áo thun'],
  [6, 'Ăn uống', 85000, 'Tiền mặt', 'Phở'],
  [7, 'Sức khỏe', 250000, 'Ngân hàng', 'Thuốc cảm'],
  [8, 'Hóa đơn', 520000, 'Ngân hàng', 'Tiền điện'],
  [9, 'Cà phê', 45000, 'Momo', 'Cà phê chiều'],
  [10, 'Đi lại', 60000, 'Momo', 'Grab'],
  [12, 'Ăn uống', 95000, 'Tiền mặt', 'Bánh mì + trà'],
  [14, 'Học tập', 300000, 'Ngân hàng', 'Sách kỹ năng'],
  [16, 'Giải trí', 120000, 'Momo', 'Game top-up'],
  [18, 'Ăn uống', 150000, 'Tiền mặt', 'Lẩu bạn bè'],
  // last month
  [26, 'Hóa đơn', 480000, 'Ngân hàng', 'Tiền nước + net'],
  [28, 'Ăn uống', 110000, 'Tiền mặt', 'Cơm gà'],
  [30, 'Mua sắm', 900000, 'Ngân hàng', 'Giày'],
  [33, 'Cà phê', 40000, 'Momo', 'Cà phê'],
  [36, 'Giải trí', 350000, 'Ngân hàng', 'Karaoke'],
  [38, 'Đi lại', 70000, 'Momo', 'Grab'],
];

async function ensureBase(userId: number) {
  if ((await prisma.wallet.count({ where: { userId } })) === 0) {
    for (const [i, w] of WALLETS.entries()) await wallet.createWallet(userId, { name: w.name, type: w.type, icon: w.icon, color: w.color, order: i } as never);
    console.log('  ✓ created wallets');
  }
  if ((await prisma.expenseCategory.count({ where: { userId } })) === 0) {
    for (const c of CATEGORIES) await expense.createCategory(userId, { name: c.name, icon: c.icon, color: c.color } as never);
    console.log('  ✓ created categories');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const userId = Number(args.find((a) => /^\d+$/.test(a)) ?? 1);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true } });
  if (!user) throw new Error(`User ${userId} not found — pass an existing id: npm run db:seed:finance:demo -- <id>`);

  if (!force && (await prisma.investment.count({ where: { userId } })) > 0) {
    console.log(`\nUser #${userId} already has finance investments — looks seeded. Re-run with --force to add more.\n`);
    return;
  }

  console.log(`\nSeeding MoneyFlow DEMO data for user #${user.id} (${user.username})`);
  await ensureBase(userId);

  const wallets = await prisma.wallet.findMany({ where: { userId } });
  const cats = await prisma.expenseCategory.findMany({ where: { userId } });
  const W = (name: string) => wallets.find((w) => w.name === name)!.id;
  const C = (name: string) => cats.find((c) => c.name === name)!.id;

  // 1) starting balances
  for (const w of WALLETS) await wallet.adjustWalletBalance(userId, W(w.name), { targetBalance: w.start, reason: 'Số dư ban đầu (demo)' });
  console.log('  ✓ wallet starting balances set');

  // 2) budgets
  for (const c of CATEGORIES.filter((c) => c.budget)) await expense.updateCategory(userId, C(c.name), { monthlyBudget: c.budget } as never);
  console.log('  ✓ category budgets set');

  // 3) income sources + work log
  const company = await income.createSource(userId, { name: 'Công ty ABC', type: 'SALARY', payType: 'MONTHLY', baseSalary: 20_000_000 });
  const teaching = await income.createSource(userId, { name: 'Dạy thêm', type: 'PART_TIME', payType: 'HOURLY', hourlyRate: 200_000, otMultiplierNormal: 1.5, otMultiplierHoliday: 2 });
  await income.upsertWorkLog(userId, { sourceId: teaching.id, date: daysAgo(3), hoursNormal: 4, hoursOT: 2 });
  await income.upsertWorkLog(userId, { sourceId: teaching.id, date: daysAgo(6), hoursNormal: 4 });
  console.log('  ✓ income sources + work logs');

  // 4) income entries (this month + last month)
  await income.createIncomeEntry(userId, { sourceId: company.id, walletId: W('Ngân hàng'), amount: 20_000_000, type: 'SALARY', date: daysAgo(5), note: 'Lương tháng này' });
  await income.createIncomeEntry(userId, { sourceId: company.id, walletId: W('Ngân hàng'), amount: 20_000_000, type: 'SALARY', date: daysAgo(35), note: 'Lương tháng trước' });
  await income.createIncomeEntry(userId, { sourceId: teaching.id, walletId: W('Momo'), amount: 2_800_000, type: 'FREELANCE', date: daysAgo(4), note: 'Dạy thêm' });
  await income.createIncomeEntry(userId, { walletId: W('Momo'), amount: 1_500_000, type: 'BONUS', date: daysAgo(10), note: 'Thưởng nóng' });
  console.log('  ✓ income entries');

  // 5) expenses
  for (const [d, cat, amt, wname, desc] of EXPENSES) {
    await expense.createExpense(userId, { categoryId: C(cat), walletId: W(wname), amount: amt, date: daysAgo(d), description: desc });
  }
  console.log(`  ✓ ${EXPENSES.length} expenses`);

  // 6) recurring
  await recurring.createRecurring(userId, { kind: 'EXPENSE', amount: 4_000_000, categoryId: C('Nhà cửa'), walletId: W('Ngân hàng'), description: 'Tiền nhà', frequency: 'MONTHLY', dayOfMonth: 5, nextRunAt: daysAgo(-3) });
  await recurring.createRecurring(userId, { kind: 'EXPENSE', amount: 260_000, categoryId: C('Giải trí'), walletId: W('Momo'), description: 'Netflix', frequency: 'MONTHLY', dayOfMonth: 12, nextRunAt: daysAgo(-6) });
  console.log('  ✓ recurring transactions');

  // 7) debts (one part-paid)
  const loanApp = await debt.createDebt(userId, { lenderName: 'App vay FE', lenderType: 'LOAN_APP', principal: 10_000_000, interestType: 'DAILY_PERCENT', interestRate: 0.05, startDate: daysAgo(60), termMonths: 3, paymentDay: 15 });
  await debt.createDebt(userId, { lenderName: 'Vietcombank', lenderType: 'BANK', principal: 50_000_000, interestType: 'REDUCING_BALANCE', interestRate: 1, startDate: daysAgo(40), termMonths: 12, paymentDay: 10 });
  await debt.createDebt(userId, { lenderName: 'Bạn Nam', lenderType: 'PERSON', principal: 5_000_000, interestType: 'NO_INTEREST', startDate: daysAgo(20), termMonths: 5, paymentDay: 1 });
  const firstItem = loanApp!.schedule![0];
  if (firstItem) await debt.payScheduleItem(userId, loanApp!.id, firstItem.id, { walletId: W('Ngân hàng') });
  console.log('  ✓ 3 debts (1 installment paid)');

  // 8) investments
  await investment.createInvestment(userId, { type: 'ASSET', name: 'Vàng SJC', amount: 20_000_000, currentValue: 22_400_000, date: daysAgo(90), walletId: W('Ngân hàng'), note: '2 chỉ' });
  await investment.createInvestment(userId, { type: 'ASSET', name: 'Cổ phiếu FPT', amount: 15_000_000, currentValue: 13_500_000, date: daysAgo(70), walletId: W('Ngân hàng') });
  await investment.createInvestment(userId, { type: 'SELF', name: 'Khóa học Unity', amount: 2_500_000, date: daysAgo(45), walletId: W('Momo'), expectedOutcome: 'Làm được game 2D hoàn chỉnh' });
  const book = await investment.createInvestment(userId, { type: 'SELF', name: 'Sách tiếng Nhật N3', amount: 500_000, date: daysAgo(120), walletId: W('Tiền mặt'), expectedOutcome: 'Đạt N3' });
  await investment.completeInvestment(userId, book.id, 'Đã thi đỗ JLPT N3 ✅');
  console.log('  ✓ 4 investments (gain/loss/SELF)');

  // 9) savings accounts + goals
  await savings.createSavingsAccount(userId, { bankName: 'Vietcombank', amount: 30_000_000, interestRatePerYear: 5.5, termMonths: 6, startDate: daysAgo(20), walletId: W('Ngân hàng') });
  await savings.createSavingsAccount(userId, { bankName: 'Techcombank', amount: 50_000_000, interestRatePerYear: 6.2, termMonths: 12, startDate: daysAgo(80), walletId: W('Ngân hàng') });
  const macbook = await savings.createSavingsGoal(userId, { name: 'Mua MacBook', targetAmount: 40_000_000, deadline: daysAgo(-240), icon: '💻' });
  await savings.contributeToGoal(userId, macbook.id, { amount: 12_000_000, walletId: W('Ngân hàng') });
  const emergency = await savings.createSavingsGoal(userId, { name: 'Quỹ khẩn cấp', targetAmount: 50_000_000, icon: '🛟' });
  await savings.contributeToGoal(userId, emergency.id, { amount: 18_000_000, walletId: W('Ngân hàng') });
  console.log('  ✓ 2 savings accounts + 2 goals');

  const finalWallets = await prisma.wallet.findMany({ where: { userId }, select: { name: true, balance: true } });
  console.log('\nWallet balances now:');
  for (const w of finalWallets) console.log(`  • ${w.name}: ${Number(w.balance).toLocaleString('vi-VN')} ₫`);
  console.log('\nDone. Open /finance as this user to see the demo. 🎉\n');
}

main().catch((e) => { console.error('\n❌', e.message, '\n'); process.exit(1); }).finally(() => prisma.$disconnect());
