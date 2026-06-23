import { Router, Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { renderProjectMarkdown } from '../services/projectMarkdown.service.js';
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

    const allowedSortColumns = ['createdAt', 'username', 'email', 'fullName'] as const;
    const safeSortBy = allowedSortColumns.includes(sortBy as typeof allowedSortColumns[number])
      ? sortBy as string
      : 'createdAt';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take: pageSize,
        orderBy: { [safeSortBy]: sortDir === 'asc' ? 'asc' as const : 'desc' as const },
        select: { id: true, username: true, email: true, fullName: true, displayName: true, avatarUrl: true, enabled: true, accountNonLocked: true, emailVerified: true, provider: true, createdAt: true, roles: { include: { role: true } } },
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

    const normalizedPosts = posts.map((post) => ({
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
    }));

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

    // The DB stores role names in lowercase (`user`, `admin`).
    // Accept either spelling from the caller.
    const normalizedRoleName = (roleName || 'user')
      .toString()
      .replace(/^ROLE_/i, '')
      .trim()
      .toLowerCase();

    const user = await prisma.user.create({
      data: {
        username, email, fullName,
        password: hashedPassword,
        roles: { create: { role: { connect: { name: normalizedRoleName } } } },
      },
      select: {
        id: true, username: true, email: true, fullName: true,
        enabled: true, accountNonLocked: true, provider: true, createdAt: true,
        roles: { select: { role: { select: { id: true, name: true } } } },
      },
    });
    res.status(201).json({
      success: true,
      // Flatten roles to string[] for the client.
      data: { ...user, roles: (user.roles ?? []).map((ur) => ur.role.name) },
    });
  } catch (error) { next(error); }
});

// ─── SUPER ADMIN GUARD ──────────────────────────────────────────────
// Only these accounts can mutate other users' roles / lock state
// of super-admins. The username is matched case-insensitively;
// the email match is also case-insensitive (some users registered
// with mixed-case Gmail addresses).
const SUPER_ADMIN_USERNAMES = ['cuong03dx', 'cuong123'];
const SUPER_ADMIN_EMAILS = ['cuong03dx@gmail.com'];

function isSuperAdminByUsername(username?: string | null): boolean {
  if (!username) return false;
  return SUPER_ADMIN_USERNAMES.includes(username.toLowerCase());
}

function isSuperAdminByEmail(email?: string | null): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
}

function isProtectedAccount(user: { username?: string | null; email?: string | null }): boolean {
  return isSuperAdminByUsername(user.username) || isSuperAdminByEmail(user.email);
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
    if (!isSuperAdminByUsername(currentUsername)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Only cuong03dx or cuong123 can modify user roles.',
        code: 'SUPER_ADMIN_REQUIRED',
      });
      return;
    }

    // The DB `roles` table stores names in lowercase
    // (`user`, `admin`, `moderator`, `editor`). Some legacy
    // clients send `ROLE_USER` / `ROLE_ADMIN`; the rest of the
    // code base normalizes both ways via `.replace('ROLE_', '')`
    // so we accept either spelling here.
    const normalizedRoles = roles
      .filter((r): r is string => typeof r === 'string')
      .map((r) => r.replace(/^ROLE_/i, '').trim().toLowerCase())
      .filter((r) => r.length > 0);

    if (normalizedRoles.length === 0) {
      throw new AppError('roles must contain at least one role name', 400, 'EMPTY_ROLES');
    }

    const target = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!target) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    // Look up roles by their lowercased name in the DB.
    const rolesToSet = await prisma.role.findMany({
      where: { name: { in: normalizedRoles } },
      select: { id: true, name: true },
    });
    if (rolesToSet.length !== normalizedRoles.length) {
      const found = new Set(rolesToSet.map((r) => r.name));
      const missing = normalizedRoles.filter((r) => !found.has(r));
      throw new AppError(
        `These roles do not exist in the database: ${missing.join(', ')}`,
        400,
        'ROLE_NOT_FOUND'
      );
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
      select: {
        id: true, username: true, email: true, fullName: true,
        enabled: true, accountNonLocked: true, provider: true, createdAt: true,
        roles: { select: { role: { select: { id: true, name: true } } } },
      },
    });

    // Flatten roles to string[] for the client (same shape as
    // GET /admin/users, so the UI doesn't need a special case).
    const flatRoles = (updated?.roles ?? []).map((ur) => ur.role.name);
    res.json({
      success: true,
      message: 'User roles updated successfully',
      data: { ...updated, roles: flatRoles },
    });
  } catch (error) { next(error); }
});

