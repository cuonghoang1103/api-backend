/**
 * Bảng xếp hạng nhạc — xem `services/music-charts.service.ts`.
 *
 *   GET  /api/v1/music/charts             → Top 100 VN + Thịnh hành YouTube (+ videoId đã ghép)
 *   GET  /api/v1/music/charts/goi-y       → gợi ý theo lịch sử nghe + bài đã thích (không AI)
 *   POST /api/v1/music/charts/:id/video   → ghép video YouTube cho một bài (tìm 1 lần, nhớ mãi)
 */
import { Router, type Response, type NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import { goiYChoNguoiDung, layBangXepHang, videoChoBai } from '../services/music-charts.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();
router.use(authenticate);

router.get('/', async (_req: any, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.json({ success: true, data: await layBangXepHang() });
  } catch (e) { next(e); }
});

router.get('/goi-y', async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.json({ success: true, data: await goiYChoNguoiDung(req.userId) });
  } catch (e) { next(e); }
});

router.post('/:id/video', async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
  const id = String(req.params.id ?? '');
  if (!/^\d{1,20}$/.test(id)) {
    res.status(400).json({ success: false, message: 'id không hợp lệ' });
    return;
  }
  try {
    res.json({ success: true, data: await videoChoBai(id) });
  } catch (e: any) {
    if (e?.code === 'NOT_FOUND') { res.status(404).json({ success: false, message: e.message }); return; }
    if (e?.code === 'QUOTA') { res.status(429).json({ success: false, message: e.message }); return; }
    if (e?.code === 'NO_KEY') { res.status(503).json({ success: false, message: e.message }); return; }
    next(e);
  }
});

export default router;
