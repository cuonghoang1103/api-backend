/**
 * os-10-1 — khoá "Operating Systems for Developers", bài 10.1 "A connection is a file descriptor" (28/10/2026).
 * Khuôn _pg-chung.mjs; phần chung os-10-chung.mjs. Output từ lab/out/c101-socket.out.txt. Giảng: giang/os-10-1.mjs.
 */
import { lamDeck, box, cards, vsd, tbl, two } from './_pg-chung.mjs';
import { META, g, SRC, dong, noCmt, tiny, code, T, R, A, svg, BL, GR, RD, OR } from './os-10-chung.mjs';

export const deck = { key: 'os-10-1', code: 'OS 10.1', title: 'A connection is a file descriptor', sub: 'Operating Systems · Chapter 10' };
const F = 'c101-socket';

/* socket nghe → hàng chờ accept → accept() → fd mới */
const hangCho = () => {
  let s = '';
  s += R(20, 60, 190, 90, BL + '14', BL) + T(115, 98, 'clients', 20, { a: 'middle', w: 700, f: BL }) + T(115, 124, 'SYN, ACK…', 15, { a: 'middle', f: '#555' });
  s += A(212, 105, 290, 105);
  s += R(292, 40, 420, 150, OR + '12', OR, { dash: '7 5' }) + T(502, 64, 'listening socket — fd 3 (port 7000)', 16, { a: 'middle', w: 700, f: '#9a4a12' });
  s += T(502, 86, 'kernel finishes the TCP handshake by itself', 14, { a: 'middle', f: '#555' });
  for (let i = 0; i < 5; i++) s += R(318 + i * 76, 104, 64, 44, i < 2 ? GR + '22' : '#fff', i < 2 ? GR : '#bbb') + T(350 + i * 76, 132, i < 2 ? 'conn' : '', 14, { a: 'middle', f: GR, w: 700 });
  s += T(502, 176, 'accept queue (max = backlog)', 16, { a: 'middle', w: 700, f: '#9a4a12' });
  s += A(714, 105, 800, 105) + T(757, 92, 'accept()', 15, { a: 'middle', m: 1, f: '#b85a2b' });
  s += R(802, 40, 270, 130, BL + '10', BL) + T(937, 66, 'your process', 18, { a: 'middle', w: 700, f: BL });
  ['fd 4 → client A', 'fd 5 → client B', 'fd 6 → client C'].forEach((x, i) => { s += T(830, 98 + i * 24, x, 16, { m: 1 }); });
  s += R(292, 228, 420, 70, RD + '10', RD) + T(502, 256, 'queue FULL ⇒ the kernel drops the SYN', 17, { a: 'middle', w: 700, f: RD });
  s += T(502, 282, 'client retries after 1 s, 3 s, 7 s — no error, just delay', 15, { a: 'middle', f: '#555' });
  s += A(502, 192, 502, 226, RD, { dash: '6 4' });
  return svg(1100, 310, s);
};

