import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── Public Blog Routes ─────────────────────────────────────────────────────────

// GET /api/v1/blog/categories
router.get('/categories', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: categories });
  } catch (error) { next(error); }
});

// GET /api/v1/blog/posts
router.get('/posts', async (req, res: Response<ApiResponse>, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const size = Math.min(50, Math.max(1, parseInt(req.query.size as string) || 10));
    const skip = (page - 1) * size;

    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (req.query.category) {
      where.category = { slug: req.query.category as string };
    }

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
  } catch (error) { next(error); }
});

// GET /api/v1/blog/posts/featured
router.get('/posts/featured', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      take: 5,
      orderBy: { publishedAt: 'desc' },
      include: { author: { select: { id: true, username: true, avatarUrl: true } }, category: true },
    });
    res.json({ success: true, data: posts });
  } catch (error) { next(error); }
});

// GET /api/v1/blog/posts/popular
router.get('/posts/popular', async (req, res: Response<ApiResponse>, next) => {
  try {
    const limit = Math.min(10, parseInt(req.query.limit as string) || 5);
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      take: limit,
      orderBy: { viewCount: 'desc' },
      include: { author: { select: { id: true, username: true, avatarUrl: true } }, category: true },
    });
    res.json({ success: true, data: posts });
  } catch (error) { next(error); }
});

// GET /api/v1/blog/posts/by-slug/:slug
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

    if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

    await prisma.post.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });

    res.json({ success: true, data: post });
  } catch (error) { next(error); }
});

// GET /api/v1/blog/posts/search
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
      prisma.post.findMany({
        where,
        skip,
        take: Number(size),
        orderBy: { publishedAt: 'desc' },
        include: { category: true, tags: { include: { tag: true } } },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: { page: Number(page), limit: Number(size), total, totalPages: Math.ceil(total / Number(size)) },
    });
  } catch (error) { next(error); }
});

// POST /api/v1/blog/posts/:id/comments
router.post('/posts/:id/comments', async (req, res: Response<ApiResponse>, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const { userName, userAvatar, commentText } = req.body;
    if (!commentText?.trim()) throw new AppError('Comment text is required', 400);

    const comment = await prisma.comment.create({
      data: { postId, userName: userName || 'Anonymous', userAvatar, commentText },
    });
    res.status(201).json({ success: true, data: comment });
  } catch (error) { next(error); }
});

// POST /api/v1/blog/posts/:id/download
router.post('/posts/:id/download', async (req, res: Response<ApiResponse>, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = await prisma.post.update({
      where: { id: postId },
      data: { downloadCount: { increment: 1 } },
      select: { sourceUrl: true, title: true },
    });
    res.json({ success: true, data: { url: post.sourceUrl, title: post.title } });
  } catch (error) { next(error); }
});

// ─── Admin Blog Routes ────────────────────────────────────────────────────────────

// GET /api/v1/admin/posts
router.get('/admin/posts', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const page = Math.max(0, parseInt(req.query.page as string) || 0);
    const size = Math.min(50, Math.max(1, parseInt(req.query.size as string) || 10));
    const skip = page * size;

    const where: Record<string, unknown> = {};
    if (req.query.keyword) {
      where.OR = [
        { title: { contains: String(req.query.keyword), mode: 'insensitive' } },
        { content: { contains: String(req.query.keyword), mode: 'insensitive' } },
      ];
    }
    if (req.query.status) where.status = req.query.status;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: {
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
  } catch (error) { next(error); }
});

// POST /api/v1/admin/posts
router.post('/admin/posts', authenticate, requireAdmin('ROLE_ADMIN'), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { title, content, excerpt, thumbnailUrl, sourceUrl, isFeatured, status, category, tags, publishedAt } = req.body;
    if (!title?.trim()) throw new AppError('Title is required', 400);
    if (!content?.trim()) throw new AppError('Content is required', 400);

    const slug = slugify(title) || `post-${Date.now()}`;
    let categoryId: number | null = null;

    if (category?.trim()) {
      const slugified = slugify(category);
      let cat = await prisma.category.findFirst({ where: { slug: slugified } });
      if (!cat) cat = await prisma.category.create({ data: { name: category.trim(), slug: slugified } });
      categoryId = cat.id;
    }

    const tagRecords: { id: number }[] = [];
    if (Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        if (!tagName?.trim()) continue;
        const slugified = slugify(tagName);
        let tag = await prisma.tag.findFirst({ where: { slug: slugified } });
        if (!tag) tag = await prisma.tag.create({ data: { name: tagName.trim(), slug: slugified } });
        tagRecords.push({ id: tag.id });
      }
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        thumbnailUrl: thumbnailUrl?.trim() || null,
        sourceUrl: sourceUrl?.trim() || null,
        status: status || 'DRAFT',
        isFeatured: Boolean(isFeatured),
        categoryId,
        publishedAt: status === 'PUBLISHED' ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
        tags: { create: tagRecords.map((t) => ({ tagId: t.id })) },
      },
      include: { category: true, tags: { include: { tag: true } } },
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) { next(error); }
});

// PUT /api/v1/admin/posts/:id
router.put('/admin/posts/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) throw new AppError('Post not found', 404);

    const { title, content, excerpt, thumbnailUrl, sourceUrl, isFeatured, status, category, tags, publishedAt } = req.body;

    let slug = existing.slug;
    if (title && title.trim() !== existing.title) {
      slug = slugify(title) || `post-${Date.now()}-${Date.now()}`;
    }

    let categoryId = existing.categoryId;
    if (category !== undefined) {
      if (category?.trim()) {
        const slugified = slugify(category);
        let cat = await prisma.category.findFirst({ where: { slug: slugified } });
        if (!cat) cat = await prisma.category.create({ data: { name: category.trim(), slug: slugified } });
        categoryId = cat.id;
      } else {
        categoryId = null;
      }
    }

    if (tags !== undefined) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
      if (Array.isArray(tags) && tags.length > 0) {
        const tagRecords: { id: number }[] = [];
        for (const tagName of tags) {
          if (!tagName?.trim()) continue;
          const slugified = slugify(tagName);
          let tag = await prisma.tag.findFirst({ where: { slug: slugified } });
          if (!tag) tag = await prisma.tag.create({ data: { name: tagName.trim(), slug: slugified } });
          tagRecords.push({ id: tag.id });
        }
        await prisma.postTag.createMany({ data: tagRecords.map((t) => ({ postId: id, tagId: t.id })) });
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: title?.trim() ?? existing.title,
        slug,
        content: content?.trim() ?? existing.content,
        excerpt: excerpt !== undefined ? (excerpt?.trim() || null) : existing.excerpt,
        thumbnailUrl: thumbnailUrl !== undefined ? (thumbnailUrl?.trim() || null) : existing.thumbnailUrl,
        sourceUrl: sourceUrl !== undefined ? (sourceUrl?.trim() || null) : existing.sourceUrl,
        status: status ?? existing.status,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        categoryId,
        publishedAt: status === 'PUBLISHED'
          ? (publishedAt ? new Date(publishedAt) : (existing.publishedAt || new Date()))
          : (status === 'DRAFT' ? null : existing.publishedAt),
      },
      include: { category: true, tags: { include: { tag: true } } },
    });

    res.json({ success: true, data: post });
  } catch (error) { next(error); }
});

// DELETE /api/v1/admin/posts/:id
router.delete('/admin/posts/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) throw new AppError('Post not found', 404);
    await prisma.post.delete({ where: { id } });
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) { next(error); }
});

export default router;
