/**
 * pg-14-hinh.mjs — hình dùng chung cho Chương 14 — Kết nối, pool & vận hành (deck pg-14-1…4). Không phải deck. (agent c14, 26/10/2026)
 * Chữ SVG: rộng ≈ 0,602 × cỡ chữ / ký tự (mono) — đặt nhãn bằng tw(). Phần tử video cần chú thích có data-k.
 * Mọi con số trong hình chép từ video-bai-giang/src/khung/pg/that/pg-14-*.out.txt (PostgreSQL 17.11 chạy thật:
 * container pgcourse17 schema ch14 · container nháp pgc14tmp · PgBouncer 1.23.1 · Prisma 5.22 · node-postgres 8.13.1).
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7a5a9a', XAM = '#8a8a8a', VANG = '#d4a017';
export const tw = (s, fs) => String(s).length * fs * 0.602;
const head = (w, h, id) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">` +
  `<defs>` + [['', NAU], ['x', XANH], ['d', DO], ['b', PG], ['t', TIM], ['c', CAM]].map(([k, c]) => `<marker id="${id}${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`).join('') + `</defs>`;
const T = (x, y, s, { fs = 20, fw = 400, fill = '#333', anchor = 'start', mono = false, k = '', it = false } = {}) =>
  `<text${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" font-size="${fs}" font-weight="${fw}" fill="${fill}" text-anchor="${anchor}"${mono ? ` font-family="${MONO}"` : ''}${it ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
const R = (x, y, w, h, { fill = '#fff', st = PG, sw = 2.5, rx = 10, k = '', dash = '' } = {}) =>
  `<rect${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${st}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const L = (x1, y1, x2, y2, { st = NAU, sw = 3, m = '', dash = '', k = '' } = {}) =>
  `<line${k ? ` data-k="${k}"` : ''} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${st}" stroke-width="${sw}"${m ? ` marker-end="url(#${m})"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const Ci = (cx, cy, r, { fill = '#fff', st = PG, sw = 2.5, k = '' } = {}) => `<circle${k ? ` data-k="${k}"` : ''} cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>`;
const E = (x, y, s, fs = 34) => `<text x="${x}" y="${y}" font-size="${fs}" text-anchor="middle">${s}</text>`;

/* ═══════════════════════════ 14.1 ═══════════════════════════ */

/** Đời thường: quán ăn thuê một người phục vụ RIÊNG cho mỗi khách vừa bước vào. */
export function waiterPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'wt');
  s += R(0, 0, 640, h, { fill: '#fdf0ee', st: DO, k: 'wt-l' });
  s += T(20, 34, 'Restaurant A: hire a waiter per guest', { fs: 21, fw: 800, fill: DO });
  for (let i = 0; i < 6; i++) {
    const x = 60 + i * 96;
    s += E(x, 112, '🧑', 40) + E(x, 170, '🤵', 40);
    s += L(x, 124, x, 140, { st: '#bbb', sw: 2 });
  }
  s += T(20, 214, '• hiring takes time (interview, uniform) — every arrival', { fs: 17, fill: '#7a2a1d' });
  s += T(20, 242, '• waiters cost wages even while their guest just sits', { fs: 17, fill: '#7a2a1d' });
  s += T(20, 270, '• still only 4 cooks in the kitchen', { fs: 17, fill: '#7a2a1d' });
  s += R(670, 0, 440, h, { fill: '#eef4fa', st: PG, k: 'wt-r' });
  s += T(690, 34, 'PostgreSQL works like A', { fs: 21, fw: 800, fill: PG });
  s += T(690, 80, 'guest   = client connection', { fs: 19, mono: true, fill: '#333' });
  s += T(690, 112, 'waiter  = backend PROCESS', { fs: 19, mono: true, fill: '#333' });
  s += T(690, 144, 'hiring  = connect + fork()', { fs: 19, mono: true, fill: '#333' });
  s += T(690, 176, 'wages   = memory per process', { fs: 19, mono: true, fill: '#333' });
  s += T(690, 208, 'cooks   = CPU cores', { fs: 19, mono: true, fill: '#333' });
  s += T(690, 256, 'Lesson 14.2: share a few waiters', { fs: 18, fw: 700, fill: XANH });
  s += T(690, 282, '(a pool) instead of hiring per guest.', { fs: 18, fill: XANH });
  return s + '</svg>';
}

/** postmaster fork một backend cho mỗi kết nối; bộ nhớ chung vs bộ nhớ riêng. PID thật (ps trong pgc14tmp). */
export function forkPic({ w = 1110, h = 330 } = {}) {
  let s = head(w, h, 'fk');
  const cl = [['web-1', 1093], ['web-2', 1101], ['worker', 1109]];
  cl.forEach(([t], i) => { const y = 20 + i * 86; s += R(0, y, 170, 62, { fill: '#fff', st: XAM, k: 'fk-cl' }) + T(85, y + 39, t, { fs: 21, fw: 700, anchor: 'middle', mono: true }); });
  s += R(290, 96, 200, 92, { fill: '#fffaf5', st: CAM, sw: 3, k: 'fk-pm' }) + T(390, 132, 'postmaster', { fs: 22, fw: 800, fill: NAU, anchor: 'middle', mono: true }) + T(390, 162, 'PID 1 · listens', { fs: 16, fill: '#666', anchor: 'middle' });
  cl.forEach((_, i) => { const y = 51 + i * 86; s += L(172, y, 286, 142, { st: XAM, sw: 2, m: 'fk' }); });
  s += T(520, 76, 'fork()', { fs: 19, fw: 800, fill: CAM, mono: true });
  cl.forEach(([t, pid], i) => {
    const y = 14 + i * 86;
    s += L(492, 142, 616, y + 37, { st: CAM, sw: 3, m: 'fkc' });
    s += R(620, y, 300, 74, { fill: '#eef4fa', st: PG, k: 'fk-be' }) + T(636, y + 30, `backend ${pid}`, { fs: 20, fw: 800, fill: PG, mono: true }) + T(636, y + 56, `serves ${t} only`, { fs: 16, fill: '#555' });
    s += R(930, y + 8, 180, 58, { fill: '#fff7ef', st: CAM, sw: 2, k: 'fk-priv' }) + T(1020, y + 32, 'private memory', { fs: 15, fw: 700, fill: NAU, anchor: 'middle' }) + T(1020, y + 54, 'work_mem, caches', { fs: 14, fill: '#666', anchor: 'middle' });
  });
  s += R(290, 282, 820, 44, { fill: '#f1f9f4', st: XANH, k: 'fk-shared' }) + T(700, 311, 'shared memory: shared_buffers (data pages) — one copy for ALL processes', { fs: 18, fw: 700, fill: XANH, anchor: 'middle' });
  return s + '</svg>';
}

