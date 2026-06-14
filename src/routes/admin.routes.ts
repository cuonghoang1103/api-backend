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

    // Flatten Prisma's nested `roles: [{ userId, roleId, role: { name } }]`
    // shape into a simple `roles: string[]` for the client. The admin
    // frontend (RoleBadge, getRoles, etc.) calls `.replace()` on each
    // role — that only works on strings, not on the nested object the
    // Prisma `include` returns.
    const normalizedUsers = users.map((u) => ({
      ...u,
      roles: u.roles.map((ur) => ur.role.name),
    }));

    res.json({ success: true, data: normalizedUsers, pagination: { page: pageNumber, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) } });
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
          sourceUrl: sourceUrl?.trim() || null,
          isFeatured: Boolean(isFeatured),
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
      totalViews,
      recentActiveUsers,
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

// ─── SUPER ADMIN GUARD ──────────────────────────────────────────────
const SUPER_ADMINS = ['cuong03dx', 'cuong123'];

function isSuperAdmin(username: string): boolean {
  return SUPER_ADMINS.includes(username.toLowerCase());
}

// ─── PATCH /api/v1/admin/users/:id/roles ─────────────────────────
// Super-admin-only: change roles (promote/demote to Admin)
// Rejects with 403 if current user is not Cuong03dx or Cuong123
router.patch('/users/:id/roles', authenticate, requireAdmin('ROLE_ADMIN'), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { roles } = req.body as { roles: string[] };

    if (!Array.isArray(roles)) {
      throw new AppError('roles must be an array', 400, 'INVALID_ROLES');
    }

    // ── Super Admin Identity Guard ─────────────────────────────────
    const currentUsername = req.user?.username || '';
    if (!isSuperAdmin(currentUsername)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Only cuong03dx or cuong123 can modify user roles.',
        code: 'SUPER_ADMIN_REQUIRED',
      });
      return;
    }

    const normalizedRoles = roles.map((r: string) => {
      const upper = r.replace('ROLE_', '').toUpperCase();
      return upper.startsWith('ROLE_') ? upper : `ROLE_${upper}`;
    });

    const validRoles = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_EDITOR'];
    if (!normalizedRoles.every((r: string) => validRoles.includes(r))) {
      throw new AppError('Invalid role value', 400, 'INVALID_ROLE');
    }

    const target = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!target) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    const rolesToSet = await prisma.role.findMany({
      where: { name: { in: normalizedRoles } },
      select: { id: true },
    });
    if (rolesToSet.length !== normalizedRoles.length) {
      throw new AppError('One or more roles do not exist', 400, 'ROLE_NOT_FOUND');
    }

    await prisma.$transaction([
      prisma.userRole.deleteMany({ where: { userId: id } }),
      ...rolesToSet.map((role) =>
        prisma.userRole.create({ data: { userId: id, roleId: role.id } })
      ),
    ]);

    // Increment roleVersion to invalidate cached sessions
    await prisma.user.update({ where: { id }, data: { roleVersion: { increment: 1 } } });

    const updated = await prisma.user.findUnique({
      where: { id },
      include: { roles: { include: { role: true } } },
    });

    res.json({
      success: true,
      message: 'User roles updated successfully',
      data: updated,
    });
  } catch (error) { next(error); }
});

// ─── PUT /api/v1/admin/users/:id ──────────────────────────────────
// Requires super admin identity (Cuong03dx or Cuong123)
router.put('/users/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { username, email, fullName, enabled, accountNonLocked } = req.body;

    // ── Super Admin Identity Guard ─────────────────────────────────
    const currentUsername = req.user?.username || '';
    if (!isSuperAdmin(currentUsername)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Only cuong03dx or cuong123 can edit user accounts.',
        code: 'SUPER_ADMIN_REQUIRED',
      });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(fullName !== undefined && { fullName }),
        ...(enabled !== undefined && { enabled }),
        ...(accountNonLocked !== undefined && { accountNonLocked }),
      },
    });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/admin/users/:id ──────────────────────────────
// Hard delete with ORDER GUARD: aborts if user has any shop orders
// Requires super admin identity (Cuong03dx or Cuong123)
router.delete('/users/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    // ── Super Admin Identity Guard ─────────────────────────────────
    const currentUsername = req.user?.username || '';
    if (!isSuperAdmin(currentUsername)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Only cuong03dx or cuong123 can delete users.',
        code: 'SUPER_ADMIN_REQUIRED',
      });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { id }, select: { id: true, username: true } });
    if (!existing) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    // ── Order Guard: check ShopOrder table ────────────────────────
    const orderCount = await prisma.shopOrder.count({ where: { userId: id } });
    if (orderCount > 0) {
      res.status(409).json({
        success: false,
        message: `Cannot delete user: Active/Historical orders detected on this account. (${orderCount} order(s) found)`,
        code: 'ORDER_GUARD_BLOCKED',
      });
      return;
    }

    // Cascade deletes via Prisma relations (UserRole, ChatSession, MusicHistory, etc.)
    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: 'User deleted permanently' });
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

