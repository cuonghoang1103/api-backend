/**
 * Hoạ tiết vẽ bằng canvas 2D — không tải ảnh nào (không giấy phép bên ngoài, không request mạng, chạy cả trong Remotion).
 * Mỗi hàm trả CanvasTexture đã đặt colorSpace đúng (ảnh màu = sRGB, bản đồ độ nhám / bump = tuyến tính).
 */
import * as THREE from 'three';
import { rng } from './util';

export type Q = 'low' | 'high';
const FONT = '"Inter", "Helvetica Neue", Arial, sans-serif';

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  return { c, g };
}
function texOf(c: HTMLCanvasElement, srgb: boolean, aniso = 8) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = aniso;
  t.needsUpdate = true;
  return t;
}

/* ───────────── bàn gỗ ───────────── */
export function woodTex(q: Q) {
  const W = q === 'high' ? 1024 : 512, H = W / 2;
  const { c, g } = canvas(W, H);
  const r = rng(11);
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, '#5a3a24');
  grd.addColorStop(1, '#4a2f1d');
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) {
    const y = r() * H;
    g.strokeStyle = `rgba(${r() < 0.5 ? '30,16,8' : '120,84,52'},${0.08 + r() * 0.16})`;
    g.lineWidth = 0.6 + r() * 2.2;
    g.beginPath();
    const a = r() * 6, f = 0.004 + r() * 0.01, amp = 1 + r() * 5;
    for (let x = 0; x <= W; x += 8) g.lineTo(x, y + Math.sin(x * f + a) * amp);
    g.stroke();
  }
  const t = texOf(c, true);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* ───────────── nền phòng (gradient dọc) ───────────── */
export function gradientTex(top: string, bottom: string) {
  const { c, g } = canvas(4, 256);
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, top);
  grd.addColorStop(1, bottom);
  g.fillStyle = grd;
  g.fillRect(0, 0, 4, 256);
  return texOf(c, true, 1);
}

/* ───────────── bo mạch chủ ─────────────
 * Toạ độ bo (cm): x 0..24.4 (mép I/O = 0), y 0..30.5 (mép dưới = 0). Ảnh: 1 cm = PX px, y lật (canvas y xuống). */
