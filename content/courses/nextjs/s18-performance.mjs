/**
 * Next.js & React — Chương 18: Hiệu năng (bundle, ảnh, tải động, font).
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Viết cho người mới — định nghĩa "bundle", "lazy load", "code splitting" khi gặp.
 * Xem [[feedback_nextjs_course_beginner_first]]. Sự cố/bài học thật cuongthai:
 * đo độ nặng bằng `next build` không đếm thẻ script (18.5). Không có output console.
 */

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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The <code>next build</code> output</b> prints the JavaScript size of every route — the honest measure of your bundle (lesson 18.5).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>The Network tab</b> shows what actually downloaded and how big — often one giant image is the whole story.</div></div>
</div>

<div class="callout ok">
<p><strong>The good news:</strong> Next.js ships the two biggest wins almost for free — an image component that shrinks and optimises pictures automatically (next lesson), and Server Components that send zero JavaScript for everything server-rendered (lesson 18.3). You get a fast baseline just by using the framework's defaults; the rest of this chapter is how to keep it fast as the app grows.</p>
</div>

<h3>Measuring before changing anything</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Build first</b> — &#96;next build &amp;&amp; next start&#96;. Development numbers are meaningless — the dev server ships unminified code and re-compiles on demand.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Read the route table</b> — First Load JS per route. A route noticeably larger than its neighbours is where to look, and the number is comparable across commits.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Run Lighthouse on the built app</b> — It reports LCP, CLS and unused bytes with the specific resource named.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Change one thing, rebuild, compare</b> — Two changes at once and you cannot tell which helped. Keep the numbers in the commit message.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — optimising against the development server.</strong> &#96;next dev&#96; compiles on demand, serves unminified bundles, disables most caching and runs React&#39;s development build — so every measurement is wrong in a different direction, and the ones that look worst are often fine in production. People spend an afternoon memoising components because the profiler showed 40ms renders that are 2ms in a build. Worse, the reverse also happens: a genuine problem is hidden because dev serves everything from memory. Measure the built app, every time, and treat the dev server purely as a place to write code.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Optimizing</span><span class="lc-sub">The full list of built-in optimisations, before you add any of your own.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/lighthouse-performance" target="_blank" rel="noopener">
  <span class="lc-ico">🔦</span>
  <span class="lc-body"><span class="lc-title">web.dev — Lighthouse performance</span><span class="lc-sub">How each score is computed, so you know what a number is telling you.</span></span>
</a>

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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Output của <code>next build</code></b> in kích thước JavaScript của mọi route — thước đo trung thực của bundle (bài 18.5).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Tab Network</b> hiện cái gì thật sự tải về và to bao nhiêu — thường một ảnh khổng lồ là toàn bộ câu chuyện.</div></div>
</div>

<div class="callout ok">
<p><strong>Tin vui:</strong> Next.js kèm hai thắng lợi lớn nhất gần như miễn phí — một component ảnh tự thu nhỏ và tối ưu ảnh (bài sau), và Server Component gửi zero JavaScript cho mọi thứ render-trên-server (bài 18.3). Bạn có một nền nhanh chỉ nhờ dùng mặc định của framework; phần còn lại của chương là cách giữ nó nhanh khi app lớn lên.</p>
</div>

<h3>Đo trước khi đổi bất cứ thứ gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Build trước đã</b> — &#96;next build &amp;&amp; next start&#96;. Con số ở môi trường phát triển là vô nghĩa — dev server ship mã chưa nén và biên dịch lại theo yêu cầu.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Đọc bảng route</b> — First Load JS của từng route. Một route to hơn hẳn hàng xóm là chỗ cần soi, và con số đó so sánh được giữa các commit.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Chạy Lighthouse trên bản đã build</b> — Nó báo LCP, CLS và số byte không dùng tới, có gọi tên tài nguyên cụ thể.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Đổi một thứ, build lại, so sánh</b> — Đổi hai thứ cùng lúc là bạn không biết cái nào có tác dụng. Hãy ghi các con số vào thông điệp commit.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tối ưu dựa trên dev server.</strong> &#96;next dev&#96; biên dịch theo yêu cầu, phục vụ gói chưa nén, tắt phần lớn nhớ đệm và chạy bản dựng phát triển của React — nên mọi phép đo đều sai theo một hướng khác nhau, và những cái trông tệ nhất thường lại ổn trên production. Người ta mất cả buổi chiều đi memo các component vì profiler hiện ra những lần render 40ms mà trên bản build chỉ có 2ms. Tệ hơn, chiều ngược lại cũng xảy ra: một vấn đề thật bị giấu đi vì dev phục vụ mọi thứ từ bộ nhớ. Hãy đo trên bản đã build, mọi lần, và coi dev server thuần tuý là chỗ để viết mã.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Tối ưu hoá</span><span class="lc-sub">Danh sách đầy đủ các phép tối ưu có sẵn, trước khi bạn tự thêm cái nào.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/lighthouse-performance" target="_blank" rel="noopener">
  <span class="lc-ico">🔦</span>
  <span class="lc-body"><span class="lc-title">web.dev — Hiệu năng trong Lighthouse</span><span class="lc-sub">Từng điểm số được tính ra sao, để bạn biết một con số đang nói gì.</span></span>
