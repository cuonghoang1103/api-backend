/**
 * VIỆC CÁ NHÂN + "HÔM NAY" / "TUẦN" gộp (24/11/2026) — cho CT Work → Của tôi → Học tập & Lịch và lệnh `/hoc` của
 * CuongMini (MCP `hoc_tap`).
 *
 * Việc cá nhân KHÔNG thuộc môn, KHÔNG chấm, KHÔNG tính vào tỷ lệ trượt — người dùng tự đánh dấu xong. Việc HỌC vẫn đi
 * nguyên đường cũ của /hoc-tap (luật "không tự tích" giữ nguyên, file này không chạm trạng thái việc học).
 * Mọi mốc ngày theo giờ VN (UTC+7) như phần còn lại của hocTap.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { homNayVN, tongQuan } from './hocTap.service.js';
import { xepLich } from './xepLich.js';

const NGAY = 86_400_000;
const VN = 7 * 3_600_000;

// ─── Thuần (có test) ─────────────────────────────────────────────

/** 'YYYY-MM-DD' của ngày VN chứa thời điểm `t`. */
export function ngayVNChuoi(t: Date): string {
  return homNayVN(t).toISOString().slice(0, 10);
}

/** 'YYYY-MM-DD' ⇒ Date 00:00 UTC (kiểu cột DATE). Sai định dạng ⇒ null. */
export function docNgay(s: string | null | undefined): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s ? null : d;
}

export interface ViecCaNhanVao {
  tieuDe?: string;
  ghiChu?: string | null;
  /** ISO đầy đủ (có múi giờ) hoặc null để bỏ giờ. */
  gioBatDau?: string | null;
  /** 'YYYY-MM-DD' (giờ VN). */
  ngay?: string | null;
  thoiLuongPhut?: number;
}

export interface ViecCaNhanChuan {
  tieuDe: string;
  ghiChu: string | null;
  gioBatDau: Date | null;
  ngay: Date;
  thoiLuongPhut: number;
}

/**
 * Chuẩn hoá một việc cá nhân. Có giờ ⇒ `ngay` = ngày VN của giờ đó (bỏ qua `ngay` gửi kèm, tránh lệch). Không giờ,
 * không ngày ⇒ hôm nay. Thời lượng 5–600 phút (như việc học).
 */
export function chuanHoaViecCaNhan(v: ViecCaNhanVao, now = new Date(), cu?: Partial<ViecCaNhanChuan>): ViecCaNhanChuan {
  const tieuDe = String(v.tieuDe ?? cu?.tieuDe ?? '').trim();
  if (!tieuDe) throw new BadRequestError('Thiếu tên việc');
  let gio: Date | null = cu?.gioBatDau ?? null;
  if (v.gioBatDau !== undefined) {
    if (v.gioBatDau === null || v.gioBatDau === '') gio = null;
    else {
      gio = new Date(v.gioBatDau);
      if (Number.isNaN(gio.getTime())) throw new BadRequestError('Giờ bắt đầu không hợp lệ');
    }
  }
  let ngay: Date | null = cu?.ngay ?? null;
  if (v.ngay !== undefined && v.ngay !== null && v.ngay !== '') {
    ngay = docNgay(v.ngay);
    if (!ngay) throw new BadRequestError('Ngày phải dạng YYYY-MM-DD');
  }
  if (gio) ngay = homNayVN(gio);
  if (!ngay) ngay = homNayVN(now);
  const phut = Math.round(Number(v.thoiLuongPhut ?? cu?.thoiLuongPhut ?? 30));
  return {
    tieuDe: tieuDe.slice(0, 255),
    ghiChu: v.ghiChu !== undefined ? (v.ghiChu ? String(v.ghiChu).slice(0, 4000) : null) : (cu?.ghiChu ?? null),
    gioBatDau: gio,
    ngay,
    thoiLuongPhut: Math.min(Math.max(Number.isFinite(phut) ? phut : 30, 5), 600),
  };
}

// ─── DB ──────────────────────────────────────────────────────────

export type ViecCaNhanRa = {
  id: number; tieuDe: string; ghiChu: string | null; gioBatDau: Date | null; ngay: string; thoiLuongPhut: number;
  xong: boolean; xongLuc: Date | null; quaHan: boolean;
};

