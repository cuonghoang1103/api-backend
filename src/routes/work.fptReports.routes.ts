/**
 * CT Work đợt 3B (09/10/2026) — báo cáo Excel nộp trường theo mẫu FPT.
 * Gắn VÀO work.routes.ts (một dòng `router.use` ở cuối, sau authenticate + chốt cổng khách) ⇒ khách bị cách ly ⇒ 403.
 *
 *   Môn học:   GET/PUT /projects/:pid/fpt-reports/doc               (mã môn, lớp, GV, nhóm, tuần 1, danh sách SV)
 *   WBS (A3):  GET     /projects/:pid/wbs                           (cây 1.0/1.1…, effort dự kiến/thực tế, tổng theo iteration)
 *              PUT     /projects/:pid/wbs/matrix                    (bảng quy đổi Simple/Medium/Complex → man-day; ADMIN)
 *              PUT     /projects/:pid/wbs/items/:num                (thuộc tính WBS của một thẻ)
 *              GET     /projects/:pid/wbs/export                    (.xlsx sheet WBS đúng mẫu SEP490)
 *   Weekly (A21): GET/POST /projects/:pid/fpt-reports/weekly · GET …/weekly/preview?week=YYYY-MM-DD
 *              GET/PUT/DELETE …/weekly/:id · POST …/weekly/:id/refresh · GET …/weekly/export[?ids=1,2]
 *   AI usage (A29): GET/POST /projects/:pid/fpt-reports/ai-usage · POST …/ai-usage/sync
 *              PATCH/DELETE …/ai-usage/:id · GET …/ai-usage/export
 *   (Project Tracking SEP490 / SWP391 Template1 / Template4: GET /projects/:pid/export/project-tracking?variant=… ở work.routes.ts)
 *
 * Quyền kiểm TRONG service (fptReports.service) — route chỉ kiểm đầu vào.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as rep from '../services/work/fptReports.service.js';

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const ok = (r: Response, data: unknown, status = 200) => r.status(status).json({ success: true, data });

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      const where = first?.path.length ? `${first.path.join('.')}: ` : '';
      throw new AppError(`${where}${first?.message ?? 'Invalid input'}`, 400, 'VALIDATION_ERROR', { errors: err.issues.slice(0, 20).map((i) => ({ path: i.path.join('.'), message: i.message })) });
    }
    throw err;
  }
}

const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const R = '/projects/:pid/fpt-reports';
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

function sendXlsx(res: Response, out: { file: string; buffer: Buffer }) {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.file)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buffer);
}

// ─── Thông tin môn học / nhóm ────────────────────────────────────
router.get(`${R}/doc`, asyncHandler(async (req, res) => ok(res, await rep.getReportDoc(callerId(req), P(req, 'pid')))));
router.put(`${R}/doc`, asyncHandler(async (req, res) => ok(res, await rep.updateReportDoc(callerId(req), P(req, 'pid'), parse(rep.reportDocInput, req.body)))));

// ─── WBS ─────────────────────────────────────────────────────────
router.get('/projects/:pid/wbs/export', asyncHandler(async (req, res) => sendXlsx(res, await rep.exportWbs(callerId(req), P(req, 'pid')))));
router.get('/projects/:pid/wbs', asyncHandler(async (req, res) => ok(res, await rep.getWbs(callerId(req), P(req, 'pid')))));
router.put('/projects/:pid/wbs/matrix', asyncHandler(async (req, res) => ok(res, await rep.updateMatrix(callerId(req), P(req, 'pid'), parse(rep.matrixInput, req.body)))));
router.put('/projects/:pid/wbs/items/:num', asyncHandler(async (req, res) => {
  const body = parse(rep.wbsItemInput, req.body);
  if (!Object.keys(body).length) throw new BadRequestError('Nothing to change', 'VALIDATION_ERROR');
  ok(res, await rep.updateWbsItem(callerId(req), P(req, 'pid'), P(req, 'num'), body));
}));

// ─── Weekly Report ───────────────────────────────────────────────
router.get(`${R}/weekly/export`, asyncHandler(async (req, res) => {
  const q = parse(z.object({ ids: z.string().regex(/^\d+(,\d+)*$/).optional() }), req.query);
  sendXlsx(res, await rep.exportWeekly(callerId(req), P(req, 'pid'), q.ids?.split(',').map(Number).slice(0, 60)));
}));
router.get(`${R}/weekly/preview`, asyncHandler(async (req, res) => {
  const q = parse(z.object({ week: day }), req.query);
  ok(res, await rep.previewWeekly(callerId(req), P(req, 'pid'), q.week));
}));
router.get(`${R}/weekly`, asyncHandler(async (req, res) => ok(res, await rep.listWeekly(callerId(req), P(req, 'pid')))));
router.post(`${R}/weekly`, asyncHandler(async (req, res) => {
  const body = parse(z.object({ weekStart: day }), req.body);
  ok(res, await rep.createWeekly(callerId(req), P(req, 'pid'), body.weekStart), 201);
}));
router.get(`${R}/weekly/:id`, asyncHandler(async (req, res) => ok(res, await rep.getWeekly(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.put(`${R}/weekly/:id`, asyncHandler(async (req, res) => ok(res, await rep.updateWeekly(callerId(req), P(req, 'pid'), P(req, 'id'), parse(rep.weeklyUpdateInput, req.body)))));
router.post(`${R}/weekly/:id/refresh`, asyncHandler(async (req, res) => ok(res, await rep.refreshWeekly(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.delete(`${R}/weekly/:id`, asyncHandler(async (req, res) => {
  await rep.deleteWeekly(callerId(req), P(req, 'pid'), P(req, 'id'));
  ok(res, { deleted: true });
}));

// ─── AI Usage Report ─────────────────────────────────────────────
router.get(`${R}/ai-usage/export`, asyncHandler(async (req, res) => sendXlsx(res, await rep.exportAiUsage(callerId(req), P(req, 'pid')))));
router.get(`${R}/ai-usage`, asyncHandler(async (req, res) => ok(res, await rep.listAiUsage(callerId(req), P(req, 'pid')))));
router.post(`${R}/ai-usage/sync`, asyncHandler(async (req, res) => ok(res, await rep.syncAiUsage(callerId(req), P(req, 'pid')))));
router.post(`${R}/ai-usage`, asyncHandler(async (req, res) => ok(res, await rep.createAiUsage(callerId(req), P(req, 'pid'), parse(rep.aiUsageInput, req.body)), 201)));
router.patch(`${R}/ai-usage/:id`, asyncHandler(async (req, res) => {
  const body = parse(rep.aiUsageInput.partial(), req.body);
  if (!Object.keys(body).length) throw new BadRequestError('Nothing to change', 'VALIDATION_ERROR');
  ok(res, await rep.updateAiUsage(callerId(req), P(req, 'pid'), P(req, 'id'), body));
}));
router.delete(`${R}/ai-usage/:id`, asyncHandler(async (req, res) => {
  await rep.deleteAiUsage(callerId(req), P(req, 'pid'), P(req, 'id'));
  ok(res, { deleted: true });
}));

export default router;
