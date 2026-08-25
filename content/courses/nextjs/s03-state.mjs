/**
 * Next.js & React — Chương 3: State & mô hình render lại.
 * Song ngữ EN/VI. Escape: backtick→&#96;, `${`→\${, < >→&lt; &gt; trong code.
 * Mô phỏng ngữ nghĩa "state là ảnh chụp" đã chạy thật (scratchpad/nextjs-verify/c3.mjs):
 * ba setCount(count+1) từ 0 đều cho 1 ([1,1,1]); ba setCount(c=>c+1) cộng dồn thành 3.
 */

export default {
  title: 'Chapter 3 — State & the re-render model|||Chương 3 — State & mô hình render lại',
  description: 'useState cho component một trí nhớ. State là một ảnh chụp cho mỗi lần render — hiểu điều này giải thích mọi bug "giá trị bị cũ". Cập nhật object và mảng mà không mutate.',
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — useState: giving a component a memory|||3.1 — useState: cho component một trí nhớ',
      slug: 'nextjs-3-1-usestate',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'useState trả về giá trị hiện tại và một hàm để đặt lại nó. Gọi hàm đặt là cách duy nhất kích hoạt một lần render lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>A component that remembers</h2>
<p class="lead">Props come from the parent and a component can't change them. But a component often needs its own data that changes over time and survives across renders — the text in an input, whether a menu is open, a counter. That is <strong>state</strong>, and <code>useState</code> is how you declare it.</p>

<h3>Why a plain variable doesn't work</h3>
<p>Your first instinct is a normal variable. It fails, and the reason teaches you what React is doing:</p>
<pre><code>function Counter() {
  let count = 0;                       <span class="tok-comment">// reset to 0 on every render</span>
  return &lt;button onClick={() =&gt; { count++; }}&gt;{count}&lt;/button&gt;;
}</code></pre>
<p>Two things go wrong. First, clicking changes <code>count</code> but nothing tells React to re-render, so the screen never updates. Second, even if it did re-render, React would call <code>Counter()</code> again from the top and <code>let count = 0</code> would reset it. A local variable can't be memory, because the function runs fresh every render.</p>

<h3><code>useState</code>: declare a value React remembers for you</h3>
<pre><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return &lt;button onClick={() =&gt; setCount(count + 1)}&gt;{count}&lt;/button&gt;;
}</code></pre>
<p><code>useState(0)</code> says "I want a piece of state, its initial value is <code>0</code>". It returns a pair: the <strong>current value</strong> (<code>count</code>) and a <strong>setter</strong> function (<code>setCount</code>). React stores the value outside your function, so it persists across renders. The initial value is only used the first time; on later renders <code>useState</code> hands back whatever the state currently is.</p>

<h3>The setter does two things</h3>
<p>When you call <code>setCount(count + 1)</code>, React (1) saves the new value, and (2) <strong>schedules a re-render</strong> of this component. On that re-render, <code>Counter()</code> runs again, <code>useState</code> returns the new <code>count</code>, and the button shows it. This is the loop from Chapter 1, now driven by state:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Event</b> — the user clicks; your handler runs <code>setCount(count + 1)</code>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Schedule</b> — React records the new state and queues a re-render.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Re-render</b> — React calls your component again; <code>useState</code> returns the new value.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Commit</b> — React updates only the DOM that changed.</div></div>
</div>
<p>Calling the setter is the <em>only</em> way to trigger a re-render from a component. If the screen isn't updating, you either didn't call a setter, or you mutated the value instead of setting it (Lesson 3.3). If you assign to the variable directly (<code>count = 5</code>), nothing happens — React never finds out.</p>

<div class="pitfall">
<p><strong>Hooks have two rules, and both matter.</strong> (1) Only call hooks at the <em>top level</em> of a component — never inside an <code>if</code>, a loop, or a nested function. React tracks state by call order, so a conditional hook shifts the order and corrupts every hook after it. (2) Only call hooks from React components or other hooks, not from ordinary functions. Break either and React throws "Rendered fewer hooks than expected" or "Invalid hook call". Chapter 6 explains <em>why</em> the order matters; for now, hooks go at the top, unconditionally.</p>
</div>
<h3>What happens when you call a setter</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>React schedules a re-render</b> — It does not change the variable you are holding. &#96;count&#96; keeps its old value for the rest of this function — that is the part everyone trips on.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Updates are batched</b> — Several setter calls in one event handler produce one render, not three. React collects them and applies them together.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>The component runs again</b> — Top to bottom. &#96;useState&#96; returns the new value this time, and the JSX is rebuilt from it.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Bail out if the value is identical</b> — &#96;Object.is&#96; comparison. Setting the same primitive twice does not re-render — but a new object with the same contents does.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — calling the setter twice in one handler and getting one increment.</strong> &#96;setCount(count + 1); setCount(count + 1);&#96; increments by one, because both calls read the same &#96;count&#96; from this render&#39;s closure — the variable does not update mid-function. It looks like a batching bug and it is not: the value was simply stale for the second call. The functional form fixes it, because React passes each call the result of the previous one: &#96;setCount(c =&gt; c + 1)&#96; twice increments by two. Use the functional form whenever the next value depends on the previous one, including inside timers and effects, where the captured value can be several renders old.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/useState" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — useState reference</span><span class="lc-sub">Every signature, including the functional updater and lazy initialisation.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/queueing-a-series-of-state-updates" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Queueing a series of state updates</span><span class="lc-sub">Exactly why two setters increment by one, drawn out step by step.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Một component biết nhớ</h2>
<p class="lead">Props tới từ cha và component không đổi được chúng. Nhưng một component thường cần dữ liệu riêng thay đổi theo thời gian và sống sót qua các lần render — chữ trong một ô nhập, một menu đang mở hay không, một bộ đếm. Đó là <strong>state</strong>, và <code>useState</code> là cách bạn khai báo nó.</p>

<h3>Vì sao một biến thường không dùng được</h3>
<p>Phản xạ đầu tiên là một biến bình thường. Nó hỏng, và lý do dạy bạn điều React đang làm:</p>
<pre><code>function Counter() {
  let count = 0;                       <span class="tok-comment">// đặt lại 0 ở mỗi lần render</span>
  return &lt;button onClick={() =&gt; { count++; }}&gt;{count}&lt;/button&gt;;
}</code></pre>
<p>Hai thứ sai. Thứ nhất, click làm đổi <code>count</code> nhưng chẳng có gì báo React render lại, nên màn hình không bao giờ cập nhật. Thứ hai, kể cả nếu có render lại, React sẽ gọi lại <code>Counter()</code> từ đầu và <code>let count = 0</code> sẽ đặt lại nó. Một biến cục bộ không thể làm trí nhớ, vì hàm chạy mới tinh ở mỗi lần render.</p>

