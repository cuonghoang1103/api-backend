import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/skills ────────────────────────────────
router.get('/', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }] });
    res.json({ success: true, data: skills });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/skills/featured ───────────────────────
router.get('/featured', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const skills = await prisma.skill.findMany({ where: { isFeatured: true }, orderBy: { displayOrder: 'asc' } });
    res.json({ success: true, data: skills });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/skills/category/:category ─────────────
router.get('/category/:category', async (req, res: Response<ApiResponse>, next) => {
  try {
    const skills = await prisma.skill.findMany({ where: { category: req.params.category }, orderBy: { displayOrder: 'asc' } });
    res.json({ success: true, data: skills });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/projects ─────────────────────────────
router.get('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 1, size = 12, keyword, status } = req.query;
    const skip = (Number(page) - 1) * Number(size);
    const where: Record<string, unknown> = {};
    if (keyword) where.OR = [{ title: { contains: String(keyword), mode: 'insensitive' } }, { description: { contains: String(keyword), mode: 'insensitive' } }];
    if (status) where.status = String(status);

    const [projects, total] = await Promise.all([
      prisma.project.findMany({ where, skip, take: Number(size), orderBy: { createdAt: 'desc' }, include: { skills: { include: { skill: true } } } }),
      prisma.project.count({ where }),
    ]);
    res.json({ success: true, data: projects, pagination: { page: Number(page), limit: Number(size), total, totalPages: Math.ceil(total / Number(size)) } });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/projects/featured ─────────────────────
router.get('/featured', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const { size = 6 } = _req.query;
    const projects = await prisma.project.findMany({
      where: { isFeatured: true }, take: Number(size),
      orderBy: { createdAt: 'desc' }, include: { skills: { include: { skill: true } } },
    });
    res.json({ success: true, data: projects });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/projects/:slug ────────────────────────
router.get('/:slug', async (req, res: Response<ApiResponse>, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      include: { skills: { include: { skill: true } } },
    });
    if (!project) throw new AppError('Project not found', 404);
    res.json({ success: true, data: project });
  } catch (error) { next(error); }
});

export default router;
