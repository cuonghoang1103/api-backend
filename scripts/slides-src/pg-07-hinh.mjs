/**
 * pg-07-hinh.mjs — hình SVG dùng chung cho Chương 7 (deck pg-07-1…4). Không phải deck. (agent c7, 25/10/2026)
 * Chữ SVG: rộng ≈ 0,602 × cỡ chữ / ký tự (mono) — đặt nhãn bằng công thức. Mọi phần tử video cần chú thích có data-k.
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7a5a9a', XAM = '#9a9a9a';
const head = (w, h, id) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;

/** Biểu đồ thanh ngang views + đường trung bình đứt nét. rows: [[title, views]], avg, hi: chỉ số thanh tô cam. */
export function barsAvg({ rows, avg, hi = [], w = 1110, fs = 21, max = 130, label = 'average' }) {
  const rh = 40, top = 30, lw = 250, bw = w - lw - 120;
  const h = top + rows.length * rh + 44;
  let s = head(w, h, 'ba7');
  rows.forEach(([t, v], i) => {
    const y = top + i * rh, len = (v / max) * bw, on = hi.includes(i);
    s += `<text x="${lw - 12}" y="${y + 26}" text-anchor="end" font-size="${fs}" fill="#333" font-family="${MONO}">${esc(t)}</text>`;
    s += `<rect data-k="bar${i}" x="${lw}" y="${y + 4}" width="${len}" height="${rh - 10}" rx="5" fill="${on ? CAM : '#c9d5e2'}" stroke="${on ? NAU : XAM}" stroke-width="2"/>`;
    s += `<text x="${lw + len + 10}" y="${y + 26}" font-size="${fs}" font-weight="800" fill="${on ? NAU : '#555'}" font-family="${MONO}">${v}</text>`;
  });
  const ax = lw + (avg / max) * bw;
  s += `<line data-k="avg-line" x1="${ax}" y1="${top - 8}" x2="${ax}" y2="${top + rows.length * rh}" stroke="${DO}" stroke-width="4" stroke-dasharray="9 6"/>`;
  s += `<text data-k="avg-label" x="${ax + 10}" y="${top + rows.length * rh + 30}" font-size="${fs}" font-weight="800" fill="${DO}">${label} = ${avg}</text>`;
  return s + '</svg>';
}

/** IN: truy vấn con ra một TẬP → lọc dòng ngoài. rows: [[title, user_id]], set: [..], sql: dòng truy vấn con. */
export function setFilter({ sqlText, set, rows, w = 1110, setName = 'ids' }) {
  const rh = 42, top = 56, h = top + rows.length * rh + 14;
  let s = head(w, h, 'sf7');
  s += `<text x="12" y="30" font-size="22" font-weight="800" fill="${TIM}">inner query runs first</text>`;
  s += `<g data-k="inner"><rect x="12" y="${top}" width="470" height="62" rx="9" fill="#f4eff9" stroke="${TIM}" stroke-width="3"/><text x="26" y="${top + 38}" font-size="17" font-family="${MONO}" fill="#333">${esc(sqlText)}</text></g>`;
  s += `<line x1="247" y1="${top + 64}" x2="247" y2="${top + 112}" stroke="${NAU}" stroke-width="3.5" marker-end="url(#sf7)"/>`;
  s += `<g data-k="set"><rect x="12" y="${top + 116}" width="470" height="62" rx="31" fill="#fff7ef" stroke="${CAM}" stroke-width="3.5"/><text x="247" y="${top + 155}" text-anchor="middle" font-size="26" font-weight="800" fill="${NAU}" font-family="${MONO}">{ ${set.join(', ')} }</text></g>`;
  s += `<text x="12" y="${top + 214}" font-size="19" fill="#666">a plain list of values — nothing more</text>`;
  s += `<text x="560" y="30" font-size="22" font-weight="800" fill="${PG}">outer query keeps rows whose user_id is in the set</text>`;
  rows.forEach(([t, u], i) => {
    const y = top + i * rh, ok = u !== null && set.includes(u);
    s += `<g data-k="row${i}" opacity="${ok ? 1 : 0.5}"><rect x="560" y="${y}" width="470" height="${rh - 6}" rx="8" fill="${ok ? '#f1f9f4' : '#fff'}" stroke="${ok ? XANH : '#c9d5e2'}" stroke-width="${ok ? 3 : 1.5}"/>` +
      `<text x="574" y="${y + 26}" font-size="20" font-family="${MONO}" fill="#333">${esc(t)}</text><text x="${560 + 470 - 14}" y="${y + 26}" text-anchor="end" font-size="20" font-family="${MONO}" fill="${u === null ? '#999' : '#333'}">${u === null ? 'NULL' : u}</text>` +
      `<text x="1048" y="${y + 28}" font-size="26" font-weight="800" fill="${ok ? XANH : DO}">${ok ? '✓' : '✗'}</text></g>`;
  });
  return s + '</svg>';
}

