/**
 * ============================================================
 * MoneyFlow — Finance Routes  (mounted at /api/v1/finance)
 * ============================================================
 *
 * PRIVATE, per-user. `router.use(authenticate)` gates EVERY route, and every
 * handler passes `req.userId!` into the service, which scopes all queries by
 * userId. A client can never supply a userId. There is no admin surface — an
 * admin has no special access to other users' finance data.
 *
 * Literal paths are declared before `:id(\\d+)` params so `/debts/summary`
 * etc. never collide with `/debts/:id`.
 */
import { Router, type Request, type Response } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '../types/index.js';

import * as walletService from '../services/finance/wallet.service.js';
import * as expenseService from '../services/finance/expense.service.js';
import * as recurringService from '../services/finance/recurring.service.js';
import * as incomeService from '../services/finance/income.service.js';
import * as debtService from '../services/finance/debt.service.js';
import * as investmentService from '../services/finance/investment.service.js';
import * as savingsService from '../services/finance/savings.service.js';
import * as reportsService from '../services/finance/reports.service.js';
import * as fxService from '../services/finance/fx.service.js';
import { getDashboard } from '../services/finance/dashboard.service.js';
import { comparePayoff, type PayoffDebt } from '../services/finance/payoffStrategy.js';

const router = Router();
router.use(authenticate);

const uid = (req: Request): number => req.userId!;
const ok = (res: Response<ApiResponse>, data: unknown, status = 200) => res.status(status).json({ success: true, data });

// reusable validators
const amount = (field = 'amount') => body(field).exists().withMessage('Số tiền là bắt buộc').bail().isFloat({ gt: 0 }).withMessage('Số tiền phải lớn hơn 0');
const idParam = (name: string) => param(name).isInt({ gt: 0 }).withMessage(`${name} không hợp lệ`);

// ─── Dashboard ───────────────────────────────────────────────
router.get('/dashboard', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await getDashboard(uid(req), req.query.month as string | undefined)); } catch (e) { next(e); }
});

// ─── Wallets ─────────────────────────────────────────────────
router.get('/wallets', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await walletService.listWallets(uid(req), req.query.includeArchived === 'true')); } catch (e) { next(e); }
});
router.post('/wallets', amount('balance').optional(), body('name').trim().notEmpty().withMessage('Tên ví là bắt buộc'), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await walletService.createWallet(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.post('/wallets/reorder', body('orderedIds').isArray({ min: 1 }), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await walletService.reorderWallets(uid(req), req.body.orderedIds)); } catch (e) { next(e); }
});
router.post('/wallets/transfer',
  body('fromWalletId').isInt({ gt: 0 }), body('toWalletId').isInt({ gt: 0 }), amount(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await walletService.transferBetweenWallets(uid(req), req.body)); } catch (e) { next(e); }
  });
router.get('/wallets/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await walletService.getWallet(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});
router.get('/wallets/:id(\\d+)/history', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await walletService.getWalletHistory(uid(req), Number(req.params.id), { page: Number(req.query.page), limit: Number(req.query.limit) })); } catch (e) { next(e); }
});
router.put('/wallets/:id(\\d+)', idParam('id'), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await walletService.updateWallet(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.post('/wallets/:id(\\d+)/adjust', amount('targetBalance').optional({ nullable: false }).isFloat(), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await walletService.adjustWalletBalance(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.delete('/wallets/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await walletService.deleteWallet(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});

// ─── Expense categories ──────────────────────────────────────
router.get('/expense-categories', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await expenseService.listCategories(uid(req))); } catch (e) { next(e); }
});
router.post('/expense-categories', body('name').trim().notEmpty(), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await expenseService.createCategory(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.post('/expense-categories/reorder', body('orderedIds').isArray({ min: 1 }), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await expenseService.reorderCategories(uid(req), req.body.orderedIds)); } catch (e) { next(e); }
});
router.put('/expense-categories/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await expenseService.updateCategory(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.delete('/expense-categories/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await expenseService.deleteCategory(uid(req), Number(req.params.id), req.body?.reassignToId ?? (req.query.reassignToId ? Number(req.query.reassignToId) : undefined))); } catch (e) { next(e); }
});