</a>

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
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.2</span>
<h2>Swap &lt;img&gt; for &lt;Image&gt; and pictures optimise themselves</h2>
<p class="lead">Images are usually the heaviest thing on a page. Next.js ships an <code>&lt;Image&gt;</code> component that does the optimisation work for you — you write one tag and get several wins automatically.</p>

<pre><code>import Image from 'next/image';

&lt;Image src="/hero.jpg" alt="Course hero" width={1200} height={630} /&gt;</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Right-sized</span><span class="v">It serves a small version to phones and a larger one to desktops, instead of sending one huge file to everyone.</span></div>
  <div class="kv"><span class="k">Modern formats</span><span class="v">It converts to lighter formats like WebP/AVIF when the browser supports them — often a fraction of the original size.</span></div>
  <div class="kv"><span class="k">Lazy loading</span><span class="v">Images far down the page are not downloaded until you scroll near them. "Lazy load" = load only when needed. Less to fetch up front.</span></div>
  <div class="kv"><span class="k">No layout shift</span><span class="v">Because you give <code>width</code> and <code>height</code>, the browser reserves the exact space before the image loads — so content does not jump (that is the CLS metric from Chapter 17).</span></div>
</div>

<h3>Why width and height are required</h3>
<p>They are not the display size — they tell the browser the image's <em>aspect ratio</em> so it can hold the right amount of space while the image downloads. Reserve the space up front and nothing below it shifts when the picture pops in. (Use <code>fill</code> for images that should stretch to a container instead.)</p>

<div class="callout warn">
<p><strong>One config step for external images.</strong> If your image lives on another domain (a CDN, an image host), Next requires you to allow that domain in <code>next.config.js</code> under <code>images.remotePatterns</code> — a safety measure so your server does not optimise arbitrary URLs. Forgetting it gives a clear "hostname not configured" error; add the domain and it works.</p>
</div>

<div class="callout ok">
<p><strong>The payoff is real:</strong> replacing raw <code>&lt;img&gt;</code> tags with <code>&lt;Image&gt;</code> routinely cuts image bytes by large margins (the video shows a 99% reduction on one file) and fixes layout shift at the same time. For most sites, images are the single biggest performance lever — and this is the lowest-effort way to pull it.</p>
</div>

<h3>What next/image does that an img tag does not</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Serves a modern format</b> — WebP or AVIF when the browser supports it, from the same source file. Usually 30–50% smaller for the same quality.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Resizes per device</b> — One source, several widths, and a &#96;srcset&#96; so a phone does not download a 2000px image.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Reserves the space</b> — Width and height are required, which is what prevents the layout shift that dominates CLS.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Lazy-loads below the fold</b> — And lets you opt the hero image out with &#96;priority&#96;, which is the one image that should load first.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — &#96;priority&#96; on every image, which is the same as on none.</strong> The flag tells the browser to preload that image ahead of other resources. Marking one hero image speeds up LCP; marking twelve makes the browser fetch twelve large files at once on a connection that can carry perhaps two — so everything, including the hero, arrives later than it would have. The Lighthouse warning about too many preloads is easy to miss because each individual &#96;priority&#96; looks harmless. One per screen, on the image that is actually the largest contentful paint, and everything below the fold stays lazy.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/components/image" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Image component</span><span class="lc-sub">Every prop, including sizes, fill, placeholder and the remote-pattern config.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/optimize-lcp" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">web.dev — Optimize LCP</span><span class="lc-sub">Why preloading the right image helps and preloading many hurts.</span></span>
</a>

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

