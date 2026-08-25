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

<h3>Fetching where the data lives</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>await straight in the component</b> — No effect, no loading state, no &#96;useState&#96;. The component is async and the framework waits for it.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It runs before the HTML is sent</b> — So the user never sees an empty shell that then fills in — the first paint already has the data.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Requests are deduplicated per render</b> — Two components asking for the same URL in one request produce one fetch. You can fetch where you need it instead of threading props.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Talk to the database directly</b> — There is no reason to call your own API route from a Server Component; that is a network hop to your own process.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a sequential chain of awaits that turns into a waterfall.</strong> &#96;const user = await getUser(); const posts = await getPosts(user.id); const stats = await getStats(user.id);&#96; takes the sum of all three, and the last two do not depend on each other at all. Locally each call takes 5ms and nobody notices; against a real database with 40ms of latency it is 120ms of pure waiting on every request. Only the second call genuinely needs the first — run the independent ones together with &#96;Promise.all&#96;. When a page feels slow and the queries are fast, this is almost always what is happening.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching" target="_blank" rel="noopener">
  <span class="lc-ico">📥</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Data fetching</span><span class="lc-sub">Fetching in Server Components, deduplication, and the parallel patterns.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#parallel-and-sequential-data-fetching" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Parallel vs sequential fetching</span><span class="lc-sub">The waterfall this trap is about, drawn as a timeline.</span></span>
</a>

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

<h3>Lấy dữ liệu ngay chỗ dữ liệu nằm</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>await thẳng trong component</b> — Không effect, không trạng thái đang tải, không &#96;useState&#96;. Component là async và framework chờ nó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó chạy trước khi HTML được gửi đi</b> — Nên người dùng chẳng bao giờ thấy một cái vỏ rỗng rồi mới điền vào — lần vẽ đầu tiên đã có sẵn dữ liệu.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Request được khử trùng lặp trong một lần render</b> — Hai component cùng hỏi một URL trong một request chỉ sinh ra một lượt fetch. Bạn lấy dữ liệu ngay chỗ cần thay vì luồn props.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nói chuyện thẳng với cơ sở dữ liệu</b> — Chẳng có lý do gì để gọi route API của chính mình từ một Server Component; đó là một chặng mạng đi vòng về chính tiến trình của bạn.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một chuỗi await tuần tự biến thành thác nước.</strong> &#96;const user = await getUser(); const posts = await getPosts(user.id); const stats = await getStats(user.id);&#96; tốn bằng tổng cả ba, mà hai cái sau chẳng hề phụ thuộc nhau. Ở máy bạn mỗi lời gọi mất 5ms và chẳng ai để ý; với một cơ sở dữ liệu thật có 40ms độ trễ thì đó là 120ms chờ thuần tuý ở mỗi request. Chỉ lời gọi thứ hai thật sự cần lời gọi thứ nhất — hãy chạy những cái độc lập cùng lúc bằng &#96;Promise.all&#96;. Khi một trang có cảm giác chậm mà các truy vấn đều nhanh thì gần như luôn là chuyện này.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching" target="_blank" rel="noopener">
  <span class="lc-ico">📥</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Lấy dữ liệu</span><span class="lc-sub">Lấy dữ liệu trong Server Component, khử trùng lặp, và các mẫu song song.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#parallel-and-sequential-data-fetching" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Lấy song song với tuần tự</span><span class="lc-sub">Cái thác nước mà bẫy này nói tới, vẽ ra thành dòng thời gian.</span></span>
</a>

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

<h3>The caches, from closest to furthest</h3>
<div class="lz-map">
  <div class="lz-stage">Four layers, each with its own key and lifetime</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Request memoisation</div><div class="lz-nsub">Within one render pass. Two identical fetches become one. Automatic, and you cannot turn it off.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">The Data Cache</div><div class="lz-nsub">Across requests and deploys, on the server. Controlled by &#96;cache&#96; and &#96;next.revalidate&#96; on each fetch.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">The Full Route Cache</div><div class="lz-nsub">The rendered HTML for a static route, produced at build time and served until revalidated.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The Router Cache</div><div class="lz-nsub">In the browser, per session. Holds recently visited routes so the back button is instant — and is why a page can look stale after a mutation.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — data that is correct on the server and stale in the browser after a write.</strong> You update a record, &#96;revalidatePath&#96; clears the server caches, and the list still shows the old row — because the client-side Router Cache is a separate layer holding the previously rendered payload for that route. The server is right and the screen is wrong, so people go looking at the database. In a Server Action, the same &#96;revalidatePath&#96; call also invalidates the router cache, which is why mutations belong there rather than in a bare &#96;fetch&#96;. From a Client Component, &#96;router.refresh()&#96; is the equivalent.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching" target="_blank" rel="noopener">
  <span class="lc-ico">🗃️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Caching in Next.js</span><span class="lc-sub">All four caches, with a table of what invalidates each one.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/revalidatePath" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — revalidatePath</span><span class="lc-sub">What it clears, what it does not, and where it can legally be called.</span></span>
