/**
 * ============================================================
 * Story Routes — Instagram/Facebook-style ephemeral stories
 * ============================================================
 *
 * Mounted at /api/v1/stories
 *
 * Endpoints:
 *   POST   /api/v1/stories                    — Create story
 *   GET    /api/v1/stories/feed              — Get stories for home feed bar
 *   GET    /api/v1/stories/user/:id          — Get user's stories
 *   GET    /api/v1/stories/ring               — Get all stories for viewer
 *   GET    /api/v1/stories/:id                — Get single story
 *   POST   /api/v1/stories/:id/view           — View a story
 *   DELETE /api/v1/stories/:id                — Delete story (owner only)
 *   POST   /api/v1/stories/:id/hide           — Hide story from user
 *   POST   /api/v1/stories/:id/highlight      — Add to highlight
 *   GET    /api/v1/stories/highlights/:userId  — Get user's highlights
 *   DELETE /api/v1/stories/highlights         — Delete highlight
 *   PATCH  /api/v1/stories/:id/privacy        — Update story privacy
 */

import { Router, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import {
  createStory,
  getHomeFeedStories,
  getUserStories,
  getRingStories,
  getStoryById,
  viewStory,
  deleteStory,
  hideStory,
  addToHighlight,
  getUserHighlights,
  deleteHighlight,
  renameHighlight,
  updateStoryPrivacy,
} from '../services/story.service.js';

const router = Router();

// ─── POST /api/v1/stories — Create story ─────────────────────
router.post('/', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { visibility, caption, mediaUrl, mediaType, duration, thumbnail, backgroundColor } = req.body;

    const story = await createStory({
      userId: req.user.userId!,
      visibility,
      caption,
      mediaUrl,
      mediaType,
      duration,
      thumbnail,
      backgroundColor,
    });

    res.status(201).json({ success: true, data: story });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/stories/feed — Stories for home feed bar ─────
router.get('/feed', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const stories = await getHomeFeedStories(req.user.userId!);
    res.json({ success: true, data: stories });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/stories/user/:id — User's stories ───────────
router.get('/user/:id', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) throw new AppError('Invalid user ID', 400, 'INVALID_ID');

    const stories = await getUserStories(userId, req.user.userId!);
    res.json({ success: true, data: stories });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/stories/ring — All stories for viewer ───────
router.get('/ring', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const stories = await getRingStories(req.user.userId!);
    res.json({ success: true, data: stories });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/stories/:id — Single story ──────────────────
router.get('/:id', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const storyId = parseInt(req.params.id, 10);
    if (isNaN(storyId)) throw new AppError('Invalid story ID', 400, 'INVALID_ID');

    const story = await getStoryById(storyId, req.user.userId!);
    res.json({ success: true, data: story });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/v1/stories/:id/view — View a story ───────────
router.post('/:id/view', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const storyId = parseInt(req.params.id, 10);
    if (isNaN(storyId)) throw new AppError('Invalid story ID', 400, 'INVALID_ID');

    const result = await viewStory(storyId, req.user.userId!);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/v1/stories/:id — Delete story ────────────────
router.delete('/:id', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const storyId = parseInt(req.params.id, 10);
    if (isNaN(storyId)) throw new AppError('Invalid story ID', 400, 'INVALID_ID');

    const result = await deleteStory(storyId, req.user.userId!);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/v1/stories/:id/hide — Hide story ─────────────
router.post('/:id/hide', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const storyId = parseInt(req.params.id, 10);
    if (isNaN(storyId)) throw new AppError('Invalid story ID', 400, 'INVALID_ID');

    const result = await hideStory(storyId, req.user.userId!);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/v1/stories/:id/highlight — Add to highlight ──
router.post('/:id/highlight', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const storyId = parseInt(req.params.id, 10);
    if (isNaN(storyId)) throw new AppError('Invalid story ID', 400, 'INVALID_ID');

    const { name } = req.body;
    if (!name) throw new AppError('Highlight name is required', 400, 'MISSING_NAME');

    const result = await addToHighlight(req.user.userId!, storyId, name);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/stories/highlights/:userId — User's highlights ─
router.get('/highlights/:userId', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) throw new AppError('Invalid user ID', 400, 'INVALID_ID');

    const highlights = await getUserHighlights(userId);
    res.json({ success: true, data: highlights });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/v1/stories/highlights — Delete highlight ──────
router.delete('/highlights', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new AppError('Highlight name is required', 400, 'MISSING_NAME');

    const result = await deleteHighlight(req.user.userId!, name);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/v1/stories/:id/privacy — Update privacy ─────
router.patch('/:id/privacy', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const storyId = parseInt(req.params.id, 10);
    if (isNaN(storyId)) throw new AppError('Invalid story ID', 400, 'INVALID_ID');

    const { visibility } = req.body;
    if (!['PUBLIC', 'FRIENDS', 'PRIVATE'].includes(visibility)) {
      throw new AppError('Invalid visibility', 400, 'INVALID_VISIBILITY');
    }

    const result = await updateStoryPrivacy(storyId, req.user.userId!, visibility);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
