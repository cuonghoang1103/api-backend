/**
 * pg-08-hinh.mjs — hình SVG dùng chung cho Chương 8 — Hàm cửa sổ (deck pg-08-1…4). Không phải deck. (agent c8, 25/10/2026)
 * Chữ SVG mono: rộng ≈ 0,602 × cỡ chữ / ký tự — đặt nhãn bằng công thức (tw()). Mọi phần tử video cần chú thích có data-k.
 * Lõi: strip() = một "dải bảng" dọc: tô màu theo phân vùng, con trỏ dòng hiện tại, khung (vùng sáng), nhóm hoà (peers), ô sáng.
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7a5a9a', XAM = '#9a9a9a';
export const tw = (s, fs) => String(s).length * fs * 0.602;
/** Màu phân vùng: nền nhạt + viền. */
export const PART = [
  { bg: '#e3edf7', st: PG, ten: 'blue' }, { bg: '#fdebd8', st: CAM, ten: 'orange' },
  { bg: '#e4f3e9', st: XANH, ten: 'green' }, { bg: '#efe7f6', st: TIM, ten: 'purple' },
];
const head = (w, h, id) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">` +
  `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker>` +
  `<marker id="${id}x" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${XANH}"/></marker>` +
  `<marker id="${id}t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${TIM}"/></marker></defs>`;
const isNum = (v) => typeof v === 'number' || /^-?\d+(\.\d+)?$/.test(String(v));
const cellTxt = (v, nullTxt) => (v === null || v === undefined ? nullTxt : String(v));

/**
 * Dải bảng dọc. Trả { s, w, h, y(i), x0, colX(j), colW(j) }.
 *  cols: [{ h: 'region', nw?: true (cột MỚI do hàm cửa sổ — tiêu đề cam) }] · rows: [[...]]
 *  part: [chỉ số màu phân vùng mỗi dòng] · dim: [dòng mờ] · hl: [dòng vàng] · cur: dòng hiện tại (mũi tên ▶ bên trái)
 *  frame: [a, b] khung (vùng sáng) · peers: [dòng hoà] (viền tím đứt) · cell: [[r, c, màu?]] ô tô · nullTxt
 */
export function strip({ x = 0, y = 0, cols, rows, fs = 18, rh = 38, part, dim = [], hl = [], cur = null, frame = null, peers = [], cell = [], nullTxt = 'NULL', k = 'st', minW = [] , frameMau = CAM }) {
  const pad = 10;
  const cw = cols.map((c, j) => Math.max(minW[j] || 0, Math.ceil(Math.max(tw(c.h, fs - 1), ...rows.map((r) => tw(cellTxt(r[j], nullTxt), fs))) + 2 * pad)));
  const W = cw.reduce((a, b) => a + b, 0);
  const cx = (j) => x + cw.slice(0, j).reduce((a, b) => a + b, 0);
  const yr = (i) => y + rh + i * rh;
  let s = `<g data-k="${k}">`;
  cols.forEach((c, j) => {
    s += `<rect data-k="${k}-h${j}" x="${cx(j)}" y="${y}" width="${cw[j]}" height="${rh}" fill="${c.nw ? CAM : PG}" stroke="#fff" stroke-width="1.5"/>` +
      `<text x="${cx(j) + pad}" y="${y + rh / 2 + fs * 0.36}" font-size="${fs - 1}" font-weight="700" fill="#fff" font-family="${MONO}">${esc(c.h)}</text>`;
  });
  rows.forEach((r, i) => {
    const p = part ? PART[part[i] % PART.length] : null;
    const bg = hl.includes(i) ? '#fff3c4' : p ? p.bg : '#fff';
    s += `<g data-k="${k}-r${i}" opacity="${dim.includes(i) ? 0.33 : 1}">`;
    r.forEach((v, j) => {
      const c = cell.find(([a, b]) => a === i && b === j);
      const isNull = v === null || v === undefined;
      const t = cellTxt(v, nullTxt);
      const tx = isNum(v) ? cx(j) + cw[j] - pad - tw(t, fs) : cx(j) + pad;
      s += `<rect x="${cx(j)}" y="${yr(i)}" width="${cw[j]}" height="${rh}" fill="${c ? c[2] || '#ffe08a' : cols[j].nw ? '#fffaf2' : bg}" stroke="${p ? p.st + '55' : '#c9d5e2'}" stroke-width="1.5"/>` +
        `<text x="${tx}" y="${yr(i) + rh / 2 + fs * 0.36}" font-size="${fs}" ${c ? 'font-weight="800"' : ''} fill="${isNull ? '#9a9a9a' : '#2b2b2b'}" ${isNull ? 'font-style="italic"' : ''} font-family="${MONO}">${esc(t)}</text>`;
    });
    s += '</g>';
  });
  if (part) { // viền đậm bao mỗi phân vùng
    let a = 0;
    for (let i = 1; i <= rows.length; i++) {
      if (i === rows.length || part[i] !== part[a]) {
        const p = PART[part[a] % PART.length];
        s += `<rect data-k="${k}-p${part[a]}" x="${x}" y="${yr(a)}" width="${W}" height="${(i - a) * rh}" fill="none" stroke="${p.st}" stroke-width="3"/>`;
        a = i;
      }
    }
  }
  if (peers.length) {
    const a = Math.min(...peers), b = Math.max(...peers);
    s += `<rect data-k="${k}-peers" x="${x - 6}" y="${yr(a) - 3}" width="${W + 12}" height="${(b - a + 1) * rh + 6}" rx="6" fill="none" stroke="${TIM}" stroke-width="3.5" stroke-dasharray="8 5"/>`;
  }
  if (frame) {
    const [a, b] = frame;
    s += `<rect data-k="${k}-fr" x="${x - 4}" y="${yr(a) - 2}" width="${W + 8}" height="${(b - a + 1) * rh + 4}" rx="7" fill="rgba(255,206,64,.20)" stroke="${frameMau}" stroke-width="4.5"/>`;
  }
  if (cur !== null) {
    const cy = yr(cur) + rh / 2;
    s += `<path data-k="${k}-cur" d="M${x - 30},${cy - 13} L${x - 9},${cy} L${x - 30},${cy + 13} z" fill="${DO}"/>`;
  }
  return { s: s + '</g>', w: W, h: rh * (rows.length + 1), y: yr, colX: cx, colW: (j) => cw[j], x0: x };
}

