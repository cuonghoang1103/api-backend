/**
 * Góp ý & bổ sung cho MỌI khoá học (14/11/2026) — xem src/services/courseSuggestion.service.ts + docs/gop-y-khoa-hoc.md.
 *
 * Mount trong course.routes.ts (`router.use('/:slug/suggestions', …)`) và admin.routes.ts — KHÔNG đụng src/index.ts:
 *
 *   GET   /api/v1/courses/:slug/suggestions             công khai (ẩn AN; admin thấy hết), lọc trangThai/loai/lessonId, phân trang
 *   GET   /api/v1/courses/:slug/suggestions/dem         số góp ý theo trạng thái (nút ở hero + bộ lọc)
 *   GET   /api/v1/courses/:slug/suggestions/:id         một góp ý (link sâu ?id= từ thông báo admin)
 *   POST  /api/v1/courses/:slug/suggestions             cần đăng nhập — trần 5 góp ý/giờ/người, chặn nội dung trùng
 *   POST  /api/v1/courses/:slug/suggestions/:id/vote    cần đăng nhập — bật/tắt "Tôi cũng thấy cần"
 *
 *   GET   /api/v1/admin/course-suggestions?trangThai=MOI   mọi khoá
 *   PATCH /api/v1/admin/course-suggestions/:id             trangThai, ketQuaDoiChieu, bangChung, nguoiDoiChieu
 */
import { Router, type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import {
  bau, chuanHoa, danhSach, demTheoTrangThai, ghiDoiChieu, laAdmin, layMot, parse, schemaDoiChieu, schemaLoc,
  schemaTao, tachTrangThai, tao, timKhoa,
} from '../services/courseSuggestion.service.js';

/** mergeParams ⇒ đọc được `:slug` của router cha. */
export const courseSuggestionRouter = Router({ mergeParams: true });
export const adminCourseSuggestionRouter = Router();

// Lưới thô theo IP (chống bot trước khi chạm CSDL); trần 5/giờ/NGƯỜI đếm trong service.
const tranGuiIp = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Gửi hơi nhiều từ cùng một mạng — thử lại sau ít phút.', code: 'GOP_Y_KHOA_RATE_LIMIT' },
});
const tranBau = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Bấm hơi nhanh — đợi một chút nhé.', code: 'GOP_Y_KHOA_RATE_LIMIT' },
});

function soId(v: unknown): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) throw new AppError('id không hợp lệ', 400, 'VALIDATION');
  return n;
}

courseSuggestionRouter.get('/', optionalAuth, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const admin = await laAdmin(req.userId);
    const khoa = await timKhoa(String(req.params.slug), !admin);
    const q = parse(schemaLoc, req.query);
    const data = await danhSach({
      courseId: khoa.id,
      trangThai: tachTrangThai(q.trangThai),
      loai: q.loai,
      lessonId: q.lessonId,
      page: q.page,
      limit: q.limit,
      sapXep: q.sapXep,
      thayAn: admin,
      viewerId: req.userId ?? null,
    });
    res.json({ success: true, data: { ...data, laAdmin: admin } });
  } catch (e) {
    next(e);
  }
});

courseSuggestionRouter.get('/dem', optionalAuth, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const admin = await laAdmin(req.userId);
    const khoa = await timKhoa(String(req.params.slug), !admin);
    res.json({ success: true, data: await demTheoTrangThai(khoa.id, admin) });
  } catch (e) {
    next(e);
  }
});

courseSuggestionRouter.get('/:id', optionalAuth, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const admin = await laAdmin(req.userId);
    const khoa = await timKhoa(String(req.params.slug), !admin);
    const r = await layMot(soId(req.params.id));
    if (r.courseId !== khoa.id || (r.trangThai === 'AN' && !admin)) {
      throw new AppError('Không tìm thấy góp ý', 404, 'SUGGESTION_NOT_FOUND');
    }
    res.json({ success: true, data: chuanHoa(r) });
  } catch (e) {
    next(e);
  }
});

courseSuggestionRouter.post('/', tranGuiIp, authenticate, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const khoa = await timKhoa(String(req.params.slug), true);
    const duLieu = parse(schemaTao, req.body ?? {});
    const row = await tao(khoa, duLieu, { userId: req.userId! });
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});

courseSuggestionRouter.post('/:id/vote', tranBau, authenticate, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const khoa = await timKhoa(String(req.params.slug), true);
    const id = soId(req.params.id);
    const r = await layMot(id);
    if (r.courseId !== khoa.id) throw new AppError('Không tìm thấy góp ý', 404, 'SUGGESTION_NOT_FOUND');
    res.json({ success: true, data: await bau(id, req.userId!) });
  } catch (e) {
    next(e);
  }
});

// ─────────────────────────── admin ───────────────────────────

adminCourseSuggestionRouter.use(requireAdmin());

adminCourseSuggestionRouter.get('/', async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const q = parse(schemaLoc, req.query);
    const slug = typeof req.query.courseSlug === 'string' ? req.query.courseSlug : '';
    const khoa = slug ? await timKhoa(slug, false) : null;
    const data = await danhSach({
      courseId: khoa?.id,
      trangThai: tachTrangThai(q.trangThai),
      loai: q.loai,
      lessonId: q.lessonId,
      page: q.page,
      limit: q.limit,
      sapXep: q.sapXep,
      thayAn: true,
      viewerId: req.userId ?? null,
    });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

adminCourseSuggestionRouter.patch('/:id', async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const d = parse(schemaDoiChieu, req.body ?? {});
    const nguoi = req.user?.username ? `admin:${req.user.username}` : 'admin';
    res.json({ success: true, data: await ghiDoiChieu(soId(req.params.id), d, nguoi) });
  } catch (e) {
    next(e);
  }
});