<pre><code>import Image from 'next/image';

&lt;Image src="/hero.jpg" alt="Ảnh bìa khoá" width={1200} height={630} /&gt;</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Đúng kích thước</span><span class="v">Nó dọn một bản nhỏ cho điện thoại và một bản lớn hơn cho desktop, thay vì gửi một file khổng lồ cho mọi người.</span></div>
  <div class="kv"><span class="k">Định dạng hiện đại</span><span class="v">Nó chuyển sang định dạng nhẹ như WebP/AVIF khi trình duyệt hỗ trợ — thường bằng một phần nhỏ kích thước gốc.</span></div>
  <div class="kv"><span class="k">Tải lười (lazy)</span><span class="v">Ảnh ở xa dưới trang không tải cho tới khi bạn cuộn gần chúng. "Lazy load" = chỉ tải khi cần. Ít thứ phải fetch lúc đầu.</span></div>
  <div class="kv"><span class="k">Không nhảy layout</span><span class="v">Vì bạn cho <code>width</code> và <code>height</code>, trình duyệt giữ đúng chỗ trước khi ảnh tải — nên nội dung không nhảy (đó là chỉ số CLS ở Chương 17).</span></div>
</div>

<h3>Vì sao width và height là bắt buộc</h3>
<p>Chúng không phải kích thước hiển thị — chúng nói cho trình duyệt biết <em>tỷ lệ</em> của ảnh để giữ đúng lượng chỗ trong lúc ảnh tải. Giữ chỗ trước thì không gì bên dưới nhảy khi ảnh hiện ra. (Dùng <code>fill</code> cho ảnh nên co giãn theo một container.)</p>

<div class="callout warn">
<p><strong>Một bước cấu hình cho ảnh ngoài.</strong> Nếu ảnh của bạn ở một domain khác (một CDN, một host ảnh), Next yêu cầu bạn cho phép domain đó trong <code>next.config.js</code> dưới <code>images.remotePatterns</code> — một biện pháp an toàn để server bạn không tối ưu URL tuỳ tiện. Quên nó cho một lỗi rõ ràng "hostname not configured"; thêm domain là chạy.</p>
</div>

<div class="callout ok">
<p><strong>Phần thưởng có thật:</strong> thay các thẻ <code>&lt;img&gt;</code> trần bằng <code>&lt;Image&gt;</code> thường cắt bytes ảnh rất nhiều (video cho thấy giảm 99% trên một file) và sửa layout shift cùng lúc. Với đa số site, ảnh là đòn bẩy hiệu năng lớn nhất — và đây là cách tốn ít công nhất để kéo nó.</p>
</div>

<h3>next/image làm gì mà thẻ img không làm</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Phục vụ định dạng hiện đại</b> — WebP hay AVIF khi trình duyệt hỗ trợ, từ cùng một file gốc. Thường nhỏ hơn 30–50% với cùng chất lượng.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Đổi cỡ theo từng thiết bị</b> — Một file gốc, nhiều chiều rộng, và một &#96;srcset&#96; để điện thoại không phải tải một tấm ảnh 2000px.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Giữ chỗ sẵn</b> — Chiều rộng và chiều cao là bắt buộc, và chính điều đó ngăn cú xê dịch bố cục vốn chi phối CLS.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Tải lười phần dưới màn hình</b> — Và cho bạn loại tấm ảnh chính ra khỏi phép tải lười bằng &#96;priority&#96;, đó là tấm duy nhất nên tải trước.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — đặt &#96;priority&#96; cho mọi tấm ảnh, cũng như không đặt cho tấm nào.</strong> Cờ này bảo trình duyệt nạp trước tấm ảnh đó, ưu tiên hơn các tài nguyên khác. Đánh dấu một tấm ảnh chính thì tăng tốc LCP; đánh dấu mười hai tấm thì bắt trình duyệt lấy mười hai file lớn cùng lúc trên một đường truyền tải nổi chừng hai — nên mọi thứ, kể cả tấm ảnh chính, về muộn hơn so với khi không đánh dấu. Cảnh báo của Lighthouse về việc nạp trước quá nhiều rất dễ bỏ sót vì mỗi cái &#96;priority&#96; riêng lẻ trông đều vô hại. Một tấm mỗi màn hình, đặt lên đúng tấm thật sự là lần vẽ nội dung lớn nhất, còn mọi thứ dưới màn hình thì cứ để tải lười.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/components/image" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Component Image</span><span class="lc-sub">Mọi prop, gồm cả sizes, fill, placeholder và cấu hình remote-pattern.</span></span>
</a>
<a class="link-card dl" href="https://web.dev/articles/optimize-lcp" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">web.dev — Tối ưu LCP</span><span class="lc-sub">Vì sao nạp trước đúng tấm ảnh thì giúp ích còn nạp trước nhiều tấm thì có hại.</span></span>
</a>

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
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.3</span>
<h2>The less JavaScript you ship, the faster the page</h2>
<p class="lead">The bundle (from lesson 18.1) is the JavaScript the browser must download and run. Reducing it is the biggest lever for interactivity (INP). You have three tools, and you have already met the most powerful one.</p>

