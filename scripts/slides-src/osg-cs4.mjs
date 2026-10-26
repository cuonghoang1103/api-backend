/**
 * osg-cs4 — OSG202 · ⭐ Advanced 4 "Async I/O: blocking, non-blocking, epoll" (deck tự dựng, slide EN, khuôn _pg-chung.mjs, 26/10/2026).
 * Đề cương: REPO/OSG202/CHUYEN-SAU.md mục 4. MỌI output = CHẠY THẬT trong runner osg202-lab (Debian 12 aarch64, gcc 12.2, strace 6.1,
 *   Temurin 21.0.12.1, Node v22.23.4; Docker Desktop, VM Linux 7.0.12-linuxkit, 10 vCPU) — nguồn REPO/OSG202/gen/code/cs4/*.out.txt.
 *   Số thời gian = MỘT lần chạy trên máy đang bận ⇒ đọc TỈ LỆ, không đọc chữ số cuối.
 * Nguồn: man7.org epoll(7), epoll_ctl(2), select(2), poll(2), io_uring(7), aio(7); Stevens "UNIX Network Programming" vol. 1 §6.2
 *   (5 mô hình I/O); Dan Kegel "The C10K problem" (1999); docs.libuv.org design overview; nodejs.org "Backpressuring in Streams";
 *   docs.docker.com/engine/security/seccomp (io_uring_* bị chặn, moby/moby#46762); Google Security Blog 06/2023 (kCTF: 60 % bài khai
 *   thác dùng io_uring ⇒ tắt trên ChromeOS / server production, Android chặn bằng seccomp).
 */
import { lamDeck, sql, psql, sh, two as two0, box, cards, vsd } from './_pg-chung.mjs';

export const deck = { key: 'cs4', code: 'CS.4', title: 'Async I/O: blocking, non-blocking, epoll', sub: 'OSG202 · ⭐ Advanced' };

const out = (t, o = {}) => psql(t, { title: 'output', sm: true, ...o });
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const c = (s, o = {}) => sql(s, { lang: 'c', sm: true, ...o });
const java = (s, o = {}) => sql(s, { lang: 'java', sm: true, ...o });
const js = (s, o = {}) => sql(s, { lang: 'javascript', sm: true, ...o });
const zm = (h, z) => `<div style="zoom:${z}">${h}</div>`;
/* two() của khuôn đặt a, b thẳng vào lưới 2 cột ⇒ a/b nhiều phần tử là vỡ lưới. Bọc mỗi cột một div (min-width:0). */
const col = (h) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const AR = (id, col) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${col}"/></marker>`;
/* rộng chữ ước lượng: 0,602 × cỡ chữ × số ký tự (đặt nhãn bằng công thức) */
const tw = (s, fs) => Math.ceil(String(s).length * 0.602 * fs);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.it ? ' font-style="italic"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="6 4"' : ''}/>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', GY = '#8a8a8a';

/* ── Hình 1: hai pha của MỌI lần đọc ── */
const twoPhases = () => {
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial"><defs>${AR('pa', BR)}${AR('pb', BL)}</defs>`;
  s += T(10, 62, 'your app', 19, { w: 800, f: BL }) + T(10, 84, '(user space)', 15, { f: GY });
  s += T(10, 182, 'kernel', 19, { w: 800, f: BR }) + T(10, 204, '(kernel space)', 15, { f: GY });
  s += `<line x1="150" y1="122" x2="1100" y2="122" stroke="#bbb" stroke-width="2" stroke-dasharray="8 6"/>`;
  s += R(160, 40, 160, 56, '#eef4fa', BL) + T(240, 74, 'read(fd, buf)', 17, { a: 'middle', w: 700, f: BL });
  s += `<line x1="240" y1="98" x2="240" y2="150" stroke="${BL}" stroke-width="2.5" marker-end="url(#pb)"/>`;
  s += R(330, 150, 400, 66, '#fff7ef', OR) + T(530, 178, 'PHASE 1: wait for data', 19, { a: 'middle', w: 800, f: BR });
  s += T(530, 204, 'network card / disk → kernel buffer', 16, { a: 'middle', f: '#555' });
  s += `<line x1="732" y1="183" x2="760" y2="183" stroke="${BR}" stroke-width="3" marker-end="url(#pa)"/>`;
  s += R(764, 150, 330, 66, '#f1f9f4', GR) + T(929, 178, 'PHASE 2: copy', 19, { a: 'middle', w: 800, f: GR });
  s += T(929, 204, 'kernel buffer → your buf', 16, { a: 'middle', f: '#555' });
  s += `<line x1="929" y1="148" x2="929" y2="100" stroke="${GR}" stroke-width="2.5" marker-end="url(#pb)"/>`;
  s += R(820, 40, 220, 56, '#eef4fa', BL) + T(930, 74, 'read() returns 6', 17, { a: 'middle', w: 700, f: BL });
  s += T(530, 244, 'can take seconds (a slow client, a DB query)', 16, { a: 'middle', f: RD, it: true });
  s += T(929, 244, 'microseconds', 16, { a: 'middle', f: GR, it: true });
  return s + `</svg>`;
};

/* ── Hình 2: 5 mô hình — dòng thời gian (Stevens UNP §6.2) — cùng kịch bản với sim/cs4/nam-mo-hinh.mjs ── */
const fiveModels = () => {
  const x0 = 270, u = 100; // 1 đơn vị = 100 px, 0..8
  const rows = [
    ['1 blocking', 'read()', [['sleep', 0, 5, 'asleep in read()'], ['copy', 5, 6, 'copy'], ['use', 6, 8, 'use data']]],
    ['2 non-blocking', 'read() → EAGAIN', [['spin', 0, 5, 'EAGAIN EAGAIN EAGAIN … (CPU 100 %)'], ['copy', 5, 6, 'copy'], ['use', 6, 8, 'use data']]],
    ['3 multiplexing', 'select / poll / epoll', [['sleep', 0, 5, 'asleep in epoll_wait()'], ['copy', 5, 6, 'read()'], ['use', 6, 8, 'use data']]],
    ['4 signal-driven', 'SIGIO', [['free', 0, 5, 'free: other work'], ['copy', 5, 6, 'read()'], ['use', 6, 8, 'use data']]],
    ['5 asynchronous', 'aio / io_uring', [['free', 0, 6, 'free: other work — the kernel copies'], ['use', 6, 8, 'use data']]],
  ];
  const ST = { sleep: ['#f3f3f3', '#bbb', '#777'], spin: ['#fdd8d3', RD, RD], copy: ['#fde9a8', OR, BR], use: ['#dbe8f5', BL, BL], free: ['#d6f0df', GR, GR] };
  let s = `<svg viewBox="0 0 1110 420" width="1110" height="420" font-family="Arial">`;
  for (let t = 0; t <= 8; t++) s += `<line x1="${x0 + t * u}" y1="40" x2="${x0 + t * u}" y2="386" stroke="#e4e4e4"/>` + T(x0 + t * u, 404, `${t}`, 14, { a: 'middle', f: GY });
  s += T(10, 24, 'thread of your app', 15, { w: 700, f: GY });
  s += R(x0, 6, 5 * u, 28, '#f3f3f3', '#bbb', { rx: 4, dash: true }) + T(x0 + 2.5 * u, 26, 'kernel: no data yet', 15, { a: 'middle', f: '#777' });
  s += R(x0 + 5 * u, 6, u, 28, '#ffd9b0', OR, { rx: 4 }) + T(x0 + 5.5 * u, 26, 'arrives', 15, { a: 'middle', w: 700, f: BR });
  rows.forEach(([n, how, segs], i) => {
    const y = 52 + i * 66;
    s += T(10, y + 22, n, 19, { w: 800, f: '#333' }) + T(10, y + 44, how, 15, { f: GY });
    segs.forEach(([k, a, b, l]) => {
      const [f, st, tf] = ST[k];
      s += R(x0 + a * u, y + 4, (b - a) * u - 2, 46, f, st, { rx: 6, sw: 1.8, dash: k === 'sleep' });
      s += T(x0 + (a + b) / 2 * u, y + 33, l, (b - a) >= 3 ? 17 : 15, { a: 'middle', w: 700, f: tf });
    });
  });
  s += T(x0 + 4 * u, 418, 'time →', 13, { a: 'middle', f: GY });
  return s + `</svg>`;
};

