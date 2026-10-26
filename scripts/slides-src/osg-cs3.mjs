/**
 * osg-cs3 — OSG202 · ⭐ Advanced 3 "Threads in backend: thread pool vs event loop" (deck tự dựng, slide EN, khuôn _pg-chung.mjs, 25/10/2026).
 * Đề cương: REPO/OSG202/CHUYEN-SAU.md mục 3. MỌI output = CHẠY THẬT, lưu ở REPO/OSG202/cs-nguon/cs3/*.out.txt (điều kiện đo: 00-DIEU-KIEN-DO.txt).
 * Máy đo: MacBook Pro M1 Max + Docker Desktop 29.8.0 (VM Linux 7.0.12-linuxkit, 10 vCPU / 7,7 GB), máy chủ đang bận (load 11–35)
 *   ⇒ số thời gian chỉ để SO TƯƠNG ĐỐI. Image: eclipse-temurin:21-jdk (21.0.12), maven:3.9-eclipse-temurin-21 + Spring Boot 4.1.2,
 *   node:22-bookworm (v22.23.4), postgres:17 (17.11).
 * Nguồn: nodejs.org "The Node.js Event Loop" + "Don't Block the Event Loop"; docs.libuv.org threadpool (mặc định 4, tối đa 1024);
 *   openjdk.org JEP 444 (virtual threads) + JEP 491 (JDK 24 bỏ pinning của synchronized); Spring Boot 4.1.2 TomcatServerProperties
 *   (mặc định in thật); Goetz et al. "Java Concurrency in Practice" §8.2. Dự án thật: src/services/auth.service.ts (bcryptjs 2.4.3, cost 12).
 */
import { lamDeck, sql, psql, sh, two as two0, box, cards, vsd } from './_pg-chung.mjs';

export const deck = { key: 'cs3', code: 'CS.3', title: 'Threads in backend: thread pool vs event loop', sub: 'OSG202 · ⭐ Advanced' };

const out = (t, o = {}) => psql(t, { title: 'output', sm: true, ...o });
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const java = (s, o = {}) => sql(s, { lang: 'java', sm: true, ...o });
const js = (s, o = {}) => sql(s, { lang: 'javascript', sm: true, ...o });
const bash = (s, o = {}) => sql(s, { lang: 'bash', sm: true, ...o });
const zm = (h, z) => `<div style="zoom:${z}">${h}</div>`;
/* two() của khuôn đặt a, b thẳng vào lưới 2 cột ⇒ a/b có nhiều phần tử là vỡ lưới. Bọc mỗi cột một div (min-width:0 để mã không đẩy cột). */
const col = (h) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const AR = (id, col) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${col}"/></marker>`;
/* rộng chữ ước lượng: 0,602 × cỡ chữ × số ký tự (dùng để đặt nhãn, không đặt bằng mắt) */
const tw = (s, fs) => Math.ceil(String(s).length * 0.602 * fs);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.it ? ' font-style="italic"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="6 4"' : ''}/>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', GY = '#8a8a8a';

/* ── Hình 1: nhà hàng — một bồi bàn mỗi bàn vs một bồi bàn nhanh + bếp ── */
const restaurant = () => {
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">`;
  // trái
  s += R(4, 4, 540, 322, '#fdf6ef', BR, { sw: 2.5, rx: 14 });
  s += T(274, 36, 'Restaurant A: one waiter PER TABLE', 21, { a: 'middle', w: 800, f: BR });
  [0, 1, 2, 3].forEach((i) => {
    const x = 30 + i * 128;
    s += R(x, 60, 108, 62, '#fff', BR, { rx: 10 });
    s += T(x + 54, 98, `table ${i + 1}`, 17, { a: 'middle' });
    s += T(x + 36, 168, '🧍', 38);
    s += T(x + 54, 200, i < 3 ? 'waiting…' : 'taking order', 15, { a: 'middle', f: i < 3 ? RD : GR, w: 700 });
  });
  s += T(274, 238, 'Food takes 10 min ⇒ each waiter just STANDS there.', 17, { a: 'middle', f: '#555' });
  s += T(274, 264, '200 waiters ⇒ table 201 waits at the door.', 17, { a: 'middle', f: '#555' });
  s += T(274, 302, '= thread-per-request (Tomcat, Spring MVC)', 19, { a: 'middle', w: 800, f: BR });
  // phải
  const X = 566;
  s += R(X, 4, 540, 322, '#eef4fa', BL, { sw: 2.5, rx: 14 });
  s += T(X + 270, 36, 'Restaurant B: ONE fast waiter + a kitchen', 21, { a: 'middle', w: 800, f: BL });
  [0, 1, 2, 3].forEach((i) => {
    const x = X + 22 + i * 92;
    s += R(x, 60, 80, 50, '#fff', BL, { rx: 10 });
    s += T(x + 40, 91, `table ${i + 1}`, 15, { a: 'middle' });
  });
  s += `<defs>${AR('rb', BL)}</defs>`;
  s += `<path d="M${X + 60},128 C${X + 140},150 ${X + 260},150 ${X + 350},128" fill="none" stroke="${BL}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#rb)"/>`;
  s += T(X + 190, 178, '🏃', 34, { a: 'middle' });
  s += T(X + 190, 204, 'never waits: takes order, moves on', 15, { a: 'middle', f: BL, w: 700 });
  s += R(X + 392, 52, 132, 152, '#fff', OR, { rx: 10 });
  s += T(X + 458, 78, 'kitchen', 17, { a: 'middle', w: 800, f: BR });
  s += T(X + 458, 120, '👩‍🍳👨‍🍳', 30, { a: 'middle' });
  s += T(X + 458, 160, '👩‍🍳👨‍🍳', 30, { a: 'middle' });
  s += T(X + 458, 192, '4 cooks', 15, { a: 'middle', f: '#555' });
  s += T(X + 270, 238, '"Bell rings when food is ready" ⇒ waiter serves it.', 17, { a: 'middle', f: '#555' });
  s += T(X + 270, 264, 'If the waiter starts COOKING, every table waits.', 17, { a: 'middle', f: RD });
  s += T(X + 270, 302, '= event loop + thread pool (Node.js)', 19, { a: 'middle', w: 800, f: BL });
  return s + `</svg>`;
};

