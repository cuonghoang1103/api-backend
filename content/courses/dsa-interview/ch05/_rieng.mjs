/**
 * ch05/_rieng.mjs — hàm dựng bài RIÊNG của Chương 5 (Cây). Đề xuất đưa oCay vào _chung.mjs (xem _tien-do/ch05.md).
 */
import { esc, oMang } from '../_chung.mjs';

const NEN = {
  cs: 'rgba(47,158,107,.28)',
  l: 'rgba(66,133,244,.30)',
  r: 'rgba(214,146,32,.32)',
  x: 'rgba(224,85,75,.28)',
  ok: 'rgba(47,158,107,.55)',
  mo: 'rgba(127,127,127,.12)',
};
// Ngắn có chủ đích (cùng hướng với oMang của _chung.mjs): style lặp ở mọi nút.
const NUT = 'display:inline-block;min-width:2em;text-align:center;border:1px solid var(--border-color);padding:1px 5px;border-radius:9px;font-family:monospace';

/**
 * Vẽ một cây nhị phân từ mảng kiểu LeetCode ([3,9,20,null,null,15,7]) thành các tầng xếp đúng vị trí trái/phải.
 * to = { [giáTrị]: 'cs'|'l'|'r'|'x'|'ok'|'mo' } tô nền theo GIÁ TRỊ nút (ví dụ trong chương dùng giá trị không trùng);
 * nhan = { [giáTrị]: 'chữ nhỏ' } in chỉ số trên. Không dùng svg (bị lọc) — mỗi tầng là một hàng 2^d ô.
 */
export function oCay(arr, { to = {}, nhan = {} } = {}) {
  if (!arr.length || arr[0] === null) return '<div class="out">[]</div>';
  const root = { v: arr[0], d: 0, p: 0 };
  const nodes = [root];
  const q = [root];
  let h = 0, i = 1;
  while (i < arr.length) {
    const n = q[h++];
    for (const side of [0, 1]) {
      if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
        const c = { v: arr[i], d: n.d + 1, p: n.p * 2 + side };
        nodes.push(c);
        q.push(c);
      }
      i++;
    }
  }
  const D = Math.max(...nodes.map((n) => n.d));
  const rows = [];
  for (let d = 0; d <= D; d++) {
    const slots = [];
    for (let p = 0; p < 2 ** d; p++) {
      const n = nodes.find((x) => x.d === d && x.p === p);
      if (!n) { slots.push('<span style="flex:1;min-width:0"></span>'); continue; }
      const bg = to[n.v] ? `background:${NEN[to[n.v]]};` : '';
      const sup = nhan[n.v] ? `<sup>${esc(nhan[n.v])}</sup>` : '';
      slots.push(`<span style="flex:1;min-width:0;text-align:center"><span style="${NUT};${bg}">${esc(n.v)}${sup}</span></span>`);
    }
    rows.push(`<div style="display:flex;margin:.15rem 0">${slots.join('')}</div>`);
  }
  return `<div class="cay-o" style="max-width:480px;margin:.6rem auto 1rem">\n${rows.join('\n')}\n</div>`;
}

/** Ngăn xếp / hàng đợi trong bảng vết: rỗng thì in [] cho dễ đọc. */
export const oDay = (arr, opts) => (arr.length ? oMang(arr, opts) : '<code>[]</code>');
