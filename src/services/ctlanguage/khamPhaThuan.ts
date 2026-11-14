/**
 * CT Language — phần THUẦN của "khám phá" (Đợt C) + sự kiện tháng (Đợt E), 14/11/2026. Không CSDL, không mạng ⇒ test
 * được bằng `npx tsx --test src/services/ctlanguage/khamPhaThuan.test.ts`.
 *
 *   · ngày VN, kiểm số liệu hoạt động app gửi (`kiemHoatDong`);
 *   · trạm nhiệm vụ: kiểu trạm, kiểm đầu vào admin (`kiemTram`), tính tiến độ từ số liệu (`tinhTram`);
 *   · sự kiện MẶC ĐỊNH của tháng (`suKienMacDinh`) — máy chủ tự tạo khi chưa có sự kiện nào đang chạy.
 */
import { BadRequestError } from '../../middleware/errorHandler.js';

export const NN_KP = ['en', 'ja', 'zh'] as const;
export type NnKP = (typeof NN_KP)[number];

const VN_MS = 7 * 3600_000;

/** 'YYYY-MM-DD' theo giờ Việt Nam. */
export function ngayVn(luc: Date = new Date()): string {
  return new Date(luc.getTime() + VN_MS).toISOString().slice(0, 10);
}

/** 'YYYY-MM-DD' ⇒ Date 00:00 UTC (kiểu `@db.Date` của Prisma). Sai dạng ⇒ null. */
export function docNgay(s: unknown): Date | null {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s ? null : d;
}

export const congNgay = (s: string, n: number) => new Date(docNgay(s)!.getTime() + n * 86_400_000).toISOString().slice(0, 10);

// ─── Số liệu hoạt động app gửi ───────────────────────────────────────────────────────────────────────────────────
/** Trần mỗi ngày: 16 giờ học, 3000 thẻ, 50 đề — vượt là số bịa, cắt về trần (không báo lỗi để app cũ không kẹt). */
export const TRAN_NGAY = { giay: 16 * 3600, theOn: 3000, thi: 50 } as const;
/** Ngày nhận: hôm nay (VN) ± 1 (lệch múi giờ) và tối đa 7 ngày trước (app gửi bù khi vừa đăng nhập / mất mạng). */
export const NGAY_LUI_TOI_DA = 7;

export interface MucHoatDong { nn: NnKP; ngay: string; giay: number; theOn: number; thi: number }

const soNguyen = (v: unknown, tran: number) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n > 0 ? Math.min(n, tran) : 0;
};

/** `{ muc: [{nn, ngay, giay, theOn, thi}] }` (≤ 24 mục) ⇒ các mục hợp lệ; mục ngoài khoảng ngày bị BỎ QUA im lặng. */
export function kiemHoatDong(than: unknown, homNay = ngayVn()): MucHoatDong[] {
  const ds = (than && typeof than === 'object' && Array.isArray((than as { muc?: unknown }).muc)) ? (than as { muc: unknown[] }).muc : null;
  if (!ds) throw new BadRequestError('Thiếu danh sách hoạt động.', 'CTL_KP_HOAT_DONG');
  if (ds.length > 24) throw new BadRequestError('Gửi tối đa 24 mục mỗi lần.', 'CTL_KP_HOAT_DONG');
  const som = congNgay(homNay, -NGAY_LUI_TOI_DA), muon = congNgay(homNay, 1);
  const ra = new Map<string, MucHoatDong>();
  for (const x of ds) {
    if (!x || typeof x !== 'object') continue;
    const o = x as Record<string, unknown>;
    if (!(NN_KP as readonly string[]).includes(String(o.nn))) continue;
    const ngay = typeof o.ngay === 'string' && docNgay(o.ngay) ? o.ngay : null;
    if (!ngay || ngay < som || ngay > muon) continue;
    const m: MucHoatDong = { nn: o.nn as NnKP, ngay, giay: soNguyen(o.giay, TRAN_NGAY.giay), theOn: soNguyen(o.theOn, TRAN_NGAY.theOn), thi: soNguyen(o.thi, TRAN_NGAY.thi) };
    if (!m.giay && !m.theOn && !m.thi) continue;
    const k = `${m.nn}|${m.ngay}`, cu = ra.get(k);
    ra.set(k, cu ? { ...m, giay: Math.max(cu.giay, m.giay), theOn: Math.max(cu.theOn, m.theOn), thi: Math.max(cu.thi, m.thi) } : m);
  }
  return [...ra.values()];
}

