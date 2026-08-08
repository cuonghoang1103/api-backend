/**
 * Next.js & React — Chương 8: App Router (định tuyến bằng thư mục). MỞ GIAI ĐOẠN 3.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Chương này thuần cấu trúc/quy ước Next.js — không có "output console" để chạy.
 * Mọi quy ước file (page/layout/loading/error) là quy ước CHÍNH THỨC của App Router
 * (nextjs.org/docs) và đúng với chính frontend/src/app của cuongthai.com. KHÔNG bịa
 * output; các ví dụ cây thư mục và URL là ánh xạ quy ước, không phải log chạy máy.
 */

export default {
  title: 'Chapter 8 — The App Router: routing by folders|||Chương 8 — App Router: định tuyến bằng thư mục',
  description: 'Next.js là một framework quanh React. Trong App Router, thư mục dưới app/ TRỞ THÀNH đường dẫn: page, layout, loading, error là các file có quy ước. Layout lồng nhau, điều hướng phía client, route group và metadata.',
  lessons: [
    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — From a React app to a Next.js framework|||8.1 — Từ app React tới framework Next.js',
      slug: 'nextjs-8-1-tu-react-toi-nextjs',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Next.js 14 Tutorial - 1 - Introduction" — Codevolution (oEmbed verified).
      video: { url: 'https://youtu.be/ZjAqacIC_3c', durationSeconds: 0 },
      description: 'Bảy chương đầu là React thuần. Từ đây ta bọc React trong Next.js: một framework lo định tuyến, render phía server, và build. Cửa vào là App Router — nơi thư mục chính là bảng route.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1 · Stage 3 begins</span>
<h2>React is a library. Next.js is the framework around it.</h2>
<p class="lead">The first seven chapters were pure React: components, state, hooks, rendering. React only knows how to turn state into UI. It says nothing about how a URL maps to a screen, how to render on a server, or how to ship a production build. Those are a <em>framework's</em> job — and Next.js is that framework.</p>

<h3>What a framework adds on top of React</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Routing</span><span class="v">Which URL shows which UI. In plain React you install a router and configure it in code; in Next.js the <strong>file system</strong> is the route table.</span></div>
  <div class="kv"><span class="k">Server rendering</span><span class="v">Run components on the server, send HTML first. Next.js makes this the default (Server Components — Chapter 9).</span></div>
  <div class="kv"><span class="k">Data & caching</span><span class="v">A defined place and lifecycle for fetching, caching and revalidating data (Chapter 10).</span></div>
  <div class="kv"><span class="k">Build & deploy</span><span class="v">One <code>next build</code> that bundles, splits code, optimises images, and produces something you can run in production (Chapter 20).</span></div>
</div>
<p>You keep everything you learned about React. Next.js does not replace components or hooks — it gives them a home with routing, a server, and a build pipeline wrapped around them.</p>

<h3>Two routers, one winner: App Router</h3>
<p>Next.js has two routing systems for historical reasons. The old <strong>Pages Router</strong> lives in a <code>pages/</code> folder. The modern <strong>App Router</strong> lives in an <code>app/</code> folder and is what every new project should use — it is where Server Components, nested layouts, streaming and Server Actions live. <b>This whole course teaches the App Router.</b> If a tutorial you find online puts files in <code>pages/</code>, it is the older model.</p>

<h3>The core idea: a folder is a route</h3>
<p>In the App Router, you create routes by creating <em>folders</em> under <code>app/</code>. A folder becomes publicly reachable the moment it contains a <code>page.tsx</code>. The folder path becomes the URL path:</p>
<pre><code>app/
├─ page.tsx            <span class="tok-comment">// →  /</span>
├─ about/
│  └─ page.tsx         <span class="tok-comment">// →  /about</span>
└─ blog/
   ├─ page.tsx         <span class="tok-comment">// →  /blog</span>
   └─ latest/
      └─ page.tsx      <span class="tok-comment">// →  /blog/latest</span></code></pre>
<p>No route configuration file, no <code>&lt;Route path="/about"&gt;</code> to register. You want a page at <code>/about</code>? Make <code>app/about/page.tsx</code>. The URL and the folder are the same thing. That is the single mental shift of this chapter — everything else builds on it.</p>

<h3>The smallest possible page</h3>
<pre><code><span class="tok-comment">// app/about/page.tsx</span>
export default function AboutPage() {
  return &lt;h1&gt;About CuongThai&lt;/h1&gt;;
}</code></pre>
<p>A page is just a React component that is the default export of a <code>page.tsx</code> file. Visiting <code>/about</code> renders it. Note something you will unpack next chapter: this component runs on the <em>server</em> by default — it never ships to the browser unless you opt in.</p>

<div class="note-ct">
<p><strong>This is exactly how cuongthai.com is built.</strong> Its frontend lives in <code>frontend/src/app/</code> — every page you have visited (<code>/feed</code>, <code>/courses</code>, <code>/exam</code>, this very lesson page) is a <code>page.tsx</code> inside a folder of that name, wrapped by layouts. The App Router is not a toy for this course; it is the production router of the site you are learning on.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Routing Fundamentals</span><span class="lc-sub">The official model for the App Router: segments, folders, and the special files.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/defining-routes" target="_blank" rel="noopener">
  <span class="lc-ico">📁</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Defining Routes</span><span class="lc-sub">How folders and page.tsx create URLs, step by step.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1 · Mở Giai đoạn 3</span>
<h2>React là một thư viện. Next.js là framework bọc quanh nó.</h2>
<p class="lead">Bảy chương đầu là React thuần: component, state, hook, render. React chỉ biết biến state thành UI. Nó không nói gì về việc một URL ánh xạ ra màn hình nào, làm sao render trên server, hay làm sao đóng gói bản production. Đó là việc của một <em>framework</em> — và Next.js chính là framework đó.</p>

<h3>Framework thêm gì lên trên React</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Định tuyến</span><span class="v">URL nào hiện UI nào. React thuần thì bạn cài một router và cấu hình bằng code; Next.js thì <strong>hệ thống file</strong> chính là bảng route.</span></div>
  <div class="kv"><span class="k">Render phía server</span><span class="v">Chạy component trên server, gửi HTML trước. Next.js đặt đây làm mặc định (Server Component — Chương 9).</span></div>
  <div class="kv"><span class="k">Dữ liệu &amp; cache</span><span class="v">Một chỗ và vòng đời rõ ràng để fetch, cache và revalidate dữ liệu (Chương 10).</span></div>
  <div class="kv"><span class="k">Build &amp; deploy</span><span class="v">Một lệnh <code>next build</code> đóng gói, tách code, tối ưu ảnh, và tạo ra thứ chạy được ở production (Chương 20).</span></div>
</div>
<p>Bạn giữ nguyên mọi thứ đã học về React. Next.js không thay component hay hook — nó cho chúng một mái nhà, quấn quanh là định tuyến, một server, và một dây chuyền build.</p>

<h3>Hai router, một kẻ thắng: App Router</h3>
<p>Next.js có hai hệ định tuyến vì lý do lịch sử. <strong>Pages Router</strong> cũ nằm trong thư mục <code>pages/</code>. <strong>App Router</strong> hiện đại nằm trong thư mục <code>app/</code> và là thứ mọi dự án mới nên dùng — đây là nơi Server Component, layout lồng, streaming và Server Actions sống. <b>Cả khoá này dạy App Router.</b> Nếu một hướng dẫn trên mạng đặt file vào <code>pages/</code>, đó là mô hình cũ.</p>

<h3>Ý tưởng cốt lõi: một thư mục là một route</h3>
<p>Trong App Router, bạn tạo route bằng cách tạo <em>thư mục</em> dưới <code>app/</code>. Một thư mục trở nên truy cập được ngay khi nó chứa một file <code>page.tsx</code>. Đường dẫn thư mục trở thành đường dẫn URL:</p>
<pre><code>app/
├─ page.tsx            <span class="tok-comment">// →  /</span>
├─ about/
│  └─ page.tsx         <span class="tok-comment">// →  /about</span>
└─ blog/
   ├─ page.tsx         <span class="tok-comment">// →  /blog</span>
   └─ latest/
      └─ page.tsx      <span class="tok-comment">// →  /blog/latest</span></code></pre>
<p>Không file cấu hình route, không phải đăng ký <code>&lt;Route path="/about"&gt;</code>. Muốn trang ở <code>/about</code>? Tạo <code>app/about/page.tsx</code>. URL và thư mục là một. Đó là cú chuyển tư duy duy nhất của chương này — mọi thứ khác dựng trên nó.</p>

<h3>Trang nhỏ nhất có thể</h3>
<pre><code><span class="tok-comment">// app/about/page.tsx</span>
export default function AboutPage() {
  return &lt;h1&gt;Về CuongThai&lt;/h1&gt;;
}</code></pre>
<p>Một page chỉ là một component React được export mặc định từ file <code>page.tsx</code>. Vào <code>/about</code> là nó render. Để ý điều bạn sẽ mổ xẻ ở chương sau: component này chạy trên <em>server</em> theo mặc định — nó không bao giờ xuống trình duyệt trừ khi bạn chủ động chọn.</p>

<div class="note-ct">
<p><strong>Đây đúng là cách cuongthai.com được dựng.</strong> Frontend của nó nằm trong <code>frontend/src/app/</code> — mọi trang bạn từng vào (<code>/feed</code>, <code>/courses</code>, <code>/exam</code>, chính trang bài học này) đều là một <code>page.tsx</code> trong thư mục cùng tên, bọc bởi các layout. App Router không phải đồ chơi cho khoá học; nó là router production của chính site bạn đang học.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Routing Fundamentals</span><span class="lc-sub">Mô hình chính thức của App Router: segment, thư mục, và các file quy ước.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/defining-routes" target="_blank" rel="noopener">
  <span class="lc-ico">📁</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Defining Routes</span><span class="lc-sub">Cách thư mục và page.tsx tạo URL, từng bước.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — The special files: page, layout, loading, error|||8.2 — Các file quy ước: page, layout, loading, error',
      slug: 'nextjs-8-2-cac-file-quy-uoc',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Trong một route segment, một số TÊN FILE có ý nghĩa đặc biệt. page hiện UI, layout bọc, loading là fallback, error là ranh giới lỗi, not-found, route là API. Biết đúng vai từng file.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Inside a folder, certain file names are reserved</h2>
<p class="lead">A route segment (one folder) can hold more than a page. The App Router reserves a handful of file names, each with a specific job. You do not import or wire them — Next.js finds them by name and slots them into the right place.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">page.tsx</span><span class="v">The UI for this route. <strong>A segment is only publicly routable if it has a page.</strong> Its default export is the component shown at that URL.</span></div>
  <div class="kv"><span class="k">layout.tsx</span><span class="v">A wrapper shared by this segment and everything nested below it. Receives <code>children</code> and stays mounted across navigation (next lesson).</span></div>
  <div class="kv"><span class="k">loading.tsx</span><span class="v">A fallback shown while the segment is loading. Next.js wraps the segment in a Suspense boundary for you.</span></div>
  <div class="kv"><span class="k">error.tsx</span><span class="v">An error boundary for the segment. Must be a Client Component (<code>'use client'</code>) and gets <code>error</code> + <code>reset</code> props.</span></div>
  <div class="kv"><span class="k">not-found.tsx</span><span class="v">UI for a missing resource, or when you call <code>notFound()</code> in code.</span></div>
  <div class="kv"><span class="k">route.ts</span><span class="v">An API endpoint instead of a page (export <code>GET</code>, <code>POST</code>…). A folder cannot have both <code>page</code> and <code>route</code>.</span></div>
</div>

<h3>A folder with no page.tsx is not a route</h3>
<p>This trips up beginners constantly. Putting a component file in <code>app/dashboard/Chart.tsx</code> does <em>not</em> create <code>/dashboard/Chart</code>. Only <code>page.tsx</code> (and <code>route.ts</code>) make a segment reachable. Everything else — helper components, styles, tests — can live in the folder freely and is simply ignored by the router. This is called <em>colocation</em>: keep a route's parts next to it.</p>
<pre><code>app/dashboard/
├─ page.tsx        <span class="tok-comment">// → /dashboard  (routable)</span>
├─ Chart.tsx       <span class="tok-comment">// just a component; NOT a route</span>
├─ utils.ts        <span class="tok-comment">// helper; ignored by router</span>
└─ loading.tsx     <span class="tok-comment">// fallback for /dashboard</span></code></pre>

<h3>How they stack at one URL</h3>
<p>When you visit a route, Next.js composes these files from the outside in — layouts wrap loading/error which wrap the page:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>layout.tsx</b> renders and provides the frame (nav, shell).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">While the page's data resolves, <b>loading.tsx</b> shows in the layout's slot.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">If the page throws, <b>error.tsx</b> takes that slot instead — the layout stays.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb">On success, <b>page.tsx</b> fills the slot.</div></div>
</div>

<div class="callout warn">
<p><strong>error.tsx must be a Client Component.</strong> An error boundary needs to catch runtime errors and offer a <code>reset()</code> — that requires client-side JavaScript. Forget <code>'use client'</code> at the top of <code>error.tsx</code> and it will not work. (What "Client Component" means is the whole of Chapter 9.)</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — File Conventions</span><span class="lc-sub">Every reserved file name and the exact props each receives.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Trong một thư mục, vài tên file được dành riêng</h2>
<p class="lead">Một route segment (một thư mục) chứa được nhiều hơn một page. App Router dành riêng một số tên file, mỗi tên một việc. Bạn không import hay nối dây chúng — Next.js tìm theo tên và đặt vào đúng chỗ.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">page.tsx</span><span class="v">UI cho route này. <strong>Một segment chỉ truy cập được nếu có page.</strong> Export mặc định của nó là component hiện ở URL đó.</span></div>
  <div class="kv"><span class="k">layout.tsx</span><span class="v">Lớp bọc dùng chung cho segment này và mọi thứ lồng bên dưới. Nhận <code>children</code> và giữ nguyên qua các lần điều hướng (bài sau).</span></div>
  <div class="kv"><span class="k">loading.tsx</span><span class="v">Fallback hiện trong lúc segment đang tải. Next.js tự bọc segment trong một ranh giới Suspense.</span></div>
  <div class="kv"><span class="k">error.tsx</span><span class="v">Ranh giới lỗi cho segment. Phải là Client Component (<code>'use client'</code>) và nhận props <code>error</code> + <code>reset</code>.</span></div>
  <div class="kv"><span class="k">not-found.tsx</span><span class="v">UI cho tài nguyên không có, hoặc khi bạn gọi <code>notFound()</code> trong code.</span></div>
  <div class="kv"><span class="k">route.ts</span><span class="v">Một endpoint API thay vì page (export <code>GET</code>, <code>POST</code>…). Một thư mục không thể vừa có <code>page</code> vừa có <code>route</code>.</span></div>
</div>

<h3>Thư mục không có page.tsx thì không phải route</h3>
<p>Chỗ này người mới vấp liên tục. Đặt một file component ở <code>app/dashboard/Chart.tsx</code> <em>không</em> tạo ra <code>/dashboard/Chart</code>. Chỉ <code>page.tsx</code> (và <code>route.ts</code>) mới làm segment truy cập được. Mọi thứ khác — component phụ, style, test — cứ nằm trong thư mục thoải mái và bị router bỏ qua. Đây gọi là <em>colocation</em>: giữ các mảnh của một route ngay cạnh nó.</p>
<pre><code>app/dashboard/
├─ page.tsx        <span class="tok-comment">// → /dashboard  (là route)</span>
├─ Chart.tsx       <span class="tok-comment">// chỉ là component; KHÔNG phải route</span>
├─ utils.ts        <span class="tok-comment">// hàm phụ; router bỏ qua</span>
└─ loading.tsx     <span class="tok-comment">// fallback cho /dashboard</span></code></pre>

<h3>Chúng xếp chồng ra sao ở một URL</h3>
<p>Khi bạn vào một route, Next.js ghép các file này từ ngoài vào trong — layout bọc loading/error, hai cái này bọc page:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>layout.tsx</b> render và cung cấp khung (nav, vỏ).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">Trong lúc dữ liệu của page đang về, <b>loading.tsx</b> hiện ở khe của layout.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Nếu page ném lỗi, <b>error.tsx</b> chiếm khe đó thay — layout vẫn ở nguyên.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb">Khi thành công, <b>page.tsx</b> lấp vào khe.</div></div>
</div>

<div class="callout warn">
<p><strong>error.tsx phải là Client Component.</strong> Một ranh giới lỗi cần bắt lỗi lúc chạy và đưa ra <code>reset()</code> — thứ đó cần JavaScript phía client. Quên <code>'use client'</code> ở đầu <code>error.tsx</code> là nó không hoạt động. (Client Component nghĩa là gì thì cả Chương 9 nói.)</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — File Conventions</span><span class="lc-sub">Mọi tên file dành riêng và đúng props mà mỗi cái nhận.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — Nested layouts: shared UI that persists|||8.3 — Layout lồng: UI dùng chung, giữ nguyên khi chuyển trang',
      slug: 'nextjs-8-3-layout-long',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Layout bọc mọi thứ lồng dưới nó. Root layout bắt buộc và chứa html/body. Điểm mấu chốt: chuyển giữa các trang anh em, layout KHÔNG render lại — state trong nav, scroll, player nhạc đều giữ nguyên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Layouts wrap their subtree — and survive navigation</h2>
<p class="lead">A <code>layout.tsx</code> renders shared UI around a set of routes. The one at the top of <code>app/</code> is the <strong>root layout</strong>; it is required, and it is the only place your <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code> tags live. Deeper layouts wrap smaller sections. The property that makes layouts powerful is what they do <em>not</em> do on navigation.</p>

<h3>The shape of a layout</h3>
<pre><code><span class="tok-comment">// app/layout.tsx — the ROOT layout (required)</span>
export default function RootLayout({ children }) {
  return (
    &lt;html lang="vi"&gt;
      &lt;body&gt;
        &lt;SiteNav /&gt;
        {children}          <span class="tok-comment">// the active page renders here</span>
      &lt;/body&gt;
    &lt;/html&gt;
  );
}</code></pre>
<p>A layout always takes a <code>children</code> prop and decides where it goes. Whatever route is active gets slotted into <code>{children}</code>. This is the composition idea from Chapter 2 (children as a slot), now applied by the router itself.</p>

<h3>Layouts nest to match the folders</h3>
<pre><code>app/
├─ layout.tsx           <span class="tok-comment">// wraps EVERYTHING</span>
├─ page.tsx             <span class="tok-comment">// /</span>
└─ dashboard/
   ├─ layout.tsx        <span class="tok-comment">// wraps only /dashboard/*</span>
   ├─ page.tsx          <span class="tok-comment">// /dashboard</span>
   └─ settings/
      └─ page.tsx       <span class="tok-comment">// /dashboard/settings</span></code></pre>
<p>Visiting <code>/dashboard/settings</code> composes: root layout → dashboard layout → settings page. Each layout wraps the next. A dashboard sidebar written once in <code>dashboard/layout.tsx</code> shows on every route beneath it, and nowhere else.</p>

<h3>The behaviour that matters: layouts do not re-mount</h3>
<p>When you navigate between two pages that share a layout — say <code>/dashboard</code> → <code>/dashboard/settings</code> — Next.js swaps only the part that changed (the page in the slot). <strong>The shared layout is not unmounted and re-rendered.</strong> Its component state, its scroll position, any running media all persist.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">What this buys you</span><span class="v">A music player in the layout keeps playing across page changes. An open sidebar stays open. A scroll position in a nav list is kept. No re-mount, no flash.</span></div>
  <div class="kv"><span class="k">The contrast</span><span class="v">A full-page <code>&lt;a href&gt;</code> reload would tear all of that down and rebuild from scratch — which is exactly why you use client navigation (next lesson), not anchor reloads.</span></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com relies on this directly.</strong> The site's persistent chrome — the top navigation, the auth state, the theme — lives in layouts, so moving from <code>/feed</code> to <code>/courses</code> never re-mounts the shell or drops your session in memory. The music feature depends on the same guarantee: audio started on one page keeps playing as you browse, because the player sits above the page slot in a layout, not inside the page.</p>
</div>

<h3>layout vs template</h3>
<p>There is a sibling file, <code>template.tsx</code>, that looks like a layout but <em>does</em> re-mount on every navigation. You reach for it in the rare case you want a fresh instance each time (e.g. re-run an enter animation, reset per-page state). Ninety-nine times out of a hundred you want <code>layout.tsx</code> and its persistence.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Pages and Layouts</span><span class="lc-sub">Root layout, nesting, and why layouts preserve state across navigation.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Layout bọc cây con của nó — và sống sót qua điều hướng</h2>
<p class="lead">Một <code>layout.tsx</code> render UI dùng chung quanh một nhóm route. Cái ở đỉnh <code>app/</code> là <strong>root layout</strong>; nó bắt buộc, và là nơi <em>duy nhất</em> chứa thẻ <code>&lt;html&gt;</code> và <code>&lt;body&gt;</code>. Layout sâu hơn bọc các phần nhỏ hơn. Điều làm layout mạnh mẽ lại là thứ nó <em>không</em> làm khi điều hướng.</p>

<h3>Hình dạng một layout</h3>
<pre><code><span class="tok-comment">// app/layout.tsx — root layout (bắt buộc)</span>
export default function RootLayout({ children }) {
  return (
    &lt;html lang="vi"&gt;
      &lt;body&gt;
        &lt;SiteNav /&gt;
        {children}          <span class="tok-comment">// page đang active render ở đây</span>
      &lt;/body&gt;
    &lt;/html&gt;
  );
}</code></pre>
<p>Một layout luôn nhận prop <code>children</code> và quyết nó đặt ở đâu. Route nào đang active thì được lồng vào <code>{children}</code>. Đây chính là ý tưởng ghép của Chương 2 (children như một khe cắm), nay do chính router áp dụng.</p>

<h3>Layout lồng khớp với thư mục</h3>
<pre><code>app/
├─ layout.tsx           <span class="tok-comment">// bọc MỌI THỨ</span>
├─ page.tsx             <span class="tok-comment">// /</span>
└─ dashboard/
   ├─ layout.tsx        <span class="tok-comment">// chỉ bọc /dashboard/*</span>
   ├─ page.tsx          <span class="tok-comment">// /dashboard</span>
   └─ settings/
      └─ page.tsx       <span class="tok-comment">// /dashboard/settings</span></code></pre>
<p>Vào <code>/dashboard/settings</code> ghép thành: root layout → dashboard layout → settings page. Mỗi layout bọc cái kế tiếp. Một sidebar dashboard viết một lần trong <code>dashboard/layout.tsx</code> hiện ở mọi route bên dưới nó, và không nơi nào khác.</p>

<h3>Hành vi quan trọng: layout KHÔNG mount lại</h3>
<p>Khi bạn điều hướng giữa hai trang chung một layout — ví dụ <code>/dashboard</code> → <code>/dashboard/settings</code> — Next.js chỉ tráo phần đã đổi (page trong khe). <strong>Layout dùng chung không bị unmount rồi render lại.</strong> State của nó, vị trí cuộn, mọi media đang chạy đều giữ nguyên.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Bạn được gì</span><span class="v">Một trình phát nhạc trong layout tiếp tục phát khi đổi trang. Sidebar đang mở vẫn mở. Vị trí cuộn trong danh sách nav được giữ. Không mount lại, không nháy.</span></div>
  <div class="kv"><span class="k">Đối chiếu</span><span class="v">Một cú tải lại toàn trang bằng <code>&lt;a href&gt;</code> sẽ phá sạch tất cả rồi dựng lại từ đầu — chính vì thế bạn dùng điều hướng phía client (bài sau), không phải anchor tải lại.</span></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com dựa thẳng vào điều này.</strong> Phần khung bền của site — thanh điều hướng trên cùng, state đăng nhập, theme — nằm trong các layout, nên đi từ <code>/feed</code> sang <code>/courses</code> không bao giờ mount lại vỏ hay làm rơi phiên trong bộ nhớ. Tính năng nhạc dựa vào đúng bảo đảm đó: audio bật ở một trang cứ phát tiếp khi bạn duyệt, vì trình phát nằm phía trên khe page trong một layout, không nằm trong page.</p>
</div>

<h3>layout và template</h3>
<p>Có một file anh em, <code>template.tsx</code>, trông như layout nhưng <em>lại</em> mount lại mỗi lần điều hướng. Bạn chỉ dùng nó trong ca hiếm hoi muốn một bản mới mỗi lần (ví dụ chạy lại animation vào trang, reset state theo từng trang). Chín mươi chín trên một trăm lần bạn muốn <code>layout.tsx</code> và tính bền của nó.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Pages and Layouts</span><span class="lc-sub">Root layout, lồng nhau, và vì sao layout giữ state qua điều hướng.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — Navigation: Link, useRouter, and active links|||8.4 — Điều hướng: Link, useRouter và link đang chọn',
      slug: 'nextjs-8-4-dieu-huong-link',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Dùng <Link> để chuyển trang phía client — không tải lại toàn trang, giữ nguyên state layout. useRouter để điều hướng bằng code, usePathname để tô đậm link đang chọn. Bẫy: dùng <a> làm mất hết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Move between routes without reloading the page</h2>
<p class="lead">The previous lesson said layouts persist across navigation — but only if you navigate the right way. The App Router does <em>client-side transitions</em>: it fetches just the new segment and swaps it in, keeping the shared layout mounted. The tool for that is the <code>&lt;Link&gt;</code> component.</p>

<h3>Link, not a bare anchor</h3>
<pre><code>import Link from 'next/link';

&lt;Link href="/courses"&gt;Courses&lt;/Link&gt;
&lt;Link href="/courses/nextjs"&gt;Next.js course&lt;/Link&gt;</code></pre>
<p><code>&lt;Link&gt;</code> renders a real <code>&lt;a&gt;</code> under the hood — accessible, right-clickable, SEO-friendly — but intercepts the click to do a client transition instead of a full browser navigation. It also <strong>prefetches</strong> the target in the background as it scrolls into view, so the jump feels instant.</p>

<div class="pitfall">
<p><strong>Using a plain <code>&lt;a href="/courses"&gt;</code> is the classic beginner bug.</strong> It triggers a full-page reload: the whole app reboots, every layout re-mounts, in-memory state is lost, the music stops, and the prefetch advantage is gone. Inside a Next.js app, internal links go through <code>&lt;Link&gt;</code>. Reserve raw <code>&lt;a&gt;</code> for external URLs (and add <code>target="_blank" rel="noopener"</code> there).</p>
</div>

<h3>Navigating from code: useRouter</h3>
<p>Sometimes you must navigate after something happens — a form submits, a login succeeds. For that, the client hook <code>useRouter</code>:</p>
<pre><code>'use client';
import { useRouter } from 'next/navigation';

function LoginButton() {
  const router = useRouter();
  async function onSubmit() {
    await login();
    router.push('/dashboard');   <span class="tok-comment">// client transition, programmatic</span>
  }
  <span class="tok-comment">// router.replace(), router.back(), router.refresh() also exist</span>
}</code></pre>
<p>Import it from <code>next/navigation</code> (the App Router package), <strong>not</strong> the old <code>next/router</code>. And because it is a hook that uses browser state, it only works in a Client Component — hence the <code>'use client'</code>.</p>

<h3>Highlighting the active link: usePathname</h3>
<pre><code>'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavItem({ href, label }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    &lt;Link href={href} className={active ? 'nav on' : 'nav'}&gt;
      {label}
    &lt;/Link&gt;
  );
}</code></pre>
<p><code>usePathname()</code> returns the current URL path, so you can compare it to a link's <code>href</code> and style the current one. For section-level highlighting use <code>pathname.startsWith(href)</code> instead of <code>===</code>. Its sibling <code>useSearchParams()</code> reads the query string.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Linking and Navigating</span><span class="lc-sub">Link, prefetching, useRouter, and how client transitions work.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Chuyển giữa các route mà không tải lại trang</h2>
<p class="lead">Bài trước nói layout giữ nguyên qua điều hướng — nhưng chỉ khi bạn điều hướng đúng cách. App Router làm <em>chuyển cảnh phía client</em>: nó chỉ fetch segment mới và tráo vào, giữ layout dùng chung vẫn mount. Công cụ cho việc đó là component <code>&lt;Link&gt;</code>.</p>