// ─── PUT /api/v1/admin/users/:id ──────────────────────────────────
// Requires super admin identity (Cuong03dx or Cuong123)
router.put('/users/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { username, email, fullName, displayName, enabled, accountNonLocked, emailVerified } = req.body;

    // ── Super Admin Identity Guard ─────────────────────────────────
    const currentUsername = req.user?.username || '';
    if (!isSuperAdminByUsername(currentUsername)) {
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
        ...(displayName !== undefined && { displayName }),
        ...(enabled !== undefined && { enabled }),
        ...(accountNonLocked !== undefined && { accountNonLocked }),
        ...(emailVerified !== undefined && { emailVerified }),
      },
      select: { id: true, username: true, email: true, fullName: true, displayName: true, enabled: true, accountNonLocked: true, emailVerified: true, provider: true, createdAt: true },
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
    if (Number.isNaN(id)) throw new AppError('Invalid user id', 400, 'INVALID_ID');

    // ── Self-delete guard ─────────────────────────────────
    if (id === req.userId) {
      throw new AppError('Bạn không thể xóa chính mình', 400, 'SELF_DELETE_FORBIDDEN');
    }

    // ── Super Admin Identity Guard ─────────────────────────────────
    const currentUsername = req.user?.username || '';
    if (!isSuperAdminByUsername(currentUsername)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Only cuong03dx or cuong123 can delete users.',
        code: 'SUPER_ADMIN_REQUIRED',
      });
      return;
    }

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true, emailVerified: true },
    });
    if (!existing) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    // Block deletion of the other super-admin account.
    if (isProtectedAccount(existing)) {
      throw new AppError('Không thể xóa tài khoản super admin', 400, 'SUPER_ADMIN_PROTECTED');
    }

    // ── Business Rule: only unverified accounts may be deleted ────
    if (existing.emailVerified) {
      res.status(409).json({
        success: false,
        message: 'Không thể xóa tài khoản này: email đã được xác minh. Chỉ tài khoản chưa xác minh email mới được phép xóa.',
        code: 'EMAIL_VERIFIED_GUARD',
      });
      return;
    }

    // ── Order Guard: block if user has PENDING or PROCESSING orders ─
    const [pendingShopOrders, pendingCourseOrders] = await Promise.all([
      prisma.shopOrder.count({
        where: {
          userId: id,
          OR: [
            { status: { in: ['PENDING', 'PROCESSING'] } },
            { paymentStatus: { in: ['PENDING', 'PROCESSING'] } },
          ],
        },
      }),
      prisma.courseOrder.count({
        where: { userId: id, status: { in: ['PENDING', 'PROCESSING'] } },
      }),
    ]);

    const totalPending = pendingShopOrders + pendingCourseOrders;
    if (totalPending > 0) {
      res.status(409).json({
        success: false,
        message: `Không thể xóa tài khoản: có ${totalPending} đơn hàng đang chờ xử lý (shop: ${pendingShopOrders}, khóa học: ${pendingCourseOrders}). Hãy hoàn tất hoặc hủy tất cả đơn hàng trước.`,
        code: 'PENDING_ORDERS_GUARD',
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
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid user id', 400, 'INVALID_ID');

    // ── Super Admin Identity Guard ─────────────────────────────────
    // The two super-admin accounts (cuong03dx and Cuong123, plus
    // the cuong03dx@gmail.com email) must always stay enabled.
    // Disabling them would lock the operator out of the panel.
    if (id === req.userId) {
      throw new AppError('Bạn không thể vô hiệu hóa chính mình', 400, 'SELF_MODIFY_FORBIDDEN');
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, enabled: true, username: true, email: true },
    });
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    // Don't allow disabling the other super-admin.
    if (isProtectedAccount(user) && user.enabled) {
      throw new AppError('Không thể vô hiệu hóa tài khoản super admin', 400, 'SUPER_ADMIN_PROTECTED');
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      // Explicit field list so the response never contains a
      // BigInt column (e.g. `roleVersion` was BigInt in some
      // Prisma revisions, which made JSON.stringify throw
      // "Do not know how to serialize a BigInt").
      data: { enabled: !user.enabled },
      select: { id: true, username: true, email: true, enabled: true, accountNonLocked: true, provider: true, createdAt: true },
    });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});

