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
 * ============================================================
 */

import { Router, type Response } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
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
      const { content, visibility, latitude, longitude, locationName, media } = req.body;

      if (!content?.trim()) {
        throw new AppError('Post content is required', 400, 'MISSING_CONTENT');
      }

      const post = await createPost({
        authorId: userId,
        content: content.trim(),
        visibility: visibility || 'PUBLIC',
        latitude,
        longitude,
        locationName,
        media,
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

export default router;