// ─── GET /api/v1/admin/projects ──────────────────────────
router.get('/projects', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 1, size = 20, keyword } = req.query;
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

    const normalizedProjects = projects.map((p) => normalizeProject(p as unknown as Record<string, unknown>));

    res.json({
      success: true,
      data: normalizedProjects,
      pagination: { page: pageNum, limit: sizeNum, total, totalPages: Math.ceil(total / sizeNum) },
    });
  } catch (error) { next(error); }
});

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

// ─── POST /api/v1/admin/projects ─────────────────────────
router.post('/projects', authenticate, requireAdmin('ROLE_ADMIN'), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { title, description, content, thumbnailUrl, images, projectUrl, videoUrl, githubUrl, techStack, status, featured, startDate, endDate, role, duration } = req.body;
    if (!title?.trim()) throw new AppError('Title is required', 400);

    const baseSlug = slugify(title) || `project-${Date.now()}`;
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const imagesJson = Array.isArray(images) ? JSON.stringify(images) : images || null;
    const techStackStr = Array.isArray(techStack) ? techStack.join(', ') : (techStack || null);

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        slug,
        description: description || null,
        content: content || null,
        thumbnailUrl: thumbnailUrl || null,
        images: imagesJson,
        projectUrl: projectUrl || null,
        videoUrl: videoUrl || null,
        githubUrl: githubUrl || null,
        techStack: techStackStr,
        status: status || 'COMPLETED',
        isFeatured: Boolean(featured),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        role: role || null,
        duration: duration || null,
      },
      include: { skills: { include: { skill: true } } },
    });
    const normalized = normalizeProject(project as unknown as Record<string, unknown>);
    res.status(201).json({ success: true, data: normalized });
  } catch (error) { next(error); }
});

// ─── PUT /api/v1/admin/projects/:id ──────────────────────
router.put('/projects/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new AppError('Project not found', 404);

    const { title, description, content, thumbnailUrl, images, projectUrl, videoUrl, githubUrl, techStack, status, featured, startDate, endDate, role, duration } = req.body;

    let slug = existing.slug;
    if (title && title.trim() !== existing.title) {
      const baseSlug = slugify(title) || `project-${Date.now()}`;
      let candidate = baseSlug;
      let suffix = 1;
      while (true) {
        const conflict = await prisma.project.findFirst({ where: { slug: candidate, NOT: { id } } });
        if (!conflict) break;
        candidate = `${baseSlug}-${suffix++}`;
      }
      slug = candidate;
    }

    const imagesJson = Array.isArray(images) ? JSON.stringify(images) : (images !== undefined ? images : existing.images);
    const techStackStr = Array.isArray(techStack) ? techStack.join(', ') : (techStack !== undefined ? techStack : existing.techStack);

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: title?.trim() || existing.title,
        slug,
        description: description !== undefined ? description : existing.description,
        content: content !== undefined ? content : existing.content,
        thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : existing.thumbnailUrl,
        images: imagesJson,
        projectUrl: projectUrl !== undefined ? projectUrl : existing.projectUrl,
        videoUrl: videoUrl !== undefined ? videoUrl : existing.videoUrl,
        githubUrl: githubUrl !== undefined ? githubUrl : existing.githubUrl,
        techStack: techStackStr,
        status: status || existing.status,
        isFeatured: featured !== undefined ? Boolean(featured) : existing.isFeatured,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : existing.startDate,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existing.endDate,
        role: role !== undefined ? role : existing.role,
        duration: duration !== undefined ? duration : existing.duration,
      },
      include: { skills: { include: { skill: true } } },
    });
    const normalized = normalizeProject(project as unknown as Record<string, unknown>);
    res.json({ success: true, data: normalized });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/admin/projects/:id ─────────────────
router.delete('/projects/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new AppError('Project not found', 404);
    await prisma.project.delete({ where: { id } });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) { next(error); }
});

// ─── PATCH /api/v1/admin/projects/:id/toggle-featured ───
router.patch('/projects/:id/toggle-featured', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new AppError('Project not found', 404);
    const project = await prisma.project.update({
      where: { id },
      data: { isFeatured: !existing.isFeatured },
    });
    const normalized = normalizeProject(project as unknown as Record<string, unknown>);
    res.json({ success: true, data: normalized });
  } catch (error) { next(error); }
});

export default router;