/** Thanh đo: A kết nối mới / B một kết nối / C pool — số thật pg-14-1d.out.txt. */
export function connectBars({ w = 1110, rh = 52 } = {}) {
  const it = [['A · new connection per query', 6.765, DO, 'cb-a'], ['B · one connection, reused', 0.425, XANH, 'cb-b'], ['C · pool (max 10)', 0.442, PG, 'cb-c']];
  const lw = 330, max = 6.765, bw = w - lw - 150;
  let s = head(w, it.length * (rh + 16) + 6, 'cb');
  it.forEach(([t, v, m, k], i) => {
    const y = i * (rh + 16);
    s += T(0, y + rh / 2 + 7, t, { fs: 19, fw: 700, fill: '#333' });
    s += R(lw, y + 4, Math.max(6, (v / max) * bw), rh - 8, { fill: m, st: m, rx: 6, k });
    s += T(lw + Math.max(6, (v / max) * bw) + 12, y + rh / 2 + 8, `${v.toFixed(3)} ms`, { fs: 22, fw: 800, fill: m, mono: true });
  });
  return s + '</svg>';
}

/** 100 suất kết nối: 97 cho role thường + 3 dành superuser (superuser_reserved_connections). */
export function slotsPic({ w = 1110, h = 250, dung = 97 } = {}) {
  let s = head(w, h, 'sl');
  const c = 25, cw = 40, ch = 36, gap = 4;
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / c), q = i % c, x = q * (cw + gap), y = 10 + r * (ch + gap);
    const res = i >= 97;
    const m = res ? CAM : i < dung ? PG : '#fff';
    s += R(x, y, cw, ch, { fill: res ? '#fff3e0' : i < dung ? '#dbe7f3' : '#fff', st: m, sw: 2, rx: 6, k: res ? 'sl-res' : 'sl-app' });
    s += T(x + cw / 2, y + 24, String(i + 1), { fs: 14, fw: 700, fill: res ? NAU : PG, anchor: 'middle', mono: true });
  }
  s += R(0, 190, 22, 22, { fill: '#dbe7f3', st: PG, rx: 5 }) + T(32, 208, '97 slots for normal roles (your app)', { fs: 19, fw: 700, fill: PG, k: 'sl-t1' });
  s += R(520, 190, 22, 22, { fill: '#fff3e0', st: CAM, rx: 5 }) + T(552, 208, '3 kept for superusers — the admin’s way in', { fs: 19, fw: 700, fill: NAU, k: 'sl-t2' });
  s += T(0, 242, 'max_connections = 100 · superuser_reserved_connections = 3 · reserved_connections = 0', { fs: 15, fill: '#666', mono: true });
  return s + '</svg>';
}

/** Phép nhân: 12 tiến trình × pool 10 = 120 > 100 — thanh ngang xếp chồng 12 khúc. */
export function multiplyPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'mp');
  const x0 = 20, u = 8.6, y = 70, bh = 70;
  s += T(0, 24, 'Each Node.js process brings its OWN pool of 10 — and they add up:', { fs: 20, fw: 800, fill: PG });
  for (let i = 0; i < 12; i++) {
    const over = (i + 1) * 10 > 97;
    const x = x0 + i * 10 * u;
    s += R(x, y, 10 * u - 3, bh, { fill: over ? '#f6c4bd' : '#dbe7f3', st: over ? DO : PG, sw: 2, rx: 6, k: 'mp-b' });
    s += T(x + 5 * u, y + 30, `#${i + 1}`, { fs: 16, fw: 800, fill: over ? DO : PG, anchor: 'middle', mono: true });
    s += T(x + 5 * u, y + 54, 'pool 10', { fs: 13, fill: '#555', anchor: 'middle' });
  }
  const X = (n) => x0 + n * u;
  s += L(X(97), y - 22, X(97), y + bh + 22, { st: CAM, sw: 3, dash: '4 4' }) + T(X(97) - 6, y - 28, '97 (app roles)', { fs: 15, fw: 800, fill: NAU, anchor: 'end' });
  s += L(X(100), y - 22, X(100), y + bh + 22, { st: DO, sw: 4, k: 'mp-lim' }) + T(X(100) + 6, y - 28, '100', { fs: 16, fw: 800, fill: DO, mono: true });
  for (let n = 0; n <= 120; n += 20) s += T(X(n), y + bh + 44, String(n), { fs: 14, fill: '#777', anchor: 'middle', mono: true });
  s += T(0, y + bh + 76, 'requested by: web containers, workers, cron, migrate, exporter…', { fs: 16, fill: '#666' });
  s += R(780, 196, 330, 52, { fill: '#fdf0ee', st: DO, k: 'mp-sum' }) + T(945, 231, '12 × 10 = 120 > 100', { fs: 26, fw: 800, fill: DO, anchor: 'middle', mono: true });
  return s + '</svg>';
}

