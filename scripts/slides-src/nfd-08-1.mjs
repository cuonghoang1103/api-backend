/**
 * nfd-08-1 — Networking for Developers, bài 8.1 "CDN hoạt động thế nào: edge, origin, PoP" (slug netdev-8-1-cdn). Bài MỞ CHƯƠNG 8.
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c81-*.out.txt) — biên nginx cache tệp từ origin.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-08-1', code: 'NFD 8.1', title: 'How a CDN works', sub: 'Networking for Developers · Chapter 8' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 8 — CDN & caching', bai: '8.1' }, [
  { cover: true, t: 'How a CDN works', sub: 'Edge, origin and PoP — and the<br>hit / miss / expired you read in a header', nhan: 'Chapter 8 · Lesson 8.1' },

  { t: 'What you will be able to do after Chapter 8', to: true, giua: true, body: `
<ul>
<li><b>Explain a CDN</b>: edge caches at many PoPs, one origin, Anycast routing to the nearest</li>
<li><b>Read the cache status</b> of any response — <code class="i">HIT</code>, <code class="i">MISS</code>, <code class="i">EXPIRED</code> — from a header</li>
<li><b>Cache correctly</b>: hashed filenames, TTL, <code class="i">stale-while-revalidate</code>, purge, and the cookie/query traps</li>
<li><b>Debug the layer fight</b>: when nginx overrides the cache headers your app set (a real outage)</li>
<li><b>Respect CDN limits</b>: the ~100 s timeout (524), body-size caps, and what not to route through the edge</li>
</ul>
<p style="margin:.3em 0 0">Everything is measured on a <b>miniature CDN</b> — an nginx edge caching a file from an nginx origin — on the base lab.</p>` },

  { t: 'A CDN is a cache near the user', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['<b>Origin</b>', 'your real server (nginx → API → DB). The one source of truth'],
    ['<b>Edge / PoP</b>', 'a cache server in a Point of Presence near the user — hundreds worldwide'],
    ['<b>Anycast</b>', 'one IP announced from every PoP; the network routes you to the <b>nearest</b> one'],
  ], { fs: 20 })}
${box('', 'A request for a cached file never reaches your origin — it is answered at a PoP a few milliseconds away. The origin only sees the <b>first</b> request for each file (and refreshes). That is the whole win: distance, and load taken off the origin.', 'lam')}` },

  { t: 'HIT and MISS — read it in a header', body: `
${term(ra('c81-hitmiss', 'curl', 3), { sm: true, title: 'the edge: first request MISS (fetched from origin), then HIT' })}
${box('', 'The first request is a <code class="i">MISS</code>: the edge has no copy, fetches from the origin, stores it, and marks the response. Every later request is a <code class="i">HIT</code> — served from the edge, origin untouched. Cloudflare calls this header <code class="i">cf-cache-status</code>; nginx here sets <code class="i">X-Cache</code> from <code class="i">$upstream_cache_status</code>.', 'xanh')}` },

  { t: 'TTL: fresh, then EXPIRED', body: `
${term(ra('c81-expire', 'curl', 4, { drop: /sleep/ }), { sm: true, title: 'MISS → HIT → (TTL of 30 s passes) → EXPIRED' })}
${box('', 'A cached copy is <b>fresh</b> for its TTL (from <code class="i">Cache-Control: max-age</code> or the CDN rule). While fresh it is a <code class="i">HIT</code> with no origin contact. Once the TTL passes, the next request is <code class="i">EXPIRED</code>: the edge revalidates with the origin, then caches the fresh copy again.', 'lam')}` },

  { t: 'The states you will see', giua: true, body: `
${bang(['Status', 'Means'], [
    ['<code class="i">MISS</code>', 'not in the edge cache — fetched from the origin this time'],
    ['<code class="i">HIT</code>', 'served from the edge; origin not contacted'],
    ['<code class="i">EXPIRED</code> / <code class="i">STALE</code>', 'was cached but past TTL — revalidated (or served stale while revalidating)'],
    ['<code class="i">BYPASS</code> / <code class="i">DYNAMIC</code>', 'not cacheable (a cookie, a no-store header, or a dynamic route)'],
  ], { fs: 19 })}
${box('', 'Also read <code class="i">Age</code> (seconds the copy has sat in cache) and <code class="i">Cache-Control</code>. First question for any "why is this slow / stale / not updating" bug: <b>what is the cache status at each hop?</b>', 'lam')}` },

  { t: 'Where CDNs came from', giua: true, body: `
${steps([
    '<b>1998 — Akamai</b>: born from an MIT problem — serve a flash crowd without melting the origin. Still the biggest by footprint.',
    '<b>2000s</b>: CDNs spread for images, video and static assets; "put it on a CDN" becomes standard advice.',
    '<b>2009–2010 — Cloudflare</b>: a CDN for <b>everyone</b>, free tier included — and the edge grows teeth: TLS, WAF, DNS, and code that runs at the PoP.',
  ])}
${box('', 'The idea never changed: <b>a cache close to the user, with one origin behind it.</b> What grew is how much the edge now does besides caching.', 'lam')}` },

  { t: 'What a CDN does NOT do', giua: true, body: `
${box('Key idea', 'A CDN makes <b>cacheable</b> responses fast and takes load off your origin. It does <b>not</b> make your database faster, speed up logged-in/dynamic pages that cannot be cached, or fix a slow origin for the first (MISS) request.', 'do2')}
${steps([
    'Static assets (JS/CSS/images/video) → cache aggressively at the edge',
    'Per-user, dynamic responses → usually <code class="i">BYPASS</code>; the edge still helps with TLS, routing and keep-alive',
    'The next lessons: cache <b>correctly</b> (8.2), the header fight (8.3), and the edge’s limits (8.4)',
  ])}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A CDN is <b>edge caches at many PoPs</b> in front of one <b>origin</b>; <b>Anycast</b> routes you to the nearest PoP</li>
<li>First request = <code class="i">MISS</code> (fetch from origin); later = <code class="i">HIT</code> (served at the edge, origin untouched)</li>
<li>A copy is <b>fresh</b> for its TTL, then <code class="i">EXPIRED</code> → revalidate; read <code class="i">cf-cache-status</code>/<code class="i">X-Cache</code>, <code class="i">Age</code></li>
<li>Akamai 1998 → Cloudflare 2009/2010 made the edge universal and smart (TLS, WAF, edge code)</li>
<li>It speeds <b>cacheable</b> responses and offloads the origin — not the database or dynamic pages</li>
</ul>
<p style="margin:0">${kw('edge / PoP', 'điểm hiện diện ở biên')} ${kw('origin', 'máy chủ gốc')} ${kw('Anycast', 'một IP, nhiều nơi')} ${kw('HIT/MISS', 'trúng/trượt cache')} ${kw('TTL', 'thời gian sống')}</p>` },
]);
