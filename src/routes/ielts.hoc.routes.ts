/**
 * IELTS đợt 1 (07/10/2026) — flashcard SRS, Sổ lỗi, phòng thi máy tính.
 * Gắn vào `ielts.routes.ts` (sau `authenticate`) ⇒ đường thật là
 *   /api/v1/ielts/vocab/*  ·  /api/v1/ielts/so-loi/*  ·  /api/v1/ielts/thi-may/*
 *
 * Giới hạn tần suất theo NGƯỜI (userId): chấm thẻ có thể nhanh (100 thẻ/ngày,
 * vài giây một thẻ) nên trần rộng; lời gọi AI trần chặt — trần token/ngày
 * (`checkTokenQuota`) vẫn là chốt chính.
 */
import { laAdmin } from '../services/pro.service.js';
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '../types/index.js';
import * as vocab from '../services/ielts/vocab.service.js';
import * as soLoi from '../services/ielts/soLoi.service.js';
import * as thiMay from '../services/ielts/thiMay.service.js';
import * as thiNoi from '../services/ielts/thiNoi.service.js';
import * as xepLop from '../services/ielts/xepLop.service.js';
import multer from 'multer';

const router = Router();
const uid = (req: Request): number => req.userId!;
const ok = (res: Response<ApiResponse>, data: unknown) => res.json({ success: true, data });

const theoNguoi = (max: number, windowMs = 60_000) => rateLimit({
  windowMs, max, standardHeaders: true, legacyHeaders: false,
  keyGenerator: (req: Request) => `u${req.userId ?? 'x'}`,
  // Admin không bị giới hạn tần suất (user 12/11/2026). Trần TIỀN theo ngày ở llm/budget.ts vẫn áp cho mọi người.
  skip: async (req: Request) => laAdmin(req.userId).catch(() => false),
  message: { success: false, message: 'Bạn thao tác quá nhanh, thử lại sau ít giây.', code: 'RATE_LIMIT_EXCEEDED' },
});
const ghiNhanh = theoNguoi(120);
const ghiVua = theoNguoi(30);
const goiAI = theoNguoi(8, 10 * 60_000);

// ─── Flashcard (SRS) ─────────────────────────────────────────
router.get('/vocab/hom-nay', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await vocab.homNay(uid(req))); } catch (e) { next(e); }
});
router.get('/vocab/thong-ke', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await vocab.thongKe(uid(req))); } catch (e) { next(e); }
});
router.post('/vocab/danh-gia', ghiNhanh,
  body('tu').isString().isLength({ min: 1, max: 80 }),
  body('diem').isInt({ min: 1, max: 4 }),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await vocab.danhGia(uid(req), req.body)); } catch (e) { next(e); }
  });
router.put('/vocab/muc-tieu', ghiVua,
  body('tuMoi').isInt({ min: 5, max: 300 }).withMessage('Mục tiêu từ 5 đến 300 từ mới/ngày'),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await vocab.datMucTieu(uid(req), req.body.tuMoi)); } catch (e) { next(e); }
  });
router.delete('/vocab/the/:tu', ghiVua,
  param('tu').isLength({ min: 1, max: 80 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await vocab.xoaThe(uid(req), req.params.tu)); } catch (e) { next(e); }
  });

// ─── Sổ lỗi ──────────────────────────────────────────────────
router.get('/so-loi',
  query('kyNang').optional().isIn([...soLoi.KY_NANG]),
  query('trangThai').optional().isIn(['den-han', 'vung', 'dang-on']),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await soLoi.danhSach(uid(req), req.query)); } catch (e) { next(e); }
  });
router.post('/so-loi/ghi', ghiVua,
  body('muc').isArray({ min: 1, max: 80 }).withMessage('muc phải là mảng 1–80 câu'),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await soLoi.ghi(uid(req), req.body.muc)); } catch (e) { next(e); }
  });
router.patch('/so-loi/:id', ghiVua,
  param('id').isInt({ min: 1 }), body('congThuc').optional({ nullable: true }).isString().isLength({ max: 2000 }),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await soLoi.sua(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
  });
router.delete('/so-loi/:id', ghiVua, param('id').isInt({ min: 1 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await soLoi.xoa(uid(req), Number(req.params.id))); } catch (e) { next(e); }
  });
router.post('/so-loi/:id/lam-lai', ghiVua,
  param('id').isInt({ min: 1 }), body('dung').isBoolean(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await soLoi.lamLai(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
  });
router.post('/so-loi/:id/goi-y', goiAI, param('id').isInt({ min: 1 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await soLoi.goiY(uid(req), Number(req.params.id))); } catch (e) { next(e); }
  });

