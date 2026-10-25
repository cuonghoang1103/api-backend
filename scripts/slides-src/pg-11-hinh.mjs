/**
 * pg-11-hinh.mjs — hình dùng chung cho Chương 11 — Giao dịch, MVCC, mức cô lập, khoá (deck pg-11-1…4). Không phải deck. (agent c11, 25/10/2026)
 * Chữ SVG: rộng ≈ 0,602 × cỡ chữ / ký tự (mono) — đặt nhãn bằng tw(). Phần tử video cần chú thích có data-k.
 * Lõi: haiPsql() = bảng HAI PHIÊN psql thật (cột thời gian + phiên A + phiên B) — output chép từ
 * video-bai-giang/src/khung/pg/that/pg-11-*.out.txt (chạy bằng c11-scripts/hai-phien.mjs trên PostgreSQL 17.11).
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7a5a9a', XAM = '#8a8a8a';
export const tw = (s, fs) => String(s).length * fs * 0.602;
const head = (w, h, id) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">` +
  `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker>` +
  `<marker id="${id}x" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${XANH}"/></marker>` +
  `<marker id="${id}d" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${DO}"/></marker>` +
  `<marker id="${id}b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${PG}"/></marker></defs>`;
const T = (x, y, s, { fs = 20, fw = 400, fill = '#333', anchor = 'start', mono = false, k = '', it = false } = {}) =>
  `<text${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" font-size="${fs}" font-weight="${fw}" fill="${fill}" text-anchor="${anchor}"${mono ? ` font-family="${MONO}"` : ''}${it ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
const R = (x, y, w, h, { fill = '#fff', st = PG, sw = 2.5, rx = 10, k = '', dash = '' } = {}) =>
  `<rect${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${st}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const L = (x1, y1, x2, y2, { st = NAU, sw = 3, m = '', dash = '', k = '' } = {}) =>
  `<line${k ? ` data-k="${k}"` : ''} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${st}" stroke-width="${sw}"${m ? ` marker-end="url(#${m})"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

/* ═══════════ bảng HAI PHIÊN psql thật ═══════════ */
const CSS_HP = `<style>
.c11hp{display:grid;flex-shrink:0;border:1.5px solid #c9d5e2;border-radius:10px;overflow:hidden;font-family:"SF Mono",Menlo,Consolas,monospace}
.c11hp>.c11h{font-family:Arial,sans-serif;font-weight:800;font-size:17px;color:#fff;padding:5px 10px}
.c11hp>.c11t{font-size:13px;color:#8a8a8a;padding:5px 6px;text-align:right;border-top:1px solid #e3e8ee;background:#fafbfc}
.c11hp>.c11c{font-size:15px;line-height:1.36;padding:5px 10px;border-top:1px solid #e3e8ee;white-space:pre;color:#2b2b2b;overflow:hidden}
.c11hp>.c11c.a{background:#f4f8fc}.c11hp>.c11c.b{background:#fffaf3}
.c11hp>.c11n{font-family:Arial,sans-serif;font-size:15px;line-height:1.3;padding:5px 9px;border-top:1px solid #e3e8ee;color:#555;background:#fff}
.c11hp .q{color:#1f4f7a;font-weight:700}.c11hp .c11c.b .q{color:#8a4a0e}
.c11hp .er{color:#c0392b;font-weight:700}.c11hp .nt{color:#9a6a00}.c11hp .w8{color:#b8860b;font-style:italic;font-family:Arial,sans-serif}
.c11hp .ok{color:#1f7a45;font-weight:700}
.c11hp>.hl{background:#fff3c4 !important}
</style>`;
/**
 * rows: [[t, a, b, note?], …] — a/b: chuỗi nhiều dòng; dòng bắt đầu '> ' = lệnh SQL (tô đậm), '⏳' = đang chờ (vàng nghiêng),
 * ERROR/FATAL đỏ, DETAIL/HINT/CONTEXT vàng, '✓' xanh. opts: { a: 'Session A', b: 'Session B', note: true, fs, hl: [chỉ số dòng 0-based], wn }
 * data-k: hp-t / hp-a / hp-b / hp-n (đếm i theo thứ tự dòng), hp-r? (không có — dùng hp-a#i).
 */
export function haiPsql(rows, opts = {}) {
  const { a = 'Session A', b = 'Session B', note = rows.some((r) => r[3]), fs = 15, hl = [], wn = 230, wt = 62, ab = '1fr 1fr' } = opts;
  const cell = (s) => String(s || '').split('\n').map((l) => {
    if (l.startsWith('> ')) return `<span class="q">${esc(l.slice(2))}</span>`;
    if (l.startsWith('⏳')) return `<span class="w8">${esc(l)}</span>`;
    if (l.startsWith('✓')) return `<span class="ok">${esc(l)}</span>`;
    if (/^(ERROR|FATAL)/.test(l)) return `<span class="er">${esc(l)}</span>`;
    if (/^(DETAIL|HINT|CONTEXT|NOTICE|INFO|Process )/.test(l)) return `<span class="nt">${esc(l)}</span>`;
    return esc(l);
  }).join('\n');
  const cols = `${wt}px ${ab}${note ? ` ${wn}px` : ''}`;
  let s = `${CSS_HP}<div class="c11hp" data-k="hp" style="grid-template-columns:${cols}">`;
  s += `<div class="c11h" style="background:#9aa5b1">t</div><div class="c11h" style="background:${PG}">${esc(a)}</div><div class="c11h" style="background:${CAM}">${esc(b)}</div>${note ? `<div class="c11h" style="background:${NAU}">what happens</div>` : ''}`;
  rows.forEach(([t, x, y, n], i) => {
    const h = hl.includes(i) ? ' hl' : '';
    s += `<div class="c11t${h}" data-k="hp-t">${esc(t)}</div><div class="c11c a${h}" data-k="hp-a" style="font-size:${fs}px">${cell(x)}</div><div class="c11c b${h}" data-k="hp-b" style="font-size:${fs}px">${cell(y)}</div>`;
    if (note) s += `<div class="c11n${h}" data-k="hp-n">${n || ''}</div>`;
  });
  return s + '</div>';
}

