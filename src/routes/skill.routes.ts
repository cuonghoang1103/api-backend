import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/skills ────────────────────────────────
router.get('/', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }] });
    res.json({ success: true, data: skills });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/skills/featured ─────────────────────
router.get('/featured', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const skills = await prisma.skill.findMany({ where: { isFeatured: true }, orderBy: { displayOrder: 'asc' } });
    res.json({ success: true, data: skills });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/skills/category/:category ─────────────
router.get('/category/:category', async (req, res: Response<ApiResponse>, next) => {
  try {
    const skills = await prisma.skill.findMany({
      where: { category: req.params.category },
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: skills });
  } catch (error) { next(error); }
});

export default router;
