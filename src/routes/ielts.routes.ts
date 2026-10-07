/**
 * ============================================================
 * IELTS — nội dung + tiến độ  (mounted at /api/v1/ielts)
 * ============================================================
 *
 * Dựng cho app iOS/iPad. Trang web `/tech-trends/ielts` KHÔNG dùng những
 * route này — nó vẫn import thẳng tệp TS như cũ. Nguồn sự thật là tệp TS đó;
 * bảng `ielts_content` chỉ là bản sao do máy dựng lại (xem
 * `scripts/ielts-dung-json.mts` và chốt chống trôi `nguon.test.ts`).
 *
 * `authenticate` gác mọi route: tiến độ là dữ liệu cá nhân, và phần nội dung
 * để chung một cổng cho app chỉ phải giữ một đường.
 */
import { Router, type Request, type Response } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '../types/index.js';
import * as svc from '../services/ielts/ielts.service.js';
import { hoiVeChu, chamBaiViet, CAC_Y } from '../services/ielts/hoiAI.service.js';
import { dungDe, nopDe, lichSuThi } from '../services/ielts/deThi.service.js';
import { chamBaiNoi } from '../services/ielts/chamNoi.service.js';
import { chamPhatAm } from '../services/ielts/phatAm.service.js';
import { goiGiaSu, hoiGiaSu, troChuyen } from '../services/ielts/goiGiaSu.service.js';
import { docTo } from '../services/ielts/docTo.service.js';
import { xemChuViet, chamVietTay, MAX_TRANG } from '../services/ielts/vietTay.service.js';
import multer from 'multer';
import hocRoutes from './ielts.hoc.routes.js';

const router = Router();
router.use(authenticate);
// Flashcard SRS (/vocab/*) · Sổ lỗi (/so-loi/*) · Phòng thi máy tính (/thi-may/*) — 07/10/2026.
router.use(hocRoutes);

const uid = (req: Request): number => req.userId!;
const ok = (res: Response<ApiResponse>, data: unknown) => res.json({ success: true, data });

// ─── Nội dung ────────────────────────────────────────────────

/** Màn đầu: lộ trình 4 chặng + mục lục có số mục và số đã xong. Nhẹ. */
router.get('/lo-trinh', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await svc.loTrinh(uid(req))); } catch (e) { next(e); }
});

/** Phần dùng chung: roadmap | life | exam | typing. Khai TRƯỚC `/:stage/:kind`
 *  để `chung` không bị hiểu thành tên một chặng. */
router.get('/chung/:kind', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await svc.phanDungChung(String(req.params.kind))); } catch (e) { next(e); }
});

/** Một phần của một chặng: `/chang/stage1/readings` (hoặc `/chang/1/readings`). */
router.get('/chang/:stage/:kind', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await svc.phanCuaChang(String(req.params.stage), String(req.params.kind))); } catch (e) { next(e); }
});

// ─── Đọc to (giọng Anh WaveNet, cache trên R2) ───────────────
// Trả `{ url }` của file mp3; `{ url: null, lyDo }` khi chưa có khoá TTS hoặc
// hết hạn mức ngày — web lùi về giọng trình duyệt. Xem docTo.service.ts.
router.post('/doc',
  body('text').isString().isLength({ min: 1, max: 1500 }),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await docTo(uid(req), req.body)); } catch (e) { next(e); }
  });

// ─── Hỏi AI về một mẩu chữ trong bài ─────────────────────────
//
// `y` là câu hỏi đặt sẵn (nghia | doc | nguphap | dich | day | dethi); `cauHoi`
// là câu người học tự gõ. Có ít nhất một trong hai.
router.post('/ai/hoi',
  body('chu').isLength({ min: 1, max: 2000 }).withMessage('Chưa chọn chữ nào'),
  body('y').optional().isIn(CAC_Y),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await hoiVeChu(uid(req), req.body)); } catch (e) { next(e); }
  });

/** Chấm bài viết theo 4 tiêu chí IELTS. */
router.post('/ai/cham-viet',
  body('bai').isLength({ min: 50, max: 8000 }).withMessage('Bài viết từ 50 đến 8000 ký tự'),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await chamBaiViet(uid(req), req.body)); } catch (e) { next(e); }
  });

// ─── Viết TAY (Apple Pencil) — AI nhìn ảnh nét chữ ────────────
// Ảnh base64 trong thân JSON (express.json 10mb), không lưu lại ở đâu.

/** Tập viết kana/kanji: một ảnh ghép các hàng + danh sách chữ mục tiêu. */
router.post('/ai/xem-chu-viet',
  body('image').isString().isLength({ min: 100, max: 2_200_000 }).withMessage('Ảnh thiếu hoặc quá lớn'),
  body('chars').isArray({ min: 1, max: 20 }).withMessage('chars phải là mảng 1–20 chữ'),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await xemChuViet(uid(req), req.body)); } catch (e) { next(e); }
  });

/** Bài IELTS viết tay: 1–4 trang ảnh → chép nguyên văn → chấm 4 tiêu chí. */
router.post('/ai/cham-viet-tay',
  body('pages').isArray({ min: 1, max: MAX_TRANG }).withMessage(`pages phải là mảng 1–${MAX_TRANG} ảnh`),
  body('pages.*').isString().isLength({ min: 100, max: 2_200_000 }).withMessage('Mỗi trang tối đa ~1,5MB'),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await chamVietTay(uid(req), req.body)); } catch (e) { next(e); }
  });

