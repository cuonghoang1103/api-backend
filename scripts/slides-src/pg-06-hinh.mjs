/**
 * pg-06-hinh.mjs — hình SVG dùng chung cho Chương 6 (deck pg-06-1…4, Tổng hợp & gom nhóm). Không phải deck. (agent c6, 25/10/2026)
 * Chữ SVG: rộng ≈ 0,602 × cỡ chữ / ký tự (mono). Mọi phần tử video cần chú thích có data-k.
 *   receipts()  — nhiều phiếu → phễu → một con số (hàm tổng hợp)
 *   foldColumn()— cột views (có NULL) và 4 hàm đọc nó thế nào (count(*) 7 · count(col) 6 · sum 357 · avg 59,5)
 *   baskets()   — GROUP BY: chip dòng bay vào rổ theo nhóm; item.x = bị WHERE loại; group.out = bị HAVING loại (rổ úp nắp)
 *   pipeline()  — thứ tự thực thi logic FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY (dòng / nhóm / cột ra)
 *   onePass()   — FILTER: một lượt quét bảng, nhiều bộ đếm
 *   fanPic6()   — fan-out của chương: Intro to SQL (views 120) bị nhân 3 lần theo 3 bình luận
 *   twoOrders() — join rồi tổng hợp (phồng) ↔ tổng hợp rồi join (thật)
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', XAM = '#9a9a9a', TIM = '#7a5a9a';
const GRP = [PG, CAM, XANH, TIM, NAU];
const defs = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;

/** Phiếu → phễu → một số. items: ['+120', '+90', …]; result: 'Σ = 357'. */
export function receipts({ items = ['120', '90', '60', '45', '12', '30'], result = 'SUM = 357', w = 1110, h = 300, label = 'many rows', after = 'one value' } = {}) {
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">${defs('rc')}`;
  s += `<text x="30" y="30" font-size="22" font-weight="800" fill="${PG}">${esc(label)}</text>`;
  items.forEach((t, i) => {
    const x = 30 + (i % 3) * 150, y = 48 + Math.floor(i / 3) * 112;
    s += `<g data-k="rc-s${i}" transform="rotate(${(i % 2 ? 2 : -2)} ${x + 60} ${y + 45})"><rect x="${x}" y="${y}" width="120" height="92" rx="6" fill="#fffdf6" stroke="#cdbb8a" stroke-width="2.5"/>`;
    s += `<line x1="${x + 14}" y1="${y + 22}" x2="${x + 106}" y2="${y + 22}" stroke="#d8cdb0" stroke-width="3"/><line x1="${x + 14}" y1="${y + 38}" x2="${x + 80}" y2="${y + 38}" stroke="#d8cdb0" stroke-width="3"/>`;
    s += `<text x="${x + 60}" y="${y + 74}" text-anchor="middle" font-size="30" font-weight="800" font-family="${MONO}" fill="${NAU}">${esc(t)}</text></g>`;
  });
  s += `<path data-k="rc-funnel" d="M 500,60 L 760,60 L 650,170 L 650,240 L 610,240 L 610,170 Z" fill="${PG}18" stroke="${PG}" stroke-width="4"/>`;
  s += `<text x="630" y="52" text-anchor="middle" font-size="22" font-weight="800" fill="${PG}">aggregate</text>`;
  s += `<path d="M 480,150 L 520,150" stroke="${NAU}" stroke-width="4" marker-end="url(#rc)"/>`;
  s += `<rect data-k="rc-res" x="790" y="120" width="290" height="110" rx="14" fill="#f1f9f4" stroke="${XANH}" stroke-width="4"/>`;
  s += `<text x="935" y="164" text-anchor="middle" font-size="22" font-weight="800" fill="${XANH}">${esc(after)}</text>`;
  s += `<text x="935" y="208" text-anchor="middle" font-size="36" font-weight="900" font-family="${MONO}" fill="#1f6b40">${esc(result)}</text>`;
  s += `<path d="M 650,240 C 650,262 935,262 935,236" fill="none" stroke="${NAU}" stroke-width="4" marker-end="url(#rc)"/>`;
  return s + '</svg>';
}

