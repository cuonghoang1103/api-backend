/**
 * pg-09-hinh.mjs — hình SVG dùng chung cho Chương 9 — Chỉ mục (deck pg-09-1…4). Không phải deck. (agent c9, 25/10/2026)
 * Số liệu trong hình lấy từ output THẬT PostgreSQL 17.11 (video-bai-giang/src/khung/pg/that/pg-09-*.out.txt, pg-09-cay, pg-09-brin).
 * Chữ SVG: rộng ≈ 0,602 × cỡ chữ / ký tự (mono), ≈ 0,55 (Arial) — đặt nhãn bằng công thức. Phần tử video cần chú thích có data-k.
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7a5a9a', XAM = '#9a9a9a';
const head = (w, h, id, mau = NAU) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${mau}"/></marker></defs>`;
const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}"${o.a ? ` text-anchor="${o.a}"` : ''} font-size="${o.fs ?? 20}"${o.b ? ' font-weight="800"' : ''} fill="${o.c ?? '#333'}"${o.m ? ` font-family="${MONO}"` : ''}${o.k ? ` data-k="${o.k}"` : ''}>${esc(t)}</text>`;
const R = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 10}" fill="${o.f ?? '#fff'}" stroke="${o.s ?? '#c9d5e2'}" stroke-width="${o.sw ?? 2}"${o.k ? ` data-k="${o.k}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}${o.d ? ` stroke-dasharray="${o.d}"` : ''}/>`;
const L = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.c ?? NAU}" stroke-width="${o.w ?? 3.5}"${o.m ? ` marker-end="url(#${o.m})"` : ''}${o.d ? ` stroke-dasharray="${o.d}"` : ''}${o.k ? ` data-k="${o.k}"` : ''}/>`;

/** Mục lục sách: đọc 900 trang vs tra mục lục rồi giở trang 412. */
export function bookPic({ w = 1110 } = {}) {
  const h = 330;
  let s = head(w, h, 'bk9');
  // trái: chồng trang, mắt đọc từng trang
  s += T(12, 30, 'Without an index: read every page', { b: true, c: DO, fs: 22 });
  s += `<g data-k="book-pages">`;
  for (let i = 0; i < 9; i++) s += R(30 + i * 22, 50 + i * 7, 250, 180, { f: i === 8 ? '#fff' : '#fbf7ef', s: '#d9c9ae', rx: 6 });
  s += T(30 + 8 * 22 + 125, 50 + 56 + 96, 'page 1 … 900', { a: 'middle', fs: 22, b: true, c: '#7a5a3a' });
  s += `</g>`;
  s += T(30, 320, '“MVCC” is somewhere… check all 900 pages', { fs: 19, c: '#555' });
  // phải: mục lục
  const x0 = 600;
  s += T(x0, 30, 'With an index: look it up, jump', { b: true, c: XANH, fs: 22 });
  s += `<g data-k="book-index">${R(x0, 56, 250, 236, { f: '#f1f9f4', s: XANH, sw: 3 })}` + T(x0 + 125, 88, 'INDEX', { a: 'middle', b: true, c: XANH, fs: 22 });
  [['JOIN', 141], ['JSONB', 388], ['MVCC', 412], ['VACUUM', 655], ['WAL', 731]].forEach(([k, p], i) => {
    const y = 124 + i * 34, on = k === 'MVCC';
    if (on) s += R(x0 + 12, y - 24, 226, 32, { f: '#fff3c4', s: CAM, sw: 2.5, rx: 6, k: 'idx-mvcc' });
    s += T(x0 + 24, y, k, { m: true, fs: 20, b: on }) + T(x0 + 226, y, String(p), { a: 'end', m: true, fs: 20, b: on, c: on ? NAU : '#333' });
  });
  s += `</g>`;
  s += `<path d="M${x0 + 252},${124 + 2 * 34 - 8} C ${x0 + 330},${150} ${x0 + 340},${150} ${x0 + 372},${150}" fill="none" stroke="${XANH}" stroke-width="4" marker-end="url(#bk9)"/>`;
  s += `<g data-k="book-412">${R(x0 + 378, 90, 120, 160, { f: '#fff', s: XANH, sw: 3, rx: 6 })}` + T(x0 + 438, 180, 'p. 412', { a: 'middle', b: true, c: XANH, fs: 24 }) + `</g>`;
  s += T(x0, 320, 'a separate, SORTED list that points at pages', { fs: 19, c: '#555' });
  return s + '</svg>';
}

