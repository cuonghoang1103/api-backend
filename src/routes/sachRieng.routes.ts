/**
 * 📷 Sách gốc (riêng tư) — mounted at /api/v1/sach-rieng
 * ─────────────────────────────────────────────────────────────────────────
 * Mọi route cần đăng nhập. `/quyen` trả 200 cho mọi người (web dùng nó để
 * quyết định có HIỆN mục "📷 Sách gốc" không); mọi route dữ liệu còn lại trả
 * 403 cho tài khoản không được phép. Xem services/sachRieng/sachRieng.service.ts.
 */
import { once } from 'node:events';
import { Router, type NextFunction, type Request, type Response } from 'express';
import { body } from 'express-validator';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '../types/index.js';
import {
  CAC_Y_TRANG, amThanhNghe, anhTaiLieu, anhTrang, bangChepNghe, danhMucTaiLieu, chanNeuKhongCoQuyen, coQuyen, daBat, hoiTrang, huongDanTrang, kiemTrang, mucLuc,
  dsDuocCap,
  timNguoi,
  capQuyen,
  thuQuyen,
  taiKhoanConDung,
} from '../services/sachRieng/sachRieng.service.js';
import {
  anhTrangIelts, choTrinhDuyet, danhMucIelts, dauMedia, docMedia, kiemVe, mimeCua, mucCuaBai, mucIelts, taoVe,
} from '../services/sachRieng/ielts.js';
import { phanTichRange } from '../services/sachRieng/maHoaKhuc.js';
import { NotFoundError, UnauthorizedError } from '../middleware/errorHandler.js';

const router = Router();

/*
 * 🔒 Tài liệu riêng IELTS — phát video/audio (12/11/2026). Đặt TRƯỚC `router.use(authenticate)`: thẻ <video>/<audio>
 * không gửi header Authorization, và app desktop (`app://`) không có cookie ⇒ nhận VÉ ngắn hạn `?ve=` (HMAC, gắn
 * userId + id tệp, 30 phút — cấp ở GET /ielts/ve/:id, có đăng nhập). Không có vé ⇒ xác thực như mọi route (cookie
 * `backend_token` / Bearer). Cả hai đường đều qua `chanNeuKhongCoQuyen` như Sách gốc.
 */
router.get('/ielts/media/:id', (req: Request, res: Response, next: NextFunction) => {
  if (req.query.ve === undefined) { void authenticate(req, res, next); return; }
  (async () => {
    const uid = kiemVe(req.query.ve, String(req.params.id));
    if (!uid) throw new UnauthorizedError('Vé xem đã hết hạn — tải lại trang.');
    if (!(await taiKhoanConDung(uid))) throw new UnauthorizedError('Tài khoản không còn dùng được.');
    req.userId = uid;
  })().then(() => next(), next);
}, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await chanNeuKhongCoQuyen(req.userId);
    await phatMediaIelts(req, res);
  } catch (e) {
    if (res.headersSent) { res.destroy(e as Error); return; }
    next(e);
  }
});

/** Phát media SR2: Range ⇒ 206 (tối đa KHUC_MOI_PHAN_HOI khúc, trình duyệt tự xin tiếp); không Range ⇒ 200 dạng luồng. */
async function phatMediaIelts(req: Request, res: Response) {
  const id = String(req.params.id);
  const m = await mucIelts(id);
  if (!m || m.loai === 'pdf') throw new NotFoundError('Không có tệp này');
  let dau = await dauMedia(id);
  if (!dau) throw new NotFoundError('Tệp chưa được tải lên');
  res.setHeader('Content-Type', mimeCua(m));
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, noimageindex');
  res.setHeader('Content-Disposition', 'inline');
  const r = phanTichRange(req.headers.range, dau.kichThuoc);
  if (r === 'ngoai') {
    res.status(416).setHeader('Content-Range', `bytes */${dau.kichThuoc}`);
    res.end();
    return;
  }
  if (req.method === 'HEAD') { res.setHeader('Content-Length', String(dau.kichThuoc)); res.end(); return; }
  if (r) {
    const kq = await docMedia(id, dau, r.a, r.b);
    res.status(206);
    res.setHeader('Content-Range', `bytes ${kq.a}-${kq.b}/${kq.dau.kichThuoc}`);
    res.setHeader('Content-Length', String(kq.du.length));
    res.end(kq.du);
    return;
  }
  // Không Range (tải thẳng / trình phát lạ): đẩy cả tệp theo từng mẻ 8 khúc, chờ `drain` — bộ nhớ ~8 MiB/yêu cầu.
  res.status(200);
  res.setHeader('Content-Length', String(dau.kichThuoc));
  let dong = false;
  res.on('close', () => { dong = true; });
  for (let a = 0; a < dau.kichThuoc && !dong;) {
    const kq = await docMedia(id, dau, a, dau.kichThuoc - 1);
    dau = kq.dau;
    if (!res.write(kq.du) && !dong) await Promise.race([once(res, 'drain'), once(res, 'close')]);
    a = kq.b + 1;
  }
  res.end();
}