/* ── Hình 3: epoll — interest list + ready list ── */
const epollAnatomy = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial"><defs>${AR('ea', BR)}${AR('eb', BL)}${AR('ec', GR)}</defs>`;
  // app
  s += R(4, 20, 250, 260, '#eef4fa', BL, { sw: 2.5, rx: 12 });
  s += T(129, 48, 'your app (1 thread)', 17, { a: 'middle', w: 800, f: BL });
  const calls = [['epoll_create1(0)', 'once: make the instance'], ['epoll_ctl(ADD, fd)', 'once per connection'], ['epoll_wait(…)', 'in the loop: sleep, then']];
  calls.forEach(([a, b], i) => {
    s += R(18, 62 + i * 64, 222, 56, '#fff', BL, { rx: 8, sw: 1.5 });
    s += T(129, 85 + i * 64, a, 16, { a: 'middle', w: 700, f: '#245077' });
    s += T(129, 107 + i * 64, b, 14, { a: 'middle', f: '#555' });
  });
  s += T(129, 270, 'get ONLY the ready fds', 14, { a: 'middle', f: GR, w: 700 });
  // kernel box
  s += R(300, 4, 806, 292, '#fffaf5', OR, { sw: 2.5, rx: 14 });
  s += T(703, 30, 'kernel: one epoll instance (it is an fd too)', 18, { a: 'middle', w: 800, f: BR });
  // interest list
  s += R(320, 46, 380, 236, '#fff', BR, { rx: 10 });
  s += T(510, 72, 'interest list (red-black tree)', 16, { a: 'middle', w: 800, f: BR });
  s += T(510, 94, 'every fd you added — 10,000 sockets', 14, { a: 'middle', f: '#555' });
  const fds = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  fds.forEach((f, i) => {
    const x = 338 + (i % 5) * 70, y = 108 + Math.floor(i / 5) * 54, rdy = [7, 12, 18].includes(f);
    s += R(x, y, 60, 40, rdy ? '#d6f0df' : '#f6f6f6', rdy ? GR : '#bbb', { rx: 20, sw: rdy ? 2.5 : 1.5 });
    s += T(x + 30, y + 26, `fd ${f}`, 14, { a: 'middle', w: rdy ? 800 : 400, f: rdy ? GR : '#666' });
  });
  s += T(510, 274, '… 9,985 more — nobody scans them', 14, { a: 'middle', f: GY, it: true });
  // ready list
  s += R(780, 100, 300, 120, '#f1f9f4', GR, { rx: 10 });
  s += T(930, 126, 'ready list', 17, { a: 'middle', w: 800, f: GR });
  [7, 12, 18].forEach((f, i) => s += R(800 + i * 92, 144, 80, 40, '#fff', GR, { rx: 8 }) + T(840 + i * 92, 170, `fd ${f}`, 15, { a: 'middle', w: 800, f: GR }));
  s += T(930, 206, 'filled by the driver callback', 13, { a: 'middle', f: '#555' });
  s += `<path d="M700,160 C730,160 750,160 776,160" stroke="${GR}" stroke-width="2.5" fill="none" marker-end="url(#ec)"/>`;
  s += T(738, 148, 'data!', 14, { a: 'middle', f: GR, w: 700 });
  s += T(930, 246, 'epoll_wait() returns these 3', 15, { a: 'middle', f: GR, w: 800 });
  s += `<path d="M242,96 C270,96 290,96 316,110" stroke="${BL}" stroke-width="2" fill="none" marker-end="url(#eb)"/>`;
  return s + `</svg>`;
};

/* ── Hình 4: kích theo mức vs theo sườn ── */
const ltEt = () => {
  const x0 = 140, sc = 9.2; // 1 byte-step = sc px theo thời gian
  let s = `<svg viewBox="0 0 1110 290" width="1110" height="290" font-family="Arial"><defs>${AR('la', GR)}${AR('lb', RD)}</defs>`;
  // trục bộ đệm
  s += T(10, 40, 'bytes waiting', 15, { w: 700, f: GY }) + T(10, 58, 'in the socket', 15, { w: 700, f: GY });
  const pts = [[0, 0], [8, 0], [8, 100], [20, 100], [20, 90], [40, 90], [40, 95], [60, 95], [60, 85], [100, 85]];
  const Y = (b) => 120 - b * 0.9;
  s += `<polyline points="${pts.map(([t, b]) => `${x0 + t * sc},${Y(b)}`).join(' ')}" fill="none" stroke="${BR}" stroke-width="3"/>`;
  s += `<line x1="${x0}" y1="122" x2="${x0 + 100 * sc}" y2="122" stroke="#999"/>`;
  s += T(x0 + 8 * sc + 6, 26, '100 bytes arrive', 14, { f: BR, w: 700 });
  s += T(x0 + 20 * sc + 6, 70, 'app reads 10', 14, { f: '#555' });
  s += T(x0 + 40 * sc + 6, 26, '5 NEW bytes arrive', 14, { f: BR, w: 700 });
  s += T(x0 + 60 * sc + 6, 70, 'app reads 10', 14, { f: '#555' });
  // LT
  s += T(10, 172, 'level-', 17, { w: 800, f: GR }) + T(10, 192, 'triggered', 17, { w: 800, f: GR });
  for (let t = 8; t <= 96; t += 8) s += `<line x1="${x0 + t * sc}" y1="196" x2="${x0 + t * sc}" y2="160" stroke="${GR}" stroke-width="2.5" marker-end="url(#la)"/>`;
  s += T(x0 + 50 * sc, 216, 'wakes you EVERY time you wait, as long as ANY byte is left', 15, { a: 'middle', f: GR, w: 700 });
  // ET
  s += T(10, 252, 'edge-', 17, { w: 800, f: RD }) + T(10, 272, 'triggered', 17, { w: 800, f: RD });
  [8, 40].forEach((t) => s += `<line x1="${x0 + t * sc}" y1="276" x2="${x0 + t * sc}" y2="240" stroke="${RD}" stroke-width="3" marker-end="url(#lb)"/>`);
  s += T(x0 + 64 * sc, 262, 'wakes you only when NEW data arrives (a change)', 15, { a: 'middle', f: RD, w: 700 });
  return s + `</svg>`;
};

