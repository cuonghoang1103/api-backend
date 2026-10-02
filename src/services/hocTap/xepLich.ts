/**
 * XẾP GIỜ HỌC — đặt từng việc vào một khung giờ cụ thể quanh lịch lớp.
 *
 * Người dùng yêu cầu 02/10/2026: "trên web không có chỗ giờ học các môn cụ thể…
 * kèm thông báo và nhắc nhở % pass nếu tôi không học đúng giờ". Họ ngủ 24h–5h,
 * ngoài giờ lên lớp còn lại để học.
 *
 * Hàm lõi `xepLichThuan` THUẦN (có test): tham lam theo hạn chót → trọng số,
 * mỗi việc vào khung trống sớm nhất kết thúc trước hạn; hết chỗ trước hạn thì
 * vẫn xếp chỗ sớm nhất (sẽ trễ — để tỷ lệ trượt nói thật). Việc "LÊN LỚP"/"REV"
 * đặt ĐÚNG vào slot lớp của môn đó trong ngày hạn.
 *
 * Mọi phút tính theo GIỜ VIỆT NAM (UTC+7), ghi ra Date UTC.
 */
import { prisma } from '../../config/database.js';

const VN = 7 * 3_600_000;
const NGAY = 86_400_000;

export interface KhungLop { thu: number; batDau: string; ketThuc: string; maMon: string } // thu 1=T2…7=CN
export interface ViecXep { id: number; maMon: string; tieuDe: string; hanChot: Date; thoiLuongPhut: number; trongSo: number }
export interface CauHinhXep {
  /** Giờ bắt đầu/kết thúc học mỗi ngày (phút trong ngày, giờ VN). Mặc định 07:00–23:45 (ngủ 24h–5h, chừa sáng). */
  tuPhut?: number; denPhut?: number;
  /** Trần phút tự học mỗi ngày: thường 6h / cuối tuần 11h (người dùng 02/10: "T7, CN nghỉ cả ngày, tranh thủ kín"). */
  tranThuong?: number; tranCuoiTuan?: number;
  /** Nghỉ giữa hai khối (phút). */
  nghi?: number;
  soNgay?: number;
}

const phut = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
/** Ngày VN (00:00 VN, trả mốc UTC) chứa thời điểm t. */
const dauNgayVN = (t: number) => Math.floor((t + VN) / NGAY) * NGAY - VN;
const thuVN = (t: number) => ((new Date(t + VN).getUTCDay() + 6) % 7) + 1;
const laLenLop = (tieuDe: string) => /LÊN LỚP|Buổi REV|slot \d/i.test(tieuDe);

/** Khoảng bận cố định của một ngày (phút VN): lớp (+30' di chuyển), bữa trưa, bữa tối. */
function banTrongNgay(thu: number, lop: KhungLop[]): Array<[number, number]> {
  const ban: Array<[number, number]> = [[11 * 60 + 45, 12 * 60 + 45], [18 * 60 + 30, 19 * 60 + 15]];
  for (const l of lop) if (l.thu === thu) ban.push([phut(l.batDau) - 30, phut(l.ketThuc) + 30]);
  return ban.sort((a, b) => a[0] - b[0]);
}

