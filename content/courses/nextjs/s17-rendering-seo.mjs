/**
 * Next.js & React — Chương 17: Chiến lược render & SEO. MỞ GIAI ĐOẠN 5.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Viết cho NGƯỜI MỚI HOÀN TOÀN — định nghĩa mọi thuật ngữ (render, HTML, crawler,
 * SEO, OG) khi gặp lần đầu, kèm ví von. Xem [[feedback_nextjs_course_beginner_first]].
 * Thuần khái niệm — không có output console. Sự cố thật cuongthai: OG URL sai làm
 * link Messenger về "/" (17.4). Cache mặc định đổi theo phiên bản → nói tường minh.
 */

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
  <div class="kv"><span class="k">ISR — cooked ahead, re-cooked on a timer</span><span class="v"><b>Incremental Static Regeneration.</b> Like SSG, but the plate is quietly re-cooked every N seconds so it does not go stale. The best of static speed with periodic freshness.</span></div>
</div>

<h3>Why it matters, concretely</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Speed:</b> a page cooked ahead (SSG/ISR) arrives instantly; one cooked per request (SSR) takes a little longer; one the browser must cook (CSR) shows a spinner first.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Freshness:</b> SSR is always current; SSG is frozen at build; ISR refreshes on a schedule; CSR fetches live in the browser.</div></div>
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
  <div class="kv"><span class="k">ISR — nấu sẵn, nấu lại theo hẹn giờ</span><span class="v"><b>Incremental Static Regeneration.</b> Như SSG, nhưng đĩa được lặng lẽ nấu lại mỗi N giây để không bị cũ. Kết hợp tốc độ tĩnh với độ tươi định kỳ.</span></div>
</div>

<h3>Vì sao quan trọng, cụ thể</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Tốc độ:</b> trang nấu sẵn (SSG/ISR) tới tức thì; nấu mỗi request (SSR) lâu hơn chút; trang trình duyệt phải tự nấu (CSR) hiện spinner trước.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Độ tươi:</b> SSR luôn mới; SSG đóng băng lúc build; ISR làm mới theo lịch; CSR fetch trực tiếp trong trình duyệt.</div></div>
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
<p><strong>Beginner gotcha:</strong> accidentally making a whole page dynamic. If you read a cookie or use <code>searchParams</code> high up in a page that could have been static, you opt the entire route out of static rendering. If only a small part needs request data, isolate it (a child component, or stream it with Suspense) so the rest can stay fast and static. "Why is my page suddenly slow / rebuilding every request?" usually traces to one request-specific call added near the top.</p>
</div>

<h3>Deciding per route, not per app</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Ask who the page is for</b> — The same for everyone → static. Different per user → dynamic. That single question decides most routes.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Then ask how fresh it must be</b> — Minutes are fine → revalidate on a timer. Instantly correct after a write → revalidate on demand from the action.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Mixed pages are normal</b> — A static shell with one dynamic widget inside a Suspense boundary. You do not have to pick one mode for a whole page.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Verify in the build output</b> — The route table is the only place the answer is authoritative. Assumptions here are usually wrong.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — making a whole page dynamic because one small part is personal.</strong> A product page that shows &quot;3 in your cart&quot; in the header does not need to be rendered per request: the product content is identical for everyone and the cart count is one number. Marking the route dynamic throws away static generation for the entire page — every visit re-renders the description, the images, the reviews. Keep the page static and let the personal fragment be a Client Component that fetches its own number, or a Suspense boundary streamed separately. The measurement is in the build output and in time-to-first-byte, both of which change immediately.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Partial prerendering</span><span class="lc-sub">Where this pattern is heading: one route, static shell, dynamic holes.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#full-route-cache" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Full Route Cache</span><span class="lc-sub">What static generation actually caches, and what invalidates it.</span></span>
</a>

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
<p><strong>Bẫy người mới:</strong> vô tình làm cả trang thành động. Nếu bạn đọc một cookie hoặc dùng <code>searchParams</code> ở trên cao trong một trang lẽ ra tĩnh được, bạn đưa cả route ra khỏi render tĩnh. Nếu chỉ một phần nhỏ cần dữ liệu request, hãy cô lập nó (một component con, hoặc stream bằng Suspense) để phần còn lại giữ nhanh và tĩnh. "Sao trang tôi bỗng chậm / dựng lại mỗi request?" thường truy về một lời gọi riêng-theo-request thêm gần đầu.</p>
</div>