// ─── Trạm nhiệm vụ của sự kiện ───────────────────────────────────────────────────────────────────────────────────
/**
 * Kiểu trạm và nguồn số liệu:
 *   chuoi-hoc  — chuỗi ngày LIÊN TIẾP dài nhất có ≥ 5 phút học (ctl_hoat_dong_ngay.giay, app đo)
 *   phut-hoc   — tổng phút học
 *   on-the     — tổng thẻ đã ôn (app đếm mỗi lần chấm thẻ)
 *   goi-ai     — số cuộc gọi CuongMini (MÁY CHỦ đếm ở lượt mở đầu)
 *   cong-dong  — mỗi bài đăng = 3 điểm, mỗi câu trả lời = 1 điểm (bài/trả lời chưa bị gỡ)
 *   bai-ai     — số bài học AI đã làm xong quiz
 *   thi-thu    — số đề thi thử đã nộp (app báo — chỉ đặt trạm này khi màn thi đã gửi số)
 */
export const LOAI_TRAM = ['chuoi-hoc', 'phut-hoc', 'on-the', 'goi-ai', 'cong-dong', 'bai-ai', 'thi-thu'] as const;
export type LoaiTram = (typeof LOAI_TRAM)[number];
export const GIAY_NGAY_HOC = 300;

export interface Tram { ma: string; loai: LoaiTram; muc: number; ten: string; bieuTuong: string }

const TEN_TRAM: Record<LoaiTram, (m: number) => string> = {
  'chuoi-hoc': (m) => `Học ${m} ngày liên tiếp`,
  'phut-hoc': (m) => `Học tổng ${m} phút`,
  'on-the': (m) => `Ôn ${m} thẻ từ`,
  'goi-ai': (m) => `Gọi CuongMini ${m} lần`,
  'cong-dong': (m) => (m % 3 === 0 ? `Đăng ${m / 3} bài hoặc trả lời ${m} câu ở Cộng đồng` : `Góp ${m} điểm ở Cộng đồng (bài +3, trả lời +1)`),
  'bai-ai': (m) => `Học xong ${m} bài học AI`,
  'thi-thu': (m) => `Làm ${m} đề thi thử`,
};
const BIEU_TUONG_TRAM: Record<LoaiTram, string> = {
  'chuoi-hoc': 'flame.fill', 'phut-hoc': 'clock.fill', 'on-the': 'rectangle.stack.fill', 'goi-ai': 'phone.fill',
  'cong-dong': 'person.3.fill', 'bai-ai': 'sparkles', 'thi-thu': 'checkmark.seal.fill',
};
const TRAN_MUC: Record<LoaiTram, number> = { 'chuoi-hoc': 31, 'phut-hoc': 6000, 'on-the': 20000, 'goi-ai': 200, 'cong-dong': 300, 'bai-ai': 100, 'thi-thu': 100 };

/** Kiểm + chuẩn hoá danh sách trạm (admin gửi hoặc đọc từ CSDL). Ném 400 khi sai. */
export function kiemTram(v: unknown): Tram[] {
  if (!Array.isArray(v) || v.length < 1 || v.length > 10) throw new BadRequestError('Sự kiện cần 1–10 trạm.', 'CTL_SK_TRAM');
  const daCo = new Set<string>();
  return v.map((x, i) => {
    const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
    const loai = String(o.loai) as LoaiTram;
    if (!(LOAI_TRAM as readonly string[]).includes(loai)) throw new BadRequestError(`Trạm ${i + 1}: loại "${String(o.loai)}" không hỗ trợ.`, 'CTL_SK_TRAM');
    const muc = Math.floor(Number(o.muc));
    if (!Number.isFinite(muc) || muc < 1 || muc > TRAN_MUC[loai]) throw new BadRequestError(`Trạm ${i + 1}: mức phải từ 1 tới ${TRAN_MUC[loai]}.`, 'CTL_SK_TRAM');
    let ma = typeof o.ma === 'string' && /^[a-z0-9-]{1,40}$/.test(o.ma) ? o.ma : `${loai}-${muc}`;
    while (daCo.has(ma)) ma = `${ma}-${i}`;
    daCo.add(ma);
    const ten = typeof o.ten === 'string' && o.ten.trim() ? o.ten.trim().slice(0, 80) : TEN_TRAM[loai](muc);
    return { ma, loai, muc, ten, bieuTuong: BIEU_TUONG_TRAM[loai] };
  });
}