/* ── Hình 2: thread-per-request trong Tomcat ── */
const tprDiagram = () => {
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial"><defs>${AR('ta', BR)}</defs>`;
  // clients
  s += T(60, 24, 'clients', 17, { a: 'middle', w: 700, f: GY });
  for (let i = 0; i < 5; i++) s += T(60, 62 + i * 38, '💻', 26, { a: 'middle' });
  s += `<line x1="92" y1="125" x2="160" y2="125" stroke="${BR}" stroke-width="3" marker-end="url(#ta)"/>`;
  // listen queue
  s += R(166, 70, 200, 110, '#fff7ef', OR);
  s += T(266, 98, 'kernel accept queue', 17, { a: 'middle', w: 800, f: BR });
  for (let i = 0; i < 6; i++) s += R(184 + i * 28, 112, 22, 30, '#fbe9dc', BR, { rx: 3, sw: 1.5 });
  s += T(266, 168, 'accept-count = 100', 16, { a: 'middle', f: '#555' });
  s += `<line x1="370" y1="125" x2="430" y2="125" stroke="${BR}" stroke-width="3" marker-end="url(#ta)"/>`;
  // poller
  s += R(436, 86, 130, 78, '#eef4fa', BL);
  s += T(501, 118, 'Acceptor', 17, { a: 'middle', w: 800, f: BL });
  s += T(501, 142, '+ NIO poller', 16, { a: 'middle', f: '#555' });
  s += `<line x1="570" y1="125" x2="628" y2="125" stroke="${BR}" stroke-width="3" marker-end="url(#ta)"/>`;
  // pool
  s += R(634, 14, 300, 222, '#f1f9f4', GR, { sw: 2.5 });
  s += T(784, 40, 'worker pool: max 200 threads', 17, { a: 'middle', w: 800, f: GR });
  const names = ['exec-1', 'exec-2', 'exec-3', '…', 'exec-200'];
  names.forEach((n, i) => {
    const y = 56 + i * 34;
    if (n === '…') { s += T(784, y + 22, '⋮', 22, { a: 'middle', f: GR }); return; }
    s += R(650, y, 268, 28, '#fff', GR, { rx: 6, sw: 1.5 });
    s += T(662, y + 20, `http-nio-8080-${n}`, 15, { f: '#245077' });
    s += T(906, y + 20, i === 0 ? 'busy' : 'waits DB', 14, { a: 'end', f: i === 0 ? GR : RD, w: 700 });
  });
  s += `<line x1="938" y1="125" x2="990" y2="125" stroke="${BR}" stroke-width="3" marker-end="url(#ta)"/>`;
  s += R(996, 78, 110, 94, '#fff', BL);
  s += T(1051, 112, '@GetMapping', 15, { a: 'middle', w: 700, f: BL });
  s += T(1051, 136, '→ DB / API', 15, { a: 'middle', f: '#555' });
  s += T(1051, 158, '(blocking)', 14, { a: 'middle', f: GY });
  return s + `</svg>`;
};

/* ── Hình 3: 600 request /slow — đợt 200 (platform) vs một đợt (virtual) — số đo thật ── */
const waves = () => {
  const W = 1110, x0 = 250, sc = 230; // 1 s = 230 px
  let s = `<svg viewBox="0 0 ${W} 250" width="${W}" height="250" font-family="Arial">`;
  for (let t = 0; t <= 3.5; t += 0.5) {
    const x = x0 + t * sc;
    s += `<line x1="${x}" y1="22" x2="${x}" y2="206" stroke="#e3e3e3" stroke-width="1"/>`;
    if (Number.isInteger(t)) s += T(x, 228, `${t} s`, 16, { a: 'middle', f: '#666' });
  }
  s += T(10, 70, 'platform threads', 19, { w: 800, f: BR });
  s += T(10, 94, '(200-thread pool)', 16, { f: '#666' });
  [[0, 'req 1–200'], [1, 'req 201–400'], [2, 'req 401–600']].forEach(([w, l]) => {
    const x = x0 + w * sc;
    s += R(x + 2, 40 + w * 18, sc - 6, 30, '#fbe9dc', BR, { rx: 5 });
    s += T(x + sc / 2, 61 + w * 18, l, 15, { a: 'middle', w: 700, f: BR });
  });
  s += T(x0 + 3.08 * sc + 8, 100, 'last answer 3.08 s', 15, { f: BR, w: 700 });
  s += T(10, 170, 'virtual threads', 19, { w: 800, f: BL });
  s += T(10, 194, '(one per request)', 16, { f: '#666' });
  s += R(x0 + 2, 148, 1.08 * sc, 40, '#eef4fa', BL, { rx: 5 });
  s += T(x0 + 1.08 * sc / 2, 174, 'all 600 at once', 15, { a: 'middle', w: 700, f: BL });
  s += T(x0 + 1.08 * sc + 14, 174, 'p50 1.08 s', 15, { f: BL, w: 700 });
  return s + `</svg>`;
};

/* ── Hình 4: hai biểu đồ cột cỡ pool (CPU-bound / IO-bound) — số đo thật 02-PoolSizing.out.txt ── */
const poolBars = () => {
  const panel = (X, title, sub, data, maxV, mau, mark) => {
    let s = R(X, 2, 540, 300, '#fff', '#ddd', { rx: 12 });
    s += T(X + 270, 30, title, 19, { a: 'middle', w: 800, f: mau });
    s += T(X + 270, 54, sub, 15, { a: 'middle', f: '#666' });
    const bw = 62, gap = 22, base = 256, H = 170;
    data.forEach(([n, v], i) => {
      const x = X + 32 + i * (bw + gap), h = (v / maxV) * H, hi = n === mark;
      s += R(x, base - h, bw, h, hi ? mau : `${mau}55`, mau, { rx: 4, sw: 1.5 });
      s += T(x + bw / 2, base - h - 7, `${v.toFixed(2)}`, 15, { a: 'middle', w: 700, f: '#333' });
      s += T(x + bw / 2, base + 20, `${n}`, 16, { a: 'middle', w: hi ? 800 : 400, f: hi ? mau : '#555' });
    });
    s += T(X + 270, 296, 'threads in the pool  →  seconds (lower = better)', 14, { a: 'middle', f: GY });
    return s;
  };
  return `<svg viewBox="0 0 1110 304" width="1110" height="304" font-family="Arial">` +
    panel(0, 'CPU-bound: 16 prime-counting tasks', '4 CPUs (--cpuset-cpus 0-3)', [[1, 2.83], [2, 1.28], [4, 0.73], [8, 1.10], [16, 1.14], [64, 1.20]], 2.83, RD, 4) +
    panel(570, 'IO-bound: 200 × (10 ms CPU + 90 ms wait)', 'Goetz: 4 × (1 + 90/10) = 40 threads', [[4, 5.16], [10, 2.10], [20, 1.08], [40, 0.60], [100, 0.49], [200, 0.57]], 5.16, GR, 40) +
    `</svg>`;
};

