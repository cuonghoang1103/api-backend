/**
 * ============================================================
 * Social Feed Routes — Personal Social Network
 * ============================================================
 *
 * Endpoints:
 *   POST   /api/v1/social/posts          — Create post
 *   GET    /api/v1/social/posts          — List feed
 *   GET    /api/v1/social/posts/:id      — Get single post
 *   DELETE /api/v1/social/posts/:id      — Delete post
 *   PATCH  /api/v1/social/posts/:id      — Update post
 *
 *   POST   /api/v1/social/posts/:id/like        — Like post
 *   DELETE /api/v1/social/posts/:id/like        — Unlike post
 *
 *   POST   /api/v1/social/comments             — Create comment
 *   GET    /api/v1/social/posts/:id/comments   — List comments
 *   DELETE /api/v1/social/comments/:id         — Delete comment
 *   PATCH  /api/v1/social/comments/:id         — Edit comment
 *   POST   /api/v1/social/comments/:id/like    — Like comment
 *
 *   POST   /api/v1/social/posts/:id/save   — Save post
 *   DELETE /api/v1/social/posts/:id/save   — Unsave post
 *   GET    /api/v1/social/saves           — List saved posts
 *   GET    /api/v1/social/saves/folders   — List save folders
 *
 *   POST   /api/v1/social/posts/:id/share — Share post
 *
 *   GET    /api/v1/social/users/:id       — Public profile (sanitised)
 * ============================================================
 */

import { Router, type Response } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { prisma } from '../config/database.js';
import {
  createPost,
  getPostById,
  deletePost,
  updatePost,
  getFeed,
  likePost,
  unlikePost,
  createComment,
  getComments,
  deleteComment,
  updateComment,
  likeComment,
  savePost,
  unsavePost,
  getSavedPosts,
  getSaveFolders,
  sharePost,
  votePoll,
  getPollForViewer,
} from '../services/social.service.js';

const router = Router();

// ─── Helper to extract userId from auth ─────────────────────────

function getUserId(req: any): number {
  if (!req.user || !req.user.userId) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }
  return req.user.userId;
}

