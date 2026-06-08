import { Router, type Response } from 'express';
import { authService } from '../services/auth.service.js';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

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
router.put('/', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const { fullName, email, bio, avatarUrl } = req.body;
    const user = await authService.updateProfile(req.userId!, { fullName, email, bio, avatarUrl });
    res.json({ success: true, data: user });
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