/* ═══════════ 11.1 ═══════════ */
/** Chuyển tiền hai bước, mất điện ở giữa: không giao dịch ⇒ tiền biến mất; có giao dịch ⇒ tất cả hoặc không gì. */
export function transferPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'tf');
  const box = (x, y, ten, so, k, mau = PG) => R(x, y, 190, 96, { fill: '#fff', st: mau, k }) + T(x + 95, y + 36, ten, { fs: 20, fw: 800, fill: mau, anchor: 'middle' }) + T(x + 95, y + 74, so, { fs: 26, fw: 800, anchor: 'middle', mono: true });
  // hàng trên: không giao dịch
  s += T(0, 26, 'Without a transaction', { fs: 21, fw: 800, fill: DO, k: 'tf-no' });
  s += box(0, 40, 'Account A', '100 → 0', 'tf-a1', PG) + box(470, 40, 'Account B', '0 → 0', 'tf-b1', CAM);
  s += L(196, 88, 300, 88, { m: 'tf', k: 'tf-s1' }) + T(248, 78, 'step 1 ✓', { fs: 16, anchor: 'middle', fill: XANH, fw: 700 });
  s += `<text data-k="tf-cut" x="330" y="104" font-size="44">⚡</text>`;
  s += L(380, 88, 462, 88, { m: 'tf', dash: '6 6', st: XAM }) + T(420, 78, 'step 2 ✗', { fs: 16, anchor: 'middle', fill: DO, fw: 700 });
  s += R(700, 46, 410, 84, { fill: '#fdf0ee', st: DO, k: 'tf-lost' }) + T(905, 80, '100 has vanished', { fs: 22, fw: 800, fill: DO, anchor: 'middle' }) + T(905, 112, 'the bank lost real money', { fs: 17, fill: '#7a2a1d', anchor: 'middle' });
  // hàng dưới: có giao dịch
  const y2 = 168;
  s += T(0, y2 - 10, 'Inside BEGIN … COMMIT', { fs: 21, fw: 800, fill: XANH, k: 'tf-yes' });
  s += R(-0.5, y2, 662, 116, { fill: '#f1f9f4', st: XANH, dash: '9 6', k: 'tf-box' });
  s += box(14, y2 + 10, 'Account A', '100', 'tf-a2', PG) + box(456, y2 + 10, 'Account B', '0', 'tf-b2', CAM);
  s += L(210, y2 + 58, 448, y2 + 58, { m: 'tfx', st: XANH }) + T(330, y2 + 48, 'both steps or neither', { fs: 16, anchor: 'middle', fill: XANH, fw: 700 });
  s += `<text x="318" y="${y2 + 104}" font-size="30">⚡</text>`;
  s += R(700, y2 + 16, 410, 84, { fill: '#f1f9f4', st: XANH, k: 'tf-safe' }) + T(905, y2 + 50, 'power cut ⇒ ROLLBACK', { fs: 22, fw: 800, fill: XANH, anchor: 'middle' }) + T(905, y2 + 82, 'A still 100, B still 0 — nothing lost', { fs: 17, fill: '#1f5a36', anchor: 'middle' });
  return s + '</svg>';
}

/** Autocommit: mỗi câu lệnh trần được bọc BEGIN/COMMIT ngầm; BEGIN tự viết = gom nhiều câu. */
export function autocommitPic({ w = 1110, h = 270 } = {}) {
  let s = head(w, h, 'ac');
  s += T(0, 24, 'A bare statement (autocommit)', { fs: 20, fw: 800, fill: PG, k: 'ac-t1' });
  const pill = (x, y, t, mau, k, wd = 200, it = false) => R(x, y, wd, 52, { fill: mau + '18', st: mau, rx: 26, k }) + T(x + wd / 2, y + 33, t, { fs: 19, fw: 700, fill: mau, anchor: 'middle', mono: !it, it });
  s += pill(0, 40, 'BEGIN', XAM, 'ac-b1', 160, true) + L(164, 66, 206, 66, { m: 'ac' });
  s += pill(212, 40, 'UPDATE wallet …', PG, 'ac-u1', 300) + L(516, 66, 558, 66, { m: 'ac' });
  s += pill(564, 40, 'COMMIT', XAM, 'ac-c1', 170, true);
  s += T(744, 60, 'implicit — PostgreSQL adds', { fs: 17, fill: '#666' }) + T(744, 82, 'them for you (grey)', { fs: 17, fill: '#666' });
  s += T(0, 150, 'Your own BEGIN groups several statements', { fs: 20, fw: 800, fill: XANH, k: 'ac-t2' });
  s += pill(0, 166, 'BEGIN', XANH, 'ac-b2', 130) + L(134, 192, 166, 192, { m: 'ac' });
  s += pill(172, 166, 'UPDATE A −100', PG, 'ac-u2', 230) + L(406, 192, 438, 192, { m: 'ac' });
  s += pill(444, 166, 'UPDATE B +100', PG, 'ac-u3', 230) + L(678, 192, 710, 192, { m: 'ac' });
  s += pill(716, 166, 'COMMIT', XANH, 'ac-c2', 150);
  s += R(0, 232, 880, 34, { fill: '#fff', st: '#fff', sw: 0 }) + T(0, 256, 'One statement is already atomic. BEGIN makes SEVERAL statements atomic TOGETHER.', { fs: 18, fw: 700, fill: '#444', k: 'ac-note' });
  return s + '</svg>';
}