/**
 * Chấm phần NÓI: nhận audio, phiên âm, chấm theo tiêu chí IELTS Speaking.
 *
 * ⚠️ `memoryStorage` — audio KHÔNG chạm đĩa và không lên R2. Giọng nói là dữ
 * liệu sinh trắc học; một bản sao nằm lại trên máy chủ là thứ phải xin phép
 * riêng, mà tính năng này không cần tới nó.
 *
 * Dùng multer RIÊNG chứ không mượn `upload` dùng chung của app: cái chung ghi
 * xuống đĩa, và "mượn tạm" là cách những tệp không định lưu vẫn được lưu.
 */
const audioNoi = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
// Chấm phát âm từng âm (Azure). Web gửi WAV 16 kHz mono; audio không được lưu.
const audioPhatAm = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 } });
router.post('/ai/cham-phat-am', audioPhatAm.single('audio'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const f = req.file;
    if (!f?.buffer?.length) throw new Error('Thiếu audio');
    ok(res, await chamPhatAm(uid(req), { audio: f.buffer, cau: String(req.body?.cau ?? ''), giong: req.body?.giong ? String(req.body.giong) : undefined }));
  } catch (e) { next(e); }
});
// 📞 Luyện phát âm cùng gia sư (giọng) — goiGiaSu.service.ts.
// Lượt luyện: multipart `audio` (WAV 16 kHz; vắng = mở cuộc gọi) + `trangThai` JSON
// {danhSach, viTri, lanThu, chuDe}. Lượt hỏi (có AI): JSON {cauHoi, mau, chuDe}.
router.post('/ai/goi-gia-su', audioPhatAm.single('audio'), async (req, res: Response<ApiResponse>, next) => {
  try {
    let tt: { danhSach?: unknown; viTri?: unknown; lanThu?: unknown; chuDe?: unknown } = {};
    try { tt = JSON.parse(String(req.body?.trangThai ?? '{}')); } catch { /* lượt mở đầu có thể không gửi */ }
    ok(res, await goiGiaSu(uid(req), { audio: req.file?.buffer, ...tt }));
  } catch (e) { next(e); }
});
router.post('/ai/goi-gia-su/hoi', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await hoiGiaSu(uid(req), req.body ?? {})); } catch (e) { next(e); }
});
// 💬 Trò chuyện song ngữ cùng CuongMini (05/10/2026) — nói tự do bằng ngôn ngữ đang học.
router.post('/ai/tro-chuyen', audioNoi.single('audio'), async (req, res: Response<ApiResponse>, next) => {
  try {
    let tt: { lichSu?: unknown; ngonNgu?: unknown; chuDe?: unknown; giong?: unknown } = {};
    try { tt = JSON.parse(String(req.body?.trangThai ?? '{}')); } catch { /* lượt mở đầu */ }
    ok(res, await troChuyen(uid(req), { audio: req.file?.buffer, ...tt }));
  } catch (e) { next(e); }
});
router.post('/ai/cham-noi', audioNoi.single('audio'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const f = req.file;
    if (!f?.buffer?.length) throw new Error('Thiếu audio');
    ok(res, await chamBaiNoi(uid(req), {
      audio: f.buffer,
      filename: f.originalname || 'noi.m4a',
      mimetype: f.mimetype || 'audio/m4a',
      cauHoi: req.body?.cauHoi ? String(req.body.cauHoi) : undefined,
      part: req.body?.part ? String(req.body.part) : undefined,
    }));
  } catch (e) { next(e); }
});

// ─── Phòng thi ───────────────────────────────────────────────
//
// `hat` giữ cho "làm lại đúng đề này" ra đúng bộ câu cũ — so điểm lần hai
// với lần một chỉ có nghĩa khi hai lần cùng một đề.
router.get('/de-thi/lich-su', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await lichSuThi(uid(req))); } catch (e) { next(e); }
});
router.get('/de-thi/:chang', async (req, res: Response<ApiResponse>, next) => {
  try {
    const hat = Number(req.query.hat);
    ok(res, await dungDe(String(req.params.chang), Number.isFinite(hat) && hat > 0 ? Math.floor(hat) : Date.now() % 100000));
  } catch (e) { next(e); }
});
router.post('/de-thi/nop',
  body('chang').notEmpty(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await nopDe(uid(req), req.body)); } catch (e) { next(e); }
  });

// ─── Tiến độ ─────────────────────────────────────────────────

router.get('/tien-do', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await svc.layTienDo(uid(req), req.query.stage as string | undefined)); } catch (e) { next(e); }
});

router.post('/tien-do',
  body('items').isArray({ min: 1, max: 200 }).withMessage('items phải là mảng 1–200 mục'),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await svc.ghiTienDo(uid(req), req.body.items)); } catch (e) { next(e); }
  });

// Chuỗi ngày học của một khoá + ghi "hôm nay có học" từ việc không qua /tien-do (luyện nói cùng CuongMini).
router.get('/chuoi', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await svc.layChuoi(uid(req), String(req.query.stage ?? ''))); } catch (e) { next(e); }
});
router.post('/chuoi/ghi', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await svc.ghiNgayHoc(uid(req), String(req.body?.stage ?? ''))); } catch (e) { next(e); }
});

router.delete('/tien-do/:stage/:kind/:muc',
  param('muc').isLength({ min: 1, max: 120 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try {
      ok(res, await svc.xoaTienDo(uid(req), String(req.params.stage), String(req.params.kind), String(req.params.muc)));
    } catch (e) { next(e); }
  });

export default router;
