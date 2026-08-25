/**
 * Next.js & React — Chương 4: Sự kiện & form có kiểm soát.
 * Song ngữ EN/VI. Escape: backtick→&#96;, `${`→\${, < >→&lt; &gt; trong code.
 * Output React đã chạy thật (scratchpad/nextjs-verify/c4.mjs): input có kiểm soát
 * render value="…"; select có kiểm soát render selected="" đúng option; textarea
 * render value thành nội dung <textarea>note</textarea>.
 */

export default {
  title: 'Chapter 4 — Events & controlled forms|||Chương 4 — Sự kiện & form có kiểm soát',
  description: 'Xử lý sự kiện với handler, dựng input có kiểm soát (value + onChange) — một nguồn sự thật duy nhất, và gom nhiều trường form vào một state. Kết thúc Giai đoạn 1.',
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Handling events|||4.1 — Xử lý sự kiện',
      slug: 'nextjs-4-1-su-kien',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Truyền một hàm cho onClick/onChange (không phải chuỗi, không gọi ngay), đọc event object, và preventDefault.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Responding to the user</h2>
<p class="lead">State from Chapter 3 changes in response to something the user does — a click, a keystroke, a form submit. You wire those up with event handlers: functions you pass to props like <code>onClick</code> and <code>onChange</code>. There are two mistakes everyone makes once, and then never again.</p>

<h3>Pass a function — don't call it</h3>
<pre><code><span class="tok-comment">// ✅ pass the function; React calls it on click</span>
&lt;button onClick={handleClick}&gt;Save&lt;/button&gt;

<span class="tok-comment">// ❌ calls handleClick immediately during render, passes its return value</span>
&lt;button onClick={handleClick()}&gt;Save&lt;/button&gt;</code></pre>
<p>The second line runs <code>handleClick</code> the moment the component renders — not on click — because <code>()</code> means "call it now". Whatever it returns (usually <code>undefined</code>) becomes the handler. If <code>handleClick</code> calls <code>setState</code>, you get an infinite render loop. When you need to pass arguments, wrap it in an arrow function so the call is <em>deferred</em> until the event:</p>
<pre><code>&lt;button onClick={() =&gt; handleDelete(item.id)}&gt;Delete&lt;/button&gt;</code></pre>
<p>Now <code>onClick</code> receives a function <code>() =&gt; handleDelete(item.id)</code>, and <code>handleDelete</code> runs only when clicked. Also note handlers are camelCase and take a real function, never a string — <code>onClick={...}</code>, not the HTML <code>onclick="..."</code>.</p>

<h3>The event object</h3>
<p>React calls your handler with an event object describing what happened. It is a <em>SyntheticEvent</em> — React's cross-browser wrapper around the native event, with the same API you know (<code>e.target</code>, <code>e.preventDefault()</code>, <code>e.key</code>):</p>
<pre><code>function handleChange(e) {
  console.log(e.target.value);   <span class="tok-comment">// the input's current text</span>
}

function handleKeyDown(e) {
  if (e.key === 'Enter') submit();
}</code></pre>
<p><code>e.target</code> is the DOM element that fired the event; <code>e.target.value</code> is how you read what the user typed. This is the bridge to controlled inputs in the next lesson.</p>

<h3><code>preventDefault</code>: stop the browser's built-in behaviour</h3>
<p>Some elements do something by default: a form submit reloads the page, a link navigates, a checkbox toggles. When you handle the event yourself, call <code>e.preventDefault()</code> to cancel the default:</p>
<pre><code>function handleSubmit(e) {
  e.preventDefault();          <span class="tok-comment">// stop the full-page reload</span>
  <span class="tok-comment">// …do your own submit (call an API, update state)…</span>
}

&lt;form onSubmit={handleSubmit}&gt; … &lt;/form&gt;</code></pre>
<p>Forgetting <code>preventDefault</code> on a form's <code>onSubmit</code> is the classic "my page flashes and my state resets when I hit enter" bug — the browser reloaded the whole page. Handle the submit on the <code>&lt;form&gt;</code>'s <code>onSubmit</code>, not on the button's <code>onClick</code>, so the Enter key works too.</p>

<div class="pitfall">
<p><strong>The IME trap — real, and this site hit it.</strong> When typing Vietnamese, Japanese or Chinese, an input method (IME) composes characters before committing them, and pressing <em>Enter</em> during composition means "confirm this character", not "submit". A naive <code>onKeyDown</code> that submits on Enter fires mid-composition and eats the user's word. Guard it: <code>if (e.nativeEvent.isComposing) return;</code> before acting on Enter/Space/Escape. cuongthai.com learned this in the messenger and feed composer — the guard is now standard for any keyboard handler that must coexist with CJK input.</p>
</div>
<h3>How a React event handler differs from an HTML one</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It is a function, not a string</b> — &#96;onClick={handleClick}&#96; passes the function. &#96;onClick={handleClick()}&#96; calls it during render and passes the result — usually &#96;undefined&#96;.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>React attaches one listener at the root</b> — Your handlers are dispatched from there. This is why adding a thousand rows does not add a thousand listeners.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>The event object is React&#39;s own</b> — A SyntheticEvent with the same API as the DOM one, normalised across browsers. &#96;e.nativeEvent&#96; gets you the original.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>preventDefault still works</b> — And it is still how you stop a form submitting or a link navigating. &#96;return false&#96; does nothing in React.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — &#96;onClick={handleDelete(id)}&#96; fires during render, not on click.</strong> The parentheses call the function immediately, so the row deletes itself as soon as the list renders — and if the handler sets state, that render triggers another render and you get an infinite loop with a stack trace that points at React internals. The compiler cannot help: passing a function&#39;s return value is perfectly valid JavaScript. When a handler needs an argument, wrap it: &#96;onClick={() =&gt; handleDelete(id)}&#96;. The arrow is created on each render, which is fine — that cost is invisible next to the bug it prevents.</p></div>
<a class="link-card dl" href="https://react.dev/learn/responding-to-events" target="_blank" rel="noopener">
  <span class="lc-ico">🖱️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Responding to events</span><span class="lc-sub">Handlers, arguments, propagation, and preventDefault.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/common#react-event-object" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">react.dev — The React event object</span><span class="lc-sub">What a SyntheticEvent carries, and how it differs from the DOM event.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Phản hồi người dùng</h2>
<p class="lead">State ở Chương 3 thay đổi để đáp lại việc người dùng làm — một cú click, một phím gõ, một form gửi đi. Bạn nối chúng bằng handler sự kiện: những hàm bạn truyền cho các prop như <code>onClick</code> và <code>onChange</code>. Có hai lỗi ai cũng mắc một lần, rồi không bao giờ mắc lại.</p>

<h3>Truyền một hàm — đừng gọi nó</h3>
<pre><code><span class="tok-comment">// ✅ truyền hàm; React gọi nó khi click</span>
&lt;button onClick={handleClick}&gt;Save&lt;/button&gt;

<span class="tok-comment">// ❌ gọi handleClick NGAY trong lúc render, truyền giá trị trả về của nó</span>
&lt;button onClick={handleClick()}&gt;Save&lt;/button&gt;</code></pre>
<p>Dòng thứ hai chạy <code>handleClick</code> ngay lúc component render — không phải lúc click — vì <code>()</code> nghĩa là "gọi ngay". Bất kể nó trả về gì (thường là <code>undefined</code>) đều trở thành handler. Nếu <code>handleClick</code> gọi <code>setState</code>, bạn được một vòng render vô tận. Khi cần truyền đối số, hãy bọc trong một arrow function để lời gọi được <em>hoãn</em> tới lúc có sự kiện:</p>
<pre><code>&lt;button onClick={() =&gt; handleDelete(item.id)}&gt;Delete&lt;/button&gt;</code></pre>
<p>Giờ <code>onClick</code> nhận một hàm <code>() =&gt; handleDelete(item.id)</code>, và <code>handleDelete</code> chỉ chạy khi được click. Cũng lưu ý handler viết camelCase và nhận một hàm thật, không bao giờ là chuỗi — <code>onClick={...}</code>, không phải <code>onclick="..."</code> của HTML.</p>

<h3>Object sự kiện</h3>
<p>React gọi handler của bạn với một object sự kiện mô tả chuyện đã xảy ra. Nó là một <em>SyntheticEvent</em> — lớp bọc đa trình duyệt của React quanh sự kiện gốc, với cùng API bạn đã biết (<code>e.target</code>, <code>e.preventDefault()</code>, <code>e.key</code>):</p>
<pre><code>function handleChange(e) {
  console.log(e.target.value);   <span class="tok-comment">// chữ hiện tại của input</span>
}

function handleKeyDown(e) {
  if (e.key === 'Enter') submit();
}</code></pre>
<p><code>e.target</code> là phần tử DOM phát ra sự kiện; <code>e.target.value</code> là cách bạn đọc cái người dùng gõ. Đây là cây cầu tới input có kiểm soát ở bài sau.</p>

<h3><code>preventDefault</code>: chặn hành vi mặc định của trình duyệt</h3>
<p>Một số phần tử làm gì đó theo mặc định: form submit tải lại trang, một link điều hướng, một checkbox bật/tắt. Khi bạn tự xử lý sự kiện, gọi <code>e.preventDefault()</code> để huỷ mặc định:</p>
<pre><code>function handleSubmit(e) {
  e.preventDefault();          <span class="tok-comment">// chặn việc tải lại cả trang</span>
  <span class="tok-comment">// …làm submit của riêng bạn (gọi API, cập nhật state)…</span>
}

&lt;form onSubmit={handleSubmit}&gt; … &lt;/form&gt;</code></pre>
<p>Quên <code>preventDefault</code> trên <code>onSubmit</code> của form là bug kinh điển "trang chớp một cái và state reset khi tôi nhấn enter" — trình duyệt đã tải lại cả trang. Hãy xử submit trên <code>onSubmit</code> của <code>&lt;form&gt;</code>, không phải trên <code>onClick</code> của nút, để phím Enter cũng chạy.</p>

<div class="pitfall">
<p><strong>Bẫy IME — có thật, và site này từng dính.</strong> Khi gõ tiếng Việt, Nhật hay Trung, một bộ gõ (IME) ghép ký tự trước khi chốt, và nhấn <em>Enter</em> giữa lúc đang ghép nghĩa là "xác nhận ký tự này", không phải "gửi". Một <code>onKeyDown</code> ngây thơ submit khi Enter sẽ nổ giữa lúc đang ghép và ăn mất chữ của người dùng. Hãy chặn: <code>if (e.nativeEvent.isComposing) return;</code> trước khi xử Enter/Space/Escape. cuongthai.com học được điều này ở khung soạn tin nhắn và feed — cái chặn này giờ là chuẩn cho mọi handler bàn phím phải sống chung với bộ gõ CJK.</p>
</div>
<h3>Handler sự kiện của React khác handler HTML thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó là một hàm, không phải một chuỗi</b> — &#96;onClick={handleClick}&#96; truyền cái hàm. &#96;onClick={handleClick()}&#96; GỌI nó ngay lúc render rồi truyền kết quả — thường là &#96;undefined&#96;.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>React gắn một listener duy nhất ở gốc</b> — Handler của bạn được điều phối từ đó. Đó là lý do thêm một nghìn dòng không hề thêm một nghìn listener.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Object sự kiện là của chính React</b> — Một SyntheticEvent có cùng API với object DOM, đã chuẩn hoá giữa các trình duyệt. &#96;e.nativeEvent&#96; cho bạn cái gốc.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>preventDefault vẫn chạy</b> — Và vẫn là cách bạn chặn một form gửi đi hay một liên kết chuyển trang. &#96;return false&#96; chẳng làm gì trong React cả.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — &#96;onClick={handleDelete(id)}&#96; nổ ngay lúc render, không phải lúc bấm.</strong> Cặp ngoặc tròn gọi hàm ngay lập tức, nên cái dòng đó tự xoá mình ngay khi danh sách vừa vẽ ra — và nếu handler có đặt state thì lần render đó lại kích hoạt một lần render nữa, và bạn có một vòng lặp vô tận với vệt stack chỉ vào ruột của React. Trình biên dịch không cứu được: truyền giá trị trả về của một hàm là JavaScript hoàn toàn hợp lệ. Khi một handler cần đối số, hãy bọc nó lại: &#96;onClick={() =&gt; handleDelete(id)}&#96;. Cái arrow được tạo lại ở mỗi lần render, và điều đó không sao — chi phí ấy vô hình bên cạnh cái lỗi mà nó ngăn được.</p></div>
<a class="link-card dl" href="https://react.dev/learn/responding-to-events" target="_blank" rel="noopener">
  <span class="lc-ico">🖱️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Phản hồi sự kiện</span><span class="lc-sub">Handler, đối số, lan truyền, và preventDefault.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/common#react-event-object" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">react.dev — Object sự kiện của React</span><span class="lc-sub">Một SyntheticEvent mang những gì, và nó khác object sự kiện DOM ra sao.</span></span>
</a>

</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — Controlled inputs|||4.2 — Input có kiểm soát',
      slug: 'nextjs-4-2-input-co-kiem-soat',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Một input có kiểm soát lấy value từ state và báo thay đổi qua onChange. State là nguồn sự thật duy nhất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>The input's value lives in state, not in the DOM</h2>
<p class="lead">A <strong>controlled input</strong> is the central pattern of every React form: React state holds the value, the input displays that state, and every keystroke updates the state, which re-renders the input. The DOM stops being the source of truth — your state is.</p>

<h3>The two-way wire that is really one-way</h3>
<pre><code>function NameField() {
  const [name, setName] = useState('');
  return (
    &lt;input
      value={name}                              <span class="tok-comment">// state → input</span>
      onChange={(e) =&gt; setName(e.target.value)} <span class="tok-comment">// input → state</span>
    /&gt;
  );
}</code></pre>
<p>Read it as a loop. The input's <code>value</code> is always whatever <code>name</code> currently is. When the user types, <code>onChange</code> fires, you read <code>e.target.value</code>, and call <code>setName</code>. That re-renders the component, <code>name</code> is the new text, and the input shows it. It looks two-way, but data only ever flows <em>state → input</em>; the keystroke is just an event that asks state to change.</p>
<p>Rendered to HTML, a controlled input carries its value in the DOM — verified:</p>
<div class="out">&lt;input value="hello"/&gt;</div>

<h3>Why bother? Because state can now do things</h3>
<p>Once the value is in state, everything else becomes trivial, because it's just data you already have:</p>
<ul>
  <li><strong>Validate as they type</strong> — <code>const tooShort = name.length &lt; 3;</code> and show a hint.</li>
  <li><strong>Transform input</strong> — force uppercase, strip spaces, format a phone number, by changing what you pass to <code>setName</code>.</li>
  <li><strong>Disable the submit button</strong> — <code>disabled={name.trim() === ''}</code>.</li>
  <li><strong>Reset the form</strong> — <code>setName('')</code>, and the input clears itself.</li>
</ul>
<p>None of this is possible when the value is trapped inside the DOM. Controlling the input is what lets the rest of your UI react to it.</p>

<div class="pitfall">
<p><strong>The <code>value</code>-without-<code>onChange</code> warning.</strong> If you set <code>value={name}</code> but forget <code>onChange</code>, React makes the field read-only and warns: <em>"You provided a &#96;value&#96; prop to a form field without an &#96;onChange&#96; handler."</em> You told React "the value is always <code>name</code>", so it refuses to let the DOM diverge — with no <code>onChange</code>, typing can never update <code>name</code>, so the field is frozen. Either add <code>onChange</code> (controlled) or use <code>defaultValue</code> instead of <code>value</code> (uncontrolled — Lesson 4.4). A related trap: never initialise state to <code>null</code>/<code>undefined</code> for an input, or it flips between uncontrolled and controlled and warns; start with an empty string.</p>
</div>
<h3>A controlled input, in one loop</h3>
<div class="lz-map">
  <div class="lz-stage">State is the truth; the input just displays it</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">value comes from state</div><div class="lz-nsub">&#96;value={text}&#96;. The input shows what state says, always — there is no second copy of the truth living in the DOM.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">onChange writes back</div><div class="lz-nsub">&#96;onChange={e =&gt; setText(e.target.value)}&#96;. Every keystroke updates state, which re-renders, which sets the value.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">So you can transform on the way</div><div class="lz-nsub">Uppercase it, strip spaces, cap the length, reject non-digits — because every character passes through your code.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">And read it anywhere</div><div class="lz-nsub">Validation, a live preview, a disabled submit button. They all read the same variable, so nothing can disagree.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — &#96;value={user.name}&#96; with no &#96;onChange&#96;, giving a field nobody can type in.</strong> React ties the input to state, state never changes, so every keypress is immediately overwritten by the old value — the field looks enabled and simply refuses input. The console says so (&quot;You provided a &#96;value&#96; prop to a form field without an &#96;onChange&#96; handler&quot;), but it is one warning among many and easy to miss. Three fixes depending on intent: add the handler, add &#96;readOnly&#96; if it is meant to be read-only, or use &#96;defaultValue&#96; if you wanted an uncontrolled field with an initial value.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/input" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">react.dev — The input component</span><span class="lc-sub">Controlled vs uncontrolled, with every prop and the warnings each triggers.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/reacting-to-input-with-state" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">react.dev — Reacting to input with state</span><span class="lc-sub">How to model a form as states rather than as a pile of booleans.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Giá trị của input nằm trong state, không phải trong DOM</h2>
<p class="lead">Một <strong>input có kiểm soát</strong> là khuôn mẫu trung tâm của mọi form React: state React giữ giá trị, input hiển thị state đó, và mỗi phím gõ cập nhật state, việc này render lại input. DOM thôi làm nguồn sự thật — state của bạn mới là.</p>

<h3>Sợi dây hai chiều thật ra là một chiều</h3>
<pre><code>function NameField() {
  const [name, setName] = useState('');
  return (
    &lt;input
      value={name}                              <span class="tok-comment">// state → input</span>
      onChange={(e) =&gt; setName(e.target.value)} <span class="tok-comment">// input → state</span>
    /&gt;
  );
}</code></pre>
<p>Hãy đọc nó như một vòng lặp. <code>value</code> của input luôn là bất kể <code>name</code> đang là gì. Khi người dùng gõ, <code>onChange</code> nổ, bạn đọc <code>e.target.value</code>, và gọi <code>setName</code>. Việc đó render lại component, <code>name</code> là chữ mới, và input hiện nó. Trông như hai chiều, nhưng dữ liệu chỉ luôn chảy <em>state → input</em>; phím gõ chỉ là một sự kiện xin state đổi.</p>
<p>Render ra HTML, một input có kiểm soát mang giá trị của nó trong DOM — đã kiểm:</p>
<div class="out">&lt;input value="hello"/&gt;</div>

<h3>Bận tâm làm gì? Vì giờ state có thể làm nhiều thứ</h3>
<p>Một khi giá trị nằm trong state, mọi thứ khác trở nên đơn giản, vì nó chỉ là dữ liệu bạn đã có sẵn:</p>
<ul>
  <li><strong>Kiểm tra ngay khi gõ</strong> — <code>const tooShort = name.length &lt; 3;</code> rồi hiện gợi ý.</li>
  <li><strong>Biến đổi đầu vào</strong> — ép hoa, bỏ khoảng trắng, định dạng số điện thoại, bằng cách đổi cái bạn truyền cho <code>setName</code>.</li>
  <li><strong>Vô hiệu nút gửi</strong> — <code>disabled={name.trim() === ''}</code>.</li>
  <li><strong>Xoá form</strong> — <code>setName('')</code>, và input tự xoá sạch.</li>
</ul>
<p>Không thứ nào làm được khi giá trị bị kẹt trong DOM. Kiểm soát input chính là cái cho phần còn lại của UI phản ứng theo nó.</p>

<div class="pitfall">
<p><strong>Cảnh báo <code>value</code> mà thiếu <code>onChange</code>.</strong> Nếu bạn đặt <code>value={name}</code> mà quên <code>onChange</code>, React biến ô thành chỉ đọc và cảnh báo: <em>"You provided a &#96;value&#96; prop to a form field without an &#96;onChange&#96; handler."</em> Bạn đã bảo React "giá trị luôn là <code>name</code>", nên nó từ chối để DOM lệch đi — không có <code>onChange</code>, gõ không bao giờ cập nhật được <code>name</code>, nên ô bị đóng băng. Hoặc thêm <code>onChange</code> (có kiểm soát) hoặc dùng <code>defaultValue</code> thay cho <code>value</code> (không kiểm soát — Bài 4.4). Một bẫy liên quan: đừng bao giờ khởi tạo state cho một input bằng <code>null</code>/<code>undefined</code>, kẻo nó lật qua lại giữa không-kiểm-soát và có-kiểm-soát rồi cảnh báo; hãy bắt đầu bằng một chuỗi rỗng.</p>
</div>
<h3>Một ô nhập có kiểm soát, trong một vòng</h3>
<div class="lz-map">
  <div class="lz-stage">State là sự thật; ô nhập chỉ hiển thị nó</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">value đến từ state</div><div class="lz-nsub">&#96;value={text}&#96;. Ô nhập hiện đúng thứ state nói, luôn luôn — không có bản sao thứ hai của sự thật nằm trong DOM.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">onChange ghi ngược lại</div><div class="lz-nsub">&#96;onChange={e =&gt; setText(e.target.value)}&#96;. Mỗi lần gõ phím là một lần cập nhật state, kéo theo render lại, kéo theo đặt lại value.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Nên bạn biến đổi được trên đường đi</div><div class="lz-nsub">Viết hoa, bỏ dấu cách, chặn độ dài, từ chối ký tự không phải số — vì mọi ký tự đều đi qua mã của bạn.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Và đọc nó ở bất cứ đâu</div><div class="lz-nsub">Kiểm dữ liệu, một khung xem trước trực tiếp, một nút gửi bị khoá. Tất cả đều đọc cùng một biến, nên không gì có thể bất đồng.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — &#96;value={user.name}&#96; mà không có &#96;onChange&#96;, cho ra một ô chẳng ai gõ vào được.</strong> React buộc ô nhập vào state, state chẳng bao giờ đổi, nên mọi lần gõ phím đều bị ghi đè ngay bằng giá trị cũ — cái ô trông vẫn dùng được mà đơn giản là từ chối nhận chữ. Console có nói (&quot;You provided a &#96;value&#96; prop to a form field without an &#96;onChange&#96; handler&quot;), nhưng đó là một cảnh báo giữa cả đống và rất dễ bỏ sót. Ba cách chữa tuỳ ý định: thêm handler vào, thêm &#96;readOnly&#96; nếu nó vốn để chỉ-đọc, hoặc dùng &#96;defaultValue&#96; nếu bạn muốn một ô không kiểm soát có giá trị ban đầu.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/input" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Component input</span><span class="lc-sub">Có kiểm soát với không kiểm soát, kèm mọi prop và cảnh báo mà mỗi cái sinh ra.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/reacting-to-input-with-state" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">react.dev — Phản ứng với đầu vào bằng state</span><span class="lc-sub">Cách mô hình hoá một form thành các trạng thái thay vì một đống boolean.</span></span>
</a>

</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Real forms: many fields, one submit|||4.3 — Form thật: nhiều trường, một lần gửi',
      slug: 'nextjs-4-3-form-thật',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Gom nhiều trường vào một object state với một handler onChange dùng name, và xử lý submit. select và textarea cũng có kiểm soát.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>One state object, one change handler, one submit</h2>
<p class="lead">A real form has many fields. Rather than a <code>useState</code> per field, most forms keep one object in state and one handler that updates the right key by the input's <code>name</code>. This is the pattern you'll type hundreds of times.</p>

<h3>The many-fields pattern</h3>
<pre><code>function SignupForm() {
  const [form, setForm] = useState({ email: '', password: '', lang: 'vi' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev =&gt; ({ ...prev, [name]: value }));   <span class="tok-comment">// update one key by name</span>
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);   <span class="tok-comment">// { email, password, lang } — send to your API</span>
  }

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input name="email" value={form.email} onChange={handleChange} /&gt;
      &lt;input name="password" type="password" value={form.password} onChange={handleChange} /&gt;
      &lt;select name="lang" value={form.lang} onChange={handleChange}&gt;
        &lt;option value="en"&gt;English&lt;/option&gt;
        &lt;option value="vi"&gt;Tiếng Việt&lt;/option&gt;
      &lt;/select&gt;
      &lt;button disabled={!form.email}&gt;Sign up&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p>Three things make this work. Each input has a <code>name</code> matching a key in the state object. The one <code>handleChange</code> uses a <em>computed key</em> <code>[name]: value</code> to update whichever field fired. And the updater form <code>setForm(prev =&gt; ...)</code> is used because the new state is built from the old one (Chapter 3) — with multiple fields changing, the snapshot rule bites if you don't.</p>

<h3>Select and textarea are controlled the same way</h3>
<p>In React — unlike HTML — a <code>&lt;select&gt;</code> is controlled by a <code>value</code> prop on the select itself, not by a <code>selected</code> attribute on an option. A <code>&lt;textarea&gt;</code> uses a <code>value</code> prop, not text between its tags. Rendered for real, the controlled select and textarea look like this:</p>
<div class="out">&lt;select&gt;&lt;option value="en"&gt;English&lt;/option&gt;&lt;option value="vi" selected=""&gt;Tiếng Việt&lt;/option&gt;&lt;/select&gt;&lt;textarea&gt;note&lt;/textarea&gt;</div>
<p>React put <code>selected</code> on the matching option and rendered the textarea's value as its content — but you never write those; you set one <code>value</code> prop and React does the rest. Checkboxes are the one exception: they use <code>checked</code> (a boolean) and <code>onChange</code> reads <code>e.target.checked</code>, not <code>e.target.value</code>.</p>

<h3>Submitting</h3>
<p>Handle submit on the <code>&lt;form&gt;</code>'s <code>onSubmit</code> (so Enter works), call <code>preventDefault</code>, and you have the whole form as one object ready to send. In Chapter 16 we replace this hand-rolled version with <code>react-hook-form</code> + <code>zod</code> for validation and less boilerplate, and in Chapter 12 with Server Actions — but they all rest on exactly this: inputs whose values live in state.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it</strong> — small forms (a search box, a rename dialog) use one or two <code>useState</code> values inline like Lesson 4.2. Bigger forms (signup, profile, the CV builder) use <code>react-hook-form</code> so the fields are registered rather than each wired by hand, with <code>zod</code> schemas validating on submit. The mental model is identical; the library just removes the repetition once a form has more than a couple of fields.</p>
</div>
<h3>Submitting a form without reloading the page</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Handle onSubmit on the form</b> — Not onClick on the button. The form fires on Enter too, and screen readers announce it as a form — the button alone gives you neither.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Call e.preventDefault() first</b> — Otherwise the browser does a full page navigation and your handler&#39;s work is thrown away mid-flight.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Disable the button while it is in flight</b> — A second submit creates a second order. This is the cheapest fix for the most expensive bug in this lesson.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Then show the outcome</b> — Success, or the server&#39;s error message. A form that appears to do nothing is indistinguishable from a broken one.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a submit handler that is &#96;async&#96; and calls &#96;preventDefault&#96; after an &#96;await&#96;.</strong> &#96;async function onSubmit(e) { await check(); e.preventDefault(); }&#96; is too late: React&#39;s event object is dispatched synchronously, and by the time the promise resolves the browser has already decided to navigate. The page reloads mid-request, the network tab shows a cancelled call, and the bug only appears when &#96;check()&#96; actually takes time — so it passes locally and fails on a slow connection. Call &#96;preventDefault()&#96; on the first line of the handler, before any &#96;await&#96;, every time.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/form" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">react.dev — The form component</span><span class="lc-sub">onSubmit, the action prop, and how forms work in modern React.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault" target="_blank" rel="noopener">
  <span class="lc-ico">🛑</span>
  <span class="lc-body"><span class="lc-title">MDN — Event.preventDefault</span><span class="lc-sub">Why it must run synchronously, and what happens when it does not.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Một object state, một handler đổi, một lần gửi</h2>
<p class="lead">Một form thật có nhiều trường. Thay vì một <code>useState</code> cho mỗi trường, phần lớn form giữ một object trong state và một handler cập nhật đúng khoá theo <code>name</code> của input. Đây là khuôn mẫu bạn sẽ gõ hàng trăm lần.</p>

<h3>Khuôn mẫu nhiều trường</h3>
<pre><code>function SignupForm() {
  const [form, setForm] = useState({ email: '', password: '', lang: 'vi' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev =&gt; ({ ...prev, [name]: value }));   <span class="tok-comment">// cập nhật một khoá theo name</span>
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);   <span class="tok-comment">// { email, password, lang } — gửi tới API của bạn</span>
  }

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input name="email" value={form.email} onChange={handleChange} /&gt;
      &lt;input name="password" type="password" value={form.password} onChange={handleChange} /&gt;
      &lt;select name="lang" value={form.lang} onChange={handleChange}&gt;
        &lt;option value="en"&gt;English&lt;/option&gt;
        &lt;option value="vi"&gt;Tiếng Việt&lt;/option&gt;
      &lt;/select&gt;
      &lt;button disabled={!form.email}&gt;Sign up&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p>Ba thứ làm nó chạy được. Mỗi input có một <code>name</code> khớp một khoá trong object state. Một <code>handleChange</code> duy nhất dùng một <em>khoá tính toán</em> <code>[name]: value</code> để cập nhật đúng trường vừa nổ. Và dạng updater <code>setForm(prev =&gt; ...)</code> được dùng vì state mới dựng từ cái cũ (Chương 3) — với nhiều trường cùng đổi, quy tắc ảnh chụp sẽ cắn nếu bạn không dùng.</p>

<h3>select và textarea cũng có kiểm soát y hệt</h3>
<p>Trong React — khác HTML — một <code>&lt;select&gt;</code> được kiểm soát bằng prop <code>value</code> trên chính select, không phải bằng thuộc tính <code>selected</code> trên một option. Một <code>&lt;textarea&gt;</code> dùng prop <code>value</code>, không phải chữ giữa hai thẻ. Render thật, select và textarea có kiểm soát trông thế này:</p>
<div class="out">&lt;select&gt;&lt;option value="en"&gt;English&lt;/option&gt;&lt;option value="vi" selected=""&gt;Tiếng Việt&lt;/option&gt;&lt;/select&gt;&lt;textarea&gt;note&lt;/textarea&gt;</div>
<p>React đặt <code>selected</code> lên option khớp và render value của textarea thành nội dung của nó — nhưng bạn không bao giờ viết những thứ đó; bạn đặt một prop <code>value</code> và React lo phần còn lại. Checkbox là ngoại lệ duy nhất: nó dùng <code>checked</code> (một boolean) và <code>onChange</code> đọc <code>e.target.checked</code>, không phải <code>e.target.value</code>.</p>

<h3>Gửi form</h3>
<p>Xử submit trên <code>onSubmit</code> của <code>&lt;form&gt;</code> (để Enter chạy), gọi <code>preventDefault</code>, và bạn có cả form dưới dạng một object sẵn sàng gửi. Ở Chương 16 ta thay bản tự viết này bằng <code>react-hook-form</code> + <code>zod</code> để có validation và ít mã lặp, và ở Chương 12 bằng Server Actions — nhưng tất cả đều dựa trên đúng điều này: input có giá trị nằm trong state.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào</strong> — form nhỏ (một ô tìm kiếm, một hộp đổi tên) dùng một hai giá trị <code>useState</code> ngay tại chỗ như Bài 4.2. Form lớn hơn (đăng ký, hồ sơ, trình dựng CV) dùng <code>react-hook-form</code> để các trường được đăng ký thay vì nối tay từng cái, với schema <code>zod</code> kiểm lúc submit. Mô hình tư duy y hệt; thư viện chỉ bỏ đi phần lặp lại khi một form có hơn vài trường.</p>
</div>
<h3>Gửi một form mà không tải lại trang</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Xử onSubmit trên thẻ form</b> — Đừng xử onClick trên cái nút. Form còn nổ khi bấm Enter, và trình đọc màn hình xướng nó lên là một form — riêng cái nút thì không cho bạn thứ nào trong hai.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Gọi e.preventDefault() trước đã</b> — Không thì trình duyệt chuyển trang toàn phần và phần việc của handler bị vứt bỏ giữa chừng.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Khoá cái nút trong lúc đang gửi</b> — Một lần gửi thứ hai tạo ra một đơn hàng thứ hai. Đây là cách chữa rẻ nhất cho cái lỗi đắt nhất trong bài này.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Rồi hiện kết cục ra</b> — Thành công, hoặc thông điệp lỗi của máy chủ. Một form có vẻ chẳng làm gì thì không phân biệt được với một form hỏng.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một handler submit là &#96;async&#96; và gọi &#96;preventDefault&#96; SAU một &#96;await&#96;.</strong> &#96;async function onSubmit(e) { await check(); e.preventDefault(); }&#96; là quá muộn: object sự kiện của React được điều phối đồng bộ, và tới lúc promise xong thì trình duyệt đã quyết định chuyển trang rồi. Trang tải lại giữa chừng request, tab Network hiện một lời gọi bị huỷ, và cái lỗi chỉ lộ ra khi &#96;check()&#96; thật sự tốn thời gian — nên nó qua được ở máy bạn và hỏng trên đường truyền chậm. Hãy gọi &#96;preventDefault()&#96; ở dòng đầu tiên của handler, trước mọi &#96;await&#96;, lần nào cũng vậy.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/form" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">react.dev — Component form</span><span class="lc-sub">onSubmit, prop action, và form hoạt động ra sao trong React hiện đại.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault" target="_blank" rel="noopener">
  <span class="lc-ico">🛑</span>
  <span class="lc-body"><span class="lc-title">MDN — Event.preventDefault</span><span class="lc-sub">Vì sao nó phải chạy đồng bộ, và chuyện gì xảy ra khi không.</span></span>
</a>

</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Controlled vs uncontrolled, and refs|||4.4 — Có kiểm soát vs không, và ref',
      slug: 'nextjs-4-4-controlled-vs-uncontrolled',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Input không kiểm soát để DOM giữ giá trị, đọc bằng ref khi submit. Khi nào dùng cái nào, và ref dùng để làm gì khác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>The other kind of input, and the escape hatch to the DOM</h2>
<p class="lead">Controlled inputs are the default and the right choice almost always. But there is a second style — uncontrolled — where the DOM keeps the value and you read it only when you need it. Knowing both, and knowing <code>useRef</code>, rounds out forms.</p>

<h3>Uncontrolled: let the DOM hold the value</h3>
<p>An uncontrolled input has no <code>value</code> prop and no <code>onChange</code>. It manages its own text, exactly like a plain HTML input; you grab the value at submit time with a ref:</p>
<pre><code>function SearchForm() {
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputRef.current.value);   <span class="tok-comment">// read the DOM node's value once</span>
  }

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input ref={inputRef} defaultValue="" /&gt;   <span class="tok-comment">// defaultValue, not value</span>
      &lt;button&gt;Search&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p>Two differences from controlled: <code>defaultValue</code> sets the initial text but doesn't lock it, and <code>ref</code> gives you a handle to the actual DOM node so you can read <code>.value</code> when you want it. There's no re-render on each keystroke because state isn't involved.</p>

