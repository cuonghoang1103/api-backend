/**
 * Học tiếng Anh bằng VIDEO — danh mục, danh sách video, phụ đề.
 *
 * Đặt sau `authenticate` như mọi route nội dung khác: phụ đề là kết quả của
 * một đợt thu tốn công, không phải thứ để mở cho cả internet cào về.
 */
import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '../types/index.js';
import * as svc from '../services/video/phuDe.service.js';
import * as them from '../services/video/themVideo.service.js';
import { body } from 'express-validator';

const router = Router();
router.use(authenticate);

const ok = (res: Response<ApiResponse>, data: unknown) => res.json({ success: true, data });

// ⚠️ `req.user.id` KHÔNG tồn tại trong repo này — middleware `authenticate`
// gắn `req.userId`. Dùng nhầm thì `tsc` im, còn route thì 500 lúc chạy.
const idNguoiDung = (req: Request): number => req.userId!;

router.get('/danh-muc', async (_req, res: Response<ApiResponse>, next) => {
  try { ok(res, await svc.danhMuc()); } catch (e) { next(e); }
});

/**
 * Cả thư viện trong MỘT lời gọi — nhóm chủ đề + khoá + video (có `videoId`
 * để lấy ảnh bìa từ CDN YouTube). Màn duyệt của app dùng route này; hai
 * route dưới giữ lại cho bản app cũ.
 */
router.get('/thu-vien', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await svc.thuVien(idNguoiDung(req))); } catch (e) { next(e); }
});

// ════════════════════════════════════════════════════════════════
// VIDEO NGƯỜI DÙNG TỰ THÊM
// ════════════════════════════════════════════════════════════════

router.post('/cua-toi', body('url').isString().isLength({ min: 8, max: 2048 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try {
      ok(res, await them.themTuUrl(idNguoiDung(req), String(req.body.url)));
    } catch (e) { next(e); }
  });

router.get('/cua-toi', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await them.videoCuaToi(idNguoiDung(req))); } catch (e) { next(e); }
});

router.get('/cua-toi/:id(\\d+)/phu-de', param('id').isInt(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try {
      ok(res, await them.phuDeCuaToi(idNguoiDung(req), Number(req.params.id)));
    } catch (e) { next(e); }
  });

router.delete('/cua-toi/:id(\\d+)', param('id').isInt(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try {
      ok(res, await them.xoaVideo(idNguoiDung(req), Number(req.params.id)));
    } catch (e) { next(e); }
  });

router.get('/khoa/:id(\\d+)', param('id').isInt(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await svc.videoCuaKhoa(Number(req.params.id))); } catch (e) { next(e); }
  });

router.get('/phu-de/:lessonId(\\d+)', param('lessonId').isInt(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await svc.phuDe(Number(req.params.lessonId))); } catch (e) { next(e); }
  });

/**
 * Nhại theo: gửi một đoạn ghi âm ngắn, nhận về BẢN PHIÊN ÂM.
 *
 * ⚠️ Lưu trong BỘ NHỚ, không ghi đĩa (`memoryStorage`). Giọng nói là dữ
 * liệu sinh trắc học; để nó rơi xuống thư mục tạm của máy chủ là tạo ra
 * một kho không ai định tạo và không ai nhớ dọn.
 *
 * Trần 10 MB: một câu nhại dài nhất cũng chỉ vài trăm KB. Trần rộng chỉ
 * mở đường cho người ta đẩy cả file nhạc lên.
 */
const ghiAm = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/nhai', ghiAm.single('audio'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const f = (req as unknown as { file?: Express.Multer.File }).file;
    if (!f) { res.status(400).json({ success: false, message: 'Thiếu audio' }); return; }
    ok(res, await svc.nhaiTheo({
      audio: f.buffer,
      filename: f.originalname || 'nhai.m4a',
      mimetype: f.mimetype || 'audio/m4a',
      cauDich: String((req.body as { cau?: string }).cau ?? ''),
    }));
  } catch (e) { next(e); }
});

export default router;
