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
import { logger } from '../utils/logger.js';
import {
  createPost,
  getPostById,
  deletePost,
  updatePost,
  getFeed,
  getFeedCounts,
  likePost,
  unlikePost,
  reactPost,
  getComments,
  getCommentReplies,
  createComment,
  updateComment,
  deleteComment,
  serializePost,
  likeComment,
  savePost,
  unsavePost,
  getSavedPosts,
  getSaveFolders,
  sharePost,
  votePoll,
  getPollForViewer,
  // Saved Collections v2 (added 2026-06-20) — multi-folder
  // bookmark backed by `FeedCollection` + `FeedSavedPost`.
  listCollections,
  createCollection,
  deleteCollection,
  renameCollection,
  savePostToCollections,
  getPostSaveContext,
  listSavedPostsInCollection,
} from '../services/social.service.js';
import {
  notifyPostReaction,
  notifyPostComment,
  notifyCommentReply,
  notifyMention,
} from '../services/notification.service.js';
import { notifyAdminPost } from '../services/notification.service.js';
import {
  getEnhancedPublicProfile,
} from '../services/follow.service.js';

const router = Router();

// ─── Helper to extract userId from auth ─────────────────────────

function getUserId(req: any): number {
  if (!req.user || !req.user.userId) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }
  return req.user.userId;
}

/**
 * Validate and resolve a music track id from the composer. We
 * require the track to exist and be active; otherwise we drop it
 * silently (the post just won't have a music sticker). The
 * caller can still create a normal post without music.
 */
