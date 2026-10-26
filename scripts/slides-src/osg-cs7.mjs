/**
 * osg-cs7 — OSG202 · ⭐ Advanced 7 "Performance and debugging toolkit" (deck tự dựng, slide EN, khuôn _pg-chung.mjs, 26/10/2026).
 * Đề cương: REPO/OSG202/CHUYEN-SAU.md mục 7. MỌI output = CHẠY THẬT trong runner osg202-lab (Debian 12 aarch64, procps-ng 4.0.2,
 *   sysstat 12.6.1, strace 6.1, iproute2, Temurin 21.0.12.1, Node v22.23.4; Docker Desktop, VM Linux 7.0.12-linuxkit, 10 vCPU) —
 *   nguồn REPO/OSG202/gen/code/cs7/*.out.txt. Máy ảo dùng CHUNG với các container khác ⇒ /proc/loadavg, vmstat, mpstat, top header là
 *   của CẢ máy ảo (có tải của container khác — nói thẳng trên slide). Số thời gian = MỘT lần chạy ⇒ đọc TỈ LỆ.
 * Không có trong image (nói thẳng): perf (gói linux-perf), ltrace (Debian không có bản arm64), htop, PostgreSQL. Thay: perf_event_open
 *   tự gọi (mini perf stat), LD_PRELOAD đếm malloc, top -b, ghi + fdatasync mô phỏng WAL.
 * Nguồn: Brendan Gregg "Linux Load Averages: Solving the Mystery" (2017; bản vá 0.99.14 của Matthias Urlichs, 1993), "The USE Method"
 *   (2012) + "USE Method: Linux Performance Checklist", "Linux Performance Analysis in 60,000 Milliseconds" (Netflix TechBlog 11/2015),
 *   flame graph (Gregg 2011); man7 proc(5), top(1), vmstat(8), iostat(1), pidstat(1), ss(8), strace(1), perf_event_open(2);
 *   include/linux/sched/loadavg.h (EXP_1 1884, FSHIFT 11); PostgreSQL docs "WAL Configuration" (commit_delay, synchronous_commit).
 */
import { lamDeck, sql, psql, sh, two as two0, box, cards, vsd } from './_pg-chung.mjs';

export const deck = { key: 'cs7', code: 'CS.7', title: 'Performance and debugging toolkit', sub: 'OSG202 · ⭐ Advanced' };

const out = (t, o = {}) => psql(t, { title: 'output', sm: true, ...o });
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const c = (s, o = {}) => sql(s, { lang: 'c', sm: true, ...o });
const js = (s, o = {}) => sql(s, { lang: 'javascript', sm: true, ...o });
const zm = (h, z) => `<div style="zoom:${z}">${h}</div>`;
/* two() của khuôn đặt a, b thẳng vào lưới 2 cột ⇒ a/b nhiều phần tử là vỡ lưới. Bọc mỗi cột một div (min-width:0). */
const col = (h) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const AR = (id, cl) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${cl}"/></marker>`;
/* rộng chữ ước lượng: 0,602 × cỡ chữ × số ký tự (đặt nhãn bằng công thức) */
const tw = (s, fs) => Math.ceil(String(s).length * 0.602 * fs);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.it ? ' font-style="italic"' : ''}${o.mono ? ' font-family="Menlo,Consolas,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="6 4"' : ''}/>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', GY = '#8a8a8a';

/* ── Hình 1: bếp nhà hàng = USE ── */
const kitchen = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial"><defs>${AR('ka', BR)}</defs>`;
  // hàng đợi phiếu
  s += R(6, 40, 300, 220, '#fff7ef', OR, { rx: 12 });
  s += T(156, 70, '🧾 order tickets waiting', 18, { a: 'middle', w: 800, f: BR });
  for (let i = 0; i < 7; i++) s += R(24 + i * 38, 96, 30, 70, '#fff', OR, { rx: 4, sw: 1.5 }) + T(39 + i * 38, 138, `#${i + 1}`, 12, { a: 'middle', f: BR });
  s += T(156, 200, 'the queue grows =', 17, { a: 'middle', f: '#333' }) + T(156, 226, 'SATURATION', 20, { a: 'middle', w: 800, f: OR });
  s += `<line x1="310" y1="150" x2="356" y2="150" stroke="${BR}" stroke-width="3" marker-end="url(#ka)"/>`;
  // bếp
  s += R(362, 40, 380, 220, '#eef4fa', BL, { rx: 12 });
  s += T(552, 70, '🔥 4 burners (= 4 CPUs)', 18, { a: 'middle', w: 800, f: BL });
  for (let i = 0; i < 4; i++) s += R(384 + i * 88, 92, 76, 76, i < 4 ? '#ffd9b0' : '#fff', OR, { rx: 38, sw: 2 }) + T(422 + i * 88, 138, '🍳', 28, { a: 'middle' });
  s += T(552, 200, 'all 4 busy all the time =', 17, { a: 'middle', f: '#333' }) + T(552, 226, '100 % UTILIZATION', 20, { a: 'middle', w: 800, f: BL });
  s += `<line x1="746" y1="150" x2="792" y2="150" stroke="${BR}" stroke-width="3" marker-end="url(#ka)"/>`;
  // lỗi
  s += R(798, 40, 306, 220, '#fdf0ee', RD, { rx: 12 });
  s += T(951, 70, '🗑️ sent back', 18, { a: 'middle', w: 800, f: RD });
  s += T(951, 112, 'burnt dish, wrong order,', 16, { a: 'middle', f: '#333' }) + T(951, 136, 'dropped plate', 16, { a: 'middle', f: '#333' });
  s += T(951, 200, 'count them =', 17, { a: 'middle', f: '#333' }) + T(951, 226, 'ERRORS', 20, { a: 'middle', w: 800, f: RD });
  s += T(555, 290, '"The kitchen is slow" is a symptom. The manager checks EACH station for these three things before buying a new stove.', 15, { a: 'middle', f: GY, it: true });
  return s + `</svg>`;
};

