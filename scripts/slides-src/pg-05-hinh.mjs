/**
 * pg-05-hinh.mjs — hình SVG dùng chung cho Chương 5 (deck pg-05-1…4). Không phải deck.
 * Chữ SVG: rộng ≈ 0,602 × cỡ chữ / ký tự (mono) — đặt nhãn bằng công thức. Mọi phần tử video cần chú thích có data-k.
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', XAM = '#9a9a9a';
export { PG, CAM, NAU, XANH, DO, XAM };

const cell = (v) => (v === null || v === undefined ? 'NULL' : String(v));

/**
 * Hai bảng + dây nối các cặp khớp (hình "JOIN ghép dòng" tĩnh).
 *  L/R: { name, cols: [..], wc: [độ rộng cột..], rows: [[..]] }
 *  pairs: [[chỉ số dòng trái, chỉ số dòng phải]]
 *  keepL/keepR: dòng KHÔNG có cặp nhưng được giữ (NULL-pad bên đối diện) — viền cam đứt, ô NULL
 *  dropL/dropR: dòng không có cặp và BỊ BỎ — mờ + gạch đỏ ✗
 */
export function joinPic({ L, R, pairs = [], keepL = [], keepR = [], dropL = [], dropR = [], w = 1110, rowH = 44, gap = 330, fs = 20, titleL, titleR, hlPairs = [], kLabel = 'jp' }) {
  const wl = L.wc.reduce((a, b) => a + b, 0), wr = R.wc.reduce((a, b) => a + b, 0);
  const xl = 8, xr = w - wr - 8;
  const top = 44, hh = rowH - 4;
  const nrows = Math.max(L.rows.length, R.rows.length);
  const H = top + hh + nrows * rowH + 16;
  const yRow = (i) => top + hh + i * rowH;
  let s = `<svg viewBox="0 0 ${w} ${H}" width="${w}" height="${H}" font-family="Arial">`;
  const tbl = (T, x, tag, keep, drop, color) => {
    let g = `<g data-k="${kLabel}-${tag}">` +
      `<text x="${x}" y="30" font-size="${fs + 3}" font-weight="800" fill="${color}" font-family="${MONO}">${esc(tag === 'L' ? (titleL || T.name) : (titleR || T.name))}</text>`;
    // header
    let cx = x;
    T.cols.forEach((c, j) => {
      g += `<rect x="${cx}" y="${top}" width="${T.wc[j]}" height="${hh}" fill="${color}"/><text x="${cx + 10}" y="${top + hh - 10}" font-size="${fs - 2}" font-weight="700" fill="#fff" font-family="${MONO}">${esc(c)}</text>`;
      cx += T.wc[j];
    });
    T.rows.forEach((r, i) => {
      const y = yRow(i);
      const isKeep = keep.includes(i), isDrop = drop.includes(i);
      let cxx = x;
      g += `<g data-k="${kLabel}-${tag}r${i}" opacity="${isDrop ? 0.4 : 1}">`;
      r.forEach((v, j) => {
        g += `<rect x="${cxx}" y="${y}" width="${T.wc[j]}" height="${rowH - 4}" fill="${isKeep ? '#fff7ef' : '#fff'}" stroke="${isKeep ? CAM : '#c9d5e2'}" stroke-width="${isKeep ? 2.5 : 1.5}" ${isKeep ? 'stroke-dasharray="6 4"' : ''}/>` +
          `<text x="${cxx + 10}" y="${y + rowH - 15}" font-size="${fs}" fill="${v === null ? '#999' : '#333'}" ${v === null ? 'font-style="italic"' : ''} font-family="${MONO}">${esc(cell(v))}</text>`;
        cxx += T.wc[j];
      });
      if (isDrop) g += `<line x1="${x}" y1="${y + (rowH - 4) / 2}" x2="${x + (T.wc.reduce((a, b) => a + b, 0))}" y2="${y + (rowH - 4) / 2}" stroke="${DO}" stroke-width="3"/>`;
      g += '</g>';
    });
    return g + '</g>';
  };
  s += tbl(L, xl, 'L', keepL, dropL, PG);
  s += tbl(R, xr, 'R', keepR, dropR, '#7a5a9a');
  // dây nối
  pairs.forEach(([a, b], k) => {
    const y1 = yRow(a) + (rowH - 4) / 2, y2 = yRow(b) + (rowH - 4) / 2;
    const hl = hlPairs.includes(k);
    s += `<path data-k="${kLabel}-ln${k}" d="M${xl + wl},${y1} C${xl + wl + gap / 2},${y1} ${xr - gap / 2},${y2} ${xr},${y2}" fill="none" stroke="${hl ? CAM : XANH}" stroke-width="${hl ? 5 : 3.5}" stroke-linecap="round"/>`;
    s += `<circle cx="${xl + wl}" cy="${y1}" r="5" fill="${XANH}"/><circle cx="${xr}" cy="${y2}" r="5" fill="${XANH}"/>`;
  });
  // nhãn cho dòng lẻ
  keepL.forEach((i) => {
    const y = yRow(i) + (rowH - 4) / 2;
    s += `<line x1="${xl + wl}" y1="${y}" x2="${xl + wl + 56}" y2="${y}" stroke="${CAM}" stroke-width="3.5" stroke-dasharray="7 5"/><rect x="${xl + wl + 56}" y="${y - 17}" width="86" height="34" rx="7" fill="#fff7ef" stroke="${CAM}" stroke-width="2.5" stroke-dasharray="6 4"/><text x="${xl + wl + 99}" y="${y + 7}" text-anchor="middle" font-size="19" font-weight="800" fill="${NAU}" font-family="${MONO}" data-k="${kLabel}-padL${i}">NULL</text>`;
  });
  keepR.forEach((i) => {
    const y = yRow(i) + (rowH - 4) / 2;
    s += `<line x1="${xr}" y1="${y}" x2="${xr - 56}" y2="${y}" stroke="${CAM}" stroke-width="3.5" stroke-dasharray="7 5"/><rect x="${xr - 142}" y="${y - 17}" width="86" height="34" rx="7" fill="#fff7ef" stroke="${CAM}" stroke-width="2.5" stroke-dasharray="6 4"/><text x="${xr - 99}" y="${y + 7}" text-anchor="middle" font-size="19" font-weight="800" fill="${NAU}" font-family="${MONO}" data-k="${kLabel}-padR${i}">NULL</text>`;
  });
  dropL.forEach((i) => { const y = yRow(i) + (rowH - 4) / 2; s += `<text x="${xl + wl + 18}" y="${y + 8}" font-size="24" font-weight="800" fill="${DO}" data-k="${kLabel}-xL${i}">✗ dropped</text>`; });
  dropR.forEach((i) => { const y = yRow(i) + (rowH - 4) / 2; s += `<text x="${xr - 18}" y="${y + 8}" text-anchor="end" font-size="24" font-weight="800" fill="${DO}" data-k="${kLabel}-xR${i}">dropped ✗</text>`; });
  return s + '</svg>';
}

