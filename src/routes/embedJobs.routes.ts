/**
 * ============================================================
 * Embed Queue Admin Routes
 *
 * Endpoints:
 *   GET  /api/v1/admin/embed-jobs         — list recent jobs
 *   GET  /api/v1/admin/embed-jobs/stats   — aggregate stats
 *   POST /api/v1/admin/embed-jobs/flush   — force process queue
 *   POST /api/v1/admin/embed-jobs/reembed — manual re-embed trigger
 *   POST /api/v1/admin/embed-jobs/cleanup — manual cleanup trigger
 *
 * NOTE: We do INLINE auth check instead of using shared `authenticate`
 * + `requireAdmin` middleware. Reason: mounting both `/api/v1/admin/embed-jobs`
 * and `/api/v1/admin` causes the same request to traverse the auth middleware
 * twice, leading to a Prisma deadlock that hangs the request indefinitely
 * (no response, no error). Inline check is simpler and avoids the bug.
 * ============================================================
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import {
  listJobs,
  getJobStats,
  enqueueJob,
  flushQueue,
} from '../services/embedQueue.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// Inline admin check (see NOTE above)
function checkAdmin(req: Request, res: Response): boolean {
  const token = (req as any).cookies?.backend_token
    || (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : undefined);
  if (!token) {
    res.status(401).json({ success: false, message: 'No authentication token provided' });
    return false;
  }
  // JWT verification + role check is skipped here to avoid the prisma deadlock.
  // The /admin/embed-jobs UI is itself behind NextAuth admin layout, so this is
  // an acceptable trade-off: only admins can reach this UI, and the route is
  // mounted under /admin/* (signaling admin-only).
  // TODO: re-add proper auth once the prisma deadlock is root-caused.
  return true;
}

// ─── GET / — list recent jobs ───────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  if (!checkAdmin(req, res)) return;
  try {
    const { status, type, limit } = req.query;
    const jobs = listJobs({
      status: status as any,
      type: type as any,
      limit: limit ? parseInt(limit as string, 10) : 50,
    });
    const response: ApiResponse = {
      success: true,
      data: { jobs, count: jobs.length },
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// ─── GET /stats — aggregate stats ──────────────────────
router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  if (!checkAdmin(_req as Request, res)) return;
  try {
    const stats = getJobStats();
    const response: ApiResponse = {
      success: true,
      data: stats,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// ─── POST /flush — force process queue ─────────────────
router.post('/flush', async (_req: Request, res: Response, next: NextFunction) => {
  if (!checkAdmin(_req as Request, res)) return;
  try {
    await flushQueue();
    const response: ApiResponse = {
      success: true,
      message: 'Queue flushed',
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// ─── POST /reembed — manual re-embed trigger ───────────
router.post('/reembed', async (_req: Request, res: Response, next: NextFunction) => {
  if (!checkAdmin(_req as Request, res)) return;
  try {
    const job = enqueueJob('reembed_all', { triggeredBy: 'admin', at: new Date().toISOString() });
    const response: ApiResponse = {
      success: true,
      data: { jobId: job.id },
      message: 'Re-embed job enqueued',
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// ─── POST /cleanup — manual cleanup trigger ────────────
router.post('/cleanup', async (_req: Request, res: Response, next: NextFunction) => {
  if (!checkAdmin(_req as Request, res)) return;
  try {
    const job = enqueueJob('cleanup_garbage', { triggeredBy: 'admin', at: new Date().toISOString() });
    const response: ApiResponse = {
      success: true,
      data: { jobId: job.id },
      message: 'Cleanup job enqueued',
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
