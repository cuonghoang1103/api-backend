/** CT Lồng Tiếng — tiện ích dùng chung của trang /admin/long-tieng. */
import { getFriendlyErrorMessage, type ApiError } from '@/lib/api';
import type { KetQua, TrangThaiViec, Viec } from '@/lib/longTieng';

/** Lỗi 4xx của tuyến này mang câu tiếng Việt cụ thể (LT_…) — giữ nguyên; còn lại dùng câu chung của web. */
export const loi = (e: unknown) => {
  if (e instanceof Error && !(e as ApiError).isAxiosError) return e.message;
  const r = (e as ApiError).response;
  const m = r?.data?.message;
  if (r && m && r.status !== 401 && r.status !== 403 && (r.status < 500 || r.status === 502)) return m;
  return getFriendlyErrorMessage(e as ApiError);
};
export const kb = (n: number) => (n >= 1e9 ? `${(n / 1e9).toFixed(2)} GB` : n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);
export const phut = (s: number | null) => (s == null ? '' : s >= 3600
  ? `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(Math.round(s % 60)).padStart(2, '0')}`
  : `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`);
export const ngay = (s: string) => new Date(s).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });

export const DANG_CHAY: TrangThaiViec[] = ['cho_tai_len', 'cho', 'tai', 'lam'];

export const NHAN_TRANG_THAI: Record<TrangThaiViec, { chu: string; mau: string }> = {
  cho_tai_len: { chu: 'Chờ tải lên', mau: 'var(--lt-warn)' },
  cho: { chu: 'Đang xếp hàng', mau: 'var(--lt-info)' },
  tai: { chu: 'Đang tải video', mau: 'var(--lt-accent-text)' },
  lam: { chu: 'Đang lồng tiếng', mau: 'var(--lt-accent-text)' },
  xong: { chu: 'Xong', mau: 'var(--lt-ok)' },
  loi: { chu: 'Lỗi', mau: 'var(--lt-err)' },
  huy: { chu: 'Đã huỷ', mau: 'var(--lt-text-3)' },
};

export const NHAN_KET_QUA: Record<KetQua['loai'], { ten: string; ngan: string }> = {
  vi: { ten: 'Video giọng Việt', ngan: 'VI' },
  'vi-goc': { ten: 'Video song ngữ', ngan: 'Song ngữ' },
  'srt-vi': { ten: 'Phụ đề tiếng Việt', ngan: 'SRT Việt' },
  'srt-goc': { ten: 'Phụ đề gốc', ngan: 'SRT gốc' },
  'thong-tin': { ten: 'Thông tin việc', ngan: 'JSON' },
};

export const tenViec = (v: Viec) => v.tenVideo || v.tep?.ten || v.url || v.id;
export const nhanNgonNgu = (l: string) => (l === 'zh' ? 'Tiếng Trung' : l === 'en' ? 'Tiếng Anh' : 'Tự nhận ngôn ngữ');
export const nhanNhac = (l: string) => (l === 'goc' ? 'Nhạc gốc' : l === 'thu-vien' ? 'Nhạc thư viện' : l === 'tep' ? 'Nhạc của tôi' : 'Không nhạc');

/** "YouTube" / "Bilibili" / tên miền — nhận ra link vừa dán. */
export function nhanNguon(url: string): string | null {
  try {
    const h = new URL(url.trim()).hostname.replace(/^www\.|^m\./, '');
    if (/(^|\.)youtube\.com$|^youtu\.be$/.test(h)) return 'YouTube';
    if (/(^|\.)bilibili\.com$|^b23\.tv$/.test(h)) return 'Bilibili';
    if (/(^|\.)douyin\.com$/.test(h)) return 'Douyin';
    if (/(^|\.)tiktok\.com$/.test(h)) return 'TikTok';
    if (/(^|\.)vimeo\.com$/.test(h)) return 'Vimeo';
    return h || null;
  } catch { return null; }
}

export const laVideo = (f: File) => /^video\//.test(f.type) || /\.(mp4|mkv|mov|webm|m4v|avi|flv|ts)$/i.test(f.name);

/** localStorage bọc try/catch — chỉ cho tiện nghi riêng từng người (tuỳ chọn nhớ, thẻ đã thu gọn, mẫu tiến độ). */
export function docNho<T>(khoa: string, macDinh: T): T {
  try { const r = window.localStorage.getItem(khoa); return r ? (JSON.parse(r) as T) : macDinh; } catch { return macDinh; }
}
export function ghiNho(khoa: string, v: unknown) {
  try { window.localStorage.setItem(khoa, JSON.stringify(v)); } catch { /* riêng tư / đầy — bỏ qua */ }
}

export const giamChuyenDong = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