/** Serverless: mỗi bản chạy một kết nối riêng, nở theo lưu lượng. */
export function serverlessPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'sv');
  s += T(0, 24, 'Serverless without a pooler', { fs: 20, fw: 800, fill: DO });
  for (let i = 0; i < 8; i++) {
    const y = 40 + i * 30;
    s += R(0, y, 150, 24, { fill: '#fff', st: XAM, sw: 1.5, rx: 5, k: 'sv-fn' }) + T(75, y + 17, `function #${i + 1}`, { fs: 13, anchor: 'middle', mono: true });
    s += L(152, y + 12, 330, 150, { st: DO, sw: 1.6, m: 'svd' });
  }
  s += T(0, 290, '1,000 concurrent invocations ⇒ 1,000 connections', { fs: 16, fw: 700, fill: DO });
  s += R(336, 110, 150, 80, { fill: '#eef4fa', st: PG, k: 'sv-db1' }) + T(411, 145, 'PostgreSQL', { fs: 18, fw: 800, fill: PG, anchor: 'middle' }) + T(411, 172, 'max 100', { fs: 16, fill: DO, anchor: 'middle', mono: true });
  s += L(540, 20, 540, 290, { st: '#ddd', sw: 2 });
  s += T(580, 24, 'With a pooler in front', { fs: 20, fw: 800, fill: XANH });
  for (let i = 0; i < 8; i++) { const y = 40 + i * 30; s += R(580, y, 150, 24, { fill: '#fff', st: XAM, sw: 1.5, rx: 5 }) + T(655, y + 17, `function #${i + 1}`, { fs: 13, anchor: 'middle', mono: true }); s += L(732, y + 12, 798, 150, { st: XAM, sw: 1.4, m: 'sv' }); }
  s += R(802, 112, 130, 76, { fill: '#fffaf5', st: CAM, k: 'sv-pool' }) + T(867, 146, 'pooler', { fs: 18, fw: 800, fill: NAU, anchor: 'middle' }) + T(867, 170, 'PgBouncer…', { fs: 14, fill: '#666', anchor: 'middle' });
  for (let i = 0; i < 3; i++) s += L(934, 132 + i * 18, 978, 132 + i * 18, { st: XANH, sw: 3, m: 'svx' });
  s += R(982, 110, 128, 80, { fill: '#eef4fa', st: PG, k: 'sv-db2' }) + T(1046, 145, 'PostgreSQL', { fs: 16, fw: 800, fill: PG, anchor: 'middle' }) + T(1046, 172, '~10–20 used', { fs: 14, fill: XANH, anchor: 'middle', mono: true });
  s += T(580, 290, 'plus connection_limit=1 per function instance', { fs: 16, fw: 700, fill: XANH });
  return s + '</svg>';
}

/* ═══════════════════════════ 14.2 ═══════════════════════════ */

/** Bến xe buýt: nhiều khách, ít xe — xe chạy vòng, khách xếp hàng ở bến. */
export function busPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'bs');
  s += T(0, 26, 'Many passengers, a few buses that keep looping', { fs: 21, fw: 800, fill: PG });
  s += R(0, 50, 330, 220, { fill: '#fff7ef', st: CAM, k: 'bs-stop' }) + T(165, 78, 'bus stop (the queue)', { fs: 18, fw: 800, fill: NAU, anchor: 'middle' });
  for (let i = 0; i < 18; i++) s += E(30 + (i % 6) * 54, 130 + Math.floor(i / 6) * 50, '🧍', 34);
  s += T(165, 262, '18 requests waiting', { fs: 16, fill: '#7a3d12', anchor: 'middle' });
  for (let i = 0; i < 3; i++) {
    const y = 74 + i * 66;
    s += `<path d="M340 ${y + 20} C 520 ${y - 20}, 640 ${y - 20}, 800 ${y + 20}" fill="none" stroke="${PG}" stroke-width="3" stroke-dasharray="8 6" marker-end="url(#bsb)"/>`;
    s += E(560, y + 8, '🚌', 42);
  }
  s += R(810, 60, 300, 200, { fill: '#eef4fa', st: PG, k: 'bs-db' }) + T(960, 100, 'PostgreSQL', { fs: 22, fw: 800, fill: PG, anchor: 'middle' });
  s += T(960, 140, 'bus = one connection', { fs: 17, anchor: 'middle', fill: '#333' });
  s += T(960, 168, 'ride = one query / transaction', { fs: 17, anchor: 'middle', fill: '#333' });
  s += T(960, 196, 'pool size = number of buses', { fs: 17, anchor: 'middle', fill: '#333' });
  s += T(960, 224, 'pool_timeout = max wait at the stop', { fs: 17, anchor: 'middle', fill: CAM });
  s += T(560, 290, 'No new bus is bought per passenger — buses return and pick up the next one.', { fs: 17, fill: '#555', anchor: 'middle' });
  return s + '</svg>';
}

