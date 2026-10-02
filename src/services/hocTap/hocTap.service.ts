/**
 * HUẤN LUYỆN HỌC KỲ (/hoc-tap) — dữ liệu, tổng quan, nộp bài, chấm tay.
 *
 * Luật chống tự gian lận (người dùng yêu cầu 02/10/2026): người học KHÔNG có
 * đường nào tự đặt trạng thái `DAT`. Chỉ ba nơi được chấm:
 *   • AI (`chamBangChung.ts`) sau khi đọc bằng chứng,
 *   • Claude Code gọi bằng token cá nhân `ctw_…` (nguoiCham = CLAUDE),
 *   • không có nút chấm tay trên web — kể cả admin, vì chủ web cũng là người học.
 * Kế hoạch: docs/hoc-tap-coach-plan.md
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { AN_HAN_MS, tinhRuiRoKy, tinhRuiRoMon, tuanDaQua, tuanHienTai, type KetQuaRuiRo, type ViecTinh } from './ruiRo.js';
import { lichLopCua, xepLich } from './xepLich.js';

export const LOAI_VIEC = ['NEN_TANG', 'BAI_HOC', 'BAI_TAP', 'LAB', 'QUIZ', 'PE', 'FE', 'ON_TAP', 'GHI_CHU'] as const;
export type LoaiViec = (typeof LOAI_VIEC)[number];
export type NguoiCham = 'AI' | 'CLAUDE';

/** Hết ngày theo giờ Việt Nam (UTC+7) của ngày `d` (UTC 00:00) ⇒ 16:59:59 UTC. */
export function cuoiNgayVN(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 16, 59, 59));
}

/** Ngày (UTC 00:00) đang là "hôm nay" ở Việt Nam. */
export function homNayVN(now = new Date()): Date {
  const vn = new Date(now.getTime() + 7 * 3_600_000);
  return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()));
}

/** Hạn của (tuần, thứ) trong kỳ — thứ 1 = thứ Hai … 7 = Chủ nhật. */
export function hanCua(batDau: Date, tuan: number, thu: number): Date {
  const d = new Date(batDau);
  d.setUTCDate(d.getUTCDate() + (tuan - 1) * 7 + (Math.min(Math.max(thu, 1), 7) - 1));
  return cuoiNgayVN(d);
}

export async function kyDangHoc(userId: number) {
  return prisma.hocKy.findFirst({ where: { userId, dangHoc: true }, orderBy: { batDau: 'desc' } });
}

async function monCuaToi(userId: number, monId: number) {
  const mon = await prisma.monHocKy.findFirst({ where: { id: monId, userId }, include: { hocKy: true } });
  if (!mon) throw new NotFoundError('Không tìm thấy môn');
  return mon;
}

export async function viecCuaToi(userId: number, viecId: number) {
  const v = await prisma.nhiemVuHoc.findFirst({ where: { id: viecId, userId }, include: { mon: { include: { hocKy: true } } } });
  if (!v) throw new NotFoundError('Không tìm thấy việc');
  return v;
}

// ─── Tỷ lệ trượt ─────────────────────────────────────────────────

type ViecDb = Prisma.NhiemVuHocGetPayload<{ include: { bangChung: { select: { nopTre: true } } } }>;

function sangViecTinh(v: ViecDb): ViecTinh {
  return {
    trongSo: v.trongSo,
    hanChot: v.hanChot,
    trangThai: v.trangThai,
    loai: v.loai,
    diem: v.diem,
    soLanTre: v.bangChung.filter((b) => b.nopTre).length,
    boLo: !!v.daBaoTreLuc,
  };
}

export interface MonTongQuan {
  id: number;
  maMon: string;
  ten: string;
  mau: string | null;
  courseSlug: string | null;
  trinhDo: string | null;
  mucTieu: string | null;
  nenTang: unknown;
  ruiRo: KetQuaRuiRo;
  tongViec: number;
  datViec: number;
  choCham: number;
  viecKeTiep: { id: number; tieuDe: string; hanChot: Date; thoiLuongPhut: number; loai: string } | null;
  thiSapToi: { loai: string; ngay: Date; batDau: string; conNgay: number } | null;
}