/** Trang 8 kB của bảng (heap): các ô dòng. */
export function heapPage({ w = 520, rows = 63 } = {}) {
  const h = 330;
  let s = head(w, h, 'hp9');
  s += R(10, 40, w - 20, 250, { f: '#fffdf6', s: PG, sw: 3, k: 'heap-page' });
  s += T(w / 2, 28, 'one heap page = 8 kB (8192 bytes)', { a: 'middle', b: true, c: PG, fs: 21 });
  s += R(22, 52, w - 44, 26, { f: '#e8f0f8', s: PG, sw: 1.5, rx: 4 }) + T(32, 71, 'header · item pointers →', { fs: 16, c: PG });
  const cols = 9, cw = (w - 44) / cols;
  for (let i = 0; i < 54; i++) {
    const cx = 22 + (i % cols) * cw, cy = 88 + Math.floor(i / cols) * 32;
    s += R(cx + 2, cy, cw - 4, 26, { f: '#fff', s: '#c9d5e2', sw: 1.5, rx: 4 });
  }
  s += T(w / 2, 312, `≈ ${rows} rows of event per page (500,000 / 7,937)`, { a: 'middle', fs: 18, c: '#555' });
  return s + '</svg>';
}

/** Thanh so sánh số trang đọc: rows [[nhãn, số, màu, ghi]]. Thanh tối thiểu 8px để số nhỏ vẫn thấy. */
export function barsPages({ rows, max, w = 1110, fs = 22, unit = 'pages', lw = 300 }) {
  const rh = 64, top = 18, bw = w - lw - 200;
  const h = top + rows.length * rh + 6;
  let s = head(w, h, 'bp9');
  rows.forEach(([t, v, c, ghi], i) => {
    const y = top + i * rh, len = Math.max(8, (v / max) * bw);
    s += T(lw - 14, y + 32, t, { a: 'end', fs, b: true, c, m: true });
    s += R(lw, y + 6, len, rh - 22, { f: c, s: c, rx: 5, k: `bar${i}` });
    s += T(lw + len + 12, y + 32, `${v.toLocaleString('en-US')} ${unit}`, { fs, b: true, c });
    if (ghi) s += T(lw + len + 12, y + 54, ghi, { fs: 16, c: '#666' });
  });
  return s + '</svg>';
}

/**
 * Cây B-tree THẬT của idx_event_email (pageinspect): gốc trang 164 → nhánh 800 → lá 829 → bảng (3937,47).
 * opts.path: tô đường đi; opts.badge: số đếm trang 1–4.
 */
export function btreePic({ w = 1110, h = 470, path = true, badge = true } = {}) {
  let s = head(w, h, 'bt9', XANH);
  const lab = (y, t1, t2) => T(12, y, t1, { b: true, c: PG, fs: 18 }) + T(12, y + 22, t2, { fs: 16, c: '#666' });
  // tầng 2: gốc
  s += lab(52, 'level 2 · root', '1 page');
  const rx = 330, rw = 560;
  s += R(rx, 24, rw, 64, { f: '#e8f0f8', s: PG, sw: 3, k: 'bt-root' });
  const rk = ['−∞', 'user12886', '…', 'user244335', 'user273201', 'user82'];
  rk.forEach((k, i) => { s += T(rx + 46 + i * 93, 62, k, { a: 'middle', m: true, fs: 13, c: k === 'user244335' ? NAU : '#333', b: k === 'user244335' }); });
  s += T(rx + rw + 12, 50, 'page 164', { fs: 15, c: '#666', m: true }) + T(rx + rw + 12, 70, '16 keys', { fs: 15, c: '#666' });
  // tầng 1: 5 trong 16 trang nhánh
  s += lab(178, 'level 1 · internal', '16 pages');
  const iy = 150, ix = [180, 360, 540, 720, 900];
  const itxt = [['…', ''], ['user215469 …', 'page 641'], ['user244335 …', 'page 800'], ['user273201 …', 'page 959'], ['…', '']];
  ix.forEach((x, i) => {
    const on = path && i === 2;
    s += R(x, iy, 160, 56, { f: on ? '#f1f9f4' : '#fff', s: on ? XANH : '#c9d5e2', sw: on ? 3.5 : 2, k: `bt-int${i}` });
    s += T(x + 80, iy + 26, itxt[i][0], { a: 'middle', m: true, fs: 14, b: on });
    if (itxt[i][1]) s += T(x + 80, iy + 46, itxt[i][1], { a: 'middle', m: true, fs: 13, c: '#666' });
    s += L(rx + 60 + i * 110, 88, x + 80, iy, { c: on ? XANH : '#c9d5e2', w: on ? 4.5 : 2, m: on ? 'bt9' : undefined });
  });
  // tầng 0: lá
  s += lab(300, 'level 0 · leaves', '2,464 pages');
  const ly = 272, lx = [180, 340, 500, 660, 820, 980], lt = ['…', 'page 828', 'page 829', 'page 830', '…', '…'];
  lx.forEach((x, i) => {
    const on = path && i === 2;
    s += R(x, ly, 120, 56, { f: on ? '#f1f9f4' : '#fff', s: on ? XANH : '#c9d5e2', sw: on ? 3.5 : 2, k: `bt-leaf${i}` });
    s += T(x + 60, ly + 24, on ? 'user250000' : lt[i] === '…' ? '…' : 'keys…', { a: 'middle', m: true, fs: 13, b: on, c: on ? NAU : '#333' });
    s += T(x + 60, ly + 44, lt[i] === '…' ? '' : lt[i], { a: 'middle', m: true, fs: 13, c: '#666' });
    if (i < lx.length - 1) s += `<path d="M${x + 122},${ly + 28} L${x + 158},${ly + 28}" stroke="${XAM}" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#bt9)"/>`;
  });
  [1, 2, 3].forEach((j) => { const on = path && j === 2; s += L(ix[2] + 40 + (j - 1) * 40, iy + 56, lx[j] + 60, ly, { c: on ? XANH : '#c9d5e2', w: on ? 4.5 : 2, m: on ? 'bt9' : undefined }); });
  s += T(940, ly + 80, 'leaves are linked ⇢', { fs: 15, c: '#666' });
  // bảng
  s += lab(422, 'heap (the table)', '7,937 pages');
  s += R(330, 392, 560, 60, { f: '#fffdf6', s: CAM, sw: path ? 3.5 : 2, k: 'bt-heap' });
  s += T(610, 420, 'page 3937 · row 47', { a: 'middle', m: true, fs: 17, b: true, c: NAU }) + T(610, 442, 'user250000@example.com · status · amount …', { a: 'middle', m: true, fs: 13, c: '#555' });
  if (path) s += `<path d="M${lx[2] + 60},${ly + 56} C ${lx[2] + 60},${372} 610,${360} 610,${390}" fill="none" stroke="${CAM}" stroke-width="4.5" marker-end="url(#bt9)"/>` + T(640, 372, 'TID (3937,47)', { fs: 15, c: NAU, m: true, b: true });
  if (badge) [[rx, 24], [ix[2], iy], [lx[2], ly], [330, 392]].forEach(([x, y], i) => {
    s += `<g data-k="bt-b${i + 1}"><circle cx="${x}" cy="${y}" r="17" fill="${CAM}"/>` + T(x, y + 7, String(i + 1), { a: 'middle', b: true, c: '#fff', fs: 19 }) + `</g>`;
  });
  return s + '</svg>';
}