// ─── PATCH /api/v1/admin/users/:id/toggle-locked ──────
router.patch('/users/:id/toggle-locked', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid user id', 400, 'INVALID_ID');

    if (id === req.userId) {
      throw new AppError('Bạn không thể tự khóa tài khoản của mình', 400, 'SELF_MODIFY_FORBIDDEN');
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, accountNonLocked: true, username: true, email: true },
    });
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    if (isProtectedAccount(user) && user.accountNonLocked) {
      throw new AppError('Không thể khóa tài khoản super admin', 400, 'SUPER_ADMIN_PROTECTED');
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { accountNonLocked: !user.accountNonLocked },
      select: { id: true, username: true, email: true, enabled: true, accountNonLocked: true, provider: true, createdAt: true },
    });
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
 const { page = 1, size = 20, keyword, category, difficulty, status } = req.query;
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
 if (category) where.category = String(category);
 if (difficulty) where.difficulty = String(difficulty);
 if (status) where.status = String(status);

 const [projects, total] = await Promise.all([
 prisma.project.findMany({
 where,
 skip,
 take: sizeNum,
 orderBy: { createdAt: 'desc' },
 include: {
 skills: { include: { skill: true } },
 milestones: { orderBy: { order: 'asc' } },
 features: { orderBy: { order: 'asc' } },
 resources: { orderBy: { order: 'asc' } },
 },
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

// ─── GET /api/v1/admin/projects/:id ──────────────────────
// Admin detail view — returns the full project with all
// relations so the editor page can hydrate in one round-
// trip. Unlike the public detail route this also returns
// drafts (isPublished=false).
router.get('/projects/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseInt(String(req.params.id), 10);
 if (Number.isNaN(id)) throw new AppError('Invalid id', 400);

 const project = await prisma.project.findUnique({
 where: { id },
 include: {
 skills: { include: { skill: true } },
 milestones: { orderBy: { order: 'asc' } },
 features: { orderBy: { order: 'asc' } },
 resources: { orderBy: { order: 'asc' } },
 listItems: { orderBy: { order: 'asc' } },
 },
 });
 if (!project) throw new AppError('Project not found', 404);

 const normalized = normalizeProject(project as unknown as Record<string, unknown>);
 res.json({ success: true, data: normalized });
 } catch (error) { next(error); }
});

// ─── POST /api/v1/admin/projects ─────────────────────────
router.post('/projects', authenticate, requireAdmin('ROLE_ADMIN'), async (req: any, res: Response<ApiResponse>, next) => {
 try {
 const {
 title, description, content, thumbnailUrl, images,
 projectUrl, videoUrl, githubUrl, techStack, status,
 featured, startDate, endDate, role, duration,
 // Phase 2: case study fields
 category, difficulty, bodyMdx, schemaCode, schemaLang, isPublished,
 } = req.body;
 if (!title?.trim()) throw new AppError('Title is required', 400);

 const baseSlug = slugify(title) || `project-${Date.now()}`;
 let slug = baseSlug;
 let suffix = 1;
 while (await prisma.project.findUnique({ where: { slug } })) {
 slug = `${baseSlug}-${suffix++}`;
 }

 const imagesJson = Array.isArray(images) ? JSON.stringify(images) : images || null;
 const techStackStr = Array.isArray(techStack) ? techStack.join(', ') : (techStack || null);

 // Auto-render bodyHtml from bodyMdx on insert so the
 // public detail page doesn't pay the cost on first read.
 const bodyHtml = bodyMdx ? safeRender(bodyMdx) : null;

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
 category: category || null,
 difficulty: difficulty || null,
 bodyMdx: bodyMdx || null,
 bodyHtml,
 schemaCode: schemaCode || null,
 schemaLang: schemaLang || null,
 isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
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

 const {
 title, description, content, thumbnailUrl, images,
 projectUrl, videoUrl, githubUrl, techStack, status,
 featured, startDate, endDate, role, duration,
 category, difficulty, bodyMdx, schemaCode, schemaLang, isPublished,
 } = req.body;

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

 // Auto re-render bodyHtml whenever bodyMdx changes (or
 // is provided and the previous bodyHtml was empty). On
 // a malformed doc we keep the previous cache rather than
 // clearing it — better to show stale content than nothing.
 let bodyHtmlUpdate: string | null | undefined = undefined;
 if (bodyMdx !== undefined) {
 if (bodyMdx === null || bodyMdx.trim() === '') {
 bodyHtmlUpdate = null;
 } else if (bodyMdx !== existing.bodyMdx || !existing.bodyHtml) {
 bodyHtmlUpdate = safeRender(bodyMdx);
 if (bodyHtmlUpdate === null) bodyHtmlUpdate = existing.bodyHtml;
 }
 }

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
 category: category !== undefined ? category : existing.category,
 difficulty: difficulty !== undefined ? difficulty : existing.difficulty,
 bodyMdx: bodyMdx !== undefined ? bodyMdx : existing.bodyMdx,
 ...(bodyHtmlUpdate !== undefined ? { bodyHtml: bodyHtmlUpdate } : {}),
 schemaCode: schemaCode !== undefined ? schemaCode : existing.schemaCode,
 schemaLang: schemaLang !== undefined ? schemaLang : existing.schemaLang,
 isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
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

// ────────────────────────────────────────────────────────────
// Phase 2 — Case study child entities
// ────────────────────────────────────────────────────────────
// Milestones / Features / Resources each have a full CRUD
// surface (list, create, update, delete). All routes are
// admin-only and validate :id is numeric + the parent
// project exists before touching anything.

// ─── Helper: render-safe wrapper ───────────────────────────
// Wraps renderProjectMarkdown so a single broken document
// can't take down the whole write path. Returns null on
// failure so the caller can decide whether to keep the
// previous cache or null it out.
function safeRender(mdx: string): string | null {
 try {
 return renderProjectMarkdown(mdx);
 } catch (err) {
 console.error('[admin] renderProjectMarkdown failed:', err);
 return null;
 }
}

// ─── Helper: parseInt id with NaN check ────────────────────
function parseId(raw: string): number {
 const id = parseInt(raw, 10);
 if (Number.isNaN(id)) throw new AppError('Invalid id', 400);
 return id;
}

// ─── Helper: assert project exists ─────────────────────────
async function assertProject(id: number): Promise<void> {
 const exists = await prisma.project.findUnique({ where: { id }, select: { id: true } });
 if (!exists) throw new AppError('Project not found', 404);
}

// ─── POST /api/v1/admin/projects/:id/render ───────────────
// Force a re-render of bodyHtml from bodyMdx. Used after
// an editor save that bypassed the auto-render path, or to
// recover from a corrupted cache.
router.post('/projects/:id/render', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 const existing = await prisma.project.findUnique({ where: { id } });
 if (!existing) throw new AppError('Project not found', 404);
 if (!existing.bodyMdx) throw new AppError('Project has no bodyMdx to render', 400);

 const html = safeRender(existing.bodyMdx);
 if (html === null) throw new AppError('Render failed; check bodyMdx', 500);
 await prisma.project.update({ where: { id }, data: { bodyHtml: html } });
 res.json({ success: true, data: { bodyHtml: html } });
 } catch (error) { next(error); }
});

// ─── MILESTONES CRUD ─────────────────────────────────────
router.get('/projects/:id/milestones', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 await assertProject(id);
 const items = await prisma.projectMilestone.findMany({
 where: { projectId: id },
 orderBy: { order: 'asc' },
 });
 res.json({ success: true, data: items });
 } catch (error) { next(error); }
});

router.post('/projects/:id/milestones', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 await assertProject(id);
 const { phase, title, description, date, imageUrl, order, codeBlock, codeLang } = req.body;
 if (!phase?.trim()) throw new AppError('phase is required', 400);
 if (!title?.trim()) throw new AppError('title is required', 400);
 const created = await prisma.projectMilestone.create({
 data: {
 projectId: id,
 phase: phase.trim(),
 title: title.trim(),
 description: description || null,
 date: date ? new Date(date) : null,
 imageUrl: imageUrl || null,
 codeBlock: codeBlock ?? null,
 codeLang: codeLang ?? null,
 order: typeof order === 'number' ? order : 0,
 },
 });
 res.status(201).json({ success: true, data: created });
 } catch (error) { next(error); }
});

