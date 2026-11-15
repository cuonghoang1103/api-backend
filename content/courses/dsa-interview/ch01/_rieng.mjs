/**
 * Hàm riêng của Chương 1 (không sửa _chung.mjs — hợp đồng mục 1). Đề xuất đưa lên _chung.mjs: bangDo + so + lan.
 * Lý do: số đo // @thoi-gian đổi mỗi lần đo lại ⇒ chữ trong bài ĐỌC số từ tệp .out, không gõ tay, nên chữ luôn khớp output.
 */
import { doc } from '../_chung.mjs';

/** Đọc bảng "n | cột | cột …" của một tệp đo (@thoi-gian) ⇒ [{ n, v: [số ms…] }] ('skipped' ⇒ NaN). */
export function bangDo(rel) {
  const dong = doc(`${rel}.out`).split('\n').filter((l) => l.includes('|'));
  return dong.slice(1).map((l) => {
    const o = l.split('|').map((s) => s.trim());
    return { n: Number(o[0].replace(/,/g, '')), v: o.slice(1).map((x) => (x === 'skipped' ? NaN : parseFloat(x))) };
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
