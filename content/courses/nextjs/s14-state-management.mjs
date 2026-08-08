/**
 * Next.js & React — Chương 14: Quản lý state — client (Zustand) & server (TanStack Query).
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Thuần kiến trúc state — không có output console để chạy. Sự cố/thực hành THẬT
 * cuongthai.com: context cho auth/theme, Zustand cho state tính năng đổi nhanh
 * (store persist 'auth-storage'); cảnh báo hydration store persist (Ch9). Nối
 * [[feedback_authstore_ishydrated_unreliable]].
 */

export default {
  title: 'Chapter 14 — State management: client and server state|||Chương 14 — Quản lý state: state client và state server',
  description: 'Có hai loại state khác hẳn nhau: state UI phía client và state là bản sao dữ liệu server. Dùng sai công cụ là nguồn của vô số bug. Zustand cho client, TanStack Query cho server, Context cho state toàn app đổi chậm, và khi nào chỉ cần Server Component.',
  lessons: [
    /* ─────────────────────────── 14.1 ─────────────────────────── */
    {
      title: '14.1 — Two kinds of state (and the mistake of mixing them)|||14.1 — Hai loại state (và cái sai khi trộn lẫn)',
      slug: 'nextjs-14-1-hai-loai-state',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Zustand Beginner Tutorial - Learn React State Management With Zustand" — PedroTech (oEmbed verified).
      video: { url: 'https://youtu.be/-Y8brhQKvtA', durationSeconds: 0 },
      description: 'Trước khi chọn thư viện, phải phân biệt: state UI (bộ lọc đang chọn, modal mở) sống ở client; còn danh sách bài, hồ sơ người dùng chỉ là BẢN SAO của dữ liệu trên server. Trộn hai cái là gốc của nhiều bug.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Not all "state" is the same thing</h2>
<p class="lead">By now you have <code>useState</code> (Chapter 3) and Context (Chapter 6). They are enough for a small app, but at scale the important move is not reaching for a bigger library — it is realising there are <strong>two fundamentally different kinds of state</strong>, and they want different tools.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Client (UI) state</span><span class="v">Owned entirely by the browser: which tab is open, a modal's visibility, a form draft, the theme, a selected filter. It has no meaning on the server.</span></div>
  <div class="kv"><span class="k">Server state</span><span class="v">Data that lives on the server and you only hold a <em>copy</em> of: the list of posts, the current user, a product. The real value is remote; your copy can go stale.</span></div>
</div>

<h3>The classic mistake: server data in useState</h3>
<pre><code>'use client';
const [posts, setPosts] = useState([]);
useEffect(() =&gt; { fetch('/api/posts').then(r =&gt; r.json()).then(setPosts); }, []);</code></pre>
<p>This treats a copy of server data as if it were local UI state. You now hand-manage loading, errors, caching, refetching, deduping, and staleness — and you rebuild that in every component that needs the data. It works for one screen and collapses across a real app. Server state deserves a tool that understands it <em>is</em> a cache of something remote.</p>

<h3>The toolbox for this chapter</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Server Components</b> (Chapter 10) — the default for a page's initial data. Often you need nothing else.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>TanStack Query</b> — client-side server state: interaction-driven fetching, caching, refetch, mutations.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Zustand</b> — global client UI state, shared across components without prop-drilling.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Context</b> — app-wide, slow-changing client values (auth, theme). <b>URL</b> — sharable state (filters, page).</div></div>
</div>
<p>The skill is matching the kind of state to the right tool. Get that right and most "state management is hard" pain disappears.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">TanStack Query — Server vs client state</span><span class="lc-sub">Why server state is different, in the words of the library that specialises in it.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Không phải "state" nào cũng là một thứ</h2>
<p class="lead">Tới giờ bạn có <code>useState</code> (Chương 3) và Context (Chương 6). Chúng đủ cho app nhỏ, nhưng ở quy mô lớn, bước quan trọng không phải với tay lấy thư viện to hơn — mà là nhận ra có <strong>hai loại state khác nhau về bản chất</strong>, và chúng cần công cụ khác nhau.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">State client (UI)</span><span class="v">Do trình duyệt sở hữu hoàn toàn: tab nào đang mở, modal hiện hay ẩn, bản nháp form, theme, bộ lọc đang chọn. Nó vô nghĩa trên server.</span></div>
  <div class="kv"><span class="k">State server</span><span class="v">Dữ liệu sống trên server mà bạn chỉ giữ một <em>bản sao</em>: danh sách bài, người dùng hiện tại, một sản phẩm. Giá trị thật ở xa; bản sao của bạn có thể cũ.</span></div>
</div>

<h3>Cái sai kinh điển: dữ liệu server trong useState</h3>
<pre><code>'use client';
const [posts, setPosts] = useState([]);
useEffect(() =&gt; { fetch('/api/posts').then(r =&gt; r.json()).then(setPosts); }, []);</code></pre>
<p>Cách này coi một bản sao dữ liệu server như thể là state UI cục bộ. Giờ bạn tự tay quản loading, lỗi, cache, refetch, dedupe, và độ cũ — và dựng lại tất cả ở mọi component cần dữ liệu. Nó chạy được cho một màn và sụp đổ khắp một app thật. State server xứng đáng một công cụ hiểu rằng nó <em>là</em> cache của một thứ ở xa.</p>

<h3>Bộ công cụ của chương này</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Server Component</b> (Chương 10) — mặc định cho dữ liệu ban đầu của trang. Thường không cần gì thêm.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>TanStack Query</b> — state server phía client: fetch do tương tác, cache, refetch, mutation.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Zustand</b> — state UI client toàn cục, chia sẻ giữa các component mà không prop-drilling.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Context</b> — giá trị client toàn app, đổi chậm (auth, theme). <b>URL</b> — state chia sẻ được (bộ lọc, trang).</div></div>
</div>
<p>Kỹ năng là khớp loại state với đúng công cụ. Làm đúng điều đó thì phần lớn nỗi đau "quản lý state khó" biến mất.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">TanStack Query — State server vs client</span><span class="lc-sub">Vì sao state server khác biệt, theo lời của thư viện chuyên về nó.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.2 ─────────────────────────── */
    {
      title: '14.2 — Client global state with Zustand|||14.2 — State client toàn cục với Zustand',
      slug: 'nextjs-14-2-zustand',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Zustand là store toàn cục nhẹ: tạo một store bằng create(), đọc bằng hook có selector để chỉ render lại khi phần mình cần đổi. Khi nào dùng thay Context, và bẫy persist + hydration.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>A tiny global store without the boilerplate</h2>
<p class="lead">When client UI state must be shared across distant components — a cart, a sidebar's open/closed, a multi-step wizard — prop-drilling is painful and Context re-renders too broadly. Zustand gives you a small global store with almost no ceremony.</p>

<pre><code>import { create } from 'zustand';

const useCart = create((set) =&gt; ({
  items: [],
  add:    (item) =&gt; set((s) =&gt; ({ items: [...s.items, item] })),
  clear:  () =&gt; set({ items: [] }),
}));

<span class="tok-comment">// in any component — no provider needed</span>
const items = useCart((s) =&gt; s.items);   <span class="tok-comment">// selector: re-render only when items change</span>
const add   = useCart((s) =&gt; s.add);</code></pre>

<h3>Selectors are the performance trick</h3>
<p>You subscribe to a <em>slice</em> via a selector, and the component re-renders only when that slice changes. A component reading <code>s.items</code> is untouched when some unrelated part of the store updates. This is the key difference from Context, where every consumer re-renders whenever the context value changes — the reason large, fast-changing state does not belong in Context.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Zustand vs Context</span><span class="v">Context: app-wide, slow-changing, read in many places (auth, theme). Zustand: shared UI state that changes often, where selective re-rendering matters.</span></div>
  <div class="kv"><span class="k">No provider</span><span class="v">The store is a hook you import anywhere. No wrapping the tree in a provider (though you sometimes do for per-request stores in SSR).</span></div>
</div>

<div class="note-ct">
<p><strong>This is exactly how cuongthai.com splits it.</strong> The site uses Context for the app-wide, low-frequency values — the auth/user context and the theme provider — and Zustand stores for feature state that changes often, precisely to avoid re-rendering half the tree on every update. It also <em>persists</em> some stores (e.g. an <code>auth-storage</code> store) to <code>localStorage</code> so a session survives reload.</p>
</div>

<div class="pitfall">
<p><strong>Persisted stores hydrate asynchronously — do not gate your whole UI on a single "hydrated" flag.</strong> A persisted Zustand store loads from <code>localStorage</code> after mount, and its hydration flag can, in some conditions, never flip true — a real cuongthai.com bug where a page sat forever on "Đang tải…". If you must know whether persisted state is ready, track a local <code>mounted</code> state and read the stored value directly as a fallback, rather than trusting one boolean to reveal the app. (Same lesson as the hydration boundary in Chapter 9.)</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://zustand.docs.pmnd.rs/getting-started/introduction" target="_blank" rel="noopener">
  <span class="lc-ico">🐻</span>
  <span class="lc-body"><span class="lc-title">Zustand — Introduction</span><span class="lc-sub">create(), selectors, middleware (persist), and SSR notes.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Một store toàn cục bé xíu, không rườm rà</h2>
<p class="lead">Khi state UI client phải chia sẻ giữa các component xa nhau — một giỏ hàng, đóng/mở sidebar, một wizard nhiều bước — prop-drilling thì mệt còn Context render lại quá rộng. Zustand cho bạn một store toàn cục nhỏ gần như không nghi thức.</p>

<pre><code>import { create } from 'zustand';

const useCart = create((set) =&gt; ({
  items: [],
  add:    (item) =&gt; set((s) =&gt; ({ items: [...s.items, item] })),
  clear:  () =&gt; set({ items: [] }),
}));

<span class="tok-comment">// trong component bất kỳ — không cần provider</span>
const items = useCart((s) =&gt; s.items);   <span class="tok-comment">// selector: chỉ render lại khi items đổi</span>
const add   = useCart((s) =&gt; s.add);</code></pre>

<h3>Selector là mẹo hiệu năng</h3>
<p>Bạn subscribe một <em>lát</em> qua một selector, và component chỉ render lại khi lát đó đổi. Một component đọc <code>s.items</code> không bị đụng khi một phần không liên quan của store cập nhật. Đây là khác biệt then chốt với Context, nơi mọi consumer render lại mỗi khi giá trị context đổi — lý do state lớn, đổi nhanh không thuộc về Context.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Zustand vs Context</span><span class="v">Context: toàn app, đổi chậm, đọc ở nhiều nơi (auth, theme). Zustand: state UI dùng chung đổi thường xuyên, nơi render lại chọn lọc là quan trọng.</span></div>
  <div class="kv"><span class="k">Không provider</span><span class="v">Store là một hook bạn import ở đâu cũng được. Không phải bọc cây trong một provider (dù đôi khi có, cho store theo-request trong SSR).</span></div>
</div>

<div class="note-ct">
<p><strong>Đây đúng cách cuongthai.com chia.</strong> Site dùng Context cho các giá trị toàn app, tần suất thấp — context auth/người dùng và provider theme — và các store Zustand cho state tính năng đổi thường xuyên, chính xác để tránh render lại nửa cây ở mỗi cập nhật. Nó cũng <em>persist</em> vài store (ví dụ store <code>auth-storage</code>) vào <code>localStorage</code> để một phiên sống qua reload.</p>
</div>

<div class="pitfall">
<p><strong>Store persist hydrate bất đồng bộ — đừng chặn cả UI sau một cờ "hydrated" duy nhất.</strong> Một store Zustand persist tải từ <code>localStorage</code> sau khi mount, và cờ hydration của nó, trong vài điều kiện, có thể không bao giờ lật true — một bug thật của cuongthai.com khiến một trang ngồi mãi ở "Đang tải…". Nếu bạn phải biết state persist đã sẵn sàng chưa, hãy theo dõi một state <code>mounted</code> cục bộ và đọc thẳng giá trị đã lưu làm dự phòng, thay vì tin một boolean để hiện app. (Cùng bài học với ranh giới hydration ở Chương 9.)</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://zustand.docs.pmnd.rs/getting-started/introduction" target="_blank" rel="noopener">
  <span class="lc-ico">🐻</span>
  <span class="lc-body"><span class="lc-title">Zustand — Giới thiệu</span><span class="lc-sub">create(), selector, middleware (persist), và ghi chú SSR.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.3 ─────────────────────────── */
    {
      title: '14.3 — Server state on the client with TanStack Query|||14.3 — State server phía client với TanStack Query',
      slug: 'nextjs-14-3-tanstack-query',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Khi dữ liệu server phải fetch Ở CLIENT (theo tương tác, cuộn vô hạn, cập nhật nền), useQuery lo cache, dedupe, loading/error, refetch khi focus. Nó thay cho đống useEffect+useState thủ công.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>The right tool for client-side server data</h2>
<p class="lead">A page's initial data belongs in a Server Component (Chapter 10). But some server data must be fetched <em>on the client</em>: results that depend on user interaction, infinite scroll, polling, anything after the first paint. That is TanStack Query's job — it turns the manual <code>useEffect</code>+<code>useState</code> dance into one hook.</p>

<pre><code>'use client';
import { useQuery } from '@tanstack/react-query';

function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () =&gt; fetch('/api/posts').then(r =&gt; r.json()),
  });
  if (isLoading) return &lt;Spinner /&gt;;
  if (error) return &lt;p&gt;Failed to load&lt;/p&gt;;
  return &lt;List items={data} /&gt;;
}</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">queryKey</span><span class="v">A unique key for this data. It powers caching, deduping, and invalidation. Include variables in it: <code>['post', id]</code>.</span></div>
  <div class="kv"><span class="k">What you get free</span><span class="v">Caching, request deduping, loading/error states, background refetch on window focus, retries, pagination and infinite-query helpers.</span></div>
  <div class="kv"><span class="k">Setup</span><span class="v">Wrap the app once in a <code>QueryClientProvider</code>. After that, <code>useQuery</code> anywhere.</span></div>
</div>

<h3>It does not replace Server Components</h3>
<p>In the App Router the two coexist: fetch the initial, SEO-relevant data in Server Components; use TanStack Query for the interactive, client-driven parts on top. A common pattern is to server-render the first page of a list, then let TanStack Query handle "load more" and live updates. Do not move all fetching to the client just because you like the hook — you would give back the Server Component benefits from Chapter 9.</p>

<div class="callout ok">
<p><strong>The race you fought by hand in Chapter 5 is gone.</strong> The out-of-order fetch bug, the manual cleanup, the "is this still the current request" flag — TanStack Query handles all of it through the query key and its internal cache. That is the payoff of using a tool built for server state.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://tanstack.com/query/latest/docs/framework/react/quick-start" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">TanStack Query — Quick Start</span><span class="lc-sub">useQuery, query keys, the QueryClientProvider, and defaults.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Đúng công cụ cho dữ liệu server phía client</h2>
<p class="lead">Dữ liệu ban đầu của trang thuộc về Server Component (Chương 10). Nhưng vài dữ liệu server phải fetch <em>ở client</em>: kết quả phụ thuộc tương tác, cuộn vô hạn, polling, bất cứ gì sau lần paint đầu. Đó là việc của TanStack Query — nó biến điệu nhảy <code>useEffect</code>+<code>useState</code> thủ công thành một hook.</p>

<pre><code>'use client';
import { useQuery } from '@tanstack/react-query';

function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () =&gt; fetch('/api/posts').then(r =&gt; r.json()),
  });
  if (isLoading) return &lt;Spinner /&gt;;
  if (error) return &lt;p&gt;Tải thất bại&lt;/p&gt;;
  return &lt;List items={data} /&gt;;
}</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">queryKey</span><span class="v">Một khoá duy nhất cho dữ liệu này. Nó vận hành cache, dedupe, và vô hiệu hoá. Đưa biến vào nó: <code>['post', id]</code>.</span></div>
  <div class="kv"><span class="k">Được gì miễn phí</span><span class="v">Cache, dedupe request, trạng thái loading/error, refetch nền khi focus cửa sổ, retry, và trợ giúp phân trang/infinite-query.</span></div>
  <div class="kv"><span class="k">Cài đặt</span><span class="v">Bọc app một lần trong một <code>QueryClientProvider</code>. Sau đó, <code>useQuery</code> ở đâu cũng được.</span></div>