/** Dòng thời gian 6 request trên 2 làn (connection_limit=2, pool_timeout=2) — số thật pg-14-2a.out.txt. */
export function prismaTimeline({ w = 1110, h = 320 } = {}) {
  let s = head(w, h, 'pt');
  const x0 = 150, sc = 260; // 1 s = 260 px
  const X = (t) => x0 + t * sc;
  for (let t = 0; t <= 3.5; t += 0.5) s += L(X(t), 30, X(t), 248, { st: '#e5e5e5', sw: 1 }) + T(X(t), 270, `${t.toFixed(1)} s`, { fs: 15, fill: '#777', anchor: 'middle', mono: true });
  s += T(0, 20, 'connection_limit = 2 · pool_timeout = 2 · 6 requests at once, each holds a connection 1.5 s', { fs: 17, fw: 700, fill: PG });
  const lane = (y, ten) => T(0, y + 32, ten, { fs: 18, fw: 800, fill: PG, mono: true });
  s += lane(40, 'conn #1') + lane(100, 'conn #2');
  const blk = (y, a, b, n, k, m = PG) => R(X(a), y + 6, (b - a) * sc - 4, 44, { fill: m + '22', st: m, k }) + T(X(a) + 10, y + 36, `req ${n} · done +${b.toFixed(2)} s`, { fs: 16, fw: 700, fill: m, mono: true });
  s += blk(40, 0, 1.51, 1, 'pt-1') + blk(100, 0, 1.51, 3, 'pt-2') + blk(40, 1.51, 3.02, 2, 'pt-3', XANH) + blk(100, 1.51, 3.02, 5, 'pt-4', XANH);
  s += lane(162, 'waiting');
  s += R(X(0), 168, 2 * sc - 4, 34, { fill: '#fff7ef', st: CAM, sw: 2, k: 'pt-w' }) + T(X(0) + 10, 191, 'req 2, 4, 5, 6 wait for a free connection…', { fs: 15, fill: NAU });
  s += L(X(2.02), 150, X(2.02), 250, { st: DO, sw: 3, dash: '6 4', k: 'pt-to' });
  s += R(X(2.02) + 8, 196, 420, 46, { fill: '#fdf0ee', st: DO, k: 'pt-err' }) + T(X(2.02) + 18, 225, '+2.02 s  P2024 · req 4 and 6 time out', { fs: 17, fw: 800, fill: DO, mono: true });
  s += T(0, 312, 'Requests 2 and 5 waited 1.5 s (< 2 s) and succeeded; 4 and 6 would have waited 3 s ⇒ error after 2 s.', { fs: 16, fill: '#555' });
  return s + '</svg>';
}

/** PgBouncer: 150 khách → 10 kết nối thật. Số thật pg-14-2c.out.txt. */
export function bouncerPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'bo');
  for (let i = 0; i < 15; i++) { const y = 10 + i * 18.5; s += R(0, y, 120, 14, { fill: '#fff', st: XAM, sw: 1.2, rx: 4 }); s += L(122, y + 7, 356, 150, { st: '#c7cdd4', sw: 1.2 }); }
  s += T(60, 296, '150 clients', { fs: 17, fw: 800, fill: '#555', anchor: 'middle', k: 'bo-cl' });
  s += R(360, 70, 260, 160, { fill: '#fffaf5', st: CAM, sw: 3, k: 'bo-pgb' }) + T(490, 106, 'PgBouncer', { fs: 24, fw: 800, fill: NAU, anchor: 'middle' });
  s += T(490, 138, 'cl_active   21', { fs: 17, mono: true, anchor: 'middle' }) + T(490, 164, 'cl_waiting 129', { fs: 17, mono: true, anchor: 'middle', fill: CAM }) + T(490, 190, 'sv_active   10', { fs: 17, mono: true, anchor: 'middle', fill: XANH });
  s += T(490, 218, 'one small process', { fs: 14, fill: '#777', anchor: 'middle' });
  for (let i = 0; i < 10; i++) { const y = 62 + i * 18; s += L(622, 150, 800, y + 6, { st: XANH, sw: 2.4 }); }
  s += R(804, 50, 306, 200, { fill: '#eef4fa', st: PG, k: 'bo-db' }) + T(957, 90, 'PostgreSQL', { fs: 22, fw: 800, fill: PG, anchor: 'middle' });
  s += T(957, 128, '10 backend processes', { fs: 18, fw: 700, anchor: 'middle', fill: XANH });
  s += T(957, 158, '(pg_stat_activity: 10)', { fs: 16, anchor: 'middle', mono: true, fill: '#555' });
  s += T(957, 196, 'max_connections 100', { fs: 16, anchor: 'middle', mono: true, fill: '#555' });
  s += T(957, 222, 'never reached', { fs: 16, anchor: 'middle', fill: XANH });
  return s + '</svg>';
}

/** Ba chế độ: kết nối máy chủ được trả lại khi nào. */
export function modesPic({ w = 1110, h = 270 } = {}) {
  let s = head(w, h, 'md');
  const rows = [['session', 'the whole client session', [[0, 1]], 'md-s', PG], ['transaction', 'BEGIN … COMMIT, then back', [[0.08, 0.3], [0.55, 0.72]], 'md-t', XANH], ['statement', 'one statement only', [[0.08, 0.13], [0.2, 0.25], [0.55, 0.6]], 'md-st', CAM]];
  const x0 = 200, ww = 640;
  s += T(x0, 18, 'client connected ─────────────────────────────▶ disconnects', { fs: 15, fill: '#777', mono: true });
  rows.forEach(([t, d, segs, k, m], i) => {
    const y = 40 + i * 76;
    s += T(0, y + 34, t, { fs: 22, fw: 800, fill: m, mono: true, k });
    s += R(x0, y + 10, ww, 40, { fill: '#f7f7f7', st: '#ddd', sw: 1.5, rx: 6 });
    segs.forEach(([a, b]) => { s += R(x0 + a * ww, y + 10, (b - a) * ww, 40, { fill: m, st: m, rx: 6 }); });
    s += T(x0 + ww + 16, y + 36, d, { fs: 16, fill: '#444' });
  });
  s += T(x0, 266, 'coloured = a real server connection is tied to this client', { fs: 15, fill: '#666', it: true });
  return s + '</svg>';
}

