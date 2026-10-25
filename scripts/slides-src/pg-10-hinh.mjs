/**
 * pg-10-hinh.mjs — hình SVG dùng chung cho Chương 10 — EXPLAIN & bộ lập kế hoạch (deck pg-10-1…4). Không phải deck. (agent c10, 25/10/2026)
 * Chữ SVG mono: rộng ≈ 0,602 × cỡ chữ / ký tự (tw()). Phần tử video cần chú thích có data-k.
 *   wrapPlan()   gập dòng EXPLAIN dài tại " (actual" (ghi chú "↪ wrapped" trên slide — KHÔNG cắt chữ)
 *   anatomy()    giải phẫu một dòng nút kế hoạch (tên nút · bảng · cost khởi động..tổng · rows · width)
 *   planTree()   cây kế hoạch vẽ thành hộp: lá ở dưới, gốc ở trên, số thứ tự chạy, mũi tên dữ liệu đi LÊN
 *   nlPic / hashPic / mergePic   ba chiến lược JOIN
 *   histPic · vennPic · bars · bufPic
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7a5a9a', XAM = '#8a8a8a';
export const tw = (s, fs) => String(s).length * fs * 0.602;
const head = (w, h, id, extra = '') => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" ${extra}>` +
  `<defs>${[['', NAU], ['x', XANH], ['b', PG], ['d', DO], ['c', CAM], ['t', TIM]].map(([s, c]) =>
    `<marker id="${id}${s}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`).join('')}</defs>`;
const t = (x, y, s, { fs = 18, fill = '#333', w = 400, mono = false, anchor = 'start', k = '' } = {}) =>
  `<text${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" font-size="${fs}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}"${mono ? ` font-family="${MONO}"` : ''}>${esc(s)}</text>`;

/** Gập dòng kế hoạch dài: phần "(actual …)" xuống dòng, thụt thẳng hàng dưới "(cost". */
export function wrapPlan(text, max = 92, padFix) {
  return String(text).split('\n').map((l) => {
    if (l.length <= max) return l;
    const i = l.indexOf(' (actual');
    if (i < 0) return l;
    const j = l.indexOf('(cost');
    const pad = ' '.repeat(padFix ?? Math.max(0, (j >= 0 ? j : 6) - 2));
    return `${l.slice(0, i)}\n${pad}↪ ${l.slice(i + 1)}`;
  }).join('\n');
}

/** Giải phẫu một dòng nút. Trả SVG rộng w. */
export function anatomy({ line = 'Seq Scan on ord  (cost=0.00..9927.00 rows=9700 width=6)', fs = 26, w = 1110 } = {}) {
  const cw = fs * 0.602, x0 = Math.max(10, (w - line.length * cw) / 2), y0 = 120;
  const pos = (sub) => { const i = line.indexOf(sub); return [x0 + i * cw, x0 + (i + sub.length) * cw]; };
  const parts = [
    ['Seq Scan', 'node type', 'HOW it reads', PG, 'up', 'nt'],
    ['on ord', 'relation', 'WHICH table', XANH, 'down', 'rel'],
    ['0.00', 'startup cost', 'before 1st row', CAM, 'up', 'st'],
    ['9927.00', 'total cost', 'for ALL rows', NAU, 'down', 'tot'],
    ['rows=9700', 'estimated rows', 'out of this node', DO, 'up', 'rows'],
    ['width=6', 'avg bytes/row', 'estimated', TIM, 'down', 'wid'],
  ];
  let s = head(w, 250, 'an');
  s += `<rect x="${x0 - 14}" y="${y0 - fs - 8}" width="${line.length * cw + 28}" height="${fs + 26}" rx="8" fill="#0f1720"/>`;
  s += t(x0, y0, line, { fs, fill: '#e6edf3', mono: true, k: 'line' });
  for (const [sub, a, b, c, dir, k] of parts) {
    const [l, r] = pos(sub); const m = (l + r) / 2;
    const yb = dir === 'up' ? y0 - fs - 14 : y0 + 16;
    s += `<path d="M${l + 2},${yb} L${l + 2},${yb + (dir === 'up' ? -8 : 8)} L${r - 2},${yb + (dir === 'up' ? -8 : 8)} L${r - 2},${yb}" fill="none" stroke="${c}" stroke-width="3"/>`;
    const ty = dir === 'up' ? yb - 44 : yb + 40;
    s += t(m, ty, a, { fs: 20, fill: c, w: 800, anchor: 'middle', k: `an-${k}` });
    s += t(m, ty + 22, b, { fs: 17, fill: '#555', anchor: 'middle' });
  }
  return s + '</svg>';
}

