/**
 * Link trong chữ AI viết ⇒ đường trong app nếu nó trỏ vào CT Work (`/work/…`, hoặc URL tuyệt đối cùng origin), để bấm
 * là MỞ ĐÚNG thẻ/trang ngay trong cửa sổ này thay vì bật tab mới (app desktop: không văng ra trình duyệt). Lược đồ lạ
 * (`javascript:`, `ct://`…) đã bị react-markdown (+ rehype-sanitize) bóc thành rỗng trước khi tới đây.
 */
export function inAppPath(href: string | undefined | null, origin: string | null = typeof window === 'undefined' ? null : window.location.origin): string | null {
  if (!href) return null;
  if (href === '/work' || href.startsWith('/work/')) return href;
  if (!origin) return null;
  try {
    const u = new URL(href);
    if (u.origin === origin && (u.pathname === '/work' || u.pathname.startsWith('/work/'))) return `${u.pathname}${u.search}${u.hash}`;
  } catch { /* không phải URL tuyệt đối */ }
  return null;
}

/** Cú bấm nên để trình duyệt tự lo (Ctrl/⌘/Shift/Alt, chuột giữa) — khi đó KHÔNG chặn để mở tab mới như link thường. */
export const isModifiedClick = (e: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; defaultPrevented: boolean }) =>
  e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
