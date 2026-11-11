'use client';

/**
 * 🐻 CuongMini — linh vật Gấu pixel của /chat (11/11/2026). Thay con gấu trúc SVG cũ.
 *
 * Hai chế độ:
 *  - mode="face" (VUÔNG): chỉ con gấu pixel — dùng cho lời chào, logo, dấu ở đầu/cuối câu trả lời.
 *      state 'idle'|'still' ⇒ đứng yên cute (cỡ lớn nhún nhẹ, chớp mắt); 'thinking' ⇒ gõ gấp (chăm chú);
 *      'done' ⇒ mắt cười ^^ + lấp lánh.
 *  - mode="desk" (RỘNG): cả cảnh — Gấu ngoảnh sang trái LẤY MÁY RA GÕ (màn hình chạy code, phím sáng),
 *      khi xong thì GẤP MÁY, ngoảnh mặt lại, GIƠ BIỂN "DONE ✓". Dùng cho khối "Đang suy nghĩ".
 *
 * Phong cách mascot Claude Code: pixel gọn, KHÔNG miệng (biểu cảm dồn vào mắt). Vẽ bằng canvas + scale
 * pixelated nên nét. Chỉ chạy requestAnimationFrame khi cần (thinking/done, hoặc idle cỡ lớn) ⇒ nhẹ.
 * prefers-reduced-motion ⇒ vẽ một khung tĩnh, không lặp.
 */
import { useEffect, useRef } from 'react';

type Mode = 'face' | 'desk';
export type GauState = 'idle' | 'thinking' | 'still' | 'done';

const U = 4;
const C = {
  k: '#2b2d35', w: '#f7f5f0', s: '#e6e1d6', pk: '#ff9eb5', am: '#f59e0b',
  lap: '#2b2d35', lapIn: '#16303a', deckT: '#8b93a0', deck: '#4a515c', key: '#c7cfd8', keyHit: '#ffffff',
  code: ['#6ee7b7', '#93c5fd', '#fcd34d', '#f7f5f0'], sign: '#fffdf9', signB: '#2b2d35', ok: '#22c55e',
  nose: '#3a2f33', hl: '#5a5f6b', spark: '#ffd264',
};
const BODY = [
  '..KK......KK....', '.KKKK....KKKK...', '.WWWWWWWWWWWWWW.', 'WWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWW', 'WWWWWWWWWWWWWWWW', 'W~WWWWWWWWWWWW~W', 'WWWWWWWWWWWWWWWW',
  '.WWWWWWWWWWWWWW.', '..OOOOOOOOOOOO..', '..WWWWWWWWWWWW..', '..WWWWWWWWWWWW..',
  '..WSSWWWWSSWWW..', '...WWWWWWWWWW...',
];
const MAPCOL: Record<string, string | null> = { '.': null, K: C.k, W: C.w, S: C.s, '~': C.pk, O: C.am };
const FONT: Record<string, string[]> = {
  D: ['110', '101', '101', '101', '110'], O: ['111', '101', '101', '101', '111'],
  N: ['101', '111', '111', '111', '101'], E: ['111', '100', '110', '100', '111'],
};
const clamp = (x: number) => Math.max(0, Math.min(1, x));

