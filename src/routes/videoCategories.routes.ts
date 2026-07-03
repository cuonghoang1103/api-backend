/**
 * ============================================================
 * Video Categories Routes  (mounted at /api/v1/video-categories)
 * ============================================================
 * - GET    /            — public: list active categories (feed pills)
 * - GET    /all         — admin:  list every category + post counts
 * - POST   /            — admin:  create
 * - PUT    /:id         — admin:  update (name / sortOrder / isActive)
 * - DELETE /:id         — admin:  delete (posts keep, FK set null)
 */
import { Router, type Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import * as videoCategoriesService from '../services/videoCategories.service.js';

const router = Router();

// Public — active categories for the home-feed filter pills.
router.get('/', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const data = await videoCategoriesService.listActiveCategories();
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

// Admin — every category with post counts.
router.get('/all', authenticate, requireRole('ADMIN', 'EDITOR'), async (_req, res: Response<ApiResponse>, next) => {
  try {
    const data = await videoCategoriesService.listAllCategories();
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.post('/', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { name, sortOrder, isActive } = req.body as { name: string; sortOrder?: number; isActive?: boolean };
    const data = await videoCategoriesService.createCategory({ name, sortOrder, isActive });
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
});

router.put('/:id(\\d+)', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, sortOrder, isActive } = req.body as { name?: string; sortOrder?: number; isActive?: boolean };
    const data = await videoCategoriesService.updateCategory(id, { name, sortOrder, isActive });
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.delete('/:id(\\d+)', authenticate, requireRole('ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await videoCategoriesService.deleteCategory(id);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

export default router;
