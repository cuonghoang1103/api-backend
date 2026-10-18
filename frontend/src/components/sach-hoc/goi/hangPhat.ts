/**
 * Hàng phát cho lời CuongMini CHẢY DẦN (19/10/2026): máy chủ gửi từng câu (mỗi câu
 * một/vài tệp mp3) trong khi model còn viết — câu đầu tới là phát ngay, câu sau
 * xếp hàng. `xong()` báo "không còn câu nào nữa"; phát hết hàng ⇒ `onHet()`.
 *
 * Lõi THUẦN (không chạm DOM) — `hangPhatAudio.ts` nối nó vào `play()` dùng chung (một phần tử
 * <audio> đã mở khoá trong cú bấm — Safari). Tạm dừng/tiếp tục không hủy lượt.
 */
/** Bộ phát bên dưới — mặc định là `audio.ts` (xem `hangPhatAudio.ts`); test truyền bản giả. */
export interface MayPhat {
  play: (urls: string[], onEnd: () => void) => void;
  stopAudio: () => void;
  tamDungAudio: () => boolean;
  tiepAudio: () => void;
}

export interface HangPhat {
  them: (urls: string[]) => void;
  xong: () => void;
  huy: () => void;
  /** Đang phát (hoặc còn câu chờ) chưa. */
  conPhat: () => boolean;
  /** Lúc câu ĐẦU bắt đầu kêu (ms, performance.now) — để đo. */
  batDauLuc: () => number;
  /** ⏸ Dừng tại chỗ: câu đang kêu dừng giữa chừng, câu mới tới thì xếp hàng chứ không phát. */
  dung: () => void;
  /** ▶ Phát tiếp đúng chỗ. */
  chay: () => void;
  dangDung: () => boolean;
}

export function taoHangPhat(o: { onHet: () => void; onBatDau?: () => void }, may: MayPhat): HangPhat {
  const { play, stopAudio, tamDungAudio, tiepAudio } = may;
  const cho: string[][] = [];
  let dangPhat = false;
  let ketThuc = false;
  let daHuy = false;
  let daBao = false;
  let luc = 0;
  let dungLai = false;
  /** Câu đang kêu dở lúc bấm dừng (phần tử <audio> đang pause) — chạy lại thì `tiepAudio()`. */
  let dangDoDang = false;
  const tiep = () => {
    if (daHuy) return;
    if (dungLai) { dangPhat = false; return; }
    const x = cho.shift();
    if (!x) {
      dangPhat = false;
      if (ketThuc && !daBao) { daBao = true; o.onHet(); }
      return;
    }
    dangPhat = true;
    if (!luc) { luc = performance.now(); o.onBatDau?.(); }
    play(x, () => { if (!daHuy) tiep(); });
  };
  return {
    them(urls) {
      if (daHuy || !urls.length) return;
      cho.push(urls);
      if (!dangPhat && !dungLai) tiep();
    },
    xong() {
      ketThuc = true;
      if (!dangPhat && !cho.length && !daBao && !daHuy && !dungLai) { daBao = true; o.onHet(); }
    },
    huy() { daHuy = true; cho.length = 0; if (dangPhat) stopAudio(); dangPhat = false; },
    conPhat: () => dangPhat || cho.length > 0,
    batDauLuc: () => luc,
    dung() { if (dungLai || daHuy) return; dungLai = true; dangDoDang = dangPhat && tamDungAudio(); },
    chay() {
      if (!dungLai || daHuy) return;
      dungLai = false;
      if (dangDoDang) { dangDoDang = false; tiepAudio(); return; }
      if (!dangPhat) tiep();
    },
    dangDung: () => dungLai,
  };
}
