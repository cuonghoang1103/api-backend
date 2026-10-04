/**
 * Content Creator — AI (04/10/2026). Gắn dưới `/api/v1/admin/content/ai` bởi
 * `content.routes.ts`, nên đã qua `authenticate` + `requireAdmin` ở đó.
 *
 *   GET    /khoa-hoc            danh mục Academy + Courses (một danh sách tìm được)
 *   GET    /khoa-hoc/:slug      mục lục khoá: chương → bài, kèm dự án đã có
 *   POST   /viec                tạo việc AI chạy nền → { viec }
 *   GET    /viec/:id            hỏi lại tiến độ / kết quả
 *   DELETE /viec/:id            huỷ lô bài (dừng sau bài đang chạy)
 *
 * Vì sao việc chạy NỀN: Cloudflare cắt yêu cầu > 100 giây — xem service.
 */
import { Router, Response } from 'express';
import type { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { batDauViec, danhMucKhoaHoc, huyViec, mucLucKhoaHoc, xemViec } from '../services/creatorAi.service.js';

const router = Router();

function nguoiDung(req: { userId?: number }): number {
  if (!req.userId) throw new AppError('Chưa đăng nhập', 401, 'UNAUTHORIZED');
  return req.userId;
}

router.get('/khoa-hoc', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await danhMucKhoaHoc() });
  } catch (e) { next(e); }
});

router.get('/khoa-hoc/:slug', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await mucLucKhoaHoc(String(req.params.slug)) });
  } catch (e) { next(e); }
});

router.post('/viec', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.status(202).json({ success: true, data: await batDauViec(nguoiDung(req), (req.body ?? {}) as Record<string, unknown>) });
  } catch (e) { next(e); }
});

router.get('/viec/:id', (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: xemViec(nguoiDung(req), String(req.params.id)) });
  } catch (e) { next(e); }
});

router.delete('/viec/:id', (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: huyViec(nguoiDung(req), String(req.params.id)) });
  } catch (e) { next(e); }
});

export default router;
