/**
 * os-02-2 — khoá "Operating Systems for Developers", bài 2.2 "Who eats the CPU" (28/10/2026).
 * Khuôn _pg-chung.mjs (slide EN, dáng FU, logo CuongThai.com). Output đọc THẲNG từ lab/out/c22-cot, c22-load, c22-cpu,
 * c22-zombie (.out.txt — chạy thật trong ảnh os-lab / từ máy chủ) qua grab() — không chép tay. Giảng: giang/os-02-2.mjs.
 */
import { lamDeck, sql, sh, two as two0, box, cards } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-02-2', code: 'OS 2.2', title: 'Who eats the CPU: top, ps and the load average', sub: 'Operating Systems · Chapter 2' };

const cut = (t, n) => t.split('\n').map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const g = (f, pre, n = 1, w = 200) => cut(grab(f, pre, n), w);
const lines = (t, a, b) => t.split('\n').slice(a, b).join('\n');
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const BL = '#336791', OR = '#e08a1e', BR = '#b85a2b', GR = '#2f7d4f', RD = '#c0392b', GY = '#8a8a8a';
const ARR = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;

/* Slide 6: load = hàng đợi — 2 lõi, 6 tác vụ: 2 đang chạy, 4 chờ */
const queue = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial"><defs>${ARR('q22', GY)}</defs>`;
  s += T(250, 28, 'run queue (waiting)', 21, { a: 'middle', w: 800, f: OR });
  [0, 1, 2, 3].forEach((i) => {
    const x = 40 + i * 110;
    s += R(x, 60, 90, 70, '#fff7ef', OR) + T(x + 45, 102, 'node', 19, { a: 'middle', w: 700, f: BR });
  });
  s += `<line x1="490" y1="95" x2="590" y2="95" stroke="${GY}" stroke-width="3" marker-end="url(#q22)"/>`;
  s += T(820, 28, '2 cores (cpuset 0,1)', 21, { a: 'middle', w: 800, f: BL });
  [0, 1].forEach((i) => {
    const x = 610 + i * 240;
    s += R(x, 50, 210, 90, '#eef4fa', BL) + T(x + 105, 82, 'cpu' + i + ' — 100%', 20, { a: 'middle', w: 800, f: BL });
    s += R(x + 60, 96, 90, 34, '#fff', GR, { rx: 6, sw: 2 }) + T(x + 105, 119, 'node', 17, { a: 'middle', w: 700, f: GR });
  });
  s += R(40, 175, 1050, 110, '#fbfbfb', '#ccc', { sw: 1.5 });
  s += T(565, 212, 'load ≈ running (2) + waiting (4) = 6   ·   each task gets ≈ 2/6 of a core', 22, { a: 'middle', w: 800 });
  s += T(565, 252, 'no process shows 100%, yet the two cores are saturated three times over', 20, { a: 'middle', f: RD, w: 700 });
  return s + '</svg>';
};

/* Slide 13: PID 1 = node không thu dọn con mồ côi ⇒ zombie */
const pid1 = () => {
  let s = `<svg viewBox="0 0 1110 260" width="1110" height="260" font-family="Arial"><defs>${ARR('z22', GY)}${ARR('z22r', RD)}</defs>`;
  s += R(20, 20, 250, 80, '#eef4fa', BL) + T(145, 55, 'PID 1 = node', 22, { a: 'middle', w: 800, f: BL }) + T(145, 82, 'waits only for its own sh', 16, { a: 'middle' });
  s += R(360, 20, 210, 80, '#fff', GY) + T(465, 55, 'sh (browser)', 20, { a: 'middle', w: 700 }) + T(465, 82, 'starts helper, exits', 16, { a: 'middle' });
  s += R(660, 20, 210, 80, '#fff', GY) + T(765, 55, 'sleep (helper)', 20, { a: 'middle', w: 700 }) + T(765, 82, 'runs in background', 16, { a: 'middle' });
  s += `<line x1="270" y1="60" x2="356" y2="60" stroke="${GY}" stroke-width="3" marker-end="url(#z22)"/>`;
  s += `<line x1="570" y1="60" x2="656" y2="60" stroke="${GY}" stroke-width="3" marker-end="url(#z22)"/>`;
  s += `<path d="M765,104 C765,170 300,190 170,106" stroke="${RD}" stroke-width="3" fill="none" stroke-dasharray="8 6" marker-end="url(#z22r)"/>`;
  s += T(470, 196, 'orphan → re-parented to PID 1 → exits → nobody calls wait() → Z', 19, { a: 'middle', w: 700, f: RD });
  s += R(910, 20, 180, 80, '#fdf0ee', RD) + T(1000, 55, 'Z  Z  Z  Z', 22, { a: 'middle', w: 800, f: RD }) + T(1000, 82, 'one PID each', 16, { a: 'middle', f: RD });
  s += T(555, 245, 'with --init: PID 1 = tini, which reaps every orphan', 20, { a: 'middle', w: 800, f: GR });
  return s + '</svg>';
};

