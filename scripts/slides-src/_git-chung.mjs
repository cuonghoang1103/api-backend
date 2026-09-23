/**
 * _git-chung.mjs — giao diện + thư viện hình vẽ cho các deck của khoá
 * "Git & GitHub" (deck git-00 … git-16).
 *
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/git-03.mjs --out <dir>
 *
 * Dựng TRÊN `_cr-chung.mjs`: dùng lại toàn bộ khối HTML cơ bản (cards, box,
 * steps, table, vs, kpis, flow, tag, two, list, code, tree, mindmap…) và CSS
 * của nó, rồi phủ một lớp theme riêng (nền kiểu GitHub tối, màu nhấn cam Git
 * #F05032, bìa không có dải phim). ⚠️ KHÔNG sửa `_cr-chung.mjs` — khoá Content
 * Creator đang dùng nó; cần hình mới thì thêm vào file NÀY.
 *
 * Hình riêng của Git (đều là SVG/HTML thuần, không phụ thuộc gì thêm):
 *   graph()   — đồ thị commit (DAG): làn, commit, cạnh cha–con, nhãn nhánh/HEAD/tag
 *   trees()   — ba cây: Working dir → Index → HEAD (repo), mũi tên có tên lệnh
 *   term()    — cửa sổ terminal: dòng lệnh có dấu nhắc, output mờ, chú thích xanh
 *   diagram() — hộp + mũi tên tự do (remote/local, fork/upstream, đối tượng…)
 *   conflict()— một vùng xung đột <<<<<<< ======= >>>>>>> có tô màu từng phía
 *
 * Khung slide 1280×720, vùng thân (.bd) rộng ~1168px, cao ~520px sau tiêu đề.
 * Chữ đơn cách rộng ~0,6×cỡ chữ; chữ thường (SF Pro) trung bình ~0,52×cỡ chữ.
 */
import { CSS as CR_CSS, esc, mindmap as crMindmap } from './_cr-chung.mjs';

export {
  esc, cards, box, steps, table, vs, kpis, flow, tag, quote, two, list, cap, note, code, bars, chart, calendar, seg,
} from './_cr-chung.mjs';

/* ─────────────────────────────── BẢNG MÀU ─────────────────────────────── */
export const G = {
  bg: '#0d1117', p1: '#161b22', p2: '#1c2330', bd: '#30363d', tx: '#e6edf3', mu: '#9da7b3', dim: '#6e7681',
  git: '#f05032', ora: '#ff8a3d', amb: '#ffc233', grn: '#3fb950', tea: '#2dd4bf', blu: '#58a6ff', vio: '#bc8cff', pnk: '#f778ba', red: '#ff5c6c',
};
const ACC = ['git', 'blu', 'grn', 'vio', 'amb', 'tea', 'pnk', 'ora'];
const col = (k, i = 0) => G[k] || k || G[ACC[i % ACC.length]];

