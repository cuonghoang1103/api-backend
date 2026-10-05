/**
 * ÂM THANH DÙNG CHUNG cho mọi game (05/10/2026) — người dùng: "âm thanh cute vui nhộn".
 *
 * Tổng hợp bằng Web Audio (không tải tệp nào): mỗi âm là vài nốt sine/triangle ngắn có
 * bao hình mềm (attack 5ms, nhả dần) ⇒ tròn, dễ thương, không chói. Một AudioContext dùng
 * chung, mở khoá ở cú bấm đầu tiên. Tắt tiếng nhớ ở localStorage `game:tat-tieng`.
 *
 *   import { sfx } from './shared/amThanh';
 *   sfx('dung');              // đúng
 *   sfx('combo', { muc: 3 }); // combo lần 3 — cao dần
 */
export type TenAm =
  | 'bam' | 'dung' | 'sai' | 'combo' | 'lenCap' | 'thang' | 'thua' | 'dem' | 'batDau'
  | 'nhat' | 'truot' | 'no' | 'nhay' | 'chon' | 'lat' | 'gop' | 'sao';

let ctx: AudioContext | null = null;
let tong: GainNode | null = null;
const KHOA = 'game:tat-tieng';

export function tatTieng(): boolean {
  try { return localStorage.getItem(KHOA) === '1'; } catch { return false; }
}
export function datTatTieng(tat: boolean) {
  try { localStorage.setItem(KHOA, tat ? '1' : '0'); } catch { /* bỏ qua */ }
  window.dispatchEvent(new CustomEvent('game:tieng', { detail: { tat } }));
}

function layCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    tong = ctx.createGain();
    tong.gain.value = 0.32;
    // Nén nhẹ để nhiều âm chồng nhau không vỡ tiếng.
    const nen = ctx.createDynamicsCompressor();
    nen.threshold.value = -18; nen.ratio.value = 4;
    tong.connect(nen).connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
  return ctx;
}

/** Một nốt: tần số (Hz), lúc bắt đầu (giây, tính từ bây giờ), dài, kiểu sóng, âm lượng, trượt tần số tới. */
function not(f: number, t0: number, dai: number, kieu: OscillatorType = 'sine', vol = 1, toi?: number) {
  const c = layCtx();
  if (!c || !tong) return;
  const t = c.currentTime + t0;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = kieu;
  o.frequency.setValueAtTime(f, t);
  if (toi) o.frequency.exponentialRampToValueAtTime(toi, t + dai);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.9 * vol, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dai);
  o.connect(g).connect(tong);
  o.start(t);
  o.stop(t + dai + 0.02);
}
/** Tiếng "xì" ngắn (ồn trắng lọc) — cho nổ/trượt. */
function on(t0: number, dai: number, tanSo = 1800, vol = 0.6) {
  const c = layCtx();
  if (!c || !tong) return;
  const t = c.currentTime + t0;
  const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dai)), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = c.createBufferSource();
  s.buffer = buf;
  const loc = c.createBiquadFilter();
  loc.type = 'bandpass'; loc.frequency.value = tanSo; loc.Q.value = 0.8;
  const g = c.createGain();
  g.gain.value = vol;
  s.connect(loc).connect(g).connect(tong);
  s.start(t);
}

const NOT = { C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, E6: 1318.5, G6: 1568 };

export function sfx(ten: TenAm, tuy: { muc?: number } = {}) {
  if (tatTieng()) return;
  try {
    switch (ten) {
      case 'bam': not(880, 0, 0.06, 'triangle', 0.5); break;
      case 'chon': not(660, 0, 0.07, 'triangle', 0.55); not(990, 0.03, 0.06, 'sine', 0.35); break;
      case 'lat': not(520, 0, 0.08, 'triangle', 0.5, 780); break;
      case 'dung': not(NOT.E5, 0, 0.1, 'triangle', 0.7); not(NOT.A5, 0.07, 0.16, 'triangle', 0.7); break;
      case 'sai': not(311, 0, 0.12, 'square', 0.25, 233); not(220, 0.09, 0.18, 'triangle', 0.4, 170); break;
      case 'combo': {
        const m = Math.min(8, tuy.muc ?? 1);
        const goc = 523.25 * 2 ** (m / 12 * 2);
        not(goc, 0, 0.08, 'triangle', 0.6); not(goc * 1.5, 0.05, 0.12, 'sine', 0.55);
        break;
      }
      case 'gop': not(392, 0, 0.07, 'sine', 0.6, 588); not(784, 0.05, 0.1, 'triangle', 0.4); break;
      case 'nhat': not(NOT.C6, 0, 0.06, 'square', 0.18); not(NOT.G6, 0.05, 0.1, 'triangle', 0.45); break;
      case 'sao': [NOT.C6, NOT.E6, NOT.G6].forEach((f, i) => not(f, i * 0.05, 0.14, 'sine', 0.45)); break;
      case 'nhay': not(330, 0, 0.16, 'sine', 0.6, 660); break;
      case 'truot': on(0, 0.18, 900, 0.35); break;
      case 'no': on(0, 0.35, 500, 0.7); not(110, 0, 0.3, 'sine', 0.6, 55); break;
      case 'dem': not(660, 0, 0.09, 'sine', 0.6); break;
      case 'batDau': not(NOT.C5, 0, 0.1, 'triangle', 0.6); not(NOT.G5, 0.09, 0.1, 'triangle', 0.6); not(NOT.C6, 0.18, 0.22, 'triangle', 0.7); break;
      case 'lenCap': [NOT.C5, NOT.E5, NOT.G5, NOT.C6].forEach((f, i) => not(f, i * 0.07, 0.16, 'triangle', 0.6)); not(NOT.E6, 0.3, 0.3, 'sine', 0.5); break;
      case 'thang': [NOT.G5, NOT.C6, NOT.E6, NOT.G6].forEach((f, i) => not(f, i * 0.09, 0.24, 'triangle', 0.6)); [NOT.C6, NOT.E6].forEach((f) => not(f, 0.42, 0.5, 'sine', 0.4)); break;
      case 'thua': [NOT.G5, NOT.E5, NOT.C5].forEach((f, i) => not(f, i * 0.14, 0.22, 'triangle', 0.5)); not(392 / 2, 0.42, 0.45, 'sine', 0.45, 180); break;
    }
  } catch { /* trình duyệt chặn âm thanh — game vẫn chạy */ }
}
