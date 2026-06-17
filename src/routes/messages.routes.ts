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
import { messagingSafetyService } from '../services/messaging-safety.service.js';
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
    // Normalise to the same shape the list endpoints return (with
    // a `peer` object the frontend expects). The raw Prisma row
    // exposes user/adminUser/userA/userB, but the UI only knows
    // about `peer` — without this the chat header falls back to
    // "Cuộc trò chuyện".
    const serialized = await messagesService.serializeThreadAsync(thread as any, req.userId!);
    res.json({ success: true, data: serialized });
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

// ─── POST /api/v1/messages/messages/:id/recall ─────────
// Sender-only, 5-min window. Wipes the message content and
// marks it as recalled (UI shows a stub).
router.post('/messages/:id/recall', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid message ID', 400, 'INVALID_ID');
    await messagesService.recallMessage(id, req.userId!);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/messages/messages/:id/reactions ─────
// Toggle a reaction. Body: { emoji: "👍" }
router.post('/messages/:id/reactions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid message ID', 400, 'INVALID_ID');
    const emoji = String(req.body?.emoji ?? '');
    const result = await messagesService.toggleReaction(id, req.userId!, emoji);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/v1/messages/threads/:id/nickname ────────
// Set/clear the nickname THIS user has assigned to the
// OTHER participant in the thread. Body: { targetId, alias }
router.put('/threads/:id/nickname', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    const targetId = parseInt(String(req.body?.targetId ?? ''), 10);
    if (isNaN(targetId)) throw new AppError('targetId is required', 400, 'INVALID_TARGET');
    const alias = String(req.body?.alias ?? '');
    const result = await messagesService.setNickname(id, req.userId!, targetId, alias);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/messages/nicknames ───────────────────
// All nicknames the current user has set across their threads.
router.get('/nicknames', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await messagesService.listNicknamesForUser(req.userId!);
    res.json({ success: true, data: rows });
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
      // Re-use the existing service. Pass an empty category so the
      // service auto-detects the right allowlist (images, audio,
      // video, or documents) from the file's mime type. Hard-coding
      // 'documents' here would reject any image/* upload.
      const result = await uploadService.uploadFile(req.file, '' as any, req.userId);
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

// ─── Per-user thread preferences (Pin / Mute / Archive / Mark unread) ─
// All four slots live in the same JSONB column on the thread row,
// keyed by the viewer's userId. Pass `value: null` to clear.
// Body: { slot: 'pinnedAt' | 'mutedUntil' | 'archivedAt' | 'markedUnreadAt', value: ISOString | null }
router.patch('/threads/:id/preference', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    const allowedSlots = ['pinnedAt', 'mutedUntil', 'archivedAt', 'markedUnreadAt'] as const;
    type Slot = (typeof allowedSlots)[number];
    const slot = req.body?.slot as Slot;
    if (!slot || !allowedSlots.includes(slot)) {
      throw new AppError('Invalid preference slot', 400, 'INVALID_SLOT');
    }
    const rawValue = req.body?.value;
    // null clears the slot. A ISO string sets it. Anything else errors.
    const value = rawValue === null || rawValue === undefined
      ? null
      : (() => {
          if (typeof rawValue !== 'string') {
            throw new AppError('value must be a string or null', 400, 'INVALID_VALUE');
          }
          const ts = new Date(rawValue);
          if (isNaN(ts.getTime())) {
            throw new AppError('value must be a valid ISO timestamp', 400, 'INVALID_VALUE');
          }
          return ts.toISOString();
        })();

    const updated = await messagesService.updateThreadPreference(id, req.userId!, slot, value);
    res.json({ success: true, data: { preferences: updated } });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/v1/messages/threads/:id ───────────────
// "Archive" the thread for the current user. Soft-delete
// (we keep the messages for the other participant) — sets
// preferences[viewerId].archivedAt = now and the row stays
// out of the default inbox until unarchived. Returns the
// updated preference set so the client can update state
// without a follow-up fetch.
router.delete('/threads/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    const preferences = await messagesService.archiveThread(id, req.userId!);
    res.json({ success: true, data: { preferences } });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/messages/threads/:id/unarchive ───────
// Undo the archive. Idempotent.
router.post('/threads/:id/unarchive', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    const preferences = await messagesService.unarchiveThread(id, req.userId!);
    res.json({ success: true, data: { preferences } });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/messages/threads/:id/mark-unread ──────
// Sets `markedUnreadAt = now` so the sidebar shows a bold
// dot until the user clicks into the thread (which calls
// markRead, which clears it implicitly by advancing
// lastReadAt past markedUnreadAt).
router.post('/threads/:id/mark-unread', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    const preferences = await messagesService.markThreadUnread(id, req.userId!);
    res.json({ success: true, data: { preferences } });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/messages/threads/:id/mute-for ─────────
// Facebook-style mute with a duration. Body: { durationMinutes: number | null }
// Allowed: 0 (unmute) | 15 | 60 | 480 | 1440 | null (indefinite)
router.post('/threads/:id/mute-for', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    const raw = req.body?.durationMinutes;
    let duration: number | null;
    if (raw === null || raw === undefined) {
      duration = null;
    } else {
      const num = Number(raw);
      const allowed = [0, 15, 60, 480, 1440];
      if (!allowed.includes(num) && raw !== null) {
        throw new AppError('Duration không hợp lệ. Chỉ chấp nhận: 0, 15, 60, 480, 1440 hoặc null', 400, 'INVALID_DURATION');
      }
      duration = num;
    }
    const preferences = await messagesService.muteThreadFor(id, req.userId!, duration);
    res.json({ success: true, data: { preferences } });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/v1/messages/threads/:id/hard ───────────
// "Delete chat" — per-viewer hard delete. The row stays in the
// DB so the other participant keeps their copy, but the
// deleter sees no trace of the thread in any sidebar tab.
router.delete('/threads/:id/hard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    const preferences = await messagesService.deleteThreadForViewer(id, req.userId!);
    res.json({ success: true, data: { preferences, deleted: true } });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/messages/threads/:id/report ──────────
// Report a thread to moderators. Body: { reason, category? }.
router.post('/threads/:id/report', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid thread ID', 400, 'INVALID_ID');
    const reason = String(req.body?.reason ?? '').trim();
    const category = req.body?.category ?? null;
    const result = await messagingSafetyService.reportThread(req.userId!, id, reason, category);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── Per-viewer blocklist (Messenger-style) ────────────
// Get the list of users THIS user has blocked.
router.get('/blocks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await messagingSafetyService.listBlockedUsers(req.userId!);
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

// Block a user. Body: { reason? }.
router.post('/blocks/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.userId, 10);
    if (isNaN(id)) throw new AppError('Invalid user ID', 400, 'INVALID_ID');
    const result = await messagingSafetyService.blockUser(req.userId!, id, req.body?.reason ?? null);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Unblock a user.
router.delete('/blocks/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.userId, 10);
    if (isNaN(id)) throw new AppError('Invalid user ID', 400, 'INVALID_ID');
    const result = await messagingSafetyService.unblockUser(req.userId!, id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

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

// GET /api/v1/messages/online — currently-connected user IDs
router.get('/online', async (_req: Request, res: Response<ApiResponse<{ userIds: number[] }>>, next: NextFunction) => {
  try {
    const { getOnlineUserIds } = await import('../socket/messaging.socket.js');
    res.json({ success: true, data: { userIds: getOnlineUserIds() } });
  } catch (error) {
    next(error);
  }
});

export { router, adminRouter };
