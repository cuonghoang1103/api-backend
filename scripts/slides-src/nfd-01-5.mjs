/**
 * nfd-01-5 — Networking for Developers, bài 1.5 "Cổng và socket: một máy phục vụ nhiều ứng dụng thế nào" (slug
 * netdev-1-4-cong-socket). Output = CHẠY THẬT đọc bằng ra() (lab/out/c14-*.out.txt). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, sh, two, box, cards, kw, bang, steps, vsd, svg, T, R, C, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-01-5', code: 'NFD 1.5', title: 'Ports and sockets', sub: 'Networking for Developers · Chapter 1' };
const term = (t, o = {}) => sh(t, o);

/* Một socket nghe + ba socket đã kết nối, tất cả cổng 80; gói tới được tra theo bộ 4 */
const demux = () => {
  const w = 1110, h = 300;
  let s = R(700, 10, 400, 280, '#f7f7f7', '#999', { rx: 12 }) + T(900, 36, 'web 10.10.2.10 — kernel socket table', 17, { a: 'middle', w: 800, f: '#444' });
  const rows = [['LISTEN', '0.0.0.0:80', '*:*', C.app], ['ESTAB', '10.10.2.10:80', '10.10.1.10:A', C.tcp], ['ESTAB', '10.10.2.10:80', '10.10.1.10:B', C.tcp], ['ESTAB', '10.10.2.10:80', '10.10.1.11:C', C.tcp]];
  rows.forEach(([st, l, r, c], i) => {
    const y = 52 + i * 56;
    s += R(716, y, 368, 46, c + '1c', c, { rx: 8 }) + T(730, y + 29, st, 16, { w: 800, f: c }) + T(810, y + 29, l, 15, { m: 1 }) + T(960, y + 29, r, 15, { m: 1, f: '#555' });
  });
  const pk = [['10.10.1.10:A → :80', 108], ['10.10.1.10:B → :80', 164], ['10.10.1.11:C → :80', 220], ['new SYN → :80', 52]];
  pk.forEach(([t, y], i) => {
    s += R(10, y - 2, 300, 40, i === 3 ? C.app + '18' : C.tcp + '14', i === 3 ? C.app : C.tcp, { rx: 6, sw: 2 }) + T(160, y + 24, t, 16, { a: 'middle', m: 1, w: 700 });
    s += `<line x1="312" y1="${y + 18}" x2="712" y2="${y + 18}" stroke="${i === 3 ? C.app : C.tcp}" stroke-width="2.5" stroke-dasharray="${i === 3 ? '7 5' : ''}"/>`;
  });
  s += T(160, 290, 'A, B, C = temporary ports chosen by the clients', 15, { a: 'middle', f: '#666', i: 1 });
  return svg(w, h, s);
};

