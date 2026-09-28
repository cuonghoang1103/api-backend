/**
 * _lx-chung.mjs — giao diện + thư viện hình vẽ cho các deck của khoá "Linux & Bash"
 * (deck lx-00 … lx-16).
 *
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/lx-03.mjs --out <dir>
 *
 * Dựng TRÊN `_cr-chung.mjs` (khối HTML cơ bản + CSS), `_git-chung.mjs` (term, diagram, CSS terminal) và
 * `_dk-chung.mjs` (host/layers/sv/R/T/A), rồi phủ một lớp theme Linux: nền đen-xanh lá như màn terminal,
 * màu nhấn vàng Tux #f5b700 + xanh terminal #3fb950.
 * ⚠️ KHÔNG sửa `_cr-chung.mjs` / `_git-chung.mjs` / `_dk-chung.mjs` — khoá khác đang dùng; cần hình mới thì
 * thêm vào file NÀY (hoặc vẽ <svg> nội tuyến trong deck).
 *
 * Hình riêng của khoá Linux:
 *   sh()     — KHỐI CODE BASH tô màu kiểu VS Code (Dark+): lệnh, cờ, biến, chuỗi, từ khoá, chú thích,
 *              toán tử ống dẫn/chuyển hướng + ghi chú bên lề từng dòng. Dùng cho script và lệnh nhiều cờ.
 *   perms()  — lưới quyền rwx (user/group/other) của một dòng `ls -l`, có số bát phân.
 *   pipe()   — chuỗi lệnh nối bằng ống dẫn, mỗi chặng ghi dữ liệu chảy qua.
 *   term()   — cửa sổ terminal (dấu nhắc mặc định `~`, chữ 15px).
 *   diagram(), host(), layers(), sv/R/T/A — như khoá Docker.
 *
 * Màu đặt bằng tên: lx (vàng Tux) · grn (xanh terminal) · blu · tea · amb · ora · vio · pnk · red · dim.
 * Khung slide 1280×720, vùng thân (.bd) rộng ~1168px, cao ~520px sau tiêu đề.
 */
import { CSS as CR_CSS, esc, mindmap as crMindmap } from './_cr-chung.mjs';
import { GIT_CSS, G as GG, term as gitTerm, diagram as gitDiagram } from './_git-chung.mjs';
import { D as DK, DK_CSS, layers as dkLayers, host as dkHost } from './_dk-chung.mjs';

export {
  esc, cards, box, steps, table, vs, kpis, flow, tag, quote, two, list, cap, note, code, bars, chart, calendar, seg,
} from './_cr-chung.mjs';
import { tree as crTree } from './_cr-chung.mjs';
/** tree() của CR gắn 🎞 (phim) cho file — khoá Linux dùng 📄. */
export const tree = (src) => crTree(src).replaceAll('🎞 ', '📄 ');

/* ─────────────────────────────── BẢNG MÀU ─────────────────────────────── */
export const D = {
  ...DK,
  bg: '#0a0f0c', p1: '#111812', p2: '#162019', bd: '#2b3a30', tx: '#e6edf3', mu: '#a3b3a8', dim: '#6b7b70',
  lx: '#f5b700', dk: '#f5b700',
};
const ACC = ['lx', 'grn', 'blu', 'vio', 'tea', 'amb', 'pnk', 'ora'];
const col = (k, i = 0) => D[k] || k || D[ACC[i % ACC.length]];
// diagram()/term() của _git-chung đọc màu qua bảng G ⇒ cho G biết thêm 'lx' (không đổi màu nào của Git).
if (!GG.lx) GG.lx = D.lx;

