/**
 * Công cụ tài liệu — gắn ở /api/v1/doc-tools
 * ─────────────────────────────────────────────────────────────────────────
 *   GET  /presets              công khai — danh sách ô ký hiệu + giới hạn
 *   POST /transcribe           cần đăng nhập — ảnh → chữ + công thức
 *   POST /export/docx          cần đăng nhập — bản chép đã sửa → file Word
 *
 * Vì sao tách hai bước chép và xuất file, thay vì một nút "ảnh → Word":
 * model đúng gần hết nhưng KHÔNG đúng hết (đo được: sót cỡ một chỗ nhỏ mỗi
 * trang). Với giáo án và đề kiểm tra, một con số sai lọt vào file là hỏng việc
 * thật. Nên bản chép phải qua mắt người dùng trước khi thành file — bước xem
 * lại là tính năng, không phải phiền phức.
 *
 * Chưa có đường xuất PDF ở đây, có chủ đích: bản PDF được in ra từ chính trang
 * xem lại ở trình duyệt (KaTeX + CSS in), nên công thức là chữ vector và không
 * phải cài Chrome vào image của máy chủ. Xem `frontend/src/app/tools/…`.
 */
import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import { SYMBOL_PRESETS } from '../services/docTools/prompt.js';
import {
  TOI_DA_ANH,
  chepNhieuAnh,
  type AnhVao,
  type CheDoHinh,
} from '../services/docTools/transcribe.service.js';
import { renderDocx, type HinhKemTheo } from '../services/docTools/docx.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024, files: TOI_DA_ANH },
});

type Handler = (req: Request, res: Response<ApiResponse>) => Promise<unknown>;
const h = (fn: Handler) =>
  async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
    try {
      const data = await fn(req, res);
      if (!res.headersSent) res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

const CHE_DO_HINH: CheDoHinh[] = ['cat-anh', 'bo-qua', 'mo-ta', 've-lai'];

// ─── Công khai: mô tả khả năng của công cụ ────────────────────────────────
// Cũng là route được `deploy.sh` gọi để chắc chắn module này đã lên thật.
router.get(
  '/presets',
  h(async () => ({
    toiDaAnh: TOI_DA_ANH,
    toiDaMoiAnhMb: 12,
    presets: SYMBOL_PRESETS.map((p) => ({ id: p.id, label: p.label, hint: p.hint })),
    cheDoHinh: [
      { id: 'cat-anh', label: 'Cắt hình từ ảnh gốc (giống 100%)', hint: 'Lấy đúng pixel của tờ giấy, chèn vào đúng chỗ — không sợ máy đọc nhầm số đo' },
      { id: 'bo-qua', label: 'Không xử lý hình', hint: 'Chỉ lấy chữ; chỗ có hình để trống một dòng đánh dấu' },
      { id: 'mo-ta', label: 'Mô tả hình bằng lời', hint: 'Ghi lại điểm, nét đứt, ký hiệu góc vuông, số đo' },
      { id: 've-lai', label: 'Vẽ lại hình thành hình nét', hint: 'Đẹp nhưng là hình MỚI — máy từng đọc 124° thành 120° rồi vẽ theo số sai' },
    ],
  })),
);

// ─── Ảnh → chữ ────────────────────────────────────────────────────────────
router.post(
  '/transcribe',
  authenticate,
  upload.array('images', TOI_DA_ANH),
  h(async (req) => {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (!files.length) throw new AppError('Chưa chọn ảnh nào (trường "images").', 400, 'NO_IMAGES');

    const anhs: AnhVao[] = files.map((f) => ({
      data: f.buffer.toString('base64'),
      mediaType: f.mimetype,
      ten: f.originalname,
    }));

    const cheDoHinh = CHE_DO_HINH.includes(req.body?.cheDoHinh) ? (req.body.cheDoHinh as CheDoHinh) : 'bo-qua';
    const trang = await chepNhieuAnh(anhs, {
      presetIds: docPresetIds(req.body?.presets),
      note: typeof req.body?.note === 'string' ? req.body.note : undefined,
      cheDoHinh,
      userId: req.userId,
    });

    return {
      trang,
      tong: {
        soTrang: trang.length,
        soTrangHong: trang.filter((t) => t.loi).length,
        soChoNgo: trang.reduce((s, t) => s + t.soChoNgo, 0),
        costUsd: Number(trang.reduce((s, t) => s + (t.costUsd ?? 0), 0).toFixed(5)),
      },
    };
  }),
);

// ─── Bản chép (đã được người dùng sửa) → file Word ────────────────────────
// Trả về BYTES chứ không phải JSON, nên viết tay thay vì dùng `h()` — cái đó
// gói mọi thứ vào `{ success, data }`.
router.post(
  '/export/docx',
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const vanBan = typeof req.body?.vanBan === 'string' ? req.body.vanBan : '';
      if (!vanBan.trim()) throw new AppError('Không có nội dung để xuất.', 400, 'EMPTY_CONTENT');
      if (vanBan.length > 400_000) throw new AppError('Nội dung quá dài.', 400, 'TOO_LONG');

      const hinh: HinhKemTheo[] = Array.isArray(req.body?.hinh)
        ? (req.body.hinh as Array<{ pngBase64?: string; chuThich?: string }>)
            .filter((x) => typeof x?.pngBase64 === 'string' && x.pngBase64.length < 8_000_000)
            .slice(0, 20)
            .map((x) => ({
              buffer: Buffer.from(String(x.pngBase64).replace(/^data:[^,]+,/, ''), 'base64'),
              loai: 'png' as const,
              chuThich: typeof x.chuThich === 'string' ? x.chuThich.slice(0, 200) : undefined,
            }))
        : [];

      const tieuDe = typeof req.body?.tieuDe === 'string' ? req.body.tieuDe.slice(0, 200) : '';
      const kq = await renderDocx({ tieuDe, vanBan, hinh });

      // Tên file phải là ASCII: dấu tiếng Việt trong header `Content-Disposition`
      // làm một số trình duyệt cắt tên hoặc bỏ luôn header.
      const ten = `${khongDau(tieuDe || 'ban-chep') || 'ban-chep'}.docx`;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${ten}"`);
      // Để giao diện báo được "có N công thức phải để dạng chữ vì không dựng nổi".
      res.setHeader('X-Cong-Thuc-Hong', String(kq.congThucHong));
      res.setHeader('X-Cong-Thuc-Tong', String(kq.soCongThuc));
      res.send(kq.buffer);
    } catch (err) {
      next(err);
    }
  },
);

/** "Đề ôn tập chương III" → "de-on-tap-chuong-iii" */
function khongDau(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 60);
}

function docPresetIds(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const j = JSON.parse(raw);
      if (Array.isArray(j)) return j.map(String);
    } catch {
      /* không phải JSON thì coi như danh sách ngăn bằng dấu phẩy */
    }
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export default router;
