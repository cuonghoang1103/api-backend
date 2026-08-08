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
