/**
 * Landing page — public promo feed + admin CRUD.
 *   GET  /api/v1/landing/promos          — active promos for the marquee (public)
 *   GET  /api/v1/admin/landing/promos    — all promos (admin)
 *   POST /api/v1/admin/landing/promos    — create
 *   PUT  /api/v1/admin/landing/promos/:id
 *   DELETE /api/v1/admin/landing/promos/:id
 *   POST /api/v1/admin/landing/promos/reorder  — { ids: number[] }
 */
import { Router, type Request, type Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import * as svc from '../services/landingPromo.service.js';

const router = Router();
const adminRouter = Router();

function toId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw Object.assign(new Error('id không hợp lệ'), { statusCode: 400 });
  return id;
}

// ── Public ──
router.get('/promos', async (_req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.listActivePromos() }); } catch (e) { next(e); }
});

// ── Admin (gated) ──
adminRouter.use(authenticate, requireRole('ADMIN'));

adminRouter.get('/promos', async (_req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.listAllPromos() }); } catch (e) { next(e); }
});

adminRouter.post('/promos', async (req, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await svc.createPromo(req.body ?? {}) }); } catch (e) { next(e); }
});

adminRouter.post('/promos/reorder', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.reorderPromos(req.body?.ids) }); } catch (e) { next(e); }
});

adminRouter.put('/promos/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.updatePromo(toId(req), req.body ?? {}) }); } catch (e) { next(e); }
});

adminRouter.delete('/promos/:id', async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.deletePromo(toId(req)) }); } catch (e) { next(e); }
});

export default router;
export { adminRouter };
