/**
 * os-15-1 — khoá "Operating Systems for Developers", bài 15.1 "USE, RED and the first 60 seconds" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c151-use.out.txt qua g()/num(). Giảng: giang/os-15-1.mjs.
 */
import { lamDeck, box, cards, steps } from './_pg-chung.mjs';
import { META, g, num, tiny, bars, svg, T, R, BL, GR, RD, OR, GY } from './os-15-chung.mjs';

export const deck = { key: 'os-15-1', code: 'OS 15.1', title: 'USE, RED and the first 60 seconds', sub: 'Operating Systems · Chapter 15' };

const F = 'c151-use';
const red = g(F, 'python3 red.py');
const rp = (path, col) => +red.split('\n').find((l) => l.startsWith(path)).trim().split(/\s+/)[col].replace('ms', '');
const srvRep99 = rp('/report', 5), srvHl99 = rp('/health', 5), srvRep50 = rp('/report', 3);
const cli = g(F, 'cat /tmp/report.txt');
const cliNums = [...cli.matchAll(/latency from intended start\s+p50\s+([\d.]+)\s+p95\s+([\d.]+)\s+p99\s+([\d.]+)/g)].map((m) => m.slice(1).map(Number));
const [cliRep, cliHl] = cliNums;
const mp = g(F, 'mpstat -P ALL').split('\n').map((l) => l.trim().split(/\s+/)).filter((f) => /^\d+$/.test(f[1]) && f.length > 10)
  .map((f) => ({ cpu: +f[1], usr: +f[2], wa: +f[5] }));
const psiIo = num(F, 'python3 use.py', /PSI io some ([\d.]+)%/);

/* mpstat từng CPU: cột usr (xanh) + iowait (cam) */
const cpuChart = () => {
  const W = 1060, H = 300, L = 60, B = 40, bw = 70, gap = (W - L - 10 * bw) / 10;
  let s = '';
  for (let v = 0; v <= 100; v += 25) { const y = H - B - (v / 100) * (H - B - 20); s += `<line x1="${L}" y1="${y}" x2="${W}" y2="${y}" stroke="#eee"/>` + T(L - 8, y + 5, `${v}%`, 14, { a: 'end', f: '#777' }); }
  mp.forEach((c, i) => {
    const x = L + gap / 2 + i * (bw + gap), hU = (c.usr / 100) * (H - B - 20), hW = (c.wa / 100) * (H - B - 20);
    s += R(x, H - B - hU, bw, Math.max(hU, 0.5), GR + 'cc', GR, { rx: 2, sw: 1 }) + R(x, H - B - hU - hW, bw, Math.max(hW, 0.5), OR + 'cc', OR, { rx: 2, sw: 1 });
    s += T(x + bw / 2, H - B + 22, `CPU ${c.cpu}`, 15, { a: 'middle', w: 700 });
    if (c.usr > 50) s += T(x + bw / 2, H - B - hU + 22, `${c.usr}% usr`, 13, { a: 'middle', w: 700, f: '#fff' });
    if (c.wa > 50) s += T(x + bw / 2, H - B - hU - hW + 22, `${c.wa}% wait`, 13, { a: 'middle', w: 700, f: '#fff' });
  });
  return svg(W, H, s);
};

