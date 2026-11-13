/**
 * Next.js & React — Chương 11: Định tuyến chuyên sâu.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Thuần quy ước routing App Router — không có "output console" để chạy. Mọi cú pháp
 * ([...slug], [[...slug]], route.ts, @slot, (.)(..)) là quy ước CHÍNH THỨC nextjs.org.
 * Sự cố thật cuongthai.com (modal bình luận trên feed = intercepting route; FE proxy
 * route gọi nhầm route backend) lồng vào .note-ct/.pitfall.
 */

import G11_1 from './giang/nxj-11-1.mjs';
import G11_2 from './giang/nxj-11-2.mjs';
import G11_3 from './giang/nxj-11-3.mjs';
import G11_4 from './giang/nxj-11-4.mjs';
import G11_5 from './giang/nxj-11-5.mjs';
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
${G11_1}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>One folder that matches many path segments</h2>
<p class="lead">A <code>[slug]</code> folder (Chapter 8) matches exactly one segment: <code>/blog/hello</code>. But some routes have a variable <em>depth</em> — documentation like <code>/docs/a/b/c</code>, a file browser, category trees. For those, the catch-all segment.</p>

<h3>Catch-all: [...slug]</h3>
<pre><code class="language-typescript">app/docs/[...slug]/page.tsx

<span class="tok-comment">// matches /docs/a, /docs/a/b, /docs/a/b/c …</span>
export default async function Docs({ params }: { params: Promise&lt;{ slug: string[] }&gt; }) {
  const { slug } = await params;   <span class="tok-comment">// slug is an ARRAY: ['a','b','c']</span>
  return &lt;p&gt;{slug.join(' / ')}&lt;/p&gt;;
}</code></pre>
<div class="callout warn"><p><strong>Type <code>params</code> in a <code>.tsx</code> page.</strong> Copied as <code>({ params })</code> into a project from <code>create-next-app</code> (strict mode), this fails: <code>tsc</code> reports <code>TS7031: Binding element 'params' implicitly has an 'any' type</code> and <code>next build</code> stops with "Failed to type check" (measured, Next.js 16.4.6). The code above already carries the type: a <strong>Promise</strong> of <code>{ slug: string[] }</code> — for the optional form <code>slug?: string[]</code>. Next 16 also generates a helper: <code>PageProps&lt;'/docs/[...slug]'&gt;</code>.</p></div>
<p>Three dots before the name. The matched value is an <strong>array</strong> of the segments, not a string. One page handles any depth. Note it does <em>not</em> match <code>/docs</code> itself (zero segments) — for that you need the optional form.</p>

<h3>Optional catch-all: [[...slug]]</h3>
<pre><code class="language-typescript">app/shop/[[...slug]]/page.tsx

<span class="tok-comment">// matches /shop  AND  /shop/a  AND  /shop/a/b …</span>
export default async function Shop({ params }: { params: Promise&lt;{ slug?: string[] }&gt; }) {
  const { slug } = await params;   <span class="tok-comment">// undefined at /shop, else an array</span>
  return &lt;p&gt;{slug ? slug.join(' › ') : 'all products'}&lt;/p&gt;;
}</code></pre>
<p>Double brackets make the whole thing optional: the same page also serves the base path with <em>no</em> segments. At <code>/shop</code>, <code>slug</code> is <code>undefined</code>; at <code>/shop/a/b</code> it is <code>['a','b']</code>.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">[slug]</span><span class="v">Exactly one segment. Value is a string. Does not match the parent.</span></div>
  <div class="kv"><span class="k">[...slug]</span><span class="v">One or more segments. Value is an array. Does not match the bare parent.</span></div>
  <div class="kv"><span class="k">[[...slug]]</span><span class="v">Zero or more segments. Value is an array or undefined. Also matches the bare parent.</span></div>
</div>

<div class="callout warn">
<p><strong>More specific wins.</strong> If you have both <code>app/shop/[id]/page.tsx</code> and <code>app/shop/[[...slug]]/page.tsx</code>, a single-segment URL like <code>/shop/42</code> matches the more specific <code>[id]</code>, not the catch-all. Keep an eye on overlap when mixing dynamic forms in one folder. (Measured: <code>/shop/42</code> → <code>[id]</code> with <code>id = "42"</code>; <code>/shop</code> and <code>/shop/42/xanh</code> → the catch-all.)</p>
<p><strong>One combination is a build error:</strong> <code>app/kho/page.tsx</code> next to <code>app/kho/[[...slug]]/page.tsx</code> — both own the bare <code>/kho</code>. <code>next build</code>: <em>"You cannot define a route with the same specificity as an optional catch-all route ("/kho" and "/kho/[[...slug]]")."</em> Keep one owner: <code>[[...slug]]</code> alone, or <code>page.tsx</code> + <code>[...slug]</code>.</p>
</div>

