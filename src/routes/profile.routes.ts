import { Router, type Response } from 'express';
import { authService } from '../services/auth.service.js';
import { exportUserData } from '../services/dataRights.service.js';
import {
  getMyRequest,
  requestDeletion,
  cancelRequest,
} from '../services/accountDeletion.service.js';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── Data-subject rights (Nghị định 13/2023) ───────────
// GET /api/v1/profile/export-data — download a JSON copy of your own data.
// Unchanged: export stays instant and self-service. Only ERASURE now
// goes through admin review (see below).
router.get('/export-data', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await exportUserData(req.userId!);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// ─── Account erasure — now admin-reviewed (changed 2026-08-08) ──────
//
// Previously POST /delete-account called anonymizeAccount() immediately.
// It now FILES A REQUEST; only an admin approving it in
// /api/v1/admin/deletion-requests/:id/approve actually erases the account.
// Rationale + state machine: services/accountDeletion.service.ts.
//
// The session is deliberately NOT cleared any more — the user stays logged
// in while the request is pending so they can withdraw it.

// GET /api/v1/profile/deletion-request — my latest request (or null).
router.get('/deletion-request', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const request = await getMyRequest(req.userId!);
    res.json({ success: true, data: { request } });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/profile/deletion-request — file a request. Idempotent:
// re-posting while one is open returns the existing row with created=false.
router.post('/deletion-request', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const result = await requestDeletion(req.userId!, req.body?.reason);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/profile/deletion-request — withdraw my open request.
router.delete('/deletion-request', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const request = await cancelRequest(req.userId!);
    res.json({ success: true, data: { request } });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/profile/delete-account — kept as an alias of the request
// endpoint so any older client build that still calls it files a request
// instead of hitting a 404 (or, worse, erasing an account outright).
router.post('/delete-account', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const result = await requestDeletion(req.userId!, req.body?.reason);
    res.json({
      success: true,
      data: { ...result, requiresAdminApproval: true },
      message: 'Yêu cầu xoá tài khoản đã được gửi và đang chờ quản trị viên duyệt.',
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/profile ───────────────────────────────
router.get('/', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const profile = await authService.getProfile(req.userId!);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/v1/profile ───────────────────────────────
// Accepts both legacy fields (fullName, email, bio, avatarUrl) and
// the extended fields (displayName, gender, birthYear, phone, socialLinks).
// Validation is delegated to authService.updateProfile so the same
// rules apply to admin-driven updates (if we add them later) and to
// the self-edit path used by the /profile page.
router.put('/', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const { fullName, email, bio, avatarUrl, coverPhotoUrl, displayName, gender, birthYear, phone, socialLinks, allowMessagesFromStrangers } = req.body;
    await authService.updateProfile(req.userId!, {
      fullName,
      email,
      bio,
      avatarUrl,
      coverPhotoUrl,
      displayName,
      gender,
      birthYear,
      phone,
      socialLinks,
      allowMessagesFromStrangers,
    });
    // Re-fetch through getProfile so the response shape matches
    // GET /api/v1/profile (displayName fallback, sanitised values).
    const profile = await authService.getProfile(req.userId!);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/profile/session ──────────────────────
// Used by Next.js proxy to validate session via httpOnly cookie
router.get('/session', async (req, res: Response<ApiResponse>) => {
  try {
    const token = req.cookies.backend_token;
    if (!token) {
      res.json({ success: false, message: 'Not authenticated' });
      return;
    }

    // Decode JWT to get user ID (don't verify here, just extract)
    const jwt = await import('jsonwebtoken');
    const { config } = await import('../config/env.js');
    const decoded = jwt.default.verify(token, config.jwtSecret) as {
      userId: number;
    };

    const profile = await authService.getProfile(decoded.userId);
    res.json({ success: true, data: profile });
  } catch {
    res.json({ success: false, message: 'Invalid session' });
  }
});

export default router;
