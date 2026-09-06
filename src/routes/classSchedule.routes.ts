import { Router, type Response, type Request } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// Thời khoá biểu là dữ liệu CÁ NHÂN: không có bản dùng chung, không có bản
// cho admin. Mọi truy vấn đều lọc theo `req.userId` và không bao giờ động
// tới dòng của người khác. Bảng có FK ON DELETE CASCADE nên xoá tài khoản là
// lịch đi theo.
router.use(authenticate);

/** 2 = thứ Hai … 8 = Chủ nhật — theo lối gọi của người Việt, không phải 0-6. */
const THU_NHO = 2;
const THU_LON = 8;
const GIO = /^([01]\d|2[0-3]):([0-5]\d)$/;

function phut(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Kiểm một buổi học. Trả về bản đã chuẩn hoá, hoặc ném AppError. */
function kiem(b: Record<string, unknown>, batBuoc: boolean) {
  const ra: Record<string, unknown> = {};

  const chu = (khoa: string, dai: number, canCo = false) => {
    if (b[khoa] === undefined) {
      if (canCo && batBuoc) throw new AppError(`Thiếu "${khoa}"`, 400, 'MISSING_FIELD');
      return;
    }
    if (b[khoa] === null) { ra[khoa] = null; return; }
    const v = String(b[khoa]).trim();
    if (canCo && !v) throw new AppError(`"${khoa}" không được để trống`, 400, 'EMPTY_FIELD');
    if (v.length > dai) throw new AppError(`"${khoa}" tối đa ${dai} ký tự`, 400, 'TOO_LONG');
    ra[khoa] = v || null;
  };

  chu('subject', 200, true);
  chu('classCode', 50);
  chu('teacher', 150);
  chu('room', 100);
  chu('color', 20);
  if (b.note !== undefined) ra.note = b.note === null ? null : String(b.note);

  if (b.weekday !== undefined || batBuoc) {
    const t = Number(b.weekday);
    if (!Number.isInteger(t) || t < THU_NHO || t > THU_LON) {
      throw new AppError(`"weekday" phải từ ${THU_NHO} (thứ Hai) tới ${THU_LON} (Chủ nhật)`, 400, 'INVALID_WEEKDAY');
    }
    ra.weekday = t;
  }

  for (const k of ['startTime', 'endTime'] as const) {
    if (b[k] === undefined) {
      if (batBuoc) throw new AppError(`Thiếu "${k}"`, 400, 'MISSING_FIELD');
      continue;
    }
    const v = String(b[k]).trim();
    if (!GIO.test(v)) throw new AppError(`"${k}" phải dạng HH:mm 24 giờ`, 400, 'INVALID_TIME');
    ra[k] = v;
  }
  // Chỉ so được khi CẢ HAI đầu có mặt: bản PATCH sửa mỗi giờ kết thúc thì
  // phải lấy giờ bắt đầu đang lưu ra để so, việc đó làm ở chỗ gọi.
  if (typeof ra.startTime === 'string' && typeof ra.endTime === 'string'
      && phut(ra.endTime) <= phut(ra.startTime)) {
    throw new AppError('Giờ kết thúc phải sau giờ bắt đầu', 400, 'INVALID_RANGE');
  }

  if (b.remindMinutes !== undefined) {
    const n = Number(b.remindMinutes);
    // Trần 1 ngày: nhắc trước hơn 24 giờ thì thông báo rơi vào buổi học của
    // TUẦN TRƯỚC, và người dùng không có cách nào hiểu vì sao.
    if (!Number.isInteger(n) || n < 0 || n > 1440) {
      throw new AppError('"remindMinutes" phải từ 0 tới 1440', 400, 'INVALID_REMIND');
    }
    ra.remindMinutes = n;
  }

  for (const k of ['startDate', 'endDate'] as const) {
    if (b[k] === undefined) continue;
    if (b[k] === null) { ra[k] = null; continue; }
    const v = String(b[k]);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new AppError(`"${k}" phải dạng YYYY-MM-DD`, 400, 'INVALID_DATE');
    const d = new Date(`${v}T00:00:00.000Z`);
    if (Number.isNaN(d.getTime())) throw new AppError(`"${k}" không phải ngày hợp lệ`, 400, 'INVALID_DATE');
    ra[k] = d;
  }

  return ra;
}

// ─── GET /api/v1/class-schedule ───────────────────────────────────
// Cả thời khoá biểu của tôi, xếp theo thứ rồi giờ.
//
// `?ngay=YYYY-MM-DD` lọc theo kỳ: chỉ trả buổi học còn hiệu lực vào ngày đó.
// Không có tham số thì trả TẤT CẢ — app cần cả lịch kỳ trước để người dùng
// sửa/xoá, chứ không chỉ lịch đang chạy.
router.get('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const ngay = String(req.query.ngay ?? '');
    const loc: Record<string, unknown> = { userId };
    if (/^\d{4}-\d{2}-\d{2}$/.test(ngay)) {
      const d = new Date(`${ngay}T00:00:00.000Z`);
      loc.AND = [
        { OR: [{ startDate: null }, { startDate: { lte: d } }] },
        { OR: [{ endDate: null }, { endDate: { gte: d } }] },
      ];
    }
    const items = await prisma.classSchedule.findMany({
      where: loc,
      orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }, { id: 'asc' }],
    });
    res.json({ success: true, data: { items } });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/class-schedule ──────────────────────────────────