<h3>Link, không phải anchor trần</h3>
<pre><code>import Link from 'next/link';

&lt;Link href="/courses"&gt;Khoá học&lt;/Link&gt;
&lt;Link href="/courses/nextjs"&gt;Khoá Next.js&lt;/Link&gt;</code></pre>
<p><code>&lt;Link&gt;</code> bên dưới vẫn render một <code>&lt;a&gt;</code> thật — hỗ trợ trợ năng, chuột phải được, thân thiện SEO — nhưng chặn cú click để làm chuyển cảnh client thay vì điều hướng trình duyệt đầy đủ. Nó còn <strong>prefetch</strong> đích ở nền khi cuộn tới, nên cú nhảy cảm giác tức thì.</p>

<div class="pitfall">
<p><strong>Dùng <code>&lt;a href="/courses"&gt;</code> trần là bug kinh điển của người mới.</strong> Nó kích hoạt tải lại toàn trang: cả app khởi động lại, mọi layout mount lại, state trong bộ nhớ mất, nhạc tắt, và lợi thế prefetch bay hết. Bên trong app Next.js, link nội bộ đi qua <code>&lt;Link&gt;</code>. Chỉ để dành <code>&lt;a&gt;</code> trần cho URL ngoài (và thêm <code>target="_blank" rel="noopener"</code> ở đó).</p>
</div>

