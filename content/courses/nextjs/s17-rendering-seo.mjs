/**
 * Next.js & React — Chương 17: Chiến lược render & SEO. MỞ GIAI ĐOẠN 5.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Viết cho NGƯỜI MỚI HOÀN TOÀN — định nghĩa mọi thuật ngữ (render, HTML, crawler,
 * SEO, OG) khi gặp lần đầu, kèm ví von. Xem [[feedback_nextjs_course_beginner_first]].
 * Thuần khái niệm — không có output console. Sự cố thật cuongthai: OG URL sai làm
 * link Messenger về "/" (17.4). Cache mặc định đổi theo phiên bản → nói tường minh.
 */

import G17_1 from './giang/nxj-17-1.mjs';
import G17_2 from './giang/nxj-17-2.mjs';
import G17_3 from './giang/nxj-17-3.mjs';
import G17_4 from './giang/nxj-17-4.mjs';
import G17_5 from './giang/nxj-17-5.mjs';
export default {
  title: 'Chapter 17 — Rendering strategies and SEO|||Chương 17 — Chiến lược render và SEO',
  description: 'Bốn cách một trang web được tạo ra (CSR, SSR, SSG, ISR) giải thích cho người mới, cách App Router tự chọn tĩnh hay động, SEO là gì và vì sao cách render quyết định nó, thẻ chia sẻ mạng xã hội (Open Graph), và Core Web Vitals đo cái gì.',
  lessons: [
    /* ─────────────────────────── 17.1 ─────────────────────────── */
    {
      title: '17.1 — Four ways a page gets made (CSR, SSR, SSG, ISR)|||17.1 — Bốn cách một trang được tạo ra (CSR, SSR, SSG, ISR)',
      slug: 'nextjs-17-1-bon-cach-render',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Rendering Techniques in Next.js Explained | SSR, SSG, ISR & CSR" — FineGap (oEmbed verified).
      video: { url: 'https://youtu.be/AQouuIwjvtA', durationSeconds: 0 },
      description: 'Trước tiên, "render" nghĩa là gì? Là biến component của bạn thành HTML — thứ trình duyệt hiểu và vẽ ra màn hình. Có bốn thời điểm/nơi chốn để làm việc đó, và chọn đúng là cả một kỹ năng.',
      content: `
${G17_1}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.1 · Stage 5 begins</span>
<h2>First, what does "render" even mean?</h2>
<p class="lead">A browser only knows how to draw <strong>HTML</strong> — the plain text markup like <code>&lt;h1&gt;Hello&lt;/h1&gt;</code>. But you wrote React <em>components</em>, not HTML. "Rendering" is the step that turns your components into that HTML. The big question this chapter answers is: <em>where</em> and <em>when</em> does that turning happen? There are four answers, and each is a trade-off between speed, freshness, and cost.</p>

<h3>A kitchen analogy</h3>
<p>Think of your page as a dish, and HTML as the finished plate served to the diner (the browser):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">CSR — the diner cooks</span><span class="v"><b>Client-Side Rendering.</b> The server sends a nearly empty plate plus a recipe (JavaScript); the browser cooks the page itself. Slow first bite, and a search engine may see an empty plate.</span></div>
  <div class="kv"><span class="k">SSR — cooked to order</span><span class="v"><b>Server-Side Rendering.</b> The server cooks a fresh plate for <em>every</em> request and sends finished HTML. Always fresh; more work per visitor.</span></div>
  <div class="kv"><span class="k">SSG — cooked ahead</span><span class="v"><b>Static Site Generation.</b> The page is cooked once at build time and the same plate is served to everyone. Fastest and cheapest; but it is a snapshot from build.</span></div>
  <div class="kv"><span class="k">ISR — cooked ahead, re-cooked on demand</span><span class="v"><b>Incremental Static Regeneration.</b> Like SSG, but each plate carries a "best before N seconds" label. There is no timer: once the label has expired, the <em>next</em> order triggers a re-cook — and that diner still gets the old plate; the fresh one goes to whoever comes after (measured below).</span></div>
</div>

<h3>Why it matters, concretely</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Speed:</b> a page cooked ahead (SSG/ISR) arrives instantly; one cooked per request (SSR) takes a little longer; one the browser must cook (CSR) shows a spinner first.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Freshness:</b> SSR is always current; SSG is frozen at build; ISR refreshes when a visitor arrives after the window (that visitor still gets the old copy); CSR fetches live in the browser.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Findability (SEO):</b> search engines read the HTML they receive. SSR/SSG/ISR hand them a full page; pure CSR can hand them an empty shell (lesson 17.3).</div></div>
</div>

<div class="callout ok">
<p><strong>The good news for you:</strong> Next.js does all four, and you rarely pick one by name. In the App Router you write normal Server Components (Chapter 9) and control the behaviour with the caching choices you already learned in Chapter 10 — the framework then renders statically or dynamically for you. The next lesson shows exactly how it decides.</p>
</div>

<h3>Four ways a page can be produced</h3>
<div class="lz-map">
  <div class="lz-stage">The trade is always freshness against cost</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Static (SSG)</div><div class="lz-nsub">Rendered at build, served as a file. Fastest and cheapest; the content is only as fresh as your last deploy.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Incremental (ISR)</div><div class="lz-nsub">Static, plus a revalidation window. A visitor after the window still gets the cached page while it rebuilds behind them.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Server-rendered per request (SSR)</div><div class="lz-nsub">Fresh every time, and a database round trip on every visit. Right for personalised or fast-moving pages.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Client-rendered</div><div class="lz-nsub">An empty shell plus a fetch. Slowest first paint and no HTML for crawlers — reserve it for what genuinely cannot be server-rendered.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — assuming a route is static because nothing in it looks dynamic.</strong> One &#96;cookies()&#96; call, one &#96;searchParams&#96; read, one &#96;fetch&#96; with &#96;no-store&#96;, anywhere in the route or in a shared layout, moves the whole thing to per-request rendering. Nothing warns you, and the page still works — it is just now doing a database round trip for every visitor instead of being served as a file. The build output is the check: &#96;○&#96; is static, &#96;●&#96; is static with generated params, &#96;ƒ&#96; is dynamic. Read it after every change to a layout, because a layout&#39;s choice applies to every route beneath it.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components#server-rendering-strategies" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server rendering strategies</span><span class="lc-sub">Static, dynamic and streaming, with what triggers each.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/next-cli#build" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — next build output</span><span class="lc-sub">How to read the route table the build prints, symbol by symbol.</span></span>
</a>


<h3>🔬 Measured: one page, four ways (Next.js 16.4.6 · next start · Chromium)</h3>
<p>The lab: a fake database that waits 300 ms and logs every query. <code>/r/ssg</code> reads nothing request-specific; <code>/r/isr</code> adds <code>export const revalidate = 10</code>; <code>/r/ssr</code> calls <code>await connection()</code>; <code>/r/csr</code> is a <code>&#39;use client&#39;</code> page that fetches <code>/api/gio</code> in <code>useEffect</code>.</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/r/ssr/page.tsx — connection() says "this needs the request" ⇒ rendered on EVERY request</span>
import { connection } from 'next/server';
import { slowDb } from '@/lib/slow-db';
export default async function Ssr() {
  await connection();
  const d = await slowDb('ssr');
  return &lt;main className="p-4 text-lg"&gt;&lt;h1 className="font-bold"&gt;SSR&lt;/h1&gt;&lt;p id="at"&gt;rendered at {d.at}&lt;/p&gt;&lt;/main&gt;;
}</code></pre>
<p><strong>1 · The build already queried the database — for SSG and ISR, before any visitor:</strong></p>
<div class="out">$ npm run build
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|\\[db\\]|/r/|/api/gio|Revalidate|rror|○|ƒ  \\(' | grep -vE '/api/(dem|login|logout|me|posts|steal)'
[db] query #1 for isr at 07:53:37
[db] query #2 for ssg at 07:53:37
Route (app)          Revalidate  Expire
ƒ /api/gio
○ /r/csr
○ /r/isr                  10s      1y
○ /r/ssg
ƒ /r/ssr
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand</div>
<p>Note <code>○ /r/csr</code>: a client page is still prerendered — but only its <em>shell</em>. The data is not in it.</p>
<p><strong>2 · Two requests each, 2 s apart (time to first byte · what the HTML contains):</strong></p>
<div style="overflow-x:auto"><table><thead><tr><th>page</th><th>first byte #1 · #2</th><th>HTML says (request #2)</th></tr></thead><tbody><tr><td><code>ssg</code></td><td>19.9 ms · 2.9 ms</td><td>rendered at 07:53:37</td></tr><tr><td><code>isr</code></td><td>5.8 ms · 3.4 ms</td><td>rendered at 07:53:37</td></tr><tr><td><code>ssr</code></td><td>325.7 ms · 307.0 ms</td><td>rendered at 07:53:51</td></tr><tr><td><code>csr</code></td><td>6.8 ms · 2.3 ms</td><td>loading…</td></tr></tbody></table></div>
<p>SSG and ISR answer in a few milliseconds with the <em>build-time</em> stamp. SSR waits ~300 ms for the database on every request, and the stamp changes. CSR answers fast — with a shell that says <code>loading…</code>.</p>
<div class="out">$ curl -sI localhost:3000/r/ssg | grep -iE "x-nextjs-cache|cache-control"
x-nextjs-cache: HIT
Cache-Control: s-maxage=31536000
$ curl -sI localhost:3000/r/ssr | grep -iE "x-nextjs-cache|cache-control"
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate</div>
<p><strong>3 · Chromium with JavaScript on and off:</strong> CSR, JS on ⇒ “rendered at 07:54:16” · CSR, JS off ⇒ “loading…” · SSR, JS off ⇒ “rendered at 07:54:21”.</p>
<p><strong>4 · ISR is not a timer — four requests, revalidate = 10:</strong></p>
<div class="out">$ for i in 1 2 3 4; do curl -si localhost:3000/r/isr …; sleep 1 | 11 | 1; done
now 07:53:58  x-nextjs-cache: STALE rendered at 07:53:37
now 07:53:59  x-nextjs-cache: HIT rendered at 07:53:58
now 07:54:10  x-nextjs-cache: STALE rendered at 07:53:58
now 07:54:11  x-nextjs-cache: HIT rendered at 07:54:10</div>
<div class="callout warn"><p>The first request after the window gets <strong>STALE</strong> — the old page, instantly — and triggers the rebuild; the next one gets <strong>HIT</strong> with the new stamp. With no visitors nothing is rebuilt: <code>revalidate</code> is a minimum age, not a schedule. Exactly one visitor per window sees old data — fine for a blog list, wrong for a balance or a price.</p></div>
<p><strong>5 · Who hit the database after the build (server log):</strong></p>
<div class="out">[db] query #1 for ssr at 07:53:49
[db] query #2 for ssr at 07:53:51
[db] query #3 for ssr at 07:53:58
[db] query #4 for isr at 07:53:58
[db] query #5 for isr at 07:54:10
[db] query #6 for csr at 07:54:16
[db] query #7 for ssr at 07:54:21</div>
<p>SSR: one query per request (even the <code>curl -I</code>). ISR: one per expired window. SSG: none. CSR moved its query to <code>/api/gio</code>, once per page view.</p>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -rlE "^export const revalidate" src/app | wc -l | sed 's/^ */tệp có export const revalidate: /'
tệp có export const revalidate: 4
$ grep -rnE "^export const revalidate" src/app | sed 's/;$//'
src/app/verify-otp/page.tsx:8:export const revalidate = 0
src/app/download/ct-work/page.tsx:15:export const revalidate = 300
src/app/download/page.tsx:31:export const revalidate = 300
src/app/forgot-password/page.tsx:6:export const revalidate = 0
$ grep -rlE "^export const dynamic = 'force-dynamic'" src/app | wc -l | sed 's/^ */tệp có force-dynamic: /'
tệp có force-dynamic: 39
$ find src/app -name page.tsx | wc -l | sed 's/^ */page.tsx: /'
page.tsx: 348
$ for f in $(find src/app -name page.tsx); do head -c 40 "$f" | grep -q "use client" &amp;&amp; echo "$f"; done | wc -l | sed 's/^ */page.tsx mở đầu bằng use client: /'
page.tsx mở đầu bằng use client: 261
$ curl -s -o /dev/null -w 'cuongthai.com/courses/nextjs  HTTP %{http_code}  %{size_download} byte  %{time_starttransfer}s\\n' https://cuongthai.com/courses/nextjs
cuongthai.com/courses/nextjs  HTTP 200  85114 byte  0.283143s
$ curl -sI https://cuongthai.com/courses/nextjs | grep -iE '^cache-control|^x-nextjs-cache|^x-nextjs-prerender' | tr -d '\\r'
cache-control: no-cache, no-store, must-revalidate</div>Most cuongthai.com pages are client pages (they fetch from the Express API in the browser), so their first HTML carries little data. Only <code>/download</code> and <code>/download/ct-work</code> use ISR (5 minutes); <code>revalidate = 0</code> just means dynamic. Production answers <code>no-store</code> even for static pages because nginx rewrites <code>Cache-Control</code>.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># four pages: plain · revalidate = 10 · await connection() · use client + fetch</span>
npm run build 2&gt;&amp;1 | grep -E '\\[db\\]|/r/'  <span class="tok-comment">  # which pages queried at build?</span>
npm start
for p in ssg isr ssr csr; do curl -s localhost:3000/r/$p -o p.html -w "$p %{time_starttransfer}s "; sed 's/&lt;!-- --&gt;//g' p.html | grep -oE 'rendered at [0-9:]+|loading…'; done
curl -si localhost:3000/r/isr | grep -i x-nextjs-cache  <span class="tok-comment">  # again after 10 s: STALE, then HIT</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">Exam results day: thousands refresh the same school portal page at once. With SSR every refresh is a database query.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">A price page on ISR with a long window? One visitor per window sees the old price — fine for news, risky for stock or money.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Hammering a heavy SSR page: every request costs a query — a cheap way to slow the whole site.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Serve same-for-everyone pages statically, rate-limit, watch database queries per minute, put a CDN in front.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-3-revalidate" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.3 — Revalidate: by time and on demand</span><span class="lc-sub">The same window, from the caching side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-1-mac-dinh-la-server-component" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.1 — Server Components by default</span><span class="lc-sub">Why SSG/SSR need no client JavaScript</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-8-2-cache-dung" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 8.2 — Cache keys, TTL, purging</span><span class="lc-sub">What s-maxage means for a CDN</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-2-cai-gi-duoc-cache" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 5.2 — What gets cached</span><span class="lc-sub">Why production answers no-store</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>For three real pages (a marketing page, a user dashboard, a blog list), decide which rendering fits: SSG, SSR or ISR — and why.</li>
<li>Build one page each way and read the build output to see which is static and which is dynamic.</li>
<li>Summarise the trade-off of each in one line (freshness vs speed vs cost).</li>
</ol>
<p><strong>Done when:</strong> you can match each page to a rendering strategy and justify it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CSR</span><span class="v">Client-Side Rendering: the browser builds the page from JS.</span></div>
  <div class="kv"><span class="k">SSR</span><span class="v">Server-Side Rendering per request: fresh HTML each time.</span></div>
  <div class="kv"><span class="k">SSG</span><span class="v">Static generation at build: HTML made once, served fast.</span></div>
  <div class="kv"><span class="k">ISR</span><span class="v">Incremental Static Regeneration: static that refreshes over time.</span></div>
  <div class="kv"><span class="k">Freshness vs speed</span><span class="v">The core trade-off between the strategies.</span></div>
  <div class="kv"><span class="k">PPR</span><span class="v">Partial Prerendering: a static shell with dynamic holes (newer).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A page can be made four ways: CSR (browser), SSR (per request), SSG (at build), ISR (static that refreshes).</li><li>The core trade-off is freshness vs speed vs cost.</li><li>Static pages are fastest and cheapest; dynamic pages are always fresh.</li><li>ISR (and PPR) blend the two — static speed with periodic freshness.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Rendering</span><span class="lc-sub">Server vs client rendering, static vs dynamic, and streaming — the whole map.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.1 · Mở Giai đoạn 5</span>
<h2>Trước hết, "render" nghĩa là gì?</h2>
<p class="lead">Một trình duyệt chỉ biết vẽ <strong>HTML</strong> — thứ markup văn bản thuần như <code>&lt;h1&gt;Hello&lt;/h1&gt;</code>. Nhưng bạn viết <em>component</em> React, không phải HTML. "Render" là bước biến component của bạn thành HTML đó. Câu hỏi lớn của chương này là: việc biến đổi ấy xảy ra <em>ở đâu</em> và <em>khi nào</em>? Có bốn câu trả lời, mỗi cái là một đánh đổi giữa tốc độ, độ tươi, và chi phí.</p>

<h3>Ví von nhà bếp</h3>
<p>Hãy coi trang của bạn như một món ăn, và HTML là đĩa đã hoàn thành dọn cho thực khách (trình duyệt):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">CSR — thực khách tự nấu</span><span class="v"><b>Client-Side Rendering.</b> Server gửi một đĩa gần như trống cộng một công thức (JavaScript); trình duyệt tự nấu trang. Miếng đầu chậm, và máy tìm kiếm có thể chỉ thấy đĩa trống.</span></div>
  <div class="kv"><span class="k">SSR — nấu theo yêu cầu</span><span class="v"><b>Server-Side Rendering.</b> Server nấu một đĩa tươi cho <em>mỗi</em> request và gửi HTML hoàn chỉnh. Luôn tươi; tốn công hơn mỗi khách.</span></div>
  <div class="kv"><span class="k">SSG — nấu sẵn từ trước</span><span class="v"><b>Static Site Generation.</b> Trang được nấu một lần lúc build và cùng một đĩa dọn cho mọi người. Nhanh và rẻ nhất; nhưng là ảnh chụp từ lúc build.</span></div>
  <div class="kv"><span class="k">ISR — nấu sẵn, nấu lại khi có người gọi</span><span class="v"><b>Incremental Static Regeneration.</b> Như SSG, nhưng mỗi đĩa dán nhãn "dùng trong N giây". KHÔNG có đồng hồ hẹn giờ: quá hạn rồi thì đơn <em>kế tiếp</em> mới kích hoạt nấu lại — và chính người đó vẫn nhận đĩa cũ; đĩa mới dành cho người tới sau (đo bên dưới).</span></div>
</div>

<h3>Vì sao quan trọng, cụ thể</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Tốc độ:</b> trang nấu sẵn (SSG/ISR) tới tức thì; nấu mỗi request (SSR) lâu hơn chút; trang trình duyệt phải tự nấu (CSR) hiện spinner trước.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Độ tươi:</b> SSR luôn mới; SSG đóng băng lúc build; ISR làm mới khi có người ghé sau hạn (chính người đó vẫn nhận bản cũ); CSR fetch trực tiếp trong trình duyệt.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Khả năng tìm thấy (SEO):</b> máy tìm kiếm đọc HTML chúng nhận. SSR/SSG/ISR trao cho chúng một trang đầy đủ; CSR thuần có thể trao một vỏ trống (bài 17.3).</div></div>
</div>

<div class="callout ok">
<p><strong>Tin vui cho bạn:</strong> Next.js làm cả bốn, và bạn hiếm khi chọn bằng tên. Trong App Router bạn viết Server Component thường (Chương 9) và điều khiển hành vi bằng các lựa chọn cache bạn đã học ở Chương 10 — framework rồi sẽ render tĩnh hay động giúp bạn. Bài sau chỉ chính xác cách nó quyết định.</p>
</div>

<h3>Bốn cách một trang được tạo ra</h3>
<div class="lz-map">
  <div class="lz-stage">Cuộc đánh đổi luôn là độ tươi đổi lấy chi phí</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tĩnh (SSG)</div><div class="lz-nsub">Vẽ lúc build, phục vụ như một file. Nhanh nhất và rẻ nhất; nội dung chỉ tươi bằng lần deploy gần nhất của bạn.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tăng dần (ISR)</div><div class="lz-nsub">Tĩnh, cộng thêm một khoảng làm mới. Khách ghé sau khoảng đó vẫn nhận trang trong đệm trong lúc nó dựng lại ở phía sau.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Render ở máy chủ theo từng request (SSR)</div><div class="lz-nsub">Tươi mọi lần, và một lượt đi về cơ sở dữ liệu ở mỗi lượt ghé. Đúng cho trang cá nhân hoá hoặc trang thay đổi nhanh.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Render ở client</div><div class="lz-nsub">Một cái vỏ rỗng cộng một lượt fetch. Lần vẽ đầu chậm nhất và không có HTML cho bot — hãy để dành nó cho thứ thật sự không render ở máy chủ được.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — cho rằng một route là tĩnh vì chẳng có gì trong đó trông có vẻ động.</strong> Một lời gọi &#96;cookies()&#96;, một lần đọc &#96;searchParams&#96;, một &#96;fetch&#96; kèm &#96;no-store&#96;, ở bất cứ đâu trong route hay trong một layout dùng chung, đều dời cả thứ đó sang render theo từng request. Chẳng gì cảnh báo bạn, và trang vẫn chạy — chỉ là giờ nó đi về cơ sở dữ liệu một lượt cho mỗi khách thay vì được phục vụ như một file. Đầu ra của build là phép kiểm: &#96;○&#96; là tĩnh, &#96;●&#96; là tĩnh có sinh params, &#96;ƒ&#96; là động. Hãy đọc nó sau mỗi thay đổi ở một layout, vì lựa chọn của một layout áp cho mọi route bên dưới nó.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components#server-rendering-strategies" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Các chiến lược render ở máy chủ</span><span class="lc-sub">Tĩnh, động và streaming, kèm thứ kích hoạt từng cái.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/next-cli#build" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Đầu ra của next build</span><span class="lc-sub">Cách đọc bảng route mà bản build in ra, từng ký hiệu một.</span></span>
</a>


<h3>🔬 Đo thật: một trang, bốn cách (Next.js 16.4.6 · next start · Chromium)</h3>
<p>Phòng lab: một cơ sở dữ liệu giả chờ 300 ms và ghi lại mọi truy vấn. <code>/r/ssg</code> không đọc gì riêng của request; <code>/r/isr</code> thêm <code>export const revalidate = 10</code>; <code>/r/ssr</code> gọi <code>await connection()</code>; <code>/r/csr</code> là trang <code>&#39;use client&#39;</code> tự fetch <code>/api/gio</code> trong <code>useEffect</code>.</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/r/ssr/page.tsx — connection() says "this needs the request" ⇒ rendered on EVERY request</span>
import { connection } from 'next/server';
import { slowDb } from '@/lib/slow-db';
export default async function Ssr() {
  await connection();
  const d = await slowDb('ssr');
  return &lt;main className="p-4 text-lg"&gt;&lt;h1 className="font-bold"&gt;SSR&lt;/h1&gt;&lt;p id="at"&gt;rendered at {d.at}&lt;/p&gt;&lt;/main&gt;;
}</code></pre>
<p><strong>1 · Bản build đã hỏi cơ sở dữ liệu — cho SSG và ISR, trước khi có ai ghé:</strong></p>
<div class="out">$ npm run build
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|\\[db\\]|/r/|/api/gio|Revalidate|rror|○|ƒ  \\(' | grep -vE '/api/(dem|login|logout|me|posts|steal)'
[db] query #1 for isr at 07:53:37
[db] query #2 for ssg at 07:53:37
Route (app)          Revalidate  Expire
ƒ /api/gio
○ /r/csr
○ /r/isr                  10s      1y
○ /r/ssg
ƒ /r/ssr
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand</div>
<p>Để ý <code>○ /r/csr</code>: trang client vẫn được dựng sẵn — nhưng chỉ cái <em>vỏ</em>. Dữ liệu không có trong đó.</p>
<p><strong>2 · Mỗi trang hai request, cách nhau 2 giây (thời gian tới byte đầu · HTML chứa gì):</strong></p>
<div style="overflow-x:auto"><table><thead><tr><th>trang</th><th>byte đầu #1 · #2</th><th>HTML ghi (request #2)</th></tr></thead><tbody><tr><td><code>ssg</code></td><td>19.9 ms · 2.9 ms</td><td>rendered at 07:53:37</td></tr><tr><td><code>isr</code></td><td>5.8 ms · 3.4 ms</td><td>rendered at 07:53:37</td></tr><tr><td><code>ssr</code></td><td>325.7 ms · 307.0 ms</td><td>rendered at 07:53:51</td></tr><tr><td><code>csr</code></td><td>6.8 ms · 2.3 ms</td><td>loading…</td></tr></tbody></table></div>
<p>SSG và ISR trả lời trong vài mili giây với dấu giờ <em>lúc build</em>. SSR chờ ~300 ms cho cơ sở dữ liệu ở mọi request, dấu giờ đổi mỗi lần. CSR trả nhanh — một cái vỏ ghi <code>loading…</code>.</p>
<div class="out">$ curl -sI localhost:3000/r/ssg | grep -iE "x-nextjs-cache|cache-control"
x-nextjs-cache: HIT
Cache-Control: s-maxage=31536000
$ curl -sI localhost:3000/r/ssr | grep -iE "x-nextjs-cache|cache-control"
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate</div>
<p><strong>3 · Chromium bật và tắt JavaScript:</strong> CSR, JS bật ⇒ “rendered at 07:54:16” · CSR, JS tắt ⇒ “loading…” · SSR, JS tắt ⇒ “rendered at 07:54:21”.</p>
<p><strong>4 · ISR không phải đồng hồ — bốn request, revalidate = 10:</strong></p>
<div class="out">$ for i in 1 2 3 4; do curl -si localhost:3000/r/isr …; sleep 1 | 11 | 1; done
now 07:53:58  x-nextjs-cache: STALE rendered at 07:53:37
now 07:53:59  x-nextjs-cache: HIT rendered at 07:53:58
now 07:54:10  x-nextjs-cache: STALE rendered at 07:53:58
now 07:54:11  x-nextjs-cache: HIT rendered at 07:54:10</div>
<div class="callout warn"><p>Request đầu tiên sau hạn nhận <strong>STALE</strong> — bản cũ, ngay lập tức — và kích hoạt dựng lại; request kế tiếp nhận <strong>HIT</strong> với dấu giờ mới. Không ai ghé thì không có gì được dựng lại: <code>revalidate</code> là tuổi tối thiểu, không phải lịch hẹn. Đúng một người mỗi khoảng thấy dữ liệu cũ — ổn với danh sách bài viết, sai với số dư hay giá tiền.</p></div>
<p><strong>5 · Ai hỏi cơ sở dữ liệu sau khi build (nhật ký máy chủ):</strong></p>
<div class="out">[db] query #1 for ssr at 07:53:49
[db] query #2 for ssr at 07:53:51
[db] query #3 for ssr at 07:53:58
[db] query #4 for isr at 07:53:58
[db] query #5 for isr at 07:54:10
[db] query #6 for csr at 07:54:16
[db] query #7 for ssr at 07:54:21</div>
<p>SSR: một truy vấn mỗi request (kể cả <code>curl -I</code>). ISR: một lần mỗi khoảng hết hạn. SSG: không lần nào. CSR dời truy vấn sang <code>/api/gio</code>, một lần mỗi lượt xem.</p>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -rlE "^export const revalidate" src/app | wc -l | sed 's/^ */tệp có export const revalidate: /'
tệp có export const revalidate: 4
$ grep -rnE "^export const revalidate" src/app | sed 's/;$//'
src/app/verify-otp/page.tsx:8:export const revalidate = 0
src/app/download/ct-work/page.tsx:15:export const revalidate = 300
src/app/download/page.tsx:31:export const revalidate = 300
src/app/forgot-password/page.tsx:6:export const revalidate = 0
$ grep -rlE "^export const dynamic = 'force-dynamic'" src/app | wc -l | sed 's/^ */tệp có force-dynamic: /'
tệp có force-dynamic: 39
$ find src/app -name page.tsx | wc -l | sed 's/^ */page.tsx: /'
page.tsx: 348
$ for f in $(find src/app -name page.tsx); do head -c 40 "$f" | grep -q "use client" &amp;&amp; echo "$f"; done | wc -l | sed 's/^ */page.tsx mở đầu bằng use client: /'
page.tsx mở đầu bằng use client: 261
$ curl -s -o /dev/null -w 'cuongthai.com/courses/nextjs  HTTP %{http_code}  %{size_download} byte  %{time_starttransfer}s\\n' https://cuongthai.com/courses/nextjs
cuongthai.com/courses/nextjs  HTTP 200  85114 byte  0.283143s
$ curl -sI https://cuongthai.com/courses/nextjs | grep -iE '^cache-control|^x-nextjs-cache|^x-nextjs-prerender' | tr -d '\\r'
cache-control: no-cache, no-store, must-revalidate</div>Phần lớn trang cuongthai.com là trang client (fetch từ API Express trong trình duyệt), nên HTML đầu tiên mang ít dữ liệu. Chỉ <code>/download</code> và <code>/download/ct-work</code> dùng ISR (5 phút); <code>revalidate = 0</code> chỉ có nghĩa là động. Máy thật trả <code>no-store</code> kể cả với trang tĩnh vì nginx viết đè <code>Cache-Control</code>.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># bốn trang: thường · revalidate = 10 · await connection() · use client + fetch</span>
npm run build 2&gt;&amp;1 | grep -E '\\[db\\]|/r/'  <span class="tok-comment">  # trang nào hỏi DB lúc build?</span>
npm start
for p in ssg isr ssr csr; do curl -s localhost:3000/r/$p -o p.html -w "$p %{time_starttransfer}s "; sed 's/&lt;!-- --&gt;//g' p.html | grep -oE 'rendered at [0-9:]+|loading…'; done
curl -si localhost:3000/r/isr | grep -i x-nextjs-cache  <span class="tok-comment">  # lại sau 10 s: STALE, rồi HIT</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Ngày công bố điểm thi: hàng nghìn bạn cùng tải lại một trang cổng trường. Với SSR, mỗi lần tải lại là một truy vấn.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Trang giá dùng ISR với hạn dài? Mỗi khoảng, đúng một người thấy giá cũ — ổn với tin tức, rủi ro với hàng tồn hay tiền.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Dồn request vào một trang SSR nặng: mỗi request tốn một truy vấn — cách rẻ tiền làm cả trang chậm.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Trang giống nhau cho mọi người thì phục vụ tĩnh, giới hạn tốc độ, theo dõi số truy vấn mỗi phút, đặt CDN phía trước.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-3-revalidate" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.3 — Revalidate: theo thời gian và theo yêu cầu</span><span class="lc-sub">Cùng cái hạn đó, nhìn từ phía cache</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-1-mac-dinh-la-server-component" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.1 — Mặc định là Server Component</span><span class="lc-sub">Vì sao SSG/SSR không cần JavaScript phía client</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-8-2-cache-dung" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 8.2 — Khoá cache, TTL và xoá cache</span><span class="lc-sub">s-maxage nghĩa là gì với CDN</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-2-cai-gi-duoc-cache" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 5.2 — Cái gì được cache</span><span class="lc-sub">Vì sao máy thật trả no-store</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Với ba trang thật (một trang marketing, một dashboard người dùng, một danh sách blog), quyết định cách render nào hợp: SSG, SSR hay ISR — và vì sao.</li>
<li>Dựng một trang theo mỗi cách và đọc output build để thấy cái nào tĩnh, cái nào động.</li>
<li>Tóm đánh đổi của mỗi cách một dòng (độ mới vs tốc độ vs chi phí).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn khớp được mỗi trang với một chiến lược render và biện minh nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CSR</span><span class="v">Client-Side Rendering: trình duyệt dựng trang từ JS.</span></div>
  <div class="kv"><span class="k">SSR</span><span class="v">Server-Side Rendering mỗi request: HTML mới mỗi lần.</span></div>
  <div class="kv"><span class="k">SSG</span><span class="v">Tạo tĩnh lúc build: HTML làm một lần, phục vụ nhanh.</span></div>
  <div class="kv"><span class="k">ISR</span><span class="v">Incremental Static Regeneration: tĩnh mà làm mới theo thời gian.</span></div>
  <div class="kv"><span class="k">Độ mới vs tốc độ</span><span class="v">Đánh đổi cốt lõi giữa các chiến lược.</span></div>
  <div class="kv"><span class="k">PPR</span><span class="v">Partial Prerendering: khung tĩnh với lỗ động (mới hơn).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một trang làm được bốn cách: CSR (trình duyệt), SSR (mỗi request), SSG (lúc build), ISR (tĩnh mà làm mới).</li><li>Đánh đổi cốt lõi là độ mới vs tốc độ vs chi phí.</li><li>Trang tĩnh nhanh nhất và rẻ nhất; trang động luôn mới.</li><li>ISR (và PPR) pha trộn hai cái — tốc độ tĩnh với độ mới định kỳ.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Rendering</span><span class="lc-sub">Render server vs client, tĩnh vs động, và streaming — toàn bản đồ.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 17.2 ─────────────────────────── */
    {
      title: '17.2 — Static vs dynamic in the App Router|||17.2 — Tĩnh vs động trong App Router',
      slug: 'nextjs-17-2-tinh-vs-dong',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Bạn không gõ "hãy SSG" — Next tự quyết mỗi route là tĩnh (nấu sẵn) hay động (nấu mỗi request) dựa trên những gì code bạn dùng. Bài này chỉ đúng những "công tắc" khiến một route chuyển sang động.',
      content: `
${G17_2}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.2</span>
<h2>You do not name the strategy — your code implies it</h2>
<p class="lead">In the App Router you don't write "make this SSG." Next.js looks at what a route <em>does</em> and decides: if nothing about the route depends on the individual request, it can be <strong>static</strong> (rendered once, like SSG); the moment it needs something request-specific, it becomes <strong>dynamic</strong> (rendered per request, like SSR). Learning the switches is the whole skill.</p>

<h3>Static by default</h3>
<p>A plain Server Component that just renders markup, or fetches cacheable data, can be rendered once at build and reused — fast and cheap. This is the default the framework reaches for whenever it can.</p>

<h3>What flips a route to dynamic</h3>
<p>These are "request-specific" things — they can only be known when a real visitor arrives, so using any of them makes the route render per request:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Reading cookies() or headers()</span><span class="v">Per-user, per-request data. If you read the auth cookie, the page cannot be one shared static file.</span></div>
  <div class="kv"><span class="k">Using searchParams</span><span class="v">The <code>?q=...</code> part of the URL differs per visit, so the page must be built when the request arrives.</span></div>
  <div class="kv"><span class="k">An uncached fetch</span><span class="v"><code>fetch(url, { cache: 'no-store' })</code> asks for fresh data every time — that is dynamic by definition (Chapter 10).</span></div>
  <div class="kv"><span class="k">export const dynamic = 'force-dynamic'</span><span class="v">The explicit override: "always render this per request," no guessing.</span></div>
</div>

<h3>How this ties back to Chapter 10</h3>
<p>This is the same caching model, seen from the rendering angle. A cached fetch or a time-based <code>revalidate</code> keeps a route static (and gives you ISR — static that refreshes). An uncached fetch or reading cookies makes it dynamic (SSR). So the caching decisions you already made <em>are</em> your rendering strategy — you were choosing SSG/ISR/SSR without the labels.</p>

<div class="callout warn">
<p><strong>Beginner gotcha:</strong> accidentally making a whole page dynamic. If you read a cookie or use <code>searchParams</code> high up in a page that could have been static, you opt the entire route out of static rendering. If only a small part needs request data, move that part to the <strong>client</strong> (a small Client Component that fetches its own value) so the rest stays static. Measured on Next.js 16.4.6 with the default config: moving the <code>cookies()</code> read into a child Server Component wrapped in <code>&lt;Suspense&gt;</code> does <em>not</em> keep the route static — it is still ƒ and re-runs the whole page per request. A static shell with streamed dynamic holes needs <code>cacheComponents</code> (Partial Prerendering). "Why is my page suddenly slow / rebuilding every request?" usually traces to one request-specific call added near the top.</p>
</div>

<h3>Deciding per route, not per app</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Ask who the page is for</b> — The same for everyone → static. Different per user → dynamic. That single question decides most routes.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Then ask how fresh it must be</b> — Minutes are fine → revalidate on a timer. Instantly correct after a write → revalidate on demand from the action.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Mixed pages are normal</b> — A static page with one small Client Component that fetches the personal part. (A static shell with a dynamic Server Component inside Suspense needs <code>cacheComponents</code>; without it the whole route is ƒ — measured below.)</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Verify in the build output</b> — The route table is the only place the answer is authoritative. Assumptions here are usually wrong.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — making a whole page dynamic because one small part is personal.</strong> A product page that shows &quot;3 in your cart&quot; in the header does not need to be rendered per request: the product content is identical for everyone and the cart count is one number. Marking the route dynamic throws away static generation for the entire page — every visit re-renders the description, the images, the reviews. Keep the page static and let the personal fragment be a Client Component that fetches its own number. (A Suspense boundary around a server-side cookie read only streams — the route stays dynamic unless <code>cacheComponents</code> is on.) The measurement is in the build output and in time-to-first-byte, both of which change immediately.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Partial prerendering</span><span class="lc-sub">Where this pattern is heading: one route, static shell, dynamic holes.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#full-route-cache" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Full Route Cache</span><span class="lc-sub">What static generation actually caches, and what invalidates it.</span></span>
</a>


<h3>🔬 Measured: which line flips a route (Next.js 16.4.6 · next start · default config)</h3>
<p>Seven tiny pages under <code>/s/*</code>, each touching one thing; a shared layout that reads a cookie (<code>/l/*</code>); and one product page built three ways (<code>/sp/*</code>). The build table:</p>
<div class="out">$ npm run build
ƒ /api/cart
ƒ /l/about
ƒ /l/terms
ƒ /s/cookie
○ /s/fetch
ƒ /s/force
ƒ /s/header
ƒ /s/nostore
○ /s/plain
ƒ /s/search
ƒ /sp/dong
○ /sp/tinh
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand</div>
<div style="overflow-x:auto"><table><thead><tr><th>route</th><th>the page…</th><th>build</th></tr></thead><tbody>
<tr><td><code>/s/plain</code></td><td>reads nothing request-specific</td><td>○</td></tr><tr><td><code>/s/fetch</code></td><td><code>fetch(url)</code> with no options</td><td>○</td></tr><tr><td><code>/s/cookie</code></td><td><code>cookies()</code></td><td>ƒ</td></tr><tr><td><code>/s/header</code></td><td><code>headers()</code></td><td>ƒ</td></tr><tr><td><code>/s/search</code></td><td><code>searchParams</code></td><td>ƒ</td></tr><tr><td><code>/s/nostore</code></td><td><code>fetch(url, {{ cache: 'no-store' }})</code></td><td>ƒ</td></tr><tr><td><code>/s/force</code></td><td><code>dynamic = 'force-dynamic'</code></td><td>ƒ</td></tr><tr><td><code>/l/about</code></td><td>nothing — but its <strong>layout</strong> reads a cookie</td><td>ƒ</td></tr>
</tbody></table></div>
<p><strong>Trap 1 — “not cached” is not “fresh”.</strong> A clock server on :19323; two requests 2 s apart:</p>
<div class="out">$ curl …/s/fetch   # fetch(url), no options
fetch · 08:07:20
fetch · 08:07:20
$ curl …/s/nostore # fetch(url, { cache: 'no-store' })
no-store · 08:07:27
no-store · 08:07:29</div>
<p>Since Next.js 15 a plain <code>fetch</code> is not stored in the data cache — but the route is still prerendered, so the time fetched <em>at build</em> is served forever. Ask for freshness explicitly: <code>no-store</code>, or <code>revalidate</code>.</p>
<p><strong>Trap 2 — one cookie in a shared layout:</strong> <code>/l/about</code> and <code>/l/terms</code> are the same for everyone, yet both are ƒ (hello, An).</p>
<p><strong>The product page, three shapes (Cookie: cart=3):</strong></p>
<div class="out">$ for p in dong tinh; do for i in 1 2 3; do curl … -w "%{time_starttransfer}s"; done; done
dong #1 0.308752s  🛒 3
dong #2 0.305528s  🛒 3
dong #3 0.308709s  🛒 3
tinh #1 0.009732s  🛒 …
tinh #2 0.002277s  🛒 …
tinh #3 0.001575s  🛒 …
$ npm run build   # + /sp/sus: cookies() in a child, inside &lt;Suspense&gt;
ƒ /sp/dong
ƒ /sp/sus
○ /sp/tinh
$ for i in 1 2 3; do curl …/sp/sus …; done
sus #1 0.334953s  🛒 …
sus #2 0.308041s  🛒 …
sus #3 0.308735s  🛒 …
✓ Ready in 105ms
✓ Running next.config.ts took 28ms
[db] query #1 for product (sus) at 08:18:41
[db] query #2 for product (sus) at 08:18:42
[db] query #3 for product (sus) at 08:18:42</div>
<div class="callout warn"><p><code>/sp/dong</code> reads the cookie on the server: ƒ, ~300 ms, the product query on every request. <code>/sp/tinh</code> keeps the page static and lets a Client Component fetch <code>/api/cart</code>: ○, a few ms, the HTML says <code>🛒 …</code> and the browser fills in the number. <code>/sp/sus</code> — the cookie read isolated in a child Server Component inside <code>&lt;Suspense&gt;</code> — is <strong>still ƒ and still ~300 ms</strong>: Suspense streams, it does not make the rest static (that needs <code>cacheComponents</code>).</p></div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -nE "cookies\\(\\)|headers\\(\\)" src/app/layout.tsx | head -3; echo "(root layout: $(grep -cE 'cookies\\(\\)|headers\\(\\)' src/app/layout.tsx) lần cookies()/headers())"
(root layout: 0 lần cookies()/headers())
$ grep -rlE "cookies\\(\\)|headers\\(\\)" src/app --include=layout.tsx | sed 's/^/layout đọc request: /'
$ grep -rlE "^export const dynamic = 'force-dynamic'" src/app | sed 's#src/app/##' | cut -d/ -f1 | sort | uniq -c | sort -rn | head -6
   4 games
   4 courses
   4 api
   3 tech-trends
   3 repos
   3 exam
$ sed -n '30,36p' src/app/sitemap.ts
// Render on-demand at RUNTIME (never build-time prerendered) so the dynamic
// URLs are always fetched against the INTERNAL backend, which is reachable at
// runtime but NOT during &#96;npm run build&#96;. This guarantees the sitemap always
// carries the full URL set (never a static-only subset). The fetches below run
// in parallel with a tight 3s timeout, so the live render stays fast (≤3s
// worst-case) — which is what avoids Google Search Console's fetch timeout.
export const dynamic = 'force-dynamic'</div>No layout in the cuongthai.com frontend reads cookies or headers, so no single line can flip the whole site. <code>sitemap.ts</code> forces dynamic and says why: the backend is not reachable during <code>npm run build</code>.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># one page per switch, then read the table</span>
npm run build 2&gt;&amp;1 | grep -E '^. /'
<span class="tok-comment"># predict ○ or ƒ BEFORE building; a wrong guess is the lesson</span>
npm start
curl -s localhost:3000/s/fetch | grep -o 'fetch · [0-9:]*' <span class="tok-comment">  # twice: frozen?</span>
curl -s -o /dev/null -w '%{time_starttransfer}\\n' localhost:3000/sp/tinh -H 'Cookie: cart=3'</code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">A shop page that greets you by name reads one cookie — and the whole page renders per request; every visitor waits for the product query.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">A teammate adds <code>cookies()</code> to the root layout? Every route turns ƒ — no error, no warning.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Random <code>?q=</code> values on a <code>searchParams</code> page: every unique URL is a fresh render, skipping caches and loading the server.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Read the build table after every layout change; move personal bits to a client badge; let CI fail when a route you expect ○ turns ƒ; rate-limit search.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-2-cache" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.2 — Caching, plainly</span><span class="lc-sub">Why the default fetch changed in 15</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-4-streaming-suspense" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.4 — Streaming and Suspense</span><span class="lc-sub">What Suspense does: stream, not cache</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-15-4-doc-nguoi-dung" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 15.4 — Reading the user on the server</span><span class="lc-sub">Where reading a cookie is right</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-1-bon-cach-render" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.1 — Four ways a page gets made</span><span class="lc-sub">The numbers behind ○ and ƒ</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Static route</span><span class="v">Pre-rendered at build; same HTML for everyone.</span></div>
  <div class="kv"><span class="k">Dynamic route</span><span class="v">Rendered per request because it reads request data.</span></div>
  <div class="kv"><span class="k">Dynamic APIs</span><span class="v"><code>cookies()</code>, <code>headers()</code>, <code>searchParams</code> force dynamic rendering.</span></div>
  <div class="kv"><span class="k">no-store fetch</span><span class="v">An uncached fetch opts a route into dynamic.</span></div>
  <div class="kv"><span class="k">Build output</span><span class="v">The build marks each route static or dynamic.</span></div>
  <div class="kv"><span class="k">Opting dynamic</span><span class="v"><code>export const dynamic = 'force-dynamic'</code> when you need it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>In the App Router a route is static by default and becomes dynamic when it reads request data.</li><li>Using <code>cookies()</code>, <code>headers()</code>, <code>searchParams</code> or a <code>no-store</code> fetch forces dynamic rendering.</li><li>The build output tells you which each route is — check it, do not guess.</li><li>Force it explicitly with <code>export const dynamic</code> when you need a specific behaviour.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components#server-rendering-strategies" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server rendering strategies</span><span class="lc-sub">Static, dynamic, and streaming — and what triggers each.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.2</span>
<h2>Bạn không đặt tên chiến lược — code của bạn ngụ ý nó</h2>
<p class="lead">Trong App Router bạn không viết "làm SSG cái này". Next.js nhìn một route <em>làm gì</em> và quyết: nếu không gì về route phụ thuộc từng request, nó có thể <strong>tĩnh</strong> (render một lần, như SSG); ngay khi cần thứ gì đó riêng-theo-request, nó thành <strong>động</strong> (render mỗi request, như SSR). Học các công tắc là toàn bộ kỹ năng.</p>

<h3>Mặc định là tĩnh</h3>
<p>Một Server Component thường chỉ render markup, hoặc fetch dữ liệu cache được, có thể render một lần lúc build và dùng lại — nhanh và rẻ. Đây là mặc định framework với tới bất cứ khi nào có thể.</p>

<h3>Cái gì lật một route sang động</h3>
<p>Đây là những thứ "riêng-theo-request" — chỉ biết được khi một khách thật tới, nên dùng bất kỳ cái nào làm route render mỗi request:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Đọc cookies() hoặc headers()</span><span class="v">Dữ liệu theo từng người, từng request. Nếu bạn đọc cookie auth, trang không thể là một file tĩnh dùng chung.</span></div>
  <div class="kv"><span class="k">Dùng searchParams</span><span class="v">Phần <code>?q=...</code> của URL khác nhau mỗi lần vào, nên trang phải dựng khi request tới.</span></div>
  <div class="kv"><span class="k">Một fetch không cache</span><span class="v"><code>fetch(url, { cache: 'no-store' })</code> đòi dữ liệu tươi mỗi lần — đó là động theo định nghĩa (Chương 10).</span></div>
  <div class="kv"><span class="k">export const dynamic = 'force-dynamic'</span><span class="v">Ghi đè tường minh: "luôn render cái này mỗi request", không đoán.</span></div>
</div>

<h3>Nối lại với Chương 10 thế nào</h3>
<p>Đây là cùng mô hình cache, nhìn từ góc render. Một fetch có cache hoặc <code>revalidate</code> theo thời gian giữ route tĩnh (và cho bạn ISR — tĩnh mà làm mới). Một fetch không cache hoặc đọc cookie làm nó động (SSR). Nên các quyết định cache bạn đã làm <em>chính là</em> chiến lược render — bạn đã chọn SSG/ISR/SSR mà không có nhãn.</p>

<div class="callout warn">
<p><strong>Bẫy người mới:</strong> vô tình làm cả trang thành động. Nếu bạn đọc một cookie hoặc dùng <code>searchParams</code> ở trên cao trong một trang lẽ ra tĩnh được, bạn đưa cả route ra khỏi render tĩnh. Nếu chỉ một phần nhỏ cần dữ liệu request, hãy đưa phần đó sang <strong>client</strong> (một Client Component nhỏ tự fetch giá trị của nó) để phần còn lại giữ tĩnh. Đo trên Next.js 16.4.6 với cấu hình mặc định: dời lời gọi <code>cookies()</code> vào một Server Component con bọc <code>&lt;Suspense&gt;</code> KHÔNG giữ được route tĩnh — nó vẫn là ƒ và dựng lại cả trang ở mỗi request. Vỏ tĩnh có lỗ động stream riêng cần bật <code>cacheComponents</code> (Partial Prerendering). "Sao trang tôi bỗng chậm / dựng lại mỗi request?" thường truy về một lời gọi riêng-theo-request thêm gần đầu.</p>
</div>

<h3>Quyết định theo từng route, đừng quyết cho cả ứng dụng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Hãy hỏi trang này dành cho ai</b> — Giống nhau với tất cả → tĩnh. Khác nhau theo từng người → động. Đúng một câu hỏi đó quyết định phần lớn các route.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Rồi hỏi nó phải tươi tới mức nào</b> — Vài phút cũng được → làm mới theo bộ đếm giờ. Phải đúng ngay sau khi ghi → làm mới theo yêu cầu từ chính action.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Trang pha trộn là chuyện bình thường</b> — Một trang tĩnh với một Client Component nhỏ tự lấy phần riêng tư. (Vỏ tĩnh với Server Component động bên trong Suspense cần bật <code>cacheComponents</code>; không bật thì cả route là ƒ — đo bên dưới.)</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Xác nhận trong đầu ra của build</b> — Bảng route là nơi duy nhất câu trả lời có thẩm quyền. Phỏng đoán ở đây thường là sai.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — làm cả trang thành động chỉ vì một mẩu nhỏ mang tính cá nhân.</strong> Một trang sản phẩm hiện &quot;3 món trong giỏ&quot; ở đầu trang thì chẳng cần render theo từng request: nội dung sản phẩm y hệt nhau với tất cả mọi người còn số món trong giỏ chỉ là một con số. Đánh dấu route là động là vứt bỏ phần sinh tĩnh của cả trang — mỗi lượt ghé lại vẽ lại phần mô tả, các tấm ảnh, các đánh giá. Hãy giữ trang ở dạng tĩnh và để cái mẩu cá nhân đó là một Client Component tự lấy con số của nó. (Một ranh giới Suspense quanh lời đọc cookie phía server chỉ giúp stream — route vẫn động trừ khi bật <code>cacheComponents</code>.) Phép đo nằm ở đầu ra của build và ở thời gian tới byte đầu tiên, cả hai đều đổi ngay lập tức.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Partial prerendering</span><span class="lc-sub">Hướng đi của mẫu này: một route, vỏ tĩnh, các lỗ động.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#full-route-cache" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Full Route Cache</span><span class="lc-sub">Phần sinh tĩnh thật sự nhớ đệm cái gì, và cái gì vô hiệu hoá nó.</span></span>
</a>


<h3>🔬 Đo thật: dòng nào lật một route (Next.js 16.4.6 · next start · cấu hình mặc định)</h3>
<p>Bảy trang nhỏ dưới <code>/s/*</code>, mỗi trang chạm đúng một thứ; một layout dùng chung đọc cookie (<code>/l/*</code>); và một trang sản phẩm dựng ba cách (<code>/sp/*</code>). Bảng build:</p>
<div class="out">$ npm run build
ƒ /api/cart
ƒ /l/about
ƒ /l/terms
ƒ /s/cookie
○ /s/fetch
ƒ /s/force
ƒ /s/header
ƒ /s/nostore
○ /s/plain
ƒ /s/search
ƒ /sp/dong
○ /sp/tinh
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand</div>
<div style="overflow-x:auto"><table><thead><tr><th>route</th><th>trang…</th><th>build</th></tr></thead><tbody>
<tr><td><code>/s/plain</code></td><td>không đọc gì riêng của request</td><td>○</td></tr><tr><td><code>/s/fetch</code></td><td><code>fetch(url)</code> không tuỳ chọn</td><td>○</td></tr><tr><td><code>/s/cookie</code></td><td><code>cookies()</code></td><td>ƒ</td></tr><tr><td><code>/s/header</code></td><td><code>headers()</code></td><td>ƒ</td></tr><tr><td><code>/s/search</code></td><td><code>searchParams</code></td><td>ƒ</td></tr><tr><td><code>/s/nostore</code></td><td><code>fetch(url, {{ cache: 'no-store' }})</code></td><td>ƒ</td></tr><tr><td><code>/s/force</code></td><td><code>dynamic = 'force-dynamic'</code></td><td>ƒ</td></tr><tr><td><code>/l/about</code></td><td>không gì — nhưng <strong>layout</strong> của nó đọc cookie</td><td>ƒ</td></tr>
</tbody></table></div>
<p><strong>Bẫy 1 — “không cache” không có nghĩa là “tươi”.</strong> Một máy đồng hồ ở :19323; hai request cách nhau 2 giây:</p>
<div class="out">$ curl …/s/fetch   # fetch(url), no options
fetch · 08:07:20
fetch · 08:07:20
$ curl …/s/nostore # fetch(url, { cache: 'no-store' })
no-store · 08:07:27
no-store · 08:07:29</div>
<p>Từ Next.js 15, <code>fetch</code> thường không được cất vào data cache — nhưng route vẫn được dựng sẵn, nên giờ lấy <em>lúc build</em> được phục vụ mãi. Muốn tươi phải nói rõ: <code>no-store</code>, hoặc <code>revalidate</code>.</p>
<p><strong>Bẫy 2 — một cookie trong layout dùng chung:</strong> <code>/l/about</code> và <code>/l/terms</code> giống nhau với mọi người, vậy mà đều là ƒ (hello, An).</p>
<p><strong>Trang sản phẩm, ba hình dạng (Cookie: cart=3):</strong></p>
<div class="out">$ for p in dong tinh; do for i in 1 2 3; do curl … -w "%{time_starttransfer}s"; done; done
dong #1 0.308752s  🛒 3
dong #2 0.305528s  🛒 3
dong #3 0.308709s  🛒 3
tinh #1 0.009732s  🛒 …
tinh #2 0.002277s  🛒 …
tinh #3 0.001575s  🛒 …
$ npm run build   # + /sp/sus: cookies() in a child, inside &lt;Suspense&gt;
ƒ /sp/dong
ƒ /sp/sus
○ /sp/tinh
$ for i in 1 2 3; do curl …/sp/sus …; done
sus #1 0.334953s  🛒 …
sus #2 0.308041s  🛒 …
sus #3 0.308735s  🛒 …
✓ Ready in 105ms
✓ Running next.config.ts took 28ms
[db] query #1 for product (sus) at 08:18:41
[db] query #2 for product (sus) at 08:18:42
[db] query #3 for product (sus) at 08:18:42</div>
<div class="callout warn"><p><code>/sp/dong</code> đọc cookie trên server: ƒ, ~300 ms, truy vấn sản phẩm ở mọi request. <code>/sp/tinh</code> giữ trang tĩnh và để một Client Component fetch <code>/api/cart</code>: ○, vài ms, HTML ghi <code>🛒 …</code> rồi trình duyệt điền số. <code>/sp/sus</code> — lời đọc cookie tách vào Server Component con bọc <code>&lt;Suspense&gt;</code> — <strong>vẫn ƒ và vẫn ~300 ms</strong>: Suspense chỉ stream, không làm phần còn lại tĩnh (việc đó cần <code>cacheComponents</code>).</p></div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -nE "cookies\\(\\)|headers\\(\\)" src/app/layout.tsx | head -3; echo "(root layout: $(grep -cE 'cookies\\(\\)|headers\\(\\)' src/app/layout.tsx) lần cookies()/headers())"
(root layout: 0 lần cookies()/headers())
$ grep -rlE "cookies\\(\\)|headers\\(\\)" src/app --include=layout.tsx | sed 's/^/layout đọc request: /'
$ grep -rlE "^export const dynamic = 'force-dynamic'" src/app | sed 's#src/app/##' | cut -d/ -f1 | sort | uniq -c | sort -rn | head -6
   4 games
   4 courses
   4 api
   3 tech-trends
   3 repos
   3 exam
$ sed -n '30,36p' src/app/sitemap.ts
// Render on-demand at RUNTIME (never build-time prerendered) so the dynamic
// URLs are always fetched against the INTERNAL backend, which is reachable at
// runtime but NOT during &#96;npm run build&#96;. This guarantees the sitemap always
// carries the full URL set (never a static-only subset). The fetches below run
// in parallel with a tight 3s timeout, so the live render stays fast (≤3s
// worst-case) — which is what avoids Google Search Console's fetch timeout.
export const dynamic = 'force-dynamic'</div>Không layout nào của frontend cuongthai.com đọc cookie hay header, nên không một dòng nào lật được cả trang web. <code>sitemap.ts</code> ép động và ghi rõ lý do: lúc <code>npm run build</code> chưa với tới backend.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># mỗi công tắc một trang, rồi đọc bảng</span>
npm run build 2&gt;&amp;1 | grep -E '^. /'
<span class="tok-comment"># đoán ○ hay ƒ TRƯỚC khi build; đoán sai chính là bài học</span>
npm start
curl -s localhost:3000/s/fetch | grep -o 'fetch · [0-9:]*' <span class="tok-comment">  # hai lần: có đóng băng?</span>
curl -s -o /dev/null -w '%{time_starttransfer}\\n' localhost:3000/sp/tinh -H 'Cookie: cart=3'</code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Trang cửa hàng chào bạn bằng tên đọc một cookie — và cả trang dựng lại ở mỗi request; khách nào cũng chờ truy vấn sản phẩm.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Một bạn cùng nhóm thêm <code>cookies()</code> vào layout gốc? Mọi route thành ƒ — không lỗi, không cảnh báo.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Gắn <code>?q=</code> ngẫu nhiên vào trang dùng <code>searchParams</code>: mỗi địa chỉ là một lần dựng mới, né bộ nhớ đệm, dồn tải lên máy chủ.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Đọc bảng build sau mỗi lần sửa layout; đưa phần riêng vào huy hiệu client; cho CI báo đỏ khi route lẽ ra ○ thành ƒ; giới hạn tốc độ trang tìm kiếm.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-2-cache" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.2 — Cache, nói thẳng</span><span class="lc-sub">Vì sao fetch mặc định đổi ở bản 15</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-4-streaming-suspense" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.4 — Streaming và Suspense</span><span class="lc-sub">Suspense làm gì: stream, không phải cache</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-15-4-doc-nguoi-dung" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 15.4 — Đọc người dùng trên server</span><span class="lc-sub">Chỗ đọc cookie là đúng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-1-bon-cach-render" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.1 — Bốn cách một trang được tạo ra</span><span class="lc-sub">Số đo đằng sau ○ và ƒ</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Route tĩnh</span><span class="v">Pre-render lúc build; cùng HTML cho mọi người.</span></div>
  <div class="kv"><span class="k">Route động</span><span class="v">Render mỗi request vì nó đọc dữ liệu của request.</span></div>
  <div class="kv"><span class="k">API động</span><span class="v"><code>cookies()</code>, <code>headers()</code>, <code>searchParams</code> ép render động.</span></div>
  <div class="kv"><span class="k">fetch no-store</span><span class="v">Một fetch không cache đưa route về động.</span></div>
  <div class="kv"><span class="k">Output build</span><span class="v">Build đánh dấu mỗi route là tĩnh hay động.</span></div>
  <div class="kv"><span class="k">Chọn động</span><span class="v"><code>export const dynamic = 'force-dynamic'</code> khi bạn cần.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Trong App Router một route mặc định là tĩnh và thành động khi nó đọc dữ liệu của request.</li><li>Dùng <code>cookies()</code>, <code>headers()</code>, <code>searchParams</code> hoặc một fetch <code>no-store</code> ép render động.</li><li>Output build cho bạn biết mỗi route là cái nào — hãy kiểm, đừng đoán.</li><li>Ép rõ bằng <code>export const dynamic</code> khi bạn cần một hành vi cụ thể.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components#server-rendering-strategies" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Chiến lược render server</span><span class="lc-sub">Tĩnh, động, và streaming — và cái gì kích hoạt mỗi loại.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 17.3 ─────────────────────────── */
    {
      title: '17.3 — SEO: being found by search engines|||17.3 — SEO: được máy tìm kiếm tìm thấy',
      slug: 'nextjs-17-3-seo',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'SEO = tối ưu để Google tìm và xếp hạng trang bạn. Máy tìm kiếm ĐỌC HTML — nên cách render quyết định chúng thấy gì. Kèm metadata (title/description), sitemap và robots, khai báo ngay trong route.',
      content: `
${G17_3}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.3</span>
<h2>What SEO is, and why rendering decides it</h2>
<p class="lead"><strong>SEO</strong> stands for Search Engine Optimization — making your pages easy for search engines like Google to find, understand, and rank. When Google visits your site, a program called a <em>crawler</em> (or "bot") downloads the page's HTML and reads it. So the single most important SEO fact for you is: <strong>the crawler sees the HTML you send</strong>.</p>

<h3>This is where rendering comes back</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SSR / SSG / ISR</span><span class="v">The server sends complete HTML with the real content. The crawler reads a full page — titles, text, links. Good for SEO.</span></div>
  <div class="kv"><span class="k">Pure CSR</span><span class="v">The server sends a near-empty shell; the content only appears after the browser runs JavaScript. A crawler may index an almost blank page. Risky for SEO.</span></div>
</div>
<p>This is a big reason the App Router renders on the server by default: content-focused pages (a blog, a course, a product) get real HTML for crawlers without you doing anything special.</p>

<h3>Metadata: telling search engines about the page</h3>
<p>You met <code>metadata</code> in Chapter 8. For SEO it is essential — the <code>&lt;title&gt;</code> (the blue link in Google results) and the <code>description</code> (the grey text under it):</p>
<pre><code class="language-javascript"><span class="tok-comment">// static — most pages</span>
export const metadata = {
  title: 'Learn Next.js — CuongThai',
  description: 'A beginner-friendly Next.js and React course, zero to production.',
};

<span class="tok-comment">// dynamic — when the title depends on data</span>
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  return { title: &#96;\${course.title} — CuongThai&#96; };
}</code></pre>

<h3>Two special files: sitemap and robots</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">app/sitemap.ts</span><span class="v">A list of your URLs so crawlers can discover every page. Next generates <code>/sitemap.xml</code> from it.</span></div>
  <div class="kv"><span class="k">app/robots.ts</span><span class="v">Rules for crawlers — which paths to crawl or avoid. Next generates <code>/robots.txt</code>.</span></div>
</div>

<div class="callout ok">
<p><strong>Beginner takeaway:</strong> you get most SEO for free by rendering on the server (the default) and setting a good <code>title</code> + <code>description</code> per page. Add a sitemap and robots file, and content pages are discoverable. You do not need SEO tricks — you need real HTML and honest metadata.</p>
</div>

<h3>The SEO basics a framework cannot do for you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>One h1 per page, describing the page</b> — Search engines and screen readers both use the heading outline. A styled div is not a heading.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>A unique title and description per route</b> — &#96;generateMetadata&#96; with the record&#39;s own data. Duplicate titles across a thousand product pages is a ranking problem.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Server-rendered content</b> — A crawler that has to execute JavaScript may index late or not at all. This is what the App Router gives you by default.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>A sitemap and robots file</b> — &#96;app/sitemap.ts&#96; and &#96;app/robots.ts&#96; generate them from your own data, so they cannot drift from the routes that exist.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a staging site indexed by Google, competing with production.</strong> A preview deployment with no &#96;robots&#96; rules gets crawled like any other site, and duplicate content on a &#96;*.vercel.app&#96; domain can outrank the real one — or simply leak an unreleased feature. It is invisible until someone searches for your product and finds the staging copy. Set &#96;noindex&#96; on every non-production environment from an environment variable, not by hand, so a new preview cannot be created without it — and set that variable at <strong>build</strong> time: &#96;app/robots.ts&#96; is prerendered (○), so a variable you only pass to &#96;next start&#96; changes nothing (measured below). And check with &#96;curl -s &lt;url&gt; | grep robots&#96; rather than trusting the config.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/metadata" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Metadata files</span><span class="lc-sub">sitemap.ts, robots.ts and the generated metadata files, with the API for each.</span></span>
</a>
<a class="link-card dl" href="https://developers.google.com/search/docs/crawling-indexing/block-indexing" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">Google — Block indexing</span><span class="lc-sub">The correct way to keep an environment out of the index, and how to verify it.</span></span>
</a>


<h3>🔬 Measured: what Googlebot receives (Next.js 16.4.6 · next start · curl -A Googlebot)</h3>
<div class="out">$ curl -s localhost:3000/seo/ssr -A Googlebot | grep -oE "&lt;title&gt;…|&lt;meta name=description…|&lt;h1&gt;…"
&lt;title&gt;Learn Next.js — CuongThai&lt;/title&gt;
&lt;meta name="description" content="A beginner-friendly Next.js course, zero to production."/&gt;
&lt;h1&gt;Learn Next.js&lt;/h1&gt;
$ curl -s localhost:3000/seo/csr -A Googlebot | grep …   # 'use client' + fetch in useEffect
&lt;title&gt;Create Next App&lt;/title&gt;
&lt;meta name="description" content="Generated by create next app"/&gt;
loading…</div>
<p>The client page gives a crawler no heading, no text and the root layout&#39;s default title — a <code>&#39;use client&#39;</code> file cannot export <code>metadata</code>. Trying it fails the build:</p>
<div class="out">$ npm run build
&gt; Build error occurred
Error: You are attempting to export "metadata" from a component marked with "use client", which is disallowed. "metadata" must be resolved on the server before the page component is rendered.</div>
<p><strong>generateMetadata + the page both call getCourse:</strong></p>
<div class="out">$ curl -s localhost:3000/khoa/nextjs | grep -oE "&lt;title&gt;…|&lt;h1&gt;…"
&lt;title&gt;Next.js from zero — CuongThai&lt;/title&gt;
&lt;h1&gt;Next.js from zero&lt;/h1&gt;
$ curl … /khoa/khong-co   ⇒ 404
# server log (2 requests)
[db] getCourse(nextjs) #1
[db] getCourse(nextjs) #2
[db] getCourse(khong-co) #3
[db] getCourse(khong-co) #4
# after getCourse = cache(load)  (1 request)
[db] getCourse(react) #1</div>
<p><strong>robots.ts is decided at build:</strong></p>
<div class="out">$ npm run build                     # no APP_ENV — a staging build
○ /robots.txt
○ /sitemap.xml
$ APP_ENV=production next start &amp;&amp; curl -s localhost:3000/robots.txt
User-Agent: *
Disallow: /
$ APP_ENV=production npm run build &amp;&amp; next start &amp;&amp; curl …/robots.txt
○ /robots.txt
User-Agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml</div>
<div class="callout warn"><p>Starting the server with the variable changed nothing — the file was generated during the build. The dangerous direction is the reverse: a staging build made with the production variable invites Google in. Check the real file with <code>curl</code>, never by reading the code.</p></div>
<div class="note-ct"><strong>In this course&#39;s repository — cuongthai.com as Googlebot sees it</strong><div class="out">$ sed -n '1,40p' src/app/robots.ts | grep -nE "disallow|allow|sitemap|NODE_ENV|APP_ENV|noindex" | head -8
5: * robots.txt — tells crawlers what to index and where the sitemap is.
7: * Disallow /admin/* and /api/* by default. We let crawlers in on
28:        allow: '/',
29:        disallow: [
$ curl -s https://cuongthai.com/robots.txt | head -12
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard
Disallow: /profile
Disallow: /my-courses
Disallow: /my-orders
Disallow: /wallet
Disallow: /llm-key
Disallow: /messages
Disallow: /cart
$ curl -s https://cuongthai.com/sitemap.xml | grep -c '&lt;loc&gt;' | sed 's/^/sitemap.xml: /; s/$/ URL/'
sitemap.xml: 203 URL
$ curl -s https://cuongthai.com/courses/nextjs -A Googlebot | grep -oE '&lt;title&gt;[^&lt;]*&lt;/title&gt;|&lt;meta name="description" content="[^"]{0,90}|&lt;h1[^&gt;]*&gt;' | head -4
&lt;title&gt;Next.js: The React Framework | Khoá học | CuongThai&lt;/title&gt;
&lt;meta name="description" content="Next.js is a framework built on React: take the React course first. Covers what Next.js ad
$ curl -s https://cuongthai.com/courses/nextjs -A Googlebot | grep -oE '&lt;h1' | wc -l | sed 's/^ */thẻ h1 trong HTML: /'
thẻ h1 trong HTML: 0
$ grep -n "&lt;CoursePageClient /&gt;" 'src/app/courses/[slug]/page.tsx'
107:      &lt;CoursePageClient /&gt;
$ grep -nE "const \\[loading, setLoading\\] = useState\\(true\\)|^  if \\(loading\\) \\{|&lt;h1 " 'src/app/courses/[slug]/CoursePageClient.tsx' | cut -c1-90
341:  const [loading, setLoading] = useState(true);
521:  if (loading) {
695:              &lt;h1 className={&#96;\${s.tieuDe} font-heading text-[1.9rem] font-bold leading</div>robots.txt, a sitemap of a few hundred URLs, a real title and description (plus JSON-LD) — but <strong>no &lt;h1&gt; in the HTML</strong> of the course page: <code>page.tsx</code> fetches the course only for metadata, then renders <code>&lt;CoursePageClient /&gt;</code>, which starts with <code>loading = true</code> and a spinner. The heading and the text arrive after JavaScript.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">curl -s localhost:3000/&lt;page&gt; -A Googlebot | grep -oE '&lt;title&gt;[^&lt;]*|&lt;h1|name="description"'
curl -s localhost:3000/robots.txt; curl -s localhost:3000/sitemap.xml
<span class="tok-comment"># build WITHOUT the variable, start WITH it, read robots.txt again</span>
curl -s https://&lt;your-site&gt;/ -A Googlebot | grep -c '&lt;h1' <span class="tok-comment">  # should be 1</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">Googling your school club&#39;s page: the blue line and the grey text are the title and description someone set. No description, and Google cuts some random text.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">A staging build gets indexed? Duplicate content competes with production, and unreleased features show up in search.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">A hacked site serves spam only to Googlebot (cloaking): visitors see a normal page while Google indexes casino or loan links on your domain.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Diff <code>curl -A Googlebot</code> against a normal browser; noindex for staging set at build; watch Search Console.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-8-5-route-group-metadata" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 8.5 — Route groups, dynamic segments, metadata</span><span class="lc-sub">Where metadata first appears</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-1-bon-cach-render" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.1 — Four ways a page gets made</span><span class="lc-sub">Why a client page ships “loading…”</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-2-3-semantic-html" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 2.3 — Semantic HTML</span><span class="lc-sub">One h1 and a real heading outline</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-15-4-doc-nguoi-dung" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 15.4 — cache() once per request</span><span class="lc-sub">The same fix for metadata + page</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add per-page metadata (title, description) with the <code>metadata</code> export or <code>generateMetadata</code>, and verify it in the page source.</li>
<li>Add a <code>sitemap.ts</code> and a <code>robots.ts</code> and confirm they serve at <code>/sitemap.xml</code> and <code>/robots.txt</code>.</li>
<li>View source on an SSR page and confirm the content is in the HTML (not injected only by JS).</li>
</ol>
<p><strong>Done when:</strong> you can set per-page metadata and generate a sitemap and robots file.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SEO</span><span class="v">Making pages discoverable and understandable to search engines.</span></div>
  <div class="kv"><span class="k">metadata</span><span class="v">Per-page title/description/tags for the head.</span></div>
  <div class="kv"><span class="k">generateMetadata</span><span class="v">Async metadata that depends on data.</span></div>
  <div class="kv"><span class="k">sitemap.ts</span><span class="v">A file that generates <code>/sitemap.xml</code>.</span></div>
  <div class="kv"><span class="k">robots.ts</span><span class="v">A file that generates <code>/robots.txt</code>.</span></div>
  <div class="kv"><span class="k">SSR content</span><span class="v">Server-rendered HTML lets crawlers read content without running JS.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>SEO starts with per-page metadata: set <code>title</code>/<code>description</code> via <code>metadata</code> or <code>generateMetadata</code>.</li><li>Generate <code>/sitemap.xml</code> and <code>/robots.txt</code> with <code>sitemap.ts</code> and <code>robots.ts</code>.</li><li>Server rendering puts real content in the HTML so crawlers see it without running JS.</li><li>This is a major reason Next.js beats a plain client-only React app for SEO.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/metadata" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Metadata &amp; SEO</span><span class="lc-sub">Static and dynamic metadata, sitemap.ts, and robots.ts.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.3</span>
<h2>SEO là gì, và vì sao render quyết định nó</h2>
<p class="lead"><strong>SEO</strong> viết tắt của Search Engine Optimization — làm cho trang của bạn dễ để máy tìm kiếm như Google tìm, hiểu, và xếp hạng. Khi Google ghé site bạn, một chương trình gọi là <em>crawler</em> (hay "bot") tải HTML của trang và đọc nó. Nên sự thật SEO quan trọng nhất với bạn là: <strong>crawler thấy HTML mà bạn gửi</strong>.</p>

<h3>Đây là chỗ render quay lại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SSR / SSG / ISR</span><span class="v">Server gửi HTML hoàn chỉnh với nội dung thật. Crawler đọc một trang đầy đủ — tiêu đề, chữ, link. Tốt cho SEO.</span></div>
  <div class="kv"><span class="k">CSR thuần</span><span class="v">Server gửi một vỏ gần trống; nội dung chỉ hiện sau khi trình duyệt chạy JavaScript. Crawler có thể lập chỉ mục một trang gần như trắng. Rủi ro cho SEO.</span></div>
</div>
<p>Đây là một lý do lớn khiến App Router render trên server theo mặc định: các trang thiên về nội dung (blog, khoá học, sản phẩm) có HTML thật cho crawler mà bạn không phải làm gì đặc biệt.</p>

<h3>Metadata: nói cho máy tìm kiếm biết về trang</h3>
<p>Bạn đã gặp <code>metadata</code> ở Chương 8. Với SEO nó thiết yếu — <code>&lt;title&gt;</code> (link xanh trong kết quả Google) và <code>description</code> (chữ xám dưới nó):</p>
<pre><code class="language-javascript"><span class="tok-comment">// tĩnh — đa số trang</span>
export const metadata = {
  title: 'Học Next.js — CuongThai',
  description: 'Khoá Next.js và React thân thiện người mới, số 0 tới production.',
};

<span class="tok-comment">// động — khi title phụ thuộc dữ liệu</span>
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  return { title: &#96;\${course.title} — CuongThai&#96; };
}</code></pre>

<h3>Hai file đặc biệt: sitemap và robots</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">app/sitemap.ts</span><span class="v">Một danh sách URL của bạn để crawler khám phá mọi trang. Next sinh <code>/sitemap.xml</code> từ nó.</span></div>
  <div class="kv"><span class="k">app/robots.ts</span><span class="v">Luật cho crawler — đường nào được crawl hay tránh. Next sinh <code>/robots.txt</code>.</span></div>
</div>

<div class="callout ok">
<p><strong>Điều người mới cần nhớ:</strong> bạn có phần lớn SEO miễn phí nhờ render trên server (mặc định) và đặt một <code>title</code> + <code>description</code> tốt cho mỗi trang. Thêm một sitemap và file robots, và các trang nội dung sẽ được tìm thấy. Bạn không cần mẹo SEO — bạn cần HTML thật và metadata trung thực.</p>
</div>

<h3>Những điều cơ bản về SEO mà framework không làm giùm bạn</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Một h1 mỗi trang, mô tả đúng trang đó</b> — Máy tìm kiếm và trình đọc màn hình đều dùng dàn ý tiêu đề. Một cái div được tô đẹp không phải một tiêu đề.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Tiêu đề và mô tả riêng cho từng route</b> — &#96;generateMetadata&#96; với dữ liệu của chính bản ghi. Tiêu đề trùng nhau trên một nghìn trang sản phẩm là một vấn đề về thứ hạng.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nội dung render ở máy chủ</b> — Một con bot phải chạy JavaScript có thể lập chỉ mục muộn hoặc không lập luôn. Đây là thứ App Router cho bạn theo mặc định.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Một sitemap và một file robots</b> — &#96;app/sitemap.ts&#96; và &#96;app/robots.ts&#96; sinh chúng ra từ chính dữ liệu của bạn, nên chúng không thể trôi dạt khỏi những route thật sự tồn tại.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một trang thử nghiệm bị Google lập chỉ mục, cạnh tranh với bản production.</strong> Một bản triển khai xem trước không có luật &#96;robots&#96; sẽ bị quét như mọi trang khác, và nội dung trùng lặp trên một tên miền &#96;*.vercel.app&#96; có thể xếp hạng cao hơn bản thật — hoặc đơn giản là làm lộ một tính năng chưa phát hành. Nó vô hình cho tới khi có người tìm sản phẩm của bạn rồi thấy bản thử nghiệm. Hãy đặt &#96;noindex&#96; cho mọi môi trường không phải production bằng một biến môi trường, đừng đặt tay, để một bản xem trước mới không thể được tạo ra mà thiếu nó — và đặt biến đó lúc <strong>build</strong>: &#96;app/robots.ts&#96; được dựng sẵn (○), nên biến chỉ truyền cho &#96;next start&#96; không đổi được gì (đo bên dưới). Và hãy kiểm bằng &#96;curl -s &lt;url&gt; | grep robots&#96; chứ đừng tin vào cấu hình.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/metadata" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Các file metadata</span><span class="lc-sub">sitemap.ts, robots.ts và các file metadata sinh tự động, kèm API của từng cái.</span></span>
</a>
<a class="link-card dl" href="https://developers.google.com/search/docs/crawling-indexing/block-indexing" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">Google — Chặn lập chỉ mục</span><span class="lc-sub">Cách đúng để giữ một môi trường ngoài chỉ mục, và cách xác minh nó.</span></span>
</a>


<h3>🔬 Đo thật: Googlebot nhận được gì (Next.js 16.4.6 · next start · curl -A Googlebot)</h3>
<div class="out">$ curl -s localhost:3000/seo/ssr -A Googlebot | grep -oE "&lt;title&gt;…|&lt;meta name=description…|&lt;h1&gt;…"
&lt;title&gt;Learn Next.js — CuongThai&lt;/title&gt;
&lt;meta name="description" content="A beginner-friendly Next.js course, zero to production."/&gt;
&lt;h1&gt;Learn Next.js&lt;/h1&gt;
$ curl -s localhost:3000/seo/csr -A Googlebot | grep …   # 'use client' + fetch in useEffect
&lt;title&gt;Create Next App&lt;/title&gt;
&lt;meta name="description" content="Generated by create next app"/&gt;
loading…</div>
<p>Trang client cho rô-bốt không heading, không chữ, và tiêu đề mặc định của layout gốc — tệp <code>&#39;use client&#39;</code> không xuất được <code>metadata</code>. Thử thì build hỏng:</p>
<div class="out">$ npm run build
&gt; Build error occurred
Error: You are attempting to export "metadata" from a component marked with "use client", which is disallowed. "metadata" must be resolved on the server before the page component is rendered.</div>
<p><strong>generateMetadata và trang cùng gọi getCourse:</strong></p>
<div class="out">$ curl -s localhost:3000/khoa/nextjs | grep -oE "&lt;title&gt;…|&lt;h1&gt;…"
&lt;title&gt;Next.js from zero — CuongThai&lt;/title&gt;
&lt;h1&gt;Next.js from zero&lt;/h1&gt;
$ curl … /khoa/khong-co   ⇒ 404
# server log (2 requests)
[db] getCourse(nextjs) #1
[db] getCourse(nextjs) #2
[db] getCourse(khong-co) #3
[db] getCourse(khong-co) #4
# after getCourse = cache(load)  (1 request)
[db] getCourse(react) #1</div>
<p><strong>robots.ts được quyết lúc build:</strong></p>
<div class="out">$ npm run build                     # no APP_ENV — a staging build
○ /robots.txt
○ /sitemap.xml
$ APP_ENV=production next start &amp;&amp; curl -s localhost:3000/robots.txt
User-Agent: *
Disallow: /
$ APP_ENV=production npm run build &amp;&amp; next start &amp;&amp; curl …/robots.txt
○ /robots.txt
User-Agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml</div>
<div class="callout warn"><p>Khởi động máy chủ kèm biến không đổi được gì — tệp đã sinh trong lúc build. Chiều nguy hiểm là chiều ngược lại: bản staging build nhầm biến production sẽ mời Google vào. Kiểm tệp thật bằng <code>curl</code>, đừng đọc mã rồi tin.</p></div>
<div class="note-ct"><strong>Trong kho của chính khoá này — cuongthai.com dưới mắt Googlebot</strong><div class="out">$ sed -n '1,40p' src/app/robots.ts | grep -nE "disallow|allow|sitemap|NODE_ENV|APP_ENV|noindex" | head -8
5: * robots.txt — tells crawlers what to index and where the sitemap is.
7: * Disallow /admin/* and /api/* by default. We let crawlers in on
28:        allow: '/',
29:        disallow: [
$ curl -s https://cuongthai.com/robots.txt | head -12
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard
Disallow: /profile
Disallow: /my-courses
Disallow: /my-orders
Disallow: /wallet
Disallow: /llm-key
Disallow: /messages
Disallow: /cart
$ curl -s https://cuongthai.com/sitemap.xml | grep -c '&lt;loc&gt;' | sed 's/^/sitemap.xml: /; s/$/ URL/'
sitemap.xml: 203 URL
$ curl -s https://cuongthai.com/courses/nextjs -A Googlebot | grep -oE '&lt;title&gt;[^&lt;]*&lt;/title&gt;|&lt;meta name="description" content="[^"]{0,90}|&lt;h1[^&gt;]*&gt;' | head -4
&lt;title&gt;Next.js: The React Framework | Khoá học | CuongThai&lt;/title&gt;
&lt;meta name="description" content="Next.js is a framework built on React: take the React course first. Covers what Next.js ad
$ curl -s https://cuongthai.com/courses/nextjs -A Googlebot | grep -oE '&lt;h1' | wc -l | sed 's/^ */thẻ h1 trong HTML: /'
thẻ h1 trong HTML: 0
$ grep -n "&lt;CoursePageClient /&gt;" 'src/app/courses/[slug]/page.tsx'
107:      &lt;CoursePageClient /&gt;
$ grep -nE "const \\[loading, setLoading\\] = useState\\(true\\)|^  if \\(loading\\) \\{|&lt;h1 " 'src/app/courses/[slug]/CoursePageClient.tsx' | cut -c1-90
341:  const [loading, setLoading] = useState(true);
521:  if (loading) {
695:              &lt;h1 className={&#96;\${s.tieuDe} font-heading text-[1.9rem] font-bold leading</div>robots.txt, một sitemap vài trăm địa chỉ, title và description thật (kèm JSON-LD) — nhưng <strong>không có &lt;h1&gt; nào trong HTML</strong> của trang khoá học: <code>page.tsx</code> lấy khoá học chỉ để làm metadata, rồi render <code>&lt;CoursePageClient /&gt;</code>, thứ bắt đầu bằng <code>loading = true</code> và một vòng quay. Tiêu đề và nội dung tới sau JavaScript.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">curl -s localhost:3000/&lt;page&gt; -A Googlebot | grep -oE '&lt;title&gt;[^&lt;]*|&lt;h1|name="description"'
curl -s localhost:3000/robots.txt; curl -s localhost:3000/sitemap.xml
<span class="tok-comment"># build KHÔNG biến, start CÓ biến, đọc lại robots.txt</span>
curl -s https://&lt;your-site&gt;/ -A Googlebot | grep -c '&lt;h1' <span class="tok-comment">  # nên là 1</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Tìm trang câu lạc bộ của trường trên Google: dòng xanh và dòng xám là title và description ai đó đã đặt. Không có mô tả thì Google tự cắt một đoạn bất kỳ.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Bản staging bị lập chỉ mục? Nội dung trùng tranh chỗ với bản thật, tính năng chưa ra mắt hiện lên kết quả tìm kiếm.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Trang bị chiếm chỉ trả nội dung rác cho Googlebot (cloaking): người thường thấy trang bình thường, còn Google lập chỉ mục link cờ bạc, vay tiền trên tên miền của bạn.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">So <code>curl -A Googlebot</code> với trình duyệt thường; noindex cho staging đặt lúc build; theo dõi Search Console.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-8-5-route-group-metadata" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 8.5 — Route group, segment động và metadata</span><span class="lc-sub">Nơi metadata xuất hiện lần đầu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-1-bon-cach-render" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.1 — Bốn cách một trang được tạo ra</span><span class="lc-sub">Vì sao trang client gửi “loading…”</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-2-3-semantic-html" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 2.3 — HTML ngữ nghĩa</span><span class="lc-sub">Một h1 và dàn heading thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-15-4-doc-nguoi-dung" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 15.4 — cache() một lần mỗi request</span><span class="lc-sub">Cùng cách sửa cho metadata + trang</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm metadata theo trang (title, description) bằng export <code>metadata</code> hoặc <code>generateMetadata</code>, và kiểm nó trong source trang.</li>
<li>Thêm một <code>sitemap.ts</code> và một <code>robots.ts</code> và xác nhận chúng phục vụ ở <code>/sitemap.xml</code> và <code>/robots.txt</code>.</li>
<li>Xem source một trang SSR và xác nhận nội dung nằm trong HTML (không phải chỉ do JS chèn).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đặt được metadata theo trang và tạo sitemap cùng file robots.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SEO</span><span class="v">Làm trang dễ được tìm thấy và hiểu bởi công cụ tìm kiếm.</span></div>
  <div class="kv"><span class="k">metadata</span><span class="v">Title/description/tag theo trang cho phần head.</span></div>
  <div class="kv"><span class="k">generateMetadata</span><span class="v">Metadata async phụ thuộc dữ liệu.</span></div>
  <div class="kv"><span class="k">sitemap.ts</span><span class="v">Một file tạo ra <code>/sitemap.xml</code>.</span></div>
  <div class="kv"><span class="k">robots.ts</span><span class="v">Một file tạo ra <code>/robots.txt</code>.</span></div>
  <div class="kv"><span class="k">Nội dung SSR</span><span class="v">HTML render trên server cho crawler đọc nội dung mà không chạy JS.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>SEO bắt đầu từ metadata theo trang: đặt <code>title</code>/<code>description</code> qua <code>metadata</code> hoặc <code>generateMetadata</code>.</li><li>Tạo <code>/sitemap.xml</code> và <code>/robots.txt</code> bằng <code>sitemap.ts</code> và <code>robots.ts</code>.</li><li>Render trên server đặt nội dung thật vào HTML để crawler thấy mà không chạy JS.</li><li>Đây là lý do lớn Next.js thắng một app React chỉ-client về SEO.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/metadata" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Metadata &amp; SEO</span><span class="lc-sub">Metadata tĩnh và động, sitemap.ts, và robots.ts.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 17.4 ─────────────────────────── */
    {
      title: '17.4 — Open Graph: how a shared link looks|||17.4 — Open Graph: link chia sẻ trông thế nào',
      slug: 'nextjs-17-4-open-graph',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Khi bạn dán một link vào Facebook/Zalo/Messenger, nó hiện một thẻ có ảnh + tiêu đề + mô tả. Đó là Open Graph — vài thẻ meta. Cách khai báo trong metadata, và sự cố thật cuongthai làm link Messenger về "/".',
      content: `
${G17_4}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.4</span>
<h2>Why a pasted link turns into a pretty card</h2>
<p class="lead">Paste a link into Messenger, Facebook, Zalo, X, or Slack and it expands into a card: an image, a title, a short description. That card is not magic — the platform read a few special <code>&lt;meta&gt;</code> tags in your page's HTML, defined by a standard called <strong>Open Graph (OG)</strong>. If those tags are missing or wrong, the card looks broken — or links to the wrong place.</p>

<h3>Setting Open Graph in metadata</h3>
<p>It is part of the same <code>metadata</code> you already use — just an <code>openGraph</code> section:</p>
<pre><code class="language-javascript">export const metadata = {
  title: 'Learn Next.js — CuongThai',
  description: 'Zero to production, in Vietnamese and English.',
  openGraph: {
    title: 'Learn Next.js — CuongThai',
    description: 'Zero to production, in Vietnamese and English.',
    url: 'https://cuongthai.com/courses/nextjs',   <span class="tok-comment">// the canonical page URL</span>
    images: ['https://cuongthai.com/og/nextjs.png'], <span class="tok-comment">// the card image</span>
  },
};</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">og:title / og:description</span><span class="v">The headline and subtext on the card. Often the same as your page title/description.</span></div>
  <div class="kv"><span class="k">og:image</span><span class="v">The picture — the most eye-catching part. Recommended around 1200×630 pixels.</span></div>
  <div class="kv"><span class="k">og:url</span><span class="v">The canonical link the card should point to. Get this wrong and the shared card sends people to the wrong page.</span></div>
</div>

<div class="note-ct">
<p><strong>A real cuongthai.com bug lived exactly here.</strong> A shared Messenger link once resolved back to the homepage <code>"/"</code> instead of the actual conversation, because the Open Graph URL in the metadata was wrong. Remember: platforms and search engines read <em>these exact tags</em> — they do not guess. When a shared link shows the wrong title, a missing image, or lands on the wrong page, the <code>openGraph</code> block of that route is the first place to look. OG tags are not decoration; they are the public face of every link you share.</p>
</div>

<div class="callout ok">
<p><strong>Bonus:</strong> Next can generate the OG image dynamically per page (a file like <code>opengraph-image.tsx</code> that renders an image with the post's title on it). Great for blogs where every article deserves its own card — but a single static image is a perfectly good start.</p>
</div>

<h3>Making a shared link look right</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Four tags do most of the work</b> — &#96;og:title&#96;, &#96;og:description&#96;, &#96;og:image&#96;, &#96;og:url&#96;. Twitter reads its own &#96;twitter:card&#96; on top of them.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The image needs absolute URLs</b> — In Next.js a relative path is resolved against <code>metadataBase</code>; without it the build only prints a warning and the image becomes <code>http://localhost:3000/…</code> (measured below). Set <code>metadataBase</code> in the root layout, or write absolute URLs.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>1200×630 is the safe size</b> — Smaller images get cropped unpredictably or fall back to a small card.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Generate them per record</b> — &#96;opengraph-image.tsx&#96; renders an image from your data at request time, so every article gets its own.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a preview that never updates because the platform cached it.</strong> Facebook, Slack, LinkedIn and X all cache the metadata for a URL the first time anyone shares it, often for days. So the first share — usually while the page is still half-built — becomes the preview everyone sees, and fixing the tags changes nothing. There is no error to notice; the link simply keeps looking wrong. Each platform has a debugger that re-scrapes on demand (Facebook&#39;s Sharing Debugger, X&#39;s Card Validator), and the reliable habit is to check the tags before sharing a URL anywhere, not after.</p></div>
<a class="link-card dl" href="https://ogp.me/" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">The Open Graph protocol</span><span class="lc-sub">The spec itself: every tag, with the required and optional ones marked.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — opengraph-image</span><span class="lc-sub">Generating a per-record social image from JSX, with the size and caching rules.</span></span>
</a>


<h3>🔬 Measured: what the scraper reads (Next.js 16.4.6 · curl -A facebookexternalhit/1.1)</h3>
<p>A section layout sets “site-wide” Open Graph with <code>url: &#39;https://example.com&#39;</code> and a relative image; a deep page sets only its own <code>title</code>. No <code>metadataBase</code> yet:</p>
<div class="out">$ npm run build
⚠ metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000".
$ curl -s localhost:3000/og/bai -A facebookexternalhit/1.1 | grep -oE "&lt;title&gt;…|og:…"
&lt;title&gt;Lesson 17.4 — Open Graph&lt;/title&gt;
&lt;meta property="og:title" content="CT Lab"
&lt;meta property="og:description" content="The lab site"
&lt;meta property="og:url" content="https://example.com"
&lt;meta property="og:image" content="http://localhost:3000/og-site.png"
$ curl -s localhost:3000/og/dung …   # its own openGraph, url: '/og/dung'
&lt;title&gt;Lesson 17.4 — Open Graph&lt;/title&gt;
&lt;meta property="og:title" content="Lesson 17.4 — Open Graph"
&lt;meta property="og:description" content="Why a pasted link becomes a card"
&lt;meta property="og:url" content="/og/dung"</div>
<div class="callout warn"><p>Three bugs and no error: <strong>og:url</strong> is the site root (Messenger opens <em>that</em>), <strong>og:title</strong> is the layout&#39;s — a page&#39;s <code>title</code> does not flow into a parent&#39;s <code>openGraph</code> — and <strong>og:image</strong> is on localhost. A relative <code>og:url</code> is not resolved at all.</p></div>
<p><strong>A card per article — <code>opengraph-image.tsx</code>:</strong></p>
<div class="out">$ curl -s localhost:3000/og/the/hello | grep og:image
&lt;meta property="og:image" content="http://localhost:19322/og/the/hello/opengraph-image?dbbc30bb4b8536aa"
&lt;meta property="og:image:type" content="image/png"
&lt;meta property="og:image:width" content="1200"
&lt;meta property="og:image:height" content="630"
$ curl -s &lt;og:image&gt; -o card.png; file card.png
200 image/png 24053 byte
card.png: PNG image data, 1200 x 630, 8-bit/color RGBA, non-interlaced</div>
<p><strong>After the fix — <code>metadataBase</code> in the root layout, no <code>url</code> in the shared openGraph:</strong></p>
<div class="out">$ curl -s localhost:3000/og/bai -A facebookexternalhit/1.1 | grep og:
&lt;meta property="og:title" content="CT Lab"
&lt;meta property="og:image" content="https://example.com/og-site.png"
$ curl -s localhost:3000/og/the/hello | grep og:image
&lt;meta property="og:image" content="https://example.com/og/the/hello/opengraph-image?dbbc30bb4b8536aa"</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -n "metadataBase" frontend/src/app/layout.tsx
150:  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://cuongthai.com'),
$ git show 07aa3f99e --format='%h %ad %s' --date=short -s
07aa3f99e 2026-07-23 fix(seo): drop hardcoded homepage og:url + canonical from root layout
$ git show 07aa3f99e --format= -- frontend/src/app/layout.tsx | grep -E "^-.*url: 'https://cuongthai.com'|^-.*canonical"
-    url: 'https://cuongthai.com',
-    canonical: 'https://cuongthai.com',
$ find frontend/src/app -name 'opengraph-image.tsx' | wc -l | sed 's/^ */opengraph-image.tsx: /'
opengraph-image.tsx: 15
$ curl -s https://cuongthai.com/courses/nextjs -A facebookexternalhit/1.1 | grep -oE '&lt;meta property="og:(url|title|image)" content="[^"]{0,80}' | head -4
&lt;meta property="og:title" content="Next.js: The React Framework
&lt;meta property="og:url" content="https://cuongthai.com/courses/nextjs
&lt;meta property="og:image" content="https://media.cuongthai.com/images/course-covers/nextjs.png?v=4</div>Commit <code>07aa3f99e</code> (23/07/2026) removed a hardcoded <code>openGraph.url</code> and canonical of <code>https://cuongthai.com</code> from the <em>root</em> layout: every page inherited them, so every deep link shared in Messenger opened the homepage, and every page told Google it was a duplicate of <code>/</code>.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">curl -s localhost:3000/&lt;page&gt; -A facebookexternalhit/1.1 | grep -oE '&lt;meta property="og:[a-z:]+" content="[^"]*"'
npm run build 2&gt;&amp;1 | grep -i metadataBase    <span class="tok-comment">  # the only warning you get</span>
curl -s "$(curl -s localhost:3000/&lt;page&gt; | grep -oE 'og:image" content="[^"]*' | cut -d'"' -f3)" -o card.png; file card.png</code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">You paste a link into Zalo or Messenger: the card is only that page&#39;s og:title and og:image; a wrong og:url makes a tap open the homepage.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">og:image points to localhost? The build warned, nobody read it — every share shows a broken picture.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">A phishing page copies a bank&#39;s og tags: the same logo and title appear in the chat. The card proves nothing about the domain.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Read the address, not the card, before typing a password. For your own site: curl as the scraper before the first share.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-3-seo" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.3 — SEO</span><span class="lc-sub">The other bot: Googlebot</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-8-5-route-group-metadata" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 8.5 — Route groups, dynamic segments, metadata</span><span class="lc-sub">How metadata merges down the tree</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-2-1-html-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 2.1 — What HTML is</span><span class="lc-sub">meta tags in the head</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add Open Graph tags (<code>openGraph</code> in metadata) with a title, description and image, and test the link in a card validator.</li>
<li>Generate a dynamic OG image with <code>opengraph-image.tsx</code> (ImageResponse) for a content page.</li>
<li>Paste the URL into a chat app and confirm the preview card renders.</li>
</ol>
<p><strong>Done when:</strong> you can control how a shared link previews, including a generated OG image.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Open Graph</span><span class="v">Metadata that controls how a link previews when shared.</span></div>
  <div class="kv"><span class="k">og:title / og:image</span><span class="v">The card's title and image.</span></div>
  <div class="kv"><span class="k">openGraph metadata</span><span class="v">Next's way to set OG tags per page.</span></div>
  <div class="kv"><span class="k">opengraph-image</span><span class="v">A file that generates a dynamic OG image.</span></div>
  <div class="kv"><span class="k">ImageResponse</span><span class="v">Renders JSX to an image for OG/Twitter cards.</span></div>
  <div class="kv"><span class="k">Card validator</span><span class="v">A tool to preview how a link will look when shared.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Open Graph tags control how a link previews when shared (title, description, image).</li><li>Set them with the <code>openGraph</code> metadata per page.</li><li>Generate a dynamic preview image with <code>opengraph-image.tsx</code> and <code>ImageResponse</code>.</li><li>Test with a card validator before relying on it.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#opengraph" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Open Graph metadata</span><span class="lc-sub">openGraph fields, and generating OG images per route.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.4</span>
<h2>Vì sao một link dán vào lại thành một thẻ đẹp</h2>
<p class="lead">Dán một link vào Messenger, Facebook, Zalo, X, hay Slack và nó nở thành một thẻ: một ảnh, một tiêu đề, một mô tả ngắn. Thẻ đó không phải phép màu — nền tảng đã đọc vài thẻ <code>&lt;meta&gt;</code> đặc biệt trong HTML của trang bạn, định bởi một chuẩn tên <strong>Open Graph (OG)</strong>. Nếu các thẻ đó thiếu hoặc sai, thẻ trông hỏng — hoặc dẫn tới sai chỗ.</p>

<h3>Đặt Open Graph trong metadata</h3>
<p>Nó là một phần của cùng <code>metadata</code> bạn đã dùng — chỉ thêm một mục <code>openGraph</code>:</p>
<pre><code class="language-javascript">export const metadata = {
  title: 'Học Next.js — CuongThai',
  description: 'Số 0 tới production, tiếng Việt và tiếng Anh.',
  openGraph: {
    title: 'Học Next.js — CuongThai',
    description: 'Số 0 tới production, tiếng Việt và tiếng Anh.',
    url: 'https://cuongthai.com/courses/nextjs',   <span class="tok-comment">// URL chuẩn của trang</span>
    images: ['https://cuongthai.com/og/nextjs.png'], <span class="tok-comment">// ảnh của thẻ</span>
  },
};</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">og:title / og:description</span><span class="v">Tiêu đề và phụ đề trên thẻ. Thường giống title/description của trang.</span></div>
  <div class="kv"><span class="k">og:image</span><span class="v">Bức ảnh — phần bắt mắt nhất. Khuyến nghị khoảng 1200×630 pixel.</span></div>
  <div class="kv"><span class="k">og:url</span><span class="v">Link chuẩn mà thẻ nên trỏ tới. Sai cái này là thẻ chia sẻ đưa người ta tới sai trang.</span></div>
</div>

<div class="note-ct">
<p><strong>Một bug thật của cuongthai.com trú đúng ở đây.</strong> Một link Messenger được chia sẻ từng trỏ về trang chủ <code>"/"</code> thay vì cuộc trò chuyện thật, vì URL Open Graph trong metadata bị sai. Nhớ: nền tảng và máy tìm kiếm đọc <em>đúng những thẻ này</em> — chúng không đoán. Khi một link chia sẻ hiện sai tiêu đề, thiếu ảnh, hay rơi vào sai trang, khối <code>openGraph</code> của route đó là chỗ nhìn đầu tiên. Thẻ OG không phải trang trí; chúng là bộ mặt công khai của mọi link bạn chia sẻ.</p>
</div>

<div class="callout ok">
<p><strong>Điểm cộng:</strong> Next có thể sinh ảnh OG động theo từng trang (một file như <code>opengraph-image.tsx</code> render một ảnh có tiêu đề bài trên đó). Tuyệt cho blog nơi mỗi bài xứng đáng một thẻ riêng — nhưng một ảnh tĩnh duy nhất là một khởi đầu hoàn toàn tốt.</p>
</div>

<h3>Làm cho một liên kết được chia sẻ trông đúng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Bốn thẻ lo phần lớn công việc</b> — &#96;og:title&#96;, &#96;og:description&#96;, &#96;og:image&#96;, &#96;og:url&#96;. Twitter đọc thêm &#96;twitter:card&#96; của riêng nó ở trên đó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Ảnh cần URL tuyệt đối</b> — Trong Next.js, đường dẫn tương đối được giải theo <code>metadataBase</code>; thiếu nó, bản build chỉ in một dòng cảnh báo và ảnh thành <code>http://localhost:3000/…</code> (đo bên dưới). Hãy đặt <code>metadataBase</code> ở layout gốc, hoặc viết địa chỉ đầy đủ.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>1200×630 là kích thước an toàn</b> — Ảnh nhỏ hơn bị cắt xén khó lường hoặc rơi về một thẻ nhỏ.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Sinh chúng theo từng bản ghi</b> — &#96;opengraph-image.tsx&#96; vẽ một tấm ảnh từ dữ liệu của bạn lúc có request, nên mỗi bài viết có ảnh riêng.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một bản xem trước chẳng bao giờ cập nhật vì nền tảng đã nhớ đệm nó.</strong> Facebook, Slack, LinkedIn và X đều nhớ đệm metadata của một URL ngay lần đầu có người chia sẻ nó, thường là vài ngày. Nên lần chia sẻ đầu tiên — thường là lúc trang còn dựng dở — trở thành cái bản xem trước mà tất cả mọi người nhìn thấy, và sửa các thẻ đi chẳng thay đổi được gì. Không có lỗi nào để nhận ra; cái liên kết chỉ đơn giản là cứ trông sai. Mỗi nền tảng đều có một trình gỡ lỗi quét lại theo yêu cầu (Sharing Debugger của Facebook, Card Validator của X), và thói quen đáng tin là kiểm các thẻ TRƯỚC khi chia sẻ một URL đi đâu đó, chứ không phải sau.</p></div>
<a class="link-card dl" href="https://ogp.me/" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">Giao thức Open Graph</span><span class="lc-sub">Bản đặc tả: mọi thẻ, có đánh dấu cái nào bắt buộc cái nào tuỳ chọn.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — opengraph-image</span><span class="lc-sub">Sinh ảnh mạng xã hội theo từng bản ghi từ JSX, kèm luật kích thước và nhớ đệm.</span></span>
</a>


<h3>🔬 Đo thật: rô-bốt cào đọc gì (Next.js 16.4.6 · curl -A facebookexternalhit/1.1)</h3>
<p>Layout của một mục đặt Open Graph “chung cả trang” với <code>url: &#39;https://example.com&#39;</code> và một ảnh tương đối; trang sâu bên dưới chỉ đặt <code>title</code> của nó. Chưa có <code>metadataBase</code>:</p>
<div class="out">$ npm run build
⚠ metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000".
$ curl -s localhost:3000/og/bai -A facebookexternalhit/1.1 | grep -oE "&lt;title&gt;…|og:…"
&lt;title&gt;Lesson 17.4 — Open Graph&lt;/title&gt;
&lt;meta property="og:title" content="CT Lab"
&lt;meta property="og:description" content="The lab site"
&lt;meta property="og:url" content="https://example.com"
&lt;meta property="og:image" content="http://localhost:3000/og-site.png"
$ curl -s localhost:3000/og/dung …   # its own openGraph, url: '/og/dung'
&lt;title&gt;Lesson 17.4 — Open Graph&lt;/title&gt;
&lt;meta property="og:title" content="Lesson 17.4 — Open Graph"
&lt;meta property="og:description" content="Why a pasted link becomes a card"
&lt;meta property="og:url" content="/og/dung"</div>
<div class="callout warn"><p>Ba lỗi mà không một thông báo: <strong>og:url</strong> là gốc trang (Messenger mở <em>địa chỉ đó</em>), <strong>og:title</strong> là của layout — <code>title</code> của trang không tự chảy vào <code>openGraph</code> của cha — và <strong>og:image</strong> nằm ở localhost. og:url tương đối thì không được giải gì cả.</p></div>
<p><strong>Mỗi bài một ảnh thẻ — <code>opengraph-image.tsx</code>:</strong></p>
<div class="out">$ curl -s localhost:3000/og/the/hello | grep og:image
&lt;meta property="og:image" content="http://localhost:19322/og/the/hello/opengraph-image?dbbc30bb4b8536aa"
&lt;meta property="og:image:type" content="image/png"
&lt;meta property="og:image:width" content="1200"
&lt;meta property="og:image:height" content="630"
$ curl -s &lt;og:image&gt; -o card.png; file card.png
200 image/png 24053 byte
card.png: PNG image data, 1200 x 630, 8-bit/color RGBA, non-interlaced</div>
<p><strong>Sau khi sửa — <code>metadataBase</code> ở layout gốc, bỏ <code>url</code> khỏi openGraph dùng chung:</strong></p>
<div class="out">$ curl -s localhost:3000/og/bai -A facebookexternalhit/1.1 | grep og:
&lt;meta property="og:title" content="CT Lab"
&lt;meta property="og:image" content="https://example.com/og-site.png"
$ curl -s localhost:3000/og/the/hello | grep og:image
&lt;meta property="og:image" content="https://example.com/og/the/hello/opengraph-image?dbbc30bb4b8536aa"</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -n "metadataBase" frontend/src/app/layout.tsx
150:  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://cuongthai.com'),
$ git show 07aa3f99e --format='%h %ad %s' --date=short -s
07aa3f99e 2026-07-23 fix(seo): drop hardcoded homepage og:url + canonical from root layout
$ git show 07aa3f99e --format= -- frontend/src/app/layout.tsx | grep -E "^-.*url: 'https://cuongthai.com'|^-.*canonical"
-    url: 'https://cuongthai.com',
-    canonical: 'https://cuongthai.com',
$ find frontend/src/app -name 'opengraph-image.tsx' | wc -l | sed 's/^ */opengraph-image.tsx: /'
opengraph-image.tsx: 15
$ curl -s https://cuongthai.com/courses/nextjs -A facebookexternalhit/1.1 | grep -oE '&lt;meta property="og:(url|title|image)" content="[^"]{0,80}' | head -4
&lt;meta property="og:title" content="Next.js: The React Framework
&lt;meta property="og:url" content="https://cuongthai.com/courses/nextjs
&lt;meta property="og:image" content="https://media.cuongthai.com/images/course-covers/nextjs.png?v=4</div>Commit <code>07aa3f99e</code> (23/07/2026) bỏ <code>openGraph.url</code> và canonical cố định <code>https://cuongthai.com</code> khỏi layout <em>gốc</em>: mọi trang thừa kế chúng, nên mọi liên kết sâu chia sẻ qua Messenger đều mở trang chủ, và mọi trang báo với Google rằng nó là bản trùng của <code>/</code>.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">curl -s localhost:3000/&lt;page&gt; -A facebookexternalhit/1.1 | grep -oE '&lt;meta property="og:[a-z:]+" content="[^"]*"'
npm run build 2&gt;&amp;1 | grep -i metadataBase    <span class="tok-comment">  # cảnh báo duy nhất bạn nhận</span>
curl -s "$(curl -s localhost:3000/&lt;page&gt; | grep -oE 'og:image" content="[^"]*' | cut -d'"' -f3)" -o card.png; file card.png</code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Bạn dán liên kết vào Zalo hay Messenger: tấm thẻ chỉ là og:title và og:image của trang; og:url sai thì bấm vào mở trang chủ.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">og:image trỏ về localhost? Build đã cảnh báo, không ai đọc — mọi lượt chia sẻ hiện ảnh hỏng.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Trang lừa đảo chép thẻ og của một ngân hàng: cùng logo, cùng tiêu đề trong khung chat. Tấm thẻ không chứng minh được tên miền.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Đọc địa chỉ, đừng tin tấm thẻ, trước khi gõ mật khẩu. Với trang của bạn: curl giả rô-bốt trước lần chia sẻ đầu.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-3-seo" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.3 — SEO</span><span class="lc-sub">Rô-bốt còn lại: Googlebot</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-8-5-route-group-metadata" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 8.5 — Route group, segment động và metadata</span><span class="lc-sub">Metadata gộp xuống cây route thế nào</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-2-1-html-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 2.1 — HTML là gì</span><span class="lc-sub">thẻ meta trong head</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm thẻ Open Graph (<code>openGraph</code> trong metadata) với title, description và ảnh, và thử link trong một trình kiểm card.</li>
<li>Tạo một ảnh OG động bằng <code>opengraph-image.tsx</code> (ImageResponse) cho một trang nội dung.</li>
<li>Dán URL vào một app chat và xác nhận card preview hiện.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn điều khiển được cách một link chia sẻ hiện preview, kể cả một ảnh OG được tạo.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Open Graph</span><span class="v">Metadata điều khiển cách một link hiện preview khi chia sẻ.</span></div>
  <div class="kv"><span class="k">og:title / og:image</span><span class="v">Title và ảnh của card.</span></div>
  <div class="kv"><span class="k">metadata openGraph</span><span class="v">Cách của Next để đặt thẻ OG theo trang.</span></div>
  <div class="kv"><span class="k">opengraph-image</span><span class="v">Một file tạo một ảnh OG động.</span></div>
  <div class="kv"><span class="k">ImageResponse</span><span class="v">Render JSX thành một ảnh cho card OG/Twitter.</span></div>
  <div class="kv"><span class="k">Trình kiểm card</span><span class="v">Công cụ xem trước link sẽ trông thế nào khi chia sẻ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Thẻ Open Graph điều khiển cách một link hiện preview khi chia sẻ (title, description, ảnh).</li><li>Đặt chúng bằng metadata <code>openGraph</code> theo trang.</li><li>Tạo một ảnh preview động bằng <code>opengraph-image.tsx</code> và <code>ImageResponse</code>.</li><li>Thử bằng một trình kiểm card trước khi tin nó.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#opengraph" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Open Graph metadata</span><span class="lc-sub">Các trường openGraph, và sinh ảnh OG theo từng route.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 17.5 ─────────────────────────── */
    {
      title: '17.5 — Core Web Vitals: how Google measures "good"|||17.5 — Core Web Vitals: Google đo "tốt" thế nào',
      slug: 'nextjs-17-5-core-web-vitals',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Google đo trải nghiệm trang bằng ba con số: LCP (nội dung chính hiện nhanh không), CLS (bố cục có nhảy loạn không), INP (bấm vào phản hồi nhanh không). Hiểu ba cái này bắc cầu sang Chương 18 tối ưu.',
      content: `
${G17_5}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.5</span>
<h2>Three numbers that summarise "does this page feel good?"</h2>
<p class="lead">Google grades real user experience with a small set of metrics called <strong>Core Web Vitals</strong>. They also influence search ranking, so they connect this chapter (rendering/SEO) to the next (performance). Three matter most, and each maps to a feeling a user actually has.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">LCP — Largest Contentful Paint</span><span class="v">"How fast does the main thing appear?" The time until the biggest visible element (a hero image, a heading) is painted. The feeling: <em>did the page load quickly?</em> Aim under ~2.5s.</span></div>
  <div class="kv"><span class="k">CLS — Cumulative Layout Shift</span><span class="v">"Does the page jump around while loading?" Measures unexpected movement of content. The feeling: <em>I went to tap a button and it jumped.</em> Aim under ~0.1.</span></div>
  <div class="kv"><span class="k">INP — Interaction to Next Paint</span><span class="v">"When I click, how fast does it respond?" Measures responsiveness to input. The feeling: <em>is this page laggy?</em> Aim under ~200ms.</span></div>
</div>

<h3>How what you have learned already moves these</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>LCP</b> improves when the server sends ready HTML (SSR/SSG, this chapter) and images load fast (Chapter 18) — the content is there sooner.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>CLS</b> improves when images and ads reserve their space up front, so nothing shoves content down as it loads (Chapter 18's image component does this for you).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>INP</b> improves when you ship less JavaScript (Server Components, Chapter 9) and keep the client light — less code to block the main thread.</div></div>
</div>

<div class="callout ok">
<p><strong>Why start with the numbers:</strong> "make it faster" is vague; "get LCP under 2.5s and stop the layout from shifting" is a task you can act on and measure. You can see your own scores in Chrome DevTools (the Lighthouse tab) and in Google Search Console. Chapter 18 is the toolbox for actually moving them — this lesson gives you the scoreboard to aim at.</p>
</div>

<h3>The three metrics that are measured on real users</h3>
<div class="lz-map">
  <div class="lz-stage">Each one names a specific complaint</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">LCP — largest contentful paint</div><div class="lz-nsub">When the main content appeared. Target under 2.5s. Usually an image, a font, or a server response that took too long.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">INP — interaction to next paint</div><div class="lz-nsub">How long the page took to respond to a click. Target under 200ms. Long JavaScript tasks are the usual cause.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">CLS — cumulative layout shift</div><div class="lz-nsub">How much things jumped while loading. Target under 0.1. Images and ads without reserved space are the usual cause.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Field data, not lab data</div><div class="lz-nsub">These are collected from real Chrome users. A perfect Lighthouse score with bad field data means your users have slower devices than you.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — an image with no width and height, shifting the whole page as it loads.</strong> The browser cannot reserve space for an image whose size it does not know, so the text below it is laid out, painted, and then pushed down when the image arrives — the reader loses their place, and someone tapping a link hits whatever moved into that spot. It is the single largest contributor to CLS on most sites, and it is invisible on a fast connection because the image arrives before the paint. &#96;next/image&#96; requires the dimensions for exactly this reason. Throttle to Slow 3G and reload: every jump you see is a shift your users are getting.</p></div>
<a class="link-card dl" href="https://web.dev/articles/vitals" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">web.dev — Core Web Vitals</span><span class="lc-sub">What each metric measures, the thresholds, and how they are collected.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/optimize-cls" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">web.dev — Optimize CLS</span><span class="lc-sub">The specific causes of layout shift, each with the fix.</span></span>
</a>


<h3>🔬 Measured: the three numbers in a real browser (Next.js 16.4.6 · next start · Chromium)</h3>
<p>The same page twice, with a hero image that arrives after 800 ms — once with no <code>width</code>/<code>height</code>, once with them. A <code>PerformanceObserver</code> inside the page collects every layout shift and the LCP entry:</p>
<pre><code class="language-typescript">new PerformanceObserver((l) =&gt; { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
  .observe({ type: 'layout-shift', buffered: true });
new PerformanceObserver((l) =&gt; { const es = l.getEntries(); lcp = es[es.length - 1].startTime; })
  .observe({ type: 'largest-contentful-paint', buffered: true });</code></pre>
<div class="out">cls-xau (no size)    ⇒ LCP 872 ms · CLS 0.137 (1 shift)
cls-tot (width/height) ⇒ LCP 824 ms · CLS 0.000 (0 shift)
inp-xau (300 ms work, then paint) ⇒ INP ≈ 360 ms · msg: saved ✓
inp-tot (paint first, work after) ⇒ INP ≈ 48 ms · msg: saved ✓</div>
<div class="callout warn"><p>One shift of 0.137 is already over the 0.1 limit — the text and the button were laid out, then pushed down. LCP was about the same on both pages: CLS is about movement, not speed. For INP, the click had to wait for the handler: the browser cannot paint the next frame until your JavaScript returns.</p></div>
<p><strong>Lab vs field:</strong> the same measurement on cuongthai.com/courses/nextjs, on the course Mac: <code>LCP 2620 ms · CLS 0.006 (2 shift)</code>. That is one machine and one run; Google ranks on real Chrome users (CrUX, the 75th percentile).</p>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -rln "&lt;img " src --include=*.tsx | wc -l | sed 's/^ */tệp .tsx có &lt;img: /'
tệp .tsx có &lt;img: 141
$ grep -rn "&lt;img " src --include=*.tsx | grep -vE "width=|height=" | wc -l | sed 's/^ */dòng &lt;img không width\\/height trên cùng dòng: /'
dòng &lt;img không width/height trên cùng dòng: 176
$ grep -rln "next/image" src | wc -l | sed 's/^ */tệp dùng next\\/image: /'
tệp dùng next/image: 31
$ grep -rln "useReportWebVitals" src/app src/components src/lib 2&gt;/dev/null | wc -l | sed 's/^ */tệp gọi useReportWebVitals: /'
tệp gọi useReportWebVitals: 0</div>A rough grep: many <code>&lt;img&gt;</code> tags carry no size on the same line (some are sized by CSS), and no page calls <code>useReportWebVitals</code> — the site does not collect its own users&#39; numbers.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"># DevTools → Console, on any page:
let cls = 0; new PerformanceObserver((l) =&gt; l.getEntries().forEach((e) =&gt; { if (!e.hadRecentInput) cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
new PerformanceObserver((l) =&gt; l.getEntries().forEach((e) =&gt; console.log('event', e.name, Math.round(e.duration), 'ms'))).observe({ type: 'event', durationThreshold: 16 });
# then click things, and read cls</code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">You tap “Pay” just as a banner loads above; the button slides down and you tap something else — that is CLS.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">A click handler freezes the page for 300 ms? Users think nothing happened, tap again — and order twice.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Some pages use a late-loading banner as a trap, shifting an “Allow” or “Buy” button under your finger for accidental clicks.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Every image and embed reserves its space; show feedback first and do heavy work after; collect real users&#39; numbers with <code>useReportWebVitals</code>.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-1-bon-cach-render" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.1 — Four ways a page gets made</span><span class="lc-sub">Server HTML and the first byte (LCP)</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-1-mac-dinh-la-server-component" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.1 — Server Components by default</span><span class="lc-sub">Less client JavaScript (INP)</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-1-do-truoc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.1 — Measure first</span><span class="lc-sub">The toolbox chapter starts here</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Run Lighthouse on one page and record LCP, CLS and INP; note which is worst.</li>
<li>Fix one CLS issue by giving an image explicit dimensions, and re-measure.</li>
<li>Explain what each of LCP, CLS and INP measures in one line.</li>
</ol>
<p><strong>Done when:</strong> you can measure Core Web Vitals and fix one layout-shift issue.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Core Web Vitals</span><span class="v">Google's user-experience metrics that affect ranking.</span></div>
  <div class="kv"><span class="k">LCP</span><span class="v">Largest Contentful Paint — when the main content appears.</span></div>
  <div class="kv"><span class="k">CLS</span><span class="v">Cumulative Layout Shift — how much the page jumps around.</span></div>
  <div class="kv"><span class="k">INP</span><span class="v">Interaction to Next Paint — responsiveness to input.</span></div>
  <div class="kv"><span class="k">Lighthouse</span><span class="v">A tool to measure these in the browser.</span></div>
  <div class="kv"><span class="k">Field vs lab</span><span class="v">Real-user data vs a single synthetic run.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Core Web Vitals are Google's UX metrics that influence ranking: LCP (content appears), CLS (layout stability), INP (responsiveness).</li><li>Measure them with Lighthouse and field data, not by feel.</li><li>Common fixes: explicit image dimensions for CLS, less JS for INP, fast data/SSR for LCP.</li><li>Field data from real users matters more than a single lab run.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://web.dev/articles/vitals" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">web.dev — Core Web Vitals</span><span class="lc-sub">LCP, CLS, INP explained, with the target thresholds.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.5</span>
<h2>Ba con số tóm tắt "trang này có cảm giác tốt không?"</h2>
<p class="lead">Google chấm trải nghiệm người dùng thật bằng một bộ nhỏ chỉ số gọi là <strong>Core Web Vitals</strong>. Chúng cũng ảnh hưởng xếp hạng tìm kiếm, nên nối chương này (render/SEO) với chương sau (hiệu năng). Ba cái quan trọng nhất, mỗi cái khớp với một cảm giác người dùng thật sự có.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">LCP — Largest Contentful Paint</span><span class="v">"Thứ chính hiện ra nhanh không?" Thời gian tới khi phần tử hiện thấy lớn nhất (ảnh hero, một tiêu đề) được vẽ. Cảm giác: <em>trang tải nhanh chứ?</em> Nhắm dưới ~2,5s.</span></div>
  <div class="kv"><span class="k">CLS — Cumulative Layout Shift</span><span class="v">"Trang có nhảy loạn khi tải không?" Đo chuyển động bất ngờ của nội dung. Cảm giác: <em>tôi định bấm một nút mà nó nhảy.</em> Nhắm dưới ~0,1.</span></div>
  <div class="kv"><span class="k">INP — Interaction to Next Paint</span><span class="v">"Khi tôi bấm, nó phản hồi nhanh không?" Đo độ đáp ứng với thao tác. Cảm giác: <em>trang này có lag không?</em> Nhắm dưới ~200ms.</span></div>
</div>

<h3>Những gì bạn đã học tác động ba cái này ra sao</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>LCP</b> tốt lên khi server gửi HTML sẵn (SSR/SSG, chương này) và ảnh tải nhanh (Chương 18) — nội dung có mặt sớm hơn.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>CLS</b> tốt lên khi ảnh và quảng cáo giữ chỗ trước, để không gì đẩy nội dung xuống khi tải (component ảnh của Chương 18 làm việc này giúp bạn).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>INP</b> tốt lên khi bạn gửi ít JavaScript hơn (Server Component, Chương 9) và giữ client nhẹ — ít code chặn luồng chính hơn.</div></div>
</div>

<div class="callout ok">
<p><strong>Vì sao bắt đầu bằng con số:</strong> "làm nhanh hơn" thì mơ hồ; "đưa LCP dưới 2,5s và ngăn bố cục nhảy" là một việc bạn hành động và đo được. Bạn xem điểm của mình trong Chrome DevTools (tab Lighthouse) và trong Google Search Console. Chương 18 là bộ đồ nghề để thật sự dịch chúng — bài này cho bạn bảng điểm để nhắm tới.</p>
</div>

<h3>Ba chỉ số được đo trên người dùng thật</h3>
<div class="lz-map">
  <div class="lz-stage">Mỗi cái gọi tên một lời phàn nàn cụ thể</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">LCP — lần vẽ nội dung lớn nhất</div><div class="lz-nsub">Khi nội dung chính hiện ra. Nhắm dưới 2,5 giây. Thường là một tấm ảnh, một font, hoặc một phản hồi máy chủ quá lâu.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">INP — từ tương tác tới lần vẽ kế tiếp</div><div class="lz-nsub">Trang mất bao lâu để đáp lại một cú bấm. Nhắm dưới 200ms. Nguyên nhân thường gặp là các tác vụ JavaScript dài.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">CLS — tổng độ xê dịch bố cục</div><div class="lz-nsub">Mọi thứ nhảy nhót bao nhiêu trong lúc tải. Nhắm dưới 0,1. Nguyên nhân thường gặp là ảnh và quảng cáo không được giữ chỗ sẵn.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Dữ liệu thực địa, không phải dữ liệu phòng thí nghiệm</div><div class="lz-nsub">Chúng được thu từ người dùng Chrome thật. Điểm Lighthouse hoàn hảo mà dữ liệu thực địa xấu nghĩa là người dùng của bạn có máy chậm hơn máy bạn.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một tấm ảnh không có width và height, đẩy cả trang xê dịch trong lúc tải.</strong> Trình duyệt không giữ chỗ được cho một tấm ảnh mà nó chưa biết kích thước, nên phần chữ bên dưới được bố trí, vẽ ra, rồi bị đẩy xuống khi ảnh về — người đọc mất chỗ đang đọc, và người đang chạm vào một liên kết lại bấm trúng thứ vừa nhảy vào chỗ đó. Đây là thứ đóng góp lớn nhất vào CLS ở phần lớn các trang, và nó vô hình trên đường truyền nhanh vì ảnh về trước cả lần vẽ. &#96;next/image&#96; đòi kích thước chính vì lẽ đó. Hãy bóp băng thông xuống Slow 3G rồi tải lại: mỗi cú nhảy bạn thấy là một cú xê dịch mà người dùng của bạn đang nhận.</p></div>
<a class="link-card dl" href="https://web.dev/articles/vitals" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">web.dev — Core Web Vitals</span><span class="lc-sub">Mỗi chỉ số đo cái gì, các ngưỡng, và chúng được thu thập ra sao.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/optimize-cls" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">web.dev — Tối ưu CLS</span><span class="lc-sub">Những nguyên nhân cụ thể gây xê dịch bố cục, mỗi cái kèm cách chữa.</span></span>
</a>


<h3>🔬 Đo thật: ba con số trong trình duyệt thật (Next.js 16.4.6 · next start · Chromium)</h3>
<p>Cùng một trang hai lần, ảnh lớn tới sau 800 ms — một lần không có <code>width</code>/<code>height</code>, một lần có. Một <code>PerformanceObserver</code> ngay trong trang thu mọi lần xô lệch và LCP:</p>
<pre><code class="language-typescript">new PerformanceObserver((l) =&gt; { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
  .observe({ type: 'layout-shift', buffered: true });
new PerformanceObserver((l) =&gt; { const es = l.getEntries(); lcp = es[es.length - 1].startTime; })
  .observe({ type: 'largest-contentful-paint', buffered: true });</code></pre>
<div class="out">cls-xau (no size)    ⇒ LCP 872 ms · CLS 0.137 (1 shift)
cls-tot (width/height) ⇒ LCP 824 ms · CLS 0.000 (0 shift)
inp-xau (300 ms work, then paint) ⇒ INP ≈ 360 ms · msg: saved ✓
inp-tot (paint first, work after) ⇒ INP ≈ 48 ms · msg: saved ✓</div>
<div class="callout warn"><p>Một lần xô 0.137 đã vượt ngưỡng 0.1 — chữ và nút đã được xếp, rồi bị đẩy xuống. LCP hai trang gần như nhau: CLS nói về chuyển động, không nói về tốc độ. Với INP, cú bấm phải chờ hàm xử lý: trình duyệt không vẽ được khung hình kế tiếp cho tới khi JavaScript của bạn chạy xong.</p></div>
<p><strong>Phòng lab vs thực địa:</strong> cùng phép đo trên cuongthai.com/courses/nextjs, máy Mac của khoá: <code>LCP 2620 ms · CLS 0.006 (2 shift)</code>. Đó là một máy, một lần; Google xếp hạng theo người dùng Chrome thật (CrUX, mức phần trăm thứ 75).</p>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -rln "&lt;img " src --include=*.tsx | wc -l | sed 's/^ */tệp .tsx có &lt;img: /'
tệp .tsx có &lt;img: 141
$ grep -rn "&lt;img " src --include=*.tsx | grep -vE "width=|height=" | wc -l | sed 's/^ */dòng &lt;img không width\\/height trên cùng dòng: /'
dòng &lt;img không width/height trên cùng dòng: 176
$ grep -rln "next/image" src | wc -l | sed 's/^ */tệp dùng next\\/image: /'
tệp dùng next/image: 31
$ grep -rln "useReportWebVitals" src/app src/components src/lib 2&gt;/dev/null | wc -l | sed 's/^ */tệp gọi useReportWebVitals: /'
tệp gọi useReportWebVitals: 0</div>Một phép grep thô: nhiều thẻ <code>&lt;img&gt;</code> không ghi kích thước trên cùng dòng (một số được CSS định cỡ), và chưa trang nào gọi <code>useReportWebVitals</code> — trang web chưa tự thu số đo của người dùng mình.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"># DevTools → Console, trên trang bất kỳ:
let cls = 0; new PerformanceObserver((l) =&gt; l.getEntries().forEach((e) =&gt; { if (!e.hadRecentInput) cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
new PerformanceObserver((l) =&gt; l.getEntries().forEach((e) =&gt; console.log('event', e.name, Math.round(e.duration), 'ms'))).observe({ type: 'event', durationThreshold: 16 });
# rồi bấm thử, và đọc cls</code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Bạn bấm “Thanh toán” đúng lúc một banner tải phía trên; nút trượt xuống và bạn bấm nhầm thứ khác — đó là CLS.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Hàm bấm đứng hình 300 ms? Người dùng tưởng chưa bấm, bấm lần nữa — và đặt hàng hai lần.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Có trang cố tình dùng banner tải muộn làm bẫy, đẩy nút “Cho phép” hay “Mua” vào đúng chỗ ngón tay để bạn bấm nhầm.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Mọi ảnh và khung nhúng giữ chỗ; phản hồi trước, việc nặng sau; thu số đo người dùng thật bằng <code>useReportWebVitals</code>.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-1-bon-cach-render" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.1 — Bốn cách một trang được tạo ra</span><span class="lc-sub">HTML từ server và byte đầu (LCP)</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-1-mac-dinh-la-server-component" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.1 — Mặc định là Server Component</span><span class="lc-sub">Ít JavaScript phía client (INP)</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-1-do-truoc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.1 — Hãy đo trước</span><span class="lc-sub">Chương hộp đồ nghề bắt đầu ở đây</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy Lighthouse trên một trang và ghi LCP, CLS và INP; để ý cái nào tệ nhất.</li>
<li>Sửa một vấn đề CLS bằng cách cho một ảnh kích thước rõ, và đo lại.</li>
<li>Giải thích mỗi cái LCP, CLS và INP đo gì, một dòng.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đo được Core Web Vitals và sửa một vấn đề layout-shift.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Core Web Vitals</span><span class="v">Các chỉ số trải nghiệm của Google ảnh hưởng xếp hạng.</span></div>
  <div class="kv"><span class="k">LCP</span><span class="v">Largest Contentful Paint — khi nội dung chính hiện.</span></div>
  <div class="kv"><span class="k">CLS</span><span class="v">Cumulative Layout Shift — trang nhảy nhót bao nhiêu.</span></div>
  <div class="kv"><span class="k">INP</span><span class="v">Interaction to Next Paint — độ phản hồi với input.</span></div>
  <div class="kv"><span class="k">Lighthouse</span><span class="v">Một công cụ đo các chỉ số này trong trình duyệt.</span></div>
  <div class="kv"><span class="k">Field vs lab</span><span class="v">Dữ liệu người dùng thật vs một lần chạy giả lập.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Core Web Vitals là các chỉ số UX của Google ảnh hưởng xếp hạng: LCP (nội dung hiện), CLS (ổn định bố cục), INP (độ phản hồi).</li><li>Đo chúng bằng Lighthouse và dữ liệu field, không bằng cảm giác.</li><li>Sửa thường gặp: kích thước ảnh rõ cho CLS, ít JS cho INP, dữ liệu/SSR nhanh cho LCP.</li><li>Dữ liệu field từ người dùng thật quan trọng hơn một lần chạy lab.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://web.dev/articles/vitals" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">web.dev — Core Web Vitals</span><span class="lc-sub">LCP, CLS, INP giải thích, kèm ngưỡng mục tiêu.</span></span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-2-transition-animation" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 12.2 — Transitions and animations</span><span class="lc-sub">Cheap vs expensive properties, transitionend, reduced motion — measured</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-2-transition-animation" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 12.2 — Transition và animation</span><span class="lc-sub">Thuộc tính rẻ và đắt, transitionend, giảm chuyển động — có số đo</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-14-4-performance" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 14.4 — Measuring performance</span><span class="lc-sub">LCP 12.3 s → 1.2 s, CLS 0.209 → 0, Lighthouse 64 → 99 on one page, measured</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-14-4-performance" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 14.4 — Đo hiệu năng</span><span class="lc-sub">LCP 12,3 s → 1,2 s, CLS 0,209 → 0, Lighthouse 64 → 99 trên cùng một trang, đo thật</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 17.6 QUIZ ─────────────────────────── */
    {
      title: '17.6 — Chapter 17 quiz|||17.6 — Kiểm tra chương 17',
      slug: 'nextjs-17-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về render và SEO: CSR/SSR/SSG/ISR, tĩnh vs động và cái gì lật sang động, vì sao render quyết định SEO, metadata/sitemap/robots, Open Graph và bẫy og:url, và Core Web Vitals.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 17: the four rendering strategies, static vs dynamic and what triggers dynamic, why rendering decides SEO, metadata/sitemap/robots, Open Graph, and Core Web Vitals.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 17: bốn chiến lược render, tĩnh vs động và cái gì kích hoạt động, vì sao render quyết định SEO, metadata/sitemap/robots, Open Graph, và Core Web Vitals.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does "rendering" mean?|||"Render" nghĩa là gì?',
            options: [
              'styling a component with CSS|||style một component bằng CSS',
              'turning your components into the HTML a browser can draw|||biến component của bạn thành HTML mà trình duyệt vẽ được',
              'deploying to a server|||deploy lên một server',
              'writing tests|||viết test',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which strategy renders the page once at build time and serves the same HTML to everyone?|||Chiến lược nào render trang một lần lúc build và dọn cùng HTML cho mọi người?',
            options: [
              'SSR (Server-Side Rendering)|||SSR (Server-Side Rendering)',
              'SSG (Static Site Generation)|||SSG (Static Site Generation)',
              'CSR (Client-Side Rendering)|||CSR (Client-Side Rendering)',
              'none of these|||không cái nào',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'ISR (Incremental Static Regeneration) is best described as…|||ISR (Incremental Static Regeneration) được mô tả đúng nhất là…',
            options: [
              'rendering fresh on every request|||render tươi mỗi request',
              'static pages that quietly refresh on a timer (revalidate)|||trang tĩnh lặng lẽ làm mới theo hẹn giờ (revalidate)',
              'rendering only in the browser|||chỉ render trong trình duyệt',
              'never refreshing|||không bao giờ làm mới',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In the App Router, which of these makes a route DYNAMIC (per-request)?|||Trong App Router, cái nào làm một route ĐỘNG (mỗi request)?',
            options: [
              'rendering plain markup|||render markup thường',
              'reading cookies()/headers(), using searchParams, or an uncached fetch|||đọc cookies()/headers(), dùng searchParams, hoặc một fetch không cache',
              'importing a component|||import một component',
              'adding CSS|||thêm CSS',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is pure CSR risky for SEO?|||Vì sao CSR thuần rủi ro cho SEO?',
            options: [
              'it is too fast|||nó quá nhanh',
              'the server sends a near-empty shell, so a crawler may index a nearly blank page|||server gửi một vỏ gần trống, nên crawler có thể lập chỉ mục một trang gần như trắng',
              'CSR blocks Google entirely|||CSR chặn Google hoàn toàn',
              'it has no CSS|||nó không có CSS',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'For SEO, the two most important metadata fields are…|||Cho SEO, hai trường metadata quan trọng nhất là…',
            options: [
              'color and font|||màu và font',
              'title and description|||title và description',
              'width and height|||chiều rộng và cao',
              'author and date only|||chỉ tác giả và ngày',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What generates /sitemap.xml and /robots.txt in the App Router?|||Cái gì sinh /sitemap.xml và /robots.txt trong App Router?',
            options: [
              'you write them by hand in public/|||bạn viết tay trong public/',
              'app/sitemap.ts and app/robots.ts|||app/sitemap.ts và app/robots.ts',
              'the browser|||trình duyệt',
              'they are automatic and cannot be changed|||chúng tự động và không đổi được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is Open Graph used for?|||Open Graph dùng để làm gì?',
            options: [
              'styling graphs|||style biểu đồ',
              'the card (image/title/description) shown when a link is shared on social platforms|||thẻ (ảnh/tiêu đề/mô tả) hiện khi một link được chia sẻ trên nền tảng xã hội',
              'database queries|||truy vấn database',
              'authentication|||xác thực',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A shared cuongthai.com link went to "/" instead of the conversation. The cause?|||Một link cuongthai.com chia sẻ đi về "/" thay vì cuộc trò chuyện. Nguyên nhân?',
            options: [
              'the server was down|||server sập',
              'a wrong Open Graph URL (og:url) in the metadata|||một URL Open Graph sai (og:url) trong metadata',
              'the user was logged out|||người dùng bị đăng xuất',
              'a CSS bug|||một bug CSS',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which Core Web Vital measures unexpected layout movement while loading?|||Chỉ số Core Web Vital nào đo chuyển động bố cục bất ngờ khi tải?',
            options: [
              'LCP (Largest Contentful Paint)|||LCP (Largest Contentful Paint)',
              'CLS (Cumulative Layout Shift)|||CLS (Cumulative Layout Shift)',
              'INP (Interaction to Next Paint)|||INP (Interaction to Next Paint)',
              'SEO score|||điểm SEO',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
