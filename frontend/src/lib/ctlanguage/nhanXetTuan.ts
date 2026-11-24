/**
 * Nhận xét học tập hằng tuần của CuongMini (tiếng Anh, 24/11/2026) — gọi API `/api/v1/ctlanguage/nhan-xet-tuan`.
 * Backend: src/routes/ctlanguage.nhanXetTuan.routes.ts · số liệu do mã tính (nhanXetTuanThuan.ts), chữ do model viết.
 */
import api from '@/lib/api';

export type KyNangSo = { so: number; bandTb: number | null; bandTruoc: number | null; dungTb: number | null };
export type KhoaSoLieu = {
  stage: string; ten: string; duong: string; baiXong: number; baiXongTruoc: number; daXongTong: number; tongBai: number; tiLe: number;
  buoiKeTiep: number | null; soBuoi: number;
  baiTap: { so: number; tb: number | null; thap: { id: string; ten: string; buoi: number | null; diem: number; lessonId: string | null }[] };
};
export type NguonDuLieu = { ma: string; ten: string; co: boolean; ghiChu: string };
export type SoLieuTuan = {
  tuan: string; tuNgay: string; denNgay: string; soNgayTinh: number; dangDo: boolean; trong: boolean;
  ngayHoc: { so: number; tren: number; truoc: number; ds: string[] };
  chuoi: number;
  phut: { tong: number; baiHoc: number; thiMay: number; appCTL: number; onThe: number; truoc: number };
  theoNgay: { ngay: string; thu: string; phut: number; coHoc: boolean }[];
  khoa: KhoaSoLieu[];
  tuVung: {
    ielts: { moi: number; luotOn: number; tiLeNho: number | null; quen: number; daThuoc: number; moiTruoc: number };
    ctl: { moi: number; daOn: number; nhoSau: number; tongThe: number; denHan: number; moiTruoc: number };
    loTrinh: { ngayKeTiep: { id: string; ten: string } | null; ngayDaXong: number; tongNgay: number } | null;
  };
  thi: {
    soLuot: number; soLuotTruoc: number; kyNang: Record<'doc' | 'nghe' | 'viet' | 'noi', KyNangSo>;
    tieuChiViet: Record<string, number> | null; tieuChiNoi: Record<string, number> | null; azure: number | null; bandTong: number | null;
  };
  soLoi: { moi: number; saiLai: number; theoDang: { dang: string; ky: string; so: number; lanSai: number }[]; denHan: number; vung: number };
  nguonDuLieu?: NguonDuLieu[];
};
export type DiemYeu = { ma: string; loai: string; tieuDe: string; bangChung: string; muc: number; lienKet: { nhan: string; href: string } };
export type NgayKeHoach = { thu: string; ngay: string; viec: { nhan: string; href: string; phut: number; loai: 'hoc' | 'on' | 'thi' | 'tu' }[] };
export type NhanXet = {
  tongQuan: string; diemManh: string[]; diemYeu: { ma: string; nhanXet: string; cachSua: string }[];
  keHoachGhiChu: Record<string, string>; loiNhan: string;
};
export type BaoCaoTuan = {
  tuan: string; tuNgay: string; denNgay: string; dangDo: boolean; nguon: 'ai' | 'ma'; model: string | null;
  lanTao: number; conLanTaoLai: number | null; taoLuc: string; emailLuc: string | null;
  soLieu: SoLieuTuan; diemYeu: DiemYeu[]; keHoach: NgayKeHoach[]; nhanXet: NhanXet; moiTao?: boolean;
};
export type TomTatTuan = {
  tuan: string; tuNgay: string; denNgay: string; dangDo: boolean; nguon: 'ai' | 'ma'; trong: boolean;
  ngayHoc: number; soNgayTinh: number; phut: number; baiXong: number; soDiemYeu: number; taoLuc: string;
};
export type DanhSachTuan = {
  tuanGoiY: string; coTuanGoiY: boolean; tuanHienTai: string; tranTaoLai: number | null;
  caiDat: { guiEmail: boolean }; ds: TomTatTuan[];
};

const d = <T,>(p: Promise<{ data: { data?: unknown } }>) => p.then((r) => r.data?.data as T);

export const apiNhanXetTuan = {
  danhSach: () => d<DanhSachTuan>(api.get('/ctlanguage/nhan-xet-tuan')),
  mot: (tuan: string) => d<BaoCaoTuan>(api.get(`/ctlanguage/nhan-xet-tuan/${encodeURIComponent(tuan)}`)),
  /** Gọi model ~10–40 giây ⇒ chờ tới 2 phút. */
  tao: (tuan?: string, lamLai = false) => d<BaoCaoTuan>(api.post('/ctlanguage/nhan-xet-tuan/tao', { tuan, lamLai }, { timeout: 120_000 })),
  datCaiDat: (guiEmail: boolean) => d<{ guiEmail: boolean }>(api.put('/ctlanguage/nhan-xet-tuan/cai-dat', { guiEmail })),
};

export const loiNhanXet = (e: unknown): string => {
  const r = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
  return r?.data?.message ?? (r?.status ? `Lỗi ${r.status}` : 'Không kết nối được máy chủ');
};