/* ── Hình 5: virtual thread gắn/tháo khỏi carrier ── */
const vtDiagram = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial"><defs>${AR('va', BL)}</defs>`;
  s += T(10, 22, 'virtual threads (small objects on the Java heap — millions are fine)', 18, { w: 800, f: BL });
  for (let i = 0; i < 18; i++) {
    const x = 26 + i * 61, run = [1, 6, 11, 15].includes(i);
    s += `<circle cx="${x}" cy="58" r="20" fill="${run ? BL : '#eef4fa'}" stroke="${BL}" stroke-width="2"/>`;
    s += T(x, 64, run ? 'run' : 'zz', 13, { a: 'middle', f: run ? '#fff' : '#245077', w: 700 });
  }
  [1, 6, 11, 15].forEach((v, k) => {
    const cx = 26 + v * 61, bx = 60 + k * 250;
    s += `<line x1="${cx}" y1="80" x2="${bx + 90}" y2="140" stroke="${BL}" stroke-width="2.5" marker-end="url(#va)"/>`;
    s += R(bx, 144, 180, 44, '#f1f9f4', GR);
    s += T(bx + 90, 172, `carrier ${k + 1} (OS thread)`, 16, { a: 'middle', w: 700, f: GR });
  });
  s += T(10, 222, 'carrier threads = real OS threads (a ForkJoinPool, about one per CPU core)', 18, { w: 800, f: GR });
  s += T(10, 252, 'zz = parked: waiting for DB / HTTP / sleep. Its stack is saved on the heap; it holds NO OS thread.', 17, { f: '#555' });
  s += T(10, 284, 'A blocking call ⇒ the JVM unmounts the virtual thread; the carrier picks up another one.', 18, { w: 700, f: BR });
  return s + `</svg>`;
};

/* ── Hình 6: 10.000 tác vụ ngủ 1 s — cột ngang (số đo thật 03-VirtualThreads.out.txt) ── */
const vtBars = () => {
  const rows = [['fixed pool, 200 threads', 50.55, BR], ['1 platform thread / task', 6.71, OR], ['1 virtual thread / task', 1.06, BL]];
  const x0 = 236, sc = 4.4; // nhãn cỡ 15: 24 ký tự × 0,602 × 15 ≈ 217 px < 224
  let s = `<svg viewBox="0 0 546 200" width="546" height="200" font-family="Arial">`;
  rows.forEach(([l, v, m], i) => {
    const y = 4 + i * 54;
    s += T(x0 - 10, y + 29, l, 15, { a: 'end', w: 700, f: m });
    s += R(x0, y + 8, Math.max(6, v * sc), 32, `${m}33`, m, { rx: 5 });
    s += T(x0 + Math.max(6, v * sc) + 8, y + 30, `${v.toFixed(2)} s`, 18, { w: 800, f: m });
  });
  s += T(8, 190, '10,000 tasks × Thread.sleep(1 s) — ideal ≈ 1 s', 15, { f: GY });
  return s + `</svg>`;
};

/* ── Hình 7: tiến trình Node = 1 luồng JS + libuv ── */
const nodeArch = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial"><defs>${AR('na', BR)}</defs>`;
  s += R(4, 4, 1100, 292, '#fafafa', '#bbb', { rx: 14, dash: true });
  s += T(20, 30, 'one node process (PID) — 11 Linux threads after first fs call', 17, { w: 800, f: '#555' });
  // main thread
  s += R(30, 50, 330, 220, '#eef4fa', BL, { sw: 2.5 });
  s += T(195, 80, 'main thread "node"', 19, { a: 'middle', w: 800, f: BL });
  s += T(195, 104, 'runs ALL your JavaScript', 16, { a: 'middle', f: '#555' });
  s += `<circle cx="195" cy="180" r="56" fill="none" stroke="${BL}" stroke-width="4" stroke-dasharray="10 6"/>`;
  s += T(195, 176, 'event', 18, { a: 'middle', w: 800, f: BL });
  s += T(195, 198, 'loop', 18, { a: 'middle', w: 800, f: BL });
  s += T(195, 258, 'only ONE callback at a time', 15, { a: 'middle', f: RD, w: 700 });
  // epoll
  s += `<line x1="362" y1="110" x2="470" y2="110" stroke="${BR}" stroke-width="3" marker-end="url(#na)"/>`;
  s += R(476, 50, 300, 110, '#fff7ef', OR);
  s += T(626, 78, 'kernel: epoll', 18, { a: 'middle', w: 800, f: BR });
  s += T(626, 104, 'sockets (HTTP, DB driver),', 15, { a: 'middle' });
  s += T(626, 124, 'timers — no extra thread', 15, { a: 'middle' });
  s += T(626, 148, '"wake me when ready"', 15, { a: 'middle', f: GY, it: true });
  // thread pool
  s += `<line x1="362" y1="225" x2="470" y2="225" stroke="${BR}" stroke-width="3" marker-end="url(#na)"/>`;
  s += R(476, 178, 300, 100, '#f1f9f4', GR);
  s += T(626, 204, 'libuv thread pool (4)', 18, { a: 'middle', w: 800, f: GR });
  for (let i = 0; i < 4; i++) s += R(500 + i * 66, 216, 56, 26, '#fff', GR, { rx: 5, sw: 1.5 });
  for (let i = 0; i < 4; i++) s += T(528 + i * 66, 234, 'worker', 12, { a: 'middle', f: GR });
  s += T(626, 266, 'fs, dns.lookup, crypto, zlib', 15, { a: 'middle' });
  // others
  s += R(800, 50, 290, 228, '#fff', '#ccc');
  s += T(945, 78, 'other threads', 18, { a: 'middle', w: 800, f: '#666' });
  s += T(945, 110, '4 × V8 workers (GC, JIT)', 15, { a: 'middle' });
  s += T(945, 132, '--v8-pool-size, default 4', 15, { a: 'middle', f: GY });
  s += T(945, 164, '1 × node internal', 15, { a: 'middle' });
  s += T(945, 186, '1 × DelayedTaskScheduler', 15, { a: 'middle' });
  s += T(945, 210, 'you never touch these', 15, { a: 'middle', f: GY, it: true });
  return s + `</svg>`;
};

/* ── Hình 8: 6 pha event loop (nodejs.org) + microtask giữa từng callback ── */
const phases = () => {
  const P = [['timers', 'setTimeout / setInterval'], ['pending callbacks', 'some TCP errors'], ['idle, prepare', 'internal only'],
    ['poll', 'I/O callbacks; waits here'], ['check', 'setImmediate'], ['close callbacks', "socket.on('close')"]];
  const cx = 345, cy = 236, rx = 222, ry = 168;
  let s = `<svg viewBox="0 0 1110 470" width="1110" height="470" font-family="Arial"><defs>${AR('pa', BR)}</defs>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx - 40}" ry="${ry - 40}" fill="none" stroke="${BR}" stroke-width="3" stroke-dasharray="8 6"/>`;
  P.forEach(([n, d], i) => {
    const a = -Math.PI / 2 + i * (2 * Math.PI / 6), x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
    const hi = n === 'poll' || n === 'timers' || n === 'check';
    s += R(x - 112, y - 34, 224, 68, hi ? '#eef4fa' : '#fff', hi ? BL : '#bbb', { rx: 12, sw: hi ? 2.5 : 1.5 });
    s += T(x, y - 6, `${i + 1}. ${n}`, 18, { a: 'middle', w: 800, f: hi ? BL : '#666' });
    s += T(x, y + 18, d, 14, { a: 'middle', f: '#555' });
  });
  s += T(cx, cy - 6, 'one turn', 20, { a: 'middle', w: 800, f: BR });
  s += T(cx, cy + 20, '= one "tick"', 17, { a: 'middle', f: BR });
  // giải thích bên phải
  const X = 704;
  s += R(X, 40, 402, 190, '#fff7ef', OR, { rx: 12 });
  s += T(X + 18, 72, 'After EVERY callback, Node empties', 18, { w: 800, f: BR });
  s += T(X + 22, 106, '① process.nextTick queue', 18, { f: '#333' });
  s += T(X + 22, 136, '② microtasks (Promise.then,', 18, { f: '#333' });
  s += T(X + 50, 162, 'await, queueMicrotask)', 18, { f: '#333' });
  s += T(X + 18, 204, '…before the next callback or phase', 16, { f: '#666', it: true });
  s += R(X, 252, 402, 170, '#eef4fa', BL, { rx: 12 });
  s += T(X + 18, 284, 'Words', 18, { w: 800, f: BL });
  s += T(X + 18, 316, 'macrotask = a callback in a phase', 17);
  s += T(X + 18, 342, '(timer, I/O, setImmediate, close)', 17, { f: '#555' });
  s += T(X + 18, 374, 'microtask = nextTick / promise job:', 17);
  s += T(X + 18, 400, 'always runs first, all of them', 17, { f: '#555' });
  return s + `</svg>`;
};

