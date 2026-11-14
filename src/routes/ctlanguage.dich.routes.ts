/**
 * CT Language — màn DỊCH "đủ đường" (Đợt D, 14/11/2026). Mounted at /api/v1/ctlanguage/dich (index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` để `router.use(authenticate)` + `/:nn` của router kia không nuốt đường này).
 *
 * Dịch văn bản / camera / hội thoại / tài liệu chạy TRÊN MÁY (Apple Translation + Vision + Speech) — không qua đây.
 * Ở đây chỉ có phần cần máy chủ: ✍️ AI sửa bài viết (services/ctlanguage/suaBai.ts).
 *   GET  /luot           — lượt sửa bài còn lại hôm nay {laPro, tran, conLai}
 *   POST /ai/sua-bai     — {nn, chu, kieu?} ⇒ lỗi + bản viết lại + trình độ (đường có `/ai/` ⇒ app xin đồng ý AI trước)
 *   POST /bao-cao-ai     — {id, lyDo, chiTiet?, trich?} báo cáo câu trả lời AI (App Store 4.7) ⇒ hộp thư admin
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '../config/redis.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { baoCaoSuaBai, luotSuaBai, suaBai } from '../services/ctlanguage/suaBai.js';

const router = Router();
router.use(authenticate);

/** Chống bấm dồn: 8 lượt sửa/phút/người (trần ngày nằm ở service). Redis chết ⇒ cho qua (fail-open). */
function gioiHan(tien: string, max: number, cau: string): RequestHandler {
  const l = rateLimit({
    windowMs: 60_000, max, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: tien }),
    keyGenerator: (req) => `u:${req.userId}`,
    message: { success: false, message: cau, code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-dich] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
}
const gioiHanSua = gioiHan('rl:ctl-dich-sua:', 8, 'Bạn gửi hơi nhanh — đợi một lát rồi sửa tiếp nhé.');
const gioiHanBaoCao = gioiHan('rl:ctl-dich-bc:', 10, 'Bạn báo cáo hơi nhanh — đợi một chút nhé.');

router.get('/luot', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luotSuaBai(req.userId!) }); } catch (e) { next(e); }
});

router.post('/ai/sua-bai', gioiHanSua, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await suaBai(req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});

router.post('/bao-cao-ai', gioiHanBaoCao, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await baoCaoSuaBai(req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});

export default router;
