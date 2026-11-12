/**
 * CT Language — tuyến riêng của app iOS (mounted at /api/v1/ctlanguage). docs/ct-language-app.md.
 *
 * Tiến độ IELTS dùng lại `/api/v1/ielts/*`; ở đây chỉ thứ app này cần mà web chưa có.
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '../config/redis.js';
import { authenticate } from '../middleware/auth.js';
import { BadRequestError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { isProEffective } from '../services/pro.service.js';
import type { ApiResponse } from '../types/index.js';
import { docHoSo, luuHoSo } from '../services/ctlanguage/hoSo.js';
import { chiTiet, chuCuaNgay, chuHan, goiOffline, tra, vietTay } from '../services/ctlanguage/tuDien.js';

const router = Router();

// ─── TỪ ĐIỂN — CÔNG KHAI (khách dùng app không cần tài khoản: bài học + từ điển free, user chốt 12/11) ───────────

/** IP thật = mục CUỐI của X-Forwarded-For do proxy của ta ghi (cùng luật crm.routes.ts). */
function ipThat(req: Request): string {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)?.split(',').map((s) => s.trim()).filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || 'unknown';
}

/** 120 lượt tra/phút/IP (gõ tới đâu tra tới đó). Redis chết ⇒ cho qua (fail-open), không làm sập từ điển. */
const gioiHanTra: RequestHandler = (() => {
  const l = rateLimit({
    windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: 'rl:ctl-tudien:' }),
    keyGenerator: (req) => `ip:${ipThat(req)}`,
    message: { success: false, message: 'Tra hơi nhanh — đợi vài giây rồi thử lại.', code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-tudien] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
})();

const idSo = (v: string) => { const n = Number(v); if (!Number.isInteger(n) || n <= 0) throw new BadRequestError('id không hợp lệ'); return n; };

/** Tra: `?q=` (chữ / pinyin / romaji / kana / Hán Việt / nghĩa Việt), tối đa 50 kết quả gọn. */
router.get('/tu-dien/:nn/tra', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json({ success: true, data: await tra(req.params.nn, String(req.query.q ?? ''), Number(req.query.gioiHan ?? 30)) });
  } catch (e) { next(e); }
});

/** Một mục đầy đủ + thẻ từng chữ Hán trong nó + các mục cùng chữ viết. */
router.get('/tu-dien/muc/:id', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json({ success: true, data: await chiTiet(idSo(req.params.id)) });
  } catch (e) { next(e); }
});

/** Thẻ một chữ Hán (Hán Việt, pinyin, on/kun, bộ, nét) + từ chứa chữ đó trong ngôn ngữ `nn`. */
router.get('/tu-dien/:nn/chu/:chu', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json({ success: true, data: await chuHan(req.params.chu, req.params.nn) });
  } catch (e) { next(e); }
});

/** Viết tay ⇒ 12 chữ giống nét nhất (Hán / kanji / kana). Thân: `{ net: [[[x,y],…],…] }` theo thứ tự nét. */
router.post('/tu-dien/:nn/viet-tay', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await vietTay(req.params.nn, req.body) }); } catch (e) { next(e); }
});

/** "Một chữ · ba ngôn ngữ" của ngày `?ngay=YYYY-MM-DD` (theo giờ máy người dùng). */
router.get('/tu-dien/chu-ngay', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json({ success: true, data: await chuCuaNgay(String(req.query.ngay ?? '')) });
  } catch (e) { next(e); }
});

// ─── Từ đây trở xuống: cần đăng nhập ───────────────────────────────────────────────────────────────────────────
router.use(authenticate);

/**
 * Gói từ điển offline (quyền Pro — docs mục 4: "offline" là của Pro). Vài MB JSON (nén gzip ở middleware) ⇒ app tải
 * một lần, so `phienBan` để biết khi nào tải lại. Không Pro ⇒ 403 `CTL_CAN_PRO`.
 */
router.get('/tu-dien/:nn/goi-offline', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    if (!(await isProEffective(req.userId))) {
      res.status(403).json({ success: false, message: 'Từ điển offline là tính năng Pro.', code: 'CTL_CAN_PRO' } as ApiResponse);
      return;
    }
    res.setHeader('Cache-Control', 'private, max-age=600');
    res.json({ success: true, data: await goiOffline(req.params.nn) });
  } catch (e) { next(e); }
});

/** Hồ sơ học (ngôn ngữ đang học + lựa chọn làm quen + giờ nhắc). `data: null` khi chưa từng lưu. */
router.get('/me', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await docHoSo(req.userId!) }); } catch (e) { next(e); }
});

/** Ghi đè hồ sơ học. Thân sai hình dạng ⇒ 400 `CTL_HO_SO_SAI`. */
router.put('/me', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luuHoSo(req.userId!, req.body) }); } catch (e) { next(e); }
});

export default router;
