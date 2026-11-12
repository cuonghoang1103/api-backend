/**
 * _pr-chung.mjs — khuôn slide video khoá /courses/prisma-orm (deck pr-NN-M; 11/11/2026). KHÔNG chép CSS: import THẲNG
 * khuôn chuẩn của repo web (`api-backend/scripts/slides-src/_ts-chung.mjs` — vốn chép từ `_pg-chung.mjs`, khuôn FU + logo
 * CuongThai.com) rồi chỉ đổi mặc định khoa/duong/bieuTuong/khau sang Prisma và THÊM:
 *   prs(src, opts)  — khối lược đồ Prisma (.prisma) tô màu Dark+ (highlight.js không có ngôn ngữ prisma ⇒ tự tách token)
 *   tp(text, opts)  — terminal Prisma/tsc/node: như tc() nhưng tiêu đề mặc định là môi trường chạy thật của khoá video.
 * Không sửa tệp nào trong api-backend (chỉ import). Deck nằm NGOÀI repo web: scratchpad/prisma/slides/pr-NN-M.mjs.
 * Render (cwd PHẢI là api-backend vì bộ render đọc node_modules/katex tương đối):
 *   cd ~/Downloads/api-backend && node scripts/_render-slides.mjs --deck <đường dẫn tuyệt đối deck> --out <tmp>
 * Hoặc: bash ~/Documents/video-bai-giang/scratchpad/prisma/dung-slide.sh <id>:<deck>
 */
import * as G from '/Users/admin/Downloads/api-backend/scripts/slides-src/_ts-chung.mjs';
export * from '/Users/admin/Downloads/api-backend/scripts/slides-src/_ts-chung.mjs';

export const MOI_TRUONG = 'Node 26.8.1 · Prisma 6.19.3 · PostgreSQL 16.14';
const MAC_DINH = { khoa: 'Prisma ORM', duong: 'courses/prisma-orm', bieuTuong: '🗃️', khau: 'from one schema file to production' };

/** lamDeck của khuôn chuẩn với mặc định Prisma (meta vẫn đè được). */
export const lamDeck = (meta, items) => G.lamDeck({ ...MAC_DINH, ...meta }, items);

const esc = G.esc;
const SCALAR = /^(Int|String|DateTime|Boolean|Float|Decimal|BigInt|Json|Bytes|Unsupported)$/;
/** Tô một dòng .prisma thành HTML dùng lớp hljs-* có sẵn trong CSS khuôn. */
function toDongPrisma(line) {
  const ci = line.indexOf('//');
  const code = ci >= 0 ? line.slice(0, ci) : line, cm = ci >= 0 ? line.slice(ci) : '';
  let out = '';
  const re = /("(?:[^"\\]|\\.)*")|(@@?[A-Za-z_][\w.]*)|\b(model|enum|datasource|generator|type|view)\b|\b([A-Z][A-Za-z0-9_]*)(\[\]|\?)?|\b(env|autoincrement|now|uuid|cuid|dbgenerated)\b|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|(.)/g;
  let m, truocLaKhoa = false;
  while ((m = re.exec(code))) {
    const [all, str, attr, kwd, Hoa, hau, fn, num, id] = m;
    if (str) out += `<span class="hljs-string">${esc(str)}</span>`;
    else if (attr) out += `<span class="hljs-meta">${esc(attr)}</span>`;
    else if (kwd) { out += `<span class="hljs-keyword">${kwd}</span>`; truocLaKhoa = true; continue; }
    else if (Hoa) {
      const cls = truocLaKhoa ? 'hljs-title' : SCALAR.test(Hoa) ? 'hljs-type' : 'hljs-title';
      out += `<span class="${cls}">${Hoa}</span>${hau ? `<span class="hljs-operator">${esc(hau)}</span>` : ''}`;
    } else if (fn) out += `<span class="hljs-built_in">${fn}</span>`;
    else if (num) out += `<span class="hljs-number">${num}</span>`;
    else if (id) out += `<span class="hljs-attr">${esc(id)}</span>`;
    else out += esc(all);
    if (!/^\s+$/.test(all)) truocLaKhoa = false;
  }
  return out + (cm ? `<span class="hljs-comment">${esc(cm)}</span>` : '');
}
/** Khối lược đồ Prisma. opts: { sm, hl: [dòng 1-based] } — cùng dáng <pre class="vs"> với sql()/ts(). */
export function prs(src, opts = {}) {
  const { sm = false, hl = [] } = opts;
  const dong = src.replace(/\n$/, '').split('\n');
  return `<pre class="vs${sm ? ' sm' : ''}">` + dong.map((l, i) => `<span class="ln${hl.includes(i + 1) ? ' hl' : ''}">${toDongPrisma(l) || ' '}</span>`).join('') + `</pre>`;
}
/** Terminal output THẬT (môi trường của khoá video). Như tc() của khuôn TS. */
export const tp = (text, opts = {}) => G.tc(text, { title: `terminal — ${MOI_TRUONG}`, ...opts });