</div>

<h3>Nó KHÔNG thay Server Component</h3>
<p>Trong App Router hai cái cùng tồn tại: fetch dữ liệu ban đầu, quan trọng cho SEO trong Server Component; dùng TanStack Query cho phần tương tác, do client điều khiển ở trên. Một mẫu phổ biến là server-render trang đầu của một danh sách, rồi để TanStack Query lo "tải thêm" và cập nhật trực tiếp. Đừng dời hết fetch sang client chỉ vì bạn thích cái hook — bạn sẽ trả lại lợi ích Server Component ở Chương 9.</p>

<div class="callout ok">
<p><strong>Cuộc đua bạn từng đánh bằng tay ở Chương 5 biến mất.</strong> Bug fetch sai thứ tự, cleanup thủ công, cờ "đây có còn là request hiện tại không" — TanStack Query lo hết qua query key và cache nội bộ. Đó là phần thưởng của việc dùng một công cụ dựng cho state server.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://tanstack.com/query/latest/docs/framework/react/quick-start" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">TanStack Query — Quick Start</span><span class="lc-sub">useQuery, query key, QueryClientProvider, và mặc định.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.4 ─────────────────────────── */
    {
      title: '14.4 — Mutations and cache invalidation|||14.4 — Mutation và vô hiệu hoá cache',
      slug: 'nextjs-14-4-mutations',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Đọc bằng useQuery, ghi bằng useMutation. Sau khi ghi thành công, vô hiệu hoá query liên quan (invalidateQueries) để nó tự fetch lại. Và optimistic update: cập nhật UI ngay, quay lui nếu lỗi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>Writing on the client: useMutation, then invalidate</h2>
<p class="lead"><code>useQuery</code> reads; <code>useMutation</code> writes. The important half is what happens after a successful write — you invalidate the queries whose data just changed, and TanStack Query refetches them so the UI reflects the new truth.</p>

<pre><code>'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useAddPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (post) =&gt; fetch('/api/posts', { method: 'POST', body: JSON.stringify(post) }),
    onSuccess: () =&gt; qc.invalidateQueries({ queryKey: ['posts'] }),  <span class="tok-comment">// refetch the list</span>
  });
}</code></pre>
<p>This mirrors the Server Action + <code>revalidatePath</code> cycle from Chapter 12 — write, then tell the cache to refresh — but for client-side query state. Same principle, different layer.</p>