/** Bốn kiểu JOIN dạng Venn nhỏ. rows: số dòng kết quả của 4 kiểu (để ghi dưới hình). */
export function fourShapes({ rows = [4, 5, 5, 6], w = 1110, h = 250 } = {}) {
  const kinds = [
    { t: 'INNER', l: 0, r: 0, both: 1, c: PG }, { t: 'LEFT', l: 1, r: 0, both: 1, c: XANH },
    { t: 'RIGHT', l: 0, r: 1, both: 1, c: '#7a5a9a' }, { t: 'FULL', l: 1, r: 1, both: 1, c: NAU },
  ];
  const cw = w / 4;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs>`;
  kinds.forEach((k, i) => {
    const cx = i * cw + cw / 2;
    s += `<clipPath id="cpA${i}"><circle cx="${cx - 38}" cy="100" r="62"/></clipPath><clipPath id="cpB${i}"><circle cx="${cx + 38}" cy="100" r="62"/></clipPath>`;
  });
  s += '</defs>';
  kinds.forEach((k, i) => {
    const cx = i * cw + cw / 2;
    const fa = k.l ? k.c : 'none', fb = k.r ? k.c : 'none';
    s += `<g data-k="shape-${k.t.toLowerCase()}">`;
    s += `<circle cx="${cx - 38}" cy="100" r="62" fill="${fa}" fill-opacity=".35" stroke="${PG}" stroke-width="3"/>`;
    s += `<circle cx="${cx + 38}" cy="100" r="62" fill="${fb}" fill-opacity=".35" stroke="#7a5a9a" stroke-width="3"/>`;
    // phần giao luôn tô
    s += `<g clip-path="url(#cpA${i})"><circle cx="${cx + 38}" cy="100" r="62" fill="${k.c}" fill-opacity=".75"/></g>`;
    s += `<text x="${cx - 70}" y="106" text-anchor="middle" font-size="19" font-weight="800" fill="#333">L</text><text x="${cx + 70}" y="106" text-anchor="middle" font-size="19" font-weight="800" fill="#333">R</text>`;
    s += `<text x="${cx}" y="203" text-anchor="middle" font-size="26" font-weight="800" fill="${k.c}">${k.t} JOIN</text>`;
    s += `<text x="${cx}" y="233" text-anchor="middle" font-size="21" fill="#555"><tspan font-weight="800" fill="#262626">${rows[i]}</tspan> rows in our data</text>`;
    s += '</g>';
  });
  return s + '</svg>';
}

/** "Hai danh sách" đời thường: danh sách trái / phải có dòng không khớp. items: { l: [..], r: [..], pairs, tl, tr } */
export function twoLists({ l, r, pairs, tl, tr, w = 1110, h = 270, colorL = PG, colorR = '#7a5a9a', miss = [] }) {
  const rh = 46, top = 56;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  s += `<text x="40" y="34" font-size="24" font-weight="800" fill="${colorL}">${esc(tl)}</text><text x="${w - 40}" y="34" text-anchor="end" font-size="24" font-weight="800" fill="${colorR}">${esc(tr)}</text>`;
  l.forEach((t, i) => { s += `<rect data-k="ls-l${i}" x="40" y="${top + i * (rh + 6)}" width="360" height="${rh}" rx="9" fill="#eef4fa" stroke="${colorL}" stroke-width="2.5"/><text x="58" y="${top + i * (rh + 6) + 31}" font-size="22" fill="#333">${esc(t)}</text>`; });
  r.forEach((t, i) => { s += `<rect data-k="ls-r${i}" x="${w - 400}" y="${top + i * (rh + 6)}" width="360" height="${rh}" rx="9" fill="#f4eff9" stroke="${colorR}" stroke-width="2.5"/><text x="${w - 382}" y="${top + i * (rh + 6) + 31}" font-size="22" fill="#333">${esc(t)}</text>`; });
  pairs.forEach(([a, b], k) => { s += `<path data-k="ls-p${k}" d="M400,${top + a * (rh + 6) + rh / 2} C560,${top + a * (rh + 6) + rh / 2} 550,${top + b * (rh + 6) + rh / 2} ${w - 400},${top + b * (rh + 6) + rh / 2}" fill="none" stroke="${XANH}" stroke-width="3.5"/>`; });
  miss.forEach(([side, i, txt]) => {
    const y = top + i * (rh + 6) + rh / 2 + 8;
    s += side === 'L' ? `<text x="430" y="${y}" font-size="21" font-weight="800" fill="${DO}" data-k="ls-miss">← ${esc(txt)}</text>` : `<text x="${w - 430}" y="${y}" text-anchor="end" font-size="21" font-weight="800" fill="${DO}" data-k="ls-miss">${esc(txt)} →</text>`;
  });
  return s + '</svg>';
}

/** Chuỗi bảng nối: hộp bảng nối bằng mũi tên có nhãn alias/điều kiện. tables: [{ t, a, x, y, cols? }], edges: [{ from, to, on, dy? }] */
export function chainPic({ boxes, edges, w = 1110, h = 300 }) {
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="ch5m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;
  const byId = {};
  boxes.forEach((b) => { byId[b.id] = b; b.bw = b.bw || b.w || 230; b.bh = b.bh || b.h || 108; });
  edges.forEach((e, k) => {
    const A = byId[e.from], B = byId[e.to];
    const ax = A.x + A.bw / 2, ay = A.y + A.bh / 2, bx = B.x + B.bw / 2, by = B.y + B.bh / 2;
    // điểm ra: cạnh gần nhất
    const pt = (P, tx, ty) => {
      const cx = P.x + P.bw / 2, cy = P.y + P.bh / 2, dx = tx - cx, dy = ty - cy;
      const sc = Math.min((P.bw / 2 + 4) / Math.abs(dx || 1e-9), (P.bh / 2 + 4) / Math.abs(dy || 1e-9));
      return [cx + dx * sc, cy + dy * sc];
    };
    const [x1, y1] = pt(A, bx, by), [x2, y2] = pt(B, ax, ay);
    s += `<line data-k="edge${k}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${NAU}" stroke-width="3.5" marker-end="url(#ch5m)"/>`;
    const mx = (x1 + x2) / 2 + (e.dx || 0), my = (y1 + y2) / 2 + (e.dy || 0);
    s += `<rect x="${mx - e.on.length * 5.6 - 8}" y="${my - 15}" width="${e.on.length * 11.2 + 16}" height="28" rx="6" fill="#fff" stroke="${NAU}" stroke-width="1.8"/><text data-k="on${k}" x="${mx}" y="${my + 6}" text-anchor="middle" font-size="18.5" font-family="${MONO}" fill="${NAU}" font-weight="700">${esc(e.on)}</text>`;
  });
  boxes.forEach((b) => {
    s += `<g data-k="box-${b.id}"><rect x="${b.x}" y="${b.y}" width="${b.bw}" height="${b.bh}" rx="10" fill="${b.fill || '#fff'}" stroke="${b.c || PG}" stroke-width="3.5"/><rect x="${b.x}" y="${b.y}" width="${b.bw}" height="38" rx="10" fill="${b.c || PG}"/><rect x="${b.x}" y="${b.y + 24}" width="${b.bw}" height="14" fill="${b.c || PG}"/>` +
      `<text x="${b.x + b.bw / 2}" y="${b.y + 27}" text-anchor="middle" font-size="21" font-weight="800" fill="#fff" font-family="${MONO}">${esc(b.t)}</text>`;
    (b.lines || []).forEach((ln, i) => { s += `<text x="${b.x + 12}" y="${b.y + 62 + i * 25}" font-size="19" font-family="${MONO}" fill="#333">${esc(ln)}</text>`; });
    if (b.alias) s += `<rect x="${b.x + b.bw - 62}" y="${b.y - 32}" width="62" height="30" rx="15" fill="${CAM}"/><text x="${b.x + b.bw - 31}" y="${b.y - 11}" text-anchor="middle" font-size="19" font-weight="800" fill="#fff" font-family="${MONO}" data-k="alias-${b.id}">${esc(b.alias)}</text>`;
    s += '</g>';
  });
  return s + '</svg>';
}

/** Sơ đồ cây quản lý (employee): nút với tên, cạnh manager_id. */
export function orgTree({ w = 520, h = 300, labels = {} } = {}) {
  const N = { Alice: [260, 40], Bob: [120, 160], Carol: [400, 160], Dave: [120, 270] };
  const E = [['Alice', 'Bob'], ['Alice', 'Carol'], ['Bob', 'Dave']];
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  E.forEach(([a, b], i) => { s += `<line data-k="org-e${i}" x1="${N[a][0]}" y1="${N[a][1] + 22}" x2="${N[b][0]}" y2="${N[b][1] - 22}" stroke="${NAU}" stroke-width="3.5"/>`; });
  Object.entries(N).forEach(([n, [x, y]]) => {
    s += `<g data-k="org-${n}"><circle cx="${x}" cy="${y}" r="32" fill="#eef4fa" stroke="${PG}" stroke-width="3.5"/><text x="${x}" y="${y + 7}" text-anchor="middle" font-size="19" font-weight="800" fill="#262626">${n}</text></g>`;
    if (labels[n]) s += `<text x="${x + 42}" y="${y + 6}" font-size="17" fill="${NAU}" font-weight="700">${esc(labels[n])}</text>`;
  });
  return s + '</svg>';
}

/** Lưới tích Descartes: hàng × cột. */
export function crossGrid({ rows, cols, w = 560, cw = 120, rh = 58 }) {
  const h = 60 + rows.length * rh;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  cols.forEach((c, j) => { s += `<rect data-k="cg-c${j}" x="${140 + j * cw}" y="6" width="${cw - 8}" height="42" rx="8" fill="#7a5a9a"/><text x="${140 + j * cw + (cw - 8) / 2}" y="34" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">${esc(c)}</text>`; });
  rows.forEach((r, i) => {
    s += `<rect data-k="cg-r${i}" x="8" y="${56 + i * rh}" width="120" height="${rh - 8}" rx="8" fill="${PG}"/><text x="68" y="${56 + i * rh + 33}" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">${esc(r)}</text>`;
    cols.forEach((c, j) => { s += `<rect data-k="cg-${i}-${j}" x="${140 + j * cw}" y="${56 + i * rh}" width="${cw - 8}" height="${rh - 8}" rx="8" fill="#fff7ef" stroke="${CAM}" stroke-width="2.5"/><text x="${140 + j * cw + (cw - 8) / 2}" y="${56 + i * rh + 33}" text-anchor="middle" font-size="21" font-family="${MONO}" fill="${NAU}" font-weight="700">${esc(r)}·${esc(c)}</text>`; });
  });
  return s + '</svg>';
}

