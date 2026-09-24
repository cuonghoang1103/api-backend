/**
 * _dk-chung.mjs — giao diện + thư viện hình vẽ cho các deck của khoá "Docker"
 * (deck dk-00 … dk-16).
 *
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/dk-03.mjs --out <dir>
 *
 * Dựng TRÊN `_cr-chung.mjs` (khối HTML cơ bản + CSS) và `_git-chung.mjs` (term, diagram,
 * conflict và CSS của terminal), rồi phủ một lớp theme Docker: nền xanh đêm, màu nhấn
 * xanh Docker #2496ED. ⚠️ KHÔNG sửa `_cr-chung.mjs` / `_git-chung.mjs` — hai khoá khác
 * đang dùng; cần hình mới thì thêm vào file NÀY (hoặc vẽ <svg> nội tuyến trong deck).
 *
 * Hình riêng của Docker (SVG/HTML thuần):
 *   layers()  — chồng tầng của một image (+ tầng ghi được của container, + mount)
 *   host()    — một MÁY CHỦ chứa các container, bên ngoài có volume/mạng/cổng
 *   term()    — cửa sổ terminal (của _git-chung; dir mặc định ~/thu-docker, không nhánh)
 *   diagram() — hộp + mũi tên tự do (của _git-chung)
 *   yaml()    — khối compose/Dockerfile có tô màu + ghi chú bên lề từng dòng
 *
 * Màu đặt bằng tên: dk (xanh Docker) · blu · tea · grn · amb · ora · vio · pnk · red · dim.
 * Khung slide 1280×720, vùng thân (.bd) rộng ~1168px, cao ~520px sau tiêu đề.
 * Chữ đơn cách rộng ~0,6×cỡ chữ; chữ thường (SF Pro) trung bình ~0,52×cỡ chữ.
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
  dk: '#2496ed', blu: '#58a6ff', tea: '#2dd4bf', grn: '#3fb950', amb: '#ffc233', ora: '#ff8a3d', vio: '#bc8cff', pnk: '#f778ba', red: '#ff5c6c',
};
const ACC = ['dk', 'tea', 'grn', 'vio', 'amb', 'blu', 'pnk', 'ora'];
const col = (k, i = 0) => D[k] || k || D[ACC[i % ACC.length]];
// diagram()/term() của _git-chung đọc màu qua bảng G của nó ⇒ cho G biết thêm 'dk' (không đổi màu nào của Git).
if (!GG.dk) GG.dk = D.dk;

/* ──────────────────── THEME DOCKER (phủ lên CSS của CR + Git) ──────────────────── */
export const DK_CSS = `<style>
:root{--red:${D.red};--dk:${D.dk}}
body{background:${D.bg}}
.slide{background:
 radial-gradient(900px 480px at 100% 0%,rgba(36,150,237,.16),transparent 60%),
 radial-gradient(820px 460px at 0% 100%,rgba(45,212,191,.08),transparent 60%),
 linear-gradient(180deg,#0d1526,#0a101c);color:${D.tx}}
.slide .bar{height:6px;background:linear-gradient(90deg,${D.dk},${D.blu} 35%,${D.tea} 65%,${D.grn})}
.slide .hd span:first-child::before{background:${D.dk};box-shadow:0 0 12px ${D.dk};border-radius:3px;transform:none}
.slide h1::after{background:linear-gradient(90deg,${D.dk},${D.tea})}
.slide .bd code{background:#16233a;color:#8fd0ff}
.slide.cover{background:
 radial-gradient(700px 420px at 78% 30%,rgba(36,150,237,.34),transparent 62%),
 radial-gradient(760px 480px at 18% 80%,rgba(45,212,191,.16),transparent 62%),
 #081020}
.slide.cover h1::after{background:linear-gradient(90deg,${D.dk},${D.tea},${D.grn})}
.c-cov .chip{background:rgba(36,150,237,.16);border-color:rgba(36,150,237,.6)}
.c-cov .chip i{background:${D.dk};box-shadow:0 0 12px ${D.dk};border-radius:2px;transform:none}
.c-mm .ctr{background:linear-gradient(135deg,${D.dk},#1b6fc0);box-shadow:0 10px 40px rgba(36,150,237,.35)}
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
</style>`;

/** mindmap của CR, hiểu cả tên màu của Docker ('dk', 'tea', …). */
export const mindmap = (center, sub, branches) =>
  crMindmap(center, sub, branches.map((b) => ({ ...b, c: b.c && D[b.c] ? D[b.c] : b.c })));

/* ────────────────────────── KHUNG DECK & BÌA ────────────────────────── */
/** Bọc mảng slide: chèn CSS của CR + Git (terminal) + lớp Docker vào body từng slide. */
export const S = (slides) => slides.map((s) => ({ ...s, body: CR_CSS + GIT_CSS + DK_CSS + (s.body || '') }));

/** Slide bìa. chap: 'CHƯƠNG 5' | 'MỤC 0' … */
export const cover = ({ t, sub, chap, meta = 'Docker · cuongthai.com' }) => ({
  kind: 'cover', t, sub,
  body: `<div class="c-cov">${chap ? `<span class="chip"><i></i>${chap}</span>` : ''}` +
    `${miniStack()}<span class="meta">${meta}</span></div>`,
});

/** Hình trang trí trên bìa: chồng container kiểu thùng hàng. */
const miniStack = () => {
  const c = [D.dk, D.tea, D.blu, D.dk, D.grn, D.dk];
  const box = (x, y, k) => `<rect x="${x}" y="${y}" width="58" height="22" rx="4" fill="#0b1322" stroke="${c[k]}" stroke-width="3"/>` +
    [14, 29, 44].map((dx) => `<line x1="${x + dx}" y1="${y + 5}" x2="${x + dx}" y2="${y + 17}" stroke="${c[k]}" stroke-width="2" opacity=".7"/>`).join('');
  return `<svg viewBox="0 0 300 64" width="300" height="64">` +
    box(24, 36, 0) + box(88, 36, 1) + box(152, 36, 2) + box(216, 36, 5) + box(56, 8, 3) + box(120, 8, 4) + box(184, 8, 1) +
    `</svg>`;
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
const MONO = 'SF Mono,Menlo,monospace';
export const sv = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;margin:0 auto"><defs>` +
  ['dk', 'blu', 'tea', 'grn', 'amb', 'ora', 'vio', 'pnk', 'red', 'mu', 'dim'].map((k) => `<marker id="m-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${D[k]}"/></marker>`).join('') +
  `</defs>${inner}</svg>`;
export const R = (x, y, w, h, { c = 'dk', fill = '#111a2b', dash = false, r = 12, sw = 2.5, op = 1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${D[c] || c}" stroke-width="${sw}"${dash ? ' stroke-dasharray="9 7"' : ''} opacity="${op}"/>`;
export const T = (x, y, s, { fs = 17, c = '#e6edf3', a = 'start', b = false, mono = false } = {}) =>
  `<text x="${x}" y="${y}" font-size="${fs}" fill="${D[c] || c}" text-anchor="${a}"${b ? ' font-weight="800"' : ''}${mono ? ` font-family="${MONO}"` : ''}>${esc(s)}</text>`;
export const A = (x1, y1, x2, y2, { c = 'dk', dash = false, sw = 3 } = {}) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${D[c] || c}" stroke-width="${sw}" fill="none"${dash ? ' stroke-dasharray="7 6"' : ''} marker-end="url(#m-${D[c] ? c : 'dk'})"/>`;
