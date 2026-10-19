'use client';

/** Nối hàng phát chảy dần (`hangPhat.ts`) vào bộ phát dùng chung của khoá học (`audio.ts`). */
import { play, stopAudio, tamDungAudio, tiepAudio } from '../audio';
import { taoHangPhat as taoLoi, type HangPhat } from './hangPhat';

/* Nhịp nói (19/10/2026) — người dùng: "nói 1 mạch, không ngắt câu". Mỗi câu là một (vài) tệp; trước đây
   phát nối sát nhau. Người thật nghỉ một nhịp giữa hai câu, và đổi hơi khi chuyển Việt ↔ ngoại ngữ
   (giọng máy nhà trả mỗi đoạn một tệp). Câu ĐẦU không chờ — tiếng đầu tiên vẫn ra ngay. */
const NGHI_GIUA_CAU = 380;
const NGHI_GIUA_DOAN = 170;

export type { HangPhat };
export function taoHangPhat(o: { onHet: () => void; onBatDau?: () => void }): HangPhat {
  let soCau = 0;
  return taoLoi(o, {
    play: (urls, onEnd) => {
      const clips = urls.map((u) => ({ text: '', sfx: u }));
      void play(soCau++ ? [{ text: '', pauseMs: NGHI_GIUA_CAU }, ...clips] : clips, onEnd, { gapMs: urls.length > 1 ? NGHI_GIUA_DOAN : 0 });
    },
    stopAudio, tamDungAudio, tiepAudio,
  });
}
