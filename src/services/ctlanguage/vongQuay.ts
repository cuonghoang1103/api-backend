/**
 * CT Language — VÒNG QUAY MAY MẮN (16/11/2026). Luật + tỉ lệ: `vongQuayThuan.ts`. Tuyến: `routes/ctlanguage.vongQuay.routes.ts`.
 *
 * Máy chủ là nơi phán quyết LƯỢT + QUÀ (cài lại app không reset được lượt, đổi giờ máy không quay thêm được):
 *   · điều kiện "đạt mục tiêu" đọc phút học hôm nay ở `ctl_hoat_dong_ngay` (app gửi tổng ngày) so với `minutesPerDay` của
 *     hồ sơ học; "chuỗi" = ngày có hoạt động (`ctl_hoat_dong_ngay` hoặc ngày học của sổ tay `ctl_so_tu_muc`) liên tiếp
 *     tới hôm nay (giờ VN);
 *   · quà bốc bằng `crypto.randomInt`, ghi một dòng `ctl_vong_quay` — unique (user, ngày, nguồn, stt) ⇒ bấm hai lần cùng
 *     lúc không thành hai lượt.
 * Quà là đồ trong app; xu + đồ Tủ đồ nằm TRÊN MÁY (`KhoTuDoCTL`) nên app cộng vào máy theo `id` lượt (một lần).
 */
import { randomInt } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { dsChan, TAC_GIA_SONG } from './congDong.js';
import { congNgay, docNgay, ngayVn } from './khamPhaThuan.js';
import {
  anTen, chonQua, chuoiDenHomNay, conChoThemLuot, datMucTieu, QUA_DANG_KHOE, QUA_VONG_QUAY, tinhLuot,
  type LuotDaDung, type MaQua,
} from './vongQuayThuan.js';

const quaCua = (ma: string) => QUA_VONG_QUAY.find((q) => q.ma === ma);
const viTri = (ma: string) => QUA_VONG_QUAY.findIndex((q) => q.ma === ma);

type Dong = { id: number; qua: string; xu: number; nguon: string; createdAt: Date };
const lichSuGon = (r: Dong) => ({
  id: r.id, qua: r.qua, viTri: viTri(r.qua), nhan: quaCua(r.qua)?.nhan ?? r.qua, xu: r.xu, nguon: r.nguon, luc: r.createdAt.toISOString(),
});

/** Điều kiện lượt của hôm nay: phút học, mục tiêu, chuỗi. */
async function dieuKien(userId: number, homNay: string) {
  const tu = docNgay(congNgay(homNay, -120))!;
  const [hoatDong, soTu, hoSo] = await Promise.all([
    prisma.ctlHoatDongNgay.findMany({
      where: { userId, ngay: { gte: tu } }, select: { nn: true, ngay: true, giay: true, theOn: true, thi: true, goi: true },
    }),
    prisma.ctlSoTuMuc.findMany({ where: { userId, loai: 'ngay', xoa: false, khoa: { gte: congNgay(homNay, -120) } }, select: { khoa: true } }),
    prisma.ctLanguageProfile.findUnique({ where: { userId }, select: { activeLang: true, langs: true } }),
  ]);
  const ngayHoc = new Set<string>(soTu.map((s) => s.khoa));
  const giayHomNay: Record<string, number> = {};
  for (const r of hoatDong) {
    const k = r.ngay.toISOString().slice(0, 10);
    if (r.giay >= 60 || r.theOn > 0 || r.thi > 0 || r.goi > 0) ngayHoc.add(k);
    if (k === homNay) giayHomNay[r.nn] = (giayHomNay[r.nn] ?? 0) + r.giay;
  }
  const mucTieu: Record<string, number> = {};
  const langs = (hoSo?.langs && typeof hoSo.langs === 'object' ? hoSo.langs : {}) as Record<string, { minutesPerDay?: unknown }>;
  for (const [nn, l] of Object.entries(langs)) {
    const p = Number(l?.minutesPerDay);
    if (Number.isFinite(p) && p > 0) mucTieu[nn] = p;
  }
  const nnChinh = hoSo?.activeLang ?? 'en';
  const mt = datMucTieu(giayHomNay, mucTieu, nnChinh);
  return { datMucTieu: mt.dat, phutHomNay: mt.phut, mucTieu: mt.mucTieu, chuoi: chuoiDenHomNay(ngayHoc, homNay) };
}

