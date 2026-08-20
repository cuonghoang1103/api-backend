/**
 * Thay thế `next/image` cho app desktop.
 *
 * `next/image` là một trình tối ưu ảnh chạy TRÊN MÁY CHỦ Next: nó viết lại
 * `src` thành `/_next/image?url=…&w=…` để server sinh bản đã co và đổi định
 * dạng. App desktop không có server đó, nên đường dẫn ấy chỉ trả 404 — ảnh
 * trắng, không lỗi nào để thấy.
 *
 * Ở đây trả về một thẻ <img> thường với `src` gốc. Mất phần tối ưu, đổi lấy
 * ảnh hiện ra. Ảnh trong cây Ngoại ngữ tới từ R2 và vốn đã đúng cỡ.
 *
 * `width`/`height`/`sizes`/`quality`/`priority`/`fill` được NHẬN rồi bỏ, trừ
 * `fill` — nó đổi hẳn bố cục (ảnh phủ kín khối cha) nên phải dựng lại bằng CSS,
 * không thì ảnh sập về cỡ tự nhiên và phá layout.
 */
import type { CSSProperties, ImgHTMLAttributes } from 'react';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  unoptimized?: boolean;
};

export default function Image({
  src, alt, width, height, fill,
  sizes: _sizes, quality: _quality, priority, unoptimized: _unoptimized,
  style, ...rest
}: Props) {
  const kieu: CSSProperties = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }
    : { ...style };

  return (
    <img
      src={src}
      alt={alt}
      {...(fill ? {} : { width, height })}
      /* `priority` của Next nghĩa là nạp sớm; tương đương gần nhất ở đây là
         tắt nạp-lười, chứ không phải bỏ qua thuộc tính. */
      loading={priority ? 'eager' : 'lazy'}
      style={kieu}
      {...rest}
    />
  );
}