<h3>Quyết định theo từng route, đừng quyết cho cả ứng dụng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Hãy hỏi trang này dành cho ai</b> — Giống nhau với tất cả → tĩnh. Khác nhau theo từng người → động. Đúng một câu hỏi đó quyết định phần lớn các route.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Rồi hỏi nó phải tươi tới mức nào</b> — Vài phút cũng được → làm mới theo bộ đếm giờ. Phải đúng ngay sau khi ghi → làm mới theo yêu cầu từ chính action.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Trang pha trộn là chuyện bình thường</b> — Một cái vỏ tĩnh với một widget động bên trong một ranh giới Suspense. Bạn không buộc phải chọn một chế độ cho cả trang.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Xác nhận trong đầu ra của build</b> — Bảng route là nơi duy nhất câu trả lời có thẩm quyền. Phỏng đoán ở đây thường là sai.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — làm cả trang thành động chỉ vì một mẩu nhỏ mang tính cá nhân.</strong> Một trang sản phẩm hiện &quot;3 món trong giỏ&quot; ở đầu trang thì chẳng cần render theo từng request: nội dung sản phẩm y hệt nhau với tất cả mọi người còn số món trong giỏ chỉ là một con số. Đánh dấu route là động là vứt bỏ phần sinh tĩnh của cả trang — mỗi lượt ghé lại vẽ lại phần mô tả, các tấm ảnh, các đánh giá. Hãy giữ trang ở dạng tĩnh và để cái mẩu cá nhân đó là một Client Component tự lấy con số của nó, hoặc một ranh giới Suspense được truyền riêng. Phép đo nằm ở đầu ra của build và ở thời gian tới byte đầu tiên, cả hai đều đổi ngay lập tức.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Partial prerendering</span><span class="lc-sub">Hướng đi của mẫu này: một route, vỏ tĩnh, các lỗ động.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#full-route-cache" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Full Route Cache</span><span class="lc-sub">Phần sinh tĩnh thật sự nhớ đệm cái gì, và cái gì vô hiệu hoá nó.</span></span>
</a>

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
<pre><code><span class="tok-comment">// static — most pages</span>
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
<div class="pitfall"><p><strong>Trap — a staging site indexed by Google, competing with production.</strong> A preview deployment with no &#96;robots&#96; rules gets crawled like any other site, and duplicate content on a &#96;*.vercel.app&#96; domain can outrank the real one — or simply leak an unreleased feature. It is invisible until someone searches for your product and finds the staging copy. Set &#96;noindex&#96; on every non-production environment from an environment variable, not by hand, so a new preview cannot be created without it. And check with &#96;curl -s &lt;url&gt; | grep robots&#96; rather than trusting the config.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/metadata" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Metadata files</span><span class="lc-sub">sitemap.ts, robots.ts and the generated metadata files, with the API for each.</span></span>
</a>
<a class="link-card dl" href="https://developers.google.com/search/docs/crawling-indexing/block-indexing" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">Google — Block indexing</span><span class="lc-sub">The correct way to keep an environment out of the index, and how to verify it.</span></span>
</a>

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
<pre><code><span class="tok-comment">// tĩnh — đa số trang</span>
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
<div class="pitfall"><p><strong>Bẫy — một trang thử nghiệm bị Google lập chỉ mục, cạnh tranh với bản production.</strong> Một bản triển khai xem trước không có luật &#96;robots&#96; sẽ bị quét như mọi trang khác, và nội dung trùng lặp trên một tên miền &#96;*.vercel.app&#96; có thể xếp hạng cao hơn bản thật — hoặc đơn giản là làm lộ một tính năng chưa phát hành. Nó vô hình cho tới khi có người tìm sản phẩm của bạn rồi thấy bản thử nghiệm. Hãy đặt &#96;noindex&#96; cho mọi môi trường không phải production bằng một biến môi trường, đừng đặt tay, để một bản xem trước mới không thể được tạo ra mà thiếu nó. Và hãy kiểm bằng &#96;curl -s &lt;url&gt; | grep robots&#96; chứ đừng tin vào cấu hình.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/metadata" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Các file metadata</span><span class="lc-sub">sitemap.ts, robots.ts và các file metadata sinh tự động, kèm API của từng cái.</span></span>
</a>
<a class="link-card dl" href="https://developers.google.com/search/docs/crawling-indexing/block-indexing" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">Google — Chặn lập chỉ mục</span><span class="lc-sub">Cách đúng để giữ một môi trường ngoài chỉ mục, và cách xác minh nó.</span></span>
</a>

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
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.4</span>
<h2>Why a pasted link turns into a pretty card</h2>
<p class="lead">Paste a link into Messenger, Facebook, Zalo, X, or Slack and it expands into a card: an image, a title, a short description. That card is not magic — the platform read a few special <code>&lt;meta&gt;</code> tags in your page's HTML, defined by a standard called <strong>Open Graph (OG)</strong>. If those tags are missing or wrong, the card looks broken — or links to the wrong place.</p>

<h3>Setting Open Graph in metadata</h3>
<p>It is part of the same <code>metadata</code> you already use — just an <code>openGraph</code> section:</p>
<pre><code>export const metadata = {
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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The image needs absolute URLs</b> — A relative path resolves against the crawler&#39;s host, not yours. Always include the scheme and domain.</div></div>
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
<pre><code>export const metadata = {
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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Ảnh cần URL tuyệt đối</b> — Một đường dẫn tương đối sẽ giải theo tên miền của con bot chứ không phải của bạn. Hãy luôn kèm giao thức và tên miền.</div></div>
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

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://web.dev/articles/vitals" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">web.dev — Core Web Vitals</span><span class="lc-sub">LCP, CLS, INP giải thích, kèm ngưỡng mục tiêu.</span></span>
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
