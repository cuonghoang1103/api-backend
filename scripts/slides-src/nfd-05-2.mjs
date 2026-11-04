/**
 * nfd-05-2 — Networking for Developers, bài 5.2 "QUIC: tầng vận chuyển dựng lại trên UDP" (slug netdev-5-2-quic).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c52-*.out.txt). QUIC handshake bytes = CHAY-O-MAY (không có client h3 trong lab).
 */
import { lamDeck, sh, two, box, kw, bang, steps, seq, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-05-2', code: 'NFD 5.2', title: 'QUIC: transport rebuilt on UDP', sub: 'Networking for Developers · Chapter 5' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 5 — UDP and QUIC', bai: '5.2' }, [
  { cover: true, t: 'QUIC: transport rebuilt on UDP', sub: 'TCP’s guarantees + TLS 1.3, on UDP —<br>without the head-of-line blocking', nhan: 'Chapter 5 · Lesson 5.2' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What <b>QUIC</b> is: reliable, ordered, multiplexed, encrypted — all rebuilt on UDP</li>
<li>Why it <b>folds TLS into the handshake</b>: a secure connection in <b>1 RTT</b>, sometimes 0</li>
<li>How it <b>removes head-of-line blocking</b> by giving each stream its own ordering</li>
<li><b>Connection migration</b>: keep the connection when Wi-Fi becomes 4G</li>
<li>The <b>real server side</b> in the lab, and why you cannot just read QUIC in tcpdump</li>
</ul>` },

  { t: 'QUIC in one sentence', giua: true, body: `
${box('', 'QUIC gives you everything TCP + TLS give you — a reliable, ordered, encrypted connection — <b>rebuilt as a library on top of UDP</b>, so it can fix TCP’s oldest limits and ship new versions without waiting for operating systems to change.', 'lam')}
${bang(['Layer', 'Classic HTTPS', 'HTTP/3'], [
    ['Application', 'HTTP', 'HTTP/3'],
    ['Security', 'TLS 1.3', '<b>TLS 1.3 (inside QUIC)</b>'],
    ['Transport', 'TCP', '<b>QUIC</b>'],
    ['Network', 'IP', 'IP (via <b>UDP</b>)'],
  ], { fs: 20 })}
${box('', 'QUIC runs in <b>user space</b> (in the browser, in nginx), not the kernel. That is why it can evolve fast — and why the kernel’s TCP tools do not see inside it.', 'lam')}` },

  { t: 'From Google (2012) to RFC 9000 (2021)', to: true, giua: true, body: `
${steps([
    '<b>2012–2013</b>: Google ships an experimental “QUIC” in Chrome and on its servers',
    '<b>2016–2021</b>: the IETF standardises it — a new, cleaner QUIC, with TLS 1.3 built in',
    '<b>2021</b>: <b>RFC 9000</b> (QUIC) and <b>RFC 9114</b> (HTTP/3) are published',
    'Today a large share of web traffic to big sites is already HTTP/3 over QUIC',
  ])}
${box('', 'The motive was concrete: TCP’s head-of-line blocking (lesson 4.2) hurt HTTP/2, the TCP + TLS handshake cost 2–3 round trips, and changing TCP means changing every operating system. Moving the transport into user space on UDP solved all three.', 'lam')}` },

  { t: 'One handshake instead of two', giua: true, body: `
${two(seq('client', 'server', [
    { d: 'r', t: 'SYN' }, { d: 'l', t: 'SYN-ACK' }, { d: 'r', t: 'ACK' },
    { d: 'r', t: 'TLS ClientHello', c: '#7c3aed' }, { d: 'l', t: 'TLS …', c: '#7c3aed' }, { d: 'r', t: 'HTTP', c: '#e06d10' },
  ]), seq('client', 'server', [
    { d: 'r', t: 'QUIC Initial (+ TLS)', c: '#7c3aed' }, { d: 'l', t: 'QUIC (+ TLS)', c: '#7c3aed' }, { d: 'r', t: 'HTTP', c: '#e06d10' },
  ]))}
${box('', 'Left: TCP + TLS 1.3 = a TCP handshake <b>then</b> a TLS handshake, 2 round trips before data. Right: QUIC folds TLS into its own handshake — <b>1 RTT</b>, and <b>0-RTT</b> for a resumed connection. On a far link this is the difference you feel first.', 'xanh')}` },

  { t: 'The real server side in the lab', body: `
${term(ra('c52-server', 'nginx -V', 1), { sm: true, title: 'the lab nginx has the HTTP/3 module' })}
${term(ra('c52-server', 'ss -ulnp', 1, { cut: 92 }), { sm: true, title: 'nginx listening for QUIC on UDP 8443' })}
${box('', 'QUIC is <b>real UDP</b>: the server listens on a <b>UDP</b> port (here 8443, in production 443), alongside the TCP port for the TLS/HTTP-2 fallback. <code class="i">ss -uln</code> shows it — a web server with a UDP listener is the unmistakable sign of HTTP/3.', 'lam')}` },

  { t: 'How a client finds HTTP/3: Alt-Svc', body: `
${term(ra('c52-server', 'curl -sk --http2', 1), { sm: true, title: 'the lab server advertises h3 over its HTTP/2 response' })}
${term(ra('c52-altsvc', 'curl -sI --max-time 10 https://www.cloudflare.com/', 1), { sm: true, title: 'and so do the real sites' })}
${box('Alt-Svc', 'A browser’s <b>first</b> request to a site goes over TCP/HTTP-2. The response carries <code class="i">alt-svc: h3=":443"</code> — “I also speak HTTP/3 on UDP 443.” The browser remembers this and tries QUIC <b>next</b> time. HTTP/3 is opt-in, discovered, and reversible.', 'lam')}` },

  { t: 'No head-of-line blocking', giua: true, body: `
${bang(['', 'HTTP/2 over TCP', 'HTTP/3 over QUIC'], [
    ['Many requests', 'multiplexed on <b>one</b> TCP stream', 'each request its <b>own</b> QUIC stream'],
    ['A lost packet', 'stalls <b>all</b> streams (TCP must deliver in order)', 'stalls <b>only</b> the stream it belonged to'],
    ['Ordering', 'one order for everything', 'independent order per stream'],
  ], { fs: 20 })}
${box('', 'This is the fix for lesson 4.2’s head-of-line blocking. QUIC moves ordering <b>above</b> the loss-recovery layer, so a lost packet only holds up its own stream — the others keep flowing. One slow image no longer blocks the page.', 'xanh')}` },

  { t: 'Connection migration', giua: true, body: `
${box('The problem with TCP', 'A TCP connection is its 4-tuple (src IP:port · dst IP:port). Walk out of Wi-Fi onto 4G and your IP changes — the 4-tuple is gone, the connection <b>dies</b>, everything reconnects.', 'do2')}
${box('What QUIC does', 'A QUIC connection has its own <b>Connection ID</b>, independent of IP and port. When your address changes, the connection <b>migrates</b> — the download, the call, the upload keep going. This is why QUIC matters most on mobile.', 'xanh')}` },

  { t: 'Reading QUIC: you mostly cannot', body: `
${box('Why tcpdump shows little', 'QUIC is <b>encrypted almost end to end</b> — even most of its transport headers. On the wire you see UDP datagrams to port 443 and little else; there is no plaintext handshake to read like a TCP SYN or a TLS ClientHello.', 'lam')}
${box('How it is actually read', 'With the server’s keys (or <code class="i">SSLKEYLOGFILE</code> from a browser you control), Wireshark decrypts QUIC and shows the streams. In this lab we have <b>no HTTP/3 client</b> (our curl lacks HTTP/3), so we show the real <b>server</b> side and read the handshake from the Cloudflare write-up.', 'do2')}
<p style="margin:6px 0 0;font-size:16px;color:#777">⏳ Chưa chạy thật trong lab: bắt gói cú bắt tay QUIC (không có client h3). Xem nguồn Cloudflare + RFC 9000.</p>` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['QUIC itself', 'a <b>user-space library</b> in the browser / nginx, over a plain UDP socket'],
    ['the handshake', 'QUIC + TLS 1.3 combined — 1-RTT, 0-RTT on resume'],
    ['streams', 'many independent ordered streams inside one QUIC connection'],
    ['Connection ID', 'identifies the connection independently of IP:port (enables migration)'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>QUIC = TCP’s reliability + TLS 1.3, rebuilt as a <b>user-space library on UDP</b> (RFC 9000, 2021)</li>
<li>It folds TLS into the handshake: a secure connection in <b>1 RTT</b>, 0-RTT on resume</li>
<li>Each request gets its <b>own stream</b>, so a lost packet no longer stalls every request (no TCP HoL)</li>
<li><b>Connection migration</b> keeps the connection alive when Wi-Fi becomes 4G</li>
<li>The server listens on <b>UDP</b> and advertises <code class="i">h3</code> via <code class="i">Alt-Svc</code>; QUIC is encrypted, so you read it with keys, not tcpdump</li>
</ul>
<p style="margin:0">${kw('QUIC', 'tầng vận chuyển trên UDP')} ${kw('HTTP/3', 'HTTP thế hệ 3')} ${kw('Alt-Svc', 'dịch vụ thay thế')} ${kw('0-RTT', 'không vòng khứ hồi')} ${kw('connection migration', 'chuyển kết nối')}</p>` },
]);
