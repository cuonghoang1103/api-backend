/**
 * CT Language — BÀI HỌC AI THEO CHỦ ĐỀ (Đợt E, 14/11/2026). Mounted at /api/v1/ctlanguage/bai-ai — index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` (router kia `router.use(authenticate)` + `/:nn`).
 *
 * Công khai: GET /:nn/goi-y (danh mục bài gợi ý + "n người đã học") · GET /bai/:id (bài gợi ý: ai cũng xem; bài tự tạo:
 *   chỉ người tạo). Cần đăng nhập: GET /luot · GET /cua-toi?nn= · POST /:nn/ai/tao {chuDe, trinhDo} ·
 *   POST /:nn/ai/goi-y/:ma (mở/sinh bài gợi ý) · POST|DELETE /bai/:id/luu · POST /bai/:id/xong {diem} · DELETE /bai/:id ·
 *   POST /bao-cao-ai {id, lyDo, chiTiet?, phan?}. Admin: POST /admin/bai/:id/an.
 * Đường gọi model có `/ai/` ⇒ app xin đồng ý chia sẻ AI trước khi gửi (App Store 5.1.2(i)).
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '../config/redis.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { BadRequestError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { adminAn, baoCao, chiTiet, cuaToi, dsGoiY, luot, luu, moGoiY, taoBai, xoa, xong } from '../services/ctlanguage/baiAi.js';

const router = Router();

function gioiHan(tien: string, max: number, cau: string): RequestHandler {
  const l = rateLimit({
    windowMs: 60_000, max, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: tien }),
    keyGenerator: (req) => (req.userId ? `u:${req.userId}` : `ip:${req.ip}`),
    message: { success: false, message: cau, code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-bai-ai] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
}
const gioiHanAi = gioiHan('rl:ctl-bai-ai:', 6, 'Bạn tạo bài hơi nhanh — đợi một lát nhé.');
const gioiHanDoc = gioiHan('rl:ctl-bai-ai-doc:', 120, 'Bạn tải hơi nhanh — đợi vài giây nhé.');
const gioiHanGhi = gioiHan('rl:ctl-bai-ai-ghi:', 30, 'Bạn thao tác hơi nhanh — đợi một chút nhé.');

const idSo = (v: string) => { const n = Number(v); if (!Number.isInteger(n) || n <= 0) throw new BadRequestError('id không hợp lệ'); return n; };

router.get('/luot', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luot(req.userId!) }); } catch (e) { next(e); }
});
router.get('/cua-toi', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await cuaToi(req.userId!, req.query.nn) }); } catch (e) { next(e); }
});
router.post('/bao-cao-ai', authenticate, gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await baoCao(req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});
router.post('/admin/bai/:id/an', authenticate, requireAdmin(), async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await adminAn(idSo(req.params.id)) }); } catch (e) { next(e); }
});

router.get('/bai/:id', gioiHanDoc, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.setHeader('Cache-Control', 'no-store'); res.json({ success: true, data: await chiTiet(idSo(req.params.id), req.userId ?? null) }); } catch (e) { next(e); }
});
router.post('/bai/:id/luu', authenticate, gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luu(req.userId!, idSo(req.params.id), true) }); } catch (e) { next(e); }
});
router.delete('/bai/:id/luu', authenticate, gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luu(req.userId!, idSo(req.params.id), false) }); } catch (e) { next(e); }
});
router.post('/bai/:id/xong', authenticate, gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await xong(req.userId!, idSo(req.params.id), req.body ?? {}) }); } catch (e) { next(e); }
});
router.delete('/bai/:id', authenticate, gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await xoa(req.userId!, idSo(req.params.id)) }); } catch (e) { next(e); }
});

router.get('/:nn/goi-y', gioiHanDoc, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.setHeader('Cache-Control', 'no-store'); res.json({ success: true, data: await dsGoiY(req.params.nn, req.userId ?? null) }); } catch (e) { next(e); }
});
router.post('/:nn/ai/tao', authenticate, gioiHanAi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await taoBai(req.userId!, req.params.nn, req.body ?? {}) }); } catch (e) { next(e); }
});
router.post('/:nn/ai/goi-y/:ma', authenticate, gioiHanAi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await moGoiY(req.userId!, req.params.nn, req.params.ma) }); } catch (e) { next(e); }
});

export default router;
