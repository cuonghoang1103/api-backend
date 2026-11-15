/**
 * CT Language — TRÒ CHƠI (16/11/2026). Mounted at /api/v1/ctlanguage/tro-choi — index.ts gắn TRƯỚC `/api/v1/ctlanguage`
 * (router kia có `/:nn` + `authenticate` nuốt đường của khách).
 *
 * Công khai (khách xem được; có token thì ẩn người chặn nhau + kèm hạng của tôi):
 *   GET  /danh-muc                                   — game server nhận + luật điểm + khung tên hợp lệ
 *   GET  /:game/xep-hang?nn=&cheDo=&ky=tuan|moi      — top 50 (điểm cao nhất mỗi người) + hạng của tôi
 *   GET  /thach-dau/:ma                              — bộ đề + seed + bảng điểm của thách đấu
 * Cần đăng nhập:
 *   POST /diem          — {game, cheDo, nn, diem, dung, sai, chang, thoiGianMs, maVan, maThachDau?, khung?}
 *   POST /thach-dau     — {game, nn, cachHien, seed, tenBo, de:[{id, chu, doc, docLatin, hanViet, nghia}]} ⇒ {ma}
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '../config/redis.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { danhMucGame, guiDiem, taoThachDau, xemThachDau, xepHang } from '../services/ctlanguage/troChoi.js';

const router = Router();

function ipThat(req: Request): string {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)?.split(',').map((s) => s.trim()).filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || 'unknown';
}

/** Redis chết ⇒ cho qua (fail-open). */
function gioiHan(tien: string, max: number, theo: 'ip' | 'user', cau: string): RequestHandler {
  const l = rateLimit({
    windowMs: 60_000, max, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: tien }),
    keyGenerator: (req) => (theo === 'user' && req.userId ? `u:${req.userId}` : `ip:${ipThat(req)}`),
    message: { success: false, message: cau, code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-tro-choi] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
}
const gioiHanDoc = gioiHan('rl:ctl-tc-doc:', 120, 'ip', 'Bạn tải hơi nhanh — đợi vài giây nhé.');
// Một ván ngắn nhất ~10 s ⇒ 12 lượt gửi/phút là dư cho người thật.
const gioiHanDiem = gioiHan('rl:ctl-tc-diem:', 12, 'user', 'Bạn gửi điểm hơi nhanh — đợi một lát nhé.');
const gioiHanTao = gioiHan('rl:ctl-tc-tao:', 6, 'user', 'Bạn tạo thách đấu hơi nhanh — đợi một lát nhé.');

const body = (req: Request) => (req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {});

router.get('/danh-muc', gioiHanDoc, (_req: Request, res: Response<ApiResponse>) => {
  res.json({ success: true, data: danhMucGame() });
});

router.post('/diem', authenticate, gioiHanDiem, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await guiDiem(req.userId!, body(req)) }); } catch (e) { next(e); }
});

router.post('/thach-dau', authenticate, gioiHanTao, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await taoThachDau(req.userId!, body(req)) }); } catch (e) { next(e); }
});

router.get('/thach-dau/:ma', gioiHanDoc, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ success: true, data: await xemThachDau(req.params.ma, req.userId ?? null) });
  } catch (e) { next(e); }
});

router.get('/:game/xep-hang', gioiHanDoc, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ success: true, data: await xepHang(req.params.game, req.query as Record<string, unknown>, req.userId ?? null) });
  } catch (e) { next(e); }
});

export default router;
