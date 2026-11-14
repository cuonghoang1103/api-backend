/**
 * CT Language — ĐỌC TO cho cả KHÁCH (15/11/2026). Mounted at /api/v1/ctlanguage/doc (index.ts gắn TRƯỚC
 * `/api/v1/ctlanguage` — router kia `router.use(authenticate)` sẽ chặn khách).
 *
 * Vì sao: app cho học không cần tài khoản (user chốt 12/11), nhưng `POST /ielts/doc` bắt đăng nhập ⇒ khách nghe toàn
 * giọng iPhone bản "Compact" (giọng mặc định của máy, nghe rõ là máy, đọc sai kanji/đa âm) — user báo 15/11 "giọng đọc
 * tiếng Trung, Nhật, Anh mặc định rất khó nghe và nghe sai". Tuyến này dùng ĐÚNG dịch vụ `docTo` (Azure Neural → Google
 * Dịch, cache R2 theo băm chữ: câu đã có thì không tốn gì), chỉ khác danh tính để tính trần sinh mới:
 *   đăng nhập ⇒ userId (trần 400 câu MỚI/ngày như web) · khách ⇒ `ip:<ip>` (cùng trần, chung cho mọi khách sau 1 IP).
 * Chặn cào: 240 lượt/phút/IP (màn mở là app tải sẵn vài chục câu, đã lưu trên máy thì không gọi lại).
 */
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '../types/index.js';
import { docTo } from '../services/ielts/docTo.service.js';

const router = Router();

/** IP thật = mục CUỐI của X-Forwarded-For do proxy của ta ghi (cùng luật ctlanguage.routes.ts). */
function ipThat(req: Request): string {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)?.split(',').map((s) => s.trim()).filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || 'unknown';
}

router.post('/',
  rateLimit({ windowMs: 60_000, max: 240, standardHeaders: true, legacyHeaders: false, keyGenerator: (req) => `ctl-doc:${ipThat(req)}`,
    message: { success: false, message: 'Bấm nghe hơi nhanh, chờ một chút nhé.', code: 'RATE_LIMIT_EXCEEDED' } }),
  optionalAuth,
  body('text').isString().isLength({ min: 1, max: 600 }),
  validate,
  async (req: Request, res: Response<ApiResponse>, next) => {
    try {
      res.json({ success: true, data: await docTo(req.userId ?? `ip:${ipThat(req)}`, req.body) });
    } catch (e) { next(e); }
  });

export default router;
