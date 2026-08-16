/**
 * ============================================================
 * Notes Share Routes
 * ============================================================
 *
 * Mounted at /api/v1/notes-shares
 *
 * Endpoints:
 *   POST   /                          — Share a subject with a user
 *   GET    /                           — List shares I own (outbox)
 *   GET    /received                  — List subjects shared with me (inbox)
 *   GET    /received/:subjectId        — Get a shared subject with full tree
 *   DELETE /:shareId                  — Revoke a share
 *   PATCH  /:shareId                — Update permission/note
 *   GET    /subject/:subjectId        — List shares for a specific subject
 *   GET    /search-users              — Search users to share with
 */

import { Router, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  createNoteShare,
  deleteNoteShare,
  listMyNoteShares,
  listSharedWithMe,
  listSubjectShares,
  updateNoteShare,
  searchUsersToShare,
  checkNoteAccess,
} from '../services/notesShare.service.js';
import type { ApiResponse } from '../types/index.js';
import {
  createNoteComment,
  deleteNoteComment,
  listNoteComments,
  setNoteCommentResolved,
  updateNoteComment,
  updateSharedNoteContent,
} from '../services/notesCollaboration.service.js';
import { createNoteRealtimeToken } from '../services/notesRealtime.service.js';

const router = Router();

// All routes require auth
router.use(authenticate);

