/**
 * Next.js & React — Chương 8: App Router (định tuyến bằng thư mục). MỞ GIAI ĐOẠN 3.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Chương này thuần cấu trúc/quy ước Next.js — không có "output console" để chạy.
 * Mọi quy ước file (page/layout/loading/error) là quy ước CHÍNH THỨC của App Router
 * (nextjs.org/docs) và đúng với chính frontend/src/app của cuongthai.com. KHÔNG bịa
 * output; các ví dụ cây thư mục và URL là ánh xạ quy ước, không phải log chạy máy.
 */

import G08_1 from './giang/nxj-08-1.mjs';
import G08_2 from './giang/nxj-08-2.mjs';
import G08_3 from './giang/nxj-08-3.mjs';
import G08_4 from './giang/nxj-08-4.mjs';
import G08_5 from './giang/nxj-08-5.mjs';
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
${G08_1}
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
<pre><code class="language-javascript"><span class="tok-comment">// app/about/page.tsx</span>
export default function AboutPage() {
  return &lt;h1&gt;About CuongThai&lt;/h1&gt;;
}</code></pre>
<p>A page is just a React component that is the default export of a <code>page.tsx</code> file. Visiting <code>/about</code> renders it. Note something you will unpack next chapter: this component runs on the <em>server</em> by default — it never ships to the browser unless you opt in.</p>

<div class="note-ct">
<p><strong>This is exactly how cuongthai.com is built.</strong> Its frontend lives in <code>frontend/src/app/</code> — every page you have visited (<code>/feed</code>, <code>/courses</code>, <code>/exam</code>, this very lesson page) is a <code>page.tsx</code> inside a folder of that name, wrapped by layouts. The App Router is not a toy for this course; it is the production router of the site you are learning on.</p>
</div>

<h3>What Next.js adds on top of React</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Routing from the filesystem</b> — A folder is a URL segment. No route table to keep in sync with the pages that actually exist.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>A server that renders</b> — Components can run on the server, close to the database, and send HTML rather than a bundle plus a fetch.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>A build step that knows your routes</b> — It decides per route whether to pre-render at build time, cache, or render per request — and tells you which in the build output.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Conventions instead of configuration</b> — <code>page</code>, <code>layout</code>, <code>loading</code>, <code>error</code>, <code>not-found</code>. Each file name is a behaviour you would otherwise wire up by hand.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — bringing a client-side React mental model into the App Router unchanged.</strong> In a Vite app every component runs in the browser, so <code>useState</code>, <code>window</code> and <code>localStorage</code> are always available. In the App Router the default flips: components run on the server, and the same code throws &quot;window is not defined&quot; at build time or &quot;useState only works in a Client Component&quot; at compile time. The fix is not to add <code>&#39;use client&#39;</code> to everything — that gives up the framework&#39;s main advantage. It is to notice which parts genuinely need the browser and mark only those, which chapter 9 works through in detail.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Routing Fundamentals</span><span class="lc-sub">Segments, folders, and the special files, from the official model.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Learn Next.js</span><span class="lc-sub">The official interactive course; a good second pass over the same material.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In a Next.js app, create <code>app/page.tsx</code> and <code>app/about/page.tsx</code> and visit <code>/</code> and <code>/about</code> — no router config.</li>
<li>Add <code>app/layout.tsx</code> returning <code>html</code>/<code>body</code> and <code>{children}</code>; confirm every page is wrapped by it.</li>
<li>List two things Next.js adds on top of React that you had to do by hand in Stages 1–2.</li>
</ol>
<p><strong>Done when:</strong> you can create routes by folder and see the root layout wrap every page.</p></div>

<h3>🔬 Measured: folders, routes and "server first" (Next.js 16.4.6 · Node 22.23.3)</h3>
<p>A fresh <code>create-next-app</code> project, plus four pages and one page that logs and hides a "secret" string:</p>
<pre><code class="language-tsx"><span class="tok-comment">// Một trang bình thường — KHÔNG có 'use client' ⇒ Server Component</span>
const BI_MAT = 'chuoi-nay-chi-o-may-chu-8-1';

export default function MayChu() {
  console.log('[may-chu] render lúc', new Date().toISOString());
  return &lt;h1&gt;Render ở máy chủ · chuỗi bí mật dài {BI_MAT.length} ký tự&lt;/h1&gt;;
}</code></pre>
<div class="out">$ npm run build
▲ Next.js 16.4.6 (Turbopack)
✓ Running next.config.ts took 19ms
✓ Compiled successfully in 1652ms
[may-chu] render lúc 2026-11-13T11:31:59.214Z
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /blog
├ ○ /blog/latest
└ ○ /may-chu
○  (Static)  prerendered as static content</div>
<div class="out">$ for p in / /about /blog /blog/latest /contact; do curl -s -o /dev/null -w "GET $p → %{http_code}\\n" localhost:3000$p; done
GET / → 200
GET /about → 200
GET /blog → 200
GET /blog/latest → 200
GET /contact → 404</div>
<div class="out">$ grep -rl 'chuoi-nay-chi-o-may-chu' .next/static | wc -l
       0
$ grep -rl 'chuoi-nay-chi-o-may-chu' .next/server | sed 's#.*/server/#.next/server/#' | sort
.next/server/chunks/ssr/[root-of-the-server]__0f5vo0utu7we5._.js.map</div>
<p>The route table lists exactly the folders that contain a <code>page.tsx</code>; <code>/contact</code> has no folder and answers 404 with Next.js's built-in page. The log line of the static (○) page printed <b>once, inside <code>next build</code></b> — the browser console stayed empty and three requests to <code>next start</code> added nothing, because the HTML was rendered ahead of time. The "secret" string is in 0 files of <code>.next/static</code> (what the browser downloads); the page only sends its result, 27.</p>
<p>The trap, measured: <code>useState</code> in a page without <code>'use client'</code> fails at compile time with <i>"You're importing a module that depends on <code>useState</code> into a React Server Component module. This API is only available in Client Components"</i>; reading <code>window</code> passes compilation and fails while prerendering:</p>
<div class="out">Error occurred prerendering page "/bay-window". Read more: https://nextjs.org/docs/messages/prerender-error
ReferenceError: window is not defined</div>
<p>cuongthai.com itself: in <code>frontend/src/app</code> there are</p>
<div class="out">page.tsx     347
layout.tsx   58
loading.tsx  23
route.ts     30</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npx create-next-app@latest my-app <span class="tok-comment">  # No, customize · src/ Yes · Cache Components No</span>
mkdir -p src/app/about &amp;&amp; echo "export default function A() { return &lt;h1&gt;About&lt;/h1&gt;; }" &gt; src/app/about/page.tsx
npm run build          <span class="tok-comment">  # read the route table and where your console.log prints</span>
npx next start -p 3000 &amp; curl -s -o /dev/null -w "%{http_code}\\n" localhost:3000/contact</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-1-router" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.1 — React Router basics</span><span class="lc-sub">Where you wire a route table by hand — Next.js replaces it with folders</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-4-sang-nextjs" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.4 — From React to Next.js</span><span class="lc-sub">What changes, when you need it, how our routes map</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a3-1-typescript-nextjs" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · A3.1 — TypeScript with React & an intro to Next.js</span><span class="lc-sub">If you met it there, this chapter goes deeper</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Framework routing</span><span class="v">Folders in <code>app/</code> map to URLs — no router library to wire up.</span></div>
  <div class="kv"><span class="k">page.tsx</span><span class="v">Makes a route; its default export is the page UI.</span></div>
  <div class="kv"><span class="k">layout.tsx</span><span class="v">Wraps pages with shared UI (<code>html</code>/<code>body</code> at the root).</span></div>
  <div class="kv"><span class="k">Root layout</span><span class="v">The required top layout; every page renders inside its <code>{children}</code>.</span></div>
  <div class="kv"><span class="k">Convention over config</span><span class="v">Next decides routing/build so you do not.</span></div>
  <div class="kv"><span class="k">Server-first</span><span class="v">App Router components run on the server by default.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The App Router turns folders under <code>app/</code> into routes — no router config.</li><li><code>page.tsx</code> defines a route; <code>layout.tsx</code> wraps pages with shared UI.</li><li>A required root layout renders the <code>html</code>/<code>body</code> and every page inside its <code>{children}</code>.</li><li>Next.js adds routing, server rendering and a build system on top of the React you already know.</li></ul>

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
<pre><code class="language-javascript"><span class="tok-comment">// app/about/page.tsx</span>
export default function AboutPage() {
  return &lt;h1&gt;Về CuongThai&lt;/h1&gt;;
}</code></pre>
<p>Một page chỉ là một component React được export mặc định từ file <code>page.tsx</code>. Vào <code>/about</code> là nó render. Để ý điều bạn sẽ mổ xẻ ở chương sau: component này chạy trên <em>server</em> theo mặc định — nó không bao giờ xuống trình duyệt trừ khi bạn chủ động chọn.</p>

<div class="note-ct">
<p><strong>Đây đúng là cách cuongthai.com được dựng.</strong> Frontend của nó nằm trong <code>frontend/src/app/</code> — mọi trang bạn từng vào (<code>/feed</code>, <code>/courses</code>, <code>/exam</code>, chính trang bài học này) đều là một <code>page.tsx</code> trong thư mục cùng tên, bọc bởi các layout. App Router không phải đồ chơi cho khoá học; nó là router production của chính site bạn đang học.</p>
</div>

<h3>Next.js thêm gì lên trên React</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Định tuyến từ hệ tệp</b> — Một thư mục là một đoạn URL. Không còn bảng route nào phải giữ đồng bộ với những trang thật sự tồn tại.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Một máy chủ biết render</b> — Component chạy được trên máy chủ, sát cơ sở dữ liệu, và gửi về HTML thay vì một gói JS cộng một lượt fetch.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Một bước build biết các route của bạn</b> — Nó quyết định cho từng route là dựng sẵn lúc build, nhớ đệm, hay render theo từng request — và nói cho bạn biết cái nào trong phần đầu ra của build.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Quy ước thay cho cấu hình</b> — <code>page</code>, <code>layout</code>, <code>loading</code>, <code>error</code>, <code>not-found</code>. Mỗi tên file là một hành vi mà nếu không có nó bạn phải tự đấu dây.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — mang nguyên mô hình tư duy React phía client vào App Router.</strong> Trong một ứng dụng Vite thì mọi component đều chạy trong trình duyệt, nên <code>useState</code>, <code>window</code> và <code>localStorage</code> luôn có sẵn. Trong App Router thì mặc định lật ngược: component chạy trên máy chủ, và cùng đoạn mã ấy ném ra &quot;window is not defined&quot; lúc build hoặc &quot;useState only works in a Client Component&quot; lúc biên dịch. Cách chữa không phải là thêm <code>&#39;use client&#39;</code> vào mọi thứ — làm thế là vứt bỏ lợi thế chính của framework. Mà là nhận ra phần nào thật sự cần trình duyệt rồi chỉ đánh dấu đúng phần đó, việc mà chương 9 sẽ đi qua chi tiết.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Nền tảng định tuyến</span><span class="lc-sub">Đoạn, thư mục, và các file đặc biệt, theo mô hình chính thức.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Học Next.js</span><span class="lc-sub">Khoá tương tác chính thức; một lượt đi lại tốt trên cùng nội dung.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong một app Next.js, tạo <code>app/page.tsx</code> và <code>app/about/page.tsx</code> rồi vào <code>/</code> và <code>/about</code> — không cấu hình router.</li>
<li>Thêm <code>app/layout.tsx</code> trả về <code>html</code>/<code>body</code> và <code>{children}</code>; xác nhận mọi trang được nó bọc.</li>
<li>Liệt kê hai thứ Next.js thêm trên React mà bạn từng phải tự làm ở Giai đoạn 1–2.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tạo được route theo thư mục và thấy root layout bọc mọi trang.</p></div>

<h3>🔬 Đo thật: thư mục, route và "máy chủ trước" (Next.js 16.4.6 · Node 22.23.3)</h3>
<p>Một dự án <code>create-next-app</code> mới, thêm bốn trang và một trang in log và giấu một chuỗi "bí mật":</p>
<pre><code class="language-tsx"><span class="tok-comment">// Một trang bình thường — KHÔNG có 'use client' ⇒ Server Component</span>
const BI_MAT = 'chuoi-nay-chi-o-may-chu-8-1';