<h3>Which one, when</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Controlled</span><span class="v">The default. Use whenever the UI must react to the value as it changes — live validation, formatting, enabling a button, dependent fields. This is almost every form.</span></div>
  <div class="kv"><span class="k">Uncontrolled</span><span class="v">A simple form where you only need the value on submit and nothing reacts to it mid-typing; integrating a non-React widget; or a file input, which is <em>always</em> uncontrolled (you can't set a file's value programmatically).</span></div>
</div>
<p>When unsure, choose controlled. The tiny extra code buys you every "react to the input" feature for free, and consistency across a codebase matters more than saving three lines on one form.</p>

<h3><code>useRef</code> is more than reading inputs</h3>
<p>A ref is a box whose <code>.current</code> you can read and write without causing a re-render. That makes it good for two distinct jobs:</p>
<ul>
  <li><strong>Reaching a DOM node</strong> — focus an input (<code>inputRef.current.focus()</code>), scroll an element into view, measure its size, play a <code>&lt;video&gt;</code>. React gives you the node through the <code>ref</code> prop.</li>
  <li><strong>Remembering a value across renders without rendering</strong> — a timer id, the previous value of a prop, a WebSocket instance. Unlike state, changing a ref does <em>not</em> re-render; unlike a local variable, it survives re-renders.</li>
