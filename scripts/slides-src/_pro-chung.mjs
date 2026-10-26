/**
 * _pro-chung.mjs — khuôn slide PRO192 (Java OOP) tự dựng: CHÉP NGUYÊN `_pg-chung.mjs` (khuôn chuẩn chủ kênh chốt 25/10/2026),
 * chỉ đổi GIÁ TRỊ MẶC ĐỊNH của môn: khoa 'PRO192', duong 'academy/courses/object-oriented-programming', bieuTuong '☕',
 * khau 'from zero to the PE'. Diện mạo giữ y hệt (nền trắng, tiêu đề xám căn giữa, dải chân cam–nâu, logo CuongThai.com,
 * KHÔNG logo/tên FPT). Không sửa `_pg-chung.mjs` / `_render-slides.mjs`.
 *
 *   import { lamDeck, sql, psql, sh, two, box, steps, cards, kw, vsd, tbl, flow, c } from './_pro-chung.mjs';
 *   export const deck = { key: 'lab1', code: 'PRO192 Lab 1', title: '…', sub: '…' };
 *   export const slides = lamDeck({ chuong: 'Lab 1 · CT Library', bai: '' }, [ { cover: true, t: '…', sub: '…' }, … ]);
 *
 * Java: sql(src, { lang: 'java' }) · output thật: psql(text, { title: 'output' }) · terminal: sh(text).
 * Vùng thân ≈ 1112 × 520 px; chữ thân 24px; ≤ ~14 dòng mã/slide; slide ít chữ ⇒ { to: true } / { giua: true }.
 * MỞ ẢNH RA NHÌN sau khi render. Quy trình: ~/Documents/video-bai-giang/_PROMPT-AGENT-PRO.md §4.
 */
import hljs from 'highlight.js';