/** Lá nối nhau: khoảng id 1000…1100 — xuống một lần rồi đi ngang (gọn một hàng). */
export function leafChain({ w = 1110 } = {}) {
  const h = 130;
  let s = head(w, h, 'lc9', XANH);
  s += R(4, 30, 110, 46, { f: '#e8f0f8', s: PG, sw: 3 }) + T(59, 60, 'root', { a: 'middle', b: true, c: PG, fs: 19 });
  s += L(116, 53, 140, 53, { c: XANH, w: 4, m: 'lc9' });
  s += R(144, 30, 120, 46, { f: '#e8f0f8', s: PG, sw: 3 }) + T(204, 60, 'internal', { a: 'middle', b: true, c: PG, fs: 19 });
  s += L(266, 53, 290, 53, { c: XANH, w: 4, m: 'lc9' });
  const xs = [296, 496, 696, 896];
  const tt = [['ids 1000–…', true], ['… –1100 …', true], ['ids …', false], ['ids …', false]];
  xs.forEach((x, i) => {
    const on = tt[i][1];
    s += R(x, 26, 180, 54, { f: on ? '#f1f9f4' : '#fff', s: on ? XANH : '#c9d5e2', sw: on ? 3.5 : 2, k: `leaf${i}` });
    s += T(x + 90, 60, tt[i][0], { a: 'middle', m: true, fs: 17, b: on });
    if (i < xs.length - 1) s += L(x + 182, 53, x + 198, 53, { c: on && tt[i + 1][1] ? XANH : XAM, w: on && tt[i + 1][1] ? 4.5 : 2, m: 'lc9' });
  });
  s += T(296, 108, 'leaf → next leaf → … (linked)', { fs: 16, c: '#666' });
  s += T(4, 126, 'Seek ONCE to the first key (1000), then read sideways along the leaves until passing the last key (1100). (illustration)', { fs: 16, c: '#555' });
  return s + '</svg>';
}

