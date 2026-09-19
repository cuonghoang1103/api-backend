/**
 * Học tiếng Anh bằng VIDEO — danh mục, danh sách video, phụ đề.
 *
 * Đặt sau `authenticate` như mọi route nội dung khác: phụ đề là kết quả của
 * một đợt thu tốn công, không phải thứ để mở cho cả internet cào về.
 */
import { Router, type Response } from 'express';
import { param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '../types/index.js';
import * as svc from '../services/video/phuDe.service.js';

const router = Router();
router.use(authenticate);

const ok = (res: Response<ApiResponse>, data: unknown) => res.json({ success: true, data });

router.get('/danh-muc', async (_req, res: Response<ApiResponse>, next) => {
  try { ok(res, await svc.danhMuc()); } catch (e) { next(e); }
});

router.get('/khoa/:id(\\d+)', param('id').isInt(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await svc.videoCuaKhoa(Number(req.params.id))); } catch (e) { next(e); }
  });

router.get('/phu-de/:lessonId(\\d+)', param('lessonId').isInt(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await svc.phuDe(Number(req.params.lessonId))); } catch (e) { next(e); }
  });

export default router;
