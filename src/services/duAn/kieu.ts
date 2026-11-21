/**
 * Kiểu dữ liệu "Dự án xuyên suốt khoá" (21/11/2026) — hợp đồng: docs/du-an-hop-dong.md.
 *
 * `course_project_specs.noi_dung` do seed ghi (scripts/lib/du-an.mjs ĐÃ kiểm gắt), nên ở đây chỉ dò dạng tối thiểu để một bản ghi
 * hỏng tay không làm sập route — không kiểm lại toàn bộ hợp đồng.
 * Chuỗi hiển thị có dạng song ngữ 'EN|||VI' (có thể kèm HTML) — frontend tự `pickLang`.
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

export interface TieuChiRubric {
  tieuChi: string;
  diem: number;
  moTa: string | null;
}

export interface DuAnKhoa {
  version: 1;
  gioiThieu: string;
  deTai: DeTaiGoiY[];
  tuChon: { yeuCauToiThieu: string[]; goiYQuyMo: string | null };
  moc: MocDuAn[];
  baoVe: { rubric: TieuChiRubric[]; cauHoiMau: string[]; chuanBi: string[] };
  /** Vai trò bài theo slug (thay cho cột cờ trên `lessons`). */
  bai: { dangKy: string[]; baoVe: string[] };
}

/** Đề tài tự chọn người học gửi duyệt. */
export interface BanDeTai {
  ten: string;
  moTa: string;
  tinhNang: string[];
}

export type KetQuaDuyet = 'DUYET' | 'CAN_SUA';
export type QuyMo = 'VUA' | 'QUA_TO' | 'QUA_NHO';

export interface AiDuyet {
  ketQua: KetQuaDuyet;
  nhanXet: string;
  diemManh: string[];
  goiYSua: string[];
  quyMo: QuyMo | null;
  ban: BanDeTai;
  luc: string;
  model: string;
}

export interface LuotHoiDong {
  role: 'assistant' | 'user';
  content: string;
  luc: string;
}

export interface DiemTieuChi {
  tieuChi: string;
  diemToiDa: number;
  diem: number;
  nhanXet: string;
}

export interface NhanXetBaoVe {
  chung: string;
  diemManh: string[];
  canCaiThien: string[];
}

export type TrangThaiMoc = 'DANG_LAM' | 'XONG';
export type TrangThaiBaoVe = 'DANG_HOI' | 'DA_CHAM' | 'BO_DO';

const laMang = (v: unknown): v is unknown[] => Array.isArray(v);

/** Dò dạng tối thiểu của `course_project_specs.noi_dung` — sai dạng ⇒ null (khoá coi như chưa có dự án). */
export function docDuAn(v: unknown): DuAnKhoa | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const d = v as Record<string, unknown>;
  if (d.version !== 1 || !laMang(d.deTai) || !laMang(d.moc) || !d.baoVe || typeof d.baoVe !== 'object') return null;
  const bv = d.baoVe as Record<string, unknown>;
  if (!laMang(bv.rubric)) return null;
  const bai = (d.bai && typeof d.bai === 'object' ? d.bai : {}) as Record<string, unknown>;
  const tuChon = (d.tuChon && typeof d.tuChon === 'object' ? d.tuChon : {}) as Record<string, unknown>;
  return {
    ...(d as unknown as DuAnKhoa),
    tuChon: {
      yeuCauToiThieu: laMang(tuChon.yeuCauToiThieu) ? (tuChon.yeuCauToiThieu as string[]) : [],
      goiYQuyMo: typeof tuChon.goiYQuyMo === 'string' ? tuChon.goiYQuyMo : null,
    },
    baoVe: {
      rubric: bv.rubric as TieuChiRubric[],
      cauHoiMau: laMang(bv.cauHoiMau) ? (bv.cauHoiMau as string[]) : [],
      chuanBi: laMang(bv.chuanBi) ? (bv.chuanBi as string[]) : [],
    },
    bai: {
      dangKy: laMang(bai.dangKy) ? (bai.dangKy as string[]) : [],
      baoVe: laMang(bai.baoVe) ? (bai.baoVe as string[]) : [],
    },
  };
}