/** Trạng thái giao dịch + dấu nhắc psql thật (=# · =*# · =!#). */
export function statesPic({ w = 1110, h = 345 } = {}) {
  let s = head(w, h, 'st');
  const node = (x, y, t, p, mau, k) => R(x, y, 250, 110, { fill: mau + '14', st: mau, sw: 3, rx: 16, k }) +
    T(x + 125, y + 40, t, { fs: 22, fw: 800, fill: mau, anchor: 'middle' }) + T(x + 125, y + 82, p, { fs: 24, fw: 700, fill: '#222', anchor: 'middle', mono: true });
  s += node(0, 110, 'idle', 'pgcourse=#', XAM, 'st-idle');
  s += node(430, 0, 'in transaction', 'pgcourse=*#', PG, 'st-in');
  s += node(430, 210, 'aborted (failed)', 'pgcourse=!#', DO, 'st-ab');
  s += node(860, 110, 'ended', 'COMMIT / ROLLBACK', XANH, 'st-end');
  // mũi tên
  s += `<path data-k="st-e1" d="M250,140 C330,90 360,60 426,56" fill="none" stroke="${NAU}" stroke-width="3" marker-end="url(#st)"/>` + T(300, 82, 'BEGIN', { fs: 18, fw: 800, fill: NAU, mono: true });
  s += `<path data-k="st-e2" d="M555,112 L555,206" fill="none" stroke="${DO}" stroke-width="3" marker-end="url(#std)"/>` + T(566, 166, 'any ERROR', { fs: 18, fw: 800, fill: DO });
  s += `<path data-k="st-e3" d="M682,56 C770,60 800,90 858,140" fill="none" stroke="${XANH}" stroke-width="3" marker-end="url(#stx)"/>` + T(744, 62, 'COMMIT ✓', { fs: 18, fw: 800, fill: XANH, mono: true });
  s += `<path data-k="st-e4" d="M682,266 C770,262 800,230 858,190" fill="none" stroke="${DO}" stroke-width="3" marker-end="url(#std)"/>` + T(706, 318, 'ROLLBACK', { fs: 17, fw: 800, fill: DO, mono: true }) + T(706, 340, '(COMMIT = ROLLBACK)', { fs: 15, fw: 700, fill: DO });
  s += T(985, 250, '…then back to', { fs: 16, fill: '#666', anchor: 'middle' }) + T(985, 272, 'pgcourse=#', { fs: 17, fill: '#444', anchor: 'middle', mono: true, fw: 700 });
  s += T(296, 250, 'in this state every', { fs: 16, fill: DO, anchor: 'middle' }) + T(296, 272, 'other statement', { fs: 16, fill: DO, anchor: 'middle' }) + T(296, 294, 'is refused', { fs: 16, fill: DO, anchor: 'middle' });
  return s + '</svg>';
}

/** SAVEPOINT = điểm lưu trong game. */
export function savepointPic({ w = 1110, h = 232 } = {}) {
  let s = head(w, h, 'sp');
  s += L(20, 110, 1090, 110, { st: '#c9d5e2', sw: 8 });
  const dot = (x, t, sub, mau, k) => `<circle data-k="${k}" cx="${x}" cy="110" r="17" fill="${mau}"/>` + T(x, 66, t, { fs: 18, fw: 800, fill: mau, anchor: 'middle', mono: true }) + T(x, 160, sub, { fs: 16, fill: '#555', anchor: 'middle' });
  s += dot(40, 'BEGIN', 'start', XAM, 'sp-0');
  s += dot(230, 'A −40', 'step 1 ✓', PG, 'sp-1');
  s += `<text data-k="sp-flag" x="372" y="98" font-size="38">🚩</text>` + T(390, 40, 'SAVEPOINT sp1', { fs: 18, fw: 800, fill: TIM, anchor: 'middle', mono: true }) + T(390, 66, '(checkpoint)', { fs: 15, fill: '#555', anchor: 'middle' });
  s += dot(580, 'A −500 ✗', '', DO, 'sp-2');
  s += `<path data-k="sp-back" d="M580,128 C560,215 420,215 396,128" fill="none" stroke="${TIM}" stroke-width="3.5" marker-end="url(#sp)"/>` + T(488, 222, 'ROLLBACK TO SAVEPOINT sp1', { fs: 16, fw: 800, fill: TIM, anchor: 'middle', mono: true });
  s += dot(800, 'B +40', 'step 2 ✓', PG, 'sp-3');
  s += dot(1000, 'COMMIT', 'A 60 · B 40', XANH, 'sp-4');
  return s + '</svg>';
}