/** Một khách, ba câu, ba backend: SET nằm lại backend cũ (pid thật pg-14-2d.out.txt). */
export function hopPic({ w = 1110, h = 230 } = {}) {
  let s = head(w, h, 'hp');
  s += R(0, 70, 170, 80, { fill: '#fff', st: XAM, k: 'hp-cl' }) + T(85, 104, 'your psql', { fs: 18, fw: 700, anchor: 'middle' }) + T(85, 130, '(one client)', { fs: 14, fill: '#777', anchor: 'middle' });
  s += R(250, 70, 170, 80, { fill: '#fffaf5', st: CAM, k: 'hp-pgb' }) + T(335, 104, 'PgBouncer', { fs: 18, fw: 800, fill: NAU, anchor: 'middle' }) + T(335, 130, 'transaction', { fs: 14, fill: '#777', anchor: 'middle', mono: true });
  s += L(172, 110, 246, 110, { st: XAM, sw: 3, m: 'hp' });
  const st = [['SELECT pg_backend_pid();', 'backend 6126', PG], ["SET statement_timeout = '1s';", 'backend ?', CAM], ['SHOW statement_timeout;  →  0', 'backend 6125', DO]];
  st.forEach(([q, b, m], i) => {
    const y = 10 + i * 74;
    s += L(422, 110, 520, y + 30, { st: m, sw: 2.5, m: 'hpc' });
    s += R(524, y, 360, 60, { fill: '#0f1720', st: '#0f1720', rx: 8, k: 'hp-q' }) + T(538, y + 37, q, { fs: 16, mono: true, fill: '#d6dde6' });
    s += R(900, y + 6, 210, 48, { fill: m + '18', st: m, k: 'hp-be' }) + T(1005, y + 37, b, { fs: 17, fw: 800, fill: m, anchor: 'middle', mono: true });
  });
  return s + '</svg>';
}

/* ═══════════════════════════ 14.3 ═══════════════════════════ */

/** Đời thường: dọn bàn (VACUUM) vs sửa lại cả quán (VACUUM FULL). */
export function dishesPic({ w = 1110, h = 290 } = {}) {
  let s = head(w, h, 'ds');
  s += R(0, 0, 350, h, { fill: '#fdf0ee', st: DO, k: 'ds-1' }) + T(175, 32, 'Dirty tables pile up', { fs: 20, fw: 800, fill: DO, anchor: 'middle' });
  for (let i = 0; i < 6; i++) s += E(60 + (i % 3) * 115, 104 + Math.floor(i / 3) * 80, i % 2 ? '🍽️' : '🥡', 44);
  s += T(175, 262, 'dead tuples = used dishes', { fs: 17, fill: '#7a2a1d', anchor: 'middle' });
  s += R(380, 0, 350, h, { fill: '#f1f9f4', st: XANH, k: 'ds-2' }) + T(555, 32, 'VACUUM: busboy clears', { fs: 20, fw: 800, fill: XANH, anchor: 'middle' });
  s += E(470, 120, '🧹', 52) + E(600, 120, '🪑', 46);
  s += T(555, 186, 'tables free for the next guests', { fs: 16, fill: '#1f6b40', anchor: 'middle' });
  s += T(555, 214, 'restaurant stays open', { fs: 16, fill: '#1f6b40', anchor: 'middle' });
  s += T(555, 262, 'same floor size (file does not shrink)', { fs: 16, fw: 700, fill: XANH, anchor: 'middle' });
  s += R(760, 0, 350, h, { fill: '#fff7ef', st: CAM, k: 'ds-3' }) + T(935, 32, 'VACUUM FULL: rebuild', { fs: 20, fw: 800, fill: NAU, anchor: 'middle' });
  s += E(870, 120, '🚧', 52) + E(1000, 120, '🔒', 46);
  s += T(935, 186, 'smaller restaurant afterwards', { fs: 16, fill: '#7a3d12', anchor: 'middle' });
  s += T(935, 214, 'but CLOSED while it is rebuilt', { fs: 16, fw: 700, fill: DO, anchor: 'middle' });
  s += T(935, 262, 'ACCESS EXCLUSIVE lock', { fs: 16, fw: 700, fill: NAU, anchor: 'middle', mono: true });
  return s + '</svg>';
}

/** HOT vs không HOT: sửa cột CÓ chỉ mục ⇒ mọi chỉ mục nhận mục mới. */
export function hotPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'ht');
  const side = (x, tieuDe, mau, hot, k) => {
    let r = R(x, 0, 530, h, { fill: mau + '0d', st: mau, k }) + T(x + 265, 32, tieuDe, { fs: 20, fw: 800, fill: mau, anchor: 'middle' });
    r += R(x + 30, 60, 220, 130, { fill: '#fff', st: PG }) + T(x + 140, 84, 'heap page', { fs: 16, fw: 700, fill: PG, anchor: 'middle' });
    r += R(x + 44, 96, 192, 34, { fill: '#f3f3f3', st: XAM, sw: 1.5, rx: 6 }) + T(x + 140, 119, 'old version (dead)', { fs: 14, anchor: 'middle', fill: '#777' });
    r += R(x + 44, 142, 192, 34, { fill: '#dff0e5', st: XANH, sw: 1.5, rx: 6 }) + T(x + 140, 165, 'new version', { fs: 14, anchor: 'middle', fill: XANH });
    ['pkey', 'khach_id', 'trang_thai'].forEach((ix, i) => {
      const y = 50 + i * 54;
      r += R(x + 330, y, 170, 40, { fill: '#fff7ef', st: CAM, sw: 2, rx: 8 }) + T(x + 415, y + 26, ix, { fs: 15, fw: 700, anchor: 'middle', mono: true, fill: NAU });
      r += L(x + 328, y + 20, x + 240, 113, { st: '#bbb', sw: 1.6, m: 'ht' });
      if (!hot) r += L(x + 328, y + 24, x + 240, 159, { st: DO, sw: 2.4, m: 'htd' });
    });
    if (hot) r += `<path d="M${x + 236} 113 C ${x + 270} 120, ${x + 270} 152, ${x + 236} 159" fill="none" stroke="${XANH}" stroke-width="3" marker-end="url(#htx)"/>`;
    return r;
  };
  s += side(0, 'HOT update (indexed columns unchanged)', XANH, true, 'ht-hot') + T(265, 232, 'old version points to the new one', { fs: 16, anchor: 'middle', fill: '#1f6b40' }) + T(265, 258, 'indexes untouched · page pruning cleans', { fs: 16, anchor: 'middle', fill: '#1f6b40' }) + T(265, 286, 'n_tup_hot_upd counts these', { fs: 15, anchor: 'middle', fill: '#555', mono: true });
  s += side(580, 'Non-HOT (trang_thai is indexed)', DO, false, 'ht-cold') + T(845, 232, 'EVERY index gets a new entry (red)', { fs: 16, anchor: 'middle', fill: DO }) + T(845, 258, 'indexes bloat too: 7208 kB → 14 MB', { fs: 16, fw: 700, anchor: 'middle', fill: DO }) + T(845, 286, 'our run: n_tup_hot_upd = 0', { fs: 15, anchor: 'middle', fill: '#555', mono: true });
  return s + '</svg>';
}

