/**
 * Dấu CuongMini — linh vật GẤU PIXEL (11/11/2026, thay gấu trúc SVG đất sét cũ; ngang với web /chat
 * `frontend/.../claude/GauPixel.tsx`). Kiểu mascot Claude Code: pixel gọn, KHÔNG miệng, biểu cảm dồn vào mắt.
 *
 * Giữ NGUYÊN API cũ (`co` = cỡ, `dangChay` = đang nghĩ) nên mọi chỗ gọi — logo thanh bên, dấu đầu/cuối câu
 * trả lời — tự đổi. Bên trong uỷ quyền cho {@link GauPixel} mode="face". Cảnh đầy đủ "lấy máy ra gõ → DONE"
 * là GauPixel mode="desk" (dùng ở {@link DangNghi}).
 */
import { GauPixel } from './GauPixel';

export function CtcDau({ co = 22, dangChay = false }: { co?: number; dangChay?: boolean }) {
  return <GauPixel size={co} state={dangChay ? 'thinking' : 'idle'} mode="face" className="ctc-dau ctc-gau" />;
}

/** Chữ "CuongMini": "Cuong" serif đậm + "Mini" nghiêng gradient tím thương hiệu. */
export function CtcWordmark({ co = 18 }: { co?: number }) {
  return (
    <span className="ctc-wm" style={{ fontSize: co }}>
      <span className="ctc-wm-a">Cuong</span><span className="ctc-wm-b">Mini</span>
    </span>
  );
}