router.use(authenticate);

const ok = (res: Response<ApiResponse>, data: unknown) => res.json({ success: true, data });

router.get('/quyen', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const co = (await coQuyen(req.userId)) && daBat();
    const sach = co ? ['dekiru'] : [];
    // 'ielts' chỉ khi danh mục tài liệu riêng IELTS đã có mục — web dựa vào đây để quyết định có gọi thêm API không.
    if (co) {
      try { if ((await danhMucIelts()).muc.length) sach.push('ielts'); } catch { /* R2 trục trặc ⇒ coi như chưa có */ }
    }
    ok(res, { coQuyen: co, sach });
  } catch (e) { next(e); }
});

/*
 * 👥 Admin cấp / thu quyền xem sách riêng cho từng tài khoản (09/11/2026) — "cho vài bạn thân học chung, không
 * phải cho mượn tài khoản admin". Người được cấp CHỈ xem được /dekiru/* bên dưới, không có quyền admin nào khác.
 */
router.get('/admin/quyen', requireAdmin('ROLE_ADMIN'), async (_req, res: Response<ApiResponse>, next) => {
  try { ok(res, await dsDuocCap()); } catch (e) { next(e); }
});
router.get('/admin/tim-nguoi', requireAdmin('ROLE_ADMIN'), async (req: Request, res: Response<ApiResponse>, next) => {
  try { ok(res, await timNguoi(String(req.query.q ?? '').slice(0, 100))); } catch (e) { next(e); }
});
router.post(
  '/admin/quyen',
  requireAdmin('ROLE_ADMIN'),
  [body('userId').isInt({ min: 1 }), body('ghiChu').optional().isString().isLength({ max: 200 })],
  validate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try { ok(res, await capQuyen(Number(req.body.userId), req.userId!, req.body.ghiChu)); } catch (e) { next(e); }
  },
);
router.delete('/admin/quyen/:userId', requireAdmin('ROLE_ADMIN'), async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.userId);
    if (!Number.isInteger(id) || id < 1) { res.status(400).json({ success: false, message: 'userId không hợp lệ' } as ApiResponse); return; }
    await thuQuyen(id);
    ok(res, { userId: id });
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

/* ── 🔒 Tài liệu riêng IELTS (trừ phát media — ở đầu tệp) ─────────────── */
router.use('/ielts', async (req: Request, _res, next) => {
  try { await chanNeuKhongCoQuyen(req.userId); next(); } catch (e) { next(e); }
});

router.get('/ielts/danh-muc', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Robots-Tag', 'noindex');
    const dm = await danhMucIelts();
    ok(res, { capNhat: dm.capNhat ?? null, muc: dm.muc.map(choTrinhDuyet) });
  } catch (e) { next(e); }
});

/** Các mục gắn với một bài (vd `d4-doc`, `t2d12-doc`) — khung "🔒 Tài liệu riêng" đầu bài gọi cái này. */
router.get('/ielts/bai/:lessonId', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Robots-Tag', 'noindex');
    ok(res, (await mucCuaBai(String(req.params.lessonId))).map(choTrinhDuyet));
  } catch (e) { next(e); }
});

/** Vé 30 phút để thẻ <video>/<audio> phát `/ielts/media/:id?ve=…` (app desktop không có cookie). */
router.get('/ielts/ve/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = String(req.params.id);
    const m = await mucIelts(id);
    if (!m || m.loai === 'pdf') throw new NotFoundError('Không có tệp này');
    const v = taoVe(req.userId!, id);
    if (!v) throw new NotFoundError('Tài liệu riêng chưa bật trên máy chủ');
    res.setHeader('Cache-Control', 'private, no-store');
    ok(res, { ...v, duong: `/sach-rieng/ielts/media/${encodeURIComponent(id)}?ve=${encodeURIComponent(v.ve)}` });
  } catch (e) { next(e); }
});

/** Ảnh một trang PDF (WebP). */
router.get('/ielts/trang/:id/:p', async (req: Request, res: Response, next) => {
  try {
    const anh = await anhTrangIelts(String(req.params.id), Number(req.params.p));
    if (!anh) throw new NotFoundError('Không có trang này');
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'private, max-age=86400');
    res.setHeader('X-Robots-Tag', 'noindex, noimageindex');
    res.send(anh);
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
