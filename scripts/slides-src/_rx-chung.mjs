/**
 * _rx-chung.mjs — giao diện + thư viện hình vẽ cho các deck của khoá "React" (deck rx-00 … rx-14).
 * CHÉP từ _ga-chung.mjs (khoá GitHub Actions, 25/09/2026) rồi đổi màu nhấn sang xanh React #149eca, bìa hình nguyên tử,
 * và THÊM hai hình dùng rất nhiều trong khoá:
 *   compTree({ root, w, h })  — CÂY COMPONENT: hộp <Tên />, dòng state/props, đánh dấu component render lại (↻),
 *                               bỏ qua nhờ memo (⊘), nơi state sống (● state).
 *   renderFlow({ steps, w, h, hl }) — luồng "state đổi → render lại → commit → vẽ" (vòng lặp của React).
 * Tên màu 'dk', 'ga', 'rx' đều = màu nhấn React. Mọi hình khác (term, yaml, diagram, sv/R/T/A, pipe…) như _ga-chung.
 *
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/rx-NN.mjs --out <dir>
 *
 * ⚠️ KHÔNG sửa `_cr-chung.mjs` / `_git-chung.mjs` / `_ga-chung.mjs` — các khoá khác đang dùng; cần hình mới thì thêm vào
 * file NÀY (hoặc tự vẽ bằng sv/R/T/A trong deck).
 *
 * Màu đặt bằng tên: rx (xanh React) · blu · tea · grn · amb · ora · vio · pnk · red · dim.
 * Khung slide 1280×720, vùng thân (.bd) rộng ~1168px, cao ~520px sau tiêu đề.
 * Chữ đơn cách rộng ~0,6×cỡ chữ; chữ thường trung bình ~0,52×cỡ chữ. Chữ mono dùng Liberation Mono trước (đủ dấu tiếng Việt).
 */
import { CSS as CR_CSS, esc, mindmap as crMindmap } from './_cr-chung.mjs';
import { GIT_CSS, G as GG, term as gitTerm, diagram as gitDiagram } from './_git-chung.mjs';

export {
  esc, cards, box, steps, table, vs, kpis, flow, tag, quote, two, list, cap, note, code, bars, chart, calendar, seg,
} from './_cr-chung.mjs';
import { tree as crTree } from './_cr-chung.mjs';
/** tree() của CR gắn 🎞 (phim) cho file — khoá Docker dùng 📄. */
export const tree = (src) => crTree(src).replaceAll('🎞 ', '📄 ');
export { conflict } from './_git-chung.mjs';

/* ─────────────────────────────── BẢNG MÀU ─────────────────────────────── */
export const D = {
  bg: '#0b1220', p1: '#111a2b', p2: '#16223a', bd: '#2a3a55', tx: '#e6edf3', mu: '#9fb0c8', dim: '#6b7a93',
  dk: '#149eca', ga: '#149eca', rx: '#149eca', blu: '#58a6ff', tea: '#2dd4bf', grn: '#3fb950', amb: '#ffc233', ora: '#ff8a3d', vio: '#bc8cff', pnk: '#f778ba', red: '#ff5c6c',
};
const ACC = ['dk', 'tea', 'grn', 'vio', 'amb', 'blu', 'pnk', 'ora'];
const col = (k, i = 0) => D[k] || k || D[ACC[i % ACC.length]];
// diagram()/term() của _git-chung đọc màu qua bảng G của nó ⇒ cho G biết thêm 'dk' (không đổi màu nào của Git).
GG.dk = D.dk; GG.rx = D.dk; GG.ga = D.dk;

