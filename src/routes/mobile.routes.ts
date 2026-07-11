import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/mobile/home ────────────────────────────────
// Aggregated home feed for mobile app
router.get('/home', async (req, res: Response<ApiResponse>, next) => {
  try {
    const [featuredCourses, recentPosts, featuredProducts] = await Promise.all([
      prisma.course.findMany({
        where: { isPublished: true, isFeatured: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          shortDescription: true,
          thumbnailUrl: true,
          price: true,
          isFree: true,
          accessType: true,
          totalLessons: true,
          totalDurationSeconds: true,
          avgRating: true,
          instructor: { select: { username: true, avatarUrl: true } },
          semester: { select: { name: true, code: true } },
        },
      }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        take: 5,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          thumbnailUrl: true,
          viewCount: true,
          isFeatured: true,
          publishedAt: true,
          author: { select: { username: true, avatarUrl: true } },
          category: { select: { name: true, slug: true } },
        },
      }),
      prisma.product.findMany({
        where: { active: true, featured: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          thumbnailUrl: true,
          price: true,
          originalPrice: true,
          isHot: true,
          isNew: true,
          soldCount: true,
        },
      }),
    ]);

    // Serialize courses
    const courses = featuredCourses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      shortDescription: c.shortDescription,
      thumbnailUrl: c.thumbnailUrl,
      price: Number(c.price),
      isFree: c.isFree,
      accessType: c.accessType,
      totalLessons: c.totalLessons,
      totalDurationSeconds: c.totalDurationSeconds,
      avgRating: Number(c.avgRating),
      instructorName: c.instructor?.username,
      instructorAvatar: c.instructor?.avatarUrl,
      semesterName: c.semester?.name,
      semesterCode: c.semester?.code,
    }));

    // Serialize posts
    const posts = recentPosts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      thumbnailUrl: p.thumbnailUrl,
      viewCount: p.viewCount,
      isFeatured: p.isFeatured,
      publishedAt: p.publishedAt,
      authorName: p.author?.username,
      authorAvatar: p.author?.avatarUrl,
      categoryName: p.category?.name,
      categorySlug: p.category?.slug,
    }));

    // Serialize products
    const products = featuredProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      thumbnailUrl: p.thumbnailUrl,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      isHot: p.isHot,
      isNew: p.isNew,
      soldCount: p.soldCount,
    }));

    res.json({
      success: true,
      data: {
        featuredCourses: courses,
        recentPosts: posts,
        featuredProducts: products,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/mobile/semesters ─────────────────────────
// Semesters with course counts for Academy tab
router.get('/semesters', async (req, res: Response<ApiResponse>, next) => {
  try {
    const semesters = await prisma.semester.findMany({
      where: { isActive: true },
      orderBy: [{ ordinal: 'asc' }, { id: 'asc' }],
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });

    const result = semesters.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      ordinal: s.ordinal,
      description: s.description,
      courseCount: s._count.courses,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/mobile/semester/:id/courses ──────────────
// Courses in a semester
router.get('/semester/:id/courses', async (req, res: Response<ApiResponse>, next) => {
  try {
    const semesterId = parseInt(req.params.id, 10);
    if (Number.isNaN(semesterId)) {
      throw new Error('Invalid semester ID');
    }

    const courses = await prisma.course.findMany({
      where: {
        semesterId,
        isPublished: true,
      },
      orderBy: [{ courseCode: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        thumbnailUrl: true,
        price: true,
        isFree: true,
        accessType: true,
        level: true,
        totalLessons: true,
        totalDurationSeconds: true,
        avgRating: true,
        totalStudents: true,
        instructor: { select: { username: true, avatarUrl: true } },
      },
    });

    const result = courses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      shortDescription: c.shortDescription,
      thumbnailUrl: c.thumbnailUrl,
      price: Number(c.price),
      isFree: c.isFree,
      accessType: c.accessType,
      level: c.level,
      totalLessons: c.totalLessons,
      totalDurationSeconds: c.totalDurationSeconds,
      avgRating: Number(c.avgRating),
      totalStudents: c.totalStudents,
      instructorName: c.instructor?.username,
      instructorAvatar: c.instructor?.avatarUrl,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/mobile/blog/posts ─────────────────────────
// Optimized post list for mobile
router.get('/blog/posts', async (req, res: Response<ApiResponse>, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const size = Math.min(20, Math.max(1, parseInt(req.query.size as string) || 10));
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
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          thumbnailUrl: true,
          viewCount: true,
          isFeatured: true,
          publishedAt: true,
          author: { select: { username: true, avatarUrl: true } },
          category: { select: { name: true, slug: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    const result = posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      thumbnailUrl: p.thumbnailUrl,
      viewCount: p.viewCount,
      isFeatured: p.isFeatured,
      publishedAt: p.publishedAt,
      authorName: p.author?.username,
      authorAvatar: p.author?.avatarUrl,
      categoryName: p.category?.name,
      categorySlug: p.category?.slug,
      commentCount: p._count.comments,
    }));

    res.json({
      success: true,
      data: result,
      pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/mobile/blog/featured ─────────────────────
// Featured posts for mobile
router.get('/blog/featured', async (req, res: Response<ApiResponse>, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      take: 5,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnailUrl: true,
        viewCount: true,
        isFeatured: true,
        publishedAt: true,
        author: { select: { username: true, avatarUrl: true } },
        category: { select: { name: true, slug: true } },
      },
    });

    const result = posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      thumbnailUrl: p.thumbnailUrl,
      viewCount: p.viewCount,
      isFeatured: p.isFeatured,
      publishedAt: p.publishedAt,
      authorName: p.author?.username,
      authorAvatar: p.author?.avatarUrl,
      categoryName: p.category?.name,
      categorySlug: p.category?.slug,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/mobile/shop/products ─────────────────────
// Optimized product list for mobile
router.get('/shop/products', async (req, res: Response<ApiResponse>, next) => {
  try {
    const page = Math.max(0, parseInt(req.query.page as string) || 0);
    const size = Math.max(1, parseInt(req.query.size as string) || 12);
    const skip = page * size;
    const { category, keyword } = req.query;

    const where: Record<string, unknown> = { active: true };
    if (category) {
      where.category = { slug: String(category) };
    }
    if (keyword) {
      where.OR = [
        { name: { contains: String(keyword), mode: 'insensitive' } },
        { shortDescription: { contains: String(keyword), mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          thumbnailUrl: true,
          price: true,
          originalPrice: true,
          isHot: true,
          isNew: true,
          soldCount: true,
          category: { select: { name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const result = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      thumbnailUrl: p.thumbnailUrl,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      isHot: p.isHot,
      isNew: p.isNew,
      soldCount: p.soldCount,
      categoryName: p.category?.name,
      categorySlug: p.category?.slug,
    }));

    res.json({
      success: true,
      data: result,
      pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/mobile/shop/featured ─────────────────────
// Featured products for mobile
router.get('/shop/featured', async (req, res: Response<ApiResponse>, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true, featured: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        thumbnailUrl: true,
        price: true,
        originalPrice: true,
        isHot: true,
        isNew: true,
        soldCount: true,
        category: { select: { name: true, slug: true } },
      },
    });

    const result = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      thumbnailUrl: p.thumbnailUrl,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      isHot: p.isHot,
      isNew: p.isNew,
      soldCount: p.soldCount,
      categoryName: p.category?.name,
      categorySlug: p.category?.slug,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/mobile/profile/:username ─────────────────
// Public profile for mobile
router.get('/profile/:username', async (req, res: Response<ApiResponse>, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: { equals: req.params.username, mode: 'insensitive' },
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        coverPhotoUrl: true,
        gender: true,
        birthYear: true,
        lastActiveAt: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Get user's social links
    const socialLinks = await prisma.socialLink.findMany({
      where: { userId: user.id },
      orderBy: { sortOrder: 'asc' },
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        coverPhotoUrl: user.coverPhotoUrl,
        gender: user.gender,
        birthYear: user.birthYear,
        lastActiveAt: user.lastActiveAt,
        createdAt: user.createdAt,
        followerCount: user._count.followers,
        followingCount: user._count.following,
        postCount: user._count.posts,
        socialLinks: socialLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
          username: link.username,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/mobile/profile/public ────────────────────
// Get public profile (for app owner - cuonghoang)
router.get('/profile/public', async (req, res: Response<ApiResponse>, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: 'cuonghoang', mode: 'insensitive' } },
          { email: { contains: 'cuongthai', mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        coverPhotoUrl: true,
        gender: true,
        birthYear: true,
        lastActiveAt: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'Public profile not found' });
      return;
    }

    const socialLinks = await prisma.socialLink.findMany({
      where: { userId: user.id },
      orderBy: { sortOrder: 'asc' },
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        coverPhotoUrl: user.coverPhotoUrl,
        gender: user.gender,
        birthYear: user.birthYear,
        lastActiveAt: user.lastActiveAt,
        createdAt: user.createdAt,
        followerCount: user._count.followers,
        followingCount: user._count.following,
        postCount: user._count.posts,
        socialLinks: socialLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
          username: link.username,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