<h3><code>useState</code>: khai một giá trị React nhớ hộ bạn</h3>
<pre><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return &lt;button onClick={() =&gt; setCount(count + 1)}&gt;{count}&lt;/button&gt;;
}</code></pre>
<p><code>useState(0)</code> nói "tôi muốn một mẩu state, giá trị ban đầu là <code>0</code>". Nó trả về một cặp: <strong>giá trị hiện tại</strong> (<code>count</code>) và một hàm <strong>setter</strong> (<code>setCount</code>). React lưu giá trị bên ngoài hàm của bạn, nên nó bền qua các lần render. Giá trị ban đầu chỉ dùng lần đầu; các lần render sau <code>useState</code> trả lại bất kể state hiện đang là gì.</p>

<h3>Setter làm hai việc</h3>
<p>Khi bạn gọi <code>setCount(count + 1)</code>, React (1) lưu giá trị mới, và (2) <strong>lên lịch render lại</strong> component này. Ở lần render lại đó, <code>Counter()</code> chạy lại, <code>useState</code> trả về <code>count</code> mới, và nút hiện nó. Đây là vòng lặp từ Chương 1, giờ được state điều khiển:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Sự kiện</b> — người dùng click; handler của bạn chạy <code>setCount(count + 1)</code>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Lên lịch</b> — React ghi lại state mới và xếp hàng một lần render lại.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Render lại</b> — React gọi lại component; <code>useState</code> trả về giá trị mới.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Commit</b> — React chỉ cập nhật phần DOM đã đổi.</div></div>
</div>
<p>Gọi setter là cách <em>duy nhất</em> kích hoạt render lại từ một component. Nếu màn hình không cập nhật, hoặc bạn chưa gọi một setter, hoặc bạn đã mutate giá trị thay vì đặt lại nó (Bài 3.3). Nếu bạn gán thẳng vào biến (<code>count = 5</code>), chẳng có gì xảy ra — React không bao giờ biết.</p>

<div class="pitfall">
<p><strong>Hook có hai luật, và cả hai đều quan trọng.</strong> (1) Chỉ gọi hook ở <em>cấp cao nhất</em> của một component — không bao giờ trong <code>if</code>, vòng lặp, hay một hàm lồng. React theo dõi state theo thứ tự gọi, nên một hook có điều kiện làm lệch thứ tự và hỏng mọi hook phía sau. (2) Chỉ gọi hook từ component React hoặc hook khác, không từ hàm thường. Vi phạm một trong hai là React ném "Rendered fewer hooks than expected" hoặc "Invalid hook call". Chương 6 giải thích <em>vì sao</em> thứ tự quan trọng; giờ thì, hook đặt trên cùng, vô điều kiện.</p>
</div>
<h3>Chuyện gì xảy ra khi bạn gọi setter</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>React xếp lịch render lại</b> — Nó KHÔNG đổi cái biến bạn đang cầm. &#96;count&#96; giữ nguyên giá trị cũ cho tới hết hàm này — và đó là chỗ ai cũng vấp.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Các lần cập nhật được gộp lô</b> — Vài lời gọi setter trong một handler sự kiện chỉ sinh ra một lần render, không phải ba. React gom chúng lại rồi áp cùng lúc.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Component chạy lại</b> — Từ trên xuống. Lần này &#96;useState&#96; trả về giá trị mới, và JSX được dựng lại từ đó.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Bỏ qua nếu giá trị y hệt</b> — So bằng &#96;Object.is&#96;. Đặt cùng một giá trị nguyên thuỷ hai lần thì không render lại — nhưng một object mới với cùng nội dung thì có.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — gọi setter hai lần trong một handler mà chỉ tăng được một.</strong> &#96;setCount(count + 1); setCount(count + 1);&#96; chỉ tăng một, vì cả hai lời gọi đều đọc cùng một &#96;count&#96; từ closure của lần render này — cái biến không cập nhật giữa chừng hàm. Nó trông như lỗi gộp lô mà không phải: giá trị đơn giản là đã cũ với lời gọi thứ hai. Dạng nhận hàm chữa được, vì React truyền cho mỗi lời gọi kết quả của lời gọi trước: &#96;setCount(c =&gt; c + 1)&#96; hai lần thì tăng hai. Hãy dùng dạng nhận hàm bất cứ khi nào giá trị kế tiếp phụ thuộc giá trị trước, kể cả trong bộ đếm giờ và trong effect, nơi giá trị bắt được có thể đã cũ vài lần render.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/useState" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Tra cứu useState</span><span class="lc-sub">Mọi chữ ký, gồm cả dạng cập nhật bằng hàm và khởi tạo lười.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/queueing-a-series-of-state-updates" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Xếp hàng một chuỗi cập nhật state</span><span class="lc-sub">Chính xác vì sao hai setter chỉ tăng một, vẽ ra từng bước.</span></span>
</a>

</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — State is a snapshot|||3.2 — State là một ảnh chụp',
      slug: 'nextjs-3-2-state-la-anh-chup',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Trong một lần render, giá trị state là cố định. Ba setCount(count+1) chỉ tăng 1. Dạng updater setCount(c=>c+1) cộng dồn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>The one idea that explains every "stale value" bug</h2>
<p class="lead">This is the most important lesson in the whole React half of the course. Get it and half of React's surprises evaporate. The idea: <strong>a state value is a snapshot, fixed for the duration of one render.</strong> The variable <code>count</code> in your function is not a live pointer to "the current state" — it is the value state had when this render started.</p>

<h3>The puzzle</h3>
<p>What does this button do, starting from <code>count = 0</code>?</p>
<pre><code>function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;button onClick={() =&gt; {
      setCount(count + 1);
      setCount(count + 1);
      setCount(count + 1);
    }}&gt;{count}&lt;/button&gt;
  );
}</code></pre>
<p>Almost everyone answers "3". The real answer is <strong>1</strong>. Here is a faithful simulation of React's semantics, run in plain JavaScript — during this render <code>count</code> is captured as <code>0</code>, so all three calls compute <code>0 + 1</code>:</p>
<pre><code>count = 0;
setCount(count + 1);   <span class="tok-comment">// schedules 1</span>
setCount(count + 1);   <span class="tok-comment">// schedules 1 (count is still 0 here)</span>
setCount(count + 1);   <span class="tok-comment">// schedules 1</span></code></pre>
<div class="out">count=0, three setCount(count+1): [1,1,1]   → final state: 1</div>
<p>All three calls read the same snapshot, <code>count === 0</code>. Calling <code>setCount</code> does <em>not</em> change the <code>count</code> variable in the running function — that variable belongs to this render and stays <code>0</code> until the next render produces a new one. React batches the three updates and re-renders once, with <code>count = 1</code>.</p>

