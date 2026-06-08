import { Router, Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/admin/users ─────────────────────────
router.get('/users', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 1, size = 20, keyword, sortBy = 'createdAt', sortDir = 'desc' } = req.query;
    const skip = (Number(page) - 1) * Number(size);
    const where = keyword
      ? { OR: [{ username: { contains: String(keyword) } }, { email: { contains: String(keyword) } }] }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take: Number(size),
        orderBy: { [sortBy as string]: sortDir === 'asc' ? 'asc' : 'desc' },
        select: { id: true, username: true, email: true, fullName: true, avatarUrl: true, enabled: true, accountNonLocked: true, provider: true, createdAt: true, roles: { include: { role: true } } },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ success: true, data: users, pagination: { page: Number(page), limit: Number(size), total, totalPages: Math.ceil(total / Number(size)) } });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/admin/users/count ───────────────────
router.get('/users/count', authenticate, requireAdmin('ROLE_ADMIN'), async (_req, res: Response<ApiResponse>, next) => {
  try {
    const total = await prisma.user.count();
    res.json({ success: true, data: { total } });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/admin/users ─────────────────────────
router.post('/users', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { username, password, email, fullName, roleName } = req.body;
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username, email, fullName,
        password: hashedPassword,
        roles: { create: { role: { connect: { name: roleName || 'ROLE_USER' } } } },
      },
      include: { roles: { include: { role: true } } },
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) { next(error); }
});

// ─── PUT /api/v1/admin/users/:id ─────────────────────
router.put('/users/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { username, email, fullName, enabled, accountNonLocked } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(fullName !== undefined && { fullName }),
        ...(enabled !== undefined && { enabled }),
        ...(accountNonLocked !== undefined && { accountNonLocked }),
      },
    });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/admin/users/:id ───────────────────
router.delete('/users/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
});

// ─── PATCH /api/v1/admin/users/:id/toggle-enabled ────
router.patch('/users/:id/toggle-enabled', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!user) throw new AppError('User not found', 404);
    const updated = await prisma.user.update({ where: { id: user.id }, data: { enabled: !user.enabled } });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});

// ─── PATCH /api/v1/admin/users/:id/toggle-locked ──────
router.patch('/users/:id/toggle-locked', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!user) throw new AppError('User not found', 404);
    const updated = await prisma.user.update({ where: { id: user.id }, data: { accountNonLocked: !user.accountNonLocked } });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/admin/check ──────────────────────────
// Used by Next.js middleware to verify admin role
router.get('/check', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { roles: { include: { role: true } } },
    });
    const roles = user?.roles.map((ur) => ur.role.name) || [];
    const isAdmin = roles.includes('ROLE_ADMIN');
    res.json({ success: true, data: { isAdmin, roles } });
  } catch (error) { next(error); }
});

export default router;