<h3>The four dynamic segment shapes</h3>
<div class="lz-map">
  <div class="lz-stage">Brackets, and what each one matches</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">[id]</div><div class="lz-nsub">Exactly one segment. <code>/notes/12</code> matches, <code>/notes</code> and <code>/notes/12/edit</code> do not.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">[...slug]</div><div class="lz-nsub">One or more segments, as an array. <code>/docs/a/b/c</code> gives <code>[&#39;a&#39;,&#39;b&#39;,&#39;c&#39;]</code>; the bare <code>/docs</code> still does not match.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">[[...slug]]</div><div class="lz-nsub">Zero or more. Now <code>/docs</code> matches too, with <code>slug</code> undefined — one route for the index and every depth below it.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Every value is a string</div><div class="lz-nsub"><code>params.id</code> is <code>&#39;12&#39;</code>, never <code>12</code>. Convert deliberately, and check the conversion before using it in a query. In Next.js 16 the strings also arrive <b>still percent-encoded</b>: <code>/docs/xin-chào</code> gives <code>"xin-ch%C3%A0o"</code> — <code>decodeURIComponent</code> when you need the text (measured below).</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — passing a route param straight into a database query as a number.</strong> <code>where: { id: Number(params.id) }</code> on <code>/notes/abc</code> passes <code>NaN</code>, which most drivers turn into an error deep in the query layer — a stack trace about an invalid parameter rather than &quot;this URL is nonsense&quot;. The visitor gets a 500 for what should be a 404, and your error tracker fills with them, because a crawler will try every shape of URL eventually. Validate the param first: check the parse, and call <code>notFound()</code> when it fails. That is a two-line guard that turns a class of 500s into the correct response. <b>Check the string, not the number:</b> <code>Number.isInteger(Number(s))</code> also accepts <code>"0x0C"</code> (12), <code>"1e1"</code>, <code>" 12"</code> and <code>""</code> (0) — test <code>/^[1-9]\\d*$/</code> first (measured below with Prisma).</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Dynamic routes</span><span class="lc-sub">Every bracket form, with the params shape each produces.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/not-found" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — notFound()</span><span class="lc-sub">Rendering the 404 view from inside a component, and where it may be called.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Create <code>app/docs/[...slug]/page.tsx</code> and visit <code>/docs/a/b/c</code>; log <code>params.slug</code> (an array).</li>
<li>Switch to an optional catch-all <code>[[...slug]]</code> and confirm <code>/docs</code> itself now matches.</li>
<li>Explain the difference between <code>[slug]</code>, <code>[...slug]</code> and <code>[[...slug]]</code>.</li>
</ol>
<p><strong>Done when:</strong> you can build catch-all and optional catch-all routes and read their params.</p></div>

<h3>🔬 Measured: every shape, the same URLs (Next.js 16.4.6)</h3>
<p>Three pages — <code>blog/[slug]</code>, <code>docs/[...slug]</code>, <code>shop/[[...slug]]</code> — built with <code>next build</code>, run with <code>next start</code>, each URL requested with <code>curl</code> (status · text on the page), plus the server log:</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/docs/[...slug]/page.tsx — catch-all: khớp /docs/a, /docs/a/b, /docs/a/b/c …</span>
export default async function Docs({ params }: { params: Promise&lt;{ slug: string[] }&gt; }) {
  const { slug } = await params;            <span class="tok-comment">  // slug là MỘT MẢNG chuỗi</span>
  console.log('[docs] slug =', JSON.stringify(slug));
  return &lt;p&gt;{slug.join(' / ')} · {slug.length} đoạn&lt;/p&gt;;
}</code></pre>
<div class="out">/blog         404  (trang 404 của Next)
/blog/a       200  blog: "a"
/blog/a/b     404  (trang 404 của Next)
/docs         404  (trang 404 của Next)
/docs/a       200  a · 1 đoạn
/docs/a/b/c   200  a / b / c · 3 đoạn
/shop         200  trang gốc /shop (slug = undefined)
/shop/a       200  danh mục: a
/shop/a/b     200  danh mục: a › b
# server log
[docs] slug = ["a","b","c"]
[shop] slug = undefined
[shop] slug = ["a"]
[shop] slug = ["a","b"]</div>
<p>A bracket folder never matches the bare parent unless it is the optional form; <code>[slug]</code> refuses two segments; the catch-alls give arrays. Next: encoded characters, and what decoding does:</p>
<div class="out">/docs/xin-chào/bài-1 200  xin-ch%C3%A0o / b%C3%A0i-1 · 2 đoạn
/docs/a%20b            200  a%20b · 1 đoạn
/docs/a%2Fb/c          200  a%2Fb / c · 2 đoạn
/docs/12/0x0C          200  12 / 0x0C · 2 đoạn
xin-ch%C3%A0o  → decodeURIComponent → "xin-chào"
a%20b          → decodeURIComponent → "a b"
a%2Fb          → decodeURIComponent → "a/b"</div>
<p>Decoding <code>a%2Fb</code> produces <code>"a/b"</code> — a slash <i>inside</i> one segment. If you <code>join('/')</code> params into a file path, check for <code>..</code> first (cuongthai.com's own <code>uploads/[...path]</code> route does exactly that).</p>
<p><b>Precedence and the one build error.</b> <code>[id]</code> next to <code>[[...slug]]</code>, then <code>page.tsx</code> next to <code>[[...slug]]</code>:</p>
<div class="out">/shop           200  trang gốc /shop (slug = undefined)
/shop/42        200  [id] thắng · id = "42" (string)
/shop/42/xanh   200  danh mục: 42 › xanh

$ npm run build      # có CẢ app/kho/page.tsx LẪN app/kho/[[...slug]]/page.tsx
&gt; Build error occurred
Error: You cannot define a route with the same specificity as an optional catch-all route ("/kho" and "/kho/[[...slug]]").
$ npm run build      # cách sửa: page.tsx riêng + [...slug] (KHÔNG optional)
├ ○ /kho
├ ƒ /kho/[...slug]</div>
<p><b>The <code>Number(params.id)</code> trap, with Prisma 6.19.3 + SQLite.</b> The bug page, then the guarded page:</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/notes/[id]/page.tsx — BẪY: truyền thẳng param vào truy vấn dưới dạng số</span>
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

export default async function Note({ params }: { params: Promise&lt;{ id: string }&gt; }) {
  const { id } = await params;                                  <span class="tok-comment">  // luôn là CHUỖI: '12', 'abc'</span>
  const note = await db.note.findUnique({ where: { id: Number(id) } });
  return &lt;p&gt;{note ? note.title : 'không có ghi chú này'}&lt;/p&gt;;
}</code></pre>
<pre><code class="language-tsx"><span class="tok-comment">// app/notes2/[id]/page.tsx — chốt chặn hai dòng: kiểm tham số TRƯỚC, sai thì notFound()</span>
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

export default async function Note({ params }: { params: Promise&lt;{ id: string }&gt; }) {
  const { id } = await params;
  if (!/^[1-9]\\d*$/.test(id)) notFound();                       <span class="tok-comment">  // chỉ nhận số nguyên dương viết chuẩn</span>
  const note = await db.note.findUnique({ where: { id: Number(id) } });
  if (!note) notFound();
  return &lt;p&gt;{note.title}&lt;/p&gt;;
}</code></pre>
<div class="out">/notes/12      200  Ghi chú số 12
/notes/abc     500  —
/notes/99      200  không có ghi chú này
/notes/0x0C    200  Ghi chú số 12
/notes2/12     200  Ghi chú số 12
/notes2/abc    404  —
/notes2/99     404  —
/notes2/0x0C   404  —

# server log for /notes/abc
Invalid &#96;prisma.note.findUnique()&#96; invocation:
{
  where: {
+   id: Int
  }
}
Argument &#96;id&#96; is missing.
  clientVersion: '6.19.3',
  digest: '1372189925'
}</div>
<p>Three bugs in the first page: <code>abc</code> is a <b>500</b> — the browser shows only "This page couldn't load" and the digest, which matches the log line; <code>99</code> is a <b>200</b> with an apology instead of a 404; <code>0x0C</code> opens note 12 under a second URL. The guard turns all three into 404. Why a regex and not <code>Number.isInteger</code>:</p>
<div class="out">"12"    → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: true
"abc"   → Number: NaN  · isInteger: false · /^[1-9]\\d*$/: false
"0x0C"  → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: false
"1e1"   → Number: 10   · isInteger: true  · /^[1-9]\\d*$/: false
" 12"   → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: false
"12.0"  → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: false
""      → Number: 0    · isInteger: true  · /^[1-9]\\d*$/: false</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npx create-next-app@latest my-app <span class="tok-comment">  # TypeScript, App Router</span>
mkdir -p "src/app/docs/[...slug]" "src/app/shop/[[...slug]]" <span class="tok-comment">  # quote the brackets in the shell</span>
npm run build &amp;&amp; npx next start -p 3000
for u in /docs /docs/a /docs/a/b/c /shop /shop/a/b; do curl -s -o /dev/null -w "$u %{http_code}\\n" localhost:3000$u; done</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-9-2-strict-mode" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript · 9.2 — Strict mode</span><span class="lc-sub">Where TS7031 for an untyped params comes from</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 9.1 — Routes, params & links</span><span class="lc-sub">Route params in React Router — in Next.js they come from folder names</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-1-path-fs" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.1 — path & fs</span><span class="lc-sub">The path-traversal trap of joining params into a file path</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/prisma-orm/learn?lessonSlug=pr-4-1-sau-cach-doc" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Prisma ORM · 4.1 — The six ways to read</span><span class="lc-sub">findUnique — and why the id must be validated first</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dynamic segment</span><span class="v"><code>[slug]</code> matches one path part.</span></div>
  <div class="kv"><span class="k">Catch-all</span><span class="v"><code>[...slug]</code> matches one or more parts as an array.</span></div>
  <div class="kv"><span class="k">Optional catch-all</span><span class="v"><code>[[...slug]]</code> also matches the base path with no parts.</span></div>
  <div class="kv"><span class="k">params array</span><span class="v">Catch-all params arrive as an array of strings.</span></div>
  <div class="kv"><span class="k">Routing precedence</span><span class="v">More specific routes win over catch-all.</span></div>
  <div class="kv"><span class="k">Use case</span><span class="v">Docs, nested categories, arbitrary-depth paths.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>[...slug]</code> is a catch-all that matches one or more path parts as an array.</li><li><code>[[...slug]]</code> is an optional catch-all that also matches the base path.</li><li>Catch-all params arrive in <code>params</code> as an array of strings.</li><li>More specific routes take precedence over catch-alls.</li></ul>

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
<pre><code class="language-typescript">app/docs/[...slug]/page.tsx

<span class="tok-comment">// khớp /docs/a, /docs/a/b, /docs/a/b/c …</span>
export default async function Docs({ params }: { params: Promise&lt;{ slug: string[] }&gt; }) {
  const { slug } = await params;   <span class="tok-comment">// slug là một MẢNG: ['a','b','c']</span>
  return &lt;p&gt;{slug.join(' / ')}&lt;/p&gt;;
}</code></pre>
<div class="callout warn"><p><strong>Khai kiểu cho <code>params</code> trong trang <code>.tsx</code>.</strong> Chép kiểu <code>({ params })</code> vào dự án tạo bằng <code>create-next-app</code> (chế độ strict) thì hỏng: <code>tsc</code> báo <code>TS7031: Binding element 'params' implicitly has an 'any' type</code> và <code>next build</code> dừng với "Failed to type check" (đo thật, Next.js 16.4.6). Mã ở trên đã khai kiểu: một <strong>Promise</strong> của <code>{ slug: string[] }</code> — dạng optional thì <code>slug?: string[]</code>. Next 16 còn tự sinh kiểu trợ giúp <code>PageProps&lt;'/docs/[...slug]'&gt;</code>.</p></div>
<p>Ba dấu chấm trước tên. Giá trị khớp là một <strong>mảng</strong> các đoạn, không phải chuỗi. Một page lo mọi độ sâu. Để ý nó <em>không</em> khớp chính <code>/docs</code> (không đoạn nào) — cho việc đó bạn cần dạng optional.</p>

<h3>Optional catch-all: [[...slug]]</h3>
<pre><code class="language-typescript">app/shop/[[...slug]]/page.tsx

<span class="tok-comment">// khớp /shop  VÀ  /shop/a  VÀ  /shop/a/b …</span>
export default async function Shop({ params }: { params: Promise&lt;{ slug?: string[] }&gt; }) {
  const { slug } = await params;   <span class="tok-comment">// undefined ở /shop, còn lại là mảng</span>
  return &lt;p&gt;{slug ? slug.join(' › ') : 'all products'}&lt;/p&gt;;
}</code></pre>
<p>Ngoặc vuông đôi làm cả cái thành tuỳ chọn: cùng page đó cũng phục vụ đường gốc <em>không có</em> đoạn nào. Ở <code>/shop</code>, <code>slug</code> là <code>undefined</code>; ở <code>/shop/a/b</code> nó là <code>['a','b']</code>.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">[slug]</span><span class="v">Đúng một đoạn. Giá trị là chuỗi. Không khớp cha.</span></div>
  <div class="kv"><span class="k">[...slug]</span><span class="v">Một hoặc nhiều đoạn. Giá trị là mảng. Không khớp cha trần.</span></div>
  <div class="kv"><span class="k">[[...slug]]</span><span class="v">Không hoặc nhiều đoạn. Giá trị là mảng hoặc undefined. Khớp cả cha trần.</span></div>
</div>

<div class="callout warn">
<p><strong>Cụ thể hơn thì thắng.</strong> Nếu bạn có cả <code>app/shop/[id]/page.tsx</code> lẫn <code>app/shop/[[...slug]]/page.tsx</code>, một URL một đoạn như <code>/shop/42</code> khớp cái cụ thể hơn <code>[id]</code>, không phải catch-all. Để ý sự chồng lấn khi trộn nhiều dạng động trong một thư mục. (Đo thật: <code>/shop/42</code> → <code>[id]</code> với <code>id = "42"</code>; <code>/shop</code> và <code>/shop/42/xanh</code> → catch-all.)</p>
<p><strong>Có một tổ hợp làm build hỏng:</strong> <code>app/kho/page.tsx</code> cạnh <code>app/kho/[[...slug]]/page.tsx</code> — cả hai cùng nhận <code>/kho</code> trần. <code>next build</code>: <em>"You cannot define a route with the same specificity as an optional catch-all route ("/kho" and "/kho/[[...slug]]")."</em> Giữ một chủ thôi: <code>[[...slug]]</code> một mình, hoặc <code>page.tsx</code> + <code>[...slug]</code>.</p>
</div>

<h3>Bốn dạng đoạn động</h3>
<div class="lz-map">
  <div class="lz-stage">Dấu ngoặc vuông, và mỗi dạng khớp cái gì</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">[id]</div><div class="lz-nsub">Đúng một đoạn. <code>/notes/12</code> khớp, còn <code>/notes</code> và <code>/notes/12/edit</code> thì không.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">[...slug]</div><div class="lz-nsub">Một đoạn trở lên, dưới dạng mảng. <code>/docs/a/b/c</code> cho ra <code>[&#39;a&#39;,&#39;b&#39;,&#39;c&#39;]</code>; còn <code>/docs</code> trần thì vẫn không khớp.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">[[...slug]]</div><div class="lz-nsub">Không đoạn nào cũng được. Giờ <code>/docs</code> cũng khớp, với <code>slug</code> là undefined — một route cho cả trang chỉ mục lẫn mọi độ sâu bên dưới.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Mọi giá trị đều là chuỗi</div><div class="lz-nsub"><code>params.id</code> là <code>&#39;12&#39;</code>, không bao giờ là <code>12</code>. Hãy chuyển đổi có chủ đích, và kiểm kết quả chuyển đổi trước khi dùng nó trong một truy vấn. Ở Next.js 16 chuỗi còn tới nơi <b>vẫn mã hoá phần trăm</b>: <code>/docs/xin-chào</code> cho <code>"xin-ch%C3%A0o"</code> — cần chữ thật thì <code>decodeURIComponent</code> (đo ở dưới).</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — truyền thẳng một tham số route vào truy vấn cơ sở dữ liệu dưới dạng số.</strong> <code>where: { id: Number(params.id) }</code> với <code>/notes/abc</code> sẽ truyền vào <code>NaN</code>, thứ mà phần lớn driver biến thành một lỗi sâu trong tầng truy vấn — một vệt stack về tham số không hợp lệ chứ không phải câu &quot;cái URL này vô nghĩa&quot;. Khách nhận một cú 500 cho thứ lẽ ra phải là 404, và hệ theo dõi lỗi của bạn đầy những cái đó, vì sớm muộn cũng có bot thử đủ mọi hình dạng URL. Hãy kiểm tham số trước: kiểm kết quả chuyển đổi, và gọi <code>notFound()</code> khi nó hỏng. Đó là một chốt chặn hai dòng biến cả một họ lỗi 500 thành phản hồi đúng. <b>Kiểm chuỗi, đừng kiểm số:</b> <code>Number.isInteger(Number(s))</code> vẫn nhận <code>"0x0C"</code> (12), <code>"1e1"</code>, <code>" 12"</code> và <code>""</code> (0) — hãy thử <code>/^[1-9]\\d*$/</code> trước (đo với Prisma ở dưới).</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route động</span><span class="lc-sub">Mọi dạng ngoặc vuông, kèm dáng params mà từng cái sinh ra.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/not-found" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — notFound()</span><span class="lc-sub">Vẽ khung 404 từ bên trong một component, và chỗ nào được phép gọi nó.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo <code>app/docs/[...slug]/page.tsx</code> và vào <code>/docs/a/b/c</code>; log <code>params.slug</code> (một mảng).</li>
<li>Chuyển sang optional catch-all <code>[[...slug]]</code> và xác nhận chính <code>/docs</code> giờ cũng khớp.</li>
<li>Giải thích khác biệt giữa <code>[slug]</code>, <code>[...slug]</code> và <code>[[...slug]]</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dựng được route catch-all và optional catch-all và đọc param của chúng.</p></div>

<h3>🔬 Đo thật: mọi dạng, cùng các URL (Next.js 16.4.6)</h3>
<p>Ba trang — <code>blog/[slug]</code>, <code>docs/[...slug]</code>, <code>shop/[[...slug]]</code> — <code>next build</code>, chạy <code>next start</code>, gọi từng URL bằng <code>curl</code> (mã trạng thái · chữ trên trang), kèm log máy chủ:</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/docs/[...slug]/page.tsx — catch-all: khớp /docs/a, /docs/a/b, /docs/a/b/c …</span>
export default async function Docs({ params }: { params: Promise&lt;{ slug: string[] }&gt; }) {
  const { slug } = await params;            <span class="tok-comment">  // slug là MỘT MẢNG chuỗi</span>
  console.log('[docs] slug =', JSON.stringify(slug));
  return &lt;p&gt;{slug.join(' / ')} · {slug.length} đoạn&lt;/p&gt;;
}</code></pre>
<div class="out">/blog         404  (trang 404 của Next)
/blog/a       200  blog: "a"
/blog/a/b     404  (trang 404 của Next)
/docs         404  (trang 404 của Next)
/docs/a       200  a · 1 đoạn
/docs/a/b/c   200  a / b / c · 3 đoạn
/shop         200  trang gốc /shop (slug = undefined)
/shop/a       200  danh mục: a
/shop/a/b     200  danh mục: a › b
# log máy chủ
[docs] slug = ["a","b","c"]
[shop] slug = undefined
[shop] slug = ["a"]
[shop] slug = ["a","b"]</div>
<p>Thư mục ngoặc vuông không khớp trang cha trần, trừ dạng optional; <code>[slug]</code> từ chối hai đoạn; catch-all cho ra mảng. Tiếp: ký tự mã hoá, và giải mã làm gì:</p>
<div class="out">/docs/xin-chào/bài-1 200  xin-ch%C3%A0o / b%C3%A0i-1 · 2 đoạn
/docs/a%20b            200  a%20b · 1 đoạn
/docs/a%2Fb/c          200  a%2Fb / c · 2 đoạn
/docs/12/0x0C          200  12 / 0x0C · 2 đoạn
xin-ch%C3%A0o  → decodeURIComponent → "xin-chào"
a%20b          → decodeURIComponent → "a b"
a%2Fb          → decodeURIComponent → "a/b"</div>
<p>Giải mã <code>a%2Fb</code> ra <code>"a/b"</code> — một dấu gạch chéo <i>bên trong</i> một đoạn. Nếu <code>join('/')</code> params thành đường dẫn tệp, hãy kiểm <code>..</code> trước (chính route <code>uploads/[...path]</code> của cuongthai.com làm đúng việc đó).</p>
<p><b>Thứ tự ưu tiên và một lỗi build.</b> <code>[id]</code> cạnh <code>[[...slug]]</code>, rồi <code>page.tsx</code> cạnh <code>[[...slug]]</code>:</p>
<div class="out">/shop           200  trang gốc /shop (slug = undefined)
/shop/42        200  [id] thắng · id = "42" (string)
/shop/42/xanh   200  danh mục: 42 › xanh

$ npm run build      # có CẢ app/kho/page.tsx LẪN app/kho/[[...slug]]/page.tsx
&gt; Build error occurred
Error: You cannot define a route with the same specificity as an optional catch-all route ("/kho" and "/kho/[[...slug]]").
$ npm run build      # cách sửa: page.tsx riêng + [...slug] (KHÔNG optional)
├ ○ /kho
├ ƒ /kho/[...slug]</div>
<p><b>Bẫy <code>Number(params.id)</code>, với Prisma 6.19.3 + SQLite.</b> Trang có lỗi, rồi trang có chốt chặn:</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/notes/[id]/page.tsx — BẪY: truyền thẳng param vào truy vấn dưới dạng số</span>
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

export default async function Note({ params }: { params: Promise&lt;{ id: string }&gt; }) {
  const { id } = await params;                                  <span class="tok-comment">  // luôn là CHUỖI: '12', 'abc'</span>
  const note = await db.note.findUnique({ where: { id: Number(id) } });
  return &lt;p&gt;{note ? note.title : 'không có ghi chú này'}&lt;/p&gt;;
}</code></pre>
<pre><code class="language-tsx"><span class="tok-comment">// app/notes2/[id]/page.tsx — chốt chặn hai dòng: kiểm tham số TRƯỚC, sai thì notFound()</span>
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

export default async function Note({ params }: { params: Promise&lt;{ id: string }&gt; }) {
  const { id } = await params;
  if (!/^[1-9]\\d*$/.test(id)) notFound();                       <span class="tok-comment">  // chỉ nhận số nguyên dương viết chuẩn</span>
  const note = await db.note.findUnique({ where: { id: Number(id) } });
  if (!note) notFound();
  return &lt;p&gt;{note.title}&lt;/p&gt;;
}</code></pre>
<div class="out">/notes/12      200  Ghi chú số 12
/notes/abc     500  —
/notes/99      200  không có ghi chú này
/notes/0x0C    200  Ghi chú số 12
/notes2/12     200  Ghi chú số 12
/notes2/abc    404  —
/notes2/99     404  —
/notes2/0x0C   404  —

# log máy chủ khi gọi /notes/abc
Invalid &#96;prisma.note.findUnique()&#96; invocation:
{
  where: {
+   id: Int
  }
}
Argument &#96;id&#96; is missing.
  clientVersion: '6.19.3',
  digest: '1372189925'
}</div>
<p>Trang đầu có ba lỗi: <code>abc</code> ra <b>500</b> — trình duyệt chỉ hiện "This page couldn't load" và mã digest, khớp dòng log; <code>99</code> ra <b>200</b> kèm câu xin lỗi thay vì 404; <code>0x0C</code> mở ghi chú 12 dưới một URL thứ hai. Chốt chặn biến cả ba thành 404. Vì sao dùng regex chứ không <code>Number.isInteger</code>:</p>
<div class="out">"12"    → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: true
"abc"   → Number: NaN  · isInteger: false · /^[1-9]\\d*$/: false
"0x0C"  → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: false
"1e1"   → Number: 10   · isInteger: true  · /^[1-9]\\d*$/: false
" 12"   → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: false
"12.0"  → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: false
""      → Number: 0    · isInteger: true  · /^[1-9]\\d*$/: false</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npx create-next-app@latest my-app <span class="tok-comment">  # TypeScript, App Router</span>
mkdir -p "src/app/docs/[...slug]" "src/app/shop/[[...slug]]" <span class="tok-comment">  # nhớ đặt ngoặc vuông trong dấu nháy</span>
npm run build &amp;&amp; npx next start -p 3000
for u in /docs /docs/a /docs/a/b/c /shop /shop/a/b; do curl -s -o /dev/null -w "$u %{http_code}\\n" localhost:3000$u; done</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-9-2-strict-mode" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript · 9.2 — Chế độ strict</span><span class="lc-sub">Gốc của lỗi TS7031 khi params không có kiểu</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 9.1 — Route, tham số & link</span><span class="lc-sub">Tham số route với React Router — ở Next.js nó đến từ tên thư mục</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-1-path-fs" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.1 — path & fs</span><span class="lc-sub">Bẫy ghép đường dẫn tệp từ tham số (catch-all + join)</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/prisma-orm/learn?lessonSlug=pr-4-1-sau-cach-doc" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Prisma ORM · 4.1 — Sáu cách để đọc</span><span class="lc-sub">findUnique — và vì sao id phải được kiểm trước</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đoạn động</span><span class="v"><code>[slug]</code> khớp một phần đường dẫn.</span></div>
  <div class="kv"><span class="k">Catch-all</span><span class="v"><code>[...slug]</code> khớp một hoặc nhiều phần thành một mảng.</span></div>
  <div class="kv"><span class="k">Optional catch-all</span><span class="v"><code>[[...slug]]</code> còn khớp cả path gốc không có phần nào.</span></div>
  <div class="kv"><span class="k">Mảng params</span><span class="v">Param catch-all đến dưới dạng một mảng chuỗi.</span></div>
  <div class="kv"><span class="k">Thứ tự ưu tiên route</span><span class="v">Route cụ thể hơn thắng catch-all.</span></div>
  <div class="kv"><span class="k">Trường hợp dùng</span><span class="v">Tài liệu, danh mục lồng, đường dẫn độ sâu bất kỳ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>[...slug]</code> là catch-all khớp một hoặc nhiều phần đường dẫn thành một mảng.</li><li><code>[[...slug]]</code> là optional catch-all còn khớp cả path gốc.</li><li>Param catch-all đến trong <code>params</code> dưới dạng một mảng chuỗi.</li><li>Route cụ thể hơn được ưu tiên hơn catch-all.</li></ul>

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
${G11_2}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Dynamic does not have to mean rendered-on-every-request</h2>
<p class="lead">A <code>[slug]</code> route is dynamic, but if you know the set of values ahead of time — every blog post, every course — Next.js can render each one to static HTML at build. You supply the list with <code>generateStaticParams</code>.</p>

<pre><code class="language-typescript"><span class="tok-comment">// app/courses/[slug]/page.tsx</span>
export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map(c =&gt; ({ slug: c.slug }));   <span class="tok-comment">// [{slug:'nextjs'}, {slug:'nodejs'}…]</span>
}