/** Cột views (có NULL) + bốn hàm. */
export function foldColumn({ w = 1110, h = 410 } = {}) {
  const vals = [120, 90, null, 60, 45, 12, 30];
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">${defs('fc')}`;
  s += `<text x="20" y="26" font-size="22" font-weight="800" fill="${PG}">note.views</text>`;
  vals.forEach((v, i) => {
    const y = 40 + i * 47, nul = v === null;
    s += `<g data-k="fc-v${i}"><rect x="20" y="${y}" width="170" height="40" rx="8" fill="${nul ? '#f2f2f2' : '#eef4fa'}" stroke="${nul ? XAM : PG}" stroke-width="3"${nul ? ' stroke-dasharray="7 5"' : ''}/>`;
    s += `<text x="105" y="${y + 29}" text-anchor="middle" font-size="26" font-family="${MONO}" font-weight="800" ${nul ? `font-style="italic" fill="${XAM}"` : `fill="${PG}"`}>${nul ? 'NULL' : v}</text></g>`;
  });
  s += `<path data-k="fc-brace" d="M 200,40 q 20,0 20,20 L 220,178 q 0,20 20,20 q -20,0 -20,20 L 220,330 q 0,20 -20,20" fill="none" stroke="${XAM}" stroke-width="3"/>`;
  const rows = [
    ['count(*)', '7', 'every row, NULL or not', PG, 'cs'],
    ['count(views)', '6', 'skips the NULL', CAM, 'cv'],
    ['sum(views)', '357', 'skips the NULL', XANH, 'sum'],
    ['avg(views)', '59.5', '357 ÷ 6  (not ÷ 7)', DO, 'avg'],
  ];
  rows.forEach(([f, v, note, m, k], i) => {
    const y = 36 + i * 84;
    s += `<g data-k="fc-${k}"><rect x="320" y="${y}" width="770" height="72" rx="12" fill="${m}12" stroke="${m}" stroke-width="3"/>`;
    s += `<text x="340" y="${y + 44}" font-size="26" font-family="${MONO}" font-weight="800" fill="${m}">${esc(f)}</text>`;
    s += `<text x="620" y="${y + 47}" font-size="40" font-family="${MONO}" font-weight="900" fill="#333">= ${v}</text>`;
    s += `<text x="800" y="${y + 44}" font-size="21" fill="#555">${esc(note)}</text></g>`;
  });
  s += `<text x="320" y="${36 + 4 * 84 + 22}" font-size="21" fill="${NAU}" font-weight="700">Only count(*) ignores the values — every other aggregate skips NULL.</text>`;
  return s + '</svg>';
}

/**
 * GROUP BY: chip → rổ.
 *  items: [{ n: '#1', v: '120', g: 0, x?: true }]  g = chỉ số rổ; x = bị WHERE loại (gạch, không vào rổ)
 *  groups: [{ name: 'sql', stat: 'count 4 · sum 300', out?: true }]  out = bị HAVING loại (úp nắp đỏ)
 *  cap: 'HAVING sum(views) > 50' — nhãn nắp
 */
