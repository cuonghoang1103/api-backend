/**
 * nfd-08-2 — Networking for Developers, bài 8.2 "Khoá cache, TTL và xoá cache cho đúng" (slug netdev-8-2-cache-dung).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c82-*.out.txt) — khoá cache gồm cả query ⇒ ?v=1 và ?v=2 là hai mục riêng.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-08-2', code: 'NFD 8.2', title: 'Caching correctly', sub: 'Networking for Developers · Chapter 8' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 8 — CDN & caching', bai: '8.2' }, [
  { cover: true, t: 'Caching correctly', sub: 'Cache keys, TTL and invalidation —<br>the hashed filename trick, and the cookie trap', nhan: 'Chapter 8 · Lesson 8.2' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li><b>The cache key</b>: what makes two requests the "same" object — and why <code class="i">?v=1</code> and <code class="i">?v=2</code> are not</li>
<li><b>The hashed-filename pattern</b>: cache forever, bust with a new URL</li>
<li><b>TTL + <code class="i">stale-while-revalidate</code></b>: serve instantly, refresh in the background</li>
<li><b>Invalidation</b>: purge by URL or by tag — and why it is the hard problem</li>
<li><b>The cookie trap</b>: a stray <code class="i">Set-Cookie</code> turns every hit into a <code class="i">BYPASS</code></li>
</ul>` },

  { t: 'The cache key: query strings count', body: `
${term(ra('c82-key', 'curl', 3), { sm: true, title: 'same bytes, different query → two separate cache entries' })}
${box('', 'The key is <b>method + host + path + query</b>. <code class="i">?v=1</code> and <code class="i">?v=2</code> are <b>different keys</b>, so both MISS on first sight even though the file is identical. A tracking or cache-busting query multiplies your storage and collapses your hit rate.', 'do2')}` },

  { t: 'Cache forever, bust with the URL', giua: true, body: `
${steps([
    'Build tools emit <code class="i">app.9f3a2b.js</code> — the hash IS the content',
    'Serve it with <code class="i">Cache-Control: public, max-age=31536000, immutable</code> (a year)',
    'Change one byte → new hash → <code class="i">app.7c1e04.js</code> → a brand-new URL the cache has never seen',
  ])}
${box('', 'This is why a deploy goes live instantly <b>and</b> old assets stay cached a year. The HTML that references them is cached briefly (or not at all); the hashed assets it points to are cached forever. Never cache-bust by editing <code class="i">?v=</code> by hand.', 'xanh')}` },

  { t: 'TTL and stale-while-revalidate', giua: true, body: `
${bang(['Directive', 'Effect'], [
    ['<code class="i">max-age=60</code>', 'fresh for 60 s — served with no origin contact'],
    ['<code class="i">s-maxage=300</code>', 'a separate, longer TTL for shared caches (CDN) only'],
    ['<code class="i">stale-while-revalidate=600</code>', 'after expiry, serve the stale copy instantly AND refresh in the background'],
    ['<code class="i">stale-if-error=86400</code>', 'if the origin is down, keep serving the stale copy rather than erroring'],
  ], { fs: 18 })}
${box('', 'A short <code class="i">max-age</code> with a long <code class="i">stale-while-revalidate</code> is the sweet spot for semi-dynamic pages: users always get an instant answer, and the origin is hit at most once per window.', 'lam')}` },

  { t: 'Invalidation: the hard problem', giua: true, body: `
${steps([
    '<b>By TTL</b> — simplest: let it expire. No action, but you wait out the TTL.',
    '<b>Purge by URL</b> — tell the CDN to drop one object now (after you change it).',
    '<b>Purge by tag / surrogate key</b> — one call drops every object tagged <code class="i">product-42</code> (page, API, images).',
  ])}
${box('Why it is famous', '“There are only two hard things in computer science: cache invalidation and naming things.” The safe default is <b>hashed URLs for assets</b> (no invalidation ever needed) and <b>short TTLs for HTML/JSON</b>, keeping purge for the rare urgent change.', 'do2')}` },

  { t: 'The cookie trap', giua: true, body: `
${box('Key idea', 'A response with <code class="i">Set-Cookie</code>, or a route that <code class="i">Vary: Cookie</code>, is treated as per-user and <b>not shared-cached</b> — every request becomes a <code class="i">BYPASS</code> and hits the origin.', 'do2')}
${steps([
    'A single analytics or session cookie set on <code class="i">/</code> can disable caching for the whole site',
    'Strip cookies on static paths at the edge, or serve assets from a cookie-free path/host',
    'Confirm with <code class="i">curl -sD -</code>: a <code class="i">Set-Cookie</code> on a .js file is the smell',
  ])}` },

  { t: 'Is this response cacheable?', giua: true, body: `
${bang(['Cache it', 'Do not cache'], [
    ['Static assets (hashed) — a year', 'Anything with <code class="i">Set-Cookie</code> / per-user'],
    ['Public GET JSON — short TTL + SWR', 'POST/PUT/DELETE and auth-only data'],
    ['Images, fonts, video', 'Responses that <code class="i">Vary</code> on a user header'],
  ], { fs: 19 })}
${box('', 'Decide at <b>design</b> time: give each response a deliberate <code class="i">Cache-Control</code>. "No header" is itself a decision (heuristics kick in, often wrongly). Set it on purpose and verify with <code class="i">curl -I</code>.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>The cache key is <b>method + host + path + query</b> — <code class="i">?v=1</code> ≠ <code class="i">?v=2</code>, so query noise fragments the cache</li>
<li><b>Hashed immutable filenames</b> + a one-year <code class="i">max-age</code> = cache forever, bust with the URL</li>
<li><b>TTL</b> for freshness; <code class="i">stale-while-revalidate</code> serves instantly and refreshes in the background</li>
<li><b>Invalidation</b> = TTL, purge-by-URL, or purge-by-tag; prefer hashed URLs so you rarely need it</li>
<li>A stray <code class="i">Set-Cookie</code> / <code class="i">Vary: Cookie</code> turns every hit into a <code class="i">BYPASS</code> — strip cookies on static paths</li>
</ul>
<p style="margin:0">${kw('cache key', 'khoá cache')} ${kw('immutable', 'bất biến')} ${kw('TTL', 'thời gian sống')} ${kw('SWR', 'phục vụ cũ + làm tươi nền')} ${kw('purge', 'xoá cache')}</p>` },
]);
