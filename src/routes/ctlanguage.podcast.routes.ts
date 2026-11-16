/**
 * CT Language — PODCAST theo cấp (16/11/2026). Mounted at /api/v1/ctlanguage/podcast (index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` — router kia `router.use(authenticate)` sẽ chặn khách).
 *
 * Nội dung tĩnh trong repo, MỌI tuyến công khai (khách nghe được), không ghi gì:
 *   GET /            — tập (tóm tắt) của một danh mục (`?danhMuc=`, mặc định doi-song) gom theo cấp + bảng danh mục; `?nn=ja` lọc
 *   GET /:nn/:id     — kịch bản đầy đủ: người nói + giọng, từng dòng (gốc · cách đọc · dịch), từ vựng, ý nghĩa, câu hỏi
 * Tiếng: app đọc từng dòng qua `/ctlanguage/doc` (giọng của người nói). Dịch vụ: `services/ctlanguage/podcast.ts`.
 */
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import type { ApiResponse } from '../types/index.js';
import { chiTietTap, danhSachPodcast } from '../services/ctlanguage/podcast.js';

const router = Router();

router.use(rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Bạn thao tác hơi nhanh, chờ một chút nhé.', code: 'RATE_LIMIT_EXCEEDED' } }));

router.get('/', (req: Request, res: Response<ApiResponse>, next) => {
  try { res.set('Cache-Control', 'public, max-age=300').json({ success: true, data: danhSachPodcast(req.query.nn, req.query.danhMuc) }); } catch (e) { next(e); }
});

router.get('/:nn/:id', (req: Request, res: Response<ApiResponse>, next) => {
  try { res.set('Cache-Control', 'public, max-age=300').json({ success: true, data: chiTietTap(req.params.nn, req.params.id) }); } catch (e) { next(e); }
});

export default router;