export default function MayChu() {
  console.log('[may-chu] render lúc', new Date().toISOString());
  return &lt;h1&gt;Render ở máy chủ · chuỗi bí mật dài {BI_MAT.length} ký tự&lt;/h1&gt;;
}</code></pre>
<div class="out">$ npm run build
▲ Next.js 16.4.6 (Turbopack)
✓ Running next.config.ts took 19ms
✓ Compiled successfully in 1652ms
[may-chu] render lúc 2026-11-13T11:31:59.214Z
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /blog
├ ○ /blog/latest
└ ○ /may-chu
○  (Static)  prerendered as static content</div>
<div class="out">$ for p in / /about /blog /blog/latest /contact; do curl -s -o /dev/null -w "GET $p → %{http_code}\\n" localhost:3000$p; done
GET / → 200
GET /about → 200
GET /blog → 200
GET /blog/latest → 200
GET /contact → 404</div>
<div class="out">$ grep -rl 'chuoi-nay-chi-o-may-chu' .next/static | wc -l
       0
$ grep -rl 'chuoi-nay-chi-o-may-chu' .next/server | sed 's#.*/server/#.next/server/#' | sort
.next/server/chunks/ssr/[root-of-the-server]__0f5vo0utu7we5._.js.map</div>
<p>Bảng route liệt kê đúng những thư mục có <code>page.tsx</code>; <code>/contact</code> không có thư mục nên trả 404 bằng trang có sẵn của Next.js. Dòng log của trang tĩnh (○) in <b>một lần, ngay trong <code>next build</code></b> — console trình duyệt trống, ba request tới <code>next start</code> không thêm dòng nào, vì HTML đã được dựng sẵn. Chuỗi "bí mật" nằm trong 0 tệp của <code>.next/static</code> (thứ trình duyệt tải về); trang chỉ gửi kết quả là 27.</p>
<p>Cái bẫy, đo thật: <code>useState</code> trong một trang không có <code>'use client'</code> hỏng ngay lúc biên dịch với <i>"You're importing a module that depends on <code>useState</code> into a React Server Component module. This API is only available in Client Components"</i>; còn đọc <code>window</code> thì qua biên dịch rồi hỏng lúc dựng sẵn trang:</p>
<div class="out">Error occurred prerendering page "/bay-window". Read more: https://nextjs.org/docs/messages/prerender-error
ReferenceError: window is not defined</div>
<p>Chính cuongthai.com: trong <code>frontend/src/app</code> có</p>
<div class="out">page.tsx     347
layout.tsx   58
loading.tsx  23
route.ts     30</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npx create-next-app@latest my-app <span class="tok-comment">  # No, customize · src/ Yes · Cache Components No</span>
mkdir -p src/app/about &amp;&amp; echo "export default function A() { return &lt;h1&gt;About&lt;/h1&gt;; }" &gt; src/app/about/page.tsx
npm run build          <span class="tok-comment">  # đọc bảng route và xem console.log in ở đâu</span>
npx next start -p 3000 &amp; curl -s -o /dev/null -w "%{http_code}\\n" localhost:3000/contact</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-1-router" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.1 — React Router căn bản</span><span class="lc-sub">Nơi bạn tự lắp bảng route bằng mã — Next.js thay bằng thư mục</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-4-sang-nextjs" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.4 — Từ React sang Next.js</span><span class="lc-sub">Khác gì, khi nào cần, route của ta chuyển sang thế nào</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a3-1-typescript-nextjs" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · A3.1 — TypeScript với React & giới thiệu Next.js</span><span class="lc-sub">Đã học ở đó thì ở đây đi sâu từng phần</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Định tuyến của framework</span><span class="v">Thư mục trong <code>app/</code> ánh xạ sang URL — không cần cài router.</span></div>
  <div class="kv"><span class="k">page.tsx</span><span class="v">Tạo một route; export mặc định là UI của trang.</span></div>
  <div class="kv"><span class="k">layout.tsx</span><span class="v">Bọc trang bằng UI dùng chung (<code>html</code>/<code>body</code> ở gốc).</span></div>
  <div class="kv"><span class="k">Root layout</span><span class="v">Layout đỉnh bắt buộc; mọi trang render trong <code>{children}</code> của nó.</span></div>
  <div class="kv"><span class="k">Quy ước hơn cấu hình</span><span class="v">Next quyết định định tuyến/build để bạn khỏi làm.</span></div>
  <div class="kv"><span class="k">Server trước</span><span class="v">Component App Router mặc định chạy trên server.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>App Router biến thư mục dưới <code>app/</code> thành route — không cấu hình router.</li><li><code>page.tsx</code> định nghĩa một route; <code>layout.tsx</code> bọc trang bằng UI dùng chung.</li><li>Một root layout bắt buộc render <code>html</code>/<code>body</code> và mọi trang trong <code>{children}</code> của nó.</li><li>Next.js thêm định tuyến, render server và hệ build lên trên React bạn đã biết.</li></ul>

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
${G08_2}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Inside a folder, certain file names are reserved</h2>
<p class="lead">A route segment (one folder) can hold more than a page. The App Router reserves a handful of file names, each with a specific job. You do not import or wire them — Next.js finds them by name and slots them into the right place.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">page.tsx</span><span class="v">The UI for this route. <strong>A segment is only publicly routable if it has a page.</strong> Its default export is the component shown at that URL.</span></div>
  <div class="kv"><span class="k">layout.tsx</span><span class="v">A wrapper shared by this segment and everything nested below it. Receives <code>children</code> and stays mounted across navigation (next lesson).</span></div>
  <div class="kv"><span class="k">loading.tsx</span><span class="v">A fallback shown while the segment is loading. Next.js wraps the segment in a Suspense boundary for you.</span></div>
  <div class="kv"><span class="k">error.tsx</span><span class="v">An error boundary for the segment. Must be a Client Component (<code>'use client'</code>) and gets <code>error</code>, <code>retry</code> (Next.js 16.3+, re-fetches from the server) and <code>reset</code> props.</span></div>
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
<p><strong>error.tsx must be a Client Component.</strong> An error boundary needs to catch runtime errors and offer a way to try again (<code>retry()</code> / <code>reset()</code>) — that requires client-side JavaScript. Forget <code>'use client'</code> at the top of <code>error.tsx</code> and <code>next build</code> refuses: <i>"error.tsx must be a Client Component. Add the "use client" directive…"</i> (measured on 16.4.6). (What "Client Component" means is the whole of Chapter 9.)</p>
</div>

<h3>The special files, and when each one runs</h3>
<div class="lz-map">
  <div class="lz-stage">Every name is a behaviour you would otherwise build</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">page.tsx</div><div class="lz-nsub">Makes the segment publicly routable. A folder without a <code>page</code> is not a URL — it only groups things.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">layout.tsx</div><div class="lz-nsub">Wraps the segment and everything below it. It does <em>not</em> re-render on navigation between its children, which is what preserves scroll and state.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">loading.tsx</div><div class="lz-nsub">A Suspense boundary, automatically. Shown while the segment&#39;s data resolves, without you writing <code>&lt;Suspense&gt;</code> yourself.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">error.tsx and not-found.tsx</div><div class="lz-nsub">An error boundary and the 404 view. <code>error.tsx</code> must be a Client Component, because it needs a reset handler.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — a folder full of components that never becomes a route, because there is no <code>page</code>.</strong> <code>app/dashboard/settings/Settings.tsx</code> is just a file: without <code>page.tsx</code> in <code>app/dashboard/settings/</code>, the URL <code>/dashboard/settings</code> returns 404, no matter how complete the component is. The reverse trips people too — a <code>layout.tsx</code> with no sibling <code>page.tsx</code> renders nothing, because a layout only wraps a page. When a route 404s and the files look right, check for exactly two things: the file is named <code>page</code>, and it has a default export. Both are required — but measured on Next.js 16.4.6 only the first is silent: a folder without <code>page.tsx</code> builds and simply answers 404, while a <code>page.tsx</code> without a default export stops <code>next build</code> at the type check (TS2344) and answers 500 under <code>next dev</code> ("The default export is not a React Component").</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions" target="_blank" rel="noopener">
  <span class="lc-ico">📁</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — File conventions</span><span class="lc-sub">Every special file, with its exact signature and rendering rules.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Pages and layouts</span><span class="lc-sub">How page and layout nest, and what a layout preserves across navigations.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In one route folder add <code>page.tsx</code>, <code>loading.tsx</code>, and <code>error.tsx</code>; throw in the page to see the error boundary, and slow a fetch to see loading.</li>
<li>Add a <code>not-found.tsx</code> and trigger it with <code>notFound()</code>.</li>
<li>Note that <code>error.tsx</code> must be a Client Component (<code>'use client'</code>).</li>
</ol>
<p><strong>Done when:</strong> you can use the special files for loading, errors and not-found states.</p></div>

<h3>🔬 Measured: the special files on Next.js 16.4.6</h3>
<p>A <code>dashboard</code> folder with every special file, a <code>Chart.tsx</code> and a <code>utils.ts</code> next to it, and a <code>settings/</code> folder that has a layout and a full component but no page. The page waits 1.5 s and throws on odd attempts when <code>?loi=1</code>:</p>
<pre><code class="language-tsx"><span class="tok-comment">// ── page.tsx</span>
import Chart from './Chart';
import { cham } from './utils';

let lan = 0, lanLoi = 0;                            <span class="tok-comment">  // đếm lần render ở máy chủ (để đo)</span>

