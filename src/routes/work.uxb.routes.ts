/**
 * CT Work UX-B (10/10/2026) — báo cáo dòng chảy + KPI dự án + dashboard "Project overview".
 * Mọi tuyến sau authenticate; quyền `project.view` trong flowReports.service. Khách bị cách ly không có các tuyến
 * này trong danh sách trắng cổng khách ⇒ 403 CLIENT_PORTAL_ONLY trước khi tới đây.
 *
 *   GET  /projects/:pid/reports/cfd?days=30            cumulative flow theo dải trạng thái (dựng lại từ lịch sử)
 *   GET  /projects/:pid/reports/cycle-time?days=90     scatter cycle/lead time + P50/P85/P95
 *   GET  /projects/:pid/reports/throughput?weeks=12    số thẻ (và điểm) xong mỗi tuần
 *   GET  /projects/:pid/reports/aging-wip              tuổi việc đang làm + mốc P50/P85 cycle time
 *   GET  /projects/:pid/reports/release-burnup?versionId=&by=count|estimate
 *   GET  /projects/:pid/reports/load-by-person         việc mở theo người (widget "workload")
 *   GET  /projects/:pid/reports/kpis                   hàng KPI có xu hướng 7 ngày
 *   POST /projects/:pid/dashboards/overview            tạo (hoặc trả lại) dashboard "Project overview"
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as flow from '../services/work/flowReports.service.js';
import { ensureOverviewDashboard } from '../services/work/search.service.js';

const router = Router();

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
      throw new BadRequestError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const pid = (req: Request) => parse(id, req.params.pid);

router.get('/projects/:pid/reports/cfd', asyncHandler(async (req, res) => {
  const q = parse(z.object({ days: z.coerce.number().int().min(7).max(180).optional() }), req.query);
  ok(res, await flow.cfd(callerId(req), pid(req), q));
}));
router.get('/projects/:pid/reports/cycle-time', asyncHandler(async (req, res) => {
  const q = parse(z.object({ days: z.coerce.number().int().min(14).max(365).optional() }), req.query);
  ok(res, await flow.cycleTime(callerId(req), pid(req), q));
}));
router.get('/projects/:pid/reports/throughput', asyncHandler(async (req, res) => {
  const q = parse(z.object({ weeks: z.coerce.number().int().min(4).max(52).optional() }), req.query);
  ok(res, await flow.throughput(callerId(req), pid(req), q));
}));
router.get('/projects/:pid/reports/aging-wip', asyncHandler(async (req, res) => {
  ok(res, await flow.agingWip(callerId(req), pid(req)));
}));
router.get('/projects/:pid/reports/release-burnup', asyncHandler(async (req, res) => {
  const q = parse(z.object({ versionId: id, by: z.enum(['count', 'estimate']).optional() }), req.query);
  ok(res, await flow.releaseBurnup(callerId(req), pid(req), q.versionId, { by: q.by }));
}));
router.get('/projects/:pid/reports/load-by-person', asyncHandler(async (req, res) => {
  ok(res, await flow.loadByPerson(callerId(req), pid(req)));
}));
router.get('/projects/:pid/reports/kpis', asyncHandler(async (req, res) => {
  ok(res, await flow.projectKpis(callerId(req), pid(req)));
}));
router.post('/projects/:pid/dashboards/overview', asyncHandler(async (req, res) => {
  ok(res, await ensureOverviewDashboard(callerId(req), pid(req)), 201);
}));

export default router;