/* ── Hình 5: chi phí một lần hỏi — số đo thật quet-on.out.txt (thang log) ── */
const scanBars = () => {
  const rows = [[10, 0.86, 0.24], [100, 6.49, 0.24], [1000, 69.89, 0.24], [10000, 800.87, 0.24]];
  const x0 = 96, W = 220, lg = (v) => (Math.log10(v) + 1) / 4.1 * W; // 0.1 µs … ~1260 µs; nhãn dài nhất "poll 800.87" 11 × 0,602 × 16 ≈ 106 px ⇒ 96 + 220 + 112 < 440
  let s = `<svg viewBox="0 0 440 340" style="width:100%;height:auto" font-family="Arial">`;
  s += T(220, 20, 'µs per call, log scale (measured)', 16, { a: 'middle', w: 700, f: GY });
  rows.forEach(([n, p, e], i) => {
    const y = 36 + i * 76;
    s += T(x0 - 10, y + 38, `${n.toLocaleString('en')}`, 17, { a: 'end', w: 700 });
    s += R(x0, y + 4, lg(p), 30, '#fdd8d3', RD, { rx: 4, sw: 1.5 }) + T(x0 + lg(p) + 6, y + 25, `poll ${p}`, 16, { f: RD, w: 700 });
    s += R(x0, y + 38, lg(e), 30, '#d6f0df', GR, { rx: 4, sw: 1.5 }) + T(x0 + lg(e) + 6, y + 59, `epoll ${e}`, 16, { f: GR, w: 700 });
  });
  s += T(x0 - 10, 336, 'fds', 14, { a: 'end', f: GY });
  return s + `</svg>`;
};

/* ── Hình 6: so sánh 10.000 kết nối — số đo thật so-sanh.out.txt ── */
const compareBars = () => {
  const m = [['Threads', 1, 10001, ''], ['VmRSS', 1.2, 121.2, ' MiB'], ['VmSize', 2.2, 80630, ' MiB'], ['time', 154, 1276, ' ms']];
  let s = `<svg viewBox="0 0 450 300" style="width:100%;height:auto" font-family="Arial">`;
  m.forEach(([k, e, t, u], i) => {
    const y = 8 + i * 72, mx = Math.log10(t * 1.6), w = (v) => Math.max(4, Math.log10(v * 1.6) / mx * 196); // nhãn dài nhất "threads 80,630 MB" 17 × 0,602 × 14 ≈ 144 px
    s += T(92, y + 34, k, 16, { a: 'end', w: 800 });
    s += R(104, y + 6, w(e), 24, '#d6f0df', GR, { rx: 4, sw: 1.5 }) + T(110 + w(e), y + 24, `epoll ${e.toLocaleString('en')}${u}`, 14, { f: GR, w: 700 });
    s += R(104, y + 36, w(t), 24, '#fdd8d3', RD, { rx: 4, sw: 1.5 }) + T(110 + w(t), y + 54, `threads ${t.toLocaleString('en')}${u}`, 14, { f: RD, w: 700 });
  });
  s += T(225, 296, 'log scale', 13, { a: 'middle', f: GY, it: true });
  return s + `</svg>`;
};

/* ── Hình 7: ai đứng trên epoll ── */
const whoUses = () => {
  let s = `<svg viewBox="0 0 1110 270" width="1110" height="270" font-family="Arial"><defs>${AR('wa', BR)}</defs>`;
  const top = [['nginx', 'event module: use epoll'], ['Node.js', 'libuv event loop'], ['Spring / Tomcat', 'NIO connector: Poller'], ['Netty', 'NIO or native epoll'], ['Redis', 'ae_epoll.c'], ['Go', 'runtime netpoller']];
  top.forEach(([a, b], i) => {
    const x = 6 + i * 184;
    s += R(x, 8, 172, 72, '#eef4fa', BL, { rx: 10 });
    s += T(x + 86, 38, a, 18, { a: 'middle', w: 800, f: BL });
    s += T(x + 86, 62, b, 14, { a: 'middle', f: '#555' });
    s += `<line x1="${x + 86}" y1="82" x2="${x + 86}" y2="114" stroke="${BR}" stroke-width="2.5" marker-end="url(#wa)"/>`;
  });
  s += R(150, 92, 810, 0.1, '#fff', '#fff');
  s += R(6, 118, 1098, 54, '#fff7ef', OR, { rx: 10 });
  s += T(555, 140, 'library layer: libuv · java.nio.channels.Selector (sun.nio.ch.EPollSelectorImpl) · netty-transport-native-epoll', 15, { a: 'middle', w: 700, f: BR });
  s += T(555, 162, 'on macOS / BSD the same libraries use kqueue, on Windows IOCP', 14, { a: 'middle', f: '#555' });
  s += `<line x1="555" y1="174" x2="555" y2="202" stroke="${BR}" stroke-width="2.5" marker-end="url(#wa)"/>`;
  s += R(206, 206, 700, 56, '#f1f9f4', GR, { rx: 10, sw: 2.5 });
  s += T(556, 232, 'Linux kernel: epoll_create1 · epoll_ctl · epoll_wait', 19, { a: 'middle', w: 800, f: GR });
  s += T(556, 254, '(on ARM64 the syscall is epoll_pwait)', 14, { a: 'middle', f: '#555' });
  return s + `</svg>`;
};