<h3>Điều hướng từ code: useRouter</h3>
<p>Đôi khi bạn phải điều hướng sau khi có việc xảy ra — form gửi xong, đăng nhập thành công. Cho việc đó, hook client <code>useRouter</code>:</p>
<pre><code>'use client';
import { useRouter } from 'next/navigation';

function LoginButton() {
  const router = useRouter();
  async function onSubmit() {
    await login();
    router.push('/dashboard');   <span class="tok-comment">// chuyển cảnh client, bằng code</span>
  }
  <span class="tok-comment">// còn có router.replace(), router.back(), router.refresh()</span>
}</code></pre>
<p>Import từ <code>next/navigation</code> (gói của App Router), <strong>không phải</strong> <code>next/router</code> cũ. Và vì nó là hook dùng state trình duyệt, nó chỉ chạy trong Client Component — nên có <code>'use client'</code>.</p>

<h3>Tô đậm link đang chọn: usePathname</h3>
<pre><code>'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavItem({ href, label }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    &lt;Link href={href} className={active ? 'nav on' : 'nav'}&gt;
      {label}
    &lt;/Link&gt;
  );
}</code></pre>
<p><code>usePathname()</code> trả về đường dẫn URL hiện tại, để bạn so với <code>href</code> của link và tô cái đang chọn. Muốn tô theo cả mục thì dùng <code>pathname.startsWith(href)</code> thay cho <code>===</code>. Anh em của nó, <code>useSearchParams()</code>, đọc chuỗi query.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Linking and Navigating</span><span class="lc-sub">Link, prefetch, useRouter, và cách chuyển cảnh client hoạt động.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — Route groups, dynamic segments, and metadata|||8.5 — Route group, segment động và metadata',
      slug: 'nextjs-8-5-route-group-metadata',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Thư mục (trong ngoặc) là route group — gom tổ chức và chia layout mà KHÔNG đổi URL. [slug] là segment động nhận params. Và export metadata để đặt title/mô tả cho SEO.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Three routing tools you will reach for constantly</h2>
