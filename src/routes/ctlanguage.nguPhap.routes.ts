/**
 * CT Language — THƯ VIỆN NGỮ PHÁP (15/11/2026). Mounted at /api/v1/ctlanguage/ngu-phap (index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` — router kia có `router.use(authenticate)` + `/:nn` sẽ nuốt đường này).
 *
 * Nội dung tĩnh trong repo, MỌI tuyến công khai (khách xem được, không token), không ghi gì:
 *   GET /tong-quan            — số điểm theo ngôn ngữ / cấp (không tham số — smoke-test deploy gọi)
 *   GET /danh-muc?nn=ja       — cấp → nhóm → điểm (tóm tắt) của một ngôn ngữ
 *   GET /tim?q=てもいい&nn=ja  — tra theo mẫu / nghĩa / từ khoá / ví dụ (`nn` bỏ trống ⇒ cả ba ngôn ngữ);
 *                               `chac=1` ⇒ chỉ khớp tiêu đề / từ khoá / mẫu (ô tra tab Từ điển dùng — ít nhiễu)
 *   GET /diem/:id             — chi tiết: giải thích, cách ghép, ví dụ + cách đọc, lưu ý, "so sánh với", quiz
 * "Đã học / đã lưu" lưu TRÊN MÁY app (không migration). Dịch vụ: `services/ctlanguage/nguPhap.ts` · luật thuần +
 * khuôn: `nguPhapThuan.ts` · nội dung: `content/ctlanguage/ngu-phap/` · kiểm: `scripts/ctlanguage-kiem-ngu-phap.mts`.
 */
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import type { ApiResponse } from '../types/index.js';
import { chiTiet, danhMuc, tim, tongQuan } from '../services/ctlanguage/nguPhap.js';

const router = Router();

/** Tuyến công khai ⇒ chặn cào: 180 lượt/phút/IP (ô tìm gõ tới đâu tra tới đó nên rộng hơn phòng thi). */
router.use(rateLimit({ windowMs: 60_000, max: 180, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Bạn thao tác hơi nhanh, chờ một chút nhé.', code: 'RATE_LIMIT_EXCEEDED' } }));

router.get('/tong-quan', (_req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: tongQuan() }); } catch (e) { next(e); }
});

router.get('/danh-muc', (req: Request, res: Response<ApiResponse>, next) => {
  try { res.set('Cache-Control', 'public, max-age=300').json({ success: true, data: danhMuc(req.query.nn) }); } catch (e) { next(e); }
});

router.get('/tim', (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: tim(req.query.q, req.query.nn, req.query.toiDa, req.query.chac) }); } catch (e) { next(e); }
});

router.get('/diem/:id', (req: Request, res: Response<ApiResponse>, next) => {
  try { res.set('Cache-Control', 'public, max-age=300').json({ success: true, data: chiTiet(req.params.id) }); } catch (e) { next(e); }
});

export default router;
