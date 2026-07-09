/**
 * ============================================================
 * Quota Routes — Get current user quota status
 *
 * Endpoints:
 *   GET  /api/v1/quota/me           — current user's quota
 *   GET  /api/v1/quota/aggregate    — admin: aggregate stats
 *   POST /api/v1/quota/reset/:userId — admin: reset user quota
 * ============================================================
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  getQuotaStatus,
  resetUserQuota,
  getAggregateQuota,
} from '../services/quota.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /me — current user quota ────────────────────────
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const status = await getQuotaStatus(userId);
    const response: ApiResponse = {
      success: true,
      data: status,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// ─── GET /aggregate — admin only ─────────────────────────
router.get('/aggregate', authenticate, requireAdmin(), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getAggregateQuota();
    const response: ApiResponse = {
      success: true,
      data: stats,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// ─── POST /reset/:userId — admin only ────────────────────
router.post('/reset/:userId', authenticate, requireAdmin(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const scope = (req.body?.scope || 'all') as 'minute' | 'day' | 'month' | 'all';
    if (!['minute', 'day', 'month', 'all'].includes(scope)) {
      throw new AppError(`Invalid scope: ${scope}`, 400, 'INVALID_SCOPE');
    }
    await resetUserQuota(userId, scope);
    const response: ApiResponse = {
      success: true,
      data: { userId, scope, reset: true },
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
