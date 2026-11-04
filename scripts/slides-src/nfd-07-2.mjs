/**
 * nfd-07-2 — Networking for Developers, bài 7.2 "HTTP/2: ghép kênh, HPACK, vì sao server push bị bỏ" (slug netdev-7-2-http2).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c72-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, seq, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-07-2', code: 'NFD 7.2', title: 'HTTP/2: multiplexing, HPACK and why server push died', sub: 'Networking for Developers · Chapter 7' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 7 — HTTP 1.1→3', bai: '7.2' }, [
  { cover: true, t: 'HTTP/2: multiplexing, HPACK,<br>and why server push died', sub: 'Many requests on one connection —<br>read the frames', nhan: 'Chapter 7 · Lesson 7.2' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>How HTTP/2 is <b>chosen</b>: ALPN, inside the TLS handshake — read it live</li>
<li><b>Binary framing</b>: the same HTTP semantics, sent as frames instead of text</li>
<li><b>Multiplexing</b>: many requests on <b>one</b> connection, each its own stream — read the stream IDs</li>
<li><b>HPACK</b>: header compression, and why it matters for tiny requests</li>
<li>Why <b>server push died</b>, and why <b>head-of-line blocking still hurts</b> (→ HTTP/3)</li>
</ul>` },

  { t: 'Same HTTP, chosen by ALPN', body: `
${term(ra('c72-alpn', 'curl', 1), { sm: true, title: 'curl -v --http2 to the TLS server' })}
${steps([
    '<b>ALPN: curl offers h2,http/1.1</b> → <b>server accepted h2</b>: chosen in the TLS handshake (lesson 6.2), no extra round trip',
    'HTTP/2 keeps the <b>same semantics</b> — methods, status codes, headers — it only changes how they travel',
    'Almost always over TLS: browsers do h2 on HTTPS only',
  ])}` },

  { t: 'From text to binary frames', giua: true, body: `
${bang(['HTTP/1.1', 'HTTP/2'], [
    ['one text message per request', 'the message split into <b>binary frames</b> (HEADERS, DATA)'],
    ['one request at a time per connection', 'many requests interleaved on one connection'],
    ['headers re-sent in full every time', 'headers compressed with <b>HPACK</b>'],
    ['~6 connections per origin', '<b>one</b> connection per origin'],
  ], { fs: 20 })}
${box('', 'HTTP/2 does not change what a request <em>means</em> — a GET is still a GET. It changes the <b>encoding</b>: binary frames that can be interleaved, so one slow response no longer blocks the others (at the HTTP layer).', 'lam')}` },

  { t: 'Multiplexing: read the stream IDs', body: `
${term(ra('c72-mux', 'tshark', 1), { sm: true, title: 'three GETs on ONE connection, decrypted with the session keys' })}
${box('', 'Three requests, <b>one TCP connection</b>, three <b>streams</b>: IDs <b>1, 3, 5</b> (client-initiated streams are odd). Each has its own HEADERS frame and its own response — interleaved on the same connection. No more 6-connection limit, no more sprites or domain sharding (lesson 7.1).', 'xanh')}` },

  { t: 'HPACK: stop re-sending the same headers', giua: true, body: `
${box('The problem', 'Every HTTP/1.1 request re-sends the <b>same</b> headers in full — <code class="i">User-Agent</code>, <code class="i">Cookie</code>, <code class="i">Accept</code> — often far bigger than the request itself.', 'do2')}
${box('HPACK', 'HTTP/2 compresses headers with <b>HPACK</b>: a shared table of names/values on both ends, so a repeated header becomes a tiny <b>index</b>. For an API making many small requests with a big auth header, this is a real saving.', 'xanh')}` },

  { t: 'Why server push died', giua: true, body: `
${steps([
    '<b>Server push</b>: the server sends a resource before the client asks (e.g. the CSS with the HTML)',
    'In practice it <b>over-pushed</b> things the browser already had cached — wasting bandwidth',
    'Browsers never used it well; <b>Chrome removed it in 2022</b>, and HTTP/3 does not define it the same way',
    'The replacement: <code class="i">103 Early Hints</code> + <code class="i">rel=preload</code> — tell the browser to fetch, let it decide',
  ])}
${box('', 'A cautionary tale: a clever protocol feature that looked great in demos and failed against real caches. Prefer letting the client choose what to fetch.', 'lam')}` },

  { t: 'The limit HTTP/2 could not fix', giua: true, body: `
${seq('server', 'browser', [
    { d: 'r', t: 'stream 1 data ✓', c: '#2f7d4f' },
    { d: 'r', t: 'stream 3 packet ✗ LOST', c: '#c0392b' },
    { d: 'r', t: 'stream 5 data (held)', c: '#e08a1e' },
  ])}
${box('', 'HTTP/2 multiplexes over <b>one TCP connection</b>, and TCP delivers in order — so a single lost packet stalls <b>every</b> stream, even unrelated ones (lesson 4.2). HTTP/2 removed HTTP-layer head-of-line blocking but left the <b>TCP-layer</b> one. That is exactly what HTTP/3 over QUIC fixes (next lesson).', 'do2')}` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['ALPN', 'picks h2 in the TLS handshake; your client/library requests it'],
    ['frames', 'HEADERS, DATA, SETTINGS… on streams, multiplexed on one TCP connection'],
    ['HPACK', 'a shared header table in each endpoint’s HTTP/2 layer'],
    ['one connection', 'your pool keeps a single h2 connection per origin, not six'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>HTTP/2 keeps HTTP’s meaning but sends it as <b>binary frames</b>, chosen by <b>ALPN</b> in the TLS handshake</li>
<li><b>Multiplexing</b>: many requests on one connection, each a stream (IDs 1, 3, 5…) — no 6-connection limit</li>
<li><b>HPACK</b> compresses repeated headers to tiny indices — a big win for many small requests</li>
<li><b>Server push died</b> (over-pushed past caches; Chrome removed it in 2022) — use 103 Early Hints instead</li>
<li>One TCP connection means a lost packet still stalls all streams — <b>TCP head-of-line blocking</b>, fixed by HTTP/3</li>
</ul>
<p style="margin:0">${kw('ALPN', 'chọn giao thức')} ${kw('frame', 'khung nhị phân')} ${kw('multiplexing', 'ghép kênh')} ${kw('HPACK', 'nén header')} ${kw('head-of-line', 'nghẽn đầu hàng')}</p>` },
]);