/* ── Hình 8: io_uring — hai vòng đệm dùng chung ── */
const uringRings = () => {
  let s = `<svg viewBox="0 0 1110 280" width="1110" height="280" font-family="Arial"><defs>${AR('ua', BL)}${AR('ub', GR)}</defs>`;
  s += R(4, 10, 250, 260, '#eef4fa', BL, { sw: 2.5, rx: 12 });
  s += T(129, 40, 'your app', 18, { a: 'middle', w: 800, f: BL });
  s += T(129, 82, '① write an SQE:', 16, { a: 'middle', f: '#333' }) + T(129, 104, '"READ fd 4 into buf"', 15, { a: 'middle', f: BL, w: 700 });
  s += T(129, 146, '② io_uring_enter()', 16, { a: 'middle', f: '#333' }) + T(129, 168, 'returns at once', 15, { a: 'middle', f: '#555' });
  s += T(129, 210, '④ read the CQE:', 16, { a: 'middle', f: '#333' }) + T(129, 232, 'res = 6, data in buf', 15, { a: 'middle', f: GR, w: 700 });
  s += R(300, 10, 806, 260, '#fffaf5', OR, { sw: 2.5, rx: 14 });
  s += T(703, 38, 'memory shared by app and kernel (mmap)', 17, { a: 'middle', w: 800, f: BR });
  const ring = (x, y, lab, col, fill, items) => {
    let r = T(x, y - 10, lab, 16, { w: 800, f: col });
    for (let i = 0; i < 8; i++) r += R(x + i * 52, y, 48, 40, i < items ? fill : '#fff', col, { rx: 5, sw: 1.5 });
    return r;
  };
  s += ring(340, 82, 'Submission Queue (SQ): requests', BL, '#dbe8f5', 1);
  s += ring(340, 196, 'Completion Queue (CQ): results', GR, '#d6f0df', 1);
  s += T(366, 108, 'SQE', 13, { a: 'middle', w: 700, f: BL }) + T(366, 222, 'CQE', 13, { a: 'middle', w: 700, f: GR });
  s += R(810, 110, 270, 96, '#fff', BR, { rx: 10 });
  s += T(945, 138, '③ kernel does the I/O', 16, { a: 'middle', w: 800, f: BR });
  s += T(945, 162, 'waits AND copies,', 15, { a: 'middle' }) + T(945, 184, 'then posts a CQE', 15, { a: 'middle' });
  s += `<path d="M760,102 C800,102 820,112 840,116" stroke="${BL}" stroke-width="2.5" fill="none" marker-end="url(#ua)"/>`;
  s += `<path d="M850,206 C820,218 790,218 762,216" stroke="${GR}" stroke-width="2.5" fill="none" marker-end="url(#ub)"/>`;
  s += T(703, 262, 'many requests per syscall — or none at all with SQPOLL', 14, { a: 'middle', f: '#555', it: true });
  return s + `</svg>`;
};