export interface BoardMarks { label: string; x: number; y: number; size?: number; rot?: number }
export function boardTex(q: Q, marks: BoardMarks[], traces: Array<Array<[number, number]>>) {
  const PX = q === 'high' ? 80 : 40;
  const W = Math.round(24.4 * PX), H = Math.round(30.5 * PX);
  const col = canvas(W, H), rough = canvas(W, H);
  const g = col.g, gr = rough.g;
  const r = rng(7);
  const X = (x: number) => x * PX, Y = (y: number) => H - y * PX;
  // nền: sơn phủ đen xanh, hơi loang
  g.fillStyle = '#0c1118';
  g.fillRect(0, 0, W, H);
  gr.fillStyle = '#9a9a9a'; // nhám vừa
  gr.fillRect(0, 0, W, H);
  for (let i = 0; i < 40; i++) {
    const x = r() * W, y = r() * H, rr = 60 + r() * 220;
    const rg = g.createRadialGradient(x, y, 0, x, y, rr);
    rg.addColorStop(0, `rgba(30,44,62,${0.12 + r() * 0.1})`);
    rg.addColorStop(1, 'rgba(30,44,62,0)');
    g.fillStyle = rg;
    g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  // mạch đồng ẩn dưới lớp phủ: đường 45°/thẳng ngẫu nhiên
  g.lineCap = gr.lineCap = 'round';
  for (let i = 0; i < (q === 'high' ? 900 : 450); i++) {
    let x = r() * 24.4, y = r() * 30.5;
    const pts: Array<[number, number]> = [[x, y]];
    for (let k = 0; k < 3; k++) {
      const d = 0.6 + r() * 3.2, dir = Math.floor(r() * 8) * (Math.PI / 4);
      x += Math.cos(dir) * d;
      y += Math.sin(dir) * d;
      pts.push([x, y]);
    }
    const w = (0.02 + r() * 0.05) * PX;
    for (const [ctx, stroke] of [[g, `rgba(52,74,96,${0.35 + r() * 0.3})`], [gr, '#3c3c3c']] as const) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = w;
      ctx.beginPath();
      pts.forEach(([a, b], j) => (j ? ctx.lineTo(X(a), Y(b)) : ctx.moveTo(X(a), Y(b))));
      ctx.stroke();
    }
  }
  // đường bus (vẽ mờ ở đây; xung sáng là lưới 3D riêng)
  for (const tr of traces) {
    for (const [ctx, stroke, lw] of [[g, 'rgba(70,98,126,0.75)', 0.07], [gr, '#2a2a2a', 0.07]] as const) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw * PX;
      ctx.beginPath();
      tr.forEach(([a, b], j) => (j ? ctx.lineTo(X(a), Y(b)) : ctx.moveTo(X(a), Y(b))));
      ctx.stroke();
    }
  }
  // lỗ via
  for (let i = 0; i < (q === 'high' ? 1600 : 700); i++) {
    const x = r() * W, y = r() * H, rr = (0.025 + r() * 0.03) * PX;
    g.fillStyle = '#7d6a45';
    g.beginPath();
    g.arc(x, y, rr, 0, 7);
    g.fill();
    g.fillStyle = '#0a0d12';
    g.beginPath();
    g.arc(x, y, rr * 0.45, 0, 7);
    g.fill();
    gr.fillStyle = '#202020';
    gr.beginPath();
    gr.arc(x, y, rr, 0, 7);
    gr.fill();
  }
  // lỗ bắt vít (mạ thiếc)
  for (const [x, y] of [[0.6, 29.9], [0.6, 6.6], [16.3, 29.9], [16.3, 6.6], [23.8, 29.9], [23.8, 6.6], [23.8, 0.8], [0.6, 0.8]]) {
    g.fillStyle = '#b9b4a6';
    g.beginPath();
    g.arc(X(x), Y(y), 0.42 * PX, 0, 7);
    g.fill();
    g.fillStyle = '#05070a';
    g.beginPath();
    g.arc(X(x), Y(y), 0.2 * PX, 0, 7);
    g.fill();
    gr.fillStyle = '#3a3a3a';
    gr.beginPath();
    gr.arc(X(x), Y(y), 0.42 * PX, 0, 7);
    gr.fill();
  }
  // chữ in lụa trắng
  g.fillStyle = 'rgba(232,236,240,0.88)';
  g.textBaseline = 'middle';
  for (const m of marks) {
    g.save();
    g.translate(X(m.x), Y(m.y));
    if (m.rot) g.rotate(m.rot);
    g.font = `600 ${Math.round((m.size ?? 0.32) * PX)}px ${FONT}`;
    g.fillText(m.label, 0, 0);
    g.restore();
  }
  // khung in lụa quanh socket
  g.strokeStyle = 'rgba(232,236,240,0.7)';
  g.lineWidth = 0.035 * PX;
  g.strokeRect(X(5.6), Y(25.0), 6.0 * PX, 6.0 * PX);
  const t = texOf(col.c, true, 8);
  const tr = texOf(rough.c, false, 8);
  return { map: t, roughnessMap: tr };
}