</a>

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

<h3>Các lớp nhớ đệm, từ gần tới xa</h3>
<div class="lz-map">
  <div class="lz-stage">Bốn lớp, mỗi lớp một khoá và một tuổi thọ riêng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Ghi nhớ theo request</div><div class="lz-nsub">Trong phạm vi một lượt render. Hai phép fetch giống hệt nhau thành một. Tự động, và bạn không tắt được.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Data Cache</div><div class="lz-nsub">Xuyên qua các request và các lần deploy, ở phía máy chủ. Điều khiển bằng &#96;cache&#96; và &#96;next.revalidate&#96; trên từng phép fetch.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Full Route Cache</div><div class="lz-nsub">Phần HTML đã vẽ của một route tĩnh, tạo ra lúc build và phục vụ cho tới khi được làm mới.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Router Cache</div><div class="lz-nsub">Trong trình duyệt, theo từng phiên. Giữ những route vừa ghé để nút quay lại tức thì — và đó là lý do một trang có thể trông cũ sau khi ghi.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — dữ liệu đúng ở máy chủ mà cũ trong trình duyệt sau một lần ghi.</strong> Bạn cập nhật một bản ghi, &#96;revalidatePath&#96; xoá các lớp đệm phía máy chủ, mà danh sách vẫn hiện dòng cũ — vì Router Cache phía client là một lớp riêng đang giữ dữ liệu đã vẽ trước đó của route ấy. Máy chủ thì đúng còn màn hình thì sai, nên người ta đi soi cơ sở dữ liệu. Trong một Server Action, chính lời gọi &#96;revalidatePath&#96; ấy cũng vô hiệu hoá luôn router cache, và đó là lý do các phép ghi thuộc về đó chứ không thuộc về một &#96;fetch&#96; trần. Từ một Client Component thì &#96;router.refresh()&#96; là thứ tương đương.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching" target="_blank" rel="noopener">
  <span class="lc-ico">🗃️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Nhớ đệm trong Next.js</span><span class="lc-sub">Cả bốn lớp đệm, kèm bảng cái gì vô hiệu hoá cái nào.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/revalidatePath" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — revalidatePath</span><span class="lc-sub">Nó xoá cái gì, không xoá cái gì, và được phép gọi ở đâu.</span></span>
</a>

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

<h3>Choosing how fresh the data has to be</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Static, cached forever</b> — The default for a fetch with no options. Right for content that only changes when you deploy.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Time-based: next: { revalidate: 60 }</b> — Serve the cached copy, and rebuild in the background after 60 seconds. The first visitor after expiry still gets the old page — no one waits.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>On-demand: revalidatePath / revalidateTag</b> — Clear it exactly when the data changed, from a Server Action or a webhook. Fresh immediately, cached the rest of the time.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Never cached: cache: 'no-store'</b> — Every request hits the source. Correct for a dashboard of live numbers, wasteful for anything else.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — &#96;export const dynamic = &#39;force-dynamic&#39;&#96; added to fix one stale value.</strong> It works instantly and opts the entire route out of every cache, forever: every visit re-renders on the server, re-runs every query, and the page loses its static generation. On a marketing page that gets a thousand visits an hour, that is a thousand database round trips to keep one number fresh. Reach for the narrowest tool that fixes the actual problem — &#96;revalidate&#96; on the one fetch that is stale, or &#96;revalidateTag&#96; called from the code that changes it. Check the build output afterwards: routes marked &#96;ƒ&#96; are dynamic, &#96;○&#96; are static.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#revalidating" target="_blank" rel="noopener">
  <span class="lc-ico">⏲️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Revalidating</span><span class="lc-sub">Time-based and on-demand revalidation, with the exact semantics of each.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Route segment config</span><span class="lc-sub">Every export that changes a route's rendering mode, and what each one costs.</span></span>
</a>

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

