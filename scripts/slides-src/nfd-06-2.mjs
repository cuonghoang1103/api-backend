/**
 * nfd-06-2 — Networking for Developers, bài 6.2 "Bắt tay TLS 1.3, từng bước" (slug netdev-6-2-bat-tay-tls).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c62-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, seq, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-06-2', code: 'NFD 6.2', title: 'The TLS 1.3 handshake, byte by byte', sub: 'Networking for Developers · Chapter 6' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 6 — TLS', bai: '6.2' }, [
  { cover: true, t: 'The TLS 1.3 handshake,<br>byte by byte', sub: 'ClientHello, SNI, ALPN — and decrypting<br>your own traffic with a key log', nhan: 'Chapter 6 · Lesson 6.2' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>TLS 1.3 handshake</b> in one round trip, read from <code class="i">openssl s_client</code></li>
<li>What <b>SNI</b> and <b>ALPN</b> do, and why they are in the very first packet</li>
<li><b>1-RTT</b> vs <b>0-RTT</b>, and session resumption measured (<code class="i">New → Reused</code>)</li>
<li>Decrypt your own TLS with <b>SSLKEYLOGFILE</b> and see the HTTP inside</li>
<li>Why the handshake cost is the reason to reuse connections (lesson 4.5)</li>
</ul>` },

  { t: 'One round trip to a secure channel', giua: true, body: `
${seq('client', 'server', [
    { d: 'r', t: 'ClientHello', s: 'SNI, ALPN, key share', c: '#7c3aed' },
    { d: 'l', t: 'ServerHello + {cert, Finished}', s: 'encrypted from here', c: '#7c3aed' },
    { d: 'r', t: 'Finished', c: '#7c3aed' },
    { d: 'r', t: 'HTTP request', c: '#e06d10' },
  ])}
${box('', 'TLS 1.3 needs <b>one round trip</b>: the client offers a key share in the very first message, the server replies with its own and the (now encrypted) certificate, and data can flow. TLS 1.2 needed two — a big part of why 1.3 feels faster.', 'xanh')}` },

  { t: 'Read the handshake', body: `
${term(ra('c62-hand', 'echo | openssl', 1), { sm: true, title: 'openssl s_client -tls1_3 -alpn h2' })}
${steps([
    '<b>Server certificate</b> + subject/issuer: who the server claims to be, and who vouches for it',
    '<b>New, TLSv1.3, Cipher …</b>: the agreed version and encryption',
    '<b>ALPN protocol: h2</b>: HTTP/2 chosen inside the handshake · <b>Verify return code: 0</b>: trusted',
  ])}` },

  { t: 'SNI and ALPN: decided in the first packet', giua: true, body: `
${term(ra('c62-sni', 'tshark', 1), { sm: true, title: 'the ClientHello (type 1) and ServerHello (type 2) on the wire' })}
${bang(['Field', 'In', 'Does'], [
    ['<b>SNI</b>', 'ClientHello (cleartext)', 'tells a shared server which site you want (virtual hosting)'],
    ['<b>ALPN</b>', 'ClientHello → ServerHello', 'picks h2 / http/1.1 during TLS, saving a round trip'],
    ['<b>key share</b>', 'ClientHello', 'the client’s half of the key — why 1.3 is 1-RTT'],
  ], { fs: 19 })}
${box('', 'The <b>SNI must be cleartext</b> — the server needs it to choose the right certificate before it can encrypt anything. That is the trade-off behind “HTTPS does not hide the domain” (lesson 6.1). ECH aims to fix it, but is not yet universal.', 'lam')}
${steps([
    'All three decisions ride in the <b>very first packet</b> — before a single key exists',
    'That is why ALPN (choosing HTTP/2) costs <b>no extra round trip</b>',
  ])}` },

  { t: 'Decrypt your own TLS with a key log', giua: true, body: `
${term(ra('c62-decrypt', 'tshark', 1, { lan: 2, max: 4 }), { sm: true, title: 'with SSLKEYLOGFILE from curl, tshark decrypts the stream' })}
${box('', 'Set <code class="i">SSLKEYLOGFILE</code> and curl (or Chrome) writes the per-session keys; feed them to Wireshark/tshark and the “Application Data” becomes readable <b>GET /</b> and <b>200 OK</b>.', 'xanh')}
${steps(['Without the key log: only encrypted record lengths', 'With it: the full decrypted request and response — every header', 'You decrypt only <b>your own</b> traffic, with keys you legitimately have'])}` },

  { t: 'Faster the second time: resumption', giua: true, body: `
${term(ra('c62-resume', 'echo "== lần 1', 1, { max: 8 }), { sm: true, title: 'first a full handshake, then reconnect with a saved ticket' })}
${box('', 'The first handshake is <b>New</b> (full). A resumed one is <b>Reused</b> — the server issued a <b>session ticket</b>, so the next connection skips most of the work.', 'lam')}
${steps(['<b>1-RTT</b>: a fresh TLS 1.3 handshake', '<b>0-RTT</b>: a resumed session can send data in the first packet — zero round trips', 'But 0-RTT data can be <b>replayed</b>, so only for idempotent requests (a GET)'])}` },

  { t: 'Why the handshake cost matters', giua: true, body: `
${steps([
    'A fresh HTTPS connection = TCP handshake (1 RTT) + TLS 1.3 handshake (1 RTT) before the first byte',
    'On a 150 ms link that is <b>~300 ms</b> of pure setup, every new connection',
    'Keep-alive and connection pools (lesson 4.5) reuse the whole thing — TCP <b>and</b> TLS',
    'Session resumption makes even a new TLS connection cheaper',
  ])}
${box('', 'This is the same lesson as Chapter 4, one layer up: the cheapest handshake is the one you do not do. Fewer, longer-lived, reused connections beat many short ones — doubly so over HTTPS.', 'lam')}` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['the handshake', 'done by the TLS library (OpenSSL…) inside your process, over the TCP socket'],
    ['SNI / ALPN', 'extensions in the ClientHello bytes; your HTTP client sets them'],
    ['the session ticket', 'an encrypted blob the server gives the client to resume later'],
    ['<code class="i">SSLKEYLOGFILE</code>', 'a debug hook: the client writes the session keys to a file you choose'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>TLS 1.3 reaches a secure channel in <b>one round trip</b>; the client’s key share is in the first packet</li>
<li><b>SNI</b> (which site) and <b>ALPN</b> (which protocol) are decided in the ClientHello — SNI cleartext, the rest soon encrypted</li>
<li><b>Resumption</b> turns <code class="i">New</code> into <code class="i">Reused</code> via a session ticket; 1.3 can do <b>0-RTT</b> for idempotent requests</li>
<li><b>SSLKEYLOGFILE</b> + Wireshark decrypts your own HTTPS — debug without disabling encryption</li>
<li>The handshake costs a round trip, so reuse connections (lesson 4.5) — the cheapest handshake is the one you skip</li>
</ul>
<p style="margin:0">${kw('ClientHello', 'chào từ client')} ${kw('SNI / ALPN', 'tên máy chủ / giao thức')} ${kw('1-RTT / 0-RTT', 'một / không vòng')} ${kw('session resumption', 'nối lại phiên')} ${kw('SSLKEYLOGFILE', 'nhật ký khoá')}</p>` },
]);
