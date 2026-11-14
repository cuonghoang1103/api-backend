/**
 * CT Language — 🎙 Luyện phát âm chấm bằng AI (15/11/2026). Mounted at /api/v1/ctlanguage/phat-am (index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` như các router con khác — router chung có `router.use(authenticate)` + `/:nn`).
 *   GET  /luot      — {laPro, tran, conLai, batChua} (batChua = máy chủ đã có khoá Azure Speech)
 *   POST /ai/cham   — multipart: `audio` (WAV PCM 16 kHz mono, ≤ 15 s) + `cau` + `nn` (en|ja|zh) + `giong?` (us|uk) + `doc?`
 *                     (pinyin/kana của câu — gắn thanh điệu) ⇒ {ketQua, lyDo?, thongBao?, goiY, luot}
 *                     (đường có `/ai/` ⇒ app xin đồng ý chia sẻ AI trước — 5.1.2(i))
 * ⚠️ multer `memoryStorage` RIÊNG — audio không chạm đĩa, không lên R2 (giống `/ielts/ai/cham-phat-am`).
 * Service: src/services/ctlanguage/phatAm.ts.
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '../config/redis.js';
import { authenticate } from '../middleware/auth.js';
import { BadRequestError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { luotPhatAm, luyenPhatAm, TOI_DA_BYTE } from '../services/ctlanguage/phatAm.js';

const router = Router();
router.use(authenticate);

/** Chống bấm dồn theo phút (trần ngày ở service). Redis chết ⇒ cho qua (fail-open). */
const gioiHanCham: RequestHandler = (() => {
  const l = rateLimit({
    windowMs: 60_000, max: 15, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: 'rl:ctl-phat-am:' }),
    keyGenerator: (req) => `u:${req.userId}`,
    message: { success: false, message: 'Bạn chấm hơi nhanh — nghỉ vài giây rồi đọc tiếp nhé.', code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-phat-am] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
})();

const nhanAudio: RequestHandler = (() => {
  const up = multer({ storage: multer.memoryStorage(), limits: { fileSize: TOI_DA_BYTE, files: 1, fields: 8 } }).single('audio');
  return (req, res, next) => up(req, res, (err?: unknown) => {
    if (!err) return next();
    const ma = (err as { code?: string }).code;
    next(new BadRequestError(ma === 'LIMIT_FILE_SIZE' ? 'Bản ghi quá dài (tối đa 15 giây).' : 'Bản ghi không hợp lệ.', 'CTL_PHAT_AM_AUDIO'));
  });
})();

router.get('/luot', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luotPhatAm(req.userId!) }); } catch (e) { next(e); }
});

router.post('/ai/cham', gioiHanCham, nhanAudio, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const b = req.body ?? {};
    res.json({ success: true, data: await luyenPhatAm(req.userId!, { audio: req.file?.buffer, cau: b.cau, nn: b.nn, giong: b.giong, doc: b.doc }) });
  } catch (e) { next(e); }
});

export default router;
