'use client';

/** Nối hàng phát chảy dần (`hangPhat.ts`) vào bộ phát dùng chung của khoá học (`audio.ts`). */
import { play, stopAudio, tamDungAudio, tiepAudio } from '../audio';
import { taoHangPhat as taoLoi, type HangPhat } from './hangPhat';

export type { HangPhat };
export function taoHangPhat(o: { onHet: () => void; onBatDau?: () => void }): HangPhat {
  return taoLoi(o, {
    play: (urls, onEnd) => { void play(urls.map((u) => ({ text: '', sfx: u })), onEnd); },
    stopAudio, tamDungAudio, tiepAudio,
  });
}
