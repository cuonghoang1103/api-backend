/**
 * Huấn luyện học kỳ — client cho /api/v1/hoc-tap (+ /hoc-ky để tạo kỳ, lịch thi).
 * Kế hoạch: docs/hoc-tap-coach-plan.md
 */
import { api, fileApi } from './api';

export type MucDo = 'xanh' | 'vang' | 'cam' | 'do';
export type TrangThai = 'CHUA_LAM' | 'DANG_LAM' | 'CHO_CHAM' | 'VAN_DAP' | 'DAT' | 'CHUA_DAT';

export interface RuiRo {
  tyLe: number; mucDo: MucDo; tienDo: number; kyVong: number; quaHan: number; nopTre: number; boLo?: number;
  diemLuyenTB: number | null; lyDo: string[];
}
export interface ViecGon {
  id: number; monId: number; maMon: string; mau: string | null; tieuDe: string; loai: string; hanChot: string;
  thoiLuongPhut: number; trangThai: TrangThai; batDauLuc: string | null; diem: number | null; tuan: number;
  gioBatDau?: string | null; boLo?: boolean;
}
export interface LopNgay { maMon: string; batDau: string; ketThuc: string; phong: string | null; slot: number | null }
export interface NgayLich { ngay: string; thu: number; lop: LopNgay[]; viec: ViecGon[] }
export interface MonTQ {
  id: number; maMon: string; ten: string; mau: string | null; courseSlug: string | null; trinhDo: string | null;
  mucTieu: string | null; nenTang: Array<{ slug: string; ten: string; lyDo?: string }> | null; ruiRo: RuiRo;
  tongViec: number; datViec: number; choCham: number;
  viecKeTiep: { id: number; tieuDe: string; hanChot: string; thoiLuongPhut: number; loai: string } | null;
  thiSapToi: { loai: string; ngay: string; batDau: string; conNgay: number } | null;
}
export interface TongQuan {
  hocKy: { id: number; ten: string; batDau: string; soTuan: number; tuanThi: number } | null;
  tuan: number; tuanQua?: number; mon: MonTQ[]; ruiRoKy: { tyLe: number; mucDo: MucDo }; tienDoKy?: number;
  homNay: ViecGon[]; quaHan: ViecGon[]; choCham: ViecGon[]; lich?: NgayLich[];
}
export interface BangChung {
  id: number; lanNop: number; noiDung: string | null; lienKet: string[] | null; tep: Array<{ url: string; ten?: string; loai?: string }> | null;
  ketQua: { loi?: string; diemManh?: string[]; loiCanSua?: string[]; canCaiThien?: string[] } | null;
  diem: number | null; dat: boolean | null; nguoiCham: string | null; chamLuc: string | null; nopTre: boolean; createdAt: string;
}
export interface Viec {
  id: number; monId: number; tuan: number; loai: string; tieuDe: string; huongDan: string | null; yeuCauBangChung: string | null;
  lienKet: string | null; thoiLuongPhut: number; hanChot: string; trongSo: number; trangThai: TrangThai; gioBatDau?: string | null;
  batDauLuc: string | null; nopLuc: string | null; diem: number | null; nhanXet: string | null;
  loiCanSua: { loi?: string[]; canCaiThien?: string[]; diemManh?: string[] } | null; nguoiCham: string | null;
  chamLuc: string | null; nguon: string; bangChung: BangChung[];
  vanDap?: { cauHoi: string[]; diemBangChung: number; traLoi?: string[]; ketQua?: { hieu: boolean; diem: number; nhanXet: string; tungCau: Array<{ dung: boolean; goiY: string }> } } | null;
}
export interface ChiTietMon {
  mon: { id: number; maMon: string; ten: string; mau: string | null; trinhDo: string | null; mucTieu: string | null; courseSlug: string | null; nenTang: MonTQ['nenTang']; hocKy: { soTuan: number; tuanThi: number } };
  viec: Viec[]; ruiRo: RuiRo; tuan: number; lichSu: Array<{ ngay: string; tyLe: number; tienDo: number }>;
}
export interface ViecDeNghi {
  tuan: number; thu?: number; hanChot?: string; loai: string; tieuDe: string; huongDan?: string | null; yeuCauBangChung?: string | null;
  lienKet?: string | null; thoiLuongPhut?: number; trongSo?: number;
}
export interface KeHoach { tomTat: string; nenTang: Array<{ slug: string; ten: string; lyDo: string }>; viec: ViecDeNghi[]; canhBao: string[] }
export interface HanMuc { admin: boolean; pro: boolean; daDung: number; tran: number | null; conLai: number | null }

const d = <T,>(p: Promise<{ data: { data: T } }>) => p.then((r) => r.data.data);
/** Lời gọi có AI chạy đồng bộ (nhận xét, vấn đáp, chấm lại): axios mặc định cắt ở 30 giây, model cần 20–60.
 *  Để 95 giây — dưới trần 100 giây của Cloudflare. */
const AI = { timeout: 95_000 };

