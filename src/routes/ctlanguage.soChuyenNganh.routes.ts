/**
 * CT Language — SỔ TAY CHUYÊN NGÀNH (15/11/2026). Mounted at /api/v1/ctlanguage/so-chuyen-nganh (index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` — router kia `router.use(authenticate)` + `/:nn` sẽ nuốt đường này).
 *
 * Nội dung tĩnh trong repo, MỌI tuyến công khai (khách xem được), không ghi gì:
 *   GET /            — mọi bộ (tóm tắt) của cả ba ngôn ngữ (không tham số — smoke-test deploy gọi); `?nn=ja` lọc
 *   GET /:nn/:ma     — chi tiết bộ: từ + cách đọc + nghĩa Việt + câu ví dụ, mỗi từ gắn id mục từ điển (hoặc id âm)
 * Thêm vào sổ / ôn: app làm trên máy (`KhoSoTu`) rồi đồng bộ qua `/ctlanguage/so-tu`.
 * Dịch vụ: `services/ctlanguage/soChuyenNganh.ts` · luật: `soChuyenNganhThuan.ts` · nội dung:
 * `content/ctlanguage/so-chuyen-nganh/` · kiểm: `scripts/ctlanguage-kiem-so-chuyen-nganh.mts`.
 */
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import type { ApiResponse } from '../types/index.js';
import { chiTietBo, danhSach } from '../services/ctlanguage/soChuyenNganh.js';

const router = Router();

router.use(rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Bạn thao tác hơi nhanh, chờ một chút nhé.', code: 'RATE_LIMIT_EXCEEDED' } }));

router.get('/', (req: Request, res: Response<ApiResponse>, next) => {
  try { res.set('Cache-Control', 'public, max-age=300').json({ success: true, data: danhSach(req.query.nn) }); } catch (e) { next(e); }
});

router.get('/:nn/:ma', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.set('Cache-Control', 'public, max-age=300').json({ success: true, data: await chiTietBo(req.params.nn, req.params.ma) }); } catch (e) { next(e); }
});

export default router;
