/**
 * nfd-09-2 — Networking for Developers, bài 9.2 "WebSocket: nâng cấp, frame và nhịp tim" (slug netdev-9-2-websocket).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c92-*.out.txt) — máy chủ WebSocket thô (RFC 6455) viết tay.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-09-2', code: 'NFD 9.2', title: 'WebSocket: upgrade, frames and heartbeats', sub: 'Networking for Developers · Chapter 9' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 9 — Real-time connections', bai: '9.2' }, [
  { cover: true, t: 'WebSocket', sub: 'Upgrade from HTTP/1.1, the 101 handshake,<br>frames and ping/pong heartbeats', nhan: 'Chapter 9 · Lesson 9.2' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li><b>The upgrade</b>: a normal HTTP/1.1 request becomes a <code class="i">101 Switching Protocols</code></li>
<li><b>The handshake</b>: <code class="i">Sec-WebSocket-Accept</code> = base64(SHA-1(key + a fixed GUID)) — verifiable by hand</li>
<li><b>Frames</b>: after 101 it is no longer HTTP — small binary frames, both directions</li>
<li><b>Heartbeats</b>: ping/pong keep the line alive and detect a dead peer</li>
<li><b>Proxies</b>: idle timeouts cut a silent WebSocket — why your socket drops every 60 s</li>
</ul>` },

  { t: 'The upgrade: HTTP → 101', body: `
${term(ra('c92-ws', 'curl', 1, { max: 6 }), { sm: true, title: 'curl sends Upgrade: websocket → 101 Switching Protocols' })}
${box('', 'A WebSocket starts as an ordinary HTTP/1.1 <code class="i">GET</code> with <code class="i">Upgrade: websocket</code> and <code class="i">Connection: Upgrade</code>. The server replies <code class="i">101 Switching Protocols</code> — and from that byte on, the same TCP connection stops speaking HTTP and starts carrying WebSocket frames.', 'lam')}` },

  { t: 'The handshake proves intent', giua: true, body: `
${steps([
    'The client sends a random <code class="i">Sec-WebSocket-Key</code>',
    'The server returns <code class="i">Sec-WebSocket-Accept</code> = base64(SHA-1(key + <code class="i">258EAFA5-…-C5AB0DC85B11</code>))',
    'That fixed GUID is in RFC 6455 — the key <code class="i">dGhlIHNhbXBsZSBub25jZQ==</code> MUST yield <code class="i">s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</code>',
  ])}
${box('Key idea', 'The accept value is not security — it proves the server really understood the WebSocket upgrade (and is not a cache or proxy blindly echoing). A client that gets the wrong accept must <b>abort</b>. You just saw curl send the RFC’s sample key and get exactly the RFC’s sample accept.', 'xanh')}` },

  { t: 'After 101 it is frames, not HTTP', body: `
${term(ra('c92-ws', 'node', 1), { sm: true, title: 'a raw client: upgrade, send a text frame, get echo, ping→pong, close' })}
${box('', 'Past the handshake there are no more headers. Data travels in <b>frames</b>: a tiny header (FIN bit, opcode, length, mask) then the payload. Here a hand-written client sends a text frame, receives the echo, sends a ping and gets a pong, then closes — all on one connection, both directions.', 'lam')}` },

  { t: 'Frames, masking and opcodes', giua: true, body: `
${bang(['Opcode', 'Meaning'], [
    ['<code class="i">0x1</code> text / <code class="i">0x2</code> binary', 'a data frame (UTF-8 text or raw bytes)'],
    ['<code class="i">0x8</code> close', 'begin the closing handshake'],
    ['<code class="i">0x9</code> ping / <code class="i">0xA</code> pong', 'heartbeat: a ping must be answered with a pong'],
  ], { fs: 19 })}
${box('', 'Client→server frames are <b>masked</b> (XORed with a random key) — a security rule to stop confusing old proxies; server→client frames are not. A message can be split across frames (the FIN bit marks the last). You rarely write this by hand — a library does — but reading it demystifies "why is my socket sending gibberish."', 'lam')}` },

  { t: 'Proxies cut a silent connection', giua: true, body: `
${box('Key idea', 'An idle WebSocket looks dead to a proxy or load balancer, which closes it after an <b>idle timeout</b> (often 60 s). This is why "my WebSocket drops every minute" — nothing was flowing.', 'do2')}
${steps([
    'Send a <b>ping</b> every 20–30 s (app-level or protocol) so the connection is never idle',
    'A missing <b>pong</b> within a deadline means the peer is gone — reconnect',
    'Tune the proxy too: nginx <code class="i">proxy_read_timeout</code> on the WebSocket location',
  ])}` },

  { t: 'WebSocket or SSE?', giua: true, body: `
${bang(['Use SSE when…', 'Use WebSocket when…'], [
    ['one-way server→client (feed, log, progress)', 'both directions, low latency (chat, games)'],
    ['you want auto-reconnect for free', 'you send frequent client→server messages'],
    ['plain HTTP, simplest to operate', 'you need binary frames / sub-protocols'],
  ], { fs: 19 })}
${box('', 'Libraries like <b>socket.io</b> add rooms, acknowledgements and automatic fallback on top of raw WebSocket. Know the raw protocol first; then the library’s magic is just convenience, not mystery.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A WebSocket starts as an HTTP/1.1 <code class="i">Upgrade</code> → <b>101 Switching Protocols</b>, then the TCP connection carries frames</li>
<li><code class="i">Sec-WebSocket-Accept</code> = base64(SHA-1(key + fixed GUID)) proves the server understood the upgrade</li>
<li>After 101 it is <b>frames</b>, not HTTP: opcodes for text/binary/close/ping/pong; client frames are masked</li>
<li><b>Ping/pong heartbeats</b> keep the line alive and detect a dead peer</li>
<li>Proxies cut a silent socket on an <b>idle timeout</b> — heartbeat, and tune <code class="i">proxy_read_timeout</code></li>
</ul>
<p style="margin:0">${kw('101 upgrade', 'nâng cấp giao thức')} ${kw('Sec-WebSocket-Accept', 'bắt tay SHA-1')} ${kw('frame', 'khung')} ${kw('ping/pong', 'nhịp tim')} ${kw('idle timeout', 'rớt khi im')}</p>` },
]);