/* ───────────── chữ khắc trên nắp IHS ───────────── */
export function ihsTex(q: Q) {
  const S = q === 'high' ? 1024 : 512;
  const col = canvas(S, S), b = canvas(S, S);
  col.g.fillStyle = '#c9ced4';
  col.g.fillRect(0, 0, S, S);
  b.g.fillStyle = '#808080';
  b.g.fillRect(0, 0, S, S);
  const r = rng(3);
  // vân chải kim loại
  for (let i = 0; i < 1400; i++) {
    const y = r() * S;
    col.g.strokeStyle = `rgba(${r() < 0.5 ? 255 : 120},${r() < 0.5 ? 255 : 120},${r() < 0.5 ? 255 : 130},${0.03 + r() * 0.05})`;
    col.g.lineWidth = 0.5 + r();
    col.g.beginPath();
    col.g.moveTo(0, y);
    col.g.lineTo(S, y + (r() - 0.5) * 6);
    col.g.stroke();
  }
  const ghi = (txt: string, y: number, size: number, w = 600) => {
    for (const [g, f] of [[col.g, 'rgba(70,74,80,0.85)'], [b.g, '#3a3a3a']] as const) {
      g.fillStyle = f;
      g.font = `${w} ${Math.round(size * S)}px ${FONT}`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(txt, S / 2, y * S);
    }
  };
  ghi('CUONGTHAI', 0.3, 0.085, 800);
  ghi('CT-1  PROCESSOR', 0.43, 0.06);
  ghi('8 CORES  ·  3.6 GHz', 0.53, 0.05, 500);
  ghi('LGA · 2026 · VIET NAM', 0.63, 0.04, 500);
  ghi('X1A2  C0RE  0101', 0.73, 0.035, 500);
  // mã ma trận nhỏ
  for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) {
    if (r() < 0.5) continue;
    col.g.fillStyle = 'rgba(60,64,70,0.8)';
    col.g.fillRect(S * 0.82 + i * S * 0.008, S * 0.8 + j * S * 0.008, S * 0.008, S * 0.008);
  }
  return { map: texOf(col.c, true), bumpMap: texOf(b.c, false) };
}

/* ───────────── die: sơ đồ mặt bằng chip ─────────────
 * Toạ độ u (ngang) 0..1, v (dọc, lên trên) 0..1 — trùng với vùng sáng trong macro.ts (DIE_REGIONS). */
export function dieTex(q: Q, regions: Record<string, [number, number, number, number]>) {
  const W = q === 'high' ? 2048 : 1024, H = Math.round(W * (1.05 / 2.05));
  const { c, g } = canvas(W, H);
  const rough = canvas(W, H);
  const r = rng(21);
  const R = ([u0, v0, u1, v1]: [number, number, number, number]) => [u0 * W, (1 - v1) * H, (u1 - u0) * W, (v1 - v0) * H] as const;
  g.fillStyle = '#1c1f2a';
  g.fillRect(0, 0, W, H);
  rough.g.fillStyle = '#707070';
  rough.g.fillRect(0, 0, W, H);
  // logic ngẫu nhiên (ô chuẩn) cho mọi vùng
  const logic = (x: number, y: number, w: number, h: number, hue: number) => {
    g.fillStyle = `hsl(${hue},22%,16%)`;
    g.fillRect(x, y, w, h);
    const n = Math.round((w * h) / (q === 'high' ? 26 : 60));
    for (let i = 0; i < n; i++) {
      const cw = 1 + r() * 7, ch = 1 + r() * 3;
      g.fillStyle = `hsla(${hue + (r() - 0.5) * 40},${30 + r() * 30}%,${18 + r() * 26}%,0.9)`;
      g.fillRect(x + r() * (w - cw), y + r() * (h - ch), cw, ch);
    }
    // dây kim loại tầng trên
    g.globalAlpha = 0.35;
    for (let i = 0; i < n / 30; i++) {
      g.strokeStyle = `hsl(${hue + 20},40%,${45 + r() * 20}%)`;
      g.lineWidth = 0.6;
      const yy = y + r() * h;
      g.beginPath();
      g.moveTo(x + r() * w * 0.3, yy);
      g.lineTo(x + w * (0.6 + r() * 0.4), yy);
      g.stroke();
    }
    g.globalAlpha = 1;
  };
  // SRAM: lưới đều, ánh kim
  const sram = (x: number, y: number, w: number, h: number, hue: number) => {
    g.fillStyle = `hsl(${hue},35%,22%)`;
    g.fillRect(x, y, w, h);
    const cs = q === 'high' ? 6 : 4;
    for (let yy = y + 1; yy < y + h - cs; yy += cs) {
      for (let xx = x + 1; xx < x + w - cs; xx += cs) {
        g.fillStyle = `hsla(${hue + ((xx + yy) % 30)},45%,${30 + ((xx * 7 + yy * 3) % 13)}%,0.95)`;
        g.fillRect(xx, yy, cs - 1.4, cs - 1.6);
      }
    }
    // dải giải mã hàng/cột
    g.fillStyle = `hsla(${hue},30%,40%,0.6)`;
    for (let k = 1; k < 4; k++) g.fillRect(x + (w * k) / 4 - 2, y, 4, h);
    rough.g.fillStyle = '#404040';
    rough.g.fillRect(x, y, w, h);
  };
  for (const [k, box] of Object.entries(regions)) {
    const [x, y, w, h] = R(box);
    if (k.startsWith('l2') || k === 'l3') sram(x, y, w, h, k === 'l3' ? 205 : 268);
    else if (k.startsWith('core')) logic(x, y, w, h, 168 + (Number(k.slice(4)) % 3) * 8);
    else if (k === 'imc') logic(x, y, w, h, 28);
    else if (k === 'io') logic(x, y, w, h, 330);
  }
  // L1 trong mỗi lõi: hai ô SRAM nhỏ
  for (const [k, [u0, v0, u1, v1]] of Object.entries(regions)) {
    if (!k.startsWith('core')) continue;
    const cw = u1 - u0, ch = v1 - v0;
    for (const [a, b] of [[0.06, 0.72], [0.06, 0.06]]) {
      const [x, y, w, h] = R([u0 + cw * a, v0 + ch * b, u0 + cw * (a + 0.26), v0 + ch * (b + 0.22)]);
      sram(x, y, w, h, 290);
    }
  }
  // vòng ring bus + đường ranh giới
  g.strokeStyle = 'rgba(210,190,140,0.55)';
  g.lineWidth = q === 'high' ? 3 : 2;
  for (const box of Object.values(regions)) {
    const [x, y, w, h] = R(box);
    g.strokeRect(x, y, w, h);
  }
  // pad I/O quanh mép
  g.fillStyle = 'rgba(200,170,100,0.85)';
  for (let x = 6; x < W - 6; x += q === 'high' ? 14 : 8) { g.fillRect(x, 2, 6, 5); g.fillRect(x, H - 7, 6, 5); }
  for (let y = 6; y < H - 6; y += q === 'high' ? 14 : 8) { g.fillRect(2, y, 5, 6); g.fillRect(W - 7, y, 5, 6); }
  return { map: texOf(c, true, 8), roughnessMap: texOf(rough.c, false, 8) };
}