router.put('/projects/:id/milestones/:mid', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 const mid = parseId(req.params.mid);
 const existing = await prisma.projectMilestone.findUnique({ where: { id: mid } });
 if (!existing || existing.projectId !== id) throw new AppError('Milestone not found', 404);
 const { phase, title, description, date, imageUrl, order, codeBlock, codeLang } = req.body;
 const updated = await prisma.projectMilestone.update({
 where: { id: mid },
 data: {
 phase: phase ?? existing.phase,
 title: title ?? existing.title,
 description: description !== undefined ? description : existing.description,
 date: date !== undefined ? (date ? new Date(date) : null) : existing.date,
 imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
 // codeBlock / codeLang: only overwrite when the client
 // actually sent the field. Sending `null` clears it,
 // `undefined` (missing key) leaves the previous value.
 codeBlock: codeBlock !== undefined ? codeBlock : existing.codeBlock,
 codeLang: codeLang !== undefined ? codeLang : existing.codeLang,
 order: typeof order === 'number' ? order : existing.order,
 },
 });
 res.json({ success: true, data: updated });
 } catch (error) { next(error); }
});

router.delete('/projects/:id/milestones/:mid', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 const mid = parseId(req.params.mid);
 const existing = await prisma.projectMilestone.findUnique({ where: { id: mid } });
 if (!existing || existing.projectId !== id) throw new AppError('Milestone not found', 404);
 await prisma.projectMilestone.delete({ where: { id: mid } });
 res.json({ success: true, message: 'Deleted' });
 } catch (error) { next(error); }
});

