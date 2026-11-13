/**
 * Next.js & React — Chương 6: Bộ đồ nghề hooks.
 * Song ngữ EN/VI. Escape: backtick→&#96;, `${`→\${, < >→&lt; &gt; trong code.
 * Output đã CHẠY THẬT (react-dom/client + act, scratchpad/nextjs-verify/c6.mjs):
 *   - useReducer inc→add5→inc từ 0 = 7
 *   - useMemo: computes=2 (mount 1 + 2 render vô can 0 + 1 đổi dep 1)
 *   - useRef: sửa .current 3 lần, render vẫn = 1 (không re-render)
 */

import G06_1 from './giang/nxj-06-1.mjs';
import G06_2 from './giang/nxj-06-2.mjs';
import G06_3 from './giang/nxj-06-3.mjs';
import G06_4 from './giang/nxj-06-4.mjs';
import G06_5 from './giang/nxj-06-5.mjs';
export default {
  title: 'Chapter 6 — The hooks toolbox|||Chương 6 — Bộ đồ nghề hooks',
  description: 'useRef giữ giá trị không render; useMemo/useCallback bỏ qua việc tính lại và ổn định tham chiếu; useReducer gói chuyển trạng thái thành dữ liệu; useContext bỏ prop drilling; và hook tự viết gói lại logic.',
  lessons: [
    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — useRef: a value that survives renders|||6.1 — useRef: giá trị sống qua các render',
      slug: 'nextjs-6-1-useref',
      type: 'VIDEO',
      isFreePreview: false,
      // Video: "10 React Hooks Explained // Plus Build your own from Scratch" (Fireship).
      video: { url: 'https://youtu.be/TNhaISOUy6Q', durationSeconds: 0 },
      description: 'Ref là một cái hộp .current đọc/ghi được mà KHÔNG gây render — để nhớ giá trị qua các render, và để với tới nút DOM.',
      content: `
${G06_1}
<div class="ml-en">
<div class="callout ok"><strong>Already took the React course?</strong> This chapter is a quick React refresher &mdash; the same topic is taught in depth in the <a href="/courses/react">React</a> course (Chapter 4 for custom hooks, Chapter 5 for context and useReducer, Chapter 11 for useRef). Skim it or skip ahead to <strong>Chapter 8</strong>, where the Next.js-specific material starts. Remember: Next.js is a <em>framework built on React</em> &mdash; every component, prop, state and hook here is still plain React.</div>
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>A box you can write to without re-rendering</h2>
<p class="lead">Chapter 4 met <code>useRef</code> for reading a form input. Its full job is broader: a ref is a mutable box whose <code>.current</code> you can read and write at any time, and — crucially — <strong>changing it does not trigger a re-render.</strong> That single property is what makes it different from state, and what it's for.</p>

<h3>Ref vs state, in one experiment</h3>
<p>Here is the defining difference, captured from a real render: a component that mutates a ref three times re-renders <strong>zero</strong> extra times.</p>
<pre><code class="language-typescript">function RefDemo() {
  const c = useRef(0);
  const bump = () =&gt; { c.current++; };   <span class="tok-comment">// mutate the ref — no re-render</span>
  return &lt;div&gt;rendered&lt;/div&gt;;
}
<span class="tok-comment">// mount, then call bump() three times:</span></code></pre>
<div class="out">renders after 3 ref bumps (should stay 1): 1</div>
<p>The component rendered once and stayed there, even though <code>c.current</code> is now 3. If <code>c</code> had been state, each <code>bump</code> would have re-rendered. That is the whole rule:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Use state</span><span class="v">when a change must update the screen. The value is shown, and React must re-render to show the new one.</span></div>
  <div class="kv"><span class="k">Use a ref</span><span class="v">when a change must be remembered but NOT shown — a timer id, the previous value of something, a scroll position, a WebSocket instance.</span></div>
</div>

<h3>The two real jobs of useRef</h3>
<p><strong>1 · Remember a value across renders, invisibly.</strong> Unlike a local variable (reset every render) and unlike state (re-renders on change), a ref persists <em>and</em> stays quiet:</p>
<pre><code class="language-typescript">const intervalId = useRef&lt;number | null&gt;(null);
useEffect(() =&gt; {
  intervalId.current = window.setInterval(tick, 1000);
  return () =&gt; { if (intervalId.current !== null) clearInterval(intervalId.current); };
}, []);</code></pre>
<p><strong>2 · Reach a DOM node.</strong> Attach a ref to an element with the <code>ref</code> prop, and React fills <code>.current</code> with the real DOM node after commit — so you can focus, scroll, measure or play it:</p>
<pre><code class="language-typescript">const inputRef = useRef&lt;HTMLInputElement&gt;(null);
useEffect(() =&gt; { inputRef.current?.focus(); }, []);   <span class="tok-comment">// focus on mount</span>
return &lt;input ref={inputRef} /&gt;;</code></pre>

<div class="pitfall">
<p><strong>Don't read or write a ref during render.</strong> A ref is for effects and event handlers — code that runs <em>after</em> render. Reading <code>ref.current</code> during render (to decide what to show) or writing it during render makes your component impure and its output unpredictable, because React doesn't track ref changes. If a value decides what renders, it must be state, not a ref. Rule of thumb: <em>touch refs in handlers and effects, never in the render body.</em></p>
</div>

<h3>What a ref is, and what it is not</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>A box that survives renders</b> — <code>useRef(0)</code> returns the same object every render. Writing <code>ref.current = 5</code> changes the box; it does not tell React anything.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Changing it does not re-render</b> — That is the whole point. Use it for a value the UI does not display: a timer id, a previous value, a &quot;have I already run this&quot; flag.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Attach it to a DOM node with the ref prop</b> — <code>&lt;input ref={inputRef} /&gt;</code>. React fills <code>current</code> after the commit, so it is <code>null</code> during the first render.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Read it in an event handler or an effect</b> — Never during render. Reading a ref while rendering makes the output depend on something React cannot track.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — putting a displayed value in a ref, so the screen never updates.</strong> <code>countRef.current++</code> increments correctly and the number on screen never changes, because nothing asked React to render again. The value in DevTools is right, the DOM is stale, and it looks like a rendering bug rather than a choice you made. The rule is mechanical: if a value appears in the JSX, it is state. If it only exists to survive between renders without being shown, it is a ref. When you need both — a value shown <em>and</em> read by a timer — keep it in state and mirror it into a ref inside an effect.</p></div>
<a class="link-card dl" href="https://react.dev/learn/referencing-values-with-refs" target="_blank" rel="noopener">
  <span class="lc-ico">📌</span>
  <span class="lc-body"><span class="lc-title">react.dev — Referencing values with refs</span><span class="lc-sub">When a ref is right, and the rules about reading during render.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/manipulating-the-dom-with-refs" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">react.dev — Manipulating the DOM with refs</span><span class="lc-sub">Focus, scroll and measurement — the legitimate reasons to reach for the DOM.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Use a ref to focus an input on mount (<code>inputRef.current?.focus()</code> in an effect).</li>
<li>Store a mutable value in a ref (a previous value or an interval id) and confirm updating it does not re-render.</li>
<li>Contrast a ref with state in one line: changing a ref does not re-render; changing state does.</li>
</ol>
<p><strong>Done when:</strong> you can use a ref for a DOM node and for a non-rendering mutable value.</p></div>

<h3>🔬 Measured: refs on a real page (React 19.3.0 · Next.js 16.4.6)</h3>
<p>One page, four experiments: a ref next to a state, a DOM ref, a timer id kept in a plain variable versus a ref, and a value mirrored from state into a ref. The module-level counters exist only so Chromium can read the numbers:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useRef, useState } from 'react';

const dem = { hop: 0 };                              <span class="tok-comment">  // đếm render (đo dưới next start)</span>
const so = { cungHop: 0, khacHop: 0, lucRender: '', trongEffect: '', cu: -1, guong: -1 };
let hopDau: object | null = null;

<span class="tok-comment">// 1 — ref vs state: đổi ref KHÔNG render lại</span>
function HopRef() {
  dem.hop++;
  const c = useRef(0);
  const [n, setN] = useState(0);
  useEffect(() =&gt; {                                  <span class="tok-comment">  // mỗi lần render: có phải CÙNG cái hộp?</span>
    if (hopDau === null) hopDau = c;
    if (hopDau === c) so.cungHop++; else so.khacHop++;
    Object.assign(window, { __c: c });
  });
  return (
    &lt;p&gt;
      &lt;button id="ref-tang" onClick={() =&gt; { c.current++; }} className="rounded border px-2"&gt;ref +1&lt;/button&gt;{' '}
      &lt;button id="state-tang" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;state +1&lt;/button&gt;{' '}
      ref trên màn hình: &lt;b id="hien-ref"&gt;{c.current}&lt;/b&gt; · state: &lt;b id="hien-state"&gt;{n}&lt;/b&gt;
    &lt;/p&gt;
  );
}

<span class="tok-comment">// 2 — ref tới nút DOM: null lúc render, có nút sau commit</span>
function OFocus() {
  const inputRef = useRef&lt;HTMLInputElement&gt;(null);
  if (!so.lucRender) so.lucRender = String(inputRef.current);     <span class="tok-comment">  // đo: lúc render đầu</span>
  useEffect(() =&gt; {
    so.trongEffect = inputRef.current?.tagName ?? 'null';
    inputRef.current?.focus();                                     <span class="tok-comment">  // focus lúc mount</span>
  }, []);
  return &lt;input id="o-ten" ref={inputRef} placeholder="tên" className="rounded border px-1" /&gt;;
}

<span class="tok-comment">// 3 — giữ id bộ hẹn giờ: biến thường vs ref</span>
function DongHo({ kieu }: { kieu: 'bien' | 'ref' }) {
  const [s, setS] = useState(0);
  const refId = useRef(0);
  let bienId = 0;                                                  <span class="tok-comment">  // ✗ về 0 ở mỗi render</span>
  const batDau = () =&gt; {
    const id = window.setInterval(() =&gt; setS((x) =&gt; x + 1), 100);
    if (kieu === 'ref') refId.current = id; else bienId = id;
  };
  const dung = () =&gt; clearInterval(kieu === 'ref' ? refId.current : bienId);
  return (
    &lt;p&gt;{kieu === 'ref' ? 'useRef' : 'biến thường'}: &lt;b id={&#96;s-\${kieu}&#96;}&gt;{s}&lt;/b&gt;{' '}
      &lt;button id={&#96;bd-\${kieu}&#96;} onClick={batDau} className="rounded border px-2"&gt;bắt đầu&lt;/button&gt;{' '}
      &lt;button id={&#96;dg-\${kieu}&#96;} onClick={dung} className="rounded border px-2"&gt;dừng&lt;/button&gt;&lt;/p&gt;
  );
}

<span class="tok-comment">// 4 — cần cả hai: hiện bằng state, bộ hẹn giờ đọc qua ref</span>
function Guong() {
  const [n, setN] = useState(0);
  const nRef = useRef(n);
  useEffect(() =&gt; { nRef.current = n; }, [n]);                     <span class="tok-comment">  // soi gương state → ref</span>
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; { so.cu = n; so.guong = nRef.current; }, 200);
    return () =&gt; clearInterval(id);
  }, []);                                                          <span class="tok-comment">  // n ở đây: ảnh chụp lúc mount</span>
  return &lt;p&gt;&lt;button id="guong" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;n = {n}&lt;/button&gt;&lt;/p&gt;;
}

if (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __so: so }); <span class="tok-comment">  // để đo</span>

export default function HopRefTrang() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;HopRef /&gt;
      &lt;OFocus /&gt;
      &lt;DongHo kieu="bien" /&gt;
      &lt;DongHo kieu="ref" /&gt;
      &lt;Guong /&gt;
    &lt;/div&gt;
  );
}</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// tóm tắt ESLint mỗi lỗi một dòng: dòng:cột mức luật — thông điệp</span>
const j = JSON.parse(require('fs').readFileSync(0, 'utf8'));
for (const m of j[0].messages)
  console.log(&#96;\${m.line}:\${m.column} \${m.severity === 2 ? 'error' : 'warn '} \${m.ruleId} — \${m.message.split('\\n')[0]}&#96;);</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|hop-ref'
✓ Compiled successfully in 213ms
├ ○ /hop-ref
$ npx eslint -f json src/app/hop-ref/page.tsx | node tom-eslint.cjs
10:3 error react-hooks/immutability — Error: This value cannot be modified
22:44 error react-hooks/refs — Error: Cannot access refs during render
30:22 error react-hooks/immutability — Error: This value cannot be modified
30:44 error react-hooks/refs — Error: Cannot access refs during render
45:50 error react-hooks/immutability — Error: Cannot reassign variable after render completes
50:42 error react-hooks/immutability — Error: Cannot modify local variables after render completes
63:6 warn  react-hooks/exhaustive-deps — React Hook useEffect has a missing dependency: 'n'. Either include it or remove the dependency array.</div>
<p>Built and started, then driven by Chromium (clicks, 1 s waits):</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /hop-ref → %{http_code}\\n' localhost:3001/hop-ref
next start GET /hop-ref → 200
$ curl -s -o /dev/null -w 'next dev   GET /hop-ref → %{http_code}\\n' localhost:3000/hop-ref
next dev   GET /hop-ref → 200

next start · Chromium                renders  c.current  on screen
after load                           1        0          0
3 × "ref +1"                         1        3          0
then 1 × "state +1"                  2        3          3

same box on every render             : 2/2
inputRef.current during first render : null
inputRef.current inside the effect   : INPUT (focused: #o-ten)
timer id — Stop, then 1 s later      : plain variable 10 → 20 · useRef 10 → 10
after 5 clicks: screen · n · nRef    : "n = 5" · 0 · 5</div>
<p>Three ref writes: still <b>one</b> render and the screen still says <b>0</b> — the 3 shows up only when the state click re-renders. The timer id in a plain variable is reset by the render of every tick, so Stop clears nothing (10 → 20); the ref keeps it (10 → 10). The ESLint rule <code>react-hooks/refs</code> flags both reads of <code>.current</code> during render and <code>react-hooks/immutability</code> flags the plain variable changed after render — while <code>next build</code> stays green, because Next 16 no longer lints during build.</p>
<h4>The plain snippets, type-checked in this .tsx project</h4>
<pre><code class="language-tsx">'use client';
import { useEffect, useRef } from 'react';
function tick() {}

export default function RefWeb() {
  const intervalId = useRef&lt;number | null&gt;(null);    <span class="tok-comment">  // ✓ khai kiểu</span>
  useEffect(() =&gt; {
    intervalId.current = window.setInterval(tick, 1000);
    return () =&gt; { if (intervalId.current !== null) clearInterval(intervalId.current); };
  }, []);
  const inputRef = useRef&lt;HTMLInputElement&gt;(null);   <span class="tok-comment">  // ✓ kiểu của nút DOM</span>
  useEffect(() =&gt; { inputRef.current?.focus(); }, []);
  return &lt;input ref={inputRef} /&gt;;
}</code></pre><div class="out">$ npx tsc --noEmit 2&gt;&amp;1 | grep -E 'error TS' | sed 's/^src.app.ref-web.//'
page.tsx(8,5): error TS2322: Type 'Timeout' is not assignable to type 'null'.
page.tsx(9,32): error TS2769: No overload matches this call.
page.tsx(12,21): error TS18047: 'inputRef.current' is possibly 'null'.
page.tsx(13,22): error TS2554: Expected 1 arguments, but got 0.
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi</div>
<p><code>useRef(null)</code> infers the type <code>null</code>, so nothing else fits; React 19 types also reject <code>useRef()</code> with no argument. That is why the snippets above now give each ref its type and call <code>focus()</code> through <code>?.</code>.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># open localhost:3001/hop-ref, then in the DevTools console:</span>
<span class="tok-comment">#   __dem.hop, __c.current, JSON.stringify(__so)</span>
npx eslint src/app/hop-ref/page.tsx</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-3-strict-mode-ref" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.3 — StrictMode, useRef, useLayoutEffect</span><span class="lc-sub">useRef in depth: refs and Strict Mode, measuring before paint</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — Controlled and uncontrolled inputs</span><span class="lc-sub">A ref reading an uncontrolled input</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-3-slot9-hooks-slides" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.3 — Hooks (Slot 9–10)</span><span class="lc-sub">Slides on the built-in hooks, including useRef</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useRef</span><span class="v">A box whose <code>.current</code> survives renders and does not trigger them.</span></div>
  <div class="kv"><span class="k">DOM ref</span><span class="v"><code>ref={node}</code> to reach a real element (focus, measure, scroll).</span></div>
  <div class="kv"><span class="k">Mutable value</span><span class="v">A ref holds values you change without re-rendering.</span></div>
  <div class="kv"><span class="k">ref vs state</span><span class="v">Changing state re-renders; changing a ref does not.</span></div>
  <div class="kv"><span class="k">.current</span><span class="v">Where a ref stores its value.</span></div>
  <div class="kv"><span class="k">Not for rendering</span><span class="v">Never read a ref during render to produce UI — use state.</span></div>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react.dev/reference/react/useRef" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — useRef</span><span class="lc-sub">Referencing values, manipulating the DOM, and the "don't touch during render" rule.</span></span>
</a>
</div>

<div class="ml-vi">
<div class="callout ok"><strong>Đã học khoá React?</strong> Chương này là phần ôn nhanh React &mdash; cùng chủ đề được dạy kỹ ở khoá <a href="/courses/react">React</a> (Chương 4 phần hook tự viết, Chương 5 phần context và useReducer, Chương 11 phần useRef). Đọc lướt hoặc chuyển thẳng sang <strong>Chương 8</strong>, nơi bắt đầu phần riêng của Next.js. Nhớ: Next.js là <em>framework dựng trên React</em> &mdash; mọi component, props, state, hook ở đây vẫn là React thuần.</div>
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Một cái hộp bạn ghi vào được mà không render lại</h2>
<p class="lead">Chương 4 đã gặp <code>useRef</code> để đọc một input form. Nhiệm vụ đầy đủ của nó rộng hơn: một ref là một cái hộp thay đổi được mà <code>.current</code> của nó bạn đọc và ghi bất cứ lúc nào, và — quan trọng — <strong>đổi nó không kích hoạt render.</strong> Chính đặc tính đó khiến nó khác state, và là lý do nó tồn tại.</p>

<h3>Ref vs state, trong một thí nghiệm</h3>
<p>Đây là khác biệt định nghĩa, ghi từ một render thật: một component sửa một ref ba lần render lại <strong>không</strong> thêm lần nào.</p>
<pre><code class="language-typescript">function RefDemo() {
  const c = useRef(0);
  const bump = () =&gt; { c.current++; };   <span class="tok-comment">// sửa ref — không render lại</span>
  return &lt;div&gt;rendered&lt;/div&gt;;
}
<span class="tok-comment">// mount, rồi gọi bump() ba lần:</span></code></pre>
<div class="out">renders after 3 ref bumps (should stay 1): 1</div>
<p>Component render một lần và ở yên đó, dù <code>c.current</code> giờ là 3. Nếu <code>c</code> là state, mỗi <code>bump</code> đã render lại. Đó là toàn bộ quy tắc:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng state</span><span class="v">khi một thay đổi phải cập nhật màn hình. Giá trị được hiển thị, và React phải render lại để hiện cái mới.</span></div>
  <div class="kv"><span class="k">Dùng ref</span><span class="v">khi một thay đổi phải được NHỚ nhưng KHÔNG hiển thị — một id timer, giá trị trước của thứ gì đó, vị trí cuộn, một instance WebSocket.</span></div>
</div>

<h3>Hai việc thật của useRef</h3>
<p><strong>1 · Nhớ một giá trị qua các render, một cách vô hình.</strong> Khác biến cục bộ (reset mỗi render) và khác state (render lại khi đổi), một ref bền <em>và</em> im lặng:</p>
<pre><code class="language-typescript">const intervalId = useRef&lt;number | null&gt;(null);
useEffect(() =&gt; {
  intervalId.current = window.setInterval(tick, 1000);
  return () =&gt; { if (intervalId.current !== null) clearInterval(intervalId.current); };
}, []);</code></pre>
<p><strong>2 · Với tới một nút DOM.</strong> Gắn một ref vào một element bằng prop <code>ref</code>, và React điền <code>.current</code> bằng nút DOM thật sau khi commit — để bạn focus, cuộn, đo hay phát nó:</p>
<pre><code class="language-typescript">const inputRef = useRef&lt;HTMLInputElement&gt;(null);
useEffect(() =&gt; { inputRef.current?.focus(); }, []);   <span class="tok-comment">// focus lúc mount</span>
return &lt;input ref={inputRef} /&gt;;</code></pre>

<div class="pitfall">
<p><strong>Đừng đọc hay ghi một ref trong lúc render.</strong> Ref là để cho effect và handler sự kiện — code chạy <em>sau</em> render. Đọc <code>ref.current</code> trong lúc render (để quyết hiện gì) hay ghi nó trong lúc render làm component không thuần và output khó lường, vì React không theo dõi thay đổi ref. Nếu một giá trị quyết cái được render, nó phải là state, không phải ref. Nguyên tắc: <em>chạm ref trong handler và effect, không bao giờ trong thân render.</em></p>
</div>

<h3>Một ref là gì, và nó không phải là gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Một cái hộp sống qua các lần render</b> — <code>useRef(0)</code> trả về cùng một object ở mọi lần render. Ghi <code>ref.current = 5</code> là đổi cái hộp; nó chẳng nói gì với React cả.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Đổi nó thì KHÔNG render lại</b> — Đó chính là toàn bộ mục đích. Hãy dùng nó cho một giá trị giao diện không hiển thị: một id bộ đếm giờ, một giá trị trước đó, một cờ &quot;tôi đã chạy cái này chưa&quot;.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Gắn nó vào một nút DOM bằng prop ref</b> — <code>&lt;input ref={inputRef} /&gt;</code>. React điền vào <code>current</code> sau khi commit, nên nó là <code>null</code> trong lần render đầu.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Đọc nó trong handler sự kiện hoặc trong effect</b> — Đừng bao giờ đọc trong lúc render. Đọc một ref lúc đang render làm đầu ra phụ thuộc vào thứ React không theo dõi được.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — đặt một giá trị được hiển thị vào một ref, và màn hình chẳng bao giờ cập nhật.</strong> <code>countRef.current++</code> tăng đúng và con số trên màn hình chẳng bao giờ đổi, vì chẳng có gì bảo React render lại. Giá trị trong DevTools thì đúng, DOM thì cũ, và nó trông như một lỗi vẽ chứ không phải một lựa chọn bạn đã làm. Luật thì máy móc: nếu một giá trị xuất hiện trong JSX thì nó là state. Nếu nó chỉ tồn tại để sống qua các lần render mà không được hiển thị thì nó là ref. Khi bạn cần cả hai — một giá trị vừa hiện ra <em>vừa</em> được một bộ đếm giờ đọc — hãy giữ nó trong state rồi soi gương nó vào một ref bên trong một effect.</p></div>
<a class="link-card dl" href="https://react.dev/learn/referencing-values-with-refs" target="_blank" rel="noopener">
  <span class="lc-ico">📌</span>
  <span class="lc-body"><span class="lc-title">react.dev — Tham chiếu giá trị bằng ref</span><span class="lc-sub">Khi nào ref là đúng, và các luật về việc đọc trong lúc render.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/manipulating-the-dom-with-refs" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">react.dev — Thao tác DOM bằng ref</span><span class="lc-sub">Tiêu điểm, cuộn và đo kích thước — những lý do chính đáng để với tay vào DOM.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dùng một ref để focus một input khi mount (<code>inputRef.current?.focus()</code> trong một effect).</li>
<li>Lưu một giá trị thay đổi được vào ref (giá trị trước đó hoặc id của interval) và xác nhận cập nhật nó không render lại.</li>
<li>So sánh ref với state một dòng: đổi ref không render lại; đổi state thì có.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dùng được ref cho node DOM và cho một giá trị thay đổi mà không render.</p></div>

<h3>🔬 Đo thật: ref trên một trang thật (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Một trang, bốn thí nghiệm: một ref cạnh một state, một ref tới DOM, id bộ hẹn giờ giữ trong biến thường so với ref, và một giá trị soi gương từ state sang ref. Các bộ đếm cấp mô-đun chỉ để Chromium đọc số:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useRef, useState } from 'react';

const dem = { hop: 0 };                              <span class="tok-comment">  // đếm render (đo dưới next start)</span>
const so = { cungHop: 0, khacHop: 0, lucRender: '', trongEffect: '', cu: -1, guong: -1 };
let hopDau: object | null = null;

<span class="tok-comment">// 1 — ref vs state: đổi ref KHÔNG render lại</span>
function HopRef() {
  dem.hop++;
  const c = useRef(0);
  const [n, setN] = useState(0);
  useEffect(() =&gt; {                                  <span class="tok-comment">  // mỗi lần render: có phải CÙNG cái hộp?</span>
    if (hopDau === null) hopDau = c;
    if (hopDau === c) so.cungHop++; else so.khacHop++;
    Object.assign(window, { __c: c });
  });
  return (
    &lt;p&gt;
      &lt;button id="ref-tang" onClick={() =&gt; { c.current++; }} className="rounded border px-2"&gt;ref +1&lt;/button&gt;{' '}
      &lt;button id="state-tang" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;state +1&lt;/button&gt;{' '}
      ref trên màn hình: &lt;b id="hien-ref"&gt;{c.current}&lt;/b&gt; · state: &lt;b id="hien-state"&gt;{n}&lt;/b&gt;
    &lt;/p&gt;
  );
}

<span class="tok-comment">// 2 — ref tới nút DOM: null lúc render, có nút sau commit</span>
function OFocus() {
  const inputRef = useRef&lt;HTMLInputElement&gt;(null);
  if (!so.lucRender) so.lucRender = String(inputRef.current);     <span class="tok-comment">  // đo: lúc render đầu</span>
  useEffect(() =&gt; {
    so.trongEffect = inputRef.current?.tagName ?? 'null';
    inputRef.current?.focus();                                     <span class="tok-comment">  // focus lúc mount</span>
  }, []);
  return &lt;input id="o-ten" ref={inputRef} placeholder="tên" className="rounded border px-1" /&gt;;
}

<span class="tok-comment">// 3 — giữ id bộ hẹn giờ: biến thường vs ref</span>
function DongHo({ kieu }: { kieu: 'bien' | 'ref' }) {
  const [s, setS] = useState(0);
  const refId = useRef(0);
  let bienId = 0;                                                  <span class="tok-comment">  // ✗ về 0 ở mỗi render</span>
  const batDau = () =&gt; {
    const id = window.setInterval(() =&gt; setS((x) =&gt; x + 1), 100);
    if (kieu === 'ref') refId.current = id; else bienId = id;
  };
  const dung = () =&gt; clearInterval(kieu === 'ref' ? refId.current : bienId);
  return (
    &lt;p&gt;{kieu === 'ref' ? 'useRef' : 'biến thường'}: &lt;b id={&#96;s-\${kieu}&#96;}&gt;{s}&lt;/b&gt;{' '}
      &lt;button id={&#96;bd-\${kieu}&#96;} onClick={batDau} className="rounded border px-2"&gt;bắt đầu&lt;/button&gt;{' '}
      &lt;button id={&#96;dg-\${kieu}&#96;} onClick={dung} className="rounded border px-2"&gt;dừng&lt;/button&gt;&lt;/p&gt;
  );
}

<span class="tok-comment">// 4 — cần cả hai: hiện bằng state, bộ hẹn giờ đọc qua ref</span>
function Guong() {
  const [n, setN] = useState(0);
  const nRef = useRef(n);
  useEffect(() =&gt; { nRef.current = n; }, [n]);                     <span class="tok-comment">  // soi gương state → ref</span>
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; { so.cu = n; so.guong = nRef.current; }, 200);
    return () =&gt; clearInterval(id);
  }, []);                                                          <span class="tok-comment">  // n ở đây: ảnh chụp lúc mount</span>
  return &lt;p&gt;&lt;button id="guong" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;n = {n}&lt;/button&gt;&lt;/p&gt;;
}

if (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __so: so }); <span class="tok-comment">  // để đo</span>

export default function HopRefTrang() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;HopRef /&gt;
      &lt;OFocus /&gt;
      &lt;DongHo kieu="bien" /&gt;
      &lt;DongHo kieu="ref" /&gt;
      &lt;Guong /&gt;
    &lt;/div&gt;
  );
}</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// tóm tắt ESLint mỗi lỗi một dòng: dòng:cột mức luật — thông điệp</span>
const j = JSON.parse(require('fs').readFileSync(0, 'utf8'));
for (const m of j[0].messages)
  console.log(&#96;\${m.line}:\${m.column} \${m.severity === 2 ? 'error' : 'warn '} \${m.ruleId} — \${m.message.split('\\n')[0]}&#96;);</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|hop-ref'
✓ Compiled successfully in 213ms
├ ○ /hop-ref
$ npx eslint -f json src/app/hop-ref/page.tsx | node tom-eslint.cjs
10:3 error react-hooks/immutability — Error: This value cannot be modified
22:44 error react-hooks/refs — Error: Cannot access refs during render
30:22 error react-hooks/immutability — Error: This value cannot be modified
30:44 error react-hooks/refs — Error: Cannot access refs during render
45:50 error react-hooks/immutability — Error: Cannot reassign variable after render completes
50:42 error react-hooks/immutability — Error: Cannot modify local variables after render completes
63:6 warn  react-hooks/exhaustive-deps — React Hook useEffect has a missing dependency: 'n'. Either include it or remove the dependency array.</div>
<p>Build rồi start, sau đó Chromium bấm và chờ từng giây:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /hop-ref → %{http_code}\\n' localhost:3001/hop-ref
next start GET /hop-ref → 200
$ curl -s -o /dev/null -w 'next dev   GET /hop-ref → %{http_code}\\n' localhost:3000/hop-ref
next dev   GET /hop-ref → 200

next start · Chromium                render   c.current  màn hình
vừa tải                              1        0          0
3 × "ref +1"                         1        3          0
rồi 1 × "state +1"                   2        3          3

cùng một hộp ở mọi render            : 2/2
inputRef.current lúc render đầu      : null
inputRef.current trong effect        : INPUT (đang focus: #o-ten)
id hẹn giờ — Dừng, rồi 1 s sau       : biến thường 10 → 20 · useRef 10 → 10
sau 5 cú bấm: màn hình · n · nRef    : "n = 5" · 0 · 5</div>
<p>Ba lần ghi ref: vẫn <b>một</b> lần render và màn hình vẫn là <b>0</b> — số 3 chỉ hiện khi cú bấm state làm render lại. Id hẹn giờ trong biến thường bị mỗi lần render của nhịp đồng hồ đặt lại, nên Dừng chẳng dừng gì (10 → 20); ref giữ được nó (10 → 10). ESLint <code>react-hooks/refs</code> bắt hai chỗ đọc <code>.current</code> lúc render, <code>react-hooks/immutability</code> bắt biến thường bị sửa sau render — còn <code>next build</code> vẫn xanh, vì Next 16 không còn lint lúc build.</p>
<h4>Các đoạn mã trơn, kiểm kiểu trong dự án .tsx này</h4>
<pre><code class="language-tsx">'use client';
import { useEffect, useRef } from 'react';
function tick() {}

export default function RefWeb() {
  const intervalId = useRef&lt;number | null&gt;(null);    <span class="tok-comment">  // ✓ khai kiểu</span>
  useEffect(() =&gt; {
    intervalId.current = window.setInterval(tick, 1000);
    return () =&gt; { if (intervalId.current !== null) clearInterval(intervalId.current); };
  }, []);
  const inputRef = useRef&lt;HTMLInputElement&gt;(null);   <span class="tok-comment">  // ✓ kiểu của nút DOM</span>
  useEffect(() =&gt; { inputRef.current?.focus(); }, []);
  return &lt;input ref={inputRef} /&gt;;
}</code></pre><div class="out">$ npx tsc --noEmit 2&gt;&amp;1 | grep -E 'error TS' | sed 's/^src.app.ref-web.//'
page.tsx(8,5): error TS2322: Type 'Timeout' is not assignable to type 'null'.
page.tsx(9,32): error TS2769: No overload matches this call.
page.tsx(12,21): error TS18047: 'inputRef.current' is possibly 'null'.
page.tsx(13,22): error TS2554: Expected 1 arguments, but got 0.
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi</div>
<p><code>useRef(null)</code> suy ra kiểu <code>null</code>, nên không gán được gì khác; kiểu của React 19 còn từ chối <code>useRef()</code> không đối số. Vì thế các đoạn mã ở trên đã khai kiểu cho từng ref và gọi <code>focus()</code> qua <code>?.</code>.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># mở localhost:3001/hop-ref, rồi ở console DevTools:</span>
<span class="tok-comment">#   __dem.hop, __c.current, JSON.stringify(__so)</span>
npx eslint src/app/hop-ref/page.tsx</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-3-strict-mode-ref" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.3 — StrictMode, useRef, useLayoutEffect</span><span class="lc-sub">useRef sâu hơn: ref và Strict Mode, đo trước khi vẽ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — Input kiểm soát và không kiểm soát</span><span class="lc-sub">Ref đọc ô nhập không kiểm soát</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-3-slot9-hooks-slides" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.3 — Hooks (Slot 9–10)</span><span class="lc-sub">Slide các hook dựng sẵn, có useRef</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useRef</span><span class="v">Một hộp có <code>.current</code> sống qua các lần render và không kích hoạt render.</span></div>
  <div class="kv"><span class="k">Ref tới DOM</span><span class="v"><code>ref={node}</code> để chạm một element thật (focus, đo, cuộn).</span></div>
  <div class="kv"><span class="k">Giá trị thay đổi</span><span class="v">Một ref giữ giá trị bạn đổi mà không render lại.</span></div>
  <div class="kv"><span class="k">ref vs state</span><span class="v">Đổi state thì render lại; đổi ref thì không.</span></div>
  <div class="kv"><span class="k">.current</span><span class="v">Nơi một ref lưu giá trị của nó.</span></div>
  <div class="kv"><span class="k">Không để render</span><span class="v">Đừng đọc ref lúc render để tạo UI — hãy dùng state.</span></div>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react.dev/reference/react/useRef" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — useRef</span><span class="lc-sub">Tham chiếu giá trị, thao tác DOM, và quy tắc "đừng chạm lúc render".</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — useMemo & useCallback|||6.2 — useMemo & useCallback',
      slug: 'nextjs-6-2-usememo-usecallback',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'useMemo ghi nhớ kết quả một phép tính đắt; useCallback ghi nhớ một hàm. Cả hai bỏ qua việc làm lại khi phụ thuộc không đổi — nhưng đừng lạm dụng.',
      content: `
${G06_2}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Skipping work, and stabilising references</h2>
<p class="lead"><code>useMemo</code> and <code>useCallback</code> are the same idea applied to two things: remember a result across renders and only recompute it when the inputs change. <code>useMemo</code> remembers a <em>value</em>; <code>useCallback</code> remembers a <em>function</em>. Both are optimisations — reach for them when you have a reason, not by reflex.</p>

<h3>useMemo — recompute only when dependencies change</h3>
<pre><code class="language-javascript">const value = useMemo(() =&gt; expensiveCompute(dep), [dep]);</code></pre>
<p>React runs the function on the first render and caches the result. On later renders it re-runs the function <em>only if</em> a dependency changed (same <code>Object.is</code> comparison as effects); otherwise it returns the cached value. Captured from a real render — a memo depending on <code>dep</code>, across a mount, two unrelated re-renders, and one <code>dep</code> change:</p>
<div class="out">useMemo computes (mount + 2 unrelated renders + 1 dep change): 2</div>
<p>Read that: the expensive function ran <strong>twice</strong>, not four times. Once on mount, <em>zero</em> times during the two re-renders where <code>dep</code> was unchanged (an unrelated piece of state changed), and once when <code>dep</code> actually changed. Without <code>useMemo</code> it would have run on all four renders. That is the win — but only worth it when the computation is genuinely expensive.</p>

<h3>useCallback — the same, for a function</h3>
<pre><code class="language-javascript">const handleSearch = useCallback((q) =&gt; { doSearch(q, filter); }, [filter]);</code></pre>
<p><code>useCallback(fn, deps)</code> is exactly <code>useMemo(() =&gt; fn, deps)</code> — it returns the <em>same function reference</em> across renders until a dependency changes. Why would you care about a function's reference? Two reasons: (1) it is a dependency of an effect or another memo (a new function every render would re-trigger them — the Chapter 5 pitfall), or (2) you pass it to a child wrapped in <code>React.memo</code> (Chapter 7), which skips re-rendering only if its props are referentially equal.</p>

<h3>When NOT to use them — which is most of the time</h3>
<p>These hooks are not free: they cost memory and a dependency comparison every render, and they clutter code. Adding them everywhere makes an app <em>slower and harder to read</em>. Use them only when:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">useMemo — yes</span><span class="v">the computation is measurably expensive (sorting/filtering thousands of items, a heavy transform), or the result is a dependency that must stay stable.</span></div>
  <div class="kv"><span class="k">useCallback — yes</span><span class="v">the function is a dependency of an effect/memo, or a prop to a memoised child.</span></div>
  <div class="kv"><span class="k">Both — no</span><span class="v">for a cheap calculation, a value only used to render text, or a handler passed to a plain DOM element. The wrapper costs more than it saves.</span></div>
</div>
<p>The honest default: write it plainly first. Reach for memoisation when a profiler (Chapter 7) shows a real re-render or compute cost, not because a value <em>looks</em> expensive.</p>

<div class="callout warn">
<p><strong>React Compiler changes the calculus.</strong> It is no longer a promise: <code>babel-plugin-react-compiler</code> 1.0 is on npm, Next.js 16 turns it on with <code>reactCompiler: true</code>, and <code>create-next-app</code> asks "Would you like to use React Compiler?" (this course answered No). It inserts this memoisation for you at build time — measured below on a copy of the lab — so manual <code>useMemo</code>/<code>useCallback</code> matter less and less. Learn what they do — you'll read them in existing code and still need them at boundaries — but don't pepper new code with them "to be safe". Correct, readable code first.</p>
</div>
<h3>Memoisation: what it buys and what it costs</h3>
<div class="lz-map">
  <div class="lz-stage">Measure first, memoise second</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">useMemo caches a value</div><div class="lz-nsub"><code>useMemo(() =&gt; expensiveSort(items), [items])</code>. Skips the computation when the dependencies are unchanged.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">useCallback caches a function</div><div class="lz-nsub">Same thing for a function identity, so a memoised child does not re-render because its handler is new.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">They are not free</div><div class="lz-nsub">Each one stores a value, compares dependencies on every render, and adds a line for the next reader to understand.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">They only help in three cases</div><div class="lz-nsub">An expensive computation; a dependency of an effect; a prop passed to a <code>memo</code>-wrapped child. Outside those, they cost more than they save.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — wrapping a handler in <code>useCallback</code> and passing it to a child that is not memoised.</strong> <code>const onSelect = useCallback(…, [])</code> keeps the function identity stable, which achieves nothing if the child is an ordinary component: it re-renders when its parent does, regardless of whether its props changed. So you have paid for the memoisation and bought nothing. The pair only works together — <code>useCallback</code> on the parent <em>and</em> <code>React.memo</code> on the child — and even then only if every other prop is stable too, which one inline object literal is enough to break. Profile before adding either; the React DevTools profiler shows you which components actually re-render and how long they take.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Should you add useMemo everywhere?</span><span class="lc-sub">The official answer, with the three cases where it genuinely helps.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/react-developer-tools" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">react.dev — React Developer Tools</span><span class="lc-sub">The profiler: which components re-rendered, why, and how long each took.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add a deliberately expensive calculation during render, then wrap it in <code>useMemo</code> with the right deps and confirm it only recomputes when they change.</li>
<li>Wrap a callback passed to a memoized child in <code>useCallback</code> and show the child stops re-rendering needlessly.</li>
<li>Remove a dependency from the memo and observe the stale result — then put it back.</li>
</ol>
<p><strong>Done when:</strong> you can memoize a value and a callback and set their dependencies correctly.</p></div>

<h3>🔬 Measured: one page, counted in Chromium (React 19.3.0 · Next.js 16.4.6)</h3>
<p>An "expensive" filter + sort over 20,000 numbers with and without useMemo, two effects (a plain function vs a useCallback as dependency), four children and a memo with a missing dependency. Renders are counted in effects, so only committed renders count:</p>
<pre><code class="language-tsx">'use client';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

const so = { tinhKhong: 0, tinhMemo: 0, msKhong: 0, msMemo: 0, chonMoi: 0, effectHam: 0, effectCb: 0 };
const render: Record&lt;string, number&gt; = {};
const truoc: { chon?: () =&gt; void } = {};
function useDemRender(ten: string) {                  <span class="tok-comment">  // đếm lần render ĐÃ commit (đo trong effect)</span>
  useEffect(() =&gt; { render[ten] = (render[ten] ?? 0) + 1; });
}

const ds = Array.from({ length: 20000 }, (_, i) =&gt; (i * 7919) % 20000); <span class="tok-comment">  // 20.000 số</span>
function locVaSap(ai: 'Khong' | 'Memo', nguong: number) {             <span class="tok-comment">  // "phép tính đắt"</span>
  const t0 = performance.now();
  const kq = ds.filter((x) =&gt; x &gt;= nguong).toSorted((a, b) =&gt; a - b);
  so[&#96;tinh\${ai}&#96;]++;
  so[&#96;ms\${ai}&#96;] += performance.now() - t0;
  return kq;
}

<span class="tok-comment">// 1 — useMemo: chỉ tính lại khi phụ thuộc đổi</span>
function KhongMemo({ nguong }: { nguong: number }) {
  const kq = locVaSap('Khong', nguong);                                <span class="tok-comment">  // mỗi render đều tính</span>
  return &lt;p&gt;không memo: {kq.length} số&lt;/p&gt;;
}
function CoMemo({ nguong }: { nguong: number }) {
  const kq = useMemo(() =&gt; locVaSap('Memo', nguong), [nguong]);        <span class="tok-comment">  // chỉ khi nguong đổi</span>
  return &lt;p&gt;useMemo: {kq.length} số&lt;/p&gt;;
}

<span class="tok-comment">// 2 — useCallback chỉ có ích khi con được memo</span>
function ConThuong({ onChon }: { onChon: () =&gt; void }) {
  useDemRender('conThuong');
  return &lt;button onClick={onChon} className="rounded border px-2"&gt;con thường&lt;/button&gt;;
}
const ConMemo = memo(function ConMemo({ ten, onChon }: { ten: string; onChon: () =&gt; void; kieu?: { dam: boolean } }) {
  useDemRender(ten);
  return &lt;button onClick={onChon} className="rounded border px-2"&gt;memo · {ten}&lt;/button&gt;;
});

<span class="tok-comment">// 3 — thiếu phụ thuộc ⇒ kết quả cũ</span>
function NhanCu({ nguong }: { nguong: number }) {
  const nhan = useMemo(() =&gt; &#96;ngưỡng \${nguong}&#96;, []);                 <span class="tok-comment">  // ✗ thiếu nguong</span>
  return &lt;p&gt;nhãn useMemo thiếu phụ thuộc: &lt;b id="nhan-cu"&gt;{nhan}&lt;/b&gt; · thật: &lt;b id="nhan-that"&gt;{nguong}&lt;/b&gt;&lt;/p&gt;;
}

if (typeof window !== 'undefined') Object.assign(window, { __so: so, __render: render }); <span class="tok-comment">  // để đo</span>

export default function GhiNho() {
  const [nguong, setNguong] = useState(10000);
  const [voCan, setVoCan] = useState(0);
  const chon = useCallback(() =&gt; { console.log('chọn', nguong); }, [nguong]);
  const taiLai = () =&gt; {};                                             <span class="tok-comment">  // hàm mới mỗi render</span>
  useDemRender('cha');
  useEffect(() =&gt; { if (truoc.chon !== chon) { so.chonMoi++; truoc.chon = chon; } });
  useEffect(() =&gt; { so.effectHam++; }, [taiLai]);
  useEffect(() =&gt; { so.effectCb++; }, [chon]);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;p&gt;
        &lt;button id="vo-can" onClick={() =&gt; setVoCan(voCan + 1)} className="rounded border px-2"&gt;render vô can ({voCan})&lt;/button&gt;{' '}
        &lt;button id="doi-nguong" onClick={() =&gt; setNguong(nguong + 5000)} className="rounded border px-2"&gt;đổi ngưỡng ({nguong})&lt;/button&gt;
      &lt;/p&gt;
      &lt;KhongMemo nguong={nguong} /&gt;
      &lt;CoMemo nguong={nguong} /&gt;
      &lt;p className="space-x-2"&gt;
        &lt;ConThuong onChon={chon} /&gt;
        &lt;ConMemo ten="inline" onChon={() =&gt; chon()} /&gt;
        &lt;ConMemo ten="cb" onChon={chon} /&gt;
        &lt;ConMemo ten="obj" onChon={chon} kieu={{ dam: true }} /&gt;
      &lt;/p&gt;
      &lt;NhanCu nguong={nguong} /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|ghi-nho'
✓ Compiled successfully in 1050ms
├ ○ /ghi-nho
$ npx eslint -f json src/app/ghi-nho/page.tsx | node tom-eslint.cjs
42:50 warn  react-hooks/exhaustive-deps — React Hook useMemo has a missing dependency: 'nguong'. Either include it or remove the dependency array.
52:9 warn  react-hooks/exhaustive-deps — The 'taiLai' function makes the dependencies of useEffect Hook (at line 55) change on every render. Move it inside the useEffect callback. Alternatively, wrap the definition of 'taiLai' in its own useCallback() Hook.</div>
<p>Then the same project copied, with React Compiler turned on:</p>
<pre><code class="language-typescript">import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,                     <span class="tok-comment">  // bật React Compiler (babel-plugin-react-compiler)</span>
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;</code></pre><div class="out">$ npm i -D babel-plugin-react-compiler@1.0.0 2&gt;&amp;1 | grep -E 'added|up to date'
added 1 package, and audited 362 packages in 4s
$ npm run build 2&gt;&amp;1 | grep -E 'Next.js|Compiled|ghi-nho|ompiler'
▲ Next.js 16.4.6 (Turbopack)
✓ Compiled successfully in 2.4s
├ ○ /ghi-nho
$ echo "c6 (Compiler bật): $(grep -rl 'memo_cache_sentinel' .next/static/chunks | wc -l) tệp JS có bộ nhớ đệm của Compiler"
c6 (Compiler bật):       27 tệp JS có bộ nhớ đệm của Compiler
$ echo "c1 (Compiler tắt): $(grep -rl 'memo_cache_sentinel' .next/static/chunks | wc -l) tệp JS có bộ nhớ đệm của Compiler"
c1 (Compiler tắt):        1 tệp JS có bộ nhớ đệm của Compiler</div>
<p>(The 1 file with the compiler off is React itself, which ships the cache symbol.) Chromium clicked "render vô can" twice, then "đổi ngưỡng" once, on both builds:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /ghi-nho → %{http_code}\\n' localhost:3001/ghi-nho
next start GET /ghi-nho → 200

next start · Chromium             load      2 unrel.  +1 change  ·  compiler on
parent renders                    1         3         4                   4         
computations, no useMemo          1         3         4                   2         
computations, useMemo             1         1         2                   2         
effect on [taiLai]                1         3         4                   1         
effect on [chon] (useCallback)    1         1         2                   2         
plain child + useCallback         1         3         4                   2         
memo child + inline arrow         1         3         4                   2         
memo child + useCallback          1         1         2                   2         
memo child + useCallback + {…}    1         3         4                   2         
label memoised with []            "ngưỡng 10000" (real 15000)     ·  "ngưỡng 15000"
time in the 2 unrelated renders   no useMemo 4.2 ms · useMemo 0.0 ms</div>
<p>Exactly the lesson's 2 computations with useMemo (4 without). A useCallback only helped the <b>memo</b> child, and one object literal undid it; a plain child re-rendered every time. With the compiler on, every count dropped to the minimum without a single manual hook — and the label with the missing dependency was even correct. That is also the warning: the same code behaves differently with the compiler off, so write the dependency arrays correctly anyway.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># localhost:3001/ghi-nho → click, then in the console: JSON.stringify(__so), JSON.stringify(__render)</span>
<span class="tok-comment"># compiler: copy the project, then</span>
npm i -D babel-plugin-react-compiler@1.0.0 <span class="tok-comment">  # + reactCompiler: true in next.config.ts</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-2-memo" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.2 — memo, useMemo, useCallback and React Compiler</span><span class="lc-sub">Only where a measurement says so</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a1-1-performance" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · A1.1 — memo, useMemo & useCallback</span><span class="lc-sub">Avoiding wasted re-renders and expensive recomputation</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useMemo</span><span class="v">Caches a computed value between renders, keyed by dependencies.</span></div>
  <div class="kv"><span class="k">useCallback</span><span class="v">Caches a function identity so memoized children do not re-render.</span></div>
  <div class="kv"><span class="k">Referential stability</span><span class="v">Keeping the same reference across renders so comparisons hold.</span></div>
  <div class="kv"><span class="k">Dependencies</span><span class="v">The array that decides when the cache is rebuilt.</span></div>
  <div class="kv"><span class="k">Premature memo</span><span class="v">Memoizing cheap work adds cost — measure first.</span></div>
  <div class="kv"><span class="k">Pairs with memo</span><span class="v"><code>useCallback</code> only helps when the child is <code>React.memo</code>'d.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>useMemo</code> caches an expensive computed value; <code>useCallback</code> caches a function's identity.</li><li>Both are keyed by a dependency array — a wrong array gives stale results.</li><li><code>useCallback</code> only helps when the receiving child is memoized.</li><li>Do not memoize cheap work; it adds overhead. Measure before reaching for them.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Bỏ qua việc làm, và ổn định tham chiếu</h2>
<p class="lead"><code>useMemo</code> và <code>useCallback</code> là cùng một ý áp cho hai thứ: nhớ một kết quả qua các render và chỉ tính lại khi đầu vào đổi. <code>useMemo</code> nhớ một <em>giá trị</em>; <code>useCallback</code> nhớ một <em>hàm</em>. Cả hai là tối ưu — dùng khi có lý do, đừng dùng theo phản xạ.</p>

<h3>useMemo — chỉ tính lại khi phụ thuộc đổi</h3>
<pre><code class="language-javascript">const value = useMemo(() =&gt; expensiveCompute(dep), [dep]);</code></pre>
<p>React chạy hàm ở render đầu và cache kết quả. Ở các render sau nó chạy lại hàm <em>chỉ khi</em> một phụ thuộc đổi (cùng phép so <code>Object.is</code> như effect); nếu không nó trả về giá trị cache. Ghi từ một render thật — một memo phụ thuộc <code>dep</code>, qua một mount, hai render vô can, và một lần đổi <code>dep</code>:</p>
<div class="out">useMemo computes (mount + 2 unrelated renders + 1 dep change): 2</div>
<p>Đọc kỹ: hàm đắt chạy <strong>hai</strong> lần, không phải bốn. Một lần lúc mount, <em>không</em> lần nào trong hai render mà <code>dep</code> không đổi (một mẩu state khác đổi), và một lần khi <code>dep</code> thật sự đổi. Không có <code>useMemo</code> thì nó đã chạy cả bốn render. Đó là cái lợi — nhưng chỉ đáng khi phép tính thật sự đắt.</p>

<h3>useCallback — y hệt, nhưng cho một hàm</h3>
<pre><code class="language-javascript">const handleSearch = useCallback((q) =&gt; { doSearch(q, filter); }, [filter]);</code></pre>
<p><code>useCallback(fn, deps)</code> đúng bằng <code>useMemo(() =&gt; fn, deps)</code> — nó trả về <em>cùng tham chiếu hàm</em> qua các render cho tới khi một phụ thuộc đổi. Vì sao bạn phải quan tâm tham chiếu của một hàm? Hai lý do: (1) nó là phụ thuộc của một effect hay memo khác (một hàm mới mỗi render sẽ kích hoạt lại chúng — cái bẫy Chương 5), hoặc (2) bạn truyền nó cho một con bọc trong <code>React.memo</code> (Chương 7), vốn bỏ qua render lại chỉ khi props bằng nhau về tham chiếu.</p>

<h3>Khi nào KHÔNG dùng chúng — tức là phần lớn thời gian</h3>
<p>Các hook này không miễn phí: chúng tốn bộ nhớ và một phép so phụ thuộc mỗi render, và làm rối code. Thêm chúng khắp nơi làm app <em>chậm hơn và khó đọc hơn</em>. Chỉ dùng khi:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">useMemo — có</span><span class="v">phép tính đắt đo được (sắp/lọc hàng nghìn phần tử, một transform nặng), hoặc kết quả là một phụ thuộc phải giữ ổn định.</span></div>
  <div class="kv"><span class="k">useCallback — có</span><span class="v">hàm là phụ thuộc của một effect/memo, hoặc một prop cho một con đã memo hoá.</span></div>
  <div class="kv"><span class="k">Cả hai — không</span><span class="v">cho một phép tính rẻ, một giá trị chỉ dùng để render chữ, hay một handler truyền cho một element DOM thường. Cái bọc tốn hơn cái tiết kiệm.</span></div>
</div>
<p>Mặc định thành thật: viết thẳng trước. Với tới memo hoá khi một trình profiler (Chương 7) cho thấy một chi phí render lại hay tính toán thật, không phải vì một giá trị <em>trông có vẻ</em> đắt.</p>

<div class="callout warn">
<p><strong>React Compiler đổi bài toán.</strong> Nó không còn là lời hứa: <code>babel-plugin-react-compiler</code> bản 1.0 đã có trên npm, Next.js 16 bật nó bằng <code>reactCompiler: true</code>, và <code>create-next-app</code> hỏi "Would you like to use React Compiler?" (khoá này chọn No). Nó tự chèn phần memo hoá hộ bạn lúc build — đo ở dưới trên một bản sao của lab — nên <code>useMemo</code>/<code>useCallback</code> thủ công ngày càng bớt quan trọng. Hãy học chúng làm gì — bạn sẽ đọc chúng trong code có sẵn và vẫn cần chúng ở các ranh giới — nhưng đừng rắc chúng khắp code mới "cho chắc". Code đúng, dễ đọc trước đã.</p>
</div>
<h3>Ghi nhớ (memoisation): nó mua được gì và tốn những gì</h3>
<div class="lz-map">
  <div class="lz-stage">Đo trước, ghi nhớ sau</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">useMemo nhớ một giá trị</div><div class="lz-nsub"><code>useMemo(() =&gt; expensiveSort(items), [items])</code>. Bỏ qua phép tính khi các phụ thuộc không đổi.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">useCallback nhớ một hàm</div><div class="lz-nsub">Cũng vậy nhưng cho danh tính của một hàm, để một component con đã memo không render lại chỉ vì handler của nó là mới.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Chúng không miễn phí</div><div class="lz-nsub">Mỗi cái đều lưu một giá trị, so các phụ thuộc ở mọi lần render, và thêm một dòng cho người đọc sau phải hiểu.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Chúng chỉ giúp trong ba trường hợp</div><div class="lz-nsub">Một phép tính đắt; một phụ thuộc của effect; một prop truyền cho component con bọc <code>memo</code>. Ngoài ba cái đó, chúng tốn nhiều hơn tiết kiệm.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — bọc một handler trong <code>useCallback</code> rồi truyền cho một component con KHÔNG được memo.</strong> <code>const onSelect = useCallback(…, [])</code> giữ danh tính hàm ổn định, và điều đó chẳng đạt được gì nếu component con là một component thường: nó render lại khi cha render, bất kể props có đổi hay không. Thế là bạn đã trả tiền cho phép ghi nhớ mà chẳng mua được gì. Cặp này chỉ chạy khi đi cùng nhau — <code>useCallback</code> ở cha <em>và</em> <code>React.memo</code> ở con — và ngay cả thế cũng chỉ khi mọi prop khác cũng ổn định, thứ mà một object viết thẳng cũng đủ phá vỡ. Hãy đo trước khi thêm cái nào; profiler của React DevTools cho bạn thấy component nào thật sự render lại và mất bao lâu.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Có nên thêm useMemo ở mọi nơi?</span><span class="lc-sub">Câu trả lời chính thức, kèm ba trường hợp nó thật sự giúp ích.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/react-developer-tools" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">react.dev — React Developer Tools</span><span class="lc-sub">Profiler: component nào đã render lại, vì sao, và mỗi cái mất bao lâu.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một phép tính cố tình nặng trong lúc render, rồi bọc nó trong <code>useMemo</code> với đúng phụ thuộc và xác nhận nó chỉ tính lại khi chúng đổi.</li>
<li>Bọc một callback truyền cho một con đã memo trong <code>useCallback</code> và cho thấy con thôi render lại vô ích.</li>
<li>Bỏ một phụ thuộc khỏi memo và quan sát kết quả cũ — rồi đặt lại.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn memo được một giá trị và một callback và đặt đúng phụ thuộc cho chúng.</p></div>

<h3>🔬 Đo thật: một trang, đếm trong Chromium (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Một phép "đắt" lọc + sắp 20.000 số có và không có useMemo, hai effect (phụ thuộc hàm viết thẳng vs useCallback), bốn component con và một useMemo thiếu phụ thuộc. Lần render được đếm trong effect, nên chỉ tính lần đã commit:</p>
<pre><code class="language-tsx">'use client';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

const so = { tinhKhong: 0, tinhMemo: 0, msKhong: 0, msMemo: 0, chonMoi: 0, effectHam: 0, effectCb: 0 };
const render: Record&lt;string, number&gt; = {};
const truoc: { chon?: () =&gt; void } = {};
function useDemRender(ten: string) {                  <span class="tok-comment">  // đếm lần render ĐÃ commit (đo trong effect)</span>
  useEffect(() =&gt; { render[ten] = (render[ten] ?? 0) + 1; });
}

const ds = Array.from({ length: 20000 }, (_, i) =&gt; (i * 7919) % 20000); <span class="tok-comment">  // 20.000 số</span>
function locVaSap(ai: 'Khong' | 'Memo', nguong: number) {             <span class="tok-comment">  // "phép tính đắt"</span>
  const t0 = performance.now();
  const kq = ds.filter((x) =&gt; x &gt;= nguong).toSorted((a, b) =&gt; a - b);
  so[&#96;tinh\${ai}&#96;]++;
  so[&#96;ms\${ai}&#96;] += performance.now() - t0;
  return kq;
}

<span class="tok-comment">// 1 — useMemo: chỉ tính lại khi phụ thuộc đổi</span>
function KhongMemo({ nguong }: { nguong: number }) {
  const kq = locVaSap('Khong', nguong);                                <span class="tok-comment">  // mỗi render đều tính</span>
  return &lt;p&gt;không memo: {kq.length} số&lt;/p&gt;;
}
function CoMemo({ nguong }: { nguong: number }) {
  const kq = useMemo(() =&gt; locVaSap('Memo', nguong), [nguong]);        <span class="tok-comment">  // chỉ khi nguong đổi</span>
  return &lt;p&gt;useMemo: {kq.length} số&lt;/p&gt;;
}

<span class="tok-comment">// 2 — useCallback chỉ có ích khi con được memo</span>
function ConThuong({ onChon }: { onChon: () =&gt; void }) {
  useDemRender('conThuong');
  return &lt;button onClick={onChon} className="rounded border px-2"&gt;con thường&lt;/button&gt;;
}
const ConMemo = memo(function ConMemo({ ten, onChon }: { ten: string; onChon: () =&gt; void; kieu?: { dam: boolean } }) {
  useDemRender(ten);
  return &lt;button onClick={onChon} className="rounded border px-2"&gt;memo · {ten}&lt;/button&gt;;
});

<span class="tok-comment">// 3 — thiếu phụ thuộc ⇒ kết quả cũ</span>
function NhanCu({ nguong }: { nguong: number }) {
  const nhan = useMemo(() =&gt; &#96;ngưỡng \${nguong}&#96;, []);                 <span class="tok-comment">  // ✗ thiếu nguong</span>
  return &lt;p&gt;nhãn useMemo thiếu phụ thuộc: &lt;b id="nhan-cu"&gt;{nhan}&lt;/b&gt; · thật: &lt;b id="nhan-that"&gt;{nguong}&lt;/b&gt;&lt;/p&gt;;
}

if (typeof window !== 'undefined') Object.assign(window, { __so: so, __render: render }); <span class="tok-comment">  // để đo</span>

export default function GhiNho() {
  const [nguong, setNguong] = useState(10000);
  const [voCan, setVoCan] = useState(0);
  const chon = useCallback(() =&gt; { console.log('chọn', nguong); }, [nguong]);
  const taiLai = () =&gt; {};                                             <span class="tok-comment">  // hàm mới mỗi render</span>
  useDemRender('cha');
  useEffect(() =&gt; { if (truoc.chon !== chon) { so.chonMoi++; truoc.chon = chon; } });
  useEffect(() =&gt; { so.effectHam++; }, [taiLai]);
  useEffect(() =&gt; { so.effectCb++; }, [chon]);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;p&gt;
        &lt;button id="vo-can" onClick={() =&gt; setVoCan(voCan + 1)} className="rounded border px-2"&gt;render vô can ({voCan})&lt;/button&gt;{' '}
        &lt;button id="doi-nguong" onClick={() =&gt; setNguong(nguong + 5000)} className="rounded border px-2"&gt;đổi ngưỡng ({nguong})&lt;/button&gt;
      &lt;/p&gt;
      &lt;KhongMemo nguong={nguong} /&gt;
      &lt;CoMemo nguong={nguong} /&gt;
      &lt;p className="space-x-2"&gt;
        &lt;ConThuong onChon={chon} /&gt;
        &lt;ConMemo ten="inline" onChon={() =&gt; chon()} /&gt;
        &lt;ConMemo ten="cb" onChon={chon} /&gt;
        &lt;ConMemo ten="obj" onChon={chon} kieu={{ dam: true }} /&gt;
      &lt;/p&gt;
      &lt;NhanCu nguong={nguong} /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|ghi-nho'
✓ Compiled successfully in 1050ms
├ ○ /ghi-nho
$ npx eslint -f json src/app/ghi-nho/page.tsx | node tom-eslint.cjs
42:50 warn  react-hooks/exhaustive-deps — React Hook useMemo has a missing dependency: 'nguong'. Either include it or remove the dependency array.
52:9 warn  react-hooks/exhaustive-deps — The 'taiLai' function makes the dependencies of useEffect Hook (at line 55) change on every render. Move it inside the useEffect callback. Alternatively, wrap the definition of 'taiLai' in its own useCallback() Hook.</div>
<p>Rồi chép nguyên dự án, bật React Compiler:</p>
<pre><code class="language-typescript">import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,                     <span class="tok-comment">  // bật React Compiler (babel-plugin-react-compiler)</span>
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;</code></pre><div class="out">$ npm i -D babel-plugin-react-compiler@1.0.0 2&gt;&amp;1 | grep -E 'added|up to date'
added 1 package, and audited 362 packages in 4s
$ npm run build 2&gt;&amp;1 | grep -E 'Next.js|Compiled|ghi-nho|ompiler'
▲ Next.js 16.4.6 (Turbopack)
✓ Compiled successfully in 2.4s
├ ○ /ghi-nho
$ echo "c6 (Compiler bật): $(grep -rl 'memo_cache_sentinel' .next/static/chunks | wc -l) tệp JS có bộ nhớ đệm của Compiler"
c6 (Compiler bật):       27 tệp JS có bộ nhớ đệm của Compiler
$ echo "c1 (Compiler tắt): $(grep -rl 'memo_cache_sentinel' .next/static/chunks | wc -l) tệp JS có bộ nhớ đệm của Compiler"
c1 (Compiler tắt):        1 tệp JS có bộ nhớ đệm của Compiler</div>
<p>(Tệp duy nhất khi tắt là mã của chính React, vốn mang sẵn ký hiệu bộ nhớ đệm.) Chromium bấm "render vô can" hai lần, rồi "đổi ngưỡng" một lần, trên cả hai bản build:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /ghi-nho → %{http_code}\\n' localhost:3001/ghi-nho
next start GET /ghi-nho → 200

next start · Chromium             vừa tải   2 vô can  +1 đổi     ·  bật Compiler
cha render                        1         3         4                   4         
lần tính, không useMemo           1         3         4                   2         
lần tính, useMemo                 1         1         2                   2         
effect phụ thuộc [taiLai]         1         3         4                   1         
effect phụ thuộc [chon]           1         1         2                   2         
con thường + useCallback          1         3         4                   2         
con memo + hàm viết thẳng         1         3         4                   2         
con memo + useCallback            1         1         2                   2         
con memo + useCallback + {…}      1         3         4                   2         
nhãn useMemo thiếu phụ thuộc      "ngưỡng 10000" (real 15000)     ·  "ngưỡng 15000"
thời gian trong 2 render vô can   không useMemo 4.2 ms · useMemo 0.0 ms</div>
<p>Đúng 2 lần tính với useMemo như bài nói (4 khi không có). useCallback chỉ giúp con <b>memo</b>, và một object viết thẳng phá ngay; con thường render lại mọi lần. Bật Compiler, mọi con số về mức thấp nhất mà không cần một hook thủ công nào — và nhãn thiếu phụ thuộc còn ra đúng. Đó cũng là lời cảnh báo: cùng một mã chạy khác nhau khi tắt Compiler, nên vẫn phải viết mảng phụ thuộc cho đúng.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># localhost:3001/ghi-nho → bấm, rồi ở console: JSON.stringify(__so), JSON.stringify(__render)</span>
<span class="tok-comment"># Compiler: chép dự án, rồi</span>
npm i -D babel-plugin-react-compiler@1.0.0 <span class="tok-comment">  # + reactCompiler: true trong next.config.ts</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-2-memo" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.2 — memo, useMemo, useCallback và React Compiler</span><span class="lc-sub">Chỉ ở chỗ số đo bảo cần</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a1-1-performance" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · A1.1 — memo, useMemo & useCallback</span><span class="lc-sub">Tránh render lại thừa và tính toán lại tốn kém</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useMemo</span><span class="v">Lưu cache một giá trị đã tính giữa các lần render, lấy khoá theo phụ thuộc.</span></div>
  <div class="kv"><span class="k">useCallback</span><span class="v">Lưu cache danh tính một hàm để con đã memo không render lại.</span></div>
  <div class="kv"><span class="k">Ổn định tham chiếu</span><span class="v">Giữ cùng một tham chiếu qua các render để so sánh đứng vững.</span></div>
  <div class="kv"><span class="k">Phụ thuộc</span><span class="v">Mảng quyết định khi nào cache được dựng lại.</span></div>
  <div class="kv"><span class="k">Memo sớm</span><span class="v">Memo việc rẻ lại thêm chi phí — hãy đo trước.</span></div>
  <div class="kv"><span class="k">Đi cặp với memo</span><span class="v"><code>useCallback</code> chỉ hữu ích khi con được <code>React.memo</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>useMemo</code> lưu cache một giá trị tính nặng; <code>useCallback</code> lưu cache danh tính một hàm.</li><li>Cả hai lấy khoá theo mảng phụ thuộc — mảng sai cho kết quả cũ.</li><li><code>useCallback</code> chỉ hữu ích khi con nhận nó đã được memo.</li><li>Đừng memo việc rẻ; nó thêm chi phí. Hãy đo trước khi dùng.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — useReducer: state transitions as data|||6.3 — useReducer: chuyển trạng thái thành dữ liệu',
      slug: 'nextjs-6-3-usereducer',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Khi nhiều mẩu state đổi cùng nhau theo luật rõ ràng, useReducer gom mọi cách cập nhật vào một hàm reducer thuần.',
      content: `
${G06_3}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>When several pieces of state change together by rules</h2>
<p class="lead"><code>useState</code> is perfect for independent values. But when state gets complex — many fields that update together, transitions with rules ("you can't submit while loading") — scattering <code>setX</code> calls across handlers gets fragile. <code>useReducer</code> collects <em>all</em> the ways state can change into one pure function.</p>

<h3>The reducer is a pure function of (state, action)</h3>
<pre><code class="language-typescript">type Dem = { n: number };
type HanhDong = { type: 'inc' } | { type: 'add'; by: number };

function reducer(state: Dem, action: HanhDong): Dem {
  switch (action.type) {
    case 'inc': return { n: state.n + 1 };
    case 'add': return { n: state.n + action.by };
    default:    return state;
  }
}</code></pre>
<p>A reducer takes the current state and an <strong>action</strong> (an object describing what happened) and returns the <em>next</em> state. It is pure: no side effects, no mutation — it builds a new state object. Because it is just a function, you can test it in isolation and reason about every transition in one place. Running <code>inc</code>, then <code>add 5</code>, then <code>inc</code>, starting from <code>{ n: 0 }</code>:</p>
<div class="out">REDUCER n= 7</div>
<p>Verified: 0 → (inc) 1 → (add 5) 6 → (inc) 7. Every transition is a line in the reducer; nothing changes state except by dispatching an action through it.</p>

<h3>Wiring it up with useReducer</h3>
<pre><code class="language-html">const [state, dispatch] = useReducer(reducer, { n: 0 });

<span class="tok-comment">// components don't call setState — they dispatch actions</span>
&lt;button onClick={() =&gt; dispatch({ type: 'inc' })}&gt;+1&lt;/button&gt;
&lt;button onClick={() =&gt; dispatch({ type: 'add', by: 5 })}&gt;+5&lt;/button&gt;</code></pre>
<p><code>useReducer</code> returns the current <code>state</code> and a <code>dispatch</code> function. Instead of computing the next state in a handler and calling a setter, the handler <em>dispatches an action</em> — a description of intent — and the reducer decides what that means. The "what happened" (the action) is separated from the "how state changes" (the reducer).</p>

<h3>useState or useReducer?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useState</span><span class="v">a few independent values: a boolean, an input string, a counter. Most components.</span></div>
  <div class="kv"><span class="k">useReducer</span><span class="v">many related fields; the next state depends on the old in non-trivial ways; the same transitions fire from several places; or you want to unit-test the state logic.</span></div>
</div>
<p>They are interchangeable in power — anything one does, the other can. Reach for <code>useReducer</code> when a component's <code>useState</code> calls have multiplied and the update logic is smeared across handlers; consolidating it into a reducer makes the component's behaviour readable as a single list of transitions. This same shape scales up to Redux and Zustand (Chapter 14) — a reducer is the heart of most state libraries.</p>
<h3>When a reducer beats several useStates</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>The states are related</b> — Loading, data and error are one thing with three shapes, not three independent booleans that happen to sit near each other.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The transitions are the logic</b> — <code>dispatch({ type: &#39;fetch_failed&#39;, error })</code> names what happened. The reducer decides what the state becomes.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It is a pure function</b> — <code>(state, action) =&gt; newState</code>. Testable on its own, with no React involved — which is worth more than it sounds.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>And it removes impossible combinations</b> — With separate booleans, <code>loading &amp;&amp; error</code> is representable. With a reducer returning one shape per case, it is not.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — mutating the state object inside the reducer.</strong> <code>case &#39;add&#39;: state.items.push(action.item); return state</code> returns the same object it received, so React&#39;s identity comparison says nothing changed and the component does not re-render. The data is genuinely updated — you can see it in the console — and the screen stays wrong, which sends people looking at the component instead of the reducer. A reducer must return a <em>new</em> object: <code>return { ...state, items: [...state.items, action.item] }</code>. This is the same rule as <code>useState</code>, but easier to break here because the reducer looks like a place where you are &quot;allowed&quot; to write imperative code.</p></div>
<a class="link-card dl" href="https://react.dev/learn/extracting-state-logic-into-a-reducer" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">react.dev — Extracting state logic into a reducer</span><span class="lc-sub">The step-by-step refactor from several useStates to one reducer.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useReducer" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">react.dev — useReducer reference</span><span class="lc-sub">Signatures, lazy initialisation, and the purity requirement spelled out.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Convert a component with three related <code>useState</code>s into one <code>useReducer</code> with a typed action union.</li>
<li>Dispatch two actions and confirm the reducer is a pure function of (state, action).</li>
<li>Write one sentence on when a reducer beats multiple useStates (complex transitions, related fields).</li>
</ol>
<p><strong>Done when:</strong> you can model related state as a reducer and dispatch typed actions.</p></div>

<h3>🔬 Measured: reducers on a real page (React 19.3.0 · Next.js 16.4.6)</h3>
<p>The reducer lives in its own file and is tested with no React at all:</p>
<pre><code class="language-typescript">export type Dem = { n: number };
export type HanhDong = { type: 'inc' } | { type: 'add'; by: number };

export function demReducer(state: Dem, action: HanhDong): Dem {
  switch (action.type) {
    case 'inc': return { n: state.n + 1 };
    case 'add': return { n: state.n + action.by };
    default:    return state;
  }
}</code></pre><pre><code class="language-javascript">import { test } from 'node:test';
import assert from 'node:assert/strict';
import { demReducer } from './demReducer.ts';

test('inc → add 5 → inc, từ { n: 0 }', () =&gt; {
  let s = { n: 0 };
  s = demReducer(s, { type: 'inc' });
  s = demReducer(s, { type: 'add', by: 5 });
  s = demReducer(s, { type: 'inc' });
  console.log('REDUCER n=', s.n);
  assert.equal(s.n, 7);
});

test('thuần: không sửa state cũ', () =&gt; {
  const cu = { n: 1 };
  const moi = demReducer(cu, { type: 'inc' });
  assert.equal(cu.n, 1);
  assert.notEqual(moi, cu);
});</code></pre>
<p>Then one page with four experiments — the counter, a mutating vs a new-object reducer, three useStates vs one status reducer:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useReducer, useState } from 'react';
import { demReducer } from '@/lib/demReducer';

<span class="tok-comment">// 1 — bộ đếm: component chỉ dispatch, reducer quyết định</span>
function BoDem() {
  const [state, dispatch] = useReducer(demReducer, { n: 0 });
  return (
    &lt;p&gt;
      &lt;button id="inc" onClick={() =&gt; dispatch({ type: 'inc' })} className="rounded border px-2"&gt;+1&lt;/button&gt;{' '}
      &lt;button id="add5" onClick={() =&gt; dispatch({ type: 'add', by: 5 })} className="rounded border px-2"&gt;+5&lt;/button&gt;{' '}
      n = &lt;b id="n"&gt;{state.n}&lt;/b&gt;
    &lt;/p&gt;
  );
}

<span class="tok-comment">// 2 — bẫy: sửa thẳng state trong reducer</span>
type Ds = { items: string[] };
const dem = { goiSai: 0, goiDung: 0 };
function dsSai(state: Ds, action: { type: 'add'; item: string }): Ds {
  dem.goiSai++;
  state.items.push(action.item);                       <span class="tok-comment">  // ✗ sửa thẳng object cũ</span>
  return state;                                        <span class="tok-comment">  // ✗ trả lại CHÍNH nó</span>
}
function dsDung(state: Ds, action: { type: 'add'; item: string }): Ds {
  dem.goiDung++;
  return { ...state, items: [...state.items, action.item] }; <span class="tok-comment">  // ✓ object mới</span>
}
const dau = { sai: { items: [] as string[] }, dung: { items: [] as string[] } };
function DanhSach() {
  const [sai, dSai] = useReducer(dsSai, dau.sai);
  const [dung, dDung] = useReducer(dsDung, dau.dung);
  const [, setVoCan] = useState(0);
  useEffect(() =&gt; { Object.assign(window, { __sai: sai, __dung: dung }); });
  return (
    &lt;p&gt;
      &lt;button id="them-sai" onClick={() =&gt; dSai({ type: 'add', item: 'sữa' })} className="rounded border px-2"&gt;thêm (sửa thẳng)&lt;/button&gt;{' '}
      &lt;button id="them-dung" onClick={() =&gt; dDung({ type: 'add', item: 'sữa' })} className="rounded border px-2"&gt;thêm (object mới)&lt;/button&gt;{' '}
      &lt;button id="vo-can" onClick={() =&gt; setVoCan((x) =&gt; x + 1)} className="rounded border px-2"&gt;render vô can&lt;/button&gt;{' '}
      màn hình: sửa thẳng &lt;b id="m-sai"&gt;{sai.items.length}&lt;/b&gt; · object mới &lt;b id="m-dung"&gt;{dung.items.length}&lt;/b&gt;
    &lt;/p&gt;
  );
}

<span class="tok-comment">// 3 — tổ hợp bất khả: ba mẩu state rời vs một reducer</span>
function TaiBool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState&lt;string | null&gt;(null);
  const [data, setData] = useState&lt;string | null&gt;(null);
  const tai = (hong: boolean) =&gt; {
    setLoading(true);                                  <span class="tok-comment">  // ✗ quên xoá error/data cũ</span>
    setTimeout(() =&gt; { if (hong) setError('mạng lỗi'); else setData('An'); setLoading(false); }, 400);
  };
  return (
    &lt;p&gt;
      &lt;button id="b-hong" onClick={() =&gt; tai(true)} className="rounded border px-2"&gt;tải (hỏng)&lt;/button&gt;{' '}
      &lt;button id="b-tai" onClick={() =&gt; tai(false)} className="rounded border px-2"&gt;tải&lt;/button&gt;{' '}
      3 useState: &lt;b id="b-hien"&gt;{loading &amp;&amp; 'đang tải… '}{error &amp;&amp; &#96;lỗi: \${error} &#96;}{data &amp;&amp; &#96;dữ liệu: \${data}&#96;}&lt;/b&gt;
    &lt;/p&gt;
  );
}
type TrangThai = { status: 'idle' } | { status: 'loading' } | { status: 'error'; error: string } | { status: 'ok'; data: string };
type Tai = { type: 'start' } | { type: 'fail'; error: string } | { type: 'done'; data: string };
const dauTai = { start: 0, boQua: 0 };
function taiReducer(s: TrangThai, a: Tai): TrangThai {
  switch (a.type) {
    case 'start':
      if (s.status === 'loading') { dauTai.boQua++; return s; } <span class="tok-comment">  // luật: đang tải thì bỏ qua</span>
      dauTai.start++; return { status: 'loading' };
    case 'fail': return { status: 'error', error: a.error };
    case 'done': return { status: 'ok', data: a.data };
  }
}
function TaiReducer() {
  const [s, dispatch] = useReducer(taiReducer, { status: 'idle' });
  const tai = (hong: boolean) =&gt; {
    dispatch({ type: 'start' });
    setTimeout(() =&gt; dispatch(hong ? { type: 'fail', error: 'mạng lỗi' } : { type: 'done', data: 'An' }), 400);
  };
  return (
    &lt;p&gt;
      &lt;button id="r-hong" onClick={() =&gt; tai(true)} className="rounded border px-2"&gt;tải (hỏng)&lt;/button&gt;{' '}
      &lt;button id="r-tai" onClick={() =&gt; tai(false)} className="rounded border px-2"&gt;tải&lt;/button&gt;{' '}
      reducer: &lt;b id="r-hien"&gt;{s.status === 'loading' ? 'đang tải…' : s.status === 'error' ? &#96;lỗi: \${s.error}&#96; : s.status === 'ok' ? &#96;dữ liệu: \${s.data}&#96; : '—'}&lt;/b&gt;
    &lt;/p&gt;
  );
}

if (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __dauTai: dauTai }); <span class="tok-comment">  // để đo</span>

export default function BoGiam() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;BoDem /&gt;
      &lt;DanhSach /&gt;
      &lt;TaiBool /&gt;
      &lt;TaiReducer /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ node --test src/lib/demReducer.test.mjs 2&gt;&amp;1 | grep -E 'REDUCER|^# (pass|fail)|^ok|^not ok'
# REDUCER n= 7
ok 1 - inc → add 5 → inc, từ { n: 0 }
ok 2 - thuần: không sửa state cũ
# pass 2
# fail 0
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|bo-giam'
✓ Compiled successfully in 347ms
├ ○ /bo-giam</div>
<p>What the types catch (a throw-away file, deleted afterwards):</p>
<pre><code class="language-tsx">'use client';
import { useReducer } from 'react';
import { demReducer } from '@/lib/demReducer';

type TrangThai = { status: 'loading' } | { status: 'error'; error: string };
const t: TrangThai = { status: 'loading', error: 'x' };   <span class="tok-comment">  // tổ hợp bất khả</span>

export default function Sai() {
  const [state, dispatch] = useReducer(demReducer, { n: 0 });
  dispatch({ type: 'add' });                                <span class="tok-comment">  // quên by</span>
  dispatch({ type: 'incc' });                               <span class="tok-comment">  // gõ nhầm tên action</span>
  return &lt;p&gt;{state.n} {t.status}&lt;/p&gt;;
}</code></pre><div class="out">$ npx tsc --noEmit 2&gt;&amp;1 | grep -E 'error TS' | sed 's/^src.app.bo-giam-sai.//'
page.tsx(6,43): error TS2353: Object literal may only specify known properties, and 'error' does not exist in type '{ status: "loading"; }'.
page.tsx(10,12): error TS2345: Argument of type '{ type: "add"; }' is not assignable to parameter of type 'HanhDong'.
page.tsx(11,14): error TS2820: Type '"incc"' is not assignable to type '"inc" | "add"'. Did you mean '"inc"'?</div>
<p>Both servers, driven by Chromium:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /bo-giam → %{http_code}\\n' localhost:3001/bo-giam
next start GET /bo-giam → 200
$ curl -s -o /dev/null -w 'next dev   GET /bo-giam → %{http_code}\\n' localhost:3000/bo-giam
next dev   GET /bo-giam → 200

Chromium                                  next start              next dev
+1, +5, +1                              : n = 7                   n = 7
mutating reducer, 1 click: data · screen : 1 · 0                   2 · 0
  reducer calls for that click           : 1                       2
  screen after an unrelated render       : 1                       2
new-object reducer: data · screen · calls: 1 · 1 · 1               1 · 1 · 2
3 useStates, fail then reload (during)   : đang tải… lỗi: mạng lỗi
3 useStates (after)                      : lỗi: mạng lỗi dữ liệu: An
reducer (during → after)                 : đang tải… → dữ liệu: An
two fast 'start': accepted · ignored     : 2 · 1                   4 · 2  (counters inside the reducer: doubled in dev)</div>
<p>The mutating reducer returned the same object, so React bailed out: the data had the item, the screen did not — until any other render. In development it is worse: React calls a reducer <b>twice</b> per dispatch to catch impure ones (like the double effect of Lesson 5.3), so one click pushed the item twice. The new-object reducer was also called twice and stayed correct. Even a counter inside a reducer is a side effect: ours doubled. And the three useStates really showed "loading" and "error" together — the status reducer cannot.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">node --test src/lib/demReducer.test.mjs
npm run build &amp;&amp; npx next start -p 3001 &amp;
npx next dev -p 3000
<span class="tok-comment"># /bo-giam on both: click "thêm (sửa thẳng)" once, then in the console: __sai.items.length, JSON.stringify(__dem)</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-5-2-reducer" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 5.2 — useReducer for complex state</span><span class="lc-sub">Actions, a pure reducer and a four-step booking flow</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-2-usecontext-usereducer" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.2 — useContext & useReducer</span><span class="lc-sub">The subject lesson: the two hooks together</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-ex15-usereducer" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 15 — useReducer</span><span class="lc-sub">A counter and a question bank</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useReducer</span><span class="v">Manage state via a reducer <code>(state, action) =&gt; newState</code>.</span></div>
  <div class="kv"><span class="k">Action</span><span class="v">A plain object describing what happened (<code>{ type, payload }</code>).</span></div>
  <div class="kv"><span class="k">dispatch</span><span class="v">The function you call to send an action to the reducer.</span></div>
  <div class="kv"><span class="k">Pure reducer</span><span class="v">Computes new state with no side effects.</span></div>
  <div class="kv"><span class="k">State transitions</span><span class="v">Reducers make complex, related changes explicit.</span></div>
  <div class="kv"><span class="k">vs useState</span><span class="v">Prefer a reducer when several fields change together by rules.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>useReducer</code> centralises related state into one reducer: <code>(state, action) =&gt; newState</code>.</li><li>You <code>dispatch</code> plain action objects; the reducer stays a pure function.</li><li>It makes complex state transitions explicit and testable.</li><li>Prefer it over many <code>useState</code>s when several fields change together by rules.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Khi nhiều mẩu state đổi cùng nhau theo luật</h2>
<p class="lead"><code>useState</code> hoàn hảo cho các giá trị độc lập. Nhưng khi state phức tạp — nhiều trường cập nhật cùng nhau, các chuyển trạng thái có luật ("không được submit khi đang loading") — rải các lời gọi <code>setX</code> khắp handler trở nên mong manh. <code>useReducer</code> gom <em>mọi</em> cách state có thể đổi vào một hàm thuần.</p>

<h3>Reducer là một hàm thuần của (state, action)</h3>
<pre><code class="language-typescript">type Dem = { n: number };
type HanhDong = { type: 'inc' } | { type: 'add'; by: number };

function reducer(state: Dem, action: HanhDong): Dem {
  switch (action.type) {
    case 'inc': return { n: state.n + 1 };
    case 'add': return { n: state.n + action.by };
    default:    return state;
  }
}</code></pre>
<p>Một reducer nhận state hiện tại và một <strong>action</strong> (một object mô tả chuyện đã xảy ra) và trả về state <em>kế tiếp</em>. Nó thuần: không tác dụng phụ, không mutate — nó dựng một object state mới. Vì chỉ là một hàm, bạn test được nó cô lập và suy luận mọi chuyển trạng thái ở một chỗ. Chạy <code>inc</code>, rồi <code>add 5</code>, rồi <code>inc</code>, bắt đầu từ <code>{ n: 0 }</code>:</p>
<div class="out">REDUCER n= 7</div>
<p>Đã kiểm: 0 → (inc) 1 → (add 5) 6 → (inc) 7. Mỗi chuyển trạng thái là một dòng trong reducer; không gì đổi state trừ khi dispatch một action qua nó.</p>

<h3>Nối dây bằng useReducer</h3>
<pre><code class="language-html">const [state, dispatch] = useReducer(reducer, { n: 0 });

<span class="tok-comment">// component không gọi setState — chúng dispatch action</span>
&lt;button onClick={() =&gt; dispatch({ type: 'inc' })}&gt;+1&lt;/button&gt;
&lt;button onClick={() =&gt; dispatch({ type: 'add', by: 5 })}&gt;+5&lt;/button&gt;</code></pre>
<p><code>useReducer</code> trả về <code>state</code> hiện tại và một hàm <code>dispatch</code>. Thay vì tính state kế trong một handler rồi gọi setter, handler <em>dispatch một action</em> — một mô tả ý định — và reducer quyết nó nghĩa là gì. "Chuyện gì xảy ra" (action) được tách khỏi "state đổi thế nào" (reducer).</p>

<h3>useState hay useReducer?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useState</span><span class="v">vài giá trị độc lập: một boolean, một chuỗi input, một bộ đếm. Phần lớn component.</span></div>
  <div class="kv"><span class="k">useReducer</span><span class="v">nhiều trường liên quan; state kế phụ thuộc cái cũ theo cách không tầm thường; cùng các chuyển trạng thái nổ từ nhiều nơi; hoặc bạn muốn unit-test logic state.</span></div>
</div>
<p>Chúng ngang sức nhau — cái nào làm được, cái kia cũng làm được. Với tới <code>useReducer</code> khi các lời gọi <code>useState</code> của một component đã nhân lên và logic cập nhật bị bôi khắp handler; gom nó vào một reducer làm hành vi component đọc được như một danh sách chuyển trạng thái duy nhất. Chính hình dạng này mở rộng lên Redux và Zustand (Chương 14) — một reducer là trái tim của phần lớn thư viện state.</p>
<h3>Khi nào reducer hơn vài useState</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Các trạng thái có liên quan với nhau</b> — Đang tải, dữ liệu và lỗi là MỘT thứ với ba hình dạng, chứ không phải ba boolean độc lập tình cờ nằm cạnh nhau.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Các phép chuyển trạng thái chính là logic</b> — <code>dispatch({ type: &#39;fetch_failed&#39;, error })</code> gọi tên chuyện đã xảy ra. Reducer quyết định state trở thành gì.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó là một hàm thuần khiết</b> — <code>(state, action) =&gt; newState</code>. Kiểm thử được riêng lẻ, chẳng dính gì tới React — và điều đó đáng giá hơn vẻ ngoài của nó.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Và nó loại bỏ những tổ hợp bất khả</b> — Với các boolean riêng lẻ thì <code>loading &amp;&amp; error</code> là biểu diễn được. Với một reducer trả về một dáng cho mỗi ca thì không.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — sửa thẳng object state bên trong reducer.</strong> <code>case &#39;add&#39;: state.items.push(action.item); return state</code> trả về đúng cái object nó nhận vào, nên phép so danh tính của React nói là chẳng có gì đổi và component không render lại. Dữ liệu thì đúng là đã cập nhật — bạn thấy được trong console — mà màn hình vẫn sai, khiến người ta đi soi component thay vì soi reducer. Một reducer phải trả về một object <em>mới</em>: <code>return { ...state, items: [...state.items, action.item] }</code>. Đây cũng là luật của <code>useState</code>, nhưng ở đây dễ phạm hơn vì reducer trông như một chỗ mà bạn &quot;được phép&quot; viết mã theo lối ra lệnh.</p></div>
<a class="link-card dl" href="https://react.dev/learn/extracting-state-logic-into-a-reducer" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">react.dev — Rút logic state ra thành reducer</span><span class="lc-sub">Phép tái cấu trúc từng bước từ vài useState thành một reducer.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useReducer" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">react.dev — Tra cứu useReducer</span><span class="lc-sub">Các chữ ký, khởi tạo lười, và yêu cầu về tính thuần khiết nói rõ ra.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chuyển một component có ba <code>useState</code> liên quan thành một <code>useReducer</code> với một union action có kiểu.</li>
<li>Dispatch hai action và xác nhận reducer là một hàm thuần của (state, action).</li>
<li>Viết một câu khi nào reducer thắng nhiều useState (chuyển trạng thái phức tạp, các trường liên quan).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn mô hình hoá được state liên quan bằng reducer và dispatch các action có kiểu.</p></div>

<h3>🔬 Đo thật: reducer trên một trang thật (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Reducer nằm ở tệp riêng và được test mà không cần React:</p>
<pre><code class="language-typescript">export type Dem = { n: number };
export type HanhDong = { type: 'inc' } | { type: 'add'; by: number };

export function demReducer(state: Dem, action: HanhDong): Dem {
  switch (action.type) {
    case 'inc': return { n: state.n + 1 };
    case 'add': return { n: state.n + action.by };
    default:    return state;
  }
}</code></pre><pre><code class="language-javascript">import { test } from 'node:test';
import assert from 'node:assert/strict';
import { demReducer } from './demReducer.ts';

test('inc → add 5 → inc, từ { n: 0 }', () =&gt; {
  let s = { n: 0 };
  s = demReducer(s, { type: 'inc' });
  s = demReducer(s, { type: 'add', by: 5 });
  s = demReducer(s, { type: 'inc' });
  console.log('REDUCER n=', s.n);
  assert.equal(s.n, 7);
});

test('thuần: không sửa state cũ', () =&gt; {
  const cu = { n: 1 };
  const moi = demReducer(cu, { type: 'inc' });
  assert.equal(cu.n, 1);
  assert.notEqual(moi, cu);
});</code></pre>
<p>Rồi một trang, bốn thí nghiệm — bộ đếm, reducer sửa thẳng vs trả object mới, ba useState vs một reducer có status:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useReducer, useState } from 'react';
import { demReducer } from '@/lib/demReducer';

<span class="tok-comment">// 1 — bộ đếm: component chỉ dispatch, reducer quyết định</span>
function BoDem() {
  const [state, dispatch] = useReducer(demReducer, { n: 0 });
  return (
    &lt;p&gt;
      &lt;button id="inc" onClick={() =&gt; dispatch({ type: 'inc' })} className="rounded border px-2"&gt;+1&lt;/button&gt;{' '}
      &lt;button id="add5" onClick={() =&gt; dispatch({ type: 'add', by: 5 })} className="rounded border px-2"&gt;+5&lt;/button&gt;{' '}
      n = &lt;b id="n"&gt;{state.n}&lt;/b&gt;
    &lt;/p&gt;
  );
}

<span class="tok-comment">// 2 — bẫy: sửa thẳng state trong reducer</span>
type Ds = { items: string[] };
const dem = { goiSai: 0, goiDung: 0 };
function dsSai(state: Ds, action: { type: 'add'; item: string }): Ds {
  dem.goiSai++;
  state.items.push(action.item);                       <span class="tok-comment">  // ✗ sửa thẳng object cũ</span>
  return state;                                        <span class="tok-comment">  // ✗ trả lại CHÍNH nó</span>
}
function dsDung(state: Ds, action: { type: 'add'; item: string }): Ds {
  dem.goiDung++;
  return { ...state, items: [...state.items, action.item] }; <span class="tok-comment">  // ✓ object mới</span>
}
const dau = { sai: { items: [] as string[] }, dung: { items: [] as string[] } };
function DanhSach() {
  const [sai, dSai] = useReducer(dsSai, dau.sai);
  const [dung, dDung] = useReducer(dsDung, dau.dung);
  const [, setVoCan] = useState(0);
  useEffect(() =&gt; { Object.assign(window, { __sai: sai, __dung: dung }); });
  return (
    &lt;p&gt;
      &lt;button id="them-sai" onClick={() =&gt; dSai({ type: 'add', item: 'sữa' })} className="rounded border px-2"&gt;thêm (sửa thẳng)&lt;/button&gt;{' '}
      &lt;button id="them-dung" onClick={() =&gt; dDung({ type: 'add', item: 'sữa' })} className="rounded border px-2"&gt;thêm (object mới)&lt;/button&gt;{' '}
      &lt;button id="vo-can" onClick={() =&gt; setVoCan((x) =&gt; x + 1)} className="rounded border px-2"&gt;render vô can&lt;/button&gt;{' '}
      màn hình: sửa thẳng &lt;b id="m-sai"&gt;{sai.items.length}&lt;/b&gt; · object mới &lt;b id="m-dung"&gt;{dung.items.length}&lt;/b&gt;
    &lt;/p&gt;
  );
}

<span class="tok-comment">// 3 — tổ hợp bất khả: ba mẩu state rời vs một reducer</span>
function TaiBool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState&lt;string | null&gt;(null);
  const [data, setData] = useState&lt;string | null&gt;(null);
  const tai = (hong: boolean) =&gt; {
    setLoading(true);                                  <span class="tok-comment">  // ✗ quên xoá error/data cũ</span>
    setTimeout(() =&gt; { if (hong) setError('mạng lỗi'); else setData('An'); setLoading(false); }, 400);
  };
  return (
    &lt;p&gt;
      &lt;button id="b-hong" onClick={() =&gt; tai(true)} className="rounded border px-2"&gt;tải (hỏng)&lt;/button&gt;{' '}
      &lt;button id="b-tai" onClick={() =&gt; tai(false)} className="rounded border px-2"&gt;tải&lt;/button&gt;{' '}
      3 useState: &lt;b id="b-hien"&gt;{loading &amp;&amp; 'đang tải… '}{error &amp;&amp; &#96;lỗi: \${error} &#96;}{data &amp;&amp; &#96;dữ liệu: \${data}&#96;}&lt;/b&gt;
    &lt;/p&gt;
  );
}
type TrangThai = { status: 'idle' } | { status: 'loading' } | { status: 'error'; error: string } | { status: 'ok'; data: string };
type Tai = { type: 'start' } | { type: 'fail'; error: string } | { type: 'done'; data: string };
const dauTai = { start: 0, boQua: 0 };
function taiReducer(s: TrangThai, a: Tai): TrangThai {
  switch (a.type) {
    case 'start':
      if (s.status === 'loading') { dauTai.boQua++; return s; } <span class="tok-comment">  // luật: đang tải thì bỏ qua</span>
      dauTai.start++; return { status: 'loading' };
    case 'fail': return { status: 'error', error: a.error };
    case 'done': return { status: 'ok', data: a.data };
  }
}
function TaiReducer() {
  const [s, dispatch] = useReducer(taiReducer, { status: 'idle' });
  const tai = (hong: boolean) =&gt; {
    dispatch({ type: 'start' });
    setTimeout(() =&gt; dispatch(hong ? { type: 'fail', error: 'mạng lỗi' } : { type: 'done', data: 'An' }), 400);
  };
  return (
    &lt;p&gt;
      &lt;button id="r-hong" onClick={() =&gt; tai(true)} className="rounded border px-2"&gt;tải (hỏng)&lt;/button&gt;{' '}
      &lt;button id="r-tai" onClick={() =&gt; tai(false)} className="rounded border px-2"&gt;tải&lt;/button&gt;{' '}
      reducer: &lt;b id="r-hien"&gt;{s.status === 'loading' ? 'đang tải…' : s.status === 'error' ? &#96;lỗi: \${s.error}&#96; : s.status === 'ok' ? &#96;dữ liệu: \${s.data}&#96; : '—'}&lt;/b&gt;
    &lt;/p&gt;
  );
}

if (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __dauTai: dauTai }); <span class="tok-comment">  // để đo</span>

export default function BoGiam() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;BoDem /&gt;
      &lt;DanhSach /&gt;
      &lt;TaiBool /&gt;
      &lt;TaiReducer /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ node --test src/lib/demReducer.test.mjs 2&gt;&amp;1 | grep -E 'REDUCER|^# (pass|fail)|^ok|^not ok'
# REDUCER n= 7
ok 1 - inc → add 5 → inc, từ { n: 0 }
ok 2 - thuần: không sửa state cũ
# pass 2
# fail 0
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|bo-giam'
✓ Compiled successfully in 347ms
├ ○ /bo-giam</div>
<p>Kiểu bắt được gì (một tệp thử, xoá ngay sau đó):</p>
<pre><code class="language-tsx">'use client';
import { useReducer } from 'react';
import { demReducer } from '@/lib/demReducer';

type TrangThai = { status: 'loading' } | { status: 'error'; error: string };
const t: TrangThai = { status: 'loading', error: 'x' };   <span class="tok-comment">  // tổ hợp bất khả</span>

export default function Sai() {
  const [state, dispatch] = useReducer(demReducer, { n: 0 });
  dispatch({ type: 'add' });                                <span class="tok-comment">  // quên by</span>
  dispatch({ type: 'incc' });                               <span class="tok-comment">  // gõ nhầm tên action</span>
  return &lt;p&gt;{state.n} {t.status}&lt;/p&gt;;
}</code></pre><div class="out">$ npx tsc --noEmit 2&gt;&amp;1 | grep -E 'error TS' | sed 's/^src.app.bo-giam-sai.//'
page.tsx(6,43): error TS2353: Object literal may only specify known properties, and 'error' does not exist in type '{ status: "loading"; }'.
page.tsx(10,12): error TS2345: Argument of type '{ type: "add"; }' is not assignable to parameter of type 'HanhDong'.
page.tsx(11,14): error TS2820: Type '"incc"' is not assignable to type '"inc" | "add"'. Did you mean '"inc"'?</div>
<p>Hai máy chủ, Chromium bấm:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /bo-giam → %{http_code}\\n' localhost:3001/bo-giam
next start GET /bo-giam → 200
$ curl -s -o /dev/null -w 'next dev   GET /bo-giam → %{http_code}\\n' localhost:3000/bo-giam
next dev   GET /bo-giam → 200

Chromium                                  next start              next dev
+1, +5, +1                              : n = 7                   n = 7
reducer sửa thẳng, 1 cú: dữ liệu · màn   : 1 · 0                   2 · 0
  số lần gọi reducer cho cú bấm đó       : 1                       2
  màn hình sau một render vô can         : 1                       2
reducer object mới: dữ liệu · màn · gọi  : 1 · 1 · 1               1 · 1 · 2
3 useState, hỏng rồi tải lại (đang tải) : đang tải… lỗi: mạng lỗi
3 useState (tải xong)                    : lỗi: mạng lỗi dữ liệu: An
reducer (đang tải → xong)                : đang tải… → dữ liệu: An
hai 'start' nhanh: nhận · bỏ qua         : 2 · 1                   4 · 2  (bộ đếm nằm trong reducer: nhân đôi ở dev)</div>
<p>Reducer sửa thẳng trả lại chính object cũ nên React bỏ qua: dữ liệu có món mới, màn hình thì không — tới lần render nào đó khác. Ở môi trường phát triển còn tệ hơn: React gọi reducer <b>hai lần</b> mỗi lần dispatch để bắt reducer không thuần (như effect chạy hai lần ở bài 5.3), nên một cú bấm đẩy món hàng vào hai lần. Reducer trả object mới cũng bị gọi hai lần mà vẫn đúng. Ngay cả một bộ đếm trong reducer cũng là tác dụng phụ: bộ đếm của ta nhân đôi. Còn ba useState thì hiện thật "đang tải" và "lỗi" cùng lúc — reducer có status thì không thể.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">node --test src/lib/demReducer.test.mjs
npm run build &amp;&amp; npx next start -p 3001 &amp;
npx next dev -p 3000
<span class="tok-comment"># /bo-giam ở cả hai: bấm "thêm (sửa thẳng)" một lần, rồi ở console: __sai.items.length, JSON.stringify(__dem)</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-5-2-reducer" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 5.2 — useReducer cho state phức tạp</span><span class="lc-sub">Hành động, reducer thuần và luồng đặt lịch bốn bước</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-2-usecontext-usereducer" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.2 — useContext & useReducer</span><span class="lc-sub">Bài môn học: hai hook đi cùng nhau</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-ex15-usereducer" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 15 — useReducer</span><span class="lc-sub">Bộ đếm và ngân hàng câu hỏi</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useReducer</span><span class="v">Quản state qua một reducer <code>(state, action) =&gt; newState</code>.</span></div>
  <div class="kv"><span class="k">Action</span><span class="v">Một object thuần mô tả điều đã xảy ra (<code>{ type, payload }</code>).</span></div>
  <div class="kv"><span class="k">dispatch</span><span class="v">Hàm bạn gọi để gửi một action tới reducer.</span></div>
  <div class="kv"><span class="k">Reducer thuần</span><span class="v">Tính state mới mà không có side effect.</span></div>
  <div class="kv"><span class="k">Chuyển trạng thái</span><span class="v">Reducer làm các thay đổi phức tạp, liên quan trở nên rõ ràng.</span></div>
  <div class="kv"><span class="k">so với useState</span><span class="v">Ưu tiên reducer khi nhiều trường đổi cùng nhau theo luật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>useReducer</code> gom state liên quan vào một reducer: <code>(state, action) =&gt; newState</code>.</li><li>Bạn <code>dispatch</code> các object action thuần; reducer giữ là một hàm thuần.</li><li>Nó làm các chuyển trạng thái phức tạp trở nên rõ ràng và test được.</li><li>Ưu tiên nó hơn nhiều <code>useState</code> khi nhiều trường đổi cùng nhau theo luật.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — useContext: data without prop drilling|||6.4 — useContext: dữ liệu không cần prop drilling',
      slug: 'nextjs-6-4-usecontext',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Context cho một cây component đọc một giá trị chung (theme, user) mà không phải truyền props qua từng tầng trung gian.',
      content: `
${G06_4}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Passing data to a whole subtree without threading it through</h2>
<p class="lead">Lifting state up (Chapter 3) is right until the state has to travel through many components that don't use it, just to forward it down — prop drilling. <code>useContext</code> lets a value be read by any component in a subtree directly, no matter how deep, without passing it as a prop at every level.</p>

<h3>The three steps</h3>
<pre><code class="language-typescript">// 1 · create a context
const ThemeContext = createContext('light');

// 2 · a provider makes a value available to everything inside it
function App() {
  const [theme, setTheme] = useState('dark');
  return (
    &lt;ThemeContext.Provider value={theme}&gt;
      &lt;Page /&gt;  <span class="tok-comment">{/* Page and everything under it can read theme */}</span>
    &lt;/ThemeContext.Provider&gt;
  );
}

// 3 · any descendant reads it — no props in between
function DeepButton() {
  const theme = useContext(ThemeContext);   <span class="tok-comment">// reads 'dark', however deep</span>
  return &lt;button className={theme}&gt;Click&lt;/button&gt;;
}</code></pre>
<p><code>DeepButton</code> could be ten layers below <code>App</code>; none of the components in between need to know <code>theme</code> exists. It reads the value from the nearest <code>Provider</code> above it in the tree. When the provider's <code>value</code> changes, every component reading that context re-renders.</p>

<h3>What context is for — and what it isn't</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Good fit</span><span class="v">app-wide, slowly-changing values many components need: the theme, the current user, the locale, a toast/notification API.</span></div>
  <div class="kv"><span class="k">Poor fit</span><span class="v">high-frequency state (a value that changes every keystroke) — every consumer re-renders on every change; and passing something one or two levels — plain props are simpler.</span></div>
</div>
<p>Context solves <em>distribution</em> (getting a value to where it's needed), not state management. It is often paired with <code>useReducer</code> or a store: the reducer/store holds and updates the state, context distributes it. For heavy or frequently-updated global state, a dedicated library (Zustand, Chapter 14) avoids context's "everyone re-renders" cost.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it</strong> — the site uses context for exactly the "good fit" cases: the auth/user context, the theme provider, and the Notes editor's own theme context (the <code>NotesThemeProvider</code> that scopes a light/dark/brown theme to the notes area). App-wide, low-frequency, read in many places — the textbook use. Fast-changing feature state lives in Zustand stores instead, precisely to avoid re-rendering half the tree on every update.</p>
</div>
<h3>Context, and the two mistakes around it</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It solves prop drilling, not state management</b> — Context is a transport: it moves a value down the tree without passing it through every level. It does not store or update anything by itself.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Create it with undefined</b> — <code>createContext&lt;Ctx | undefined&gt;(undefined)</code>, then a <code>useX()</code> hook that throws when there is no provider. The throw narrows the type for every consumer.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Every consumer re-renders on change</b> — When the provider&#39;s value changes, all consumers render — even the ones that only read a field that did not change.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>So split contexts by change rate</b> — A theme that changes twice a year and a cart that changes constantly do not belong in the same provider.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — an object literal as the provider value, re-rendering every consumer on every parent render.</strong> <code>&lt;Ctx.Provider value={{ user, logout }}&gt;</code> creates a new object each time the provider&#39;s own component renders, so context sees a changed value and re-renders every consumer in the subtree — even when <code>user</code> and <code>logout</code> are identical. In a provider near the root of the app, that is the whole tree, on every keystroke in an unrelated input. The fix is <code>useMemo(() =&gt; ({ user, logout }), [user, logout])</code>. This is one of the few places where memoisation is not premature: the cost is real and the fix is mechanical.</p></div>
<a class="link-card dl" href="https://react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Passing data deeply with context</span><span class="lc-sub">When context is the right answer, and the alternatives to try first.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">react.dev — Optimizing context re-renders</span><span class="lc-sub">The memoised-value pattern, straight from the docs.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Create a <code>ThemeContext</code>, wrap part of the tree in its Provider, and read it deep down with <code>useContext</code>.</li>
<li>Show that updating the provider value re-renders all consumers.</li>
<li>Explain why context is for low-frequency global data (theme, user), not high-frequency state.</li>
</ol>
<p><strong>Done when:</strong> you can provide and consume context and know what it is and is not for.</p></div>

<h3>🔬 Measured: context on a real page (React 19.3.0 · Next.js 16.4.6)</h3>
<p>A <code>useAuth</code> hook that throws without a provider, and two providers that differ only in how they build <code>value</code>:</p>
<pre><code class="language-tsx">'use client';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type Auth = { user: string; logout: () =&gt; void };
const AuthCtx = createContext&lt;Auth | undefined&gt;(undefined);

export function useAuth() {
  const v = useContext(AuthCtx);
  if (!v) throw new Error('useAuth phải nằm trong &lt;AuthProvider&gt;');
  return v;                                            <span class="tok-comment">  // từ đây v là Auth, hết undefined</span>
}

export function AuthLiteral({ children }: { children: ReactNode }) {
  const [q, setQ] = useState('');
  const logout = useCallback(() =&gt; {}, []);
  return (
    &lt;AuthCtx value={{ user: 'An', logout }}&gt;             {/* ✗ object mới mỗi lần render */}
      &lt;input id="q-lit" value={q} onChange={(e) =&gt; setQ(e.target.value)} placeholder="gõ ở provider (viết thẳng)" className="rounded border px-1" /&gt;
      {children}
    &lt;/AuthCtx&gt;
  );
}

export function AuthMemo({ children }: { children: ReactNode }) {
  const [q, setQ] = useState('');
  const logout = useCallback(() =&gt; {}, []);
  const value = useMemo(() =&gt; ({ user: 'An', logout }), [logout]); <span class="tok-comment">  // ✓ cùng object khi không đổi</span>
  return (
    &lt;AuthCtx value={value}&gt;
      &lt;input id="q-memo" value={q} onChange={(e) =&gt; setQ(e.target.value)} placeholder="gõ ở provider (useMemo)" className="rounded border px-1" /&gt;
      {children}
    &lt;/AuthCtx&gt;
  );
}</code></pre>
<p>The page: the lesson's three-step snippet copied exactly as it was written (section 1), React 19's <code>&lt;Ctx value&gt;</code> behind a <code>memo</code> middle layer, the two auth providers, and one combined vs two split providers:</p>
<pre><code class="language-tsx">'use client';
import { createContext, memo, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthLiteral, AuthMemo, useAuth } from '@/lib/auth';

const render: Record&lt;string, number&gt; = {};
function useDemRender(ten: string) {                    <span class="tok-comment">  // đếm lần render đã commit</span>
  useEffect(() =&gt; { render[ten] = (render[ten] ?? 0) + 1; });
}

<span class="tok-comment">// 1 — chép NGUYÊN đoạn mã của bài web</span>
const ThemeContext = createContext('light');
function App() {
  const [theme, setTheme] = useState('dark');
  return (
    &lt;ThemeContext.Provider value={theme}&gt;
      &lt;Page /&gt;            <span class="tok-comment">  // Page and everything under it can read theme</span>
    &lt;/ThemeContext.Provider&gt;
  );
}
function Page() { return &lt;DeepButton /&gt;; }
function DeepButton() {
  const theme = useContext(ThemeContext); <span class="tok-comment">  // reads 'dark', however deep</span>
  return &lt;button className={theme}&gt;Click&lt;/button&gt;;
}

<span class="tok-comment">// 2 — React 19: &lt;Ctx value&gt; (không cần .Provider); context đi vòng qua tầng giữa</span>
const Theme = createContext&lt;'sáng' | 'tối'&gt;('sáng');
const TangGiua = memo(function TangGiua() {
  useDemRender('tangGiua');
  return &lt;span className="pl-2"&gt;tầng giữa → &lt;NutSau /&gt;&lt;/span&gt;;
});
function NutSau() {
  const t = useContext(Theme);
  useDemRender('nutSau');
  return &lt;b id="nut-sau"&gt;{t}&lt;/b&gt;;
}
function ThemeDemo() {
  const [t, setT] = useState&lt;'sáng' | 'tối'&gt;('sáng');
  return (
    &lt;Theme value={t}&gt;
      &lt;p&gt;&lt;button id="doi-theme" onClick={() =&gt; setT(t === 'sáng' ? 'tối' : 'sáng')} className="rounded border px-2"&gt;đổi theme&lt;/button&gt;&lt;TangGiua /&gt;&lt;/p&gt;
    &lt;/Theme&gt;
  );
}

<span class="tok-comment">// 3 — giá trị provider: object viết thẳng vs useMemo</span>
function TenNguoiDung({ ten }: { ten: string }) {
  const { user } = useAuth();
  useDemRender(ten);
  return &lt;b className="px-2"&gt;{user}&lt;/b&gt;;
}

<span class="tok-comment">// 4 — một provider gộp theme + giỏ hàng, hay tách hai</span>
type Gop = { theme: string; gio: number; them: () =&gt; void };
const GopCtx = createContext&lt;Gop&gt;({ theme: 'sáng', gio: 0, them: () =&gt; {} });
function GopProvider({ children }: { children: ReactNode }) {
  const [gio, setGio] = useState(0);
  const value = useMemo(() =&gt; ({ theme: 'sáng', gio, them: () =&gt; setGio((g) =&gt; g + 1) }), [gio]);
  return &lt;GopCtx value={value}&gt;{children}&lt;/GopCtx&gt;;
}
function ThemeGop() { const { theme } = useContext(GopCtx); useDemRender('themeGop'); return &lt;span&gt;{theme}&lt;/span&gt;; }
function GioGop() { const { gio, them } = useContext(GopCtx); return &lt;button id="gio-gop" onClick={them} className="rounded border px-2"&gt;giỏ: {gio}&lt;/button&gt;; }

const ThemeCtx = createContext('sáng');
const GioCtx = createContext({ gio: 0, them: () =&gt; {} });
function TachProvider({ children }: { children: ReactNode }) {
  const [gio, setGio] = useState(0);
  const gioV = useMemo(() =&gt; ({ gio, them: () =&gt; setGio((g) =&gt; g + 1) }), [gio]);
  return &lt;ThemeCtx value="sáng"&gt;&lt;GioCtx value={gioV}&gt;{children}&lt;/GioCtx&gt;&lt;/ThemeCtx&gt;;
}
function ThemeTach() { const theme = useContext(ThemeCtx); useDemRender('themeTach'); return &lt;span&gt;{theme}&lt;/span&gt;; }
function GioTach() { const { gio, them } = useContext(GioCtx); return &lt;button id="gio-tach" onClick={them} className="rounded border px-2"&gt;giỏ: {gio}&lt;/button&gt;; }

if (typeof window !== 'undefined') Object.assign(window, { __render: render }); <span class="tok-comment">  // để đo</span>

export default function NguCanh() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;div id="web" className="rounded border p-2"&gt;&lt;App /&gt;&lt;/div&gt;
      &lt;ThemeDemo /&gt;
      &lt;AuthLiteral&gt;&lt;span&gt;viết thẳng:&lt;TenNguoiDung ten="lit" /&gt;&lt;/span&gt;&lt;/AuthLiteral&gt;
      &lt;AuthMemo&gt;&lt;span&gt;useMemo:&lt;TenNguoiDung ten="memo" /&gt;&lt;/span&gt;&lt;/AuthMemo&gt;
      &lt;GopProvider&gt;&lt;p&gt;gộp: theme &lt;ThemeGop /&gt; · &lt;GioGop /&gt;&lt;/p&gt;&lt;/GopProvider&gt;
      &lt;TachProvider&gt;&lt;p&gt;tách: theme &lt;ThemeTach /&gt; · &lt;GioTach /&gt;&lt;/p&gt;&lt;/TachProvider&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|ngu-canh'
✓ Compiled successfully in 1046ms
├ ○ /ngu-canh
$ npx eslint -f json src/app/ngu-canh/page.tsx | node tom-eslint.cjs
13:17 warn  @typescript-eslint/no-unused-vars — 'setTheme' is assigned a value but never used.
16:15 error react/jsx-no-comment-textnodes — Comments inside children section of tag should be placed inside braces</div>
<p>Both <code>&lt;ThemeContext.Provider&gt;</code> (section 1) and <code>&lt;Theme value&gt;</code> (section 2) work on React 19.3. Driven by Chromium on <code>next start</code>:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /ngu-canh → %{http_code}\\n' localhost:3001/ngu-canh
next start GET /ngu-canh → 200

the lesson snippet, copied as written : #web shows "Click              // Page and everything under it can read theme"
click "đổi theme" once               : memo middle layer 1 render · consumer 2 (now "tối")
type "abc" in the provider's input   : value={{…}} 4 renders · useMemo 1
3 clicks on the cart                 : theme-only consumer: combined provider 4 · split 1</div>
<p>Note the first line: between JSX tags, <code>//</code> is <b>not</b> a comment — the snippet put the words on the page, tsc and <code>next build</code> stayed green, and only ESLint (<code>react/jsx-no-comment-textnodes</code>) objected. The snippet above now uses <code>{/* … */}</code>. The other numbers are the lesson's claims, measured: the context change went straight past the memo layer; the object literal re-rendered the consumer on every keystroke; the combined provider re-rendered a theme-only reader on every cart click.</p>
<h4>Two failures you should see once</h4>
<p>A page that calls <code>useAuth()</code> with no provider fails <code>next build</code> while prerendering — with our own message:</p>
<pre><code class="language-tsx">'use client';
import { useAuth } from '@/lib/auth';

export default function Thieu() {
  const { user } = useAuth();                           <span class="tok-comment">  // ✗ không có AuthProvider bên trên</span>
  return &lt;p&gt;{user}&lt;/p&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Error occurred|useAuth phải|Export encountered|Next.js build worker'
Error occurred prerendering page "/ngu-canh/thieu". Read more: https://nextjs.org/docs/messages/prerender-error
Error: useAuth phải nằm trong &lt;AuthProvider&gt;
&gt;  9 |   if (!v) throw new Error('useAuth phải nằm trong &lt;AuthProvider&gt;');
Export encountered an error on /ngu-canh/thieu/page: /ngu-canh/thieu, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null</div>
<p>And in the App Router, context is <b>client-only</b>: a Server Component that imports <code>createContext</code> does not build. The usual pattern is one <code>'use client'</code> <code>Providers</code> component that wraps <code>{children}</code> in the root layout — the pages inside can stay Server Components (Chapter 9).</p>
<pre><code class="language-tsx">import { createContext, useContext } from 'react';    <span class="tok-comment">  // ✗ Server Component (không 'use client')</span>

const Ctx = createContext('sáng');
export default function Sv() {
  const t = useContext(Ctx);
  return &lt;p&gt;{t}&lt;/p&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -vE '^\\s*$' | sed -n '/rror/,+6p' | head -14
&gt; Build error occurred
Error: Turbopack build failed with 1 error:
./src/app/ngu-canh/sv/page.tsx:1:10
Error: You're importing a module that depends on &#96;createContext&#96; into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the &#96;"use client"&#96; directive.
    Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client
&gt; 1 | import { createContext, useContext } from 'react';      // ✗ Server Component (không 'use c...
    |          ^^^^^^^^^^^^^
Ecmascript file had an error
    at ignore-listed frames
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|ngu-canh'
✓ Compiled successfully in 441ms
├ ○ /ngu-canh</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># localhost:3001/ngu-canh → click / type, then in the console: JSON.stringify(__render)</span>
npx eslint src/app/ngu-canh/page.tsx</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-5-1-context" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 5.1 — Context without mass re-renders</span><span class="lc-sub">Provider, a throwing hook, counted renders</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-7-1-context" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 7.1 — Context</span><span class="lc-sub">The subject lesson on context</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-ex14-usecontext" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 14 — useContext</span><span class="lc-sub">A theme with useContext</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Context</span><span class="v">A way to share a value with a subtree without prop drilling.</span></div>
  <div class="kv"><span class="k">Provider</span><span class="v">Wraps the subtree and supplies the context value.</span></div>
  <div class="kv"><span class="k">useContext</span><span class="v">Reads the nearest provider's value.</span></div>
  <div class="kv"><span class="k">Prop drilling</span><span class="v">The problem context solves: passing props through layers.</span></div>
  <div class="kv"><span class="k">Consumer re-render</span><span class="v">Updating the value re-renders every consumer.</span></div>
  <div class="kv"><span class="k">Good fit</span><span class="v">Low-frequency global data: theme, locale, current user.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Context shares a value with a subtree without passing props through every layer.</li><li>A Provider supplies the value; <code>useContext</code> reads the nearest one.</li><li>Updating the context value re-renders all consumers — keep it for low-frequency data.</li><li>Use it for theme, locale and the current user, not for fast-changing state.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Trao dữ liệu cho cả một nhánh cây mà không xâu qua từng tầng</h2>
<p class="lead">Nâng state lên (Chương 3) đúng cho tới khi state phải đi qua nhiều component không dùng nó, chỉ để chuyển tiếp xuống — prop drilling. <code>useContext</code> cho một giá trị được đọc bởi bất kỳ component nào trong một nhánh cây một cách trực tiếp, dù sâu tới đâu, mà không truyền nó làm prop ở mỗi tầng.</p>

<h3>Ba bước</h3>
<pre><code class="language-typescript">// 1 · tạo một context
const ThemeContext = createContext('light');

// 2 · một provider làm một giá trị khả dụng cho mọi thứ bên trong nó
function App() {
  const [theme, setTheme] = useState('dark');
  return (
    &lt;ThemeContext.Provider value={theme}&gt;
      &lt;Page /&gt;  <span class="tok-comment">{/* Page và mọi thứ dưới nó đọc được theme */}</span>
    &lt;/ThemeContext.Provider&gt;
  );
}

// 3 · bất kỳ hậu duệ nào đọc nó — không cần props ở giữa
function DeepButton() {
  const theme = useContext(ThemeContext);   <span class="tok-comment">// đọc 'dark', dù sâu tới đâu</span>
  return &lt;button className={theme}&gt;Click&lt;/button&gt;;
}</code></pre>
<p><code>DeepButton</code> có thể nằm mười tầng dưới <code>App</code>; không component nào ở giữa cần biết <code>theme</code> tồn tại. Nó đọc giá trị từ <code>Provider</code> gần nhất phía trên nó trong cây. Khi <code>value</code> của provider đổi, mọi component đọc context đó render lại.</p>

<h3>Context để làm gì — và không để làm gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hợp</span><span class="v">giá trị toàn app, đổi chậm, nhiều component cần: theme, người dùng hiện tại, ngôn ngữ, một API toast/thông báo.</span></div>
  <div class="kv"><span class="k">Không hợp</span><span class="v">state tần suất cao (một giá trị đổi mỗi phím gõ) — mọi consumer render lại ở mỗi thay đổi; và truyền thứ gì đó một hai tầng — props thuần đơn giản hơn.</span></div>
</div>
<p>Context giải quyết <em>việc phân phối</em> (đưa một giá trị tới nơi cần), không phải quản lý state. Nó thường ghép với <code>useReducer</code> hay một store: reducer/store giữ và cập nhật state, context phân phối nó. Với state toàn cục nặng hay cập nhật thường xuyên, một thư viện chuyên dụng (Zustand, Chương 14) tránh được cái giá "mọi người render lại" của context.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào</strong> — site dùng context đúng các ca "hợp": context xác thực/người dùng, provider theme, và context theme riêng của trình soạn Notes (<code>NotesThemeProvider</code> khoanh theme sáng/tối/nâu cho khu ghi chú). Toàn app, tần suất thấp, đọc ở nhiều nơi — đúng bài bản. State tính năng đổi nhanh thì nằm trong các store Zustand, chính xác để tránh render lại nửa cây ở mỗi cập nhật.</p>
</div>
<h3>Context, và hai sai lầm quanh nó</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó giải bài toán prop drilling, không phải quản lý state</b> — Context là một phương tiện vận chuyển: nó đưa một giá trị xuống cây mà không phải truyền qua từng tầng. Tự nó chẳng lưu hay cập nhật gì cả.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Hãy tạo nó với undefined</b> — <code>createContext&lt;Ctx | undefined&gt;(undefined)</code>, rồi một hook <code>useX()</code> ném lỗi khi không có provider. Phép ném lỗi đó thu hẹp kiểu cho mọi chỗ tiêu thụ.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Mọi chỗ tiêu thụ đều render lại khi giá trị đổi</b> — Khi giá trị của provider đổi, toàn bộ chỗ tiêu thụ đều render — kể cả những chỗ chỉ đọc một field chẳng hề đổi.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nên hãy chia context theo tốc độ thay đổi</b> — Một chủ đề giao diện đổi hai lần một năm và một giỏ hàng đổi liên tục thì không thuộc về cùng một provider.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một object viết thẳng làm giá trị của provider, render lại mọi chỗ tiêu thụ ở mỗi lần cha render.</strong> <code>&lt;Ctx.Provider value={{ user, logout }}&gt;</code> tạo một object mới mỗi khi chính component chứa provider render, nên context thấy giá trị đã đổi và render lại mọi chỗ tiêu thụ trong cây con — kể cả khi <code>user</code> và <code>logout</code> y hệt nhau. Với một provider gần gốc ứng dụng thì đó là cả cái cây, ở mỗi lần gõ phím trong một ô nhập chẳng liên quan. Cách chữa là <code>useMemo(() =&gt; ({ user, logout }), [user, logout])</code>. Đây là một trong số ít chỗ mà việc ghi nhớ không hề là quá sớm: chi phí là thật và cách chữa thì máy móc.</p></div>
<a class="link-card dl" href="https://react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Truyền dữ liệu xuống sâu bằng context</span><span class="lc-sub">Khi nào context là câu trả lời đúng, và những phương án nên thử trước.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">react.dev — Tối ưu việc render lại của context</span><span class="lc-sub">Mẫu giá trị đã ghi nhớ, lấy thẳng từ tài liệu.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo một <code>ThemeContext</code>, bọc một phần cây trong Provider của nó, và đọc nó ở sâu bằng <code>useContext</code>.</li>
<li>Cho thấy cập nhật giá trị provider khiến mọi consumer render lại.</li>
<li>Giải thích vì sao context dành cho dữ liệu toàn cục ít đổi (theme, user), không phải state đổi liên tục.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cung cấp và tiêu thụ được context và biết nó dùng cho gì, không dùng cho gì.</p></div>

<h3>🔬 Đo thật: context trên một trang thật (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Một hook <code>useAuth</code> ném lỗi khi thiếu provider, và hai provider chỉ khác nhau ở cách dựng <code>value</code>:</p>
<pre><code class="language-tsx">'use client';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type Auth = { user: string; logout: () =&gt; void };
const AuthCtx = createContext&lt;Auth | undefined&gt;(undefined);

export function useAuth() {
  const v = useContext(AuthCtx);
  if (!v) throw new Error('useAuth phải nằm trong &lt;AuthProvider&gt;');
  return v;                                            <span class="tok-comment">  // từ đây v là Auth, hết undefined</span>
}

export function AuthLiteral({ children }: { children: ReactNode }) {
  const [q, setQ] = useState('');
  const logout = useCallback(() =&gt; {}, []);
  return (
    &lt;AuthCtx value={{ user: 'An', logout }}&gt;             {/* ✗ object mới mỗi lần render */}
      &lt;input id="q-lit" value={q} onChange={(e) =&gt; setQ(e.target.value)} placeholder="gõ ở provider (viết thẳng)" className="rounded border px-1" /&gt;
      {children}
    &lt;/AuthCtx&gt;
  );
}

export function AuthMemo({ children }: { children: ReactNode }) {
  const [q, setQ] = useState('');
  const logout = useCallback(() =&gt; {}, []);
  const value = useMemo(() =&gt; ({ user: 'An', logout }), [logout]); <span class="tok-comment">  // ✓ cùng object khi không đổi</span>
  return (
    &lt;AuthCtx value={value}&gt;
      &lt;input id="q-memo" value={q} onChange={(e) =&gt; setQ(e.target.value)} placeholder="gõ ở provider (useMemo)" className="rounded border px-1" /&gt;
      {children}
    &lt;/AuthCtx&gt;
  );
}</code></pre>
<p>Trang đo: đoạn mã ba bước của bài chép nguyên như đã viết (mục 1), <code>&lt;Ctx value&gt;</code> của React 19 sau một tầng giữa bọc <code>memo</code>, hai provider đăng nhập, và một provider gộp so với hai provider tách:</p>
<pre><code class="language-tsx">'use client';
import { createContext, memo, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthLiteral, AuthMemo, useAuth } from '@/lib/auth';

const render: Record&lt;string, number&gt; = {};
function useDemRender(ten: string) {                    <span class="tok-comment">  // đếm lần render đã commit</span>
  useEffect(() =&gt; { render[ten] = (render[ten] ?? 0) + 1; });
}

<span class="tok-comment">// 1 — chép NGUYÊN đoạn mã của bài web</span>
const ThemeContext = createContext('light');
function App() {
  const [theme, setTheme] = useState('dark');
  return (
    &lt;ThemeContext.Provider value={theme}&gt;
      &lt;Page /&gt;            <span class="tok-comment">  // Page and everything under it can read theme</span>
    &lt;/ThemeContext.Provider&gt;
  );
}
function Page() { return &lt;DeepButton /&gt;; }
function DeepButton() {
  const theme = useContext(ThemeContext); <span class="tok-comment">  // reads 'dark', however deep</span>
  return &lt;button className={theme}&gt;Click&lt;/button&gt;;
}

<span class="tok-comment">// 2 — React 19: &lt;Ctx value&gt; (không cần .Provider); context đi vòng qua tầng giữa</span>
const Theme = createContext&lt;'sáng' | 'tối'&gt;('sáng');
const TangGiua = memo(function TangGiua() {
  useDemRender('tangGiua');
  return &lt;span className="pl-2"&gt;tầng giữa → &lt;NutSau /&gt;&lt;/span&gt;;
});
function NutSau() {
  const t = useContext(Theme);
  useDemRender('nutSau');
  return &lt;b id="nut-sau"&gt;{t}&lt;/b&gt;;
}
function ThemeDemo() {
  const [t, setT] = useState&lt;'sáng' | 'tối'&gt;('sáng');
  return (
    &lt;Theme value={t}&gt;
      &lt;p&gt;&lt;button id="doi-theme" onClick={() =&gt; setT(t === 'sáng' ? 'tối' : 'sáng')} className="rounded border px-2"&gt;đổi theme&lt;/button&gt;&lt;TangGiua /&gt;&lt;/p&gt;
    &lt;/Theme&gt;
  );
}

<span class="tok-comment">// 3 — giá trị provider: object viết thẳng vs useMemo</span>
function TenNguoiDung({ ten }: { ten: string }) {
  const { user } = useAuth();
  useDemRender(ten);
  return &lt;b className="px-2"&gt;{user}&lt;/b&gt;;
}

<span class="tok-comment">// 4 — một provider gộp theme + giỏ hàng, hay tách hai</span>
type Gop = { theme: string; gio: number; them: () =&gt; void };
const GopCtx = createContext&lt;Gop&gt;({ theme: 'sáng', gio: 0, them: () =&gt; {} });
function GopProvider({ children }: { children: ReactNode }) {
  const [gio, setGio] = useState(0);
  const value = useMemo(() =&gt; ({ theme: 'sáng', gio, them: () =&gt; setGio((g) =&gt; g + 1) }), [gio]);
  return &lt;GopCtx value={value}&gt;{children}&lt;/GopCtx&gt;;
}
function ThemeGop() { const { theme } = useContext(GopCtx); useDemRender('themeGop'); return &lt;span&gt;{theme}&lt;/span&gt;; }
function GioGop() { const { gio, them } = useContext(GopCtx); return &lt;button id="gio-gop" onClick={them} className="rounded border px-2"&gt;giỏ: {gio}&lt;/button&gt;; }

const ThemeCtx = createContext('sáng');
const GioCtx = createContext({ gio: 0, them: () =&gt; {} });
function TachProvider({ children }: { children: ReactNode }) {
  const [gio, setGio] = useState(0);
  const gioV = useMemo(() =&gt; ({ gio, them: () =&gt; setGio((g) =&gt; g + 1) }), [gio]);
  return &lt;ThemeCtx value="sáng"&gt;&lt;GioCtx value={gioV}&gt;{children}&lt;/GioCtx&gt;&lt;/ThemeCtx&gt;;
}
function ThemeTach() { const theme = useContext(ThemeCtx); useDemRender('themeTach'); return &lt;span&gt;{theme}&lt;/span&gt;; }
function GioTach() { const { gio, them } = useContext(GioCtx); return &lt;button id="gio-tach" onClick={them} className="rounded border px-2"&gt;giỏ: {gio}&lt;/button&gt;; }

if (typeof window !== 'undefined') Object.assign(window, { __render: render }); <span class="tok-comment">  // để đo</span>

export default function NguCanh() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;div id="web" className="rounded border p-2"&gt;&lt;App /&gt;&lt;/div&gt;
      &lt;ThemeDemo /&gt;
      &lt;AuthLiteral&gt;&lt;span&gt;viết thẳng:&lt;TenNguoiDung ten="lit" /&gt;&lt;/span&gt;&lt;/AuthLiteral&gt;
      &lt;AuthMemo&gt;&lt;span&gt;useMemo:&lt;TenNguoiDung ten="memo" /&gt;&lt;/span&gt;&lt;/AuthMemo&gt;
      &lt;GopProvider&gt;&lt;p&gt;gộp: theme &lt;ThemeGop /&gt; · &lt;GioGop /&gt;&lt;/p&gt;&lt;/GopProvider&gt;
      &lt;TachProvider&gt;&lt;p&gt;tách: theme &lt;ThemeTach /&gt; · &lt;GioTach /&gt;&lt;/p&gt;&lt;/TachProvider&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|ngu-canh'
✓ Compiled successfully in 1046ms
├ ○ /ngu-canh
$ npx eslint -f json src/app/ngu-canh/page.tsx | node tom-eslint.cjs
13:17 warn  @typescript-eslint/no-unused-vars — 'setTheme' is assigned a value but never used.
16:15 error react/jsx-no-comment-textnodes — Comments inside children section of tag should be placed inside braces</div>
<p>Cả <code>&lt;ThemeContext.Provider&gt;</code> (mục 1) lẫn <code>&lt;Theme value&gt;</code> (mục 2) đều chạy trên React 19.3. Chromium bấm trên <code>next start</code>:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /ngu-canh → %{http_code}\\n' localhost:3001/ngu-canh
next start GET /ngu-canh → 200

đoạn mã của bài, chép nguyên          : #web shows "Click              // Page and everything under it can read theme"
bấm "đổi theme" một lần              : tầng giữa memo 1 render · chỗ đọc 2 (giờ "tối")
gõ "abc" vào ô nằm trong provider     : value={{…}} 4 lần render · useMemo 1
bấm giỏ 3 lần                         : chỗ chỉ đọc theme: provider gộp 4 · tách 1</div>
<p>Để ý dòng đầu: giữa các thẻ JSX, <code>//</code> <b>không</b> phải chú thích — đoạn mã đã in nguyên câu lên trang, tsc và <code>next build</code> vẫn xanh, chỉ ESLint (<code>react/jsx-no-comment-textnodes</code>) phản đối. Đoạn mã ở trên đã đổi sang <code>{/* … */}</code>. Các con số còn lại là lời của bài, đã đo: thay đổi context đi thẳng qua tầng memo; object viết thẳng làm chỗ đọc render lại mỗi phím gõ; provider gộp làm chỗ chỉ đọc theme render lại mỗi cú bấm giỏ.</p>
<h4>Hai lỗi bạn nên thấy tận mắt một lần</h4>
<p>Một trang gọi <code>useAuth()</code> mà không có provider làm <code>next build</code> thất bại lúc dựng sẵn trang — với đúng câu báo lỗi của ta:</p>
<pre><code class="language-tsx">'use client';
import { useAuth } from '@/lib/auth';

export default function Thieu() {
  const { user } = useAuth();                           <span class="tok-comment">  // ✗ không có AuthProvider bên trên</span>
  return &lt;p&gt;{user}&lt;/p&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Error occurred|useAuth phải|Export encountered|Next.js build worker'
Error occurred prerendering page "/ngu-canh/thieu". Read more: https://nextjs.org/docs/messages/prerender-error
Error: useAuth phải nằm trong &lt;AuthProvider&gt;
&gt;  9 |   if (!v) throw new Error('useAuth phải nằm trong &lt;AuthProvider&gt;');
Export encountered an error on /ngu-canh/thieu/page: /ngu-canh/thieu, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null</div>
<p>Và trong App Router, context <b>chỉ chạy ở client</b>: một Server Component import <code>createContext</code> là build không qua. Mẫu thường dùng là một component <code>Providers</code> có <code>'use client'</code>, bọc <code>{children}</code> trong layout gốc — các trang bên trong vẫn là Server Component được (Chương 9).</p>
<pre><code class="language-tsx">import { createContext, useContext } from 'react';    <span class="tok-comment">  // ✗ Server Component (không 'use client')</span>

const Ctx = createContext('sáng');
export default function Sv() {
  const t = useContext(Ctx);
  return &lt;p&gt;{t}&lt;/p&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -vE '^\\s*$' | sed -n '/rror/,+6p' | head -14
&gt; Build error occurred
Error: Turbopack build failed with 1 error:
./src/app/ngu-canh/sv/page.tsx:1:10
Error: You're importing a module that depends on &#96;createContext&#96; into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the &#96;"use client"&#96; directive.
    Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client
&gt; 1 | import { createContext, useContext } from 'react';      // ✗ Server Component (không 'use c...
    |          ^^^^^^^^^^^^^
Ecmascript file had an error
    at ignore-listed frames
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|ngu-canh'
✓ Compiled successfully in 441ms
├ ○ /ngu-canh</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># localhost:3001/ngu-canh → bấm / gõ, rồi ở console: JSON.stringify(__render)</span>
npx eslint src/app/ngu-canh/page.tsx</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-5-1-context" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 5.1 — Context mà không render lại ồ ạt</span><span class="lc-sub">Provider, hook báo lỗi, đo số lần render</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-7-1-context" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 7.1 — Context</span><span class="lc-sub">Bài môn học về context</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-ex14-usecontext" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 14 — useContext</span><span class="lc-sub">Bài tập theme bằng useContext</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Context</span><span class="v">Cách chia sẻ một giá trị cho một cây con mà không prop drilling.</span></div>
  <div class="kv"><span class="k">Provider</span><span class="v">Bọc cây con và cung cấp giá trị context.</span></div>
  <div class="kv"><span class="k">useContext</span><span class="v">Đọc giá trị của provider gần nhất.</span></div>
  <div class="kv"><span class="k">Prop drilling</span><span class="v">Vấn đề context giải quyết: truyền prop qua nhiều tầng.</span></div>
  <div class="kv"><span class="k">Consumer render lại</span><span class="v">Cập nhật giá trị khiến mọi consumer render lại.</span></div>
  <div class="kv"><span class="k">Hợp dùng</span><span class="v">Dữ liệu toàn cục ít đổi: theme, ngôn ngữ, người dùng hiện tại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Context chia sẻ một giá trị cho một cây con mà không truyền prop qua mọi tầng.</li><li>Một Provider cấp giá trị; <code>useContext</code> đọc cái gần nhất.</li><li>Cập nhật giá trị context khiến mọi consumer render lại — hãy giữ nó cho dữ liệu ít đổi.</li><li>Dùng cho theme, ngôn ngữ và người dùng hiện tại, không cho state đổi nhanh.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — Custom hooks: extracting reusable logic|||6.5 — Hook tự viết: gói lại logic tái dùng',
      slug: 'nextjs-6-5-custom-hooks',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Một hàm bắt đầu bằng "use" gọi các hook khác là một custom hook — cách chia sẻ logic có state giữa các component.',
      content: `
${G06_5}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Your own hooks: naming and reusing stateful logic</h2>
<p class="lead">A custom hook is just a function whose name starts with <code>use</code> and that calls other hooks. That's the entire concept. It lets you take a chunk of stateful logic — an effect plus some state — out of a component, name it, and reuse it, without any new React feature.</p>

<h3>From duplicated logic to a named hook</h3>
<p>Say two components both track the window width. Instead of copying the effect, extract it:</p>
<pre><code class="language-typescript">function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() =&gt; {
    const onResize = () =&gt; setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () =&gt; window.removeEventListener('resize', onResize);   <span class="tok-comment">// cleanup, of course</span>
  }, []);
  return width;
}

<span class="tok-comment">// now any component is one line:</span>
function Header() {
  const width = useWindowWidth();
  return &lt;nav&gt;{width &lt; 768 ? &lt;Menu /&gt; : &lt;FullNav /&gt;}&lt;/nav&gt;;
}</code></pre>
<div class="pitfall"><p><strong>In Next.js this exact snippet breaks <code>next build</code>.</strong> Measured below: in a <code>'use client'</code> page, tsc is green but the build stops with <code>ReferenceError: window is not defined</code> — Next.js prerenders client components on the server too, and <code>useState(window.innerWidth)</code> runs there. The Next-safe version (<code>useSyncExternalStore</code> with a server snapshot) is in the 🔬 section.</p></div>
<p>The logic now has a name that says what it does, lives in one place, and is tested once. Common real hooks look exactly like this: <code>useLocalStorage</code>, <code>useDebounce</code>, <code>useFetch</code>, <code>useMediaQuery</code>, <code>useOnClickOutside</code>.</p>

<h3>What makes it a hook (and the rules that follow)</h3>
<p>Two things make a function a custom hook: the <code>use</code> prefix, and that it calls other hooks. Both matter. The <code>use</code> prefix is how React (and the linter) know the Rules of Hooks apply — so it must be called at the top level of a component or another hook, never conditionally. Because it calls hooks, it is not a plain utility function; you cannot call it in a loop or an <code>if</code>.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Each call is independent</span><span class="v">two components calling <code>useWindowWidth()</code> get their own separate state. A hook shares <em>logic</em>, not state — it is not a global.</span></div>
  <div class="kv"><span class="k">Compose freely</span><span class="v">a custom hook can call useState, useEffect, useRef, and other custom hooks. This is how you build up capability from small pieces.</span></div>
  <div class="kv"><span class="k">Name it for what it does</span><span class="v"><code>useUser</code>, <code>useCart</code>, <code>useInterval</code> — the name is documentation.</span></div>
</div>

<h3>The judgement: extract when it earns it</h3>
<p>Don't extract a hook just because you can — a one-line <code>useState</code> doesn't need wrapping. Extract when logic is <em>duplicated</em> across components, when it's complex enough to deserve a name and a test, or when hiding it makes the component read better. This is the same "does it earn its existence?" test as components in Chapter 2, applied to logic instead of UI.</p>

<div class="callout ok">
<p><strong>The hooks toolbox, complete.</strong> <code>useState</code> and <code>useEffect</code> from Stage 1–2 do most of the work; <code>useRef</code> remembers without rendering; <code>useMemo</code>/<code>useCallback</code> skip work at boundaries that need it; <code>useReducer</code> organises complex transitions; <code>useContext</code> distributes shared values; and custom hooks package any of it for reuse. Next, Chapter 7 closes Stage 2 with how React actually decides what to re-render — reconciliation, keys, and the performance rules that follow.</p>
</div>
<h3>Writing a hook of your own</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It is a function that calls hooks</b> — Nothing more. The <code>use</code> prefix is what tells React&#39;s lint rules to enforce the rules of hooks inside it.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It shares logic, not state</b> — Two components calling <code>useToggle()</code> each get their own independent state. A hook is a recipe, not a store.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Return what the caller needs</b> — An array for a pair the caller will rename (<code>const [on, toggle] = useToggle()</code>), an object when there are several named values.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Extract when it repeats, not before</b> — The same three lines in two components is a coincidence; in four it is a pattern with a name.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — calling a hook conditionally, which breaks React's internal bookkeeping.</strong> <code>if (user) { const [x] = useState(0) }</code> or an early <code>return</code> before a hook call changes how many hooks run between renders, and React matches hooks to their state <em>by call order</em>, not by name. So on the render where the condition flips, hook three receives hook two&#39;s state: a boolean turns up where you expected a string, and the error appears in a component that looks fine. The lint rule <code>react-hooks/rules-of-hooks</code> catches every case of this at edit time — the fix is not to be careful, it is to install the plugin and never disable that rule.</p></div>
<a class="link-card dl" href="https://react.dev/learn/reusing-logic-with-custom-hooks" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">react.dev — Reusing logic with custom hooks</span><span class="lc-sub">When to extract one, what to return, and the naming convention.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rules/rules-of-hooks" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">react.dev — Rules of Hooks</span><span class="lc-sub">The two rules, why they exist, and what breaks when you bend them.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Extract a repeated piece of logic (for example a <code>useLocalStorage</code> or <code>useToggle</code>) into a custom hook starting with <code>use</code>.</li>
<li>Use the hook in two components and confirm each gets its own independent state.</li>
<li>Explain the one rule: a custom hook is just a function that calls other hooks, and its name must start with <code>use</code>.</li>
</ol>
<p><strong>Done when:</strong> you can extract reusable logic into a custom hook and use it in multiple components.</p></div>

<h3>🔬 Measured: custom hooks in Next.js (React 19.3.0 · Next.js 16.4.6)</h3>
<p>First the lesson's <code>useWindowWidth</code>, copied as written into a <code>'use client'</code> page:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

function useWindowWidth() {                             <span class="tok-comment">  // chép NGUYÊN đoạn mã của bài web</span>
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() =&gt; {
    const onResize = () =&gt; setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () =&gt; window.removeEventListener('resize', onResize); <span class="tok-comment">  // cleanup, of course</span>
  }, []);
  return width;
}

export default function Header() {
  const width = useWindowWidth();
  return &lt;nav&gt;{width &lt; 768 ? 'Menu' : 'FullNav'}&lt;/nav&gt;;
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Error occurred|ReferenceError|^&gt; |Export encountered'
&gt; my-app@0.1.0 build
&gt; next build
Error occurred prerendering page "/hook-rieng/web". Read more: https://nextjs.org/docs/messages/prerender-error
ReferenceError: window is not defined
&gt; 5 |   const [width, setWidth] = useState(window.innerWidth);
Export encountered an error on /hook-rieng/web/page: /hook-rieng/web, exiting the build.</div>
<p>The Next-safe version subscribes to <code>resize</code> (with cleanup) and gives React a separate <b>server snapshot</b> for the HTML and for hydration:</p>
<pre><code class="language-typescript">'use client';
import { useSyncExternalStore } from 'react';

function subscribe(onChange: () =&gt; void) {
  window.addEventListener('resize', onChange);
  return () =&gt; window.removeEventListener('resize', onChange); <span class="tok-comment">  // cleanup</span>
}

export function useWindowWidth() {
  return useSyncExternalStore(
    subscribe,
    () =&gt; window.innerWidth,                            <span class="tok-comment">  // trình duyệt: đọc thật</span>
    () =&gt; 0,                                            <span class="tok-comment">  // máy chủ: chưa có window</span>
  );
}</code></pre>
<p>Then a page with the hook in two components, <code>useToggle</code> in two buttons, a component whose hook order flips, and — on a separate page — the early-return bug:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';
import { useWindowWidth } from '@/lib/useWindowWidth';

<span class="tok-comment">// 1 — một hook có tên, dùng ở hai component</span>
function Header() {
  const width = useWindowWidth();
  return &lt;nav id="header"&gt;Header: {width &lt; 768 ? 'Menu' : 'FullNav'}&lt;/nav&gt;;
}
function DoRong() {
  const width = useWindowWidth();
  return &lt;p id="do-rong"&gt;width = {width}&lt;/p&gt;;
}

<span class="tok-comment">// 2 — mỗi lời gọi có state RIÊNG</span>
function useToggle(dau = false) {
  const [on, setOn] = useState(dau);
  const toggle = () =&gt; setOn((v) =&gt; !v);
  return [on, toggle] as const;
}
function CongTac({ id }: { id: string }) {
  const [on, toggle] = useToggle();
  return &lt;button id={id} onClick={toggle} className="rounded border px-2"&gt;{id}: {on ? 'BẬT' : 'tắt'}&lt;/button&gt;;
}

<span class="tok-comment">// 3 — hook có điều kiện: React ghép state theo THỨ TỰ gọi, không theo tên</span>
function HoSo({ dao }: { dao: boolean }) {
  let ten: unknown, daXem: unknown;
  if (dao) { [daXem] = useState(true); [ten] = useState('An'); } <span class="tok-comment">  // ✗ thứ tự đảo khi dao đổi</span>
  else { [ten] = useState('An'); [daXem] = useState(true); }
  return &lt;span id="ho-so"&gt;tên: {String(ten)} · đã xem: {String(daXem)}&lt;/span&gt;;
}

export default function HookRieng() {
  const [dao, setDao] = useState(false);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;Header /&gt;
      &lt;DoRong /&gt;
      &lt;p className="space-x-2"&gt;&lt;CongTac id="den-a" /&gt;&lt;CongTac id="den-b" /&gt;&lt;/p&gt;
      &lt;p&gt;&lt;button id="dao" onClick={() =&gt; setDao(!dao)} className="rounded border px-2"&gt;đảo thứ tự&lt;/button&gt; &lt;HoSo dao={dao} /&gt;&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-tsx">'use client';
import { useCallback, useEffect, useState } from 'react';

export default function ThanhToan() {
  const [mounted, setMounted] = useState(false);
  useEffect(() =&gt; { setMounted(true); }, []);
  if (!mounted) return &lt;p&gt;đang tải…&lt;/p&gt;;             <span class="tok-comment">  // ✗ return sớm TRƯỚC một hook</span>
  const onPay = useCallback(() =&gt; alert('trả tiền'), []);
  return &lt;button id="tra-tien" onClick={onPay} className="rounded border px-2"&gt;Thanh toán&lt;/button&gt;;
}</code></pre><pre><code class="language-typescript">import { useState } from 'react';

export function layDoRong() {                           <span class="tok-comment">  // ✗ thiếu tiền tố use</span>
  const [w] = useState(0);
  return w;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|hook-rieng'
✓ Compiled successfully in 218ms
├ ○ /hook-rieng
├ ○ /hook-rieng/thanh-toan
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint -f json src/app/hook-rieng/page.tsx | node tom-eslint.cjs
29:24 error react-hooks/rules-of-hooks — React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
29:48 error react-hooks/rules-of-hooks — React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
30:18 error react-hooks/rules-of-hooks — React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
30:44 error react-hooks/rules-of-hooks — React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
$ npx eslint -f json src/app/hook-rieng/thanh-toan/page.tsx | node tom-eslint.cjs
6:21 error react-hooks/set-state-in-effect — Error: Calling setState synchronously within an effect can trigger cascading renders
8:17 error react-hooks/rules-of-hooks — React Hook "useCallback" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
$ npx eslint -f json src/lib/khongUse.ts | node tom-eslint.cjs
4:15 error react-hooks/rules-of-hooks — React Hook "useState" is called in function "layDoRong" that is neither a React function component nor a custom React Hook function. React component names must start with an uppercase letter. React Hook names must start with the word "use".</div>
<p>Server HTML via curl, then Chromium (resizing the window, clicking):</p>
<div class="out">$ curl -s localhost:3001/hook-rieng | grep -o '&lt;nav id="header"&gt;[^&lt;]*&lt;!-- --&gt;[^&lt;]*&lt;/nav&gt;\\|&lt;p id="do-rong"&gt;[^&lt;]*&lt;!-- --&gt;[^&lt;]*&lt;/p&gt;'
&lt;nav id="header"&gt;Header: &lt;!-- --&gt;Menu&lt;/nav&gt;
&lt;p id="do-rong"&gt;width = &lt;!-- --&gt;0&lt;/p&gt;
$ curl -s -o /dev/null -w 'next dev GET /hook-rieng → %{http_code}\\n' localhost:3000/hook-rieng
next dev GET /hook-rieng → 200
$ curl -s -o /dev/null -w 'next dev GET /hook-rieng/thanh-toan → %{http_code}\\n' localhost:3000/hook-rieng/thanh-toan
next dev GET /hook-rieng/thanh-toan → 200

Chromium 640 px                    : Header: Menu · width = 640
resized to 1000 px                 : Header: FullNav · width = 1000
one click on den-a                 : den-a: BẬT · den-b: tắt
HoSo before / after "đảo thứ tự"   : "tên: An · đã xem: true" → "tên: true · đã xem: An"  (dev: same, no warning)
/hook-rieng/thanh-toan, next start : "This page couldn’t load" · Minified React error #310
/hook-rieng/thanh-toan, next dev   : Rendered more hooks than during the previous render.</div>
<p>The server HTML says <b>Menu</b> and width <b>0</b> (the server snapshot); after hydration the real width takes over and a resize switches to FullNav — for pure layout, a CSS media query avoids that first "Menu". Each <code>useToggle()</code> call kept its own state. The flipped hook order mixed the two states <b>silently</b> in dev and production — exactly the lesson's trap — while the early return changed the number of hooks, which React does catch, as a crash: <b>#310</b>. cuongthai.com shipped exactly that: <code>/checkout</code> was white for everyone for 12 days (13→25/09/2026) because a <code>useCallback</code> sat after <code>if (!mounted) return</code>; tsc, <code>next build</code> and deploy were all green. Only ESLint's <code>react-hooks/rules-of-hooks</code> saw it.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
curl -s localhost:3001/hook-rieng | grep -o 'width = &lt;!-- --&gt;[0-9]*'
<span class="tok-comment"># open /hook-rieng, resize the window, click; then open /hook-rieng/thanh-toan</span>
npx eslint src/app/hook-rieng</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-4-custom-hook" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.4 — Custom hooks: useDebounce, useLocalStorage and the rules</span><span class="lc-sub">Writing and reusing real hooks</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-9-3-hook" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 9.3 — Testing custom hooks</span><span class="lc-sub">renderHook, wrappers, TanStack Query hooks and stores</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-3-slot9-hooks-slides" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.3 — Hooks (Slot 9–10)</span><span class="lc-sub">Slides on the hooks and their rules</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Custom hook</span><span class="v">A function that calls hooks to package reusable logic.</span></div>
  <div class="kv"><span class="k">use prefix</span><span class="v">The name must start with <code>use</code> so the rules apply.</span></div>
  <div class="kv"><span class="k">Independent state</span><span class="v">Each call gets its own state — hooks are not shared singletons.</span></div>
  <div class="kv"><span class="k">Rules of Hooks</span><span class="v">Call hooks at the top level, only from components/hooks.</span></div>
  <div class="kv"><span class="k">Composition of hooks</span><span class="v">Build bigger hooks from smaller ones.</span></div>
  <div class="kv"><span class="k">Logic reuse</span><span class="v">Share behaviour without sharing markup.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A custom hook is a function that calls other hooks to package reusable logic.</li><li>Its name must start with <code>use</code> so the Rules of Hooks apply.</li><li>Each component that uses the hook gets its own independent state.</li><li>Custom hooks share behaviour without sharing UI — compose small ones into bigger ones.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Hook của riêng bạn: đặt tên và tái dùng logic có state</h2>
<p class="lead">Một custom hook chỉ là một hàm có tên bắt đầu bằng <code>use</code> và gọi các hook khác. Đó là toàn bộ khái niệm. Nó cho bạn lấy một mảng logic có state — một effect cộng chút state — ra khỏi một component, đặt tên nó, và tái dùng, mà không cần tính năng React mới nào.</p>

<h3>Từ logic lặp lại tới một hook có tên</h3>
<p>Giả sử hai component đều theo dõi chiều rộng cửa sổ. Thay vì chép effect, hãy tách nó ra:</p>
<pre><code class="language-typescript">function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() =&gt; {
    const onResize = () =&gt; setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () =&gt; window.removeEventListener('resize', onResize);   <span class="tok-comment">// cleanup, tất nhiên</span>
  }, []);
  return width;
}

<span class="tok-comment">// giờ bất kỳ component nào cũng chỉ một dòng:</span>
function Header() {
  const width = useWindowWidth();
  return &lt;nav&gt;{width &lt; 768 ? &lt;Menu /&gt; : &lt;FullNav /&gt;}&lt;/nav&gt;;
}</code></pre>
<div class="pitfall"><p><strong>Trong Next.js, chính đoạn mã này làm hỏng <code>next build</code>.</strong> Đo ở dưới: trong một trang <code>'use client'</code>, tsc xanh nhưng build dừng với <code>ReferenceError: window is not defined</code> — Next.js vẫn render trước Client Component trên máy chủ, và <code>useState(window.innerWidth)</code> chạy ở đó. Bản an toàn cho Next.js (<code>useSyncExternalStore</code> có ảnh chụp máy chủ) nằm ở mục 🔬.</p></div>
<p>Logic giờ có một cái tên nói nó làm gì, nằm một chỗ, và test một lần. Các hook thật phổ biến trông đúng như vậy: <code>useLocalStorage</code>, <code>useDebounce</code>, <code>useFetch</code>, <code>useMediaQuery</code>, <code>useOnClickOutside</code>.</p>

<h3>Cái gì làm nó thành một hook (và các luật kéo theo)</h3>
<p>Hai thứ làm một hàm thành custom hook: tiền tố <code>use</code>, và việc nó gọi các hook khác. Cả hai đều quan trọng. Tiền tố <code>use</code> là cách React (và linter) biết Luật Hook áp dụng — nên nó phải được gọi ở cấp cao nhất của một component hay hook khác, không bao giờ có điều kiện. Vì nó gọi hook, nó không phải một hàm tiện ích thường; bạn không thể gọi nó trong một vòng lặp hay một <code>if</code>.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Mỗi lời gọi độc lập</span><span class="v">hai component gọi <code>useWindowWidth()</code> có state riêng tách biệt. Một hook chia sẻ <em>logic</em>, không phải state — nó không phải biến toàn cục.</span></div>
  <div class="kv"><span class="k">Ghép tự do</span><span class="v">một custom hook gọi được useState, useEffect, useRef, và các custom hook khác. Đây là cách bạn dựng năng lực từ những mảnh nhỏ.</span></div>
  <div class="kv"><span class="k">Đặt tên theo việc nó làm</span><span class="v"><code>useUser</code>, <code>useCart</code>, <code>useInterval</code> — cái tên là tài liệu.</span></div>
</div>

<h3>Phán đoán: tách khi nó xứng đáng</h3>
<p>Đừng tách một hook chỉ vì tách được — một <code>useState</code> một dòng không cần bọc. Tách khi logic <em>lặp lại</em> giữa các component, khi nó đủ phức tạp để xứng một cái tên và một bài test, hoặc khi giấu nó đi làm component đọc dễ hơn. Đây là cùng phép thử "nó có xứng đáng tồn tại không?" như component ở Chương 2, áp cho logic thay vì UI.</p>

<div class="callout ok">
<p><strong>Bộ đồ nghề hooks, đủ bộ.</strong> <code>useState</code> và <code>useEffect</code> từ Giai đoạn 1–2 làm phần lớn việc; <code>useRef</code> nhớ mà không render; <code>useMemo</code>/<code>useCallback</code> bỏ qua việc ở những ranh giới cần; <code>useReducer</code> tổ chức các chuyển trạng thái phức tạp; <code>useContext</code> phân phối giá trị chung; và custom hook đóng gói bất cứ cái nào để tái dùng. Tiếp theo, Chương 7 đóng Giai đoạn 2 với cách React thật sự quyết cái gì render lại — reconciliation, key, và các quy tắc hiệu năng kéo theo.</p>
</div>
<h3>Viết một hook của riêng bạn</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó là một hàm có gọi hook</b> — Chỉ vậy thôi. Tiền tố <code>use</code> là thứ báo cho luật lint của React biết phải cưỡng chế các luật hook bên trong nó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó chia sẻ logic, không chia sẻ state</b> — Hai component cùng gọi <code>useToggle()</code> thì mỗi cái có state độc lập của riêng mình. Một hook là một công thức, không phải một kho chứa.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Trả về đúng thứ chỗ gọi cần</b> — Một mảng cho một cặp mà chỗ gọi sẽ tự đặt tên (<code>const [on, toggle] = useToggle()</code>), một object khi có nhiều giá trị có tên.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Rút ra khi nó lặp lại, đừng rút trước</b> — Cùng ba dòng ở hai component là tình cờ; ở bốn chỗ thì nó là một mẫu có tên.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — gọi một hook có điều kiện, làm hỏng sổ sách nội bộ của React.</strong> <code>if (user) { const [x] = useState(0) }</code> hoặc một <code>return</code> sớm trước một lời gọi hook sẽ làm số hook chạy được thay đổi giữa các lần render, mà React ghép hook với state của nó <em>theo thứ tự gọi</em>, không theo tên. Nên ở lần render mà điều kiện lật, hook thứ ba nhận state của hook thứ hai: một boolean hiện ra ở chỗ bạn mong có một chuỗi, và lỗi xuất hiện trong một component trông chẳng có gì sai. Luật lint <code>react-hooks/rules-of-hooks</code> bắt mọi ca như thế ngay lúc bạn gõ — cách chữa không phải là cẩn thận, mà là cài plugin và đừng bao giờ tắt luật đó.</p></div>
<a class="link-card dl" href="https://react.dev/learn/reusing-logic-with-custom-hooks" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">react.dev — Dùng lại logic bằng hook tự viết</span><span class="lc-sub">Khi nào nên rút ra một cái, trả về gì, và quy ước đặt tên.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rules/rules-of-hooks" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">react.dev — Luật của Hook</span><span class="lc-sub">Hai luật, vì sao chúng tồn tại, và cái gì vỡ khi bạn bẻ cong chúng.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Rút một mảng logic lặp lại (ví dụ <code>useLocalStorage</code> hoặc <code>useToggle</code>) thành một custom hook bắt đầu bằng <code>use</code>.</li>
<li>Dùng hook đó trong hai component và xác nhận mỗi cái có state độc lập riêng.</li>
<li>Giải thích một luật: custom hook chỉ là một hàm gọi các hook khác, và tên phải bắt đầu bằng <code>use</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn rút được logic tái dùng thành một custom hook và dùng nó trong nhiều component.</p></div>

<h3>🔬 Đo thật: hook tự viết trong Next.js (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Trước hết, <code>useWindowWidth</code> của bài chép nguyên vào một trang <code>'use client'</code>:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

function useWindowWidth() {                             <span class="tok-comment">  // chép NGUYÊN đoạn mã của bài web</span>
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() =&gt; {
    const onResize = () =&gt; setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () =&gt; window.removeEventListener('resize', onResize); <span class="tok-comment">  // cleanup, of course</span>
  }, []);
  return width;
}

export default function Header() {
  const width = useWindowWidth();
  return &lt;nav&gt;{width &lt; 768 ? 'Menu' : 'FullNav'}&lt;/nav&gt;;
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Error occurred|ReferenceError|^&gt; |Export encountered'
&gt; my-app@0.1.0 build
&gt; next build
Error occurred prerendering page "/hook-rieng/web". Read more: https://nextjs.org/docs/messages/prerender-error
ReferenceError: window is not defined
&gt; 5 |   const [width, setWidth] = useState(window.innerWidth);
Export encountered an error on /hook-rieng/web/page: /hook-rieng/web, exiting the build.</div>
<p>Bản an toàn cho Next.js đăng ký nghe <code>resize</code> (có cleanup) và đưa React một <b>ảnh chụp máy chủ</b> riêng cho HTML và cho lúc hydrate:</p>
<pre><code class="language-typescript">'use client';
import { useSyncExternalStore } from 'react';

function subscribe(onChange: () =&gt; void) {
  window.addEventListener('resize', onChange);
  return () =&gt; window.removeEventListener('resize', onChange); <span class="tok-comment">  // cleanup</span>
}

export function useWindowWidth() {
  return useSyncExternalStore(
    subscribe,
    () =&gt; window.innerWidth,                            <span class="tok-comment">  // trình duyệt: đọc thật</span>
    () =&gt; 0,                                            <span class="tok-comment">  // máy chủ: chưa có window</span>
  );
}</code></pre>
<p>Rồi một trang: hook dùng ở hai component, <code>useToggle</code> ở hai nút, một component đảo thứ tự hook, và — ở trang riêng — lỗi return sớm:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';
import { useWindowWidth } from '@/lib/useWindowWidth';

<span class="tok-comment">// 1 — một hook có tên, dùng ở hai component</span>
function Header() {
  const width = useWindowWidth();
  return &lt;nav id="header"&gt;Header: {width &lt; 768 ? 'Menu' : 'FullNav'}&lt;/nav&gt;;
}
function DoRong() {
  const width = useWindowWidth();
  return &lt;p id="do-rong"&gt;width = {width}&lt;/p&gt;;
}

<span class="tok-comment">// 2 — mỗi lời gọi có state RIÊNG</span>
function useToggle(dau = false) {
  const [on, setOn] = useState(dau);
  const toggle = () =&gt; setOn((v) =&gt; !v);
  return [on, toggle] as const;
}
function CongTac({ id }: { id: string }) {
  const [on, toggle] = useToggle();
  return &lt;button id={id} onClick={toggle} className="rounded border px-2"&gt;{id}: {on ? 'BẬT' : 'tắt'}&lt;/button&gt;;
}

<span class="tok-comment">// 3 — hook có điều kiện: React ghép state theo THỨ TỰ gọi, không theo tên</span>
function HoSo({ dao }: { dao: boolean }) {
  let ten: unknown, daXem: unknown;
  if (dao) { [daXem] = useState(true); [ten] = useState('An'); } <span class="tok-comment">  // ✗ thứ tự đảo khi dao đổi</span>
  else { [ten] = useState('An'); [daXem] = useState(true); }
  return &lt;span id="ho-so"&gt;tên: {String(ten)} · đã xem: {String(daXem)}&lt;/span&gt;;
}

export default function HookRieng() {
  const [dao, setDao] = useState(false);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;Header /&gt;
      &lt;DoRong /&gt;
      &lt;p className="space-x-2"&gt;&lt;CongTac id="den-a" /&gt;&lt;CongTac id="den-b" /&gt;&lt;/p&gt;
      &lt;p&gt;&lt;button id="dao" onClick={() =&gt; setDao(!dao)} className="rounded border px-2"&gt;đảo thứ tự&lt;/button&gt; &lt;HoSo dao={dao} /&gt;&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-tsx">'use client';
import { useCallback, useEffect, useState } from 'react';

export default function ThanhToan() {
  const [mounted, setMounted] = useState(false);
  useEffect(() =&gt; { setMounted(true); }, []);
  if (!mounted) return &lt;p&gt;đang tải…&lt;/p&gt;;             <span class="tok-comment">  // ✗ return sớm TRƯỚC một hook</span>
  const onPay = useCallback(() =&gt; alert('trả tiền'), []);
  return &lt;button id="tra-tien" onClick={onPay} className="rounded border px-2"&gt;Thanh toán&lt;/button&gt;;
}</code></pre><pre><code class="language-typescript">import { useState } from 'react';

export function layDoRong() {                           <span class="tok-comment">  // ✗ thiếu tiền tố use</span>
  const [w] = useState(0);
  return w;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|hook-rieng'
✓ Compiled successfully in 218ms
├ ○ /hook-rieng
├ ○ /hook-rieng/thanh-toan
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint -f json src/app/hook-rieng/page.tsx | node tom-eslint.cjs
29:24 error react-hooks/rules-of-hooks — React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
29:48 error react-hooks/rules-of-hooks — React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
30:18 error react-hooks/rules-of-hooks — React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
30:44 error react-hooks/rules-of-hooks — React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
$ npx eslint -f json src/app/hook-rieng/thanh-toan/page.tsx | node tom-eslint.cjs
6:21 error react-hooks/set-state-in-effect — Error: Calling setState synchronously within an effect can trigger cascading renders
8:17 error react-hooks/rules-of-hooks — React Hook "useCallback" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
$ npx eslint -f json src/lib/khongUse.ts | node tom-eslint.cjs
4:15 error react-hooks/rules-of-hooks — React Hook "useState" is called in function "layDoRong" that is neither a React function component nor a custom React Hook function. React component names must start with an uppercase letter. React Hook names must start with the word "use".</div>
<p>HTML máy chủ qua curl, rồi Chromium (đổi cỡ cửa sổ, bấm):</p>
<div class="out">$ curl -s localhost:3001/hook-rieng | grep -o '&lt;nav id="header"&gt;[^&lt;]*&lt;!-- --&gt;[^&lt;]*&lt;/nav&gt;\\|&lt;p id="do-rong"&gt;[^&lt;]*&lt;!-- --&gt;[^&lt;]*&lt;/p&gt;'
&lt;nav id="header"&gt;Header: &lt;!-- --&gt;Menu&lt;/nav&gt;
&lt;p id="do-rong"&gt;width = &lt;!-- --&gt;0&lt;/p&gt;
$ curl -s -o /dev/null -w 'next dev GET /hook-rieng → %{http_code}\\n' localhost:3000/hook-rieng
next dev GET /hook-rieng → 200
$ curl -s -o /dev/null -w 'next dev GET /hook-rieng/thanh-toan → %{http_code}\\n' localhost:3000/hook-rieng/thanh-toan
next dev GET /hook-rieng/thanh-toan → 200

Chromium 640 px                    : Header: Menu · width = 640
đổi cỡ lên 1000 px                 : Header: FullNav · width = 1000
bấm den-a một lần                  : den-a: BẬT · den-b: tắt
HoSo trước / sau "đảo thứ tự"      : "tên: An · đã xem: true" → "tên: true · đã xem: An"  (dev: y hệt, không cảnh báo)
/hook-rieng/thanh-toan, next start : "This page couldn’t load" · Minified React error #310
/hook-rieng/thanh-toan, next dev   : Rendered more hooks than during the previous render.</div>
<p>HTML máy chủ ghi <b>Menu</b> và chiều rộng <b>0</b> (ảnh chụp máy chủ); sau khi hydrate, chiều rộng thật thay vào và đổi cỡ thì sang FullNav — với bố cục thuần, CSS media query tránh được chữ "Menu" thoáng qua đó. Mỗi lần gọi <code>useToggle()</code> giữ state riêng. Đảo thứ tự hook làm hai state lẫn vào nhau <b>im lặng</b> ở cả dev lẫn production — đúng cái bẫy của bài — còn return sớm làm đổi số hook, cái mà React có bắt, bằng cách sập: <b>#310</b>. cuongthai.com từng dính đúng lỗi này: <code>/checkout</code> trắng với mọi người 12 ngày (13→25/09/2026) vì một <code>useCallback</code> đứng sau <code>if (!mounted) return</code>; tsc, <code>next build</code> và deploy đều xanh. Chỉ <code>react-hooks/rules-of-hooks</code> của ESLint nhìn thấy.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
curl -s localhost:3001/hook-rieng | grep -o 'width = &lt;!-- --&gt;[0-9]*'
<span class="tok-comment"># mở /hook-rieng, kéo cỡ cửa sổ, bấm; rồi mở /hook-rieng/thanh-toan</span>
npx eslint src/app/hook-rieng</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-4-custom-hook" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.4 — Hook tự viết: useDebounce, useLocalStorage và quy tắc hook</span><span class="lc-sub">Viết và dùng lại hook thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-9-3-hook" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 9.3 — Test hook tự viết</span><span class="lc-sub">renderHook, wrapper, hook TanStack Query và store</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-3-slot9-hooks-slides" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.3 — Hooks (Slot 9–10)</span><span class="lc-sub">Slide các hook và luật dùng hook</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Custom hook</span><span class="v">Một hàm gọi các hook để đóng gói logic tái dùng.</span></div>
  <div class="kv"><span class="k">Tiền tố use</span><span class="v">Tên phải bắt đầu bằng <code>use</code> để các luật áp dụng.</span></div>
  <div class="kv"><span class="k">State độc lập</span><span class="v">Mỗi lời gọi có state riêng — hook không phải singleton dùng chung.</span></div>
  <div class="kv"><span class="k">Luật của Hooks</span><span class="v">Gọi hook ở cấp cao nhất, chỉ từ component/hook.</span></div>
  <div class="kv"><span class="k">Ghép các hook</span><span class="v">Dựng hook lớn từ hook nhỏ.</span></div>
  <div class="kv"><span class="k">Tái dùng logic</span><span class="v">Chia sẻ hành vi mà không chia sẻ markup.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Custom hook là một hàm gọi các hook khác để đóng gói logic tái dùng.</li><li>Tên của nó phải bắt đầu bằng <code>use</code> để Luật của Hooks áp dụng.</li><li>Mỗi component dùng hook đều có state độc lập riêng.</li><li>Custom hook chia sẻ hành vi mà không chia sẻ UI — ghép hook nhỏ thành hook lớn.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 6.6 quiz ─────────────────────────── */
    {
      title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra chương 6',
      slug: 'nextjs-6-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về useRef, useMemo/useCallback, useReducer, useContext và custom hooks.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 6: refs vs state, memoisation and when not to use it, reducers, context, and custom hooks.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 6: ref vs state, memo hoá và khi nào không nên, reducer, context, và custom hook.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What happens to the screen when you change ref.current?|||Chuyện gì xảy ra với màn hình khi bạn đổi ref.current?',
            options: [
              'The component re-renders immediately|||Component render lại ngay',
              'Nothing — changing a ref does not trigger a re-render|||Không gì — đổi một ref không kích hoạt render lại',
              'The whole app re-renders|||Cả app render lại',
              'It throws an error|||Nó ném lỗi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A changing value should be state rather than a ref when…|||Một giá trị đang đổi nên là state thay vì ref khi…',
            options: [
              'it never changes|||nó không bao giờ đổi',
              'the change must be shown on screen|||thay đổi phải hiện trên màn hình',
              'it is a number|||nó là một số',
              'it is used inside an effect|||nó được dùng trong một effect',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A useMemo depends on [dep]. Across mount + 2 renders where dep is unchanged + 1 render where dep changes, how many times does the compute fn run?|||Một useMemo phụ thuộc [dep]. Qua mount + 2 render dep không đổi + 1 render dep đổi, hàm tính chạy mấy lần?',
            options: ['4', '2', '1', '0'],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'useCallback(fn, deps) is equivalent to…|||useCallback(fn, deps) tương đương với…',
            options: [
              'useMemo(() => fn, deps)|||useMemo(() => fn, deps)',
              'useEffect(fn, deps)|||useEffect(fn, deps)',
              'useState(fn)|||useState(fn)',
              'useRef(fn)|||useRef(fn)',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'When should you NOT reach for useMemo/useCallback?|||Khi nào KHÔNG nên với tới useMemo/useCallback?',
            options: [
              'For a cheap calculation or a handler on a plain DOM element|||Cho một phép tính rẻ hay một handler trên một element DOM thường',
              'When sorting thousands of items|||Khi sắp hàng nghìn phần tử',
              'When the value is a dependency of an effect|||Khi giá trị là phụ thuộc của một effect',
              'When passing a function to a React.memo child|||Khi truyền một hàm cho một con React.memo',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A reducer function is…|||Một hàm reducer là…',
            options: [
              'an impure function that mutates state|||một hàm không thuần mutate state',
              'a pure function (state, action) => nextState|||một hàm thuần (state, action) => nextState',
              'a React component|||một component React',
              'an effect that runs on dispatch|||một effect chạy khi dispatch',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Starting from { n: 0 }, dispatch inc, then add(5), then inc. What is n?|||Bắt đầu từ { n: 0 }, dispatch inc, rồi add(5), rồi inc. n bằng bao nhiêu?',
            options: ['6', '7', '2', '11'],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What problem does useContext solve?|||useContext giải quyết vấn đề gì?',
            options: [
              'Making effects run faster|||Làm effect chạy nhanh hơn',
              'Passing a value to a deep subtree without prop drilling through every level|||Truyền một giá trị xuống nhánh sâu mà không prop drilling qua từng tầng',
              'Storing data on the server|||Lưu dữ liệu trên server',
              'Preventing all re-renders|||Ngăn mọi render lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Context is a POOR fit for…|||Context KHÔNG hợp cho…',
            options: [
              'the current theme|||theme hiện tại',
              'the logged-in user|||người dùng đã đăng nhập',
              'high-frequency state that changes every keystroke|||state tần suất cao đổi mỗi phím gõ',
              'the app locale|||ngôn ngữ của app',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Two components each call useWindowWidth(). What do they share?|||Hai component đều gọi useWindowWidth(). Chúng chia sẻ gì?',
            options: [
              'The same state value|||Cùng một giá trị state',
              'The logic only — each gets its own independent state|||Chỉ logic — mỗi cái có state độc lập riêng',
              'Nothing; custom hooks cannot be reused|||Không gì; custom hook không tái dùng được',
              'A global variable|||Một biến toàn cục',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