/** Số liệu của MỘT người trong khoảng sự kiện (khamPha.ts gom từ CSDL). */
export interface SoLieuSuKien {
  /** giây học theo ngày (cộng mọi ngôn ngữ của sự kiện), khoá 'YYYY-MM-DD' */
  giayTheoNgay: Record<string, number>;
  theOn: number; goi: number; thi: number;
  soBai: number; soTraLoi: number; baiAiXong: number;
}

/** Chuỗi ngày liên tiếp DÀI NHẤT có ≥ `GIAY_NGAY_HOC` giây. */
export function chuoiDaiNhat(giayTheoNgay: Record<string, number>): number {
  const ngay = Object.keys(giayTheoNgay).filter((k) => giayTheoNgay[k]! >= GIAY_NGAY_HOC && docNgay(k)).sort();
  let tot = 0, dang = 0, truoc: string | null = null;
  for (const n of ngay) {
    dang = truoc && congNgay(truoc, 1) === n ? dang + 1 : 1;
    tot = Math.max(tot, dang);
    truoc = n;
  }
  return tot;
}

export function giaTriTram(loai: LoaiTram, s: SoLieuSuKien): number {
  switch (loai) {
    case 'chuoi-hoc': return chuoiDaiNhat(s.giayTheoNgay);
    case 'phut-hoc': return Math.floor(Object.values(s.giayTheoNgay).reduce((a, b) => a + b, 0) / 60);
    case 'on-the': return s.theOn;
    case 'goi-ai': return s.goi;
    case 'cong-dong': return s.soBai * 3 + s.soTraLoi;
    case 'bai-ai': return s.baiAiXong;
    case 'thi-thu': return s.thi;
  }
}

export interface TienDoTram extends Tram { hienTai: number; xong: boolean }

export function tinhTram(tram: Tram[], s: SoLieuSuKien, soTramCan: number | null) {
  const ds: TienDoTram[] = tram.map((t) => {
    const v = giaTriTram(t.loai, s);
    return { ...t, hienTai: Math.min(v, t.muc), xong: v >= t.muc };
  });
  const can = Math.min(ds.length, Math.max(1, soTramCan ?? ds.length));
  const daXong = ds.filter((t) => t.xong).length;
  // Thanh tiến độ: trung bình phần trăm của các trạm (trạm vượt mức tính 100 %).
  const phanTram = ds.length ? Math.round((ds.reduce((a, t) => a + Math.min(1, t.hienTai / t.muc), 0) / ds.length) * 100) : 0;
  return { tram: ds, daXong, can, xong: daXong >= can, phanTram };
}

// ─── Trang phục thưởng (app: `TrangPhucGau` rawValue) ─────────────────────────────────────────────────────────────
export const TRANG_PHUC_SU_KIEN = ['skLaPhong', 'skMuNoel', 'skHuyChuong'] as const;
export type TrangPhucSuKien = (typeof TRANG_PHUC_SU_KIEN)[number];

