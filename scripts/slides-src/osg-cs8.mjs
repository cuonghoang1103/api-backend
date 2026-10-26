/**
 * osg-cs8 — OSG202 · ⭐ Advanced 8 "OS interview prep and capstone lab" (deck tự dựng, slide EN, khuôn _pg-chung.mjs, 26/10/2026).
 * Deck CUỐI của phần ⭐: 40 câu phỏng vấn HĐH (10 slide × 4 thẻ, nhóm theo chủ đề) + capstone "orders-api hỏng" (rò fd, chặn event
 *   loop, phình bộ nhớ tới OOM 137) chẩn đoán bằng bộ công cụ CS.1–CS.7, có lời giải + nghiệm thu + thang chấm.
 * Đề cương: REPO/OSG202/CHUYEN-SAU.md mục 8. MỌI output = CHẠY THẬT bằng runner của gen (ảnh osg202-lab: Debian 12.15 aarch64,
 *   nhân 7.0.12-linuxkit trong VM Docker Desktop, Node v22.23.4, strace 6.1, --network none ⇒ client gọi 127.0.0.1):
 *   capstone = REPO/OSG202/gen/code/cs8/{_orders.js,_khach.js,lab1-fd,lab1-sua,lab2-loop,lab2-sua,lab3-mem,lab3-sua,lab4-nghiem-thu}
 *   (+ .out.txt, đều @mau — slide chép nguyên MỘT lần chạy, chỗ cắt ghi trên thanh tiêu đề khung).
 *   Số đo trên thẻ câu hỏi lấy từ chương trình ĐÃ CHẠY của các bài khác: osg2/chuyen-ngu-canh.c (1,71 µs), osg10/vdso-nhanh.c
 *   (206 ns vs 19,8 ns), osg10/chi-phi-fork.c (26,8 ms vs 0,70 ms), osg2/nice.sh (89,1 % vs 9,2 %), osg2/quay-hay-nhuong.c (647 vs 134 ms),
 *   osg2/mutex-futex.sh (futex 2 vs 238), cs3/Race.java (1 169 190 / 2 000 000), osg6/khoa-chet.c, osg6/thu-tu-khoa.c, osg6/livelock.c,
 *   osg3/ao-lon-hon-that.c (64 GB ảo, +12 kB), osg3/tlb-trang-lon.c (210,6 vs 150,3 ns), osg3/loi-trang.c (2048 major), osg3/cow.c,
 *   osg3/heap-stack.c (135 168 B), cs5/*, osg4/lien-ket-cung-mem.sh, osg10/unlink-giu-cho.sh (50 MB), cs2/fsync-do.c (2,2 µs vs 877 µs),
 *   cs4/select-1024.c, cs4 echo-epoll (10 000 kết nối), cs6/mot-tien-trinh-hai-pid.sh, cs6/cg-pids.sh, cs7/kiem-60s.sh.
 * Nguồn tra: man7 (proc(5) /proc/pid/stat utime/stime trường 14–15, /proc/pid/limits, strace(1) -c -p, getrlimit(2) EMFILE,
 *   futex(7), pthread_spin_lock(3), epoll(7), unlink(2)); nodejs.org (crypto.pbkdf2Sync chặn, crypto.pbkdf2 chạy trên thread pool
 *   libuv; process.memoryUsage arrayBuffers; Buffer ngoài heap V8); kernel docs admin-guide/cgroup-v2 (memory.max, memory.events);
 *   Coffman, Elphick, Shoshani 1971 (4 điều kiện); Brendan Gregg USE method / 60-second checklist.
 */
import { lamDeck, sql, psql, sh, two as two0, box, vsd, flow } from './_pg-chung.mjs';

export const deck = { key: 'cs8', code: 'CS.8', title: 'OS interview prep and capstone lab', sub: 'OSG202 · ⭐ Advanced' };

