/**
 * FER202 · Chapter 10 additions — Code Splitting Using Lazy Components &
 * Suspense (Slot 15, 22 slides) plus Exercise 23 (lazy loading). Grounded
 * slide-by-slide in Slot15_Code-Splitting-Using-Lazy-Components.pptx. Spliced
 * into Chapter 10 before its quiz; existing 10.1 lesson untouched.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const CODELAB = `/code-lab/react${REF}`;

const SLIDES = {
  title: '10.2 — Slide by slide: Code splitting with lazy & Suspense (Slot 15)|||10.2 — Học theo từng slide: Code splitting với lazy & Suspense (Slot 15)',
  slug: 'fer202-10-2-slot15-lazy-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 22 slide Slot 15: vì sao chia bundle, React.lazy() + dynamic import(), Suspense (children/fallback), mô phỏng độ trễ, spinner fallback, tránh quá nhiều lazy component, và lazy hoá theo trang/route.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 10 · Lesson 10.2 · Slot 15 deck (22 slides)</span>
<h2>Code splitting, slide by slide</h2>
<p class="lead">One giant JS bundle makes the first load slow. <strong>Code splitting</strong> breaks it into pieces loaded on demand with <code>React.lazy()</code> + <code>&lt;Suspense&gt;</code>, so users download only what the current screen needs. Exercise 23 follows.</p>`,
      `<span class="eyebrow">Chương 10 · Bài 10.2 · Bộ slide Slot 15 (22 slide)</span>
<h2>Code splitting, theo từng slide</h2>
<p class="lead">Một bundle JS khổng lồ làm lần tải đầu chậm. <strong>Code splitting</strong> chia nó thành các mảnh nạp theo nhu cầu bằng <code>React.lazy()</code> + <code>&lt;Suspense&gt;</code>, để người dùng chỉ tải thứ màn hình hiện tại cần. Exercise 23 nằm ngay sau.</p>`,
    ),
    walkHead('slot15', 1, 22),
    walk('slot15', [
      [1, 'Code Splitting Using Lazy Components and Suspense', `<p>Title slide.</p>`, `<p>Slide bìa.</p>`],
      [2, 'Objectives', `<p>The map: intro to code splitting, the <code>lazy()</code> API, the <code>Suspense</code> component, avoiding too many lazy components, and lazy pages/routes.</p>`, `<p>Bản đồ: giới thiệu code splitting, API <code>lazy()</code>, component <code>Suspense</code>, tránh quá nhiều lazy component, và lazy hoá trang/route.</p>`],
      [3, 'Introduction to code splitting', `<p>Big monolithic bundles hurt initial load time and UX. By default a build bundles all JS into one file; <strong>code splitting</strong> lets you load parts on demand, improving load-time UX with <code>lazy()</code> + <code>Suspense</code>.</p>`, `<p>Bundle nguyên khối lớn làm chậm tải đầu và hại UX. Mặc định build gộp mọi JS vào một file; <strong>code splitting</strong> cho phép nạp từng phần theo nhu cầu, cải thiện UX lúc tải bằng <code>lazy()</code> + <code>Suspense</code>.</p>`],
      [4, 'What is the lazy API?', `<p><strong>Lazy loading</strong> = load a component only when it is needed. Two pieces: (1) bundling components into separate files the browser can download independently, and (2) building lazy components that download nothing until first rendered.</p>`, `<p><strong>Lazy loading</strong> = chỉ nạp một component khi cần. Hai phần: (1) đóng gói component thành file riêng để trình duyệt tải độc lập, và (2) tạo lazy component không tải gì cho tới lần render đầu.</p>`],
      [5, 'How to use React.lazy', `<p>Step 1: <code>const MyComponent = React.lazy(() =&gt; import('./MyComponent'))</code>. <strong>Only default exports</strong> work with lazy — <code>const { X } = React.lazy(...)</code> does not. Step 2: wrap the lazy component in <code>&lt;Suspense fallback={…}&gt;</code>.</p>`, `<p>Bước 1: <code>const MyComponent = React.lazy(() =&gt; import('./MyComponent'))</code>. <strong>Chỉ default export</strong> mới dùng được với lazy — <code>const { X } = React.lazy(...)</code> không chạy. Bước 2: bọc lazy component trong <code>&lt;Suspense fallback={…}&gt;</code>.</p>`],
      [6, 'Simulating latency', `<p>To test the fallback, delay the import: <code>Promise.all([import('./X'), new Promise(r =&gt; setTimeout(r, 3000))]).then(([m]) =&gt; m)</code>. This forces a 3-second load so you can see the Suspense fallback while the bundle "downloads".</p>`, `<p>Để thử fallback, làm trễ import: <code>Promise.all([import('./X'), new Promise(r =&gt; setTimeout(r, 3000))]).then(([m]) =&gt; m)</code>. Nó ép tải 3 giây để bạn thấy fallback của Suspense trong khi bundle "đang tải".</p>`],
      [7, 'Dynamic imports and bundles', `<p><strong>Dynamic <code>import()</code></strong> loads a JS module at runtime (returns a promise), improving performance for features not needed upfront. A <strong>bundle</strong> is a collection of source files packed into one (or a few) files to load and run the app.</p>`, `<p><strong><code>import()</code> động</strong> nạp một module JS lúc chạy (trả về promise), cải thiện hiệu năng cho tính năng chưa cần ngay. Một <strong>bundle</strong> là tập file nguồn gói lại thành một (hoặc vài) file để nạp và chạy app.</p>`],
      [8, 'Dynamic imports — the manual way', `<p>Before <code>lazy()</code> you could import in a <code>useEffect</code> and store the module in state: <code>import('./X').then(m =&gt; setComp(() =&gt; m.default))</code>. It works but is verbose — <code>React.lazy</code> does this for you (next slide).</p>`, `<p>Trước khi có <code>lazy()</code> bạn có thể import trong <code>useEffect</code> và lưu module vào state: <code>import('./X').then(m =&gt; setComp(() =&gt; m.default))</code>. Chạy được nhưng dài dòng — <code>React.lazy</code> làm hộ bạn (slide sau).</p>`],
      [9, 'Making components lazy', `<p>Instead of handling the promise manually, <code>React.lazy(() =&gt; import('./X'))</code> takes a function returning an <code>import()</code> promise and gives you a normal component — just render it inside <code>&lt;Suspense&gt;</code>.</p>`, `<p>Thay vì tự xử lý promise, <code>React.lazy(() =&gt; import('./X'))</code> nhận một hàm trả về promise <code>import()</code> và cho bạn một component bình thường — chỉ cần render trong <code>&lt;Suspense&gt;</code>.</p>`],
      [10, 'Using the Suspense component', `<p><code>Suspense</code> lets a component "wait" for something before rendering — a lazy bundle, or data. Note: Suspense does <em>not</em> detect data fetched inside an Effect or event handler (it works with lazy and Suspense-enabled data libraries).</p>`, `<p><code>Suspense</code> cho một component "chờ" thứ gì đó trước khi render — một bundle lazy, hoặc dữ liệu. Lưu ý: Suspense <em>không</em> phát hiện dữ liệu fetch trong Effect hay event handler (nó chạy với lazy và các thư viện dữ liệu hỗ trợ Suspense).</p>`],
      [11, 'Props for Suspense', `<p>Two props: <strong>children</strong> (the real UI to render) and <strong>fallback</strong> (a lightweight placeholder — a spinner or text). Suspense shows the fallback while children suspend, then swaps to children when ready.</p>`, `<p>Hai prop: <strong>children</strong> (UI thật cần render) và <strong>fallback</strong> (placeholder nhẹ — spinner hoặc text). Suspense hiện fallback khi children đang chờ, rồi đổi sang children khi sẵn sàng.</p>`],
      [12, 'Display a fallback while loading', `<p>React shows the fallback until all code and data the children need has loaded: <code>&lt;Suspense fallback={&lt;Loading /&gt;}&gt;&lt;MyComponent /&gt;&lt;/Suspense&gt;</code>. A <code>&lt;Loading&gt;</code> component (e.g. "🌀 Loading…") is a reusable fallback.</p>`, `<p>React hiện fallback tới khi mọi code và dữ liệu children cần đã nạp: <code>&lt;Suspense fallback={&lt;Loading /&gt;}&gt;&lt;MyComponent /&gt;&lt;/Suspense&gt;</code>. Một component <code>&lt;Loading&gt;</code> (ví dụ "🌀 Loading…") là fallback tái dùng.</p>`],
      [13, 'Revealing content together', `<p>By default the whole tree inside one Suspense boundary is one unit: if any child suspends, all show the fallback, then all appear together when ready. Suspending components need not be direct children of the boundary.</p>`, `<p>Mặc định cả cây trong một Suspense boundary là một đơn vị: nếu bất kỳ con nào chờ, tất cả hiện fallback, rồi cùng xuất hiện khi sẵn sàng. Component đang chờ không nhất thiết là con trực tiếp của boundary.</p>`],
      [14, 'Working with spinner fallbacks', `<p>The fallback can be any React element — upgrade from plain text to a spinner. The <code>react-spinners</code> package provides ready components (e.g. <code>&lt;FadeLoader /&gt;</code>) to use as a fallback.</p>`, `<p>Fallback có thể là bất kỳ React element nào — nâng từ text thuần lên spinner. Gói <code>react-spinners</code> cung cấp component sẵn (ví dụ <code>&lt;FadeLoader /&gt;</code>) để làm fallback.</p>`],
      [15, 'Spinner fallbacks — cont’d', `<p>Full example: a lazy <code>MyFeature</code> (with simulated latency) rendered inside <code>&lt;Suspense fallback={&lt;FadeLoader color="lightblue" size={150} /&gt;}&gt;</code> — a polished loading state while the bundle arrives.</p>`, `<p>Ví dụ đầy đủ: một <code>MyFeature</code> lazy (giả lập độ trễ) render trong <code>&lt;Suspense fallback={&lt;FadeLoader color="lightblue" size={150} /&gt;}&gt;</code> — trạng thái tải đẹp trong khi bundle về.</p>`],
      [16, 'Avoiding too many lazy components', `<p>Too many lazy components = many simultaneous HTTP requests. Better: bundle components so one request loads what the current page needs. The mental model: <strong>associate "pages" with bundles</strong>, not every small component.</p>`, `<p>Quá nhiều lazy component = nhiều request HTTP cùng lúc. Tốt hơn: gộp component để một request nạp thứ trang hiện tại cần. Mô hình tư duy: <strong>gắn "trang" với bundle</strong>, không phải từng component nhỏ.</p>`],
      [17, 'Avoiding lazy — bundling by page', `<p>Example: lazy-load <code>First</code>/<code>Second</code> feature bundles (each pulling in its own <code>One</code>/<code>Two</code> children), switched by a <code>&lt;select&gt;</code>, all under one Suspense. One lazy boundary per page-sized chunk.</p>`, `<p>Ví dụ: lazy-load bundle tính năng <code>First</code>/<code>Second</code> (mỗi cái kéo theo con <code>One</code>/<code>Two</code> của nó), chuyển bằng một <code>&lt;select&gt;</code>, tất cả dưới một Suspense. Một biên lazy cho mỗi khối cỡ trang.</p>`],
      [18, 'Exploring lazy pages and routes', `<p>Combine with React Router: make each route's page component lazy so its bundle downloads only when that route is first visited. Wrap the <code>&lt;Outlet /&gt;</code> (or the routes) in <code>&lt;Suspense&gt;</code>.</p>`, `<p>Kết hợp React Router: cho component trang của mỗi route thành lazy để bundle của nó chỉ tải khi route đó được ghé lần đầu. Bọc <code>&lt;Outlet /&gt;</code> (hoặc các route) trong <code>&lt;Suspense&gt;</code>.</p>`],
      [19, 'Lazy pages — the Layout', `<p>The Layout renders a <code>&lt;nav&gt;</code> of <code>&lt;Link&gt;</code>s and a <code>&lt;Suspense&gt;</code> around <code>&lt;Outlet /&gt;</code>. Clicking "First" triggers the download of the First bundle the first time, with the fallback showing meanwhile.</p>`, `<p>Layout render một <code>&lt;nav&gt;</code> gồm các <code>&lt;Link&gt;</code> và một <code>&lt;Suspense&gt;</code> bao quanh <code>&lt;Outlet /&gt;</code>. Bấm "First" kích hoạt tải bundle First lần đầu, fallback hiện trong lúc đó.</p>`],
      [20, 'Lazy pages — the routes', `<p>The router wires lazy page components to routes: <code>&lt;Route path="/first" element={&lt;First /&gt;} /&gt;</code> where <code>First</code> is a <code>lazy()</code> import. Route-based splitting is the highest-value place to code-split.</p>`, `<p>Router nối các component trang lazy vào route: <code>&lt;Route path="/first" element={&lt;First /&gt;} /&gt;</code> với <code>First</code> là một import <code>lazy()</code>. Chia code theo route là nơi đáng chia nhất.</p>`],
      [21, 'Exercise 23: Code splitting with lazy components', `<p>Hand-off to <strong>Exercise 23</strong> — lazy-load a User and a Post feature that fetch from an API, with Suspense. Full brief in the next lesson.</p>`, `<p>Chuyển sang <strong>Exercise 23</strong> — lazy-load tính năng User và Post fetch từ API, với Suspense. Đề đầy đủ ở bài kế.</p>`],
      [22, 'Summary', `<p>Recap: split big bundles with <code>React.lazy(() =&gt; import('./X'))</code> (default exports only) + <code>&lt;Suspense fallback&gt;</code>; the fallback shows while a bundle loads; a whole boundary reveals together; do not over-split (bundle by page); and route-based lazy loading is the biggest win.</p>`, `<p>Tóm tắt: chia bundle lớn bằng <code>React.lazy(() =&gt; import('./X'))</code> (chỉ default export) + <code>&lt;Suspense fallback&gt;</code>; fallback hiện trong khi bundle tải; cả một boundary hiện cùng lúc; đừng chia quá nhỏ (gộp theo trang); và lazy theo route là lợi ích lớn nhất.</p>`],
    ]),
    books([
      ['reactdoc', '“lazy” and “&lt;Suspense&gt;” API reference on react.dev', '“lazy” và tham chiếu API “&lt;Suspense&gt;” trên react.dev'],
    ]),
  ].join('\n'),
};

const EX23 = {
  title: 'Exercise 23 — Lazy loading (User & Post features)|||Exercise 23 — Lazy loading (tính năng User & Post)',
  slug: 'fer202-10-ex23-lazy',
  type: 'EXERCISE',
  description: 'Lazy-load hai tính năng User và Post (mỗi cái fetch từ API), bọc trong Suspense với fallback — thấy bundle chỉ tải khi cần.',
  content: bi(
    `<span class="eyebrow">Chapter 10 · Exercise 23 · Slot 15 slide 21</span>
<h2>Lazy-load User &amp; Post features</h2>
<p class="lead"><b>Goal:</b> split two features into their own bundles that download only when shown, each fetching data, all behind a Suspense fallback.</p>
<pre><span class="hljs-comment">// App.js</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">React</span>, { <span class="hljs-title class_">Suspense</span>, lazy, useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>;

<span class="hljs-keyword">const</span> <span class="hljs-title class_">User</span> = <span class="hljs-title function_">lazy</span>(<span class="hljs-function">() =&gt;</span> <span class="hljs-keyword">import</span>(<span class="hljs-string">&#x27;./User&#x27;</span>));
<span class="hljs-keyword">const</span> <span class="hljs-title class_">Post</span> = <span class="hljs-title function_">lazy</span>(<span class="hljs-function">() =&gt;</span> <span class="hljs-keyword">import</span>(<span class="hljs-string">&#x27;./Post&#x27;</span>));

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">App</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [view, setView] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>);
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setView(&#x27;user&#x27;)}&gt;Users<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setView(&#x27;post&#x27;)}&gt;Posts<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Suspense</span> <span class="hljs-attr">fallback</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">p</span>&gt;</span>🌀 Loading…<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>}&gt;
        {view === &#x27;user&#x27; &amp;&amp; <span class="hljs-tag">&lt;<span class="hljs-name">User</span> /&gt;</span>}
        {view === &#x27;post&#x27; &amp;&amp; <span class="hljs-tag">&lt;<span class="hljs-name">Post</span> /&gt;</span>}
      <span class="hljs-tag">&lt;/<span class="hljs-name">Suspense</span>&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  );
}
<span class="hljs-comment">// User.js / Post.js — default export, fetch inside useEffect</span></pre>
<div class="out"><b>Result:</b> open the Network tab — the User bundle only downloads the first time you click "Users"; the Post bundle only when you click "Posts". The fallback shows during each first load.</div>
<div class="pitfall"><b>Trap:</b> <code>React.lazy</code> needs a <strong>default export</strong> from <code>User.js</code>/<code>Post.js</code>. A named export (<code>export function User</code>) will not load — use <code>export default</code>.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Split the bundles</span><span class="lc-sub">lazy + Suspense — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 10 · Exercise 23 · Slot 15 slide 21</span>
<h2>Lazy-load tính năng User &amp; Post</h2>
<p class="lead"><b>Mục tiêu:</b> tách hai tính năng thành bundle riêng chỉ tải khi hiện, mỗi cái fetch dữ liệu, tất cả sau một fallback Suspense.</p>
<pre><span class="hljs-comment">// App.js</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">React</span>, { <span class="hljs-title class_">Suspense</span>, lazy, useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>;

<span class="hljs-keyword">const</span> <span class="hljs-title class_">User</span> = <span class="hljs-title function_">lazy</span>(<span class="hljs-function">() =&gt;</span> <span class="hljs-keyword">import</span>(<span class="hljs-string">&#x27;./User&#x27;</span>));
<span class="hljs-keyword">const</span> <span class="hljs-title class_">Post</span> = <span class="hljs-title function_">lazy</span>(<span class="hljs-function">() =&gt;</span> <span class="hljs-keyword">import</span>(<span class="hljs-string">&#x27;./Post&#x27;</span>));

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">App</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [view, setView] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>);
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setView(&#x27;user&#x27;)}&gt;Users<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setView(&#x27;post&#x27;)}&gt;Posts<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Suspense</span> <span class="hljs-attr">fallback</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">p</span>&gt;</span>🌀 Đang tải…<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>}&gt;
        {view === &#x27;user&#x27; &amp;&amp; <span class="hljs-tag">&lt;<span class="hljs-name">User</span> /&gt;</span>}
        {view === &#x27;post&#x27; &amp;&amp; <span class="hljs-tag">&lt;<span class="hljs-name">Post</span> /&gt;</span>}
      <span class="hljs-tag">&lt;/<span class="hljs-name">Suspense</span>&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  );
}
<span class="hljs-comment">// User.js / Post.js — default export, fetch trong useEffect</span></pre>
<div class="out"><b>Kết quả:</b> mở tab Network — bundle User chỉ tải lần đầu bạn bấm "Users"; bundle Post chỉ khi bấm "Posts". Fallback hiện trong mỗi lần tải đầu.</div>
<div class="pitfall"><b>Bẫy:</b> <code>React.lazy</code> cần <strong>default export</strong> từ <code>User.js</code>/<code>Post.js</code>. Named export (<code>export function User</code>) sẽ không nạp — dùng <code>export default</code>.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Chia bundle</span><span class="lc-sub">lazy + Suspense — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

export default [SLIDES, EX23];
