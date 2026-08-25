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

<h3>The four dynamic segment shapes</h3>
<div class="lz-map">
  <div class="lz-stage">Brackets, and what each one matches</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">[id]</div><div class="lz-nsub">Exactly one segment. &#96;/notes/12&#96; matches, &#96;/notes&#96; and &#96;/notes/12/edit&#96; do not.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">[...slug]</div><div class="lz-nsub">One or more segments, as an array. &#96;/docs/a/b/c&#96; gives &#96;[&#39;a&#39;,&#39;b&#39;,&#39;c&#39;]&#96;; the bare &#96;/docs&#96; still does not match.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">[[...slug]]</div><div class="lz-nsub">Zero or more. Now &#96;/docs&#96; matches too, with &#96;slug&#96; undefined — one route for the index and every depth below it.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Every value is a string</div><div class="lz-nsub">&#96;params.id&#96; is &#96;&#39;12&#39;&#96;, never &#96;12&#96;. Convert deliberately, and check the conversion before using it in a query.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — passing a route param straight into a database query as a number.</strong> &#96;where: { id: Number(params.id) }&#96; on &#96;/notes/abc&#96; passes &#96;NaN&#96;, which most drivers turn into an error deep in the query layer — a stack trace about an invalid parameter rather than &quot;this URL is nonsense&quot;. The visitor gets a 500 for what should be a 404, and your error tracker fills with them, because a crawler will try every shape of URL eventually. Validate the param first: check the parse, and call &#96;notFound()&#96; when it fails. That is a two-line guard that turns a class of 500s into the correct response.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Dynamic routes</span><span class="lc-sub">Every bracket form, with the params shape each produces.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/not-found" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — notFound()</span><span class="lc-sub">Rendering the 404 view from inside a component, and where it may be called.</span></span>
</a>

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

<h3>Bốn dạng đoạn động</h3>
<div class="lz-map">
  <div class="lz-stage">Dấu ngoặc vuông, và mỗi dạng khớp cái gì</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">[id]</div><div class="lz-nsub">Đúng một đoạn. &#96;/notes/12&#96; khớp, còn &#96;/notes&#96; và &#96;/notes/12/edit&#96; thì không.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">[...slug]</div><div class="lz-nsub">Một đoạn trở lên, dưới dạng mảng. &#96;/docs/a/b/c&#96; cho ra &#96;[&#39;a&#39;,&#39;b&#39;,&#39;c&#39;]&#96;; còn &#96;/docs&#96; trần thì vẫn không khớp.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">[[...slug]]</div><div class="lz-nsub">Không đoạn nào cũng được. Giờ &#96;/docs&#96; cũng khớp, với &#96;slug&#96; là undefined — một route cho cả trang chỉ mục lẫn mọi độ sâu bên dưới.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Mọi giá trị đều là chuỗi</div><div class="lz-nsub">&#96;params.id&#96; là &#96;&#39;12&#39;&#96;, không bao giờ là &#96;12&#96;. Hãy chuyển đổi có chủ đích, và kiểm kết quả chuyển đổi trước khi dùng nó trong một truy vấn.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — truyền thẳng một tham số route vào truy vấn cơ sở dữ liệu dưới dạng số.</strong> &#96;where: { id: Number(params.id) }&#96; với &#96;/notes/abc&#96; sẽ truyền vào &#96;NaN&#96;, thứ mà phần lớn driver biến thành một lỗi sâu trong tầng truy vấn — một vệt stack về tham số không hợp lệ chứ không phải câu &quot;cái URL này vô nghĩa&quot;. Khách nhận một cú 500 cho thứ lẽ ra phải là 404, và hệ theo dõi lỗi của bạn đầy những cái đó, vì sớm muộn cũng có bot thử đủ mọi hình dạng URL. Hãy kiểm tham số trước: kiểm kết quả chuyển đổi, và gọi &#96;notFound()&#96; khi nó hỏng. Đó là một chốt chặn hai dòng biến cả một họ lỗi 500 thành phản hồi đúng.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route động</span><span class="lc-sub">Mọi dạng ngoặc vuông, kèm dáng params mà từng cái sinh ra.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/not-found" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — notFound()</span><span class="lc-sub">Vẽ khung 404 từ bên trong một component, và chỗ nào được phép gọi nó.</span></span>
</a>

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

