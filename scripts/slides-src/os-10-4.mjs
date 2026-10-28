/**
 * os-10-4 — khoá "Operating Systems for Developers", bài 10.4 "C10K, measured" (28/10/2026).
 * Output từ lab/out/c104-c10k|pids|mem|fd.out.txt. Giảng: giang/os-10-4.mjs.
 */
import { lamDeck, box, cards, vsd, tbl, two } from './_pg-chung.mjs';
import { META, g, SRC, bo, noCmt, tiny, code, T, R, A, svg, bars, BL, GR, RD, OR, PU } from './os-10-chung.mjs';

export const deck = { key: 'os-10-4', code: 'OS 10.4', title: 'C10K, measured', sub: 'Operating Systems · Chapter 10' };
const F = 'c104-c10k';

/* hai thiết kế: mỗi kết nối một luồng vs một vòng epoll */
const haiThietKe = () => {
  let s = '';
  s += T(260, 26, 'one thread per connection', 20, { a: 'middle', w: 700, f: RD });
  s += T(830, 26, 'one event loop', 20, { a: 'middle', w: 700, f: GR });
  for (let i = 0; i < 5; i++) {
    const y = 50 + i * 52;
    s += R(30, y, 130, 38, BL + '14', BL) + T(95, y + 25, `client ${i + 1}`, 15, { a: 'middle', f: BL });
    s += A(162, y + 19, 228, y + 19, '#999');
    s += R(230, y, 270, 38, RD + '14', RD) + T(365, y + 25, `thread ${i + 1}: sleeps in read()`, 15, { a: 'middle', f: RD });
  }
  s += T(265, 330, '10,000 clients ⇒ 10,000 threads', 16, { a: 'middle', w: 700, f: RD });
  for (let i = 0; i < 5; i++) {
    const y = 50 + i * 52;
    s += R(600, y, 130, 38, BL + '14', BL) + T(665, y + 25, `client ${i + 1}`, 15, { a: 'middle', f: BL });
    s += A(732, y + 19, 818, 150, '#999');
  }
  s += R(820, 110, 130, 80, OR + '14', OR) + T(885, 145, 'epoll', 18, { a: 'middle', w: 700, f: '#9a4a12' }) + T(885, 170, 'ready list', 14, { a: 'middle', f: '#666' });
  s += A(952, 150, 990, 150);
  s += R(992, 100, 110, 100, GR + '14', GR) + T(1047, 140, '1 thread', 16, { a: 'middle', w: 700, f: GR }) + T(1047, 164, 'runs handler', 13, { a: 'middle', f: '#555' }) + T(1047, 182, 'of ready fds', 13, { a: 'middle', f: '#555' });
  s += T(850, 330, '10,000 clients ⇒ 1 thread + 10,000 sockets', 16, { a: 'middle', w: 700, f: GR });
  return svg(1110, 345, s);
};

