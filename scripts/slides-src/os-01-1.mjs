/**
 * os-01-1 — khoá "Operating Systems for Developers", bài 1.1 "What a process is" (deck mẫu Phase A, 28/10/2026).
 * Khuôn chuẩn _pg-chung.mjs (slide EN, dáng FU, logo CuongThai.com). Output = CHẠY THẬT trong ảnh os-lab
 * (content/courses/operating-systems-for-developers/lab/out/c11-proc.out.txt). Nhúng vào bài bằng
 * content/courses/operating-systems-for-developers/giang/os-01-1.mjs (walk()).
 */
import { lamDeck, sql, psql, sh, two as two0, box, cards, kw } from './_pg-chung.mjs';

export const deck = { key: 'os-01-1', code: 'OS 1.1', title: 'What a process is', sub: 'Operating Systems · Chapter 1' };

const term = (t, o = {}) => sh(t, { sm: true, ...o });
const out = (t, o = {}) => psql(t, { title: 'output', sm: true, ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const tw = (s, fs) => Math.ceil(String(s).length * 0.602 * fs);
const MK = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', GY = '#8a8a8a';

/* Slide 3: chương trình (file) → nhiều tiến trình */
const progProc = () => {
  let s = `<svg viewBox="0 0 1110 210" width="1110" height="210" font-family="Arial"><defs>${MK('os-a', BR)}</defs>`;
  s += R(10, 60, 260, 92, '#fff7ef', OR, { dash: 1 });
  s += T(140, 96, 'PROGRAM (a file)', 20, { a: 'middle', w: 800, f: BR });
  s += T(140, 124, '/usr/local/bin/node', 16, { a: 'middle', m: 1 });
  s += T(140, 176, 'on disk · does nothing', 15, { a: 'middle', f: '#777' });
  [['PID 100', 'bash', '1 thread · 5 MB'], ['PID 10', 'node server.js', '7 threads · 49 MB'], ['PID 20', 'ps aux', '1 thread']].forEach(([pid, cmd, d], i) => {
    const y = 8 + i * 66;
    s += `<line x1="272" y1="106" x2="428" y2="${y + 28}" stroke="${BR}" stroke-width="3" marker-end="url(#os-a)"/>`;
    s += R(440, y, 640, 56, '#eef4fa', BL);
    s += T(460, y + 35, 'PROCESS · ' + pid, 20, { w: 800, f: BL });
    s += T(690, y + 35, cmd, 17, { m: 1 });
    s += T(1065, y + 35, d, 15, { a: 'end', f: '#555' });
  });
  return s + '</svg>';
};

/* Slide 8: RSS vs VSZ */
const rssVsz = () => {
  let s = `<svg viewBox="0 0 1110 320" width="1110" height="320" font-family="Arial">`;
  // VSZ bar (huge, mostly unused), RSS bar (real)
  s += T(20, 46, 'VmSize (VSZ) = everything mapped — 486 MB', 24, { w: 800, f: GY });
  s += R(20, 64, 1060, 64, '#f0f0f0', GY, { rx: 8 });
  s += R(20, 64, 132, 64, BL + '33', BL, { rx: 8 });
  s += T(86, 102, 'real', 18, { a: 'middle', w: 700, f: BL });
  s += T(600, 102, 'reserved / mapped but never touched — misleading', 18, { a: 'middle', f: '#888' });
  s += T(20, 186, 'VmRSS = physical RAM actually used — 49 MB', 24, { w: 800, f: GR });
  s += R(20, 204, 132, 64, GR + '22', GR, { rx: 8 });
  s += T(86, 242, '49 MB', 18, { a: 'middle', w: 700, f: GR });
  s += T(176, 242, '← this is the number you watch', 22, { f: GR, w: 700 });
  s += T(20, 304, 'ps shows both; alerting on VSZ pages the on-call for nothing — our server: 486 MB VSZ, 49 MB real.', 20, { f: '#555' });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 1 — Processes', bai: '1.1',
}, [
  { cover: true, t: 'What a process is', sub: 'Address space · registers · open files · a PID<br>— read a live one through /proc' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The difference between a <b>program</b> (a file) and a <b>process</b> (that file running)</li>
<li>What the kernel keeps for every process — the <b>task_struct</b></li>
<li>Read any live process through <code class="i">/proc/&lt;pid&gt;</code>: status, maps, fds, limits</li>
<li>Why <b>RSS</b> is the real memory use and <b>VSZ</b> almost always misleads</li>
<li>Where this feeds the rest of the course: threads (Ch.3), memory (Ch.7), fds (Ch.10)</li>
</ul>
${box('Measured, not claimed', 'Every output below was produced by a real run in the course lab image: Ubuntu 26.04, kernel 7.0, Node 22.23, inspecting a tiny Node web server.', 'lam')}` },

  { t: 'A program is a file; a process is it running', giua: true, body: `
${progProc()}
${cards([
    ['Program', 'Bytes on disk. One file can be started many times — each start is a new process.'],
    ['Process', 'A <b>running instance</b>: its own virtual memory, open files, identity, state, and a number — the <b>PID</b>.'],
    ['Thread', 'A worker <b>inside</b> a process; threads share its memory. Node shows 7 even for “single-threaded” JS.'],
  ])}
<p style="margin:0;font-size:20px">${kw('PID', 'process ID')} ${kw('PPID', 'parent’s PID')} ${kw('task_struct', 'the kernel’s record of a process')}</p>` },

  { t: 'The kernel keeps a record for each process', body: `
<ul>
<li><b>PID / PPID</b> — its number and its parent’s</li>
<li><b>Address space</b> — code, data, heap, stack, mapped libraries (Chapter 7)</li>
<li><b>Registers</b> — program counter + stack pointer, saved whenever it is not running</li>
<li><b>File descriptor table</b> — open files, sockets, pipes, by small integers (Chapter 10)</li>
<li><b>Identity</b> — the user/group it runs as (permissions, Chapter 9)</li>
<li><b>State, cwd, limits, accounting</b> — how much CPU it has used</li>
</ul>
${box('Where to read it', 'Linux exposes nearly all of it as files under <code>/proc/&lt;pid&gt;</code>. The next slides open a real one.', 'xanh')}` },

  { t: 'ps: the one-line summary', body: `
${term(`$ ps -o pid,ppid,stat,nlwp,rss,vsz,etime,cmd -p 10
    PID    PPID STAT NLWP   RSS    VSZ     ELAPSED CMD
     10       7 Sl      7 49324 486424       00:01 node server.js`)}
${cards([
    ['STAT = Sl', 'S = sleeping (waiting for a connection); l = multi-threaded.'],
    ['NLWP = 7', 'Seven threads — Node’s libuv pool (Chapter 3), even for “single-threaded” JS.'],
    ['RSS 49 MB / VSZ 486 MB', 'Real RAM vs everything mapped. Slide 8 explains why they differ so much.'],
  ])}` },

  { t: '/proc/&lt;pid&gt;/status: the kernel’s own view', body: two(
    term(`$ grep -E 'State|PPid|VmRSS|VmSize|ctxt' /proc/10/status
Name:	node
State:	S (sleeping)
Pid:	10
PPid:	7
VmSize:	  486424 kB
VmRSS:	   49324 kB
Threads:	7
voluntary_ctxt_switches:	12
nonvoluntary_ctxt_switches:	6`),
    `<ul style="font-size:20px">
<li>Every field of <b>task_struct</b> that matters, as plain text</li>
<li><b>VmRSS</b> is the real memory; <b>VmSize</b> is everything mapped</li>
<li><b>Threads</b> matches NLWP from ps</li>
<li>The <b>ctxt_switches</b> counters feed Chapter 3 — how often the scheduler moved it on and off a CPU</li>
</ul>`) },

  { t: '/proc/&lt;pid&gt;/fd: the open-file table, live', body: two(
    term(`$ ls -l /proc/10/fd
0 -> /dev/null
1 -> /tmp/server.log
2 -> /tmp/server.log
3 -> anon_inode:[eventpoll]
...
18 -> socket:[441008]`),
    `<ul style="font-size:20px">
<li><b>fd 0/1/2</b> = stdin / stdout / stderr</li>
<li><b>eventpoll / eventfd</b> = how Node waits for I/O (epoll — Chapter 10)</li>
<li><b>fd 18</b> = the listening socket</li>
<li>The ceiling on this table is <code class="i">Max open files</code> in <code class="i">/proc/10/limits</code> — the “Too many open files” of Chapter 10</li>
</ul>`) },

  { t: 'RSS is the real memory; VSZ is almost always a lie', body: rssVsz() },

  { t: 'If you have done Linux & Bash Ch.5', to: true, giua: true, body: `
<ul>
<li>There you learned <code class="i">ps</code>, <code class="i">top</code> and signals as <b>commands</b> — how to look and how to kill</li>
<li>Here we are one level down: those commands are <b>pretty-printers for these /proc files</b></li>
<li>When you understand <b>task_struct</b>, the STAT letters and the fd table stop being trivia and become a <b>diagnosis</b></li>
</ul>
${box('Next', 'Lesson 1.2 — fork, exec, wait: how this process was born in the first place.', 'lam')}` },

  { t: 'Cheat sheet — look inside a process', body: `
<table class="t" style="font-size:21px">
<tr><th style="width:46%">You want to know…</th><th>Run</th></tr>
<tr><td>Real memory, threads, parent, state</td><td><code class="i">grep -E 'Vm|State|PPid|Threads' /proc/PID/status</code></td></tr>
<tr><td>One-line summary (real vs mapped mem)</td><td><code class="i">ps -o pid,ppid,stat,nlwp,rss,vsz -p PID</code></td></tr>
<tr><td>Open files / sockets / pipes</td><td><code class="i">ls -l /proc/PID/fd</code></td></tr>
<tr><td>Memory regions (heap, stack, libs)</td><td><code class="i">cat /proc/PID/maps</code></td></tr>
<tr><td>Limits (max open files, etc.)</td><td><code class="i">cat /proc/PID/limits</code></td></tr>
<tr><td>Command line it was started with</td><td><code class="i">tr '\\0' ' ' &lt; /proc/PID/cmdline</code></td></tr>
</table>
${box('Rule of thumb', 'RSS = what it really uses. VSZ = ignore it. ps and top are just views of /proc.', 'xanh')}` },
]);