/* ───────────────────── THEME GIT (phủ lên CSS của CR) ───────────────────── */
export const GIT_CSS = `<style>
:root{--red:${G.red};--git:${G.git}}
body{background:${G.bg}}
.slide{background:
 radial-gradient(900px 480px at 100% 0%,rgba(240,80,50,.10),transparent 60%),
 radial-gradient(820px 460px at 0% 100%,rgba(88,166,255,.08),transparent 60%),
 linear-gradient(180deg,#0f141b,#0b0f14);color:${G.tx}}
.slide .bar{height:6px;background:linear-gradient(90deg,${G.git},${G.ora} 30%,${G.amb} 50%,${G.grn} 72%,${G.blu})}
.slide .hd span:first-child::before{background:${G.git};box-shadow:0 0 12px ${G.git};border-radius:3px;transform:rotate(45deg)}
.slide h1::after{background:linear-gradient(90deg,${G.git},${G.amb})}
.slide .bd code{background:#1f2630;color:#ffb58a}
.slide.cover{background:
 radial-gradient(700px 420px at 78% 30%,rgba(240,80,50,.30),transparent 62%),
 radial-gradient(760px 480px at 18% 80%,rgba(88,166,255,.20),transparent 62%),
 radial-gradient(500px 300px at 50% 50%,rgba(63,185,80,.10),transparent 70%),
 #0a0d12}
.slide.cover::before,.slide.cover::after{display:none}
.slide.cover h1::after{background:linear-gradient(90deg,${G.git},${G.amb},${G.grn})}
.c-cov .chip{background:rgba(240,80,50,.16);border-color:rgba(240,80,50,.6)}
.c-cov .chip i{background:${G.git};box-shadow:0 0 12px ${G.git};border-radius:2px;transform:rotate(45deg)}
.c-mm .ctr{background:linear-gradient(135deg,${G.git},#ff8a3d);box-shadow:0 10px 40px rgba(240,80,50,.35)}
.git{--ac:${G.git}}
.c-code .hljs-addition{color:#7ee787;background:rgba(63,185,80,.16);display:inline-block;width:100%}
.c-code .hljs-deletion{color:#ffa198;background:rgba(248,81,73,.16);display:inline-block;width:100%}
.c-code .hljs-section{color:#d2a8ff}
/* terminal */
.g-term{background:#0a0d12;border:1.5px solid ${G.bd};border-radius:12px;overflow:hidden;text-align:left}
.g-term .tb{display:flex;align-items:center;gap:8px;background:#161b22;border-bottom:1px solid ${G.bd};padding:8px 12px}
.g-term .tb i{width:12px;height:12px;border-radius:50%;display:inline-block}
.g-term .tb span{margin-left:10px;font-family:"SF Mono",Menlo,monospace;font-size:14px;color:${G.mu}}
.g-term pre{margin:0;padding:12px 16px;font-family:"SF Mono",Menlo,monospace;font-size:16px;line-height:1.5;color:#c9d1d9;white-space:pre-wrap}
.g-term .p{color:${G.grn};font-weight:700}.g-term .br{color:${G.blu}}.g-term .cmd{color:#fff}
.g-term .o{color:#8b949e}.g-term .n{color:${G.amb}}.g-term .e{color:${G.red}}.g-term .g{color:${G.grn}}
/* ba cây */
.g-trees{display:grid;grid-template-columns:1fr 1fr 1fr;gap:70px;position:relative}
.g-trees .t{background:#141a22;border:2px solid var(--ac);border-radius:14px;padding:12px 14px;min-height:190px}
.g-trees .t h4{font-size:21px;color:#fff;margin:0 0 2px}
.g-trees .t .sub{font-size:14px;color:${G.mu};display:block;margin-bottom:8px}
.g-trees .t .f{font-family:"SF Mono",Menlo,monospace;font-size:16px;padding:4px 8px;border-radius:6px;background:#0d1117;
 border:1px solid ${G.bd};margin-top:6px;display:flex;justify-content:space-between;gap:8px}
.g-trees .t .f em{font-style:normal;font-size:13px;font-weight:700;border-radius:4px;padding:0 6px;color:#0b0e14;background:var(--fc,${G.mu})}
.g-trees .ar{position:absolute;display:flex;flex-direction:column;align-items:center;font-family:"SF Mono",Menlo,monospace;
 font-size:14px;color:#fff;width:150px;text-align:center;line-height:1.25}
.g-trees .ar b{font-size:26px;line-height:1;color:var(--ac)}
</style>`;

/** mindmap của CR, nhưng hiểu cả màu riêng của Git ('git', và mọi khoá trong G). */
export const mindmap = (center, sub, branches) =>
  crMindmap(center, sub, branches.map((b) => ({ ...b, c: b.c && G[b.c] ? G[b.c] : b.c })));

/* ────────────────────────── KHUNG DECK & BÌA ────────────────────────── */
/** Bọc mảng slide: chèn theme CR + lớp Git vào body từng slide. */
export const S = (slides) => slides.map((s) => ({ ...s, body: CR_CSS + GIT_CSS + (s.body || '') }));

