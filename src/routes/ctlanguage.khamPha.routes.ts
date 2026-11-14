/**
 * CT Language — KHÁM PHÁ (Đợt C) + SỰ KIỆN THÁNG (Đợt E), 14/11/2026. Mounted at /api/v1/ctlanguage/kham-pha — index.ts
 * gắn TRƯỚC `/api/v1/ctlanguage` (router kia có `router.use(authenticate)` + `/:nn` nuốt đường của khách).
 *
 * Công khai (khách xem được; có token thì ẩn người đã chặn nhau + kèm hạng/tiến độ của mình):
 *   GET  /:nn/chu-de              — lưới chủ đề từ vựng
 *   GET  /:nn/chu-de/:ma          — từ của một chủ đề (gắn id mục từ điển)
 *   GET  /:nn/tra-nhieu           — top 20 từ được mở nhiều nhất 7 ngày (đếm ẩn danh)
 *   GET  /:nn/xep-hang-phut?ky=ngay|tuan — xếp hạng phút học (+ hạng của tôi)
 *   GET  /su-kien?nn=             — sự kiện đang chạy + trạm + tiến độ của tôi
 * Cần đăng nhập:
 *   POST /hoat-dong               — {muc:[{nn, ngay, giay, theOn, thi}]} tổng của ngày (máy chủ giữ GREATEST)
 *   GET  /:nn/hoat-dong           — phút học của tôi 7 ngày (máy chủ)
 *   PUT  /xep-hang/an             — {an} ẩn / hiện mình trên bảng xếp hạng
 *   POST /su-kien/:id/nhan        — nhận thưởng (máy chủ kiểm đủ trạm)
 *   GET  /su-kien/thuong          — trang phục sự kiện đã nhận
 * Admin: GET/POST /admin/su-kien · PUT /admin/su-kien/:id
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '../config/redis.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { BadRequestError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { chuDe, datAnXepHang, dsChuDe, ghiHoatDong, hoatDongCuaToi, traNhieu, xepHangPhut } from '../services/ctlanguage/khamPha.js';
import { adminDsSuKien, adminSuaSuKien, adminTaoSuKien, nhanThuong, suKienHienTai, thuongCuaToi } from '../services/ctlanguage/suKien.js';

const router = Router();

function ipThat(req: Request): string {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)?.split(',').map((s) => s.trim()).filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || 'unknown';
}

/** Redis chết ⇒ cho qua (fail-open) — không để rate-limit làm sập trang chủ. */
function gioiHan(tien: string, max: number, theo: 'ip' | 'user', cau: string): RequestHandler {
  const l = rateLimit({
    windowMs: 60_000, max, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: tien }),
    keyGenerator: (req) => (theo === 'user' && req.userId ? `u:${req.userId}` : `ip:${ipThat(req)}`),
    message: { success: false, message: cau, code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-kham-pha] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
}
const gioiHanDoc = gioiHan('rl:ctl-kp-doc:', 120, 'ip', 'Bạn tải hơi nhanh — đợi vài giây nhé.');
const gioiHanGhi = gioiHan('rl:ctl-kp-ghi:', 30, 'user', 'Bạn gửi hơi nhanh — đợi một lát nhé.');

const idSo = (v: string) => { const n = Number(v); if (!Number.isInteger(n) || n <= 0) throw new BadRequestError('id không hợp lệ'); return n; };

// ─── Đường cố định (khai TRƯỚC `/:nn/...`) ────────────────────────────────────────────────────────────────────────
router.get('/su-kien', gioiHanDoc, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.setHeader('Cache-Control', 'no-store'); res.json({ success: true, data: await suKienHienTai(req.query.nn, req.userId ?? null) }); } catch (e) { next(e); }
});
router.get('/su-kien/thuong', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await thuongCuaToi(req.userId!) }); } catch (e) { next(e); }
});
router.post('/su-kien/:id/nhan', authenticate, gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await nhanThuong(req.userId!, idSo(req.params.id)) }); } catch (e) { next(e); }
});
router.post('/hoat-dong', authenticate, gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await ghiHoatDong(req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});
router.put('/xep-hang/an', authenticate, gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await datAnXepHang(req.userId!, req.body?.an === true) }); } catch (e) { next(e); }
});

router.get('/admin/su-kien', authenticate, requireAdmin(), async (_req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await adminDsSuKien() }); } catch (e) { next(e); }
});
router.post('/admin/su-kien', authenticate, requireAdmin(), async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await adminTaoSuKien(req.body ?? {}) }); } catch (e) { next(e); }
});
router.put('/admin/su-kien/:id', authenticate, requireAdmin(), async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await adminSuaSuKien(idSo(req.params.id), req.body ?? {}) }); } catch (e) { next(e); }
});

// ─── Theo ngôn ngữ ───────────────────────────────────────────────────────────────────────────────────────────────
router.get('/:nn/chu-de', gioiHanDoc, (req: Request, res: Response<ApiResponse>, next) => {
  try { res.setHeader('Cache-Control', 'public, max-age=3600'); res.json({ success: true, data: dsChuDe(req.params.nn) }); } catch (e) { next(e); }
});
router.get('/:nn/chu-de/:ma', gioiHanDoc, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.setHeader('Cache-Control', 'public, max-age=3600'); res.json({ success: true, data: await chuDe(req.params.nn, req.params.ma) }); } catch (e) { next(e); }
});
router.get('/:nn/tra-nhieu', gioiHanDoc, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.setHeader('Cache-Control', 'public, max-age=300'); res.json({ success: true, data: await traNhieu(req.params.nn) }); } catch (e) { next(e); }
});
router.get('/:nn/xep-hang-phut', gioiHanDoc, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.setHeader('Cache-Control', 'no-store'); res.json({ success: true, data: await xepHangPhut(req.params.nn, req.query.ky, req.userId ?? null) }); } catch (e) { next(e); }
});
router.get('/:nn/hoat-dong', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await hoatDongCuaToi(req.userId!, req.params.nn) }); } catch (e) { next(e); }
});

export default router;