/* ═══════════ 8.1 ═══════════ */
const SALE = [['North', 'Alice', '100.00'], ['North', 'Alice', '150.00'], ['North', 'Bob', '200.00'], ['North', 'Bob', '150.00'],
  ['South', 'Carol', '300.00'], ['South', 'Carol', '250.00'], ['South', 'Dave', '180.00'], ['South', 'Dave', '220.00']];
const PART_REG = [0, 0, 0, 0, 1, 1, 1, 1];
export { SALE, PART_REG };

/** GROUP BY gộp dòng (rổ) vs cửa sổ giữ mọi dòng và gắn thêm cột. */
export function collapseVsKeep({ w = 1110 } = {}) {
  const fs = 20, rh = 40, top = 64;
  const A = strip({ x: 0, y: top, cols: [{ h: 'region' }, { h: 'seller' }, { h: 'amount' }], rows: SALE, part: PART_REG, fs, rh, k: 'in' });
  const gx = A.w + 140;
  const G = strip({ x: gx, y: top + rh * 2, cols: [{ h: 'region' }, { h: 'sum' , nw: true }], rows: [['North', '600.00'], ['South', '950.00']], part: [0, 1], fs, rh, k: 'gb' });
  const ox = gx + G.w + 140;
  const O = strip({ x: ox, y: top, cols: [{ h: 'region' }, { h: 'amount' }, { h: 'region_total', nw: true }], rows: SALE.map((r, i) => [r[0], r[2], i < 4 ? '600.00' : '950.00']), part: PART_REG, fs, rh, k: 'ow' });
  const H = top + A.h + 70;
  let s = head(w, H, 'cv8');
  s += `<text data-k="t-in" x="0" y="30" font-size="21" font-weight="800" fill="${PG}">8 sales</text>`;
  s += `<text data-k="t-gb" x="${gx}" y="30" font-size="21" font-weight="800" fill="${DO}">GROUP BY region</text>`;
  s += `<text x="${gx}" y="54" font-size="17" fill="#666">8 rows → 2 rows</text>`;
  s += `<text data-k="t-ow" x="${ox}" y="30" font-size="21" font-weight="800" fill="${XANH}">sum(amount) OVER (PARTITION BY region)</text>`;
  s += `<text x="${ox}" y="54" font-size="17" fill="#666">8 rows → still 8 rows, one new column</text>`;
  s += A.s + G.s + O.s;
  // phễu: mỗi phân vùng của input → 1 dòng GROUP BY
  const midN = A.y(0) + 2 * rh, midS = A.y(4) + 2 * rh;
  s += `<path data-k="f-n" d="M${A.w + 6},${midN} C${A.w + 50},${midN} ${gx - 50},${G.y(0) + rh / 2} ${gx - 6},${G.y(0) + rh / 2}" fill="none" stroke="${PG}" stroke-width="4" marker-end="url(#cv8)"/>`;
  s += `<path data-k="f-s" d="M${A.w + 6},${midS} C${A.w + 50},${midS} ${gx - 50},${G.y(1) + rh / 2} ${gx - 6},${G.y(1) + rh / 2}" fill="none" stroke="${CAM}" stroke-width="4" marker-end="url(#cv8)"/>`;
  s += `<text data-k="gb-lost" x="${gx}" y="${G.y(2) + 34}" font-size="18" font-weight="700" fill="${DO}">seller is gone ✗</text>`;
  s += `<text x="${gx}" y="${G.y(2) + 58}" font-size="17" fill="#666">(4 rows squeezed into 1)</text>`;
  // cửa sổ: các dòng đi thẳng sang
  s += `<text data-k="ow-keep" x="${ox}" y="${top + A.h + 34}" font-size="19" font-weight="800" fill="${XANH}">✓ every row survives — the total is attached</text>`;
  return s + '</svg>';
}