/** Slide bìa. chap: 'CHƯƠNG 5' | 'MỤC 0' … */
export const cover = ({ t, sub, chap, meta = 'Git &amp; GitHub · cuongthai.com' }) => ({
  kind: 'cover', t, sub,
  body: `<div class="c-cov">${chap ? `<span class="chip"><i></i>${chap}</span>` : ''}` +
    `${miniGraph()}<span class="meta">${meta}</span></div>`,
});

/** Hình trang trí nhỏ trên bìa: một nhánh tách ra rồi hợp lại. */
const miniGraph = () => {
  const y0 = 40, y1 = 12, pts = [[40, y0], [110, y0], [180, y1], [250, y1], [320, y0], [390, y0]];
  return `<svg viewBox="0 0 430 56" width="430" height="56">` +
    `<path d="M40 ${y0} H390" stroke="${G.git}" stroke-width="4" fill="none"/>` +
    `<path d="M110 ${y0} C140 ${y0} 150 ${y1} 180 ${y1} H250 C280 ${y1} 290 ${y0} 320 ${y0}" stroke="${G.blu}" stroke-width="4" fill="none"/>` +
    pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="9" fill="#0a0d12" stroke="${y === y1 ? G.blu : G.git}" stroke-width="4"/>`).join('') +
    `</svg>`;
};

/* ────────────────────────────── ĐỒ THỊ COMMIT ────────────────────────────── */
/**
 * graph({ commits, refs, lanes, w, h, dx, dy, x0, y0 })
 *   commits: [{ id, x, lane=0, p:[idCha…], t?:'nhãn dưới', c?:màu, ghost?:bool (nét đứt = bị bỏ rơi),
 *               hl?:bool (viền dày, phát sáng), star?:bool (commit merge — vẽ hình kim cương) }]
 *     x = cột (0,1,2…), lane = hàng (0 ở trên cùng). Nhãn `t` in dưới vòng tròn (mặc định = id).
 *   refs: [{ to:id, n:'main', k:'branch'|'head'|'tag'|'remote'|'note', side:'up'|'down' }]
 *     Nhiều ref cùng một commit, cùng phía, tự xếp chồng. 'head' màu vàng, 'remote' đỏ đứt, 'tag' tím.
 *   lanes: [{ lane, n:'main', c }] — tên làn in ở lề trái (tuỳ chọn).
 *   Mũi tên cạnh đi từ CON về CHA (đúng chiều con trỏ trong Git) khi arrows=true.
 */
export const graph = ({ commits, refs = [], lanes = [], w = 1100, h = 300, dx = 150, dy = 110, x0, y0 = 90, arrows = false, r = 22 }) => {
  const lx = lanes.length ? 150 : 60;
  const X = x0 ?? lx;
  const pos = {};
  commits.forEach((c) => { pos[c.id] = { x: X + c.x * dx, y: y0 + (c.lane || 0) * dy, c }; });
  const laneCol = (l) => col((lanes.find((q) => q.lane === l) || {}).c, l);
  let s = `<svg class="c-svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>` +
    `<marker id="gar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">` +
    `<path d="M0 0 L10 5 L0 10 z" fill="#c9d1d9"/></marker>` +
    `<filter id="ggl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>`;
  lanes.forEach((l) => {
    const y = y0 + l.lane * dy;
    s += `<text x="16" y="${y + 6}" font-family="SF Mono,Menlo,monospace" font-size="17" font-weight="700" fill="${col(l.c, l.lane)}">${esc(l.n)}</text>`;
  });
  // cạnh
  commits.forEach((c) => (c.p || []).forEach((pid) => {
    const a = pos[c.id], b = pos[pid];
    if (!a || !b) return;
    const cc = c.ghost ? G.dim : laneCol(a.y === b.y ? (c.lane || 0) : Math.max(c.lane || 0, pos[pid].c.lane || 0));
    const dash = c.ghost ? ' stroke-dasharray="7 6"' : '';
    let d;
    if (a.y === b.y) d = `M${b.x + r} ${b.y} L${a.x - r} ${a.y}`;
    else {
      const mx = (a.x + b.x) / 2;
      d = `M${b.x + (a.x > b.x ? r * 0.7 : 0)} ${b.y + (a.y > b.y ? r * 0.7 : -r * 0.7)} C${mx} ${b.y} ${mx} ${a.y} ${a.x - r} ${a.y}`;
    }
    s += `<path d="${d}" stroke="${cc}" stroke-width="4" fill="none"${dash}${arrows ? ' marker-start="url(#gar)"' : ''}/>`;
  }));
  // commit
  commits.forEach((c, i) => {
    const { x, y } = pos[c.id];
    const cc = c.ghost ? G.dim : col(c.c, 0) === G.git && !c.c ? laneCol(c.lane || 0) : col(c.c, i);
    const fill = c.ghost ? '#0d1117' : '#0d1117';
    if (c.hl) s += `<circle cx="${x}" cy="${y}" r="${r + 6}" fill="${cc}" opacity=".45" filter="url(#ggl)"/>`;
    if (c.star) s += `<rect x="${x - r * 0.9}" y="${y - r * 0.9}" width="${r * 1.8}" height="${r * 1.8}" rx="5" transform="rotate(45 ${x} ${y})" fill="${fill}" stroke="${cc}" stroke-width="${c.hl ? 5 : 4}"${c.ghost ? ' stroke-dasharray="6 5"' : ''}/>`;
    else s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${cc}" stroke-width="${c.hl ? 5 : 4}"${c.ghost ? ' stroke-dasharray="6 5"' : ''}/>`;
    s += `<text x="${x}" y="${y + 6}" text-anchor="middle" font-family="SF Mono,Menlo,monospace" font-size="15" font-weight="700" fill="${c.ghost ? G.dim : '#fff'}">${esc(c.id)}</text>`;
    if (c.t) s += `<text x="${x}" y="${y + r + 24}" text-anchor="middle" font-size="15" fill="${c.ghost ? G.dim : G.mu}">${esc(c.t)}</text>`;
  });
  // ref
  const stack = {};
  refs.forEach((rf) => {
    const p = pos[rf.to];
    if (!p) return;
    const side = rf.side || 'up';
    const key = rf.to + side;
    const k = stack[key] = (stack[key] ?? -1) + 1;
    const K = { branch: [G.grn, '#0f2a17'], head: [G.amb, '#2e2508'], tag: [G.vio, '#221a33'], remote: [G.red, '#2c1216'], note: [G.blu, '#10223a'] }[rf.k || 'branch'];
    const txt = (rf.k === 'tag' ? '🏷 ' : '') + rf.n;
    const tw = Math.max(46, txt.length * 9.6 + 22);
    const off = r + 16 + k * 34;
    const y = side === 'up' ? p.y - off - 26 : p.y + off + (p.c.t ? 22 : 0);
    s += `<rect x="${p.x - tw / 2}" y="${y}" width="${tw}" height="28" rx="7" fill="${K[1]}" stroke="${K[0]}" stroke-width="2"${rf.k === 'remote' ? ' stroke-dasharray="5 4"' : ''}/>`;
    s += `<text x="${p.x}" y="${y + 19}" text-anchor="middle" font-family="SF Mono,Menlo,monospace" font-size="15" font-weight="700" fill="${K[0]}">${esc(txt)}</text>`;
    if (k === 0) {
      const ya = side === 'up' ? y + 28 : y, yb = side === 'up' ? p.y - r - 3 : p.y + r + 3 + (p.c.t ? 0 : 0);
      if (!(side === 'down' && p.c.t)) s += `<line x1="${p.x}" y1="${ya}" x2="${p.x}" y2="${yb}" stroke="${K[0]}" stroke-width="2"/>`;
    }
  });
  return s + `</svg>`;
};

