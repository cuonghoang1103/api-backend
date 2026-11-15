/**
 * CT Language — 🐻 Gấu trợ lý theo màn (15/11/2026). Mounted at /api/v1/ctlanguage/hoi-gau (index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` như các router con khác — router chung có `router.use(authenticate)` + `/:nn`).
 *   GET  /luot           — lượt hỏi còn lại hôm nay {laPro, tran, conLai}
 *   POST /ai/hoi         — {nn, banDongHanh?, nguCanh:{loai, tieuDe, noiDung}, lichSu?:[{vai, noiDung}], cau} ⇒ {id, traLoi, luot}
 *                          (đường có `/ai/` ⇒ app xin đồng ý chia sẻ AI trước — 5.1.2(i))
 *   POST /ai/hoi/luong   — (đợt 3) như /ai/hoi nhưng STREAM (SSE), luôn định dạng giàu. Lỗi TRƯỚC khi mở luồng (đầu vào,
 *                          hết lượt, lọc) ⇒ JSON thường như /ai/hoi. Sự kiện: `delta {text}` (nối vào nháp) · `reset {}` (xoá
 *                          nháp — cổng thử lại) · `done {id, traLoi, goiY, kieu, luot}` (thay nháp bằng bản chuẩn) · `error
 *                          {code, message, status}`. `: ping` mỗi 15 s giữ kết nối (Cloudflare cắt sau 125 s im lặng);
 *                          nginx `/api/v1/` đã `proxy_buffering off`. Client ngắt giữa chừng ⇒ ngừng ghi (lượt vẫn tính).
 *   Đợt 4: cả hai tuyến hỏi nhận `anh: [base64…]` (≤ 3 ảnh, ≤ 2 MB/ảnh; chỉ khi định dạng giàu) — kiểm định dạng thật
 *          + chuẩn hoá bằng sharp, chỉ ở RAM của lượt rồi bỏ; câu có ảnh đi việc `chat_vision` (gpt-6-sol). Thân JSON chung 10 MB.
 *   POST /bao-cao-ai     — {id, lyDo, chiTiet?, trich?} báo cáo câu trả lời AI (App Store 4.7) ⇒ hộp thư admin
 * Service: src/services/ctlanguage/hoiGau.ts.
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '../config/redis.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import { baoCaoHoiGau, hoiGau, luotHoiGau } from '../services/ctlanguage/hoiGau.js';

const router = Router();
router.use(authenticate);

/** Chống bấm dồn theo phút (trần ngày nằm ở service). Redis chết ⇒ cho qua (fail-open). */
function gioiHan(tien: string, max: number, cau: string): RequestHandler {
  const l = rateLimit({
    windowMs: 60_000, max, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: tien }),
    keyGenerator: (req) => `u:${req.userId}`,
    message: { success: false, message: cau, code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-hoi-gau] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
}
const gioiHanHoi = gioiHan('rl:ctl-hoi-gau:', 10, 'Bạn hỏi hơi nhanh — đợi một lát rồi hỏi tiếp nhé.');
const gioiHanBaoCao = gioiHan('rl:ctl-hoi-gau-bc:', 10, 'Bạn báo cáo hơi nhanh — đợi một chút nhé.');

router.get('/luot', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luotHoiGau(req.userId!) }); } catch (e) { next(e); }
});

router.post('/ai/hoi', gioiHanHoi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await hoiGau(req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});

router.post('/ai/hoi/luong', gioiHanHoi, async (req: Request, res: Response, next) => {
  let mo = false;
  let ping: ReturnType<typeof setInterval> | undefined;
  const send = (type: string, data: object = {}) => {
    if (!mo || res.writableEnded || res.destroyed) return;
    res.write(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`);
  };
  const moLuong = () => {
    if (mo) return;
    mo = true;
    res.status(200).set({
      'Content-Type': 'text/event-stream; charset=utf-8',
      // no-transform ⇒ middleware nén bỏ qua (không thì gzip gom cả luồng tới cuối).
      'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no',
    });
    res.flushHeaders?.();
    res.write('retry: 5000\n\n');
    ping = setInterval(() => { if (!res.writableEnded && !res.destroyed) res.write(': ping\n\n'); }, 15_000);
  };
  try {
    const kq = await hoiGau(req.userId!, { ...(req.body ?? {}), dinhDang: 2 }, undefined, {
      batDau: moLuong, delta: (text) => send('delta', { text }), reset: () => send('reset'),
    });
    moLuong();
    send('done', kq);
  } catch (e) {
    if (!mo) return next(e);
    const loi = e instanceof AppError ? e : null;
    if (!loi) logger.warn('[ctl-hoi-gau] luồng lỗi lạ', { error: (e as Error)?.message });
    send('error', { code: loi?.code ?? 'INTERNAL_ERROR', message: loi?.message ?? 'Mình chưa trả lời được. Bạn thử lại sau ít phút nhé.', status: loi?.statusCode ?? 500 });
  } finally {
    if (ping) clearInterval(ping);
    if (mo && !res.writableEnded) res.end();
  }
});

router.post('/bao-cao-ai', gioiHanBaoCao, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await baoCaoHoiGau(req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});

export default router;
