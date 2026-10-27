/**
 * /api/v1/giao-dien — giao diện chung do admin đặt (27/10/2026). Xem services/giaoDien/giaoDienWeb.ts.
 *   GET  /        công khai (web đọc lúc tải trang để biết nền 4 mùa mặc định)
 *   PUT  /admin   admin đổi
 */
import { Router, type NextFunction, type Request, type Response } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { datGiaoDienWeb, docGiaoDienWeb } from '../services/giaoDien/giaoDienWeb.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const v = await docGiaoDienWeb();
  res.set('Cache-Control', 'public, max-age=60');
  res.json({ success: true, data: v });
});

// requireAdmin là HÀM TẠO middleware ⇒ phải gọi `requireAdmin()`. 27/10 viết thiếu () ⇒ Express gọi hàm tạo như middleware,
// không ai gọi next() ⇒ PUT treo mãi, trang /admin/giao-dien xoay không dừng và chưa lưu được lần nào.
router.put('/admin', authenticate, requireAdmin(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const v = await datGiaoDienWeb({
      ...(b.chuDeMacDinh !== undefined ? { chuDeMacDinh: b.chuDeMacDinh as never } : {}),
      ...(b.epTatCa !== undefined ? { epTatCa: b.epTatCa === true } : {}),
      ...(b.nenAdmin !== undefined ? { nenAdmin: b.nenAdmin as never } : {}),
    });
    res.json({ success: true, data: v });
  } catch (err) { next(err); }
});

export default router;