export async function tongQuan(userId: number, now = new Date()) {
  const hocKy = await kyDangHoc(userId);
  if (!hocKy) return { hocKy: null, tuan: 0, mon: [], ruiRoKy: { tyLe: 0, mucDo: 'xanh' as const }, homNay: [], quaHan: [], choCham: [], lich: [] };

  // Việc mới (chưa có giờ) ⇒ xếp giờ ngay, để mục "Lịch học" không bao giờ thiếu việc.
  await xepLich(userId, { chiViecChuaCoGio: true, now }).catch(() => 0);
  const tuanQua = tuanDaQua(hocKy.batDau, hocKy.soTuan, now);
  const tuan = tuanHienTai(hocKy.batDau, hocKy.soTuan, now);
  const mons = await prisma.monHocKy.findMany({
    where: { userId, hocKyId: hocKy.id },
    orderBy: [{ thuTu: 'asc' }, { id: 'asc' }],
    include: { nhiemVu: { include: { bangChung: { select: { nopTre: true } } }, orderBy: [{ hanChot: 'asc' }, { thuTu: 'asc' }] } },
  });
  const thi = await prisma.lichThi.findMany({ where: { userId, ngay: { gte: homNayVN(now) } }, orderBy: { ngay: 'asc' } });

  const mon: MonTongQuan[] = mons.map((m) => {
    const ruiRo = tinhRuiRoMon(m.nhiemVu.map(sangViecTinh), tuanQua, hocKy.tuanThi, now);
    const keTiep = m.nhiemVu.find((v) => v.trangThai !== 'DAT' && v.trangThai !== 'CHO_CHAM') ?? null;
    const t = thi.find((x) => (x.maMon ?? '').toUpperCase() === m.maMon.toUpperCase());
    return {
      id: m.id,
      maMon: m.maMon,
      ten: m.ten,
      mau: m.mau,
      courseSlug: m.courseSlug,
      trinhDo: m.trinhDo,
      mucTieu: m.mucTieu,
      nenTang: m.nenTang,
      ruiRo,
      tongViec: m.nhiemVu.length,
      datViec: m.nhiemVu.filter((v) => v.trangThai === 'DAT').length,
      choCham: m.nhiemVu.filter((v) => v.trangThai === 'CHO_CHAM').length,
      viecKeTiep: keTiep && { id: keTiep.id, tieuDe: keTiep.tieuDe, hanChot: keTiep.hanChot, thoiLuongPhut: keTiep.thoiLuongPhut, loai: keTiep.loai },
      thiSapToi: t ? { loai: t.loai, ngay: t.ngay, batDau: t.batDau, conNgay: Math.round((t.ngay.getTime() - homNayVN(now).getTime()) / 86_400_000) } : null,
    };
  });

  const tatCa = mons.flatMap((m) => m.nhiemVu.map((v) => ({ ...v, maMon: m.maMon, mau: m.mau })));
  const cuoiHomNay = cuoiNgayVN(homNayVN(now));
  const gon = (v: (typeof tatCa)[number]) => ({
    id: v.id, monId: v.monId, maMon: v.maMon, mau: v.mau, tieuDe: v.tieuDe, loai: v.loai, hanChot: v.hanChot,
    thoiLuongPhut: v.thoiLuongPhut, trangThai: v.trangThai, batDauLuc: v.batDauLuc, diem: v.diem, tuan: v.tuan,
    gioBatDau: v.gioBatDau, boLo: !!v.daBaoTreLuc,
  });
  const chuaXong = (v: (typeof tatCa)[number]) => v.trangThai !== 'DAT' && v.trangThai !== 'CHO_CHAM';
  const quaHan = tatCa.filter((v) => chuaXong(v) && v.hanChot.getTime() + AN_HAN_MS < now.getTime()).map(gon);
  const homNay = tatCa
    .filter((v) => chuaXong(v) && v.hanChot.getTime() + AN_HAN_MS >= now.getTime() && (v.hanChot <= cuoiHomNay || v.trangThai === 'DANG_LAM' || (v.gioBatDau !== null && v.gioBatDau <= cuoiHomNay)))
    .sort((a, b) => (a.gioBatDau?.getTime() ?? a.hanChot.getTime()) - (b.gioBatDau?.getTime() ?? b.hanChot.getTime()))
    .map(gon);
  // Hôm nay trống thì kéo 3 việc gần nhất lên — một màn hình "không có gì làm"
  // ở tuần 4 là lời nói dối nguy hiểm nhất mục này có thể nói.
  if (!homNay.length) homNay.push(...tatCa.filter((v) => chuaXong(v) && v.hanChot >= now).slice(0, 3).map(gon));
  const choCham = tatCa.filter((v) => v.trangThai === 'CHO_CHAM').map(gon);

  // Lịch 7 ngày: lớp trên trường + khối tự học đã xếp, theo giờ VN.
  const lop = await lichLopCua(userId);
  const homNay0 = homNayVN(now);
  const lich = Array.from({ length: 7 }, (_, i) => {
    const ngay = new Date(homNay0.getTime() + i * 86_400_000);
    const dauUtc = ngay.getTime() - 7 * 3_600_000;
    const thu = ((ngay.getUTCDay() + 6) % 7) + 1;
    return {
      ngay: ngay.toISOString().slice(0, 10),
      thu,
      lop: lop.filter((l) => l.thu === thu).sort((a, b) => a.batDau.localeCompare(b.batDau))
        .map((l) => ({ maMon: l.maMon, batDau: l.batDau, ketThuc: l.ketThuc, phong: l.phong, slot: l.slot })),
      viec: tatCa
        .filter((v) => v.gioBatDau && v.gioBatDau.getTime() >= dauUtc && v.gioBatDau.getTime() < dauUtc + 86_400_000)
        .sort((a, b) => a.gioBatDau!.getTime() - b.gioBatDau!.getTime())
        .map(gon),
    };
  });

  return {
    hocKy: { id: hocKy.id, ten: hocKy.ten, batDau: hocKy.batDau, soTuan: hocKy.soTuan, tuanThi: hocKy.tuanThi },
    tuan,
    tuanQua: Math.round(tuanQua * 10) / 10,
    mon,
    ruiRoKy: tinhRuiRoKy(mon.map((m) => m.ruiRo.tyLe)),
    tienDoKy: mon.length ? Math.round(mon.reduce((s, m) => s + m.ruiRo.tienDo, 0) / mon.length) : 0,
    homNay,
    quaHan,
    choCham,
    lich,
  };
}