/* ═══════════ 11.2 ═══════════ */
/** Đời thường: sửa trên bảng (xoá rồi viết — người đọc phải chờ) vs ghi phiên bản mới (người đọc cũ đọc bản cũ). */
export function boardPic({ w = 1110, h = 330 } = {}) {
  let s = head(w, h, 'bd');
  // trái: xoá rồi viết
  s += T(0, 26, 'Overwrite in place (lock while writing)', { fs: 20, fw: 800, fill: DO, k: 'bd-t1' });
  s += R(0, 44, 520, 200, { fill: '#2f3b36', st: '#5b4636', sw: 8, rx: 6, k: 'bd-b1' });
  s += T(30, 120, 'Room 101: An, Bi', { fs: 30, fill: '#f1f1f1', mono: true }) + `<rect x="${30 + tw('Room 101: An, Bi', 30)}" y="96" width="18" height="30" fill="#f6e27a"/>`;
  s += `<text x="330" y="128" font-size="40">🧽</text>` + T(30, 190, '(old text being erased & rewritten)', { fs: 18, fill: '#cfd8d3', it: true });
  s += `<text x="420" y="224" font-size="40">✍️</text>`;
  s += `<text x="10" y="300" font-size="38">🧑‍🎓</text>` + T(60, 292, 'reader must WAIT ⏳ until the writer is done', { fs: 18, fw: 700, fill: DO, k: 'bd-wait' });
  // phải: phiên bản
  const x2 = 590;
  s += T(x2, 26, 'Keep versions (MVCC)', { fs: 20, fw: 800, fill: XANH, k: 'bd-t2' });
  s += R(x2, 44, 520, 96, { fill: '#fff', st: XAM, k: 'bd-v1' }) + T(x2 + 18, 82, 'v1  50.00', { fs: 26, fw: 800, mono: true }) + T(x2 + 18, 118, 'valid until tx 68646 commits', { fs: 17, fill: '#666' });
  s += R(x2, 154, 520, 96, { fill: '#f1f9f4', st: XANH, k: 'bd-v2' }) + T(x2 + 18, 192, 'v2  40.00', { fs: 26, fw: 800, mono: true, fill: XANH }) + T(x2 + 18, 228, 'written by tx 68646 (not committed yet)', { fs: 17, fill: '#1f5a36' });
  s += `<text x="${x2 + 430}" y="104" font-size="36">👀</text>` + T(x2 + 425, 128, 'B', { fs: 18, fw: 800, fill: CAM });
  s += `<text x="${x2 + 430}" y="214" font-size="36">✍️</text>` + T(x2 + 425, 238, 'A', { fs: 18, fw: 800, fill: PG });
  s += T(x2, 292, 'reader reads v1 at once · writer works on v2', { fs: 18, fw: 700, fill: XANH, k: 'bd-ok' });
  return s + '</svg>';
}

/** Trang 0 của bảng: ba phiên bản của cùng một dòng (pageinspect thật). */
export function pagePic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'pp');
  s += R(0, 30, 1100, 250, { fill: '#fbfaf7', st: NAU, sw: 3, rx: 12, k: 'pp-page' }) + T(18, 22, 'heap page 0 of mvcc_demo (8 kB)', { fs: 18, fw: 800, fill: NAU });
  const tup = (x, lp, val, xmin, xmax, ctid, dead, k) => {
    const st = dead ? XAM : XANH;
    return R(x, 70, 330, 180, { fill: dead ? '#f2f2f2' : '#eef8f1', st, sw: 3, k }) +
      T(x + 14, 100, `lp ${lp} · ctid (0,${lp})`, { fs: 18, fw: 800, fill: st }) +
      T(x + 14, 140, `val  = '${val}'`, { fs: 20, mono: true, fill: dead ? '#888' : '#222' }) +
      T(x + 14, 172, `xmin = ${xmin}`, { fs: 20, mono: true, fill: dead ? '#888' : '#222' }) +
      T(x + 14, 204, `xmax = ${xmax}`, { fs: 20, mono: true, fill: xmax === '0' ? XANH : DO, fw: 700 }) +
      T(x + 14, 236, `t_ctid → ${ctid}`, { fs: 18, mono: true, fill: '#666' });
  };
  s += tup(16, 1, 'first', '68634', '68635', '(0,2)', true, 'pp-1');
  s += tup(386, 2, 'second', '68635', '68636', '(0,3)', true, 'pp-2');
  s += tup(756, 3, 'third', '68636', '0', '(0,3)', false, 'pp-3');
  s += L(346, 160, 382, 160, { m: 'pp', k: 'pp-a1' }) + L(716, 160, 752, 160, { m: 'pp', k: 'pp-a2' });
  s += T(18, 296, 'old versions are still ON the page — xmax says which transaction ended them', { fs: 17, fw: 700, fill: '#555', k: 'pp-note' });
  return s + '</svg>';
}

/** Trục mã giao dịch + ảnh chụp 69067:69069:69067 (chạy thật). */
export function snapshotPic({ w = 1110, h = 270 } = {}) {
  let s = head(w, h, 'sn');
  const x0 = 60, dx = 160, y = 120;
  const xs = [69065, 69066, 69067, 69068, 69069, 69070];
  s += L(20, y, 1090, y, { st: '#bbb', sw: 3, m: 'sn' });
  // vùng xmin..xmax
  s += R(x0 + 2 * dx - 70, y - 62, 2 * dx + 10, 160, { fill: 'rgba(122,90,154,.07)', st: TIM, sw: 2, dash: '7 6', rx: 14, k: 'sn-win' }) + T(x0 + 2 * dx - 60, y - 70, 'snapshot window [xmin, xmax)', { fs: 14, fill: TIM, fw: 700 });
  xs.forEach((x, i) => {
    const cx = x0 + i * dx;
    const kind = x < 69067 ? 'c' : x === 69067 ? 'p' : x === 69068 ? 'c' : 'f';
    const mau = kind === 'c' ? XANH : kind === 'p' ? CAM : XAM;
    s += `<circle data-k="sn-x${i}" cx="${cx}" cy="${y}" r="16" fill="${mau}"/>` + T(cx, y - 28, String(x), { fs: 18, fw: 800, anchor: 'middle', mono: true, fill: mau });
    const lab = kind === 'c' ? 'committed' : kind === 'p' ? 'in progress (A)' : 'not started';
    s += T(cx, y + 42, lab, { fs: 15, anchor: 'middle', fill: mau, fw: 700 });
    s += T(cx, y + 64, kind === 'c' ? 'VISIBLE' : 'INVISIBLE', { fs: 15, anchor: 'middle', fill: kind === 'c' ? XANH : DO, fw: 800 });
  });
  s += T(x0 + 3 * dx, y + 88, '(C)', { fs: 15, anchor: 'middle', fill: XANH, fw: 700 });
  s += T(20, 24, 'pg_current_snapshot() = 69067:69069:69067', { fs: 20, fw: 800, mono: true, fill: TIM, k: 'sn-t' });
  s += T(20, 252, 'xmin 69067 = oldest still running · xmax 69069 = first not yet started · list = running inside the window', { fs: 16, fill: '#555', k: 'sn-n' });
  return s + '</svg>';
}

