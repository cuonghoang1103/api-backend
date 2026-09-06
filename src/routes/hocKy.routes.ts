import { Router, type Response, type Request } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();
router.use(authenticate);

const NGAY = /^\d{4}-\d{2}-\d{2}$/;
const GIO = /^([01]\d|2[0-3]):([0-5]\d)$/;
/** Đúng bộ loại FAP dùng, cộng thi nói/nghe/viết cho môn ngoại ngữ. */
const LOAI_THI = ['PE', 'FE', 'PT', 'ME', 'NOI', 'NGHE', 'VIET', 'KHAC'] as const;

/** Lùi một ngày về THỨ HAI cùng tuần (UTC). */
function veThuHai(d: Date): Date {
  const x = new Date(d);
  // getUTCDay: 0 = Chủ nhật … 6 = thứ Bảy. Chủ nhật phải lùi 6 ngày, không phải 0.
  const lui = (x.getUTCDay() + 6) % 7;
  x.setUTCDate(x.getUTCDate() - lui);
  return x;
}

function ngayTu(s: unknown, ten: string): Date {
  const v = String(s ?? '');
  if (!NGAY.test(v)) throw new AppError(`"${ten}" phải dạng YYYY-MM-DD`, 400, 'INVALID_DATE');
  const d = new Date(`${v}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) throw new AppError(`"${ten}" không hợp lệ`, 400, 'INVALID_DATE');
  return d;
}

// ─── GET /api/v1/hoc-ky ───────────────────────────────────────────
// Mọi kỳ của tôi, kỳ đang học trước. Kèm số buổi thi mỗi kỳ để màn danh sách
// không phải gọi thêm một vòng nữa.
router.get('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const items = await prisma.hocKy.findMany({
      where: { userId: req.userId! },
      orderBy: [{ dangHoc: 'desc' }, { batDau: 'desc' }],
      include: { _count: { select: { lichThi: true } } },
    });
    res.json({ success: true, data: { items } });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/hoc-ky ──────────────────────────────────────────
router.post('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const b = req.body ?? {};
    const ten = String(b.ten ?? '').trim();
    if (!ten) throw new AppError('Thiếu "ten"', 400, 'MISSING_FIELD');
    if (ten.length > 120) throw new AppError('"ten" tối đa 120 ký tự', 400, 'TOO_LONG');

    const soTuan = b.soTuan === undefined ? 10 : Number(b.soTuan);
    if (!Number.isInteger(soTuan) || soTuan < 1 || soTuan > 52) {
      throw new AppError('"soTuan" phải từ 1 tới 52', 400, 'INVALID_WEEKS');
    }
    const tuanThi = b.tuanThi === undefined ? Math.min(8, soTuan) : Number(b.tuanThi);
    if (!Number.isInteger(tuanThi) || tuanThi < 1 || tuanThi > soTuan) {
      throw new AppError('"tuanThi" phải từ 1 tới soTuan', 400, 'INVALID_EXAM_WEEK');
    }

    // Chuẩn hoá về THỨ HAI ngay lúc ghi. Người dùng chọn ngày nào trong tuần
    // cũng được, còn "tuần thứ mấy" thì chỉ là một phép chia — không phải một
    // chuỗi if tuỳ theo họ đã chọn thứ mấy.
    const batDau = veThuHai(ngayTu(b.batDau, 'batDau'));

    const item = await prisma.$transaction(async (tx) => {
      // Chỉ MỘT kỳ đang học. Đặt kỳ mới là kỳ đang học thì hạ cờ của kỳ cũ,
      // không thì hai kỳ cùng bật và app không biết hiện lịch của kỳ nào.
      if (b.dangHoc !== false) {
        await tx.hocKy.updateMany({ where: { userId, dangHoc: true }, data: { dangHoc: false } });
      }
      return tx.hocKy.create({
        data: { userId, ten, batDau, soTuan, tuanThi, dangHoc: b.dangHoc !== false },
      });
    });
    res.status(201).json({ success: true, data: { item } });
  } catch (error) { next(error); }
});

// ─── PATCH /api/v1/hoc-ky/:id ─────────────────────────────────────
router.patch('/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new AppError('id không hợp lệ', 400, 'INVALID_ID');
    const cu = await prisma.hocKy.findFirst({ where: { id, userId } });
    if (!cu) throw new AppError('Không tìm thấy kỳ học', 404, 'NOT_FOUND');

    const b = req.body ?? {};
    const data: Record<string, unknown> = {};
    if (b.ten !== undefined) {
      const t = String(b.ten).trim();
      if (!t) throw new AppError('"ten" không được để trống', 400, 'EMPTY_FIELD');
      data.ten = t.slice(0, 120);
    }
    if (b.batDau !== undefined) data.batDau = veThuHai(ngayTu(b.batDau, 'batDau'));
    if (b.soTuan !== undefined) {
      const n = Number(b.soTuan);
      if (!Number.isInteger(n) || n < 1 || n > 52) throw new AppError('"soTuan" phải từ 1 tới 52', 400, 'INVALID_WEEKS');
      data.soTuan = n;
    }
    if (b.tuanThi !== undefined) {
      const n = Number(b.tuanThi);
      const tran = (data.soTuan as number) ?? cu.soTuan;
      if (!Number.isInteger(n) || n < 1 || n > tran) {
        throw new AppError('"tuanThi" phải từ 1 tới soTuan', 400, 'INVALID_EXAM_WEEK');
      }
      data.tuanThi = n;
    }

    const item = await prisma.$transaction(async (tx) => {
      if (b.dangHoc === true) {
        await tx.hocKy.updateMany({ where: { userId, dangHoc: true }, data: { dangHoc: false } });
        data.dangHoc = true;
      } else if (b.dangHoc === false) {
        data.dangHoc = false;
      }
      return tx.hocKy.update({ where: { id }, data });
    });
    res.json({ success: true, data: { item } });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/hoc-ky/:id ────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    // deleteMany kèm userId: `delete` theo id trần vẫn xoá được kỳ của người
    // khác nếu quên lọc, và lỗi đó không lộ ra khi thử bằng tài khoản của mình.
    const { count } = await prisma.hocKy.deleteMany({
      where: { id: Number(req.params.id), userId: req.userId! },
    });
    if (count === 0) throw new AppError('Không tìm thấy kỳ học', 404, 'NOT_FOUND');
    res.json({ success: true, data: { deleted: Number(req.params.id) } });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/hoc-ky/lich-thi ──────────────────────────────────
// Lịch thi. `?tu=&den=` lọc theo khoảng ngày (app xem một tuần);
// `?hocKyId=` lấy cả kỳ.
router.get('/lich-thi', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const where: Record<string, unknown> = { userId: req.userId! };
    const tu = String(req.query.tu ?? ''), den = String(req.query.den ?? '');
    if (NGAY.test(tu) && NGAY.test(den)) {
      where.ngay = { gte: new Date(`${tu}T00:00:00.000Z`), lte: new Date(`${den}T00:00:00.000Z`) };
    }
    const hk = Number(req.query.hocKyId);
    if (Number.isInteger(hk) && hk > 0) where.hocKyId = hk;

    const items = await prisma.lichThi.findMany({
      where, orderBy: [{ ngay: 'asc' }, { batDau: 'asc' }, { id: 'asc' }],
    });
    res.json({ success: true, data: { items } });
  } catch (error) { next(error); }
});

/** Kiểm một buổi thi. `batBuoc` = true khi tạo mới. */
function kiemThi(b: Record<string, unknown>, batBuoc: boolean) {
  const ra: Record<string, unknown> = {};
  const chu = (k: string, dai: number, canCo = false) => {
    if (b[k] === undefined) {
      if (canCo && batBuoc) throw new AppError(`Thiếu "${k}"`, 400, 'MISSING_FIELD');
      return;
    }
    if (b[k] === null) { ra[k] = null; return; }
    const v = String(b[k]).trim();
    if (canCo && !v) throw new AppError(`"${k}" không được để trống`, 400, 'EMPTY_FIELD');
    if (v.length > dai) throw new AppError(`"${k}" tối đa ${dai} ký tự`, 400, 'TOO_LONG');
    ra[k] = v || null;
  };
  chu('monHoc', 200, true);
  chu('maMon', 50);
  chu('phong', 100);
  chu('soBaoDanh', 50);
  if (b.ghiChu !== undefined) ra.ghiChu = b.ghiChu === null ? null : String(b.ghiChu);

  if (b.loai !== undefined || batBuoc) {
    const v = String(b.loai ?? '').toUpperCase();
    if (!(LOAI_THI as readonly string[]).includes(v)) {
      throw new AppError(`"loai" phải là ${LOAI_THI.join('|')}`, 400, 'INVALID_EXAM_TYPE');
    }
    ra.loai = v;
  }
  if (b.ngay !== undefined || batBuoc) ra.ngay = ngayTu(b.ngay, 'ngay');

  for (const k of ['batDau', 'ketThuc'] as const) {
    if (b[k] === undefined) {
      if (batBuoc) throw new AppError(`Thiếu "${k}"`, 400, 'MISSING_FIELD');
      continue;
    }
    const v = String(b[k]).trim();
    if (!GIO.test(v)) throw new AppError(`"${k}" phải dạng HH:mm`, 400, 'INVALID_TIME');
    ra[k] = v;
  }
  if (b.nhacTruoc !== undefined) {
    const n = Number(b.nhacTruoc);
    if (!Number.isInteger(n) || n < 0 || n > 1440) {
      throw new AppError('"nhacTruoc" phải từ 0 tới 1440', 400, 'INVALID_REMIND');
    }
    ra.nhacTruoc = n;
  }
  if (b.hocKyId !== undefined) {
    ra.hocKyId = b.hocKyId === null ? null : Number(b.hocKyId);
  }
  return ra;
}

const phut = (s: string) => { const p = s.split(':').map(Number); return p[0] * 60 + p[1]; };

// ─── POST /api/v1/hoc-ky/lich-thi ─────────────────────────────────
router.post('/lich-thi', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const d = kiemThi(req.body ?? {}, true);
    if (phut(d.ketThuc as string) <= phut(d.batDau as string)) {
      throw new AppError('Giờ kết thúc phải sau giờ bắt đầu', 400, 'INVALID_RANGE');
    }
    if (d.hocKyId != null) {
      const co = await prisma.hocKy.findFirst({ where: { id: d.hocKyId as number, userId }, select: { id: true } });
      if (!co) throw new AppError('Kỳ học không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
    }
    const item = await prisma.lichThi.create({ data: { ...(d as any), userId } });
    res.status(201).json({ success: true, data: { item } });
  } catch (error) { next(error); }
});

// ─── PATCH /api/v1/hoc-ky/lich-thi/:id ────────────────────────────
router.patch('/lich-thi/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new AppError('id không hợp lệ', 400, 'INVALID_ID');
    const cu = await prisma.lichThi.findFirst({ where: { id, userId } });
    if (!cu) throw new AppError('Không tìm thấy buổi thi', 404, 'NOT_FOUND');

    const d = kiemThi(req.body ?? {}, false);
    // So với giá trị ĐANG LƯU khi client chỉ gửi một đầu giờ.
    const bd = (d.batDau as string) ?? cu.batDau;
    const kt = (d.ketThuc as string) ?? cu.ketThuc;
    if (phut(kt) <= phut(bd)) throw new AppError('Giờ kết thúc phải sau giờ bắt đầu', 400, 'INVALID_RANGE');

    const item = await prisma.lichThi.update({ where: { id }, data: d as any });
    res.json({ success: true, data: { item } });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/hoc-ky/lich-thi/:id ───────────────────────────
router.delete('/lich-thi/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { count } = await prisma.lichThi.deleteMany({
      where: { id: Number(req.params.id), userId: req.userId! },
    });
    if (count === 0) throw new AppError('Không tìm thấy buổi thi', 404, 'NOT_FOUND');
    res.json({ success: true, data: { deleted: Number(req.params.id) } });
  } catch (error) { next(error); }
});

export default router;