/* ──────────────────── THEME DOCKER (phủ lên CSS của CR + Git) ──────────────────── */
export const DK_CSS = `<style>
:root{--red:${D.red};--dk:${D.dk}}
body{background:${D.bg}}
.slide{background:
 radial-gradient(900px 480px at 100% 0%,rgba(20,158,202,.16),transparent 60%),
 radial-gradient(820px 460px at 0% 100%,rgba(45,212,191,.08),transparent 60%),
 linear-gradient(180deg,#0d1526,#0a101c);color:${D.tx}}
.slide .bar{height:6px;background:linear-gradient(90deg,${D.dk},${D.blu} 35%,${D.tea} 65%,${D.grn})}
.slide .hd span:first-child::before{background:${D.dk};box-shadow:0 0 12px ${D.dk};border-radius:3px;transform:none}
.slide h1::after{background:linear-gradient(90deg,${D.dk},${D.tea})}
.slide .bd code{background:#16233a;color:#8fd0ff}
.slide.cover{background:
 radial-gradient(700px 420px at 78% 30%,rgba(20,158,202,.34),transparent 62%),
 radial-gradient(760px 480px at 18% 80%,rgba(45,212,191,.16),transparent 62%),
 #081020}
.slide.cover h1::after{background:linear-gradient(90deg,${D.dk},${D.tea},${D.grn})}
.c-cov .chip{background:rgba(20,158,202,.16);border-color:rgba(20,158,202,.6)}
.c-cov .chip i{background:${D.dk};box-shadow:0 0 12px ${D.dk};border-radius:2px;transform:none}
.c-mm .ctr{background:linear-gradient(135deg,${D.dk},#0e7fa6);box-shadow:0 10px 40px rgba(20,158,202,.35)}
.g-term{background:#070c16;border-color:${D.bd}}
.g-term .tb{background:#111a2b;border-color:${D.bd}}
/* chồng tầng */
.d-lay{display:flex;flex-direction:column-reverse;gap:6px;text-align:left}
.d-lay .l{display:flex;align-items:center;gap:12px;border-radius:9px;padding:7px 14px;border:2px solid var(--ac);
 background:linear-gradient(90deg,color-mix(in srgb,var(--ac) 22%,#0d1526),#0f182a);font-size:17px;color:#fff}
.d-lay .l.rw{border-style:dashed;background:rgba(255,194,51,.08)}
.d-lay .l.mnt{border-style:dotted;background:rgba(188,140,255,.08)}
.d-lay .l code{font-family:"SF Mono",Menlo,monospace;font-size:15.5px;background:none;color:#dbe7f7;padding:0}
.d-lay .l .sz{margin-left:auto;font-family:"SF Mono",Menlo,monospace;font-size:14.5px;color:${D.mu};white-space:nowrap}
.d-lay .l .k{font-size:12.5px;font-weight:800;letter-spacing:.5px;padding:2px 7px;border-radius:5px;background:var(--ac);color:#08101e;white-space:nowrap}
.d-lay .cap{font-size:14px;color:${D.mu};text-align:center;margin-top:2px}
/* máy chủ */
.d-host{border:2px solid ${D.bd};border-radius:16px;background:rgba(17,26,43,.75);padding:12px 14px 14px;text-align:left;position:relative}
.d-host>.hh{font-family:"SF Mono",Menlo,monospace;font-size:15px;color:${D.mu};margin-bottom:10px;display:flex;gap:10px;align-items:center}
.d-host>.hh b{color:#fff;font-size:16px}
.d-host .ctrs{display:grid;gap:12px}
.d-host .ct{border:2px solid var(--ac);border-radius:12px;background:#0d1628;padding:9px 12px}
.d-host .ct .n{display:flex;align-items:center;gap:8px;font-weight:800;font-size:18px;color:#fff}
.d-host .ct .n i{width:12px;height:12px;border-radius:3px;background:var(--ac)}
.d-host .ct .im{font-family:"SF Mono",Menlo,monospace;font-size:13.5px;color:${D.mu};display:block;margin-top:2px}
.d-host .ct ul{margin:6px 0 0;padding-left:18px;font-size:14.5px;color:#cfd9e8;line-height:1.45}
.d-host .ct .pt{display:inline-block;margin-top:6px;font-family:"SF Mono",Menlo,monospace;font-size:13px;padding:1px 7px;border-radius:5px;
 border:1.5px solid ${D.amb};color:${D.amb}}
.d-host .side{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.d-host .side span{font-family:"SF Mono",Menlo,monospace;font-size:14px;padding:4px 10px;border-radius:8px;border:1.5px dashed var(--ac);color:var(--ac);background:#0b1322}
/* yaml có ghi chú */
.d-yml{display:grid;grid-template-columns:auto 1fr;gap:0 18px;background:#070c16;border:1.5px solid ${D.bd};border-radius:12px;padding:10px 16px;text-align:left}
.d-yml .c{font-family:"SF Mono",Menlo,monospace;font-size:var(--fs,16px);line-height:1.55;color:#c9d1d9;white-space:pre}
.d-yml .c .k{color:#79c0ff}.d-yml .c .s{color:#a5d6ff}.d-yml .c .cm{color:#6e7681}.d-yml .c .kw{color:#ff7b72;font-weight:700}
.d-yml .a{font-size:calc(var(--fs,16px) - 1.5px);line-height:1.55;color:${D.tea};white-space:nowrap}
.d-yml .a:not(:empty)::before{content:"← ";color:${D.dim}}
/* Chữ mono tiếng Việt: "monospace" trên máy dựng Linux là DejaVu Sans Mono — THIẾU dải U+1EA0… (ố ầ ử ỗ vỡ).
   Liberation Mono đủ glyph ⇒ đặt nó đứng đầu (bài học deck rx-01, 25/09/2026). */
.g-term pre,.g-term .tb span,.d-yml .c,.slide .bd code,.c-code{font-family:"Liberation Mono","SF Mono",Menlo,monospace!important}
</style>`;