/* ──────────────────── THEME LINUX (phủ lên CSS của CR + Git + Docker) ──────────────────── */
export const LX_CSS = `<style>
:root{--red:${D.red};--lx:${D.lx}}
body{background:${D.bg}}
.slide{background:
 radial-gradient(900px 480px at 100% 0%,rgba(245,183,0,.12),transparent 60%),
 radial-gradient(820px 460px at 0% 100%,rgba(63,185,80,.10),transparent 60%),
 linear-gradient(180deg,#0c130f,#080c09);color:${D.tx}}
.slide .bar{height:6px;background:linear-gradient(90deg,${D.lx},${D.amb} 30%,${D.grn} 65%,${D.tea})}
.slide .hd span:first-child::before{background:${D.lx};box-shadow:0 0 12px ${D.lx};border-radius:2px;transform:none}
.slide h1::after{background:linear-gradient(90deg,${D.lx},${D.grn})}
.slide .bd code{background:#14201a;color:#b5f5c4}
.slide.cover{background:
 radial-gradient(700px 420px at 78% 30%,rgba(245,183,0,.26),transparent 62%),
 radial-gradient(760px 480px at 18% 80%,rgba(63,185,80,.16),transparent 62%),
 #070b08}
.slide.cover h1::after{background:linear-gradient(90deg,${D.lx},${D.grn},${D.tea})}
.c-cov .chip{background:rgba(245,183,0,.14);border-color:rgba(245,183,0,.6)}
.c-cov .chip i{background:${D.lx};box-shadow:0 0 12px ${D.lx};border-radius:2px;transform:none}
.c-mm .ctr{background:linear-gradient(135deg,#c79300,${D.lx});color:#101010;box-shadow:0 10px 40px rgba(245,183,0,.30)}
.g-term{background:#050806;border-color:${D.bd}}
.g-term .tb{background:#111812;border-color:${D.bd}}
/* khối bash tô màu kiểu VS Code Dark+ */
.l-sh{display:grid;grid-template-columns:auto auto 1fr;gap:0 16px;background:#1e1e1e;border:1.5px solid #333;border-radius:12px;padding:10px 16px;text-align:left}
.l-sh .n{font-family:"SF Mono",Menlo,monospace;font-size:calc(var(--fs,16px) - 2px);line-height:1.62;color:#6e7681;text-align:right;user-select:none}
.l-sh .c{font-family:"SF Mono",Menlo,monospace;font-size:var(--fs,16px);line-height:1.55;color:#d4d4d4;white-space:pre}
.l-sh .c .cm{color:#6a9955}.l-sh .c .st{color:#ce9178}.l-sh .c .kw{color:#c586c0}.l-sh .c .bi{color:#dcdcaa}
.l-sh .c .va{color:#9cdcfe}.l-sh .c .fl{color:#569cd6}.l-sh .c .nu{color:#b5cea8}.l-sh .c .op{color:#d7ba7d}.l-sh .c .sb{color:#4ec9b0}
.l-sh .a{font-size:calc(var(--fs,16px) - 1.5px);line-height:1.55;color:${D.lx};white-space:nowrap}
.l-sh .a:not(:empty)::before{content:"← ";color:${D.dim}}
.l-sh.nono{grid-template-columns:auto 1fr}
/* lưới quyền */
.l-pm{display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center;width:100%}
.l-pm .row{display:flex;gap:7px;align-items:flex-start;justify-content:center}
.l-pm>.row{gap:30px}
.l-pm .ch{width:58px;height:66px;display:flex;align-items:center;justify-content:center;border-radius:8px;border:2px solid var(--ac);
 font-family:"SF Mono",Menlo,monospace;font-size:32px;font-weight:800;color:#fff;background:color-mix(in srgb,var(--ac) 18%,#0d130f)}
.l-pm .ch.off{color:${D.dim};border-style:dashed}
.l-pm .gp{display:flex;flex-direction:column;align-items:center;gap:8px}
.l-pm .gp .lb{font-size:17px;font-weight:800;color:var(--ac)}
.l-pm .gp .oc{font-family:"SF Mono",Menlo,monospace;font-size:16px;color:${D.mu}}
.l-pm .raw{font-family:"SF Mono",Menlo,monospace;font-size:17px;color:#cfe8d6;background:#050806;border:1.5px solid ${D.bd};border-radius:10px;padding:10px 18px;font-size:19px}
/* ống dẫn */
.l-pp{display:flex;align-items:stretch;gap:0;flex-wrap:nowrap;justify-content:center}
.l-pp .st{border:2px solid var(--ac);border-radius:12px;background:#0f1712;padding:10px 12px;min-width:140px;text-align:center}
.l-pp .st code{font-family:"SF Mono",Menlo,monospace;font-size:16px;color:#fff;background:none;padding:0;white-space:nowrap}
.l-pp .st .d{display:block;margin-top:6px;font-size:13.5px;color:${D.mu};line-height:1.35}
.l-pp .ar{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 6px;color:${D.lx};font-family:"SF Mono",Menlo,monospace;font-weight:800;font-size:22px}
.l-pp .ar small{font-size:12px;color:${D.dim};font-weight:400;max-width:110px;text-align:center;line-height:1.3}
</style>`;

