/**
 * ============================================================
 * User Routes — Social Profile & Follow
 * ============================================================
 *
 * Mounted at /api/v1/users
 *
 * Endpoints:
 *   GET    /api/v1/users/suggestions        — Suggested users to follow
 *   GET    /api/v1/users/search             — Mention autocomplete
 *   GET    /api/v1/users/me/profile         — Own profile (incl. bio)
 *   PATCH  /api/v1/users/me/profile         — Update own profile
 *   GET    /api/v1/users/:id/profile        — Public profile by id
 *   GET    /api/v1/users/:id/posts          — Cursor-paginated posts
 *   GET    /api/v1/users/:id/media          — Cursor-paginated media grid
 *   GET    /api/v1/users/:id/liked          — Cursor-paginated liked posts
 *   GET    /api/v1/users/:id                — Enhanced public profile
 *   POST   /api/v1/users/follow             — Follow / unfollow (toggle)
 *   GET    /api/v1/users/:id/followers      — List followers
 *   GET    /api/v1/users/:id/following      — List following
 *   POST   /api/v1/users/status             — Update presence (lastActiveAt)
 *   POST   /api/v1/users/cover-photo        — Update cover photo URL
 */

import { Router, type Response } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { prisma } from '../config/database.js';
import {
  toggleFollow,
  getEnhancedPublicProfile,
  getFollowStatus,
  getFollowers,
  getFollowing,
  updatePresence,
  updateCoverPhoto,
  getSuggestedUsers,
  searchMentionableUsers,
} from '../services/follow.service.js';
import {
  getOwnProfile,
  getProfileById,
  updateOwnProfile,
} from '../services/userProfile.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/users/suggestions ─────────────────────────
// Returns users the current user might want to follow
// NOTE: This route MUST be defined BEFORE /:id otherwise
// Express matches "suggestions" as a :id parameter.
router.get(
  '/suggestions',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 20);
      const users = await getSuggestedUsers(req.user.userId!, limit);
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },
);

// ─── GET /api/v1/users/search ────────────────────────────────
// Phase 5 home upgrade: mention autocomplete. Drives the `@cuong`
// dropdown in the comment + post composer. Matches `username`,
// `displayName`, or `fullName` (case-insensitive). Capped at 8.
//
// NOTE: must be defined BEFORE /:id otherwise Express matches
// "search" as :id.
router.get(
  '/search',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const q = (req.query.q as string | undefined) ?? '';
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 8, 8);
      const users = await searchMentionableUsers(req.user.userId!, q, limit);
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },
);

// ─── GET /api/v1/users/:id ──────────────────────────────────
// Enhanced public profile: follows counts, isFollowing, isOnline
router.get(
  '/:id',
  optionalAuth,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) throw new AppError('Invalid user ID', 400, 'INVALID_ID');

      const profile = await getEnhancedPublicProfile(id, req.user?.userId);
      if (!profile) throw new AppError('Người dùng không tồn tại', 404, 'USER_NOT_FOUND');

      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/users/follow ────────────────────────────────
// Toggle follow. Body: { targetId: number }
router.post(
  '/follow',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const { targetId } = req.body as { targetId?: number };
      if (!targetId || isNaN(targetId)) {
        throw new AppError('targetId is required', 400, 'VALIDATION_ERROR');
      }

      const result = await toggleFollow(req.user.userId!, targetId);

      // Re-fetch counts so frontend can update its local state
      const status = await getFollowStatus(req.user.userId!, targetId);

      res.json({
        success: true,
        data: { ...result, ...status },
      });
    } catch (error) {
      next(error);
    }
  },
);