</ul>
<p>The line that matters: <strong>if changing the value should update the screen, it's state; if it shouldn't, it's a ref.</strong> A visible counter is state. The interval id you'll clear later is a ref. We go deeper on <code>useRef</code> in Chapter 6.</p>

<div class="callout ok">
<p><strong>Stage 1 complete.</strong> You now have the whole foundation of React: JSX describes the UI, components compose via props and children, state gives them memory, and events drive state through controlled forms. <strong>Progress Test 1</strong> in the Exam Room covers Chapters 1–4. Stage 2 goes deeper into hooks — starting with the one that trips up everyone, <code>useEffect</code>.</p>
</div>
<h3>Controlled or uncontrolled — pick by what you need during typing</h3>
<div class="lz-map">
  <div class="lz-stage">Both are valid; the question is who holds the value</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Controlled</div><div class="lz-nsub">React state holds the value. Choose it when you need live validation, a character counter, a dependent field, or a preview that updates as you type.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Uncontrolled</div><div class="lz-nsub">The DOM holds the value; you read it on submit with a ref or from FormData. Choose it for a plain form where nothing reacts until submit.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Uncontrolled is fewer renders</div><div class="lz-nsub">No re-render per keystroke. On a long form with many fields, that difference is measurable — but measure before assuming it matters.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Do not switch mid-life</div><div class="lz-nsub">Going from &#96;undefined&#96; to a value flips an input from uncontrolled to controlled and React warns loudly. Initialise with &#96;&#39;&#39;&#96;, never &#96;undefined&#96;.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — initialising a controlled input from data that has not loaded yet.</strong> &#96;value={user?.name}&#96; is &#96;undefined&#96; on the first render, so React treats the input as uncontrolled; when the fetch resolves, the value becomes a string and React switches it to controlled — logging &quot;A component is changing an uncontrolled input to be controlled&quot; and, more practically, discarding anything the user typed in the meantime. Default the value instead (&#96;value={user?.name ?? &#39;&#39;}&#96;), or do not render the form until the data is there. The warning is precise; it is worth reading rather than filtering out.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Controlling an input with state</span><span class="lc-sub">The controlled pattern, and the exact conditions that trigger the switch warning.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData</span><span class="lc-sub">Reading an uncontrolled form in one line on submit, without refs.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Loại input còn lại, và cửa thoát tới DOM</h2>