/** Vòng lặp tương quan (tĩnh): hàng ngoài đang xét + truy vấn con thay giá trị. */
export function loopPic({ rows, cur, inner, result, w = 1110 }) {
  const rh = 46, top = 52, h = top + rows.length * rh + 24;
  let s = head(w, h, 'lp7');
  s += `<text x="12" y="30" font-size="22" font-weight="800" fill="${PG}">outer rows — one at a time</text>`;
  rows.forEach(([id, t], i) => {
    const y = top + i * rh, on = i === cur;
    s += `<g data-k="orow${i}"><rect x="12" y="${y}" width="400" height="${rh - 6}" rx="8" fill="${on ? '#fff3c4' : '#fff'}" stroke="${on ? CAM : '#c9d5e2'}" stroke-width="${on ? 4 : 1.5}"/>` +
      `<text x="28" y="${y + 28}" font-size="21" font-family="${MONO}" fill="#333">${id} · ${esc(t)}</text></g>`;
  });
  const cy = top + cur * rh + (rh - 6) / 2;
  s += `<path data-k="arrow" d="M412,${cy} C 520,${cy} 520,${top + 60} 600,${top + 60}" fill="none" stroke="${NAU}" stroke-width="4" marker-end="url(#lp7)"/>`;
  s += `<text x="600" y="30" font-size="22" font-weight="800" fill="${TIM}">inner query — run again for this row</text>`;
  s += `<g data-k="inner"><rect x="600" y="${top + 20}" width="490" height="${inner.length * 30 + 20}" rx="9" fill="#f4eff9" stroke="${TIM}" stroke-width="3"/>` +
    inner.map((l, i) => `<text x="614" y="${top + 50 + i * 30}" font-size="19" font-family="${MONO}" fill="#333">${l}</text>`).join('') + '</g>';
  const ry = top + 20 + inner.length * 30 + 50;
  s += `<line x1="845" y1="${top + 20 + inner.length * 30 + 22}" x2="845" y2="${ry - 4}" stroke="${NAU}" stroke-width="3.5" marker-end="url(#lp7)"/>`;
  s += `<g data-k="result"><rect x="700" y="${ry}" width="290" height="58" rx="29" fill="#fff7ef" stroke="${CAM}" stroke-width="3.5"/><text x="845" y="${ry + 38}" text-anchor="middle" font-size="26" font-weight="800" fill="${NAU}" font-family="${MONO}">${esc(result)}</text></g>`;
  return s + '</svg>';
}

