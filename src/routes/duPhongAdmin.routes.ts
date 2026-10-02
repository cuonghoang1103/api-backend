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
import { datKeyGiaHan, trangThaiKeyGiaHan, TRAN_SO_TOKEN } from '../services/agent/keyGiaHan.js';
import { tranToken, soGioCuaSo } from '../services/agent/quota.js';
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

/**
 * KEY GIA HẠN hạn mức AI Code (02/10/2026) — `/api/v1/admin/du-phong/gia-han`.
 * Cùng khu admin với cổng dự phòng nhưng KHÁC khoá `app_settings`. Xem
 * `services/agent/keyGiaHan.ts`.
 *
 * PUT body:
 *   { key: string }            — đặt/đổi key (key cũ + mọi lần cấp cũ chết ngay)
 *   { key: null }              — TẮT (cũng làm mọi lần cấp cũ thôi tính)
 *   { soTokenMoiLan: number }  — chỉ đổi số token mỗi lần nhập (có thể đi kèm key)
 */
router.get('/gia-han', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({
      success: true,
      data: { ...(await trangThaiKeyGiaHan()), tranGoc: tranToken(), soGio: soGioCuaSo() },
    });
  } catch (err) { next(err); }
});

router.put('/gia-han', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const body = (req.body ?? {}) as { key?: unknown; soTokenMoiLan?: unknown };
    const o: { key?: string | null; soTokenMoiLan?: number } = {};
    if (body.key === null) {
      o.key = null;
    } else if (body.key !== undefined) {
      const key = String(body.key).trim();
      if (key.length < 6) throw new BadRequestError('Key tối thiểu 6 ký tự.');
      if (key.length > 200) throw new BadRequestError('Key quá dài.');
      o.key = key;
    }
    if (body.soTokenMoiLan !== undefined) {
      const so = Number(body.soTokenMoiLan);
      if (!Number.isFinite(so) || so < 1000 || so > TRAN_SO_TOKEN) {
        throw new BadRequestError(`Số token mỗi lần phải trong khoảng 1.000 – ${TRAN_SO_TOKEN.toLocaleString('vi-VN')}.`);
      }
      o.soTokenMoiLan = Math.round(so);
    }
    if (o.key === undefined && o.soTokenMoiLan === undefined) throw new BadRequestError('Không có gì để đổi.');
    await datKeyGiaHan(o);
    logger.info('[gia-han] admin cập nhật key gia hạn', {
      adminId: (req as any).userId,
      viec: o.key === null ? 'tat' : o.key ? 'dat-doi' : 'so-token',
      soTokenMoiLan: o.soTokenMoiLan,
    });
    res.json({ success: true, data: await trangThaiKeyGiaHan() });
  } catch (err) { next(err); }
});

export default router;