/** 5 trạng thái kích thước bảng + chỉ mục (pg-14-3.out.txt). */
export function size5({ w = 1110, rh = 50 } = {}) {
  const it = [['after loading 200,000 rows', 11, 7.04, PG], ['after UPDATE of every row', 23, 14, DO], ['after VACUUM (dead = 0)', 23, 14, TIM], ['after 2nd UPDATE (space reused)', 23, 16, TIM], ['after VACUUM FULL', 11, 7.04, XANH]];
  const lw = 330, max = 40, bw = w - lw - 170;
  let s = head(w, it.length * (rh + 10) + 26, 'sz');
  it.forEach(([t, a, b, m], i) => {
    const y = i * (rh + 10);
    s += T(0, y + rh / 2 + 7, t, { fs: 18, fw: 700, fill: '#333', k: `sz-${i}` });
    s += R(lw, y + 4, (a / max) * bw, rh - 8, { fill: m, st: m, rx: 5, k: `szt-${i}` });
    s += R(lw + (a / max) * bw, y + 4, (b / max) * bw, rh - 8, { fill: m + '55', st: m, rx: 5 });
    const lab = `${a} MB + ${b === 7.04 ? '7208 kB' : b + ' MB'}`;
    s += T(lw + ((a + b) / max) * bw + 12, y + rh / 2 + 8, lab, { fs: 18, fw: 800, fill: m, mono: true });
  });
  s += T(lw, it.length * (rh + 10) + 18, 'solid = table · light = its 3 indexes', { fs: 15, fill: '#666', it: true });
  return s + '</svg>';
}

/** Ngưỡng autovacuum: dead tuple dâng lên tới vạch 50 + 0,2·n. */
export function thresholdPic({ w = 1110, h = 290 } = {}) {
  let s = head(w, h, 'th');
  const col = (x, ten, n, nguong, mau, k, phu) => {
    let r = T(x + 140, 22, ten, { fs: 19, fw: 800, fill: mau, anchor: 'middle' });
    r += R(x + 80, 40, 120, 200, { fill: '#fff', st: '#bbb', sw: 2, rx: 8 });
    const y = 40 + 200 * (1 - nguong);
    r += R(x + 80, y, 120, 240 - y, { fill: mau + '33', st: mau, sw: 0, rx: 0, k });
    r += L(x + 60, y, x + 220, y, { st: DO, sw: 3, dash: '6 4' });
    r += T(x + 228, y + 6, phu, { fs: 15, fw: 800, fill: DO, mono: true });
    r += T(x + 140, 270, n, { fs: 16, anchor: 'middle', fill: '#444', mono: true });
    return r;
  };
  s += col(0, '1,000 rows', 'n = 1 000', 0.25, XANH, 'th-a', '250');
  s += col(380, '1,000,000 rows', 'n = 1 000 000', 0.2, CAM, 'th-b', '200 050');
  s += col(760, 'tuned: 0.01 + 1000', 'n = 1 000 000', 0.011, PG, 'th-c', '11 000');
  s += T(555, 288, 'red line = dead tuples needed before autovacuum even looks at the table', { fs: 15, fill: '#666', anchor: 'middle', it: true });
  return s + '</svg>';
}

/** Đường chân trời xmin: ai đang giữ ⇒ phiên bản chết mới hơn không được gỡ. */
export function horizonPic({ w = 1110, h = 270 } = {}) {
  let s = head(w, h, 'hz');
  s += L(20, 150, 1090, 150, { st: '#999', sw: 3, m: '' }) + T(1090, 178, 'transaction IDs →', { fs: 15, fill: '#777', anchor: 'end' });
  s += L(330, 40, 330, 210, { st: DO, sw: 4, k: 'hz-line' }) + T(330, 30, 'oldest xmin horizon', { fs: 18, fw: 800, fill: DO, anchor: 'middle' });
  s += R(30, 120, 280, 60, { fill: '#f1f9f4', st: XANH, k: 'hz-ok' }) + T(170, 147, 'dead before the horizon', { fs: 16, fw: 700, fill: XANH, anchor: 'middle' }) + T(170, 168, 'VACUUM removes them ✓', { fs: 15, fill: XANH, anchor: 'middle' });
  s += R(350, 120, 720, 60, { fill: '#fdf0ee', st: DO, k: 'hz-bad' }) + T(710, 147, 'dead AFTER the horizon — someone might still need them', { fs: 16, fw: 700, fill: DO, anchor: 'middle' }) + T(710, 168, '“N are dead but not yet removable”', { fs: 15, fill: DO, anchor: 'middle', mono: true });
  const hd = [['🕰️ old transaction / idle in transaction', 'pg_stat_activity.backend_xmin'], ['📝 forgotten PREPARE TRANSACTION', 'pg_prepared_xacts'], ['🔌 replication slot (feedback)', 'pg_replication_slots.xmin']];
  hd.forEach(([a, b], i) => { const x = 20 + i * 365; s += R(x, 200, 350, 64, { fill: '#fff7ef', st: CAM, sw: 2, k: 'hz-h' }) + T(x + 12, 226, a, { fs: 16, fw: 700, fill: NAU }) + T(x + 12, 251, b, { fs: 14, mono: true, fill: '#555' }); });
  s += T(352, 72, 'Any one of the three below can pin the horizon —', { fs: 17, fw: 700, fill: '#444' }) + T(352, 96, 'for the WHOLE cluster, every table, every database', { fs: 17, fw: 700, fill: '#444' });
  return s + '</svg>';
}

