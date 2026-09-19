/**
 * Học tiếng Anh bằng VIDEO — danh mục, danh sách video, phụ đề.
 *
 * Đặt sau `authenticate` như mọi route nội dung khác: phụ đề là kết quả của
 * một đợt thu tốn công, không phải thứ để mở cho cả internet cào về.
 */
import { Router, type Response } from 'express';
import multer from 'multer';
import { param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '../types/index.js';
import * as svc from '../services/video/phuDe.service.js';

const router = Router();
router.use(authenticate);

const ok = (res: Response<ApiResponse>, data: unknown) => res.json({ success: true, data });

router.get('/danh-muc', async (_req, res: Response<ApiResponse>, next) => {
  try { ok(res, await svc.danhMuc()); } catch (e) { next(e); }
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