export const CSS = `<style>
.pg{position:fixed;inset:0;z-index:50;background:#fff;font-family:Arial,"Helvetica Neue","Arial Unicode MS",sans-serif;
  color:#404040;display:flex;flex-direction:column}
.pg .logo{position:absolute;top:12px;left:18px;display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;letter-spacing:.2px}
.pg .logo .o{display:flex;gap:3px}.pg .logo .o i{width:9px;height:20px;border-radius:2px;display:block}
.pg .logo .t1{color:#e06d10}.pg .logo .t2{color:#336791}
.pg .bai{position:absolute;top:14px;right:22px;font-size:14px;color:#8a8a8a;font-weight:700;letter-spacing:.4px}
.pg h2{margin:50px 110px 0;font-size:40px;line-height:1.15;font-weight:700;color:#404040;text-align:center}
.pg hr{border:0;border-top:1.5px solid #bfbfbf;margin:12px 70px 0}
.pg .nd{flex:1;padding:22px 84px 10px;font-size:24px;line-height:1.42;display:flex;flex-direction:column;
  justify-content:flex-start;gap:12px;overflow:hidden}
.pg .nd.giua{justify-content:center}
.pg .nd.to{font-size:28px;line-height:1.45;gap:16px}.pg .nd.to li{margin-bottom:4px}.pg .nd.to .o{font-size:24px}.pg .nd.to .card p{font-size:22px}.pg .nd.to .card .h{font-size:24px}.pg .nd.to .steps>div{font-size:26px}
.pg .nd ul,.pg .nd ol{padding-left:30px;display:flex;flex-direction:column;gap:7px;margin:0}
.pg .nd li::marker{color:#e08a1e;font-weight:700}
.pg .nd b,.pg .nd strong{color:#262626}
.pg .nd .do{color:#d42020;font-weight:700}.pg .nd .xanh{color:#1f7a45;font-weight:700}.pg .nd .lam{color:#336791;font-weight:700}
.pg .nd .nho{font-size:19px;color:#666}
.pg .nd code.i{font-family:"SF Mono",Menlo,Consolas,monospace;font-size:.88em;background:#f3f0ea;border:1px solid #e3dccf;border-radius:5px;padding:0 5px;color:#7a3d12}
.pg .nd table.t{border-collapse:collapse;font-size:19px;width:100%}
.pg .nd table.t th,.pg .nd table.t td{border:1.5px solid #bfbfbf;padding:6px 9px;text-align:left;vertical-align:top}
.pg .nd table.t th{background:#e08a1e;color:#fff}
.pg .nd table.t tr:nth-child(even) td{background:#fbe9dc}
.pg .nd .hai{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}
.pg .nd .hai.r37{grid-template-columns:3fr 7fr}.pg .nd .hai.r73{grid-template-columns:7fr 3fr}
.pg .nd .hai.r46{grid-template-columns:4fr 6fr}.pg .nd .hai.r64{grid-template-columns:6fr 4fr}
.pg .nd .ba{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;align-items:start}
.pg .nd .o{border-left:6px solid #e08a1e;background:#fff7ef;padding:9px 15px;border-radius:0 8px 8px 0;font-size:21px}
.pg .nd .o.ok{border-color:#2f7d4f;background:#f1f9f4}.pg .nd .o.bad{border-color:#c0392b;background:#fdf0ee}
.pg .nd .o.info{border-color:#336791;background:#eef4fa}
.pg .nd .o .h{font-weight:800;font-size:17px;letter-spacing:.5px;text-transform:uppercase;margin-bottom:3px;color:#9a4a12}
.pg .nd .o.ok .h{color:#1f6b40}.pg .nd .o.bad .h{color:#a52a1d}.pg .nd .o.info .h{color:#245077}
.pg .nd .card{text-align:left;border:1.5px solid #e3c9ae;border-radius:10px;padding:12px 14px;background:#fffaf5}
.pg .nd .card .h{font-weight:800;color:#b85a2b;font-size:21px;margin-bottom:5px}
.pg .nd .card p{font-size:19px;line-height:1.38;margin:0}
.pg .nd .card b,.pg .nd .card strong{display:inline;font-size:inherit;color:#262626;margin:0}
.pg .nd .steps{display:flex;flex-direction:column;gap:9px}
.pg .nd .steps>div{display:flex;gap:12px;align-items:flex-start;font-size:22px}
.pg .nd .steps .n{flex:0 0 32px;height:32px;border-radius:50%;background:#e08a1e;color:#fff;font-weight:800;font-size:18px;
  display:flex;align-items:center;justify-content:center;margin-top:1px}
.pg .nd .kw{display:inline-flex;align-items:baseline;gap:6px;background:#eef4fa;border:1.5px solid #c9dbec;border-radius:8px;padding:2px 9px}
.pg .nd .kw b{color:#245077}.pg .nd .kw span{font-size:.82em;color:#555}
.pg .nd .cap{font-size:16px;color:#777;margin-top:4px}
/* khối mã VS Code Dark+ */
.pg .vs{background:#1e1e1e;border-radius:9px;padding:11px 14px;font-family:"SF Mono",Menlo,Consolas,monospace;
  font-size:17px;line-height:1.48;color:#d4d4d4;text-align:left;overflow:hidden;white-space:pre;margin:0}
.pg .vs.sm{font-size:15px;line-height:1.42;padding:9px 12px}
.pg .vs .ln{display:block}.pg .vs .ln.hl{background:rgba(255,213,79,.17);box-shadow:inset 4px 0 0 #ffd54f;margin:0 -14px;padding:0 14px}
.pg .vs .hljs-keyword{color:#569cd6}.pg .vs .hljs-string{color:#ce9178}.pg .vs .hljs-number{color:#b5cea8}
.pg .vs .hljs-comment{color:#6a9955;font-style:italic}.pg .vs .hljs-title,.pg .vs .hljs-built_in{color:#dcdcaa}
.pg .vs .hljs-type{color:#4ec9b0}.pg .vs .hljs-literal{color:#569cd6}.pg .vs .hljs-variable,.pg .vs .hljs-params,.pg .vs .hljs-attr{color:#9cdcfe}
.pg .vs .hljs-operator,.pg .vs .hljs-punctuation{color:#d4d4d4}.pg .vs .hljs-meta{color:#c586c0}.pg .vs .hljs-symbol{color:#9cdcfe}
/* terminal psql */
.pg .term{background:#0f1720;border-radius:9px;overflow:hidden;font-family:"SF Mono",Menlo,Consolas,monospace;margin:0}
.pg .term .tb{background:#24303d;color:#a9b7c6;font-size:13px;padding:5px 12px;display:flex;gap:7px;align-items:center}
.pg .term .tb i{width:10px;height:10px;border-radius:50%;display:inline-block}
.pg .term pre{margin:0;padding:10px 14px;font-size:16px;line-height:1.42;color:#d6dde6;white-space:pre;overflow:hidden;font-family:inherit}
.pg .term.sm pre{font-size:14px;line-height:1.38}
.pg .term .pr{color:#7ee787}.pg .term .er{color:#ff7b72;font-weight:700}.pg .term .nt{color:#f2cc60}.pg .term .dim{color:#7d8b99}
.pg .term .pl{display:inline}.pg .term .hl{background:rgba(255,213,79,.22)}
/* bảng dữ liệu */
.pg .nd table.d{border-collapse:collapse;font-family:"SF Mono",Menlo,Consolas,monospace;font-size:17px}
.pg .nd table.d th{background:#336791;color:#fff;padding:5px 10px;border:1.5px solid #2a567a;text-align:left}
.pg .nd table.d td{padding:4px 10px;border:1.5px solid #c9d5e2;background:#fff}
.pg .nd table.d tr.hl td{background:#fff3c4}.pg .nd table.d tr.mo td{opacity:.35}.pg .nd table.d tr.bo td{background:#fde2e0;text-decoration:line-through}
.pg .nd table.d td.null{color:#9a9a9a;font-style:italic}.pg .nd table.d td.c{background:#fff3c4;font-weight:700}
.pg .nd .tcap{font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#336791;margin-bottom:3px}
/* sai / đúng */
.pg .nd .vsd{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.pg .nd .vsd>div{border-radius:10px;padding:10px 12px}
.pg .nd .vsd .sai{background:#fdf0ee;border:2px solid #e3a59c}.pg .nd .vsd .dung{background:#f1f9f4;border:2px solid #9fd0b2}
.pg .nd .vsd .h{font-weight:800;font-size:19px;margin-bottom:6px}.pg .nd .vsd .sai .h{color:#b0281a}.pg .nd .vsd .dung .h{color:#1f6b40}
/* chân */
.pg .chan{height:58px;background:#b85a2b;border-top:9px solid #e08a1e;display:flex;align-items:center;
  justify-content:center;position:relative;color:#fff;font-size:14px;letter-spacing:.6px;text-transform:uppercase}
.pg .chan .so{position:absolute;right:40px;font-size:16px;letter-spacing:0}
.pg .chan .tr{position:absolute;left:40px;font-size:13px;letter-spacing:.4px;text-transform:none;opacity:.9}
/* bìa */
.pg.bia{justify-content:center}
.pg.bia .khoi{margin:0 120px;display:flex;flex-direction:column;gap:16px}
.pg.bia .nhan{align-self:flex-start;background:#e08a1e;color:#fff;font-weight:800;font-size:18px;padding:5px 14px;border-radius:4px;letter-spacing:.6px}
.pg.bia h1{font-size:58px;line-height:1.1;color:#404040;font-weight:800;margin:0;letter-spacing:0}.pg.bia h1::after{display:none}
.pg.bia .phu{font-size:27px;color:#666;line-height:1.35}
.pg.bia .gach{width:140px;height:6px;background:#e08a1e;border-radius:3px}
.pg.bia .voi{position:absolute;right:110px;top:170px;font-size:150px;opacity:.95}
.pg.bia .dai{position:absolute;bottom:0;left:0;right:0;height:62px;background:#b85a2b;border-top:9px solid #e08a1e;
  display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;letter-spacing:.8px;text-transform:uppercase}
</style>`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export { esc };