<h3>Optimistic updates: instant feedback</h3>
<p>For snappy UIs, update the cache <em>before</em> the server confirms, and roll back if it fails:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">On mutate, immediately write the expected result into the query cache — the UI updates at once.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">If the server succeeds, invalidate to sync with the real value.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">If it fails, roll back to the snapshot you kept — the UI reverts cleanly.</div></div>
</div>
<p>A like button that bumps the count instantly, then quietly reconciles, is this pattern. TanStack Query gives you the hooks (<code>onMutate</code>, context snapshot, <code>onError</code>) to do it safely.</p>

<div class="callout warn">
<p><strong>Two write paths, one rule.</strong> Whether you mutate via a Server Action (Chapter 12) or <code>useMutation</code>, the write is only finished when the relevant cache is refreshed. Forgetting the invalidation is the number-one reason a UI shows stale data right after a successful write.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://tanstack.com/query/latest/docs/framework/react/guides/mutations" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">TanStack Query — Mutations</span><span class="lc-sub">useMutation, invalidateQueries, and optimistic updates.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Ghi ở client: useMutation, rồi vô hiệu hoá</h2>
<p class="lead"><code>useQuery</code> đọc; <code>useMutation</code> ghi. Nửa quan trọng là điều xảy ra sau một cú ghi thành công — bạn vô hiệu hoá các query có dữ liệu vừa đổi, và TanStack Query fetch lại chúng để UI phản ánh sự thật mới.</p>

