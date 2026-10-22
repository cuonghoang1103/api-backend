import { Router, type Request, type Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  goNoiDungTuThongBao, goTinCuaBaoCao, khoaNguoiDung, khoaTacGiaTuThongBao, nguoiBiBaoCaoCuaBaoCaoTin,
} from '../services/kiemDuyetAdmin.service.js';
import type { ApiResponse } from '../types/index.js';

/**
 * Kiểm duyệt của quản trị site từ hàng chờ báo cáo (App Store 1.2, 22/10/2026). Mount: /api/v1/admin/moderation.
 *   POST /notifications/:id/remove-content  — gỡ nội dung bị báo cáo (thông báo BAO_CAO trong /admin/thong-bao)
 *   POST /notifications/:id/lock-author     — khoá tài khoản người viết nội dung đó
 *   POST /dm-reports/:id/lock-reported      — khoá người bị báo cáo trong một báo cáo tin nhắn riêng (/admin/reports)
 *   POST /dm-reports/:id/remove-message     — gỡ đúng tin bị báo cáo (báo cáo có messageId)
 *   POST /users/:id/lock                    — khoá (không đảo chiều như PATCH /admin/users/:id/toggle-locked)
 * Xem `services/kiemDuyetAdmin.service.ts`.
 */
const router = Router();
router.use(authenticate, requireAdmin('ROLE_ADMIN'));

const soId = (v: string) => {
  const n = Number.parseInt(v, 10);
  if (!Number.isInteger(n) || n <= 0) throw new AppError('Invalid id', 400, 'INVALID_ID');
  return n;
};

router.post('/notifications/:id/remove-content', asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  res.json({ success: true, data: await goNoiDungTuThongBao(soId(req.params.id), req.userId!) });
}));

router.post('/notifications/:id/lock-author', asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  res.json({ success: true, data: await khoaTacGiaTuThongBao(soId(req.params.id), req.userId!) });
}));

router.post('/dm-reports/:id/lock-reported', asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const uid = await nguoiBiBaoCaoCuaBaoCaoTin(soId(req.params.id));
  if (!uid) throw new AppError('Report not found', 404, 'NOT_FOUND');
  res.json({ success: true, data: await khoaNguoiDung(uid, req.userId!) });
}));

router.post('/dm-reports/:id/remove-message', asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  res.json({ success: true, data: await goTinCuaBaoCao(soId(req.params.id), req.userId!) });
}));

router.post('/users/:id/lock', asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  res.json({ success: true, data: await khoaNguoiDung(soId(req.params.id), req.userId!) });
}));

export default router;
