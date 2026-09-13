/**
 * Hộp thư admin — API cho cái chuông trong /admin.
 * ─────────────────────────────────────────────────────────────────────────
 * Mount: /api/v1/admin/thong-bao   (toàn bộ yêu cầu quyền ADMIN)
 *
 * Xem `services/thongBaoAdmin.service.ts` để biết vì sao bảng này tồn tại.
 */
import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { demChuaDoc } from '../services/thongBaoAdmin.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();
router.use(authenticate, requireAdmin('ROLE_ADMIN'));

/**
 * GET /  — danh sách, mới nhất trước.
 * ?chuaDoc=1   chỉ thứ chưa đọc
 * ?canXuLy=1   chỉ việc còn phải làm
 * ?loai=XIN_KEY
 */
router.get('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const gioiHan = Math.min(100, Math.max(1, Number(req.query.limit) || 30));
    const truoc = Number(req.query.truoc) || 0; // phân trang theo id, không theo offset

    const where: Record<string, unknown> = {};
    if (req.query.chuaDoc === '1') where.daDoc = false;
    if (req.query.canXuLy === '1') { where.mucDo = 'can_xu_ly'; where.daXuLy = false; }
    if (typeof req.query.loai === 'string' && req.query.loai) where.loai = req.query.loai;
    // Phân trang theo id giảm dần: thêm tin mới trong lúc đang cuộn cũng không
    // làm lệch trang như OFFSET.
    if (truoc > 0) where.id = { lt: truoc };

    const [rows, dem] = await Promise.all([
      prisma.adminNotification.findMany({ where, orderBy: { id: 'desc' }, take: gioiHan }),
      demChuaDoc(),
    ]);

    // Tên người gây ra sự kiện — một truy vấn gộp, không phải mỗi dòng một lượt.
    const ids = [...new Set(rows.map((r) => r.userId).filter((x): x is number => typeof x === 'number'))];
    const nguoi = ids.length
      ? await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, username: true, fullName: true } })
      : [];
    const theoId = new Map(nguoi.map((u) => [u.id, u]));

    res.json({
      success: true,
      data: {
        items: rows.map((r) => ({
          id: r.id,
          loai: r.loai,
          tieuDe: r.tieuDe,
          noiDung: r.noiDung,
          duongDan: r.duongDan,
          mucDo: r.mucDo,
          daDoc: r.daDoc,
          daXuLy: r.daXuLy,
          createdAt: r.createdAt.toISOString(),
          nguoi: r.userId ? (theoId.get(r.userId) ?? { id: r.userId, username: null, fullName: null }) : null,
        })),
        ...dem,
        conNua: rows.length === gioiHan,
      },
    });
  } catch (err) { next(err); }
});

/** GET /dem — chỉ hai con số, cho chuông gọi thường xuyên. */
router.get('/dem', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await demChuaDoc() });
  } catch (err) { next(err); }
});

/** POST /:id/doc — đánh dấu đã đọc. */
router.post('/:id/doc', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    await prisma.adminNotification.updateMany({
      where: { id: Number(req.params.id), daDoc: false },
      data: { daDoc: true, docLuc: new Date() },
    });
    res.json({ success: true, data: await demChuaDoc() });
  } catch (err) { next(err); }
});

/**
 * POST /:id/xong — đánh dấu ĐÃ XỬ LÝ.
 *
 * Khác `doc`: đọc rồi vẫn có thể chưa làm. Con số đỏ đếm theo cái này, nên
 * gộp hai khái niệm lại là mất hẳn khả năng trả lời "còn gì đang chờ tôi".
 */
router.post('/:id/xong', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    await prisma.adminNotification.updateMany({
      where: { id: Number(req.params.id) },
      data: { daXuLy: true, daDoc: true, docLuc: new Date() },
    });
    res.json({ success: true, data: await demChuaDoc() });
  } catch (err) { next(err); }
});

/** POST /doc-het — dọn chuông. KHÔNG đụng `daXuLy`: việc vẫn còn đó. */
router.post('/doc-het', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    await prisma.adminNotification.updateMany({ where: { daDoc: false }, data: { daDoc: true, docLuc: new Date() } });
    res.json({ success: true, data: await demChuaDoc() });
  } catch (err) { next(err); }
});

export default router;