/* ────────────────────────────────── BA CÂY ────────────────────────────────── */
/**
 * trees({ wd:[files], idx:[files], head:[files], arrows:[{from:0|1|2, to:0|1|2, t:'git add', up?:bool}] , titles? })
 *   file: 'app.js' hoặc ['app.js', 'M', màu] — nhãn nhỏ bên phải (M/A/D/?? …).
 *   Mũi tên đi giữa hai cột kề nhau; up=true đặt ở nửa trên, còn lại nửa dưới.
 */
export const trees = ({ wd = [], idx = [], head = [], arrows = [], titles }) => {
  const T = titles || [
    ['Working directory', 'Thư mục làm việc — file bạn đang sửa', G.amb],
    ['Index (staging)', 'Vùng chờ — ảnh chụp sắp commit', G.blu],
    ['HEAD (repository)', 'Commit gần nhất trong .git', G.grn],
  ];
  const f = (x) => {
    const [n, b, c] = Array.isArray(x) ? x : [x];
    return `<div class="f"><span>${esc(n)}</span>${b ? `<em style="--fc:${col(c) || G.mu}">${esc(b)}</em>` : ''}</div>`;
  };
  const cols = [wd, idx, head].map((fs, i) =>
    `<div class="t" style="--ac:${T[i][2]}"><h4>${T[i][0]}</h4><span class="sub">${T[i][1]}</span>${fs.map(f).join('')}</div>`).join('');
  // Mũi tên vẽ trên hai dải SVG: dải TRÊN (up=true) và dải DƯỚI, nối tâm cột này sang tâm cột kia.
  const W = 1168, cw = (W - 2 * 70) / 3, cx = (i) => i * (cw + 70) + cw / 2;
  const strip = (list, top) => {
    if (!list.length) return '';
    let s = `<svg class="c-svg" viewBox="0 0 ${W} 58" width="${W}" height="58">`;
    list.forEach((a, k) => {
      const right = a.to > a.from;
      const c = a.c ? col(a.c) : (right ? G.grn : G.amb);
      const x1 = cx(a.from) + (right ? 30 : -30), x2 = cx(a.to) + (right ? -30 : 30);
      const y = top ? 44 : 14;
      s += `<path d="M${x1} ${y} L${x2} ${y}" stroke="${c}" stroke-width="3" fill="none"/>`;
      s += `<path d="M${x2} ${y} l${right ? -12 : 12} -7 v14 z" fill="${c}"/>`;
      const tx = (x1 + x2) / 2, tw = a.t.length * 9.2 + 22, ty = top ? 8 : 30;
      s += `<rect x="${tx - tw / 2}" y="${ty}" width="${tw}" height="26" rx="7" fill="#0d1117" stroke="${c}" stroke-width="1.5"/>`;
      s += `<text x="${tx}" y="${ty + 18}" text-anchor="middle" font-family="SF Mono,Menlo,monospace" font-size="15" font-weight="700" fill="${c}">${esc(a.t)}</text>`;
    });
    return s + '</svg>';
  };
  return `<div>${strip(arrows.filter((a) => a.up), true)}<div class="g-trees">${cols}</div>${strip(arrows.filter((a) => !a.up), false)}</div>`;
};

