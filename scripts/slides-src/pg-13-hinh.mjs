/**
 * pg-13-hinh.mjs — hình SVG dùng chung cho Chương 13 — JSONB, GIN, full-text search, trigram (deck pg-13-1…4). Không phải deck. (agent c13, 26/10/2026)
 * Số liệu trong hình lấy từ output THẬT PostgreSQL 17.11 (video-bai-giang/src/khung/pg/that/pg-13-*.out.txt).
 * Chữ SVG: rộng ≈ 0,602 × cỡ chữ / ký tự (mono), ≈ 0,55 (Arial) — đặt nhãn bằng công thức. Phần tử video cần chú thích có data-k.
 */
import { sql, psql } from './_pg-chung.mjs';
import { O } from './pg-13-out.mjs';

/* ══════════════ helper chung 4 deck ══════════════ */
const dai = (t) => Math.max(...String(t).split('\n').map((l) => l.length));
const hlm = (t, o) => { const ls = String(t).split('\n'); const hl = [...(o.hl ?? [])]; for (const m of o.hm ?? []) ls.forEach((l, i) => { if (l.includes(m) && !hl.includes(i + 1)) hl.push(i + 1); }); return hl; };
/** psql thu phóng cho vừa bề rộng w (px trong vùng thân 1112). hm = tô các dòng chứa chuỗi. */
export const P = (t, o = {}) => {
  if (o.wrap) return `<div class="c13w" style="zoom:${o.z ?? 0.9}"><style>.c13w .term pre{white-space:pre-wrap;word-break:break-all}</style>${psql(t, { sm: true, ...o, hl: hlm(t, o) })}</div>`;
  const z = Math.min(o.max ?? 1.1, (o.w ?? 1100) / (dai(t) * 0.602 * 14 + 32)); return `<div style="zoom:${z.toFixed(3)}">${psql(t, { sm: true, ...o, hl: hlm(t, o) })}</div>`; };
export const S = (src, o = {}) => { const z = Math.min(o.max ?? 1.15, (o.w ?? 1100) / (dai(src) * 0.602 * 15 + 30)); return `<div style="zoom:${z.toFixed(3)}">${sql(src, { sm: true, ...o })}</div>`; };
export const p = (t, fs = 21) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
/**
 * Câu lệnh + output thật như trong psql (dòng tiếp có dấu nhắc db-#; tx '*' = trong giao dịch, '!' = giao dịch hỏng).
 * o.q = cách XUỐNG DÒNG khác cho dễ đọc — chỉ được khác khoảng trắng so với câu thật (kiểm, lệch là ném lỗi).
 */
export const L = (k, dau, o = {}) => {
  const x = O(k, dau, o.lan ?? 0);
  let s = x.sql;
  if (o.q) { if (o.q.replace(/\s+/g, '') !== s.replace(/\s+/g, '')) throw new Error(`pg-13: o.q lệch câu thật — ${dau}`); s = o.q; }
  const db = o.db ?? 'pgcourse', tx = o.tx ?? '';
  const q = s.split('\n').map((l, i) => (i ? `${db}-${tx}# ` : `${db}=${tx}# `) + l).join('\n');
  const out = o.cat ? x.out.split('\n').slice(...o.cat).join('\n') : x.out;
  return o.chiOut ? out : `${q}\n${out}`;
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7a5a9a', XAM = '#9a9a9a';
const head = (w, h, id, mau = NAU) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${mau}"/></marker></defs>`;
const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}"${o.a ? ` text-anchor="${o.a}"` : ''} font-size="${o.fs ?? 20}"${o.b ? ' font-weight="800"' : ''} fill="${o.c ?? '#333'}"${o.m ? ` font-family="${MONO}"` : ''}${o.k ? ` data-k="${o.k}"` : ''}${o.i ? ' font-style="italic"' : ''}>${esc(t)}</text>`;
const R = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 10}" fill="${o.f ?? '#fff'}" stroke="${o.s ?? '#c9d5e2'}" stroke-width="${o.sw ?? 2}"${o.k ? ` data-k="${o.k}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}${o.d ? ` stroke-dasharray="${o.d}"` : ''}/>`;
const Ln = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.c ?? NAU}" stroke-width="${o.w ?? 3.5}"${o.m ? ` marker-end="url(#${o.m})"` : ''}${o.d ? ` stroke-dasharray="${o.d}"` : ''}${o.k ? ` data-k="${o.k}"` : ''}/>`;
const mw = (t, fs) => String(t).length * 0.602 * fs;   // bề rộng chữ mono

