/**
 * Cầu IPC main ↔ renderer: tên kênh, kiểu dữ liệu, và bộ kiểm đầu vào.
 *
 * Renderer là vùng KHÔNG tin tưởng: mọi tham số từ nó đi qua các hàm `kiem*` ở main trước khi dùng. Renderer
 * KHÔNG BAO GIỜ đưa đường dẫn tệp tuỳ ý: tệp chọn bằng hộp thoại do main mở; tệp kéo thả lấy đường dẫn bằng
 * `webUtils.getPathForFile` ngay trong preload (chỉ có với File thật từ đĩa); thư viện dùng mã mục, không dùng
 * đường dẫn.
 */
import type { CaiDat } from './caiDat';
import type { BaiNhac, NgonNgu, Nhip, TrangThaiMayChu } from './hopDong';
import { chuanHoaNhacNen } from './caiDat';
import type { HienThi, LoaiChip } from './trangThai';

export const KENH = {
  layTrangThai: 'ctlt:lay-trang-thai',
  capNhat: 'ctlt:cap-nhat',
  ketNoi: 'ctlt:ket-noi',
  dangXuat: 'ctlt:dang-xuat',
  moTrangWeb: 'ctlt:mo-trang-web',
  taoViecLink: 'ctlt:tao-viec-link',
  chonTep: 'ctlt:chon-tep',
  taoViecTep: 'ctlt:tao-viec-tep',
  huyViec: 'ctlt:huy-viec',
  thuLai: 'ctlt:thu-lai',
  taiTrenMay: 'ctlt:tai-tren-may',
  moThuMucViec: 'ctlt:mo-thu-muc-viec',
  thuVien: 'ctlt:thu-vien',
  moThuMucMuc: 'ctlt:mo-thu-muc-muc',
  docPhuDe: 'ctlt:doc-phu-de',
  luuCaiDat: 'ctlt:luu-cai-dat',
  chonThuMucTai: 'ctlt:chon-thu-muc-tai',
  moThuMucTai: 'ctlt:mo-thu-muc-tai',
  lamMoi: 'ctlt:lam-moi',
  moTrinhPhat: 'ctlt:mo-trinh-phat',
  dsNhac: 'ctlt:ds-nhac',
  taiVe: 'ctlt:tai-ve',
  chonNhacTep: 'ctlt:chon-nhac-tep',
} as const;

export interface TuyChonViec {
  lang: NgonNgu;
  goc: number;
  nhip: Nhip;
  nhacNen: CaiDat['nhacNen'];
  tenVideo?: string;
}

/** Bài nhạc cho renderer: `nghiThu` đã đổi sang `ctlt-media://nghe-thu/<id>` (main tải hộ — renderer không ra mạng). */
export type BaiNhacHienThi = BaiNhac;

export interface ViecHienThi {
  id: string;
  tieuDe: string;
  nguon: 'link' | 'tep';
  link: string | null;
  lang: NgonNgu;
  goc: number;
  nhip: Nhip;
  trangThai: TrangThaiMayChu;
  hienThi: HienThi;
  chip: LoaiChip;
  tao: string;
  xong: string | null;
  thoiLuong: number | null;
  coTheThuLai: boolean;
  coTheTaiTrenMay: boolean;
  /** Xong ở trạm, chưa tải về, không đang tải (tắt "tự tải về" hoặc tải về lỗi). */
  coTheTaiVe: boolean;
  /** Có thể huỷ (còn chạy) — ngược lại nút là "Xoá". */
  coTheHuy: boolean;
  daTaiVe: boolean;
  /** Mã mục thư viện (khi đã tải về) để mở trình phát. */
  mucThuVien: string | null;
}

export interface TrangThaiApp {
  daKetNoi: boolean;
  /** Mã lưu được vào kho khoá hệ điều hành không (Linux thiếu libsecret ⇒ false: mở lại app phải dán lại). */
  luuMaDuoc: boolean;
  mock: boolean;
  phienBan: string;
  heDieuHanh: NodeJS.Platform;
  caiDat: CaiDat;
  viec: ViecHienThi[];
  /** Lỗi kết nối gần nhất (mất mạng, máy chủ 5xx) — null khi ổn. */
  loiMang: string | null;
  /** Thư mục kết quả thật: `<thuMucTai>/CT Lồng Tiếng`. */
  thuMucKetQua: string;
}

