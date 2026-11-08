/**
 * Góp ý & báo lỗi (08/11/2026) — xem src/services/gopY.service.ts.
 *
 *   POST  /api/v1/gop-y                 khách hoặc người đã đăng nhập gửi góp ý / chấm sao (trần 8 lượt / 10 phút / IP)
 *   GET   /api/v1/gop-y/cua-toi         lịch sử góp ý của tôi + lời trả lời của admin
 *   GET   /api/v1/gop-y/nen-hoi         hộp đánh giá tự hiện có nên hỏi tôi không (đã chấm sao trong 60 ngày ⇒ không)
 *   GET   /api/v1/admin/gop-y           danh sách (lọc trạng thái/loại/tìm, phân trang 30)
 *   GET   /api/v1/admin/gop-y/thong-ke  số theo trạng thái/loại + sao trung bình (tất cả / 30 ngày)
 *   PATCH /api/v1/admin/gop-y/:id       đổi trạng thái, trả lời (người gửi thấy + nhận thông báo), ghi chú nội bộ
 */
import { Router, type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import {
  taoGopY, gopYCuaToi, nenHoiDanhGia, danhSachAdmin, thongKeAdmin, capNhatAdmin, type LoaiGopY,
} from '../services/gopY.service.js';

export const gopYRouter = Router();
export const adminGopYRouter = Router();

const tranGui = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Bạn gửi hơi nhanh — đợi vài phút rồi gửi tiếp nhé.', code: 'GOP_Y_RATE_LIMIT' },
});

gopYRouter.post('/', tranGui, optionalAuth, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const ua = String(req.headers['user-agent'] ?? '').slice(0, 300);
    const manHinh = typeof b.manHinh === 'string' ? b.manHinh.slice(0, 40) : '';
    const row = await taoGopY(
      {
        loai: String(b.loai ?? '') as LoaiGopY,
        soSao: b.soSao == null || b.soSao === '' ? null : Number(b.soSao),
        tieuDe: typeof b.tieuDe === 'string' ? b.tieuDe : null,
        noiDung: typeof b.noiDung === 'string' ? b.noiDung : null,
        mucDo: typeof b.mucDo === 'string' ? b.mucDo : null,
        trang: typeof b.trang === 'string' && b.trang.startsWith('/') ? b.trang : null,
        nguon: b.nguon === 'POPUP' ? 'POPUP' : 'PAGE',
        emailLienHe: typeof b.emailLienHe === 'string' ? b.emailLienHe : null,
        thietBi: [ua, manHinh].filter(Boolean).join(' · '),
        anhUrls: Array.isArray(b.anhUrls) ? (b.anhUrls as string[]) : [],
      },
      req.userId ?? null,
    );
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});

gopYRouter.get('/cua-toi', authenticate, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.json({ success: true, data: await gopYCuaToi(req.userId!) });
  } catch (e) {
    next(e);
  }
});

gopYRouter.get('/nen-hoi', authenticate, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.json({ success: true, data: { nenHoi: await nenHoiDanhGia(req.userId!) } });
  } catch (e) {
    next(e);
  }
});

adminGopYRouter.use(authenticate, requireAdmin('ROLE_ADMIN'));

adminGopYRouter.get('/', async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const q = req.query;
    res.json({
      success: true,
      data: await danhSachAdmin({
        trangThai: typeof q.trangThai === 'string' ? q.trangThai : undefined,
        loai: typeof q.loai === 'string' ? q.loai : undefined,
        tim: typeof q.tim === 'string' ? q.tim : undefined,
        trang: q.trang ? Number(q.trang) || 1 : 1,
        id: q.id ? Number(q.id) || undefined : undefined,
      }),
    });
  } catch (e) {
    next(e);
  }
});

adminGopYRouter.get('/thong-ke', async (_req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.json({ success: true, data: await thongKeAdmin() });
  } catch (e) {
    next(e);
  }
});

adminGopYRouter.patch('/:id', async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new AppError('Mã góp ý không hợp lệ', 400, 'GOP_Y_ID');
    const b = (req.body ?? {}) as Record<string, unknown>;
    const row = await capNhatAdmin(id, req.userId!, {
      trangThai: typeof b.trangThai === 'string' ? b.trangThai : undefined,
      traLoi: b.traLoi === undefined ? undefined : b.traLoi === null ? null : String(b.traLoi),
      ghiChuNoiBo: b.ghiChuNoiBo === undefined ? undefined : b.ghiChuNoiBo === null ? null : String(b.ghiChuNoiBo),
    });
    res.json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});