// ─── Phòng thi máy tính ──────────────────────────────────────
router.get('/thi-may/luot', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await thiMay.dsLuot(uid(req), req.query.deId)); } catch (e) { next(e); }
});
router.get('/thi-may/luot/:id', param('id').isInt({ min: 1 }), validate, async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await thiMay.motLuot(uid(req), Number(req.params.id))); } catch (e) { next(e); }
});
router.post('/thi-may/luot', ghiVua,
  body('deId').isString().isLength({ min: 2, max: 40 }),
  body('kyNang').isIn([...thiMay.KY]),
  body('cheDo').isIn(['practice', 'full']),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await thiMay.luuLuot(uid(req), req.body)); } catch (e) { next(e); }
  });
router.patch('/thi-may/luot/:id', ghiVua, param('id').isInt({ min: 1 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await thiMay.capNhatLuot(uid(req), Number(req.params.id), req.body)); } catch (e) { next(e); }
  });
router.post('/thi-may/cham-viet', goiAI,
  body('bai').isString().isLength({ min: 100, max: 9000 }).withMessage('Bài viết từ 100 đến 9000 ký tự'),
  body('task').isIn([1, 2, '1', '2']),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await thiMay.chamViet(uid(req), req.body)); } catch (e) { next(e); }
  });
// Chấm chạy nền (bài Task 2 ~2 phút > trần 100 giây của Cloudflare) — web hỏi lại mỗi vài giây.
router.get('/thi-may/cham-viet/:viecId', param('viecId').isLength({ min: 5, max: 80 }), validate,
  (req, res: Response<ApiResponse>, next) => {
    try { ok(res, thiMay.ketQuaCham(uid(req), String(req.params.viecId))); } catch (e) { next(e); }
  });

// ─── Phòng thi SPEAKING với giám khảo AI (12/11/2026) — thiNoi.service.ts ───
// Audio chỉ ở RAM (memoryStorage), không chạm đĩa/R2 — giọng nói là dữ liệu sinh trắc học.
const audioNoiThi = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
// Một câu trả lời: multipart `audio` (WAV 16 kHz mono) + `part` (1|2|3) + `cau` (câu hỏi, gợi ý cho Whisper).
router.post('/thi-may/noi/luot', ghiVua, audioNoiThi.single('audio'), async (req, res: Response<ApiResponse>, next) => {
  try {
    if (!req.file?.buffer?.length) throw new Error('Thiếu audio');
    ok(res, await thiNoi.luotNoi(uid(req), { audio: req.file.buffer, part: req.body?.part, cau: req.body?.cau }));
  } catch (e) { next(e); }
});
// Chấm cả bài (chạy nền): banGhi = [{part, cau, transcript, giay, phatAm}] web gom từ các lượt trên.
router.post('/thi-may/noi/cham', goiAI,
  body('deId').isString().isLength({ min: 2, max: 40 }),
  body('cheDo').isIn(['thi', 'luyen']),
  body('banGhi').isArray({ min: 1, max: 30 }).withMessage('banGhi phải là mảng 1–30 câu'),
  body('banGhi.*.cau').isString().isLength({ min: 1, max: 400 }),
  body('banGhi.*.transcript').isString().isLength({ max: 4000 }),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await thiNoi.chamNoi(uid(req), req.body)); } catch (e) { next(e); }
  });
router.get('/thi-may/noi/cham/:viecId', param('viecId').isLength({ min: 5, max: 80 }), validate,
  (req, res: Response<ApiResponse>, next) => {
    try { ok(res, thiNoi.ketQuaChamNoi(uid(req), String(req.params.viecId))); } catch (e) { next(e); }
  });

// ─── Xếp lớp sau test đầu vào (Đề 0) — xepLop.service.ts ───
router.get('/thi-may/xep-lop', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await xepLop.layXepLop(uid(req))); } catch (e) { next(e); }
});
router.post('/thi-may/xep-lop', ghiVua,
  body('sangLoc').isInt({ min: 0, max: 30 }).withMessage('sangLoc = số câu đúng 0–30'),
  body('nghe').optional({ nullable: true }).isInt({ min: 0, max: 40 }),
  body('doc').optional({ nullable: true }).isInt({ min: 0, max: 40 }),
  body('viet').optional({ nullable: true }).isFloat({ min: 0, max: 9 }),
  body('noi').optional({ nullable: true }).isFloat({ min: 0, max: 9 }),
  body('deId').optional({ nullable: true }).isString().isLength({ min: 2, max: 40 }),
  validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await xepLop.luuXepLop(uid(req), req.body)); } catch (e) { next(e); }
  });

export default router;