/** Hai phiên nhìn hai phiên bản (số thật pg-11-2a). */
export function twoEyesPic({ w = 1110, h = 260 } = {}) {
  let s = head(w, h, 'te');
  const v = (x, y, t, a, b, ctid, live, k) => R(x, y, 420, 120, { fill: live ? '#eef8f1' : '#f6f6f6', st: live ? XANH : XAM, sw: 3, k }) +
    T(x + 16, y + 34, `ctid ${ctid}`, { fs: 18, fw: 800, fill: live ? XANH : '#777' }) + T(x + 16, y + 70, t, { fs: 24, fw: 800, mono: true }) +
    T(x + 16, y + 104, `xmin ${a} · xmax ${b}`, { fs: 18, mono: true, fill: '#555' });
  s += v(320, 10, 'balance 50.00', '68645', '68646', '(0,31)', false, 'te-old');
  s += v(320, 140, 'balance 40.00', '68646', '0', '(0,32)', true, 'te-new');
  s += `<text x="40" y="84" font-size="44">👀</text>` + T(100, 62, 'Session B', { fs: 20, fw: 800, fill: CAM }) + T(100, 88, 'snapshot taken while', { fs: 16, fill: '#666' }) + T(100, 108, '68646 is still running', { fs: 16, fill: '#666' });
  s += L(260, 70, 314, 70, { m: 'te', k: 'te-b' });
  s += `<text x="40" y="214" font-size="44">✍️</text>` + T(100, 192, 'Session A (tx 68646)', { fs: 20, fw: 800, fill: PG }) + T(100, 218, 'sees its own write', { fs: 16, fill: '#666' });
  s += L(290, 200, 314, 200, { m: 'teb', k: 'te-a', st: PG });
  s += R(770, 30, 330, 200, { fill: '#fff', st: TIM, sw: 2.5, rx: 14 }) + T(786, 66, 'Nobody waited.', { fs: 21, fw: 800, fill: TIM }) +
    T(786, 100, 'B read v1 instantly;', { fs: 18, fill: '#333' }) + T(786, 128, 'A wrote v2 freely.', { fs: 18, fill: '#333' }) +
    T(786, 170, 'After A commits, every', { fs: 18, fill: '#333' }) + T(786, 198, 'NEW snapshot sees v2.', { fs: 18, fill: '#333', fw: 700 });
  return s + '</svg>';
}

/** Kích thước bảng bloat_demo qua từng bước (đo thật). */
export function bloatBars({ w = 1110, rh = 50 } = {}) {
  const it = [['created (100,000 rows)', 4608, '4608 kB', PG], ['after UPDATE #1', 8928, '8928 kB', CAM], ['after UPDATE #2', 13312, '13 MB', DO],
    ['after VACUUM', 13312, '13 MB (dead = 0)', TIM], ['UPDATE #3 (reuses space)', 13312, '13 MB', TIM], ['after VACUUM FULL', 5024, '5024 kB', XANH]];
  const lw = 290, max = 13312, bw = w - lw - 190;
  let s = head(w, it.length * rh + 10, 'bb');
  it.forEach(([t, v, lab, mau], i) => {
    const y = i * rh + 6;
    s += T(0, y + 31, t, { fs: 19, fw: 700, fill: '#333' }) + R(lw, y + 6, Math.max(8, (v / max) * bw), rh - 14, { fill: mau, st: mau, sw: 0, rx: 6, k: `bb-${i}` }) +
      T(lw + (v / max) * bw + 12, y + 31, lab, { fs: 19, fw: 800, fill: mau, mono: true });
  });
  return s + '</svg>';
}

/** Giao dịch dài ghim ảnh chụp: VACUUM phải giữ mọi phiên bản mới hơn. */
export function pinPic({ w = 1110, h = 220 } = {}) {
  let s = head(w, h, 'pn');
  s += L(20, 120, 1090, 120, { st: '#bbb', sw: 3, m: 'pn' }) + T(1000, 150, 'time →', { fs: 16, fill: '#888' });
  s += R(40, 70, 420, 100, { fill: '#e8f0f8', st: PG, sw: 3, k: 'pn-a' }) + T(56, 104, 'Session A: BEGIN … (still open)', { fs: 19, fw: 800, fill: PG }) + T(56, 136, 'snapshot pinned · backend_xmin 68653', { fs: 17, mono: true, fill: '#333' });
  s += `<text x="60" y="210" font-size="30">📌</text>`;
  for (let i = 0; i < 6; i++) s += `<text x="${520 + i * 90}" y="112" font-size="38">💀</text>`;
  s += T(520, 160, '1000 dead tuples written AFTER A’s snapshot', { fs: 18, fw: 700, fill: DO, k: 'pn-d' });
  s += T(520, 190, 'VACUUM: “1000 are dead but not yet removable”', { fs: 18, fw: 800, fill: DO, mono: false, k: 'pn-v' });
  return s + '</svg>';
}

