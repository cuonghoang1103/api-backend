/**
 * CT Lồng Tiếng (18/11/2026) — hai cửa, hợp đồng ở docs/long-tieng-hop-dong.md.
 *
 *   /api/v1/long-tieng           — trang web + app. JWT có vai ADMIN, HOẶC `Authorization: Bearer ctlt_…` (mã kết nối
 *                                   tạo trên trang web; chủ mã mất vai ADMIN ⇒ mã chết theo). Mã kết nối KHÔNG tạo/thu
 *                                   hồi được mã khác (chỉ JWT).
 *   /api/v1/internal/long-tieng  — trạm máy nhà. Header `x-internal-token` = INTERNAL_API_TOKEN; thiếu cấu hình hoặc
 *                                   sai khoá ⇒ 404 (y như internal.routes.ts — không lộ là tuyến có tồn tại).
 */
import crypto from 'node:crypto';
import { Router, type NextFunction, type Request, type Response } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { asyncHandler, ForbiddenError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as lt from '../services/longTieng.service.js';

const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data });
const body = (req: Request) => ((req.body ?? {}) as Record<string, unknown>);

// ─── Web / app ─────────────────────────────────────────────────────────────

const router = Router();
const chiAdminJwt = requireAdmin('ROLE_ADMIN');

/** `ctlt_…` ⇒ xác thực mã; còn lại ⇒ JWT ADMIN như mọi tuyến admin. Đánh dấu `res.locals.quaMa` để chặn việc chỉ-JWT. */
async function xacThuc(req: Request, res: Response, next: NextFunction): Promise<void> {
  const m = /^Bearer\s+(ctlt_\S+)$/i.exec(String(req.headers.authorization ?? '').trim());
  if (!m) { chiAdminJwt(req, res, next); return; }
  try {
    const r = await lt.xacThucMa(m[1]!);
    if ('loi' in r) throw r.loi === 401 ? new UnauthorizedError('Mã kết nối không hợp lệ hoặc đã bị thu hồi.') : new ForbiddenError('Chủ mã kết nối không còn quyền ADMIN.');
    req.userId = r.userId;
    req.user = { userId: r.userId, username: r.username, email: r.email, roles: ['ADMIN'], roleVersion: r.roleVersion };
    res.locals.quaMa = true;
    next();
  } catch (e) { next(e); }
}

router.use(xacThuc);
router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });

const uid = (req: Request) => req.userId!;

router.get('/toi', asyncHandler(async (req, res) => {
  ok(res, { userId: uid(req), username: req.user?.username ?? null, quaMa: !!res.locals.quaMa });
}));

router.get('/nhac', asyncHandler(async (_req, res) => { ok(res, await lt.thuVienNhac()); }));
router.post('/jobs', asyncHandler(async (req, res) => { ok(res, await lt.taoViec(uid(req), body(req)), 201); }));
router.get('/jobs', asyncHandler(async (req, res) => { ok(res, await lt.dsViec(uid(req))); }));
router.get('/jobs/:id', asyncHandler(async (req, res) => { ok(res, await lt.layViec(uid(req), String(req.params.id))); }));
router.post('/jobs/:id/da-tai-len', asyncHandler(async (req, res) => { ok(res, await lt.daTaiLen(uid(req), String(req.params.id))); }));
router.post('/jobs/:id/thu-lai', asyncHandler(async (req, res) => { ok(res, await lt.thuLai(uid(req), String(req.params.id))); }));
router.post('/jobs/:id/da-tai-ve', asyncHandler(async (req, res) => { ok(res, await lt.daTaiVe(uid(req), String(req.params.id))); }));
router.delete('/jobs/:id', asyncHandler(async (req, res) => { ok(res, await lt.xoaViec(uid(req), String(req.params.id))); }));

const chiJwt = (_req: Request, res: Response, next: NextFunction) => {
  if (res.locals.quaMa) { next(new ForbiddenError('Mã kết nối app không quản lý được mã kết nối — dùng trang web.')); return; }
  next();
};
router.get('/ma-ket-noi', chiJwt, asyncHandler(async (req, res) => { ok(res, await lt.dsMa(uid(req))); }));
router.post('/ma-ket-noi', chiJwt, asyncHandler(async (req, res) => { ok(res, await lt.taoMa(uid(req), body(req).ten), 201); }));
router.delete('/ma-ket-noi/:id', chiJwt, asyncHandler(async (req, res) => { ok(res, await lt.thuHoiMa(uid(req), Number(req.params.id) || 0)); }));

export default router;

// ─── Trạm (nội bộ) ─────────────────────────────────────────────────────────

export const noiBoRouter = Router();

function soSanhAnToan(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

noiBoRouter.use((req, res, next) => {
  const mong = process.env.INTERNAL_API_TOKEN || '';
  const nhan = String(req.headers['x-internal-token'] || '');
  if (!mong || !nhan || !soSanhAnToan(nhan, mong)) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.setHeader('Cache-Control', 'no-store');
  next();
});

noiBoRouter.post('/nhan', asyncHandler(async (_req, res) => {
  const r = await lt.nhanViec();
  if (!r) { res.status(204).end(); return; }
  ok(res, r);
}));
noiBoRouter.post('/dich', asyncHandler(async (req, res) => { ok(res, await lt.dich(body(req))); }));
noiBoRouter.post('/:id/tien-do', asyncHandler(async (req, res) => { ok(res, await lt.tienDo(String(req.params.id), body(req))); }));
noiBoRouter.post('/:id/len-ket-qua', asyncHandler(async (req, res) => { ok(res, await lt.lenKetQua(String(req.params.id), body(req))); }));
noiBoRouter.post('/:id/xong', asyncHandler(async (req, res) => { ok(res, await lt.xongViec(String(req.params.id), body(req))); }));
noiBoRouter.post('/:id/loi', asyncHandler(async (req, res) => { ok(res, await lt.baoLoi(String(req.params.id), body(req))); }));