export function baskets({ items, groups, w = 1110, h = 330, cap = '', note = '' }) {
  const n = items.length, cw = Math.min(118, (w - 20) / n - 12), gap = (w - 20 - cw * n) / Math.max(1, n - 1);
  const gw = Math.min(250, (w - 20) / groups.length - 20), gg = (w - 20 - gw * groups.length) / Math.max(1, groups.length - 1);
  const gx = (g) => 10 + g * (gw + gg), ix = (i) => 10 + i * (cw + gap);
  const H = h + (cap ? 40 : 0);
  let s = `<svg viewBox="0 0 ${w} ${H}" width="${w}" height="${H}" font-family="Arial">`;
  const cnt = groups.map(() => 0);
  items.forEach((it) => { if (!it.x && it.g !== undefined) cnt[it.g]++; });
  const seen = groups.map(() => 0);
  items.forEach((it, i) => {
    const x = ix(i), m = it.x ? XAM : GRP[it.g % 5];
    if (!it.x && it.g !== undefined) {
      const k = seen[it.g]++, tx = gx(it.g) + gw * (0.18 + 0.64 * ((k + 0.5) / cnt[it.g]));
      s += `<path d="M ${x + cw / 2},${34 + 52} C ${x + cw / 2},${140} ${tx},${120} ${tx},${190}" fill="none" stroke="${m}" stroke-width="3" opacity=".7"/>`;
    }
    s += `<g data-k="bk-i${i}"><rect x="${x}" y="34" width="${cw}" height="52" rx="9" fill="${it.x ? '#f3f3f3' : m + '1c'}" stroke="${m}" stroke-width="3"${it.x ? ' stroke-dasharray="6 4"' : ''}/>`;
    s += `<text x="${x + cw / 2}" y="56" text-anchor="middle" font-size="17" font-weight="800" fill="${m}">${esc(it.n)}</text>`;
    s += `<text x="${x + cw / 2}" y="77" text-anchor="middle" font-size="21" font-family="${MONO}" font-weight="800" fill="#333">${it.v === null ? 'NULL' : esc(it.v)}</text>`;
    if (it.x) s += `<line x1="${x + 4}" y1="38" x2="${x + cw - 4}" y2="82" stroke="${DO}" stroke-width="4"/><line x1="${x + cw - 4}" y1="38" x2="${x + 4}" y2="82" stroke="${DO}" stroke-width="4"/>`;
    s += `</g>`;
  });
  groups.forEach((g, i) => {
    const x = gx(i), m = g.out ? DO : GRP[i % 5], top = 190, bh = 100;
    s += `<g data-k="bk-b${i}" opacity="${g.out ? 0.6 : 1}"><path d="M ${x},${top} L ${x + gw},${top} L ${x + gw - 26},${top + bh} L ${x + 26},${top + bh} Z" fill="${m}18" stroke="${m}" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<text x="${x + gw / 2}" y="${top + 38}" text-anchor="middle" font-size="26" font-weight="900" fill="${m}">${esc(g.name)}</text>`;
    s += `<text x="${x + gw / 2}" y="${top + 72}" text-anchor="middle" font-size="19" font-family="${MONO}" font-weight="700" fill="#333">${esc(g.stat)}</text>`;
    if (g.out) s += `<rect x="${x - 6}" y="${top - 14}" width="${gw + 12}" height="22" rx="8" fill="${DO}"/><text x="${x + gw / 2}" y="${top + 138}" text-anchor="middle" font-size="40" font-weight="900" fill="${DO}">✗</text>`;
    else if (cap) s += `<text x="${x + gw / 2}" y="${top + 138}" text-anchor="middle" font-size="40" font-weight="900" fill="${XANH}">✓</text>`;
    s += `</g>`;
  });
  if (cap) s += `<text x="${w - 10}" y="${H - 8}" text-anchor="end" font-size="22" font-weight="800" fill="${DO}" font-family="${MONO}">🪣 ${esc(cap)}</text>`;
  if (note) s += `<text x="10" y="${h - 12}" font-size="21" fill="#666">${esc(note)}</text>`;
  return s + '</svg>';
}

/** Thứ tự thực thi logic. hl = chỉ số ô sáng. */
export function pipeline({ hl = [], w = 1110, h = 230 } = {}) {
  const st = [['FROM / JOIN', 'assemble rows', PG], ['WHERE', 'filter rows', PG], ['GROUP BY', 'collapse to groups', CAM], ['HAVING', 'filter groups', CAM], ['SELECT', 'compute columns', XANH], ['ORDER BY / LIMIT', 'sort & trim', XANH]];
  const bw = 158, gap = (w - bw * 6) / 5;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">${defs('pp')}`;
  st.forEach(([t, sub, m], i) => {
    const x = i * (bw + gap), on = !hl.length || hl.includes(i);
    s += `<g data-k="pl-${i}" opacity="${on ? 1 : 0.4}"><rect x="${x}" y="40" width="${bw}" height="96" rx="12" fill="${m}${on && hl.length ? '30' : '14'}" stroke="${m}" stroke-width="${on && hl.length ? 5 : 3}"/>`;
    s += `<text x="${x + bw / 2}" y="${t.length > 12 ? 82 : 86}" text-anchor="middle" font-size="${t.length > 12 ? 17 : 21}" font-weight="800" fill="${m}">${esc(t)}</text>`;
    s += `<text x="${x + bw / 2}" y="112" text-anchor="middle" font-size="15" fill="#555">${esc(sub)}</text>`;
    s += `<text x="${x + 10}" y="30" font-size="20" font-weight="900" fill="${m}">${i + 1}</text></g>`;
    if (i < 5) s += `<path d="M ${x + bw + 3},88 L ${x + bw + gap - 4},88" stroke="${NAU}" stroke-width="3.5" marker-end="url(#pp)"/>`;
  });
  s += `<rect x="0" y="160" width="${bw * 2 + gap + 2}" height="34" rx="8" fill="${PG}18"/><text x="${(bw * 2 + gap) / 2}" y="183" text-anchor="middle" font-size="19" font-weight="800" fill="${PG}">works on single ROWS</text>`;
  s += `<rect x="${2 * (bw + gap)}" y="160" width="${bw * 2 + gap + 2}" height="34" rx="8" fill="${CAM}18"/><text x="${2 * (bw + gap) + (bw * 2 + gap) / 2}" y="183" text-anchor="middle" font-size="19" font-weight="800" fill="${NAU}">works on GROUPS</text>`;
  s += `<rect x="${4 * (bw + gap)}" y="160" width="${bw * 2 + gap + 2}" height="34" rx="8" fill="${XANH}18"/><text x="${4 * (bw + gap) + (bw * 2 + gap) / 2}" y="183" text-anchor="middle" font-size="19" font-weight="800" fill="${XANH}">builds the OUTPUT</text>`;
  return s + '</svg>';
}