export const slides = lamDeck(META('10.4'), [
  { cover: true, t: 'C10K, measured', sub: 'One thread per connection vs one epoll loop at 1,000, 5,000 and 10,000 connections' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Two servers, one load generator, <b>1k / 5k / 10k</b> connections</li>
<li>Memory, threads, CPU, context switches and <b>p99 latency</b>, measured</li>
<li>Where a thread’s memory hides: the <b>kernel stack</b></li>
<li>Why <b>connections ≠ concurrency</b> (Little’s law)</li>
<li>The three walls: <b>pids</b>, <b>memory</b> and <b>fd</b> limits</li>
</ul>` },

  { t: 'Two designs from 1999 to today', giua: true, body: haiThietKe() },

  { t: 'The load generator: one thread, epoll, real round trips', giua: true, body: two(
    cards([
      ['tai.c', 'opens N connections, sends 64 B on each at a fixed rate, measures each echo’s <b>round trip</b>'],
      ['late sends', 'counts when the generator itself falls behind — so we know who is the bottleneck'],
      ['c10k.sh', 'fresh server per run; at second 3 photographs threads, fds, RSS, CPU, context switches, KernelStack'],
    ], 1),
    code(noCmt(SRC('c10k.sh')).split('\n').filter((l) => l && !l.startsWith('#')).join('\n'), 'bash', 14), 'r46') },

  { t: 'Light load — 10,000 connections, 1 message/s each', giua: true, body: `
${tiny(g(F, './c10k.sh echo-thread 10000 1000'), 15)}
${tiny(bo(g(F, './c10k.sh echo-epoll 10000 1000'), /^# /), 15)}` },

  { t: 'Same latency — very different cost', giua: true, body: two(
    bars([
      ['threads: RSS', 122.6, RD, '122.6 MiB'], ['threads: kernel stacks', 156, RD, '+156 MiB'],
      ['epoll: RSS', 40.9, GR, '40.9 MiB'], ['epoll: kernel stacks', 0.1, GR, '+0'],
    ], { w: 700, label: 230, max: 160, rowH: 50, fs: 16 }),
    tbl(['10,000 conns', 'threads', 'epoll'], [['threads', '10,001', '1'], ['CPU in 3 s', '1.02 s', '0.41 s'], ['ctx switches', '32,136', '5,956'], ['p50 / p99', '0.11 / 1.92 ms', '0.10 / 1.36 ms']]), 'r64') +
    box('', 'Each thread has a <b>16 KiB kernel stack</b> (10,000 × 16 KiB = 156 MiB) — invisible in RSS, charged to the memory cgroup.', 'lam') },

  { t: 'Busy load — 10 messages/s per connection', giua: true, body: `
${tiny(g(F, './c10k.sh echo-thread 10000 100'), 15)}
${tiny(bo(g(F, './c10k.sh echo-epoll 10000 100'), /^# /), 15)}` },

  { t: 'At 100,000 messages/s, threads fall over', giua: true, body: `
${tbl(['busy load (10 msg/s each)', 'CPU in 3 s', 'ctx switches', 'p50', 'p99'], [
    ['1,000 · threads', '1.02 s', '31,318', '0.11 ms', '2.95 ms'], ['1,000 · epoll', '0.45 s', '4,001', '0.09 ms', '2.51 ms'],
    ['5,000 · threads', '2.72 s', '153,346', '0.05 ms', '24.50 ms'], ['5,000 · epoll', '0.96 s', '48,135', '0.04 ms', '0.23 ms'],
    ['10,000 · threads', '3.06 s', '206,518', '95.09 ms', '321.67 ms'], ['10,000 · epoll', '1.33 s', '44,092', '0.05 ms', '0.38 ms'],
  ], { hl: [2, 4] })}
${box('', '10,001 runnable threads fight for 10 cores: every wake-up is a context switch, even the load generator is starved (61,800 late sends). Across repeated runs the 10,000-thread p99 ranged ~140–320 ms.', 'do2')}` },

  { t: 'Connections are not concurrency', to: true, giua: true, body: `
${box('Little’s law: L = λ × W', '10,000 connections × 1 msg/s ⇒ λ = 10,000 messages/s<br>W ≈ 0.1 ms per message ⇒ <b>L ≈ 1 message in progress</b> at any moment', 'lam')}
${cards([
    ['thread per connection', 'pays for 10,000 sleeping threads to do the work of one'],
    ['event loop', 'pays for a socket and a small buffer per idle connection'],
  ], 2)}` },

  { t: 'Wall 1 — the pids limit (containers, k8s, systemd)', giua: true, body: `
${tiny(g('c104-pids', 'cat /sys/fs/cgroup/pids.max', 4), 15)}
${tiny(g('c104-pids', './echo-epoll 7000', 2), 15)}` },

  { t: 'Wall 2 — the memory limit, kernel stacks included', giua: true, body: `
${tiny(bo(g('c104-mem', './echo-thread 7001', 4), /^$/), 15)}
${tiny(g('c104-mem', './echo-epoll 7000', 3), 15)}` },

  { t: 'Wall 3 — the fd limit: 100% CPU doing nothing', giua: true, body: `
${tiny(g('c104-fd', 'ulimit -Sn 1024', 5), 14)}
${box('', 'accept4 → <b>EMFILE</b>, the connection stays queued, the level-triggered listening socket is ready again at once: <b>1.97 s of CPU in 2 s</b>.', 'do2')}` },

  { t: 'How real servers survive EMFILE', to: true, giua: true, body: cards([
    ['libuv (Node)', 'keeps a spare fd; on EMFILE closes it, accepts and closes waiting clients, reopens the spare'],
    ['nginx', 'stops watching the listening sockets for a moment and logs <code>accept4() failed (24: Too many open files)</code>'],
    ['you', 'raise <b>ulimit -n</b> / LimitNOFILE — Docker gives 1,048,576, many hosts start at 1,024'],
  ]) },

  { t: 'Pitfall, and when threads are fine', giua: true, to: true, body: vsd(
    'Sizing a thread-heavy service by <b>RSS</b>: 122 MiB said “fits in 192 MiB” — the container died with exit 137 at ~4,600 connections.',
    'Size by the cgroup’s <b>memory.current</b>. Threads are fine for short requests (Tomcat’s 200). For long-lived idle connections use an event loop — or <b>virtual threads / goroutines</b>, which wait on epoll for you.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Light load: both fine; threads cost 3× RSS + <b>16 KiB kernel stack</b> each</li>
<li>10 msg/s each: threads <b>p99 24.5 ms</b> at 5k, <b>322 ms</b> at 10k; epoll <b>0.23 / 0.38 ms</b></li>
<li>Connections ≠ concurrency: <b>L = λW ≈ 1</b> message in progress</li>
<li>Walls: pids (<b>EAGAIN at 997</b>), memory (<b>OOM 137 at ~4,600</b>), fds (<b>100% CPU spin</b>)</li>
<li>Handle EMFILE explicitly; size by <b>memory.current</b>, not RSS</li>
</ul>` },
]);