// ─── FEATURES CRUD ────────────────────────────────────────
router.get('/projects/:id/features', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 await assertProject(id);
 const items = await prisma.projectFeature.findMany({
 where: { projectId: id },
 orderBy: { order: 'asc' },
 });
 res.json({ success: true, data: items });
 } catch (error) { next(error); }
});

router.post('/projects/:id/features', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 await assertProject(id);
 const { title, description, status, order } = req.body;
 if (!title?.trim()) throw new AppError('title is required', 400);
 const created = await prisma.projectFeature.create({
 data: {
 projectId: id,
 title: title.trim(),
 description: description || null,
 status: status || 'PLANNED',
 order: typeof order === 'number' ? order : 0,
 },
 });
 res.status(201).json({ success: true, data: created });
 } catch (error) { next(error); }
});

router.put('/projects/:id/features/:fid', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 const fid = parseId(req.params.fid);
 const existing = await prisma.projectFeature.findUnique({ where: { id: fid } });
 if (!existing || existing.projectId !== id) throw new AppError('Feature not found', 404);
 const { title, description, status, order } = req.body;
 const updated = await prisma.projectFeature.update({
 where: { id: fid },
 data: {
 title: title ?? existing.title,
 description: description !== undefined ? description : existing.description,
 status: status ?? existing.status,
 order: typeof order === 'number' ? order : existing.order,
 },
 });
 res.json({ success: true, data: updated });
 } catch (error) { next(error); }
});

router.delete('/projects/:id/features/:fid', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 const fid = parseId(req.params.fid);
 const existing = await prisma.projectFeature.findUnique({ where: { id: fid } });
 if (!existing || existing.projectId !== id) throw new AppError('Feature not found', 404);
 await prisma.projectFeature.delete({ where: { id: fid } });
 res.json({ success: true, message: 'Deleted' });
 } catch (error) { next(error); }
});

// ─── RESOURCES CRUD ───────────────────────────────────────
router.get('/projects/:id/resources', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 await assertProject(id);
 const items = await prisma.projectResource.findMany({
 where: { projectId: id },
 orderBy: { order: 'asc' },
 });
 res.json({ success: true, data: items });
 } catch (error) { next(error); }
});

router.post('/projects/:id/resources', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 await assertProject(id);
 const { title, url, type, fileSize, description, order } = req.body;
 if (!title?.trim()) throw new AppError('title is required', 400);
 if (!url?.trim()) throw new AppError('url is required', 400);
 const created = await prisma.projectResource.create({
 data: {
 projectId: id,
 title: title.trim(),
 url: url.trim(),
 type: type || 'LINK',
 fileSize: typeof fileSize === 'number' ? fileSize : null,
 description: description || null,
 order: typeof order === 'number' ? order : 0,
 },
 });
 res.status(201).json({ success: true, data: created });
 } catch (error) { next(error); }
});

