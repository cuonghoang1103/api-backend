/**
 * /api/v1/hoc-lieu — HỌC LIỆU + TIẾN ĐỘ HỌC cho CuongMini và trang CT Work → Học tập & Lịch (24/11/2026). CHỈ ĐỌC.
 * Xác thực như /hoc-tap: JWT hoặc token cá nhân `Bearer ctw_…`. Mọi action chạy dưới quyền người gọi (xem services/hocLieu/chay.ts).
 *
 *   GET /api/v1/hoc-lieu?action=outline&book=dekiru&bai=1
 *   GET /api/v1/hoc-lieu?action=lesson&course=linux-bash&lesson=lnx-1-1-...
 *   GET /api/v1/hoc-lieu/tien-do            (JSON đủ số liệu cho thẻ "Tiến độ & đánh giá")
 */
import { Router, type Request, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { apiTokenAuth } from '../services/work/apiTokens.service.js';
import { chayHocLieu } from '../services/hocLieu/chay.js';
import { tinhTienDo } from '../services/hocLieu/tienDo.service.js';

const router = Router();
router.use(apiTokenAuth);
router.use((req, res, next) => (req.workToken ? next() : authenticate(req, res, next)));

const h = (fn: (req: Request) => Promise<unknown>) => (req: Request, res: Response, next: (e?: unknown) => void) => {
  res.set('Cache-Control', 'private, no-store');
  fn(req).then((data) => res.json({ success: true, data })).catch(next);
};

const soHoa = (q: Record<string, unknown>) => {
  const a: Record<string, unknown> = { ...q };
  for (const k of ['bai', 'offset', 'maxChars', 'attempt']) if (a[k] !== undefined) a[k] = Number(a[k]);
  if (a.answers !== undefined) a.answers = a.answers !== 'false';
  if (a.english !== undefined) a.english = a.english === 'true';
  return a;
};

router.get('/tien-do', h((req) => tinhTienDo(req.userId!)));
router.get('/', h((req) => chayHocLieu(req.userId!, soHoa(req.query as Record<string, unknown>))));

export default router;
