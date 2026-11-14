/**
 * CT Language — SỰ KIỆN THÁNG (Đợt E, 14/11/2026): một sự kiện đang chạy, các trạm nhiệm vụ, thanh tiến độ, thưởng
 * TRANG PHỤC Gấu độc quyền. Không thưởng tiền; thưởng Pro chỉ khi admin đặt `thuongProNgay > 0` VÀ env
 * `CTL_SU_KIEN_THUONG_PRO=1` (mặc định tắt — tránh dính quy định khuyến mãi).
 *
 * Chưa có sự kiện nào đang chạy ⇒ tự tạo sự kiện mặc định của tháng (`suKienMacDinh`, mã `thang-YYYY-MM`) — tắt bằng env
 * `CTL_SU_KIEN_TU_TAO=0`. Admin tắt sự kiện mặc định (bat=false) thì nó KHÔNG được tạo lại (trùng mã).
 * Tiến độ tính lúc đọc từ dữ liệu thật (ctl_hoat_dong_ngay · ctl_bai · ctl_tra_loi · ctl_bai_ai_hoc), không lưu riêng.
 */
import type { CtlSuKien, Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { grantProToUser } from '../pro.service.js';
import { kiemSuKienAdmin, kiemTram, ngayVn, suKienMacDinh, tinhTram, type SoLieuSuKien, type Tram } from './khamPhaThuan.js';

type DongSuKien = CtlSuKien;

async function damBaoMacDinh(luc: Date) {
  if (process.env.CTL_SU_KIEN_TU_TAO === '0') return;
  const m = suKienMacDinh(luc);
  await prisma.ctlSuKien.createMany({
    data: [{ ...m, tram: m.tram as unknown as object }], skipDuplicates: true,
  });
}

async function dangChay(nn: string | null, luc = new Date()): Promise<DongSuKien[]> {
  const where = {
    bat: true, batDau: { lte: luc }, ketThuc: { gt: luc },
    ...(nn ? { OR: [{ nn: null }, { nn }] } : {}),
  };
  let ds = await prisma.ctlSuKien.findMany({ where, orderBy: [{ ketThuc: 'asc' }, { id: 'asc' }], take: 3 });
  if (!ds.length) {
    await damBaoMacDinh(luc);
    ds = await prisma.ctlSuKien.findMany({ where, orderBy: [{ ketThuc: 'asc' }, { id: 'asc' }], take: 3 });
  }
  return ds;
}

async function soLieu(userId: number, sk: DongSuKien): Promise<SoLieuSuKien> {
  const ngayTu = new Date(`${ngayVn(sk.batDau)}T00:00:00.000Z`);
  const ngayDen = new Date(`${ngayVn(new Date(sk.ketThuc.getTime() - 1))}T00:00:00.000Z`);
  const nn = sk.nn ? { nn: sk.nn } : {};
  const [hd, soBai, soTraLoi, baiAiXong] = await Promise.all([
    prisma.ctlHoatDongNgay.findMany({ where: { userId, ...nn, ngay: { gte: ngayTu, lte: ngayDen } }, select: { ngay: true, giay: true, theOn: true, goi: true, thi: true } }),
    prisma.ctlBai.count({ where: { userId, ...nn, anLuc: null, createdAt: { gte: sk.batDau, lt: sk.ketThuc } } }),
    prisma.ctlTraLoi.count({ where: { userId, laAi: false, anLuc: null, createdAt: { gte: sk.batDau, lt: sk.ketThuc }, ...(sk.nn ? { bai: { nn: sk.nn } } : {}) } }),
    prisma.ctlBaiAiHoc.count({ where: { userId, xongLuc: { gte: sk.batDau, lt: sk.ketThuc }, ...(sk.nn ? { bai: { nn: sk.nn } } : {}) } }),
  ]);
  const giayTheoNgay: Record<string, number> = {};
  let theOn = 0, goi = 0, thi = 0;
  for (const r of hd) {
    const k = r.ngay.toISOString().slice(0, 10);
    giayTheoNgay[k] = (giayTheoNgay[k] ?? 0) + r.giay;
    theOn += r.theOn; goi += r.goi; thi += r.thi;
  }
  return { giayTheoNgay, theOn, goi, thi, soBai, soTraLoi, baiAiXong };
}

const SO_LIEU_RONG: SoLieuSuKien = { giayTheoNgay: {}, theOn: 0, goi: 0, thi: 0, soBai: 0, soTraLoi: 0, baiAiXong: 0 };

async function trinhBay(sk: DongSuKien, userId: number | null) {
  const tram = kiemTram(sk.tram as unknown) as Tram[];
  const [s, nhan, soNguoiNhan] = await Promise.all([
    userId ? soLieu(userId, sk) : Promise.resolve(SO_LIEU_RONG),
    userId ? prisma.ctlSuKienThuong.findUnique({ where: { suKienId_userId: { suKienId: sk.id, userId } }, select: { createdAt: true } }) : null,
    prisma.ctlSuKienThuong.count({ where: { suKienId: sk.id } }),
  ]);
  const td = tinhTram(tram, s, sk.soTramCan);
  return {
    id: sk.id, ma: sk.ma, tieuDe: sk.tieuDe, moTa: sk.moTa, nn: sk.nn,
    batDau: sk.batDau.toISOString(), ketThuc: sk.ketThuc.toISOString(),
    conNgay: Math.max(0, Math.ceil((sk.ketThuc.getTime() - Date.now()) / 86_400_000)),
    thuong: { trangPhuc: sk.trangPhuc, proNgay: thuongProBat() ? sk.thuongProNgay : 0 },
    ...td, daNhan: !!nhan, soNguoiNhan, daDangNhap: !!userId,
  };
}

const thuongProBat = () => process.env.CTL_SU_KIEN_THUONG_PRO === '1';

/** Các sự kiện đang chạy (thường là một) + tiến độ của người xem (khách: tiến độ 0, vẫn xem được trạm). */
export async function suKienHienTai(nnGoc: unknown, userId: number | null) {
  const nn = nnGoc === 'en' || nnGoc === 'ja' || nnGoc === 'zh' ? nnGoc : null;
  const ds = await dangChay(nn);
  return { items: await Promise.all(ds.map((sk) => trinhBay(sk, userId))) };
}

/** Nhận thưởng: kiểm đủ trạm ở MÁY CHỦ rồi ghi (mỗi người một lần). Thưởng Pro chỉ khi cờ env bật. */
export async function nhanThuong(userId: number, id: number) {
  const sk = await prisma.ctlSuKien.findUnique({ where: { id } });
  if (!sk || !sk.bat) throw new NotFoundError('Không tìm thấy sự kiện.');
  const bayGio = new Date();
  // Cho nhận muộn 3 ngày sau khi sự kiện kết thúc (xong trạm cuối lúc 23:59 vẫn kịp bấm).
  if (bayGio < sk.batDau || bayGio.getTime() > sk.ketThuc.getTime() + 3 * 86_400_000) throw new AppError('Sự kiện không còn mở nhận thưởng.', 409, 'CTL_SK_HET');
  const td = tinhTram(kiemTram(sk.tram as unknown), await soLieu(userId, sk), sk.soTramCan);
  if (!td.xong) throw new AppError(`Bạn mới xong ${td.daXong}/${td.can} trạm — cố thêm chút nữa nhé!`, 409, 'CTL_SK_CHUA_XONG');
  const proNgay = thuongProBat() ? sk.thuongProNgay : 0;
  const r = await prisma.ctlSuKienThuong.createMany({ data: [{ suKienId: id, userId, trangPhuc: sk.trangPhuc, proNgay }], skipDuplicates: true });
  if (r.count && proNgay > 0) {
    try { await grantProToUser(userId, proNgay, 'ADMIN'); } catch (e) {
      logger.error('[ctl-su-kien] cấp Pro thưởng lỗi', { userId, id, error: (e as Error).message });
    }
  }
  return { trangPhuc: sk.trangPhuc, proNgay: r.count ? proNgay : 0, moi: r.count > 0 };
}

/** Mọi trang phục sự kiện người này đã nhận (app mở khoá, kể cả máy mới cài lại). */
export async function thuongCuaToi(userId: number) {
  const ds = await prisma.ctlSuKienThuong.findMany({ where: { userId }, select: { trangPhuc: true, suKienId: true, createdAt: true } });
  return { trangPhuc: [...new Set(ds.map((d) => d.trangPhuc))], items: ds.map((d) => ({ ...d, createdAt: d.createdAt.toISOString() })) };
}

// ─── Admin ───────────────────────────────────────────────────────────────────────────────────────────────────────
export async function adminDsSuKien() {
  const ds = await prisma.ctlSuKien.findMany({ orderBy: { batDau: 'desc' }, take: 60, include: { _count: { select: { thuong: true } } } });
  return { items: ds.map(({ _count, ...s }) => ({ ...s, soNguoiNhan: _count.thuong })), thuongProBat: thuongProBat() };
}

export async function adminTaoSuKien(b: Record<string, unknown>) {
  const d = kiemSuKienAdmin(b) as unknown as Prisma.CtlSuKienCreateInput;
  try { return await prisma.ctlSuKien.create({ data: d }); } catch (e) {
    if ((e as { code?: string }).code === 'P2002') throw new BadRequestError('Mã sự kiện đã có.', 'CTL_SK_TRUNG_MA');
    throw e;
  }
}

export async function adminSuaSuKien(id: number, b: Record<string, unknown>) {
  const cu = await prisma.ctlSuKien.findUnique({ where: { id } });
  if (!cu) throw new NotFoundError('Không tìm thấy sự kiện.');
  const d = kiemSuKienAdmin(b, true);
  const batDau = (d.batDau as Date | undefined) ?? cu.batDau, ketThuc = (d.ketThuc as Date | undefined) ?? cu.ketThuc;
  if (ketThuc <= batDau) throw new BadRequestError('Kết thúc phải sau bắt đầu.', 'CTL_SK_SAI');
  return prisma.ctlSuKien.update({ where: { id }, data: d });
}
