/**
 * nfd-07-1 — Networking for Developers, bài 7.1 "HTTP/1.1 trên dây" (slug netdev-7-1-http11). Bài MỞ CHƯƠNG 7.
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c71-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-07-1', code: 'NFD 7.1', title: 'HTTP/1.1 on the wire', sub: 'Networking for Developers · Chapter 7' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 7 — HTTP 1.1→3', bai: '7.1' }, [
  { cover: true, t: 'HTTP/1.1 on the wire', sub: 'The text protocol you can type by hand', nhan: 'Chapter 7 · Lesson 7.1' },

  { t: 'Chapter 7 at a glance — what you can do after it', to: true, giua: true, body: `
<ul>
<li>Read <b>HTTP/1.1</b> as the plain text it is, and type a request by hand</li>
<li>Explain <b>HTTP/2</b>: multiplexing, HPACK, and why server push died — read the frames</li>
<li>Explain <b>HTTP/3</b> over QUIC and how a browser upgrades to it (Alt-Svc)</li>
<li>Use the <b>headers that change behaviour</b>: caching, compression, CORS, HSTS</li>
<li>Find the <b>real client IP</b> through a proxy chain (X-Forwarded-For)</li>
</ul>
${box('Why a developer needs this', 'HTTP is the protocol your code speaks all day. Reading it on the wire — status lines, headers, frames — turns “the API is slow / cached wrong / sees the wrong IP” from a guess into a diagnosis.', 'lam')}` },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>HTTP/1.1 is <b>text</b> — type a request with <code class="i">nc</code> and read the raw reply</li>
<li>The anatomy: <b>status line, headers, blank line, body</b></li>
<li><b>Keep-alive</b>: one TCP connection, many requests (default in 1.1)</li>
<li><b>Chunked</b> transfer: streaming a body of unknown length</li>
<li>The <b>6-connection limit</b> per origin, and the old tricks it forced</li>
</ul>` },

  { t: 'HTTP/1.1 is just text', body: `
${term(ra('c71-raw', 'printf', 1), { sm: true, title: 'type the request by hand with nc' })}
${box('', 'A request is <b>a line + headers + a blank line</b>. A response is a <b>status line + headers + a blank line + the body</b>. That is the whole protocol — human-readable, which is why you can speak it with <code class="i">nc</code> and read it in a capture.', 'lam')}` },

  { t: 'The anatomy of a message', giua: true, body: `
${bang(['Part', 'Request', 'Response'], [
    ['line 1', '<code class="i">GET / HTTP/1.1</code> (method, path, version)', '<code class="i">HTTP/1.1 200 OK</code> (version, status)'],
    ['headers', '<code class="i">Host:</code>, <code class="i">Accept:</code>, …', '<code class="i">Content-Type:</code>, <code class="i">Content-Length:</code>, …'],
    ['blank line', 'ends the headers', 'ends the headers'],
    ['body', 'optional (POST data)', 'the content'],
  ], { fs: 20 })}
${box('', '<b>Host</b> is mandatory in 1.1 — it is how one IP serves many sites (name-based virtual hosting), the HTTP cousin of TLS’s SNI (lesson 6.2).', 'lam')}` },

  { t: 'Keep-alive: one connection, many requests', body: `
${term(ra('c71-keepalive', 'curl', 1), { sm: true, title: 'two requests, the second reuses the connection' })}
${box('', '“<b>Reusing existing connection</b>”: HTTP/1.1 keeps the TCP (and TLS) connection open by default, so the second request skips both handshakes (lessons 4.1, 6.2). This is the single biggest 1.1 improvement over 1.0 — and still the first thing to get right.', 'xanh')}` },

  { t: 'Chunked: a body of unknown length', body: `
${term(ra('c71-chunked', 'printf', 1, { max: 10 }), { sm: true, title: 'the server streams without knowing the total size' })}
${box('', 'When the server does not know <code class="i">Content-Length</code> up front (it is streaming), it uses <b>Transfer-Encoding: chunked</b>: each chunk is a <b>size line (hex)</b> then that many bytes, ending with a zero-size chunk. This is how a response can start before it is finished.', 'lam')}` },

  { t: 'The limit that shaped the old web', giua: true, body: `
${box('The rule', 'HTTP/1.1 processes <b>one request at a time per connection</b> (no multiplexing). Browsers open <b>~6 connections per origin</b> to parallelise — and no more.', 'do2')}
${steps([
    'A page with 100 small assets queues behind 6 connections — slow',
    'Old workarounds: <b>CSS sprites</b> (one image for many icons), <b>concatenating</b> JS/CSS, <b>domain sharding</b> (assets on many subdomains to get more than 6 connections)',
    'HTTP/2 (next lesson) made all of these obsolete with <b>multiplexing</b>',
  ])}` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['the message', 'bytes your HTTP library writes to / reads from a TCP (or TLS) socket'],
    ['Host header', 'lets one server/IP pick the right virtual host — like SNI, but in HTTP'],
    ['keep-alive', 'the socket stays ESTABLISHED between requests; your client pools it (4.5)'],
    ['chunked', 'framing inside the body so a response can stream without a length'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>HTTP/1.1 is <b>plain text</b>: a request line + headers, a response status line + headers + body — you can type it by hand</li>
<li><b>Host</b> is mandatory (name-based virtual hosting); <b>keep-alive</b> reuses one connection for many requests</li>
<li><b>Chunked</b> transfer streams a body of unknown length (size line + bytes, ending in a zero chunk)</li>
<li>One request at a time per connection → <b>~6 connections per origin</b>, and the old sprite/sharding tricks</li>
<li>HTTP/2 fixes the serialisation with multiplexing — the next lesson</li>
</ul>
<p style="margin:0">${kw('status line', 'dòng trạng thái')} ${kw('header', 'tiêu đề')} ${kw('keep-alive', 'giữ kết nối')} ${kw('chunked', 'chia khúc')} ${kw('virtual hosting', 'lưu trú ảo')}</p>` },
]);