/* ══════════════ 13.1 ══════════════ */

/** Ví dụ đời thường: tờ khai in sẵn ô (cột) vs tờ ghi chú thông số tự do (JSONB). */
export function formVsSheet({ w = 1110 } = {}) {
  const h = 360;
  let s = head(w, h, 'fs13');
  // trái: tờ khai cố định
  s += T(20, 28, 'Columns = a printed form', { b: true, fs: 23, c: PG });
  s += `<g data-k="form">${R(20, 44, 470, 270, { f: '#f7fafd', s: PG, sw: 3 })}`;
  [['name', 'Laptop Pro 14'], ['price', '1299'], ['brand', 'Acme']].forEach(([k, v], i) => {
    const y = 78 + i * 62;
    s += T(44, y + 26, k, { fs: 20, b: true, c: '#555' }) + R(160, y, 300, 40, { f: '#fff', s: '#9fb7cf', rx: 6 }) + T(176, y + 27, v, { m: true, fs: 20 });
  });
  s += T(44, 290, 'every product: same boxes, same types', { fs: 18, c: '#555', i: true });
  s += `</g>`;
  // phải: ba tờ ghi chú khác nhau
  const x0 = 560;
  s += T(x0, 28, 'JSONB = a spec sheet that differs per item', { b: true, fs: 23, c: TIM });
  const notes = [
    ['Laptop', ['ram: 16', 'cpu: M3', 'tags: laptop,pro']],
    ['Phone', ['ram: 8', 'storage: 256', 'tags: phone']],
    ['Keyboard', ['tags: accessory']],
  ];
  notes.forEach(([t, ls], i) => {
    const x = x0 - 20 + i * 186, y = 52 + (i % 2) * 18;
    s += `<g data-k="note${i}" transform="rotate(${[-3, 2, -1.5][i]} ${x + 88} ${y + 120})">${R(x, y, 178, 236, { f: '#fff6d8', s: '#e0c45a', sw: 2, rx: 4 })}` +
      T(x + 89, y + 34, t, { a: 'middle', b: true, fs: 21, c: '#7a5a12' });
    ls.forEach((l, j) => { s += T(x + 12, y + 74 + j * 34, l, { m: true, fs: 15 }); });
    s += `</g>`;
  });
  s += T(x0, 330, 'keys change from row to row — and that is the point', { fs: 18, c: '#555', i: true });
  return s + '</svg>';
}

/** json lưu nguyên văn bản · jsonb lưu dạng nhị phân đã phân tích. */
export function jsonVsJsonb({ w = 1110 } = {}) {
  const h = 230;
  let s = head(w, h, 'jj13');
  s += T(12, 30, 'input text', { b: true, fs: 20, c: '#555' });
  s += R(12, 44, 330, 56, { f: '#fff', s: '#bbb', rx: 8 }) + T(28, 80, '{"b":1,"a":2,"a":3}', { m: true, fs: 22 });
  s += Ln(346, 72, 420, 40, { m: 'jj13', c: PG }) + Ln(346, 72, 420, 160, { m: 'jj13', c: TIM });
  s += `<g data-k="jj-json">${R(430, 10, 660, 76, { f: '#eef4fa', s: PG, sw: 2.5 })}` + T(446, 40, 'json  — stores the TEXT, byte for byte', { b: true, fs: 20, c: PG }) +
    T(446, 70, '{"b":1,"a":2,"a":3}   re-parsed on every access', { m: true, fs: 17 }) + `</g>`;
  s += `<g data-k="jj-jsonb">${R(430, 120, 660, 100, { f: '#f4eff9', s: TIM, sw: 2.5 })}` + T(446, 150, 'jsonb — parses ONCE, stores a binary tree', { b: true, fs: 20, c: TIM }) +
    T(446, 180, '{"a": 3, "b": 1}', { m: true, fs: 19, b: true }) +
    T(446, 208, 'keys sorted · whitespace gone · last duplicate wins', { fs: 17, c: '#555' }) + `</g>`;
  return s + '</svg>';
}

