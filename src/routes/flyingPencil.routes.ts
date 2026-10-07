/**
 * Flying Pencil (game studio) — API phụ trợ cho công cụ dựng game (06/10/2026).
 *   POST /api/v1/flying-pencil/tts  { text, voice, style?, styledegree?, rate?, pitch? } → { url }
 * Chỉ tài khoản studio (FP_TTS_USER_IDS) hoặc ADMIN — xem services/flyingPencil/tts.service.ts.
 */
import { Router, type Request, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { taoApiTokenAuth } from '../services/work/apiTokens.service.js';
import type { ApiResponse } from '../types/index.js';
import { isAdminRoles } from '../services/pro.service.js';
import { docFp, GIONG_FP, STYLE_FP } from '../services/flyingPencil/tts.service.js';

const router = Router();
// Bot fp_* đã thành AI agent CT Work (không đăng nhập JWT được) ⇒ gọi bằng token ctw_, CHỈ hai đường giọng đọc dưới đây
// (user cho phép 07/10/2026). Rào tài khoản studio (FP_TTS_USER_IDS) + trần ký tự/ngày vẫn nằm trong docFp.
const choAgent = (m: string, p: string) =>
  (p === '/tts' && m === 'POST') || (p === '/tts/voices' && (m === 'GET' || m === 'HEAD'));
router.use(taoApiTokenAuth(choAgent));
router.use((req, res, next) => (req.workToken ? next() : authenticate(req, res, next)));

router.get('/tts/voices', (_req, res: Response<ApiResponse>) => {
  res.json({ success: true, data: { voices: GIONG_FP, styles: STYLE_FP } });
});
router.post('/tts', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await docFp(req.userId!, isAdminRoles(req.user?.roles), req.body ?? {}) });
  } catch (e) { next(e); }
});

export default router;
