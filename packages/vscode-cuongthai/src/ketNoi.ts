/**
 * Mặt giao tiếp chung của hai đường chạy AI Code:
 *  • `CauNoi`   — qua app desktop CuongThai đang mở (cầu nối 127.0.0.1)
 *  • `LoiDocLap` — ngay trong VS Code, không cần app (đăng nhập bằng tài khoản web)
 */
export interface KetNoi {
  readonly cheDo: 'app' | 'docLap';
  readonly phienBan: string;
  trangThai(): Promise<{ ok: boolean; phienBan: string; mucNoLuc?: string }>;
  goi<T = unknown>(kenh: string, duLieu?: unknown): Promise<T>;
  datThuMuc(cuocId: string, duong: string): Promise<unknown>;
  moDuPhong(matKhau: string): Promise<string>;
  /** Cổng Claude chính hãng (mật khẩu riêng) — trả tên cổng. */
  moCongAnthropic(matKhau: string, model?: string): Promise<string>;
  chuanHoaAnh(dataUrl: string): Promise<string>;
  /** Nghe sự kiện. Trả hàm huỷ. `dong` được gọi khi luồng đứt (app tắt…). */
  nghe(nhan: (kenh: string, duLieu: unknown) => void, dong: () => void): () => void;
}