/** PARTITION BY tô màu: mỗi phân vùng là một cửa sổ riêng; ngoặc phải ghi tổng. */
export function partitionPic({ w = 1110 } = {}) {
  const fs = 20, rh = 42, top = 10;
  const T = strip({ x: 40, y: top, cols: [{ h: 'region' }, { h: 'seller' }, { h: 'amount' }, { h: 'region_total', nw: true }], rows: SALE.map((r, i) => [...r, i < 4 ? '600.00' : '950.00']), part: PART_REG, fs, rh, k: 'pt' });
  const H = top + T.h + 16;
  let s = head(w, H, 'pp8') + T.s;
  const bx = 40 + T.w + 24;
  [[0, 3, 0, 'window 1 · North', '100+150+200+150 = 600'], [4, 7, 1, 'window 2 · South', '300+250+180+220 = 950']].forEach(([a, b, p, t1, t2], i) => {
    const y1 = T.y(a) + 4, y2 = T.y(b) + rh - 4, st = PART[p].st;
    s += `<path data-k="br${i}" d="M${bx},${y1} q14,0 14,14 L${bx + 14},${y2 - 14} q0,14 -14,14" fill="none" stroke="${st}" stroke-width="4"/>`;
    s += `<text data-k="bt${i}" x="${bx + 34}" y="${(y1 + y2) / 2 - 8}" font-size="23" font-weight="800" fill="${st}">${t1}</text>`;
    s += `<text x="${bx + 34}" y="${(y1 + y2) / 2 + 22}" font-size="19" fill="#444" font-family="${MONO}">${t2}</text>`;
  });
  return s + '</svg>';
}

/** Giải phẫu một lời gọi hàm cửa sổ: hàm · OVER · PARTITION BY · ORDER BY · khung. */
export function anatomy({ w = 1110, fs = 24, active = [0, 1, 2, 3, 4] } = {}) {
  const parts = [
    { t: 'sum(amount)', c: '#a0522d', l1: '① the function', l2: 'sum, avg, count,', l3: 'rank, lag …', k: 'fn' },
    { t: 'OVER (', c: PG, l1: '② OVER', l2: 'makes it a', l3: 'window function', k: 'over' },
    { t: 'PARTITION BY region', c: CAM, l1: '③ which rows', l2: 'belong together', l3: '(8.1)', k: 'part' },
    { t: 'ORDER BY sold_on', c: XANH, l1: '④ order inside', l2: 'each window', l3: '(8.2, 8.3)', k: 'ord' },
    { t: 'ROWS …', c: TIM, l1: '⑤ the frame', l2: 'rows around the', l3: 'current one (8.4)', k: 'frame' },
    { t: ')', c: PG, l1: '', l2: '', l3: '', k: 'close' },
  ];
  const gap = 12, padx = 12;
  const ws = parts.map((p) => tw(p.t, fs) + 2 * padx);
  const tot = ws.reduce((a, b) => a + b, 0) + gap * (parts.length - 1);
  let x = Math.max(0, (w - tot) / 2);
  const H = 250;
  let s = head(w, H, 'an8');
  parts.forEach((p, i) => {
    const on = active.includes(i) || p.k === 'close';
    const bw = ws[i];
    s += `<g data-k="an-${p.k}" opacity="${on ? 1 : 0.28}"><rect x="${x}" y="20" width="${bw}" height="62" rx="9" fill="${p.c}18" stroke="${p.c}" stroke-width="3"/>` +
      `<text x="${x + padx}" y="${20 + 31 + fs * 0.36}" font-size="${fs}" font-weight="700" fill="${p.c}" font-family="${MONO}">${esc(p.t)}</text>`;
    if (p.l1) {
      const cx = x + bw / 2;
      s += `<line x1="${cx}" y1="86" x2="${cx}" y2="118" stroke="${p.c}" stroke-width="3"/>` +
        `<text x="${cx}" y="146" text-anchor="middle" font-size="19" font-weight="800" fill="${p.c}">${p.l1}</text>` +
        `<text x="${cx}" y="172" text-anchor="middle" font-size="17" fill="#555">${p.l2}</text>` +
        `<text x="${cx}" y="196" text-anchor="middle" font-size="17" fill="#555">${p.l3}</text>`;
    }
    s += '</g>';
    x += bw + gap;
  });
  return s + '</svg>';
}

