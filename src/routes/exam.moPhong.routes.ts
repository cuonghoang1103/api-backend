/**
 * Phòng thi mô phỏng — /api/v1/exams/mock (22/11/2026). Một phần của Exam Room (`exam.routes.ts`):
 * mount TRƯỚC router Exam Room trong index.ts, để `/exams/mock/...` không bị `/:examId/...` của Exam
 * Room nuốt. Xem lại kết quả vẫn qua `GET /exams/attempts/:id` (buildReview rẽ sang lượt mô phỏng);
 * tự lưu qua `PUT /exams/attempts/:id/progress` (dùng chung với lượt thường).
 *
 *   GET  /mon                              môn có phòng mô phỏng (công khai)
 *   GET  /:courseCode/overview             ngân hàng + phân bố chương + đề PE (+ lượt đang dở nếu đăng nhập)
 *   GET  /:courseCode/history              lịch sử + biểu đồ tiến bộ + điểm yếu theo chương/CLO
 *   POST /:courseCode/fe                   tạo đề FE trộn { soCau, phut, cheDo:'thi'|'luyen', nguon, nhom[] }
 *   POST /:courseCode/pe                   bắt đầu PE { examId | exerciseId, cheDo }
 *   GET  /attempts/:id/fe                  đề đang làm (ẩn đáp án; luyện: câu đã kiểm kèm đáp án)
 *   POST /attempts/:id/fe/check            luyện: kiểm một câu ngay
 *   POST /attempts/:id/fe/submit           nộp + chấm ngay + thống kê chương/CLO
 *   GET  /attempts/:id/pe                  đề PE + trạng thái nộp/tự chấm/máy chấm/AI
 *   POST /attempts/:id/pe/submit           nộp .zip (kiểm định dạng, node_modules, kích thước)
 *   POST /attempts/:id/pe/self-check       checklist tự chấm theo rubric
 *   POST /attempts/:id/pe/auto-grade       kết quả máy chấm Code Lab (chạy trong trình duyệt)
 *   POST /attempts/:id/pe/ai-review        AI nhận xét TĨNH mã nộp (trần lượt/ngày)
 */
import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import * as svc from '../services/exam/moPhong.service.js';

const router = Router();
const zipUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: svc.ZIP_TRAN_BYTE + 1, files: 1 } });

const taoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => `exam-mock-tao:${req.user?.userId ?? req.ip ?? 'anon'}`,
  message: { success: false, message: 'Tạo đề quá nhiều trong một giờ — làm nốt các đề đang có nhé.', code: 'EXAM_MOCK_QUA_NHIEU' },
});

const code = (req: Request) => {
  const c = String(req.params.courseCode || '');
  if (!/^[A-Za-z0-9]{3,12}$/.test(c)) throw new AppError('Mã môn không hợp lệ', 400);
  return c.toUpperCase();
};
const id = (req: Request) => {
  const n = Number(req.params.attemptId);
  if (!Number.isInteger(n) || n <= 0) throw new AppError('attemptId không hợp lệ', 400);
  return n;
};

router.get('/mon', (_req, res: Response<ApiResponse>) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ success: true, data: svc.danhSachMon() });
});

router.get('/:courseCode/overview', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.tongQuan(code(req), req.userId ?? undefined) }); } catch (e) { next(e); }
});

router.get('/:courseCode/history', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.lichSu(code(req), req.userId!) }); } catch (e) { next(e); }
});

router.post('/:courseCode/fe', authenticate, taoLimiter, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.batDauFe(req.userId!, code(req), req.body ?? {}) }); } catch (e) { next(e); }
});

router.post('/:courseCode/pe', authenticate, taoLimiter, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.batDauPe(req.userId!, code(req), req.body ?? {}) }); } catch (e) { next(e); }
});

router.get('/attempts/:attemptId/fe', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.layDeFe(id(req), req.userId!) }); } catch (e) { next(e); }
});

router.post('/attempts/:attemptId/fe/check', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.kiemCauLuyen(id(req), req.userId!, Number(req.body?.questionId), req.body?.selected) }); } catch (e) { next(e); }
});

router.post('/attempts/:attemptId/fe/submit', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.nopFe(id(req), req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});

router.get('/attempts/:attemptId/pe', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.layDePe(id(req), req.userId!) }); } catch (e) { next(e); }
});

router.post('/attempts/:attemptId/pe/submit', authenticate, (req, res, next) => {
  zipUpload.single('file')(req, res, (err: unknown) => {
    if (err) {
      const m = (err as { code?: string })?.code === 'LIMIT_FILE_SIZE'
        ? 'File quá lớn (> 20 MB) — thường là còn node_modules. Xoá node_modules rồi nén lại.'
        : 'Không nhận được file';
      return next(new AppError(m, 400));
    }
    next();
  });
}, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.nopPeZip(id(req), req.userId!, req.file, req.body?.timeSpentSeconds) }); } catch (e) { next(e); }
});

router.post('/attempts/:attemptId/pe/self-check', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.tuChamPe(id(req), req.userId!, req.body?.chon) }); } catch (e) { next(e); }
});

router.post('/attempts/:attemptId/pe/auto-grade', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.ghiChamTuDong(id(req), req.userId!, req.body?.ketQua) }); } catch (e) { next(e); }
});

router.post('/attempts/:attemptId/pe/ai-review', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await svc.aiNhanXetPe(id(req), req.userId!) }); } catch (e) { next(e); }
});

export default router;
