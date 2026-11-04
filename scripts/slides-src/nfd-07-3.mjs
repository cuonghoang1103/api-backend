/**
 * nfd-07-3 — Networking for Developers, bài 7.3 "HTTP/3 trên QUIC" (slug netdev-7-3-http3).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c73-*.out.txt). Client h3 = CHAY-O-MAY (ảnh lab thiếu client HTTP/3).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-07-3', code: 'NFD 7.3', title: 'HTTP/3 over QUIC', sub: 'Networking for Developers · Chapter 7' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 7 — HTTP 1.1→3', bai: '7.3' }, [
  { cover: true, t: 'HTTP/3 over QUIC', sub: 'The same HTTP, on a transport<br>that finally fixes head-of-line blocking', nhan: 'Chapter 7 · Lesson 7.3' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What HTTP/3 <b>is</b>: HTTP semantics over QUIC instead of TCP (RFC 9114)</li>
<li>The <b>upgrade path</b> a browser takes: HTTP/1.1 → HTTP/2 → HTTP/3, via Alt-Svc</li>
<li>Why it <b>removes TCP head-of-line blocking</b> (the one HTTP/2 could not)</li>
<li><b>QPACK</b>: HPACK redesigned for QUIC’s out-of-order streams</li>
<li>The <b>server side</b> in the lab, and how to tell which protocol you really got</li>
</ul>` },

  { t: 'HTTP/3 = HTTP over QUIC', giua: true, body: `
${bang(['Layer', 'HTTP/2', 'HTTP/3'], [
    ['Application', 'HTTP/2', 'HTTP/3'],
    ['Header compression', 'HPACK', '<b>QPACK</b>'],
    ['Transport', 'TCP + TLS', '<b>QUIC</b> (TLS 1.3 built in)'],
    ['Network', 'IP', 'IP via <b>UDP</b>'],
  ], { fs: 20 })}
${box('', 'HTTP/3 keeps the <b>same semantics</b> — methods, status codes, headers, streams — and swaps the transport from TCP to QUIC (Chapter 5). Everything you know about HTTP stays; what changes is underneath.', 'lam')}` },

  { t: 'The upgrade path: h1 → h2 → h3', body: `
${term(ra('c73-server', 'curl -sk --http2 -o /dev/null -D - https', 1), { sm: true, title: 'the h2 response advertises h3 with Alt-Svc' })}
${steps([
    'First visit: the browser connects over <b>TCP</b> (HTTP/1.1 or, via ALPN, HTTP/2)',
    'The response header <code class="i">alt-svc: h3=":443"</code> says “I also speak HTTP/3 on UDP 443”',
    'The browser remembers it and tries <b>HTTP/3 next time</b> — opt-in, discovered, reversible (Chapter 5)',
  ])}` },

  { t: 'The server side is real UDP', body: `
${term(ra('c73-server', 'ss -ulnp', 1, { cut: 92 }), { sm: true, title: 'nginx listening for QUIC on UDP 8443' })}
${term(ra('c73-server', 'ss -tlnp', 1, { cut: 92 }), { sm: true, title: '…and on TCP 8443 for the h1/h2 fallback' })}
${box('', 'The same nginx listens on <b>UDP</b> (QUIC/HTTP-3) and <b>TCP</b> (HTTP-1.1/2) on 8443. A web server with a UDP listener on 443 is the unmistakable sign of HTTP/3 (lesson 5.2).', 'xanh')}` },

  { t: 'Why HTTP/3 beats HTTP/2', giua: true, body: `
${bang(['', 'HTTP/2 over TCP', 'HTTP/3 over QUIC'], [
    ['A lost packet', 'stalls <b>all</b> streams (TCP in-order)', 'stalls <b>only</b> its stream'],
    ['Handshake', 'TCP + TLS = 2 RTT', 'QUIC + TLS = <b>1 RTT</b>, 0-RTT on resume'],
    ['Change networks', 'connection dies (new 4-tuple)', '<b>migrates</b> (Connection ID)'],
  ], { fs: 20 })}
${box('', 'HTTP/2 removed HTTP-layer head-of-line blocking; HTTP/3 removes the <b>TCP-layer</b> one too, because each QUIC stream is ordered independently (lesson 4.2, 5.2). That is the whole point of moving to QUIC.', 'lam')}` },

  { t: 'QPACK: HPACK for out-of-order streams', giua: true, body: `
${box('The problem', 'HTTP/2’s HPACK assumes headers arrive <b>in order</b> — fine over TCP. Over QUIC, streams arrive <b>independently</b>, so a shared header table that could block on a missing update would re-introduce head-of-line blocking.', 'do2')}
${box('QPACK', 'HTTP/3 uses <b>QPACK</b>: the same idea (a shared table so repeated headers are tiny indices), redesigned so that header decoding never blocks on another stream. Same saving, no new stall.', 'xanh')}` },

  { t: 'Reading HTTP/3: mostly from logs', body: `
${box('Server side (real)', 'A UDP listener on 443 + an <code class="i">Alt-Svc: h3</code> header — both measured above and on real sites.', 'lam')}
${box('Client side', 'QUIC is encrypted, and this lab’s <code class="i">curl</code> has no HTTP/3 support, so we read the <b>protocol</b> from the browser (the Network panel’s <code class="i">h3</code>, <code class="i">chrome://net-export</code>), not from tcpdump.', 'do2')}
<p style="margin:6px 0 0;font-size:16px;color:#777">⏳ Chưa chạy thật trong lab: lấy một trang bằng client HTTP/3 (ảnh lab thiếu). Phía máy chủ + Alt-Svc là thật; xem RFC 9114 + Chương 5.</p>` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['HTTP/3', 'HTTP semantics mapped onto QUIC streams, in a user-space library'],
    ['Alt-Svc', 'the response header that advertises h3 — how a browser discovers it'],
    ['QPACK', 'HTTP/3’s header compression, safe for out-of-order QUIC streams'],
    ['the UDP listener', 'the server socket on UDP 443 — the fingerprint of HTTP/3'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>HTTP/3 is <b>HTTP semantics over QUIC</b> (RFC 9114) — same methods, status, streams; new transport</li>
<li>A browser reaches it via <b>Alt-Svc</b>: TCP first, then HTTP/3 next time — opt-in and reversible</li>
<li>It removes <b>TCP head-of-line blocking</b> (each QUIC stream ordered on its own) and saves a handshake RTT</li>
<li><b>QPACK</b> gives HPACK’s header saving without re-introducing blocking over out-of-order streams</li>
<li>Server proof = a <b>UDP listener</b> + <code class="i">Alt-Svc</code>; read the protocol from the browser, not tcpdump</li>
</ul>
<p style="margin:0">${kw('HTTP/3', 'HTTP trên QUIC')} ${kw('Alt-Svc', 'nâng cấp')} ${kw('QPACK', 'nén header')} ${kw('no HoL', 'hết nghẽn đầu hàng')} ${kw('UDP 443', 'cổng QUIC')}</p>` },
]);
