/**
 * Next.js & React — Chương 10: Fetch dữ liệu, cache & revalidate.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * ⚠ Cache mặc định của fetch ĐÃ ĐỔI giữa các phiên bản Next (14 cache sẵn;
 * 15+ KHÔNG cache mặc định). Bài dạy theo mô hình HIỆN HÀNH (15+: không cache,
 * opt-in) và nói rõ điểm nhạy phiên bản này thay vì khẳng định một mặc định
 * có thể sai. Không có "output console" để chạy — chương thuần cơ chế/quy ước.
 */

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
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>The default way to load data is just await</h2>
<p class="lead">In Chapter 5 you fetched on the client with <code>useEffect</code>, a loading state, and a race guard. In the App Router, the <em>default</em> place to load a page's data is a Server Component — and there it is far simpler: mark the component <code>async</code> and <code>await</code> the data directly in the body.</p>

<pre><code><span class="tok-comment">// app/courses/page.tsx — a Server Component</span>
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

<pre><code><span class="tok-comment">// app/courses/page.tsx — một Server Component</span>
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
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Caching is powerful — and the default has changed, so pin it down</h2>
<p class="lead">Next.js extends the native <code>fetch</code> with caching options, so a fetched value can be reused across requests instead of hitting the source every time. But there is a real trap: <strong>the default caching behaviour changed between Next.js versions.</strong> Do not memorise "the default" — memorise how to set it explicitly.</p>

<div class="callout warn">
<p><strong>Version reality:</strong> in Next.js 14, <code>fetch</code> was cached by default (like <code>force-cache</code>). In Next.js 15+, fetches are <em>not</em> cached by default. Same code, different behaviour across a major version. Always check your version, and when it matters, state the cache option explicitly rather than relying on the default.</p>
</div>

<h3>Set it explicitly and you never guess</h3>
<pre><code><span class="tok-comment">// cache this result and reuse it (static-ish)</span>
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
<p>Separate from the persistent cache, Next.js <em>memoizes</em> identical fetches during a single render pass. If a layout and a page both call <code>fetch('/api/user')</code> with the same options while rendering one request, the actual network call happens <strong>once</strong> and both get the result.</p>
<pre><code><span class="tok-comment">// layout.tsx and page.tsx both do this during one request:</span>
const user = await fetch('/api/user').then(r =&gt; r.json());
<span class="tok-comment">// → only ONE real request; the second is served from memoization</span></code></pre>
<p>This means you can fetch the same data in each component that needs it, without threading it through props or worrying about duplicate calls. It is scoped to one render and cleared afterwards — different from the cross-request Data Cache above.</p>

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
<pre><code><span class="tok-comment">// cache kết quả này và dùng lại (kiểu tĩnh)</span>
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
<p>Tách khỏi cache bền, Next.js <em>ghi nhớ</em> các fetch giống hệt nhau trong một lượt render. Nếu một layout và một page cùng gọi <code>fetch('/api/user')</code> với cùng tuỳ chọn trong lúc render một request, cú gọi mạng thật xảy ra <strong>một lần</strong> và cả hai đều nhận kết quả.</p>
<pre><code><span class="tok-comment">// layout.tsx và page.tsx đều làm thế này trong một request:</span>
const user = await fetch('/api/user').then(r =&gt; r.json());
<span class="tok-comment">// → chỉ MỘT request thật; cái thứ hai lấy từ memoization</span></code></pre>
<p>Nghĩa là bạn có thể fetch cùng dữ liệu ở mỗi component cần nó, không phải luồn qua props hay lo gọi trùng. Nó khoanh trong một lần render và xoá sau đó — khác với Data Cache xuyên-request ở trên.</p>

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
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Cached data must be refreshed — the question is when</h2>
<p class="lead">Caching trades freshness for speed. Revalidation is how you buy some freshness back on your terms. There are two models, and real apps use both.</p>

<h3>1 · Time-based: refresh every N seconds</h3>
<pre><code>await fetch(url, { next: { revalidate: 60 } });

