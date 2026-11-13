/**
 * Next.js & React — Chương 9: Server Component vs Client Component.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Chương thuần khái niệm/ranh giới render — không có "output console" để chạy.
 * Mọi hành vi (RSC mặc định, 'use client' là ranh giới, props phải serialize) là
 * quy ước CHÍNH THỨC của React Server Components + Next.js App Router. Sự cố thật
 * của cuongthai.com (isHydrated không lật true) lấy từ lịch sử vá lỗi của site.
 */

import G09_1 from './giang/nxj-09-1.mjs';
import G09_2 from './giang/nxj-09-2.mjs';
import G09_3 from './giang/nxj-09-3.mjs';
import G09_4 from './giang/nxj-09-4.mjs';
import G09_5 from './giang/nxj-09-5.mjs';
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
${G09_1}
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
<pre><code class="language-typescript"><span class="tok-comment">// app/courses/page.tsx — a Server Component (no 'use client')</span>
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
  <div class="kv"><span class="k">Secrets stay secret</span><span class="v">API keys and DB credentials live in server code the browser never sees. (Contrast the <code>NEXT_PUBLIC_</code> trap in lesson 20.2.)</span></div>
</div>

<h3>The catch: no interactivity here</h3>
<p>Because a Server Component runs once on the server and its code is gone by the time the page is in the browser, it <strong>cannot</strong> use <code>useState</code>, <code>useEffect</code>, event handlers like <code>onClick</code>, or any browser API. There is no live component in the browser to hold state or respond to clicks. Everything you learned in Chapters 3–7 — state, effects, events — needs a <em>Client</em> Component. That is the next lesson.</p>

<h3>What a Server Component can and cannot do</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It runs on the server, once, before the response</b> — Never in the browser. Its code is not in the JavaScript bundle at all — a large date library used only here costs the user nothing.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It can await directly</b> — <code>const rows = await db.note.findMany()</code>. No effect, no loading state, no waterfall — the component <em>is</em> the data fetch.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It can hold secrets</b> — An API key or a database URL read here never reaches the client, because the component&#39;s source never does.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>It cannot use state, effects or browser APIs</b> — No <code>useState</code>, no <code>onClick</code>, no <code>window</code>. There is no browser and no second render to hold anything.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — adding <code>&#39;use client&#39;</code> to a page just to fix one error, and shipping the whole subtree to the browser.</strong> The directive is contagious downward: everything the file imports becomes part of the client bundle too. So marking a page because one button needs <code>onClick</code> drags the entire tree — the markdown renderer, the date library, the chart — into the browser, and the database call inside it now fails to compile at all. The bundle grows by hundreds of kilobytes and nothing warns you. Push the boundary down instead: keep the page on the server and extract the interactive part into its own small Client Component.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Server Components</span><span class="lc-sub">The model itself, independent of any framework.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Components</span><span class="lc-sub">How Next.js implements it, with the full list of what is and is not allowed.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write a component in <code>app/</code> that reads data and renders it, and confirm (via <code>console.log</code>) that it logs on the server, not in the browser.</li>
<li>Try to use <code>useState</code> in it and read the error that tells you to add <code>'use client'</code>.</li>
<li>List two things a Server Component can do that a Client Component cannot (await data directly, read secrets).</li>
</ol>
<p><strong>Done when:</strong> you can recognise a Server Component by default and know what it may and may not do.</p></div>

<h3>🔬 Measured: where it runs, what reaches the browser (Next.js 16.4.6)</h3>
<p>A real async Server Component: it reads a JSON file with <code>fs</code>, reads a secret env var and formats Markdown with the <code>marked</code> library. <code>force-dynamic</code> makes it render on every request so each render shows up in the log:</p>
<pre><code class="language-tsx">import { readFile } from 'node:fs/promises';
import { marked } from 'marked';

export const dynamic = 'force-dynamic'; <span class="tok-comment">  // render lại MỖI request (Chương 17) — để thấy log mỗi lần gọi</span>

type KhoaHoc = { id: number; ten: string; moTa: string };

