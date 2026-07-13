import { Router, type Response } from 'express';
import { authService } from '../services/auth.service.js';
import { exportUserData, anonymizeAccount } from '../services/dataRights.service.js';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── Data-subject rights (Nghị định 13/2023) ───────────
// GET /api/v1/profile/export-data — download a JSON copy of your own data.
router.get('/export-data', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await exportUserData(req.userId!);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/profile/delete-account — erase (anonymise) your account.
router.post('/delete-account', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const result = await anonymizeAccount(req.userId!);
    res.clearCookie('backend_token'); // log the (now-anonymous) session out
    res.json({ success: true, data: result });
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
