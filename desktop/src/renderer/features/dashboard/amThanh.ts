/**
 * ============================================================
 * ÂM THANH — sinh bằng WebAudio, KHÔNG kèm file nhạc nào
 * ============================================================
 *
 * Vì sao không dùng file `.mp3`:
 *  • Bản cài phình thêm vài trăm KB cho vài tiếng "ting".
 *  • File nhạc phải qua CSP và qua đường `app://`, tức thêm một chỗ nữa để
 *    hỏng câm khi đóng gói (đúng kiểu lỗi "chạy ở dev, im ở bản cài").
 *  • Sinh bằng dao động thì đổi giai điệu chỉ là sửa một mảng số.
 *
 * ─── Vì sao ÂM THANH lại đáng làm ───
 * Người dùng nói thẳng: muốn "cute chút để có động lực lập kế hoạch". Một tiếng
 * chuông ngắn khi tick xong việc là phần thưởng tức thì — thứ duy nhất trong
 * app xảy ra ĐÚNG lúc họ làm xong một việc thật.
 *
 * ⚠️ Trình duyệt CHẶN âm thanh trước cú tương tác đầu tiên của người dùng.
 * `AudioContext` tạo ra lúc nạp trang sẽ ở trạng thái `suspended` và mọi tiếng
 * đều im — không lỗi, không cảnh báo. Vì thế: tạo LƯỜI (lần phát đầu tiên, tức
 * là sau một cú bấm) và luôn `resume()` trước khi phát.
 */

/** Một nốt: tần số (Hz), lúc bắt đầu (giây, so với lúc phát), độ dài (giây). */
interface Not { f: number; t: number; d: number }

/** Âm lượng chung. Đủ nghe, không giật mình — đây là tiếng nền lúc làm việc. */
const AM_LUONG = 0.16;

let ctx: AudioContext | null = null;
let batAm = true;

/** Bật/tắt. Gọi từ nơi đọc cài đặt của người dùng. */
export function datBatAm(bat: boolean): void { batAm = bat; }
export function dangBatAm(): boolean { return batAm; }

function layCtx(): AudioContext | null {
  if (!batAm) return null;
  try {
    ctx ??= new AudioContext();
    /* `resume()` mỗi lần: hệ điều hành cũng treo context khi máy ngủ dậy, không
       chỉ lần đầu. Không gọi lại thì sau một giấc ngủ trưa là app im tiếng. */
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null; // không có WebAudio thì im lặng, đừng làm hỏng cú bấm
  }
}

/**
 * Phát một chuỗi nốt.
 *
 * Dùng sóng `triangle`: tròn và mềm hơn `square` (chói như game 8-bit) mà vẫn
 * có màu sắc hơn `sine` (nghe như tiếng bíp máy đo). Bao thư tăng-giảm mượt để
 * không có tiếng "tạch" ở hai đầu — cắt biên độ đột ngột luôn tạo ra nó.
 */
function phat(nhac: Not[], song: OscillatorType = 'triangle'): void {
  const c = layCtx();
  if (!c) return;
  const bd = c.currentTime + 0.01;
  for (const n of nhac) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = song;
    osc.frequency.setValueAtTime(n.f, bd + n.t);
    gain.gain.setValueAtTime(0, bd + n.t);
    gain.gain.linearRampToValueAtTime(AM_LUONG, bd + n.t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, bd + n.t + n.d);
    osc.connect(gain).connect(c.destination);
    osc.start(bd + n.t);
    osc.stop(bd + n.t + n.d + 0.02);
  }
}

/* Tần số các nốt dùng tới — viết tên ra để sửa giai điệu không phải tra bảng. */
const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880.0, C6 = 1046.5, E6 = 1318.5;

/** Tick xong một việc: hai nốt đi lên, gọn và vui. */
export function keuXongViec(): void {
  phat([{ f: E5, t: 0, d: 0.09 }, { f: A5, t: 0.07, d: 0.16 }]);
}

/** Bỏ tick: cùng hai nốt nhưng đi XUỐNG — tai hiểu ngay là "hoàn lại". */
export function keuBoTick(): void {
  phat([{ f: A5, t: 0, d: 0.07 }, { f: E5, t: 0.06, d: 0.12 }]);
}

/** Xong HẾT việc hôm nay: một câu bốn nốt, dài hơn hẳn để nó ra dáng phần thưởng. */
export function keuXongHet(): void {
  phat([
    { f: C5, t: 0, d: 0.11 }, { f: E5, t: 0.09, d: 0.11 },
    { f: G5, t: 0.18, d: 0.13 }, { f: C6, t: 0.28, d: 0.34 },
  ]);
}

/** Nhắc việc: hai nốt cách quãng, nghe như tiếng gõ cửa nhẹ. Cố ý KHÔNG vui. */
export function keuNhac(): void {
  phat([{ f: D5, t: 0, d: 0.16 }, { f: G5, t: 0.19, d: 0.26 }]);
}

/** Thêm một việc mới: một nốt rất ngắn, chỉ để xác nhận cú bấm đã ăn. */
export function keuThem(): void {
  phat([{ f: E6, t: 0, d: 0.055 }], 'sine');
}

/** Nghe thử — dùng ở nút bật/tắt trong cài đặt. */
export function keuThu(): void { keuXongViec(); }