/** Tài liệu là một CÂY: đường đi props → specs → ram (cho ->, #>, jsonpath). */
export function docTree({ w = 1110 } = {}) {
  const h = 400;
  let s = head(w, h, 'dt13', CAM);
  const box = (x, y, t, o = {}) => {
    const fs = o.fs ?? 19, bw = Math.max(o.w ?? 0, mw(t, fs) + 28);
    return { svg: R(x - bw / 2, y - 22, bw, 44, { f: o.f ?? '#fff', s: o.s ?? '#9fb7cf', sw: o.sw ?? 2, rx: 8, k: o.k }) + T(x, y + 7, t, { a: 'middle', m: true, fs, b: o.b, c: o.c }), bw };
  };
  const nodes = [
    ['root', 555, 40, 'props  { … }', { f: '#eef4fa', s: PG, sw: 3, b: true, c: PG }],
    ['brand', 120, 150, '"brand": "Acme"', {}],
    ['price', 340, 150, '"price": 1299', {}],
    ['tags', 610, 150, '"tags": [ … ]', { f: '#fff7ef', s: CAM }],
    ['specs', 920, 150, '"specs": { … }', { f: '#fff7ef', s: CAM, sw: 3, b: true }],
    ['t0', 520, 270, '[0] "laptop"', {}],
    ['t1', 700, 270, '[1] "pro"', {}],
    ['ram', 860, 270, '"ram": 16', { f: '#fff3c4', s: NAU, sw: 3.5, b: true, c: NAU }],
    ['cpu', 1030, 270, '"cpu": "M3"', {}],
  ];
  const pos = Object.fromEntries(nodes.map(([id, x, y]) => [id, [x, y]]));
  const edges = [['root', 'brand'], ['root', 'price'], ['root', 'tags'], ['root', 'specs'], ['tags', 't0'], ['tags', 't1'], ['specs', 'ram'], ['specs', 'cpu']];
  edges.forEach(([a, b]) => {
    const [x1, y1] = pos[a], [x2, y2] = pos[b];
    const hot = (a === 'root' && b === 'specs') || (a === 'specs' && b === 'ram');
    s += Ln(x1, y1 + 22, x2, y2 - 22, { c: hot ? CAM : '#b9c6d3', w: hot ? 5 : 2.5, m: hot ? 'dt13' : undefined, k: hot ? `edge-${b}` : undefined });
  });
  nodes.forEach(([id, x, y, t, o]) => { s += box(x, y, t, { ...o, k: `node-${id}` }).svg; });
  s += T(20, 340, "props -> 'specs' -> 'ram'", { m: true, fs: 22, b: true, c: NAU, k: 'path-arrows' });
  s += T(20, 378, "props #> '{specs,ram}'  ·  '$.specs.ram'", { m: true, fs: 19, c: '#555', k: 'path-other' });
  s += T(1090, 340, 'one step per arrow', { a: 'end', fs: 19, c: '#555', i: true });
  s += T(1090, 378, 'missing step ⇒ NULL, never an error', { a: 'end', fs: 19, c: DO, b: true, k: 'path-null' });
  return s + '</svg>';
}

/* ══════════════ 13.2 ══════════════ */

/** Sổ mục lục cuối sách = chỉ mục ngược. */
export function bookIndex({ w = 1110 } = {}) {
  const h = 300;
  let s = head(w, h, 'bi13', TIM);
  s += T(12, 28, 'A cookbook, read page by page…', { b: true, fs: 21, c: DO });
  ['p.12  Pho: beef, onion, ginger', 'p.40  Fried rice: egg, onion', 'p.77  Omelette: egg, cheese', 'p.95  Ginger tea: ginger, honey'].forEach((t, i) => {
    s += R(12, 44 + i * 52, 430, 42, { f: '#fbf7ef', s: '#d9c9ae', rx: 6, k: `bi-page${i}` }) + T(26, 72 + i * 52, t, { fs: 18, m: true });
  });
  s += T(12, 282, 'to find “egg” you read every recipe', { fs: 18, c: '#555', i: true });
  const x0 = 540;
  s += T(x0, 28, '…or the index at the back', { b: true, fs: 21, c: TIM });
  s += `<g data-k="bi-index">${R(x0, 44, 540, 220, { f: '#f4eff9', s: TIM, sw: 3 })}`;
  [['beef', '12'], ['egg', '40, 77'], ['ginger', '12, 95'], ['onion', '12, 40'], ['cheese · honey', '77 · 95']].forEach(([k, p], i) => {
    const y = 80 + i * 38, on = k === 'egg';
    if (on) s += R(x0 + 14, y - 26, 512, 34, { f: '#fff3c4', s: CAM, sw: 2.5, rx: 6, k: 'bi-egg' });
    s += T(x0 + 30, y, k, { m: true, fs: 20, b: on }) + T(x0 + 230, y, '→', { fs: 20, c: TIM }) + T(x0 + 270, y, `pages ${p}`, { m: true, fs: 20, b: on, c: on ? NAU : '#333' });
  });
  s += `</g>` + T(x0, 288, 'one entry per INGREDIENT, each with its list of pages', { fs: 18, c: '#555', i: true });
  return s + '</svg>';
}