/**
 * Cây kế hoạch. nodes: [{ id, t, s?, est?, act?, mau?, x, y, cha?, so? }] (x,y = tâm hộp). Gốc ở trên, mũi tên từ con LÊN cha.
 * opts: { w, h, bw=260, bh=74, fs=19 }
 */
export function planTree(nodes, { w = 1110, h = 470, bw = 270, bh = 78, fs = 19, k = 'pt' } = {}) {
  let s = head(w, h, k);
  const by = Object.fromEntries(nodes.map((n) => [n.id, n]));
  for (const n of nodes) if (n.cha) {
    const p = by[n.cha];
    s += `<line x1="${n.x}" y1="${n.y - bh / 2}" x2="${p.x}" y2="${p.y + bh / 2 + 4}" stroke="${XANH}" stroke-width="4" marker-end="url(#${k}x)"/>`;
    if (n.flow) s += t((n.x + p.x) / 2 + 10, (n.y - bh / 2 + p.y + bh / 2) / 2 + 6, n.flow, { fs: 16, fill: XANH, w: 700, mono: true });
  }
  for (const n of nodes) {
    const c = n.mau || PG;
    s += `<g data-k="${k}-${n.id}"><rect x="${n.x - bw / 2}" y="${n.y - bh / 2}" width="${bw}" height="${bh}" rx="12" fill="${c}14" stroke="${c}" stroke-width="2.5"/>`;
    s += t(n.x, n.y - (n.s ? 8 : -6), n.t, { fs, fill: c, w: 800, anchor: 'middle' });
    if (n.s) s += t(n.x, n.y + 20, n.s, { fs: fs - 4, fill: '#444', anchor: 'middle', mono: true });
    if (n.so) s += `<circle cx="${n.x - bw / 2 + 2}" cy="${n.y - bh / 2 + 2}" r="17" fill="${CAM}"/>` + t(n.x - bw / 2 + 2, n.y - bh / 2 + 9, String(n.so), { fs: 19, fill: '#fff', w: 800, anchor: 'middle' });
    s += '</g>';
  }
  return s + '</svg>';
}

/** Thanh ngang so sánh. items: [{ t, v, nhan, mau }] — chiều dài theo log hoặc tuyến tính. */
export function bars(items, { w = 1100, rh = 54, fs = 21, log = false, k = 'bar', lw = 300 } = {}) {
  const max = Math.max(...items.map((i) => (log ? Math.log10(i.v + 1) : i.v)));
  const h = items.length * rh + 10;
  let s = head(w, h, k);
  items.forEach((it, i) => {
    const y = 6 + i * rh, v = log ? Math.log10(it.v + 1) : it.v;
    const L = Math.max(6, (w - lw - 230) * v / max);
    s += t(0, y + rh / 2 + 7, it.t, { fs, fill: '#333', w: 700, k: `${k}-t${i}` });
    s += `<rect data-k="${k}-${i}" x="${lw}" y="${y + 8}" width="${L}" height="${rh - 18}" rx="6" fill="${it.mau || PG}"/>`;
    s += t(lw + L + 12, y + rh / 2 + 7, it.nhan, { fs, fill: it.mau || PG, w: 800 });
  });
  return s + '</svg>';
}