<h3>Why React does this: batching</h3>
<p>React <strong>batches</strong> all state updates triggered by the same event and re-renders once at the end, not after each <code>setState</code>. This is why a handler that sets five pieces of state causes one re-render, not five — a big performance win, and the reason <code>count</code> can't change mid-handler. Each render gets its own frozen set of state values, props, and event handlers; that consistency is what makes React predictable.</p>

<h3>When you need the latest value: the updater function</h3>
<p>When the next state depends on the previous state, don't read the snapshot — pass a <em>function</em> to the setter. React calls it with the latest pending value and uses the return as the next state:</p>
<pre><code>setCount(c =&gt; c + 1);
setCount(c =&gt; c + 1);
setCount(c =&gt; c + 1);</code></pre>
<p>Now each call receives the result of the one before it. Same simulation, updater form:</p>
<div class="out">count=0, three setCount(c=>c+1) => final: 3</div>
<p>The rule is simple and worth memorising: <strong>if the new state is computed from the old state, use the updater form <code>setX(prev =&gt; ...)</code>.</strong> It is always correct, including inside loops, timeouts and async code where the snapshot would be stale. When you set state to a value unrelated to the old one (<code>setName(input)</code>), the plain form is fine.</p>

<div class="callout warn">
<p><strong>The classic stale-closure bug.</strong> A <code>setInterval</code> that does <code>setCount(count + 1)</code> increments to 1 and then sticks, forever — the interval callback captured <code>count</code> from the render that created it and never sees a newer one. <code>setCount(c =&gt; c + 1)</code> fixes it instantly, because it never reads the stale snapshot. You will meet this exact bug again in Chapter 5 with effects; it is the same snapshot rule wearing a different hat.</p>
</div>
<h3>A render is a snapshot</h3>
<div class="lz-map">
  <div class="lz-stage">Everything in one render sees one set of values</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">The variables are frozen for this render</div><div class="lz-nsub">&#96;count&#96; is a &#96;const&#96; created when the function ran. A later setter call creates a new &#96;count&#96; in a new call — it never reaches back.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Event handlers capture that snapshot</div><div class="lz-nsub">A handler defined during render 3 sees render 3&#39;s values forever, even if it fires after render 7.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">So does anything you schedule</div><div class="lz-nsub">&#96;setTimeout&#96;, a promise callback, an interval. They all remember the render that created them.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The functional updater escapes it</div><div class="lz-nsub">&#96;setX(prev =&gt; …)&#96; asks React for the current value at the moment the update is applied, not the value the closure captured.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — reading state right after setting it.</strong> &#96;setOpen(true); if (open) doSomething();&#96; never runs the body, and it looks like the setter failed. It did not: &#96;open&#96; is a constant belonging to this render, and it will not change until React runs the component again. The same shape appears as &#96;setItems([...items, x]); console.log(items.length)&#96; logging the old length, and as a validation check that reads the field it just set. When you need the new value, you already have it — use the expression you passed to the setter. When the work must happen after the render, that is what an effect is for.</p></div>
<a class="link-card dl" href="https://react.dev/learn/state-as-a-snapshot" target="_blank" rel="noopener">
  <span class="lc-ico">📸</span>
  <span class="lc-body"><span class="lc-title">react.dev — State as a snapshot</span><span class="lc-sub">The mental model this lesson is built on, with runnable examples.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/referencing-values-with-refs" target="_blank" rel="noopener">
  <span class="lc-ico">📌</span>
  <span class="lc-body"><span class="lc-title">react.dev — Referencing values with refs</span><span class="lc-sub">When you genuinely need a value that survives renders without causing one.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Ý tưởng duy nhất giải thích mọi bug "giá trị bị cũ"</h2>
<p class="lead">Đây là bài quan trọng nhất trong cả nửa React của khoá học. Nắm được nó thì một nửa những bất ngờ của React bốc hơi. Ý tưởng: <strong>một giá trị state là một ảnh chụp, cố định trong suốt một lần render.</strong> Biến <code>count</code> trong hàm của bạn không phải con trỏ sống trỏ tới "state hiện tại" — nó là giá trị state có được lúc lần render này bắt đầu.</p>

<h3>Câu đố</h3>
<p>Nút này làm gì, bắt đầu từ <code>count = 0</code>?</p>
<pre><code>function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;button onClick={() =&gt; {
      setCount(count + 1);
      setCount(count + 1);
      setCount(count + 1);
    }}&gt;{count}&lt;/button&gt;
  );
}</code></pre>
<p>Gần như ai cũng trả lời "3". Đáp án thật là <strong>1</strong>. Đây là mô phỏng trung thực ngữ nghĩa của React, chạy bằng JavaScript thuần — trong lần render này <code>count</code> được bắt là <code>0</code>, nên cả ba lời gọi đều tính <code>0 + 1</code>:</p>
<pre><code>count = 0;
setCount(count + 1);   <span class="tok-comment">// lên lịch 1</span>
setCount(count + 1);   <span class="tok-comment">// lên lịch 1 (count ở đây vẫn là 0)</span>
setCount(count + 1);   <span class="tok-comment">// lên lịch 1</span></code></pre>
<div class="out">count=0, three setCount(count+1): [1,1,1]   → state cuối: 1</div>
<p>Cả ba lời gọi đọc cùng một ảnh chụp, <code>count === 0</code>. Gọi <code>setCount</code> <em>không</em> làm đổi biến <code>count</code> trong hàm đang chạy — biến đó thuộc về lần render này và vẫn là <code>0</code> cho tới khi lần render kế tạo ra một cái mới. React gộp ba cập nhật và render lại một lần, với <code>count = 1</code>.</p>

<h3>Vì sao React làm vậy: gộp lô (batching)</h3>
<p>React <strong>gộp lô</strong> mọi cập nhật state do cùng một sự kiện kích hoạt và render lại một lần ở cuối, không phải sau mỗi <code>setState</code>. Vì thế một handler đặt năm mẩu state chỉ gây một lần render lại, không phải năm — một lợi ích hiệu năng lớn, và là lý do <code>count</code> không thể đổi giữa handler. Mỗi lần render có bộ giá trị state, props và handler đóng băng của riêng nó; chính sự nhất quán đó làm React dự đoán được.</p>

