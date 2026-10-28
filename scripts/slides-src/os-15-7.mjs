/**
 * os-15-7 — khoá "Operating Systems for Developers", bài 15.7 "Tuning knobs and when not to touch them" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c157-knobs.out.txt. Giảng: giang/os-15-7.mjs.
 */
import { lamDeck, box, cards, steps } from './_pg-chung.mjs';
import { META, g, num, tiny, bars, svg, T, R, A, BL, GR, RD, OR, GY } from './os-15-chung.mjs';

export const deck = { key: 'os-15-7', code: 'OS 15.7', title: 'Tuning knobs', sub: 'Operating Systems · Chapter 15' };

const F = 'c157-knobs';
const nKnobs = num(F, 'sysctl -a', /^(\d+)$/m);
const b128 = g(F, 'nstat -n; python3 burst.py 9000'), b4096 = g(F, 'nstat -n; python3 burst.py 9001');
const p50 = (t) => +t.match(/p50 ([\d.]+) ms/)[1], ovf = (t) => +t.match(/TcpExtListenOverflows\s+(\d+)/)[1], waited = (t) => +t.match(/waited >= 1 s: (\d+)/)[1];
const held = (pre) => +num(F, pre, /held at peak: (\d+) connections/);

const queue = () => {
  let s = '';
  s += R(10, 60, 150, 60, BL + '22', BL) + T(85, 86, 'clients', 18, { a: 'middle', w: 700 }) + T(85, 108, 'SYN', 15, { a: 'middle', f: '#555' });
  s += A(165, 90, 255, 90, BL) + R(260, 60, 170, 60, '#f0f0f0', GY) + T(345, 86, 'handshake', 17, { a: 'middle', w: 700 }) + T(345, 108, 'SYN-ACK, ACK', 14, { a: 'middle', f: '#555' });
  s += A(435, 90, 515, 90, BL);
  for (let i = 0; i < 8; i++) s += R(520 + i * 38, 70, 32, 40, i < 6 ? OR + '88' : '#ffffff', OR, { rx: 4 });
  s += T(670, 58, 'accept queue = min(backlog, somaxconn)', 16, { a: 'middle', w: 700, f: '#b85a2b' });
  s += A(830, 90, 900, 90, BL) + R(905, 60, 150, 60, GR + '22', GR) + T(980, 86, 'accept()', 18, { a: 'middle', w: 700 }) + T(980, 108, 'the program', 14, { a: 'middle', f: '#555' });
  s += T(670, 150, 'full ⇒ the SYN is dropped ⇒ the client retries after 1 s, 3 s, 7 s …', 17, { a: 'middle', w: 700, f: RD });
  return svg(1060, 165, s);
};