function makeP(g: CanvasRenderingContext2D) {
  return (x: number, y: number, col: string, w = 1, h = 1) => {
    g.fillStyle = col;
    g.fillRect(Math.round(x * U), Math.round(y * U), w * U, h * U);
  };
}
function eye(P: ReturnType<typeof makeP>, ex: number, ey: number, type: string, look = 0) {
  if (type === 'open') { P(ex + look, ey, C.k, 2, 2); P(ex + look, ey, C.hl, 1, 1); }
  else if (type === 'happy') { P(ex + 1, ey, C.k); P(ex, ey + 1, C.k); P(ex + 2, ey + 1, C.k); }
  else if (type === 'blink') { P(ex, ey + 1, C.k, 3, 1); }
  else if (type === 'wide') { P(ex + look, ey - 0.5, C.k, 2, 3); P(ex + look, ey - 0.5, C.hl, 1, 1); }
  else if (type === 'closed') { P(ex, ey + 1, C.k, 3, 1); }
  else if (type === 'half') { P(ex, ey + 0.5, C.k, 3, 1); P(ex, ey, C.k, 1, 1); }
  else if (type === 'sad') { P(ex, ey, C.k); P(ex + 1, ey + 1, C.k); P(ex + 2, ey + 1, C.k); }
  else if (type === 'down') { P(ex, ey + 1, C.k, 2, 1); }
  else if (type === 'squint') { P(ex, ey + 0.5, C.k, 2, 1); }
  else if (type === 'up') { P(ex + 1, ey - 0.5, C.k, 2, 2); P(ex + 1, ey - 0.5, C.hl, 1, 1); }
  else if (type === 'teary') { P(ex - 0.5, ey - 0.5, C.k, 3, 3); P(ex, ey, C.w, 1, 1); P(ex - 0.5, ey - 0.5, C.hl, 1, 1); }
  else if (type === 'heart') { P(ex, ey, '#ff6b8a'); P(ex + 2, ey, '#ff6b8a'); P(ex, ey + 1, '#ff6b8a', 3, 1); P(ex + 1, ey + 2, '#ff6b8a'); }
}

/** Vẽ con gấu (đầu + mình) tại gốc (bx,by), nghiêng lean, mắt nhìn look. Không miệng. */
function bear(P: ReturnType<typeof makeP>, T: number, bx: number, by: number, lean: number, look: number, et: string, cheeks: boolean) {
  for (let r = 0; r < BODY.length; r++) for (let c = 0; c < 16; c++) {
    const col = MAPCOL[BODY[r][c]]; if (!col) continue; P(bx + c + lean, by + r, col);
  }
  const ear = Math.round(Math.sin(T * 2.4));
  P(bx + 2 + lean, by - ear - 0.5, C.k, 2, 1); P(bx + 10 + lean, by + ear - 0.5, C.k, 2, 1);
  const exL = bx + 3 + lean, exR = bx + 9 + lean, ey = by + 4;
  eye(P, exL, ey, et, look); eye(P, exR, ey, et, look);
  P(bx + 7 + lean, by + 6, C.nose, 2, 1);
  if (cheeks) { P(bx + 1 + lean, by + 6, C.pk, 1, 1); P(bx + 14 + lean, by + 6, C.pk, 1, 1); }
}

/* ───────────────── EMOTION: 18 cảm xúc Gấu Bíp + talking (vuông 22×22) ─────────────────
   Phủ trọn bộ CamXucGau của hệ /language (không miệng → mắt + đạo cụ + dáng). */
export type EmoGau = 'happy' | 'cheer' | 'sad' | 'think' | 'surprised' | 'sleep' | 'inspect' | 'grade'
  | 'correct' | 'wrong' | 'encourage' | 'love' | 'streak' | 'celebrate' | 'sleepy' | 'miss' | 'lonely' | 'comeback';