/* ═══════════ 8.2 ═══════════ */
/** Vạch đích: 4 vận động viên, hai người cùng giờ; ba cột số chạy song song. */
export function finishLine({ w = 1110 } = {}) {
  const run = [['Minh', '9.8 s'], ['Lan', '10.1 s'], ['Hoa', '10.1 s'], ['Tuan', '10.4 s']];
  const rn = [1, 2, 3, 4], rk = [1, 2, 2, 4], dr = [1, 2, 2, 3];
  const rh = 70, top = 70, H = top + run.length * rh + 30;
  let s = head(w, H, 'fl8');
  const cols = [['row_number', rn, PG, 560], ['rank', rk, CAM, 760], ['dense_rank', dr, XANH, 930]];
  s += `<text x="20" y="40" font-size="22" font-weight="800" fill="#444">finish order</text>`;
  cols.forEach(([t, , c, cx]) => { s += `<text data-k="fl-h-${t}" x="${cx}" y="40" text-anchor="middle" font-size="22" font-weight="800" fill="${c}" font-family="${MONO}">${t}</text>`; });
  s += `<rect x="455" y="${top - 8}" width="10" height="${run.length * rh}" fill="url(#chk)"/>`;
  run.forEach(([n, t], i) => {
    const y = top + i * rh, tie = i === 1 || i === 2;
    s += `<g data-k="fl-r${i}"><rect x="20" y="${y}" width="420" height="${rh - 12}" rx="10" fill="${tie ? '#f4eff9' : '#f7f7f7'}" stroke="${tie ? TIM : '#ccc'}" stroke-width="${tie ? 3 : 1.5}" ${tie ? 'stroke-dasharray="8 5"' : ''}/>` +
      `<text x="40" y="${y + 40}" font-size="30">🏃</text><text x="92" y="${y + 39}" font-size="25" font-weight="700" fill="#333">${n}</text>` +
      `<text x="420" y="${y + 39}" text-anchor="end" font-size="25" font-weight="800" fill="${tie ? TIM : '#333'}" font-family="${MONO}">${t}</text></g>`;
    cols.forEach(([t, arr, c, cx]) => {
      s += `<circle data-k="fl-${t}-${i}" cx="${cx}" cy="${y + 29}" r="25" fill="${c}${tie ? '' : '22'}" stroke="${c}" stroke-width="3"/>` +
        `<text x="${cx}" y="${y + 38}" text-anchor="middle" font-size="26" font-weight="800" fill="${tie ? '#fff' : c}">${arr[i]}</text>`;
    });
  });
  s += `<text data-k="fl-skip" x="760" y="${top + 3 * rh + 76}" text-anchor="middle" font-size="18" font-weight="700" fill="${CAM}">skips 3</text>`;
  s += `<text data-k="fl-noskip" x="930" y="${top + 3 * rh + 76}" text-anchor="middle" font-size="18" font-weight="700" fill="${XANH}">no gap</text>`;
  s += `<text data-k="fl-tie" x="230" y="${top + 4 * rh + 18}" text-anchor="middle" font-size="18" font-weight="700" fill="${TIM}">a tie: same time</text>`;
  return s.replace('<defs>', `<defs><pattern id="chk" width="10" height="20" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#222"/><rect y="10" width="10" height="10" fill="#fff"/></pattern>`) + '</svg>';
}

/** Ba hàm xếp hạng chạy song song trên vùng North (có hoà 150). */
export function rankCols({ w = 1110 } = {}) {
  const fs = 21, rh = 46, top = 46;
  const rows = [['Bob', '200.00', 1, 1, 1], ['Alice', '150.00', 2, 2, 2], ['Bob', '150.00', 3, 2, 2], ['Alice', '100.00', 4, 4, 3]];
  const T = strip({ x: 150, y: top, cols: [{ h: 'seller' }, { h: 'amount' }, { h: 'rn', nw: true }, { h: 'rnk', nw: true }, { h: 'drnk', nw: true }], rows, fs, rh, peers: [1, 2], minW: [0, 0, 90, 90, 90], cell: [[3, 3, '#ffd9a8'], [3, 4, '#c9ecd4'], [2, 2, '#d7e6f5']], k: 'rk' });
  const H = top + T.h + 20;
  let s = head(w, H, 'rc8');
  s += `<text x="150" y="30" font-size="21" font-weight="800" fill="${PG}">North, ORDER BY amount DESC</text>` + T.s;
  const rx = 150 + T.w + 28;
  s += `<text data-k="rk-n1" x="${rx}" y="${T.y(1) + 38}" font-size="20" font-weight="800" fill="${TIM}">← tie: both 150</text>`;
  s += `<text data-k="rk-n2" x="${rx}" y="${T.y(2) + 30}" font-size="18" fill="#555">row_number still says 2, 3</text>`;
  s += `<text data-k="rk-n3" x="${rx}" y="${T.y(3) + 20}" font-size="19" font-weight="800" fill="${CAM}">rank jumps to 4</text>`;
  s += `<text data-k="rk-n4" x="${rx}" y="${T.y(3) + 44}" font-size="19" font-weight="800" fill="${XANH}">dense_rank goes on to 3</text>`;
  return s + '</svg>';
}

