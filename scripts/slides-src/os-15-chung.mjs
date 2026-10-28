/**
 * os-15-chung — KHÔNG phải một deck: phần dùng chung cho 8 deck Chương 15 (os-15-1 … os-15-8) của khoá
 * "Operating Systems for Developers" (29/10/2026). Output đọc THẲNG từ lab/out/c15*.out.txt qua grab(); mã nguồn từ
 * lab/code/ch15; flame graph là các tệp SVG THẬT do flamegraph.pl vẽ trong lab (lab/code/ch15/fg/*.svg) — nhúng nguyên tệp.
 */
import { sql, sh } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';
import fs from 'node:fs';

export const META = (bai) => ({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 15 — Observe & tune', bai,
});

/** Output thật: g('c152-perf', 'perf report …', n) — cắt nguyên văn như _ui.mjs › grab. */
export const g = (file, pre, n = 1, opts) => grab(file, pre, n, opts);
/** Mã nguồn thật của lab/code/ch15. */
export const SRC = (f) => fs.readFileSync(new URL(`../../content/courses/operating-systems-for-developers/lab/code/ch15/${f}`, import.meta.url), 'utf8');
/** Lấy dòng a..b (1-based, gồm cả hai đầu). */
export const dong = (s, a, b) => s.split('\n').slice(a - 1, b).join('\n');
/** Bỏ chú thích (tiếng Việt) khỏi mã cho slide tiếng Anh. */
export const noCmt = (s) => s.split('\n').map((l) => l.replace(/\s*\/\*.*?\*\//g, '').replace(/\s+\/\/ .*$/, '').replace(/\s+# .*$/, '').replace(/\s+$/, ''))
  .filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).filter((l) => !/^\s*(\/\/|#|\/\*| \*)/.test(l)).join('\n');
/** Bỏ các dòng khớp regex (chỉ để vừa khung — không đổi chữ). */
export const bo = (s, re) => s.split('\n').filter((l) => !re.test(l)).join('\n');
/** Cắt mỗi dòng còn tối đa n ký tự (thêm …). */
export const cat = (s, n) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
/** Một số đọc từ output bằng regex (ném lỗi nếu không thấy ⇒ kịch bản đổi thì slide không lặng lẽ sai). */
export const num = (file, pre, re, n = 1) => {
  const m = grab(file, pre, n).match(re);
  if (!m) throw new Error(`os-15: không thấy ${re} sau "${pre}" trong ${file}`);
  return m[1];
};

const wrap = (t, max) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k + 1) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
/** Terminal nhỏ: dòng lệnh dài tự xuống dòng kiểu "\", dòng output dài bị cắt theo bề ngang (w = bề rộng khả dụng, px). */
export const tiny = (t, fs = 14, title = 'terminal', w = 1060) => {
  const max = Math.floor(w / (fs * 0.602));
  return sh(cat(wrap(t, max), max), { sm: true, title }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.36">`);
};
/** Khối mã tô màu, cỡ chữ tuỳ chỉnh. */
export const code = (src, lang = 'c', fs = 14) => sql(src, { lang, sm: true }).replace('<pre class="vs sm">', `<pre class="vs sm" style="font-size:${fs}px">`);

/**
 * Flame graph THẬT (lab/code/ch15/fg/<ten>.svg) nhúng dạng ảnh, co theo khung.
 * crop = chỉ lấy `crop` px ở ĐÁY hình (khung gốc nằm ở đáy flame graph): ngăn xếp rất sâu nhưng hiếm (luồng biên dịch của
 * V8/JVM) làm hình cao 1 200–1 500 px, co vào slide thì chữ không đọc được. Phần bị cắt được ghi rõ ở chú thích slide.
 */
export const fg = (ten, { h = 470, w = 1110, crop, win } = {}) => {
  let svgText = fs.readFileSync(new URL(`../../content/courses/operating-systems-for-developers/lab/code/ch15/fg/${ten}.svg`, import.meta.url), 'utf8');
  const m = svgText.match(/<svg[^>]*\bwidth="(\d+)" height="(\d+)"[^>]*>/);
  const W = +m[1], H = +m[2];
  let y0 = null, hh = null;
  if (crop) { y0 = H - crop; hh = crop; }
  if (win) {   // win = [tên khung trên cùng, tên khung dưới cùng]: chỉ lấy dải giữa hai khung đó (y nhỏ = ở trên)
    const ys = (name) => [...svgText.matchAll(/<title>([^<]*)<\/title><rect x="[\d.]+" y="([\d.]+)"/g)].filter((x) => x[1].startsWith(name)).map((x) => +x[2]);
    const top = Math.min(...ys(win[0])), bot = Math.max(...ys(win[1]));
    if (!isFinite(top) || !isFinite(bot)) throw new Error(`fg(${ten}): không thấy khung ${win}`);
    y0 = top - 34; hh = bot + 20 - y0;
  }
  if (y0 !== null) svgText = svgText.replace(m[0], m[0].replace(/height="\d+"/, `height="${hh}"`).replace(/viewBox="[^"]*"/, `viewBox="0 ${y0} ${W} ${hh}"`));
  const b64 = Buffer.from(svgText).toString('base64');
  return `<div style="text-align:center"><img src="data:image/svg+xml;base64,${b64}" style="max-width:${w}px;max-height:${h}px;border:1.5px solid #ddd;border-radius:8px;background:#fff"/></div>`;
};

/* ── SVG ── chữ đơn cách rộng ≈ 0,602 × cỡ chữ */
export const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', PU = '#7b4fa0', GY = '#777';
export const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
export const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
export const A = (x1, y1, x2, y2, c = '#b85a2b', o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''} marker-end="url(#mt15)"/>`;
export const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="mt15" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>${inner}</svg>`;
/** Cột ngang: rows [[nhãn, giá trị, màu, chữ hiện]]; log = thang log10 (cho số trải từ 0,1 ms tới 10 000 ms). */
export const bars = (rows, { w = 1080, label = 300, max, fs = 17, rowH = 40, log = false } = {}) => {
  const f = log ? (v) => Math.log10(Math.max(v, 0.1) * 10) : (v) => v;
  const top = Math.max(...rows.map((r) => f(r[1]))), M = max !== undefined ? f(max) : top, bw = w - label - 190;
  let s = '';
  rows.forEach(([l, v, c, txt], i) => {
    const y = 10 + i * rowH, len = Math.max(3, (f(v) / M) * bw);
    s += T(label - 12, y + rowH / 2 + 6, l, fs, { a: 'end', w: 700 }) + R(label, y + 6, len, rowH - 14, c + '33', c, { rx: 4 }) + T(label + len + 10, y + rowH / 2 + 6, txt ?? String(v), fs, { w: 700, f: c });
  });
  return svg(w, rows.length * rowH + 20, s);
};
