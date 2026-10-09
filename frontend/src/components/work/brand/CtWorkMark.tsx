/**
 * Logo CT Work (mark "Flow Check") dạng SVG nội tuyến — không tải ảnh, nên chạy y hệt trên web lẫn app desktop
 * (app chạy ở app:// — ảnh đường dẫn tương đối sẽ vỡ, xem anhTuyetDoi).
 *
 * Hình lấy từ ctWorkBrand.ts (cùng nguồn với favicon/PNG). Hiệu ứng nằm ở ctWorkMark.css (`.ctw-mark*`), chỉ CSS:
 *   animate="intro" — vẽ dần một lần khi gắn (chấm bật lên → nét ngắn → nét dài), ~0,8 s
 *   animate="loop"  — lặp cho màn tải (2,6 s/vòng, có nhịp "nảy" khi dấu tích hoàn thành)
 *   animate="hover" — vẽ lại khi rê chuột lên chính nó hoặc phần tử cha có class `ctw-mark-host`
 * prefers-reduced-motion ⇒ tắt mọi hiệu ứng, hiện hình tĩnh hoàn chỉnh.
 */
import { useId, useMemo } from 'react';
import { markBody } from './ctWorkBrand';
import './ctWorkMark.css';

export interface CtWorkMarkProps {
  size?: number;
  animate?: 'none' | 'intro' | 'loop' | 'hover';
  /** color = ô gradient (mặc định); mono = ô màu chữ hiện tại, glyph khoét rỗng; glyph = chỉ dấu tích. */
  variant?: 'color' | 'mono' | 'glyph';
  /** Có ⇒ role="img" + nhãn; không ⇒ trang trí (aria-hidden), chữ bên cạnh đã nói tên. */
  title?: string;
  className?: string;
}

export function CtWorkMark({ size = 28, animate = 'none', variant = 'color', title, className }: CtWorkMarkProps) {
  // Mỗi SVG nội tuyến cần id gradient/filter RIÊNG — trùng id thì bản sau dùng nhầm defs của bản trước (hoặc mất
  // hẳn khi bản trước bị ẩn bằng display:none). useId có dấu ':' / '«' ⇒ lọc về ký tự an toàn cho url(#…).
  const rawId = useId();
  const idPrefix = `ctwm${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const html = useMemo(
    () => markBody({ variant, px: size, idPrefix, animatable: true, monoColor: 'currentColor' }),
    [variant, size, idPrefix],
  );
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      className={['ctw-mark', animate !== 'none' && `ctw-mark--${animate}`, className].filter(Boolean).join(' ')}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      // Nội dung là hằng số dựng từ ctWorkBrand.ts (không có dữ liệu người dùng).
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default CtWorkMark;
