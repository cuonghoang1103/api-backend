import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

function normalizeProject(project: Record<string, unknown>) {
  const rawImages = project.images;
  let images: string[] = [];
  if (typeof rawImages === 'string' && rawImages.trim()) {
    try {
      images = JSON.parse(rawImages);
      if (!Array.isArray(images)) images = [];
    } catch { images = []; }
  } else if (Array.isArray(rawImages)) {
    images = rawImages;
  }

  const rawTechStack = project.techStack;
  let technologies: string[] = [];
  if (typeof rawTechStack === 'string' && rawTechStack.trim()) {
    technologies = rawTechStack.split(',').map((t: string) => t.trim()).filter(Boolean);
  } else if (Array.isArray(rawTechStack)) {
    technologies = rawTechStack;
  }

  const rawFeatured = (project as Record<string, unknown>).isFeatured;
  const isFeatured = typeof rawFeatured === 'boolean' ? rawFeatured : false;

  return {
    ...project,
    isFeatured,
    featured: isFeatured,
    technologies,
    images,
  };
}

// ─── GET /api/v1/projects ─────────────────────────────
router.get('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 1, size = 12, keyword, status } = req.query;
    const pageNum = Math.max(1, parseInt(String(page), 10));
    const sizeNum = Math.min(100, Math.max(1, parseInt(String(size), 10)));
    const skip = (pageNum - 1) * sizeNum;
    const where: Record<string, unknown> = {};
    if (keyword) {
      where.OR = [
        { title: { contains: String(keyword), mode: 'insensitive' } },
        { description: { contains: String(keyword), mode: 'insensitive' } },
      ];
    }
    if (status) where.status = String(status);

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: sizeNum,
        orderBy: { createdAt: 'desc' },
        include: { skills: { include: { skill: true } } },
      }),
      prisma.project.count({ where }),
    ]);

    const normalizedProjects = projects.map((p) => {
      const plain = p as unknown as Record<string, unknown>;
      return normalizeProject(plain);
    });

    res.json({
      success: true,
      data: normalizedProjects,
      pagination: {
        page: pageNum,
        limit: sizeNum,
        total,
        totalPages: Math.ceil(total / sizeNum),
      },
    });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/projects/featured ─────────────────────
router.get('/featured', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { size = 6 } = req.query;
    const projects = await prisma.project.findMany({
      where: { isFeatured: true },
      take: parseInt(String(size), 10),
      orderBy: { createdAt: 'desc' },
      include: { skills: { include: { skill: true } } },
    });
    const normalized = projects.map((p) => normalizeProject(p as unknown as Record<string, unknown>));
    res.json({ success: true, data: normalized });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/projects/:slug ───────────────────────
router.get('/:slug', async (req, res: Response<ApiResponse>, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      include: { skills: { include: { skill: true } } },
    });
    if (!project) throw new AppError('Project not found', 404);
    const normalized = normalizeProject(project as unknown as Record<string, unknown>);
    res.json({ success: true, data: normalized });
  } catch (error) { next(error); }
});

export default router;