<p class="lead">You can already make routes, nest layouts, and link between them. Three more features round out day-to-day routing: route groups (organise without changing URLs), dynamic segments (one folder, many URLs), and metadata (titles and SEO).</p>

<h3>Route groups: folders in parentheses</h3>
<p>A folder named <code>(something)</code> is a <strong>route group</strong>. It exists to organise files and share a layout, but its name is <em>stripped from the URL</em>.</p>
<pre><code>app/
├─ (marketing)/
│  ├─ layout.tsx     <span class="tok-comment">// layout for marketing pages</span>
│  ├─ page.tsx       <span class="tok-comment">// →  /        (NOT /marketing)</span>
│  └─ about/page.tsx <span class="tok-comment">// →  /about</span>
└─ (app)/
   ├─ layout.tsx     <span class="tok-comment">// a DIFFERENT layout</span>
   └─ feed/page.tsx  <span class="tok-comment">// →  /feed</span></code></pre>
<p>The parenthesised name never appears in the address bar. This lets you give two sets of pages two different layouts (a marketing shell vs an app shell) while keeping clean top-level URLs.</p>

<h3>Dynamic segments: one folder for many pages</h3>
<p>You cannot make a folder per blog post. A folder named <code>[slug]</code> matches <em>any</em> value in that position and hands it to your page as a param:</p>
<pre><code>app/blog/[slug]/page.tsx     <span class="tok-comment">// matches /blog/hello, /blog/anything</span>