export default async function CoursePage({ params }: { params: Promise&lt;{ slug: string }&gt; }) {
  const { slug } = await params;
  return &lt;h1&gt;Course: {slug}&lt;/h1&gt;;   <span class="tok-comment">// fetch the course by slug here</span>
}</code></pre>
<p>At build time, Next.js calls <code>generateStaticParams</code>, then renders <code>/courses/nextjs</code>, <code>/courses/nodejs</code>, and so on — each as a static page. Visitors get instant, cached HTML with no per-request work.</p>

<h3>What about a slug that wasn't in the list?</h3>
<p>A new course added after the build isn't pre-rendered. The <code>dynamicParams</code> setting decides what happens:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">dynamicParams = true (default)</span><span class="v">Unknown slugs are rendered on demand the first time and then cached (measured: <code>MISS</code>, one data call, then <code>HIT</code>). Your list is a head start, not a whitelist.</span></div>
  <div class="kv"><span class="k">dynamicParams = false</span><span class="v">Unknown slugs return 404. Use when the set is truly fixed and anything else should not exist.</span></div>
</div>

<div class="callout warn"><p><strong>The 404 is cached too (measured, Next.js 16.4.6).</strong> With the default <code>dynamicParams = true</code>, a slug that does not exist renders, <code>notFound()</code> runs — and that 404 is stored: the second request is <code>404 · x-nextjs-cache: HIT</code>. Add that course to the database afterwards and the page <b>still</b> answers 404 · HIT, until the next build. When your code creates content, also call <code>revalidatePath('/courses/' + slug)</code> (Lesson 10.3), or give the route a <code>revalidate</code> time.</p></div>
<div class="callout ok">
<p><strong>How to think about it:</strong> <code>generateStaticParams</code> is "build these pages ahead of time." Combined with <code>revalidate</code> (Chapter 10) you get pages that are static and fast, yet refresh on a schedule — the sweet spot for content that is mostly stable but occasionally edited, like courses or docs.</p>
</div>

