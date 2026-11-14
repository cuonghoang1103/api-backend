/**
 * Next.js & React — Chương 18: Hiệu năng (bundle, ảnh, tải động, font).
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Viết cho người mới — định nghĩa "bundle", "lazy load", "code splitting" khi gặp.
 * Xem [[feedback_nextjs_course_beginner_first]]. Sự cố/bài học thật cuongthai:
 * đo độ nặng bằng `next build` không đếm thẻ script (18.5). Không có output console.
 */

import G18_1 from './giang/nxj-18-1.mjs';
import G18_2 from './giang/nxj-18-2.mjs';
import G18_3 from './giang/nxj-18-3.mjs';
import G18_4 from './giang/nxj-18-4.mjs';
import G18_5 from './giang/nxj-18-5.mjs';
export default {
  title: 'Chapter 18 — Performance: images, JavaScript, and fonts|||Chương 18 — Hiệu năng: ảnh, JavaScript và font',
  description: 'Điều gì làm một trang chậm (quá nhiều JavaScript, ảnh nặng) và cách Next.js chữa: component <Image> tự tối ưu ảnh, gửi ít JS hơn bằng Server Component + tải động, next/font không nhảy layout, và cách ĐO đúng thay vì đoán.',
  lessons: [
    /* ─────────────────────────── 18.1 ─────────────────────────── */
    {
      title: '18.1 — What makes a page slow (and measure first)|||18.1 — Điều gì làm trang chậm (và hãy đo trước)',
      slug: 'nextjs-18-1-do-truoc',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Next.js Image Optimization Explained with Real Stats - 99.4% File Size Reduction" — Daweb (oEmbed verified).
      video: { url: 'https://youtu.be/7-MxyyDp9Fc', durationSeconds: 0 },
      description: 'Chương 17 cho bạn bảng điểm (Core Web Vitals). Chương này là đồ nghề để dịch nó. Trước tiên: hai thủ phạm lớn nhất của một trang chậm là ẢNH quá nặng và quá nhiều JAVASCRIPT — và quy tắc số một là đo trước khi sửa.',
      content: `
${G18_1}
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.1</span>
<h2>Slow pages usually come from two places</h2>
<p class="lead">A page feels slow mostly for two reasons, and knowing them tells you where to look first. Everything else in this chapter is a fix for one of these two.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Heavy images</span><span class="v">A photo saved straight from a camera can be several megabytes. Sending that to a phone on mobile data is the most common cause of a slow-loading page — and it hurts LCP directly (Chapter 17).</span></div>
  <div class="kv"><span class="k">Too much JavaScript</span><span class="v">Every kilobyte of JS the browser must download, parse, and run delays interactivity. This is the "bundle" — the packaged JavaScript your app ships. A big bundle hurts INP and makes the page feel laggy.</span></div>
</div>
<p><strong>What is a "bundle"?</strong> When you build the app, your many source files are packed into a few compressed JavaScript files the browser downloads. That package is the bundle. Smaller bundle = less to download and run = faster page. Much of performance work is simply shipping a smaller bundle.</p>

<h3>The one rule that saves you from guessing: measure first</h3>
<p>Performance intuition is often wrong. Before "optimising" anything, look at real numbers, or you will spend hours on something that was never the bottleneck.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Lighthouse</b> (built into Chrome DevTools) grades a page and lists its biggest problems — start here.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The build&#39;s own numbers</b> — the JavaScript size of every route. Next.js 16 no longer prints it in the <code>next build</code> table; it writes it to <code>.next/diagnostics/route-bundle-stats.json</code> (measured below, and in lesson 18.5).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>The Network tab</b> shows what actually downloaded and how big — often one giant image is the whole story.</div></div>
</div>

<div class="callout ok">
<p><strong>The good news:</strong> Next.js ships the two biggest wins almost for free — an image component that shrinks and optimises pictures automatically (next lesson), and Server Components that send zero JavaScript for everything server-rendered (lesson 18.3). You get a fast baseline just by using the framework's defaults; the rest of this chapter is how to keep it fast as the app grows.</p>
</div>

<h3>Measuring before changing anything</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Build first</b> — &#96;next build &amp;&amp; next start&#96;. Development numbers are meaningless — the dev server ships unminified code and re-compiles on demand.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Read the per-route JavaScript</b> — <code>firstLoadUncompressedJsBytes</code> in <code>.next/diagnostics/route-bundle-stats.json</code> (Next.js 16 prints only ○/ƒ; older versions printed a First Load JS column). A route noticeably larger than its neighbours is where to look, and the number is comparable across commits.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Run Lighthouse on the built app</b> — It reports LCP, CLS and unused bytes with the specific resource named.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Change one thing, rebuild, compare</b> — Two changes at once and you cannot tell which helped. Keep the numbers in the commit message.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — optimising against the development server.</strong> &#96;next dev&#96; compiles on demand, serves unminified bundles, disables most caching and runs React&#39;s development build — so every measurement is wrong in a different direction, and the ones that look worst are often fine in production. People spend an afternoon memoising components because the profiler showed slow renders that are much faster in a build (measured in this lesson&#39;s lab: the same click took 152 ms on <code>next dev</code> and 96 ms on <code>next start</code>).. Worse, the reverse also happens: a genuine problem is hidden because dev serves everything from memory. Measure the built app, every time, and treat the dev server purely as a place to write code.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Optimizing</span><span class="lc-sub">The full list of built-in optimisations, before you add any of your own.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/lighthouse-performance" target="_blank" rel="noopener">
  <span class="lc-ico">🔦</span>
  <span class="lc-body"><span class="lc-title">web.dev — Lighthouse performance</span><span class="lc-sub">How each score is computed, so you know what a number is telling you.</span></span>
</a>


<h3>🔬 Measured: one ordinary blog post, three ways (Next.js 16.4.6 · next start · Chromium · Lighthouse 12.8.2)</h3>
<p>The lab page <code>/cham</code> has a photo uploaded straight from a camera (4000 × 3000) and a small client widget that imports <code>highlight.js</code> to colour one line. Nothing looks wrong — it compiles and builds. <strong>1 · The Network tab, sorted by size:</strong></p>
<div class="out">image       4,441 KB  /dalat.jpg
script        945 KB  /_next/static/chunks/1-xtdrpu9zrnc.js
script        224 KB  /_next/static/chunks/092r-mewpaf3q.js
script        177 KB  /_next/static/chunks/395glp5--7qza.js
font           29 KB  /_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.wof</div>
<p><strong>2 · The build&#39;s own numbers.</strong> <code>next build</code> in Next.js 16 prints only the route table — no size column:</p>
<div class="out">$ npm run build 2&gt;&amp;1 | grep -vE '^$|^&gt; |Collecting|Generating|Finalizing|Creating an optimized|Running TypeScript|Linting' | sed 's/^[┌├└] //'
▲ Next.js 16.4.6 (Turbopack)
✓ Running next.config.ts took 19ms
✓ Compiled successfully in 4.1s
  Finished TypeScript in 1331ms ...
Route (app)
○ /
○ /_not-found
ƒ /api/dem
ƒ /api/login
ƒ /api/logout
ƒ /api/me
ƒ /api/posts
ƒ /api/posts/[id]
ƒ /api/steal
○ /cham
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand</div>
<div class="out">$ node -e "…route-bundle-stats.json…"   # First Load JS per route, uncompressed + gzip
/cham   1392 KB JS · gzip 434 KB · 6 chunks
/        462 KB JS · gzip 137 KB · 6 chunks</div>
<div class="callout warn"><p>Many tutorials (and this lesson, before) say “read First Load JS in the build output”. Next.js 16 with Turbopack prints only ○ static / ƒ dynamic; the per-route size is in <code>.next/diagnostics/route-bundle-stats.json</code> (<code>firstLoadUncompressedJsBytes</code>). Here <code>/cham</code> ships three times the JavaScript of the starter page.</p></div>
<p><strong>3 · Lighthouse on the build</strong> (simulated mid-range phone, slow 4G) — it names the culprit:</p>
<div class="out">$ npx lighthouse http://localhost:3000/cham --only-categories=performance   # next start
Performance 53/100 (mobile, Lighthouse 12.8.2)
FCP 0.8 s · LCP 26.1 s · TBT 980 ms · CLS 0
Total size was 4,940 KiB
  ▸ Improve image delivery — Est savings of 4,416 KiB
  ▸ Reduce unused JavaScript — Est savings of 53 KiB
  ▸ Render blocking requests — Est savings of 130 ms</div>
<p><strong>The same page on <code>next dev</code></strong> — same code, same machine:</p>
<div class="out">next start ⇒ JS 6 files · 435 KB gzip · 1,392 KB unpacked · first click 96 ms
next dev   ⇒ JS 21 files · 1,206 KB gzip · 5,281 KB unpacked · first click 152 ms</div>
<div class="out">$ npx lighthouse http://localhost:3001/cham --only-categories=performance   # next dev (same code)
Performance 51/100 (mobile, Lighthouse 12.8.2)
FCP 0.8 s · LCP 28.8 s · TBT 1,230 ms · CLS 0
Total size was 5,714 KiB
  ▸ Improve image delivery — Est savings of 4,416 KiB
  ▸ Reduce JavaScript execution time — 1.7 s
  ▸ Reduce unused JavaScript — Est savings of 324 KiB
  ▸ Render blocking requests — Est savings of 140 ms</div>
<div class="note-ct"><strong>cuongthai.com, measured the same way (on the course Mac, one run)</strong><div class="out">$ npx lighthouse https://cuongthai.com/courses/nextjs --only-categories=performance
Performance 47/100 (mobile, Lighthouse 12.8.2)
FCP 1.7 s · LCP 11.2 s · TBT 1,200 ms · CLS 0
Total size was 1,798 KiB
  ▸ Improve image delivery — Est savings of 247 KiB
  ▸ Reduce JavaScript execution time — 1.8 s
  ▸ Reduce unused JavaScript — Est savings of 356 KiB
  ▸ Render blocking requests — Est savings of 380 ms</div>On the real site the top items are JavaScript execution and unused JavaScript, not one photo. Lighthouse moves a few points between runs — compare before and after on the same machine.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build
node -e "for (const r of require('./.next/diagnostics/route-bundle-stats.json')) console.log(r.route, Math.round(r.firstLoadUncompressedJsBytes / 1024) + ' KB')"
npx next start -p 3000
<span class="tok-comment"># DevTools → Network → Disable cache → reload → click “Size”</span>
npx lighthouse http://localhost:3000/your-page --only-categories=performance
<span class="tok-comment"># then the same page on &#96;npx next dev -p 3001&#96; — compare, never optimise against it</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">Reading a blog on 4G at a bus stop: a 4,441 KB photo is many seconds of blank space, and the reader leaves before it arrives.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">You optimise without measuring? An afternoon wrapping components in memo — while the real cost was one photo.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Heavy pages are cheap to attack: a bot fetching your biggest file in a loop burns your bandwidth bill and slows real users.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Measure every release (Lighthouse + route-bundle-stats.json), set a budget (e.g. KB of JS per route), and let CI fail when it is exceeded.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-5-core-web-vitals" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.5 — Core Web Vitals</span><span class="lc-sub">The scoreboard this chapter improves</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-5-dat-ranh-gioi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.5 — Where to put the client boundary</span><span class="lc-sub">A smaller bundle by design</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-2-next-image" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.2 — The Image component</span><span class="lc-sub">Fixes exactly the photo found here</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Run <code>next build</code> and read <code>firstLoadUncompressedJsBytes</code> per route in <code>.next/diagnostics/route-bundle-stats.json</code>; find the heaviest route.</li>
<li>Open the browser Performance panel, record a load, and identify the single biggest cost (JS, image, font, data).</li>
<li>Write down the one metric you will try to improve before changing any code.</li>
</ol>
<p><strong>Done when:</strong> you can measure where a page spends its time before optimising anything.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Measure first</span><span class="v">Find the real cost before optimising.</span></div>
  <div class="kv"><span class="k">First Load JS</span><span class="v">The JavaScript a route ships on first load (Next.js 16: <code>.next/diagnostics/route-bundle-stats.json</code>).</span></div>
  <div class="kv"><span class="k">Bottleneck</span><span class="v">The one thing that dominates load time.</span></div>
  <div class="kv"><span class="k">Performance panel</span><span class="v">Browser DevTools tab for timing a load.</span></div>
  <div class="kv"><span class="k">Bundle analyzer</span><span class="v">A tool that shows what is in your JS bundle.</span></div>
  <div class="kv"><span class="k">Budget</span><span class="v">A target number you optimise toward.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Measure before optimising: read each route&#39;s JavaScript (route-bundle-stats.json in Next.js 16) and profile a real load.</li><li>Find the single biggest cost — JS, an image, a font, or slow data — before touching code.</li><li>Guessing wastes effort; the Performance panel and bundle analyzer point you at the truth.</li><li>Set a target metric and optimise toward it.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Optimizing</span><span class="lc-sub">Images, fonts, scripts, lazy loading, and analytics — the whole toolbox.</span></span>
</a>
<a class="link-card dl" href="https://developer.chrome.com/docs/lighthouse/overview" target="_blank" rel="noopener">
  <span class="lc-ico">🔦</span>
  <span class="lc-body"><span class="lc-title">Chrome — Lighthouse</span><span class="lc-sub">Grade a page and get a prioritised list of what to fix.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.1</span>
<h2>Trang chậm thường tới từ hai chỗ</h2>
<p class="lead">Một trang cảm giác chậm chủ yếu vì hai lý do, và biết chúng cho bạn biết nhìn đâu trước. Mọi thứ khác trong chương này là cách chữa một trong hai cái đó.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Ảnh nặng</span><span class="v">Một tấm ảnh lưu thẳng từ máy ảnh có thể vài megabyte. Gửi cái đó tới một điện thoại dùng mạng di động là nguyên nhân phổ biến nhất của một trang tải chậm — và nó hại LCP trực tiếp (Chương 17).</span></div>
  <div class="kv"><span class="k">Quá nhiều JavaScript</span><span class="v">Mỗi kilobyte JS trình duyệt phải tải, phân tích, và chạy làm chậm tương tác. Đây là "bundle" — gói JavaScript app bạn gửi đi. Bundle to hại INP và làm trang cảm giác lag.</span></div>
</div>
<p><strong>"Bundle" là gì?</strong> Khi bạn build app, nhiều file nguồn của bạn được đóng gói thành vài file JavaScript nén mà trình duyệt tải về. Gói đó là bundle. Bundle nhỏ hơn = ít thứ để tải và chạy = trang nhanh hơn. Phần lớn việc tối ưu hiệu năng đơn giản là gửi một bundle nhỏ hơn.</p>

<h3>Quy tắc cứu bạn khỏi đoán: đo trước</h3>
<p>Trực giác về hiệu năng thường sai. Trước khi "tối ưu" bất cứ gì, hãy nhìn con số thật, kẻo bạn tốn hàng giờ cho thứ chưa bao giờ là điểm nghẽn.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Lighthouse</b> (có sẵn trong Chrome DevTools) chấm một trang và liệt kê vấn đề lớn nhất — bắt đầu ở đây.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Con số của chính bản build</b> — kích thước JavaScript của từng route. Next.js 16 không còn in nó trong bảng <code>next build</code>; nó ghi vào <code>.next/diagnostics/route-bundle-stats.json</code> (đo ở dưới, và ở bài 18.5).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Tab Network</b> hiện cái gì thật sự tải về và to bao nhiêu — thường một ảnh khổng lồ là toàn bộ câu chuyện.</div></div>
</div>

<div class="callout ok">
<p><strong>Tin vui:</strong> Next.js kèm hai thắng lợi lớn nhất gần như miễn phí — một component ảnh tự thu nhỏ và tối ưu ảnh (bài sau), và Server Component gửi zero JavaScript cho mọi thứ render-trên-server (bài 18.3). Bạn có một nền nhanh chỉ nhờ dùng mặc định của framework; phần còn lại của chương là cách giữ nó nhanh khi app lớn lên.</p>
</div>

<h3>Đo trước khi đổi bất cứ thứ gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Build trước đã</b> — &#96;next build &amp;&amp; next start&#96;. Con số ở môi trường phát triển là vô nghĩa — dev server ship mã chưa nén và biên dịch lại theo yêu cầu.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Đọc JavaScript của từng route</b> — <code>firstLoadUncompressedJsBytes</code> trong <code>.next/diagnostics/route-bundle-stats.json</code> (Next.js 16 chỉ in ○/ƒ; bản cũ mới có cột First Load JS). Một route to hơn hẳn hàng xóm là chỗ cần soi, và con số đó so sánh được giữa các commit.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Chạy Lighthouse trên bản đã build</b> — Nó báo LCP, CLS và số byte không dùng tới, có gọi tên tài nguyên cụ thể.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Đổi một thứ, build lại, so sánh</b> — Đổi hai thứ cùng lúc là bạn không biết cái nào có tác dụng. Hãy ghi các con số vào thông điệp commit.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tối ưu dựa trên dev server.</strong> &#96;next dev&#96; biên dịch theo yêu cầu, phục vụ gói chưa nén, tắt phần lớn nhớ đệm và chạy bản dựng phát triển của React — nên mọi phép đo đều sai theo một hướng khác nhau, và những cái trông tệ nhất thường lại ổn trên production. Người ta mất cả buổi chiều đi memo các component vì profiler hiện ra những lần render chậm mà trên bản build nhanh hơn nhiều (đo ở lab của bài này: cùng một cú bấm mất 152 ms trên <code>next dev</code> và 96 ms trên <code>next start</code>).. Tệ hơn, chiều ngược lại cũng xảy ra: một vấn đề thật bị giấu đi vì dev phục vụ mọi thứ từ bộ nhớ. Hãy đo trên bản đã build, mọi lần, và coi dev server thuần tuý là chỗ để viết mã.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Tối ưu hoá</span><span class="lc-sub">Danh sách đầy đủ các phép tối ưu có sẵn, trước khi bạn tự thêm cái nào.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/lighthouse-performance" target="_blank" rel="noopener">
  <span class="lc-ico">🔦</span>
  <span class="lc-body"><span class="lc-title">web.dev — Hiệu năng trong Lighthouse</span><span class="lc-sub">Từng điểm số được tính ra sao, để bạn biết một con số đang nói gì.</span></span>
</a>


<h3>🔬 Đo thật: một bài blog bình thường, đo ba cách (Next.js 16.4.6 · next start · Chromium · Lighthouse 12.8.2)</h3>
<p>Trang lab <code>/cham</code> có một tấm ảnh tải thẳng từ máy ảnh (4000 × 3000) và một component client nhỏ import <code>highlight.js</code> để tô màu một dòng. Không có gì trông sai — biên dịch và build đều được. <strong>1 · Tab Network, sắp theo cỡ:</strong></p>
<div class="out">image       4,441 KB  /dalat.jpg
script        945 KB  /_next/static/chunks/1-xtdrpu9zrnc.js
script        224 KB  /_next/static/chunks/092r-mewpaf3q.js
script        177 KB  /_next/static/chunks/395glp5--7qza.js
font           29 KB  /_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.wof</div>
<p><strong>2 · Con số của chính bản build.</strong> <code>next build</code> ở Next.js 16 chỉ in bảng route — không có cột kích thước:</p>
<div class="out">$ npm run build 2&gt;&amp;1 | grep -vE '^$|^&gt; |Collecting|Generating|Finalizing|Creating an optimized|Running TypeScript|Linting' | sed 's/^[┌├└] //'
▲ Next.js 16.4.6 (Turbopack)
✓ Running next.config.ts took 19ms
✓ Compiled successfully in 4.1s
  Finished TypeScript in 1331ms ...
Route (app)
○ /
○ /_not-found
ƒ /api/dem
ƒ /api/login
ƒ /api/logout
ƒ /api/me
ƒ /api/posts
ƒ /api/posts/[id]
ƒ /api/steal
○ /cham
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand</div>
<div class="out">$ node -e "…route-bundle-stats.json…"   # First Load JS per route, uncompressed + gzip
/cham   1392 KB JS · gzip 434 KB · 6 chunks
/        462 KB JS · gzip 137 KB · 6 chunks</div>
<div class="callout warn"><p>Nhiều bài hướng dẫn (và bài này, trước đây) bảo “đọc First Load JS trong output build”. Next.js 16 với Turbopack chỉ in ○ tĩnh / ƒ động; kích thước từng route nằm trong <code>.next/diagnostics/route-bundle-stats.json</code> (<code>firstLoadUncompressedJsBytes</code>). Ở đây <code>/cham</code> gửi JavaScript gấp ba trang khởi đầu.</p></div>
<p><strong>3 · Lighthouse trên bản build</strong> (giả lập điện thoại tầm trung, 4G chậm) — nó gọi tên thủ phạm:</p>
<div class="out">$ npx lighthouse http://localhost:3000/cham --only-categories=performance   # next start
Performance 53/100 (mobile, Lighthouse 12.8.2)
FCP 0.8 s · LCP 26.1 s · TBT 980 ms · CLS 0
Total size was 4,940 KiB
  ▸ Improve image delivery — Est savings of 4,416 KiB
  ▸ Reduce unused JavaScript — Est savings of 53 KiB
  ▸ Render blocking requests — Est savings of 130 ms</div>
<p><strong>Cùng trang trên <code>next dev</code></strong> — cùng mã, cùng máy:</p>
<div class="out">next start ⇒ JS 6 files · 435 KB gzip · 1,392 KB unpacked · first click 96 ms
next dev   ⇒ JS 21 files · 1,206 KB gzip · 5,281 KB unpacked · first click 152 ms</div>
<div class="out">$ npx lighthouse http://localhost:3001/cham --only-categories=performance   # next dev (same code)
Performance 51/100 (mobile, Lighthouse 12.8.2)
FCP 0.8 s · LCP 28.8 s · TBT 1,230 ms · CLS 0
Total size was 5,714 KiB
  ▸ Improve image delivery — Est savings of 4,416 KiB
  ▸ Reduce JavaScript execution time — 1.7 s
  ▸ Reduce unused JavaScript — Est savings of 324 KiB
  ▸ Render blocking requests — Est savings of 140 ms</div>
<div class="note-ct"><strong>cuongthai.com, đo cùng cách (máy Mac của khoá, một lần)</strong><div class="out">$ npx lighthouse https://cuongthai.com/courses/nextjs --only-categories=performance
Performance 47/100 (mobile, Lighthouse 12.8.2)
FCP 1.7 s · LCP 11.2 s · TBT 1,200 ms · CLS 0
Total size was 1,798 KiB
  ▸ Improve image delivery — Est savings of 247 KiB
  ▸ Reduce JavaScript execution time — 1.8 s
  ▸ Reduce unused JavaScript — Est savings of 356 KiB
  ▸ Render blocking requests — Est savings of 380 ms</div>Trên trang thật, các mục đầu là thời gian chạy JavaScript và JavaScript không dùng tới, không phải một tấm ảnh. Lighthouse nhích vài điểm giữa các lần chạy — hãy so trước và sau trên cùng một máy.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build
node -e "for (const r of require('./.next/diagnostics/route-bundle-stats.json')) console.log(r.route, Math.round(r.firstLoadUncompressedJsBytes / 1024) + ' KB')"
npx next start -p 3000
<span class="tok-comment"># DevTools → Network → Disable cache → tải lại → bấm cột “Size”</span>
npx lighthouse http://localhost:3000/your-page --only-categories=performance
<span class="tok-comment"># rồi cùng trang trên &#96;npx next dev -p 3001&#96; — so sánh, đừng bao giờ tối ưu theo nó</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Đọc blog bằng 4G ở trạm xe buýt: một tấm ảnh 4,441 KB là nhiều giây khoảng trắng, và người đọc bỏ đi trước khi nó tới.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Bạn tối ưu mà không đo? Cả buổi chiều bọc memo cho component — trong khi chi phí thật là một tấm ảnh.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Trang nặng dễ bị đánh: một con bot tải tệp to nhất của bạn liên tục, đốt tiền băng thông và làm chậm người dùng thật.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Đo mỗi lần phát hành (Lighthouse + route-bundle-stats.json), đặt ngân sách (vd. KB JavaScript mỗi route), và để CI báo đỏ khi vượt.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-5-core-web-vitals" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.5 — Core Web Vitals</span><span class="lc-sub">Bảng điểm mà chương này cải thiện</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-5-dat-ranh-gioi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.5 — Đặt ranh giới client ở đâu</span><span class="lc-sub">Bundle nhỏ ngay từ thiết kế</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-2-next-image" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.2 — Component Image</span><span class="lc-sub">Sửa đúng tấm ảnh tìm thấy ở đây</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>next build</code> và đọc <code>firstLoadUncompressedJsBytes</code> từng route trong <code>.next/diagnostics/route-bundle-stats.json</code>; tìm route nặng nhất.</li>
<li>Mở panel Performance của trình duyệt, ghi một lần tải, và chỉ ra chi phí lớn nhất (JS, ảnh, font, dữ liệu).</li>
<li>Ghi lại một chỉ số bạn sẽ cố cải thiện trước khi sửa code nào.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đo được một trang tốn thời gian ở đâu trước khi tối ưu bất cứ gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đo trước</span><span class="v">Tìm chi phí thật trước khi tối ưu.</span></div>
  <div class="kv"><span class="k">First Load JS</span><span class="v">JavaScript một route gửi lúc tải đầu (Next.js 16: <code>.next/diagnostics/route-bundle-stats.json</code>).</span></div>
  <div class="kv"><span class="k">Nút cổ chai</span><span class="v">Một thứ chiếm phần lớn thời gian tải.</span></div>
  <div class="kv"><span class="k">Panel Performance</span><span class="v">Tab DevTools trình duyệt để đo thời gian một lần tải.</span></div>
  <div class="kv"><span class="k">Bundle analyzer</span><span class="v">Công cụ cho thấy có gì trong bundle JS.</span></div>
  <div class="kv"><span class="k">Ngân sách (budget)</span><span class="v">Một con số mục tiêu bạn tối ưu hướng tới.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Đo trước khi tối ưu: đọc JavaScript từng route (route-bundle-stats.json ở Next.js 16) và profile một lần tải thật.</li><li>Tìm chi phí lớn nhất — JS, một ảnh, một font, hay dữ liệu chậm — trước khi chạm code.</li><li>Đoán mò phí công; panel Performance và bundle analyzer chỉ bạn sự thật.</li><li>Đặt một chỉ số mục tiêu và tối ưu hướng tới nó.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Optimizing</span><span class="lc-sub">Ảnh, font, script, lazy load, và analytics — toàn bộ đồ nghề.</span></span>
</a>
<a class="link-card dl" href="https://developer.chrome.com/docs/lighthouse/overview" target="_blank" rel="noopener">
  <span class="lc-ico">🔦</span>
  <span class="lc-body"><span class="lc-title">Chrome — Lighthouse</span><span class="lc-sub">Chấm một trang và nhận danh sách ưu tiên cần sửa.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 18.2 ─────────────────────────── */
    {
      title: '18.2 — The Image component: fast pictures for free|||18.2 — Component Image: ảnh nhanh, miễn phí',
      slug: 'nextjs-18-2-next-image',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Dùng <Image> của next/image thay <img>: Next tự thu nhỏ đúng kích thước màn, đổi sang định dạng nhẹ (WebP/AVIF), tải lười (lazy), và giữ chỗ để trang không nhảy (CLS). Một đổi nhỏ, thắng lớn.',
      content: `
${G18_2}
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.2</span>
<h2>Swap &lt;img&gt; for &lt;Image&gt; and pictures optimise themselves</h2>
<p class="lead">Images are usually the heaviest thing on a page. Next.js ships an <code>&lt;Image&gt;</code> component that does the optimisation work for you — you write one tag and get several wins automatically.</p>

<pre><code class="language-javascript">import Image from 'next/image';

&lt;Image src="/hero.jpg" alt="Course hero" width={1200} height={630} /&gt;</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Right-sized</span><span class="v">It serves a small version to phones and a larger one to desktops, instead of sending one huge file to everyone — <strong>if you add <code>sizes</code></strong> to an image wider than the screen. Measured: without it, a 4000-px photo had a single candidate (w=3840) and a phone downloaded 694 KB; with it, 191 KB.</span></div>
  <div class="kv"><span class="k">Modern formats</span><span class="v">It re-encodes to <strong>WebP</strong> when the browser supports it — often a fraction of the original size. AVIF is <em>not</em> on by default: add <code>images.formats: [&#39;image/avif&#39;, &#39;image/webp&#39;]</code>.</span></div>
  <div class="kv"><span class="k">Lazy loading</span><span class="v">Images far down the page are not downloaded until you scroll near them. "Lazy load" = load only when needed. Less to fetch up front.</span></div>
  <div class="kv"><span class="k">No layout shift</span><span class="v">Because you give <code>width</code> and <code>height</code>, the browser reserves the exact space before the image loads — so content does not jump (that is the CLS metric from Chapter 17).</span></div>
</div>

<h3>Why width and height are required</h3>
<p>They are not the display size — they tell the browser the image's <em>aspect ratio</em> so it can hold the right amount of space while the image downloads. Reserve the space up front and nothing below it shifts when the picture pops in. (Use <code>fill</code> for images that should stretch to a container instead.)</p>

<div class="callout warn">
<p><strong>One config step for external images.</strong> If your image lives on another domain (a CDN, an image host), Next requires you to allow that domain in <code>next.config.js</code> under <code>images.remotePatterns</code> — a safety measure so your server does not optimise arbitrary URLs. Forgetting it gives a clear "hostname is not configured" error <strong>only in <code>next dev</code></strong>. Measured: <code>next build</code> stays green, and in production the image request gets <code>400 "url" parameter is not allowed</code> — a broken image and no error in your logs. Test remote images in dev, then add the domain.</p>
</div>

<div class="callout ok">
<p><strong>The payoff is real:</strong> replacing raw <code>&lt;img&gt;</code> tags with <code>&lt;Image&gt;</code> routinely cuts image bytes by large margins (the video shows a 99% reduction on one file; measured in this lesson: 4,441 KB → 191 KB on a phone, about 96% less — with <code>sizes</code>) and fixes layout shift at the same time. For most sites, images are the single biggest performance lever — and this is the lowest-effort way to pull it.</p>
</div>

<h3>What next/image does that an img tag does not</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Serves a modern format</b> — WebP by default (AVIF only if listed in <code>images.formats</code>), from the same source file. Usually 30–50% smaller for the same quality.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Resizes per device</b> — One source, several widths, and a &#96;srcset&#96; so a phone does not download a 2000px image — as long as &#96;sizes&#96; says how wide the image is on screen.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Reserves the space</b> — Width and height are required, which is what prevents the layout shift that dominates CLS.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Lazy-loads below the fold</b> — And lets you opt the hero image out with &#96;preload&#96; (Next.js 16; the older &#96;priority&#96; prop is deprecated), which is the one image that should load first.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — &#96;preload&#96; (formerly &#96;priority&#96;) on every image, which is the same as on none.</strong> Measured on slow 4G: preload on the hero only, it arrived at 3,768 ms; preload on all twelve, 5,824 ms. The flag tells the browser to preload that image ahead of other resources. Marking one hero image speeds up LCP; marking twelve makes the browser fetch twelve large files at once on a connection that can carry perhaps two — so everything, including the hero, arrives later than it would have. The Lighthouse warning about too many preloads is easy to miss because each individual &#96;priority&#96; looks harmless. One per screen, on the image that is actually the largest contentful paint, and everything below the fold stays lazy.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/components/image" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Image component</span><span class="lc-sub">Every prop, including sizes, fill, placeholder and the remote-pattern config.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/optimize-lcp" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">web.dev — Optimize LCP</span><span class="lc-sub">Why preloading the right image helps and preloading many hurts.</span></span>
</a>


<h3>🔬 Measured: the camera photo from 18.1, three ways, on a phone (Next.js 16.4.6 · next start · Chromium 640×400, DPR 2)</h3>
<div class="out">&lt;img&gt;               ⇒ /dalat.jpg · image/jpeg · 4,441 KB · on screen 608×456 px
&lt;Image&gt; (no sizes)  ⇒ /_next/image?url=/dalat.jpg&amp;w=3840&amp;q=75 · image/webp · 694 KB · on screen 608×456 px
&lt;Image sizes=…&gt;     ⇒ /_next/image?url=/dalat.jpg&amp;w=1920&amp;q=75 · image/webp · 191 KB · on screen 608×456 px</div>
<p>Why the middle one is still big — the real HTML:</p>
<div class="out">$ curl -s http://127.0.0.1:19326/anh/next | grep -o '&lt;img[^&gt;]*id="hero"[^&gt;]*&gt;' | grep -oE '(loading|srcSet|sizes)="[^"]*"' | sed 's/&amp;/\\&amp;/g; s/, \\//,\\n        \\//g'
loading="lazy"
srcSet="/_next/image?url=%2Fdalat.jpg&amp;w=3840&amp;q=75 1x"
$ curl -s http://127.0.0.1:19326/anh/sizes | grep -o '&lt;img[^&gt;]*id="hero"[^&gt;]*&gt;' | grep -oE '(loading|srcSet|sizes)="[^"]*"' | sed 's/&amp;/\\&amp;/g; s/, \\//,\\n        \\//g'
loading="lazy"
sizes="(max-width: 672px) 100vw, 672px"
srcSet="/_next/image?url=%2Fdalat.jpg&amp;w=640&amp;q=75 640w,
        /_next/image?url=%2Fdalat.jpg&amp;w=750&amp;q=75 750w,
        /_next/image?url=%2Fdalat.jpg&amp;w=828&amp;q=75 828w,
        /_next/image?url=%2Fdalat.jpg&amp;w=1080&amp;q=75 1080w,
        /_next/image?url=%2Fdalat.jpg&amp;w=1200&amp;q=75 1200w,
        /_next/image?url=%2Fdalat.jpg&amp;w=1920&amp;q=75 1920w,
        /_next/image?url=%2Fdalat.jpg&amp;w=2048&amp;q=75 2048w,
        /_next/image?url=%2Fdalat.jpg&amp;w=3840&amp;q=75 3840w"</div>
<div class="callout warn"><p><code>width</code>/<code>height</code> describe the <em>file</em>, not the screen. Without <code>sizes</code>, Next.js assumes the image is shown at its full width and offers 1x/2x candidates (capped at 3840) — so a phone downloads the 3840-px version. With <code>sizes</code>, it offers eight widths and the browser picks the smallest that fits.</p></div>
<p><strong>What the server does</strong> — first request resizes and re-encodes (MISS), then serves from <code>.next/cache/images</code> (HIT); AVIF only if configured:</p>
<div class="out">$ for i in 1 2; do curl -s -o /dev/null -w '…' "localhost:3000/_next/image?url=/dalat.jpg&amp;w=750&amp;q=75" -H 'accept: image/webp'; done
200 · 37374 B · 0.175936s · image/webp · X-Nextjs-Cache: MISS
200 · 37374 B · 0.011407s · image/webp · X-Nextjs-Cache: HIT
$ curl -s -o /dev/null -w "%{http_code} · %{size_download} B\\n" "http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&amp;w=750&amp;q=75" -H 'accept: image/avif,image/webp,*/*'; curl -s -o /dev/null -w "%{http_code} · %{content_type}\\n" "http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&amp;w=750&amp;q=75" -H 'accept: image/avif,*/*'
200 · 37374 B
200 · image/jpeg</div>
<p><strong>Lazy loading</strong> — six photos down a long page:</p>
<div class="out">&lt;img&gt; × 6   ⇒ 6 photo requests · 26,646 KB
&lt;Image&gt; × 6 ⇒ 3 photo requests · 85 KB
&lt;Image&gt; × 6 ⇒ 5 photo requests · 142 KB (after scrolling straight to the end)</div>
<p>“Lazy” is not “only what is visible”: Chrome starts lazy images a little before they reach the screen, so the next one is ready.</p>
<p><strong>preload</strong> — Next.js 16 marks <code>priority</code> as <code>@deprecated Use &#96;preload&#96; prop instead</code>. One preload vs twelve, on a simulated slow 4G line:</p>
<div class="out">preload on the hero only ⇒ hero downloaded at 3,768 ms · 2 other images sharing the line (382 KB)
preload on all 12       ⇒ hero downloaded at 5,824 ms · 11 other images sharing the line (2,098 KB)</div>
<p><strong>A photo from another host, without <code>remotePatterns</code></strong>:</p>
<div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|/anh/xa|rror' | sed 's/^[┌├└] //'
✓ Compiled successfully in 498ms
○ /anh/xa
$ curl -s http://127.0.0.1:19326/anh/xa | grep -o 'src="/_next/image[^"]*"' | head -1
src="/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1528127269322-539801943592&amp;w=3840&amp;q=75"
$ curl -s -w " · HTTP %{http_code}\\n" "http://127.0.0.1:19326/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1528127269322-539801943592&amp;w=3840&amp;q=75"
"url" parameter is not allowed · HTTP 400
$ curl -s --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null -w 'next dev /anh/xa → HTTP %{http_code}\\n' http://127.0.0.1:19327/anh/xa
next dev /anh/xa → HTTP 500
$ grep -o 'Invalid src prop[^,]*,[^&#96;]*' &lt;log next dev&gt;
Invalid src prop (https://images.unsplash.com/photo-1528127269322-539801943592) on &#96;next/image&#96;, hostname "images.unsplash.com" is not configured under images in your &#96;next.config.js&#96;</div>
<p><strong>The guard rails</strong> — values Next.js did not offer are refused, so your server is not an open image proxy or a CPU furnace:</p>
<div class="out">$ curl -s -w " · HTTP %{http_code}\\n" "http://127.0.0.1:19326/_next/image?url=https%3A%2F%2Fevil.example%2Fx.png&amp;w=750&amp;q=75"
"url" parameter is not allowed · HTTP 400
$ curl -s -w " · HTTP %{http_code}\\n" "http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&amp;w=751&amp;q=75"
"w" parameter (width) of 751 is not allowed · HTTP 400
$ curl -s -w " · HTTP %{http_code}\\n" "http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&amp;w=750&amp;q=100"
"q" parameter (quality) of 100 is not allowed · HTTP 400</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -n "unoptimized" next.config.js
39:    unoptimized: true,
63:    // the user picks a song. &#96;unoptimized: true&#96; above already
$ grep -rln "next/image" src | wc -l | sed 's/^ */tệp import next\\/image: /'
tệp import next/image: 31
$ curl -s https://cuongthai.com/ -A Mozilla/5.0 | grep -o '/_next/image' | wc -l | sed 's/^ */cuongthai.com: số lần \\/_next\\/image trong HTML: /'
cuongthai.com: số lần /_next/image trong HTML: 0
$ curl -s https://cuongthai.com/ -A Mozilla/5.0 | grep -o '&lt;img[^&gt;]*data-nimg[^&gt;]*&gt;' | grep -o 'src="[^"]*"' | head -2 | sed 's/^/&lt;Image&gt; (data-nimg) ⇒ /'
&lt;Image&gt; (data-nimg) ⇒ src="/playground/social/share-image.png"</div>cuongthai.com sets <code>images.unoptimized: true</code> (since 09/06/2026): every <code>&lt;Image&gt;</code> renders a plain <code>&lt;img&gt;</code> to the original file — reserved space and lazy loading, but no resizing and no WebP. The commit does not give a reason; resizing on a small server costs CPU, so the usual alternatives are resizing at upload time or a CDN image service via a custom <code>loader</code>.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># a big photo in public/, then three pages: &lt;img&gt;, &lt;Image width height&gt;, &lt;Image … sizes="(max-width: 672px) 100vw, 672px"&gt;</span>
npm run build &amp;&amp; npx next start -p 3000
curl -s localhost:3000/your-page | grep -o 'srcSet="[^"]*"'
<span class="tok-comment"># DevTools → device toolbar (phone) → Network → Img: which w= and how many KB?</span>
curl -s -o /dev/null -w "%{http_code} %{content_type}\\n" "localhost:3000/_next/image?url=%2Fphoto.jpg&amp;w=750&amp;q=75" -H "accept: image/webp"
curl -s "localhost:3000/_next/image?url=%2Fphoto.jpg&amp;w=751&amp;q=75" <span class="tok-comment">  # → 400: width not allowed</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">You send a 4 MB photo on Zalo or Messenger; the other person receives a much smaller one. Your site should do the same: <code>&lt;Image&gt;</code> + <code>sizes</code>.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">You forget <code>sizes</code>? The phone still downloads w=3840 (694 KB instead of 191 KB) — no error, no warning.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">An open image proxy is a gift: resize any URL at any width, for free, on your CPU — or reach hosts behind your firewall. Next.js refuses unknown url / w / q with 400.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Keep <code>remotePatterns</code> tight (no <code>**</code>), add <code>sizes</code> to every wide image, and check in DevTools which width the phone actually downloaded.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-1-do-truoc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.1 — Measure first</span><span class="lc-sub">Where this photo was found</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-5-core-web-vitals" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.5 — Core Web Vitals</span><span class="lc-sub">Why width/height stop layout shift</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-7-2-thumbnail-explosion" target="_blank" rel="noopener"><span class="lc-ico">🗄️</span><span class="lc-body"><span class="lc-title">Object Storage · 7.2 — The thumbnail explosion</span><span class="lc-sub">Resizing at upload time, and what it costs</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Replace an <code>&lt;img&gt;</code> with <code>next/image</code>, giving <code>width</code>/<code>height</code> (or <code>fill</code>) and <code>alt</code>; compare the delivered format and size.</li>
<li>Add <code>priority</code> to the LCP image and <code>sizes</code> for responsive loading.</li>
<li>Observe the reserved space prevents layout shift (CLS).</li>
</ol>
<p><strong>Done when:</strong> you can use <code>next/image</code> for optimised, shift-free images.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">next/image</span><span class="v">Next's image component with automatic optimisation.</span></div>
  <div class="kv"><span class="k">width/height/fill</span><span class="v">Dimensions that reserve space and prevent CLS.</span></div>
  <div class="kv"><span class="k">Modern formats</span><span class="v">Serves WebP/AVIF and resizes automatically.</span></div>
  <div class="kv"><span class="k">priority</span><span class="v">Preload the above-the-fold LCP image.</span></div>
  <div class="kv"><span class="k">sizes</span><span class="v">Tell the browser which image size to pick at each breakpoint.</span></div>
  <div class="kv"><span class="k">Lazy loading</span><span class="v">Off-screen images load only when needed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>next/image</code> serves modern formats, resizes, and lazy-loads images for free.</li><li>Giving <code>width</code>/<code>height</code> (or <code>fill</code>) reserves space and prevents layout shift.</li><li>Mark the LCP image <code>priority</code> and set <code>sizes</code> for responsive loading.</li><li>Always set <code>alt</code> for accessibility.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/images" target="_blank" rel="noopener">
  <span class="lc-ico">🏞️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Image Optimization</span><span class="lc-sub">The Image component, sizing, fill, priority, and remotePatterns.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.2</span>
<h2>Đổi &lt;img&gt; sang &lt;Image&gt; và ảnh tự tối ưu</h2>
<p class="lead">Ảnh thường là thứ nặng nhất trên một trang. Next.js kèm một component <code>&lt;Image&gt;</code> làm việc tối ưu giúp bạn — bạn viết một thẻ và nhận nhiều thắng lợi tự động.</p>

<pre><code class="language-javascript">import Image from 'next/image';

&lt;Image src="/hero.jpg" alt="Ảnh bìa khoá" width={1200} height={630} /&gt;</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Đúng kích thước</span><span class="v">Nó dọn một bản nhỏ cho điện thoại và một bản lớn hơn cho desktop, thay vì gửi một file khổng lồ cho mọi người — <strong>nếu bạn thêm <code>sizes</code></strong> cho ảnh rộng hơn màn hình. Đo thật: thiếu nó, ảnh 4000 px chỉ có một ứng viên (w=3840) và điện thoại tải 694 KB; có nó, 191 KB.</span></div>
  <div class="kv"><span class="k">Định dạng hiện đại</span><span class="v">Nó mã hoá lại sang <strong>WebP</strong> khi trình duyệt hỗ trợ — thường bằng một phần nhỏ kích thước gốc. AVIF <em>không</em> bật mặc định: thêm <code>images.formats: [&#39;image/avif&#39;, &#39;image/webp&#39;]</code>.</span></div>
  <div class="kv"><span class="k">Tải lười (lazy)</span><span class="v">Ảnh ở xa dưới trang không tải cho tới khi bạn cuộn gần chúng. "Lazy load" = chỉ tải khi cần. Ít thứ phải fetch lúc đầu.</span></div>
  <div class="kv"><span class="k">Không nhảy layout</span><span class="v">Vì bạn cho <code>width</code> và <code>height</code>, trình duyệt giữ đúng chỗ trước khi ảnh tải — nên nội dung không nhảy (đó là chỉ số CLS ở Chương 17).</span></div>
</div>

<h3>Vì sao width và height là bắt buộc</h3>
<p>Chúng không phải kích thước hiển thị — chúng nói cho trình duyệt biết <em>tỷ lệ</em> của ảnh để giữ đúng lượng chỗ trong lúc ảnh tải. Giữ chỗ trước thì không gì bên dưới nhảy khi ảnh hiện ra. (Dùng <code>fill</code> cho ảnh nên co giãn theo một container.)</p>

<div class="callout warn">
<p><strong>Một bước cấu hình cho ảnh ngoài.</strong> Nếu ảnh của bạn ở một domain khác (một CDN, một host ảnh), Next yêu cầu bạn cho phép domain đó trong <code>next.config.js</code> dưới <code>images.remotePatterns</code> — một biện pháp an toàn để server bạn không tối ưu URL tuỳ tiện. Quên nó thì lỗi rõ ràng "hostname is not configured" <strong>chỉ hiện ở <code>next dev</code></strong>. Đo thật: <code>next build</code> vẫn xanh, còn trên production yêu cầu ảnh bị trả <code>400 "url" parameter is not allowed</code> — ảnh vỡ và log không có lỗi nào. Hãy thử ảnh từ xa ở dev, rồi thêm domain.</p>
</div>

<div class="callout ok">
<p><strong>Phần thưởng có thật:</strong> thay các thẻ <code>&lt;img&gt;</code> trần bằng <code>&lt;Image&gt;</code> thường cắt bytes ảnh rất nhiều (video cho thấy giảm 99% trên một file; đo trong bài này: 4,441 KB → 191 KB trên điện thoại, giảm khoảng 96% — khi có <code>sizes</code>) và sửa layout shift cùng lúc. Với đa số site, ảnh là đòn bẩy hiệu năng lớn nhất — và đây là cách tốn ít công nhất để kéo nó.</p>
</div>

<h3>next/image làm gì mà thẻ img không làm</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Phục vụ định dạng hiện đại</b> — WebP theo mặc định (AVIF chỉ khi khai trong <code>images.formats</code>), từ cùng một file gốc. Thường nhỏ hơn 30–50% với cùng chất lượng.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Đổi cỡ theo từng thiết bị</b> — Một file gốc, nhiều chiều rộng, và một &#96;srcset&#96; để điện thoại không phải tải một tấm ảnh 2000px — miễn là &#96;sizes&#96; nói ảnh rộng bao nhiêu trên màn hình.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Giữ chỗ sẵn</b> — Chiều rộng và chiều cao là bắt buộc, và chính điều đó ngăn cú xê dịch bố cục vốn chi phối CLS.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Tải lười phần dưới màn hình</b> — Và cho bạn loại tấm ảnh chính ra khỏi phép tải lười bằng &#96;preload&#96; (Next.js 16; prop &#96;priority&#96; cũ đã bị đánh dấu lỗi thời), đó là tấm duy nhất nên tải trước.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — đặt &#96;preload&#96; (trước là &#96;priority&#96;) cho mọi tấm ảnh, cũng như không đặt cho tấm nào.</strong> Đo trên 4G chậm: preload chỉ ảnh chính, nó tới lúc 3,768 ms; preload cả mười hai, 5,824 ms. Cờ này bảo trình duyệt nạp trước tấm ảnh đó, ưu tiên hơn các tài nguyên khác. Đánh dấu một tấm ảnh chính thì tăng tốc LCP; đánh dấu mười hai tấm thì bắt trình duyệt lấy mười hai file lớn cùng lúc trên một đường truyền tải nổi chừng hai — nên mọi thứ, kể cả tấm ảnh chính, về muộn hơn so với khi không đánh dấu. Cảnh báo của Lighthouse về việc nạp trước quá nhiều rất dễ bỏ sót vì mỗi cái &#96;priority&#96; riêng lẻ trông đều vô hại. Một tấm mỗi màn hình, đặt lên đúng tấm thật sự là lần vẽ nội dung lớn nhất, còn mọi thứ dưới màn hình thì cứ để tải lười.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/components/image" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Component Image</span><span class="lc-sub">Mọi prop, gồm cả sizes, fill, placeholder và cấu hình remote-pattern.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/optimize-lcp" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">web.dev — Tối ưu LCP</span><span class="lc-sub">Vì sao nạp trước đúng tấm ảnh thì giúp ích còn nạp trước nhiều tấm thì có hại.</span></span>
</a>


<h3>🔬 Đo thật: tấm ảnh máy ảnh của 18.1, ba cách, trên điện thoại (Next.js 16.4.6 · next start · Chromium 640×400, DPR 2)</h3>
<div class="out">&lt;img&gt;               ⇒ /dalat.jpg · image/jpeg · 4,441 KB · on screen 608×456 px
&lt;Image&gt; (no sizes)  ⇒ /_next/image?url=/dalat.jpg&amp;w=3840&amp;q=75 · image/webp · 694 KB · on screen 608×456 px
&lt;Image sizes=…&gt;     ⇒ /_next/image?url=/dalat.jpg&amp;w=1920&amp;q=75 · image/webp · 191 KB · on screen 608×456 px</div>
<p>Vì sao bản giữa vẫn to — HTML thật:</p>
<div class="out">$ curl -s http://127.0.0.1:19326/anh/next | grep -o '&lt;img[^&gt;]*id="hero"[^&gt;]*&gt;' | grep -oE '(loading|srcSet|sizes)="[^"]*"' | sed 's/&amp;/\\&amp;/g; s/, \\//,\\n        \\//g'
loading="lazy"
srcSet="/_next/image?url=%2Fdalat.jpg&amp;w=3840&amp;q=75 1x"
$ curl -s http://127.0.0.1:19326/anh/sizes | grep -o '&lt;img[^&gt;]*id="hero"[^&gt;]*&gt;' | grep -oE '(loading|srcSet|sizes)="[^"]*"' | sed 's/&amp;/\\&amp;/g; s/, \\//,\\n        \\//g'
loading="lazy"
sizes="(max-width: 672px) 100vw, 672px"
srcSet="/_next/image?url=%2Fdalat.jpg&amp;w=640&amp;q=75 640w,
        /_next/image?url=%2Fdalat.jpg&amp;w=750&amp;q=75 750w,
        /_next/image?url=%2Fdalat.jpg&amp;w=828&amp;q=75 828w,
        /_next/image?url=%2Fdalat.jpg&amp;w=1080&amp;q=75 1080w,
        /_next/image?url=%2Fdalat.jpg&amp;w=1200&amp;q=75 1200w,
        /_next/image?url=%2Fdalat.jpg&amp;w=1920&amp;q=75 1920w,
        /_next/image?url=%2Fdalat.jpg&amp;w=2048&amp;q=75 2048w,
        /_next/image?url=%2Fdalat.jpg&amp;w=3840&amp;q=75 3840w"</div>
<div class="callout warn"><p><code>width</code>/<code>height</code> mô tả <em>tệp ảnh</em>, không mô tả màn hình. Thiếu <code>sizes</code>, Next.js coi như ảnh hiện đúng bề rộng gốc và chỉ đưa ứng viên 1x/2x (trần 3840) — nên điện thoại tải bản 3840 px. Có <code>sizes</code>, nó đưa tám bề rộng và trình duyệt chọn bản nhỏ nhất vừa đủ.</p></div>
<p><strong>Máy chủ làm gì</strong> — lần gọi đầu thu nhỏ và mã hoá lại (MISS), sau đó phục vụ từ <code>.next/cache/images</code> (HIT); AVIF chỉ khi được cấu hình:</p>
<div class="out">$ for i in 1 2; do curl -s -o /dev/null -w '…' "localhost:3000/_next/image?url=/dalat.jpg&amp;w=750&amp;q=75" -H 'accept: image/webp'; done
200 · 37374 B · 0.175936s · image/webp · X-Nextjs-Cache: MISS
200 · 37374 B · 0.011407s · image/webp · X-Nextjs-Cache: HIT
$ curl -s -o /dev/null -w "%{http_code} · %{size_download} B\\n" "http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&amp;w=750&amp;q=75" -H 'accept: image/avif,image/webp,*/*'; curl -s -o /dev/null -w "%{http_code} · %{content_type}\\n" "http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&amp;w=750&amp;q=75" -H 'accept: image/avif,*/*'
200 · 37374 B
200 · image/jpeg</div>
<p><strong>Tải lười</strong> — sáu tấm ảnh dọc một trang dài:</p>
<div class="out">&lt;img&gt; × 6   ⇒ 6 photo requests · 26,646 KB
&lt;Image&gt; × 6 ⇒ 3 photo requests · 85 KB
&lt;Image&gt; × 6 ⇒ 5 photo requests · 142 KB (after scrolling straight to the end)</div>
<p>“Lười” không có nghĩa là “chỉ cái đang thấy”: Chrome bắt đầu tải ảnh lười một chút trước khi nó tới màn hình, để ảnh kế tiếp sẵn sàng.</p>
<p><strong>preload</strong> — Next.js 16 đánh dấu <code>priority</code> là <code>@deprecated Use &#96;preload&#96; prop instead</code>. Một preload so với mười hai, trên đường 4G chậm giả lập:</p>
<div class="out">preload on the hero only ⇒ hero downloaded at 3,768 ms · 2 other images sharing the line (382 KB)
preload on all 12       ⇒ hero downloaded at 5,824 ms · 11 other images sharing the line (2,098 KB)</div>
<p><strong>Ảnh từ máy chủ khác, không có <code>remotePatterns</code></strong>:</p>
<div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|/anh/xa|rror' | sed 's/^[┌├└] //'
✓ Compiled successfully in 498ms
○ /anh/xa
$ curl -s http://127.0.0.1:19326/anh/xa | grep -o 'src="/_next/image[^"]*"' | head -1
src="/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1528127269322-539801943592&amp;w=3840&amp;q=75"
$ curl -s -w " · HTTP %{http_code}\\n" "http://127.0.0.1:19326/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1528127269322-539801943592&amp;w=3840&amp;q=75"
"url" parameter is not allowed · HTTP 400
$ curl -s --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null -w 'next dev /anh/xa → HTTP %{http_code}\\n' http://127.0.0.1:19327/anh/xa
next dev /anh/xa → HTTP 500
$ grep -o 'Invalid src prop[^,]*,[^&#96;]*' &lt;log next dev&gt;
Invalid src prop (https://images.unsplash.com/photo-1528127269322-539801943592) on &#96;next/image&#96;, hostname "images.unsplash.com" is not configured under images in your &#96;next.config.js&#96;</div>
<p><strong>Rào chắn</strong> — giá trị Next.js không đưa ra đều bị từ chối, nên máy chủ của bạn không thành máy thu nhỏ ảnh mở toang hay lò đốt CPU:</p>
<div class="out">$ curl -s -w " · HTTP %{http_code}\\n" "http://127.0.0.1:19326/_next/image?url=https%3A%2F%2Fevil.example%2Fx.png&amp;w=750&amp;q=75"
"url" parameter is not allowed · HTTP 400
$ curl -s -w " · HTTP %{http_code}\\n" "http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&amp;w=751&amp;q=75"
"w" parameter (width) of 751 is not allowed · HTTP 400
$ curl -s -w " · HTTP %{http_code}\\n" "http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&amp;w=750&amp;q=100"
"q" parameter (quality) of 100 is not allowed · HTTP 400</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -n "unoptimized" next.config.js
39:    unoptimized: true,
63:    // the user picks a song. &#96;unoptimized: true&#96; above already
$ grep -rln "next/image" src | wc -l | sed 's/^ */tệp import next\\/image: /'
tệp import next/image: 31
$ curl -s https://cuongthai.com/ -A Mozilla/5.0 | grep -o '/_next/image' | wc -l | sed 's/^ */cuongthai.com: số lần \\/_next\\/image trong HTML: /'
cuongthai.com: số lần /_next/image trong HTML: 0
$ curl -s https://cuongthai.com/ -A Mozilla/5.0 | grep -o '&lt;img[^&gt;]*data-nimg[^&gt;]*&gt;' | grep -o 'src="[^"]*"' | head -2 | sed 's/^/&lt;Image&gt; (data-nimg) ⇒ /'
&lt;Image&gt; (data-nimg) ⇒ src="/playground/social/share-image.png"</div>cuongthai.com đặt <code>images.unoptimized: true</code> (từ 09/06/2026): mọi <code>&lt;Image&gt;</code> ra một <code>&lt;img&gt;</code> trỏ thẳng tệp gốc — vẫn giữ chỗ và tải lười, nhưng không thu nhỏ, không WebP. Commit không ghi lý do; thu nhỏ trên máy chủ nhỏ tốn CPU, nên cách thay thường gặp là thu nhỏ lúc tải lên hoặc dịch vụ ảnh của CDN qua một <code>loader</code> riêng.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># một ảnh lớn trong public/, rồi ba trang: &lt;img&gt;, &lt;Image width height&gt;, &lt;Image … sizes="(max-width: 672px) 100vw, 672px"&gt;</span>
npm run build &amp;&amp; npx next start -p 3000
curl -s localhost:3000/your-page | grep -o 'srcSet="[^"]*"'
<span class="tok-comment"># DevTools → chế độ điện thoại → Network → Img: bản w= nào, bao nhiêu KB?</span>
curl -s -o /dev/null -w "%{http_code} %{content_type}\\n" "localhost:3000/_next/image?url=%2Fphoto.jpg&amp;w=750&amp;q=75" -H "accept: image/webp"
curl -s "localhost:3000/_next/image?url=%2Fphoto.jpg&amp;w=751&amp;q=75" <span class="tok-comment">  # → 400: bề rộng không được phép</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Bạn gửi ảnh 4 MB qua Zalo hay Messenger; người nhận được một bản nhỏ hơn nhiều. Trang của bạn cũng nên vậy: <code>&lt;Image&gt;</code> + <code>sizes</code>.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Bạn quên <code>sizes</code>? Điện thoại vẫn tải w=3840 (694 KB thay vì 191 KB) — không lỗi, không cảnh báo.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Một máy thu nhỏ ảnh mở toang là món quà: thu nhỏ mọi địa chỉ, mọi bề rộng, miễn phí, bằng CPU của bạn — hoặc với tới máy chủ sau tường lửa. Next.js từ chối url / w / q lạ bằng 400.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Giữ <code>remotePatterns</code> thật chặt (không <code>**</code>), thêm <code>sizes</code> cho mọi ảnh rộng, và xem trong DevTools điện thoại thật sự tải bản rộng bao nhiêu.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-1-do-truoc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.1 — Hãy đo trước</span><span class="lc-sub">Nơi tìm ra tấm ảnh này</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-5-core-web-vitals" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.5 — Core Web Vitals</span><span class="lc-sub">Vì sao width/height chặn xô lệch</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-7-2-thumbnail-explosion" target="_blank" rel="noopener"><span class="lc-ico">🗄️</span><span class="lc-body"><span class="lc-title">Object Storage · 7.2 — Vụ nổ thumbnail</span><span class="lc-sub">Thu nhỏ lúc tải lên, và cái giá của nó</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thay một <code>&lt;img&gt;</code> bằng <code>next/image</code>, cho <code>width</code>/<code>height</code> (hoặc <code>fill</code>) và <code>alt</code>; so định dạng và size được phục vụ.</li>
<li>Thêm <code>priority</code> cho ảnh LCP và <code>sizes</code> để tải responsive.</li>
<li>Quan sát không gian được giữ chỗ ngăn layout shift (CLS).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dùng được <code>next/image</code> cho ảnh tối ưu, không nhảy bố cục.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">next/image</span><span class="v">Component ảnh của Next với tối ưu tự động.</span></div>
  <div class="kv"><span class="k">width/height/fill</span><span class="v">Kích thước giữ chỗ và ngăn CLS.</span></div>
  <div class="kv"><span class="k">Định dạng hiện đại</span><span class="v">Phục vụ WebP/AVIF và resize tự động.</span></div>
  <div class="kv"><span class="k">priority</span><span class="v">Preload ảnh LCP phía trên màn hình.</span></div>
  <div class="kv"><span class="k">sizes</span><span class="v">Báo trình duyệt chọn size ảnh nào ở mỗi breakpoint.</span></div>
  <div class="kv"><span class="k">Lazy loading</span><span class="v">Ảnh ngoài màn hình chỉ tải khi cần.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>next/image</code> phục vụ định dạng hiện đại, resize, và lazy-load ảnh miễn phí.</li><li>Cho <code>width</code>/<code>height</code> (hoặc <code>fill</code>) giữ chỗ và ngăn layout shift.</li><li>Đánh dấu ảnh LCP là <code>priority</code> và đặt <code>sizes</code> để tải responsive.</li><li>Luôn đặt <code>alt</code> cho khả năng truy cập.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/images" target="_blank" rel="noopener">
  <span class="lc-ico">🏞️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Image Optimization</span><span class="lc-sub">Component Image, kích thước, fill, priority, và remotePatterns.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 18.3 ─────────────────────────── */
    {
      title: '18.3 — Shipping less JavaScript|||18.3 — Gửi ít JavaScript hơn',
      slug: 'nextjs-18-3-it-javascript',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Bundle nhỏ = trang nhanh. Ba cách giảm: Server Component gửi zero JS (nhắc Chương 9), tải động (next/dynamic) cho phần nặng chỉ khi cần, và code splitting tự động theo route.',
      content: `
${G18_3}
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.3</span>
<h2>The less JavaScript you ship, the faster the page</h2>
<p class="lead">The bundle (from lesson 18.1) is the JavaScript the browser must download and run. Reducing it is the biggest lever for interactivity (INP). You have three tools, and you have already met the most powerful one.</p>

<h3>1 · Server Components ship zero JavaScript</h3>
<p>This is the big one, and it is a recap of Chapter 9: a Server Component runs on the server and sends only HTML — <em>none</em> of its own code goes to the browser. So the more of your UI you keep as Server Components (and the smaller you keep the <code>'use client'</code> leaves), the less JavaScript ships. Performance is one of the main reasons the App Router made server-first the default.</p>

<h3>2 · Dynamic import: load heavy parts only when needed</h3>
<p>Some client components are big and not needed immediately — a chart library, a rich text editor, a map, a modal that opens on click. <strong>Code splitting</strong> means breaking the bundle into pieces so the browser downloads a piece only when it is actually needed. Next does this per route automatically, and you can do it per component with <code>next/dynamic</code>:</p>
<pre><code class="language-typescript">import dynamic from 'next/dynamic';

<span class="tok-comment">// HeavyChart's code is NOT in the initial bundle;</span>
<span class="tok-comment">// it downloads only when this component renders</span>
const HeavyChart = dynamic(() =&gt; import('./HeavyChart'), {
  loading: () =&gt; &lt;p&gt;Loading chart…&lt;/p&gt;,
});</code></pre>
<p>Now the chart's code is split into its own file and fetched lazily. A visitor who never opens the chart never downloads it. Reach for this whenever a heavy client component is not needed on first paint. <strong>If it renders on first paint anyway, nothing is saved:</strong> measured, the route table said 451 KB but the browser downloaded 1,397 KB at load.</p>

<h3>3 · Automatic route-based splitting</h3>
<p>You get this for free: Next splits code by route, so visiting <code>/about</code> does not download the JavaScript for <code>/dashboard</code>. You only pay for the page you are on — <strong>plus what <code>&lt;Link&gt;</code> prefetches</strong>: in production, a link that scrolls into view downloads the target&#39;s JavaScript before any click (measured: 439 KB with the link in view vs 137 KB with <code>prefetch={false}</code>). Your job is mostly to avoid accidentally pulling a huge library into a shared component that every route loads.</p>

<div class="callout warn">
<p><strong>Watch the shared imports.</strong> Importing a large library into your root layout or a widely-used component puts it in <em>every</em> route's bundle. If only one page needs a heavy dependency, import it there (ideally via <code>next/dynamic</code>), not globally. A single misplaced import is a common reason a whole site's bundle balloons.</p>
</div>

<h3>Shipping less JavaScript</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Keep components on the server</b> — The largest saving available, and it costs nothing: server code is never in the bundle at all.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Import only what you use</b> — &#96;import { format } from &#39;date-fns&#39;&#96;, not the whole namespace. Check that the library supports tree shaking — many do not.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Load heavy widgets on demand</b> — &#96;next/dynamic&#96; for a chart, an editor, a map. It is not in the initial bundle and arrives when the component renders.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Look at the analyser before adding a dependency</b> — A date picker that costs 90kB is a decision, not an accident — but only if you looked.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a single import pulling an entire library into the bundle.</strong> &#96;import _ from &#39;lodash&#39;&#96; to use one function ships the whole library, because the CommonJS build cannot be tree-shaken. The same shape appears with icon packs Next.js does not optimise for you (&#96;import { Icon } from &#39;@some/icons&#39;&#96; pulling in two thousand SVGs — for packages on the built-in &#96;optimizePackageImports&#96; list such as lucide-react, one icon measured +4 KB; and a named &#96;import { debounce } from &#39;lodash&#39;&#96; is rewritten to &#96;lodash/debounce&#96; automatically, 449 KB vs 515 KB for &#96;import _&#96;), moment.js and its locales, and a UI kit imported from its root. Nothing warns you; the route just gets 200kB heavier and the build succeeds. The bundle analyser shows it in one picture — run it after adding any dependency, and prefer the per-module import path (&#96;lodash/debounce&#96;) or a smaller library.</p></div>
<a class="link-card dl" href="https://www.npmjs.com/package/@next/bundle-analyzer" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">@next/bundle-analyzer</span><span class="lc-sub">A treemap of what is actually in each bundle. Ten minutes here usually finds something.</span></span>
</a>
<a class="link-card dl" href="https://bundlephobia.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Bundlephobia</span><span class="lc-sub">The cost of a package before you install it, including whether it tree-shakes.</span></span>
</a>


<h3>🔬 Measured: one highlighter, put in different places (Next.js 16.4.6 · route-bundle-stats.json · Chromium)</h3>
<p>Every page colours one line with <code>highlight.js</code> — or does not use it at all. Sizes from <code>.next/diagnostics/route-bundle-stats.json</code>, lightest first:</p>
<div class="out">/js/goc         446 KB · gzip 132 KB
/js/server      446 KB · gzip 132 KB
/js/lodash      449 KB · gzip 133 KB
/js/lodash-le   449 KB · gzip 133 KB
/js/icon        450 KB · gzip 134 KB
/js/dynamic-ngay   451 KB · gzip 134 KB
/js/dynamic     452 KB · gzip 134 KB
/js/link        454 KB · gzip 135 KB
/js/link-off    454 KB · gzip 135 KB
/js/lodash-all   515 KB · gzip 157 KB
/js/client     1391 KB · gzip 434 KB</div>
<div class="callout ok"><p><code>/js/server</code> uses the highlighter in a Server Component: <strong>446 KB, the same as the page with no library</strong>. <code>/js/client</code> does the same work on the client: +945 KB.</p></div>
<p><strong>next/dynamic</strong> — behind a button, then rendered at once (Resource Timing in Chromium):</p>
<div class="out">/js/dynamic      ⇒ JS 7 files · 136 KB over the wire · 452 KB unpacked · big chunk (&gt;500 KB): no
/js/dynamic      ⇒ after the click: 2 new JS file(s) · 302 KB over the wire · 945 KB unpacked
/js/dynamic-ngay ⇒ JS 9 files · 438 KB over the wire · 1,397 KB unpacked · big chunk (&gt;500 KB): YES</div>
<p><strong>Link prefetch</strong> — a page that only links to <code>/js/client</code>, 3 s after load, nothing clicked:</p>
<div class="out">/js/link     ⇒ JS 8 files · 439 KB over the wire · 1,399 KB unpacked · big chunk (&gt;500 KB): YES
/js/link-off ⇒ JS 7 files · 137 KB over the wire · 454 KB unpacked · big chunk (&gt;500 KB): no</div>
<p><strong>The shared-import trap</strong> — a small client <code>&lt;Theme /&gt;</code> that imports the highlighter, added to the ROOT layout:</p>
<div class="out">$ node -e "const fs=require('fs'),z=require('zlib');for(const r of require('./.next/diagnostics/route-bundle-stats.json').filter(r=&gt;['/','/js/goc','/js/server','/js/icon'].includes(r.route))){const g=r.firstLoadChunkPaths.reduce((s,p)=&gt;s+z.gzipSync(fs.readFileSync(p)).length,0);console.log(r.route.padEnd(13),(r.firstLoadUncompressedJsBytes/1024).toFixed(0).padStart(5)+' KB','· gzip '+(g/1024).toFixed(0).padStart(3)+' KB')}"
/              1407 KB · gzip 439 KB
/js/icon       1395 KB · gzip 435 KB
/js/goc        1391 KB · gzip 434 KB
/js/server     1391 KB · gzip 434 KB</div>
<div class="callout warn"><p>Every route jumped from about 446 KB to 1391+ KB — including pages that never colour any code. The build stayed green. Only the numbers show it.</p></div>
<p><strong>Why the named lodash import is small</strong> — Next.js ships a rewrite for it:</p>
<div class="out">$ grep -n -A2 "lodash: {" node_modules/next/dist/server/config.js
962:        lodash: {
963-            transform: 'lodash/{{member}}'
964-        }</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -n "lottie_light\\|299KB\\|164KB" next.config.js | head -4
76:  // ĐẦY ĐỦ: 299KB đã minify (đo trên chunk dc112a36….js của bản dựng thật).
77:  // Bản &#96;lottie_light&#96; là 164KB — rẻ hơn 135KB cho cùng một con robot.
92:      'lottie-web': require.resolve('lottie-web/build/player/lottie_light.js'),
$ grep -c "optimizePackageImports" next.config.js | sed 's/^/optimizePackageImports tự khai: /'
optimizePackageImports tự khai: 0
$ grep -c '"lodash"' package.json | sed 's/^/lodash trong package.json: /'
lodash trong package.json: 0
$ grep -rln "next/dynamic" src | wc -l | sed 's/^ */tệp dùng next\\/dynamic: /'
tệp dùng next/dynamic: 42</div>cuongthai.com aliases the full Lottie player (299 KB minified, measured on a real build chunk) to <code>lottie_light</code> (164 KB) for the same robot animation; 42 files load heavy widgets with <code>next/dynamic</code>; and there is no lodash dependency at all.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm i highlight.js
<span class="tok-comment"># page A: Server Component that calls hljs.highlightAuto(...)  ·  page B: the same in a "use client" component</span>
npm run build
node -e "for (const r of require('./.next/diagnostics/route-bundle-stats.json')) console.log(r.route, Math.round(r.firstLoadUncompressedJsBytes / 1024) + ' KB')"
npx next start
<span class="tok-comment"># DevTools → Network → JS: open a page with a &lt;Link&gt; to page B, wait 3 s; then add prefetch={false}</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">A cheap phone on 3G downloads, parses and runs every kilobyte — 945 KB of highlighter to colour one line of code.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">A teammate adds one import to the root layout? Every route grows, the build is green, nobody is warned — unless CI watches the numbers.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Every npm package you ship is code you trust in every visitor&#39;s browser. A compromised dependency (a hijacked maintainer account) reaches all of them at once.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Check route-bundle-stats.json in CI and fail on growth; review dependency diffs in KB; keep libraries on the server when you can — server code never reaches the browser.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-5-dat-ranh-gioi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.5 — Where to put the client boundary</span><span class="lc-sub">Small client leaves, by design</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-8-4-dieu-huong-link" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 8.4 — Navigation: Link and useRouter</span><span class="lc-sub">Where prefetch comes from</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-1-do-truoc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.1 — Measure first</span><span class="lc-sub">Reading route-bundle-stats.json</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Move a heavy client component behind <code>next/dynamic</code> so it loads only when needed.</li>
<li>Push a <code>'use client'</code> boundary down so a page ships less JS; re-check First Load JS in the build.</li>
<li>Find one large dependency and replace or lazy-load it.</li>
</ol>
<p><strong>Done when:</strong> you can reduce client JavaScript with code-splitting and a lower boundary.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Code splitting</span><span class="v">Breaking the bundle so code loads on demand.</span></div>
  <div class="kv"><span class="k">next/dynamic</span><span class="v">Lazily import a component (optionally client-only).</span></div>
  <div class="kv"><span class="k">Server Components</span><span class="v">The best way to ship less JS — they ship none.</span></div>
  <div class="kv"><span class="k">Boundary down</span><span class="v">Smaller <code>'use client'</code> areas = less client JS.</span></div>
  <div class="kv"><span class="k">Tree shaking</span><span class="v">Dropping unused code from the bundle.</span></div>
  <div class="kv"><span class="k">Heavy dependency</span><span class="v">A big library that dominates bundle size.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The fastest JavaScript is the JavaScript you do not ship — keep logic in Server Components.</li><li>Code-split heavy client pieces with <code>next/dynamic</code> so they load on demand.</li><li>Push the <code>'use client'</code> boundary down to shrink First Load JS.</li><li>Audit big dependencies and replace or lazy-load them.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Lazy Loading</span><span class="lc-sub">next/dynamic, code splitting, and deferring client components.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.3</span>
<h2>Bạn gửi càng ít JavaScript, trang càng nhanh</h2>
<p class="lead">Bundle (từ bài 18.1) là JavaScript trình duyệt phải tải và chạy. Giảm nó là đòn bẩy lớn nhất cho tương tác (INP). Bạn có ba công cụ, và bạn đã gặp cái mạnh nhất.</p>

<h3>1 · Server Component gửi zero JavaScript</h3>
<p>Đây là cái lớn, và là nhắc lại Chương 9: một Server Component chạy trên server và chỉ gửi HTML — <em>không</em> code nào của nó xuống trình duyệt. Nên càng nhiều UI bạn giữ là Server Component (và càng giữ nhỏ các lá <code>'use client'</code>), càng ít JavaScript được gửi. Hiệu năng là một trong những lý do chính khiến App Router đặt server-first làm mặc định.</p>

<h3>2 · Tải động: chỉ tải phần nặng khi cần</h3>
<p>Vài client component to và không cần ngay — một thư viện biểu đồ, một trình soạn văn bản, một bản đồ, một modal mở khi bấm. <strong>Code splitting</strong> nghĩa là chẻ bundle thành nhiều mảnh để trình duyệt chỉ tải một mảnh khi nó thật sự cần. Next làm việc này theo route tự động, và bạn làm được theo component với <code>next/dynamic</code>:</p>
<pre><code class="language-typescript">import dynamic from 'next/dynamic';

<span class="tok-comment">// Code của HeavyChart KHÔNG nằm trong bundle ban đầu;</span>
<span class="tok-comment">// nó chỉ tải khi component này render</span>
const HeavyChart = dynamic(() =&gt; import('./HeavyChart'), {
  loading: () =&gt; &lt;p&gt;Đang tải biểu đồ…&lt;/p&gt;,
});</code></pre>
<p>Giờ code của biểu đồ được chẻ vào file riêng và fetch lười. Một khách không bao giờ mở biểu đồ thì không bao giờ tải nó. Dùng cái này bất cứ khi nào một client component nặng không cần ở lần paint đầu. <strong>Nếu nó vẫn render ngay ở lần vẽ đầu thì chẳng tiết kiệm gì:</strong> đo thật, bảng route ghi 451 KB nhưng trình duyệt tải 1,397 KB lúc mở trang.</p>

<h3>3 · Chẻ theo route tự động</h3>
<p>Bạn có cái này miễn phí: Next chẻ code theo route, nên vào <code>/about</code> không tải JavaScript của <code>/dashboard</code>. Bạn chỉ trả cho trang mình đang ở — <strong>cộng với thứ <code>&lt;Link&gt;</code> tải trước</strong>: trên production, một link lọt vào tầm nhìn sẽ tải JavaScript của trang đích trước cả khi bấm (đo thật: 439 KB khi link trong tầm nhìn so với 137 KB với <code>prefetch={false}</code>). Việc của bạn phần lớn là tránh vô tình kéo một thư viện khổng lồ vào một component dùng chung mà mọi route đều tải.</p>

<div class="callout warn">
<p><strong>Coi chừng import dùng chung.</strong> Import một thư viện lớn vào root layout hay một component dùng rộng đặt nó vào bundle của <em>mọi</em> route. Nếu chỉ một trang cần một dependency nặng, hãy import ở đó (lý tưởng qua <code>next/dynamic</code>), không phải toàn cục. Một import đặt sai chỗ là lý do phổ biến khiến bundle của cả site phình to.</p>
</div>

<h3>Ship ít JavaScript hơn</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Giữ component ở phía máy chủ</b> — Khoản tiết kiệm lớn nhất có được, và nó chẳng tốn gì: mã máy chủ hoàn toàn không nằm trong gói.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Chỉ import thứ bạn dùng</b> — &#96;import { format } from &#39;date-fns&#39;&#96;, đừng import cả không gian tên. Hãy kiểm xem thư viện có hỗ trợ tree shaking không — nhiều cái không.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nạp các widget nặng theo yêu cầu</b> — &#96;next/dynamic&#96; cho một biểu đồ, một trình soạn thảo, một bản đồ. Nó không nằm trong gói ban đầu và chỉ về khi component được vẽ.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nhìn vào bộ phân tích TRƯỚC khi thêm một phụ thuộc</b> — Một bộ chọn ngày tốn 90kB là một quyết định, không phải một tai nạn — nhưng chỉ khi bạn có nhìn.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một dòng import kéo cả một thư viện vào gói.</strong> &#96;import _ from &#39;lodash&#39;&#96; để dùng một hàm sẽ ship cả thư viện, vì bản dựng CommonJS không tree-shake được. Cùng hình dạng ấy hiện ra với các bộ icon mà Next.js không tự tối ưu (&#96;import { Icon } from &#39;@some/icons&#39;&#96; lôi vào hai nghìn file SVG — với gói nằm trong danh sách &#96;optimizePackageImports&#96; có sẵn như lucide-react, một icon đo được chỉ +4 KB; còn &#96;import { debounce } from &#39;lodash&#39;&#96; được tự đổi thành &#96;lodash/debounce&#96;, 449 KB so với 515 KB của &#96;import _&#96;), với moment.js cùng đống ngôn ngữ của nó, và với một bộ UI import từ gốc. Chẳng gì cảnh báo bạn; cái route chỉ nặng thêm 200kB và bản build vẫn thành công. Bộ phân tích gói cho thấy điều đó trong một bức tranh — hãy chạy nó sau khi thêm bất kỳ phụ thuộc nào, và hãy ưu tiên đường import theo từng module (&#96;lodash/debounce&#96;) hoặc một thư viện nhỏ hơn.</p></div>
<a class="link-card dl" href="https://www.npmjs.com/package/@next/bundle-analyzer" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">@next/bundle-analyzer</span><span class="lc-sub">Một sơ đồ cây về thứ thật sự nằm trong từng gói. Mười phút ở đây thường tìm ra thứ gì đó.</span></span>
</a>
<a class="link-card dl" href="https://bundlephobia.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Bundlephobia</span><span class="lc-sub">Chi phí của một package trước khi bạn cài nó, gồm cả việc nó có tree-shake được không.</span></span>
</a>


<h3>🔬 Đo thật: một thư viện tô màu, đặt ở nhiều chỗ (Next.js 16.4.6 · route-bundle-stats.json · Chromium)</h3>
<p>Mỗi trang tô màu một dòng bằng <code>highlight.js</code> — hoặc không dùng nó. Kích thước từ <code>.next/diagnostics/route-bundle-stats.json</code>, nhẹ trước:</p>
<div class="out">/js/goc         446 KB · gzip 132 KB
/js/server      446 KB · gzip 132 KB
/js/lodash      449 KB · gzip 133 KB
/js/lodash-le   449 KB · gzip 133 KB
/js/icon        450 KB · gzip 134 KB
/js/dynamic-ngay   451 KB · gzip 134 KB
/js/dynamic     452 KB · gzip 134 KB
/js/link        454 KB · gzip 135 KB
/js/link-off    454 KB · gzip 135 KB
/js/lodash-all   515 KB · gzip 157 KB
/js/client     1391 KB · gzip 434 KB</div>
<div class="callout ok"><p><code>/js/server</code> dùng thư viện trong Server Component: <strong>446 KB, bằng trang không có thư viện</strong>. <code>/js/client</code> làm đúng việc đó ở client: +945 KB.</p></div>
<p><strong>next/dynamic</strong> — sau một nút bấm, rồi render ngay (Resource Timing trong Chromium):</p>
<div class="out">/js/dynamic      ⇒ JS 7 files · 136 KB over the wire · 452 KB unpacked · big chunk (&gt;500 KB): no
/js/dynamic      ⇒ after the click: 2 new JS file(s) · 302 KB over the wire · 945 KB unpacked
/js/dynamic-ngay ⇒ JS 9 files · 438 KB over the wire · 1,397 KB unpacked · big chunk (&gt;500 KB): YES</div>
<p><strong>Link tải trước</strong> — một trang chỉ có link tới <code>/js/client</code>, 3 giây sau khi mở, chưa bấm gì:</p>
<div class="out">/js/link     ⇒ JS 8 files · 439 KB over the wire · 1,399 KB unpacked · big chunk (&gt;500 KB): YES
/js/link-off ⇒ JS 7 files · 137 KB over the wire · 454 KB unpacked · big chunk (&gt;500 KB): no</div>
<p><strong>Bẫy import dùng chung</strong> — một component client <code>&lt;Theme /&gt;</code> nhỏ import thư viện tô màu, thêm vào layout GỐC:</p>
<div class="out">$ node -e "const fs=require('fs'),z=require('zlib');for(const r of require('./.next/diagnostics/route-bundle-stats.json').filter(r=&gt;['/','/js/goc','/js/server','/js/icon'].includes(r.route))){const g=r.firstLoadChunkPaths.reduce((s,p)=&gt;s+z.gzipSync(fs.readFileSync(p)).length,0);console.log(r.route.padEnd(13),(r.firstLoadUncompressedJsBytes/1024).toFixed(0).padStart(5)+' KB','· gzip '+(g/1024).toFixed(0).padStart(3)+' KB')}"
/              1407 KB · gzip 439 KB
/js/icon       1395 KB · gzip 435 KB
/js/goc        1391 KB · gzip 434 KB
/js/server     1391 KB · gzip 434 KB</div>
<div class="callout warn"><p>Mọi route nhảy từ khoảng 446 KB lên hơn 1391 KB — kể cả những trang chẳng tô màu dòng nào. Build vẫn xanh. Chỉ con số mới cho thấy.</p></div>
<p><strong>Vì sao import lodash có tên lại nhỏ</strong> — Next.js có sẵn một luật viết lại:</p>
<div class="out">$ grep -n -A2 "lodash: {" node_modules/next/dist/server/config.js
962:        lodash: {
963-            transform: 'lodash/{{member}}'
964-        }</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -n "lottie_light\\|299KB\\|164KB" next.config.js | head -4
76:  // ĐẦY ĐỦ: 299KB đã minify (đo trên chunk dc112a36….js của bản dựng thật).
77:  // Bản &#96;lottie_light&#96; là 164KB — rẻ hơn 135KB cho cùng một con robot.
92:      'lottie-web': require.resolve('lottie-web/build/player/lottie_light.js'),
$ grep -c "optimizePackageImports" next.config.js | sed 's/^/optimizePackageImports tự khai: /'
optimizePackageImports tự khai: 0
$ grep -c '"lodash"' package.json | sed 's/^/lodash trong package.json: /'
lodash trong package.json: 0
$ grep -rln "next/dynamic" src | wc -l | sed 's/^ */tệp dùng next\\/dynamic: /'
tệp dùng next/dynamic: 42</div>cuongthai.com trỏ trình phát Lottie bản đầy đủ (299 KB đã nén, đo trên chunk của bản build thật) sang <code>lottie_light</code> (164 KB) cho cùng con robot; 42 tệp nạp widget nặng bằng <code>next/dynamic</code>; và không hề có phụ thuộc lodash.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm i highlight.js
<span class="tok-comment"># trang A: Server Component gọi hljs.highlightAuto(...)  ·  trang B: cũng vậy trong component "use client"</span>
npm run build
node -e "for (const r of require('./.next/diagnostics/route-bundle-stats.json')) console.log(r.route, Math.round(r.firstLoadUncompressedJsBytes / 1024) + ' KB')"
npx next start
<span class="tok-comment"># DevTools → Network → JS: mở trang có &lt;Link&gt; tới trang B, chờ 3 giây; rồi thêm prefetch={false}</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Một điện thoại rẻ trên 3G phải tải, phân tích và chạy từng ki-lô-bai — 945 KB thư viện để tô màu một dòng mã.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Một bạn trong nhóm thêm một import vào layout gốc? Mọi route nặng lên, build xanh, không ai được cảnh báo — trừ khi CI canh các con số.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Mỗi gói npm bạn gửi xuống là mã bạn tin, chạy trong trình duyệt của mọi người dùng. Một phụ thuộc bị chiếm quyền (tài khoản người bảo trì bị cướp) tới tay tất cả cùng lúc.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Kiểm route-bundle-stats.json trong CI và báo đỏ khi tăng; soát diff phụ thuộc bằng KB; giữ thư viện ở máy chủ khi có thể — mã máy chủ không bao giờ xuống trình duyệt.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-5-dat-ranh-gioi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.5 — Đặt ranh giới client ở đâu</span><span class="lc-sub">Lá client nhỏ, ngay từ thiết kế</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-8-4-dieu-huong-link" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 8.4 — Điều hướng: Link và useRouter</span><span class="lc-sub">Tải trước đến từ đâu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-1-do-truoc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.1 — Hãy đo trước</span><span class="lc-sub">Đọc route-bundle-stats.json</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chuyển một client component nặng ra sau <code>next/dynamic</code> để nó chỉ tải khi cần.</li>
<li>Đẩy một ranh giới <code>'use client'</code> xuống để một trang gửi ít JS hơn; kiểm lại First Load JS trong build.</li>
<li>Tìm một dependency lớn và thay hoặc lazy-load nó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giảm được JavaScript client bằng code-splitting và một ranh giới thấp hơn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Code splitting</span><span class="v">Chia bundle để code tải theo yêu cầu.</span></div>
  <div class="kv"><span class="k">next/dynamic</span><span class="v">Import một component kiểu lười (tuỳ chọn chỉ-client).</span></div>
  <div class="kv"><span class="k">Server Components</span><span class="v">Cách tốt nhất để gửi ít JS — chúng gửi không JS nào.</span></div>
  <div class="kv"><span class="k">Ranh giới xuống</span><span class="v">Vùng <code>'use client'</code> nhỏ hơn = ít JS client hơn.</span></div>
  <div class="kv"><span class="k">Tree shaking</span><span class="v">Bỏ code không dùng khỏi bundle.</span></div>
  <div class="kv"><span class="k">Dependency nặng</span><span class="v">Một thư viện lớn chiếm phần lớn kích thước bundle.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>JavaScript nhanh nhất là JavaScript bạn không gửi — giữ logic trong Server Components.</li><li>Code-split các mảnh client nặng bằng <code>next/dynamic</code> để chúng tải theo yêu cầu.</li><li>Đẩy ranh giới <code>'use client'</code> xuống để thu nhỏ First Load JS.</li><li>Soát các dependency lớn và thay hoặc lazy-load chúng.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Lazy Loading</span><span class="lc-sub">next/dynamic, code splitting, và trì hoãn client component.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 18.4 ─────────────────────────── */
    {
      title: '18.4 — Fonts and static assets|||18.4 — Font và tài nguyên tĩnh',
      slug: 'nextjs-18-4-fonts-assets',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Font web tải sai cách gây nhảy chữ và chậm. next/font tự tải font lúc build, tự-host, và dành chỗ để không nhảy layout. Cộng với thư mục public/ cho ảnh/icon tĩnh phục vụ nguyên trạng.',
      content: `
${G18_4}
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.4</span>
<h2>Fonts: a small thing that quietly hurts performance</h2>
<p class="lead">Custom web fonts are lovely but easy to get wrong. Loaded naively, they add a network request to a third party, and cause text to flash — first in a fallback font, then jumping to the real one (a layout shift, hurting CLS). Next.js solves this with <code>next/font</code>.</p>

<pre><code class="language-typescript">import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return &lt;html className={inter.className}&gt;&lt;body&gt;{children}&lt;/body&gt;&lt;/html&gt;;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Self-hosted at build</span><span class="v">The font file is downloaded at build and served from your own site — no request to Google's servers at runtime, so no third-party round trip and better privacy. The flip side: the <em>build machine</em> must reach Google (measured below: no access ⇒ <code>Build error occurred</code>).</span></div>
  <div class="kv"><span class="k">No layout shift</span><span class="v">Next reserves space and matches metrics so text does not jump when the custom font arrives.</span></div>
  <div class="kv"><span class="k">Subsetting</span><span class="v"><code>subsets</code> decides which subset files are <strong>preloaded</strong>. The generated CSS still declares every subset with its own <code>unicode-range</code>, and the browser downloads a subset only when the page uses those characters — measured: with <code>['latin']</code> only, Vietnamese text still rendered in Inter (its Vietnamese file was fetched on demand); the HTML had 3 font preloads vs 4 with <code>['latin', 'vietnamese']</code>.</span></div>
</div>

<h3>The public/ folder for static files</h3>
<p>Files in a top-level <code>public/</code> folder are served as-is at the root URL. Put <code>public/logo.svg</code> and it is available at <code>/logo.svg</code>. Use it for favicons, static icons, robots files, and small images that do not need optimisation.</p>
<pre><code>public/
├─ favicon.ico     <span class="tok-comment">// → /favicon.ico</span>
└─ logo.svg        <span class="tok-comment">// → /logo.svg</span></code></pre>

<div class="callout warn">
<p><strong>A gotcha you will meet again in Chapter 20:</strong> the contents of <code>public/</code> are decided by the running server. If you add or rename files in <code>public/</code> while <strong><code>next start</code></strong> is running, you must restart it for the new files to be served — otherwise you get a confusing 404 for a file that clearly exists on disk. (Measured: the same new file was 200 on <code>next dev</code>, which watches the folder, and 404 on <code>next start</code> until a restart.) (This exact class of bug once made a whole page hang; the deploy chapter has the full story.)</p>
</div>

<h3>Fonts, without the flash and the round trip</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Use next/font</b> — It downloads the font at build time and serves it from your own domain. No request to Google, and no third-party dependency in the critical path.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It sets font-display automatically</b> — &#96;swap&#96; by default, so text is readable immediately in a fallback and swaps when the real font arrives.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It computes fallback metrics</b> — Matching the fallback&#39;s size to the real font, so the swap does not move the text — CLS from fonts goes to zero.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Subset what you need</b> — &#96;subsets: [&#39;latin&#39;, &#39;vietnamese&#39;]&#96;. Loading every script in a font is often larger than the rest of the page — and on a Vietnamese site, listing <code>vietnamese</code> makes its file start early (preload) instead of being discovered late.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a font loaded with a plain &#96;@import&#96; in CSS, blocking the first paint.</strong> A CSS &#96;@import&#96; is discovered only after the stylesheet has been fetched and parsed, so the font request starts late and the browser has nothing to render text with until it lands — a blank page where the content should be, sometimes for a second on a slow connection. The page eventually looks perfect, which is why this survives review. &#96;next/font&#96; loads it at build time and inlines the declaration, and if you must load a font yourself, use a &#96;&lt;link rel="preload"&gt;&#96; with an explicit &#96;font-display&#96;.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/fonts" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Font optimization</span><span class="lc-sub">next/font for Google and local fonts, with the subsetting options.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/font-best-practices" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">web.dev — Font best practices</span><span class="lc-sub">Display strategies, preloading, and the metrics-matching trick.</span></span>
</a>


<h3>🔬 Measured: what next/font really does (Next.js 16.4.6 · next start · Chromium)</h3>
<div class="out">$ ls .next/static/media/*.woff2 | wc -l | sed 's/^ */tệp .woff2 tự lưu trong .next\\/static\\/media: /'
tệp .woff2 tự lưu trong .next/static/media: 26
$ grep -o "@font-face{[^}]*}" .next/static/chunks/*.css | grep "Inter Fallback"   # the fallback face next/font generates
@font-face{font-family:Inter Fallback;src:local(Arial);ascent-override:90.44%;descent-override:22.52%;line-gap-override:0.0%;size-adjust:107.12%}
$ cat .next/static/chunks/*.css | grep -o "@font-face{font-family:Inter;[^}]*}" | grep -o "font-display:[a-z]*" | sort | uniq -c
  14 font-display:swap</div>
<div class="out">subsets: ['latin']               ⇒ requests to Google: 0 · woff2 files: 4 (localhost:19329) · loaded: Inter [vietnamese], Inter [other], Inter Fallback [other]
subsets: ['latin', 'vietnamese'] ⇒ requests to Google: 0 · woff2 files: 4 (localhost:19329) · loaded: Inter [vietnamese], Inter [other]</div>
<div class="out">$ for p in latin vi; do echo "/font/$p: $(curl -s http://127.0.0.1:19329/font/$p | grep -o '&lt;link rel=\\"preload\\" href=\\"[^\\"]*woff2\\"' | wc -l | tr -d ' ') &lt;link rel=preload&gt; woff2"; done
/font/latin: 3 &lt;link rel=preload&gt; woff2
/font/vi: 4 &lt;link rel=preload&gt; woff2</div>
<p>The fallback face is Arial stretched with <code>size-adjust</code> to Inter&#39;s size, so text drawn before the real font arrives takes almost the same space. Zero requests to Google from the browser. And <code>subsets</code> changed only the number of preloaded files — Vietnamese rendered in Inter either way.</p>
<p><strong>CSS @import vs next/font, same font (Lora), simulated slow 4G</strong></p>
<div class="out">@import  ⇒ HTML 165 · page CSS 415 · Google CSS 716 · FCP 832 ms
next/font ⇒ HTML 165 · page CSS 423 · FCP 540 ms</div>
<p>The first text waited for the whole CSS chain: page CSS, then the <code>@import</code>ed Google stylesheet. The <code>@import</code> is kept as-is in the built CSS:</p>
<div class="out">$ cat .next/static/chunks/*.css | grep -o '@import "[^"]*"' | head -2
@import "https://fonts.googleapis.com/css2?family=Lora&amp;display=swap"</div>
<p><strong>The catch — the build machine must reach Google</strong>:</p>
<div class="out">$ https_proxy=http://127.0.0.1:9 npm run build   # the build machine cannot reach Google Fonts
  There was an issue establishing a connection while requesting https://fonts.googleapis.com/css2?family=Geist:wght@100..900&amp;display=swap
  &gt; Build error occurred</div>
<p><strong>public/</strong> — a new file, added while both servers run:</p>
<div class="out">$ curl -s --retry 20 --retry-connrefused --retry-delay 1 -o /dev/null -w 'dev   /favicon.ico %{http_code}\\n' http://127.0.0.1:19330/favicon.ico; curl -s -o /dev/null -w 'start /file.svg %{http_code}\\n' http://127.0.0.1:19329/file.svg
dev   /favicon.ico 200
start /file.svg 200
$ cp logo.svg public/logo-moi.svg   # a NEW file, added while both servers run
public/logo-moi.svg
$ curl -s -o /dev/null -w 'next start → /logo-moi.svg %{http_code}\\n' http://127.0.0.1:19329/logo-moi.svg; curl -s -o /dev/null -w 'next dev   → /logo-moi.svg %{http_code}\\n' http://127.0.0.1:19330/logo-moi.svg
next start → /logo-moi.svg 404
next dev   → /logo-moi.svg 200
$ # restart next start, ask again
next start (restarted) → /logo-moi.svg 200</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ sed -n 7,11p src/app/layout.tsx
// Self-hosted fonts via @fontsource (npm) instead of next/font/google.
// The Google-Fonts build-time fetch (fonts.gstatic.com) was flaky from
// the VPS and repeatedly failed the deploy ("Failed to fetch Poppins from
// Google Fonts"). @fontsource ships the woff2 in node_modules, so the
// build is fully offline. We import the per-WEIGHT css (not the
$ grep -c "@fontsource" src/app/layout.tsx | sed 's/^/import @fontsource trong layout.tsx: /'
import @fontsource trong layout.tsx: 17
$ grep -c "from 'next/font" src/app/layout.tsx | sed 's/^/import từ next\\/font trong layout.tsx: /'
import từ next/font trong layout.tsx: 0</div>cuongthai.com moved from <code>next/font/google</code> to <code>@fontsource</code> because the Google Fonts fetch at build time kept failing on its VPS — the same error as above. The 3D playground once hung on its loading screen because a running <code>next start</code> answered 404 for new files in <code>public/</code> (30/07/2026).</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build
ls .next/static/media/*.woff2 | wc -l
grep -o '@font-face{font-family:Inter Fallback[^}]*}' .next/static/chunks/*.css
https_proxy=http://127.0.0.1:9 npm run build <span class="tok-comment">  # simulate a build machine without Google</span>
npx next start -p 3000 &amp;
cp some.svg public/new.svg &amp;&amp; curl -s -o /dev/null -w "%{http_code}" localhost:3000/new.svg <span class="tok-comment">  # 404 until restart</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">You open a page; the text appears, then jumps into another font. A size-matched fallback keeps the line where it was.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">The build server cannot reach Google Fonts? <code>next/font/google</code> stops the build. cuongthai.com hit exactly this and moved to <code>@fontsource</code>.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Third-party fonts tell another company who visited which page; a hijacked third-party stylesheet can inject CSS into your page (and CSS can exfiltrate data via background URLs).</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Self-host fonts (<code>next/font</code> or <code>@fontsource</code>), keep a strict <code>font-src</code>/<code>style-src</code> in your CSP, and restart <code>next start</code> after changing <code>public/</code>.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-5-core-web-vitals" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.5 — Core Web Vitals</span><span class="lc-sub">Why jumping text raises CLS</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-0-0-bat-dau-2" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · Start here (2/2)</span><span class="lc-sub">The public/ 404 → 200 incident, first time</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-5-do-trung-thuc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.5 — Measuring, honestly</span><span class="lc-sub">Cold vs warm, throttled vs not</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Load a font with <code>next/font</code> and confirm it self-hosts (no external request) and sets <code>font-display</code>.</li>
<li>Put a static asset in <code>public/</code> and reference it; note it is served as-is with a stable URL.</li>
<li>Change a file in <code>public/</code> and remember to restart Next (the file list is locked at server start).</li>
</ol>
<p><strong>Done when:</strong> you can load fonts with <code>next/font</code> and serve static assets correctly.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">next/font</span><span class="v">Self-hosts fonts at build, avoiding an external request.</span></div>
  <div class="kv"><span class="k">font-display</span><span class="v">Controls text visibility while a font loads (avoids FOIT).</span></div>
  <div class="kv"><span class="k">public/</span><span class="v">Folder for static assets served as-is at the root URL.</span></div>
  <div class="kv"><span class="k">Self-hosting</span><span class="v">Serving the font from your own origin for speed and privacy.</span></div>
  <div class="kv"><span class="k">Asset URL</span><span class="v">A stable path like <code>/logo.svg</code>.</span></div>
  <div class="kv"><span class="k">public is locked</span><span class="v">Next fixes the <code>public/</code> file list at server start — restart after changes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>next/font</code> self-hosts fonts at build time and sets <code>font-display</code>, removing a render-blocking external request.</li><li>Static assets live in <code>public/</code> and are served as-is at the root URL.</li><li>Next locks the <code>public/</code> file list at server start — restart after changing files there (a real cuongthai.com trap).</li><li>Right-sizing fonts and assets is a cheap, large performance win.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/fonts" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Font Optimization</span><span class="lc-sub">next/font, self-hosting, subsetting, and avoiding layout shift.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.4</span>
<h2>Font: một thứ nhỏ âm thầm hại hiệu năng</h2>
<p class="lead">Font web tuỳ chỉnh thì đẹp nhưng dễ làm sai. Tải ngây thơ, chúng thêm một request tới một bên thứ ba, và làm chữ nháy — đầu tiên ở font dự phòng, rồi nhảy sang font thật (một layout shift, hại CLS). Next.js giải điều này bằng <code>next/font</code>.</p>

<pre><code class="language-typescript">import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return &lt;html className={inter.className}&gt;&lt;body&gt;{children}&lt;/body&gt;&lt;/html&gt;;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Tự-host lúc build</span><span class="v">File font được tải lúc build và phục vụ từ chính site bạn — không request tới server Google lúc chạy, nên không vòng đi bên thứ ba và riêng tư hơn.</span></div>
  <div class="kv"><span class="k">Không nhảy layout</span><span class="v">Next giữ chỗ và khớp số đo để chữ không nhảy khi font tuỳ chỉnh tới.</span></div>
  <div class="kv"><span class="k">Subset</span><span class="v"><code>subsets</code> quyết định tệp phần chữ nào được <strong>tải trước (preload)</strong>. CSS sinh ra vẫn khai đủ mọi phần chữ, mỗi phần một <code>unicode-range</code>, và trình duyệt chỉ tải một phần khi trang dùng tới ký tự đó — đo thật: chỉ khai <code>['latin']</code> mà chữ tiếng Việt vẫn hiện bằng Inter (tệp tiếng Việt được tải khi cần); HTML có 3 preload font so với 4 khi khai <code>['latin', 'vietnamese']</code>.</span></div>
</div>

<h3>Thư mục public/ cho file tĩnh</h3>
<p>File trong thư mục cấp cao <code>public/</code> được phục vụ nguyên trạng ở URL gốc. Đặt <code>public/logo.svg</code> và nó có ở <code>/logo.svg</code>. Dùng cho favicon, icon tĩnh, file robots, và ảnh nhỏ không cần tối ưu.</p>
<pre><code>public/
├─ favicon.ico     <span class="tok-comment">// → /favicon.ico</span>
└─ logo.svg        <span class="tok-comment">// → /logo.svg</span></code></pre>

<div class="callout warn">
<p><strong>Một bẫy bạn sẽ gặp lại ở Chương 20:</strong> nội dung của <code>public/</code> được quyết bởi server đang chạy. Nếu bạn thêm hoặc đổi tên file trong <code>public/</code> khi <strong><code>next start</code></strong> đang chạy, bạn phải khởi động lại nó để file mới được phục vụ — nếu không bạn nhận một 404 khó hiểu cho một file rõ ràng có trên đĩa. (Đo thật: cùng tệp mới trả 200 trên <code>next dev</code>, vốn theo dõi thư mục, và 404 trên <code>next start</code> tới khi khởi động lại.) (Đúng loại bug này từng làm cả một trang treo; chương deploy có toàn bộ câu chuyện.)</p>
</div>

<h3>Font, không chớp sáng và không đi vòng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Hãy dùng next/font</b> — Nó tải font về lúc build và phục vụ từ chính tên miền của bạn. Không request tới Google, và không có phụ thuộc bên thứ ba nào trên đường tới hạn.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó tự đặt font-display</b> — Mặc định là &#96;swap&#96;, nên chữ đọc được ngay bằng font dự phòng rồi đổi khi font thật về.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó tính các thông số cho font dự phòng</b> — Khớp kích thước của font dự phòng với font thật, để cú đổi không làm chữ xê dịch — CLS do font về không.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Chỉ lấy tập ký tự bạn cần</b> — &#96;subsets: [&#39;latin&#39;, &#39;vietnamese&#39;]&#96;. Nạp mọi hệ chữ trong một font thường còn nặng hơn cả phần còn lại của trang — và với trang tiếng Việt, khai <code>vietnamese</code> để tệp đó được tải trước (preload) thay vì được phát hiện muộn.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một font nạp bằng &#96;@import&#96; trần trong CSS, chặn mất lần vẽ đầu tiên.</strong> Một &#96;@import&#96; trong CSS chỉ được phát hiện SAU khi bảng kiểu đã tải về và phân tích xong, nên request lấy font khởi động muộn và trình duyệt chẳng có gì để vẽ chữ cho tới khi nó về — một trang trắng ở đúng chỗ nội dung phải nằm, đôi khi cả một giây trên đường truyền chậm. Cuối cùng thì trang trông hoàn hảo, và đó là lý do chuyện này sống sót qua review. &#96;next/font&#96; nạp nó lúc build và đưa phần khai báo vào nội tuyến, còn nếu bạn buộc phải tự nạp font thì hãy dùng một &#96;&lt;link rel="preload"&gt;&#96; kèm &#96;font-display&#96; tường minh.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/fonts" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Tối ưu font</span><span class="lc-sub">next/font cho font Google và font cục bộ, kèm các tuỳ chọn tách tập ký tự.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/font-best-practices" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">web.dev — Thực hành tốt với font</span><span class="lc-sub">Các chiến lược hiển thị, nạp trước, và mẹo khớp thông số font.</span></span>
</a>


<h3>🔬 Đo thật: next/font thật sự làm gì (Next.js 16.4.6 · next start · Chromium)</h3>
<div class="out">$ ls .next/static/media/*.woff2 | wc -l | sed 's/^ */tệp .woff2 tự lưu trong .next\\/static\\/media: /'
tệp .woff2 tự lưu trong .next/static/media: 26
$ grep -o "@font-face{[^}]*}" .next/static/chunks/*.css | grep "Inter Fallback"   # the fallback face next/font generates
@font-face{font-family:Inter Fallback;src:local(Arial);ascent-override:90.44%;descent-override:22.52%;line-gap-override:0.0%;size-adjust:107.12%}
$ cat .next/static/chunks/*.css | grep -o "@font-face{font-family:Inter;[^}]*}" | grep -o "font-display:[a-z]*" | sort | uniq -c
  14 font-display:swap</div>
<div class="out">subsets: ['latin']               ⇒ requests to Google: 0 · woff2 files: 4 (localhost:19329) · loaded: Inter [vietnamese], Inter [other], Inter Fallback [other]
subsets: ['latin', 'vietnamese'] ⇒ requests to Google: 0 · woff2 files: 4 (localhost:19329) · loaded: Inter [vietnamese], Inter [other]</div>
<div class="out">$ for p in latin vi; do echo "/font/$p: $(curl -s http://127.0.0.1:19329/font/$p | grep -o '&lt;link rel=\\"preload\\" href=\\"[^\\"]*woff2\\"' | wc -l | tr -d ' ') &lt;link rel=preload&gt; woff2"; done
/font/latin: 3 &lt;link rel=preload&gt; woff2
/font/vi: 4 &lt;link rel=preload&gt; woff2</div>
<p>Mặt chữ dự phòng là Arial, kéo giãn bằng <code>size-adjust</code> cho bằng cỡ Inter, nên chữ vẽ trước khi font thật tới chiếm gần đúng chỗ. Trình duyệt không gọi Google lần nào. Và <code>subsets</code> chỉ đổi số tệp được tải trước — chữ tiếng Việt vẫn hiện bằng Inter trong cả hai trường hợp.</p>
<p><strong>CSS @import và next/font, cùng font Lora, 4G chậm giả lập</strong></p>
<div class="out">@import  ⇒ HTML 165 · page CSS 415 · Google CSS 716 · FCP 832 ms
next/font ⇒ HTML 165 · page CSS 423 · FCP 540 ms</div>
<p>Chữ đầu tiên chờ trọn chuỗi CSS: CSS của trang, rồi tệp CSS Google được <code>@import</code>. Dòng <code>@import</code> vẫn nằm nguyên trong CSS đã build:</p>
<div class="out">$ cat .next/static/chunks/*.css | grep -o '@import "[^"]*"' | head -2
@import "https://fonts.googleapis.com/css2?family=Lora&amp;display=swap"</div>
<p><strong>Cái giá — máy build phải tới được Google</strong>:</p>
<div class="out">$ https_proxy=http://127.0.0.1:9 npm run build   # the build machine cannot reach Google Fonts
  There was an issue establishing a connection while requesting https://fonts.googleapis.com/css2?family=Geist:wght@100..900&amp;display=swap
  &gt; Build error occurred</div>
<p><strong>public/</strong> — một tệp mới, thêm vào khi cả hai server đang chạy:</p>
<div class="out">$ curl -s --retry 20 --retry-connrefused --retry-delay 1 -o /dev/null -w 'dev   /favicon.ico %{http_code}\\n' http://127.0.0.1:19330/favicon.ico; curl -s -o /dev/null -w 'start /file.svg %{http_code}\\n' http://127.0.0.1:19329/file.svg
dev   /favicon.ico 200
start /file.svg 200
$ cp logo.svg public/logo-moi.svg   # a NEW file, added while both servers run
public/logo-moi.svg
$ curl -s -o /dev/null -w 'next start → /logo-moi.svg %{http_code}\\n' http://127.0.0.1:19329/logo-moi.svg; curl -s -o /dev/null -w 'next dev   → /logo-moi.svg %{http_code}\\n' http://127.0.0.1:19330/logo-moi.svg
next start → /logo-moi.svg 404
next dev   → /logo-moi.svg 200
$ # restart next start, ask again
next start (restarted) → /logo-moi.svg 200</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ sed -n 7,11p src/app/layout.tsx
// Self-hosted fonts via @fontsource (npm) instead of next/font/google.
// The Google-Fonts build-time fetch (fonts.gstatic.com) was flaky from
// the VPS and repeatedly failed the deploy ("Failed to fetch Poppins from
// Google Fonts"). @fontsource ships the woff2 in node_modules, so the
// build is fully offline. We import the per-WEIGHT css (not the
$ grep -c "@fontsource" src/app/layout.tsx | sed 's/^/import @fontsource trong layout.tsx: /'
import @fontsource trong layout.tsx: 17
$ grep -c "from 'next/font" src/app/layout.tsx | sed 's/^/import từ next\\/font trong layout.tsx: /'
import từ next/font trong layout.tsx: 0</div>cuongthai.com chuyển từ <code>next/font/google</code> sang <code>@fontsource</code> vì việc tải Google Fonts lúc build cứ thất bại trên VPS — đúng lỗi ở trên. Sân chơi 3D từng kẹt ở màn hình tải vì <code>next start</code> đang chạy trả 404 cho tệp mới trong <code>public/</code> (30/07/2026).</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build
ls .next/static/media/*.woff2 | wc -l
grep -o '@font-face{font-family:Inter Fallback[^}]*}' .next/static/chunks/*.css
https_proxy=http://127.0.0.1:9 npm run build <span class="tok-comment">  # giả lập máy build không tới được Google</span>
npx next start -p 3000 &amp;
cp some.svg public/new.svg &amp;&amp; curl -s -o /dev/null -w "%{http_code}" localhost:3000/new.svg <span class="tok-comment">  # 404 tới khi khởi động lại</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Bạn mở một trang; chữ hiện ra rồi giật sang font khác. Font dự phòng cùng cỡ giữ dòng chữ đứng yên.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Máy build không tới được Google Fonts? <code>next/font/google</code> làm build dừng. cuongthai.com gặp đúng chuyện này và chuyển sang <code>@fontsource</code>.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Font của bên thứ ba cho một công ty khác biết ai vừa mở trang nào; một tệp CSS bên thứ ba bị chiếm quyền có thể chèn CSS vào trang bạn (và CSS có thể rò dữ liệu qua URL nền).</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Tự phục vụ font (<code>next/font</code> hoặc <code>@fontsource</code>), giữ <code>font-src</code>/<code>style-src</code> chặt trong CSP, và khởi động lại <code>next start</code> sau khi đổi <code>public/</code>.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-5-core-web-vitals" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.5 — Core Web Vitals</span><span class="lc-sub">Vì sao chữ nhảy làm tăng CLS</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-0-0-bat-dau-2" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · Bắt đầu tại đây (2/2)</span><span class="lc-sub">Sự cố public/ 404 → 200, lần đầu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-5-do-trung-thuc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.5 — Đo, một cách trung thực</span><span class="lc-sub">Lạnh và ấm, có giới hạn và không</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tải một font bằng <code>next/font</code> và xác nhận nó tự-host (không request ngoài) và đặt <code>font-display</code>.</li>
<li>Đặt một asset tĩnh vào <code>public/</code> và tham chiếu nó; để ý nó phục vụ nguyên trạng với URL ổn định.</li>
<li>Đổi một file trong <code>public/</code> và nhớ khởi động lại Next (danh sách file bị chốt lúc server khởi động).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tải được font bằng <code>next/font</code> và phục vụ asset tĩnh đúng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">next/font</span><span class="v">Tự-host font lúc build, tránh một request ngoài.</span></div>
  <div class="kv"><span class="k">font-display</span><span class="v">Điều khiển hiển thị chữ trong lúc font tải (tránh FOIT).</span></div>
  <div class="kv"><span class="k">public/</span><span class="v">Thư mục cho asset tĩnh phục vụ nguyên trạng ở URL gốc.</span></div>
  <div class="kv"><span class="k">Tự-host</span><span class="v">Phục vụ font từ origin của bạn cho nhanh và riêng tư.</span></div>
  <div class="kv"><span class="k">URL asset</span><span class="v">Một path ổn định như <code>/logo.svg</code>.</span></div>
  <div class="kv"><span class="k">public bị chốt</span><span class="v">Next chốt danh sách file <code>public/</code> lúc server khởi động — khởi động lại sau khi đổi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>next/font</code> tự-host font lúc build và đặt <code>font-display</code>, bỏ một request ngoài chặn render.</li><li>Asset tĩnh nằm trong <code>public/</code> và phục vụ nguyên trạng ở URL gốc.</li><li>Next chốt danh sách file <code>public/</code> lúc server khởi động — khởi động lại sau khi đổi file ở đó (một bẫy thật của cuongthai.com).</li><li>Chỉnh đúng kích thước font và asset là một thắng lợi hiệu năng rẻ mà lớn.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/fonts" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Font Optimization</span><span class="lc-sub">next/font, tự-host, subset, và tránh layout shift.</span></span>
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

    /* ─────────────────────────── 18.5 ─────────────────────────── */
    {
      title: '18.5 — Measuring, honestly|||18.5 — Đo, một cách trung thực',
      slug: 'nextjs-18-5-do-trung-thuc',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Đừng đoán độ nặng trang bằng mắt. next build in kích thước JS thật của từng route; Lighthouse chấm điểm; Network tab hiện cái gì tải về. Kèm bài học thật cuongthai: đo bundle bằng next build, KHÔNG đếm thẻ script.',
      content: `
${G18_5}
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.5</span>
<h2>Optimise with numbers, not vibes</h2>
<p class="lead">The theme of this chapter's first lesson returns as its last: measure. Each fix above should be confirmed against a real number, both to prove it helped and to avoid "optimising" what was never slow.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">next build</span><span class="v">After a production build, Next records every route&#39;s JavaScript size — older versions printed it as a First Load JS column; Next.js 16 prints only ○/ƒ and writes the numbers to <code>.next/diagnostics/route-bundle-stats.json</code>. This is the authoritative measure of your bundle — watch it grow or shrink as you change code.</span></div>
  <div class="kv"><span class="k">Lighthouse</span><span class="v">Grades performance and lists concrete fixes (big images, unused JS, layout shift). Run it on a production build, not dev — dev is intentionally slower.</span></div>
  <div class="kv"><span class="k">Network tab</span><span class="v">Shows every file the page downloaded and its size. Sort by size and the true heavyweight (usually one image or one library) is obvious.</span></div>
  <div class="kv"><span class="k">Bundle analyzer</span><span class="v">A tool that draws your bundle as a map of boxes sized by weight — the fastest way to spot one giant dependency. Next.js 16 ships one: <code>next analyze</code> (Turbopack builds; <code>-o</code> writes it to <code>.next/diagnostics/analyze</code>). The older <code>@next/bundle-analyzer</code> plugin is for webpack builds.</span></div>
</div>

<div class="note-ct">
<p><strong>A measuring lesson from cuongthai.com:</strong> to judge how heavy a page really is, use the <code>next build</code> output — <em>not</em> a count of <code>&lt;script&gt;</code> tags in the HTML. Counting script tags is misleading: a page can have few tags but pull in a huge amount of JavaScript, or many tiny ones. The build report gives the real per-route JavaScript weight, which is what actually reaches the user. When comparing two versions of a page, compare their build sizes, not what the page source "looks like." Measure the thing that matters, with the tool that measures it correctly.</p>
</div>

<div class="callout ok">
<p><strong>A sane workflow:</strong> build → run Lighthouse (3–5 times, take the median: the same page here scored 96 / 97 / 98) → fix the top item it flags → build again and confirm the number moved. Repeat until it is fast enough. This keeps you honest and stops you from polishing things no user would ever notice.</p>
</div>

<h3>Measuring what users experience, not what you experience</h3>
<div class="lz-map">
  <div class="lz-stage">Your machine is not the test</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Throttle the network</div><div class="lz-nsub">Slow 4G in DevTools. Most of the world is not on your office connection, and most bugs of this class only appear there.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Throttle the CPU</div><div class="lz-nsub">4× or 6× slowdown. A mid-range phone is several times slower than a laptop, and JavaScript cost scales with it.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Test on a real phone once</div><div class="lz-nsub">Over your local network. Touch targets, the on-screen keyboard, and hover-only interactions all fail here and nowhere else.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Then watch the field data</div><div class="lz-nsub">Real-user metrics from production — in Next.js, <code>useReportWebVitals</code> sends each visit&#39;s LCP, CLS, INP… to an endpoint of yours; summarise at the 75th percentile. Lab numbers rank changes; field numbers tell you whether it mattered.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — a site that is fast for you and slow for everyone, because you only ever load it warm.</strong> Your browser has the fonts, the images and the JavaScript cached; your DNS is resolved; your connection is short and fast. A first-time visitor on a phone has none of that, and their first paint can be five times slower than yours — which is why the site feels fine to the team and gets complaints from users. Test in an incognito window with the cache disabled and throttling on, at least before each release. That is the visitor you are actually building for, and it is a different page.</p></div>
<a class="link-card dl" href="https://web.dev/articles/crux" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">web.dev — Chrome UX Report</span><span class="lc-sub">Field data for any public site, including yours and your competitors'.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/analytics" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Analytics</span><span class="lc-sub">Reporting real Web Vitals from your own users with useReportWebVitals.</span></span>
</a>


<h3>🔬 Measured: five honest measurements (Next.js 16.4.6 · next start · next analyze · Lighthouse 12.8.2 · Chromium)</h3>
<p><strong>1 · The analyzer</strong> — <code>npx next analyze</code> opens a treemap per route. For a page that colours one line with <code>highlight.js</code>, most of the map is <code>highlight.js/lib/languages</code> (666.85 KB in the analyzer&#39;s own count): almost 200 languages.</p>
<p><strong>2 · Change ONE thing, rebuild, compare</strong> — import <code>highlight.js/lib/core</code> and register only <code>javascript</code>:</p>
<div class="out">/do/it       446 KB · gzip 132 KB
/do/blog     472 KB · gzip 141 KB
/do/core     472 KB · gzip 142 KB
/do/nhieu   1391 KB · gzip 433 KB</div>
<p><strong>3 · Script tags lie</strong>:</p>
<div class="out">$ for p in it nhieu core; do curl -s localhost:3000/do/$p | grep -o '&lt;script' | wc -l; done
/do/it: 9 thẻ &lt;script&gt; trong HTML
/do/nhieu: 11 thẻ &lt;script&gt; trong HTML
/do/core: 11 thẻ &lt;script&gt; trong HTML</div>
<p>Same number of tags, 1391 KB vs 472 KB. A tag is a pointer, not a size.</p>
<p><strong>4 · Lighthouse wobbles</strong> — same page, same machine, three runs:</p>
<div class="out">$ for i in 1 2 3; do npx lighthouse http://localhost:3000/do/blog --only-categories=performance; done
lần 1: Performance 96/100 (mobile, Lighthouse 12.8.2) FCP 0.8 s · LCP 2.7 s · TBT 60 ms · CLS 0.065 
lần 2: Performance 97/100 (mobile, Lighthouse 12.8.2) FCP 0.8 s · LCP 2.5 s · TBT 30 ms · CLS 0.065 
lần 3: Performance 98/100 (mobile, Lighthouse 12.8.2) FCP 0.8 s · LCP 2.4 s · TBT 30 ms · CLS 0 </div>
<p><strong>5 · Your machine is not the test</strong> — the same fixed blog post, LCP in Chromium:</p>
<div class="out">your laptop · warm (2nd visit) ⇒ LCP 16 ms · load 20 ms · downloaded 1 KB · 10/12 files from cache
your laptop · cold ⇒ LCP 152 ms · load 139 ms · downloaded 249 KB · 0/12 files from cache
phone (slow 4G + 4× CPU) · warm ⇒ LCP 196 ms · load 236 ms · downloaded 1 KB · 10/12 files from cache
phone (slow 4G + 4× CPU) · cold ⇒ LCP 1,384 ms · load 1,673 ms · downloaded 249 KB · 0/12 files from cache</div>
<p><strong>Field data with useReportWebVitals</strong> — a tiny client component sends each metric to <code>/api/vitals</code>; the server logs it; summarise at p75:</p>
<pre><code class="language-typescript">'use client';
import { useReportWebVitals } from 'next/web-vitals';
export default function Vitals() {
  useReportWebVitals((m) =&gt; navigator.sendBeacon('/api/vitals', JSON.stringify({ name: m.name, value: m.value, rating: m.rating })));
  return null;
}</code></pre>
<div class="out">$ tail -f &lt;next start log&gt; | grep '[vitals]'   # what the visits sent home
[vitals] /do/blog LCP 1388 (good)
[vitals] /do/blog INP 48 (good)
[vitals] /do/blog LCP 24 (good)
[vitals] /do/blog INP 48 (good)
[vitals] /do/blog CLS 0.065 (good)
$ node p75.mjs   # count + 75th percentile per metric (how Google summarises field data)
FCP    13 visits · p75 80
TTFB   13 visits · p75 5.2
CLS     9 visits · p75 0
LCP     9 visits · p75 52
INP     1 visits · p75 48</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -rln "useReportWebVitals" src | wc -l | sed 's/^ */tệp gọi useReportWebVitals: /'
tệp gọi useReportWebVitals: 0
$ curl -s https://cuongthai.com/courses/nextjs | grep -o '&lt;script[^&gt;]*src="[^"]*"' …   # count tags, then fetch each one
thẻ &lt;script&gt; trong HTML: 78 (có src: 44)
JS tải về (đã nén theo Accept-Encoding): 757 KB</div>No page calls <code>useReportWebVitals</code>, so cuongthai.com cannot see its own users&#39; numbers (only Search Console can). And the course page shows why tags mislead: dozens of <code>&lt;script&gt;</code> tags, but what matters is the kilobytes behind them.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npx next analyze               <span class="tok-comment">  # treemap per route (Turbopack); -o to write files</span>
npm run build &amp;&amp; npx next start -p 3000
for i in 1 2 3; do npx lighthouse http://localhost:3000/ --only-categories=performance --quiet --output=json --output-path=lh-$i.json; done
<span class="tok-comment"># DevTools → Network: Disable cache + Slow 4G · Performance: CPU 4× slowdown · open in an incognito window</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">“It is fast on my machine” — because you reload a warm page on a fast network. A first-time visitor on a slow phone waits far longer (measured above).</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">You trust a single Lighthouse run? You chase noise between runs and may “fix” something that was never broken.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Field data is an input: anyone can POST to your vitals endpoint, flood your logs, or send fake “good” numbers.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Medians of several runs; cold + throttled tests; rate-limit and validate the vitals endpoint (known metric names, numeric ranges, sampling).</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-5-core-web-vitals" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.5 — Core Web Vitals</span><span class="lc-sub">What LCP, CLS and INP mean</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-1-do-truoc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.1 — Measure first</span><span class="lc-sub">The page before all these fixes</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-19-1-vi-sao-test" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 19.1 — Why test</span><span class="lc-sub">Keep today&#39;s fix from breaking tomorrow</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Measure the same page in dev and in <code>build</code> + <code>start</code>; note dev is slower and unminified, so only the build is representative.</li>
<li>Record a before number, make one change, and record the after number to prove it helped.</li>
<li>Prefer field data (real users) over a single local run when judging performance.</li>
</ol>
<p><strong>Done when:</strong> you can measure performance honestly in production mode and prove changes with numbers.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Production mode</span><span class="v">Measure with <code>build</code>+<code>start</code>, not dev.</span></div>
  <div class="kv"><span class="k">Dev is unminified</span><span class="v">Dev timings are not representative of production.</span></div>
  <div class="kv"><span class="k">Before/after</span><span class="v">Compare numbers to prove a change helped.</span></div>
  <div class="kv"><span class="k">Field data</span><span class="v">Real-user metrics, more trustworthy than one lab run.</span></div>
  <div class="kv"><span class="k">Regression</span><span class="v">A change that makes a metric worse — catch it by measuring.</span></div>
  <div class="kv"><span class="k">Honest measurement</span><span class="v">Measure the thing users actually get.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Measure in production mode (<code>build</code> + <code>start</code>); dev is slower and unminified, so its numbers mislead.</li><li>Record before and after a change to prove it actually helped.</li><li>Trust field data from real users over a single local run.</li><li>Honest measurement means measuring what users actually get, every time.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Bundle Analyzer</span><span class="lc-sub">Visualise what is in your bundle and find the heavy parts.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.5</span>
<h2>Tối ưu bằng con số, không bằng cảm giác</h2>
<p class="lead">Chủ đề của bài đầu chương quay lại làm bài cuối: đo. Mỗi cách sửa ở trên nên được xác nhận bằng một con số thật, vừa để chứng minh nó giúp ích vừa để tránh "tối ưu" thứ chưa bao giờ chậm.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">next build</span><span class="v">Sau một bản build production, Next ghi kích thước JavaScript của mọi route — bản cũ in thành cột First Load JS; Next.js 16 chỉ in ○/ƒ và ghi con số vào <code>.next/diagnostics/route-bundle-stats.json</code>. Đây là thước đo có thẩm quyền của bundle — theo dõi nó tăng hay giảm khi bạn đổi code.</span></div>
  <div class="kv"><span class="k">Lighthouse</span><span class="v">Chấm hiệu năng và liệt kê cách sửa cụ thể (ảnh to, JS thừa, layout shift). Chạy trên bản build production, không phải dev — dev cố tình chậm hơn.</span></div>
  <div class="kv"><span class="k">Tab Network</span><span class="v">Hiện mọi file trang tải về và kích thước. Sắp theo kích thước và kẻ nặng thật (thường một ảnh hoặc một thư viện) hiện rõ.</span></div>
  <div class="kv"><span class="k">Bundle analyzer</span><span class="v">Một công cụ vẽ bundle của bạn thành một bản đồ các hộp có kích thước theo cân nặng — cách nhanh nhất để phát hiện một dependency khổng lồ. Next.js 16 có sẵn: <code>next analyze</code> (bản build Turbopack; <code>-o</code> ghi ra <code>.next/diagnostics/analyze</code>). Plugin cũ <code>@next/bundle-analyzer</code> dành cho bản build webpack.</span></div>
</div>

<div class="note-ct">
<p><strong>Một bài học đo lường từ cuongthai.com:</strong> để đánh giá một trang thật sự nặng bao nhiêu, hãy dùng output của <code>next build</code> — <em>không phải</em> đếm số thẻ <code>&lt;script&gt;</code> trong HTML. Đếm thẻ script gây hiểu nhầm: một trang có thể có ít thẻ nhưng kéo vào một lượng JavaScript khổng lồ, hoặc nhiều thẻ tí hon. Báo cáo build cho cân nặng JavaScript thật theo từng route, chính là cái thật sự tới người dùng. Khi so hai phiên bản của một trang, hãy so kích thước build của chúng, không phải nguồn trang "trông thế nào". Đo cái quan trọng, bằng công cụ đo nó đúng.</p>
</div>

<div class="callout ok">
<p><strong>Một quy trình tỉnh táo:</strong> build → chạy Lighthouse (3–5 lần, lấy trung vị: cùng một trang ở đây được 96 / 97 / 98) → sửa mục đầu nó cảnh báo → build lại và xác nhận con số đã dịch. Lặp tới khi đủ nhanh. Cái này giữ bạn trung thực và ngăn bạn đánh bóng những thứ không người dùng nào để ý.</p>
</div>

<h3>Đo thứ người dùng trải nghiệm, không đo thứ BẠN trải nghiệm</h3>
<div class="lz-map">
  <div class="lz-stage">Máy của bạn không phải phép thử</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Bóp băng thông</div><div class="lz-nsub">Slow 4G trong DevTools. Phần lớn thế giới không dùng đường truyền văn phòng của bạn, và phần lớn lỗi loại này chỉ hiện ra ở đó.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Bóp CPU</div><div class="lz-nsub">Làm chậm 4× hoặc 6×. Một chiếc điện thoại tầm trung chậm hơn laptop vài lần, và chi phí JavaScript tăng theo đó.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Thử trên một chiếc điện thoại thật, một lần</div><div class="lz-nsub">Qua mạng nội bộ. Vùng chạm, bàn phím ảo, và các tương tác chỉ-khi-rê-chuột đều hỏng ở đây và không hỏng ở đâu khác.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Rồi theo dõi dữ liệu thực địa</div><div class="lz-nsub">Chỉ số từ người dùng thật trên production — trong Next.js, <code>useReportWebVitals</code> gửi LCP, CLS, INP… của từng lượt về một endpoint của bạn; gom theo mức phần trăm thứ 75. Con số phòng thí nghiệm xếp hạng các thay đổi; con số thực địa nói cho bạn biết nó có ý nghĩa hay không.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một trang nhanh với bạn và chậm với tất cả mọi người, vì bạn chỉ toàn tải nó khi đã có sẵn đệm.</strong> Trình duyệt của bạn đã có sẵn font, ảnh và JavaScript trong đệm; DNS của bạn đã giải xong; đường truyền của bạn ngắn và nhanh. Một người ghé lần đầu bằng điện thoại chẳng có thứ nào trong đó, và lần vẽ đầu tiên của họ có thể chậm gấp năm lần của bạn — đó là lý do trang có cảm giác ổn với cả đội mà lại nhận phàn nàn từ người dùng. Hãy thử trong một cửa sổ ẩn danh với bộ đệm tắt và phép bóp băng thông bật, ít nhất là trước mỗi lần phát hành. Đó mới là người ghé mà bạn đang thật sự dựng trang cho, và đó là một trang khác hẳn.</p></div>
<a class="link-card dl" href="https://web.dev/articles/crux" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">web.dev — Chrome UX Report</span><span class="lc-sub">Dữ liệu thực địa cho mọi trang công khai, gồm trang của bạn và của đối thủ.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/analytics" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Analytics</span><span class="lc-sub">Báo cáo Web Vitals thật từ chính người dùng của bạn bằng useReportWebVitals.</span></span>
</a>


<h3>🔬 Đo thật: năm phép đo trung thực (Next.js 16.4.6 · next start · next analyze · Lighthouse 12.8.2 · Chromium)</h3>
<p><strong>1 · Bộ phân tích</strong> — <code>npx next analyze</code> mở một bản đồ ô vuông cho từng route. Với trang tô màu một dòng bằng <code>highlight.js</code>, phần lớn bản đồ là <code>highlight.js/lib/languages</code> (666,85 KB theo cách tính của bộ phân tích): gần 200 ngôn ngữ.</p>
<p><strong>2 · Đổi MỘT thứ, build lại, so sánh</strong> — import <code>highlight.js/lib/core</code> và chỉ đăng ký <code>javascript</code>:</p>
<div class="out">/do/it       446 KB · gzip 132 KB
/do/blog     472 KB · gzip 141 KB
/do/core     472 KB · gzip 142 KB
/do/nhieu   1391 KB · gzip 433 KB</div>
<p><strong>3 · Đếm thẻ script là sai</strong>:</p>
<div class="out">$ for p in it nhieu core; do curl -s localhost:3000/do/$p | grep -o '&lt;script' | wc -l; done
/do/it: 9 thẻ &lt;script&gt; trong HTML
/do/nhieu: 11 thẻ &lt;script&gt; trong HTML
/do/core: 11 thẻ &lt;script&gt; trong HTML</div>
<p>Cùng số thẻ, 1391 KB so với 472 KB. Thẻ chỉ là con trỏ, không phải kích thước.</p>
<p><strong>4 · Lighthouse dao động</strong> — cùng trang, cùng máy, ba lần:</p>
<div class="out">$ for i in 1 2 3; do npx lighthouse http://localhost:3000/do/blog --only-categories=performance; done
lần 1: Performance 96/100 (mobile, Lighthouse 12.8.2) FCP 0.8 s · LCP 2.7 s · TBT 60 ms · CLS 0.065 
lần 2: Performance 97/100 (mobile, Lighthouse 12.8.2) FCP 0.8 s · LCP 2.5 s · TBT 30 ms · CLS 0.065 
lần 3: Performance 98/100 (mobile, Lighthouse 12.8.2) FCP 0.8 s · LCP 2.4 s · TBT 30 ms · CLS 0 </div>
<p><strong>5 · Máy bạn không phải bài kiểm tra</strong> — cùng bài blog đã sửa, LCP trong Chromium:</p>
<div class="out">laptop của bạn · ấm (lần 2) ⇒ LCP 16 ms · load 20 ms · downloaded 1 KB · 10/12 files from cache
laptop · lạnh ⇒ LCP 152 ms · load 139 ms · downloaded 249 KB · 0/12 files from cache
điện thoại (4G chậm + CPU 4×) · ấm ⇒ LCP 196 ms · load 236 ms · downloaded 1 KB · 10/12 files from cache
điện thoại (4G chậm + CPU 4×) · lạnh ⇒ LCP 1,384 ms · load 1,673 ms · downloaded 249 KB · 0/12 files from cache</div>
<p><strong>Dữ liệu thực địa với useReportWebVitals</strong> — một component client nhỏ gửi từng chỉ số tới <code>/api/vitals</code>; máy chủ ghi log; gom theo p75:</p>
<pre><code class="language-typescript">'use client';
import { useReportWebVitals } from 'next/web-vitals';
export default function Vitals() {
  useReportWebVitals((m) =&gt; navigator.sendBeacon('/api/vitals', JSON.stringify({ name: m.name, value: m.value, rating: m.rating })));
  return null;
}</code></pre>
<div class="out">$ tail -f &lt;next start log&gt; | grep '[vitals]'   # what the visits sent home
[vitals] /do/blog LCP 1388 (good)
[vitals] /do/blog INP 48 (good)
[vitals] /do/blog LCP 24 (good)
[vitals] /do/blog INP 48 (good)
[vitals] /do/blog CLS 0.065 (good)
$ node p75.mjs   # count + 75th percentile per metric (how Google summarises field data)
FCP    13 visits · p75 80
TTFB   13 visits · p75 5.2
CLS     9 visits · p75 0
LCP     9 visits · p75 52
INP     1 visits · p75 48</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -rln "useReportWebVitals" src | wc -l | sed 's/^ */tệp gọi useReportWebVitals: /'
tệp gọi useReportWebVitals: 0
$ curl -s https://cuongthai.com/courses/nextjs | grep -o '&lt;script[^&gt;]*src="[^"]*"' …   # count tags, then fetch each one
thẻ &lt;script&gt; trong HTML: 78 (có src: 44)
JS tải về (đã nén theo Accept-Encoding): 757 KB</div>Chưa trang nào gọi <code>useReportWebVitals</code>, nên cuongthai.com chưa tự thấy số đo của người dùng mình (chỉ Search Console thấy). Và trang khoá học cho thấy vì sao đếm thẻ dễ nhầm: hàng chục thẻ <code>&lt;script&gt;</code>, nhưng thứ đáng kể là số ki-lô-bai phía sau.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npx next analyze               <span class="tok-comment">  # bản đồ từng route (Turbopack); -o để ghi tệp</span>
npm run build &amp;&amp; npx next start -p 3000
for i in 1 2 3; do npx lighthouse http://localhost:3000/ --only-categories=performance --quiet --output=json --output-path=lh-$i.json; done
<span class="tok-comment"># DevTools → Network: Disable cache + Slow 4G · Performance: CPU chậm 4× · mở bằng cửa sổ ẩn danh</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">“Trên máy tôi nhanh mà” — vì bạn mở lại một trang đã ấm trên mạng nhanh. Người lạ trên điện thoại chậm, lần đầu, chờ lâu hơn rất nhiều (đo ở trên).</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Bạn tin một lần chạy Lighthouse? Bạn đuổi theo dao động giữa các lần chạy và có thể “sửa” thứ chưa từng hỏng.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Dữ liệu thực địa là một đầu vào: ai cũng POST được vào endpoint vitals của bạn, làm ngập log, hoặc gửi số “đẹp” giả.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Lấy trung vị nhiều lần chạy; đo lạnh + giới hạn mạng; giới hạn tốc độ và kiểm tra endpoint vitals (tên chỉ số hợp lệ, khoảng số, lấy mẫu).</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-5-core-web-vitals" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.5 — Core Web Vitals</span><span class="lc-sub">LCP, CLS và INP nghĩa là gì</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-1-do-truoc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.1 — Hãy đo trước</span><span class="lc-sub">Trang trước khi sửa</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-19-1-vi-sao-test" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 19.1 — Vì sao test</span><span class="lc-sub">Giữ cho bản sửa hôm nay không hỏng ngày mai</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Đo cùng một trang ở dev và ở <code>build</code> + <code>start</code>; để ý dev chậm hơn và không nén, nên chỉ bản build mới đại diện.</li>
<li>Ghi một con số trước, làm một thay đổi, và ghi con số sau để chứng minh nó có ích.</li>
<li>Ưu tiên dữ liệu field (người dùng thật) hơn một lần chạy cục bộ khi đánh giá hiệu năng.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đo hiệu năng trung thực ở chế độ production và chứng minh thay đổi bằng số.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chế độ production</span><span class="v">Đo bằng <code>build</code>+<code>start</code>, không phải dev.</span></div>
  <div class="kv"><span class="k">Dev không nén</span><span class="v">Thời gian ở dev không đại diện cho production.</span></div>
  <div class="kv"><span class="k">Trước/sau</span><span class="v">So số để chứng minh một thay đổi có ích.</span></div>
  <div class="kv"><span class="k">Dữ liệu field</span><span class="v">Chỉ số người dùng thật, đáng tin hơn một lần chạy lab.</span></div>
  <div class="kv"><span class="k">Regression</span><span class="v">Một thay đổi làm một chỉ số tệ đi — bắt bằng cách đo.</span></div>
  <div class="kv"><span class="k">Đo trung thực</span><span class="v">Đo đúng cái người dùng thật sự nhận.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Đo ở chế độ production (<code>build</code> + <code>start</code>); dev chậm hơn và không nén, nên số của nó gây hiểu lầm.</li><li>Ghi trước và sau một thay đổi để chứng minh nó thật sự có ích.</li><li>Tin dữ liệu field từ người dùng thật hơn một lần chạy cục bộ.</li><li>Đo trung thực nghĩa là đo đúng cái người dùng thật sự nhận, mỗi lần.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Bundle Analyzer</span><span class="lc-sub">Hình dung cái gì trong bundle và tìm phần nặng.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 18.6 QUIZ ─────────────────────────── */
    {
      title: '18.6 — Chapter 18 quiz|||18.6 — Kiểm tra chương 18',
      slug: 'nextjs-18-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về hiệu năng: hai thủ phạm chính, đo trước, next/image (định dạng/lazy/width-height chống CLS/remotePatterns), giảm JS (Server Component/next/dynamic/code split), next/font, và đo bằng next build không đếm thẻ script.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 18: the two main causes of slowness, measure-first, the Image component, shipping less JavaScript (Server Components, next/dynamic, code splitting), next/font, and measuring with next build.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 18: hai nguyên nhân chậm chính, đo trước, component Image, gửi ít JavaScript (Server Component, next/dynamic, code splitting), next/font, và đo bằng next build.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is a "bundle" in a Next.js app?|||"Bundle" trong một app Next.js là gì?',
            options: [
              'the folder of images|||thư mục ảnh',
              'the packaged JavaScript the browser downloads and runs|||gói JavaScript trình duyệt tải và chạy',
              'the database|||database',
              'the CSS file|||file CSS',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Before optimising, the number-one rule is…|||Trước khi tối ưu, quy tắc số một là…',
            options: [
              'rewrite everything|||viết lại mọi thứ',
              'measure first (Lighthouse, next build, Network) so you fix the real bottleneck|||đo trước (Lighthouse, next build, Network) để sửa đúng điểm nghẽn',
              'add more JavaScript|||thêm JavaScript',
              'remove all images|||bỏ hết ảnh',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does next/image do automatically?|||next/image tự làm gì?',
            options: [
              'nothing, it is the same as <img>|||không gì, giống <img>',
              'right-sizes, converts to modern formats, lazy-loads, and reserves space to avoid layout shift|||đúng kích thước, đổi định dạng hiện đại, lazy-load, và giữ chỗ tránh layout shift',
              'uploads images to storage|||upload ảnh lên storage',
              'deletes large images|||xoá ảnh lớn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does <Image> require width and height?|||Vì sao <Image> yêu cầu width và height?',
            options: [
              'to set the exact display pixels|||để đặt đúng pixel hiển thị',
              'to know the aspect ratio and reserve space so content does not jump (CLS)|||để biết tỷ lệ và giữ chỗ để nội dung không nhảy (CLS)',
              'for SEO only|||chỉ cho SEO',
              'they are optional|||chúng tuỳ chọn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Using an image from another domain with next/image requires…|||Dùng một ảnh từ domain khác với next/image cần…',
            options: [
              'nothing extra|||không gì thêm',
              'allowing that domain in next.config.js images.remotePatterns|||cho phép domain đó trong next.config.js images.remotePatterns',
              'downloading it first|||tải nó về trước',
              'converting it to base64|||chuyển nó sang base64',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which ships the LEAST JavaScript to the browser?|||Cái nào gửi ÍT JavaScript nhất tới trình duyệt?',
            options: [
              "a component with 'use client'|||một component có 'use client'",
              'a Server Component (it sends only HTML, no client JS)|||một Server Component (chỉ gửi HTML, không JS client)',
              'a component using useState|||một component dùng useState',
              'they are all the same|||tất cả như nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is next/dynamic used for?|||next/dynamic dùng để làm gì?',
            options: [
              'dynamic routing|||định tuyến động',
              'code splitting a heavy client component so it loads only when needed|||chẻ code một client component nặng để chỉ tải khi cần',
              'fetching data|||fetch dữ liệu',
              'styling|||styling',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why prefer next/font over a normal Google Fonts <link>?|||Vì sao ưu tiên next/font hơn một <link> Google Fonts thường?',
            options: [
              'it is required by React|||React bắt buộc',
              'it self-hosts at build (no third-party request) and avoids the font-swap layout shift|||nó tự-host lúc build (không request bên thứ ba) và tránh layout shift đổi font',
              'it makes fonts bigger|||nó làm font to hơn',
              'there is no difference|||không khác gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A file in the public/ folder, e.g. public/logo.svg, is served at…|||Một file trong thư mục public/, ví dụ public/logo.svg, được phục vụ ở…',
            options: [
              '/public/logo.svg|||/public/logo.svg',
              '/logo.svg|||/logo.svg',
              'it is not served|||không được phục vụ',
              'only after optimisation|||chỉ sau khi tối ưu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'To judge how heavy a page really is, the cuongthai.com lesson says to use…|||Để đánh giá một trang thật sự nặng bao nhiêu, bài học cuongthai.com nói dùng…',
            options: [
              'the count of <script> tags in the HTML|||số thẻ <script> trong HTML',
              'the next build output (real per-route JS size), not the script-tag count|||output next build (kích thước JS thật theo route), không phải đếm thẻ script',
              'the number of images|||số lượng ảnh',
              'how the page feels|||cảm giác về trang',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