/* ──────────────────────────────── TERMINAL ──────────────────────────────── */
/**
 * term(lines, { title, prompt, branch })
 *   Dòng bắt đầu bằng "$ " = lệnh (in dấu nhắc xanh + tên nhánh); "# " = chú thích xanh lá;
 *   "! " = dòng đỏ (lỗi / chưa add); "= " = dòng xanh lá (đã add); "+ " = dòng nổi bật vàng; còn lại = output xám.
 *   Chuỗi thường, hàm tự escape.
 */
export const term = (lines, { title = 'Terminal — zsh', branch = 'main', dir = '~/du-an' } = {}) => {
  const L = (Array.isArray(lines) ? lines : lines.split('\n')).map((ln) => {
    if (ln.startsWith('$ ')) return `<span class="p">➜</span> <span class="br">${esc(dir)}</span>${branch ? ` <span class="n">(${esc(branch)})</span>` : ''} <span class="cmd">${esc(ln.slice(2))}</span>`;
    if (ln.startsWith('# ')) return `<span class="g">${esc(ln)}</span>`;
    if (ln.startsWith('! ')) return `<span class="e">${esc(ln.slice(2))}</span>`;
    if (ln.startsWith('+ ')) return `<span class="n">${esc(ln.slice(2))}</span>`;
    if (ln.startsWith('= ')) return `<span class="g">${esc(ln.slice(2))}</span>`;
    return `<span class="o">${esc(ln)}</span>`;
  }).join('\n');
  return `<div class="g-term"><div class="tb"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span>${esc(title)}</span></div><pre>${L}</pre></div>`;
};

