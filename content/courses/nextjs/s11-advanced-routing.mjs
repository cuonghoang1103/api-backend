/**
 * Next.js & React — Chương 11: Định tuyến chuyên sâu.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Thuần quy ước routing App Router — không có "output console" để chạy. Mọi cú pháp
 * ([...slug], [[...slug]], route.ts, @slot, (.)(..)) là quy ước CHÍNH THỨC nextjs.org.
 * Sự cố thật cuongthai.com (modal bình luận trên feed = intercepting route; FE proxy
 * route gọi nhầm route backend) lồng vào .note-ct/.pitfall.
 */

export default {
  title: 'Chapter 11 — Advanced routing|||Chương 11 — Định tuyến chuyên sâu',
  description: 'Vượt qua route cơ bản: catch-all [...slug] và optional [[...slug]], generateStaticParams để dựng sẵn route động, Route Handler (route.ts) làm API, parallel route (@slot) và intercepting route cho mẫu modal.',
  lessons: [
    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — Catch-all and optional catch-all segments|||11.1 — Segment catch-all và optional catch-all',
      slug: 'nextjs-11-1-catch-all',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Next.js 15 Tutorial - 34 - Parallel Intercepting Routes" — Codevolution (oEmbed verified).
      video: { url: 'https://youtu.be/U6aRqv7rzQ8', durationSeconds: 0 },
      description: 'Chương 8 giới thiệu [slug] khớp một đoạn. Đôi khi bạn cần khớp NHIỀU đoạn còn lại của URL: [...slug] gom hết, [[...slug]] gom hết kể cả khi rỗng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>One folder that matches many path segments</h2>
<p class="lead">A <code>[slug]</code> folder (Chapter 8) matches exactly one segment: <code>/blog/hello</code>. But some routes have a variable <em>depth</em> — documentation like <code>/docs/a/b/c</code>, a file browser, category trees. For those, the catch-all segment.</p>

<h3>Catch-all: [...slug]</h3>
<pre><code>app/docs/[...slug]/page.tsx

<span class="tok-comment">// matches /docs/a, /docs/a/b, /docs/a/b/c …</span>
export default async function Docs({ params }) {
  const { slug } = await params;   <span class="tok-comment">// slug is an ARRAY: ['a','b','c']</span>
  return &lt;p&gt;{slug.join(' / ')}&lt;/p&gt;;
}</code></pre>
<p>Three dots before the name. The matched value is an <strong>array</strong> of the segments, not a string. One page handles any depth. Note it does <em>not</em> match <code>/docs</code> itself (zero segments) — for that you need the optional form.</p>

<h3>Optional catch-all: [[...slug]]</h3>
<pre><code>app/shop/[[...slug]]/page.tsx

<span class="tok-comment">// matches /shop  AND  /shop/a  AND  /shop/a/b …</span>
export default async function Shop({ params }) {
  const { slug } = await params;   <span class="tok-comment">// undefined at /shop, else an array</span>
  <span class="tok-comment">// ...</span>
}</code></pre>
<p>Double brackets make the whole thing optional: the same page also serves the base path with <em>no</em> segments. At <code>/shop</code>, <code>slug</code> is <code>undefined</code>; at <code>/shop/a/b</code> it is <code>['a','b']</code>.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">[slug]</span><span class="v">Exactly one segment. Value is a string. Does not match the parent.</span></div>
  <div class="kv"><span class="k">[...slug]</span><span class="v">One or more segments. Value is an array. Does not match the bare parent.</span></div>
  <div class="kv"><span class="k">[[...slug]]</span><span class="v">Zero or more segments. Value is an array or undefined. Also matches the bare parent.</span></div>
</div>

<div class="callout warn">
<p><strong>More specific wins.</strong> If you have both <code>app/shop/[id]/page.tsx</code> and <code>app/shop/[[...slug]]/page.tsx</code>, a single-segment URL like <code>/shop/42</code> matches the more specific <code>[id]</code>, not the catch-all. Keep an eye on overlap when mixing dynamic forms in one folder.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Dynamic Routes</span><span class="lc-sub">[slug], [...slug], [[...slug]], and how params are shaped for each.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Một thư mục khớp nhiều đoạn đường dẫn</h2>
<p class="lead">Một thư mục <code>[slug]</code> (Chương 8) khớp đúng một đoạn: <code>/blog/hello</code>. Nhưng vài route có <em>độ sâu</em> thay đổi — tài liệu như <code>/docs/a/b/c</code>, trình duyệt file, cây danh mục. Cho những cái đó, segment catch-all.</p>

<h3>Catch-all: [...slug]</h3>
<pre><code>app/docs/[...slug]/page.tsx

<span class="tok-comment">// khớp /docs/a, /docs/a/b, /docs/a/b/c …</span>
export default async function Docs({ params }) {
  const { slug } = await params;   <span class="tok-comment">// slug là một MẢNG: ['a','b','c']</span>
  return &lt;p&gt;{slug.join(' / ')}&lt;/p&gt;;
}</code></pre>
<p>Ba dấu chấm trước tên. Giá trị khớp là một <strong>mảng</strong> các đoạn, không phải chuỗi. Một page lo mọi độ sâu. Để ý nó <em>không</em> khớp chính <code>/docs</code> (không đoạn nào) — cho việc đó bạn cần dạng optional.</p>

<h3>Optional catch-all: [[...slug]]</h3>
<pre><code>app/shop/[[...slug]]/page.tsx

<span class="tok-comment">// khớp /shop  VÀ  /shop/a  VÀ  /shop/a/b …</span>
export default async function Shop({ params }) {
  const { slug } = await params;   <span class="tok-comment">// undefined ở /shop, còn lại là mảng</span>
  <span class="tok-comment">// ...</span>
}</code></pre>
<p>Ngoặc vuông đôi làm cả cái thành tuỳ chọn: cùng page đó cũng phục vụ đường gốc <em>không có</em> đoạn nào. Ở <code>/shop</code>, <code>slug</code> là <code>undefined</code>; ở <code>/shop/a/b</code> nó là <code>['a','b']</code>.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">[slug]</span><span class="v">Đúng một đoạn. Giá trị là chuỗi. Không khớp cha.</span></div>
  <div class="kv"><span class="k">[...slug]</span><span class="v">Một hoặc nhiều đoạn. Giá trị là mảng. Không khớp cha trần.</span></div>
  <div class="kv"><span class="k">[[...slug]]</span><span class="v">Không hoặc nhiều đoạn. Giá trị là mảng hoặc undefined. Khớp cả cha trần.</span></div>
</div>

<div class="callout warn">
<p><strong>Cụ thể hơn thì thắng.</strong> Nếu bạn có cả <code>app/shop/[id]/page.tsx</code> lẫn <code>app/shop/[[...slug]]/page.tsx</code>, một URL một đoạn như <code>/shop/42</code> khớp cái cụ thể hơn <code>[id]</code>, không phải catch-all. Để ý sự chồng lấn khi trộn nhiều dạng động trong một thư mục.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Dynamic Routes</span><span class="lc-sub">[slug], [...slug], [[...slug]], và hình dạng params cho từng cái.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — generateStaticParams: pre-render dynamic routes|||11.2 — generateStaticParams: dựng sẵn route động',
      slug: 'nextjs-11-2-generate-static-params',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Một route động vẫn có thể được dựng sẵn thành HTML tĩnh lúc build. Khai báo danh sách giá trị bằng generateStaticParams để Next tạo trước mỗi trang — nhanh như tĩnh, vẫn là một file.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Dynamic does not have to mean rendered-on-every-request</h2>
<p class="lead">A <code>[slug]</code> route is dynamic, but if you know the set of values ahead of time — every blog post, every course — Next.js can render each one to static HTML at build. You supply the list with <code>generateStaticParams</code>.</p>

<pre><code><span class="tok-comment">// app/courses/[slug]/page.tsx</span>
export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map(c =&gt; ({ slug: c.slug }));   <span class="tok-comment">// [{slug:'nextjs'}, {slug:'nodejs'}…]</span>
}

export default async function CoursePage({ params }) {
  const { slug } = await params;
  <span class="tok-comment">// ...render the course</span>
}</code></pre>
<p>At build time, Next.js calls <code>generateStaticParams</code>, then renders <code>/courses/nextjs</code>, <code>/courses/nodejs</code>, and so on — each as a static page. Visitors get instant, cached HTML with no per-request work.</p>

<h3>What about a slug that wasn't in the list?</h3>
<p>A new course added after the build isn't pre-rendered. The <code>dynamicParams</code> setting decides what happens:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">dynamicParams = true (default)</span><span class="v">Unknown slugs are rendered on demand the first time (and can then be cached). Your list is a head start, not a whitelist.</span></div>
  <div class="kv"><span class="k">dynamicParams = false</span><span class="v">Unknown slugs return 404. Use when the set is truly fixed and anything else should not exist.</span></div>
</div>

<div class="callout ok">
<p><strong>How to think about it:</strong> <code>generateStaticParams</code> is "build these pages ahead of time." Combined with <code>revalidate</code> (Chapter 10) you get pages that are static and fast, yet refresh on a schedule — the sweet spot for content that is mostly stable but occasionally edited, like courses or docs.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/generate-static-params" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — generateStaticParams</span><span class="lc-sub">Pre-render dynamic segments at build, and the dynamicParams switch.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Động không nhất thiết là render-mỗi-request</h2>
<p class="lead">Một route <code>[slug]</code> là động, nhưng nếu bạn biết trước tập giá trị — mọi bài blog, mọi khoá học — Next.js có thể render từng cái ra HTML tĩnh lúc build. Bạn cung cấp danh sách bằng <code>generateStaticParams</code>.</p>

<pre><code><span class="tok-comment">// app/courses/[slug]/page.tsx</span>
export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map(c =&gt; ({ slug: c.slug }));   <span class="tok-comment">// [{slug:'nextjs'}, {slug:'nodejs'}…]</span>
}