<span class="tok-comment">// or for a whole route, in the page/layout:</span>
export const revalidate = 60;   <span class="tok-comment">// seconds</span></code></pre>
<p>The first request after the window serves the stale cached copy <em>and</em> triggers a background refresh; subsequent requests get the fresh one. Users never wait for the refresh. This is often called ISR (Incremental Static Regeneration). Great for content that changes on a loose schedule — a blog index, a product list, a leaderboard that can lag a minute.</p>

<h3>2 · On-demand: refresh exactly when data changes</h3>
<p>Time windows are guesses. When you <em>know</em> the data changed — a user published a post — you can invalidate precisely:</p>
<pre><code>import { revalidatePath, revalidateTag } from 'next/cache';

<span class="tok-comment">// after a mutation (e.g. in a Server Action, Chapter 12):</span>
revalidatePath('/blog');           <span class="tok-comment">// this route's cache is now stale</span>
revalidateTag('courses');          <span class="tok-comment">// any fetch tagged 'courses' is stale</span></code></pre>
<p>To use tags, attach one when fetching: <code>fetch(url, { next: { tags: ['courses'] } })</code>. Then a single <code>revalidateTag('courses')</code> invalidates every fetch carrying that tag, wherever it lives.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Time-based fits</span><span class="v">Data that drifts on its own and can be slightly stale: feeds, listings, stats.</span></div>
  <div class="kv"><span class="k">On-demand fits</span><span class="v">Data with a clear "it just changed" moment: publish, edit, delete. Pair it with the mutation that caused it.</span></div>
</div>

<div class="callout ok">
<p><strong>Mental model:</strong> <code>cache</code> decides <em>whether</em> to store; <code>revalidate</code> decides <em>when to let go</em>. Start uncached while building, add caching where a source is slow or hit often, then add revalidation so it never goes truly stale.</p>
</div>

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
<pre><code>await fetch(url, { next: { revalidate: 60 } });

<span class="tok-comment">// hoặc cho cả route, trong page/layout:</span>
export const revalidate = 60;   <span class="tok-comment">// giây</span></code></pre>
<p>Request đầu tiên sau cửa sổ đó phục vụ bản cache cũ <em>và</em> kích hoạt làm mới ở nền; các request sau nhận bản mới. Người dùng không bao giờ phải đợi làm mới. Cái này thường gọi là ISR (Incremental Static Regeneration). Tuyệt cho nội dung đổi theo lịch lỏng — trang index blog, danh sách sản phẩm, một bảng xếp hạng chậm một phút cũng được.</p>

<h3>2 · Theo yêu cầu: làm mới đúng lúc dữ liệu đổi</h3>
<p>Cửa sổ thời gian là phỏng đoán. Khi bạn <em>biết</em> dữ liệu đã đổi — một người dùng vừa đăng bài — bạn có thể vô hiệu hoá chính xác:</p>
<pre><code>import { revalidatePath, revalidateTag } from 'next/cache';

<span class="tok-comment">// sau một mutation (ví dụ trong một Server Action, Chương 12):</span>
revalidatePath('/blog');           <span class="tok-comment">// cache của route này giờ đã cũ</span>
revalidateTag('courses');          <span class="tok-comment">// mọi fetch gắn thẻ 'courses' đã cũ</span></code></pre>
<p>Muốn dùng thẻ, gắn một thẻ khi fetch: <code>fetch(url, { next: { tags: ['courses'] } })</code>. Rồi một lệnh <code>revalidateTag('courses')</code> vô hiệu hoá mọi fetch mang thẻ đó, ở bất cứ đâu.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Theo thời gian hợp</span><span class="v">Dữ liệu tự trôi và hơi cũ cũng được: feed, danh sách, thống kê.</span></div>
  <div class="kv"><span class="k">Theo yêu cầu hợp</span><span class="v">Dữ liệu có thời điểm "vừa đổi" rõ ràng: đăng, sửa, xoá. Ghép nó với chính mutation gây ra.</span></div>
</div>

