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
import multer from 'multer';

const router = Router();
router.use(authenticate);

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

router.delete('/tien-do/:stage/:kind/:muc',
  param('muc').isLength({ min: 1, max: 120 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try {
      ok(res, await svc.xoaTienDo(uid(req), String(req.params.stage), String(req.params.kind), String(req.params.muc)));
    } catch (e) { next(e); }
  });

export default router;