/* ═══════════ 11.3 ═══════════ */
/** Đời thường: bảng tỉ số trận đấu — nhìn mỗi lần một số mới (RC) vs chụp một tấm ảnh lúc bắt đầu viết báo cáo (RR). */
export function scorePic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'sc');
  const board = (x, y, t, k) => R(x, y, 150, 70, { fill: '#1b2430', st: '#0e141c', sw: 4, rx: 8, k }) + T(x + 75, y + 47, t, { fs: 32, fw: 800, fill: '#ffd54f', anchor: 'middle', mono: true });
  s += T(0, 26, 'Read Committed: look again, see the latest score', { fs: 19, fw: 800, fill: PG, k: 'sc-t1' });
  ['1 – 0', '1 – 1', '2 – 1'].forEach((t, i) => { s += board(10 + i * 180, 50, t, `sc-a${i}`) + T(85 + i * 180, 146, `glance ${i + 1}`, { fs: 16, anchor: 'middle', fill: '#555' }); });
  s += T(0, 182, 'Every statement = a new look (new snapshot).', { fs: 17, fw: 700, fill: PG });
  const x2 = 600;
  s += T(x2, 26, 'Repeatable Read: one photo for the whole report', { fs: 19, fw: 800, fill: XANH, k: 'sc-t2' });
  s += `<text x="${x2 + 10}" y="110" font-size="54">📸</text>` + board(x2 + 90, 50, '1 – 0', 'sc-b0');
  s += T(x2 + 260, 74, 'every line of your report', { fs: 17, fill: '#333' }) + T(x2 + 260, 98, 'uses THIS photo — totals', { fs: 17, fill: '#333' }) + T(x2 + 260, 122, 'always add up', { fs: 17, fill: '#333' });
  s += T(x2, 182, 'One snapshot for the whole transaction.', { fs: 17, fw: 700, fill: XANH });
  s += R(0, 210, 1100, 80, { fill: '#fff7ef', st: CAM, sw: 2, rx: 12, k: 'sc-q' }) + T(20, 244, 'Isolation level = WHEN the snapshot is taken + how strictly PostgreSQL checks the result.', { fs: 19, fw: 800, fill: '#7a3d12' }) +
    T(20, 274, 'Read Committed · Repeatable Read · Serializable — the three levels PostgreSQL really has.', { fs: 17, fill: '#555' });
  return s + '</svg>';
}

/** Khi nào chụp ảnh: RC mỗi câu lệnh, RR một lần ở câu ĐẦU TIÊN (không phải lúc BEGIN). */
export function whenSnapPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'ws');
  const lane = (y, ten, mau, snaps, k) => {
    let r = T(0, y + 6, ten, { fs: 19, fw: 800, fill: mau, k }) + L(250, y, 1090, y, { st: '#cbd5e1', sw: 4, m: 'ws' });
    [['BEGIN', 280], ['SELECT 1', 460], ['SELECT 2', 690], ['COMMIT', 950]].forEach(([t, x]) => { r += `<circle cx="${x}" cy="${y}" r="9" fill="#64748b"/>` + T(x, y + 32, t, { fs: 16, anchor: 'middle', mono: true, fill: '#333' }); });
    snaps.forEach((x) => { r += `<text x="${x - 20}" y="${y - 14}" font-size="34">📸</text>`; });
    return r;
  };
  s += lane(60, 'Read Committed', PG, [460, 690], 'ws-rc');
  s += lane(170, 'Repeatable Read', XANH, [460], 'ws-rr');
  s += T(250, 238, 'Not at BEGIN: the snapshot is taken by the first statement that needs one.', { fs: 17, fw: 700, fill: CAM, k: 'ws-n' });
  return s + '</svg>';
}

/** Write skew: hai bác sĩ trực, mỗi người kiểm "còn 2 người", mỗi người tự cho mình nghỉ. */
export function skewPic({ w = 1110, h = 290 } = {}) {
  let s = head(w, h, 'sk');
  const doc = (x, ten, mau, k) => `<text x="${x}" y="70" font-size="54">🧑‍⚕️</text>` + T(x + 30, 100, ten, { fs: 20, fw: 800, fill: mau, anchor: 'middle', k });
  s += doc(40, 'Cuong (A)', PG, 'sk-a') + doc(990, 'Mai (B)', CAM, 'sk-b');
  s += R(380, 20, 350, 120, { fill: '#fff', st: XAM, sw: 2.5, rx: 14, k: 'sk-tbl' }) + T(400, 50, 'oncall', { fs: 18, fw: 800, fill: '#555', mono: true }) +
    T(400, 84, "Cuong | on_call = true", { fs: 18, mono: true }) + T(400, 116, "Mai   | on_call = true", { fs: 18, mono: true });
  s += L(130, 60, 372, 60, { m: 'skb', st: PG, k: 'sk-ra' }) + T(140, 46, 'count = 2 ✓', { fs: 16, fw: 700, fill: PG });
  s += L(980, 60, 738, 60, { m: 'sk', st: CAM, k: 'sk-rb' }) + T(850, 46, 'count = 2 ✓', { fs: 16, fw: 700, fill: CAM });
  s += `<path data-k="sk-wa" d="M90,110 C120,200 380,210 470,140" fill="none" stroke="${PG}" stroke-width="3" marker-end="url(#skb)"/>` + T(150, 200, 'UPDATE … Cuong = false', { fs: 16, fw: 700, fill: PG, mono: true });
  s += `<path data-k="sk-wb" d="M1020,110 C990,200 740,210 640,140" fill="none" stroke="${CAM}" stroke-width="3" marker-end="url(#sk)"/>` + T(760, 200, 'UPDATE … Mai = false', { fs: 16, fw: 700, fill: CAM, mono: true });
  s += R(260, 226, 590, 56, { fill: '#fdf0ee', st: DO, sw: 2.5, rx: 12, k: 'sk-res' }) + T(555, 262, 'both COMMIT ⇒ nobody is on call', { fs: 21, fw: 800, fill: DO, anchor: 'middle' });
  return s + '</svg>';
}

