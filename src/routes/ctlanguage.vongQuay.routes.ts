/**
 * CT Language — VÒNG QUAY MAY MẮN (16/11/2026). Mounted at /api/v1/ctlanguage/vong-quay — index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` (router kia có `/:nn` + `authenticate` nuốt đường của khách).
 *
 *   GET  /        (khách xem được) — {daDangNhap, homNay, qua:[{ma, nhan, xu, tiLe}], luot?, lichSu, vuaNhan}
 *   POST /quay    (cần đăng nhập)  — {quay:{id, qua, viTri, nhan, xu, nguon, luc}, luot}; hết lượt ⇒ 409 CTL_VQ_HET_LUOT
 *
 * Luật lượt + tỉ lệ: `services/ctlanguage/vongQuayThuan.ts`. Quà chỉ là đồ trong app — không tiền, không giảm giá Pro.
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '../config/redis.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { quayVongQuay, trangThaiVongQuay } from '../services/ctlanguage/vongQuay.js';

const router = Router();

function ipThat(req: Request): string {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)?.split(',').map((s) => s.trim()).filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || 'unknown';
}

/** Redis chết ⇒ cho qua (fail-open) — giới hạn lượt thật nằm ở CSDL (unique theo ngày), không ở đây. */
function gioiHan(tien: string, max: number, theo: 'ip' | 'user', cau: string): RequestHandler {
  const l = rateLimit({
    windowMs: 60_000, max, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: tien }),
    keyGenerator: (req) => (theo === 'user' && req.userId ? `u:${req.userId}` : `ip:${ipThat(req)}`),
    message: { success: false, message: cau, code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-vong-quay] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
}
const gioiHanDoc = gioiHan('rl:ctl-vq-doc:', 60, 'ip', 'Bạn tải hơi nhanh — đợi vài giây nhé.');
const gioiHanQuay = gioiHan('rl:ctl-vq-quay:', 10, 'user', 'Bạn bấm hơi nhanh — đợi bánh xe dừng đã nhé.');

router.get('/', gioiHanDoc, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ success: true, data: await trangThaiVongQuay(req.userId ?? null) });
  } catch (e) { next(e); }
});

router.post('/quay', authenticate, gioiHanQuay, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await quayVongQuay(req.userId!) }); } catch (e) { next(e); }
});

export default router;