interface EmoCfg { eye: string; ear: 0 | 1; pose: string; props: string[] }
const EMO_PIXEL: Record<EmoGau, EmoCfg> = {
  happy: { eye: 'happy', ear: 0, pose: 'bob', props: [] },
  cheer: { eye: 'happy', ear: 0, pose: 'jump', props: ['star', 'sparkle'] },
  sad: { eye: 'sad', ear: 1, pose: 'slump', props: ['tear'] },
  think: { eye: 'up', ear: 0, pose: 'tilt', props: ['dots'] },
  surprised: { eye: 'wide', ear: 0, pose: 'startle', props: ['sparkle'] },
  sleep: { eye: 'closed', ear: 0, pose: 'sit', props: ['zzz'] },
  inspect: { eye: 'squint', ear: 0, pose: 'bend', props: ['lup'] },
  grade: { eye: 'open', ear: 0, pose: 'bob', props: ['stamp'] },
  correct: { eye: 'happy', ear: 0, pose: 'bob', props: ['tick', 'heart'] },
  wrong: { eye: 'open', ear: 1, pose: 'tilt', props: ['sweat'] },
  encourage: { eye: 'happy', ear: 0, pose: 'lean', props: [] },
  love: { eye: 'heart', ear: 0, pose: 'bob', props: ['heartfly'] },
  streak: { eye: 'happy', ear: 0, pose: 'bob', props: ['fire'] },
  celebrate: { eye: 'happy', ear: 0, pose: 'jump', props: ['hat', 'confetti'] },
  sleepy: { eye: 'half', ear: 0, pose: 'sway', props: ['zzz'] },
  miss: { eye: 'teary', ear: 1, pose: 'hug', props: ['heart'] },
  lonely: { eye: 'down', ear: 1, pose: 'sit', props: [] },
  comeback: { eye: 'happy', ear: 0, pose: 'jump', props: ['sparkle', 'star'] },
};
const EC = { star: '#ffcf4d', tear: '#6cc3ff', heart: '#ff6b8a', fire: '#ff7a33', fire2: '#ffd23d', sweat: '#7fd3ff', zzz: '#b9b2c8', lup: '#9fb4c9', hat: '#7c5cff', conf: ['#ff6b8a', '#6cc3ff', '#ffd264', '#7bd18a'], stamp: '#e5484d', tick: '#22c55e', sound: '#8b7cf0', spark: '#ffd264' };
function propFx(P: ReturnType<typeof makeP>, g: CanvasRenderingContext2D, T: number, p: string, bx: number, oy: number) {
  const ph = T % 1.5;
  if (p === 'sparkle') { if (Math.floor(T * 4) % 2) { P(bx + 16, oy + 1, EC.spark); P(bx - 1, oy + 3, EC.spark); P(bx + 17, oy + 4, EC.spark); } }
  else if (p === 'star') { P(bx + 15, oy - 1, EC.star); P(bx + 14, oy, EC.star, 3, 1); P(bx + 15, oy + 1, EC.star); }
  else if (p === 'tear') { const ty = oy + 6 + Math.floor((T * 6) % 4); P(bx + 3, ty, EC.tear); P(bx + 11, ty - 1, EC.tear); }
  else if (p === 'sweat') { const ty = oy + 2 + Math.floor((T * 5) % 3); P(bx + 15, ty, EC.sweat, 1, 2); }
  else if (p === 'zzz') { const yy = oy - 1 - Math.floor((T * 2) % 3); P(bx + 15, yy, EC.zzz); P(bx + 16, yy - 1, EC.zzz, 2, 1); P(bx + 15, yy - 2, EC.zzz, 2, 1); }
  else if (p === 'dots') { const n = Math.floor(T * 3) % 4; for (let i = 0; i < n; i++) P(bx + 15 + i, oy + 2, C.k); }
  else if (p === 'heart') { const fy = oy - 1 - ph * 4; g.globalAlpha = Math.max(0, 1 - ph / 1.5); P(bx + 13, fy, EC.heart); P(bx + 15, fy, EC.heart); P(bx + 12.5, fy + 1, EC.heart, 3, 1); P(bx + 13.5, fy + 2, EC.heart); g.globalAlpha = 1; }
  else if (p === 'heartfly') { for (let i = 0; i < 2; i++) { const q = (T + i * 0.7) % 1.5; g.globalAlpha = Math.max(0, 1 - q / 1.5); const fx = bx + 12 + i * 3; P(fx, oy - 2 - q * 4, EC.heart); P(fx + 2, oy - 2 - q * 4, EC.heart); P(fx - 0.5, oy - 1 - q * 4, EC.heart, 3, 1); g.globalAlpha = 1; } }
  else if (p === 'fire') { const f = Math.floor(T * 8) % 2; P(bx + 15, oy + 2, EC.fire, 2, 3); P(bx + 15, oy + 1 + f, EC.fire2, 1, 1); P(bx + 16, oy + 2, EC.fire2, 1, 1); }
  else if (p === 'confetti') { for (let i = 0; i < 5; i++) { const q = (T * 0.8 + i * 0.3) % 1.4; P(bx + 2 + i * 3, oy - 1 + q * 14, EC.conf[i % 4]); } }
  else if (p === 'hat') { P(bx + 6, oy - 3, EC.hat, 4, 1); P(bx + 7, oy - 4, EC.hat, 2, 1); P(bx + 7.5, oy - 5, EC.hat, 1, 1); }
  else if (p === 'lup') { P(bx + 14, oy + 4, EC.lup, 3, 1); P(bx + 14, oy + 5, EC.lup, 1, 2); P(bx + 16, oy + 5, EC.lup, 1, 2); P(bx + 14, oy + 7, EC.lup, 3, 1); P(bx + 17, oy + 7, C.k, 2, 2); }
  else if (p === 'stamp') { P(bx + 14, oy + 6, EC.stamp, 3, 2); P(bx + 15, oy + 5, C.k, 1, 1); }
  else if (p === 'tick') { P(bx + 14, oy + 6, EC.tick); P(bx + 15, oy + 7, EC.tick); P(bx + 16, oy + 5, EC.tick); P(bx + 17, oy + 4, EC.tick); }
  else if (p === 'sound') { const a = Math.floor(T * 6) % 3; for (let i = 0; i <= a; i++) { P(bx + 16 + i, oy + 4 - i * 0.5, EC.sound, 1, 1 + i); } }
}
function drawEmotion(g: CanvasRenderingContext2D, T: number, emotion: EmoGau, talking: boolean, lookX: number) {
  const P = makeP(g);
  g.clearRect(0, 0, 22 * U, 22 * U);
  const E = EMO_PIXEL[emotion] ?? EMO_PIXEL.happy;
  const bl = (T % 2.8) > 2.64;
  let by = 5, lean = 0, bobF = 4.5, bobA = 1;
  if (E.pose === 'jump') { const c = T % 1.8; by = 5 - (c < 0.55 ? Math.round(Math.sin(c / 0.55 * Math.PI) * 7) : 0); }
  else if (E.pose === 'slump') { by = 7; bobA = 0.5; bobF = 2.2; }
  else if (E.pose === 'sit') { by = 8; bobA = 0.4; bobF = 2; }
  else if (E.pose === 'bend') { by = 7; lean = 1; }
  else if (E.pose === 'tilt') { lean = Math.round(Math.sin(T * 2) * 0.6) + 1; }
  else if (E.pose === 'lean') { lean = -1; }
  else if (E.pose === 'sway') { lean = Math.round(Math.sin(T * 1.6) * 2); by = 6; }
  else if (E.pose === 'startle') { by = 5 - (((T % 1.4) < 0.2) ? 2 : 0); }
  else if (E.pose === 'hug') { by = 6; }
  if (talking) bobF = 7;
  const bob = Math.round(Math.sin(T * bobF) * bobA);
  const bx = 3, oy = by + bob;
  for (let r = 0; r < BODY.length; r++) for (let c = 0; c < 16; c++) { const col = MAPCOL[BODY[r][c]]; if (col) P(bx + c + lean, oy + r, col); }
  const ear = Math.round(Math.sin(T * 2.4));
  if (E.ear) { P(bx + 1 + lean, oy + 2, C.k, 2, 1); P(bx + 11 + lean, oy + 2, C.k, 2, 1); }
  else { P(bx + 2 + lean, oy - ear - 0.5, C.k, 2, 1); P(bx + 10 + lean, oy + ear - 0.5, C.k, 2, 1); }
  const exL = bx + 3 + lean, exR = bx + 9 + lean, ey = oy + 4;
  const le = Math.round(lookX);
  const et = (bl && E.eye !== 'closed' && E.eye !== 'half') ? 'blink' : E.eye;
  eye(P, exL, ey, et, le); eye(P, exR, ey, et, le);
  P(bx + 7 + lean, oy + 6, C.nose, 2, 1);
  P(bx + 1 + lean, oy + 6, C.pk, 1, 1); P(bx + 14 + lean, oy + 6, C.pk, 1, 1);
  const props = talking ? [...E.props, 'sound'] : E.props;
  for (const pr of props) propFx(P, g, T, pr, bx + lean, oy);
  if (E.pose === 'hug') { P(bx + 1 + lean, oy + 9, C.k, 3, 1); P(bx + 12 + lean, oy + 9, C.k, 3, 1); }
}