export const slides = lamDeck({ chuong: 'Chapter 1 — Layers and packets', bai: '1.5' }, [
  { cover: true, t: 'Ports and sockets', sub: 'How one server serves many programs and many clients —<br>and the bug behind “it works on my machine”', nhan: 'Chapter 1 · Lesson 1.5' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>port</b> is, which ones are well known, and where the client’s port comes from</li>
<li>What a <b>socket</b> is: a kernel object named by five values</li>
<li>Reading <code class="i">ss</code>: one listening socket, many connections on the <b>same</b> port</li>
<li><b>127.0.0.1 vs 0.0.0.0</b>: why your API works locally and refuses everyone else</li>
<li><code class="i">EADDRINUSE</code>, Docker’s <code class="i">-p</code>, and where sockets live in the computer</li>
</ul>` },

  { t: 'A port picks the program on a machine', body: `
${bang(['Range', 'Name', 'Examples'], [
    ['0 – 1023', 'well-known (binding normally needs root)', '22 SSH · 53 DNS · 80 HTTP · 443 HTTPS'],
    ['1024 – 49151', 'registered', '3000 Node dev · 5432 PostgreSQL · 6379 Redis · 8080'],
    ['32768 – 60999', '<b>ephemeral</b> on Linux: given to clients', 'the “random” source port of curl'],
  ], { fs: 21 })}
${term(ra('c14-client', 'sysctl', 1))}
<p style="margin:0;font-size:20px">A port is just a <b>16-bit number</b> in the TCP/UDP header (lesson 1.3). The IP address picks the machine; the port picks the program on it.</p>` },

  { t: 'A socket is named by five values', to: true, giua: true, body: `
${cards([
    ['protocol', 'TCP or UDP'],
    ['local address : port', 'e.g. 10.10.2.10:80'],
    ['remote address : port', 'e.g. 10.10.1.10:50676'],
  ])}
${bang(['Kind', 'Created by', 'What it does'], [
    ['<b>listening</b> socket', '<code class="i">listen(80)</code> in nginx', 'waits for new connections; remote = <code class="i">*:*</code>'],
    ['<b>connected</b> socket', '<code class="i">accept()</code> in the server · <code class="i">connect()</code> in the client', 'carries one conversation; all five values known'],
  ], { fs: 21 })}` },

  { t: 'ss -tlnp: who is listening on this machine?', giua: true, body: `
${term(ra('c14-web', 'ss -tlnp', 1), { title: 'the web server (nginx)' })}
${two(box('Read it', '<b>0.0.0.0:80</b> — nginx listens on port 80 of <b>every</b> address of this machine. Send-Q 511 is the backlog: how many finished handshakes may wait to be accepted.', 'lam'),
    box('And the other line?', '<b>127.0.0.11:…</b> is Docker’s built-in DNS server for container names. Reading <code class="i">ss</code> always teaches you something about the machine.', ''))}
<p style="margin:0">${kw('-t', 'TCP')} ${kw('-l', 'listening')} ${kw('-n', 'numbers, no names')} ${kw('-p', 'process')}</p>` },

  { t: 'One port, many connections', giua: true, body: `
${term(ra('c14-web', "ss -tanp", 1), { sm: true, title: 'while client holds 2 connections and client2 holds 1' })}
${demux()}` },

  { t: 'How the kernel picks the right socket', to: true, giua: true, body: `
${steps([
    'A segment arrives for <b>10.10.2.10:80</b> from <b>10.10.1.10:A</b>',
    'Look for a <b>connected</b> socket with exactly these four values ⇒ found ⇒ its data goes into that socket’s buffer',
    'Nothing matches and it is a <b>SYN</b> ⇒ the <b>listening</b> socket on :80 takes it ⇒ handshake ⇒ queued for <code class="i">accept()</code>',
    'Nothing matches and nothing listens ⇒ the kernel answers <b>RST</b> ⇒ the client sees “connection refused”',
  ])}` },

  { t: 'The client side: a new port every time', giua: true, body: `
${term(ra('c14-client', 'ss -tanp', 1, { max: 11 }), { sm: true })}
${term(ra('c14-client', 'for i in 1 2 3', 1, { cut: 112 }), { sm: true })}
<p style="margin:0;font-size:19px">Two live connections plus many in <b>TIME-WAIT</b> — closed ones the kernel remembers for 60 s (Chapter 4). nginx also opened a <b>new</b> connection to the API for each request: see the port in <code class="i">seenFrom</code> grow.</p>` },

  { t: '127.0.0.1 vs 0.0.0.0: who may connect?', giua: true, body: `
${term(ra('c14-bind-api', 'ss -tlnp', 1, { drop: /:3000|127\.0\.0\.11/ }) + '\n' + ra('c14-bind-api', 'nc -w 1 127.0.0.1 4000', 3), { sm: true, title: 'on the api machine itself' })}
${term(ra('c14-bind-client', 'nc -w 1 -v', 2), { sm: true, title: 'from the client, across the network' })}
${vsd('<p style="margin:0;font-size:20px"><code class="i">listen(4000, "127.0.0.1")</code> — only programs on <b>this machine</b> can connect. From outside: <b>refused</b>.</p>',
    '<p style="margin:0;font-size:20px"><code class="i">listen(4001, "0.0.0.0")</code> — every network card of the machine accepts connections.</p>',
    'Loopback only', 'All interfaces')}` },

  { t: 'EADDRINUSE: one listener per address and port', to: true, giua: true, body: `
${term(ra('c14-bind-api', "node -e", 1))}
<ul>
<li>The old process is still running (a second <code class="i">npm run dev</code>, a zombie container) — find it: <code class="i">ss -tlnp 'sport = :4001'</code></li>
<li>Two services configured with the same port</li>
<li>Different addresses are allowed: 127.0.0.1:4000 and 10.10.2.20:4000 can be two listeners</li>
</ul>` },

  { t: 'Docker -p: a door from the host into the container', to: true, body: `
${cards([
    ['Inside the container', 'Your app must listen on <b>0.0.0.0</b>. On 127.0.0.1 it only hears the container itself — <code class="i">-p</code> cannot reach it.'],
    ['On the host', '<code class="i">-p 3000:3000</code> publishes on <b>all</b> host addresses by default: anyone who can reach the server can reach the port.'],
    ['Safer', '<code class="i">-p 127.0.0.1:3000:3000</code> — only the host itself (e.g. nginx on the host) can connect.'],
  ])}
${box('A classic production surprise', 'A database published with <code class="i">-p 5432:5432</code> on a VPS is reachable from the whole Internet. Publish only what a proxy needs, and bind it to 127.0.0.1.', 'do2')}` },

  { t: 'Where a socket lives in the computer', to: true, giua: true, body: `
<ul>
<li>Your process holds a <b>file descriptor</b> — a small number — that points to a socket object in the <b>kernel</b> (OS course, lesson on fds)</li>
<li>The socket has a <b>receive buffer</b> and a <b>send buffer</b> in kernel RAM; <code class="i">Recv-Q</code>/<code class="i">Send-Q</code> in <code class="i">ss</code> are their fill levels</li>
<li>The kernel’s TCP/IP code moves bytes between those buffers and the network chip</li>
<li>So “the app is slow to read” shows up as a growing <b>Recv-Q</b> — a clue you will use in Chapter 4</li>
</ul>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>IP picks the machine, the <b>port</b> picks the program; clients get <b>ephemeral</b> ports 32768–60999</li>
<li>A socket is named by protocol + local IP:port + remote IP:port</li>
<li>One <b>listening</b> socket accepts; each conversation gets its own <b>connected</b> socket on the same port</li>
<li>Bind to <b>0.0.0.0</b> to be reachable; 127.0.0.1 means this machine only</li>
<li><code class="i">ss -tlnp</code> answers “who listens where”; <code class="i">ss -tanp</code> shows every connection</li>
</ul>
<p style="margin:0">${kw('port', 'cổng')} ${kw('socket', 'đầu nối')} ${kw('ephemeral port', 'cổng tạm')} ${kw('bind', 'gắn vào địa chỉ')}</p>` },
]);
