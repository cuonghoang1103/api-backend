/**
 * nfd-07-4 — Networking for Developers, bài 7.4 "Các header đổi hành vi: cache, nén, CORS, bảo mật" (slug netdev-7-4-header-quan-trong).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c74-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-07-4', code: 'NFD 7.4', title: 'Headers that change behaviour', sub: 'Networking for Developers · Chapter 7' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 7 — HTTP 1.1→3', bai: '7.4' }, [
  { cover: true, t: 'Headers that change behaviour', sub: 'Caching, compression, CORS and security —<br>read from real responses', nhan: 'Chapter 7 · Lesson 7.4' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Caching</b>: Cache-Control, ETag and the 304 that saves a download</li>
<li><b>Compression</b>: Accept-Encoding / Content-Encoding, gzip vs brotli vs zstd</li>
<li><b>CORS</b>: the preflight <code class="i">OPTIONS</code> and the Allow-* headers — seen on the wire</li>
<li><b>Security headers</b>: HSTS and friends</li>
<li>How a header <b>silently</b> changes what the browser or a CDN does</li>
</ul>` },

  { t: 'Caching: ETag and the 304', body: `
${term(ra('c74-cache', 'etag=', 1, { max: 3 }), { sm: true, title: 'the server stamps a version (ETag) on the resource' })}
${term(ra('c74-cache', 'curl -sk -o /dev/null -w', 1), { sm: true, title: 'ask again with If-None-Match → 304, no body re-sent' })}
${box('', 'The server gives each version an <b>ETag</b>. Next time the client asks with <code class="i">If-None-Match: &lt;etag&gt;</code>; if nothing changed the server replies <b>304 Not Modified</b> with <b>no body</b> — the client reuses its cached copy. A round trip, but no download.', 'xanh')}` },

  { t: 'The caching headers', giua: true, body: `
${bang(['Header', 'Says'], [
    ['<code class="i">Cache-Control: max-age=600</code>', 'cache for 600 s without even asking (fresh)'],
    ['<code class="i">Cache-Control: no-store</code>', 'never cache (sensitive data)'],
    ['<code class="i">ETag</code> + <code class="i">If-None-Match</code>', 'revalidate: 304 if unchanged, 200 + body if changed'],
    ['<code class="i">Vary: Accept-Encoding</code>', 'cache a separate copy per value of that request header'],
  ], { fs: 19 })}
${box('', 'Immutable, hashed filenames (<code class="i">app.9f3a.js</code>) + a long <code class="i">max-age</code> = cache forever, and a new hash on every change. The pattern behind every fast site.', 'lam')}` },

  { t: 'Compression', body: `
${term(ra('c74-gzip', 'curl -sk -o /dev/null -w', 1), { sm: true, title: 'the body, uncompressed' })}
${term(ra('c74-gzip', 'curl -sk --compressed -D - -o /dev/null', 1), { sm: true, title: '--compressed sends Accept-Encoding → Content-Encoding: gzip' })}
${box('', 'The client advertises <code class="i">Accept-Encoding: gzip, br, zstd</code>; the server compresses and replies <code class="i">Content-Encoding: gzip</code>. Text shrinks 3–5×. <b>gzip</b> everywhere, <b>brotli</b> better for static text, <b>zstd</b> the newest. Never compress already-compressed bytes (images, video).', 'lam')}` },

  { t: 'CORS: the preflight', body: `
${term(ra('c74-cors', 'curl -sk -X OPTIONS', 1, { max: 6 }), { sm: true, title: 'the browser sends OPTIONS first for a non-simple request' })}
${steps([
    'Before a cross-origin <code class="i">PUT</code>/custom-header request, the browser sends a <b>preflight OPTIONS</b>',
    'The server answers with <code class="i">Access-Control-Allow-Origin / -Methods / -Headers</code>',
    'Only if they permit it does the browser send the <b>real</b> request',
  ])}` },

  { t: 'CORS is enforced by the browser', giua: true, body: `
${box('Key idea', 'CORS is a <b>browser</b> rule, not server security. The server always runs the request; CORS decides whether <b>JavaScript on another origin</b> may read the response. <code class="i">curl</code> ignores CORS entirely.', 'do2')}
${steps([
    '“CORS error” in the console = the server did not send the right <code class="i">Access-Control-Allow-*</code>',
    'Fix it on the <b>server</b> (allow the origin/method/header), not by disabling browser security',
    'A wildcard <code class="i">*</code> cannot be used with credentials — echo the specific origin instead',
  ])}` },

  { t: 'Security headers', giua: true, body: `
${term(ra('c74-cors', 'curl -sk -D - -o /dev/null https', 1), { sm: true, title: 'HSTS on every response' })}
${bang(['Header', 'Does'], [
    ['<code class="i">Strict-Transport-Security</code>', 'HSTS: always use HTTPS for this site for max-age seconds'],
    ['<code class="i">Content-Security-Policy</code>', 'restrict where scripts/styles may load from'],
    ['<code class="i">X-Content-Type-Options: nosniff</code>', 'do not guess content types'],
  ], { fs: 19 })}
${box('', 'These do nothing on the <b>server</b> — they are orders the <b>browser</b> remembers and enforces on future requests. HSTS is why a typed <code class="i">http://</code> silently becomes <code class="i">https://</code> and cannot be downgraded. Set them at your edge; verify with <code class="i">curl -I</code>.', 'lam')}` },

  { t: 'Where this lives', giua: true, body: `
${bang(['Header', 'Enforced by'], [
    ['Cache-Control / ETag', 'the client cache and every CDN on the path'],
    ['Content-Encoding', 'the server (compresses) + client (decompresses)'],
    ['Access-Control-Allow-*', 'the <b>browser</b> — not the server, not curl'],
    ['HSTS / CSP', 'the <b>browser</b>, on future requests'],
  ], { fs: 20 })}
${box('', 'These headers do nothing on their own — they are <b>instructions</b> to a cache, a compressor or a browser. Reading them with <code class="i">curl -I</code> is how you confirm they are actually set at each hop.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>ETag + If-None-Match</b> → 304 (no re-download); <b>Cache-Control</b> sets freshness; <b>Vary</b> splits the cache key</li>
<li><b>Accept-Encoding / Content-Encoding</b>: gzip/brotli/zstd shrink text 3–5× — never re-compress images</li>
<li><b>CORS</b>: a preflight <code class="i">OPTIONS</code> + <code class="i">Access-Control-Allow-*</code>; enforced by the browser, fixed on the server</li>
<li><b>HSTS</b> and friends tell the browser to stay on HTTPS and restrict content</li>
<li>Headers are <b>instructions</b> to caches/compressors/browsers — verify them with <code class="i">curl -I</code> at each hop</li>
</ul>
<p style="margin:0">${kw('Cache-Control / ETag', 'cache')} ${kw('Content-Encoding', 'nén')} ${kw('CORS', 'chia sẻ nguồn chéo')} ${kw('preflight', 'tiền kiểm')} ${kw('HSTS', 'ép HTTPS')}</p>` },
]);
