/**
 * Song routes — admin CRUD + user-facing picker.
 *
 * Phase 4. Two route layers are mounted in src/index.ts:
 *   - /api/v1/songs (public) for the composer picker
 *   - /api/v1/admin/songs (admin) for upload/edit/delete
 *
 * All routes are auth-gated; the admin layer also requires
 * ROLE_ADMIN via requireAdmin('ROLE_ADMIN'). The picker route
 * is auth-only (no admin required) because regular users
 * browse the music pool when composing a post.
 *
 * The actual audio file lives in R2 (uploaded via the existing
 * fileApi.upload with category='songs' on the frontend). This
 * service only stores the R2 URL — we don't move bytes here.
 */

import { Router, type Response } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  createSong,
  listAllSongsForAdmin,
  getFeed,
  getSongForPlayback,
  updateSong,
  setActive,
  deleteSong,
  resolveSongFromMusicTrack,
} from '../services/song.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();
const adminRouter = Router();

// ─── Public picker ─────────────────────────────────────────────

/** GET /api/v1/songs — paginated list of active songs for the
 * composer picker. We use cursor pagination (id < cursor) so
 * the user can scroll indefinitely without re-rendering the
 * whole list (matches the feed cursor pattern in Mục 2). */
router.get('/', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 30));
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    // Use Prisma's "mode: insensitive" + contains for the
    // search. We use raw SQL via unsafe mode so we can do a
    // single-trip ILIKE on title OR artist. The existing GIN
    // trigram index on social_posts.content doesn't help here
    // (we want to query songs, not posts), but for a 50-row
    // music pool the planner falls back to seq scan which is
    // still < 1ms.
    const where: Record<string, unknown> = { isActive: true };
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { artist: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (cursor != null && Number.isInteger(cursor) && cursor > 0) {
      where.id = { lt: cursor };
    }

    const items = await getFeed({ cursor: cursor ?? undefined, limit, q });

    const nextCursor = items.length === limit ? (items as { id: number }[])[items.length - 1].id : null;
    res.json({
      success: true,
      data: { items, nextCursor },
    });
  } catch (err) {
    next(err);
  }
});

/** POST /api/v1/songs/from-music-track — attach a public
 * music-page track to the Song pool. Body: { musicTrackId }.
 * Returns the find-or-created Song so the composer can attach it
 * exactly like a normal "Nhạc nền" pick. Read-only vs MusicTrack. */
router.post('/from-music-track', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const musicTrackId = Number(req.body?.musicTrackId);
    if (!Number.isInteger(musicTrackId) || musicTrackId <= 0) {
      throw new AppError('musicTrackId khong hop le', 400, 'INVALID_ID');
    }
    const song = await resolveSongFromMusicTrack(musicTrackId, req.user.userId);
    res.json({ success: true, data: song });
  } catch (err) {
    next(err);
  }
});

/** GET /api/v1/songs/:id — single song for the composer's
 * audio preview. We return the full row (incl. fileSize) so
 * the preview UI can show duration and a fancy "from
 * @username" attribution row. */
router.get('/:id', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('id khong hop le', 400, 'INVALID_ID');
    }
    const song = await getSongForPlayback(id);
    res.json({ success: true, data: song });
  } catch (err) {
    next(err);
  }
});

// ─── Admin CRUD ───────────────────────────────────────────────

adminRouter.use(authenticate, requireAdmin('ROLE_ADMIN'));

/** GET /api/v1/admin/songs — full list (including inactive
 * tracks) for the admin dashboard. We use a small default
 * page size (50) since admins typically scroll a few hundred
 * rows at most. */
adminRouter.get('/', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;

    const where: Record<string, unknown> = {};
    if (cursor != null && Number.isInteger(cursor) && cursor > 0) {
      where.id = { lt: cursor };
    }
    const items = await listAllSongsForAdmin(limit);
    const nextCursor = items.length === limit ? (items as { id: number }[])[items.length - 1].id : null;
    res.json({ success: true, data: { items, nextCursor } });
  } catch (err) {
    next(err);
  }
});

/** POST /api/v1/admin/songs — create a new song.
 * Body: { title, artist, audioUrl, coverImage?, durationSec?,
 *         fileSize? }
 * The audio file itself was uploaded separately via the
 * frontend's fileApi.upload (mp3 / m4a to R2, 50 MB cap
 * enforced on the frontend); we only store the R2 URL here. */
adminRouter.post('/', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const song = await createSong({
      title: req.body.title,
      artist: req.body.artist,
      audioUrl: req.body.audioUrl,
      coverImage: req.body.coverImage,
      durationSec: req.body.durationSec,
      fileSize: req.body.fileSize,
      uploaderId: req.user.userId,
    });
    res.status(201).json({ success: true, data: song });
  } catch (err) {
    next(err);
  }
});

/** PATCH /api/v1/admin/songs/:id — update title / artist / cover
 * (audioUrl is intentionally NOT editable: a track file is
 * immutable once uploaded. Re-upload = create a new song). */
adminRouter.patch('/:id', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('id khong hop le', 400, 'INVALID_ID');
    }
    const song = await updateSong(id, {
      title: req.body.title,
      artist: req.body.artist,
      coverImage: req.body.coverImage,
      isActive: req.body.isActive,
    });
    res.json({ success: true, data: song });
  } catch (err) {
    next(err);
  }
});

/** PATCH /api/v1/admin/songs/:id/active — toggle isActive.
 * Kept as a dedicated route (not the generic PATCH) so the
 * admin toggle button doesn't need to know about all the other
 * PATCH fields. */
adminRouter.patch('/:id/active', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('id khong hop le', 400, 'INVALID_ID');
    }
    if (typeof req.body.isActive !== 'boolean') {
      throw new AppError('isActive phai la boolean', 400, 'INVALID_ACTIVE');
    }
    const song = await setActive(id, req.body.isActive);
    res.json({ success: true, data: song });
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/v1/admin/songs/:id — hard delete. We pre-check
 * for PostMusic references so the admin gets a 409 with a
 * friendly message instead of a Prisma FK error. */
adminRouter.delete('/:id', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('id khong hop le', 400, 'INVALID_ID');
    }
    const result = await deleteSong(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export { router as songRoutes, adminRouter as songAdminRoutes };
export default router;