/** Top-N mỗi nhóm: bước 1 xếp hạng mọi dòng, bước 2 WHERE rn ≤ 2 ở truy vấn ngoài. */
export function topNCut({ w = 1110, n = 2 } = {}) {
  const fs = 19, rh = 40, top = 56;
  const rows = [['North', 'Bob', '200.00', 1], ['North', 'Alice', '150.00', 2], ['North', 'Bob', '150.00', 3], ['North', 'Alice', '100.00', 4],
    ['South', 'Carol', '300.00', 1], ['South', 'Carol', '250.00', 2], ['South', 'Dave', '220.00', 3], ['South', 'Dave', '180.00', 4]];
  const A = strip({ x: 0, y: top, cols: [{ h: 'region' }, { h: 'seller' }, { h: 'amount' }, { h: 'rn', nw: true }], rows, part: PART_REG, fs, rh, k: 'tA' });
  const keep = rows.map((r, i) => (r[3] <= n ? i : -1)).filter((i) => i >= 0);
  const bx = A.w + 230;
  const B = strip({ x: bx, y: top, cols: [{ h: 'region' }, { h: 'seller' }, { h: 'amount' }], rows: keep.map((i) => rows[i].slice(0, 3)), part: keep.map((i) => PART_REG[i]), fs, rh, k: 'tB' });
  const H = top + A.h + 40;
  let s = head(w, H, 'tn8');
  s += `<text data-k="tA-t" x="0" y="26" font-size="20" font-weight="800" fill="${PG}">① inside the CTE: rank every row</text>`;
  s += `<text data-k="tB-t" x="${bx}" y="26" font-size="20" font-weight="800" fill="${XANH}">② outer query: WHERE rn &lt;= ${n}</text>`;
  s += A.s + B.s;
  rows.forEach((r, i) => {
    const ok = r[3] <= n, y = A.y(i) + rh / 2 + 8;
    s += `<text data-k="tA-m${i}" x="${A.w + 12}" y="${y}" font-size="23" font-weight="800" fill="${ok ? XANH : DO}">${ok ? '✓' : '✗'}</text>`;
  });
  s += `<path d="M${A.w + 46},${top + A.h / 2} L${bx - 14},${top + A.h / 2}" stroke="${NAU}" stroke-width="4" marker-end="url(#tn8)"/>`;
  s += `<text data-k="tB-n" x="${bx}" y="${top + B.h + 34}" font-size="19" fill="#555">${keep.length} rows: the top ${n} of each region</text>`;
  return s + '</svg>';
}

/* ═══════════ 8.3 ═══════════ */
/** Sổ tiết kiệm: cột số dư = tổng luỹ tiến, cột "so với lần trước" = LAG. */
export function passbook({ w = 1110 } = {}) {
  const rows = [['01 Mar', '+500', '500', '—'], ['05 Mar', '+200', '700', '+200 vs 500'], ['09 Mar', '−300', '400', '−300 vs 200'], ['15 Mar', '+600', '1000', '+600 vs −300']];
  const fs = 22, rh = 50, top = 60;
  let s = head(w, top + rh * 5 + 30, 'pb8');
  s += `<rect x="60" y="10" width="${w - 120}" height="${rh * 5 + top}" rx="16" fill="#fffaf0" stroke="#d9c39a" stroke-width="3"/>`;
  s += `<text x="90" y="46" font-size="24" font-weight="800" fill="${NAU}">📒 savings book</text>`;
  const cx = [110, 300, 520, 760], hd = ['date', 'in / out', 'balance', 'change vs last time'];
  hd.forEach((h, j) => { s += `<text data-k="pb-h${j}" x="${cx[j]}" y="${top + 34}" font-size="20" font-weight="800" fill="${j === 2 ? XANH : j === 3 ? TIM : '#666'}">${h}</text>`; });
  rows.forEach((r, i) => {
    const y = top + rh * (i + 1);
    s += `<line x1="90" y1="${y + 8}" x2="${w - 90}" y2="${y + 8}" stroke="#e6d7b8" stroke-width="1.5"/>`;
    r.forEach((v, j) => { s += `<text data-k="pb-${i}-${j}" x="${cx[j]}" y="${y + 40}" font-size="${fs}" font-weight="${j === 2 ? 800 : 500}" fill="${j === 2 ? XANH : j === 3 ? TIM : '#333'}" font-family="${MONO}">${v}</text>`; });
  });
  return s + '</svg>';
}