export const slides = lamDeck(META('10.1'), [
  { cover: true, t: 'A connection is<br>a file descriptor', sub: 'Sockets, the accept queue, and what one connection costs' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Follow one TCP connection <b>call by call</b>: socket, bind, listen, accept, read, write, close</li>
<li>See the <b>listening socket</b> and one fd per client in <code>/proc</code> and <code>ss</code></li>
<li>Understand the <b>accept queue</b> — and what happens when it is full</li>
<li>Measure the <b>default backlog</b> of Python, Java, Node and nginx</li>
<li>Measure what <b>10,000 idle connections</b> cost the kernel</li>
</ul>` },

  { t: 'The question of this chapter', to: true, giua: true, body: `
${box('', '<b>"My server must handle thousands of requests at the same time."</b> How does one machine wait for thousands of clients without wasting CPU — and what breaks first?', 'lam')}
${cards([
    ['10.1–10.3', 'What a connection is · five ways to wait · select, poll, epoll'],
    ['10.4–10.5', 'C10K measured · Node, nginx, Netty, Go, asyncio on epoll'],
    ['10.6–10.8', 'Disk in an event loop · io_uring · backpressure and timeouts'],
  ])}` },

  { t: 'The smallest server: one client at a time', giua: true, body: `
${code(noCmt(dong(SRC('echo1.c'), 7, 25)), 'c', 14)}
${box('', '<b>socket()</b> makes the “ear” · <b>bind + listen</b> give it a port · <b>accept()</b> returns a NEW fd per client · <b>read/write</b> on that fd, then <b>close</b>', 'lam')}` },

  { t: 'One connection, call by call', giua: true, body: `
${tiny(g(F, "sed -n '/^socket/,$p'"), 17)}
${box('', 'The last line has no result: the server is <b>asleep inside accept()</b>, waiting for the next client.', 'xanh')}` },

  { t: 'One listening socket, one fd per client', giua: true, body: `
${tiny(g(F, 'E=$(pgrep -x echo1)', 3), 15)}
${box('', '<b>fd 3</b> = listening socket, <b>fd 4</b> = the client. The number in <code>socket:[…]</code> is the socket’s inode. 10,000 clients ⇒ 10,001 fds.', 'lam')}` },

  { t: '“Connected” is not “accepted”', giua: true, body: `
${tiny(g(F, "printf 'second", 2), 19)}
${box('', 'Client 2’s connection <b>succeeded</b> — the kernel finished the handshake and queued it (<b>Recv-Q 1</b>). But the one-thread server is busy in <code>read()</code> for client 1, so client 2 gets nothing.', 'do2')}` },

  { t: 'Where clients wait before your code sees them', giua: true, body: `${hangCho()}
${cards([
    ['Recv-Q (LISTEN)', 'connections that finished the handshake and wait for <b>accept()</b>'],
    ['Send-Q (LISTEN)', 'the <b>backlog</b> from listen(), capped by somaxconn'],
    ['client side', 'connect() already returned — the client thinks it is <b>connected</b>'],
  ])}` },

  { t: 'Backlog 4, never accept: connection 6 hangs', giua: true, body: `
${tiny(g(F, './noaccept 4', 2), 15)}
${box('', 'Linux queues <b>backlog + 1 = 5</b>. Connections 6–8 get no error: their SYN is dropped and the client keeps waiting.', 'do2')}` },

  { t: 'The full queue is visible — and counted', giua: true, body: `
${tiny(g(F, "ss -ltn '( sport = :7100 )'", 2), 19)}
${cards([
    ['Recv-Q 5', 'connections waiting for accept()'],
    ['Send-Q 4', 'the backlog passed to listen()'],
    ['ListenOverflows', 'drops counted by the kernel — watch it with <code>nstat</code>'],
  ])}` },

  { t: 'The backlog your runtime really uses', giua: true, body: `
${tiny(g(F, 'ss -ltnp'), 15)}
${tbl(['server (default)', 'backlog', 'change it with'], [
    ['Python http.server', '5', 'request_queue_size'], ['Java new ServerSocket(port)', '50', 'ServerSocket(port, backlog) · Tomcat accept-count'],
    ['Node listen(port)', '511', 'listen({ port, backlog })'], ['nginx listen 8080', '511', 'listen 8080 backlog=4096;'],
    ['kernel ceiling', 'somaxconn = 4096', 'larger values are capped'],
  ])}` },

  { t: '10,000 idle connections: ≈ 3 KB each in the kernel', giua: true, body: two(
    `<div style="display:flex;flex-direction:column;gap:10px">${tiny(g(F, "grep -E '^(TCP|sockets)' /proc/net/sockstat"), 14)}${tiny(g(F, './tai 7000 10000 3 0', 2), 14)}</div>`,
    box('Read it', '20,000 sockets (both ends are in the lab)<br>Slab +64 MiB ⇒ <b>≈ 3 KB per socket</b><br><b>TCP mem unchanged</b>: idle buffers are empty<br>41.6 MiB RSS = our 4 KiB buffer per connection', 'lam'), 'r64') },

  { t: 'Two mistakes with the accept queue', giua: true, to: true, body: vsd(
    '“The port answers, so the service is healthy.” A TCP check passes even when the app is frozen — the connection just waits in the queue.<br><br>“Raise the backlog to 65535.” More clients wait longer, then time out.',
    'Health checks must get an <b>answer from the app</b> (HTTP /health with a deadline).<br><br>Find out <b>why accept is slow</b> (blocked loop, busy threads) — then size the backlog for bursts.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>A connection is an fd: one listening socket + one fd from <b>accept()</b> per client</li>
<li>The kernel finishes handshakes alone; clients wait in the <b>accept queue</b></li>
<li>Full queue ⇒ <b>SYN dropped</b> ⇒ 1 s / 3 s delays, <b>ListenOverflows</b> grows</li>
<li>Defaults: Python 5 · Java 50 · Node/nginx 511 · capped by somaxconn</li>
<li>An idle connection ≈ <b>3 KB</b> of kernel memory + what your runtime adds</li>
</ul>` },
]);
