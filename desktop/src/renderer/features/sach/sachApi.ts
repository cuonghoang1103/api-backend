/**
 * Thư viện sách (05/10/2026) — dữ liệu + tiến độ đọc.
 *
 * Danh mục sách dùng THẲNG dữ liệu của web (`@/app/books/booksData`): 41 tập, 2 bộ.
 * Tiến độ đọc lưu trên máy chủ (`/api/v1/books/tien-do`, docSach.service.ts) — đọc
 * trên máy này, mở máy khác vẫn về đúng chỗ.
 */
import { BOOK_GROUPS, SKILL_BOOKS, BOOK_LOGOS, SERIES_STATS, type Book } from '@/app/books/booksData';
import type { ApiClient } from '../../api/client';

export { BOOK_LOGOS, SERIES_STATS, type Book };

export type BoSach = 'cong-nghe' | 'ky-nang';
export type SachMuc = Book & { slug: string; bo: BoSach; ke: string; tiengViet: boolean };

const slugOf = (file: string) => file.replace(/\.html$/, '');
export const TAT_CA_SACH: SachMuc[] = [
  ...BOOK_GROUPS.flatMap((g) => g.books.map((b) => ({ ...b, slug: slugOf(b.file), bo: 'cong-nghe' as const, ke: g.title, tiengViet: false }))),
  ...SKILL_BOOKS.map((b) => ({ ...b, slug: slugOf(b.file), bo: 'ky-nang' as const, ke: 'Kỹ năng toàn diện', tiengViet: true })),
].filter((b, i, a) => a.findIndex((x) => x.slug === b.slug) === i);
export const KE_SACH: { ten: string; mo: string; bo: BoSach; sach: SachMuc[] }[] = [
  ...BOOK_GROUPS.map((g) => ({ ten: g.title, mo: g.desc, bo: 'cong-nghe' as const, sach: TAT_CA_SACH.filter((s) => s.ke === g.title) })),
  { ten: 'Kỹ năng toàn diện', mo: 'Mười sáu cuốn về con người: tự quản, tư duy, giao tiếp, làm việc nhóm, sự nghiệp, tài chính.', bo: 'ky-nang' as const, sach: TAT_CA_SACH.filter((s) => s.bo === 'ky-nang') },
].filter((k) => k.sach.length > 0);
export const sachTheoSlug = (slug: string) => TAT_CA_SACH.find((s) => s.slug === slug);

export type DauTrang = { p: number; c: number; t: string; at: string };
export type TienDoSach = { slug: string; chapter: number; percent: number; seconds: number; bookmarks: DauTrang[]; startedAt: string; lastReadAt: string; finishedAt: string | null };
export type TongQuanDoc = { homNay: string; giayHomNay: number; chuoiNgay: number; soNgayDaDoc: number; tuan: { day: string; giay: number }[]; sach: TienDoSach[] };

export const layTongQuan = (api: ApiClient) => api.request<TongQuanDoc>('/api/v1/books/tien-do');
export const ghiNhip = (api: ApiClient, slug: string, b: { chapter: number; percent: number; giay: number; bookmarks?: DauTrang[] }) =>
  api.request<TienDoSach>(`/api/v1/books/tien-do/${slug}`, { method: 'PUT', body: b });
export const xoaTienDo = (api: ApiClient, slug: string) => api.request(`/api/v1/books/tien-do/${slug}`, { method: 'DELETE' });

/* ── Tuỳ chọn đọc (theo máy) ───────────────────────────────────────── */
export type NenDoc = 'tu-dong' | 'sang' | 'giay' | 'toi';
export type CheDoNgonNgu = 'en' | 'bi' | 'vi';
export type TuyChonDoc = { co: number; nen: NenDoc; rong: 'vua' | 'rong'; ngonNgu: CheDoNgonNgu; mucTieuPhut: number };
const KHOA_TUY_CHON = 'ct-sach-tuy-chon';
export const TUY_CHON_MAC_DINH: TuyChonDoc = { co: 1, nen: 'tu-dong', rong: 'vua', ngonNgu: 'en', mucTieuPhut: 20 };
export function docTuyChon(): TuyChonDoc {
  try { return { ...TUY_CHON_MAC_DINH, ...(JSON.parse(localStorage.getItem(KHOA_TUY_CHON) ?? '{}') as Partial<TuyChonDoc>) }; } catch { return TUY_CHON_MAC_DINH; }
}
export function luuTuyChon(t: TuyChonDoc) { try { localStorage.setItem(KHOA_TUY_CHON, JSON.stringify(t)); } catch { /* bỏ qua */ } }

export const webOrigin = () => (globalThis as { __ctWebOrigin?: string }).__ctWebOrigin ?? 'https://cuongthai.com';
export const logoUrl = (vol: string) => (BOOK_LOGOS[vol] ? `${webOrigin()}/books/logos/${BOOK_LOGOS[vol]}.svg` : null);

export function phut(giay: number): string {
  const m = Math.round(giay / 60);
  if (m < 60) return `${m} phút`;
  return `${Math.floor(m / 60)} giờ ${m % 60 ? `${m % 60} phút` : ''}`.trim();
}