/** mindmap của CR, hiểu cả tên màu của Docker ('dk', 'tea', …). */
export const mindmap = (center, sub, branches) =>
  crMindmap(center, sub, branches.map((b) => ({ ...b, c: b.c && D[b.c] ? D[b.c] : b.c })));

/* ────────────────────────── KHUNG DECK & BÌA ────────────────────────── */
/** Bọc mảng slide: chèn CSS của CR + Git (terminal) + lớp Docker vào body từng slide. */
export const S = (slides) => slides.map((s) => ({ ...s, body: CR_CSS + GIT_CSS + DK_CSS + (s.body || '') }));

/** Slide bìa. chap: 'CHƯƠNG 5' | 'MỤC 0' … */
export const cover = ({ t, sub, chap, meta = 'React · cuongthai.com' }) => ({
  kind: 'cover', t, sub,
  body: `<div class="c-cov">${chap ? `<span class="chip"><i></i>${chap}</span>` : ''}` +
    `${miniStack()}<span class="meta">${meta}</span></div>`,
});

/** Hình trang trí trên bìa: nguyên tử React — ba quỹ đạo + nhân. */
const miniStack = () => {
  const orb = (r) => `<ellipse cx="0" cy="0" rx="78" ry="29" transform="rotate(${r})" stroke="${D.dk}" stroke-width="4" fill="none"/>`;
  return `<svg viewBox="-90 -90 180 180" width="130" height="130">${orb(0)}${orb(60)}${orb(120)}<circle r="13" fill="${D.dk}"/></svg>`;
};

/* ────────────────────────────── CHỒNG TẦNG ────────────────────────────── */
/**
 * layers({ rows, w, cap })
 *   rows: DƯỚI → TRÊN (tầng nền trước). Mỗi hàng: { t:'RUN npm ci' (HTML được), sz?:'167MB', c?:màu,
 *          k?:'nhãn nhỏ' (vd 'ẢNH NỀN'), rw?:bool (tầng ghi được, viền đứt vàng), mnt?:bool (mount, viền chấm tím) }
 *   Tầng dưới cùng in ở ĐÁY, đúng như cách overlayfs chồng lên nhau.
 */