export default async function Post({ params }) {
  const { slug } = await params;   <span class="tok-comment">// e.g. "hello"</span>
  return &lt;article&gt;Post: {slug}&lt;/article&gt;;
}</code></pre>
<p>The square brackets mark the dynamic part; the name inside (<code>slug</code>) is the key you read from <code>params</code>. This is how <code>/courses/nextjs</code> and <code>/courses/nodejs</code> are one file, not two. The deeper routing patterns — catch-all <code>[...slug]</code>, optional, parallel and intercepting routes — are Chapter 11; here, just the everyday single dynamic segment.</p>

<h3>Metadata: titles and SEO from the route</h3>
<p>Every page should set its browser-tab title and description. In the App Router you export a <code>metadata</code> object (static) or a <code>generateMetadata</code> function (when it depends on data):</p>
<pre><code><span class="tok-comment">// static — most pages</span>
export const metadata = {
  title: 'Courses — CuongThai',
  description: 'Learn Next.js, Node.js and more.',
};

<span class="tok-comment">// dynamic — depends on the route's data</span>
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  return { title: course.title + ' — CuongThai' };
}</code></pre>
<p>Next.js turns these into the right <code>&lt;title&gt;</code> and <code>&lt;meta&gt;</code> tags in the HTML <em>head</em> — which is why they must be exported from a Server Component (a page or layout), where the HTML is generated. This is the foundation for SEO and social share cards, covered fully in Chapter 17.</p>

