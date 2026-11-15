/**
 * ch08/_rieng.mjs — hàm dựng bài RIÊNG của Chương 8 (Quay lui). Đề xuất đưa vào _chung.mjs: xem _tien-do/ch08.md.
 */
import { esc, oMang } from '../_chung.mjs';

/** Danh sách (đường đi, ngăn xếp): rỗng thì in [] cho dễ đọc, không thì vẽ ô. */
export const oDay = (arr, opts) => (arr.length ? oMang(arr, opts) : '<code>[]</code>');

/** Đường đi dạng chữ gọn: [1,2] — dùng trong ô bảng. */
export const duong = (arr) => `<code>[${arr.map(esc).join(',')}]</code>`;

const O = 'display:inline-block;width:1.45em;text-align:center;border:1px solid var(--border-color);margin:0;font-family:monospace;line-height:1.35';
const NEN = { q: 'rgba(47,158,107,.55)', x: 'rgba(224,85,75,.28)', t: 'rgba(214,146,32,.32)' };

/**
 * Bàn cờ n×n nhỏ trong một ô bảng: hau = [cột của hậu ở hàng 0, 1, …]; danhDau = { 'r,c': 'x'|'t' } tô thêm
 * (x = ô bị loại, t = ô đang thử). Không dùng svg/table lồng — mỗi hàng là một dòng span.
 */
export function banCo(n, hau, danhDau = {}) {
  const dong = [];
  for (let r = 0; r < n; r++) {
    let s = '';
    for (let c = 0; c < n; c++) {
      const laHau = hau[r] === c;
      const mau = laHau ? NEN.q : NEN[danhDau[`${r},${c}`]];
      s += `<span style="${O}${mau ? `;background:${mau}` : ''}">${laHau ? 'Q' : '·'}</span>`;
    }
    dong.push(`<span style="display:block;white-space:nowrap">${s}</span>`);
  }
  return `<span style="display:inline-block">${dong.join('')}</span>`;
}
