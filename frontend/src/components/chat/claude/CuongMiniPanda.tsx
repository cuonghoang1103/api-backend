'use client';

/**
 * 🐻 CuongMini — linh vật Gấu pixel của /chat (11/11/2026, thay con gấu trúc SVG cũ).
 *
 * Giữ NGUYÊN API cũ (size/state/className/title) nên mọi chỗ đang gọi — lời chào, logo thanh bên, dấu ở
 * đầu/cuối câu trả lời, banner — tự đổi sang Gấu pixel. Bên trong uỷ quyền cho {@link GauPixel} mode="face"
 * (chỉ con gấu, vuông). Cảnh đầy đủ "lấy máy ra gõ → biển DONE" là GauPixel mode="desk", dùng ở khối
 * "Đang suy nghĩ" trong CtcMessage.
 *
 * state 'still' (cũ, cho sprite tĩnh ở landing) ⇒ map sang 'idle'.
 */
import { GauPixel } from './GauPixel';

export function CuongMiniPanda({
  size = 32,
  state = 'idle',
  className = '',
  title,
}: {
  size?: number;
  state?: 'idle' | 'thinking' | 'still';
  className?: string;
  /** Có tiêu đề ⇒ là ảnh có nghĩa (role=img); không ⇒ trang trí (aria-hidden). */
  title?: string;
}) {
  return <GauPixel size={size} state={state} mode="face" className={`cmp ${className}`} title={title} />;
}

/**
 * Chữ "CuongMini" — wordmark: "Cuong" chữ serif đậm màu chữ, "Mini" chữ gradient tím thương hiệu,
 * kèm nhãn nhỏ tuỳ chọn (vd. "Pro").
 */
export function CuongMiniWordmark({ size = 19, badge }: { size?: number; badge?: string }) {
  return (
    <span className="cmw" style={{ fontSize: size }}>
      <span className="cmw-a">Cuong</span><span className="cmw-b">Mini</span>
      {badge && <span className="cmw-badge">{badge}</span>}
    </span>
  );
}