/* ── Hình 2: load average đếm gì ── */
const loadWhat = () => {
  let s = `<svg viewBox="0 0 1110 280" width="1110" height="280" font-family="Arial"><defs>${AR('la', GR)}</defs>`;
  s += R(6, 10, 330, 260, '#eef4fa', BL, { rx: 12 });
  s += T(171, 38, 'R — running on a CPU', 17, { a: 'middle', w: 800, f: BL });
  for (let i = 0; i < 4; i++) s += R(26 + i * 76, 54, 66, 54, '#dbe8f5', BL, { rx: 6 }) + T(59 + i * 76, 87, `CPU${i}`, 14, { a: 'middle', w: 700, f: BL });
  s += T(171, 140, 'R — runnable, waiting', 17, { a: 'middle', w: 800, f: BL }) + T(171, 162, 'in the run queue', 15, { a: 'middle', f: '#555' });
  for (let i = 0; i < 5; i++) s += `<circle cx="${56 + i * 58}" cy="${206}" r="20" fill="#fff" stroke="${BL}" stroke-width="2"/>` + T(56 + i * 58, 212, 'R', 15, { a: 'middle', w: 800, f: BL });
  s += T(171, 256, '= CPU demand', 15, { a: 'middle', f: BL, w: 700 });
  s += R(352, 10, 330, 260, '#fff7ef', OR, { rx: 12 });
  s += T(517, 38, 'D — uninterruptible sleep', 17, { a: 'middle', w: 800, f: BR });
  const why = ['disk I/O (fsync, read)', 'some kernel locks', 'NFS / network filesystem', 'vfork() parent (our demo)'];
  why.forEach((w, i) => s += `<circle cx="${386}" cy="${74 + i * 40}" r="15" fill="#fff" stroke="${OR}" stroke-width="2"/>` + T(386, 79 + i * 40, 'D', 13, { a: 'middle', w: 800, f: BR }) + T(410, 79 + i * 40, w, 15, { f: '#333' }));
  s += T(517, 256, 'uses NO CPU — still counted', 15, { a: 'middle', f: BR, w: 700 });
  s += `<line x1="686" y1="140" x2="730" y2="140" stroke="${GR}" stroke-width="3" marker-end="url(#la)"/>`;
  s += R(736, 10, 368, 260, '#f1f9f4', GR, { rx: 12 });
  s += T(920, 40, 'every ~5 s the kernel counts', 16, { a: 'middle', f: '#333' });
  s += T(920, 68, 'active = R + D', 22, { a: 'middle', w: 800, f: GR });
  s += T(920, 104, 'and folds it into 3 averages:', 16, { a: 'middle', f: '#333' });
  s += T(920, 140, 'load = load·e + active·(1−e)', 18, { a: 'middle', w: 700, f: '#245077', mono: true });
  s += T(920, 176, 'e = exp(−5 s / 1, 5, 15 min)', 16, { a: 'middle', f: '#555', mono: true });
  s += T(920, 214, '"exponentially damped",', 15, { a: 'middle', f: '#555', it: true });
  s += T(920, 238, 'not a plain average', 15, { a: 'middle', f: '#555', it: true });
  return s + `</svg>`;
};

/* ── Hình 3: đường load1 — số đo thật vs công thức (sim/cs7/tai.mjs#12-9.18) ── */
const loadCurve = () => {
  const EXP = 1884, F = 2048;
  let l = Math.round(9.18 * F); const pts = [[0, 9.18]];
  for (let t = 5; t <= 60; t += 5) { const a = 12 * F; let n = l * EXP + a * (F - EXP); if (a >= l) n += F - 1; l = Math.floor(n / F); pts.push([t, l / F]); }
  const x0 = 40, y0 = 214, sx = 5.6, sy = 12.5;   // nhãn dài nhất "measured 13.62" 14 × 0,602 × 16 ≈ 135 px
  let s = `<svg viewBox="0 0 400 250" style="width:100%;height:auto;max-height:250px" font-family="Arial">`;
  for (let v = 0; v <= 16; v += 4) s += `<line x1="${x0}" y1="${y0 - v * sy}" x2="${x0 + 60 * sx}" y2="${y0 - v * sy}" stroke="#e6e6e6"/>` + T(x0 - 8, y0 - v * sy + 5, v, 15, { a: 'end', f: GY });
  for (let t = 0; t <= 60; t += 15) s += T(x0 + t * sx, y0 + 22, `${t}s`, 15, { a: 'middle', f: GY });
  s += `<line x1="${x0}" y1="${y0 - 12 * sy}" x2="${x0 + 60 * sx}" y2="${y0 - 12 * sy}" stroke="${BL}" stroke-dasharray="5 4"/>` + T(x0 + 90, y0 - 12 * sy - 8, 'our 12 tasks', 15, { a: 'middle', f: BL });
  s += `<polyline points="${pts.map(([t, v]) => `${x0 + t * sx},${(y0 - v * sy).toFixed(1)}`).join(' ')}" fill="none" stroke="${GR}" stroke-width="3"/>`;
  s += `<circle cx="${x0}" cy="${y0 - 9.18 * sy}" r="6" fill="${OR}"/>` + T(x0 + 10, y0 - 9.18 * sy + 22, '9.18 before', 16, { f: BR, w: 700 });
  s += `<circle cx="${x0 + 60 * sx}" cy="${y0 - 13.62 * sy}" r="7" fill="${RD}"/>` + T(x0 + 60 * sx - 12, y0 - 13.62 * sy - 8, 'measured 13.62', 16, { a: 'end', f: RD, w: 700 });
  s += `<circle cx="${x0 + 60 * sx}" cy="${y0 - 10.97 * sy}" r="6" fill="${GR}"/>` + T(x0 + 60 * sx - 12, y0 - 10.97 * sy + 24, 'formula 10.97', 16, { a: 'end', f: GR, w: 700 });
  s += T(200, 248, 'load1 during the 60 s of the run', 14, { a: 'middle', f: GY, it: true });
  return s + `</svg>`;
};

