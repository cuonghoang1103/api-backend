import { Router, type Response, type Request, type NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { messagingSafetyService } from '../services/messaging-safety.service.js';
import type { ApiResponse } from '../types/index.js';

/**
 * Admin routes for the messaging safety system (block + report).
 * Mounted under /api/v1/admin/reports by src/index.ts.
 *
 * Auth: the parent mount applies NO middleware, so we guard every
 * endpoint here — an authenticated admin is required for all of them.
 * (Previously this router relied on a non-existent "upstream" guard,
 * leaving the report queue + resolve action fully unauthenticated.)
 */
const router = Router();

router.use(authenticate, requireAdmin('ROLE_ADMIN'));

// GET /api/v1/admin/reports?status=open|resolved&cursor=<id>&take=<n>
// Returns the thread-report queue. Default take=30, max=50.
// Sorted: open first (newest), then resolved (newest).
router.get('/', async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const cursor = req.query.cursor ? parseInt(String(req.query.cursor), 10) : undefined;
    const take = req.query.take ? parseInt(String(req.query.take), 10) : undefined;
    const status = req.query.status as 'open' | 'resolved' | undefined;
    const result = await messagingSafetyService.listReports({ cursor, take, status });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/reports/stats — header-card counters
router.get('/stats', async (_req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const stats = await messagingSafetyService.reportStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/reports/:id/resolve
// Body: { resolution?: string }
router.post('/:id/resolve', async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid report ID', 400, 'INVALID_ID');
    const updated = await messagingSafetyService.resolveReport(
      id,
      req.userId!,
      req.body?.resolution,
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;