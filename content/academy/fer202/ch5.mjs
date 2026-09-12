/**
 * FER202 · Chapter 5 additions — React Component (Slot 6, 22 slides) and
 * Validating Component Properties / PropTypes (Slot 13, 21 slides), plus
 * Exercises 9, 11 (React Component) and 19 (PropTypes). Grounded slide-by-slide
 * in Slot6_React-Component.pptx and Slot13_Validating-Component-Properties.pptx.
 * Spliced into Chapter 5 before its quiz; existing 5.1 / 5.2 lessons untouched.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const CODELAB = `/code-lab/react${REF}`;

/* ═══════════ 5.3 — Slide walkthrough: React Component (Slot 6) ═══════════ */
const COMPONENT = {
  title: '5.3 — Slide by slide: All about Components (Slot 6)|||5.3 — Học theo từng slide: Tất cả về Component (Slot 6)',
  slug: 'fer202-5-3-slot6-component-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 22 slide Slot 6: component là gì, tầm quan trọng, class component & vòng đời (mount/update/unmount), functional component + useEffect thay lifecycle, quy ước tên, Higher-Order Component, và component composition — kèm code song ngữ.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 5 · Lesson 5.3 · Slot 6 deck (22 slides)</span>
<h2>All about Components, slide by slide</h2>
<p class="lead">Components are the building blocks of every React app. This deck covers both styles — <strong>class</strong> (with lifecycle methods) and <strong>function</strong> (with Hooks) — plus two reuse patterns: Higher-Order Components and composition. Exercises 9 and 11 follow.</p>`,
      `<span class="eyebrow">Chương 5 · Bài 5.3 · Bộ slide Slot 6 (22 slide)</span>
<h2>Tất cả về Component, theo từng slide</h2>
<p class="lead">Component là viên gạch của mọi app React. Bộ slide này dạy cả hai kiểu — <strong>class</strong> (với lifecycle) và <strong>function</strong> (với Hooks) — cùng hai mẫu tái sử dụng: Higher-Order Component và composition. Exercise 9 và 11 nằm ngay sau.</p>`,
    ),
    walkHead('slot6', 1, 22),
    walk('slot6', [
      [1, 'All about Components', `<p>Title slide.</p>`, `<p>Slide bìa.</p>`],
      [2, 'Objectives', `<p>The map: describe a component, class components, lifecycle in class components, functional components, higher-order components, and component composition.</p>`, `<p>Bản đồ: mô tả component, class component, vòng đời class component, functional component, higher-order component, và component composition.</p>`],
      [3, 'What is a component?', `<p><strong>A component is a function or a JavaScript class</strong> that optionally accepts data (props) and returns a React element describing part of the UI. A React UI is a <strong>hierarchy of components</strong> building up to one <em>root component</em> rendered in the browser.</p>`, `<p><strong>Component là một hàm hoặc một class JavaScript</strong> nhận dữ liệu (props) tuỳ chọn và trả về một React element mô tả một phần UI. UI React là một <strong>cây phân cấp component</strong> gộp lên tới một <em>component gốc</em> được render trong trình duyệt.</p>`],
      [4, 'What is a component? — cont’d', `<p>The diagram shows the tree: a root component contains children, which contain their own children. You compose the whole page from small named pieces — the same idea as JSX nesting (Chapter 3).</p>`, `<p>Sơ đồ cho thấy cái cây: component gốc chứa các con, mỗi con lại chứa con của nó. Bạn ghép cả trang từ những mảnh nhỏ có tên — cùng ý với lồng JSX (Chương 3).</p>`],
      [5, 'Importance of components', `<p>Five reasons: <strong>Reusability</strong> (write once, use many), <strong>Encapsulation</strong> (each owns its markup/logic), <strong>Composition</strong> (combine small into big), <strong>Unidirectional data flow</strong> (data flows down via props) and <strong>Efficiency</strong> (React re-renders only what changed).</p>`, `<p>Năm lý do: <strong>Tái sử dụng</strong> (viết một lần, dùng nhiều), <strong>Đóng gói</strong> (mỗi cái tự giữ markup/logic), <strong>Kết hợp</strong> (ghép nhỏ thành lớn), <strong>Luồng dữ liệu một chiều</strong> (dữ liệu chảy xuống qua props) và <strong>Hiệu quả</strong> (React chỉ render lại phần đổi).</p>`],
      [6, 'Class components (stateful)', `<p>Class components extend <code>React.Component</code> and can manage <strong>state</strong> and <strong>lifecycle methods</strong>. Example: <code>class Welcome extends React.Component { render() { return &lt;h1&gt;Hello, {this.props.name}&lt;/h1&gt;; } }</code>. Use them where you need lifecycle hooks — though modern React prefers functions + Hooks.</p>`, `<p>Class component kế thừa <code>React.Component</code> và quản lý được <strong>state</strong> cùng <strong>lifecycle</strong>. Ví dụ: <code>class Welcome extends React.Component { render() { return &lt;h1&gt;Hello, {this.props.name}&lt;/h1&gt;; } }</code>. Dùng khi cần lifecycle — dù React hiện đại chuộng function + Hooks.</p>`],
      [7, 'Lifecycle in class components', `<p>Lifecycle methods run automatically as a component mounts, updates and unmounts. The key ones: <code>constructor(props)</code>, <code>componentDidMount()</code>, <code>componentDidUpdate(prevProps, prevState)</code>, <code>componentWillUnmount()</code>.</p>`, `<p>Lifecycle chạy tự động khi component mount, update và unmount. Các method chính: <code>constructor(props)</code>, <code>componentDidMount()</code>, <code>componentDidUpdate(prevProps, prevState)</code>, <code>componentWillUnmount()</code>.</p>`],
      [8, 'Lifecycle diagram', `<p>The classic React lifecycle diagram (image) — three phases along a timeline: <strong>Mounting</strong>, <strong>Updating</strong>, <strong>Unmounting</strong>, with each method placed where it fires. Bookmark it; the next three slides walk each phase.</p>`, `<p>Sơ đồ lifecycle React kinh điển (ảnh) — ba pha theo dòng thời gian: <strong>Mounting</strong>, <strong>Updating</strong>, <strong>Unmounting</strong>, mỗi method đặt đúng chỗ nó chạy. Ghi nhớ nó; ba slide sau đi qua từng pha.</p>`],
      [9, 'Mounting lifecycle methods', `<p>When an instance is created and inserted into the DOM: <code>constructor()</code> → <code>getDerivedStateFromProps()</code> → <code>render()</code> → <code>componentDidMount()</code>. (<code>componentWillMount()</code> is deprecated.) <code>componentDidMount</code> is where you fetch data or start subscriptions.</p>`, `<p>Khi instance được tạo và chèn vào DOM: <code>constructor()</code> → <code>getDerivedStateFromProps()</code> → <code>render()</code> → <code>componentDidMount()</code>. (<code>componentWillMount()</code> đã lỗi thời.) <code>componentDidMount</code> là nơi lấy dữ liệu hoặc bắt đầu subscription.</p>`],
      [10, 'Updating lifecycle methods', `<p>On a re-render (props or state changed): <code>getDerivedStateFromProps()</code> → <code>shouldComponentUpdate()</code> → <code>render()</code> → <code>getSnapshotBeforeUpdate()</code> → <code>componentDidUpdate()</code>. (<code>componentWillReceiveProps</code>/<code>componentWillUpdate</code> deprecated.) <code>shouldComponentUpdate</code> lets you skip needless renders.</p>`, `<p>Khi re-render (props hoặc state đổi): <code>getDerivedStateFromProps()</code> → <code>shouldComponentUpdate()</code> → <code>render()</code> → <code>getSnapshotBeforeUpdate()</code> → <code>componentDidUpdate()</code>. (<code>componentWillReceiveProps</code>/<code>componentWillUpdate</code> lỗi thời.) <code>shouldComponentUpdate</code> cho phép bỏ render thừa.</p>`],
      [11, 'Unmounting & error handling', `<p><code>componentWillUnmount()</code> runs just before the component is removed — clean up timers/subscriptions here. <code>componentDidCatch()</code> handles an error thrown during rendering/lifecycle of any child (an "error boundary").</p>`, `<p><code>componentWillUnmount()</code> chạy ngay trước khi component bị gỡ — dọn timer/subscription ở đây. <code>componentDidCatch()</code> xử lý lỗi ném ra khi render/lifecycle của bất kỳ con nào ("error boundary").</p>`],
      [12, 'A full class component example', `<p>A counter class: <code>constructor</code> sets <code>this.state = { count: 0 }</code>; <code>componentDidMount</code>/<code>componentDidUpdate</code>/<code>componentWillUnmount</code> log; handlers call <code>this.setState(prev =&gt; ({ count: prev.count + 1 }))</code>. Note the <strong>functional setState</strong> form — always use it when the new state depends on the old.</p>`, `<p>Một class đếm: <code>constructor</code> đặt <code>this.state = { count: 0 }</code>; <code>componentDidMount</code>/<code>componentDidUpdate</code>/<code>componentWillUnmount</code> log; handler gọi <code>this.setState(prev =&gt; ({ count: prev.count + 1 }))</code>. Chú ý dạng <strong>setState hàm</strong> — luôn dùng khi state mới phụ thuộc state cũ.</p>`],
      [13, 'Functional components (stateless) + Hooks', `<p>A function component is just a function that returns JSX: <code>function Welcome(props) { return &lt;h1&gt;Hello, {props.name}&lt;/h1&gt;; }</code>. With <strong>Hooks</strong> it can use state, lifecycle and context too — less code, simpler. This is the modern default (Chapter 8 is all Hooks).</p>`, `<p>Function component chỉ là một hàm trả về JSX: <code>function Welcome(props) { return &lt;h1&gt;Hello, {props.name}&lt;/h1&gt;; }</code>. Với <strong>Hooks</strong> nó dùng được state, lifecycle và context — ít code, đơn giản hơn. Đây là mặc định hiện đại (Chương 8 chuyên về Hooks).</p>`],
      [14, 'Effects in function components', `<p>The <code>useEffect</code> Hook replaces <code>componentDidMount</code> + <code>componentDidUpdate</code> + <code>componentWillUnmount</code> in one API. It runs after every render by default and takes two arguments: a function with your side-effect, and an optional <strong>dependency array</strong>.</p>`, `<p>Hook <code>useEffect</code> thay cho <code>componentDidMount</code> + <code>componentDidUpdate</code> + <code>componentWillUnmount</code> trong một API. Mặc định chạy sau mỗi render, nhận hai đối số: một hàm chứa side-effect, và một <strong>mảng phụ thuộc</strong> tuỳ chọn.</p>`],
      [15, 'useEffect example', `<p>A counter with <code>useEffect(() =&gt; { … return () =&gt; {…}; }, [count])</code>: the body runs after render, the returned <strong>cleanup</strong> runs before the next effect/unmount, and <code>[count]</code> means "re-run only when count changes". Empty <code>[]</code> = run once (like <code>componentDidMount</code>).</p>`, `<p>Một counter với <code>useEffect(() =&gt; { … return () =&gt; {…}; }, [count])</code>: thân chạy sau render, hàm <strong>cleanup</strong> trả về chạy trước effect kế/unmount, và <code>[count]</code> nghĩa "chỉ chạy lại khi count đổi". <code>[]</code> rỗng = chạy một lần (như <code>componentDidMount</code>).</p>`],
      [16, 'Component conventions', `<p>The naming rule again: user-defined components <strong>must start with a capital letter</strong> (<code>HeaderComponent</code>) — these compile to <code>React.createElement(...)</code>. Lowercase tags are treated as built-in DOM tags. Getting this wrong silently renders the wrong thing.</p>`, `<p>Quy tắc đặt tên (nhắc lại): component tự định nghĩa <strong>phải bắt đầu bằng chữ hoa</strong> (<code>HeaderComponent</code>) — chúng biên dịch thành <code>React.createElement(...)</code>. Thẻ chữ thường bị coi là thẻ DOM dựng sẵn. Sai điều này thì render nhầm mà không báo lỗi.</p>`],
      [17, 'Higher-Order Components (HOC)', `<p>A <strong>HOC</strong> is a function that takes a component and returns a new, enhanced component — a way to <em>reuse logic</em> across components. It can modify props, change rendering, abstract state, or wrap with context/theme.</p>`, `<p><strong>HOC</strong> là một hàm nhận vào một component và trả về một component mới, được tăng cường — cách <em>tái sử dụng logic</em> giữa các component. Nó có thể sửa props, đổi render, trừu tượng hoá state, hoặc bọc với context/theme.</p>`],
      [18, 'HOC — example', `<p><code>function withExtraProp(Wrapped) { return (props) =&gt; &lt;Wrapped {...props} extraProp="..." /&gt;; }</code>. Wrapping <code>MyComponent</code> gives <code>EnhancedComponent</code> that renders with the extra prop injected. (Modern React often uses custom Hooks instead of HOCs for the same goal.)</p>`, `<p><code>function withExtraProp(Wrapped) { return (props) =&gt; &lt;Wrapped {...props} extraProp="..." /&gt;; }</code>. Bọc <code>MyComponent</code> ra <code>EnhancedComponent</code> render kèm prop được tiêm thêm. (React hiện đại thường dùng custom Hook thay HOC cho cùng mục tiêu.)</p>`],
      [19, 'Component composition', `<p>The natural React pattern: assemble complex UIs by piecing small, reusable components together like Lego. Benefits: reusability, separation of concerns, testability. Prefer composition over inheritance in React.</p>`, `<p>Mẫu tự nhiên của React: lắp UI phức tạp bằng cách ghép các component nhỏ, tái dùng như Lego. Lợi ích: tái sử dụng, tách bạch trách nhiệm, dễ test. Trong React, ưu tiên composition hơn kế thừa.</p>`],
      [20, 'Composition — example', `<p><code>App</code> renders <code>&lt;Header /&gt;</code>, <code>&lt;MainContent /&gt;</code>, <code>&lt;Footer /&gt;</code>; <code>MainContent</code> renders two <code>&lt;Article /&gt;</code>s. Each is a tiny focused function. This is exactly the tree from slide 3–4, in code.</p>`, `<p><code>App</code> render <code>&lt;Header /&gt;</code>, <code>&lt;MainContent /&gt;</code>, <code>&lt;Footer /&gt;</code>; <code>MainContent</code> render hai <code>&lt;Article /&gt;</code>. Mỗi cái là một hàm nhỏ, tập trung. Đây đúng là cái cây ở slide 3–4, bằng code.</p>`],
      [21, 'Exercise 9: React Component 1', `<p>Hand-off to <strong>Exercise 9</strong> — build your first components (profile, Hello World, counter, SimpleCard). Full brief in the next lesson.</p>`, `<p>Chuyển sang <strong>Exercise 9</strong> — dựng các component đầu tiên (profile, Hello World, counter, SimpleCard). Đề đầy đủ ở bài kế.</p>`],
      [22, 'Summary', `<p>Recap: components (function or class) form a tree; class components have lifecycle methods across mount/update/unmount; function components use <code>useEffect</code> instead; capitalise component names; reuse logic with HOCs; build UIs by composition.</p>`, `<p>Tóm tắt: component (hàm hoặc class) tạo thành cây; class component có lifecycle qua mount/update/unmount; function component dùng <code>useEffect</code> thay thế; viết hoa tên component; tái dùng logic bằng HOC; dựng UI bằng composition.</p>`],
    ]),
    books([
      ['reactdoc', '“Your First Component”, “Passing Props”, and “Lifecycle of Reactive Effects”', '“Your First Component”, “Passing Props”, và “Lifecycle of Reactive Effects”'],
    ]),
  ].join('\n'),
};

/* ═══════════ Exercises 9 & 11 ═══════════ */
const EX9 = {
  title: 'Exercise 9 — React Component 1|||Exercise 9 — React Component 1',
  slug: 'fer202-5-ex9-component-1',
  type: 'EXERCISE',
  description: 'Dựng các component đầu tiên: profile, Hello World, counter (increment/decrement), và SimpleCard (Title/Description/Image tách nhỏ nhận props).',
  content: bi(
    `<span class="eyebrow">Chapter 5 · Exercise 9 · Slot 6 slide 21</span>
<h2>React Component — first builds</h2>
<p class="lead"><b>Goal:</b> practise creating and composing components, and passing props. Do these in order — each is a step up.</p>
<ol>
  <li>A component that displays your name and a short message about yourself.</li>
  <li>A component that renders <code>Hello, World!</code>.</li>
  <li>A <strong>counter</strong> with increment/decrement buttons (use <code>useState</code>).</li>
  <li>A <strong>SimpleCard</strong> — the classic Facebook/Tweet card. Build the leaf components first, then compose:</li>
</ol>
<pre><span class="hljs-keyword">function</span> <span class="hljs-title function_">Title</span>(<span class="hljs-params">{ text }</span>)       { <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">h3</span>&gt;</span>{text}<span class="hljs-tag">&lt;/<span class="hljs-name">h3</span>&gt;</span></span>; }
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Description</span>(<span class="hljs-params">{ text }</span>) { <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{text}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>; }
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Image</span>(<span class="hljs-params">{ url }</span>)        { <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">img</span> <span class="hljs-attr">src</span>=<span class="hljs-string">{url}</span> <span class="hljs-attr">alt</span>=<span class="hljs-string">&quot;&quot;</span> <span class="hljs-attr">width</span>=<span class="hljs-string">{120}</span> /&gt;</span></span>; }

<span class="hljs-keyword">function</span> <span class="hljs-title function_">SimpleCard</span>(<span class="hljs-params">{ item }</span>) {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card p-3&quot;</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Image</span> <span class="hljs-attr">url</span>=<span class="hljs-string">{item.imageUrl}</span> /&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Title</span> <span class="hljs-attr">text</span>=<span class="hljs-string">{item.title}</span> /&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Description</span> <span class="hljs-attr">text</span>=<span class="hljs-string">{item.description}</span> /&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  );
}
<span class="hljs-comment">// item = { title, description, imageUrl }</span></pre>
<div class="callout"><span class="badge">★ Technique from the brief</span> Start at the <strong>leaf nodes</strong> (Title, Description, Image) and work up to the wrapper (SimpleCard). Decide each component's props first — this "props-down" thinking is the core skill the exercise trains.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Build these components</span><span class="lc-sub">Counter &amp; SimpleCard — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 5 · Exercise 9 · Slot 6 slide 21</span>
<h2>React Component — những bài đầu</h2>
<p class="lead"><b>Mục tiêu:</b> luyện tạo và ghép component, truyền props. Làm theo thứ tự — mỗi bài khó hơn một bậc.</p>
<ol>
  <li>Component hiển thị tên bạn và một lời giới thiệu ngắn.</li>
  <li>Component render <code>Hello, World!</code>.</li>
  <li>Một <strong>counter</strong> có nút tăng/giảm (dùng <code>useState</code>).</li>
  <li>Một <strong>SimpleCard</strong> — thẻ kiểu Facebook/Tweet. Dựng component lá trước, rồi ghép:</li>
</ol>
<pre><span class="hljs-keyword">function</span> <span class="hljs-title function_">Title</span>(<span class="hljs-params">{ text }</span>)       { <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">h3</span>&gt;</span>{text}<span class="hljs-tag">&lt;/<span class="hljs-name">h3</span>&gt;</span></span>; }
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Description</span>(<span class="hljs-params">{ text }</span>) { <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{text}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>; }
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Image</span>(<span class="hljs-params">{ url }</span>)        { <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">img</span> <span class="hljs-attr">src</span>=<span class="hljs-string">{url}</span> <span class="hljs-attr">alt</span>=<span class="hljs-string">&quot;&quot;</span> <span class="hljs-attr">width</span>=<span class="hljs-string">{120}</span> /&gt;</span></span>; }

<span class="hljs-keyword">function</span> <span class="hljs-title function_">SimpleCard</span>(<span class="hljs-params">{ item }</span>) {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card p-3&quot;</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Image</span> <span class="hljs-attr">url</span>=<span class="hljs-string">{item.imageUrl}</span> /&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Title</span> <span class="hljs-attr">text</span>=<span class="hljs-string">{item.title}</span> /&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Description</span> <span class="hljs-attr">text</span>=<span class="hljs-string">{item.description}</span> /&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  );
}
<span class="hljs-comment">// item = { title, description, imageUrl }</span></pre>
<div class="callout"><span class="badge">★ Kỹ thuật từ đề</span> Bắt đầu từ <strong>node lá</strong> (Title, Description, Image) rồi đi lên wrapper (SimpleCard). Xác định props của từng component trước — lối nghĩ "props chảy xuống" này là kỹ năng cốt lõi bài rèn.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Dựng các component này</span><span class="lc-sub">Counter &amp; SimpleCard — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

const EX11 = {
  title: 'Exercise 11 — React Component 2 (to-do, calculator, search filter)|||Exercise 11 — React Component 2 (to-do, máy tính, lọc tìm kiếm)',
  slug: 'fer202-5-ex11-component-2',
  type: 'EXERCISE',
  description: 'Nâng cấp: to-do list (thêm/xoá), máy tính bốn phép, và search filter bằng state + Array.filter — các bài kinh điển rèn state + render danh sách.',
  content: bi(
    `<span class="eyebrow">Chapter 5 · Exercise 11 · builds on Slot 6</span>
<h2>React Component — interactive builds</h2>
<p class="lead"><b>Goal:</b> combine state, events and list rendering in three classic apps.</p>
<ol>
  <li><strong>To-do list</strong> with add and delete. Keep an array in state; add with <code>setTodos([...todos, newItem])</code>, delete with <code>setTodos(todos.filter(t =&gt; t.id !== id))</code>. Render with <code>.map()</code> + <code>key</code>.</li>
  <li><strong>Calculator</strong> for +, −, ×, ÷. Two number inputs + operator; compute on submit. Guard division by zero.</li>
  <li><strong>Search filter</strong> — the brief's hint spelled out:</li>
</ol>
<pre><span class="hljs-keyword">function</span> <span class="hljs-title function_">SearchList</span>(<span class="hljs-params">{ items }</span>) {
  <span class="hljs-keyword">const</span> [q, setQ] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>);
  <span class="hljs-keyword">const</span> shown = items.<span class="hljs-title function_">filter</span>(<span class="hljs-function"><span class="hljs-params">it</span> =&gt;</span>
    it.<span class="hljs-property">name</span>.<span class="hljs-title function_">toLowerCase</span>().<span class="hljs-title function_">includes</span>(q.<span class="hljs-title function_">toLowerCase</span>()));
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">value</span>=<span class="hljs-string">{q}</span> <span class="hljs-attr">onChange</span>=<span class="hljs-string">{e</span> =&gt;</span> setQ(e.target.value)}
             placeholder=&quot;Search…&quot; /&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>{shown.map(it =&gt; <span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{it.id}</span>&gt;</span>{it.name}<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>)}<span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  );
}</pre>
<div class="out"><b>Result:</b> typing filters the list live — derive the filtered array during render from state + props; never store <code>shown</code> in its own state (it would go stale).</div>
<div class="pitfall"><b>Trap:</b> for the to-do delete, filter by a stable <code>id</code>, not the array index — deleting by index breaks when the list reorders (see the key rule in Chapter 3).</div>`,
    `<span class="eyebrow">Chương 5 · Exercise 11 · nối tiếp Slot 6</span>
<h2>React Component — bài tương tác</h2>
<p class="lead"><b>Mục tiêu:</b> kết hợp state, sự kiện và render danh sách trong ba app kinh điển.</p>
<ol>
  <li><strong>To-do list</strong> thêm và xoá. Giữ một mảng trong state; thêm bằng <code>setTodos([...todos, newItem])</code>, xoá bằng <code>setTodos(todos.filter(t =&gt; t.id !== id))</code>. Render bằng <code>.map()</code> + <code>key</code>.</li>
  <li><strong>Máy tính</strong> +, −, ×, ÷. Hai ô số + toán tử; tính khi submit. Chặn chia cho 0.</li>
  <li><strong>Search filter</strong> — gợi ý của đề viết rõ:</li>
</ol>
<pre><span class="hljs-keyword">function</span> <span class="hljs-title function_">SearchList</span>(<span class="hljs-params">{ items }</span>) {
  <span class="hljs-keyword">const</span> [q, setQ] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>);
  <span class="hljs-keyword">const</span> shown = items.<span class="hljs-title function_">filter</span>(<span class="hljs-function"><span class="hljs-params">it</span> =&gt;</span>
    it.<span class="hljs-property">name</span>.<span class="hljs-title function_">toLowerCase</span>().<span class="hljs-title function_">includes</span>(q.<span class="hljs-title function_">toLowerCase</span>()));
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">value</span>=<span class="hljs-string">{q}</span> <span class="hljs-attr">onChange</span>=<span class="hljs-string">{e</span> =&gt;</span> setQ(e.target.value)}
             placeholder=&quot;Tìm…&quot; /&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>{shown.map(it =&gt; <span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{it.id}</span>&gt;</span>{it.name}<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>)}<span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  );
}</pre>
<div class="out"><b>Kết quả:</b> gõ tới đâu lọc tới đó — suy ra mảng đã lọc ngay lúc render từ state + props; đừng lưu <code>shown</code> vào state riêng (sẽ bị cũ).</div>
<div class="pitfall"><b>Bẫy:</b> khi xoá to-do, lọc theo <code>id</code> ổn định, không theo chỉ số mảng — xoá theo index sẽ sai khi danh sách sắp lại (xem quy tắc key ở Chương 3).</div>`,
  ),
};

/* ═══════════ 5.4 — Slide walkthrough: Validating Props / PropTypes (Slot 13) ═══════════ */
const PROPTYPES = {
  title: '5.4 — Slide by slide: Validating component properties / PropTypes (Slot 13)|||5.4 — Học theo từng slide: Kiểm tra props / PropTypes (Slot 13)',
  slug: 'fer202-5-4-slot13-proptypes-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 21 slide Slot 13: PropTypes là gì, cài & dùng prop-types, các validator kiểu cơ bản, isRequired, các kiểu có thể render, yêu cầu kiểu/giá trị cụ thể (oneOf, shape, arrayOf), và viết custom validator — kèm code.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 5 · Lesson 5.4 · Slot 13 deck (21 slides)</span>
<h2>Validating props with PropTypes, slide by slide</h2>
<p class="lead">Props are how data flows into a component — but nothing stops a caller passing the wrong type. <strong>PropTypes</strong> declares what each prop should be and warns in the console when it is wrong. It documents your component and catches bugs early. Exercise 19 follows.</p>`,
      `<span class="eyebrow">Chương 5 · Bài 5.4 · Bộ slide Slot 13 (21 slide)</span>
<h2>Kiểm tra props bằng PropTypes, theo từng slide</h2>
<p class="lead">Props là cách dữ liệu chảy vào component — nhưng không gì ngăn người gọi truyền sai kiểu. <strong>PropTypes</strong> khai báo mỗi prop nên là gì và cảnh báo ở console khi sai. Nó vừa làm tài liệu vừa bắt lỗi sớm. Exercise 19 nằm ngay sau.</p>`,
    ),
    walkHead('slot13', 1, 21),
    walk('slot13', [
      [1, 'Validating component properties', `<p>Title slide.</p>`, `<p>Slide bìa.</p>`],
      [2, 'Objectives', `<p>The map: what PropTypes are, how to use them, basic type validators, requiring values, renderable types, requiring specific types/values, and custom validators.</p>`, `<p>Bản đồ: PropTypes là gì, cách dùng, validator kiểu cơ bản, yêu cầu giá trị, kiểu render được, yêu cầu kiểu/giá trị cụ thể, và custom validator.</p>`],
      [3, 'What are PropTypes?', `<p>A mechanism that <strong>checks a passed prop is of the correct data type</strong>, so you get a clear console warning instead of a confusing error later. Provided by the <code>prop-types</code> package; works in both class and function components.</p>`, `<p>Cơ chế <strong>kiểm tra prop truyền vào đúng kiểu dữ liệu</strong>, để bạn nhận cảnh báo rõ ở console thay vì một lỗi khó hiểu về sau. Do gói <code>prop-types</code> cung cấp; dùng được cho cả class và function component.</p>`],
      [4, 'How to use PropTypes', `<p>Install <code>npm install prop-types</code>, <code>import PropTypes from 'prop-types'</code>, then attach a <code>.propTypes</code> object to the component: keys are prop names, values are validators. (Class components can also use a <code>static propTypes</code> field.) Invalid props log a console warning.</p>`, `<p>Cài <code>npm install prop-types</code>, <code>import PropTypes from 'prop-types'</code>, rồi gắn một object <code>.propTypes</code> vào component: key là tên prop, value là validator. (Class component có thể dùng field <code>static propTypes</code>.) Prop sai sẽ log cảnh báo ở console.</p>`],
      [5, 'A worked example', `<p>An <code>App</code> passes <code>count</code>, <code>increment</code>, <code>decrement</code> to <code>&lt;Count&gt;</code>; <code>Count.propTypes = { count: PropTypes.number.isRequired, increment: PropTypes.func.isRequired, decrement: PropTypes.func.isRequired }</code>. Pass a string for <code>count</code> and the console warns immediately.</p>`, `<p>Một <code>App</code> truyền <code>count</code>, <code>increment</code>, <code>decrement</code> cho <code>&lt;Count&gt;</code>; <code>Count.propTypes = { count: PropTypes.number.isRequired, increment: PropTypes.func.isRequired, decrement: PropTypes.func.isRequired }</code>. Truyền chuỗi cho <code>count</code> là console cảnh báo ngay.</p>`],
      [6, 'Knowing what to expect', `<p>PropTypes double as <strong>documentation</strong>: reading a component's <code>propTypes</code> tells the next developer exactly what data it needs and of what shape — before they read the body.</p>`, `<p>PropTypes còn là <strong>tài liệu</strong>: đọc <code>propTypes</code> của một component là biết ngay nó cần dữ liệu gì, hình dạng ra sao — trước khi đọc thân component.</p>`],
      [7, 'Simple property validators', `<p>The pattern is always <code>PropTypes.&lt;type&gt;</code>, optionally <code>.isRequired</code>. Without <code>.isRequired</code> the prop is optional and may be omitted.</p>`, `<p>Mẫu luôn là <code>PropTypes.&lt;type&gt;</code>, tuỳ chọn thêm <code>.isRequired</code>. Không có <code>.isRequired</code> thì prop là tuỳ chọn, có thể bỏ trống.</p>`],
      [8, 'Basic types of PropTypes', `<p>The primitives: <code>string</code>, <code>number</code>, <code>bool</code>, <code>func</code>, <code>array</code>, <code>object</code>, <code>symbol</code>. These cover most props you declare.</p>`, `<p>Các kiểu cơ bản: <code>string</code>, <code>number</code>, <code>bool</code>, <code>func</code>, <code>array</code>, <code>object</code>, <code>symbol</code>. Chúng bao phủ đa số prop bạn khai.</p>`],
      [9, 'Basic type validation', `<p>Example: <code>name: PropTypes.string</code>, <code>age: PropTypes.number</code>, <code>isActive: PropTypes.bool</code>, <code>onClick: PropTypes.func</code>. React checks each on render in development.</p>`, `<p>Ví dụ: <code>name: PropTypes.string</code>, <code>age: PropTypes.number</code>, <code>isActive: PropTypes.bool</code>, <code>onClick: PropTypes.func</code>. React kiểm từng cái khi render, ở chế độ development.</p>`],
      [10, 'Basic type validation — cont’d', `<p>Collections: <code>PropTypes.array</code>, <code>PropTypes.object</code>. These check the container type only — to check the elements, use <code>arrayOf</code>/<code>shape</code> (slides 16–17).</p>`, `<p>Kiểu tập hợp: <code>PropTypes.array</code>, <code>PropTypes.object</code>. Chúng chỉ kiểm kiểu vỏ — muốn kiểm phần tử bên trong, dùng <code>arrayOf</code>/<code>shape</code> (slide 16–17).</p>`],
      [11, 'Requiring values', `<p>Append <code>.isRequired</code> to any validator: <code>PropTypes.string.isRequired</code>. If the prop is missing, React warns — use it for props the component cannot work without.</p>`, `<p>Thêm <code>.isRequired</code> vào bất kỳ validator nào: <code>PropTypes.string.isRequired</code>. Nếu thiếu prop, React cảnh báo — dùng cho prop mà không có thì component không chạy được.</p>`],
      [12, 'Any property value', `<p><code>PropTypes.any</code> accepts anything; with <code>.isRequired</code> it only checks that <em>something</em> was passed. Use sparingly — it turns off type checking for that prop.</p>`, `<p><code>PropTypes.any</code> nhận mọi thứ; kèm <code>.isRequired</code> chỉ kiểm rằng <em>có</em> truyền gì đó. Dùng hạn chế — nó tắt kiểm kiểu cho prop đó.</p>`],
      [13, 'Type and value validators', `<p>Beyond primitives, PropTypes offers validators for renderable content, specific instances, enums and shapes — the next slides. This is where PropTypes gets genuinely useful.</p>`, `<p>Ngoài kiểu nguyên thuỷ, PropTypes có validator cho nội dung render được, instance cụ thể, enum và shape — các slide sau. Đây là chỗ PropTypes thực sự hữu ích.</p>`],
      [14, 'Things that can be rendered', `<p><code>PropTypes.node</code> = anything React can render (number, string, element, or an array of those). <code>PropTypes.element</code> = a single React element. Use <code>node</code> for a <code>children</code> prop.</p>`, `<p><code>PropTypes.node</code> = bất cứ thứ gì React render được (số, chuỗi, element, hoặc mảng các thứ đó). <code>PropTypes.element</code> = một React element đơn. Dùng <code>node</code> cho prop <code>children</code>.</p>`],
      [15, 'Things that can be rendered — cont’d', `<p>Example: <code>children: PropTypes.node</code>, <code>icon: PropTypes.element</code>. This validates that what you plan to render is actually renderable.</p>`, `<p>Ví dụ: <code>children: PropTypes.node</code>, <code>icon: PropTypes.element</code>. Nó kiểm rằng thứ bạn định render thật sự render được.</p>`],
      [16, 'Requiring specific types', `<p><code>PropTypes.instanceOf(Class)</code> requires an instance of a class (e.g. <code>Date</code>). <code>PropTypes.arrayOf(PropTypes.number)</code> requires an array whose elements are all numbers.</p>`, `<p><code>PropTypes.instanceOf(Class)</code> yêu cầu một instance của một class (ví dụ <code>Date</code>). <code>PropTypes.arrayOf(PropTypes.number)</code> yêu cầu một mảng mà mọi phần tử đều là số.</p>`],
      [17, 'Requiring specific types — shape', `<p><code>PropTypes.shape({ name: PropTypes.string, age: PropTypes.number })</code> requires an object with those fields of those types. <code>objectOf</code> checks an object whose <em>values</em> all match one validator. <code>shape</code> is how you validate a structured prop.</p>`, `<p><code>PropTypes.shape({ name: PropTypes.string, age: PropTypes.number })</code> yêu cầu một object có các field đó với kiểu đó. <code>objectOf</code> kiểm một object mà mọi <em>giá trị</em> khớp một validator. <code>shape</code> là cách kiểm một prop có cấu trúc.</p>`],
      [18, 'Requiring specific values — oneOf', `<p><code>PropTypes.oneOf(['small', 'medium', 'large'])</code> restricts a prop to an enum of exact values; <code>PropTypes.oneOfType([...])</code> allows any of several validators. Perfect for a <code>variant</code> or <code>size</code> prop.</p>`, `<p><code>PropTypes.oneOf(['small', 'medium', 'large'])</code> giới hạn prop vào một enum các giá trị chính xác; <code>PropTypes.oneOfType([...])</code> cho phép một trong nhiều validator. Rất hợp cho prop <code>variant</code> hay <code>size</code>.</p>`],
      [19, 'Writing custom property validators', `<p>When the built-ins are not enough, pass a function <code>(props, propName, componentName) =&gt; { … return new Error('...'); }</code> — return an <code>Error</code> to signal invalid. Example: validate an email string or a positive number.</p>`, `<p>Khi validator sẵn không đủ, truyền một hàm <code>(props, propName, componentName) =&gt; { … return new Error('...'); }</code> — trả về một <code>Error</code> để báo không hợp lệ. Ví dụ: kiểm chuỗi email hoặc một số dương.</p>`],
      [20, 'Exercise 19: Validation in a component', `<p>Hand-off to <strong>Exercise 19</strong> — build an <code>Animal</code> component with typed props (string, number, arrayOf, shape) and reuse it over an array of data. Full brief in the next lesson.</p>`, `<p>Chuyển sang <strong>Exercise 19</strong> — dựng component <code>Animal</code> với props có kiểu (string, number, arrayOf, shape) và tái dùng trên một mảng dữ liệu. Đề đầy đủ ở bài kế.</p>`],
      [21, 'Summary', `<p>Recap: PropTypes validate and document props; install <code>prop-types</code>, attach a <code>.propTypes</code> object; use basic types + <code>.isRequired</code>, <code>node</code>/<code>element</code> for renderables, <code>arrayOf</code>/<code>shape</code>/<code>oneOf</code> for structured/enumerated props, and custom functions for the rest.</p>`, `<p>Tóm tắt: PropTypes kiểm và làm tài liệu cho props; cài <code>prop-types</code>, gắn object <code>.propTypes</code>; dùng kiểu cơ bản + <code>.isRequired</code>, <code>node</code>/<code>element</code> cho thứ render được, <code>arrayOf</code>/<code>shape</code>/<code>oneOf</code> cho prop có cấu trúc/enum, và hàm custom cho phần còn lại.</p>`],
    ]),
    books([
      ['reactdoc', '“Typechecking With PropTypes” (legacy docs) — and the modern alternative, TypeScript (Advanced chapter)', '“Typechecking With PropTypes” (tài liệu cũ) — và lựa chọn hiện đại, TypeScript (chương Nâng cao)'],
    ]),
  ].join('\n'),
};

