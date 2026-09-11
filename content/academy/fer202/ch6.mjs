/**
 * FER202 · Chapter 6 additions — Event Handling & reusable components
 * (Slot 11–12, 33 slides: event handlers, synthetic events, event pooling,
 * Render & Commit, State as a snapshot) plus Exercises 16 (event handling),
 * 17 (render & commit) and 18 (state as a snapshot). Grounded slide-by-slide
 * in Slot11,12_Event-Handling-&-reusable-components.pptx. Spliced into
 * Chapter 6 before its quiz; existing 6.1 lesson untouched.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const CODELAB = `/code-lab/react${REF}`;

const SLIDES = {
  title: '6.2 — Slide by slide: Event handling, Render & Commit, State as a snapshot (Slot 11–12)|||6.2 — Học theo từng slide: Xử lý sự kiện, Render & Commit, State là ảnh chụp (Slot 11–12)',
  slug: 'fer202-6-2-slot11-events-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 33 slide Slot 11–12: khai báo event handler (named/inline/higher-order), context & tham số, SyntheticEvent & event pooling; ba bước Render & Commit (trigger → render → commit); và “state là ảnh chụp” — vì sao state không đổi ngay sau khi set.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 6 · Lesson 6.2 · Slot 11–12 deck (33 slides)</span>
<h2>Events and how React actually renders, slide by slide</h2>
<p class="lead">Three deep topics in one deck: how to handle events, the three-step <strong>Render &amp; Commit</strong> process, and why <strong>state behaves like a snapshot</strong> (the #1 source of "why didn't my state update?" confusion). Exercises 16–18 follow.</p>`,
      `<span class="eyebrow">Chương 6 · Bài 6.2 · Bộ slide Slot 11–12 (33 slide)</span>
<h2>Sự kiện và cách React thực sự render, theo từng slide</h2>
<p class="lead">Ba chủ đề sâu trong một bộ slide: cách xử lý sự kiện, quy trình ba bước <strong>Render &amp; Commit</strong>, và vì sao <strong>state hành xử như một ảnh chụp</strong> (nguồn số 1 của thắc mắc "sao state của tôi không đổi?"). Exercise 16–18 nằm ngay sau.</p>`,
    ),
    walkHead('slot11_12', 1, 33),
    walk('slot11_12', [
      [1, 'Event Handling and Reusable Components', `<p>Title slide.</p>`, `<p>Slide bìa.</p>`],
      [2, 'Objectives', `<p>The map: declaring event handlers, handler context &amp; parameters, inline handlers, binding to elements, synthetic events, event pooling, then Render &amp; Commit and State as a snapshot.</p>`, `<p>Bản đồ: khai báo event handler, context &amp; tham số, inline handler, gắn vào phần tử, synthetic event, event pooling, rồi Render &amp; Commit và State là ảnh chụp.</p>`],
      [3, 'Event Handling', `<p>Section divider.</p>`, `<p>Slide phân mục.</p>`],
      [4, 'Responding to events', `<p>React lets you add event handlers to JSX — your own functions triggered by clicks, hovers, focus, etc. You will learn: different ways to write a handler, how to pass handling logic from a parent, and how events propagate and how to stop them.</p>`, `<p>React cho bạn gắn event handler vào JSX — các hàm của bạn được kích hoạt bởi click, hover, focus… Bạn sẽ học: nhiều cách viết handler, cách truyền logic xử lý từ component cha, và cách sự kiện lan truyền cùng cách chặn nó.</p>`],
      [5, 'Declaring event handlers', `<p>The basic form: a function passed to a JSX event prop — <code>&lt;button onClick={handleClick}&gt;</code>. Note: pass the function <em>reference</em> (<code>handleClick</code>), do not call it (<code>handleClick()</code> would run on render).</p>`, `<p>Dạng cơ bản: một hàm truyền vào prop sự kiện của JSX — <code>&lt;button onClick={handleClick}&gt;</code>. Lưu ý: truyền <em>tham chiếu</em> hàm (<code>handleClick</code>), đừng gọi nó (<code>handleClick()</code> sẽ chạy ngay lúc render).</p>`],
      [6, 'Declaring event handlers — multiple', `<p>A component can have several handlers (<code>handleSave</code>, <code>handleDelete</code>…), each wired to its own element. Keep handlers small and named for what they do.</p>`, `<p>Một component có thể có nhiều handler (<code>handleSave</code>, <code>handleDelete</code>…), mỗi cái gắn vào phần tử riêng. Giữ handler nhỏ và đặt tên theo việc nó làm.</p>`],
      [7, 'Declaring event handlers — importing generic handlers', `<p>Handlers can be shared: define a generic handler in one module and import it into components that need the same behaviour — reuse, not copy-paste.</p>`, `<p>Handler có thể dùng chung: định nghĩa một handler tổng quát trong một module rồi import vào các component cần cùng hành vi — tái sử dụng, không copy-paste.</p>`],
      [8, 'Handler context & parameters — getting component data', `<p>To give a handler extra data, wrap it in an arrow: <code>onClick={() =&gt; handleDelete(item.id)}</code>. The arrow captures <code>item.id</code> from the surrounding scope and passes it when clicked.</p>`, `<p>Để đưa dữ liệu thêm cho handler, bọc trong một arrow: <code>onClick={() =&gt; handleDelete(item.id)}</code>. Arrow bắt <code>item.id</code> từ phạm vi bao quanh và truyền khi bấm.</p>`],
      [9, 'Handler context & parameters — higher-order handlers', `<p>A <strong>higher-order handler</strong> is a function that returns a handler: <code>const onDelete = (id) =&gt; () =&gt; handleDelete(id)</code>, used as <code>onClick={onDelete(item.id)}</code>. Same goal as slide 8, factored for reuse in a list.</p>`, `<p><strong>Higher-order handler</strong> là hàm trả về một handler: <code>const onDelete = (id) =&gt; () =&gt; handleDelete(id)</code>, dùng như <code>onClick={onDelete(item.id)}</code>. Cùng mục tiêu slide 8, tách ra để tái dùng trong danh sách.</p>`],
      [10, 'Declaring inline event handlers', `<p>You can also write the handler inline: <code>onClick={() =&gt; setCount(c =&gt; c + 1)}</code>. Fine for one-liners; extract to a named function once the logic grows, for readability.</p>`, `<p>Bạn cũng có thể viết handler inline: <code>onClick={() =&gt; setCount(c =&gt; c + 1)}</code>. Ổn với một dòng; tách thành hàm có tên khi logic dài, để dễ đọc.</p>`],
      [11, 'Binding handlers to elements — event propagation', `<p>Events <strong>bubble</strong> up the DOM tree; React checks each component for a matching handler as the event travels. Call <code>e.stopPropagation()</code> to stop bubbling, <code>e.preventDefault()</code> to stop the browser's default (e.g. a form submit reloading the page).</p>`, `<p>Sự kiện <strong>nổi bọt</strong> lên cây DOM; React kiểm từng component xem có handler khớp không khi sự kiện đi qua. Gọi <code>e.stopPropagation()</code> để chặn bubbling, <code>e.preventDefault()</code> để chặn hành vi mặc định của trình duyệt (ví dụ form submit làm reload trang).</p>`],
      [12, 'Using synthetic event objects', `<p>React handlers receive a <strong>SyntheticEvent</strong>, not the native <code>Event</code> — a thin cross-browser wrapper. It (1) normalises browser inconsistencies into one consistent API and (2) carries the info needed for propagation. It has the familiar <code>target</code>, <code>preventDefault()</code>, etc.</p>`, `<p>Handler của React nhận một <strong>SyntheticEvent</strong>, không phải <code>Event</code> gốc — một lớp bọc mỏng đa trình duyệt. Nó (1) chuẩn hoá khác biệt giữa các browser thành một API nhất quán và (2) mang thông tin cần cho việc lan truyền. Nó có <code>target</code>, <code>preventDefault()</code>… quen thuộc.</p>`],
      [13, 'Understanding event pooling', `<p>Wrapping native events has a cost: each wrapper must be garbage-collected. Older React <strong>pooled</strong> (reused) synthetic events to save memory, which meant the event object was cleared after the handler ran — you could not read it asynchronously. <em>Note:</em> event pooling was <strong>removed in React 17+</strong>, so this caveat no longer applies in modern React.</p>`, `<p>Bọc sự kiện gốc có cái giá: mỗi wrapper phải được thu gom rác. React cũ <strong>gộp (pool)</strong> — tái dùng — synthetic event để tiết kiệm bộ nhớ, khiến object sự kiện bị xoá sau khi handler chạy — không đọc được bất đồng bộ. <em>Lưu ý:</em> event pooling đã <strong>bị bỏ từ React 17+</strong>, nên cảnh báo này không còn áp dụng trong React hiện đại.</p>`],
      [14, 'Exercise 16: Event handling', `<p>Hand-off to <strong>Exercise 16</strong> — practise the handler patterns above. Full brief in the next lesson.</p>`, `<p>Chuyển sang <strong>Exercise 16</strong> — luyện các mẫu handler ở trên. Đề đầy đủ ở bài kế.</p>`],
      [15, 'Render and Commit', `<p>Section divider — how React actually puts your UI on screen.</p>`, `<p>Slide phân mục — cách React thực sự đưa UI lên màn hình.</p>`],
      [16, 'What is Render and Commit?', `<p>Before components appear on screen they must be <strong>rendered</strong> by React. You will learn: what rendering means, when and why React renders, the steps to display a component, and why rendering does not always cause a DOM update.</p>`, `<p>Trước khi hiện trên màn hình, component phải được React <strong>render</strong>. Bạn sẽ học: render nghĩa là gì, khi nào và vì sao React render, các bước hiển thị một component, và vì sao render không phải lúc nào cũng gây cập nhật DOM.</p>`],
      [17, 'The kitchen scenario', `<p>The mental model: components are <strong>cooks</strong>, React is the <strong>waiter</strong>. Three steps: <strong>Trigger</strong> a render (deliver the order), <strong>Render</strong> the component (prepare it), <strong>Commit</strong> to the DOM (serve it). Learn these three words.</p>`, `<p>Mô hình tư duy: component là <strong>đầu bếp</strong>, React là <strong>bồi bàn</strong>. Ba bước: <strong>Trigger</strong> render (đưa order), <strong>Render</strong> component (nấu), <strong>Commit</strong> vào DOM (bưng ra). Nhớ ba từ này.</p>`],
      [18, 'Step 1: Trigger a render', `<p>A render is triggered for exactly two reasons: (1) the component's <strong>initial render</strong>, or (2) its (or an ancestor's) <strong>state was updated</strong>. There is no other way — this is why you change state to change the UI.</p>`, `<p>Một render được kích hoạt vì đúng hai lý do: (1) <strong>render lần đầu</strong> của component, hoặc (2) <strong>state của nó (hoặc tổ tiên) được cập nhật</strong>. Không có cách nào khác — đó là lý do bạn đổi state để đổi UI.</p>`],
      [19, 'Step 1 — re-renders when state updates', `<p>Every <code>setState</code>/<code>setX</code> call queues a re-render of that component and its descendants. Props changing alone does not trigger a render unless the parent re-rendered (which happened because <em>its</em> state changed).</p>`, `<p>Mỗi lời gọi <code>setState</code>/<code>setX</code> xếp hàng một lần re-render cho component đó và con cháu. Chỉ props đổi không tự kích hoạt render, trừ khi cha đã re-render (vì state của <em>cha</em> đổi).</p>`],
      [20, 'Step 2: React renders your components', `<p>"Rendering" = <strong>React calling your component function</strong>. On initial render it calls the root; on re-renders it calls the component whose state changed (and its children). React works out which DOM properties changed but does <em>nothing</em> to the DOM yet — that is the commit step.</p>`, `<p>"Render" = <strong>React gọi hàm component của bạn</strong>. Lần đầu nó gọi gốc; các lần sau nó gọi component có state đổi (và con). React tính xem thuộc tính DOM nào đổi nhưng <em>chưa</em> đụng DOM — đó là bước commit.</p>`],
      [21, 'Step 2 — cont’d', `<p>Key point: rendering is <strong>pure</strong> — calling your component should only compute JSX from props/state, with no side effects. Same inputs → same JSX. This is what lets React call it as often as needed.</p>`, `<p>Điểm mấu chốt: render phải <strong>thuần khiết</strong> — gọi component chỉ nên tính JSX từ props/state, không side effect. Cùng đầu vào → cùng JSX. Nhờ vậy React gọi nó bao nhiêu lần tuỳ ý.</p>`],
      [22, 'Step 3: React commits to the DOM', `<p>After rendering, React <strong>modifies the DOM</strong>. On initial render it uses <code>appendChild()</code> to add all nodes. On re-renders it applies the <strong>minimal necessary operations</strong> (computed during render) to make the DOM match. If nothing changed, it touches nothing — that is why rendering ≠ DOM update.</p>`, `<p>Sau khi render, React <strong>sửa DOM</strong>. Lần đầu nó dùng <code>appendChild()</code> thêm mọi node. Các lần sau nó áp <strong>tập thao tác tối thiểu</strong> (đã tính khi render) để DOM khớp. Nếu không có gì đổi, nó không đụng gì — đó là lý do render ≠ cập nhật DOM.</p>`],
      [23, 'Step 3 — cont’d', `<p>After commit, the browser <strong>paints</strong> the screen. React does not control paint — but by minimising DOM operations it keeps paint fast. This whole trigger→render→commit→paint cycle is what "React is fast" means.</p>`, `<p>Sau commit, trình duyệt <strong>vẽ (paint)</strong> màn hình. React không điều khiển paint — nhưng bằng cách giảm thao tác DOM, nó giữ paint nhanh. Cả chu trình trigger→render→commit→paint chính là ý nghĩa của "React nhanh".</p>`],
      [24, 'Exercise 17: Render and Commit', `<p>Hand-off to <strong>Exercise 17</strong> — observe the render/commit cycle. Full brief in the next lesson.</p>`, `<p>Chuyển sang <strong>Exercise 17</strong> — quan sát chu trình render/commit. Đề đầy đủ ở bài kế.</p>`],
      [25, 'State as a Snapshot', `<p>Section divider — the most important mental shift in the deck.</p>`, `<p>Slide phân mục — cú chuyển tư duy quan trọng nhất của bộ slide.</p>`],
      [26, 'State behaves like a snapshot', `<p>State variables <em>look</em> like normal variables but behave like a <strong>snapshot</strong>. Setting state does not change the variable you already have — it <strong>triggers a re-render</strong>. You will learn why state does not update immediately and how handlers see a "snapshot".</p>`, `<p>Biến state <em>trông</em> như biến thường nhưng hành xử như một <strong>ảnh chụp</strong>. Set state không đổi biến bạn đang có — nó <strong>kích hoạt re-render</strong>. Bạn sẽ hiểu vì sao state không cập nhật ngay và vì sao handler thấy một "ảnh chụp".</p>`],
      [27, 'Setting state triggers renders', `<p>To make the UI react, you must update state. On a click: the handler runs → <code>setIsSent(true)</code> sets the value <em>and queues a render</em> → React re-renders with the new value. The UI changes because of the re-render, not the assignment itself.</p>`, `<p>Để UI phản ứng, bạn phải cập nhật state. Khi bấm: handler chạy → <code>setIsSent(true)</code> đặt giá trị <em>và xếp hàng một render</em> → React re-render với giá trị mới. UI đổi là nhờ re-render, không phải nhờ phép gán.</p>`],
      [28, 'Setting state triggers renders — cont’d', `<p>The classic gotcha: after <code>setCount(count + 1)</code>, reading <code>count</code> on the <em>next line</em> still shows the OLD value — the new value only exists in the next render. State is fixed for the duration of one render.</p>`, `<p>Bẫy kinh điển: sau <code>setCount(count + 1)</code>, đọc <code>count</code> ở <em>dòng kế</em> vẫn ra giá trị CŨ — giá trị mới chỉ tồn tại ở lần render sau. State cố định trong suốt một lần render.</p>`],
      [29, 'Rendering takes a snapshot in time', `<p>The JSX a component returns is a <strong>snapshot</strong>: its props, handlers and local variables were all computed from the state <em>at the time of that render</em>. On re-render React calls the function again, gets a new snapshot, and updates the screen to match.</p>`, `<p>JSX một component trả về là một <strong>ảnh chụp</strong>: props, handler và biến cục bộ của nó đều tính từ state <em>tại thời điểm render đó</em>. Khi re-render, React gọi lại hàm, lấy ảnh chụp mới, và cập nhật màn hình cho khớp.</p>`],
      [30, 'Snapshot — cont’d (event handlers capture state)', `<p>Consequence: an event handler "remembers" the state from the render that created it — even if it runs after a <code>setState</code>. Three <code>setCount(count + 1)</code> in a row all use the same <code>count</code>, so the count goes up by 1, not 3.</p>`, `<p>Hệ quả: một event handler "nhớ" state của lần render đã tạo ra nó — kể cả khi nó chạy sau một <code>setState</code>. Ba <code>setCount(count + 1)</code> liên tiếp đều dùng cùng <code>count</code>, nên count tăng 1, không phải 3.</p>`],
      [31, 'Snapshot — cont’d (the updater fix)', `<p>The fix: pass an <strong>updater function</strong> <code>setCount(c =&gt; c + 1)</code>. React applies each updater to the latest queued value, so three calls give +3. Use the updater form whenever the new state depends on the old.</p>`, `<p>Cách sửa: truyền một <strong>hàm updater</strong> <code>setCount(c =&gt; c + 1)</code>. React áp từng updater lên giá trị mới nhất trong hàng đợi, nên ba lần gọi cho +3. Dùng dạng updater bất cứ khi nào state mới phụ thuộc state cũ.</p>`],
      [32, 'Exercise 18: State as a snapshot', `<p>Hand-off to <strong>Exercise 18</strong> — see the snapshot behaviour and fix it with the updater form. Full brief in the next lesson.</p>`, `<p>Chuyển sang <strong>Exercise 18</strong> — thấy hành vi ảnh chụp và sửa bằng dạng updater. Đề đầy đủ ở bài kế.</p>`],
      [33, 'Summary', `<p>Recap: write handlers (named/inline/higher-order), pass data via arrows, use <code>e.preventDefault()</code>/<code>stopPropagation()</code> on the SyntheticEvent; React renders in three steps (trigger → render → commit), only touching the DOM minimally; and state is a snapshot — set it to trigger a render, and use the updater form when the new value depends on the old.</p>`, `<p>Tóm tắt: viết handler (named/inline/higher-order), truyền dữ liệu qua arrow, dùng <code>e.preventDefault()</code>/<code>stopPropagation()</code> trên SyntheticEvent; React render ba bước (trigger → render → commit), chỉ đụng DOM tối thiểu; và state là ảnh chụp — set nó để kích hoạt render, và dùng dạng updater khi giá trị mới phụ thuộc giá trị cũ.</p>`],
    ]),
    books([
      ['reactdoc', '“Responding to Events”, “Render and Commit”, “State as a Snapshot”, “Queueing a Series of State Updates”', '“Responding to Events”, “Render and Commit”, “State as a Snapshot”, “Queueing a Series of State Updates”'],
    ]),
  ].join('\n'),
};

const EX16 = {
  title: 'Exercise 16 — Event handling|||Exercise 16 — Xử lý sự kiện',
  slug: 'fer202-6-ex16-event-handling',
  type: 'EXERCISE',
  description: 'Luyện các mẫu handler: named vs inline, truyền tham số qua arrow, e.preventDefault()/stopPropagation(), đọc e.target.value.',
  content: bi(
    `<span class="eyebrow">Chapter 6 · Exercise 16 · Slot 11–12 slide 14</span>
<h2>Event handling patterns</h2>
<p class="lead"><b>Goal:</b> practise every way to wire a handler and to control an event.</p>
<pre><span class="hljs-keyword">function</span> <span class="hljs-title function_">Demo</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [text, setText] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>);
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">handleClick</span> = (<span class="hljs-params">name</span>) =&gt; <span class="hljs-title function_">alert</span>(<span class="hljs-string">&#x27;Hello &#x27;</span> + name);
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{e</span> =&gt;</span> { e.preventDefault(); alert(&#x27;submitted: &#x27; + text); }}&gt;
      {/* named handler with a parameter via arrow */}
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;button&quot;</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> handleClick(&#x27;React&#x27;)}&gt;Greet<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      {/* controlled input reading e.target.value */}
      <span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">value</span>=<span class="hljs-string">{text}</span> <span class="hljs-attr">onChange</span>=<span class="hljs-string">{e</span> =&gt;</span> setText(e.target.value)} /&gt;
      {/* stop bubbling */}
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> alert(&#x27;outer&#x27;)}&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;button&quot;</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{e</span> =&gt;</span> { e.stopPropagation(); alert(&#x27;inner only&#x27;); }}&gt;
          Inner
        <span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>Submit<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span></span>
  );
}</pre>
<div class="pitfall"><b>Trap:</b> <code>onClick={handleClick('React')}</code> (no arrow) <em>calls</em> the handler during render and passes its return value. Wrap it in an arrow: <code>onClick={() =&gt; handleClick('React')}</code>.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Wire the handlers</span><span class="lc-sub">preventDefault, stopPropagation — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 6 · Exercise 16 · Slot 11–12 slide 14</span>
<h2>Các mẫu xử lý sự kiện</h2>
<p class="lead"><b>Mục tiêu:</b> luyện mọi cách gắn handler và điều khiển sự kiện.</p>
<pre><span class="hljs-keyword">function</span> <span class="hljs-title function_">Demo</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [text, setText] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>);
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">handleClick</span> = (<span class="hljs-params">name</span>) =&gt; <span class="hljs-title function_">alert</span>(<span class="hljs-string">&#x27;Hello &#x27;</span> + name);
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{e</span> =&gt;</span> { e.preventDefault(); alert(&#x27;submitted: &#x27; + text); }}&gt;
      {/* handler có tên, truyền tham số qua arrow */}
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;button&quot;</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> handleClick(&#x27;React&#x27;)}&gt;Chào<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      {/* input controlled đọc e.target.value */}
      <span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">value</span>=<span class="hljs-string">{text}</span> <span class="hljs-attr">onChange</span>=<span class="hljs-string">{e</span> =&gt;</span> setText(e.target.value)} /&gt;
      {/* chặn bubbling */}
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> alert(&#x27;ngoài&#x27;)}&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;button&quot;</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{e</span> =&gt;</span> { e.stopPropagation(); alert(&#x27;chỉ trong&#x27;); }}&gt;
          Trong
        <span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>Gửi<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span></span>
  );
}</pre>
<div class="pitfall"><b>Bẫy:</b> <code>onClick={handleClick('React')}</code> (không arrow) sẽ <em>gọi</em> handler ngay lúc render và truyền giá trị trả về. Bọc trong arrow: <code>onClick={() =&gt; handleClick('React')}</code>.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Gắn các handler</span><span class="lc-sub">preventDefault, stopPropagation — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

const EX17 = {
  title: 'Exercise 17 — Render and Commit|||Exercise 17 — Render và Commit',
  slug: 'fer202-6-ex17-render-commit',
  type: 'EXERCISE',
  description: 'Quan sát chu trình trigger → render → commit: khi nào React gọi lại component, và vì sao render không luôn đổi DOM.',
  content: bi(
    `<span class="eyebrow">Chapter 6 · Exercise 17 · Slot 11–12 slide 24</span>
<h2>Watch the render → commit cycle</h2>
<p class="lead"><b>Goal:</b> make React's three steps visible and confirm that rendering does not always change the DOM.</p>
<ol>
  <li>Put <code>console.log('render', count)</code> at the top of a counter component. Click the button — you see one log per state update (Step 2, React calling your function).</li>
  <li>Set the state to the <em>same</em> value (<code>setCount(count)</code>). React may still call render once, but the <strong>commit</strong> step changes nothing in the DOM — rendering ≠ DOM update.</li>
  <li>Open React DevTools ▸ Profiler and record a click to see which components re-rendered and how long the commit took.</li>
</ol>
<div class="callout"><span class="badge">★ Key takeaway</span> A render is React <em>calling your function</em> to compute JSX. Commit is React <em>applying the minimal DOM changes</em>. Many renders produce zero DOM operations — that is normal and cheap.</div>`,
    `<span class="eyebrow">Chương 6 · Exercise 17 · Slot 11–12 slide 24</span>
<h2>Quan sát chu trình render → commit</h2>
<p class="lead"><b>Mục tiêu:</b> làm ba bước của React hiện rõ và xác nhận render không luôn đổi DOM.</p>
<ol>
  <li>Đặt <code>console.log('render', count)</code> ở đầu component counter. Bấm nút — mỗi lần cập nhật state in một dòng (Bước 2, React gọi hàm của bạn).</li>
  <li>Set state về <em>cùng</em> giá trị (<code>setCount(count)</code>). React có thể vẫn gọi render một lần, nhưng bước <strong>commit</strong> không đổi gì trong DOM — render ≠ cập nhật DOM.</li>
  <li>Mở React DevTools ▸ Profiler và ghi một cú click để xem component nào re-render và commit mất bao lâu.</li>
</ol>
<div class="callout"><span class="badge">★ Điều cốt lõi</span> Render là React <em>gọi hàm của bạn</em> để tính JSX. Commit là React <em>áp thay đổi DOM tối thiểu</em>. Nhiều lần render tạo ra 0 thao tác DOM — đó là bình thường và rẻ.</div>`,
  ),
};

const EX18 = {
  title: 'Exercise 18 — State as a snapshot|||Exercise 18 — State là ảnh chụp',
  slug: 'fer202-6-ex18-state-snapshot',
  type: 'EXERCISE',
  description: 'Tái hiện bẫy "+1 ba lần chỉ tăng 1", hiểu vì sao, và sửa bằng hàm updater setX(x => x + 1).',
  content: bi(
    `<span class="eyebrow">Chapter 6 · Exercise 18 · Slot 11–12 slide 32</span>
<h2>State is a snapshot — reproduce &amp; fix</h2>
<p class="lead"><b>Goal:</b> experience the snapshot behaviour, then fix it with the updater form.</p>
<pre><span class="hljs-comment">// <span class="hljs-doctag">BUG:</span> all three read the same snapshot of count → +1, not +3</span>
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Counter</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [count, setCount] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>);
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addThree</span> = (<span class="hljs-params"></span>) =&gt; { <span class="hljs-title function_">setCount</span>(count + <span class="hljs-number">1</span>); <span class="hljs-title function_">setCount</span>(count + <span class="hljs-number">1</span>); <span class="hljs-title function_">setCount</span>(count + <span class="hljs-number">1</span>); };
  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{addThree}</span>&gt;</span>{count}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span></span>;
}

<span class="hljs-comment">// FIX: updater form applies to the latest queued value → +3</span>
<span class="hljs-keyword">const</span> <span class="hljs-title function_">addThree</span> = (<span class="hljs-params"></span>) =&gt; { <span class="hljs-title function_">setCount</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> c + <span class="hljs-number">1</span>); <span class="hljs-title function_">setCount</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> c + <span class="hljs-number">1</span>); <span class="hljs-title function_">setCount</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> c + <span class="hljs-number">1</span>); };</pre>
<div class="out"><b>Result:</b> the buggy version increments by 1 per click (three calls, one snapshot of <code>count</code>); the fixed version increments by 3.</div>
<div class="callout"><span class="badge">★ Rule</span> When the next state depends on the previous state, always use the <strong>updater function</strong> <code>setX(prev =&gt; …)</code>. When it does not (setting a fresh value), <code>setX(value)</code> is fine.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Reproduce the +1 bug</span><span class="lc-sub">Then fix with the updater — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 6 · Exercise 18 · Slot 11–12 slide 32</span>
<h2>State là ảnh chụp — tái hiện &amp; sửa</h2>
<p class="lead"><b>Mục tiêu:</b> trải nghiệm hành vi ảnh chụp, rồi sửa bằng dạng updater.</p>
<pre><span class="hljs-comment">// LỖI: cả ba đọc cùng một ảnh chụp của count → +1, không phải +3</span>
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Counter</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [count, setCount] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>);
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addThree</span> = (<span class="hljs-params"></span>) =&gt; { <span class="hljs-title function_">setCount</span>(count + <span class="hljs-number">1</span>); <span class="hljs-title function_">setCount</span>(count + <span class="hljs-number">1</span>); <span class="hljs-title function_">setCount</span>(count + <span class="hljs-number">1</span>); };
  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{addThree}</span>&gt;</span>{count}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span></span>;
}

<span class="hljs-comment">// SỬA: dạng updater áp lên giá trị mới nhất trong hàng đợi → +3</span>
<span class="hljs-keyword">const</span> <span class="hljs-title function_">addThree</span> = (<span class="hljs-params"></span>) =&gt; { <span class="hljs-title function_">setCount</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> c + <span class="hljs-number">1</span>); <span class="hljs-title function_">setCount</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> c + <span class="hljs-number">1</span>); <span class="hljs-title function_">setCount</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> c + <span class="hljs-number">1</span>); };</pre>
<div class="out"><b>Kết quả:</b> bản lỗi tăng 1 mỗi lần bấm (ba lời gọi, một ảnh chụp của <code>count</code>); bản sửa tăng 3.</div>
<div class="callout"><span class="badge">★ Quy tắc</span> Khi state kế phụ thuộc state trước, luôn dùng <strong>hàm updater</strong> <code>setX(prev =&gt; …)</code>. Khi không (đặt giá trị mới hẳn), <code>setX(value)</code> là đủ.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Tái hiện bẫy +1</span><span class="lc-sub">Rồi sửa bằng updater — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

export default [SLIDES, EX16, EX17, EX18];
