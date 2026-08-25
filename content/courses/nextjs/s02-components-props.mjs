/**
 * Next.js & React — Chương 2: Component, props & ghép.
 * Song ngữ EN/VI. Escape: backtick→&#96;, `${`→\${, < >→&lt; &gt; trong code.
 * Output React đã chạy thật: scratchpad/nextjs-verify/c2.mjs.
 */

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
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>A component is a function; props are its arguments</h2>
<p class="lead">In Chapter 1 you saw a component is a function that returns UI. Props are simply the arguments to that function — the data a parent passes down so a child can render itself. Everything about how React apps are structured falls out of one rule: data flows <em>down</em>, one way, and props are read-only.</p>

<h3>Passing and receiving props</h3>
<p>A parent passes props as JSX attributes; the child receives them as a single object, which you almost always destructure:</p>
<pre><code>function Avatar({ src, alt }) {
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
<div class="out">&lt;div class="card"&gt;&lt;img src="/a.png" alt="An"/&gt;&lt;h3&gt;An&lt;/h3&gt;&lt;/div&gt;</div>
<p><code>UserCard</code> receives a <code>user</code> prop and hands pieces of it down to <code>Avatar</code>. That is the shape of every React app: a tree of components, each taking props from its parent and passing props to its children.</p>

<h3>Props flow one way: down</h3>
<p>Data in React moves in one direction — from parent to child, never sideways or up. A child cannot reach into its parent's data, and two siblings cannot pass props to each other directly. If two components need to share data, that data lives in their nearest common parent, which passes it down to both. (When a child needs to <em>change</em> shared data, the parent passes down a function too — Lesson 2.3, and fully in Chapter 3.)</p>
<p>This sounds restrictive and is the opposite: one-way flow is why you can look at any component and know exactly where its data came from — the parent, through props. There is no spooky action at a distance.</p>

<h3>Props are read-only</h3>
<p>A component must never modify its own props. Props are a snapshot handed down for this render; mutating them corrupts the parent's data and produces bugs React cannot help you find:</p>
<pre><code>function Total({ items }) {
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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Props are read-only</b> — Assigning to &#96;props.title&#96; is an error in strict mode and a lie everywhere else: the parent will overwrite it on the next render anyway.</div></div>
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

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Component là một hàm; props là đối số của nó</h2>
<p class="lead">Ở Chương 1 bạn thấy component là một hàm trả về giao diện. Props đơn giản là đối số của hàm đó — dữ liệu cha truyền xuống để con tự render chính mình. Mọi thứ về cách cấu trúc một app React đều suy ra từ một quy tắc: dữ liệu chảy <em>xuống</em>, một chiều, và props chỉ đọc.</p>

<h3>Truyền và nhận props</h3>
<p>Cha truyền props như thuộc tính JSX; con nhận chúng dưới dạng một object duy nhất, mà bạn hầu như luôn destructure:</p>
<pre><code>function Avatar({ src, alt }) {
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
<div class="out">&lt;div class="card"&gt;&lt;img src="/a.png" alt="An"/&gt;&lt;h3&gt;An&lt;/h3&gt;&lt;/div&gt;</div>
<p><code>UserCard</code> nhận một prop <code>user</code> và trao từng mảnh của nó xuống <code>Avatar</code>. Đó là hình dạng của mọi app React: một cây component, mỗi cái nhận props từ cha và truyền props xuống con.</p>

<h3>Props chảy một chiều: xuống</h3>
<p>Dữ liệu trong React đi theo một hướng — từ cha xuống con, không bao giờ ngang hay lên. Một con không thể với vào dữ liệu của cha, và hai anh em không thể truyền props trực tiếp cho nhau. Nếu hai component cần chia sẻ dữ liệu, dữ liệu đó nằm ở cha chung gần nhất của chúng, và cha truyền xuống cho cả hai. (Khi một con cần <em>đổi</em> dữ liệu chung, cha truyền xuống kèm một hàm — Bài 2.3, và trọn vẹn ở Chương 3.)</p>
<p>Nghe thì gò bó nhưng lại ngược lại: dòng một chiều chính là lý do bạn nhìn bất kỳ component nào cũng biết chính xác dữ liệu của nó từ đâu ra — từ cha, qua props. Không có tác động ma quái từ xa.</p>

<h3>Props chỉ đọc</h3>
<p>Một component không bao giờ được sửa props của chính nó. Props là một ảnh chụp trao xuống cho lần render này; mutate chúng làm hỏng dữ liệu của cha và sinh ra bug React không thể giúp bạn tìm:</p>
<pre><code>function Total({ items }) {
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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Props là chỉ-đọc</b> — Gán vào &#96;props.title&#96; là lỗi trong chế độ nghiêm ngặt và là một lời nói dối ở mọi nơi khác: dù sao cha cũng sẽ ghi đè nó ở lần render sau.</div></div>
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
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Components as containers: the <code>children</code> prop</h2>
<p class="lead">Sometimes a component shouldn't decide its contents — it should provide a shape and let the caller fill it. React has one special prop for this: whatever JSX you nest between a component's tags arrives as the <code>children</code> prop.</p>

<h3>Whatever you nest becomes <code>children</code></h3>
<pre><code>function Panel({ title, children }) {
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
<pre><code><span class="tok-comment">// ❌ a component trying to be everything via props</span>
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
<pre><code>function PrimaryButton({ children, ...rest }) {
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

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Component như cái hộp chứa: prop <code>children</code></h2>
<p class="lead">Có lúc một component không nên tự quyết nội dung của nó — nó nên cung cấp một hình dạng và để người gọi lấp đầy. React có một prop đặc biệt cho việc này: bất kỳ JSX nào bạn lồng giữa hai thẻ của một component đều tới dưới dạng prop <code>children</code>.</p>

<h3>Bất kỳ thứ gì bạn lồng đều thành <code>children</code></h3>
<pre><code>function Panel({ title, children }) {
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
<pre><code><span class="tok-comment">// ❌ một component cố làm tất cả qua props</span>
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
<pre><code>function PrimaryButton({ children, ...rest }) {
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
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The four prop patterns you use every day</h2>
<p class="lead">Props are just an object, so everything you know about JavaScript objects applies: defaults, spreading, functions as values. Four patterns cover the vast majority of real components.</p>

<h3>1 · Default values</h3>
<p>Give a prop a fallback right in the destructuring, so callers can omit it:</p>
<pre><code>function Badge({ label = 'New' }) {
  return &lt;span className="badge"&gt;{label}&lt;/span&gt;;
}</code></pre>
<p>Verified: <code>&lt;Badge /&gt;</code> renders <span class="out" style="display:inline">&lt;span class="badge"&gt;New&lt;/span&gt;</span> and <code>&lt;Badge label="Hot" /&gt;</code> renders <span class="out" style="display:inline">&lt;span class="badge"&gt;Hot&lt;/span&gt;</span>. This is plain JavaScript default-parameter syntax; there is no React-specific mechanism to learn.</p>

<h3>2 · Spreading props through</h3>
<p>When a wrapper wants to forward arbitrary props to the element underneath it, gather the rest with <code>...</code> and spread them:</p>
<pre><code>function Input({ label, ...rest }) {
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
<pre><code>function SearchBar({ onSearch }) {
  return &lt;button onClick={() =&gt; onSearch('react')}&gt;Search&lt;/button&gt;;
}

function Page() {
  return &lt;SearchBar onSearch={(q) =&gt; console.log('searching', q)} /&gt;;
}</code></pre>
<p><code>SearchBar</code> doesn't know what searching means — it just calls <code>onSearch</code> when clicked. <code>Page</code> owns the behaviour and hands it down. This "callback prop" is how every interactive child communicates upward, and it is the bridge to state in Chapter 3, where the parent's callback will call <code>setState</code>.</p>

<h3>4 · Typing props with TypeScript</h3>
<p>This course and cuongthai.com use TypeScript, so a component declares the exact shape of its props. It documents the component and catches a whole class of bugs — a missing prop, a string where a number was expected — before the app ever runs:</p>
<pre><code>type BadgeProps = {
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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Annotate the parameter, not the function</b> — &#96;function Card({ title }: CardProps)&#96;. Avoid &#96;React.FC&#96;: it implicitly adds a &#96;children&#96; prop your component may not render.</div></div>
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

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Bốn khuôn props bạn dùng mỗi ngày</h2>
<p class="lead">Props chỉ là một object, nên mọi thứ bạn biết về object JavaScript đều áp dụng: mặc định, spread, hàm làm giá trị. Bốn khuôn mẫu bao phần lớn các component thật.</p>

<h3>1 · Giá trị mặc định</h3>
<p>Cho một prop một giá trị dự phòng ngay trong destructuring, để người gọi có thể bỏ qua:</p>
<pre><code>function Badge({ label = 'New' }) {
  return &lt;span className="badge"&gt;{label}&lt;/span&gt;;
}</code></pre>
<p>Đã kiểm: <code>&lt;Badge /&gt;</code> render <span class="out" style="display:inline">&lt;span class="badge"&gt;New&lt;/span&gt;</span> còn <code>&lt;Badge label="Hot" /&gt;</code> render <span class="out" style="display:inline">&lt;span class="badge"&gt;Hot&lt;/span&gt;</span>. Đây là cú pháp tham số mặc định thuần JavaScript; không có cơ chế riêng của React phải học.</p>

<h3>2 · Spread props xuyên qua</h3>
<p>Khi một wrapper muốn chuyển tiếp các props tuỳ ý xuống element bên dưới, gom phần còn lại bằng <code>...</code> rồi spread chúng:</p>
<pre><code>function Input({ label, ...rest }) {
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
<pre><code>function SearchBar({ onSearch }) {
  return &lt;button onClick={() =&gt; onSearch('react')}&gt;Search&lt;/button&gt;;
}

function Page() {
  return &lt;SearchBar onSearch={(q) =&gt; console.log('searching', q)} /&gt;;
}</code></pre>
<p><code>SearchBar</code> không biết tìm kiếm nghĩa là gì — nó chỉ gọi <code>onSearch</code> khi được click. <code>Page</code> sở hữu hành vi và trao nó xuống. "Callback prop" này là cách mọi con tương tác giao tiếp lên trên, và là cây cầu tới state ở Chương 3, nơi callback của cha sẽ gọi <code>setState</code>.</p>

<h3>4 · Gõ kiểu props bằng TypeScript</h3>
<p>Khoá này và cuongthai.com dùng TypeScript, nên một component khai đúng hình dạng props của nó. Nó vừa là tài liệu cho component vừa bắt được cả một lớp bug — thiếu prop, một chuỗi ở chỗ đáng lẽ là số — trước khi app kịp chạy:</p>
<pre><code>type BadgeProps = {
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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Chú thích cho tham số, đừng chú thích cho hàm</b> — &#96;function Card({ title }: CardProps)&#96;. Hãy tránh &#96;React.FC&#96;: nó ngầm thêm một prop &#96;children&#96; mà component của bạn có thể chẳng vẽ ra.</div></div>
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