/** SSI: hai phụ thuộc đọc→ghi chéo nhau tạo vòng ⇒ huỷ một giao dịch. */
export function ssiPic({ w = 1110, h = 260 } = {}) {
  let s = head(w, h, 'ss');
  s += R(40, 70, 300, 110, { fill: '#e8f0f8', st: PG, sw: 3, rx: 16, k: 'ss-a' }) + T(190, 112, 'Tx A', { fs: 24, fw: 800, fill: PG, anchor: 'middle' }) + T(190, 148, 'read all · wrote Cuong', { fs: 16, anchor: 'middle', fill: '#333' });
  s += R(770, 70, 300, 110, { fill: '#fdf1e3', st: CAM, sw: 3, rx: 16, k: 'ss-b' }) + T(920, 112, 'Tx B', { fs: 24, fw: 800, fill: CAM, anchor: 'middle' }) + T(920, 148, 'read all · wrote Mai', { fs: 16, anchor: 'middle', fill: '#333' });
  s += `<path data-k="ss-ab" d="M340,95 C480,30 630,30 770,95" fill="none" stroke="${TIM}" stroke-width="4" marker-end="url(#ss)"/>` + T(555, 40, 'A read what B then wrote (rw)', { fs: 16, fw: 700, fill: TIM, anchor: 'middle' });
  s += `<path data-k="ss-ba" d="M770,160 C630,225 480,225 340,160" fill="none" stroke="${TIM}" stroke-width="4" marker-end="url(#ss)"/>` + T(555, 238, 'B read what A then wrote (rw)', { fs: 16, fw: 700, fill: TIM, anchor: 'middle' });
  s += T(555, 128, 'a cycle ⇒ no serial order', { fs: 18, fw: 800, fill: DO, anchor: 'middle', k: 'ss-c' }) + T(555, 152, 'possible ⇒ abort one (40001)', { fs: 18, fw: 800, fill: DO, anchor: 'middle' });
  return s + '</svg>';
}

/* ═══════════ 11.4 ═══════════ */
/** Đời thường: sổ quỹ lớp — hai bạn cùng đọc 100, mỗi người ghi số MÌNH tính ⇒ một khoản chi biến mất. */
export function fundPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'fd');
  s += R(400, 20, 310, 200, { fill: '#fffdf4', st: NAU, sw: 3, rx: 10, k: 'fd-book' }) + T(555, 56, '📒 class fund', { fs: 20, fw: 800, fill: NAU, anchor: 'middle' });
  s += T(430, 100, 'balance: 100', { fs: 24, mono: true, fill: '#888' }) + L(430, 92, 610, 92, { st: DO, sw: 2.5 });
  s += T(430, 140, 'balance: 90', { fs: 24, mono: true, fill: '#888' }) + L(430, 132, 590, 132, { st: DO, sw: 2.5 });
  s += T(430, 180, 'balance: 80', { fs: 24, mono: true, fw: 800, fill: DO, k: 'fd-80' });
  s += `<text x="40" y="90" font-size="50">🧑‍🎓</text>` + T(30, 130, 'An: “I spend 10”', { fs: 18, fw: 800, fill: PG }) + T(30, 156, 'reads 100 → writes 90', { fs: 17, fill: '#333', mono: true });
  s += `<text x="1000" y="90" font-size="50">👩‍🎓</text>` + T(860, 130, 'Binh: “I spend 20”', { fs: 18, fw: 800, fill: CAM }) + T(830, 156, 'reads 100 → writes 80', { fs: 17, fill: '#333', mono: true });
  s += L(260, 120, 396, 130, { m: 'fdb', st: PG, k: 'fd-a' }) + L(850, 120, 714, 175, { m: 'fd', st: CAM, k: 'fd-b' });
  s += R(150, 236, 810, 56, { fill: '#fdf0ee', st: DO, sw: 2.5, rx: 12, k: 'fd-lost' }) + T(555, 272, '30 was spent, the book says 80 — An’s 10 vanished (lost update)', { fs: 20, fw: 800, fill: DO, anchor: 'middle' });
  return s + '</svg>';
}

/** Hàng chờ khoá: A giữ khoá dòng, B xếp hàng (ShareLock trên transactionid của A — đúng như pg_locks). */
export function lockQueuePic({ w = 1110, h = 230 } = {}) {
  let s = head(w, h, 'lq');
  s += R(420, 50, 270, 120, { fill: '#fff', st: NAU, sw: 3, rx: 14, k: 'lq-row' }) + T(555, 92, "row id = 'A'", { fs: 22, fw: 800, anchor: 'middle', mono: true }) + T(555, 128, '🔒 locked by A', { fs: 19, fw: 700, anchor: 'middle', fill: PG });
  s += R(20, 60, 300, 100, { fill: '#e8f0f8', st: PG, sw: 3, rx: 14, k: 'lq-a' }) + T(170, 100, 'A: UPDATE … (holds)', { fs: 19, fw: 800, fill: PG, anchor: 'middle' }) + T(170, 130, 'ExclusiveLock · granted', { fs: 16, anchor: 'middle', mono: true, fill: '#333' });
  s += R(790, 60, 300, 100, { fill: '#fdf1e3', st: CAM, sw: 3, rx: 14, k: 'lq-b' }) + T(940, 100, 'B: UPDATE … ⏳ waits', { fs: 19, fw: 800, fill: CAM, anchor: 'middle' }) + T(940, 130, 'ShareLock on A’s xact · f', { fs: 16, anchor: 'middle', mono: true, fill: '#333' });
  s += L(320, 110, 414, 110, { m: 'lqb', st: PG }) + L(786, 110, 696, 110, { m: 'lq', st: CAM, dash: '8 6' });
  s += T(555, 214, 'held until A’s transaction ENDS — not until the statement ends', { fs: 18, fw: 800, anchor: 'middle', fill: DO, k: 'lq-n' });
  return s + '</svg>';
}