/* ───────────────── FACE: chỉ con gấu, vuông 22×22 ───────────────── */
function drawFace(g: CanvasRenderingContext2D, T: number, state: GauState) {
  const P = makeP(g);
  g.clearRect(0, 0, 22 * U, 22 * U);
  const bx = 3;
  const typing = state === 'thinking';
  const bob = Math.round(Math.sin(T * (typing ? 6 : 2.6)) * (typing ? 1.1 : 0.8));
  const by = 4 + bob;
  let et = 'open', look = 0;
  if (typing) { et = (T % 2.4) > 2.24 ? 'blink' : 'open'; look = 0; }
  else if (state === 'done') { et = (T % 3) > 2.85 ? 'blink' : 'happy'; }
  else { et = (T % 3.4) > 3.26 ? 'blink' : (Math.sin(T * 0.7) > 0.6 ? 'happy' : 'open'); look = Math.round(Math.sin(T * 0.5) * 0.6); }
  bear(P, T, bx, by, 0, look, et, state !== 'thinking' ? Math.sin(T * 2.2) > 0.1 : Math.sin(T * 3) > 0.4);
  // gõ gấp: hai tay chạm nhẹ phía trước
  if (typing) {
    const tap = Math.floor(T * 7) % 2;
    P(bx + 4, by + 13 + (tap ? 0 : -1), C.k, 2, 1);
    P(bx + 9, by + 13 + (tap ? -1 : 0), C.k, 2, 1);
  }
  if (state === 'done') { const b = (Math.floor(T * 4) % 2); if (b) { P(bx + 16, by + 1, C.spark); P(bx - 1, by + 3, C.spark); } }
}

