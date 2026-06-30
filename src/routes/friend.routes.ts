/**
 * ============================================================
 * Friend Routes — Two-way Friend Graph (Facebook-style)
 * ============================================================
 *
 * Mounted at /api/v1/friends
 *
 * Endpoints:
 *   GET    /api/v1/friends                    — List my friends (cursor)
 *   GET    /api/v1/friends/requests/incoming  — Pending requests TO me
 *   GET    /api/v1/friends/requests/outgoing  — Pending requests FROM me
 *   GET    /api/v1/friends/requests/count     — Incoming count (badge)
 *   GET    /api/v1/friends/status/:id         — Relationship with :id
 *   POST   /api/v1/friends/request            — Send request { targetId }
 *   POST   /api/v1/friends/respond            — { requesterId, accept }
 *   POST   /api/v1/friends/cancel             — Cancel outgoing { targetId }
 *   DELETE /api/v1/friends/:id                — Unfriend user :id
 *
 * Independent of the follow graph (see user.routes.ts).
 */

import { Router, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  sendRequest,
  respond,
  cancelRequest,
  unfriend,
  getStatus,
  listFriends,
  listIncoming,
  listOutgoing,
  countIncoming,
} from '../services/friend.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// All friend routes require auth.
router.use(authenticate);

// ─── GET /api/v1/friends ─────────────────────────────────────
router.get('/', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const cursor = req.query.cursor ? parseInt(req.query.cursor as string, 10) : undefined;
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 50);
    const result = await listFriends(req.user.userId!, cursor, limit);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/friends/requests/incoming ───────────────────
router.get('/requests/incoming', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 30, 50);
    const requests = await listIncoming(req.user.userId!, limit);
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/friends/requests/outgoing ───────────────────
router.get('/requests/outgoing', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 30, 50);
    const requests = await listOutgoing(req.user.userId!, limit);
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/friends/requests/count ──────────────────────
router.get('/requests/count', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const count = await countIncoming(req.user.userId!);
    res.json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/friends/status/:id ──────────────────────────
router.get('/status/:id', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid user ID', 400, 'INVALID_ID');
    const status = await getStatus(req.user.userId!, id);
    res.json({ success: true, data: { status } });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/friends/request ────────────────────────────
router.post('/request', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { targetId } = req.body as { targetId?: number };
    if (!targetId || isNaN(targetId)) {
      throw new AppError('targetId is required', 400, 'VALIDATION_ERROR');
    }
    const result = await sendRequest(req.user.userId!, targetId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/friends/respond ────────────────────────────
router.post('/respond', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { requesterId, accept } = req.body as { requesterId?: number; accept?: boolean };
    if (!requesterId || isNaN(requesterId)) {
      throw new AppError('requesterId is required', 400, 'VALIDATION_ERROR');
    }
    const result = await respond(req.user.userId!, requesterId, accept === true);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/friends/cancel ─────────────────────────────
router.post('/cancel', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { targetId } = req.body as { targetId?: number };
    if (!targetId || isNaN(targetId)) {
      throw new AppError('targetId is required', 400, 'VALIDATION_ERROR');
    }
    await cancelRequest(req.user.userId!, targetId);
    res.json({ success: true, data: { status: 'none' } });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/v1/friends/:id ──────────────────────────────
router.delete('/:id', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid user ID', 400, 'INVALID_ID');
    await unfriend(req.user.userId!, id);
    res.json({ success: true, data: { status: 'none' } });
  } catch (error) {
    next(error);
  }
});

export default router;
