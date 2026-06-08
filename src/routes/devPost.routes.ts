import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/dev-posts ─────────────────────────────
router.get('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 1, size = 20, category } = req.query;
    const skip = (Number(page) - 1) * Number(size);
    const where = category ? { category: String(category) } : {};

    const [posts, total] = await Promise.all([
      prisma.devPost.findMany({ where, skip, take: Number(size), orderBy: { createdAt: 'desc' }, include: { _count: { select: { comments: true } } } }),
      prisma.devPost.count({ where }),
    ]);

    res.json({ success: true, data: posts, pagination: { page: Number(page), limit: Number(size), total, totalPages: Math.ceil(total / Number(size)) } });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/dev-posts/:id ─────────────────────────
router.get('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const post = await prisma.devPost.findUnique({
      where: { id },
      include: { comments: { orderBy: { createdAt: 'asc' } } },
    });
    if (!post) throw new AppError('Post not found', 404);
    res.json({ success: true, data: post });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/dev-posts/:id/comments ────────────────
router.post('/:id/comments', async (req, res: Response<ApiResponse>, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const { userName, userAvatar, commentText } = req.body;
    if (!commentText?.trim()) throw new AppError('Comment text is required', 400);

    const comment = await prisma.postComment.create({
      data: { postId, userName: userName || 'Anonymous', userAvatar, commentText },
    });
    res.status(201).json({ success: true, data: comment });
  } catch (error) { next(error); }
});

export default router;