<h3>Khi bạn cần giá trị mới nhất: hàm updater</h3>
<p>Khi state kế phụ thuộc state trước, đừng đọc ảnh chụp — hãy truyền một <em>hàm</em> vào setter. React gọi nó với giá trị đang chờ mới nhất và dùng kết quả trả về làm state kế:</p>
<pre><code>setCount(c =&gt; c + 1);
setCount(c =&gt; c + 1);
setCount(c =&gt; c + 1);</code></pre>
<p>Giờ mỗi lời gọi nhận kết quả của lời gọi trước nó. Cùng mô phỏng, dạng updater:</p>
<div class="out">count=0, three setCount(c=>c+1) => final: 3</div>
<p>Quy tắc đơn giản và đáng thuộc: <strong>nếu state mới được tính từ state cũ, hãy dùng dạng updater <code>setX(prev =&gt; ...)</code>.</strong> Nó luôn đúng, kể cả trong vòng lặp, timeout và code async nơi ảnh chụp sẽ bị cũ. Khi bạn đặt state thành một giá trị không liên quan tới cái cũ (<code>setName(input)</code>), dạng thường là ổn.</p>

<div class="callout warn">
<p><strong>Bug closure cũ kinh điển.</strong> Một <code>setInterval</code> làm <code>setCount(count + 1)</code> tăng tới 1 rồi kẹt ở đó, mãi mãi — callback của interval đã bắt <code>count</code> từ lần render tạo ra nó và không bao giờ thấy cái mới hơn. <code>setCount(c =&gt; c + 1)</code> sửa nó ngay, vì nó không bao giờ đọc ảnh chụp cũ. Bạn sẽ gặp lại đúng bug này ở Chương 5 với effect; nó là cùng một quy tắc ảnh chụp đội một cái mũ khác.</p>
</div>
<h3>Một lần render là một tấm ảnh chụp</h3>
<div class="lz-map">
  <div class="lz-stage">Mọi thứ trong một lần render nhìn thấy một bộ giá trị</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Các biến bị đóng băng cho lần render này</div><div class="lz-nsub">&#96;count&#96; là một &#96;const&#96; tạo ra lúc hàm chạy. Một lời gọi setter sau đó tạo ra một &#96;count&#96; mới trong một lời gọi mới — nó không bao giờ với ngược lại.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Handler sự kiện bắt lấy tấm ảnh đó</div><div class="lz-nsub">Một handler định nghĩa trong lần render thứ 3 sẽ thấy giá trị của lần render 3 mãi mãi, kể cả khi nó nổ sau lần render thứ 7.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Mọi thứ bạn hẹn giờ cũng vậy</div><div class="lz-nsub">&#96;setTimeout&#96;, một callback promise, một interval. Tất cả đều nhớ lần render đã tạo ra chúng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Dạng cập nhật bằng hàm thoát ra được</div><div class="lz-nsub">&#96;setX(prev =&gt; …)&#96; hỏi React giá trị hiện tại ngay lúc phép cập nhật được áp, chứ không lấy giá trị mà closure đã bắt.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — đọc state ngay sau khi vừa đặt nó.</strong> &#96;setOpen(true); if (open) doSomething();&#96; chẳng bao giờ chạy phần thân, và nó trông như setter đã hỏng. Không hề: &#96;open&#96; là một hằng thuộc về lần render này, và nó sẽ không đổi cho tới khi React chạy lại component. Cùng hình dạng ấy hiện ra ở &#96;setItems([...items, x]); console.log(items.length)&#96; in ra độ dài cũ, và ở một phép kiểm dữ liệu đọc đúng cái trường nó vừa đặt. Khi bạn cần giá trị mới thì bạn đã có nó rồi — hãy dùng chính biểu thức bạn truyền vào setter. Còn khi phần việc phải xảy ra SAU lần render thì đó là việc của một effect.</p></div>
<a class="link-card dl" href="https://react.dev/learn/state-as-a-snapshot" target="_blank" rel="noopener">
  <span class="lc-ico">📸</span>
  <span class="lc-body"><span class="lc-title">react.dev — State như một tấm ảnh chụp</span><span class="lc-sub">Mô hình tư duy mà bài này dựng trên đó, kèm ví dụ chạy được.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/referencing-values-with-refs" target="_blank" rel="noopener">
  <span class="lc-ico">📌</span>
  <span class="lc-body"><span class="lc-title">react.dev — Tham chiếu giá trị bằng ref</span><span class="lc-sub">Khi nào bạn thật sự cần một giá trị sống qua các lần render mà không gây ra render.</span></span>
</a>

</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Updating objects and arrays without mutating|||3.3 — Cập nhật object và mảng mà không mutate',
      slug: 'nextjs-3-3-khong-mutate',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'React phát hiện thay đổi bằng so sánh tham chiếu. Sửa tại chỗ một object/mảng state không render lại; phải tạo giá trị mới.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Treat state as immutable — always make a new one</h2>
<p class="lead">When state is a number or string, the setter is obvious. When it's an object or an array, there is a trap that catches everyone once: changing the object in place does not re-render, because React decides "did this change?" by comparing the <em>reference</em>, not the contents.</p>

<h3>Why mutation fails silently</h3>
<pre><code>const [user, setUser] = useState({ name: 'An', age: 20 });

<span class="tok-comment">// ❌ mutating the existing object</span>
function birthday() {
  user.age = 21;       <span class="tok-comment">// changes the object…</span>
  setUser(user);       <span class="tok-comment">// …but hands React the SAME reference</span>
}</code></pre>
<p>React compares the new state to the old with <code>Object.is</code> — essentially <code>===</code>. You passed the same object back, so <code>oldUser === newUser</code> is <code>true</code>, and React concludes nothing changed and skips the re-render. The data is updated but the screen is stale. This is the single most common "why won't it update" question in React.</p>

<h3>The fix: build a new object</h3>
<p>Copy the old one and override what changed, with the spread operator:</p>
<pre><code>function birthday() {
  setUser({ ...user, age: 21 });   <span class="tok-comment">// ✅ a brand-new object → new reference → re-render</span>
}</code></pre>
<p><code>{ ...user, age: 21 }</code> creates a fresh object with all of <code>user</code>'s fields, then overrides <code>age</code>. New reference, React sees the change, re-renders. Same principle for nested updates — copy each level you touch:</p>
<pre><code>setUser({ ...user, address: { ...user.address, city: 'Hanoi' } });</code></pre>

