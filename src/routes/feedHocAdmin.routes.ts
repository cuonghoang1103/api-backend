/**
 * Admin — "Học mỗi ngày" trên Bảng tin + dọn bài bot mẫu cũ.
 *
 *   GET  /api/v1/admin/feed-hoc               thống kê: thư viện, đã đăng, bài kế tiếp, bài bot mẫu cũ
 *   POST /api/v1/admin/feed-hoc/dang          đăng NGAY bài kế tiếp (không phụ thuộc FEED_HOC_AUTOPOST)
 *   POST /api/v1/admin/feed-hoc/an-mau-cu     { xacNhan: true } ẩn bài bot mẫu cũ (PUBLIC → PRIVATE); thiếu xacNhan ⇒ chỉ đếm
 *   POST /api/v1/admin/feed-hoc/hien-lai      đảo ngược thao tác ẩn
 *
 * Không có đường XOÁ: xoá hẳn cần người dùng đồng ý riêng.
 */
import { Router, type Request, type Response, type NextFunction } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { THU_VIEN } from '../services/techTrends/hocFeed/thuVien.js';
import {
  anBaiMauCu, dangBaiKeTiep, docLichSu, hienLaiBaiMauCu, hocAutopostBat, thongKeBaiBot,
} from '../services/techTrends/hocFeed/dangBaiHoc.js';
import { getCuongMiniBotUser } from '../services/techTrends/cuongMiniBot.js';
import { soBaiMoiNgay } from '../services/techTrends/hocFeed/lichHoc.js';

const router = Router();
router.use(authenticate, requireAdmin('ROLE_ADMIN'));

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const bot = await getCuongMiniBotUser();
    const [lichSu, keTiep, baiBot] = await Promise.all([
      docLichSu(bot.id),
      dangBaiKeTiep({ xemTruoc: true }),
      thongKeBaiBot(),
    ]);
    res.json({
      success: true,
      data: {
        autopost: hocAutopostBat(),
        moiNgay: soBaiMoiNgay(process.env.FEED_HOC_MOI_NGAY),
        thuVien: THU_VIEN.length,
        daDang: new Set(lichSu.map((h) => h.id)).size,
        ganDay: lichSu.slice(0, 10),
        keTiep,
        baiBot,
      },
    });
  } catch (err) { next(err); }
});

router.post('/dang', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: await dangBaiKeTiep() });
  } catch (err) { next(err); }
});

router.post('/an-mau-cu', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const xacNhan = req.body?.xacNhan === true;
    res.json({ success: true, data: { ...(await anBaiMauCu({ thuThoi: !xacNhan })), thuThoi: !xacNhan } });
  } catch (err) { next(err); }
});

router.post('/hien-lai', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: { hienLai: await hienLaiBaiMauCu() } });
  } catch (err) { next(err); }
});

export default router;