/* ── Hình 9: pbkdf2 — Gantt từ số đo thật 05-pbkdf2.out.txt ── */
const pbkdfGantt = () => {
  const x0 = 210, sc = 1.55; // 1 ms = 1.55 px
  const A = [205, 209, 209, 222, 372, 374, 375, 388];         // UV_THREADPOOL_SIZE=4 (lần 1)
  const B = [188, 196, 199, 222, 223, 226, 293, 296];         // UV_THREADPOOL_SIZE=8 (lần chi tiết)
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">`;
  for (let t = 0; t <= 400; t += 100) {
    const x = x0 + t * sc;
    s += `<line x1="${x}" y1="20" x2="${x}" y2="270" stroke="#e5e5e5"/>` + T(x, 290, `${t} ms`, 15, { a: 'middle', f: '#666' });
  }
  s += T(10, 40, 'POOL = 4', 20, { w: 800, f: BR }) + T(10, 64, 'jobs 5–8 queue', 15, { f: '#666' });
  A.forEach((end, i) => {
    const start = i < 4 ? 0 : A[i % 4], y = 18 + (i % 4) * 26;
    s += R(x0 + start * sc, y, (end - start) * sc, 20, i < 4 ? `${BR}66` : `${OR}66`, i < 4 ? BR : OR, { rx: 3, sw: 1.2 });
    s += T(x0 + start * sc + 6, y + 15, `#${i + 1}`, 13, { w: 700 });
  });
  s += T(x0 + 388 * sc + 8, 70, 'total 388 ms', 16, { w: 800, f: BR });
  s += T(10, 170, 'POOL = 8', 20, { w: 800, f: BL }) + T(10, 194, 'one wave', 15, { f: '#666' });
  B.forEach((end, i) => {
    const y = 138 + i * 16;
    s += R(x0, y, end * sc, 12, `${BL}55`, BL, { rx: 2, sw: 1 });
  });
  s += T(x0 + 296 * sc + 8, 200, 'total 296 ms', 16, { w: 800, f: BL });
  return s + `</svg>`;
};

