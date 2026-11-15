/**
 * Hàm riêng của Chương 7 (không sửa _chung.mjs — hợp đồng mục 1). Đề xuất đưa lên _chung.mjs: bangDo/so/lan (trùng Ch1) + oLuoi.
 * bangDo/hang/so/lan chép từ ch01/_rieng.mjs (không import chéo chương: chương khác đổi tệp của họ thì bài này không vỡ).
 */
import { doc, oMang } from '../_chung.mjs';

/** Đọc bảng "n | cột | cột …" của một tệp đo (@thoi-gian) ⇒ [{ n, v: [số…] }] ('skipped' ⇒ NaN). */
export function bangDo(rel) {
  const dong = doc(`${rel}.out`).split('\n').filter((l) => l.includes('|'));
  return dong.slice(1).map((l) => {
    const o = l.split('|').map((s) => s.trim());
    return { n: Number(o[0].replace(/,/g, '')), v: o.slice(1).map((x) => (/^skipped/.test(x) ? NaN : parseFloat(x))) };
  });
}

/** Một hàng của bảng đo theo n. */
export const hang = (bang, n) => {
  const h = bang.find((r) => r.n === n);
  if (!h) throw new Error(`bảng đo không có hàng n = ${n}`);
  return h.v;
};

/** Viết số theo ngôn ngữ: en 1,234.5 · vi 1.234,5. */
export const so = (x, d = 1, lang = 'en') =>
  Number(x).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/** Tỉ lệ a/b làm tròn "dễ nói": < 10 ⇒ 1 chữ số thập phân, < 1000 ⇒ số nguyên, còn lại ⇒ 2 chữ số có nghĩa. */
export function lan(a, b, lang = 'en') {
  const r = a / b;
  if (r < 10) return so(r, 1, lang);
  if (r < 1000) return so(Math.round(r), 0, lang);
  const p = 10 ** (Math.floor(Math.log10(r)) - 1);
  return so(Math.round(r / p) * p, 0, lang);
}

/**
 * Vẽ một lưới nhỏ (mảng 2 chiều) thành các hàng ô oMang xếp chồng — dùng trong ô bảng vết.
 * to = { 'r,c': 'cs'|'l'|'r'|'x'|'ok'|'mo' } tô nền theo toạ độ; doi = hàm đổi giá trị ô thành chữ hiển thị.
 */
export function oLuoi(grid, { to = {}, doi = (x) => x } = {}) {
  return grid.map((row, r) => {
    const t = {};
    row.forEach((_, c) => { if (to[`${r},${c}`]) t[c] = to[`${r},${c}`]; });
    return oMang(row.map(doi), { to: t });
  }).join('<br>');
}

/** Ngăn xếp / hàng đợi trong bảng vết: rỗng thì in [] cho dễ đọc. */
export const oDay = (arr, opts) => (arr.length ? oMang(arr, opts) : '<code>[]</code>');