async function daDungHomNay(userId: number, homNay: string): Promise<LuotDaDung[]> {
  return prisma.ctlVongQuay.findMany({ where: { userId, ngay: docNgay(homNay)! }, select: { nguon: true, stt: true, qua: true } });
}

async function luotCua(userId: number, homNay: string) {
  const [dk, daDung] = await Promise.all([dieuKien(userId, homNay), daDungHomNay(userId, homNay)]);
  const tt = tinhLuot(daDung, dk);
  return { con: tt.con, chiTiet: tt.chiTiet, phutHomNay: dk.phutHomNay, mucTieu: dk.mucTieu, chuoi: dk.chuoi };
}

/** "Vừa nhận": quà đáng khoe trong 3 ngày của người thật đang hoạt động, bỏ người chặn nhau + người tự ẩn khỏi xếp hạng. */
async function ganDay(xem: number | null) {
  const chan = await dsChan(xem);
  const ds = await prisma.ctlVongQuay.findMany({
    where: {
      qua: { in: [...QUA_DANG_KHOE] }, createdAt: { gte: new Date(Date.now() - 3 * 86_400_000) },
      ...(chan.length ? { userId: { notIn: chan } } : {}),
      user: { ...TAC_GIA_SONG, ctlXepHangAn: { is: null } },
    },
    orderBy: { createdAt: 'desc' }, take: 12,
    select: { qua: true, createdAt: true, user: { select: { displayName: true, fullName: true, username: true } } },
  });
  return ds.map((r) => ({
    ten: anTen(r.user.displayName || r.user.fullName || r.user.username), qua: r.qua, nhan: quaCua(r.qua)?.nhan ?? r.qua,
    luc: r.createdAt.toISOString(),
  }));
}

/** GET — khách xem được bánh xe, thể lệ, dòng "vừa nhận"; đã đăng nhập thì kèm lượt + lịch sử của mình. */
export async function trangThaiVongQuay(userId: number | null) {
  const homNay = ngayVn();
  const qua = QUA_VONG_QUAY.map((q) => ({ ma: q.ma, nhan: q.nhan, xu: q.xu, tiLe: q.tiLe }));
  const [vuaNhan, luot, lichSu] = await Promise.all([
    ganDay(userId),
    userId ? luotCua(userId, homNay) : Promise.resolve(null),
    userId
      ? prisma.ctlVongQuay.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 30, select: { id: true, qua: true, xu: true, nguon: true, createdAt: true } })
      : Promise.resolve([] as Dong[]),
  ]);
  return { daDangNhap: Boolean(userId), homNay, qua, luot, lichSu: lichSu.map(lichSuGon), vuaNhan };
}

/** POST — dùng một lượt. Hết lượt ⇒ 409 CTL_VQ_HET_LUOT. */
export async function quayVongQuay(userId: number) {
  const homNay = ngayVn();
  for (let lan = 0; lan < 3; lan++) {
    const [dk, daDung] = await Promise.all([dieuKien(userId, homNay), daDungHomNay(userId, homNay)]);
    const tt = tinhLuot(daDung, dk);
    if (!tt.tiep) {
      throw new AppError('Hôm nay bạn đã dùng hết lượt quay — học đủ mục tiêu ngày để có thêm lượt, hoặc quay lại ngày mai nhé.', 409, 'CTL_VQ_HET_LUOT');
    }
    const i = chonQua(randomInt(0, 1_000_000_000) / 1_000_000_000, conChoThemLuot(daDung));
    const q = QUA_VONG_QUAY[i]!;
    try {
      const r = await prisma.ctlVongQuay.create({
        data: { userId, ngay: docNgay(homNay)!, nguon: tt.tiep.nguon, stt: tt.tiep.stt, qua: q.ma as MaQua, xu: q.xu },
        select: { id: true, qua: true, xu: true, nguon: true, createdAt: true },
      });
      return { quay: lichSuGon(r), luot: await luotCua(userId, homNay) };
    } catch (e) {
      // Hai lượt bấm cùng lúc giành cùng (nguồn, stt) ⇒ tính lại rồi thử lượt kế tiếp (nếu còn).
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') continue;
      throw e;
    }
  }
  throw new AppError('Vòng quay đang bận — thử lại sau giây lát nhé.', 409, 'CTL_VQ_BAN');
}