<h3>Pre-rendering a dynamic route at build time</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Return the list of params to build</b> — &#96;generateStaticParams&#96; runs at build and returns &#96;[{ slug: &#39;a&#39; }, { slug: &#39;b&#39; }]&#96;. Next renders one HTML file per entry.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Those pages are then static</b> — Served from a file or a CDN. No database call per visit, and the build output marks them with &#96;●&#96;.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Unlisted params still work by default</b> — They render on demand the first time and are cached afterwards. Set &#96;dynamicParams = false&#96; to 404 them instead.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>The list is fixed until the next build</b> — New content added after deploy is not in it, which is what on-demand revalidation is for.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — generating every param for a table that keeps growing.</strong> Returning ten thousand slugs makes the build render ten thousand pages: the build time goes from forty seconds to twenty minutes, CI times out, and the deploy that used to be routine becomes a thing people avoid doing. Worse, the cost grows silently with the data, so it is fine until the day it is not. Generate the pages that matter — the most visited, the most recent hundred — and let the long tail render on demand and cache. The build output tells you what you signed up for: check the page count after adding this function.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/generate-static-params" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — generateStaticParams</span><span class="lc-sub">The signature, nested routes, and how dynamicParams interacts with it.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Partial prerendering</span><span class="lc-sub">Where this is heading: a static shell with dynamic holes, in one route.</span></span>
</a>

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

<h3>Dựng sẵn một route động lúc build</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Trả về danh sách params cần dựng</b> — &#96;generateStaticParams&#96; chạy lúc build và trả về &#96;[{ slug: &#39;a&#39; }, { slug: &#39;b&#39; }]&#96;. Next vẽ ra một file HTML cho mỗi mục.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Những trang đó từ đó là tĩnh</b> — Phục vụ từ một file hoặc một CDN. Không gọi cơ sở dữ liệu ở mỗi lượt ghé, và đầu ra của build đánh dấu chúng bằng &#96;●&#96;.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Params không có trong danh sách vẫn chạy được, mặc định</b> — Chúng được vẽ theo yêu cầu ở lần đầu rồi được nhớ đệm. Đặt &#96;dynamicParams = false&#96; nếu bạn muốn chúng thành 404.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Danh sách đó cố định cho tới lần build sau</b> — Nội dung thêm vào sau khi deploy không nằm trong đó, và đó là việc của phép làm mới theo yêu cầu.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — sinh mọi params cho một bảng cứ lớn dần.</strong> Trả về mười nghìn slug là bắt bản build vẽ mười nghìn trang: thời gian build đi từ bốn mươi giây lên hai mươi phút, CI hết giờ, và cái lần deploy vốn là chuyện thường ngày trở thành thứ người ta né tránh. Tệ hơn, chi phí ấy lớn lên lặng lẽ theo dữ liệu, nên nó vẫn ổn cho tới cái ngày nó không còn ổn. Hãy sinh những trang đáng sinh — trang được ghé nhiều nhất, một trăm trang mới nhất — và để cái đuôi dài vẽ theo yêu cầu rồi nhớ đệm. Đầu ra của build cho bạn biết bạn đã ký vào cái gì: hãy kiểm số trang sau khi thêm hàm này.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/generate-static-params" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — generateStaticParams</span><span class="lc-sub">Chữ ký, route lồng nhau, và dynamicParams tương tác với nó ra sao.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Partial prerendering</span><span class="lc-sub">Hướng đi sắp tới: một cái vỏ tĩnh với các lỗ động, trong cùng một route.</span></span>
</a>

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

<h3>When you still need an API route</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Not for your own pages</b> — A Server Component can query the database directly. Calling your own route from it is a network hop to your own process.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Yes for external callers</b> — A webhook from Stripe, a mobile app, a third-party integration — anything that is not your own React tree.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Yes for non-HTML responses</b> — An image, a PDF, a CSV export, an RSS feed. Return a &#96;Response&#96; with the right &#96;Content-Type&#96;.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Export by method name</b> — &#96;export async function GET(req)&#96;, &#96;POST&#96;, &#96;DELETE&#96;. A method with no export returns 405 automatically.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a route handler that is cached when you meant it to be live.</strong> A &#96;GET&#96; handler with no dynamic input can be statically evaluated at build time, so it runs once and every visitor gets the same body forever — a &quot;random quote&quot; endpoint that returns the same quote for a week, or a health check that reports the state of the build machine. It is the correct default and completely invisible: the response is a 200 with plausible content. Reading &#96;request&#96;, &#96;cookies()&#96; or &#96;headers()&#96; opts it into dynamic automatically; otherwise say so explicitly with &#96;export const dynamic = &#39;force-dynamic&#39;&#96;.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers" target="_blank" rel="noopener">
  <span class="lc-ico">🛣️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route handlers</span><span class="lc-sub">Methods, Request/Response, streaming, and the caching rules.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/Response" target="_blank" rel="noopener">
  <span class="lc-ico">📨</span>
  <span class="lc-body"><span class="lc-title">MDN — Response</span><span class="lc-sub">The web-standard object route handlers return, with every constructor option.</span></span>
</a>

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