export const slides = lamDeck(META('15.1'), [
  { cover: true, t: 'Method before tools', sub: 'USE, RED and the first 60 seconds<br>on a container that is on fire' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>RED</b> for services and <b>USE</b> for resources — two maps, used in that order</li>
<li>Software resources count: the event loop, pools, locks, fds, a cgroup budget</li>
<li>The <b>60-second checklist</b> run for real inside a loaded 2-CPU container</li>
<li>What each command sees from <b>inside</b> a container — and what lies</li>
<li>Why the server measured p99 = ${srvRep99} ms while clients waited ${(cliRep[2] / 1000).toFixed(2)} s</li>
</ul>` },

  { t: 'Two maps: RED finds the service, USE finds the cause', giua: true, body: `
${svg(1100, 250, [
    R(10, 30, 330, 190, '#eef4fa', BL), T(175, 72, 'RED — per service', 24, { a: 'middle', w: 700, f: BL }),
    ...[['Rate', 'requests / s'], ['Errors', 'failed / s'], ['Duration', 'p50 · p95 · p99']].map(([k, v], i) => T(40, 115 + i * 35, k, 20, { w: 700, f: BL }) + T(150, 115 + i * 35, v, 20)),
    `<line x1="350" y1="125" x2="420" y2="125" stroke="#b85a2b" stroke-width="3" marker-end="url(#mt15)"/>`, T(385, 110, 'why?', 17, { a: 'middle', f: '#b85a2b', w: 700 }),
    R(430, 30, 660, 190, '#fff7ef', OR), T(760, 72, 'USE — per resource (every one!)', 24, { a: 'middle', w: 700, f: '#b85a2b' }),
    ...[['Utilization', 'how busy is it?'], ['Saturation', 'is work waiting for it?'], ['Errors', 'is it reporting errors?']].map(([k, v], i) => T(460, 115 + i * 35, k, 20, { w: 700, f: '#b85a2b' }) + T(600, 115 + i * 35, v, 20)),
  ].join(''))}
${box('In this order', 'Users complain about a <b>service</b>, never about a resource. RED tells you which service hurts and how much; USE walks every resource so you cannot skip the disk because the CPU looked guilty.', 'lam')}` },

  { t: 'USE is a checklist — and resources include software', body: `
<table class="t" style="font-size:18px">
<tr><th>resource</th><th>utilization</th><th>saturation</th><th>errors</th></tr>
<tr><td>CPU (cgroup)</td><td>cpu.stat ÷ cpu.max</td><td>throttled periods · PSI cpu</td><td>—</td></tr>
<tr><td><b>one thread</b> (event loop)</td><td>pidstat -t: % of ONE core</td><td>requests queued in front (client latency)</td><td>timeouts</td></tr>
<tr><td>memory</td><td>memory.current ÷ memory.max</td><td>PSI memory · reclaim · swap-in</td><td>memory.events oom_kill</td></tr>
<tr><td>disk</td><td>iostat %util</td><td>aqu-sz · await · PSI io · io.max</td><td>dmesg I/O errors</td></tr>
<tr><td>network</td><td>throughput vs link</td><td>listen overflows · backlogs</td><td>retransmits · resets</td></tr>
<tr><td>fds · PIDs · DB pool · lock</td><td>in use ÷ limit</td><td>waiters</td><td>EMFILE · EAGAIN · pool timeout</td></tr>
</table>
${box('Software resources', 'Anything requests queue for is a resource: the Node event loop, a thread pool, a DB connection pool, a lock, a cgroup quota. Same three questions.', '')}` },

  { t: 'The lab: one symptom, three hidden culprits', giua: true, body: `
${cards([
    ['🐢 orders.js', '<b>100 req/s</b> to /report + <b>20 req/s</b> to /health, sent by tai.js — the API of this chapter'],
    ['🧠 python3', 'holds <b>600 MiB</b> of the container’s 1 GiB, then sleeps'],
    ['💾 backup (dd)', 'writes to disk in a loop; the container may write only <b>20 MB/s</b> (io.max)'],
  ], 3)}
${box('The container', '<code>--cpus 2 --memory 1g --device-write-bps /dev/vda:20mb</code> — the size of a small VPS. All you are told: <b>“the API is slow”</b>.', 'lam')}` },

  { t: 'The 60-second checklist — and what it sees from a container', body: `
<table class="t" style="font-size:17px">
<tr><th>command</th><th>answers</th><th>inside a container it shows…</th></tr>
<tr><td>uptime</td><td>load trend (1/5/15 min)</td><td>the whole VM, and the past</td></tr>
<tr><td>dmesg | tail</td><td>OOM, I/O errors</td><td><span class="do">Operation not permitted</span></td></tr>
<tr><td>vmstat 1</td><td>run queue, wait, swap</td><td>the whole VM</td></tr>
<tr><td>mpstat -P ALL 1</td><td>per-CPU balance</td><td>the VM’s 10 CPUs</td></tr>
<tr><td>pidstat 1</td><td>per-process CPU</td><td><span class="xanh">only our processes</span> (PID namespace)</td></tr>
<tr><td>iostat -xz 1</td><td>disk util, queue</td><td>the VM’s disk</td></tr>
<tr><td>free -m</td><td>memory</td><td>the VM, not our 1 GiB</td></tr>
<tr><td>sar -n DEV / TCP,ETCP</td><td>network, retransmits</td><td><span class="xanh">our network namespace</span></td></tr>
<tr><td>top</td><td>overview</td><td>VM header, our processes</td></tr>
</table>` },

  { t: 'mpstat: the average says “calm”, two CPUs say otherwise', giua: true, body: `
${cpuChart()}
${box('Read per CPU, never only “all”', `VM-wide: ${g(F, 'mpstat -P ALL').split('\n').find((l) => /\sall\s/.test(l)).trim().split(/\s+/)[2]}% user. Per CPU: one core at <b>${Math.max(...mp.map((c) => c.usr))}% user</b> (node) and one at <b>${Math.max(...mp.map((c) => c.wa))}% iowait</b> (the backup waiting). Averaged over ten CPUs they disappear.`, 'lam')}` },

  { t: 'pidstat, free and top name a suspect', body: tiny([
    g(F, 'pidstat 1 1').split('\n').slice(0, 6).join('\n'),
    g(F, 'free -m'),
    g(F, 'top -bn1').split('\n').slice(0, 10).join('\n'),
  ].join('\n'), 15) },

  { t: 'Ask the cgroup: quota, pressure, threads', body: tiny([
    g(F, 'cat /sys/fs/cgroup/cpu.max'),
    g(F, 'for r in cpu memory io'),
    g(F, 'pidstat -t -p').split('\n').slice(0, 8).join('\n'),
  ].join('\n'), 17) },

  { t: 'use.py fills the USE table for this container', body: `
${tiny(g(F, 'python3 use.py'), 14)}
${box('Read each row', `CPU 52% and not throttled — yet one thread at <b>100%</b>. Memory 72% with PSI 0 = healthy. Disk busy 1% yet <b>PSI io ${psiIo}%</b>: the queue is the cgroup’s io.max budget, not the device.`, '')}` },

  { t: 'RED: the server’s clock vs the clients’ clock', giua: true, body: `
${bars([
    ['/report — server p99', srvRep99, GR, `${srvRep99} ms`],
    ['/report — client p99', cliRep[2], RD, `${cliRep[2]} ms`],
    ['/health — server p99', srvHl99, GR, `${srvHl99} ms`],
    ['/health — client p50', cliHl[0], RD, `${cliHl[0]} ms`],
    ['/health — client p99', cliHl[2], RD, `${cliHl[2]} ms`],
  ], { log: true, label: 330 })}
${box('Log scale', 'The handler’s timer starts when the handler starts. Waiting in the socket buffer and behind other requests on the event loop is invisible to it. A no-op /health waited half a second.', 'do2')}` },

  { t: 'Why the queue never drains', giua: true, to: true, body: `
<div class="o info" style="font-size:26px;text-align:center"><b>${srvRep50} ms × 100 req/s = ${(srvRep50 * 100 / 1000).toFixed(2)} s of event-loop work per second</b></div>
${steps([
    `capacity of one event loop ≈ 1000 ÷ ${srvRep50} ≈ <b>${Math.floor(1000 / srvRep50)} req/s</b>`,
    'offered: 100 /report + 20 /health per second ⇒ utilization ≥ 1',
    `utilization ≥ 1 ⇒ the queue grows for as long as the load lasts (worst wait <b>${(+num(F, 'cat /tmp/report.txt', /max\s+([\d.]+) ms/) / 1000).toFixed(1)} s</b>)`,
    'more cores in the cgroup do not help: one thread can use one core',
  ])}` },

  { t: 'Verdict: the event loop is the bottleneck', to: true, giua: true, body: `
${cards([
    ['Evidence 1 — RED', `client p99 ≈ ${Math.round(cliRep[2] / srvRep99)}× server p99, and even /health is slow ⇒ a <b>shared</b> resource`],
    ['Evidence 2 — USE', 'the only resource at 100% is the node main thread; the cgroup has a spare CPU'],
    ['Evidence 3 — per thread', 'pidstat -t: TID 11 at 100%, the other 11 threads at 0%'],
  ], 3)}
${box('What to do', 'Make /report cheaper (lesson 15.4: 10 ms → 0.9 ms) or run more event loops (cluster, 4.3). The backup’s I/O pressure is real — a second, quieter ticket.', 'xanh')}` },

  { t: 'Two traps to remember', giua: true, to: true, body: `
${cards([
    ['“Container CPU is 52%, so not CPU”', 'Averages over cores hide one saturated thread. Look per CPU (mpstat -P ALL) and per thread (pidstat -t).'],
    ['“Our dashboard says p99 = 11 ms”', 'A timer inside the handler cannot see the queue in front of it. Measure where the client is: nginx $request_time, the load balancer, a synthetic client.'],
  ], 2)}` },
]);