async function resolveMusicTrackId(
  rawTrackId: unknown,
): Promise<number | undefined> {
  if (rawTrackId == null) return undefined;
  if (typeof rawTrackId !== 'number' || !Number.isInteger(rawTrackId) || rawTrackId <= 0) {
    return undefined;
  }
  try {
    const track = await prisma.musicTrack.findUnique({
      where: { id: rawTrackId },
      select: { id: true, active: true },
    });
    if (!track || !track.active) return undefined;
    return track.id;
  } catch {
    return undefined;
  }
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
      const { content, visibility, latitude, longitude, locationName, media, poll, youtubeUrl, type, musicTrackId, musicStartSec } = req.body;

      // Content-type bucket for the feed tabs. Accept only the known
      // values; anything else (or omitted) → undefined, which lets the
      // service derive the type from the attached media / youtubeUrl so
      // older clients that don't send `type` keep working unchanged.
      const allowedTypes = ['POST', 'VIDEO', 'FILE'] as const;
      const cleanedType = allowedTypes.includes(type) ? (type as 'POST' | 'VIDEO' | 'FILE') : undefined;

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
        type: cleanedType,
        // Phase 3 add — Instagram-style music sticker. When set,
        // we look up the track exists + is active before passing
        // through to the service. Invalid trackId is silently
        // dropped (the post just won't have a music sticker).
        musicTrackId: await resolveMusicTrackId(musicTrackId),
        musicStartSec:
          typeof musicStartSec === 'number' && musicStartSec >= 0
            ? Math.min(musicStartSec, 24 * 60 * 60) // cap at 24h
            : undefined,
        media,
        poll,
      });

      // Fan out to all users if the poster is an admin
      void (async () => {
        try {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { roles: { include: { role: true } } },
          });
          if (user?.roles.some((ur) => ['ROLE_ADMIN', 'ADMIN', 'SUPER_ADMIN'].includes(ur.role.name))) {
            await notifyAdminPost(userId, post.id, typeof content === 'string' ? content.slice(0, 80) : undefined);
          }
        } catch { /* non-fatal */ }
      })();

      res.status(201).json({ success: true, data: serializePost(post) });
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
      const { cursor, limit = '20', authorId, visibility, hashtag, sort, following, type } = req.query;
      // Content-type tab filter. Only the known buckets pass through;
      // anything else falls back to "all" (undefined).
      const feedType = type === 'POST' || type === 'VIDEO' || type === 'FILE' ? type : undefined;

      const result = await getFeed({
        cursor: cursor ? parseInt(cursor as string, 10) : undefined,
        limit: Math.min(parseInt(limit as string, 10) || 20, 50),
        authorId: authorId ? parseInt(authorId as string, 10) : undefined,
        visibility: visibility as string | undefined,
        // Hashtag filter — strip leading # if client included it
        hashtag: hashtag ? (hashtag as string).replace(/^#/, '').trim() || undefined : undefined,
        // Phase 5 home upgrade: feed filter tabs. `sort` accepts
        // 'recent' (default) or 'popular'. `following=true` restricts
        // the feed to authors the viewer follows (requires auth).
        sort: sort === 'popular' ? 'popular' : 'recent',
        following: following === 'true' || following === '1',
        type: feedType,
        currentUserId,
      });

      // Short-lived cache: social feed changes frequently, so we only cache
      // for 30s on the client side. stale-while-revalidate gives the CDN
      // (if any) a window to serve stale while revalidating.
      res.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/posts/counts — Per-content-type tab counts
// Registered BEFORE /posts/:id so the literal "counts" segment isn't
// swallowed by the :id param route.
// ════════════════════════════════════════════════════════════════
router.get(
  '/posts/counts',
  optionalAuth,
  async (req: any, res: any, next) => {
    try {
      const { visibility } = req.query;
      const counts = await getFeedCounts({
        visibility: typeof visibility === 'string' ? visibility : undefined,
      });
      // Counts change slowly relative to the feed; a short cache keeps
      // the tab badges cheap without going stale for long.
      res.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
      res.json({ success: true, data: counts });
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
// POST /api/v1/social/posts/:id/react — Multi-emoji reaction
// ════════════════════════════════════════════════════════════════
//
// New (2026-06-20) endpoint. Body: { type: 'LIKE' | 'LOVE' |
// 'HAHA' | 'SAD' | 'ANGRY' }.
//
// Toggle semantics:
//   - First reaction with type T   → insert row
//   - Click SAME emoji again       → remove (un-react)
//   - Click a DIFFERENT emoji      → swap (drop old, insert new)
//
// The PostCard relies on the per-type breakdown in the response
// to update the emoji stack without a refetch.
router.post(
  '/posts/:id/react',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId)) throw new AppError('Invalid post ID', 400, 'INVALID_ID');

      const { type } = req.body ?? {};
      const result = await reactPost(postId, userId, type);

      // Fire an in-app notification to the post author. We do
      // this AFTER the DB write so a failure here doesn't roll
      // back the reaction. The helper self-filters when
      // userId === post.authorId (no self-notify).
      if (result.reacted) {
        const post = await prisma.socialPost.findUnique({
          where: { id: postId },
          select: { authorId: true },
        });
        if (post && post.authorId !== userId) {
          // fire-and-forget — the helper logs its own errors
          void notifyPostReaction(post.authorId, userId, postId, result.myType ?? 'LIKE');
        }
      }

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
    // Validate `cursor` if present: must be a positive integer.
    // The service layer would otherwise propagate NaN to Prisma,
    // which surfaces as a 500 'Invalid cursor' error. Catching it
    // here turns a server fault into a 400 client error and
    // documents the accepted shape.
    let cursorId: number | undefined;
    if (cursor != null && cursor !== '') {
    const parsed = parseInt(cursor as string, 10);
    if (!Number.isInteger(parsed) || parsed < 1 || String(parsed) !== String(cursor)) {
    throw new AppError('Invalid cursor', 400, 'INVALID_CURSOR');
    }
    cursorId = parsed;
    }
    const result = await getComments(postId, {
    ...(cursorId != null ? { cursor: cursorId } : {}),
    limit: parseInt(limit as string, 10) || 20,
    });

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/comments/by-root/:rootId — Lazy-load replies
// Phase 5 home upgrade: when a comment thread has more than the
// eagerly-fetched REPLIES_FETCH_LIMIT replies, the card shows
// "Xem thêm N phản hồi". Clicking it calls this endpoint with
// the top-level comment id (rootId) and a cursor to fetch the
// next page. Cursor is the id of the last reply on screen.
//
// Must be defined BEFORE /comments/:id so Express doesn't match
// "by-root" as :id.
// ════════════════════════════════════════════════════════════════
router.get(
  '/comments/by-root/:rootId',
  optionalAuth,
  async (req: any, res: Response<any>, next) => {
    try {
      const rootId = parseInt(req.params.rootId, 10);
      if (!Number.isInteger(rootId) || rootId < 1) {
        throw new AppError('Invalid root comment ID', 400, 'INVALID_ID');
      }
      const cursor = req.query.cursor
        ? parseInt(req.query.cursor as string, 10)
        : undefined;
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 30);

      const currentUserId = req.user?.userId;
      const result = await getCommentReplies(rootId, currentUserId, {
        ...(cursor != null && Number.isInteger(cursor) ? { cursor } : {}),
        limit,
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
      const { postId, parentId, content, mentions } = req.body;

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
        mentions: Array.isArray(mentions) ? mentions : undefined,
      });

      // Notification fan-out (fire-and-forget; helpers self-log
      // any error so a notification glitch never blocks the
      // create response).
      try {
        const post = await prisma.socialPost.findUnique({
          where: { id: comment.postId },
          select: { authorId: true },
        });
        const parent = comment.parentId
          ? await prisma.socialComment.findUnique({
              where: { id: comment.parentId },
              select: { userId: true },
            })
          : null;

        // 1) Reply → notify the parent comment's author
        if (parent && parent.userId !== userId) {
          void notifyCommentReply(
            parent.userId,
            userId,
            comment.postId,
            comment.id,
            comment.parentId!,
          );
        }

        // 2) Top-level comment on someone else's post → notify
        //    the post author (unless already notified as parent
        //    comment author).
        if (
          post &&
          post.authorId !== userId &&
          post.authorId !== parent?.userId
        ) {
          void notifyPostComment(post.authorId, userId, comment.postId, comment.id);
        }

        // 3) @mentions → notify each tagged user (skip self and
        //    anyone already notified above)
        if (Array.isArray(comment.mentions)) {
          for (const mid of comment.mentions) {
            if (mid === userId) continue;
            if (mid === post?.authorId && post.authorId !== parent?.userId) continue;
            if (mid === parent?.userId) continue;
            void notifyMention(mid, userId, comment.postId, comment.id);
          }
        }
      } catch (notifErr) {
        logger.warn('notification fan-out failed', { error: (notifErr as Error).message });
      }

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
// POST /api/v1/feed/save-post — Save post to one or more collections
// ════════════════════════════════════════════════════════════════
//
// Spec'd as a single "save into multiple collections" endpoint so the
// popover in PostCard can tick several checkboxes in one click. The
// underlying model (`SocialSave`) still has ONE row per (postId,userId)
// — we keep it single-row by storing the LAST chosen collection name
// on the existing row, which is exactly what `savePost()` already does.
//
// Body:
//   { postId: number, collection: string | null, remove?: boolean }
//     - `collection` (null = save into the "Chưa phân loại" bucket)
//     - `remove=true` → unsave entirely instead of saving
//
// We keep the original /social/posts/:id/save route untouched so any
// other client that still calls it keeps working. The two routes share
// the same service layer so behaviour is identical.
router.post(
  '/save-post',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const { postId, collection, remove } = req.body ?? {};
      const parsedPostId = parseInt(postId, 10);
      if (isNaN(parsedPostId)) {
        throw new AppError('Valid postId is required', 400, 'INVALID_POST_ID');
      }

      // Collection name is optional but capped to the same column width
      // as `SocialSave.folder` (255 chars). Null/empty means the
      // uncategorised bucket.
      let folder: string | undefined = undefined;
      if (typeof collection === 'string') {
        const trimmed = collection.trim();
        if (trimmed.length > 0) {
          if (trimmed.length > 255) {
            throw new AppError('Collection name is too long', 400, 'COLLECTION_TOO_LONG');
          }
          folder = trimmed;
        }
      }

      if (remove === true) {
        const result = await unsavePost(parsedPostId, userId);
        res.json({ success: true, data: result });
        return;
      }

      const result = await savePost(parsedPostId, userId, folder);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/feed/collections — List user's save collections
// ════════════════════════════════════════════════════════════════
//
// v2 — returns rows from the `FeedCollection` table (real
// multi-folder model). The legacy `/saves/folders` endpoint
// is preserved below for callers that still want the
// `SocialSave.folder` groupBy output.
//
// Response shape:
//   {
//     success: true,
//     data: {
//       collections: [{ id, name, icon, count, sortOrder, createdAt }],
//       uncategorized: number,
//       total: number
//     }
//   }
router.get(
  '/collections',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const result = await listCollections(userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/feed/collections — Create a new collection
// ════════════════════════════════════════════════════════════════
//
// Body: { name: string, icon?: string }
// Response: { success: true, data: { id, name, icon, sortOrder, count: 0, createdAt } }
router.post(
  '/collections',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const rawName = (req.body?.name ?? '').toString();
      const icon = req.body?.icon;
      const created = await createCollection(
        userId,
        rawName,
        typeof icon === 'string' ? icon : null,
      );
      res.status(201).json({
        success: true,
        data: {
          id: created.id,
          name: created.name,
          icon: created.icon,
          sortOrder: created.sortOrder,
          count: 0,
          createdAt: created.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// DELETE /api/v1/feed/collections/:id — Delete a collection
// ════════════════════════════════════════════════════════════════
router.delete(
  '/collections/:id',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid collection id', 400, 'INVALID_ID');
      }
      const result = await deleteCollection(userId, id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// PATCH /api/v1/feed/collections/:id — Rename a collection
// ════════════════════════════════════════════════════════════════
router.patch(
  '/collections/:id',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid collection id', 400, 'INVALID_ID');
      }
      const rawName = (req.body?.name ?? '').toString();
      const updated = await renameCollection(userId, id, rawName);
      res.json({ success: true, data: { id: updated.id, name: updated.name } });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/feed/save-post — Save a post to collections (v2)
// ════════════════════════════════════════════════════════════════
//
// Replaces the legacy string-based body. The new contract is
// strictly IDs, so the client doesn't need to know about
// `FeedCollection.name` casing rules.
//
// Body:
//   { postId: number, collectionIds: number[] }
//   - `collectionIds: []` → unsave the post entirely
//
// Response:
//   { success: true, data: { postId, collectionIds, added, removed, isSaved } }
//
// The legacy /feed/save-post with `collection: string` still
// works (see handler above) — we leave it in place as a
// compatibility shim. v2 supersedes it for new clients.
router.post(
  '/save-post-v2',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const postId = parseInt(req.body?.postId, 10);
      if (isNaN(postId)) {
        throw new AppError('Valid postId is required', 400, 'INVALID_POST_ID');
      }
      const collectionIds = Array.isArray(req.body?.collectionIds)
        ? req.body.collectionIds.map((n: any) => Number(n))
        : [];
      const result = await savePostToCollections(userId, postId, collectionIds);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/feed/save-context?postId=N
//   → returns the collections THIS user has THIS post in.
//   Used by the popover to pre-tick checkboxes when the
//   post is already saved.
router.get(
  '/save-context',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const postId = parseInt(req.query.postId as string, 10);
      if (isNaN(postId)) {
        throw new AppError('Valid postId required', 400, 'INVALID_POST_ID');
      }
      const result = await getPostSaveContext(userId, postId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/v1/feed/collections/:id/posts?cursor=N&limit=K
//   → returns saved posts in the specified collection (or
//     uncategorized if id is omitted / "null"). The page
//     uses this to render the tab content.
router.get(
  '/collections/:id/posts',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const idParam = req.params.id;
      let collectionId: number | null = null;
      if (idParam && idParam !== 'uncategorized') {
        const parsed = parseInt(idParam, 10);
        if (isNaN(parsed)) {
          throw new AppError('Invalid collection id', 400, 'INVALID_ID');
        }
        collectionId = parsed;
      }
      const cursor = req.query.cursor
        ? parseInt(req.query.cursor as string, 10)
        : null;
      const limit = Math.min(
        Math.max(parseInt((req.query.limit as string) || '20', 10) || 20, 1),
        50,
      );
      const result = await listSavedPostsInCollection(userId, collectionId, cursor, limit);
      res.json({ success: true, data: result });
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
// GET /api/v1/social/trending — Top hashtags (last 24 hours)
// ════════════════════════════════════════════════════════════════
// Scans the last 24 hours of PUBLIC posts, extracts #hashtag
// tokens, aggregates their frequency, and returns the top 10.
// The query window is intentionally narrow (24h) so the "Xu hướng"
// widget reflects *today's* activity rather than week-old posts.
// Uses the GIN trigram index on social_posts.content (created at
// startup) so the regex scan stays fast as the table grows.
router.get(
  '/trending',
  optionalAuth,
  async (req: any, res: Response<any>, next) => {
    try {
      const topN = Math.min(parseInt((req.query.limit as string) || '10', 10), 20);
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const posts = await prisma.socialPost.findMany({
        where: { createdAt: { gte: since }, visibility: 'PUBLIC' },
        select: { content: true },
        orderBy: { createdAt: 'desc' },
        take: 1000,
      });

      // Count #tag occurrences (case-insensitive, Unicode-aware)
      const tagCounts = new Map<string, number>();
      const tagRegex = /#([\p{L}\p{N}_]{2,50})/gu;
      for (const p of posts) {
        // De-dupe within a single post so one post counts once per tag
        const seenInPost = new Set<string>();
        const matches = p.content.matchAll(tagRegex);
        for (const m of matches) {
          const tag = m[1].toLowerCase();
          if (!seenInPost.has(tag)) {
            seenInPost.add(tag);
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
          }
        }
      }

      const top = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([tag, postsCount], idx) => ({
          id: idx + 1,
          tag,
          postsCount,
        }));

      res.json({ success: true, data: top });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/social/users/:id — Enhanced public profile (with follow stats)
// Redirects to the unified /api/v1/users/:id endpoint for consistency.
// The /profile/[id] page calls this path (legacy), while new code uses
// /api/v1/users/:id directly. Keeping both paths for backwards compat.
router.get(
  '/users/:id',
  optionalAuth,
  async (req: any, res: Response<any>, next) => {
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
