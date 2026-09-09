/**
 * ============================================================
 * VỊ TRÍ CON ROBOT TRONG APP — kẹp theo CỠ THẬT, không theo hằng số
 * ============================================================
 *
 * `.odin-dock` neo bằng `right: phai` và `bottom: calc(statusbar + duoi)`, rồi
 * thu nhỏ bằng `transform: scale()` với gốc dưới-phải.
 *
 * ─── LUẬT KẸP CŨ SAI Ở HAI CHỖ ───
 * ```js
 * Math.min(phaiMoi, window.innerWidth  - 80)
 * Math.min(duoiMoi, window.innerHeight - 80)
 * ```
 * `80` là một con số gõ tay, không phải cỡ của con robot.
 *
 *  • Bề NGANG: mép trái nhìn thấy = `innerWidth - phai - rong`. Với trần
 *    `innerWidth - 80` thì nó thành `80 - rong`. Dock rộng hơn 80px ⇒ **âm** ⇒
 *    robot thò ra ngoài mép trái.
 *  • Bề DỌC: mép trên = `innerHeight - statusbar - duoi - cao`. Với trần
 *    `innerHeight - 80` thì nó thành `80 - statusbar - cao` — âm chắc chắn,
 *    vì riêng thanh trạng thái đã 30px và con robot cao hơn 50px nhiều. Kéo
 *    lên trên là đầu robot bị cắt cụt bên trên mép cửa sổ.
 *
 * Nên hàm này nhận CỠ ĐO ĐƯỢC của phần tử (`getBoundingClientRect()` trả về
 * hộp SAU biến hình, nên nó đã tính cả `scale`) thay vì đoán.
 */

export interface KhungKep {
  /** Bề rộng/cao THẬT của dock sau `scale`, đo bằng `getBoundingClientRect()`. */
  rong: number;
  cao: number;
  cuaRong: number;
  cuaCao: number;
  /** Chiều cao thanh trạng thái — `bottom` của dock tính từ MÉP TRÊN của nó. */
  thanhTrangThai: number;
}

/** Chừa một chút mép để robot không dính sát cạnh cửa sổ. */
const LE = 4;

/**
 * Kẹp cặp (phải, dưới) sao cho dock nằm TRỌN trong cửa sổ.
 *
 * Cửa sổ hẹp hơn cả con robot thì ưu tiên giữ nó dính mép phải/dưới — đó là
 * chỗ mặc định và là chỗ ít che nội dung nhất.
 */
export function kepDock(phai: number, duoi: number, k: KhungKep): { phai: number; duoi: number } {
  const phaiMax = Math.max(LE, k.cuaRong - k.rong - LE);
  const duoiMax = Math.max(LE, k.cuaCao - k.thanhTrangThai - k.cao - LE);
  return {
    phai: Math.round(Math.min(Math.max(phai, LE), phaiMax)),
    duoi: Math.round(Math.min(Math.max(duoi, LE), duoiMax)),
  };
}

/**
 * Dock có đang nằm ngoài cửa sổ không — dùng để kẹp lại sau khi đổi cỡ cửa sổ.
 *
 * Không có phép kiểm này thì thu nhỏ cửa sổ là robot ra ngoài vùng nhìn thấy
 * và không còn cách nào lôi lại: cử chỉ mở khoá kéo nằm trên chính con robot.
 */
export function ngoaiKhung(phai: number, duoi: number, k: KhungKep): boolean {
  const o = kepDock(phai, duoi, k);
  return o.phai !== Math.round(phai) || o.duoi !== Math.round(duoi);
}
