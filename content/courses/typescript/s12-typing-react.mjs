/**
 * TypeScript — Chương 12: Gõ kiểu React.
 * Mọi output tsc là THẬT (tsc --strict --jsx react-jsx, @types/react 18, verified).
 * < > → &lt; &gt; (kể cả JSX); & → &amp;; => → =&gt;; backtick → &#96;; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 12 — Typing React|||Chương 12 — Gõ kiểu React',
  description: 'Gõ kiểu một UI React: props với interface, children là ReactNode, hooks (useState/useRef), sự kiện DOM có kiểu, context an toàn null và component generic.',
  lessons: [
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — Components & props|||12.1 — Component & props',
      slug: 'typescript-12-1-components-props',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một component là một hàm nhận props; gõ kiểu props bằng một interface, và children bằng ReactNode. JSX kiểm mọi thuộc tính bạn truyền.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Components &amp; props</h2>
<p class="lead">A React component is a function that takes one argument — its <code>props</code> — and returns JSX. Type the props with an interface, and every place you use the component in JSX is checked against it: wrong prop type, missing required prop, unknown prop — all compile errors.</p>

<h3>Typed props</h3>
<p>Declare a props interface and destructure it in the parameter. Optional props get a <code>?</code>, exactly like any object type:</p>
<pre><code><span class="tok-comment">// button.tsx</span>
<span class="tok-keyword">interface</span> ButtonProps { label: <span class="tok-keyword">string</span>; onClick: () =&gt; <span class="tok-keyword">void</span>; disabled?: <span class="tok-keyword">boolean</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">Button</span>({ label, onClick, disabled }: ButtonProps) {
  <span class="tok-keyword">return</span> &lt;button onClick={onClick} disabled={disabled}&gt;{label}&lt;/button&gt;;
}
<span class="tok-keyword">const</span> bad = &lt;Button label={<span class="tok-number">42</span>} onClick={() =&gt; {}} /&gt;;   <span class="tok-comment">// label must be a string</span></code></pre>
<div class="out">button.tsx(6,21): error TS2322: Type 'number' is not assignable to type 'string'.</div>
<p>The JSX attribute <code>label={42}</code> is checked against <code>ButtonProps.label</code>, which is <code>string</code> — so the number is rejected right where you wrote it. This is the payoff: your components document their own API, and misuse is caught at the call site, not discovered as a blank button at runtime.</p>

<h3>children: the ReactNode type</h3>
<p>Anything you nest between a component's tags arrives as the <code>children</code> prop. Its type is <code>ReactNode</code> — the catch-all for "anything React can render" (elements, strings, numbers, arrays, null):</p>
<pre><code><span class="tok-comment">// card.tsx</span>
<span class="tok-keyword">import</span> { ReactNode } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">interface</span> CardProps { title: <span class="tok-keyword">string</span>; children: ReactNode; }
<span class="tok-keyword">function</span> <span class="tok-function">Card</span>({ title, children }: CardProps) {
  <span class="tok-keyword">return</span> &lt;section&gt;&lt;h2&gt;{title}&lt;/h2&gt;{children}&lt;/section&gt;;
}
<span class="tok-keyword">const</span> c = &lt;Card title=<span class="tok-string">"Hi"</span> /&gt;;   <span class="tok-comment">// children is required</span></code></pre>
<div class="out">card.tsx(7,12): error TS2741: Property 'children' is missing in type '{ title: string; }' but required in type 'CardProps'.</div>
<p>Because <code>children</code> is a required prop, using <code>&lt;Card /&gt;</code> with nothing inside is an error — you declared that a Card must wrap something. Make it optional with <code>children?: ReactNode</code> if empty is allowed. <code>ReactNode</code> is the type you want for "renderable content"; reach for it any time a prop holds JSX.</p>

<div class="callout ok">A component is a function of its props; type the props with an interface and JSX checks every attribute at the call site. <code>children</code> is just another prop, typed <code>ReactNode</code> ("anything renderable"). Optional props use <code>?</code>, same as any object type.</div>
<div class="note-ct">Every component in this frontend has a typed props interface, which is why refactoring a shared component (renaming a prop, tightening a type) lights up exactly the call sites that need updating — the compiler becomes the to-do list. <code>ReactNode</code> is what types the <code>children</code> of every layout and wrapper here.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: typed props on Code Lab</span><span class="lc-sub">Type a component's props and its children.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Component &amp; props</h2>
<p class="lead">Một component React là một hàm nhận một đối số — <code>props</code> của nó — và trả về JSX. Gõ kiểu props bằng một interface, và mọi chỗ bạn dùng component trong JSX đều bị kiểm dựa trên nó: sai kiểu prop, thiếu prop bắt buộc, prop lạ — đều là lỗi biên dịch.</p>

<h3>Props có kiểu</h3>
<p>Khai một interface props và giải cấu trúc nó trong tham số. Props tuỳ chọn có một <code>?</code>, y như bất kỳ kiểu object nào:</p>
<pre><code><span class="tok-comment">// button.tsx</span>
<span class="tok-keyword">interface</span> ButtonProps { label: <span class="tok-keyword">string</span>; onClick: () =&gt; <span class="tok-keyword">void</span>; disabled?: <span class="tok-keyword">boolean</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">Button</span>({ label, onClick, disabled }: ButtonProps) {
  <span class="tok-keyword">return</span> &lt;button onClick={onClick} disabled={disabled}&gt;{label}&lt;/button&gt;;
}
<span class="tok-keyword">const</span> bad = &lt;Button label={<span class="tok-number">42</span>} onClick={() =&gt; {}} /&gt;;   <span class="tok-comment">// label phải là chuỗi</span></code></pre>
<div class="out">button.tsx(6,21): error TS2322: Type 'number' is not assignable to type 'string'.</div>
<p>Thuộc tính JSX <code>label={42}</code> bị kiểm dựa trên <code>ButtonProps.label</code>, vốn là <code>string</code> — nên số bị từ chối ngay chỗ bạn viết. Đây là phần thưởng: component tự ghi API của nó, và dùng sai bị bắt tại chỗ gọi, không phải phát hiện ra một nút trắng trơn lúc chạy.</p>

<h3>children: kiểu ReactNode</h3>
<p>Bất cứ thứ gì bạn lồng giữa các thẻ của một component đến dưới dạng prop <code>children</code>. Kiểu của nó là <code>ReactNode</code> — cái bao trọn "bất cứ thứ gì React render được" (element, chuỗi, số, mảng, null):</p>
<pre><code><span class="tok-comment">// card.tsx</span>
<span class="tok-keyword">import</span> { ReactNode } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">interface</span> CardProps { title: <span class="tok-keyword">string</span>; children: ReactNode; }
<span class="tok-keyword">function</span> <span class="tok-function">Card</span>({ title, children }: CardProps) {
  <span class="tok-keyword">return</span> &lt;section&gt;&lt;h2&gt;{title}&lt;/h2&gt;{children}&lt;/section&gt;;
}
<span class="tok-keyword">const</span> c = &lt;Card title=<span class="tok-string">"Hi"</span> /&gt;;   <span class="tok-comment">// children là bắt buộc</span></code></pre>
<div class="out">card.tsx(7,12): error TS2741: Property 'children' is missing in type '{ title: string; }' but required in type 'CardProps'.</div>
<p>Vì <code>children</code> là một prop bắt buộc, dùng <code>&lt;Card /&gt;</code> mà không có gì bên trong là lỗi — bạn đã khai rằng một Card phải bọc lấy thứ gì đó. Làm nó tuỳ chọn bằng <code>children?: ReactNode</code> nếu cho phép rỗng. <code>ReactNode</code> là kiểu bạn muốn cho "nội dung render được"; hãy dùng nó mỗi khi một prop chứa JSX.</p>

<div class="callout ok">Một component là một hàm của props; gõ kiểu props bằng một interface và JSX kiểm mọi thuộc tính tại chỗ gọi. <code>children</code> chỉ là một prop khác, kiểu <code>ReactNode</code> ("bất cứ thứ gì render được"). Props tuỳ chọn dùng <code>?</code>, y như mọi kiểu object.</div>
<div class="note-ct">Mọi component trong frontend này có một interface props có kiểu, đó là lý do đổi cấu trúc một component dùng chung (đổi tên prop, siết một kiểu) làm sáng lên đúng những chỗ gọi cần cập nhật — trình biên dịch trở thành danh sách việc-cần-làm. <code>ReactNode</code> là thứ gõ kiểu <code>children</code> của mọi layout và wrapper ở đây.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: props có kiểu trên Code Lab</span><span class="lc-sub">Gõ kiểu props và children của một component.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Typing hooks|||12.2 — Gõ kiểu hooks',
      slug: 'typescript-12-2-hooks',
      type: 'LESSON',
      isFreePreview: true,
      description: 'useState suy kiểu từ giá trị đầu (và setter được kiểm theo đó); dùng generic tường minh <T | null> khi khởi đầu là null; useRef<HTMLInputElement>.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Typing hooks</h2>
<p class="lead">Hooks are generic functions, so they're typed like everything else from chapter 6. Most of the time inference does the work; you reach for an explicit type argument only when the initial value can't tell the whole story.</p>

<h3>useState: inferred, and the setter is checked too</h3>
<p><code>useState(0)</code> infers <code>number</code> from the initial value — and crucially, the setter is typed to match, so it rejects the wrong type:</p>
<pre><code><span class="tok-comment">// state.tsx</span>
<span class="tok-keyword">import</span> { useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">function</span> <span class="tok-function">Counter</span>() {
  <span class="tok-keyword">const</span> [count, setCount] = <span class="tok-function">useState</span>(<span class="tok-number">0</span>);   <span class="tok-comment">// inferred as number</span>
  <span class="tok-function">setCount</span>(<span class="tok-string">'five'</span>);                        <span class="tok-comment">// setter only accepts number</span>
  <span class="tok-keyword">return</span> count;
}</code></pre>
<div class="out">state.tsx(5,12): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SetStateAction&lt;number&gt;'.</div>
<p><code>setCount</code> is a <code>SetStateAction&lt;number&gt;</code> — it accepts a number or a function <code>(prev: number) =&gt; number</code>, never a string. State and its updater can't drift out of sync.</p>

<h3>Explicit type when null starts it off</h3>
<p>When the initial value is <code>null</code>, inference would lock the type to <code>null</code> forever. Give the generic explicitly. Same for a ref to a DOM node:</p>
<pre><code><span class="tok-comment">// ref.tsx</span>
<span class="tok-keyword">import</span> { useRef, useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">Profile</span>() {
  <span class="tok-keyword">const</span> inputRef = <span class="tok-function">useRef</span>&lt;HTMLInputElement&gt;(<span class="tok-keyword">null</span>);
  <span class="tok-keyword">const</span> [user, setUser] = <span class="tok-function">useState</span>&lt;User | <span class="tok-keyword">null</span>&gt;(<span class="tok-keyword">null</span>);
  <span class="tok-keyword">const</span> focus = () =&gt; inputRef.current?.<span class="tok-function">focus</span>();
  <span class="tok-keyword">return</span> { user, setUser, focus };
}</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Now <code>user</code> is <code>User | null</code> (not just <code>null</code>), so the rest of the component is forced to handle the "not loaded yet" state — the strict-null discipline again. And <code>inputRef.current</code> is <code>HTMLInputElement | null</code>, which is why you write <code>inputRef.current?.focus()</code> with the optional chain: the DOM node doesn't exist until React attaches it.</p>

<div class="callout ok">Hooks are generics. <code>useState(x)</code> infers from <code>x</code> and types the setter to match. When the initial value is <code>null</code>, pass the type explicitly — <code>useState&lt;User | null&gt;(null)</code>, <code>useRef&lt;HTMLInputElement&gt;(null)</code> — so the state isn't stuck as <code>null</code>. A ref's <code>.current</code> is always <code>T | null</code>.</div>
<div class="note-ct">The frontend's data-loading components are full of <code>useState&lt;T | null&gt;(null)</code> — the <code>| null</code> is the "loading" state, and because it's in the type, the JSX can't forget to render a skeleton before the data arrives. Refs to inputs and scroll containers use the <code>useRef&lt;HTMLElement&gt;(null)</code> + optional-chain pattern throughout.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: hooks on Code Lab</span><span class="lc-sub">Type useState, a nullable state, and a DOM ref.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Gõ kiểu hooks</h2>
<p class="lead">Hooks là các hàm generic, nên chúng được gõ kiểu như mọi thứ ở chương 6. Đa số thời gian suy kiểu làm việc; bạn chỉ cần một đối số kiểu tường minh khi giá trị khởi đầu không kể hết câu chuyện.</p>

<h3>useState: suy kiểu, và setter cũng bị kiểm</h3>
<p><code>useState(0)</code> suy ra <code>number</code> từ giá trị đầu — và quan trọng nhất, setter được gõ kiểu khớp theo, nên nó từ chối sai kiểu:</p>
<pre><code><span class="tok-comment">// state.tsx</span>
<span class="tok-keyword">import</span> { useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">function</span> <span class="tok-function">Counter</span>() {
  <span class="tok-keyword">const</span> [count, setCount] = <span class="tok-function">useState</span>(<span class="tok-number">0</span>);   <span class="tok-comment">// suy ra là number</span>
  <span class="tok-function">setCount</span>(<span class="tok-string">'five'</span>);                        <span class="tok-comment">// setter chỉ nhận number</span>
  <span class="tok-keyword">return</span> count;
}</code></pre>
<div class="out">state.tsx(5,12): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SetStateAction&lt;number&gt;'.</div>
<p><code>setCount</code> là một <code>SetStateAction&lt;number&gt;</code> — nó nhận một số hoặc một hàm <code>(prev: number) =&gt; number</code>, không bao giờ một chuỗi. State và bộ cập nhật của nó không thể trôi lệch nhau.</p>

<h3>Kiểu tường minh khi khởi đầu bằng null</h3>
<p>Khi giá trị đầu là <code>null</code>, suy kiểu sẽ khoá kiểu thành <code>null</code> mãi mãi. Hãy đưa generic tường minh. Tương tự cho một ref tới một nút DOM:</p>
<pre><code><span class="tok-comment">// ref.tsx</span>
<span class="tok-keyword">import</span> { useRef, useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">Profile</span>() {
  <span class="tok-keyword">const</span> inputRef = <span class="tok-function">useRef</span>&lt;HTMLInputElement&gt;(<span class="tok-keyword">null</span>);
  <span class="tok-keyword">const</span> [user, setUser] = <span class="tok-function">useState</span>&lt;User | <span class="tok-keyword">null</span>&gt;(<span class="tok-keyword">null</span>);
  <span class="tok-keyword">const</span> focus = () =&gt; inputRef.current?.<span class="tok-function">focus</span>();
  <span class="tok-keyword">return</span> { user, setUser, focus };
}</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Giờ <code>user</code> là <code>User | null</code> (không chỉ <code>null</code>), nên phần còn lại của component buộc phải xử lý trạng thái "chưa tải xong" — lại là kỷ luật strict-null. Và <code>inputRef.current</code> là <code>HTMLInputElement | null</code>, đó là lý do bạn viết <code>inputRef.current?.focus()</code> với optional chain: nút DOM chưa tồn tại tới khi React gắn nó.</p>

<div class="callout ok">Hooks là generic. <code>useState(x)</code> suy từ <code>x</code> và gõ kiểu setter khớp theo. Khi giá trị đầu là <code>null</code>, truyền kiểu tường minh — <code>useState&lt;User | null&gt;(null)</code>, <code>useRef&lt;HTMLInputElement&gt;(null)</code> — để state không kẹt ở <code>null</code>. Một ref có <code>.current</code> luôn là <code>T | null</code>.</div>
<div class="note-ct">Các component tải dữ liệu của frontend đầy <code>useState&lt;T | null&gt;(null)</code> — cái <code>| null</code> là trạng thái "đang tải", và vì nó nằm trong kiểu, JSX không thể quên render một skeleton trước khi dữ liệu đến. Ref tới input và vùng cuộn dùng pattern <code>useRef&lt;HTMLElement&gt;(null)</code> + optional-chain khắp nơi.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: hooks trên Code Lab</span><span class="lc-sub">Gõ kiểu useState, một state nullable, và một DOM ref.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — Typing events|||12.3 — Gõ kiểu sự kiện',
      slug: 'typescript-12-3-events',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Sự kiện DOM có kiểu theo cả loại sự kiện lẫn phần tử: ChangeEvent<HTMLInputElement> cho e.target.value (luôn là chuỗi).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Typing events</h2>
<p class="lead">React's event types are generic over the element that fired them, which is how <code>e.target</code> knows exactly what it is. The most common one — <code>ChangeEvent&lt;HTMLInputElement&gt;</code> — gives you a fully typed <code>e.target.value</code>.</p>

<h3>A change handler</h3>
<p>Type the parameter as <code>ChangeEvent&lt;HTMLInputElement&gt;</code> and <code>e.target</code> is an input, so <code>e.target.value</code> is a <code>string</code> — always, because that's what the DOM gives you:</p>
<pre><code><span class="tok-comment">// form.tsx</span>
<span class="tok-keyword">import</span> { ChangeEvent } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">function</span> <span class="tok-function">onChange</span>(e: ChangeEvent&lt;HTMLInputElement&gt;) {
  <span class="tok-keyword">const</span> value: <span class="tok-keyword">string</span> = e.target.value;   <span class="tok-comment">// typed as string</span>
  <span class="tok-keyword">const</span> bad: <span class="tok-keyword">number</span> = e.target.value;      <span class="tok-comment">// value is always a string</span>
  <span class="tok-keyword">return</span> value + bad;
}</code></pre>
<div class="out">form.tsx(5,9): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>Same lesson as the Express params in chapter 11: an input's value is a <code>string</code>, even <code>&lt;input type="number"&gt;</code>. The type stops you from treating <code>"42"</code> as a number without parsing. Because the event is generic over <code>HTMLInputElement</code>, you also get <code>e.target.checked</code>, <code>e.target.name</code> and the rest — correctly typed for an input specifically.</p>

<h3>The event types you'll use</h3>
<p>They follow one pattern — event kind, generic over element: <code>ChangeEvent&lt;HTMLInputElement&gt;</code> for inputs, <code>FormEvent&lt;HTMLFormElement&gt;</code> for a form's <code>onSubmit</code>, <code>MouseEvent&lt;HTMLButtonElement&gt;</code> for clicks, <code>KeyboardEvent&lt;HTMLInputElement&gt;</code> for key presses. When you write the handler inline in JSX, TypeScript infers all of this for you; you only name the type when the handler is a separate function.</p>

<div class="callout ok">Event types are generic over their element: <code>ChangeEvent&lt;HTMLInputElement&gt;</code>, <code>FormEvent&lt;HTMLFormElement&gt;</code>, <code>MouseEvent&lt;HTMLButtonElement&gt;</code>. That's what makes <code>e.target.value</code> (a string) and <code>e.target.checked</code> (a boolean) correctly typed. Inline handlers infer it; standalone handlers need the annotation.</div>
<div class="note-ct">Every controlled input in this frontend uses <code>ChangeEvent&lt;HTMLInputElement&gt;</code> so <code>e.target.value</code> flows into <code>useState&lt;string&gt;</code> with matching types — the value is a string end to end, and any place that needs a number parses it explicitly. Form submit handlers are typed <code>FormEvent&lt;HTMLFormElement&gt;</code> so <code>e.preventDefault()</code> is always available.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: events on Code Lab</span><span class="lc-sub">Type a change handler and a form submit handler.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Gõ kiểu sự kiện</h2>
<p class="lead">Kiểu sự kiện của React là generic trên phần tử phát ra nó, đó là cách <code>e.target</code> biết chính xác nó là gì. Cái phổ biến nhất — <code>ChangeEvent&lt;HTMLInputElement&gt;</code> — cho bạn một <code>e.target.value</code> có kiểu đầy đủ.</p>

<h3>Một handler thay đổi</h3>
<p>Gõ kiểu tham số là <code>ChangeEvent&lt;HTMLInputElement&gt;</code> và <code>e.target</code> là một input, nên <code>e.target.value</code> là một <code>string</code> — luôn luôn, vì đó là thứ DOM đưa cho bạn:</p>
<pre><code><span class="tok-comment">// form.tsx</span>
<span class="tok-keyword">import</span> { ChangeEvent } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">function</span> <span class="tok-function">onChange</span>(e: ChangeEvent&lt;HTMLInputElement&gt;) {
  <span class="tok-keyword">const</span> value: <span class="tok-keyword">string</span> = e.target.value;   <span class="tok-comment">// có kiểu string</span>
  <span class="tok-keyword">const</span> bad: <span class="tok-keyword">number</span> = e.target.value;      <span class="tok-comment">// value luôn là chuỗi</span>
  <span class="tok-keyword">return</span> value + bad;
}</code></pre>
<div class="out">form.tsx(5,9): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>Cùng bài học với params Express ở chương 11: value của một input là một <code>string</code>, kể cả <code>&lt;input type="number"&gt;</code>. Kiểu ngăn bạn coi <code>"42"</code> là số mà không phân tích. Vì sự kiện là generic trên <code>HTMLInputElement</code>, bạn cũng có <code>e.target.checked</code>, <code>e.target.name</code> và phần còn lại — có kiểu đúng riêng cho một input.</p>

<h3>Các kiểu sự kiện bạn sẽ dùng</h3>
<p>Chúng theo một pattern — loại sự kiện, generic trên phần tử: <code>ChangeEvent&lt;HTMLInputElement&gt;</code> cho input, <code>FormEvent&lt;HTMLFormElement&gt;</code> cho <code>onSubmit</code> của form, <code>MouseEvent&lt;HTMLButtonElement&gt;</code> cho click, <code>KeyboardEvent&lt;HTMLInputElement&gt;</code> cho phím. Khi bạn viết handler nội dòng trong JSX, TypeScript suy ra hết cho bạn; bạn chỉ đặt tên kiểu khi handler là một hàm riêng.</p>

<div class="callout ok">Kiểu sự kiện là generic trên phần tử của nó: <code>ChangeEvent&lt;HTMLInputElement&gt;</code>, <code>FormEvent&lt;HTMLFormElement&gt;</code>, <code>MouseEvent&lt;HTMLButtonElement&gt;</code>. Đó là thứ làm <code>e.target.value</code> (một chuỗi) và <code>e.target.checked</code> (một boolean) có kiểu đúng. Handler nội dòng suy ra nó; handler riêng cần chú thích.</div>
<div class="note-ct">Mọi input có kiểm soát (controlled) trong frontend này dùng <code>ChangeEvent&lt;HTMLInputElement&gt;</code> để <code>e.target.value</code> chảy vào <code>useState&lt;string&gt;</code> với kiểu khớp — value là chuỗi từ đầu tới cuối, và chỗ nào cần số thì phân tích tường minh. Handler submit form được gõ kiểu <code>FormEvent&lt;HTMLFormElement&gt;</code> để <code>e.preventDefault()</code> luôn có sẵn.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: sự kiện trên Code Lab</span><span class="lc-sub">Gõ kiểu một handler thay đổi và một handler submit form.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — Typed context & generic components|||12.4 — Context có kiểu & component generic',
      slug: 'typescript-12-4-context-generics',
      type: 'LESSON',
      isFreePreview: true,
      description: 'createContext<Theme | null>(null) ép useContext xử lý trường hợp "ngoài Provider"; component generic <T> để một List dùng lại cho mọi kiểu phần tử.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Typed context &amp; generic components</h2>
<p class="lead">Two patterns that put chapter 6's generics to work in React: a typed <code>Context</code> that forces consumers to handle the "no provider" case, and a generic component that adapts to whatever data you give it.</p>

<h3>Typed context</h3>
<p><code>createContext</code> is generic. Type it with the value union — including the <code>null</code> default used when a consumer is outside any provider — and <code>useContext</code> returns that union, forcing a check:</p>
<pre><code><span class="tok-comment">// context.tsx</span>
<span class="tok-keyword">import</span> { createContext, useContext } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">interface</span> Theme { color: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> ThemeContext = <span class="tok-function">createContext</span>&lt;Theme | <span class="tok-keyword">null</span>&gt;(<span class="tok-keyword">null</span>);
<span class="tok-keyword">function</span> <span class="tok-function">useThemeColor</span>(): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">const</span> theme = <span class="tok-function">useContext</span>(ThemeContext);
  <span class="tok-keyword">return</span> theme.color;   <span class="tok-comment">// context default is null</span>
}</code></pre>
<div class="out">context.tsx(7,10): error TS18047: 'theme' is possibly 'null'.</div>
<p>Because the context can be <code>null</code> (no provider above), <code>theme.color</code> is rejected until you narrow — which is exactly the reminder you want: a component reading a context it isn't wrapped in is a real bug, now caught at compile time. The common fix is a small hook that throws a clear error if <code>theme</code> is null, returning a non-null <code>Theme</code> to every caller.</p>

<h3>A generic component</h3>
<p>Components take type parameters too. A <code>List&lt;T&gt;</code> renders any array, inferring the element type from what you pass — and the <code>render</code> callback is typed to match:</p>
<pre><code><span class="tok-comment">// list.tsx</span>
<span class="tok-keyword">import</span> { ReactNode } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">interface</span> ListProps&lt;T&gt; { items: T[]; render: (item: T) =&gt; ReactNode; }
<span class="tok-keyword">function</span> <span class="tok-function">List</span>&lt;T&gt;({ items, render }: ListProps&lt;T&gt;) {
  <span class="tok-keyword">return</span> &lt;ul&gt;{items.<span class="tok-function">map</span>((it, i) =&gt; &lt;li key={i}&gt;{<span class="tok-function">render</span>(it)}&lt;/li&gt;)}&lt;/ul&gt;;
}
<span class="tok-keyword">const</span> el = &lt;List items={[<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>]} render={(n) =&gt; n.<span class="tok-function">toFixed</span>(<span class="tok-number">0</span>)} /&gt;;   <span class="tok-comment">// T inferred as number</span></code></pre>
<div class="out">(no output — exit code 0)</div>
<p>From <code>items={[1, 2, 3]}</code> TypeScript infers <code>T = number</code>, so inside <code>render</code> the parameter <code>n</code> is a <code>number</code> and <code>n.toFixed(0)</code> is valid. Pass a <code>User[]</code> instead and <code>render</code> would receive a <code>User</code> — one component, correctly typed for every element type, exactly like the generic functions of chapter 6.</p>

<div class="callout ok"><code>createContext&lt;T | null&gt;(null)</code> makes <code>useContext</code> return <code>T | null</code>, forcing consumers to handle "outside the provider". Generic components (<code>function List&lt;T&gt;(props: ListProps&lt;T&gt;)</code>) infer their type parameter from props, so one component serves every element type with full safety.</div>
<div class="note-ct">This frontend's theme, auth, and notes-theme providers are all typed contexts, and the consuming hooks throw if used outside their provider — the <code>| null</code> in the context type is what makes that guard type-safe rather than a runtime surprise. Reusable list and table components are generic so a typo in a row renderer is caught against the real row type.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: context &amp; generic components on Code Lab</span><span class="lc-sub">Type a context and build a generic List.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Context có kiểu &amp; component generic</h2>
<p class="lead">Hai pattern đưa generic của chương 6 vào làm việc trong React: một <code>Context</code> có kiểu ép bên tiêu thụ xử lý trường hợp "không có provider", và một component generic thích ứng với bất cứ dữ liệu nào bạn đưa vào.</p>

<h3>Context có kiểu</h3>
<p><code>createContext</code> là generic. Gõ kiểu nó bằng union giá trị — gồm cả mặc định <code>null</code> dùng khi một bên tiêu thụ ở ngoài mọi provider — và <code>useContext</code> trả về union đó, ép một phép kiểm:</p>
<pre><code><span class="tok-comment">// context.tsx</span>
<span class="tok-keyword">import</span> { createContext, useContext } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">interface</span> Theme { color: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> ThemeContext = <span class="tok-function">createContext</span>&lt;Theme | <span class="tok-keyword">null</span>&gt;(<span class="tok-keyword">null</span>);
<span class="tok-keyword">function</span> <span class="tok-function">useThemeColor</span>(): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">const</span> theme = <span class="tok-function">useContext</span>(ThemeContext);
  <span class="tok-keyword">return</span> theme.color;   <span class="tok-comment">// mặc định context là null</span>
}</code></pre>
<div class="out">context.tsx(7,10): error TS18047: 'theme' is possibly 'null'.</div>
<p>Vì context có thể là <code>null</code> (không provider phía trên), <code>theme.color</code> bị từ chối tới khi bạn thu hẹp — đúng là lời nhắc bạn muốn: một component đọc một context nó không được bọc trong đó là một lỗi thật, giờ bị bắt lúc biên dịch. Cách sửa phổ biến là một hook nhỏ ném một lỗi rõ ràng nếu <code>theme</code> là null, trả về một <code>Theme</code> không-null cho mọi bên gọi.</p>

<h3>Một component generic</h3>
<p>Component cũng nhận tham số kiểu. Một <code>List&lt;T&gt;</code> render bất kỳ mảng nào, suy ra kiểu phần tử từ thứ bạn truyền — và callback <code>render</code> được gõ kiểu khớp theo:</p>
<pre><code><span class="tok-comment">// list.tsx</span>
<span class="tok-keyword">import</span> { ReactNode } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">interface</span> ListProps&lt;T&gt; { items: T[]; render: (item: T) =&gt; ReactNode; }
<span class="tok-keyword">function</span> <span class="tok-function">List</span>&lt;T&gt;({ items, render }: ListProps&lt;T&gt;) {
  <span class="tok-keyword">return</span> &lt;ul&gt;{items.<span class="tok-function">map</span>((it, i) =&gt; &lt;li key={i}&gt;{<span class="tok-function">render</span>(it)}&lt;/li&gt;)}&lt;/ul&gt;;
}
<span class="tok-keyword">const</span> el = &lt;List items={[<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>]} render={(n) =&gt; n.<span class="tok-function">toFixed</span>(<span class="tok-number">0</span>)} /&gt;;   <span class="tok-comment">// T suy ra là number</span></code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Từ <code>items={[1, 2, 3]}</code> TypeScript suy <code>T = number</code>, nên bên trong <code>render</code> tham số <code>n</code> là một <code>number</code> và <code>n.toFixed(0)</code> hợp lệ. Truyền một <code>User[]</code> thì <code>render</code> sẽ nhận một <code>User</code> — một component, có kiểu đúng cho mọi kiểu phần tử, y như các hàm generic của chương 6.</p>

<div class="callout ok"><code>createContext&lt;T | null&gt;(null)</code> làm <code>useContext</code> trả về <code>T | null</code>, ép bên tiêu thụ xử lý "ngoài provider". Component generic (<code>function List&lt;T&gt;(props: ListProps&lt;T&gt;)</code>) suy tham số kiểu từ props, nên một component phục vụ mọi kiểu phần tử với an toàn đầy đủ.</div>
<div class="note-ct">Các provider theme, auth, và notes-theme của frontend này đều là context có kiểu, và các hook tiêu thụ ném lỗi nếu dùng ngoài provider của chúng — cái <code>| null</code> trong kiểu context là thứ làm phép gác đó an toàn kiểu thay vì một bất ngờ lúc chạy. Các component list và table dùng lại là generic để một lỗi gõ trong bộ render hàng bị bắt dựa trên kiểu hàng thật.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: context &amp; component generic trên Code Lab</span><span class="lc-sub">Gõ kiểu một context và dựng một List generic.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.5 quiz ─────────────────────────── */
    {
      title: '12.5 — Chapter 12 quiz|||12.5 — Kiểm tra Chương 12',
      slug: 'typescript-12-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về props & ReactNode, useState/useRef, kiểu sự kiện DOM, context có kiểu và component generic.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on typing React — props, hooks, events, context. The patterns are the same generics and unions from earlier chapters, now wearing JSX. Questions follow lesson order.</p>
<div class="callout ok">Aim for 7/8. The two you'll type every day: props interfaces (12.1) and <code>useState&lt;T | null&gt;(null)</code> for loading state (12.2).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về gõ kiểu React — props, hooks, sự kiện, context. Các pattern vẫn là generic và union từ các chương trước, giờ khoác JSX. Các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu bạn gõ mỗi ngày: interface props (12.1) và <code>useState&lt;T | null&gt;(null)</code> cho trạng thái loading (12.2).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'How do you type a React component\'s props?|||Bạn gõ kiểu props của một component React thế nào?',
            options: [
              'With an interface (or type) on the single props parameter|||Bằng một interface (hoặc type) trên tham số props duy nhất',
              'With a class|||Bằng một class',
              'Props cannot be typed|||Props không thể gõ kiểu',
              'With a decorator|||Bằng một decorator',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What type is used for the children prop (renderable content)?|||Kiểu nào dùng cho prop children (nội dung render được)?',
            options: [
              'string',
              'ReactNode',
              'any',
              'HTMLElement',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'const [count, setCount] = useState(0); setCount("five") gives?|||const [count, setCount] = useState(0); setCount("five") cho ra?',
            options: [
              'No error|||Không lỗi',
              "TS2345: string is not assignable to SetStateAction<number> — the setter is typed to match|||TS2345: string không gán được cho SetStateAction<number> — setter được gõ kiểu khớp",
              'It converts "five" to a number|||Nó ép "five" thành số',
              'A runtime error only|||Chỉ lỗi lúc chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why write useState<User | null>(null) instead of useState(null)?|||Vì sao viết useState<User | null>(null) thay vì useState(null)?',
            options: [
              'They are identical|||Chúng giống hệt',
              'useState(null) infers the type as just null; the explicit generic allows a User later|||useState(null) suy kiểu chỉ là null; generic tường minh cho phép một User về sau',
              'null is not allowed|||null không được phép',
              'To make it faster|||Để nó nhanh hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the type of inputRef.current for useRef<HTMLInputElement>(null)?|||Kiểu của inputRef.current với useRef<HTMLInputElement>(null) là gì?',
            options: [
              'HTMLInputElement',
              'HTMLInputElement | null',
              'null',
              'any',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'For e: ChangeEvent<HTMLInputElement>, what type is e.target.value?|||Với e: ChangeEvent<HTMLInputElement>, e.target.value có kiểu gì?',
            options: [
              'number',
              'string — even for <input type="number">|||string — kể cả với <input type="number">',
              'boolean',
              'any',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'const ctx = createContext<Theme | null>(null); const t = useContext(ctx); t.color gives?|||const ctx = createContext<Theme | null>(null); const t = useContext(ctx); t.color cho ra?',
            options: [
              'No error|||Không lỗi',
              "TS18047 't' is possibly 'null' — you must handle the no-provider case|||TS18047 't' is possibly 'null' — phải xử lý trường hợp không-provider",
              'It returns undefined|||Nó trả undefined',
              'A runtime error only|||Chỉ lỗi lúc chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In <List items={[1,2,3]} render={(n) => ...} />, what is n\'s type?|||Trong <List items={[1,2,3]} render={(n) => ...} />, kiểu của n là gì?',
            options: [
              'any',
              'number — T is inferred from items|||number — T được suy từ items',
              'unknown',
              'string',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