/* ── Hình 9: ví dụ đời thường — chờ một kiện hàng ── */
const parcel = () => {
  const P = [
    ['🧍', '1. Stand at the door', 'all day. You can do', 'nothing else.', 'blocking', '#777'],
    ['🚪', '2. Open the door every', '10 seconds to check.', 'Tiring, mostly empty.', 'non-blocking', RD],
    ['🛎️', '3. The lobby guard', 'watches 1,000 flats and', 'calls whoever got mail.', 'multiplexing', BL],
    ['📱', '4. The courier phones:', '"it is downstairs" —', 'you go and fetch it.', 'signal-driven', OR],
    ['🧊', '5. The courier puts it', 'in your fridge, then', 'texts "done".', 'asynchronous', GR],
  ];
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">`;
  P.forEach(([e, a, b, c2, k, col], i) => {
    const x = 4 + i * 222;
    s += R(x, 4, 210, 290, '#fff', col, { rx: 12, sw: 2.5 });
    s += T(x + 105, 70, e, 48, { a: 'middle' });
    s += T(x + 105, 122, a, 16, { a: 'middle', w: 700, f: '#333' });
    s += T(x + 105, 146, b, 16, { a: 'middle', f: '#333' });
    s += T(x + 105, 170, c2, 16, { a: 'middle', f: '#333' });
    s += R(x + 20, 218, 170, 44, '#fafafa', col, { rx: 22, sw: 2 });
    s += T(x + 105, 246, k, 17, { a: 'middle', w: 800, f: col });
  });
  return s + `</svg>`;
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'academy/osg202', bieuTuong: '🐧', khau: 'from zero to real backend work',
  chuong: '⭐ Advanced 4 — Async I/O: blocking, non-blocking, epoll', bai: 'CS.4',
}, [
  { cover: true, t: 'Async I/O:<br>blocking, non-blocking, epoll', sub: 'How one thread serves 10,000 connections — the five I/O models, select/poll/epoll, io_uring and backpressure, all run on real Linux.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Name the <b>5 I/O models</b> and see each one run on the same pipe</li>
<li>Explain the <b>C10K</b> problem and why <code class="i">select</code>/<code class="i">poll</code> do not scale (1024 limit, O(n) scan)</li>
<li>Write an <b>epoll</b> echo server in C: <b>1 thread, 10,000 connections</b></li>
<li>Avoid the classic <b>edge-triggered</b> bug; compare with thread-per-connection</li>
<li>See Node, Java NIO and Tomcat on top of epoll; meet <b>io_uring</b> and <b>backpressure</b></li>
</ul>
${box('Builds on', 'School lesson <b>5.A</b> (I/O software: blocking, interrupts, buffering) and <b>CS.3</b> (event loop, libuv). Here we open the black box: what does the loop actually wait on?', 'lam')}` },

  { t: 'Start with a parcel: five ways to wait', giua: true, body: `${parcel()}
<p style="margin:0;font-size:23px">The parcel = <b>data</b> for your program (a network packet, a DB answer). The five habits are exactly the <b>five I/O models</b> of Unix — same names, same trade-offs.</p>` },

  { t: 'Six words we need', to: true, giua: true, body: cards([
    ['📇 File descriptor (fd)', 'A small number that names an open file, pipe or <b>socket</b>. A server has one fd per client (see CS.2).'],
    ['⏳ Blocking', '<code class="i">read()</code> puts the thread to <b>sleep</b> until data is there. Simple, but the thread can do nothing else.'],
    ['🚫 Non-blocking', 'With <code class="i">O_NONBLOCK</code>, <code class="i">read()</code> returns at once: data, or <b>-1 EAGAIN</b> = "nothing yet".'],
    ['🔀 Multiplexing', 'ONE call watches MANY fds and says <b>which are ready</b>: <code class="i">select</code>, <code class="i">poll</code>, <code class="i">epoll</code>.'],
    ['✅ Readiness vs completion', '"fd 7 <b>can</b> be read now" (epoll) vs "your read is <b>done</b>, data is in buf" (io_uring).'],
    ['🌊 Backpressure', 'The fast side must <b>slow down</b> when the slow side cannot keep up — or memory fills.'],
  ], 3) },

  { t: 'Every read() has two phases', giua: true, body: `${twoPhases()}
<ul style="font-size:23px">
<li><b>Blocking vs non-blocking</b> = what happens in <b>phase 1</b>: does the thread sleep, or get <code class="i">EAGAIN</code> and come back later?</li>
<li><b>Synchronous vs asynchronous</b> = who does <b>phase 2</b>: you (inside <code class="i">read()</code>) or the kernel, telling you only when it is finished</li>
<li>By the POSIX definition, models 1–4 are all <b>synchronous</b> — only model 5 is truly asynchronous</li>
</ul>` },

  { t: 'The 5 I/O models on one timeline', giua: true, body: `${fiveModels()}
<p style="margin:0;font-size:21px">After W. R. Stevens, <i>UNIX Network Programming</i> vol. 1, §6.2. Only <b class="do">2</b> burns CPU while waiting; <b class="xanh">4–5</b> leave the thread free; only <b class="xanh">5</b> lets the kernel copy.</p>` },

  { t: 'Real run: the same 6 bytes, waited for 5 ways', giua: true, body: two(
    c(`// a child writes "hello\\n" after 300 ms
n = read(fd, buf, 64);              // 1 blocking
fcntl(fd, F_SETFL, O_NONBLOCK);     // 2 non-blocking
while (read(fd, buf, 64) < 0 && errno == EAGAIN)
    tries++;
poll(&pf, 1, -1); read(fd, buf, 64);   // 3
fcntl(fd, F_SETOWN, getpid());      // 4 SIGIO
fcntl(fd, F_SETFL, O_ASYNC | O_NONBLOCK);
aio_read(&cb); aio_suspend(list, 1, NULL);  // 5`),
    box('Read the columns', 'Model 2: <b>1,388,826</b> useless <code class="i">read()</code> calls = 295 ms CPU. Model 5: glibc AIO hides a <b>helper thread</b> (threads = 2).', 'lam') +
    box('Servers use model 3', 'One sleep covers <b>many</b> fds: <code class="i">epoll</code>.', 'xanh'), 'r64') +
    out(`$ gcc -Wall -O0 -pthread nam-mo-hinh.c -o nam-mo-hinh && ./nam-mo-hinh
model                 waited   CPU used  threads  how the 6 bytes arrived
1 blocking read()      300 ms      0 ms      1    read() slept in the kernel, returned 6 bytes
2 non-blocking loop    300 ms    295 ms      1    1388826 x EAGAIN, then 6 bytes
3 poll() multiplexing  300 ms      0 ms      1    poll() = 1 (fd 3 readable), then read() 6 bytes
4 signal-driven SIGIO  300 ms      0 ms      1    SIGIO handler ran, then read() 6 bytes
5 POSIX aio_read()     300 ms      0 ms      2    aio_error() = 0, 6 bytes already copied into buf`, { hl: [4, 7] }) },

  { t: 'The C10K problem (1999)', giua: true, body: two(
    `<ul style="font-size:23px">
<li>Dan Kegel asked: how can <b>one server</b> handle <b>10,000 clients at once</b>? Hardware was fine — the <b>API</b> was the problem</li>
<li>One thread per client ⇒ 10,000 stacks + context switches</li>
<li>One <code class="i">select</code>/<code class="i">poll</code> loop ⇒ every call passes and scans <b>all 10,000 fds</b>, even if only 3 are active</li>
<li>Answer: an API where you <b>register once</b> and the kernel keeps a <b>ready list</b></li>
</ul>
${box('Measured later in this deck', '10,000 clients: 10,001 threads = <b>79 GiB</b> virtual, 124 MB resident, 1.3 s · one epoll thread = <b>2 MB</b>, 1.2 MB, 0.15 s.', 'bad')}`,
    `<table class="t" style="font-size:19px"><tr><th style="width:96px">Year</th><th>API</th></tr>
<tr><td>1983</td><td><code class="i">select()</code> — 4.2BSD</td></tr>
<tr><td>1980s</td><td><code class="i">poll()</code> — System V</td></tr>
<tr><td>1999</td><td>"The C10K problem" — D. Kegel</td></tr>
<tr><td>2000</td><td><code class="i">kqueue</code> — FreeBSD 4.1</td></tr>
<tr><td>2002</td><td><b><code class="i">epoll</code> — Linux 2.5.44</b></td></tr>
<tr><td>2019</td><td><code class="i">io_uring</code> — Linux 5.1</td></tr>
</table>
${box('Today', 'Servers handle millions of connections. The target moved to C10M — but epoll is still the workhorse on Linux.', 'lam')}`, 'r64') },

  { t: 'select(): a 1024-bit bitmap', giua: true, body: two(
    c(`printf("FD_SETSIZE = %d ...", FD_SETSIZE, ...);
int fd = dup2(p[0], 1500);    // fd number 1500

struct pollfd pf = { .fd = fd, .events = POLLIN };
poll(&pf, 1, 0);              // fine

fd_set rd; FD_ZERO(&rd);
FD_SET(fd, &rd);              // bit 1500 of 1024!
select(fd + 1, &rd, NULL, NULL, NULL);`, { hl: [8] }),
    `<ul style="font-size:21px">
<li>You rebuild the set <b>before every call</b>; the kernel copies it in and out</li>
<li>fd ≥ 1024 is <b>undefined behaviour</b> (man select(2)) — here <code class="i">_FORTIFY_SOURCE</code> catches it</li>
</ul>
${box('On a server', 'Fd numbers are just counters. Under load a busy server passes fd 1024 — a <code class="i">select</code> loop then crashes, or without fortify silently <b>corrupts memory</b>.', 'bad')}`) +
    out(`$ gcc -Wall -O0 -pthread -O2 -D_FORTIFY_SOURCE=2 select-1024.c -o select-1024 && ./select-1024
FD_SETSIZE = 1024, sizeof(fd_set) = 128 bytes = a bitmap of 1024 bits
our pipe now also lives at fd 1500
poll()   on fd 1500: returned 1, revents=POLLIN? yes
*** bit out of range 0 - FD_SETSIZE on fd_set ***: terminated
Aborted
[exit code 134]`, { hl: [4, 5] }) },

  { t: 'poll(): no limit, but it scans everything', giua: true, body: two(
    `${scanBars()}`,
    `${out(`  watched fds  select() us/call  poll() us/call  epoll_wait() us/call
           10              0.92            0.86                  0.24
          100              6.60            6.49                  0.24
         1000             70.48           69.89                  0.24
        10000    n/a (fd>=1024)          800.87                  0.24`, { hl: [5] })}
<ul style="font-size:21px">
<li>Test: N idle fds + <b>1</b> fd that is always ready, 2,000 calls, best of 5</li>
<li>poll: <b>×10 fds ⇒ ×10 time</b> — O(n) per call</li>
<li>epoll_wait: <b>0.24 µs flat</b> — it only reads the ready list</li>
</ul>`, 'r46') },

  { t: 'epoll: register once, ask only for ready fds', giua: true, body: `${epollAnatomy()}
<ul style="font-size:22px">
<li><code class="i">epoll_create1</code> makes an instance; <code class="i">epoll_ctl</code> ADD / MOD / DEL changes the <b>interest list</b> — once per connection, not once per call</li>
<li>When data arrives, the kernel puts that fd on the <b>ready list</b>; <code class="i">epoll_wait</code> sleeps until the list is non-empty and returns <b>only those</b></li>
</ul>` },

  { t: 'An echo server with ONE thread (C, epoll)', giua: true, body: two(
    c(`int ep = epoll_create1(0);
epoll_ctl(ep, EPOLL_CTL_ADD, ls, &ev);   // listening socket
while (done < want) {
  int n = epoll_wait(ep, evs, 256, -1);  // sleep
  for (int i = 0; i < n; i++) {
    int fd = evs[i].data.fd;
    if (fd == ls) {                       // new clients
      while ((c = accept4(ls, 0, 0, SOCK_NONBLOCK)) >= 0)
        epoll_ctl(ep, EPOLL_CTL_ADD, c, &ce);
      continue;
    }
    ssize_t r = read(fd, buf, sizeof buf); // won't block
    if (r > 0) write(fd, buf, r);          // echo
    else if (r == 0) { close(fd); done++; }
  }
}`, { hl: [4, 12] }),
    `<ul style="font-size:21px;gap:10px">
<li><b>Every</b> socket is <code class="i">O_NONBLOCK</code> (<code class="i">SOCK_NONBLOCK</code>): one slow client must never put the only thread to sleep</li>
<li>The listening socket is just another fd: "readable" = someone is waiting in the accept queue</li>
<li>Accept in a loop until <code class="i">EAGAIN</code> — 100 clients may arrive in one wake-up</li>
<li><code class="i">read() == 0</code> = the client closed; close the fd (that also removes it from epoll)</li>
</ul>
${box('This IS an event loop', 'Node\'s libuv and Java\'s NIO poller are this loop with timers, a thread pool and nicer APIs on top.', 'lam')}`, 'r64') },

  { t: 'Real run: 10,000 connections open at the same time', giua: true, body:
    term(`$ ./echo-epoll 7000 10000 & sleep 0.5
echo-epoll: listening on 127.0.0.1:7000 with ONE thread
$ ./khach 7000 10000 $(pgrep -x echo-epoll)
client: 10000 connections open at the same time, 10000/10000 echoes correct, 144 ms
server seen from /proc: Threads 1 | open fds 10005 | VmRSS 1220 kB | VmSize 2208 kB
$ wait
echo-epoll: served 10000 connections, at most 10000 open at once, 2851 epoll_wait() calls, still 1 thread`, { hl: [4, 5, 7] }) + two(
    `<ul style="font-size:22px">
<li>The client opens <b>all 10,000</b> TCP connections first, then sends one line on each, then checks every echo</li>
<li><b>open fds 10005</b> = 10,000 clients + listening socket + epoll fd + stdin/out/err</li>
<li><b>2,851</b> wake-ups handled 10,000 accepts, reads, echoes and closes: each <code class="i">epoll_wait</code> returned many ready fds</li>
</ul>`,
    box('Where is the memory?', 'VmRSS 1.2 MB is only the <b>process</b>. Socket buffers live in <b>kernel memory</b> — check <code class="i">/proc/net/sockstat</code> on a real server. Each fd also counts against <code class="i">ulimit -n</code> (CS.2).', 'lam')) },

  { t: 'Level-triggered vs edge-triggered', giua: true, body: `${ltEt()}
<ul style="font-size:22px">
<li><b>Level-triggered</b> (default): "there IS data" — safe, like <code class="i">poll</code>. Read a little, the next <code class="i">epoll_wait</code> reports the fd again</li>
<li><b>Edge-triggered</b> (<code class="i">EPOLLET</code>): "data CHANGED" — fewer wake-ups, but leftover bytes produce <b>no new event</b></li>
</ul>` },

  { t: 'The edge-triggered trap, reproduced', giua: true, body: two(
    c(`// 100 bytes wait; the handler reads only 10
ev.events = EPOLLIN | EPOLLET;
epoll_ctl(ep, EPOLL_CTL_ADD, sv[0], &ev);
for (;;) {
  int n = epoll_wait(ep, out, 4, 100);
  if (n == 0) break;          // timeout
  do {
    r = read(sv[0], buf, 10);
  } while (drain && r > 0);   // drain = 0: BUG
}`, { hl: [9] }) + box('Level-triggered, same reader', '10 wake-ups × 10 bytes = <b>100 of 100</b> read. Slower, but correct.', 'xanh'),
    out(`── edge-triggered (EPOLLET), read 10 per wake-up   <- BUG
   wake-up  1: read  10 bytes, total  10
   epoll_wait: timeout — 90 bytes still sitting in the socket
   (5 new bytes arrive)
   wake-up  2: read  10 bytes, total  20
   epoll_wait: timeout — 85 bytes still sitting in the socket
   => 2 wake-ups, 20 of 105 bytes read
── edge-triggered (EPOLLET), read until EAGAIN    <- correct
   wake-up  1: read 100 bytes (looped until EAGAIN), total 100
   epoll_wait: timeout — 0 bytes still sitting in the socket
   => 1 wake-up, 100 of 100 bytes read`, { hl: [3, 6, 11] }) +
    `<p style="margin:0;font-size:21px">In a server this is a <b>request that hangs forever</b>: the client sent the whole body, but the server sleeps until the client sends <b>more</b>.</p>`) },

  { t: 'Edge-triggered rules (man epoll(7))', giua: true, body: vsd(
    `<ul style="font-size:21px;gap:10px">
<li>Read <b>once</b> per event with <code class="i">EPOLLET</code> — leftover bytes wait forever</li>
<li><code class="i">EPOLLET</code> on a <b>blocking</b> socket — the "read until EAGAIN" loop never gets EAGAIN: the last <code class="i">read()</code> puts the only thread to sleep</li>
<li>Several threads in <code class="i">epoll_wait</code> on one fd — all wake up for one client (<b>thundering herd</b>)</li>
<li>Using ET "because it is faster" without measuring</li>
</ul>`,
    `<ul style="font-size:21px;gap:10px">
<li><b>Non-blocking</b> fds always, and read / write / accept <b>until EAGAIN</b></li>
<li>Or stay with <b>level-triggered</b> — libuv (Node) and Java NIO use it</li>
<li>Many threads, one fd: <code class="i">EPOLLONESHOT</code> (re-arm with MOD) or <code class="i">EPOLLEXCLUSIVE</code> (Linux 4.5+); or <code class="i">SO_REUSEPORT</code> — one listen socket per thread</li>
<li>Fairness: cap how much you read per fd per turn, so one busy client cannot starve the others</li>
</ul>`, '✗ Bugs', '✓ Rules') },

  { t: 'Measured: one epoll thread vs a thread per client', giua: true, body: two(
    compareBars(),
    `<table class="t" style="font-size:18px"><tr><th></th><th>epoll, 1 thread</th><th>1 thread / conn.</th></tr>
<tr><td><b>Threads</b></td><td>1</td><td>10,001</td></tr>
<tr><td><b>VmRSS</b> (user memory)</td><td>1,220 kB</td><td>124,088 kB</td></tr>
<tr><td><b>VmSize</b> (virtual)</td><td>2,208 kB</td><td>82,564,980 kB</td></tr>
<tr><td><b>10,000 connect + echo</b></td><td>154 ms</td><td>1,276 ms</td></tr>
</table>
<ul style="font-size:20px">
<li>Each thread reserves an <b>8 MB</b> stack (virtual) and touches ~12 kB of it</li>
<li>Same client, same machine, one real run (busy machine: compare the <b>ratios</b>)</li>
<li>Threads are not "wrong": for a few hundred connections simple blocking code is fine</li>
</ul>`, 'r46') },

  { t: 'Everybody stands on epoll', giua: true, body: `${whoUses()}
${out(`$ gcc -Wall -O0 -pthread tep-thuong.c -o tep-thuong && ./tep-thuong
epoll_ctl(ADD, a pipe                ) =  0 OK
epoll_ctl(ADD, a socket              ) =  0 OK
epoll_ctl(ADD, the file /etc/hostname) = -1 Operation not permitted
epoll_ctl(ADD, the directory /etc    ) = -1 Operation not permitted`, { hl: [4] })}
<p style="margin:0;font-size:20px">epoll works for <b>sockets and pipes, not regular files</b> (a disk file is "always ready") — that is why libuv sends <code class="i">fs</code> work to its thread pool (CS.3).</p>` },

  { t: 'strace -f node server.js: the loop is epoll', giua: true, body:
    zm(term(`$ strace -f -o tr.txt -e trace=epoll_create1,epoll_ctl,epoll_pwait,accept4,io_uring_setup node _srv.js & sleep 1.5
$ node _get.js                # 3 connections at once
$ grep "^$P " tr.txt | sed -E 's/^[0-9]+ +//' | grep -v ', 0, NULL, 8) = 0' | head -12     # main thread
epoll_create1(EPOLL_CLOEXEC)      = 13
io_uring_setup(256, {flags=0x10000 /* IORING_SETUP_??? */, sq_thread_cpu=0, sq_thread_idle=0}) = -1 EPERM (Operation not permitted)
epoll_ctl(13, EPOLL_CTL_ADD, 18, {events=EPOLLIN, data={u32=18, u64=18}}) = 0
epoll_pwait(13, [{events=EPOLLIN, data={u32=18, u64=18}}], 1024, 29996, NULL, 8) = 1
accept4(18, NULL, NULL, SOCK_CLOEXEC|SOCK_NONBLOCK) = 19
epoll_ctl(13, EPOLL_CTL_ADD, 19, {events=EPOLLIN, data={u32=19, u64=19}}) = 0
epoll_pwait(13, [{events=EPOLLIN, data={u32=18, u64=18}}, {events=EPOLLIN, data={u32=19, u64=19}}], 1024, 0, NULL, 8) = 2
accept4(18, NULL, NULL, SOCK_CLOEXEC|SOCK_NONBLOCK) = 20`, { hl: [6, 7, 8] }), 0.93) + two(
    `<ul style="font-size:20px">
<li>fd 18 = the listening socket, registered once; each <code class="i">accept4</code> gives a <b>non-blocking</b> client fd, added to the same epoll</li>
<li>Timeout <b>29996</b> ms: the loop sleeps until the next timer is due</li>
<li>libuv first tries <code class="i">io_uring</code>; Docker's default seccomp says <b>EPERM</b>, so it uses plain epoll</li>
</ul>`,
    box('Why epoll_pwait?', 'This container is <b>ARM64</b>: its syscall table (asm-generic/unistd.h) has <code class="i">epoll_pwait</code> = 22 but no <code class="i">epoll_wait</code>; glibc maps one to the other. On x86-64 (WSL) you may see <code class="i">epoll_wait</code>.', 'lam')) },

  { t: 'Java NIO: a Selector IS an epoll instance', giua: true, body: two(
    java(`Selector sel = Selector.open();      // epoll_create1
srv.configureBlocking(false);
srv.register(sel, SelectionKey.OP_ACCEPT); // epoll_ctl
while (echoed < 3) {
  sel.select();                      // epoll_pwait
  for (SelectionKey k : sel.selectedKeys()) {
    if (k.isAcceptable()) {
      srv.accept().configureBlocking(false)
         .register(sel, SelectionKey.OP_READ);
    } else if (k.isReadable()) { /* read + echo */ }
  }
  sel.selectedKeys().clear();
}`),
    out(`$ javac NioEcho.java && java NioEcho
SelectorProvider: sun.nio.ch.EPollSelectorProvider
Selector:         sun.nio.ch.EPollSelectorImpl
client got back: ping 1
client got back: ping 2
client got back: ping 3
thread: main, select() calls: 4`, { hl: [2, 3] }) + box('Same loop, other names', 'Tomcat\'s NIO connector (Spring Boot default) runs a <b>Poller</b> thread on a Selector; Netty\'s event loops too.', 'lam')) +
    term(`$ strace -f -o j.txt -e trace=epoll_create1,epoll_ctl,epoll_pwait java NioEcho > /dev/null
$ grep -v -e '+++' -e '---' j.txt | awk '{print $2}' | cut -d'(' -f1 | sort | uniq -c
      1 epoll_create1
      5 epoll_ctl
      4 epoll_pwait`) },

  { t: 'io_uring: completion, not readiness (Linux 5.1+)', giua: true, body: `${uringRings()}
<ul style="font-size:22px">
<li>epoll says "fd 7 <b>is ready</b> — now you call read()". io_uring says "<b>your read is done</b> — the bytes are in buf": model 5</li>
<li>Works for <b>files and sockets</b>, batches many requests into one system call</li>
</ul>` },

  { t: 'io_uring for real — and why Docker blocks it', giua: true, body: two(
    term(`# Docker DEFAULT seccomp profile
$ cat /proc/sys/kernel/io_uring_disabled
0
$ ./uring
io_uring_setup(4) = -1 Operation not permitted (errno 1)`, { hl: [5] }),
    `<ul style="font-size:19px;gap:5px">
<li>The kernel allows it (<code class="i">io_uring_disabled = 0</code>); Docker's default seccomp profile <b>blocks</b> the io_uring calls (Docker docs, moby#46762)</li>
<li>Why: attack surface. Google (2023): <b>60 %</b> of kernel exploits sent to its kCTF used io_uring ⇒ off on ChromeOS and Google servers</li>
</ul>`) +
    term(`# --security-opt seccomp=unconfined (lab only!)
$ ./uring
io_uring_setup(4) = fd 3: SQ 4 entries, CQ 8 entries
io_uring_enter(submit 1) = 1 — returned at once; threads in this process: 1
did other work meanwhile (50000000)
completion: user_data=42 res=6 -> "hello"`, { hl: [4, 6] }) +
    box('In practice', 'Submit returned at once, <b>1 thread</b>, the kernel did the read (unlike glibc AIO). Web apps: epoll runtimes. io_uring: databases / storage on hosts you control.', 'lam') },

  { t: 'Backpressure: a fast writer, a slow reader', giua: true, body: two(
    js(`for (let i = 1; i <= 256; i++) {          // 16 MiB
  const ok = sock.write(Buffer.alloc(SIZE, i));
  // false = "above highWaterMark, please wait"
  peak = Math.max(peak, sock.writableLength);
  if (!ok && respect) await once(sock, 'drain');
}`, { hl: [5] }),
    `<ul style="font-size:21px">
<li>The reader takes 64 KiB, then pauses 8 ms: a slow mobile client, a full disk, a slow DB</li>
<li><code class="i">write()</code> never blocks in Node: it <b>queues</b> the bytes in memory and returns <b>false</b> past <code class="i">highWaterMark</code> (64 KiB in Node 22)</li>
</ul>`) +
    out(`$ node backpressure.js
highWaterMark = 65536 bytes; sending 256 x 64 KiB = 16.00 MB to a slow reader
ignore false : write() first returned false at chunk 41 | peak writableLength 13.50 MB | done in 3465 ms
respect drain: write() first returned false at chunk 41 | peak writableLength  0.06 MB | done in 2747 ms`, { hl: [3, 4] }) +
    box('Not faster — just 225× more memory', 'The <b>reader</b> sets the speed (both ~3 s; ignoring <code class="i">false</code> was even slower here). It only moved 13.5 MB into RAM — × 1,000 slow clients = 13.5 GB ⇒ OOM. <code class="i">stream.pipeline()</code> waits for <code class="i">drain</code> for you.', 'bad') },

  { t: '🧭 On a real server', giua: true, body: cards([
    ['“Too many open files” at ~1,000 users', 'Each connection = 1 fd. A soft limit of <b>1024</b> (common for login shells) is hit long before CPU. Raise <code class="i">LimitNOFILE</code> / <code class="i">ulimit -n</code>; our container had 1,048,576 (CS.2).'],
    ['One slow handler, every client waits', 'An epoll loop has one thread. 50 ms of CPU or a sync call in a callback = 50 ms added to <b>all</b> 10,000 connections (CS.3: blocking the event loop).'],
    ['Export / download eats the RAM', 'Writing a big report to a slow mobile client and ignoring <code class="i">write() === false</code> keeps the whole file in memory per client. Use <code class="i">pipeline()</code> or wait for <code class="i">drain</code>.'],
    ['“Works on my laptop, not in Docker”', 'An io_uring-based library fails with <b>EPERM</b> under the default seccomp profile. Check the fallback before you blame the code.'],
  ], 2) + box('On this site\'s own VPS', 'A memory bug does not end with an error message: on 2026-07-06 two image builds ran at once on the 6 GB VPS and the kernel <b>OOM-killed</b> <code class="i">next build</code> — <b>exit 137</b>. An ignored <code class="i">write() === false</code> ends the same way. Fix there: build one at a time. Details in CS.5.', 'bad') },

  { t: '🎤 Interview questions you will hear', giua: true, body: cards([
    ['Blocking vs non-blocking vs async?', 'Non-blocking: phase 1 returns EAGAIN. Async: the kernel also does the copy and reports completion (io_uring). Models 1–4 are synchronous.'],
    ['select vs poll vs epoll?', 'select: 1024-bit set, rebuilt each call. poll: no limit, O(n) scan. epoll: register once, O(ready) per wait.'],
    ['Level vs edge-triggered?', 'LT reports while data remains; ET only on change ⇒ non-blocking fds, read until EAGAIN.'],
    ['How does Node serve 10k connections with one thread?', 'libuv runs an epoll loop over non-blocking sockets; files, DNS and crypto use the thread pool of 4.'],
    ['What is C10K, and is it still a problem?', '10,000 concurrent clients per server (Kegel, 1999). Solved by event loops on epoll/kqueue; the limits today are fds, memory and CPU per request.'],
    ['What is backpressure?', 'A slow consumer must slow the producer: write() returns false ⇒ wait for drain; otherwise memory grows until OOM.'],
  ], 2) },

  { t: 'Self-check', giua: true, to: true, body: `
<ol style="font-size:24px">
<li>A server uses <code class="i">select()</code>. It works in testing, then crashes in production after an hour of traffic. What is the most likely reason?</li>
<li>With <code class="i">EPOLLET</code>, a handler reads 4 KB per event from a request of 10 KB. What does the client see?</li>
<li>A Node export writes 200 MB to a slow client and ignores the return value of <code class="i">write()</code>. Is it slower? What goes wrong?</li>
</ol>
${box('Answers', '<b>1.</b> An fd number reached 1024: <code class="i">FD_SET</code> writes outside the 1024-bit bitmap (crash or stack corruption) — use poll/epoll. <b>2.</b> It can hang: 6 KB stay in the socket and no new edge comes until the client sends more ⇒ read until EAGAIN. <b>3.</b> Not slower (the client sets the speed), but up to 200 MB per client sits in RAM ⇒ OOM; wait for <code class="i">drain</code> or use <code class="i">pipeline()</code>.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, body: `
<ul>
<li>Every read = <b>wait</b> + <b>copy</b>. Blocking/non-blocking is about the wait; sync/async about who copies</li>
<li><code class="i">select</code>: 1024 fds max; <code class="i">poll</code>: O(n) per call; <b>epoll</b>: register once, get only ready fds</li>
<li>One thread + epoll served <b>10,000</b> connections: 1.2 MB, 154 ms vs 10,001 threads, 124 MB, 1.3 s</li>
<li>Edge-triggered ⇒ non-blocking + read until <code class="i">EAGAIN</code>; level-triggered is the safe default</li>
<li>io_uring = real async I/O, often blocked in containers; <b>backpressure</b>: when <code class="i">write()</code> says <code class="i">false</code>, wait for <code class="i">drain</code></li>
</ul>
${box('Next: CS.5 — Memory on a real server', 'RSS vs VSZ (you just saw 79 GiB of virtual memory for 10,000 threads), page cache, overcommit and the OOM killer that ends a backpressure bug.', 'lam')}` },
]);