<h3>Arrays: the non-mutating methods, not the mutating ones</h3>
<p>JavaScript's array methods split into two camps. State updates must use the ones that <em>return a new array</em> and avoid the ones that change in place:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Add</span><span class="v"><code>[...list, item]</code> — not <code>list.push(item)</code></span></div>
  <div class="kv"><span class="k">Remove</span><span class="v"><code>list.filter(x =&gt; x.id !== id)</code> — not <code>list.splice(...)</code></span></div>
  <div class="kv"><span class="k">Update one</span><span class="v"><code>list.map(x =&gt; x.id === id ? { ...x, done: true } : x)</code></span></div>
  <div class="kv"><span class="k">Sort / reverse</span><span class="v"><code>[...list].sort(...)</code> — copy first; <code>sort</code> mutates!</span></div>
</div>
<pre><code>setTodos([...todos, newTodo]);                           <span class="tok-comment">// add</span>
setTodos(todos.filter(t =&gt; t.id !== id));                <span class="tok-comment">// remove</span>
setTodos(todos.map(t =&gt; t.id === id ? { ...t, done: true } : t));  <span class="tok-comment">// toggle</span></code></pre>
<p>Notice <code>map</code> returns a new array <em>and</em> new objects only where they changed — the unchanged items keep their identity, which lets React skip re-rendering them (Chapter 7). <code>push</code>, <code>pop</code>, <code>splice</code>, <code>sort</code>, <code>reverse</code> all mutate; treat them as banned inside a setter unless you copied first.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it</strong> — every list update in the app (a new message appended to a thread, a like toggled, an item removed from a cart) goes through <code>[...prev, x]</code>, <code>filter</code>, or <code>map</code>, never a mutation. Some feature stores use Immer (via Zustand's <code>immer</code> middleware, Chapter 14) so you can <em>write</em> mutating-looking code and it produces a new immutable state under the hood — but the rule it enforces is exactly this one.</p>
</div>
<h3>Why React needs a new object</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It compares by identity</b> — &#96;Object.is(oldState, newState)&#96;. Same reference means &quot;nothing changed&quot; — even if you edited every field inside it.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Mutating keeps the reference</b> — &#96;items.push(x)&#96; changes the array in place, so old and new are the same object and React skips the render entirely.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Copy the levels you change</b> — &#96;[...items, x]&#96; for an array, &#96;{ ...user, name }&#96; for an object. Only the path you touch needs copying, not the whole tree.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>The screen then follows the data</b> — This is the whole contract: state is the source of truth, and a new value is how you say the truth changed.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a nested update that copies only the top level.</strong> &#96;setUser({ ...user, address: user.address })&#96; then &#96;user.address.city = &#39;X&#39;&#96; mutates the original: the spread copied the reference to &#96;address&#96;, not the object. So the top level is new (React re-renders) while the nested object is shared — and any other state holding the old user now shows the new city too, which surfaces as &quot;editing one row changed all of them&quot;. Copy every level on the path you change: &#96;{ ...user, address: { ...user.address, city } }&#96;. For deeper shapes, flatten the state or reach for Immer, which lets you write the mutation and produces the copies for you.</p></div>
<a class="link-card dl" href="https://react.dev/learn/updating-objects-in-state" target="_blank" rel="noopener">
  <span class="lc-ico">🧊</span>
  <span class="lc-body"><span class="lc-title">react.dev — Updating objects in state</span><span class="lc-sub">Copying nested shapes, and why the shallow spread is not enough.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/updating-arrays-in-state" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">react.dev — Updating arrays in state</span><span class="lc-sub">A table of which array methods mutate and what to use instead.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Coi state là bất biến — luôn tạo một cái mới</h2>
<p class="lead">Khi state là số hay chuỗi, setter rõ ràng. Khi nó là object hay mảng, có một cái bẫy bắt được ai cũng một lần: đổi object tại chỗ không render lại, vì React quyết "cái này có đổi không?" bằng cách so <em>tham chiếu</em>, không phải nội dung.</p>

<h3>Vì sao mutate hỏng một cách âm thầm</h3>
<pre><code>const [user, setUser] = useState({ name: 'An', age: 20 });

<span class="tok-comment">// ❌ mutate object đang có</span>
function birthday() {
  user.age = 21;       <span class="tok-comment">// đổi object…</span>
  setUser(user);       <span class="tok-comment">// …nhưng trao cho React CÙNG một tham chiếu</span>
}</code></pre>
<p>React so state mới với cũ bằng <code>Object.is</code> — về cơ bản là <code>===</code>. Bạn truyền lại cùng object, nên <code>oldUser === newUser</code> là <code>true</code>, và React kết luận không có gì đổi rồi bỏ qua render lại. Dữ liệu đã cập nhật nhưng màn hình cũ. Đây là câu hỏi "sao nó không cập nhật" phổ biến bậc nhất trong React.</p>

<h3>Cách sửa: dựng một object mới</h3>
<p>Sao chép cái cũ rồi ghi đè phần đã đổi, bằng toán tử spread:</p>
<pre><code>function birthday() {
  setUser({ ...user, age: 21 });   <span class="tok-comment">// ✅ object hoàn toàn mới → tham chiếu mới → render lại</span>
}</code></pre>
<p><code>{ ...user, age: 21 }</code> tạo một object mới tinh với tất cả các trường của <code>user</code>, rồi ghi đè <code>age</code>. Tham chiếu mới, React thấy thay đổi, render lại. Cùng nguyên tắc cho cập nhật lồng — sao chép từng tầng bạn chạm tới:</p>
<pre><code>setUser({ ...user, address: { ...user.address, city: 'Hanoi' } });</code></pre>

<h3>Mảng: dùng phương thức không-mutate, không dùng loại mutate</h3>
<p>Các phương thức mảng của JavaScript chia hai phe. Cập nhật state phải dùng loại <em>trả về một mảng mới</em> và tránh loại đổi tại chỗ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Thêm</span><span class="v"><code>[...list, item]</code> — không phải <code>list.push(item)</code></span></div>
  <div class="kv"><span class="k">Xoá</span><span class="v"><code>list.filter(x =&gt; x.id !== id)</code> — không phải <code>list.splice(...)</code></span></div>
  <div class="kv"><span class="k">Sửa một cái</span><span class="v"><code>list.map(x =&gt; x.id === id ? { ...x, done: true } : x)</code></span></div>
  <div class="kv"><span class="k">Sắp / đảo</span><span class="v"><code>[...list].sort(...)</code> — sao chép trước; <code>sort</code> mutate!</span></div>
</div>
<pre><code>setTodos([...todos, newTodo]);                           <span class="tok-comment">// thêm</span>
setTodos(todos.filter(t =&gt; t.id !== id));                <span class="tok-comment">// xoá</span>
setTodos(todos.map(t =&gt; t.id === id ? { ...t, done: true } : t));  <span class="tok-comment">// bật/tắt</span></code></pre>
<p>Để ý <code>map</code> trả về một mảng mới <em>và</em> object mới chỉ ở chỗ đã đổi — các phần tử không đổi giữ nguyên danh tính, việc này cho React bỏ qua render lại chúng (Chương 7). <code>push</code>, <code>pop</code>, <code>splice</code>, <code>sort</code>, <code>reverse</code> đều mutate; hãy coi chúng bị cấm trong một setter trừ khi bạn đã sao chép trước.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào</strong> — mọi cập nhật danh sách trong app (một tin nhắn mới nối vào luồng, một cú like bật/tắt, một món bỏ khỏi giỏ) đều đi qua <code>[...prev, x]</code>, <code>filter</code>, hoặc <code>map</code>, không bao giờ mutate. Một số store tính năng dùng Immer (qua middleware <code>immer</code> của Zustand, Chương 14) để bạn có thể <em>viết</em> code trông như mutate mà nó tạo ra một state bất biến mới ở bên dưới — nhưng quy tắc nó áp đặt chính là quy tắc này.</p>
</div>
<h3>Vì sao React cần một object mới</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó so theo danh tính</b> — &#96;Object.is(oldState, newState)&#96;. Cùng tham chiếu nghĩa là &quot;chẳng có gì đổi&quot; — kể cả khi bạn đã sửa mọi field bên trong.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Sửa tại chỗ thì giữ nguyên tham chiếu</b> — &#96;items.push(x)&#96; đổi mảng ngay tại chỗ, nên cũ và mới là cùng một object và React bỏ qua luôn lần render.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Chép những tầng bạn thay đổi</b> — &#96;[...items, x]&#96; cho mảng, &#96;{ ...user, name }&#96; cho object. Chỉ cần chép đúng đường bạn chạm tới, không cần chép cả cây.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Rồi màn hình đi theo dữ liệu</b> — Đó là toàn bộ bản hợp đồng: state là nguồn sự thật, và một giá trị mới là cách bạn nói rằng sự thật đã đổi.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một phép cập nhật lồng nhau mà chỉ chép tầng trên cùng.</strong> &#96;setUser({ ...user, address: user.address })&#96; rồi &#96;user.address.city = &#39;X&#39;&#96; là sửa thẳng vào bản gốc: phép trải đã chép cái tham chiếu tới &#96;address&#96;, chứ không chép cái object. Nên tầng trên cùng là mới (React render lại) trong khi object lồng bên trong thì dùng chung — và mọi state khác đang giữ user cũ giờ cũng hiện thành phố mới, lộ ra dưới dạng &quot;sửa một dòng thì cả đám cùng đổi&quot;. Hãy chép mọi tầng trên đường bạn thay đổi: &#96;{ ...user, address: { ...user.address, city } }&#96;. Với những dáng sâu hơn, hãy làm phẳng state lại hoặc với tay tới Immer, thứ cho bạn viết như đang sửa tại chỗ mà vẫn sinh ra các bản chép.</p></div>
<a class="link-card dl" href="https://react.dev/learn/updating-objects-in-state" target="_blank" rel="noopener">
  <span class="lc-ico">🧊</span>
  <span class="lc-body"><span class="lc-title">react.dev — Cập nhật object trong state</span><span class="lc-sub">Chép các dáng lồng nhau, và vì sao phép trải nông là không đủ.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/updating-arrays-in-state" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">react.dev — Cập nhật mảng trong state</span><span class="lc-sub">Bảng liệt kê phương thức mảng nào sửa tại chỗ và nên dùng gì thay thế.</span></span>
</a>

</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Where state should live|||3.4 — State nên nằm ở đâu',
      slug: 'nextjs-3-4-state-o-dau',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Giữ state cục bộ khi được, nâng lên cha chung khi cần chia sẻ, và ĐỪNG lưu vào state cái có thể tính ra từ props/state khác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Deciding where each piece of state belongs</h2>
<p class="lead">A lot of React bugs are really "state in the wrong place" bugs. Three questions settle almost every case: does this even need to be state, and if so, how many components need it, and who is their common parent?</p>

<h3>1 · Don't put in state what you can derive</h3>
<p>The biggest beginner mistake is storing values that can be <em>computed</em> from existing state or props. If you have <code>items</code> in state, the count is <code>items.length</code> — not a second state variable:</p>
<pre><code><span class="tok-comment">// ❌ redundant state that can drift out of sync</span>
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);   <span class="tok-comment">// now you must remember to update BOTH</span>

