/**
 * CT Language trên web — lời gọi + kiểu dữ liệu của các tuyến CÔNG KHAI mà app iOS dùng (24/11/2026):
 *   /ctlanguage/podcast            — `src/routes/ctlanguage.podcast.routes.ts`
 *   /ctlanguage/tu-vung            — `src/routes/ctlanguage.hocTuVung.routes.ts`
 *   /ctlanguage/so-chuyen-nganh    — `src/routes/ctlanguage.soChuyenNganh.routes.ts`
 *   /ctlanguage/tu-dien/:nn/tra    — tra nhanh (chạm một từ)
 *   /ctlanguage/ngu-phap           — điểm ngữ pháp + quiz (câu ngữ pháp chèn trong phiên học)
 *   /ctlanguage/phat-am            — chấm phát âm (CẦN đăng nhập; app iOS dùng đúng tuyến này)
 * Kiểu khai theo đúng khuôn máy chủ trả (giống struct Codable của app).
 */
import api from '@/lib/api';
import type { CauQuizNguPhap, TomTatNguPhap } from './hocTuVung';
import type { NnCTL } from './soTu';

const lay = async <T,>(duong: string, params?: Record<string, string | number>): Promise<T> =>
  (await api.get(duong, { params })).data.data as T;

// ─── Podcast ──────────────────────────────────────────────────────────────────────────────────────────────────────

export interface TomTatTapPodcast {
  id: string; nn: NnCTL; danhMuc?: string; cap: string; so: number; tieuDe: string; tieuDeViet: string; moTa: string; chuDe: string;
  bieuTuong: string; phut: number; soDong: number; soTu: number; nguoi: string[]; soCachNoi?: number; soNguPhap?: number;
}
export interface DanhMucPodcast { ma: string; ten: string; moTa: string; bieuTuong: string; soTap: number }
export interface DanhSachPodcast {
  tong: number; tongTatCa: number; danhMucDangXem: string; danhMuc: DanhMucPodcast[];
  cap: { nn: NnCTL; cap: string; tap: TomTatTapPodcast[] }[];
}
export interface CachNoiKhac { kieu: string; t: string; doc?: string; v: string; ghiChu?: string }
export interface NguPhapCau { mau: string; giai: string; vd?: string; vdDoc?: string; vdV?: string }
export interface DongPodcast { ai: string; t: string; doc?: string; v: string; khac?: CachNoiKhac[]; np?: NguPhapCau[] }
export interface TuPodcast { chu: string; doc?: string; nghia: string; vd?: string }
export interface CauHoiPodcast { hoi: string; chon: string[]; dung: number; giai?: string }
export interface TapPodcast {
  id: string; nn: NnCTL; danhMuc?: string; cap: string; so: number; tieuDe: string; tieuDeViet: string; moTa: string; chuDe: string;
  bieuTuong: string; nguoi: { ma: string; ten: string; giong: string; vai?: string }[]; loi: DongPodcast[]; tuVung: TuPodcast[];
  yNghia: string; meo?: string[]; cauHoi: CauHoiPodcast[];
}

export const apiPodcast = {
  danhSach: (nn: NnCTL, danhMuc: string) => lay<DanhSachPodcast>('/ctlanguage/podcast', { nn, danhMuc }),
  tap: (nn: NnCTL, id: string) => lay<TapPodcast>(`/ctlanguage/podcast/${nn}/${encodeURIComponent(id)}`),
};

// ─── Học từ vựng ──────────────────────────────────────────────────────────────────────────────────────────────────

export interface NguPhapGoiY { id: string; tieuDe?: string; nghia?: string; cap?: string }
export interface TomTatBaiHtv {
  id: string; ten: string; moTa?: string; cap?: string; nhanCap?: string; nhom?: string; bieuTuong?: string; anhUrl?: string | null;
  soTu?: number; mau?: string[]; k?: string[]; nguPhap?: NguPhapGoiY | null;
}
export interface NhomBaiHtv { ma: string; ten: string; moTa?: string; bieuTuong?: string; anhUrl?: string | null; soTu?: number; soBai?: number; bai: TomTatBaiHtv[] }
export interface LoTrinhHtv { nn: NnCTL; theo: 'cap' | 'chu-de'; tongTu: number; soBai: number; nhom: NhomBaiHtv[] }
export interface TuHtv {
  k: string; id: number; coTrongTuDien?: boolean; chu: string; doc?: string | null; hanViet?: string | null; nghia: string;
  loai?: string | null; nhanLoai?: string | null; cap?: string | null; capUoc?: boolean; viDu?: string | null; viDuDoc?: string | null;
  viDuNghia?: string | null; cumTu?: string[] | null; hoTu?: string[] | null; ghiChu?: string | null; anhUrl?: string | null; chuDe?: string | null;
}
export interface BaiHtv extends TomTatBaiHtv { theo?: string; ke?: string | null; truoc?: string | null; tu: TuHtv[] }

export type TheoHtv = 'cap' | 'chu-de';
export const apiHocTuVung = {
  loTrinh: (nn: NnCTL, theo: TheoHtv) => lay<LoTrinhHtv>(`/ctlanguage/tu-vung/${nn}/lo-trinh`, { theo }),
  bai: (nn: NnCTL, id: string) => lay<BaiHtv>(`/ctlanguage/tu-vung/${nn}/bai/${encodeURIComponent(id)}`),
};

// ─── Sổ chuyên ngành ──────────────────────────────────────────────────────────────────────────────────────────────

