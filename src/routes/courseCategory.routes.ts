import { Router, Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── Public: list active course categories ───────────────────────────────────
router.get('/', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const categories = await prisma.courseCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      include: {
        _count: { select: { courses: { where: { isPublished: true } } } },
      },
    });

    const serialized = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
      courseCount: cat._count.courses,
    }));

    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.json({ success: true, data: serialized });
  } catch (error) {
    next(error);
  }
});

// ─── Admin: list ALL course categories ─────────────────────────────────────
router.get('/admin/all', authenticate, requireAdmin('ROLE_ADMIN'), async (_req, res: Response<ApiResponse>, next) => {
  try {
    const categories = await prisma.courseCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      include: {
        _count: { select: { courses: true } },
      },
    });

    const serialized = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      courseCount: cat._count.courses,
    }));

    res.json({ success: true, data: serialized });
  } catch (error) {
    next(error);
  }
});

// ─── Admin: create course category ───────────────────────────────────────────
router.post('/', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const slugRaw = String(req.body.slug || '').trim();
    if (!name) throw new AppError('Name is required', 400);

    // Auto-generate slug if not provided
    const baseSlug = slugRaw
      ? slugRaw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
      : name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

    let candidate = baseSlug || `cat-${Date.now()}`;
    let suffix = 0;
    while (true) {
      const existing = await prisma.courseCategory.findFirst({
        where: { slug: suffix === 0 ? candidate : `${candidate}-${suffix}` },
        select: { id: true },
      });
      if (!existing) break;
      suffix++;
    }
    const slug = suffix === 0 ? candidate : `${candidate}-${suffix}`;

    const created = await prisma.courseCategory.create({
      data: {
        name,
        slug,
        description: req.body.description ? String(req.body.description).trim() : null,
        icon: req.body.icon ? String(req.body.icon).trim() : null,
        sortOrder: Number(req.body.sortOrder ?? 0),
        isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...created,
        courseCount: 0,
      },
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002') {
      next(new AppError('Slug đã tồn tại. Vui lòng chọn slug khác.', 409));
      return;
    }
    next(error);
  }
});

// ─── Admin: update course category ───────────────────────────────────────────
router.put('/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid category id', 400);

    const existing = await prisma.courseCategory.findUnique({ where: { id } });
    if (!existing) throw new AppError('Category not found', 404);

    // If changing slug, check uniqueness
    if (req.body.slug !== undefined) {
      const nextSlug = String(req.body.slug).trim().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
      if (nextSlug && nextSlug !== existing.slug) {
        const dup = await prisma.courseCategory.findFirst({
          where: { slug: nextSlug, NOT: { id } },
        });
        if (dup) throw new AppError('Slug đã tồn tại. Vui lòng chọn slug khác.', 409);
      }
    }

    const updated = await prisma.courseCategory.update({
      where: { id },
      data: {
        ...(req.body.name !== undefined ? { name: String(req.body.name).trim() } : {}),
        ...(req.body.slug !== undefined ? {
          slug: String(req.body.slug).trim().toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
        } : {}),
        ...(req.body.description !== undefined ? { description: req.body.description ? String(req.body.description).trim() : null } : {}),
        ...(req.body.icon !== undefined ? { icon: req.body.icon ? String(req.body.icon).trim() : null } : {}),
        ...(req.body.sortOrder !== undefined ? { sortOrder: Number(req.body.sortOrder) } : {}),
        ...(req.body.isActive !== undefined ? { isActive: Boolean(req.body.isActive) } : {}),
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002') {
      next(new AppError('Slug đã tồn tại. Vui lòng chọn slug khác.', 409));
      return;
    }
    next(error);
  }
});

// ─── Admin: delete course category ───────────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid category id', 400);

    await prisma.courseCategory.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (error: any) {
    if (error?.code === 'P2003') {
      next(new AppError('Không thể xóa danh mục đang có khóa học.', 409));
      return;
    }
    next(error);
  }
});

export default router;
