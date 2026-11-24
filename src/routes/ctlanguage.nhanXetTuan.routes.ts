/**
 * CT Language — NHẬN XÉT HỌC TẬP HẰNG TUẦN của CuongMini (tiếng Anh, 24/11/2026). Mounted at
 * /api/v1/ctlanguage/nhan-xet-tuan (index.ts gắn TRƯỚC `/api/v1/ctlanguage` như các router riêng khác).
 * MỌI tuyến cần đăng nhập. Web (`/language/en/nhan-xet-tuan`), app desktop (cùng trang) và app iOS (sau này) dùng chung:
 *
 *   GET  /                 — danh sách tuần đã có (tóm tắt) + `tuanGoiY` (tuần đã khép gần nhất) + `coTuanGoiY` + cài đặt.
 *                            Không tham số — smoke-test deploy gọi (khách ⇒ 401). Mở trang mà `coTuanGoiY = false` ⇒ gọi POST /tao.
 *   POST /tao              — { tuan?: 'YYYY-MM-DD' (thứ Hai; bỏ trống = tuần đã khép gần nhất), lamLai?: boolean }
 *                            Chưa có ⇒ tạo. Có rồi + lamLai ⇒ tạo lại (trần 3 lần/tuần, 429 khi hết). Gọi model ~10–40 s.
 *   GET  /cai-dat          — { guiEmail }        PUT /cai-dat { guiEmail: boolean } — email tóm tắt, mặc định TẮT.
 *   GET  /:tuan            — một báo cáo đầy đủ: soLieu (kèm nguonDuLieu), diemYeu, keHoach (link thẳng tới bài), nhanXet.
 * Dịch vụ: `services/ielts/nhanXetTuan.service.ts` · luật thuần: `nhanXetTuanThuan.ts`.
 */
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import { laAdmin } from '../services/pro.service.js';
import { danhSach, datCaiDat, layCaiDat, motBaoCao, taoBaoCao } from '../services/ielts/nhanXetTuan.service.js';

const router = Router();
router.use(authenticate);

const theoNguoi = (max: number, windowMs: number, message: string) => rateLimit({
  windowMs, max, standardHeaders: true, legacyHeaders: false,
  keyGenerator: (req: Request) => `nxt:u${req.userId ?? 'x'}`,
  skip: async (req: Request) => laAdmin(req.userId).catch(() => false),
  message: { success: false, message, code: 'RATE_LIMIT_EXCEEDED' },
});
const doc = theoNguoi(60, 60_000, 'Bạn thao tác hơi nhanh, chờ một chút nhé.');
/** Mỗi lần tạo có thể gọi model — 6 lần / 10 phút / người (ngoài trần 3 lần "Tạo lại" mỗi tuần ở dịch vụ). */
const tao = theoNguoi(6, 10 * 60_000, 'Bạn vừa tạo nhiều báo cáo liền — thử lại sau ít phút.');

router.get('/', doc, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.set('Cache-Control', 'no-store').json({ success: true, data: await danhSach(req.userId!) }); } catch (e) { next(e); }
});

router.post('/tao', tao, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const b = (req.body ?? {}) as { tuan?: unknown; lamLai?: unknown };
    res.json({ success: true, data: await taoBaoCao(req.userId!, b.tuan, { lamLai: b.lamLai === true }) });
  } catch (e) { next(e); }
});

router.get('/cai-dat', doc, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await layCaiDat(req.userId!) }); } catch (e) { next(e); }
});

router.put('/cai-dat', doc, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await datCaiDat(req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});

router.get('/:tuan', doc, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.set('Cache-Control', 'no-store').json({ success: true, data: await motBaoCao(req.userId!, String(req.params.tuan)) }); } catch (e) { next(e); }
});

export default router;
