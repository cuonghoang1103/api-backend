/**
 * ============================================================
 * MÀU — cầu nối RGB565 của firmware sang CSS
 * ============================================================
 *
 * Firmware giữ màu ở dạng RGB565 (16 bit: 5 đỏ, 6 lục, 5 lam) vì đó
 * là thứ chip màn nhận. Mô phỏng cố ý **giữ nguyên mấy con số hex ấy**
 * thay vì chép sang mã màu CSS cho dễ đọc.
 *
 * Vì sao: mục đích của trang này là "thấy trên web đúng như sẽ thấy
 * trên robot". Chép tay `0x07FF` thành `#00FFFF` là đã dịch một lần —
 * và mỗi lần dịch là một chỗ để lệch, mà lệch màu thì không ai phát
 * hiện được bằng mắt cho tới lúc so hai cái cạnh nhau.
 *
 * Giữ hex gốc thì sửa màu trong firmware xong chép thẳng số sang đây,
 * không phải tính toán gì.
 *
 * ⚠️ RGB565 KHÔNG phủ hết RGB888. Kênh đỏ và lam chỉ có 32 mức, lục có
 * 64. Phép mở rộng dưới đây nhân theo tỉ lệ (`×255/31`) chứ không dịch
 * bit thô (`<<3`) — dịch bit làm màu trắng `0x1F` ra `248` chứ không
 * ra `255`, tức trắng bị xám đi một chút ở mọi nơi.
 */

/** RGB565 → chuỗi CSS `rgb(...)`. */
export function css565(c: number): string {
  const r = Math.round((((c >> 11) & 0x1f) * 255) / 31);
  const g = Math.round((((c >> 5) & 0x3f) * 255) / 63);
  const b = Math.round(((c & 0x1f) * 255) / 31);
  return `rgb(${r},${g},${b})`;
}

/** Ba kênh 0..255 → RGB565, đúng macro `RGB()` trong `eyes.cpp`. */
export function rgb565(r: number, g: number, b: number): number {
  return ((r & 0xf8) << 8) | ((g & 0xfc) << 3) | (b >> 3);
}

/**
 * Trộn hai màu RGB565 theo tỉ lệ `t` (0 = a, 1 = b).
 *
 * Trộn Ở KHÔNG GIAN 565 chứ không ở 888 rồi mới nén lại — `eyes.cpp`
 * làm đúng vậy cho dải chuyển màu của mống mắt, và trộn ở hai không
 * gian khác nhau cho ra hai dải khác nhau ở vùng tối.
 */
export function tron565(a: number, b: number, t: number): number {
  const k = Math.max(0, Math.min(1, t));
  const ar = (a >> 11) & 0x1f, ag = (a >> 5) & 0x3f, ab = a & 0x1f;
  const br = (b >> 11) & 0x1f, bg = (b >> 5) & 0x3f, bb = b & 0x1f;
  const r = Math.round(ar + (br - ar) * k);
  const g = Math.round(ag + (bg - ag) * k);
  const bl = Math.round(ab + (bb - ab) * k);
  return (r << 11) | (g << 5) | bl;
}

/** Nhân độ sáng, dùng cho `Hinh.sang` (pin yếu, đang ngủ). */
export function sang565(c: number, k: number): number {
  return tron565(0x0000, c, k);
}

// ─── Bảng màu màn ngực — chép từ `face.cpp` ───────────────
export const C_BG = 0x0000;       // TFT_BLACK
export const C_EYE = 0x07ff;      // lơ sáng
export const C_EYE_DIM = 0x03bf;  // lơ tối, dùng cho buồn ngủ
export const C_PUPIL = 0x0000;
export const C_SHINE = 0xffff;    // TFT_WHITE
export const C_LOVE = 0xfb56;     // hồng
export const C_ANGRY = 0xfb2c;    // đỏ cam
export const C_DOT_OK = 0x07e0;
export const C_DOT_BAD = 0xf800;
export const C_VANG = 0xffe0;     // "DANG NGHE"
export const C_CAM = 0xfd20;      // "DANG NGHI" + pin 20-50%
