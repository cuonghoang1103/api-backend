/**
 * Cài đặt của app — kiểu + chuẩn hoá (hàm thuần, có test). Main lưu JSON trong thư mục dữ liệu app; mọi giá trị
 * từ renderer hay từ tệp trên đĩa đều đi qua `chuanHoaCaiDat()` trước khi dùng.
 */
import { MAY_CHU_MAC_DINH, type LoaiNhacNen, type NgonNgu, type Nhip } from './hopDong';

export type GiaoDien = 'he-thong' | 'sang' | 'toi';

export interface CaiDat {
  /** Thư mục gốc; kết quả nằm ở `<thuMucTai>/CT Lồng Tiếng/<ngày> <tên>/`. */
  thuMucTai: string;
  tuTaiVe: boolean;
  ngonNgu: NgonNgu;
  /** 0..0,4 — tỉ lệ giọng gốc giữ lại trong bản "VI + giọng gốc". */
  goc: number;
  nhip: Nhip;
  /** Lựa chọn nhạc nền lần trước (nhớ lại cho việc sau). */
  nhacNen: { loai: LoaiNhacNen; id: string | null; amLuong: number };
  /** Tệp "Nhạc của tôi" — CHỈ main đặt (qua hộp thoại), renderer không gửi đường dẫn được. */
  nhacNenTep: string | null;
  chayCungMay: boolean;
  giaoDien: GiaoDien;
  /** Gốc web (không có /api). Đổi ở mục Nâng cao. */
  mayChu: string;
}

export const TEN_THU_MUC_APP = 'CT Lồng Tiếng';

export function caiDatMacDinh(thuMucVideo: string): CaiDat {
  return {
    thuMucTai: thuMucVideo,
    tuTaiVe: true,
    ngonNgu: 'auto',
    goc: 0.15,
    nhip: 'cho-giong',
    nhacNen: { loai: 'goc', id: null, amLuong: 0.7 },
    nhacNenTep: null,
    chayCungMay: false,
    giaoDien: 'he-thong',
    mayChu: MAY_CHU_MAC_DINH,
  };
}

/** Gốc máy chủ hợp lệ: https bất kỳ, hoặc http CHỈ cho localhost (thử nghiệm). Sai ⇒ null. */
export function chuanHoaMayChu(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  let u: URL;
  try {
    u = new URL(v.trim());
  } catch {
    return null;
  }
  const local = u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '[::1]';
  if (u.protocol !== 'https:' && !(u.protocol === 'http:' && local)) return null;
  if (u.username || u.password) return null;
  // Người dùng dán cả đường API ⇒ cắt về gốc.
  const p = u.pathname.replace(/\/+$/, '').replace(/\/api\/v1\/long-tieng$/, '').replace(/\/long-tieng$/, '');
  return `${u.origin}${p}`;
}

export function chuanHoaCaiDat(v: unknown, macDinh: CaiDat): CaiDat {
  const o = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  const goc = typeof o.goc === 'number' && Number.isFinite(o.goc) ? Math.round(Math.min(0.4, Math.max(0, o.goc)) * 100) / 100 : macDinh.goc;
  return {
    thuMucTai: typeof o.thuMucTai === 'string' && o.thuMucTai.trim() ? o.thuMucTai : macDinh.thuMucTai,
    tuTaiVe: typeof o.tuTaiVe === 'boolean' ? o.tuTaiVe : macDinh.tuTaiVe,
    ngonNgu: o.ngonNgu === 'zh' || o.ngonNgu === 'en' || o.ngonNgu === 'auto' ? o.ngonNgu : macDinh.ngonNgu,
    goc,
    nhip: o.nhip === 'tang-toc' || o.nhip === 'cho-giong' ? o.nhip : macDinh.nhip,
    nhacNen: chuanHoaNhacNen(o.nhacNen, macDinh.nhacNen),
    nhacNenTep: typeof o.nhacNenTep === 'string' && o.nhacNenTep ? o.nhacNenTep : null,
    chayCungMay: typeof o.chayCungMay === 'boolean' ? o.chayCungMay : macDinh.chayCungMay,
    giaoDien: o.giaoDien === 'sang' || o.giaoDien === 'toi' || o.giaoDien === 'he-thong' ? o.giaoDien : macDinh.giaoDien,
    mayChu: chuanHoaMayChu(o.mayChu) ?? macDinh.mayChu,
  };
}

export function chuanHoaNhacNen(v: unknown, macDinh: CaiDat['nhacNen']): CaiDat['nhacNen'] {
  const o = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  const loai = (['goc', 'thu-vien', 'tep', 'khong'] as const).find((x) => x === o.loai) ?? macDinh.loai;
  const id = typeof o.id === 'string' && /^[A-Za-z0-9_.-]{1,64}$/.test(o.id) ? o.id : loai === 'thu-vien' ? macDinh.id : null;
  const amLuong = typeof o.amLuong === 'number' && Number.isFinite(o.amLuong)
    ? Math.round(Math.min(1, Math.max(0, o.amLuong)) * 100) / 100 : macDinh.amLuong;
  return { loai: loai === 'thu-vien' && !id ? 'goc' : loai, id, amLuong };
}

/** Mã kết nối tạo trên web: `ctlt_` + chuỗi an toàn URL. */
export function laMaKetNoi(v: unknown): v is string {
  return typeof v === 'string' && /^ctlt_[A-Za-z0-9_-]{8,256}$/.test(v.trim());
}