<span class="tok-comment">// ✅ derive it during render</span>
const [items, setItems] = useState([]);
const count = items.length;              <span class="tok-comment">// always correct, for free</span></code></pre>
<p>Every redundant piece of state is a chance for two sources of truth to disagree — the exact bug class React was built to kill. The rule: <strong>if you can calculate it from existing state or props during render, calculate it; don't store it.</strong> A full name from first + last, a filtered list from a list + a query, a total from line items — all derived, never stored.</p>

<h3>2 · Keep state as local as possible</h3>
<p>State should live in the component that needs it, and no higher. A dropdown's open/closed flag belongs inside the dropdown, not in the page. Local state keeps components self-contained and limits what re-renders when it changes. Start local; move it up only when a second component genuinely needs it.</p>

<h3>3 · Lift state up when siblings must share it</h3>
<p>When two components need the same state — a filter input and the list it filters — you can't keep it in either one, because siblings can't see each other's state. Move it to their nearest common parent, and pass it down: the value as a prop, and a setter (wrapped in a callback) as another prop. This is <strong>lifting state up</strong>:</p>
<pre><code>function FilterablePage() {
  const [query, setQuery] = useState('');           <span class="tok-comment">// the shared state lives here</span>
  return (
    &lt;&gt;
      &lt;SearchInput value={query} onChange={setQuery} /&gt;   <span class="tok-comment">// writes it</span>
      &lt;Results query={query} /&gt;                            <span class="tok-comment">// reads it</span>
    &lt;/&gt;
  );
}</code></pre>
<p>The parent owns the state; the children become controlled by it. <code>SearchInput</code> reports changes upward through <code>onChange</code>; <code>Results</code> reads the value downward through <code>query</code>. Now there is exactly one source of truth for the query, and both children always agree.</p>

<div class="callout warn">
<p><strong>When lifting goes too far: prop drilling.</strong> If shared state has to pass through many intermediate components that don't use it — just forwarding it down, level after level — that's <em>prop drilling</em>, and it's a signal. Chapter 6 introduces <code>useContext</code> for state that many distant components need (the theme, the current user), and Chapter 14 covers dedicated state libraries for app-wide state. Lifting is the right first move; reach for those only when lifting starts hurting.</p>
</div>

