import { Router, Response } from 'express';
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

async function ensureUniqueSlug(baseValue: string, entity: 'post' | 'category' | 'tag', excludeId?: number): Promise<string> {
  const baseSlug = slugify(baseValue) || `${entity}-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    let existing: { id: number } | null = null;

    if (entity === 'post') {
      existing = await prisma.post.findFirst({
        where: {
          slug: candidate,
          ...(excludeId ? { NOT: { id: excludeId } } : {}),
        },
        select: { id: true },
      });
    } else if (entity === 'category') {
      existing = await prisma.category.findFirst({
        where: {
          slug: candidate,
          ...(excludeId ? { NOT: { id: excludeId } } : {}),
        },
        select: { id: true },
      });
    } else {
      existing = await prisma.tag.findFirst({
        where: {
          slug: candidate,
          ...(excludeId ? { NOT: { id: excludeId } } : {}),
        },
        select: { id: true },
      });
    }

    if (!existing) return candidate;
    candidate = `${baseSlug}-${suffix++}`;
  }
}

async function resolveCategoryId(categoryName?: string | null): Promise<number | null> {
  const normalizedName = categoryName?.trim();
  if (!normalizedName) return null;

  const existing = await prisma.category.findFirst({
    where: { name: { equals: normalizedName, mode: 'insensitive' } },
    select: { id: true },
  });

  if (existing) return existing.id;

  const slug = await ensureUniqueSlug(normalizedName, 'category');
  const created = await prisma.category.create({
    data: {
      name: normalizedName,
      slug,
    },
    select: { id: true },
  });

  return created.id;
}

async function resolveTagIds(tagNames: string[]): Promise<number[]> {
  const normalizedTagNames = [...new Set(tagNames.map((tag) => tag.trim()).filter(Boolean))];
  if (normalizedTagNames.length === 0) return [];

  const tagIds: number[] = [];

  for (const tagName of normalizedTagNames) {
    const existing = await prisma.tag.findFirst({
      where: { name: { equals: tagName, mode: 'insensitive' } },
      select: { id: true },
    });

    if (existing) {
      tagIds.push(existing.id);
      continue;
    }

    const slug = await ensureUniqueSlug(tagName, 'tag');
    const created = await prisma.tag.create({
      data: {
        name: tagName,
        slug,
      },
      select: { id: true },
    });
    tagIds.push(created.id);
  }

  return tagIds;
}

function normalizePublishedAt(status: string, publishedAt?: string | null): Date | null {
  if (status === 'PUBLISHED') {
    return publishedAt ? new Date(publishedAt) : new Date();
  }
  if (status === 'SCHEDULED') {
    return publishedAt ? new Date(publishedAt) : null;
  }
  return null;
}

async function serializePost(postId: number) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { comments: true } },
    },
  });

  if (!post) {
    throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    thumbnailUrl: post.thumbnailUrl,
    status: post.status,
    categoryId: post.categoryId,
    categoryName: post.category?.name,
    categorySlug: post.category?.slug,
    tagNames: post.tags.map((postTag) => postTag.tag.name),
    viewCount: post.viewCount,
    isFeatured: post.isFeatured,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    sourceUrl: post.sourceUrl,
    downloadCount: post.downloadCount,
    commentCount: post._count.comments,
  };
}

// ─── GET /api/v1/admin/users ─────────────────────────
router.get('/users', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 1, size = 20, keyword, provider, sortBy = 'createdAt', sortDir = 'desc' } = req.query;
    const pageNumber = Math.max(0, Number(page));
    const pageSize = Math.max(1, Number(size));
    const skip = pageNumber * pageSize;
    const where = {
      ...(keyword
        ? {
            OR: [
              { username: { contains: String(keyword) } },
              { email: { contains: String(keyword) } },
            ],
          }
        : {}),
      ...(provider && provider !== 'all'
        ? provider === 'credentials'
          ? { provider: null }
          : { provider: String(provider) }
        : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take: pageSize,
        orderBy: { [sortBy as string]: sortDir === 'asc' ? 'asc' : 'desc' },
        select: { id: true, username: true, email: true, fullName: true, avatarUrl: true, enabled: true, accountNonLocked: true, provider: true, createdAt: true, roles: { include: { role: true } } },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ success: true, data: users, pagination: { page: pageNumber, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) } });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/admin/posts ─────────────────────────
router.get('/posts', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 0, size = 10, keyword, status } = req.query;
    const pageNumber = Math.max(0, Number(page));
    const pageSize = Math.min(50, Math.max(1, Number(size)));
    const skip = pageNumber * pageSize;

    const where: Record<string, unknown> = {
      ...(keyword
        ? {
            OR: [
              { title: { contains: String(keyword), mode: 'insensitive' } },
              { content: { contains: String(keyword), mode: 'insensitive' } },
              { excerpt: { contains: String(keyword), mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(status ? { status: String(status) } : {}),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [
          { createdAt: 'desc' },
        ],
        include: {
          category: true,
          tags: { include: { tag: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    const normalizedPosts = await Promise.all(posts.map((post) => serializePost(post.id)));

    res.json({
      success: true,
      data: normalizedPosts,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/admin/posts ─────────────────────────
router.post('/posts', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { title, content, excerpt, thumbnailUrl, sourceUrl, isFeatured, status, category, tags, publishedAt } = req.body;

    if (!title?.trim()) throw new AppError('Title is required', 400);
    if (!content?.trim()) throw new AppError('Content is required', 400);

    const normalizedStatus = ['DRAFT', 'PUBLISHED', 'SCHEDULED'].includes(String(status)) ? String(status) : 'DRAFT';
    const categoryId = await resolveCategoryId(category);
    const tagIds = await resolveTagIds(Array.isArray(tags) ? tags : []);
    const slug = await ensureUniqueSlug(title, 'post');
    const normalizedPublishedAt = normalizePublishedAt(normalizedStatus, publishedAt);

    const created = await prisma.post.create({
      data: {
        title: String(title).trim(),
        slug,
        content: String(content),
        excerpt: excerpt?.trim() || null,
        thumbnailUrl: thumbnailUrl?.trim() || null,
        sourceUrl: sourceUrl?.trim() || null,
        isFeatured: Boolean(isFeatured),
        status: normalizedStatus,
        categoryId,
        authorId: req.userId,
        publishedAt: normalizedPublishedAt,
        tags: tagIds.length > 0
          ? {
              create: tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      },
      select: { id: true },
    });

    const serialized = await serializePost(created.id);
    res.status(201).json({ success: true, data: serialized, message: 'Post created successfully' });
  } catch (error) { next(error); }
});

// ─── PUT /api/v1/admin/posts/:id ───────────────────────
router.put('/posts/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.post.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

    const { title, content, excerpt, thumbnailUrl, sourceUrl, isFeatured, status, category, tags, publishedAt } = req.body;

    if (!title?.trim()) throw new AppError('Title is required', 400);
    if (!content?.trim()) throw new AppError('Content is required', 400);

    const normalizedStatus = ['DRAFT', 'PUBLISHED', 'SCHEDULED'].includes(String(status)) ? String(status) : 'DRAFT';
    const categoryId = await resolveCategoryId(category);
    const tagIds = await resolveTagIds(Array.isArray(tags) ? tags : []);
    const slug = await ensureUniqueSlug(title, 'post', id);
    const normalizedPublishedAt = normalizePublishedAt(normalizedStatus, publishedAt);

    await prisma.$transaction([
      prisma.postTag.deleteMany({ where: { postId: id } }),
      prisma.post.update({
        where: { id },
        data: {
          title: String(title).trim(),
          slug,
          content: String(content),
          excerpt: excerpt?.trim() || null,
          thumbnailUrl: thumbnailUrl?.trim() || null,
          status: normalizedStatus,
          categoryId,
          publishedAt: normalizedPublishedAt,
          tags: tagIds.length > 0
            ? {
                create: tagIds.map((tagId) => ({ tagId })),
              }
            : undefined,
        },
      }),
    ]);

    const serialized = await serializePost(id);
    res.json({ success: true, data: serialized, message: 'Post updated successfully' });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/admin/posts/:id ────────────────────
router.delete('/posts/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.post.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

    await prisma.post.delete({ where: { id } });
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/admin/users/count ───────────────────
router.get('/users/count', authenticate, requireAdmin('ROLE_ADMIN'), async (_req, res: Response<ApiResponse>, next) => {
  try {
    const total = await prisma.user.count();
    res.json({ success: true, data: { total } });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/admin/stats/overview ─────────────────
router.get('/stats/overview', authenticate, requireAdmin('ROLE_ADMIN'), async (_req, res: Response<ApiResponse>, next) => {
  try {
    const [
      totalUsers,
      totalPosts,
      totalProjects,
      totalSkills,
      totalMessages,
      totalSessions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.project.count(),
      prisma.skill.count(),
      prisma.chatMessage.count(),
      prisma.chatSession.count(),
      prisma.post.aggregate({ _sum: { viewCount: true } }),
      prisma.user.count({
        where: { updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
    ]);

    const memoryUsedMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    const memoryTotalMB = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);
    const memoryPercent = memoryTotalMB > 0 ? Math.round((memoryUsedMB / memoryTotalMB) * 100) : 0;
    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPosts,
        totalViews: totalViews._sum.viewCount ?? 0,
        totalProjects,
        totalSkills,
        activeSessions: recentActiveUsers,
        totalMessages,
        totalSessions,
        memoryUsedMB,
        memoryTotalMB,
        memoryPercent,
        uptimeSeconds,
        uptimeFormatted,
      },
    });
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
