/**
 * CT Language — THI THỬ CHUẨN (Đợt B, 14/11/2026). Mounted at /api/v1/ctlanguage/thi (index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` — router kia có `router.use(authenticate)` + `/:nn` sẽ nuốt đường này).
 *
 * Khách xem + làm được (chấm trên máy); đăng nhập mới lưu lượt, lên bảng Vinh danh tuần.
 *   GET  /danh-muc?nn=zh          — kỳ thi → cấp → đề (+ điểm cao nhất, lượt free) · khách được
 *   GET  /de/:id                  — đề đầy đủ (free: không có giải thích chi tiết) · khách được
 *   GET  /vinh-danh?nn=zh&cap=HSK1 — bảng 7 ngày · khách được
 *   POST /de/:id/bat-dau          — mở một lượt (free: 1 đề/cấp/tuần ⇒ 403 CTL_THI_HET_LUOT)
 *   POST /luot/:id/nop            — {traLoi} ⇒ máy chủ chấm lại ⇒ phiếu điểm + hạng tuần
 *   GET  /lich-su?nn=zh           — các lượt đã nộp (biểu đồ tiến bộ)
 * Dịch vụ: `src/services/ctlanguage/thi.ts` · luật thuần + khuôn đề: `thiThuan.ts` · đề: `content/ctlanguage/de-thi/`.
 */
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import { batDau, danhMuc, deCho, lichSu, nop, vinhDanh } from '../services/ctlanguage/thi.js';

const router = Router();

/** Đề nặng (tới ~90 KB) + tuyến công khai ⇒ chặn cào: 120 lượt/phút/IP (bộ nhớ tiến trình là đủ). */
router.use(rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Bạn thao tác hơi nhanh, chờ một chút nhé.', code: 'RATE_LIMIT_EXCEEDED' } }));

router.get('/danh-muc', optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await danhMuc(req.query.nn, req.userId ?? null) }); } catch (e) { next(e); }
});

router.get('/de/:id', optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await deCho(req.params.id, req.userId ?? null) }); } catch (e) { next(e); }
});

router.get('/vinh-danh', optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await vinhDanh(req.query.nn, req.query.cap, req.userId ?? null) }); } catch (e) { next(e); }
});

router.post('/de/:id/bat-dau', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await batDau(req.userId!, req.params.id) }); } catch (e) { next(e); }
});

router.post('/luot/:id/nop', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await nop(req.userId!, req.params.id, req.body ?? {}) }); } catch (e) { next(e); }
});

router.get('/lich-su', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await lichSu(req.userId!, req.query.nn) }); } catch (e) { next(e); }
});

export default router;
