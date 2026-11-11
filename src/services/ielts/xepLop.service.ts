/**
 * Lưu / đọc kết quả XẾP LỚP đầu vào IELTS (bảng `ielts_xep_lop`) — 12/11/2026.
 * Luật: máy chủ tự tính lại từ số thô (`xepLop.ts`), không tin tap/ngay web gửi; làm lại sau
 * `IELTS_XEP_LOP_CHO_NGAY` (mặc định 30) ngày; kết quả mới chỉ ĐẨY LÊN vị trí hiệu lực, không kéo xuống.
 */
import { laAdmin } from '../pro.service.js';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError } from '../../middleware/errorHandler.js';
import { xepLopChiTiet, viTriXaHon, type DauVaoXepLop } from './xepLop.js';

const CHO_NGAY = () => Math.max(0, Number(process.env.IELTS_XEP_LOP_CHO_NGAY ?? 30) || 0);
const MS_NGAY = 86_400_000;

const docSo = (x: unknown, max: number, ten: string): number | undefined => {
  if (x == null || x === '') return undefined;
  const v = Number(x);
  if (!Number.isFinite(v) || v < 0 || v > max) throw new BadRequestError(`${ten} phải là số 0–${max}`);
  return v;
};

type DongXepLop = {
  id: number; deId: string | null; sangLoc: number; nghe: number | null; doc: number | null; viet: number | null; noi: number | null;
  overall: number | null; tap: number; ngay: number; tapHieuLuc: number; ngayHieuLuc: number; lyDo: unknown; duongOnKem: unknown; createdAt: Date;
};
const CHON = { id: true, deId: true, sangLoc: true, nghe: true, doc: true, viet: true, noi: true, overall: true, tap: true, ngay: true, tapHieuLuc: true, ngayHieuLuc: true, lyDo: true, duongOnKem: true, createdAt: true } as const;

function choLamLai(gan: DongXepLop | null) {
  const cho = CHO_NGAY();
  if (!gan || cho === 0) return { duocLamLai: true, conLaiNgay: 0, lamLaiTu: null as string | null };
  const tu = new Date(gan.createdAt.getTime() + cho * MS_NGAY);
  const conLai = Math.max(0, Math.ceil((tu.getTime() - Date.now()) / MS_NGAY));
  return { duocLamLai: conLai === 0, conLaiNgay: conLai, lamLaiTu: tu.toISOString() };
}

/** Vị trí hiệu lực + lịch sử + có được làm lại chưa. */
export async function layXepLop(userId: number) {
  const lichSu = await prisma.ieltsXepLop.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 12, select: CHON });
  const gan = lichSu[0] ?? null;
  return {
    hienHanh: gan ? { tap: gan.tapHieuLuc, ngay: gan.ngayHieuLuc, overall: gan.overall, tuNgay: gan.createdAt, lyDo: gan.lyDo, duongOnKem: gan.duongOnKem } : null,
    lichSu,
    ...choLamLai(gan),
  };
}

/** Tính + lưu một lần làm test đầu vào. Trả vị trí của LẦN NÀY và vị trí HIỆU LỰC (sau luật chỉ đẩy lên). */
export async function luuXepLop(userId: number, b: { sangLoc?: unknown; nghe?: unknown; doc?: unknown; viet?: unknown; noi?: unknown; deId?: unknown }) {
  const vao: DauVaoXepLop = {
    sangLoc: docSo(b.sangLoc, 30, 'sangLoc') ?? -1,
    nghe: docSo(b.nghe, 40, 'nghe'),
    doc: docSo(b.doc, 40, 'doc'),
    viet: docSo(b.viet, 9, 'viet'),
    noi: docSo(b.noi, 9, 'noi'),
  };
  if (vao.sangLoc < 0) throw new BadRequestError('Thiếu sangLoc (số câu đúng / 30)');
  const deId = b.deId == null ? null : String(b.deId).trim().slice(0, 40);
  if (deId && !/^[a-z0-9-]{2,40}$/.test(deId)) throw new BadRequestError('deId không hợp lệ');

  const gan = await prisma.ieltsXepLop.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' }, select: CHON });
  const cho = choLamLai(gan);
  // Admin làm lại bất cứ lúc nào (user 12/11/2026: admin không giới hạn).
  if (!cho.duocLamLai && !(await laAdmin(userId).catch(() => false))) throw new AppError(`Test đầu vào làm lại được sau ${CHO_NGAY()} ngày — còn ${cho.conLaiNgay} ngày nữa.`, 429);

  const kq = xepLopChiTiet(vao);
  const hieuLuc = gan ? viTriXaHon({ tap: gan.tapHieuLuc, ngay: gan.ngayHieuLuc }, kq) : { tap: kq.tap, ngay: kq.ngay };
  const r = await prisma.ieltsXepLop.create({
    data: {
      userId, deId, sangLoc: Math.round(vao.sangLoc),
      nghe: vao.nghe == null ? null : Math.round(vao.nghe), doc: vao.doc == null ? null : Math.round(vao.doc),
      viet: kq.band.viet, noi: kq.band.noi, overall: kq.overall,
      tap: kq.tap, ngay: kq.ngay, tapHieuLuc: hieuLuc.tap, ngayHieuLuc: hieuLuc.ngay,
      lyDo: kq.lyDo, duongOnKem: kq.duongOnKem,
    },
    select: { id: true, createdAt: true },
  });
  const giuCu = hieuLuc.tap !== kq.tap || hieuLuc.ngay !== kq.ngay;
  return {
    id: r.id,
    ...kq,
    hieuLuc: { ...hieuLuc, giuCu },
    ...(giuCu ? { ghiChu: `Lần này xếp Tập ${kq.tap} Ngày ${kq.ngay}, thấp hơn vị trí đang học (Tập ${hieuLuc.tap} Ngày ${hieuLuc.ngay}) — giữ nguyên vị trí cũ, kết quả mới chỉ dùng để xem.` } : {}),
    createdAt: r.createdAt,
  };
}
