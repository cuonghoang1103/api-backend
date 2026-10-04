/**
 * CT Work — Portfolio + Workload (đợt S3a, 04/10/2026). Gắn VÀO work.routes.ts
 * (sau authenticate), nên mọi tuyến ở đây đã có người gọi. Quyền kiểm trong
 * services/work/portfolio.service.ts — route chỉ kiểm đầu vào.
 *
 *   GET /api/v1/work/workspaces/:wsId/portfolio?includeArchived=true
 *   GET /api/v1/work/workspaces/:wsId/workload?from&to&teamId&projectId&hoursPerPoint
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import { portfolio, workload } from '../services/work/portfolio.service.js';

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}

const ok = (res: Response, data: unknown) => res.status(200).json({ success: true, data });

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
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

router.get('/workspaces/:wsId/portfolio', asyncHandler(async (req, res) => {
  const q = parse(z.object({ includeArchived: z.enum(['true', 'false']).optional() }), req.query);
  ok(res, await portfolio(callerId(req), parse(id, req.params.wsId), { includeArchived: q.includeArchived === 'true' }));
}));

router.get('/workspaces/:wsId/workload', asyncHandler(async (req, res) => {
  const q = parse(z.object({
    from: day.optional(),
    to: day.optional(),
    teamId: id.optional(),
    projectId: id.optional(),
    hoursPerPoint: z.coerce.number().min(0.5).max(40).optional(),
  }).refine((v) => !v.from || !v.to || (Date.parse(v.to) - Date.parse(v.from)) / 86_400_000 <= 26 * 7, 'The range can be at most 26 weeks'), req.query);
  ok(res, await workload(callerId(req), parse(id, req.params.wsId), q));
}));

export default router;