export const hocTapApi = {
  tongQuan: () => d<TongQuan>(api.get('/hoc-tap/tong-quan')),
  hanMuc: () => d<HanMuc>(api.get('/hoc-tap/han-muc')),
  lichSu: (ngay = 60) => d<Array<{ monId: number | null; ngay: string; tyLe: number; tienDo: number }>>(api.get(`/hoc-tap/rui-ro/lich-su?ngay=${ngay}`)),
  nhanXet: () => d<{ loi: string }>(api.post('/hoc-tap/nhan-xet', undefined, AI)),

  taoKy: (b: { ten: string; batDau: string; soTuan: number; tuanThi: number }) => d<{ item: { id: number } }>(api.post('/hoc-ky', b)),
  dsKy: () => d<{ items: Array<{ id: number; ten: string; batDau: string; soTuan: number; tuanThi: number; dangHoc: boolean }> }>(api.get('/hoc-ky')),
  themThi: (b: { monHoc: string; maMon: string; loai: string; ngay: string; batDau: string; ketThuc: string; hocKyId?: number }) => d(api.post('/hoc-ky/lich-thi', b)),

  themMon: (b: { maMon: string; ten?: string; trinhDo?: string; mucTieu?: string }) => d<{ id: number }>(api.post('/hoc-tap/mon', b)),
  suaMon: (id: number, b: { ten?: string; trinhDo?: string | null; mucTieu?: string | null }) => d(api.patch(`/hoc-tap/mon/${id}`, b)),
  xoaMon: (id: number) => d(api.delete(`/hoc-tap/mon/${id}`)),
  mon: (id: number) => d<ChiTietMon>(api.get(`/hoc-tap/mon/${id}`)),

  soanKeHoach: (monId: number, ghiChu?: string) => d<{ jobId: string }>(api.post(`/hoc-tap/mon/${monId}/ke-hoach`, { ghiChu })),
  trangThaiSoan: (jobId: string) => d<{ trangThai: 'dang_soan' | 'xong' | 'loi'; ketQua: KeHoach | null; loi: string | null }>(api.get(`/hoc-tap/ke-hoach/${jobId}`)),
  apDung: (monId: number, viec: ViecDeNghi[], nenTang?: KeHoach['nenTang']) => d<{ daThem: number; boQua: string[] }>(api.post(`/hoc-tap/mon/${monId}/ke-hoach/ap-dung`, { viec, nenTang })),

  themViec: (monId: number, viec: ViecDeNghi[]) => d(api.post(`/hoc-tap/mon/${monId}/viec`, { viec })),
  viec: (id: number) => d<Viec & { mon: { maMon: string; ten: string } }>(api.get(`/hoc-tap/viec/${id}`)),
  batDau: (id: number) => d(api.post(`/hoc-tap/viec/${id}/bat-dau`)),
  nop: (id: number, b: { noiDung?: string; lienKet?: string[]; tep?: Array<{ url: string; ten?: string; loai?: string }>; khongChamAI?: boolean }) => d<BangChung>(api.post(`/hoc-tap/viec/${id}/nop`, b)),
  vanDap: (id: number, traLoi: string[]) => d<{ hieu: boolean; diem: number; nhanXet: string; diemCuoi: number | null }>(api.post(`/hoc-tap/viec/${id}/van-dap`, { traLoi }, AI)),
  chamLai: (bangChungId: number) => d(api.post(`/hoc-tap/bang-chung/${bangChungId}/cham-lai`, undefined, AI)),
  xoaViec: (id: number) => d(api.delete(`/hoc-tap/viec/${id}`)),
  doiGio: (id: number, gioBatDau: string) => d(api.patch(`/hoc-tap/viec/${id}/gio`, { gioBatDau })),
  xepLai: () => d<{ daXep: number }>(api.post('/hoc-tap/xep-lich')),

  taiTep: async (f: File) => {
    const r = await fileApi.upload(f, f.type.startsWith('image/') ? 'images' : 'documents');
    const data = (r.data as { data: { url: string } }).data;
    return { url: data.url, ten: f.name, loai: f.type };
  },
};

export const MAU_MUC: Record<MucDo, { chu: string; nen: string; vien: string; nhan: string }> = {
  xanh: { chu: '#10b981', nen: 'rgba(16,185,129,.12)', vien: 'rgba(16,185,129,.35)', nhan: 'An toàn' },
  vang: { chu: '#eab308', nen: 'rgba(234,179,8,.12)', vien: 'rgba(234,179,8,.4)', nhan: 'Cần cố gắng' },
  cam: { chu: '#f97316', nen: 'rgba(249,115,22,.13)', vien: 'rgba(249,115,22,.45)', nhan: 'Nguy hiểm' },
  do: { chu: '#ef4444', nen: 'rgba(239,68,68,.14)', vien: 'rgba(239,68,68,.55)', nhan: 'BÁO ĐỘNG ĐỎ' },
};

export const NHAN_LOAI: Record<string, { ten: string; bieuTuong: string }> = {
  NEN_TANG: { ten: 'Nền tảng', bieuTuong: '🧱' },
  BAI_HOC: { ten: 'Bài học', bieuTuong: '📖' },
  BAI_TAP: { ten: 'Bài tập', bieuTuong: '✍️' },
  LAB: { ten: 'Lab', bieuTuong: '🧪' },
  QUIZ: { ten: 'Quiz', bieuTuong: '❓' },
  PE: { ten: 'Luyện PE', bieuTuong: '💻' },
  FE: { ten: 'Luyện FE', bieuTuong: '📝' },
  ON_TAP: { ten: 'Ôn tập', bieuTuong: '🔁' },
  GHI_CHU: { ten: 'Sổ tay', bieuTuong: '📒' },
};

export const NHAN_TRANG_THAI: Record<TrangThai, { ten: string; mau: string }> = {
  CHUA_LAM: { ten: 'Chưa làm', mau: '#94a3b8' },
  DANG_LAM: { ten: 'Đang làm', mau: '#3b82f6' },
  CHO_CHAM: { ten: 'Đang chấm', mau: '#a855f7' },
  VAN_DAP: { ten: 'Vấn đáp', mau: '#0ea5e9' },
  DAT: { ten: 'Đạt', mau: '#10b981' },
  CHUA_DAT: { ten: 'Chưa đạt — nộp lại', mau: '#f97316' },
};