/* ────────────────────────── SƠ ĐỒ HỘP + MŨI TÊN ────────────────────────── */
/**
 * diagram({ nodes, edges, w, h })
 *   nodes: [{ id, x, y, w=220, h=80, t:'tiêu đề', d?:'dòng phụ', c?:màu, ic?:'💻', dash?:bool, mono?:bool }]
 *     (x, y) là GÓC TRÊN TRÁI. Chữ là chuỗi thường (tự escape); d có thể xuống dòng bằng "\n".
 *   edges: [{ from, to, t?:'nhãn', c?, dash?, both?:bool (2 đầu mũi tên), fs?:'r'|'l'|'t'|'b', ts?:…, off?:số (dịch nhãn), bend?:số }]
 *     fs/ts = cạnh của hộp nguồn/đích (mặc định tự chọn theo hướng).
 */
export const diagram = ({ nodes, edges = [], w = 1160, h = 470 }) => {
  const N = Object.fromEntries(nodes.map((n) => [n.id, { w: 220, h: 80, ...n }]));
  const anchor = (n, side) => ({
    r: [n.x + n.w, n.y + n.h / 2], l: [n.x, n.y + n.h / 2], t: [n.x + n.w / 2, n.y], b: [n.x + n.w / 2, n.y + n.h],
  })[side];
  const auto = (a, b) => {
    const dxx = (b.x + b.w / 2) - (a.x + a.w / 2), dyy = (b.y + b.h / 2) - (a.y + a.h / 2);
    return Math.abs(dxx) * 0.6 > Math.abs(dyy) ? (dxx > 0 ? ['r', 'l'] : ['l', 'r']) : (dyy > 0 ? ['b', 't'] : ['t', 'b']);
  };
  let s = `<svg class="c-svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>`;
  const cols = new Set(edges.map((e, i) => col(e.c, i + 1)));
  [...cols].forEach((c, i) => {
    s += `<marker id="dm${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker>`;
  });
  s += `</defs>`;
  const mid = (c) => `dm${[...cols].indexOf(c)}`;
  edges.forEach((e, i) => {
    const a = N[e.from], b = N[e.to];
    const [fs, ts] = auto(a, b);
    const [x1, y1] = anchor(a, e.fs || fs), [x2, y2] = anchor(b, e.ts || ts);
    const c = col(e.c, i + 1);
    const bend = e.bend || 0;
    const mx = (x1 + x2) / 2 + (y1 === y2 ? 0 : bend), my = (y1 + y2) / 2 + (y1 === y2 ? bend : 0);
    const d = bend ? `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}` : `M${x1} ${y1} L${x2} ${y2}`;
    s += `<path d="${d}" stroke="${c}" stroke-width="3" fill="none"${e.dash ? ' stroke-dasharray="8 6"' : ''} marker-end="url(#${mid(c)})"${e.both ? ` marker-start="url(#${mid(c)})"` : ''}/>`;
    if (e.t) {
      const tx = bend ? (x1 + x2) / 2 + (y1 === y2 ? 0 : bend / 2) : (x1 + x2) / 2;
      const ty = (bend ? (y1 + y2) / 2 + (y1 === y2 ? bend / 2 : 0) : (y1 + y2) / 2) + (e.off ?? -10);
      const tw = e.t.length * 8.8 + 18;
      s += `<rect x="${tx - tw / 2}" y="${ty - 19}" width="${tw}" height="26" rx="6" fill="#0d1117" stroke="${c}" stroke-width="1.5"/>`;
      s += `<text x="${tx}" y="${ty}" text-anchor="middle" font-family="SF Mono,Menlo,monospace" font-size="14.5" font-weight="700" fill="${c}">${esc(e.t)}</text>`;
    }
  });
  nodes.forEach((n0, i) => {
    const n = N[n0.id];
    const c = col(n.c, i);
    s += `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="12" fill="#141a22" stroke="${c}" stroke-width="2.5"${n.dash ? ' stroke-dasharray="8 6"' : ''}/>`;
    s += `<rect x="${n.x}" y="${n.y}" width="7" height="${n.h}" rx="3" fill="${c}"/>`;
    const lines = n.d ? String(n.d).split('\n') : [];
    const tot = 24 + lines.length * 20;
    let y = n.y + n.h / 2 - tot / 2 + 19;
    const ff = n.mono ? ' font-family="SF Mono,Menlo,monospace"' : '';
    s += `<text x="${n.x + n.w / 2 + 3}" y="${y}" text-anchor="middle" font-size="19" font-weight="800" fill="#fff"${ff}>${n.ic ? esc(n.ic) + ' ' : ''}${esc(n.t)}</text>`;
    lines.forEach((ln) => { y += 21; s += `<text x="${n.x + n.w / 2 + 3}" y="${y}" text-anchor="middle" font-size="15" fill="${G.mu}"${ff}>${esc(ln)}</text>`; });
  });
  return s + `</svg>`;
};

