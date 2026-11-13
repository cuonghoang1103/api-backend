/**
 * Next.js & React — Chương 2: Component, props & ghép.
 * Song ngữ EN/VI. Escape: backtick→&#96;, `${`→\${, < >→&lt; &gt; trong code.
 * Output React đã chạy thật: scratchpad/nextjs-verify/c2.mjs.
 */

import G02_1 from './giang/nxj-02-1.mjs';
import G02_2 from './giang/nxj-02-2.mjs';
import G02_3 from './giang/nxj-02-3.mjs';
import G02_4 from './giang/nxj-02-4.mjs';
export default {
  title: 'Chapter 2 — Components, props & composition|||Chương 2 — Component, props & ghép',
  description: 'Props là đầu vào của component, chảy một chiều từ cha xuống con và chỉ đọc. children biến component thành cái khuôn. Dựng UI to từ những mảnh nhỏ mỗi mảnh một việc.',
  lessons: [
    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — Props: a component\'s inputs|||2.1 — Props: đầu vào của component',
      slug: 'nextjs-2-1-props',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Props là đối số của một component, chảy một chiều từ cha xuống con, và chỉ đọc. Sửa props là một bug.',
      content: `
${G02_1}
<div class="ml-en">
<div class="callout ok"><strong>Already took the React course?</strong> This chapter is a quick React refresher &mdash; the same topic is taught in depth in the <a href="/courses/react">React</a> course (Chapter 1). Skim it or skip ahead to <strong>Chapter 8</strong>, where the Next.js-specific material starts. Remember: Next.js is a <em>framework built on React</em> &mdash; every component, prop, state and hook here is still plain React.</div>
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>A component is a function; props are its arguments</h2>
<p class="lead">In Chapter 1 you saw a component is a function that returns UI. Props are simply the arguments to that function — the data a parent passes down so a child can render itself. Everything about how React apps are structured falls out of one rule: data flows <em>down</em>, one way, and props are read-only.</p>

<h3>Passing and receiving props</h3>
<p>A parent passes props as JSX attributes; the child receives them as a single object, which you almost always destructure:</p>
<pre><code class="language-typescript">function Avatar({ src, alt }) {
  return &lt;img src={src} alt={alt} /&gt;;
}

function UserCard({ user }) {
  return (
    &lt;div className="card"&gt;
      &lt;Avatar src={user.avatar} alt={user.name} /&gt;
      &lt;h3&gt;{user.name}&lt;/h3&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Render <code>&lt;UserCard user={{ name: 'An', avatar: '/a.png' }} /&gt;</code> and you get exactly what the tree says — verified through <code>react-dom/server</code>:</p>
<div class="out">&lt;link rel="preload" as="image" href="/a.png"/&gt;&lt;div class="card"&gt;&lt;img src="/a.png" alt="An"/&gt;&lt;h3&gt;An&lt;/h3&gt;&lt;/div&gt;</div>
<p><code>UserCard</code> receives a <code>user</code> prop and hands pieces of it down to <code>Avatar</code>. That is the shape of every React app: a tree of components, each taking props from its parent and passing props to its children.</p>

<h3>Props flow one way: down</h3>
<p>Data in React moves in one direction — from parent to child, never sideways or up. A child cannot reach into its parent's data, and two siblings cannot pass props to each other directly. If two components need to share data, that data lives in their nearest common parent, which passes it down to both. (When a child needs to <em>change</em> shared data, the parent passes down a function too — Lesson 2.3, and fully in Chapter 3.)</p>
<p>This sounds restrictive and is the opposite: one-way flow is why you can look at any component and know exactly where its data came from — the parent, through props. There is no spooky action at a distance.</p>

<h3>Props are read-only</h3>
<p>A component must never modify its own props. Props are a snapshot handed down for this render; mutating them corrupts the parent's data and produces bugs React cannot help you find:</p>
<pre><code class="language-typescript">function Total({ items }) {
  items.push({ price: 0 });   <span class="tok-comment">// ❌ mutating a prop — the parent's array is now wrong</span>
  return &lt;p&gt;{items.length} items&lt;/p&gt;;
}</code></pre>
<p>Treat props as frozen. If you need a modified version, compute a new value (<code>const sorted = [...items].sort(...)</code>) instead of changing the one you were given. React's whole model — same props in, same UI out — depends on components being pure functions of their props.</p>

<div class="callout ok">
<p><strong>The one-sentence version:</strong> a component takes props from above and returns UI; it never writes to its props, and it never reaches upward for data. Hold that and the rest of React is downhill.</p>
</div>
<h3>How data moves through a React tree</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Props go down, only down</b> — A parent passes values to a child. There is no way for a child to reach up and read its parent&#39;s variables — that one-way rule is what makes a tree predictable.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Props are read-only</b> — Assigning to &#96;props.title&#96; throws in development — React freezes the props object, so you get <em>TypeError: Cannot assign to read only property</em> — and in production (no freeze) it silently “works” until the parent overwrites it on the next render. Measured below.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>To send data up, pass a function down</b> — The parent owns the state and hands the child a callback. The child calls it; the parent decides what changes.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Two children share by lifting</b> — When two siblings need the same value, it moves to their closest common parent. This is the single most common refactor in React.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — passing an object or array literal as a prop on every render.</strong> &#96;&lt;List items={[]} style={{ margin: 0 }} /&gt;&#96; creates a brand-new array and a brand-new object each time the parent renders. They are equal in value and different by identity, so any child wrapped in &#96;React.memo&#96; re-renders anyway, and any &#96;useEffect&#96; that depends on the prop fires every time — occasionally as an infinite loop, if the effect sets state. Nothing errors; the app is just slower than it looks like it should be. Hoist constant values outside the component, or memoise computed ones with &#96;useMemo&#96;.</p></div>
<a class="link-card dl" href="https://react.dev/learn/passing-props-to-a-component" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">react.dev — Passing props to a component</span><span class="lc-sub">Props, defaults, spreading, and children as a prop.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Sharing state between components</span><span class="lc-sub">The lifting-state refactor, step by step, with the code before and after.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build a <code>&lt;Greeting name=... /&gt;</code> component and render it three times with different names from a parent.</li>
<li>Try to reassign a prop inside the child (<code>props.name = &quot;x&quot;</code>) and note why props are read-only; lift the change to the parent instead.</li>
<li>Add a second prop with a default value and render the component once without passing it.</li>
</ol>
<p><strong>Done when:</strong> you can pass props down, treat them as read-only, and give a prop a default.</p></div>

<h3>🔬 Measured: props on React 19.3.0</h3>
<p>The UserCard example through react-dom/server — note the image preload React 19 hoists in front of your tree:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
function Avatar({ src, alt }) {
  return h('img', { src, alt });
}
function UserCard({ user }) {
  return h('div', { className: 'card' }, h(Avatar, { src: user.avatar, alt: user.name }), h('h3', null, user.name));
}
console.log(renderToStaticMarkup(h(UserCard, { user: { name: 'An', avatar: '/a.png' } })));</code></pre><pre><code class="language-bash">$ node usercard.cjs</code></pre><div class="out">&lt;link rel="preload" as="image" href="/a.png"/&gt;&lt;div class="card"&gt;&lt;img src="/a.png" alt="An"/&gt;&lt;h3&gt;An&lt;/h3&gt;&lt;/div&gt;</div>
<p>Writing to a prop: development vs production:</p>
<pre><code class="language-javascript">'use strict';
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function Greeting(props) {
  props.name = 'x';                     <span class="tok-comment">  // ✗ sửa prop</span>
  return React.createElement('p', null, 'Hi ', props.name);
}
try {
  console.log(renderToStaticMarkup(React.createElement(Greeting, { name: 'An' })));
} catch (e) {
  console.log('TypeError: ' + e.message);
}</code></pre><pre><code class="language-bash">$ NODE_ENV=development node props.cjs</code></pre><div class="out">TypeError: Cannot assign to read only property 'name' of object '#&lt;Object&gt;'</div><pre><code class="language-bash">$ NODE_ENV=production node props.cjs</code></pre><div class="out">&lt;p&gt;Hi x&lt;/p&gt;</div>
<p>In <code>next dev</code> the same mistake shows a <b>Runtime TypeError</b> overlay pointing at the assignment line. The freeze is shallow — mutating an array inside props corrupts the parent:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function Total({ items }) {
  items.push({ price: 0 });             <span class="tok-comment">  // ✗ mutate mảng của cha</span>
  return React.createElement('p', null, items.length, ' items');
}
const gio = [{ price: 10 }, { price: 20 }]; <span class="tok-comment">  // dữ liệu của CHA: 2 món</span>
for (let lan = 1; lan &lt;= 3; lan++) {
  const html = renderToStaticMarkup(React.createElement(Total, { items: gio }));
  console.log(&#96;render #\${lan}: \${html}   · mảng của cha giờ có \${gio.length} món&#96;);
}</code></pre><pre><code class="language-bash">$ node total.cjs</code></pre><div class="out">render #1: &lt;p&gt;3 items&lt;/p&gt;   · mảng của cha giờ có 3 món
render #2: &lt;p&gt;4 items&lt;/p&gt;   · mảng của cha giờ có 4 món
render #3: &lt;p&gt;5 items&lt;/p&gt;   · mảng của cha giờ có 5 món</div>
<p>The inline <code>[]</code> trap in a real browser (production build): two <code>React.memo</code> children, parent re-rendered 3 times:</p>
<pre><code class="language-tsx">'use client';
import { memo, useState } from 'react';

let demA = 0;
let demB = 0;
const RONG: string[] = [];

const ListA = memo(function ListA({ items }: { items: string[] }) {
  demA++;
  return &lt;p id="a"&gt;ListA (items={'{[]}'}) render: {demA} · {items.length} món&lt;/p&gt;;
});
const ListB = memo(function ListB({ items }: { items: string[] }) {
  demB++;
  return &lt;p id="b"&gt;ListB (items={'{RONG}'}) render: {demB} · {items.length} món&lt;/p&gt;;
});

export default function Memo() {
  const [n, setN] = useState(0);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;button className="rounded border px-3" onClick={() =&gt; setN(n + 1)}&gt;Cha render lại: {n}&lt;/button&gt;
      &lt;ListA items={[]} /&gt;
      &lt;ListB items={RONG} /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">ListA (items={[]}) render: 4 · 0 món
ListB (items={RONG}) render: 1 · 0 món</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">node usercard.cjs
NODE_ENV=development node props.cjs
NODE_ENV=production node props.cjs
node total.cjs
npm run build &amp;&amp; npm start  <span class="tok-comment">  # open /memo, click 3 times</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-2-props" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.2 — Props</span><span class="lc-sub">The same topic in the React course, deeper</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-5-1-components-props" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 5.1 — Components and props</span><span class="lc-sub">The university-course view</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Props</span><span class="v">A component's inputs, passed from its parent as attributes.</span></div>
  <div class="kv"><span class="k">Read-only</span><span class="v">A child must never mutate its props; data flows one way.</span></div>
  <div class="kv"><span class="k">One-way data flow</span><span class="v">Data goes parent → child; changes go back up via callbacks.</span></div>
  <div class="kv"><span class="k">Default prop</span><span class="v">A fallback value used when the parent passes nothing.</span></div>
  <div class="kv"><span class="k">Props object</span><span class="v">All props arrive as one object; destructure it for clarity.</span></div>
  <div class="kv"><span class="k">Reusable component</span><span class="v">Same component, different props — the core of composition.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Props are a component's inputs, passed down from the parent like attributes.</li><li>Props are read-only — a child never mutates them; data flows one way, parent to child.</li><li>Destructure the props object and give defaults where a prop is optional.</li><li>To change data, a child calls a callback prop so the parent updates and re-renders.</li></ul>

</div>

<div class="ml-vi">
<div class="callout ok"><strong>Đã học khoá React?</strong> Chương này là phần ôn nhanh React &mdash; cùng chủ đề được dạy kỹ ở khoá <a href="/courses/react">React</a> (Chương 1). Đọc lướt hoặc chuyển thẳng sang <strong>Chương 8</strong>, nơi bắt đầu phần riêng của Next.js. Nhớ: Next.js là <em>framework dựng trên React</em> &mdash; mọi component, props, state, hook ở đây vẫn là React thuần.</div>
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Component là một hàm; props là đối số của nó</h2>
<p class="lead">Ở Chương 1 bạn thấy component là một hàm trả về giao diện. Props đơn giản là đối số của hàm đó — dữ liệu cha truyền xuống để con tự render chính mình. Mọi thứ về cách cấu trúc một app React đều suy ra từ một quy tắc: dữ liệu chảy <em>xuống</em>, một chiều, và props chỉ đọc.</p>

<h3>Truyền và nhận props</h3>
<p>Cha truyền props như thuộc tính JSX; con nhận chúng dưới dạng một object duy nhất, mà bạn hầu như luôn destructure:</p>
<pre><code class="language-typescript">function Avatar({ src, alt }) {
  return &lt;img src={src} alt={alt} /&gt;;
}

function UserCard({ user }) {
  return (
    &lt;div className="card"&gt;
      &lt;Avatar src={user.avatar} alt={user.name} /&gt;
      &lt;h3&gt;{user.name}&lt;/h3&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Render <code>&lt;UserCard user={{ name: 'An', avatar: '/a.png' }} /&gt;</code> và bạn được đúng cái cây mô tả — đã kiểm qua <code>react-dom/server</code>:</p>
<div class="out">&lt;link rel="preload" as="image" href="/a.png"/&gt;&lt;div class="card"&gt;&lt;img src="/a.png" alt="An"/&gt;&lt;h3&gt;An&lt;/h3&gt;&lt;/div&gt;</div>
<p><code>UserCard</code> nhận một prop <code>user</code> và trao từng mảnh của nó xuống <code>Avatar</code>. Đó là hình dạng của mọi app React: một cây component, mỗi cái nhận props từ cha và truyền props xuống con.</p>

<h3>Props chảy một chiều: xuống</h3>
<p>Dữ liệu trong React đi theo một hướng — từ cha xuống con, không bao giờ ngang hay lên. Một con không thể với vào dữ liệu của cha, và hai anh em không thể truyền props trực tiếp cho nhau. Nếu hai component cần chia sẻ dữ liệu, dữ liệu đó nằm ở cha chung gần nhất của chúng, và cha truyền xuống cho cả hai. (Khi một con cần <em>đổi</em> dữ liệu chung, cha truyền xuống kèm một hàm — Bài 2.3, và trọn vẹn ở Chương 3.)</p>
<p>Nghe thì gò bó nhưng lại ngược lại: dòng một chiều chính là lý do bạn nhìn bất kỳ component nào cũng biết chính xác dữ liệu của nó từ đâu ra — từ cha, qua props. Không có tác động ma quái từ xa.</p>

<h3>Props chỉ đọc</h3>
<p>Một component không bao giờ được sửa props của chính nó. Props là một ảnh chụp trao xuống cho lần render này; mutate chúng làm hỏng dữ liệu của cha và sinh ra bug React không thể giúp bạn tìm:</p>
<pre><code class="language-typescript">function Total({ items }) {
  items.push({ price: 0 });   <span class="tok-comment">// ❌ mutate một prop — mảng của cha giờ đã sai</span>
  return &lt;p&gt;{items.length} items&lt;/p&gt;;
}</code></pre>
<p>Hãy coi props như đóng băng. Nếu cần một bản đã sửa, hãy tính một giá trị mới (<code>const sorted = [...items].sort(...)</code>) thay vì đổi cái bạn được đưa. Toàn bộ mô hình của React — cùng props vào, cùng UI ra — dựa trên việc component là hàm thuần của props.</p>

<div class="callout ok">
<p><strong>Bản một câu:</strong> một component nhận props từ trên và trả về UI; nó không bao giờ ghi vào props, và không bao giờ với lên trên để lấy dữ liệu. Nắm chắc điều đó thì phần còn lại của React là đường xuống dốc.</p>
</div>
<h3>Dữ liệu di chuyển thế nào trong một cây React</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Props đi xuống, chỉ đi xuống</b> — Cha truyền giá trị cho con. Con không có cách nào với ngược lên đọc biến của cha — chính luật một chiều đó làm cái cây trở nên đoán được.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Props là chỉ-đọc</b> — Gán vào &#96;props.title&#96; ném lỗi ở chế độ development — React đông cứng object props, nên bạn nhận <em>TypeError: Cannot assign to read only property</em> — còn ở production (không đông cứng) thì lặng lẽ “chạy được” cho tới khi cha ghi đè ở lần render sau. Đo thật bên dưới.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Muốn gửi dữ liệu lên thì truyền một hàm xuống</b> — Cha sở hữu state và đưa cho con một callback. Con gọi nó; cha quyết định cái gì thay đổi.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Hai đứa con chia sẻ bằng cách nâng state lên</b> — Khi hai anh em cần cùng một giá trị, nó dời lên phần tử cha chung gần nhất. Đây là phép tái cấu trúc phổ biến nhất trong React.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — truyền một object hay mảng viết thẳng làm prop ở mỗi lần render.</strong> &#96;&lt;List items={[]} style={{ margin: 0 }} /&gt;&#96; tạo ra một mảng mới toanh và một object mới toanh mỗi lần cha render. Chúng bằng nhau về giá trị mà khác nhau về danh tính, nên mọi component con bọc trong &#96;React.memo&#96; vẫn render lại, và mọi &#96;useEffect&#96; phụ thuộc vào prop đó đều nổ mỗi lần — thỉnh thoảng thành một vòng lặp vô tận, nếu effect có đặt state. Chẳng lỗi nào cả; ứng dụng chỉ chậm hơn cái vẻ ngoài của nó. Hãy đưa các giá trị hằng ra ngoài component, hoặc ghi nhớ các giá trị tính toán bằng &#96;useMemo&#96;.</p></div>
<a class="link-card dl" href="https://react.dev/learn/passing-props-to-a-component" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">react.dev — Truyền props cho component</span><span class="lc-sub">Props, giá trị mặc định, phép trải, và children như một prop.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Chia sẻ state giữa các component</span><span class="lc-sub">Phép nâng state lên, từng bước, kèm mã trước và sau.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng một component <code>&lt;Greeting name=... /&gt;</code> và render ba lần với các tên khác nhau từ component cha.</li>
<li>Thử gán lại một prop trong con (<code>props.name = &quot;x&quot;</code>) và để ý vì sao prop là chỉ-đọc; đưa thay đổi lên cha.</li>
<li>Thêm một prop thứ hai có giá trị mặc định và render component một lần mà không truyền nó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn truyền được prop xuống, coi prop là chỉ-đọc, và đặt được giá trị mặc định cho prop.</p></div>

<h3>🔬 Đo thật: props trên React 19.3.0</h3>
<p>Ví dụ UserCard qua react-dom/server — để ý thẻ preload ảnh mà React 19 tự chèn trước cây của bạn:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
function Avatar({ src, alt }) {
  return h('img', { src, alt });
}
function UserCard({ user }) {
  return h('div', { className: 'card' }, h(Avatar, { src: user.avatar, alt: user.name }), h('h3', null, user.name));
}
console.log(renderToStaticMarkup(h(UserCard, { user: { name: 'An', avatar: '/a.png' } })));</code></pre><pre><code class="language-bash">$ node usercard.cjs</code></pre><div class="out">&lt;link rel="preload" as="image" href="/a.png"/&gt;&lt;div class="card"&gt;&lt;img src="/a.png" alt="An"/&gt;&lt;h3&gt;An&lt;/h3&gt;&lt;/div&gt;</div>
<p>Ghi vào prop: development và production:</p>
<pre><code class="language-javascript">'use strict';
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function Greeting(props) {
  props.name = 'x';                     <span class="tok-comment">  // ✗ sửa prop</span>
  return React.createElement('p', null, 'Hi ', props.name);
}
try {
  console.log(renderToStaticMarkup(React.createElement(Greeting, { name: 'An' })));
} catch (e) {
  console.log('TypeError: ' + e.message);
}</code></pre><pre><code class="language-bash">$ NODE_ENV=development node props.cjs</code></pre><div class="out">TypeError: Cannot assign to read only property 'name' of object '#&lt;Object&gt;'</div><pre><code class="language-bash">$ NODE_ENV=production node props.cjs</code></pre><div class="out">&lt;p&gt;Hi x&lt;/p&gt;</div>
<p>Ở <code>next dev</code>, cùng lỗi đó hiện lớp phủ <b>Runtime TypeError</b> chỉ đúng dòng gán. Phép đông cứng chỉ ở lớp ngoài — sửa mảng bên trong props làm hỏng dữ liệu của cha:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function Total({ items }) {
  items.push({ price: 0 });             <span class="tok-comment">  // ✗ mutate mảng của cha</span>
  return React.createElement('p', null, items.length, ' items');
}
const gio = [{ price: 10 }, { price: 20 }]; <span class="tok-comment">  // dữ liệu của CHA: 2 món</span>
for (let lan = 1; lan &lt;= 3; lan++) {
  const html = renderToStaticMarkup(React.createElement(Total, { items: gio }));
  console.log(&#96;render #\${lan}: \${html}   · mảng của cha giờ có \${gio.length} món&#96;);
}</code></pre><pre><code class="language-bash">$ node total.cjs</code></pre><div class="out">render #1: &lt;p&gt;3 items&lt;/p&gt;   · mảng của cha giờ có 3 món
render #2: &lt;p&gt;4 items&lt;/p&gt;   · mảng của cha giờ có 4 món
render #3: &lt;p&gt;5 items&lt;/p&gt;   · mảng của cha giờ có 5 món</div>
<p>Bẫy <code>[]</code> viết thẳng trên trình duyệt thật (bản build production): hai con bọc <code>React.memo</code>, cha vẽ lại 3 lần:</p>
<pre><code class="language-tsx">'use client';
import { memo, useState } from 'react';

let demA = 0;
let demB = 0;
const RONG: string[] = [];

const ListA = memo(function ListA({ items }: { items: string[] }) {
  demA++;
  return &lt;p id="a"&gt;ListA (items={'{[]}'}) render: {demA} · {items.length} món&lt;/p&gt;;
});
const ListB = memo(function ListB({ items }: { items: string[] }) {
  demB++;
  return &lt;p id="b"&gt;ListB (items={'{RONG}'}) render: {demB} · {items.length} món&lt;/p&gt;;
});

export default function Memo() {
  const [n, setN] = useState(0);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;button className="rounded border px-3" onClick={() =&gt; setN(n + 1)}&gt;Cha render lại: {n}&lt;/button&gt;
      &lt;ListA items={[]} /&gt;
      &lt;ListB items={RONG} /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">ListA (items={[]}) render: 4 · 0 món
ListB (items={RONG}) render: 1 · 0 món</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">node usercard.cjs
NODE_ENV=development node props.cjs
NODE_ENV=production node props.cjs
node total.cjs
npm run build &amp;&amp; npm start  <span class="tok-comment">  # mở /memo, bấm 3 lần</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-2-props" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.2 — Props</span><span class="lc-sub">Cùng chủ đề trong khoá React, đi sâu hơn</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-5-1-components-props" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 5.1 — Component và props</span><span class="lc-sub">Góc nhìn môn học ở trường</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Props</span><span class="v">Đầu vào của một component, truyền từ cha dưới dạng thuộc tính.</span></div>
  <div class="kv"><span class="k">Chỉ-đọc</span><span class="v">Con không bao giờ được sửa prop của nó; dữ liệu chảy một chiều.</span></div>
  <div class="kv"><span class="k">Dòng dữ liệu một chiều</span><span class="v">Dữ liệu đi cha → con; thay đổi quay lên qua callback.</span></div>
  <div class="kv"><span class="k">Prop mặc định</span><span class="v">Giá trị dự phòng dùng khi cha không truyền gì.</span></div>
  <div class="kv"><span class="k">Object props</span><span class="v">Mọi prop đến như một object; destructure cho rõ.</span></div>
  <div class="kv"><span class="k">Component tái dùng</span><span class="v">Cùng component, khác prop — cốt lõi của việc ghép (composition).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Props là đầu vào của component, truyền từ cha xuống như các thuộc tính.</li><li>Props là chỉ-đọc — con không bao giờ sửa; dữ liệu chảy một chiều, cha xuống con.</li><li>Destructure object props và đặt mặc định ở nơi prop là tuỳ chọn.</li><li>Để đổi dữ liệu, con gọi một prop callback để cha cập nhật và render lại.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — children & composition|||2.2 — children & ghép',
      slug: 'nextjs-2-2-children-composition',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Prop children biến một component thành cái khuôn nhận nội dung. Ghép thay cho kế thừa: dựng cái to bằng cách lồng cái nhỏ.',
      content: `
${G02_2}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Components as containers: the <code>children</code> prop</h2>
<p class="lead">Sometimes a component shouldn't decide its contents — it should provide a shape and let the caller fill it. React has one special prop for this: whatever JSX you nest between a component's tags arrives as the <code>children</code> prop.</p>

<h3>Whatever you nest becomes <code>children</code></h3>
<pre><code class="language-typescript">function Panel({ title, children }) {
  return (
    &lt;section className="panel"&gt;
      &lt;h2&gt;{title}&lt;/h2&gt;
      &lt;div className="body"&gt;{children}&lt;/div&gt;
    &lt;/section&gt;
  );
}

<span class="tok-comment">// caller — the &lt;p&gt; and &lt;button&gt; become Panel's children</span>
&lt;Panel title="Hi"&gt;
  &lt;p&gt;inner text&lt;/p&gt;
  &lt;button&gt;OK&lt;/button&gt;
&lt;/Panel&gt;</code></pre>
<p>Rendered for real:</p>
<div class="out">&lt;section class="panel"&gt;&lt;h2&gt;Hi&lt;/h2&gt;&lt;div class="body"&gt;&lt;p&gt;inner text&lt;/p&gt;&lt;button&gt;OK&lt;/button&gt;&lt;/div&gt;&lt;/section&gt;</div>
<p><code>Panel</code> knows how to draw a titled box with a body; it does <em>not</em> know or care what goes in the body. The caller decides. This is the single most useful pattern in React: a component that owns the <em>frame</em> and delegates the <em>content</em>.</p>

<h3>Composition beats configuration</h3>
<p>Without <code>children</code>, people try to make one component do everything through a pile of props:</p>
<pre><code class="language-typescript"><span class="tok-comment">// ❌ a component trying to be everything via props</span>
&lt;Card
  title="Hi"
  bodyText="inner text"
  showButton={true}
  buttonLabel="OK"
  buttonVariant="primary"
/&gt;</code></pre>
<p>Every new need adds a prop, and the component swells into an unreadable switchboard. Composition inverts it: give the caller a slot and let them put a real button in it. You get unlimited flexibility with zero new props, because the flexibility lives in the JSX the caller nests, not in the component's API.</p>

<h3>React has no inheritance — it has composition</h3>
<p>If you come from classes, you might reach for "ButtonBase, then PrimaryButton extends it". React doesn't work that way and doesn't need to. To specialise a component, you <em>wrap</em> or <em>configure</em> it, you don't extend it:</p>
<pre><code class="language-typescript">function PrimaryButton({ children, ...rest }) {
  return &lt;button className="btn btn-primary" {...rest}&gt;{children}&lt;/button&gt;;
}</code></pre>
<p>That is "PrimaryButton is a Button with these defaults" expressed by composition. The official guidance is explicit: <em>prefer composition over inheritance.</em> In years of real React you will essentially never write a class hierarchy of components.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it</strong> — the site is full of frame-and-slot components: a modal that renders an overlay, a close button and a titled header, then drops <code>{children}</code> in the middle; a card shell that gives padding, border and hover, and lets each feature fill it. When you see the same visual container around wildly different content — a message thread, a settings panel, a quiz — that is one <code>children</code>-based component doing all of it.</p>
</div>
<h3>Composition instead of configuration</h3>
<div class="lz-map">
  <div class="lz-stage">Two ways to build a flexible component</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">The props route</div><div class="lz-nsub">&#96;&lt;Card title icon footer showBorder /&gt;&#96;. Every new need adds a prop, and after ten of them nobody can tell which combinations are valid.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">The children route</div><div class="lz-nsub">&#96;&lt;Card&gt;&lt;CardTitle/&gt;…&lt;/Card&gt;&#96;. The caller supplies the content directly, so the card never needs to know what goes inside it.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Several slots, several props</div><div class="lz-nsub">When you need two holes, pass elements as props: &#96;&lt;Layout sidebar={&lt;Nav/&gt;} main={&lt;Feed/&gt;} /&gt;&#96;. Elements are ordinary values.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Composition avoids prop drilling</div><div class="lz-nsub">A wrapper that renders &#96;children&#96; never touches the data inside them, so nothing has to be threaded through it.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — a component whose props list keeps growing to cover new cases.</strong> &#96;&lt;Modal title confirmText cancelText showClose hideFooter danger wide /&gt;&#96; starts as three booleans and ends as a component nobody dares change, because any prop might interact with any other. The symptom to watch for is a boolean added to support exactly one caller. When you see it, invert the design: let the modal render &#96;children&#96; and let each caller compose what it needs. You trade a few lines at the call site for a component with no combinations to test — and callers can then do things you never anticipated.</p></div>
<a class="link-card dl" href="https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">react.dev — Passing JSX as children</span><span class="lc-sub">The children prop, and why it is just a prop like any other.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/thinking-in-react" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">react.dev — Thinking in React</span><span class="lc-sub">Where component boundaries come from, and how to spot one that is wrong.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build a <code>&lt;Card&gt;</code> that renders <code>{children}</code> inside a styled box, then wrap three different chunks of JSX with it.</li>
<li>Add a named slot by passing JSX through a prop (for example <code>header={...}</code>) alongside <code>children</code>.</li>
<li>Refactor a component that took ten props down to one that takes <code>children</code> — note how composition beats configuration.</li>
</ol>
<p><strong>Done when:</strong> you can pass JSX via <code>children</code> and a named prop, and prefer composition over a pile of props.</p></div>

<h3>🔬 Measured: children on React 19.3.0 / Next.js 16.4.6</h3>
<p>The Panel example above, rendered for real — the output matches:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
function Panel({ title, children }) {
  return h('section', { className: 'panel' }, h('h2', null, title), h('div', { className: 'body' }, children));
}
<span class="tok-comment">// &lt;Panel title="Hi"&gt;&lt;p&gt;inner text&lt;/p&gt;&lt;button&gt;OK&lt;/button&gt;&lt;/Panel&gt;</span>
console.log(renderToStaticMarkup(h(Panel, { title: 'Hi' }, h('p', null, 'inner text'), h('button', null, 'OK'))));</code></pre><pre><code class="language-bash">$ node panel.cjs</code></pre><div class="out">&lt;section class="panel"&gt;&lt;h2&gt;Hi&lt;/h2&gt;&lt;div class="body"&gt;&lt;p&gt;inner text&lt;/p&gt;&lt;button&gt;OK&lt;/button&gt;&lt;/div&gt;&lt;/section&gt;</div>
<p>You have used <code>children</code> since lesson 0.3: the root layout that <code>create-next-app</code> generated receives it, and Next.js passes the page for each URL as <code>children</code>:</p>
<pre><code class="language-bash">$ grep -n -A9 'export default function RootLayout' src/app/layout.tsx</code></pre><div class="out">20:export default function RootLayout({ children }: LayoutProps&lt;"/"&gt;) {
21-  return (
22-    &lt;html
23-      lang="en"
24-      className={&#96;\${geistSans.variable} \${geistMono.variable} h-full antialiased&#96;}
25-    &gt;
26-      &lt;body className="min-h-full flex flex-col"&gt;{children}&lt;/body&gt;
27-    &lt;/html&gt;
28-  );
29-}</div>
<p>What a component actually receives — it is <b>not always an array</b>. Never call <code>children.map</code>; render it, or use the <code>React.Children</code> helpers:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;             <span class="tok-comment">  // JSX &lt;X a="1"&gt;…&lt;/X&gt;  =  h(X, { a: '1' }, …)</span>
let nhan;
function Hop({ children }) {
  nhan = children;                         <span class="tok-comment">  // ghi lại đúng thứ component nhận được</span>
  return null;
}
const ta = (c) =&gt; c === undefined ? 'undefined' : Array.isArray(c) ? &#96;mảng \${c.length} phần tử&#96; : typeof c === 'object' ? &#96;1 element &lt;\${c.type}&gt;&#96; : &#96;\${typeof c} '\${c}'&#96;;
const thu = [
  ['&lt;Hop /&gt;', h(Hop)],
  ['&lt;Hop&gt;chào&lt;/Hop&gt;', h(Hop, null, 'chào')],
  ['&lt;Hop&gt;&lt;p /&gt;&lt;/Hop&gt;', h(Hop, null, h('p'))],
  ['&lt;Hop&gt;&lt;p /&gt;&lt;b /&gt;&lt;/Hop&gt;', h(Hop, null, h('p'), h('b'))],
  ['&lt;Hop children={&lt;p /&gt;} /&gt;', h(Hop, { children: h('p') })],
];
for (const [jsx, el] of thu) {
  renderToStaticMarkup(el);
  console.log(jsx.padEnd(26), '→', ta(nhan), '· Children.count =', React.Children.count(nhan));
}</code></pre><pre><code class="language-bash">$ node children.cjs</code></pre><div class="out">&lt;Hop /&gt;                    → undefined · Children.count = 0
&lt;Hop&gt;chào&lt;/Hop&gt;            → string 'chào' · Children.count = 1
&lt;Hop&gt;&lt;p /&gt;&lt;/Hop&gt;           → 1 element &lt;p&gt; · Children.count = 1
&lt;Hop&gt;&lt;p /&gt;&lt;b /&gt;&lt;/Hop&gt;      → mảng 2 phần tử · Children.count = 2
&lt;Hop children={&lt;p /&gt;} /&gt;   → 1 element &lt;p&gt; · Children.count = 1</div>
<p>Two silent traps. A Panel that forgets <code>{{children}}</code> drops the content with no error (exit code 0); TypeScript catches the shape mistakes — undeclared children (TS2322), children given twice (TS2710), required children missing (TS2741):</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
function Panel({ title }) {                <span class="tok-comment">  // ✗ quên {children}</span>
  return h('section', null, h('h2', null, title));
}
console.log(renderToStaticMarkup(h(Panel, { title: 'Hi' }, h('p', null, 'inner text'), h('button', null, 'OK'))));</code></pre><pre><code class="language-bash">$ node quen.cjs 2&gt;&amp;1; echo "exit=$?"</code></pre><div class="out">&lt;section&gt;&lt;h2&gt;Hi&lt;/h2&gt;&lt;/section&gt;
exit=0</div>
<pre><code class="language-tsx">function Title({ text }: { text: string }) {
  return &lt;h2&gt;{text}&lt;/h2&gt;;
}
function Hop({ children }: { children: React.ReactNode }) {
  return &lt;div&gt;{children}&lt;/div&gt;;
}
export const a = &lt;Title text="Hi"&gt;thêm chữ&lt;/Title&gt;;
export const b = &lt;Hop children={&lt;p&gt;A&lt;/p&gt;}&gt;&lt;p&gt;B&lt;/p&gt;&lt;/Hop&gt;;
export const c = &lt;Hop /&gt;;</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/thu22/bay.tsx(7,19): error TS2322: Type '{ children: string; text: string; }' is not assignable to type 'IntrinsicAttributes &amp; { text: string; }'.
  Property 'children' does not exist on type 'IntrinsicAttributes &amp; { text: string; }'.
src/thu22/bay.tsx(8,23): error TS2710: 'children' are specified twice. The attribute named 'children' will be overwritten.
src/thu22/bay.tsx(9,19): error TS2741: Property 'children' is missing in type '{}' but required in type '{ children: ReactNode; }'.</div>
<p>In a real browser (<code>next build</code> + <code>next start</code>): one Panel wrapping three different contents, and a Layout with two named slots:</p>
<pre><code class="language-tsx">type Co = { children: React.ReactNode };

function Panel({ title, children }: { title: string } &amp; Co) {
  return (
    &lt;section className="panel rounded-xl border-2 border-sky-500 bg-white shadow"&gt;
      &lt;h2 className="rounded-t-lg bg-sky-500 px-4 py-1 font-bold text-white"&gt;{title}&lt;/h2&gt;
      &lt;div className="body p-4"&gt;{children}&lt;/div&gt;
    &lt;/section&gt;
  );
}

type Slots = { sidebar: React.ReactNode; main: React.ReactNode };

function Layout({ sidebar, main }: Slots) {
  return (
    &lt;div className="grid grid-cols-[150px_1fr] gap-3"&gt;
      &lt;aside className="rounded-xl bg-slate-100 p-3"&gt;{sidebar}&lt;/aside&gt;
      &lt;main&gt;{main}&lt;/main&gt;
    &lt;/div&gt;
  );
}

export default function Ghep() {
  return (
    &lt;div className="space-y-3 bg-slate-50 p-5 font-sans text-sm text-slate-900"&gt;
      &lt;div className="grid grid-cols-3 gap-3"&gt;
        &lt;Panel title="Tin nhắn"&gt;
          &lt;p&gt;An: tối nay họp nhé?&lt;/p&gt;
          &lt;p className="text-right"&gt;Bình: ok 8h&lt;/p&gt;
        &lt;/Panel&gt;
        &lt;Panel title="Cài đặt"&gt;
          &lt;label className="block"&gt;&lt;input type="checkbox" defaultChecked /&gt; Thông báo&lt;/label&gt;
          &lt;label className="block"&gt;&lt;input type="checkbox" /&gt; Chế độ tối&lt;/label&gt;
        &lt;/Panel&gt;
        &lt;Panel title="Quiz"&gt;
          &lt;p&gt;2 + 2 = ?&lt;/p&gt;
          &lt;button className="mt-1 rounded bg-sky-500 px-3 text-white"&gt;4&lt;/button&gt;
        &lt;/Panel&gt;
      &lt;/div&gt;
      &lt;Layout
        sidebar={&lt;nav className="space-y-1"&gt;&lt;p&gt;🏠 Trang chủ&lt;/p&gt;&lt;p&gt;📚 Khoá học&lt;/p&gt;&lt;/nav&gt;}
        main={&lt;Panel title="Bảng tin"&gt;&lt;p&gt;Hai khe: sidebar và main&lt;/p&gt;&lt;/Panel&gt;}
      /&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Bonus — children skip the wrapper's re-render. Each wrapper has its own counter; each button clicked 3 times:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

let demTrong = 0;
let demNgoai = 0;

function ChamTrong() {
  demTrong++;
  return &lt;p id="trong"&gt;ChamTrong (vẽ TRONG KhungA) render: {demTrong}&lt;/p&gt;;
}
function ChamNgoai() {
  demNgoai++;
  return &lt;p id="ngoai"&gt;ChamNgoai (truyền làm children) render: {demNgoai}&lt;/p&gt;;
}

function KhungA() {
  const [n, setN] = useState(0);
  return (
    &lt;div className="rounded border p-2"&gt;
      &lt;button id="a" className="rounded border px-3" onClick={() =&gt; setN(n + 1)}&gt;KhungA state: {n}&lt;/button&gt;
      &lt;ChamTrong /&gt;
    &lt;/div&gt;
  );
}
function KhungB({ children }: { children: React.ReactNode }) {
  const [n, setN] = useState(0);
  return (
    &lt;div className="rounded border p-2"&gt;
      &lt;button id="b" className="rounded border px-3" onClick={() =&gt; setN(n + 1)}&gt;KhungB state: {n}&lt;/button&gt;
      {children}
    &lt;/div&gt;
  );
}

export default function Vo() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;KhungA /&gt;
      &lt;KhungB&gt;
        &lt;ChamNgoai /&gt;
      &lt;/KhungB&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">KhungA state: 3
ChamTrong (vẽ TRONG KhungA) render: 4
KhungB state: 3
ChamNgoai (truyền làm children) render: 1</div>
<p><code>ChamNgoai</code>'s element was created by the parent, which never re-rendered, so React skipped it. Chapter 7 explains the mechanism; Chapter 9 reuses this exact pattern to put Server Components inside Client Components.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">node panel.cjs
node children.cjs
node quen.cjs; echo "exit=$?"
npx tsc --noEmit
npm run build &amp;&amp; npm start  <span class="tok-comment">  # open /ghep, then /vo and click each button 3 times</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-2-props" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.2 — Props, TypeScript types, children</span><span class="lc-sub">The same topic in the React course, deeper</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-2-memo" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.2 — memo, useMemo, useCallback</span><span class="lc-sub">Measure re-renders before optimising — ties to the bonus above</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-5-1-components-props" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 5.1 — Components and props</span><span class="lc-sub">The university-course view: children and composition</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">children</span><span class="v">The special prop holding whatever JSX a component wraps.</span></div>
  <div class="kv"><span class="k">Composition</span><span class="v">Building UI by nesting components, not by adding more props.</span></div>
  <div class="kv"><span class="k">Slot</span><span class="v">A named place to pass JSX in (via a prop) beyond <code>children</code>.</span></div>
  <div class="kv"><span class="k">Wrapper component</span><span class="v">A component whose job is to frame its <code>children</code>.</span></div>
  <div class="kv"><span class="k">Configuration vs composition</span><span class="v">Many boolean props vs passing the pieces directly.</span></div>
  <div class="kv"><span class="k">Render prop</span><span class="v">A prop that is a function returning JSX (an advanced slot).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>children</code> is a built-in prop holding the JSX a component wraps.</li><li>Composition — nesting components — scales better than adding ever more props.</li><li>Pass extra JSX through named props when you need more than one slot.</li><li>Reach for composition before a long list of configuration props.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Component như cái hộp chứa: prop <code>children</code></h2>
<p class="lead">Có lúc một component không nên tự quyết nội dung của nó — nó nên cung cấp một hình dạng và để người gọi lấp đầy. React có một prop đặc biệt cho việc này: bất kỳ JSX nào bạn lồng giữa hai thẻ của một component đều tới dưới dạng prop <code>children</code>.</p>

<h3>Bất kỳ thứ gì bạn lồng đều thành <code>children</code></h3>
<pre><code class="language-typescript">function Panel({ title, children }) {
  return (
    &lt;section className="panel"&gt;
      &lt;h2&gt;{title}&lt;/h2&gt;
      &lt;div className="body"&gt;{children}&lt;/div&gt;
    &lt;/section&gt;
  );
}

<span class="tok-comment">// người gọi — &lt;p&gt; và &lt;button&gt; trở thành children của Panel</span>
&lt;Panel title="Hi"&gt;
  &lt;p&gt;inner text&lt;/p&gt;
  &lt;button&gt;OK&lt;/button&gt;
&lt;/Panel&gt;</code></pre>
<p>Render thật:</p>
<div class="out">&lt;section class="panel"&gt;&lt;h2&gt;Hi&lt;/h2&gt;&lt;div class="body"&gt;&lt;p&gt;inner text&lt;/p&gt;&lt;button&gt;OK&lt;/button&gt;&lt;/div&gt;&lt;/section&gt;</div>
<p><code>Panel</code> biết cách vẽ một cái hộp có tiêu đề và một thân; nó <em>không</em> biết và không quan tâm cái gì nằm trong thân. Người gọi quyết. Đây là khuôn mẫu hữu ích bậc nhất trong React: một component sở hữu cái <em>khung</em> và giao cái <em>nội dung</em>.</p>

<h3>Ghép thắng cấu hình</h3>
<p>Không có <code>children</code>, người ta cố bắt một component làm mọi thứ qua một đống props:</p>
<pre><code class="language-typescript"><span class="tok-comment">// ❌ một component cố làm tất cả qua props</span>
&lt;Card
  title="Hi"
  bodyText="inner text"
  showButton={true}
  buttonLabel="OK"
  buttonVariant="primary"
/&gt;</code></pre>
<p>Mỗi nhu cầu mới lại thêm một prop, và component phình thành một bảng điều khiển không đọc nổi. Ghép lật ngược điều đó: đưa cho người gọi một chỗ trống và để họ bỏ một cái nút thật vào. Bạn có sự linh hoạt vô hạn mà không thêm prop nào, vì sự linh hoạt nằm trong JSX người gọi lồng vào, không phải trong API của component.</p>

<h3>React không có kế thừa — nó có ghép</h3>
<p>Nếu bạn đến từ class, bạn có thể định "ButtonBase, rồi PrimaryButton kế thừa nó". React không hoạt động vậy và không cần vậy. Để chuyên biệt hoá một component, bạn <em>bọc</em> hoặc <em>cấu hình</em> nó, chứ không kế thừa:</p>
<pre><code class="language-typescript">function PrimaryButton({ children, ...rest }) {
  return &lt;button className="btn btn-primary" {...rest}&gt;{children}&lt;/button&gt;;
}</code></pre>
<p>Đó là "PrimaryButton là một Button với các mặc định này" diễn đạt bằng ghép. Hướng dẫn chính thức nói thẳng: <em>ưu tiên ghép hơn kế thừa.</em> Qua nhiều năm React thật, bạn về cơ bản sẽ không bao giờ viết một cây kế thừa component.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào</strong> — site đầy những component khung-và-chỗ-trống: một modal render lớp phủ, một nút đóng và một header có tiêu đề, rồi thả <code>{children}</code> vào giữa; một vỏ card cho padding, viền và hiệu ứng hover, để mỗi tính năng lấp đầy nó. Khi bạn thấy cùng một cái hộp thị giác bao quanh những nội dung rất khác nhau — một luồng tin nhắn, một bảng cài đặt, một quiz — đó là một component dựa trên <code>children</code> làm tất cả.</p>
</div>
<h3>Ghép thay vì cấu hình</h3>
<div class="lz-map">
  <div class="lz-stage">Hai cách dựng một component linh hoạt</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Đường props</div><div class="lz-nsub">&#96;&lt;Card title icon footer showBorder /&gt;&#96;. Mỗi nhu cầu mới lại thêm một prop, và sau mười cái thì chẳng ai biết tổ hợp nào là hợp lệ.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Đường children</div><div class="lz-nsub">&#96;&lt;Card&gt;&lt;CardTitle/&gt;…&lt;/Card&gt;&#96;. Chỗ gọi tự cấp nội dung, nên cái thẻ chẳng bao giờ cần biết bên trong nó có gì.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Nhiều ô thì nhiều prop</div><div class="lz-nsub">Khi bạn cần hai chỗ trống, hãy truyền element làm prop: &#96;&lt;Layout sidebar={&lt;Nav/&gt;} main={&lt;Feed/&gt;} /&gt;&#96;. Element là những giá trị bình thường.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Ghép thì tránh được prop drilling</div><div class="lz-nsub">Một component bọc chỉ vẽ &#96;children&#96; sẽ chẳng bao giờ chạm vào dữ liệu bên trong chúng, nên không có gì phải luồn qua nó.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một component có danh sách props cứ dài mãi ra để đỡ các ca mới.</strong> &#96;&lt;Modal title confirmText cancelText showClose hideFooter danger wide /&gt;&#96; bắt đầu bằng ba boolean và kết thúc thành một component chẳng ai dám sửa, vì prop nào cũng có thể tương tác với prop nào. Triệu chứng cần để ý là một boolean được thêm vào chỉ để phục vụ đúng một chỗ gọi. Thấy nó thì hãy lật ngược thiết kế: để modal vẽ &#96;children&#96; và để từng chỗ gọi tự ghép thứ nó cần. Bạn đánh đổi vài dòng ở chỗ gọi lấy một component không còn tổ hợp nào phải kiểm — và các chỗ gọi từ đó làm được cả những thứ bạn chưa từng lường trước.</p></div>
<a class="link-card dl" href="https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">react.dev — Truyền JSX làm children</span><span class="lc-sub">Prop children, và vì sao nó cũng chỉ là một prop như mọi prop khác.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/thinking-in-react" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">react.dev — Tư duy kiểu React</span><span class="lc-sub">Ranh giới component đến từ đâu, và làm sao nhận ra một ranh giới đặt sai.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng một <code>&lt;Card&gt;</code> render <code>{children}</code> trong một hộp có style, rồi bọc ba mảng JSX khác nhau bằng nó.</li>
<li>Thêm một khe (slot) có tên bằng cách truyền JSX qua một prop (ví dụ <code>header={...}</code>) song song với <code>children</code>.</li>
<li>Tái cấu trúc một component nhận mười prop xuống còn một cái nhận <code>children</code> — để ý vì sao ghép thắng cấu hình.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn truyền được JSX qua <code>children</code> và một prop có tên, và ưu tiên ghép hơn một đống prop.</p></div>

<h3>🔬 Đo thật: children trên React 19.3.0 / Next.js 16.4.6</h3>
<p>Ví dụ Panel ở trên, render thật — kết quả khớp:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
function Panel({ title, children }) {
  return h('section', { className: 'panel' }, h('h2', null, title), h('div', { className: 'body' }, children));
}
<span class="tok-comment">// &lt;Panel title="Hi"&gt;&lt;p&gt;inner text&lt;/p&gt;&lt;button&gt;OK&lt;/button&gt;&lt;/Panel&gt;</span>
console.log(renderToStaticMarkup(h(Panel, { title: 'Hi' }, h('p', null, 'inner text'), h('button', null, 'OK'))));</code></pre><pre><code class="language-bash">$ node panel.cjs</code></pre><div class="out">&lt;section class="panel"&gt;&lt;h2&gt;Hi&lt;/h2&gt;&lt;div class="body"&gt;&lt;p&gt;inner text&lt;/p&gt;&lt;button&gt;OK&lt;/button&gt;&lt;/div&gt;&lt;/section&gt;</div>
<p>Bạn đã dùng <code>children</code> từ bài 0.3: layout gốc do <code>create-next-app</code> sinh ra nhận nó, và Next.js truyền trang của mỗi địa chỉ vào làm <code>children</code>:</p>
<pre><code class="language-bash">$ grep -n -A9 'export default function RootLayout' src/app/layout.tsx</code></pre><div class="out">20:export default function RootLayout({ children }: LayoutProps&lt;"/"&gt;) {
21-  return (
22-    &lt;html
23-      lang="en"
24-      className={&#96;\${geistSans.variable} \${geistMono.variable} h-full antialiased&#96;}
25-    &gt;
26-      &lt;body className="min-h-full flex flex-col"&gt;{children}&lt;/body&gt;
27-    &lt;/html&gt;
28-  );
29-}</div>
<p>Component thật sự nhận được gì — <b>không phải lúc nào cũng là mảng</b>. Đừng gọi <code>children.map</code>; cứ render nó, hoặc dùng bộ hàm <code>React.Children</code>:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;             <span class="tok-comment">  // JSX &lt;X a="1"&gt;…&lt;/X&gt;  =  h(X, { a: '1' }, …)</span>
let nhan;
function Hop({ children }) {
  nhan = children;                         <span class="tok-comment">  // ghi lại đúng thứ component nhận được</span>
  return null;
}
const ta = (c) =&gt; c === undefined ? 'undefined' : Array.isArray(c) ? &#96;mảng \${c.length} phần tử&#96; : typeof c === 'object' ? &#96;1 element &lt;\${c.type}&gt;&#96; : &#96;\${typeof c} '\${c}'&#96;;
const thu = [
  ['&lt;Hop /&gt;', h(Hop)],
  ['&lt;Hop&gt;chào&lt;/Hop&gt;', h(Hop, null, 'chào')],
  ['&lt;Hop&gt;&lt;p /&gt;&lt;/Hop&gt;', h(Hop, null, h('p'))],
  ['&lt;Hop&gt;&lt;p /&gt;&lt;b /&gt;&lt;/Hop&gt;', h(Hop, null, h('p'), h('b'))],
  ['&lt;Hop children={&lt;p /&gt;} /&gt;', h(Hop, { children: h('p') })],
];
for (const [jsx, el] of thu) {
  renderToStaticMarkup(el);
  console.log(jsx.padEnd(26), '→', ta(nhan), '· Children.count =', React.Children.count(nhan));
}</code></pre><pre><code class="language-bash">$ node children.cjs</code></pre><div class="out">&lt;Hop /&gt;                    → undefined · Children.count = 0
&lt;Hop&gt;chào&lt;/Hop&gt;            → string 'chào' · Children.count = 1
&lt;Hop&gt;&lt;p /&gt;&lt;/Hop&gt;           → 1 element &lt;p&gt; · Children.count = 1
&lt;Hop&gt;&lt;p /&gt;&lt;b /&gt;&lt;/Hop&gt;      → mảng 2 phần tử · Children.count = 2
&lt;Hop children={&lt;p /&gt;} /&gt;   → 1 element &lt;p&gt; · Children.count = 1</div>
<p>Hai bẫy im lặng. Panel quên <code>{{children}}</code> làm mất nội dung mà không lỗi (mã thoát 0); TypeScript bắt các lỗi hình dạng — không khai children (TS2322), children hai lần (TS2710), thiếu children bắt buộc (TS2741):</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
function Panel({ title }) {                <span class="tok-comment">  // ✗ quên {children}</span>
  return h('section', null, h('h2', null, title));
}
console.log(renderToStaticMarkup(h(Panel, { title: 'Hi' }, h('p', null, 'inner text'), h('button', null, 'OK'))));</code></pre><pre><code class="language-bash">$ node quen.cjs 2&gt;&amp;1; echo "exit=$?"</code></pre><div class="out">&lt;section&gt;&lt;h2&gt;Hi&lt;/h2&gt;&lt;/section&gt;
exit=0</div>
<pre><code class="language-tsx">function Title({ text }: { text: string }) {
  return &lt;h2&gt;{text}&lt;/h2&gt;;
}
function Hop({ children }: { children: React.ReactNode }) {
  return &lt;div&gt;{children}&lt;/div&gt;;
}
export const a = &lt;Title text="Hi"&gt;thêm chữ&lt;/Title&gt;;
export const b = &lt;Hop children={&lt;p&gt;A&lt;/p&gt;}&gt;&lt;p&gt;B&lt;/p&gt;&lt;/Hop&gt;;
export const c = &lt;Hop /&gt;;</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/thu22/bay.tsx(7,19): error TS2322: Type '{ children: string; text: string; }' is not assignable to type 'IntrinsicAttributes &amp; { text: string; }'.
  Property 'children' does not exist on type 'IntrinsicAttributes &amp; { text: string; }'.
src/thu22/bay.tsx(8,23): error TS2710: 'children' are specified twice. The attribute named 'children' will be overwritten.
src/thu22/bay.tsx(9,19): error TS2741: Property 'children' is missing in type '{}' but required in type '{ children: ReactNode; }'.</div>
<p>Trên trình duyệt thật (<code>next build</code> + <code>next start</code>): một Panel bọc ba nội dung khác nhau, và một Layout có hai khe có tên:</p>
<pre><code class="language-tsx">type Co = { children: React.ReactNode };

function Panel({ title, children }: { title: string } &amp; Co) {
  return (
    &lt;section className="panel rounded-xl border-2 border-sky-500 bg-white shadow"&gt;
      &lt;h2 className="rounded-t-lg bg-sky-500 px-4 py-1 font-bold text-white"&gt;{title}&lt;/h2&gt;
      &lt;div className="body p-4"&gt;{children}&lt;/div&gt;
    &lt;/section&gt;
  );
}

type Slots = { sidebar: React.ReactNode; main: React.ReactNode };

function Layout({ sidebar, main }: Slots) {
  return (
    &lt;div className="grid grid-cols-[150px_1fr] gap-3"&gt;
      &lt;aside className="rounded-xl bg-slate-100 p-3"&gt;{sidebar}&lt;/aside&gt;
      &lt;main&gt;{main}&lt;/main&gt;
    &lt;/div&gt;
  );
}

export default function Ghep() {
  return (
    &lt;div className="space-y-3 bg-slate-50 p-5 font-sans text-sm text-slate-900"&gt;
      &lt;div className="grid grid-cols-3 gap-3"&gt;
        &lt;Panel title="Tin nhắn"&gt;
          &lt;p&gt;An: tối nay họp nhé?&lt;/p&gt;
          &lt;p className="text-right"&gt;Bình: ok 8h&lt;/p&gt;
        &lt;/Panel&gt;
        &lt;Panel title="Cài đặt"&gt;
          &lt;label className="block"&gt;&lt;input type="checkbox" defaultChecked /&gt; Thông báo&lt;/label&gt;
          &lt;label className="block"&gt;&lt;input type="checkbox" /&gt; Chế độ tối&lt;/label&gt;
        &lt;/Panel&gt;
        &lt;Panel title="Quiz"&gt;
          &lt;p&gt;2 + 2 = ?&lt;/p&gt;
          &lt;button className="mt-1 rounded bg-sky-500 px-3 text-white"&gt;4&lt;/button&gt;
        &lt;/Panel&gt;
      &lt;/div&gt;
      &lt;Layout
        sidebar={&lt;nav className="space-y-1"&gt;&lt;p&gt;🏠 Trang chủ&lt;/p&gt;&lt;p&gt;📚 Khoá học&lt;/p&gt;&lt;/nav&gt;}
        main={&lt;Panel title="Bảng tin"&gt;&lt;p&gt;Hai khe: sidebar và main&lt;/p&gt;&lt;/Panel&gt;}
      /&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Phần thưởng — children không vẽ lại theo khung. Mỗi khung có bộ đếm riêng; bấm mỗi nút 3 lần:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

let demTrong = 0;
let demNgoai = 0;

function ChamTrong() {
  demTrong++;
  return &lt;p id="trong"&gt;ChamTrong (vẽ TRONG KhungA) render: {demTrong}&lt;/p&gt;;
}
function ChamNgoai() {
  demNgoai++;
  return &lt;p id="ngoai"&gt;ChamNgoai (truyền làm children) render: {demNgoai}&lt;/p&gt;;
}

function KhungA() {
  const [n, setN] = useState(0);
  return (
    &lt;div className="rounded border p-2"&gt;
      &lt;button id="a" className="rounded border px-3" onClick={() =&gt; setN(n + 1)}&gt;KhungA state: {n}&lt;/button&gt;
      &lt;ChamTrong /&gt;
    &lt;/div&gt;
  );
}
function KhungB({ children }: { children: React.ReactNode }) {
  const [n, setN] = useState(0);
  return (
    &lt;div className="rounded border p-2"&gt;
      &lt;button id="b" className="rounded border px-3" onClick={() =&gt; setN(n + 1)}&gt;KhungB state: {n}&lt;/button&gt;
      {children}
    &lt;/div&gt;
  );
}

export default function Vo() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;KhungA /&gt;
      &lt;KhungB&gt;
        &lt;ChamNgoai /&gt;
      &lt;/KhungB&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">KhungA state: 3
ChamTrong (vẽ TRONG KhungA) render: 4
KhungB state: 3
ChamNgoai (truyền làm children) render: 1</div>
<p>Element <code>ChamNgoai</code> do cha tạo, mà cha không vẽ lại, nên React bỏ qua nó. Chương 7 giải thích cơ chế; Chương 9 dùng đúng mẫu này để đặt Server Component bên trong Client Component.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">node panel.cjs
node children.cjs
node quen.cjs; echo "exit=$?"
npx tsc --noEmit
npm run build &amp;&amp; npm start  <span class="tok-comment">  # mở /ghep, rồi /vo và bấm mỗi nút 3 lần</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-2-props" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.2 — Props, kiểu TypeScript, children</span><span class="lc-sub">Cùng chủ đề trong khoá React, đi sâu hơn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-2-memo" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.2 — memo, useMemo, useCallback</span><span class="lc-sub">Đo lần vẽ lại trước khi tối ưu — nối với phần thưởng bên trên</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-5-1-components-props" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 5.1 — Component và props</span><span class="lc-sub">Góc nhìn môn học ở trường: children và ghép</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">children</span><span class="v">Prop đặc biệt chứa bất kỳ JSX nào mà một component bọc quanh.</span></div>
  <div class="kv"><span class="k">Ghép (composition)</span><span class="v">Dựng UI bằng cách lồng component, không phải thêm prop.</span></div>
  <div class="kv"><span class="k">Slot (khe)</span><span class="v">Một chỗ có tên để truyền JSX vào (qua prop) ngoài <code>children</code>.</span></div>
  <div class="kv"><span class="k">Component vỏ bọc</span><span class="v">Component có nhiệm vụ đóng khung cho <code>children</code> của nó.</span></div>
  <div class="kv"><span class="k">Cấu hình vs ghép</span><span class="v">Nhiều prop boolean so với truyền thẳng các mảnh vào.</span></div>
  <div class="kv"><span class="k">Render prop</span><span class="v">Một prop là hàm trả về JSX (một slot nâng cao).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>children</code> là prop có sẵn chứa JSX mà component bọc quanh.</li><li>Ghép — lồng component — mở rộng tốt hơn là thêm mãi prop.</li><li>Truyền JSX phụ qua prop có tên khi bạn cần nhiều hơn một khe.</li><li>Hãy nghĩ đến ghép trước khi dựng một danh sách dài prop cấu hình.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — Prop patterns: defaults, spread, callbacks & types|||2.3 — Khuôn props: mặc định, spread, callback & kiểu',
      slug: 'nextjs-2-3-khuon-props',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Giá trị mặc định, spread {...props}, truyền hàm để con báo lên cha, và gõ kiểu props bằng TypeScript.',
      content: `
${G02_3}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The four prop patterns you use every day</h2>
<p class="lead">Props are just an object, so everything you know about JavaScript objects applies: defaults, spreading, functions as values. Four patterns cover the vast majority of real components.</p>

<h3>1 · Default values</h3>
<p>Give a prop a fallback right in the destructuring, so callers can omit it:</p>
<pre><code class="language-typescript">function Badge({ label = 'New' }) {
  return &lt;span className="badge"&gt;{label}&lt;/span&gt;;
}</code></pre>
<p>Verified: <code>&lt;Badge /&gt;</code> renders <span class="out" style="display:inline">&lt;span class="badge"&gt;New&lt;/span&gt;</span> and <code>&lt;Badge label="Hot" /&gt;</code> renders <span class="out" style="display:inline">&lt;span class="badge"&gt;Hot&lt;/span&gt;</span>. This is plain JavaScript default-parameter syntax; there is no React-specific mechanism to learn.</p>

<h3>2 · Spreading props through</h3>
<p>When a wrapper wants to forward arbitrary props to the element underneath it, gather the rest with <code>...</code> and spread them:</p>
<pre><code class="language-typescript">function Input({ label, ...rest }) {
  return (
    &lt;label&gt;
      {label}
      &lt;input {...rest} /&gt;   <span class="tok-comment">// type, placeholder, value, onChange… all forwarded</span>
    &lt;/label&gt;
  );
}

&lt;Input label="Email" type="email" placeholder="you@site.com" /&gt;</code></pre>
<p><code>{...rest}</code> spreads every prop you didn't pull out by name onto the <code>&lt;input&gt;</code>. It keeps wrappers thin — you don't re-declare <code>type</code>, <code>placeholder</code>, <code>value</code>, <code>onChange</code> one by one. Use it deliberately, though: spreading unknown props onto a DOM element can forward props that shouldn't be there.</p>

<h3>3 · Passing functions down so children can talk back</h3>
<p>Props flow down, but a child often needs to tell its parent something happened — a click, a submitted form. The parent passes a <em>function</em> down as a prop; the child calls it. Data down, events up:</p>
<pre><code class="language-typescript">function SearchBar({ onSearch }) {
  return &lt;button onClick={() =&gt; onSearch('react')}&gt;Search&lt;/button&gt;;
}

function Page() {
  return &lt;SearchBar onSearch={(q) =&gt; console.log('searching', q)} /&gt;;
}</code></pre>
<p><code>SearchBar</code> doesn't know what searching means — it just calls <code>onSearch</code> when clicked. <code>Page</code> owns the behaviour and hands it down. This "callback prop" is how every interactive child communicates upward, and it is the bridge to state in Chapter 3, where the parent's callback will call <code>setState</code>.</p>

<h3>4 · Typing props with TypeScript</h3>
<p>This course and cuongthai.com use TypeScript, so a component declares the exact shape of its props. It documents the component and catches a whole class of bugs — a missing prop, a string where a number was expected — before the app ever runs:</p>
<pre><code class="language-typescript">type BadgeProps = {
  label?: string;          <span class="tok-comment">// optional</span>
  tone: 'info' | 'warn';   <span class="tok-comment">// required, only these two values</span>
};

function Badge({ label = 'New', tone }: BadgeProps) {
  return &lt;span className={&#96;badge badge-\${tone}&#96;}&gt;{label}&lt;/span&gt;;
}</code></pre>
<p>Now <code>&lt;Badge /&gt;</code> is a compile error (missing <code>tone</code>), and <code>&lt;Badge tone="danger" /&gt;</code> is a compile error (not one of the allowed values). The editor autocompletes the props too. We don't teach TypeScript from scratch here, but every example is typed the way a real codebase types it.</p>
<h3>Typing a component's props</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Name the shape once</b> — &#96;type CardProps = { title: string; onClose?: () =&gt; void }&#96;. One declaration checks every call site in the project.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Annotate the parameter, not the function</b> — &#96;function Card({ title }: CardProps)&#96;. You will often read “avoid &#96;React.FC&#96;, it implicitly adds &#96;children&#96;” — that was true for @types/react 17; with today's React 19 types &#96;FC&lt;{ title: string }&gt;&#96; has <b>no</b> &#96;children&#96; (nesting content is TS2322, measured below). Annotating the parameter is still simpler.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Optional props need a default</b> — &#96;{ size = &#39;md&#39; }&#96; in the destructuring. The type says it may be absent; the default means the body never has to check.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>children is React.ReactNode</b> — The widest renderable type — elements, strings, numbers, arrays, &#96;null&#96;. Only add it when the component actually renders it.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — typing a prop as &#96;any&#96; to make a red squiggle go away.</strong> &#96;function Chart({ data }: { data: any })&#96; compiles, and it turns off checking for everything downstream: &#96;data.points.map(…)&#96; is unchecked, whatever it returns is unchecked, and the &#96;any&#96; travels into any variable that touches it. The crash arrives later, in a component that never mentioned &#96;any&#96;. When you genuinely do not know the shape, &#96;unknown&#96; is the honest choice — it forces a check at the point where you do know. And when the shape comes from an API, type it from a schema so the check is real rather than declared.</p></div>
<a class="link-card dl" href="https://react.dev/learn/typescript" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">react.dev — Using TypeScript with React</span><span class="lc-sub">Typing props, hooks, events and children, with the idiomatic patterns.</span></span>
</a>
<a class="link-card dl" href="https://react-typescript-cheatsheet.netlify.app/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">React TypeScript Cheatsheet</span><span class="lc-sub">The community reference for &quot;how do I type this?&quot; — searchable, and current.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Type a component's props with a TypeScript <code>type</code>, marking one prop optional and giving it a default.</li>
<li>Pass a handler prop (<code>onSelect</code>) from parent to child and call it from the child on click.</li>
<li>Spread a props object into a child (<code>&lt;Btn {...rest} /&gt;</code>) and explain one risk of spreading unknown props.</li>
</ol>
<p><strong>Done when:</strong> you can type props, pass callbacks up, and spread props while knowing the risk.</p></div>

<h3>🔬 Measured: props patterns on React 19.3.0</h3>
<p>Defaults fire <b>only for <code>undefined</code></b> — <code>null</code> and <code>""</code> are values the parent passed, so the badge comes out empty. If <code>null</code> must fall back too, write <code>label ?? 'New'</code> in the body:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
function Badge({ label = 'New' }) {
  return h('span', { className: 'badge' }, label);
}
const thu = [
  ['&lt;Badge /&gt;', {}],
  ['&lt;Badge label="Hot" /&gt;', { label: 'Hot' }],
  ['&lt;Badge label={undefined} /&gt;', { label: undefined }],
  ['&lt;Badge label={null} /&gt;', { label: null }],
  ['&lt;Badge label="" /&gt;', { label: '' }],
];
for (const [jsx, props] of thu) console.log(jsx.padEnd(28), '→', renderToStaticMarkup(h(Badge, props)));</code></pre><pre><code class="language-bash">$ node badge.cjs</code></pre><div class="out">&lt;Badge /&gt;                    → &lt;span class="badge"&gt;New&lt;/span&gt;
&lt;Badge label="Hot" /&gt;        → &lt;span class="badge"&gt;Hot&lt;/span&gt;
&lt;Badge label={undefined} /&gt;  → &lt;span class="badge"&gt;New&lt;/span&gt;
&lt;Badge label={null} /&gt;       → &lt;span class="badge"&gt;&lt;/span&gt;
&lt;Badge label="" /&gt;           → &lt;span class="badge"&gt;&lt;/span&gt;</div>
<p>Spread, in development: an unknown prop leaks to the DOM element (React warns and drops it), and whatever is written <b>last</b> wins:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
function Input({ label, ...rest }) {
  return h('label', null, label, h('input', rest));        <span class="tok-comment">  // &lt;input {...rest} /&gt;</span>
}
console.log(renderToStaticMarkup(h(Input, { label: 'Email', type: 'email', placeholder: 'you@site.com' })));
console.log(renderToStaticMarkup(h(Input, { label: 'Email', isActive: true }))); <span class="tok-comment">  // prop lạ lọt xuống &lt;input&gt;</span>
function NutA(props) { return h('button', { ...props, type: 'button' }); }     <span class="tok-comment">  // &lt;button {...props} type="button"&gt;</span>
function NutB(props) { return h('button', { type: 'button', ...props }); }     <span class="tok-comment">  // &lt;button type="button" {...props}&gt;</span>
console.log('NutA:', renderToStaticMarkup(h(NutA, { type: 'submit' }, 'Gửi')));
console.log('NutB:', renderToStaticMarkup(h(NutB, { type: 'submit' }, 'Gửi')));</code></pre><pre><code class="language-bash">$ NODE_ENV=development node spread.cjs 2&gt;&amp;1</code></pre><div class="out">&lt;label&gt;Email&lt;input type="email" placeholder="you@site.com"/&gt;&lt;/label&gt;
React does not recognize the &#96;isActive&#96; prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase &#96;isactive&#96; instead. If you accidentally passed it from a parent component, remove it from the DOM element.
&lt;label&gt;Email&lt;input/&gt;&lt;/label&gt;
NutA: &lt;button type="button"&gt;Gửi&lt;/button&gt;
NutB: &lt;button type="submit"&gt;Gửi&lt;/button&gt;</div>
<p>Typing props — four real tsc errors: missing required <code>tone</code> (TS2741), a value outside the union (TS2322), <code>React.FC</code> without <code>children</code> (TS2322 — the old “FC adds children” advice is outdated), and <code>unknown</code> forcing a check (TS18046). Note: the <code>any</code> line compiles silently:</p>
<pre><code class="language-tsx">import type { FC } from 'react';

type BadgeProps = {
  label?: string;        <span class="tok-comment">  // tuỳ chọn</span>
  tone: 'info' | 'warn'; <span class="tok-comment">  // bắt buộc, chỉ hai giá trị này</span>
};
function Badge({ label = 'New', tone }: BadgeProps) {
  return &lt;span className={&#96;badge badge-\${tone}&#96;}&gt;{label}&lt;/span&gt;;
}
export const a = &lt;Badge /&gt;;
export const b = &lt;Badge tone="danger" /&gt;;
export const c = &lt;Badge tone="info" /&gt;;

const Card: FC&lt;{ title: string }&gt; = ({ title }) =&gt; &lt;h2&gt;{title}&lt;/h2&gt;;
export const d = &lt;Card title="Hi"&gt;nội dung&lt;/Card&gt;;

function Chart({ data }: { data: any }) {
  return &lt;p&gt;{data.points.map((p: number) =&gt; p * 2).join(',')}&lt;/p&gt;;
}
export const e = &lt;Chart data={{}} /&gt;;

function Chart2({ data }: { data: unknown }) {
  return &lt;p&gt;{data.points.join(',')}&lt;/p&gt;;
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/thu23/kieu.tsx(10,19): error TS2741: Property 'tone' is missing in type '{}' but required in type 'BadgeProps'.
src/thu23/kieu.tsx(11,25): error TS2322: Type '"danger"' is not assignable to type '"info" | "warn"'.
src/thu23/kieu.tsx(15,19): error TS2322: Type '{ children: string; title: string; }' is not assignable to type 'IntrinsicAttributes &amp; { title: string; }'.
  Property 'children' does not exist on type 'IntrinsicAttributes &amp; { title: string; }'.
src/thu23/kieu.tsx(23,14): error TS18046: 'data' is of type 'unknown'.</div>
<p>…and then crashes at runtime:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function Chart({ data }) {                  <span class="tok-comment">  // data: any — tsc không kiểm gì</span>
  return React.createElement('p', null, data.points.map((p) =&gt; p * 2).join(','));
}
try {
  console.log(renderToStaticMarkup(React.createElement(Chart, { data: {} })));
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}</code></pre><pre><code class="language-bash">$ node any.cjs</code></pre><div class="out">TypeError: Cannot read properties of undefined (reading 'map')</div>
<p>A callback prop in a real browser (<code>next build</code> + <code>next start</code>), clicked react · next · react:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

type Props = { onSearch: (q: string) =&gt; void };

function SearchBar({ onSearch }: Props) {
  return (
    &lt;div className="flex gap-2"&gt;
      &lt;button id="r" className="rounded border px-3" onClick={() =&gt; onSearch('react')}&gt;Search react&lt;/button&gt;
      &lt;button id="n" className="rounded border px-3" onClick={() =&gt; onSearch('next')}&gt;Search next&lt;/button&gt;
    &lt;/div&gt;
  );
}

export default function Tim() {
  const [log, setLog] = useState&lt;string[]&gt;([]);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;SearchBar onSearch={(q) =&gt; setLog((cu) =&gt; [...cu, &#96;searching \${q}&#96;])} /&gt;
      &lt;p id="dem"&gt;Page nhận {log.length} lần gọi&lt;/p&gt;
      &lt;ol id="log" className="list-decimal pl-6"&gt;
        {log.map((x, i) =&gt; &lt;li key={i}&gt;{x}&lt;/li&gt;)}
      &lt;/ol&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">Page nhận 3 lần gọi
searching react
searching next
searching react</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">node badge.cjs
NODE_ENV=development node spread.cjs 2&gt;&amp;1
npx tsc --noEmit
node any.cjs
npm run build &amp;&amp; npm start  <span class="tok-comment">  # open /tim and click the buttons</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-2-props" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.2 — Props and their TypeScript types</span><span class="lc-sub">The same topic in the React course, deeper</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-3-1-tham-so" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript · 3.1 — Typing parameters: required, optional, default, rest</span><span class="lc-sub">The ground under defaults and ...rest</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-1-4-any-unknown" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript · 1.4 — any, unknown</span><span class="lc-sub">Why unknown is the honest choice</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-5-4-slot13-proptypes-slides" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 5.4 — PropTypes (Slot 13)</span><span class="lc-sub">The university-course view: validating props</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Prop types</span><span class="v">A TypeScript <code>type</code>/<code>interface</code> describing a component's inputs.</span></div>
  <div class="kv"><span class="k">Optional prop</span><span class="v"><code>prop?: T</code> — may be omitted; often paired with a default.</span></div>
  <div class="kv"><span class="k">Default value</span><span class="v">A fallback set via destructuring (<code>{ size = &quot;md&quot; }</code>).</span></div>
  <div class="kv"><span class="k">Callback prop</span><span class="v">A function prop a child calls to send events/data up.</span></div>
  <div class="kv"><span class="k">Spread props</span><span class="v"><code>{...rest}</code> forwards many props at once.</span></div>
  <div class="kv"><span class="k">Prop drilling</span><span class="v">Passing a prop through layers that do not use it (a smell).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Type props with a TypeScript <code>type</code>; mark optional ones with <code>?</code> and give defaults when destructuring.</li><li>Children talk back to parents through callback props (<code>onSelect</code>, <code>onChange</code>).</li><li><code>{...rest}</code> forwards props in bulk — convenient, but spreading unknown props can leak invalid attributes.</li><li>Too much prop drilling is a sign to use composition or context (Chapter 6).</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Bốn khuôn props bạn dùng mỗi ngày</h2>
<p class="lead">Props chỉ là một object, nên mọi thứ bạn biết về object JavaScript đều áp dụng: mặc định, spread, hàm làm giá trị. Bốn khuôn mẫu bao phần lớn các component thật.</p>

<h3>1 · Giá trị mặc định</h3>
<p>Cho một prop một giá trị dự phòng ngay trong destructuring, để người gọi có thể bỏ qua:</p>
<pre><code class="language-typescript">function Badge({ label = 'New' }) {
  return &lt;span className="badge"&gt;{label}&lt;/span&gt;;
}</code></pre>
<p>Đã kiểm: <code>&lt;Badge /&gt;</code> render <span class="out" style="display:inline">&lt;span class="badge"&gt;New&lt;/span&gt;</span> còn <code>&lt;Badge label="Hot" /&gt;</code> render <span class="out" style="display:inline">&lt;span class="badge"&gt;Hot&lt;/span&gt;</span>. Đây là cú pháp tham số mặc định thuần JavaScript; không có cơ chế riêng của React phải học.</p>

<h3>2 · Spread props xuyên qua</h3>
<p>Khi một wrapper muốn chuyển tiếp các props tuỳ ý xuống element bên dưới, gom phần còn lại bằng <code>...</code> rồi spread chúng:</p>
<pre><code class="language-typescript">function Input({ label, ...rest }) {
  return (
    &lt;label&gt;
      {label}
      &lt;input {...rest} /&gt;   <span class="tok-comment">// type, placeholder, value, onChange… đều được chuyển tiếp</span>
    &lt;/label&gt;
  );
}

&lt;Input label="Email" type="email" placeholder="you@site.com" /&gt;</code></pre>
<p><code>{...rest}</code> spread mọi prop bạn không rút ra theo tên lên <code>&lt;input&gt;</code>. Nó giữ wrapper mỏng — bạn không phải khai lại <code>type</code>, <code>placeholder</code>, <code>value</code>, <code>onChange</code> từng cái. Nhưng hãy dùng có chủ đích: spread props không rõ lên một element DOM có thể chuyển tiếp cả những prop không nên có.</p>

<h3>3 · Truyền hàm xuống để con nói ngược lên</h3>
<p>Props chảy xuống, nhưng con thường cần báo cho cha rằng có chuyện xảy ra — một cú click, một form đã gửi. Cha truyền một <em>hàm</em> xuống làm prop; con gọi nó. Dữ liệu xuống, sự kiện lên:</p>
<pre><code class="language-typescript">function SearchBar({ onSearch }) {
  return &lt;button onClick={() =&gt; onSearch('react')}&gt;Search&lt;/button&gt;;
}

function Page() {
  return &lt;SearchBar onSearch={(q) =&gt; console.log('searching', q)} /&gt;;
}</code></pre>
<p><code>SearchBar</code> không biết tìm kiếm nghĩa là gì — nó chỉ gọi <code>onSearch</code> khi được click. <code>Page</code> sở hữu hành vi và trao nó xuống. "Callback prop" này là cách mọi con tương tác giao tiếp lên trên, và là cây cầu tới state ở Chương 3, nơi callback của cha sẽ gọi <code>setState</code>.</p>

<h3>4 · Gõ kiểu props bằng TypeScript</h3>
<p>Khoá này và cuongthai.com dùng TypeScript, nên một component khai đúng hình dạng props của nó. Nó vừa là tài liệu cho component vừa bắt được cả một lớp bug — thiếu prop, một chuỗi ở chỗ đáng lẽ là số — trước khi app kịp chạy:</p>
<pre><code class="language-typescript">type BadgeProps = {
  label?: string;          <span class="tok-comment">// tuỳ chọn</span>
  tone: 'info' | 'warn';   <span class="tok-comment">// bắt buộc, chỉ hai giá trị này</span>
};

function Badge({ label = 'New', tone }: BadgeProps) {
  return &lt;span className={&#96;badge badge-\${tone}&#96;}&gt;{label}&lt;/span&gt;;
}</code></pre>
<p>Giờ <code>&lt;Badge /&gt;</code> là lỗi biên dịch (thiếu <code>tone</code>), và <code>&lt;Badge tone="danger" /&gt;</code> là lỗi biên dịch (không thuộc các giá trị cho phép). Trình soạn thảo cũng tự gợi ý props. Ta không dạy TypeScript từ đầu ở đây, nhưng mọi ví dụ đều được gõ kiểu theo đúng cách một codebase thật gõ.</p>
<h3>Gán kiểu cho props của một component</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Đặt tên cho cái dáng một lần</b> — &#96;type CardProps = { title: string; onClose?: () =&gt; void }&#96;. Một khai báo kiểm mọi chỗ gọi trong dự án.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Chú thích cho tham số, đừng chú thích cho hàm</b> — &#96;function Card({ title }: CardProps)&#96;. Bạn sẽ hay đọc “tránh &#96;React.FC&#96; vì nó ngầm thêm &#96;children&#96;” — điều đó đúng với @types/react 17; với bộ kiểu React 19 hiện nay, &#96;FC&lt;{ title: string }&gt;&#96; <b>không</b> có &#96;children&#96; (lồng nội dung là lỗi TS2322, đo bên dưới). Chú thích thẳng cho tham số vẫn gọn hơn.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Prop tuỳ chọn cần một giá trị mặc định</b> — &#96;{ size = &#39;md&#39; }&#96; ngay trong phép rã. Kiểu nói nó có thể vắng; giá trị mặc định làm phần thân chẳng bao giờ phải kiểm.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>children là React.ReactNode</b> — Kiểu vẽ-được rộng nhất — element, chuỗi, số, mảng, &#96;null&#96;. Chỉ thêm nó khi component thật sự vẽ nó ra.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — gán một prop là &#96;any&#96; cho một vệt gạch đỏ biến mất.</strong> &#96;function Chart({ data }: { data: any })&#96; biên dịch được, và nó tắt việc kiểm cho mọi thứ phía sau: &#96;data.points.map(…)&#96; không được kiểm, thứ nó trả về không được kiểm, và cái &#96;any&#96; ấy đi theo vào mọi biến chạm tới nó. Cú sập tới sau đó, trong một component chưa từng nhắc tới &#96;any&#96;. Khi bạn thật sự không biết cái dáng, &#96;unknown&#96; mới là lựa chọn thành thật — nó ép phải kiểm ở đúng chỗ bạn đã biết. Còn khi cái dáng đến từ một API, hãy gán kiểu từ một schema để phép kiểm là thật chứ không phải chỉ khai ra.</p></div>
<a class="link-card dl" href="https://react.dev/learn/typescript" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">react.dev — Dùng TypeScript với React</span><span class="lc-sub">Gán kiểu cho props, hook, sự kiện và children, theo các mẫu đúng điệu.</span></span>
</a>
<a class="link-card dl" href="https://react-typescript-cheatsheet.netlify.app/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">React TypeScript Cheatsheet</span><span class="lc-sub">Tài liệu tra cứu của cộng đồng cho câu &quot;cái này gán kiểu sao?&quot; — tìm được và cập nhật.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Gõ kiểu cho prop của một component bằng <code>type</code> TypeScript, đánh dấu một prop tuỳ chọn và cho nó mặc định.</li>
<li>Truyền một prop handler (<code>onSelect</code>) từ cha xuống con và gọi nó trong con khi click.</li>
<li>Spread một object prop vào con (<code>&lt;Btn {...rest} /&gt;</code>) và nêu một rủi ro của việc spread prop lạ.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gõ kiểu được prop, truyền callback lên trên, và spread prop mà vẫn biết rủi ro.</p></div>

<h3>🔬 Đo thật: khuôn props trên React 19.3.0</h3>
<p>Giá trị mặc định <b>chỉ áp cho <code>undefined</code></b> — <code>null</code> và <code>""</code> là giá trị cha đã truyền, nên badge ra rỗng. Muốn <code>null</code> cũng lùi về mặc định, viết <code>label ?? 'New'</code> trong thân:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
function Badge({ label = 'New' }) {
  return h('span', { className: 'badge' }, label);
}
const thu = [
  ['&lt;Badge /&gt;', {}],
  ['&lt;Badge label="Hot" /&gt;', { label: 'Hot' }],
  ['&lt;Badge label={undefined} /&gt;', { label: undefined }],
  ['&lt;Badge label={null} /&gt;', { label: null }],
  ['&lt;Badge label="" /&gt;', { label: '' }],
];
for (const [jsx, props] of thu) console.log(jsx.padEnd(28), '→', renderToStaticMarkup(h(Badge, props)));</code></pre><pre><code class="language-bash">$ node badge.cjs</code></pre><div class="out">&lt;Badge /&gt;                    → &lt;span class="badge"&gt;New&lt;/span&gt;
&lt;Badge label="Hot" /&gt;        → &lt;span class="badge"&gt;Hot&lt;/span&gt;
&lt;Badge label={undefined} /&gt;  → &lt;span class="badge"&gt;New&lt;/span&gt;
&lt;Badge label={null} /&gt;       → &lt;span class="badge"&gt;&lt;/span&gt;
&lt;Badge label="" /&gt;           → &lt;span class="badge"&gt;&lt;/span&gt;</div>
<p>Spread, ở chế độ development: prop lạ lọt xuống thẻ DOM (React cảnh báo và gạt nó ra), và thứ viết <b>sau</b> thắng:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
function Input({ label, ...rest }) {
  return h('label', null, label, h('input', rest));        <span class="tok-comment">  // &lt;input {...rest} /&gt;</span>
}
console.log(renderToStaticMarkup(h(Input, { label: 'Email', type: 'email', placeholder: 'you@site.com' })));
console.log(renderToStaticMarkup(h(Input, { label: 'Email', isActive: true }))); <span class="tok-comment">  // prop lạ lọt xuống &lt;input&gt;</span>
function NutA(props) { return h('button', { ...props, type: 'button' }); }     <span class="tok-comment">  // &lt;button {...props} type="button"&gt;</span>
function NutB(props) { return h('button', { type: 'button', ...props }); }     <span class="tok-comment">  // &lt;button type="button" {...props}&gt;</span>
console.log('NutA:', renderToStaticMarkup(h(NutA, { type: 'submit' }, 'Gửi')));
console.log('NutB:', renderToStaticMarkup(h(NutB, { type: 'submit' }, 'Gửi')));</code></pre><pre><code class="language-bash">$ NODE_ENV=development node spread.cjs 2&gt;&amp;1</code></pre><div class="out">&lt;label&gt;Email&lt;input type="email" placeholder="you@site.com"/&gt;&lt;/label&gt;
React does not recognize the &#96;isActive&#96; prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase &#96;isactive&#96; instead. If you accidentally passed it from a parent component, remove it from the DOM element.
&lt;label&gt;Email&lt;input/&gt;&lt;/label&gt;
NutA: &lt;button type="button"&gt;Gửi&lt;/button&gt;
NutB: &lt;button type="submit"&gt;Gửi&lt;/button&gt;</div>
<p>Gõ kiểu props — bốn lỗi tsc thật: thiếu <code>tone</code> bắt buộc (TS2741), giá trị ngoài union (TS2322), <code>React.FC</code> không có <code>children</code> (TS2322 — lời khuyên “FC thêm children” đã cũ), và <code>unknown</code> bắt kiểm (TS18046). Để ý: dòng <code>any</code> biên dịch im lặng:</p>
<pre><code class="language-tsx">import type { FC } from 'react';

type BadgeProps = {
  label?: string;        <span class="tok-comment">  // tuỳ chọn</span>
  tone: 'info' | 'warn'; <span class="tok-comment">  // bắt buộc, chỉ hai giá trị này</span>
};
function Badge({ label = 'New', tone }: BadgeProps) {
  return &lt;span className={&#96;badge badge-\${tone}&#96;}&gt;{label}&lt;/span&gt;;
}
export const a = &lt;Badge /&gt;;
export const b = &lt;Badge tone="danger" /&gt;;
export const c = &lt;Badge tone="info" /&gt;;

const Card: FC&lt;{ title: string }&gt; = ({ title }) =&gt; &lt;h2&gt;{title}&lt;/h2&gt;;
export const d = &lt;Card title="Hi"&gt;nội dung&lt;/Card&gt;;

function Chart({ data }: { data: any }) {
  return &lt;p&gt;{data.points.map((p: number) =&gt; p * 2).join(',')}&lt;/p&gt;;
}
export const e = &lt;Chart data={{}} /&gt;;

function Chart2({ data }: { data: unknown }) {
  return &lt;p&gt;{data.points.join(',')}&lt;/p&gt;;
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/thu23/kieu.tsx(10,19): error TS2741: Property 'tone' is missing in type '{}' but required in type 'BadgeProps'.
src/thu23/kieu.tsx(11,25): error TS2322: Type '"danger"' is not assignable to type '"info" | "warn"'.
src/thu23/kieu.tsx(15,19): error TS2322: Type '{ children: string; title: string; }' is not assignable to type 'IntrinsicAttributes &amp; { title: string; }'.
  Property 'children' does not exist on type 'IntrinsicAttributes &amp; { title: string; }'.
src/thu23/kieu.tsx(23,14): error TS18046: 'data' is of type 'unknown'.</div>
<p>…rồi sập lúc chạy:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function Chart({ data }) {                  <span class="tok-comment">  // data: any — tsc không kiểm gì</span>
  return React.createElement('p', null, data.points.map((p) =&gt; p * 2).join(','));
}
try {
  console.log(renderToStaticMarkup(React.createElement(Chart, { data: {} })));
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}</code></pre><pre><code class="language-bash">$ node any.cjs</code></pre><div class="out">TypeError: Cannot read properties of undefined (reading 'map')</div>
<p>Prop callback trên trình duyệt thật (<code>next build</code> + <code>next start</code>), bấm react · next · react:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

type Props = { onSearch: (q: string) =&gt; void };

function SearchBar({ onSearch }: Props) {
  return (
    &lt;div className="flex gap-2"&gt;
      &lt;button id="r" className="rounded border px-3" onClick={() =&gt; onSearch('react')}&gt;Search react&lt;/button&gt;
      &lt;button id="n" className="rounded border px-3" onClick={() =&gt; onSearch('next')}&gt;Search next&lt;/button&gt;
    &lt;/div&gt;
  );
}

export default function Tim() {
  const [log, setLog] = useState&lt;string[]&gt;([]);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;SearchBar onSearch={(q) =&gt; setLog((cu) =&gt; [...cu, &#96;searching \${q}&#96;])} /&gt;
      &lt;p id="dem"&gt;Page nhận {log.length} lần gọi&lt;/p&gt;
      &lt;ol id="log" className="list-decimal pl-6"&gt;
        {log.map((x, i) =&gt; &lt;li key={i}&gt;{x}&lt;/li&gt;)}
      &lt;/ol&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">Page nhận 3 lần gọi
searching react
searching next
searching react</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">node badge.cjs
NODE_ENV=development node spread.cjs 2&gt;&amp;1
npx tsc --noEmit
node any.cjs
npm run build &amp;&amp; npm start  <span class="tok-comment">  # mở /tim và bấm các nút</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-2-props" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.2 — Props và kiểu TypeScript</span><span class="lc-sub">Cùng chủ đề trong khoá React, đi sâu hơn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-3-1-tham-so" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript · 3.1 — Gõ kiểu tham số: bắt buộc, optional, mặc định, rest</span><span class="lc-sub">Nền của giá trị mặc định và ...rest</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-1-4-any-unknown" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript · 1.4 — any, unknown</span><span class="lc-sub">Vì sao unknown là lựa chọn thành thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-5-4-slot13-proptypes-slides" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 5.4 — PropTypes (Slot 13)</span><span class="lc-sub">Góc nhìn môn học ở trường: kiểm tra props</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểu prop</span><span class="v">Một <code>type</code>/<code>interface</code> TypeScript mô tả đầu vào của component.</span></div>
  <div class="kv"><span class="k">Prop tuỳ chọn</span><span class="v"><code>prop?: T</code> — có thể bỏ; thường đi với một mặc định.</span></div>
  <div class="kv"><span class="k">Giá trị mặc định</span><span class="v">Dự phòng đặt qua destructuring (<code>{ size = &quot;md&quot; }</code>).</span></div>
  <div class="kv"><span class="k">Prop callback</span><span class="v">Một prop là hàm mà con gọi để gửi sự kiện/dữ liệu lên trên.</span></div>
  <div class="kv"><span class="k">Spread props</span><span class="v"><code>{...rest}</code> chuyển tiếp nhiều prop một lúc.</span></div>
  <div class="kv"><span class="k">Prop drilling</span><span class="v">Truyền một prop qua nhiều tầng không dùng tới nó (một mùi xấu).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Gõ kiểu prop bằng <code>type</code> TypeScript; đánh dấu tuỳ chọn bằng <code>?</code> và đặt mặc định khi destructure.</li><li>Con nói chuyện ngược lên cha qua prop callback (<code>onSelect</code>, <code>onChange</code>).</li><li><code>{...rest}</code> chuyển tiếp prop hàng loạt — tiện, nhưng spread prop lạ có thể lọt thuộc tính không hợp lệ.</li><li>Prop drilling quá nhiều là dấu hiệu nên dùng ghép hoặc context (Chương 6).</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Thinking in components|||2.4 — Tư duy theo component',
      slug: 'nextjs-2-4-tu-duy-component',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Cắt một giao diện thành component: mỗi component một việc, đặt tên theo dữ liệu, và giữ component thuần.',
      content: `
${G02_4}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Breaking a screen into components</h2>
<p class="lead">The hard part of React isn't the syntax — it's deciding where the boundaries between components go. There is a repeatable method, and one guiding principle: each component should do one job.</p>

<h3>The method: find the nouns, draw the boxes</h3>
<p>Look at a design and outline the pieces. A comment thread has: the thread, each comment, the author line inside a comment, the reply box. Each visual box that repeats or has a clear single responsibility becomes a component:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Draw boxes</b> around every distinct piece of UI. A box that repeats (a comment, a row, a card) is almost certainly a component.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nest the boxes</b> — a box inside a box is a child component. This gives you the component tree.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Name each by what it is</b>, from the data — <code>CommentList</code>, <code>Comment</code>, <code>AuthorLine</code> — not by how it looks (<code>BlueBox</code>).</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Decide the props</b> each box needs from its parent to render itself.</div></div>
</div>

<h3>One job per component</h3>
<p>A component that fetches data, formats it, lays it out, and handles three kinds of click is four components wearing a trench coat. The signal that a component is doing too much: you struggle to name it, or the name has "And" in it (<code>UserProfileAndSettings</code>). Split it. Small, single-purpose components are easier to name, test, reuse, and reason about — and they re-render independently, which matters for performance in Chapter 7.</p>
<p>There is a balance. Don't atomise a paragraph of static text into five components either — a component earns its existence by being reused, by having a clear single responsibility, or by isolating complexity. If it does none of those, it's just indirection.</p>

<h3>Keep components pure</h3>
<p>A component should be a <strong>pure function</strong> of its props (and, next chapter, its state): given the same inputs, it returns the same UI, and rendering it causes no side effects. During render, a component must not:</p>
<ul>
  <li>mutate its props or any variable that existed before it was called;</li>
  <li>write to the DOM directly, start a network request, or set a timer;</li>
  <li>read or change anything outside itself (a global, the current time in a way that changes output).</li>
</ul>
<p>Side effects have their own place — the event handlers you write, and the <code>useEffect</code> hook in Chapter 5. Render itself stays pure. React leans on this: it may call your component more than once, skip a call, or run it in a different order, and pure components survive all of that. Impure ones produce bugs that appear only sometimes — the worst kind.</p>

<div class="callout warn">
<p><strong>The tell of an impure render.</strong> A count that increments every render, a list that grows each time the parent updates, a value that is right the first time and wrong after — these are almost always a render doing something it should only do in an event or an effect. When a bug is intermittent and tied to re-rendering, suspect an impure component first.</p>
</div>
<h3>Deciding where a component should end</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Start from the design, not the code</b> — Draw boxes around the parts of the mockup that repeat or that have a name a designer would use. Those names are your components.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>One component, one job</b> — If you cannot describe it in a sentence without &quot;and&quot;, it is two. A component that fetches, formats and renders is three.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Split when it repeats, not before</b> — Two similar blocks may still be genuinely different. Extract on the third occurrence, when the shared shape is actually visible.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Keep state as low as it can live</b> — Put it in the component that needs it; lift it only when a second component needs the same value.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — splitting components too early, guided by file length rather than by responsibility.</strong> Cutting a 200-line component into eight files feels tidy and often makes the code harder to follow: each new boundary needs props threaded through it, and a value that used to be one variable becomes a prop on four levels. The cost is not the files, it is the interfaces between them. The useful signal is not length — it is whether a part is reused, or has its own state, or would be independently testable. A long component that does one thing, read top to bottom, beats eight short ones you have to reassemble mentally.</p></div>
<a class="link-card dl" href="https://react.dev/learn/thinking-in-react" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">react.dev — Thinking in React</span><span class="lc-sub">The five-step method: from a mockup to a component tree, with state placed last.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/choosing-the-state-structure" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Choosing the state structure</span><span class="lc-sub">How to avoid redundant and contradictory state — the root of most component confusion.</span></span>
</a>


<h3>🔬 Measured: boxes, purity and hydration on Next.js 16.4.6</h3>
<p>The comment thread, cut into the components named above (the boxes in the slides are drawn on this real page):</p>
<pre><code class="language-tsx">type BinhLuan = { id: number; tacGia: string; luc: string; noiDung: string };

const DS: BinhLuan[] = [
  { id: 1, tacGia: 'An', luc: '2 phút trước', noiDung: 'Bài này dễ hiểu quá!' },
  { id: 2, tacGia: 'Bình', luc: '5 phút trước', noiDung: 'Cho mình hỏi children có phải mảng không?' },
  { id: 3, tacGia: 'Chi', luc: '9 phút trước', noiDung: 'Không phải lúc nào cũng là mảng nhé.' },
];

function AuthorLine({ tacGia, luc }: { tacGia: string; luc: string }) {
  return (
    &lt;div data-c="AuthorLine" className="text-sm text-slate-500"&gt;
      &lt;b className="text-slate-900"&gt;{tacGia}&lt;/b&gt; · {luc}
    &lt;/div&gt;
  );
}

function Comment({ bl }: { bl: BinhLuan }) {
  return (
    &lt;li data-c="Comment" className="rounded-lg bg-white p-3 shadow-sm"&gt;
      &lt;AuthorLine tacGia={bl.tacGia} luc={bl.luc} /&gt;
      &lt;p&gt;{bl.noiDung}&lt;/p&gt;
    &lt;/li&gt;
  );
}

function CommentList({ ds }: { ds: BinhLuan[] }) {
  return (
    &lt;ul data-c="CommentList" className="space-y-2"&gt;
      {ds.map((bl) =&gt; &lt;Comment key={bl.id} bl={bl} /&gt;)}
    &lt;/ul&gt;
  );
}

function ReplyBox() {
  return (
    &lt;form data-c="ReplyBox" className="flex gap-2"&gt;
      &lt;input className="flex-1 rounded border px-2" placeholder="Viết trả lời…" /&gt;
      &lt;button className="rounded bg-sky-500 px-3 text-white"&gt;Gửi&lt;/button&gt;
    &lt;/form&gt;
  );
}

export default function Thread() {
  return (
    &lt;section data-c="Thread" className="space-y-3 bg-slate-100 p-5 font-sans"&gt;
      &lt;h2 className="text-lg font-bold"&gt;Bình luận (3)&lt;/h2&gt;
      &lt;CommentList ds={DS} /&gt;
      &lt;ReplyBox /&gt;
    &lt;/section&gt;
  );
}</code></pre>
<p>An impure component next to a pure one, same page, opened under <code>next dev</code> and <code>next start</code>, button clicked twice:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

let lanVe = 0;                      <span class="tok-comment">  // biến NGOÀI component</span>
const daXem: string[] = [];

function KhongThuan() {
  lanVe++;                          <span class="tok-comment">  // ✗ đổi biến bên ngoài trong lúc render</span>
  daXem.push('x');                  <span class="tok-comment">  // ✗ mảng dài thêm mỗi lần render</span>
  return &lt;p id="kt"&gt;KhongThuan: lanVe = {lanVe} · daXem dài {daXem.length}&lt;/p&gt;;
}

function Thuan({ n }: { n: number }) {
  return &lt;p id="t"&gt;Thuan: n × 2 = {n * 2}&lt;/p&gt;;
}

export default function Trang() {
  const [n, setN] = useState(0);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;button className="rounded border px-3" onClick={() =&gt; setN(n + 1)}&gt;Cha render lại: {n}&lt;/button&gt;
      &lt;KhongThuan /&gt;
      &lt;Thuan n={n} /&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">next dev   — on load: KhongThuan: lanVe = 2 · daXem dài 2
next dev   — after 2 clicks: Cha render lại: 2 · KhongThuan: lanVe = 6 · daXem dài 6 · Thuan: n × 2 = 4
next start — on load: KhongThuan: lanVe = 1 · daXem dài 1
next start — after 2 clicks: Cha render lại: 2 · KhongThuan: lanVe = 3 · daXem dài 3 · Thuan: n × 2 = 4</div>
<p>In development React Strict Mode (on by default in the App Router) calls each component twice per render to expose impurity — <code>KhongThuan</code> counted twice as fast; <code>Thuan</code> could not tell the difference. Production does not double-render.</p>
<p>Impurity in a Next.js client component — <code>Math.random()</code> while rendering:</p>
<pre><code class="language-tsx">'use client';

export default function NgauNhien() {
  const so = Math.random().toFixed(4); <span class="tok-comment">  // ✗ đọc thứ bên ngoài: mỗi lần render một số khác</span>
  return &lt;p id="so" className="p-6 font-sans text-xl"&gt;Số may mắn: {so}&lt;/p&gt;;
}</code></pre>
<pre><code class="language-bash">$ curl -s localhost:19324/ngau-nhien | grep -o 'Số may mắn: &lt;!-- --&gt;[0-9.]*'</code></pre><div class="out">Số may mắn: &lt;!-- --&gt;0.8469</div><pre><code class="language-bash">$ curl -s localhost:19324/ngau-nhien | grep -o 'Số may mắn: &lt;!-- --&gt;[0-9.]*'</code></pre><div class="out">Số may mắn: &lt;!-- --&gt;0.8469</div>
<p>The page is static (○), so <code>next build</code> froze one number into the HTML — every request gets the same one. The browser then renders a different number, and hydration fails:</p>
<div class="out">next dev   (overlay): Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:
next start (console): Minified React error #418; visit https://react.dev/errors/418?args[]=text&amp;args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.</div>
<p>Fix: create random values, timestamps and the like in an event handler or an effect (Chapter 5), never during render.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm start  <span class="tok-comment">  # open /binh-luan, /thuan (click twice), /ngau-nhien</span>
curl -s localhost:3000/ngau-nhien | grep -o "Số may mắn: &lt;!-- --&gt;[0-9.]*"  <span class="tok-comment">  # twice — same number</span>
npm run dev                 <span class="tok-comment">  # /thuan again: the counter doubles; /ngau-nhien: Hydration failed</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-4-chia-nho" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.4 — Thinking in components: from mock-up to a tested tree</span><span class="lc-sub">The same method, all the way to tests</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-1-component" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.1 — Components are functions: staying pure</span><span class="lc-sub">Pure renders, in more depth</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-3-strict-mode-ref" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.3 — StrictMode, useRef, useLayoutEffect</span><span class="lc-sub">Why development runs twice</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-5-3-slot6-component-slides" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 5.3 — All about Components (Slot 6)</span><span class="lc-sub">The university-course view</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Component tree</span><span class="v">The nested boxes of a screen, as components.</span></div>
  <div class="kv"><span class="k">Single responsibility</span><span class="v">One component, one job — if it needs an “and”, it is two.</span></div>
  <div class="kv"><span class="k">Pure render</span><span class="v">Same props/state in ⇒ same UI out, and nothing outside changes.</span></div>
  <div class="kv"><span class="k">Strict Mode</span><span class="v">Development-only double render that exposes impure components.</span></div>
  <div class="kv"><span class="k">Hydration mismatch</span><span class="v">The server HTML differs from the browser's first render.</span></div>
  <div class="kv"><span class="k">Side effect</span><span class="v">Work outside rendering — belongs in event handlers or useEffect.</span></div>
</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Take a screenshot of a page (any app) and draw boxes to break it into a component tree; name each component.</li>
<li>Decide for each piece of data whether it is a prop (passed in) or state (owned here), and where it should live.</li>
<li>Rebuild one small section as components, lifting shared state to the closest common parent.</li>
</ol>
<p><strong>Done when:</strong> you can decompose a UI into a component tree and place each piece of data correctly.</p></div>

<h3>📌 Summary</h3>
<ul><li>Think in components: break a UI into a tree of small, single-purpose pieces.</li><li>For each piece of data decide prop (from above) vs state (owned here).</li><li>When two components need the same state, lift it to their closest common parent.</li><li>Parents own state and pass it down; children send changes up through callbacks.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Cắt một màn hình thành component</h2>
<p class="lead">Phần khó của React không phải cú pháp — mà là quyết ranh giới giữa các component nằm ở đâu. Có một phương pháp lặp lại được, và một nguyên tắc dẫn đường: mỗi component nên làm một việc.</p>

<h3>Phương pháp: tìm danh từ, vẽ hộp</h3>
<p>Nhìn một thiết kế và phác ra các mảnh. Một luồng bình luận có: luồng, mỗi bình luận, dòng tác giả trong một bình luận, ô trả lời. Mỗi hộp thị giác lặp lại hoặc có một trách nhiệm đơn rõ ràng trở thành một component:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Vẽ hộp</b> quanh mỗi mảnh UI riêng biệt. Một hộp lặp lại (một bình luận, một hàng, một card) gần như chắc chắn là một component.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Lồng các hộp</b> — một hộp trong một hộp là một component con. Việc này cho bạn cây component.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Đặt tên mỗi cái theo NÓ LÀ GÌ</b>, từ dữ liệu — <code>CommentList</code>, <code>Comment</code>, <code>AuthorLine</code> — không theo NÓ TRÔNG THẾ NÀO (<code>BlueBox</code>).</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Quyết props</b> mỗi hộp cần từ cha để tự render.</div></div>
</div>

<h3>Một việc mỗi component</h3>
<p>Một component vừa fetch dữ liệu, vừa định dạng, vừa dàn layout, vừa xử ba kiểu click là bốn component khoác chung một áo. Dấu hiệu một component ôm quá nhiều: bạn chật vật đặt tên cho nó, hoặc tên có chữ "Và" (<code>UserProfileVaSettings</code>). Hãy tách. Component nhỏ, đơn mục đích thì dễ đặt tên, dễ test, dễ tái dùng và dễ suy luận hơn — và chúng render lại độc lập, điều quan trọng cho hiệu năng ở Chương 7.</p>
<p>Có một sự cân bằng. Cũng đừng nghiền một đoạn chữ tĩnh thành năm component — một component xứng đáng tồn tại khi được tái dùng, khi có một trách nhiệm đơn rõ ràng, hoặc khi cô lập được sự phức tạp. Nếu không đạt cái nào trong số đó, nó chỉ là một tầng vòng vo.</p>

<h3>Giữ component thuần</h3>
<p>Một component nên là một <strong>hàm thuần</strong> của props (và, chương sau, state của nó): cùng đầu vào thì trả về cùng UI, và render nó không gây tác dụng phụ. Trong lúc render, một component KHÔNG được:</p>
<ul>
  <li>mutate props hoặc bất kỳ biến nào đã tồn tại trước khi nó được gọi;</li>
  <li>ghi trực tiếp vào DOM, khởi động một request mạng, hay đặt một timer;</li>
  <li>đọc hoặc đổi bất cứ thứ gì bên ngoài nó (một biến toàn cục, thời gian hiện tại theo cách làm đổi output).</li>
</ul>
<p>Tác dụng phụ có chỗ riêng của chúng — các handler sự kiện bạn viết, và hook <code>useEffect</code> ở Chương 5. Bản thân render vẫn thuần. React dựa vào điều này: nó có thể gọi component của bạn nhiều hơn một lần, bỏ qua một lần gọi, hoặc chạy theo thứ tự khác, và component thuần sống sót qua tất cả. Component không thuần sinh ra bug chỉ thỉnh thoảng xuất hiện — loại tệ nhất.</p>

<div class="callout warn">
<p><strong>Dấu hiệu của một render không thuần.</strong> Một bộ đếm tăng mỗi lần render, một danh sách dài thêm mỗi khi cha cập nhật, một giá trị đúng lần đầu và sai về sau — những thứ này gần như luôn là một render làm việc mà lẽ ra chỉ nên làm trong một sự kiện hoặc một effect. Khi một bug chập chờn và gắn với render lại, hãy nghi một component không thuần trước tiên.</p>
</div>
<h3>Quyết định một component nên kết thúc ở đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Bắt đầu từ thiết kế, đừng bắt đầu từ mã</b> — Hãy khoanh hộp quanh những phần của bản thiết kế lặp lại, hoặc có một cái tên mà người thiết kế sẽ dùng. Những cái tên đó chính là component của bạn.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Một component, một việc</b> — Nếu bạn không mô tả nổi nó trong một câu mà không dùng chữ &quot;và&quot;, thì nó là hai. Một component vừa lấy dữ liệu, vừa định dạng, vừa vẽ là ba.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Tách khi nó lặp lại, đừng tách trước</b> — Hai khối na ná nhau vẫn có thể thật sự khác nhau. Hãy tách ở lần xuất hiện thứ ba, khi cái dáng chung đã thật sự hiện rõ.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Giữ state ở chỗ thấp nhất nó sống được</b> — Đặt nó vào component cần nó; chỉ nâng lên khi có component thứ hai cần cùng giá trị.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tách component quá sớm, lấy độ dài file làm kim chỉ nam thay vì lấy trách nhiệm.</strong> Cắt một component 200 dòng thành tám file thì trông gọn mà thường làm mã khó theo dõi hơn: mỗi ranh giới mới lại cần luồn props qua, và một giá trị vốn là một biến giờ thành một prop trên bốn tầng. Cái giá không nằm ở số file, nó nằm ở các giao diện giữa chúng. Tín hiệu hữu ích không phải độ dài — mà là một phần có được dùng lại không, có state riêng không, hay có kiểm thử độc lập được không. Một component dài mà làm đúng một việc, đọc một mạch từ trên xuống, hơn tám component ngắn mà bạn phải ghép lại trong đầu.</p></div>
<a class="link-card dl" href="https://react.dev/learn/thinking-in-react" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">react.dev — Tư duy kiểu React</span><span class="lc-sub">Phương pháp năm bước: từ bản thiết kế tới cây component, đặt state sau cùng.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/choosing-the-state-structure" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Chọn cấu trúc state</span><span class="lc-sub">Cách tránh state thừa và state mâu thuẫn — gốc rễ của phần lớn nhầm lẫn về component.</span></span>
</a>


<h3>🔬 Đo thật: vẽ hộp, độ thuần và hydration trên Next.js 16.4.6</h3>
<p>Luồng bình luận, cắt thành đúng các component đã đặt tên ở trên (hộp trong slide vẽ trên chính trang thật này):</p>
<pre><code class="language-tsx">type BinhLuan = { id: number; tacGia: string; luc: string; noiDung: string };

const DS: BinhLuan[] = [
  { id: 1, tacGia: 'An', luc: '2 phút trước', noiDung: 'Bài này dễ hiểu quá!' },
  { id: 2, tacGia: 'Bình', luc: '5 phút trước', noiDung: 'Cho mình hỏi children có phải mảng không?' },
  { id: 3, tacGia: 'Chi', luc: '9 phút trước', noiDung: 'Không phải lúc nào cũng là mảng nhé.' },
];

function AuthorLine({ tacGia, luc }: { tacGia: string; luc: string }) {
  return (
    &lt;div data-c="AuthorLine" className="text-sm text-slate-500"&gt;
      &lt;b className="text-slate-900"&gt;{tacGia}&lt;/b&gt; · {luc}
    &lt;/div&gt;
  );
}

function Comment({ bl }: { bl: BinhLuan }) {
  return (
    &lt;li data-c="Comment" className="rounded-lg bg-white p-3 shadow-sm"&gt;
      &lt;AuthorLine tacGia={bl.tacGia} luc={bl.luc} /&gt;
      &lt;p&gt;{bl.noiDung}&lt;/p&gt;
    &lt;/li&gt;
  );
}

function CommentList({ ds }: { ds: BinhLuan[] }) {
  return (
    &lt;ul data-c="CommentList" className="space-y-2"&gt;
      {ds.map((bl) =&gt; &lt;Comment key={bl.id} bl={bl} /&gt;)}
    &lt;/ul&gt;
  );
}

function ReplyBox() {
  return (
    &lt;form data-c="ReplyBox" className="flex gap-2"&gt;
      &lt;input className="flex-1 rounded border px-2" placeholder="Viết trả lời…" /&gt;
      &lt;button className="rounded bg-sky-500 px-3 text-white"&gt;Gửi&lt;/button&gt;
    &lt;/form&gt;
  );
}

export default function Thread() {
  return (
    &lt;section data-c="Thread" className="space-y-3 bg-slate-100 p-5 font-sans"&gt;
      &lt;h2 className="text-lg font-bold"&gt;Bình luận (3)&lt;/h2&gt;
      &lt;CommentList ds={DS} /&gt;
      &lt;ReplyBox /&gt;
    &lt;/section&gt;
  );
}</code></pre>
<p>Một component không thuần cạnh một component thuần, cùng trang, mở dưới <code>next dev</code> và <code>next start</code>, bấm nút hai lần:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

let lanVe = 0;                      <span class="tok-comment">  // biến NGOÀI component</span>
const daXem: string[] = [];

function KhongThuan() {
  lanVe++;                          <span class="tok-comment">  // ✗ đổi biến bên ngoài trong lúc render</span>
  daXem.push('x');                  <span class="tok-comment">  // ✗ mảng dài thêm mỗi lần render</span>
  return &lt;p id="kt"&gt;KhongThuan: lanVe = {lanVe} · daXem dài {daXem.length}&lt;/p&gt;;
}

function Thuan({ n }: { n: number }) {
  return &lt;p id="t"&gt;Thuan: n × 2 = {n * 2}&lt;/p&gt;;
}

export default function Trang() {
  const [n, setN] = useState(0);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;button className="rounded border px-3" onClick={() =&gt; setN(n + 1)}&gt;Cha render lại: {n}&lt;/button&gt;
      &lt;KhongThuan /&gt;
      &lt;Thuan n={n} /&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">next dev   — lúc tải: KhongThuan: lanVe = 2 · daXem dài 2
next dev   — sau 2 lần bấm: Cha render lại: 2 · KhongThuan: lanVe = 6 · daXem dài 6 · Thuan: n × 2 = 4
next start — lúc tải: KhongThuan: lanVe = 1 · daXem dài 1
next start — sau 2 lần bấm: Cha render lại: 2 · KhongThuan: lanVe = 3 · daXem dài 3 · Thuan: n × 2 = 4</div>
<p>Ở development, Strict Mode của React (mặc định bật trong App Router) gọi mỗi component hai lần mỗi lượt render để lộ chỗ không thuần — <code>KhongThuan</code> đếm nhanh gấp đôi; <code>Thuan</code> không phân biệt được. Production không render đôi.</p>
<p>Không thuần trong một client component của Next.js — <code>Math.random()</code> ngay lúc render:</p>
<pre><code class="language-tsx">'use client';

export default function NgauNhien() {
  const so = Math.random().toFixed(4); <span class="tok-comment">  // ✗ đọc thứ bên ngoài: mỗi lần render một số khác</span>
  return &lt;p id="so" className="p-6 font-sans text-xl"&gt;Số may mắn: {so}&lt;/p&gt;;
}</code></pre>
<pre><code class="language-bash">$ curl -s localhost:19324/ngau-nhien | grep -o 'Số may mắn: &lt;!-- --&gt;[0-9.]*'</code></pre><div class="out">Số may mắn: &lt;!-- --&gt;0.8469</div><pre><code class="language-bash">$ curl -s localhost:19324/ngau-nhien | grep -o 'Số may mắn: &lt;!-- --&gt;[0-9.]*'</code></pre><div class="out">Số may mắn: &lt;!-- --&gt;0.8469</div>
<p>Trang là tĩnh (○), nên <code>next build</code> đã nướng một con số vào HTML — mọi request nhận đúng số đó. Rồi trình duyệt render ra số khác, và hydration hỏng:</p>
<div class="out">next dev   (overlay): Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:
next start (console): Minified React error #418; visit https://react.dev/errors/418?args[]=text&amp;args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.</div>
<p>Cách sửa: tạo giá trị ngẫu nhiên, thời gian hiện tại… trong hàm xử lý sự kiện hoặc effect (Chương 5), không bao giờ lúc render.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm start  <span class="tok-comment">  # mở /binh-luan, /thuan (bấm hai lần), /ngau-nhien</span>
curl -s localhost:3000/ngau-nhien | grep -o "Số may mắn: &lt;!-- --&gt;[0-9.]*"  <span class="tok-comment">  # hai lần — cùng số</span>
npm run dev                 <span class="tok-comment">  # /thuan lần nữa: số đếm gấp đôi; /ngau-nhien: Hydration failed</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-4-chia-nho" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.4 — Tư duy theo component: từ mock-up tới cây component</span><span class="lc-sub">Cùng phương pháp, đi tới cây component có test</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-1-component" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.1 — Component là hàm: giữ cho thuần khiết</span><span class="lc-sub">Render thuần, nói kỹ hơn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-3-strict-mode-ref" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.3 — StrictMode, useRef, useLayoutEffect</span><span class="lc-sub">Vì sao dev chạy hai lần</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-5-3-slot6-component-slides" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 5.3 — Tất cả về Component (Slot 6)</span><span class="lc-sub">Góc nhìn môn học ở trường</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cây component</span><span class="v">Các hộp lồng nhau của một màn hình, mỗi hộp là một component.</span></div>
  <div class="kv"><span class="k">Một trách nhiệm</span><span class="v">Một component, một việc — cần chữ “và” thì là hai.</span></div>
  <div class="kv"><span class="k">Render thuần</span><span class="v">Cùng props/state vào ⇒ cùng giao diện ra, và không đổi gì bên ngoài.</span></div>
  <div class="kv"><span class="k">Strict Mode</span><span class="v">Chỉ ở development: render hai lần để lộ component không thuần.</span></div>
  <div class="kv"><span class="k">Lệch hydration</span><span class="v">HTML máy chủ khác lần render đầu ở trình duyệt.</span></div>
  <div class="kv"><span class="k">Tác dụng phụ</span><span class="v">Việc nằm ngoài render — thuộc về hàm xử lý sự kiện hoặc useEffect.</span></div>
</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chụp màn hình một trang (app bất kỳ) và vẽ các hộp để tách nó thành cây component; đặt tên từng cái.</li>
<li>Với mỗi mẩu dữ liệu, quyết định nó là prop (truyền vào) hay state (sở hữu tại đây), và nên nằm ở đâu.</li>
<li>Dựng lại một mảng nhỏ thành component, nâng state dùng chung lên cha chung gần nhất.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tách được UI thành cây component và đặt đúng chỗ cho từng mẩu dữ liệu.</p></div>

<h3>📌 Tóm tắt</h3>
<ul><li>Tư duy theo component: tách UI thành một cây gồm các mảnh nhỏ, một nhiệm vụ.</li><li>Với mỗi mẩu dữ liệu, quyết định prop (từ trên) hay state (sở hữu tại đây).</li><li>Khi hai component cần cùng một state, nâng nó lên cha chung gần nhất.</li><li>Cha sở hữu state và truyền xuống; con gửi thay đổi lên qua callback.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 2.5 quiz ─────────────────────────── */
    {
      title: '2.5 — Chapter 2 quiz|||2.5 — Kiểm tra chương 2',
      slug: 'nextjs-2-5-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Chín câu về props một chiều/chỉ đọc, children, ghép vs kế thừa, callback prop và component thuần.',
      content: `
<div class="ml-en">
<p class="lead">Nine questions on Chapter 2: props flow and read-only-ness, the <code>children</code> prop, composition over inheritance, callback props, and pure components.</p>
</div>
<div class="ml-vi">
<p class="lead">Chín câu cho Chương 2: dòng props và tính chỉ đọc, prop <code>children</code>, ghép hơn kế thừa, callback prop, và component thuần.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 660,
        questions: [
          {
            question: 'In which direction does data flow between React components by default?|||Mặc định, dữ liệu chảy theo hướng nào giữa các component React?',
            options: [
              'Up, from child to parent|||Lên, từ con sang cha',
              'Down, from parent to child, one way|||Xuống, từ cha sang con, một chiều',
              'Sideways, between siblings|||Ngang, giữa các anh em',
              'Any direction, freely|||Bất kỳ hướng nào, tự do',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A child component does items.push(x) on an array it received as a prop. What is wrong?|||Một component con làm items.push(x) trên một mảng nó nhận qua prop. Sai chỗ nào?',
            options: [
              'Nothing, that is how you update props|||Không sao, đó là cách cập nhật props',
              'Props are read-only; mutating them corrupts the parent\'s data|||Props chỉ đọc; mutate chúng làm hỏng dữ liệu của cha',
              'push is too slow|||push quá chậm',
              'You must use items.pop() instead|||Phải dùng items.pop() thay thế',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What arrives as the children prop of <Panel><p>Hi</p></Panel>?|||Cái gì tới dưới dạng prop children của <Panel><p>Hi</p></Panel>?',
            options: [
              'The string "Hi" only|||Chỉ chuỗi "Hi"',
              'The <p>Hi</p> element nested between the tags|||Element <p>Hi</p> lồng giữa hai thẻ',
              'Nothing — children must be passed as an attribute|||Không gì — children phải truyền qua thuộc tính',
              'The Panel component itself|||Chính component Panel',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Two sibling components need to share the same data. Where should it live?|||Hai component anh em cần chia sẻ cùng dữ liệu. Nó nên nằm ở đâu?',
            options: [
              'Duplicated in both siblings|||Nhân đôi trong cả hai anh em',
              'In a global variable|||Trong một biến toàn cục',
              'In their nearest common parent, passed down to both|||Ở cha chung gần nhất, truyền xuống cho cả hai',
              'One sibling passes it directly to the other|||Một anh em truyền thẳng cho anh em kia',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'How does a child tell its parent that a button was clicked?|||Một con báo cho cha rằng một nút đã được click bằng cách nào?',
            options: [
              'It mutates the parent\'s state directly|||Nó mutate state của cha trực tiếp',
              'The parent passes a function prop (e.g. onClick) that the child calls|||Cha truyền một hàm prop (vd onClick) mà con gọi',
              'It cannot — data only flows down|||Không thể — dữ liệu chỉ chảy xuống',
              'Through a global event bus, always|||Qua một event bus toàn cục, luôn luôn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'React\'s official guidance on reuse is to prefer…|||Hướng dẫn chính thức của React về tái dùng là ưu tiên…',
            options: [
              'class inheritance (extends)|||kế thừa class (extends)',
              'composition (wrapping and children) over inheritance|||ghép (bọc và children) hơn kế thừa',
              'copy-pasting components|||sao chép component',
              'one giant component with many props|||một component khổng lồ nhiều props',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does {...rest} do in function Input({ label, ...rest }) { return <input {...rest} /> }?|||{...rest} làm gì trong function Input({ label, ...rest }) { return <input {...rest} /> }?',
            options: [
              'Forwards every prop except label onto the <input>|||Chuyển tiếp mọi prop trừ label lên <input>',
              'Deletes the label prop|||Xoá prop label',
              'Creates a copy of the Input component|||Tạo bản sao của component Input',
              'Passes only the label to <input>|||Chỉ truyền label cho <input>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which is NOT allowed during a component\'s render?|||Cái nào KHÔNG được phép trong lúc render một component?',
            options: [
              'Reading its props|||Đọc props của nó',
              'Computing a new array from its props|||Tính một mảng mới từ props',
              'Starting a network request or mutating a prop|||Khởi động một request mạng hoặc mutate một prop',
              'Returning JSX|||Trả về JSX',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You should name a component by…|||Bạn nên đặt tên một component theo…',
            options: [
              'how it looks, e.g. BlueRoundedBox|||nó trông thế nào, vd BlueRoundedBox',
              'what it is / its data, e.g. CommentList|||nó là gì / dữ liệu của nó, vd CommentList',
              'the colour of its border|||màu viền của nó',
              'a random unique id|||một id ngẫu nhiên duy nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