/** FILTER: một lượt quét, nhiều bộ đếm. */
export function onePass({ w = 1110, h = 352 } = {}) {
  const rows = [['1', 'sql', 'pinned'], ['2', 'sql', 'pinned'], ['3', 'ops', ''], ['4', 'sql', ''], ['5', 'date', ''], ['6', 'ops', ''], ['7', 'sql', '']];
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">${defs('op')}`;
  s += `<text x="20" y="26" font-size="22" font-weight="800" fill="${PG}">one scan of note</text>`;
  rows.forEach(([id, tag, pin], i) => {
    const y = 40 + i * 40;
    s += `<g data-k="op-r${i}"><rect x="20" y="${y}" width="360" height="34" rx="6" fill="${tag === 'sql' ? PG + '18' : '#fff'}" stroke="${PG}" stroke-width="2"/>`;
    s += `<text x="34" y="${y + 24}" font-size="19" font-family="${MONO}" fill="#333">#${id}  ${esc(tag.padEnd(5))}${pin ? ' 📌' : ''}</text></g>`;
  });
  s += `<path data-k="op-arrow" d="M 396,160 L 480,160" stroke="${NAU}" stroke-width="4" marker-end="url(#op)"/>`;
  const c = [['count(*)', '7', PG], ["FILTER (WHERE tag='sql')", '4', CAM], ['FILTER (WHERE pinned)', '2', XANH], ["sum(views) FILTER sql", '300', TIM]];
  c.forEach(([f, v, m], i) => {
    const y = 40 + i * 70;
    s += `<g data-k="op-c${i}"><rect x="500" y="${y}" width="590" height="58" rx="12" fill="${m}12" stroke="${m}" stroke-width="3"/>`;
    s += `<text x="518" y="${y + 37}" font-size="20" font-family="${MONO}" font-weight="800" fill="${m}">${esc(f)}</text><text x="1070" y="${y + 40}" text-anchor="end" font-size="34" font-family="${MONO}" font-weight="900" fill="#333">${v}</text></g>`;
  });
  s += `<text x="500" y="${40 + 4 * 70 + 10}" font-size="21" fill="${NAU}" font-weight="700">Four answers, one pass over the table — not four queries.</text>`;
  return s + '</svg>';
}

