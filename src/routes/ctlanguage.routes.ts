/**
 * CT Language — tuyến riêng của app iOS (mounted at /api/v1/ctlanguage). docs/ct-language-app.md.
 *
 * Tiến độ IELTS dùng lại `/api/v1/ielts/*`; ở đây chỉ thứ app này cần mà web chưa có.
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '../config/redis.js';
import multer from 'multer';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { BadRequestError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { isProEffective } from '../services/pro.service.js';
import type { ApiResponse } from '../types/index.js';
import { docHoSo, luuHoSo } from '../services/ctlanguage/hoSo.js';
import { chiTiet, chuCuaNgay, chuHan, deTroChoi, goiOffline, theoBoThu, tra, vietTay } from '../services/ctlanguage/tuDien.js';
import {
  baoCao, boChan, btvChon, chan, chiTietBai, chonHayNhat, dangBai, danhMuc, dsBai, dsBaiCuaNguoi, dsDaChan, khoaXem, luuBai, suaBai,
  thichBai, thichTraLoi, traLoi, xoaCuaToi,
} from '../services/ctlanguage/congDong.js';
import { docThongBao, dsTheoDoi, dsThongBao, hoSoNguoi, soChuaDoc, theoDoi, xepHang } from '../services/ctlanguage/congDongNguoi.js';
import { luotGau, nhoGauTraLoi } from '../services/ctlanguage/congDongGau.js';
import { chamBuoiGoi, chayLuotGoi, luotGoi } from '../services/ctlanguage/goiCuongMini.js';
import { dsChoWeb, docNN } from '../services/ielts/troChuyen/chuDe.js';
import type { SuKienTC } from '../services/ielts/troChuyen/troChuyenLuong.service.js';

const router = Router();

// ─── TỪ ĐIỂN — CÔNG KHAI (khách dùng app không cần tài khoản: bài học + từ điển free, user chốt 12/11) ───────────

/** IP thật = mục CUỐI của X-Forwarded-For do proxy của ta ghi (cùng luật crm.routes.ts). */
function ipThat(req: Request): string {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)?.split(',').map((s) => s.trim()).filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || 'unknown';
}

/** 120 lượt tra/phút/IP (gõ tới đâu tra tới đó). Redis chết ⇒ cho qua (fail-open), không làm sập từ điển. */
const gioiHanTra: RequestHandler = (() => {
  const l = rateLimit({
    windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: 'rl:ctl-tudien:' }),
    keyGenerator: (req) => `ip:${ipThat(req)}`,
    message: { success: false, message: 'Tra hơi nhanh — đợi vài giây rồi thử lại.', code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-tudien] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
})();

const idSo = (v: string) => { const n = Number(v); if (!Number.isInteger(n) || n <= 0) throw new BadRequestError('id không hợp lệ'); return n; };

/** Tra: `?q=` (chữ / pinyin / romaji / kana / Hán Việt / nghĩa Việt), tối đa 50 kết quả gọn. */
router.get('/tu-dien/:nn/tra', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json({ success: true, data: await tra(req.params.nn, String(req.query.q ?? ''), Number(req.query.gioiHan ?? 30)) });
  } catch (e) { next(e); }
});

/** Một mục đầy đủ + thẻ từng chữ Hán trong nó + các mục cùng chữ viết. */
router.get('/tu-dien/muc/:id', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json({ success: true, data: await chiTiet(idSo(req.params.id)) });
  } catch (e) { next(e); }
});

/** Thẻ một chữ Hán (Hán Việt, pinyin, on/kun, bộ, nét) + từ chứa chữ đó trong ngôn ngữ `nn`. */
router.get('/tu-dien/:nn/chu/:chu', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json({ success: true, data: await chuHan(req.params.chu, req.params.nn) });
  } catch (e) { next(e); }
});

/** Tra theo bộ thủ: các chữ thuộc bộ Khang Hy `so` (1–214) của ngôn ngữ `nn` (zh/ja), sắp số nét rồi độ hay gặp. */
router.get('/tu-dien/:nn/bo-thu/:so', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.json({ success: true, data: await theoBoThu(req.params.nn, Number(req.params.so)) });
  } catch (e) { next(e); }
});

/** Viết tay ⇒ 12 chữ giống nét nhất (Hán / kanji / kana). Thân: `{ net: [[[x,y],…],…] }` theo thứ tự nét. */
router.post('/tu-dien/:nn/viet-tay', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await vietTay(req.params.nn, req.body) }); } catch (e) { next(e); }
});

/** "Một chữ · ba ngôn ngữ" của ngày `?ngay=YYYY-MM-DD` (theo giờ máy người dùng). */
router.get('/tu-dien/chu-ngay', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json({ success: true, data: await chuCuaNgay(String(req.query.ngay ?? '')) });
  } catch (e) { next(e); }
});