// ─── Expenses ────────────────────────────────────────────────
router.get('/expenses/summary', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await expenseService.expenseSummary(uid(req), { from: req.query.from as string, to: req.query.to as string, groupBy: req.query.groupBy as 'day' | 'month' | 'category' })); } catch (e) { next(e); }
});
router.get('/expenses/overview', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await expenseService.monthExpenseOverview(uid(req), req.query.month as string)); } catch (e) { next(e); }
});
router.get('/expenses', async (req, res: Response<ApiResponse>, next) => {
  try {
    ok(res, await expenseService.listExpenses(uid(req), {
      categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
      walletId: req.query.walletId ? Number(req.query.walletId) : undefined,
      from: req.query.from as string, to: req.query.to as string,
      search: req.query.search as string, page: Number(req.query.page), limit: Number(req.query.limit),
    }));
  } catch (e) { next(e); }
});
router.post('/expenses', body('categoryId').isInt({ gt: 0 }), body('walletId').isInt({ gt: 0 }), amount(), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await expenseService.createExpense(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.put('/expenses/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await expenseService.updateExpense(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.delete('/expenses/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await expenseService.deleteExpense(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});

// ─── Recurring ───────────────────────────────────────────────
router.get('/recurring', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await recurringService.listRecurring(uid(req))); } catch (e) { next(e); }
});
router.post('/recurring/run', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await recurringService.runDue(uid(req))); } catch (e) { next(e); }
});
router.post('/recurring', body('walletId').isInt({ gt: 0 }), amount(), body('description').trim().notEmpty(), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await recurringService.createRecurring(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.put('/recurring/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await recurringService.updateRecurring(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.delete('/recurring/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await recurringService.deleteRecurring(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});

// ─── Income: sources ─────────────────────────────────────────
router.get('/income/sources', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.listSources(uid(req))); } catch (e) { next(e); }
});
router.post('/income/sources', body('name').trim().notEmpty(), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.createSource(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.put('/income/sources/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.updateSource(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.delete('/income/sources/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.deleteSource(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});

// ─── Income: work logs ───────────────────────────────────────
router.get('/income/worklogs', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.listWorkLogs(uid(req), Number(req.query.sourceId), req.query.month as string)); } catch (e) { next(e); }
});
router.post('/income/worklogs', body('sourceId').isInt({ gt: 0 }), body('date').notEmpty(), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.upsertWorkLog(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.delete('/income/worklogs/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.deleteWorkLog(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});

// ─── Income: entries + analytics ─────────────────────────────
router.get('/income/expected-vs-actual', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.expectedVsActual(uid(req), req.query.month as string)); } catch (e) { next(e); }
});
router.get('/income/by-month', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.incomeByMonth(uid(req), req.query.year as string)); } catch (e) { next(e); }
});
router.get('/income/entries', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.listIncomeEntries(uid(req), { month: req.query.month as string, sourceId: req.query.sourceId ? Number(req.query.sourceId) : undefined, type: req.query.type as string })); } catch (e) { next(e); }
});
router.post('/income/entries', body('walletId').isInt({ gt: 0 }), amount(), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.createIncomeEntry(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.put('/income/entries/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.updateIncomeEntry(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.delete('/income/entries/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await incomeService.deleteIncomeEntry(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});

// ─── Debts ───────────────────────────────────────────────────
router.get('/debts/summary', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await debtService.debtSummary(uid(req), req.query.month as string)); } catch (e) { next(e); }
});
router.get('/debts/calendar', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await debtService.debtCalendar(uid(req), req.query.month as string)); } catch (e) { next(e); }
});
router.post('/debts/preview', amount('principal'), body('interestType').notEmpty(), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, debtService.previewSchedule(req.body)); } catch (e) { next(e); }
});
router.get('/debts', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await debtService.listDebts(uid(req), req.query.status as string)); } catch (e) { next(e); }
});
router.post('/debts', amount('principal'), body('lenderName').trim().notEmpty(), body('interestType').notEmpty(), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await debtService.createDebt(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.get('/debts/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await debtService.getDebt(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});
router.put('/debts/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await debtService.updateDebt(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.delete('/debts/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await debtService.deleteDebt(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});
router.post('/debts/:id(\\d+)/schedule/:itemId(\\d+)/pay', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await debtService.payScheduleItem(uid(req), Number(req.params.id), Number(req.params.itemId), req.body)); } catch (e) { next(e); }
});
router.post('/debts/:id(\\d+)/schedule/:itemId(\\d+)/unpay', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await debtService.unpayScheduleItem(uid(req), Number(req.params.id), Number(req.params.itemId))); } catch (e) { next(e); }
});

