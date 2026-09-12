/**
 * FER202 · Chapter 9 additions — Handling Navigation with Routes (Slot 14,
 * 21 slides: React Router v6, BrowserRouter/Routes/Route, decoupling routes,
 * route params :id, optional params, Link) plus Exercises 20 (decoupling
 * routes), 21 (resource IDs) and 22 (optional params & Link). Grounded
 * slide-by-slide in Slot14_Handling-Navigation-with-Routes.pptx. Spliced into
 * Chapter 9 before its quiz; existing 9.1 lesson untouched.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const CODELAB = `/code-lab/react${REF}`;

const SLIDES = {
  title: '9.2 — Slide by slide: Navigation with React Router (Slot 14)|||9.2 — Học theo từng slide: Điều hướng với React Router (Slot 14)',
  slug: 'fer202-9-2-slot14-router-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 21 slide Slot 14: router là gì, cài & cấu hình react-router-dom v6, client vs server, SPA, khai báo route (BrowserRouter/Routes/Route/element), tách route theo tính năng (Outlet/useNavigate), route params (:id), optional params, và Link thay cho <a>.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 9 · Lesson 9.2 · Slot 14 deck (21 slides)</span>
<h2>Navigation with React Router, slide by slide</h2>
<p class="lead">A Single-Page App still needs many "pages". <strong>React Router</strong> maps URLs to components so navigation happens without full reloads. This deck uses <strong>React Router v6</strong> (<code>Routes</code>/<code>element</code>). Exercises 20–22 follow.</p>`,
      `<span class="eyebrow">Chương 9 · Bài 9.2 · Bộ slide Slot 14 (21 slide)</span>
<h2>Điều hướng với React Router, theo từng slide</h2>
<p class="lead">Một SPA vẫn cần nhiều "trang". <strong>React Router</strong> ánh xạ URL tới component để điều hướng mà không reload toàn trang. Bộ slide dùng <strong>React Router v6</strong> (<code>Routes</code>/<code>element</code>). Exercise 20–22 nằm ngay sau.</p>`,
    ),
    walkHead('slot14', 1, 21),
    walk('slot14', [
      [1, 'Handling Navigation with Routes', `<p>Title slide.</p>`, `<p>Slide bìa.</p>`],
      [2, 'Objectives', `<p>The map: intro to a router, setup &amp; config, client vs server, React Router vs React Router DOM, SPAs, declaring routes, route parameters, and Link components.</p>`, `<p>Bản đồ: giới thiệu router, cài &amp; cấu hình, client vs server, React Router vs React Router DOM, SPA, khai báo route, route parameter, và component Link.</p>`],
      [3, 'Introduction of a router', `<p>Routing = <strong>responding to a URL based on route declarations</strong> — a mapping from URL → rendered content. The three sub-topics: declaring routes, handling route parameters, using link components.</p>`, `<p>Routing = <strong>đáp lại một URL dựa trên khai báo route</strong> — ánh xạ từ URL → nội dung được render. Ba mục con: khai báo route, xử lý route parameter, dùng component link.</p>`],
      [4, 'What is React Router?', `<p>A library for routing with <strong>dynamic routing</strong> — routes are resolved while the app runs (as components render), not from a static config outside the app. It is <strong>component-based</strong>: you declare routes as JSX.</p>`, `<p>Một thư viện routing với <strong>dynamic routing</strong> — route được xử lý khi app chạy (lúc component render), không phải từ config tĩnh bên ngoài app. Nó <strong>dựa trên component</strong>: bạn khai báo route bằng JSX.</p>`],
      [5, 'Setup & configuring router', `<p>Install <code>npm install react-router-dom</code>, then wrap your app once in <code>&lt;BrowserRouter&gt;</code> in <code>index.js</code>. Everything inside can now use routing. (The slide pins v6.16.0.)</p>`, `<p>Cài <code>npm install react-router-dom</code>, rồi bọc app một lần trong <code>&lt;BrowserRouter&gt;</code> ở <code>index.js</code>. Mọi thứ bên trong giờ dùng được routing. (Slide ghim v6.16.0.)</p>`],
      [6, 'Client vs server side', `<p><strong>Client side</strong> = the browser, processing on the local machine. <strong>Server side</strong> = information processed on a server, then sent to the browser. React Router does <em>client-side</em> routing: the URL changes and the view swaps without a server round-trip.</p>`, `<p><strong>Client side</strong> = trình duyệt, xử lý trên máy cục bộ. <strong>Server side</strong> = thông tin xử lý trên server rồi gửi về trình duyệt. React Router làm routing <em>phía client</em>: URL đổi và view thay mà không cần vòng gọi server.</p>`],
      [7, 'React Router vs React Router DOM', `<p><code>react-router-dom</code> = React Router for <strong>websites</strong> (DOM bindings). <code>react-router-native</code> = for React Native apps. Two flavours, like React itself: Web and Native. For FER202 you always use <code>react-router-dom</code>.</p>`, `<p><code>react-router-dom</code> = React Router cho <strong>web</strong> (DOM bindings). <code>react-router-native</code> = cho app React Native. Hai "vị", như chính React: Web và Native. Trong FER202 luôn dùng <code>react-router-dom</code>.</p>`],
      [8, 'Single Page Applications', `<p>An SPA rewrites the current page with new data instead of loading a whole new page. Click a link → the new content loads <em>inline</em> on the same page; only the necessary components render. Router is what makes this feel like navigating pages.</p>`, `<p>SPA ghi lại trang hiện tại với dữ liệu mới thay vì tải cả trang mới. Bấm một link → nội dung mới nạp <em>ngay tại chỗ</em> trên cùng trang; chỉ các component cần thiết render. Router là thứ làm việc này giống như chuyển trang.</p>`],
      [9, 'Declaring routes', `<p>Collocate routes with content using JSX: <code>&lt;Routes&gt;&lt;Route path="/" element={&lt;MyComponent /&gt;} /&gt;&lt;/Routes&gt;</code> inside a <code>&lt;Router&gt;</code>. Each <code>Route</code> maps a <code>path</code> to an <code>element</code>. (v6 uses <code>element=</code>, not the old <code>component=</code>/children.)</p>`, `<p>Đặt route cạnh nội dung bằng JSX: <code>&lt;Routes&gt;&lt;Route path="/" element={&lt;MyComponent /&gt;} /&gt;&lt;/Routes&gt;</code> trong một <code>&lt;Router&gt;</code>. Mỗi <code>Route</code> ánh xạ một <code>path</code> tới một <code>element</code>. (v6 dùng <code>element=</code>, không phải <code>component=</code>/children kiểu cũ.)</p>`],
      [10, 'Decoupling route declarations', `<p>Dozens of routes in one file are hard to map to features. Let each top-level feature define <em>its own</em> routes, then compose them — clearer ownership and easier maintenance.</p>`, `<p>Hàng chục route trong một file khó ánh xạ tới tính năng. Cho mỗi tính năng cấp cao tự khai <em>route của nó</em>, rồi ghép lại — rõ ai sở hữu gì và dễ bảo trì.</p>`],
      [11, 'Decoupling — Layout, nested routes', `<p>Key pieces: <code>BrowserRouter</code> (HTML5 History API), <code>Routes</code> (wraps <code>Route</code>s), <code>Route</code> (one route). A parent <code>&lt;Route path="/" element={&lt;Layout /&gt;}&gt;</code> with children creates <strong>nested routes</strong>; an <code>index</code> route is the default child. Feature route arrays (<code>{oneRoutes}</code>) plug into the tree.</p>`, `<p>Các mảnh chính: <code>BrowserRouter</code> (HTML5 History API), <code>Routes</code> (bọc các <code>Route</code>), <code>Route</code> (một route). Một <code>&lt;Route path="/" element={&lt;Layout /&gt;}&gt;</code> cha có con tạo ra <strong>nested route</strong>; một <code>index</code> route là con mặc định. Mảng route của tính năng (<code>{oneRoutes}</code>) cắm vào cây.</p>`],
      [12, 'Decoupling — Outlet & useNavigate', `<p><code>&lt;Outlet /&gt;</code> in the Layout is where the matched child route renders. Programmatic navigation uses the <code>useNavigate()</code> hook: <code>const navigate = useNavigate(); navigate('/one')</code> — e.g. a Redirect component that navigates in a <code>useEffect</code>.</p>`, `<p><code>&lt;Outlet /&gt;</code> trong Layout là nơi route con khớp được render. Điều hướng bằng code dùng hook <code>useNavigate()</code>: <code>const navigate = useNavigate(); navigate('/one')</code> — ví dụ một component Redirect điều hướng trong <code>useEffect</code>.</p>`],
      [13, 'Exercise 20: Decoupling route declarations', `<p>Hand-off to <strong>Exercise 20</strong> — split routes into per-feature modules. Full brief in the next lessons.</p>`, `<p>Chuyển sang <strong>Exercise 20</strong> — tách route thành module theo tính năng. Đề đầy đủ ở các bài kế.</p>`],
      [14, 'Handling route parameters', `<p>Most apps mix <strong>static</strong> and <strong>dynamic</strong> routes. Two kinds of parameters: resource IDs in the path (<code>/users/:id</code>) and optional parameters.</p>`, `<p>Đa số app trộn route <strong>tĩnh</strong> và <strong>động</strong>. Hai loại parameter: resource ID trong path (<code>/users/:id</code>) và optional parameter.</p>`],
      [15, 'Resource IDs in routes', `<p>The <code>:</code> marks a URL variable: <code>&lt;Route path="/users/:id" element={&lt;UserContainer /&gt;} /&gt;</code>. Inside the component, read it with the <strong><code>useParams()</code></strong> hook: <code>const { id } = useParams()</code>, then fetch that user. (The slide shows passing the id; the v6 way to read it is <code>useParams</code>.)</p>`, `<p><code>:</code> đánh dấu một biến URL: <code>&lt;Route path="/users/:id" element={&lt;UserContainer /&gt;} /&gt;</code>. Trong component, đọc bằng hook <strong><code>useParams()</code></strong>: <code>const { id } = useParams()</code>, rồi fetch user đó. (Slide cho thấy truyền id; cách đọc trong v6 là <code>useParams</code>.)</p>`],
      [16, 'Exercise 21: Resource IDs in routes', `<p>Hand-off to <strong>Exercise 21</strong> — a user list where clicking an id opens a detail route. Full brief in the next lessons.</p>`, `<p>Chuyển sang <strong>Exercise 21</strong> — danh sách user, bấm id mở route chi tiết. Đề đầy đủ ở các bài kế.</p>`],
      [17, 'Optional parameters', `<p>For optional path values, nest routes so one has the param and one does not: <code>&lt;Route path="/users"&gt;&lt;Route path=":desc" element={…} /&gt;&lt;Route path="" element={…} /&gt;&lt;/Route&gt;</code>. Query parameters (<code>?sort=asc</code>) suit many optional values — read with <code>useSearchParams()</code>.</p>`, `<p>Với giá trị path tuỳ chọn, lồng route để một cái có param, một cái không: <code>&lt;Route path="/users"&gt;&lt;Route path=":desc" element={…} /&gt;&lt;Route path="" element={…} /&gt;&lt;/Route&gt;</code>. Query parameter (<code>?sort=asc</code>) hợp cho nhiều giá trị tuỳ chọn — đọc bằng <code>useSearchParams()</code>.</p>`],
      [18, 'Using Link components', `<p>Never navigate with a plain <code>&lt;a href&gt;</code> — it sends a GET to the server and reloads the whole app. Use <code>&lt;Link to="/users"&gt;</code> (or <code>&lt;NavLink&gt;</code> for active styling): it changes the URL client-side and swaps components, no reload.</p>`, `<p>Đừng điều hướng bằng <code>&lt;a href&gt;</code> thuần — nó gửi GET tới server và reload cả app. Dùng <code>&lt;Link to="/users"&gt;</code> (hoặc <code>&lt;NavLink&gt;</code> để tạo kiểu active): nó đổi URL phía client và thay component, không reload.</p>`],
      [19, 'Exercise 22: Optional parameters & Link', `<p>Hand-off to <strong>Exercise 22</strong> — optional params plus navigating with <code>&lt;Link&gt;</code>. Full brief in the next lessons.</p>`, `<p>Chuyển sang <strong>Exercise 22</strong> — optional param cộng điều hướng bằng <code>&lt;Link&gt;</code>. Đề đầy đủ ở các bài kế.</p>`],
      [20, 'Lab 5: React Router', `<p>Points to the larger router lab — a multi-page SPA with nested routes, params and links. Practise with Exercises 20–22 and the practice project.</p>`, `<p>Trỏ tới bài lab router lớn hơn — một SPA nhiều trang với nested route, param và link. Luyện qua Exercise 20–22 và dự án luyện tập.</p>`],
      [21, 'Summary', `<p>Recap: wrap the app in <code>&lt;BrowserRouter&gt;</code>; declare <code>&lt;Routes&gt;</code>/<code>&lt;Route path element&gt;</code>; nest routes with a Layout + <code>&lt;Outlet /&gt;</code>; read params with <code>useParams</code> and queries with <code>useSearchParams</code>; navigate with <code>&lt;Link&gt;</code>/<code>useNavigate</code> — all client-side, no reloads. (Reference on the slide: webdevsimplified React Router guide.)</p>`, `<p>Tóm tắt: bọc app trong <code>&lt;BrowserRouter&gt;</code>; khai <code>&lt;Routes&gt;</code>/<code>&lt;Route path element&gt;</code>; lồng route bằng Layout + <code>&lt;Outlet /&gt;</code>; đọc param bằng <code>useParams</code> và query bằng <code>useSearchParams</code>; điều hướng bằng <code>&lt;Link&gt;</code>/<code>useNavigate</code> — tất cả phía client, không reload. (Tham khảo trên slide: hướng dẫn React Router của webdevsimplified.)</p>`],
    ]),
    books([
      ['router', 'the reactrouter.com tutorial and “Route”, “Link”, “useParams”, “Nested Routes”', 'hướng dẫn reactrouter.com và “Route”, “Link”, “useParams”, “Nested Routes”'],
    ]),
  ].join('\n'),
};

const EX20 = {
  title: 'Exercise 20 — Decoupling route declarations|||Exercise 20 — Tách khai báo route',
  slug: 'fer202-9-ex20-decoupling-routes',
  type: 'EXERCISE',
  description: 'Tách route ra file riêng theo tính năng và ghép lại; dùng Layout + Outlet cho route lồng.',
  content: bi(
    `<span class="eyebrow">Chapter 9 · Exercise 20 · Slot 14 slide 13</span>
<h2>Decouple your routes</h2>
<p class="lead"><b>Goal:</b> keep routes maintainable by defining them per feature and composing them.</p>
<pre><span class="hljs-comment">// routes.js — declare routes as data/JSX per feature</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">Route</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Home</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./Home&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-title class_">About</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./About&#x27;</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> routes = [
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">key</span>=<span class="hljs-string">&quot;home&quot;</span>  <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/&quot;</span>      <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Home</span> /&gt;</span>} /&gt;</span>,
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">key</span>=<span class="hljs-string">&quot;about&quot;</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/about&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">About</span> /&gt;</span>} /&gt;</span>,
];

<span class="hljs-comment">// App.js — compose them under a Layout with an Outlet</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">Routes</span>, <span class="hljs-title class_">Route</span>, <span class="hljs-title class_">Outlet</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span>;
<span class="hljs-keyword">import</span> { routes } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./routes&#x27;</span>;

<span class="hljs-keyword">function</span> <span class="hljs-title function_">Layout</span>(<span class="hljs-params"></span>) { <span class="hljs-keyword">return</span> (<span class="language-xml"><span class="hljs-tag">&lt;&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">NavBar</span> /&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">main</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Outlet</span> /&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">main</span>&gt;</span><span class="hljs-tag">&lt;/&gt;</span></span>); }

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">App</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Routes</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Layout</span> /&gt;</span>}&gt;{routes}<span class="hljs-tag">&lt;/<span class="hljs-name">Route</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">Routes</span>&gt;</span></span>
  );
}</pre>
<div class="out"><b>Result:</b> each feature owns its routes; <code>&lt;Outlet /&gt;</code> renders the matched child inside the shared layout.</div>`,
    `<span class="eyebrow">Chương 9 · Exercise 20 · Slot 14 slide 13</span>
<h2>Tách route của bạn</h2>
<p class="lead"><b>Mục tiêu:</b> giữ route dễ bảo trì bằng cách khai theo tính năng rồi ghép lại.</p>
<pre><span class="hljs-comment">// routes.js — khai route dạng dữ liệu/JSX theo tính năng</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">Route</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Home</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./Home&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-title class_">About</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./About&#x27;</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> routes = [
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">key</span>=<span class="hljs-string">&quot;home&quot;</span>  <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/&quot;</span>      <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Home</span> /&gt;</span>} /&gt;</span>,
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">key</span>=<span class="hljs-string">&quot;about&quot;</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/about&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">About</span> /&gt;</span>} /&gt;</span>,
];

<span class="hljs-comment">// App.js — ghép chúng dưới một Layout có Outlet</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">Routes</span>, <span class="hljs-title class_">Route</span>, <span class="hljs-title class_">Outlet</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span>;
<span class="hljs-keyword">import</span> { routes } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./routes&#x27;</span>;

<span class="hljs-keyword">function</span> <span class="hljs-title function_">Layout</span>(<span class="hljs-params"></span>) { <span class="hljs-keyword">return</span> (<span class="language-xml"><span class="hljs-tag">&lt;&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">NavBar</span> /&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">main</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Outlet</span> /&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">main</span>&gt;</span><span class="hljs-tag">&lt;/&gt;</span></span>); }

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">App</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Routes</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Layout</span> /&gt;</span>}&gt;{routes}<span class="hljs-tag">&lt;/<span class="hljs-name">Route</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">Routes</span>&gt;</span></span>
  );
}</pre>
<div class="out"><b>Kết quả:</b> mỗi tính năng sở hữu route của nó; <code>&lt;Outlet /&gt;</code> render con khớp bên trong layout chung.</div>`,
  ),
};

const EX21 = {
  title: 'Exercise 21 — Resource IDs in routes|||Exercise 21 — Resource ID trong route',
  slug: 'fer202-9-ex21-resource-ids',
  type: 'EXERCISE',
  description: 'Danh sách user; bấm vào một user mở route /users/:id và hiển thị chi tiết đọc bằng useParams.',
  content: bi(
    `<span class="eyebrow">Chapter 9 · Exercise 21 · Slot 14 slide 16</span>
<h2>Route params — a user detail page</h2>
<pre><span class="hljs-keyword">const</span> users = [
  { <span class="hljs-attr">id</span>: <span class="hljs-number">1</span>, <span class="hljs-attr">firstName</span>: <span class="hljs-string">&#x27;John&#x27;</span>, <span class="hljs-attr">lastName</span>: <span class="hljs-string">&#x27;Doe&#x27;</span>,      <span class="hljs-attr">age</span>: <span class="hljs-number">25</span> },
  { <span class="hljs-attr">id</span>: <span class="hljs-number">2</span>, <span class="hljs-attr">firstName</span>: <span class="hljs-string">&#x27;Mary&#x27;</span>, <span class="hljs-attr">lastName</span>: <span class="hljs-string">&#x27;Thompson&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">35</span> },
];

<span class="hljs-keyword">function</span> <span class="hljs-title function_">UserList</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>{users.map(u =&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{u.id}</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">to</span>=<span class="hljs-string">{</span>\`/<span class="hljs-attr">users</span>/\${<span class="hljs-attr">u.id</span>}\`}&gt;</span>{u.firstName}<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>)}
    <span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span></span>
  );
}

<span class="hljs-keyword">function</span> <span class="hljs-title function_">UserDetail</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> { id } = <span class="hljs-title function_">useParams</span>();                 <span class="hljs-comment">// read :id from the URL</span>
  <span class="hljs-keyword">const</span> user = users.<span class="hljs-title function_">find</span>(<span class="hljs-function"><span class="hljs-params">u</span> =&gt;</span> u.<span class="hljs-property">id</span> === <span class="hljs-title class_">Number</span>(id));
  <span class="hljs-keyword">return</span> user ? <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>{user.firstName} {user.lastName} ({user.age})<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span></span>
              : <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Not found<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>;
}

<span class="hljs-comment">// routes: &lt;Route path=&quot;/users&quot; element={&lt;UserList/&gt;}/&gt;  and  path=&quot;/users/:id&quot; element={&lt;UserDetail/&gt;}</span></pre>
<div class="pitfall"><b>Trap:</b> <code>useParams()</code> returns strings — <code>id</code> is <code>"1"</code>, not <code>1</code>. Convert with <code>Number(id)</code> before comparing to numeric ids.</div>`,
    `<span class="eyebrow">Chương 9 · Exercise 21 · Slot 14 slide 16</span>
<h2>Route param — trang chi tiết user</h2>
<pre><span class="hljs-keyword">const</span> users = [
  { <span class="hljs-attr">id</span>: <span class="hljs-number">1</span>, <span class="hljs-attr">firstName</span>: <span class="hljs-string">&#x27;John&#x27;</span>, <span class="hljs-attr">lastName</span>: <span class="hljs-string">&#x27;Doe&#x27;</span>,      <span class="hljs-attr">age</span>: <span class="hljs-number">25</span> },
  { <span class="hljs-attr">id</span>: <span class="hljs-number">2</span>, <span class="hljs-attr">firstName</span>: <span class="hljs-string">&#x27;Mary&#x27;</span>, <span class="hljs-attr">lastName</span>: <span class="hljs-string">&#x27;Thompson&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">35</span> },
];

<span class="hljs-keyword">function</span> <span class="hljs-title function_">UserList</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>{users.map(u =&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{u.id}</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">to</span>=<span class="hljs-string">{</span>\`/<span class="hljs-attr">users</span>/\${<span class="hljs-attr">u.id</span>}\`}&gt;</span>{u.firstName}<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>)}
    <span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span></span>
  );
}

<span class="hljs-keyword">function</span> <span class="hljs-title function_">UserDetail</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> { id } = <span class="hljs-title function_">useParams</span>();                 <span class="hljs-comment">// đọc :id từ URL</span>
  <span class="hljs-keyword">const</span> user = users.<span class="hljs-title function_">find</span>(<span class="hljs-function"><span class="hljs-params">u</span> =&gt;</span> u.<span class="hljs-property">id</span> === <span class="hljs-title class_">Number</span>(id));
  <span class="hljs-keyword">return</span> user ? <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>{user.firstName} {user.lastName} ({user.age})<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span></span>
              : <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Không tìm thấy<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>;
}

<span class="hljs-comment">// route: &lt;Route path=&quot;/users&quot; element={&lt;UserList/&gt;}/&gt;  và  path=&quot;/users/:id&quot; element={&lt;UserDetail/&gt;}</span></pre>
<div class="pitfall"><b>Bẫy:</b> <code>useParams()</code> trả về chuỗi — <code>id</code> là <code>"1"</code>, không phải <code>1</code>. Đổi bằng <code>Number(id)</code> trước khi so với id số.</div>`,
  ),
};

const EX22 = {
  title: 'Exercise 22 — Optional parameters & Link|||Exercise 22 — Optional param & Link',
  slug: 'fer202-9-ex22-optional-link',
  type: 'EXERCISE',
  description: 'Route với optional param (nested + query bằng useSearchParams) và điều hướng bằng <Link>/<NavLink> thay cho <a>.',
  content: bi(
    `<span class="eyebrow">Chapter 9 · Exercise 22 · Slot 14 slide 19</span>
<h2>Optional params &amp; navigating with Link</h2>
<pre><span class="hljs-comment">// optional path param via nested routes</span>
&lt;<span class="hljs-title class_">Route</span> path=<span class="hljs-string">&quot;/users&quot;</span>&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">index</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Users</span> /&gt;</span>} /&gt;</span>         <span class="hljs-comment">// /users</span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;:desc&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Users</span> /&gt;</span>} /&gt;</span>  <span class="hljs-comment">// /users/active</span>
&lt;/<span class="hljs-title class_">Route</span>&gt;

<span class="hljs-comment">// query params for many optional values</span>
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Users</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [params, setParams] = <span class="hljs-title function_">useSearchParams</span>();
  <span class="hljs-keyword">const</span> sort = params.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;sort&#x27;</span>) ?? <span class="hljs-string">&#x27;name&#x27;</span>;   <span class="hljs-comment">// /users?sort=age</span>
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">NavLink</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/users?sort=age&quot;</span>&gt;</span>Sort by age<span class="hljs-tag">&lt;/<span class="hljs-name">NavLink</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Sorting by {sort}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  );
}</pre>
<div class="callout"><span class="badge">★ Link vs a</span> <code>&lt;Link&gt;</code>/<code>&lt;NavLink&gt;</code> keep navigation client-side (no reload); <code>&lt;NavLink&gt;</code> also adds an <code>active</code> class to the current link for styling. A plain <code>&lt;a&gt;</code> would reload the whole app.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Build the routes</span><span class="lc-sub">Params, query, Link — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 9 · Exercise 22 · Slot 14 slide 19</span>
<h2>Optional param &amp; điều hướng bằng Link</h2>
<pre><span class="hljs-comment">// optional path param bằng nested route</span>
&lt;<span class="hljs-title class_">Route</span> path=<span class="hljs-string">&quot;/users&quot;</span>&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">index</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Users</span> /&gt;</span>} /&gt;</span>         <span class="hljs-comment">// /users</span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;:desc&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Users</span> /&gt;</span>} /&gt;</span>  <span class="hljs-comment">// /users/active</span>
&lt;/<span class="hljs-title class_">Route</span>&gt;

<span class="hljs-comment">// query param cho nhiều giá trị tuỳ chọn</span>
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Users</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [params, setParams] = <span class="hljs-title function_">useSearchParams</span>();
  <span class="hljs-keyword">const</span> sort = params.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;sort&#x27;</span>) ?? <span class="hljs-string">&#x27;name&#x27;</span>;   <span class="hljs-comment">// /users?sort=age</span>
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">NavLink</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/users?sort=age&quot;</span>&gt;</span>Sắp theo tuổi<span class="hljs-tag">&lt;/<span class="hljs-name">NavLink</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Đang sắp theo {sort}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  );
}</pre>
<div class="callout"><span class="badge">★ Link vs a</span> <code>&lt;Link&gt;</code>/<code>&lt;NavLink&gt;</code> giữ điều hướng phía client (không reload); <code>&lt;NavLink&gt;</code> còn thêm class <code>active</code> cho link hiện tại để tạo kiểu. Một <code>&lt;a&gt;</code> thuần sẽ reload cả app.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Dựng các route</span><span class="lc-sub">Param, query, Link — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

export default [SLIDES, EX20, EX21, EX22];