/* ── Hình 4: flame graph — CÙNG dữ liệu mẫu và thuật toán với sim/cs7/flame.mjs#mau ── */
const flame = () => {
  const data = [
    ['node;uv_run;epoll_pwait (idle)', 188], ['node;uv_run;http parser;handle;loadOrders;JSON.parse', 520],
    ['node;uv_run;http parser;handle;loadOrders;readFileSync;read()', 58], ['node;uv_run;http parser;handle;loadOrders;readFileSync;toString', 47],
    ['node;uv_run;http parser;handle;total;Array.reduce', 21], ['node;uv_run;http parser;handle;res.end;writev()', 14],
    ['node;uv_run;http parser;parse headers', 11], ['node;(garbage collector)', 31],
  ];
  const root = { n: 'all', v: 0, k: new Map() };
  for (const [st, v] of data) { root.v += v; let p = root; for (const n of st.split(';')) { if (!p.k.has(n)) p.k.set(n, { n, v: 0, k: new Map() }); p = p.k.get(n); p.v += v; } }
  const fr = []; const walk = (p, d, x) => { fr.push({ n: p.n, d, x, w: p.v / root.v }); let xx = x; for (const q of [...p.k.values()].sort((a, b) => (a.n < b.n ? -1 : 1))) { walk(q, d + 1, xx); xx += q.v / root.v; } }; walk(root, 0, 0);
  const D = Math.max(...fr.map((f) => f.d)), H0 = 34, W = 1100, top = 6;
  const COL = ['#FDE68A', '#FDBA74', '#FCA5A5', '#FCD34D', '#FB923C', '#F87171'];
  let s = `<svg viewBox="0 0 1110 ${top + (D + 1) * H0 + 4}" width="1110" height="${top + (D + 1) * H0 + 4}" font-family="Arial">`;
  for (const f of fr) {
    const y = top + (D - f.d) * H0, x = 5 + f.x * W, w = f.w * W;
    s += `<rect x="${x.toFixed(1)}" y="${y}" width="${Math.max(0.5, w - 1.5).toFixed(1)}" height="${H0 - 3}" rx="2" fill="${f.d === 0 ? '#e5e7eb' : COL[(f.n.length + f.d) % COL.length]}" stroke="#fff"/>`;
    const lab = `${f.n} ${(100 * f.w).toFixed(1)}%`;
    const fs = tw(lab, 16) <= w - 8 ? 16 : tw(f.n, 13) <= w - 8 ? 13 : 0;
    if (fs) s += T((x + 5).toFixed(1), y + 22, fs === 16 ? lab : f.n, fs, { f: '#222', w: f.n === 'JSON.parse' ? 800 : 400 });
  }
  return s + `</svg>`;
};

/* ── Hình 5: Node trước / sau — số đo thật ca-node.out.txt ── */
const nodeBars = () => {
  const rows = [['/report done in 3 s', 65, 52583, ''], ['/health p99', 1896.6, 4.5, ' ms'], ['/health probes answered', 3, 147, '']];
  let s = `<svg viewBox="0 0 420 288" style="width:100%;height:auto;max-height:262px" font-family="Arial">`;
  rows.forEach(([k, a, b, u], i) => {
    const y = 4 + i * 94, mx = Math.max(a, b), w = (v) => Math.max(4, Math.log10(v + 1) / Math.log10(mx + 1) * 220);
    s += T(6, y + 18, k, 16, { w: 800 });
    s += R(6, y + 28, w(a), 26, '#fdd8d3', RD, { rx: 4, sw: 1.5 }) + T(14 + w(a), y + 47, `before ${a.toLocaleString('en')}${u}`, 15, { f: RD, w: 700 });
    s += R(6, y + 60, w(b), 26, '#d6f0df', GR, { rx: 4, sw: 1.5 }) + T(14 + w(b), y + 79, `after ${b.toLocaleString('en')}${u}`, 15, { f: GR, w: 700 });
  });
  return s + `</svg>`;
};