/** Dòng thời gian lost update (số thật pg-11-4b). */
export function lostPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'lu');
  s += T(0, 30, 'Session A', { fs: 20, fw: 800, fill: PG }) + T(0, 150, 'Session B', { fs: 20, fw: 800, fill: CAM });
  const st = (x, y, t, mau, k) => R(x, y, 210, 60, { fill: '#fff', st: mau, sw: 2.5, rx: 10, k }) + T(x + 105, y + 38, t, { fs: 18, fw: 700, anchor: 'middle', mono: true, fill: mau });
  s += st(150, 0, 'read → 100', PG, 'lu-a1') + st(560, 0, 'write 100 − 10', PG, 'lu-a2') + st(820, 0, 'COMMIT (90)', PG, 'lu-a3');
  s += st(300, 120, 'read → 100', CAM, 'lu-b1') + st(820, 120, 'write 100 − 20', CAM, 'lu-b2');
  s += L(380, 64, 380, 116, { st: '#aaa', dash: '5 5' });
  s += T(150, 214, 'B computed from a value that was already stale ⇒ final 80.00, not 70.00', { fs: 19, fw: 800, fill: DO, k: 'lu-n' });
  return s + '</svg>';
}

/** SKIP LOCKED: hai worker lấy hai cặp việc khác nhau, không chờ nhau. */
export function skipPic({ w = 1110, h = 230 } = {}) {
  let s = head(w, h, 'sl');
  for (let i = 0; i < 6; i++) {
    const own = i < 2 ? 'A' : i < 4 ? 'B' : '';
    const mau = own === 'A' ? PG : own === 'B' ? CAM : XAM;
    s += R(300 + i * 105, 70, 90, 90, { fill: own ? mau + '18' : '#fff', st: mau, sw: 3, rx: 10, k: `sl-j${i}` }) + T(345 + i * 105, 110, `job-${i + 1}`, { fs: 16, fw: 800, anchor: 'middle', mono: true, fill: mau }) + T(345 + i * 105, 140, own ? `🔒 ${own}` : 'queued', { fs: 15, anchor: 'middle', fill: mau });
  }
  s += `<text x="40" y="96" font-size="44">🤖</text>` + T(30, 140, 'worker A', { fs: 18, fw: 800, fill: PG });
  s += `<text x="40" y="206" font-size="44">🤖</text>` + T(110, 196, 'worker B: skips 1–2 (locked)', { fs: 17, fw: 700, fill: CAM });
  s += L(150, 84, 292, 104, { m: 'slb', st: PG }) + `<path d="M150,190 C300,215 480,215 505,166" fill="none" stroke="${CAM}" stroke-width="3" marker-end="url(#sl)"/>`;
  s += T(950, 110, 'no waiting', { fs: 18, fw: 800, fill: XANH }) + T(950, 136, 'no double work', { fs: 18, fw: 800, fill: XANH });
  return s + '</svg>';
}

/** Deadlock: vòng khép kín A ↔ B, PostgreSQL phá sau deadlock_timeout. */
export function deadlockPic({ w = 1110, h = 270 } = {}) {
  let s = head(w, h, 'dl');
  s += R(60, 80, 260, 110, { fill: '#e8f0f8', st: PG, sw: 3, rx: 16, k: 'dl-a' }) + T(190, 122, 'Tx A', { fs: 24, fw: 800, fill: PG, anchor: 'middle' }) + T(190, 156, "holds row 'A'", { fs: 17, anchor: 'middle', mono: true });
  s += R(790, 80, 260, 110, { fill: '#fdf1e3', st: CAM, sw: 3, rx: 16, k: 'dl-b' }) + T(920, 122, 'Tx B', { fs: 24, fw: 800, fill: CAM, anchor: 'middle' }) + T(920, 156, "holds row 'B'", { fs: 17, anchor: 'middle', mono: true });
  s += `<path data-k="dl-ab" d="M320,100 C460,20 650,20 790,100" fill="none" stroke="${PG}" stroke-width="4" stroke-dasharray="10 7" marker-end="url(#dlb)"/>` + T(555, 40, "A waits for row 'B'", { fs: 17, fw: 800, anchor: 'middle', fill: PG });
  s += `<path data-k="dl-ba" d="M790,170 C650,250 460,250 320,170" fill="none" stroke="${CAM}" stroke-width="4" stroke-dasharray="10 7" marker-end="url(#dl)"/>` + T(555, 262, "B waits for row 'A'", { fs: 17, fw: 800, anchor: 'middle', fill: CAM });
  s += T(555, 128, '🔁 closed cycle', { fs: 22, fw: 800, anchor: 'middle', fill: DO, k: 'dl-c' }) + T(555, 158, 'after deadlock_timeout (1 s):', { fs: 16, anchor: 'middle', fill: '#555' }) + T(555, 180, 'one victim ⇒ ERROR, other finishes', { fs: 16, anchor: 'middle', fill: '#555', fw: 700 });
  return s + '</svg>';
}