/** Sự kiện mặc định của tháng chứa `luc` (giờ VN): mã `thang-YYYY-MM`, chạy trọn tháng. Thưởng trang phục theo mùa. */
export function suKienMacDinh(luc: Date = new Date()) {
  const vn = new Date(luc.getTime() + VN_MS);
  const nam = vn.getUTCFullYear(), thang = vn.getUTCMonth() + 1;
  const batDau = new Date(Date.UTC(nam, thang - 1, 1) - VN_MS);
  const ketThuc = new Date(Date.UTC(nam, thang, 1) - VN_MS);
  const soNgay = Math.round((ketThuc.getTime() - batDau.getTime()) / 86_400_000);
  const trangPhuc: TrangPhucSuKien = thang === 11 ? 'skLaPhong' : thang === 12 ? 'skMuNoel' : 'skHuyChuong';
  const tenDo = { skLaPhong: 'Lá phong mùa thu', skMuNoel: 'Mũ Noel', skHuyChuong: 'Huy chương thử thách' }[trangPhuc];
  const tram = kiemTram([
    { ma: 'chuoi-7', loai: 'chuoi-hoc', muc: 7 },
    { ma: 'on-200', loai: 'on-the', muc: 200 },
    { ma: 'goi-3', loai: 'goi-ai', muc: 3 },
    { ma: 'cong-dong-3', loai: 'cong-dong', muc: 3 },
    { ma: 'bai-ai-2', loai: 'bai-ai', muc: 2 },
    { ma: 'phut-240', loai: 'phut-hoc', muc: 240 },
  ]);
  return {
    ma: `thang-${nam}-${String(thang).padStart(2, '0')}`,
    tieuDe: `Thử thách ${soNgay} ngày tháng ${thang}`,
    moTa: `Hoàn thành ${tram.length} trạm trong tháng ${thang} để mở trang phục độc quyền "${tenDo}" cho bạn đồng hành. `
      + 'Tiến độ cộng cả ba ngôn ngữ; cần đăng nhập để máy chủ ghi nhận.',
    nn: null as string | null,
    batDau, ketThuc, tram, soTramCan: null as number | null, trangPhuc, thuongProNgay: 0,
  };
}

/** Kiểm thân admin tạo/sửa sự kiện. `mot` = sửa một phần (chỉ kiểm trường có gửi). */
export function kiemSuKienAdmin(b: Record<string, unknown>, mot = false) {
  const ra: Record<string, unknown> = {};
  const co = (k: string) => b[k] !== undefined;
  const can = (k: string) => { if (!mot && !co(k)) throw new BadRequestError(`Thiếu "${k}".`, 'CTL_SK_SAI'); return co(k); };
  if (can('ma')) {
    if (typeof b.ma !== 'string' || !/^[a-z0-9-]{3,60}$/.test(b.ma)) throw new BadRequestError('Mã: 3–60 ký tự a-z, 0-9, "-".', 'CTL_SK_SAI');
    ra.ma = b.ma;
  }
  if (can('tieuDe')) {
    const t = String(b.tieuDe ?? '').trim();
    if (t.length < 3 || t.length > 120) throw new BadRequestError('Tiêu đề 3–120 ký tự.', 'CTL_SK_SAI');
    ra.tieuDe = t;
  }
  if (co('moTa') || !mot) ra.moTa = String(b.moTa ?? '').trim().slice(0, 2000);
  if (co('nn')) {
    if (b.nn !== null && !(NN_KP as readonly string[]).includes(String(b.nn))) throw new BadRequestError('nn: en | ja | zh | null.', 'CTL_SK_SAI');
    ra.nn = b.nn;
  }
  for (const k of ['batDau', 'ketThuc'] as const) {
    if (can(k)) {
      const d = new Date(String(b[k]));
      if (Number.isNaN(d.getTime())) throw new BadRequestError(`${k} không phải ngày giờ hợp lệ.`, 'CTL_SK_SAI');
      ra[k] = d;
    }
  }
  if (ra.batDau && ra.ketThuc && (ra.ketThuc as Date) <= (ra.batDau as Date)) throw new BadRequestError('Kết thúc phải sau bắt đầu.', 'CTL_SK_SAI');
  if (can('tram')) ra.tram = kiemTram(b.tram);
  if (co('soTramCan')) {
    const n = b.soTramCan === null ? null : Math.floor(Number(b.soTramCan));
    if (n !== null && (!Number.isFinite(n) || n < 1 || n > 10)) throw new BadRequestError('soTramCan 1–10 hoặc null.', 'CTL_SK_SAI');
    ra.soTramCan = n;
  }
  if (can('trangPhuc')) {
    if (!(TRANG_PHUC_SU_KIEN as readonly string[]).includes(String(b.trangPhuc))) {
      throw new BadRequestError(`Trang phục phải là một trong: ${TRANG_PHUC_SU_KIEN.join(', ')}.`, 'CTL_SK_SAI');
    }
    ra.trangPhuc = b.trangPhuc;
  }
  if (co('thuongProNgay')) {
    const n = Math.floor(Number(b.thuongProNgay));
    if (!Number.isFinite(n) || n < 0 || n > 31) throw new BadRequestError('thuongProNgay 0–31.', 'CTL_SK_SAI');
    ra.thuongProNgay = n;
  }
  if (co('bat')) ra.bat = b.bat === true;
  return ra;
}
