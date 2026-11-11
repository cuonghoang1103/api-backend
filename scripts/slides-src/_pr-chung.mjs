/**
 * _pr-chung.mjs — khuôn slide video khoá /courses/prisma-orm (deck pr-NN-M; 11/11/2026). KHÔNG chép CSS: import THẲNG
 * khuôn chuẩn của repo web (`api-backend/scripts/slides-src/_ts-chung.mjs` — vốn chép từ `_pg-chung.mjs`, khuôn FU + logo
 * CuongThai.com) rồi chỉ đổi mặc định khoa/duong/bieuTuong/khau sang Prisma và THÊM:
 *   prs(src, opts)  — khối lược đồ Prisma (.prisma) tô màu Dark+ (highlight.js không có ngôn ngữ prisma ⇒ tự tách token)
 *   tp(text, opts)  — terminal Prisma/tsc/node: như tc() nhưng tiêu đề mặc định là môi trường chạy thật của khoá video.
 * Bản trong repo (12/11/2026): deck pr-NN-M.mjs ở cùng thư mục, mỗi deck tự chứa output chạy thật (đóng băng từ khoá video).
 * Render: node scripts/_render-slides.mjs --deck scripts/slides-src/pr-NN-M.mjs --out <dir>
 *         node scripts/tst/kiem-slide.mjs scripts/slides-src/pr-NN-M.mjs   ⇒ 0 slide có vấn đề
 */
import * as G from './_ts-chung.mjs';
export * from './_ts-chung.mjs';

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
