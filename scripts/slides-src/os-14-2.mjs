/**
 * os-14-2 — khoá "Operating Systems for Developers", bài 14.2 "Processes, threads and signals on three systems" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c142-mac|c142-lx.out.txt (chạy thật) qua grab(); số trên biểu đồ
 * cột được TÍNH từ chính các dòng output đó (trung bình 2 lượt). Mã đọc thẳng từ lab/code/ch14/spawn.c.
 * Phần Windows: theo tài liệu (Node docs, HandlerRoutine) — slide ghi "per the docs".
 * Giảng: content/courses/operating-systems-for-developers/giang/os-14-2.mjs.
 */
import fs from 'node:fs';
import { lamDeck, sh, sql, two, box, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-14-2', code: 'OS 14.2', title: 'Processes, threads and signals on three systems', sub: 'Operating Systems · Chapter 14 — Windows & macOS' };

const m = (pre, n = 1) => grab('c142-mac', pre, n);
const l = (pre, n = 1) => grab('c142-lx', pre, n);
const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 10}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.d ? ' stroke-dasharray="8 6"' : ''}/>`;
const A = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b85a2b" stroke-width="3" marker-end="url(#m1)"/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>${inner}</svg>`;
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const SRC = fs.readFileSync(new URL('../../content/courses/operating-systems-for-developers/lab/code/ch14/spawn.c', import.meta.url), 'utf8').split('\n');
const iMain = SRC.findIndex((x) => x.startsWith('int main'));
const lines = (a, b) => SRC.slice(iMain + a - 1, iMain + b).join('\n');

/* số đo: trung bình 2 lượt cho mỗi (MiB, cách) — đọc từ output thật */
function stats(text) {
  const acc = {};
  for (const ln of text.split('\n')) {
    const mm = ln.match(/touched\s+(\d+) MiB \| fork\+exec\s+([\d.]+) us \| vfork\+exec\s+([\d.]+) us \| posix_spawn\s+([\d.]+) us/);
    if (!mm) continue;
    const k = mm[1]; acc[k] ??= { f: [], v: [], p: [] };
    acc[k].f.push(+mm[2]); acc[k].v.push(+mm[3]); acc[k].p.push(+mm[4]);
  }
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  return Object.fromEntries(Object.entries(acc).map(([k, o]) => [k, { f: avg(o.f), v: avg(o.v), p: avg(o.p) }]));
}
const LX = stats(l('cat /proc/loadavg', 2));
const MC = stats(m('sysctl -n vm.loadavg', 2));
const ms = (us) => (us / 1000).toFixed(2);

/* biểu đồ cột: 4 nhóm (Linux 0/512, macOS 0/512) × 3 cách */
const chart = () => {
  const groups = [['Linux · parent 0 MiB', LX['0']], ['Linux · parent 512 MiB', LX['512']], ['macOS · parent 0 MiB', MC['0']], ['macOS · parent 512 MiB', MC['512']]];
  const max = 6000, H = 330, base = 380, bw = 64, cols = [['fork+exec', RD, 'f'], ['vfork+exec', OR, 'v'], ['posix_spawn', GR, 'p']];
  let s = `<line x1="40" y1="${base}" x2="1080" y2="${base}" stroke="#999" stroke-width="2"/>`;
  groups.forEach(([name, g], gi) => {
    const x0 = 70 + gi * 262;
    cols.forEach(([, c, k], ci) => {
      const v = g[k], hh = Math.max(3, (v / max) * H), x = x0 + ci * (bw + 8);
      s += `<rect x="${x}" y="${base - hh}" width="${bw}" height="${hh}" fill="${c}" rx="4"/>` + T(x + bw / 2, base - hh - 8, ms(v), 17, { a: 'middle', w: 700, f: c });
    });
    s += T(x0 + 104, base + 30, name, 18, { a: 'middle', w: 700 });
  });
  cols.forEach(([t, c], i) => { s += `<rect x="${70 + i * 190}" y="8" width="22" height="22" fill="${c}" rx="3"/>` + T(100 + i * 190, 26, t, 19); });
  s += T(1080, 26, 'ms per launch (mean of 2 runs)', 17, { a: 'end', f: '#666' });
  return svg(1100, 430, s);
};