/** Nested Loop: cột ngoài (đơn) — mỗi dòng một mũi tên tra chỉ mục bên trong. */
export function nlPic({ w = 540, h = 380 } = {}) {
  let s = head(w, h, 'nl');
  s += t(4, 30, 'outer: ord (5 rows)', { fs: 18, fill: PG, w: 800 });
  s += t(410, 30, 'inner: customer_pkey', { fs: 18, fill: XANH, w: 800, anchor: 'middle' });
  const cus = [3891, 7740, 1325, 9012, 455];
  cus.forEach((c, i) => {
    const y = 60 + i * 62;
    s += `<rect data-k="nl-o${i}" x="10" y="${y}" width="120" height="46" rx="8" fill="#eef4fa" stroke="${PG}" stroke-width="2"/>`;
    s += t(70, y + 30, `order ${i + 1}`, { fs: 18, anchor: 'middle', mono: true });
    s += `<path d="M132,${y + 23} C220,${y + 23} 250,${170} 318,${175}" fill="none" stroke="${CAM}" stroke-width="2.5" marker-end="url(#nlc)"/>`;
    s += t(205, y + 18, `loop ${i + 1}`, { fs: 15, fill: CAM, w: 700, anchor: 'middle' });
  });
  // B-tree nhỏ
  s += `<g data-k="nl-idx"><rect x="330" y="140" width="160" height="56" rx="8" fill="#e4f3e9" stroke="${XANH}" stroke-width="2.5"/>` + t(410, 175, 'B-tree root', { fs: 17, fill: XANH, w: 700, anchor: 'middle' });
  [[320, 270], [410, 270], [500, 270]].forEach(([x, y]) => { s += `<line x1="410" y1="196" x2="${x}" y2="${y - 22}" stroke="${XANH}" stroke-width="2"/><rect x="${x - 45}" y="${y - 22}" width="90" height="40" rx="6" fill="#fff" stroke="${XANH}" stroke-width="2"/>`; });
  s += t(400, 340, 'each loop = 1 index lookup', { fs: 16, fill: '#444', anchor: 'middle' }) + '</g>';
  return s + '</svg>';
}

/** Hash Join: dựng bảng băm từ phía nhỏ (customer) rồi dò bằng phía lớn (ord). */
export function hashPic({ w = 560, h = 390 } = {}) {
  let s = head(w, h, 'hj');
  s += t(80, 26, '① BUILD', { fs: 19, fill: XANH, w: 800, anchor: 'middle' }) + t(80, 46, 'customer 10,000', { fs: 15, fill: '#555', anchor: 'middle' });
  s += `<rect data-k="hj-small" x="20" y="60" width="120" height="150" rx="8" fill="#e4f3e9" stroke="${XANH}" stroke-width="2.5"/>`;
  for (let i = 0; i < 5; i++) s += `<line x1="30" y1="${85 + i * 26}" x2="130" y2="${85 + i * 26}" stroke="${XANH}" stroke-width="1.5" opacity=".5"/>`;
  s += `<line x1="142" y1="135" x2="208" y2="135" stroke="${XANH}" stroke-width="3" marker-end="url(#hjx)"/>`;
  s += t(310, 26, 'hash table (in work_mem)', { fs: 18, fill: TIM, w: 800, anchor: 'middle' });
  ['0', '1', '2', '3', '4', '5'].forEach((b, i) => {
    const y = 42 + i * 30;
    s += `<rect data-k="hj-b${i}" x="215" y="${y}" width="190" height="26" rx="4" fill="#efe7f6" stroke="${TIM}" stroke-width="1.5"/>` + t(225, y + 19, `bucket ${b} → ●●`, { fs: 15, fill: TIM, mono: true });
  });
  s += t(80, 248, '② PROBE', { fs: 19, fill: PG, w: 800, anchor: 'middle' }) + t(80, 268, 'ord 500,000 — once', { fs: 15, fill: '#555', anchor: 'middle' });
  s += `<rect data-k="hj-big" x="20" y="280" width="380" height="60" rx="8" fill="#eef4fa" stroke="${PG}" stroke-width="2.5"/>`;
  for (let i = 0; i < 12; i++) s += `<rect x="${30 + i * 30}" y="292" width="22" height="36" rx="3" fill="${PG}" opacity="${0.25 + (i % 3) * 0.2}"/>`;
  s += `<path d="M300,280 C320,240 330,230 330,${42 + 3 * 30 + 26}" fill="none" stroke="${CAM}" stroke-width="3" marker-end="url(#hjc)"/>`;
  s += t(345, 250, 'hash(customer_id)', { fs: 15, fill: CAM, w: 700, mono: true });
  s += t(w / 2, 375, 'loops=1 on both sides · no index needed', { fs: 17, fill: '#333', w: 700, anchor: 'middle' });
  return s + '</svg>';
}

