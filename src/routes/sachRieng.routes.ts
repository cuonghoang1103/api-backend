/**
 * 📷 Sách gốc (riêng tư) — mounted at /api/v1/sach-rieng
 * ─────────────────────────────────────────────────────────────────────────
 * Mọi route cần đăng nhập. `/quyen` trả 200 cho mọi người (web dùng nó để
 * quyết định có HIỆN mục "📷 Sách gốc" không); mọi route dữ liệu còn lại trả
 * 403 cho tài khoản không được phép. Xem services/sachRieng/sachRieng.service.ts.
 */
import { Router, type Request, type Response } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '../types/index.js';
import {
  CAC_Y_TRANG, amThanhNghe, anhTaiLieu, anhTrang, bangChepNghe, danhMucTaiLieu, chanNeuKhongCoQuyen, coQuyen, daBat, hoiTrang, huongDanTrang, kiemTrang, mucLuc,
} from '../services/sachRieng/sachRieng.service.js';

const router = Router();
router.use(authenticate);

const ok = (res: Response<ApiResponse>, data: unknown) => res.json({ success: true, data });

router.get('/quyen', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const co = (await coQuyen(req.userId)) && daBat();
    ok(res, { coQuyen: co, sach: co ? ['dekiru'] : [] });
  } catch (e) { next(e); }
});

/** Từ đây trở xuống: chỉ tài khoản được phép. */
router.use('/dekiru', async (req: Request, _res, next) => {
  try { await chanNeuKhongCoQuyen(req.userId); next(); } catch (e) { next(e); }
});

router.get('/dekiru/muc-luc', async (_req, res: Response<ApiResponse>, next) => {
  try { ok(res, await mucLuc()); } catch (e) { next(e); }
});

/** Ảnh trang (WebP). `?nho=1` = ảnh thu nhỏ cho dải trang. */
router.get('/dekiru/trang/:p', async (req: Request, res: Response, next) => {
  try {
    const p = kiemTrang(req.params.p);
    const anh = await anhTrang(p, req.query.nho === '1');
    res.setHeader('Content-Type', 'image/webp');
    // `private`: trình duyệt của CHÍNH người xem được giữ, CDN/proxy dùng chung thì không.
    res.setHeader('Cache-Control', 'private, max-age=86400');
    res.setHeader('X-Robots-Tag', 'noindex, noimageindex');
    res.setHeader('Content-Disposition', `inline; filename="dekiru-p${p}.webp"`);
    res.send(anh);
  } catch (e) { next(e); }
});

router.get('/dekiru/huong-dan/:p', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'private, no-store');
    ok(res, await huongDanTrang(kiemTrang(req.params.p)));
  } catch (e) { next(e); }
});

/** Bản chép riêng các track nghe CD (chữ, không có âm thanh). */
router.get('/dekiru/nghe', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Robots-Tag', 'noindex');
    ok(res, await bangChepNghe());
  } catch (e) { next(e); }
});

/** Danh mục tài liệu gốc JPD123 (slide cô, bài tập, đề ôn, Irodori, từ mới) + track nghe có âm thanh. */
router.get('/dekiru/tai-lieu', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'private, no-store');
    ok(res, await danhMucTaiLieu());
  } catch (e) { next(e); }
});

router.get('/dekiru/tai-lieu/:id/:p', async (req: Request, res: Response, next) => {
  try {
    const anh = await anhTaiLieu(String(req.params.id), Number(req.params.p));
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'private, max-age=86400');
    res.setHeader('X-Robots-Tag', 'noindex, noimageindex');
    res.send(anh);
  } catch (e) { next(e); }
});

/** Âm thanh track CD (m4a), có Range để tua. */
router.get('/dekiru/nghe/am/:track', async (req: Request, res: Response, next) => {
  try {
    const b = await amThanhNghe(Number(req.params.track));
    res.setHeader('Content-Type', 'audio/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'private, max-age=86400');
    res.setHeader('X-Robots-Tag', 'noindex');
    const m = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range ?? ''));
    if (m && (m[1] || m[2])) {
      const dau = m[1] ? Number(m[1]) : Math.max(0, b.length - Number(m[2]));
      const cuoi = m[1] && m[2] ? Math.min(Number(m[2]), b.length - 1) : b.length - 1;
      if (dau > cuoi || dau >= b.length) { res.status(416).setHeader('Content-Range', `bytes */${b.length}`); res.end(); return; }
      res.status(206);
      res.setHeader('Content-Range', `bytes ${dau}-${cuoi}/${b.length}`);
      res.setHeader('Content-Length', String(cuoi - dau + 1));
      res.end(b.subarray(dau, cuoi + 1));
      return;
    }
    res.setHeader('Content-Length', String(b.length));
    res.end(b);
  } catch (e) { next(e); }
});

/** Gia sư AI theo trang: model nhìn ẢNH trang + ghi chú đã soạn. */
router.post('/dekiru/hoi',
  body('trang').isInt({ min: 1, max: 304 }),
  body('y').optional().isIn(CAC_Y_TRANG),
  body('cauHoi').optional().isString().isLength({ max: 500 }),
  validate,
  async (req: Request, res: Response<ApiResponse>, next) => {
    try { ok(res, await hoiTrang(req.userId!, req.body)); } catch (e) { next(e); }
  });

export default router;
