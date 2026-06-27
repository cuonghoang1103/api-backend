/**
 * User profile routes.
 *
 * Phase 4 add. Three endpoints:
 *   - GET   /api/v1/users/me/profile     : own profile (private
 *                                            bio, contact info, etc.)
 *   - PATCH /api/v1/users/me/profile     : partial update; missing
 *                                            fields stay unchanged
 *   - GET   /api/v1/users/:id/profile    : public read of any
 *                                            user (visibility rules
 *                                            can be added later)
 *
 * Mounted at /api/v1/users by src/index.ts. The route is auth-
 * gated (auth-only — no admin role required for the public read)
 * because the public read exposes only public-safe fields.
 */

import { Router, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { prisma } from '../config/database.js';
import {
  getOwnProfile,
  getProfileById,
  updateOwnProfile,
} from '../services/userProfile.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

/** GET /api/v1/users/me/profile — own profile. Returns the full
 *  row + the user's basic display fields. The frontend's
 *  profile page reads this to render the header section. */
router.get('/me/profile', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const profile = await getOwnProfile(req.user.userId);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

/** PATCH /api/v1/users/me/profile — partial update.
 *  Body: any subset of { bio, coverPhoto, location,
 *                          websiteUrl, work, education }.
 *  Empty string sets the field to NULL. */
router.patch('/me/profile', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const input = {
      bio: req.body.bio,
      coverPhoto: req.body.coverPhoto,
      location: req.body.location,
      websiteUrl: req.body.websiteUrl,
      work: req.body.work,
      education: req.body.education,
    };
    // Normalise "" → null so the UI can clear a field by
    // sending an empty string (e.g. the user removes the bio
    // textarea and hits save). Without this, "" would be
    // stored as an empty string and the UI would show
    // "empty bio" instead of a placeholder.
    for (const k of Object.keys(input) as Array<keyof typeof input>) {
      if (input[k] === '') input[k] = null;
    }
    const profile = await updateOwnProfile(req.user.userId, input);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

/** GET /api/v1/users/:id/profile — public read. We don't gate
 *  by visibility at the service level (every profile is
 *  readable); the client can choose what to show based on
 *  privacy settings. We DO respect blocked users at a
 *  later iteration (out of scope here). */
router.get('/:id/profile', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('id khong hop le', 400, 'INVALID_ID');
    }
    const profile = await getProfileById(id, req.user.userId);
    if (!profile) throw new AppError('Profile not found', 404, 'PROFILE_NOT_FOUND');
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

/** GET /api/v1/users/:id/posts — paginated list of posts by
 *  user `id` for the profile page's Bài viết tab. We use
 *  cursor pagination (id < cursor) so the profile page can
 *  scroll indefinitely without re-rendering the whole list.
 *  Same shape as the main feed but filtered to a single
 *  author. */
router.get('/:id/posts', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('id khong hop le', 400, 'INVALID_ID');
    }
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const type = req.query.type as string | undefined;

    const where: Record<string, unknown> = {
      authorId: id,
      status: 'PUBLISHED',
    };
    if (type && ['POST', 'VIDEO', 'FILE'].includes(type)) {
      where.type = type;
    }
    if (cursor != null && Number.isInteger(cursor) && cursor > 0) {
      where.id = { lt: cursor };
    }

    const items = await prisma.socialPost.findMany({
      where,
      orderBy: { id: 'desc' },
      take: limit,
      // Use the same include shape as the feed so the
      // frontend can reuse the PostCard without per-shape
      // branching.
      include: {
        author: {
          select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
        },
        media: {
          orderBy: { sortOrder: 'asc' as const },
          select: {
            id: true, type: true, url: true, thumbnail: true,
            width: true, height: true, duration: true, sortOrder: true,
          },
        },
        poll: { include: { options: { orderBy: { sortOrder: 'asc' as const } } } },
        postMusic: { include: { song: true } },
        _count: {
          select: { likes: true, comments: true, saves: true },
        },
        likes: req.user.userId ? { where: { userId: req.user.userId }, select: { id: true } } : false,
        saves: req.user.userId ? { where: { userId: req.user.userId }, select: { id: true } } : false,
      },
    });
    const hasMore = items.length === limit;
    const sliced = items.slice(0, limit);
    const nextCursor = hasMore ? sliced[sliced.length - 1]?.id : null;

    // Reuse the feed's serializer so the same shape is shipped
    // to the profile page that the feed uses. We import lazily
    // to avoid a circular import (social.service depends on
    // prisma; the serializer is internal to it).
    const { serializePost } = await import('../services/social.service.js');
    const data = sliced.map((post: any) => serializePost(post, {
      currentUserId: req.user.userId,
      pollUserVotes: [],
      reactionBreakdown: { LIKE: 0, LOVE: 0, HAHA: 0, SAD: 0, ANGRY: 0 },
      myReactionType: null,
    }));

    res.json({
      success: true,
      data: { items: data, nextCursor, hasMore, limit },
    });
  } catch (err) {
    next(err);
  }
});

/** GET /api/v1/users/:id/media — paginated list of media items
 *  by user `id` for the profile page's Grid tab. We return the
 *  raw media items (not wrapped in a post) so the frontend
 *  can render a flat 3-col grid without an extra fetch. */
router.get('/:id/media', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('id khong hop le', 400, 'INVALID_ID');
    }
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 30));
    const type = req.query.type as string | undefined;

    const where: Record<string, unknown> = {
      post: { authorId: id, status: 'PUBLISHED' as const },
    };
    if (type && type !== 'FILE') where.type = type; // grid = IMAGE | VIDEO
    if (cursor != null && Number.isInteger(cursor) && cursor > 0) {
      where.id = { lt: cursor };
    }

    const items = await prisma.socialMedia.findMany({
      where,
      orderBy: { id: 'desc' },
      take: limit,
      include: {
        post: {
          select: {
            id: true, content: true, createdAt: true, type: true,
            author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          },
        },
      },
    });
    const hasMore = items.length === limit;
    const sliced = items.slice(0, limit);
    const nextCursor = hasMore ? sliced[sliced.length - 1]?.id : null;

    res.json({
      success: true,
      data: { items: sliced, nextCursor, hasMore },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