<div class="note-ct">
<p><strong>A real cuongthai.com bug this touches:</strong> a shared Messenger link once resolved back to <code>"/"</code> instead of the conversation, because the Open Graph URL in metadata was wrong. Metadata is not decoration — search engines and every social preview read exactly these tags. When a shared link shows the wrong title, image, or destination, the <code>metadata</code>/<code>generateMetadata</code> of that route is the first place to look.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-groups" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route Groups</span><span class="lc-sub">Organise routes and split layouts without touching the URL.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/metadata" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Metadata</span><span class="lc-sub">Static metadata, generateMetadata, and Open Graph for share cards.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Ba công cụ định tuyến bạn sẽ dùng liên tục</h2>
<p class="lead">Bạn đã tạo được route, lồng layout, và link giữa chúng. Ba tính năng nữa làm tròn việc định tuyến hằng ngày: route group (tổ chức mà không đổi URL), segment động (một thư mục, nhiều URL), và metadata (title và SEO).</p>

<h3>Route group: thư mục trong ngoặc đơn</h3>
<p>Một thư mục tên <code>(gì đó)</code> là một <strong>route group</strong>. Nó tồn tại để tổ chức file và chia sẻ layout, nhưng tên của nó <em>bị bỏ khỏi URL</em>.</p>
<pre><code>app/
├─ (marketing)/
│  ├─ layout.tsx     <span class="tok-comment">// layout cho trang marketing</span>
│  ├─ page.tsx       <span class="tok-comment">// →  /        (KHÔNG phải /marketing)</span>
│  └─ about/page.tsx <span class="tok-comment">// →  /about</span>
└─ (app)/
   ├─ layout.tsx     <span class="tok-comment">// một layout KHÁC</span>
   └─ feed/page.tsx  <span class="tok-comment">// →  /feed</span></code></pre>
