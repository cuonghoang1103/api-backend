/**
 * CT Work — đợt S6 (05/10/2026): SPEC FIDELITY + nguồn gốc AI. Gắn VÀO work.routes.ts (một dòng `router.use` ở cuối,
 * sau authenticate + chốt cổng khách) ⇒ khách cổng bị cách ly gọi ⇒ 403 CLIENT_PORTAL_ONLY (không thêm mẫu tuyến khách).
 *
 *   - Chấm:      POST /projects/:pid/spec-reviews/page/:num  { semantic? }
 *                POST /projects/:pid/spec-reviews/issues     { epicNumber?, stageId?, semantic? }
 *   - Lịch sử:   GET  /projects/:pid/spec-reviews?page=&scope=&stage=&epic=&limit=  · GET /projects/:pid/spec-reviews/:rid
 *   - Gợi ý:     POST /projects/:pid/spec-reviews/:rid/findings/:fid/apply { rewrite? }
 *                POST /projects/:pid/spec-reviews/:rid/findings/:fid/dismiss { dismissed }
 *   - Cấu hình:  GET/PUT /projects/:pid/spec-settings  (cổng Spec Fidelity + luật "AI-assisted needs an independent reviewer")
 *   - Cổng:      GET  /projects/:pid/stages/:sid/spec-gate
 *
 * Quyền + mô-đun kiểm TRONG service (specReview.service) — route chỉ kiểm đầu vào.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as spec from '../services/work/specReview.service.js';

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
      const where = first?.path.length ? `${first.path.join('.')}: ` : '';
      throw new BadRequestError(`${where}${first?.message ?? 'Invalid input'}`, 'VALIDATION_ERROR');
    }
    throw err;
  }
}

const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const fid = (req: Request) => parse(z.string().regex(/^[ar]\d{1,4}$/), req.params.fid);

router.post('/projects/:pid/spec-reviews/page/:num', asyncHandler(async (req, res) => {
  const body = parse(z.object({ semantic: z.boolean().optional() }), req.body ?? {});
  ok(res, await spec.reviewPage(callerId(req), P(req, 'pid'), P(req, 'num'), body), 201);
}));
router.post('/projects/:pid/spec-reviews/issues', asyncHandler(async (req, res) => {
  const body = parse(z.object({ epicNumber: id.nullable().optional(), stageId: id.nullable().optional(), semantic: z.boolean().optional() }), req.body ?? {});
  ok(res, await spec.reviewIssues(callerId(req), P(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/spec-reviews', asyncHandler(async (req, res) => {
  const q = parse(z.object({
    page: id.optional(), scope: z.enum(['PAGE', 'ISSUES']).optional(), stage: id.optional(), epic: id.optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }), req.query);
  ok(res, await spec.listReviews(callerId(req), P(req, 'pid'), { pageNumber: q.page, scope: q.scope, stageId: q.stage, epicNumber: q.epic, limit: q.limit }));
}));
router.get('/projects/:pid/spec-reviews/:rid', asyncHandler(async (req, res) => {
  ok(res, await spec.getReview(callerId(req), P(req, 'pid'), P(req, 'rid')));
}));
router.post('/projects/:pid/spec-reviews/:rid/findings/:fid/apply', asyncHandler(async (req, res) => {
  const body = parse(z.object({ rewrite: z.string().min(1).max(4000).nullable().optional() }), req.body ?? {});
  ok(res, await spec.applyFinding(callerId(req), P(req, 'pid'), P(req, 'rid'), fid(req), body));
}));
router.post('/projects/:pid/spec-reviews/:rid/findings/:fid/dismiss', asyncHandler(async (req, res) => {
  const body = parse(z.object({ dismissed: z.boolean().default(true) }), req.body ?? {});
  ok(res, await spec.setFindingDismissed(callerId(req), P(req, 'pid'), P(req, 'rid'), fid(req), body.dismissed));
}));

router.get('/projects/:pid/spec-settings', asyncHandler(async (req, res) => {
  ok(res, await spec.getSettings(callerId(req), P(req, 'pid')));
}));
router.put('/projects/:pid/spec-settings', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    specGate: z.object({
      enabled: z.boolean().optional(),
      stageIds: z.array(id).max(20).optional(),
      minOverall: z.number().int().min(0).max(100).optional(),
      minDimension: z.number().int().min(0).max(100).optional(),
    }).optional(),
    aiReview: z.object({ requireIndependentReviewer: z.boolean() }).optional(),
  }), req.body ?? {});
  ok(res, await spec.updateSettings(callerId(req), P(req, 'pid'), body));
}));
router.get('/projects/:pid/stages/:sid/spec-gate', asyncHandler(async (req, res) => {
  ok(res, await spec.stageGateStatus(callerId(req), P(req, 'pid'), P(req, 'sid')));
}));

export default router;
