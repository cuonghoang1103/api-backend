/**
 * CuongMini thu nhỏ cho khung gia sư — nay là GẤU PIXEL (11/11/2026; thay robot CSS tím/trắng trước đó),
 * ngang với web /chat + app desktop (cùng {@link GauPixel}). Giữ API `size`/`nghi`.
 *
 * `nghi`: đang soạn câu trả lời ⇒ Gấu ở tư thế đang nghĩ (gõ gấp). Tôn trọng prefers-reduced-motion.
 */
import { GauPixel } from '../chat/claude/GauPixel';

export function MiniCuong({ size = 44, nghi = false }: { size?: number; nghi?: boolean }) {
  return <GauPixel size={size} state={nghi ? 'thinking' : 'idle'} mode="face" className="mc-gaupx" />;
}
