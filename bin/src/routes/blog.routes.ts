import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/blog/categories ───────────────────────
router.get('/categories', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/blog/posts ─────────────────────────────
router.get('/posts', async (req, res: Response<ApiResponse>, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const size = Math.min(50, Math.max(1, parseInt(req.query.size as string) || 10));
    const skip = (page - 1) * size;

    const where = {
      status: 'PUBLISHED',
      ...(req.query.category && { category: { slug: req.query.category as string } }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: size,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } },
          category: true,
          tags: { include: { tag: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/blog/posts/featured ───────────────────
router.get('/posts/featured', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      take: 5,
      orderBy: { publishedAt: 'desc' },
      include: { author: { select: { id: true, username: true, avatarUrl: true } }, category: true },
    });
    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/blog/posts/popular ───────────────────
router.get('/posts/popular', async (req, res: Response<ApiResponse>, next) => {
  try {
    const limit = Math.min(10, parseInt(req.query.limit as string) || 5);
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { viewCount: 'desc' },
      take: limit,
      include: { author: { select: { id: true, username: true, avatarUrl: true } }, category: true },
    });
    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/blog/posts/by-slug/:slug ───────────────
router.get('/posts/by-slug/:slug', async (req, res: Response<ApiResponse>, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true, bio: true } },
        category: true,
        tags: { include: { tag: true } },
        comments: { orderBy: { createdAt: 'desc' }, take: 50 },
        _count: { select: { comments: true } },
      },
    });

    if (!post) {
      throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/blog/posts/search ─────────────────────
router.get('/posts/search', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { keyword, category, page = 1, size = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(size);

    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (keyword) {
      where.OR = [
        { title: { contains: String(keyword), mode: 'insensitive' } },
        { content: { contains: String(keyword), mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = { slug: String(category) };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({ where, skip, take: Number(size), orderBy: { publishedAt: 'desc' } }),
      prisma.post.count({ where }),
    ]);

    res.json({ success: true, data: posts, pagination: { page: Number(page), limit: Number(size), total, totalPages: Math.ceil(total / Number(size)) } });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/blog/posts/:id/comments ──────────────
router.post('/posts/:id/comments', async (req, res: Response<ApiResponse>, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const { userName, userAvatar, commentText } = req.body;

    if (!commentText?.trim()) {
      throw new AppError('Comment text is required', 400);
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        userName: userName || 'Anonymous',
        userAvatar,
        commentText,
      },
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/blog/posts/:id/download ───────────────
router.post('/posts/:id/download', async (req, res: Response<ApiResponse>, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = await prisma.post.update({
      where: { id: postId },
      data: { downloadCount: { increment: 1 } },
      select: { sourceUrl: true, title: true },
    });

    res.json({ success: true, data: { url: post.sourceUrl, title: post.title } });
  } catch (error) {
    next(error);
  }
});

export default router;
