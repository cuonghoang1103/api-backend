/**
 * CT Work UX-C (11/10/2026) — Team overview, mốc + baseline của Timeline, kéo-thả WBS.
 * Mọi tuyến sau authenticate; quyền kiểm trong uxc.service (requireProject). Khách bị cách ly không có các tuyến này
 * trong danh sách trắng cổng khách ⇒ 403 CLIENT_PORTAL_ONLY trước khi tới đây.
 *
 *   GET    /projects/:pid/team-overview                    ai đang làm gì, tải, trễ, kẹt, review, họp, hồ sơ, Q&A
 *   GET    /projects/:pid/timeline/markers                 sprint / version / giai đoạn trên trục Timeline
 *   GET    /projects/:pid/timeline/baselines               danh sách baseline
 *   POST   /projects/:pid/timeline/baselines               { name, note? } chụp kế hoạch hiện tại
 *   GET    /projects/:pid/timeline/baselines/:bid/compare  so baseline với hiện tại
 *   DELETE /projects/:pid/timeline/baselines/:bid
 *   PUT    /projects/:pid/wbs/items/:num/move              { parentNumber, beforeNumber?, afterNumber?, version? }
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as uxc from '../services/work/uxc.service.js';

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

router.get('/projects/:pid/team-overview', asyncHandler(async (req, res) => {
  ok(res, await uxc.teamOverview(callerId(req), pid(req)));
}));

router.get('/projects/:pid/timeline/markers', asyncHandler(async (req, res) => {
  ok(res, await uxc.timelineMarkers(callerId(req), pid(req)));
}));
router.get('/projects/:pid/timeline/baselines', asyncHandler(async (req, res) => {
  ok(res, await uxc.listBaselines(callerId(req), pid(req)));
}));
router.post('/projects/:pid/timeline/baselines', asyncHandler(async (req, res) => {
  const body = parse(z.object({ name: z.string().trim().min(1).max(120), note: z.string().max(500).nullable().optional() }), req.body);
  ok(res, await uxc.createBaseline(callerId(req), pid(req), body), 201);
}));
router.get('/projects/:pid/timeline/baselines/:bid/compare', asyncHandler(async (req, res) => {
  ok(res, await uxc.compareWithBaseline(callerId(req), pid(req), parse(id, req.params.bid)));
}));
router.delete('/projects/:pid/timeline/baselines/:bid', asyncHandler(async (req, res) => {
  ok(res, await uxc.deleteBaseline(callerId(req), pid(req), parse(id, req.params.bid)));
}));

router.put('/projects/:pid/wbs/items/:num/move', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    parentNumber: id.nullable(),
    beforeNumber: id.nullable().optional(),
    afterNumber: id.nullable().optional(),
    version: z.number().int().min(0).optional(),
  }), req.body);
  ok(res, await uxc.moveWbsItem(callerId(req), pid(req), parse(id, req.params.num), body));
}));

export default router;
