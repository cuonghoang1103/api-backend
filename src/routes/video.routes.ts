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
import { chuanTrack } from '../services/video/phuDeRieng.js';
import * as them from '../services/video/themVideo.service.js';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { laNnVideo } from '../services/video/phuDeDaNgu.js';
import { dichTiep } from '../services/video/dichPhuDe.js';
import { trichHoc } from '../services/video/trichHoc.js';

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
  // `?nn=en|ja|zh` (app CT Language) ⇒ thư viện của ngôn ngữ đó. Thiếu/lạ ⇒ như cũ (app CuongThai).
  const nn = laNnVideo(req.query.nn) ? req.query.nn : undefined;
  try { ok(res, await svc.thuVien(idNguoiDung(req), nn)); } catch (e) { next(e); }
});

// ════════════════════════════════════════════════════════════════
// CT LANGUAGE (16/11/2026) — thêm video đa ngôn ngữ CHẠY NỀN + dịch phụ đề theo lô
//   POST /them            {url, nn?: auto|en|ja|zh, nhomLon?} ⇒ {ma, buoc, viTri, loi, video} (trả ngay)
//   GET  /them/:ma        ⇒ cùng hình — app hỏi ~1,5 s/lần để hiện từng bước
//   POST /cua-toi/:id/dich {tu?} ⇒ {moi:[[i,"bản dịch"]], daDich, tong, xong, dangBan, conLuot}
//   POST /cua-toi/:id/trich-hoc {phamVi: cau|doan|video, tu?, den?} ⇒ {tu:[thẻ từ], nguPhap:[thẻ mẫu], khoa, tuBoNho, conLuot}
// ════════════════════════════════════════════════════════════════

/** Chống bấm dồn: 6 link/phút/người (hàng đợi đã giới hạn 3 việc đang chờ). */
const gioiHanThem = rateLimit({
  windowMs: 60_000, max: 6, standardHeaders: true, legacyHeaders: false,
  keyGenerator: (req) => `video-them:${(req as Request).userId}`,
  message: { success: false, message: 'Bạn thêm video hơi nhanh — đợi một chút nhé.', code: 'RATE_LIMIT_EXCEEDED' },
});
/** Dịch: app gọi liên tiếp từng lô khi đang mở video — 30 lô/phút là dư (trần câu/ngày nằm ở service). */
const gioiHanDich = rateLimit({
  windowMs: 60_000, max: 30, standardHeaders: true, legacyHeaders: false,
  keyGenerator: (req) => `video-dich:${(req as Request).userId}`,
  message: { success: false, message: 'Đang dịch hơi dồn — đợi một chút nhé.', code: 'RATE_LIMIT_EXCEEDED' },
});

router.post('/them', gioiHanThem, body('url').isString().isLength({ min: 8, max: 2048 }),
  body('nn').optional().isIn(['auto', 'en', 'ja', 'zh']),
  body('nhomLon').optional().isString().isLength({ max: 24 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try {
      ok(res, them.guiViecThem(idNguoiDung(req), String(req.body.url), {
        nn: req.body.nn ? String(req.body.nn) : undefined,
        nhomLon: req.body.nhomLon ? String(req.body.nhomLon) : undefined,
      }));
    } catch (e) { next(e); }
  });

router.get('/them/:ma', param('ma').isUUID(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, them.xemViecThem(idNguoiDung(req), String(req.params.ma))); } catch (e) { next(e); }
  });

// Thẻ học (từ vựng + ngữ pháp) của một câu / đoạn / cả video — JSON có cấu trúc, lưu lại (xem `trichHoc.ts`).
// Đường có `/ai/`? KHÔNG — app gọi `DongYChiaSeAI.batBuoc()` trước (chỉ gửi phụ đề, không gửi dữ liệu người dùng).
router.post('/cua-toi/:id(\\d+)/trich-hoc', gioiHanDich, param('id').isInt(),
  body('phamVi').isIn(['cau', 'doan', 'video']),
  body('tu').optional().isInt({ min: 0, max: 100000 }), body('den').optional().isInt({ min: 0, max: 100000 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await trichHoc(idNguoiDung(req), Number(req.params.id), req.body ?? {})); } catch (e) { next(e); }
  });

router.post('/cua-toi/:id(\\d+)/dich', gioiHanDich, param('id').isInt(),
  body('tu').optional().isInt({ min: 0, max: 100000 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try { ok(res, await dichTiep(idNguoiDung(req), Number(req.params.id), req.body?.tu)); } catch (e) { next(e); }
  });

// ════════════════════════════════════════════════════════════════
// VIDEO NGƯỜI DÙNG TỰ THÊM
// ════════════════════════════════════════════════════════════════

router.post('/cua-toi', body('url').isString().isLength({ min: 8, max: 2048 }),
  body('nhomLon').optional().isString().isLength({ max: 24 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try {
      ok(res, await them.themTuUrl(idNguoiDung(req), String(req.body.url),
                                   req.body.nhomLon ? String(req.body.nhomLon) : undefined));
    } catch (e) { next(e); }
  });

router.patch('/cua-toi/:id(\\d+)/nhom', param('id').isInt(),
  body('nhomLon').isString().isLength({ max: 24 }), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try {
      ok(res, await them.doiNhom(idNguoiDung(req), Number(req.params.id),
                                 String(req.body.nhomLon)));
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

// ── Yêu thích ──
// `ma` ÂM = video người dùng tự thêm, nên KHÔNG dùng `:id(\\d+)` (nó không
// khớp dấu trừ và route sẽ 404 đúng với những video tự thêm).
router.post('/yeu-thich/:ma(-?\\d+)', param('ma').isInt(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    try {
      ok(res, await them.doiYeuThich(idNguoiDung(req), Number(req.params.ma)));
    } catch (e) { next(e); }
  });

router.get('/yeu-thich', async (req, res: Response<ApiResponse>, next) => {
  try { ok(res, await them.maYeuThich(idNguoiDung(req))); } catch (e) { next(e); }
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

// Hỏi ĐÚNG MỘT câu: bài này có phụ đề không? Trang học gọi mỗi lần đổi bài để
// quyết có mời vào phòng học cùng AI hay không — xem `coPhuDe()`.
router.get('/co-phu-de/:lessonId(\\d+)', param('lessonId').isInt(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    // `?track=VI|EN` (trang học đang mở video riêng) ⇒ hỏi phụ đề RIÊNG; thiếu ⇒ như cũ.
    try { ok(res, await svc.coPhuDe(Number(req.params.lessonId), chuanTrack(req.query.track))); } catch (e) { next(e); }
  });

// Mở phòng học video: có phụ đề thì trả đủ, chưa có thì trả video + `coPhuDe:false`.
// Tách khỏi `/phu-de` (app iOS coi 404 ở đó là "chưa có phụ đề") — xem `phongHoc()`.
router.get('/phong/:lessonId(\\d+)', param('lessonId').isInt(), validate,
  async (req, res: Response<ApiResponse>, next) => {
    // `?track=VI|EN|YT|auto` — trình duyệt luôn gửi; thiếu (app iOS) ⇒ đường YouTube cũ y nguyên.
    const t = String(req.query.track ?? '').toLowerCase() === 'auto' ? 'auto' as const : chuanTrack(req.query.track);
    try { ok(res, await svc.phongHoc(Number(req.params.lessonId), t)); } catch (e) { next(e); }
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