/** Merge Join: hai dãy đã sắp, hai con trỏ đi song song như khoá kéo. */
export function mergePic({ w = 540, h = 380 } = {}) {
  let s = head(w, h, 'mj');
  const A = [1, 1, 2, 4, 4, 5], B = [1, 2, 3, 4, 5];
  s += t(110, 28, 'ord (sorted by customer_id)', { fs: 16, fill: PG, w: 800, anchor: 'middle' });
  s += t(420, 28, 'customer (sorted by id)', { fs: 16, fill: XANH, w: 800, anchor: 'middle' });
  A.forEach((v, i) => { s += `<rect data-k="mj-a${i}" x="60" y="${45 + i * 48}" width="100" height="40" rx="6" fill="#eef4fa" stroke="${PG}" stroke-width="2"/>` + t(110, 72 + i * 48, String(v), { fs: 20, anchor: 'middle', mono: true, w: 700 }); });
  B.forEach((v, i) => { s += `<rect data-k="mj-b${i}" x="370" y="${45 + i * 58}" width="100" height="40" rx="6" fill="#e4f3e9" stroke="${XANH}" stroke-width="2"/>` + t(420, 72 + i * 58, String(v), { fs: 20, anchor: 'middle', mono: true, w: 700 }); });
  const pair = [[0, 0], [1, 0], [2, 1], [3, 3], [4, 3], [5, 4]];
  pair.forEach(([a, b]) => { s += `<line x1="162" y1="${65 + a * 48}" x2="368" y2="${65 + b * 58}" stroke="${CAM}" stroke-width="2.2" opacity=".85"/>`; });
  s += t(w / 2, 360, 'one pass down both lists — never goes back', { fs: 17, fill: '#333', w: 700, anchor: 'middle' });
  return s + '</svg>';
}

/** Histogram cân bằng tần suất (mỗi ô ~1% dòng) — biên dày ⇒ ô hẹp. */
export function histPic({ w = 1100, h = 250, bounds = [5.02, 9.79, 14.52, 19.30, 24.30, 29.18], cut = 100 } = {}) {
  let s = head(w, h, 'hi');
  const x0 = 40, x1 = w - 40, sc = (v) => x0 + (x1 - x0) * (v - 5) / 495;
  s += `<line x1="${x0}" y1="170" x2="${x1}" y2="170" stroke="#555" stroke-width="2"/>`;
  for (let i = 0; i <= 100; i += 1) {
    const v = 5 + 4.95 * i; const x = sc(v);
    s += `<line x1="${x}" y1="${i % 10 === 0 ? 120 : 140}" x2="${x}" y2="170" stroke="${v < cut ? DO : PG}" stroke-width="${i % 10 === 0 ? 2 : 1}" opacity=".8"/>`;
  }
  s += `<rect data-k="hi-cut" x="${x0}" y="100" width="${sc(cut) - x0}" height="70" fill="${DO}" opacity=".12"/>`;
  s += t(sc(cut), 92, `amount < ${cut}  →  ~19 of 100 buckets`, { fs: 19, fill: DO, w: 800, anchor: 'middle', k: 'hi-lab' });
  [5, 100, 200, 300, 400, 500].forEach((v) => { s += t(sc(v), 196, String(v), { fs: 17, fill: '#444', anchor: 'middle', mono: true }); });
  s += t(w / 2, 232, '101 bounds = 100 buckets, each holding ~1% of the rows (5,000 of 500,000)', { fs: 18, fill: '#333', anchor: 'middle' });
  s += t(x0, 40, 'histogram_bounds of ord.amount', { fs: 19, fill: PG, w: 800 });
  return s + '</svg>';
}

