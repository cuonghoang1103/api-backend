/**
 * Kiểu của `dist/loi.js` (lõi độc lập) nhìn từ extension. `loi.ts` nằm ngoài
 * tsconfig của extension (nó kéo mã desktop) nên mặt giao tiếp khai ở đây —
 * sửa chữ ký trong `loi.ts` thì sửa cả chỗ này.
 */
import type { VoDocLap } from './electron';
import type { PhienDangNhap } from './authThay';

export interface LoiApi {
  khoiDong(v: VoDocLap): void;
  datPhien(p: PhienDangNhap | null): void;
  goi(kenh: string, duLieu?: unknown): Promise<unknown>;
  datThuMuc(cuocId: string, duong: string): Promise<unknown>;
  moDuPhong(matKhau: string, token: string): Promise<string>;
  /**
   * Cổng Claude chính hãng: mật khẩu riêng ⇒ vé (lưu trong thiết đặt của lõi).
   * Cũng gọi được bằng `goi('agent:moCongAnthropic', { matKhau })`; trạng thái +
   * các cổng: `goi('agent:congAnthropic')`; chọn cổng phụ cho tab:
   * `goi('agent:datCongPhu', { cuocId, cong: 'modelapi' | null, model? })`.
   * Bản lõi cũ không có.
   */
  moCongAnthropic?(matKhau: string): Promise<{ ten: string; hetHan: number | null }>;
  chuanHoaAnh(dataUrl: string): Promise<string>;
  /** Trình duyệt AI (Chrome/Edge thật) đang nối chưa — để hiện "Đã nối trình duyệt". Bản lõi cũ không có. */
  trangThaiTrinhDuyet?(): { ketNoi: boolean; url: string; trinhDuyet: string | null };
  /** Đóng trình duyệt AI + trình duyệt ẩn xuất sơ đồ (gọi lúc tắt extension/CLI). */
  dongTrinhDuyet?(): Promise<void>;
}