/** jsonb_ops (khoá + giá trị riêng lẻ) vs jsonb_path_ops (đường dẫn + giá trị đã băm). */
export function opsPic({ w = 1110 } = {}) {
  const h = 330;
  let s = head(w, h, 'op13', TIM);
  s += T(12, 26, '{"brand":"Acme", "specs":{"ram":8}}  becomes these GIN entries:', { b: true, fs: 20, m: true });
  s += `<g data-k="op-ops">${R(12, 44, 530, 240, { f: '#eef4fa', s: PG, sw: 3 })}` + T(28, 76, 'jsonb_ops (default)', { b: true, fs: 21, c: PG });
  ['key  brand', 'key  specs', 'key  ram', 'value "Acme"', 'value 8'].forEach((t, i) => { s += R(28, 92 + i * 36, 250, 30, { f: '#fff', s: '#9fb7cf', rx: 5 }) + T(40, 113 + i * 36, t, { m: true, fs: 17 }); });
  s += T(296, 120, 'every key and every', { fs: 17, c: '#555' }) + T(296, 144, 'value, separately', { fs: 17, c: '#555' });
  s += T(296, 190, '⇒ answers @>  and', { fs: 17, b: true, c: PG }) + T(296, 214, '? ?| ?&  (key exists)', { fs: 17, b: true, c: PG }) + `</g>`;
  s += `<g data-k="op-path">${R(568, 44, 530, 240, { f: '#f4eff9', s: TIM, sw: 3 })}` + T(584, 76, 'jsonb_path_ops', { b: true, fs: 21, c: TIM });
  ['hash(brand → "Acme")', 'hash(specs.ram → 8)'].forEach((t, i) => { s += R(584, 92 + i * 36, 300, 30, { f: '#fff', s: '#c2acd9', rx: 5 }) + T(596, 113 + i * 36, t, { m: true, fs: 17 }); });
  s += T(584, 190, 'one entry per PATH to a value:', { fs: 17, c: '#555' }) + T(584, 214, 'fewer, smaller entries', { fs: 17, c: '#555' });
  s += T(584, 254, '⇒ @>  @?  @@ only — no ?', { fs: 17, b: true, c: TIM }) + `</g>`;
  s += T(12, 314, 'Real sizes on 200,000 rows: jsonb_ops 19 MB · jsonb_path_ops 14 MB (table 39 MB)', { fs: 19, c: NAU, b: true, k: 'op-size' });
  return s + '</svg>';
}

/* ══════════════ 13.3 ══════════════ */