export default async function KhoaHocPage() {
  const raw = await readFile(process.cwd() + '/src/data/khoa-hoc.json', 'utf8'); <span class="tok-comment">  // đọc thẳng tệp trên máy chủ</span>
  const ds: KhoaHoc[] = JSON.parse(raw);
  const khoa = process.env.KHOA_BI_MAT ?? '';                                      <span class="tok-comment">  // biến bí mật: chỉ máy chủ thấy</span>
  console.log('[khoa-hoc] render trên máy chủ ·', ds.length, 'khoá · bí mật dài', khoa.length, '· dau-van-tay-ma-91');
  return (
    &lt;ul id="ds" className="list-disc p-4 pl-8 font-sans"&gt;
      {ds.map((k) =&gt; (
        &lt;li key={k.id} dangerouslySetInnerHTML={{ __html: marked.parseInline(&#96;**\${k.ten}** — \${k.moTa}&#96;) as string }} /&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>
<p><code>next start</code>, 3 × <code>curl</code> + 2 × Chromium. The server terminal got one line per render; the browser console got <b>0</b> messages:</p>
<div class="out">[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91
[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91
[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91
[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91
[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91</div>
<p>What reaches the browser? Grep the build: a string that exists only in the component's code, the <code>marked</code> library, the secret value:</p>
<div class="out">.next/static (gửi trình duyệt): 0
.next/server (chỉ máy chủ): 2
thư viện marked trong .next/static: 0
giá trị KHOA_BI_MAT trong .next: 0</div>
<p>JavaScript downloaded by Chromium: <b>457,070 B</b> for <code>/khoa-hoc</code> — exactly the same as an empty page (<b>457,070 B</b>, React + the Next.js runtime). Using <code>marked</code> on the server cost the user 0 bytes.</p>
<p><b>The nuance the lesson above skips:</b> the component's <i>code</i> never ships, but its <i>result</i> travels twice — as HTML, and as the <b>RSC payload</b> (the rendered tree as data, inlined in the HTML for React in the browser). Nothing of the code is in there:</p>
<pre><code class="language-javascript"><span class="tok-comment">// rsc.mjs &lt;url&gt; [regex] — tải HTML, tách RSC payload (các mẩu self.__next_f.push) và in số byte + những dòng payload khớp regex</span>
const [url, re = '.'] = process.argv.slice(2);
const html = await (await fetch(url)).text();
const payload = [...html.matchAll(/self\\.__next_f\\.push\\((\\[.*?\\])\\)&lt;\\/script&gt;/g)].map((m) =&gt; JSON.parse(m[1])[1] ?? '').join('');
console.log(&#96;HTML \${html.length} byte · trong đó RSC payload \${payload.length} byte&#96;);
for (const l of payload.split('\\n')) if (new RegExp(re).test(l)) console.log(l.length &gt; 260 ? l.slice(0, 260) + '…' : l);</code></pre>
<div class="out">HTML 7282 byte · trong đó RSC payload 4642 byte
8:["$","ul",null,{"id":"ds","className":"list-disc p-4 pl-8 font-sans","children":[["$","li","1",{"dangerouslySetInnerHTML":{"__html":"&lt;strong&gt;React&lt;/strong&gt; — component, &lt;em&gt;props&lt;/em&gt;, state"}}],["$","li","2",{"dangerouslySetInnerHTML":{"__html":"&lt;strong&gt;Nex…
0</div>
<p>With JavaScript turned off, the list is still on the page — it is already in the HTML.</p>
<p><b>The price, as real errors.</b> An <code>onClick</code> in a Server Component makes <code>next build</code> fail while prerendering; <code>useState</code> fails even earlier, at compile time:</p>
<div class="out">Error: Event handlers cannot be passed to Client Component props.
  {onClick: function onClick, children: ...}
If you need interactivity, consider converting part of this to a Client Component.
Error: You're importing a module that depends on &#96;useState&#96; into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the &#96;"use client"&#96; directive.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm i marked
npm run build &amp;&amp; npx next start -p 3000
curl -s localhost:3000/khoa-hoc &gt; /dev/null <span class="tok-comment">  # a log line appears in THIS terminal</span>
grep -rl "&lt;a string from your component&gt;" .next/static | wc -l <span class="tok-comment">  # 0</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-12-4-compiler-rsc" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 12.4 — React Compiler for the whole app, and Server Components as a concept</span><span class="lc-sub">The React-level model; here is how Next.js uses it</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-11-1-fetch-async" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 11.1 — fetch, promises & async/await</span><span class="lc-sub">A SPA fetches in the browser — compare with await on the server</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-1-path-fs" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.1 — path and fs</span><span class="lc-sub">the readFile this Server Component just used</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Server Component</span><span class="v">Default in <code>app/</code>; runs on the server, ships no JS.</span></div>
  <div class="kv"><span class="k">No hooks/state</span><span class="v">Server Components cannot use <code>useState</code>/<code>useEffect</code>.</span></div>
  <div class="kv"><span class="k">Direct data access</span><span class="v">They can <code>await</code> data and read server secrets.</span></div>
  <div class="kv"><span class="k">Zero client JS</span><span class="v">Their code never reaches the browser bundle.</span></div>
  <div class="kv"><span class="k">RSC</span><span class="v">React Server Components — the model under the App Router.</span></div>
  <div class="kv"><span class="k">Async component</span><span class="v">A Server Component can be an <code>async function</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>In the App Router, components are Server Components by default — they run on the server and ship no JavaScript.</li><li>They can <code>await</code> data and read server secrets directly, but cannot use state, effects or browser APIs.</li><li>This keeps the client bundle small and keeps data access on the server.</li><li>You opt a component into the browser with <code>'use client'</code> (next lesson).</li></ul>

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
<pre><code class="language-typescript"><span class="tok-comment">// app/courses/page.tsx — một Server Component (không 'use client')</span>
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
  <div class="kv"><span class="k">Bí mật vẫn bí mật</span><span class="v">Khoá API và thông tin DB nằm trong code server mà trình duyệt không thấy. (Đối chiếu bẫy <code>NEXT_PUBLIC_</code> ở bài 20.2.)</span></div>
</div>

<h3>Cái giá: không có tương tác ở đây</h3>
<p>Vì một Server Component chạy một lần trên server và code của nó đã biến mất khi trang tới trình duyệt, nó <strong>không thể</strong> dùng <code>useState</code>, <code>useEffect</code>, các handler như <code>onClick</code>, hay bất kỳ API trình duyệt nào. Không có component sống nào trong trình duyệt để giữ state hay phản hồi cú click. Mọi thứ bạn học ở Chương 3–7 — state, effect, sự kiện — cần một Client Component. Đó là bài sau.</p>

<h3>Một Server Component làm được gì và không làm được gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó chạy trên máy chủ, một lần, trước khi phản hồi đi</b> — Không bao giờ chạy trong trình duyệt. Mã của nó hoàn toàn không nằm trong gói JavaScript — một thư viện ngày tháng nặng chỉ dùng ở đây chẳng tốn gì của người dùng.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó await thẳng được</b> — <code>const rows = await db.note.findMany()</code>. Không effect, không trạng thái đang tải, không thác nước — component <em>chính là</em> phép lấy dữ liệu.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó giữ được bí mật</b> — Một khoá API hay một URL cơ sở dữ liệu đọc ở đây chẳng bao giờ tới được client, vì mã nguồn của component cũng không bao giờ tới đó.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nó không dùng được state, effect hay API trình duyệt</b> — Không <code>useState</code>, không <code>onClick</code>, không <code>window</code>. Chẳng có trình duyệt nào và cũng chẳng có lần render thứ hai nào để giữ thứ gì.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — thêm <code>&#39;use client&#39;</code> vào một trang chỉ để dập một lỗi, và đẩy nguyên cả cây con sang trình duyệt.</strong> Chỉ thị này lây xuống dưới: mọi thứ file đó import cũng trở thành một phần của gói client. Nên đánh dấu cả một trang chỉ vì một cái nút cần <code>onClick</code> sẽ lôi cả cái cây — bộ vẽ markdown, thư viện ngày tháng, cái biểu đồ — vào trình duyệt, và lời gọi cơ sở dữ liệu bên trong nó giờ không biên dịch nổi nữa. Gói phình thêm hàng trăm kilobyte mà chẳng gì cảnh báo bạn. Hãy đẩy cái ranh giới xuống thấp hơn: giữ trang ở phía máy chủ và rút phần tương tác ra thành một Client Component nhỏ của riêng nó.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Server Component</span><span class="lc-sub">Bản thân mô hình, độc lập với mọi framework.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Component</span><span class="lc-sub">Next.js hiện thực nó ra sao, kèm danh sách đầy đủ cái gì được và không được.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết một component trong <code>app/</code> đọc dữ liệu và render nó, rồi xác nhận (qua <code>console.log</code>) rằng nó log trên server, không phải trình duyệt.</li>
<li>Thử dùng <code>useState</code> trong đó và đọc lỗi bảo bạn thêm <code>'use client'</code>.</li>
<li>Liệt kê hai việc Server Component làm được mà Client Component không (await dữ liệu trực tiếp, đọc secret).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nhận ra một Server Component mặc định và biết nó được và không được làm gì.</p></div>

<h3>🔬 Đo thật: chạy ở đâu, cái gì tới trình duyệt (Next.js 16.4.6)</h3>
<p>Một Server Component async thật: đọc tệp JSON bằng <code>fs</code>, đọc biến môi trường bí mật và định dạng Markdown bằng thư viện <code>marked</code>. <code>force-dynamic</code> cho nó render lại mỗi request để thấy từng lần chạy trong log:</p>
<pre><code class="language-tsx">import { readFile } from 'node:fs/promises';
import { marked } from 'marked';

export const dynamic = 'force-dynamic'; <span class="tok-comment">  // render lại MỖI request (Chương 17) — để thấy log mỗi lần gọi</span>

type KhoaHoc = { id: number; ten: string; moTa: string };

export default async function KhoaHocPage() {
  const raw = await readFile(process.cwd() + '/src/data/khoa-hoc.json', 'utf8'); <span class="tok-comment">  // đọc thẳng tệp trên máy chủ</span>
  const ds: KhoaHoc[] = JSON.parse(raw);
  const khoa = process.env.KHOA_BI_MAT ?? '';                                      <span class="tok-comment">  // biến bí mật: chỉ máy chủ thấy</span>
  console.log('[khoa-hoc] render trên máy chủ ·', ds.length, 'khoá · bí mật dài', khoa.length, '· dau-van-tay-ma-91');
  return (
    &lt;ul id="ds" className="list-disc p-4 pl-8 font-sans"&gt;
      {ds.map((k) =&gt; (
        &lt;li key={k.id} dangerouslySetInnerHTML={{ __html: marked.parseInline(&#96;**\${k.ten}** — \${k.moTa}&#96;) as string }} /&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>
<p><code>next start</code>, gọi 3 lần bằng <code>curl</code> + mở 2 lần bằng Chromium. Terminal máy chủ nhận mỗi lần render một dòng; console trình duyệt <b>0</b> dòng:</p>
<div class="out">[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91
[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91
[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91
[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91
[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91</div>
<p>Cái gì tới trình duyệt? Tìm trong thư mục build: một chuỗi chỉ có trong mã component, thư viện <code>marked</code>, giá trị bí mật:</p>
<div class="out">.next/static (gửi trình duyệt): 0
.next/server (chỉ máy chủ): 2
thư viện marked trong .next/static: 0
giá trị KHOA_BI_MAT trong .next: 0</div>
<p>JavaScript Chromium tải về: <b>457,070 B</b> cho <code>/khoa-hoc</code> — đúng bằng một trang trống (<b>457,070 B</b>, là React + phần chạy của Next.js). Dùng <code>marked</code> ở máy chủ tốn người dùng 0 byte.</p>
<p><b>Chỗ bài ở trên chưa nói:</b> <i>mã</i> của component không bao giờ xuống, nhưng <i>kết quả</i> của nó đi qua hai lần — dạng HTML, và dạng <b>RSC payload</b> (cây kết quả viết thành dữ liệu, nhúng trong HTML cho React ở trình duyệt). Trong đó không có chút mã nào:</p>
<pre><code class="language-javascript"><span class="tok-comment">// rsc.mjs &lt;url&gt; [regex] — tải HTML, tách RSC payload (các mẩu self.__next_f.push) và in số byte + những dòng payload khớp regex</span>
const [url, re = '.'] = process.argv.slice(2);
const html = await (await fetch(url)).text();
const payload = [...html.matchAll(/self\\.__next_f\\.push\\((\\[.*?\\])\\)&lt;\\/script&gt;/g)].map((m) =&gt; JSON.parse(m[1])[1] ?? '').join('');
console.log(&#96;HTML \${html.length} byte · trong đó RSC payload \${payload.length} byte&#96;);
for (const l of payload.split('\\n')) if (new RegExp(re).test(l)) console.log(l.length &gt; 260 ? l.slice(0, 260) + '…' : l);</code></pre>
<div class="out">HTML 7282 byte · trong đó RSC payload 4642 byte
8:["$","ul",null,{"id":"ds","className":"list-disc p-4 pl-8 font-sans","children":[["$","li","1",{"dangerouslySetInnerHTML":{"__html":"&lt;strong&gt;React&lt;/strong&gt; — component, &lt;em&gt;props&lt;/em&gt;, state"}}],["$","li","2",{"dangerouslySetInnerHTML":{"__html":"&lt;strong&gt;Nex…
0</div>
<p>Tắt JavaScript, danh sách vẫn nằm nguyên trên trang — nó có sẵn trong HTML.</p>
<p><b>Cái giá, bằng lỗi thật.</b> Một <code>onClick</code> trong Server Component làm <code>next build</code> hỏng lúc dựng sẵn trang; <code>useState</code> còn hỏng sớm hơn, ngay lúc biên dịch:</p>
<div class="out">Error: Event handlers cannot be passed to Client Component props.
  {onClick: function onClick, children: ...}
If you need interactivity, consider converting part of this to a Client Component.
Error: You're importing a module that depends on &#96;useState&#96; into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the &#96;"use client"&#96; directive.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm i marked
npm run build &amp;&amp; npx next start -p 3000
curl -s localhost:3000/khoa-hoc &gt; /dev/null <span class="tok-comment">  # một dòng log hiện ở CHÍNH terminal này</span>
grep -rl "&lt;một chuỗi trong component&gt;" .next/static | wc -l <span class="tok-comment">  # 0</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-12-4-compiler-rsc" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 12.4 — React Compiler cho cả app, và Server Components ở mức khái niệm</span><span class="lc-sub">Mô hình ở tầng React; ở đây là cách Next.js dùng nó</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-11-1-fetch-async" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 11.1 — fetch, promise & async/await</span><span class="lc-sub">SPA lấy dữ liệu trong trình duyệt — so với await ở máy chủ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-1-path-fs" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.1 — path và fs</span><span class="lc-sub">readFile mà Server Component vừa dùng</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Server Component</span><span class="v">Mặc định trong <code>app/</code>; chạy trên server, không gửi JS.</span></div>
  <div class="kv"><span class="k">Không hook/state</span><span class="v">Server Component không dùng được <code>useState</code>/<code>useEffect</code>.</span></div>
  <div class="kv"><span class="k">Truy cập dữ liệu trực tiếp</span><span class="v">Chúng <code>await</code> dữ liệu và đọc secret server được.</span></div>
  <div class="kv"><span class="k">Zero JS client</span><span class="v">Mã của chúng không bao giờ vào bundle trình duyệt.</span></div>
  <div class="kv"><span class="k">RSC</span><span class="v">React Server Components — mô hình dưới App Router.</span></div>
  <div class="kv"><span class="k">Component async</span><span class="v">Một Server Component có thể là một <code>async function</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Trong App Router, component mặc định là Server Component — chạy trên server và không gửi JavaScript.</li><li>Chúng <code>await</code> dữ liệu và đọc secret server trực tiếp được, nhưng không dùng state, effect hay API trình duyệt.</li><li>Điều này giữ bundle client nhỏ và giữ truy cập dữ liệu trên server.</li><li>Bạn chọn đưa một component vào trình duyệt bằng <code>'use client'</code> (bài sau).</li></ul>

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
${G09_2}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>When you need interactivity, opt into the client</h2>
<p class="lead">To get state, effects, and event handlers back, you mark a component as a <strong>Client Component</strong> with a single line at the very top of the file: <code>'use client'</code>. That component (and the code it pulls in) is then bundled and run in the browser, exactly like classic React.</p>

<pre><code class="language-typescript"><span class="tok-comment">// components/Counter.tsx</span>
'use client';
import { useState } from 'react';

export default function Counter() {
  const [n, setN] = useState(0);
  return &lt;button onClick={() =&gt; setN(n + 1)}&gt;Count: {n}&lt;/button&gt;;
}</code></pre>
<p>The directive must be the first <b>statement</b> of the file, before any imports (a comment above it is fine — measured below). It does not mean "this only runs on the client" — a Client Component is still pre-rendered to HTML on the server for the first paint, then <em>hydrated</em> (made interactive) in the browser. What it means is "this component's code is allowed in the browser, so it may use browser-only features."</p>

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
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">It marks an entry point</div><div class="lz-nsub"><code>&#39;use client&#39;</code> at the top of a file says &quot;from here down, this is client code&quot;. It does not mean &quot;runs only in the browser&quot;.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Client Components still render on the server</div><div class="lz-nsub">Once, for the initial HTML. That is why <code>window</code> is undefined during that first pass — hydration comes after.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">It is inherited by imports</div><div class="lz-nsub">Every module imported from a client file joins the client bundle. Marking one file can pull in a hundred.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">It is not inherited through children</div><div class="lz-nsub">A Server Component passed as <code>children</code> to a Client Component stays on the server. This is the escape hatch chapter 9.3 is about.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — believing <code>&#39;use client&#39;</code> means the code only runs in the browser.</strong> It does not: a Client Component is rendered once on the server to produce the initial HTML, then hydrated in the browser. So a component body that reads <code>localStorage</code> or <code>window.innerWidth</code> at the top level crashes the server render with &quot;localStorage is not defined&quot;, and the error appears at build time on a page that works perfectly in development navigation. Browser-only code belongs inside an effect or an event handler, both of which run only after hydration. When a value must be known on the first paint, read it on the server or accept a two-pass render.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-client" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">react.dev — 'use client'</span><span class="lc-sub">The precise semantics: what the directive marks, and what it does not.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/client-components" target="_blank" rel="noopener">
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Client Components</span><span class="lc-sub">The full render lifecycle, including the server pass people forget about.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add <code>'use client'</code> to the top of a component that needs <code>useState</code> and confirm it now works.</li>
<li>Check the Network tab: the client component's JS is now in the bundle, the server one's is not.</li>
<li>Explain that <code>'use client'</code> marks a boundary — everything imported below it also becomes client code.</li>
</ol>
<p><strong>Done when:</strong> you can convert a component to a Client Component and explain the boundary it creates.</p></div>

<h3>🔬 Measured: what 'use client' really does (Next.js 16.4.6)</h3>
<p>A Server Component page with one Client Component inside. Both log when they render — the counter also says where it is running:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function Counter() {
  const [n, setN] = useState(0);
  console.log('[Counter] render · n =', n, '· van-tay-client-92', typeof window === 'undefined' ? '· ở MÁY CHỦ' : '· ở TRÌNH DUYỆT');
  return &lt;button id="dem" className="rounded border px-3 py-1" onClick={() =&gt; setN(n + 1)}&gt;Đếm: {n}&lt;/button&gt;;
}</code></pre>
<p><b>It still renders on the server.</b> <code>next build</code> printed the Client Component's log, with <code>window</code> undefined; the HTML already contains the button:</p>
<div class="out">[dem/page] render · van-tay-server-92
[Counter] render · n = 0 · van-tay-client-92 · ở MÁY CHỦ
&lt;button id="dem" class="rounded border px-3 py-1"&gt;Đếm: 0&lt;/button&gt;</div>
<p><b>Then it lives in the browser.</b> Chromium, 3 clicks — 4 renders in the browser (n = 0 is the hydration render):</p>
<div class="out">[Counter] render · n = 0 · van-tay-client-92 · ở TRÌNH DUYỆT
[Counter] render · n = 1 · van-tay-client-92 · ở TRÌNH DUYỆT
[Counter] render · n = 2 · van-tay-client-92 · ở TRÌNH DUYỆT
[Counter] render · n = 3 · van-tay-client-92 · ở TRÌNH DUYỆT</div>
<p>With JavaScript turned off, the same button is on the page (it is in the HTML) but three clicks leave it at <b>Đếm: 0</b>: no JS, no hydration.</p>
<p><b>What it ships.</b> A string from the Counter is in one browser file, the page's string in none. Chromium downloaded 6 scripts for this page vs 5 for an empty page — the extra one is the Counter, <b>433 B</b>. A small leaf is cheap; what you import into it is what costs (9.5).</p>
<div class="out">Counter (use client) trong .next/static: 1
page (server) trong .next/static: 0</div>
<p><b>Directive position, measured.</b> Put after an import, <code>'use client'</code> is just a string expression: the file stays a Server Component and <code>useState</code> breaks the build. A comment above it is fine:</p>
<div class="out">Error: You're importing a module that depends on &#96;useState&#96; into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the &#96;"use client"&#96; directive.
✓ Compiled successfully in 334ms
└ ○ /vi-tri</div>
<p><b>The localStorage trap, measured.</b> In <code>next dev</code>, reaching <code>/ls</code> with a Link works (rendered in the browser only). Loading the URL directly runs the server pass — HTTP 500; dev quietly re-renders on the client and leaves a "1 Issue" badge. <code>next build</code> refuses:</p>
<pre><code class="language-tsx">'use client';

export default function TuyChon() {
  const theme = localStorage.getItem('theme') ?? 'sáng';
  return &lt;p id="theme"&gt;Giao diện: {theme}&lt;/p&gt;;
}</code></pre>
<div class="out">tải thẳng /ls (next dev): HTTP 500
⨯ ReferenceError: localStorage is not defined
Error occurred prerendering page "/ls". Read more: https://nextjs.org/docs/messages/prerender-error
ReferenceError: localStorage is not defined</div>
<p>The fix: a default the server can render, and the real value read in an effect (browser only). Build passes; the HTML says "sáng"; with <code>localStorage.theme = "tối"</code> the page shows it after hydration:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

export default function TuyChon() {
  const [theme, setTheme] = useState('sáng');
  useEffect(() =&gt; setTheme(localStorage.getItem('theme') ?? 'sáng'), []);
  return &lt;p id="theme"&gt;Giao diện: {theme}&lt;/p&gt;;
}</code></pre>
<div class="out">&lt;p id="theme"&gt;Giao diện: sáng&lt;/p&gt;
Giao diện: tối   ← after reload, in Chromium</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build <span class="tok-comment">  # the Counter's console.log prints HERE, during the build</span>
npx next start -p 3000
curl -s localhost:3000/dem | grep button <span class="tok-comment">  # the button is already in the HTML</span>
grep -rl "&lt;a string from Counter&gt;" .next/static | wc -l <span class="tok-comment">  # 1</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependencies and cleanup</span><span class="lc-sub">Where browser-only code such as localStorage belongs</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-1-usestate-useeffect" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.1 — useState & useEffect</span><span class="lc-sub">The two hooks under every Client Component</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">'use client'</span><span class="v">A directive at the top of a file marking the client boundary.</span></div>
  <div class="kv"><span class="k">Client Component</span><span class="v">Runs in the browser; can use state, effects, event handlers.</span></div>
  <div class="kv"><span class="k">Boundary</span><span class="v">From this file down the subtree is client code.</span></div>
  <div class="kv"><span class="k">Ships JS</span><span class="v">Client Components add to the browser bundle.</span></div>
  <div class="kv"><span class="k">Interactivity</span><span class="v">State, effects and DOM events require a Client Component.</span></div>
  <div class="kv"><span class="k">Directive placement</span><span class="v">Must be the first statement of the file; comments may precede it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>'use client'</code> at the top of a file marks it (and everything it imports) as client code.</li><li>Client Components run in the browser and can use state, effects and event handlers.</li><li>They ship JavaScript to the bundle, so push the boundary as low as possible.</li><li>The directive must be the very first statement of the file (only comments may come before it).</li></ul>

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

<pre><code class="language-typescript"><span class="tok-comment">// components/Counter.tsx</span>
'use client';
import { useState } from 'react';

export default function Counter() {
  const [n, setN] = useState(0);
  return &lt;button onClick={() =&gt; setN(n + 1)}&gt;Đếm: {n}&lt;/button&gt;;
}</code></pre>
<p>Chỉ thị phải là <b>câu lệnh</b> đầu tiên của tệp, trước mọi import (chú thích đứng trên thì vẫn được — đo ở dưới). Nó không có nghĩa "cái này chỉ chạy ở client" — một Client Component vẫn được render trước ra HTML trên server cho lần vẽ đầu, rồi được <em>hydrate</em> (làm cho tương tác được) trong trình duyệt. Nó nghĩa là "code component này được phép ở trình duyệt, nên có thể dùng tính năng chỉ-có-ở-trình-duyệt."</p>

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
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nó đánh dấu một điểm vào</div><div class="lz-nsub"><code>&#39;use client&#39;</code> ở đầu file nói &quot;từ đây trở xuống là mã phía client&quot;. Nó KHÔNG có nghĩa &quot;chỉ chạy trong trình duyệt&quot;.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Client Component vẫn render trên máy chủ</div><div class="lz-nsub">Một lần, để tạo ra HTML ban đầu. Đó là lý do <code>window</code> là undefined trong lượt đầu đó — hydrate diễn ra sau.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Nó được kế thừa qua import</div><div class="lz-nsub">Mọi module được import từ một file client đều gia nhập gói client. Đánh dấu một file có thể lôi theo cả trăm cái.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Nó KHÔNG kế thừa qua children</div><div class="lz-nsub">Một Server Component truyền vào làm <code>children</code> của một Client Component vẫn ở lại máy chủ. Đó là cửa thoát mà bài 9.3 nói tới.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tin rằng <code>&#39;use client&#39;</code> nghĩa là mã chỉ chạy trong trình duyệt.</strong> Không phải: một Client Component được render một lần trên máy chủ để tạo HTML ban đầu, rồi mới được hydrate trong trình duyệt. Nên một thân component đọc <code>localStorage</code> hay <code>window.innerWidth</code> ở cấp cao nhất sẽ làm sập lượt render trên máy chủ với &quot;localStorage is not defined&quot;, và lỗi hiện ra lúc build trên một trang chạy hoàn hảo khi điều hướng ở môi trường phát triển. Mã chỉ-dành-cho-trình-duyệt thuộc về bên trong một effect hoặc một handler sự kiện, cả hai đều chỉ chạy sau khi hydrate. Khi một giá trị phải biết ngay ở lần vẽ đầu, hãy đọc nó ở máy chủ hoặc chấp nhận một lượt render hai pha.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-client" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">react.dev — 'use client'</span><span class="lc-sub">Ngữ nghĩa chính xác: chỉ thị này đánh dấu cái gì, và không đánh dấu cái gì.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/client-components" target="_blank" rel="noopener">
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Client Component</span><span class="lc-sub">Toàn bộ vòng đời render, gồm cả lượt chạy trên máy chủ mà người ta hay quên.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm <code>'use client'</code> lên đầu một component cần <code>useState</code> và xác nhận giờ nó chạy được.</li>
<li>Kiểm tab Network: JS của client component giờ nằm trong bundle, của server component thì không.</li>
<li>Giải thích rằng <code>'use client'</code> đánh dấu một ranh giới — mọi thứ import bên dưới nó cũng thành mã client.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chuyển được một component thành Client Component và giải thích ranh giới nó tạo ra.</p></div>

<h3>🔬 Đo thật: 'use client' thật ra làm gì (Next.js 16.4.6)</h3>
<p>Một trang Server Component có một Client Component bên trong. Cả hai in log khi render — bộ đếm còn ghi nó đang chạy ở đâu:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function Counter() {
  const [n, setN] = useState(0);
  console.log('[Counter] render · n =', n, '· van-tay-client-92', typeof window === 'undefined' ? '· ở MÁY CHỦ' : '· ở TRÌNH DUYỆT');
  return &lt;button id="dem" className="rounded border px-3 py-1" onClick={() =&gt; setN(n + 1)}&gt;Đếm: {n}&lt;/button&gt;;
}</code></pre>
<p><b>Nó vẫn render ở máy chủ.</b> <code>next build</code> in ra log của Client Component, lúc <code>window</code> chưa có; HTML đã có sẵn cái nút:</p>
<div class="out">[dem/page] render · van-tay-server-92
[Counter] render · n = 0 · van-tay-client-92 · ở MÁY CHỦ
&lt;button id="dem" class="rounded border px-3 py-1"&gt;Đếm: 0&lt;/button&gt;</div>
<p><b>Rồi nó sống trong trình duyệt.</b> Chromium, bấm 3 lần — 4 lần render trong trình duyệt (n = 0 là lần render lúc hydrate):</p>
<div class="out">[Counter] render · n = 0 · van-tay-client-92 · ở TRÌNH DUYỆT
[Counter] render · n = 1 · van-tay-client-92 · ở TRÌNH DUYỆT
[Counter] render · n = 2 · van-tay-client-92 · ở TRÌNH DUYỆT
[Counter] render · n = 3 · van-tay-client-92 · ở TRÌNH DUYỆT</div>
<p>Tắt JavaScript, cùng cái nút vẫn có trên trang (nó nằm trong HTML) nhưng bấm ba lần vẫn là <b>Đếm: 0</b>: không JS thì không hydrate.</p>
<p><b>Nó gửi đi những gì.</b> Chuỗi của Counter có ở một tệp gửi trình duyệt, chuỗi của trang thì không. Chromium tải 6 script cho trang này so với 5 của trang trống — tệp thêm chính là Counter, <b>433 B</b>. Một lá nhỏ thì rẻ; thứ bạn import vào nó mới tốn (9.5).</p>
<div class="out">Counter (use client) trong .next/static: 1
page (server) trong .next/static: 0</div>
<p><b>Vị trí chỉ thị, đo thật.</b> Đặt sau một import, <code>'use client'</code> chỉ là một chuỗi thường: tệp vẫn là Server Component và <code>useState</code> làm build hỏng. Một dòng chú thích ở trên thì không sao:</p>
<div class="out">Error: You're importing a module that depends on &#96;useState&#96; into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the &#96;"use client"&#96; directive.
✓ Compiled successfully in 334ms
└ ○ /vi-tri</div>
<p><b>Bẫy localStorage, đo thật.</b> Ở <code>next dev</code>, vào <code>/ls</code> bằng Link thì chạy (chỉ render ở trình duyệt). Tải thẳng đường dẫn thì đi qua lượt máy chủ — HTTP 500; dev lặng lẽ render lại ở trình duyệt và để lại huy hiệu "1 Issue". <code>next build</code> từ chối:</p>
<pre><code class="language-tsx">'use client';

export default function TuyChon() {
  const theme = localStorage.getItem('theme') ?? 'sáng';
  return &lt;p id="theme"&gt;Giao diện: {theme}&lt;/p&gt;;
}</code></pre>
<div class="out">tải thẳng /ls (next dev): HTTP 500
⨯ ReferenceError: localStorage is not defined
Error occurred prerendering page "/ls". Read more: https://nextjs.org/docs/messages/prerender-error
ReferenceError: localStorage is not defined</div>
<p>Cách chữa: giá trị mặc định mà máy chủ vẽ được, giá trị thật đọc trong effect (chỉ ở trình duyệt). Build xanh; HTML ghi "sáng"; đặt <code>localStorage.theme = "tối"</code> thì trang hiện "tối" sau khi hydrate:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

export default function TuyChon() {
  const [theme, setTheme] = useState('sáng');
  useEffect(() =&gt; setTheme(localStorage.getItem('theme') ?? 'sáng'), []);
  return &lt;p id="theme"&gt;Giao diện: {theme}&lt;/p&gt;;
}</code></pre>
<div class="out">&lt;p id="theme"&gt;Giao diện: sáng&lt;/p&gt;
Giao diện: tối   ← sau khi tải lại, trong Chromium</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build <span class="tok-comment">  # console.log của Counter in ra NGAY ĐÂY, lúc build</span>
npx next start -p 3000
curl -s localhost:3000/dem | grep button <span class="tok-comment">  # nút có sẵn trong HTML</span>
grep -rl "&lt;một chuỗi trong Counter&gt;" .next/static | wc -l <span class="tok-comment">  # 1</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependency và cleanup</span><span class="lc-sub">Nơi đặt mã chỉ-trình-duyệt như localStorage</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-1-usestate-useeffect" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.1 — useState & useEffect</span><span class="lc-sub">Hai hook nền của mọi Client Component</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">'use client'</span><span class="v">Chỉ thị đầu file đánh dấu ranh giới client.</span></div>
  <div class="kv"><span class="k">Client Component</span><span class="v">Chạy trong trình duyệt; dùng được state, effect, event handler.</span></div>
  <div class="kv"><span class="k">Ranh giới</span><span class="v">Từ file này trở xuống cây con là mã client.</span></div>
  <div class="kv"><span class="k">Gửi JS</span><span class="v">Client Component thêm vào bundle trình duyệt.</span></div>
  <div class="kv"><span class="k">Tương tác</span><span class="v">State, effect và sự kiện DOM cần một Client Component.</span></div>
  <div class="kv"><span class="k">Vị trí chỉ thị</span><span class="v">Phải là câu lệnh đầu tiên của tệp; chú thích được đứng trước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>'use client'</code> đầu một file đánh dấu nó (và mọi thứ nó import) là mã client.</li><li>Client Component chạy trong trình duyệt và dùng được state, effect và event handler.</li><li>Chúng gửi JavaScript vào bundle, nên hãy đẩy ranh giới xuống thấp nhất có thể.</li><li>Chỉ thị phải là đúng câu lệnh đầu tiên của tệp (chỉ chú thích được đứng trước).</li></ul>

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
${G09_3}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>'use client' marks a boundary, not just one file</h2>
<p class="lead">Here is the rule that catches everyone: <code>'use client'</code> is not local to one component. It is a <strong>boundary</strong>. Every module a Client Component <em>imports</em> is pulled into the client bundle too. So the moment you import a component into a client file, that component becomes client as well — whether or not it has its own directive.</p>

<pre><code class="language-javascript">'use client';
import Chart from './Chart';   <span class="tok-comment">// Chart is now a CLIENT component too,</span>
                               <span class="tok-comment">// even without its own 'use client'</span></code></pre>

<h3>You cannot import a Server Component into a Client Component</h3>
<p>A Server Component can run <code>await db...</code> and use secrets. If a Client Component could <code>import</code> it, that server-only code would be dragged into the browser bundle — impossible. So that import fails — and, measured below, not politely: the bundler crashes on <code>node:fs/promises</code>; with <code>import 'server-only'</code> at the top of the server file you get a clear error instead. A component with <i>no</i> server-only code is different: a client file may import it, and it silently becomes client code. Either way there is a clean way around it.</p>

<h3>The slot pattern: pass Server Components as children</h3>
<p>A Client Component can <em>receive</em> a Server Component through <code>children</code> (or any prop), because it receives the already-rendered output, not the code. The Server Component is rendered on the server; the client wrapper just places it in a slot.</p>
<pre><code class="language-typescript"><span class="tok-comment">// Tabs.tsx — Client: holds the active-tab state</span>
'use client';
import { useState } from 'react';

export default function Tabs({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return open ? &lt;div&gt;{children}&lt;/div&gt; : null;
}

<span class="tok-comment">// page.tsx — Server: fetches, then nests a Server Component INSIDE the client Tabs</span>
export default async function Page() {
  return (
    &lt;Tabs&gt;
      &lt;ServerData /&gt;      <span class="tok-comment">{/* rendered on the server, passed as children */}</span>
    &lt;/Tabs&gt;
  );
}</code></pre>
<p>This is the composition workhorse of the App Router. Interactive shell (client) on the outside, data-heavy content (server) slotted inside. You get client behaviour <em>and</em> keep the data-fetching component off the client bundle.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Server → renders → Client</span><span class="v">A Server Component can render a Client Component directly (that is normal — a server page uses a &lt;Counter/&gt;).</span></div>
  <div class="kv"><span class="k">Client → imports → Server</span><span class="v">✗ Not for server-only code — the build breaks. A plain component imported this way silently becomes client code.</span></div>
  <div class="kv"><span class="k">Client → children → Server</span><span class="v">✓ Allowed. The client receives rendered output through a slot, not the code.</span></div>
</div>

<h3>Keeping a Server Component inside a Client Component</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>A client file cannot import a server file</b> — The import would pull the server code into the bundle, so React forbids it — including the database call inside.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>But it can receive one as children</b> — <code>&lt;Tabs&gt;&lt;ServerList /&gt;&lt;/Tabs&gt;</code> composed in a <em>server</em> parent. The element is created on the server and passed in already rendered.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Props work the same way</b> — <code>&lt;Modal body={&lt;ServerChart /&gt;} /&gt;</code>. Any prop slot accepts a rendered server element, not just children.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>So the interactive shell wraps server content</b> — The tab bar is client, the panel inside is server. Neither one has to give up what it is good at.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a Client Component that only exists to add one <code>onClick</code>, wrapping the whole page.</strong> <code>&#39;use client&#39;</code> on a layout-shaped component means every child it imports is client code, so a page that was a Server Component becomes one too — the database query moves to the browser (and fails), the markdown parser ships to users, and the bundle doubles. The composition rule is the way out: keep the wrapper client, but let it render <code>{children}</code> and compose the server content in the <em>parent</em>. The rule of thumb is to push <code>&#39;use client&#39;</code> as far down the tree as it will go — usually to a single button or input.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Composition patterns</span><span class="lc-sub">The supported combinations, with the children pattern spelled out.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-components#interleaving-server-and-client-components" target="_blank" rel="noopener">
  <span class="lc-ico">🪢</span>
  <span class="lc-body"><span class="lc-title">react.dev — Interleaving server and client components</span><span class="lc-sub">Why children works when imports do not.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Pass a Server Component into a Client Component via <code>children</code> and confirm it still renders on the server.</li>
<li>Try to import a Server Component directly inside a Client Component file and read why that does not work; use the children pattern instead.</li>
<li>Sketch a tree where a client island sits inside a mostly-server page.</li>
</ol>
<p><strong>Done when:</strong> you can compose server and client components via <code>children</code> and explain the one-way import rule.</p></div>

<h3>🔬 Measured: what imports and slots really do (Next.js 16.4.6)</h3>
<p><b>Imports carry the boundary.</b> <code>VoClient</code> (<code>'use client'</code>) imports <code>ChartThuong</code>, which has no directive. Its string ends up in the browser files and it renders in the browser:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';
import ChartThuong from './ChartThuong';

export default function VoClient() {
  const [n, setN] = useState(0);
  return (
    &lt;div className="rounded border p-2"&gt;
      &lt;button id="vo" onClick={() =&gt; setN(n + 1)}&gt;VoClient: {n}&lt;/button&gt;
      &lt;ChartThuong /&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">chart   trong .next/static: 1
[ChartThuong] render · van-tay-chart-93 · ở TRÌNH DUYỆT
[ChartThuong] render · van-tay-chart-93 · ở TRÌNH DUYỆT</div>
<p><b>Importing server-only code into a client file.</b> Without a guard the build crashes inside the bundler; with <code>import 'server-only'</code> it names the file:</p>
<div class="out">FATAL: An unexpected Turbopack error occurred. A panic log has been written to …
Error [TurbopackInternalError]: Failed to write app endpoint /bay-import/page
- the chunking context (unknown) does not support external modules (request: node:fs/promises)

Error: You're importing a module that depends on "server-only" into a React Client Component module. This API is only available in Server Components but one of its parents is marked with "use client", so this module is also a Client Component.</div>
<p><b>The slot pattern, measured.</b> <code>Tabs</code> is a Client Component with <code>children</code> and a second slot prop <code>ben</code>; the server page passes <code>DuLieuServer</code> (reads a file) and <code>GioMayChu</code> into them:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function Tabs({ children, ben }: { children: React.ReactNode; ben: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    &lt;div className="space-y-1 rounded border p-2"&gt;
      &lt;button id="tab" onClick={() =&gt; setOpen(!open)}&gt;{open ? 'Đóng tab' : 'Mở tab'}&lt;/button&gt;
      {open &amp;&amp; &lt;div id="khe"&gt;{children}&lt;/div&gt;}
      &lt;div id="ben"&gt;{ben}&lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre>
<pre><code class="language-tsx">import VoClient from './VoClient';
import Tabs from './Tabs';
import DuLieuServer from './DuLieuServer';
import GioMayChu from './GioMayChu';

export const dynamic = 'force-dynamic';

export default function TrangGhep() {
  return (
    &lt;main className="space-y-2 p-4 font-sans"&gt;
      &lt;VoClient /&gt;
      &lt;Tabs ben={&lt;GioMayChu /&gt;}&gt;
        &lt;DuLieuServer /&gt;
      &lt;/Tabs&gt;
    &lt;/main&gt;
  );
}</code></pre>
<div class="out">chart   trong .next/static: 1
dulieu  trong .next/static: 0
gio     trong .next/static: 0</div>
<p>The slotted components are in <b>0</b> browser files, yet their output is inside Tabs in the HTML. Closing and opening the tab 4 times in Chromium:</p>
<div class="out">0 request mới sau 4 lần bấm tab
[ChartThuong] render · van-tay-chart-93 · ở MÁY CHỦ
[DuLieuServer] render · van-tay-dulieu-93 · đọc 3 khoá
[ChartThuong] render · van-tay-chart-93 · ở MÁY CHỦ
[DuLieuServer] render · van-tay-dulieu-93 · đọc 3 khoá</div>
<p>Zero requests; <code>DuLieuServer</code> ran twice — once per page load (curl + Chromium), never per click. Its output arrived once in the RSC payload; toggling is pure client state.</p>
<p><b>The snippet above, copied as it used to be</b> (no <code>useState</code> import, untyped <code>children</code>, <code>// …</code> between tags):</p>
<div class="out">src/app/chep/Tabs.tsx:3: error TS7031: Binding element 'children' implicitly has an 'any' type.
src/app/chep/Tabs.tsx:4: error TS2304: Cannot find name 'useState'.
&lt;div&gt;&lt;p&gt;Dữ liệu từ máy chủ&lt;/p&gt;      // render trên server, truyền vào làm children&lt;/div&gt;
  8:21  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build
for v in chart dulieu gio; do grep -rl "van-tay-$v-93" .next/static | wc -l; done <span class="tok-comment">  # 1 0 0</span>
npx next start -p 3000 <span class="tok-comment">  # open /ghep, toggle the tab, watch Network and the server log</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-7-2-render-props" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 7.2 — Reusable components: children & render props</span><span class="lc-sub">The same slot — back then both sides lived in the browser</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-13-1-compound-headless" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 13.1 — Compound components, headless hooks and "as"</span><span class="lc-sub">Composition over imports, in depth</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Composition boundary</span><span class="v">How server and client components nest together.</span></div>
  <div class="kv"><span class="k">children pattern</span><span class="v">Pass a Server Component as <code>children</code> into a Client Component.</span></div>
  <div class="kv"><span class="k">One-way import</span><span class="v">A Client file cannot import a Server Component as a child module.</span></div>
  <div class="kv"><span class="k">Client island</span><span class="v">An interactive client piece inside a server page.</span></div>
  <div class="kv"><span class="k">Slot through props</span><span class="v">Server UI reaches a client wrapper via props/children.</span></div>
  <div class="kv"><span class="k">Server stays server</span><span class="v">A server child passed as children still renders on the server.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Server and Client Components compose, but the import only goes one way: a client file cannot import a server component.</li><li>To place server UI inside a client wrapper, pass it through <code>children</code> (or a prop).</li><li>A server child passed as <code>children</code> still renders on the server.</li><li>Think client islands inside a mostly-server page.</li></ul>

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

<pre><code class="language-javascript">'use client';
import Chart from './Chart';   <span class="tok-comment">// Chart giờ cũng là component CLIENT,</span>
                               <span class="tok-comment">// dù không có 'use client' riêng</span></code></pre>

<h3>Bạn không import một Server Component vào một Client Component được</h3>
<p>Một Server Component có thể chạy <code>await db...</code> và dùng bí mật. Nếu một Client Component <code>import</code> được nó, code chỉ-server đó sẽ bị lôi vào bundle trình duyệt — không thể. Nên phép import đó hỏng — và như đo ở dưới, hỏng chẳng lịch sự gì: trình đóng gói sập vì <code>node:fs/promises</code>; có <code>import 'server-only'</code> ở đầu tệp máy chủ thì lỗi rõ ràng. Còn một component <i>không</i> có mã chỉ-máy-chủ thì khác: tệp client import được nó, và nó lặng lẽ thành mã client. Đằng nào cũng có một lối vòng gọn gàng.</p>

<h3>Mẫu khe cắm: truyền Server Component làm children</h3>
<p>Một Client Component có thể <em>nhận</em> một Server Component qua <code>children</code> (hay prop bất kỳ), vì nó nhận phần output đã render, không phải code. Server Component được render trên server; lớp bọc client chỉ đặt nó vào một khe.</p>
<pre><code class="language-typescript"><span class="tok-comment">// Tabs.tsx — Client: giữ state tab đang mở</span>
'use client';
import { useState } from 'react';

export default function Tabs({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return open ? &lt;div&gt;{children}&lt;/div&gt; : null;
}

<span class="tok-comment">// page.tsx — Server: fetch, rồi lồng một Server Component BÊN TRONG Tabs client</span>
export default async function Page() {
  return (
    &lt;Tabs&gt;
      &lt;ServerData /&gt;      <span class="tok-comment">{/* render trên server, truyền vào làm children */}</span>
    &lt;/Tabs&gt;
  );
}</code></pre>
<p>Đây là con ngựa thồ ghép nối của App Router. Vỏ tương tác (client) ở ngoài, nội dung nặng dữ liệu (server) cắm vào trong. Bạn có hành vi client <em>mà vẫn</em> giữ component fetch dữ liệu khỏi client bundle.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Server → render → Client</span><span class="v">Một Server Component render trực tiếp một Client Component được (bình thường — một trang server dùng &lt;Counter/&gt;).</span></div>
  <div class="kv"><span class="k">Client → import → Server</span><span class="v">✗ Không được với mã chỉ-máy-chủ — build vỡ. Một component thường bị import kiểu này thì lặng lẽ thành mã client.</span></div>
  <div class="kv"><span class="k">Client → children → Server</span><span class="v">✓ Được. Client nhận output đã render qua một khe, không phải code.</span></div>
</div>

<h3>Giữ một Server Component bên trong một Client Component</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Một file client không import được file server</b> — Phép import sẽ lôi mã máy chủ vào gói, nên React cấm — kể cả lời gọi cơ sở dữ liệu bên trong.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nhưng nó nhận được một cái làm children</b> — <code>&lt;Tabs&gt;&lt;ServerList /&gt;&lt;/Tabs&gt;</code> ghép ở một phần tử cha <em>phía máy chủ</em>. Element được tạo trên máy chủ và truyền vào ở dạng đã vẽ xong.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Props cũng hoạt động y như vậy</b> — <code>&lt;Modal body={&lt;ServerChart /&gt;} /&gt;</code>. Ô prop nào cũng nhận được một element máy chủ đã vẽ, không riêng gì children.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nên cái vỏ tương tác bọc quanh nội dung máy chủ</b> — Thanh tab là client, khung bên trong là máy chủ. Chẳng bên nào phải từ bỏ thứ mình giỏi.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một Client Component chỉ tồn tại để thêm một <code>onClick</code>, mà lại bọc cả trang.</strong> <code>&#39;use client&#39;</code> đặt lên một component có dáng layout nghĩa là mọi đứa con nó import đều thành mã client, nên một trang vốn là Server Component cũng thành client theo — truy vấn cơ sở dữ liệu dời sang trình duyệt (và hỏng), bộ phân tích markdown ship tới người dùng, và gói phình gấp đôi. Luật ghép chính là đường thoát: giữ cái vỏ ở phía client, nhưng để nó vẽ <code>{children}</code> và ghép nội dung máy chủ ở phần tử <em>cha</em>. Quy tắc ngón tay cái là đẩy <code>&#39;use client&#39;</code> xuống thấp nhất có thể trong cây — thường là xuống tới đúng một cái nút hoặc một ô nhập.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Các mẫu ghép</span><span class="lc-sub">Những tổ hợp được hỗ trợ, có nói rõ mẫu dùng children.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-components#interleaving-server-and-client-components" target="_blank" rel="noopener">
  <span class="lc-ico">🪢</span>
  <span class="lc-body"><span class="lc-title">react.dev — Đan xen component máy chủ và client</span><span class="lc-sub">Vì sao children thì được mà import thì không.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Truyền một Server Component vào một Client Component qua <code>children</code> và xác nhận nó vẫn render trên server.</li>
<li>Thử import thẳng một Server Component bên trong file Client Component và đọc vì sao không được; dùng mẫu children thay vào.</li>
<li>Phác một cây mà một đảo client nằm trong một trang phần lớn là server.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn ghép được server và client component qua <code>children</code> và giải thích luật import một chiều.</p></div>

<h3>🔬 Đo thật: import và khe thật ra làm gì (Next.js 16.4.6)</h3>
<p><b>Import kéo ranh giới theo.</b> <code>VoClient</code> (<code>'use client'</code>) import <code>ChartThuong</code>, vốn không có chỉ thị. Chuỗi của nó vào tệp gửi trình duyệt và nó render ở trình duyệt:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';
import ChartThuong from './ChartThuong';

export default function VoClient() {
  const [n, setN] = useState(0);
  return (
    &lt;div className="rounded border p-2"&gt;
      &lt;button id="vo" onClick={() =&gt; setN(n + 1)}&gt;VoClient: {n}&lt;/button&gt;
      &lt;ChartThuong /&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">chart   trong .next/static: 1
[ChartThuong] render · van-tay-chart-93 · ở TRÌNH DUYỆT
[ChartThuong] render · van-tay-chart-93 · ở TRÌNH DUYỆT</div>
<p><b>Import mã chỉ-máy-chủ vào tệp client.</b> Không có chốt thì build sập bên trong trình đóng gói; có <code>import 'server-only'</code> thì lỗi gọi đúng tên tệp:</p>
<div class="out">FATAL: An unexpected Turbopack error occurred. A panic log has been written to …
Error [TurbopackInternalError]: Failed to write app endpoint /bay-import/page
- the chunking context (unknown) does not support external modules (request: node:fs/promises)

Error: You're importing a module that depends on "server-only" into a React Client Component module. This API is only available in Server Components but one of its parents is marked with "use client", so this module is also a Client Component.</div>
<p><b>Mẫu khe cắm, đo thật.</b> <code>Tabs</code> là Client Component có <code>children</code> và một prop khe thứ hai <code>ben</code>; trang máy chủ truyền <code>DuLieuServer</code> (đọc tệp) và <code>GioMayChu</code> vào đó:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function Tabs({ children, ben }: { children: React.ReactNode; ben: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    &lt;div className="space-y-1 rounded border p-2"&gt;
      &lt;button id="tab" onClick={() =&gt; setOpen(!open)}&gt;{open ? 'Đóng tab' : 'Mở tab'}&lt;/button&gt;
      {open &amp;&amp; &lt;div id="khe"&gt;{children}&lt;/div&gt;}
      &lt;div id="ben"&gt;{ben}&lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre>
<pre><code class="language-tsx">import VoClient from './VoClient';
import Tabs from './Tabs';
import DuLieuServer from './DuLieuServer';
import GioMayChu from './GioMayChu';

export const dynamic = 'force-dynamic';

export default function TrangGhep() {
  return (
    &lt;main className="space-y-2 p-4 font-sans"&gt;
      &lt;VoClient /&gt;
      &lt;Tabs ben={&lt;GioMayChu /&gt;}&gt;
        &lt;DuLieuServer /&gt;
      &lt;/Tabs&gt;
    &lt;/main&gt;
  );
}</code></pre>
<div class="out">chart   trong .next/static: 1
dulieu  trong .next/static: 0
gio     trong .next/static: 0</div>
<p>Các component đi qua khe có trong <b>0</b> tệp gửi trình duyệt, thế mà kết quả của chúng nằm trong Tabs ở HTML. Đóng rồi mở tab 4 lần trong Chromium:</p>
<div class="out">0 request mới sau 4 lần bấm tab
[ChartThuong] render · van-tay-chart-93 · ở MÁY CHỦ
[DuLieuServer] render · van-tay-dulieu-93 · đọc 3 khoá
[ChartThuong] render · van-tay-chart-93 · ở MÁY CHỦ
[DuLieuServer] render · van-tay-dulieu-93 · đọc 3 khoá</div>
<p>Không request nào; <code>DuLieuServer</code> chạy hai lần — mỗi lần tải trang một lần (curl + Chromium), không bao giờ theo cú bấm. Kết quả của nó tới một lần trong RSC payload; đóng/mở chỉ là state ở trình duyệt.</p>
<p><b>Đoạn mã ở trên, chép như bản cũ</b> (thiếu import <code>useState</code>, <code>children</code> chưa có kiểu, <code>// …</code> giữa các thẻ):</p>
<div class="out">src/app/chep/Tabs.tsx:3: error TS7031: Binding element 'children' implicitly has an 'any' type.
src/app/chep/Tabs.tsx:4: error TS2304: Cannot find name 'useState'.
&lt;div&gt;&lt;p&gt;Dữ liệu từ máy chủ&lt;/p&gt;      // render trên server, truyền vào làm children&lt;/div&gt;
  8:21  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build
for v in chart dulieu gio; do grep -rl "van-tay-$v-93" .next/static | wc -l; done <span class="tok-comment">  # 1 0 0</span>
npx next start -p 3000 <span class="tok-comment">  # mở /ghep, đóng/mở tab, xem Network và log máy chủ</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-7-2-render-props" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 7.2 — Component tái dùng: children & render props</span><span class="lc-sub">Chính là cái khe — trước đây cả hai phía ở trình duyệt</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-13-1-compound-headless" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 13.1 — Compound component, hook headless và prop "as"</span><span class="lc-sub">Ghép thay vì import, đi sâu hơn</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ranh giới ghép</span><span class="v">Cách server và client component lồng vào nhau.</span></div>
  <div class="kv"><span class="k">Mẫu children</span><span class="v">Truyền một Server Component làm <code>children</code> vào một Client Component.</span></div>
  <div class="kv"><span class="k">Import một chiều</span><span class="v">File client không import được Server Component như một module con.</span></div>
  <div class="kv"><span class="k">Đảo client</span><span class="v">Một mảnh client tương tác bên trong một trang server.</span></div>
  <div class="kv"><span class="k">Khe qua props</span><span class="v">UI server tới một vỏ client qua props/children.</span></div>
  <div class="kv"><span class="k">Server vẫn là server</span><span class="v">Một con server truyền làm children vẫn render trên server.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Server và Client Component ghép được, nhưng import chỉ một chiều: file client không import được server component.</li><li>Để đặt UI server trong một vỏ client, truyền nó qua <code>children</code> (hoặc một prop).</li><li>Một con server truyền làm <code>children</code> vẫn render trên server.</li><li>Hãy hình dung các đảo client bên trong một trang phần lớn là server.</li></ul>

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
${G09_4}
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
<span class="tok-comment">//   "Event handlers cannot be passed to Client Component props."</span>
<span class="tok-comment">//   (another prop name ⇒ "Functions cannot be passed directly to Client Components…")</span></code></pre>

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
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Server Actions</div><div class="lz-nsub">A function marked <code>&#39;use server&#39;</code> can be passed down. React sends a reference, not the code, and calling it makes a request.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">JSX elements</div><div class="lz-nsub">Already-rendered server output, passed as children or as a prop. This is what makes composition work.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Not: ordinary functions, class instances, symbols</div><div class="lz-nsub">There is no way to send a closure over the wire. React throws a build-time error naming the prop.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — passing a Prisma model straight from a Server Component to a Client Component.</strong> <code>&lt;Editor note={note} /&gt;</code> where <code>note</code> came from <code>prisma.note.findUnique()</code> usually works, and then one day it does not: a <code>Decimal</code> column or a Prisma-specific wrapper is a class instance, and React refuses it with &quot;Only plain objects, and a few built-ins, can be passed to Client Components&quot;. (A <code>BigInt</code> id is fine — measured below, it arrives as a real <code>bigint</code>.) Worse, when it does serialise, you have shipped every column to the browser — including the ones your query selected but the UI never shows. Map to an explicit shape at the boundary: pick the fields the component needs and convert the odd types yourself.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-client#serializable-types" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">react.dev — Serializable types</span><span class="lc-sub">The exact list of what crosses the boundary, and what throws.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-props-from-server-to-client-components-serialization" target="_blank" rel="noopener">
  <span class="lc-ico">🚧</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Serialization at the boundary</span><span class="lc-sub">The Next.js-specific notes, including the Prisma and Date cases.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Pass a string and a number from a Server to a Client Component — works; then try passing a function and read the serialization error.</li>
<li>Pass a Date (it arrives as a real Date) and a class instance (the build fails); convert the instance to a plain value first.</li>
<li>State the rule: props crossing the boundary must be serializable.</li>
</ol>
<p><strong>Done when:</strong> you can identify which props cross the server/client boundary safely.</p></div>

<h3>🔬 Measured: what crosses, what breaks, what leaks (Next.js 16.4.6)</h3>
<p>A Server Component passes 12 values to a Client Component that prints what it actually received:</p>
<pre><code class="language-tsx">import XemKieu from './XemKieu';

export default function TrangProps() {
  return (
    &lt;main className="p-4"&gt;
      &lt;XemKieu
        chuoi="xin chào" so={42} dung={true} rong={null} khongCo={undefined}
        mang={[1, 2, 3]} doiTuong={{ id: 7, ten: 'An' }}
        ngay={new Date('2026-11-13T00:00:00Z')} map={new Map([['a', 1], ['b', 2]])} tap={new Set(['x', 'y'])}
        lon={BigInt('9007199254740993')}
        phanTu={&lt;b&gt;element JSX do máy chủ render&lt;/b&gt;}
      /&gt;
    &lt;/main&gt;
  );
}</code></pre>
<p>In the RSC payload (inside the HTML), Date, Map, Set and BigInt get their own markers — <code>$D</code>, <code>$Q</code>, <code>$W</code>, <code>$n</code>:</p>
<div class="out">{"chuoi":"xin chào","so":42,"dung":true,"rong":null,"khongCo":"$undefined","mang":[1,2,3],"doiTuong":{"id":7,"ten":"An"},"ngay":"$D2026-11-13T00:00:00.000Z","map":"$Qa","tap":"$Wb","lon":"$n9007199254740993","phanTu":["$","b",null,{"children":"element JSX do máy chủ render"}]</div>
<p>What Chromium shows — each arrives as its real type; <code>khongCo</code> (undefined) is simply missing:</p>
<div class="out">chuoi → string xin chào
so → number 42
dung → boolean true
rong → null
mang → Array [1, 2, 3]
doiTuong → object {"id":7,"ten":"An"}
ngay → Date ✓ 2026-11-13
map → Map ✓ size 2
tap → Set ✓ size 2
lon → bigint ✓ 9007199254740993n
phanTu → element JSX do máy chủ render</div>
<p><b>What does not cross</b> — four builds, four errors. Note the first two: the same mistake gives a different message depending on the prop name:</p>
<div class="out">Error: Event handlers cannot be passed to Client Component props.
  {onLike: function onLike}
Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  {tinhGia: function tinhGia}
Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
Error: Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(vai-tro) cannot be found among global symbols.</div>
<p><b>What leaks.</b> A profile page passes a whole user row (values are fake) to a component that only shows the name. On screen: "👤 An". In the HTML every visitor downloads:</p>
<pre><code class="language-tsx">import TheTen from './TheTen';

const nguoi = { id: 7, ten: 'An', email: 'an@vi-du.test', matKhauHash: 'HASH-GIA-LAP-khong-phai-that' };

export default function HoSo() {
  return &lt;TheTen nguoi={nguoi} /&gt;;
}</code></pre>
<div class="out">matKhauHash\\":\\"HASH-GIA-LAP-khong-phai-that\\"</div>
<p>The serializer sends what you <i>pass</i>, not what you <i>render</i>. Pick the fields at the boundary (or <code>select</code> them in the query).</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
curl -s localhost:3000/props | grep -o "ngay[^,]*"      <span class="tok-comment">  # $D…</span>
curl -s localhost:3000/props/ho-so | grep -o "matKhauHash[^,]*" <span class="tok-comment">  # present in the HTML</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/prisma-orm/learn?lessonSlug=pr-4-2-select-include" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Prisma · 4.2 — select, include, and shaping the result</span><span class="lc-sub">Pick the fields in the query itself</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-2-1-da-co-csdl" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 2.1 — The attacker already has your database</span><span class="lc-sub">Why even a password hash must not leak</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Serializable</span><span class="v">Data that can be converted to JSON-like form to cross the wire.</span></div>
  <div class="kv"><span class="k">Boundary props</span><span class="v">Props passed from a Server to a Client Component.</span></div>
  <div class="kv"><span class="k">Non-serializable</span><span class="v">Functions, class instances and local symbols do not cross (Date, Map, Set, BigInt do).</span></div>
  <div class="kv"><span class="k">Plain data</span><span class="v">Strings, numbers, booleans, arrays and plain objects cross fine.</span></div>
  <div class="kv"><span class="k">Server actions as props</span><span class="v">Functions can cross only as Server Actions, not arbitrary closures.</span></div>
  <div class="kv"><span class="k">RSC payload</span><span class="v">The serialized stream React sends from server to client.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Props passed from a Server to a Client Component must be serializable.</li><li>Plain data — strings, numbers, booleans, arrays, plain objects — crosses fine.</li><li>Functions, class instances and some objects do not; convert to plain values first.</li><li>The exception is a Server Action, which may be passed as a callable prop.</li></ul>

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
<span class="tok-comment">//   "Event handlers cannot be passed to Client Component props."</span>
<span class="tok-comment">//   (tên prop khác ⇒ "Functions cannot be passed directly to Client Components…")</span></code></pre>

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
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Server Action</div><div class="lz-nsub">Một hàm đánh dấu <code>&#39;use server&#39;</code> truyền xuống được. React gửi một tham chiếu chứ không gửi mã, và gọi nó là tạo ra một request.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Element JSX</div><div class="lz-nsub">Đầu ra máy chủ đã vẽ sẵn, truyền vào làm children hoặc làm prop. Chính nó làm phép ghép chạy được.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Không được: hàm thường, thực thể class, symbol</div><div class="lz-nsub">Không có cách nào gửi một closure qua đường truyền. React ném ra một lỗi lúc build có gọi tên cái prop.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — truyền thẳng một model Prisma từ Server Component sang Client Component.</strong> <code>&lt;Editor note={note} /&gt;</code> với <code>note</code> lấy từ <code>prisma.note.findUnique()</code> thường thì chạy được, rồi một ngày nó không: một cột <code>Decimal</code> hay một lớp bọc riêng của Prisma là thực thể class, và React từ chối với &quot;Only plain objects, and a few built-ins, can be passed to Client Components&quot;. (Id kiểu <code>BigInt</code> thì không sao — đo ở dưới, nó tới nơi vẫn là <code>bigint</code>.) Tệ hơn, khi nó tuần tự hoá được thì bạn đã ship mọi cột sang trình duyệt — kể cả những cột truy vấn có chọn mà giao diện chẳng bao giờ hiện. Hãy ánh xạ sang một dáng tường minh ngay tại ranh giới: chọn đúng những field component cần và tự tay chuyển đổi các kiểu lạ.</p></div>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-client#serializable-types" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">react.dev — Các kiểu tuần tự hoá được</span><span class="lc-sub">Danh sách chính xác cái gì qua được ranh giới, và cái gì thì ném lỗi.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-props-from-server-to-client-components-serialization" target="_blank" rel="noopener">
  <span class="lc-ico">🚧</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Tuần tự hoá ở ranh giới</span><span class="lc-sub">Những ghi chú riêng của Next.js, gồm cả ca Prisma và Date.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Truyền một chuỗi và một số từ Server sang Client Component — được; rồi thử truyền một hàm và đọc lỗi serialize.</li>
<li>Truyền một Date (tới nơi vẫn là Date) và một thực thể class (build hỏng); đổi thực thể đó sang giá trị thuần trước.</li>
<li>Nói luật: prop vượt ranh giới phải serialize được.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nhận ra prop nào vượt ranh giới server/client an toàn.</p></div>

<h3>🔬 Đo thật: thứ qua được, thứ làm hỏng, thứ bị lộ (Next.js 16.4.6)</h3>
<p>Một Server Component truyền 12 giá trị cho một Client Component chuyên in thứ nó thật sự nhận được:</p>
<pre><code class="language-tsx">import XemKieu from './XemKieu';

export default function TrangProps() {
  return (
    &lt;main className="p-4"&gt;
      &lt;XemKieu
        chuoi="xin chào" so={42} dung={true} rong={null} khongCo={undefined}
        mang={[1, 2, 3]} doiTuong={{ id: 7, ten: 'An' }}
        ngay={new Date('2026-11-13T00:00:00Z')} map={new Map([['a', 1], ['b', 2]])} tap={new Set(['x', 'y'])}
        lon={BigInt('9007199254740993')}
        phanTu={&lt;b&gt;element JSX do máy chủ render&lt;/b&gt;}
      /&gt;
    &lt;/main&gt;
  );
}</code></pre>
<p>Trong RSC payload (nằm trong HTML), Date, Map, Set và BigInt có ký hiệu riêng — <code>$D</code>, <code>$Q</code>, <code>$W</code>, <code>$n</code>:</p>
<div class="out">{"chuoi":"xin chào","so":42,"dung":true,"rong":null,"khongCo":"$undefined","mang":[1,2,3],"doiTuong":{"id":7,"ten":"An"},"ngay":"$D2026-11-13T00:00:00.000Z","map":"$Qa","tap":"$Wb","lon":"$n9007199254740993","phanTu":["$","b",null,{"children":"element JSX do máy chủ render"}]</div>
<p>Chromium hiện ra — mỗi giá trị tới đúng kiểu; <code>khongCo</code> (undefined) thì biến mất luôn:</p>
<div class="out">chuoi → string xin chào
so → number 42
dung → boolean true
rong → null
mang → Array [1, 2, 3]
doiTuong → object {"id":7,"ten":"An"}
ngay → Date ✓ 2026-11-13
map → Map ✓ size 2
tap → Set ✓ size 2
lon → bigint ✓ 9007199254740993n
phanTu → element JSX do máy chủ render</div>
<p><b>Thứ không qua được</b> — bốn lần build, bốn lỗi. Để ý hai cái đầu: cùng một lỗi nhưng thông điệp khác nhau tuỳ tên prop:</p>
<div class="out">Error: Event handlers cannot be passed to Client Component props.
  {onLike: function onLike}
Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  {tinhGia: function tinhGia}
Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
Error: Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(vai-tro) cannot be found among global symbols.</div>
<p><b>Thứ bị lộ.</b> Một trang hồ sơ truyền nguyên dòng người dùng (giá trị giả lập) cho component chỉ hiện tên. Trên màn hình: "👤 An". Trong HTML mọi khách tải về:</p>
<pre><code class="language-tsx">import TheTen from './TheTen';

const nguoi = { id: 7, ten: 'An', email: 'an@vi-du.test', matKhauHash: 'HASH-GIA-LAP-khong-phai-that' };

export default function HoSo() {
  return &lt;TheTen nguoi={nguoi} /&gt;;
}</code></pre>
<div class="out">matKhauHash\\":\\"HASH-GIA-LAP-khong-phai-that\\"</div>
<p>Bộ serialize gửi thứ bạn <i>truyền</i>, không phải thứ bạn <i>hiện</i>. Chọn trường ngay tại ranh giới (hoặc <code>select</code> trong câu truy vấn).</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
curl -s localhost:3000/props | grep -o "ngay[^,]*"      <span class="tok-comment">  # $D…</span>
curl -s localhost:3000/props/ho-so | grep -o "matKhauHash[^,]*" <span class="tok-comment">  # có trong HTML</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/prisma-orm/learn?lessonSlug=pr-4-2-select-include" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Prisma · 4.2 — select, include, và nắn hình kết quả</span><span class="lc-sub">Chọn đúng trường ngay trong câu truy vấn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-2-1-da-co-csdl" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 2.1 — Kẻ tấn công ĐÃ CÓ cơ sở dữ liệu của bạn</span><span class="lc-sub">Vì sao chuỗi băm mật khẩu cũng không được lộ</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Serialize được</span><span class="v">Dữ liệu chuyển được sang dạng giống JSON để vượt dây.</span></div>
  <div class="kv"><span class="k">Prop ranh giới</span><span class="v">Prop truyền từ Server sang Client Component.</span></div>
  <div class="kv"><span class="k">Không serialize được</span><span class="v">Hàm, thực thể class và Symbol tự tạo không vượt được (Date, Map, Set, BigInt thì được).</span></div>
  <div class="kv"><span class="k">Dữ liệu thuần</span><span class="v">Chuỗi, số, boolean, mảng và object thuần vượt tốt.</span></div>
  <div class="kv"><span class="k">Server action làm prop</span><span class="v">Hàm chỉ vượt được dưới dạng Server Action, không phải closure bất kỳ.</span></div>
  <div class="kv"><span class="k">RSC payload</span><span class="v">Luồng đã serialize React gửi từ server sang client.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Prop truyền từ Server sang Client Component phải serialize được.</li><li>Dữ liệu thuần — chuỗi, số, boolean, mảng, object thuần — vượt tốt.</li><li>Hàm, instance class và vài object thì không; đổi sang giá trị thuần trước.</li><li>Ngoại lệ là một Server Action, có thể truyền như một prop gọi được.</li></ul>

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
${G09_5}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Push the client boundary down to the leaves</h2>
<p class="lead">The whole game is: keep as much as possible on the server, and make only the genuinely interactive bits client. The pattern that achieves this is simple and worth memorising — a Server Component page that fetches, rendering small Client Component leaves for the interactive parts.</p>

<pre><code class="language-typescript"><span class="tok-comment">// app/feed/page.tsx — SERVER: fetches, renders markup</span>
export default async function FeedPage() {
  const posts = await getPosts();
  return (
    &lt;section&gt;
      {posts.map(p =&gt; (
        &lt;article key={p.id}&gt;
          &lt;h2&gt;{p.title}&lt;/h2&gt;
          &lt;p&gt;{p.body}&lt;/p&gt;
          &lt;LikeButton postId={p.id} count={p.likes} /&gt;   <span class="tok-comment">{/* tiny CLIENT leaf */}</span>
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
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Then check the bundle</b> — Next.js 16 no longer prints it in the <code>next build</code> table — read <code>firstLoadUncompressedJsBytes</code> per route in <code>.next/diagnostics/route-bundle-stats.json</code> (or DevTools Network). If a route grew, something crossed the boundary that did not have to.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a boundary drawn by file, not by responsibility.</strong> It is tempting to make one <code>components/ui</code> folder client because half of it needs interactivity. Every import from it then joins the bundle, including the purely presentational card and badge that could have stayed on the server — and because the directive is at the top of each file, nothing in the code shows what it cost. The measurable check is the per-route size from the build (<code>route-bundle-stats.json</code> in Next.js 16): compare it before and after a change. A route that gains 60kB — or, measured below, a whole megabyte — from a one-line directive is telling you the boundary is in the wrong place, and the fix is usually to split one file into two.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#moving-client-components-down-the-tree" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Moving Client Components down the tree</span><span class="lc-sub">The official recommendation, with a before-and-after example.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/next-config-js/bundlePagesRouterDependencies" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Analysing the bundle</span><span class="lc-sub">How to see what is actually in each route's JavaScript, rather than guessing.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Find a page where the whole thing is <code>'use client'</code> and move the directive down to only the interactive leaf (a button, a form).</li>
<li>Measure the client bundle before and after with <code>.next/diagnostics/route-bundle-stats.json</code> (Next.js 16) or DevTools Network.</li>
<li>State the heuristic: keep pages as Server Components, push <code>'use client'</code> to the smallest interactive leaves.</li>
</ol>
<p><strong>Done when:</strong> you can place the boundary to minimise client JavaScript.</p></div>

<h3>🔬 Measured: one feed, two boundaries (Next.js 16.4.6)</h3>
<p>The same feed twice — Markdown via <code>marked</code>, code highlighting via <code>highlight.js</code>, dates via <code>date-fns</code>, and a like button. <code>/feed-a</code> puts <code>'use client'</code> on the page; <code>/feed-b</code> keeps the page on the server and makes only <code>LikeButton</code> a client leaf:</p>
<pre><code class="language-tsx">import { marked } from 'marked';
import hljs from 'highlight.js';
import { format } from 'date-fns';
import baiViet from '@/data/bai-viet.json';
import LikeButton from '@/components/LikeButton';

marked.use({ renderer: { code: ({ text, lang }) =&gt; &#96;&lt;pre&gt;&lt;code&gt;\${hljs.highlight(text, { language: lang || 'plaintext' }).value}&lt;/code&gt;&lt;/pre&gt;&#96; } });

export default function FeedB() {
  return (
    &lt;section className="space-y-3 p-4 font-sans"&gt;
      {baiViet.map((p) =&gt; (
        &lt;article key={p.id} className="rounded border p-2"&gt;
          &lt;h2 className="font-bold"&gt;{p.tieuDe} · {format(new Date(p.ngay), 'dd/MM/yyyy')}&lt;/h2&gt;
          &lt;div dangerouslySetInnerHTML={{ __html: marked.parse(p.noiDung) as string }} /&gt;
          &lt;LikeButton postId={p.id} count={p.thich} /&gt;
        &lt;/article&gt;
      ))}
    &lt;/section&gt;
  );
}</code></pre>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function LikeButton({ postId, count }: { postId: number; count: number }) {
  const [n, setN] = useState(count);
  return &lt;button id={'like-' + postId} className="rounded border px-2" onClick={() =&gt; setN(n + 1)}&gt;♥ {n}&lt;/button&gt;;
}</code></pre>
<p><code>next build</code> no longer prints sizes; Next.js 16 writes them to <code>.next/diagnostics/route-bundle-stats.json</code> — and they match what Chromium downloaded byte for byte:</p>
<div class="out">/feed-a  1,493,185 B JS lần tải đầu (chưa nén)
/feed-b  457,427 B JS lần tải đầu (chưa nén)
số chunk chứa highlight.js: 1
chunk đó — chưa nén: 1036115 B · gzip qua mạng: 329096 B</div>
<p>Both pages look the same and both like buttons work. One directive added <b>1,035,758 B</b> of JavaScript — the chunk with marked + highlight.js + date-fns + the posts, still ~329 kB gzipped. In <code>/feed-b</code> the only client chunk of the page is the like button: 357 B.</p>
<p><b>The snippet above, as it used to be:</b> <code>// tiny CLIENT leaf</code> after <code>&lt;LikeButton /&gt;</code>, inside <code>&lt;article&gt;</code>, is <b>text</b>:</p>
<div class="out">♥ 3&lt;/button&gt;   // lá CLIENT nhỏ xíu&lt;/article&gt;
  16:55  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes</div>
<p><b>The isHydrated story, in this repo.</b> Commit <code>1ab25c7cc</code> (13/09/2026): <code>/wallet</code> and <code>/llm-key</code> told a logged-in user to log in — both gated on one store flag. The fix, <code>frontend/src/hooks/useDaDangNhap.ts</code>, adds a local <code>mounted</code> flag and reads the stored auth directly:</p>
<div class="out">export function useDaDangNhap(): TrangThaiDangNhap {
  const isAuthenticated = useAuthStore((s) =&gt; s.isAuthenticated);
  const user = useAuthStore((s) =&gt; s.user);

  return {
    daDangNhap: (isAuthenticated &amp;&amp; user != null) || luuTru,
    sanSang: mounted,
  };</div>
<p>And an observation worth a look: <code>page.tsx: 347 · có use client ở đầu: 262</code> — most pages of this site start with <code>'use client'</code>. Each is a candidate for this lesson's question.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm i marked highlight.js date-fns
npm run build
node -e "for (const r of require('./.next/diagnostics/route-bundle-stats.json')) console.log(r.route, r.firstLoadUncompressedJsBytes)"</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-3-lazy" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.3 — Code splitting and lazy loading</span><span class="lc-sub">Shrinking the bundle when everything lives in the browser</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-10-1-lazy-suspense" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 10.1 — lazy() & Suspense</span><span class="lc-sub">Same goal, the browser-only way</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Boundary placement</span><span class="v">Where you put <code>'use client'</code> in the tree.</span></div>
  <div class="kv"><span class="k">Push down</span><span class="v">Keep client code in small leaves, not whole pages.</span></div>
  <div class="kv"><span class="k">Client island</span><span class="v">A small interactive piece inside a server page.</span></div>
  <div class="kv"><span class="k">Bundle size</span><span class="v">Measured in the build output; shrinks as you push the boundary down.</span></div>
  <div class="kv"><span class="k">Server by default</span><span class="v">Leave everything server unless it needs interactivity.</span></div>
  <div class="kv"><span class="k">200KB trap</span><span class="v">One misplaced <code>'use client'</code> can pull half the app into the browser.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Keep pages as Server Components and push <code>'use client'</code> to the smallest interactive leaves.</li><li>A misplaced directive at the top of a page pulls everything below into the browser bundle.</li><li>Think in client islands: small interactive pieces inside a server page.</li><li>Verify with the build output — the client bundle should shrink as you push the boundary down.</li></ul>

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

<pre><code class="language-typescript"><span class="tok-comment">// app/feed/page.tsx — SERVER: fetch, render markup</span>
export default async function FeedPage() {
  const posts = await getPosts();
  return (
    &lt;section&gt;
      {posts.map(p =&gt; (
        &lt;article key={p.id}&gt;
          &lt;h2&gt;{p.title}&lt;/h2&gt;
          &lt;p&gt;{p.body}&lt;/p&gt;
          &lt;LikeButton postId={p.id} count={p.likes} /&gt;   <span class="tok-comment">{/* lá CLIENT nhỏ xíu */}</span>
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
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Rồi kiểm lại cái gói</b> — Next.js 16 không còn in số này trong bảng của <code>next build</code> — đọc <code>firstLoadUncompressedJsBytes</code> từng route trong <code>.next/diagnostics/route-bundle-stats.json</code> (hoặc tab Network). Nếu một route phình lên thì có thứ gì đó đã vượt ranh giới mà lẽ ra không cần.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một ranh giới vạch theo file, chứ không vạch theo trách nhiệm.</strong> Rất dễ bị cám dỗ đánh dấu cả một thư mục <code>components/ui</code> là client vì một nửa trong đó cần tương tác. Từ đó mọi phép import từ nó đều gia nhập gói, kể cả cái thẻ và cái nhãn thuần trang trí lẽ ra ở lại máy chủ được — và vì chỉ thị nằm ở đầu mỗi file, chẳng có gì trong mã cho thấy nó tốn bao nhiêu. Phép kiểm đo được là kích thước từng route mà build ghi lại (<code>route-bundle-stats.json</code> ở Next.js 16): hãy so trước và sau một thay đổi. Một route phình thêm 60kB — hay, như đo ở dưới, cả một megabyte — chỉ vì một dòng chỉ thị đang nói với bạn rằng ranh giới đặt sai chỗ, và cách chữa thường là tách một file thành hai.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#moving-client-components-down-the-tree" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Đẩy Client Component xuống thấp trong cây</span><span class="lc-sub">Khuyến nghị chính thức, kèm ví dụ trước-và-sau.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/next-config-js/bundlePagesRouterDependencies" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Phân tích gói</span><span class="lc-sub">Cách nhìn thấy thật sự có gì trong JavaScript của từng route, thay vì đoán.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tìm một trang mà cả trang là <code>'use client'</code> và dời chỉ thị xuống chỉ đúng lá tương tác (một nút, một form).</li>
<li>Đo bundle client trước và sau bằng <code>.next/diagnostics/route-bundle-stats.json</code> (Next.js 16) hoặc tab Network.</li>
<li>Nói heuristic: giữ trang là Server Component, đẩy <code>'use client'</code> xuống những lá tương tác nhỏ nhất.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đặt được ranh giới để tối thiểu hoá JavaScript client.</p></div>

<h3>🔬 Đo thật: một feed, hai ranh giới (Next.js 16.4.6)</h3>
<p>Cùng một feed hai lần — Markdown bằng <code>marked</code>, tô màu mã bằng <code>highlight.js</code>, ngày tháng bằng <code>date-fns</code>, và một nút thích. <code>/feed-a</code> đặt <code>'use client'</code> ở trang; <code>/feed-b</code> giữ trang ở máy chủ, chỉ <code>LikeButton</code> là lá client:</p>
<pre><code class="language-tsx">import { marked } from 'marked';
import hljs from 'highlight.js';
import { format } from 'date-fns';
import baiViet from '@/data/bai-viet.json';
import LikeButton from '@/components/LikeButton';

marked.use({ renderer: { code: ({ text, lang }) =&gt; &#96;&lt;pre&gt;&lt;code&gt;\${hljs.highlight(text, { language: lang || 'plaintext' }).value}&lt;/code&gt;&lt;/pre&gt;&#96; } });

export default function FeedB() {
  return (
    &lt;section className="space-y-3 p-4 font-sans"&gt;
      {baiViet.map((p) =&gt; (
        &lt;article key={p.id} className="rounded border p-2"&gt;
          &lt;h2 className="font-bold"&gt;{p.tieuDe} · {format(new Date(p.ngay), 'dd/MM/yyyy')}&lt;/h2&gt;
          &lt;div dangerouslySetInnerHTML={{ __html: marked.parse(p.noiDung) as string }} /&gt;
          &lt;LikeButton postId={p.id} count={p.thich} /&gt;
        &lt;/article&gt;
      ))}
    &lt;/section&gt;
  );
}</code></pre>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function LikeButton({ postId, count }: { postId: number; count: number }) {
  const [n, setN] = useState(count);
  return &lt;button id={'like-' + postId} className="rounded border px-2" onClick={() =&gt; setN(n + 1)}&gt;♥ {n}&lt;/button&gt;;
}</code></pre>
<p><code>next build</code> không còn in kích thước; Next.js 16 ghi chúng vào <code>.next/diagnostics/route-bundle-stats.json</code> — và khớp từng byte với thứ Chromium tải về:</p>
<div class="out">/feed-a  1,493,185 B JS lần tải đầu (chưa nén)
/feed-b  457,427 B JS lần tải đầu (chưa nén)
số chunk chứa highlight.js: 1
chunk đó — chưa nén: 1036115 B · gzip qua mạng: 329096 B</div>
<p>Hai trang nhìn giống nhau, nút thích đều chạy. Một dòng chỉ thị thêm <b>1,035,758 B</b> JavaScript — chunk chứa marked + highlight.js + date-fns + dữ liệu bài, nén gzip vẫn ~329 kB. Ở <code>/feed-b</code>, chunk client duy nhất của trang là nút thích: 357 B.</p>
<p><b>Đoạn mã ở trên, như bản cũ:</b> <code>// lá CLIENT nhỏ xíu</code> sau <code>&lt;LikeButton /&gt;</code>, trong <code>&lt;article&gt;</code>, là <b>chữ</b>:</p>
<div class="out">♥ 3&lt;/button&gt;   // lá CLIENT nhỏ xíu&lt;/article&gt;
  16:55  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes</div>
<p><b>Chuyện isHydrated, ngay trong kho này.</b> Commit <code>1ab25c7cc</code> (13/09/2026): <code>/wallet</code> và <code>/llm-key</code> bảo một người đang đăng nhập hãy đăng nhập — cả hai gác bằng một cờ của store. Bản sửa, <code>frontend/src/hooks/useDaDangNhap.ts</code>, thêm cờ <code>mounted</code> cục bộ và đọc thẳng dữ liệu đăng nhập đã lưu:</p>
<div class="out">export function useDaDangNhap(): TrangThaiDangNhap {
  const isAuthenticated = useAuthStore((s) =&gt; s.isAuthenticated);
  const user = useAuthStore((s) =&gt; s.user);

  return {
    daDangNhap: (isAuthenticated &amp;&amp; user != null) || luuTru,
    sanSang: mounted,
  };</div>
<p>Và một quan sát đáng xem: <code>page.tsx: 347 · có use client ở đầu: 262</code> — phần lớn trang của chính web này mở đầu bằng <code>'use client'</code>. Mỗi trang là một ứng viên cho câu hỏi của bài này.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm i marked highlight.js date-fns
npm run build
node -e "for (const r of require('./.next/diagnostics/route-bundle-stats.json')) console.log(r.route, r.firstLoadUncompressedJsBytes)"</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-3-lazy" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.3 — Chia nhỏ bundle và tải lười: route, Suspense, bẫy barrel và ảnh</span><span class="lc-sub">Thu nhỏ gói khi mọi thứ ở trình duyệt</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-10-1-lazy-suspense" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 10.1 — lazy() & Suspense</span><span class="lc-sub">Cùng mục tiêu, cách của ứng dụng thuần trình duyệt</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đặt ranh giới</span><span class="v">Nơi bạn đặt <code>'use client'</code> trong cây.</span></div>
  <div class="kv"><span class="k">Đẩy xuống</span><span class="v">Giữ mã client ở các lá nhỏ, không phải cả trang.</span></div>
  <div class="kv"><span class="k">Đảo client</span><span class="v">Một mảnh tương tác nhỏ trong một trang server.</span></div>
  <div class="kv"><span class="k">Kích thước bundle</span><span class="v">Đo ở output build; nhỏ lại khi bạn đẩy ranh giới xuống.</span></div>
  <div class="kv"><span class="k">Mặc định server</span><span class="v">Để mọi thứ là server trừ khi cần tương tác.</span></div>
  <div class="kv"><span class="k">Bẫy 200KB</span><span class="v">Một <code>'use client'</code> đặt sai có thể kéo nửa ứng dụng vào trình duyệt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Giữ trang là Server Component và đẩy <code>'use client'</code> xuống những lá tương tác nhỏ nhất.</li><li>Một chỉ thị đặt sai ở đầu trang kéo mọi thứ bên dưới vào bundle trình duyệt.</li><li>Tư duy theo đảo client: các mảnh tương tác nhỏ trong một trang server.</li><li>Kiểm bằng output build — bundle client phải nhỏ lại khi bạn đẩy ranh giới xuống.</li></ul>

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