/** Tổng luỹ tiến tích dần: thanh cộng dồn từng dòng (một người bán) + PARTITION khởi động lại. */
export function runningPic({ w = 1110 } = {}) {
  const fs = 23, rh = 56, top = 50;
  const rows = [['Alice', '2026-01-05', '100.00', '100.00'], ['Alice', '2026-02-10', '150.00', '250.00'], ['Bob', '2026-01-20', '200.00', '200.00'], ['Bob', '2026-03-01', '150.00', '350.00']];
  const T = strip({ x: 0, y: top, cols: [{ h: 'seller' }, { h: 'sold_on' }, { h: 'amount' }, { h: 'running_total', nw: true }], rows, part: [2, 2, 3, 3], fs, rh, k: 'ru' });
  let s = head(w, top + T.h + 30, 'ru8');
  s += `<text x="0" y="30" font-size="20" font-weight="800" fill="${PG}">PARTITION BY seller ORDER BY sold_on</text>` + T.s;
  const bx = T.w + 40, sc = 0.98; // thanh: 1 đơn vị = 0.98px
  [[0, 0, 100, XANH, '100'], [1, 0, 100, '#9fd0b2', ''], [1, 100, 150, XANH, '+150 = 250'], [2, 0, 200, TIM, '200  ← restart'], [3, 0, 200, '#cdb8e2', ''], [3, 200, 150, TIM, '+150 = 350']].forEach(([r, a, len, c, t], i) => {
    const y = T.y(r) + 8;
    s += `<rect data-k="ru-b${i}" x="${bx + a * sc}" y="${y}" width="${len * sc}" height="${rh - 16}" rx="5" fill="${c}"/>`;
    if (t) s += `<text x="${bx + (a + len) * sc + 10}" y="${y + 27}" font-size="21" font-weight="800" fill="${c}">${t}</text>`;
  });
  s += `<text data-k="ru-cap" x="${bx}" y="${top + 26}" font-size="18" fill="#666">each row = everything so far</text>`;
  return s + '</svg>';
}

/** LAG/LEAD: dòng hiện tại nhìn lên một dòng và xuống một dòng; NULL ở hai mép. */
export function lagLead({ w = 1110, cur = 3 } = {}) {
  const fs = 19, rh = 40, top = 44;
  const amt = ['100.00', '300.00', '200.00', '180.00', '150.00', '250.00', '150.00', '220.00'];
  const day = ['2026-01-05', '2026-01-15', '2026-01-20', '2026-02-05', '2026-02-10', '2026-02-20', '2026-03-01', '2026-03-10'];
  const rows = amt.map((a, i) => [day[i], a, i === 0 ? null : amt[i - 1], i === 7 ? null : amt[i + 1]]);
  const T = strip({ x: 230, y: top, cols: [{ h: 'sold_on' }, { h: 'amount' }, { h: 'lag', nw: true }, { h: 'lead', nw: true }], rows, fs, rh, hl: [cur], cur, cell: [[0, 2, '#fde2e0'], [7, 3, '#fde2e0'], [cur - 1, 1, '#e2d3f3'], [cur, 2, '#e2d3f3'], [cur + 1, 1, '#cdeed8'], [cur, 3, '#cdeed8']], k: 'll' });
  let s = head(w, top + T.h + 20, 'll8');
  s += `<text x="230" y="28" font-size="20" font-weight="800" fill="${PG}">OVER (ORDER BY sold_on)</text>` + T.s;
  const xa = T.colX(1) + T.colW(1) / 2, xl = T.colX(2) + 14, xd = T.colX(3) + 14;
  const yU = T.y(cur - 1) + rh / 2, yC = T.y(cur) + rh / 2, yD = T.y(cur + 1) + rh / 2;
  void xa; void xl; void xd; void yU; void yD; void yC;
  const rx = 230 + T.w + 24;
  s += `<text data-k="ll-t1" x="${rx}" y="${T.y(cur) - 6}" font-size="20" font-weight="800" fill="${TIM}">↑ lag = the amount one row UP</text>`;
  s += `<text data-k="ll-t2" x="${rx}" y="${T.y(cur) + 62}" font-size="20" font-weight="800" fill="${XANH}">↓ lead = the amount one row DOWN</text>`;
  s += `<text data-k="ll-e1" x="${rx}" y="${T.y(0) + 27}" font-size="18" font-weight="700" fill="${DO}">first row: nothing above → NULL</text>`;
  s += `<text data-k="ll-e2" x="${rx}" y="${T.y(7) + 27}" font-size="18" font-weight="700" fill="${DO}">last row: nothing below → NULL</text>`;
  s += `<text x="0" y="${T.y(cur) + 27}" font-size="18" font-weight="800" fill="${DO}">current row</text>`;
  return s + '</svg>';
}