/** Bẫy NOT IN ... NULL: chuỗi so sánh ra TRUE/UNKNOWN. */
export function nullLogic({ w = 1110 } = {}) {
  const items = [['4 <> 1', 'TRUE', XANH], ['4 <> 2', 'TRUE', XANH], ['4 <> 3', 'TRUE', XANH], ['4 <> NULL', 'UNKNOWN', DO]];
  const h = 330;
  let s = head(w, h, 'nl7');
  s += `<text x="12" y="34" font-size="26" font-weight="800" fill="#333" font-family="${MONO}">4 NOT IN (1, 2, 3, NULL)</text>`;
  s += `<text x="12" y="66" font-size="21" fill="#666">means: 4 &lt;&gt; 1  AND  4 &lt;&gt; 2  AND  4 &lt;&gt; 3  AND  4 &lt;&gt; NULL</text>`;
  items.forEach(([t, r, c], i) => {
    const x = 12 + i * 268;
    s += `<g data-k="cmp${i}"><rect x="${x}" y="92" width="224" height="100" rx="12" fill="${c === DO ? '#fdf0ee' : '#f1f9f4'}" stroke="${c}" stroke-width="3.5"/>` +
      `<text x="${x + 112}" y="132" text-anchor="middle" font-size="24" font-weight="700" fill="#333" font-family="${MONO}">${t}</text>` +
      `<text x="${x + 112}" y="174" text-anchor="middle" font-size="27" font-weight="800" fill="${c}">${r}</text></g>`;
    if (i < 3) s += `<text x="${x + 246}" y="150" text-anchor="middle" font-size="19" font-weight="800" fill="${NAU}">AND</text>`;
  });
  s += `<line x1="555" y1="198" x2="555" y2="236" stroke="${NAU}" stroke-width="3.5" marker-end="url(#nl7)"/>`;
  s += `<g data-k="verdict"><rect x="130" y="240" width="850" height="78" rx="12" fill="#fdf0ee" stroke="${DO}" stroke-width="3.5"/><text x="555" y="272" text-anchor="middle" font-size="24" font-weight="800" fill="${DO}">TRUE AND TRUE AND TRUE AND UNKNOWN = UNKNOWN</text><text x="555" y="303" text-anchor="middle" font-size="21" fill="#555">WHERE keeps only TRUE → the row is thrown away</text></g>`;
  return s + '</svg>';
}

/** EXISTS dừng sớm vs COUNT đọc hết: hai thanh. */
export function stopPic({ w = 1110 } = {}) {
  const h = 250;
  let s = head(w, h, 'st7');
  s += `<text x="12" y="30" font-size="22" font-weight="800" fill="#333">One user, 200 matching notes — how many does each form read?</text>`;
  s += `<text x="12" y="84" font-size="21" font-weight="700" fill="${XANH}" font-family="${MONO}">EXISTS (…)</text>`;
  s += `<rect data-k="bar-exists" x="230" y="58" width="22" height="40" rx="4" fill="${XANH}"/><text x="266" y="86" font-size="21" font-weight="800" fill="${XANH}">1 row → stop, answer is YES</text>`;
  s += `<text x="12" y="164" font-size="21" font-weight="700" fill="${DO}" font-family="${MONO}">count(*) &gt; 0</text>`;
  s += `<rect data-k="bar-count" x="230" y="138" width="800" height="40" rx="4" fill="${DO}" opacity=".85"/><text x="246" y="166" font-size="21" font-weight="800" fill="#fff">200 rows → count them all → then compare with 0</text>`;
  s += `<text x="12" y="226" font-size="21" fill="#555">Same question (“does this user have a note?”) — the second form does the work of a full answer.</text>`;
  return s + '</svg>';
}

/** CTE như chuỗi bước đặt tên. steps: [{name, sub}] */
export function cteSteps({ steps, w = 1110, h = 210 }) {
  const n = steps.length, gap = 54, bw = (w - gap * (n - 1)) / n;
  let s = head(w, h, 'cs7');
  steps.forEach((st, i) => {
    const x = i * (bw + gap), c = st.mau || (i === n - 1 ? NAU : PG);
    s += `<g data-k="step${i}"><rect x="${x}" y="40" width="${bw}" height="130" rx="12" fill="${c}14" stroke="${c}" stroke-width="3.5"/>` +
      `<rect x="${x}" y="40" width="${bw}" height="38" rx="12" fill="${c}"/><rect x="${x}" y="62" width="${bw}" height="16" fill="${c}"/>` +
      `<text x="${x + bw / 2}" y="66" text-anchor="middle" font-size="21" font-weight="800" fill="#fff" font-family="${MONO}">${esc(st.name)}</text>`;
    (st.sub || []).forEach((l, j) => { s += `<text x="${x + bw / 2}" y="${108 + j * 26}" text-anchor="middle" font-size="19" fill="#333">${esc(l)}</text>`; });
    s += '</g>';
    if (i < n - 1) s += `<line x1="${x + bw + 4}" y1="105" x2="${x + bw + gap - 6}" y2="105" stroke="${NAU}" stroke-width="3.5" marker-end="url(#cs7)"/>`;
  });
  s += `<text x="12" y="26" font-size="20" fill="#666">read top-down, like paragraphs: each step has a name</text>`;
  return s + '</svg>';
}