<h3>1 · Server Components ship zero JavaScript</h3>
<p>This is the big one, and it is a recap of Chapter 9: a Server Component runs on the server and sends only HTML — <em>none</em> of its own code goes to the browser. So the more of your UI you keep as Server Components (and the smaller you keep the <code>'use client'</code> leaves), the less JavaScript ships. Performance is one of the main reasons the App Router made server-first the default.</p>

<h3>2 · Dynamic import: load heavy parts only when needed</h3>
<p>Some client components are big and not needed immediately — a chart library, a rich text editor, a map, a modal that opens on click. <strong>Code splitting</strong> means breaking the bundle into pieces so the browser downloads a piece only when it is actually needed. Next does this per route automatically, and you can do it per component with <code>next/dynamic</code>:</p>
<pre><code>import dynamic from 'next/dynamic';

<span class="tok-comment">// HeavyChart's code is NOT in the initial bundle;</span>
<span class="tok-comment">// it downloads only when this component renders</span>
const HeavyChart = dynamic(() =&gt; import('./HeavyChart'), {
  loading: () =&gt; &lt;p&gt;Loading chart…&lt;/p&gt;,
});</code></pre>
<p>Now the chart's code is split into its own file and fetched lazily. A visitor who never opens the chart never downloads it. Reach for this whenever a heavy client component is not needed on first paint.</p>

<h3>3 · Automatic route-based splitting</h3>
<p>You get this for free: Next splits code by route, so visiting <code>/about</code> does not download the JavaScript for <code>/dashboard</code>. You only pay for the page you are on. Your job is mostly to avoid accidentally pulling a huge library into a shared component that every route loads.</p>

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
<div class="pitfall"><p><strong>Trap — a single import pulling an entire library into the bundle.</strong> &#96;import _ from &#39;lodash&#39;&#96; to use one function ships the whole library, because the CommonJS build cannot be tree-shaken. The same shape appears with icon packs (&#96;import { Icon } from &#39;@some/icons&#39;&#96; pulling in two thousand SVGs), moment.js and its locales, and a UI kit imported from its root. Nothing warns you; the route just gets 200kB heavier and the build succeeds. The bundle analyser shows it in one picture — run it after adding any dependency, and prefer the per-module import path (&#96;lodash/debounce&#96;) or a smaller library.</p></div>
<a class="link-card dl" href="https://www.npmjs.com/package/@next/bundle-analyzer" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">@next/bundle-analyzer</span><span class="lc-sub">A treemap of what is actually in each bundle. Ten minutes here usually finds something.</span></span>
</a>
<a class="link-card dl" href="https://bundlephobia.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Bundlephobia</span><span class="lc-sub">The cost of a package before you install it, including whether it tree-shakes.</span></span>
</a>

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
<pre><code>import dynamic from 'next/dynamic';

<span class="tok-comment">// Code của HeavyChart KHÔNG nằm trong bundle ban đầu;</span>
<span class="tok-comment">// nó chỉ tải khi component này render</span>
const HeavyChart = dynamic(() =&gt; import('./HeavyChart'), {
  loading: () =&gt; &lt;p&gt;Đang tải biểu đồ…&lt;/p&gt;,
});</code></pre>
<p>Giờ code của biểu đồ được chẻ vào file riêng và fetch lười. Một khách không bao giờ mở biểu đồ thì không bao giờ tải nó. Dùng cái này bất cứ khi nào một client component nặng không cần ở lần paint đầu.</p>