/* ──────────────────────────────── XUNG ĐỘT ──────────────────────────────── */
/**
 * conflict({ ours:[dòng], base?:[dòng], theirs:[dòng], oursName='HEAD', theirsName='feature', before?:[dòng], after?:[dòng] })
 *   Vẽ một vùng xung đột có tô nền theo phía; base có ⇒ kiểu zdiff3 (||||||| base).
 */
export const conflict = ({ ours, base, theirs, oursName = 'HEAD', theirsName = 'feature', before = [], after = [], fs = 17 }) => {
  const row = (t, bg, fg = '#c9d1d9', b = false) =>
    `<div style="background:${bg};color:${fg};padding:1px 14px;${b ? 'font-weight:700;' : ''}white-space:pre">${esc(t) || ' '}</div>`;
  let h = before.map((t) => row(t, 'transparent')).join('');
  h += row(`<<<<<<< ${oursName}`, 'rgba(63,185,80,.28)', '#7ee787', true);
  h += ours.map((t) => row(t, 'rgba(63,185,80,.12)')).join('');
  if (base) { h += row('||||||| merge base', 'rgba(157,167,179,.22)', '#c9d1d9', true); h += base.map((t) => row(t, 'rgba(157,167,179,.10)')).join(''); }
  h += row('=======', 'rgba(255,194,51,.22)', '#ffd666', true);
  h += theirs.map((t) => row(t, 'rgba(88,166,255,.12)')).join('');
  h += row(`>>>>>>> ${theirsName}`, 'rgba(88,166,255,.28)', '#a5d6ff', true);
  h += after.map((t) => row(t, 'transparent')).join('');
  return `<div style="font-family:SF Mono,Menlo,monospace;font-size:${fs}px;line-height:1.55;background:#0a0d12;border:1.5px solid ${G.bd};border-radius:12px;padding:10px 0;text-align:left">${h}</div>`;
};