/** Hai kiểu thực thi CTE: nội tuyến (đẩy bộ lọc vào) vs MATERIALIZED (tính cả bảng rồi lọc). */
export function matPic({ w = 1110 } = {}) {
  const h = 250;
  let s = head(w, h, 'mp7');
  const col = (x, ti, c, rows, note, k) => {
    s += `<g data-k="${k}"><rect x="${x}" y="8" width="530" height="232" rx="12" fill="${c}0f" stroke="${c}" stroke-width="3"/><text x="${x + 265}" y="40" text-anchor="middle" font-size="22" font-weight="800" fill="${c}">${ti}</text>`;
    rows.forEach(([t, f], i) => { s += `<rect x="${x + 25}" y="${58 + i * 54}" width="480" height="42" rx="8" fill="#fff" stroke="${c}" stroke-width="2.5"/><text x="${x + 265}" y="${86 + i * 54}" text-anchor="middle" font-size="20" fill="#333" font-family="${MONO}">${esc(t)}</text>`; if (i < rows.length - 1) s += `<line x1="${x + 265}" y1="${100 + i * 54}" x2="${x + 265}" y2="${112 + i * 54}" stroke="${NAU}" stroke-width="3" marker-end="url(#mp7)"/>`; });
    s += `<text x="${x + 265}" y="${58 + rows.length * 54 + 18}" text-anchor="middle" font-size="19" font-weight="700" fill="${c}">${note}</text></g>`;
  };
  col(8, 'Inlined (default, PG 12+)', XANH, [['index scan WHERE user_id = 7', 1], ['200 rows']], 'filter pushed INTO the CTE — cheap', 'mat-inline');
  col(570, 'MATERIALIZED', DO, [['read ALL rows of big_note', 1], ['CTE Scan … Filter user_id = 7']], 'whole table first, filter after — slow', 'mat-forced');
  return s + '</svg>';
}

/** Cây quản lý employee, tô theo tầng. lv: {tên: tầng}, col: màu theo tầng, nhãn phụ. */
export function orgTree7({ w = 700, h = 345, lv = {}, badge = {}, ring = false } = {}) {
  const N = { Alice: [350, 38], Bob: [190, 126], Carol: [510, 126], Dave: [190, 214], Erin: [190, 302] };
  const E = [['Alice', 'Bob'], ['Alice', 'Carol'], ['Bob', 'Dave'], ['Dave', 'Erin']];
  const COL = { 1: PG, 2: XANH, 3: CAM, 4: TIM };
  let s = head(w, h, 'ot7');
  E.forEach(([a, b], i) => { s += `<line data-k="org-e${i}" x1="${N[a][0]}" y1="${N[a][1] + 26}" x2="${N[b][0]}" y2="${N[b][1] - 26}" stroke="${NAU}" stroke-width="3.5"/>`; });
  Object.entries(N).forEach(([n, [x, y]]) => {
    const L = lv[n], c = L ? COL[L] : XAM;
    s += `<g data-k="org-${n}"><circle cx="${x}" cy="${y}" r="30" fill="${L ? c + '22' : '#f5f5f5'}" stroke="${c}" stroke-width="4"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="18" font-weight="800" fill="#262626">${n}</text></g>`;
    if (badge[n]) s += `<text x="${x + 42}" y="${y + 7}" font-size="19" font-weight="800" fill="${c}">${esc(badge[n])}</text>`;
  });
  if (ring) s += `<path data-k="ring" d="M${N.Erin[0] - 30},${N.Erin[1]} C 40,300 40,70 ${N.Alice[0] - 30},${N.Alice[1]}" fill="none" stroke="${DO}" stroke-width="4.5" stroke-dasharray="9 6" marker-end="url(#ot7)"/><text x="30" y="190" font-size="19" font-weight="800" fill="${DO}" transform="rotate(-90 30 190)">Alice reports to Erin?!</text>`;
  return s + '</svg>';
}