/** Đường ống to_tsvector: tách → bỏ từ dừng → đưa về gốc → vị trí. */
export function tsPipe({ w = 1110, cau = 'The quick brown foxes were jumping over the lazy dogs' } = {}) {
  const h = 410;
  let s = head(w, h, 'tp13', PG);
  const words = cau.split(' ');
  const stop = new Set(['The', 'were', 'over', 'the']);
  const stem = { foxes: 'fox', jumping: 'jump', lazy: 'lazi', dogs: 'dog' };
  const fs = 17, gap = 10;
  const ws = words.map((t) => mw(t, fs) + 18);
  const tot = ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
  let x = (w - tot) / 2;
  const xs = ws.map((wd) => { const r = x; x += wd + gap; return r; });
  const rows = [['1 · tokens', 30], ['2 · drop stop words', 120], ['3 · stem to lexemes', 210], ['4 · keep positions', 300]];
  rows.forEach(([t, y]) => { s += T(12, y + 4, t, { fs: 16, b: true, c: '#777' }); });
  words.forEach((t, i) => {
    const bx = xs[i], bw = ws[i], st = stop.has(t);
    s += R(bx, 42, bw, 36, { f: '#fff', s: '#9fb7cf', rx: 6, k: `tk${i}` }) + T(bx + bw / 2, 66, t, { a: 'middle', m: true, fs });
    if (st) {
      s += R(bx, 132, bw, 36, { f: '#fdf0ee', s: '#e3a59c', rx: 6, d: '5 4', k: `st${i}` }) + T(bx + bw / 2, 156, t, { a: 'middle', m: true, fs, c: '#c0392b' }) + Ln(bx + 4, 150, bx + bw - 4, 150, { c: DO, w: 2.5 });
      return;
    }
    s += Ln(bx + bw / 2, 80, bx + bw / 2, 128, { c: '#b9c6d3', w: 2, m: 'tp13' });
    s += R(bx, 132, bw, 36, { f: '#fff', s: '#9fb7cf', rx: 6 }) + T(bx + bw / 2, 156, t, { a: 'middle', m: true, fs });
    const lx = stem[t] ?? t.toLowerCase(), hot = !!stem[t];
    s += Ln(bx + bw / 2, 170, bx + bw / 2, 218, { c: hot ? CAM : '#b9c6d3', w: hot ? 3 : 2, m: 'tp13' });
    s += R(bx, 222, bw, 36, { f: hot ? '#fff3c4' : '#f1f9f4', s: hot ? CAM : '#9fd0b2', rx: 6, k: `lx${i}` }) + T(bx + bw / 2, 246, lx, { a: 'middle', m: true, fs, b: hot, c: hot ? NAU : '#1f6b40' });
    s += T(bx + bw / 2, 300, `:${i + 1}`, { a: 'middle', m: true, fs: 18, b: true, c: PG });
  });
  s += `<g data-k="tsv">${R(60, 330, w - 120, 50, { f: '#eef4fa', s: PG, sw: 3 })}` + T(w / 2, 363, "'brown':3 'dog':10 'fox':4 'jump':6 'lazi':9 'quick':2", { a: 'middle', m: true, fs: 22, b: true, c: PG }) + `</g>`;
  return s + '</svg>';
}

/** Bốn trọng số A/B/C/D: nhãn dán lên từng lexeme theo nơi nó xuất hiện. */
export function weightsPic({ w = 1110 } = {}) {
  const h = 210;
  let s = head(w, h, 'wp13', CAM);
  const cs = [['A', 'title', '1.0', PG], ['B', 'summary / body', '0.4', XANH], ['C', 'tags / extra', '0.2', CAM], ['D', 'default (no weight)', '0.1', XAM]];
  cs.forEach(([k, t, v, m], i) => {
    const x = 12 + i * 274;
    s += `<g data-k="w${k}">${R(x, 14, 258, 120, { f: '#fff', s: m, sw: 3 })}` + T(x + 40, 80, k, { a: 'middle', b: true, fs: 52, c: m }) +
      T(x + 80, 56, t, { fs: 19, b: true }) + T(x + 80, 92, `ts_rank weight ${v}`, { fs: 17, m: true, c: '#555' }) + `</g>`;
  });
  s += T(12, 172, "setweight(to_tsvector('english', title), 'A') || setweight(to_tsvector('english', body), 'B')", { m: true, fs: 17.5, c: NAU, k: 'w-code' });
  s += T(12, 200, "⇒ 'index':2A,8B,13B — one lexeme, positions in the title (A) AND in the body (B)", { fs: 18, c: '#555' });
  return s + '</svg>';
}

/* ══════════════ 13.4 ══════════════ */

