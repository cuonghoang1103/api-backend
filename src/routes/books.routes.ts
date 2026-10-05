/**
 * /api/v1/books — tiến độ đọc sách của người dùng (05/10/2026). Nội dung sách là tệp
 * tĩnh ở frontend/public/books; ở đây chỉ lưu "đọc tới đâu, bao lâu". Xem
 * src/services/books/docSach.service.ts.
 */
import { Router, type Request, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import { tongQuan, ghiNhip, xoaTienDo } from '../services/books/docSach.service.js';

const router = Router();
router.use(authenticate);
const uid = (req: Request): number => req.userId!;
const ok = (res: Response<ApiResponse>, data: unknown) => res.json({ success: true, data });

router.get('/tien-do', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await tongQuan(uid(req))); } catch (e) { next(e); }
});
router.put('/tien-do/:slug', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await ghiNhip(uid(req), String(req.params.slug), req.body ?? {})); } catch (e) { next(e); }
});
router.delete('/tien-do/:slug', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await xoaTienDo(uid(req), String(req.params.slug))); } catch (e) { next(e); }
});

export default router;