<h3>Khi nào bạn vẫn cần một route API</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Không dùng cho chính các trang của bạn</b> — Một Server Component truy vấn cơ sở dữ liệu trực tiếp được. Gọi route của chính mình từ đó là một chặng mạng đi vòng về chính tiến trình của mình.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Có, cho các bên gọi từ ngoài</b> — Một webhook từ Stripe, một ứng dụng di động, một tích hợp bên thứ ba — bất cứ thứ gì không phải cây React của chính bạn.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Có, cho các phản hồi không phải HTML</b> — Một tấm ảnh, một file PDF, một bản xuất CSV, một nguồn RSS. Hãy trả về một &#96;Response&#96; với đúng &#96;Content-Type&#96;.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Export theo tên phương thức</b> — &#96;export async function GET(req)&#96;, &#96;POST&#96;, &#96;DELETE&#96;. Một phương thức không được export sẽ tự động trả 405.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một route handler bị nhớ đệm trong khi bạn định cho nó chạy trực tiếp.</strong> Một handler &#96;GET&#96; không có đầu vào động có thể được tính sẵn lúc build, nên nó chạy đúng một lần và mọi khách đều nhận cùng một thân phản hồi mãi mãi — một endpoint &quot;câu nói ngẫu nhiên&quot; trả về đúng một câu suốt một tuần, hay một phép kiểm sức khoẻ báo cáo tình trạng của máy build. Đó là mặc định đúng và hoàn toàn vô hình: phản hồi là 200 với nội dung nghe rất hợp lý. Đọc &#96;request&#96;, &#96;cookies()&#96; hay &#96;headers()&#96; sẽ tự động đưa nó sang động; không thì hãy nói rõ ra bằng &#96;export const dynamic = &#39;force-dynamic&#39;&#96;.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers" target="_blank" rel="noopener">
  <span class="lc-ico">🛣️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route handler</span><span class="lc-sub">Các phương thức, Request/Response, streaming, và luật nhớ đệm.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/Response" target="_blank" rel="noopener">
  <span class="lc-ico">📨</span>
  <span class="lc-body"><span class="lc-title">MDN — Response</span><span class="lc-sub">Object chuẩn web mà route handler trả về, kèm mọi tuỳ chọn của hàm dựng.</span></span>
</a>

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

<h3>Rendering two independent panes in one URL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>A slot is a folder named @name</b> — &#96;@feed&#96; and &#96;@sidebar&#96; beside &#96;page.tsx&#96;. They do not add anything to the URL.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The layout receives them as props</b> — &#96;export default function Layout({ children, feed, sidebar })&#96;. Each is a rendered subtree you place wherever you like.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Each slot loads and errors on its own</b> — A slow feed does not block the sidebar, and a failed sidebar does not take down the page. Separate Suspense and error boundaries, for free.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>default.tsx handles the unmatched case</b> — When a navigation matches one slot and not the other, the missing slot renders its &#96;default&#96; instead of disappearing.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a parallel route that 404s the whole page after a hard refresh.</strong> Soft navigation keeps the previous state of a slot that has no match for the new URL, so everything looks fine while you click around. Reload the page and Next has no state to fall back on: a slot with no matching segment and no &#96;default.tsx&#96; makes the whole route 404. The bug therefore only appears on a direct link or a refresh — never during development, where you navigated in. Add a &#96;default.tsx&#96; to every slot, even if it just returns &#96;null&#96;, the moment you add a parallel route.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/parallel-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Parallel routes</span><span class="lc-sub">Slots, default.tsx, and the soft-vs-hard navigation difference this trap is about.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/default" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — default.js</span><span class="lc-sub">Exactly when it renders, and why omitting it produces a 404.</span></span>
</a>

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

<h3>Vẽ hai khung độc lập trong cùng một URL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Một khe (slot) là một thư mục tên @name</b> — &#96;@feed&#96; và &#96;@sidebar&#96; nằm cạnh &#96;page.tsx&#96;. Chúng không thêm gì vào URL.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Layout nhận chúng dưới dạng props</b> — &#96;export default function Layout({ children, feed, sidebar })&#96;. Mỗi cái là một cây con đã vẽ, bạn đặt vào đâu tuỳ ý.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Mỗi khe tự tải và tự hỏng riêng</b> — Một feed chậm không chặn thanh bên, và một thanh bên hỏng không kéo sập cả trang. Ranh giới Suspense và ranh giới lỗi riêng biệt, miễn phí.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>default.tsx lo trường hợp không khớp</b> — Khi một lần chuyển trang khớp khe này mà không khớp khe kia, khe thiếu sẽ vẽ &#96;default&#96; của nó thay vì biến mất.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một parallel route làm cả trang 404 sau khi tải lại cứng.</strong> Chuyển trang mềm giữ lại trạng thái trước đó của một khe không khớp URL mới, nên mọi thứ trông vẫn ổn khi bạn bấm loanh quanh. Tải lại trang là Next chẳng còn trạng thái nào để lùi về: một khe không có đoạn nào khớp và cũng không có &#96;default.tsx&#96; sẽ làm cả route trả 404. Cái lỗi vì thế chỉ hiện ra khi vào bằng liên kết trực tiếp hoặc khi tải lại — chẳng bao giờ hiện lúc phát triển, vì lúc đó bạn đi vào bằng điều hướng. Hãy thêm một &#96;default.tsx&#96; cho mọi khe, dù nó chỉ trả về &#96;null&#96;, ngay khi bạn thêm một parallel route.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/parallel-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Parallel route</span><span class="lc-sub">Khe, default.tsx, và khác biệt chuyển-trang-mềm với cứng mà bẫy này nói tới.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/default" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — default.js</span><span class="lc-sub">Chính xác khi nào nó được vẽ, và vì sao bỏ nó đi lại sinh ra 404.</span></span>
</a>

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

