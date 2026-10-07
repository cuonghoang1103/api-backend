/**
 * IELTS đợt 1 (07/10/2026) — flashcard SRS, Sổ lỗi, phòng thi máy tính.
 * Gắn vào `ielts.routes.ts` (sau `authenticate`) ⇒ đường thật là
 *   /api/v1/ielts/vocab/*  ·  /api/v1/ielts/so-loi/*  ·  /api/v1/ielts/thi-may/*
 *
 * Giới hạn tần suất theo NGƯỜI (userId): chấm thẻ có thể nhanh (100 thẻ/ngày,
 * vài giây một thẻ) nên trần rộng; lời gọi AI trần chặt — trần token/ngày
 * (`checkTokenQuota`) vẫn là chốt chính.
 */
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '../types/index.js';
import * as vocab from '../services/ielts/vocab.service.js';
import * as soLoi from '../services/ielts/soLoi.service.js';
import * as thiMay from '../services/ielts/thiMay.service.js';

const router = Router();
const uid = (req: Request): number => req.userId!;
const ok = (res: Response<ApiResponse>, data: unknown) => res.json({ success: true, data });

const theoNguoi = (max: number, windowMs = 60_000) => rateLimit({
  windowMs, max, standardHeaders: true, legacyHeaders: false,
  keyGenerator: (req: Request) => `u${req.userId ?? 'x'}`,
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
  body('kyNang').isIn(['doc', 'nghe', 'viet']),
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

export default router;