<p class="lead">Input có kiểm soát là mặc định và là lựa chọn đúng gần như luôn luôn. Nhưng có một kiểu thứ hai — không kiểm soát — nơi DOM giữ giá trị và bạn chỉ đọc khi cần. Biết cả hai, và biết <code>useRef</code>, làm tròn phần form.</p>

<h3>Không kiểm soát: để DOM giữ giá trị</h3>
<p>Một input không kiểm soát không có prop <code>value</code> và không có <code>onChange</code>. Nó tự quản chữ của mình, y như một input HTML thường; bạn lấy giá trị lúc submit bằng một ref:</p>
<pre><code>function SearchForm() {
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputRef.current.value);   <span class="tok-comment">// đọc value của nút DOM một lần</span>
  }

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input ref={inputRef} defaultValue="" /&gt;   <span class="tok-comment">// defaultValue, không phải value</span>
      &lt;button&gt;Search&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p>Hai khác biệt so với có kiểm soát: <code>defaultValue</code> đặt chữ ban đầu nhưng không khoá nó, và <code>ref</code> cho bạn một tay cầm tới nút DOM thật để đọc <code>.value</code> khi muốn. Không có render lại ở mỗi phím gõ vì state không tham gia.</p>

<h3>Chọn cái nào, khi nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Có kiểm soát</span><span class="v">Mặc định. Dùng bất cứ khi nào UI phải phản ứng theo giá trị khi nó đổi — kiểm tra trực tiếp, định dạng, bật nút, trường phụ thuộc. Đây là gần như mọi form.</span></div>
  <div class="kv"><span class="k">Không kiểm soát</span><span class="v">Một form đơn giản bạn chỉ cần giá trị lúc submit và không có gì phản ứng giữa lúc gõ; tích hợp một widget không-phải-React; hoặc một input file, vốn <em>luôn</em> không kiểm soát (bạn không thể đặt value của một file bằng code).</span></div>
