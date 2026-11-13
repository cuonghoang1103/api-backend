/**
 * Next.js & React — Chương 10: Fetch dữ liệu, cache & revalidate.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * ⚠ Cache mặc định của fetch ĐÃ ĐỔI giữa các phiên bản Next (14 cache sẵn;
 * 15+ KHÔNG cache mặc định). Bài dạy theo mô hình HIỆN HÀNH (15+: không cache,
 * opt-in) và nói rõ điểm nhạy phiên bản này thay vì khẳng định một mặc định
 * có thể sai. Không có "output console" để chạy — chương thuần cơ chế/quy ước.
 */

import G10_1 from './giang/nxj-10-1.mjs';
import G10_2 from './giang/nxj-10-2.mjs';
import G10_3 from './giang/nxj-10-3.mjs';
import G10_4 from './giang/nxj-10-4.mjs';
import G10_5 from './giang/nxj-10-5.mjs';
export default {
  title: 'Chapter 10 — Data fetching, caching, and revalidating|||Chương 10 — Fetch dữ liệu, cache và revalidate',
  description: 'Server Component fetch dữ liệu bằng await ngay trong thân — không cần useEffect. Next mở rộng fetch với cache và revalidate (theo thời gian và theo yêu cầu). Streaming với loading.tsx và Suspense, và cái bẫy waterfall.',
  lessons: [
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — Fetch where the data lives: async Server Components|||10.1 — Fetch ngay tại nguồn: Server Component bất đồng bộ',
      slug: 'nextjs-10-1-fetch-trong-server-component',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "NextJS Tutorial - All 12 Concepts You Need to Know" — ByteGrad (oEmbed verified).
      video: { url: 'https://youtu.be/vwSlYG7hFk0', durationSeconds: 0 },
      description: 'Chương 9 nói Server Component có thể async. Đây là hệ quả lớn nhất: bạn fetch dữ liệu bằng await ngay trong component — không useEffect, không state loading, không spinner cho dữ liệu ban đầu.',
      content: `
${G10_1}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>The default way to load data is just await</h2>
<p class="lead">In Chapter 5 you fetched on the client with <code>useEffect</code>, a loading state, and a race guard. In the App Router, the <em>default</em> place to load a page's data is a Server Component — and there it is far simpler: mark the component <code>async</code> and <code>await</code> the data directly in the body.</p>

<pre><code class="language-javascript"><span class="tok-comment">// app/courses/page.tsx — a Server Component</span>
export default async function CoursesPage() {
  const res = await fetch('https://api.cuongthai.com/courses');
  const courses = await res.json();
  return &lt;CourseList items={courses} /&gt;;
}</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">No useEffect</span><span class="v">The data is awaited before the component renders. There is no "empty then filled" — the first HTML already contains the data.</span></div>
  <div class="kv"><span class="k">No loading state to wire</span><span class="v">You do not manage a <code>loading</code> boolean for the initial fetch. (Streaming/Suspense handles slow parts — lesson 10.4.)</span></div>
  <div class="kv"><span class="k">No client race</span><span class="v">The out-of-order response bug from lesson 5.5 does not exist here — one request, resolved on the server before render.</span></div>
  <div class="kv"><span class="k">Or skip fetch entirely</span><span class="v">If the data is in your own database, a Server Component can <code>await db.course.findMany()</code> directly — no HTTP hop at all.</span></div>
</div>

<h3>When you still fetch on the client</h3>
<p>Server fetching is for data the page needs to render. You still fetch on the client for things that happen <em>after</em> interaction: data that depends on user actions, live updates, infinite scroll, anything tied to client state. For those, a Client Component with <code>useEffect</code> — or better, a library like TanStack Query (Chapter 14) — is right. The rule: <strong>initial page data → server; interaction-driven data → client.</strong></p>

<div class="callout ok">
<p><strong>Why this is a big deal:</strong> the classic React SPA shows a spinner, then fetches, then fills in — three states the user sees and you must code. A Server Component collapses that to one: the server waits, then sends finished HTML. Fewer states, less code, and the content is present for SEO and the first paint.</p>
</div>

<h3>Fetching where the data lives</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>await straight in the component</b> — No effect, no loading state, no <code>useState</code>. The component is async and the framework waits for it.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It runs before the HTML is sent</b> — So the user never sees an empty shell that then fills in — the first paint already has the data. (On a page that reads nothing from the request, "before" means <b>at <code>next build</code></b>: it renders once, statically — measured below.)</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Requests are deduplicated per render — for <code>fetch</code></b> — Two components asking for the same URL with <code>fetch</code> (GET) in one request produce one call. Measured: <code>axios</code> or a DB client like Prisma is <b>not</b> merged (3 components ⇒ 3 calls) — wrap that function in React <code>cache()</code>. Then you can fetch where you need it instead of threading props.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Talk to the database directly</b> — There is no reason to call your own API route from a Server Component; that is a network hop to your own process.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a sequential chain of awaits that turns into a waterfall.</strong> <code>const user = await getUser(); const posts = await getPosts(user.id); const stats = await getStats(user.id);</code> takes the sum of all three, and the last two do not depend on each other at all. Locally each call takes 5ms and nobody notices; against a real database with 40ms of latency it is 120ms of pure waiting on every request. Only the second call genuinely needs the first — run the independent ones together with <code>Promise.all</code>. When a page feels slow and the queries are fast, this is almost always what is happening.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching" target="_blank" rel="noopener">
  <span class="lc-ico">📥</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Data fetching</span><span class="lc-sub">Fetching in Server Components, deduplication, and the parallel patterns.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#parallel-and-sequential-data-fetching" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Parallel vs sequential fetching</span><span class="lc-sub">The waterfall this trap is about, drawn as a timeline.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write an <code>async</code> Server Component that <code>await</code>s a <code>fetch</code> and renders the result — no <code>useEffect</code>, no loading state.</li>
<li>Compare it to the Chapter 5 client-fetch effect and note what disappeared (no race, no loading flag, no effect).</li>
<li>Call a second fetch and observe the two run on the server before any HTML is sent.</li>
</ol>
<p><strong>Done when:</strong> you can fetch data directly in an async Server Component without an effect.</p></div>

<h3>🔬 Measured: when the await runs, what the user sees, what gets merged (Next.js 16.4.6)</h3>
<p>The lesson's code, pointed at a fake API that waits 600 ms (<code>?ms=600</code>). Build it, and look at the <b>API's</b> log:</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/khoa-hoc/page.tsx — một Server Component (đúng đoạn mã của bài, chỉ đổi URL sang API giả của lab)</span>
type KhoaHoc = { id: number; ten: string };

export default async function KhoaHocPage() {
  const res = await fetch('http://127.0.0.1:19385/khoa-hoc?ms=600');
  const ds: KhoaHoc[] = await res.json();
  return &lt;DanhSach items={ds} /&gt;;
}

function DanhSach({ items }: { items: KhoaHoc[] }) {
  return (
    &lt;ul id="ds" className="list-disc p-4 pl-8 font-sans"&gt;
      {items.map((k) =&gt; &lt;li key={k.id}&gt;{k.ten}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}</code></pre>
<div class="out">├ ○ /khoa-hoc
└ ○ /khoa-hoc-client
○  (Static)  prerendered as static content

# API log, during npm run build:
[api] 21:34:33.729 GET /khoa-hoc?ms=600 · lượt #1 · chờ 600 ms</div>
<p>The page reads nothing from the request, so Next.js rendered it <b>once, at build time</b> (○ Static) — the API was called by the build, and later visitors get that HTML without calling it again (lesson 10.2). One line makes it render per request:</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/khoa-hoc/page.tsx — thêm MỘT dòng: render theo từng request</span>
import { connection } from 'next/server';

type KhoaHoc = { id: number; ten: string };

export default async function KhoaHocPage() {
  await connection();                     <span class="tok-comment">  // chờ có request thật rồi mới render (bài 10.2 nói kỹ)</span>
  const res = await fetch('http://127.0.0.1:19385/khoa-hoc?ms=600');
  const ds: KhoaHoc[] = await res.json();
  return &lt;DanhSach items={ds} /&gt;;
}

function DanhSach({ items }: { items: KhoaHoc[] }) {
  return (
    &lt;ul id="ds" className="list-disc p-4 pl-8 font-sans"&gt;
      {items.map((k) =&gt; &lt;li key={k.id}&gt;{k.ten}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}</code></pre>
<div class="out">├ ƒ /khoa-hoc
$ for i in 1 2 3; do curl -s -o /dev/null -w "lần $i: %{time_total} s\\n" localhost:19386/khoa-hoc; done
lần 1: 0.660501 s
lần 2: 0.611318 s
lần 3: 0.612972 s
$ curl -s localhost:19386/khoa-hoc | grep -o '&lt;ul id="ds".*&lt;/ul&gt;'
&lt;ul id="ds" class="list-disc p-4 pl-8 font-sans"&gt;&lt;li&gt;React&lt;/li&gt;&lt;li&gt;Next.js&lt;/li&gt;&lt;li&gt;Node.js&lt;/li&gt;&lt;/ul&gt;</div>
<p><b>In a real Chromium</b>, side by side with the Chapter 5 version (<code>useEffect</code> + fetch to the same API): the Server Component page's first byte arrives at <b>613 ms</b> with the list inside, and the browser makes <b>0</b> requests to the API — but until then the screen shows nothing new. The client version shows "Đang tải…" after 3 ms; the browser itself calls the API (46→651 ms), so the API must be public and allow CORS. About the same total wait, a different screen. Long waits are fixed with streaming (10.4), not by going back to <code>useEffect</code>. With JavaScript off, the server page still shows the list; the client page stays on "Đang tải…".</p>
<p><b>Deduplication, measured.</b> The same user is requested in a layout and in two cards — each place with <code>fetch</code>, <code>axios</code>, and <code>axios</code> wrapped in React <code>cache()</code>. Two requests, then count hits at the API:</p>
<pre><code class="language-typescript">import axios from 'axios';
import { cache } from 'react';

const API = 'http://127.0.0.1:19385';

<span class="tok-comment">// 1) fetch — Next.js tự gộp các lời gọi GET giống hệt trong MỘT lần render</span>
export async function layBangFetch() {
  return (await fetch(&#96;\${API}/nguoi-dung?qua=fetch&#96;)).json();
}

<span class="tok-comment">// 2) axios — không đi qua fetch ⇒ không ai gộp (client CSDL như Prisma cũng vậy)</span>
export async function layBangAxios() {
  return (await axios.get(&#96;\${API}/nguoi-dung?qua=axios&#96;)).data;
}

<span class="tok-comment">// 3) axios bọc trong cache() của React ⇒ gộp lại, chỉ trong một request</span>
export const layBangCache = cache(async () =&gt; {
  return (await axios.get(&#96;\${API}/nguoi-dung?qua=cache&#96;)).data;
});</code></pre>
<div class="out">  6 lượt  /nguoi-dung?qua=axios
  2 lượt  /nguoi-dung?qua=cache
  2 lượt  /nguoi-dung?qua=fetch</div>
<p>Only <code>fetch</code> is merged automatically (1 call per request). <code>axios</code> — and any DB client — is called 3 times per request until you wrap it in <code>cache()</code>; that memo lives for one request only.</p>
<p><b>The waterfall, measured</b> (each API call waits 300 ms). Three awaits in a row vs <code>user</code> first, then <code>Promise.all</code> for the two that only need <code>user.id</code> — the API log shows when each call started:</p>
<pre><code class="language-tsx">import { connection } from 'next/server';

const lay = async (p: string) =&gt; (await fetch('http://127.0.0.1:19385' + p)).json();

export default async function SongSong() {
  await connection();
  const user = await lay('/nguoi-dung');             <span class="tok-comment">  // 300 ms — hai cái sau cần nó</span>
  const [posts, stats] = await Promise.all([         <span class="tok-comment">  // hai cái độc lập: chạy CÙNG LÚC</span>
    lay(&#96;/bai-viet?u=\${user.id}&#96;),
    lay(&#96;/thong-ke?u=\${user.id}&#96;),
  ]);
  return &lt;p className="p-4 font-sans"&gt;{user.ten}: {posts.length} bài, {stats.binhLuan} bình luận&lt;/p&gt;;
}</code></pre>
<div class="out"># sequential
[api] 21:34:47.740 GET /nguoi-dung · lượt #1 · chờ 300 ms
[api] 21:34:48.044 GET /bai-viet?u=7 · lượt #1 · chờ 300 ms
[api] 21:34:48.346 GET /thong-ke?u=7 · lượt #1 · chờ 300 ms
# user, then Promise.all
[api] 21:34:48.679 GET /nguoi-dung · lượt #2 · chờ 300 ms
[api] 21:34:48.983 GET /bai-viet?u=7 · lượt #2 · chờ 300 ms
[api] 21:34:48.983 GET /thong-ke?u=7 · lượt #2 · chờ 300 ms
noi-tiep lần 1: 0.915194 s
noi-tiep lần 2: 0.915998 s
noi-tiep lần 3: 0.911808 s
song-song lần 1: 0.610796 s
song-song lần 2: 0.610415 s
song-song lần 3: 0.628488 s</div>
<p><b>Calling your own API route over HTTP</b> from a Server Component — measured: the build fails while prerendering, because nothing is listening yet:</p>
<pre><code class="language-tsx"><span class="tok-comment">// Server Component gọi route API của CHÍNH app này qua HTTP</span>
export default async function Vong() {
  const ds = await (await fetch('http://localhost:19386/api/khoa-hoc')).json();
  return &lt;ul&gt;{ds.map((k: { id: number; ten: string }) =&gt; &lt;li key={k.id}&gt;{k.ten}&lt;/li&gt;)}&lt;/ul&gt;;
}</code></pre>
<div class="out">Error occurred prerendering page "/vong". Read more: https://nextjs.org/docs/messages/prerender-error
TypeError: fetch failed
    code: 'ECONNREFUSED',
      Error: connect ECONNREFUSED ::1:19386</div>
<h3>🔁 Run it yourself</h3>
<p>The fake API used above (save as <code>api.mjs</code> next to your project, run <code>node api.mjs 19385</code>): one log line per request, with milliseconds.</p>
<pre><code class="language-javascript"><span class="tok-comment">// api.mjs — API giả cho Chương 10 (chạy: node api.mjs 19385). Mỗi request in MỘT dòng log có giờ:phút:giây.mili-giây.</span>
<span class="tok-comment">// ?ms=&lt;số&gt; đổi độ trễ · GET /dem = số lượt gọi từng URL · POST /dat-lai = xoá bộ đếm · POST /gia?v=&lt;số&gt; = đổi giá (dữ liệu "đổi ở nguồn").</span>
import http from 'node:http';
const PORT = Number(process.argv[2] ?? 19385);
const TRE = { '/nguoi-dung': 300, '/bai-viet': 300, '/thong-ke': 300 }; <span class="tok-comment">  // độ trễ mặc định (ms)</span>
let dem = {}, gia = 100;
const gio = () =&gt; new Date().toTimeString().slice(0, 8) + '.' + String(Date.now() % 1000).padStart(3, '0');
const ngu = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const DL = {
  '/khoa-hoc': () =&gt; [{ id: 1, ten: 'React' }, { id: 2, ten: 'Next.js' }, { id: 3, ten: 'Node.js' }],
  '/nguoi-dung': () =&gt; ({ id: 7, ten: 'An' }),
  '/bai-viet': () =&gt; [{ id: 1, tieuDe: 'Server Component' }, { id: 2, tieuDe: 'Streaming' }],
  '/thong-ke': () =&gt; ({ baiViet: 2, binhLuan: 15 }),
  '/gia': () =&gt; ({ gia, luc: gio() }),
};
http.createServer(async (req, res) =&gt; {
  const u = new URL(req.url, 'http://x'), p = u.pathname;
  const tra = (o, ma = 200) =&gt; { res.writeHead(ma, { 'content-type': 'application/json', 'access-control-allow-origin': '*' }); res.end(JSON.stringify(o)); };
  if (p === '/dem') return tra(dem);
  if (p === '/dat-lai') { dem = {}; return tra({ ok: true }); }
  if (req.method === 'POST' &amp;&amp; p === '/gia') { gia = Number(u.searchParams.get('v')); console.log(&#96;[api] \${gio()} ĐỔI giá ở nguồn ⇒ \${gia}&#96;); return tra({ gia }); }
  if (!DL[p]) return tra({ loi: 'không có' }, 404);
  const k = req.url; dem[k] = (dem[k] ?? 0) + 1;
  const ms = Number(u.searchParams.get('ms') ?? TRE[p] ?? 0);
  console.log(&#96;[api] \${gio()} \${req.method} \${req.url} · lượt #\${dem[k]} · chờ \${ms} ms&#96;);
  await ngu(ms);
  tra(DL[p]());
}).listen(PORT, '127.0.0.1', () =&gt; console.log(&#96;[api] nghe ở http://127.0.0.1:\${PORT}&#96;));</code></pre>
<pre><code class="language-bash">npm run build <span class="tok-comment">  # is /khoa-hoc ○ or ƒ? did the API log a request DURING the build?</span>
npx next start -p 3000
curl -s -o /dev/null -w "%{time_total} s\\n" localhost:3000/khoa-hoc
curl -s 127.0.0.1:19385/dem <span class="tok-comment">  # hits per URL</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-6-1-fetch" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 6.1 — Fetching in effects and why it hurts</span><span class="lc-sub">The measured race — what awaiting on the server removes</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-11-1-fetch-async" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 11.1 — fetch, promises & async/await</span><span class="lc-sub">fetch and async/await from the ground up</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-1-4-bat-dong-bo" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 1.4 — Async: callbacks, Promises, async/await</span><span class="lc-sub">Promise.all — the waterfall fix</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/prisma-orm/learn?lessonSlug=pr-4-1-sau-cach-doc" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Prisma ORM · 4.1 — The six ways to read</span><span class="lc-sub">query the DB directly in a Server Component (remember cache())</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">async component</span><span class="v">A Server Component can be async and <code>await</code> data.</span></div>
  <div class="kv"><span class="k">Server fetch</span><span class="v">Data is fetched on the server before the HTML is sent.</span></div>
  <div class="kv"><span class="k">No effect needed</span><span class="v">Initial data does not need <code>useEffect</code> here.</span></div>
  <div class="kv"><span class="k">No race</span><span class="v">Server fetching removes the client fetch race condition.</span></div>
  <div class="kv"><span class="k">Direct access</span><span class="v">You can query a database or API with secrets on the server.</span></div>
  <div class="kv"><span class="k">Co-located data</span><span class="v">Fetch where the data is rendered, in the component.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A Server Component can be <code>async</code> and <code>await</code> data directly — no <code>useEffect</code>, no loading flag.</li><li>Data is fetched on the server before the HTML is sent, so there is no client fetch race.</li><li>You can read databases and secrets directly because the code never reaches the browser.</li><li>Fetch where the data is rendered — co-located in the component.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching" target="_blank" rel="noopener">
  <span class="lc-ico">📥</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Data Fetching</span><span class="lc-sub">Fetching in Server Components with async/await, and when to fetch on the client.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Cách mặc định để tải dữ liệu chỉ là await</h2>
<p class="lead">Ở Chương 5 bạn fetch trên client với <code>useEffect</code>, một state loading, và một chốt chống đua. Trong App Router, chỗ <em>mặc định</em> để tải dữ liệu của một trang là một Server Component — và ở đó đơn giản hơn hẳn: đánh dấu component <code>async</code> và <code>await</code> dữ liệu thẳng trong thân.</p>

<pre><code class="language-javascript"><span class="tok-comment">// app/courses/page.tsx — một Server Component</span>
export default async function CoursesPage() {
  const res = await fetch('https://api.cuongthai.com/courses');
  const courses = await res.json();
  return &lt;CourseList items={courses} /&gt;;
}</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Không useEffect</span><span class="v">Dữ liệu được await trước khi component render. Không có "rỗng rồi đầy" — HTML đầu tiên đã chứa dữ liệu.</span></div>
  <div class="kv"><span class="k">Không phải nối state loading</span><span class="v">Bạn không quản một boolean <code>loading</code> cho lần fetch ban đầu. (Streaming/Suspense lo phần chậm — bài 10.4.)</span></div>
  <div class="kv"><span class="k">Không đua ở client</span><span class="v">Bug phản hồi về sai thứ tự ở bài 5.5 không tồn tại ở đây — một request, giải quyết trên server trước khi render.</span></div>
  <div class="kv"><span class="k">Hoặc bỏ hẳn fetch</span><span class="v">Nếu dữ liệu ở trong DB của chính bạn, một Server Component có thể <code>await db.course.findMany()</code> thẳng — không một cú HTTP nào.</span></div>
</div>

<h3>Khi nào vẫn fetch trên client</h3>
<p>Fetch trên server là cho dữ liệu trang cần để render. Bạn vẫn fetch trên client cho những thứ xảy ra <em>sau</em> tương tác: dữ liệu phụ thuộc hành động người dùng, cập nhật trực tiếp, cuộn vô hạn, bất cứ gì gắn với state client. Cho những cái đó, một Client Component với <code>useEffect</code> — hay tốt hơn, một thư viện như TanStack Query (Chương 14) — là đúng. Quy tắc: <strong>dữ liệu trang ban đầu → server; dữ liệu do tương tác → client.</strong></p>

<div class="callout ok">
<p><strong>Vì sao đây là chuyện lớn:</strong> SPA React kinh điển hiện spinner, rồi fetch, rồi lấp vào — ba trạng thái người dùng thấy và bạn phải code. Một Server Component gộp lại còn một: server đợi, rồi gửi HTML hoàn chỉnh. Ít trạng thái hơn, ít code hơn, và nội dung có sẵn cho SEO lẫn lần vẽ đầu.</p>
</div>

<h3>Lấy dữ liệu ngay chỗ dữ liệu nằm</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>await thẳng trong component</b> — Không effect, không trạng thái đang tải, không <code>useState</code>. Component là async và framework chờ nó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó chạy trước khi HTML được gửi đi</b> — Nên người dùng chẳng bao giờ thấy một cái vỏ rỗng rồi mới điền vào — lần vẽ đầu tiên đã có sẵn dữ liệu. (Với trang không đọc gì từ request, "trước" nghĩa là <b>lúc <code>next build</code></b>: render một lần, thành trang tĩnh — đo ở dưới.)</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Request được khử trùng lặp trong một lần render — với <code>fetch</code></b> — Hai component cùng hỏi một URL bằng <code>fetch</code> (GET) trong một request chỉ sinh ra một lượt gọi. Đo thật: <code>axios</code> hay thư viện CSDL như Prisma thì <b>không</b> được gộp (3 component ⇒ 3 lượt) — hãy bọc hàm đó trong <code>cache()</code> của React. Khi đó bạn lấy dữ liệu ngay chỗ cần thay vì luồn props.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nói chuyện thẳng với cơ sở dữ liệu</b> — Chẳng có lý do gì để gọi route API của chính mình từ một Server Component; đó là một chặng mạng đi vòng về chính tiến trình của bạn.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một chuỗi await tuần tự biến thành thác nước.</strong> <code>const user = await getUser(); const posts = await getPosts(user.id); const stats = await getStats(user.id);</code> tốn bằng tổng cả ba, mà hai cái sau chẳng hề phụ thuộc nhau. Ở máy bạn mỗi lời gọi mất 5ms và chẳng ai để ý; với một cơ sở dữ liệu thật có 40ms độ trễ thì đó là 120ms chờ thuần tuý ở mỗi request. Chỉ lời gọi thứ hai thật sự cần lời gọi thứ nhất — hãy chạy những cái độc lập cùng lúc bằng <code>Promise.all</code>. Khi một trang có cảm giác chậm mà các truy vấn đều nhanh thì gần như luôn là chuyện này.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching" target="_blank" rel="noopener">
  <span class="lc-ico">📥</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Lấy dữ liệu</span><span class="lc-sub">Lấy dữ liệu trong Server Component, khử trùng lặp, và các mẫu song song.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#parallel-and-sequential-data-fetching" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Lấy song song với tuần tự</span><span class="lc-sub">Cái thác nước mà bẫy này nói tới, vẽ ra thành dòng thời gian.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết một Server Component <code>async</code> <code>await</code> một <code>fetch</code> và render kết quả — không <code>useEffect</code>, không state loading.</li>
<li>So với effect fetch-phía-client ở Chương 5 và để ý cái gì biến mất (không đua, không cờ loading, không effect).</li>
<li>Gọi một fetch thứ hai và quan sát hai cái chạy trên server trước khi gửi HTML nào.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn fetch được dữ liệu thẳng trong một async Server Component mà không cần effect.</p></div>

<h3>🔬 Đo thật: await chạy lúc nào, người dùng thấy gì, cái gì được gộp (Next.js 16.4.6)</h3>
<p>Đúng đoạn mã của bài, trỏ tới một API giả cố ý chờ 600 ms (<code>?ms=600</code>). Build, rồi nhìn log của <b>API</b>:</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/khoa-hoc/page.tsx — một Server Component (đúng đoạn mã của bài, chỉ đổi URL sang API giả của lab)</span>
type KhoaHoc = { id: number; ten: string };

export default async function KhoaHocPage() {
  const res = await fetch('http://127.0.0.1:19385/khoa-hoc?ms=600');
  const ds: KhoaHoc[] = await res.json();
  return &lt;DanhSach items={ds} /&gt;;
}

function DanhSach({ items }: { items: KhoaHoc[] }) {
  return (
    &lt;ul id="ds" className="list-disc p-4 pl-8 font-sans"&gt;
      {items.map((k) =&gt; &lt;li key={k.id}&gt;{k.ten}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}</code></pre>
<div class="out">├ ○ /khoa-hoc
└ ○ /khoa-hoc-client
○  (Static)  prerendered as static content

# log API, trong lúc npm run build:
[api] 21:34:33.729 GET /khoa-hoc?ms=600 · lượt #1 · chờ 600 ms</div>
<p>Trang không đọc gì từ request nên Next.js render nó <b>một lần, lúc build</b> (○ Static) — chính lần build đã gọi API, người xem sau nhận HTML đó mà API không bị gọi lại (bài 10.2). Một dòng làm nó render theo từng request:</p>
<pre><code class="language-tsx"><span class="tok-comment">// app/khoa-hoc/page.tsx — thêm MỘT dòng: render theo từng request</span>
import { connection } from 'next/server';

type KhoaHoc = { id: number; ten: string };

export default async function KhoaHocPage() {
  await connection();                     <span class="tok-comment">  // chờ có request thật rồi mới render (bài 10.2 nói kỹ)</span>
  const res = await fetch('http://127.0.0.1:19385/khoa-hoc?ms=600');
  const ds: KhoaHoc[] = await res.json();
  return &lt;DanhSach items={ds} /&gt;;
}

function DanhSach({ items }: { items: KhoaHoc[] }) {
  return (
    &lt;ul id="ds" className="list-disc p-4 pl-8 font-sans"&gt;
      {items.map((k) =&gt; &lt;li key={k.id}&gt;{k.ten}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}</code></pre>
<div class="out">├ ƒ /khoa-hoc
$ for i in 1 2 3; do curl -s -o /dev/null -w "lần $i: %{time_total} s\\n" localhost:19386/khoa-hoc; done
lần 1: 0.660501 s
lần 2: 0.611318 s
lần 3: 0.612972 s
$ curl -s localhost:19386/khoa-hoc | grep -o '&lt;ul id="ds".*&lt;/ul&gt;'
&lt;ul id="ds" class="list-disc p-4 pl-8 font-sans"&gt;&lt;li&gt;React&lt;/li&gt;&lt;li&gt;Next.js&lt;/li&gt;&lt;li&gt;Node.js&lt;/li&gt;&lt;/ul&gt;</div>
<p><b>Trong Chromium thật</b>, đặt cạnh bản chương 5 (<code>useEffect</code> + fetch cùng API): trang Server Component nhận byte đầu ở <b>613 ms</b>, có sẵn danh sách, trình duyệt gửi <b>0</b> request tới API — nhưng trước mốc đó màn hình chưa có gì mới. Bản client hiện "Đang tải…" sau 3 ms; chính trình duyệt gọi API (46→651 ms), nên API phải công khai và mở CORS. Tổng thời gian gần bằng nhau, màn hình khác hẳn. Chờ lâu thì chữa bằng streaming (10.4), không phải quay về <code>useEffect</code>. Tắt JavaScript: trang máy chủ vẫn hiện danh sách, trang client kẹt ở "Đang tải…".</p>
<p><b>Gộp lời gọi, đo thật.</b> Cùng một người dùng được hỏi ở layout và hai thẻ — mỗi chỗ hỏi bằng <code>fetch</code>, <code>axios</code>, và <code>axios</code> bọc trong <code>cache()</code> của React. Gọi trang hai lần rồi đếm ở API:</p>
<pre><code class="language-typescript">import axios from 'axios';
import { cache } from 'react';

const API = 'http://127.0.0.1:19385';

<span class="tok-comment">// 1) fetch — Next.js tự gộp các lời gọi GET giống hệt trong MỘT lần render</span>
export async function layBangFetch() {
  return (await fetch(&#96;\${API}/nguoi-dung?qua=fetch&#96;)).json();
}

<span class="tok-comment">// 2) axios — không đi qua fetch ⇒ không ai gộp (client CSDL như Prisma cũng vậy)</span>
export async function layBangAxios() {
  return (await axios.get(&#96;\${API}/nguoi-dung?qua=axios&#96;)).data;
}

<span class="tok-comment">// 3) axios bọc trong cache() của React ⇒ gộp lại, chỉ trong một request</span>
export const layBangCache = cache(async () =&gt; {
  return (await axios.get(&#96;\${API}/nguoi-dung?qua=cache&#96;)).data;
});</code></pre>
<div class="out">  6 lượt  /nguoi-dung?qua=axios
  2 lượt  /nguoi-dung?qua=cache
  2 lượt  /nguoi-dung?qua=fetch</div>
<p>Chỉ <code>fetch</code> được gộp tự động (1 lượt mỗi request). <code>axios</code> — và mọi thư viện CSDL — bị gọi 3 lần mỗi request cho tới khi bọc trong <code>cache()</code>; phần ghi nhớ đó chỉ sống trong một request.</p>
<p><b>Thác nước, đo thật</b> (mỗi lời gọi API chờ 300 ms). Ba await liền nhau so với lấy <code>user</code> trước rồi <code>Promise.all</code> hai cái chỉ cần <code>user.id</code> — log API cho thấy mỗi lời gọi bắt đầu lúc nào:</p>
<pre><code class="language-tsx">import { connection } from 'next/server';

const lay = async (p: string) =&gt; (await fetch('http://127.0.0.1:19385' + p)).json();

export default async function SongSong() {
  await connection();
  const user = await lay('/nguoi-dung');             <span class="tok-comment">  // 300 ms — hai cái sau cần nó</span>
  const [posts, stats] = await Promise.all([         <span class="tok-comment">  // hai cái độc lập: chạy CÙNG LÚC</span>
    lay(&#96;/bai-viet?u=\${user.id}&#96;),
    lay(&#96;/thong-ke?u=\${user.id}&#96;),
  ]);
  return &lt;p className="p-4 font-sans"&gt;{user.ten}: {posts.length} bài, {stats.binhLuan} bình luận&lt;/p&gt;;
}</code></pre>
<div class="out"># nối tiếp
[api] 21:34:47.740 GET /nguoi-dung · lượt #1 · chờ 300 ms
[api] 21:34:48.044 GET /bai-viet?u=7 · lượt #1 · chờ 300 ms
[api] 21:34:48.346 GET /thong-ke?u=7 · lượt #1 · chờ 300 ms
# user rồi Promise.all
[api] 21:34:48.679 GET /nguoi-dung · lượt #2 · chờ 300 ms
[api] 21:34:48.983 GET /bai-viet?u=7 · lượt #2 · chờ 300 ms
[api] 21:34:48.983 GET /thong-ke?u=7 · lượt #2 · chờ 300 ms
noi-tiep lần 1: 0.915194 s
noi-tiep lần 2: 0.915998 s
noi-tiep lần 3: 0.911808 s
song-song lần 1: 0.610796 s
song-song lần 2: 0.610415 s
song-song lần 3: 0.628488 s</div>
<p><b>Gọi route API của chính mình qua HTTP</b> từ Server Component — đo thật: build hỏng lúc dựng sẵn trang, vì chưa có gì đang nghe:</p>
<pre><code class="language-tsx"><span class="tok-comment">// Server Component gọi route API của CHÍNH app này qua HTTP</span>
export default async function Vong() {
  const ds = await (await fetch('http://localhost:19386/api/khoa-hoc')).json();
  return &lt;ul&gt;{ds.map((k: { id: number; ten: string }) =&gt; &lt;li key={k.id}&gt;{k.ten}&lt;/li&gt;)}&lt;/ul&gt;;
}</code></pre>
<div class="out">Error occurred prerendering page "/vong". Read more: https://nextjs.org/docs/messages/prerender-error
TypeError: fetch failed
    code: 'ECONNREFUSED',
      Error: connect ECONNREFUSED ::1:19386</div>
<h3>🔁 Tự chạy lại</h3>
<p>API giả dùng ở trên (lưu thành <code>api.mjs</code> cạnh dự án, chạy <code>node api.mjs 19385</code>): mỗi request in một dòng log có mili giây.</p>
<pre><code class="language-javascript"><span class="tok-comment">// api.mjs — API giả cho Chương 10 (chạy: node api.mjs 19385). Mỗi request in MỘT dòng log có giờ:phút:giây.mili-giây.</span>
<span class="tok-comment">// ?ms=&lt;số&gt; đổi độ trễ · GET /dem = số lượt gọi từng URL · POST /dat-lai = xoá bộ đếm · POST /gia?v=&lt;số&gt; = đổi giá (dữ liệu "đổi ở nguồn").</span>
import http from 'node:http';
const PORT = Number(process.argv[2] ?? 19385);
const TRE = { '/nguoi-dung': 300, '/bai-viet': 300, '/thong-ke': 300 }; <span class="tok-comment">  // độ trễ mặc định (ms)</span>
let dem = {}, gia = 100;
const gio = () =&gt; new Date().toTimeString().slice(0, 8) + '.' + String(Date.now() % 1000).padStart(3, '0');
const ngu = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const DL = {
  '/khoa-hoc': () =&gt; [{ id: 1, ten: 'React' }, { id: 2, ten: 'Next.js' }, { id: 3, ten: 'Node.js' }],
  '/nguoi-dung': () =&gt; ({ id: 7, ten: 'An' }),
  '/bai-viet': () =&gt; [{ id: 1, tieuDe: 'Server Component' }, { id: 2, tieuDe: 'Streaming' }],
  '/thong-ke': () =&gt; ({ baiViet: 2, binhLuan: 15 }),
  '/gia': () =&gt; ({ gia, luc: gio() }),
};
http.createServer(async (req, res) =&gt; {
  const u = new URL(req.url, 'http://x'), p = u.pathname;
  const tra = (o, ma = 200) =&gt; { res.writeHead(ma, { 'content-type': 'application/json', 'access-control-allow-origin': '*' }); res.end(JSON.stringify(o)); };
  if (p === '/dem') return tra(dem);
  if (p === '/dat-lai') { dem = {}; return tra({ ok: true }); }
  if (req.method === 'POST' &amp;&amp; p === '/gia') { gia = Number(u.searchParams.get('v')); console.log(&#96;[api] \${gio()} ĐỔI giá ở nguồn ⇒ \${gia}&#96;); return tra({ gia }); }
  if (!DL[p]) return tra({ loi: 'không có' }, 404);
  const k = req.url; dem[k] = (dem[k] ?? 0) + 1;
  const ms = Number(u.searchParams.get('ms') ?? TRE[p] ?? 0);
  console.log(&#96;[api] \${gio()} \${req.method} \${req.url} · lượt #\${dem[k]} · chờ \${ms} ms&#96;);
  await ngu(ms);
  tra(DL[p]());
}).listen(PORT, '127.0.0.1', () =&gt; console.log(&#96;[api] nghe ở http://127.0.0.1:\${PORT}&#96;));</code></pre>
<pre><code class="language-bash">npm run build <span class="tok-comment">  # /khoa-hoc là ○ hay ƒ? log API có request TRONG lúc build không?</span>
npx next start -p 3000
curl -s -o /dev/null -w "%{time_total} s\\n" localhost:3000/khoa-hoc
curl -s 127.0.0.1:19385/dem <span class="tok-comment">  # số lượt gọi từng URL</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-6-1-fetch" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 6.1 — Fetch trong effect, và vì sao đau đầu</span><span class="lc-sub">Cuộc đua đo thật — thứ await ở máy chủ bỏ được</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-11-1-fetch-async" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 11.1 — fetch, promise & async/await</span><span class="lc-sub">fetch và async/await từ gốc</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-1-4-bat-dong-bo" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 1.4 — Bất đồng bộ: callback, Promise, async/await</span><span class="lc-sub">Promise.all — chữa thác nước</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/prisma-orm/learn?lessonSlug=pr-4-1-sau-cach-doc" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Prisma ORM · 4.1 — Sáu cách để đọc</span><span class="lc-sub">truy vấn CSDL thẳng trong Server Component (nhớ bọc cache())</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Component async</span><span class="v">Một Server Component có thể async và <code>await</code> dữ liệu.</span></div>
  <div class="kv"><span class="k">Fetch trên server</span><span class="v">Dữ liệu được fetch trên server trước khi gửi HTML.</span></div>
  <div class="kv"><span class="k">Không cần effect</span><span class="v">Dữ liệu khởi tạo ở đây không cần <code>useEffect</code>.</span></div>
  <div class="kv"><span class="k">Không đua</span><span class="v">Fetch trên server loại bỏ cuộc đua fetch phía client.</span></div>
  <div class="kv"><span class="k">Truy cập trực tiếp</span><span class="v">Bạn query DB hoặc API có secret trên server được.</span></div>
  <div class="kv"><span class="k">Dữ liệu đặt cạnh</span><span class="v">Fetch ngay nơi dữ liệu được render, trong component.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một Server Component có thể <code>async</code> và <code>await</code> dữ liệu trực tiếp — không <code>useEffect</code>, không cờ loading.</li><li>Dữ liệu fetch trên server trước khi gửi HTML, nên không có cuộc đua fetch phía client.</li><li>Bạn đọc DB và secret trực tiếp được vì mã không bao giờ tới trình duyệt.</li><li>Fetch ngay nơi dữ liệu được render — đặt cạnh trong component.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching" target="_blank" rel="noopener">
  <span class="lc-ico">📥</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Data Fetching</span><span class="lc-sub">Fetch trong Server Component bằng async/await, và khi nào fetch ở client.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — Caching, honestly (it depends on your version)|||10.2 — Cache, nói thẳng (tuỳ phiên bản của bạn)',
      slug: 'nextjs-10-2-cache',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Next mở rộng fetch bằng tuỳ chọn cache. Mặc định ĐÃ đổi giữa các phiên bản — luôn kiểm phiên bản bạn dùng. Mô hình hiện hành (15+): không cache mặc định, bạn opt-in. Cộng thêm request memoization dedupe fetch trùng.',
      content: `
${G10_2}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Caching is powerful — and the default has changed, so pin it down</h2>
<p class="lead">Next.js extends the native <code>fetch</code> with caching options, so a fetched value can be reused across requests instead of hitting the source every time. But there is a real trap: <strong>the default caching behaviour changed between Next.js versions.</strong> Do not memorise "the default" — memorise how to set it explicitly.</p>

<div class="callout warn">
<p><strong>Version reality:</strong> in Next.js 14, <code>fetch</code> was cached by default (like <code>force-cache</code>). In Next.js 15+, fetches are <em>not</em> cached by default. Same code, different behaviour across a major version. Always check your version, and when it matters, state the cache option explicitly rather than relying on the default.</p>
</div>

<h3>Set it explicitly and you never guess</h3>
<pre><code class="language-typescript"><span class="tok-comment">// cache this result and reuse it (static-ish)</span>
await fetch(url, { cache: 'force-cache' });

<span class="tok-comment">// never cache — fetch fresh on every request (dynamic)</span>
await fetch(url, { cache: 'no-store' });

<span class="tok-comment">// cache, but consider it stale after 60 seconds</span>
await fetch(url, { next: { revalidate: 60 } });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">force-cache</span><span class="v">Reuse the cached response. Good for data that rarely changes (a marketing page, a docs list).</span></div>
  <div class="kv"><span class="k">no-store</span><span class="v">Always fetch fresh; opts the route into dynamic rendering. Use for per-user or fast-changing data.</span></div>
  <div class="kv"><span class="k">next.revalidate: N</span><span class="v">Serve cached for N seconds, then refresh in the background. The "mostly static, refreshed periodically" middle ground (lesson 10.3).</span></div>
</div>

<h3>Request memoization: automatic dedup within one render</h3>
<p>Separate from the persistent cache, Next.js <em>memoizes</em> identical fetches during a single render pass. If a layout and a page both call <code>fetch(API_URL + '/user')</code> with the same options while rendering one request, the actual network call happens <strong>once</strong> and both get the result.</p>
<pre><code class="language-javascript"><span class="tok-comment">// layout.tsx and page.tsx both do this during one request:</span>
const user = await fetch(&#96;\${process.env.API_URL}/user&#96;).then(r =&gt; r.json());
<span class="tok-comment">// → only ONE real request; the second is served from memoization</span></code></pre>
<p>(On the server the URL must be <b>absolute</b>: measured, <code>fetch('/api/user')</code> in a Server Component ⇒ HTTP 500 <code>TypeError: Failed to parse URL from /api/user</code> — there is no "current page" to resolve it against. And do not fetch your own API route anyway — lesson 10.1.)</p>
<p>This means you can fetch the same data in each component that needs it, without threading it through props or worrying about duplicate calls. It is scoped to one render and cleared afterwards — different from the cross-request Data Cache above.</p>

<h3>The caches, from closest to furthest</h3>
<div class="lz-map">
  <div class="lz-stage">Four layers, each with its own key and lifetime</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Request memoisation</div><div class="lz-nsub">Within one render pass. Two identical fetches become one. Automatic, and you cannot turn it off.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">The Data Cache</div><div class="lz-nsub">Across requests and deploys, on the server. Controlled by <code>cache</code> and <code>next.revalidate</code> on each fetch.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">The Full Route Cache</div><div class="lz-nsub">The rendered HTML for a static route, produced at build time and served until revalidated.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The Router Cache</div><div class="lz-nsub">In the browser, per session. Holds recently visited routes so the back button is instant — and is why a page can look stale after a mutation.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — data that is correct on the server and stale in the browser after a write.</strong> You update a record, <code>revalidatePath</code> clears the server caches, and the list still shows the old row — because the client-side Router Cache is a separate layer holding the previously rendered payload for that route. The server is right and the screen is wrong, so people go looking at the database. In a Server Action, the same <code>revalidatePath</code> call also invalidates the router cache, which is why mutations belong there rather than in a bare <code>fetch</code>. From a Client Component, <code>router.refresh()</code> is the equivalent.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching" target="_blank" rel="noopener">
  <span class="lc-ico">🗃️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Caching in Next.js</span><span class="lc-sub">All four caches, with a table of what invalidates each one.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/revalidatePath" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — revalidatePath</span><span class="lc-sub">What it clears, what it does not, and where it can legally be called.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Fetch the same URL in two places and observe Next dedupes/caches it within a render (request memoization).</li>
<li>Set <code>cache: 'no-store'</code> on one fetch and confirm it is always fresh; check your Next version's defaults.</li>
<li>Write one sentence on why caching behaviour depends on your Next.js version.</li>
</ol>
<p><strong>Done when:</strong> you can control fetch caching and know the default depends on your version.</p></div>

<h3>🔬 Measured: one file on Next.js 14.2.35 and 16.4.6, the three options, the Router Cache</h3>
<p>The same <code>page.jsx</code> (dynamic — it reads <code>searchParams</code> — and one bare <code>fetch</code>) in two projects. A fake API returns a price; after request 1 the price at the source changes 100 → 250:</p>
<pre><code class="language-javascript"><span class="tok-comment">// app/gia/page.jsx — GIỐNG HỆT ở cả hai dự án: trang động (đọc searchParams) + một fetch KHÔNG tuỳ chọn</span>
export default async function Gia({ searchParams }) {
  const q = (await searchParams).q ?? '-';          <span class="tok-comment">  // đọc request ⇒ trang động</span>
  const res = await fetch('http://127.0.0.1:19385/gia');
  const d = await res.json();
  return &lt;p id="gia"&gt;giá {d.gia} · API trả lúc {d.luc} · q={q}&lt;/p&gt;;
}</code></pre>
<div class="out">$ npx next --version
Next.js v14.2.35
$ curl -s 'localhost:19387/gia?q=1' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 100 · q=1
$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo
{"gia":250}
$ curl -s 'localhost:19387/gia?q=2' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 100 · q=2
$ curl -s 'localhost:19387/gia?q=3' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 100 · q=3
$ curl -s 127.0.0.1:19385/dem; echo
{"/gia":1}
$ ls .next/cache/fetch-cache | wc -l | sed 's/^ */tệp trong .next\\/cache\\/fetch-cache: /'
tệp trong .next/cache/fetch-cache: 1</div>
<div class="out">$ npx next --version
Next.js v16.4.6
$ diff ../c10-14/app/gia/page.jsx src/app/gia/page.jsx &amp;&amp; echo 'page.jsx: giống hệt từng byte'
page.jsx: giống hệt từng byte
$ curl -s 'localhost:19386/gia?q=1' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 100 · q=1
$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo
{"gia":250}
$ curl -s 'localhost:19386/gia?q=2' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 250 · q=2
$ curl -s 'localhost:19386/gia?q=3' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 250 · q=3
$ curl -s 127.0.0.1:19385/dem; echo
{"/gia":3}</div>
<p>Next.js 14 stored the bare fetch (1 call, the page kept saying 100); Next.js 16 asked the source every time (3 calls). cuongthai.com itself runs 14.2.35 — and states <code>revalidate</code>/<code>no-store</code> on every server fetch, so an upgrade will not change them silently.</p>
<p><b>The three options on 16.4.6</b> — <code>/gia-tinh</code> (bare fetch, reads nothing from the request ⇒ static), <code>/tc/force</code> (<code>force-cache</code>), <code>/tc/no-store</code>. Source 250, then 300 after request 1:</p>
<div class="out">$ curl -s 127.0.0.1:19385/dem; echo
{"/gia?trang=tinh":1,"/nguoi-dung?qua=axios":1,"/nguoi-dung?qua=cache":1,"/nguoi-dung?qua=fetch":1}
$ node -e "for (const f of require('fs').readdirSync('.next/cache/fetch-cache')) { const j = JSON.parse(require('fs').readFileSync('.next/cache/fetch-cache/' + f)); console.log(j.data.url, '· revalidate', j.revalidate, 'giây') }"
http://127.0.0.1:19385/nguoi-dung?qua=fetch · revalidate 31536000 giây
http://127.0.0.1:19385/gia?trang=tinh · revalidate 31536000 giây
$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo
{"gia":250}
$ for p in gia-tinh tc/force tc/no-store; do curl -s localhost:19386/$p | sed 's/&lt;!-- --&gt;//g' | grep -o '&lt;p id="gia"&gt;[^·&lt;]*' | sed "s#&lt;p id=\\"gia\\"&gt;#/$p lần 1: #"; done
/gia-tinh lần 1: giá 100 
/tc/force lần 1: giá 250
/tc/no-store lần 1: giá 250
$ curl -s -XPOST '127.0.0.1:19385/gia?v=300'; echo
{"gia":300}
$ for p in gia-tinh tc/force tc/no-store; do for i in 2 3; do curl -s localhost:19386/$p | sed 's/&lt;!-- --&gt;//g' | grep -o '&lt;p id="gia"&gt;[^·&lt;]*' | sed "s#&lt;p id=\\"gia\\"&gt;#/$p lần $i: #"; done; done
/gia-tinh lần 2: giá 100 
/gia-tinh lần 3: giá 100 
/tc/force lần 2: giá 250
/tc/force lần 3: giá 250
/tc/no-store lần 2: giá 300
/tc/no-store lần 3: giá 300
$ curl -s 127.0.0.1:19385/dem; echo
{"/gia?trang=tinh":1,"/nguoi-dung?qua=axios":1,"/nguoi-dung?qua=cache":1,"/nguoi-dung?qua=fetch":1,"/gia?tc=force":1,"/gia?tc=no-store":3}
$ curl -s -D - -o /dev/null localhost:19386/gia-tinh | grep -iE 'x-nextjs-cache|cache-control'
x-nextjs-cache: HIT
Cache-Control: s-maxage=31536000</div>
<p>"Not cached by default" is not "always fresh": the static page was fetched <b>once, during the build</b>, stored with <code>revalidate 31536000</code> (one year) and served with <code>x-nextjs-cache: HIT</code>. <code>no-store</code> made its route ƒ by itself. On Next.js 14.2.35 the same three pages gave the same numbers:</p>
<div class="out">$ curl -s 127.0.0.1:19385/dem; echo
{"/gia?trang=tinh14":1}
$ for p in gia-tinh tc/force tc/no-store; do curl -s localhost:19387/$p | sed 's/&lt;!-- --&gt;//g' | grep -o '&lt;p id="gia"&gt;[^·&lt;]*' | sed "s#&lt;p id=\\"gia\\"&gt;#/$p lần 1: #"; done
/gia-tinh lần 1: giá 100 
/tc/force lần 1: giá 250
/tc/no-store lần 1: giá 250
$ for p in gia-tinh tc/force tc/no-store; do for i in 2 3; do curl -s localhost:19387/$p | sed 's/&lt;!-- --&gt;//g' | grep -o '&lt;p id="gia"&gt;[^·&lt;]*' | sed "s#&lt;p id=\\"gia\\"&gt;#/$p lần $i: #"; done; done
/gia-tinh lần 2: giá 100 
/gia-tinh lần 3: giá 100 
/tc/force lần 2: giá 250
/tc/force lần 3: giá 250
/tc/no-store lần 2: giá 300
/tc/no-store lần 3: giá 300
$ curl -s 127.0.0.1:19385/dem; echo
{"/gia?trang=tinh14":1,"/gia?tc=force14":1,"/gia?tc=no-store14":3}</div>
<p><b>The Router Cache, in Chromium.</b> Page A is dynamic. Open it: <code>trang A · giá 100</code>. Go to B, source → 250, click the <code>Link</code> back to A: <code>/rc/a · trang A · giá 250</code> (the server rendered it again). Go to B, source → 300, press the browser <b>Back</b>: <code>/rc/a · trang A · giá 250</code> — and the API got no request. Reload: <code>trang A · giá 300</code>. API hits: <code>{"/gia?rc=a":3}</code> for 4 views. Server right, screen wrong — that is layer 4.</p>
<p>And the code in the memoization section, run as written (a relative URL in a Server Component):</p>
<div class="out">$ tr -d '\\000' &lt; ~/.rtq-nxj/nen-c10s.log | grep -aE 'TypeError|Failed to parse|Invalid URL|input:' | head -4 | sed 's/^ *//'
⨯ TypeError: Failed to parse URL from /api/user
[cause]: TypeError: Invalid URL
input: '/api/user'</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npx next --version
npm run build &amp;&amp; npx next start -p 3000
curl -s "localhost:3000/gia?q=1"
curl -s -XPOST '127.0.0.1:19385/gia?v=250' <span class="tok-comment">  # change the price at the source (api.mjs of lesson 10.1)</span>
curl -s "localhost:3000/gia?q=2"
curl -s 127.0.0.1:19385/dem <span class="tok-comment">  # how many times did the page ask?</span>
curl -s -D - -o /dev/null localhost:3000/gia-tinh | grep -i x-nextjs-cache</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-1-bon-khuon" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.1 — The four caching patterns</span><span class="lc-sub">name the kind of cache you have</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-8-2-cache-dung" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 8.2 — Cache keys, TTL and invalidation done right</span><span class="lc-sub">s-maxage, cache keys, invalidation</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-6-2-tanstack" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 6.2 — TanStack Query: staleTime/gcTime</span><span class="lc-sub">client-side data caching — close to the Router Cache</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Data cache</span><span class="v">Next can cache <code>fetch</code> results across requests.</span></div>
  <div class="kv"><span class="k">Request memoization</span><span class="v">Same fetch in one render is deduped automatically.</span></div>
  <div class="kv"><span class="k">no-store</span><span class="v">Opt out of caching for always-fresh data.</span></div>
  <div class="kv"><span class="k">force-cache</span><span class="v">Opt into caching a fetch result.</span></div>
  <div class="kv"><span class="k">Version-dependent default</span><span class="v">Caching defaults changed between Next versions.</span></div>
  <div class="kv"><span class="k">Static vs dynamic</span><span class="v">Caching pushes a route toward static or dynamic rendering.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Next can cache <code>fetch</code> results and memoizes duplicate fetches within one render.</li><li>Opt out with <code>cache: 'no-store'</code> for always-fresh data; opt in with <code>force-cache</code>.</li><li>The default caching behaviour depends on your Next.js version — check it, do not assume.</li><li>Caching is what pushes a route toward static or dynamic rendering (Chapter 17).</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Caching in Next.js</span><span class="lc-sub">The four caches (Request Memoization, Data Cache, Full Route Cache, Router Cache) and their defaults for your version.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Cache rất mạnh — và mặc định đã đổi, nên hãy chốt nó lại</h2>
<p class="lead">Next.js mở rộng <code>fetch</code> gốc bằng các tuỳ chọn cache, để một giá trị đã fetch được dùng lại qua nhiều request thay vì gọi nguồn mỗi lần. Nhưng có một cái bẫy thật: <strong>hành vi cache mặc định đã đổi giữa các phiên bản Next.js.</strong> Đừng học thuộc "mặc định là gì" — hãy học cách đặt nó tường minh.</p>

<div class="callout warn">
<p><strong>Sự thật phiên bản:</strong> ở Next.js 14, <code>fetch</code> được cache mặc định (như <code>force-cache</code>). Ở Next.js 15+, fetch <em>không</em> cache mặc định. Cùng code, hành vi khác nhau qua một bản major. Luôn kiểm phiên bản bạn dùng, và khi nó quan trọng, hãy nêu tuỳ chọn cache tường minh thay vì dựa vào mặc định.</p>
</div>

<h3>Đặt tường minh thì không bao giờ phải đoán</h3>
<pre><code class="language-typescript"><span class="tok-comment">// cache kết quả này và dùng lại (kiểu tĩnh)</span>
await fetch(url, { cache: 'force-cache' });

<span class="tok-comment">// không bao giờ cache — fetch mới mỗi request (động)</span>
await fetch(url, { cache: 'no-store' });

<span class="tok-comment">// cache, nhưng coi là cũ sau 60 giây</span>
await fetch(url, { next: { revalidate: 60 } });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">force-cache</span><span class="v">Dùng lại phản hồi đã cache. Hợp cho dữ liệu hiếm khi đổi (một trang marketing, một danh sách tài liệu).</span></div>
  <div class="kv"><span class="k">no-store</span><span class="v">Luôn fetch mới; đưa route vào render động. Dùng cho dữ liệu theo từng người hoặc đổi nhanh.</span></div>
  <div class="kv"><span class="k">next.revalidate: N</span><span class="v">Phục vụ bản cache trong N giây, rồi làm mới ở nền. Vùng giữa "gần như tĩnh, làm mới định kỳ" (bài 10.3).</span></div>
</div>

<h3>Request memoization: tự dedupe trong một lần render</h3>
<p>Tách khỏi cache bền, Next.js <em>ghi nhớ</em> các fetch giống hệt nhau trong một lượt render. Nếu một layout và một page cùng gọi <code>fetch(API_URL + '/user')</code> với cùng tuỳ chọn trong lúc render một request, cú gọi mạng thật xảy ra <strong>một lần</strong> và cả hai đều nhận kết quả.</p>
<pre><code class="language-javascript"><span class="tok-comment">// layout.tsx và page.tsx đều làm thế này trong một request:</span>
const user = await fetch(&#96;\${process.env.API_URL}/user&#96;).then(r =&gt; r.json());
<span class="tok-comment">// → chỉ MỘT request thật; cái thứ hai lấy từ memoization</span></code></pre>
<p>(Ở máy chủ URL phải <b>tuyệt đối</b>: đo thật, <code>fetch('/api/user')</code> trong Server Component ⇒ HTTP 500 <code>TypeError: Failed to parse URL from /api/user</code> — máy chủ không có "trang hiện tại" để ghép đường dẫn. Mà cũng đừng fetch route API của chính mình — bài 10.1.)</p>
<p>Nghĩa là bạn có thể fetch cùng dữ liệu ở mỗi component cần nó, không phải luồn qua props hay lo gọi trùng. Nó khoanh trong một lần render và xoá sau đó — khác với Data Cache xuyên-request ở trên.</p>

<h3>Các lớp nhớ đệm, từ gần tới xa</h3>
<div class="lz-map">
  <div class="lz-stage">Bốn lớp, mỗi lớp một khoá và một tuổi thọ riêng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Ghi nhớ theo request</div><div class="lz-nsub">Trong phạm vi một lượt render. Hai phép fetch giống hệt nhau thành một. Tự động, và bạn không tắt được.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Data Cache</div><div class="lz-nsub">Xuyên qua các request và các lần deploy, ở phía máy chủ. Điều khiển bằng <code>cache</code> và <code>next.revalidate</code> trên từng phép fetch.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Full Route Cache</div><div class="lz-nsub">Phần HTML đã vẽ của một route tĩnh, tạo ra lúc build và phục vụ cho tới khi được làm mới.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Router Cache</div><div class="lz-nsub">Trong trình duyệt, theo từng phiên. Giữ những route vừa ghé để nút quay lại tức thì — và đó là lý do một trang có thể trông cũ sau khi ghi.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — dữ liệu đúng ở máy chủ mà cũ trong trình duyệt sau một lần ghi.</strong> Bạn cập nhật một bản ghi, <code>revalidatePath</code> xoá các lớp đệm phía máy chủ, mà danh sách vẫn hiện dòng cũ — vì Router Cache phía client là một lớp riêng đang giữ dữ liệu đã vẽ trước đó của route ấy. Máy chủ thì đúng còn màn hình thì sai, nên người ta đi soi cơ sở dữ liệu. Trong một Server Action, chính lời gọi <code>revalidatePath</code> ấy cũng vô hiệu hoá luôn router cache, và đó là lý do các phép ghi thuộc về đó chứ không thuộc về một <code>fetch</code> trần. Từ một Client Component thì <code>router.refresh()</code> là thứ tương đương.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching" target="_blank" rel="noopener">
  <span class="lc-ico">🗃️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Nhớ đệm trong Next.js</span><span class="lc-sub">Cả bốn lớp đệm, kèm bảng cái gì vô hiệu hoá cái nào.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/revalidatePath" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — revalidatePath</span><span class="lc-sub">Nó xoá cái gì, không xoá cái gì, và được phép gọi ở đâu.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Fetch cùng một URL ở hai nơi và quan sát Next gộp/cache nó trong một lần render (memoize request).</li>
<li>Đặt <code>cache: 'no-store'</code> trên một fetch và xác nhận nó luôn mới; kiểm mặc định của phiên bản Next bạn dùng.</li>
<li>Viết một câu vì sao hành vi cache phụ thuộc phiên bản Next.js.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn điều khiển được cache của fetch và biết mặc định tuỳ phiên bản.</p></div>

<h3>🔬 Đo thật: một tệp trên Next.js 14.2.35 và 16.4.6, ba tuỳ chọn, Router Cache</h3>
<p>Cùng một <code>page.jsx</code> (trang động — đọc <code>searchParams</code> — và một <code>fetch</code> trần) trong hai dự án. API giả trả về một giá; sau request 1 giá ở nguồn đổi 100 → 250:</p>
<pre><code class="language-javascript"><span class="tok-comment">// app/gia/page.jsx — GIỐNG HỆT ở cả hai dự án: trang động (đọc searchParams) + một fetch KHÔNG tuỳ chọn</span>
export default async function Gia({ searchParams }) {
  const q = (await searchParams).q ?? '-';          <span class="tok-comment">  // đọc request ⇒ trang động</span>
  const res = await fetch('http://127.0.0.1:19385/gia');
  const d = await res.json();
  return &lt;p id="gia"&gt;giá {d.gia} · API trả lúc {d.luc} · q={q}&lt;/p&gt;;
}</code></pre>
<div class="out">$ npx next --version
Next.js v14.2.35
$ curl -s 'localhost:19387/gia?q=1' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 100 · q=1
$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo
{"gia":250}
$ curl -s 'localhost:19387/gia?q=2' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 100 · q=2
$ curl -s 'localhost:19387/gia?q=3' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 100 · q=3
$ curl -s 127.0.0.1:19385/dem; echo
{"/gia":1}
$ ls .next/cache/fetch-cache | wc -l | sed 's/^ */tệp trong .next\\/cache\\/fetch-cache: /'
tệp trong .next/cache/fetch-cache: 1</div>
<div class="out">$ npx next --version
Next.js v16.4.6
$ diff ../c10-14/app/gia/page.jsx src/app/gia/page.jsx &amp;&amp; echo 'page.jsx: giống hệt từng byte'
page.jsx: giống hệt từng byte
$ curl -s 'localhost:19386/gia?q=1' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 100 · q=1
$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo
{"gia":250}
$ curl -s 'localhost:19386/gia?q=2' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 250 · q=2
$ curl -s 'localhost:19386/gia?q=3' | grep -o '&lt;p id="gia"&gt;[^/]*' | sed 's/&lt;!-- --&gt;//g; s/&lt;p id="gia"&gt;//'
giá 250 · q=3
$ curl -s 127.0.0.1:19385/dem; echo
{"/gia":3}</div>
<p>Next.js 14 lưu fetch trần (1 lượt, trang vẫn nói 100); Next.js 16 hỏi nguồn mỗi lần (3 lượt). Chính cuongthai.com chạy 14.2.35 — và ghi rõ <code>revalidate</code>/<code>no-store</code> ở mọi fetch phía máy chủ, nên lên bản mới cũng không bị đổi ngầm.</p>
<p><b>Ba tuỳ chọn trên 16.4.6</b> — <code>/gia-tinh</code> (fetch trần, không đọc request ⇒ trang tĩnh), <code>/tc/force</code> (<code>force-cache</code>), <code>/tc/no-store</code>. Nguồn 250, rồi 300 sau request 1:</p>
<div class="out">$ curl -s 127.0.0.1:19385/dem; echo
{"/gia?trang=tinh":1,"/nguoi-dung?qua=axios":1,"/nguoi-dung?qua=cache":1,"/nguoi-dung?qua=fetch":1}
$ node -e "for (const f of require('fs').readdirSync('.next/cache/fetch-cache')) { const j = JSON.parse(require('fs').readFileSync('.next/cache/fetch-cache/' + f)); console.log(j.data.url, '· revalidate', j.revalidate, 'giây') }"
http://127.0.0.1:19385/nguoi-dung?qua=fetch · revalidate 31536000 giây
http://127.0.0.1:19385/gia?trang=tinh · revalidate 31536000 giây
$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo
{"gia":250}
$ for p in gia-tinh tc/force tc/no-store; do curl -s localhost:19386/$p | sed 's/&lt;!-- --&gt;//g' | grep -o '&lt;p id="gia"&gt;[^·&lt;]*' | sed "s#&lt;p id=\\"gia\\"&gt;#/$p lần 1: #"; done
/gia-tinh lần 1: giá 100 
/tc/force lần 1: giá 250
/tc/no-store lần 1: giá 250
$ curl -s -XPOST '127.0.0.1:19385/gia?v=300'; echo
{"gia":300}
$ for p in gia-tinh tc/force tc/no-store; do for i in 2 3; do curl -s localhost:19386/$p | sed 's/&lt;!-- --&gt;//g' | grep -o '&lt;p id="gia"&gt;[^·&lt;]*' | sed "s#&lt;p id=\\"gia\\"&gt;#/$p lần $i: #"; done; done
/gia-tinh lần 2: giá 100 
/gia-tinh lần 3: giá 100 
/tc/force lần 2: giá 250
/tc/force lần 3: giá 250
/tc/no-store lần 2: giá 300
/tc/no-store lần 3: giá 300
$ curl -s 127.0.0.1:19385/dem; echo
{"/gia?trang=tinh":1,"/nguoi-dung?qua=axios":1,"/nguoi-dung?qua=cache":1,"/nguoi-dung?qua=fetch":1,"/gia?tc=force":1,"/gia?tc=no-store":3}
$ curl -s -D - -o /dev/null localhost:19386/gia-tinh | grep -iE 'x-nextjs-cache|cache-control'
x-nextjs-cache: HIT
Cache-Control: s-maxage=31536000</div>
<p>"Không cache mặc định" không có nghĩa "luôn mới": trang tĩnh fetch <b>một lần, lúc build</b>, lưu với <code>revalidate 31536000</code> (một năm) và trả về kèm <code>x-nextjs-cache: HIT</code>. <code>no-store</code> tự biến route thành ƒ. Trên Next.js 14.2.35, ba trang y hệt cho ra đúng các con số này:</p>
<div class="out">$ curl -s 127.0.0.1:19385/dem; echo
{"/gia?trang=tinh14":1}
$ for p in gia-tinh tc/force tc/no-store; do curl -s localhost:19387/$p | sed 's/&lt;!-- --&gt;//g' | grep -o '&lt;p id="gia"&gt;[^·&lt;]*' | sed "s#&lt;p id=\\"gia\\"&gt;#/$p lần 1: #"; done
/gia-tinh lần 1: giá 100 
/tc/force lần 1: giá 250
/tc/no-store lần 1: giá 250
$ for p in gia-tinh tc/force tc/no-store; do for i in 2 3; do curl -s localhost:19387/$p | sed 's/&lt;!-- --&gt;//g' | grep -o '&lt;p id="gia"&gt;[^·&lt;]*' | sed "s#&lt;p id=\\"gia\\"&gt;#/$p lần $i: #"; done; done
/gia-tinh lần 2: giá 100 
/gia-tinh lần 3: giá 100 
/tc/force lần 2: giá 250
/tc/force lần 3: giá 250
/tc/no-store lần 2: giá 300
/tc/no-store lần 3: giá 300
$ curl -s 127.0.0.1:19385/dem; echo
{"/gia?trang=tinh14":1,"/gia?tc=force14":1,"/gia?tc=no-store14":3}</div>
<p><b>Router Cache, trong Chromium.</b> Trang A là trang động. Mở ra: <code>trang A · giá 100</code>. Sang B, nguồn → 250, bấm <code>Link</code> về A: <code>/rc/a · trang A · giá 250</code> (máy chủ render lại). Sang B, nguồn → 300, bấm <b>Back</b> của trình duyệt: <code>/rc/a · trang A · giá 250</code> — và API không nhận request nào. Tải lại: <code>trang A · giá 300</code>. Lượt gọi API: <code>{"/gia?rc=a":3}</code> cho 4 lần xem. Máy chủ đúng, màn hình sai — đó là tầng 4.</p>
<p>Và đoạn mã ở mục memoization, chạy nguyên văn (URL tương đối trong Server Component):</p>
<div class="out">$ tr -d '\\000' &lt; ~/.rtq-nxj/nen-c10s.log | grep -aE 'TypeError|Failed to parse|Invalid URL|input:' | head -4 | sed 's/^ *//'
⨯ TypeError: Failed to parse URL from /api/user
[cause]: TypeError: Invalid URL
input: '/api/user'</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npx next --version
npm run build &amp;&amp; npx next start -p 3000
curl -s "localhost:3000/gia?q=1"
curl -s -XPOST '127.0.0.1:19385/gia?v=250' <span class="tok-comment">  # đổi giá ở nguồn (api.mjs của bài 10.1)</span>
curl -s "localhost:3000/gia?q=2"
curl -s 127.0.0.1:19385/dem <span class="tok-comment">  # trang đã hỏi nguồn mấy lần?</span>
curl -s -D - -o /dev/null localhost:3000/gia-tinh | grep -i x-nextjs-cache</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-1-bon-khuon" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.1 — Bốn khuôn làm bộ đệm</span><span class="lc-sub">gọi đúng tên kiểu cache bạn đang dùng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-8-2-cache-dung" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 8.2 — Khoá cache, TTL và xoá cache cho đúng</span><span class="lc-sub">s-maxage, khoá cache, xoá cache</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-6-2-tanstack" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 6.2 — TanStack Query: staleTime/gcTime</span><span class="lc-sub">cache dữ liệu phía trình duyệt — gần với Router Cache</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Data cache</span><span class="v">Next có thể cache kết quả <code>fetch</code> qua các request.</span></div>
  <div class="kv"><span class="k">Memoize request</span><span class="v">Cùng một fetch trong một render được gộp tự động.</span></div>
  <div class="kv"><span class="k">no-store</span><span class="v">Tắt cache để dữ liệu luôn mới.</span></div>
  <div class="kv"><span class="k">force-cache</span><span class="v">Bật cache cho một kết quả fetch.</span></div>
  <div class="kv"><span class="k">Mặc định theo phiên bản</span><span class="v">Mặc định cache đổi giữa các phiên bản Next.</span></div>
  <div class="kv"><span class="k">Tĩnh vs động</span><span class="v">Cache đẩy một route về render tĩnh hoặc động.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Next có thể cache kết quả <code>fetch</code> và memoize các fetch trùng trong một lần render.</li><li>Tắt bằng <code>cache: 'no-store'</code> cho dữ liệu luôn mới; bật bằng <code>force-cache</code>.</li><li>Hành vi cache mặc định tuỳ phiên bản Next.js — hãy kiểm, đừng giả định.</li><li>Cache là thứ đẩy một route về render tĩnh hoặc động (Chương 17).</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Caching in Next.js</span><span class="lc-sub">Bốn lớp cache (Request Memoization, Data Cache, Full Route Cache, Router Cache) và mặc định cho phiên bản của bạn.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Revalidation: time-based and on-demand|||10.3 — Revalidate: theo thời gian và theo yêu cầu',
      slug: 'nextjs-10-3-revalidate',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Cache mà không bao giờ làm mới thì thành dữ liệu chết. Hai cách làm mới: theo thời gian (revalidate: N giây) và theo yêu cầu (revalidateTag/revalidatePath sau khi dữ liệu đổi).',
      content: `
${G10_3}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Cached data must be refreshed — the question is when</h2>
<p class="lead">Caching trades freshness for speed. Revalidation is how you buy some freshness back on your terms. There are two models, and real apps use both.</p>

<h3>1 · Time-based: refresh every N seconds</h3>
<pre><code class="language-javascript">await fetch(url, { next: { revalidate: 60 } });

<span class="tok-comment">// or for a whole route, in the page/layout:</span>
export const revalidate = 60;   <span class="tok-comment">// seconds</span></code></pre>
<p>The first request after the window serves the stale cached copy <em>and</em> triggers a background refresh; subsequent requests get the fresh one. Users never wait for the refresh. This is often called ISR (Incremental Static Regeneration). Great for content that changes on a loose schedule — a blog index, a product list, a leaderboard that can lag a minute.</p>

<h3>2 · On-demand: refresh exactly when data changes</h3>
<p>Time windows are guesses. When you <em>know</em> the data changed — a user published a post — you can invalidate precisely:</p>
<pre><code class="language-javascript">import { revalidatePath, revalidateTag } from 'next/cache';

<span class="tok-comment">// after a mutation (e.g. in a Server Action, Chapter 12):</span>
revalidatePath('/blog');           <span class="tok-comment">// this route's cache is now stale</span>
revalidateTag('courses', 'max');   <span class="tok-comment">// any fetch tagged 'courses' is stale (Next.js 16: 2nd argument required)</span></code></pre>
<p>To use tags, attach one when fetching: <code>fetch(url, { next: { tags: ['courses'] } })</code>. Then a single <code>revalidateTag('courses', 'max')</code> invalidates every fetch carrying that tag, wherever it lives.</p>
<div class="callout warn"><p><strong>Next.js 16 changed the signature.</strong> The one-argument <code>revalidateTag('courses')</code> of older tutorials no longer compiles — measured: <code>error TS2554: Expected 2 arguments, but got 1</code>, and <code>next build</code> stops at its TypeScript step. The second argument is a cache profile: <code>'max'</code> gives stale-while-revalidate (the next visit still gets one old copy, then the new one). Inside a Server Action, right after the user's own write, use <code>updateTag('courses')</code> instead — it expires immediately (Chapter 12).</p></div>

<div class="kv-grid">
  <div class="kv"><span class="k">Time-based fits</span><span class="v">Data that drifts on its own and can be slightly stale: feeds, listings, stats.</span></div>
  <div class="kv"><span class="k">On-demand fits</span><span class="v">Data with a clear "it just changed" moment: publish, edit, delete. Pair it with the mutation that caused it.</span></div>
</div>

<div class="callout ok">
<p><strong>Mental model:</strong> <code>cache</code> decides <em>whether</em> to store; <code>revalidate</code> decides <em>when to let go</em>. Start uncached while building, add caching where a source is slow or hit often, then add revalidation so it never goes truly stale.</p>
</div>

<h3>Choosing how fresh the data has to be</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Static, cached until the next deploy</b> — What a fetch with no options gives you <i>in a static page</i> (measured: stored with <code>revalidate</code> 31536000 s = one year). In a dynamic page on 15+, the same fetch is not cached at all (10.2). Right for content that only changes when you deploy.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Time-based: next: { revalidate: 60 }</b> — Serve the cached copy, and rebuild in the background after 60 seconds. The first visitor after expiry still gets the old page — no one waits.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>On-demand: revalidatePath / revalidateTag</b> — Clear it exactly when the data changed, from a Server Action or a webhook. Fresh immediately, cached the rest of the time.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Never cached: cache: 'no-store'</b> — Every request hits the source. Correct for a dashboard of live numbers, wasteful for anything else.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>export const dynamic = &#39;force-dynamic&#39;</code> added to fix one stale value.</strong> It works instantly and opts the entire route out of every cache, forever: every visit re-renders on the server, re-runs every query, and the page loses its static generation. On a marketing page that gets a thousand visits an hour, that is a thousand database round trips to keep one number fresh. Reach for the narrowest tool that fixes the actual problem — <code>revalidate</code> on the one fetch that is stale, or <code>revalidateTag</code> called from the code that changes it. Check the build output afterwards: routes marked <code>ƒ</code> are dynamic, <code>○</code> are static.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#revalidating" target="_blank" rel="noopener">
  <span class="lc-ico">⏲️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Revalidating</span><span class="lc-sub">Time-based and on-demand revalidation, with the exact semantics of each.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route segment config</span><span class="lc-sub">Every export that changes a route's rendering mode, and what each one costs.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add <code>next: { revalidate: 60 }</code> to a fetch and confirm the page refreshes its data at most once a minute.</li>
<li>Trigger on-demand revalidation with <code>revalidatePath</code> (or <code>revalidateTag</code>) after a change.</li>
<li>Contrast time-based vs on-demand revalidation in one line each.</li>
</ol>
<p><strong>Done when:</strong> you can revalidate cached data by time and on demand.</p></div>

<h3>🔬 Measured: the stale-while-revalidate window, tag vs path, and force-dynamic priced (Next.js 16.4.6)</h3>
<p>A static page with <code>export const revalidate = 10</code> (the lesson uses 60; 10 lets us watch it) over an API that waits <b>800 ms</b>. A tiny script prints the time, the <code>x-nextjs-cache</code> header, the price on the page and the response time:</p>
<pre><code class="language-tsx"><span class="tok-comment">// trang tĩnh, làm mới theo thời gian: tối đa 10 giây một lần (bài dùng 60 — lab rút ngắn để đo)</span>
export const revalidate = 10;

export default async function Isr() {
  const d = await (await fetch('http://127.0.0.1:19385/gia?ms=800&amp;isr=1')).json(); <span class="tok-comment">  // API chậm 800 ms</span>
  return &lt;p id="gia"&gt;giá {d.gia} · API trả lúc {d.luc}&lt;/p&gt;;
}</code></pre>
<div class="out">$ npm run build
Route (app)           Revalidate  Expire
├ ○ /isr                     10s      1y
├ ○ /nghin/isr                1m      1y
○  (Static)   prerendered as static content
$ ./goi.sh /isr
22:11:33 /isr · x-nextjs-cache: HIT · giá 100 · 0.021816 s
$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo '   ← nguồn đổi'
{"gia":250}   ← nguồn đổi
$ ./goi.sh /isr
22:11:33 /isr · x-nextjs-cache: HIT · giá 100 · 0.003175 s
$ sleep 11; ./goi.sh /isr
22:11:44 /isr · x-nextjs-cache: STALE · giá 100 · 0.003367 s
$ sleep 2; ./goi.sh /isr
22:11:46 /isr · x-nextjs-cache: HIT · giá 250 · 0.002557 s
$ ./goi.sh /isr
22:11:46 /isr · x-nextjs-cache: HIT · giá 250 · 0.002691 s
$ (log API giả — các lượt /gia?ms=800&amp;isr=1)
  [api] 22:11:28.412 GET /gia?ms=800&amp;isr=1 · lượt #1 · chờ 800 ms
  [api] 22:11:44.847 GET /gia?ms=800&amp;isr=1 · lượt #2 · chờ 800 ms</div>
<p>Inside the window: HIT, the old price. The first visit after the window: <b>STALE</b> — the old page, in 3 ms; the API log shows the refresh call starting <i>after</i> that answer. The next visit: HIT, 250. Nobody waited for the 800 ms API — and "60 seconds" really means "at most one visit + 60 s old".</p>
<p><b>On demand</b>: <code>/the</code> has a fetch tagged <code>gia</code>, <code>/duong</code> has none; a route handler calls <code>revalidateTag(tag, 'max')</code> or <code>revalidatePath(path)</code>:</p>
<pre><code class="language-typescript">import { revalidatePath, revalidateTag } from 'next/cache';

<span class="tok-comment">// POST /api/lam-moi?tag=gia  hoặc  ?path=/duong   (trong ứng dụng thật: webhook của CMS, có kiểm khoá bí mật)</span>
export async function POST(req: Request) {
  const u = new URL(req.url);
  const tag = u.searchParams.get('tag'), path = u.searchParams.get('path');
  if (tag) revalidateTag(tag, 'max');    <span class="tok-comment">  // Next.js 16: đối số thứ hai là BẮT BUỘC</span>
  if (path) revalidatePath(path);
  return Response.json({ daLamMoi: tag ?? path });
}</code></pre>
<div class="out">$ npx tsc --noEmit 2&gt;&amp;1 | grep -E 'sai-tag' | head -3
ban/sai-tag.ts(3,1): error TS2554: Expected 2 arguments, but got 1.
$ ./goi.sh /the; ./goi.sh /duong
22:10:43 /the · x-nextjs-cache: HIT · giá 100 · 0.021322 s
22:10:43 /duong · x-nextjs-cache: HIT · giá 100 · 0.006925 s
$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo '   ← nguồn đổi'
{"gia":250}   ← nguồn đổi
$ ./goi.sh /the; ./goi.sh /duong
22:10:43 /the · x-nextjs-cache: HIT · giá 100 · 0.002407 s
22:10:43 /duong · x-nextjs-cache: HIT · giá 100 · 0.002163 s
$ curl -s -XPOST 'localhost:19386/api/lam-moi?tag=gia'; echo
{"daLamMoi":"gia"}
$ ./goi.sh /the; sleep 1; ./goi.sh /the; ./goi.sh /duong
22:10:43 /the · x-nextjs-cache: STALE · giá 100 · 0.002805 s
22:10:44 /the · x-nextjs-cache: HIT · giá 250 · 0.002925 s
22:10:45 /duong · x-nextjs-cache: HIT · giá 100 · 0.002184 s
$ curl -s -XPOST 'localhost:19386/api/lam-moi?path=/duong'; echo
{"daLamMoi":"/duong"}
$ ./goi.sh /duong; sleep 1; ./goi.sh /duong
22:10:45 /duong · x-nextjs-cache: MISS · giá 250 · 0.012987 s
22:10:46 /duong · x-nextjs-cache: HIT · giá 250 · 0.003469 s</div>
<p>After <code>revalidateTag('gia', 'max')</code>: one more STALE copy, then the new price — <code>/duong</code> (no tag) untouched. After <code>revalidatePath('/duong')</code>: the very next visit is a MISS, rendered on demand with the new price.</p>
<p><b>The force-dynamic trap, priced</b> — 100 views of each page, API 50 ms:</p>
<div class="out">$ npm run build
├ ƒ /nghin/dong
├ ○ /nghin/isr                1m      1y
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
$ for p in dong isr; do t=$( { /usr/bin/time -p bash -c "for i in \\$(seq 100); do curl -s -o /dev/null localhost:19386/nghin/$p; done"; } 2&gt;&amp;1 | awk '/real/{print $2}'); echo "/nghin/$p · 100 lượt xem · $t s"; done
/nghin/dong · 100 lượt xem · 6.70 s
/nghin/isr · 100 lượt xem · 1.13 s
$ curl -s 127.0.0.1:19385/dem; echo
{"/gia?ms=50&amp;nghin=dong":100}</div>
<h3>🔁 Run it yourself</h3>
<p>The <code>goi.sh</code> helper used above (needs the <code>api.mjs</code> of lesson 10.1):</p>
<pre><code class="language-bash"><span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># goi.sh &lt;đường dẫn&gt; — gọi trang 1 lần, in: giờ · tiêu đề x-nextjs-cache · giá trên trang · thời gian trả lời</span>
h=$(mktemp); b=$(mktemp)
t=$(curl -s -D "$h" -o "$b" -w '%{time_total}' "localhost:19386$1")
c=$(grep -i '^x-nextjs-cache' "$h" | tr -d '\\r' | cut -d' ' -f2); g=$(sed 's/&lt;!-- --&gt;//g' "$b" | grep -o 'giá [0-9]*' | head -1)
echo "$(date +%T) $1 · x-nextjs-cache: \${c:--} · $g · \${t} s"; rm -f "$h" "$b"</code></pre>
<pre><code class="language-bash">npm run build  <span class="tok-comment">  # look for the Revalidate / Expire columns</span>
npx next start -p 19386
./goi.sh /isr; curl -s -XPOST "127.0.0.1:19385/gia?v=250"; ./goi.sh /isr
sleep 11; ./goi.sh /isr; sleep 2; ./goi.sh /isr <span class="tok-comment">  # HIT → STALE → HIT</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-5-phuc-vu-ban-cu" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 5.5 — Serving stale while the backend is down</span><span class="lc-sub">stale-while-revalidate at the proxy</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-2-day-khoa-cu" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.2 — Invalidation: five strategies, ranked</span><span class="lc-sub">time-based vs event-based</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-3-giam-dap" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.3 — The stampede: when a cache miss takes down the DB</span><span class="lc-sub">why "one refresher, everyone else gets the old copy" is safe</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Revalidation</span><span class="v">Refreshing cached data without a full rebuild.</span></div>
  <div class="kv"><span class="k">revalidate: N</span><span class="v">Time-based: data is refreshed at most every N seconds (ISR).</span></div>
  <div class="kv"><span class="k">revalidatePath</span><span class="v">On-demand: invalidate a path after a mutation.</span></div>
  <div class="kv"><span class="k">revalidateTag</span><span class="v">On-demand: invalidate fetches tagged with a label.</span></div>
  <div class="kv"><span class="k">ISR</span><span class="v">Incremental Static Regeneration — static pages that refresh over time.</span></div>
  <div class="kv"><span class="k">Stale-while-revalidate</span><span class="v">Serve cached data, refresh in the background.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Revalidation refreshes cached data without rebuilding the whole site.</li><li>Time-based: <code>revalidate: N</code> refreshes at most every N seconds (ISR).</li><li>On-demand: <code>revalidatePath</code>/<code>revalidateTag</code> invalidate after a mutation.</li><li>This gives you static speed with data that stays reasonably fresh.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Revalidating &amp; ISR</span><span class="lc-sub">Time-based revalidate, revalidatePath, revalidateTag, and tagging fetches.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Dữ liệu đã cache phải được làm mới — vấn đề là khi nào</h2>
<p class="lead">Cache đánh đổi độ tươi lấy tốc độ. Revalidate là cách bạn mua lại một phần độ tươi theo điều kiện của mình. Có hai mô hình, và app thật dùng cả hai.</p>

<h3>1 · Theo thời gian: làm mới mỗi N giây</h3>
<pre><code class="language-javascript">await fetch(url, { next: { revalidate: 60 } });

<span class="tok-comment">// hoặc cho cả route, trong page/layout:</span>
export const revalidate = 60;   <span class="tok-comment">// giây</span></code></pre>
<p>Request đầu tiên sau cửa sổ đó phục vụ bản cache cũ <em>và</em> kích hoạt làm mới ở nền; các request sau nhận bản mới. Người dùng không bao giờ phải đợi làm mới. Cái này thường gọi là ISR (Incremental Static Regeneration). Tuyệt cho nội dung đổi theo lịch lỏng — trang index blog, danh sách sản phẩm, một bảng xếp hạng chậm một phút cũng được.</p>

<h3>2 · Theo yêu cầu: làm mới đúng lúc dữ liệu đổi</h3>
<p>Cửa sổ thời gian là phỏng đoán. Khi bạn <em>biết</em> dữ liệu đã đổi — một người dùng vừa đăng bài — bạn có thể vô hiệu hoá chính xác:</p>
<pre><code class="language-javascript">import { revalidatePath, revalidateTag } from 'next/cache';

<span class="tok-comment">// sau một mutation (ví dụ trong một Server Action, Chương 12):</span>
revalidatePath('/blog');           <span class="tok-comment">// cache của route này giờ đã cũ</span>
revalidateTag('courses', 'max');   <span class="tok-comment">// mọi fetch gắn thẻ 'courses' đã cũ (Next.js 16: bắt buộc đối số thứ 2)</span></code></pre>
<p>Muốn dùng thẻ, gắn một thẻ khi fetch: <code>fetch(url, { next: { tags: ['courses'] } })</code>. Rồi một lệnh <code>revalidateTag('courses', 'max')</code> vô hiệu hoá mọi fetch mang thẻ đó, ở bất cứ đâu.</p>
<div class="callout warn"><p><strong>Next.js 16 đã đổi chữ ký hàm.</strong> Dạng một đối số <code>revalidateTag('courses')</code> của các bài hướng dẫn cũ không còn biên dịch được — đo thật: <code>error TS2554: Expected 2 arguments, but got 1</code>, và <code>next build</code> dừng ở bước TypeScript. Đối số thứ hai là profile cache: <code>'max'</code> cho kiểu stale-while-revalidate (lượt xem kế tiếp vẫn nhận một bản cũ, rồi mới tới bản mới). Trong Server Action, ngay sau khi chính người dùng vừa ghi, dùng <code>updateTag('courses')</code> — hết hạn ngay (Chương 12).</p></div>

<div class="kv-grid">
  <div class="kv"><span class="k">Theo thời gian hợp</span><span class="v">Dữ liệu tự trôi và hơi cũ cũng được: feed, danh sách, thống kê.</span></div>
  <div class="kv"><span class="k">Theo yêu cầu hợp</span><span class="v">Dữ liệu có thời điểm "vừa đổi" rõ ràng: đăng, sửa, xoá. Ghép nó với chính mutation gây ra.</span></div>
</div>

<div class="callout ok">
<p><strong>Mô hình tư duy:</strong> <code>cache</code> quyết <em>có</em> lưu hay không; <code>revalidate</code> quyết <em>khi nào buông</em>. Bắt đầu không cache lúc đang dựng, thêm cache ở chỗ nguồn chậm hoặc bị gọi nhiều, rồi thêm revalidate để nó không bao giờ cũ thật.</p>
</div>

<h3>Chọn dữ liệu phải tươi tới mức nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Tĩnh, nhớ đệm tới lần deploy sau</b> — Thứ một fetch không tuỳ chọn cho bạn <i>trong trang tĩnh</i> (đo: lưu với <code>revalidate</code> 31536000 s = một năm). Trong trang động bản 15+, cùng fetch đó không được cache chút nào (bài 10.2). Đúng cho nội dung chỉ đổi khi bạn deploy.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Theo thời gian: next: { revalidate: 60 }</b> — Phục vụ bản trong đệm, rồi dựng lại ở phía sau sau 60 giây. Người ghé đầu tiên sau khi hết hạn vẫn nhận trang cũ — chẳng ai phải chờ.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Theo yêu cầu: revalidatePath / revalidateTag</b> — Xoá đúng lúc dữ liệu đã đổi, từ một Server Action hoặc một webhook. Tươi ngay lập tức, còn lại thì vẫn nhớ đệm.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Không bao giờ đệm: cache: 'no-store'</b> — Mọi request đều chạm tới nguồn. Đúng cho một bảng điều khiển số liệu trực tiếp, lãng phí với mọi thứ khác.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — thêm <code>export const dynamic = &#39;force-dynamic&#39;</code> để chữa một giá trị bị cũ.</strong> Nó hiệu nghiệm tức thì và loại cả route ra khỏi mọi lớp đệm, vĩnh viễn: mỗi lượt ghé đều render lại trên máy chủ, chạy lại mọi truy vấn, và trang mất luôn phần sinh tĩnh. Trên một trang giới thiệu có một nghìn lượt ghé mỗi giờ thì đó là một nghìn lượt đi về cơ sở dữ liệu chỉ để giữ một con số tươi. Hãy với tay tới công cụ hẹp nhất chữa được đúng vấn đề — <code>revalidate</code> trên đúng phép fetch bị cũ, hoặc <code>revalidateTag</code> gọi từ chính đoạn mã làm nó đổi. Rồi kiểm phần đầu ra của build: route đánh dấu <code>ƒ</code> là động, <code>○</code> là tĩnh.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#revalidating" target="_blank" rel="noopener">
  <span class="lc-ico">⏲️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Làm mới (revalidate)</span><span class="lc-sub">Làm mới theo thời gian và theo yêu cầu, kèm ngữ nghĩa chính xác của từng cái.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Cấu hình đoạn route</span><span class="lc-sub">Mọi export làm đổi chế độ render của một route, và mỗi cái tốn gì.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm <code>next: { revalidate: 60 }</code> vào một fetch và xác nhận trang làm mới dữ liệu tối đa một lần mỗi phút.</li>
<li>Kích hoạt revalidate theo yêu cầu bằng <code>revalidatePath</code> (hoặc <code>revalidateTag</code>) sau một thay đổi.</li>
<li>So sánh revalidate theo thời gian và theo yêu cầu, mỗi cái một dòng.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn revalidate được dữ liệu cache theo thời gian và theo yêu cầu.</p></div>

<h3>🔬 Đo thật: cửa sổ stale-while-revalidate, tag vs path, và giá của force-dynamic (Next.js 16.4.6)</h3>
<p>Một trang tĩnh có <code>export const revalidate = 10</code> (bài dùng 60; 10 để kịp quan sát) gọi một API chờ <b>800 ms</b>. Một script nhỏ in giờ, tiêu đề <code>x-nextjs-cache</code>, giá trên trang và thời gian trả lời:</p>
<pre><code class="language-tsx"><span class="tok-comment">// trang tĩnh, làm mới theo thời gian: tối đa 10 giây một lần (bài dùng 60 — lab rút ngắn để đo)</span>
export const revalidate = 10;

export default async function Isr() {
  const d = await (await fetch('http://127.0.0.1:19385/gia?ms=800&amp;isr=1')).json(); <span class="tok-comment">  // API chậm 800 ms</span>
  return &lt;p id="gia"&gt;giá {d.gia} · API trả lúc {d.luc}&lt;/p&gt;;
}</code></pre>
<div class="out">$ npm run build
Route (app)           Revalidate  Expire
├ ○ /isr                     10s      1y
├ ○ /nghin/isr                1m      1y
○  (Static)   prerendered as static content
$ ./goi.sh /isr
22:11:33 /isr · x-nextjs-cache: HIT · giá 100 · 0.021816 s
$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo '   ← nguồn đổi'
{"gia":250}   ← nguồn đổi
$ ./goi.sh /isr
22:11:33 /isr · x-nextjs-cache: HIT · giá 100 · 0.003175 s
$ sleep 11; ./goi.sh /isr
22:11:44 /isr · x-nextjs-cache: STALE · giá 100 · 0.003367 s
$ sleep 2; ./goi.sh /isr
22:11:46 /isr · x-nextjs-cache: HIT · giá 250 · 0.002557 s
$ ./goi.sh /isr
22:11:46 /isr · x-nextjs-cache: HIT · giá 250 · 0.002691 s
$ (log API giả — các lượt /gia?ms=800&amp;isr=1)
  [api] 22:11:28.412 GET /gia?ms=800&amp;isr=1 · lượt #1 · chờ 800 ms
  [api] 22:11:44.847 GET /gia?ms=800&amp;isr=1 · lượt #2 · chờ 800 ms</div>
<p>Trong cửa sổ: HIT, giá cũ. Lượt đầu tiên sau cửa sổ: <b>STALE</b> — trang cũ, trong 3 ms; log API cho thấy lượt làm mới bắt đầu <i>sau</i> câu trả lời đó. Lượt kế: HIT, 250. Không ai phải chờ API 800 ms — và "60 giây" thật ra là "cũ tối đa một lượt xem + 60 giây".</p>
<p><b>Theo yêu cầu</b>: <code>/the</code> có fetch gắn nhãn <code>gia</code>, <code>/duong</code> không nhãn; một route handler gọi <code>revalidateTag(tag, 'max')</code> hoặc <code>revalidatePath(path)</code>:</p>
<pre><code class="language-typescript">import { revalidatePath, revalidateTag } from 'next/cache';

<span class="tok-comment">// POST /api/lam-moi?tag=gia  hoặc  ?path=/duong   (trong ứng dụng thật: webhook của CMS, có kiểm khoá bí mật)</span>
export async function POST(req: Request) {
  const u = new URL(req.url);
  const tag = u.searchParams.get('tag'), path = u.searchParams.get('path');
  if (tag) revalidateTag(tag, 'max');    <span class="tok-comment">  // Next.js 16: đối số thứ hai là BẮT BUỘC</span>
  if (path) revalidatePath(path);
  return Response.json({ daLamMoi: tag ?? path });
}</code></pre>
<div class="out">$ npx tsc --noEmit 2&gt;&amp;1 | grep -E 'sai-tag' | head -3
ban/sai-tag.ts(3,1): error TS2554: Expected 2 arguments, but got 1.
$ ./goi.sh /the; ./goi.sh /duong
22:10:43 /the · x-nextjs-cache: HIT · giá 100 · 0.021322 s
22:10:43 /duong · x-nextjs-cache: HIT · giá 100 · 0.006925 s
$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo '   ← nguồn đổi'
{"gia":250}   ← nguồn đổi
$ ./goi.sh /the; ./goi.sh /duong
22:10:43 /the · x-nextjs-cache: HIT · giá 100 · 0.002407 s
22:10:43 /duong · x-nextjs-cache: HIT · giá 100 · 0.002163 s
$ curl -s -XPOST 'localhost:19386/api/lam-moi?tag=gia'; echo
{"daLamMoi":"gia"}
$ ./goi.sh /the; sleep 1; ./goi.sh /the; ./goi.sh /duong
22:10:43 /the · x-nextjs-cache: STALE · giá 100 · 0.002805 s
22:10:44 /the · x-nextjs-cache: HIT · giá 250 · 0.002925 s
22:10:45 /duong · x-nextjs-cache: HIT · giá 100 · 0.002184 s
$ curl -s -XPOST 'localhost:19386/api/lam-moi?path=/duong'; echo
{"daLamMoi":"/duong"}
$ ./goi.sh /duong; sleep 1; ./goi.sh /duong
22:10:45 /duong · x-nextjs-cache: MISS · giá 250 · 0.012987 s
22:10:46 /duong · x-nextjs-cache: HIT · giá 250 · 0.003469 s</div>
<p>Sau <code>revalidateTag('gia', 'max')</code>: thêm một bản STALE, rồi mới tới giá mới — <code>/duong</code> (không nhãn) không bị đụng. Sau <code>revalidatePath('/duong')</code>: lượt xem ngay sau là MISS, render tại chỗ với giá mới.</p>
<p><b>Bẫy force-dynamic, có giá</b> — mỗi trang 100 lượt xem, API 50 ms:</p>
<div class="out">$ npm run build
├ ƒ /nghin/dong
├ ○ /nghin/isr                1m      1y
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
$ for p in dong isr; do t=$( { /usr/bin/time -p bash -c "for i in \\$(seq 100); do curl -s -o /dev/null localhost:19386/nghin/$p; done"; } 2&gt;&amp;1 | awk '/real/{print $2}'); echo "/nghin/$p · 100 lượt xem · $t s"; done
/nghin/dong · 100 lượt xem · 6.70 s
/nghin/isr · 100 lượt xem · 1.13 s
$ curl -s 127.0.0.1:19385/dem; echo
{"/gia?ms=50&amp;nghin=dong":100}</div>
<h3>🔁 Tự chạy lại</h3>
<p>Script <code>goi.sh</code> dùng ở trên (cần <code>api.mjs</code> của bài 10.1):</p>
<pre><code class="language-bash"><span class="tok-comment">#!/bin/bash</span>
<span class="tok-comment"># goi.sh &lt;đường dẫn&gt; — gọi trang 1 lần, in: giờ · tiêu đề x-nextjs-cache · giá trên trang · thời gian trả lời</span>
h=$(mktemp); b=$(mktemp)
t=$(curl -s -D "$h" -o "$b" -w '%{time_total}' "localhost:19386$1")
c=$(grep -i '^x-nextjs-cache' "$h" | tr -d '\\r' | cut -d' ' -f2); g=$(sed 's/&lt;!-- --&gt;//g' "$b" | grep -o 'giá [0-9]*' | head -1)
echo "$(date +%T) $1 · x-nextjs-cache: \${c:--} · $g · \${t} s"; rm -f "$h" "$b"</code></pre>
<pre><code class="language-bash">npm run build  <span class="tok-comment">  # tìm cột Revalidate / Expire</span>
npx next start -p 19386
./goi.sh /isr; curl -s -XPOST "127.0.0.1:19385/gia?v=250"; ./goi.sh /isr
sleep 11; ./goi.sh /isr; sleep 2; ./goi.sh /isr <span class="tok-comment">  # HIT → STALE → HIT</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-5-phuc-vu-ban-cu" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 5.5 — Phục vụ bản cũ: đứng vững khi backend đã ngã</span><span class="lc-sub">stale-while-revalidate ở tầng proxy</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-2-day-khoa-cu" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.2 — Đẩy khoá cũ: năm chiến lược, xếp hạng</span><span class="lc-sub">theo thời gian vs theo sự kiện</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-3-giam-dap" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.3 — Giẫm đạp: khi một lần trượt bộ đệm hạ gục CSDL</span><span class="lc-sub">vì sao "một người làm mới, mọi người nhận bản cũ" an toàn</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Revalidate</span><span class="v">Làm mới dữ liệu cache mà không build lại toàn bộ.</span></div>
  <div class="kv"><span class="k">revalidate: N</span><span class="v">Theo thời gian: dữ liệu làm mới tối đa mỗi N giây (ISR).</span></div>
  <div class="kv"><span class="k">revalidatePath</span><span class="v">Theo yêu cầu: vô hiệu một path sau một mutation.</span></div>
  <div class="kv"><span class="k">revalidateTag</span><span class="v">Theo yêu cầu: vô hiệu các fetch gắn một nhãn.</span></div>
  <div class="kv"><span class="k">ISR</span><span class="v">Incremental Static Regeneration — trang tĩnh làm mới theo thời gian.</span></div>
  <div class="kv"><span class="k">Stale-while-revalidate</span><span class="v">Phục vụ dữ liệu cache, làm mới ở nền.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Revalidate làm mới dữ liệu cache mà không build lại cả site.</li><li>Theo thời gian: <code>revalidate: N</code> làm mới tối đa mỗi N giây (ISR).</li><li>Theo yêu cầu: <code>revalidatePath</code>/<code>revalidateTag</code> vô hiệu sau một mutation.</li><li>Cách này cho tốc độ tĩnh với dữ liệu vẫn đủ mới.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Revalidating &amp; ISR</span><span class="lc-sub">Revalidate theo thời gian, revalidatePath, revalidateTag, và gắn thẻ fetch.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — Streaming: loading.tsx, Suspense, and the waterfall|||10.4 — Streaming: loading.tsx, Suspense và bẫy waterfall',
      slug: 'nextjs-10-4-streaming-suspense',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Await trên server có thể làm cả trang đợi. Streaming gửi vỏ trước và đổ phần chậm vào sau: loading.tsx cho cả route, <Suspense> cho từng mảnh. Và bẫy waterfall khi await nối tiếp thay vì song song.',
      content: `
${G10_4}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Don't make the whole page wait for the slowest query</h2>
<p class="lead">Awaiting on the server is simple, but if one query is slow, the user stares at nothing until it finishes. Streaming fixes this: send the fast shell immediately and stream slow parts in as they resolve. Next.js gives you two levers.</p>

<h3>1 · loading.tsx — an instant fallback for the whole route</h3>
<p>Drop a <code>loading.tsx</code> in a route folder and Next.js automatically wraps the page in a Suspense boundary. While the page's data resolves, the layout renders with <code>loading.tsx</code> in its slot — instantly, on navigation. No state to manage; you saw this file in Chapter 8, now you know what it is for.</p>
<pre><code class="language-javascript"><span class="tok-comment">// app/courses/loading.tsx</span>
export default function Loading() {
  return &lt;CourseListSkeleton /&gt;;   <span class="tok-comment">// shown while page data loads</span>
}</code></pre>

<h3>2 · &lt;Suspense&gt; — stream one slow piece, show the rest now</h3>
<p>For finer control, wrap just the slow component in <code>&lt;Suspense&gt;</code>. Everything outside renders immediately; the wrapped part streams in when ready. (The comments are written <code>{/* … */}</code>: a plain <code>// …</code> between JSX tags is <b>text</b> and shows on the page — measured below.)</p>
<pre><code class="language-javascript">import { Suspense } from 'react';

export default function Page() {
  return (
    &lt;&gt;
      &lt;Header /&gt;                         <span class="tok-comment">{/* instant */}</span>
      &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
        &lt;SlowRevenueChart /&gt;             <span class="tok-comment">{/* streams in later */}</span>
      &lt;/Suspense&gt;
    &lt;/&gt;
  );
}</code></pre>

<div class="pitfall">
<p><strong>The waterfall: sequential awaits that should be parallel.</strong> Writing two awaits one after another makes the second wait for the first even when they are independent:</p>
<pre><code class="language-javascript">const user = await getUser();       <span class="tok-comment">// 300ms</span>
const posts = await getPosts();     <span class="tok-comment">// 300ms → total 600ms, needlessly serial</span></code></pre>
<p>If neither depends on the other, start them together and await once — total time is the slower one, not the sum:</p>
<pre><code class="language-typescript">const [user, posts] = await Promise.all([getUser(), getPosts()]);   <span class="tok-comment">// ~300ms</span></code></pre>
<p>Only chain awaits when one genuinely needs the other's result. Otherwise <code>Promise.all</code>.</p>
</div>

<h3>Streaming a page in pieces</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>The shell goes out first</b> — Header, nav, layout — everything that does not wait on data. The user sees structure in milliseconds.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Slow parts stream in later</b> — Wrap them in <code>&lt;Suspense fallback={…}&gt;</code>. Next sends the fallback in the initial HTML, then the real content when it resolves.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>loading.tsx is a Suspense boundary</b> — For the whole segment. Fine for a page with one slow query, too coarse when one widget is slow and the rest is instant.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Each boundary is independent</b> — Three widgets, three boundaries, three arrival times. Nothing waits for the slowest.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — one Suspense boundary around the whole page, so the fastest content waits for the slowest.</strong> Putting the entire content in a single <code>loading.tsx</code> means the page shows a skeleton until <em>every</em> query has finished — the 20ms user header waits for the 900ms analytics chart. It looks like a slow app, and the fix is not a faster query but a smaller boundary: wrap only the chart, and let the header render immediately. The measurement that matters here is time to first contentful paint, not total load time; splitting boundaries improves the first without changing the second.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Loading UI and streaming</span><span class="lc-sub">How streaming works, and where to place boundaries.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/Suspense" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Suspense</span><span class="lc-sub">The component itself, and what triggers a fallback.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add a <code>loading.tsx</code> to a slow route and watch the shell appear instantly while the data streams in.</li>
<li>Wrap one slow component in <code>&lt;Suspense fallback=...&gt;</code> so the rest of the page shows immediately.</li>
<li>Create a waterfall (two awaits in sequence) then fix it by starting both fetches together.</li>
</ol>
<p><strong>Done when:</strong> you can stream UI with <code>loading.tsx</code>/Suspense and avoid a fetch waterfall.</p></div>

<h3>🔬 Measured: chunk by chunk (Next.js 16.4.6)</h3>
<p>A header whose data takes 20 ms and a revenue chart that takes 900 ms (dynamic page, fake API). A small script reads the HTML response as it streams and prints when each chunk arrives:</p>
<pre><code class="language-javascript"><span class="tok-comment">// luong.mjs &lt;url&gt; [chuỗi…] — đọc HTML theo từng MẨU khi máy chủ gửi (streaming), in mốc mili giây từ lúc gửi request + mẩu đó có những chuỗi nào</span>
const [url, ...tim] = process.argv.slice(2);
const t0 = performance.now();
const res = await fetch(url);
const dec = new TextDecoder();
let i = 0;
for await (const manh of res.body) {
  const s = dec.decode(manh, { stream: true });
  const co = tim.filter((x) =&gt; s.includes(x));
  console.log(&#96;+\${String(Math.round(performance.now() - t0)).padStart(4)} ms · mẩu \${++i} · \${String(manh.length).padStart(5)} B\${co.length ? ' · có: ' + co.join(', ') : ''}&#96;);
}</code></pre>
<pre><code class="language-tsx"><span class="tok-comment">// 3) chỉ bọc phần chậm trong &lt;Suspense&gt;</span>
import { Suspense } from 'react';
import { connection } from 'next/server';
import { Header, SlowRevenueChart, Spinner } from '../du-lieu';

export default async function MotManh() {
  await connection();
  return (
    &lt;main className="p-4 font-sans"&gt;
      &lt;Header /&gt;
      &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
        &lt;SlowRevenueChart /&gt;
      &lt;/Suspense&gt;
    &lt;/main&gt;
  );
}</code></pre>
<div class="out">$ node luong.mjs localhost:3000/st/khong TIEU-DE BIEU-DO      # 1) không ranh giới
+ 939 ms · mẩu 1 ·  1674 B · có: TIEU-DE, BIEU-DO
+ 939 ms · mẩu 2 ·  5801 B · có: TIEU-DE, BIEU-DO
+ 940 ms · mẩu 3 ·    14 B
$ node luong.mjs localhost:3000/st/ca-trang LOADING TIEU-DE BIEU-DO   # 2) loading.tsx cho cả trang
+  35 ms · mẩu 1 ·  1822 B · có: LOADING
+  35 ms · mẩu 2 ·  5847 B · có: LOADING
+  52 ms · mẩu 3 ·   160 B · có: TIEU-DE
+  52 ms · mẩu 4 ·   329 B · có: TIEU-DE
+ 934 ms · mẩu 5 ·   156 B · có: BIEU-DO
+ 935 ms · mẩu 6 ·   997 B · có: BIEU-DO
+ 935 ms · mẩu 7 ·    14 B
$ node luong.mjs localhost:3000/st/mot-manh TIEU-DE DANG-TAI BIEU-DO   # 3) Suspense quanh phần chậm
+  55 ms · mẩu 1 ·  1798 B · có: TIEU-DE, DANG-TAI
+  55 ms · mẩu 2 ·  5861 B · có: TIEU-DE, DANG-TAI
+ 933 ms · mẩu 3 ·   156 B · có: BIEU-DO
+ 934 ms · mẩu 4 ·   964 B · có: BIEU-DO
+ 934 ms · mẩu 5 ·    14 B
$ for p in khong ca-trang mot-manh; do curl -s -o /dev/null -w "/st/$p · byte đầu %{time_starttransfer} s · xong %{time_total} s\\n" localhost:19386/st/$p; done
/st/khong · byte đầu 0.908886 s · xong 0.908969 s
/st/ca-trang · byte đầu 0.006802 s · xong 0.909074 s
/st/mot-manh · byte đầu 0.031993 s · xong 0.908968 s</div>
<p>No boundary: nothing until ~0.9 s, then everything. <code>loading.tsx</code>: a skeleton in 35 ms — but the header, although its data is in the stream at 52 ms, only appears at the end (a Chromium screenshot at 300 ms shows only the skeleton): the whole segment is one boundary. <code>&lt;Suspense&gt;</code> around the chart: header + spinner in 55 ms. All three finish at ~0.9 s — streaming changes the first paint, not the total.</p>
<p>How it is written into the one HTML response — the fallback marked by an empty template, then the real HTML in a hidden div and an inline script that swaps it in:</p>
<div class="out">$ curl localhost:3000/st/mot-manh   (giải phẫu mẩu cuối — nội dung đến trong thẻ ẩn rồi được tráo vào)
&lt;div hidden id="S:0"&gt;&lt;p class="text-xl"&gt;📈 Doanh thu: 15 đơn — BIEU-DO&lt;/p&gt;&lt;/div&gt;&lt;script&gt;$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b
$ curl -s localhost:19386/st/mot-manh | grep -o '\\$RC("B:0","S:0")' | head -1
$RC("B:0","S:0")
$ curl -s localhost:19386/st/mot-manh | grep -o '&lt;!--\\$?--&gt;&lt;template id="B:0"&gt;&lt;/template&gt;.\\{0,70\\}' | sed 's/&lt;!-- --&gt;//g' | head -1
&lt;!--$?--&gt;&lt;template id="B:0"&gt;&lt;/template&gt;&lt;p class="text-xl text-gray-500"&gt;⏳ đang tải biểu đồ… DANG-TAI&lt;/p&gt;&lt;!--/</div>
<p>Consequence, measured: with JavaScript <b>off</b>, the fully loaded page still shows "đang tải biểu đồ…" — the chart is in the HTML, hidden, and nothing swaps it in. Keep must-see content outside Suspense boundaries.</p>
<p><b>The lesson's Suspense snippet, copied as written</b> (with <code>// instant</code> after the tags): both comments render as text on the page; <code>tsc</code> and <code>next build</code> are green; only ESLint catches it:</p>
<div class="out">$ curl -s localhost:19386/st/bai | sed 's/&lt;!-- --&gt;//g' | grep -o '&lt;/h1&gt;[^&lt;]*' | head -2
&lt;/h1&gt;                         // instant
$ curl -s localhost:19386/st/bai | grep -o '&lt;template id="P:1"&gt;&lt;/template&gt;[^&lt;]*' | head -1
&lt;template id="P:1"&gt;&lt;/template&gt;             // streams in later
$ npx eslint src/app/st/bai/page.tsx 2&gt;&amp;1 | grep -E 'jsx-no-comment|problem' | head -3
  10:17  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes
  12:29  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes
✖ 2 problems (2 errors, 0 warnings)</div>
<p><b>Waterfalls between components</b> — two pieces, 600 ms each. As siblings (two boundaries) vs B nested inside A:</p>
<pre><code class="language-tsx"><span class="tok-comment">// mảnh B nằm TRONG mảnh A: B chỉ bắt đầu sau khi A đã có dữ liệu</span>
import { Suspense } from 'react';
import { connection } from 'next/server';

const lay = async (p: string) =&gt; (await fetch('http://127.0.0.1:19385' + p, { cache: 'no-store' })).json();
async function ThongKe() { const d = await lay('/thong-ke?ms=600&amp;o=long'); return &lt;p&gt;📊 {d.binhLuan} bình luận — MANH-B&lt;/p&gt;; }
async function BaiViet() {
  const d = await lay('/bai-viet?ms=600&amp;o=long');
  return (
    &lt;section&gt;
      &lt;p&gt;📝 {d.length} bài viết — MANH-A&lt;/p&gt;
      &lt;Suspense fallback={&lt;p&gt;…&lt;/p&gt;}&gt;&lt;ThongKe /&gt;&lt;/Suspense&gt;
    &lt;/section&gt;
  );
}

export default async function LongNhau() {
  await connection();
  return (
    &lt;main className="p-4 font-sans"&gt;
      &lt;Suspense fallback={&lt;p&gt;…&lt;/p&gt;}&gt;&lt;BaiViet /&gt;&lt;/Suspense&gt;
    &lt;/main&gt;
  );
}</code></pre>
<div class="out">$ node luong.mjs http://localhost:19386/st/canh-nhau MANH-A MANH-B
+  36 ms · mẩu 1 ·  1713 B
+  36 ms · mẩu 2 ·  5759 B
+ 634 ms · mẩu 3 ·   123 B · có: MANH-A
+ 636 ms · mẩu 4 ·   941 B · có: MANH-A
+ 636 ms · mẩu 5 ·   125 B · có: MANH-B
+ 636 ms · mẩu 6 ·   114 B · có: MANH-B
+ 636 ms · mẩu 7 ·    14 B
$ node luong.mjs http://localhost:19386/st/long-nhau MANH-A MANH-B
+  35 ms · mẩu 1 ·  1655 B
+  35 ms · mẩu 2 ·  5658 B
+ 632 ms · mẩu 3 ·   264 B · có: MANH-A
+ 633 ms · mẩu 4 ·  1018 B · có: MANH-A
+1236 ms · mẩu 5 ·   125 B · có: MANH-B
+1236 ms · mẩu 6 ·   114 B · có: MANH-B
+1236 ms · mẩu 7 ·    14 B
$ (log API giả — hai lần vừa đo)
  [api] 22:21:44.423 GET /bai-viet?ms=600&amp;o=canh
  [api] 22:21:44.423 GET /thong-ke?ms=600&amp;o=canh
  [api] 22:21:45.147 GET /bai-viet?ms=600&amp;o=long
  [api] 22:21:45.749 GET /thong-ke?ms=600&amp;o=long</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">node luong.mjs http://localhost:3000/&lt;your page&gt; &lt;a word from the fast part&gt; &lt;a word from the slow part&gt;
curl -s -o /dev/null -w "first byte %{time_starttransfer} s · done %{time_total} s\\n" localhost:3000/&lt;your page&gt;</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-12-1-suspense-use" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 12.1 — Suspense for data and use()</span><span class="lc-sub">Suspense at the React level — what streaming builds on</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-1-http11" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 7.1 — HTTP/1.1 on the wire</span><span class="lc-sub">one response, sent in pieces</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Streaming</span><span class="v">Send the page shell first, then stream in slow parts.</span></div>
  <div class="kv"><span class="k">loading.tsx</span><span class="v">A route-level Suspense fallback shown while data loads.</span></div>
  <div class="kv"><span class="k">Suspense</span><span class="v">Boundary that shows a fallback until its child is ready.</span></div>
  <div class="kv"><span class="k">Shell</span><span class="v">The instant part of the page around the streamed content.</span></div>
  <div class="kv"><span class="k">Waterfall</span><span class="v">Sequential awaits that each wait for the previous — slow.</span></div>
  <div class="kv"><span class="k">Parallel fetch</span><span class="v">Start fetches together to avoid the waterfall.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Streaming sends the page shell instantly and streams slow parts in as they finish.</li><li><code>loading.tsx</code> is a route-level Suspense fallback; <code>&lt;Suspense&gt;</code> scopes it to one component.</li><li>Avoid waterfalls: start independent fetches together instead of awaiting them in sequence.</li><li>The result is a fast first paint even when some data is slow.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Loading UI and Streaming</span><span class="lc-sub">loading.tsx, Suspense boundaries, and streaming slow content.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Đừng bắt cả trang đợi truy vấn chậm nhất</h2>
<p class="lead">Await trên server thì đơn giản, nhưng nếu một truy vấn chậm, người dùng nhìn khoảng trắng tới khi nó xong. Streaming chữa điều này: gửi vỏ nhanh ngay lập tức và đổ các phần chậm vào khi chúng giải quyết xong. Next.js cho bạn hai cần gạt.</p>

<h3>1 · loading.tsx — fallback tức thì cho cả route</h3>
<p>Đặt một <code>loading.tsx</code> vào thư mục route và Next.js tự bọc page trong một ranh giới Suspense. Trong lúc dữ liệu của page giải quyết, layout render với <code>loading.tsx</code> ở khe của nó — tức thì, khi điều hướng. Không state phải quản; bạn đã thấy file này ở Chương 8, giờ bạn biết nó để làm gì.</p>
<pre><code class="language-javascript"><span class="tok-comment">// app/courses/loading.tsx</span>
export default function Loading() {
  return &lt;CourseListSkeleton /&gt;;   <span class="tok-comment">// hiện trong lúc dữ liệu page tải</span>
}</code></pre>

<h3>2 · &lt;Suspense&gt; — stream một mảnh chậm, hiện phần còn lại ngay</h3>
<p>Muốn điều khiển mịn hơn, chỉ bọc component chậm trong <code>&lt;Suspense&gt;</code>. Mọi thứ bên ngoài render ngay; phần được bọc stream vào khi sẵn sàng. (Chú thích viết <code>{/* … */}</code>: một dòng <code>// …</code> trần đặt giữa các thẻ JSX là <b>chữ</b> và hiện lên trang — đo ở dưới.)</p>
<pre><code class="language-javascript">import { Suspense } from 'react';

export default function Page() {
  return (
    &lt;&gt;
      &lt;Header /&gt;                         <span class="tok-comment">{/* tức thì */}</span>
      &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
        &lt;SlowRevenueChart /&gt;             <span class="tok-comment">{/* stream vào sau */}</span>
      &lt;/Suspense&gt;
    &lt;/&gt;
  );
}</code></pre>

<div class="pitfall">
<p><strong>Waterfall: các await nối tiếp lẽ ra phải song song.</strong> Viết hai await liền nhau làm cái thứ hai đợi cái thứ nhất dù chúng độc lập:</p>
<pre><code class="language-javascript">const user = await getUser();       <span class="tok-comment">// 300ms</span>
const posts = await getPosts();     <span class="tok-comment">// 300ms → tổng 600ms, nối tiếp vô ích</span></code></pre>
<p>Nếu không cái nào phụ thuộc cái kia, hãy khởi động cùng lúc và await một lần — tổng thời gian là cái chậm hơn, không phải tổng:</p>
<pre><code class="language-typescript">const [user, posts] = await Promise.all([getUser(), getPosts()]);   <span class="tok-comment">// ~300ms</span></code></pre>
<p>Chỉ nối await khi cái này thật sự cần kết quả cái kia. Còn lại thì <code>Promise.all</code>.</p>
</div>

<h3>Truyền một trang theo từng mảnh</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Cái vỏ đi ra trước</b> — Đầu trang, thanh điều hướng, layout — mọi thứ không phải chờ dữ liệu. Người dùng thấy được cấu trúc trong vài mili giây.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Phần chậm chảy về sau</b> — Hãy bọc chúng trong <code>&lt;Suspense fallback={…}&gt;</code>. Next gửi phần dự phòng trong HTML ban đầu, rồi gửi nội dung thật khi nó xong.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>loading.tsx là một ranh giới Suspense</b> — Cho cả đoạn. Ổn với một trang có một truy vấn chậm, quá thô khi chỉ một widget chậm còn phần còn lại tức thì.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Mỗi ranh giới độc lập với nhau</b> — Ba widget, ba ranh giới, ba thời điểm về. Chẳng cái nào phải chờ cái chậm nhất.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một ranh giới Suspense bọc cả trang, khiến nội dung nhanh nhất phải chờ nội dung chậm nhất.</strong> Đặt toàn bộ nội dung vào một <code>loading.tsx</code> duy nhất nghĩa là trang hiện khung xương cho tới khi <em>mọi</em> truy vấn xong — cái đầu trang 20ms phải chờ cái biểu đồ phân tích 900ms. Nó trông như một ứng dụng chậm, và cách chữa không phải một truy vấn nhanh hơn mà là một ranh giới nhỏ hơn: chỉ bọc cái biểu đồ, và để đầu trang vẽ ra ngay. Phép đo có ý nghĩa ở đây là thời gian tới lần vẽ nội dung đầu tiên, không phải tổng thời gian tải; chia nhỏ ranh giới cải thiện cái thứ nhất mà không đổi cái thứ hai.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Giao diện tải và streaming</span><span class="lc-sub">Streaming hoạt động ra sao, và đặt ranh giới ở đâu.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/Suspense" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Suspense</span><span class="lc-sub">Bản thân component đó, và cái gì kích hoạt phần dự phòng.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một <code>loading.tsx</code> cho một route chậm và xem khung hiện ngay trong khi dữ liệu stream về.</li>
<li>Bọc một component chậm trong <code>&lt;Suspense fallback=...&gt;</code> để phần còn lại của trang hiện ngay.</li>
<li>Tạo một waterfall (hai await nối tiếp) rồi sửa bằng cách khởi động cả hai fetch cùng lúc.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn stream được UI bằng <code>loading.tsx</code>/Suspense và tránh được waterfall fetch.</p></div>

<h3>🔬 Đo thật: từng mẩu một (Next.js 16.4.6)</h3>
<p>Một tiêu đề cần 20 ms dữ liệu và một biểu đồ doanh thu cần 900 ms (trang động, API giả). Một script nhỏ đọc phản hồi HTML trong lúc nó chảy về và in mốc của từng mẩu:</p>
<pre><code class="language-javascript"><span class="tok-comment">// luong.mjs &lt;url&gt; [chuỗi…] — đọc HTML theo từng MẨU khi máy chủ gửi (streaming), in mốc mili giây từ lúc gửi request + mẩu đó có những chuỗi nào</span>
const [url, ...tim] = process.argv.slice(2);
const t0 = performance.now();
const res = await fetch(url);
const dec = new TextDecoder();
let i = 0;
for await (const manh of res.body) {
  const s = dec.decode(manh, { stream: true });
  const co = tim.filter((x) =&gt; s.includes(x));
  console.log(&#96;+\${String(Math.round(performance.now() - t0)).padStart(4)} ms · mẩu \${++i} · \${String(manh.length).padStart(5)} B\${co.length ? ' · có: ' + co.join(', ') : ''}&#96;);
}</code></pre>
<pre><code class="language-tsx"><span class="tok-comment">// 3) chỉ bọc phần chậm trong &lt;Suspense&gt;</span>
import { Suspense } from 'react';
import { connection } from 'next/server';
import { Header, SlowRevenueChart, Spinner } from '../du-lieu';

export default async function MotManh() {
  await connection();
  return (
    &lt;main className="p-4 font-sans"&gt;
      &lt;Header /&gt;
      &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
        &lt;SlowRevenueChart /&gt;
      &lt;/Suspense&gt;
    &lt;/main&gt;
  );
}</code></pre>
<div class="out">$ node luong.mjs localhost:3000/st/khong TIEU-DE BIEU-DO      # 1) không ranh giới
+ 939 ms · mẩu 1 ·  1674 B · có: TIEU-DE, BIEU-DO
+ 939 ms · mẩu 2 ·  5801 B · có: TIEU-DE, BIEU-DO
+ 940 ms · mẩu 3 ·    14 B
$ node luong.mjs localhost:3000/st/ca-trang LOADING TIEU-DE BIEU-DO   # 2) loading.tsx cho cả trang
+  35 ms · mẩu 1 ·  1822 B · có: LOADING
+  35 ms · mẩu 2 ·  5847 B · có: LOADING
+  52 ms · mẩu 3 ·   160 B · có: TIEU-DE
+  52 ms · mẩu 4 ·   329 B · có: TIEU-DE
+ 934 ms · mẩu 5 ·   156 B · có: BIEU-DO
+ 935 ms · mẩu 6 ·   997 B · có: BIEU-DO
+ 935 ms · mẩu 7 ·    14 B
$ node luong.mjs localhost:3000/st/mot-manh TIEU-DE DANG-TAI BIEU-DO   # 3) Suspense quanh phần chậm
+  55 ms · mẩu 1 ·  1798 B · có: TIEU-DE, DANG-TAI
+  55 ms · mẩu 2 ·  5861 B · có: TIEU-DE, DANG-TAI
+ 933 ms · mẩu 3 ·   156 B · có: BIEU-DO
+ 934 ms · mẩu 4 ·   964 B · có: BIEU-DO
+ 934 ms · mẩu 5 ·    14 B
$ for p in khong ca-trang mot-manh; do curl -s -o /dev/null -w "/st/$p · byte đầu %{time_starttransfer} s · xong %{time_total} s\\n" localhost:19386/st/$p; done
/st/khong · byte đầu 0.908886 s · xong 0.908969 s
/st/ca-trang · byte đầu 0.006802 s · xong 0.909074 s
/st/mot-manh · byte đầu 0.031993 s · xong 0.908968 s</div>
<p>Không ranh giới: không có gì tới ~0,9 s, rồi tất cả. <code>loading.tsx</code>: khung xương trong 35 ms — nhưng tiêu đề, dù dữ liệu đã nằm trong luồng ở 52 ms, chỉ hiện ở cuối (ảnh Chromium lúc 300 ms chỉ có khung xương): cả đoạn là một ranh giới. <code>&lt;Suspense&gt;</code> quanh biểu đồ: tiêu đề + vòng xoay trong 55 ms. Cả ba xong ở ~0,9 s — streaming đổi lần vẽ đầu, không đổi tổng thời gian.</p>
<p>Nó được viết vào chính một phản hồi HTML ra sao — fallback đánh dấu bằng template rỗng, sau đó HTML thật trong một div ẩn và một script nhỏ tráo nó vào:</p>
<div class="out">$ curl localhost:3000/st/mot-manh   (giải phẫu mẩu cuối — nội dung đến trong thẻ ẩn rồi được tráo vào)
&lt;div hidden id="S:0"&gt;&lt;p class="text-xl"&gt;📈 Doanh thu: 15 đơn — BIEU-DO&lt;/p&gt;&lt;/div&gt;&lt;script&gt;$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b
$ curl -s localhost:19386/st/mot-manh | grep -o '\\$RC("B:0","S:0")' | head -1
$RC("B:0","S:0")
$ curl -s localhost:19386/st/mot-manh | grep -o '&lt;!--\\$?--&gt;&lt;template id="B:0"&gt;&lt;/template&gt;.\\{0,70\\}' | sed 's/&lt;!-- --&gt;//g' | head -1
&lt;!--$?--&gt;&lt;template id="B:0"&gt;&lt;/template&gt;&lt;p class="text-xl text-gray-500"&gt;⏳ đang tải biểu đồ… DANG-TAI&lt;/p&gt;&lt;!--/</div>
<p>Hệ quả, đo thật: <b>tắt</b> JavaScript, trang đã tải xong vẫn hiện "đang tải biểu đồ…" — biểu đồ có trong HTML, bị ẩn, và không có gì tráo vào. Nội dung bắt buộc phải thấy thì để ngoài ranh giới Suspense.</p>
<p><b>Đoạn mã Suspense của bài, chép nguyên</b> (có <code>// instant</code> sau thẻ): cả hai chú thích hiện thành chữ trên trang; <code>tsc</code> và <code>next build</code> xanh; chỉ ESLint bắt được:</p>
<div class="out">$ curl -s localhost:19386/st/bai | sed 's/&lt;!-- --&gt;//g' | grep -o '&lt;/h1&gt;[^&lt;]*' | head -2
&lt;/h1&gt;                         // instant
$ curl -s localhost:19386/st/bai | grep -o '&lt;template id="P:1"&gt;&lt;/template&gt;[^&lt;]*' | head -1
&lt;template id="P:1"&gt;&lt;/template&gt;             // streams in later
$ npx eslint src/app/st/bai/page.tsx 2&gt;&amp;1 | grep -E 'jsx-no-comment|problem' | head -3
  10:17  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes
  12:29  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes
✖ 2 problems (2 errors, 0 warnings)</div>
<p><b>Thác nước giữa các component</b> — hai mảnh, mỗi mảnh 600 ms. Anh em (hai ranh giới) so với B lồng trong A:</p>
<pre><code class="language-tsx"><span class="tok-comment">// mảnh B nằm TRONG mảnh A: B chỉ bắt đầu sau khi A đã có dữ liệu</span>
import { Suspense } from 'react';
import { connection } from 'next/server';

const lay = async (p: string) =&gt; (await fetch('http://127.0.0.1:19385' + p, { cache: 'no-store' })).json();
async function ThongKe() { const d = await lay('/thong-ke?ms=600&amp;o=long'); return &lt;p&gt;📊 {d.binhLuan} bình luận — MANH-B&lt;/p&gt;; }
async function BaiViet() {
  const d = await lay('/bai-viet?ms=600&amp;o=long');
  return (
    &lt;section&gt;
      &lt;p&gt;📝 {d.length} bài viết — MANH-A&lt;/p&gt;
      &lt;Suspense fallback={&lt;p&gt;…&lt;/p&gt;}&gt;&lt;ThongKe /&gt;&lt;/Suspense&gt;
    &lt;/section&gt;
  );
}

export default async function LongNhau() {
  await connection();
  return (
    &lt;main className="p-4 font-sans"&gt;
      &lt;Suspense fallback={&lt;p&gt;…&lt;/p&gt;}&gt;&lt;BaiViet /&gt;&lt;/Suspense&gt;
    &lt;/main&gt;
  );
}</code></pre>
<div class="out">$ node luong.mjs http://localhost:19386/st/canh-nhau MANH-A MANH-B
+  36 ms · mẩu 1 ·  1713 B
+  36 ms · mẩu 2 ·  5759 B
+ 634 ms · mẩu 3 ·   123 B · có: MANH-A
+ 636 ms · mẩu 4 ·   941 B · có: MANH-A
+ 636 ms · mẩu 5 ·   125 B · có: MANH-B
+ 636 ms · mẩu 6 ·   114 B · có: MANH-B
+ 636 ms · mẩu 7 ·    14 B
$ node luong.mjs http://localhost:19386/st/long-nhau MANH-A MANH-B
+  35 ms · mẩu 1 ·  1655 B
+  35 ms · mẩu 2 ·  5658 B
+ 632 ms · mẩu 3 ·   264 B · có: MANH-A
+ 633 ms · mẩu 4 ·  1018 B · có: MANH-A
+1236 ms · mẩu 5 ·   125 B · có: MANH-B
+1236 ms · mẩu 6 ·   114 B · có: MANH-B
+1236 ms · mẩu 7 ·    14 B
$ (log API giả — hai lần vừa đo)
  [api] 22:21:44.423 GET /bai-viet?ms=600&amp;o=canh
  [api] 22:21:44.423 GET /thong-ke?ms=600&amp;o=canh
  [api] 22:21:45.147 GET /bai-viet?ms=600&amp;o=long
  [api] 22:21:45.749 GET /thong-ke?ms=600&amp;o=long</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">node luong.mjs http://localhost:3000/&lt;trang của bạn&gt; &lt;một chữ ở phần nhanh&gt; &lt;một chữ ở phần chậm&gt;
curl -s -o /dev/null -w "byte đầu %{time_starttransfer} s · xong %{time_total} s\\n" localhost:3000/&lt;trang của bạn&gt;</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-12-1-suspense-use" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 12.1 — Suspense cho dữ liệu và use()</span><span class="lc-sub">Suspense ở tầng React — nền của streaming</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-1-http11" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 7.1 — HTTP/1.1 trên dây</span><span class="lc-sub">một phản hồi gửi dần từng mẩu</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Streaming</span><span class="v">Gửi khung trang trước, rồi stream dần các phần chậm.</span></div>
  <div class="kv"><span class="k">loading.tsx</span><span class="v">Fallback Suspense cấp route hiện trong lúc dữ liệu tải.</span></div>
  <div class="kv"><span class="k">Suspense</span><span class="v">Ranh giới hiện một fallback tới khi con của nó sẵn sàng.</span></div>
  <div class="kv"><span class="k">Khung (shell)</span><span class="v">Phần hiện ngay của trang quanh nội dung stream.</span></div>
  <div class="kv"><span class="k">Waterfall</span><span class="v">Các await nối tiếp mỗi cái chờ cái trước — chậm.</span></div>
  <div class="kv"><span class="k">Fetch song song</span><span class="v">Khởi động các fetch cùng lúc để tránh waterfall.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Streaming gửi khung trang ngay và stream các phần chậm vào khi chúng xong.</li><li><code>loading.tsx</code> là fallback Suspense cấp route; <code>&lt;Suspense&gt;</code> giới hạn nó vào một component.</li><li>Tránh waterfall: khởi động các fetch độc lập cùng lúc thay vì await nối tiếp.</li><li>Kết quả là first paint nhanh kể cả khi vài dữ liệu chậm.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Loading UI and Streaming</span><span class="lc-sub">loading.tsx, ranh giới Suspense, và stream nội dung chậm.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — When caching bites: staleness in practice|||10.5 — Khi cache cắn: dữ liệu cũ trong thực tế',
      slug: 'nextjs-10-5-staleness-thuc-te',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Cache tuyệt cho tới lúc bạn quên nó đang bật. Bài này về triệu chứng "đã sửa rồi mà web vẫn hiện cũ", nơi tìm, và một mẹo thật từ cuongthai.com: API danh sách cache 120 s (+ tới 600 s bản cũ) nên DB mới là sự thật.',
      content: `
${G10_5}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>The most confusing bug in Next.js: "I changed it, the page still shows the old value"</h2>
<p class="lead">Caching is a performance gift that becomes a debugging trap the day you forget it is on. You update the database, reload, and the page shows yesterday's data. Nothing is broken — a cache is doing exactly its job. Knowing the layers means you know where to look.</p>

<h3>Where staleness can live</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">The fetch's Data Cache</span><span class="v">A cached <code>fetch</code> (force-cache, or a revalidate window not yet elapsed) returns the old response. Fix: <code>no-store</code>, a shorter <code>revalidate</code>, or a <code>revalidateTag</code>/<code>revalidatePath</code> on change.</span></div>
  <div class="kv"><span class="k">Your own API layer</span><span class="v">Even before Next.js caches, your backend endpoint may cache. A stale list can originate one layer below the page.</span></div>
  <div class="kv"><span class="k">The browser / CDN</span><span class="v">A CDN in front (see the site's own history) can serve a cached response — including a cached 404. The page is right; the edge is stale.</span></div>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com deals with list staleness:</strong> several of the site's public list endpoints are cacheable for speed — measured on 13/11/2026: <code>Cache-Control: public, max-age=120, stale-while-revalidate=600</code> (set in <code>src/routes/course.routes.ts</code>), and the <code>/courses</code> page itself revalidates every 120 s. The consequence, learned in practice: after seeding or editing content, the <em>list</em> can lag by two minutes — and a shared cache may serve the old list for up to 10 more — so the <strong>database (and the per-item detail endpoint) is treated as the source of truth</strong>, not the cached list. The lesson pages read the detail endpoint precisely so a freshly-seeded lesson shows immediately even while the list is still warm from cache. When you verify a change and the list "hasn't updated," suspect the 120-second cache (plus its stale window) before assuming the write failed. Logged-in users get <code>private, no-store</code> — their <code>isEnrolled</code> is personal.</p>
</div>

<div class="pitfall">
<p><strong>A CDN caches 404s too.</strong> A related, painful lesson from this very project: fetching a URL <em>before</em> the asset exists can make the CDN cache the 404 for that exact URL for hours — so it keeps returning "not found" even after you upload the file. The tell: the file is on disk / in storage, but the URL still 404s. Workarounds: verify with a cache-busting query (<code>?cb=timestamp</code>), and if a URL is already poisoned, change the URL (e.g. add <code>?v=2</code>) rather than waiting the cache out.</p>
</div>

<div class="callout ok">
<p><strong>Practical order while developing:</strong> start with data uncached so you always see the latest. Add caching only where you have measured a slow or heavily-hit source, and pair every cache with a revalidation strategy so "it went stale" never becomes a mystery.</p>
</div>

<h3>Choosing a staleness budget per screen</h3>
<div class="lz-map">
  <div class="lz-stage">The question is how wrong the data may be, and for how long</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">A blog post</div><div class="lz-nsub">Stale for hours is fine. Static, revalidated on publish. The fastest option, and the cheapest.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">A product listing</div><div class="lz-nsub">Stale for a minute is fine. <code>revalidate: 60</code> — visitors get a cached page and the price is never more than a minute old.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">A user&#39;s own dashboard</div><div class="lz-nsub">Must be current for that user. Dynamic, or cached per user with on-demand revalidation after their own writes.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">A live count</div><div class="lz-nsub">No caching at all, and reconsider whether it needs to be on the server — a client-side poll or a socket may be the honest answer.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — caching a page that renders per-user data, and serving one user's page to another.</strong> A route that reads a cookie or a session and is also statically cached will serve the first visitor&#39;s HTML to everyone else. Next.js guards against this — reading <code>cookies()</code> or <code>headers()</code> opts the route into dynamic rendering automatically — but the guard disappears the moment the personal data arrives some other way: a <code>fetch</code> with an auth header built from a module-level variable, or a cache the app manages itself. The test is worth running deliberately: log in as two different users in two browsers and compare the page. It is the kind of bug nobody finds by reading code.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Dynamic rendering</span><span class="lc-sub">Which APIs opt a route out of static rendering, and why.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#opting-out-2" target="_blank" rel="noopener">
  <span class="lc-ico">🚪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Opting out of caching</span><span class="lc-sub">Every escape hatch, with the scope each one applies to.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>After a mutation, notice the list still shows old data because the route was cached; fix it by revalidating the path.</li>
<li>Reproduce a stale page by changing data in the DB directly and reloading — then add the right <code>revalidate</code>.</li>
<li>Write a one-line checklist: after every write, which cache do I need to invalidate?</li>
</ol>
<p><strong>Done when:</strong> you can diagnose a staleness bug and pick the right revalidation.</p></div>

<h3>🔬 Measured: find the layer with curl, this site's own caches, and a per-user leak (Next.js 16.4.6 · 14.2.35)</h3>
<p>The symptom, reproduced: a static page with a bare fetch; the source changes; the response itself says who answered:</p>
<div class="out">$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo '   ← "đã sửa DB"'
{"gia":250}   ← "đã sửa DB"
$ curl -s -D - localhost:19386/bang-gia | sed 's/&lt;!-- --&gt;//g' | grep -oE 'x-nextjs-cache: [A-Z]+|giá [0-9]+'
x-nextjs-cache: HIT
giá 100</div>
<p>This site, measured — the public curriculum list and the code that sets its cache:</p>
<div class="out">$ curl -s -D - -o /dev/null 'https://cuongthai.com/api/v1/courses/chuong-trinh' | grep -iE '^HTTP|cache-control'
HTTP/2 200 
cache-control: public, max-age=120, stale-while-revalidate=600
$ grep -n "max-age=120" ~/Downloads/api-backend/src/routes/course.routes.ts | head -3 | cut -c1-110
931:      res.set('Cache-Control', req.userId ? 'private, no-store' : 'public, max-age=120, stale-while-revali
1123:      : 'public, max-age=120, stale-while-revalidate=600');
1333:      res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
$ grep -n "revalidate: 120" ~/Downloads/api-backend/frontend/src/app/courses/page.tsx
18:      next: { revalidate: 120 },</div>
<p>The CDN in front of R2 caches a <b>404</b> too — a key that never existed, requested twice, then with a cache-busting query:</p>
<div class="out">$ K=images/thu-cdn-404/&lt;tên-chưa-từng-có&gt;.webp   (khoá ngẫu nhiên, KHÔNG bao giờ dùng)
HTTP/2 404   cf-cache-status: MISS  
HTTP/2 404   cf-cache-status: HIT  
$ K=$(cat /tmp/nxj-k404.txt); curl -s -D - -o /dev/null "https://media.cuongthai.com/$K?cb=$(date +%s)" | grep -iE '^HTTP|cf-cache-status' | tr '\\r\\n' '  '; echo
HTTP/2 404   cf-cache-status: MISS  </div>
<p><b>Per-user data</b> — two cookies (<code>u=an</code>, <code>u=binh</code>), three pages: reading <code>cookies()</code>; a cached fetch that forwards the cookie in its headers; and a self-made <code>unstable_cache</code> whose key forgot the user:</p>
<pre><code class="language-tsx">import { cookies } from 'next/headers';
import { unstable_cache } from 'next/cache';
<span class="tok-comment">// cache TỰ QUẢN: bọc lời gọi bằng unstable_cache, khoá cache chỉ là ['ho-so'] — QUÊN người dùng</span>
export default async function ToiUnstable() {
  const u = (await cookies()).get('u')?.value ?? '';
  const layHoSo = unstable_cache(
    async () =&gt; (await fetch('http://127.0.0.1:19385/ho-so?p=unstable', { headers: { cookie: &#96;u=\${u}&#96; } })).json(),
    ['ho-so'],
    { revalidate: 60 },
  );
  const d = await layHoSo();
  return &lt;p id="toi"&gt;xin chào {d.ten} · số dư {d.soDu}&lt;/p&gt;;
}</code></pre>
<div class="out">$ npm run build
├ ○ /bang-gia
├ ƒ /toi/cookies
├ ƒ /toi/revalidate
├ ƒ /toi/unstable
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
$ for p in cookies revalidate unstable; do for u in an binh; do echo "/toi/$p · cookie u=$u ⇒ $(curl -s -H "Cookie: u=$u" localhost:19386/toi/$p | sed 's/&lt;!-- --&gt;//g' | grep -o 'xin chào [^&lt;]*')"; done; done
/toi/cookies · cookie u=an ⇒ xin chào an · số dư 1500000
/toi/cookies · cookie u=binh ⇒ xin chào binh · số dư 20000
/toi/revalidate · cookie u=an ⇒ xin chào an · số dư 1500000
/toi/revalidate · cookie u=binh ⇒ xin chào binh · số dư 20000
/toi/unstable · cookie u=an ⇒ xin chào an · số dư 1500000
/toi/unstable · cookie u=binh ⇒ xin chào an · số dư 1500000</div>
<p>Reading <code>cookies()</code> made the routes ƒ; a fetch sending the cookie header is cached per header value — both correct. The hand-made cache served <b>An's balance to Bình</b>, with no error. The same shape as this repo's <code>frontend/src/app/courses/[slug]/page.tsx</code> (force-dynamic + cookie forwarded + <code>revalidate</code>) on Next.js 14.2.35 — no leak, one cache entry per cookie:</p>
<div class="out">$ npx next --version
Next.js v14.2.35
$ for u in an binh an; do echo "cookie u=$u ⇒ $(curl -s -H "Cookie: u=$u" localhost:19387/toi | sed 's/&lt;!-- --&gt;//g' | grep -o 'xin chào [^&lt;]*')"; done
cookie u=an ⇒ xin chào an · số dư 1500000
cookie u=binh ⇒ xin chào binh · số dư 20000
cookie u=an ⇒ xin chào an · số dư 1500000
$ curl -s 127.0.0.1:19385/dem | grep -o '"/ho-so?p=v14":[0-9]*'
"/ho-so?p=v14":2
$ ls .next/cache/fetch-cache | wc -l | sed 's/^ */mục trong fetch-cache: /'
mục trong fetch-cache: 3</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:3000/&lt;page&gt; | grep -iE "x-nextjs-cache|cache-control|age|cf-cache-status"
curl -s -D - -o /dev/null https://cuongthai.com/api/v1/courses/chuong-trinh | grep -i cache-control
for u in an binh; do curl -s -H "Cookie: u=$u" localhost:3000/&lt;per-user page&gt; | grep -o "&lt;your marker&gt;[^&lt;]*"; done</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-2-cai-gi-duoc-cache" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 5.2 — What gets cached, and the leak</span><span class="lc-sub">caching what should have been per-user</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-4-nhat-quan" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.4 — When the cache and the DB disagree</span><span class="lc-sub">consistency between cache and source</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-3-2-cache" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 3.2 — Cache-Control per content type</span><span class="lc-sub">assets on R2 + Cloudflare</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Staleness</span><span class="v">Serving old cached data after the source changed.</span></div>
  <div class="kv"><span class="k">Cache invalidation</span><span class="v">Telling Next to drop and refetch cached data.</span></div>
  <div class="kv"><span class="k">After-write revalidate</span><span class="v">Revalidate the affected path/tag after a mutation.</span></div>
  <div class="kv"><span class="k">Dynamic opt-out</span><span class="v">Force fresh rendering when data must be live.</span></div>
  <div class="kv"><span class="k">Diagnose by curl</span><span class="v">Check the live response, do not assume from code.</span></div>
  <div class="kv"><span class="k">Source of truth</span><span class="v">The database changed; the cache did not know.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Staleness is the price of caching: after a write, cached pages still show old data.</li><li>Invalidate the right cache after every mutation (<code>revalidatePath</code>/<code>revalidateTag</code>).</li><li>When data must always be live, opt the route out of caching.</li><li>Diagnose staleness by checking the live response, not by reading the code.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#and-you-should-know" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Caching: things to know</span><span class="lc-sub">How the caches interact, and how to opt out when you need freshness.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Bug khó hiểu nhất trong Next.js: "sửa rồi mà trang vẫn hiện giá trị cũ"</h2>
<p class="lead">Cache là món quà hiệu năng, và trở thành cái bẫy gỡ lỗi vào ngày bạn quên nó đang bật. Bạn cập nhật database, tải lại, và trang hiện dữ liệu hôm qua. Không có gì hỏng — một cache đang làm đúng việc của nó. Biết các lớp nghĩa là biết nhìn đâu.</p>

<h3>Dữ liệu cũ có thể trú ở đâu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Data Cache của fetch</span><span class="v">Một <code>fetch</code> đã cache (force-cache, hoặc cửa sổ revalidate chưa hết) trả về phản hồi cũ. Chữa: <code>no-store</code>, <code>revalidate</code> ngắn hơn, hoặc <code>revalidateTag</code>/<code>revalidatePath</code> khi đổi.</span></div>
  <div class="kv"><span class="k">Tầng API của chính bạn</span><span class="v">Ngay trước cả cache Next.js, endpoint backend của bạn có thể cache. Một danh sách cũ có thể bắt nguồn một lớp dưới trang.</span></div>
  <div class="kv"><span class="k">Trình duyệt / CDN</span><span class="v">Một CDN phía trước (xem chính lịch sử của site) có thể phục vụ một phản hồi đã cache — kể cả một 404 đã cache. Trang đúng; biên (edge) mới cũ.</span></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com xử lý danh sách cũ thế nào:</strong> vài endpoint danh sách công khai của site cho phép cache để nhanh — đo ngày 13/11/2026: <code>Cache-Control: public, max-age=120, stale-while-revalidate=600</code> (đặt trong <code>src/routes/course.routes.ts</code>), và chính trang <code>/courses</code> revalidate mỗi 120 giây. Hệ quả, rút ra từ thực tế: sau khi seed hay sửa nội dung, <em>danh sách</em> có thể trễ hai phút — và bộ đệm dùng chung còn được trả bản cũ thêm tới 10 phút — nên <strong>database (và endpoint chi tiết từng mục) được coi là sự thật</strong>, không phải danh sách đã cache. Trang bài học đọc endpoint chi tiết chính vì thế — để một bài vừa seed hiện ngay cả khi danh sách còn ấm cache. Khi bạn kiểm một thay đổi mà danh sách "chưa cập nhật", hãy nghi cache 120 giây (cộng cửa sổ bản cũ) trước khi cho rằng ghi đã hỏng. Người đã đăng nhập nhận <code>private, no-store</code> — vì <code>isEnrolled</code> là dữ liệu riêng.</p>
</div>

<div class="pitfall">
<p><strong>CDN cache cả 404.</strong> Một bài học đau và liên quan từ chính dự án này: fetch một URL <em>trước khi</em> tài nguyên tồn tại có thể làm CDN cache cái 404 cho đúng URL đó hàng giờ — nên nó cứ trả "không tìm thấy" kể cả sau khi bạn upload file. Dấu hiệu: file đã ở trên đĩa / trong lưu trữ, nhưng URL vẫn 404. Cách lách: kiểm bằng một query phá cache (<code>?cb=timestamp</code>), và nếu một URL đã nhiễm, hãy đổi URL (ví dụ thêm <code>?v=2</code>) thay vì ngồi chờ cache hết hạn.</p>
</div>

<div class="callout ok">
<p><strong>Thứ tự thực dụng khi phát triển:</strong> bắt đầu để dữ liệu không cache để luôn thấy cái mới nhất. Chỉ thêm cache ở chỗ bạn đã đo được nguồn chậm hoặc bị gọi nhiều, và ghép mỗi cache với một chiến lược revalidate để "nó bị cũ" không bao giờ thành điều bí ẩn.</p>
</div>

<h3>Chọn ngân sách độ cũ cho từng màn hình</h3>
<div class="lz-map">
  <div class="lz-stage">Câu hỏi là dữ liệu được phép sai tới đâu, và trong bao lâu</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Một bài blog</div><div class="lz-nsub">Cũ vài tiếng cũng không sao. Tĩnh, làm mới lúc xuất bản. Lựa chọn nhanh nhất, và rẻ nhất.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Một danh sách sản phẩm</div><div class="lz-nsub">Cũ một phút cũng không sao. <code>revalidate: 60</code> — khách nhận trang trong đệm và giá chẳng bao giờ cũ quá một phút.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Bảng điều khiển của chính người dùng</div><div class="lz-nsub">Phải đúng thời điểm với người dùng đó. Động, hoặc nhớ đệm theo từng người kèm làm mới theo yêu cầu sau mỗi lần họ ghi.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Một con số đếm trực tiếp</div><div class="lz-nsub">Không nhớ đệm gì cả, và hãy cân nhắc lại xem nó có cần nằm trên máy chủ không — một phép hỏi định kỳ phía client hoặc một socket có khi mới là câu trả lời thành thật.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — nhớ đệm một trang vẽ dữ liệu riêng của từng người, rồi phục vụ trang của người này cho người khác.</strong> Một route đọc cookie hay một phiên đăng nhập mà lại được nhớ đệm tĩnh sẽ phục vụ HTML của người ghé đầu tiên cho tất cả những người còn lại. Next.js có chốt chặn chuyện này — đọc <code>cookies()</code> hay <code>headers()</code> sẽ tự động đưa route sang chế độ render động — nhưng cái chốt biến mất ngay khi dữ liệu cá nhân đi vào bằng đường khác: một <code>fetch</code> mang header xác thực dựng từ một biến ở cấp module, hoặc một bộ nhớ đệm do chính ứng dụng tự quản. Phép thử này đáng chạy một cách có chủ đích: đăng nhập bằng hai người dùng khác nhau trên hai trình duyệt rồi so trang. Đây là loại lỗi chẳng ai tìm ra bằng cách đọc mã.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Render động</span><span class="lc-sub">Những API nào đưa một route ra khỏi chế độ sinh tĩnh, và vì sao.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#opting-out-2" target="_blank" rel="noopener">
  <span class="lc-ico">🚪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Không dùng nhớ đệm</span><span class="lc-sub">Mọi cửa thoát, kèm phạm vi mà từng cái áp dụng.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Sau một mutation, để ý danh sách vẫn hiện dữ liệu cũ vì route đã bị cache; sửa bằng revalidate path.</li>
<li>Tái hiện một trang cũ bằng cách đổi dữ liệu thẳng trong DB và tải lại — rồi thêm <code>revalidate</code> đúng.</li>
<li>Viết checklist một dòng: sau mỗi lần ghi, mình cần vô hiệu cache nào?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chẩn được một bug dữ liệu cũ và chọn đúng cách revalidate.</p></div>

<h3>🔬 Đo thật: tìm tầng bằng curl, cache của chính trang này, và một vụ rò dữ liệu riêng (Next.js 16.4.6 · 14.2.35)</h3>
<p>Tái hiện triệu chứng: trang tĩnh có fetch trần; nguồn đổi; chính phản hồi cho biết ai đã trả lời:</p>
<div class="out">$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo '   ← "đã sửa DB"'
{"gia":250}   ← "đã sửa DB"
$ curl -s -D - localhost:19386/bang-gia | sed 's/&lt;!-- --&gt;//g' | grep -oE 'x-nextjs-cache: [A-Z]+|giá [0-9]+'
x-nextjs-cache: HIT
giá 100</div>
<p>Chính trang này, đo thật — danh sách chương trình học công khai và dòng mã đặt cache cho nó:</p>
<div class="out">$ curl -s -D - -o /dev/null 'https://cuongthai.com/api/v1/courses/chuong-trinh' | grep -iE '^HTTP|cache-control'
HTTP/2 200 
cache-control: public, max-age=120, stale-while-revalidate=600
$ grep -n "max-age=120" ~/Downloads/api-backend/src/routes/course.routes.ts | head -3 | cut -c1-110
931:      res.set('Cache-Control', req.userId ? 'private, no-store' : 'public, max-age=120, stale-while-revali
1123:      : 'public, max-age=120, stale-while-revalidate=600');
1333:      res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
$ grep -n "revalidate: 120" ~/Downloads/api-backend/frontend/src/app/courses/page.tsx
18:      next: { revalidate: 120 },</div>
<p>Mạng phân phối trước R2 lưu cả <b>404</b> — một khoá chưa từng tồn tại, hỏi hai lần, rồi thêm tham số phá cache:</p>
<div class="out">$ K=images/thu-cdn-404/&lt;tên-chưa-từng-có&gt;.webp   (khoá ngẫu nhiên, KHÔNG bao giờ dùng)
HTTP/2 404   cf-cache-status: MISS  
HTTP/2 404   cf-cache-status: HIT  
$ K=$(cat /tmp/nxj-k404.txt); curl -s -D - -o /dev/null "https://media.cuongthai.com/$K?cb=$(date +%s)" | grep -iE '^HTTP|cf-cache-status' | tr '\\r\\n' '  '; echo
HTTP/2 404   cf-cache-status: MISS  </div>
<p><b>Dữ liệu riêng từng người</b> — hai cookie (<code>u=an</code>, <code>u=binh</code>), ba trang: đọc <code>cookies()</code>; fetch có cache, chuyển cookie trong header; và <code>unstable_cache</code> tự quản có khoá quên người dùng:</p>
<pre><code class="language-tsx">import { cookies } from 'next/headers';
import { unstable_cache } from 'next/cache';
<span class="tok-comment">// cache TỰ QUẢN: bọc lời gọi bằng unstable_cache, khoá cache chỉ là ['ho-so'] — QUÊN người dùng</span>
export default async function ToiUnstable() {
  const u = (await cookies()).get('u')?.value ?? '';
  const layHoSo = unstable_cache(
    async () =&gt; (await fetch('http://127.0.0.1:19385/ho-so?p=unstable', { headers: { cookie: &#96;u=\${u}&#96; } })).json(),
    ['ho-so'],
    { revalidate: 60 },
  );
  const d = await layHoSo();
  return &lt;p id="toi"&gt;xin chào {d.ten} · số dư {d.soDu}&lt;/p&gt;;
}</code></pre>
<div class="out">$ npm run build
├ ○ /bang-gia
├ ƒ /toi/cookies
├ ƒ /toi/revalidate
├ ƒ /toi/unstable
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
$ for p in cookies revalidate unstable; do for u in an binh; do echo "/toi/$p · cookie u=$u ⇒ $(curl -s -H "Cookie: u=$u" localhost:19386/toi/$p | sed 's/&lt;!-- --&gt;//g' | grep -o 'xin chào [^&lt;]*')"; done; done
/toi/cookies · cookie u=an ⇒ xin chào an · số dư 1500000
/toi/cookies · cookie u=binh ⇒ xin chào binh · số dư 20000
/toi/revalidate · cookie u=an ⇒ xin chào an · số dư 1500000
/toi/revalidate · cookie u=binh ⇒ xin chào binh · số dư 20000
/toi/unstable · cookie u=an ⇒ xin chào an · số dư 1500000
/toi/unstable · cookie u=binh ⇒ xin chào an · số dư 1500000</div>
<p>Đọc <code>cookies()</code> làm route thành ƒ; fetch gửi header cookie được cache theo giá trị header — cả hai đúng. Cache tự làm đã đưa <b>số dư của An cho Bình</b>, không một lỗi nào. Cùng khuôn với <code>frontend/src/app/courses/[slug]/page.tsx</code> của kho (force-dynamic + chuyển cookie + <code>revalidate</code>) trên Next.js 14.2.35 — không rò, mỗi cookie một mục cache:</p>
<div class="out">$ npx next --version
Next.js v14.2.35
$ for u in an binh an; do echo "cookie u=$u ⇒ $(curl -s -H "Cookie: u=$u" localhost:19387/toi | sed 's/&lt;!-- --&gt;//g' | grep -o 'xin chào [^&lt;]*')"; done
cookie u=an ⇒ xin chào an · số dư 1500000
cookie u=binh ⇒ xin chào binh · số dư 20000
cookie u=an ⇒ xin chào an · số dư 1500000
$ curl -s 127.0.0.1:19385/dem | grep -o '"/ho-so?p=v14":[0-9]*'
"/ho-so?p=v14":2
$ ls .next/cache/fetch-cache | wc -l | sed 's/^ */mục trong fetch-cache: /'
mục trong fetch-cache: 3</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:3000/&lt;trang&gt; | grep -iE "x-nextjs-cache|cache-control|age|cf-cache-status"
curl -s -D - -o /dev/null https://cuongthai.com/api/v1/courses/chuong-trinh | grep -i cache-control
for u in an binh; do curl -s -H "Cookie: u=$u" localhost:3000/&lt;trang dữ liệu riêng&gt; | grep -o "&lt;chữ đánh dấu&gt;[^&lt;]*"; done</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-2-cai-gi-duoc-cache" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 5.2 — Cái gì được cache, và vụ rò rỉ</span><span class="lc-sub">cache thứ lẽ ra riêng của từng người</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-4-nhat-quan" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.4 — Khi bộ đệm và CSDL nói khác nhau</span><span class="lc-sub">nhất quán giữa cache và nguồn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-3-2-cache" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 3.2 — Cache-Control theo loại tệp</span><span class="lc-sub">ảnh trên R2 + Cloudflare</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dữ liệu cũ (staleness)</span><span class="v">Phục vụ dữ liệu cache cũ sau khi nguồn đã đổi.</span></div>
  <div class="kv"><span class="k">Vô hiệu cache</span><span class="v">Bảo Next bỏ và fetch lại dữ liệu cache.</span></div>
  <div class="kv"><span class="k">Revalidate sau khi ghi</span><span class="v">Revalidate path/tag bị ảnh hưởng sau một mutation.</span></div>
  <div class="kv"><span class="k">Tắt cache động</span><span class="v">Ép render mới khi dữ liệu phải sống.</span></div>
  <div class="kv"><span class="k">Chẩn bằng curl</span><span class="v">Kiểm response thật, đừng giả định từ code.</span></div>
  <div class="kv"><span class="k">Nguồn sự thật</span><span class="v">Database đã đổi; cache không biết.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Dữ liệu cũ là cái giá của cache: sau một lần ghi, trang cache vẫn hiện dữ liệu cũ.</li><li>Vô hiệu đúng cache sau mỗi mutation (<code>revalidatePath</code>/<code>revalidateTag</code>).</li><li>Khi dữ liệu phải luôn sống, hãy tắt cache cho route đó.</li><li>Chẩn dữ liệu cũ bằng cách kiểm response thật, không phải đọc code.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#and-you-should-know" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Caching: điều nên biết</span><span class="lc-sub">Các cache tương tác ra sao, và cách opt-out khi bạn cần độ tươi.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.6 QUIZ ─────────────────────────── */
    {
      title: '10.6 — Chapter 10 quiz|||10.6 — Kiểm tra chương 10',
      slug: 'nextjs-10-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về fetch trong Server Component, tuỳ chọn cache và mặc định theo phiên bản, request memoization, revalidate theo thời gian/yêu cầu, streaming/Suspense, waterfall và dữ liệu cũ.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 10: fetching in Server Components, cache options and the version-dependent default, request memoization, time-based and on-demand revalidation, streaming, the waterfall, and staleness.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 10: fetch trong Server Component, tuỳ chọn cache và mặc định theo phiên bản, request memoization, revalidate theo thời gian/yêu cầu, streaming, waterfall, và dữ liệu cũ.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'The default way to load a page\'s initial data in the App Router is…|||Cách mặc định để tải dữ liệu ban đầu của một trang trong App Router là…',
            options: [
              'useEffect + useState on the client|||useEffect + useState trên client',
              'an async Server Component that awaits the data directly|||một Server Component async await dữ liệu thẳng',
              'a global store|||một store toàn cục',
              'getServerSideProps|||getServerSideProps',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does server fetching avoid the out-of-order race from Chapter 5?|||Vì sao fetch trên server tránh được cuộc đua sai thứ tự ở Chương 5?',
            options: [
              'fetch is faster on the server|||fetch nhanh hơn trên server',
              'the data is awaited and resolved before render — one request, no client interleaving|||dữ liệu được await và giải quyết trước render — một request, không xen kẽ ở client',
              'React disables races|||React tắt các cuộc đua',
              'it does not — the race still happens|||không tránh — cuộc đua vẫn xảy ra',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the safe claim about fetch caching defaults in Next.js?|||Khẳng định an toàn về mặc định cache của fetch trong Next.js là gì?',
            options: [
              'fetch is always cached|||fetch luôn được cache',
              'fetch is never cached|||fetch không bao giờ được cache',
              'the default changed across versions (14 cached, 15+ not) — set it explicitly|||mặc định đã đổi giữa các bản (14 cache, 15+ không) — hãy đặt tường minh',
              'caching does not exist for fetch|||fetch không có cache',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Which option forces a fresh fetch on every request (dynamic)?|||Tuỳ chọn nào buộc fetch mới mỗi request (động)?',
            options: [
              "cache: 'force-cache'|||cache: 'force-cache'",
              "cache: 'no-store'|||cache: 'no-store'",
              'next: { revalidate: 3600 }|||next: { revalidate: 3600 }',
              'nothing can force freshness|||không gì buộc được độ tươi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A layout and a page both fetch /api/user with the same options in one request. How many real requests?|||Một layout và một page cùng fetch /api/user với cùng tuỳ chọn trong một request. Bao nhiêu request thật?',
            options: [
              'Two|||Hai',
              'One — request memoization dedups within a render|||Một — request memoization dedupe trong một lần render',
              'Zero|||Không',
              'Depends on the browser|||Tuỳ trình duyệt',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You want a listing that can be up to 60s stale but never blocks users on refresh. Use…|||Bạn muốn một danh sách cũ tối đa 60s nhưng không bao giờ chặn người dùng khi làm mới. Dùng…',
            options: [
              "cache: 'no-store'|||cache: 'no-store'",
              'next: { revalidate: 60 } (time-based / ISR)|||next: { revalidate: 60 } (theo thời gian / ISR)',
              'a client useEffect|||một useEffect ở client',
              'no caching is possible here|||không cache được ở đây',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A user just published a post and you must refresh exactly the affected data now. Use…|||Một người dùng vừa đăng bài và bạn phải làm mới đúng dữ liệu bị ảnh hưởng ngay. Dùng…',
            options: [
              'wait for the time window to elapse|||chờ cửa sổ thời gian trôi qua',
              "revalidatePath('/blog') or revalidateTag('posts')|||revalidatePath('/blog') hoặc revalidateTag('posts')",
              'clear the browser cache|||xoá cache trình duyệt',
              'restart the server|||khởi động lại server',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does dropping a loading.tsx into a route folder do?|||Đặt một loading.tsx vào thư mục route làm gì?',
            options: [
              'nothing without configuration|||không gì nếu chưa cấu hình',
              'auto-wraps the page in a Suspense boundary and shows it while data loads|||tự bọc page trong một ranh giới Suspense và hiện nó khi dữ liệu tải',
              'disables streaming|||tắt streaming',
              'creates a /loading route|||tạo route /loading',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Two independent queries take 300ms each. Best way to run them in a Server Component?|||Hai truy vấn độc lập mỗi cái 300ms. Cách tốt nhất chạy trong một Server Component?',
            options: [
              'await one then the other (≈600ms)|||await cái này rồi cái kia (≈600ms)',
              'await Promise.all([a(), b()]) (≈300ms)|||await Promise.all([a(), b()]) (≈300ms)',
              'run them in useEffect|||chạy trong useEffect',
              'they cannot run in parallel|||không chạy song song được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You edit content, reload, and the list still shows the old data with no error. First suspect?|||Bạn sửa nội dung, tải lại, danh sách vẫn hiện dữ liệu cũ mà không lỗi. Nghi ngờ đầu tiên?',
            options: [
              'the write silently failed|||việc ghi âm thầm thất bại',
              'a cache layer (fetch Data Cache, your API cache, or the CDN) serving a stale copy|||một lớp cache (Data Cache của fetch, cache API của bạn, hay CDN) đang phục vụ bản cũ',
              'React is broken|||React bị hỏng',
              'the database was wiped|||database bị xoá',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