// ─── CSV export ──────────────────────────────────────────────
router.get('/export', async (req, res, next) => {
  try {
    const type = (req.query.type as string) || 'expenses';
    const format = (req.query.format as string) || 'csv';
    if (format !== 'csv') { res.status(400).json({ success: false, message: 'Chỉ hỗ trợ format=csv' }); return; }
    if (type !== 'expenses' && type !== 'all') { res.status(400).json({ success: false, message: 'type phải là expenses hoặc all' }); return; }
    const csv = await expenseService.exportExpensesCsv(uid(req), {
      categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
      walletId: req.query.walletId ? Number(req.query.walletId) : undefined,
      from: req.query.from as string, to: req.query.to as string, search: req.query.search as string,
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="moneyflow-${type}-${Date.now()}.csv"`);
    res.send(csv);
  } catch (e) { next(e); }
});

// ─── Investments ─────────────────────────────────────────────
router.get('/investments/summary', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await investmentService.investmentSummary(uid(req))); } catch (e) { next(e); }
});
router.get('/investments', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await investmentService.listInvestments(uid(req), req.query.type as string)); } catch (e) { next(e); }
});
router.post('/investments', amount(), body('name').trim().notEmpty(), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await investmentService.createInvestment(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.put('/investments/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await investmentService.updateInvestment(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.post('/investments/:id(\\d+)/complete', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await investmentService.completeInvestment(uid(req), Number(req.params.id), req.body?.outcomeNote)); } catch (e) { next(e); }
});
router.post('/investments/:id(\\d+)/sell', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await investmentService.sellInvestment(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.delete('/investments/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await investmentService.deleteInvestment(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});

// ─── Savings: accounts ───────────────────────────────────────
router.get('/savings/summary', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await savingsService.savingsSummary(uid(req))); } catch (e) { next(e); }
});
router.get('/savings/accounts', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await savingsService.listSavingsAccounts(uid(req))); } catch (e) { next(e); }
});
router.post('/savings/accounts', body('bankName').trim().notEmpty(), amount(), body('termMonths').isInt({ gt: 0 }), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await savingsService.createSavingsAccount(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.put('/savings/accounts/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await savingsService.updateSavingsAccount(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.post('/savings/accounts/:id(\\d+)/withdraw', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await savingsService.withdrawSavingsAccount(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.delete('/savings/accounts/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await savingsService.deleteSavingsAccount(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});

// ─── Savings: goals ──────────────────────────────────────────
router.get('/savings/goals', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await savingsService.listSavingsGoals(uid(req))); } catch (e) { next(e); }
});
router.post('/savings/goals', body('name').trim().notEmpty(), amount('targetAmount'), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await savingsService.createSavingsGoal(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.put('/savings/goals/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await savingsService.updateSavingsGoal(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.post('/savings/goals/:id(\\d+)/contribute', amount(), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await savingsService.contributeToGoal(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
});
router.delete('/savings/goals/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await savingsService.deleteSavingsGoal(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});

// ─── Exchange rate (VND↔USD, user-entered, append-only history) ──
router.get('/fx/current', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await fxService.getCurrentFxRate(uid(req))); } catch (e) { next(e); }
});
router.get('/fx/history', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await fxService.listFxRates(uid(req), req.query.page, req.query.limit)); } catch (e) { next(e); }
});
router.post('/fx', amount('vndPerUsd'), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await fxService.setFxRate(uid(req), req.body), 201); } catch (e) { next(e); }
});
router.delete('/fx/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await fxService.deleteFxRate(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});

// ─── Reports ─────────────────────────────────────────────────
router.get('/reports/monthly', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await reportsService.monthlyReport(uid(req), req.query.month as string)); } catch (e) { next(e); }
});
router.get('/reports/yearly', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await reportsService.yearlyReport(uid(req), req.query.year as string)); } catch (e) { next(e); }
});
router.get('/reports/monthly/export', async (req, res, next) => {
  try {
    const csv = await reportsService.monthlyReportCsv(uid(req), req.query.month as string);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="moneyflow-report-${(req.query.month as string) || 'month'}.csv"`);
    res.send(csv);
  } catch (e) { next(e); }
});

// ─── Payoff strategy (snowball vs avalanche) ─────────────────
router.get('/debts/payoff-strategy', async (req, res: Response<ApiResponse>, next) => {
  try {
    const debts = await debtService.listDebts(uid(req));
    const active = debts.filter((d) => d.status !== 'PAID_OFF' && Number(d.computed.remaining) > 0);
    const inputs: PayoffDebt[] = active.map((d) => {
      const rate = Number(d.interestRate);
      const monthlyRatePct = d.interestType === 'DAILY_PERCENT' ? rate * 30 : d.interestType === 'NO_INTEREST' ? 0 : rate;
      const unpaid = (d.schedule ?? []).filter((s) => !s.isPaid);
      const minPayment = unpaid.length ? Number(unpaid[0].amountDue) : Number(d.computed.remaining) * 0.1;
      return { id: d.id, name: d.lenderName, balance: Number(d.computed.remaining), monthlyRatePct, minPayment };
    });
    const extra = req.query.extraMonthly ? Number(req.query.extraMonthly) : 0;
    ok(res, comparePayoff(inputs, extra));
  } catch (e) { next(e); }
});

export default router;