/** Vòng 32-bit của mã giao dịch: 2^32 ≈ 4,29 tỉ; mỗi dòng thấy một nửa là quá khứ. */
export function xidCircle({ w = 1110, h = 330 } = {}) {
  let s = head(w, h, 'xc');
  const cx = 190, cy = 156, r = 130;
  s += Ci(cx, cy, r, { fill: '#fff', st: PG, sw: 6, k: 'xc-ring' });
  s += `<path d="M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r}" fill="none" stroke="${XANH}" stroke-width="12" opacity=".55"/>`;
  s += `<path d="M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r}" fill="none" stroke="${CAM}" stroke-width="12" opacity=".55"/>`;
  s += Ci(cx, cy - r, 9, { fill: DO, st: DO }) + T(cx + 16, cy - r - 6, 'now', { fs: 16, fw: 800, fill: DO });
  s += T(cx - 70, cy + 6, 'past', { fs: 20, fw: 800, fill: XANH, anchor: 'middle' }) + T(cx + 70, cy + 6, 'future', { fs: 20, fw: 800, fill: NAU, anchor: 'middle' });
  s += T(cx, cy + r + 30, '32-bit counter · 2³² ≈ 4.29 billion', { fs: 15, fill: '#555', anchor: 'middle', mono: true });
  const x = 400;
  const st = [['autovacuum_freeze_max_age', '200 000 000', 'forced anti-wraparound autovacuum starts', PG, 'xc-1'], ['~40 million before the stop', 'WARNING', '“must be vacuumed within N transactions”', CAM, 'xc-2'], ['3 million before wraparound', 'STOP', 'no new transaction IDs: writes refused', DO, 'xc-3'], ['2³¹ ≈ 2.1 billion', 'wraparound', 'old rows would look like the future — data “vanishes”', TIM, 'xc-4']];
  st.forEach(([a, b, c, m, k], i) => { const y = 14 + i * 76; s += R(x, y, 710, 64, { fill: m + '12', st: m, k }) + T(x + 14, y + 27, `age ${a}`, { fs: 16, fw: 700, fill: '#444', mono: true }) + T(x + 696, y + 27, b, { fs: 18, fw: 800, fill: m, anchor: 'end', mono: true }) + T(x + 14, y + 52, c, { fs: 17, fill: '#333' }); });
  return s + '</svg>';
}

/* ═══════════════════════════ 14.4 ═══════════════════════════ */

/** Bảng đồng hồ ô tô ↔ ba khung nhìn. */
export function dashPic({ w = 1110, h = 270 } = {}) {
  let s = head(w, h, 'dp');
  const card = (x, icon, t1, t2, v, d, m, k) => R(x, 0, 350, h, { fill: m + '0f', st: m, k }) + E(x + 175, 70, icon, 54) + T(x + 175, 118, t1, { fs: 20, fw: 800, fill: m, anchor: 'middle' }) + T(x + 175, 146, t2, { fs: 16, fill: '#555', anchor: 'middle', it: true }) + T(x + 175, 196, v, { fs: 19, fw: 800, anchor: 'middle', mono: true, fill: '#222' }) + T(x + 175, 228, d, { fs: 16, anchor: 'middle', fill: '#444' });
  s += card(0, '⏱️', 'Speedometer', 'what is happening NOW', 'pg_stat_activity', 'who runs what, who waits', PG, 'dp-1');
  s += card(380, '🧾', 'Trip computer', 'what was expensive OVER TIME', 'pg_stat_statements', 'total time per query shape', CAM, 'dp-2');
  s += card(760, '🛞', 'Tyre & oil gauges', 'how each OBJECT is doing', 'pg_stat_user_*', 'tables · indexes · cache', XANH, 'dp-3');
  return s + '</svg>';
}

/** Cancel vs terminate. */
export function cancelPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'cp');
  s += R(0, 0, 540, h, { fill: '#fff7ef', st: CAM, k: 'cp-c' }) + T(270, 34, 'pg_cancel_backend(pid)', { fs: 22, fw: 800, fill: NAU, anchor: 'middle', mono: true });
  s += E(90, 112, '🍳', 48) + L(140, 100, 200, 100, { st: CAM, sw: 3, m: 'cpc' }) + E(250, 112, '🛑', 44);
  s += T(300, 96, 'stop the dish', { fs: 18, fw: 700, fill: NAU }) + T(300, 122, 'being cooked', { fs: 18, fw: 700, fill: NAU });
  s += T(24, 172, '• the current QUERY gets an ERROR', { fs: 17, fill: '#444' }) + T(24, 200, '• the connection (and its session) survives', { fs: 17, fill: '#444' }) + T(24, 228, '• safe first move — try it first', { fs: 17, fw: 700, fill: XANH });
  s += R(570, 0, 540, h, { fill: '#fdf0ee', st: DO, k: 'cp-t' }) + T(840, 34, 'pg_terminate_backend(pid)', { fs: 22, fw: 800, fill: DO, anchor: 'middle', mono: true });
  s += E(660, 112, '🧑', 48) + L(710, 100, 770, 100, { st: DO, sw: 3, m: 'cpd' }) + E(820, 112, '🚪', 44);
  s += T(870, 96, 'walk the guest', { fs: 18, fw: 700, fill: DO }) + T(870, 122, 'out of the door', { fs: 18, fw: 700, fill: DO });
  s += T(594, 172, '• the whole CONNECTION is closed (FATAL)', { fs: 17, fill: '#444' }) + T(594, 200, '• its open transaction rolls back, locks freed', { fs: 17, fill: '#444' }) + T(594, 228, '• the tool for idle in transaction', { fs: 17, fw: 700, fill: DO });
  return s + '</svg>';
}

