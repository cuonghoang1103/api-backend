/**
 * "Dự án xuyên suốt khoá" (21/11/2026) — kiểu dữ liệu phía web + hàm thuần dùng chung cho các khối trong trang học
 * và trang khoá. Máy chủ: src/services/duAn/duAn.service.ts · hợp đồng: docs/du-an-hop-dong.md.
 * Chuỗi hiển thị trong `duAn` là song ngữ 'EN|||VI' (có thể kèm HTML) ⇒ luôn `pickLang` + `sanitizeHtml`.
 */

export type LoaiNop = 'repo' | 'demo' | 'anh';

export interface DeTaiGoiY {
  slug: string;
  ten: string;
  moTa: string;
  doKho: 1 | 2 | 3;
  tinhNang: string[];
  banDoChuong: Array<{ moc: number; dung: string }>;
  thamKhaoThat: string[];
  anh: string | null;
}

export interface MocDuAn {
  so: number;
  slug: string;
  ten: string;
  sauChuong: string | null;
  yeuCau: string[];
  nangCao: string[];
  datKhi: string[];
  goiY: string[];
  nop: LoaiNop[];
}

export interface DuAnKhoa {
  version: 1;
  gioiThieu: string;
  deTai: DeTaiGoiY[];
  tuChon: { yeuCauToiThieu: string[]; goiYQuyMo: string | null };
  moc: MocDuAn[];
  baoVe: { rubric: Array<{ tieuChi: string; diem: number; moTa: string | null }>; cauHoiMau: string[]; chuanBi: string[] };
  bai: { dangKy: string[]; baoVe: string[] };
}

export interface LuaChon {
  loai: 'GOI_Y' | 'TU_CHON';
  deTaiSlug: string | null;
  ten: string;
  moTa: string;
  tinhNang: string[];
  chotLuc: string | null;
}

export interface AiDuyet {
  ketQua: 'DUYET' | 'CAN_SUA';
  nhanXet: string;
  diemManh: string[];
  goiYSua: string[];
  quyMo: 'VUA' | 'QUA_TO' | 'QUA_NHO' | null;
  ban: { ten: string; moTa: string; tinhNang: string[] };
  luc: string;
}

export interface MocCuaToi {
  trangThai: 'DANG_LAM' | 'XONG';
  repoUrl: string | null;
  demoUrl: string | null;
  anhUrl: string | null;
  ghiChu: string | null;
  tuKiem: number[];
  deTaiTen: string | null;
  nopLuc: string | null;
  xongLuc: string | null;
}

export interface TienDo {
  tong: number;
  xong: number;
  dangLam: number;
  phanTram: number;
  moc: Array<{ so: number; slug: string; ten: string; trangThai: 'DANG_LAM' | 'XONG' | null }>;
}

export interface PhienTomTat {
  id: number;
  trangThai: 'DANG_HOI' | 'DA_CHAM' | 'BO_DO';
  diem: number | null;
  batDauLuc: string;
  ketThucLuc: string | null;
}

export interface CuaToi {
  luaChon: LuaChon | null;
  aiDuyet: AiDuyet | null;
  lichSu: Array<{ loai: string; deTaiSlug: string | null; ten: string; tuLuc: string | null; denLuc: string }>;
  moc: Record<string, MocCuaToi>;
  tienDo: TienDo;
  baoVe: { phien: PhienTomTat[]; dangMo: number | null; diemCaoNhat: number | null };
  gioiHan: { duyetToiDa: number; duyetConLai: number; baoVeToiDa: number; baoVeConLai: number; soCau: number; mocToiThieu: number };
}

export interface DuAnTraVe {
  coDuAn: boolean;
  khoa: { id: number; slug: string; title: string; courseCode: string | null };
  duAn: DuAnKhoa | null;
  daDangNhap: boolean;
  cuaToi: CuaToi | null;
  vuaDuyet?: { ketQua: 'DUYET' | 'CAN_SUA'; daChot: boolean };
}

export interface LuotHoiDong { role: 'assistant' | 'user'; content: string; luc: string }

export interface PhienBaoVe {
  id: number;
  trangThai: 'DANG_HOI' | 'DA_CHAM' | 'BO_DO';
  deTai: { ten: string; moTa: string; tinhNang: string[] };
  phien: LuotHoiDong[];
  soCau: number;
  diem: number | null;
  diemChiTiet: Array<{ tieuChi: string; diemToiDa: number; diem: number; nhanXet: string }> | null;
  nhanXet: { chung: string; diemManh: string[]; canCaiThien: string[] } | null;
  batDauLuc: string;
  ketThucLuc: string | null;
  tiepTuc?: boolean;
}

/** Vai trò của một bài trong dự án của khoá (theo slug). */
export function vaiTroBai(duAn: DuAnKhoa | null | undefined, slug: string | null | undefined):
  | { loai: 'dangKy' }
  | { loai: 'moc'; moc: MocDuAn }
  | { loai: 'baoVe' }
  | null {
  if (!duAn || !slug) return null;
  if (duAn.bai.dangKy.includes(slug)) return { loai: 'dangKy' };
  const m = duAn.moc.find((x) => x.slug === slug);
  if (m) return { loai: 'moc', moc: m };
  if (duAn.bai.baoVe.includes(slug)) return { loai: 'baoVe' };
  return null;
}

/** "**đậm**" + xuống dòng ⇒ HTML an toàn (escape trước). Đủ cho lời hội đồng AI — không cần trình markdown. */
export function vanBanAi(s: string): string {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return esc
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');
}

/** Điểm theo dấu thập phân của ngôn ngữ: 7.75 ⇒ "7,75" (vi) / "7.75" (en). */
export function soDiem(n: number, locale: 'en' | 'vi'): string {
  return n.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN', { maximumFractionDigits: 2 });
}

/** Dòng tính năng nhập tay ⇒ mảng (bỏ dòng trống, gạch đầu dòng). */
export function tachDong(s: string): string[] {
  return s.split('\n').map((x) => x.replace(/^\s*[-*•\d.)]+\s*/, '').trim()).filter(Boolean);
}
