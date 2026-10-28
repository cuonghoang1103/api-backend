/**
 * os-10-chung — KHÔNG phải một deck: phần dùng chung cho 8 deck Chương 10 (os-10-1 … os-10-8) của khoá
 * "Operating Systems for Developers" (28/10/2026). Output đọc THẲNG từ lab/out/*.out.txt qua grab(); mã nguồn từ lab/code/ch10.
 */
import { sql, sh } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';
import fs from 'node:fs';

export const META = (bai) => ({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 10 — I/O models', bai,
});

/** Output thật: g('c103-epoll', 'gcc -O2 …', n) — cắt nguyên văn như _ui.mjs › grab. */
export const g = (file, pre, n = 1, opts) => grab(file, pre, n, opts);
/** Mã nguồn thật của lab/code/ch10. */
export const SRC = (f) => fs.readFileSync(new URL(`../../content/courses/operating-systems-for-developers/lab/code/ch10/${f}`, import.meta.url), 'utf8');
/** Lấy dòng a..b (1-based, gồm cả hai đầu) của một chuỗi. */
export const dong = (s, a, b) => s.split('\n').slice(a - 1, b).join('\n');
/** Bỏ chú thích (tiếng Việt) khỏi mã cho slide tiếng Anh: C/Java/JS/Go \/* … *\/ và // cuối dòng; dòng chỉ còn chú thích thì bỏ. */
export const noCmt = (s) => s.split('\n').map((l) => l.replace(/\s*\/\*.*?\*\//g, '').replace(/\s+\/\/ .*$/, '').replace(/\s+# .*$/, '').replace(/\s+$/, ''))
  .filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).filter((l) => !/^\s*(\/\/|#) /.test(l)).join('\n');
/** Bỏ các dòng khớp regex. */
export const bo = (s, re) => s.split('\n').filter((l) => !re.test(l)).join('\n');
/** Cắt mỗi dòng còn tối đa n ký tự (thêm …) — chỉ để VỪA KHUNG, không đổi chữ. */
export const cat = (s, n) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');

const wrap = (t, max) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k + 1) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
/** Terminal nhỏ: dòng lệnh dài tự xuống dòng kiểu "\", dòng output dài bị cắt theo bề ngang. */
export const tiny = (t, fs = 14, title = 'terminal') => {
  const max = Math.floor(1060 / (fs * 0.602));
  return sh(cat(wrap(t, max), max), { sm: true, title }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.36">`);
};
/** Khối mã tô màu, cỡ chữ tuỳ chỉnh. */
export const code = (src, lang = 'c', fs = 14) => sql(src, { lang, sm: true }).replace('<pre class="vs sm">', `<pre class="vs sm" style="font-size:${fs}px">`);

/* ── SVG ── chữ đơn cách rộng ≈ 0,602 × cỡ chữ */
export const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', PU = '#7b4fa0', GY = '#777';
export const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
export const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
export const A = (x1, y1, x2, y2, c = '#b85a2b', o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''} marker-end="url(#mt10)"/>`;
export const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="mt10" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>${inner}</svg>`;
/** Biểu đồ cột ngang: rows [[nhãn, giá trị, màu, chữ hiện]], max = giá trị ứng với bề rộng đầy. */
export const bars = (rows, { w = 1080, label = 300, max, fs = 17, rowH = 40 } = {}) => {
  const top = Math.max(...rows.map((r) => r[1])), M = max ?? top, bw = w - label - 160;
  let s = '';
  rows.forEach(([l, v, c, txt], i) => {
    const y = 10 + i * rowH, len = Math.max(3, (v / M) * bw);
    s += T(label - 12, y + rowH / 2 + 6, l, fs, { a: 'end', w: 700 }) + R(label, y + 6, len, rowH - 14, c + '33', c, { rx: 4 }) + T(label + len + 10, y + rowH / 2 + 6, txt ?? String(v), fs, { w: 700, f: c });
  });
  return svg(w, rows.length * rowH + 20, s);
};