<div class="callout ok">
<p><strong>Chapter 4 next:</strong> events and forms — where the setters from this chapter actually get called. You'll build controlled inputs, the pattern behind every real form, and see lifting state up in its natural habitat. After that, Progress Test 1 covers Chapters 1–4.</p>
</div>
<h3>Deciding where a piece of state belongs</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Can you compute it instead?</b> — A filtered list, a total, a &quot;form is valid&quot; flag. Derived values should be calculated during render, not stored — stored copies go stale.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Only one component uses it?</b> — Keep it there. State in the component that owns it is the cheapest thing to reason about and to delete later.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Two siblings need it?</b> — Lift it to their closest common parent and pass it down, with a setter for whoever changes it.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Half the app needs it?</b> — Context, or a store. But check first that it is not really server data — that belongs in a cache, not in component state.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — copying a prop into state so you can edit it.</strong> &#96;const [name, setName] = useState(props.name)&#96; reads the prop once, on the first render, and then ignores it forever: when the parent passes a different user, the input still shows the old name, because &#96;useState&#96;&#39;s argument is an initial value, not a binding. It looks like a caching bug and it is a design one — there are now two sources of truth for the same fact. Either let the parent own the value and pass a change handler down, or, if you deliberately want an editable copy that resets per record, give the component a &#96;key&#96; so React remounts it when the record changes.</p></div>
<a class="link-card dl" href="https://react.dev/learn/choosing-the-state-structure" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Choosing the state structure</span><span class="lc-sub">Redundant state, contradictory state, and how to spot both.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">react.dev — You might not need an Effect</span><span class="lc-sub">Half the cases in this lesson end here: the value should be computed, not stored and synced.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Quyết mỗi mẩu state thuộc về đâu</h2>
<p class="lead">Nhiều bug React thật ra là bug "state đặt sai chỗ". Ba câu hỏi giải quyết gần như mọi trường hợp: cái này có cần là state không, nếu có thì bao nhiêu component cần nó, và cha chung của chúng là ai?</p>

<h3>1 · Đừng đưa vào state cái bạn có thể suy ra</h3>
<p>Lỗi người mới lớn nhất là lưu những giá trị có thể <em>tính</em> từ state hoặc props đang có. Nếu bạn có <code>items</code> trong state, số lượng là <code>items.length</code> — không phải một biến state thứ hai:</p>
<pre><code><span class="tok-comment">// ❌ state thừa, có thể lệch nhau</span>
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);   <span class="tok-comment">// giờ phải nhớ cập nhật CẢ HAI</span>

<span class="tok-comment">// ✅ suy ra trong lúc render</span>
const [items, setItems] = useState([]);
const count = items.length;              <span class="tok-comment">// luôn đúng, miễn phí</span></code></pre>
<p>Mỗi mẩu state thừa là một cơ hội để hai nguồn sự thật bất đồng — đúng loại bug React sinh ra để diệt. Quy tắc: <strong>nếu bạn có thể tính nó từ state hoặc props đang có trong lúc render, hãy tính; đừng lưu.</strong> Họ tên đầy đủ từ họ + tên, một danh sách đã lọc từ danh sách + từ khoá, một tổng từ các dòng hàng — đều suy ra, không bao giờ lưu.</p>

<h3>2 · Giữ state cục bộ hết mức</h3>
<p>State nên nằm ở component cần nó, và không cao hơn. Cờ mở/đóng của một dropdown thuộc bên trong dropdown, không phải ở trang. State cục bộ giữ component tự chứa và giới hạn cái gì render lại khi nó đổi. Bắt đầu cục bộ; chỉ đưa lên khi một component thứ hai thật sự cần.</p>

<h3>3 · Nâng state lên khi anh em phải chia sẻ</h3>
<p>Khi hai component cần cùng state — một ô lọc và danh sách nó lọc — bạn không thể giữ nó ở một trong hai, vì anh em không thấy state của nhau. Hãy chuyển nó lên cha chung gần nhất, và truyền xuống: giá trị làm một prop, và một setter (bọc trong một callback) làm một prop khác. Đây là <strong>nâng state lên</strong>:</p>
<pre><code>function FilterablePage() {
  const [query, setQuery] = useState('');           <span class="tok-comment">// state chung nằm ở đây</span>
  return (
    &lt;&gt;
      &lt;SearchInput value={query} onChange={setQuery} /&gt;   <span class="tok-comment">// ghi nó</span>
      &lt;Results query={query} /&gt;                            <span class="tok-comment">// đọc nó</span>
    &lt;/&gt;
  );
}</code></pre>
<p>Cha sở hữu state; các con trở thành được nó kiểm soát. <code>SearchInput</code> báo thay đổi lên trên qua <code>onChange</code>; <code>Results</code> đọc giá trị xuống dưới qua <code>query</code>. Giờ có đúng một nguồn sự thật cho từ khoá, và cả hai con luôn nhất trí.</p>

<div class="callout warn">
<p><strong>Khi nâng đi quá xa: prop drilling.</strong> Nếu state chung phải đi qua nhiều component trung gian không dùng nó — chỉ chuyển tiếp xuống, tầng này tới tầng khác — đó là <em>prop drilling</em>, và nó là một tín hiệu. Chương 6 giới thiệu <code>useContext</code> cho state mà nhiều component xa nhau cần (theme, người dùng hiện tại), và Chương 14 bàn các thư viện state chuyên dụng cho state toàn app. Nâng lên là nước đi đầu đúng; chỉ với tới những thứ kia khi nâng bắt đầu gây đau.</p>
</div>