/* ───────────────── DESK: cả cảnh laptop + biển DONE, rộng 33×26 ───────────────── */
function laptop(g: CanvasRenderingContext2D, P: ReturnType<typeof makeP>, T: number, amt: number, fold: number, hit: string, press: number) {
  if (amt <= 0.02) return null;
  g.save(); g.globalAlpha = Math.min(1, amt);
  const slide = (1 - amt) * 7;
  const sx = 2 - slide, sy = 5, sw = 7, shFull = 11, sh = Math.max(1, Math.round(shFull * (1 - fold)));
  g.fillStyle = 'rgba(0,0,0,.13)'; g.fillRect((sx - 1) * U, (sy + shFull + 1) * U, (sw + 6) * U, U);
  const topY = sy + (shFull - sh);
  P(sx, topY, C.lap, sw, sh);
  if (sh > 3) {
    P(sx + 1, topY + 1, C.lapIn, sw - 2, sh - 3);
    const lines: [string, number][] = [['#6ee7b7', 3], ['#93c5fd', 4], ['#fcd34d', 2], ['#f7f5f0', 4], ['#93c5fd', 3]];
    const scroll = Math.floor(T * 3) % 5;
    for (let i = 0; i < 5; i++) { const ln = lines[(i + scroll) % 5]; const yy = topY + 2 + i * 1.5; if (yy > topY + sh - 3) break; P(sx + 2, yy, ln[0], ln[1], 1); }
  }
  P(sx, sy + shFull, C.k, sw, 1);
  const dx = sx + 1, dy = sy + shFull + 1, dw = 9;
  P(dx, dy, C.deckT, dw, 1); P(dx, dy + 1, C.deck, dw, 1);
  for (let c = 0; c < 4; c++) {
    let col = C.key; const inL = c < 2;
    if (press && ((hit === 'L' && inL) || (hit === 'R' && !inL)) && (c % 2 === Math.floor(press * 4) % 2)) col = C.keyHit;
    P(dx + 1 + c * 2, dy, col, 1, 1);
  }
  g.restore();
  return { dx, dy };
}
function arm(P: ReturnType<typeof makeP>, sx: number, sy: number, px: number, py: number) {
  const n = Math.max(Math.abs(px - sx), Math.abs(py - sy)) + 1;
  for (let i = 0; i <= n; i++) { const t = i / n; P(sx + (px - sx) * t, sy + (py - sy) * t, C.k, 1.5, 1.5); }
  P(px - 0.5, py - 0.5, C.k, 2, 2);
}
function textPx(g: CanvasRenderingContext2D, px: number, py: number, str: string, cell: number, col: string) {
  let cx = px;
  for (const ch of str) {
    const gl = FONT[ch];
    if (gl) for (let r = 0; r < gl.length; r++) for (let c = 0; c < gl[r].length; c++) if (gl[r][c] === '1') { g.fillStyle = col; g.fillRect(cx + c * cell, py + r * cell, cell, cell); }
    cx += 4 * cell;
  }
}
function drawDesk(g: CanvasRenderingContext2D, T: number, phase: string, lt: number) {
  const P = makeP(g);
  g.clearRect(0, 0, 33 * U, 26 * U);
  let faceDir = 1, lapAmt = 0, fold = 0, typing = false, signAmt = 0;
  if (phase === 'idle') faceDir = 1;
  else if (phase === 'takeout') { const k = clamp(lt / 0.55); lapAmt = k; fold = 1 - k; faceDir = 1 - k; }
  else if (phase === 'type') { faceDir = 0; lapAmt = 1; typing = true; }
  else if (phase === 'close') { const k = clamp(lt / 0.6); fold = k; lapAmt = 1 - clamp((lt - 0.25) / 0.35); faceDir = k; }
  else if (phase === 'done') { faceDir = 1; signAmt = clamp(lt / 0.3); }

  const bx = Math.round(12 - 6 * faceDir);
  const bob = Math.round(Math.sin(T * (typing ? 5.5 : 2.6)) * (typing ? 1.1 : 0.8));
  const by = 5 + bob;
  const lean = typing ? Math.round(Math.sin(T * 0.8) * 0.6) : 0;
  const look = Math.round(-1 * (1 - faceDir));

  const tapHz = 6, tapPh = (T * tapHz) % 1, hit = Math.floor(T * tapHz) % 2 === 0 ? 'L' : 'R';
  const lp = laptop(g, P, T, lapAmt, fold, hit, typing ? tapPh : 0);
  if (lp && (typing || phase === 'takeout' || phase === 'close')) {
    let pawLy = lp.dy, pawRy = lp.dy;
    if (typing) { if (hit === 'L') pawLy = lp.dy + 1; else pawRy = lp.dy + 1; }
    arm(P, bx + 1 + lean, by + 10, lp.dx + 2, pawLy);
    arm(P, bx + 4 + lean, by + 11, lp.dx + 5, pawRy);
  }
  let et = 'happy';
  if (typing) et = (T % 2.6) > 2.42 ? 'blink' : 'open';
  else if (phase === 'done') et = (T % 3) > 2.85 ? 'blink' : 'happy';
  else et = (T % 3.4) > 3.26 ? 'blink' : 'open';
  bear(P, T, bx, by, lean, look, et, !typing ? Math.sin(T * 2.2) > 0.1 : Math.sin(T * 2.2) > 0.4);

  if (signAmt > 0) {
    const rise = Math.round((1 - signAmt) * 6);
    arm(P, bx + 13, by + 9, bx + 15, by + 2 + rise);
    const sgx = (bx + 11) * U, sgy = (by - 3 + rise) * U, sgw = 50, sgh = 22;
    g.globalAlpha = signAmt;
    g.fillStyle = C.signB; g.fillRect(sgx - 2, sgy - 2, sgw + 4, sgh + 4);
    g.fillStyle = C.sign; g.fillRect(sgx, sgy, sgw, sgh);
    g.fillStyle = C.ok;
    g.fillRect(sgx + 5, sgy + 11, 3, 3); g.fillRect(sgx + 8, sgy + 14, 3, 3); g.fillRect(sgx + 11, sgy + 8, 3, 3); g.fillRect(sgx + 14, sgy + 5, 3, 3);
    textPx(g, sgx + 20, sgy + 6, 'DONE', 2, C.signB);
    g.globalAlpha = 1;
    if (signAmt > 0.6 && Math.floor(T * 4) % 2 === 0) { g.fillStyle = C.spark; g.fillRect(sgx + sgw - 2, sgy - 4, 3, 3); }
  }
}

