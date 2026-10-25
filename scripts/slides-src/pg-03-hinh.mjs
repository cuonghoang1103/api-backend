/**
 * pg-03-hinh.mjs — hình SVG dùng chung cho Chương 3 (deck pg-03-1…4). Không phải deck. Chữ SVG rộng ≈ 0,602 × cỡ chữ / ký tự.
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';

/** Một bảng ERD: { id, x, y, w, title, color, cols: [{ n: 'id', t: 'bigint', k: 'PK'|'FK'|'UQ'|'' }] } → SVG <g>. Trả về { svg, h, ys(colName) } */
export function erdTable({ id, x, y, w = 300, title, color = '#336791', cols, fs = 19 }) {
  const rowH = fs + 15, head = fs + 20;
  const h = head + cols.length * rowH + 8;
  let s = `<g data-k="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fff" stroke="${color}" stroke-width="3"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${head}" rx="6" fill="${color}"/>` +
    `<text x="${x + w / 2}" y="${y + head - 9}" text-anchor="middle" font-size="${fs + 3}" font-weight="800" fill="#fff" font-family="${MONO}">${esc(title)}</text>`;
  cols.forEach((c, i) => {
    const yy = y + head + (i + 1) * rowH - 9;
    const kcol = c.k === 'PK' ? '#b85a2b' : c.k === 'FK' ? '#336791' : '#2f7d4f';
    if (c.k) s += `<text x="${x + 12}" y="${yy}" font-size="${fs - 3}" font-weight="800" fill="${kcol}" font-family="${MONO}">${c.k}</text>`;
    s += `<text x="${x + 52}" y="${yy}" font-size="${fs}" fill="#333" font-family="${MONO}"${c.k === 'PK' ? ' font-weight="800"' : ''}>${esc(c.n)}</text>`;
    s += `<text x="${x + w - 12}" y="${yy}" text-anchor="end" font-size="${fs - 3}" fill="#777" font-family="${MONO}">${esc(c.t || '')}</text>`;
  });
  s += '</g>';
  const ys = (n) => y + head + (cols.findIndex((c) => c.n === n) + 1) * rowH - rowH / 2 - 4;
  return { svg: s, h, ys, x, y, w };
}

/** Crow's foot: đầu "one" (‖) tại (x,y) hướng dir (+1 sang phải / -1 sang trái). */
export const one = (x, y, dir = 1) => `<line x1="${x + dir * 14}" y1="${y - 14}" x2="${x + dir * 14}" y2="${y + 14}" stroke="#404040" stroke-width="3"/>` +
  `<line x1="${x + dir * 28}" y1="${y - 14}" x2="${x + dir * 28}" y2="${y + 14}" stroke="#404040" stroke-width="3"/>`;
/** Đầu "zero or many" (○<) tại (x,y): chân quạ chạm bảng ở (x,y), hướng dir. */
export const many = (x, y, dir = 1, zero = true) => `<path d="M${x},${y} L${x + dir * 30},${y - 15} M${x},${y} L${x + dir * 30},${y + 15} M${x},${y} L${x + dir * 30},${y}" stroke="#404040" stroke-width="3" fill="none"/>` +
  (zero ? `<circle cx="${x + dir * 44}" cy="${y}" r="9" fill="#fff" stroke="#404040" stroke-width="3"/>` : `<line x1="${x + dir * 38}" y1="${y - 14}" x2="${x + dir * 38}" y2="${y + 14}" stroke="#404040" stroke-width="3"/>`);

/** Mũi tên SVG đơn giản. */
export const arrow = (x1, y1, x2, y2, color = '#e08a1e', w = 4) => {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 14;
  const p1 = [x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)], p2 = [x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45)];
  return `<line x1="${x1}" y1="${y1}" x2="${x2 - 6 * Math.cos(a)}" y2="${y2 - 6 * Math.sin(a)}" stroke="${color}" stroke-width="${w}"/>` +
    `<path d="M${x2},${y2} L${p1[0]},${p1[1]} L${p2[0]},${p2[1]} z" fill="${color}"/>`;
};

/** Thẻ căn cước kiểu CCCD (minh hoạ, tên giả). */
export const idCard = (x, y, w = 380, no = '012345678901', name = 'NGUYEN VAN AN') => `<g data-k="idcard"><rect x="${x}" y="${y}" width="${w}" height="210" rx="14" fill="#fff8e6" stroke="#b85a2b" stroke-width="3"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="40" rx="14" fill="#b85a2b"/><rect x="${x}" y="${y + 26}" width="${w}" height="14" fill="#b85a2b"/>` +
  `<text x="${x + w / 2}" y="${y + 28}" text-anchor="middle" font-size="19" font-weight="800" fill="#fff">CITIZEN ID CARD (example)</text>` +
  `<rect x="${x + 18}" y="${y + 60}" width="92" height="116" rx="8" fill="#e8d9b8" stroke="#b9a37a" stroke-width="2"/><text x="${x + 64}" y="${y + 132}" text-anchor="middle" font-size="46">🙂</text>` +
  `<text x="${x + 128}" y="${y + 84}" font-size="16" fill="#777">ID number</text><text x="${x + 128}" y="${y + 114}" font-size="26" font-weight="800" fill="#262626" font-family="${MONO}" data-k="idno">${no}</text>` +
  `<text x="${x + 128}" y="${y + 150}" font-size="16" fill="#777">Full name</text><text x="${x + 128}" y="${y + 176}" font-size="21" font-weight="700" fill="#404040">${name}</text></g>`;

/** Cổng soát vé: các ràng buộc nối tiếp. items: [{ t:'NOT NULL', s:'must have a value', mau }] — một dòng dữ liệu 🧾 đi qua từng cổng. */
export function gates(items, { w = 1110, h = 190 } = {}) {
  const n = items.length, gw = 120, gap = (w - 140 - n * gw) / (n);
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><text x="30" y="${h / 2 + 18}" font-size="52">🧾</text>`;
  s += `<line x1="90" y1="${h / 2}" x2="${w - 40}" y2="${h / 2}" stroke="#bbb" stroke-width="4" stroke-dasharray="10 8"/>`;
  items.forEach((it, i) => {
    const x = 130 + gap / 2 + i * (gw + gap), m = it.mau || '#336791';
    s += `<g data-k="g${i}"><rect x="${x}" y="22" width="${gw}" height="${h - 90}" rx="10" fill="${m}18" stroke="${m}" stroke-width="3.5"/>` +
      `<rect x="${x + gw / 2 - 9}" y="22" width="18" height="${h - 90}" fill="${m}" opacity=".85"/>` +
      `<text x="${x + gw / 2}" y="${h - 48}" text-anchor="middle" font-size="19" font-weight="800" fill="${m}">${it.t}</text>` +
      `<text x="${x + gw / 2}" y="${h - 22}" text-anchor="middle" font-size="15" fill="#555">${it.s || ''}</text></g>`;
    s += `<path d="M${x - 14},${h / 2 - 8} l12,8 l-12,8" fill="none" stroke="#e08a1e" stroke-width="3.5"/>`;
  });
  return s + `<text x="${w - 30}" y="${h / 2 + 18}" text-anchor="end" font-size="40">🗄️</text></svg>`;
}