<div class="callout ok">
<p><strong>Chương 4 tiếp theo:</strong> sự kiện và form — nơi các setter của chương này thật sự được gọi. Bạn sẽ dựng input có kiểm soát, khuôn mẫu đằng sau mọi form thật, và thấy nâng state lên trong môi trường tự nhiên của nó. Sau đó, Bài kiểm tra tiến độ 1 phủ Chương 1–4.</p>
</div>
<h3>Quyết định một mẩu state thuộc về đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Bạn tính ra nó được không?</b> — Một danh sách đã lọc, một con số tổng, một cờ &quot;form hợp lệ&quot;. Giá trị dẫn xuất nên được tính trong lúc render, đừng lưu lại — bản lưu sẽ cũ đi.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Chỉ một component dùng nó?</b> — Hãy để nó ở đó. State nằm trong component sở hữu nó là thứ rẻ nhất để suy luận và để xoá sau này.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Hai anh em cùng cần?</b> — Hãy nâng nó lên phần tử cha chung gần nhất rồi truyền xuống, kèm một setter cho bên nào thay đổi nó.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nửa ứng dụng cần?</b> — Context, hoặc một store. Nhưng hãy kiểm trước xem nó có thật sự là dữ liệu máy chủ không — thứ đó thuộc về một bộ nhớ đệm, không thuộc về state của component.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — chép một prop vào state để sửa được nó.</strong> &#96;const [name, setName] = useState(props.name)&#96; đọc cái prop đúng một lần, ở lần render đầu, rồi lờ nó đi mãi mãi: khi cha truyền xuống một người dùng khác, ô nhập vẫn hiện cái tên cũ, vì đối số của &#96;useState&#96; là một giá trị KHỞI TẠO chứ không phải một mối ràng buộc. Nó trông như lỗi bộ nhớ đệm mà thật ra là lỗi thiết kế — giờ có hai nguồn sự thật cho cùng một sự việc. Hoặc để cha sở hữu giá trị rồi truyền một handler thay đổi xuống, hoặc, nếu bạn cố tình muốn một bản chép sửa được và đặt lại theo từng bản ghi, hãy cho component một &#96;key&#96; để React dựng lại nó khi bản ghi đổi.</p></div>
<a class="link-card dl" href="https://react.dev/learn/choosing-the-state-structure" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Chọn cấu trúc state</span><span class="lc-sub">State thừa, state mâu thuẫn, và cách nhận ra cả hai.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">react.dev — Có thể bạn không cần Effect</span><span class="lc-sub">Một nửa số ca trong bài này kết thúc ở đây: giá trị nên được tính ra, đừng lưu rồi đồng bộ.</span></span>
</a>

</div>
`,
    },

    /* ─────────────────────────── 3.5 quiz ─────────────────────────── */
    {
      title: '3.5 — Chapter 3 quiz|||3.5 — Kiểm tra chương 3',
      slug: 'nextjs-3-5-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về useState, state là ảnh chụp, dạng updater, không-mutate, state suy ra và nâng state lên.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 3: <code>useState</code>, state as a snapshot, the updater form, immutable updates, derived state, and lifting state up. Predict the value before you answer.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 3: <code>useState</code>, state là ảnh chụp, dạng updater, cập nhật bất biến, state suy ra, và nâng state lên. Hãy đoán giá trị trước khi trả lời.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Starting from count=0, an onClick runs setCount(count+1) three times. What is count after the click?|||Bắt đầu từ count=0, một onClick chạy setCount(count+1) ba lần. count bằng bao nhiêu sau cú click?',
            options: ['3', '1', '0', 'undefined'],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does calling setCount(count+1) three times only reach 1?|||Vì sao gọi setCount(count+1) ba lần chỉ tới 1?',
            options: [
              'React ignores duplicate calls|||React bỏ qua các lời gọi trùng',
              'count is a snapshot fixed for this render; all three read the same 0|||count là một ảnh chụp cố định cho lần render này; cả ba đọc cùng số 0',
              'setCount is asynchronous and only the last wins|||setCount bất đồng bộ và chỉ cái cuối thắng',
              'It is a bug in React|||Đó là một lỗi của React',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which reliably increments by 3 across three calls?|||Cái nào tăng đúng 3 qua ba lời gọi?',
            options: [
              'setCount(count + 1) three times|||setCount(count + 1) ba lần',
              'setCount(c => c + 1) three times|||setCount(c => c + 1) ba lần',
              'count = count + 3|||count = count + 3',
              'setCount(count + 3) then setCount(count + 3)|||setCount(count + 3) rồi setCount(count + 3)',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You do user.age = 21; setUser(user). The screen does not update. Why?|||Bạn làm user.age = 21; setUser(user). Màn hình không cập nhật. Vì sao?',
            options: [
              'age must be a string|||age phải là chuỗi',
              'You passed the same object reference; React sees no change with Object.is|||Bạn truyền cùng tham chiếu object; React thấy không đổi qua Object.is',
              'setUser only works with numbers|||setUser chỉ chạy với số',
              'You need two setUser calls|||Bạn cần hai lời gọi setUser',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Correct way to add an item to a todos array in state?|||Cách đúng để thêm một món vào mảng todos trong state?',
            options: [
              'todos.push(item); setTodos(todos)|||todos.push(item); setTodos(todos)',
              'setTodos([...todos, item])|||setTodos([...todos, item])',
              'todos[todos.length] = item|||todos[todos.length] = item',
              'setTodos(todos.push(item))|||setTodos(todos.push(item))',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which array method MUTATES and must be avoided directly on state?|||Phương thức mảng nào MUTATE và phải tránh dùng trực tiếp trên state?',
            options: [
              'map', 'filter', 'sort', 'slice',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You have items in state and need the count. Best approach?|||Bạn có items trong state và cần số lượng. Cách tốt nhất?',
            options: [
              'Add a separate count state and update both|||Thêm một state count riêng và cập nhật cả hai',
              'Derive it during render: const count = items.length|||Suy ra trong lúc render: const count = items.length',
              'Store count in a ref|||Lưu count trong một ref',
              'Recompute it in a useEffect|||Tính lại nó trong một useEffect',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Two sibling components need the same query value. Where should it live?|||Hai component anh em cần cùng giá trị query. Nó nên nằm ở đâu?',
            options: [
              'In each sibling separately|||Trong mỗi anh em riêng',
              'In their nearest common parent, passed down (lifting state up)|||Ở cha chung gần nhất, truyền xuống (nâng state lên)',
              'In a module-level variable|||Trong một biến cấp module',
              'It cannot be shared|||Không thể chia sẻ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Calling a state setter does what, besides saving the value?|||Gọi một setter state làm gì, ngoài việc lưu giá trị?',
            options: [
              'Nothing else|||Không gì thêm',
              'Schedules a re-render of the component|||Lên lịch render lại component',
              'Immediately changes the local variable in the running function|||Đổi ngay biến cục bộ trong hàm đang chạy',
              'Reloads the page|||Tải lại trang',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why must hooks like useState be called at the top level, never inside an if?|||Vì sao hook như useState phải gọi ở cấp cao nhất, không bao giờ trong một if?',
            options: [
              'It is just a style preference|||Chỉ là sở thích phong cách',
              'React tracks state by call order; a conditional hook shifts the order and corrupts later hooks|||React theo dõi state theo thứ tự gọi; một hook có điều kiện làm lệch thứ tự và hỏng các hook sau',
              'if statements are banned in components|||Câu if bị cấm trong component',
              'Hooks are slower inside conditions|||Hook chạy chậm hơn trong điều kiện',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