<div class="callout ok">
<p><strong>Mô hình tư duy:</strong> <code>cache</code> quyết <em>có</em> lưu hay không; <code>revalidate</code> quyết <em>khi nào buông</em>. Bắt đầu không cache lúc đang dựng, thêm cache ở chỗ nguồn chậm hoặc bị gọi nhiều, rồi thêm revalidate để nó không bao giờ cũ thật.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Don't make the whole page wait for the slowest query</h2>
<p class="lead">Awaiting on the server is simple, but if one query is slow, the user stares at nothing until it finishes. Streaming fixes this: send the fast shell immediately and stream slow parts in as they resolve. Next.js gives you two levers.</p>

<h3>1 · loading.tsx — an instant fallback for the whole route</h3>
<p>Drop a <code>loading.tsx</code> in a route folder and Next.js automatically wraps the page in a Suspense boundary. While the page's data resolves, the layout renders with <code>loading.tsx</code> in its slot — instantly, on navigation. No state to manage; you saw this file in Chapter 8, now you know what it is for.</p>
<pre><code><span class="tok-comment">// app/courses/loading.tsx</span>
export default function Loading() {
  return &lt;CourseListSkeleton /&gt;;   <span class="tok-comment">// shown while page data loads</span>
}</code></pre>

<h3>2 · &lt;Suspense&gt; — stream one slow piece, show the rest now</h3>
<p>For finer control, wrap just the slow component in <code>&lt;Suspense&gt;</code>. Everything outside renders immediately; the wrapped part streams in when ready.</p>
<pre><code>import { Suspense } from 'react';

export default function Page() {
  return (
    &lt;&gt;
      &lt;Header /&gt;                         <span class="tok-comment">// instant</span>
      &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
        &lt;SlowRevenueChart /&gt;             <span class="tok-comment">// streams in later</span>
      &lt;/Suspense&gt;
    &lt;/&gt;
  );
}</code></pre>

<div class="pitfall">
<p><strong>The waterfall: sequential awaits that should be parallel.</strong> Writing two awaits one after another makes the second wait for the first even when they are independent:</p>
<pre><code>const user = await getUser();       <span class="tok-comment">// 300ms</span>
const posts = await getPosts();     <span class="tok-comment">// 300ms → total 600ms, needlessly serial</span></code></pre>
<p>If neither depends on the other, start them together and await once — total time is the slower one, not the sum:</p>
<pre><code>const [user, posts] = await Promise.all([getUser(), getPosts()]);   <span class="tok-comment">// ~300ms</span></code></pre>
<p>Only chain awaits when one genuinely needs the other's result. Otherwise <code>Promise.all</code>.</p>
</div>

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
<pre><code><span class="tok-comment">// app/courses/loading.tsx</span>
export default function Loading() {
  return &lt;CourseListSkeleton /&gt;;   <span class="tok-comment">// hiện trong lúc dữ liệu page tải</span>
}</code></pre>

<h3>2 · &lt;Suspense&gt; — stream một mảnh chậm, hiện phần còn lại ngay</h3>
<p>Muốn điều khiển mịn hơn, chỉ bọc component chậm trong <code>&lt;Suspense&gt;</code>. Mọi thứ bên ngoài render ngay; phần được bọc stream vào khi sẵn sàng.</p>
<pre><code>import { Suspense } from 'react';

export default function Page() {
  return (
    &lt;&gt;
      &lt;Header /&gt;                         <span class="tok-comment">// tức thì</span>
      &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
        &lt;SlowRevenueChart /&gt;             <span class="tok-comment">// stream vào sau</span>
      &lt;/Suspense&gt;
    &lt;/&gt;
  );
}</code></pre>

