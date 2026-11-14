/**
 * CT Language — TRANG TỪ "DÀY" (Đợt A, 14/11/2026). Gắn ở `/api/v1/ctlanguage/tu-dien-sau` (src/index.ts).
 * Tệp router RIÊNG để không giẫm `ctlanguage.routes.ts`. Luật: `src/services/ctlanguage/tuDienSau.ts`.
 *
 *   GET    /:nn/muc/:id        công khai — dữ liệu thật + phần AI ĐÃ có trong kho (không bao giờ gọi model)
 *   POST   /:nn/ai/muc/:id     đăng nhập — chưa có thì sinh bằng AI một lần rồi lưu (đường có `/ai/` ⇒ app xin đồng ý 5.1.2(i))
 *   DELETE /:nn/muc/:id        admin — xoá bản AI của một từ (sau báo sai) để lượt sau sinh lại
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '../config/redis.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { BadRequestError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { sinhMoRong, xemMoRong, xoaMoRong } from '../services/ctlanguage/tuDienSau.js';

const router = Router();

/** IP thật = mục CUỐI của X-Forwarded-For do proxy của ta ghi (cùng luật ctlanguage.routes.ts). */
function ipThat(req: Request): string {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)?.split(',').map((s) => s.trim()).filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || 'unknown';
}

/** Bộ giới hạn Redis; Redis chết ⇒ cho qua (không làm sập từ điển). */
function gioiHan(tien: string, windowMs: number, max: number, khoa: (req: Request) => string, cau: string): RequestHandler {
  const l = rateLimit({
    windowMs, max, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: tien }),
    keyGenerator: khoa,
    message: { success: false, message: cau, code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-tu-sau] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
}
/** Xem: 120 lượt/phút/IP (mỗi lần mở trang từ là một lượt). */
const gioiHanXem = gioiHan('rl:ctl-tusau-xem:', 60_000, 120, (req) => `ip:${ipThat(req)}`, 'Tra hơi nhanh — đợi vài giây rồi thử lại.');
/** Sinh: 20 lượt/phút/người — lớp chống bấm dồn; trần lượt/ngày nằm ở service. */
const gioiHanSinh = gioiHan('rl:ctl-tusau-sinh:', 60_000, 20, (req) => `u:${req.userId}`, 'Bạn bấm hơi nhanh — đợi một chút nhé.');

const idSo = (v: string) => { const n = Number(v); if (!Number.isInteger(n) || n <= 0) throw new BadRequestError('id không hợp lệ'); return n; };

router.get('/:nn/muc/:id', gioiHanXem, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'private, no-store');
    res.json({ success: true, data: await xemMoRong(req.params.nn, idSo(req.params.id), req.userId ?? null) });
  } catch (e) { next(e); }
});

router.post('/:nn/ai/muc/:id', authenticate, gioiHanSinh, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await sinhMoRong(req.params.nn, idSo(req.params.id), req.userId!) }); } catch (e) { next(e); }
});

router.delete('/:nn/muc/:id', authenticate, requireAdmin(), async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await xoaMoRong(req.params.nn, idSo(req.params.id)) }); } catch (e) { next(e); }
});

export default router;