/** Cắt chữ thành trigram (đệm 2 khoảng trắng trước, 1 sau) + so hai chữ. */
export function trigramPic({ w = 1110 } = {}) {
  const h = 330;
  let s = head(w, h, 'tg13', TIM);
  const wd = '··cat·';
  s += T(12, 30, "show_trgm('cat'): pad with 2 spaces in front, 1 behind, slide a 3-letter window", { b: true, fs: 19 });
  const cw = 52;
  [...wd].forEach((ch, i) => { s += R(40 + i * cw, 46, cw - 4, 48, { f: ch === '·' ? '#f3f0ea' : '#fff', s: '#9fb7cf', rx: 6 }) + T(40 + i * cw + (cw - 4) / 2, 79, ch === '·' ? '␣' : ch, { a: 'middle', m: true, fs: 24, b: true, c: ch === '·' ? XAM : '#333' }); });
  ['"  c"', '" ca"', 'cat', '"at "'].forEach((t, i) => {
    const x = 40 + i * cw;
    s += R(x - 2, 104 + i * 6, cw * 3 - 4, 8, { f: [PG, CAM, XANH, TIM][i], s: 'none', rx: 3, op: 0.75 });
    s += T(400 + i * 170, 79, t, { m: true, fs: 22, b: true, c: [PG, CAM, XANH, TIM][i], k: `tg-cat${i}` });
  });
  s += T(400, 112, '= 4 trigrams', { fs: 18, c: '#555', i: true });
  // so hai chữ
  const A = ['"  n"', '" ng"', 'ngu', 'guy', 'uye', 'yen', '"en "'], B = ['"  n"', '" ng"', 'ngu', 'guy', 'uyn', '"yn "'];
  const share = new Set(A.filter((x) => B.includes(x)));
  s += T(12, 170, "Nguyen", { m: true, fs: 22, b: true, c: PG }) + T(12, 222, "Nguyn (typo)", { m: true, fs: 22, b: true, c: DO });
  A.forEach((t, i) => { const on = share.has(t); s += R(200 + i * 112, 146, 104, 36, { f: on ? '#f1f9f4' : '#fff', s: on ? XANH : '#c9d5e2', sw: on ? 3 : 2, rx: 6, k: `tg-a${i}` }) + T(252 + i * 112, 171, t, { a: 'middle', m: true, fs: 17, b: on }); });
  B.forEach((t, i) => { const on = share.has(t); s += R(200 + i * 112, 198, 104, 36, { f: on ? '#f1f9f4' : '#fdf0ee', s: on ? XANH : '#e3a59c', sw: on ? 3 : 2, rx: 6, k: `tg-b${i}` }) + T(252 + i * 112, 223, t, { a: 'middle', m: true, fs: 17, b: on }); });
  s += `<g data-k="tg-sim">${R(12, 254, w - 24, 62, { f: '#f4eff9', s: TIM, sw: 3 })}` +
    T(30, 293, 'shared 4 · total distinct 9  ⇒  similarity = 4 / 9 = 0.444', { m: true, fs: 22, b: true, c: TIM }) + `</g>`;
  return s + '</svg>';
}

/** Ba công cụ tìm kiếm — chọn theo HÌNH DẠNG câu hỏi. */
export function chooseSearch({ w = 1110 } = {}) {
  const h = 300;
  let s = head(w, h, 'cs13');
  const cs = [
    ['Full-text search', '13.3', PG, ['long text: articles, docs', 'words, stems, ranking', 'needs roughly right spelling', 'tsvector + GIN']],
    ['Trigram (pg_trgm)', '13.4', TIM, ['short strings: names, SKUs', 'typos, partial matches', "ILIKE '%…%' with an index", 'gin_trgm_ops / gist_trgm_ops']],
    ['B-tree prefix', '9.1', XANH, ["only LIKE 'abc%'", 'cheapest of the three', 'text_pattern_ops / COLLATE "C"', 'plain B-tree']],
  ];
  cs.forEach(([t, l, m, ls], i) => {
    const x = 12 + i * 366;
    s += `<g data-k="cs${i}">${R(x, 12, 350, 276, { f: '#fff', s: m, sw: 3 })}` + R(x, 12, 350, 52, { f: m, s: m, sw: 3 }) +
      T(x + 18, 46, t, { b: true, fs: 22, c: '#fff' }) + T(x + 334, 46, l, { a: 'end', b: true, fs: 18, c: '#fff' });
    ls.forEach((q, j) => { s += T(x + 18, 104 + j * 46, '• ' + q, { fs: 19, m: j === 3, c: j === 3 ? m : '#333', b: j === 3 }); });
    s += `</g>`;
  });
  return s + '</svg>';
}