/** Ba (bốn) cách đọc bảng. */
export function scanTypes({ w = 1110 } = {}) {
  const h = 300, cw = 262, gap = 20;
  let s = head(w, h, 'st9');
  const items = [
    ['Seq Scan', ['read every page,', 'top to bottom'], DO],
    ['Index Scan', ['walk the tree,', 'fetch row by row'], XANH],
    ['Bitmap Heap Scan', ['index → page list →', 'read pages in order'], CAM],
    ['Index Only Scan', ['answer from the index,', 'skip the table'], TIM],
  ];
  items.forEach(([t, sub, c], i) => {
    const x = i * (cw + gap);
    s += `<g data-k="scan${i}">${R(x + 2, 6, cw, h - 12, { f: '#fff', s: c, sw: 3 })}` + T(x + cw / 2 + 2, 38, t, { a: 'middle', b: true, c, fs: 21 });
    // hình nhỏ
    const gy = 64;
    if (i === 0) for (let j = 0; j < 12; j++) s += R(x + 22 + (j % 6) * 38, gy + Math.floor(j / 6) * 46, 30, 38, { f: '#fde2e0', s: c, sw: 1.5, rx: 3 });
    if (i === 1 || i === 2 || i === 3) {
      s += R(x + 106, gy, 60, 26, { f: '#e8f0f8', s: PG, sw: 2, rx: 4 }) + R(x + 66, gy + 38, 60, 26, { f: '#e8f0f8', s: PG, sw: 2, rx: 4 }) + R(x + 146, gy + 38, 60, 26, { f: '#e8f0f8', s: PG, sw: 2, rx: 4 });
      s += L(x + 136, gy + 26, x + 96, gy + 38, { c: PG, w: 2 }) + L(x + 136, gy + 26, x + 176, gy + 38, { c: PG, w: 2 });
    }
    if (i === 1) { s += L(x + 96, gy + 64, x + 70, gy + 110, { c, w: 3, m: 'st9' }) + L(x + 96, gy + 64, x + 190, gy + 110, { c, w: 3, m: 'st9' }); s += R(x + 46, gy + 112, 44, 34, { f: '#f1f9f4', s: c, sw: 2, rx: 3 }) + R(x + 170, gy + 112, 44, 34, { f: '#f1f9f4', s: c, sw: 2, rx: 3 }); }
    if (i === 2) { s += R(x + 40, gy + 86, 190, 26, { f: '#fff7ef', s: c, sw: 2, rx: 4 }) + T(x + 135, gy + 105, 'pages: 3, 9, 17, 40', { a: 'middle', m: true, fs: 14, c: NAU }); s += L(x + 135, gy + 64, x + 135, gy + 84, { c, w: 2.5, m: 'st9' }); for (let j = 0; j < 4; j++) s += R(x + 34 + j * 52, gy + 124, 40, 30, { f: '#fff3c4', s: c, sw: 2, rx: 3 }); }
    if (i === 3) s += T(x + cw / 2 + 2, gy + 130, 'no table pages', { a: 'middle', fs: 17, c, b: true });
    s += T(x + cw / 2 + 2, 256, sub[0], { a: 'middle', fs: 18, c: '#444' }) + T(x + cw / 2 + 2, 280, sub[1], { a: 'middle', fs: 18, c: '#444' });
    s += `</g>`;
  });
  return s + '</svg>';
}

/** Danh bạ sắp (họ, tên): "mọi Nguyễn" liền khối, "mọi An" rải rác. */
export function phoneBook({ w = 1110 } = {}) {
  const ds = [['Le', 'An'], ['Le', 'Minh'], ['Nguyen', 'An'], ['Nguyen', 'Binh'], ['Nguyen', 'Chi'], ['Nguyen', 'Lan'], ['Pham', 'An'], ['Pham', 'Duc'], ['Tran', 'An'], ['Tran', 'Hoa']];
  const h = 400, rh = 31;
  let s = head(w, h, 'pb9');
  s += T(12, 26, 'Phone book — sorted by (last_name, first_name)', { b: true, fs: 21, c: PG });
  ds.forEach(([l, f], i) => {
    const y = 40 + i * rh, ng = l === 'Nguyen', an = f === 'An';
    s += R(12, y, 330, rh - 4, { f: ng ? '#f1f9f4' : '#fff', s: ng ? XANH : '#c9d5e2', sw: ng ? 2.5 : 1.5, rx: 5, k: `pb${i}` });
    s += T(26, y + 20, l, { m: true, fs: 18, b: ng }) + T(180, y + 20, f, { m: true, fs: 18, c: an ? DO : '#333', b: an });
  });
  s += `<g data-k="pb-ok">${R(400, 60, 690, 110, { f: '#f1f9f4', s: XANH, sw: 3 })}` + T(420, 96, '✓ WHERE last_name = \'Nguyen\'', { m: true, fs: 20, b: true, c: XANH }) + T(420, 128, 'one contiguous block — jump in, read, stop', { fs: 19 }) + T(420, 154, '✓ also (last_name, first_name) = (\'Nguyen\', \'Chi\')', { fs: 17, c: '#555', m: true }) + `</g>`;
  s += `<g data-k="pb-bad">${R(400, 196, 690, 110, { f: '#fdf0ee', s: DO, sw: 3 })}` + T(420, 232, '✗ WHERE first_name = \'An\'', { m: true, fs: 20, b: true, c: DO }) + T(420, 264, 'scattered under every surname — no place to jump to', { fs: 19 }) + T(420, 290, 'you would have to read the whole book', { fs: 17, c: '#555' }) + `</g>`;
  s += T(12, 392, 'An index on (a, b) is exactly this layout on disk: sorted by a, then by b inside each a.', { fs: 19, c: '#555' });
  return s + '</svg>';
}