/* ── Hình 6: commit từng dòng vs theo nhóm — số đo thật ca-dia.out.txt ── */
const commitBars = () => {
  const m = [['1 row per fdatasync', 618, RD, '#fdd8d3'], ['64 rows per fdatasync', 31573, GR, '#d6f0df']];
  let s = `<svg viewBox="0 0 470 200" style="width:100%;height:auto" font-family="Arial">`;
  m.forEach(([k, v, st, f], i) => {
    const y = 8 + i * 92, w = Math.max(6, v / 31573 * 300);
    s += T(6, y + 20, k, 17, { w: 800 }) + R(6, y + 32, w, 34, f, st, { rx: 4, sw: 1.5 }) + T(16 + w, y + 56, `${v.toLocaleString('en')} rows/s`, 16, { f: st, w: 800 });
  });
  s += T(235, 196, 'per writer, 4 writers at once; fdatasync calls/s ≈ 620 vs ≈ 490', 13, { a: 'middle', f: GY, it: true });
  return s + `</svg>`;
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'academy/osg202', bieuTuong: '🐧', khau: 'from zero to real backend work',
  chuong: '⭐ Advanced 7 — Performance and debugging toolkit', bai: 'CS.7',
}, [
  { cover: true, t: 'Performance and<br>debugging toolkit', sub: 'Load average, top, vmstat, pidstat, iostat, ss, strace, perf, flame graphs, the USE method and three real diagnoses — all run on real Linux.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Read <b>load average</b>, <b>top</b> and <b>vmstat</b> correctly — and know what they do <b>not</b> say</li>
<li>Find the guilty <b>process</b> (pidstat), <b>socket</b> (ss) and <b>system call</b> (strace)</li>
<li>Count events with <b>perf</b> — and what to do when Docker says no</li>
<li>Read a <b>flame graph</b>; follow the <b>USE method</b> and the <b>60-second checklist</b></li>
<li>Diagnose three real cases: slow Node API, Java GC, a database waiting for the disk</li>
</ul>
${box('Builds on — not repeated here', 'Process states and signals (<b>CS.1</b>), fds (<b>CS.2</b>), the event loop (<b>CS.3</b>), epoll and <code class="i">strace -c</code> (<b>CS.4</b>), RSS/VSZ and OOM (<b>CS.5</b>), cgroups and seccomp (<b>CS.6</b>). This deck is the <b>toolbox</b> that uses all of them.', 'lam')}` },

  { t: 'Start in a kitchen: three questions per station', giua: true, body: `${kitchen()}
<p style="margin:0;font-size:23px">A server is the same: for <b>every resource</b> — CPU, memory, disk, network — ask how <b>busy</b> it is, how long the <b>queue</b> is, and how many <b>errors</b> it makes. Every tool in this deck answers one of those three.</p>` },

  { t: 'Six words we need', to: true, giua: true, body: cards([
    ['⏱️ Latency', 'Time for <b>one</b> request (ms). Users feel the slow ones: look at <b>p99</b>, not the average.'],
    ['📦 Throughput', 'Requests <b>per second</b>. High throughput can hide terrible latency.'],
    ['🔥 Utilization', 'How much of the time a resource was <b>busy</b> (CPU 100 %, disk %util).'],
    ['🧾 Saturation', 'Extra work that must <b>wait</b>: run queue, disk queue, accept queue.'],
    ['🗑️ Errors', 'Failed operations: EMFILE, retransmits, OOM kills, I/O errors.'],
    ['🔎 Tracing vs sampling', '<b>Tracing</b> records every event (strace). <b>Sampling</b> looks every few ms (perf, --cpu-prof).'],
  ], 3) },

  { t: 'Load average: what is actually counted', giua: true, body: `${loadWhat()}
<ul style="font-size:22px">
<li>Linux counts <b>R + D</b> since 1993 (patch by Matthias Urlichs) — a "<b>system</b> load average", not a CPU one (B. Gregg, 2017)</li>
<li>Three numbers = the last <b>1, 5, 15 minutes</b>, damped — load1 needs minutes to catch up</li>
</ul>` },

  { t: 'Real run: load 13.6 on 10 CPUs — but CPUs half idle', giua: true, body: two(
    zm(term(`$ nproc; cat /proc/loadavg
10
9.18 7.96 5.30 4/736 22
$ for i in 1 2 3 4; do ./ban cpu 80 > /dev/null & done
$ ./treo 8 80 & sleep 1
treo: 8 tasks now in state D for 80 s
$ ps -eo stat= | cut -c1 | sort | uniq -c
      8 D
      5 R
     14 S
$ sleep 60; cat /proc/loadavg
13.62 9.54 6.02 7/735 68`, { hl: [3, 11, 13] }), 0.92) +
    `<ul style="font-size:20px">
<li>Fields: load1 load5 load15 · <b>running/total</b> tasks · last PID</li>
<li>4 busy loops (<b>R</b>) + 8 tasks stuck in <b>D</b> that use <b>no CPU</b></li>
</ul>`,
    loadCurve() + box('Read it right', 'The kernel formula predicts <b>10.97</b> from our 12 tasks. The extra ~2.7 comes from <b>other containers</b>: in Docker, <code class="i">/proc/loadavg</code> is the whole VM.', 'lam'), 'r46') },

  { t: 'top, column by column', giua: true, body: zm(out(`top - 11:24:28 up 1 day, 10:03,  0 user,  load average: 14.14, 9.72, 6.10
Tasks:  26 total,   5 running,  21 sleeping,   0 stopped,   0 zombie
%Cpu(s): 49.7 us,  2.6 sy,  0.0 ni, 47.2 id,  0.0 wa,  0.0 hi,  0.4 si,  0.0 st
MiB Mem :   7934.1 total,   2809.2 free,   3385.5 used,   2140.2 buff/cache

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
     25 root      20   0    3096   1016    932 R 100.0   0.0   1:02.97 ban
     33 root      20   0    2072    404    324 D   0.0   0.0   0:00.00 treo
     51 root      20   0  908820 335612  36016 S   0.0   4.1   0:00.02 node`, { hl: [3, 7, 8, 9], title: 'top -b -n2 -d1 (frame 2, rows picked from the real run)' }), 0.98) + two(
    `<table class="t" style="font-size:17px"><tr><th style="width:78px">%Cpu</th><th>time the CPUs spent…</th></tr>
<tr><td><b>us</b> / <b>sy</b></td><td>running your code / the kernel for you (syscalls)</td></tr>
<tr><td><b>id</b> / <b>wa</b></td><td>idle / idle <b>while I/O was pending</b></td></tr>
<tr><td><b>hi</b> / <b>si</b></td><td>hardware / software interrupts (network)</td></tr>
<tr><td><b>st</b></td><td><b>stolen</b> by the hypervisor (cloud VM)</td></tr>
</table>`,
    `<table class="t" style="font-size:17px"><tr><th style="width:64px">col.</th><th>meaning (KiB)</th></tr>
<tr><td><b>VIRT</b></td><td>all mapped virtual memory (908,820 for node)</td></tr>
<tr><td><b>RES</b></td><td>really in RAM (335,612 ≈ the 300 MB buffer)</td></tr>
<tr><td><b>SHR</b></td><td>part of RES that can be shared (libraries)</td></tr>
<tr><td><b>S</b></td><td>state R / S / D / Z (CS.1)</td></tr>
</table>`) },

  { t: 'vmstat 1: three ways to keep a CPU busy', giua: true, body: two(
    out(`procs ---memory--- ---io--- -system- ------cpu-----
 r  b  ...  bi    bo    in    cs  us sy id wa st
── 4 × arithmetic loop ──────────────────────────
 5  0  ...   0     0  4961   892  40  0 60  0  0
── 4 × read 1 MiB from /dev/zero ────────────────
 5  0  ...   0   112  4846   817   0 40 60  0  0
── 4 × write 4 KiB + fsync ──────────────────────
 1  1  ...   0 61912 25512 36862   0  5 82 12  0
 1  3  ...   0 59936 24513 33636   0  4 82 13  0`, { hl: [4, 6, 8, 9], title: 'vmstat 1 — one line per second (columns trimmed)' }),
    `<ul style="font-size:21px;gap:8px">
<li><b>us 40</b>: 4 of 10 CPUs in your code</li>
<li><b>sy 40</b>: same 4 CPUs, but inside the <b>kernel</b> copying memory</li>
<li><b>wa 12–13</b>, <b>b</b> 1–3, <b>bo</b> 60 MB/s: the CPUs wait for the <b>disk</b>; <b>cs</b> jumps to 36,000 switches/s</li>
<li><b>r</b> = running + runnable; <b>r &gt; CPU count</b> = CPU saturation</li>
</ul>
${box('Skip line 1', 'The first line of vmstat is the average <b>since boot</b>. Read from line 2.', 'lam')}`, 'r64') },

  { t: 'pidstat: which process, on which resource', giua: true, body: two(
    out(`$ pidstat -u -d -w -C ban 2 1
  PID    %usr %system  %wait    %CPU  Command
   16  100.00    0.00   0.00  100.00  ban   ← cpu
   17    0.00  100.00   0.00  100.00  ban   ← sys
   18    0.00    4.50   0.50    4.50  ban   ← io
  PID   kB_rd/s   kB_wr/s   iodelay  Command
   18      0.00   5338.00         0  ban
  PID   cswch/s nvcswch/s  Command
   16      0.00      2.50  ban
   17      0.00      3.50  ban
   18   2669.00      0.00  ban`, { hl: [3, 4, 7, 11], title: 'output (time and UID columns trimmed)' }),
    `<ul style="font-size:21px;gap:8px">
<li><code class="i">-u</code> CPU split into user / system, per process</li>
<li><code class="i">-d</code> disk: who writes <b>5.3 MB/s</b></li>
<li><code class="i">-w</code> <b>cswch/s</b> = voluntary switches (the process went to sleep: I/O, lock). <b>nvcswch/s</b> = the scheduler took the CPU away</li>
<li><code class="i">-t</code> adds every <b>thread</b> (used in case 1)</li>
</ul>
${box('Pattern', 'High %CPU + few switches = <b>CPU-bound</b>. Low %CPU + thousands of voluntary switches = <b>waiting</b> on something.', 'xanh')}`, 'r64') },

  { t: 'ss -tanp: every TCP socket and its queues', giua: true, body: zm(out(`State      Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
SYN-SENT   0      1          127.0.0.1:37024    127.0.0.1:8001  users:(("node",pid=20))
ESTAB      0      0          127.0.0.1:8001     127.0.0.1:37012
LISTEN     3      2          127.0.0.1:8001       0.0.0.0:*     users:(("ss-may",pid=16))
CLOSE-WAIT 1      0          127.0.0.1:8002     127.0.0.1:46258 users:(("ss-may",pid=16))
FIN-WAIT-2 0      0          127.0.0.1:46258    127.0.0.1:8002  users:(("node",pid=20))
ESTAB      3000   0          127.0.0.1:8002     127.0.0.1:46244 users:(("ss-may",pid=16))`, { hl: [4, 5, 7], title: 'ss -tanp (rows picked from the real run)' }), 0.96) + two(
    `<table class="t" style="font-size:17px"><tr><th style="width:150px">You see</th><th>It means</th></tr>
<tr><td><b>LISTEN</b> Recv-Q 3 / Send-Q 2</td><td>accept queue holds 3, backlog 2: the app <b>does not call accept()</b> — new clients stay in <b>SYN-SENT</b></td></tr>
<tr><td><b>CLOSE-WAIT</b></td><td>client hung up, <b>your app never closed</b> the fd — a leak (CS.2)</td></tr>
<tr><td><b>ESTAB</b> Recv-Q 3000</td><td>3,000 bytes arrived, the app is <b>not reading</b></td></tr>
</table>`,
    `${box('First thing on a busy server', '<code class="i">ss -tan | awk \'NR&gt;1{print $1}\' | sort | uniq -c</code> — thousands of CLOSE-WAIT = a bug in your code; thousands of TIME-WAIT on the side that closes first = normal for short connections.', 'lam')}`, 'r64') },

  { t: 'strace -c: count the system calls of a slow program', giua: true, body: two(
    c(`// copy a file, n bytes per call
while ((r = read(in, buf, n)) > 0)
    write(out, buf, r);`) +
    out(`$ time ./sao-chep 1 /tmp/in.bin /tmp/out.bin
real	0m0.225s
user	0m0.050s
sys	0m0.175s
$ time ./sao-chep 65536 /tmp/in.bin /tmp/out.bin
real	0m0.002s`, { hl: [4, 6] }),
    out(`$ strace -c ./sao-chep 1 /tmp/in.bin /tmp/out.bin
% time     seconds  usecs/call     calls  syscall
 53.11    1.917933           6    300000  write
 46.89    1.693629           5    300002  read
$ strace -c ./sao-chep 65536 /tmp/in.bin /tmp/out.bin
 30.62    0.000154          30         5  write
 25.84    0.000130          18         7  read
$ time strace -o /dev/null ./sao-chep 1 /tmp/in.bin /tmp/out.bin
real	0m27.755s`, { hl: [3, 4, 9], title: 'output (commands shortened, read and write rows)' }) +
    box('Two lessons', '300 KB, 1 byte per call = <b>600,000 syscalls</b>, mostly <b>sys</b> time: fix = buffer (×112 faster). And strace is <b>expensive</b>: 0.23 s became <b>28 s</b> (×120). Never leave it on a production process.', 'bad'), 'r46') },

  { t: 'strace -p: what is the stuck process waiting for?', giua: true, body: two(
    zm(term(`$ ps -o pid,stat,%cpu,wchan:20,cmd -p $P
    PID STAT %CPU WCHAN                CMD
     26 S     0.0 wait_woken           ./hoi
$ timeout 2 strace -p $P
strace: Process 26 attached
read(3, strace: Process 26 detached
 <detached ...>
$ ls -l /proc/$P/fd/3 | sed 's/.*-> //'
socket:[8355967]
$ ss -tnp | grep hoi
ESTAB 0  0  127.0.0.1:56434  127.0.0.1:5432  users:(("hoi",pid=26,fd=3))`, { hl: [3, 6, 11] }), 0.9) +
    c(`// hoi.c, simplified — no timeout anywhere
connect(s, &db_5432, sizeof db_5432);
write(s, "SELECT * FROM orders;\\n", 22);
ssize_t r = read(s, buf, sizeof buf);  // waits forever`, { hl: [4] }),
    `<ol style="font-size:21px;gap:8px">
<li><b>S</b>, 0 % CPU, sleeping in the kernel (<code class="i">wchan</code>): not a loop, it <b>waits</b></li>
<li><code class="i">strace -p</code> attaches: it sits in <b><code class="i">read(3,</code></b> and never returns</li>
<li>fd 3 is a <b>socket</b> → <code class="i">ss</code>: the peer is <b>:5432</b> (PostgreSQL's port) that never answers</li>
</ol>
${box('The real fix', 'Every network call needs a <b>timeout</b>: <code class="i">statement_timeout</code>, socket/HTTP client timeouts, pool acquire timeouts. A call without one can wait forever.', 'xanh')}
${box('Permission', 'Same user, no Yama here. On Ubuntu (<code class="i">ptrace_scope = 1</code>) attaching needs <b>sudo</b>.', 'lam')}`, 'r64') },

  { t: 'ltrace — and the same idea with LD_PRELOAD', giua: true, body: two(
    term(`$ ltrace -c ls
bash: ltrace: command not found
$ uname -m
aarch64`, { hl: [2] }) +
    c(`// dem-malloc.so, loaded BEFORE libc
void *malloc(size_t n) {
    n_malloc++;  bytes += n;
    return __libc_malloc(n);   // the real one
}`),
    out(`$ LD_PRELOAD=./dem-malloc.so ls /usr/bin > /dev/null
[dem-malloc] malloc 763 (52 KB) calloc 0 realloc 6 free 70
$ LD_PRELOAD=./dem-malloc.so sort -n /tmp/so.txt > /dev/null
[dem-malloc] malloc 215 (162391 KB) calloc 1 realloc 3 free 68
$ LD_PRELOAD=./dem-malloc.so node -e 'JSON.parse(…)'
[dem-malloc] malloc 15036 (10214 KB) calloc 55 realloc 50 free 15076`, { hl: [2, 4, 6] }) +
    `<ul style="font-size:20px">
<li><b>ltrace</b> traces <b>library</b> calls (malloc, strlen…); this Debian image has no arm64 build, so we interpose by hand</li>
<li><code class="i">sort</code>: only 215 calls but <b>162 MB</b> — count <b>and</b> size matter</li>
</ul>`, 'r46') },

  { t: 'perf in a container: tried for real', giua: true, body: two(
    zm(term(`# Docker defaults
$ perf stat -e task-clock true
bash: perf: command not found
$ cat /proc/sys/kernel/perf_event_paranoid
2
$ ./mini-perf true
 <not counted>  task-clock   perf_event_open: Operation not permitted`, { hl: [3, 7] }), 0.8) +
    box('Why', 'No <code class="i">linux-perf</code> package here, and Docker\'s default <b>seccomp</b> profile blocks <code class="i">perf_event_open</code> (CS.6). So we wrote a 60-line "perf stat" on the same syscall.', 'lam'),
    zm(out(`# --cap-add=SYS_ADMIN
$ ./mini-perf ./cham-trang 256          # THP on
             176  page-faults
$ ./mini-perf ./cham-trang 256 small    # 4 KiB pages
           65584  page-faults
$ ./mini-perf ./ban cpu 1
      1003914165  task-clock (ns)
              29  context-switches
$ ./mini-perf sh -c 'yes | head -c 200000000 > /dev/null'
            4212  context-switches
   <not counted>  instructions  perf_event_open: No such file or directory`, { hl: [3, 5, 10, 11] }), 0.8) +
    `<ul style="font-size:19px">
<li>Software counters work; <b>no hardware counters</b> (instructions, cycles, cache misses) in this VM — on a real server <code class="i">perf stat</code> gives them</li>
<li>256 MiB = 65,536 pages of 4 KiB, or ~128 <b>huge pages</b> of 2 MiB</li>
</ul>`) },

  { t: 'Flame graphs: where the CPU time goes', giua: true, body: `${flame()}
${two(`<ul style="font-size:20px">
<li>A profiler takes a <b>stack sample</b> every few ms; equal stacks are merged</li>
<li><b>Width</b> = share of samples (NOT time order) · bottom = caller, top = callee</li>
<li>Look for <b>wide plateaus at the top</b>: here <b>JSON.parse 58 %</b></li>
</ul>`, box('Make one', 'Linux: <code class="i">perf record -g</code> + Gregg\'s FlameGraph scripts · Node: <code class="i">node --cpu-prof</code> (open in Chrome DevTools) · Java: async-profiler. Picture: sample data shaped like case 1.', 'lam'), 'r64')}` },

  { t: 'The USE method (Brendan Gregg, 2012)', giua: true, body: `<p style="margin:0 0 4px;font-size:25px;text-align:center"><b>"For every resource, check utilization, saturation, and errors."</b></p>
<table class="t" style="font-size:18px"><tr><th style="width:130px">Resource</th><th>Utilization</th><th>Saturation</th><th>Errors</th></tr>
<tr><td><b>CPU</b></td><td>vmstat <b>us+sy+st</b>, mpstat per CPU, pidstat %CPU</td><td>vmstat <b>r</b> &gt; CPU count; load average</td><td>rare (machine check)</td></tr>
<tr><td><b>Memory</b></td><td>free <b>available</b>, top RES</td><td>vmstat <b>si/so</b> (swapping), page scanning</td><td><b>OOM kills</b> in dmesg (CS.5)</td></tr>
<tr><td><b>Disk</b></td><td>iostat <b>%util</b></td><td>iostat <b>aqu-sz</b>, high <b>await</b></td><td>dmesg I/O errors, smartctl</td></tr>
<tr><td><b>Network</b></td><td>sar -n DEV rx/tx kB/s vs link speed</td><td>drops, overruns, TCP retransmits</td><td>ip -s link errors</td></tr>
<tr><td><b>Software</b></td><td>threads in use, pool busy</td><td>accept queue (ss), pool wait</td><td>EMFILE, timeouts (CS.2)</td></tr>
</table>
${box('Why it works', 'It is a <b>checklist</b>, not a guess: you cannot forget the disk because you were staring at CPU graphs. Saturation and errors are easier to interpret than utilization — check them first.', 'xanh')}` },

  { t: 'The 60-second checklist (Netflix, 2015)', giua: true, body: two(
    `<table class="t" style="font-size:16px"><tr><th style="width:34px">#</th><th style="width:186px">Command</th><th>Look for</th></tr>
<tr><td>1</td><td>uptime</td><td>load: rising or falling?</td></tr>
<tr><td>2</td><td>dmesg | tail</td><td>OOM killer, TCP drops</td></tr>
<tr><td>3</td><td>vmstat 1</td><td>r, si/so, us/sy/wa/st</td></tr>
<tr><td>4</td><td>mpstat -P ALL 1</td><td>one CPU at 100 %?</td></tr>
<tr><td>5</td><td>pidstat 1</td><td>which process</td></tr>
<tr><td>6</td><td>iostat -xz 1</td><td>await, aqu-sz, %util</td></tr>
<tr><td>7</td><td>free -m</td><td>available, not free</td></tr>
<tr><td>8</td><td>sar -n DEV 1</td><td>network throughput</td></tr>
<tr><td>9</td><td>sar -n TCP,ETCP 1</td><td>retrans/s, active/s</td></tr>
<tr><td>10</td><td>top</td><td>check it all agrees</td></tr>
</table>`,
    out(`$ dmesg | tail -3
dmesg: read kernel buffer failed: Operation not permitted
$ mpstat -P ALL 1 1
 CPU    %usr  ...  %iowait   %idle
   4  100.00  ...     0.00    0.00
   5  100.00  ...     0.00    0.00
$ pidstat 1 1
     PID    %usr %system  %wait   %CPU  Command
      21  100.00    0.00   0.00 100.00  ban
      22  100.00    0.00   0.00 100.00  ban
      23    0.00    7.00   1.00   7.00  ghi-log
$ iostat -xz 1 2   (vda)
Device  r/s   w/s     r_await w_await aqu-sz %util
vda    0.00 10591.00   0.00    0.08   1.23  78.80`, { hl: [2, 4, 5, 10, 13], title: 'real run, two "mystery" processes (trimmed)' }) +
    box('Found in 60 s', 'Two single-threaded CPU hogs (one core each), plus a writer that keeps the disk 79 % busy. In a container <code class="i">dmesg</code> is not allowed — ask the host.', 'lam'), 'r46') },

  { t: 'Case 1 — "the Node API is slow, even /health"', giua: true, body: two(
    js(`function loadOrders() {              // line 6
  return JSON.parse(fs.readFileSync(FILE)); // 10 MB
}
http.createServer(function handle(req, res) {
  if (req.url === '/health') return res.end('ok');
  if (req.url === '/report') {
    const sum = total(loadOrders()); // per request!
    return res.end(JSON.stringify({ sum }));
  }
});`, { hl: [2, 7] }) +
    box('Symptom first, numbers not feelings', '8 clients on <code class="i">/report</code> for 3 s: only <b>65</b> requests, and <code class="i">/health</code> — which does nothing — took <b>p50 704 ms, p99 1,897 ms</b>.', 'bad'),
    out(`$ pidstat -u -t -p $(pgrep -f _api.js) 1 1
   TGID   TID    %usr %system   %CPU  Command
     21     -   91.00    8.00  99.00  node
      -    21   92.00    8.00 100.00  |__node
      -    25    1.00    0.00   1.00  |__node
$ strace -f -c -o s.txt node _api.js   (during the load)
% time  usecs/call     calls  syscall
 19.68       24701        21  epoll_pwait
  5.18         864       158  read
  1.60          92       457  munmap`, { hl: [4, 8, 9], title: 'output (trimmed)' }) +
    `<ul style="font-size:19px">
<li><b>One thread</b> (TID = PID, the event loop) at <b>100 %</b> user time, the others idle</li>
<li>Only <b>21</b> <code class="i">epoll_pwait</code> calls in the whole run: the loop almost never got back to wait for events</li>
</ul>`) },

  { t: 'Case 1 — profile, fix, measure again', giua: true, body: two(
    out(`$ node --cpu-prof _api.js   (during the load)
$ node _top-prof.js
3099 samples, one every ~1.31 ms
  self%  function
   71.3  loadOrders _api.js:6
   17.8  (idle)
    2.6  toString node:buffer:839
    2.5  (garbage collector)
    2.1  read`, { hl: [5] }) +
    `<ul style="font-size:20px">
<li>V8's sampling profiler = <b>perf top</b> for JavaScript. Built-ins like <code class="i">JSON.parse</code> are counted in the <b>caller</b>: <code class="i">loadOrders</code></li>
<li>Fix: parse <b>once</b> at start-up (or cache with a TTL, or stream + <code class="i">await fs.promises</code>)</li>
</ul>`,
    nodeBars() + box('Lesson', 'Sync I/O + sync parsing on the event loop blocks <b>every</b> request, even the cheap ones. Four steps found the line: latency → thread → syscalls → function.', 'xanh'), 'r46') },

  { t: 'Case 2 — Java: our code, or the garbage collector?', giua: true, body: two(
    zm(out(`$ java -Xmx48m -Xlog:gc:file=gc48.txt GcCham
1000000 requests in 4355 ms, max heap 48 MB
$ java -Xmx512m -Xlog:gc:file=gc512.txt GcCham
1000000 requests in 2075 ms, max heap 512 MB
$ grep -m4 Pause gc48.txt
GC(0) Pause Young (Normal) (G1 Evacuation Pause) 24M->23M(48M) 3.570ms
GC(1) Pause Young (Concurrent Start) (G1 Evacuation Pause) 29M->30M(48M) 1.985ms
GC(3) Pause Young (Normal) (G1 Evacuation Pause) 34M->34M(48M) 3.112ms
GC(2) Pause Remark 35M->35M(48M) 0.163ms
$ awk '/Pause/ {…}' gc48.txt gc512.txt
gc48.txt: 2557 pauses, 0 full, 1676.4 ms paused in total
gc512.txt: 49 pauses, 0 full, 54.3 ms paused in total`, { hl: [2, 4, 8, 11, 12], title: 'output (trimmed: checksum, "[0.037s][info][gc]" prefixes, the awk loop)' }), 0.86) +
    box('Read one GC line', '<code class="i">24M-&gt;23M(48M) 3.570ms</code> = heap in use <b>before → after</b> this collection (heap size now), and how long every application thread was <b>stopped</b>. "Young" = only recently created objects were collected.', 'lam'),
    `<ul style="font-size:20px;gap:8px">
<li>Same code, same work. The app keeps <b>~40 MB alive</b> (a cache) and makes garbage per request</li>
<li>48 MB heap: after each GC the heap is <b>still ~34 MB full</b> (<code class="i">34M-&gt;34M(48M)</code>) ⇒ the next GC comes almost at once</li>
<li><b>2,557</b> pauses, <b>1.7 s</b> stopped: the service is <b>2.1× slower</b></li>
</ul>
${box('Fix', 'Give the heap room (<code class="i">-Xmx</code> or <code class="i">-XX:MaxRAMPercentage</code> in a container, CS.5), or keep less alive. In top, GC shows up as extra %CPU over 100 % on <b>GC threads</b>.', 'xanh')}`, 'r64') },

  { t: 'Case 3 — "the database is slow, the CPU is idle"', giua: true, body: two(
    out(`$ for i in 1 2 3 4; do ./ghi-log 6 1 & done   # 1 fdatasync per row
$ vmstat 1 3 | sed 3d
 r  b  ...    bo     in     cs us sy id wa st
 5  1  ...  41308  57694  89930 31 13 44 12  0
$ iostat -xz -d 1 2   (vda, columns picked)
Device     w/s   wkB/s  w_await    f/s  f_await  aqu-sz  %util
vda    6309.00 41172.00    0.21 2782.00    0.17    1.82  75.30
$ pidstat -d -C ghi-log 1 1
  PID  kB_rd/s  kB_wr/s  Command
   16     0.00  2868.00  ghi-log      (× 4 writers)
$ strace -T -e trace=write,fdatasync -p <one writer>
write(3, "rrrr"..., 200) = 200 <0.000040>
fdatasync(3)             = 0   <0.000516>`, { hl: [4, 7, 13], title: 'output (trimmed; us/sy include other containers on the VM)' }),
    `<ul style="font-size:20px;gap:8px">
<li>No PostgreSQL in the image ⇒ a mini <b>write-ahead log</b>: append 200 bytes, <code class="i">fdatasync</code>, like one commit</li>
<li><b>wa</b> 12 %, disk <b>75 %</b> busy, <b>2,782 flushes/s</b></li>
<li><code class="i">strace -T</code>: the write takes 40 µs, the <b>flush 0.5 ms</b> — 13× longer. The time is spent <b>waiting for the disk</b>, not computing</li>
</ul>
${box('Each writer', 'Only <b>~618 commits/s</b>, and the CPU has nothing to do with it.', 'bad')}`, 'r64') },

  { t: 'Case 3 — the fix databases use: group commit', giua: true, body: two(
    commitBars() + out(`$ for i in 1 2 3 4; do ./ghi-log 3 64 & done; wait
ghi-log G=64: 32810 rows/s, 512 fdatasync/s
ghi-log G=64: 30400 rows/s, 475 fdatasync/s
ghi-log G=64: 32853 rows/s, 513 fdatasync/s
ghi-log G=64: 30229 rows/s, 472 fdatasync/s`),
    `<ul style="font-size:20px;gap:8px">
<li>The disk does about the same number of <b>flushes</b> per second; each flush now makes <b>64 rows</b> durable ⇒ <b>~50×</b> more rows/s</li>
<li>PostgreSQL already flushes WAL for concurrent commits together; you help by putting many rows in <b>one transaction</b> (or <code class="i">COPY</code>), with <code class="i">commit_delay</code>, or — if losing the last moments of commits after a crash is acceptable — <code class="i">synchronous_commit = off</code></li>
<li>Faster disk for WAL = lower <b>f_await</b></li>
</ul>
${box('Do not "fix" it like this', 'Turning <code class="i">fsync</code> off makes benchmarks fast and a power cut <b>corrupts</b> the database (CS.2: page cache vs fsync).', 'bad')}`, 'r46') },

  { t: 'Classic misreadings', giua: true, body: vsd(
    `<ul style="font-size:20px;gap:8px">
<li>"Load 13 on 10 CPUs ⇒ CPU is the problem" — D-state tasks add load with <b>0 % CPU</b></li>
<li>"%util 100 % ⇒ the SSD is maxed out" — a device that serves requests <b>in parallel</b> can do more (iostat(1))</li>
<li>"node at 100 % ⇒ needs more cores" — one event-loop thread can use only <b>one</b></li>
<li>"Average latency is 20 ms, fine" — <code class="i">/health</code> p99 was <b>1.9 s</b></li>
<li>Running <code class="i">strace</code> on a busy production process "just to see"</li>
<li>Trusting top's header inside a container</li>
</ul>`,
    `<ul style="font-size:20px;gap:8px">
<li>Split load: <b>r</b> (vmstat) vs <b>D</b> (<code class="i">ps -eo stat</code>); compare r with <code class="i">nproc</code></li>
<li>Check <b>await</b> and <b>aqu-sz</b> together with %util</li>
<li>Look per <b>thread</b> (<code class="i">pidstat -t</code>, <code class="i">top -H</code>)</li>
<li>Always ask for <b>p95/p99</b> and the max</li>
<li><code class="i">strace -c</code> for seconds on a copy, or sampling tools (perf, --cpu-prof) — strace slowed a program <b>×120</b></li>
<li><code class="i">/proc/loadavg</code>, top's %Cpu line, vmstat = <b>whole host/VM</b>; the process list = your container</li>
</ul>`, '✗ Misreading', '✓ Read it right') },

  { t: '🧭 On a real server', giua: true, body: cards([
    ['Load 30, CPUs idle', 'Many tasks in <b>D</b>: a slow or hung disk/NFS, or a full disk. <code class="i">ps -eo stat,wchan,cmd | grep "^D"</code>, then <code class="i">iostat -xz 1</code>.'],
    ['p99 jumps, CPU 25 % on 4 cores', 'One thread at 100 %: a blocked <b>event loop</b> (Node) or one hot lock. <code class="i">pidstat -t</code> / <code class="i">top -H</code>, then a profiler.'],
    ['Cheap cloud VM "slower at night"', '<b>st</b> (steal) at 20–30 %: another tenant uses your physical CPU. Not your code — change instance type.'],
    ['Thousands of CLOSE-WAIT', 'Your code does not close connections after the peer leaves (pool / HTTP client bug) ⇒ later <b>EMFILE</b>.'],
  ], 2) + box('On this site\'s own VPS', '2026-07-06: two image builds at once on a 6 GB VPS ⇒ <code class="i">next build</code> <b>OOM-killed, exit 137</b> (memory saturation = errors in dmesg) ⇒ builds run one at a time. Once a <b>full disk</b> stopped PostgreSQL: disk errors are part of USE too.', 'bad') },

  { t: '🎤 Interview questions you will hear', giua: true, body: cards([
    ['What is load average on Linux?', 'Exponentially damped 1/5/15-min averages of runnable + uninterruptible (D) tasks. Compare with the CPU count; D tasks add load without CPU.'],
    ['us vs sy vs wa vs st?', 'User code / kernel work for syscalls / idle while I/O is pending / stolen by the hypervisor.'],
    ['A service is slow — where do you start?', 'Measure latency (p99), then the USE method per resource, or the 60-second checklist; then narrow to process, thread, syscall, function.'],
    ['strace vs perf?', 'strace traces every syscall via ptrace — exact but very slow. perf samples/counts in the kernel with low overhead.'],
    ['What does a flame graph show?', 'Merged stack samples: width = share of CPU samples, y = stack depth; wide top frames are the hot code.'],
    ['VIRT vs RES?', 'Mapped address space vs pages really in RAM. A 900 MB VIRT with 330 MB RES is normal (CS.5).'],
  ], 2) },

  { t: 'Self-check', giua: true, to: true, body: `
<ol style="font-size:24px">
<li>A box with 8 CPUs shows load 20 while top says 85 % idle. Name a likely cause and the two commands that confirm it.</li>
<li><code class="i">strace -c</code> shows 2,000,000 <code class="i">write</code> calls for a program that writes a 2 MB file. What is wrong, and why is strace a bad tool to leave running?</li>
<li>A Java service: heap 512 MB, after every GC "450M-&gt;440M(512M)". What do you expect and what do you change?</li>
</ol>
${box('Answers', '<b>1.</b> Many tasks in <b>D</b> (waiting for disk/NFS/locks): <code class="i">ps -eo stat,wchan,cmd | grep ^D</code> and <code class="i">iostat -xz 1</code> / <code class="i">vmstat 1</code> (b, wa). <b>2.</b> It writes 1 byte per call — buffer the output; strace stops the process twice per syscall (×120 slower here). <b>3.</b> ~440 MB stays alive, so GCs come back-to-back with long total pause: raise the heap or keep less alive (cache size), then re-check with <code class="i">-Xlog:gc</code>.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, body: `
<ul>
<li>Load = <b>R + D</b>, damped; compare with <code class="i">nproc</code>, and split R from D</li>
<li>top/vmstat: <b>us</b> code, <b>sy</b> kernel, <b>wa</b> waiting for disk, <b>st</b> stolen; pidstat finds the process, ss the socket</li>
<li><b>strace</b>: count (<code class="i">-c</code>), time (<code class="i">-T</code>), attach (<code class="i">-p</code>) — exact but ×120 slower; <b>perf</b>/profilers sample cheaply</li>
<li><b>USE</b> for every resource; the <b>60-second checklist</b> to start</li>
<li>Cases: sync parse on the event loop, a heap too small for its live data, one fsync per commit</li>
</ul>
${box('Next: CS.8 — OS interview prep + capstone lab', 'Forty interview questions, then a broken service (fd leak + blocked event loop + OOM) to diagnose with everything from CS.1–CS.7.', 'lam')}` },
]);