/* ───────── 12/11 (điều phối: slide tự dựng phải có HÌNH) — sơ đồ, thẻ có icon, bảng so sánh tô cột tiêu chí, biểu đồ thanh số đo ───────── */
const NET = {
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
  map: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  test: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/>',
  loop: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
  link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v4"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/>',
  cut: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5L20 20M8.5 15.5L20 4"/>',
  page: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/>',
  count: '<path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  shield: '<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/>',
  warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
  type: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
  tree: '<circle cx="12" cy="4" r="2"/><circle cx="6" cy="14" r="2"/><circle cx="18" cy="14" r="2"/><circle cx="6" cy="21" r="1.5"/><path d="M12 6v3M12 9l-6 3M12 9l6 3M6 16v3.5"/>',
  merge: '<path d="M6 3v6a6 6 0 0 0 6 6h6"/><path d="M15 12l3 3-3 3"/><path d="M6 21v-6"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
  filter: '<path d="M3 4h18l-7 9v7l-4-2v-5z"/>',
  code: '<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  stack: '<rect x="4" y="3" width="16" height="5" rx="1"/><rect x="4" y="10" width="16" height="5" rx="1"/><rect x="4" y="17" width="16" height="4" rx="1"/>',
  box: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
  power: '<path d="M12 2v10"/><path d="M6.3 6.3a8 8 0 1 0 11.4 0"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  pulse: '<path d="M2 12h4l3-8 4 16 3-8h6"/>',
  flag: '<path d="M5 22V3"/><path d="M5 4h12l-2 4 2 4H5"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  seed: '<path d="M12 22V11"/><path d="M12 11c0-4 3-7 8-7 0 5-3 8-8 7z"/><path d="M12 14c0-3-2-5-7-5 0 4 2 6 7 5z"/>',
};
/** Icon SVG nét mảnh, một màu. */
export const ico = (ten, mau = '#b85a2b', co = 34) => `<svg viewBox="0 0 24 24" width="${co}" height="${co}" fill="none" stroke="${mau}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="flex:none">${NET[ten] || NET.list}</svg>`;
/** Thẻ có icon: items [[icon, tiêu đề, mô tả]] — mỗi thẻ là .card (đo toạ độ ra card#i). */
export const icards = (items, cot = 3) => `<div style="display:grid;grid-template-columns:repeat(${cot},1fr);gap:14px">${items.map(([i, h, p]) =>
  `<div class="card" style="display:flex;gap:14px;align-items:flex-start">${ico(i, '#b85a2b', 40)}<div><div class="h">${h}</div><p>${p}</p></div></div>`).join('')}</div>`;