/** Venn city ⊂ region: planner nghĩ độc lập (hình trái) vs thật (hình phải). */
export function vennPic({ w = 1100, h = 300 } = {}) {
  let s = head(w, h, 've');
  // trái: độc lập
  s += `<g data-k="ve-a"><rect x="20" y="40" width="500" height="220" rx="10" fill="#fafafa" stroke="#bbb"/>`;
  s += `<circle cx="210" cy="150" r="80" fill="${PG}" opacity=".25" stroke="${PG}" stroke-width="2"/><circle cx="330" cy="150" r="80" fill="${CAM}" opacity=".25" stroke="${CAM}" stroke-width="2"/>`;
  s += t(170, 150, 'Hanoi', { fs: 18, fill: PG, w: 800, anchor: 'middle' }) + t(370, 150, 'North', { fs: 18, fill: CAM, w: 800, anchor: 'middle' });
  s += t(270, 155, '400', { fs: 22, fill: DO, w: 800, anchor: 'middle' });
  s += t(270, 30, 'planner assumes: independent', { fs: 19, fill: DO, w: 800, anchor: 'middle' }) + t(270, 250, '0.2 × 0.2 × 10,000 = 400', { fs: 18, fill: '#444', anchor: 'middle', mono: true }) + '</g>';
  // phải: thật
  s += `<g data-k="ve-b"><rect x="580" y="40" width="500" height="220" rx="10" fill="#fafafa" stroke="#bbb"/>`;
  s += `<circle cx="830" cy="150" r="88" fill="${CAM}" opacity=".25" stroke="${CAM}" stroke-width="2"/><circle cx="830" cy="150" r="86" fill="${PG}" opacity=".25" stroke="${PG}" stroke-width="2" stroke-dasharray="6 4"/>`;
  s += t(830, 140, 'Hanoi = North', { fs: 19, fill: '#333', w: 800, anchor: 'middle' }) + t(830, 168, '2000', { fs: 22, fill: XANH, w: 800, anchor: 'middle' });
  s += t(830, 30, 'reality: city decides region', { fs: 19, fill: XANH, w: 800, anchor: 'middle' }) + t(830, 250, 'every Hanoi row is a North row', { fs: 18, fill: '#444', anchor: 'middle' }) + '</g>';
  return s + '</svg>';
}

/** shared_buffers (RAM) ⇄ đĩa: hit / read / temp. */
export function bufPic({ w = 1100, h = 300 } = {}) {
  let s = head(w, h, 'bu');
  s += `<g data-k="bu-q"><rect x="20" y="110" width="200" height="80" rx="12" fill="#eef4fa" stroke="${PG}" stroke-width="2.5"/>` + t(120, 147, 'your query', { fs: 20, fill: PG, w: 800, anchor: 'middle' }) + t(120, 172, 'needs page 1234', { fs: 16, fill: '#555', anchor: 'middle', mono: true }) + '</g>';
  s += `<g data-k="bu-sb"><rect x="380" y="60" width="300" height="180" rx="14" fill="#e4f3e9" stroke="${XANH}" stroke-width="3"/>` + t(530, 92, 'shared_buffers (RAM)', { fs: 20, fill: XANH, w: 800, anchor: 'middle' });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) s += `<rect x="${400 + c * 34}" y="${110 + r * 38}" width="28" height="30" rx="4" fill="${XANH}" opacity="${0.25 + ((r + c) % 3) * 0.2}"/>`;
  s += t(530, 232, '8 kB pages · default 128MB', { fs: 15, fill: '#555', anchor: 'middle' }) + '</g>';
  s += `<g data-k="bu-disk"><rect x="850" y="80" width="230" height="140" rx="14" fill="#fdebd8" stroke="${CAM}" stroke-width="3"/>` + t(965, 140, 'disk', { fs: 22, fill: CAM, w: 800, anchor: 'middle' }) + t(965, 168, '(+ OS page cache)', { fs: 15, fill: '#555', anchor: 'middle' }) + '</g>';
  s += `<line x1="222" y1="140" x2="376" y2="140" stroke="${XANH}" stroke-width="4" marker-end="url(#bux)"/>` + t(300, 128, 'shared hit', { fs: 18, fill: XANH, w: 800, anchor: 'middle', k: 'bu-hit' }) + t(300, 160, 'already in RAM', { fs: 15, fill: '#555', anchor: 'middle' });
  s += `<path d="M846,190 C760,270 330,290 222,180" fill="none" stroke="${CAM}" stroke-width="4" marker-end="url(#buc)"/>` + t(560, 290, 'shared read = not in RAM → fetched from disk (slow)', { fs: 18, fill: CAM, w: 800, anchor: 'middle', k: 'bu-read' });
  return s + '</svg>';
}