<h3>Chọn dữ liệu phải tươi tới mức nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Tĩnh, nhớ đệm mãi mãi</b> — Mặc định cho một phép fetch không tuỳ chọn. Đúng cho nội dung chỉ đổi khi bạn deploy.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Theo thời gian: next: { revalidate: 60 }</b> — Phục vụ bản trong đệm, rồi dựng lại ở phía sau sau 60 giây. Người ghé đầu tiên sau khi hết hạn vẫn nhận trang cũ — chẳng ai phải chờ.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Theo yêu cầu: revalidatePath / revalidateTag</b> — Xoá đúng lúc dữ liệu đã đổi, từ một Server Action hoặc một webhook. Tươi ngay lập tức, còn lại thì vẫn nhớ đệm.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Không bao giờ đệm: cache: 'no-store'</b> — Mọi request đều chạm tới nguồn. Đúng cho một bảng điều khiển số liệu trực tiếp, lãng phí với mọi thứ khác.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — thêm &#96;export const dynamic = &#39;force-dynamic&#39;&#96; để chữa một giá trị bị cũ.</strong> Nó hiệu nghiệm tức thì và loại cả route ra khỏi mọi lớp đệm, vĩnh viễn: mỗi lượt ghé đều render lại trên máy chủ, chạy lại mọi truy vấn, và trang mất luôn phần sinh tĩnh. Trên một trang giới thiệu có một nghìn lượt ghé mỗi giờ thì đó là một nghìn lượt đi về cơ sở dữ liệu chỉ để giữ một con số tươi. Hãy với tay tới công cụ hẹp nhất chữa được đúng vấn đề — &#96;revalidate&#96; trên đúng phép fetch bị cũ, hoặc &#96;revalidateTag&#96; gọi từ chính đoạn mã làm nó đổi. Rồi kiểm phần đầu ra của build: route đánh dấu &#96;ƒ&#96; là động, &#96;○&#96; là tĩnh.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#revalidating" target="_blank" rel="noopener">
  <span class="lc-ico">⏲️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Làm mới (revalidate)</span><span class="lc-sub">Làm mới theo thời gian và theo yêu cầu, kèm ngữ nghĩa chính xác của từng cái.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Cấu hình đoạn route</span><span class="lc-sub">Mọi export làm đổi chế độ render của một route, và mỗi cái tốn gì.</span></span>
</a>

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

<h3>Streaming a page in pieces</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>The shell goes out first</b> — Header, nav, layout — everything that does not wait on data. The user sees structure in milliseconds.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Slow parts stream in later</b> — Wrap them in &#96;&lt;Suspense fallback={…}&gt;&#96;. Next sends the fallback in the initial HTML, then the real content when it resolves.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>loading.tsx is a Suspense boundary</b> — For the whole segment. Fine for a page with one slow query, too coarse when one widget is slow and the rest is instant.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Each boundary is independent</b> — Three widgets, three boundaries, three arrival times. Nothing waits for the slowest.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — one Suspense boundary around the whole page, so the fastest content waits for the slowest.</strong> Putting the entire content in a single &#96;loading.tsx&#96; means the page shows a skeleton until <em>every</em> query has finished — the 20ms user header waits for the 900ms analytics chart. It looks like a slow app, and the fix is not a faster query but a smaller boundary: wrap only the chart, and let the header render immediately. The measurement that matters here is time to first contentful paint, not total load time; splitting boundaries improves the first without changing the second.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Loading UI and streaming</span><span class="lc-sub">How streaming works, and where to place boundaries.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/Suspense" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Suspense</span><span class="lc-sub">The component itself, and what triggers a fallback.</span></span>
</a>

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

<h3>Truyền một trang theo từng mảnh</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Cái vỏ đi ra trước</b> — Đầu trang, thanh điều hướng, layout — mọi thứ không phải chờ dữ liệu. Người dùng thấy được cấu trúc trong vài mili giây.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Phần chậm chảy về sau</b> — Hãy bọc chúng trong &#96;&lt;Suspense fallback={…}&gt;&#96;. Next gửi phần dự phòng trong HTML ban đầu, rồi gửi nội dung thật khi nó xong.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>loading.tsx là một ranh giới Suspense</b> — Cho cả đoạn. Ổn với một trang có một truy vấn chậm, quá thô khi chỉ một widget chậm còn phần còn lại tức thì.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Mỗi ranh giới độc lập với nhau</b> — Ba widget, ba ranh giới, ba thời điểm về. Chẳng cái nào phải chờ cái chậm nhất.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một ranh giới Suspense bọc cả trang, khiến nội dung nhanh nhất phải chờ nội dung chậm nhất.</strong> Đặt toàn bộ nội dung vào một &#96;loading.tsx&#96; duy nhất nghĩa là trang hiện khung xương cho tới khi <em>mọi</em> truy vấn xong — cái đầu trang 20ms phải chờ cái biểu đồ phân tích 900ms. Nó trông như một ứng dụng chậm, và cách chữa không phải một truy vấn nhanh hơn mà là một ranh giới nhỏ hơn: chỉ bọc cái biểu đồ, và để đầu trang vẽ ra ngay. Phép đo có ý nghĩa ở đây là thời gian tới lần vẽ nội dung đầu tiên, không phải tổng thời gian tải; chia nhỏ ranh giới cải thiện cái thứ nhất mà không đổi cái thứ hai.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Giao diện tải và streaming</span><span class="lc-sub">Streaming hoạt động ra sao, và đặt ranh giới ở đâu.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/Suspense" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Suspense</span><span class="lc-sub">Bản thân component đó, và cái gì kích hoạt phần dự phòng.</span></span>
</a>

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