router.put('/projects/:id/resources/:rid', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 const rid = parseId(req.params.rid);
 const existing = await prisma.projectResource.findUnique({ where: { id: rid } });
 if (!existing || existing.projectId !== id) throw new AppError('Resource not found', 404);
 const { title, url, type, fileSize, description, order } = req.body;
 const updated = await prisma.projectResource.update({
 where: { id: rid },
 data: {
 title: title ?? existing.title,
 url: url ?? existing.url,
 type: type ?? existing.type,
 fileSize: fileSize !== undefined ? (typeof fileSize === 'number' ? fileSize : null) : existing.fileSize,
 description: description !== undefined ? description : existing.description,
 order: typeof order === 'number' ? order : existing.order,
 },
 });
 res.json({ success: true, data: updated });
 } catch (error) { next(error); }
});

router.delete('/projects/:id/resources/:rid', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 const rid = parseId(req.params.rid);
 const existing = await prisma.projectResource.findUnique({ where: { id: rid } });
 if (!existing || existing.projectId !== id) throw new AppError('Resource not found', 404);
 await prisma.projectResource.delete({ where: { id: rid } });
 res.json({ success: true, message: 'Deleted' });
 } catch (error) { next(error); }
});

// ─── LIST ITEMS CRUD (Core Knowledge / Portfolio Bonus / Outcomes) ──
// All three new list sections share a single table (project_list_items)
// differentiated by the `kind` enum. One CRUD pair covers all three
// because the model is identical — only the kind varies.
//
// `kind` is part of the URL so the editor doesn't have to remember
// which kind it's saving (it always knows from the section it's in).
// Pass `kind` as a query param for the list endpoint; pass it in the
// body for create; pass it in the URL for single-item routes so a
// single GET / POST / PUT / DELETE per kind would be cleaner — we
// accept `kind` in the body for create/put to keep the URL stable.

const LIST_KINDS = new Set<ListKind>(['CORE_KNOWLEDGE', 'PORTFOLIO_BONUS', 'COMPLETION_OUTCOME']);
type ListKind = 'CORE_KNOWLEDGE' | 'PORTFOLIO_BONUS' | 'COMPLETION_OUTCOME';
function assertListKind(k: unknown): asserts k is ListKind {
 if (typeof k !== 'string' || !LIST_KINDS.has(k as ListKind)) {
 throw new AppError('Invalid list kind. Must be one of: CORE_KNOWLEDGE, PORTFOLIO_BONUS, COMPLETION_OUTCOME', 400);
 }
}

router.get('/projects/:id/list-items', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 await assertProject(id);
 const kind = String(req.query.kind ?? '');
 assertListKind(kind);
 const items = await prisma.projectListItem.findMany({
 where: { projectId: id, kind },
 orderBy: { order: 'asc' },
 });
 res.json({ success: true, data: items });
 } catch (error) { next(error); }
});

router.post('/projects/:id/list-items', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 await assertProject(id);
 const { kind, content, order } = req.body;
 assertListKind(kind);
 if (!content?.trim()) throw new AppError('content is required', 400);
 if (content.length > 500) throw new AppError('content exceeds 500 characters', 400);
 const created = await prisma.projectListItem.create({
 data: {
 projectId: id,
 kind,
 content: content.trim(),
 order: typeof order === 'number' ? order : 0,
 },
 });
 res.status(201).json({ success: true, data: created });
 } catch (error) { next(error); }
});

router.put('/projects/:id/list-items/:lid', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 const lid = parseId(req.params.lid);
 const existing = await prisma.projectListItem.findUnique({ where: { id: lid } });
 if (!existing || existing.projectId !== id) throw new AppError('List item not found', 404);
 const { content, order } = req.body;
 if (content !== undefined && content.length > 500) throw new AppError('content exceeds 500 characters', 400);
 const updated = await prisma.projectListItem.update({
 where: { id: lid },
 data: {
 content: content !== undefined ? content.trim() : existing.content,
 order: typeof order === 'number' ? order : existing.order,
 },
 });
 res.json({ success: true, data: updated });
 } catch (error) { next(error); }
});

router.delete('/projects/:id/list-items/:lid', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 const lid = parseId(req.params.lid);
 const existing = await prisma.projectListItem.findUnique({ where: { id: lid } });
 if (!existing || existing.projectId !== id) throw new AppError('List item not found', 404);
 await prisma.projectListItem.delete({ where: { id: lid } });
 res.json({ success: true, message: 'Deleted' });
 } catch (error) { next(error); }
});

export default router;