/** mindmap của CR, hiểu cả tên màu của khoá ('lx', 'grn', …). */
export const mindmap = (center, sub, branches) =>
  crMindmap(center, sub, branches.map((b) => ({ ...b, c: b.c && D[b.c] ? D[b.c] : b.c })));

/* ────────────────────────── KHUNG DECK & BÌA ────────────────────────── */
/** Bọc mảng slide: chèn CSS của CR + Git (terminal) + Docker (host/layers) + lớp Linux vào body từng slide. */
export const S = (slides) => slides.map((s) => ({ ...s, body: CR_CSS + GIT_CSS + DK_CSS + LX_CSS + (s.body || '') }));

/** Slide bìa. chap: 'CHƯƠNG 5' | 'MỤC 0' … */
export const cover = ({ t, sub, chap, meta = 'Linux & Bash · cuongthai.com' }) => ({
  kind: 'cover', t, sub,
  body: `<div class="c-cov">${chap ? `<span class="chip"><i></i>${chap}</span>` : ''}` +
    `${miniPrompt()}<span class="meta">${meta}</span></div>`,
});

/** Hình trang trí trên bìa: một dấu nhắc terminal có con trỏ. */
const miniPrompt = () => `<svg viewBox="0 0 300 64" width="300" height="64">` +
  `<rect x="4" y="6" width="292" height="52" rx="10" fill="#050806" stroke="${D.bd}" stroke-width="2"/>` +
  `<text x="22" y="40" font-family="SF Mono,Menlo,monospace" font-size="22" fill="${D.grn}" font-weight="800">$</text>` +
  `<text x="46" y="40" font-family="SF Mono,Menlo,monospace" font-size="20" fill="#e6edf3">ls -la | grep bash</text>` +
  `<rect x="262" y="22" width="12" height="22" fill="${D.lx}"/></svg>`;

/* ─────────────────────────── TERMINAL & SƠ ĐỒ ─────────────────────────── */
/**
 * term(lines, { title, dir='~', fs=15 }) — dòng bắt đầu `$ ` là lệnh, `! ` đỏ (lỗi), `= ` xanh, `+ ` vàng, `# ` chú thích.
 * Không in tên nhánh git. Lệnh dài thì tách dòng bằng `\` như shell.
 */