<h3>Choosing a staleness budget per screen</h3>
<div class="lz-map">
  <div class="lz-stage">The question is how wrong the data may be, and for how long</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">A blog post</div><div class="lz-nsub">Stale for hours is fine. Static, revalidated on publish. The fastest option, and the cheapest.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">A product listing</div><div class="lz-nsub">Stale for a minute is fine. &#96;revalidate: 60&#96; — visitors get a cached page and the price is never more than a minute old.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">A user&#39;s own dashboard</div><div class="lz-nsub">Must be current for that user. Dynamic, or cached per user with on-demand revalidation after their own writes.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">A live count</div><div class="lz-nsub">No caching at all, and reconsider whether it needs to be on the server — a client-side poll or a socket may be the honest answer.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — caching a page that renders per-user data, and serving one user's page to another.</strong> A route that reads a cookie or a session and is also statically cached will serve the first visitor&#39;s HTML to everyone else. Next.js guards against this — reading &#96;cookies()&#96; or &#96;headers()&#96; opts the route into dynamic rendering automatically — but the guard disappears the moment the personal data arrives some other way: a &#96;fetch&#96; with an auth header built from a module-level variable, or a cache the app manages itself. The test is worth running deliberately: log in as two different users in two browsers and compare the page. It is the kind of bug nobody finds by reading code.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Dynamic rendering</span><span class="lc-sub">Which APIs opt a route out of static rendering, and why.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#opting-out-2" target="_blank" rel="noopener">
  <span class="lc-ico">🚪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Opting out of caching</span><span class="lc-sub">Every escape hatch, with the scope each one applies to.</span></span>
</a>

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

<h3>Chọn ngân sách độ cũ cho từng màn hình</h3>
<div class="lz-map">
  <div class="lz-stage">Câu hỏi là dữ liệu được phép sai tới đâu, và trong bao lâu</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Một bài blog</div><div class="lz-nsub">Cũ vài tiếng cũng không sao. Tĩnh, làm mới lúc xuất bản. Lựa chọn nhanh nhất, và rẻ nhất.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Một danh sách sản phẩm</div><div class="lz-nsub">Cũ một phút cũng không sao. &#96;revalidate: 60&#96; — khách nhận trang trong đệm và giá chẳng bao giờ cũ quá một phút.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Bảng điều khiển của chính người dùng</div><div class="lz-nsub">Phải đúng thời điểm với người dùng đó. Động, hoặc nhớ đệm theo từng người kèm làm mới theo yêu cầu sau mỗi lần họ ghi.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Một con số đếm trực tiếp</div><div class="lz-nsub">Không nhớ đệm gì cả, và hãy cân nhắc lại xem nó có cần nằm trên máy chủ không — một phép hỏi định kỳ phía client hoặc một socket có khi mới là câu trả lời thành thật.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — nhớ đệm một trang vẽ dữ liệu riêng của từng người, rồi phục vụ trang của người này cho người khác.</strong> Một route đọc cookie hay một phiên đăng nhập mà lại được nhớ đệm tĩnh sẽ phục vụ HTML của người ghé đầu tiên cho tất cả những người còn lại. Next.js có chốt chặn chuyện này — đọc &#96;cookies()&#96; hay &#96;headers()&#96; sẽ tự động đưa route sang chế độ render động — nhưng cái chốt biến mất ngay khi dữ liệu cá nhân đi vào bằng đường khác: một &#96;fetch&#96; mang header xác thực dựng từ một biến ở cấp module, hoặc một bộ nhớ đệm do chính ứng dụng tự quản. Phép thử này đáng chạy một cách có chủ đích: đăng nhập bằng hai người dùng khác nhau trên hai trình duyệt rồi so trang. Đây là loại lỗi chẳng ai tìm ra bằng cách đọc mã.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Render động</span><span class="lc-sub">Những API nào đưa một route ra khỏi chế độ sinh tĩnh, và vì sao.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/caching#opting-out-2" target="_blank" rel="noopener">
  <span class="lc-ico">🚪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Không dùng nhớ đệm</span><span class="lc-sub">Mọi cửa thoát, kèm phạm vi mà từng cái áp dụng.</span></span>
</a>

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