</div>
<p>Khi phân vân, chọn có kiểm soát. Vài dòng thêm nhỏ nhặt mua cho bạn mọi tính năng "phản ứng theo input" miễn phí, và sự nhất quán trên toàn codebase quan trọng hơn việc tiết kiệm ba dòng ở một form.</p>

<h3><code>useRef</code> không chỉ để đọc input</h3>
<p>Một ref là một cái hộp mà <code>.current</code> của nó bạn đọc và ghi được mà không gây render lại. Điều đó khiến nó hợp cho hai việc riêng biệt:</p>
<ul>
  <li><strong>Với tới một nút DOM</strong> — focus một input (<code>inputRef.current.focus()</code>), cuộn một phần tử vào tầm nhìn, đo kích thước nó, phát một <code>&lt;video&gt;</code>. React trao nút cho bạn qua prop <code>ref</code>.</li>
  <li><strong>Nhớ một giá trị qua các lần render mà không render</strong> — một id timer, giá trị trước của một prop, một instance WebSocket. Khác state, đổi một ref <em>không</em> render lại; khác một biến cục bộ, nó sống sót qua các lần render.</li>
</ul>
<p>Câu chốt: <strong>nếu đổi giá trị nên cập nhật màn hình, đó là state; nếu không nên, đó là ref.</strong> Một bộ đếm hiển thị là state. Cái id interval bạn sẽ clear sau này là ref. Ta sẽ đào sâu <code>useRef</code> ở Chương 6.</p>