const out = (t, o = {}) => psql(t, { title: 'output', sm: true, ...o });
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const js = (s, o = {}) => sql(s, { lang: 'javascript', sm: true, ...o });
/* two() của khuôn đặt a, b thẳng vào lưới ⇒ cột nhiều phần tử vỡ lưới: bọc mỗi cột một div */
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const zm = (h, z) => `<div style="zoom:${z}">${h}</div>`;
const MK = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.it ? ' font-style="italic"' : ''}${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="6 4"' : ''}/>`;
const L = (x1, y1, x2, y2, c, id, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="6 5"' : ''}${id ? ` marker-end="url(#${id})"` : ''}/>`;
/* chữ nhiều dòng: cắt theo số ký tự tối đa (Arial ≈ 0,55 × cỡ chữ mỗi ký tự; đơn cách 0,602) */
const wrap = (s, n) => { const w = s.split(' '), r = []; let l = ''; for (const x of w) { if ((l + ' ' + x).trim().length > n) { r.push(l); l = x; } else l = (l + ' ' + x).trim(); } if (l) r.push(l); return r; };
const TT = (x, y, s, fs, maxW, o = {}) => wrap(s, Math.floor(maxW / ((o.m ? 0.602 : 0.55) * fs))).map((l, i) => T(x, y + i * fs * 1.3, l, fs, o)).join('');
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', GY = '#8a8a8a', PU = '#7a4b94';

/* ── thẻ câu hỏi phỏng vấn (lưới 2×2) ── */
const QSTY = `<style>
.osg-qg{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:12px;flex:1;min-height:0}
.osg-q{border:1.5px solid #e3c9ae;border-radius:10px;padding:9px 14px 8px;background:#fffaf5;display:flex;flex-direction:column;gap:4px;min-height:0}
.osg-qh{font-weight:800;color:#b85a2b;font-size:19px;line-height:1.24;display:flex;gap:9px;align-items:flex-start}
.osg-qn{flex:0 0 auto;background:#e08a1e;color:#fff;border-radius:6px;padding:0 7px;font-size:16px;line-height:23px;margin-top:1px}
.osg-q p{margin:0;font-size:16.5px;line-height:1.34;color:#333}
.osg-q p.osg-qf{color:#245077}
.osg-q p.osg-qr{color:#7a7a7a;font-size:14px;margin-top:auto;border-top:1px dashed #e3c9ae;padding-top:4px}
.osg-q code{font-family:"SF Mono",Menlo,monospace;font-size:.86em;background:#f3f0ea;border-radius:4px;padding:0 3px;color:#7a3d12}
</style>`;
const qc = ([n, q, a, f, r]) => `<div class="osg-q"><div class="osg-qh"><span class="osg-qn">Q${n}</span><span>${q}</span></div><p>${a}</p><p class="osg-qf">↪ <i>${f}</i></p><p class="osg-qr">📍 ${r}</p></div>`;
const qs = (items) => `${QSTY}<div class="osg-qg">${items.map(qc).join('')}</div>`;

/* ── Slide 3: câu trả lời ba tầng ── */
const ladder = () => {
  let s = `<svg viewBox="0 0 1110 280" width="1110" height="280" font-family="Arial"><defs>${MK('osg-l', BR)}</defs>`;
  const L3 = [
    ['1 · WHAT', 'one sentence · ~10 s', 'A child process that has exited, but whose parent has not called wait() yet.', BL, '#eef4fa'],
    ['2 · HOW', 'the mechanism · ~20–30 s', 'The kernel keeps its PID and exit status so the parent can read them. It uses no CPU and almost no memory — only a slot in the process table.', OR, '#fff7ef'],
    ['3 · WHERE', 'your proof · ~15–20 s', 'I made three: ps showed STAT Z and kill -9 did nothing. A SIGCHLD handler reaped them. In Docker, a Node app as PID 1 piles them up, so we add --init.', GR, '#f1f9f4'],
  ];
  L3.forEach(([h, sub, txt, c, f], i) => {
    const x = 10 + i * 370, y = 84 - i * 22, hh = 186 + i * 22;
    s += R(x, y, 340, hh, f, c, { rx: 12, sw: 2.5 });
    s += T(x + 18, y + 32, h, 22, { w: 800, f: c });
    s += T(x + 18, y + 56, sub, 15, { f: '#666' });
    s += TT(x + 18, y + 90, txt, 17, 300);
    if (i < 2) s += L(x + 344, 180, x + 366, 180, BR, 'osg-l', { sw: 3 });
  });
  s += T(10, 24, 'Interviewer: “What is a zombie process?”', 19, { w: 800, f: '#404040' });
  s += T(1100, 24, 'total 45–60 s', 17, { a: 'end', w: 700, f: BR });
  return s + '</svg>';
};

/* ── Slide 15: kiến trúc capstone ── */
const capArch = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial"><defs>${MK('osg-c', BL)}</defs>`;
  s += R(4, 26, 700, 268, '#fafafa', GY, { rx: 14, dash: true, sw: 2 });
  s += T(18, 18, 'one container: --ulimit nofile=128:128 · --memory=256m, no swap · --network none', 15, { w: 700, f: '#555' });
  s += R(24, 120, 140, 76, '#eef4fa', BL, { rx: 10 });
  s += T(94, 152, '_khach.js', 17, { a: 'middle', w: 800, f: BL, m: 1 });
  s += T(94, 176, 'the users', 14, { a: 'middle', f: '#555' });
  s += L(166, 158, 222, 158, BL, 'osg-c', { sw: 3 });
  s += T(194, 146, 'HTTP', 13, { a: 'middle', f: '#555' });
  s += T(194, 180, '127.0.0.1', 12, { a: 'middle', f: '#555' });
  s += R(226, 44, 462, 236, '#fff7ef', OR, { rx: 12, sw: 2.5 });
  s += T(457, 72, 'orders-api · node _orders.js · ONE process', 17, { a: 'middle', w: 800, f: BR });
  const rows = [['GET /orders/:id', 'audit() → /tmp/audit.log', RD], ['GET /report', 'signReport() → pbkdf2', RD], ['GET /search?q=', 'cache Map → 1 MiB Buffer', RD], ['GET /health · /debug/mem', 'liveness · memoryUsage()', GR]];
  rows.forEach(([a, b, c], i) => {
    const y = 88 + i * 46;
    s += R(242, y, 430, 38, '#fff', c === GR ? '#9fd0b2' : '#e3a59c', { rx: 7, sw: 1.5 });
    s += T(254, y + 25, a, 15, { w: 700, m: 1 });
    s += T(662, y + 25, b, 14, { a: 'end', f: c === GR ? GR : '#7a2a1d' });
  });
  const tk = [['TICKET 1', '“Some orders fail with 500', 'after it has run a while.”'], ['TICKET 2', '“The API freezes, even /health,', 'when the daily report opens.”'], ['TICKET 3', '“Restarts every few hours,', 'exit code 137, no log line.”']];
  tk.forEach(([h, a, b], i) => {
    const y = 26 + i * 92;
    s += R(724, y, 382, 80, '#fdf0ee', RD, { rx: 10, sw: 2 });
    s += T(740, y + 24, h, 15, { w: 800, f: RD });
    s += T(740, y + 47, a, 16, { it: 1 });
    s += T(740, y + 68, b, 16, { it: 1 });
  });
  return s + '</svg>';
};

/* ── Slide 19: độ trễ /health theo thời điểm gửi (số thật lab2-loop.out.txt: gửi = xong − mất) ── */
const lagChart = () => {
  const P = [[0, 8], [109, 2], [214, 5], [317, 595], [418, 494], [520, 393], [620, 293], [721, 193], [822, 93], [923, 0], [1030, 1], [1134, 3], [1235, 7], [1341, 3], [1444, 5], [1546, 4], [1648, 4], [1757, 3], [1859, 2], [1960, 4]];
  const x0 = 70, y0 = 230, sx = 1000 / 2000, sy = 190 / 600;
  let s = `<svg viewBox="0 0 1110 285" width="1110" height="285" font-family="Arial">`;
  s += `<rect x="${x0 + 312 * sx}" y="22" width="${(911 - 312) * sx}" height="${y0 - 22}" fill="#fdf0ee"/>`;
  s += T(x0 + 925 * sx, 76, '← GET /report runs pbkdf2Sync on the event loop: 312 → 911 ms', 15, { w: 700, f: RD });
  [0, 200, 400, 600].forEach((v) => { const y = y0 - v * sy; s += `<line x1="${x0}" y1="${y}" x2="${x0 + 1010}" y2="${y}" stroke="#eee"/>`; s += T(x0 - 8, y + 5, v, 14, { a: 'end', f: '#777' }); });
  s += L(x0, y0, x0 + 1010, y0, '#999', null, { sw: 1.5 });
  [0, 500, 1000, 1500, 2000].forEach((v) => s += T(x0 + v * sx, y0 + 20, `${v} ms`, 14, { a: 'middle', f: '#777' }));
  P.forEach(([t, v]) => {
    const h = Math.max(2, v * sy), bad = v > 100;
    s += `<rect x="${x0 + t * sx - 9}" y="${y0 - h}" width="18" height="${h}" fill="${bad ? RD : GR}" opacity="${bad ? 0.85 : 0.75}"/>`;
    if (bad) s += T(x0 + t * sx, y0 - h - 6, v, 13, { a: 'middle', w: 700, f: RD });
  });
  s += T(14, 16, '/health latency (ms), by the moment the probe was sent', 15, { f: '#555' });
  s += T(x0 + 1010, y0 + 44, 'every probe sent during the report waits until 911 ms: a staircase 595 → 93 ms', 15, { a: 'end', w: 700, f: '#555' });
  return s + '</svg>';
};

/* ── Slide 21: RSS theo số truy vấn (số thật lab3-mem / lab3-sua, kB/1024) ── */
const rssChart = () => {
  const x0 = 64, y0 = 180, sx = 980 / 600, sy = 150 / 270, W = x0 + 990;
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">`;
  [0, 100, 200].forEach((v) => { const y = y0 - v * sy; s += `<line x1="${x0}" y1="${y}" x2="${W}" y2="${y}" stroke="#eee"/>`; s += T(x0 - 8, y + 5, v, 14, { a: 'end', f: '#777' }); });
  s += L(x0, y0, W, y0, '#999', null, { sw: 1.5 });
  [0, 100, 200, 300, 400, 500, 600].forEach((v) => s += T(x0 + v * sx, y0 + 20, v, 14, { a: 'middle', f: '#777' }));
  s += T((x0 + W) / 2, y0 + 44, 'distinct /search queries sent', 15, { a: 'middle', f: '#555' });
  s += T(14, 18, 'VmRSS of orders-api (MiB)', 15, { f: '#555' });
  const lim = y0 - 256 * sy;
  s += L(x0, lim, W, lim, RD, null, { sw: 2, dash: true });
  s += T(W, lim - 7, 'memory.max 256 MiB (the whole container)', 15, { a: 'end', w: 700, f: RD });
  const bug = [[0, 46.0], [50, 104.1], [100, 154.5]];
  const pts = (d) => d.map(([a, b]) => `${x0 + a * sx},${y0 - b * sy}`).join(' ');
  s += `<polyline fill="none" stroke="${RD}" stroke-width="3.5" points="${pts(bug)}"/>`;
  s += `<polyline fill="none" stroke="${RD}" stroke-width="2.5" stroke-dasharray="6 5" points="${pts([[100, 154.5], [231, 256]])}"/>`;
  bug.forEach(([a, b]) => s += `<circle cx="${x0 + a * sx}" cy="${y0 - b * sy}" r="5" fill="${RD}"/>`);
  s += T(x0 + 231 * sx + 10, lim + 26, '✗ SIGKILL at query 231 · exit 137', 16, { w: 800, f: RD });
  s += T(x0 + 8, y0 - 180 * sy, 'bug: +1.08 MiB per query', 15, { w: 700, f: RD });
  const fix = [[0, 46.0], [200, 142.6], [400, 143.3], [600, 144.3]];
  s += `<polyline fill="none" stroke="${GR}" stroke-width="3.5" points="${pts(fix)}"/>`;
  fix.slice(1).forEach(([a, b]) => s += `<circle cx="${x0 + a * sx}" cy="${y0 - b * sy}" r="5" fill="${GR}"/>`);
  s += T(x0 + 400 * sx, y0 - 120 * sy, 'FIX=mem (LRU of 20): flat at ~143 MiB', 15, { a: 'middle', w: 700, f: GR });
  return s + '</svg>';
};

export const slides = lamDeck({ khoa: 'Operating Systems', duong: 'academy/osg202', bieuTuong: '🐧', khau: 'from zero to real backend work',
  chuong: '⭐ Advanced 8 — OS interview prep and capstone lab', bai: 'CS.8' }, [

  /* 1 */
  { cover: true, t: 'OS interview prep<br>and capstone lab', sub: '40 questions you will be asked — each answered<br>with a run from this course · then fix a broken<br>service: fd leak, blocked event loop, OOM 137' },

  /* 2 */
  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Answer <b>40 operating-system interview questions</b> in three layers: <b>what</b>, <b>how</b>, and a <b>number you measured</b></li>
<li>Expect the <b>follow-up question</b> for each one — that is where interviews are decided</li>
<li>Link every answer to a <b>backend</b> consequence: Node, Spring, PostgreSQL, Docker</li>
<li><b>Capstone</b>: diagnose a broken Node service from the outside — <b>fd leak</b>, <b>blocked event loop</b>, <b>OOM kill</b></li>
<li>Fix each bug, <b>measure again</b> under the same limits, and grade yourself with a <b>rubric</b></li>
</ul>
${box('The last deck of the ⭐ section', 'It ties together the 12 school chapters and CS.1–CS.7. Every number on these slides comes from a program that ran for real in the course container (Debian 12, ARM64, Linux 7.0, Node 22.23) — most of them in earlier lessons, which the 📍 line on each card points to.', 'lam')}` },

  /* 3 */
  { t: 'First, a picture: how a strong answer is built', giua: true, body: `
${ladder()}
${two(`<p style="margin:0;font-size:20px">A doctor does not answer “what is a fever?” with a textbook page. She says what it is, why the body does it, and what <b>your</b> thermometer shows. Do the same: <b>definition → mechanism → evidence</b>.</p>`,
    box('Then comes the follow-up ↪', '“How do you get rid of one?” — you cannot kill a zombie; make the parent call <code class="i">wait()</code>, or kill the parent so <code class="i">init</code> adopts and reaps it. Layer 3 is what lets you answer this calmly.', ''))}` },

  /* 4 */
  { t: 'The map: 40 questions in 10 topics', giua: true, body: `
<table class="t" style="font-size:17.5px">
<tr><th style="width:5%">Slide</th><th style="width:27%">Topic</th><th style="width:13%">Questions</th><th style="width:22%">School lessons</th><th>⭐ decks and runs to repeat</th></tr>
<tr><td>5</td><td>Processes, threads, the kernel</td><td>Q1–Q4</td><td>1.B · 2.A · 10.A</td><td>CS.1 · CS.3 · context switch 1.71 µs</td></tr>
<tr><td>6</td><td>System calls, fork/exec, zombies, signals</td><td>Q5–Q8</td><td>1.B · 2.A · 10.A</td><td>CS.1 · syscall 206 ns · exit 137/143</td></tr>
<tr><td>7</td><td>Scheduling</td><td>Q9–Q12</td><td>2.C · 10.A</td><td>CS.3 · CS.6 · nice 89 % vs 9 %</td></tr>
<tr><td>8</td><td>Races, locks, deadlock conditions</td><td>Q13–Q16</td><td>2.B · 6.A · 8.A</td><td>CS.3 · count++ lost 41 %</td></tr>
<tr><td>9</td><td>Deadlock handling, wait, models</td><td>Q17–Q20</td><td>2.B · 6.A</td><td>CS.3 · CS.4 · lock order, livelock</td></tr>
<tr><td>10</td><td>Virtual memory, paging, TLB, faults</td><td>Q21–Q24</td><td>3.A · 3.B · 10.B</td><td>CS.5 · TLB 1.4× · 2048 major faults</td></tr>
<tr><td>11</td><td>Replacement, thrashing, COW, stack/heap</td><td>Q25–Q28</td><td>3.A · 3.B</td><td>CS.5 · copy-on-write measured</td></tr>
<tr><td>12</td><td>Memory on a real server</td><td>Q29–Q32</td><td>3.B · 10.B</td><td>CS.5 · 100 GiB promised, exit 137</td></tr>
<tr><td>13</td><td>Files, inodes, links, fsync</td><td>Q33–Q36</td><td>4.A · 4.B · 10.B</td><td>CS.2 · fsync 400× slower</td></tr>
<tr><td>14</td><td>I/O models, IPC, containers, “it is slow”</td><td>Q37–Q40</td><td>5.A · 2.B · N1.A</td><td>CS.4 · CS.6 · CS.7 · 10 000 connections</td></tr>
</table>
<p style="margin:0;font-size:19px">The <b>📍</b> line on every card names the lesson to reread and, where one exists, the program whose output proves the answer.</p>` },

  /* 5 */
  { t: 'Q1–Q4 · Processes, threads and the kernel', body: qs([
    [1, 'Process vs thread?', 'A process is a running program with its <b>own address space</b>, fd table and PID. A thread is a path of execution <b>inside</b> it: it shares memory and fds, but has its own stack and registers. On Linux both are tasks made by <code>clone()</code>.', 'What does a thread NOT share? — its stack, registers, TID, signal mask, errno.', '2.A · CS.1 s4 · CS.3 s8 · ▶ osg2 chung-rieng: threads see each other’s writes, a forked child does not'],
    [2, 'What states can a process be in?', 'Running, ready, blocked — plus new and terminated. Linux shows them in <code>ps</code> STAT: <b>R</b> runnable, <b>S</b> sleeping, <b>D</b> uninterruptible I/O wait, <b>T</b> stopped, <b>Z</b> zombie. The kernel keeps each in a PCB (<code>task_struct</code>).', 'What is state D, and why can kill -9 not end it? — it sleeps inside the kernel waiting for I/O.', '2.A · 10.A · CS.7 s5 (D counts in load) · ▶ osg2 trang-thai.sh shows R, S, T, Z'],
    [3, 'What is a context switch, and what does it cost?', 'The kernel saves the registers of the running task, picks the next one and loads its registers — and, between processes, its <b>page table</b>. Direct cost about a microsecond; the bigger cost is cold caches and TLB afterwards.', 'Thread switch vs process switch? — threads of one process skip the address-space switch.', '2.A · CS.3 s11 · CS.7 s8 · ▶ osg2 chuyen-ngu-canh.c: 1.71 µs per switch on one core'],
    [4, 'User mode vs kernel mode?', 'Two CPU privilege levels (x86 ring 3/0, ARM EL0/EL1). User code cannot run privileged instructions or touch kernel memory; it enters the kernel only by a <b>system call</b>, an interrupt or a fault.', 'What does a high %sy in top tell you? — lots of time in the kernel: many syscalls, lock contention.', '1.B · CS.7 s7 · ▶ osg1 che-do.c: one privileged instruction → Illegal instruction, exit 132'],
  ]) },

  /* 6 */
  { t: 'Q5–Q8 · System calls, fork/exec, zombies, signals', body: qs([
    [5, 'What happens during a system call?', 'The libc wrapper puts the call number and arguments in registers and executes a <b>trap</b> (<code>syscall</code> on x86-64, <code>svc #0</code> on ARM64). The CPU switches to kernel mode, the kernel checks and does the work, and returns a value or <code>-errno</code>.', 'How do you see the syscalls of a running program? — strace -c to count, strace -p to attach.', '1.B · 10.A · CS.7 s11 · ▶ osg10 vdso-nhanh.c: real syscall 206 ns, vDSO clock_gettime 19.8 ns'],
    [6, 'Why are fork() and exec() two calls?', '<code>fork</code> copies the process (copy-on-write); <code>exec</code> replaces the program but keeps the PID and open fds. In between, the child sets up <code>dup2</code> redirections, env and cwd — exactly how a shell builds pipes.', 'Why is forking a 1 GiB process still slow? — the page tables are copied.', '2.A · CS.1 s7–8 · CS.2 s10 · ▶ osg10 chi-phi-fork.c: 1 GiB fork 26.8 ms, posix_spawn 0.70 ms'],
    [7, 'Zombie vs orphan?', 'A <b>zombie</b> has exited but its parent has not called <code>wait()</code>: PID and exit status are kept. An <b>orphan</b> lost its parent and is adopted by PID 1 (or a subreaper), which reaps it.', 'Why do zombies pile up in containers? — the app is PID 1 and never reaps; use --init / tini.', 'CS.1 s11–13 · ▶ cs1 zombie.sh: three Z, kill -9 does nothing, a SIGCHLD handler reaps them'],
    [8, 'SIGTERM vs SIGKILL — and exit codes?', 'SIGTERM (15) can be caught: finish requests, close pools, exit. SIGKILL (9) cannot: the kernel ends the process. Killed by signal N ⇒ status <b>128 + N</b>: 143 and 137. <code>docker stop</code> sends TERM, then KILL after 10 s.', 'A container exited with 137: OOM or docker stop? — read OOMKilled and memory.events.', 'CS.1 s9–10, 14–22 · CS.5 s19 · ▶ cs1 ma-thoat.sh: SIGTERM → 143, SIGKILL → 137'],
  ]) },

  /* 7 */
  { t: 'Q9–Q12 · Scheduling', body: qs([
    [9, 'Preemptive vs non-preemptive — and the classic algorithms?', 'Preemptive: a timer interrupt can take the CPU away. FCFS (simple, convoy effect), SJF/SRTF (best average wait, needs a length estimate), Round Robin (quantum), priority (risk of starvation), multilevel feedback queues.', 'Compute the average waiting time for RR with q = 4 — the 2.C simulator gives 5.67.', '2.C · ▶ simulator sec0 lap-lich: SRTF 6.5, RR q=4 5.67, Priority 8.2 (book examples)'],
    [10, 'How does Linux choose the next task?', 'A fair scheduler: run the task that has received the least <b>weighted</b> CPU time. CFS (2007) picked the smallest vruntime; since 6.6 EEVDF adds deadlines. Weights come from <b>nice</b>: nice 0 = 1024, nice 10 = 110.', 'Containers? — cgroup cpu.weight shares, cpu.max caps (a quota per period, not a slower CPU).', '2.C · 10.A · CS.6 s15 · ▶ osg2 nice.sh: two loops on one core, nice 0 gets 89.1 %, nice 10 gets 9.2 %'],
    [11, 'Starvation, aging, priority inversion?', 'Starvation: a task never gets the CPU; <b>aging</b> raises its priority while it waits. Priority inversion: a high task waits for a lock held by a low one, which a medium task keeps preempting — Mars Pathfinder, 1997.', 'The fix? — priority inheritance: the lock holder temporarily gets the waiter’s priority.', '2.B · 2.C · backend twin: one slow query holding a row lock stalls every request behind it'],
    [12, 'CPU-bound vs I/O-bound: how many threads?', 'CPU-bound work: about one thread per core — more only adds switches. I/O-bound: <code>cores × (1 + wait/compute)</code> (Goetz), then measure; Little’s law: in-flight = throughput × latency.', 'Your pool is 200 and the DB pool is 10 — what happens? — 190 threads wait for a connection.', 'CS.3 s9–10 · ▶ osg2 cpu-io.c: CPU-bound uses 100 % of its time on CPU, I/O-bound 11 %'],
  ]) },

  /* 8 */
  { t: 'Q13–Q16 · Races, locks, deadlock conditions', body: qs([
    [13, 'What is a race condition?', 'The result depends on how threads interleave. <code>count++</code> is three steps — load, add, store — so two threads can both read 5 and both write 6. The code that touches shared data is a <b>critical section</b> and must be mutually exclusive.', 'Is volatile enough in Java? — no: visibility, not atomicity. Use synchronized or AtomicInteger.', '2.B · CS.3 s20, 22 (lost update in SQL) · ▶ cs3 Race.java: 1 169 190 of 2 000 000, synchronized exact'],
    [14, 'Mutex vs semaphore?', 'A <b>mutex</b> has an owner: one holder, and the same thread unlocks it. A <b>semaphore</b> is a counter of permits: N holders at once, and any thread may signal — good for counting resources and for “wake the other side”.', 'Where in a backend? — limit calls to a slow API with a Semaphore(10); a DB pool is one too.', '2.B · ▶ osg2 sx-tt-semaphore.c: bounded buffer, sum 210, empty = 4 and full = 0 at the end'],
    [15, 'Spinlock vs mutex?', 'A spinlock <b>busy-waits</b>: fine only for very short holds on multicore (inside the kernel, interrupt handlers). A mutex <b>sleeps</b>: a Linux futex stays in user space and calls the kernel only when a thread really must wait.', 'What is a futex? — an atomic word in user memory plus a syscall to sleep or wake on it.', '2.B · 8.A · ▶ osg2 quay-hay-nhuong.c: 8 threads on 1 CPU, spin 647 ms vs yield 134 ms; futex 2 calls vs 238'],
    [16, 'The four conditions for deadlock?', 'Coffman, 1971 — all four must hold: <b>mutual exclusion</b>, <b>hold and wait</b>, <b>no preemption</b>, <b>circular wait</b>. Break any one and deadlock is impossible.', 'Which one is easiest to break in application code? — circular wait: one global lock order.', '6.A · CS.3 s21 · ▶ osg6 khoa-chet.c: both trylocks EBUSY, nobody gives up — a real deadlock'],
  ]) },

  /* 9 */
  { t: 'Q17–Q20 · Deadlock fixes, waiting, server models', body: qs([
    [17, 'How do you prevent, avoid or detect deadlock?', '<b>Prevent</b>: break a condition — lock ordering, <code>tryLock</code> with backoff, take all locks at once. <b>Avoid</b>: grant only if the state stays safe (Banker’s). <b>Detect</b>: find a cycle and abort a victim — what databases do.', 'What does PostgreSQL do? — after deadlock_timeout (1 s) it checks for a cycle and cancels one transaction.', '6.A · ▶ osg6 thu-tu-khoa.c: 400 000 opposite transfers, one lock order, no deadlock'],
    [18, 'Deadlock vs livelock vs starvation?', '<b>Deadlock</b>: everyone blocked, no CPU used. <b>Livelock</b>: everyone running and retrying, no progress — they back off in step. <b>Starvation</b>: the system progresses, one party never does.', 'A network example of livelock? — clients retrying in sync; add exponential backoff with jitter.', '6.A · ▶ osg6 livelock.c: 5 rounds, 20 lock operations, 0 meals — nobody blocked'],
    [19, 'What is a condition variable for?', 'To sleep until a <b>condition</b> becomes true: <code>wait()</code> atomically releases the mutex and sleeps; <code>signal()</code> wakes a waiter. Always re-check in a <code>while</code> loop — wake-ups can be spurious.', 'How is a bounded queue built? — two conditions, notFull and notEmpty (Java BlockingQueue).', '2.B · ▶ osg2 sx-tt-condvar.c: producer–consumer, the consumer gets 1 … 10 in order'],
    [20, 'Thread-per-request or event loop?', 'Threads: simple blocking code, but memory and switches limit you to hundreds. Event loop: one thread on <b>epoll</b> holds thousands of connections — and any CPU work <b>freezes everyone</b>. Java 21 virtual threads give blocking style at event-loop scale.', 'Node or Spring for a CPU-heavy report? — either, but off the request thread: a worker or a pool.', 'CS.3 s5, 14–19, 23 · CS.4 · ▶ capstone step 2 of this deck: /health stuck 595 ms'],
  ]) },

  /* 10 */
  { t: 'Q21–Q24 · Virtual memory, paging, TLB, page faults', body: qs([
    [21, 'Why virtual memory?', 'Each process gets its own address space: <b>isolation</b>, programs larger than RAM, memory given <b>lazily</b>, pages <b>shared</b> (libraries, copy-on-write), files mapped into memory. The MMU translates every access.', 'Two processes use the same virtual address — same data? — no, two different frames.', '3.A · CS.5 s3–5 · ▶ osg3 ao-lon-hon-that.c: mmap 64 GB → resident +0 kB; touch 3 bytes → +12 kB'],
    [22, 'How does paging work?', 'Memory is cut into 4 KiB <b>pages</b> (virtual) and <b>frames</b> (physical). A page table maps page → frame with present, dirty, accessed and permission bits; it is <b>multi-level</b> (4 levels for 48-bit addresses) so empty regions cost nothing.', 'Why not one flat table? — 2^36 entries × 8 B = 512 GiB per process.', '3.A · 10.B · ▶ osg3 dich-dia-chi.c: a real address split into page number + offset via /proc/self/pagemap'],
    [23, 'What is the TLB?', 'A small cache of recent page → frame translations inside the MMU. A hit is free; a miss costs a <b>page-table walk</b>. Switching processes can flush it (ASID/PCID tags avoid that). <b>Huge pages</b> (2 MiB) cover 512× more memory per entry.', 'Why do databases care? — PostgreSQL huge_pages, JVM large pages; but transparent huge pages can cause latency spikes.', '3.A · ▶ osg3 tlb-trang-lon.c: 512 MB pointer chase, 4 KB pages 210.6 ns vs 2 MB pages 150.3 ns'],
    [24, 'What is a page fault? Minor vs major?', 'An access the MMU cannot translate traps into the kernel. <b>Minor</b>: the page is already in RAM (first touch, copy-on-write, page cache) — just map it. <b>Major</b>: read it from disk. Invalid address ⇒ SIGSEGV.', 'Is a page fault an error? — no, it is how demand paging works; only major ones are slow.', '3.B · CS.5 s11 · ▶ osg3 loi-trang.c: 2048 file pages cold → 2048 major faults; warm → 0'],
  ]) },

  /* 11 */
  { t: 'Q25–Q28 · Replacement, thrashing, COW, stack/heap', body: qs([
    [25, 'Page replacement algorithms?', '<b>OPT</b> (evict the page used furthest in the future — theory only), <b>FIFO</b> (Belady’s anomaly), <b>LRU</b> (good, costly to track), <b>Clock</b> / second chance (LRU approximation). Linux keeps active/inactive lists — MGLRU since 6.1.', 'Belady’s anomaly? — with FIFO, more frames can mean more faults (9 → 10).', '3.A–3.B · ▶ simulator: classic string FIFO 15, LRU 12, OPT 9 faults · our capstone fix is an LRU too'],
    [26, 'What is thrashing?', 'The working sets of the running processes do not fit in RAM, so the system spends its time paging: the disk is busy, the CPU waits, throughput collapses. Fix: fewer processes, more RAM, or limits.', 'How do you spot it on a server? — vmstat si/so, high wa, /proc/pressure/memory, a cgroup stuck at memory.max.', '3.B · CS.5 s8–9 · CS.7 s8 (vmstat columns)'],
    [27, 'What is copy-on-write?', 'After <code>fork()</code> parent and child share pages marked read-only. The first <b>write</b> traps and copies just that page. Fork becomes cheap; PSS splits shared pages; <code>MAP_PRIVATE</code> works the same way.', 'Why can Redis need up to 2× memory during BGSAVE? — writes during the snapshot copy pages.', '3.B · CS.5 s6 · ▶ osg3 cow.c: child writes 1000 shared pages → ~1000 faults, one copy each'],
    [28, 'Stack vs heap?', '<b>Stack</b>: one per thread, frames pushed and popped automatically, fixed size (8 MiB main thread, Java <code>-Xss</code>) — overflow ⇒ SIGSEGV or StackOverflowError. <b>Heap</b>: <code>malloc</code>/<code>new</code>, lives until free or GC, grows by brk/mmap.', 'Why does deep recursion crash but a big array on the heap not? — the stack limit.', '3.A · ▶ osg3 heap-stack.c: malloc(100000) moved the break up 135 168 B; malloc(1000000) used mmap'],
  ]) },

  /* 12 */
  { t: 'Q29–Q32 · Memory on a real server', body: qs([
    [29, 'VSZ vs RSS vs PSS?', '<b>VSZ</b>: all mapped virtual memory, touched or not. <b>RSS</b>: pages in RAM now, shared ones counted in full by each process. <b>PSS</b>: shared pages divided among the sharers, so PSS values add up.', 'Why does the JVM have a huge VSZ? — it reserves the maximum heap and code cache up front.', 'CS.5 s4–6 · ▶ cs5: idle node VSZ 473 MiB, RSS 41 MiB; 3 forked workers RSS sum 362, PSS sum 120'],
    [30, 'What is overcommit, and the OOM killer?', 'Linux grants more address space than RAM + swap, betting most is never touched. When the bet fails at a page fault, the <b>OOM killer</b> picks the highest score (RSS + swap + adj) and sends <b>SIGKILL</b> ⇒ exit 137, no log.', 'How do you protect the database? — negative oom_score_adj and limits on everything else.', 'CS.5 s10–13 · CS.6 s14 · ▶ cs5 overcommit.c: 100 GiB promised on 7.7 GiB · capstone step 3: 137'],
    [31, 'A memory leak in Java or Node — how do you find it?', 'Plot heap used <b>after GC</b> against traffic: a line that keeps rising is a leak, a curve that flattens is a cache warming up. Then a class histogram or heap-snapshot diff names the type whose count grows with requests.', 'Off-heap? — Buffers and direct memory: watch RSS and arrayBuffers, not only the heap.', 'CS.5 s20–21 · ▶ cs5 ro-ri-node.js: +1.1 MB per 1000 requests · capstone: 1 MiB per query'],
    [32, 'Swap on a server: good or bad?', 'A little swap gives the kernel somewhere to put cold anonymous pages; heavy swapping means latency. Databases want low <code>vm.swappiness</code>; many container platforms run without swap so limits are exact.', 'Docker --memory alone — how much swap does the container get? — the same amount again (CS.6).', 'CS.5 s9 · CS.6 s17 · ▶ cs5 swap.sh: 1 GiB swap file, swappiness 60, read-only inside a container'],
  ]) },

  /* 13 */
  { t: 'Q33–Q36 · File descriptors, inodes, links, fsync', body: qs([
    [33, 'What is a file descriptor? “Too many open files”?', 'A small integer indexing the process’s <b>fd table</b>, pointing to an open file, pipe or <b>socket</b>. The limit is <code>ulimit -n</code> (RLIMIT_NOFILE); past it every <code>open</code>/<code>accept</code> fails with <b>EMFILE</b>.', 'How do you tell a leak from a busy server? — count fds over time: a straight line = leak.', 'CS.2 s4–5, 14–17 · ▶ capstone step 1: 108 × /tmp/audit.log, EMFILE at 128'],
    [34, 'What is an inode?', 'The on-disk record of a file: type, permissions, owner, size, timestamps, <b>link count</b> and block pointers — everything <b>except the name</b>. A directory is a table of name → inode number.', 'Can a disk be “full” with free space? — yes, out of inodes: <code>df -i</code> (millions of tiny files).', '4.A · 10.B (ext2) · ▶ osg4 lien-ket-cung-mem.sh: stat shows the inode number and link count'],
    [35, 'Hard link vs soft link?', 'A <b>hard link</b> is a second name for the same inode (link count 2; the data lives until the last name is gone; same file system only). A <b>symbolic link</b> is a small file holding a path — it can cross file systems and can dangle.', 'Deleted a 50 MB log but the disk is still full? — a process still has it open: lsof +L1.', '4.A · ▶ osg4: rm original → hard link still reads, soft link “No such file” · osg10 unlink-giu-cho.sh'],
    [36, 'Page cache and fsync — why does a database need a WAL?', '<code>write()</code> only copies into the <b>page cache</b>; the kernel flushes later. <code>fsync()</code> waits until the device has it. A database writes and fsyncs a sequential <b>WAL</b> at commit, so a crash can be replayed.', 'What does synchronous_commit = off trade? — speed for losing the last few commits on a crash.', 'CS.2 s19–21 · ▶ cs2 fsync-do.c: write 2.2 µs vs write + fsync 877 µs per 4 KiB record'],
  ]) },

  /* 14 */
  { t: 'Q37–Q40 · I/O, IPC, containers, “it is slow”', body: qs([
    [37, 'Blocking, non-blocking, async — select vs poll vs epoll?', 'Blocking: the thread sleeps in <code>read</code>. Non-blocking + multiplexing: one thread asks which fds are ready. <code>select</code> scans a 1024-bit set, <code>poll</code> scans a list, <b>epoll</b> registers once and returns only the ready ones.', 'Level vs edge-triggered? — edge reports a change once: read until EAGAIN or lose data.', 'CS.4 s5–16 · ▶ cs4 select-1024.c: fd 1500 aborts select · echo server: 10 000 connections, one thread'],
    [38, 'Which IPC mechanisms do you know?', 'Pipes and FIFOs (byte streams), <b>Unix domain sockets</b> (local, fast, can pass fds), TCP sockets, <b>shared memory</b> (fastest, needs your own locking), message queues, signals (only a number). Files and mmap too.', 'How does psql reach a local PostgreSQL without -h? — a Unix socket (Debian: /var/run/postgresql).', '2.B · CS.2 s9–12 · CS.5 s22 · ▶ cs5 mmap-chia-se.c: the child’s write is seen through MAP_SHARED'],
    [39, 'Container vs VM — what is a container?', 'A VM runs its own kernel on virtual hardware. A container is an ordinary process on the <b>host kernel</b>, wrapped in <b>namespaces</b> (what it sees: PID, net, mount…) and <b>cgroups</b> (what it may use: memory, CPU, pids).', 'Why is a kernel exploit worse in a container than in a VM? — the kernel is shared.', 'N1.A · CS.6 · ▶ cs6: one process, two PIDs (13 outside, 1 inside); pids.max 20 stops a fork bomb'],
    [40, '“The server is slow.” Where do you start?', 'Method, not guesses: <b>USE</b> — utilization, saturation, errors — for CPU, memory, disk, network. The 60-second list: <code>uptime</code>, <code>dmesg</code>, <code>vmstat 1</code>, <code>pidstat</code>, <code>iostat -xz</code>, <code>free -m</code>, <code>ss</code>; then strace/profile the process.', 'Load is 13 on 10 CPUs but the CPUs are half idle — why? — load counts D-state tasks too.', 'CS.7 s5, 16–17 · ▶ cs7 kiem-60s.sh · the capstone that follows is this method, step by step'],
  ]) },

  /* 15 */
  { t: 'Capstone: orders-api is sick — three tickets', giua: true, body: `
${capArch()}
${two(`<ul style="font-size:19px;margin:0">
<li>A small Node 22 service, <code class="i">gen/code/cs8/_orders.js</code>, with <b>three planted bugs</b>; <code class="i">FIX=fd,cpu,mem</code> switches each fix on</li>
<li>The client <code class="i">_khach.js</code> plays the users: orders, reports, searches, health checks</li>
</ul>`, box('Rule of the game', 'Diagnose from the <b>outside</b>, as on a production server you did not write: measure first, form one hypothesis, prove it, then open the code. Every output on the next slides is one real run.', 'lam'))}` },

  /* 16 */
  { t: 'The method: one hypothesis, one measurement', giua: true, body: `
${flow([{ t: 'Symptom', s: 'with a number', mau: RD }, { t: 'Hypothesis', s: 'one resource', mau: OR }, { t: 'Measure', s: '/proc, strace, exit', mau: BL }, { t: 'Fix', s: 'the smallest change', mau: PU }, { t: 'Measure again', s: 'same load, same limits', mau: GR }], { h: 130, fs: 19 })}
<table class="t" style="font-size:18px">
<tr><th style="width:36%">Tool</th><th>Question it answers</th><th style="width:15%">Taught in</th></tr>
<tr><td><code class="i">ls /proc/PID/fd | wc -l</code> · <code class="i">/proc/PID/limits</code></td><td>how many descriptors, against which limit?</td><td>CS.2</td></tr>
<tr><td><code class="i">strace -e trace=… -p PID</code> · <code class="i">strace -c</code></td><td>which system calls, how many, which never comes?</td><td>CS.7</td></tr>
<tr><td><code class="i">/proc/PID/stat</code> fields 14–15 · <code class="i">/proc/PID/task/*/stat</code></td><td>computing in user mode, or in the kernel? which thread?</td><td>CS.7, CS.3</td></tr>
<tr><td>a latency probe on <code class="i">/health</code></td><td>is the event loop free?</td><td>CS.3</td></tr>
<tr><td><code class="i">VmRSS</code> · <code class="i">memory.max</code> · <code class="i">memory.events</code></td><td>is memory growing, and who killed the process?</td><td>CS.5, CS.6</td></tr>
<tr><td>the exit code</td><td>137 = SIGKILL, 134 = abort, 143 = SIGTERM, 1 = an error</td><td>CS.1</td></tr>
</table>` },

  /* 17 */
  { t: 'Step 1 · Ticket 1: count the descriptors', giua: true, body: two(
    `${term(`$ node _orders.js & sleep 0.6
orders-api pid 9 on 127.0.0.1:8080, fixes: none
$ P=$(pgrep -x node); ls /proc/$P/fd | wc -l
19
$ node _khach.js orders 50
50 x GET /orders: 50 x 200 · last error: -
$ ls /proc/$P/fd | wc -l
69
$ node _khach.js orders 100 52
100 x GET /orders: 56 x 200, 44 x 500 · last error: 500 EMFILE
$ ls /proc/$P/fd | wc -l
127
$ grep -E 'Limit|open files' /proc/$P/limits
Limit                     Soft Limit           Hard Limit
Max open files            128                  128`, { title: 'lab1-fd.sh · --ulimit nofile=128:128 · 🎲 one real run (Units column cut)', hl: [8, 10, 12, 15] })}
${zm(term(`$ ls -l /proc/$P/fd | awk '{print $NF}' | sort | uniq -c | sort -rn | head -3
    108 /tmp/audit.log
      3 anon_inode:[eventpoll]
      3 anon_inode:[eventfd]`, { title: 'which file? group the fd targets', hl: [2] }), 0.93)}`,
    `<ul style="font-size:20px">
<li><b>19</b> fds after start-up; <b>+50 requests → +50 fds</b>. A server that only answers would come back to 19</li>
<li>The count climbs to <b>127</b> and stops just under the limit of <b>128</b>: from then on <code class="i">open()</code> fails with <b>EMFILE</b> → <b>500</b></li>
<li><b>108</b> = 50 + 2 + 56 successful orders: one <code class="i">audit.log</code> descriptor per order</li>
</ul>
${box('Hypothesis', 'A descriptor is <b>opened per request and never closed</b>. Next: catch it in the act with strace.', '')}`, 'r64') },

  /* 18 */
  { t: 'Step 1 · Proof with strace, the fix, the re-run', giua: true, body: `
${term(`$ (sleep 0.5; node _khach.js orders 2 50 > /dev/null) & timeout 2 strace -e trace=openat,close -p $P 2>&1
strace: Process 9 attached
openat(AT_FDCWD, "/tmp/audit.log", O_WRONLY|O_CREAT|O_APPEND|O_CLOEXEC, 0666) = 70
close(19)                               = 0
openat(AT_FDCWD, "/tmp/audit.log", O_WRONLY|O_CREAT|O_APPEND|O_CLOEXEC, 0666) = 71
close(19)                               = 0
strace: Process 9 detached`, { title: 'lab1-fd.sh (continued) · --cap-add=SYS_PTRACE · fd 70 and 71 are opened, only fd 19 (the client socket) is closed', hl: [3, 5] })}
${two(`${zm(js(`// FIX 1: open the log ONCE, at start-up
const LOG = fixed('fd') ? fs.openSync('/tmp/audit.log', 'a') : null;
function audit(line) {
  // BUG 1: a new fd on every request... and nobody ever closes it
  const fd = LOG ?? fs.openSync('/tmp/audit.log', 'a');
  fs.writeSync(fd, \`\${new Date().toISOString()} \${line}\\n\`);
}`, { hl: [2, 5] }), 0.92)}
${box('Honest note', 'Through all of this <code class="i">GET /health</code> answered <b>200 in 4.3 ms</b> — it opens no file. A liveness probe that does not touch the broken path never restarts the service.', 'do2')}`,
    term(`$ FIX=fd node _orders.js & sleep 0.6
$ P=$(pgrep -x node); ls /proc/$P/fd | wc -l
20
$ node _khach.js orders 300
300 x GET /orders: 300 x 200 · last error: -
$ ls /proc/$P/fd | wc -l
20
$ ls -l /proc/$P/fd | … | grep audit
      1 /tmp/audit.log`, { title: 'lab1-sua.sh · same limit, 3× the load · 🎲', hl: [5, 7, 9] }), 'r64')}` },

  /* 19 */
  { t: 'Step 2 · Ticket 2: everybody waits for one report', giua: true, body: `
${lagChart()}
${two(term(`$ node _khach.js lag
  312 ms  -> GET /report
  911 ms  <- /report done in 601 ms
  912 ms  /health took  595 ms   <-- STUCK
  912 ms  /health took  494 ms   <-- STUCK
  …
  915 ms  /health took   93 ms
/health: median 5 ms, worst 595 ms`, { title: 'lab2-loop.sh · /health every 100 ms, one /report at 300 ms · 🎲 (rows cut)', hl: [4, 8] }),
    `<ul style="font-size:19px">
<li>Not one slow endpoint — <b>every</b> request stalls while the report runs, then they all finish at <b>911 ms</b> together</li>
<li>That shape means one thing in Node: the <b>event loop</b> is busy (CS.3 slide 18)</li>
<li>Hypothesis: <b>CPU work on the main thread</b>. Waiting (disk, lock, DB) would not freeze the loop</li>
</ul>`, 'r46')}` },

  /* 20 */
  { t: 'Step 2 · User CPU, almost no syscalls — then the fix', giua: true, body: `
${two(zm(term(`$ awk '{printf "user %.2f s, kernel %.2f s\\n", $14/100, $15/100}' /proc/$P/stat
user 0.64 s, kernel 0.00 s
$ node _khach.js report 4
4 x /report in parallel: 200 200 200 200 · each 599 / 1180 / 1752 / 2313 ms
$ awk '{printf …}' /proc/$P/stat
user 2.95 s, kernel 0.00 s
$ (… report 4 …) & timeout 3 strace -c -p $P 2>&1 | grep …
% time     seconds  usecs/call     calls    errors syscall
 71.27    0.000950          22        42           futex
 15.38    0.000205          13        15           epoll_pwait
100.00    0.001333          11       114           total
$ cat /proc/$P/task/*/stat | awk '$14 > 0 {…}' | sort -k2 -n
tid 9    (node)           user 5.24 s`, { title: 'lab2-loop.sh (continued) · 🎲 (strace rows cut)', hl: [4, 6, 11, 13] }), 0.86),
    `<ul style="font-size:19px">
<li>4 reports: user time <b>+2.31 s</b>, kernel <b>0.00</b> — the process is <b>computing</b>, one report after another (0.6 / 1.2 / 1.8 / 2.3 s)</li>
<li><code class="i">strace -c</code> for 3 s: only <b>114</b> calls, <b>1.3 ms</b> in the kernel — the main thread never leaves user code</li>
<li>Only <b>one thread</b> (tid 9, the event loop) has CPU time</li>
</ul>`, 'r64')}
${two(zm(term(`$ FIX=cpu node _orders.js & sleep 0.6
$ node _khach.js lag     (rows cut)
/health: median 3 ms, worst 11 ms
$ node _khach.js report 4
4 x /report in parallel: 200 200 200 200 · each 592 / 583 / 582 / 594 ms · all done after 596 ms
$ cat /proc/$(pgrep -x node)/task/*/stat | awk '$14 > 0 {…}' | sort -k2 -n
tid 9    (node)           user 0.04 s
tid 26   (libuv-worker)   user 1.18 s
tid 27   (libuv-worker)   user 0.58 s
tid 28   (libuv-worker)   user 0.58 s
tid 29   (libuv-worker)   user 0.57 s`, { title: 'lab2-sua.sh · 🎲 — same work, now on the 4 libuv pool threads', hl: [3, 5, 7] }), 0.76),
    zm(js(`// FIX 2: crypto.pbkdf2 runs on the pool
if (fixed('cpu'))
  return crypto.pbkdf2(body, 'k', 4000000,
    32, 'sha256',
    (e, k) => done(k.toString('hex')));
// BUG 2: pbkdf2Sync runs on the event loop
done(crypto.pbkdf2Sync(body, 'k', 4000000,
  32, 'sha256').toString('hex'));`, { hl: [3, 7] }), 0.86), 'r64')}` },

  /* 21 */
  { t: 'Step 3 · Ticket 3: memory climbs, then exit 137', giua: true, body: `
${rssChart()}
${two(zm(term(`$ ( node _orders.js; echo "orders-api exited, code $?" ) &
$ P=$(pgrep -x node); cat /sys/fs/cgroup/memory.max
268435456
$ node _khach.js search 50; grep VmRSS /proc/$P/status
VmRSS:	  106560 kB
$ node _khach.js mem
GET /debug/mem -> {"rss":154,"heapUsed":5,"arrayBuffers":100,"cacheEntries":100}
$ node _khach.js search 300 100; sleep 0.5
bash:    10 Killed                  node _orders.js
orders-api exited, code 137
query 231: failed with ECONNRESET
$ grep -E '^(max|oom|oom_kill) ' /sys/fs/cgroup/memory.events
max 131
oom 3
oom_kill 1`, { title: 'lab3-mem.sh · --memory=256m --memory-swap=256m · 🎲 (two steps merged)', hl: [7, 10, 15] }), 0.84),
    `<ul style="font-size:18px">
<li>RSS 46 → 104 → 155 MiB: <b>+1.08 MiB per distinct query</b>, never coming down</li>
<li><code class="i">heapUsed</code> is only <b>5 MB</b>: the memory is in <b>arrayBuffers</b> — Buffers live <b>outside</b> the V8 heap — and <code class="i">cacheEntries</code> = queries sent</li>
<li>So no “heap out of memory” (134): the <b>cgroup</b> OOM killer sends SIGKILL → <b>137</b>, <code class="i">oom_kill 1</code>, the client sees a reset</li>
</ul>`, 'r64')}` },

  /* 22 */
  { t: 'Step 3 · Bound the cache, measure again', giua: true, body: two(
    `${zm(js(`const cache = new Map();          // query -> 1 MiB of results
function search(q) {
  if (cache.has(q)) { /* move to the end = most recent */ }
  const result = Buffer.alloc(1024 * 1024, q);  // BUG 3: kept forever
  cache.set(q, result);
  if (fixed('mem') && cache.size > 20)           // FIX 3: LRU of 20
    cache.delete(cache.keys().next().value);     // drop the oldest
  return result;
}`, { hl: [4, 6, 7] }), 0.84)}
${zm(term(`$ ( FIX=mem node _orders.js; echo "orders-api exited, code $?" ) &
$ node _khach.js search 200
VmRSS:	  146064 kB
{"rss":142,"heapUsed":5,"arrayBuffers":38,"cacheEntries":20}
$ node _khach.js search 200 200
VmRSS:	  146696 kB
{"rss":143,"heapUsed":5,"arrayBuffers":56,"cacheEntries":20}
$ node _khach.js search 200 400
VmRSS:	  147740 kB
{"rss":144,"heapUsed":4,"arrayBuffers":69,"cacheEntries":20}
$ kill $P; sleep 0.5
orders-api exited, code 0
oom_kill 0`, { title: 'lab3-sua.sh · 256 MiB · 600 queries (the crash came at 231) · 🎲', hl: [3, 6, 9, 12] }), 0.84)}`,
    `<ul style="font-size:19px">
<li><b>600</b> distinct queries: RSS <b>flat</b> at 143–144 MiB, <code class="i">cacheEntries</code> stays <b>20</b>, a clean SIGTERM exit <b>0</b>, <code class="i">oom_kill 0</code></li>
<li>A cache needs a <b>bound</b>: LRU size, TTL, or both (<code class="i">lru-cache</code>, Caffeine in Java)</li>
</ul>
${box('Honest note — flat, but not small', 'Only 20 MiB is live, yet RSS sits near 143 MiB. Evicted Buffers are freed only at the next V8 GC (<code class="i">arrayBuffers</code> 38 → 56 → 69 MiB here), and memory malloc gets back is not always returned to the kernel (CS.5 slide 5). The proof is the <b>flat line under 3× the load</b>, not a small number.', '')}`, '') },

  /* 23 */
  { t: 'Acceptance test: all fixes, all limits, all load', giua: true, body: two(
    zm(term(`$ ( FIX=all node _orders.js; echo "orders-api exited, code $?" ) & sleep 0.6
orders-api pid 11 on 127.0.0.1:8080, fixes: all
$ P=$(pgrep -x node)
$ node _khach.js orders 500
500 x GET /orders: 500 x 200 · last error: -
$ ls /proc/$P/fd | wc -l
20
$ node _khach.js lag | tail -1
/health: median 1 ms, worst 5 ms
$ node _khach.js search 500
500 distinct searches: all 200
$ grep VmRSS /proc/$P/status
VmRSS:	  147624 kB
$ kill $P; sleep 0.5
orders-api exited, code 0
$ grep -E '^(oom|oom_kill) ' /sys/fs/cgroup/memory.events
oom 0
oom_kill 0`, { title: 'lab4-nghiem-thu.sh · nofile 128 · 256 MiB · no swap · 🎲 one real run', hl: [5, 7, 9, 11, 15, 18] }), 0.8),
    `<table class="t" style="font-size:17.5px">
<tr><th>Measure</th><th>Broken</th><th>Fixed</th></tr>
<tr><td>fds after load</td><td class="do">127 / 128, EMFILE</td><td class="xanh">20 after 500 orders</td></tr>
<tr><td>orders OK</td><td>56 of the last 100</td><td class="xanh">500 of 500</td></tr>
<tr><td>/health worst while a report runs</td><td class="do">595 ms</td><td class="xanh">5–11 ms</td></tr>
<tr><td>4 parallel reports</td><td>2313 ms (serial)</td><td class="xanh">596 ms</td></tr>
<tr><td>distinct searches survived</td><td class="do">230, then 137</td><td class="xanh">500 and 600, RSS flat</td></tr>
<tr><td>how it ended</td><td class="do">SIGKILL, oom_kill 1</td><td class="xanh">SIGTERM → exit 0</td></tr>
</table>
${box('Why one combined run', 'Bugs hide each other: with all three present, orders fail before searches can grow memory. The acceptance test runs <b>every</b> load under <b>every</b> limit together.', 'lam')}`) },

  /* 24 */
  { t: 'Rubric: grade your own capstone (100 points)', giua: true, body: `
<table class="t" style="font-size:17px">
<tr><th style="width:4%">#</th><th style="width:24%">Criterion</th><th style="width:6%">Pts</th><th>Full marks when you…</th></tr>
<tr><td>1</td><td>Reproduce each ticket with a number</td><td>15</td><td>show 500 EMFILE, a /health stall in ms, and exit 137 — from your own run</td></tr>
<tr><td>2</td><td>Step 1 — fd leak</td><td>15</td><td>show fds growing 1 per request, name <code class="i">/tmp/audit.log</code>, prove with <code class="i">strace</code> that it is never closed</td></tr>
<tr><td>3</td><td>Step 2 — blocked loop</td><td>15</td><td>show user CPU rising with kernel ≈ 0, few syscalls, one busy thread; name <code class="i">pbkdf2Sync</code></td></tr>
<tr><td>4</td><td>Step 3 — memory</td><td>15</td><td>give the slope (MiB per query), show heap vs arrayBuffers, read <code class="i">memory.events</code> and the exit code</td></tr>
<tr><td>5</td><td>Minimal, correct fixes</td><td>15</td><td>open once · async/pool or worker · bounded LRU — no “raise the limit” as the fix</td></tr>
<tr><td>6</td><td>Measure again</td><td>15</td><td>same load and limits, at least 3× the load that broke it; acceptance run with all limits</td></tr>
<tr><td>7</td><td>Write-up</td><td>10</td><td>per bug: symptom · evidence · root cause · fix · the alert that would catch it next time</td></tr>
</table>
<p style="margin:0;font-size:19px"><b>90+</b> ready for an on-call shift · <b>70–89</b> redo the steps you lost points on · <b>&lt; 70</b> reread CS.2, CS.3, CS.5, then redo the lab</p>` },

  /* 25 */
  { t: '🧭 On a real server: where these three bugs come from', giua: true, body: `
<table class="t" style="font-size:18px">
<tr><th style="width:15%">Bug</th><th style="width:43%">How it reaches production</th><th>The alarm that catches it early</th></tr>
<tr><td><b>fd leak</b></td><td>a cleanup only on the happy path; a DB connection or file not released on an error (CS.2 slide 16: one lost fd per failed request)</td><td><code class="i">process_open_fds / process_max_fds &gt; 0.8</code> (prom-client exports both)</td></tr>
<tr><td><b>blocked loop</b></td><td>sync crypto, big <code class="i">JSON.parse</code>, a slow regex, pure-JS bcrypt — this website’s own login runs <code class="i">bcryptjs</code> (CS.3 slide 24: stalls up to 0.86 s)</td><td>event-loop delay p99 (<code class="i">monitorEventLoopDelay</code>) and p99 latency of <b>all</b> routes together</td></tr>
<tr><td><b>unbounded cache</b></td><td>a <code class="i">Map</code> used as a cache, per-user state, queues with no limit</td><td>RSS trend, <code class="i">memory.events oom_kill</code>, restarts with exit 137</td></tr>
</table>
${two(box('This repo, 06–07 Jul 2026', 'Two builds in parallel on a 6 GB VPS ⇒ <code class="i">next build</code> killed with <b>137</b>. The fix was sequential builds (CS.5 slide 25, CS.6 slide 25). Same reading as step 3: exit code first, then <code class="i">memory.events</code>.', 'xanh'),
    box('The health-check trap', 'Step 1 showed it: <code class="i">/health</code> stayed 200 while orders failed. Make readiness touch the critical path (a cheap DB query, a temp-file write) — but keep liveness simple, or a slow database restarts healthy pods.', 'do2'))}` },

  /* 26 */
  { t: '🎤 On the day: phrases that lose, phrases that win', giua: true, body: vsd(`<ul style="font-size:19.5px">
<li>“A thread is a lightweight process.” — and nothing more</li>
<li>“To remove a zombie, kill -9 it.”</li>
<li>“malloc returns NULL when memory runs out.”</li>
<li>“epoll is faster than select.”</li>
<li>“Free memory is low, the server needs RAM.”</li>
<li>“Deadlock means the system is slow.”</li>
<li>“I would increase ulimit.” (as the fix)</li>
<li>“async/await makes it run in another thread.”</li>
</ul>
<p style="margin:16px 4px 0;font-size:18px;line-height:1.4;color:#7a2a1d">Each line is half-true in a textbook and wrong on a real server. The answers on the right do one thing differently: they name a <b>mechanism</b> or a <b>measurement</b> — and that is exactly what this course made you run.</p>`, `<ul style="font-size:19.5px">
<li>“Threads share the address space and fds; each has its own stack. On Linux both are clone() tasks.”</li>
<li>“It is already dead; the parent must wait() — or exit so PID 1 reaps it.”</li>
<li>“With overcommit it rarely does; the bill is an OOM kill at a page fault.”</li>
<li>“epoll costs O(ready fds) per call; select scans all, and stops at fd 1024.”</li>
<li>“I look at available, not free; cache is reclaimable.”</li>
<li>“Blocked forever, zero CPU; I would take a thread dump.”</li>
<li>“First find the leak: fd count over time, strace; then size the limit.”</li>
<li>“await only yields; CPU work still runs on the event loop.”</li>
</ul>`, '✗ Sounds memorised', '✓ Sounds like you ran it') },

  /* 27 */
  { t: 'Check yourself', giua: true, body: `
<ol style="font-size:22px">
<li>A Node API returns <b>500 EMFILE</b> on some routes while <code class="i">/health</code> is 200. Which two commands confirm the cause, and what do you expect to see?</li>
<li>Every route’s p99 jumps to 600 ms at the same moments. The process shows user CPU rising, kernel CPU ≈ 0, and <code class="i">strace -c</code> counts ~100 calls in 3 s. Diagnosis?</li>
<li>A container exits with <b>137</b> every few hours; <code class="i">heapUsed</code> is flat at 5 MB. Where is the memory, and how do you prove the kill came from the cgroup?</li>
</ol>
${box('Answers', '1) <code class="i">ls /proc/PID/fd | wc -l</code> over time (rising 1 per request, up to the limit in <code class="i">/proc/PID/limits</code>) and <code class="i">ls -l /proc/PID/fd | … | uniq -c</code> to name the file — or <code class="i">strace -e openat,close -p</code> to see opens without closes. 2) The event loop is blocked by CPU work on the main thread (a sync call such as pbkdf2Sync); move it to the libuv pool or a worker. 3) Outside the V8 heap — Buffers / <code class="i">arrayBuffers</code>, native memory; <code class="i">memory.events</code> shows <code class="i">oom_kill</code> ≥ 1 and the exit code is 128 + 9.', 'xanh')}` },

  /* 28 */
  { t: 'Summary — and the end of the ⭐ section', giua: true, body: `
<div style="font-size:24px">
<ul>
<li>Answer in three layers: <b>what</b> → <b>how</b> → <b>a number you measured</b>; prepare the <b>follow-up</b></li>
<li>40 questions, 10 topics: processes · syscalls · scheduling · locks · deadlock · memory · files · I/O · IPC · containers</li>
<li>Diagnose from the outside: <b>fd count</b> + strace for leaks, <b>user vs kernel CPU</b> + a latency probe for a blocked loop, <b>RSS + memory.events + exit code</b> for OOM</li>
<li>Fix the cause, not the limit — then <b>measure again</b> under the same limits</li>
</ul></div>
${box('You have finished “The OS in real backend work”', 'CS.1 processes · CS.2 file descriptors · CS.3 threads vs event loop · CS.4 epoll · CS.5 memory · CS.6 containers · CS.7 performance tools · CS.8 interviews and the capstone. Next: the 🎯 Final Exam section of OSG202 — and keep these tools for your first on-call shift.', 'lam')}` },
]);