export interface MucThuVien {
  id: string;
  tieuDe: string;
  ngay: string;
  nguon: string | null;
  link: string | null;
  ngonNgu: string | null;
  thoiLuong: number | null;
  /** URL `ctlt-media://` phát được trong renderer. */
  vi: string | null;
  viGoc: string | null;
  coPhuDeVi: boolean;
  coPhuDeGoc: boolean;
  tongDungLuong: number;
}

export interface KetQuaThaoTac {
  ok: boolean;
  loi?: string;
}

/** API preload phơi cho renderer (`window.ctlt`). */
export interface CtltApi {
  layTrangThai(): Promise<TrangThaiApp>;
  onCapNhat(cb: (s: TrangThaiApp) => void): () => void;
  onMoTrinhPhat(cb: (mucId: string) => void): () => void;
  ketNoi(ma: string): Promise<KetQuaThaoTac>;
  dangXuat(): Promise<void>;
  moTrangWeb(): Promise<void>;
  taoViecLink(url: string, tuyChon: TuyChonViec): Promise<KetQuaThaoTac>;
  chonTep(tuyChon: TuyChonViec): Promise<KetQuaThaoTac>;
  /** Tệp kéo thả — đường dẫn lấy trong preload, renderer không chạm tới. */
  keoThaTep(tep: File[], tuyChon: TuyChonViec): Promise<KetQuaThaoTac>;
  huyViec(id: string): Promise<KetQuaThaoTac>;
  thuLai(id: string): Promise<KetQuaThaoTac>;
  taiTrenMay(id: string): Promise<KetQuaThaoTac>;
  taiVe(id: string): Promise<KetQuaThaoTac>;
  moThuMucViec(id: string): Promise<void>;
  thuVien(): Promise<MucThuVien[]>;
  moThuMucMuc(id: string): Promise<void>;
  docPhuDe(id: string, loai: 'vi' | 'goc'): Promise<string | null>;
  luuCaiDat(p: Partial<CaiDat>): Promise<KetQuaThaoTac>;
  chonThuMucTai(): Promise<KetQuaThaoTac>;
  moThuMucTai(): Promise<void>;
  lamMoi(): Promise<void>;
  dsNhac(): Promise<{ ok: boolean; loi?: string; ds: BaiNhacHienThi[] }>;
  /** Chọn tệp "Nhạc của tôi" bằng hộp thoại; main nhớ đường dẫn, renderer chỉ nhận tên. */
  chonNhacTep(): Promise<{ ok: boolean; loi?: string; ten?: string }>;
}

// ── Bộ kiểm đầu vào (main dùng) ───────────────────────────────────────────────

export function kiemId(v: unknown): string | null {
  return typeof v === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(v) ? v : null;
}

/** Mã mục thư viện = tên thư mục con (đã kiểm không có dấu phân cách / `..`). */
export function kiemMucId(v: unknown): string | null {
  if (typeof v !== 'string' || !v || v.length > 255) return null;
  if (/[\\/\u0000]/.test(v) || v === '.' || v === '..') return null;
  return v;
}

export function kiemTuyChon(v: unknown, macDinh: { lang: NgonNgu; goc: number; nhip: Nhip; nhacNen: CaiDat['nhacNen'] }): TuyChonViec {
  const o = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  const lang = o.lang === 'zh' || o.lang === 'en' || o.lang === 'auto' ? o.lang : macDinh.lang;
  const goc = typeof o.goc === 'number' && Number.isFinite(o.goc) ? Math.round(Math.min(0.4, Math.max(0, o.goc)) * 100) / 100 : macDinh.goc;
  const nhip = o.nhip === 'tang-toc' || o.nhip === 'cho-giong' ? o.nhip : macDinh.nhip;
  const ten = typeof o.tenVideo === 'string' ? o.tenVideo.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 200) : '';
  const nhacNen = chuanHoaNhacNen(o.nhacNen, macDinh.nhacNen);
  return { lang, goc, nhip, nhacNen, ...(ten ? { tenVideo: ten } : {}) };
}

/** Link video: chỉ http(s), không mang tài khoản/mật khẩu. */
export function kiemLink(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  if (s.length > 2048) return null;
  try {
    const u = new URL(s);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    if (u.username || u.password) return null;
    return u.toString();
  } catch {
    return null;
  }
}
