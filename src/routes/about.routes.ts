/**
 * Trang /about — số liệu THẬT (public).
 *   GET /api/v1/about/stats
 *
 * Xem `services/aboutStats.service.ts` để biết vì sao trang này cần một
 * endpoint riêng thay vì gõ số vào JSX.
 */
import { Router, type Response } from 'express';
import type { ApiResponse } from '../types/index.js';
import { getAboutStats } from '../services/aboutStats.service.js';

const router = Router();

router.get('/stats', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await getAboutStats() });
  } catch (e) { next(e); }
});

export default router;