/** Đề trò chơi: `?n=` (4–80) từ thông dụng ngẫu nhiên có nghĩa Việt — app dựng "60 giây chọn nghĩa" + "Gõ nhanh". */
router.get('/tu-dien/:nn/tro-choi', gioiHanTra, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ success: true, data: await deTroChoi(req.params.nn, Number(req.query.n ?? 40)) });
  } catch (e) { next(e); }
});

// ─── CỘNG ĐỒNG — đọc công khai (khách xem được; có token thì ẩn người đã chặn nhau) ──────────────────────────────
// ⚠️ THỨ TỰ: mọi tuyến `/cong-dong/<chữ cố định>` (GET) phải khai TRƯỚC `/cong-dong/:nn` — không thì `:nn` nuốt mất
// (13/11: GET /cong-dong/chan từng rơi vào `:nn` ⇒ 400 CTL_NN_SAI, màn "Người đã chặn" luôn trống). Tuyến cần đăng nhập
// mà phải đứng trên `:nn` thì gắn `authenticate` riêng từng tuyến.
router.get('/cong-dong/chan', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await dsDaChan(req.userId!) }); } catch (e) { next(e); }
});
router.get('/cong-dong/thong-bao', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const truoc = req.query.truoc ? idSo(String(req.query.truoc)) : undefined;
    res.json({ success: true, data: await dsThongBao(req.userId!, truoc) });
  } catch (e) { next(e); }
});
router.get('/cong-dong/thong-bao/chua-doc', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await soChuaDoc(req.userId!) }); } catch (e) { next(e); }
});
/** Lượt "Nhờ Gấu" còn lại hôm nay (không gửi gì tới AI — cố ý KHÔNG nằm dưới `/ai/`). */
router.get('/cong-dong/luot-gau', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luotGau(req.userId!) }); } catch (e) { next(e); }
});
/** Chi tiết bài + trả lời. Đếm lượt xem: một người (khách: một IP băm) một lần mỗi ngày. */
router.get('/cong-dong/bai/:id', gioiHanTra, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const xem = req.userId ?? null;
    res.json({ success: true, data: await chiTietBai(idSo(req.params.id), xem, { khoaXem: khoaXem(xem, ipThat(req)) }) });
  } catch (e) { next(e); }
});
router.get('/cong-dong/nguoi/:id', gioiHanTra, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await hoSoNguoi(idSo(req.params.id), req.userId ?? null) }); } catch (e) { next(e); }
});
router.get('/cong-dong/nguoi/:id/bai', gioiHanTra, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const truoc = req.query.truoc ? idSo(String(req.query.truoc)) : undefined;
    const nn = req.query.nn ? String(req.query.nn) : undefined;
    res.json({ success: true, data: await dsBaiCuaNguoi(idSo(req.params.id), req.userId ?? null, truoc, nn) });
  } catch (e) { next(e); }
});
/** `?chieu=nguoi-theo-doi` (mặc định) | `dang-theo-doi`. */
router.get('/cong-dong/nguoi/:id/theo-doi', gioiHanTra, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const chieu = req.query.chieu === 'dang-theo-doi' ? 'dang-theo-doi' : 'nguoi-theo-doi';
    res.json({ success: true, data: await dsTheoDoi(idSo(req.params.id), req.userId ?? null, chieu) });
  } catch (e) { next(e); }
});
/** Bảng xếp hạng người giúp đỡ: `?khoang=tuan|thang`. */
router.get('/cong-dong/:nn/xep-hang', gioiHanTra, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await xepHang(req.params.nn, req.query.khoang, req.userId ?? null) }); } catch (e) { next(e); }
});
router.get('/cong-dong/:nn/danh-muc', gioiHanTra, (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json({ success: true, data: danhMuc(req.params.nn) });
  } catch (e) { next(e); }
});
/**
 * Bảng tin. `?tab=moi|noi-bat|btv|theo-doi|da-luu` (vắng = moi — app cũ), `q`, `loai`, `the`, phân trang `truoc` (id)
 * hoặc `tu` (vị trí, tab noi-bat). theo-doi / da-luu khi chưa đăng nhập ⇒ `{items: [], canDangNhap: true}`.
 */
router.get('/cong-dong/:nn', gioiHanTra, optionalAuth, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const truoc = req.query.truoc ? idSo(String(req.query.truoc)) : undefined;
    const { tab, q, loai, the, tu } = req.query;
    res.json({ success: true, data: await dsBai(req.params.nn, req.userId ?? null, truoc, Number(req.query.gioiHan ?? 20), { tab, q, loai, the, tu }) });
  } catch (e) { next(e); }
});

// ─── Từ đây trở xuống: cần đăng nhập ───────────────────────────────────────────────────────────────────────────
router.use(authenticate);