/** Fan-out của chương: một note, 3 bình luận ⇒ 3 dòng. */
export function fanPic6({ w = 1110, h = 300 } = {}) {
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">${defs('f6')}`;
  s += `<text x="20" y="28" font-size="22" font-weight="800" fill="${PG}">note (the “one”)</text>`;
  s += `<g data-k="f6-note"><rect x="20" y="42" width="330" height="80" rx="8" fill="#eef4fa" stroke="${PG}" stroke-width="3"/><text x="34" y="74" font-size="20" font-family="${MONO}" fill="#333">Intro to SQL</text><text x="34" y="106" font-size="22" font-family="${MONO}" font-weight="800" fill="${NAU}">views = 120</text></g>`;
  s += `<text x="470" y="28" font-size="22" font-weight="800" fill="${TIM}">comment (the “many”)</text>`;
  ['Great intro!', 'Thanks', 'Very clear'].forEach((t, i) => {
    const y = 42 + i * 68;
    s += `<g data-k="f6-c${i}"><rect x="470" y="${y}" width="230" height="56" rx="8" fill="#f4eff9" stroke="${TIM}" stroke-width="3"/><text x="484" y="${y + 35}" font-size="20" font-family="${MONO}" fill="#333">${t}</text></g>`;
    s += `<path d="M 350,82 C 410,82 410,${y + 28} 470,${y + 28}" fill="none" stroke="${XANH}" stroke-width="3.5" marker-end="url(#f6)"/>`;
    s += `<g data-k="f6-r${i}"><rect x="790" y="${y}" width="300" height="56" rx="8" fill="${i ? '#fdf0ee' : '#fff7ef'}" stroke="${i ? DO : CAM}" stroke-width="3"/><text x="804" y="${y + 36}" font-size="21" font-family="${MONO}" font-weight="800" fill="${i ? DO : NAU}">Intro to SQL · 120</text></g>`;
    s += `<path d="M 700,${y + 28} L 786,${y + 28}" stroke="${NAU}" stroke-width="3.5" marker-end="url(#f6)"/>`;
  });
  s += `<text x="790" y="28" font-size="22" font-weight="800" fill="${NAU}">joined rows</text>`;
  s += `<text x="20" y="262" font-size="30" font-weight="800" fill="${DO}" data-k="f6-sum">sum(views) after the join = 120 + 120 + 120 = 360 ✗  (true: 120)</text>`;
  return s + '</svg>';
}

/** Join rồi tổng hợp ↔ tổng hợp rồi join. */
export function twoOrders({ w = 1110, h = 330 } = {}) {
  const box = (x, y, bw, t, sub, m, k) => `<g data-k="${k}"><rect x="${x}" y="${y}" width="${bw}" height="78" rx="12" fill="${m}14" stroke="${m}" stroke-width="3"/><text x="${x + bw / 2}" y="${y + 33}" text-anchor="middle" font-size="21" font-weight="800" fill="${m}">${esc(t)}</text><text x="${x + bw / 2}" y="${y + 58}" text-anchor="middle" font-size="17" fill="#555">${esc(sub)}</text></g>`;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">${defs('to')}`;
  s += `<text x="0" y="24" font-size="23" font-weight="900" fill="${DO}">Join, then aggregate — inflates</text>`;
  s += box(0, 42, 170, 'note ⨝ comment', '4 rows (Intro ×3)', DO, 'to-a1') + `<path d="M 174,81 L 204,81" stroke="${NAU}" stroke-width="3.5" marker-end="url(#to)"/>`;
  s += box(208, 42, 140, 'GROUP BY', 'author', CAM, 'to-a2') + `<path d="M 352,81 L 382,81" stroke="${NAU}" stroke-width="3.5" marker-end="url(#to)"/>`;
  s += box(386, 42, 150, 'sum(views)', 'Cuong 450 ✗', DO, 'to-a3');
  s += `<text x="570" y="24" font-size="23" font-weight="900" fill="${XANH}">Aggregate, then join — honest</text>`;
  s += box(570, 42, 170, 'comment', 'GROUP BY note_id', CAM, 'to-b1') + `<path d="M 744,81 L 774,81" stroke="${NAU}" stroke-width="3.5" marker-end="url(#to)"/>`;
  s += box(778, 42, 150, '1 row / note', 'Intro → 3', XANH, 'to-b2') + `<path d="M 932,81 L 958,81" stroke="${NAU}" stroke-width="3.5" marker-end="url(#to)"/>`;
  s += box(962, 42, 148, 'join note', 'Cuong 210 ✓', XANH, 'to-b3');
  s += `<text x="0" y="190" font-size="23" fill="#444">The join <tspan font-weight="800" fill="${DO}">copies</tspan> each note row once per comment — so every <tspan font-family="${MONO}">sum()</tspan> of a note column grows with it.</text>`;
  s += `<text x="0" y="232" font-size="23" fill="#444">Collapse the “many” side to <tspan font-weight="800" fill="${XANH}">one row per key</tspan> first and nothing is copied.</text>`;
  s += `<text x="0" y="288" font-size="21" fill="${NAU}" font-weight="700">The tell: put count(*) next to your sum(). If it is bigger than the rows you expected — the grain is wrong.</text>`;
  return s + '</svg>';
}