export const layers = ({ rows, w = 560, cap } = {}) =>
  `<div class="d-lay" style="width:${w}px">${cap ? `<div class="cap">${cap}</div>` : ''}${rows.map((r, i) => {
    const c = r.rw ? D.amb : r.mnt ? D.vio : col(r.c, i);
    return `<div class="l${r.rw ? ' rw' : ''}${r.mnt ? ' mnt' : ''}" style="--ac:${c}">` +
      `${r.k ? `<span class="k">${r.k}</span>` : ''}<span>${r.t}</span>${r.sz ? `<span class="sz">${r.sz}</span>` : ''}</div>`;
  }).join('')}</div>`;

/* ────────────────────────────── MÁY CHỦ ────────────────────────────── */
/**
 * host({ t:'VPS Ubuntu · Docker Engine', ic:'🖥', cols:3, ctrs:[{ n:'api', im:'node:22-alpine', c, items:['…'], port:'3000' }],
 *        side:[{ t:'volume pgdata', c:'vio' }, …] })
 *   Chữ trong items/side là HTML (tự viết &amp;); n/im/port là chuỗi thường.
 */
export const host = ({ t = 'Máy chủ · Docker Engine', ic = '🖥', ctrs = [], cols, side = [] }) =>
  `<div class="d-host"><div class="hh">${ic} <b>${esc(t)}</b></div>` +
  `<div class="ctrs" style="grid-template-columns:repeat(${cols || Math.min(ctrs.length, 4)},1fr)">${ctrs.map((x, i) =>
    `<div class="ct" style="--ac:${col(x.c, i)}"><span class="n"><i></i>${esc(x.n)}</span>${x.im ? `<span class="im">${esc(x.im)}</span>` : ''}` +
    `${x.items?.length ? `<ul>${x.items.map((li) => `<li>${li}</li>`).join('')}</ul>` : ''}${x.port ? `<span class="pt">:${esc(x.port)}</span>` : ''}</div>`).join('')}</div>` +
  `${side.length ? `<div class="side">${side.map((s, i) => `<span style="--ac:${col(s.c, i + 3)}">${s.t}</span>`).join('')}</div>` : ''}</div>`;

/* ─────────────────────────── TERMINAL & SƠ ĐỒ ─────────────────────────── */
/**
 * term(lines, { title, dir='~', fs=15 }) — như _git-chung, KHÔNG in tên nhánh. Dấu nhắc mặc định '~' và chữ 15px
 * để lệnh docker dài không gãy dòng (bài học deck dk-01). Cần to hơn cho ít dòng: fs: 17.
 */