/* ═══════════ 8.4 ═══════════ */
/** Thước khung: các mốc UNBOUNDED PRECEDING … UNBOUNDED FOLLOWING quanh dòng hiện tại. */
export function frameRuler({ w = 1110 } = {}) {
  const rh = 46, top = 20, n = 7, cur = 3, x = 120, bw = 300;
  let s = head(w, top + rh * n + 30, 'fr8');
  const lab = ['UNBOUNDED PRECEDING', '2 PRECEDING', '1 PRECEDING', 'CURRENT ROW', '1 FOLLOWING', '2 FOLLOWING', 'UNBOUNDED FOLLOWING'];
  const col = [TIM, PG, PG, DO, XANH, XANH, TIM];
  for (let i = 0; i < n; i++) {
    const y = top + i * rh, on = i === cur;
    s += `<rect data-k="fr-r${i}" x="${x}" y="${y}" width="${bw}" height="${rh - 8}" rx="7" fill="${on ? '#fff3c4' : '#f4f6f9'}" stroke="${on ? DO : '#c9d5e2'}" stroke-width="${on ? 3.5 : 1.5}"/>` +
      `<text x="${x + 16}" y="${y + 26}" font-size="19" fill="#555" font-family="${MONO}">${i === 0 ? 'first row of partition' : i === n - 1 ? 'last row of partition' : `row ${i + 1}`}</text>`;
    s += `<line x1="${x + bw + 8}" y1="${y + (rh - 8) / 2}" x2="${x + bw + 50}" y2="${y + (rh - 8) / 2}" stroke="${col[i]}" stroke-width="3"/>` +
      `<text data-k="fr-l${i}" x="${x + bw + 60}" y="${y + 26}" font-size="21" font-weight="800" fill="${col[i]}" font-family="${MONO}">${lab[i]}</text>`;
  }
  s += `<path d="M${x - 30},${top + cur * rh + 6} L${x - 8},${top + cur * rh + 19} L${x - 30},${top + cur * rh + 32} z" fill="${DO}"/>`;
  // ví dụ khung 2 PRECEDING .. CURRENT ROW
  s += `<rect data-k="fr-ex" x="${x - 6}" y="${top + 1 * rh - 4}" width="${bw + 12}" height="${rh * 3 - 0}" rx="8" fill="rgba(255,206,64,.18)" stroke="${CAM}" stroke-width="4"/>`;
  s += `<text data-k="fr-ext" x="${x + bw + 420}" y="${top + 2 * rh - 4}" font-size="20" font-weight="800" fill="${CAM}" font-family="${MONO}">← ROWS BETWEEN</text>`;
  s += `<text x="${x + bw + 452}" y="${top + 2 * rh + 24}" font-size="20" font-weight="800" fill="${CAM}" font-family="${MONO}">2 PRECEDING</text>`;
  s += `<text x="${x + bw + 452}" y="${top + 2 * rh + 52}" font-size="20" font-weight="800" fill="${CAM}" font-family="${MONO}">AND CURRENT ROW</text>`;
  return s + '</svg>';
}

/** Khung trượt 3 ngày: ba ô chụp liên tiếp, khung (vùng sáng) đi theo con trỏ. */
export function slidingFrames({ w = 1110, curs = [2, 3, 4] } = {}) {
  const day = ['03-01', '03-02', '03-03', '03-04', '03-05', '03-06', '03-07'], rev = [120, 80, 100, 160, 40, 140, 200];
  const avg = ['120.0', '100.0', '100.0', '113.3', '100.0', '113.3', '126.7'];
  const fs = 18, rh = 36, top = 50;
  let s = '', x = 70, hmax = 0;
  curs.forEach((c, k) => {
    const T = strip({ x, y: top, cols: [{ h: 'day' }, { h: 'revenue' }], rows: day.map((d, i) => [d, rev[i]]), fs, rh, cur: c, frame: [Math.max(0, c - 2), c], k: `sf${k}` });
    const sum = rev.slice(Math.max(0, c - 2), c + 1);
    s += `<text data-k="sf${k}-t" x="${x}" y="30" font-size="19" font-weight="800" fill="${PG}">current = ${day[c]}</text>` + T.s;
    s += `<text data-k="sf${k}-v" x="${x}" y="${top + T.h + 34}" font-size="19" fill="#333" font-family="${MONO}">(${sum.join('+')})/3</text>`;
    s += `<text x="${x}" y="${top + T.h + 62}" font-size="21" font-weight="800" fill="${CAM}" font-family="${MONO}">= ${avg[c]}</text>`;
    hmax = Math.max(hmax, top + T.h + 76);
    x += T.w + 210;
  });
  return head(w, hmax, 'sl8') + s + '</svg>';
}

/** ROWS vs RANGE ở dòng hoà: cùng dòng hiện tại (Alice 150), hai khung khác nhau. */
export function rowsVsRange({ w = 1110 } = {}) {
  const fs = 19, rh = 40, top = 56;
  const base = [['Alice', '100.00'], ['Alice', '150.00'], ['Bob', '150.00'], ['Dave', '180.00'], ['Bob', '200.00']];
  const A = strip({ x: 40, y: top, cols: [{ h: 'seller' }, { h: 'amount' }, { h: 'rows_sum', nw: true }], rows: base.map((r, i) => [...r, ['100.00', '250.00', '400.00', '580.00', '780.00'][i]]), fs, rh, cur: 1, frame: [0, 1], cell: [[1, 2]], k: 'rw' });
  const bx = 40 + A.w + 130;
  const B = strip({ x: bx, y: top, cols: [{ h: 'seller' }, { h: 'amount' }, { h: 'range_sum', nw: true }], rows: base.map((r, i) => [...r, ['100.00', '400.00', '400.00', '580.00', '780.00'][i]]), fs, rh, cur: 1, frame: [0, 2], peers: [1, 2], cell: [[1, 2]], k: 'rg' });
  let s = head(w, top + A.h + 70, 'rr8');
  s += `<text data-k="rw-t" x="40" y="28" font-size="21" font-weight="800" fill="${PG}">ROWS … CURRENT ROW</text><text x="40" y="50" font-size="17" fill="#666">stops at this physical row</text>`;
  s += `<text data-k="rg-t" x="${bx}" y="28" font-size="21" font-weight="800" fill="${TIM}">RANGE … CURRENT ROW (default)</text><text x="${bx}" y="50" font-size="17" fill="#666">takes every row with the same amount</text>`;
  s += A.s + B.s;
  s += `<text data-k="rw-v" x="40" y="${top + A.h + 34}" font-size="21" font-weight="800" fill="${PG}" font-family="${MONO}">100 + 150 = 250</text>`;
  s += `<text data-k="rg-v" x="${bx}" y="${top + B.h + 34}" font-size="21" font-weight="800" fill="${TIM}" font-family="${MONO}">100 + 150 + 150 = 400</text>`;
  s += `<text data-k="rg-peer" x="${bx + B.w + 18}" y="${B.y(1) + 46}" font-size="18" font-weight="700" fill="${TIM}">peers</text>`;
  return s + '</svg>';
}

