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
  xinDuongNen,
} from '../services/voInk.service.js';
import { veBangNet, batDauVe, xemViecVe } from '../services/voVe.service.js';
import { vietLaiTrang } from '../services/voVietLai.service.js';

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
/**
 * Xin đường đẩy một tệp NỀN (PDF giáo trình / ảnh quét).
 *
 * Khoá đánh theo sha256 nội dung, nên gọi lại với cùng tệp trả `daCo: true`
 * và máy khỏi tải lên lần nữa — nhập một PDF 20 trang chỉ tốn một lượt đẩy.
 */
router.post('/nen/duong-day', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { sha256, duoi, soByte } = req.body ?? {};
    const kq = await xinDuongNen(
      req.userId!, String(sha256 ?? ''), String(duoi ?? ''), Number(soByte ?? 0));
    res.json({ success: true, data: kq });
  } catch (e) { next(e); }
});

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

/**
 * AI vẽ bằng nét: `{ de, kieu: 'hinh' | 'sodo' }` → `{ net: [[[x,y]…]…], rong, cao, nhan }`.
 * Toạ độ đã co về khung 1000 theo cạnh dài; app tự đặt và co vào trang.
 */
router.post('/ve/viec', (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: batDauVe(req.userId!, req.body ?? {}) });
  } catch (e) { next(e); }
});

/** Hỏi kết quả lượt vẽ chạy nền: `{ xong: false, giay }` hoặc `{ xong: true, net, … }`. */
router.get('/ve/viec/:id', (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: xemViecVe(req.userId!, String(req.params.id)) });
  } catch (e) { next(e); }
});

/** Bản đồng bộ cũ (app ≤ build hiện tại). Dễ chạm trần 100s của Cloudflare — app mới dùng `/ve/viec`. */
router.post('/ve', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await veBangNet(req.userId!, req.body ?? {}) });
  } catch (e) { next(e); }
});

/**
 * ✍️ AI viết lại trang: `{ anh: base64 JPEG, goiY?: chữ Vision đọc trên máy, giay?: loại giấy }`
 * → `{ khoi: [...], sua: [...], chuThuan, canhBao: string[], soKhongDoc, model }`.
 * Chạy 20–90 giây (model thị giác). Lỗi có mã: THIEU_ANH · ANH_QUA_LON · ANH_HONG ·
 * AI_UNAVAILABLE (503) · QUOTA_EXCEEDED (429) · AI_LOI / VIET_LAI_HONG (502) · TRANG_TRONG (422).
 */
router.post('/viet-lai', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await vietLaiTrang(req.userId!, req.body ?? {}) });
  } catch (e) { next(e); }
});

export default router;