export const term = (lines, { title = 'Terminal — bash', dir = '~', fs = 15 } = {}) =>
  gitTerm(lines, { title, branch: '', dir }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.45">`);

/** diagram({nodes, edges, w, h}) — xem chú thích trong _git-chung.mjs. Màu nhận thêm 'lx'. */
export const diagram = gitDiagram;
/** host()/layers() của khoá Docker (tiến trình trong máy, chồng tầng) — màu nhận 'lx'. */
export const host = dkHost;
export const layers = dkLayers;

/* ───────────────────────────── BASH TÔ MÀU ───────────────────────────── */
const KW = new Set(['if', 'then', 'else', 'elif', 'fi', 'for', 'in', 'do', 'done', 'while', 'until', 'case', 'esac',
  'function', 'return', 'local', 'export', 'readonly', 'declare', 'select', 'time', 'break', 'continue', 'exit', 'shift', 'trap', 'set', 'unset', 'source']);

/** Tô màu MỘT dòng bash (chữ thô, chưa escape) theo kiểu VS Code Dark+. */
export const hlBash = (raw) => {
  // 1) tách chú thích: # đứng đầu hoặc sau khoảng trắng, không nằm trong nháy
  let q = null, cut = -1;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (q) { if (c === q && raw[i - 1] !== '\\') q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === '#' && (i === 0 || /\s/.test(raw[i - 1]))) { cut = i; break; }
  }
  const body = cut >= 0 ? raw.slice(0, cut) : raw;
  const tail = cut >= 0 ? `<span class="cm">${esc(raw.slice(cut))}</span>` : '';
  // 2) quét token
  const out = [];
  let i = 0, dauLenh = true;
  while (i < body.length) {
    const r = body.slice(i);
    let m;
    if ((m = r.match(/^\s+/))) { out.push(esc(m[0])); i += m[0].length; continue; }
    if ((m = r.match(/^'[^']*'?/))) { out.push(`<span class="st">${esc(m[0])}</span>`); i += m[0].length; dauLenh = false; continue; }
    if ((m = r.match(/^"(?:\\.|[^"\\])*"?/))) {
      const inner = esc(m[0]).replace(/(\$\{[^}]*\}|\$[A-Za-z_][A-Za-z0-9_]*|\$[0-9@#?*$!-])/g, '<span class="va">$1</span>');
      out.push(`<span class="st">${inner}</span>`); i += m[0].length; dauLenh = false; continue;
    }
    if ((m = r.match(/^(\$\{[^}]*\}|\$\(\(|\$\(|\$[A-Za-z_][A-Za-z0-9_]*|\$[0-9@#?*$!-])/))) {
      out.push(`<span class="va">${esc(m[0])}</span>`); i += m[0].length; dauLenh = m[0].endsWith('('); continue;
    }
    if ((m = r.match(/^(\|\||&&|;;|\|&|\||;|&>>|&>|>>|2>&1|2>|>&2|<<<|<<-?|<\(|>\(|>|<|&)/))) {
      out.push(`<span class="op">${esc(m[0])}</span>`); i += m[0].length; dauLenh = /^(\|\||&&|\||;|\|&|&)$/.test(m[0]) || m[0].endsWith('('); continue;
    }
    if ((m = r.match(/^(\[\[|\]\]|\[|\]|\(\(|\)\)|\(|\)|\{|\})/))) { out.push(esc(m[0])); i += m[0].length; dauLenh = m[0] === '(' || m[0] === '{' || m[0] === '(('; continue; }
    if ((m = r.match(/^-{1,2}[A-Za-z0-9][\w-]*(=[^\s;|&)]*)?/)) && !dauLenh) { out.push(`<span class="fl">${esc(m[0])}</span>`); i += m[0].length; continue; }
    if ((m = r.match(/^[0-9]+(?=[\s;|&)>]|$)/))) { out.push(`<span class="nu">${esc(m[0])}</span>`); i += m[0].length; dauLenh = false; continue; }
    if ((m = r.match(/^[A-Za-z_][A-Za-z0-9_]*(?==)/))) { out.push(`<span class="va">${esc(m[0])}</span>`); i += m[0].length; continue; }
    if ((m = r.match(/^[^\s|&;<>()'"$]+/))) {
      const w = m[0];
      if (KW.has(w)) { out.push(`<span class="kw">${esc(w)}</span>`); dauLenh = ['then', 'else', 'do', 'in', 'time'].includes(w) ? w !== 'in' : false; }
      else if (dauLenh && !w.startsWith('-')) { out.push(`<span class="bi">${esc(w)}</span>`); dauLenh = w === 'sudo' || w === 'exec' || w === 'env' || w === 'xargs' || w === 'nohup' || w === 'timeout'; }
      else out.push(esc(w));
      i += w.length; continue;
    }
    out.push(esc(body[i])); i++;
  }
  return out.join('') + tail;
};

/**
 * sh(lines, { fs=16, so=true, bat=1 }) — khối BASH tô màu kiểu VS Code + (tuỳ) ghi chú bên lề.
 *   lines: [[ 'dòng mã', 'ghi chú bên phải (tuỳ)' ], …] hoặc chuỗi thường. so:false = không đánh số dòng.
 *   Chữ là chuỗi THÔ (hàm tự escape). Ghi chú ngắn (≤ ~40 ký tự) để không tràn.
 */
export const sh = (lines, { fs = 16, so = true, bat = 1 } = {}) =>
  `<div class="l-sh${so ? '' : ' nono'}" style="--fs:${fs}px">${lines.map((x, k) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `${so ? `<div class="n">${bat + k}</div>` : ''}<div class="c">${hlBash(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;

/* ───────────────────────────── LƯỚI QUYỀN ───────────────────────────── */
/**
 * perms('-rwxr-x---', { raw: '-rwxr-x--- 1 an dev 812 script.sh' }) — tách 10 ký tự quyền thành
 * loại file + 3 nhóm (chủ · nhóm · người khác), mỗi nhóm kèm số bát phân. Tự tô: bật = viền đặc, tắt = viền đứt.
 */
export const perms = (mode, { raw } = {}) => {
  const m = String(mode).padEnd(10, '-').slice(0, 10);
  const loai = { '-': 'file thường', d: 'thư mục', l: 'liên kết', c: 'thiết bị ký tự', b: 'thiết bị khối', s: 'socket', p: 'ống có tên' }[m[0]] || m[0];
  const nhom = [['CHỦ (u)', D.lx, m.slice(1, 4)], ['NHÓM (g)', D.grn, m.slice(4, 7)], ['KHÁC (o)', D.blu, m.slice(7, 10)]];
  const bat = (s) => (s[0] === 'r' ? 4 : 0) + (s[1] === 'w' ? 2 : 0) + (/[xst]/.test(s[2]) ? 1 : 0);
  return `<div class="l-pm">${raw ? `<div class="raw">${esc(raw)}</div>` : ''}<div class="row">` +
    `<div class="gp" style="--ac:${D.vio}"><div class="ch">${esc(m[0])}</div><span class="lb">LOẠI</span><span class="oc">${esc(loai)}</span></div>` +
    nhom.map(([lb, c, s]) => `<div class="gp" style="--ac:${c}"><div class="row">${[...s].map((ch) =>
      `<div class="ch${ch === '-' ? ' off' : ''}">${esc(ch)}</div>`).join('')}</div><span class="lb">${lb}</span><span class="oc">${esc(s)} = ${bat(s)}</span></div>`).join('') +
    `</div></div>`;
};

/* ───────────────────────────── ỐNG DẪN ───────────────────────────── */
/**
 * pipe([{ c:'cat access.log', d:'mọi dòng log', ac:'lx' }, …], { mui: ['từng dòng', …] })
 *   c = lệnh (chuỗi thô) · d = dữ liệu ra (HTML được) · mui = chữ nhỏ trên từng mũi tên (tuỳ).
 */
export const pipe = (stages, { mui = [] } = {}) =>
  `<div class="l-pp">${stages.map((s, i) => (i ? `<div class="ar">|${mui[i - 1] ? `<small>${mui[i - 1]}</small>` : ''}</div>` : '') +
    `<div class="st" style="--ac:${col(s.ac, i)}"><code>${esc(s.c)}</code>${s.d ? `<span class="d">${s.d}</span>` : ''}</div>`).join('')}</div>`;

/* ─────────────────────── SVG TỰ VẼ ───────────────────────
 *   sv(w, h, inner) · R(x, y, w, h, {c, fill, dash, r, sw, op}) · T(x, y, chữ, {fs, c, a, b, mono}) · A(x1, y1, x2, y2, {c, dash, sw})
 *   (như khoá Docker — xem cách dùng trong scripts/slides-src/dk-01.mjs)
 */
const MONO = 'SF Mono,Menlo,monospace';
export const sv = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;margin:0 auto"><defs>` +
  ['lx', 'blu', 'tea', 'grn', 'amb', 'ora', 'vio', 'pnk', 'red', 'mu', 'dim'].map((k) => `<marker id="m-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${D[k]}"/></marker>`).join('') +
  `</defs>${inner}</svg>`;
export const R = (x, y, w, h, { c = 'lx', fill = '#111812', dash = false, r = 12, sw = 2.5, op = 1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${D[c] || c}" stroke-width="${sw}"${dash ? ' stroke-dasharray="9 7"' : ''} opacity="${op}"/>`;
export const T = (x, y, s, { fs = 17, c = '#e6edf3', a = 'start', b = false, mono = false } = {}) =>
  `<text x="${x}" y="${y}" font-size="${fs}" fill="${D[c] || c}" text-anchor="${a}"${b ? ' font-weight="800"' : ''}${mono ? ` font-family="${MONO}"` : ''}>${esc(s)}</text>`;
export const A = (x1, y1, x2, y2, { c = 'lx', dash = false, sw = 3 } = {}) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${D[c] || c}" stroke-width="${sw}" fill="none"${dash ? ' stroke-dasharray="7 6"' : ''} marker-end="url(#m-${D[c] ? c : 'lx'})"/>`;
