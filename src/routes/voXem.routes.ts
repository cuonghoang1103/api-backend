/**
 * Link CHỈ-XEM một trang Vở — KHÔNG cần đăng nhập (23/10/2026).
 * Mounted at /api/v1/vo-xem (bộ giới hạn chung `/api/` vẫn áp).
 *
 * Ảnh đi qua đây chứ không trả URL CDN: thu hồi link (`DELETE
 * /vo/trang/:id/chia-se`) là người cầm link mất ảnh ngay, không còn URL nào
 * để giữ lại. Token sai / đã thu hồi / trang đã xoá ⇒ 404 như nhau.
 */
import { Router, type Response } from 'express';
import type { ApiResponse } from '../types/index.js';
import { anhCongKhai, xemCongKhai } from '../services/voChiaSe.service.js';

const router = Router();

router.use((_req, res, next) => {
  // Trang riêng tư của một người — không cho máy tìm kiếm lập chỉ mục.
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});

router.get('/:token', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'private, no-store');
    res.json({ success: true, data: await xemCongKhai(String(req.params.token)) });
  } catch (e) { next(e); }
});

router.get('/:token/anh', async (req, res, next) => {
  try {
    const anh = await anhCongKhai(String(req.params.token));
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'private, max-age=60');
    res.send(anh);
  } catch (e) { next(e); }
});

export default router;