<p>Tên trong ngoặc không bao giờ hiện trên thanh địa chỉ. Nhờ vậy bạn cho hai nhóm trang hai layout khác nhau (vỏ marketing vs vỏ app) mà vẫn giữ URL cấp cao sạch sẽ.</p>

<h3>Segment động: một thư mục cho nhiều trang</h3>
<p>Bạn không thể tạo một thư mục cho mỗi bài blog. Một thư mục tên <code>[slug]</code> khớp <em>mọi</em> giá trị ở vị trí đó và trao nó cho page qua param:</p>
<pre><code>app/blog/[slug]/page.tsx     <span class="tok-comment">// khớp /blog/hello, /blog/gi-cung-duoc</span>

export default async function Post({ params }) {
  const { slug } = await params;   <span class="tok-comment">// ví dụ "hello"</span>
  return &lt;article&gt;Bài: {slug}&lt;/article&gt;;
}</code></pre>
<p>Cặp ngoặc vuông đánh dấu phần động; tên bên trong (<code>slug</code>) là khoá bạn đọc từ <code>params</code>. Đây là cách <code>/courses/nextjs</code> và <code>/courses/nodejs</code> chỉ là một file, không phải hai. Các mẫu định tuyến sâu hơn — catch-all <code>[...slug]</code>, tuỳ chọn, parallel và intercepting route — là Chương 11; ở đây chỉ một segment động thường ngày.</p>

<h3>Metadata: title và SEO từ route</h3>
<p>Mọi trang nên đặt title trên tab trình duyệt và mô tả. Trong App Router bạn export một object <code>metadata</code> (tĩnh) hoặc một hàm <code>generateMetadata</code> (khi nó phụ thuộc dữ liệu):</p>
<pre><code><span class="tok-comment">// tĩnh — đa số trang</span>
export const metadata = {
  title: 'Khoá học — CuongThai',
  description: 'Học Next.js, Node.js và hơn thế.',
};

<span class="tok-comment">// động — phụ thuộc dữ liệu của route</span>
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  return { title: course.title + ' — CuongThai' };
}</code></pre>
<p>Next.js biến những cái này thành đúng thẻ <code>&lt;title&gt;</code> và <code>&lt;meta&gt;</code> trong phần <em>head</em> của HTML — vì thế chúng phải được export từ một Server Component (một page hay layout), nơi HTML được sinh ra. Đây là nền cho SEO và thẻ chia sẻ mạng xã hội, nói đủ ở Chương 17.</p>