/** Lá của chỉ mục tổ hợp (user_id, created_at): khối user 42 đã sắp theo thời gian, đọc ngược 5 mục rồi dừng. */
export function compLeaf({ w = 1110 } = {}) {
  const e = [['41', 'Dec 12 13:19'], ['42', 'Jan 01 00:40'], ['42', 'Jan 01 17:20'], ['42', '…'], ['42', 'Dec 09 18:40'], ['42', 'Dec 10 11:20'], ['42', 'Dec 11 04:00'], ['42', 'Dec 11 20:40'], ['42', 'Dec 12 13:20'], ['43', 'Jan 01 00:41']];
  const h = 300, cw = 106;
  let s = head(w, h, 'cl9');
  s += T(12, 26, 'Leaf entries of idx_event_user_created — sorted by user_id, then created_at', { b: true, fs: 20, c: PG });
  e.forEach(([u, t], i) => {
    const x = 6 + i * (cw + 4), on = u === '42', top5 = i >= 4 && i <= 8;
    s += R(x, 50, cw, 92, { f: top5 ? '#fff3c4' : on ? '#f1f9f4' : '#fff', s: top5 ? CAM : on ? XANH : '#c9d5e2', sw: top5 ? 3 : 2, rx: 6, k: `cl${i}` });
    s += T(x + cw / 2, 84, u, { a: 'middle', m: true, fs: 22, b: true, c: on ? XANH : '#999' });
    s += T(x + cw / 2, 116, t, { a: 'middle', m: true, fs: 13, c: '#444' });
  });
  s += `<path d="M${6 + 8 * (cw + 4) + cw / 2},168 L${6 + 4 * (cw + 4) + 20},168" stroke="${CAM}" stroke-width="5" marker-end="url(#cl9)"/>`;
  s += T(6 + 4 * (cw + 4) + 20, 196, 'Index Scan Backward: start at the newest 42, take 5, stop', { fs: 19, b: true, c: NAU });
  s += R(6 + 1 * (cw + 4) - 4, 214, 8 * (cw + 4) - 4, 40, { f: 'none', s: XANH, sw: 2.5, d: '6 5', rx: 8 });
  s += T(6 + 1 * (cw + 4) + 10, 240, 'all 500 rows of user 42 sit together, already in created_at order', { fs: 18, c: XANH });
  s += T(12, 288, 'No Sort node needed: the order is stored in the index.', { fs: 19, c: '#555' });
  return s + '</svg>';
}

/** Bằng trước, khoảng sau: phần chỉ mục phải đọc với hai thứ tự cột. */
export function eqRange({ w = 1110 } = {}) {
  const h = 330, x0 = 300, ww = 780;
  let s = head(w, h, 'er9');
  s += T(12, 26, 'WHERE status = \'pending\' AND created_at >= \'2024-06-01\'', { m: true, fs: 19, b: true });
  // (created_at, status)
  s += T(12, 82, '(created_at, status)', { m: true, fs: 18, b: true, c: DO }) + T(12, 104, 'range column first', { fs: 15, c: '#666' });
  for (let i = 0; i < 48; i++) {
    const c = i % 7 === 3 ? '#e6b3ad' : '#e3e8ef';
    s += `<rect x="${x0 + i * (ww / 48)}" y="62" width="${ww / 48 - 2}" height="44" fill="${c}"/>`;
  }
  s += R(x0 + ww * 0.415, 56, ww * 0.585, 56, { f: 'none', s: DO, sw: 3.5, rx: 4, k: 'er-bad' });
  s += T(x0, 132, 'Jan', { fs: 15, c: '#666' }) + T(x0 + ww * 0.415, 132, 'Jun 1 →', { fs: 15, c: DO, b: true }) + T(x0 + ww - 30, 132, 'Dec', { fs: 15, c: '#666' });
  s += T(x0 + ww, 160, 'read every entry after June 1, keep 1% · 1,081 pages', { a: 'end', fs: 18, b: true, c: DO });
  // (status, created_at)
  s += T(12, 222, '(status, created_at)', { m: true, fs: 18, b: true, c: XANH }) + T(12, 244, 'equality column first', { fs: 15, c: '#666' });
  const seg = [['active', 0.66, '#e3e8ef'], ['done', 0.33, '#d5dde8'], ['pending', 0.01, '#9fd0b2']];
  let xx = x0;
  seg.forEach(([t, f, c]) => {
    const ww2 = Math.max(f * ww, 40);
    s += `<rect x="${xx}" y="200" width="${ww2 - 3}" height="44" fill="${c}"/>`;
    s += t === 'pending' ? T(xx - 6, 190, 'pending ↓', { a: 'end', fs: 16, m: true, b: true, c: XANH }) : T(xx + 10, 228, t, { fs: 16, m: true, c: '#444' });
    xx += ww2;
  });
  s += R(x0 + ww - 22, 194, 26, 56, { f: 'none', s: XANH, sw: 3.5, rx: 4, k: 'er-ok' });
  s += T(x0 + ww - 10, 276, 'jump to pending, June → read a thin slice · 15 pages', { a: 'end', fs: 18, b: true, c: XANH });
  s += T(12, 318, 'Equality columns first, the range (or sort) column last: then the matching rows are ONE contiguous slice.', { fs: 18, c: '#555' });
  return s + '</svg>';
}

