/**
 * /api/v1/admin/du-phong — admin đặt / đổi / tắt MẬT KHẨU cổng dự phòng AI Code.
 *
 * Cổng dự phòng (modelapi.vn) tính tiền thật, nên chỉ ai có mật khẩu mới dùng
 * được, và chỉ lúc rambo hỏng. Đổi mật khẩu là mọi vé cũ chết ngay (xem
 * `services/agent/congDuPhong.ts`). Giao diện: /admin/commerce?tab=fable.
 */
import { Router, type Request, type Response } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { BadRequestError } from '../middleware/errorHandler.js';
import { congAgent, ramboDangNghi } from '../services/llm/gateway.js';
import { congDuPhong, daCoMatKhau, datMatKhauDuPhong, modelDuPhongAgent, tenDuPhong } from '../services/agent/congDuPhong.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();
router.use(authenticate, requireAdmin('ROLE_ADMIN'));

router.get('/', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    const model = modelDuPhongAgent();
    res.json({
      success: true,
      data: {
        daBat: await daCoMatKhau(),
        model,
        ten: tenDuPhong(model),
        coKhoa: Boolean(congDuPhong(model)),
        coCongChinh: Boolean(congAgent()),
        congChinhDangHong: ramboDangNghi(),
      },
    });
  } catch (err) { next(err); }
});

/** Body `{ matKhau: string }` để đặt/đổi, `{ matKhau: null }` để TẮT cổng dự phòng. */
router.put('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const raw = (req.body as { matKhau?: unknown })?.matKhau;
    if (raw === null) {
      await datMatKhauDuPhong(null);
      logger.info('[du-phong] admin TẮT cổng dự phòng', { adminId: (req as any).userId });
    } else {
      const matKhau = String(raw ?? '');
      if (matKhau.length < 6) throw new BadRequestError('Mật khẩu tối thiểu 6 ký tự.');
      if (matKhau.length > 200) throw new BadRequestError('Mật khẩu quá dài.');
      await datMatKhauDuPhong(matKhau);
      logger.info('[du-phong] admin đặt mật khẩu cổng dự phòng (vé cũ hết hiệu lực)', { adminId: (req as any).userId });
    }
    res.json({ success: true, data: { daBat: await daCoMatKhau() } });
  } catch (err) { next(err); }
});

export default router;