// ─── Môn ─────────────────────────────────────────────────────────

const MAU = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#8b5cf6', '#84cc16'];

export async function themMon(userId: number, b: { hocKyId?: number; maMon: string; ten?: string; trinhDo?: string; mucTieu?: string }) {
  const hocKy = b.hocKyId
    ? await prisma.hocKy.findFirst({ where: { id: b.hocKyId, userId } })
    : await kyDangHoc(userId);
  if (!hocKy) throw new BadRequestError('Chưa có kỳ học. Tạo kỳ học (ngày bắt đầu tuần 1) trước.');
  const maMon = b.maMon.trim().toUpperCase();
  if (!/^[A-Z0-9_.-]{2,30}$/i.test(maMon)) throw new BadRequestError('Mã môn không hợp lệ');

  // Gắn khoá Academy cùng mã nếu có — AI soạn kế hoạch từ mục lục của nó.
  const course = await prisma.course.findFirst({
    where: { courseCode: { equals: maMon, mode: 'insensitive' }, semesterId: { not: null } },
    select: { id: true, slug: true, title: true },
  });
  const dem = await prisma.monHocKy.count({ where: { hocKyId: hocKy.id } });
  try {
    return await prisma.monHocKy.create({
      data: {
        userId,
        hocKyId: hocKy.id,
        maMon,
        ten: (b.ten?.trim() || course?.title || maMon).slice(0, 200),
        courseId: course?.id ?? null,
        courseSlug: course?.slug ?? null,
        trinhDo: b.trinhDo?.trim() || null,
        mucTieu: b.mucTieu?.trim().slice(0, 200) || null,
        mau: MAU[dem % MAU.length],
        thuTu: dem,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new AppError('Môn này đã có trong kỳ', 409, 'DUPLICATE');
    throw e;
  }
}

export async function suaMon(userId: number, monId: number, b: { ten?: string; trinhDo?: string | null; mucTieu?: string | null; mau?: string; thuTu?: number }) {
  await monCuaToi(userId, monId);
  return prisma.monHocKy.update({
    where: { id: monId },
    data: {
      ...(b.ten !== undefined && { ten: b.ten.trim().slice(0, 200) }),
      ...(b.trinhDo !== undefined && { trinhDo: b.trinhDo?.trim() || null }),
      ...(b.mucTieu !== undefined && { mucTieu: b.mucTieu?.trim().slice(0, 200) || null }),
      ...(b.mau !== undefined && /^#[0-9a-f]{6}$/i.test(b.mau) && { mau: b.mau }),
      ...(b.thuTu !== undefined && Number.isInteger(b.thuTu) && { thuTu: b.thuTu }),
    },
  });
}

export async function xoaMon(userId: number, monId: number) {
  await monCuaToi(userId, monId);
  await prisma.monHocKy.delete({ where: { id: monId } });
}

export async function chiTietMon(userId: number, monId: number, now = new Date()) {
  const m = await monCuaToi(userId, monId);
  const viec = await prisma.nhiemVuHoc.findMany({
    where: { monId },
    orderBy: [{ tuan: 'asc' }, { hanChot: 'asc' }, { thuTu: 'asc' }],
    include: { bangChung: { orderBy: { lanNop: 'desc' } } },
  });
  const ruiRo = tinhRuiRoMon(
    viec.map((v) => sangViecTinh({ ...v, bangChung: v.bangChung.map((b) => ({ nopTre: b.nopTre })) } as ViecDb)),
    tuanDaQua(m.hocKy.batDau, m.hocKy.soTuan, now),
    m.hocKy.tuanThi,
    now,
  );
  const lichSu = await prisma.ruiRoHocNgay.findMany({ where: { userId, monId }, orderBy: { ngay: 'asc' }, take: 120 });
  return { mon: m, viec, ruiRo, tuan: tuanHienTai(m.hocKy.batDau, m.hocKy.soTuan, now), lichSu };
}

// ─── Việc ────────────────────────────────────────────────────────

export interface ViecMoi {
  tuan: number;
  thu?: number;
  hanChot?: string;
  loai: string;
  tieuDe: string;
  huongDan?: string | null;
  yeuCauBangChung?: string | null;
  lienKet?: string | null;
  thoiLuongPhut?: number;
  trongSo?: number;
}

/** Kiểm + chuẩn hoá một việc (từ AI, từ Claude, từ người học). Hỏng ⇒ trả lý do. */
export function chuanHoaViec(v: ViecMoi, hk: { batDau: Date; soTuan: number }, now: Date): { ok: true; data: Omit<Prisma.NhiemVuHocCreateManyInput, 'userId' | 'monId'> } | { ok: false; lyDo: string } {
  const tieuDe = String(v.tieuDe ?? '').trim();
  if (!tieuDe) return { ok: false, lyDo: 'thiếu tiêu đề' };
  const loai = String(v.loai ?? '').toUpperCase();
  if (!(LOAI_VIEC as readonly string[]).includes(loai)) return { ok: false, lyDo: `loại "${v.loai}" không hợp lệ` };
  let tuan = Math.round(Number(v.tuan));
  if (!Number.isFinite(tuan)) return { ok: false, lyDo: 'tuần không hợp lệ' };
  tuan = Math.min(Math.max(tuan, 1), hk.soTuan);
  let hanChot: Date;
  if (v.hanChot && /^\d{4}-\d{2}-\d{2}/.test(v.hanChot)) hanChot = cuoiNgayVN(new Date(`${v.hanChot.slice(0, 10)}T00:00:00Z`));
  else hanChot = hanCua(hk.batDau, tuan, Number(v.thu ?? 7));
  // Việc bù cho tuần đã qua: không cho tạo ra đã quá hạn sẵn — dời về hết ngày mai.
  if (hanChot < now) hanChot = cuoiNgayVN(new Date(homNayVN(now).getTime() + 86_400_000));
  const phut = Math.round(Number(v.thoiLuongPhut ?? 30));
  const lienKet = v.lienKet ? String(v.lienKet).trim() : null;
  if (lienKet && !/^(https?:\/\/|\/)/.test(lienKet)) return { ok: false, lyDo: 'liên kết phải là URL hoặc đường dẫn /…' };
  return {
    ok: true,
    data: {
      tuan,
      loai,
      tieuDe: tieuDe.slice(0, 255),
      huongDan: v.huongDan ? String(v.huongDan).slice(0, 20_000) : null,
      yeuCauBangChung: v.yeuCauBangChung ? String(v.yeuCauBangChung).slice(0, 4000) : null,
      lienKet: lienKet?.slice(0, 500) ?? null,
      thoiLuongPhut: Math.min(Math.max(Number.isFinite(phut) ? phut : 30, 5), 600),
      hanChot,
      trongSo: Math.min(Math.max(Math.round(Number(v.trongSo ?? 1)) || 1, 1), 10),
    },
  };
}

export async function themViec(userId: number, monId: number, ds: ViecMoi[], nguon: 'AI' | 'CLAUDE' | 'NGUOI_HOC', now = new Date()) {
  const m = await monCuaToi(userId, monId);
  if (!ds.length) throw new BadRequestError('Không có việc nào');
  if (ds.length > 300) throw new BadRequestError('Tối đa 300 việc mỗi lần');
  const dem = await prisma.nhiemVuHoc.count({ where: { monId } });
  const tot: Prisma.NhiemVuHocCreateManyInput[] = [];
  const loi: string[] = [];
  ds.forEach((v, i) => {
    const r = chuanHoaViec(v, m.hocKy, now);
    if (r.ok) tot.push({ ...r.data, userId, monId, nguon, thuTu: dem + i });
    else loi.push(`#${i + 1}: ${r.lyDo}`);
  });
  if (!tot.length) throw new BadRequestError(`Không việc nào hợp lệ — ${loi.slice(0, 5).join('; ')}`);
  await prisma.nhiemVuHoc.createMany({ data: tot });
  return { daThem: tot.length, boQua: loi };
}

/**
 * Người học chỉ sửa được việc CHÍNH MÌNH tạo, và không chạm được trạng thái/điểm.
 * Việc AI/Claude giao thì chỉ người giao (token) sửa — không thì "dời hạn cho đỡ
 * quá hạn" là cách gian lận rẻ nhất.
 */
export async function suaViec(userId: number, viecId: number, b: Partial<ViecMoi>, laNguoiCham: boolean) {
  const v = await viecCuaToi(userId, viecId);
  if (!laNguoiCham && v.nguon !== 'NGUOI_HOC') throw new ForbiddenError('Việc do AI/Claude giao — không tự sửa được. Nhờ AI điều chỉnh kế hoạch.');
  const gop: ViecMoi = {
    tuan: b.tuan ?? v.tuan,
    loai: b.loai ?? v.loai,
    tieuDe: b.tieuDe ?? v.tieuDe,
    huongDan: b.huongDan !== undefined ? b.huongDan : v.huongDan,
    yeuCauBangChung: b.yeuCauBangChung !== undefined ? b.yeuCauBangChung : v.yeuCauBangChung,
    lienKet: b.lienKet !== undefined ? b.lienKet : v.lienKet,
    thoiLuongPhut: b.thoiLuongPhut ?? v.thoiLuongPhut,
    trongSo: b.trongSo ?? v.trongSo,
    hanChot: b.hanChot ?? (b.tuan !== undefined || b.thu !== undefined ? undefined : v.hanChot.toISOString()),
    thu: b.thu,
  };
  const r = chuanHoaViec(gop, v.mon.hocKy, new Date(0));
  if (!r.ok) throw new BadRequestError(r.lyDo);
  return prisma.nhiemVuHoc.update({ where: { id: viecId }, data: r.data });
}

export async function xoaViec(userId: number, viecId: number, laNguoiCham: boolean) {
  const v = await viecCuaToi(userId, viecId);
  if (!laNguoiCham && v.nguon !== 'NGUOI_HOC') throw new ForbiddenError('Việc do AI/Claude giao — không tự xoá được.');
  await prisma.nhiemVuHoc.delete({ where: { id: viecId } });
}

export async function batDauViec(userId: number, viecId: number) {
  const v = await viecCuaToi(userId, viecId);
  if (v.trangThai === 'DAT') throw new BadRequestError('Việc này đã đạt');
  return prisma.nhiemVuHoc.update({
    where: { id: viecId },
    // Bấm lại không reset đồng hồ: không cho "bắt đầu lại" để xoá vết trễ giờ.
    data: { trangThai: v.trangThai === 'CHO_CHAM' ? v.trangThai : 'DANG_LAM', batDauLuc: v.batDauLuc ?? new Date() },
  });
}

export interface TepBangChung { url: string; ten?: string; loai?: string }

export async function nopBangChung(userId: number, viecId: number, b: { noiDung?: string; lienKet?: string[]; tep?: TepBangChung[] }, now = new Date()) {
  const v = await viecCuaToi(userId, viecId);
  if (v.trangThai === 'DAT') throw new BadRequestError('Việc này đã đạt rồi');
  if (v.trangThai === 'CHO_CHAM') throw new BadRequestError('Lần nộp trước đang được chấm — đợi kết quả đã');
  if (v.trangThai === 'VAN_DAP') throw new BadRequestError('Bằng chứng đã đạt — trả lời vấn đáp trước đã');
  const noiDung = (b.noiDung ?? '').trim().slice(0, 30_000);
  const lienKet = (b.lienKet ?? []).map((x) => String(x).trim()).filter((x) => /^https?:\/\//.test(x)).slice(0, 10);
  const tep = (b.tep ?? []).filter((t) => t && /^https?:\/\//.test(t.url)).slice(0, 10)
    .map((t) => ({ url: t.url, ten: (t.ten ?? '').slice(0, 200), loai: (t.loai ?? '').slice(0, 100) }));
  if (!noiDung && !lienKet.length && !tep.length) throw new BadRequestError('Nộp ít nhất một thứ: chữ, link hoặc ảnh/tệp');

  const hetGio = v.batDauLuc ? v.batDauLuc.getTime() + v.thoiLuongPhut * 60_000 * 1.25 : null;
  const nopTre = now.getTime() > v.hanChot.getTime() + AN_HAN_MS || (hetGio !== null && now.getTime() > hetGio);
  const lan = (await prisma.bangChungHoc.count({ where: { nhiemVuId: viecId } })) + 1;
  const [bc] = await prisma.$transaction([
    prisma.bangChungHoc.create({
      data: { userId, nhiemVuId: viecId, lanNop: lan, noiDung: noiDung || null, lienKet: lienKet.length ? lienKet : Prisma.JsonNull, tep: tep.length ? tep : Prisma.JsonNull, nopTre },
    }),
    prisma.nhiemVuHoc.update({ where: { id: viecId }, data: { trangThai: 'CHO_CHAM', nopLuc: now, batDauLuc: v.batDauLuc ?? now } }),
  ]);
  return bc;
}

export interface KetQuaCham {
  dat: boolean;
  diem: number;
  nhanXet: string;
  loiCanSua: string[];
  canCaiThien: string[];
  diemManh?: string[];
}

/** Ghi kết quả chấm vào lần nộp + việc. `dat` chỉ có nghĩa khi điểm ≥ 5 — mã quyết, không phải model. */
export async function ghiKetQua(bangChungId: number, kq: KetQuaCham, nguoiCham: NguoiCham) {
  const bc = await prisma.bangChungHoc.findUnique({ where: { id: bangChungId } });
  if (!bc) throw new NotFoundError('Không tìm thấy lần nộp');
  const diem = Math.round(Math.min(10, Math.max(0, kq.diem)) * 10) / 10;
  const dat = kq.dat && diem >= 5;
  const now = new Date();
  await prisma.$transaction([
    prisma.bangChungHoc.update({
      where: { id: bangChungId },
      data: { ketQua: { ...kq, diem, dat } as unknown as Prisma.InputJsonValue, diem, dat, nguoiCham, chamLuc: now },
    }),
    prisma.nhiemVuHoc.update({
      where: { id: bc.nhiemVuId },
      data: {
        trangThai: dat ? 'DAT' : 'CHUA_DAT',
        diem,
        nhanXet: kq.nhanXet.slice(0, 8000),
        loiCanSua: { loi: kq.loiCanSua, canCaiThien: kq.canCaiThien, diemManh: kq.diemManh ?? [] } as Prisma.InputJsonValue,
        nguoiCham,
        chamLuc: now,
      },
    }),
  ]);
  return { dat, diem };
}

/** Chấm bởi Claude Code (token). Chấm lần nộp mới nhất; chưa nộp gì thì tạo
 *  một lần nộp ghi lại bằng chứng Claude đã xem (`noiDung`). */
export async function chamBoiClaude(userId: number, viecId: number, b: KetQuaCham & { bangChung?: string }) {
  await viecCuaToi(userId, viecId);
  let bc = await prisma.bangChungHoc.findFirst({ where: { nhiemVuId: viecId }, orderBy: { lanNop: 'desc' } });
  if (!bc || bc.chamLuc) {
    const lan = (bc?.lanNop ?? 0) + 1;
    bc = await prisma.bangChungHoc.create({
      data: { userId, nhiemVuId: viecId, lanNop: lan, noiDung: (b.bangChung ?? 'Nộp trực tiếp trong phiên học với Claude Code').slice(0, 30_000) },
    });
  }
  return ghiKetQua(bc.id, b, 'CLAUDE');
}

// ─── Ảnh chụp rủi ro mỗi ngày (cron) ─────────────────────────────

export async function chupRuiRo(userId: number, now = new Date()) {
  const tq = await tongQuan(userId, now);
  if (!tq.hocKy) return 0;
  const ngay = homNayVN(now);
  await prisma.$transaction([
    prisma.ruiRoHocNgay.deleteMany({ where: { userId, ngay } }),
    prisma.ruiRoHocNgay.createMany({
      data: [
        { userId, monId: null, ngay, tyLe: tq.ruiRoKy.tyLe, tienDo: tq.tienDoKy ?? 0 },
        ...tq.mon.map((m) => ({ userId, monId: m.id, ngay, tyLe: m.ruiRo.tyLe, tienDo: m.ruiRo.tienDo, chiTiet: { lyDo: m.ruiRo.lyDo } })),
      ],
    }),
  ]);
  return tq.mon.length;
}

export async function lichSuRuiRo(userId: number, soNgay = 60) {
  const tu = new Date(homNayVN().getTime() - soNgay * 86_400_000);
  return prisma.ruiRoHocNgay.findMany({ where: { userId, ngay: { gte: tu } }, orderBy: { ngay: 'asc' }, select: { monId: true, ngay: true, tyLe: true, tienDo: true } });
}

// ─── Cron 07:00 VN: chụp rủi ro + nhắc việc ──────────────────────

/** Mọi người có kỳ đang học và có ít nhất một môn. Không bao giờ ném. */
export async function chayBuoiSang(now = new Date()) {
  const { guiThongBao } = await import('../push/apns.js');
  const nguoi = await prisma.monHocKy.findMany({ where: { hocKy: { dangHoc: true } }, distinct: ['userId'], select: { userId: true } });
  let dem = 0;
  for (const { userId } of nguoi) {
    try {
      await chupRuiRo(userId, now);
      const tq = await tongQuan(userId, now);
      if (!tq.hocKy) continue;
      const dau = tq.ruiRoKy.mucDo === 'do' ? '🚨' : tq.ruiRoKy.mucDo === 'cam' ? '⚠️' : '📚';
      const body = [
        `Tỷ lệ trượt cả kỳ: ${tq.ruiRoKy.tyLe}%.`,
        tq.quaHan.length ? `${tq.quaHan.length} việc QUÁ HẠN.` : '',
        tq.homNay.length ? `Hôm nay: ${tq.homNay.slice(0, 3).map((v) => `${v.maMon} · ${v.tieuDe}`).join(' | ')}` : '',
      ].filter(Boolean).join(' ');
      await guiThongBao(userId, { tieuDe: `${dau} Tuần ${tq.tuan} — học kỳ`, than: body.slice(0, 230), duLieu: { url: '/hoc-tap' }, nhom: 'hoc-tap' });
      dem++;
    } catch (e) {
      const { logger } = await import('../../utils/logger.js');
      logger.warn('hocTap: buổi sáng lỗi một người', { userId, e: String(e) });
    }
  }
  return dem;
}

/** Người học tự dời GIỜ HỌC (không phải hạn chót — hạn thì không tự đổi được). */
export async function doiGio(userId: number, viecId: number, gio: Date) {
  const v = await viecCuaToi(userId, viecId);
  if (v.trangThai === 'DAT') throw new BadRequestError('Việc này đã đạt');
  if (Number.isNaN(gio.getTime())) throw new BadRequestError('Giờ không hợp lệ');
  return prisma.nhiemVuHoc.update({ where: { id: viecId }, data: { gioBatDau: gio, daNhacLuc: null } });
}

/**
 * Cron 5 phút: nhắc "tới giờ học" (5' trước) và báo "đang trễ" (quá 15' chưa
 * bấm Bắt đầu). Việc bị trễ được ghi `daBaoTreLuc` (tính vào tỷ lệ trượt) rồi
 * XẾP LẠI sang khung trống kế tiếp — lịch luôn còn thật, không thành bãi việc cũ.
 */
export async function nhacGioHoc(now = new Date()) {
  const { guiThongBao } = await import('../push/apns.js');
  const sapToi = await prisma.nhiemVuHoc.findMany({
    where: { trangThai: { in: ['CHUA_LAM', 'CHUA_DAT'] }, batDauLuc: null, daNhacLuc: null, gioBatDau: { gte: new Date(now.getTime() - 60_000), lte: new Date(now.getTime() + 6 * 60_000) } },
    include: { mon: { select: { maMon: true } } },
  });
  for (const v of sapToi) {
    const gio = new Date(v.gioBatDau!.getTime() + 7 * 3_600_000).toISOString().slice(11, 16);
    await guiThongBao(v.userId, { tieuDe: `⏰ ${gio} — ${v.mon.maMon}`, than: `${v.tieuDe} (${v.thoiLuongPhut} phút). Mở Học kỳ → Bắt đầu.`, duLieu: { url: '/hoc-tap', viecId: v.id }, nhom: 'hoc-tap' });
    await prisma.nhiemVuHoc.update({ where: { id: v.id }, data: { daNhacLuc: now } });
  }

  const tre = await prisma.nhiemVuHoc.findMany({
    where: { trangThai: { in: ['CHUA_LAM', 'CHUA_DAT'] }, batDauLuc: null, gioBatDau: { lt: new Date(now.getTime() - 15 * 60_000) } },
    include: { mon: { select: { maMon: true } } },
  });
  const nguoi = new Set<number>();
  for (const v of tre) {
    // Báo một lần cho mỗi lần bỏ lỡ; giữ dấu lần đầu (tính vào rủi ro), rồi xếp lại.
    if (!v.daBaoTreLuc || (v.gioBatDau && v.daBaoTreLuc < v.gioBatDau)) {
      await guiThongBao(v.userId, { tieuDe: `🚨 Bỏ lỡ giờ học — ${v.mon.maMon}`, than: `"${v.tieuDe}" đã trễ 15'. Việc này được dời sang khung sau, và tỷ lệ trượt của môn tăng. Mở Học kỳ để xem.`, duLieu: { url: '/hoc-tap' }, nhom: 'hoc-tap' });
      await prisma.nhiemVuHoc.update({ where: { id: v.id }, data: { daBaoTreLuc: now } });
    }
    nguoi.add(v.userId);
  }
  for (const u of nguoi) {
    await prisma.nhiemVuHoc.updateMany({ where: { userId: u, trangThai: { in: ['CHUA_LAM', 'CHUA_DAT'] }, batDauLuc: null, gioBatDau: { lt: new Date(now.getTime() - 15 * 60_000) } }, data: { gioBatDau: null } });
    await xepLich(u, { chiViecChuaCoGio: true, now }).catch(() => 0);
  }
  return { nhac: sapToi.length, tre: tre.length };
}
