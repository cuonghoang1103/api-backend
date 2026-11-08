/**
 * _c8-chung.mjs — khuôn slide Node.js Chương 8 (xác thực & phân quyền, đợt 7 — 01/11/2026) = `_c7-chung.mjs` (tep, gay, R, P, Q, J, JW, T, so)
 * + vài công cụ dùng chung của chương. Khi chuyển vào repo web: chép cùng _node-chung.mjs + _c7-chung.mjs.
 * Mọi mã + output đọc THẲNG từ src/khung/node/that/{c8,c8notes} (chạy bằng scratchpad/node/chay-c8.mjs: Node 22.23.3, argon2 0.45.1, bcrypt 6.0.0,
 * jsonwebtoken 9.0.3, Express 5.3.0, Prisma 7.10.1 + PostgreSQL 17.11 trong Docker, Chromium 149 qua Playwright 1.61.0).
 *   G(ten, a, b, n)          output thật đã gói dòng ở n ký tự
 *   TT(ten, a, b, title, o)  khung terminal chứa output thật
 *   thanh(rows, o)           SVG thanh ngang (data-k="thanh"), rows = [nhãn, giá trị, màu, chữ bên phải]; o.log = thang log
 */
import { gay, T } from './_c7-chung.mjs';
import { ra } from './_node-chung.mjs';
export * from './_c7-chung.mjs';

export const G = (ten, a, b, n = 104) => gay(ra(ten, a, b).replace(/ localhost:4370/g, ' :4370'), n).replace(/\n+$/, '');
export const TT = (ten, a, b, title, o = {}) => T(G(ten, a, b, o.n), title, o);
/** Dòng output đầu tiên khớp re (để rút số THẬT ra khỏi output). */
export const dong = (ten, re) => ra(ten).split('\n').find((l) => re.test(l)) ?? '';

export function thanh(rows, { w = 1100, x0 = 330, wMax = 560, log = false, h0 = 56, chu = 21, ghi = '', k = 'thanh' } = {}) {
  const h = rows.length * h0 + (ghi ? 30 : 8);
  const v = rows.map((r) => r[1]);
  const f = log ? (x) => Math.log10(Math.max(1, x)) : (x) => x;
  const max = Math.max(...v.map(f));
  let s = `<svg data-k="${k}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  rows.forEach(([n, val, m, txt], i) => {
    const y = 6 + i * h0, bw = Math.max(8, (f(val) / max) * wMax);
    s += `<text x="${x0 - 14}" y="${y + 30}" text-anchor="end" font-size="${chu - 1}" font-weight="700" fill="#333" font-family="monospace">${n}</text>`;
    s += `<rect x="${x0}" y="${y + 8}" width="${bw}" height="32" rx="6" fill="${m}"/>`;
    s += `<text x="${x0 + bw + 12}" y="${y + 32}" font-size="${chu}" font-weight="800" fill="#333">${txt}</text>`;
  });
  if (ghi) s += `<text x="${x0}" y="${h - 6}" font-size="15" fill="#777">${ghi}</text>`;
  return s + '</svg>';
}
