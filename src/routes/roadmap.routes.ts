/**
 * RoadMap routes — mounted at /api/v1/roadmaps.
 *   GET  /                      → list roadmaps grouped by type (public)
 *   GET  /:slug                 → full roadmap + user's done set (optional auth)
 *   POST /nodes/:nodeId/done    → toggle a node done (auth)
 */
import { Router, type Request, type Response } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import * as roadmap from '../services/roadmap.service.js';

const router = Router();

router.get('/', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await roadmap.listRoadmaps() });
  } catch (err) { next(err); }
});

// Declared before '/:slug' so it never gets captured as a slug.
router.post('/nodes/:nodeId/done', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await roadmap.toggleDone(req.userId!, Number(req.params.nodeId)) });
  } catch (err) { next(err); }
});

router.get('/:slug', optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await roadmap.getRoadmap(req.params.slug, req.user?.userId) });
  } catch (err) { next(err); }
});

export default router;