export const term = (lines, { title = 'Terminal — zsh', branch = '', dir = '~', fs = 15 } = {}) =>
  gitTerm(lines, { title, branch, dir }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.45">`);

/** diagram({nodes, edges, w, h}) — xem chú thích trong _git-chung.mjs. Màu nhận thêm 'dk'. */
export const diagram = gitDiagram;

/* ───────────────────────────── YAML CÓ GHI CHÚ ───────────────────────────── */
/**
 * yaml(lines, { fs, lang })
 *   lines: [[ 'dòng mã', 'ghi chú bên phải (tuỳ)' ], …] hoặc chuỗi thường.
 *   Tô màu đơn giản: khoá YAML (trước dấu :), chuỗi trong nháy, # chú thích; lang:'docker' tô chỉ thị IN HOA đầu dòng.
 */
export const yaml = (lines, { fs = 16, lang = 'yaml' } = {}) => {
  const hl = (raw) => {
    // Tách chú thích và chuỗi trên chữ THÔ trước, rồi mới escape + gắn thẻ — để regex chuỗi không ăn nhầm class="…".
    let body = raw, tail = '';
    const cm = raw.search(/(^|\s)#/);
    if (cm >= 0) { const at = raw[cm] === '#' ? cm : cm + 1; tail = `<span class="cm">${esc(raw.slice(at))}</span>`; body = raw.slice(0, at); }
    const strs = [];
    body = body.replace(/("[^"]*"|'[^']*')/g, (m) => { strs.push(m); return `\u0001${strs.length - 1}\u0002`; });
    let e = esc(body);
    if (lang === 'docker') e = e.replace(/^(\s*)([A-Z]{2,})(?=\s|$)/, '$1<span class="kw">$2</span>');
    else e = e.replace(/^(\s*-?\s*)([\w.-]+)(:)/, '$1<span class="k">$2</span>$3');
    e = e.replace(/\u0001(\d+)\u0002/g, (_, i) => `<span class="s">${esc(strs[+i])}</span>`);
    return e + tail;
  };
  return `<div class="d-yml" style="--fs:${fs}px">${lines.map((x) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `<div class="c">${hl(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;
};

/* ─────────────────────── SVG TỰ VẼ (rút từ deck dk-01) ───────────────────────
 * Cho hình kiểu mới (lưới overlay tầng × file, dòng thời gian tín hiệu, sơ đồ tuỳ ý) — xem cách dùng thật trong
 * scripts/slides-src/dk-01.mjs (overlay(), stopTimeline(), procLens()). Toạ độ tính bằng px của SVG.
 *   sv(w, h, inner)                         — khung <svg> có sẵn marker mũi tên cho các màu dk/amb/red/grn/mu/tea/vio
 *   R(x, y, w, h, {c, fill, dash, r, sw, op}) — hộp; T(x, y, chữ, {fs, c, a:'start'|'middle'|'end', b, mono}) — chữ (tự escape)
 *   A(x1, y1, x2, y2, {c, dash, sw})         — mũi tên thẳng
 */
const MONO = 'Liberation Mono,SF Mono,Menlo,monospace';
export const sv = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;margin:0 auto"><defs>` +
  ['dk', 'ga', 'rx', 'blu', 'tea', 'grn', 'amb', 'ora', 'vio', 'pnk', 'red', 'mu', 'dim'].map((k) => `<marker id="m-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${D[k]}"/></marker>`).join('') +
  `</defs>${inner}</svg>`;
export const R = (x, y, w, h, { c = 'dk', fill = '#111a2b', dash = false, r = 12, sw = 2.5, op = 1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${D[c] || c}" stroke-width="${sw}"${dash ? ' stroke-dasharray="9 7"' : ''} opacity="${op}"/>`;
export const T = (x, y, s, { fs = 17, c = '#e6edf3', a = 'start', b = false, mono = false } = {}) =>
  `<text x="${x}" y="${y}" font-size="${fs}" fill="${D[c] || c}" text-anchor="${a}"${b ? ' font-weight="800"' : ''}${mono ? ` font-family="${MONO}"` : ''}>${esc(s)}</text>`;
export const A = (x1, y1, x2, y2, { c = 'dk', dash = false, sw = 3 } = {}) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${D[c] || c}" stroke-width="${sw}" fill="none"${dash ? ' stroke-dasharray="7 6"' : ''} marker-end="url(#m-${D[c] ? c : 'dk'})"/>`;

/* ─────────────────────────────── PIPELINE ─────────────────────────────── */
/**
 * pipe({ cols:[[{n:'lint', s:'ok'|'fail'|'skip'|'run'|'wait', d:'12s'}…], …], w, h, needs:[['lint','test'],…] })
 *   Mỗi cột là một "tầng" job chạy song song; needs vẽ mũi tên từ job này sang job kia (theo tên n).
 *   s: ok ✓ xanh · fail ✗ đỏ · skip ⊘ xám · run ◌ vàng · wait … tím. Giống giao diện đồ thị job của GitHub.
 */
export const pipe = ({ cols, w = 1100, h = 300, needs = [] }) => {
  const S = { ok: [D.grn, '✓'], fail: [D.red, '✗'], skip: [D.dim, '⊘'], run: [D.amb, '◌'], wait: [D.vio, '…'] };
  const bw = 200, bh = 52, gx = (w - cols.length * bw) / (cols.length + 1);
  const pos = {};
  let inner = '';
  cols.forEach((col, ci) => {
    const x = gx + ci * (bw + gx), gy = (h - col.length * bh) / (col.length + 1);
    col.forEach((j, ri) => {
      const y = gy + ri * (bh + gy); pos[j.n] = { x, y };
      const [c, ic] = S[j.s || 'ok'];
      inner += R(x, y, bw, bh, { c, fill: '#0f182a', r: 10 }) +
        `<circle cx="${x + 24}" cy="${y + bh / 2}" r="11" fill="${c}"/>` + T(x + 24, y + bh / 2 + 6, ic, { fs: 15, c: '#08101e', a: 'middle', b: true }) +
        T(x + 44, y + bh / 2 + 6, j.n, { fs: 17, b: true, mono: true }) + (j.d ? T(x + bw - 10, y + bh / 2 + 6, j.d, { fs: 14, c: 'mu', a: 'end', mono: true }) : '');
    });
  });
  needs.forEach(([a, b]) => {
    const p = pos[a], q = pos[b]; if (!p || !q) return;
    const x1 = p.x + bw, y1 = p.y + bh / 2, x2 = q.x - 4, y2 = q.y + bh / 2, mx = (x1 + x2) / 2;
    inner = `<path d="M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}" stroke="${D.mu}" stroke-width="2.5" fill="none" marker-end="url(#m-mu)"/>` + inner;
  });
  return sv(w, h, inner);
};

/* ─────────────────────────────── CÂY COMPONENT ─────────────────────────────── */
/**
 * compTree({ root, w, h, bw, bh, legend })
 *   root: { n:'App', s?:'dòng phụ (state/props)', st?:bool (component GIỮ state — chấm xanh lá),
 *           r?:bool (vừa RENDER LẠI — viền vàng + ↻), m?:bool (được memo BỎ QUA — viền đứt xám + ⊘),
 *           c?:màu, w?:rộng riêng, kids:[…] }
 *   Tự xếp: lá chia đều bề ngang, cha nằm giữa các con, mỗi tầng một hàng. legend:true vẽ chú giải ở đáy.
 *   Tên hiện dạng <App /> (chữ mono, tự escape). Dòng phụ ngắn (≤ ~22 ký tự với bw 190).
 */
export const compTree = ({ root, w = 1100, h = 440, bw = 190, bh = 64, legend = false } = {}) => {
  const leaves = (n) => (n.kids?.length ? n.kids.reduce((a, k) => a + leaves(k), 0) : 1);
  const depth = (n) => 1 + (n.kids?.length ? Math.max(...n.kids.map(depth)) : 0);
  const L = leaves(root), Dp = depth(root);
  const top = 14, bottom = legend ? 44 : 10;
  const gy = Dp > 1 ? (h - top - bottom - bh) / (Dp - 1) : 0;
  let edges = '', boxes = '';
  const place = (n, d, x0) => {           // x0 = chỉ số lá bắt đầu
    const cw = w / L, nl = leaves(n);
    const cx = (x0 + nl / 2) * cw, y = top + d * gy;
    let k0 = x0;
    for (const k of n.kids || []) {
      const c = place(k, d + 1, k0); k0 += leaves(k);
      const my = (y + bh + c.y) / 2;
      edges += `<path d="M${cx} ${y + bh} C${cx} ${my} ${c.cx} ${my} ${c.cx} ${c.y - 3}" stroke="${D.mu}" stroke-width="2.2" fill="none" opacity=".8"/>`;
    }
    const W = n.w || bw, x = cx - W / 2;
    const c = n.r ? 'amb' : n.m ? 'dim' : (n.c || 'rx');
    boxes += R(x, y, W, bh, { c, fill: n.r ? '#221c0c' : '#0f182a', r: 11, dash: !!n.m, sw: n.r ? 3.2 : 2.5 }) +
      T(cx + (n.st ? 8 : 0), y + (n.s ? 27 : bh / 2 + 6), `<${n.n} />`, { fs: 17, b: true, mono: true, a: 'middle', c: n.m ? 'mu' : '#e6edf3' }) +
      (n.st ? `<circle cx="${cx - (`<${n.n} />`.length * 10.2) / 2 - 2}" cy="${y + (n.s ? 21 : bh / 2)}" r="6" fill="${D.grn}"/>` : '') +
      (n.s ? T(cx, y + 50, n.s, { fs: 13.5, c: 'mu', a: 'middle' }) : '') +
      (n.r ? `<circle cx="${x + W - 2}" cy="${y + 2}" r="13" fill="${D.amb}"/>` + T(x + W - 2, y + 8, '↻', { fs: 17, c: '#08101e', a: 'middle', b: true }) : '') +
      (n.m ? `<circle cx="${x + W - 2}" cy="${y + 2}" r="13" fill="${D.dim}"/>` + T(x + W - 2, y + 8, '⊘', { fs: 16, c: '#08101e', a: 'middle', b: true }) : '');
    return { cx, y };
  };
  place(root, 0, 0);
  const lg = legend ? `<g transform="translate(${w / 2 - 330},${h - 18})">` +
    `<circle cx="0" cy="-5" r="7" fill="${D.grn}"/>${T(14, 0, 'giữ state', { fs: 15, c: 'mu' })}` +
    `<circle cx="150" cy="-5" r="10" fill="${D.amb}"/>${T(150, 1, '↻', { fs: 13, c: '#08101e', a: 'middle', b: true })}${T(168, 0, 'render lại', { fs: 15, c: 'mu' })}` +
    `<circle cx="320" cy="-5" r="10" fill="${D.dim}"/>${T(320, 1, '⊘', { fs: 13, c: '#08101e', a: 'middle', b: true })}${T(338, 0, 'memo bỏ qua', { fs: 15, c: 'mu' })}` +
    `${R(500, -16, 26, 20, { c: 'rx', r: 5, sw: 2 })}${T(536, 0, 'không đổi', { fs: 15, c: 'mu' })}</g>` : '';
  return sv(w, h, edges + boxes + lg);
};

/* ─────────────────────── LUỒNG STATE ĐỔI → RENDER → COMMIT ─────────────────────── */
/**
 * renderFlow({ steps, w, h, hl, loop })
 *   steps: [{ t:'Trigger', d:'dòng 1\ndòng 2', c? }] — mặc định bốn pha của React:
 *     Trigger (setState) → Render (gọi lại component) → Commit (sửa DOM) → Paint (trình duyệt vẽ).
 *   hl: chỉ số pha tô vàng (đang giảng). loop: chữ trên mũi tên quay về (mặc định 'sự kiện tiếp theo'), false = không vẽ.
 */
export const renderFlow = ({ steps, w = 1120, h = 300, hl = -1, loop = 'sự kiện tiếp theo' } = {}) => {
  const S0 = steps || [
    { t: '① Trigger', d: 'setState(…) được gọi\nhoặc cha render lại' },
    { t: '② Render', d: 'React GỌI LẠI component\n→ JSX mới, chưa đụng DOM' },
    { t: '③ Commit', d: 'so với lần trước,\nchỉ sửa DOM chỗ khác' },
    { t: '④ Paint', d: 'trình duyệt vẽ lại\nmàn hình' },
  ];
  const n = S0.length, gap = 46, bw = (w - 20 - gap * (n - 1)) / n, bh = 150, y = 24;
  let s = '';
  S0.forEach((st, i) => {
    const x = 10 + i * (bw + gap), on = i === hl, c = on ? 'amb' : (st.c || 'rx');
    s += R(x, y, bw, bh, { c, fill: on ? '#221c0c' : '#0f182a', r: 14, sw: on ? 3.4 : 2.5 }) +
      T(x + bw / 2, y + 40, st.t, { fs: 22, b: true, a: 'middle', c: on ? 'amb' : '#e6edf3' }) +
      String(st.d || '').split('\n').map((ln, k) => T(x + bw / 2, y + 78 + k * 24, ln, { fs: 16, c: 'mu', a: 'middle' })).join('');
    if (i < n - 1) s += A(x + bw + 4, y + bh / 2, x + bw + gap - 6, y + bh / 2, { c: 'mu', sw: 3 });
  });
  if (loop !== false) {
    const x1 = 10 + (n - 1) * (bw + gap) + bw / 2, x0 = 10 + bw / 2, yb = y + bh, yl = h - 34;
    s += `<path d="M${x1} ${yb + 4} L${x1} ${yl} L${x0} ${yl} L${x0} ${yb + 10}" stroke="${D.dim}" stroke-width="2.5" fill="none" stroke-dasharray="8 6" marker-end="url(#m-dim)"/>` +
      T((x0 + x1) / 2, yl + 24, loop, { fs: 16, c: 'mu', a: 'middle' });
  }
  return sv(w, h, s);
};

/* ─────────────────────────── ẢNH CHỤP GIAO DIỆN THẬT ─────────────────────────── */
/**
 * anh(deck, ten, { w, h, url, cap }) — nhúng MỘT ảnh chụp giao diện THẬT (Playwright) vào slide, trong khung cửa sổ
 *   trình duyệt giả (thanh địa chỉ hiện `url`). File nguồn: scripts/slides-src/rx-anh/<deck>/<ten> (.jpg/.png, ≤ 150KB —
 *   chụp bằng `--jpg` hoặc thu nhỏ trước). Ảnh được nhúng base64 lúc render nên deck dựng lại được ở máy khác.
 *   w: bề rộng khung (px, mặc định 760). h: cắt chiều cao ảnh (px, tuỳ). cap: chú thích dưới ảnh (HTML).
 */
import fsAnh from 'node:fs';
import { fileURLToPath as f2p } from 'node:url';
const ANH_DIR = new URL('./rx-anh/', import.meta.url);
export const anh = (deck, ten, { w = 760, h, url = 'localhost:5173', cap } = {}) => {
  const fp = f2p(new URL(`${deck}/${ten}`, ANH_DIR));
  if (!fsAnh.existsSync(fp)) throw new Error(`anh(): thiếu file ${fp}`);
  const b64 = fsAnh.readFileSync(fp).toString('base64');
  const mime = ten.endsWith('.png') ? 'image/png' : ten.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
  return `<div style="width:${w}px;margin:0 auto;border:1.5px solid ${D.bd};border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 12px 40px rgba(0,0,0,.45)">` +
    `<div style="display:flex;align-items:center;gap:7px;padding:7px 12px;background:#1b2436;border-bottom:1.5px solid ${D.bd}">` +
    `<i style="width:11px;height:11px;border-radius:50%;background:#ff5f57"></i><i style="width:11px;height:11px;border-radius:50%;background:#febc2e"></i><i style="width:11px;height:11px;border-radius:50%;background:#28c840"></i>` +
    `<span style="margin-left:10px;flex:1;background:#0b1220;border-radius:6px;padding:2px 10px;font:13px 'Liberation Mono','SF Mono',Menlo,monospace;color:${D.mu};text-align:left">${esc(url)}</span></div>` +
    `<div style="${h ? `height:${h}px;` : ''}overflow:hidden"><img src="data:${mime};base64,${b64}" style="display:block;width:100%"/></div></div>` +
    (cap ? `<div style="text-align:center;font-size:15px;color:${D.mu};margin-top:8px">${cap}</div>` : '');
};
