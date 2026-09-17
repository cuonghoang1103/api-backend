/**
 * Vở viết tay (iPad) — đồng bộ.
 * ─────────────────────────────────────────────────────────────────────
 * Mounted at /api/v1/vo. Mọi route đòi đăng nhập; service tự giới hạn
 * theo `userId` nên không có đường nào chạm vở của người khác.
 *
 * Luồng đẩy một trang, đúng ba nhịp:
 *   1. POST /vo/sync              → gửi cây, nhận id máy chủ + cờ xung đột
 *   2. POST /vo/trang/:id/duong-day → xin URL ký sẵn, PUT THẲNG lên R2
 *   3. POST /vo/trang/:id/xac-nhan  → máy chủ HEAD kiểm rồi mới ghi con trỏ
 *
 * Nhịp 2 đi thẳng R2 nên một trang 2MB không ăn RAM của API và không đụng
 * trần 100MB của proxy Cloudflare.
 */
import { Router, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import {
  dongBoCay, xinDuongDayNet, xacNhanNet, layCayVo, xoaTrangVo, xoaCuonVo,
} from '../services/voInk.service.js';

const router = Router();
router.use(authenticate);

function soNguyen(v: unknown, ten: string): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) {
    throw new AppError(`${ten} không hợp lệ`, 400, 'INVALID_ID');
  }
  return n;
}

/** Kéo toàn bộ cây về — máy mới cài, hoặc máy thứ hai. */
router.get('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await layCayVo(req.userId!) });
  } catch (e) { next(e); }
});

/** Đẩy cây lên. Idempotent theo `clientId`. */
router.post('/sync', async (req, res: Response<ApiResponse>, next) => {
  try {
    const mons = req.body?.mons;
    res.json({ success: true, data: await dongBoCay(req.userId!, mons) });
  } catch (e) { next(e); }
});

/** Xin URL ký sẵn để PUT tệp nét vẽ (+ ảnh xem trước) thẳng lên R2. */
router.post('/trang/:id/duong-day', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = soNguyen(req.params.id, 'Mã trang');
    const coAnh = req.body?.coAnhXemTruoc !== false;
    res.json({ success: true, data: await xinDuongDayNet(req.userId!, id, coAnh) });
  } catch (e) { next(e); }
});

/** Chốt lượt đẩy. Trả 409 `INK_CONFLICT` khi máy khác đã ghi chen vào. */
router.post('/trang/:id/xac-nhan', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = soNguyen(req.params.id, 'Mã trang');
    const { inkKey, previewKey, phienBanDuaTren, soNet } = req.body ?? {};
    const data = await xacNhanNet(req.userId!, id, {
      inkKey, previewKey, phienBanDuaTren, soNet,
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

/** Xoá mềm nhiều trang (vào thùng rác 30 ngày sẵn có của Notes). */
router.post('/trang/xoa', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await xoaTrangVo(req.userId!, req.body?.clientIds) });
  } catch (e) { next(e); }
});

router.post('/cuon/xoa', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await xoaCuonVo(req.userId!, req.body?.clientId) });
  } catch (e) { next(e); }
});

export default router;