<h3>Pre-rendering a dynamic route at build time</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Return the list of params to build</b> — <code>generateStaticParams</code> runs at build and returns <code>[{ slug: &#39;a&#39; }, { slug: &#39;b&#39; }]</code>. Next renders one HTML file per entry.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Those pages are then static</b> — Served from a file or a CDN. No database call per visit, and the build output marks them with <code>●</code>.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Unlisted params still work by default</b> — They render on demand the first time and are cached afterwards — <b>a 404 included</b>. Set <code>dynamicParams = false</code> to 404 them instead, without rendering.</div></div>
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


<h3>🔬 Measured: build, visit, unknown slugs, and the cost (Next.js 16.4.6)</h3>
<p>The lesson's page, typed, reading a fake API that logs every request with milliseconds (so we can see <i>when</i> each fetch runs):</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/courses/[slug]/page.tsx — dựng sẵn mọi khoá đã biết lúc build</span>
import { notFound } from 'next/navigation';

type Course = { slug: string; ten: string; luc?: string };
const API = 'http://127.0.0.1:19391';

async function getAllCourses(): Promise&lt;Course[]&gt; {
  return (await fetch(&#96;\${API}/courses&#96;)).json();
}
async function getCourse(slug: string): Promise&lt;Course | null&gt; {
  const r = await fetch(&#96;\${API}/courses/\${slug}&#96;);
  return r.ok ? r.json() : null;
}

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((c) =&gt; ({ slug: c.slug })); <span class="tok-comment">  // [{slug:'nextjs'}, {slug:'nodejs'}…]</span>
}

export default async function CoursePage({ params }: { params: Promise&lt;{ slug: string }&gt; }) {
  const { slug } = await params;
  const c = await getCourse(slug);
  if (!c) notFound();
  return &lt;p&gt;{c.ten} · API trả lúc {c.luc}&lt;/p&gt;;
}</code></pre>
<div class="out">$ npm run build
└   /courses/[slug]
  ├ ● /courses/nextjs
  ├ ● /courses/nodejs
  └ ● /courses/react
●  (SSG)     prerendered as static HTML (uses generateStaticParams)

# fake API log, during the build:
[api] 00:44:35.598 GET /courses
[api] 00:44:35.908 GET /courses/nextjs
[api] 00:44:35.909 GET /courses/nodejs
[api] 00:44:35.909 GET /courses/react</div>
<p>One list call and three detail calls, all <b>during the build</b>; each course became an <code>.html</code> + <code>.rsc</code> file under <code>.next/server/app/courses/</code>. Visitors then get that HTML — the page still shows the API time of the build, and the API sees nothing:</p>
<div class="out">/courses/nextjs · HIT · Next.js · API trả lúc 00:44:35.908  · 0.021910 s
/courses/nodejs · HIT · Node.js · API trả lúc 00:44:35.909  · 0.005792 s
/courses/nextjs · HIT · Next.js · API trả lúc 00:44:35.908  · 0.002548 s
# fake API log while visitors hit the pages: (nothing)</div>
<p><b>After the build</b>, the source gains <code>rust</code>; then <code>khong-co</code>, a slug that does not exist, is requested twice — and afterwards added to the source:</p>
<div class="out">/courses/rust · 200 · 0.051367 s · MISS · Rust · API trả lúc 00:44:42.976
/courses/rust · 200 · 0.002271 s · HIT · Rust · API trả lúc 00:44:42.976
/courses/khong-co · 404 · 0.016105 s · MISS · (404)
/courses/khong-co · 404 · 0.002701 s · HIT · (404)
/courses/khong-co · 404 · HIT
/courses/khong-co · 404 · HIT
# fake API log:
[api] 00:44:42.976 GET /courses/rust
[api] 00:44:45.091 GET /courses/khong-co</div>
<p><code>dynamicParams = false</code> on a copy of the page (<code>/khoa/[slug]</code>), with a course <code>go</code> added after the build:</p>
<div class="out">/courses/nextjs · 200
/courses/go · 200
/khoa/nextjs · 200
/khoa/go · 404
# fake API log — one call only:
[api] 00:45:05.044 GET /courses/go</div>
<p><b>The growing-table trap, priced on this machine</b> — the same page, <code>generateStaticParams</code> returning N rows (and with each detail read taking 20 ms):</p>
<div class="out">N = 0     · đọc  0 ms/khoá ·    12 trang tĩnh · build   2.1 s
N = 100   · đọc  0 ms/khoá ·   112 trang tĩnh · build   2.8 s
N = 1000  · đọc  0 ms/khoá ·  1012 trang tĩnh · build   3.9 s
N = 3000  · đọc  0 ms/khoá ·  3012 trang tĩnh · build   7.6 s
N = 1000  · đọc 20 ms/khoá ·  1012 trang tĩnh · build   6.7 s
N = 3000  · đọc 20 ms/khoá ·  3012 trang tĩnh · build   7.4 s
.next/server/app/nhieu: 106M</div>
<p>Pages grow one-for-one with the table, and so do the build time and the size of <code>.next</code>. Here each read is cheap and runs in parallel; a slower database or a heavier page multiplies it, silently, as the data grows. Build the pages that matter and let the long tail render on demand:</p>
<pre><code class="language-tsx"><span class="tok-comment">// sửa: chỉ dựng sẵn 100 trang hay xem nhất, phần đuôi render khi có người gọi (rồi được lưu)</span>
export async function generateStaticParams() {
  const top: Course[] = await (await fetch(&#96;\${API}/courses?n=100&#96;)).json();
  return top.map((c) =&gt; ({ slug: c.slug }));
}</code></pre>
<h3>🔁 Run it yourself</h3>
<p>The fake API (save as <code>api11.mjs</code>, run <code>node api11.mjs 19391</code>):</p>
<pre><code class="language-javascript"><span class="tok-comment">// api11.mjs — API giả Chương 11 (node api11.mjs 19391). Mỗi request in MỘT dòng log có mili-giây.</span>
<span class="tok-comment">// GET /courses?n=&lt;số&gt; (mặc định 3 khoá thật) · GET /courses/&lt;slug&gt;[?ms=&lt;độ trễ&gt;] · POST /courses?slug=&lt;x&gt;&amp;ten=&lt;y&gt; (thêm khoá SAU khi build) · GET /dem · POST /dat-lai</span>
import http from 'node:http';
const PORT = Number(process.argv[2] ?? 19391);
const KHOA = [{ slug: 'nextjs', ten: 'Next.js' }, { slug: 'nodejs', ten: 'Node.js' }, { slug: 'react', ten: 'React' }];
let dem = {};
const gio = () =&gt; new Date().toTimeString().slice(0, 8) + '.' + String(Date.now() % 1000).padStart(3, '0');
const ds = (n) =&gt; (n ? Array.from({ length: n }, (_, i) =&gt; ({ slug: &#96;khoa-\${i + 1}&#96;, ten: &#96;Khoá \${i + 1}&#96; })) : KHOA);
http.createServer(async (req, res) =&gt; {
  const u = new URL(req.url, 'http://x'), p = u.pathname;
  const tra = (o, ma = 200) =&gt; { res.writeHead(ma, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };
  if (p === '/dem') return tra(dem);
  if (p === '/dat-lai') { dem = {}; return tra({ ok: true }); }
  dem[p] = (dem[p] ?? 0) + 1;
  const ms = Number(u.searchParams.get('ms') ?? 0);
  if (ms) await new Promise((r) =&gt; setTimeout(r, ms));        <span class="tok-comment">  // ?ms= giả lập một truy vấn CSDL chậm</span>
  const n = Number(u.searchParams.get('n') ?? 0);
  if (n === 0 || dem[p] &lt;= 3) console.log(&#96;[api] \${gio()} \${req.method} \${req.url}&#96;);
  if (req.method === 'POST' &amp;&amp; p === '/courses') { KHOA.push({ slug: u.searchParams.get('slug'), ten: u.searchParams.get('ten') }); return tra({ them: u.searchParams.get('slug') }); }
  if (p === '/courses') return tra(ds(n));
  const m = /^\\/courses\\/([^/]+)$/.exec(p);
  if (m) { const k = KHOA.find((x) =&gt; x.slug === m[1]) ?? (/^khoa-\\d+$/.test(m[1]) ? { slug: m[1], ten: m[1] } : null); return k ? tra({ ...k, luc: gio() }) : tra({ loi: 'không có' }, 404); }
  tra({ loi: 'không có' }, 404);
}).listen(PORT, '127.0.0.1', () =&gt; console.log(&#96;[api] nghe ở http://127.0.0.1:\${PORT}&#96;));</code></pre>
<pre><code class="language-bash">npm run build    <span class="tok-comment">  # ● list + the API log: which calls happen during the build?</span>
npx next start -p 3000
curl -s -D - -o /dev/null localhost:3000/courses/nextjs | grep -i x-nextjs-cache
curl -s -XPOST '127.0.0.1:19391/courses?slug=rust&amp;ten=Rust' <span class="tok-comment">  # add after the build</span>
curl -s -o /dev/null -w "%{http_code}\\n" localhost:3000/courses/rust</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-4-sang-nextjs" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.4 — From React Router to Next.js</span><span class="lc-sub">next build pre-renders six doctor pages — SSG in a real project</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/github-actions/learn?lessonSlug=ga-7-1-duong-toi-han" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">GitHub Actions · 7.1 — The critical path</span><span class="lc-sub">CI time: where a bloated build hurts</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-2-cai-gi-duoc-cache" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Nginx · 5.2 — What gets cached</span><span class="lc-sub">Caching what should not be cached — a cousin of the cached 404</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">generateStaticParams</span><span class="v">Returns the list of dynamic params to pre-render at build.</span></div>
  <div class="kv"><span class="k">Pre-render</span><span class="v">Build HTML ahead of time for known routes (SSG).</span></div>
  <div class="kv"><span class="k">Dynamic route</span><span class="v">A route with a <code>[param]</code> segment.</span></div>
  <div class="kv"><span class="k">Build-time data</span><span class="v">Fetch the id/slug list during the build.</span></div>
  <div class="kv"><span class="k">dynamicParams</span><span class="v">Controls whether unknown params render on demand or 404.</span></div>
  <div class="kv"><span class="k">SSG</span><span class="v">Static Site Generation of each known param.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>generateStaticParams</code> lists the dynamic params to pre-render at build time.</li><li>It turns a dynamic route into statically generated pages for known ids/slugs.</li><li><code>dynamicParams</code> decides whether an unknown param renders on demand or 404s.</li><li>Use it for content with a known set of pages, like blog posts or products.</li></ul>

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

<pre><code class="language-typescript"><span class="tok-comment">// app/courses/[slug]/page.tsx</span>
export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map(c =&gt; ({ slug: c.slug }));   <span class="tok-comment">// [{slug:'nextjs'}, {slug:'nodejs'}…]</span>
}

export default async function CoursePage({ params }: { params: Promise&lt;{ slug: string }&gt; }) {
  const { slug } = await params;
  return &lt;h1&gt;Khoá học: {slug}&lt;/h1&gt;;   <span class="tok-comment">// lấy khoá học theo slug ở đây</span>
}</code></pre>
<p>Lúc build, Next.js gọi <code>generateStaticParams</code>, rồi render <code>/courses/nextjs</code>, <code>/courses/nodejs</code>, v.v. — mỗi cái là một trang tĩnh. Khách nhận HTML tức thì đã cache, không phải làm gì theo từng request.</p>

<h3>Còn một slug không có trong danh sách thì sao?</h3>
<p>Một khoá học thêm sau khi build thì chưa được dựng sẵn. Thiết lập <code>dynamicParams</code> quyết điều gì xảy ra:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">dynamicParams = true (mặc định)</span><span class="v">Slug lạ được render theo yêu cầu ở lần đầu rồi được cache (đo thật: <code>MISS</code>, một lượt gọi dữ liệu, rồi <code>HIT</code>). Danh sách của bạn là cú xuất phát trước, không phải danh sách trắng.</span></div>
  <div class="kv"><span class="k">dynamicParams = false</span><span class="v">Slug lạ trả 404. Dùng khi tập là cố định thật và mọi thứ khác không nên tồn tại.</span></div>
</div>

<div class="callout warn"><p><strong>Trang 404 cũng được cache (đo thật, Next.js 16.4.6).</strong> Với mặc định <code>dynamicParams = true</code>, một slug không tồn tại vẫn được render, <code>notFound()</code> chạy — và trang 404 đó được lưu: request thứ hai là <code>404 · x-nextjs-cache: HIT</code>. Thêm đúng khoá học đó vào cơ sở dữ liệu sau đó, trang <b>vẫn</b> trả 404 · HIT, cho tới lần build sau. Đoạn mã nào tạo nội dung thì gọi luôn <code>revalidatePath('/courses/' + slug)</code> (bài 10.3), hoặc cho route một thời hạn <code>revalidate</code>.</p></div>
<div class="callout ok">
<p><strong>Cách nghĩ:</strong> <code>generateStaticParams</code> là "dựng sẵn các trang này trước". Ghép với <code>revalidate</code> (Chương 10) bạn có trang vừa tĩnh vừa nhanh, mà vẫn làm mới theo lịch — điểm ngọt cho nội dung phần lớn ổn định nhưng thỉnh thoảng sửa, như khoá học hay tài liệu.</p>
</div>

<h3>Dựng sẵn một route động lúc build</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Trả về danh sách params cần dựng</b> — <code>generateStaticParams</code> chạy lúc build và trả về <code>[{ slug: &#39;a&#39; }, { slug: &#39;b&#39; }]</code>. Next vẽ ra một file HTML cho mỗi mục.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Những trang đó từ đó là tĩnh</b> — Phục vụ từ một file hoặc một CDN. Không gọi cơ sở dữ liệu ở mỗi lượt ghé, và đầu ra của build đánh dấu chúng bằng <code>●</code>.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Params không có trong danh sách vẫn chạy được, mặc định</b> — Chúng được vẽ theo yêu cầu ở lần đầu rồi được nhớ đệm — <b>kể cả trang 404</b>. Đặt <code>dynamicParams = false</code> nếu bạn muốn chúng thành 404 mà không render gì.</div></div>
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


<h3>🔬 Đo thật: build, lượt xem, slug lạ, và cái giá (Next.js 16.4.6)</h3>
<p>Trang của bài, có kiểu, đọc một API giả in log từng request có mili giây (để thấy mỗi fetch chạy <i>lúc nào</i>):</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/courses/[slug]/page.tsx — dựng sẵn mọi khoá đã biết lúc build</span>
import { notFound } from 'next/navigation';

type Course = { slug: string; ten: string; luc?: string };
const API = 'http://127.0.0.1:19391';

async function getAllCourses(): Promise&lt;Course[]&gt; {
  return (await fetch(&#96;\${API}/courses&#96;)).json();
}
async function getCourse(slug: string): Promise&lt;Course | null&gt; {
  const r = await fetch(&#96;\${API}/courses/\${slug}&#96;);
  return r.ok ? r.json() : null;
}

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((c) =&gt; ({ slug: c.slug })); <span class="tok-comment">  // [{slug:'nextjs'}, {slug:'nodejs'}…]</span>
}

export default async function CoursePage({ params }: { params: Promise&lt;{ slug: string }&gt; }) {
  const { slug } = await params;
  const c = await getCourse(slug);
  if (!c) notFound();
  return &lt;p&gt;{c.ten} · API trả lúc {c.luc}&lt;/p&gt;;
}</code></pre>
<div class="out">$ npm run build
└   /courses/[slug]
  ├ ● /courses/nextjs
  ├ ● /courses/nodejs
  └ ● /courses/react
●  (SSG)     prerendered as static HTML (uses generateStaticParams)

# log API giả, trong lúc build:
[api] 00:44:35.598 GET /courses
[api] 00:44:35.908 GET /courses/nextjs
[api] 00:44:35.909 GET /courses/nodejs
[api] 00:44:35.909 GET /courses/react</div>
<p>Một lượt lấy danh sách và ba lượt lấy chi tiết, tất cả <b>trong lúc build</b>; mỗi khoá thành một tệp <code>.html</code> + <code>.rsc</code> trong <code>.next/server/app/courses/</code>. Sau đó người xem nhận đúng HTML đó — trang vẫn ghi giờ API của lần build, và API không nhận gì:</p>
<div class="out">/courses/nextjs · HIT · Next.js · API trả lúc 00:44:35.908  · 0.021910 s
/courses/nodejs · HIT · Node.js · API trả lúc 00:44:35.909  · 0.005792 s
/courses/nextjs · HIT · Next.js · API trả lúc 00:44:35.908  · 0.002548 s
# log API giả khi người xem gọi: (trống)</div>
<p><b>Sau khi build</b>, nguồn dữ liệu có thêm <code>rust</code>; rồi <code>khong-co</code>, một slug không tồn tại, bị gọi hai lần — và sau đó được thêm vào nguồn:</p>
<div class="out">/courses/rust · 200 · 0.051367 s · MISS · Rust · API trả lúc 00:44:42.976
/courses/rust · 200 · 0.002271 s · HIT · Rust · API trả lúc 00:44:42.976
/courses/khong-co · 404 · 0.016105 s · MISS · (404)
/courses/khong-co · 404 · 0.002701 s · HIT · (404)
/courses/khong-co · 404 · HIT
/courses/khong-co · 404 · HIT
# log API giả:
[api] 00:44:42.976 GET /courses/rust
[api] 00:44:45.091 GET /courses/khong-co</div>
<p><code>dynamicParams = false</code> trên một bản sao của trang (<code>/khoa/[slug]</code>), với khoá <code>go</code> thêm sau build:</p>
<div class="out">/courses/nextjs · 200
/courses/go · 200
/khoa/nextjs · 200
/khoa/go · 404
# log API giả — chỉ một lượt:
[api] 00:45:05.044 GET /courses/go</div>
<p><b>Bẫy bảng lớn dần, có giá trên máy của khoá</b> — cùng một trang, <code>generateStaticParams</code> trả về N hàng (và khi mỗi lần đọc chi tiết mất 20 ms):</p>
<div class="out">N = 0     · đọc  0 ms/khoá ·    12 trang tĩnh · build   2.1 s
N = 100   · đọc  0 ms/khoá ·   112 trang tĩnh · build   2.8 s
N = 1000  · đọc  0 ms/khoá ·  1012 trang tĩnh · build   3.9 s
N = 3000  · đọc  0 ms/khoá ·  3012 trang tĩnh · build   7.6 s
N = 1000  · đọc 20 ms/khoá ·  1012 trang tĩnh · build   6.7 s
N = 3000  · đọc 20 ms/khoá ·  3012 trang tĩnh · build   7.4 s
.next/server/app/nhieu: 106M</div>
<p>Số trang tăng đúng bằng số hàng, thời gian build và dung lượng <code>.next</code> tăng theo. Ở đây mỗi lần đọc rẻ và chạy song song; cơ sở dữ liệu chậm hơn hay trang nặng hơn sẽ nhân con số lên, lặng lẽ, theo dữ liệu. Hãy dựng sẵn những trang quan trọng và để phần đuôi dài render theo yêu cầu:</p>
<pre><code class="language-tsx"><span class="tok-comment">// sửa: chỉ dựng sẵn 100 trang hay xem nhất, phần đuôi render khi có người gọi (rồi được lưu)</span>
export async function generateStaticParams() {
  const top: Course[] = await (await fetch(&#96;\${API}/courses?n=100&#96;)).json();
  return top.map((c) =&gt; ({ slug: c.slug }));
}</code></pre>
<h3>🔁 Tự chạy lại</h3>
<p>API giả (lưu thành <code>api11.mjs</code>, chạy <code>node api11.mjs 19391</code>):</p>
<pre><code class="language-javascript"><span class="tok-comment">// api11.mjs — API giả Chương 11 (node api11.mjs 19391). Mỗi request in MỘT dòng log có mili-giây.</span>
<span class="tok-comment">// GET /courses?n=&lt;số&gt; (mặc định 3 khoá thật) · GET /courses/&lt;slug&gt;[?ms=&lt;độ trễ&gt;] · POST /courses?slug=&lt;x&gt;&amp;ten=&lt;y&gt; (thêm khoá SAU khi build) · GET /dem · POST /dat-lai</span>
import http from 'node:http';
const PORT = Number(process.argv[2] ?? 19391);
const KHOA = [{ slug: 'nextjs', ten: 'Next.js' }, { slug: 'nodejs', ten: 'Node.js' }, { slug: 'react', ten: 'React' }];
let dem = {};
const gio = () =&gt; new Date().toTimeString().slice(0, 8) + '.' + String(Date.now() % 1000).padStart(3, '0');
const ds = (n) =&gt; (n ? Array.from({ length: n }, (_, i) =&gt; ({ slug: &#96;khoa-\${i + 1}&#96;, ten: &#96;Khoá \${i + 1}&#96; })) : KHOA);
http.createServer(async (req, res) =&gt; {
  const u = new URL(req.url, 'http://x'), p = u.pathname;
  const tra = (o, ma = 200) =&gt; { res.writeHead(ma, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };
  if (p === '/dem') return tra(dem);
  if (p === '/dat-lai') { dem = {}; return tra({ ok: true }); }
  dem[p] = (dem[p] ?? 0) + 1;
  const ms = Number(u.searchParams.get('ms') ?? 0);
  if (ms) await new Promise((r) =&gt; setTimeout(r, ms));        <span class="tok-comment">  // ?ms= giả lập một truy vấn CSDL chậm</span>
  const n = Number(u.searchParams.get('n') ?? 0);
  if (n === 0 || dem[p] &lt;= 3) console.log(&#96;[api] \${gio()} \${req.method} \${req.url}&#96;);
  if (req.method === 'POST' &amp;&amp; p === '/courses') { KHOA.push({ slug: u.searchParams.get('slug'), ten: u.searchParams.get('ten') }); return tra({ them: u.searchParams.get('slug') }); }
  if (p === '/courses') return tra(ds(n));
  const m = /^\\/courses\\/([^/]+)$/.exec(p);
  if (m) { const k = KHOA.find((x) =&gt; x.slug === m[1]) ?? (/^khoa-\\d+$/.test(m[1]) ? { slug: m[1], ten: m[1] } : null); return k ? tra({ ...k, luc: gio() }) : tra({ loi: 'không có' }, 404); }
  tra({ loi: 'không có' }, 404);
}).listen(PORT, '127.0.0.1', () =&gt; console.log(&#96;[api] nghe ở http://127.0.0.1:\${PORT}&#96;));</code></pre>
<pre><code class="language-bash">npm run build    <span class="tok-comment">  # danh sách ● + log API: lượt nào xảy ra trong lúc build?</span>
npx next start -p 3000
curl -s -D - -o /dev/null localhost:3000/courses/nextjs | grep -i x-nextjs-cache
curl -s -XPOST '127.0.0.1:19391/courses?slug=rust&amp;ten=Rust' <span class="tok-comment">  # thêm sau build</span>
curl -s -o /dev/null -w "%{http_code}\\n" localhost:3000/courses/rust</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-4-sang-nextjs" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.4 — Từ React Router sang Next.js</span><span class="lc-sub">next build dựng sẵn sáu trang bác sĩ — SSG trong một dự án thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/github-actions/learn?lessonSlug=ga-7-1-duong-toi-han" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">GitHub Actions · 7.1 — Đường tới hạn</span><span class="lc-sub">Thời gian CI: nơi một bản build phình to sẽ đau</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-2-cai-gi-duoc-cache" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Nginx · 5.2 — Cái gì được cache</span><span class="lc-sub">Lưu nhầm thứ không nên lưu — cùng họ với trang 404 bị cache</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">generateStaticParams</span><span class="v">Trả về danh sách param động để pre-render lúc build.</span></div>
  <div class="kv"><span class="k">Pre-render</span><span class="v">Dựng HTML trước cho các route đã biết (SSG).</span></div>
  <div class="kv"><span class="k">Route động</span><span class="v">Một route có đoạn <code>[param]</code>.</span></div>
  <div class="kv"><span class="k">Dữ liệu lúc build</span><span class="v">Fetch danh sách id/slug trong lúc build.</span></div>
  <div class="kv"><span class="k">dynamicParams</span><span class="v">Quyết định param lạ render theo yêu cầu hay trả 404.</span></div>
  <div class="kv"><span class="k">SSG</span><span class="v">Static Site Generation cho mỗi param đã biết.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>generateStaticParams</code> liệt kê các param động để pre-render lúc build.</li><li>Nó biến một route động thành các trang tạo tĩnh cho id/slug đã biết.</li><li><code>dynamicParams</code> quyết định param lạ render theo yêu cầu hay trả 404.</li><li>Dùng nó cho nội dung có tập trang đã biết, như bài blog hay sản phẩm.</li></ul>

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
${G11_3}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>A folder can be an API endpoint instead of a page</h2>
<p class="lead">Chapter 8 mentioned <code>route.ts</code> as the sibling of <code>page.tsx</code>. Where a page returns UI, a Route Handler returns <em>data</em>. You export functions named after HTTP methods; each receives a <code>Request</code> and returns a <code>Response</code>.</p>

<pre><code class="language-typescript"><span class="tok-comment">// app/api/health/route.ts  →  GET /api/health</span>
export async function GET() {
  return Response.json({ ok: true });
}

<span class="tok-comment">// app/api/posts/route.ts  →  POST /api/posts</span>
export async function POST(request: Request) {   <span class="tok-comment">// db: your Prisma client (e.g. lib/db.ts)</span>
  const body = await request.json();
  const post = await db.post.create({ data: { title: body.title } });   <span class="tok-comment">// pick fields — never { data: body }</span>
  return Response.json(post, { status: 201 });
}</code></pre>
<p>The folder path is the URL, exactly like pages. A folder can have a <code>page.tsx</code> <em>or</em> a <code>route.ts</code>, not both — one serves HTML, the other serves a response (both ⇒ <code>next build</code>: <em>"Conflicting route and page at /x"</em>, measured below).</p>
<div class="callout warn"><p><strong>Copied as written into a <code>.ts</code> file</strong>, the <code>POST</code> above fails <code>tsc</code> twice: <code>TS7006 Parameter 'request' implicitly has an 'any' type</code> and <code>TS2304 Cannot find name 'db'</code> (measured). Type the parameter as <code>Request</code>, import your database client — and never pass the whole body to <code>create</code>: the caller would choose the columns, including the id (measured below).</p></div>

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
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Yes for non-HTML responses</b> — An image, a PDF, a CSV export, an RSS feed. Return a <code>Response</code> with the right <code>Content-Type</code>.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Export by method name</b> — <code>export async function GET(req)</code>, <code>POST</code>, <code>DELETE</code>. A method with no export returns 405 automatically; <code>HEAD</code> and <code>OPTIONS</code> are answered for you (measured: 200, and 204 with <code>Allow: GET, HEAD, OPTIONS</code>).</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a route handler that is cached when you meant it to be live.</strong> <b>On Next.js 14 and earlier</b>, a <code>GET</code> handler with no dynamic input is statically evaluated at build time, so it runs once and every visitor gets the same body forever — a &quot;random quote&quot; endpoint that returns the same quote for a week, or a health check that reports the state of the build machine. On 14 it is the default and completely invisible: the response is a 200 with plausible content. Reading <code>request</code>, <code>cookies()</code> or <code>headers()</code> opts it into dynamic automatically; otherwise say so explicitly with <code>export const dynamic = &#39;force-dynamic&#39;</code>. <b>Since Next.js 15 the default is reversed</b> (measured below on 16.4.6 vs 14.2.35): a bare <code>GET</code> is dynamic (ƒ) and runs on every call; caching is opt-in with <code>export const dynamic = &#39;force-static&#39;</code>. State the intent either way, so an upgrade cannot change it silently.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers" target="_blank" rel="noopener">
  <span class="lc-ico">🛣️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route handlers</span><span class="lc-sub">Methods, Request/Response, streaming, and the caching rules.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/Response" target="_blank" rel="noopener">
  <span class="lc-ico">📨</span>
  <span class="lc-body"><span class="lc-title">MDN — Response</span><span class="lc-sub">The web-standard object route handlers return, with every constructor option.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Create <code>app/api/health/route.ts</code> exporting a <code>GET</code> that returns JSON; hit it with <code>curl</code>.</li>
<li>Add a <code>POST</code> handler that reads the request body and echoes it back.</li>
<li>Explain when you need a Route Handler vs a Server Action (public API/webhooks vs form mutations).</li>
</ol>
<p><strong>Done when:</strong> you can build a GET/POST Route Handler and know when to use it over a Server Action.</p></div>

<h3>🔬 Measured: methods, caching in 16 vs 14, the body, the proxy</h3>
<p>The lesson's two handlers copied into <code>route.ts</code> files, then fixed (typed, with a real Prisma client on SQLite):</p>
<div class="out">$ npx tsc --noEmit
api/posts/route.ts(2,28): error TS7006: Parameter 'request' implicitly has an 'any' type.
api/posts/route.ts(4,22): error TS2304: Cannot find name 'db'.</div>
<pre><code class="language-typescript">import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const post = await db.note.create({ data: body }); <span class="tok-comment">  // bài dùng db.post — lab có bảng Note</span>
  return Response.json(post, { status: 201 });
}</code></pre>
<p><b>GET with no input — is it cached?</b> The same "random quote" file on both versions, called twice one second apart:</p>
<pre><code class="language-typescript">const CAU = ['Đo, đừng đoán', 'Cache là bản sao', 'Server trước, client sau', 'Kiểm chuỗi trước'];
export async function GET() {
  return Response.json({ cau: CAU[Math.floor(Math.random() * CAU.length)], luc: new Date().toISOString().slice(11, 23) });
}</code></pre>
<div class="out"># Next.js 16.4.6
├ ƒ /api/health
├ ƒ /api/ngau-nhien
├ ○ /api/ngau-nhien-tinh
└ ƒ /api/posts
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
/api/ngau-nhien · {"cau":"Cache là bản sao","luc":"17:57:34.688"}
/api/ngau-nhien · {"cau":"Cache là bản sao","luc":"17:57:35.711"}
/api/ngau-nhien-tinh · {"cau":"Server trước, client sau","luc":"17:57:30.486"}
/api/ngau-nhien-tinh · {"cau":"Server trước, client sau","luc":"17:57:30.486"}

# Next.js 14.2.35
Next.js v14.2.35
─ ○ /api/ngau-nhien                       0 B                0 B
/api/ngau-nhien (14) · {"cau":"Server trước, client sau","luc":"17:55:02.582"}
/api/ngau-nhien (14) · {"cau":"Server trước, client sau","luc":"17:55:02.582"}</div>
<p>16: <code>/api/ngau-nhien</code> is ƒ — a new time on each call; the <code>force-static</code> copy is ○ and frozen at its build time. 14: the very same file is ○ and frozen.</p>
<p><b>The body straight into <code>create</code>, the methods you did not write:</b></p>
<div class="out">$ curl -X POST localhost:3000/api/posts -d '{"title":"Bài mới"}'
{"id":21,"title":"Bài mới"}   ← HTTP 201
$ curl -X POST localhost:3000/api/posts -d '{"id":999,"title":"tôi tự chọn id"}'
{"id":999,"title":"tôi tự chọn id"}   ← HTTP 201
$ curl -X POST localhost:3000/api/posts -d '{"id":13,"title":"đè?"}'
HTTP 500
$ curl -X POST localhost:3000/api/posts -d '{"title":"x","laAdmin":true}'
HTTP 500
$ grep -E 'Unique constraint|Unknown argument' (log next start)
Unique constraint failed on the fields: (&#96;id&#96;)
Unknown argument &#96;laAdmin&#96;
DELETE  → 405
HEAD    → 200
OPTIONS → 204 · allow: GET, HEAD, OPTIONS</div>
<p>The caller chose id 999 (201), collided with id 13 (500), and sent an unknown field (500). Pick the fields you accept and answer bad input with 400.</p>
<p><b>The key-hiding proxy.</b> The key lives in <code>.env.local</code> without <code>NEXT_PUBLIC_</code>; the client page fetches <code>/api/thoi-tiet</code>; the handler adds the header:</p>
<pre><code class="language-typescript">export async function GET() {
  const r = await fetch('http://127.0.0.1:19391/thoi-tiet', {
    headers: { 'x-api-key': process.env.THOI_TIET_KEY! }, <span class="tok-comment">  // khoá chỉ nằm ở máy chủ</span>
    cache: 'no-store',
  });
  return Response.json(await r.json(), { status: r.status });
}</code></pre>
<div class="out">{"thanhPho":"Hà Nội","doC":21}   ← qua route của mình
{"loi":"thiếu hoặc sai x-api-key"}   ← gọi thẳng API ngoài, không khoá
khoá trong .next/static (gửi xuống trình duyệt): 0
khoá trong .next/server: 0
[api] 01:04:31.479 GET /thoi-tiet · khoá ĐÚNG
[api] 01:04:31.502 GET /thoi-tiet · khoá SAI/thiếu</div>
<p>In Chromium the page makes one fetch — to <code>/api/thoi-tiet</code> (33 B) — and none to the paid API.</p>
<p><b>On cuongthai.com</b> (Next.js 14.2, 30 <code>route.ts</code>): every <code>GET</code> handler with no input states its mode; the rest read <code>request</code>:</p>
<div class="out">api/admin/users/nextauth             —                        function GET(request: NextRequest)
api/ai-templates/search              dynamic = 'force-static'   function GET()
api/auth/admin-check                 —                        function GET(request: NextRequest)
api/index-url                        dynamic = 'force-dynamic'  function GET()
api/music/history                    dynamic = 'force-dynamic'  function GET(request: NextRequest)
api/revalidate                       dynamic = 'force-dynamic'  function GET(request: NextRequest)
api/v1/[[...path]]                   —                        function GET(request: NextRequest)
api/v1/files/upload/signed-url       —                        function GET(request: NextRequest)
api/v1/profile/session               —                        function GET(request: NextRequest)
api/v1/social/media/signed-url       —                        function GET(request: NextRequest)
cli/install.ps1                      dynamic = 'force-static'   function GET()
cli/install.sh                       dynamic = 'force-static'   function GET()
tech-trends/rss.xml                  dynamic = 'force-dynamic'  function GET()
uploads/[...path]                    dynamic = 'force-dynamic'  
voice/rss.xml                        dynamic = 'force-dynamic'  function GET()</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build                            <span class="tok-comment">  # is /api/health ○ or ƒ?</span>
npx next start -p 3000
curl -i localhost:3000/api/health
for m in DELETE HEAD OPTIONS; do curl -s -o /dev/null -w "$m %{{http_code}}\\n" -X $m localhost:3000/api/health; done
curl -X POST localhost:3000/api/posts -H 'content-type: application/json' -d '{{"id":999,"title":"x"}}'</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-1-tai-nguyen-phuong-thuc" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 6.1 — Resources, methods and REST</span><span class="lc-sub">HTTP methods and the 405 from the ground up</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-3-validate-schema" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 6.3 — Validation with a schema</span><span class="lc-sub">The fix for the mass assignment measured above</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-2-2-validation" target="_blank" rel="noopener"><span class="lc-ico">📐</span><span class="lc-body"><span class="lc-title">API Design · 2.2 — Validating input at the edge</span><span class="lc-sub">Bad input ⇒ 400, not 500</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Route Handler</span><span class="v">A <code>route.ts</code> exporting HTTP methods (GET, POST...).</span></div>
  <div class="kv"><span class="k">Web Request/Response</span><span class="v">Handlers use the standard <code>Request</code>/<code>Response</code> APIs.</span></div>
  <div class="kv"><span class="k">HTTP method export</span><span class="v">Export a function named for each method you support.</span></div>
  <div class="kv"><span class="k">API in app/</span><span class="v">Backend endpoints living inside the App Router.</span></div>
  <div class="kv"><span class="k">vs Server Action</span><span class="v">Handlers for public APIs/webhooks; actions for form mutations.</span></div>
  <div class="kv"><span class="k">JSON response</span><span class="v"><code>Response.json(...)</code> or <code>NextResponse.json(...)</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A Route Handler is a <code>route.ts</code> that exports HTTP methods (<code>GET</code>, <code>POST</code>...) using standard Request/Response.</li><li>It gives you an API inside the <code>app/</code> folder for webhooks, public endpoints and non-form data.</li><li>Use Route Handlers for public APIs; use Server Actions for form mutations (Chapter 12).</li><li>Return JSON with <code>Response.json(...)</code>.</li></ul>

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

<pre><code class="language-typescript"><span class="tok-comment">// app/api/health/route.ts  →  GET /api/health</span>
export async function GET() {
  return Response.json({ ok: true });
}

<span class="tok-comment">// app/api/posts/route.ts  →  POST /api/posts</span>
export async function POST(request: Request) {   <span class="tok-comment">// db: Prisma client của bạn (vd lib/db.ts)</span>
  const body = await request.json();
  const post = await db.post.create({ data: { title: body.title } });   <span class="tok-comment">// chỉ lấy trường cần — đừng { data: body }</span>
  return Response.json(post, { status: 201 });
}</code></pre>
<p>Đường dẫn thư mục là URL, y như page. Một thư mục có thể có <code>page.tsx</code> <em>hoặc</em> <code>route.ts</code>, không cả hai — một cái phục vụ HTML, cái kia phục vụ một response (cả hai ⇒ <code>next build</code>: <em>"Conflicting route and page at /x"</em>, đo ở dưới).</p>
<div class="callout warn"><p><strong>Chép nguyên vào tệp <code>.ts</code></strong>, hàm <code>POST</code> ở trên trượt <code>tsc</code> hai lần: <code>TS7006 Parameter 'request' implicitly has an 'any' type</code> và <code>TS2304 Cannot find name 'db'</code> (đo thật). Khai kiểu tham số là <code>Request</code>, import client cơ sở dữ liệu — và đừng bao giờ đưa nguyên body vào <code>create</code>: người gọi sẽ tự chọn cột, kể cả id (đo ở dưới).</p></div>

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
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Có, cho các phản hồi không phải HTML</b> — Một tấm ảnh, một file PDF, một bản xuất CSV, một nguồn RSS. Hãy trả về một <code>Response</code> với đúng <code>Content-Type</code>.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Export theo tên phương thức</b> — <code>export async function GET(req)</code>, <code>POST</code>, <code>DELETE</code>. Một phương thức không được export sẽ tự động trả 405; <code>HEAD</code> và <code>OPTIONS</code> được trả lời sẵn (đo: 200, và 204 kèm <code>Allow: GET, HEAD, OPTIONS</code>).</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một route handler bị nhớ đệm trong khi bạn định cho nó chạy trực tiếp.</strong> <b>Ở Next.js 14 trở về trước</b>, một handler <code>GET</code> không có đầu vào động được tính sẵn lúc build, nên nó chạy đúng một lần và mọi khách đều nhận cùng một thân phản hồi mãi mãi — một endpoint &quot;câu nói ngẫu nhiên&quot; trả về đúng một câu suốt một tuần, hay một phép kiểm sức khoẻ báo cáo tình trạng của máy build. Ở bản 14 đó là mặc định và hoàn toàn vô hình: phản hồi là 200 với nội dung nghe rất hợp lý. Đọc <code>request</code>, <code>cookies()</code> hay <code>headers()</code> sẽ tự động đưa nó sang động; không thì hãy nói rõ ra bằng <code>export const dynamic = &#39;force-dynamic&#39;</code>. <b>Từ Next.js 15 mặc định đảo ngược</b> (đo ở dưới trên 16.4.6 và 14.2.35): <code>GET</code> trần là động (ƒ), chạy mỗi lần gọi; muốn cache thì tự xin bằng <code>export const dynamic = &#39;force-static&#39;</code>. Dù bản nào, hãy nói rõ ý định để một lần nâng cấp không đổi hành vi một cách lặng lẽ.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers" target="_blank" rel="noopener">
  <span class="lc-ico">🛣️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route handler</span><span class="lc-sub">Các phương thức, Request/Response, streaming, và luật nhớ đệm.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/Response" target="_blank" rel="noopener">
  <span class="lc-ico">📨</span>
  <span class="lc-body"><span class="lc-title">MDN — Response</span><span class="lc-sub">Object chuẩn web mà route handler trả về, kèm mọi tuỳ chọn của hàm dựng.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo <code>app/api/health/route.ts</code> export một <code>GET</code> trả về JSON; gọi bằng <code>curl</code>.</li>
<li>Thêm một handler <code>POST</code> đọc body request và trả lại nó.</li>
<li>Giải thích khi nào cần Route Handler so với Server Action (API công khai/webhook vs mutation form).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dựng được một Route Handler GET/POST và biết khi nào dùng nó thay cho Server Action.</p></div>

<h3>🔬 Đo thật: phương thức, cache ở 16 và 14, body, proxy</h3>
<p>Hai handler của bài chép vào tệp <code>route.ts</code>, rồi sửa (có kiểu, dùng Prisma thật trên SQLite):</p>
<div class="out">$ npx tsc --noEmit
api/posts/route.ts(2,28): error TS7006: Parameter 'request' implicitly has an 'any' type.
api/posts/route.ts(4,22): error TS2304: Cannot find name 'db'.</div>
<pre><code class="language-typescript">import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const post = await db.note.create({ data: body }); <span class="tok-comment">  // bài dùng db.post — lab có bảng Note</span>
  return Response.json(post, { status: 201 });
}</code></pre>
<p><b>GET không có đầu vào — có bị cache không?</b> Cùng một tệp "câu nói ngẫu nhiên" trên hai phiên bản, gọi hai lần cách nhau một giây:</p>
<pre><code class="language-typescript">const CAU = ['Đo, đừng đoán', 'Cache là bản sao', 'Server trước, client sau', 'Kiểm chuỗi trước'];
export async function GET() {
  return Response.json({ cau: CAU[Math.floor(Math.random() * CAU.length)], luc: new Date().toISOString().slice(11, 23) });
}</code></pre>
<div class="out"># Next.js 16.4.6
├ ƒ /api/health
├ ƒ /api/ngau-nhien
├ ○ /api/ngau-nhien-tinh
└ ƒ /api/posts
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
/api/ngau-nhien · {"cau":"Cache là bản sao","luc":"17:57:34.688"}
/api/ngau-nhien · {"cau":"Cache là bản sao","luc":"17:57:35.711"}
/api/ngau-nhien-tinh · {"cau":"Server trước, client sau","luc":"17:57:30.486"}
/api/ngau-nhien-tinh · {"cau":"Server trước, client sau","luc":"17:57:30.486"}

# Next.js 14.2.35
Next.js v14.2.35
─ ○ /api/ngau-nhien                       0 B                0 B
/api/ngau-nhien (14) · {"cau":"Server trước, client sau","luc":"17:55:02.582"}
/api/ngau-nhien (14) · {"cau":"Server trước, client sau","luc":"17:55:02.582"}</div>
<p>16: <code>/api/ngau-nhien</code> là ƒ — mỗi lần một giờ mới; bản <code>force-static</code> là ○ và đóng băng ở giờ build. 14: chính tệp đó là ○ và đóng băng.</p>
<p><b>Body đưa thẳng vào <code>create</code>, và những phương thức bạn không viết:</b></p>
<div class="out">$ curl -X POST localhost:3000/api/posts -d '{"title":"Bài mới"}'
{"id":21,"title":"Bài mới"}   ← HTTP 201
$ curl -X POST localhost:3000/api/posts -d '{"id":999,"title":"tôi tự chọn id"}'
{"id":999,"title":"tôi tự chọn id"}   ← HTTP 201
$ curl -X POST localhost:3000/api/posts -d '{"id":13,"title":"đè?"}'
HTTP 500
$ curl -X POST localhost:3000/api/posts -d '{"title":"x","laAdmin":true}'
HTTP 500
$ grep -E 'Unique constraint|Unknown argument' (log next start)
Unique constraint failed on the fields: (&#96;id&#96;)
Unknown argument &#96;laAdmin&#96;
DELETE  → 405
HEAD    → 200
OPTIONS → 204 · allow: GET, HEAD, OPTIONS</div>
<p>Người gọi tự chọn id 999 (201), đụng id 13 (500), và gửi một trường lạ (500). Hãy chỉ lấy trường cần và trả 400 cho dữ liệu xấu.</p>
<p><b>Proxy giấu khoá.</b> Khoá nằm trong <code>.env.local</code>, không có tiền tố <code>NEXT_PUBLIC_</code>; trang client fetch <code>/api/thoi-tiet</code>; handler gắn header:</p>
<pre><code class="language-typescript">export async function GET() {
  const r = await fetch('http://127.0.0.1:19391/thoi-tiet', {
    headers: { 'x-api-key': process.env.THOI_TIET_KEY! }, <span class="tok-comment">  // khoá chỉ nằm ở máy chủ</span>
    cache: 'no-store',
  });
  return Response.json(await r.json(), { status: r.status });
}</code></pre>
<div class="out">{"thanhPho":"Hà Nội","doC":21}   ← qua route của mình
{"loi":"thiếu hoặc sai x-api-key"}   ← gọi thẳng API ngoài, không khoá
khoá trong .next/static (gửi xuống trình duyệt): 0
khoá trong .next/server: 0
[api] 01:04:31.479 GET /thoi-tiet · khoá ĐÚNG
[api] 01:04:31.502 GET /thoi-tiet · khoá SAI/thiếu</div>
<p>Trong Chromium, trang chỉ có một lần fetch — tới <code>/api/thoi-tiet</code> (33 B) — và không lần nào tới API trả phí.</p>
<p><b>Trên cuongthai.com</b> (Next.js 14.2, 30 tệp <code>route.ts</code>): mọi handler <code>GET</code> không có đầu vào đều khai rõ chế độ; số còn lại đọc <code>request</code>:</p>
<div class="out">api/admin/users/nextauth             —                        function GET(request: NextRequest)
api/ai-templates/search              dynamic = 'force-static'   function GET()
api/auth/admin-check                 —                        function GET(request: NextRequest)
api/index-url                        dynamic = 'force-dynamic'  function GET()
api/music/history                    dynamic = 'force-dynamic'  function GET(request: NextRequest)
api/revalidate                       dynamic = 'force-dynamic'  function GET(request: NextRequest)
api/v1/[[...path]]                   —                        function GET(request: NextRequest)
api/v1/files/upload/signed-url       —                        function GET(request: NextRequest)
api/v1/profile/session               —                        function GET(request: NextRequest)
api/v1/social/media/signed-url       —                        function GET(request: NextRequest)
cli/install.ps1                      dynamic = 'force-static'   function GET()
cli/install.sh                       dynamic = 'force-static'   function GET()
tech-trends/rss.xml                  dynamic = 'force-dynamic'  function GET()
uploads/[...path]                    dynamic = 'force-dynamic'  
voice/rss.xml                        dynamic = 'force-dynamic'  function GET()</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build                            <span class="tok-comment">  # /api/health là ○ hay ƒ?</span>
npx next start -p 3000
curl -i localhost:3000/api/health
for m in DELETE HEAD OPTIONS; do curl -s -o /dev/null -w "$m %{{http_code}}\\n" -X $m localhost:3000/api/health; done
curl -X POST localhost:3000/api/posts -H 'content-type: application/json' -d '{{"id":999,"title":"x"}}'</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-1-tai-nguyen-phuong-thuc" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 6.1 — Tài nguyên, phương thức, và REST</span><span class="lc-sub">Phương thức HTTP và mã 405 từ gốc</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-3-validate-schema" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 6.3 — Kiểm tra dữ liệu bằng lược đồ</span><span class="lc-sub">Chữa đúng lỗi gán ồ ạt (mass assignment) đo ở trên</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-2-2-validation" target="_blank" rel="noopener"><span class="lc-ico">📐</span><span class="lc-body"><span class="lc-title">API Design · 2.2 — Kiểm dữ liệu vào ngay cửa</span><span class="lc-sub">Dữ liệu xấu ⇒ 400, không phải 500</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Route Handler</span><span class="v">Một <code>route.ts</code> export các phương thức HTTP (GET, POST...).</span></div>
  <div class="kv"><span class="k">Web Request/Response</span><span class="v">Handler dùng API <code>Request</code>/<code>Response</code> chuẩn.</span></div>
  <div class="kv"><span class="k">Export theo method</span><span class="v">Export một hàm đặt tên theo mỗi method bạn hỗ trợ.</span></div>
  <div class="kv"><span class="k">API trong app/</span><span class="v">Endpoint backend nằm trong App Router.</span></div>
  <div class="kv"><span class="k">so với Server Action</span><span class="v">Handler cho API công khai/webhook; action cho mutation form.</span></div>
  <div class="kv"><span class="k">Response JSON</span><span class="v"><code>Response.json(...)</code> hoặc <code>NextResponse.json(...)</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một Route Handler là một <code>route.ts</code> export các method HTTP (<code>GET</code>, <code>POST</code>...) dùng Request/Response chuẩn.</li><li>Nó cho bạn một API trong thư mục <code>app/</code> cho webhook, endpoint công khai và dữ liệu ngoài form.</li><li>Dùng Route Handler cho API công khai; dùng Server Action cho mutation form (Chương 12).</li><li>Trả JSON bằng <code>Response.json(...)</code>.</li></ul>

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
${G11_4}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Render more than one page into one layout, at once</h2>
<p class="lead">Normally a layout has one slot: <code>{children}</code>. Parallel routes give it several named slots, each filled by its own independent page. You define a slot with a folder prefixed by <code>@</code>.</p>

<pre><code>app/dashboard/
├─ layout.tsx
├─ @team/page.tsx        <span class="tok-comment">// slot: team</span>
└─ @analytics/page.tsx   <span class="tok-comment">// slot: analytics</span></code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// layout.tsx receives each @slot as a prop, named after the folder</span>
export default function Layout({ children, team, analytics }: {
  children: React.ReactNode; team: React.ReactNode; analytics: React.ReactNode;
}) {
  return (
    &lt;&gt;
      {children}
      &lt;section&gt;{team}&lt;/section&gt;
      &lt;section&gt;{analytics}&lt;/section&gt;
    &lt;/&gt;
  );
}</code></pre>
<div class="callout warn"><p><strong>Typed, or it will not build.</strong> Copied untyped into a <code>.tsx</code> project, <code>tsc</code> reports <code>TS7031</code> three times — one per prop (measured). Type the props as above, or use the helper Next.js 16 generates from your folders: <code>LayoutProps&lt;'/dashboard'&gt;</code> — rename a slot folder and the layout becomes a type error instead of silently receiving <code>undefined</code>.</p></div>
<p>The <code>@</code> folders are <strong>not</strong> URL segments — like route groups, the name never appears in the path. Instead each becomes a prop on the layout. You now render <code>team</code> and <code>analytics</code> side by side, and each can have its own <code>loading.tsx</code> and <code>error.tsx</code>, so one slow section streams in without blocking the other.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Independent loading/error</span><span class="v">Each slot can have its own <code>loading.tsx</code> and <code>error.tsx</code>. With its own <code>error.tsx</code>, a failing analytics panel does not take down the team panel; <b>without one, the whole page fails</b> — and either way the response status is 500 (measured).</span></div>
  <div class="kv"><span class="k">Independent navigation</span><span class="v">A slot can navigate on its own while the others stay put — the foundation of the modal pattern in the next lesson.</span></div>
  <div class="kv"><span class="k">default.tsx</span><span class="v">When a slot has no match for the current URL, Next renders its <code>default.tsx</code>. Next.js 16 <b>refuses to build</b> without one wherever a sibling slot — <b>including <code>children</code></b> — matches a URL this slot does not (measured below); on 14 you got a 404 page on hard reloads instead.</span></div>
</div>

<div class="note-ct">
<p><strong>Where cuongthai.com would use this:</strong> a dashboard-style screen showing several independent widgets — analytics, system stats, recent activity — is a textbook parallel-routes layout. Each panel loads and errors on its own, so a slow stats query streams in late without freezing the rest of the page.</p>
</div>

<h3>Rendering two independent panes in one URL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>A slot is a folder named @name</b> — <code>@feed</code> and <code>@sidebar</code> beside <code>page.tsx</code>. They do not add anything to the URL.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The layout receives them as props</b> — <code>export default function Layout({ children, feed, sidebar })</code>. Each is a rendered subtree you place wherever you like.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Each slot loads and errors on its own</b> — A slow feed does not block the sidebar <b>if the feed slot has its own <code>loading.tsx</code></b> (measured: 44 ms vs 1.5 s), and a failed sidebar does not take down the page <b>if it has its own <code>error.tsx</code></b> — the status is still 500.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>default.tsx handles the unmatched case</b> — When a navigation matches one slot and not the other, the missing slot renders its <code>default</code> instead of disappearing.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a parallel route that 404s the whole page after a hard refresh.</strong> Soft navigation keeps the previous state of a slot that has no match for the new URL, so everything looks fine while you click around. Reload the page and Next has no state to fall back on: a slot with no matching segment and no <code>default.tsx</code> makes the whole route 404. The bug therefore only appears on a direct link or a refresh — never during development, where you navigated in. (Measured on Next.js 14.2.35: the reload shows a 404 page <b>with status 200</b>. <b>Next.js 16 catches it at build</b>: "Parallel route slots cannot render the same URLs … missing a matching page or default.tsx in @analytics, children" — strict route matching, on by default.) Add a <code>default.tsx</code> to every slot — <code>children</code> included — even if it just returns <code>null</code>, the moment you add a parallel route.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/parallel-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Parallel routes</span><span class="lc-sub">Slots, default.tsx, and the soft-vs-hard navigation difference this trap is about.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/default" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — default.js</span><span class="lc-sub">Exactly when it renders, and why omitting it produces a 404.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add two named slots <code>@feed</code> and <code>@sidebar</code> to a layout and render both from one URL.</li>
<li>Give one slot its own <code>loading.tsx</code> and confirm the two sections load independently.</li>
<li>Explain when parallel routes beat just composing components (independent loading/error, separate navigation).</li>
</ol>
<p><strong>Done when:</strong> you can render independent sections with parallel routes and give each its own states.</p></div>

<h3>🔬 Measured: slots, streaming, errors and default.tsx (Next.js 16.4.6 vs 14.2.35)</h3>
<div class="out">$ npx tsc --noEmit   # the layout as written
dashboard/layout.tsx(2,34): error TS7031: Binding element 'children' implicitly has an 'any' type.
dashboard/layout.tsx(2,44): error TS7031: Binding element 'team' implicitly has an 'any' type.
dashboard/layout.tsx(2,50): error TS7031: Binding element 'analytics' implicitly has an 'any' type.
$ curl … (status)
/dashboard         200
/dashboard/@team   404
/dashboard/team    404
/@team             404</div>
<p><b>Streaming per slot.</b> <code>@analytics</code> waits 1.5 s and has its own <code>loading.tsx</code> (<code>/bang</code>); the copy <code>/bang2</code> has none. The HTML read chunk by chunk:</p>
<pre><code class="language-tsx"><span class="tok-comment">// khe chậm: một truy vấn thống kê mất 1,5 giây</span>
import { connection } from 'next/server';
export default async function Analytics() {
  await connection();
  await new Promise((r) =&gt; setTimeout(r, 1500));
  return &lt;p&gt;📈 Doanh thu: 42 đơn — THONG-KE&lt;/p&gt;;
}</code></pre>
<div class="out">$ node luong.mjs localhost:3000/bang TIEU-DE NHOM DANG-TAI THONG-KE      # khe chậm CÓ loading.tsx riêng
+  44 ms · mẩu 1 ·  1869 B · có: TIEU-DE, NHOM, DANG-TAI
+  44 ms · mẩu 2 ·  7639 B · có: TIEU-DE, NHOM, DANG-TAI
+1537 ms · mẩu 3 ·   122 B · có: THONG-KE
+1537 ms · mẩu 4 ·   933 B · có: THONG-KE
+1538 ms · mẩu 5 ·    14 B
$ node luong.mjs localhost:3000/bang2 TIEU-DE NHOM DANG-TAI THONG-KE     # KHÔNG có loading.tsx trong khe
+1539 ms · mẩu 1 ·  1723 B · có: TIEU-DE, NHOM, THONG-KE
+1539 ms · mẩu 2 ·  7472 B · có: TIEU-DE, NHOM, THONG-KE
+1539 ms · mẩu 3 ·    14 B</div>
<p><b>Errors per slot.</b> <code>@analytics</code> throws; <code>/loi</code> has <code>@analytics/error.tsx</code>, <code>/loi2</code> does not:</p>
<div class="out">/loi   HTTP 500
/loi2  HTTP 500</div>
<p>In Chromium, <code>/loi</code> shows the title, the team panel and "⚠️ Thống kê đang lỗi — thử lại"; <code>/loi2</code> shows only "This page couldn't load". Both answer 500.</p>
<p><b>default.tsx.</b> Only <code>@team</code> has a <code>settings/</code> page; <code>@analytics</code> and <code>children</code> have neither a page nor a default for it:</p>
<div class="out">$ npm run build   # Next.js 16.4.6
⚠ Strict route matching is enabled by default. This validation indicates a bug in your app's route structure, but you can temporarily restore loose route matching by setting &#96;deprecated.looseRouteMatching&#96; to &#96;true&#96; in your Next.js config.
Error: Parallel route slots cannot render the same URLs
- /dash/settings is missing a matching page or default.tsx in @analytics, children
Every URL matched by one slot must have a matching page or default.tsx in every sibling slot.

$ npm run build &amp;&amp; next start   # Next.js 14.2.35, same folders
/dash           HTTP 200   (Next.js 14, tải thẳng)
/dash/settings  HTTP 200   (Next.js 14, tải thẳng)
bấm Link sang /dash/settings (Next 14) ⇒ thanh địa chỉ: /dash/settings · khe analytics vẫn: 📈 Thống kê — trang chính</div>
<p>Add <code>app/dash/default.tsx</code> (return <code>null</code>) and <code>@analytics/default.tsx</code>, and 16 builds — then the same URL gives two screens, depending on how you arrived:</p>
<div class="out">/dash           HTTP 200
/dash/settings  HTTP 200
bấm Link /dash → /dash/settings (Next 16): 📈 Thống kê — trang chính | h1: Trang chính
tải thẳng /dash/settings (Next 16): số thẻ h1 = 0 · khe analytics: 📈 Thống kê — (không có gì cho URL này)</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">mkdir -p "src/app/dash/@team/settings" "src/app/dash/@analytics" <span class="tok-comment">  # quote the @ folders</span>
npm run build <span class="tok-comment">  # 16: read the error, add the default.tsx files it names</span>
npx next start -p 3000
curl -s -o /dev/null -w "%{{http_code}}\\n" localhost:3000/dash/settings</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-2-layout" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.2 — Layouts and nested routes</span><span class="lc-sub">React Router: Outlet is ONE slot — here a layout has several</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 9.1 — Routes, params & links</span><span class="lc-sub">Client-side routing from the ground up</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-4-streaming-suspense" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.4 — Streaming: loading.tsx, Suspense</span><span class="lc-sub">The mechanism each slot uses to stream on its own</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Parallel routes</span><span class="v">Render multiple named slots in one layout at once.</span></div>
  <div class="kv"><span class="k">Named slot</span><span class="v">A <code>@folder</code> that becomes a prop on the layout.</span></div>
  <div class="kv"><span class="k">Independent loading</span><span class="v">Each slot has its own loading/error states.</span></div>
  <div class="kv"><span class="k">Slot prop</span><span class="v">The layout receives each slot as a prop to place.</span></div>
  <div class="kv"><span class="k">default.tsx</span><span class="v">Fallback for a slot when a route does not define it.</span></div>
  <div class="kv"><span class="k">Use case</span><span class="v">Dashboards and feeds with independent regions.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Parallel routes render several named slots (<code>@feed</code>, <code>@sidebar</code>) in one layout at once.</li><li>Each slot arrives as a prop on the layout and has its own loading and error states.</li><li>They beat plain composition when sections must load, error and navigate independently.</li><li>Provide a <code>default.tsx</code> for slots a route does not define.</li></ul>

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
<pre><code class="language-typescript"><span class="tok-comment">// layout.tsx nhận mỗi @khe làm một prop, đặt tên theo thư mục</span>
export default function Layout({ children, team, analytics }: {
  children: React.ReactNode; team: React.ReactNode; analytics: React.ReactNode;
}) {
  return (
    &lt;&gt;
      {children}
      &lt;section&gt;{team}&lt;/section&gt;
      &lt;section&gt;{analytics}&lt;/section&gt;
    &lt;/&gt;
  );
}</code></pre>
<div class="callout warn"><p><strong>Phải có kiểu, không thì không build.</strong> Chép không kiểu vào dự án <code>.tsx</code>, <code>tsc</code> báo <code>TS7031</code> ba lần — mỗi prop một lần (đo thật). Khai kiểu như trên, hoặc dùng kiểu trợ giúp mà Next.js 16 sinh từ thư mục: <code>LayoutProps&lt;'/dashboard'&gt;</code> — đổi tên thư mục khe thì layout thành lỗi kiểu thay vì lặng lẽ nhận <code>undefined</code>.</p></div>
<p>Các thư mục <code>@</code> <strong>không</strong> phải là đoạn URL — như route group, tên không bao giờ hiện trên đường dẫn. Thay vào đó mỗi cái thành một prop trên layout. Giờ bạn render <code>team</code> và <code>analytics</code> cạnh nhau, và mỗi cái có <code>loading.tsx</code> và <code>error.tsx</code> riêng, nên một vùng chậm stream vào mà không chặn vùng kia.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Loading/error độc lập</span><span class="v">Mỗi khe có thể có <code>loading.tsx</code> và <code>error.tsx</code> riêng. Có <code>error.tsx</code> riêng thì panel analytics hỏng không kéo đổ panel team; <b>không có thì cả trang hỏng</b> — và trường hợp nào mã trạng thái cũng là 500 (đo thật).</span></div>
  <div class="kv"><span class="k">Điều hướng độc lập</span><span class="v">Một khe có thể tự điều hướng trong khi các khe khác đứng yên — nền của mẫu modal ở bài sau.</span></div>
  <div class="kv"><span class="k">default.tsx</span><span class="v">Khi một khe không có gì khớp URL hiện tại, Next render <code>default.tsx</code> của nó. Next.js 16 <b>không cho build</b> nếu thiếu, ở mọi URL mà một khe anh em — <b>kể cả <code>children</code></b> — khớp còn khe này thì không (đo ở dưới); bản 14 thì thay vào đó hiện trang 404 khi tải lại cứng.</span></div>
</div>

<div class="note-ct">
<p><strong>Chỗ cuongthai.com sẽ dùng cái này:</strong> một màn kiểu dashboard hiện nhiều widget độc lập — analytics, thống kê hệ thống, hoạt động gần đây — là một layout parallel-routes bài bản. Mỗi panel tự tải và tự báo lỗi, nên một truy vấn thống kê chậm stream vào muộn mà không đóng băng phần còn lại.</p>
</div>

<h3>Vẽ hai khung độc lập trong cùng một URL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Một khe (slot) là một thư mục tên @name</b> — <code>@feed</code> và <code>@sidebar</code> nằm cạnh <code>page.tsx</code>. Chúng không thêm gì vào URL.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Layout nhận chúng dưới dạng props</b> — <code>export default function Layout({ children, feed, sidebar })</code>. Mỗi cái là một cây con đã vẽ, bạn đặt vào đâu tuỳ ý.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Mỗi khe tự tải và tự hỏng riêng</b> — Một feed chậm không chặn thanh bên <b>nếu khe feed có <code>loading.tsx</code> riêng</b> (đo: 44 ms so với 1,5 s), và một thanh bên hỏng không kéo sập cả trang <b>nếu nó có <code>error.tsx</code> riêng</b> — mã trạng thái vẫn là 500.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>default.tsx lo trường hợp không khớp</b> — Khi một lần chuyển trang khớp khe này mà không khớp khe kia, khe thiếu sẽ vẽ <code>default</code> của nó thay vì biến mất.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một parallel route làm cả trang 404 sau khi tải lại cứng.</strong> Chuyển trang mềm giữ lại trạng thái trước đó của một khe không khớp URL mới, nên mọi thứ trông vẫn ổn khi bạn bấm loanh quanh. Tải lại trang là Next chẳng còn trạng thái nào để lùi về: một khe không có đoạn nào khớp và cũng không có <code>default.tsx</code> sẽ làm cả route trả 404. Cái lỗi vì thế chỉ hiện ra khi vào bằng liên kết trực tiếp hoặc khi tải lại — chẳng bao giờ hiện lúc phát triển, vì lúc đó bạn đi vào bằng điều hướng. (Đo trên Next.js 14.2.35: tải lại hiện trang 404 <b>với mã 200</b>. <b>Next.js 16 bắt lỗi này lúc build</b>: "Parallel route slots cannot render the same URLs … missing a matching page or default.tsx in @analytics, children" — khớp route nghiêm ngặt, bật sẵn.) Hãy thêm một <code>default.tsx</code> cho mọi khe — kể cả <code>children</code> —, dù nó chỉ trả về <code>null</code>, ngay khi bạn thêm một parallel route.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/parallel-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Parallel route</span><span class="lc-sub">Khe, default.tsx, và khác biệt chuyển-trang-mềm với cứng mà bẫy này nói tới.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/default" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — default.js</span><span class="lc-sub">Chính xác khi nào nó được vẽ, và vì sao bỏ nó đi lại sinh ra 404.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm hai slot có tên <code>@feed</code> và <code>@sidebar</code> vào một layout và render cả hai từ một URL.</li>
<li>Cho một slot một <code>loading.tsx</code> riêng và xác nhận hai mảng tải độc lập.</li>
<li>Giải thích khi nào parallel route thắng việc chỉ ghép component (loading/error độc lập, điều hướng riêng).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn render được các mảng độc lập bằng parallel route và cho mỗi cái trạng thái riêng.</p></div>

<h3>🔬 Đo thật: khe, streaming, lỗi và default.tsx (Next.js 16.4.6 so với 14.2.35)</h3>
<div class="out">$ npx tsc --noEmit   # layout chép nguyên
dashboard/layout.tsx(2,34): error TS7031: Binding element 'children' implicitly has an 'any' type.
dashboard/layout.tsx(2,44): error TS7031: Binding element 'team' implicitly has an 'any' type.
dashboard/layout.tsx(2,50): error TS7031: Binding element 'analytics' implicitly has an 'any' type.
$ curl … (status)
/dashboard         200
/dashboard/@team   404
/dashboard/team    404
/@team             404</div>
<p><b>Stream theo từng khe.</b> <code>@analytics</code> chờ 1,5 giây và có <code>loading.tsx</code> riêng (<code>/bang</code>); bản sao <code>/bang2</code> thì không. Đọc HTML theo từng mẩu:</p>
<pre><code class="language-tsx"><span class="tok-comment">// khe chậm: một truy vấn thống kê mất 1,5 giây</span>
import { connection } from 'next/server';
export default async function Analytics() {
  await connection();
  await new Promise((r) =&gt; setTimeout(r, 1500));
  return &lt;p&gt;📈 Doanh thu: 42 đơn — THONG-KE&lt;/p&gt;;
}</code></pre>
<div class="out">$ node luong.mjs localhost:3000/bang TIEU-DE NHOM DANG-TAI THONG-KE      # khe chậm CÓ loading.tsx riêng
+  44 ms · mẩu 1 ·  1869 B · có: TIEU-DE, NHOM, DANG-TAI
+  44 ms · mẩu 2 ·  7639 B · có: TIEU-DE, NHOM, DANG-TAI
+1537 ms · mẩu 3 ·   122 B · có: THONG-KE
+1537 ms · mẩu 4 ·   933 B · có: THONG-KE
+1538 ms · mẩu 5 ·    14 B
$ node luong.mjs localhost:3000/bang2 TIEU-DE NHOM DANG-TAI THONG-KE     # KHÔNG có loading.tsx trong khe
+1539 ms · mẩu 1 ·  1723 B · có: TIEU-DE, NHOM, THONG-KE
+1539 ms · mẩu 2 ·  7472 B · có: TIEU-DE, NHOM, THONG-KE
+1539 ms · mẩu 3 ·    14 B</div>
<p><b>Lỗi theo từng khe.</b> <code>@analytics</code> ném lỗi; <code>/loi</code> có <code>@analytics/error.tsx</code>, <code>/loi2</code> thì không:</p>
<div class="out">/loi   HTTP 500
/loi2  HTTP 500</div>
<p>Trong Chromium, <code>/loi</code> hiện tiêu đề, ô nhóm và "⚠️ Thống kê đang lỗi — thử lại"; <code>/loi2</code> chỉ hiện "This page couldn't load". Cả hai đều trả 500.</p>
<p><b>default.tsx.</b> Chỉ <code>@team</code> có trang <code>settings/</code>; <code>@analytics</code> và <code>children</code> không có trang lẫn default cho URL đó:</p>
<div class="out">$ npm run build   # Next.js 16.4.6
⚠ Strict route matching is enabled by default. This validation indicates a bug in your app's route structure, but you can temporarily restore loose route matching by setting &#96;deprecated.looseRouteMatching&#96; to &#96;true&#96; in your Next.js config.
Error: Parallel route slots cannot render the same URLs
- /dash/settings is missing a matching page or default.tsx in @analytics, children
Every URL matched by one slot must have a matching page or default.tsx in every sibling slot.

$ npm run build &amp;&amp; next start   # Next.js 14.2.35, cùng thư mục
/dash           HTTP 200   (Next.js 14, tải thẳng)
/dash/settings  HTTP 200   (Next.js 14, tải thẳng)
bấm Link sang /dash/settings (Next 14) ⇒ thanh địa chỉ: /dash/settings · khe analytics vẫn: 📈 Thống kê — trang chính</div>
<p>Thêm <code>app/dash/default.tsx</code> (trả <code>null</code>) và <code>@analytics/default.tsx</code>, bản 16 build được — và cùng một URL cho hai màn hình, tuỳ bạn tới bằng cách nào:</p>
<div class="out">/dash           HTTP 200
/dash/settings  HTTP 200
bấm Link /dash → /dash/settings (Next 16): 📈 Thống kê — trang chính | h1: Trang chính
tải thẳng /dash/settings (Next 16): số thẻ h1 = 0 · khe analytics: 📈 Thống kê — (không có gì cho URL này)</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">mkdir -p "src/app/dash/@team/settings" "src/app/dash/@analytics" <span class="tok-comment">  # đặt thư mục @ trong dấu nháy</span>
npm run build <span class="tok-comment">  # 16: đọc lỗi, thêm các default.tsx nó nêu tên</span>
npx next start -p 3000
curl -s -o /dev/null -w "%{{http_code}}\\n" localhost:3000/dash/settings</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-2-layout" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.2 — Layout, route lồng nhau</span><span class="lc-sub">React Router: Outlet là MỘT khe — ở đây layout có nhiều khe</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 9.1 — Route, tham số & link</span><span class="lc-sub">Định tuyến phía client từ gốc</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-4-streaming-suspense" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.4 — Streaming: loading.tsx, Suspense</span><span class="lc-sub">Đúng cơ chế mỗi khe dùng để stream riêng</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Parallel routes</span><span class="v">Render nhiều slot có tên trong một layout cùng lúc.</span></div>
  <div class="kv"><span class="k">Slot có tên</span><span class="v">Một <code>@thưmục</code> trở thành một prop trên layout.</span></div>
  <div class="kv"><span class="k">Loading độc lập</span><span class="v">Mỗi slot có trạng thái loading/error riêng.</span></div>
  <div class="kv"><span class="k">Prop slot</span><span class="v">Layout nhận mỗi slot như một prop để đặt.</span></div>
  <div class="kv"><span class="k">default.tsx</span><span class="v">Fallback cho một slot khi một route không định nghĩa nó.</span></div>
  <div class="kv"><span class="k">Trường hợp dùng</span><span class="v">Dashboard và feed có các vùng độc lập.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Parallel route render vài slot có tên (<code>@feed</code>, <code>@sidebar</code>) trong một layout cùng lúc.</li><li>Mỗi slot đến như một prop trên layout và có trạng thái loading, error riêng.</li><li>Chúng thắng việc ghép thường khi các mảng phải tải, lỗi và điều hướng độc lập.</li><li>Cấp một <code>default.tsx</code> cho slot mà một route không định nghĩa.</li></ul>

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
${G11_5}
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
   ├─ layout.tsx                <span class="tok-comment">// renders {children}{modal}</span>
   ├─ @modal/default.tsx        <span class="tok-comment">// null when no modal is open</span>
   └─ @modal/(..)photo/[id]/page.tsx   <span class="tok-comment">// intercepts a soft nav to /photo/[id] → modal</span></code></pre>
<p>The marker mirrors relative paths: <code>(.)</code> same level, <code>(..)</code> one level up, <code>(..)(..)</code> two levels, <code>(...)</code> from the app root. It is paired with a parallel-route slot (lesson 11.4) — typically a <code>@modal</code> slot in the layout — so the intercepted page renders into the modal slot while the underlying page stays mounted.</p>
<div class="callout warn"><p><strong>The markers count route segments from the interceptor's own folder.</strong> A first draft of this tree put <code>(.)photo</code> inside <code>feed/</code>. Built on Next.js 16.4.6 it fails: <em>"Interception routes must have a canonical route — /feed2/(.)photo/[id] (expected /feed2/photo/[id])"</em> — <code>(.)</code> inside <code>feed/</code> intercepts <code>/feed/photo/…</code>, a URL that does not exist. To reach <code>/photo/[id]</code> from <code>feed/</code> go one level up: <code>(..)photo</code>. Slots (<code>@modal</code>) and route groups do not count as levels (measured below).</p></div>

<div class="note-ct">
<p><strong>How cuongthai.com does it today — not with this pattern.</strong> The site has <b>0</b> intercepting routes (checked in the repo). Its comment modal is store-driven: a "Bình luận" click calls <code>openCommentModal</code> and the URL does not change; a deep link <code>/feed?post=N&amp;comment=M</code> (notifications, shared posts) opens the same modal, then <code>history.replaceState</code> strips the parameters. With intercepting + parallel routes, each open post would get its own URL — shareable, reloadable, with Back closing it — at the cost of a real post page, a slot and an interceptor.</p>
</div>

<div class="callout warn">
<p><strong>Always ship the real page too.</strong> The intercepted modal is only for soft navigation. If you forget the standalone <code>photo/[id]/page.tsx</code>, a shared link or a refresh has nothing to render. The pattern is two routes working together: the full page for hard loads, the interceptor for in-app clicks.</p>
</div>

<h3>Intercepting a route to show it as a modal</h3>
<div class="lz-map">
  <div class="lz-stage">Same URL, two presentations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">The convention is (.) (..) (...)</div><div class="lz-nsub">Like relative paths, but for route segments: <code>(.)photo</code> intercepts a sibling, <code>(..)photo</code> one level up — counted in route segments from the interceptor's folder; slots and groups do not count.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">A soft navigation renders the interception</div><div class="lz-nsub">Clicking a thumbnail shows the photo in a modal over the current page, and the URL updates to the photo&#39;s own.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">A hard load renders the real route</div><div class="lz-nsub">Sharing that URL, or reloading it, gives the full photo page. One address, two correct presentations.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">It pairs with a parallel route</div><div class="lz-nsub">The modal lives in a <code>@modal</code> slot so it can be rendered over the page rather than instead of it.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — a modal built by intercepting, with no way to close it back to the list.</strong> The modal is a route now, so closing it is a navigation, not a state change: calling a local <code>setOpen(false)</code> hides the element while the URL still points at the photo, so the back button and a refresh both bring it straight back. The close button has to call <code>router.back()</code> — and the slot needs a <code>default.tsx</code> returning <code>null</code> so the modal disappears when the user navigates to a route that does not match it. Both are easy to miss because the modal looks right the first time you open it. (Measured: after <code>setOpen(false)</code> the URL is still <code>/photo/1</code> and a reload shows the full photo page; after <code>router.back()</code> the URL is <code>/feed</code>.)</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🪞</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Intercepting routes</span><span class="lc-sub">The convention, with the photo-modal example this lesson follows.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Modals with parallel routes</span><span class="lc-sub">The full pattern: slot, interception, default.tsx and the close handler.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Set up an intercepting route (for example <code>@modal/(..)photo/[id]</code> inside <code>feed/</code>) so clicking a thumbnail opens a modal while the URL changes.</li>
<li>Reload the modal URL directly and confirm it renders the full page (not the modal) — the share-friendly behaviour.</li>
<li>Explain the intercept markers <code>(.)</code>, <code>(..)</code>, <code>(...)</code> in one line.</li>
</ol>
<p><strong>Done when:</strong> you can build the modal pattern with intercepting routes and explain the markers.</p></div>

<h3>🔬 Measured: the tree, soft vs hard, closing (Next.js 16.4.6 + Chromium)</h3>
<div class="out">$ npm run build   # the first-draft tree: feed2/(.)photo/[id] + photo/[id]
Error: Interception routes must have a canonical route
- /feed2/(.)photo/[id] (expected /feed2/photo/[id])

$ npm run build   # the working tree
├ ○ /feed
├ ƒ /feed/(..)photo/[id]
└ ƒ /photo/[id]</div>
<pre><code class="language-tsx">export default function FeedLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return &lt;&gt;{children}{modal}&lt;/&gt;;
}</code></pre>
<pre><code class="language-tsx">import Modal from '@/app/_comp/Modal';
export default async function PhotoModal({ params }: { params: Promise&lt;{ id: string }&gt; }) {
  const { id } = await params;
  console.log(&#96;[modal] chặn /photo/\${id}&#96;);
  return &lt;Modal&gt;🖼️ Ảnh số {id} — MODAL&lt;/Modal&gt;;
}</code></pre>
<p>Chromium (Playwright) — each scenario's results, then the server log showing which file rendered:</p>
<div class="out">mem        · duong=/photo/1 · modal=true · feedVanDuoi=true
cung       · modal=false · h1=🖼️ Ảnh số 1 — TRANG ĐẦY ĐỦ
f5         · modal=false · h1=🖼️ Ảnh số 1 — TRANG ĐẦY ĐỦ
dong-state · duong=/photo/1 · modal=false · sauF5=🖼️ Ảnh số 1 — TRANG ĐẦY ĐỦ
dong-back  · duong=/feed · modal=false

[modal] chặn /photo/1
[photo] trang đầy đủ /photo/1
[modal] chặn /photo/1
[photo] trang đầy đủ /photo/1
[modal] chặn /photo/1
[photo] trang đầy đủ /photo/1
[modal] chặn /photo/1</div>
<p><code>mem</code> = click on <code>/feed</code> (modal, URL <code>/photo/1</code>, the list still in the DOM) · <code>cung</code> = load <code>/photo/1</code> directly · <code>f5</code> = click then reload · <code>dong-state</code> = close with <code>setOpen(false)</code> (then reload) · <code>dong-back</code> = close with <code>router.back()</code>.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">mkdir -p "src/app/feed/@modal/(..)photo/[id]" "src/app/photo/[id]" <span class="tok-comment">  # quote the folders in the shell</span>
npm run build &amp;&amp; npx next start -p 3000
<span class="tok-comment"># open /feed, click a photo, watch the URL; then reload</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-4-portal-error-boundary" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.4 — Portals and error boundaries</span><span class="lc-sub">Rendering a modal outside its parent</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-8-4-dieu-huong-link" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 8.4 — Navigation: Link, useRouter</span><span class="lc-sub">router.back() — the right way to close</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-11-4-parallel-routes" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 11.4 — Parallel routes</span><span class="lc-sub">The @modal slot and default.tsx used here</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Intercepting route</span><span class="v">Render a route's UI in the current layout (as a modal) while the URL changes.</span></div>
  <div class="kv"><span class="k">Modal pattern</span><span class="v">Open content in an overlay without leaving the page.</span></div>
  <div class="kv"><span class="k">(.) / (..) / (...)</span><span class="v">Markers for intercepting at same/parent/root level.</span></div>
  <div class="kv"><span class="k">Soft vs hard navigation</span><span class="v">Intercept on in-app click; full page on direct load/reload.</span></div>
  <div class="kv"><span class="k">Shareable URL</span><span class="v">The same URL loads the full page when visited directly.</span></div>
  <div class="kv"><span class="k">Paired with parallel routes</span><span class="v">Often uses a slot to host the modal.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Intercepting routes show a route's content in the current layout (a modal) on an in-app click.</li><li>Visiting or reloading the same URL directly renders the full page — so the link stays shareable.</li><li>The markers <code>(.)</code>, <code>(..)</code>, <code>(...)</code> choose the level to intercept from.</li><li>This is the standard modal pattern, usually paired with a parallel-route slot.</li></ul>

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
   ├─ layout.tsx                <span class="tok-comment">// render {children}{modal}</span>
   ├─ @modal/default.tsx        <span class="tok-comment">// null khi không có modal</span>
   └─ @modal/(..)photo/[id]/page.tsx   <span class="tok-comment">// chặn nav mềm tới /photo/[id] → modal</span></code></pre>
<p>Dấu hiệu phản chiếu đường dẫn tương đối: <code>(.)</code> cùng cấp, <code>(..)</code> lên một cấp, <code>(..)(..)</code> hai cấp, <code>(...)</code> từ gốc app. Nó đi kèm một khe parallel-route (bài 11.4) — thường là một khe <code>@modal</code> trong layout — để trang bị chặn render vào khe modal trong khi trang bên dưới vẫn mount.</p>
<div class="callout warn"><p><strong>Dấu chấm đếm tầng route tính từ chính thư mục chặn.</strong> Bản nháp đầu của cây này đặt <code>(.)photo</code> trong <code>feed/</code>. Build trên Next.js 16.4.6 thì hỏng: <em>"Interception routes must have a canonical route — /feed2/(.)photo/[id] (expected /feed2/photo/[id])"</em> — <code>(.)</code> trong <code>feed/</code> chặn <code>/feed/photo/…</code>, một URL không tồn tại. Muốn chặn <code>/photo/[id]</code> từ <code>feed/</code> thì lên một tầng: <code>(..)photo</code>. Khe (<code>@modal</code>) và route group không tính là tầng (đo ở dưới).</p></div>

<div class="note-ct">
<p><strong>cuongthai.com hôm nay làm thế nào — không dùng mẫu này.</strong> Trang web có <b>0</b> intercepting route (đã kiểm trong kho). Modal bình luận chạy bằng store: bấm "Bình luận" gọi <code>openCommentModal</code> và URL không đổi; một liên kết sâu <code>/feed?post=N&amp;comment=M</code> (thông báo, bài được chia sẻ) mở cùng modal đó, rồi <code>history.replaceState</code> xoá tham số đi. Dùng intercepting + parallel route, mỗi bài đang mở sẽ có URL riêng — chia sẻ được, tải lại được, bấm quay lại là đóng — đổi lại phải có trang bài viết thật, một khe và một route chặn.</p>
</div>

<div class="callout warn">
<p><strong>Luôn ship cả trang thật.</strong> Modal bị chặn chỉ cho điều hướng mềm. Nếu bạn quên trang độc lập <code>photo/[id]/page.tsx</code>, một link chia sẻ hay một lần refresh chẳng có gì để render. Mẫu này là hai route làm việc cùng nhau: trang đầy đủ cho tải cứng, cái chặn cho các cú bấm trong app.</p>
</div>

<h3>Chặn một route để hiện nó thành modal</h3>
<div class="lz-map">
  <div class="lz-stage">Cùng một URL, hai cách trình bày</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Quy ước là (.) (..) (...)</div><div class="lz-nsub">Giống đường dẫn tương đối, nhưng dành cho đoạn route: <code>(.)photo</code> chặn một đoạn anh em, <code>(..)photo</code> chặn ở cấp trên một bậc — đếm theo tầng route từ thư mục chặn; khe và nhóm không tính.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Chuyển trang mềm sẽ vẽ bản chặn</div><div class="lz-nsub">Bấm vào một ảnh thu nhỏ là ảnh hiện trong một modal đè lên trang hiện tại, và URL cập nhật thành URL của chính tấm ảnh.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Tải cứng thì vẽ route thật</div><div class="lz-nsub">Chia sẻ URL đó, hoặc tải lại nó, sẽ cho ra trang ảnh đầy đủ. Một địa chỉ, hai cách trình bày đều đúng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Nó đi cặp với một parallel route</div><div class="lz-nsub">Cái modal sống trong một khe <code>@modal</code> để nó vẽ được ĐÈ LÊN trang chứ không phải THAY CHO trang.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một modal dựng bằng phép chặn, mà chẳng có cách nào đóng lại về danh sách.</strong> Giờ cái modal là một route, nên đóng nó là một lần chuyển trang chứ không phải một thay đổi state: gọi một <code>setOpen(false)</code> cục bộ chỉ giấu phần tử đi trong khi URL vẫn trỏ vào tấm ảnh, nên nút quay lại và một lần tải lại đều lôi nó về ngay. Nút đóng phải gọi <code>router.back()</code> — và cái khe cần một <code>default.tsx</code> trả về <code>null</code> để modal biến mất khi người dùng chuyển sang một route không khớp nó. Cả hai đều dễ bỏ sót vì cái modal trông rất ổn ở lần mở đầu tiên. (Đo thật: sau <code>setOpen(false)</code> URL vẫn là <code>/photo/1</code> và tải lại ra trang ảnh đầy đủ; sau <code>router.back()</code> URL là <code>/feed</code>.)</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes" target="_blank" rel="noopener">
  <span class="lc-ico">🪞</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Chặn route</span><span class="lc-sub">Quy ước, kèm ví dụ modal-ảnh mà bài này đi theo.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Modal bằng parallel route</span><span class="lc-sub">Toàn bộ mẫu: khe, phép chặn, default.tsx và handler đóng.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng một intercepting route (ví dụ <code>@modal/(..)photo/[id]</code> trong <code>feed/</code>) để click một thumbnail mở modal trong khi URL đổi.</li>
<li>Tải lại thẳng URL của modal và xác nhận nó render trang đầy đủ (không phải modal) — hành vi thân thiện chia sẻ.</li>
<li>Giải thích các dấu intercept <code>(.)</code>, <code>(..)</code>, <code>(...)</code> một dòng.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dựng được mẫu modal bằng intercepting route và giải thích các dấu.</p></div>

<h3>🔬 Đo thật: cây thư mục, mềm và cứng, cách đóng (Next.js 16.4.6 + Chromium)</h3>
<div class="out">$ npm run build   # cây bản nháp: feed2/(.)photo/[id] + photo/[id]
Error: Interception routes must have a canonical route
- /feed2/(.)photo/[id] (expected /feed2/photo/[id])

$ npm run build   # cây chạy được
├ ○ /feed
├ ƒ /feed/(..)photo/[id]
└ ƒ /photo/[id]</div>
<pre><code class="language-tsx">export default function FeedLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return &lt;&gt;{children}{modal}&lt;/&gt;;
}</code></pre>
<pre><code class="language-tsx">import Modal from '@/app/_comp/Modal';
export default async function PhotoModal({ params }: { params: Promise&lt;{ id: string }&gt; }) {
  const { id } = await params;
  console.log(&#96;[modal] chặn /photo/\${id}&#96;);
  return &lt;Modal&gt;🖼️ Ảnh số {id} — MODAL&lt;/Modal&gt;;
}</code></pre>
<p>Chromium (Playwright) — kết quả từng kịch bản, rồi log máy chủ cho biết tệp nào đã render:</p>
<div class="out">mem        · duong=/photo/1 · modal=true · feedVanDuoi=true
cung       · modal=false · h1=🖼️ Ảnh số 1 — TRANG ĐẦY ĐỦ
f5         · modal=false · h1=🖼️ Ảnh số 1 — TRANG ĐẦY ĐỦ
dong-state · duong=/photo/1 · modal=false · sauF5=🖼️ Ảnh số 1 — TRANG ĐẦY ĐỦ
dong-back  · duong=/feed · modal=false

[modal] chặn /photo/1
[photo] trang đầy đủ /photo/1
[modal] chặn /photo/1
[photo] trang đầy đủ /photo/1
[modal] chặn /photo/1
[photo] trang đầy đủ /photo/1
[modal] chặn /photo/1</div>
<p><code>mem</code> = bấm trên <code>/feed</code> (modal, URL <code>/photo/1</code>, danh sách vẫn trong DOM) · <code>cung</code> = tải thẳng <code>/photo/1</code> · <code>f5</code> = bấm rồi tải lại · <code>dong-state</code> = đóng bằng <code>setOpen(false)</code> (rồi tải lại) · <code>dong-back</code> = đóng bằng <code>router.back()</code>.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">mkdir -p "src/app/feed/@modal/(..)photo/[id]" "src/app/photo/[id]" <span class="tok-comment">  # đặt tên thư mục trong dấu nháy</span>
npm run build &amp;&amp; npx next start -p 3000
<span class="tok-comment"># mở /feed, bấm một ảnh, xem URL; rồi tải lại</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-4-portal-error-boundary" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.4 — Portal và error boundary</span><span class="lc-sub">Đưa modal ra khỏi thẻ cha bằng portal</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-8-4-dieu-huong-link" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 8.4 — Điều hướng: Link, useRouter</span><span class="lc-sub">router.back() — cách đóng modal đúng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-11-4-parallel-routes" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 11.4 — Parallel route</span><span class="lc-sub">Khe @modal và default.tsx dùng ở đây</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Intercepting route</span><span class="v">Render UI của một route trong layout hiện tại (như modal) trong khi URL đổi.</span></div>
  <div class="kv"><span class="k">Mẫu modal</span><span class="v">Mở nội dung trong một lớp phủ mà không rời trang.</span></div>
  <div class="kv"><span class="k">(.) / (..) / (...)</span><span class="v">Dấu intercept ở mức cùng/cha/gốc.</span></div>
  <div class="kv"><span class="k">Soft vs hard navigation</span><span class="v">Intercept khi click trong app; trang đầy đủ khi tải/reload thẳng.</span></div>
  <div class="kv"><span class="k">URL chia sẻ được</span><span class="v">Cùng URL tải trang đầy đủ khi vào trực tiếp.</span></div>
  <div class="kv"><span class="k">Cặp với parallel route</span><span class="v">Thường dùng một slot để chứa modal.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Intercepting route hiện nội dung một route trong layout hiện tại (một modal) khi click trong app.</li><li>Vào hoặc tải lại thẳng cùng URL sẽ render trang đầy đủ — nên link vẫn chia sẻ được.</li><li>Các dấu <code>(.)</code>, <code>(..)</code>, <code>(...)</code> chọn mức để intercept.</li><li>Đây là mẫu modal chuẩn, thường cặp với một slot parallel-route.</li></ul>

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