/* Slide 11: thời gian regex theo độ dài input (đo thật) */
const growth = () => {
  const d = [[40, 26], [45, 173], [50, 1174]];
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">`;
  d.forEach(([n, ms], i) => {
    const y = 15 + i * 70, w = Math.max(8, Math.round((ms / 1174) * 820));
    s += T(150, y + 34, n + ' letters', 21, { a: 'end', w: 800 });
    s += R(165, y + 8, w, 40, RD + '33', RD, { rx: 5, sw: 2 });
    s += T(165 + w + 12, y + 35, ms.toLocaleString('en-US') + ' ms', 21, { w: 800, f: RD });
  });
  s += T(555, 224, '≈ ×6.7 for every 5 extra letters — 64 letters takes minutes', 19, { a: 'middle', f: '#555', w: 700 });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 2 — Observing Linux', bai: '2.2',
}, [
  { cover: true, t: 'Who eats the CPU', sub: 'top, ps, pidstat and the load average<br>— plus a runaway regex and a pile of zombies' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Every line and column of <b>top</b>, produced on purpose</li>
<li><b>us, sy, ni, wa, st</b> — what makes each one rise</li>
<li>Why <b>load average is a queue</b>, not a percentage — 6 loops on 2 cores</li>
<li><b>ps STAT</b>: R, S, D, T, Z and the letters after them</li>
<li>Two incidents: <b>one regex freezes an API</b>, <b>zombies</b> exhaust a container</li>
</ul>
${box('Measured, not claimed', 'Every number is a real run in the course lab (10 CPUs, Docker Desktop, kernel 7.0, Node 22).', 'lam')}` },

  { t: 'The five header lines of top', giua: true, body: `
${term(g('c22-cot', 'sleep 2; top'), { hl: [2, 3, 4, 8] })}
<table class="t" style="font-size:19px">
<tr><td style="width:24%"><b>load average</b></td><td>1/5/15-minute averages — same as <code class="i">uptime</code></td></tr>
<tr><td><b>Tasks</b></td><td>processes by state; a growing <b>zombie</b> count is an incident</td></tr>
<tr><td><b>%Cpu(s)</b></td><td>where CPU time went, averaged over <b>all</b> CPUs</td></tr>
<tr><td><b>MiB Mem / Swap</b></td><td>memory — read <b>avail Mem</b>, not free (lesson 2.3)</td></tr>
<tr><td><b>columns</b></td><td>PR/NI priority · VIRT/RES/SHR KiB · S state · %CPU <b>per core</b> · TIME+ CPU used</td></tr>
</table>` },

  { t: 'us, sy and ni — three programs, three columns', giua: true, body: `
${sh(g('c22-cot', 'mpstat -P ALL'), { hl: [6, 7, 8] })}
${cards([
    ['us — CPU 0: 98%', 'A plain <code class="i">node</code> busy loop: your own code running.'],
    ['sy — CPU 6: 68%', '<code class="i">dd bs=1</code>: one read + one write syscall per byte — the kernel works for it.'],
    ['ni — CPU 7: 100%', '<code class="i">nice -n 19 node</code>: user code of a low-priority process (top shows NI 19, PR 39).'],
  ])}` },

  { t: 'wa, hi/si and st complete the picture', giua: true, body: sh(g('c22-cot', 'vmstat 1 3'), { hl: [5, 6] }) + cards([
    ['wa — waiting for disk', 'CPUs idle while a task waits for the disk (12–28% in lesson 2.1). 0 here.'],
    ['hi / si — interrupts', 'Hardware and software interrupts: network packets, timers.'],
    ['st — steal', 'The hypervisor gave your vCPU to another VM. 0 in this lab.'],
  ]) + box('On a cheap VPS', 'A steady <b>st</b> of 10–20% means you are paying for CPU you are not getting. And note: three busy programs on ten CPUs show as "only" 23% <b>us</b>.', 'lam') },

  { t: 'Load average is a queue, not a percentage', giua: true, body: `
${queue()}
${box('Rule', 'Compare load with the number of CPUs the work may use. On Linux, tasks stuck in D state (waiting for disk) count too.', 'xanh')}` },

  { t: 'Six busy loops on two cores: load climbs toward 6', giua: true, body: two(
    term(g('c22-load', 'nproc')), term(g('c22-load', 'uptime', 2)), 'r37') +
    term(lines(g('c22-load', 'mpstat -P 0,1'), 0, 6)) + cards([
    ['4.37 after 65 s', 'The 1-minute figure is damped: after one minute it has covered only ~63% of a jump.'],
    ['7/726', 'In /proc/loadavg: 7 tasks runnable right now, out of 726 on the whole machine.'],
    ['cpu0, cpu1 = 100%', 'The only two cores this container may use are full.'],
  ]) },

  { t: 'Nobody shows 100% — yet the box is saturated', giua: true, body: two(
    term(g('c22-load', 'top -b -n 1', 1, 86), { hl: [4] }),
    term(g('c22-load', 'ps -o pid,psr', 1, 34)), 'r73') + box('Read it together', 'Six processes share two cores (PSR 0 or 1), ≈ ⅓ core each — nobody reaches 100%. The 80% idle in %Cpu(s) belongs to eight cores this container cannot use.', 'do2') },

  { t: 'ps STAT: one process in each state', giua: true, body: two(
    term(g('c22-cot', 'sleep 1; ps -eo'), { hl: [6, 7, 9] }),
    `<table class="t" style="font-size:19px">
<tr><th>STAT</th><th>Meaning</th></tr>
<tr><td><b>R</b></td><td>running or runnable</td></tr>
<tr><td><b>S</b></td><td>sleeping, waiting for an event</td></tr>
<tr><td><b>D</b></td><td>uninterruptible — usually disk I/O</td></tr>
<tr><td><b>T</b></td><td>stopped (SIGSTOP, Ctrl-Z)</td></tr>
<tr><td><b>Z</b></td><td>zombie: exited, parent never called wait()</td></tr>
<tr><td>s l N &lt; +</td><td>session leader · multi-threaded · nice&gt;0 · high priority · foreground</td></tr>
</table>`, 'r64') + box('Sorting', '<code>ps -eo pid,comm,%cpu,rss --sort=-rss</code> — the minus means descending: biggest first.', 'lam') },

  { t: 'Incident: one regular expression freezes the whole API', giua: true, body: `
<table class="t" style="font-size:22px;line-height:1.6">
<tr><th style="width:15%">Symptom</th><td>/health stops answering; every request times out; nothing in the logs</td></tr>
<tr><th>Measure</th><td>one node at 90–100% CPU · pidstat: 100% %usr, 0% %system · perf: 100% inside one RegExp</td></tr>
<tr><th>Cause</th><td>nested quantifier in an e-mail check backtracks exponentially; Node runs your JS on <b>one</b> thread</td></tr>
<tr><th>Fix</th><td>restart to recover; rewrite the regex without nested quantifiers; reject long input first</td></tr>
<tr><th>Prevent</th><td>lint unsafe regexes, cap input length, match untrusted patterns off the main thread with a timeout</td></tr>
</table>
${sql(`const EMAIL = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9]{2,4})+$/;   // ❌`, { lang: 'javascript' })}` },

  { t: 'Each 5 extra letters cost ×6.7 — then the API is gone', giua: true, body: `
${growth()}
${two(term(g('c22-cpu', 'for n in 40 45 50', 1, 50)), term(g('c22-cpu', '(curl -s', 2, 72)), 'r46')}` },

  { t: 'User time, no sleeping, and perf names the RegExp', giua: true, body: `
${term(lines(g('c22-cpu', 'pidstat -u'), 0, 7), { hl: [5, 6, 7] })}
${two(term(g('c22-cpu', 'grep ctxt', 1, 50)), box('Pure computation', '100% <b>%usr</b>, 0% %system. <b>voluntary</b> stays 10 (never waits); <b>nonvoluntary</b> 67 → 81 (only preempted). Machine-wide: <code>10.4 us</code> — "90% idle".', 'do2'), 'r46')}
${term(lines(g('c22-cpu', 'perf record', 1, 128), 0, 2))}` },

  { t: 'Incident: zombies pile up until nothing can fork', giua: true, body: `
${pid1()}
<table class="t" style="font-size:19px">
<tr><th style="width:15%">Symptom</th><td>a Chromium-style screenshot service slowly fails: helpers do not start, then <code class="i">docker exec</code> fails too</td></tr>
<tr><th>Fix</th><td>run with <code class="i">--init</code> (compose <code class="i">init: true</code>); a <code class="i">pids</code> limit keeps the damage in one container</td></tr>
</table>` },

  { t: '26 zombies in 1.5 s — and kill -9 does nothing', giua: true, body: two(
    term(g('c22-zombie', 'docker exec os-c22z ps', 1, 50)) + term(g('c22-zombie', 'docker exec os-c22z sh -c "ps', 1, 50)),
    term(lines(g('c22-zombie', 'docker exec os-c22z top', 1, 70), 0, 2)) + term(g('c22-zombie', "docker exec os-c22z sh -c 'Z=", 1, 60)), 'r46') +
    box('Already dead', 'A zombie is only a process-table entry holding an exit status. It uses no CPU and no RAM — only a PID slot. Only its parent can reap it.', 'lam') },

  { t: 'The PID budget runs out — then --init fixes it', giua: true, body: two(
    term(cut(g('c22-zombie', 'sleep 8', 2), 50), { hl: [2, 3, 4, 5, 7] }),
    term(g('c22-zombie', 'docker exec os-c22z-init ps', 1, 60)) + term(g('c22-zombie', 'docker exec os-c22z-init sh', 2, 60)), 'r46') +
    box('One flag', 'PID 1 = <b>docker-init</b> (tini) reaps every orphan: 0 zombies, 14 PIDs in use, 114 jobs done. This is lesson 1.5 turning into an outage.', 'xanh') },

  { t: 'Cheat sheet — who eats the CPU', giua: true, body: `
<table class="t" style="font-size:21px;line-height:1.7">
<tr><th style="width:46%">You want to know…</th><th>Run</th></tr>
<tr><td>Is the CPU queue long?</td><td><code class="i">uptime</code> vs <code class="i">nproc</code> · vmstat <code class="i">r</code></td></tr>
<tr><td>Which core, which kind of time?</td><td><code class="i">mpstat -P ALL 1</code> (us / sy / ni / wa / st)</td></tr>
<tr><td>Which process?</td><td><code class="i">pidstat 1</code> · <code class="i">ps -eo pid,stat,%cpu,comm --sort=-%cpu</code></td></tr>
<tr><td>Busy computing or waiting?</td><td><code class="i">grep ctxt /proc/PID/status</code></td></tr>
<tr><td>Which function?</td><td><code class="i">perf record -g -p PID</code> · <code class="i">perf report</code></td></tr>
<tr><td>Zombies / PID budget?</td><td><code class="i">ps -eo stat,ppid,comm | grep ^Z</code> · <code class="i">pids.current</code></td></tr>
</table>` },
]);