<pre><code>'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useAddPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (post) =&gt; fetch('/api/posts', { method: 'POST', body: JSON.stringify(post) }),
    onSuccess: () =&gt; qc.invalidateQueries({ queryKey: ['posts'] }),  <span class="tok-comment">// fetch lại danh sách</span>
  });
}</code></pre>
<p>Cái này phản chiếu vòng Server Action + <code>revalidatePath</code> ở Chương 12 — ghi, rồi bảo cache làm mới — nhưng cho state query phía client. Cùng nguyên lý, khác lớp.</p>

<h3>Optimistic update: phản hồi tức thì</h3>
<p>Cho UI nhanh nhạy, cập nhật cache <em>trước</em> khi server xác nhận, và quay lui nếu thất bại:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Khi mutate, ghi ngay kết quả kỳ vọng vào cache query — UI cập nhật lập tức.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">Nếu server thành công, vô hiệu hoá để đồng bộ với giá trị thật.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Nếu thất bại, quay lui về ảnh chụp bạn giữ — UI hoàn nguyên gọn gàng.</div></div>
</div>
<p>Một nút like nhảy số tức thì rồi lặng lẽ đối chiếu chính là mẫu này. TanStack Query cho bạn các hook (<code>onMutate</code>, ảnh chụp context, <code>onError</code>) để làm nó an toàn.</p>

