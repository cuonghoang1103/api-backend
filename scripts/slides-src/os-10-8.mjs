/**
 * os-10-8 — khoá "Operating Systems for Developers", bài 10.8 "Backpressure, slow clients and timeouts" (28/10/2026).
 * Output từ lab/out/c108-backpressure.out.txt. Giảng: giang/os-10-8.mjs.
 */
import { lamDeck, box, cards, vsd, tbl, two, flow } from './_pg-chung.mjs';
import { META, g, SRC, dong, noCmt, tiny, code, T, R, A, svg, bars, BL, GR, RD, OR, PU } from './os-10-chung.mjs';

export const deck = { key: 'os-10-8', code: 'OS 10.8', title: 'Backpressure, slow clients and timeouts', sub: 'Operating Systems · Chapter 10' };
const F = 'c108-backpressure';

/* dữ liệu chờ ở đâu: hàng đợi app → bộ đệm gửi → mạng → bộ đệm nhận → app đọc chậm */
const boDem = () => {
  let s = '';
  const box1 = (x, w, t1, t2, c) => { s += R(x, 60, w, 110, c + '12', c) + T(x + w / 2, 98, t1, 17, { a: 'middle', w: 700, f: c }) + T(x + w / 2, 126, t2, 14, { a: 'middle', f: '#555' }); };
  box1(20, 210, 'your app’s queue', 'writableLength (Node)', RD);
  box1(290, 210, 'socket send buffer', 'SO_SNDBUF · autotuned', OR);
  box1(560, 150, 'network', 'TCP window', BL);
  box1(770, 210, 'receive buffer', 'peer’s SO_RCVBUF', OR);
  s += R(1000, 60, 90, 110, GR + '12', GR) + T(1045, 106, 'slow', 16, { a: 'middle', w: 700, f: GR }) + T(1045, 128, 'reader', 16, { a: 'middle', w: 700, f: GR });
  s += A(232, 115, 288, 115) + A(502, 115, 558, 115) + A(712, 115, 768, 115) + A(982, 115, 998, 115);
  s += T(395, 200, 'full ⇒ write() returns EAGAIN', 15, { a: 'middle', w: 700, f: OR }) + T(395, 222, '(Node: write() returns false)', 14, { a: 'middle', f: '#555' });
  s += T(125, 200, 'grows without limit', 15, { a: 'middle', w: 700, f: RD }) + T(125, 222, 'if you ignore that signal', 14, { a: 'middle', f: '#555' });
  s += T(875, 200, 'fills when the reader is slow', 15, { a: 'middle', w: 700, f: OR });
  s += T(555, 30, 'where data waits when one side is slower', 17, { a: 'middle', w: 700, f: '#666' });
  return svg(1100, 240, s);
};
/* hạn chờ im lặng vs hạn chót tổng với một khách gửi 1 byte mỗi giây */
const hanCho = () => {
  const X = 200, sx = (t) => X + t * 140;
  let s = '';
  for (let t = 0; t <= 6; t++) s += `<line x1="${sx(t)}" y1="40" x2="${sx(t)}" y2="230" stroke="#eee" stroke-width="2"/>` + T(sx(t), 30, `${t} s`, 14, { a: 'middle', f: '#888' });
  s += T(X - 14, 70, 'slow client', 16, { a: 'end', w: 700 });
  for (let t = 0; t <= 6; t++) s += `<circle cx="${sx(t)}" cy="64" r="7" fill="${BL}"/>`;
  s += T(X - 14, 130, 'idle 2 s', 16, { a: 'end', w: 700, f: RD });
  for (let t = 0; t < 6; t++) s += R(sx(t) + 4, 114, 132, 26, RD + '18', RD, { rx: 4 }) + T(sx(t) + 70, 132, 'reset', 13, { a: 'middle', f: RD });
  s += T(X - 14, 200, 'deadline 2 s', 16, { a: 'end', w: 700, f: GR });
  s += R(sx(0), 184, sx(2) - sx(0), 26, GR + '22', GR, { rx: 4 }) + T(sx(1), 202, 'header must arrive in 2 s', 13, { a: 'middle', f: GR, w: 700 });
  s += T(sx(2) + 10, 202, '✂ closed at 2 s — worker free', 15, { f: GR, w: 700 });
  s += T(1110, 162, 'never fires', 15, { a: 'end', f: RD, w: 700 });
  return svg(1120, 240, s);
};