const LOGO = `<span class="logo"><span class="o"><i style="background:#336791"></i><i style="background:#e08a1e"></i><i style="background:#2f9d58"></i></span>` +
  `<span><span class="t1">CuongThai</span><span class="t2">.com</span></span></span>`;

/**
 * Khối SQL tô màu Dark+ (highlight.js 'pgsql' — hiểu cả PL/pgSQL).
 * opts: { sm, hl: [số dòng 1-based cần tô], lang: 'pgsql'|'sql'|'bash'|'javascript'|'typescript'|'json'|'java'|'prisma→typescript' }
 */
export function sql(src, opts = {}) {
  const { sm = false, hl = [], lang = 'pgsql' } = opts;
  const html = hljs.highlight(src.replace(/\n$/, ''), { language: lang }).value;
  // tách theo dòng nhưng giữ thẻ span mở xuyên dòng
  const out = []; let open = [];
  for (const line of html.split('\n')) {
    const pre = open.join('');
    const tags = line.match(/<span[^>]*>|<\/span>/g) || [];
    for (const t of tags) t === '</span>' ? open.pop() : open.push(t);
    out.push(pre + line + '</span>'.repeat(open.length));
  }
  return `<pre class="vs${sm ? ' sm' : ''}">` + out.map((l, i) => `<span class="ln${hl.includes(i + 1) ? ' hl' : ''}">${l || ' '}</span>`).join('') + `</pre>`;
}

