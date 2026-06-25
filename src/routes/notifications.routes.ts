/**
 * Social notifications routes (added 2026-06-20)
 * ===============================================
 *
 * Endpoints:
 *   GET   /api/v1/social/notifications       — list (cursor-paginated, newest first)
 *   PATCH /api/v1/social/notifications       — mark all (or a subset) as read
 *   GET   /api/v1/social/notifications/unread-count
 *                                              — quick badge number
 *
 * Auth: every route requires `authenticate`. The userId comes
 * from the JWT and is the only thing that scopes the query —
 * a user can never read another user's notifications.
 *
 * Cursor pagination: `?cursor=<id>&limit=<n>`. We use the
 * monotonic `id DESC` order so a simple `id < cursor` gives
 * the next page. The first request (no cursor) returns the
 * newest N.
 */

import { Router, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { prisma } from '../config/database.js';

const router = Router();

function getUserId(req: any): number {
  if (!req.user || !req.user.userId) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }
  return req.user.userId;
}

/**
 * Cursor-paginated list. Includes the sender's public profile so
 * the bell can render the avatar + name without an extra fetch.
 */
router.get(
  '/',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const { cursor, limit = '20' } = req.query;
      const parsedLimit = Math.min(parseInt(limit as string, 10) || 20, 50);
      const parsedCursor = cursor ? parseInt(cursor as string, 10) : undefined;

      const rows = await prisma.socialNotification.findMany({
        where: {
          receiverId: userId,
          ...(parsedCursor ? { id: { lt: parsedCursor } } : {}),
        },
        orderBy: { id: 'desc' },
        take: parsedLimit + 1,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              fullName: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });

      const hasNextPage = rows.length > parsedLimit;
      const items = hasNextPage ? rows.slice(0, parsedLimit) : rows;
      const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

      // Side-channel: also return the total unread count so the
      // bell can re-render its badge without a second request.
      const unreadCount = await prisma.socialNotification.count({
        where: { receiverId: userId, isRead: false },
      });

      res.json({
        success: true,
        data: {
          items,
          pagination: { nextCursor, hasNextPage, limit: parsedLimit },
          unreadCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Mark notifications as read. Body:
 *   { all?: boolean, ids?: number[] }
 * - `{ all: true }`  → mark every unread for the user as read
 * - `{ ids: [...] }` → mark the specified ones as read
 * Default behaviour with empty body: mark all read (most common
 * UX — user opens the bell, every entry is "seen").
 */
router.patch(
  '/',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const { all, ids } = req.body ?? {};
      // Phase 5 home upgrade: stamp readAt on the same write so the
      // bell can render "read 2h ago" without a follow-up query
      // and analytics get a real "time-to-read" signal.
      const now = new Date();

      let updated = 0;
      if (Array.isArray(ids) && ids.length > 0) {
        const result = await prisma.socialNotification.updateMany({
          where: {
            receiverId: userId,
            id: { in: ids.filter((n: unknown) => Number.isFinite(Number(n))).map(Number) },
            isRead: false,
          },
          data: { isRead: true, readAt: now },
        });
        updated = result.count;
      } else if (all === true || ids == null) {
        const result = await prisma.socialNotification.updateMany({
          where: { receiverId: userId, isRead: false },
          data: { isRead: true, readAt: now },
        });
        updated = result.count;
      }

      res.json({ success: true, data: { updated } });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Cheap endpoint for the bell badge. Returns just the number so
 * the navbar can poll it every minute without paying the cost
 * of fetching the full list.
 */
router.get(
  '/unread-count',
  authenticate,
  async (req: any, res: Response<any>, next) => {
    try {
      const userId = getUserId(req);
      const unreadCount = await prisma.socialNotification.count({
        where: { receiverId: userId, isRead: false },
      });
      res.json({ success: true, data: { unreadCount } });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