/**
 * Gói từ điển offline (quyền Pro — docs mục 4: "offline" là của Pro). Vài MB JSON (nén gzip ở middleware) ⇒ app tải
 * một lần, so `phienBan` để biết khi nào tải lại. Không Pro ⇒ 403 `CTL_CAN_PRO`.
 */
router.get('/tu-dien/:nn/goi-offline', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    if (!(await isProEffective(req.userId))) {
      res.status(403).json({ success: false, message: 'Từ điển offline là tính năng Pro.', code: 'CTL_CAN_PRO' } as ApiResponse);
      return;
    }
    res.setHeader('Cache-Control', 'private, max-age=600');
    res.json({ success: true, data: await goiOffline(req.params.nn) });
  } catch (e) { next(e); }
});

/** Bộ giới hạn theo người (Redis; Redis chết ⇒ cho qua, không làm sập cộng đồng). */
function gioiHanNguoi(tien: string, max: number, cau: string): RequestHandler {
  const l = rateLimit({
    windowMs: 3_600_000, max, standardHeaders: true, legacyHeaders: false,
    store: new RedisStore({ sendCommand: (async (...a: string[]) => (await getRedis()).sendCommand(a)) as never, prefix: tien }),
    keyGenerator: (req) => `u:${req.userId}`,
    message: { success: false, message: cau, code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => l(req, res, (err?: unknown) => {
    if (err) logger.warn('[ctl-congdong] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
}
/** 30 lần ghi (bài + sửa + trả lời + báo cáo + nhờ Gấu) mỗi giờ mỗi người — chống spam. */
const gioiHanGhi = gioiHanNguoi('rl:ctl-congdong:', 30, 'Bạn đăng hơi nhiều — nghỉ một lát rồi viết tiếp nhé.');
/** Thích / lưu / theo dõi / đọc thông báo: 400 lần mỗi giờ (bấm qua bấm lại vẫn thoải mái, chặn kịch bản cày). */
const gioiHanTuongTac = gioiHanNguoi('rl:ctl-cd-tt:', 400, 'Bạn bấm hơi nhanh — đợi một chút nhé.');

// ─── CỘNG ĐỒNG — ghi (đăng nhập). Kiểm duyệt: src/services/ctlanguage/congDong.ts ────────────────────────────────
router.post('/cong-dong/bao-cao', gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await baoCao(req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});
router.post('/cong-dong/chan/:userId', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await chan(req.userId!, idSo(req.params.userId)) }); } catch (e) { next(e); }
});
router.delete('/cong-dong/chan/:userId', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await boChan(req.userId!, idSo(req.params.userId)) }); } catch (e) { next(e); }
});
/** Đánh dấu đã đọc: thân `{ ids: [..] }`, vắng ids ⇒ tất cả. */
router.post('/cong-dong/thong-bao/doc', gioiHanTuongTac, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await docThongBao(req.userId!, req.body?.ids) }); } catch (e) { next(e); }
});
router.post('/cong-dong/theo-doi/:userId', gioiHanTuongTac, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await theoDoi(req.userId!, idSo(req.params.userId), true) }); } catch (e) { next(e); }
});
router.delete('/cong-dong/theo-doi/:userId', gioiHanTuongTac, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await theoDoi(req.userId!, idSo(req.params.userId), false) }); } catch (e) { next(e); }
});
/** Admin: "BTV chọn" — thân `{ chon: true|false }` (vắng = true). Gỡ nội dung vẫn ở hộp kiểm duyệt của admin. */
router.post('/cong-dong/admin/bai/:id/btv', requireAdmin(), async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await btvChon(req.userId!, idSo(req.params.id), req.body?.chon !== false) }); } catch (e) { next(e); }
});
router.post('/cong-dong/bai/:id/thich', gioiHanTuongTac, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await thichBai(req.userId!, idSo(req.params.id), true) }); } catch (e) { next(e); }
});
router.delete('/cong-dong/bai/:id/thich', gioiHanTuongTac, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await thichBai(req.userId!, idSo(req.params.id), false) }); } catch (e) { next(e); }
});
router.post('/cong-dong/bai/:id/luu', gioiHanTuongTac, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luuBai(req.userId!, idSo(req.params.id), true) }); } catch (e) { next(e); }
});
router.delete('/cong-dong/bai/:id/luu', gioiHanTuongTac, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luuBai(req.userId!, idSo(req.params.id), false) }); } catch (e) { next(e); }
});
/** Người hỏi chọn câu trả lời hay nhất: thân `{ traLoiId }` (null ⇒ bỏ chọn). */
router.post('/cong-dong/bai/:id/hay-nhat', gioiHanTuongTac, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const t = req.body?.traLoiId;
    res.json({ success: true, data: await chonHayNhat(req.userId!, idSo(req.params.id), t === null || t === undefined ? null : idSo(String(t))) });
  } catch (e) { next(e); }
});
/** 🐻 Nhờ Gấu trả lời (AI — đường có `/ai/`). Mỗi bài một lần; lượt/ngày free/Pro ở `congDongGau.ts`. */
router.post('/cong-dong/bai/:id/ai/tra-loi', gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await nhoGauTraLoi(req.userId!, idSo(req.params.id)) }); } catch (e) { next(e); }
});
router.post('/cong-dong/bai/:id/tra-loi', gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await traLoi(req.userId!, idSo(req.params.id), req.body ?? {}) }); } catch (e) { next(e); }
});
/** Sửa bài của mình: `{ tieuDe?, noiDung?, loai?, the? }`. */
router.patch('/cong-dong/bai/:id', gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await suaBai(req.userId!, idSo(req.params.id), req.body ?? {}) }); } catch (e) { next(e); }
});
router.post('/cong-dong/tra-loi/:id/thich', gioiHanTuongTac, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await thichTraLoi(req.userId!, idSo(req.params.id), true) }); } catch (e) { next(e); }
});
router.delete('/cong-dong/tra-loi/:id/thich', gioiHanTuongTac, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await thichTraLoi(req.userId!, idSo(req.params.id), false) }); } catch (e) { next(e); }
});
router.delete('/cong-dong/bai/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await xoaCuaToi(req.userId!, 'bai', idSo(req.params.id)) }); } catch (e) { next(e); }
});
router.delete('/cong-dong/tra-loi/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await xoaCuaToi(req.userId!, 'tra-loi', idSo(req.params.id)) }); } catch (e) { next(e); }
});
/** Đăng bài: `{ noiDung, loai?, tieuDe?, the? }`. Khai CUỐI cùng (`:nn` nuốt mọi `/cong-dong/<chữ>`). */
router.post('/cong-dong/:nn', gioiHanGhi, async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await dangBai(req.userId!, req.params.nn, req.body ?? {}) }); } catch (e) { next(e); }
});

