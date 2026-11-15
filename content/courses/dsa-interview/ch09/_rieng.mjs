/** Hàm riêng của Chương 9 — Quy hoạch động (đề xuất đưa vào _chung.mjs: xem _tien-do/ch09.md). */
import { esc } from '../_chung.mjs';

// Cùng bảng màu với oMang (_chung.mjs › NEN) để mọi bảng của khoá đọc giống nhau.
const NEN = {
  cs: 'rgba(47,158,107,.28)',   // ô vừa dùng để tính (nguồn)
  l: 'rgba(66,133,244,.30)',    // ô đang tính
  r: 'rgba(214,146,32,.32)',    // ô phụ / nhánh còn lại
  x: 'rgba(224,85,75,.28)',     // sai / bị loại
  ok: 'rgba(47,158,107,.55)',   // đáp án / đường truy vết
  mo: 'rgba(127,127,127,.12)',  // hàng/cột cơ sở
};
const TD = 'text-align:center;font-family:monospace;padding:2px 6px';

/** In một giá trị DP: Infinity ⇒ ∞, null/undefined ⇒ ·, còn lại esc(String). */
export const gtDP = (v) => (v === Infinity ? '∞' : v === -Infinity ? '−∞' : v == null ? '·' : esc(String(v)));

/**
 * Bảng DP 2 chiều thành <table class="bang-vet">.
 *   m    = mảng 2 chiều giá trị (số/chuỗi; Infinity ⇒ ∞)
 *   hang = nhãn từng hàng (cột đầu), cot = nhãn từng cột (hàng đầu), goc = chữ ở ô góc trên trái
 *   to   = { 'r,c': 'l'|'cs'|'r'|'ok'|'x'|'mo' } màu nền ô; coSo = true ⇒ hàng 0 + cột 0 tô 'mo' (ca cơ sở)
 *   chu  = { 'r,c': 'chữ thêm' } (vd mũi tên truy vết '↖'), đặt sau giá trị
 * Nhãn hàng/cột là chữ trung tính (dùng chung hai ngôn ngữ) — đặt bảng NGOÀI khối ngôn ngữ.
 */
export function bangDP(m, { hang = [], cot = [], goc = '', to = {}, coSo = false, chu = {} } = {}) {
  const dau = cot.length ? `<thead><tr><th>${goc}</th>${cot.map((c) => `<th>${esc(String(c))}</th>`).join('')}</tr></thead>\n` : '';
  const than = m.map((row, r) => `<tr><th>${hang[r] != null ? esc(String(hang[r])) : r}</th>` + row.map((v, c) => {
    const mau = to[`${r},${c}`] ?? (coSo && (r === 0 || c === 0) ? 'mo' : null);
    const bg = mau ? `;background:${NEN[mau]}` : '';
    const them = chu[`${r},${c}`] ? `<sup>${chu[`${r},${c}`]}</sup>` : '';
    return `<td style="${TD}${bg}">${gtDP(v)}${them}</td>`;
  }).join('') + '</tr>').join('\n');
  return `<table class="bang-vet">\n${dau}<tbody>\n${than}\n</tbody></table>`;
}