/** Visibility map: mỗi trang bảng có cờ all-visible. */
export function vmPic({ w = 1110, sau = false } = {}) {
  const h = 230, n = 12, pw = 78;
  let s = head(w, h, 'vm9');
  s += T(12, 26, sau ? 'After VACUUM: every page all-visible again' : 'After an UPDATE: some pages lose the all-visible flag', { b: true, fs: 20, c: sau ? XANH : DO });
  const bad = sau ? [] : [2, 5, 9];
  for (let i = 0; i < n; i++) {
    const x = 12 + i * (pw + 12), b = bad.includes(i);
    s += R(x, 50, pw, 70, { f: '#fffdf6', s: b ? DO : PG, sw: b ? 3 : 2, rx: 6, k: `vm-p${i}` }) + T(x + pw / 2, 92, `p${i}`, { a: 'middle', m: true, fs: 16, c: '#555' });
    s += `<circle cx="${x + pw / 2}" cy="148" r="15" fill="${b ? '#fde2e0' : '#e1f3e8'}" stroke="${b ? DO : XANH}" stroke-width="2.5"/>` + T(x + pw / 2, 155, b ? '✗' : '✓', { a: 'middle', b: true, fs: 19, c: b ? DO : XANH });
  }
  s += T(12, 196, 'visibility map: 1 bit per page — “every row here is visible to everyone”', { fs: 18, c: '#444' });
  s += T(12, 222, sau ? 'Index Only Scan trusts the ✓ and never opens the page → Heap Fetches: 0' : 'On a ✗ page the Index Only Scan must open the table page to check → Heap Fetches > 0', { fs: 18, b: true, c: sau ? XANH : DO });
  return s + '</svg>';
}

/** Độ chọn lọc: số dòng phải xử lý + số trang chạm. */
export function selPic({ w = 1110 } = {}) {
  const h = 300, n = 40, cols = 20, pw = 26;
  let s = head(w, h, 'se9');
  const drawGrid = (x0, y0, mau, every, lab, k) => {
    let g = `<g data-k="${k}">`;
    for (let i = 0; i < n; i++) {
      const x = x0 + (i % cols) * (pw + 2), y = y0 + Math.floor(i / cols) * (pw + 2);
      g += R(x, y, pw, pw, { f: '#fffdf6', s: '#c9d5e2', sw: 1, rx: 3 });
      const dots = every ? 4 : (i % 3 === 1 ? 1 : 0);
      for (let d = 0; d < dots; d++) g += `<circle cx="${x + 7 + (d % 2) * 12}" cy="${y + 7 + Math.floor(d / 2) * 12}" r="4" fill="${mau}"/>`;
    }
    return g + `</g>` + T(x0, y0 + 2 * (pw + 2) + 24, lab, { fs: 18, b: true, c: mau });
  };
  s += T(12, 26, "status = 'active' — 66% of rows", { b: true, fs: 20, c: DO });
  s += drawGrid(12, 40, DO, true, 'a match on EVERY page → index cannot skip anything', 'sel-active');
  s += T(600, 26, "status = 'pending' — 1% of rows", { b: true, fs: 20, c: XANH });
  s += drawGrid(600, 40, XANH, false, 'few matches → index checks 5,000 rows, not 500,000', 'sel-pending');
  s += R(12, 170, 540, 112, { f: '#fdf0ee', s: DO, sw: 2.5, k: 'sel-a' }) + T(28, 204, 'Seq Scan: all 7,941 pages', { fs: 19, b: true, c: DO, m: true }) + T(28, 236, 'forced index: 280 index + 7,941 table pages', { fs: 17, m: true }) + T(28, 264, '= MORE pages, no win', { fs: 17, b: true, c: DO });
  s += R(600, 170, 498, 112, { f: '#f1f9f4', s: XANH, sw: 2.5, k: 'sel-p' }) + T(616, 204, 'Bitmap Heap Scan: ~10× faster', { fs: 19, b: true, c: XANH, m: true }) + T(616, 236, '5,000 rows checked instead of 500,000', { fs: 17, m: true }) + T(616, 264, '= the index wins', { fs: 17, b: true, c: XANH });
  return s + '</svg>';
}

