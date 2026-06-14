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
 * ============================================================
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  listJobs,
  getJobStats,
  enqueueJob,
  flushQueue,
} from '../services/embedQueue.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET / — list recent jobs ───────────────────────────
router.get('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
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
router.get('/stats', authenticate, requireAdmin, async (_req: Request, res: Response, next: NextFunction) => {
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
router.post('/flush', authenticate, requireAdmin, async (_req: Request, res: Response, next: NextFunction) => {
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
router.post('/reembed', authenticate, requireAdmin, async (_req: Request, res: Response, next: NextFunction) => {
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
router.post('/cleanup', authenticate, requireAdmin, async (_req: Request, res: Response, next: NextFunction) => {
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
