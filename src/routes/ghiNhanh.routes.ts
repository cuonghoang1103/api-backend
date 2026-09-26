/**
 * Ghi nhanh · Sổ lệnh · Sổ tay khoá · Nhập Markdown
 * ────────────────────────────────────────────────────────────
 * Gắn dưới /api/v1/notes/ghi-nhanh (xem cuối `notes.routes.ts`). Router cha đã
 * `router.use(authenticate)`; ở đây gắn lại lần nữa cho chắc — router này có
 * thể bị gắn ở chỗ khác sau này. Mọi handler chỉ dùng `req.userId`
 * (`req.user.id` KHÔNG tồn tại ở repo này).
 */
import { Router, type Request, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import {
  ensureInboxSubject, listTemplates, ghiNhanh, taoTuMau, damBaoSoLenh, themLenh,
  taoTheTuSoLenh, luuDoanBaiHoc, doanCuaBai, nhapMarkdown,
} from '../services/ghiNhanh.service.js';

const router = Router();
router.use(authenticate);

/** Hộp thư của tôi (tạo nếu chưa có). */
router.get('/hop-thu', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const s = await ensureInboxSubject(req.userId!);
    res.json({ success: true, data: { id: s.id, name: s.name, clientId: s.clientId } });
  } catch (err) { next(err); }
});

/** Mẫu trang: Ghi chú bài học · Sổ lệnh · Nhật ký lỗi (kèm HTML để chèn). */
router.get('/mau', (_req: Request, res: Response<ApiResponse>) => {
  res.json({ success: true, data: listTemplates() });
});

/** Ghi nhanh vào Hộp thư. Body: { title?, text (markdown), template? } */
router.post('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.status(201).json({ success: true, data: await ghiNhanh(req.userId!, req.body ?? {}) });
  } catch (err) { next(err); }
});

/** Trang mới từ mẫu. Body: { template, subjectId?, chapterId?, title? } — không có subjectId thì vào Hộp thư. */
router.post('/tu-mau', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.status(201).json({ success: true, data: await taoTuMau(req.userId!, req.body ?? {}) });
  } catch (err) { next(err); }
});

/** Sổ lệnh mặc định (trong Hộp thư) — tạo nếu chưa có. */
router.get('/so-lenh', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const n = await damBaoSoLenh(req.userId!);
    res.json({ success: true, data: { noteId: n.id, title: n.title, subjectId: n.subjectId } });
  } catch (err) { next(err); }
});

/** Thêm một dòng. Body: { lenh, nghia, viDu?, nhom?, loi?, noteId? } */
router.post('/so-lenh/dong', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.status(201).json({ success: true, data: await themLenh(req.userId!, req.body ?? {}) });
  } catch (err) { next(err); }
});

/** Sinh/đồng bộ thẻ ôn (NoteVocabEntry) từ bảng Sổ lệnh của trang :noteId. */
router.post('/so-lenh/:noteId/the', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await taoTheTuSoLenh(req.userId!, req.params.noteId) });
  } catch (err) { next(err); }
});

/** Lưu đoạn bôi đen từ bài học. Body: { courseSlug, lessonId, text, laCode? } */
router.post('/khoa/luu', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.status(201).json({ success: true, data: await luuDoanBaiHoc(req.userId!, req.body ?? {}) });
  } catch (err) { next(err); }
});

/** Đoạn đã lưu của một bài. */
router.get('/khoa/:slug/bai/:lessonId', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await doanCuaBai(req.userId!, req.params.slug, req.params.lessonId) });
  } catch (err) { next(err); }
});

/** Nhập file Markdown (gửi dạng chữ trong JSON). Body: { filename, markdown } — tối đa 512 KB. */
router.post('/nhap-md', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.status(201).json({ success: true, data: await nhapMarkdown(req.userId!, req.body ?? {}) });
  } catch (err) { next(err); }
});

export default router;
