/**
 * HỢP ĐỒNG LUẬT CHƠI ĐỐI KHÁNG (05/10/2026) — xem docs/doi-khang-spec.md.
 *
 * Mỗi trò (cờ vua, cờ tướng, tiến lên, caro) xuất MỘT đối tượng `LuatTro<S, M>`. Thuần TS, không
 * DOM/Node/Prisma, không thư viện ngoài. Trạng thái S và nước M là JSON thuần.
 *
 * Mã này chạy ở HAI nơi: máy chủ (trọng tài — kiểm mọi nước) và giao diện (gợi ý nước hợp lệ,
 * bot chơi offline). Bản frontend chép bằng `scripts/dong-bo-luat-doi-khang.mjs` — đừng sửa bản chép.
 */
export type MaTro = 'co-vua' | 'co-tuong' | 'tien-len' | 'caro';
export type CapDoBot = 1 | 2 | 3;

export interface KetQua {
  /** Ghế thắng (tiến lên: người về nhất; mảng `thuHang` cho thứ tự đủ). Rỗng nếu hoà. */
  thang: number[];
  hoa: boolean;
  /** Mã lý do: 'chieu-het' | 'bi' | 'het-nuoc' | 'nam-lien' | 'het-bai' | 'hoa-50' | 'lap-3' | 'thieu-quan'
   *  | 'het-gio' | 'dau-hang' | 'thoat' | 'thoa-thuan' | 'day-ban'. */
  lyDo: string;
  /** Tiến lên: thứ tự về (ghế), người đầu = nhất. */
  thuHang?: number[];
}

export interface LuatTro<S, M> {
  ma: MaTro;
  soNguoi: { min: number; max: number };
  /** `seed` để chia bài / chọn bên tái lập được (máy chủ lưu seed). */
  khoiTao(soNguoi: number, seed: number): S;
  /** Ghế đang tới lượt (0-based). */
  luot(s: S): number;
  /** null nếu hợp lệ, ngược lại là câu lỗi tiếng Việt ngắn cho người chơi đọc. Phải chịu được `m` rác (dữ liệu từ mạng). */
  kiemTra(s: S, ghe: number, m: unknown): string | null;
  /** Thuần — trả trạng thái MỚI, không sửa `s`. Chỉ gọi sau khi kiemTra trả null. */
  apDung(s: S, ghe: number, m: M): S;
  /** Mọi nước hợp lệ của ghế đang tới lượt (tiến lên: các bộ đánh được + 'bo-luot' nếu được bỏ). */
  cacNuoc(s: S): M[];
  ketThuc(s: S): KetQua | null;
  /** Thông tin ghế `ghe` được thấy (tiến lên giấu bài người khác, chỉ lộ số lá). ghe = null: người xem. */
  nhinTu(s: S, ghe: number | null): unknown;
  /** Bot chọn nước cho ghế đang tới lượt. Phải xong < 1,5 giây (cấp 3) trên máy thường. */
  nuocBot(s: S, capDo: CapDoBot, ngauNhien: () => number): M;
  /** Một dòng mô tả nước cho lịch sử ("e2–e4", "Pháo 2 bình 5", "Đôi 7", "H8"). */
  moTa(s: S, m: M): string;
}