export const slides = lamDeck(META('10.8'), [
  { cover: true, t: 'Backpressure, slow clients<br>and timeouts', sub: 'A checklist for servers that must handle thousands of requests at the same time' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>How much the kernel buffers for you: <b>SO_SNDBUF</b>, autotuning, EAGAIN</li>
<li><b>Backpressure</b> in Node: 315 MiB vs 50 MiB for one slow client</li>
<li>Slow clients: why an <b>idle timeout</b> loses and a <b>deadline</b> wins</li>
<li>The timeouts you inherit: <b>connect ≈ 127 s</b>, <b>keepalive 2 h</b></li>
<li>The <b>checklist</b> for “thousands of requests at the same time”</li>
</ul>` },

  { t: 'Where data waits when one side is slower', giua: true, body: boDem() },

  { t: 'Socket buffers, measured', giua: true, body: `
${tiny(g(F, './sndbuf', 2), 14)}
${box('', 'Default 16 KiB, <b>autotuned to 2.6 MB</b>: 2,625,024 bytes accepted before <b>EAGAIN</b>. Set by hand to 4096 ⇒ the kernel reports <b>8192</b> (doubled) and autotuning is <b>off</b>: 80 KB fit.', 'lam')}` },

  { t: 'One slow client, 256 MiB to send', giua: true, body: `
${tiny(g(F, 'node flood.js ignore', 2), 15)}
${bars([['ignore write() return', 315, RD, 'RSS 315 MiB · 253 MiB queued in Node'], ['respect false / drain', 50, GR, 'RSS 50 MiB · 0 queued']], { rowH: 50, fs: 17, label: 260, max: 330 })}` },

  { t: 'Backpressure: when the next stage is full, stop pulling', giua: true, body: flow([
    { t: 'database / file', s: 'source', mau: BL }, { t: 'your handler', s: 'pull only when…', mau: PU },
    { t: 'stream buffer', s: 'highWaterMark 64 KiB', mau: OR }, { t: 'socket buffer', s: 'EAGAIN when full', mau: OR }, { t: 'slow client', s: '1 MiB/s', mau: GR },
  ], { h: 160, fs: 19 }) + cards([
    ['Node', '<code>stream.pipeline()</code>, <code>.pipe()</code>, or stop on <b>write() === false</b> and resume on <b>drain</b>'],
    ['Python asyncio', '<code>await writer.drain()</code> after every write'],
    ['C / epoll', 'partial write ⇒ keep the rest, wait for <b>EPOLLOUT</b>, stop reading (echo-epoll.c)'],
  ]) },

  { t: 'Slow clients vs a pool of 8 threads', giua: true, body: `
${code(noCmt(dong(SRC('pool-http.c'), 21, 36)), 'c', 13)}
${cards([
    ['none', 'no timeout at all'], ['idle', 'SO_RCVTIMEO 2 s per read()'], ['deadline', 'headers within 2 s of accept'],
  ])}` },

  { t: 'Only the deadline frees the workers', giua: true, body: `
${tbl(['mode', 'normal request (curl -m 4)', 'curl exit', 'slow connections open after 6 s'], [
    ['none', 'HTTP 000 after 4.01 s', '28 (timeout)', '8 / 8'],
    ['idle (SO_RCVTIMEO 2 s)', 'HTTP 000 after 4.00 s', '28 (timeout)', '8 / 8'],
    ['deadline (2 s total)', '<b>HTTP 200 after 1.00 s</b>', '0', '<b>0 / 8</b> (first closed ~3 s)'],
  ], { hl: [2] })}
${tiny(g(F, './pool-http deadline', 4), 14)}` },

  { t: 'Why the idle timeout never fires', giua: true, body: hanCho() + box('', 'A byte every second <b>resets</b> a per-read timeout. Only a <b>total</b> deadline for headers/request ends it — nginx <code>client_header_timeout</code>, Node <code>headersTimeout</code>/<code>requestTimeout</code>.', 'lam') },

  { t: 'Node with 1,000 slow connections', giua: true, body: `
${tiny(g(F, 'node slow-node.js', 4), 14)}
${tiny(g(F, 'CHECK=500 node slow-node.js', 2), 14)}
${box('', 'The event loop still answers in 3 ms. But <b>headersTimeout = 2 s</b> is only checked every <b>connectionsCheckingInterval = 30 s</b>: after 8 s all 1,000 were still open.', 'do2')}` },

  { t: 'Timeouts you inherit from the kernel', giua: true, body: `
${tiny(g(F, 'cat /proc/sys/net/ipv4/tcp_syn_retries', 4), 16)}
${cards([
    ['connect()', 'syn_retries 2 (this container) ⇒ 7.2 s; Linux default 6 ⇒ <b>≈ 127 s</b>; explicit timeout ⇒ 1.04 s'],
    ['TCP keepalive', 'off unless enabled; defaults find a dead peer after <b>> 2 hours</b>'],
    ['so', 'set connect, read and idle timeouts in every client: DB driver, HTTP client'],
  ])}` },

  { t: 'Keep-alive timeouts must grow towards the app', giua: true, to: true, body: flow([
    { t: 'browser', mau: BL }, { t: 'CDN / LB', s: 'idle 60 s', mau: OR }, { t: 'nginx', s: 'upstream keepalive', mau: PU }, { t: 'Node', s: 'keepAliveTimeout 5 s', mau: RD },
  ], { h: 160, fs: 21 }) + vsd('The proxy keeps an idle connection 60 s; Node closes it after 5 s ⇒ a request races the close ⇒ <b>random 502</b>.', 'Each server’s keep-alive timeout <b>longer</b> than the idle timeout of the proxy in front of it. Check every hop.') },

  { t: 'Checklist (1/2): thousands of requests at the same time', giua: true, body: tbl(['question', 'measured in this chapter', 'do'], [
    ['Which I/O model?', 'all six runtimes wait on epoll (10.5)', 'never block the loop · size pools by Little’s law'],
    ['Are connections cheap?', '~3 KB kernel per idle socket vs +16 KiB stack per thread', 'long-lived idle connections → event loop / virtual threads'],
    ['Which limit stops me first?', 'pids EAGAIN at 997 · OOM 137 at ~4,600 · ulimit 1024 spin', 'raise nofile, pids, memory (memory.current), backlog'],
    ['What about bursts?', 'full accept queue: silent SYN drops, 1–3 s', 'accept fast · backlog for bursts · watch ListenOverflows'],
  ]) },

  { t: 'Checklist (2/2)', giua: true, body: tbl(['question', 'measured in this chapter', 'do'], [
    ['Does anything block the loop or pool?', 'readFileSync 1.26 s · dns.lookup 0.94 s behind file chunks', 'no Sync in handlers · nginx/CDN for files · measure loop lag'],
    ['Backpressure everywhere?', '253 MiB queued for one slow client', 'pipeline / drain · bounded queues · reject early (429/503)'],
    ['A deadline for every wait?', 'idle timeout lost · Node checks every 30 s · connect ≈ 127 s', 'connect/header/request/upstream timeouts · keep-alive order'],
    ['Who faces slow clients?', 'nginx: 2,000 idle conns, 1 thread, 14 MiB per worker', 'nginx in front: buffering, sendfile'],
    ['Measuring the right thing?', 'threads p99 24.5 ms at 5k, 322 ms at 10k (10 msg/s)', 'load-test realistic connection counts; watch p99, fds, threads'],
  ]) },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Kernel buffers absorb a little (2.6 MB); then <b>EAGAIN / write() false</b> = stop</li>
<li>Ignore it and the queue moves into your process: <b>253 MiB</b> for one client</li>
<li>Slow clients beat idle timeouts; <b>total deadlines</b> free the workers</li>
<li>Know how timeouts are enforced (Node: every <b>30 s</b>) and kernel defaults (<b>127 s</b>, <b>2 h</b>)</li>
<li>Thousands of requests = event loop or cheap threads + limits + backpressure + deadlines + nginx in front</li>
</ul>` },
]);