const EX19 = {
  title: 'Exercise 19 — PropTypes (validation in a component)|||Exercise 19 — PropTypes (kiểm tra trong component)',
  slug: 'fer202-5-ex19-proptypes',
  type: 'EXERCISE',
  description: 'Dựng component Animal nhận props có kiểu (name/scientificName string, size number, diet arrayOf(string), additional object/shape) và tái dùng trên mảng dữ liệu, khai PropTypes đầy đủ.',
  content: bi(
    `<span class="eyebrow">Chapter 5 · Exercise 19 · Slot 13 slide 20</span>
<h2>PropTypes — validate an Animal component</h2>
<p class="lead"><b>Goal:</b> build a component with several typed props, then reuse it over an array of data — declaring PropTypes for every prop.</p>
<h3>The data</h3>
<pre>export default [
  { name: 'Lion',    scientificName: 'Panthera leo',       size: 140, diet: ['meat'] },
  { name: 'Gorilla', scientificName: 'Gorilla beringei',   size: 205, diet: ['plants','insects'],
    additional: { notes: 'endangered' } },
];</pre>
<h3>The component with PropTypes</h3>
<pre><span class="hljs-keyword">import</span> <span class="hljs-title class_">PropTypes</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;prop-types&#x27;</span>;

<span class="hljs-keyword">function</span> <span class="hljs-title function_">Animal</span>(<span class="hljs-params">{ name, scientificName, size, diet, additional }</span>) {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card p-3&quot;</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h3</span>&gt;</span>{name} <span class="hljs-tag">&lt;<span class="hljs-name">em</span>&gt;</span>({scientificName})<span class="hljs-tag">&lt;/<span class="hljs-name">em</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">h3</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Size: {size} kg<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Diet: {diet.join(&#x27;, &#x27;)}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
      {additional &amp;&amp; <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Notes: {additional.notes}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>}
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  );
}

<span class="hljs-title class_">Animal</span>.<span class="hljs-property">propTypes</span> = {
  <span class="hljs-attr">name</span>:           <span class="hljs-title class_">PropTypes</span>.<span class="hljs-property">string</span>.<span class="hljs-property">isRequired</span>,
  <span class="hljs-attr">scientificName</span>: <span class="hljs-title class_">PropTypes</span>.<span class="hljs-property">string</span>.<span class="hljs-property">isRequired</span>,
  <span class="hljs-attr">size</span>:           <span class="hljs-title class_">PropTypes</span>.<span class="hljs-property">number</span>.<span class="hljs-property">isRequired</span>,
  <span class="hljs-attr">diet</span>:           <span class="hljs-title class_">PropTypes</span>.<span class="hljs-title function_">arrayOf</span>(<span class="hljs-title class_">PropTypes</span>.<span class="hljs-property">string</span>).<span class="hljs-property">isRequired</span>,
  <span class="hljs-attr">additional</span>:     <span class="hljs-title class_">PropTypes</span>.<span class="hljs-title function_">shape</span>({ <span class="hljs-attr">notes</span>: <span class="hljs-title class_">PropTypes</span>.<span class="hljs-property">string</span> }),
};</pre>
<h3>Reuse over the array</h3>
<pre>{animals.<span class="hljs-title function_">map</span>(<span class="hljs-function">(<span class="hljs-params">a, i</span>) =&gt;</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Animal</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{i}</span> {<span class="hljs-attr">...a</span>} /&gt;</span></span>)}</pre>
<div class="out"><b>Result:</b> pass <code>size: "140"</code> (a string) and the console warns <em>Invalid prop <code>size</code> of type <code>string</code>… expected <code>number</code></em>. <code>arrayOf</code> validates the diet elements; <code>shape</code> validates the optional <code>additional</code> object.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> PropTypes checks at <em>runtime</em>, in development only. <strong>TypeScript</strong> (Advanced chapter) checks the same at <em>compile time</em> across your whole app — most new React projects use TypeScript instead of PropTypes.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Try the validators</span><span class="lc-sub">Break a prop, watch the warning — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 5 · Exercise 19 · Slot 13 slide 20</span>
<h2>PropTypes — kiểm component Animal</h2>
<p class="lead"><b>Mục tiêu:</b> dựng component có nhiều prop kiểu khác nhau, rồi tái dùng trên một mảng dữ liệu — khai PropTypes cho mọi prop.</p>
<h3>Dữ liệu</h3>
<pre>export default [
  { name: 'Lion',    scientificName: 'Panthera leo',       size: 140, diet: ['meat'] },
  { name: 'Gorilla', scientificName: 'Gorilla beringei',   size: 205, diet: ['plants','insects'],
    additional: { notes: 'endangered' } },
];</pre>
<h3>Component kèm PropTypes</h3>
<pre><span class="hljs-keyword">import</span> <span class="hljs-title class_">PropTypes</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;prop-types&#x27;</span>;

<span class="hljs-keyword">function</span> <span class="hljs-title function_">Animal</span>(<span class="hljs-params">{ name, scientificName, size, diet, additional }</span>) {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card p-3&quot;</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h3</span>&gt;</span>{name} <span class="hljs-tag">&lt;<span class="hljs-name">em</span>&gt;</span>({scientificName})<span class="hljs-tag">&lt;/<span class="hljs-name">em</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">h3</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Kích thước: {size} kg<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Thức ăn: {diet.join(&#x27;, &#x27;)}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
      {additional &amp;&amp; <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Ghi chú: {additional.notes}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>}
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  );
}

<span class="hljs-title class_">Animal</span>.<span class="hljs-property">propTypes</span> = {
  <span class="hljs-attr">name</span>:           <span class="hljs-title class_">PropTypes</span>.<span class="hljs-property">string</span>.<span class="hljs-property">isRequired</span>,
  <span class="hljs-attr">scientificName</span>: <span class="hljs-title class_">PropTypes</span>.<span class="hljs-property">string</span>.<span class="hljs-property">isRequired</span>,
  <span class="hljs-attr">size</span>:           <span class="hljs-title class_">PropTypes</span>.<span class="hljs-property">number</span>.<span class="hljs-property">isRequired</span>,
  <span class="hljs-attr">diet</span>:           <span class="hljs-title class_">PropTypes</span>.<span class="hljs-title function_">arrayOf</span>(<span class="hljs-title class_">PropTypes</span>.<span class="hljs-property">string</span>).<span class="hljs-property">isRequired</span>,
  <span class="hljs-attr">additional</span>:     <span class="hljs-title class_">PropTypes</span>.<span class="hljs-title function_">shape</span>({ <span class="hljs-attr">notes</span>: <span class="hljs-title class_">PropTypes</span>.<span class="hljs-property">string</span> }),
};</pre>
<h3>Tái dùng trên mảng</h3>
<pre>{animals.<span class="hljs-title function_">map</span>(<span class="hljs-function">(<span class="hljs-params">a, i</span>) =&gt;</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Animal</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{i}</span> {<span class="hljs-attr">...a</span>} /&gt;</span></span>)}</pre>
<div class="out"><b>Kết quả:</b> truyền <code>size: "140"</code> (chuỗi) là console cảnh báo <em>Invalid prop <code>size</code> of type <code>string</code>… expected <code>number</code></em>. <code>arrayOf</code> kiểm phần tử của diet; <code>shape</code> kiểm object <code>additional</code> tuỳ chọn.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> PropTypes kiểm lúc <em>chạy</em>, chỉ ở development. <strong>TypeScript</strong> (chương Nâng cao) kiểm điều tương tự lúc <em>biên dịch</em> trên toàn app — hầu hết dự án React mới dùng TypeScript thay PropTypes.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Thử các validator</span><span class="lc-sub">Phá một prop, xem cảnh báo — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

export default [COMPONENT, EX9, EX11, PROPTYPES, EX19];
