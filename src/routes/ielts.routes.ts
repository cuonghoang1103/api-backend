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
