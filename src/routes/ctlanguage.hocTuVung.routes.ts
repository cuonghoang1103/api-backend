/**
 * CT Language — MỤC HỌC TỪ VỰNG (16/11/2026). Mounted at /api/v1/ctlanguage/tu-vung (index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` — router kia `router.use(authenticate)` + `/:nn` sẽ nuốt đường này).
 *
 * Nội dung tĩnh trong repo, MỌI tuyến công khai (khách học được), không ghi gì — "đã học / đã biết" nằm trên máy app:
 *   GET /                      — tổng quan cả ba ngôn ngữ (không tham số — smoke-test deploy gọi)
 *   GET /:nn/lo-trinh?theo=    — lộ trình chia bài 10–15 từ: `cap` (dễ → khó, mặc định) | `chu-de`; mỗi bài kèm khoá từ `k`
 *                                (app tính % thuộc không cần mở bài) + một điểm ngữ pháp cùng cấp
 *   GET /:nn/bai/:id           — từ của bài: cách đọc, nghĩa, loại, ví dụ, cụm đi kèm, họ từ, ghi chú, id mục từ điển
 * Dịch vụ: `services/ctlanguage/hocTuVung.ts` (nguồn: kho chủ đề `chu-de-tu/` + bộ bổ sung `tu-vung/`).
 */
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import type { ApiResponse } from '../types/index.js';
import { baiHtv, loTrinhHtv, tongQuanHtv } from '../services/ctlanguage/hocTuVung.js';

const router = Router();

router.use(rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Bạn thao tác hơi nhanh, chờ một chút nhé.', code: 'RATE_LIMIT_EXCEEDED' } }));

router.get('/', (_req: Request, res: Response<ApiResponse>, next) => {
  try { res.set('Cache-Control', 'public, max-age=300').json({ success: true, data: tongQuanHtv() }); } catch (e) { next(e); }
});

router.get('/:nn/lo-trinh', (req: Request, res: Response<ApiResponse>, next) => {
  try { res.set('Cache-Control', 'public, max-age=300').json({ success: true, data: loTrinhHtv(req.params.nn, req.query.theo) }); } catch (e) { next(e); }
});

router.get('/:nn/bai/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.set('Cache-Control', 'public, max-age=300').json({ success: true, data: await baiHtv(req.params.nn, req.params.id) }); } catch (e) { next(e); }
});

export default router;
