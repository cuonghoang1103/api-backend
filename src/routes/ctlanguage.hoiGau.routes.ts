/**
 * CT Language — 🐻 Gấu trợ lý theo màn (15/11/2026). Mounted at /api/v1/ctlanguage/hoi-gau (index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` như các router con khác — router chung có `router.use(authenticate)` + `/:nn`).
 *   GET  /luot           — lượt hỏi còn lại hôm nay {laPro, tran, conLai}
 *   POST /ai/hoi         — {nn, banDongHanh?, nguCanh:{loai, tieuDe, noiDung}, lichSu?:[{vai, noiDung}], cau} ⇒ {id, traLoi, luot}
 *                          (đường có `/ai/` ⇒ app xin đồng ý chia sẻ AI trước — 5.1.2(i))
 *   POST /bao-cao-ai     — {id, lyDo, chiTiet?, trich?} báo cáo câu trả lời AI (App Store 4.7) ⇒ hộp thư admin
 * Service: src/services/ctlanguage/hoiGau.ts.
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '../config/redis.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { baoCaoHoiGau, hoiGau, luotHoiGau } from '../services/ctlanguage/hoiGau.js';

const router = Router();
router.use(authenticate);

/** Chống bấm dồn theo phút (trần ngày nằm ở service). Redis chết ⇒ cho qua (fail-open). */
function gioiHan(tien: string, max: number, cau: string): RequestHandler {
  const l = rateLimit({
    windowMs: 60_000, max, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: tien }),
    keyGenerator: (req) => `u:${req.userId}`,
    message: { success: false, message: cau, code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-hoi-gau] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
}
const gioiHanHoi = gioiHan('rl:ctl-hoi-gau:', 10, 'Bạn hỏi hơi nhanh — đợi một lát rồi hỏi tiếp nhé.');
const gioiHanBaoCao = gioiHan('rl:ctl-hoi-gau-bc:', 10, 'Bạn báo cáo hơi nhanh — đợi một chút nhé.');

router.get('/luot', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luotHoiGau(req.userId!) }); } catch (e) { next(e); }
});

router.post('/ai/hoi', gioiHanHoi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await hoiGau(req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});

router.post('/bao-cao-ai', gioiHanBaoCao, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await baoCaoHoiGau(req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});

export default router;