/** Chỉ mục toàn phần vs partial: số mục + kích thước. */
export function partialPic({ w = 1110 } = {}) {
  const h = 210;
  let s = head(1110, h, 'pa9').replace('width="1110" height="210"', `width="${w}" height="${Math.round(h * w / 1110)}"`);
  s += T(12, 30, 'idx_event_status — every row', { m: true, fs: 19, b: true, c: PG });
  s += R(12, 44, 1000, 46, { f: '#e8f0f8', s: PG, sw: 2.5, k: 'pa-full' }) + T(26, 74, '500,000 entries · 3,408 kB', { m: true, fs: 20, b: true, c: PG });
  s += T(12, 130, "idx_event_pending — WHERE status = 'pending'", { m: true, fs: 19, b: true, c: XANH });
  s += R(12, 144, 37, 46, { f: '#e1f3e8', s: XANH, sw: 2.5, k: 'pa-part' }) + T(62, 174, '5,000 entries · 128 kB  (≈ 27× smaller)', { m: true, fs: 20, b: true, c: XANH });
  return s + '</svg>';
}

/** GIN = chỉ mục ngược: phần tử → danh sách dòng. */
export function ginPic({ w = 1110 } = {}) {
  const h = 320;
  let s = head(w, h, 'gi9', TIM);
  s += T(12, 26, 'rows (props)', { b: true, fs: 20, c: PG });
  const rows = [[15, '["t15","k1"]'], [16, '["t16","k2"]'], [35, '["t15","k0"]'], [52, '["t12","k3"]']];
  rows.forEach(([id, t], i) => { const y = 42 + i * 56; s += R(12, y, 330, 46, { f: '#fff', s: '#c9d5e2', sw: 2, rx: 7, k: `gi-row${i}` }) + T(26, y + 30, `id ${id}`, { m: true, fs: 18, b: true }) + T(120, y + 30, `{"tags": ${t}}`, { m: true, fs: 15 }); });
  s += T(420, 26, 'GIN: every element → list of rows (posting list)', { b: true, fs: 20, c: TIM });
  const ks = [['"t15"', 'rows 15, 35, 55, 75 … (25,000)', true], ['"t16"', 'rows 16, 36, 56 …', false], ['"k3"', 'rows 3, 10, 17, 52 … (71,429)', false], ['"tags"', 'every row (a key, also indexed)', false]];
  ks.forEach(([k, l, on], i) => {
    const y = 42 + i * 56;
    s += R(420, y, 120, 46, { f: on ? '#f4eff9' : '#fff', s: TIM, sw: on ? 3.5 : 2, rx: 7, k: `gi-key${i}` }) + T(480, y + 30, k, { a: 'middle', m: true, fs: 18, b: true, c: TIM });
    s += L(544, y + 23, 580, y + 23, { c: TIM, w: 2.5, m: 'gi9' }) + T(588, y + 30, l, { m: true, fs: 16, c: on ? NAU : '#333', b: on });
  });
  s += T(12, 300, 'A B-tree indexes the WHOLE value; GIN indexes the pieces INSIDE it — like a cookbook index by ingredient.', { fs: 18, c: '#555' });
  return s + '</svg>';
}

/** BRIN: mỗi khoảng 128 trang giữ (min .. max) — số thật brin_page_items. */
export function brinPic({ w = 1110 } = {}) {
  const r = [['1024', 'Feb 16 05:20', 'Feb 21 23:59', false], ['1152', 'Feb 22 00:00', 'Feb 27 18:39', false], ['1280', 'Feb 27 18:40', 'Mar 04 13:19', true], ['1408', 'Mar 04 13:20', 'Mar 10 07:59', true], ['1536', 'Mar 10 08:00', 'Mar 15 21:27', false], ['1664', 'Mar 15 21:28', 'Mar 21 10:49', false]];
  const h = 300, cw = 176;
  let s = head(w, h, 'br9');
  s += T(12, 26, "BRIN on created_at — one summary per 128 table pages", { b: true, fs: 20, c: PG });
  r.forEach(([b, a, z, on], i) => {
    const x = 6 + i * (cw + 8);
    s += R(x, 44, cw, 120, { f: on ? '#fff3c4' : '#fffdf6', s: on ? CAM : '#c9d5e2', sw: on ? 3.5 : 2, rx: 8, k: `br${i}` });
    s += T(x + cw / 2, 70, `pages ${b}–${Number(b) + 127}`, { a: 'middle', m: true, fs: 14, c: '#555' });
    s += T(x + cw / 2, 104, a, { a: 'middle', m: true, fs: 16, b: on }) + T(x + cw / 2, 124, '..', { a: 'middle', m: true, fs: 16 }) + T(x + cw / 2, 146, z, { a: 'middle', m: true, fs: 16, b: on });
    s += T(x + cw / 2, 190, on ? 'READ' : 'skip', { a: 'middle', b: true, fs: 20, c: on ? NAU : XAM });
  });
  s += T(12, 236, "WHERE created_at BETWEEN '2024-03-01' AND '2024-03-08' → only ranges whose min..max overlap", { m: true, fs: 16, c: '#333' });
  s += T(12, 264, 'Lossy: it knows WHICH PAGES might match, not which rows → re-check every row on those pages.', { fs: 18, c: '#555' });
  s += T(12, 290, 'Real values from brin_page_items (PostgreSQL 17.11). Whole index: 3 pages, 24 kB.', { fs: 16, c: '#777' });
  return s + '</svg>';
}

