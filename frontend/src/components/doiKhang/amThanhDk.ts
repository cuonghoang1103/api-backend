/**
 * Âm thanh riêng của bàn cờ (05/10/2026): tiếng quân gỗ gõ xuống bàn — tổng hợp bằng Web Audio,
 * không tải tệp. Tôn trọng nút tắt tiếng chung của mục Trò chơi (`tatTieng()` trong amThanh.ts).
 * Âm còn lại (chiếu, tới lượt, thắng/thua, đánh bài) dùng `sfx` chung.
 */
import { sfx, tatTieng } from '@/components/games/shared/amThanh';

let ctx: AudioContext | null = null;
function layCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
  return ctx;
}

/** Một tiếng "cốc" gỗ: tiếng ồn ngắn lọc dải + một nốt trầm tắt rất nhanh. */
function coc(t0: number, manh: number, cao = 1) {
  const c = layCtx();
  if (!c) return;
  const t = c.currentTime + t0;
  const dai = 0.07;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dai), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4);
  const src = c.createBufferSource();
  src.buffer = buf;
  const loc = c.createBiquadFilter();
  loc.type = 'bandpass';
  loc.frequency.value = 1400 * cao;
  loc.Q.value = 3.5;
  const g = c.createGain();
  g.gain.value = 0.55 * manh;
  src.connect(loc).connect(g).connect(c.destination);
  src.start(t);

  const o = c.createOscillator();
  const go = c.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(240 * cao, t);
  o.frequency.exponentialRampToValueAtTime(120 * cao, t + 0.09);
  go.gain.setValueAtTime(0.0001, t);
  go.gain.exponentialRampToValueAtTime(0.35 * manh, t + 0.004);
  go.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
  o.connect(go).connect(c.destination);
  o.start(t);
  o.stop(t + 0.13);
}

export type AmBan = 'di' | 'an' | 'chieu' | 'danhBai' | 'toiLuot' | 'thang' | 'thua' | 'hoa' | 'loiMoi' | 'chat';

export function amBan(ten: AmBan) {
  if (tatTieng()) return;
  try {
    switch (ten) {
      case 'di': coc(0, 1); break;
      case 'an': coc(0, 1.1, 0.9); coc(0.055, 0.8, 1.15); break;
      case 'chieu': coc(0, 1); sfx('sai'); break;
      case 'danhBai': sfx('lat'); break;
      case 'toiLuot': sfx('dem'); break;
      case 'thang': sfx('thang'); break;
      case 'thua': sfx('thua'); break;
      case 'hoa': sfx('gop'); break;
      case 'loiMoi': sfx('batDau'); break;
      case 'chat': sfx('bam'); break;
    }
  } catch { /* trình duyệt chặn âm thanh — bàn vẫn chạy */ }
}