export function GauPixel({
  size = 32,
  state = 'idle',
  mode = 'face',
  emotion,
  talking = false,
  follow = false,
  className = '',
  title,
  onClick,
}: {
  size?: number;
  state?: GauState;
  mode?: Mode;
  /** Có emotion ⇒ vẽ cảm xúc Gấu Bíp (thắng mode/state), cho hệ /language. */
  emotion?: EmoGau;
  talking?: boolean;
  /** Mắt nhìn theo con trỏ (chỉ emotion). */
  follow?: boolean;
  className?: string;
  title?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  // phase cho desk — điều khiển bằng state, giữ qua các khung
  const phaseRef = useRef<{ p: string; t0: number }>({ p: 'idle', t0: 0 });
  const lookRef = useRef(0);

  // Điều khiển phase desk theo state
  useEffect(() => {
    if (mode !== 'desk' || emotion) return;
    const now = performance.now() / 1000;
    const timers: number[] = [];
    if (state === 'thinking') {
      phaseRef.current = { p: 'takeout', t0: now };
      timers.push(window.setTimeout(() => { phaseRef.current = { p: 'type', t0: performance.now() / 1000 }; }, 560));
    } else if (state === 'done') {
      phaseRef.current = { p: 'close', t0: now };
      timers.push(window.setTimeout(() => { phaseRef.current = { p: 'done', t0: performance.now() / 1000 }; }, 600));
    } else {
      phaseRef.current = { p: 'idle', t0: now };
    }
    return () => timers.forEach(clearTimeout);
  }, [state, mode, emotion]);

  // Nhìn theo con trỏ (nhinTheoTro) — chỉ khi vẽ cảm xúc.
  useEffect(() => {
    if (!follow || !emotion) { lookRef.current = 0; return; }
    const cv = ref.current; if (!cv) return;
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      lookRef.current = Math.max(-1, Math.min(1, (e.clientX - cx) / Math.max(1, r.width / 2)));
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [follow, emotion]);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const g = cv.getContext('2d'); if (!g) return;
    g.imageSmoothingEnabled = false;
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    const render = (now: number) => {
      const T = (now - start) / 1000;
      if (emotion) {
        drawEmotion(g, T, emotion, talking, lookRef.current);
      } else if (mode === 'desk') {
        const { p, t0 } = phaseRef.current;
        drawDesk(g, T, p, now / 1000 - t0);
      } else {
        drawFace(g, T, state);
      }
    };
    render(performance.now());
    // chạy liên tục khi: emotion, desk, thinking/done, idle cỡ lớn. 'still' ⇒ tĩnh (sprite cảnh landing tự lo chuyển động).
    const animate = !reduce && (emotion ? true : state !== 'still' && (mode === 'desk' || state === 'thinking' || state === 'done' || size >= 48));
    let raf = 0;
    if (animate) { const loop = (t: number) => { render(t); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); }
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [mode, state, size, emotion, talking]);

  const sq = !!emotion;
  const bw = sq ? 22 : (mode === 'desk' ? 33 : 22);
  const bh = sq ? 22 : (mode === 'desk' ? 26 : 22);
  const w = sq ? size : (mode === 'desk' ? Math.round(size * 33 / 26) : size);
  return (
    <canvas
      ref={ref}
      className={`gaupx ${className}`}
      width={bw * U}
      height={bh * U}
      onClick={onClick}
      style={{ width: w, height: size, imageRendering: 'pixelated', display: 'block', cursor: onClick ? 'pointer' : undefined }}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    />
  );
}