/**
 * Cửa sổ psql/terminal. text: chép NGUYÊN output thật (psql 17). Tự tô: dòng dấu nhắc `xxx=#`/`$ ` xanh, ERROR/FATAL đỏ,
 * NOTICE/WARNING/HINT/DETAIL vàng. opts: { title='psql 17 · pgcourse', sm, hl: [dòng cần tô nền] }
 */
export function psql(text, opts = {}) {
  const { title = 'output', sm = false, hl = [] } = opts;
  const lines = String(text).replace(/\n$/, '').split('\n').map((l, i) => {
    let h = esc(l);
    if (/^\S*[=\-]#\s|^\S*[=\-]>\s|^\$ /.test(l)) h = h.replace(/^(\S*[=\-][#>]\s|\$ )/, '<span class="pr">$1</span>');
    else if (/^(ERROR|FATAL|PANIC)/.test(l)) h = `<span class="er">${h}</span>`;
    else if (/^(NOTICE|WARNING|HINT|DETAIL|INFO|LINE \d)/.test(l)) h = `<span class="nt">${h}</span>`;
    else if (/^\(\d+ rows?\)$|^(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|BEGIN|COMMIT|ROLLBACK|SET|SELECT \d)/.test(l)) h = `<span class="dim">${h}</span>`;
    return `<span class="pl${hl.includes(i + 1) ? ' hl' : ''}">${h || ' '}</span>`;
  });
  return `<div class="term${sm ? ' sm' : ''}"><div class="tb"><i style="background:#ff5f56"></i><i style="background:#ffbd2e"></i><i style="background:#27c93f"></i>&nbsp;${esc(title)}</div><pre>${lines.join('\n')}</pre></div>`;
}

/** Lệnh shell (bash) trong terminal. */
export const sh = (text, opts = {}) => psql(text, { title: 'terminal', ...opts });

/** SQL rồi output thật bên dưới (hoặc cạnh nhau: opts.ngang). */
export function run(src, out, opts = {}) {
  const { ngang = false, sm = true, hl = [], hlOut = [], title } = opts;
  const a = sql(src, { sm, hl }), b = psql(out, { sm, hl: hlOut, title });
  return ngang ? `<div class="hai">${a}${b}</div>` : `${a}${b}`;
}

/**
 * Bảng dữ liệu (kết quả/minh hoạ). rows: mảng mảng; null ⇒ ô NULL nghiêng xám.
 * opts: { cap, hl: [chỉ số dòng 0-based tô vàng], mo: [...mờ], bo: [...gạch bỏ], o: [[r,c]...] ô tô, w }
 */
export function tbl(cols, rows, opts = {}) {
  const { cap = '', hl = [], mo = [], bo = [], o = [], w } = opts;
  const isO = (r, c) => o.some(([a, b]) => a === r && b === c);
  const body = rows.map((r, i) => `<tr class="${hl.includes(i) ? 'hl' : mo.includes(i) ? 'mo' : bo.includes(i) ? 'bo' : ''}">` +
    r.map((v, j) => v === null ? `<td class="null${isO(i, j) ? ' c' : ''}">NULL</td>` : `<td${isO(i, j) ? ' class="c"' : ''}>${v}</td>`).join('') + '</tr>').join('');
  return `<div${w ? ` style="width:${w}px"` : ''}>${cap ? `<div class="tcap">${cap}</div>` : ''}<table class="d"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${body}</table></div>`;
}

export const two = (a, b, ti = '') => `<div class="hai ${ti}">${a}${b}</div>`;
export const three = (a, b, c) => `<div class="ba">${a}${b}${c}</div>`;
/** Hộp ghi chú. kind: '' (cam) | 'xanh' (đúng/mẹo) | 'do2' (sai/cảnh báo) | 'lam' (thông tin). */
const KIND = { xanh: 'ok', do2: 'bad', lam: 'info', ok: 'ok', bad: 'bad', info: 'info' };
export const box = (h, html, kind = '') => `<div class="o ${KIND[kind] || ''}">${h ? `<div class="h">${h}</div>` : ''}${html}</div>`;
export const card = (h, p) => `<div class="card"><div class="h">${h}</div><p>${p}</p></div>`;
export const cards = (items, cot = 3) => `<div style="display:grid;grid-template-columns:repeat(${cot},1fr);gap:14px">${items.map(([h, p]) => card(h, p)).join('')}</div>`;
export const steps = (items) => `<div class="steps">${items.map((t, i) => `<div><span class="n">${i + 1}</span><span>${t}</span></div>`).join('')}</div>`;
/** Thuật ngữ: kw('MVCC', 'Multi-Version Concurrency Control') */
export const kw = (t, giai = '') => `<span class="kw"><b>${t}</b>${giai ? `<span>${giai}</span>` : ''}</span>`;
/** Sai ✗ / Đúng ✓ hai cột. */
export const vsd = (sai, dung, hs = '✗ Wrong', hd = '✓ Right') => `<div class="vsd"><div class="sai"><div class="h">${hs}</div>${sai}</div><div class="dung"><div class="h">${hd}</div>${dung}</div></div>`;
/** Mã nội dòng. */
export const c = (t) => `<code class="i">${esc(t)}</code>`;
export const cap = (t) => `<div class="cap">${t}</div>`;

/**
 * Sơ đồ luồng ngang bằng SVG: các hộp nối mũi tên. items: [{ t: 'Parser', s?: 'checks syntax', mau?: '#336791' }]
 */
export function flow(items, opts = {}) {
  const { w = 1110, h = 150, fs = 20 } = opts;
  const n = items.length, gap = 46, bw = (w - gap * (n - 1)) / n;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">` +
    `<defs><marker id="mt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
  items.forEach((it, i) => {
    const x = i * (bw + gap), m = it.mau || '#336791';
    s += `<rect x="${x + 2}" y="${h / 2 - 48}" width="${bw - 4}" height="96" rx="12" fill="${m}14" stroke="${m}" stroke-width="2.5"/>`;
    s += `<text x="${x + bw / 2}" y="${h / 2 - (it.s ? 6 : -7)}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${m}">${it.t}</text>`;
    if (it.s) s += `<text x="${x + bw / 2}" y="${h / 2 + 22}" text-anchor="middle" font-size="${fs - 5}" fill="#555">${it.s}</text>`;
    if (i < n - 1) s += `<line x1="${x + bw + 2}" y1="${h / 2}" x2="${x + bw + gap - 4}" y2="${h / 2}" stroke="#b85a2b" stroke-width="3" marker-end="url(#mt)"/>`;
  });
  return s + '</svg>';
}

/**
 * Dòng thời gian HAI phiên (transaction) chen nhau. rows: [[t, 'SQL phiên A' | '', 'SQL phiên B' | '', ghi chú?, mau?]]
 * Dùng cho Ch11 (isolation/lock/deadlock) — bảng 3 cột có cột thời gian.
 */
export function hai_phien(rows, opts = {}) {
  const { a = 'Session A', b = 'Session B', fs = 16 } = opts;
  const tr = rows.map(([t, x, y, ghi, mau]) => `<tr${mau ? ` style="background:${mau}"` : ''}><td style="color:#888;font-weight:700;text-align:center">${t}</td>` +
    `<td><code style="font-size:${fs}px">${x ? esc(x) : ''}</code></td><td><code style="font-size:${fs}px">${y ? esc(y) : ''}</code></td>` +
    `<td style="font-size:${fs}px;color:#555">${ghi || ''}</td></tr>`).join('');
  return `<table class="t" style="font-size:${fs}px"><tr><th style="width:60px">t</th><th>${a}</th><th>${b}</th><th style="width:300px">what happens</th></tr>${tr}</table>`;
}

/** Một slide. */
export function pg({ t, body = '', topic, bai = '', page, cover = false, sub = '', nhan = '', giua = false, to = false,
  khoa = 'PRO192', duong = 'academy/courses/object-oriented-programming', bieuTuong = '☕', khau = 'from zero to the PE' }) {
  if (cover) {
    return `${CSS}<div class="pg bia">${LOGO}<div class="khoi">${nhan ? `<span class="nhan">${nhan}</span>` : ''}` +
      `<h1>${t}</h1><div class="gach"></div>${sub ? `<div class="phu">${sub}</div>` : ''}</div><div class="voi">${bieuTuong}</div>` +
      `<div class="dai">${khoa} — ${khau} · cuongthai.com</div></div>`;
  }
  return `${CSS}<div class="pg">${LOGO}${bai ? `<span class="bai">${bai}</span>` : ''}<h2>${t}</h2><hr>` +
    `<div class="nd${giua ? ' giua' : ''}${to ? ' to' : ''}">${body}</div><div class="chan"><span class="tr">cuongthai.com/${duong}</span>${topic}<span class="so">${page}</span></div></div>`;
}

/**
 * Dựng mảng slides cho `_render-slides.mjs`, tự đánh số trang.
 * meta: { chuong: 'Chapter 9 — Indexes', bai: '9.1' }  (chuong in ở dải chân, bai ở góc phải trên + nhãn bìa)
 * Mặc định = PRO192 (đổi được như _pg-chung):
 *   khoa: 'Data Structures' · duong: 'academy/csd201' · bieuTuong: '🌳' · khau: 'from zero to the final exam'
 */
export function lamDeck(meta, items) {
  const { khoa = 'PRO192', duong, bieuTuong, khau } = meta;
  const topic = `${khoa} · ${meta.chuong}`;
  const baiNhan = meta.bai ? `Lesson ${meta.bai}` : '';
  return items.map((it, i) => ({
    t: '', kind: undefined,
    body: pg({ khoa, ...(duong && { duong }), ...(bieuTuong && { bieuTuong }), ...(khau && { khau }), ...it, topic, bai: baiNhan, page: i + 1, nhan: it.nhan ?? `${meta.chuong}${meta.bai ? ` · Lesson ${meta.bai}` : ''}` }),
  }));
}
