/**
 * os-04-chung.mjs — đồ dùng chung cho các deck Chương 4 (os-04-1 … os-04-8) khoá "Operating Systems for Developers".
 * Mọi con số trên biểu đồ ĐỌC THẲNG từ lab/out/c4*.out.txt (output chạy thật trong ảnh os-lab) qua grab() — chạy lại
 * kịch bản ⇒ biểu đồ tự có số mới; lệnh bị đổi ⇒ grab() ném lỗi lúc dựng slide.
 */
import { sh, two as two0 } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export { grab };
export const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', BR = '#b85a2b', GY = '#8a8a8a', PU = '#7b4ea3';
export const META = {
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 4 — Concurrent programs',
};
export const term = (t, o = {}) => sh(t, { sm: true, ...o });
export const big = (t, o = {}) => sh(t, { ...o });
export const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
export const two = (a, b, ti = '') => two0(col(a), col(b), ti);
export const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
export const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;

/** Bảng của sweep.sh trong một đoạn output ⇒ [{ k, ms, s }] (k = số lõi, s = speedup). */
export function sweep(file, prefix) {
  const rows = grab(file, prefix).split('\n')
    .map((l) => l.match(/^\s+(\d+)\s+(\d+)\s+([\d.]+)x\s+(\d+)%/)).filter(Boolean)
    .map((m) => ({ k: +m[1], ms: +m[2], s: +m[3], eff: +m[4] }));
  if (rows.length < 2) throw new Error(`os-04: không đọc được bảng sweep "${prefix}" trong ${file}`);
  return rows;
}

/** Số ms ở cuối dòng output một lệnh. */
export function ms(file, prefix, re = /([\d.]+) ms\s*$/m) {
  const m = grab(file, prefix).match(re);
  if (!m) throw new Error(`os-04: không thấy "… ms" sau "${prefix}" trong ${file}`);
  return +m[1];
}

/**
 * Biểu đồ speedup theo số lõi. series: [{ name, color, pts: [{k, s}], dash? }]. opts: { kmax=10, smax, amdahl: [s%…], w, h }
 * Đường chéo xám = lý tưởng (speedup = số lõi). amdahl: thêm đường lý thuyết 1/(s+(1-s)/n) nét đứt.
 */
export function speedChart(series, opts = {}) {
  const { kmax = 10, w = 640, h = 420, amdahl = [], legendX } = opts;
  const smax = opts.smax ?? kmax;
  const L = 64, B = 52, Tp = 16, Rt = 64, pw = w - L - Rt, ph = h - B - Tp;
  const X = (k) => L + (k / kmax) * pw, Y = (s) => Tp + ph - (s / smax) * ph;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  for (let k = 0; k <= kmax; k += 2) {
    s += `<line x1="${X(k)}" y1="${Tp}" x2="${X(k)}" y2="${Tp + ph}" stroke="#eee"/>` + T(X(k), h - B + 24, k, 16, { a: 'middle', f: '#666' });
  }
  for (let v = 0; v <= smax; v += smax > 10 ? 4 : 2) {
    s += `<line x1="${L}" y1="${Y(v)}" x2="${L + pw}" y2="${Y(v)}" stroke="#eee"/>` + T(L - 10, Y(v) + 6, `${v}×`, 16, { a: 'end', f: '#666' });
  }
  s += `<line x1="${L}" y1="${Tp + ph}" x2="${L + pw}" y2="${Tp + ph}" stroke="#777" stroke-width="1.5"/><line x1="${L}" y1="${Tp}" x2="${L}" y2="${Tp + ph}" stroke="#777" stroke-width="1.5"/>`;
  s += T(L + pw / 2, h - 6, 'cores (taskset -c 0..k-1)', 17, { a: 'middle', f: '#555', w: 700 });
  s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(Math.min(kmax, smax))}" y2="${Y(Math.min(kmax, smax))}" stroke="#bbb" stroke-width="2" stroke-dasharray="6 5"/>`;
  s += T(X(Math.min(kmax, smax)) - 6, Y(Math.min(kmax, smax)) + 22, 'ideal', 15, { a: 'end', f: '#999' });
  for (const sp of amdahl) {
    const f = sp / 100, pts = [];
    for (let k = 1; k <= kmax; k += 0.25) pts.push(`${X(k).toFixed(1)},${Y(1 / (f + (1 - f) / k)).toFixed(1)}`);
    s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${GY}" stroke-width="2" stroke-dasharray="3 4"/>`;
    s += T(X(kmax) - 4, Y(1 / (f + (1 - f) / kmax)) - 8, `Amdahl ${sp}%`, 14, { a: 'end', f: GY });
  }
  const lx = legendX ?? L + 16;
  series.forEach((sr, i) => {
    const pts = sr.pts.map((p) => `${X(p.k).toFixed(1)},${Y(p.s).toFixed(1)}`).join(' ');
    s += `<polyline points="${pts}" fill="none" stroke="${sr.color}" stroke-width="4"${sr.dash ? ' stroke-dasharray="9 6"' : ''}/>`;
    for (const p of sr.pts) s += `<circle cx="${X(p.k)}" cy="${Y(p.s)}" r="5.5" fill="${sr.color}"/>`;
    const last = sr.pts[sr.pts.length - 1];
    if (sr.label !== false) s += T(X(last.k) + 9, Y(last.s) + (sr.dy ?? 5), `${last.s.toFixed(1)}×`, 16, { w: 800, f: sr.color });
    s += R(lx, Tp + 8 + i * 28, 22, 8, sr.color, sr.color, { rx: 2, sw: 0 }) + T(lx + 30, Tp + 17 + i * 28, sr.name, 16, { w: 700, f: sr.color });
  });
  return s + '</svg>';
}

/** Cột ngang: rows [{ label, v, color, note }], đơn vị unit. */
export function hbars(rows, opts = {}) {
  const { w = 1110, unit = 'ms', lw = 330, rowH = 54, fs = 19, max = Math.max(...rows.map((r) => r.v)) } = opts;
  const bw = w - lw - 230;
  let s = `<svg viewBox="0 0 ${w} ${rows.length * rowH + 8}" width="${w}" height="${rows.length * rowH + 8}" font-family="Arial">`;
  rows.forEach((r, i) => {
    const y = 4 + i * rowH, len = Math.max(4, (r.v / max) * bw);
    s += T(lw - 12, y + rowH / 2 + 6, r.label, fs, { a: 'end', w: 700, m: r.mono });
    s += R(lw, y + 8, len, rowH - 18, r.color + '33', r.color, { rx: 4 });
    s += T(lw + len + 10, y + rowH / 2 + 6, `${r.v.toLocaleString('en')} ${unit}${r.note ? ` · ${r.note}` : ''}`, fs - 1, { w: 800, f: r.color });
  });
  return s + '</svg>';
}