function ra(v: { id: number; tieuDe: string; ghiChu: string | null; gioBatDau: Date | null; ngay: Date | null; thoiLuongPhut: number; xongLuc: Date | null }, now = new Date()): ViecCaNhanRa {
  const ngay = (v.ngay ?? homNayVN(v.gioBatDau ?? now)).toISOString().slice(0, 10);
  return {
    id: v.id, tieuDe: v.tieuDe, ghiChu: v.ghiChu, gioBatDau: v.gioBatDau, ngay, thoiLuongPhut: v.thoiLuongPhut,
    xong: !!v.xongLuc, xongLuc: v.xongLuc, quaHan: !v.xongLuc && ngay < ngayVNChuoi(now),
  };
}

async function cuaToi(userId: number, id: number) {
  const v = await prisma.viecCaNhan.findFirst({ where: { id, userId } });
  if (!v) throw new NotFoundError('Không tìm thấy việc cá nhân');
  return v;
}

export async function taoViecCaNhan(userId: number, b: ViecCaNhanVao, now = new Date()): Promise<ViecCaNhanRa> {
  const dem = await prisma.viecCaNhan.count({ where: { userId, xongLuc: null } });
  if (dem >= 500) throw new BadRequestError('Đã có 500 việc cá nhân chưa xong — đánh dấu xong hoặc xoá bớt trước.');
  const c = chuanHoaViecCaNhan(b, now);
  return ra(await prisma.viecCaNhan.create({ data: { userId, ...c } }), now);
}

export async function suaViecCaNhan(userId: number, id: number, b: ViecCaNhanVao, now = new Date()): Promise<ViecCaNhanRa> {
  const cu = await cuaToi(userId, id);
  const c = chuanHoaViecCaNhan(b, now, { ...cu, ngay: cu.ngay ?? undefined });
  const doiGio = (c.gioBatDau?.getTime() ?? null) !== (cu.gioBatDau?.getTime() ?? null);
  return ra(await prisma.viecCaNhan.update({ where: { id }, data: { ...c, ...(doiGio ? { daNhacLuc: null } : {}) } }), now);
}

export async function danhDauXong(userId: number, id: number, xong: boolean, now = new Date()): Promise<ViecCaNhanRa> {
  await cuaToi(userId, id);
  return ra(await prisma.viecCaNhan.update({ where: { id }, data: { xongLuc: xong ? now : null } }), now);
}

export async function xoaViecCaNhan(userId: number, id: number): Promise<void> {
  await cuaToi(userId, id);
  await prisma.viecCaNhan.delete({ where: { id } });
}

/** Việc trong khoảng ngày VN [tu, den] (gồm cả hai đầu). `tonDong`: thêm việc CHƯA XONG của các ngày trước `tu`. */
export async function dsViecCaNhan(userId: number, q: { tu: string; den: string; tonDong?: boolean }, now = new Date()): Promise<ViecCaNhanRa[]> {
  const tu = docNgay(q.tu), den = docNgay(q.den);
  if (!tu || !den) throw new BadRequestError('"tu"/"den" phải dạng YYYY-MM-DD');
  if (den < tu) throw new BadRequestError('"den" phải sau "tu"');
  if ((den.getTime() - tu.getTime()) / NGAY > 120) throw new BadRequestError('Tối đa 120 ngày một lần');
  const rows = await prisma.viecCaNhan.findMany({
    where: {
      userId,
      OR: [
        { ngay: { gte: tu, lte: den } },
        ...(q.tonDong ? [{ ngay: { lt: tu }, xongLuc: null }] : []),
      ],
    },
    orderBy: [{ ngay: 'asc' }, { gioBatDau: 'asc' }, { id: 'asc' }],
    take: 1000,
  });
  return rows.map((r) => ra(r, now));
}

// ─── Gộp cho trang + CLI ─────────────────────────────────────────