<h3>3 · Chẻ theo route tự động</h3>
<p>Bạn có cái này miễn phí: Next chẻ code theo route, nên vào <code>/about</code> không tải JavaScript của <code>/dashboard</code>. Bạn chỉ trả cho trang mình đang ở. Việc của bạn phần lớn là tránh vô tình kéo một thư viện khổng lồ vào một component dùng chung mà mọi route đều tải.</p>

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
<div class="pitfall"><p><strong>Bẫy — một dòng import kéo cả một thư viện vào gói.</strong> &#96;import _ from &#39;lodash&#39;&#96; để dùng một hàm sẽ ship cả thư viện, vì bản dựng CommonJS không tree-shake được. Cùng hình dạng ấy hiện ra với các bộ icon (&#96;import { Icon } from &#39;@some/icons&#39;&#96; lôi vào hai nghìn file SVG), với moment.js cùng đống ngôn ngữ của nó, và với một bộ UI import từ gốc. Chẳng gì cảnh báo bạn; cái route chỉ nặng thêm 200kB và bản build vẫn thành công. Bộ phân tích gói cho thấy điều đó trong một bức tranh — hãy chạy nó sau khi thêm bất kỳ phụ thuộc nào, và hãy ưu tiên đường import theo từng module (&#96;lodash/debounce&#96;) hoặc một thư viện nhỏ hơn.</p></div>
<a class="link-card dl" href="https://www.npmjs.com/package/@next/bundle-analyzer" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">@next/bundle-analyzer</span><span class="lc-sub">Một sơ đồ cây về thứ thật sự nằm trong từng gói. Mười phút ở đây thường tìm ra thứ gì đó.</span></span>
</a>
<a class="link-card dl" href="https://bundlephobia.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Bundlephobia</span><span class="lc-sub">Chi phí của một package trước khi bạn cài nó, gồm cả việc nó có tree-shake được không.</span></span>
</a>

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
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.4</span>
<h2>Fonts: a small thing that quietly hurts performance</h2>
<p class="lead">Custom web fonts are lovely but easy to get wrong. Loaded naively, they add a network request to a third party, and cause text to flash — first in a fallback font, then jumping to the real one (a layout shift, hurting CLS). Next.js solves this with <code>next/font</code>.</p>

<pre><code>import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return &lt;html className={inter.className}&gt;&lt;body&gt;{children}&lt;/body&gt;&lt;/html&gt;;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Self-hosted at build</span><span class="v">The font file is downloaded at build and served from your own site — no request to Google's servers at runtime, so no third-party round trip and better privacy.</span></div>
  <div class="kv"><span class="k">No layout shift</span><span class="v">Next reserves space and matches metrics so text does not jump when the custom font arrives.</span></div>
  <div class="kv"><span class="k">Subsetting</span><span class="v"><code>subsets: ['latin']</code> ships only the characters you need, not the whole font — smaller download.</span></div>
</div>

<h3>The public/ folder for static files</h3>
<p>Files in a top-level <code>public/</code> folder are served as-is at the root URL. Put <code>public/logo.svg</code> and it is available at <code>/logo.svg</code>. Use it for favicons, static icons, robots files, and small images that do not need optimisation.</p>
<pre><code>public/
├─ favicon.ico     <span class="tok-comment">// → /favicon.ico</span>
└─ logo.svg        <span class="tok-comment">// → /logo.svg</span></code></pre>

<div class="callout warn">
<p><strong>A gotcha you will meet again in Chapter 20:</strong> the contents of <code>public/</code> are decided by the running server. If you add or rename files in <code>public/</code> while the dev server is running, you often must restart it for the new files to be served — otherwise you get a confusing 404 for a file that clearly exists on disk. (This exact class of bug once made a whole page hang; the deploy chapter has the full story.)</p>
</div>

<h3>Fonts, without the flash and the round trip</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Use next/font</b> — It downloads the font at build time and serves it from your own domain. No request to Google, and no third-party dependency in the critical path.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It sets font-display automatically</b> — &#96;swap&#96; by default, so text is readable immediately in a fallback and swaps when the real font arrives.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It computes fallback metrics</b> — Matching the fallback&#39;s size to the real font, so the swap does not move the text — CLS from fonts goes to zero.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Subset what you need</b> — &#96;subsets: [&#39;latin&#39;, &#39;vietnamese&#39;]&#96;. Loading every script in a font is often larger than the rest of the page.</div></div>
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

