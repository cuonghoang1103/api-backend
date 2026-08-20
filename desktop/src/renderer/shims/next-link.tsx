/**
 * Thay thế `next/link` cho app desktop.
 *
 * Cây Ngoại ngữ và Lộ trình của web dùng `<Link>` 12 chỗ, và chỉ với ba thuộc
 * tính: `href`, `className`, `style` (thêm một `onClick` và một `aria-label`).
 * Đo thật 20/08/2026.
 *
 * ⚠️ PHẢI CHẶN hành vi mặc định của thẻ <a>. App chạy ở origin `app://cuongthai`
 * và không có server định tuyến; để trình duyệt đi theo `href` là nó rời khỏi
 * ứng dụng và không có đường quay lại — cửa sổ trắng, không lỗi nào để thấy.
 *
 * Giữ nguyên thẻ <a> kèm `href` thật (thay vì dựng <button>) vì hai lý do:
 * chuột phải "mở trong tab mới" vẫn thấy đường dẫn, và các bộ chọn CSS của web
 * viết cho `a` vẫn khớp.
 */
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useRouter } from './next-navigation';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children?: ReactNode;
  /** Có trong API của Next; ở đây không có gì để nạp trước. */
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

export default function Link({
  href, children, onClick, prefetch: _prefetch, replace, scroll: _scroll, ...rest
}: Props) {
  const router = useRouter();

  const bam = (e: MouseEvent<HTMLAnchorElement>): void => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    /* Bấm kèm phím bổ trợ hay bằng nút giữa: để nguyên cho hệ điều hành xử lý,
       đúng như trên web. Không kiểm thì Ctrl+bấm cũng bị nuốt. */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (replace) router.replace(href); else router.push(href);
  };

  return <a href={href} onClick={bam} {...rest}>{children}</a>;
}