<div class="note-ct">
<p><strong>Một bug thật của cuongthai.com liên quan chỗ này:</strong> một link Messenger được chia sẻ từng trỏ về <code>"/"</code> thay vì cuộc trò chuyện, vì URL Open Graph trong metadata bị sai. Metadata không phải đồ trang trí — máy tìm kiếm và mọi bản xem trước mạng xã hội đọc đúng những thẻ này. Khi một link chia sẻ hiện sai title, ảnh, hay đích đến, <code>metadata</code>/<code>generateMetadata</code> của route đó là chỗ nhìn đầu tiên.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-groups" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route Groups</span><span class="lc-sub">Tổ chức route và chia layout mà không đụng URL.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing/metadata" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Metadata</span><span class="lc-sub">Metadata tĩnh, generateMetadata, và Open Graph cho thẻ chia sẻ.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.6 QUIZ ─────────────────────────── */
    {
      title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra chương 8',
      slug: 'nextjs-8-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về App Router: thư mục thành route, các file quy ước, layout lồng và tính bền, Link vs anchor, route group, segment động và metadata.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 8: how folders become routes, the special files, nested layouts and their persistence, client navigation, route groups, dynamic segments, and metadata.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 8: cách thư mục thành route, các file quy ước, layout lồng và tính bền, điều hướng phía client, route group, segment động, và metadata.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'In the App Router, what makes a folder under app/ a publicly reachable route?|||Trong App Router, cái gì làm một thư mục dưới app/ trở thành route truy cập được?',
            options: [
              'Any .tsx file inside it|||Bất kỳ file .tsx nào bên trong',
              'It contains a page.tsx (or route.ts)|||Nó chứa một page.tsx (hoặc route.ts)',
              'Registering it in a routes config file|||Đăng ký nó trong một file cấu hình route',
              'Naming the folder with a capital letter|||Đặt tên thư mục viết hoa',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What URL does app/blog/latest/page.tsx map to?|||app/blog/latest/page.tsx ánh xạ tới URL nào?',
            options: [
              '/page/blog/latest|||/page/blog/latest',
              '/blog (latest is ignored)|||/blog (latest bị bỏ qua)',
              '/blog/latest|||/blog/latest',
              'It must be configured manually|||Phải cấu hình bằng tay',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You put Chart.tsx in app/dashboard/. Is /dashboard/Chart a route?|||Bạn đặt Chart.tsx trong app/dashboard/. /dashboard/Chart có phải route không?',
            options: [
              'Yes, every component file becomes a route|||Có, mọi file component đều thành route',
              'No — only page.tsx/route.ts create routes; Chart.tsx is just colocated|||Không — chỉ page.tsx/route.ts tạo route; Chart.tsx chỉ nằm cùng chỗ',
              'Only if it has a default export|||Chỉ khi nó có export mặc định',
              'Only in development mode|||Chỉ ở chế độ dev',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which file is required and is the only place <html> and <body> belong?|||File nào bắt buộc và là nơi duy nhất chứa <html> và <body>?',
            options: [
              'app/page.tsx|||app/page.tsx',
              'app/root.tsx|||app/root.tsx',
              'app/layout.tsx (the root layout)|||app/layout.tsx (root layout)',
              'app/index.tsx|||app/index.tsx',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Navigating /dashboard → /dashboard/settings that share a layout. What happens to the layout?|||Điều hướng /dashboard → /dashboard/settings chung một layout. Layout ra sao?',
            options: [
              'It unmounts and re-renders from scratch|||Nó unmount và render lại từ đầu',
              'It stays mounted; only the page slot swaps, so its state persists|||Nó vẫn mount; chỉ khe page tráo, nên state của nó giữ nguyên',
              'It reloads the whole browser page|||Nó tải lại cả trang trình duyệt',
              'Both layout and page are discarded|||Cả layout lẫn page đều bị bỏ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why use <Link href="/feed"> instead of <a href="/feed"> for an internal link?|||Vì sao dùng <Link href="/feed"> thay vì <a href="/feed"> cho link nội bộ?',
            options: [
              '<a> is not valid HTML in Next.js|||<a> không phải HTML hợp lệ trong Next.js',
              'Link does a client transition (keeps layout/state, prefetches); <a> reloads everything|||Link chuyển cảnh client (giữ layout/state, prefetch); <a> tải lại tất cả',
              'They behave identically|||Chúng hành xử giống hệt nhau',
              'Link works only for external URLs|||Link chỉ dùng cho URL ngoài',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which import is correct for useRouter in the App Router?|||Import nào đúng cho useRouter trong App Router?',
            options: [
              "from 'next/router'|||từ 'next/router'",
              "from 'next/navigation' (in a Client Component)|||từ 'next/navigation' (trong Client Component)",
              "from 'react-router-dom'|||từ 'react-router-dom'",
              "from 'next/link'|||từ 'next/link'",
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does a folder named (marketing) do to the URL?|||Thư mục tên (marketing) ảnh hưởng URL thế nào?',
            options: [
              'Adds /marketing to the path|||Thêm /marketing vào đường dẫn',
              'Nothing — the parenthesised name is stripped; it only groups/shares a layout|||Không gì — tên trong ngoặc bị bỏ; nó chỉ gom nhóm/chia layout',
              'Makes the routes private|||Làm các route thành riêng tư',
              'Redirects to a marketing site|||Chuyển hướng tới site marketing',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'app/courses/[slug]/page.tsx — how do you read which course was requested?|||app/courses/[slug]/page.tsx — làm sao đọc khoá học nào được yêu cầu?',
            options: [
              'From a global variable|||Từ một biến toàn cục',
              'From the params prop, e.g. const { slug } = await params|||Từ prop params, ví dụ const { slug } = await params',
              'From useState|||Từ useState',
              'You need one folder per course|||Cần một thư mục cho mỗi khoá',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'To set a page\'s browser-tab title and SEO description in the App Router, you…|||Để đặt title trên tab và mô tả SEO của trang trong App Router, bạn…',
            options: [
              'call document.title in an effect|||gọi document.title trong một effect',
              'export a metadata object or generateMetadata from the page/layout|||export một object metadata hoặc generateMetadata từ page/layout',
              'edit public/index.html|||sửa public/index.html',
              'pass it as a prop to <Link>|||truyền nó làm prop cho <Link>',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