<div class="callout warn">
<p><strong>Hai đường ghi, một quy tắc.</strong> Dù bạn mutate qua Server Action (Chương 12) hay <code>useMutation</code>, cú ghi chỉ xong khi cache liên quan được làm mới. Quên vô hiệu hoá là lý do số một khiến UI hiện dữ liệu cũ ngay sau một cú ghi thành công.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://tanstack.com/query/latest/docs/framework/react/guides/mutations" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">TanStack Query — Mutations</span><span class="lc-sub">useMutation, invalidateQueries, và optimistic update.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.5 ─────────────────────────── */
    {
      title: '14.5 — Choosing the right tool for each piece of state|||14.5 — Chọn đúng công cụ cho từng mảnh state',
      slug: 'nextjs-14-5-chon-cong-cu',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Một bảng quyết định: dữ liệu trang ban đầu → Server Component; server data theo tương tác → TanStack Query; UI toàn cục đổi nhanh → Zustand; giá trị app đổi chậm → Context; state chia sẻ được qua link → URL.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.5</span>
<h2>A decision guide you can apply on every screen</h2>
<p class="lead">There is no single "state manager." The right answer depends on what the state <em>is</em>. Ask a couple of questions and the tool falls out.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Is it a page's initial, SEO-relevant data?</span><span class="v">→ <b>Server Component</b> with <code>await</code> (Chapter 10). Reach for nothing else first.</span></div>
  <div class="kv"><span class="k">Is it server data fetched on the client (interaction, infinite scroll, polling)?</span><span class="v">→ <b>TanStack Query</b>.</span></div>
  <div class="kv"><span class="k">Is it client UI state shared across components and changing often?</span><span class="v">→ <b>Zustand</b>.</span></div>
  <div class="kv"><span class="k">Is it app-wide and slow-changing (auth, theme, locale)?</span><span class="v">→ <b>Context</b>.</span></div>
  <div class="kv"><span class="k">Should it be shareable/bookmarkable (filters, tab, page number)?</span><span class="v">→ the <b>URL</b> (search params) — not a store.</span></div>
  <div class="kv"><span class="k">Is it local to one component?</span><span class="v">→ plain <b>useState</b>. Do not globalise what one component owns.</span></div>
</div>

<h3>Two rules that prevent most messes</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Never store server data in a client store as if it were UI state.</b> A copy of remote data is a cache — give it a cache tool (Server Component or TanStack Query), not Zustand/Context.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Keep state as local as it can be.</b> Lift it only when a real second consumer appears. Global-by-default is how apps become impossible to reason about.</div></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com in these terms:</strong> initial page content renders from Server Components; auth and theme are Context (app-wide, slow); fast-changing feature UI lives in Zustand stores (some persisted to survive reload); and shareable view state — which feed tab, which filter — belongs in the URL so a link reproduces the exact view. The same app uses four different tools, each matched to the kind of state it holds. That matching, not the choice of any one library, is the actual skill.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react.dev/learn/managing-state" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">react.dev — Managing State</span><span class="lc-sub">Structuring state, lifting it up, and keeping it minimal.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.5</span>
<h2>Một bảng quyết định áp được cho mọi màn</h2>
<p class="lead">Không có một "trình quản lý state" duy nhất. Câu trả lời đúng tuỳ state đó <em>là gì</em>. Hỏi vài câu là ra công cụ.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Là dữ liệu ban đầu, quan trọng SEO của trang?</span><span class="v">→ <b>Server Component</b> với <code>await</code> (Chương 10). Đừng với cái khác trước.</span></div>
  <div class="kv"><span class="k">Là dữ liệu server fetch ở client (tương tác, cuộn vô hạn, polling)?</span><span class="v">→ <b>TanStack Query</b>.</span></div>
  <div class="kv"><span class="k">Là state UI client dùng chung nhiều component và đổi thường xuyên?</span><span class="v">→ <b>Zustand</b>.</span></div>
  <div class="kv"><span class="k">Là toàn app và đổi chậm (auth, theme, ngôn ngữ)?</span><span class="v">→ <b>Context</b>.</span></div>
  <div class="kv"><span class="k">Nên chia sẻ/đánh dấu được (bộ lọc, tab, số trang)?</span><span class="v">→ <b>URL</b> (search params) — không phải một store.</span></div>
  <div class="kv"><span class="k">Cục bộ trong một component?</span><span class="v">→ <b>useState</b> thường. Đừng toàn-cục-hoá thứ một component sở hữu.</span></div>
</div>

<h3>Hai quy tắc ngăn phần lớn mớ hỗn độn</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Đừng bao giờ lưu dữ liệu server trong một store client như thể nó là state UI.</b> Bản sao dữ liệu ở xa là một cache — cho nó một công cụ cache (Server Component hoặc TanStack Query), không phải Zustand/Context.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Giữ state cục bộ hết mức có thể.</b> Chỉ nâng lên khi có một consumer thứ hai thật sự. Toàn-cục-theo-mặc-định là cách app trở nên bất khả lý giải.</div></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com theo các thuật ngữ này:</strong> nội dung trang ban đầu render từ Server Component; auth và theme là Context (toàn app, chậm); UI tính năng đổi nhanh nằm trong các store Zustand (vài cái persist để sống qua reload); và state hiển thị chia sẻ được — tab feed nào, bộ lọc nào — thuộc về URL để một link tái hiện đúng góc nhìn. Cùng một app dùng bốn công cụ khác nhau, mỗi cái khớp với loại state nó giữ. Chính sự khớp đó, không phải việc chọn một thư viện, mới là kỹ năng thật.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react.dev/learn/managing-state" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">react.dev — Managing State</span><span class="lc-sub">Cấu trúc state, nâng lên, và giữ tối thiểu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.6 QUIZ ─────────────────────────── */
    {
      title: '14.6 — Chapter 14 quiz|||14.6 — Kiểm tra chương 14',
      slug: 'nextjs-14-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về state: client vs server state, cái sai khi để server data trong useState, Zustand + selector, TanStack Query useQuery/useMutation/invalidate, optimistic update, và bảng chọn công cụ.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 14: client vs server state, why server data does not belong in useState, Zustand and selectors, TanStack Query (useQuery/useMutation/invalidate), optimistic updates, and choosing the right tool.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 14: state client vs server, vì sao server data không thuộc useState, Zustand và selector, TanStack Query (useQuery/useMutation/invalidate), optimistic update, và chọn đúng công cụ.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which is server state (a copy of remote data), not client UI state?|||Cái nào là state server (bản sao dữ liệu ở xa), không phải state UI client?',
            options: [
              'whether a modal is open|||modal có đang mở không',
              'the list of posts from the API|||danh sách bài từ API',
              'the currently selected tab|||tab đang chọn',
              'a form draft in progress|||một bản nháp form đang gõ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is holding server data in useState+useEffect a problem at scale?|||Vì sao giữ server data trong useState+useEffect là vấn đề ở quy mô lớn?',
            options: [
              'useState is deprecated|||useState đã lỗi thời',
              'you hand-manage loading, errors, caching, dedup, refetch and staleness in every component|||bạn tự quản loading, lỗi, cache, dedupe, refetch và độ cũ ở mọi component',
              'useEffect cannot fetch|||useEffect không fetch được',
              'it only works on the server|||nó chỉ chạy trên server',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: "In Zustand, why read state via a selector like useCart(s => s.items)?|||Trong Zustand, vì sao đọc state qua selector như useCart(s => s.items)?",
            options: [
              'it is required syntax|||đó là cú pháp bắt buộc',
              'the component re-renders only when that slice changes|||component chỉ render lại khi lát đó đổi',
              'it makes the store global|||nó làm store thành toàn cục',
              'selectors disable caching|||selector tắt cache',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When is Context a better fit than a Zustand store?|||Khi nào Context hợp hơn một store Zustand?',
            options: [
              'for large state that changes many times a second|||cho state lớn đổi nhiều lần mỗi giây',
              'for app-wide, slow-changing values read in many places (auth, theme)|||cho giá trị toàn app, đổi chậm, đọc ở nhiều nơi (auth, theme)',
              'never — Zustand is always better|||không bao giờ — Zustand luôn tốt hơn',
              'only on the server|||chỉ trên server',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the queryKey in TanStack Query for?|||queryKey trong TanStack Query để làm gì?',
            options: [
              'styling the query|||style cho query',
              'a unique key that powers caching, deduping and invalidation (include variables in it)|||một khoá duy nhất vận hành cache, dedupe và vô hiệu hoá (đưa biến vào nó)',
              'the API endpoint URL only|||chỉ là URL endpoint API',
              'nothing important|||không quan trọng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In the App Router, TanStack Query is best for…|||Trong App Router, TanStack Query hợp nhất cho…',
            options: [
              'a page\'s initial SEO data (use Server Components for that)|||dữ liệu SEO ban đầu của trang (dùng Server Component cho việc đó)',
              'client-side server data: interaction-driven fetching, infinite scroll, polling|||dữ liệu server phía client: fetch do tương tác, cuộn vô hạn, polling',
              'global UI state|||state UI toàn cục',
              'CSS theming|||theme CSS',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After a successful useMutation write, what makes the UI show fresh data?|||Sau một cú ghi useMutation thành công, điều gì làm UI hiện dữ liệu mới?',
            options: [
              'nothing is needed|||không cần gì',
              'invalidateQueries on the affected queryKey, so it refetches|||invalidateQueries trên queryKey bị ảnh hưởng, để nó fetch lại',
              'reloading the browser|||tải lại trình duyệt',
              'clearing localStorage|||xoá localStorage',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An optimistic update means…|||Optimistic update nghĩa là…',
            options: [
              'waiting for the server before showing anything|||đợi server rồi mới hiện gì',
              'updating the UI immediately with the expected result, rolling back on failure|||cập nhật UI ngay với kết quả kỳ vọng, quay lui nếu thất bại',
              'caching forever|||cache mãi mãi',
              'disabling error handling|||tắt xử lý lỗi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'State that should be shareable via a link (filters, tab, page) belongs in…|||State nên chia sẻ được qua link (bộ lọc, tab, trang) thuộc về…',
            options: [
              'a Zustand store|||một store Zustand',
              'the URL (search params)|||URL (search params)',
              'Context|||Context',
              'localStorage only|||chỉ localStorage',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The single most important state rule from this chapter is…|||Quy tắc state quan trọng nhất của chương này là…',
            options: [
              'always use a global store|||luôn dùng một store toàn cục',
              'match the tool to the kind of state; never store server data as if it were client UI state|||khớp công cụ với loại state; đừng lưu server data như thể là state UI client',
              'avoid useState entirely|||tránh useState hoàn toàn',
              'put everything in Context|||để mọi thứ trong Context',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
