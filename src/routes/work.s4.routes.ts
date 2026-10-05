/**
 * CT Work — đợt S4 (04/10/2026): TÀI CHÍNH · BÁO CÁO & THUYẾT TRÌNH · XUẤT TRỌN DỰ ÁN. Gắn VÀO
 * work.routes.ts (một dòng `router.use`, sau authenticate + chốt cổng khách), nên mọi tuyến
 * /projects/:pid/** ở đây đã qua `clientPortalRouteAllowed`: khách bị cách ly gọi /finance, /reports,
 * /present, /exports ⇒ 403 CLIENT_PORTAL_ONLY. Khách chỉ có /portal/payments + /portal/reports (đã nằm
 * trong danh sách trắng `/portal/**` — không thêm mẫu tuyến khách nào).
 *
 * Tuyến tải tệp xuất (`/exports/download/:token`) KHÔNG cần đăng nhập — export riêng `s4PublicRoutes`,
 * gắn TRƯỚC authenticate; chỉ tin chữ ký HMAC + hạn 15 phút, rồi 302 sang presigned URL R2.
 *
 * Quyền + mô-đun kiểm trong service — route chỉ kiểm đầu vào bằng zod.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import {
  BUDGET_CATEGORIES, CURRENCIES, EXPENSE_CATEGORIES, PAYMENT_STATUSES, PAYMENT_TRIGGERS, RATE_SCOPES, REPORT_KINDS, TIMESHEET_STATUSES,
} from '../services/work/constants.js';
import * as finance from '../services/work/finance.service.js';
import * as reports from '../services/work/clientReports.service.js';
import * as exportsSvc from '../services/work/projectExport.service.js';
import { portalCtx } from '../services/work/portal.service.js';
import { assertModule } from '../services/work/studio.js';

const router = Router();
export const s4PublicRoutes = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}

const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data });

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      const where = first?.path.length ? `${first.path.join('.')}: ` : '';
      throw new BadRequestError(`${where}${first?.message ?? 'Invalid input'}`, 'VALIDATION_ERROR');
    }
    throw err;
  }
}

const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const money = z.number().finite().min(0).max(1e13);
const text = (max: number) => z.string().max(max).nullable().optional();
const asClient = (req: Request) => req.query.as === 'client';

// ═══ Tài chính (mô-đun finance) ═══════════════════════════════════════

router.get('/projects/:pid/finance/settings', asyncHandler(async (req, res) => {
  ok(res, await finance.getSettings(callerId(req), P(req, 'pid')));
}));
router.put('/projects/:pid/finance/settings', asyncHandler(async (req, res) => {
  const body = parse(z.object({ currency: z.enum(CURRENCIES).optional(), contractValue: money.nullable().optional(), budgetTotal: money.nullable().optional() }), req.body);
  ok(res, await finance.updateSettings(callerId(req), P(req, 'pid'), body));
}));
router.get('/projects/:pid/finance/summary', asyncHandler(async (req, res) => {
  ok(res, await finance.summary(callerId(req), P(req, 'pid')));
}));

const rateBody = {
  scope: z.enum(RATE_SCOPES),
  projectRole: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).nullable().optional(),
  teamId: id.nullable().optional(),
  userId: id.nullable().optional(),
  hourlyRate: z.number().finite().min(0).max(1e9),
  effectiveFrom: ymd.nullable().optional(),
  note: text(200),
};
router.get('/projects/:pid/finance/rates', asyncHandler(async (req, res) => {
  ok(res, await finance.listRates(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/finance/rates', asyncHandler(async (req, res) => {
  ok(res, await finance.createRate(callerId(req), P(req, 'pid'), parse(z.object(rateBody), req.body)), 201);
}));
router.patch('/projects/:pid/finance/rates/:rid', asyncHandler(async (req, res) => {
  ok(res, await finance.updateRate(callerId(req), P(req, 'pid'), P(req, 'rid'), parse(z.object(rateBody).partial(), req.body)));
}));
router.delete('/projects/:pid/finance/rates/:rid', asyncHandler(async (req, res) => {
  ok(res, await finance.deleteRate(callerId(req), P(req, 'pid'), P(req, 'rid')));
}));

router.get('/projects/:pid/finance/timesheet', asyncHandler(async (req, res) => {
  const q = parse(z.object({ week: ymd.optional(), userId: id.optional() }), req.query);
  ok(res, await finance.weekView(callerId(req), P(req, 'pid'), q));
}));
router.get('/projects/:pid/finance/timesheets', asyncHandler(async (req, res) => {
  const q = parse(z.object({ status: z.enum(TIMESHEET_STATUSES).optional(), week: ymd.optional() }), req.query);
  ok(res, await finance.listTimesheets(callerId(req), P(req, 'pid'), q));
}));
router.post('/projects/:pid/finance/timesheets/submit', asyncHandler(async (req, res) => {
  const body = parse(z.object({ weekStart: ymd, note: text(1000) }), req.body);
  ok(res, await finance.submitWeek(callerId(req), P(req, 'pid'), body), 201);
}));
router.post('/projects/:pid/finance/timesheets/:tid/withdraw', asyncHandler(async (req, res) => {
  ok(res, await finance.withdrawWeek(callerId(req), P(req, 'pid'), P(req, 'tid')));
}));
router.post('/projects/:pid/finance/timesheets/:tid/approve', asyncHandler(async (req, res) => {
  ok(res, await finance.approveWeek(callerId(req), P(req, 'pid'), P(req, 'tid')));
}));
router.post('/projects/:pid/finance/timesheets/:tid/return', asyncHandler(async (req, res) => {
  const { reason } = parse(z.object({ reason: z.string().max(2000) }), req.body);
  ok(res, await finance.returnWeek(callerId(req), P(req, 'pid'), P(req, 'tid'), reason));
}));
router.post('/projects/:pid/finance/timesheets/:tid/reopen', asyncHandler(async (req, res) => {
  const { reason } = parse(z.object({ reason: z.string().max(2000) }), req.body);
  ok(res, await finance.reopenWeek(callerId(req), P(req, 'pid'), P(req, 'tid'), reason));
}));

const budgetBody = { name: z.string().min(1, 'Name is required').max(160), category: z.enum(BUDGET_CATEGORIES).optional(), stageId: id.nullable().optional(), amount: money, note: text(500) };
router.post('/projects/:pid/finance/budget-lines', asyncHandler(async (req, res) => {
  ok(res, await finance.createBudgetLine(callerId(req), P(req, 'pid'), parse(z.object(budgetBody), req.body)), 201);
}));
router.patch('/projects/:pid/finance/budget-lines/:bid', asyncHandler(async (req, res) => {
  ok(res, await finance.updateBudgetLine(callerId(req), P(req, 'pid'), P(req, 'bid'), parse(z.object(budgetBody).partial(), req.body)));
}));
router.delete('/projects/:pid/finance/budget-lines/:bid', asyncHandler(async (req, res) => {
  ok(res, await finance.deleteBudgetLine(callerId(req), P(req, 'pid'), P(req, 'bid')));
}));

const expenseBody = {
  spentOn: ymd, category: z.enum(EXPENSE_CATEGORIES).optional(), description: z.string().min(1, 'Description is required').max(500),
  vendor: text(160), amount: money, budgetLineId: id.nullable().optional(), stageId: id.nullable().optional(),
};
router.get('/projects/:pid/finance/expenses', asyncHandler(async (req, res) => {
  ok(res, await finance.listExpenses(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/finance/expenses', asyncHandler(async (req, res) => {
  ok(res, await finance.createExpense(callerId(req), P(req, 'pid'), parse(z.object(expenseBody), req.body)), 201);
}));
router.patch('/projects/:pid/finance/expenses/:eid', asyncHandler(async (req, res) => {
  ok(res, await finance.updateExpense(callerId(req), P(req, 'pid'), P(req, 'eid'), parse(z.object(expenseBody).partial(), req.body)));
}));
router.delete('/projects/:pid/finance/expenses/:eid', asyncHandler(async (req, res) => {
  ok(res, await finance.deleteExpense(callerId(req), P(req, 'pid'), P(req, 'eid')));
}));

const paymentBody = {
  name: z.string().min(1, 'Name is required').max(160), percent: z.number().finite().gt(0).max(100).nullable().optional(), amount: money.nullable().optional(),
  trigger: z.enum(PAYMENT_TRIGGERS).optional(), versionId: id.nullable().optional(), stageId: id.nullable().optional(),
  dueDate: ymd.nullable().optional(), clientVisible: z.boolean().optional(), note: text(1000),
};
router.get('/projects/:pid/finance/payments', asyncHandler(async (req, res) => {
  ok(res, await finance.listPayments(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/finance/payments', asyncHandler(async (req, res) => {
  ok(res, await finance.createPayment(callerId(req), P(req, 'pid'), parse(z.object(paymentBody), req.body)), 201);
}));
router.patch('/projects/:pid/finance/payments/:num', asyncHandler(async (req, res) => {
  ok(res, await finance.updatePayment(callerId(req), P(req, 'pid'), P(req, 'num'), parse(z.object(paymentBody).partial(), req.body)));
}));
router.delete('/projects/:pid/finance/payments/:num', asyncHandler(async (req, res) => {
  ok(res, await finance.deletePayment(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.post('/projects/:pid/finance/payments/:num/status', asyncHandler(async (req, res) => {
  const body = parse(z.object({ status: z.enum(PAYMENT_STATUSES), invoiceNumber: text(80) }), req.body);
  ok(res, await finance.setPaymentStatus(callerId(req), P(req, 'pid'), P(req, 'num'), body));
}));
router.get('/projects/:pid/finance/export.xlsx', asyncHandler(async (req, res) => {
  const f = await finance.accountingXlsx(callerId(req), P(req, 'pid'));
  res.set({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename="${f.file.replace(/[^A-Za-z0-9._-]/g, '_')}"`,
    'Cache-Control': 'private, no-store',
  });
  res.send(f.buffer);
}));

// ═══ Báo cáo & thuyết trình (mô-đun reports) ═════════════════════════

const scheduleBody = z.object({
  enabled: z.boolean().optional(), weekday: z.number().int().min(1).max(7).optional(), hour: z.number().int().min(0).max(23).optional(),
  timezone: z.string().min(1).max(64).optional(), includeRisks: z.boolean().optional(), includeChanges: z.boolean().optional(),
  // CTW-3: bật lần đầu phải xác nhận (đã xem trước bản khách nhận).
  confirm: z.boolean().optional(),
});
const period = z.object({ from: ymd.optional(), to: ymd.optional() });

router.get('/projects/:pid/reports/client-weekly/schedule', asyncHandler(async (req, res) => {
  ok(res, await reports.getSchedule(callerId(req), P(req, 'pid')));
}));
router.put('/projects/:pid/reports/client-weekly/schedule', asyncHandler(async (req, res) => {
  ok(res, await reports.updateSchedule(callerId(req), P(req, 'pid'), parse(scheduleBody, req.body)));
}));
router.get('/projects/:pid/reports/client-weekly/preview', asyncHandler(async (req, res) => {
  ok(res, await reports.previewClientWeekly(callerId(req), P(req, 'pid'), parse(period, req.query)));
}));
router.post('/projects/:pid/reports/client-weekly/send', asyncHandler(async (req, res) => {
  const body = parse(period.extend({ bodyMarkdown: text(50_000), aiPolished: z.boolean().optional() }), req.body ?? {});
  ok(res, await reports.sendClientWeekly(callerId(req), P(req, 'pid'), body), 201);
}));
router.post('/projects/:pid/reports/client-weekly/polish', asyncHandler(async (req, res) => {
  // CTW-8: language tuỳ chọn; thiếu ⇒ theo ngôn ngữ dự án.
  ok(res, await reports.polishClientReport(callerId(req), P(req, 'pid'), parse(z.object({ language: z.enum(['en', 'vi']).optional() }), req.body ?? {})));
}));
router.get('/projects/:pid/reports/history', asyncHandler(async (req, res) => {
  const q = parse(z.object({ kind: z.enum(REPORT_KINDS).optional() }), req.query);
  ok(res, await reports.listReports(callerId(req), P(req, 'pid'), q));
}));
router.get('/projects/:pid/reports/history/:rid', asyncHandler(async (req, res) => {
  ok(res, await reports.getReport(callerId(req), P(req, 'pid'), P(req, 'rid')));
}));
router.get('/projects/:pid/reports/steering', asyncHandler(async (req, res) => {
  ok(res, await reports.steeringReport(callerId(req), P(req, 'pid'), parse(period, req.query)));
}));
router.get('/projects/:pid/present', asyncHandler(async (req, res) => {
  const q = parse(period.extend({ mode: z.enum(['client', 'internal']).optional() }), req.query);
  ok(res, await reports.presentData(callerId(req), P(req, 'pid'), q));
}));

// ═══ Xuất trọn dự án (ADMIN) ════════════════════════════════════════

router.get('/projects/:pid/exports', asyncHandler(async (req, res) => {
  ok(res, await exportsSvc.listExports(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/exports', asyncHandler(async (req, res) => {
  ok(res, await exportsSvc.startExport(callerId(req), P(req, 'pid'), exportsSvc.assertExportInput(req.body)), 202);
}));
router.get('/projects/:pid/exports/:eid', asyncHandler(async (req, res) => {
  ok(res, await exportsSvc.getExport(callerId(req), P(req, 'pid'), P(req, 'eid')));
}));
router.post('/projects/:pid/exports/:eid/link', asyncHandler(async (req, res) => {
  ok(res, await exportsSvc.downloadLink(callerId(req), P(req, 'pid'), P(req, 'eid')));
}));

s4PublicRoutes.get('/exports/download/:token', asyncHandler(async (req, res) => {
  // Kiểm chữ ký + ADMIN rồi chuyển hướng sang presigned URL R2 hạn ngắn — tệp không đi qua máy chủ.
  const { url } = await exportsSvc.resolveDownload(String(req.params.token));
  res.set('Cache-Control', 'private, no-store');
  res.redirect(302, url);
}));

// ═══ Cổng khách: mốc thanh toán đã chia sẻ + lịch sử báo cáo tuần ════

router.get('/projects/:pid/portal/payments', asyncHandler(async (req, res) => {
  const ctx = await portalCtx(callerId(req), P(req, 'pid'), { asClient: asClient(req) });
  ok(res, ctx.access.modules.finance ? { enabled: true, ...(await finance.portalPayments(ctx.access.projectId)) } : { enabled: false, currency: null, items: [] });
}));
router.get('/projects/:pid/portal/reports', asyncHandler(async (req, res) => {
  const ctx = await portalCtx(callerId(req), P(req, 'pid'), { asClient: asClient(req) });
  ok(res, ctx.access.modules.reports ? { enabled: true, items: await reports.portalReports(ctx.access.projectId) } : { enabled: false, items: [] });
}));
router.get('/projects/:pid/portal/reports/:rid', asyncHandler(async (req, res) => {
  const ctx = await portalCtx(callerId(req), P(req, 'pid'), { asClient: asClient(req) });
  assertModule(ctx.access, 'reports');
  ok(res, await reports.portalReport(ctx.access.projectId, P(req, 'rid')));
}));

export default router;