/** Các vòng lặp của CTE đệ quy: mỗi cột là một vòng, hiện "working table". rounds: [{t, rows:[..], mau}] */
export function iterPic({ rounds, w = 1110, h = 300 }) {
  const n = rounds.length, gap = 24, bw = (w - gap * (n - 1)) / n;
  let s = head(w, h, 'it7');
  rounds.forEach((r, i) => {
    const x = i * (bw + gap), c = r.mau || PG;
    s += `<g data-k="round${i}"><rect x="${x}" y="8" width="${bw}" height="${h - 16}" rx="12" fill="${c}0f" stroke="${c}" stroke-width="3"/>` +
      `<text x="${x + bw / 2}" y="38" text-anchor="middle" font-size="20" font-weight="800" fill="${c}">${esc(r.t)}</text>`;
    if (r.rows.length === 0) s += `<text x="${x + bw / 2}" y="${h / 2 + 8}" text-anchor="middle" font-size="26" font-weight="800" fill="${DO}">∅ no rows</text><text x="${x + bw / 2}" y="${h / 2 + 40}" text-anchor="middle" font-size="19" fill="#555">→ STOP</text>`;
    r.rows.forEach((t, j) => { s += `<rect x="${x + 12}" y="${54 + j * 46}" width="${bw - 24}" height="38" rx="8" fill="#fff" stroke="${c}" stroke-width="2.5"/><text x="${x + bw / 2}" y="${80 + j * 46}" text-anchor="middle" font-size="19" font-family="${MONO}" fill="#333">${esc(t)}</text>`; });
    s += '</g>';
    if (i < n - 1) s += `<line x1="${x + bw + 2}" y1="${h / 2}" x2="${x + bw + gap - 4}" y2="${h / 2}" stroke="${NAU}" stroke-width="3.5" marker-end="url(#it7)"/>`;
  });
  return s + '</svg>';
}

/** Cây danh mục CT Shop: 4 gốc, mỗi gốc vài con. */
export function catTree({ w = 1110, h = 300 } = {}) {
  const roots = [['Pens & ink', ['Ballpoint pens', 'Pencils & erasers', 'Highlighters']], ['Notebooks & paper', ['Ruled notebooks', 'Journals']], ['School tools', ['Calculators', 'Rulers & compasses']], ['Books', ['IT textbooks']]];
  let s = head(w, h, 'ct7');
  const cw = w / 4;
  roots.forEach(([r, kids], i) => {
    const x = i * cw + 8, bw = cw - 24;
    s += `<g data-k="root${i}"><rect x="${x}" y="8" width="${bw}" height="52" rx="10" fill="${PG}" /><text x="${x + bw / 2}" y="40" text-anchor="middle" font-size="19" font-weight="800" fill="#fff">${esc(r)}</text><text x="${x + bw - 8}" y="22" text-anchor="end" font-size="13" fill="#cfe0ef" font-family="${MONO}">parent_id NULL</text></g>`;
    kids.forEach((k, j) => {
      const y = 100 + j * 62;
      s += `<line x1="${x + bw / 2}" y1="${j === 0 ? 60 : y - 26}" x2="${x + bw / 2}" y2="${y}" stroke="${NAU}" stroke-width="3"/>`;
      s += `<g data-k="kid${i}-${j}"><rect x="${x + 14}" y="${y}" width="${bw - 28}" height="42" rx="8" fill="#fff7ef" stroke="${CAM}" stroke-width="2.5"/><text x="${x + bw / 2}" y="${y + 28}" text-anchor="middle" font-size="18" fill="#333">${esc(k)}</text></g>`;
    });
  });
  return s + '</svg>';
}