<div class="callout ok">
<p><strong>Hoàn thành Giai đoạn 1.</strong> Giờ bạn có toàn bộ nền tảng React: JSX mô tả giao diện, component ghép qua props và children, state cho chúng trí nhớ, và sự kiện điều khiển state qua form có kiểm soát. <strong>Bài kiểm tra tiến độ 1</strong> trong Phòng thi phủ Chương 1–4. Giai đoạn 2 đào sâu hooks — bắt đầu với cái làm ai cũng vấp, <code>useEffect</code>.</p>
</div>
<h3>Có kiểm soát hay không kiểm soát — chọn theo thứ bạn cần TRONG LÚC gõ</h3>
<div class="lz-map">
  <div class="lz-stage">Cả hai đều hợp lệ; câu hỏi là ai giữ giá trị</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Có kiểm soát</div><div class="lz-nsub">State của React giữ giá trị. Hãy chọn nó khi bạn cần kiểm dữ liệu trực tiếp, một bộ đếm ký tự, một trường phụ thuộc, hay một khung xem trước cập nhật khi gõ.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Không kiểm soát</div><div class="lz-nsub">DOM giữ giá trị; bạn đọc nó lúc submit bằng một ref hoặc từ FormData. Hãy chọn nó cho một form đơn giản chẳng có gì phản ứng cho tới lúc gửi.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Không kiểm soát thì ít render hơn</div><div class="lz-nsub">Không render lại ở mỗi lần gõ phím. Trên một form dài nhiều trường, chênh lệch đó đo được — nhưng hãy đo trước khi cho rằng nó quan trọng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Đừng đổi giữa chừng</div><div class="lz-nsub">Đi từ &#96;undefined&#96; sang một giá trị là lật một ô nhập từ không-kiểm-soát sang có-kiểm-soát và React cảnh báo to tiếng. Hãy khởi tạo bằng &#96;&#39;&#39;&#96;, đừng bao giờ bằng &#96;undefined&#96;.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — khởi tạo một ô nhập có kiểm soát từ dữ liệu chưa tải xong.</strong> &#96;value={user?.name}&#96; là &#96;undefined&#96; ở lần render đầu, nên React coi ô nhập là không-kiểm-soát; tới khi phép fetch xong, giá trị thành một chuỗi và React chuyển nó sang có-kiểm-soát — ghi ra &quot;A component is changing an uncontrolled input to be controlled&quot; và, thực tế hơn, vứt bỏ mọi thứ người dùng đã gõ trong khoảng đó. Hãy đặt giá trị dự phòng (&#96;value={user?.name ?? &#39;&#39;}&#96;), hoặc đừng vẽ form ra cho tới khi có dữ liệu. Cảnh báo ấy nói rất chính xác; nó đáng đọc chứ không đáng lọc bỏ.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Kiểm soát một ô nhập bằng state</span><span class="lc-sub">Mẫu có-kiểm-soát, và đúng những điều kiện làm nổ cảnh báo chuyển đổi.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData</span><span class="lc-sub">Đọc một form không kiểm soát trong một dòng lúc submit, không cần ref.</span></span>
