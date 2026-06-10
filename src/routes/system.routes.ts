import { Router, type Response } from 'express';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/system/health ────────────────────────
router.get('/health', async (_req, res: Response<ApiResponse>) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

export default router;