// ════════════════════════════════════════════════════════════════
// POST /api/v1/social/posts — Create post
// ════════════════════════════════════════════════════════════════
router.post(
  '/posts',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const { content, visibility, latitude, longitude, locationName, media, poll, youtubeUrl } = req.body;

      // A post is valid as long as *something* goes on the
      // timeline: text, at least one media row, a YouTube link,
      // or a poll. Photos-only or video-only posts (no caption)
      // were rejected with 400 "Post content is required" which
      // was the source of the "upload image/video thất bại"
      // complaint — the upload itself worked, the post create
      // immediately after didn't.
      const hasText = typeof content === 'string' && content.trim().length > 0;
      const hasMedia = Array.isArray(media) && media.length > 0;
      const hasYouTube = typeof youtubeUrl === 'string' && youtubeUrl.trim().length > 0;
      const hasPoll = !!(poll && poll.question && Array.isArray(poll.options) && poll.options.length >= 2);
      if (!hasText && !hasMedia && !hasYouTube && !hasPoll) {
        throw new AppError('Post must include text, media, a YouTube link, or a poll', 400, 'MISSING_CONTENT');
      }

      // Light YouTube URL validation. We don't try to verify the
      // link is live — the post card renderer is the final judge.
      // We just enforce max length and a reasonable shape so the
      // database column can't be abused to store arbitrary blobs.
      let cleanedYoutubeUrl: string | undefined = undefined;
      if (youtubeUrl && typeof youtubeUrl === 'string') {
        const trimmed = youtubeUrl.trim();
        if (trimmed.length > 0) {
          if (trimmed.length > 500) {
            throw new AppError('YouTube URL is too long', 400, 'YOUTUBE_URL_TOO_LONG');
          }
          cleanedYoutubeUrl = trimmed;
        }
      }

      const post = await createPost({
        authorId: userId,
        content: content.trim(),
        visibility: visibility || 'PUBLIC',
        latitude,
        longitude,
        locationName,
        youtubeUrl: cleanedYoutubeUrl,
        media,
        poll,
      });

      res.status(201).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/posts — Feed with pagination
// ════════════════════════════════════════════════════════════════
  router.get(
  '/posts',
  optionalAuth,
  async (req: any, res: any, next) => {
    try {
      const currentUserId = req.user?.userId;
      const { cursor, limit = '20', authorId, visibility } = req.query;

      const result = await getFeed({
        cursor: cursor ? parseInt(cursor as string, 10) : undefined,
        limit: Math.min(parseInt(limit as string, 10) || 20, 50),
        authorId: authorId ? parseInt(authorId as string, 10) : undefined,
        visibility: visibility as string | undefined,
        currentUserId,
      });

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/posts/:id — Single post
// ════════════════════════════════════════════════════════════════
router.get(
  '/posts/:id',
  optionalAuth,
  async (req: any, res: Response<any>, next) => {
    try {
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId)) throw new AppError('Invalid post ID', 400, 'INVALID_ID');

      const currentUserId = req.user?.userId;
      const post = await getPostById(postId, currentUserId);
      res.json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// DELETE /api/v1/social/posts/:id — Delete post
// ════════════════════════════════════════════════════════════════
router.delete(
  '/posts/:id',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId)) throw new AppError('Invalid post ID', 400, 'INVALID_ID');

      const result = await deletePost(postId, userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// PATCH /api/v1/social/posts/:id — Update post
// ════════════════════════════════════════════════════════════════
router.patch(
  '/posts/:id',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId)) throw new AppError('Invalid post ID', 400, 'INVALID_ID');

      const { content, visibility } = req.body;
      const result = await updatePost(postId, userId, { content, visibility });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/social/posts/:id/like — Like post
// ════════════════════════════════════════════════════════════════
router.post(
  '/posts/:id/like',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId)) throw new AppError('Invalid post ID', 400, 'INVALID_ID');

      const result = await likePost(postId, userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// DELETE /api/v1/social/posts/:id/like — Unlike post
// ════════════════════════════════════════════════════════════════
router.delete(
  '/posts/:id/like',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId)) throw new AppError('Invalid post ID', 400, 'INVALID_ID');

      const result = await unlikePost(postId, userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/posts/:id/comments — List comments
// ════════════════════════════════════════════════════════════════
router.get(
  '/posts/:id/comments',
  optionalAuth,
  async (req: any, res: Response<any>, next) => {
    try {
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId)) throw new AppError('Invalid post ID', 400, 'INVALID_ID');

      const { cursor, limit = '20' } = req.query;
      const result = await getComments(postId, {
        cursor: cursor ? parseInt(cursor as string, 10) : undefined,
        limit: parseInt(limit as string, 10) || 20,
      });

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/social/comments — Create comment
// ════════════════════════════════════════════════════════════════
router.post(
  '/comments',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const { postId, parentId, content } = req.body;

      if (!postId || isNaN(parseInt(postId, 10))) {
        throw new AppError('Valid postId is required', 400, 'INVALID_POST_ID');
      }
      if (!content?.trim()) {
        throw new AppError('Comment content is required', 400, 'MISSING_CONTENT');
      }

      const comment = await createComment({
        userId,
        postId: parseInt(postId, 10),
        parentId: parentId ? parseInt(parentId, 10) : undefined,
        content: content.trim(),
      });

      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// DELETE /api/v1/social/comments/:id — Delete comment
// ════════════════════════════════════════════════════════════════
router.delete(
  '/comments/:id',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const commentId = parseInt(req.params.id, 10);
      if (isNaN(commentId)) throw new AppError('Invalid comment ID', 400, 'INVALID_ID');

      const result = await deleteComment(commentId, userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// PATCH /api/v1/social/comments/:id — Edit comment
// ════════════════════════════════════════════════════════════════
router.patch(
  '/comments/:id',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const commentId = parseInt(req.params.id, 10);
      if (isNaN(commentId)) throw new AppError('Invalid comment ID', 400, 'INVALID_ID');
      if (!req.body.content?.trim()) {
        throw new AppError('Content is required', 400, 'MISSING_CONTENT');
      }

      const result = await updateComment(commentId, userId, req.body.content.trim());
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/social/comments/:id/like — Like comment
// ════════════════════════════════════════════════════════════════
router.post(
  '/comments/:id/like',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const commentId = parseInt(req.params.id, 10);
      if (isNaN(commentId)) throw new AppError('Invalid comment ID', 400, 'INVALID_ID');

      const result = await likeComment(commentId, userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/social/posts/:id/save — Save post
// ════════════════════════════════════════════════════════════════
router.post(
  '/posts/:id/save',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId)) throw new AppError('Invalid post ID', 400, 'INVALID_ID');

      const { folder } = req.body;
      const result = await savePost(postId, userId, folder);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// DELETE /api/v1/social/posts/:id/save — Unsave post
// ════════════════════════════════════════════════════════════════
router.delete(
  '/posts/:id/save',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId)) throw new AppError('Invalid post ID', 400, 'INVALID_ID');

      const result = await unsavePost(postId, userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/saves — List saved posts
// ════════════════════════════════════════════════════════════════
router.get(
  '/saves',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const { cursor, limit = '20', folder } = req.query;

      const result = await getSavedPosts(
        userId,
        folder as string | undefined,
        cursor ? parseInt(cursor as string, 10) : undefined,
        Math.min(parseInt(limit as string, 10) || 20, 50),
      );

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/saves/folders — List save folders
// ════════════════════════════════════════════════════════════════
router.get(
  '/saves/folders',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const result = await getSaveFolders(userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/social/posts/:id/share — Share post
// ════════════════════════════════════════════════════════════════
router.post(
  '/posts/:id/share',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId)) throw new AppError('Invalid post ID', 400, 'INVALID_ID');

      const { platform } = req.body;
      const result = await sharePost(postId, userId, platform);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/trending — Top hashtags (last 7 days)
// ════════════════════════════════════════════════════════════════
// Lightweight endpoint that scans recent post content for #hashtag
// mentions. We don't persist hashtags as a separate table yet
// (the schema isn't in place), so the extraction happens on the
// fly via a regex. The query is bounded by `since` (default 7d)
// and the in-memory post cap so the endpoint stays cheap.
router.get(
  '/trending',
  optionalAuth,
  async (_req: any, res: Response<any>, next) => {
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const posts = await prisma.socialPost.findMany({
        where: { createdAt: { gte: since }, visibility: 'PUBLIC' },
        select: { content: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 500,
      });

      // Count #tag occurrences (case-insensitive, alphanum+underscore+vn)
      const tagCounts = new Map<string, number>();
      const tagRegex = /#([\p{L}\p{N}_]{2,50})/gu;
      for (const p of posts) {
        const matches = p.content.matchAll(tagRegex);
        for (const m of matches) {
          const tag = m[1].toLowerCase();
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      }

      const top = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count], idx) => ({
          id: idx + 1,
          tag,
          postsCount: count,
        }));

      res.json({ success: true, data: top });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/users/:id — Public profile by user ID
// ════════════════════════════════════════════════════════════════
// Returns a sanitized public view of a user (no email, no phone,
// no security fields) so the /profile/[id] page can render any
// user's card without requiring them to log in. The endpoint is
// intentionally NOT under /api/v1/users — that namespace belongs
// to admin-only user management routes which require ROLE_ADMIN.
//
// Used by the "Gợi ý kết nối" panel in the right rail of the
// social feed: clicking a suggestion navigates to /profile/[id]
// and the page calls this endpoint to populate the card.
router.get(
  '/users/:id',
  optionalAuth,
  async (req: any, res: Response<any>, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid user ID', 400, 'INVALID_ID');
      }
      const user = await prisma.user.findUnique({
        where: { id },
        include: { roles: { include: { role: true } } },
      });
      if (!user) {
        throw new AppError('Người dùng không tồn tại', 404, 'USER_NOT_FOUND');
      }
      // Public projection: strip PII (email, phone) and account
      // security fields (lastLoginIp, failedLoginCount, etc.).
      // The frontend already calls /api/v1/profile for the
      // signed-in user's full record, so this view is just what
      // other people should be able to see.
      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          displayName: user.displayName ?? user.fullName ?? user.username,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          gender: user.gender,
          birthYear: user.birthYear,
          socialLinks: user.socialLinks,
          // Whether strangers can DM this user. The /profile/[id]
          // page reads this to disable the "Nhắn tin" button when
          // the peer has opted out.
          allowMessagesFromStrangers: user.allowMessagesFromStrangers,
          roles: user.roles.map((ur: any) => ur.role.name),
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/suggestions — People to follow
// ════════════════════════════════════════════════════════════════
// Returns up to N recently-active users the viewer doesn't follow
// yet. We don't have a "follow" relationship in the schema, so
// the suggestion just picks users that have posted recently
// (excluding the viewer themselves). When we add a follow
// relation this endpoint can be tightened.
router.get(
  '/suggestions',
  optionalAuth,
  async (req: any, res: Response<any>, next) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 3, 10);
      const excludeId = req.user?.userId;
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Aggregate posters in the last 30 days, ordered by post count.
      const grouped = await prisma.socialPost.groupBy({
        by: ['authorId'],
        where: {
          createdAt: { gte: since },
          visibility: 'PUBLIC',
          ...(excludeId ? { NOT: { authorId: excludeId } } : {}),
        },
        _count: { authorId: true },
        orderBy: { _count: { authorId: 'desc' } },
        take: limit,
      });

      if (grouped.length === 0) {
        res.json({ success: true, data: [] });
        return;
      }

      const users = await prisma.user.findMany({
        where: { id: { in: grouped.map((g: any) => g.authorId) } },
        select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true, bio: true },
      });

      const data = grouped.map((g: any) => users.find((u: any) => u.id === g.authorId)).filter(Boolean);

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/social/polls/:id/vote — Cast a vote on a poll
// ════════════════════════════════════════════════════════════════
router.post(
  '/polls/:id/vote',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const pollId = parseInt(req.params.id, 10);
      if (isNaN(pollId)) throw new AppError('Invalid poll ID', 400, 'INVALID_ID');

      const { optionIds } = req.body;
      const result = await votePoll(pollId, userId, optionIds);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/polls/:id — Get poll with viewer state
// ════════════════════════════════════════════════════════════════
router.get(
  '/polls/:id',
  optionalAuth,
  async (req: any, res: Response<any>, next) => {
    try {
      const pollId = parseInt(req.params.id, 10);
      if (isNaN(pollId)) throw new AppError('Invalid poll ID', 400, 'INVALID_ID');
      const result = await getPollForViewer(pollId, req.user?.userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