/* ba cách khai sinh */
const ways = () => {
  let s = '';
  const lane = (y, title, c) => R(10, y, 1080, 110, c + '0f', c, { sw: 2 }) + T(30, y + 32, title, 21, { w: 700, f: c });
  s += lane(10, 'Unix: fork + exec (two steps)', RD) + lane(135, 'POSIX: posix_spawn (one call)', GR) + lane(260, 'Windows: CreateProcess (one call) — per the docs', OR);
  s += R(40, 52, 200, 50, '#fff', '#888') + T(140, 84, 'parent (512 MiB)', 18, { a: 'middle' }) + A(242, 77, 300, 77);
  s += R(304, 52, 250, 50, '#fff', RD) + T(429, 84, 'copy: page tables, COW', 18, { a: 'middle', f: RD }) + A(556, 77, 614, 77);
  s += R(618, 52, 200, 50, '#fff', RD) + T(718, 84, 'exec: replace all', 18, { a: 'middle' }) + A(820, 77, 878, 77) + R(882, 52, 190, 50, '#fff', '#888') + T(977, 84, 'new program', 18, { a: 'middle' });
  s += R(40, 177, 200, 50, '#fff', '#888') + T(140, 209, 'parent', 18, { a: 'middle' }) + A(242, 202, 300, 202);
  s += R(304, 177, 514, 50, '#fff', GR) + T(561, 209, 'clone(CLONE_VM|CLONE_VFORK) + exec: no copy', 18, { a: 'middle', f: GR }) + A(820, 202, 878, 202) + R(882, 177, 190, 50, '#fff', '#888') + T(977, 209, 'new program', 18, { a: 'middle' });
  s += R(40, 302, 200, 50, '#fff', '#888') + T(140, 334, 'parent', 18, { a: 'middle' }) + A(242, 327, 300, 327);
  s += R(304, 302, 514, 50, '#fff', OR) + T(561, 334, 'image path + ONE command-line string + env + flags', 18, { a: 'middle', f: OR }) + A(820, 327, 878, 327) + R(882, 302, 190, 50, '#fff', '#888') + T(977, 334, 'new process', 18, { a: 'middle' });
  return svg(1100, 380, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 14 — Windows & macOS', bai: '14.2',
}, [
  { cover: true, t: 'Processes, threads and signals<br>on three systems', sub: 'fork vs posix_spawn vs CreateProcess, measured — and why exit 138 means two different things' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Three ways to start a program: <b>fork+exec</b>, <b>posix_spawn</b>, <b>CreateProcess</b></li>
<li>One C program measured on <b>Linux</b> and on <b>macOS</b></li>
<li>Threads: the one thing that is (almost) the same</li>
<li>Signal numbers that <b>differ</b> — and Windows, which has none</li>
<li>A shutdown handler that works on all three</li>
</ul>` },

  { t: 'Three ways to start a program', giua: true, body: ways() },

  { t: 'The test: start /usr/bin/true 300 times, three ways', giua: true, body:
    sql(lines(17, 23) + '\n  /* … the same loop with vfork() … */\n' + lines(33, 39), { lang: 'c' }).replace('<pre class="vs">', '<pre class="vs" style="font-size:17px">') +
    box('', 'Same source on both systems. <code class="i">./spawn 300 512</code> first touches 512 MiB in the parent — the size of a busy JVM or Node server.', 'lam') },

  { t: 'Linux: fork pays for the parent’s memory', giua: true, body: term(l('cat /proc/loadavg', 2), 18) +
    box('', `Small parent: all ≈ 0.2–0.4 ms. Parent with 512 MiB: <b>fork+exec ≈ ${ms(LX['512'].f)} ms</b>, vfork and posix_spawn stay ≈ ${ms(LX['512'].p)} ms.`, 'do2') },

  { t: 'The bill in one picture', giua: true, body: chart() },

  { t: 'What strace sees inside posix_spawn', giua: true, body: term(l('strace -f -e trace=clone'), 15) +
    box('', 'Line 1 = fork (no CLONE_VM). vfork and posix_spawn share the parent’s memory until execve. clone3 → ENOSYS from Docker’s seccomp, glibc falls back.', 'lam') },

  { t: 'macOS: every launch is slow, posix_spawn still wins', giua: true, body: term(m('sysctl -n vm.loadavg', 2), 18) +
    box('', 'Busy Mac (load 18 on 10 cores): ±30 % noise. Launch ≈ 1.3–2.2 ms, mostly <b>exec</b> (dyld, libSystem, code signatures). 16 KiB pages: the 512 MiB parent made no measurable difference.', 'lam') },

  { t: 'Rule of thumb on every OS', to: true, giua: true, body: vsd(
    'A 3 GB JVM or Node server that <b>forks</b> to run git, ffmpeg or a shell command — paying for its memory on every launch.',
    'Start children with <b>posix_spawn</b> (or a runtime that uses it: Java’s ProcessBuilder on Linux/macOS). On Windows it is always <b>CreateProcess</b> — expensive too, per the docs.', '✗ Costly', '✓ Cheap') +
    box('Measured on Linux', `parent with 512 MiB: fork+exec <b>${ms(LX['512'].f)} ms</b> vs posix_spawn <b>${ms(LX['512'].p)} ms</b> — about ${Math.round(LX['512'].f / LX['512'].p)}× cheaper.`, 'xanh') },

  { t: 'Threads: 1:1 kernel threads everywhere', giua: true, body: term(m('node sig.js'), 19) + term(l('node sig.js'), 19) +
    box('', 'Same Node program, same <b>7 threads</b> (main + 4 libuv workers + V8). Tools differ: /proc/PID/task, <code class="i">ps -M</code>, Task Manager “Threads”.', 'xanh') },

  { t: 'Signal names travel, numbers do not', giua: true, body: term(m('/bin/kill -l'), 17) + term(l('kill -l | head -4'), 17) +
    box('', 'macOS (BSD order): BUS = 10, USR1 = 30. Linux: BUS = 7, USR1 = 10. Only 1, 2, 3, 6, 9, 14, 15 are fixed by POSIX.', 'lam') },

  { t: 'So exit 138 means two different things', giua: true, body: term(m("sh -c 'kill -USR1", 2) + '\n' + l("sh -c 'kill -USR1", 2), 16) +
    bang(['exit code', 'macOS', 'Linux'], [['138', '<b>SIGBUS</b> (10)', '<b>SIGUSR1</b> (10)'], ['158', 'SIGUSR1 (30)', '—'], ['137 / 143', 'SIGKILL / SIGTERM', 'SIGKILL / SIGTERM']], 22) },

  { t: 'Windows has no signals (per the docs)', giua: true, body: bang(['what happens', 'Windows', 'Node.js on Windows'], [
    ['Ctrl+C', 'CTRL_C_EVENT → handler on a <b>new thread</b>', '<b>SIGINT</b> works'],
    ['Ctrl+Break', 'CTRL_BREAK_EVENT', 'SIGBREAK'],
    ['console window closed', 'CTRL_CLOSE_EVENT, ~5 s to clean up', 'SIGHUP, killed ~10 s later'],
    ['service stop', 'SERVICE_CONTROL_STOP from the SCM', '—'],
    ['kill / IDE Stop', 'TerminateProcess — no handler', 'SIGTERM listener <b>never fires</b>'],
  ], 23) + box('', 'Node docs: "SIGTERM is not supported on Windows, it can be listened on" — and <code class="i">process.kill()</code> there means unconditional termination.', 'lam') },

  { t: 'Pitfall: graceful shutdown that only works on Linux', giua: true, to: true, body: vsd(
    'Clean up only in <code class="i">process.on("SIGTERM")</code>. Docker on the VPS sends SIGTERM — tests pass. On Windows the IDE stops the app with TerminateProcess: half-written files.',
    'Handle <b>SIGINT and SIGTERM</b> (+ SIGBREAK) with one cleanup function; Java: a shutdown hook. Commit work as you go. Never <code class="i">kill -10</code> — on a Mac that is SIGBUS.') +
    sql("const stop = () => server.close(() => process.exit(0));\nfor (const s of ['SIGINT', 'SIGTERM', 'SIGBREAK']) process.on(s, stop);", { lang: 'javascript' }).replace('<pre class="vs">', '<pre class="vs" style="font-size:19px">') },

  { t: 'Practice: same program, two kernels', giua: true, to: true, body: `
<ol>
<li>Compile <code class="i">spawn.c</code> on the Mac and in the lab; run <code class="i">300 0</code> and <code class="i">300 512</code></li>
<li><code class="i">strace -f -e trace=clone,clone3,vfork,execve</code>: mark fork, vfork, posix_spawn</li>
<li><code class="i">kill -USR1</code> and <code class="i">kill -BUS</code> on both: which exit codes collide?</li>
<li>One cleanup for SIGINT, SIGTERM, SIGBREAK in <code class="i">sig.js</code></li>
</ol>` + box('Done when', 'fork grows with parent memory on Linux, posix_spawn does not; exit 138 explained per OS; sig.js exits 0 on Mac and Linux.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Unix: fork + exec · POSIX: <b>posix_spawn</b> · Windows: <b>CreateProcess</b></li>
<li>Linux: fork ${ms(LX['0'].f)} → <b>${ms(LX['512'].f)} ms</b> with a 512 MiB parent; posix_spawn ≈ ${ms(LX['512'].p)} ms</li>
<li>macOS: every launch ≈ 1.3–2.2 ms, posix_spawn still fastest</li>
<li>Threads are 1:1 kernel threads everywhere</li>
<li>Signal <b>numbers</b> differ; Windows has <b>no signals</b> — handle SIGINT + SIGTERM</li>
</ul>` },
]);