export default async function CoursePage({ params }) {
  const { slug } = await params;
  <span class="tok-comment">// ...render khoá học</span>
}</code></pre>
<p>Lúc build, Next.js gọi <code>generateStaticParams</code>, rồi render <code>/courses/nextjs</code>, <code>/courses/nodejs</code>, v.v. — mỗi cái là một trang tĩnh. Khách nhận HTML tức thì đã cache, không phải làm gì theo từng request.</p>

<h3>Còn một slug không có trong danh sách thì sao?</h3>
<p>Một khoá học thêm sau khi build thì chưa được dựng sẵn. Thiết lập <code>dynamicParams</code> quyết điều gì xảy ra:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">dynamicParams = true (mặc định)</span><span class="v">Slug lạ được render theo yêu cầu ở lần đầu (rồi có thể cache). Danh sách của bạn là cú xuất phát trước, không phải danh sách trắng.</span></div>
  <div class="kv"><span class="k">dynamicParams = false</span><span class="v">Slug lạ trả 404. Dùng khi tập là cố định thật và mọi thứ khác không nên tồn tại.</span></div>
</div>

<div class="callout ok">
<p><strong>Cách nghĩ:</strong> <code>generateStaticParams</code> là "dựng sẵn các trang này trước". Ghép với <code>revalidate</code> (Chương 10) bạn có trang vừa tĩnh vừa nhanh, mà vẫn làm mới theo lịch — điểm ngọt cho nội dung phần lớn ổn định nhưng thỉnh thoảng sửa, như khoá học hay tài liệu.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/generate-static-params" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — generateStaticParams</span><span class="lc-sub">Dựng sẵn segment động lúc build, và công tắc dynamicParams.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.3 ─────────────────────────── */
    {
      title: '11.3 — Route Handlers: an API inside the app folder|||11.3 — Route Handler: một API ngay trong thư mục app',
      slug: 'nextjs-11-3-route-handlers',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Một file route.ts biến một segment thành endpoint API: export GET/POST… trả về Response. Dùng cho webhook, proxy, hay khi client cần một URL để fetch. Khác Server Action ra sao.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>A folder can be an API endpoint instead of a page</h2>
<p class="lead">Chapter 8 mentioned <code>route.ts</code> as the sibling of <code>page.tsx</code>. Where a page returns UI, a Route Handler returns <em>data</em>. You export functions named after HTTP methods; each receives a <code>Request</code> and returns a <code>Response</code>.</p>

<pre><code><span class="tok-comment">// app/api/health/route.ts  →  GET /api/health</span>
export async function GET() {
  return Response.json({ ok: true });
}

<span class="tok-comment">// app/api/posts/route.ts  →  POST /api/posts</span>
export async function POST(request) {
  const body = await request.json();
  const post = await db.post.create({ data: body });
  return Response.json(post, { status: 201 });
}</code></pre>
<p>The folder path is the URL, exactly like pages. A folder can have a <code>page.tsx</code> <em>or</em> a <code>route.ts</code>, not both — one serves HTML, the other serves a response.</p>

<h3>When you actually need a Route Handler</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Webhooks</span><span class="v">A third party (Stripe, GitHub) needs a URL to POST to. That must be a real endpoint.</span></div>
  <div class="kv"><span class="k">Serving non-HTML</span><span class="v">JSON for an external caller, an RSS feed, an OG image, a file download.</span></div>
  <div class="kv"><span class="k">A key-hiding proxy</span><span class="v">The browser needs data from a third-party API whose key must stay secret — the client calls your handler, your handler calls the API with the key server-side.</span></div>
  <div class="kv"><span class="k">Client fetch target</span><span class="v">A Client Component that must fetch from a URL (e.g. on interaction) needs something to fetch <em>from</em>.</span></div>
</div>

<h3>Route Handler vs Server Action</h3>
<p>Both run on the server. The difference is the caller. A <strong>Route Handler</strong> is a public URL — anyone or anything can hit it; reach for it when you need an addressable endpoint (webhooks, external clients, proxies). A <strong>Server Action</strong> (Chapter 12) is called from your own React as if it were a function — reach for it for form submits and mutations from your own UI, with no URL to wire up. Rule of thumb: <em>need a URL → Route Handler; mutating from your own form → Server Action.</em></p>

<div class="note-ct">
<p><strong>cuongthai.com's split:</strong> the heavy API is a separate Express/TypeScript backend, and the Next.js frontend uses route handlers mainly as thin proxies to it (for example, forwarding auth calls so a secret or cookie is handled server-side). A real bug from the project: a frontend proxy route once called a backend path that did not exist, so every request through it failed even though the cookie was present. Lesson: a proxy handler is only as correct as the URL it forwards to — verify the downstream route exists, don't assume.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route Handlers</span><span class="lc-sub">GET/POST exports, Request/Response, and caching for handlers.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Một thư mục có thể là endpoint API thay vì một page</h2>
<p class="lead">Chương 8 có nhắc <code>route.ts</code> là anh em của <code>page.tsx</code>. Page trả về UI, còn Route Handler trả về <em>dữ liệu</em>. Bạn export các hàm đặt tên theo phương thức HTTP; mỗi hàm nhận một <code>Request</code> và trả về một <code>Response</code>.</p>

<pre><code><span class="tok-comment">// app/api/health/route.ts  →  GET /api/health</span>
export async function GET() {
  return Response.json({ ok: true });
}

<span class="tok-comment">// app/api/posts/route.ts  →  POST /api/posts</span>
export async function POST(request) {
  const body = await request.json();
  const post = await db.post.create({ data: body });
  return Response.json(post, { status: 201 });
}</code></pre>
<p>Đường dẫn thư mục là URL, y như page. Một thư mục có thể có <code>page.tsx</code> <em>hoặc</em> <code>route.ts</code>, không cả hai — một cái phục vụ HTML, cái kia phục vụ một response.</p>

<h3>Khi nào bạn thật sự cần Route Handler</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Webhook</span><span class="v">Một bên thứ ba (Stripe, GitHub) cần một URL để POST tới. Cái đó phải là endpoint thật.</span></div>
  <div class="kv"><span class="k">Phục vụ không-phải-HTML</span><span class="v">JSON cho một bên gọi ngoài, một RSS feed, một ảnh OG, một file tải về.</span></div>
  <div class="kv"><span class="k">Proxy giấu khoá</span><span class="v">Trình duyệt cần dữ liệu từ một API bên thứ ba mà khoá phải bí mật — client gọi handler của bạn, handler gọi API với khoá ở phía server.</span></div>
  <div class="kv"><span class="k">Đích fetch của client</span><span class="v">Một Client Component phải fetch từ một URL (ví dụ khi tương tác) cần một chỗ để fetch <em>từ đó</em>.</span></div>
</div>

<h3>Route Handler và Server Action</h3>
<p>Cả hai chạy trên server. Khác nhau ở người gọi. Một <strong>Route Handler</strong> là một URL công khai — ai/cái gì cũng gọi được; dùng khi bạn cần một endpoint có địa chỉ (webhook, client ngoài, proxy). Một <strong>Server Action</strong> (Chương 12) được gọi từ chính React của bạn như thể nó là một hàm — dùng cho gửi form và mutation từ UI của chính bạn, không phải nối một URL nào. Quy tắc ngón tay cái: <em>cần một URL → Route Handler; mutate từ form của chính bạn → Server Action.</em></p>

<div class="note-ct">
<p><strong>Cách chia của cuongthai.com:</strong> API nặng là một backend Express/TypeScript riêng, và frontend Next.js dùng route handler chủ yếu như proxy mỏng tới nó (ví dụ chuyển tiếp lời gọi auth để một bí mật hay cookie được xử lý ở phía server). Một bug thật của dự án: một route proxy frontend từng gọi một đường backend không tồn tại, nên mọi request qua nó đều hỏng dù cookie vẫn có. Bài học: một handler proxy chỉ đúng bằng chính URL nó chuyển tới — hãy kiểm route hạ nguồn có tồn tại, đừng đoán.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route Handlers</span><span class="lc-sub">Export GET/POST, Request/Response, và cache cho handler.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — Parallel routes: independent sections in one layout|||11.4 — Parallel route: nhiều vùng độc lập trong một layout',
      slug: 'nextjs-11-4-parallel-routes',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Một layout có thể render NHIỀU trang cùng lúc trong các khe song song (@folder), mỗi khe điều hướng và loading/error độc lập. Nền cho dashboard nhiều panel và mẫu modal.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Render more than one page into one layout, at once</h2>
<p class="lead">Normally a layout has one slot: <code>{children}</code>. Parallel routes give it several named slots, each filled by its own independent page. You define a slot with a folder prefixed by <code>@</code>.</p>

<pre><code>app/dashboard/
├─ layout.tsx
├─ @team/page.tsx        <span class="tok-comment">// slot: team</span>
└─ @analytics/page.tsx   <span class="tok-comment">// slot: analytics</span></code></pre>
<pre><code><span class="tok-comment">// layout.tsx receives each @slot as a prop, named after the folder</span>
export default function Layout({ children, team, analytics }) {
  return (
    &lt;&gt;
      {children}
      &lt;section&gt;{team}&lt;/section&gt;
      &lt;section&gt;{analytics}&lt;/section&gt;
    &lt;/&gt;
  );
}</code></pre>
<p>The <code>@</code> folders are <strong>not</strong> URL segments — like route groups, the name never appears in the path. Instead each becomes a prop on the layout. You now render <code>team</code> and <code>analytics</code> side by side, and each can have its own <code>loading.tsx</code> and <code>error.tsx</code>, so one slow section streams in without blocking the other.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Independent loading/error</span><span class="v">Each slot has its own Suspense/error boundary. A failing analytics panel does not take down the team panel.</span></div>
  <div class="kv"><span class="k">Independent navigation</span><span class="v">A slot can navigate on its own while the others stay put — the foundation of the modal pattern in the next lesson.</span></div>
  <div class="kv"><span class="k">default.tsx</span><span class="v">When a slot has no match for the current URL, Next renders its <code>default.tsx</code> — provide one to avoid a 404 on hard reloads.</span></div>
</div>

<div class="note-ct">
<p><strong>Where cuongthai.com would use this:</strong> a dashboard-style screen showing several independent widgets — analytics, system stats, recent activity — is a textbook parallel-routes layout. Each panel loads and errors on its own, so a slow stats query streams in late without freezing the rest of the page.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/parallel-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Parallel Routes</span><span class="lc-sub">@slots, per-slot loading/error, and default.tsx.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Render nhiều hơn một page vào một layout, cùng lúc</h2>
<p class="lead">Bình thường một layout có một khe: <code>{children}</code>. Parallel route cho nó nhiều khe có tên, mỗi khe do một page độc lập lấp vào. Bạn định nghĩa một khe bằng một thư mục có tiền tố <code>@</code>.</p>

<pre><code>app/dashboard/
├─ layout.tsx
├─ @team/page.tsx        <span class="tok-comment">// khe: team</span>
└─ @analytics/page.tsx   <span class="tok-comment">// khe: analytics</span></code></pre>
<pre><code><span class="tok-comment">// layout.tsx nhận mỗi @khe làm một prop, đặt tên theo thư mục</span>
export default function Layout({ children, team, analytics }) {
  return (
    &lt;&gt;
      {children}
      &lt;section&gt;{team}&lt;/section&gt;
      &lt;section&gt;{analytics}&lt;/section&gt;
    &lt;/&gt;
  );
}</code></pre>
<p>Các thư mục <code>@</code> <strong>không</strong> phải là đoạn URL — như route group, tên không bao giờ hiện trên đường dẫn. Thay vào đó mỗi cái thành một prop trên layout. Giờ bạn render <code>team</code> và <code>analytics</code> cạnh nhau, và mỗi cái có <code>loading.tsx</code> và <code>error.tsx</code> riêng, nên một vùng chậm stream vào mà không chặn vùng kia.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Loading/error độc lập</span><span class="v">Mỗi khe có ranh giới Suspense/error riêng. Một panel analytics hỏng không kéo đổ panel team.</span></div>
  <div class="kv"><span class="k">Điều hướng độc lập</span><span class="v">Một khe có thể tự điều hướng trong khi các khe khác đứng yên — nền của mẫu modal ở bài sau.</span></div>
  <div class="kv"><span class="k">default.tsx</span><span class="v">Khi một khe không có gì khớp URL hiện tại, Next render <code>default.tsx</code> của nó — hãy cung cấp một cái để tránh 404 khi tải lại cứng.</span></div>
</div>

<div class="note-ct">
<p><strong>Chỗ cuongthai.com sẽ dùng cái này:</strong> một màn kiểu dashboard hiện nhiều widget độc lập — analytics, thống kê hệ thống, hoạt động gần đây — là một layout parallel-routes bài bản. Mỗi panel tự tải và tự báo lỗi, nên một truy vấn thống kê chậm stream vào muộn mà không đóng băng phần còn lại.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/parallel-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Parallel Routes</span><span class="lc-sub">@khe, loading/error theo từng khe, và default.tsx.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.5 ─────────────────────────── */
    {
      title: '11.5 — Intercepting routes: the modal pattern|||11.5 — Intercepting route: mẫu modal',
      slug: 'nextjs-11-5-intercepting-routes',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Mở một ảnh/bài trong modal khi bấm từ feed, nhưng URL vẫn là trang chi tiết đầy đủ để chia sẻ và tải lại. Intercepting route ((.)/(..)) chặn điều hướng mềm để hiện modal, còn tải cứng thì ra trang thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>Same URL, two experiences: a modal when clicked, a full page when loaded</h2>
<p class="lead">You have seen this everywhere: click a photo in a feed and it opens in a modal over the feed, but the address bar shows <code>/photo/123</code>. Copy that link, open it fresh, and you get the full photo page. One URL, two presentations — that is an intercepting route.</p>

<h3>The two navigation types it distinguishes</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Soft navigation</span><span class="v">A client <code>&lt;Link&gt;</code> click from within the app. The intercepting route catches it and shows the modal, keeping the feed behind.</span></div>
  <div class="kv"><span class="k">Hard navigation</span><span class="v">A fresh load, refresh, or shared link. No interception — Next serves the real, full page at that URL.</span></div>
</div>

<h3>The syntax: (.) means "intercept this level"</h3>
<pre><code>app/
├─ feed/page.tsx
├─ photo/[id]/page.tsx          <span class="tok-comment">// the REAL full page (hard load)</span>
└─ feed/
   └─ (.)photo/[id]/page.tsx    <span class="tok-comment">// intercepts a soft nav → modal</span></code></pre>
<p>The marker mirrors relative paths: <code>(.)</code> same level, <code>(..)</code> one level up, <code>(..)(..)</code> two levels, <code>(...)</code> from the app root. It is paired with a parallel-route slot (lesson 11.4) — typically a <code>@modal</code> slot in the layout — so the intercepted page renders into the modal slot while the underlying page stays mounted.</p>

<div class="note-ct">
<p><strong>This is exactly the cuongthai.com feed comment/photo modal.</strong> Clicking a post opens its detail in a modal over the feed (soft navigation), while the URL updates to the shareable post page. Share that URL or open it directly and you land on the full standalone post (hard navigation) — the same behaviour as opening a Facebook photo. Intercepting + parallel routes are the framework-native way to build that, instead of a hand-rolled modal that forgets to update the URL and breaks sharing.</p>
</div>

<div class="callout warn">
<p><strong>Always ship the real page too.</strong> The intercepted modal is only for soft navigation. If you forget the standalone <code>photo/[id]/page.tsx</code>, a shared link or a refresh has nothing to render. The pattern is two routes working together: the full page for hard loads, the interceptor for in-app clicks.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🎭</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Intercepting Routes</span><span class="lc-sub">(.) (..) (...) markers and the modal pattern with parallel routes.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Cùng một URL, hai trải nghiệm: modal khi bấm, trang đầy đủ khi tải</h2>
<p class="lead">Bạn thấy cái này khắp nơi: bấm một ảnh trong feed và nó mở trong một modal đè lên feed, nhưng thanh địa chỉ hiện <code>/photo/123</code>. Chép link đó, mở mới, bạn ra trang ảnh đầy đủ. Một URL, hai cách trình bày — đó là intercepting route.</p>

<h3>Hai loại điều hướng nó phân biệt</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Điều hướng mềm (soft)</span><span class="v">Một cú bấm <code>&lt;Link&gt;</code> client từ trong app. Intercepting route bắt nó và hiện modal, giữ feed phía sau.</span></div>
  <div class="kv"><span class="k">Điều hướng cứng (hard)</span><span class="v">Một lần tải mới, refresh, hay link chia sẻ. Không chặn — Next phục vụ trang thật, đầy đủ ở URL đó.</span></div>
</div>

<h3>Cú pháp: (.) nghĩa là "chặn ở cấp này"</h3>
<pre><code>app/
├─ feed/page.tsx
├─ photo/[id]/page.tsx          <span class="tok-comment">// trang đầy đủ THẬT (tải cứng)</span>
└─ feed/
   └─ (.)photo/[id]/page.tsx    <span class="tok-comment">// chặn một nav mềm → modal</span></code></pre>
<p>Dấu hiệu phản chiếu đường dẫn tương đối: <code>(.)</code> cùng cấp, <code>(..)</code> lên một cấp, <code>(..)(..)</code> hai cấp, <code>(...)</code> từ gốc app. Nó đi kèm một khe parallel-route (bài 11.4) — thường là một khe <code>@modal</code> trong layout — để trang bị chặn render vào khe modal trong khi trang bên dưới vẫn mount.</p>

<div class="note-ct">
<p><strong>Đây đúng là modal bình luận/ảnh trên feed cuongthai.com.</strong> Bấm một bài mở phần chi tiết của nó trong một modal đè lên feed (điều hướng mềm), trong khi URL cập nhật thành trang bài viết chia sẻ được. Chia sẻ URL đó hoặc mở trực tiếp thì bạn tới trang bài viết độc lập đầy đủ (điều hướng cứng) — đúng hành vi khi mở một ảnh Facebook. Intercepting + parallel route là cách gốc-của-framework để dựng cái đó, thay vì một modal tự chế quên cập nhật URL và làm hỏng việc chia sẻ.</p>
</div>

<div class="callout warn">
<p><strong>Luôn ship cả trang thật.</strong> Modal bị chặn chỉ cho điều hướng mềm. Nếu bạn quên trang độc lập <code>photo/[id]/page.tsx</code>, một link chia sẻ hay một lần refresh chẳng có gì để render. Mẫu này là hai route làm việc cùng nhau: trang đầy đủ cho tải cứng, cái chặn cho các cú bấm trong app.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🎭</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Intercepting Routes</span><span class="lc-sub">Dấu (.) (..) (...) và mẫu modal với parallel route.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.6 QUIZ ─────────────────────────── */
    {
      title: '11.6 — Chapter 11 quiz|||11.6 — Kiểm tra chương 11',
      slug: 'nextjs-11-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về định tuyến sâu: catch-all và optional catch-all, generateStaticParams/dynamicParams, Route Handler vs Server Action, parallel route (@slot, default.tsx), intercepting route và mẫu modal.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 11: catch-all and optional catch-all segments, generateStaticParams and dynamicParams, Route Handlers vs Server Actions, parallel routes, and intercepting routes.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 11: segment catch-all và optional catch-all, generateStaticParams và dynamicParams, Route Handler vs Server Action, parallel route, và intercepting route.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'app/docs/[...slug]/page.tsx — what is params.slug for /docs/a/b/c?|||app/docs/[...slug]/page.tsx — params.slug là gì với /docs/a/b/c?',
            options: [
              "the string 'a/b/c'|||chuỗi 'a/b/c'",
              "an array ['a','b','c']|||một mảng ['a','b','c']",
              'undefined|||undefined',
              'only c|||chỉ c',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which segment ALSO matches the bare parent path (e.g. /shop with no extra segments)?|||Segment nào CŨNG khớp đường cha trần (ví dụ /shop không đoạn thêm)?',
            options: [
              '[slug]|||[slug]',
              '[...slug]|||[...slug]',
              '[[...slug]] (optional catch-all)|||[[...slug]] (optional catch-all)',
              'none can|||không cái nào',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'What does generateStaticParams do?|||generateStaticParams làm gì?',
            options: [
              'blocks unknown slugs with a 404|||chặn slug lạ bằng 404',
              'supplies the list of param values to pre-render dynamic routes at build|||cung cấp danh sách giá trị param để dựng sẵn route động lúc build',
              'fetches data at request time|||fetch dữ liệu lúc request',
              'creates route handlers|||tạo route handler',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With dynamicParams = false, a slug not returned by generateStaticParams…|||Với dynamicParams = false, một slug không có trong generateStaticParams…',
            options: [
              'is rendered on demand|||được render theo yêu cầu',
              'returns 404|||trả 404',
              'redirects home|||chuyển về trang chủ',
              'throws a build error|||ném lỗi build',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A folder with route.ts (not page.tsx) becomes…|||Một thư mục có route.ts (không page.tsx) trở thành…',
            options: [
              'a page that renders UI|||một page render UI',
              'an API endpoint that exports GET/POST and returns a Response|||một endpoint API export GET/POST và trả về Response',
              'a layout|||một layout',
              'invalid — you need both|||không hợp lệ — cần cả hai',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Best choice for a Stripe webhook URL that Stripe will POST to?|||Lựa chọn tốt nhất cho một URL webhook Stripe sẽ POST tới?',
            options: [
              'a Server Action|||một Server Action',
              'a Route Handler (route.ts) — an addressable public endpoint|||một Route Handler (route.ts) — một endpoint công khai có địa chỉ',
              'a useEffect|||một useEffect',
              'a page.tsx|||một page.tsx',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A folder named @analytics in a parallel-route layout is…|||Một thư mục tên @analytics trong layout parallel-route là…',
            options: [
              'a URL segment /analytics|||một đoạn URL /analytics',
              'a named slot passed to the layout as a prop; not part of the URL|||một khe có tên truyền cho layout làm prop; không thuộc URL',
              'a route group|||một route group',
              'an error|||một lỗi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why give a parallel-route slot a default.tsx?|||Vì sao cho một khe parallel-route một default.tsx?',
            options: [
              'to set its title|||để đặt title cho nó',
              'so the slot has something to render (avoiding a 404) when the URL has no match for it, e.g. on hard reload|||để khe có cái để render (tránh 404) khi URL không khớp nó, ví dụ khi tải lại cứng',
              'to cache the slot|||để cache khe',
              'it is required for all folders|||nó bắt buộc cho mọi thư mục',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An intercepting route shows a modal on a soft nav but a full page on a hard load. What is a hard load?|||Một intercepting route hiện modal khi nav mềm nhưng trang đầy đủ khi tải cứng. Tải cứng là gì?',
            options: [
              'clicking a <Link> inside the app|||bấm một <Link> trong app',
              'a fresh load, refresh, or opening a shared link directly|||một lần tải mới, refresh, hoặc mở trực tiếp một link chia sẻ',
              'any client transition|||bất kỳ chuyển cảnh client nào',
              'a router.push call|||một lời gọi router.push',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'For the feed "click a post → modal, share the URL → full page" pattern, what must you build?|||Cho mẫu "bấm bài → modal, chia sẻ URL → trang đầy đủ" của feed, bạn phải dựng gì?',
            options: [
              'only the intercepting (.)route|||chỉ route chặn (.)',
              'both the real standalone page AND the intercepting route (with a parallel @modal slot)|||cả trang độc lập thật LẪN route chặn (với một khe parallel @modal)',
              'only a client-side modal component|||chỉ một component modal phía client',
              'a Route Handler|||một Route Handler',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
