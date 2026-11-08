/**
 * _node-chung.mjs — khuôn slide khoá Node.js = khuôn chuẩn PostgreSQL (`_pg-chung.mjs`), KHÔNG sửa bản gốc, chỉ đặt mặc định môn.
 * ĐANG Ở THƯ MỤC TẠM (scratchpad/node/slides-src) vì repo web chỉ đọc ở đợt mẫu 31/10/2026.
 * Khi điều phối duyệt: chép _node-chung.mjs + node-*.mjs sang api-backend/scripts/slides-src/, đổi đường import dưới đây thành './_pg-chung.mjs'.
 * Render (không ghi gì vào repo web):
 *   cd ~/Downloads/api-backend && node scripts/_render-slides.mjs --deck <đường tuyệt đối deck> --out ~/Documents/video-bai-giang/scratchpad/node/slides-out
 * Đo toạ độ: node scripts/slides-src/_pg-do-toa-do.mjs <deck> --out ~/Documents/video-bai-giang/src/khung/node/toado/<deck>.json
 * Mã + output THẬT đọc thẳng từ src/khung/node/that/ (Node 22) ⇒ slide và video không bao giờ lệch nhau.
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { lamDeck as ld, sql, psql } from './_pg-chung.mjs';
export * from './_pg-chung.mjs';

export const lamDeck = (meta, items) => ld({ khoa: 'Node.js', duong: 'courses/nodejs', bieuTuong: '🟢', khau: 'from zero to production', ...meta }, items);
const THAT = '/Users/admin/Documents/video-bai-giang/src/khung/node/that';
const doc = (f) => readFileSync(f, 'utf8').replace(/\s+$/, '');
const tep = (ten) => [`${ten}.cjs`, `${ten}.mjs`].map((x) => path.join(THAT, x)).find(existsSync);
/** Mã thật: ma('c2/order') hoặc ma('c2/order', 2, 4) (dòng 1-based, gồm b). */
export const ma = (ten, a = 1, b) => doc(tep(ten)).split('\n').slice(a - 1, b).join('\n');
/** Output thật. nguon = 'out' | 'server'. */
export const ra = (ten, a = 1, b, nguon = 'out') => doc(path.join(THAT, `${ten}.${nguon === 'out' ? 'out' : 'server'}.txt`)).split('\n').slice(a - 1, b).join('\n');
export const js = (src, o = {}) => sql(src, { lang: 'javascript', ...o });
export const term = (text, o = {}) => psql(text, { ...o, title: o.title ?? 'terminal · Node 22' });
export const runJs = (src, out, o = {}) => `${js(src, { sm: o.sm ?? true, hl: o.hl })}${term(out, { sm: o.sm ?? true, hl: o.hlOut, title: o.title })}`;
/** Bảng chữ to (không dùng .d 17px): cols + rows, `hl` = chỉ số dòng tô. */
export const bang = (cols, rows, { hl = [], co = 22, cap = '' } = {}) => `<div>${cap ? `<div class="tcap" style="font-size:19px">${cap}</div>` : ''}<table class="t" style="font-size:${co}px"><tr>${cols.map((x) => `<th>${x}</th>`).join('')}</tr>${rows.map((r, i) => `<tr${hl.includes(i) ? ' style="font-weight:700"' : ''}>${r.map((v) => `<td${hl.includes(i) ? ' style="background:#fff3c4"' : ''}>${v}</td>`).join('')}</tr>`).join('')}</table></div>`;
/** Một cột dọc cho `two()`: two() là lưới 2 ô, truyền nhiều phần tử trần sẽ tràn sang hàng sau ⇒ bọc bằng cot(a, b, c). */
export const cot = (...x) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${x.join('')}</div>`;