<pre><code>import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return &lt;html className={inter.className}&gt;&lt;body&gt;{children}&lt;/body&gt;&lt;/html&gt;;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Tự-host lúc build</span><span class="v">File font được tải lúc build và phục vụ từ chính site bạn — không request tới server Google lúc chạy, nên không vòng đi bên thứ ba và riêng tư hơn.</span></div>
  <div class="kv"><span class="k">Không nhảy layout</span><span class="v">Next giữ chỗ và khớp số đo để chữ không nhảy khi font tuỳ chỉnh tới.</span></div>
  <div class="kv"><span class="k">Subset</span><span class="v"><code>subsets: ['latin']</code> chỉ gửi các ký tự bạn cần, không phải cả font — tải nhẹ hơn.</span></div>
</div>

<h3>Thư mục public/ cho file tĩnh</h3>
<p>File trong thư mục cấp cao <code>public/</code> được phục vụ nguyên trạng ở URL gốc. Đặt <code>public/logo.svg</code> và nó có ở <code>/logo.svg</code>. Dùng cho favicon, icon tĩnh, file robots, và ảnh nhỏ không cần tối ưu.</p>
<pre><code>public/
├─ favicon.ico     <span class="tok-comment">// → /favicon.ico</span>
└─ logo.svg        <span class="tok-comment">// → /logo.svg</span></code></pre>

<div class="callout warn">
<p><strong>Một bẫy bạn sẽ gặp lại ở Chương 20:</strong> nội dung của <code>public/</code> được quyết bởi server đang chạy. Nếu bạn thêm hoặc đổi tên file trong <code>public/</code> khi dev server đang chạy, bạn thường phải khởi động lại nó để file mới được phục vụ — nếu không bạn nhận một 404 khó hiểu cho một file rõ ràng có trên đĩa. (Đúng loại bug này từng làm cả một trang treo; chương deploy có toàn bộ câu chuyện.)</p>
</div>

<h3>Font, không chớp sáng và không đi vòng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Hãy dùng next/font</b> — Nó tải font về lúc build và phục vụ từ chính tên miền của bạn. Không request tới Google, và không có phụ thuộc bên thứ ba nào trên đường tới hạn.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó tự đặt font-display</b> — Mặc định là &#96;swap&#96;, nên chữ đọc được ngay bằng font dự phòng rồi đổi khi font thật về.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó tính các thông số cho font dự phòng</b> — Khớp kích thước của font dự phòng với font thật, để cú đổi không làm chữ xê dịch — CLS do font về không.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Chỉ lấy tập ký tự bạn cần</b> — &#96;subsets: [&#39;latin&#39;, &#39;vietnamese&#39;]&#96;. Nạp mọi hệ chữ trong một font thường còn nặng hơn cả phần còn lại của trang.</div></div>
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

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/fonts" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Font Optimization</span><span class="lc-sub">next/font, tự-host, subset, và tránh layout shift.</span></span>
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
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.5</span>
<h2>Optimise with numbers, not vibes</h2>
<p class="lead">The theme of this chapter's first lesson returns as its last: measure. Each fix above should be confirmed against a real number, both to prove it helped and to avoid "optimising" what was never slow.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">next build</span><span class="v">After a production build, Next prints a table of every route with its JavaScript size (First Load JS). This is the authoritative measure of your bundle — watch it grow or shrink as you change code.</span></div>
  <div class="kv"><span class="k">Lighthouse</span><span class="v">Grades performance and lists concrete fixes (big images, unused JS, layout shift). Run it on a production build, not dev — dev is intentionally slower.</span></div>
  <div class="kv"><span class="k">Network tab</span><span class="v">Shows every file the page downloaded and its size. Sort by size and the true heavyweight (usually one image or one library) is obvious.</span></div>
  <div class="kv"><span class="k">Bundle analyzer</span><span class="v">A tool that draws your bundle as a map of boxes sized by weight — the fastest way to spot one giant dependency.</span></div>
</div>

<div class="note-ct">
<p><strong>A measuring lesson from cuongthai.com:</strong> to judge how heavy a page really is, use the <code>next build</code> output — <em>not</em> a count of <code>&lt;script&gt;</code> tags in the HTML. Counting script tags is misleading: a page can have few tags but pull in a huge amount of JavaScript, or many tiny ones. The build report gives the real per-route JavaScript weight, which is what actually reaches the user. When comparing two versions of a page, compare their build sizes, not what the page source "looks like." Measure the thing that matters, with the tool that measures it correctly.</p>
</div>

