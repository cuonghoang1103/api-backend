'use client';
/**
 * Âm thanh "cute" của phòng lab — tổng hợp bằng Web Audio, KHÔNG tải tệp nào (cùng cách với
 * components/games/shared/amThanh.ts: vài nốt sine/triangle ngắn, bao hình mềm). Khác game ở chỗ:
 *   • âm lượng thấp hơn (đây là chỗ học, không phải chỗ chơi), nén nhẹ để nhiều tiếng chồng không vỡ;
 *   • KHÔNG kêu trước cú bấm/phím đầu tiên của người dùng (trình duyệt cũng chặn), kể cả khi đang bật;
 *   • tab bị ẩn ⇒ tạm dừng AudioContext (im hẳn), hiện lại ⇒ chạy tiếp;
 *   • mặc định BẬT, trừ khi người dùng đã tắt "âm thanh giao diện" của cả web (lib/amThanhUi.ts) — lựa chọn riêng
 *     của phòng lab nhớ ở localStorage `lab:am-thanh` (bọc try/catch: chế độ riêng tư vẫn chạy được).
 *   • chế độ quay video: mọi tiếng (kể cả khi tắt) được ghi vào window.__labSfxLog = [{ t, name }] để bước dựng video
 *     (Remotion) chèn lại đúng tiếng đúng lúc — quay màn hình không thu được âm thanh.
 *
 * Khung mô phỏng gắn `data-im` ⇒ tiếng "bấm nút" chung của web im trong phòng lab, không kêu chồng.
 */
import { docCaiDat } from '@/lib/amThanhUi';

export type LabSfx =
  | 'tap' | 'on' | 'off' | 'tick' | 'blip-fetch' | 'blip-decode' | 'blip-exec' | 'hit' | 'miss'
  | 'step-ok' | 'right' | 'wrong' | 'oops' | 'thud' | 'done' | 'start' | 'whoosh' | 'pop';

const KHOA = 'lab:am-thanh';
let ctx: AudioContext | null = null;
let tong: GainNode | null = null;
let daBam = false;
let ganNghe = false;
const lanCuoi: Partial<Record<LabSfx, number>> = {};
let recordT0 = 0;
let recordOn = false;

function docBat(): boolean {
  try {
    const v = localStorage.getItem(KHOA);
    if (v === '1') return true;
    if (v === '0') return false;
  } catch { /* riêng tư */ }
  try { return docCaiDat().bat !== false; } catch { return true; }
}
let bat: boolean | null = null;
export const labSoundOn = () => (bat ??= typeof window === 'undefined' ? false : docBat());
export function setLabSound(v: boolean) {
  bat = v;
  try { localStorage.setItem(KHOA, v ? '1' : '0'); } catch { /* riêng tư */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('lab:am-thanh', { detail: v }));
  if (v) { daBam = true; labSfx('pop'); }
}

/** Gắn một lần: cú bấm/phím đầu tiên mở khoá; tab ẩn thì im. */
export function ensureListeners() {
  if (ganNghe || typeof window === 'undefined') return;
  ganNghe = true;
  const mo = () => { daBam = true; if (ctx?.state === 'suspended' && !document.hidden) void ctx.resume().catch(() => undefined); };
  window.addEventListener('pointerdown', mo, { capture: true, passive: true });
  window.addEventListener('keydown', mo, { capture: true });
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) void ctx.suspend().catch(() => undefined);
    else if (daBam) void ctx.resume().catch(() => undefined);
  });
}

/** Chế độ quay: bắt đầu ghi nhật ký tiếng (mốc 0 = lúc gọi). */
export function startSfxLog() {
  recordOn = true;
  recordT0 = performance.now();
  (window as unknown as { __labSfxLog: unknown[] }).__labSfxLog = [];
}

function layCtx(): AudioContext | null {
  if (typeof window === 'undefined' || !daBam || document.hidden) return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC({ latencyHint: 'interactive' }); } catch { return null; }
    tong = ctx.createGain();
    tong.gain.value = 0.18;
    const nen = ctx.createDynamicsCompressor();
    nen.threshold.value = -20; nen.ratio.value = 4;
    tong.connect(nen).connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
  return ctx;
}

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
  g.gain.exponentialRampToValueAtTime(0.9 * vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dai);
  o.connect(g).connect(tong);
  o.start(t);
  o.stop(t + dai + 0.03);
}

const N = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5, G6: 1568 };

/** Phát một tiếng. Chống dồn: cùng tiếng không phát lại trong 40 ms. */
export function labSfx(name: LabSfx) {
  if (typeof window === 'undefined') return;
  if (recordOn) {
    const log = (window as unknown as { __labSfxLog?: Array<{ t: number; name: string }> }).__labSfxLog;
    log?.push({ t: Math.round(performance.now() - recordT0), name });
  }
  if (!labSoundOn()) return;
  ensureListeners();
  const now = performance.now();
  if ((lanCuoi[name] ?? -1e9) > now - 40) return;
  lanCuoi[name] = now;
  try {
    switch (name) {
      case 'tap': not(1200, 0, 0.035, 'triangle', 0.3); break;
      case 'on': not(740, 0, 0.06, 'triangle', 0.5, 1040); break;
      case 'off': not(620, 0, 0.06, 'triangle', 0.42, 420); break;
      case 'tick': not(1500, 0, 0.025, 'sine', 0.22); break;
      case 'blip-fetch': not(N.C6, 0, 0.05, 'sine', 0.4); break;
      case 'blip-decode': not(N.E6, 0, 0.05, 'sine', 0.38); break;
      case 'blip-exec': not(N.G6, 0, 0.06, 'triangle', 0.36); break;
      case 'hit': not(N.A5 * 2, 0, 0.18, 'sine', 0.42); not(N.E6 * 2, 0.02, 0.22, 'sine', 0.18); break;
      case 'miss': not(220, 0, 0.14, 'triangle', 0.55, 150); break;
      case 'step-ok': not(N.E5, 0, 0.09, 'triangle', 0.5); not(N.A5, 0.07, 0.16, 'triangle', 0.5); break;
      case 'right': [N.C6, N.E6, N.G6].forEach((f, i) => not(f, i * 0.06, 0.16, 'sine', 0.4)); break;
      case 'wrong': not(311, 0, 0.1, 'triangle', 0.4, 233); not(220, 0.08, 0.16, 'sine', 0.4, 180); break;
      case 'oops': not(660, 0, 0.09, 'sine', 0.45, 440); not(440, 0.09, 0.14, 'sine', 0.4, 300); break;
      case 'thud': not(130, 0, 0.26, 'sine', 0.7, 70); not(98, 0.05, 0.3, 'triangle', 0.35, 60); break;
      case 'done': [N.G5, N.C6, N.E6, N.G6].forEach((f, i) => not(f, i * 0.08, 0.2, 'triangle', 0.45)); not(N.C6, 0.36, 0.4, 'sine', 0.3); break;
      case 'start': not(N.C5, 0, 0.08, 'triangle', 0.45); not(N.G5, 0.08, 0.14, 'triangle', 0.45); break;
      case 'whoosh': not(300, 0, 0.18, 'sine', 0.3, 900); break;
      case 'pop': not(700, 0, 0.1, 'sine', 0.45, 340); break;
    }
  } catch { /* trình duyệt chặn âm thanh — mô phỏng vẫn chạy */ }
}