/* ── Hình 10: chu trình deadlock ── */
const deadlockCycle = () => {
  let s = `<svg viewBox="0 0 470 300" width="470" height="300" font-family="Arial"><defs>${AR('da', RD)}${AR('db', GR)}</defs>`;
  s += R(20, 30, 160, 64, '#fbe9dc', BR, { rx: 12 }) + T(100, 58, 'T1', 20, { a: 'middle', w: 800, f: BR }) + T(100, 82, 'transfer A→B', 14, { a: 'middle' });
  s += R(290, 30, 160, 64, '#eef4fa', BL, { rx: 12 }) + T(370, 58, 'T2', 20, { a: 'middle', w: 800, f: BL }) + T(370, 82, 'transfer B→A', 14, { a: 'middle' });
  s += R(40, 200, 120, 60, '#fff', '#555', { rx: 30 }) + T(100, 237, '🔒 A', 20, { a: 'middle', w: 800 });
  s += R(310, 200, 120, 60, '#fff', '#555', { rx: 30 }) + T(370, 237, '🔒 B', 20, { a: 'middle', w: 800 });
  s += `<line x1="100" y1="196" x2="100" y2="100" stroke="${GR}" stroke-width="3" marker-end="url(#db)"/>` + T(108, 150, 'held by', 14, { f: GR, w: 700 });
  s += `<line x1="370" y1="196" x2="370" y2="100" stroke="${GR}" stroke-width="3" marker-end="url(#db)"/>` + T(306, 150, 'held by', 14, { f: GR, w: 700 });
  s += `<line x1="170" y1="86" x2="318" y2="204" stroke="${RD}" stroke-width="3" stroke-dasharray="7 5" marker-end="url(#da)"/>`;
  s += `<line x1="300" y1="86" x2="152" y2="204" stroke="${RD}" stroke-width="3" stroke-dasharray="7 5" marker-end="url(#da)"/>`;
  s += T(235, 66, 'waits for', 15, { a: 'middle', f: RD, w: 700 });
  s += T(235, 292, 'a cycle ⇒ nobody can move, forever', 16, { a: 'middle', f: RD, w: 800 });
  return s + `</svg>`;
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'academy/osg202', bieuTuong: '🐧', khau: 'from zero to real backend work',
  chuong: '⭐ Advanced 3 — Threads in backend', bai: 'CS.3',
}, [
  { cover: true, t: 'Threads in backend:<br>thread pool vs event loop', sub: 'How Tomcat, Java 21 virtual threads and Node.js serve many users at once —<br>every number on these slides was measured on real Linux.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>See <b>thread-per-request</b> for real: Spring Boot's Tomcat pool of <b>200 threads</b></li>
<li>Size a pool: <b>CPU-bound vs IO-bound</b> work — a formula, then a measurement</li>
<li>Java 21 <b>virtual threads</b>: 10,000 waiting tasks in <b>50 s → 1 s</b></li>
<li>Node.js: the <b>event loop</b>, its 6 phases, <b>microtask vs macrotask</b>, the libuv pool of <b>4</b></li>
<li>Find and fix: a blocked event loop, a <b>race</b>, a <b>deadlock</b> (jstack), a <b>lost update</b> in the database</li>
</ul>
${box('Builds on', 'School lessons <b>2.A–2.C</b> (process, thread, synchronization) give the concepts. Here we take them to a real backend server.', 'lam')}` },

  { t: 'Start with a restaurant', giua: true, body: `${restaurant()}
<p style="margin:0;font-size:23px">Both restaurants feed 1,000 guests. A is simple but needs <b>many waiters</b> who mostly <b>wait</b>. B needs only <b>one waiter</b> — as long as he <b>never cooks himself</b>.</p>` },

  { t: 'Six words we need', to: true, giua: true, body: cards([
    ['🧵 Thread', 'One line of execution inside a process. Threads of one process <b>share memory</b>. In Linux every thread is a <b>task</b> with its own TID.'],
    ['👥 Thread pool', 'A fixed team of threads that are <b>reused</b>. New jobs wait in a <b>queue</b>. Creating a thread per job is slow.'],
    ['⏳ Blocking call', 'The thread <b>stops and waits</b>: DB query, HTTP call, file read, sleep. It uses <b>no CPU</b> but keeps its memory.'],
    ['🔥 CPU- vs 🛌 IO-bound', 'CPU-bound = busy <b>computing</b> (hashing, image resize). IO-bound = mostly <b>waiting</b> — most web requests.'],
    ['🔁 Event loop', 'ONE thread that <b>never waits</b>: it asks the kernel “tell me when ready”, then runs short <b>callbacks</b>.'],
    ['🪶 Virtual thread', 'Java 21: a thread managed by the <b>JVM</b>, not the OS. Cheap enough for <b>one per request</b> — even a million.'],
  ], 3) },

  { t: 'Model 1: thread-per-request (Tomcat / Spring MVC)', giua: true, body: `${tprDiagram()}
<ul style="font-size:22px">
<li>Each HTTP request gets <b>one worker thread</b> from start to end; your controller code runs on it, <b>top to bottom</b></li>
<li>When the code calls the DB, the thread just <b>waits</b> — easy to read and debug, but each waiting thread costs a real OS thread</li>
<li>All 200 busy ⇒ new connections wait in the <b>accept queue</b>; queue full ⇒ the kernel <b>drops</b> them</li>
</ul>` },

  { t: 'Real run: Spring Boot 4.1.2 — which thread serves me?', giua: true, body: two(
    java(`@RestController
public class App {
  @GetMapping("/who")
  String who() {
    Thread t = Thread.currentThread();
    return t.getName() + " virtual=" + t.isVirtual();
  }
  @GetMapping("/slow")    // pretend: a 1 s DB call
  String slow() throws InterruptedException {
    Thread.sleep(1000);
    return Thread.currentThread().getName();
  }
}`),
    out(`DEFAULTS tomcat.threads.max=200 min-spare=10
         accept-count=100 max-connections=8192
$ curl localhost:8080/who     (3 times)
http-nio-8080-exec-2 virtual=false
http-nio-8080-exec-3 virtual=false
http-nio-8080-exec-4 virtual=false
$ jstack <pid> | grep -c '"http-nio-8080-exec'
10          <- idle: only min-spare threads exist
  ... after 600 requests to /slow ...
200         <- grew to the max, never more`, { hl: [1, 2, 8, 10] })) +
    `<p style="margin:0;font-size:22px">Defaults printed by the app itself (<code class="i">TomcatServerProperties</code>). The pool starts at <b>10</b> threads (<code class="i">min-spare</code>) and grows up to <b>200</b> (<code class="i">threads.max</code>).</p>` +
    box('Read the names', '<code class="i">http-nio-8080-exec-N</code> = worker <b>N</b> of the pool serving port 8080. Each request ran on a <b>different</b> real thread — and that thread stays with the request until the response is sent.', 'lam') },

  { t: 'Measured: 600 requests, each waiting 1 s', giua: true, body: `${waves()}
${two(box('Platform threads (default)', '600 requests ÷ 200 threads = <b>3 waves</b>. Median answer 2.05 s, last 3.08 s — yet the CPU did almost nothing. Threads were the limit.', 'bad'),
box('spring.threads.virtual.enabled=true', 'Same app, one line of config. Every request got its own virtual thread: median answer <b>1.08 s</b> (a few needed ~2 s — the accept queue, slide 25). Client: Java HttpClient, 600 parallel connections.', 'ok'))}` },

  { t: 'A Java thread IS a Linux thread', giua: true, body: two(
    zm(term(`$ ls /proc/$P/task | wc -l     # P = pid of java
21
$ ps -L -o pid,lwp,stat,pcpu,comm -p $P
    PID     LWP STAT %CPU COMMAND
     13      13 Sl    0.0 java
     13      14 Sl    5.9 java
     13      32 Sl    0.0 transfer-A-to-B
     13      33 Sl    0.0 transfer-B-to-A
$ grep -E '^(Name|State)' /proc/$P/task/32/status
Name:   transfer-A-to-B
State:  S (sleeping)`, { hl: [7, 8] }), 1.2),
    `<ul style="font-size:22px">
<li>A platform thread = <b>1 kernel task</b> (LWP = thread id). <code class="i">new Thread(…, "transfer-A-to-B")</code> even shows up as the Linux thread name</li>
<li>Each one reserves a stack: the JVM log said <code class="i">stacksize: 2040k</code></li>
<li>The kernel limits how many tasks you may have (<code class="i">ulimit -u</code>, cgroup <code class="i">pids.max</code>)</li>
</ul>
${box('So', 'Threads are a <b>real OS resource</b> with a price — that is why Tomcat caps them at 200.', 'lam')}`) },

  { t: 'Sizing a pool: how many threads?', giua: true, body: two(
    java(`// a bounded pool: N threads + a waiting queue
ExecutorService pool = Executors.newFixedThreadPool(40);
List<Future<?>> jobs = new ArrayList<>();
for (int i = 0; i < 200; i++)
    jobs.add(pool.submit(() -> callDatabase()));
for (Future<?> f : jobs) f.get();   // wait for all
pool.close();   // Java 19+: shutdown + await`),
    `${box('Brian Goetz, “Java Concurrency in Practice”', `<b style="font-size:24px">N = N<sub>cpu</sub> × U<sub>cpu</sub> × (1 + W / C)</b><br>W = time waiting, C = time computing, U = target CPU use (1 = 100 %)`, 'info')}
${box('Little’s law (any queue)', `<b>busy threads = requests per second × seconds per request</b><br>500 req/s × 0.4 s = <b>200</b> threads busy at once`, '')}`) + `
<ul style="font-size:22px">
<li><b>CPU-bound</b> (W ≈ 0): N ≈ number of cores — more threads only add switching</li>
<li><b>IO-bound</b> (W ≫ C): many more threads than cores, because most of them are waiting</li>
</ul>` },

  { t: 'Measured: the formula finds the knee', giua: true, body: `${poolBars()}
<p style="margin:0;font-size:21px"><b>Left:</b> best at 4 threads = 4 cores; more threads are not faster. <b>Right:</b> 4 → 40 threads is <b>8.6× faster</b>; after 40 almost nothing changes, because now the 4 CPUs are full. Best of 5 runs; machine was busy, so read the <b>shape</b>, not the exact numbers.</p>` },

  { t: 'Java 21 virtual threads: how they work', giua: true, body: `${vtDiagram()}
<ul style="font-size:22px">
<li>JEP 444, final in <b>Java 21</b>. Same <code class="i">Thread</code> API — you still write simple blocking code</li>
<li>Waiting costs only a small object on the heap, so <b>one thread per request</b> is fine again</li>
<li>They make <b>waiting</b> cheap. They do <b>not</b> make computing faster</li>
</ul>` },

  { t: 'Measured: 10,000 tasks that each wait 1 s', giua: true, body: `${two(java(`var ex = Executors.newVirtualThreadPerTaskExecutor();
try (ex) {
  IntStream.range(0, 10_000).forEach(i ->
    ex.submit(() -> {
      Thread.sleep(Duration.ofSeconds(1));
      return i;
    }));
}  // close() waits for all tasks
// other runs: newFixedThreadPool(200),
//   newThreadPerTaskExecutor(Thread.ofPlatform()…)`), vtBars())}
${out(`$ docker run --pids-limit 2000 ... java 03-VirtualThreads.java platform 10000
[warning][os,thread] Failed to start thread "Unknown thread" - pthread_create failed (EAGAIN) for attributes: stacksize: 2040k ...
FAILED: java.lang.OutOfMemoryError: unable to create native thread: possibly out of memory or process/resource limits reached
$ docker run --pids-limit 2000 ... java 03-VirtualThreads.java virtual 10000
virtual   10,000 tasks x sleep(1 s) ->   1.06 s   (heap used ~34 MB)`, { hl: [3] })}
<p style="margin:0;font-size:21px">Also measured: <b>100,000</b> virtual threads → 1.61 s. With a limit of 2,000 tasks, platform threads <b>crash</b>; virtual threads do not care.</p>` },
  { t: 'Virtual threads: traps before you switch them on', giua: true, body: vsd(
    `<ul style="font-size:20px;gap:9px">
<li>“Virtual threads make my code faster” — CPU-bound work is <b>not</b> faster; they only make waiting cheap</li>
<li>Blocking <b>inside <code class="i">synchronized</code></b> on Java 21 <b>pins</b> the carrier thread — few carriers ⇒ app stalls</li>
<li>Putting virtual threads in a pool of 200 — that brings back the old limit</li>
<li>10,000 virtual threads, but the DB pool (HikariCP default <b>10</b>) — 9,990 now wait for a connection</li>
</ul>`,
    `<ul style="font-size:20px;gap:9px">
<li>Use them for <b>IO-bound</b> request handling; keep CPU-heavy work on a small fixed pool</li>
<li>Java 21: use <code class="i">ReentrantLock</code> around blocking calls; <b>JDK 24</b> (JEP 491) removed most <code class="i">synchronized</code> pinning</li>
<li>Never pool them: create one per task (<code class="i">newVirtualThreadPerTaskExecutor</code>)</li>
<li>Limit the <b>real</b> scarce thing (DB connections, a <code class="i">Semaphore</code> for an API), not threads</li>
</ul>`, '✗ Common mistakes', '✓ What to do') + `<p style="margin:0;font-size:21px">In Spring Boot 3.2+ / 4: <code class="i">spring.threads.virtual.enabled=true</code> — our run then printed <code class="i">tomcat-handler-1 virtual=true</code>.</p>` },

  { t: 'Model 2: Node.js — “single-threaded”?', body: `${nodeArch()}
${out(`$ node 11-node-threads.js
at start          : 7 threads -> node x6, DelayedTaskSche x1
after fs.readFile : 11 threads -> node x6, libuv-worker x4, DelayedTaskSche x1`, { hl: [3] })}
<p style="margin:0;font-size:20px">Your JavaScript runs on <b>one</b> thread. The libuv pool is built at the first fs call; <code class="i">UV_THREADPOOL_SIZE=8 node app.js</code> gave <b>libuv-worker x8</b> (set it before start; max 1024). Sockets never use the pool.</p>` },

  { t: 'The event loop: 6 phases in one turn', body: `${phases()}
<p style="margin:0;font-size:20px">Source: nodejs.org, “The Node.js Event Loop”. You mostly meet 3 phases: <b>timers</b>, <b>poll</b> (I/O results), <b>check</b> (setImmediate).</p>` },

  { t: 'Microtask vs macrotask: the real printing order', giua: true, body: two(
    js(`const log = console.log;
log('sync: start');
setTimeout(() => log('macrotask: setTimeout 0'), 0);
setImmediate(() => log('macrotask: setImmediate'));
Promise.resolve().then(() => log('microtask: promise.then'));
queueMicrotask(() => log('microtask: queueMicrotask'));
process.nextTick(() => log('nextTick'));
log('sync: end');`) + out(`$ node 04-order.js A
sync: start
sync: end
nextTick
microtask: promise.then
microtask: queueMicrotask
macrotask: setTimeout 0
macrotask: setImmediate`, { hl: [4] }),
    `${out(`# A x200: first macrotask?
    118 macrotask: setImmediate
     82 macrotask: setTimeout 0
# C (inside fs.readFile) x200:
    200 setImmediate`, { hl: [2, 3, 5] })}
${out(`$ node 04-order.js B  # promise in timer
timer 1
  promise inside timer 1
timer 2
  promise inside timer 2`)}
<p style="margin:0;font-size:19px"><b>Rule:</b> sync → nextTick → promises → next macrotask. In the main module setTimeout 0 vs setImmediate is <b>random</b>; inside an I/O callback setImmediate <b>always</b> wins.</p>`, 'r64') },
  { t: 'Measured: 8 × crypto.pbkdf2 with a pool of 4 vs 8', giua: true, body: `${pbkdfGantt()}
${js(`for (let i = 1; i <= 8; i++)
  crypto.pbkdf2('secret', 'salt', 300_000, 64, 'sha512', () => log('hash ' + i + ' done'));`)}
<p style="margin:0;font-size:20px">One hash alone: 168 ms. Pool 4 ⇒ <b>two waves</b> (jobs 5–8 wait in the queue). Pool 8 on 8 CPUs ⇒ <b>one wave</b>. 5 repeats: pool 4 = 334–364 ms, pool 8 = 256–334 ms.</p>` },

  { t: 'Blocking the event loop: one request freezes all', giua: true, body: two(
    js(`function burnCpu(ms) {        // 2 s of pure CPU
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}
http.createServer((req, res) => {
  if (req.url === '/ping') return res.end('pong');
  if (req.url === '/block') {
    burnCpu(2000);              // on the MAIN thread
    return res.end('done');
  }
}).listen(3000);`) + box('', 'A client sends <code class="i">/ping</code> every 250 ms, and <code class="i">/block</code> once at 0.5 s.', 'lam'),
    out(`  55 ms  /ping took    2 ms
 305 ms  /ping took    2 ms
 551 ms  -> GET /block
2554 ms  <- /block answered after 2002 ms
2555 ms  /ping took 2002 ms   <-- STUCK
2556 ms  /ping took 1754 ms   <-- STUCK
2557 ms  /ping took 1504 ms   <-- STUCK
2557 ms  /ping took 1254 ms   <-- STUCK
2559 ms  /ping took 1007 ms   <-- STUCK
2561 ms  /ping took  759 ms   <-- STUCK
2561 ms  /ping took  505 ms   <-- STUCK
2562 ms  /ping took  260 ms   <-- STUCK
2804 ms  /ping took    2 ms
event-loop delay: max 2001.7 ms`, { hl: [5, 14] })) },

  { t: 'The fix: move CPU work off the main thread', giua: true, body: vsd(
    js(`if (req.url === '/block') {
  burnCpu(2000);   // main thread
  res.end('done');
}`) + `${out(`2555 ms  /ping took 2002 ms   <-- STUCK
event-loop delay: max 2001.7 ms`, { hl: [2] })}<p style="font-size:19px;margin:6px 0 0">Same trap: <code class="i">bcrypt.hashSync</code>, <code class="i">fs.readFileSync</code>, <code class="i">JSON.parse</code> of 50 MB, a slow regex — inside a request handler.</p>`,
    js(`if (req.url === '/block-worker') {
  const w = new Worker(code, { eval: true });
  w.once('message', () => res.end('done'));
}`) + out(` 537 ms  -> GET /block-worker
 543 ms  /ping took    5 ms
 792 ms  /ping took    2 ms
 ...     (every ping 1-5 ms)
2573 ms  <- /block-worker answered after 2035 ms
event-loop delay: max 22.0 ms`, { hl: [6] }),
    '✗ CPU work in the handler', '✓ worker_threads (or a job queue)') + `<p style="margin:0;font-size:21px">The work still takes 2 s, but <b>other users are not frozen</b>: max loop delay <b>2001.7 ms → 22.0 ms</b>. Other ways: async APIs, split work with <code class="i">setImmediate</code>, a queue + worker process.</p>` },

  { t: 'Race condition: count++ is three steps', giua: true, body: two(
    java(`static volatile int count = 0;  // shared, no lock
static int safe = 0;
static final AtomicInteger atomic = new AtomicInteger();

// two threads, each 1,000,000 times:
count++;                          // RACE
synchronized (lock) { safe++; }   // lock
atomic.incrementAndGet();         // CPU CAS`, { hl: [6] }),
    `<table class="t" style="font-size:19px"><tr><th style="width:52px">step</th><th>Thread 1</th><th>Thread 2</th></tr>
<tr><td style="text-align:center">1</td><td><code class="i">read count → 5</code></td><td></td></tr>
<tr><td style="text-align:center">2</td><td></td><td><code class="i">read count → 5</code></td></tr>
<tr><td style="text-align:center">3</td><td><code class="i">5 + 1 = 6</code></td><td><code class="i">5 + 1 = 6</code></td></tr>
<tr><td style="text-align:center">4</td><td><code class="i">write 6</code></td><td></td></tr>
<tr style="background:#fde2e0"><td style="text-align:center;background:#fde2e0">5</td><td style="background:#fde2e0"></td><td style="background:#fde2e0"><code class="i">write 6</code> ⇒ one +1 is <b class="do">LOST</b></td></tr></table>`) +
    out(`round 1: expected 2000000 | count++ = 1428047 | synchronized = 2000000 | AtomicInteger = 2000000
round 2: expected 2000000 | count++ = 1036848 | synchronized = 2000000 | AtomicInteger = 2000000
round 3: expected 2000000 | count++ = 1092112 | synchronized = 2000000 | AtomicInteger = 2000000`, { hl: [2] }) +
    `<p style="margin:0;font-size:21px">Up to <b>48 %</b> of the increments vanished. <code class="i">volatile</code> only makes the value <b>visible</b> to other threads — it does <b>not</b> make <code class="i">++</code> atomic.</p>` },
  { t: 'Deadlock: two threads wait for each other forever', giua: true, body: two(
    deadlockCycle() + java(`synchronized (from) {           // T1: A, T2: B
  Thread.sleep(100);
  synchronized (to) { ... }    // T1 wants B, T2 wants A
}`),
    term(`$ jstack $(pgrep -x java)
Found one Java-level deadlock:
=============================
"transfer-A-to-B":
  waiting to lock monitor 0x0000ffff3000a570
  (object 0x000000008a721590, a java.lang.Object),
  which is held by "transfer-B-to-A"
"transfer-B-to-A":
  waiting to lock monitor 0x0000ffff340088b0
  (object 0x000000008a721580, a java.lang.Object),
  which is held by "transfer-A-to-B"
  ... (Java stack of both threads) ...
Found 1 deadlock.`, { hl: [2, 13] }) + box('Signature on a server', 'Requests hang, but CPU is <b>0 %</b> — threads are in state <b>S</b> (BLOCKED). Fix: always lock in the <b>same order</b> (e.g. by account id), or <code class="i">tryLock(timeout)</code>.', 'bad')) },

  { t: 'The same race in the database: lost update', giua: true, body: two(
    bash(`BEGIN;
SELECT stock AS s FROM item WHERE id = 1 \\gset
SELECT pg_sleep(0.5);            -- the app "thinks"
UPDATE item SET stock = :s - 1 WHERE id = 1;
COMMIT;
-- two buyers run this at the same time`) + out(`A read stock = 10
B read stock = 10
A wrote stock = 9
B wrote stock = 9
final stock: 9   (expected 8)`, { hl: [5], title: 'output · PostgreSQL 17.11' }),
    `<ul style="font-size:21px">
<li>Java <code class="i">synchronized</code> cannot help: two app servers, or two requests, each with <b>its own</b> DB session</li>
<li>Fix 1 — let the DB do the math in <b>one statement</b>:<br><code class="i">UPDATE item SET stock = stock - 1</code><br><code class="i">WHERE id = 1 AND stock &gt; 0</code> ⇒ final <b>8</b></li>
<li>Fix 2 — lock the row: <code class="i">SELECT … FOR UPDATE</code>; B waited and read <b>9</b> ⇒ final <b>8</b></li>
<li>Fix 3 — optimistic: a <code class="i">version</code> column (JPA <code class="i">@Version</code>)</li>
</ul>
${box('More', 'MVCC, isolation levels, row locks: cuongthai.com/courses/postgresql, Chapter 11.', 'lam')}`) },

  { t: 'Which model when?', giua: true, body: `
<table class="t" style="font-size:19px">
<tr><th style="width:190px"></th><th>Thread-per-request (platform)</th><th>Virtual threads (Java 21+)</th><th>Event loop (Node.js)</th></tr>
<tr><td><b>Code style</b></td><td>simple, blocking, top to bottom</td><td>simple, blocking, top to bottom</td><td>async / await, callbacks</td></tr>
<tr><td><b>Cost of a waiting request</b></td><td>1 OS thread (~2 MB stack)</td><td>a small heap object</td><td>a callback + a socket</td></tr>
<tr><td><b>Limit you hit first</b></td><td>pool size (200)</td><td>DB pool, memory, pinning</td><td>CPU work on the main thread</td></tr>
<tr><td><b>CPU-heavy work</b></td><td>OK, up to cores</td><td>use a small fixed pool</td><td>must go to a worker / service</td></tr>
<tr><td><b>Debug a hang</b></td><td><code class="i">jstack</code> — every request visible</td><td><code class="i">jcmd Thread.dump_to_file</code></td><td>event-loop delay, <code class="i">--cpu-prof</code></td></tr>
<tr><td><b>Typical</b></td><td>Spring MVC (default)</td><td>Spring MVC + one property</td><td>Express / NestJS</td></tr>
</table>
${box('Same OS underneath', 'All three end up in the same kernel: threads are tasks scheduled on cores, and waiting for the network is <b>epoll</b> (next deck, CS.4).', 'lam')}` },

  { t: '🧭 In our project: login runs on the event loop', giua: true, body: two(
    js(`// src/services/auth.service.ts (cuongthai.com)
import bcrypt from 'bcryptjs';     // pure JavaScript
const SALT_ROUNDS = 12;
const isValid =
  await bcrypt.compare(password, user.password);`),
    box('What we measured', 'The same library version (<b>bcryptjs 2.4.3</b>) and cost (<b>12</b>), in Docker on a busy laptop. Absolute ms differ on the VPS; the <b>one-core shape</b> does not.', '')) +
    out(`$ node 12-bcryptjs.js   (bcryptjs 2.4.3, same settings)
1 x compareSync (cost 12)        853 ms   longest event-loop stall  855 ms
1 x await compare (cost 12)      817 ms   longest event-loop stall  208 ms
8 x await compare at once       6214 ms   longest event-loop stall  861 ms`, { hl: [4] }) + `
<ul style="font-size:21px">
<li><code class="i">await</code> does <b>not</b> mean “another thread”: bcryptjs computes on the <b>main thread</b>, in slices</li>
<li>8 logins at once took <b>~8×</b> as long — one core — and every other request felt stalls up to <b>0.86 s</b></li>
<li>Options: native <code class="i">bcrypt</code> / <code class="i">argon2</code> (they run on the libuv pool), a worker, rate-limit login — measure first</li>
</ul>` },
  { t: '🧭 On a real server: the accept queue overflows', giua: true, body:
    out(`===== virtual threads, server.tomcat.accept-count=100 =====
600 concurrent GET /slow (each sleeps 1 s): wall 2.15 s | latency min 1052 ms, p50 1089 ms, max 2091 ms
600 concurrent GET /slow (each sleeps 1 s): wall 2.14 s | latency min 1029 ms, p50 1073 ms, max 2072 ms
TcpExt ListenOverflows: before 335, after 539  (+204)
===== virtual threads, server.tomcat.accept-count=1000 =====
600 concurrent GET /slow (each sleeps 1 s): wall 1.23 s | latency min 1034 ms, p50 1087 ms, max 1169 ms
600 concurrent GET /slow (each sleeps 1 s): wall 1.18 s | latency min 1028 ms, p50 1069 ms, max 1112 ms
TcpExt ListenOverflows: before 539, after 539  (+0)`, { hl: [4, 8] }) + two(
    `<ul style="font-size:21px">
<li>600 connections arrive in one burst; the kernel queue holds only <b>100</b> waiting to be accepted</li>
<li>Overflow ⇒ the SYN is dropped ⇒ the client retries after <b>~1 s</b>: no error, just a mysterious <b>+1 s tail</b></li>
<li>The counter is <b>TcpExt ListenOverflows</b> in <code class="i">/proc/net/netstat</code> — we read it before and after</li>
</ul>`,
    box('Classic hang (common pattern)', 'DB gets slow ⇒ all 200 Tomcat threads wait on it ⇒ even <code class="i">/health</code> times out and the load balancer restarts a healthy app. A thread dump shows 200 threads stuck in the <b>same DB call</b>.', 'bad')) },
  { t: '🎤 Interview questions you will hear', giua: true, body: cards([
    ['Process vs thread?', 'Threads share the process memory and fds; processes are isolated. Linux: both are tasks, threads just share more.'],
    ['How does Node handle many users with one thread?', 'Non-blocking I/O via epoll + event loop; fs/dns/crypto go to the libuv pool (4). Never block the loop.'],
    ['nextTick vs Promise vs setTimeout vs setImmediate?', 'Sync → nextTick → promise microtasks → macrotasks by phase: timers, poll, check.'],
    ['How big should a thread pool be?', 'CPU-bound ≈ cores. IO-bound: cores × (1 + W/C), then measure. Little’s law: throughput × latency.'],
    ['What are virtual threads, when not to use them?', 'JVM-managed cheap threads for blocking IO. Not for CPU work; watch pinning (Java 21) and DB pool size.'],
    ['How do you find a deadlock in production?', 'jstack / jcmd thread dump: “Found one Java-level deadlock”. Prevent with a global lock order or tryLock.'],
  ], 2) },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:24px">
