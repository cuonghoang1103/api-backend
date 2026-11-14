/**
 * CT Language — ĐỒNG BỘ SỔ TAY theo tài khoản (15/11/2026). Mounted at /api/v1/ctlanguage/so-tu (index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` như các router riêng khác). MỌI tuyến cần đăng nhập — khách giữ sổ trên máy.
 *
 *   GET  /trang-thai          — số sổ / thẻ / ngày + mốc (không tham số — smoke-test deploy gọi, khách ⇒ 401)
 *   GET  /?tu=<mốc>&gioiHan=  — kéo bản ghi đổi sau mốc (kể cả bia mộ), ≤ 2.000 / lần, `conNua` ⇒ kéo tiếp
 *   POST /  { muc: [...] }    — đẩy ≤ 500 bản ghi; bản mới hơn thắng theo từng bản ghi; trả `moc`, `daGhi`, `loi`
 * Luật: `services/ctlanguage/soTuDongBoThuan.ts` · CSDL: `soTuDongBo.ts` · app: `KhoSoTu` + `DongBoSoTuCTL`.
 */
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import { day, keo, trangThai } from '../services/ctlanguage/soTuDongBo.js';

const router = Router();

router.use(authenticate);
/** 60 lượt/phút/người (app gom thay đổi rồi mới đẩy, kéo theo mốc; lúc gộp lần đầu có thể vài chục lô liền). */
router.use(rateLimit({
  windowMs: 60_000, max: 60, standardHeaders: true, legacyHeaders: false, keyGenerator: (req) => `ctl-so-tu:u:${req.userId}`,
  message: { success: false, message: 'Đồng bộ hơi dồn dập — app sẽ tự thử lại sau ít phút.', code: 'RATE_LIMIT_EXCEEDED' },
}));

router.get('/trang-thai', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await trangThai(req.userId!) }); } catch (e) { next(e); }
});

router.get('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.set('Cache-Control', 'no-store').json({ success: true, data: await keo(req.userId!, req.query.tu, req.query.gioiHan) });
  } catch (e) { next(e); }
});

router.post('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await day(req.userId!, req.body?.muc) }); } catch (e) { next(e); }
});

export default router;