// ─── GỌI THOẠI CUONGMINI — bọc phòng trò chuyện của web (`ielts/troChuyen`) + hạn lượt free/Pro (goiCuongMini.ts) ──
router.get('/ai/goi/chu-de', (req: Request, res: Response<ApiResponse>) => {
  res.json({ success: true, data: { items: dsChoWeb(docNN(req.query.nn)) } });
});
router.get('/ai/goi/luot', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luotGoi(req.userId!) }); } catch (e) { next(e); }
});
// Âm thanh KHÔNG chạm đĩa, không lưu (giọng nói là dữ liệu sinh trắc học) — giống `/ielts/ai/tro-chuyen/luong`.
const audioGoi = multer({ storage: multer.memoryStorage(), limits: { fileSize: 6 * 1024 * 1024 } });
/** Một lượt (SSE): multipart `audio` (m4a; vắng = câu mở đầu) + `trangThai` JSON {nn, chuDeId, lichSu, giong}. */
router.post('/ai/goi/luong', audioGoi.single('audio'), async (req: Request, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();
  const gui = (e: SuKienTC | { type: 'luot'; conLai: number | null; laPro: boolean }): void => { if (!res.writableEnded) res.write(`data: ${JSON.stringify(e)}\n\n`); };
  const keepalive = setInterval(() => { if (!res.writableEnded) res.write(': ka\n\n'); }, 15_000);
  const ctl = new AbortController();
  res.on('close', () => { clearInterval(keepalive); if (!res.writableFinished) ctl.abort(); });
  try {
    let tt: Record<string, unknown> = {};
    try { tt = JSON.parse(String(req.body?.trangThai ?? '{}')) as Record<string, unknown>; } catch { /* lượt mở đầu */ }
    await chayLuotGoi(req.userId!, { audio: req.file?.buffer, mime: req.file?.mimetype, ...tt }, gui, ctl.signal);
  } catch (e) {
    gui({ type: 'loi', lyDo: 'loi', message: (e as Error)?.message?.slice(0, 200) || 'Có lỗi, bạn thử lại nhé.' });
  } finally {
    clearInterval(keepalive);
    if (!res.writableEnded) res.end();
  }
});
/** Chấm cả buổi (band IELTS / điểm JLPT-HSK) — Pro. */
router.post('/ai/goi/cham', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await chamBuoiGoi(req.userId!, req.body ?? {}) }); } catch (e) { next(e); }
});

/** Hồ sơ học (ngôn ngữ đang học + lựa chọn làm quen + giờ nhắc). `data: null` khi chưa từng lưu. */
router.get('/me', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await docHoSo(req.userId!) }); } catch (e) { next(e); }
});

/** Ghi đè hồ sơ học. Thân sai hình dạng ⇒ 400 `CTL_HO_SO_SAI`. */
router.put('/me', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await luuHoSo(req.userId!, req.body) }); } catch (e) { next(e); }
});

export default router;