<div class="pitfall">
<p><strong>Waterfall: các await nối tiếp lẽ ra phải song song.</strong> Viết hai await liền nhau làm cái thứ hai đợi cái thứ nhất dù chúng độc lập:</p>
<pre><code>const user = await getUser();       <span class="tok-comment">// 300ms</span>
const posts = await getPosts();     <span class="tok-comment">// 300ms → tổng 600ms, nối tiếp vô ích</span></code></pre>
<p>Nếu không cái nào phụ thuộc cái kia, hãy khởi động cùng lúc và await một lần — tổng thời gian là cái chậm hơn, không phải tổng:</p>
<pre><code>const [user, posts] = await Promise.all([getUser(), getPosts()]);   <span class="tok-comment">// ~300ms</span></code></pre>
<p>Chỉ nối await khi cái này thật sự cần kết quả cái kia. Còn lại thì <code>Promise.all</code>.</p>
</div>

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
      description: 'Cache tuyệt cho tới lúc bạn quên nó đang bật. Bài này về triệu chứng "đã sửa rồi mà web vẫn hiện cũ", nơi tìm, và một mẹo thật từ cuongthai.com: API list cache ~60s nên DB mới là sự thật.',
      content: `
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
<p><strong>How cuongthai.com deals with list staleness:</strong> several of the site's public list endpoints cache for about 60 seconds for speed. The consequence, learned in practice: after seeding or editing content, the <em>list</em> API can lag by up to a minute, so the <strong>database (and the per-item detail endpoint) is treated as the source of truth</strong>, not the cached list. The lesson pages read the detail endpoint precisely so a freshly-seeded lesson shows immediately even while the list is still warm from cache. When you verify a change and the list "hasn't updated," suspect the 60-second cache before assuming the write failed.</p>
</div>

<div class="pitfall">
<p><strong>A CDN caches 404s too.</strong> A related, painful lesson from this very project: fetching a URL <em>before</em> the asset exists can make the CDN cache the 404 for that exact URL for hours — so it keeps returning "not found" even after you upload the file. The tell: the file is on disk / in storage, but the URL still 404s. Workarounds: verify with a cache-busting query (<code>?cb=timestamp</code>), and if a URL is already poisoned, change the URL (e.g. add <code>?v=2</code>) rather than waiting the cache out.</p>
</div>

<div class="callout ok">
<p><strong>Practical order while developing:</strong> start with data uncached so you always see the latest. Add caching only where you have measured a slow or heavily-hit source, and pair every cache with a revalidation strategy so "it went stale" never becomes a mystery.</p>
</div>

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
<p><strong>cuongthai.com xử lý danh sách cũ thế nào:</strong> vài endpoint danh sách công khai của site cache khoảng 60 giây cho nhanh. Hệ quả, rút ra từ thực tế: sau khi seed hay sửa nội dung, API <em>danh sách</em> có thể trễ tới một phút, nên <strong>database (và endpoint chi tiết từng mục) được coi là sự thật</strong>, không phải danh sách đã cache. Trang bài học đọc endpoint chi tiết chính vì thế — để một bài vừa seed hiện ngay cả khi danh sách còn ấm cache. Khi bạn kiểm một thay đổi mà danh sách "chưa cập nhật", hãy nghi cache 60 giây trước khi cho rằng ghi đã hỏng.</p>
</div>

<div class="pitfall">
<p><strong>CDN cache cả 404.</strong> Một bài học đau và liên quan từ chính dự án này: fetch một URL <em>trước khi</em> tài nguyên tồn tại có thể làm CDN cache cái 404 cho đúng URL đó hàng giờ — nên nó cứ trả "không tìm thấy" kể cả sau khi bạn upload file. Dấu hiệu: file đã ở trên đĩa / trong lưu trữ, nhưng URL vẫn 404. Cách lách: kiểm bằng một query phá cache (<code>?cb=timestamp</code>), và nếu một URL đã nhiễm, hãy đổi URL (ví dụ thêm <code>?v=2</code>) thay vì ngồi chờ cache hết hạn.</p>
</div>

<div class="callout ok">
<p><strong>Thứ tự thực dụng khi phát triển:</strong> bắt đầu để dữ liệu không cache để luôn thấy cái mới nhất. Chỉ thêm cache ở chỗ bạn đã đo được nguồn chậm hoặc bị gọi nhiều, và ghép mỗi cache với một chiến lược revalidate để "nó bị cũ" không bao giờ thành điều bí ẩn.</p>
</div>

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