// ─── GET /api/v1/users/:id/followers ────────────────────────
router.get(
  '/:id/followers',
  optionalAuth,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) throw new AppError('Invalid user ID', 400, 'INVALID_ID');

      const cursor = req.query.cursor ? parseInt(req.query.cursor as string, 10) : undefined;
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 50);

      const result = await getFollowers(id, cursor, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ─── GET /api/v1/users/:id/following ─────────────────────────
router.get(
  '/:id/following',
  optionalAuth,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) throw new AppError('Invalid user ID', 400, 'INVALID_ID');

      const cursor = req.query.cursor ? parseInt(req.query.cursor as string, 10) : undefined;
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 50);

      const result = await getFollowing(id, cursor, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/users/status ───────────────────────────────
// Called by frontend on page load / activity to refresh lastActiveAt.
router.post(
  '/status',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      await updatePresence(req.user.userId!);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/users/cover-photo ────────────────────────
// Body: { coverPhotoUrl: string }
router.post(
  '/cover-photo',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const { coverPhotoUrl } = req.body as { coverPhotoUrl?: string };
      if (!coverPhotoUrl) throw new AppError('coverPhotoUrl is required', 400, 'VALIDATION_ERROR');

      await updateCoverPhoto(req.user.userId!, coverPhotoUrl);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// ─── Profile routes (Phase 4) ────────────────────────────────
// These were originally in a separate `users.routes.ts` file
// that was never mounted under /api/v1/users, so the frontend
// calls to /users/me/profile, /users/:id/profile, etc. were
// 404'ing in production. They've been folded into this router
// so they actually serve. The legacy file is now dead code
// (see commit message).
// ════════════════════════════════════════════════════════════════

// ─── GET /api/v1/users/me/profile ─────────────────────────────
router.get('/me/profile', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const profile = await getOwnProfile(req.user.userId);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/v1/users/me/profile ──────────────────────────
// Body: any subset of { bio, coverPhoto, location, websiteUrl, work,
//   education, hometown, jobTitle, workplace, school, college,
//   relationshipStatus, hobbies, languages }.
// Empty string sets the field to NULL.
router.patch('/me/profile', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const input = {
      bio: req.body.bio,
      coverPhoto: req.body.coverPhoto,
      location: req.body.location,
      websiteUrl: req.body.websiteUrl,
      work: req.body.work,
      education: req.body.education,
      hometown: req.body.hometown,
      jobTitle: req.body.jobTitle,
      workplace: req.body.workplace,
      school: req.body.school,
      college: req.body.college,
      relationshipStatus: req.body.relationshipStatus,
      hobbies: req.body.hobbies,
      languages: req.body.languages,
    };
    // "" → null so the UI can clear a field by sending an empty
    // string (e.g. user removes the bio textarea and hits save).
    for (const k of Object.keys(input) as Array<keyof typeof input>) {
      if (input[k] === '') input[k] = null;
    }
    const profile = await updateOwnProfile(req.user.userId, input);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/users/:id/profile (public read) ─────────────
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

// ─── GET /api/v1/users/:id/posts (Bài viết tab) ──────────────
// Cursor-paginated list of posts by user `id`. Same shape as the
// main feed so the frontend can reuse PostCard without per-shape
// branching. `type` filters by content-type bucket (POST|VIDEO|FILE).
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
        _count: { select: { likes: true, comments: true, saves: true } },
        likes: req.user.userId ? { where: { userId: req.user.userId }, select: { id: true } } : false,
        saves: req.user.userId ? { where: { userId: req.user.userId }, select: { id: true } } : false,
        // Phase 6: Include shares to determine if current user has shared this post
        shares: req.user.userId ? { where: { userId: req.user.userId }, select: { id: true } } : false,
      },
    });
    const hasMore = items.length === limit;
    const sliced = items.slice(0, limit);
    const nextCursor = hasMore ? sliced[sliced.length - 1]?.id : null;

    // Phase 6 — legacy music lookup for posts that have only the
    // legacy `musicTrackId` column populated (no PostMusic join row).
    // getFeed does this with a bulk query; here we just do a single
    // per-id lookup since the profile tab loads ≤ limit posts.
    const legacySongIds = sliced
      .filter((p: any) => p.musicTrackId && !p.postMusic?.song)
      .map((p: any) => p.musicTrackId);
    const legacySongs = legacySongIds.length > 0
      ? await prisma.song.findMany({
          where: { id: { in: legacySongIds } },
          select: { id: true, title: true, artist: true, audioUrl: true, coverImage: true, durationSec: true },
        })
      : [];
    const legacySongById = new Map(legacySongs.map((s) => [s.id, s]));

    const { serializePost } = await import('../services/social.service.js');
    const data = sliced.map((post: any) => {
      if (post.musicTrackId && !post.postMusic?.song && legacySongById.has(post.musicTrackId)) {
        post._song = legacySongById.get(post.musicTrackId);
      }
      return serializePost(post, {
        currentUserId: req.user.userId,
        pollUserVotes: [],
        reactionBreakdown: { LIKE: 0, LOVE: 0, HAHA: 0, SAD: 0, ANGRY: 0 },
        myReactionType: null,
      });
    });

    res.json({ success: true, data: { items: data, nextCursor, hasMore, limit } });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/users/:id/media (Grid tab) ───────────────────
// Returns raw SocialMedia items (not wrapped in a post) so the
// frontend can render a flat 3-col grid without an extra fetch.
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

    res.json({ success: true, data: { items: sliced, nextCursor, hasMore } });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/users/:id/liked (Đã thích tab) ───────────────
// Cursor-paginated list of posts the user has LIKED. We dedupe
// so the same post only appears once even if the user reacted
// with multiple emojis over time (the API still accepts the
// legacy 'LIKE' type alongside the new emoji types — see the
// unique constraint on SocialLike). Cursor is the SocialLike.id
// so pagination stays stable across re-fetches.
//
// Privacy: a user can only see THEIR OWN liked list. Public
// profiles don't expose "what this person liked" — that's a
// common UX expectation (Twitter/Facebook both gate this).
router.get('/:id/liked', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('id khong hop le', 400, 'INVALID_ID');
    }
    // Only the owner can list their own likes. Block everyone else
    // (404 — not 403 — so we don't leak whether the user exists).
    if (req.user.userId !== id) {
      throw new AppError('Not found', 404, 'NOT_FOUND');
    }

    const cursor = req.query.cursor ? Number(req.query.cursor) : null;
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    // Step 1 — load the user's like rows newest-first. We dedupe
    // by postId so the same post only appears once even if the
    // user has reacted with multiple emojis over time.
    const likes = await prisma.socialLike.findMany({
      where: { userId: id },
      orderBy: { id: 'desc' },
      take: limit * 2, // overfetch in case of dupes
      ...(cursor != null && Number.isInteger(cursor) && cursor > 0
        ? { cursor: { id: cursor }, skip: 1 }
        : {}),
      select: {
        id: true,
        postId: true,
        type: true,
        createdAt: true,
      },
    });

    // Dedupe by postId, keeping the most recent like row id as
    // the cursor anchor for the NEXT page (so we don't loop on
    // the same post).
    const seenPostIds = new Set<number>();
    const dedupedLikes: typeof likes = [];
    for (const l of likes) {
      if (seenPostIds.has(l.postId)) continue;
      seenPostIds.add(l.postId);
      dedupedLikes.push(l);
      if (dedupedLikes.length >= limit) break;
    }

    const postIds = dedupedLikes.map((l) => l.postId);
    const lastLikeId = dedupedLikes.length > 0
      ? dedupedLikes[dedupedLikes.length - 1].id
      : null;

    // Step 2 — load the actual posts (skip deleted/private).
    // The include mirrors getFeed so the frontend PostCard
    // receives the same shape (author, media, music, counts,
    // viewer's own like/save).
    const posts = postIds.length === 0
      ? []
      : await prisma.socialPost.findMany({
          where: {
            id: { in: postIds },
            status: 'PUBLISHED',
          },
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
            _count: { select: { likes: true, comments: true, saves: true } },
            likes: { where: { userId: id }, select: { id: true, type: true } },
            saves: { where: { userId: id }, select: { id: true } },
          },
        });

    // Re-order by like-time (desc) — Prisma returned them by post.id
    // ordering, but we want newest-liked first.
    const postById = new Map(posts.map((p) => [p.id, p]));
    const orderedPosts = postIds
      .map((pid) => postById.get(pid))
      .filter((p): p is NonNullable<typeof p> => !!p);

    // Serialize using the same helper as the feed so PostCard
    // gets the canonical shape (including postMusic.song →
    // musicTrack mapping fixed below).
    //
    // Phase 6 — legacy music lookup for posts that have only the
    // legacy `musicTrackId` column populated (no PostMusic join row).
    const legacySongIdsLiked = orderedPosts
      .filter((p: any) => p.musicTrackId && !p.postMusic?.song)
      .map((p: any) => p.musicTrackId);
    const legacySongsLiked = legacySongIdsLiked.length > 0
      ? await prisma.song.findMany({
          where: { id: { in: legacySongIdsLiked } },
          select: { id: true, title: true, artist: true, audioUrl: true, coverImage: true, durationSec: true },
        })
      : [];
    const legacySongByIdLiked = new Map(legacySongsLiked.map((s) => [s.id, s]));

    const { serializePost } = await import('../services/social.service.js');
    const data = orderedPosts.map((post: any) => {
      if (post.musicTrackId && !post.postMusic?.song && legacySongByIdLiked.has(post.musicTrackId)) {
        post._song = legacySongByIdLiked.get(post.musicTrackId);
      }
      // Compute the viewer's reaction breakdown for THIS post so
      // PostCard highlights the correct emoji.
      const breakdown = { LIKE: 0, LOVE: 0, HAHA: 0, SAD: 0, ANGRY: 0 };
      let myReactionType: string | null = null;
      for (const l of post.likes ?? []) {
        const t = String(l.type || 'LIKE').toUpperCase();
        if (t in breakdown) {
          (breakdown as Record<string, number>)[t] =
            ((breakdown as Record<string, number>)[t] ?? 0) + 1;
        }
        if (l.type === myReactionType) {
          // no-op; keeps tsc happy
        }
        if (!myReactionType) myReactionType = t;
      }
      return serializePost(post, {
        currentUserId: id,
        pollUserVotes: [],
        reactionBreakdown: breakdown,
        myReactionType,
      });
    });

    const hasMore = likes.length > limit;
    // nextCursor = the LAST seen SocialLike.id so the next page
    // picks up from there. Using the like row id (not post id)
    // keeps pagination stable even if a post is deleted.
    const nextCursor = hasMore ? lastLikeId : null;

    res.json({ success: true, data: { items: data, nextCursor, hasMore, limit } });
  } catch (err) {
    next(err);
  }
});

export default router;
