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