/** Bảng so sánh: cột đầu là TIÊU CHÍ (tô màu). cols[0] = nhãn cột tiêu chí. Hàng giữ class d ⇒ toạ độ tr#i như tbl. */
export function cmp(cols, rows, opts = {}) {
  const { hl = [] } = opts;
  const body = rows.map((r, i) => `<tr class="${hl.includes(i) ? 'hl' : ''}">` + r.map((v, j) => j === 0
    ? `<td style="background:#fdebd9;color:#8a3d12;font-weight:700;white-space:nowrap">${v}</td>` : `<td>${v}</td>`).join('') + '</tr>').join('');
  return `<div><table class="d"><tr>${cols.map((c0, j) => `<th${j === 0 ? ' style="background:#8a3d12"' : ''}>${c0}</th>`).join('')}</tr>${body}</table></div>`;
}
/** Sơ đồ trung tâm–nhánh (SVG): tâm + 4–6 nhánh [[icon, tiêu đề, phụ]]. */
export function hub(tam, nhanh, opts = {}) {
  const { w = 1110, h = 330 } = opts;
  const cx = w / 2, cy = h / 2, n = nhanh.length, bw = 300, bh = 74;
  const pos = nhanh.map((_, i) => { const trai = i < Math.ceil(n / 2); const k = trai ? i : i - Math.ceil(n / 2); const m = trai ? Math.ceil(n / 2) : Math.floor(n / 2);
    return { x: trai ? 10 : w - bw - 10, y: (h / (m + 1)) * (k + 1) - bh / 2 }; });
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  pos.forEach((p) => { s += `<line x1="${cx}" y1="${cy}" x2="${p.x < cx ? p.x + bw : p.x}" y2="${p.y + bh / 2}" stroke="#d9b38c" stroke-width="2.5" stroke-dasharray="6 5"/>`; });
  s += `<circle cx="${cx}" cy="${cy}" r="78" fill="#fff4ea" stroke="#b85a2b" stroke-width="3"/>`;
  String(tam).split('\n').forEach((l, i, a) => { s += `<text x="${cx}" y="${cy + 8 + (i - (a.length - 1) / 2) * 26}" text-anchor="middle" font-size="22" font-weight="800" fill="#8a3d12">${l}</text>`; });
  nhanh.forEach(([ic, t, sub], i) => { const p = pos[i];
    s += `<rect x="${p.x}" y="${p.y}" width="${bw}" height="${bh}" rx="12" fill="#fffaf5" stroke="#e3c9ae" stroke-width="2"/>`;
    s += `<g transform="translate(${p.x + 14},${p.y + 19}) scale(1.5)" fill="none" stroke="#b85a2b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${NET[ic] || NET.list}</g>`;
    s += `<text x="${p.x + 64}" y="${p.y + (sub ? 31 : 44)}" font-size="20" font-weight="700" fill="#262626">${t}</text>`;
    if (sub) s += `<text x="${p.x + 64}" y="${p.y + 56}" font-size="16" fill="#666">${sub}</text>`; });
  return s + '</svg>';
}
/** Biểu đồ thanh ngang cho SỐ ĐO THẬT: rows [[nhãn, giá trị, mau?, chú thích?]]; log = true ⇒ thang log. */
export function bars(rows, opts = {}) {
  const { w = 1110, don = 'ms', log = false, rh = 40, nhan = 330, fs = 18 } = opts;
  const v = (x) => (log ? Math.log10(Math.max(x, 0.01)) - Math.log10(0.01) : x);
  const max = Math.max(...rows.map((r) => v(r[1])));
  const h = rows.length * rh + 10, bwMax = w - nhan - 190;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  rows.forEach(([t, x, mau = '#336791', ghi = ''], i) => { const y = 5 + i * rh, bw = Math.max(4, (v(x) / max) * bwMax);
    s += `<text x="${nhan - 12}" y="${y + rh / 2 + 6}" text-anchor="end" font-size="${fs}" fill="#262626">${t}</text>`;
    s += `<rect x="${nhan}" y="${y + 6}" width="${bw}" height="${rh - 14}" rx="5" fill="${mau}"/>`;
    s += `<text x="${nhan + bw + 10}" y="${y + rh / 2 + 6}" font-size="${fs}" font-weight="700" fill="${mau}">${typeof x === 'number' ? x.toLocaleString('en-US') : x} ${don}${ghi ? ' · ' + ghi : ''}</text>`; });
  return s + `</svg>${log ? '<div class="cap">log scale</div>' : ''}`;
}
/** Sơ đồ tầng dọc (kiến trúc / đường đi của một yêu cầu): items [[icon, tiêu đề, phụ, mau?]]. */
export function tiers(items, opts = {}) {
  const { w = 1110, th = 64, gap = 22 } = opts;
  const h = items.length * (th + gap);
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="mtt" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,0 L5,10 z" fill="#b85a2b"/></marker></defs>`;
  items.forEach(([ic, t, sub, mau = '#336791'], i) => { const y = i * (th + gap);
    s += `<rect x="40" y="${y}" width="${w - 80}" height="${th}" rx="12" fill="${mau}12" stroke="${mau}" stroke-width="2.5"/>`;
    s += `<g transform="translate(62,${y + 14}) scale(1.5)" fill="none" stroke="${mau}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${NET[ic] || NET.list}</g>`;
    s += `<text x="112" y="${y + 41}" font-size="22" font-weight="800" fill="${mau}">${t}</text>`;
    if (sub) s += `<text x="${w - 64}" y="${y + 41}" text-anchor="end" font-size="18" fill="#555">${sub}</text>`;
    if (i < items.length - 1) s += `<line x1="${w / 2}" y1="${y + th + 2}" x2="${w / 2}" y2="${y + th + gap - 4}" stroke="#b85a2b" stroke-width="3" marker-end="url(#mtt)"/>`; });
  return s + '</svg>';
}
export { flow, vsd } from '/Users/admin/Downloads/api-backend/scripts/slides-src/_ts-chung.mjs';
