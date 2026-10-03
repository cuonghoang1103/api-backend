/**
 * Chạy trên WEB hay trong APP DESKTOP — những chỗ hai nơi khác nhau (03/10/2026).
 *
 * App desktop dựng lại nguyên các trang khoá học của web (alias `@` → frontend/src),
 * nhưng chạy ở `app://cuongthai/index.html`:
 *  - `window.location.search` KHÔNG mang `?bai=`/`?buoi=`/`?chang=` — app giữ chuỗi
 *    truy vấn trong kho riêng của shim `next/navigation`. App gắn cửa nối
 *    `__CT_TRUY_VAN__` (features/web/TrangWeb.tsx) để đọc/ghi đúng kho đó; ghi
 *    thẳng `history.replaceState` thì vừa không có tác dụng vừa để truy vấn cũ
 *    dính lại trên URL thật cho trang sau đọc nhầm.
 *  - Tệp tĩnh `/audio/*.mp3` không có trong gói app ⇒ phải xin bằng địa chỉ tuyệt
 *    đối (anhTuyetDoi; tên miền API cũng phục vụ tệp tĩnh của web — đo 03/10).
 *  - CSP của app chặn mọi khung nhúng (`frame-src 'none'`, cố ý) ⇒ video YouTube
 *    mở bằng trình duyệt hệ thống.
 * Trên web mọi hàm ở đây trả đúng hành vi cũ.
 */
import { anhTuyetDoi } from '@/lib/anhTuyetDoi';

type CauNoi = { doc: () => string; ghi: (q: string) => void; duong?: () => string };
const g = globalThis as { __CT_TRUY_VAN__?: CauNoi };

/** Có cầu nối `window.cuongthai` của preload ⇒ đang trong app desktop. */
export function laAppDesktop(): boolean {
  return typeof window !== 'undefined' && !!(window as { cuongthai?: unknown }).cuongthai;
}

/** Chuỗi truy vấn của trang đang mở (web: URL thật; app: kho của shim). */
export function docTruyVan(): URLSearchParams {
  if (g.__CT_TRUY_VAN__) return new URLSearchParams(g.__CT_TRUY_VAN__.doc());
  return new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
}

/** Đường dẫn của trang đang mở (web: URL thật; app: route của app, không phải /index.html). */
export function docDuong(): string {
  if (g.__CT_TRUY_VAN__?.duong) return g.__CT_TRUY_VAN__.duong();
  return typeof window === 'undefined' ? '' : window.location.pathname;
}

/** Sửa chuỗi truy vấn tại chỗ — không điều hướng, không tải lại. */
export function ghiTruyVan(sua: (q: URLSearchParams) => void): void {
  const q = docTruyVan();
  sua(q);
  if (g.__CT_TRUY_VAN__) { g.__CT_TRUY_VAN__.ghi(q.toString()); return; }
  const u = new URL(window.location.href);
  u.search = q.toString();
  window.history.replaceState(null, '', u);
}

/** Tệp tĩnh của web (`/audio/…`) — tương đối trên web, tuyệt đối trong app. */
export function tepTinh(duong: string): string {
  return anhTuyetDoi(duong);
}
