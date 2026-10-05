/**
 * Flying Pencil (game studio) — API phụ trợ cho công cụ dựng game (06/10/2026).
 *   POST /api/v1/flying-pencil/tts  { text, voice, style?, styledegree?, rate?, pitch? } → { url }
 * Chỉ tài khoản studio (FP_TTS_USER_IDS) hoặc ADMIN — xem services/flyingPencil/tts.service.ts.
 */
import { Router, type Request, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import { isAdminRoles } from '../services/pro.service.js';
import { docFp, GIONG_FP, STYLE_FP } from '../services/flyingPencil/tts.service.js';

const router = Router();
router.use(authenticate);

router.get('/tts/voices', (_req, res: Response<ApiResponse>) => {
  res.json({ success: true, data: { voices: GIONG_FP, styles: STYLE_FP } });
});
router.post('/tts', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await docFp(req.userId!, isAdminRoles(req.user?.roles), req.body ?? {}) });
  } catch (e) { next(e); }
});

export default router;