/** Xếp theo calls vs theo total time (pg-14-4b.out.txt). */
export function callsTotalPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'ct');
  const rows = [['bucket = $1', 20005, 1048.5, 0.05, XANH], ['val LIKE $1', 2, 103.3, 51.65, DO], ['sum(id)', 1, 34.5, 34.48, CAM]];
  const lw = 190, bw = 250;
  s += T(0, 22, 'Sorted by mean time (ms)', { fs: 18, fw: 800, fill: PG }) + T(570, 22, 'Sorted by TOTAL time (ms)', { fs: 18, fw: 800, fill: XANH });
  const byMean = [...rows].sort((a, b) => b[3] - a[3]);
  byMean.forEach(([q, , , m, c], i) => { const y = 40 + i * 62; s += T(0, y + 30, q, { fs: 17, mono: true }) + R(lw, y + 8, Math.max(4, (m / 51.65) * bw), 36, { fill: c, st: c, rx: 5, k: 'ct-m' }) + T(lw + Math.max(4, (m / 51.65) * bw) + 10, y + 33, m.toFixed(2), { fs: 17, fw: 800, fill: c, mono: true }); });
  rows.forEach(([q, n, t, , c], i) => { const y = 40 + i * 62; s += T(570, y + 30, q, { fs: 17, mono: true }) + R(570 + lw, y + 8, Math.max(4, (t / 1048.5) * bw), 36, { fill: c, st: c, rx: 5, k: 'ct-t' }) + T(570 + lw + Math.max(4, (t / 1048.5) * bw) + 10, y + 33, `${t}`, { fs: 17, fw: 800, fill: c, mono: true }); });
  s += T(0, 238, 'mean says “fix LIKE”', { fs: 17, fw: 700, fill: DO }) + T(570, 238, 'total says the 20,005-call query costs 10× more', { fs: 17, fw: 700, fill: XANH });
  return s + '</svg>';
}

/** PostgreSQL → postgres_exporter → Prometheus → Grafana / Alertmanager. */
export function exporterPic({ w = 1110, h = 230 } = {}) {
  let s = head(w, h, 'ex');
  const box = (x, t, d, m, k, ww = 190) => R(x, 60, ww, 100, { fill: m + '12', st: m, k }) + T(x + ww / 2, 98, t, { fs: 19, fw: 800, fill: m, anchor: 'middle' }) + T(x + ww / 2, 128, d, { fs: 14, fill: '#555', anchor: 'middle', mono: true });
  s += box(0, 'PostgreSQL', 'pg_stat_* views', PG, 'ex-pg');
  s += box(230, 'postgres_exporter', ':9187/metrics', CAM, 'ex-exp', 210);
  s += box(480, 'Prometheus', 'scrape every 15 s', NAU, 'ex-prom');
  s += box(720, 'Grafana', 'dashboards', XANH, 'ex-graf', 170);
  s += box(920, 'Alertmanager', '→ Telegram / mail', DO, 'ex-alert', 190);
  s += L(192, 110, 226, 110, { m: 'ex' }) + L(442, 110, 476, 110, { m: 'ex' }) + L(672, 96, 716, 96, { m: 'ex' });
  s += `<path d="M672 130 C 760 200, 860 200, 918 140" fill="none" stroke="${NAU}" stroke-width="3" marker-end="url(#ex)"/>`;
  s += T(0, 32, 'Same queries as this lesson — run every 15 s and kept as history:', { fs: 18, fw: 700, fill: '#333' });
  s += T(0, 210, 'pull model: Prometheus asks the exporter; the exporter asks PostgreSQL with a read-only role (pg_monitor).', { fs: 15, fill: '#666' });
  return s + '</svg>';
}

/** Bảng điều khiển mô phỏng 5 ô — số thật pg-14-4f.out.txt (máy nháp). */
export function dashMock({ w = 1110, h = 260, so = ['1 / 100', '00:00:00', '100.0 %', '39', '93.57 %'] } = {}) {
  let s = head(w, h, 'dm');
  s += R(0, 0, w, h, { fill: '#111827', st: '#111827', rx: 12 });
  const ten = [['connections', '< 80 %', XANH], ['oldest transaction', '< 5 min', XANH], ['max dead-tuple ratio', '< 20 %', DO], ['age(datfrozenxid)', '< 500 M', XANH], ['cache hit ratio', '> 99 %', CAM]];
  ten.forEach(([t, nguong, m], i) => {
    const x = 16 + i * 218;
    s += R(x, 16, 206, 228, { fill: '#1f2937', st: m, sw: 2.5, rx: 10, k: `dm-${i}` });
    s += T(x + 103, 48, t, { fs: 15, fw: 700, fill: '#cbd5e1', anchor: 'middle' });
    s += T(x + 103, 128, so[i], { fs: so[i].length > 8 ? 26 : 32, fw: 800, fill: m === DO ? '#f87171' : m === CAM ? '#fbbf24' : '#4ade80', anchor: 'middle', mono: true });
    s += T(x + 103, 172, `alarm: ${nguong}`, { fs: 15, fill: '#94a3b8', anchor: 'middle', mono: true });
    s += `<polyline points="${Array.from({ length: 9 }, (_, j) => `${x + 18 + j * 21},${222 - ((j * 37 + i * 13) % 26)}`).join(' ')}" fill="none" stroke="${m}" stroke-width="2" opacity=".7"/>`;
  });
  return s + '</svg>';
}
