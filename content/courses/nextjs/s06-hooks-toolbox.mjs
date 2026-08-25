/**
 * Next.js & React — Chương 6: Bộ đồ nghề hooks.
 * Song ngữ EN/VI. Escape: backtick→&#96;, `${`→\${, < >→&lt; &gt; trong code.
 * Output đã CHẠY THẬT (react-dom/client + act, scratchpad/nextjs-verify/c6.mjs):
 *   - useReducer inc→add5→inc từ 0 = 7
 *   - useMemo: computes=2 (mount 1 + 2 render vô can 0 + 1 đổi dep 1)
 *   - useRef: sửa .current 3 lần, render vẫn = 1 (không re-render)
 */

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
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>A box you can write to without re-rendering</h2>
<p class="lead">Chapter 4 met <code>useRef</code> for reading a form input. Its full job is broader: a ref is a mutable box whose <code>.current</code> you can read and write at any time, and — crucially — <strong>changing it does not trigger a re-render.</strong> That single property is what makes it different from state, and what it's for.</p>

<h3>Ref vs state, in one experiment</h3>
<p>Here is the defining difference, captured from a real render: a component that mutates a ref three times re-renders <strong>zero</strong> extra times.</p>
<pre><code>function RefDemo() {
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
<pre><code>const intervalId = useRef(null);
useEffect(() =&gt; {
  intervalId.current = setInterval(tick, 1000);
  return () =&gt; clearInterval(intervalId.current);
}, []);</code></pre>
<p><strong>2 · Reach a DOM node.</strong> Attach a ref to an element with the <code>ref</code> prop, and React fills <code>.current</code> with the real DOM node after commit — so you can focus, scroll, measure or play it:</p>
<pre><code>const inputRef = useRef(null);
useEffect(() =&gt; { inputRef.current.focus(); }, []);   <span class="tok-comment">// focus on mount</span>
return &lt;input ref={inputRef} /&gt;;</code></pre>

<div class="pitfall">
<p><strong>Don't read or write a ref during render.</strong> A ref is for effects and event handlers — code that runs <em>after</em> render. Reading <code>ref.current</code> during render (to decide what to show) or writing it during render makes your component impure and its output unpredictable, because React doesn't track ref changes. If a value decides what renders, it must be state, not a ref. Rule of thumb: <em>touch refs in handlers and effects, never in the render body.</em></p>
</div>

<h3>What a ref is, and what it is not</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>A box that survives renders</b> — &#96;useRef(0)&#96; returns the same object every render. Writing &#96;ref.current = 5&#96; changes the box; it does not tell React anything.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Changing it does not re-render</b> — That is the whole point. Use it for a value the UI does not display: a timer id, a previous value, a &quot;have I already run this&quot; flag.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Attach it to a DOM node with the ref prop</b> — &#96;&lt;input ref={inputRef} /&gt;&#96;. React fills &#96;current&#96; after the commit, so it is &#96;null&#96; during the first render.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Read it in an event handler or an effect</b> — Never during render. Reading a ref while rendering makes the output depend on something React cannot track.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — putting a displayed value in a ref, so the screen never updates.</strong> &#96;countRef.current++&#96; increments correctly and the number on screen never changes, because nothing asked React to render again. The value in DevTools is right, the DOM is stale, and it looks like a rendering bug rather than a choice you made. The rule is mechanical: if a value appears in the JSX, it is state. If it only exists to survive between renders without being shown, it is a ref. When you need both — a value shown <em>and</em> read by a timer — keep it in state and mirror it into a ref inside an effect.</p></div>
<a class="link-card dl" href="https://react.dev/learn/referencing-values-with-refs" target="_blank" rel="noopener">
  <span class="lc-ico">📌</span>
  <span class="lc-body"><span class="lc-title">react.dev — Referencing values with refs</span><span class="lc-sub">When a ref is right, and the rules about reading during render.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/manipulating-the-dom-with-refs" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">react.dev — Manipulating the DOM with refs</span><span class="lc-sub">Focus, scroll and measurement — the legitimate reasons to reach for the DOM.</span></span>
</a>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react.dev/reference/react/useRef" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — useRef</span><span class="lc-sub">Referencing values, manipulating the DOM, and the "don't touch during render" rule.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Một cái hộp bạn ghi vào được mà không render lại</h2>
<p class="lead">Chương 4 đã gặp <code>useRef</code> để đọc một input form. Nhiệm vụ đầy đủ của nó rộng hơn: một ref là một cái hộp thay đổi được mà <code>.current</code> của nó bạn đọc và ghi bất cứ lúc nào, và — quan trọng — <strong>đổi nó không kích hoạt render.</strong> Chính đặc tính đó khiến nó khác state, và là lý do nó tồn tại.</p>

<h3>Ref vs state, trong một thí nghiệm</h3>
<p>Đây là khác biệt định nghĩa, ghi từ một render thật: một component sửa một ref ba lần render lại <strong>không</strong> thêm lần nào.</p>
<pre><code>function RefDemo() {
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
<pre><code>const intervalId = useRef(null);
useEffect(() =&gt; {
  intervalId.current = setInterval(tick, 1000);
  return () =&gt; clearInterval(intervalId.current);
}, []);</code></pre>
<p><strong>2 · Với tới một nút DOM.</strong> Gắn một ref vào một element bằng prop <code>ref</code>, và React điền <code>.current</code> bằng nút DOM thật sau khi commit — để bạn focus, cuộn, đo hay phát nó:</p>
<pre><code>const inputRef = useRef(null);
useEffect(() =&gt; { inputRef.current.focus(); }, []);   <span class="tok-comment">// focus lúc mount</span>
return &lt;input ref={inputRef} /&gt;;</code></pre>

<div class="pitfall">
<p><strong>Đừng đọc hay ghi một ref trong lúc render.</strong> Ref là để cho effect và handler sự kiện — code chạy <em>sau</em> render. Đọc <code>ref.current</code> trong lúc render (để quyết hiện gì) hay ghi nó trong lúc render làm component không thuần và output khó lường, vì React không theo dõi thay đổi ref. Nếu một giá trị quyết cái được render, nó phải là state, không phải ref. Nguyên tắc: <em>chạm ref trong handler và effect, không bao giờ trong thân render.</em></p>
</div>

<h3>Một ref là gì, và nó không phải là gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Một cái hộp sống qua các lần render</b> — &#96;useRef(0)&#96; trả về cùng một object ở mọi lần render. Ghi &#96;ref.current = 5&#96; là đổi cái hộp; nó chẳng nói gì với React cả.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Đổi nó thì KHÔNG render lại</b> — Đó chính là toàn bộ mục đích. Hãy dùng nó cho một giá trị giao diện không hiển thị: một id bộ đếm giờ, một giá trị trước đó, một cờ &quot;tôi đã chạy cái này chưa&quot;.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Gắn nó vào một nút DOM bằng prop ref</b> — &#96;&lt;input ref={inputRef} /&gt;&#96;. React điền vào &#96;current&#96; sau khi commit, nên nó là &#96;null&#96; trong lần render đầu.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Đọc nó trong handler sự kiện hoặc trong effect</b> — Đừng bao giờ đọc trong lúc render. Đọc một ref lúc đang render làm đầu ra phụ thuộc vào thứ React không theo dõi được.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — đặt một giá trị được hiển thị vào một ref, và màn hình chẳng bao giờ cập nhật.</strong> &#96;countRef.current++&#96; tăng đúng và con số trên màn hình chẳng bao giờ đổi, vì chẳng có gì bảo React render lại. Giá trị trong DevTools thì đúng, DOM thì cũ, và nó trông như một lỗi vẽ chứ không phải một lựa chọn bạn đã làm. Luật thì máy móc: nếu một giá trị xuất hiện trong JSX thì nó là state. Nếu nó chỉ tồn tại để sống qua các lần render mà không được hiển thị thì nó là ref. Khi bạn cần cả hai — một giá trị vừa hiện ra <em>vừa</em> được một bộ đếm giờ đọc — hãy giữ nó trong state rồi soi gương nó vào một ref bên trong một effect.</p></div>
<a class="link-card dl" href="https://react.dev/learn/referencing-values-with-refs" target="_blank" rel="noopener">
  <span class="lc-ico">📌</span>
  <span class="lc-body"><span class="lc-title">react.dev — Tham chiếu giá trị bằng ref</span><span class="lc-sub">Khi nào ref là đúng, và các luật về việc đọc trong lúc render.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/manipulating-the-dom-with-refs" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">react.dev — Thao tác DOM bằng ref</span><span class="lc-sub">Tiêu điểm, cuộn và đo kích thước — những lý do chính đáng để với tay vào DOM.</span></span>
</a>

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
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Skipping work, and stabilising references</h2>
<p class="lead"><code>useMemo</code> and <code>useCallback</code> are the same idea applied to two things: remember a result across renders and only recompute it when the inputs change. <code>useMemo</code> remembers a <em>value</em>; <code>useCallback</code> remembers a <em>function</em>. Both are optimisations — reach for them when you have a reason, not by reflex.</p>

<h3>useMemo — recompute only when dependencies change</h3>
<pre><code>const value = useMemo(() =&gt; expensiveCompute(dep), [dep]);</code></pre>
<p>React runs the function on the first render and caches the result. On later renders it re-runs the function <em>only if</em> a dependency changed (same <code>Object.is</code> comparison as effects); otherwise it returns the cached value. Captured from a real render — a memo depending on <code>dep</code>, across a mount, two unrelated re-renders, and one <code>dep</code> change:</p>
<div class="out">useMemo computes (mount + 2 unrelated renders + 1 dep change): 2</div>
<p>Read that: the expensive function ran <strong>twice</strong>, not four times. Once on mount, <em>zero</em> times during the two re-renders where <code>dep</code> was unchanged (an unrelated piece of state changed), and once when <code>dep</code> actually changed. Without <code>useMemo</code> it would have run on all four renders. That is the win — but only worth it when the computation is genuinely expensive.</p>

<h3>useCallback — the same, for a function</h3>
<pre><code>const handleSearch = useCallback((q) =&gt; { doSearch(q, filter); }, [filter]);</code></pre>
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
<p><strong>React 19's Compiler changes the calculus.</strong> React is shipping an automatic compiler that inserts this memoisation for you, so manual <code>useMemo</code>/<code>useCallback</code> will matter less over time. Learn what they do — you'll read them in existing code and still need them at boundaries — but don't pepper new code with them "to be safe". Correct, readable code first.</p>
</div>
<h3>Memoisation: what it buys and what it costs</h3>
<div class="lz-map">
  <div class="lz-stage">Measure first, memoise second</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">useMemo caches a value</div><div class="lz-nsub">&#96;useMemo(() =&gt; expensiveSort(items), [items])&#96;. Skips the computation when the dependencies are unchanged.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">useCallback caches a function</div><div class="lz-nsub">Same thing for a function identity, so a memoised child does not re-render because its handler is new.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">They are not free</div><div class="lz-nsub">Each one stores a value, compares dependencies on every render, and adds a line for the next reader to understand.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">They only help in three cases</div><div class="lz-nsub">An expensive computation; a dependency of an effect; a prop passed to a &#96;memo&#96;-wrapped child. Outside those, they cost more than they save.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — wrapping a handler in &#96;useCallback&#96; and passing it to a child that is not memoised.</strong> &#96;const onSelect = useCallback(…, [])&#96; keeps the function identity stable, which achieves nothing if the child is an ordinary component: it re-renders when its parent does, regardless of whether its props changed. So you have paid for the memoisation and bought nothing. The pair only works together — &#96;useCallback&#96; on the parent <em>and</em> &#96;React.memo&#96; on the child — and even then only if every other prop is stable too, which one inline object literal is enough to break. Profile before adding either; the React DevTools profiler shows you which components actually re-render and how long they take.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Should you add useMemo everywhere?</span><span class="lc-sub">The official answer, with the three cases where it genuinely helps.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/react-developer-tools" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">react.dev — React Developer Tools</span><span class="lc-sub">The profiler: which components re-rendered, why, and how long each took.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Bỏ qua việc làm, và ổn định tham chiếu</h2>
<p class="lead"><code>useMemo</code> và <code>useCallback</code> là cùng một ý áp cho hai thứ: nhớ một kết quả qua các render và chỉ tính lại khi đầu vào đổi. <code>useMemo</code> nhớ một <em>giá trị</em>; <code>useCallback</code> nhớ một <em>hàm</em>. Cả hai là tối ưu — dùng khi có lý do, đừng dùng theo phản xạ.</p>

<h3>useMemo — chỉ tính lại khi phụ thuộc đổi</h3>
<pre><code>const value = useMemo(() =&gt; expensiveCompute(dep), [dep]);</code></pre>
<p>React chạy hàm ở render đầu và cache kết quả. Ở các render sau nó chạy lại hàm <em>chỉ khi</em> một phụ thuộc đổi (cùng phép so <code>Object.is</code> như effect); nếu không nó trả về giá trị cache. Ghi từ một render thật — một memo phụ thuộc <code>dep</code>, qua một mount, hai render vô can, và một lần đổi <code>dep</code>:</p>
<div class="out">useMemo computes (mount + 2 unrelated renders + 1 dep change): 2</div>
<p>Đọc kỹ: hàm đắt chạy <strong>hai</strong> lần, không phải bốn. Một lần lúc mount, <em>không</em> lần nào trong hai render mà <code>dep</code> không đổi (một mẩu state khác đổi), và một lần khi <code>dep</code> thật sự đổi. Không có <code>useMemo</code> thì nó đã chạy cả bốn render. Đó là cái lợi — nhưng chỉ đáng khi phép tính thật sự đắt.</p>

<h3>useCallback — y hệt, nhưng cho một hàm</h3>
<pre><code>const handleSearch = useCallback((q) =&gt; { doSearch(q, filter); }, [filter]);</code></pre>
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
<p><strong>React 19 Compiler đổi bài toán.</strong> React đang ra một compiler tự động chèn memo hoá này hộ bạn, nên <code>useMemo</code>/<code>useCallback</code> thủ công sẽ dần bớt quan trọng. Hãy học chúng làm gì — bạn sẽ đọc chúng trong code có sẵn và vẫn cần chúng ở các ranh giới — nhưng đừng rắc chúng khắp code mới "cho chắc". Code đúng, dễ đọc trước đã.</p>
</div>
<h3>Ghi nhớ (memoisation): nó mua được gì và tốn những gì</h3>
<div class="lz-map">
  <div class="lz-stage">Đo trước, ghi nhớ sau</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">useMemo nhớ một giá trị</div><div class="lz-nsub">&#96;useMemo(() =&gt; expensiveSort(items), [items])&#96;. Bỏ qua phép tính khi các phụ thuộc không đổi.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">useCallback nhớ một hàm</div><div class="lz-nsub">Cũng vậy nhưng cho danh tính của một hàm, để một component con đã memo không render lại chỉ vì handler của nó là mới.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Chúng không miễn phí</div><div class="lz-nsub">Mỗi cái đều lưu một giá trị, so các phụ thuộc ở mọi lần render, và thêm một dòng cho người đọc sau phải hiểu.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Chúng chỉ giúp trong ba trường hợp</div><div class="lz-nsub">Một phép tính đắt; một phụ thuộc của effect; một prop truyền cho component con bọc &#96;memo&#96;. Ngoài ba cái đó, chúng tốn nhiều hơn tiết kiệm.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — bọc một handler trong &#96;useCallback&#96; rồi truyền cho một component con KHÔNG được memo.</strong> &#96;const onSelect = useCallback(…, [])&#96; giữ danh tính hàm ổn định, và điều đó chẳng đạt được gì nếu component con là một component thường: nó render lại khi cha render, bất kể props có đổi hay không. Thế là bạn đã trả tiền cho phép ghi nhớ mà chẳng mua được gì. Cặp này chỉ chạy khi đi cùng nhau — &#96;useCallback&#96; ở cha <em>và</em> &#96;React.memo&#96; ở con — và ngay cả thế cũng chỉ khi mọi prop khác cũng ổn định, thứ mà một object viết thẳng cũng đủ phá vỡ. Hãy đo trước khi thêm cái nào; profiler của React DevTools cho bạn thấy component nào thật sự render lại và mất bao lâu.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Có nên thêm useMemo ở mọi nơi?</span><span class="lc-sub">Câu trả lời chính thức, kèm ba trường hợp nó thật sự giúp ích.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/react-developer-tools" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">react.dev — React Developer Tools</span><span class="lc-sub">Profiler: component nào đã render lại, vì sao, và mỗi cái mất bao lâu.</span></span>
</a>

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
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>When several pieces of state change together by rules</h2>
<p class="lead"><code>useState</code> is perfect for independent values. But when state gets complex — many fields that update together, transitions with rules ("you can't submit while loading") — scattering <code>setX</code> calls across handlers gets fragile. <code>useReducer</code> collects <em>all</em> the ways state can change into one pure function.</p>

<h3>The reducer is a pure function of (state, action)</h3>
<pre><code>function reducer(state, action) {
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
<pre><code>const [state, dispatch] = useReducer(reducer, { n: 0 });

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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The transitions are the logic</b> — &#96;dispatch({ type: &#39;fetch_failed&#39;, error })&#96; names what happened. The reducer decides what the state becomes.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It is a pure function</b> — &#96;(state, action) =&gt; newState&#96;. Testable on its own, with no React involved — which is worth more than it sounds.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>And it removes impossible combinations</b> — With separate booleans, &#96;loading &amp;&amp; error&#96; is representable. With a reducer returning one shape per case, it is not.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — mutating the state object inside the reducer.</strong> &#96;case &#39;add&#39;: state.items.push(action.item); return state&#96; returns the same object it received, so React&#39;s identity comparison says nothing changed and the component does not re-render. The data is genuinely updated — you can see it in the console — and the screen stays wrong, which sends people looking at the component instead of the reducer. A reducer must return a <em>new</em> object: &#96;return { ...state, items: [...state.items, action.item] }&#96;. This is the same rule as &#96;useState&#96;, but easier to break here because the reducer looks like a place where you are &quot;allowed&quot; to write imperative code.</p></div>
<a class="link-card dl" href="https://react.dev/learn/extracting-state-logic-into-a-reducer" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">react.dev — Extracting state logic into a reducer</span><span class="lc-sub">The step-by-step refactor from several useStates to one reducer.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useReducer" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">react.dev — useReducer reference</span><span class="lc-sub">Signatures, lazy initialisation, and the purity requirement spelled out.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Khi nhiều mẩu state đổi cùng nhau theo luật</h2>
<p class="lead"><code>useState</code> hoàn hảo cho các giá trị độc lập. Nhưng khi state phức tạp — nhiều trường cập nhật cùng nhau, các chuyển trạng thái có luật ("không được submit khi đang loading") — rải các lời gọi <code>setX</code> khắp handler trở nên mong manh. <code>useReducer</code> gom <em>mọi</em> cách state có thể đổi vào một hàm thuần.</p>

<h3>Reducer là một hàm thuần của (state, action)</h3>
<pre><code>function reducer(state, action) {
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
<pre><code>const [state, dispatch] = useReducer(reducer, { n: 0 });

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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Các phép chuyển trạng thái chính là logic</b> — &#96;dispatch({ type: &#39;fetch_failed&#39;, error })&#96; gọi tên chuyện đã xảy ra. Reducer quyết định state trở thành gì.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó là một hàm thuần khiết</b> — &#96;(state, action) =&gt; newState&#96;. Kiểm thử được riêng lẻ, chẳng dính gì tới React — và điều đó đáng giá hơn vẻ ngoài của nó.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Và nó loại bỏ những tổ hợp bất khả</b> — Với các boolean riêng lẻ thì &#96;loading &amp;&amp; error&#96; là biểu diễn được. Với một reducer trả về một dáng cho mỗi ca thì không.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — sửa thẳng object state bên trong reducer.</strong> &#96;case &#39;add&#39;: state.items.push(action.item); return state&#96; trả về đúng cái object nó nhận vào, nên phép so danh tính của React nói là chẳng có gì đổi và component không render lại. Dữ liệu thì đúng là đã cập nhật — bạn thấy được trong console — mà màn hình vẫn sai, khiến người ta đi soi component thay vì soi reducer. Một reducer phải trả về một object <em>mới</em>: &#96;return { ...state, items: [...state.items, action.item] }&#96;. Đây cũng là luật của &#96;useState&#96;, nhưng ở đây dễ phạm hơn vì reducer trông như một chỗ mà bạn &quot;được phép&quot; viết mã theo lối ra lệnh.</p></div>
<a class="link-card dl" href="https://react.dev/learn/extracting-state-logic-into-a-reducer" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">react.dev — Rút logic state ra thành reducer</span><span class="lc-sub">Phép tái cấu trúc từng bước từ vài useState thành một reducer.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useReducer" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">react.dev — Tra cứu useReducer</span><span class="lc-sub">Các chữ ký, khởi tạo lười, và yêu cầu về tính thuần khiết nói rõ ra.</span></span>
</a>

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
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Passing data to a whole subtree without threading it through</h2>
<p class="lead">Lifting state up (Chapter 3) is right until the state has to travel through many components that don't use it, just to forward it down — prop drilling. <code>useContext</code> lets a value be read by any component in a subtree directly, no matter how deep, without passing it as a prop at every level.</p>

<h3>The three steps</h3>
<pre><code>// 1 · create a context
const ThemeContext = createContext('light');

// 2 · a provider makes a value available to everything inside it
function App() {
  const [theme, setTheme] = useState('dark');
  return (
    &lt;ThemeContext.Provider value={theme}&gt;
      &lt;Page /&gt;              <span class="tok-comment">// Page and everything under it can read theme</span>
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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Create it with undefined</b> — &#96;createContext&lt;Ctx | undefined&gt;(undefined)&#96;, then a &#96;useX()&#96; hook that throws when there is no provider. The throw narrows the type for every consumer.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Every consumer re-renders on change</b> — When the provider&#39;s value changes, all consumers render — even the ones that only read a field that did not change.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>So split contexts by change rate</b> — A theme that changes twice a year and a cart that changes constantly do not belong in the same provider.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — an object literal as the provider value, re-rendering every consumer on every parent render.</strong> &#96;&lt;Ctx.Provider value={{ user, logout }}&gt;&#96; creates a new object each time the provider&#39;s own component renders, so context sees a changed value and re-renders every consumer in the subtree — even when &#96;user&#96; and &#96;logout&#96; are identical. In a provider near the root of the app, that is the whole tree, on every keystroke in an unrelated input. The fix is &#96;useMemo(() =&gt; ({ user, logout }), [user, logout])&#96;. This is one of the few places where memoisation is not premature: the cost is real and the fix is mechanical.</p></div>
<a class="link-card dl" href="https://react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Passing data deeply with context</span><span class="lc-sub">When context is the right answer, and the alternatives to try first.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">react.dev — Optimizing context re-renders</span><span class="lc-sub">The memoised-value pattern, straight from the docs.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Trao dữ liệu cho cả một nhánh cây mà không xâu qua từng tầng</h2>
<p class="lead">Nâng state lên (Chương 3) đúng cho tới khi state phải đi qua nhiều component không dùng nó, chỉ để chuyển tiếp xuống — prop drilling. <code>useContext</code> cho một giá trị được đọc bởi bất kỳ component nào trong một nhánh cây một cách trực tiếp, dù sâu tới đâu, mà không truyền nó làm prop ở mỗi tầng.</p>

<h3>Ba bước</h3>
<pre><code>// 1 · tạo một context
const ThemeContext = createContext('light');

// 2 · một provider làm một giá trị khả dụng cho mọi thứ bên trong nó
function App() {
  const [theme, setTheme] = useState('dark');
  return (
    &lt;ThemeContext.Provider value={theme}&gt;
      &lt;Page /&gt;              <span class="tok-comment">// Page và mọi thứ dưới nó đọc được theme</span>
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
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Hãy tạo nó với undefined</b> — &#96;createContext&lt;Ctx | undefined&gt;(undefined)&#96;, rồi một hook &#96;useX()&#96; ném lỗi khi không có provider. Phép ném lỗi đó thu hẹp kiểu cho mọi chỗ tiêu thụ.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Mọi chỗ tiêu thụ đều render lại khi giá trị đổi</b> — Khi giá trị của provider đổi, toàn bộ chỗ tiêu thụ đều render — kể cả những chỗ chỉ đọc một field chẳng hề đổi.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nên hãy chia context theo tốc độ thay đổi</b> — Một chủ đề giao diện đổi hai lần một năm và một giỏ hàng đổi liên tục thì không thuộc về cùng một provider.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một object viết thẳng làm giá trị của provider, render lại mọi chỗ tiêu thụ ở mỗi lần cha render.</strong> &#96;&lt;Ctx.Provider value={{ user, logout }}&gt;&#96; tạo một object mới mỗi khi chính component chứa provider render, nên context thấy giá trị đã đổi và render lại mọi chỗ tiêu thụ trong cây con — kể cả khi &#96;user&#96; và &#96;logout&#96; y hệt nhau. Với một provider gần gốc ứng dụng thì đó là cả cái cây, ở mỗi lần gõ phím trong một ô nhập chẳng liên quan. Cách chữa là &#96;useMemo(() =&gt; ({ user, logout }), [user, logout])&#96;. Đây là một trong số ít chỗ mà việc ghi nhớ không hề là quá sớm: chi phí là thật và cách chữa thì máy móc.</p></div>
<a class="link-card dl" href="https://react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Truyền dữ liệu xuống sâu bằng context</span><span class="lc-sub">Khi nào context là câu trả lời đúng, và những phương án nên thử trước.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">react.dev — Tối ưu việc render lại của context</span><span class="lc-sub">Mẫu giá trị đã ghi nhớ, lấy thẳng từ tài liệu.</span></span>
</a>

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
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Your own hooks: naming and reusing stateful logic</h2>
<p class="lead">A custom hook is just a function whose name starts with <code>use</code> and that calls other hooks. That's the entire concept. It lets you take a chunk of stateful logic — an effect plus some state — out of a component, name it, and reuse it, without any new React feature.</p>

<h3>From duplicated logic to a named hook</h3>
<p>Say two components both track the window width. Instead of copying the effect, extract it:</p>
<pre><code>function useWindowWidth() {
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
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It is a function that calls hooks</b> — Nothing more. The &#96;use&#96; prefix is what tells React&#39;s lint rules to enforce the rules of hooks inside it.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It shares logic, not state</b> — Two components calling &#96;useToggle()&#96; each get their own independent state. A hook is a recipe, not a store.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Return what the caller needs</b> — An array for a pair the caller will rename (&#96;const [on, toggle] = useToggle()&#96;), an object when there are several named values.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Extract when it repeats, not before</b> — The same three lines in two components is a coincidence; in four it is a pattern with a name.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — calling a hook conditionally, which breaks React's internal bookkeeping.</strong> &#96;if (user) { const [x] = useState(0) }&#96; or an early &#96;return&#96; before a hook call changes how many hooks run between renders, and React matches hooks to their state <em>by call order</em>, not by name. So on the render where the condition flips, hook three receives hook two&#39;s state: a boolean turns up where you expected a string, and the error appears in a component that looks fine. The lint rule &#96;react-hooks/rules-of-hooks&#96; catches every case of this at edit time — the fix is not to be careful, it is to install the plugin and never disable that rule.</p></div>
<a class="link-card dl" href="https://react.dev/learn/reusing-logic-with-custom-hooks" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">react.dev — Reusing logic with custom hooks</span><span class="lc-sub">When to extract one, what to return, and the naming convention.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rules/rules-of-hooks" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">react.dev — Rules of Hooks</span><span class="lc-sub">The two rules, why they exist, and what breaks when you bend them.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Hook của riêng bạn: đặt tên và tái dùng logic có state</h2>
<p class="lead">Một custom hook chỉ là một hàm có tên bắt đầu bằng <code>use</code> và gọi các hook khác. Đó là toàn bộ khái niệm. Nó cho bạn lấy một mảng logic có state — một effect cộng chút state — ra khỏi một component, đặt tên nó, và tái dùng, mà không cần tính năng React mới nào.</p>

<h3>Từ logic lặp lại tới một hook có tên</h3>
<p>Giả sử hai component đều theo dõi chiều rộng cửa sổ. Thay vì chép effect, hãy tách nó ra:</p>
<pre><code>function useWindowWidth() {
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
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó là một hàm có gọi hook</b> — Chỉ vậy thôi. Tiền tố &#96;use&#96; là thứ báo cho luật lint của React biết phải cưỡng chế các luật hook bên trong nó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó chia sẻ logic, không chia sẻ state</b> — Hai component cùng gọi &#96;useToggle()&#96; thì mỗi cái có state độc lập của riêng mình. Một hook là một công thức, không phải một kho chứa.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Trả về đúng thứ chỗ gọi cần</b> — Một mảng cho một cặp mà chỗ gọi sẽ tự đặt tên (&#96;const [on, toggle] = useToggle()&#96;), một object khi có nhiều giá trị có tên.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Rút ra khi nó lặp lại, đừng rút trước</b> — Cùng ba dòng ở hai component là tình cờ; ở bốn chỗ thì nó là một mẫu có tên.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — gọi một hook có điều kiện, làm hỏng sổ sách nội bộ của React.</strong> &#96;if (user) { const [x] = useState(0) }&#96; hoặc một &#96;return&#96; sớm trước một lời gọi hook sẽ làm số hook chạy được thay đổi giữa các lần render, mà React ghép hook với state của nó <em>theo thứ tự gọi</em>, không theo tên. Nên ở lần render mà điều kiện lật, hook thứ ba nhận state của hook thứ hai: một boolean hiện ra ở chỗ bạn mong có một chuỗi, và lỗi xuất hiện trong một component trông chẳng có gì sai. Luật lint &#96;react-hooks/rules-of-hooks&#96; bắt mọi ca như thế ngay lúc bạn gõ — cách chữa không phải là cẩn thận, mà là cài plugin và đừng bao giờ tắt luật đó.</p></div>
<a class="link-card dl" href="https://react.dev/learn/reusing-logic-with-custom-hooks" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">react.dev — Dùng lại logic bằng hook tự viết</span><span class="lc-sub">Khi nào nên rút ra một cái, trả về gì, và quy ước đặt tên.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rules/rules-of-hooks" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">react.dev — Luật của Hook</span><span class="lc-sub">Hai luật, vì sao chúng tồn tại, và cái gì vỡ khi bạn bẻ cong chúng.</span></span>
</a>

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
