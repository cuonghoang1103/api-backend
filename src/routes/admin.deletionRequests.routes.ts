/**
 * Admin routes for account erasure requests (added 2026-08-08).
 * Mounted under /api/v1/admin/deletion-requests by src/index.ts.
 *
 * Every endpoint is admin-only. Approving a request is the single path in
 * the codebase that erases a live account, so the guard is applied at the
 * router level (not per-route) — a new endpoint added here is protected by
 * default rather than by remembering to add the middleware.
 *
 * Endpoints:
 *   GET  /                 — queue (PENDING first), cursor-paginated
 *   GET  /stats            — counters for the admin badge
 *   POST /:id/approve      — anonymise the account (irreversible)
 *   POST /:id/reject       — decline, with a note back to the user
 */

import { Router, type Response, type Request, type NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  listRequests,
  requestStats,
  approve,
  reject,
} from '../services/accountDeletion.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

router.use(authenticate, requireAdmin('ROLE_ADMIN'));

function parseId(raw: string): number {
  const id = parseInt(raw, 10);
  if (!Number.isFinite(id) || id <= 0) {
    throw new AppError('Invalid request id', 400, 'INVALID_ID');
  }
  return id;
}

// GET /api/v1/admin/deletion-requests?status=PENDING&cursor=<id>&take=<n>
router.get('/', async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const result = await listRequests({
      status: req.query.status ? String(req.query.status) : undefined,
      cursor: req.query.cursor ? parseInt(String(req.query.cursor), 10) : undefined,
      take: req.query.take ? parseInt(String(req.query.take), 10) : undefined,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/deletion-requests/stats
router.get('/stats', async (_req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.json({ success: true, data: await requestStats() });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/deletion-requests/:id/approve
// IRREVERSIBLE — anonymises the user. The service anonymises first and
// only then stamps APPROVED, so a failure leaves the request PENDING
// rather than marking an account erased that is still live.
router.post('/:id/approve', async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const request = await approve(parseId(req.params.id), req.user.userId, req.body?.note);
    res.json({ success: true, data: { request }, message: 'Đã duyệt và ẩn danh hoá tài khoản.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/deletion-requests/:id/reject
router.post('/:id/reject', async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const request = await reject(parseId(req.params.id), req.user.userId, req.body?.note);
    res.json({ success: true, data: { request }, message: 'Đã từ chối yêu cầu.' });
  } catch (error) {
    next(error);
  }
});

export default router;