/** NTILE: 8 dòng chia 3 nhóm ⇒ 3 · 3 · 2 (nhóm đầu nhận phần dư). */
export function ntileBuckets({ w = 1110, n = 3 } = {}) {
  const amt = [300, 250, 220, 200, 180, 150, 150, 100];
  const size = []; const base = Math.floor(amt.length / n), rem = amt.length % n;
  for (let i = 0; i < n; i++) size.push(base + (i < rem ? 1 : 0));
  const bw = 300, gap = (w - n * bw) / (n + 1), top = 40;
  let s = head(w, 320, 'nt8');
  let k = 0;
  size.forEach((sz, b) => {
    const x = gap + b * (bw + gap), c = [PG, CAM, XANH, TIM][b % 4];
    s += `<path data-k="nt-b${b}" d="M${x},${top + 40} L${x + 20},${top + 230} L${x + bw - 20},${top + 230} L${x + bw},${top + 40}" fill="${c}14" stroke="${c}" stroke-width="4"/>`;
    s += `<text data-k="nt-t${b}" x="${x + bw / 2}" y="${top + 20}" text-anchor="middle" font-size="22" font-weight="800" fill="${c}">bucket ${b + 1} · ${sz} rows</text>`;
    for (let j = 0; j < sz; j++, k++) {
      const cy = top + 76 + j * 52;
      s += `<rect x="${x + 60}" y="${cy - 22}" width="${bw - 120}" height="40" rx="20" fill="#fff" stroke="${c}" stroke-width="2.5"/><text x="${x + bw / 2}" y="${cy + 6}" text-anchor="middle" font-size="21" font-weight="700" fill="#333" font-family="${MONO}">${amt[k]}.00</text>`;
    }
  });
  s += `<text data-k="nt-cap" x="${w / 2}" y="${top + 268}" text-anchor="middle" font-size="19" fill="#555">8 rows ÷ ${n} buckets = ${base} each, remainder ${rem} → the first ${rem} buckets get one extra row</text>`;
  return s + '</svg>';
}

/** Kính lúp trượt trên dải nhiệt độ (ví dụ đời thường: trung bình trượt). */
export function magnifier({ w = 1110 } = {}) {
  const t = [31, 27, 29, 34, 24, 30, 36], d = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const cw = 130, x0 = (w - cw * 7) / 2, top = 60;
  let s = head(w, 300, 'mg8');
  t.forEach((v, i) => {
    const x = x0 + i * cw;
    s += `<rect data-k="mg-d${i}" x="${x + 6}" y="${top}" width="${cw - 12}" height="110" rx="12" fill="${v >= 33 ? '#fde2e0' : v <= 26 ? '#e3edf7' : '#fff7ef'}" stroke="#d6c3a5" stroke-width="2"/>` +
      `<text x="${x + cw / 2}" y="${top + 38}" text-anchor="middle" font-size="22" fill="#555">${d[i]}</text>` +
      `<text x="${x + cw / 2}" y="${top + 86}" text-anchor="middle" font-size="34" font-weight="800" fill="#333">${v}°</text>`;
  });
  const fx = x0 + 2 * cw - 2;
  s += `<rect data-k="mg-frame" x="${fx}" y="${top - 12}" width="${cw * 3 + 4}" height="134" rx="16" fill="rgba(255,206,64,.16)" stroke="${CAM}" stroke-width="5"/>`;
  s += `<text x="${fx + cw * 3 + 20}" y="${top - 18}" font-size="40">🔍</text>`;
  s += `<text data-k="mg-v" x="${fx + (cw * 3) / 2}" y="${top + 172}" text-anchor="middle" font-size="22" font-weight="800" fill="${CAM}" font-family="${MONO}">(29 + 34 + 24) / 3 = 29°</text>`;
  s += `<text x="${fx + (cw * 3) / 2}" y="${top + 204}" text-anchor="middle" font-size="18" fill="#666">the magnifier slides one day to the right for the next row</text>`;
  return s + '</svg>';
}