/** Fan-out: một dòng "một" lặp theo số dòng "nhiều". */
export function fanPic({ w = 1110, h = 300 } = {}) {
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="fo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;
  s += `<text x="20" y="28" font-size="22" font-weight="800" fill="${PG}">note (the “one”)</text>`;
  s += `<g data-k="fan-note"><rect x="20" y="42" width="400" height="56" rx="8" fill="#eef4fa" stroke="${PG}" stroke-width="3"/><text x="34" y="78" font-size="21" font-family="${MONO}" fill="#333">1 · Intro to SQL · reads 500</text></g>`;
  s += `<text x="560" y="28" font-size="21" font-weight="800" fill="#7a5a9a">comment (the “many”)</text>`;
  [['1 · Great intro!', 0], ['2 · Thanks', 1]].forEach(([t, i]) => {
    const y = 42 + i * 70;
    s += `<g data-k="fan-c${i}"><rect x="560" y="${y}" width="250" height="56" rx="8" fill="#f4eff9" stroke="#7a5a9a" stroke-width="3"/><text x="574" y="${y + 36}" font-size="21" font-family="${MONO}" fill="#333">${t}</text></g>`;
    s += `<path d="M420,70 C490,70 490,${y + 28} 560,${y + 28}" fill="none" stroke="${XANH}" stroke-width="3.5" marker-end="url(#fo)"/>`;
  });
  s += `<text x="850" y="28" font-size="22" font-weight="800" fill="${NAU}">joined result</text>`;
  [0, 1].forEach((i) => {
    const y = 42 + i * 70;
    s += `<g data-k="fan-res${i}"><rect x="850" y="${y}" width="250" height="56" rx="8" fill="#fff7ef" stroke="${CAM}" stroke-width="3"/><text x="862" y="${y + 24}" font-size="17" font-family="${MONO}" fill="#333">Intro to SQL · 500</text><text x="862" y="${y + 45}" font-size="17" font-family="${MONO}" fill="${DO}" font-weight="700">${i ? 'Thanks' : 'Great intro!'}</text></g>`;
  });
  s += `<text x="20" y="196" font-size="23" fill="#666">The note row is <tspan fill="${NAU}" font-weight="800">copied once per comment</tspan> — the join was right, the total is wrong.</text>`;
  s += `<text x="20" y="246" font-size="30" font-weight="800" fill="${DO}" data-k="fan-sum">SUM(reads) for this note = 500 + 500 = 1000 ✗  (true value: 500)</text>`;
  return s + '</svg>';
}
