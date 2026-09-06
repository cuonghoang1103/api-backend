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
  chu('meetUrl', 500);
  chu('materialsUrl', 500);
  if (b.note !== undefined) ra.note = b.note === null ? null : String(b.note);

  // Slot FAP 0..12. Nhận `null` để bỏ slot khi người dùng chuyển sang giờ tự do.
  if (b.slot !== undefined) {
    if (b.slot === null) { ra.slot = null; }
    else {
      const n = Number(b.slot);
      if (!Number.isInteger(n) || n < 0 || n > 12) {
        throw new AppError('"slot" phải từ 0 tới 12', 400, 'INVALID_SLOT');
      }
      ra.slot = n;
    }
  }

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

    /*
     * Kèm SỐ BUỔI VẮNG của từng buổi học, ngay trong lời gọi này.
     *
     * Đây là con số quyết định đỗ/trượt (nghỉ quá 4 buổi = không qua môn), nên
     * nó phải hiện cùng lúc với lịch — bắt app gọi thêm một vòng nữa nghĩa là
     * có một khoảnh khắc lịch đã hiện mà cảnh báo thì chưa, và người dùng nhìn
     * đúng vào lúc đó.
     *
     * 'phep' (vắng có phép) KHÔNG tính vào số buổi nghỉ: trường vẫn trừ, nhưng
     * người dùng cần phân biệt được hai loại, và gộp lại thì con số mất nghĩa.
     */
    const dem = await prisma.classAttendance.groupBy({
      by: ['scheduleId'],
      where: { userId, status: 'vang', scheduleId: { in: items.map((i) => i.id) } },
      _count: { _all: true },
    });
    const bang = new Map(dem.map((d) => [d.scheduleId, d._count._all]));

    res.json({
      success: true,
      data: { items: items.map((i) => ({ ...i, soBuoiVang: bang.get(i.id) ?? 0 })) },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/class-schedule/attendance ────────────────────────
// Điểm danh trong một khoảng ngày. App gọi cho ĐÚNG tuần đang xem, không tải
// cả kỳ: một kỳ 15 tuần × 20 buổi là 300 dòng cho một bảng hiện 7 cột.
router.get('/attendance', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const tu = String(req.query.tu ?? '');
    const den = String(req.query.den ?? '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tu) || !/^\d{4}-\d{2}-\d{2}$/.test(den)) {
      throw new AppError('tu/den phai la YYYY-MM-DD', 400);
    }
    const items = await prisma.classAttendance.findMany({
      where: {
        userId,
        date: { gte: new Date(`${tu}T00:00:00.000Z`), lte: new Date(`${den}T00:00:00.000Z`) },
      },
      orderBy: [{ date: 'asc' }, { id: 'asc' }],
    });
    res.json({ success: true, data: { items } });
  } catch (error) { next(error); }
});

// ─── PUT /api/v1/class-schedule/:id/attendance ────────────────────
// Chấm điểm danh cho MỘT buổi. `upsert` theo (buổi học, ngày) — bấm lại là
// SỬA, không phải thêm dòng mới. Không có nó thì bấm nhầm rồi bấm lại là số
// buổi nghỉ đếm gấp đôi, mà đó là con số quyết định đỗ/trượt.
//
// `status: null` ⇒ XOÁ bản ghi, tức "chưa chấm". Cần có: người dùng chấm nhầm
// một buổi chưa diễn ra thì phải gỡ được, chứ không phải chọn bừa một trạng thái.
router.put('/:id/attendance', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = req.userId!;
    const scheduleId = Number(req.params.id);
    if (!Number.isInteger(scheduleId) || scheduleId <= 0) throw new AppError('id khong hop le', 400);

    const body = req.body as { date?: string; status?: string | null; note?: string | null };
    const ngay = String(body.date ?? '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) throw new AppError('date phai la YYYY-MM-DD', 400);
    const date = new Date(`${ngay}T00:00:00.000Z`);

    /* Buổi học phải thuộc về người gọi. Thiếu chốt này thì một client thù địch
       chấm điểm danh lên lịch của người khác bằng cách đoán id. */
    const cua = await prisma.classSchedule.findFirst({
      where: { id: scheduleId, userId }, select: { id: true },
    });
    if (!cua) throw new AppError('Buoi hoc khong ton tai hoac khong thuoc ve ban', 404);

    if (body.status === null || body.status === '') {
      await prisma.classAttendance.deleteMany({ where: { scheduleId, date } });
      res.json({ success: true, data: null });
      return;
    }

    const status = String(body.status ?? '');
    if (!['co', 'vang', 'phep'].includes(status)) {
      throw new AppError('status phai la co|vang|phep', 400);
    }
    const note = body.note === undefined ? undefined : (body.note || null);

    const row = await prisma.classAttendance.upsert({
      where: { scheduleId_date: { scheduleId, date } },
      create: { userId, scheduleId, date, status, note: note ?? null },
      update: { status, ...(note === undefined ? {} : { note }) },
    });
    res.json({ success: true, data: row });
  } catch (error) { next(error); }
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
//
// ⚠️ `thayThe: true` XOÁ LUÔN ĐIỂM DANH. `ClassAttendance.schedule` khai
// `onDelete: Cascade`, nên xoá buổi là xoá mọi lần đã chấm của buổi đó —
// chính con số quyết định đỗ/trượt môn, và không có gì trên màn hình báo.
// Chấp nhận được khi vào KỲ MỚI (lịch sử nghỉ của kỳ cũ hết ý nghĩa); KHÔNG
// chấp nhận được khi người dùng chỉ sửa giờ một buổi. Vì thế bảng soạn lịch
// của app (`SoanLich.tsx`) để `thayThe: false` và sửa bằng `PATCH /:id` để
// giữ nguyên id.
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