export const slides = lamDeck(META('15.7'), [
  { cover: true, t: 'Tuning knobs', sub: 'sysctl, ulimit, CPU governor, NUMA —<br>and when not to touch them' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Five rules before you turn any of the <b>${Number(nKnobs).toLocaleString('en')}</b> sysctl knobs</li>
<li><b>net.core.somaxconn</b> — measured before and after on a connection burst</li>
<li><b>ulimit -n</b> — measured before and after, and the error that never appeared</li>
<li>vm.*, THP, CPU governor, NUMA: why they stay <b>“not measured”</b> here</li>
<li>A table of knobs: scope, evidence, where the course measured them</li>
</ul>` },

  { t: 'Five rules before you turn anything', to: true, giua: true, body: steps([
    'Find the bottleneck first (USE, lesson 15.1)',
    'The knob must match the evidence: overflows → backlog, EMFILE → fd limit',
    'One change at a time, the same load before and after (lesson 15.6)',
    'Know the scope: net.* per namespace · vm.*, kernel.* whole machine · ulimit per process',
    'Write it down, make it revertable: /etc/sysctl.d/ with the measurement in a comment',
  ]) },

  { t: 'The accept queue: waiting for accept()', giua: true, body: `
${queue()}
${box('Who sets the length?', 'The program (listen backlog: Node and nginx 511, Python http.server 5) and the kernel (net.core.somaxconn, 4096 since Linux 5.4) — the <b>smaller</b> one wins.', 'lam')}` },

  { t: 'somaxconn = 128: a burst of 600, server busy for 3 s', giua: true, body: `
${tiny([g(F, 'sysctl -w net.core.somaxconn=128'), g(F, 'python3 slowaccept.py 9000'), b128].join('\n'), 15)}
${box('Dropped SYNs', `Queue capped at 128 ⇒ ${waited(b128)} clients waited ≥ 1 s; connect p50 <b>${p50(b128).toLocaleString('en')} ms</b>; the kernel counted ${ovf(b128).toLocaleString('en')} overflows (several per client, one per retry).`, 'do2')}` },

  { t: 'somaxconn = 4096: the same burst', giua: true, body: `
${tiny([g(F, 'sysctl -w net.core.somaxconn=4096'), g(F, 'python3 slowaccept.py 9001'), b4096].join('\n'), 15)}
${box('Everyone waits in the queue', `Effective queue = the program’s 1 024. Connect p50 <b>${p50(b4096)} ms</b>, nobody retried, ${ovf(b4096)} overflows.`, 'xanh')}` },

  { t: `One knob: connect p50 ${p50(b128).toLocaleString('en')} → ${p50(b4096)} ms`, giua: true, body: `
${bars([
    ['somaxconn 128 — p50', p50(b128), RD, `${p50(b128).toLocaleString('en')} ms`],
    ['somaxconn 4096 — p50', p50(b4096), GR, `${p50(b4096)} ms`],
  ], { label: 290, rowH: 56, log: true })}
${cards([
    ['Per network namespace', 'safe to change inside the container; docker run --sysctl does it without --privileged'],
    ['min(backlog, somaxconn)', 'raising the sysctl does nothing if the program asks listen(…, 128)'],
  ], 2)}` },

  { t: `ulimit -n: ${held('(ulimit -n 1024')} held of 2 000 — and no error`, giua: true, body: `
${tiny([g(F, '(ulimit -n 1024'), g(F, '(ulimit -n 65536')].join('\n'), 15)}
${box('Silent', `limit 1 024 ⇒ ${held('(ulimit -n 1024')} connections held; 65 536 ⇒ ${held('(ulimit -n 65536')}. Every client “connected” (the kernel finishes the handshake); the rest were accepted and closed by libuv’s EMFILE workaround (lesson 10.4). Set LimitNOFILE / --ulimit where the service starts.`, '')}` },

  { t: 'Knobs we did not turn: global to the shared VM', giua: true, body: `
${tiny([g(F, 'sysctl vm.swappiness'), g(F, 'cat /sys/kernel/mm/transparent_hugepage/enabled')].join('\n'), 16)}
${cards([
    ['vm.swappiness 60', 'swap anon vs drop cache — measured per cgroup in 8.2'],
    ['vm.overcommit_memory 1', 'promise more than RAM? — 8.3'],
    ['vm.dirty_* 20 / 10', 'write-back throttling — <i>not measured</i>'],
    ['THP always', 'fewer TLB misses vs compaction spikes — 7.2'],
  ], 4)}` },

  { t: 'CPU governor and NUMA: absent in this VM', giua: true, body: `
${tiny([g(F, 'ls /sys/devices/system/cpu/cpu0/cpufreq'), g(F, "lscpu | grep -E 'NUMA")].join('\n'), 16)}
${cards([
    ['CPU governor — not measured', 'the host controls frequency. Bare metal: performance (max clock, lower latency) vs schedutil/powersave'],
    ['NUMA — conceptual', 'one memory node here. Two sockets: remote RAM is slower ⇒ numactl, bind or interleave, NUMA balancing'],
  ], 2)}` },

  { t: 'A table to keep', giua: true, body: `
<table class="t" style="font-size:19px">
<tr><th>knob</th><th>scope</th><th>here</th><th>evidence to change it</th><th>measured</th></tr>
<tr><td>somaxconn + app backlog</td><td>netns / socket</td><td>4096 / 511</td><td>ListenOverflows &gt; 0, 1 s/3 s connects</td><td>15.7</td></tr>
<tr><td>ulimit -n (LimitNOFILE)</td><td>process</td><td>1 048 576</td><td>EMFILE, held = limit − ~20</td><td>15.7, 10.4</td></tr>
<tr><td>vm.swappiness</td><td>machine / cgroup</td><td>60</td><td>reclaim stalls, PSI memory, swap-in</td><td>8.2</td></tr>
<tr><td>vm.overcommit_memory</td><td>machine</td><td>1</td><td>allocation failures vs OOM kills</td><td>8.3</td></tr>
<tr><td>vm.dirty_*</td><td>machine</td><td>20 / 10</td><td>writers throttled, write bursts</td><td>—</td></tr>
<tr><td>THP</td><td>machine</td><td>always</td><td>compaction spikes, RSS bloat</td><td>7.2</td></tr>
<tr><td>governor · NUMA</td><td>machine</td><td>absent</td><td>frequency in latency; remote memory</td><td>—</td></tr>
</table>` },

  { t: 'Takeaways', to: true, giua: true, body: `
<ul>
<li>No measured saturation or error ⇒ <b>no knob</b></li>
<li>One change, same load, before/after — then write it down</li>
<li>somaxconn: ${p50(b128).toLocaleString('en')} → ${p50(b4096)} ms on a burst; it is <b>min(backlog, somaxconn)</b></li>
<li>ulimit -n: hit silently — check what the service really holds</li>
<li>Global knobs on a shared machine: read, don’t write</li>
</ul>` },
]);
