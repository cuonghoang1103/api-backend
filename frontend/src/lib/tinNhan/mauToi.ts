import type { CSSProperties } from 'react';

/**
 * Bảng chữ TỐI cố định cho khung Tin nhắn.
 *
 * Nền của khung Tin nhắn được tô CỨNG màu tối (#1a1b26…), nhưng chữ lại đọc
 * biến giao diện `--text-*`. Ở giao diện SÁNG (web chọn "Sáng", và app desktop
 * mặc định sáng) biến đó là chữ gần đen ⇒ chữ đen trên nền đen: tên người, chữ
 * xem trước, bong bóng tin đến gần như không đọc được (đo bằng ảnh chụp app
 * desktop 14/10/2026). Ghim bộ biến tối ngay trên gốc khung — và trên mọi thứ
 * vẽ qua portal ra `document.body` (menu, trình xem ảnh, hộp chuyển tiếp), vì
 * portal không thừa kế biến từ gốc khung.
 */
export const MAU_TOI: CSSProperties = {
  ['--text-primary' as string]: '#e4e6eb',
  ['--text-secondary' as string]: '#b0b3b8',
  ['--text-muted' as string]: '#8a8d91',
  // Lớp `text-text-muted/70` (biến CSS + độ mờ) KHÔNG sinh ra ở Tailwind 3 — chữ
  // rơi về màu THỪA KẾ. Đặt màu gốc sáng để chỗ nào lọt cũng vẫn đọc được.
  color: '#e4e6eb',
  colorScheme: 'dark',
};