// Short-lived, document-scoped token for the Hocuspocus/Yjs gateway. This
// route works for owners and recipients; the service resolves the live share
// permission and the gateway checks it again during the WebSocket handshake.
router.post('/notes/:noteId/collaboration-token', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const session = await createNoteRealtimeToken(req.user.userId, Number(req.params.noteId));
    res.json({ success: true, data: session });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/notes-shares ────────────────────────
// Share a subject with another user
router.post('/', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { subjectId, recipientId, permission, note } = req.body;
    if (!subjectId || !recipientId) {
      throw new AppError('subjectId and recipientId are required', 400, 'VALIDATION_ERROR');
    }
    const share = await createNoteShare(req.user.userId, { subjectId, recipientId, permission, note });
    res.json({ success: true, data: share });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/notes-shares ──────────────────────────
// List all shares I own
router.get('/', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const shares = await listMyNoteShares(req.user.userId);
    res.json({ success: true, data: shares });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/notes-shares/search-users ──────────
// Search users to share with
router.get('/search-users', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const q = (req.query.q as string) || '';
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 8, 20);
    const users = await searchUsersToShare(req.user.userId, q, limit);
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/notes-shares/received ──────────────
// List subjects shared with me
router.get('/received', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const shares = await listSharedWithMe(req.user.userId);
    res.json({ success: true, data: shares });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/notes-shares/received/:subjectId ──
// Get a shared subject with full tree
router.get('/received/:subjectId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const subjectId = parseInt(req.params.subjectId, 10);
    if (isNaN(subjectId)) {
      throw new AppError('Invalid subjectId', 400, 'INVALID_ID');
    }
    const access = await checkNoteAccess(req.user.userId, subjectId);
    if (!access.hasAccess) {
      throw new AppError('You do not have access to this subject', 403, 'ACCESS_DENIED');
    }
    // Return full subject tree
    const { prisma } = await import('../config/database.js');
    const subject = await prisma.noteSubject.findUnique({
      where: { id: subjectId },
      include: {
        chapters: {
          orderBy: { sortOrder: 'asc' },
          include: {
            notes: {
              where: { deletedAt: null, ...(access.isOwner ? {} : { isArchived: false }) },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        notes: {
          where: {
            chapterId: null,
            deletedAt: null,
            ...(access.isOwner ? {} : { isArchived: false }),
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    res.json({ success: true, data: { ...subject, myPermission: access.permission, isOwner: access.isOwner } });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/notes-shares/received/:subjectId/notes/:noteId ──
// Get full content of a single note when shared
router.get('/received/:subjectId/notes/:noteId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const subjectId = parseInt(req.params.subjectId, 10);
    const noteId = parseInt(req.params.noteId, 10);
    if (isNaN(subjectId) || isNaN(noteId)) {
      throw new AppError('Invalid subjectId or noteId', 400, 'INVALID_ID');
    }
    // Check access to the subject
    const access = await checkNoteAccess(req.user.userId, subjectId);
    if (!access.hasAccess) {
      throw new AppError('You do not have access to this subject', 403, 'ACCESS_DENIED');
    }
    // Get the note with full content
    const { prisma } = await import('../config/database.js');
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        subjectId: subjectId,
        deletedAt: null,
        ...(access.isOwner ? {} : { isArchived: false }),
      },
      include: {
        attachments: true,
        links: true,
        vocabEntries: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!note) {
      throw new AppError('Note not found', 404, 'NOTE_NOT_FOUND');
    }
    res.json({
      success: true,
      data: {
        ...note,
        myPermission: access.permission,
        isOwner: access.isOwner,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Shared editing is deliberately narrow: editor/owner may change title,
// rich content and tags. Structural moves, archive/delete and resources
// remain owner-only through the regular Notes routes.
router.patch('/received/:subjectId/notes/:noteId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const subjectId = Number(req.params.subjectId);
    const noteId = Number(req.params.noteId);
    const note = await updateSharedNoteContent(req.user.userId, subjectId, noteId, req.body ?? {});
    const access = await checkNoteAccess(req.user.userId, subjectId);
    res.json({ success: true, data: { ...note, myPermission: access.permission, isOwner: access.isOwner } });
  } catch (error) { next(error); }
});

// ─── Page discussions ─────────────────────────────────────────
router.get('/notes/:noteId/comments', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await listNoteComments(req.user.userId, Number(req.params.noteId), String(req.query.resolved ?? 'true') !== 'false');
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.post('/notes/:noteId/comments', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const comment = await createNoteComment(req.user.userId, Number(req.params.noteId), req.body ?? {});
    res.status(201).json({ success: true, data: comment });
  } catch (error) { next(error); }
});

router.patch('/comments/:commentId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const comment = await updateNoteComment(req.user.userId, Number(req.params.commentId), req.body?.content);
    res.json({ success: true, data: comment });
  } catch (error) { next(error); }
});

router.post('/comments/:commentId/resolve', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const comment = await setNoteCommentResolved(req.user.userId, Number(req.params.commentId), true);
    res.json({ success: true, data: comment });
  } catch (error) { next(error); }
});

router.post('/comments/:commentId/reopen', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const comment = await setNoteCommentResolved(req.user.userId, Number(req.params.commentId), false);
    res.json({ success: true, data: comment });
  } catch (error) { next(error); }
});

router.delete('/comments/:commentId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const result = await deleteNoteComment(req.user.userId, Number(req.params.commentId));
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/notes-shares/subject/:subjectId ──
// List shares for a specific subject (owner only)
router.get('/subject/:subjectId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const subjectId = parseInt(req.params.subjectId, 10);
    if (isNaN(subjectId)) {
      throw new AppError('Invalid subjectId', 400, 'INVALID_ID');
    }
    const shares = await listSubjectShares(req.user.userId, subjectId);
    res.json({ success: true, data: shares });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/v1/notes-shares/:shareId ──────────
// Revoke a share
router.delete('/:shareId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const shareId = parseInt(req.params.shareId, 10);
    if (isNaN(shareId)) {
      throw new AppError('Invalid shareId', 400, 'INVALID_ID');
    }
    const result = await deleteNoteShare(req.user.userId, shareId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── PATCH /api/v1/notes-shares/:shareId ──────────
// Update share permission or note
router.patch('/:shareId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const shareId = parseInt(req.params.shareId, 10);
    if (isNaN(shareId)) {
      throw new AppError('Invalid shareId', 400, 'INVALID_ID');
    }
    const { permission, note } = req.body;
    const share = await updateNoteShare(req.user.userId, shareId, { permission, note });
    res.json({ success: true, data: share });
  } catch (error) {
    next(error);
  }
});

export default router;