/** Fan-out cho 7.3: các dòng sau JOIN (note × comment) và tổng sai. */
export function fan7({ w = 1110, h = 330, short = false } = {}) {
  if (short) h = 285;
  let s = head(w, h, 'fo7');
  s += `<text x="12" y="28" font-size="22" font-weight="800" fill="${PG}">note JOIN comment (what the database sums)</text>`;
  const rows = [['Intro to SQL', 120, 'comment 1', 0], ['Intro to SQL', 120, 'comment 2', 1], ['Timezones', 45, 'comment 3', 0]];
  rows.forEach(([t, v, c, dup], i) => {
    const y = 48 + i * 56;
    s += `<g data-k="fo-r${i}"><rect x="12" y="${y}" width="560" height="46" rx="8" fill="${dup ? '#fdf0ee' : '#fff'}" stroke="${dup ? DO : '#c9d5e2'}" stroke-width="${dup ? 3.5 : 2}"/>` +
      `<text x="28" y="${y + 30}" font-size="21" font-family="${MONO}" fill="#333">${t}</text><text x="300" y="${y + 30}" font-size="21" font-family="${MONO}" font-weight="800" fill="${dup ? DO : '#333'}">views ${v}</text><text x="430" y="${y + 30}" font-size="19" font-family="${MONO}" fill="#777">${c}</text></g>`;
  });
  s += `<text x="620" y="94" font-size="26" font-weight="800" fill="${DO}" data-k="fo-sum">Cuong: 120 + 120 = 240 ✗</text>`;
  s += `<text x="620" y="130" font-size="22" fill="#555">true total: 120 + 90 = 210</text>`;
  s += `<text x="620" y="172" font-size="21" fill="#555">“Indexes” (no comments) vanished from the INNER JOIN,</text>`;
  s += `<text x="620" y="198" font-size="21" fill="#555">and Minh disappeared completely.</text>`;
  if (!short) {
  s += `<text x="12" y="250" font-size="23" fill="#333">Each note row is copied <tspan font-weight="800" fill="${NAU}">once per comment</tspan> — the join is right, the sum is wrong.</text>`;
  s += `<text x="12" y="290" font-size="23" fill="${XANH}" font-weight="800">Fix: collapse comments to ONE row per note first (a CTE), then join.</text>`;
  } else {
  s += `<text x="12" y="268" font-size="23" fill="#333">Each note row is copied <tspan font-weight="800" fill="${NAU}">once per comment</tspan> — the join is right, the sum is wrong.</text>`;
  }
  return s + '</svg>';
}

/** Hai người: chi nhánh trái / phải (đời thường 7.1: trung bình lớp). */
export function twoStep({ a, b, w = 1110, h = 150 }) {
  let s = head(w, h, 'ts7');
  s += `<g data-k="step-a"><rect x="12" y="20" width="480" height="110" rx="12" fill="${TIM}14" stroke="${TIM}" stroke-width="3.5"/><text x="252" y="62" text-anchor="middle" font-size="21" font-weight="800" fill="${TIM}">${esc(a[0])}</text><text x="252" y="98" text-anchor="middle" font-size="22" fill="#333">${esc(a[1])}</text></g>`;
  s += `<line x1="498" y1="75" x2="610" y2="75" stroke="${NAU}" stroke-width="4" marker-end="url(#ts7)"/>`;
  s += `<g data-k="step-b"><rect x="618" y="20" width="480" height="110" rx="12" fill="${PG}14" stroke="${PG}" stroke-width="3.5"/><text x="858" y="62" text-anchor="middle" font-size="21" font-weight="800" fill="${PG}">${esc(b[0])}</text><text x="858" y="98" text-anchor="middle" font-size="22" fill="#333">${esc(b[1])}</text></g>`;
  return s + '</svg>';
}