router.post('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = kiem(req.body ?? {}, true);
    const item = await prisma.classSchedule.create({
      data: { ...(data as any), userId: req.userId! },
    });
    res.status(201).json({ success: true, data: { item } });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/class-schedule/bulk ─────────────────────────────
// Nhập cả thời khoá biểu một lượt. Người dùng chép từ trang trường về thì
// có 10-20 buổi; bắt họ bấm lưu từng cái là mời họ bỏ dở giữa chừng.
//
// `thayThe: true` xoá sạch lịch cũ trước khi thêm — dùng khi vào kỳ mới.
// Cả hai bước nằm trong MỘT giao dịch: hỏng giữa chừng thì không ai mất
// lịch cũ mà cũng chưa có lịch mới.
router.post('/bulk', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const ds = req.body?.items;
    if (!Array.isArray(ds) || ds.length === 0) {
      throw new AppError('Cần "items" là mảng không rỗng', 400, 'INVALID_ITEMS');
    }
    if (ds.length > 100) throw new AppError('Tối đa 100 buổi mỗi lượt', 400, 'TOO_MANY');
    // Kiểm HẾT trước khi ghi bất cứ gì: sai ở buổi thứ 12 mà 11 buổi đầu đã
    // vào DB thì người dùng phải tự dọn.
    const sach = ds.map((x) => kiem(x ?? {}, true));

    const ra = await prisma.$transaction(async (tx) => {
      if (req.body?.thayThe === true) {
        await tx.classSchedule.deleteMany({ where: { userId } });
      }
      await tx.classSchedule.createMany({
        data: sach.map((d) => ({ ...(d as any), userId })),
      });
      return tx.classSchedule.findMany({
        where: { userId },
        orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }, { id: 'asc' }],
      });
    });
    res.status(201).json({ success: true, data: { items: ra } });
  } catch (error) {
    next(error);
  }
});

// ─── PATCH /api/v1/class-schedule/:id ─────────────────────────────
router.patch('/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new AppError('id không hợp lệ', 400, 'INVALID_ID');

    // Lấy bản đang lưu TRƯỚC: vừa để chắc nó là của người gọi, vừa để so giờ
    // khi client chỉ gửi lên MỘT trong hai đầu.
    const cu = await prisma.classSchedule.findFirst({ where: { id, userId: req.userId! } });
    if (!cu) throw new AppError('Không tìm thấy buổi học', 404, 'NOT_FOUND');

    const data = kiem(req.body ?? {}, false);
    const batDau = (data.startTime as string) ?? cu.startTime;
    const ketThuc = (data.endTime as string) ?? cu.endTime;
    if (phut(ketThuc) <= phut(batDau)) {
      throw new AppError('Giờ kết thúc phải sau giờ bắt đầu', 400, 'INVALID_RANGE');
    }

    const item = await prisma.classSchedule.update({ where: { id }, data: data as any });
    res.json({ success: true, data: { item } });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/v1/class-schedule/:id ────────────────────────────
router.delete('/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new AppError('id không hợp lệ', 400, 'INVALID_ID');
    // deleteMany kèm userId chứ không delete theo id: `delete` với id của
    // người khác vẫn xoá được nếu quên lọc, và lỗi đó không bao giờ lộ ra
    // trong lúc thử với tài khoản của chính mình.
    const { count } = await prisma.classSchedule.deleteMany({ where: { id, userId: req.userId! } });
    if (count === 0) throw new AppError('Không tìm thấy buổi học', 404, 'NOT_FOUND');
    res.json({ success: true, data: { deleted: id } });
  } catch (error) {
    next(error);
  }
});

export default router;