<div class="callout ok">
<p><strong>A sane workflow:</strong> build → run Lighthouse → fix the top item it flags → build again and confirm the number moved. Repeat until it is fast enough. This keeps you honest and stops you from polishing things no user would ever notice.</p>
</div>

<h3>Measuring what users experience, not what you experience</h3>
<div class="lz-map">
  <div class="lz-stage">Your machine is not the test</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Throttle the network</div><div class="lz-nsub">Slow 4G in DevTools. Most of the world is not on your office connection, and most bugs of this class only appear there.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Throttle the CPU</div><div class="lz-nsub">4× or 6× slowdown. A mid-range phone is several times slower than a laptop, and JavaScript cost scales with it.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Test on a real phone once</div><div class="lz-nsub">Over your local network. Touch targets, the on-screen keyboard, and hover-only interactions all fail here and nowhere else.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Then watch the field data</div><div class="lz-nsub">Real-user metrics from production. Lab numbers rank changes; field numbers tell you whether it mattered.</div></div></div>
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
  <div class="kv"><span class="k">next build</span><span class="v">Sau một bản build production, Next in một bảng mọi route với kích thước JavaScript của nó (First Load JS). Đây là thước đo có thẩm quyền của bundle — theo dõi nó tăng hay giảm khi bạn đổi code.</span></div>
  <div class="kv"><span class="k">Lighthouse</span><span class="v">Chấm hiệu năng và liệt kê cách sửa cụ thể (ảnh to, JS thừa, layout shift). Chạy trên bản build production, không phải dev — dev cố tình chậm hơn.</span></div>
  <div class="kv"><span class="k">Tab Network</span><span class="v">Hiện mọi file trang tải về và kích thước. Sắp theo kích thước và kẻ nặng thật (thường một ảnh hoặc một thư viện) hiện rõ.</span></div>
  <div class="kv"><span class="k">Bundle analyzer</span><span class="v">Một công cụ vẽ bundle của bạn thành một bản đồ các hộp có kích thước theo cân nặng — cách nhanh nhất để phát hiện một dependency khổng lồ.</span></div>
</div>

<div class="note-ct">
<p><strong>Một bài học đo lường từ cuongthai.com:</strong> để đánh giá một trang thật sự nặng bao nhiêu, hãy dùng output của <code>next build</code> — <em>không phải</em> đếm số thẻ <code>&lt;script&gt;</code> trong HTML. Đếm thẻ script gây hiểu nhầm: một trang có thể có ít thẻ nhưng kéo vào một lượng JavaScript khổng lồ, hoặc nhiều thẻ tí hon. Báo cáo build cho cân nặng JavaScript thật theo từng route, chính là cái thật sự tới người dùng. Khi so hai phiên bản của một trang, hãy so kích thước build của chúng, không phải nguồn trang "trông thế nào". Đo cái quan trọng, bằng công cụ đo nó đúng.</p>
</div>

<div class="callout ok">
<p><strong>Một quy trình tỉnh táo:</strong> build → chạy Lighthouse → sửa mục đầu nó cảnh báo → build lại và xác nhận con số đã dịch. Lặp tới khi đủ nhanh. Cái này giữ bạn trung thực và ngăn bạn đánh bóng những thứ không người dùng nào để ý.</p>
</div>

<h3>Đo thứ người dùng trải nghiệm, không đo thứ BẠN trải nghiệm</h3>
<div class="lz-map">
  <div class="lz-stage">Máy của bạn không phải phép thử</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Bóp băng thông</div><div class="lz-nsub">Slow 4G trong DevTools. Phần lớn thế giới không dùng đường truyền văn phòng của bạn, và phần lớn lỗi loại này chỉ hiện ra ở đó.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Bóp CPU</div><div class="lz-nsub">Làm chậm 4× hoặc 6×. Một chiếc điện thoại tầm trung chậm hơn laptop vài lần, và chi phí JavaScript tăng theo đó.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Thử trên một chiếc điện thoại thật, một lần</div><div class="lz-nsub">Qua mạng nội bộ. Vùng chạm, bàn phím ảo, và các tương tác chỉ-khi-rê-chuột đều hỏng ở đây và không hỏng ở đâu khác.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Rồi theo dõi dữ liệu thực địa</div><div class="lz-nsub">Chỉ số từ người dùng thật trên production. Con số phòng thí nghiệm xếp hạng các thay đổi; con số thực địa nói cho bạn biết nó có ý nghĩa hay không.</div></div></div>
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