export interface BoChuyenNganh { ma: string; nn: NnCTL; ten: string; moTa?: string; bieuTuong?: string; soTu?: number; soViDu?: number; nhom?: string[]; mau?: string[] }
export interface TuChuyenNganh {
  id: number; coTrongTuDien?: boolean; chu: string; doc?: string | null; hanViet?: string | null; nghiaVi?: string | null; nhom?: string | null;
  viDu?: string | null; viDuDoc?: string | null; viDuNghia?: string | null;
}
export interface ChiTietBoChuyenNganh { ma: string; ten: string; moTa?: string; bieuTuong?: string; tu: TuChuyenNganh[] }

/** Bộ "từ theo đề thi" (theo môn) — cùng luật máy chủ `soChuyenNganhThuan.laBoDeThi`; các bộ này cũng là nhóm `cn-<mã>` của
 *  lộ trình Học từ vựng "theo chủ đề" (tiếng Anh). */
export const laBoDeThi = (ma: string) => /^doc-de-thi(?:-\d+)?$/.test(ma) || /^[a-z]{3}\d{3}[a-z]?-\d+$/.test(ma);

export const apiSoChuyenNganh = {
  danhSach: (nn: NnCTL) => lay<{ tong: number; soTu: number; bo: BoChuyenNganh[] }>('/ctlanguage/so-chuyen-nganh', { nn }),
  chiTiet: (nn: NnCTL, ma: string) => lay<ChiTietBoChuyenNganh>(`/ctlanguage/so-chuyen-nganh/${nn}/${encodeURIComponent(ma)}`),
};

// ─── Ngữ pháp (công khai — `src/routes/ctlanguage.nguPhap.routes.ts`) ───────────────────────────────────────────────

export interface CapNguPhap { cap: string; ten: string; moTa: string; soDiem: number; nhom: { ten: string; diem: TomTatNguPhap[] }[] }
export interface DanhMucNguPhap { nn: string; tong: number; cap: CapNguPhap[] }
export interface DiemNguPhap extends TomTatNguPhap {
  tenCap?: string; giaiThich: string; cachGhep: string[]; viDu: { c: string; d?: string; v: string }[]; luuY: string[]; quiz: CauQuizNguPhap[];
}
const DEM_NP = new Map<string, Promise<unknown>>();
const nho = <T,>(k: string, f: () => Promise<T>): Promise<T> => {
  const co = DEM_NP.get(k) as Promise<T> | undefined;
  if (co) return co;
  const p = f().catch((e) => { DEM_NP.delete(k); throw e; });
  DEM_NP.set(k, p);
  return p;
};
export const apiNguPhap = {
  danhMuc: (nn: NnCTL) => nho(`dm|${nn}`, () => lay<DanhMucNguPhap>('/ctlanguage/ngu-phap/danh-muc', { nn })),
  diem: (id: string) => nho(`d|${id}`, () => lay<DiemNguPhap>(`/ctlanguage/ngu-phap/diem/${encodeURIComponent(id)}`)),
};

// ─── Chấm phát âm (cần đăng nhập — `src/routes/ctlanguage.phatAm.routes.ts`, cùng tuyến app iOS dùng) ─────────────────

export interface LuotPhatAm { laPro?: boolean; tran?: number; conLai?: number; batChua?: boolean }
export interface TuPhatAm { tu?: string; diem?: number; loi?: string; am?: { am?: string; diem?: number }[] }
export interface ChuThanh { chu?: string; pinyin?: string; thanh?: number; diem?: number; nghiNgoThanh?: boolean }
export interface ChamPhatAm {
  nn?: string; ngonNgu?: string; ngheRa?: string; tu?: TuPhatAm[]; chuThanh?: ChuThanh[];
  diem?: { tong?: number; chinhXac?: number; troiChay?: number; dayDu?: number; ngonDieu?: number };
}
export interface KetQuaPhatAm { ketQua: ChamPhatAm | null; lyDo?: string; thongBao?: string; goiY?: string[]; luot?: LuotPhatAm }

export const apiPhatAm = {
  luot: () => lay<LuotPhatAm>('/ctlanguage/phat-am/luot'),
  /** `audio` = WAV PCM 16 kHz mono (≤ 15 s). `giong` = us|uk (chỉ tiếng Anh). `doc` = pinyin/kana của câu. */
  cham: async (audio: Blob, o: { cau: string; nn: NnCTL; giong?: string; doc?: string | null }): Promise<KetQuaPhatAm> => {
    const fd = new FormData();
    fd.append('cau', o.cau);
    fd.append('nn', o.nn);
    if (o.giong) fd.append('giong', o.giong);
    if (o.doc) fd.append('doc', o.doc);
    fd.append('audio', audio, 'phat-am.wav');
    return (await api.post('/ctlanguage/phat-am/ai/cham', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60_000 })).data.data as KetQuaPhatAm;
  },
};

// ─── Từ điển (tra nhanh) ──────────────────────────────────────────────────────────────────────────────────────────

export interface MucGon { id: number; chu: string; chuPhu: string | null; doc: string | null; hanViet: string | null; nghiaVi: string | null; nghiaEn: string | null; thongDung: boolean }
export const apiTuDien = {
  tra: (nn: NnCTL, q: string, gioiHan = 6) => lay<MucGon[]>(`/ctlanguage/tu-dien/${nn}/tra`, { q, gioiHan }),
};

/** Ngôn ngữ CT Language từ tham số `[code]` của web (en/ja/zh); khác ⇒ null. */
export const nnTuCode = (code: string): NnCTL | null => (code === 'en' || code === 'ja' || code === 'zh' ? code : null);

/** Thông điệp lỗi gọn cho người học. */
export function loiMang(e: unknown): string {
  const r = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
  if (r?.status === 404) return 'Không tìm thấy nội dung này.';
  if (r?.status === 429) return r.data?.message ?? 'Thao tác hơi nhanh, chờ một chút nhé.';
  return r?.data?.message ?? 'Chưa tải được — kiểm tra mạng rồi thử lại.';
}
