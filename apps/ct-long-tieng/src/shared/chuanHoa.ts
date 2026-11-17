/**
 * Chuẩn hoá phản hồi máy chủ về đúng kiểu trong `hopDong.ts`. Hàm thuần — có test.
 *
 * API đang dựng song song với app, nên đọc RỘNG tay: `{ success, data }` hoặc trả thẳng; danh sách là mảng hoặc
 * `{ jobs | items | ds: [...] }`; id số hoặc chuỗi. Trường lạ ⇒ bỏ qua, trường thiếu ⇒ mặc định an toàn.
 */
import type { BaiNhac, LoaiKetQua, NgonNgu, Nhip, PhieuTaiLen, TaoViecRa, TepKetQua, TrangThaiMayChu, Viec } from './hopDong';

type Obj = Record<string, unknown>;
const laObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const chuoi = (v: unknown): string | null => (typeof v === 'string' && v.trim() !== '' ? v : null);
const so = (v: unknown): number | null => {
  const n = typeof v === 'string' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
};

/** Gỡ lớp `{ success, data }` nếu có. */
export function boc(body: unknown): unknown {
  if (laObj(body) && 'data' in body && (('success' in body) || Object.keys(body).length <= 3)) return body.data;
  return body;
}

const TRANG_THAI: readonly TrangThaiMayChu[] = ['cho_tai_len', 'cho', 'tai', 'lam', 'xong', 'loi', 'huy'];
const LOAI: readonly LoaiKetQua[] = ['vi', 'vi-goc', 'srt-vi', 'srt-goc', 'thong-tin'];

function trangThai(v: unknown): TrangThaiMayChu {
  const s = typeof v === 'string' ? v.toLowerCase().replace(/-/g, '_') : '';
  return (TRANG_THAI as readonly string[]).includes(s) ? (s as TrangThaiMayChu) : 'cho';
}

export function chuanHoaTep(v: unknown): TepKetQua | null {
  if (!laObj(v)) return null;
  const loai = chuoi(v.loai);
  const url = chuoi(v.url);
  const ten = chuoi(v.ten);
  if (!loai || !(LOAI as readonly string[]).includes(loai) || !url || !ten) return null;
  return { loai: loai as LoaiKetQua, ten, url, kichThuoc: so(v.kichThuoc) ?? 0 };
}

export function chuanHoaViec(v: unknown): Viec | null {
  if (!laObj(v)) return null;
  const id = v.id ?? v._id;
  if (typeof id !== 'string' && typeof id !== 'number') return null;
  const tep = laObj(v.tep) ? v.tep : null;
  const lang = chuoi(v.lang);
  const goc = so(v.goc);
  const pt = so(v.phanTram);
  return {
    id: String(id),
    url: chuoi(v.url),
    tenTep: chuoi(tep?.ten) ?? chuoi(v.tenTep),
    tenVideo: chuoi(v.tenVideo) ?? chuoi(v.ten) ?? chuoi(v.tieuDe),
    lang: lang === 'zh' || lang === 'en' ? (lang as NgonNgu) : 'auto',
    goc: goc === null ? 0.15 : Math.min(0.4, Math.max(0, goc)),
    nhip: v.nhip === 'tang-toc' ? 'tang-toc' : ('cho-giong' as Nhip),
    trangThai: trangThai(v.trangThai),
    buoc: chuoi(v.buoc),
    phanTram: pt === null ? null : Math.min(100, Math.max(0, pt)),
    loi: chuoi(v.loi),
    ketQua: Array.isArray(v.ketQua) ? v.ketQua.map(chuanHoaTep).filter((t): t is TepKetQua => !!t) : [],
    thoiLuong: so(v.thoiLuong),
    tao: chuoi(v.tao) ?? chuoi(v.createdAt) ?? new Date(0).toISOString(),
    xong: chuoi(v.xong) ?? chuoi(v.finishedAt),
  };
}

export function chuanHoaDanhSach(body: unknown): Viec[] {
  const d = boc(body);
  const mang = Array.isArray(d) ? d : laObj(d) ? (d.jobs ?? d.items ?? d.ds ?? d.viec) : null;
  if (!Array.isArray(mang)) return [];
  return mang.map(chuanHoaViec).filter((x): x is Viec => !!x);
}

export function chuanHoaTaoViec(body: unknown): TaoViecRa | null {
  const d = boc(body);
  if (!laObj(d)) return null;
  const viec = chuanHoaViec(laObj(d.job) ? d.job : laObj(d.viec) ? d.viec : d);
  if (!viec) return null;
  return { viec, taiLen: phieu(d.taiLen), taiLenNhac: phieu(d.taiLenNhac) };
}

function phieu(v: unknown): PhieuTaiLen | null {
  return laObj(v) && chuoi(v.url) ? { url: chuoi(v.url)!, het: chuoi(v.het) } : null;
}

export function chuanHoaNhac(body: unknown): BaiNhac[] {
  const d = boc(body);
  const mang = Array.isArray(d) ? d : laObj(d) ? (d.nhac ?? d.items ?? d.ds) : null;
  if (!Array.isArray(mang)) return [];
  const ra: BaiNhac[] = [];
  for (const v of mang) {
    if (!laObj(v)) continue;
    const id = v.id;
    const ten = chuoi(v.ten);
    if ((typeof id !== 'string' && typeof id !== 'number') || !ten) continue;
    ra.push({
      id: String(id), ten, tamTrang: chuoi(v.tamTrang), giay: so(v.giay),
      nghiThu: chuoi(v.nghiThu), nguon: chuoi(v.nguon), giayPhep: chuoi(v.giayPhep),
    });
  }
  return ra;
}

/** Thông điệp lỗi người đọc được từ thân phản hồi lỗi. */
export function thongDiepLoi(body: unknown, maHttp: number): string {
  if (laObj(body)) {
    const m = chuoi(body.message) ?? chuoi(body.loi) ?? chuoi(body.error);
    if (m) return m;
  }
  if (maHttp === 401) return 'Mã kết nối không đúng hoặc đã bị thu hồi.';
  if (maHttp === 403) return 'Tài khoản này không được dùng CT Lồng Tiếng.';
  if (maHttp === 404) return 'Không tìm thấy (máy chủ chưa có tính năng này, hoặc việc đã bị xoá).';
  if (maHttp === 429) return 'Gửi quá nhanh — chờ một chút rồi thử lại.';
  if (maHttp >= 500) return `Máy chủ đang lỗi (HTTP ${maHttp}). Thử lại sau.`;
  return `Yêu cầu lỗi (HTTP ${maHttp}).`;
}
