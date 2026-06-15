/**
 * ============================================================
 * Direct Messaging Routes
 * ============================================================
 *
 * Endpoints:
 *   POST   /api/v1/messages/threads/admin                 — Get/create user↔admin support thread
 *   POST   /api/v1/messages/threads/user/:peerId          — Get/create user↔user DM
 *   GET    /api/v1/messages/threads                       — List viewer's threads
 *   GET    /api/v1/messages/threads/:id                   — Get thread detail
 *   GET    /api/v1/messages/threads/:id/messages          — List messages (cursor pagination)
 *   POST   /api/v1/messages/threads/:id/messages          — Send a message
 *   PATCH  /api/v1/messages/threads/:id/read              — Mark thread as read
 *   DELETE /api/v1/messages/messages/:id                  — Soft-delete a message
 *   GET    /api/v1/messages/unread-count                  — Total unread across all threads
 *   POST   /api/v1/messages/upload                        — Upload a chat attachment (10MB cap)
 *
 *   GET    /api/v1/admin/messages/threads                 — Admin inbox (all admin-threads)
 */

import { Router, type Response, type Request, type NextFunction } from 'express';
import multer from 'multer';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { messagesService } from '../services/messages.service.js';
import { uploadService } from '../services/upload.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── Multer config for chat attachments ─────────────────
// 10MB hard cap per file, in-memory storage; service does
// the actual file-type whitelist via uploadService.uploadFile.
const chatUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ─── All routes require auth ───────────────────────────
router.use(authenticate);

// ─── GET /api/v1/messages/unread-count ─────────────────
router.get('/unread-count', async (req: Request, res: Response<ApiResponse<{ count: number }>>, next: NextFunction) => {
  try {
    const count = await messagesService.getUnreadCount(req.userId!);
    res.json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/messages/threads/admin ──────────────
// Idempotent: returns existing thread if any, else creates one.
router.post('/threads/admin', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thread = await messagesService.getOrCreateAdminThread(req.userId!);
    res.json({ success: true, data: thread });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/messages/threads/user/:peerId ───────
router.post('/threads/user/:peerId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const peerId = parseInt(req.params.peerId, 10);
    if (isNaN(peerId)) throw new AppError('Invalid peer ID', 400, 'INVALID_ID');
    const thread = await messagesService.getOrCreateUserThread(req.userId!, peerId);
    res.json({ success: true, data: thread });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/messages/threads ─────────────────────
router.get('/threads', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await import('../config/database.js').then((m) => m.prisma.user.findUnique({
      where: { id: req.userId! },
      include: { roles: { include: { role: true } } },
    }));
    const isAdmin = user?.roles.some(
      (ur: { role: { name: string } }) =>
        ur.role.name.toUpperCase().replace('ROLE_', '') === 'ADMIN',
    ) ?? false;
    const threads = isAdmin
      ? await messagesService.listThreadsForAdmin(req.userId!)
      : await messagesService.listThreadsForUser(req.userId!);
    res.json({ success: true, data: threads });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/messages/threads/:id ─────────────────
router.get('/threads/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    const thread = await messagesService.getThread(id, req.userId!);
    res.json({ success: true, data: thread });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/messages/threads/:id/messages ────────
router.get('/threads/:id/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    const cursor = req.query.cursor ? parseInt(req.query.cursor as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const messages = await messagesService.listMessages(id, req.userId!, { cursor, limit });
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/messages/threads/:id/messages ───────
router.post('/threads/:id/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    const message = await messagesService.sendMessage(id, req.userId!, {
      content: req.body?.content,
      fileIds: req.body?.fileIds,
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
});

// ─── PATCH /api/v1/messages/threads/:id/read ──────────
router.patch('/threads/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    await messagesService.markRead(id, req.userId!);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/v1/messages/messages/:id ─────────────
router.delete('/messages/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid message ID', 400, 'INVALID_ID');
    await messagesService.softDeleteMessage(id, req.userId!);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/messages/upload ─────────────────────
// 10MB cap. Reuses the shared upload service so the same
// whitelist + storage path conventions apply; we just
// override the per-category size limit to 10MB.
router.post(
  '/upload',
  chatUpload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError('No file provided', 400, 'NO_FILE');
      }
      // 10MB hard cap (mirrors the multer limit)
      if (req.file.size > 10 * 1024 * 1024) {
        throw new AppError('File exceeds 10MB limit', 413, 'FILE_TOO_LARGE');
      }
      // Re-use the existing service. `category='documents'` is
      // a conservative default; the service auto-detects the
      // actual mime category and validates against the right
      // allowlist.
      const result = await uploadService.uploadFile(req.file, 'documents', req.userId);
      res.status(201).json({
        success: true,
        data: {
          fileId: result.id,
          url: result.url,
          fileName: result.originalName,
          fileSize: result.fileSize,
          mimeType: result.contentType,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// ─── Admin sub-router ──────────────────────────────────
const adminRouter = Router();
adminRouter.use(authenticate);
adminRouter.use(requireRole('admin', 'ADMIN'));

// GET /api/v1/admin/messages/threads
adminRouter.get('/messages/threads', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const threads = await messagesService.listThreadsForAdmin(req.userId!);
    res.json({ success: true, data: threads });
  } catch (error) {
    next(error);
  }
});

export { router, adminRouter };