</a>

</div>
`,
    },

    /* ─────────────────────────── 4.5 quiz ─────────────────────────── */
    {
      title: '4.5 — Chapter 4 quiz|||4.5 — Kiểm tra chương 4',
      slug: 'nextjs-4-5-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về handler sự kiện, preventDefault, input có kiểm soát, khuôn nhiều trường, và controlled vs uncontrolled.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 4: passing handlers vs calling them, <code>preventDefault</code>, controlled inputs, the many-fields pattern, checkboxes, and controlled vs uncontrolled with refs.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 4: truyền handler vs gọi nó, <code>preventDefault</code>, input có kiểm soát, khuôn nhiều trường, checkbox, và controlled vs uncontrolled với ref.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is wrong with <button onClick={handleClick()}>?|||<button onClick={handleClick()}> sai chỗ nào?',
            options: [
              'Nothing|||Không có gì',
              'It calls handleClick during render and uses its return value as the handler|||Nó gọi handleClick trong lúc render và dùng giá trị trả về làm handler',
              'onClick must be lowercase|||onClick phải viết thường',
              'handleClick must return JSX|||handleClick phải trả về JSX',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'How do you pass an argument to a handler, e.g. delete item.id, on click?|||Truyền một đối số cho handler, vd xoá item.id, khi click bằng cách nào?',
            options: [
              'onClick={handleDelete(item.id)}|||onClick={handleDelete(item.id)}',
              'onClick={() => handleDelete(item.id)}|||onClick={() => handleDelete(item.id)}',
              'onClick="handleDelete(item.id)"|||onClick="handleDelete(item.id)"',
              'onClick={handleDelete, item.id}|||onClick={handleDelete, item.id}',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your form reloads the whole page when submitted. What did you forget?|||Form của bạn tải lại cả trang khi gửi. Bạn quên gì?',
            options: [
              'e.stopPropagation()|||e.stopPropagation()',
              'e.preventDefault() in the onSubmit handler|||e.preventDefault() trong handler onSubmit',
              'A key prop|||Một prop key',
              'To use onClick instead of onSubmit|||Dùng onClick thay onSubmit',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In a controlled input, where is the value the source of truth?|||Trong một input có kiểm soát, nguồn sự thật của giá trị nằm ở đâu?',
            options: [
              'In the DOM node|||Trong nút DOM',
              'In React state|||Trong state React',
              'In a global variable|||Trong một biến toàn cục',
              'In localStorage|||Trong localStorage',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'How do you read what the user typed inside onChange?|||Bạn đọc cái người dùng gõ bên trong onChange bằng gì?',
            options: [
              'e.value', 'e.target.value', 'e.input', 'this.value',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You set value={name} but no onChange. What happens?|||Bạn đặt value={name} nhưng không có onChange. Chuyện gì xảy ra?',
            options: [
              'It works normally|||Chạy bình thường',
              'React makes it read-only and warns about value without onChange|||React biến nó thành chỉ đọc và cảnh báo value thiếu onChange',
              'The app crashes|||App sập',
              'The input becomes uncontrolled automatically|||Input tự thành không kiểm soát',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In the many-fields pattern, how does one handler update the right key?|||Trong khuôn nhiều trường, một handler cập nhật đúng khoá bằng cách nào?',
            options: [
              'setForm({ ...prev, [e.target.name]: e.target.value }) — computed key by name|||setForm({ ...prev, [e.target.name]: e.target.value }) — khoá tính theo name',
              'It cannot; you need one handler per field|||Không thể; cần một handler mỗi trường',
              'By reading e.target.id only|||Chỉ bằng đọc e.target.id',
              'By mutating form directly|||Bằng mutate form trực tiếp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A checkbox handler should read which property?|||Handler của một checkbox nên đọc thuộc tính nào?',
            options: [
              'e.target.value', 'e.target.checked', 'e.target.selected', 'e.target.on',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which input type is ALWAYS uncontrolled in React?|||Loại input nào LUÔN không kiểm soát trong React?',
            options: [
              'text', 'password', 'file', 'email',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'When should a changing value be a ref instead of state?|||Khi nào một giá trị đang đổi nên là ref thay vì state?',
            options: [
              'When changing it should NOT re-render the screen (e.g. a timer id)|||Khi đổi nó KHÔNG nên render lại màn hình (vd một id timer)',
              'Always — refs are faster than state|||Luôn luôn — ref nhanh hơn state',
              'When the value is a number|||Khi giá trị là một số',
              'Never — refs cannot hold changing values|||Không bao giờ — ref không giữ được giá trị đang đổi',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