<li>A Spring MVC app has the default pool. 600 requests each wait 1 s for the DB. Roughly how long until the last answer — and what one setting changes that?</li>
<li>What prints first: <code class="i">setTimeout(f, 0)</code> or <code class="i">setImmediate(g)</code>, both called inside an <code class="i">fs.readFile</code> callback?</li>
<li>Two requests do <code class="i">SELECT stock</code> then <code class="i">UPDATE … SET stock = :old - 1</code>. What goes wrong, and give two fixes.</li>
</ol>
${box('Answers', '<b>1.</b> ~3 s: 3 waves of 200 (we measured 3.08 s); <code class="i">spring.threads.virtual.enabled=true</code> ⇒ median ~1.1 s. <b>2.</b> setImmediate — always, inside an I/O callback (200/200 runs). <b>3.</b> Lost update (10 → 9, not 8); fix with <code class="i">SET stock = stock - 1</code> in one statement, or <code class="i">SELECT … FOR UPDATE</code>.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, body: `
<ul>
<li>Thread-per-request: simple code, but a waiting request <b>holds an OS thread</b> — Tomcat caps at <b>200</b></li>
<li>Pool size: CPU-bound ≈ cores; IO-bound ≈ cores × (1 + W/C) — <b>then measure</b></li>
<li>Virtual threads: blocking code with event-loop-like scale — <b>50 s → 1 s</b> for 10,000 waits</li>
<li>Node: one JS thread + epoll + libuv pool of 4; microtasks before macrotasks; <b>never block the loop</b></li>
<li>Shared data needs atomic steps: <code class="i">AtomicInteger</code>/locks in Java, <b>one SQL statement or FOR UPDATE</b> in the DB</li>
</ul>
${box('Next: CS.4 — Async I/O & epoll', 'How can one thread watch 10,000 sockets? We write an epoll echo server in C and watch Node call <code class="i">epoll_wait</code> with strace.', 'lam')}` },
]);
