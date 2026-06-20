/**
 * ============================================================
 * User Routes — Social Profile & Follow
 * ============================================================
 *
 * Mounted at /api/v1/users
 *
 * Endpoints:
 *   GET    /api/v1/users/suggestions   — Suggested users to follow
 *   GET    /api/v1/users/:id          — Enhanced public profile
 *   GET    /api/v1/users/:id/followers — List followers
 *   GET    /api/v1/users/:id/following — List following
 *   POST   /api/v1/users/follow       — Follow / unfollow (toggle)
 *   POST   /api/v1/users/status       — Update presence (lastActiveAt)
 *   POST   /api/v1/users/cover-photo  — Update cover photo URL
 */

import { Router, type Response } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  toggleFollow,
  getEnhancedPublicProfile,
  getFollowStatus,
  getFollowers,
  getFollowing,
  updatePresence,
  updateCoverPhoto,
  getSuggestedUsers,
} from '../services/follow.service.js';
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

export default router;