export default async function DashboardPage({ searchParams }: PageProps&lt;'/dashboard'&gt;) {
  const { loi } = await searchParams;               <span class="tok-comment">  // đọc query ⇒ route động (ƒ)</span>
  lan++;
  console.log(&#96;[dashboard] render #\${lan}\${loi ? ' ?loi' : ''}&#96;);
  await cham(1500);                                 <span class="tok-comment">  // giả lập số liệu về chậm 1,5 s</span>
  if (loi &amp;&amp; ++lanLoi % 2 === 1) throw new Error('Không tải được số liệu (máy chủ)');<span class="tok-comment">  // lỗi lần 1, 3, 5…</span>
  return &lt;&gt;&lt;h1&gt;Bảng điều khiển · lần {lan}&lt;/h1&gt;&lt;Chart /&gt;&lt;/&gt;;
}
<span class="tok-comment">// ── loading.tsx</span>
export default function Loading() {
  return &lt;p&gt;⏳ Đang tải số liệu…&lt;/p&gt;;
}
<span class="tok-comment">// ── error.tsx</span>
'use client';                                       <span class="tok-comment">  // ranh giới lỗi BẮT BUỘC là Client Component</span>

export default function Error({ error, reset, retry }: { error: Error &amp; { digest?: string }; reset: () =&gt; void; retry: () =&gt; void }) {
  return (
    &lt;div&gt;
      &lt;p id="loi"&gt;⚠️ {error.message}&lt;/p&gt;
      &lt;p id="digest"&gt;digest: {error.digest ?? '—'}&lt;/p&gt;
      &lt;button id="reset" onClick={() =&gt; reset()} className="mr-2 rounded border px-2"&gt;reset()&lt;/button&gt;
      &lt;button id="retry" onClick={() =&gt; retry()} className="rounded border px-2"&gt;retry()&lt;/button&gt;
    &lt;/div&gt;
  );
}
<span class="tok-comment">// ── khong-co/page.tsx</span>
import { notFound } from 'next/navigation';

export default function KhongCo() {
  notFound();                                       <span class="tok-comment">  // ⇒ not-found.tsx gần nhất</span>
}</code></pre>
<div class="out">GET /dashboard → 200
GET /dashboard/Chart → 404
GET /dashboard/utils → 404
GET /dashboard/settings → 404
GET /dashboard/khong-co → 404
GET /dashboard/xyz → 404
byte đầu tiên sau 0.011115s · xong sau 1.510366s
Đang tải số liệu…
Bảng điều khiển · lần &lt;!-- --&gt;3</div>
<p>Only <code>page.tsx</code> makes a URL: <code>Chart</code>, <code>utils</code> and <code>settings</code> (layout and all) are 404. <code>loading.tsx</code> streams — first byte after ~11 ms, end after ~1.5 s, the same HTML carries the fallback first and the page later. A URL that matches no folder (<code>/dashboard/xyz</code>) shows the <b>root</b> 404, not <code>dashboard/not-found.tsx</code>, which only answers <code>notFound()</code> inside its segment.</p>
<p><b>notFound() under loading.tsx:</b> the HTML of <code>/dashboard/khong-co</code> contains only a marker and the loading fallback — the not-found message is drawn by client JavaScript (with JavaScript off it stays "Đang tải…"); the status is still 404:</p>
<div class="out">&lt;template data-dgst="NEXT_HTTP_ERROR_FALLBACK;404"&gt;&lt;/template&gt;&lt;p&gt;⏳ Đang tải số liệu…&lt;/p&gt;</div>
<p><b>Errors in production are hidden on purpose.</b> On <code>next start</code> the error boundary received <code>Minified React error #441; visit https://react.dev/errors/44…</code> + <code>digest: 2406462482</code>; under <code>next dev</code> it showed the real message. The real message is in the server log, with the same digest:</p>
<div class="out">[dashboard] render #5 ?loi
⨯ Error: Không tải được số liệu (máy chủ)
  digest: '2406462482'
[dashboard] render #6 ?loi</div>
<p><b><code>retry()</code> vs <code>reset()</code> (measured):</b> after <code>reset()</code> the boundary still showed the error 2.5 s later and the server log had no new render; <code>retry()</code> made the server render again (#6) and the dashboard came back. <code>retry</code> exists since 16.2 (<code>unstable_retry</code>), stable since 16.3; tutorials written for Next.js 14/15 only know <code>reset()</code>, which re-renders without re-fetching — a failed Server Component stays failed.</p>
<p>The two "silent" mistakes, measured:</p>
<div class="out">Error: src/app/dashboard/error.tsx must be a Client Component. Add the "use client" directive the top of the file to resolve this issue.
.next/types/validator.ts(133,31): error TS2344: Type 'typeof import("…/src/app/khong-mac-dinh/page")' does not satisfy the constraint 'AppPageConfig&lt;"/khong-mac-dinh"&gt;'.
next dev GET /khong-mac-dinh → 500
⨯ Error: The default export is not a React Component in "/khong-mac-dinh/page"</div>
<p>cuongthai.com: 23 <code>loading.tsx</code>, 2 <code>error.tsx</code>, 1 <code>global-error.tsx</code> and no <code>not-found.tsx</code> — so a missing URL shows Next.js's built-in 404 (production check below).</p>
<div class="out">GET https://cuongthai.com/khong-co-trang-nay → 404
&lt;h2 style="font-size:14px;font-weight:400;line-height:49px;margin:0"&gt;This page could not be found.&lt;/h2&gt;</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
curl -s -o /dev/null -w "%{time_starttransfer}s %{time_total}s\\n" localhost:3000/dashboard
<span class="tok-comment"># open /dashboard?loi=1, compare with next dev, click reset() then retry(), read the server log</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-2-layout" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.2 — Layouts, nested routes, route errors</span><span class="lc-sub">React Router's errorElement — Next.js uses an error.tsx file</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-12-1-suspense-use" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 12.1 — Suspense for data and use()</span><span class="lc-sub">What loading.tsx writes for you</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-10-1-lazy-suspense" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 10.1 — lazy() & Suspense</span><span class="lc-sub">There you write <Suspense> yourself; here the loading file does</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">page.tsx</span><span class="v">The route's UI.</span></div>
  <div class="kv"><span class="k">layout.tsx</span><span class="v">Shared, persistent wrapper for a segment.</span></div>
  <div class="kv"><span class="k">loading.tsx</span><span class="v">A fallback shown while the segment's data loads (Suspense).</span></div>
  <div class="kv"><span class="k">error.tsx</span><span class="v">An error boundary for the segment (must be a Client Component).</span></div>
  <div class="kv"><span class="k">not-found.tsx</span><span class="v">UI for <code>notFound()</code> / missing routes.</span></div>
  <div class="kv"><span class="k">File conventions</span><span class="v">Reserved filenames Next treats specially in <code>app/</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Reserved filenames give each segment its UI and its states: <code>page</code>, <code>layout</code>, <code>loading</code>, <code>error</code>, <code>not-found</code>.</li><li><code>loading.tsx</code> is a Suspense fallback; <code>error.tsx</code> is an error boundary.</li><li><code>error.tsx</code> must be a Client Component because it uses state to recover.</li><li>Trigger the not-found UI with the <code>notFound()</code> helper.</li></ul>

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
  <div class="kv"><span class="k">error.tsx</span><span class="v">Ranh giới lỗi cho segment. Phải là Client Component (<code>'use client'</code>) và nhận props <code>error</code>, <code>retry</code> (Next.js 16.3+, tải lại từ máy chủ) và <code>reset</code>.</span></div>
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
<p><strong>error.tsx phải là Client Component.</strong> Một ranh giới lỗi cần bắt lỗi lúc chạy và đưa ra cách thử lại (<code>retry()</code> / <code>reset()</code>) — thứ đó cần JavaScript phía client. Quên <code>'use client'</code> ở đầu <code>error.tsx</code> thì <code>next build</code> từ chối luôn: <i>"error.tsx must be a Client Component. Add the "use client" directive…"</i> (đo trên 16.4.6). (Client Component nghĩa là gì thì cả Chương 9 nói.)</p>
</div>

<h3>Các file quy ước, và mỗi cái chạy khi nào</h3>
<div class="lz-map">
  <div class="lz-stage">Mỗi cái tên là một hành vi mà nếu không có nó bạn phải tự dựng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">page.tsx</div><div class="lz-nsub">Làm cho đoạn đó truy cập được công khai. Một thư mục không có <code>page</code> thì không phải một URL — nó chỉ dùng để nhóm.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">layout.tsx</div><div class="lz-nsub">Bọc quanh đoạn đó và mọi thứ bên dưới. Nó <em>không</em> render lại khi chuyển giữa các trang con, và đó là thứ giữ được vị trí cuộn và state.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">loading.tsx</div><div class="lz-nsub">Một ranh giới Suspense, tự động. Hiện ra trong lúc dữ liệu của đoạn đang được giải, mà bạn chẳng phải tự viết <code>&lt;Suspense&gt;</code>.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">error.tsx và not-found.tsx</div><div class="lz-nsub">Một ranh giới lỗi và khung 404. <code>error.tsx</code> bắt buộc phải là Client Component, vì nó cần một handler đặt lại.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một thư mục đầy component mà chẳng bao giờ thành route, vì thiếu <code>page</code>.</strong> <code>app/dashboard/settings/Settings.tsx</code> chỉ là một file: không có <code>page.tsx</code> trong <code>app/dashboard/settings/</code> thì URL <code>/dashboard/settings</code> trả về 404, dù cái component có hoàn chỉnh tới đâu. Chiều ngược lại cũng làm người ta vấp — một <code>layout.tsx</code> không có <code>page.tsx</code> anh em thì chẳng vẽ ra gì, vì layout chỉ bọc quanh một page. Khi một route trả 404 mà các file trông vẫn đúng, hãy kiểm đúng hai thứ: file có tên là <code>page</code> không, và nó có export mặc định không. Cả hai đều bắt buộc — nhưng đo trên Next.js 16.4.6 thì chỉ cái đầu là âm thầm: thư mục thiếu <code>page.tsx</code> vẫn build xanh và trả 404, còn <code>page.tsx</code> thiếu export mặc định thì <code>next build</code> dừng ở bước kiểm kiểu (TS2344), <code>next dev</code> trả 500 ("The default export is not a React Component").</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions" target="_blank" rel="noopener">
  <span class="lc-ico">📁</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Quy ước file</span><span class="lc-sub">Mọi file đặc biệt, kèm chữ ký chính xác và luật vẽ của nó.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Page và layout</span><span class="lc-sub">Page và layout lồng nhau ra sao, và layout giữ lại được gì khi chuyển trang.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong một thư mục route thêm <code>page.tsx</code>, <code>loading.tsx</code>, và <code>error.tsx</code>; ném lỗi trong page để thấy error boundary, và làm chậm một fetch để thấy loading.</li>
<li>Thêm một <code>not-found.tsx</code> và kích hoạt bằng <code>notFound()</code>.</li>
<li>Để ý <code>error.tsx</code> phải là Client Component (<code>'use client'</code>).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dùng được các file quy ước cho trạng thái loading, lỗi và không-tìm-thấy.</p></div>

<h3>🔬 Đo thật: các tệp quy ước trên Next.js 16.4.6</h3>
<p>Một thư mục <code>dashboard</code> đủ các tệp quy ước, thêm <code>Chart.tsx</code> và <code>utils.ts</code> nằm cạnh, và thư mục <code>settings/</code> có layout lẫn component hoàn chỉnh nhưng không có page. Trang chờ 1,5 s và ném lỗi ở lần lẻ khi có <code>?loi=1</code>:</p>
<pre><code class="language-tsx"><span class="tok-comment">// ── page.tsx</span>
import Chart from './Chart';
import { cham } from './utils';

let lan = 0, lanLoi = 0;                            <span class="tok-comment">  // đếm lần render ở máy chủ (để đo)</span>

export default async function DashboardPage({ searchParams }: PageProps&lt;'/dashboard'&gt;) {
  const { loi } = await searchParams;               <span class="tok-comment">  // đọc query ⇒ route động (ƒ)</span>
  lan++;
  console.log(&#96;[dashboard] render #\${lan}\${loi ? ' ?loi' : ''}&#96;);
  await cham(1500);                                 <span class="tok-comment">  // giả lập số liệu về chậm 1,5 s</span>
  if (loi &amp;&amp; ++lanLoi % 2 === 1) throw new Error('Không tải được số liệu (máy chủ)');<span class="tok-comment">  // lỗi lần 1, 3, 5…</span>
  return &lt;&gt;&lt;h1&gt;Bảng điều khiển · lần {lan}&lt;/h1&gt;&lt;Chart /&gt;&lt;/&gt;;
}
<span class="tok-comment">// ── loading.tsx</span>
export default function Loading() {
  return &lt;p&gt;⏳ Đang tải số liệu…&lt;/p&gt;;
}
<span class="tok-comment">// ── error.tsx</span>
'use client';                                       <span class="tok-comment">  // ranh giới lỗi BẮT BUỘC là Client Component</span>

export default function Error({ error, reset, retry }: { error: Error &amp; { digest?: string }; reset: () =&gt; void; retry: () =&gt; void }) {
  return (
    &lt;div&gt;
      &lt;p id="loi"&gt;⚠️ {error.message}&lt;/p&gt;
      &lt;p id="digest"&gt;digest: {error.digest ?? '—'}&lt;/p&gt;
      &lt;button id="reset" onClick={() =&gt; reset()} className="mr-2 rounded border px-2"&gt;reset()&lt;/button&gt;
      &lt;button id="retry" onClick={() =&gt; retry()} className="rounded border px-2"&gt;retry()&lt;/button&gt;
    &lt;/div&gt;
  );
}
<span class="tok-comment">// ── khong-co/page.tsx</span>
import { notFound } from 'next/navigation';

export default function KhongCo() {
  notFound();                                       <span class="tok-comment">  // ⇒ not-found.tsx gần nhất</span>
}</code></pre>
<div class="out">GET /dashboard → 200
GET /dashboard/Chart → 404
GET /dashboard/utils → 404
GET /dashboard/settings → 404
GET /dashboard/khong-co → 404
GET /dashboard/xyz → 404
byte đầu tiên sau 0.011115s · xong sau 1.510366s
Đang tải số liệu…
Bảng điều khiển · lần &lt;!-- --&gt;3</div>
<p>Chỉ <code>page.tsx</code> mới tạo đường dẫn: <code>Chart</code>, <code>utils</code> và <code>settings</code> (có cả layout) đều 404. <code>loading.tsx</code> truyền dần — byte đầu sau ~11 ms, xong sau ~1,5 s, cùng một HTML mang phần đang tải trước, trang thật sau. Đường dẫn không khớp thư mục nào (<code>/dashboard/xyz</code>) hiện 404 <b>gốc</b>, không phải <code>dashboard/not-found.tsx</code> — tệp này chỉ trả lời <code>notFound()</code> bên trong đoạn của nó.</p>
<p><b>notFound() bên dưới loading.tsx:</b> HTML của <code>/dashboard/khong-co</code> chỉ có một dấu đánh dấu và phần đang tải — thông điệp not-found do JavaScript phía trình duyệt vẽ (tắt JavaScript thì kẹt "Đang tải…"); mã trạng thái vẫn là 404:</p>
<div class="out">&lt;template data-dgst="NEXT_HTTP_ERROR_FALLBACK;404"&gt;&lt;/template&gt;&lt;p&gt;⏳ Đang tải số liệu…&lt;/p&gt;</div>
<p><b>Bản chạy thật cố ý giấu thông điệp lỗi.</b> Trên <code>next start</code>, ranh giới lỗi nhận <code>Minified React error #441; visit https://react.dev/errors/44…</code> + <code>digest: 2406462482</code>; dưới <code>next dev</code> thì hiện đúng thông điệp. Thông điệp thật nằm trong log máy chủ, cùng mã digest:</p>
<div class="out">[dashboard] render #5 ?loi
⨯ Error: Không tải được số liệu (máy chủ)
  digest: '2406462482'
[dashboard] render #6 ?loi</div>
<p><b><code>retry()</code> và <code>reset()</code> (đo thật):</b> sau <code>reset()</code>, 2,5 s sau ranh giới lỗi vẫn hiện lỗi và log máy chủ không có lần render mới; <code>retry()</code> làm máy chủ render lại (#6) và bảng điều khiển hiện ra. <code>retry</code> có từ 16.2 (<code>unstable_retry</code>), ổn định từ 16.3; hướng dẫn viết cho Next.js 14/15 chỉ biết <code>reset()</code> — vẽ lại mà không tải lại, nên Server Component đã hỏng vẫn hỏng.</p>
<p>Hai lỗi "âm thầm", đo thật:</p>
<div class="out">Error: src/app/dashboard/error.tsx must be a Client Component. Add the "use client" directive the top of the file to resolve this issue.
.next/types/validator.ts(133,31): error TS2344: Type 'typeof import("…/src/app/khong-mac-dinh/page")' does not satisfy the constraint 'AppPageConfig&lt;"/khong-mac-dinh"&gt;'.
next dev GET /khong-mac-dinh → 500
⨯ Error: The default export is not a React Component in "/khong-mac-dinh/page"</div>
<p>cuongthai.com: 23 <code>loading.tsx</code>, 2 <code>error.tsx</code>, 1 <code>global-error.tsx</code> và không có <code>not-found.tsx</code> nào — nên đường dẫn không tồn tại hiện trang 404 có sẵn của Next.js (kiểm trên máy chủ thật bên dưới).</p>
<div class="out">GET https://cuongthai.com/khong-co-trang-nay → 404
&lt;h2 style="font-size:14px;font-weight:400;line-height:49px;margin:0"&gt;This page could not be found.&lt;/h2&gt;</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
curl -s -o /dev/null -w "%{time_starttransfer}s %{time_total}s\\n" localhost:3000/dashboard
<span class="tok-comment"># mở /dashboard?loi=1, so với next dev, bấm reset() rồi retry(), đọc log máy chủ</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-2-layout" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.2 — Layout, route lồng nhau, lỗi theo route</span><span class="lc-sub">errorElement của React Router — Next.js thay bằng tệp error.tsx</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-12-1-suspense-use" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 12.1 — Suspense cho dữ liệu và use()</span><span class="lc-sub">Thứ mà loading.tsx viết giúp bạn</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-10-1-lazy-suspense" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 10.1 — lazy() & Suspense</span><span class="lc-sub">Ở đó tự viết thẻ Suspense; ở đây tệp loading làm thay</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">page.tsx</span><span class="v">UI của route.</span></div>
  <div class="kv"><span class="k">layout.tsx</span><span class="v">Vỏ bọc dùng chung, giữ lại cho một đoạn.</span></div>
  <div class="kv"><span class="k">loading.tsx</span><span class="v">Fallback hiện trong lúc dữ liệu của đoạn tải (Suspense).</span></div>
  <div class="kv"><span class="k">error.tsx</span><span class="v">Error boundary cho đoạn (phải là Client Component).</span></div>
  <div class="kv"><span class="k">not-found.tsx</span><span class="v">UI cho <code>notFound()</code> / route không có.</span></div>
  <div class="kv"><span class="k">File quy ước</span><span class="v">Tên file dành riêng mà Next xử lý đặc biệt trong <code>app/</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Tên file dành riêng cho mỗi đoạn UI và trạng thái của nó: <code>page</code>, <code>layout</code>, <code>loading</code>, <code>error</code>, <code>not-found</code>.</li><li><code>loading.tsx</code> là fallback Suspense; <code>error.tsx</code> là error boundary.</li><li><code>error.tsx</code> phải là Client Component vì nó dùng state để phục hồi.</li><li>Kích hoạt UI không-tìm-thấy bằng helper <code>notFound()</code>.</li></ul>

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
${G08_3}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Layouts wrap their subtree — and survive navigation</h2>
<p class="lead">A <code>layout.tsx</code> renders shared UI around a set of routes. The one at the top of <code>app/</code> is the <strong>root layout</strong>; it is required, and it is the only place your <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code> tags live. Deeper layouts wrap smaller sections. The property that makes layouts powerful is what they do <em>not</em> do on navigation.</p>

<h3>The shape of a layout</h3>
<pre><code class="language-typescript"><span class="tok-comment">// app/layout.tsx — the ROOT layout (required)</span>
export default function RootLayout({ children }) {
  return (
    &lt;html lang="vi"&gt;
      &lt;body&gt;
        &lt;SiteNav /&gt;
        {children}          <span class="tok-comment">{/* the active page renders here */}</span>
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

<h3>How nested layouts compose</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Every segment can have one</b> — <code>app/layout</code> wraps everything; <code>app/shop/layout</code> wraps everything under <code>/shop</code>. They nest outside-in.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The root layout owns html and body</b> — It is required, and it is the only layout allowed to render those tags.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Layouts persist across navigation</b> — Moving from <code>/shop/a</code> to <code>/shop/b</code> re-renders the page, not the shop layout — so its state, scroll and any open menu survive.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Which is why data in a layout is fetched once</b> — And not re-fetched when the child route changes. Useful for a nav; wrong for anything that depends on the current page.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — reading route parameters in a layout and expecting them to update.</strong> A layout does not re-render when you navigate between its children, so a value derived from the URL — the current product id, a tab name — is captured on the first render of that layout and then goes stale. The page updates, the layout&#39;s breadcrumb does not, and it looks like a caching bug. Layouts receive <code>params</code> for their <em>own</em> segment only, and that is deliberate: it is the mechanism that makes navigation cheap. Anything that must track the current route belongs in the page, or in a Client Component using <code>usePathname</code>.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts" target="_blank" rel="noopener">
  <span class="lc-ico">🧅</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Layouts</span><span class="lc-sub">Nesting, the root layout, and exactly what does and does not re-render.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/use-pathname" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — usePathname</span><span class="lc-sub">Reading the live path in a Client Component, when a layout genuinely needs it.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add a nested <code>layout.tsx</code> in a sub-folder (for example a sidebar) and confirm it persists while you navigate between its child pages.</li>
<li>Put a counter in a layout and one in a page; navigate and note the layout's state survives while the page's resets.</li>
<li>Draw the layout nesting for a two-level route and mark where <code>{children}</code> plugs in.</li>
</ol>
<p><strong>Done when:</strong> you can nest layouts and explain why layout state persists across navigation.</p></div>

<h3>🔬 Measured: what survives a navigation (Next.js 16.4.6)</h3>
<p>The shop layout, its <code>template.tsx</code> and each page hold a counter that also counts its mounts (in <code>sessionStorage</code>, so it survives a reload). We clicked 3 · 2 · 2, then navigated:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

<span class="tok-comment">// Bộ đếm có state + đếm số lần GẮN (mount) — ghi vào sessionStorage để sống qua cả lần tải lại trang</span>
export default function Dem({ ten }: { ten: string }) {
  const [n, setN] = useState(0);
  const [gan, setGan] = useState(0);
  useEffect(() =&gt; {
    const k = Number(sessionStorage.getItem('gan-' + ten) ?? 0) + 1;
    sessionStorage.setItem('gan-' + ten, String(k));
    setGan(k);
  }, [ten]);
  return (
    &lt;button id={'dem-' + ten} onClick={() =&gt; setN(n + 1)} className="block rounded border px-2"&gt;
      {ten}: {n} · đã gắn {gan} lần
    &lt;/button&gt;
  );
}</code></pre>
<div class="out">                     on /shop/a        after &lt;Link&gt; → /shop/b   after &lt;a href&gt; → /shop/b
layout               layout: 3 · đã gắn 1 lần layout: 3 · đã gắn 1 lần layout: 0 · đã gắn 2 lần
template             template: 2 · đã gắn 1 lần template: 0 · đã gắn 2 lần template: 0 · đã gắn 3 lần
page                 page-a: 2 · đã gắn 1 lần page-b: 0 · đã gắn 1 lần page-b: 0 · đã gắn 2 lần</div>
<p>With <code>&lt;Link&gt;</code> the layout kept its state and was never remounted; the template remounted (that is its job) and the page is new. With a plain <code>&lt;a href&gt;</code> the browser loaded a new document and everything mounted again.</p>
<p><b>What the server re-renders.</b> A layout and a dynamic page both log their render time; load <code>/sp/1</code>, then a Link to <code>/sp/2</code>:</p>
<div class="out">[sp/layout] render · params = {} · 12:01:43.192
[sp/[id]] render · id = 1 · 12:01:43.192
[sp/[id]] render · id = 2 · 12:01:44.507</div>
<div class="out">layout: render lúc 12:01:43.192 · params = {}
usePathname() = /sp/2
page: sản phẩm 2 · render lúc 12:01:44.507</div>
<p>Only the page rendered again. The layout kept its old render time and printed <code>params = {{}}</code> — it cannot even see the child's <code>id</code>. The small Client Component calling <code>usePathname()</code> did follow the URL. That is the pitfall of this lesson, measured: anything that must follow the current route belongs in the page or in such a Client Component.</p>
<p><b>Two more measurements.</b> Deleting <code>app/layout.tsx</code> makes <code>next build</code> fail: <i>"about/page.tsx doesn't have a root layout"</i>. And the root-layout snippet above used to put <code>// …</code> after <code>{{children}}</code>, between JSX tags — there it is <b>text</b>, not a comment (now fixed to <code>{{/* … */}}</code>):</p>
<div class="out">&lt;nav&gt;SiteNav&lt;/nav&gt;&lt;p&gt;Nội dung trang&lt;/p&gt;          // page đang active render ở đây&lt;/div&gt;
tsc: 0 lỗi
  7:19  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes</div>
<p>cuongthai.com: in the root layout the site nav sits before the page slot and the music controller and player after it — inside the layout, not a page — which is why audio keeps playing while you browse:</p>
<div class="out">417: &lt;SiteNav /&gt;
429: &lt;MusicAudioController /&gt;
              &lt;SiteNav /&gt;
            &lt;main className="app-main min-h-screen w-full"&gt;
            &lt;/main&gt;
              &lt;MusicAudioController /&gt;
              &lt;MusicHistoryRecorder /&gt;
              &lt;GlobalMusicPlayer /&gt;</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
<span class="tok-comment"># open /shop/a, click the counters, then the Link and the &lt;a&gt; — read "mounted" each time</span>
<span class="tok-comment"># open /sp/1, Link to /sp/2, and watch the server log</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-2-layout" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.2 — Layouts, nested routes, route errors</span><span class="lc-sub">In React Router the slot is &lt;Outlet&gt;; here it is {children}</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 9.1 — Routes, params & links</span><span class="lc-sub">In Next.js the folders replace that configuration</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nested layout</span><span class="v">A <code>layout.tsx</code> inside a sub-segment, wrapping its pages.</span></div>
  <div class="kv"><span class="k">Persistence</span><span class="v">A layout does not re-mount when navigating between its children.</span></div>
  <div class="kv"><span class="k">children</span><span class="v">Where the inner page/layout renders inside its parent layout.</span></div>
  <div class="kv"><span class="k">Segment</span><span class="v">A folder level in <code>app/</code> that can own a layout.</span></div>
  <div class="kv"><span class="k">Shared UI</span><span class="v">Headers, sidebars and nav that stay put across navigation.</span></div>
  <div class="kv"><span class="k">Layout vs page state</span><span class="v">Layout state survives; page state resets on navigation.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Layouts nest: each segment can have a <code>layout.tsx</code> that wraps its pages via <code>{children}</code>.</li><li>A layout persists across navigation between its children — it does not re-mount.</li><li>So layout state (open sidebar, scroll) survives while the inner page's state resets.</li><li>Use nested layouts for headers, sidebars and nav that should stay put.</li></ul>

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
<pre><code class="language-typescript"><span class="tok-comment">// app/layout.tsx — root layout (bắt buộc)</span>
export default function RootLayout({ children }) {
  return (
    &lt;html lang="vi"&gt;
      &lt;body&gt;
        &lt;SiteNav /&gt;
        {children}          <span class="tok-comment">{/* page đang active render ở đây */}</span>
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

<h3>Layout lồng nhau ghép lại thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Mỗi đoạn đều có thể có một cái</b> — <code>app/layout</code> bọc mọi thứ; <code>app/shop/layout</code> bọc mọi thứ dưới <code>/shop</code>. Chúng lồng từ ngoài vào trong.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Layout gốc sở hữu thẻ html và body</b> — Nó là bắt buộc, và là layout duy nhất được phép vẽ hai thẻ đó.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Layout sống dai qua các lần chuyển trang</b> — Đi từ <code>/shop/a</code> sang <code>/shop/b</code> là render lại page, không render lại layout của shop — nên state, vị trí cuộn và mọi menu đang mở của nó đều sống sót.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Đó là lý do dữ liệu trong layout chỉ được lấy một lần</b> — Và không lấy lại khi route con đổi. Có ích cho một thanh điều hướng; sai với bất cứ thứ gì phụ thuộc vào trang hiện tại.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — đọc tham số route trong một layout rồi mong nó cập nhật.</strong> Một layout không render lại khi bạn chuyển giữa các trang con của nó, nên một giá trị dẫn xuất từ URL — id sản phẩm hiện tại, tên một tab — được bắt lấy ở lần render đầu của layout đó rồi cũ dần đi. Trang thì cập nhật, còn thanh breadcrumb của layout thì không, và nó trông như một lỗi bộ nhớ đệm. Layout chỉ nhận <code>params</code> của <em>chính</em> đoạn của nó, và điều đó là cố ý: đó chính là cơ chế làm cho việc chuyển trang trở nên rẻ. Mọi thứ phải bám theo route hiện tại đều thuộc về page, hoặc thuộc về một Client Component dùng <code>usePathname</code>.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts" target="_blank" rel="noopener">
  <span class="lc-ico">🧅</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Layout</span><span class="lc-sub">Lồng nhau, layout gốc, và chính xác cái gì render lại cái gì không.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/use-pathname" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — usePathname</span><span class="lc-sub">Đọc đường dẫn trực tiếp trong một Client Component, khi layout thật sự cần nó.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một <code>layout.tsx</code> lồng trong thư mục con (ví dụ một sidebar) và xác nhận nó giữ lại khi bạn điều hướng giữa các trang con.</li>
<li>Đặt một counter trong layout và một cái trong page; điều hướng và để ý state của layout sống còn trong khi của page reset.</li>
<li>Vẽ sự lồng nhau của layout cho một route hai tầng và đánh dấu nơi <code>{children}</code> cắm vào.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn lồng được layout và giải thích vì sao state của layout giữ lại qua điều hướng.</p></div>

<h3>🔬 Đo thật: cái gì sống qua một lần chuyển trang (Next.js 16.4.6)</h3>
<p>Layout của shop, <code>template.tsx</code> của nó và mỗi trang đều có một bộ đếm, kèm số lần gắn (ghi vào <code>sessionStorage</code> để sống qua cả lần tải lại). Bấm 3 · 2 · 2 rồi chuyển trang:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

<span class="tok-comment">// Bộ đếm có state + đếm số lần GẮN (mount) — ghi vào sessionStorage để sống qua cả lần tải lại trang</span>
export default function Dem({ ten }: { ten: string }) {
  const [n, setN] = useState(0);
  const [gan, setGan] = useState(0);
  useEffect(() =&gt; {
    const k = Number(sessionStorage.getItem('gan-' + ten) ?? 0) + 1;
    sessionStorage.setItem('gan-' + ten, String(k));
    setGan(k);
  }, [ten]);
  return (
    &lt;button id={'dem-' + ten} onClick={() =&gt; setN(n + 1)} className="block rounded border px-2"&gt;
      {ten}: {n} · đã gắn {gan} lần
    &lt;/button&gt;
  );
}</code></pre>
<div class="out">                     ở /shop/a         sau &lt;Link&gt; → /shop/b     sau &lt;a href&gt; → /shop/b
layout               layout: 3 · đã gắn 1 lần layout: 3 · đã gắn 1 lần layout: 0 · đã gắn 2 lần
template             template: 2 · đã gắn 1 lần template: 0 · đã gắn 2 lần template: 0 · đã gắn 3 lần
page                 page-a: 2 · đã gắn 1 lần page-b: 0 · đã gắn 1 lần page-b: 0 · đã gắn 2 lần</div>
<p>Với <code>&lt;Link&gt;</code>, layout giữ state và không hề gắn lại; template gắn lại (đúng việc của nó), trang là trang mới. Với <code>&lt;a href&gt;</code> thường, trình duyệt tải một tài liệu mới và mọi thứ gắn lại từ đầu.</p>
<p><b>Máy chủ render lại những gì.</b> Layout và một trang động đều in giờ render; tải <code>/sp/1</code> rồi bấm Link sang <code>/sp/2</code>:</p>
<div class="out">[sp/layout] render · params = {} · 12:01:43.192
[sp/[id]] render · id = 1 · 12:01:43.192
[sp/[id]] render · id = 2 · 12:01:44.507</div>
<div class="out">layout: render lúc 12:01:43.192 · params = {}
usePathname() = /sp/2
page: sản phẩm 2 · render lúc 12:01:44.507</div>
<p>Chỉ trang render lại. Layout giữ nguyên giờ render cũ và in <code>params = {{}}</code> — nó còn không thấy <code>id</code> của trang con. Component nhỏ phía trình duyệt gọi <code>usePathname()</code> thì cập nhật theo URL. Đó chính là cái bẫy của bài, đo thật: thứ gì phải bám theo route hiện tại thì đặt trong page, hoặc trong một Client Component như vậy.</p>
<p><b>Thêm hai phép đo.</b> Xoá <code>app/layout.tsx</code> thì <code>next build</code> hỏng: <i>"about/page.tsx doesn't have a root layout"</i>. Và đoạn mã root layout ở trên từng đặt <code>// …</code> sau <code>{{children}}</code>, giữa các thẻ JSX — ở đó nó là <b>chữ</b>, không phải chú thích (nay đã sửa thành <code>{{/* … */}}</code>):</p>
<div class="out">&lt;nav&gt;SiteNav&lt;/nav&gt;&lt;p&gt;Nội dung trang&lt;/p&gt;          // page đang active render ở đây&lt;/div&gt;
tsc: 0 lỗi
  7:19  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes</div>
<p>cuongthai.com: trong layout gốc, thanh điều hướng đứng trước khe trang, bộ điều khiển và trình phát nhạc đứng sau — nằm trong layout chứ không trong trang nào — nên nhạc cứ phát khi bạn chuyển trang:</p>
<div class="out">417: &lt;SiteNav /&gt;
429: &lt;MusicAudioController /&gt;
              &lt;SiteNav /&gt;
            &lt;main className="app-main min-h-screen w-full"&gt;
            &lt;/main&gt;
              &lt;MusicAudioController /&gt;
              &lt;MusicHistoryRecorder /&gt;
              &lt;GlobalMusicPlayer /&gt;</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
<span class="tok-comment"># mở /shop/a, bấm các bộ đếm, rồi bấm Link và thẻ a — đọc "đã gắn" mỗi lần</span>
<span class="tok-comment"># mở /sp/1, bấm Link sang /sp/2, xem log máy chủ</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-2-layout" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.2 — Layout, route lồng nhau, lỗi theo route</span><span class="lc-sub">Với React Router khe cắm tên là &lt;Outlet&gt;; ở đây là {children}</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 9.1 — Route, tham số & link</span><span class="lc-sub">Ở Next.js thư mục làm thay phần khai báo đó</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Layout lồng</span><span class="v">Một <code>layout.tsx</code> trong đoạn con, bọc các trang của nó.</span></div>
  <div class="kv"><span class="k">Giữ lại (persistence)</span><span class="v">Layout không mount lại khi điều hướng giữa các con.</span></div>
  <div class="kv"><span class="k">children</span><span class="v">Nơi page/layout bên trong render trong layout cha.</span></div>
  <div class="kv"><span class="k">Đoạn (segment)</span><span class="v">Một tầng thư mục trong <code>app/</code> có thể sở hữu layout.</span></div>
  <div class="kv"><span class="k">UI dùng chung</span><span class="v">Header, sidebar và nav giữ nguyên qua điều hướng.</span></div>
  <div class="kv"><span class="k">State layout vs page</span><span class="v">State layout sống còn; state page reset khi điều hướng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Layout lồng nhau: mỗi đoạn có thể có một <code>layout.tsx</code> bọc các trang qua <code>{children}</code>.</li><li>Một layout giữ lại khi điều hướng giữa các con — nó không mount lại.</li><li>Nên state của layout (sidebar mở, cuộn) sống còn trong khi state trang bên trong reset.</li><li>Dùng layout lồng cho header, sidebar và nav cần giữ nguyên.</li></ul>

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
${G08_4}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Move between routes without reloading the page</h2>
<p class="lead">The previous lesson said layouts persist across navigation — but only if you navigate the right way. The App Router does <em>client-side transitions</em>: it fetches just the new segment and swaps it in, keeping the shared layout mounted. The tool for that is the <code>&lt;Link&gt;</code> component.</p>

<h3>Link, not a bare anchor</h3>
<pre><code class="language-javascript">import Link from 'next/link';

&lt;Link href="/courses"&gt;Courses&lt;/Link&gt;
&lt;Link href="/courses/nextjs"&gt;Next.js course&lt;/Link&gt;</code></pre>
<p><code>&lt;Link&gt;</code> renders a real <code>&lt;a&gt;</code> under the hood — accessible, right-clickable, SEO-friendly — but intercepts the click to do a client transition instead of a full browser navigation. It also <strong>prefetches</strong> the target in the background as it scrolls into view, so the jump feels instant.</p>

<div class="pitfall">
<p><strong>Using a plain <code>&lt;a href="/courses"&gt;</code> is the classic beginner bug.</strong> It triggers a full-page reload: the whole app reboots, every layout re-mounts, in-memory state is lost, the music stops, and the prefetch advantage is gone. Inside a Next.js app, internal links go through <code>&lt;Link&gt;</code>. Reserve raw <code>&lt;a&gt;</code> for external URLs (and add <code>target="_blank" rel="noopener"</code> there).</p>
</div>

<h3>Navigating from code: useRouter</h3>
<p>Sometimes you must navigate after something happens — a form submits, a login succeeds. For that, the client hook <code>useRouter</code>:</p>
<pre><code class="language-javascript">'use client';
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
<pre><code class="language-javascript">'use client';
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

<h3>Navigating without a page reload</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Use next/link, not an anchor</b> — <code>&lt;Link href="/shop"&gt;</code> renders a real <code>&lt;a&gt;</code> — so it is right-clickable and crawlable — but intercepts the click for a client-side transition.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It prefetches what is visible</b> — When a Link scrolls into view, Next fetches that route&#39;s payload in the background. The click then feels instant.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>useRouter for programmatic moves</b> — <code>router.push(&#39;/x&#39;)</code> after a form succeeds. It is a Client Component hook, from <code>next/navigation</code>.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>redirect() on the server</b> — In a Server Component or a Server Action. It throws, so nothing after it runs — put it at the end of the function.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — importing <code>useRouter</code> from <code>next/router</code> in an App Router project.</strong> That is the Pages Router hook. In the App Router it exists but throws as soon as the page renders — measured on Next.js 16.4.6, a static page using it already fails <code>next build</code> while prerendering: &quot;NextRouter was not mounted&quot; — an error that says nothing about the import path, and sends people looking for a missing provider. The App Router splits the old router into three imports from <code>next/navigation</code>: <code>useRouter</code> for pushing, <code>usePathname</code> for the current path, and <code>useSearchParams</code> for the query. Most examples on the internet predate the split, so check the import line first whenever a routing hook behaves strangely.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/components/link" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Link</span><span class="lc-sub">Every prop, including prefetch, replace and scroll behaviour.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/use-router" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — useRouter (App Router)</span><span class="lc-sub">The correct import and the full method list, with the Pages Router differences noted.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Replace an <code>&lt;a href&gt;</code> with <code>&lt;Link href&gt;</code> and observe client-side navigation (no full reload).</li>
<li>Highlight the active link using <code>usePathname()</code> in a Client Component.</li>
<li>Navigate programmatically with <code>useRouter().push()</code> after an action.</li>
</ol>
<p><strong>Done when:</strong> you can navigate with <code>Link</code>, mark the active link, and push routes in code.</p></div>

<h3>🔬 Measured: Link, prefetch, push/replace (Next.js 16.4.6)</h3>
<p><code>&lt;Link&gt;</code> really renders an anchor — this is the HTML <code>next start</code> sent:</p>
<div class="out">&lt;a class="rounded border px-2" href="/dh/a"&gt;Khoá học&lt;/a&gt;
&lt;a id="a-tran" href="/dh/a" class="rounded border border-dashed px-2"&gt;&amp;lt;a&amp;gt; Khoá học&lt;/a&gt;</div>
<p>Opening <code>/dh</code> on <code>next start</code> and waiting 2.5 s without clicking, the browser had already fetched 8 RSC payloads — two for each link in view (under <code>next dev</code>: 0):</p>
<div class="out">/dh?_rsc=…
/dh/a?_rsc=…
/dh/b?_rsc=…
/dh/dang-nhap?_rsc=…
/dh?_rsc=…
/dh/a?_rsc=…
/dh/b?_rsc=…
/dh/dang-nhap?_rsc=…</div>
<pre><code class="language-tsx">'use client';
import { useRouter } from 'next/navigation';

const login = () =&gt; new Promise((r) =&gt; setTimeout(r, 300)); <span class="tok-comment">  // giả lập gọi API đăng nhập</span>

export default function LoginButton() {
  const router = useRouter();
  async function onPush() { await login(); router.push('/dh/a'); }     <span class="tok-comment">  // chuyển cảnh client, bằng code</span>
  async function onReplace() { await login(); router.replace('/dh/a'); } // thay mục lịch sử hiện tại
  return (
    &lt;p className="space-x-2"&gt;
      &lt;button id="push" onClick={onPush} className="rounded border px-2"&gt;Đăng nhập (push)&lt;/button&gt;
      &lt;button id="replace" onClick={onReplace} className="rounded border px-2"&gt;Đăng nhập (replace)&lt;/button&gt;
    &lt;/p&gt;
  );
}</code></pre>
<div class="out">after one click to /dh/a        &lt;Link&gt;                  bare &lt;a href&gt;
new requests on click          0                       full reload (18 resources)
JS variable set before         vẫn-trang-cũ            null
Back after router.push         /dh/dang-nhap
Back after router.replace      /dh</div>
<p>So a Link click needed nothing new from the network and kept the page's JavaScript state; a bare anchor restarted the app. After a login, <code>replace</code> keeps Back from returning to the form. <code>redirect()</code> on the server answered 307 and the line after it never ran (not even during the build):</p>
<div class="out">GET /dh/cu → 307 · Location: http://localhost:3000/dh/a</div>
<p>The <code>next/router</code> trap and the missing <code>'use client'</code>, both measured:</p>
<div class="out">Error occurred prerendering page "/dh/sai". Read more: https://nextjs.org/docs/messages/prerender-error
Error: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted

Error: You're importing a module that depends on &#96;useRouter&#96; into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the &#96;"use client"&#96; directive.</div>
<p>cuongthai.com: 388 files import <code>next/link</code>, 325 import from <code>next/navigation</code>, 0 from <code>next/router</code>; <code>useRouter(</code> 207 calls, <code>usePathname(</code> 78 — the active tab of the site nav.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
<span class="tok-comment"># DevTools → Network, filter "_rsc": open a page with Links and wait — no click</span>
<span class="tok-comment"># Console: window.x = 1 → click a Link → window.x (still 1) → click an &lt;a&gt; → window.x (undefined)</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-1-router" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.1 — React Router basics</span><span class="lc-sub">React Router's Link and useNavigate — compare with Next.js Link</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-5-4-url-state" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 5.4 — The URL as state</span><span class="lc-sub">Filters that survive F5 — the useSearchParams side</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 9.1 — Routes, params & links</span><span class="lc-sub">In Next.js, Link also prefetches the target</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Link</span><span class="v">Next's component for client-side navigation with prefetch.</span></div>
  <div class="kv"><span class="k">Client-side nav</span><span class="v">Changing route without a full page reload.</span></div>
  <div class="kv"><span class="k">Prefetch</span><span class="v">Next preloads linked routes for instant transitions.</span></div>
  <div class="kv"><span class="k">usePathname</span><span class="v">Hook that returns the current path (for active links).</span></div>
  <div class="kv"><span class="k">useRouter</span><span class="v">Hook for programmatic navigation (<code>push</code>, <code>replace</code>, <code>back</code>).</span></div>
  <div class="kv"><span class="k">next/navigation</span><span class="v">The App Router navigation module (not <code>next/router</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Use <code>&lt;Link&gt;</code> for client-side navigation; it prefetches and avoids a full reload.</li><li>Read the current path with <code>usePathname()</code> to mark the active link.</li><li>Navigate in code with <code>useRouter().push()</code> from <code>next/navigation</code>.</li><li>In the App Router it is <code>next/navigation</code>, never the old <code>next/router</code>.</li></ul>

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
<pre><code class="language-javascript">import Link from 'next/link';

&lt;Link href="/courses"&gt;Khoá học&lt;/Link&gt;
&lt;Link href="/courses/nextjs"&gt;Khoá Next.js&lt;/Link&gt;</code></pre>
<p><code>&lt;Link&gt;</code> bên dưới vẫn render một <code>&lt;a&gt;</code> thật — hỗ trợ trợ năng, chuột phải được, thân thiện SEO — nhưng chặn cú click để làm chuyển cảnh client thay vì điều hướng trình duyệt đầy đủ. Nó còn <strong>prefetch</strong> đích ở nền khi cuộn tới, nên cú nhảy cảm giác tức thì.</p>

<div class="pitfall">
<p><strong>Dùng <code>&lt;a href="/courses"&gt;</code> trần là bug kinh điển của người mới.</strong> Nó kích hoạt tải lại toàn trang: cả app khởi động lại, mọi layout mount lại, state trong bộ nhớ mất, nhạc tắt, và lợi thế prefetch bay hết. Bên trong app Next.js, link nội bộ đi qua <code>&lt;Link&gt;</code>. Chỉ để dành <code>&lt;a&gt;</code> trần cho URL ngoài (và thêm <code>target="_blank" rel="noopener"</code> ở đó).</p>
</div>

<h3>Điều hướng từ code: useRouter</h3>
<p>Đôi khi bạn phải điều hướng sau khi có việc xảy ra — form gửi xong, đăng nhập thành công. Cho việc đó, hook client <code>useRouter</code>:</p>
<pre><code class="language-javascript">'use client';
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
<pre><code class="language-javascript">'use client';
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

<h3>Chuyển trang mà không tải lại</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Hãy dùng next/link, đừng dùng thẻ a trần</b> — <code>&lt;Link href="/shop"&gt;</code> vẽ ra một thẻ <code>&lt;a&gt;</code> thật — nên bấm chuột phải được và bot đọc được — nhưng chặn cú bấm để chuyển trang phía client.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó nạp trước thứ đang nhìn thấy</b> — Khi một Link cuộn vào tầm nhìn, Next lấy sẵn dữ liệu của route đó ở phía sau. Cú bấm sau đó cảm giác tức thì.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>useRouter cho việc chuyển bằng mã</b> — <code>router.push(&#39;/x&#39;)</code> sau khi một form thành công. Nó là hook của Client Component, lấy từ <code>next/navigation</code>.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>redirect() ở phía máy chủ</b> — Trong một Server Component hoặc một Server Action. Nó ném lỗi, nên không gì sau nó chạy — hãy đặt nó ở cuối hàm.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — import <code>useRouter</code> từ <code>next/router</code> trong một dự án App Router.</strong> Đó là hook của Pages Router. Trong App Router nó vẫn tồn tại nhưng ném lỗi ngay khi trang render — đo trên Next.js 16.4.6, một trang tĩnh dùng nó đã làm <code>next build</code> hỏng ngay lúc dựng sẵn trang: &quot;NextRouter was not mounted&quot; — một lỗi chẳng nói gì về đường import, và đẩy người ta đi tìm một provider bị thiếu. App Router tách cái router cũ thành ba import từ <code>next/navigation</code>: <code>useRouter</code> để chuyển trang, <code>usePathname</code> cho đường dẫn hiện tại, và <code>useSearchParams</code> cho phần truy vấn. Phần lớn ví dụ trên mạng có trước lần tách đó, nên hễ một hook định tuyến cư xử lạ thì hãy kiểm dòng import trước tiên.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/components/link" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Link</span><span class="lc-sub">Mọi prop, gồm cả prefetch, replace và hành vi cuộn.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/use-router" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — useRouter (App Router)</span><span class="lc-sub">Đường import đúng và danh sách phương thức đầy đủ, có ghi chỗ khác Pages Router.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thay một <code>&lt;a href&gt;</code> bằng <code>&lt;Link href&gt;</code> và quan sát điều hướng phía client (không tải lại cả trang).</li>
<li>Tô sáng link đang hoạt động bằng <code>usePathname()</code> trong một Client Component.</li>
<li>Điều hướng bằng code với <code>useRouter().push()</code> sau một hành động.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn điều hướng được bằng <code>Link</code>, đánh dấu link active, và push route trong code.</p></div>

<h3>🔬 Đo thật: Link, prefetch, push/replace (Next.js 16.4.6)</h3>
<p><code>&lt;Link&gt;</code> thật sự vẽ ra một thẻ a — đây là HTML mà <code>next start</code> gửi về:</p>
<div class="out">&lt;a class="rounded border px-2" href="/dh/a"&gt;Khoá học&lt;/a&gt;
&lt;a id="a-tran" href="/dh/a" class="rounded border border-dashed px-2"&gt;&amp;lt;a&amp;gt; Khoá học&lt;/a&gt;</div>
<p>Mở <code>/dh</code> trên <code>next start</code> và chờ 2,5 s không bấm, trình duyệt đã tải sẵn 8 gói RSC — hai cho mỗi liên kết đang nhìn thấy (dưới <code>next dev</code>: 0):</p>
<div class="out">/dh?_rsc=…
/dh/a?_rsc=…
/dh/b?_rsc=…
/dh/dang-nhap?_rsc=…
/dh?_rsc=…
/dh/a?_rsc=…
/dh/b?_rsc=…
/dh/dang-nhap?_rsc=…</div>
<pre><code class="language-tsx">'use client';
import { useRouter } from 'next/navigation';

const login = () =&gt; new Promise((r) =&gt; setTimeout(r, 300)); <span class="tok-comment">  // giả lập gọi API đăng nhập</span>

export default function LoginButton() {
  const router = useRouter();
  async function onPush() { await login(); router.push('/dh/a'); }     <span class="tok-comment">  // chuyển cảnh client, bằng code</span>
  async function onReplace() { await login(); router.replace('/dh/a'); } // thay mục lịch sử hiện tại
  return (
    &lt;p className="space-x-2"&gt;
      &lt;button id="push" onClick={onPush} className="rounded border px-2"&gt;Đăng nhập (push)&lt;/button&gt;
      &lt;button id="replace" onClick={onReplace} className="rounded border px-2"&gt;Đăng nhập (replace)&lt;/button&gt;
    &lt;/p&gt;
  );
}</code></pre>
<div class="out">sau một cú bấm tới /dh/a        &lt;Link&gt;                  &lt;a href&gt; trần
request mới khi bấm            0                       tải lại toàn bộ (18 tài nguyên)
biến JS đặt trước khi bấm      vẫn-trang-cũ            null
Back sau router.push           /dh/dang-nhap
Back sau router.replace        /dh</div>
<p>Vậy cú bấm Link không cần gì mới từ mạng và giữ nguyên state JavaScript của trang; thẻ a trần khởi động lại ứng dụng. Sau khi đăng nhập, <code>replace</code> giữ cho Back không quay về form. <code>redirect()</code> ở máy chủ trả 307 và dòng sau nó không bao giờ chạy (kể cả lúc build):</p>
<div class="out">GET /dh/cu → 307 · Location: http://localhost:3000/dh/a</div>
<p>Bẫy <code>next/router</code> và thiếu <code>'use client'</code>, đều đo thật:</p>
<div class="out">Error occurred prerendering page "/dh/sai". Read more: https://nextjs.org/docs/messages/prerender-error
Error: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted

Error: You're importing a module that depends on &#96;useRouter&#96; into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the &#96;"use client"&#96; directive.</div>
<p>cuongthai.com: 388 tệp import <code>next/link</code>, 325 tệp import từ <code>next/navigation</code>, 0 tệp dùng <code>next/router</code>; <code>useRouter(</code> 207 lần gọi, <code>usePathname(</code> 78 — chính là thẻ đang chọn trên thanh điều hướng.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
<span class="tok-comment"># DevTools → Network, lọc "_rsc": mở trang có Link rồi chờ — không bấm</span>
<span class="tok-comment"># Console: window.x = 1 → bấm Link → window.x (vẫn 1) → bấm thẻ a → window.x (undefined)</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-1-router" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.1 — React Router căn bản</span><span class="lc-sub">Link và useNavigate của React Router — so với Link của Next.js</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-5-4-url-state" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 5.4 — URL là state</span><span class="lc-sub">Bộ lọc sống qua F5 — anh em của useSearchParams</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 9.1 — Route, tham số & link</span><span class="lc-sub">Ở Next.js, Link còn tải trước trang đích</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Link</span><span class="v">Component của Next cho điều hướng phía client có prefetch.</span></div>
  <div class="kv"><span class="k">Điều hướng client</span><span class="v">Đổi route mà không tải lại cả trang.</span></div>
  <div class="kv"><span class="k">Prefetch</span><span class="v">Next nạp trước các route được link để chuyển tức thì.</span></div>
  <div class="kv"><span class="k">usePathname</span><span class="v">Hook trả về đường dẫn hiện tại (cho link active).</span></div>
  <div class="kv"><span class="k">useRouter</span><span class="v">Hook điều hướng bằng code (<code>push</code>, <code>replace</code>, <code>back</code>).</span></div>
  <div class="kv"><span class="k">next/navigation</span><span class="v">Module điều hướng của App Router (không phải <code>next/router</code>).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Dùng <code>&lt;Link&gt;</code> cho điều hướng phía client; nó prefetch và tránh tải lại cả trang.</li><li>Đọc đường dẫn hiện tại bằng <code>usePathname()</code> để đánh dấu link active.</li><li>Điều hướng trong code bằng <code>useRouter().push()</code> từ <code>next/navigation</code>.</li><li>Trong App Router là <code>next/navigation</code>, không bao giờ <code>next/router</code> cũ.</li></ul>

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
${G08_5}
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
<pre><code class="language-javascript">app/blog/[slug]/page.tsx     <span class="tok-comment">// matches /blog/hello, /blog/anything</span>

export default async function Post({ params }) {
  const { slug } = await params;   <span class="tok-comment">// e.g. "hello"</span>
  return &lt;article&gt;Post: {slug}&lt;/article&gt;;
}</code></pre>
<p>The square brackets mark the dynamic part; the name inside (<code>slug</code>) is the key you read from <code>params</code>. This is how <code>/courses/nextjs</code> and <code>/courses/nodejs</code> are one file, not two. The deeper routing patterns — catch-all <code>[...slug]</code>, optional, parallel and intercepting routes — are Chapter 11; here, just the everyday single dynamic segment.</p>

<h3>Metadata: titles and SEO from the route</h3>
<p>Every page should set its browser-tab title and description. In the App Router you export a <code>metadata</code> object (static) or a <code>generateMetadata</code> function (when it depends on data):</p>
<pre><code class="language-javascript"><span class="tok-comment">// static — most pages</span>
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

<h3>Organising routes without changing URLs</h3>
<div class="lz-map">
  <div class="lz-stage">Two tools that look similar and do opposite things</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Route groups: (marketing)</div><div class="lz-nsub">Parentheses. The folder groups files and gives them a shared layout, and the name never appears in the URL.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Private folders: _components</div><div class="lz-nsub">Underscore. Opted out of routing entirely — a place to keep components next to the route that uses them.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Metadata: export const metadata</div><div class="lz-nsub">A plain object in a <code>layout</code> or <code>page</code>. Next merges it down the tree, so a child can override just the title.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">generateMetadata for dynamic titles</div><div class="lz-nsub">An async function receiving <code>params</code>. It can fetch, and it deduplicates that fetch with the page&#39;s own.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — two route groups that resolve to the same URL path.</strong> <code>app/(marketing)/about/page.tsx</code> and <code>app/(shop)/about/page.tsx</code> both produce <code>/about</code>, because the group name is stripped. The build fails with a duplicate-route error that names the URL rather than the two folders, so on a large tree it takes a while to find the pair. Groups are for sharing a layout among sibling sections, not for namespacing — if you want two different <code>/about</code> pages you need two different URLs. Keep the group names describing the <em>layout</em> they share (<code>(with-sidebar)</code>), which makes accidental collisions much less likely.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-groups" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route groups</span><span class="lc-sub">What parentheses do, and the multiple-root-layout pattern they enable.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — generateMetadata</span><span class="lc-sub">Static and dynamic metadata, merging rules, and the deduplication behaviour.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Create a route group <code>(marketing)</code> and confirm the folder name does not appear in the URL.</li>
<li>Add a dynamic segment <code>[slug]</code> and read <code>params.slug</code> in the page.</li>
<li>Export a <code>metadata</code> object (title, description) and check it in the page's <code>&lt;head&gt;</code>.</li>
</ol>
<p><strong>Done when:</strong> you can group routes without affecting the URL, read a dynamic param, and set metadata.</p></div>

<h3>🔬 Measured: groups, [slug] and metadata (Next.js 16.4.6)</h3>
<pre><code class="language-tsx">import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { template: '%s — CuongThai', default: 'CuongThai' }, <span class="tok-comment">  // trang con chỉ cần ghi đè phần %s</span>
  description: 'Học Next.js, Node.js và hơn thế.',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return &lt;div className="p-4 font-sans"&gt;&lt;p id="vo"&gt;🎨 vỏ marketing&lt;/p&gt;{children}&lt;/div&gt;;
}

import type { Metadata } from 'next';

const cham = (ms: number) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
async function getBai(slug: string) { await cham(300); return { title: 'Bài: ' + slug }; } <span class="tok-comment">  // giả lập đọc CSDL 300 ms</span>

export async function generateMetadata({ params }: PageProps&lt;'/bai/[slug]'&gt;): Promise&lt;Metadata&gt; {
  const { slug } = await params;
  const bai = await getBai(slug);
  return { title: bai.title };
}

export default async function Bai({ params }: PageProps&lt;'/bai/[slug]'&gt;) {
  const { slug } = await params;          <span class="tok-comment">  // ví dụ "hello"</span>
  return &lt;article id="bai"&gt;Bài: {slug}&lt;/article&gt;;
}</code></pre>
<div class="out">GET /gioi-thieu → 200
GET /bang-tin → 200
GET /(marketing)/gioi-thieu → 404
GET /marketing/gioi-thieu → 404
GET /_components → 404
GET /bai/hello → 200
&lt;title&gt;Giới thiệu — CuongThai&lt;/title&gt;
&lt;meta name="description" content="Học Next.js, Node.js và hơn thế."/&gt;
&lt;article id="bai"&gt;Bài: hello&lt;/article&gt;
&lt;title&gt;Bài: hello — CuongThai&lt;/title&gt;</div>
<p>The group names never reach the URL — with or without parentheses they are 404 — and <code>_components</code> is out of routing even with a <code>page.tsx</code> inside. The title template merged down the tree; <code>/bang-tin</code>, in the other group, inherited the root layout's title <i>Create Next App</i>. Two groups that both contain <code>trung/page.tsx</code> stop the build:</p>
<div class="out">Error: You cannot have two parallel pages that resolve to the same path. Please check /(marketing)/trung and /(ung-dung).</div>
<p>Reading <code>params.slug</code> without <code>await</code> (the Next.js 14 way) — TypeScript stops it; plain JavaScript would silently give <code>undefined</code>:</p>
<div class="out">src/app/(marketing)/bai-cu/[slug]/page.tsx(2,32): error TS2339: Property 'slug' does not exist on type 'Promise&lt;{ slug: string; }&gt;'.</div>
<p><b>Surprise 1 — accented slugs arrive encoded.</b> For <code>/bai/xin-chào</code> the page received the percent-encoded string while <code>generateMetadata</code> received the decoded one:</p>
<div class="out">&lt;article id="bai"&gt;Bài: xin-ch%C3%A0o&lt;/article&gt;
&lt;title&gt;Bài: xin-chào — CuongThai&lt;/title&gt;</div>
<p>Decode before using it: <code>const slug = decodeURIComponent((await params).slug)</code>. It matters here — cuongthai.com has slugs with Vietnamese letters (lesson 4.3 of this course is <code>nextjs-4-3-form-thật</code>).</p>
<p><b>Surprise 2 — streaming metadata.</b> The same dynamic page, fetched with two User-Agents (its <code>generateMetadata</code> waits 300 ms):</p>
<div class="out">curl/8                     → &lt;title&gt; nằm SAU &lt;/head&gt; (truyền sau)
facebookexternalhit/1.1    → &lt;title&gt; TRONG &lt;head&gt;</div>
<p>For normal clients Next.js sends <code>&lt;head&gt;</code> first and streams the title later (the browser moves it into place); for HTML-only bots such as <code>facebookexternalhit</code> it waits and puts the title inside <code>&lt;head&gt;</code>. Test share previews with the bot's User-Agent. Exporting <code>metadata</code> from a <code>'use client'</code> page fails the build:</p>
<div class="out">Error: You are attempting to export "metadata" from a component marked with "use client", which is disallowed. "metadata" must be resolved on the server before the page component is rendered. Keep your page as a Server Component and move Client Component logic to a separate file.</div>
<p>cuongthai.com: one route group, <code>(auth)</code> (<code>/login</code>, <code>/register</code>), 61 dynamic folders and 24 routes with <code>generateMetadata</code>.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
curl -s 'localhost:3000/bai/xin-ch%C3%A0o' | grep -o '&lt;title&gt;[^&lt;]*&lt;/title&gt;'
for ua in curl/8 facebookexternalhit/1.1; do curl -s -A "$ua" localhost:3000/bai/hello | grep -o '&lt;title&gt;[^&lt;]*&lt;/title&gt;\\|&lt;/head&gt;'; echo; done</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-1-router" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.1 — React Router basics</span><span class="lc-sub">Route params with useParams — here they come from a [slug] folder</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-3-cau-truc" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.3 — Project structure that scales</span><span class="lc-sub">Feature folders — close to private _components folders</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 9.1 — Routes, params & links</span><span class="lc-sub">Route params in React Router</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Route group <code>(name)</code></span><span class="v">Organises routes and shares a layout; the name never appears in the URL.</span></div>
  <div class="kv"><span class="k">Private folder <code>_name</code></span><span class="v">Excluded from routing entirely — even a <code>page.tsx</code> inside is 404.</span></div>
  <div class="kv"><span class="k">Dynamic segment <code>[slug]</code></span><span class="v">One folder that matches many URL values.</span></div>
  <div class="kv"><span class="k"><code>params</code></span><span class="v">A Promise of the dynamic values (Next.js 15+) — <code>await</code> it.</span></div>
  <div class="kv"><span class="k"><code>metadata</code></span><span class="v">Static title/description exported from a page or layout (Server Component).</span></div>
  <div class="kv"><span class="k">Title template</span><span class="v"><code>'%s — CuongThai'</code> in a layout; children fill in <code>%s</code>.</span></div>
  <div class="kv"><span class="k"><code>generateMetadata</code></span><span class="v">Async metadata computed from <code>params</code> and data.</span></div>
  <div class="kv"><span class="k">Streaming metadata</span><span class="v">Browsers get the &lt;title&gt; after &lt;head&gt;; HTML-only bots get it inside.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>Route groups <code>(name)</code> organise files without adding a URL segment.</li><li>Dynamic segments <code>[slug]</code> capture URL parts into <code>params</code>.</li><li>Export a <code>metadata</code> object (or <code>generateMetadata</code>) to set the page's SEO head.</li><li>Chapter 17 goes deeper on metadata and SEO.</li></ul>

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
<pre><code class="language-javascript">app/blog/[slug]/page.tsx     <span class="tok-comment">// khớp /blog/hello, /blog/gi-cung-duoc</span>

export default async function Post({ params }) {
  const { slug } = await params;   <span class="tok-comment">// ví dụ "hello"</span>
  return &lt;article&gt;Bài: {slug}&lt;/article&gt;;
}</code></pre>
<p>Cặp ngoặc vuông đánh dấu phần động; tên bên trong (<code>slug</code>) là khoá bạn đọc từ <code>params</code>. Đây là cách <code>/courses/nextjs</code> và <code>/courses/nodejs</code> chỉ là một file, không phải hai. Các mẫu định tuyến sâu hơn — catch-all <code>[...slug]</code>, tuỳ chọn, parallel và intercepting route — là Chương 11; ở đây chỉ một segment động thường ngày.</p>

<h3>Metadata: title và SEO từ route</h3>
<p>Mọi trang nên đặt title trên tab trình duyệt và mô tả. Trong App Router bạn export một object <code>metadata</code> (tĩnh) hoặc một hàm <code>generateMetadata</code> (khi nó phụ thuộc dữ liệu):</p>
<pre><code class="language-javascript"><span class="tok-comment">// tĩnh — đa số trang</span>
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

<h3>Sắp xếp route mà không đổi URL</h3>
<div class="lz-map">
  <div class="lz-stage">Hai công cụ nhìn na ná nhau mà làm hai việc trái ngược</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nhóm route: (marketing)</div><div class="lz-nsub">Dấu ngoặc tròn. Thư mục này gom các file lại và cho chúng một layout dùng chung, còn cái tên thì không bao giờ xuất hiện trong URL.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Thư mục riêng: _components</div><div class="lz-nsub">Dấu gạch dưới. Bị loại hẳn khỏi định tuyến — một chỗ để giữ component nằm cạnh route dùng nó.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Metadata: export const metadata</div><div class="lz-nsub">Một object thuần trong một <code>layout</code> hoặc <code>page</code>. Next trộn nó xuôi xuống cây, nên một trang con chỉ cần ghi đè mỗi cái tiêu đề.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">generateMetadata cho tiêu đề động</div><div class="lz-nsub">Một hàm async nhận <code>params</code>. Nó lấy dữ liệu được, và phép lấy đó được khử trùng lặp với phép lấy của chính trang.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — hai nhóm route cùng rút về một đường URL.</strong> <code>app/(marketing)/about/page.tsx</code> và <code>app/(shop)/about/page.tsx</code> đều cho ra <code>/about</code>, vì tên nhóm bị lược đi. Bản build hỏng với một lỗi trùng route gọi tên cái URL chứ không gọi tên hai thư mục, nên trên một cây lớn thì mất một lúc mới tìm ra cặp đó. Nhóm dùng để chia sẻ layout giữa các mục anh em, không dùng để phân vùng tên — nếu bạn muốn hai trang <code>/about</code> khác nhau thì bạn cần hai URL khác nhau. Hãy đặt tên nhóm theo cái <em>layout</em> mà chúng dùng chung (<code>(with-sidebar)</code>), như thế va chạm ngoài ý muốn khó xảy ra hơn nhiều.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-groups" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Nhóm route</span><span class="lc-sub">Dấu ngoặc tròn làm gì, và mẫu nhiều-layout-gốc mà nó cho phép.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — generateMetadata</span><span class="lc-sub">Metadata tĩnh và động, luật trộn, và hành vi khử trùng lặp.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo một route group <code>(marketing)</code> và xác nhận tên thư mục không xuất hiện trong URL.</li>
<li>Thêm một đoạn động <code>[slug]</code> và đọc <code>params.slug</code> trong page.</li>
<li>Export một object <code>metadata</code> (title, description) và kiểm nó trong <code>&lt;head&gt;</code> của trang.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nhóm được route mà không đổi URL, đọc một param động, và đặt metadata.</p></div>

<h3>🔬 Đo thật: nhóm, [slug] và metadata (Next.js 16.4.6)</h3>
<pre><code class="language-tsx">import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { template: '%s — CuongThai', default: 'CuongThai' }, <span class="tok-comment">  // trang con chỉ cần ghi đè phần %s</span>
  description: 'Học Next.js, Node.js và hơn thế.',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return &lt;div className="p-4 font-sans"&gt;&lt;p id="vo"&gt;🎨 vỏ marketing&lt;/p&gt;{children}&lt;/div&gt;;
}

import type { Metadata } from 'next';

const cham = (ms: number) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
async function getBai(slug: string) { await cham(300); return { title: 'Bài: ' + slug }; } <span class="tok-comment">  // giả lập đọc CSDL 300 ms</span>

export async function generateMetadata({ params }: PageProps&lt;'/bai/[slug]'&gt;): Promise&lt;Metadata&gt; {
  const { slug } = await params;
  const bai = await getBai(slug);
  return { title: bai.title };
}

export default async function Bai({ params }: PageProps&lt;'/bai/[slug]'&gt;) {
  const { slug } = await params;          <span class="tok-comment">  // ví dụ "hello"</span>
  return &lt;article id="bai"&gt;Bài: {slug}&lt;/article&gt;;
}</code></pre>
<div class="out">GET /gioi-thieu → 200
GET /bang-tin → 200
GET /(marketing)/gioi-thieu → 404
GET /marketing/gioi-thieu → 404
GET /_components → 404
GET /bai/hello → 200
&lt;title&gt;Giới thiệu — CuongThai&lt;/title&gt;
&lt;meta name="description" content="Học Next.js, Node.js và hơn thế."/&gt;
&lt;article id="bai"&gt;Bài: hello&lt;/article&gt;
&lt;title&gt;Bài: hello — CuongThai&lt;/title&gt;</div>
<p>Tên nhóm không bao giờ tới URL — có ngoặc hay không ngoặc đều 404 — và <code>_components</code> nằm ngoài định tuyến dù có <code>page.tsx</code> bên trong. Khuôn tiêu đề được trộn xuôi xuống cây; <code>/bang-tin</code> ở nhóm kia thì thừa hưởng tiêu đề <i>Create Next App</i> của layout gốc. Hai nhóm cùng có <code>trung/page.tsx</code> làm build dừng:</p>
<div class="out">Error: You cannot have two parallel pages that resolve to the same path. Please check /(marketing)/trung and /(ung-dung).</div>
<p>Đọc <code>params.slug</code> không <code>await</code> (kiểu Next.js 14) — TypeScript chặn lại; JavaScript thuần thì im lặng trả <code>undefined</code>:</p>
<div class="out">src/app/(marketing)/bai-cu/[slug]/page.tsx(2,32): error TS2339: Property 'slug' does not exist on type 'Promise&lt;{ slug: string; }&gt;'.</div>
<p><b>Bất ngờ 1 — slug có dấu tới nơi còn mã hoá.</b> Với <code>/bai/xin-chào</code>, trang nhận chuỗi mã hoá phần trăm còn <code>generateMetadata</code> nhận bản đã giải mã:</p>
<div class="out">&lt;article id="bai"&gt;Bài: xin-ch%C3%A0o&lt;/article&gt;
&lt;title&gt;Bài: xin-chào — CuongThai&lt;/title&gt;</div>
<p>Hãy giải mã trước khi dùng: <code>const slug = decodeURIComponent((await params).slug)</code>. Điều này quan trọng ở đây — cuongthai.com có slug chứa chữ tiếng Việt (bài 4.3 của khoá này là <code>nextjs-4-3-form-thật</code>).</p>
<p><b>Bất ngờ 2 — metadata truyền sau.</b> Cùng một trang động, gọi bằng hai User-Agent (<code>generateMetadata</code> của nó chờ 300 ms):</p>
<div class="out">curl/8                     → &lt;title&gt; nằm SAU &lt;/head&gt; (truyền sau)
facebookexternalhit/1.1    → &lt;title&gt; TRONG &lt;head&gt;</div>
<p>Với client thường, Next.js gửi <code>&lt;head&gt;</code> trước rồi truyền tiêu đề sau (trình duyệt tự dời về đúng chỗ); với bot chỉ đọc HTML như <code>facebookexternalhit</code> thì nó chờ và đặt tiêu đề trong <code>&lt;head&gt;</code>. Thử ảnh/tiêu đề xem trước bằng User-Agent của bot. Xuất <code>metadata</code> từ trang có <code>'use client'</code> thì build hỏng:</p>
<div class="out">Error: You are attempting to export "metadata" from a component marked with "use client", which is disallowed. "metadata" must be resolved on the server before the page component is rendered. Keep your page as a Server Component and move Client Component logic to a separate file.</div>
<p>cuongthai.com: một route group <code>(auth)</code> (<code>/login</code>, <code>/register</code>), 61 thư mục động và 24 route dùng <code>generateMetadata</code>.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
curl -s 'localhost:3000/bai/xin-ch%C3%A0o' | grep -o '&lt;title&gt;[^&lt;]*&lt;/title&gt;'
for ua in curl/8 facebookexternalhit/1.1; do curl -s -A "$ua" localhost:3000/bai/hello | grep -o '&lt;title&gt;[^&lt;]*&lt;/title&gt;\\|&lt;/head&gt;'; echo; done</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-1-router" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.1 — React Router căn bản</span><span class="lc-sub">Tham số route với useParams — ở đây đến từ thư mục [slug]</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-3-cau-truc" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.3 — Cấu trúc dự án mở rộng được</span><span class="lc-sub">Thư mục theo tính năng — gần với thư mục riêng _components</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 9.1 — Route, tham số & link</span><span class="lc-sub">Tham số route ở React Router</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Route group <code>(tên)</code></span><span class="v">Sắp xếp route và dùng chung layout; tên không bao giờ hiện trên URL.</span></div>
  <div class="kv"><span class="k">Thư mục riêng <code>_tên</code></span><span class="v">Bị loại hẳn khỏi định tuyến — kể cả <code>page.tsx</code> bên trong cũng 404.</span></div>
  <div class="kv"><span class="k">Segment động <code>[slug]</code></span><span class="v">Một thư mục khớp nhiều giá trị URL.</span></div>
  <div class="kv"><span class="k"><code>params</code></span><span class="v">Promise chứa các giá trị động (Next.js 15+) — phải <code>await</code>.</span></div>
  <div class="kv"><span class="k"><code>metadata</code></span><span class="v">Tiêu đề/mô tả tĩnh xuất từ page hoặc layout (Server Component).</span></div>
  <div class="kv"><span class="k">Khuôn tiêu đề</span><span class="v"><code>'%s — CuongThai'</code> trong layout; trang con điền vào <code>%s</code>.</span></div>
  <div class="kv"><span class="k"><code>generateMetadata</code></span><span class="v">Metadata bất đồng bộ, tính từ <code>params</code> và dữ liệu.</span></div>
  <div class="kv"><span class="k">Metadata truyền sau</span><span class="v">Trình duyệt nhận &lt;title&gt; sau &lt;head&gt;; bot chỉ đọc HTML nhận nó bên trong.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Route group <code>(tên)</code> tổ chức file mà không thêm đoạn URL.</li><li>Đoạn động <code>[slug]</code> bắt phần URL vào <code>params</code>.</li><li>Export một object <code>metadata</code> (hoặc <code>generateMetadata</code>) để đặt head SEO của trang.</li><li>Chương 17 đi sâu hơn về metadata và SEO.</li></ul>

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