/** Hôm nay: việc học (của bộ xếp lịch) + lớp + việc cá nhân (gồm việc cá nhân tồn chưa xong). */
export async function homNayGop(userId: number, now = new Date()) {
  const tq = await tongQuan(userId, now);
  const hn = ngayVNChuoi(now);
  const caNhan = await dsViecCaNhan(userId, { tu: hn, den: hn, tonDong: true }, now);
  const homNayLich = tq.lich?.[0];
  return {
    ngay: hn,
    hocKy: tq.hocKy ? { ten: tq.hocKy.ten, tuan: tq.tuan, soTuan: tq.hocKy.soTuan, tuanThi: tq.hocKy.tuanThi } : null,
    ruiRoKy: tq.ruiRoKy,
    lop: homNayLich?.lop ?? [],
    hoc: tq.homNay,
    quaHan: tq.quaHan,
    choCham: tq.choCham.length,
    caNhan,
    mon: tq.mon.map((m) => ({ id: m.id, maMon: m.maMon, ten: m.ten, tyLeTruot: m.ruiRo.tyLe, mucDo: m.ruiRo.mucDo, tienDo: m.ruiRo.tienDo, kyVong: m.ruiRo.kyVong, thiSapToi: m.thiSapToi })),
  };
}

/** 7 ngày kể từ hôm nay: lớp + khối tự học đã xếp giờ (từ tongQuan) + việc cá nhân theo ngày. */
export async function tuanGop(userId: number, now = new Date()) {
  const tq = await tongQuan(userId, now);
  const hn = ngayVNChuoi(now);
  const cuoi = new Date(homNayVN(now).getTime() + 6 * NGAY).toISOString().slice(0, 10);
  const caNhan = await dsViecCaNhan(userId, { tu: hn, den: cuoi }, now);
  const ngays = Array.from({ length: 7 }, (_, i) => new Date(homNayVN(now).getTime() + i * NGAY));
  return {
    hocKy: tq.hocKy ? { ten: tq.hocKy.ten, tuan: tq.tuan, soTuan: tq.hocKy.soTuan } : null,
    ngay: ngays.map((d, i) => {
      const ymd = d.toISOString().slice(0, 10);
      const l = tq.lich?.[i];
      return {
        ngay: ymd,
        thu: ((d.getUTCDay() + 6) % 7) + 1,
        lop: l?.lop ?? [],
        hoc: l?.viec ?? [],
        caNhan: caNhan.filter((v) => v.ngay === ymd),
      };
    }),
  };
}

/**
 * Việc cá nhân có giờ chồng lên khối tự học đã xếp ⇒ xếp lại lịch học (bộ xếp né khung cá nhân). Không chồng thì
 * thôi — không làm xáo lịch người dùng đã kéo tay.
 */
export async function xepLaiNeuChong(userId: number, gio: Date | null, phut: number): Promise<void> {
  if (!gio) return;
  const dau = gio.getTime(), cuoi = dau + phut * 60_000;
  const hoc = await prisma.nhiemVuHoc.findMany({
    where: { userId, trangThai: { in: ['CHUA_LAM', 'CHUA_DAT'] }, batDauLuc: null, gioBatDau: { gte: new Date(dau - 10 * 3_600_000), lt: new Date(cuoi) } },
    select: { gioBatDau: true, thoiLuongPhut: true },
  });
  if (hoc.some((h) => h.gioBatDau!.getTime() + h.thoiLuongPhut * 60_000 > dau)) await xepLich(userId).catch(() => 0);
}

/** Cron 5 phút (cùng `nhacGioHoc`): nhắc việc cá nhân có giờ, 5' trước. Không bao giờ ném. */
export async function nhacViecCaNhan(now = new Date()): Promise<number> {
  try {
    const { guiThongBao } = await import('../push/apns.js');
    const ds = await prisma.viecCaNhan.findMany({
      where: { xongLuc: null, daNhacLuc: null, gioBatDau: { gte: new Date(now.getTime() - 60_000), lte: new Date(now.getTime() + 6 * 60_000) } },
      take: 500,
    });
    for (const v of ds) {
      const gio = new Date(v.gioBatDau!.getTime() + VN).toISOString().slice(11, 16);
      await guiThongBao(v.userId, { tieuDe: `⏰ ${gio} — việc cá nhân`, than: `${v.tieuDe} (${v.thoiLuongPhut} phút).`, duLieu: { url: '/work/hoc-tap', viecCaNhanId: v.id }, nhom: 'hoc-tap' });
      await prisma.viecCaNhan.update({ where: { id: v.id }, data: { daNhacLuc: now } });
    }
    return ds.length;
  } catch {
    return 0;
  }
}
