/**
 * Đối kháng — REST phụ cho sảnh (05/10/2026). Ván đánh realtime đi qua socket `dk:*`
 * (`src/socket/doiKhang.socket.ts`); đây chỉ là bảng xếp hạng, lịch sử và bạn đang online.
 */
import { Router, type Request, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import { banOnline, cuaToi, xepHang } from '../services/doiKhang/doiKhang.service.js';
import type { MaTro } from '../services/doiKhang/luat/kieu.js';
import { getOnlineUserIds } from '../socket/messaging.socket.js';
import { thongKeDoiKhang } from '../socket/doiKhang.socket.js';

const router = Router();
router.use(authenticate);
const uid = (req: Request): number => req.userId!;
const ok = (res: Response<ApiResponse>, data: unknown) => res.json({ success: true, data });
const TRO: MaTro[] = ['co-vua', 'co-tuong', 'tien-len', 'caro'];

router.get('/xep-hang', async (req, res: Response<ApiResponse>, next) => {
  try {
    const tro = TRO.includes(req.query.tro as MaTro) ? (req.query.tro as MaTro) : 'co-vua';
    ok(res, await xepHang(tro));
  } catch (e) { next(e); }
});
router.get('/cua-toi', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await cuaToi(uid(req))); } catch (e) { next(e); }
});
router.get('/ban-online', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await banOnline(uid(req), new Set(getOnlineUserIds()))); } catch (e) { next(e); }
});
router.get('/thong-ke', (_req, res: Response<ApiResponse>) => ok(res, thongKeDoiKhang()));

export default router;
