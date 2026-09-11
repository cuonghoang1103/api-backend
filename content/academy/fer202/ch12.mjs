/**
 * FER202 · Chapter 12 additions — Flux architecture & Introduction to Redux
 * (Slot 16–17, 36 slides: MVC, Flux, Redux principles & data flow, Redux
 * Toolkit createSlice/configureStore, react-redux Provider/useSelector/
 * useDispatch, middleware, Redux Thunk) plus Exercises 24 (intro Redux) and
 * 25 (Redux Thunk). Grounded slide-by-slide in Slot16,17. Spliced into
 * Chapter 12 before its quiz; existing 12.1 / 12.2 lessons untouched.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const CODELAB = `/code-lab/react${REF}`;

const SLIDES = {
  title: '12.3 — Slide by slide: Flux, Redux, Redux Toolkit & Thunk (Slot 16–17)|||12.3 — Học theo từng slide: Flux, Redux, Redux Toolkit & Thunk (Slot 16–17)',
  slug: 'fer202-12-3-slot16-redux-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 36 slide Slot 16–17: MVC vs Flux (unidirectional data flow), Redux (3 nguyên tắc, action/reducer/store), Redux Toolkit (createSlice/configureStore), react-redux (Provider/useSelector/useDispatch), middleware & logger, và Redux Thunk cho async.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 12 · Lesson 12.3 · Slot 16–17 deck (36 slides)</span>
<h2>Flux &amp; Redux, slide by slide</h2>
<p class="lead">When many components share and change the same data, prop drilling and scattered state break down. <strong>Redux</strong> puts all app state in one predictable store, changed only through actions and pure reducers. This deck goes from MVC → Flux → Redux → Redux Toolkit → Thunk. Exercises 24–25 follow.</p>`,
      `<span class="eyebrow">Chương 12 · Bài 12.3 · Bộ slide Slot 16–17 (36 slide)</span>
<h2>Flux &amp; Redux, theo từng slide</h2>
<p class="lead">Khi nhiều component cùng chia sẻ và thay đổi một dữ liệu, prop drilling và state rải rác sụp đổ. <strong>Redux</strong> đặt toàn bộ state app vào một store dễ đoán, chỉ đổi qua action và reducer thuần. Bộ slide đi từ MVC → Flux → Redux → Redux Toolkit → Thunk. Exercise 24–25 nằm ngay sau.</p>`,
    ),
    walkHead('slot16_17', 1, 36),
    walk('slot16_17', [
      [1, 'Introduction to Redux, Redux Thunk and Redux Toolkit', `<p>Title slide.</p>`, `<p>Slide bìa.</p>`],
      [2, 'Objectives', `<p>Features of Flux; Redux as a variant of Flux; install &amp; configure Redux; Redux Toolkit; splitting/combining reducers; Redux Thunk for async; logger middleware.</p>`, `<p>Đặc điểm Flux; Redux là biến thể của Flux; cài &amp; cấu hình Redux; Redux Toolkit; tách/gộp reducer; Redux Thunk cho async; logger middleware.</p>`],
      [3, 'Model-View-Controller framework', `<p>Section divider — start from the classic pattern React was born into.</p>`, `<p>Slide phân mục — bắt đầu từ mẫu kinh điển React sinh ra trong đó.</p>`],
      [4, 'Design patterns', `<p>A <strong>design pattern</strong> is a well-documented, reusable solution to a recurring problem (the "Gang of Four" book, 1994). MVC is an architectural pattern.</p>`, `<p><strong>Design pattern</strong> là một lời giải tái dùng, có tài liệu cho một vấn đề lặp lại (sách "Gang of Four", 1994). MVC là một architectural pattern.</p>`],
      [5, 'The MVC architecture', `<p>MVC <strong>isolates domain logic from the UI</strong>, enabling independent development, testing and maintenance — separation of concerns. Three parts follow.</p>`, `<p>MVC <strong>tách logic nghiệp vụ khỏi UI</strong>, cho phép phát triển, test và bảo trì độc lập — tách bạch trách nhiệm. Ba phần theo sau.</p>`],
      [6, 'MVC — Model', `<p>The <strong>Model</strong> manages the domain data and behaviour; it answers state queries (from the View) and state-change instructions (from the Controller), and notifies observers (Views) when data changes.</p>`, `<p><strong>Model</strong> quản lý dữ liệu và hành vi nghiệp vụ; nó trả lời truy vấn state (từ View) và lệnh đổi state (từ Controller), và thông báo cho observer (View) khi dữ liệu đổi.</p>`],
      [7, 'MVC — View', `<p>The <strong>View</strong> renders the model into a UI. Multiple views can exist for one model; each maps to a display surface and knows how to render it.</p>`, `<p><strong>View</strong> render model thành UI. Một model có thể có nhiều view; mỗi view ứng với một bề mặt hiển thị và biết cách render.</p>`],
      [8, 'MVC — Controller', `<p>The <strong>Controller</strong> receives user input and tells the Model and View what to do in response. It is the intermediary between input and the other two parts.</p>`, `<p><strong>Controller</strong> nhận input người dùng và bảo Model, View phải làm gì để đáp lại. Nó là trung gian giữa input và hai phần kia.</p>`],
      [9, 'The Flux architecture', `<p>Section divider — Facebook's answer to MVC's problems.</p>`, `<p>Slide phân mục — câu trả lời của Facebook cho các vấn đề của MVC.</p>`],
      [10, 'React and MVC', `<p>React was first seen as the "V" in MVC, but Facebook hit problems with standard MVC — <strong>cascading updates, decentralised mutations, race conditions</strong> — and replaced it with the <strong>Flux</strong> architecture.</p>`, `<p>React ban đầu được coi là "V" trong MVC, nhưng Facebook gặp vấn đề với MVC chuẩn — <strong>cập nhật dây chuyền, mutation phân tán, race condition</strong> — và thay bằng kiến trúc <strong>Flux</strong>.</p>`],
      [11, 'Flux — unidirectional data flow', `<p>Flux's core idea: <strong>data flows in one direction</strong> only. This makes state changes traceable, unlike MVC where the View could update the Model directly and cause loops.</p>`, `<p>Ý cốt lõi của Flux: <strong>dữ liệu chỉ chảy một chiều</strong>. Điều này làm thay đổi state truy vết được, khác MVC nơi View đổi Model trực tiếp gây vòng lặp.</p>`],
      [12, 'Flux — actions propagate', `<p>User interactions create <strong>actions</strong> that propagate through the system (Action → Dispatcher → Store → View), never backwards. New interactions start new actions.</p>`, `<p>Tương tác người dùng tạo ra <strong>action</strong> lan truyền qua hệ thống (Action → Dispatcher → Store → View), không bao giờ ngược. Tương tác mới bắt đầu action mới.</p>`],
      [13, 'Flux vs MVC', `<p>Compared: Flux is <strong>unidirectional</strong> (MVC is not); Flux keeps data in independent <strong>Stores</strong> (MVC in a Model tied to Controller/View); Flux uses explicit <strong>actions</strong> (MVC handles events in Controller/Model); a Flux <strong>Dispatcher</strong> decouples View from Store, easing testing (MVC couples Controller to Model+View).</p>`, `<p>So sánh: Flux <strong>một chiều</strong> (MVC không); Flux giữ dữ liệu trong <strong>Store</strong> độc lập (MVC trong Model gắn Controller/View); Flux dùng <strong>action</strong> tường minh (MVC xử lý sự kiện trong Controller/Model); <strong>Dispatcher</strong> của Flux tách View khỏi Store, dễ test (MVC gắn chặt Controller với Model+View).</p>`],
      [14, 'Introduction to Redux', `<p><strong>Redux</strong> is a <em>predictable state container</em> for JavaScript apps, inspired by Flux, the Elm language and Immutable. It makes state mutations predictable.</p>`, `<p><strong>Redux</strong> là một <em>predictable state container</em> cho app JavaScript, lấy cảm hứng từ Flux, ngôn ngữ Elm và Immutable. Nó làm thay đổi state trở nên dễ đoán.</p>`],
      [15, 'Three principles of Redux', `<p>(1) <strong>Single source of truth</strong> — one state tree in one store. (2) <strong>State is read-only</strong> — change it only by dispatching actions. (3) <strong>Changes via pure functions</strong> — reducers take (state, action) → next state, with no mutation. Memorise these three.</p>`, `<p>(1) <strong>Nguồn sự thật duy nhất</strong> — một cây state trong một store. (2) <strong>State chỉ đọc</strong> — chỉ đổi bằng dispatch action. (3) <strong>Đổi bằng hàm thuần</strong> — reducer nhận (state, action) → state kế, không mutate. Thuộc ba điều này.</p>`],
      [16, 'Why a single store?', `<p>One store + one state tree enables powerful techniques: logging, centralised API handling, undo/redo, state persistence, and "time-travel debugging". These are hard with scattered state.</p>`, `<p>Một store + một cây state mở ra các kỹ thuật mạnh: logging, xử lý API tập trung, undo/redo, lưu state, và "time-travel debugging". Những cái này khó với state rải rác.</p>`],
      [17, 'Redux data flow', `<p>Unidirectional: <strong>State</strong> (a plain JS object) → <strong>Action</strong> (a plain object with a <code>type</code>) → <strong>Reducer</strong> (pure fn: current state + action → new state, immutably) → new State → UI. Same shape as <code>useReducer</code> (Chapter 8), scaled to the whole app.</p>`, `<p>Một chiều: <strong>State</strong> (object JS thuần) → <strong>Action</strong> (object thuần có <code>type</code>) → <strong>Reducer</strong> (hàm thuần: state hiện tại + action → state mới, bất biến) → State mới → UI. Cùng hình dạng với <code>useReducer</code> (Chương 8), mở rộng ra cả app.</p>`],
      [18, 'How to install Redux', `<p><code>redux</code> (state container), <code>react-redux</code> (React bindings — <code>useSelector</code>/<code>useDispatch</code>), <code>redux-thunk</code> (middleware for async). In practice you install <strong>@reduxjs/toolkit</strong> which bundles these — the official, recommended way.</p>`, `<p><code>redux</code> (state container), <code>react-redux</code> (bindings React — <code>useSelector</code>/<code>useDispatch</code>), <code>redux-thunk</code> (middleware async). Thực tế bạn cài <strong>@reduxjs/toolkit</strong> gói sẵn các thứ này — cách chính thức, được khuyến nghị.</p>`],
      [19, 'Redux action', `<p><strong>Actions</strong> are events that send data to the store — from user interaction, API calls, form submits. An action is a plain object <code>{ type, payload }</code>. (The slide's async action returning a function is a <em>thunk</em> — see slide 30.)</p>`, `<p><strong>Action</strong> là sự kiện gửi dữ liệu tới store — từ tương tác, gọi API, submit form. Một action là object thuần <code>{ type, payload }</code>. (Action async trên slide trả về một hàm là một <em>thunk</em> — xem slide 30.)</p>`],
      [20, 'Redux reducer — createSlice', `<p>A <strong>reducer</strong> takes current state + action → new state. Redux Toolkit's <code>createSlice</code> generates the reducer <em>and</em> the actions together: define <code>name</code>, <code>initialState</code> and <code>reducers</code> (e.g. <code>increment: s =&gt; s + 1</code>); it exports <code>slice.actions</code> and <code>slice.reducer</code>. Inside a slice you can "mutate" state — Immer makes it immutable under the hood.</p>`, `<p><strong>Reducer</strong> nhận state hiện tại + action → state mới. <code>createSlice</code> của Redux Toolkit sinh ra reducer <em>và</em> action cùng lúc: khai <code>name</code>, <code>initialState</code> và <code>reducers</code> (ví dụ <code>increment: s =&gt; s + 1</code>); nó export <code>slice.actions</code> và <code>slice.reducer</code>. Trong slice bạn "mutate" state được — Immer làm nó bất biến bên dưới.</p>`],
      [21, 'Redux store — configureStore', `<p>The <strong>store</strong> holds the current state, created with <code>configureStore({ reducer: { counter: counterReducer } })</code> from Redux Toolkit. Unlike the old <code>createStore</code>, it wires up Redux DevTools and sensible default middleware automatically.</p>`, `<p><strong>Store</strong> giữ state hiện tại, tạo bằng <code>configureStore({ reducer: { counter: counterReducer } })</code> của Redux Toolkit. Khác <code>createStore</code> cũ, nó tự nối Redux DevTools và middleware mặc định hợp lý.</p>`],
      [22, 'React with Redux — Provider', `<p>Wrap your app root in <code>&lt;Provider store={store}&gt;</code> from react-redux — this makes the store available to every connected component below.</p>`, `<p>Bọc gốc app trong <code>&lt;Provider store={store}&gt;</code> của react-redux — nó làm store khả dụng cho mọi component kết nối bên dưới.</p>`],
      [23, 'React with Redux — useSelector & useDispatch', `<p>In a component: <code>const count = useSelector(s =&gt; s.counter)</code> reads state; <code>const dispatch = useDispatch()</code> gives the dispatcher, called as <code>dispatch(increment())</code>. The component re-renders when its selected slice changes.</p>`, `<p>Trong component: <code>const count = useSelector(s =&gt; s.counter)</code> đọc state; <code>const dispatch = useDispatch()</code> cho hàm dispatch, gọi như <code>dispatch(increment())</code>. Component re-render khi lát state nó chọn đổi.</p>`],
      [24, 'Exercise 24: Introduction to Redux', `<p>Hand-off to <strong>Exercise 24</strong> — install and configure Redux (Toolkit) and wire a counter. Full brief in the next lessons.</p>`, `<p>Chuyển sang <strong>Exercise 24</strong> — cài và cấu hình Redux (Toolkit) và nối một counter. Đề đầy đủ ở các bài kế.</p>`],
      [25, 'Redux middleware & Redux Thunk', `<p>Section divider — handling side-effects (like API calls) in Redux.</p>`, `<p>Slide phân mục — xử lý side-effect (như gọi API) trong Redux.</p>`],
      [26, 'Redux middleware', `<p><strong>Middleware</strong> runs code <em>after</em> an action is dispatched but <em>before</em> it reaches the reducer — a third-party extension point for logging, async API calls, etc. It forms a pipeline around <code>dispatch()</code>.</p>`, `<p><strong>Middleware</strong> chạy code <em>sau</em> khi action được dispatch nhưng <em>trước</em> khi tới reducer — điểm mở rộng cho logging, gọi API async… Nó tạo một pipeline quanh <code>dispatch()</code>.</p>`],
      [27, '(section transition)', `<p>Blank transition slide in the deck — no content.</p>`, `<p>Slide chuyển mục trong bộ slide — không có nội dung chữ.</p>`],
      [28, 'Redux middleware — uses', `<p>Middleware can inspect actions/state, modify actions, dispatch other actions, or stop actions reaching reducers. <code>applyMiddleware()</code> builds the pipeline and returns a store enhancer for <code>configureStore</code> (Toolkit adds thunk by default).</p>`, `<p>Middleware có thể soi action/state, sửa action, dispatch action khác, hoặc chặn action tới reducer. <code>applyMiddleware()</code> dựng pipeline và trả về store enhancer cho <code>configureStore</code> (Toolkit thêm thunk mặc định).</p>`],
      [29, 'What is redux-thunk?', `<p><strong>Redux Thunk</strong> handles asynchronous flow (e.g. REST API calls). When an action is a <em>function</em>, Thunk calls it with <code>dispatch</code> and <code>getState</code>; that function can do async work and dispatch follow-up actions when it completes.</p>`, `<p><strong>Redux Thunk</strong> xử lý luồng bất đồng bộ (ví dụ gọi REST API). Khi một action là <em>hàm</em>, Thunk gọi nó với <code>dispatch</code> và <code>getState</code>; hàm đó làm việc async và dispatch action tiếp theo khi xong.</p>`],
      [30, 'Redux Thunk — action creators returning functions', `<p>Thunk lets an action creator return a function instead of a plain object — to <strong>delay</strong> a dispatch, <strong>dispatch conditionally</strong>, or run async. The inner function receives <code>dispatch</code> and <code>getState</code>.</p>`, `<p>Thunk cho một action creator trả về một hàm thay vì object thuần — để <strong>trì hoãn</strong> dispatch, <strong>dispatch có điều kiện</strong>, hoặc chạy async. Hàm bên trong nhận <code>dispatch</code> và <code>getState</code>.</p>`],
      [31, 'Thunk — a data-fetching slice', `<p>The pattern: a thunk <code>fetchJobDetail(id)</code> dispatches <em>start</em>, awaits an axios call, then dispatches <em>success</em> (with the data) or <em>failure</em> (with the error). A slice's <code>extraReducers</code> handles those three actions to set <code>loading</code>/<code>data</code>/<code>error</code>. This is the canonical async-Redux shape.</p>`, `<p>Mẫu: một thunk <code>fetchJobDetail(id)</code> dispatch <em>start</em>, chờ một lời gọi axios, rồi dispatch <em>success</em> (kèm dữ liệu) hoặc <em>failure</em> (kèm lỗi). <code>extraReducers</code> của slice xử lý ba action đó để đặt <code>loading</code>/<code>data</code>/<code>error</code>. Đây là hình dạng async-Redux kinh điển.</p>`],
      [32, 'Thunk — wiring the component', `<p>The <code>JobDetail</code> component uses <code>useDispatch</code> to fire the thunk in a <code>useEffect</code> (<code>dispatch(fetchJobDetail(jobId))</code>) and <code>useSelector</code> to read <code>jobDetail</code>/<code>loading</code>/<code>error</code> from the store — the same loading/error/data UI as Chapter 11, but state lives in Redux.</p>`, `<p>Component <code>JobDetail</code> dùng <code>useDispatch</code> bắn thunk trong một <code>useEffect</code> (<code>dispatch(fetchJobDetail(jobId))</code>) và <code>useSelector</code> đọc <code>jobDetail</code>/<code>loading</code>/<code>error</code> từ store — cùng UI loading/error/data như Chương 11, nhưng state nằm trong Redux.</p>`],
      [33, 'Thunk vs Saga', `<p>Use <strong>Thunk</strong> for complex synchronous logic, multiple/conditional dispatches and simple async. <strong>Redux Saga</strong> (ES6 generators, pausable functions) suits complex async and ongoing "background thread"-like flows. Thunk is enough for FER202.</p>`, `<p>Dùng <strong>Thunk</strong> cho logic đồng bộ phức tạp, dispatch nhiều/có điều kiện và async đơn giản. <strong>Redux Saga</strong> (generator ES6, hàm tạm dừng được) hợp async phức tạp và luồng kiểu "background thread". Thunk là đủ cho FER202.</p>`],
      [34, 'Exercise 25: Redux Thunk', `<p>Hand-off to <strong>Exercise 25</strong> — use Thunk to return a function (async action) and add a logger middleware. Full brief in the next lessons.</p>`, `<p>Chuyển sang <strong>Exercise 25</strong> — dùng Thunk trả về một hàm (action async) và thêm logger middleware. Đề đầy đủ ở các bài kế.</p>`],
      [35, 'Lab 6: Redux Toolkit & Thunk', `<p>Points to the larger lab combining Redux Toolkit and Thunk. Practise with Exercises 24–25 and the practice project.</p>`, `<p>Trỏ tới bài lab lớn hơn gộp Redux Toolkit và Thunk. Luyện qua Exercise 24–25 và dự án luyện tập.</p>`],
      [36, 'Summary', `<p>Recap: Flux fixed MVC with unidirectional data flow; Redux is a predictable single-store container with three principles (single source of truth, read-only state, pure reducers); Redux Toolkit's <code>createSlice</code>/<code>configureStore</code> cut the boilerplate; react-redux connects components with <code>&lt;Provider&gt;</code>/<code>useSelector</code>/<code>useDispatch</code>; and Redux Thunk middleware handles async actions.</p>`, `<p>Tóm tắt: Flux sửa MVC bằng luồng dữ liệu một chiều; Redux là container một-store dễ đoán với ba nguyên tắc (nguồn sự thật duy nhất, state chỉ đọc, reducer thuần); <code>createSlice</code>/<code>configureStore</code> của Redux Toolkit cắt phần rườm rà; react-redux nối component bằng <code>&lt;Provider&gt;</code>/<code>useSelector</code>/<code>useDispatch</code>; và middleware Redux Thunk xử lý action async.</p>`],
    ]),
    books([
      ['redux', 'the Redux Toolkit “Quick Start” and “Redux Essentials” tutorial (createSlice, configureStore, thunks)', 'hướng dẫn Redux Toolkit “Quick Start” và “Redux Essentials” (createSlice, configureStore, thunk)'],
    ]),
  ].join('\n'),
};

const EX24 = {
  title: 'Exercise 24 — Introduction to Redux|||Exercise 24 — Giới thiệu Redux',
  slug: 'fer202-12-ex24-intro-redux',
  type: 'EXERCISE',
  description: 'Cài @reduxjs/toolkit + react-redux, tạo counterSlice, configureStore, bọc Provider, và nối counter bằng useSelector/useDispatch.',
  content: bi(
    `<span class="eyebrow">Chapter 12 · Exercise 24 · Slot 16–17 slide 24</span>
<h2>Install &amp; configure Redux (Toolkit)</h2>
<p class="lead"><b>Goal:</b> wire a counter through a real Redux store using Redux Toolkit — the modern, minimal setup.</p>
<pre><span class="hljs-comment">// counterSlice.js</span>
<span class="hljs-keyword">import</span> { createSlice } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@reduxjs/toolkit&#x27;</span>;
<span class="hljs-keyword">const</span> counterSlice = <span class="hljs-title function_">createSlice</span>({
  <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;counter&#x27;</span>,
  <span class="hljs-attr">initialState</span>: <span class="hljs-number">0</span>,
  <span class="hljs-attr">reducers</span>: { <span class="hljs-attr">increment</span>: <span class="hljs-function"><span class="hljs-params">s</span> =&gt;</span> s + <span class="hljs-number">1</span>, <span class="hljs-attr">decrement</span>: <span class="hljs-function"><span class="hljs-params">s</span> =&gt;</span> s - <span class="hljs-number">1</span> },
});
<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> { increment, decrement } = counterSlice.<span class="hljs-property">actions</span>;
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> counterSlice.<span class="hljs-property">reducer</span>;

<span class="hljs-comment">// store.js</span>
<span class="hljs-keyword">import</span> { configureStore } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@reduxjs/toolkit&#x27;</span>;
<span class="hljs-keyword">import</span> counterReducer <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./counterSlice&#x27;</span>;
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title function_">configureStore</span>({ <span class="hljs-attr">reducer</span>: { <span class="hljs-attr">counter</span>: counterReducer } });

<span class="hljs-comment">// index.js — wrap the app</span>
<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Provider</span> <span class="hljs-attr">store</span>=<span class="hljs-string">{store}</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">App</span> /&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">Provider</span>&gt;</span></span>

<span class="hljs-comment">// Counter.js</span>
<span class="hljs-keyword">const</span> count = <span class="hljs-title function_">useSelector</span>(<span class="hljs-function"><span class="hljs-params">s</span> =&gt;</span> s.<span class="hljs-property">counter</span>);
<span class="hljs-keyword">const</span> dispatch = <span class="hljs-title function_">useDispatch</span>();
<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> dispatch(increment())}&gt;+ {count}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span></span></pre>
<div class="out"><b>Result:</b> the counter state lives in the Redux store; any component can read it with <code>useSelector</code> and change it with <code>dispatch</code>.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Wire the store</span><span class="lc-sub">createSlice + Provider — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 12 · Exercise 24 · Slot 16–17 slide 24</span>
<h2>Cài &amp; cấu hình Redux (Toolkit)</h2>
<p class="lead"><b>Mục tiêu:</b> nối một counter qua store Redux thật bằng Redux Toolkit — cách hiện đại, tối giản.</p>
<pre><span class="hljs-comment">// counterSlice.js</span>
<span class="hljs-keyword">import</span> { createSlice } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@reduxjs/toolkit&#x27;</span>;
<span class="hljs-keyword">const</span> counterSlice = <span class="hljs-title function_">createSlice</span>({
  <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;counter&#x27;</span>,
  <span class="hljs-attr">initialState</span>: <span class="hljs-number">0</span>,
  <span class="hljs-attr">reducers</span>: { <span class="hljs-attr">increment</span>: <span class="hljs-function"><span class="hljs-params">s</span> =&gt;</span> s + <span class="hljs-number">1</span>, <span class="hljs-attr">decrement</span>: <span class="hljs-function"><span class="hljs-params">s</span> =&gt;</span> s - <span class="hljs-number">1</span> },
});
<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> { increment, decrement } = counterSlice.<span class="hljs-property">actions</span>;
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> counterSlice.<span class="hljs-property">reducer</span>;

<span class="hljs-comment">// store.js</span>
<span class="hljs-keyword">import</span> { configureStore } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@reduxjs/toolkit&#x27;</span>;
<span class="hljs-keyword">import</span> counterReducer <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./counterSlice&#x27;</span>;
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title function_">configureStore</span>({ <span class="hljs-attr">reducer</span>: { <span class="hljs-attr">counter</span>: counterReducer } });

<span class="hljs-comment">// index.js — bọc app</span>
<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Provider</span> <span class="hljs-attr">store</span>=<span class="hljs-string">{store}</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">App</span> /&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">Provider</span>&gt;</span></span>

<span class="hljs-comment">// Counter.js</span>
<span class="hljs-keyword">const</span> count = <span class="hljs-title function_">useSelector</span>(<span class="hljs-function"><span class="hljs-params">s</span> =&gt;</span> s.<span class="hljs-property">counter</span>);
<span class="hljs-keyword">const</span> dispatch = <span class="hljs-title function_">useDispatch</span>();
<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> dispatch(increment())}&gt;+ {count}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span></span></pre>
<div class="out"><b>Kết quả:</b> state counter nằm trong store Redux; bất kỳ component nào cũng đọc bằng <code>useSelector</code> và đổi bằng <code>dispatch</code>.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Nối store</span><span class="lc-sub">createSlice + Provider — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

const EX25 = {
  title: 'Exercise 25 — Redux Thunk (async + logger)|||Exercise 25 — Redux Thunk (async + logger)',
  slug: 'fer202-12-ex25-redux-thunk',
  type: 'EXERCISE',
  description: 'Viết một thunk async (fetch dữ liệu bằng axios, dispatch start/success/failure) và thêm logger middleware in log mọi action lên store.',
  content: bi(
    `<span class="eyebrow">Chapter 12 · Exercise 25 · Slot 16–17 slide 34</span>
<h2>Redux Thunk — async actions &amp; a logger</h2>
<p class="lead"><b>Goal:</b> use Thunk to return a function that fetches data, and add a logger middleware.</p>
<pre><span class="hljs-comment">// a thunk: returns a function (dispatch) =&gt; { ... }</span>
<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">fetchPosts</span> = (<span class="hljs-params"></span>) =&gt; <span class="hljs-title function_">async</span> (dispatch) =&gt; {
  <span class="hljs-title function_">dispatch</span>({ <span class="hljs-attr">type</span>: <span class="hljs-string">&#x27;posts/loading&#x27;</span> });
  <span class="hljs-keyword">try</span> {
    <span class="hljs-keyword">const</span> res = <span class="hljs-keyword">await</span> axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;https://jsonplaceholder.typicode.com/posts&#x27;</span>);
    <span class="hljs-title function_">dispatch</span>({ <span class="hljs-attr">type</span>: <span class="hljs-string">&#x27;posts/success&#x27;</span>, <span class="hljs-attr">payload</span>: res.<span class="hljs-property">data</span> });
  } <span class="hljs-keyword">catch</span> (e) {
    <span class="hljs-title function_">dispatch</span>({ <span class="hljs-attr">type</span>: <span class="hljs-string">&#x27;posts/error&#x27;</span>, <span class="hljs-attr">payload</span>: e.<span class="hljs-property">message</span> });
  }
};

<span class="hljs-comment">// a logger middleware</span>
<span class="hljs-keyword">const</span> <span class="hljs-title function_">logger</span> = (<span class="hljs-params">store</span>) =&gt; <span class="hljs-function">(<span class="hljs-params">next</span>) =&gt;</span> <span class="hljs-function">(<span class="hljs-params">action</span>) =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;dispatching&#x27;</span>, action);
  <span class="hljs-keyword">const</span> result = <span class="hljs-title function_">next</span>(action);
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;next state&#x27;</span>, store.<span class="hljs-title function_">getState</span>());
  <span class="hljs-keyword">return</span> result;
};

<span class="hljs-comment">// add it (thunk is already on by default in Toolkit)</span>
<span class="hljs-title function_">configureStore</span>({
  reducer,
  <span class="hljs-attr">middleware</span>: <span class="hljs-function">(<span class="hljs-params">getDefault</span>) =&gt;</span> <span class="hljs-title function_">getDefault</span>().<span class="hljs-title function_">concat</span>(logger),
});</pre>
<div class="out"><b>Result:</b> dispatching <code>fetchPosts()</code> runs the async flow (loading → success/error); the logger prints every action and the resulting state — Redux DevTools shows the same "time-travel" history.</div>
<div class="pitfall"><b>Trap:</b> a thunk is an action <em>creator that returns a function</em> — dispatch it as <code>dispatch(fetchPosts())</code>, not <code>dispatch(fetchPosts)</code>. Thunk middleware must be enabled (Redux Toolkit enables it by default).</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Write a thunk</span><span class="lc-sub">async + logger — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 12 · Exercise 25 · Slot 16–17 slide 34</span>
<h2>Redux Thunk — action async &amp; logger</h2>
<p class="lead"><b>Mục tiêu:</b> dùng Thunk trả về một hàm fetch dữ liệu, và thêm logger middleware.</p>
<pre><span class="hljs-comment">// một thunk: trả về một hàm (dispatch) =&gt; { ... }</span>
<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">fetchPosts</span> = (<span class="hljs-params"></span>) =&gt; <span class="hljs-title function_">async</span> (dispatch) =&gt; {
  <span class="hljs-title function_">dispatch</span>({ <span class="hljs-attr">type</span>: <span class="hljs-string">&#x27;posts/loading&#x27;</span> });
  <span class="hljs-keyword">try</span> {
    <span class="hljs-keyword">const</span> res = <span class="hljs-keyword">await</span> axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;https://jsonplaceholder.typicode.com/posts&#x27;</span>);
    <span class="hljs-title function_">dispatch</span>({ <span class="hljs-attr">type</span>: <span class="hljs-string">&#x27;posts/success&#x27;</span>, <span class="hljs-attr">payload</span>: res.<span class="hljs-property">data</span> });
  } <span class="hljs-keyword">catch</span> (e) {
    <span class="hljs-title function_">dispatch</span>({ <span class="hljs-attr">type</span>: <span class="hljs-string">&#x27;posts/error&#x27;</span>, <span class="hljs-attr">payload</span>: e.<span class="hljs-property">message</span> });
  }
};

<span class="hljs-comment">// một logger middleware</span>
<span class="hljs-keyword">const</span> <span class="hljs-title function_">logger</span> = (<span class="hljs-params">store</span>) =&gt; <span class="hljs-function">(<span class="hljs-params">next</span>) =&gt;</span> <span class="hljs-function">(<span class="hljs-params">action</span>) =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;dispatching&#x27;</span>, action);
  <span class="hljs-keyword">const</span> result = <span class="hljs-title function_">next</span>(action);
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;next state&#x27;</span>, store.<span class="hljs-title function_">getState</span>());
  <span class="hljs-keyword">return</span> result;
};

<span class="hljs-comment">// thêm nó (thunk đã bật sẵn trong Toolkit)</span>
<span class="hljs-title function_">configureStore</span>({
  reducer,
  <span class="hljs-attr">middleware</span>: <span class="hljs-function">(<span class="hljs-params">getDefault</span>) =&gt;</span> <span class="hljs-title function_">getDefault</span>().<span class="hljs-title function_">concat</span>(logger),
});</pre>
<div class="out"><b>Kết quả:</b> dispatch <code>fetchPosts()</code> chạy luồng async (loading → success/error); logger in mọi action và state kết quả — Redux DevTools cho thấy lịch sử "time-travel" tương tự.</div>
<div class="pitfall"><b>Bẫy:</b> thunk là một action creator <em>trả về một hàm</em> — dispatch bằng <code>dispatch(fetchPosts())</code>, không phải <code>dispatch(fetchPosts)</code>. Middleware thunk phải được bật (Redux Toolkit bật mặc định).</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Viết một thunk</span><span class="lc-sub">async + logger — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

export default [SLIDES, EX24, EX25];
