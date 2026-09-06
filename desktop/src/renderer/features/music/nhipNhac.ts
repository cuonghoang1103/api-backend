/**
 * ============================================================
 * ĐỌC NHỊP NHẠC — cho cảnh đêm nhảy theo tiếng
 * ============================================================
 *
 * `AnalyserNode` của Web Audio đọc được cường độ âm thanh theo thời gian thực.
 * Nhưng nó CHỈ đọc được khi nguồn âm cùng gốc hoặc có CORS: thiếu là trình
 * duyệt trả về một dải toàn số 0 — không lỗi, không cảnh báo, chỉ là im lặng.
 *
 * ─── Vì sao có đường lùi, dù đã đo CORS ───
 * Đo thật 05/09/2026: `api.cuongthai.com` trả `access-control-allow-origin:
 * app://cuongthai`, và `media.cuongthai.com` trả `*`. Nên về nguyên tắc là chạy.
 *
 * NHƯNG `crossOrigin="anonymous"` phải đặt TRƯỚC khi nạp, và nếu một nguồn nào
 * đó (bài cũ, CDN khác, một redirect chưa lường) thiếu header thì bài đó
 * KHÔNG PHÁT ĐƯỢC — hỏng hẳn một thứ đang chạy để đổi lấy một hiệu ứng. Vì thế
 * `thuLai()` bỏ `crossOrigin` và nạp lại; lần đó mất nhịp nhưng nhạc vẫn kêu.
 *
 * Thà mất hiệu ứng còn hơn mất tiếng.
 */

export interface DoNhip {
  /** 0..1 — mức năng lượng hiện tại, đã làm mượt. */
  muc: () => number;
  /** Gỡ bỏ, trả `<audio>` về trạng thái ban đầu. */
  dong: () => void;
}

/** Làm mượt: nhảy lên nhanh, tụt xuống chậm — mắt thấy nhịp rõ hơn giá trị thô. */
const LEN = 0.55;
const XUONG = 0.09;

export function doNhip(el: HTMLAudioElement): DoNhip | null {
  let ctx: AudioContext;
  let phanTich: AnalyserNode;
  let nguon: MediaElementAudioSourceNode;
  try {
    ctx = new AudioContext();
    nguon = ctx.createMediaElementSource(el);
    phanTich = ctx.createAnalyser();
    phanTich.fftSize = 256;
    phanTich.smoothingTimeConstant = 0.75;
    /*
     * ⚠️ PHẢI nối tiếp ra loa. `createMediaElementSource` CƯỚP âm thanh khỏi
     * thẻ <audio>: từ lúc đó tiếng chỉ ra qua đồ thị Web Audio. Quên nối
     * `destination` là nhạc TẮT HẲN mà thanh tiến độ vẫn chạy — trông y hệt
     * một bài bị lỗi âm.
     */
    nguon.connect(phanTich);
    phanTich.connect(ctx.destination);
  } catch {
    return null; // trình duyệt chặn, hoặc phần tử đã bị nối trước đó
  }

  const dai = new Uint8Array(phanTich.frequencyBinCount);
  let muot = 0;

  return {
    muc: () => {
      if (ctx.state === 'suspended') void ctx.resume();
      phanTich.getByteFrequencyData(dai);
      /* Chỉ lấy nửa TRẦM của phổ: nhịp trống và bass nằm ở đó, còn nửa cao
         gần như chỉ là tiếng xì — gộp cả dải thì mọi bài đều ra một mức đều
         đều, và cảnh không còn "theo nhạc" nữa. */
      const n = Math.floor(dai.length / 2);
      let tong = 0;
      for (let i = 0; i < n; i++) tong += dai[i]!;
      const tho = tong / n / 255;
      muot += (tho - muot) * (tho > muot ? LEN : XUONG);
      return Math.min(1, Math.max(0, muot));
    },
    dong: () => {
      try {
        nguon.disconnect();
        phanTich.disconnect();
        void ctx.close();
      } catch { /* đã đóng rồi thì thôi */ }
    },
  };
}
