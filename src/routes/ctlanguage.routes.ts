/**
 * CT Language — tuyến riêng của app iOS (mounted at /api/v1/ctlanguage). docs/ct-language-app.md.
 *
 * Tiến độ IELTS dùng lại `/api/v1/ielts/*`; ở đây chỉ thứ app này cần mà web chưa có.
 */
import { Router, type Request, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import { docHoSo, luuHoSo } from '../services/ctlanguage/hoSo.js';

const router = Router();
router.use(authenticate);

/** Hồ sơ học (ngôn ngữ đang học + lựa chọn làm quen + giờ nhắc). `data: null` khi chưa từng lưu. */
router.get('/me', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await docHoSo(req.userId!) }); } catch (e) { next(e); }
});

/** Ghi đè hồ sơ học. Thân sai hình dạng ⇒ 400 `CTL_HO_SO_SAI`. */
router.put('/me', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luuHoSo(req.userId!, req.body) }); } catch (e) { next(e); }
});

export default router;