/* ───────────── ô chuẩn (mặt trên khối logic trong lõi) & SRAM lặp ───────────── */
export function cellTex(kind: 'logic' | 'sram', hue: number, seed: number) {
  const S = 256;
  const { c, g } = canvas(S, S);
  const r = rng(seed);
  if (kind === 'sram') {
    g.fillStyle = `hsl(${hue},40%,18%)`;
    g.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 8) for (let x = 0; x < S; x += 8) {
      g.fillStyle = `hsl(${hue + ((x + y) % 24)},32%,${26 + ((x * 3 + y) % 11)}%)`;
      g.fillRect(x + 1, y + 1, 6, 5);
    }
  } else {
    g.fillStyle = `hsl(${hue},25%,13%)`;
    g.fillRect(0, 0, S, S);
    for (let row = 0; row < S; row += 10) {
      let x = 0;
      while (x < S) {
        const w = 3 + r() * 14;
        g.fillStyle = `hsla(${hue + (r() - 0.5) * 50},${18 + r() * 22}%,${16 + r() * 22}%,0.95)`;
        g.fillRect(x, row + 1, w - 1, 8);
        x += w;
      }
    }
    g.globalAlpha = 0.4;
    g.strokeStyle = `hsl(${hue + 30},50%,60%)`;
    for (let i = 0; i < 18; i++) {
      g.lineWidth = 1;
      const y = r() * S;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(S, y);
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  const t = texOf(c, true, 4);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* ───────────── nền silicon (thế giới vi mô) ───────────── */
export function siliconTex(q: Q) {
  const S = q === 'high' ? 1024 : 512;
  const { c, g } = canvas(S, S);
  g.fillStyle = '#0b1220';
  g.fillRect(0, 0, S, S);
  g.strokeStyle = 'rgba(80,120,170,0.16)';
  g.lineWidth = 1;
  const n = 32;
  for (let i = 0; i <= n; i++) {
    g.beginPath(); g.moveTo((i * S) / n, 0); g.lineTo((i * S) / n, S); g.stroke();
    g.beginPath(); g.moveTo(0, (i * S) / n); g.lineTo(S, (i * S) / n); g.stroke();
  }
  g.strokeStyle = 'rgba(110,160,220,0.22)';
  for (let i = 0; i <= n / 4; i++) {
    g.beginPath(); g.moveTo((i * S * 4) / n, 0); g.lineTo((i * S * 4) / n, S); g.stroke();
    g.beginPath(); g.moveTo(0, (i * S * 4) / n); g.lineTo(S, (i * S * 4) / n); g.stroke();
  }
  const t = texOf(c, true, 8);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* ───────────── chữ trên mặt phẳng (nhãn cổng, số 0/1, thẻ lệnh) ───────────── */
export function textTex(lines: Array<{ t: string; size: number; color: string; w?: number }>, opts: { w: number; h: number; bg?: string; border?: string; radius?: number }) {
  const { c, g } = canvas(opts.w, opts.h);
  if (opts.bg) {
    const rr = opts.radius ?? 24;
    g.fillStyle = opts.bg;
    g.beginPath();
    g.roundRect(4, 4, opts.w - 8, opts.h - 8, rr);
    g.fill();
    if (opts.border) {
      g.strokeStyle = opts.border;
      g.lineWidth = 6;
      g.stroke();
    }
  }
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const tong = lines.reduce((s, l) => s + l.size * 1.18, 0);
  let y = opts.h / 2 - tong / 2;
  for (const l of lines) {
    g.fillStyle = l.color;
    g.font = `${l.w ?? 700} ${l.size}px ${FONT}`;
    g.fillText(l.t, opts.w / 2, y + (l.size * 1.18) / 2);
    y += l.size * 1.18;
  }
  return texOf(c, true, 4);
}

/* ───────────── màn hình (chương trình MARIE "Add") ───────────── */
export function screenTex(q: Q) {
  const W = q === 'high' ? 1024 : 512, H = Math.round(W * 0.5625);
  const { c, g } = canvas(W, H);
  const k = W / 1024;
  g.fillStyle = '#0d1424';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#16203a';
  g.fillRect(0, 0, W, 44 * k);
  g.fillStyle = '#e2e8f0';
  g.font = `600 ${22 * k}px ${FONT}`;
  g.fillText('cuongthai.com/cpu-lab — MARIE', 20 * k, 29 * k);
  const dong: Array<[string, string]> = [
    ['/ Cộng hai số X + Y → Z', '#64748b'],
    ['        Load  X', '#93c5fd'],
    ['        Add   Y', '#fbbf24'],
    ['        Store Z', '#93c5fd'],
    ['        Output', '#93c5fd'],
    ['        Halt', '#93c5fd'],
    ['X,      DEC   5', '#86efac'],
    ['Y,      DEC   7', '#86efac'],
    ['Z,      DEC   0', '#86efac'],
  ];
  g.font = `500 ${30 * k}px "JetBrains Mono", Menlo, monospace`;
  dong.forEach(([t, col], i) => {
    g.fillStyle = col;
    g.fillText(t, 36 * k, (100 + i * 44) * k);
  });
  g.fillStyle = 'rgba(251,191,36,0.16)';
  g.fillRect(24 * k, (100 + 44 - 30) * k, 460 * k, 40 * k);
  // bảng thanh ghi bên phải
  g.fillStyle = '#111c33';
  g.fillRect(600 * k, 80 * k, 380 * k, 330 * k);
  g.font = `600 ${26 * k}px ${FONT}`;
  const tg: Array<[string, string]> = [['PC', '002'], ['IR', '3006'], ['AC', '000C'], ['MAR', '006'], ['MBR', '0007']];
  tg.forEach(([a, b], i) => {
    g.fillStyle = '#94a3b8';
    g.fillText(a, 630 * k, (130 + i * 58) * k);
    g.fillStyle = '#f8fafc';
    g.font = `600 ${30 * k}px "JetBrains Mono", Menlo, monospace`;
    g.fillText(b, 780 * k, (130 + i * 58) * k);
    g.font = `600 ${26 * k}px ${FONT}`;
  });
  return texOf(c, true, 4);
}