export function xepLichThuan(
  viec: ViecXep[], lop: KhungLop[], now: Date, ch: CauHinhXep = {},
  /** Khối đã có giờ, giữ nguyên — bộ xếp né chúng (và tính vào trần ngày). */
  coDinh: Array<{ bd: Date; phut: number }> = [],
): Map<number, Date> {
  const tu = ch.tuPhut ?? 7 * 60, den = ch.denPhut ?? 23 * 60 + 45;
  const tranT = ch.tranThuong ?? 360, tranCT = ch.tranCuoiTuan ?? 660, nghi = ch.nghi ?? 10;
  const soNgay = ch.soNgay ?? 70;
  const ketQua = new Map<number, Date>();
  const nowMs = now.getTime() + 5 * 60_000; // chừa 5' để kịp nhận lời nhắc
  const ngay0 = dauNgayVN(nowMs);

  const daChiem = new Map<number, Array<[number, number]>>();
  const daDung = new Map<number, number>();
  const chiem = (ms: number, dai: number) => {
    const d = dauNgayVN(ms);
    const a = Math.round((ms - d) / 60_000);
    const ds = daChiem.get(d) ?? [];
    ds.push([a, a + dai]); daChiem.set(d, ds);
    daDung.set(d, (daDung.get(d) ?? 0) + dai);
  };
  for (const k of coDinh) chiem(k.bd.getTime(), k.phut);

  const ds = [...viec].sort((a, b) => a.hanChot.getTime() - b.hanChot.getTime() || b.trongSo - a.trongSo || a.id - b.id);

  // 1) Việc lên lớp: đúng slot lớp của môn trong ngày hạn (không tính vào trần tự học).
  for (const v of ds.filter((x) => laLenLop(x.tieuDe))) {
    const d = dauNgayVN(v.hanChot.getTime());
    const l = lop.find((x) => x.thu === thuVN(d) && x.maMon.toUpperCase() === v.maMon.toUpperCase());
    if (!l) continue;
    const bd = d + phut(l.batDau) * 60_000;
    if (bd < now.getTime() - 3 * 3_600_000) continue;
    ketQua.set(v.id, new Date(bd));
  }

  // 2) Việc tự học: khung trống SỚM NHẤT. Nếu nó đã trễ hạn thì mọi khung sau
  //    còn trễ hơn — nên khung sớm nhất luôn là lựa chọn đúng.
  for (const v of ds) {
    if (ketQua.has(v.id)) continue;
    const dai = Math.max(5, v.thoiLuongPhut);
    for (let i = 0; i < soNgay; i++) {
      const d = ngay0 + i * NGAY;
      const thu = thuVN(d);
      const tran = thu >= 6 ? tranCT : tranT;
      if ((daDung.get(d) ?? 0) + dai > Math.max(tran, dai)) continue;
      const ban = [...banTrongNgay(thu, lop), ...(daChiem.get(d) ?? [])].sort((a, b) => a[0] - b[0]);
      let t = i === 0 ? Math.max(tu, Math.ceil((nowMs - d) / 60_000 / 5) * 5) : tu;
      for (const [a, b] of ban) {
        if (t + dai <= a) break;
        if (b + nghi > t) t = b + nghi;
      }
      if (t + dai > den) continue;
      const ms = d + t * 60_000;
      chiem(ms, dai);
      ketQua.set(v.id, new Date(ms));
      break;
    }
  }
  return ketQua;
}

/** Lịch lớp của người dùng (ClassSchedule: weekday 2=T2 … 8=CN) → khung cho bộ xếp. */
export async function lichLopCua(userId: number): Promise<Array<KhungLop & { phong: string | null; slot: number | null }>> {
  const rows = await prisma.classSchedule.findMany({ where: { userId }, select: { weekday: true, startTime: true, endTime: true, subject: true, room: true, slot: true } });
  return rows.map((r) => ({ thu: r.weekday - 1, batDau: r.startTime, ketThuc: r.endTime, maMon: r.subject.trim(), phong: r.room, slot: r.slot }));
}

/**
 * Xếp lại giờ cho mọi việc CHƯA BẮT ĐẦU (chưa làm hoặc chưa đạt) của kỳ đang học.
 * `chiViecChuaCoGio`: chỉ xếp việc mới (không có giờ) — dùng khi mở trang.
 */
export async function xepLich(userId: number, opts: { chiViecChuaCoGio?: boolean; now?: Date } = {}) {
  const now = opts.now ?? new Date();
  const viec = await prisma.nhiemVuHoc.findMany({
    where: { userId, trangThai: { in: ['CHUA_LAM', 'CHUA_DAT'] }, batDauLuc: null, mon: { hocKy: { dangHoc: true } } },
    select: { id: true, tieuDe: true, hanChot: true, thoiLuongPhut: true, trongSo: true, gioBatDau: true, mon: { select: { maMon: true } } },
  });
  if (!viec.length) return 0;
  // Việc đã có giờ ở TƯƠNG LAI và không yêu cầu xếp hết ⇒ giữ nguyên, nhưng vẫn chiếm chỗ.
  // Chế độ "chỉ việc chưa có giờ": KHÔNG đụng việc đã quá giờ — chỉ cron `nhacGioHoc`
  // được dời chúng, sau khi đã ghi nhận "bỏ lỡ" (không thì mở trang là né được phạt).
  const giu = opts.chiViecChuaCoGio ? viec.filter((v) => v.gioBatDau && v.gioBatDau > now) : [];
  const canXep = opts.chiViecChuaCoGio ? viec.filter((v) => !v.gioBatDau) : viec;
  if (!canXep.length) return 0;
  const lop = await lichLopCua(userId);
  const kq = xepLichThuan(
    canXep.map((v) => ({ id: v.id, maMon: v.mon.maMon, tieuDe: v.tieuDe, hanChot: v.hanChot, thoiLuongPhut: v.thoiLuongPhut, trongSo: v.trongSo })),
    lop, now, {}, giu.map((v) => ({ bd: v.gioBatDau!, phut: v.thoiLuongPhut })),
  );
  const ghi = canXep.filter((v) => kq.has(v.id)).map((v) =>
    prisma.nhiemVuHoc.update({ where: { id: v.id }, data: { gioBatDau: kq.get(v.id)!, daNhacLuc: null } }));
  for (let i = 0; i < ghi.length; i += 50) await prisma.$transaction(ghi.slice(i, i + 50));
  return ghi.length;
}