<h3>Intercepting a route to show it as a modal</h3>
<div class="lz-map">
  <div class="lz-stage">Same URL, two presentations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">The convention is (.) (..) (...)</div><div class="lz-nsub">Like relative paths, but for route segments: &#96;(.)photo&#96; intercepts a sibling, &#96;(..)photo&#96; one level up.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">A soft navigation renders the interception</div><div class="lz-nsub">Clicking a thumbnail shows the photo in a modal over the current page, and the URL updates to the photo&#39;s own.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">A hard load renders the real route</div><div class="lz-nsub">Sharing that URL, or reloading it, gives the full photo page. One address, two correct presentations.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">It pairs with a parallel route</div><div class="lz-nsub">The modal lives in a &#96;@modal&#96; slot so it can be rendered over the page rather than instead of it.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — a modal built by intercepting, with no way to close it back to the list.</strong> The modal is a route now, so closing it is a navigation, not a state change: calling a local &#96;setOpen(false)&#96; hides the element while the URL still points at the photo, so the back button and a refresh both bring it straight back. The close button has to call &#96;router.back()&#96; — and the slot needs a &#96;default.tsx&#96; returning &#96;null&#96; so the modal disappears when the user navigates to a route that does not match it. Both are easy to miss because the modal looks right the first time you open it.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🪞</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Intercepting routes</span><span class="lc-sub">The convention, with the photo-modal example this lesson follows.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Modals with parallel routes</span><span class="lc-sub">The full pattern: slot, interception, default.tsx and the close handler.</span></span>
</a>

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

<h3>Chặn một route để hiện nó thành modal</h3>
<div class="lz-map">
  <div class="lz-stage">Cùng một URL, hai cách trình bày</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Quy ước là (.) (..) (...)</div><div class="lz-nsub">Giống đường dẫn tương đối, nhưng dành cho đoạn route: &#96;(.)photo&#96; chặn một đoạn anh em, &#96;(..)photo&#96; chặn ở cấp trên một bậc.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Chuyển trang mềm sẽ vẽ bản chặn</div><div class="lz-nsub">Bấm vào một ảnh thu nhỏ là ảnh hiện trong một modal đè lên trang hiện tại, và URL cập nhật thành URL của chính tấm ảnh.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Tải cứng thì vẽ route thật</div><div class="lz-nsub">Chia sẻ URL đó, hoặc tải lại nó, sẽ cho ra trang ảnh đầy đủ. Một địa chỉ, hai cách trình bày đều đúng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Nó đi cặp với một parallel route</div><div class="lz-nsub">Cái modal sống trong một khe &#96;@modal&#96; để nó vẽ được ĐÈ LÊN trang chứ không phải THAY CHO trang.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một modal dựng bằng phép chặn, mà chẳng có cách nào đóng lại về danh sách.</strong> Giờ cái modal là một route, nên đóng nó là một lần chuyển trang chứ không phải một thay đổi state: gọi một &#96;setOpen(false)&#96; cục bộ chỉ giấu phần tử đi trong khi URL vẫn trỏ vào tấm ảnh, nên nút quay lại và một lần tải lại đều lôi nó về ngay. Nút đóng phải gọi &#96;router.back()&#96; — và cái khe cần một &#96;default.tsx&#96; trả về &#96;null&#96; để modal biến mất khi người dùng chuyển sang một route không khớp nó. Cả hai đều dễ bỏ sót vì cái modal trông rất ổn ở lần mở đầu tiên.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🪞</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Chặn route</span><span class="lc-sub">Quy ước, kèm ví dụ modal-ảnh mà bài này đi theo.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Modal bằng parallel route</span><span class="lc-sub">Toàn bộ mẫu: khe, phép chặn, default.tsx và handler đóng.</span></span>
</a>

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
