/**
 * Next.js & React — Chương 9: Server Component vs Client Component.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Chương thuần khái niệm/ranh giới render — không có "output console" để chạy.
 * Mọi hành vi (RSC mặc định, 'use client' là ranh giới, props phải serialize) là
 * quy ước CHÍNH THỨC của React Server Components + Next.js App Router. Sự cố thật
 * của cuongthai.com (isHydrated không lật true) lấy từ lịch sử vá lỗi của site.
 */

export default {
  title: 'Chapter 9 — Server Components vs Client Components|||Chương 9 — Server Component vs Client Component',
  description: 'Trong App Router, component chạy trên SERVER theo mặc định — không xuống trình duyệt. use client mới đưa một cây con ra client để có state, effect, sự kiện. Ranh giới, cách ghép, và luật truyền props qua ranh giới.',
  lessons: [
    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — The default is a Server Component|||9.1 — Mặc định là Server Component',
      slug: 'nextjs-9-1-mac-dinh-la-server-component',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Next.js App Router: Routing, Data Fetching, Caching" — Vercel (official, oEmbed verified).
      video: { url: 'https://youtu.be/gSSsZReIFRk', durationSeconds: 0 },
      description: 'Điều bất ngờ nhất khi từ React sang Next.js: mọi component chạy trên server theo mặc định và KHÔNG gửi JavaScript của nó xuống trình duyệt. Điều đó nghĩa là gì và được lợi gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Every component you wrote in Chapter 8 ran on the server</h2>
<p class="lead">Here is the single most surprising thing about the App Router: components are <strong>Server Components by default</strong>. The <code>page.tsx</code> and <code>layout.tsx</code> you made last chapter ran on the server, produced HTML, and shipped <em>no JavaScript of their own</em> to the browser. This is the opposite of a classic React SPA, where every component's code is downloaded and run in the browser.</p>

<h3>What "runs on the server" actually means</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">A request comes in for <code>/courses</code>. Next.js runs the Server Component <b>on the server</b>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">It can <code>await</code> data — a database query, a fetch — right there, before rendering.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">It renders to HTML. The browser receives finished HTML, not a bundle to execute.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb">The component's own code <b>never ships</b>. Zero KB of JavaScript for it in the browser.</div></div>
</div>

<h3>A Server Component can do things a browser component cannot</h3>
<pre><code><span class="tok-comment">// app/courses/page.tsx — a Server Component (no 'use client')</span>
export default async function CoursesPage() {
  const courses = await db.course.findMany();   <span class="tok-comment">// talk to the DB directly</span>
  return (
    &lt;ul&gt;
      {courses.map(c =&gt; &lt;li key={c.id}&gt;{c.title}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}</code></pre>
<p>Notice <code>async function</code> — a Server Component can be async and <code>await</code> directly in the body. It can read the database, use secret API keys, and touch the file system, because that code stays on the server and is never exposed.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Smaller bundle</span><span class="v">Component code that never ships means less JavaScript to download and run — faster pages.</span></div>
  <div class="kv"><span class="k">Data at the source</span><span class="v">Fetch/DB happen on the server, next to the data — no client round-trip, no loading spinner for the initial data.</span></div>
  <div class="kv"><span class="k">Secrets stay secret</span><span class="v">API keys and DB credentials live in server code the browser never sees. (Contrast the <code>NEXT_PUBLIC_</code> trap in Chapter 13.)</span></div>
</div>

<h3>The catch: no interactivity here</h3>
<p>Because a Server Component runs once on the server and its code is gone by the time the page is in the browser, it <strong>cannot</strong> use <code>useState</code>, <code>useEffect</code>, event handlers like <code>onClick</code>, or any browser API. There is no live component in the browser to hold state or respond to clicks. Everything you learned in Chapters 3–7 — state, effects, events — needs a <em>Client</em> Component. That is the next lesson.</p>

<h3>What a Server Component can and cannot do</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It runs on the server, once, before the response</b> — Never in the browser. Its code is not in the JavaScript bundle at all — a large date library used only here costs the user nothing.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It can await directly</b> — &#96;const rows = await db.note.findMany()&#96;. No effect, no loading state, no waterfall — the component <em>is</em> the data fetch.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It can hold secrets</b> — An API key or a database URL read here never reaches the client, because the component&#39;s source never does.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>It cannot use state, effects or browser APIs</b> — No &#96;useState&#96;, no &#96;onClick&#96;, no &#96;window&#96;. There is no browser and no second render to hold anything.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — adding &#96;&#39;use client&#39;&#96; to a page just to fix one error, and shipping the whole subtree to the browser.</strong> The directive is contagious downward: everything the file imports becomes part of the client bundle too. So marking a page because one button needs &#96;onClick&#96; drags the entire tree — the markdown renderer, the date library, the chart — into the browser, and the database call inside it now fails to compile at all. The bundle grows by hundreds of kilobytes and nothing warns you. Push the boundary down instead: keep the page on the server and extract the interactive part into its own small Client Component.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Server Components</span><span class="lc-sub">The model itself, independent of any framework.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Components</span><span class="lc-sub">How Next.js implements it, with the full list of what is and is not allowed.</span></span>
</a>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Components</span><span class="lc-sub">Why they are the default, and what running on the server unlocks.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Server Components</span><span class="lc-sub">The React-level model behind Next.js's default.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Mọi component bạn viết ở Chương 8 đều chạy trên server</h2>
<p class="lead">Đây là điều bất ngờ nhất của App Router: component <strong>mặc định là Server Component</strong>. Các <code>page.tsx</code> và <code>layout.tsx</code> bạn tạo chương trước đã chạy trên server, tạo ra HTML, và <em>không gửi JavaScript của riêng chúng</em> xuống trình duyệt. Đây là ngược lại với một SPA React kinh điển, nơi code của mọi component đều được tải về và chạy trong trình duyệt.</p>

<h3>"Chạy trên server" thật ra nghĩa là gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Một request tới cho <code>/courses</code>. Next.js chạy Server Component <b>trên server</b>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">Nó có thể <code>await</code> dữ liệu — một truy vấn DB, một fetch — ngay tại đó, trước khi render.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Nó render ra HTML. Trình duyệt nhận HTML hoàn chỉnh, không phải một bundle để chạy.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb">Code của component <b>không bao giờ xuống</b>. Không một KB JavaScript nào cho nó ở trình duyệt.</div></div>
</div>

<h3>Server Component làm được thứ component trình duyệt không làm được</h3>
<pre><code><span class="tok-comment">// app/courses/page.tsx — một Server Component (không 'use client')</span>
export default async function CoursesPage() {
  const courses = await db.course.findMany();   <span class="tok-comment">// nói chuyện thẳng với DB</span>
  return (
    &lt;ul&gt;
      {courses.map(c =&gt; &lt;li key={c.id}&gt;{c.title}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}</code></pre>
<p>Để ý <code>async function</code> — một Server Component có thể là async và <code>await</code> thẳng trong thân. Nó đọc được database, dùng được khoá API bí mật, và chạm được hệ thống file, vì code đó ở lại trên server và không bao giờ bị lộ.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Bundle nhỏ hơn</span><span class="v">Code component không bao giờ xuống nghĩa là ít JavaScript phải tải và chạy hơn — trang nhanh hơn.</span></div>
  <div class="kv"><span class="k">Dữ liệu tại nguồn</span><span class="v">Fetch/DB xảy ra trên server, cạnh dữ liệu — không vòng đi client, không spinner tải cho dữ liệu ban đầu.</span></div>
  <div class="kv"><span class="k">Bí mật vẫn bí mật</span><span class="v">Khoá API và thông tin DB nằm trong code server mà trình duyệt không thấy. (Đối chiếu bẫy <code>NEXT_PUBLIC_</code> ở Chương 13.)</span></div>
</div>

<h3>Cái giá: không có tương tác ở đây</h3>
<p>Vì một Server Component chạy một lần trên server và code của nó đã biến mất khi trang tới trình duyệt, nó <strong>không thể</strong> dùng <code>useState</code>, <code>useEffect</code>, các handler như <code>onClick</code>, hay bất kỳ API trình duyệt nào. Không có component sống nào trong trình duyệt để giữ state hay phản hồi cú click. Mọi thứ bạn học ở Chương 3–7 — state, effect, sự kiện — cần một Client Component. Đó là bài sau.</p>

<h3>Một Server Component làm được gì và không làm được gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó chạy trên máy chủ, một lần, trước khi phản hồi đi</b> — Không bao giờ chạy trong trình duyệt. Mã của nó hoàn toàn không nằm trong gói JavaScript — một thư viện ngày tháng nặng chỉ dùng ở đây chẳng tốn gì của người dùng.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó await thẳng được</b> — &#96;const rows = await db.note.findMany()&#96;. Không effect, không trạng thái đang tải, không thác nước — component <em>chính là</em> phép lấy dữ liệu.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó giữ được bí mật</b> — Một khoá API hay một URL cơ sở dữ liệu đọc ở đây chẳng bao giờ tới được client, vì mã nguồn của component cũng không bao giờ tới đó.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nó không dùng được state, effect hay API trình duyệt</b> — Không &#96;useState&#96;, không &#96;onClick&#96;, không &#96;window&#96;. Chẳng có trình duyệt nào và cũng chẳng có lần render thứ hai nào để giữ thứ gì.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — thêm &#96;&#39;use client&#39;&#96; vào một trang chỉ để dập một lỗi, và đẩy nguyên cả cây con sang trình duyệt.</strong> Chỉ thị này lây xuống dưới: mọi thứ file đó import cũng trở thành một phần của gói client. Nên đánh dấu cả một trang chỉ vì một cái nút cần &#96;onClick&#96; sẽ lôi cả cái cây — bộ vẽ markdown, thư viện ngày tháng, cái biểu đồ — vào trình duyệt, và lời gọi cơ sở dữ liệu bên trong nó giờ không biên dịch nổi nữa. Gói phình thêm hàng trăm kilobyte mà chẳng gì cảnh báo bạn. Hãy đẩy cái ranh giới xuống thấp hơn: giữ trang ở phía máy chủ và rút phần tương tác ra thành một Client Component nhỏ của riêng nó.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Server Component</span><span class="lc-sub">Bản thân mô hình, độc lập với mọi framework.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Component</span><span class="lc-sub">Next.js hiện thực nó ra sao, kèm danh sách đầy đủ cái gì được và không được.</span></span>
</a>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Components</span><span class="lc-sub">Vì sao chúng là mặc định, và chạy trên server mở ra điều gì.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Server Components</span><span class="lc-sub">Mô hình ở tầng React đứng sau mặc định của Next.js.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: "9.2 — 'use client': opting into the browser|||9.2 — 'use client': chọn ra trình duyệt",
      slug: 'nextjs-9-2-use-client',
      type: 'VIDEO',
      isFreePreview: false,
      description: "Thêm 'use client' ở đầu file để đưa component ra chạy trong trình duyệt — nơi duy nhất có state, effect, sự kiện và API trình duyệt. Bảng so sánh việc nào ở đâu.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>When you need interactivity, opt into the client</h2>
<p class="lead">To get state, effects, and event handlers back, you mark a component as a <strong>Client Component</strong> with a single line at the very top of the file: <code>'use client'</code>. That component (and the code it pulls in) is then bundled and run in the browser, exactly like classic React.</p>

<pre><code><span class="tok-comment">// components/Counter.tsx</span>
'use client';
import { useState } from 'react';

export default function Counter() {
  const [n, setN] = useState(0);
  return &lt;button onClick={() =&gt; setN(n + 1)}&gt;Count: {n}&lt;/button&gt;;
}</code></pre>
<p>The directive must be the first line, before any imports. It does not mean "this only runs on the client" — a Client Component is still pre-rendered to HTML on the server for the first paint, then <em>hydrated</em> (made interactive) in the browser. What it means is "this component's code is allowed in the browser, so it may use browser-only features."</p>

<h3>Who can do what</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Server Component only</span><span class="v"><code>async</code>/<code>await</code> in the body; direct DB and file-system access; secret keys; import server-only libraries. Ships zero JS.</span></div>
  <div class="kv"><span class="k">Client Component only</span><span class="v"><code>useState</code>, <code>useEffect</code>, <code>useRef</code>; event handlers (<code>onClick</code>, <code>onChange</code>); browser APIs (<code>window</code>, <code>localStorage</code>); the client hooks <code>useRouter</code>/<code>usePathname</code>.</span></div>
  <div class="kv"><span class="k">Both can</span><span class="v">Render JSX, take props, render other components, be composed together. Most UI is the same either way.</span></div>
  <div class="kv"><span class="k">The default</span><span class="v">No directive = Server Component. You add <code>'use client'</code> only where interactivity is actually needed.</span></div>
</div>

<div class="callout warn">
<p><strong>The mistake that "works" but wastes everything:</strong> slapping <code>'use client'</code> at the top of every file out of habit. It compiles and runs — but you have opted your whole app back into a client bundle and thrown away the Server Component benefits. The skill of this chapter is keeping <code>'use client'</code> small and low in the tree. Lesson 9.5 is about exactly that.</p>
</div>

<h3>A useful rule of thumb</h3>
<p>Ask: <em>does this piece need to remember something, respond to a user event, or touch the browser?</em> If yes → Client. If it just fetches data and renders markup → leave it a Server Component. A page that shows a list of courses is a Server Component; the little "favourite" toggle button inside each row is a Client Component.</p>

<h3>What the directive actually marks</h3>
<div class="lz-map">
  <div class="lz-stage">A boundary, not a location</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">It marks an entry point</div><div class="lz-nsub">&#96;&#39;use client&#39;&#96; at the top of a file says &quot;from here down, this is client code&quot;. It does not mean &quot;runs only in the browser&quot;.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Client Components still render on the server</div><div class="lz-nsub">Once, for the initial HTML. That is why &#96;window&#96; is undefined during that first pass — hydration comes after.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">It is inherited by imports</div><div class="lz-nsub">Every module imported from a client file joins the client bundle. Marking one file can pull in a hundred.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">It is not inherited through children</div><div class="lz-nsub">A Server Component passed as &#96;children&#96; to a Client Component stays on the server. This is the escape hatch chapter 9.3 is about.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — believing &#96;&#39;use client&#39;&#96; means the code only runs in the browser.</strong> It does not: a Client Component is rendered once on the server to produce the initial HTML, then hydrated in the browser. So a component body that reads &#96;localStorage&#96; or &#96;window.innerWidth&#96; at the top level crashes the server render with &quot;localStorage is not defined&quot;, and the error appears at build time on a page that works perfectly in development navigation. Browser-only code belongs inside an effect or an event handler, both of which run only after hydration. When a value must be known on the first paint, read it on the server or accept a two-pass render.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-client" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">react.dev — 'use client'</span><span class="lc-sub">The precise semantics: what the directive marks, and what it does not.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/client-components" target="_blank" rel="noopener">
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Client Components</span><span class="lc-sub">The full render lifecycle, including the server pass people forget about.</span></span>
</a>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/client-components" target="_blank" rel="noopener">
  <span class="lc-ico">🧑‍💻</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Client Components</span><span class="lc-sub">What 'use client' does, hydration, and when you actually need it.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Khi cần tương tác, hãy chọn ra client</h2>
<p class="lead">Để lấy lại state, effect và handler sự kiện, bạn đánh dấu một component là <strong>Client Component</strong> bằng một dòng duy nhất ở ngay đầu file: <code>'use client'</code>. Component đó (và code nó kéo theo) khi ấy được đóng gói và chạy trong trình duyệt, y như React kinh điển.</p>

<pre><code><span class="tok-comment">// components/Counter.tsx</span>
'use client';
import { useState } from 'react';

export default function Counter() {
  const [n, setN] = useState(0);
  return &lt;button onClick={() =&gt; setN(n + 1)}&gt;Đếm: {n}&lt;/button&gt;;
}</code></pre>
<p>Chỉ thị phải là dòng đầu tiên, trước mọi import. Nó không có nghĩa "cái này chỉ chạy ở client" — một Client Component vẫn được render trước ra HTML trên server cho lần vẽ đầu, rồi được <em>hydrate</em> (làm cho tương tác được) trong trình duyệt. Nó nghĩa là "code component này được phép ở trình duyệt, nên có thể dùng tính năng chỉ-có-ở-trình-duyệt."</p>

<h3>Ai làm được gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ Server Component</span><span class="v"><code>async</code>/<code>await</code> trong thân; truy cập thẳng DB và hệ thống file; khoá bí mật; import thư viện chỉ-server. Xuống zero JS.</span></div>
  <div class="kv"><span class="k">Chỉ Client Component</span><span class="v"><code>useState</code>, <code>useEffect</code>, <code>useRef</code>; handler sự kiện (<code>onClick</code>, <code>onChange</code>); API trình duyệt (<code>window</code>, <code>localStorage</code>); hook client <code>useRouter</code>/<code>usePathname</code>.</span></div>
  <div class="kv"><span class="k">Cả hai đều</span><span class="v">Render JSX, nhận props, render component khác, ghép lại với nhau. Đa số UI giống nhau ở cả hai.</span></div>
  <div class="kv"><span class="k">Mặc định</span><span class="v">Không chỉ thị = Server Component. Bạn chỉ thêm <code>'use client'</code> ở chỗ thật sự cần tương tác.</span></div>
</div>

<div class="callout warn">
<p><strong>Cái sai "vẫn chạy" nhưng phí sạch:</strong> theo thói quen dán <code>'use client'</code> lên đầu mọi file. Nó biên dịch và chạy — nhưng bạn đã đưa cả app quay lại một client bundle và vứt bỏ lợi ích Server Component. Kỹ năng của chương này là giữ <code>'use client'</code> nhỏ và nằm thấp trong cây. Bài 9.5 nói đúng về điều đó.</p>
</div>

<h3>Một quy tắc ngón tay cái hữu ích</h3>
<p>Hãy hỏi: <em>mảnh này có cần nhớ điều gì, phản hồi một sự kiện người dùng, hay chạm trình duyệt không?</em> Nếu có → Client. Nếu nó chỉ fetch dữ liệu và render markup → để nguyên Server Component. Một trang hiện danh sách khoá học là Server Component; cái nút "yêu thích" nhỏ trong mỗi hàng là Client Component.</p>

<h3>Chỉ thị đó thật ra đánh dấu cái gì</h3>
<div class="lz-map">
  <div class="lz-stage">Một ranh giới, không phải một vị trí</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nó đánh dấu một điểm vào</div><div class="lz-nsub">&#96;&#39;use client&#39;&#96; ở đầu file nói &quot;từ đây trở xuống là mã phía client&quot;. Nó KHÔNG có nghĩa &quot;chỉ chạy trong trình duyệt&quot;.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Client Component vẫn render trên máy chủ</div><div class="lz-nsub">Một lần, để tạo ra HTML ban đầu. Đó là lý do &#96;window&#96; là undefined trong lượt đầu đó — hydrate diễn ra sau.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Nó được kế thừa qua import</div><div class="lz-nsub">Mọi module được import từ một file client đều gia nhập gói client. Đánh dấu một file có thể lôi theo cả trăm cái.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Nó KHÔNG kế thừa qua children</div><div class="lz-nsub">Một Server Component truyền vào làm &#96;children&#96; của một Client Component vẫn ở lại máy chủ. Đó là cửa thoát mà bài 9.3 nói tới.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tin rằng &#96;&#39;use client&#39;&#96; nghĩa là mã chỉ chạy trong trình duyệt.</strong> Không phải: một Client Component được render một lần trên máy chủ để tạo HTML ban đầu, rồi mới được hydrate trong trình duyệt. Nên một thân component đọc &#96;localStorage&#96; hay &#96;window.innerWidth&#96; ở cấp cao nhất sẽ làm sập lượt render trên máy chủ với &quot;localStorage is not defined&quot;, và lỗi hiện ra lúc build trên một trang chạy hoàn hảo khi điều hướng ở môi trường phát triển. Mã chỉ-dành-cho-trình-duyệt thuộc về bên trong một effect hoặc một handler sự kiện, cả hai đều chỉ chạy sau khi hydrate. Khi một giá trị phải biết ngay ở lần vẽ đầu, hãy đọc nó ở máy chủ hoặc chấp nhận một lượt render hai pha.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-client" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">react.dev — 'use client'</span><span class="lc-sub">Ngữ nghĩa chính xác: chỉ thị này đánh dấu cái gì, và không đánh dấu cái gì.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/client-components" target="_blank" rel="noopener">
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Client Component</span><span class="lc-sub">Toàn bộ vòng đời render, gồm cả lượt chạy trên máy chủ mà người ta hay quên.</span></span>
</a>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/client-components" target="_blank" rel="noopener">
  <span class="lc-ico">🧑‍💻</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Client Components</span><span class="lc-sub">'use client' làm gì, hydration, và khi nào bạn thật sự cần.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — The boundary: how the two compose|||9.3 — Ranh giới: hai loại ghép với nhau ra sao',
      slug: 'nextjs-9-3-ranh-gioi-ghep',
      type: 'VIDEO',
      isFreePreview: false,
      description: "'use client' là một RANH GIỚI: mọi thứ import vào file client cũng thành client. Bạn không import Server vào Client được — nhưng CÓ THỂ truyền Server làm children. Đây là mẫu quan trọng nhất chương.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>'use client' marks a boundary, not just one file</h2>
<p class="lead">Here is the rule that catches everyone: <code>'use client'</code> is not local to one component. It is a <strong>boundary</strong>. Every module a Client Component <em>imports</em> is pulled into the client bundle too. So the moment you import a component into a client file, that component becomes client as well — whether or not it has its own directive.</p>

<pre><code>'use client';
import Chart from './Chart';   <span class="tok-comment">// Chart is now a CLIENT component too,</span>
                               <span class="tok-comment">// even without its own 'use client'</span></code></pre>

<h3>You cannot import a Server Component into a Client Component</h3>
<p>A Server Component can run <code>await db...</code> and use secrets. If a Client Component could <code>import</code> it, that server-only code would be dragged into the browser bundle — impossible. So the direct import is disallowed. But there is a clean way around it.</p>

<h3>The slot pattern: pass Server Components as children</h3>
<p>A Client Component can <em>receive</em> a Server Component through <code>children</code> (or any prop), because it receives the already-rendered output, not the code. The Server Component is rendered on the server; the client wrapper just places it in a slot.</p>
<pre><code><span class="tok-comment">// Tabs.tsx — Client: holds the active-tab state</span>
'use client';
export default function Tabs({ children }) {
  const [open, setOpen] = useState(true);
  return open ? &lt;div&gt;{children}&lt;/div&gt; : null;
}

<span class="tok-comment">// page.tsx — Server: fetches, then nests a Server Component INSIDE the client Tabs</span>
export default async function Page() {
  return (
    &lt;Tabs&gt;
      &lt;ServerData /&gt;      <span class="tok-comment">// rendered on the server, passed as children</span>
    &lt;/Tabs&gt;
  );
}</code></pre>
<p>This is the composition workhorse of the App Router. Interactive shell (client) on the outside, data-heavy content (server) slotted inside. You get client behaviour <em>and</em> keep the data-fetching component off the client bundle.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Server → renders → Client</span><span class="v">A Server Component can render a Client Component directly (that is normal — a server page uses a &lt;Counter/&gt;).</span></div>
  <div class="kv"><span class="k">Client → imports → Server</span><span class="v">✗ Not allowed. The server code would end up in the browser.</span></div>
  <div class="kv"><span class="k">Client → children → Server</span><span class="v">✓ Allowed. The client receives rendered output through a slot, not the code.</span></div>
</div>

<h3>Keeping a Server Component inside a Client Component</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>A client file cannot import a server file</b> — The import would pull the server code into the bundle, so React forbids it — including the database call inside.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>But it can receive one as children</b> — &#96;&lt;Tabs&gt;&lt;ServerList /&gt;&lt;/Tabs&gt;&#96; composed in a <em>server</em> parent. The element is created on the server and passed in already rendered.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Props work the same way</b> — &#96;&lt;Modal body={&lt;ServerChart /&gt;} /&gt;&#96;. Any prop slot accepts a rendered server element, not just children.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>So the interactive shell wraps server content</b> — The tab bar is client, the panel inside is server. Neither one has to give up what it is good at.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a Client Component that only exists to add one &#96;onClick&#96;, wrapping the whole page.</strong> &#96;&#39;use client&#39;&#96; on a layout-shaped component means every child it imports is client code, so a page that was a Server Component becomes one too — the database query moves to the browser (and fails), the markdown parser ships to users, and the bundle doubles. The composition rule is the way out: keep the wrapper client, but let it render &#96;{children}&#96; and compose the server content in the <em>parent</em>. The rule of thumb is to push &#96;&#39;use client&#39;&#96; as far down the tree as it will go — usually to a single button or input.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Composition patterns</span><span class="lc-sub">The supported combinations, with the children pattern spelled out.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-components#interleaving-server-and-client-components" target="_blank" rel="noopener">
  <span class="lc-ico">🪢</span>
  <span class="lc-body"><span class="lc-title">react.dev — Interleaving server and client components</span><span class="lc-sub">Why children works when imports do not.</span></span>
</a>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Composition Patterns</span><span class="lc-sub">The boundary rules, the children/slot pattern, and where to place 'use client'.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>'use client' đánh dấu một ranh giới, không chỉ một file</h2>
<p class="lead">Đây là luật khiến ai cũng vấp: <code>'use client'</code> không chỉ cục bộ ở một component. Nó là một <strong>ranh giới</strong>. Mọi module mà một Client Component <em>import</em> đều bị kéo vào client bundle luôn. Nên ngay khi bạn import một component vào một file client, component đó cũng thành client — dù nó có chỉ thị riêng hay không.</p>

<pre><code>'use client';
import Chart from './Chart';   <span class="tok-comment">// Chart giờ cũng là component CLIENT,</span>
                               <span class="tok-comment">// dù không có 'use client' riêng</span></code></pre>

<h3>Bạn không import một Server Component vào một Client Component được</h3>
<p>Một Server Component có thể chạy <code>await db...</code> và dùng bí mật. Nếu một Client Component <code>import</code> được nó, code chỉ-server đó sẽ bị lôi vào bundle trình duyệt — không thể. Nên import trực tiếp bị cấm. Nhưng có một lối vòng gọn gàng.</p>

<h3>Mẫu khe cắm: truyền Server Component làm children</h3>
<p>Một Client Component có thể <em>nhận</em> một Server Component qua <code>children</code> (hay prop bất kỳ), vì nó nhận phần output đã render, không phải code. Server Component được render trên server; lớp bọc client chỉ đặt nó vào một khe.</p>
<pre><code><span class="tok-comment">// Tabs.tsx — Client: giữ state tab đang mở</span>
'use client';
export default function Tabs({ children }) {
  const [open, setOpen] = useState(true);
  return open ? &lt;div&gt;{children}&lt;/div&gt; : null;
}

<span class="tok-comment">// page.tsx — Server: fetch, rồi lồng một Server Component BÊN TRONG Tabs client</span>
export default async function Page() {
  return (
    &lt;Tabs&gt;
      &lt;ServerData /&gt;      <span class="tok-comment">// render trên server, truyền vào làm children</span>
    &lt;/Tabs&gt;
  );
}</code></pre>
<p>Đây là con ngựa thồ ghép nối của App Router. Vỏ tương tác (client) ở ngoài, nội dung nặng dữ liệu (server) cắm vào trong. Bạn có hành vi client <em>mà vẫn</em> giữ component fetch dữ liệu khỏi client bundle.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Server → render → Client</span><span class="v">Một Server Component render trực tiếp một Client Component được (bình thường — một trang server dùng &lt;Counter/&gt;).</span></div>
  <div class="kv"><span class="k">Client → import → Server</span><span class="v">✗ Không được. Code server sẽ lọt vào trình duyệt.</span></div>
  <div class="kv"><span class="k">Client → children → Server</span><span class="v">✓ Được. Client nhận output đã render qua một khe, không phải code.</span></div>
</div>

<h3>Giữ một Server Component bên trong một Client Component</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Một file client không import được file server</b> — Phép import sẽ lôi mã máy chủ vào gói, nên React cấm — kể cả lời gọi cơ sở dữ liệu bên trong.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nhưng nó nhận được một cái làm children</b> — &#96;&lt;Tabs&gt;&lt;ServerList /&gt;&lt;/Tabs&gt;&#96; ghép ở một phần tử cha <em>phía máy chủ</em>. Element được tạo trên máy chủ và truyền vào ở dạng đã vẽ xong.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Props cũng hoạt động y như vậy</b> — &#96;&lt;Modal body={&lt;ServerChart /&gt;} /&gt;&#96;. Ô prop nào cũng nhận được một element máy chủ đã vẽ, không riêng gì children.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nên cái vỏ tương tác bọc quanh nội dung máy chủ</b> — Thanh tab là client, khung bên trong là máy chủ. Chẳng bên nào phải từ bỏ thứ mình giỏi.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một Client Component chỉ tồn tại để thêm một &#96;onClick&#96;, mà lại bọc cả trang.</strong> &#96;&#39;use client&#39;&#96; đặt lên một component có dáng layout nghĩa là mọi đứa con nó import đều thành mã client, nên một trang vốn là Server Component cũng thành client theo — truy vấn cơ sở dữ liệu dời sang trình duyệt (và hỏng), bộ phân tích markdown ship tới người dùng, và gói phình gấp đôi. Luật ghép chính là đường thoát: giữ cái vỏ ở phía client, nhưng để nó vẽ &#96;{children}&#96; và ghép nội dung máy chủ ở phần tử <em>cha</em>. Quy tắc ngón tay cái là đẩy &#96;&#39;use client&#39;&#96; xuống thấp nhất có thể trong cây — thường là xuống tới đúng một cái nút hoặc một ô nhập.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Các mẫu ghép</span><span class="lc-sub">Những tổ hợp được hỗ trợ, có nói rõ mẫu dùng children.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-components#interleaving-server-and-client-components" target="_blank" rel="noopener">
  <span class="lc-ico">🪢</span>
  <span class="lc-body"><span class="lc-title">react.dev — Đan xen component máy chủ và client</span><span class="lc-sub">Vì sao children thì được mà import thì không.</span></span>
</a>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Composition Patterns</span><span class="lc-sub">Luật ranh giới, mẫu children/khe cắm, và đặt 'use client' ở đâu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Crossing the boundary: serializable props|||9.4 — Qua ranh giới: props phải serialize được',
      slug: 'nextjs-9-4-props-serialize',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Props từ Server sang Client phải đi qua mạng nên phải serialize được: chuỗi, số, mảng, object thường thì ổn; hàm và instance class thì KHÔNG. Lỗi thật và cách tránh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Props from server to client must survive a trip over the wire</h2>
<p class="lead">When a Server Component renders a Client Component and passes props, those props are serialized on the server and sent to the browser to hydrate the client side. Anything that cannot be turned into data cannot cross that boundary.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Crosses fine</span><span class="v">Strings, numbers, booleans, null, arrays, and plain objects of those. Dates and other JSON-friendly values. This covers the vast majority of props.</span></div>
  <div class="kv"><span class="k">Cannot cross</span><span class="v">Functions (a callback prop), class instances, things with methods, Symbols. They have behaviour, not just data — behaviour does not serialize.</span></div>
</div>

<pre><code><span class="tok-comment">// Server Component</span>
&lt;LikeButton postId={post.id} count={post.likes} /&gt;   <span class="tok-comment">// ✓ number + number</span>

&lt;LikeButton onLike={() =&gt; save()} /&gt;   <span class="tok-comment">// ✗ Error: cannot pass a function</span>
<span class="tok-comment">//   "Functions cannot be passed directly to Client Components..."</span></code></pre>

<h3>The fix for "I need a function"</h3>
<p>Two clean options, depending on what the function does:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Define the handler in the Client Component itself.</b> Pass it the plain data it needs (the <code>postId</code>), and let the client component own the <code>onClick</code>. Event handlers belong on the client anyway.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>If the function must run on the server</b> (write to the DB), make it a <em>Server Action</em> — a special server function you <em>can</em> pass across the boundary. That is Chapter 12.</div></div>
</div>

<div class="pitfall">
<p><strong>The tell:</strong> a build/runtime error like "Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with 'use server'", or "Only plain objects can be passed." It almost always means a Server Component tried to hand a callback (or a class instance from an ORM) to a Client Component. Pass the raw fields it needs instead, and move the behaviour to whichever side owns it.</p>
</div>

<div class="callout ok">
<p><strong>A subtle one:</strong> ORM results are often class instances, not plain objects. Passing a whole Prisma model straight into a Client Component can trip the "only plain objects" rule. Pick the fields you need (<code>{ id, title, likes }</code>) or map to a plain object before crossing.</p>
</div>

<h3>What can cross the server-client boundary</h3>
<div class="lz-map">
  <div class="lz-stage">It has to survive being turned into data</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Primitives, arrays, plain objects</div><div class="lz-nsub">Strings, numbers, booleans, null, and anything built from them. Dates and Maps work too — React's serialiser handles them.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Server Actions</div><div class="lz-nsub">A function marked &#96;&#39;use server&#39;&#96; can be passed down. React sends a reference, not the code, and calling it makes a request.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">JSX elements</div><div class="lz-nsub">Already-rendered server output, passed as children or as a prop. This is what makes composition work.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Not: ordinary functions, class instances, symbols</div><div class="lz-nsub">There is no way to send a closure over the wire. React throws a build-time error naming the prop.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — passing a Prisma model straight from a Server Component to a Client Component.</strong> &#96;&lt;Editor note={note} /&gt;&#96; where &#96;note&#96; came from &#96;prisma.note.findUnique()&#96; usually works, and then one day it does not: a &#96;Decimal&#96; column, a &#96;BigInt&#96; id or a Prisma-specific wrapper is a class instance, and React refuses it with &quot;Only plain objects can be passed to Client Components&quot;. Worse, when it does serialise, you have shipped every column to the browser — including the ones your query selected but the UI never shows. Map to an explicit shape at the boundary: pick the fields the component needs and convert the odd types yourself.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-client#serializable-types" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">react.dev — Serializable types</span><span class="lc-sub">The exact list of what crosses the boundary, and what throws.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-props-from-server-to-client-components-serialization" target="_blank" rel="noopener">
  <span class="lc-ico">🚧</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Serialization at the boundary</span><span class="lc-sub">The Next.js-specific notes, including the Prisma and Date cases.</span></span>
</a>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-props-from-server-to-client-components-serialization" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Passing props (serialization)</span><span class="lc-sub">Exactly what can and cannot cross the server→client boundary.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Props từ server sang client phải sống sót qua đường truyền</h2>
<p class="lead">Khi một Server Component render một Client Component và truyền props, những props đó được serialize trên server và gửi xuống trình duyệt để hydrate phía client. Thứ gì không biến thành dữ liệu được thì không qua ranh giới được.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Qua được ngon</span><span class="v">Chuỗi, số, boolean, null, mảng, và object thường của những thứ đó. Date và các giá trị thân thiện JSON. Cái này phủ tuyệt đại đa số props.</span></div>
  <div class="kv"><span class="k">Không qua được</span><span class="v">Hàm (một prop callback), instance class, thứ có method, Symbol. Chúng mang hành vi, không chỉ dữ liệu — hành vi không serialize được.</span></div>
</div>

<pre><code><span class="tok-comment">// Server Component</span>
&lt;LikeButton postId={post.id} count={post.likes} /&gt;   <span class="tok-comment">// ✓ số + số</span>

&lt;LikeButton onLike={() =&gt; save()} /&gt;   <span class="tok-comment">// ✗ Lỗi: không truyền hàm được</span>
<span class="tok-comment">//   "Functions cannot be passed directly to Client Components..."</span></code></pre>

<h3>Cách chữa cho "tôi cần một hàm"</h3>
<p>Hai lựa chọn gọn, tuỳ hàm làm gì:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Định nghĩa handler ngay trong Client Component.</b> Truyền cho nó dữ liệu thuần nó cần (cái <code>postId</code>), và để component client sở hữu <code>onClick</code>. Handler sự kiện dù sao cũng thuộc về client.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nếu hàm phải chạy trên server</b> (ghi vào DB), hãy làm nó thành một <em>Server Action</em> — một hàm server đặc biệt mà bạn <em>có thể</em> truyền qua ranh giới. Đó là Chương 12.</div></div>
</div>

<div class="pitfall">
<p><strong>Dấu hiệu:</strong> một lỗi build/runtime kiểu "Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with 'use server'", hoặc "Only plain objects can be passed." Nó gần như luôn nghĩa là một Server Component đã cố trao một callback (hay một instance class từ ORM) cho một Client Component. Hãy truyền các trường thô nó cần thay vì thế, và chuyển hành vi về phía nào sở hữu nó.</p>
</div>

<div class="callout ok">
<p><strong>Một cái tinh tế:</strong> kết quả ORM thường là instance class, không phải object thường. Truyền cả một model Prisma thẳng vào một Client Component có thể vấp luật "only plain objects". Hãy chọn các trường bạn cần (<code>{ id, title, likes }</code>) hoặc map sang object thường trước khi qua ranh giới.</p>
</div>

<h3>Cái gì đi qua được ranh giới máy chủ – client</h3>
<div class="lz-map">
  <div class="lz-stage">Nó phải sống sót khi bị biến thành dữ liệu</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Giá trị nguyên thuỷ, mảng, object thuần</div><div class="lz-nsub">Chuỗi, số, boolean, null, và mọi thứ dựng từ chúng. Date và Map cũng được — bộ tuần tự hoá của React xử lý chúng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Server Action</div><div class="lz-nsub">Một hàm đánh dấu &#96;&#39;use server&#39;&#96; truyền xuống được. React gửi một tham chiếu chứ không gửi mã, và gọi nó là tạo ra một request.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Element JSX</div><div class="lz-nsub">Đầu ra máy chủ đã vẽ sẵn, truyền vào làm children hoặc làm prop. Chính nó làm phép ghép chạy được.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Không được: hàm thường, thực thể class, symbol</div><div class="lz-nsub">Không có cách nào gửi một closure qua đường truyền. React ném ra một lỗi lúc build có gọi tên cái prop.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — truyền thẳng một model Prisma từ Server Component sang Client Component.</strong> &#96;&lt;Editor note={note} /&gt;&#96; với &#96;note&#96; lấy từ &#96;prisma.note.findUnique()&#96; thường thì chạy được, rồi một ngày nó không: một cột &#96;Decimal&#96;, một id &#96;BigInt&#96; hay một lớp bọc riêng của Prisma đều là thực thể class, và React từ chối với &quot;Only plain objects can be passed to Client Components&quot;. Tệ hơn, khi nó tuần tự hoá được thì bạn đã ship mọi cột sang trình duyệt — kể cả những cột truy vấn có chọn mà giao diện chẳng bao giờ hiện. Hãy ánh xạ sang một dáng tường minh ngay tại ranh giới: chọn đúng những field component cần và tự tay chuyển đổi các kiểu lạ.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-client#serializable-types" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">react.dev — Các kiểu tuần tự hoá được</span><span class="lc-sub">Danh sách chính xác cái gì qua được ranh giới, và cái gì thì ném lỗi.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-props-from-server-to-client-components-serialization" target="_blank" rel="noopener">
  <span class="lc-ico">🚧</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Tuần tự hoá ở ranh giới</span><span class="lc-sub">Những ghi chú riêng của Next.js, gồm cả ca Prisma và Date.</span></span>
</a>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-props-from-server-to-client-components-serialization" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Truyền props (serialization)</span><span class="lc-sub">Chính xác cái gì qua và không qua được ranh giới server→client.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Where to put the boundary in practice|||9.5 — Đặt ranh giới ở đâu trong thực tế',
      slug: 'nextjs-9-5-dat-ranh-gioi',
      type: 'VIDEO',
      isFreePreview: false,
      description: "Chiến lược thật: giữ page là Server Component fetch dữ liệu, đẩy 'use client' xuống các lá tương tác. Kèm sự cố thật của cuongthai.com khi hydration/isHydrated không lật true làm trang treo mãi 'Đang tải…'.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Push the client boundary down to the leaves</h2>
<p class="lead">The whole game is: keep as much as possible on the server, and make only the genuinely interactive bits client. The pattern that achieves this is simple and worth memorising — a Server Component page that fetches, rendering small Client Component leaves for the interactive parts.</p>

<pre><code><span class="tok-comment">// app/feed/page.tsx — SERVER: fetches, renders markup</span>
export default async function FeedPage() {
  const posts = await getPosts();
  return (
    &lt;section&gt;
      {posts.map(p =&gt; (
        &lt;article key={p.id}&gt;
          &lt;h2&gt;{p.title}&lt;/h2&gt;
          &lt;p&gt;{p.body}&lt;/p&gt;
          &lt;LikeButton postId={p.id} count={p.likes} /&gt;   <span class="tok-comment">// tiny CLIENT leaf</span>
        &lt;/article&gt;
      ))}
    &lt;/section&gt;
  );
}</code></pre>
<p>The page — the big, data-heavy part — ships no JavaScript. Only <code>LikeButton</code>, a few lines, is a Client Component. That is the ideal shape: a server trunk with small client leaves, not a client trunk with everything inside.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Do</span><span class="v">Fetch in Server Components. Make individual interactive widgets client. Pass plain data down as props.</span></div>
  <div class="kv"><span class="k">Avoid</span><span class="v">One <code>'use client'</code> at the top of a page "so hooks work" — it turns the whole page and its imports into client code.</span></div>
</div>

<h3>Hydration: the seam where server and client meet</h3>
<p>A Client Component is rendered to HTML on the server, then <em>hydrated</em> — React attaches to that HTML in the browser and makes it interactive. For hydration to succeed, the first client render must match the server HTML. When it does not, you get a hydration mismatch; when a component gates its whole UI on some "am I ready?" flag, you can get a page that renders <em>nothing</em>.</p>

<div class="note-ct">
<p><strong>A real cuongthai.com outage of this exact kind:</strong> a page gated its entire render on an auth store's <code>isHydrated</code> flag — "show the app only once hydrated." But that flag could <em>never flip to true</em> in some conditions, so the page sat forever on "Đang tải…" (Loading…) with no error in the console. The fix was to stop trusting that single flag: track a local <code>mounted</code> state and read the persisted auth directly, so the UI reveals even if the store's own hydration signal never fires. Lesson: a client component that hides everything behind one boolean will show a blank/spinner forever the day that boolean is wrong — give it a fallback path.</p>
</div>

<div class="callout warn">
<p><strong>Rule of thumb for the boundary:</strong> if you find yourself adding <code>'use client'</code> to a page or layout, stop and ask whether only a child needs it. Ninety percent of the time you can lift the interactive part into its own small client component and keep the page on the server.</p>
</div>

<h3>Deciding where the boundary goes</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Start with everything on the server</b> — That is the default, and it is the cheapest option for the user. Only move things out when something forces you.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Find what actually needs the browser</b> — State that changes on interaction, an event handler, a browser API, a library that touches the DOM. Nothing else qualifies.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Mark the smallest component that needs it</b> — A like button, a search input, a tab bar — not the page and not the layout that contains them.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Then check the bundle</b> — &#96;next build&#96; prints the First Load JS per route. If a route grew, something crossed the boundary that did not have to.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a boundary drawn by file, not by responsibility.</strong> It is tempting to make one &#96;components/ui&#96; folder client because half of it needs interactivity. Every import from it then joins the bundle, including the purely presentational card and badge that could have stayed on the server — and because the directive is at the top of each file, nothing in the code shows what it cost. The measurable check is in the build output: compare First Load JS before and after a change. A route that gains 60kB from a one-line directive is telling you the boundary is in the wrong place, and the fix is usually to split one file into two.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#moving-client-components-down-the-tree" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Moving Client Components down the tree</span><span class="lc-sub">The official recommendation, with a before-and-after example.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/next-config-js/bundlePagesRouterDependencies" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Analysing the bundle</span><span class="lc-sub">How to see what is actually in each route's JavaScript, rather than guessing.</span></span>
</a>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#moving-client-components-down-the-tree" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Move Client Components down the tree</span><span class="lc-sub">The official advice: keep the boundary at the leaves.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content" target="_blank" rel="noopener">
  <span class="lc-ico">💧</span>
  <span class="lc-body"><span class="lc-title">react.dev — Hydration mismatches</span><span class="lc-sub">Why server and client HTML must match, and how mismatches surface.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Đẩy ranh giới client xuống các lá</h2>
<p class="lead">Cả cuộc chơi là: giữ càng nhiều càng tốt trên server, và chỉ làm client những mảnh thật sự tương tác. Mẫu đạt được điều đó rất đơn giản và đáng thuộc lòng — một trang Server Component fetch dữ liệu, render các lá Client Component nhỏ cho phần tương tác.</p>

<pre><code><span class="tok-comment">// app/feed/page.tsx — SERVER: fetch, render markup</span>
export default async function FeedPage() {
  const posts = await getPosts();
  return (
    &lt;section&gt;
      {posts.map(p =&gt; (
        &lt;article key={p.id}&gt;
          &lt;h2&gt;{p.title}&lt;/h2&gt;
          &lt;p&gt;{p.body}&lt;/p&gt;
          &lt;LikeButton postId={p.id} count={p.likes} /&gt;   <span class="tok-comment">// lá CLIENT nhỏ xíu</span>
        &lt;/article&gt;
      ))}
    &lt;/section&gt;
  );
}</code></pre>
<p>Cái page — phần to, nặng dữ liệu — không xuống JavaScript nào. Chỉ <code>LikeButton</code>, vài dòng, là Client Component. Đó là hình dạng lý tưởng: một thân server với các lá client nhỏ, không phải một thân client với mọi thứ bên trong.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Nên</span><span class="v">Fetch trong Server Component. Làm từng widget tương tác thành client. Truyền dữ liệu thuần xuống làm props.</span></div>
  <div class="kv"><span class="k">Tránh</span><span class="v">Một <code>'use client'</code> ở đầu trang "cho hook chạy" — nó biến cả trang và các import của nó thành code client.</span></div>
</div>

<h3>Hydration: đường nối nơi server và client gặp nhau</h3>
<p>Một Client Component được render ra HTML trên server, rồi được <em>hydrate</em> — React gắn vào HTML đó trong trình duyệt và làm nó tương tác được. Để hydrate thành công, lần render client đầu phải khớp với HTML từ server. Khi không khớp, bạn gặp hydration mismatch; khi một component chặn cả UI của nó sau một cờ "tôi sẵn sàng chưa?", bạn có thể ra một trang chẳng render <em>gì cả</em>.</p>

<div class="note-ct">
<p><strong>Một sự cố thật đúng kiểu này của cuongthai.com:</strong> một trang chặn toàn bộ render sau cờ <code>isHydrated</code> của một auth store — "chỉ hiện app khi đã hydrate." Nhưng cờ đó có thể <em>không bao giờ lật true</em> trong vài điều kiện, nên trang ngồi mãi ở "Đang tải…" mà không lỗi nào trong console. Cách sửa là thôi tin vào một cờ đó: theo dõi một state <code>mounted</code> cục bộ và đọc thẳng auth đã lưu, để UI hiện ra dù tín hiệu hydration của store không bao giờ bắn. Bài học: một component client giấu mọi thứ sau một boolean sẽ hiện trắng/spinner mãi mãi vào ngày boolean đó sai — hãy cho nó một đường thoát dự phòng.</p>
</div>

<div class="callout warn">
<p><strong>Quy tắc ngón tay cái cho ranh giới:</strong> nếu bạn thấy mình thêm <code>'use client'</code> vào một page hay layout, dừng lại và hỏi liệu chỉ một đứa con cần nó. Chín phần mười lần bạn có thể nhấc phần tương tác ra thành một component client nhỏ riêng và giữ trang trên server.</p>
</div>

<h3>Quyết định đặt ranh giới ở đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Hãy bắt đầu với mọi thứ ở phía máy chủ</b> — Đó là mặc định, và là lựa chọn rẻ nhất cho người dùng. Chỉ dời thứ gì ra khi có cái gì đó buộc bạn phải làm thế.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Tìm ra thứ thật sự cần trình duyệt</b> — State thay đổi khi tương tác, một handler sự kiện, một API của trình duyệt, một thư viện có chạm vào DOM. Ngoài ra không có gì đủ tiêu chuẩn.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Đánh dấu component NHỎ NHẤT cần nó</b> — Một nút thích, một ô tìm kiếm, một thanh tab — chứ không phải cả trang và không phải cái layout chứa chúng.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Rồi kiểm lại cái gói</b> — &#96;next build&#96; in ra First Load JS của từng route. Nếu một route phình lên thì có thứ gì đó đã vượt ranh giới mà lẽ ra không cần.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một ranh giới vạch theo file, chứ không vạch theo trách nhiệm.</strong> Rất dễ bị cám dỗ đánh dấu cả một thư mục &#96;components/ui&#96; là client vì một nửa trong đó cần tương tác. Từ đó mọi phép import từ nó đều gia nhập gói, kể cả cái thẻ và cái nhãn thuần trang trí lẽ ra ở lại máy chủ được — và vì chỉ thị nằm ở đầu mỗi file, chẳng có gì trong mã cho thấy nó tốn bao nhiêu. Phép kiểm đo được nằm ở đầu ra của build: hãy so First Load JS trước và sau một thay đổi. Một route phình thêm 60kB chỉ vì một dòng chỉ thị đang nói với bạn rằng ranh giới đặt sai chỗ, và cách chữa thường là tách một file thành hai.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#moving-client-components-down-the-tree" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Đẩy Client Component xuống thấp trong cây</span><span class="lc-sub">Khuyến nghị chính thức, kèm ví dụ trước-và-sau.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/next-config-js/bundlePagesRouterDependencies" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Phân tích gói</span><span class="lc-sub">Cách nhìn thấy thật sự có gì trong JavaScript của từng route, thay vì đoán.</span></span>
</a>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#moving-client-components-down-the-tree" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Đẩy Client Component xuống thấp trong cây</span><span class="lc-sub">Lời khuyên chính thức: giữ ranh giới ở các lá.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content" target="_blank" rel="noopener">
  <span class="lc-ico">💧</span>
  <span class="lc-body"><span class="lc-title">react.dev — Hydration mismatch</span><span class="lc-sub">Vì sao HTML server và client phải khớp, và mismatch lộ ra sao.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.6 QUIZ ─────────────────────────── */
    {
      title: '9.6 — Chapter 9 quiz|||9.6 — Kiểm tra chương 9',
      slug: 'nextjs-9-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về Server vs Client Component: mặc định, use client, việc nào ở đâu, ranh giới và mẫu children, props serialize, đặt ranh giới ở đâu và bẫy hydration.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 9: the Server-Component default, 'use client', which side does what, the boundary and the children pattern, serializable props, and where to place the boundary.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 9: mặc định Server Component, 'use client', bên nào làm gì, ranh giới và mẫu children, props serialize, và đặt ranh giới ở đâu.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'In the App Router, a component with no directive is…|||Trong App Router, một component không có chỉ thị là…',
            options: [
              'a Client Component by default|||một Client Component theo mặc định',
              'a Server Component by default|||một Server Component theo mặc định',
              'neither until you choose|||không cái nào cho tới khi bạn chọn',
              'both at the same time|||cả hai cùng lúc',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'How much of a Server Component\'s own JavaScript ships to the browser?|||Bao nhiêu JavaScript của riêng một Server Component xuống trình duyệt?',
            options: [
              'All of it, like normal React|||Tất cả, như React thường',
              'None — it renders to HTML on the server|||Không gì — nó render ra HTML trên server',
              'Only the imports|||Chỉ các import',
              'Half, the rest is lazy-loaded|||Một nửa, phần còn lại lazy-load',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which can ONLY be done in a Client Component?|||Cái nào CHỈ làm được trong một Client Component?',
            options: [
              'await a database query in the body|||await một truy vấn DB trong thân',
              'useState, onClick, and reading window/localStorage|||useState, onClick, và đọc window/localStorage',
              'use a secret API key|||dùng một khoá API bí mật',
              'render JSX|||render JSX',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: "Where must 'use client' appear?|||'use client' phải xuất hiện ở đâu?",
            options: [
              'anywhere in the file|||chỗ nào trong file cũng được',
              'as the very first line, before imports|||là dòng đầu tiên, trước các import',
              'inside the component function|||bên trong hàm component',
              'in next.config.js|||trong next.config.js',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: "If a file has 'use client' and imports Chart.tsx, what is Chart?|||Nếu một file có 'use client' và import Chart.tsx, Chart là gì?",
            options: [
              'still a Server Component|||vẫn là Server Component',
              'a Client Component too — the boundary pulls imports client|||cũng là Client Component — ranh giới kéo import thành client',
              'an error|||một lỗi',
              'rendered on the server only|||chỉ render trên server',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You want an interactive wrapper around a data-fetching Server Component. The clean way?|||Bạn muốn một lớp bọc tương tác quanh một Server Component fetch dữ liệu. Cách gọn?',
            options: [
              'import the Server Component into the Client Component|||import Server Component vào Client Component',
              'pass the Server Component as children into the Client Component|||truyền Server Component làm children vào Client Component',
              "add 'use client' to the Server Component|||thêm 'use client' vào Server Component",
              'it is impossible|||không thể làm được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why can a Client Component receive a Server Component via children but not import it?|||Vì sao một Client Component nhận được một Server Component qua children nhưng không import được?',
            options: [
              'children are faster|||children nhanh hơn',
              'via children it receives rendered output, not the server-only code|||qua children nó nhận output đã render, không phải code chỉ-server',
              'imports are disabled in Next.js|||import bị tắt trong Next.js',
              'there is no real difference|||không có khác biệt thật',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which prop from a Server Component to a Client Component causes an error?|||Prop nào từ Server Component sang Client Component gây lỗi?',
            options: [
              'count={5}|||count={5}',
              'title="Hi"|||title="Hi"',
              'onLike={() => save()} (a function)|||onLike={() => save()} (một hàm)',
              'items={[1,2,3]}|||items={[1,2,3]}',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'What is the recommended shape for a data-heavy, partly-interactive page?|||Hình dạng khuyến nghị cho một trang nặng dữ liệu, tương tác một phần là gì?',
            options: [
              "put 'use client' on the page so everything is client|||đặt 'use client' lên trang để mọi thứ là client",
              'a Server Component page that fetches, with small Client Component leaves|||một trang Server Component fetch dữ liệu, với các lá Client Component nhỏ',
              'two separate pages, one server one client|||hai trang riêng, một server một client',
              'fetch everything in useEffect|||fetch mọi thứ trong useEffect',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A page gated entirely on a client "isHydrated" flag that never flips true will…|||Một trang chặn hoàn toàn sau một cờ client "isHydrated" không bao giờ lật true sẽ…',
            options: [
              'render normally|||render bình thường',
              'sit forever on a loading state with no error — give it a fallback path|||ngồi mãi ở trạng thái tải mà không lỗi — hãy cho nó đường thoát dự phòng',
              'throw a compile error|||ném lỗi biên dịch',
              'reload the browser repeatedly|||tải lại trình duyệt liên tục',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