/** GiST: hai đặt phòng chồng giờ trên trục thời gian. */
export function rangesPic({ w = 1110 } = {}) {
  const h = 230, x0 = 200, hw = 260; // 09:00 → x0, mỗi giờ hw
  const X = (t) => x0 + (t - 9) * hw;
  let s = head(1110, h, 'rg9').replace('width="1110" height="230"', `width="${w}" height="${Math.round(230 * w / 1110)}"`);
  [9, 10, 11, 12].forEach((t) => { s += L(X(t), 30, X(t), 190, { c: '#e3e3e3', w: 1.5 }) + T(X(t), 214, `${t}:00`, { a: 'middle', m: true, fs: 16, c: '#666' }); });
  s += T(12, 70, 'room 1', { b: true, fs: 20, c: PG }) + T(12, 160, 'room 2', { b: true, fs: 20, c: PG });
  s += R(X(9), 44, X(11) - X(9), 40, { f: '#e1f3e8', s: XANH, sw: 2.5, rx: 6, k: 'rg-a' }) + T(X(9) + 10, 70, '09:00–11:00 ✓', { fs: 17, b: true, c: XANH });
  s += R(X(11), 44, X(12) - X(11), 40, { f: '#e1f3e8', s: XANH, sw: 2.5, rx: 6, k: 'rg-c' }) + T(X(11) + 10, 70, '11:00–12:00 ✓', { fs: 17, b: true, c: XANH });
  s += R(X(10.5), 92, X(12) - X(10.5), 36, { f: '#fde2e0', s: DO, sw: 3, rx: 6, d: '7 5', k: 'rg-b' }) + T(X(10.5) + 10, 116, '10:30–12:00 ✗ overlaps', { fs: 17, b: true, c: DO });
  s += R(X(10), 136, X(12) - X(10), 40, { f: '#e1f3e8', s: XANH, sw: 2.5, rx: 6, k: 'rg-d' }) + T(X(10) + 10, 162, '10:00–12:00 ✓ (other room)', { fs: 17, b: true, c: XANH });
  return s + '</svg>';
}

/** Kích thước mọi chỉ mục trên event (thật) so với bảng. */
export function sizeBars({ w = 1110 } = {}) {
  const rows = [['table event (heap)', 62 * 1024, '#9aa9b8'], ['idx_event_email · btree', 19 * 1024, PG], ['idx_event_lower_email · btree', 19 * 1024, PG], ['idx_event_user_created · btree', 15 * 1024, PG], ['idx_event_user_incl · btree', 15 * 1024, PG], ['idx_event_created · btree', 11 * 1024, PG], ['event_pkey · btree', 11 * 1024, PG], ['idx_event_status · btree', 3408, PG], ['idx_event_props · gin', 2192, TIM], ['idx_event_pending · partial', 128, XANH], ['idx_event_created_brin · brin', 24, CAM]];
  const lab = (kb) => (kb >= 1024 ? `${Math.round(kb / 1024)} MB` : `${kb} kB`);
  const rh = 33, lw = 400, bw = w - lw - 110, max = 62 * 1024;
  const h = 10 + rows.length * rh;
  let s = head(w, h, 'sb9');
  rows.forEach(([t, kb, c], i) => {
    const y = 6 + i * rh, len = Math.max(4, (kb / max) * bw);
    s += T(lw - 12, y + 22, t, { a: 'end', m: true, fs: 15, c: i === 0 ? '#555' : '#333', b: i === 0 });
    s += R(lw, y + 5, len, rh - 10, { f: c, s: c, rx: 4, k: `sb${i}` }) + T(lw + len + 10, y + 23, lab(kb), { m: true, fs: 16, b: true, c });
  });
  return s + '</svg>';
}
