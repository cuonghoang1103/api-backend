/**
 * Next.js & React — Chương 4: Sự kiện & form có kiểm soát.
 * Song ngữ EN/VI. Escape: backtick→&#96;, `${`→\${, < >→&lt; &gt; trong code.
 * Output React đã chạy thật (scratchpad/nextjs-verify/c4.mjs): input có kiểm soát
 * render value="…"; select có kiểm soát render selected="" đúng option; textarea
 * render value thành nội dung <textarea>note</textarea>.
 */

import G04_1 from './giang/nxj-04-1.mjs';
import G04_2 from './giang/nxj-04-2.mjs';
import G04_3 from './giang/nxj-04-3.mjs';
import G04_4 from './giang/nxj-04-4.mjs';
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
${G04_1}
<div class="ml-en">
<div class="callout ok"><strong>Already took the React course?</strong> This chapter is a quick React refresher &mdash; the same topic is taught in depth in the <a href="/courses/react">React</a> course (Chapter 2 for events, Chapter 3 for forms). Skim it or skip ahead to <strong>Chapter 8</strong>, where the Next.js-specific material starts. Remember: Next.js is a <em>framework built on React</em> &mdash; every component, prop, state and hook here is still plain React.</div>
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Responding to the user</h2>
<p class="lead">State from Chapter 3 changes in response to something the user does — a click, a keystroke, a form submit. You wire those up with event handlers: functions you pass to props like <code>onClick</code> and <code>onChange</code>. There are two mistakes everyone makes once, and then never again.</p>

<h3>Pass a function — don't call it</h3>
<pre><code class="language-html"><span class="tok-comment">// ✅ pass the function; React calls it on click</span>
&lt;button onClick={handleClick}&gt;Save&lt;/button&gt;

<span class="tok-comment">// ❌ calls handleClick immediately during render, passes its return value</span>
&lt;button onClick={handleClick()}&gt;Save&lt;/button&gt;</code></pre>
<p>The second line runs <code>handleClick</code> the moment the component renders — not on click — because <code>()</code> means "call it now". Whatever it returns (usually <code>undefined</code>) becomes the handler. If <code>handleClick</code> calls <code>setState</code>, it can loop forever (measured: <code>setDem(dem + 1)</code> ⇒ "Too many re-renders", the server answers 500) — or, like a delete handler, quietly empty the list before anyone clicks. When you need to pass arguments, wrap it in an arrow function so the call is <em>deferred</em> until the event:</p>
<pre><code class="language-html">&lt;button onClick={() =&gt; handleDelete(item.id)}&gt;Delete&lt;/button&gt;</code></pre>
<p>Now <code>onClick</code> receives a function <code>() =&gt; handleDelete(item.id)</code>, and <code>handleDelete</code> runs only when clicked. Also note handlers are camelCase and take a real function, never a string — <code>onClick={...}</code>, not the HTML <code>onclick="..."</code>.</p>

<h3>The event object</h3>
<p>React calls your handler with an event object describing what happened. It is a <em>SyntheticEvent</em> — React's cross-browser wrapper around the native event, with the same API you know (<code>e.target</code>, <code>e.preventDefault()</code>, <code>e.key</code>):</p>
<pre><code class="language-javascript">function handleChange(e) {
  console.log(e.target.value);   <span class="tok-comment">// the input's current text</span>
}

function handleKeyDown(e) {
  if (e.key === 'Enter') submit();
}</code></pre>
<p><code>e.target</code> is the DOM element that fired the event; <code>e.target.value</code> is how you read what the user typed. This is the bridge to controlled inputs in the next lesson.</p>

<h3><code>preventDefault</code>: stop the browser's built-in behaviour</h3>
<p>Some elements do something by default: a form submit reloads the page, a link navigates, a checkbox toggles. When you handle the event yourself, call <code>e.preventDefault()</code> to cancel the default:</p>
<pre><code class="language-typescript">function handleSubmit(e) {
  e.preventDefault();          <span class="tok-comment">// stop the full-page reload</span>
  <span class="tok-comment">// …do your own submit (call an API, update state)…</span>
}

&lt;form onSubmit={handleSubmit}&gt; … &lt;/form&gt;</code></pre>
<p>Forgetting <code>preventDefault</code> on a form's <code>onSubmit</code> is the classic "my page flashes and my state resets when I hit enter" bug — the browser reloaded the whole page. Handle the submit on the <code>&lt;form&gt;</code>'s <code>onSubmit</code>, not on the button's <code>onClick</code>. Measured: Enter inside a form "clicks" its default submit button, so a submit button's <code>onClick</code> does fire — but the moment the button becomes <code>type="button"</code> or leaves the form, Enter does nothing. <code>onSubmit</code> catches every path.</p>

<div class="pitfall">
<p><strong>The IME trap — real, and this site hit it.</strong> When typing Vietnamese, Japanese or Chinese, an input method (IME) composes characters before committing them, and pressing <em>Enter</em> during composition means "confirm this character", not "submit". A naive <code>onKeyDown</code> that submits on Enter fires mid-composition and eats the user's word. Guard it: <code>if (e.nativeEvent.isComposing) return;</code> before acting on Enter/Space/Escape. cuongthai.com learned this in the messenger and feed composer — the guard is now standard for any keyboard handler that must coexist with CJK input.</p>
</div>
<h3>How a React event handler differs from an HTML one</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It is a function, not a string</b> — <code>onClick={handleClick}</code> passes the function. <code>onClick={handleClick()}</code> calls it during render and passes the result — usually <code>undefined</code>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>React attaches one listener at the root</b> — Your handlers are dispatched from there — measured on 1000 buttons: <code>document</code> holds 2 click listeners (capture + bubble). Each element with <code>onClick</code> still gets an <em>empty</em> <code>onclick</code> function, set by React as an iOS Safari fix — a thousand no-ops, one dispatcher.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>The event object is React&#39;s own</b> — A SyntheticEvent with the same API as the DOM one, normalised across browsers. <code>e.nativeEvent</code> gets you the original.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>preventDefault still works</b> — And it is still how you stop a form submitting or a link navigating. <code>return false</code> does nothing in React.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>onClick={handleDelete(id)}</code> fires during render, not on click.</strong> The parentheses call the function immediately, so the row deletes itself as soon as the list renders — and if the handler sets state, that render triggers another render and you get an infinite loop with a stack trace that points at React internals. In plain JavaScript nothing warns you — passing a function&#39;s return value is valid code. In a <code>.tsx</code> file TypeScript does catch the common case (<code>Type &#39;void&#39; is not assignable to type &#39;MouseEventHandler…&#39;</code>, TS2322), but only if you run <code>tsc</code> or <code>next build</code> — <code>next dev</code> never type-checks — and not when the function returns another function. When a handler needs an argument, wrap it: <code>onClick={() =&gt; handleDelete(id)}</code>. The arrow is created on each render, which is fine — that cost is invisible next to the bug it prevents.</p></div>
<a class="link-card dl" href="https://react.dev/learn/responding-to-events" target="_blank" rel="noopener">
  <span class="lc-ico">🖱️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Responding to events</span><span class="lc-sub">Handlers, arguments, propagation, and preventDefault.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/common#react-event-object" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">react.dev — The React event object</span><span class="lc-sub">What a SyntheticEvent carries, and how it differs from the DOM event.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add an <code>onClick</code> that logs the event object; inspect <code>event.target</code> and <code>event.type</code>.</li>
<li>Make the classic mistake <code>onClick={handleClick()}</code> (called immediately) and fix it to <code>onClick={handleClick}</code> or <code>onClick={() =&gt; handleClick(id)}</code>.</li>
<li>Add an <code>onChange</code> on an input and read <code>event.target.value</code> on every keystroke.</li>
</ol>
<p><strong>Done when:</strong> you can attach handlers correctly and know why passing a call result differs from passing the function.</p></div>

<h3>🔬 Measured: event handlers on React 19.3.0 · Next.js 16.4.6</h3>
<p>First the classic mistake, <code>onClick={{xoa(t)}}</code>, in three flavours. TypeScript rejects it — <code>next dev</code> runs it anyway:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

let lanGoi = 0;

export default function GoiNgay() {
  const [items] = useState(['An', 'Bình', 'Lan']);
  function xoa(ten: string) {
    lanGoi++;
    console.log(&#96;xoa('\${ten}') chạy · lần \${lanGoi}&#96;);
  }
  return (
    &lt;ul className="space-y-2 p-6 font-sans text-lg"&gt;
      {items.map((t) =&gt; (
        &lt;li key={t}&gt;{t} &lt;button className="rounded border px-2" onClick={xoa(t)}&gt;xoá&lt;/button&gt;&lt;/li&gt; <span class="tok-comment">  // ✗ gọi ngay</span>
      ))}
    &lt;/ul&gt;
  );
}</code></pre>
<pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/goi-ngay/chuoi.tsx(2,18): error TS2322: Type 'string' is not assignable to type 'MouseEventHandler&lt;HTMLButtonElement&gt;'.
src/app/goi-ngay/page.tsx(15,65): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler&lt;HTMLButtonElement&gt; | undefined'.
src/app/goi-ngay2/page.tsx(12,65): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler&lt;HTMLButtonElement&gt; | undefined'.
src/app/goi-ngay3/page.tsx(9,72): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler&lt;HTMLButtonElement&gt; | undefined'.</div>
<pre><code class="language-bash">$ npx next dev  <span class="tok-comment">  # open /goi-ngay, /goi-ngay2, /goi-ngay3 — no clicks</span></code></pre><div class="out">▲ Next.js 16.4.6 (Turbopack)
- Local:         http://127.0.0.1:19331
- Network:       http://127.0.0.1:19331
✓ Ready in 375ms
✓ Running next.config.ts took 69ms
xoa('An') chạy · lần 1
xoa('Bình') chạy · lần 2
xoa('Lan') chạy · lần 3
 GET /goi-ngay 200 in 212ms (next.js: 113ms, application-code: 98ms)
xoa('An') chạy · lần 4
xoa('Bình') chạy · lần 5
xoa('Lan') chạy · lần 6
 GET /goi-ngay 200 in 31ms (next.js: 1.0ms, application-code: 30ms)
 GET /goi-ngay2 200 in 32ms (next.js: 4ms, application-code: 27ms)
⨯ Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
    at tang (src/app/goi-ngay3/page.tsx:7:5)
    at GoiNgay3 (src/app/goi-ngay3/page.tsx:9:81)
   5 |   const [dem, setDem] = useState(0);
   6 |   function tang() {
&gt;  7 |     setDem(dem + 1);
     |     ^
   8 |   }
   9 |   return &lt;button className="m-6 rounded border px-2 font-sans text-lg" onClick={tang()}&gt;đã bấm {dem} lần&lt;/button&gt;;
  10 | } {
  digest: '2648147188'
}
 GET /goi-ngay3 500 in 301ms (next.js: 4ms, application-code: 296ms)
[browser] Uncaught Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.</div>
<div class="out">browser console on /goi-ngay (before any click): xoa('An') chạy · lần 1 · xoa('Bình') chạy · lần 2 · xoa('Lan') chạy · lần 3 · xoa('An') chạy · lần 4 · xoa('Bình') chạy · lần 5 · xoa('Lan') chạy · lần 6
/goi-ngay2 (handler deletes an item): rows left = 0
/goi-ngay3: Too many re-renders. React limits the number of renders to prevent an infinite loop.</div>
<p>Six calls in the browser = 3 rows × Strict Mode's double render; the server ran it 3 times per request. The delete version empties the list and stops; the counter version never stops.</p>
<p>Then the event object, one root listener, and the IME trap — page <code>/su-kien</code> under <code>next start</code>:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function SuKien() {
  const [nhat, setNhat] = useState&lt;string[]&gt;([]);
  const ghi = (s: string) =&gt; setNhat((n) =&gt; [...n, s]);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;button id="bam" className="rounded border px-2"
        onClick={(e) =&gt; ghi(&#96;click · e.type=\${e.type} · e.target=&lt;\${(e.target as HTMLElement).tagName.toLowerCase()}&gt; · e.nativeEvent=\${e.nativeEvent.constructor.name}&#96;)}&gt;
        bấm tôi
      &lt;/button&gt;
      &lt;input id="o" className="block rounded border px-2" placeholder="gõ…"
        onChange={(e) =&gt; ghi(&#96;change · e.target.value="\${e.target.value}"&#96;)}
        onKeyDown={(e) =&gt; { if (e.key === 'Enter') ghi(&#96;keydown · e.key=Enter · isComposing=\${e.nativeEvent.isComposing}&#96;); }} /&gt;
      &lt;a id="lk" href="#da-di" className="text-blue-600 underline" onClick={() =&gt; { ghi('click link · return false'); return false; }}&gt;link có return false&lt;/a&gt;
      &lt;ol id="nhat" className="list-decimal pl-6 text-base"&gt;{nhat.map((s, i) =&gt; &lt;li key={i}&gt;{s}&lt;/li&gt;)}&lt;/ol&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">click, type "h" "i", Enter, click the link with return false:
  click · e.type=click · e.target=&lt;button&gt; · e.nativeEvent=PointerEvent
  change · e.target.value="h"
  change · e.target.value="hi"
  keydown · e.key=Enter · isComposing=false
  click link · return false
  location.hash = #da-di</div>
<div class="out">1000 buttons, each with onClick (Chrome DevTools Protocol · getEventListeners):
  click listeners on the buttons : 1000  (button.onclick = function tM(){})
  document                    : click 2 (capture + bubble) · all types 144
  html / body                 : click 0 / 0
  click button 42                 ⇒ đã chọn: 42</div>
<div class="out">Chromium · Input.imeSetComposition("việ") → Enter → commit "việt" → Enter:
  change · e.target.value="việ"
  keydown · e.key=Enter · isComposing=true
  change · e.target.value="việt"
  keydown · e.key=Enter · isComposing=false</div>
<p><code>return false</code> did not stop the link (the hash changed to <code>#da-di</code>). And while the IME was composing, Enter reached <code>onKeyDown</code> with <code>isComposing=true</code> — the guard <code>if (e.nativeEvent.isComposing) return;</code> is not optional.</p>
<p>Finally, forms — page <code>/form-tai</code>:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function FormTai() {
  const [dem, setDem] = useState(0);
  const [gui, setGui] = useState&lt;string[]&gt;([]);
  const them = (s: string) =&gt; setGui((g) =&gt; [...g, s]);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;p id="trang-thai"&gt;dem = {dem} · đã chạy: [{gui.join(', ')}]&lt;/p&gt;
      &lt;button id="tang" type="button" className="rounded border px-2" onClick={() =&gt; setDem(dem + 1)}&gt;+1&lt;/button&gt;
      &lt;form id="f1" className="rounded border p-2" onSubmit={() =&gt; them('f1')}&gt;
        ✗ quên preventDefault &lt;input id="q1" name="q" className="rounded border px-2" /&gt;
      &lt;/form&gt;
      &lt;form id="f2" className="rounded border p-2" onSubmit={(e) =&gt; { e.preventDefault(); them('f2'); }}&gt;
        ✓ e.preventDefault() &lt;input id="q2" name="q" className="rounded border px-2" /&gt;
      &lt;/form&gt;
      &lt;form id="f3" className="rounded border p-2" onSubmit={(e) =&gt; { e.preventDefault(); them('f3 onSubmit'); }}&gt;
        &lt;input id="q3" className="rounded border px-2" /&gt; &lt;button id="nut3" className="rounded border px-2" onClick={() =&gt; them('f3 onClick nút')}&gt;gửi&lt;/button&gt;
      &lt;/form&gt;
      &lt;div className="rounded border p-2"&gt;
        &lt;input id="q4" className="rounded border px-2" /&gt; &lt;button id="nut4" className="rounded border px-2" onClick={() =&gt; them('nut4 onClick')}&gt;gửi (không có form)&lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">click +1 ×3; Enter in form 2, form 3, the formless input:
  dem = 3 · đã chạy: [f2, f3 onClick nút, f3 onSubmit]
Enter in form 1 (no preventDefault):
  URL localhost:3000/form-tai?q=x · dem = 0 · đã chạy: [] · navigation: navigate</div>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|su-kien|form-tai|nghin'</code></pre><div class="out">✓ Compiled successfully in 178ms
├ ○ /form-tai
├ ○ /nghin
├ ○ /su-kien</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npx tsc --noEmit              <span class="tok-comment">  # with /goi-ngay present: TS2322 void / string</span>
npx next dev                  <span class="tok-comment">  # open /goi-ngay* and watch the terminal — then DELETE those pages before building</span>
npm run build &amp;&amp; npm start    <span class="tok-comment">  # /su-kien, /form-tai, /nghin</span>
<span class="tok-comment"># DevTools → Elements → pick a button → Event Listeners: the empty onclick; select document: React's listeners</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-2-2-su-kien" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 2.2 — Events</span><span class="lc-sub">onClick takes a function, bubbling and stopPropagation, the form reload, buttons without a type — measured in Chromium</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-6-2-slot11-events-slides" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · 6.2 — Event handling (Slot 11–12)</span><span class="lc-sub">The university deck: declaring handlers, arguments, SyntheticEvent</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-6-ex16-event-handling" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 16 — Event handling</span><span class="lc-sub">Practice: inline vs named, arguments through an arrow, preventDefault</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Event handler</span><span class="v">A function you pass to an event prop like <code>onClick</code>.</span></div>
  <div class="kv"><span class="k">Synthetic event</span><span class="v">React's cross-browser wrapper around the native DOM event.</span></div>
  <div class="kv"><span class="k">Pass vs call</span><span class="v"><code>onClick={fn}</code> passes it; <code>onClick={fn()}</code> calls it during render.</span></div>
  <div class="kv"><span class="k">Arrow wrapper</span><span class="v"><code>() =&gt; fn(arg)</code> to pass arguments without calling early.</span></div>
  <div class="kv"><span class="k">event.target</span><span class="v">The DOM element that fired the event (its <code>.value</code> for inputs).</span></div>
  <div class="kv"><span class="k">preventDefault</span><span class="v">Stop the browser's default behaviour (e.g. form navigation).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Attach handlers via camelCased props (<code>onClick</code>, <code>onChange</code>) that take a function.</li><li>Pass the function (<code>onClick={fn}</code>), do not call it — wrap in an arrow to pass arguments.</li><li>Handlers receive a synthetic event; read <code>event.target.value</code> for inputs.</li><li>Use <code>preventDefault</code> to stop default browser behaviour where needed.</li></ul>

</div>

<div class="ml-vi">
<div class="callout ok"><strong>Đã học khoá React?</strong> Chương này là phần ôn nhanh React &mdash; cùng chủ đề được dạy kỹ ở khoá <a href="/courses/react">React</a> (Chương 2 phần sự kiện, Chương 3 phần form). Đọc lướt hoặc chuyển thẳng sang <strong>Chương 8</strong>, nơi bắt đầu phần riêng của Next.js. Nhớ: Next.js là <em>framework dựng trên React</em> &mdash; mọi component, props, state, hook ở đây vẫn là React thuần.</div>
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Phản hồi người dùng</h2>
<p class="lead">State ở Chương 3 thay đổi để đáp lại việc người dùng làm — một cú click, một phím gõ, một form gửi đi. Bạn nối chúng bằng handler sự kiện: những hàm bạn truyền cho các prop như <code>onClick</code> và <code>onChange</code>. Có hai lỗi ai cũng mắc một lần, rồi không bao giờ mắc lại.</p>

<h3>Truyền một hàm — đừng gọi nó</h3>
<pre><code class="language-html"><span class="tok-comment">// ✅ truyền hàm; React gọi nó khi click</span>
&lt;button onClick={handleClick}&gt;Save&lt;/button&gt;

<span class="tok-comment">// ❌ gọi handleClick NGAY trong lúc render, truyền giá trị trả về của nó</span>
&lt;button onClick={handleClick()}&gt;Save&lt;/button&gt;</code></pre>
<p>Dòng thứ hai chạy <code>handleClick</code> ngay lúc component render — không phải lúc click — vì <code>()</code> nghĩa là "gọi ngay". Bất kể nó trả về gì (thường là <code>undefined</code>) đều trở thành handler. Nếu <code>handleClick</code> gọi <code>setState</code>, nó có thể lặp vô tận (đo thật: <code>setDem(dem + 1)</code> ⇒ "Too many re-renders", máy chủ trả 500) — hoặc, như một hàm xoá, lặng lẽ xoá sạch danh sách trước khi ai kịp bấm. Khi cần truyền đối số, hãy bọc trong một arrow function để lời gọi được <em>hoãn</em> tới lúc có sự kiện:</p>
<pre><code class="language-html">&lt;button onClick={() =&gt; handleDelete(item.id)}&gt;Delete&lt;/button&gt;</code></pre>
<p>Giờ <code>onClick</code> nhận một hàm <code>() =&gt; handleDelete(item.id)</code>, và <code>handleDelete</code> chỉ chạy khi được click. Cũng lưu ý handler viết camelCase và nhận một hàm thật, không bao giờ là chuỗi — <code>onClick={...}</code>, không phải <code>onclick="..."</code> của HTML.</p>

<h3>Object sự kiện</h3>
<p>React gọi handler của bạn với một object sự kiện mô tả chuyện đã xảy ra. Nó là một <em>SyntheticEvent</em> — lớp bọc đa trình duyệt của React quanh sự kiện gốc, với cùng API bạn đã biết (<code>e.target</code>, <code>e.preventDefault()</code>, <code>e.key</code>):</p>
<pre><code class="language-javascript">function handleChange(e) {
  console.log(e.target.value);   <span class="tok-comment">// chữ hiện tại của input</span>
}

function handleKeyDown(e) {
  if (e.key === 'Enter') submit();
}</code></pre>
<p><code>e.target</code> là phần tử DOM phát ra sự kiện; <code>e.target.value</code> là cách bạn đọc cái người dùng gõ. Đây là cây cầu tới input có kiểm soát ở bài sau.</p>

<h3><code>preventDefault</code>: chặn hành vi mặc định của trình duyệt</h3>
<p>Một số phần tử làm gì đó theo mặc định: form submit tải lại trang, một link điều hướng, một checkbox bật/tắt. Khi bạn tự xử lý sự kiện, gọi <code>e.preventDefault()</code> để huỷ mặc định:</p>
<pre><code class="language-typescript">function handleSubmit(e) {
  e.preventDefault();          <span class="tok-comment">// chặn việc tải lại cả trang</span>
  <span class="tok-comment">// …làm submit của riêng bạn (gọi API, cập nhật state)…</span>
}

&lt;form onSubmit={handleSubmit}&gt; … &lt;/form&gt;</code></pre>
<p>Quên <code>preventDefault</code> trên <code>onSubmit</code> của form là bug kinh điển "trang chớp một cái và state reset khi tôi nhấn enter" — trình duyệt đã tải lại cả trang. Hãy xử submit trên <code>onSubmit</code> của <code>&lt;form&gt;</code>, không phải trên <code>onClick</code> của nút. Đo thật: Enter trong form tự "bấm" nút submit mặc định, nên <code>onClick</code> của nút submit vẫn chạy — nhưng đổi nút thành <code>type="button"</code> hoặc đưa nó ra khỏi form là Enter hết tác dụng. <code>onSubmit</code> bắt mọi đường gửi.</p>

<div class="pitfall">
<p><strong>Bẫy IME — có thật, và site này từng dính.</strong> Khi gõ tiếng Việt, Nhật hay Trung, một bộ gõ (IME) ghép ký tự trước khi chốt, và nhấn <em>Enter</em> giữa lúc đang ghép nghĩa là "xác nhận ký tự này", không phải "gửi". Một <code>onKeyDown</code> ngây thơ submit khi Enter sẽ nổ giữa lúc đang ghép và ăn mất chữ của người dùng. Hãy chặn: <code>if (e.nativeEvent.isComposing) return;</code> trước khi xử Enter/Space/Escape. cuongthai.com học được điều này ở khung soạn tin nhắn và feed — cái chặn này giờ là chuẩn cho mọi handler bàn phím phải sống chung với bộ gõ CJK.</p>
</div>
<h3>Handler sự kiện của React khác handler HTML thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó là một hàm, không phải một chuỗi</b> — <code>onClick={handleClick}</code> truyền cái hàm. <code>onClick={handleClick()}</code> GỌI nó ngay lúc render rồi truyền kết quả — thường là <code>undefined</code>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>React gắn một listener duy nhất ở gốc</b> — Handler của bạn được điều phối từ đó — đo trên 1000 nút: <code>document</code> giữ 2 listener click (capture + bubble). Mỗi phần tử có <code>onClick</code> vẫn nhận một hàm <code>onclick</code> <em>rỗng</em> do React đặt để vá Safari iOS — một nghìn hàm rỗng, một bàn điều phối.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Object sự kiện là của chính React</b> — Một SyntheticEvent có cùng API với object DOM, đã chuẩn hoá giữa các trình duyệt. <code>e.nativeEvent</code> cho bạn cái gốc.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>preventDefault vẫn chạy</b> — Và vẫn là cách bạn chặn một form gửi đi hay một liên kết chuyển trang. <code>return false</code> chẳng làm gì trong React cả.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>onClick={handleDelete(id)}</code> nổ ngay lúc render, không phải lúc bấm.</strong> Cặp ngoặc tròn gọi hàm ngay lập tức, nên cái dòng đó tự xoá mình ngay khi danh sách vừa vẽ ra — và nếu handler có đặt state thì lần render đó lại kích hoạt một lần render nữa, và bạn có một vòng lặp vô tận với vệt stack chỉ vào ruột của React. Với JavaScript thuần thì không gì cảnh báo — truyền giá trị trả về của một hàm là mã hợp lệ. Trong tệp <code>.tsx</code>, TypeScript CÓ bắt ca hay gặp (<code>Type &#39;void&#39; is not assignable to type &#39;MouseEventHandler…&#39;</code>, TS2322), nhưng chỉ khi bạn chạy <code>tsc</code> hoặc <code>next build</code> — <code>next dev</code> không bao giờ kiểm kiểu — và không bắt khi hàm trả về một hàm khác. Khi một handler cần đối số, hãy bọc nó lại: <code>onClick={() =&gt; handleDelete(id)}</code>. Cái arrow được tạo lại ở mỗi lần render, và điều đó không sao — chi phí ấy vô hình bên cạnh cái lỗi mà nó ngăn được.</p></div>
<a class="link-card dl" href="https://react.dev/learn/responding-to-events" target="_blank" rel="noopener">
  <span class="lc-ico">🖱️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Phản hồi sự kiện</span><span class="lc-sub">Handler, đối số, lan truyền, và preventDefault.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/common#react-event-object" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">react.dev — Object sự kiện của React</span><span class="lc-sub">Một SyntheticEvent mang những gì, và nó khác object sự kiện DOM ra sao.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một <code>onClick</code> log ra object sự kiện; xem <code>event.target</code> và <code>event.type</code>.</li>
<li>Mắc lỗi kinh điển <code>onClick={handleClick()}</code> (gọi ngay) rồi sửa thành <code>onClick={handleClick}</code> hoặc <code>onClick={() =&gt; handleClick(id)}</code>.</li>
<li>Thêm <code>onChange</code> trên một input và đọc <code>event.target.value</code> mỗi lần gõ.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gắn handler đúng cách và biết vì sao truyền kết quả lời gọi khác với truyền chính hàm.</p></div>

<h3>🔬 Đo thật: hàm xử lý sự kiện trên React 19.3.0 · Next.js 16.4.6</h3>
<p>Trước hết là lỗi kinh điển, <code>onClick={{xoa(t)}}</code>, ở ba dạng. TypeScript từ chối — <code>next dev</code> vẫn chạy:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

let lanGoi = 0;

export default function GoiNgay() {
  const [items] = useState(['An', 'Bình', 'Lan']);
  function xoa(ten: string) {
    lanGoi++;
    console.log(&#96;xoa('\${ten}') chạy · lần \${lanGoi}&#96;);
  }
  return (
    &lt;ul className="space-y-2 p-6 font-sans text-lg"&gt;
      {items.map((t) =&gt; (
        &lt;li key={t}&gt;{t} &lt;button className="rounded border px-2" onClick={xoa(t)}&gt;xoá&lt;/button&gt;&lt;/li&gt; <span class="tok-comment">  // ✗ gọi ngay</span>
      ))}
    &lt;/ul&gt;
  );
}</code></pre>
<pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/goi-ngay/chuoi.tsx(2,18): error TS2322: Type 'string' is not assignable to type 'MouseEventHandler&lt;HTMLButtonElement&gt;'.
src/app/goi-ngay/page.tsx(15,65): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler&lt;HTMLButtonElement&gt; | undefined'.
src/app/goi-ngay2/page.tsx(12,65): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler&lt;HTMLButtonElement&gt; | undefined'.
src/app/goi-ngay3/page.tsx(9,72): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler&lt;HTMLButtonElement&gt; | undefined'.</div>
<pre><code class="language-bash">$ npx next dev  <span class="tok-comment">  # mở /goi-ngay, /goi-ngay2, /goi-ngay3 — không bấm gì</span></code></pre><div class="out">▲ Next.js 16.4.6 (Turbopack)
- Local:         http://127.0.0.1:19331
- Network:       http://127.0.0.1:19331
✓ Ready in 375ms
✓ Running next.config.ts took 69ms
xoa('An') chạy · lần 1
xoa('Bình') chạy · lần 2
xoa('Lan') chạy · lần 3
 GET /goi-ngay 200 in 212ms (next.js: 113ms, application-code: 98ms)
xoa('An') chạy · lần 4
xoa('Bình') chạy · lần 5
xoa('Lan') chạy · lần 6
 GET /goi-ngay 200 in 31ms (next.js: 1.0ms, application-code: 30ms)
 GET /goi-ngay2 200 in 32ms (next.js: 4ms, application-code: 27ms)
⨯ Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
    at tang (src/app/goi-ngay3/page.tsx:7:5)
    at GoiNgay3 (src/app/goi-ngay3/page.tsx:9:81)
   5 |   const [dem, setDem] = useState(0);
   6 |   function tang() {
&gt;  7 |     setDem(dem + 1);
     |     ^
   8 |   }
   9 |   return &lt;button className="m-6 rounded border px-2 font-sans text-lg" onClick={tang()}&gt;đã bấm {dem} lần&lt;/button&gt;;
  10 | } {
  digest: '2648147188'
}
 GET /goi-ngay3 500 in 301ms (next.js: 4ms, application-code: 296ms)
[browser] Uncaught Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.</div>
<div class="out">console trình duyệt ở /goi-ngay (chưa bấm gì): xoa('An') chạy · lần 1 · xoa('Bình') chạy · lần 2 · xoa('Lan') chạy · lần 3 · xoa('An') chạy · lần 4 · xoa('Bình') chạy · lần 5 · xoa('Lan') chạy · lần 6
/goi-ngay2 (handler xoá phần tử): còn 0 dòng
/goi-ngay3: Too many re-renders. React limits the number of renders to prevent an infinite loop.</div>
<p>Sáu lần ở trình duyệt = 3 dòng × render đôi của Strict Mode; máy chủ chạy 3 lần mỗi request. Bản xoá làm danh sách trống rồi dừng; bản bộ đếm thì không bao giờ dừng.</p>
<p>Tiếp theo là object sự kiện, một listener ở gốc và bẫy bộ gõ — trang <code>/su-kien</code> dưới <code>next start</code>:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function SuKien() {
  const [nhat, setNhat] = useState&lt;string[]&gt;([]);
  const ghi = (s: string) =&gt; setNhat((n) =&gt; [...n, s]);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;button id="bam" className="rounded border px-2"
        onClick={(e) =&gt; ghi(&#96;click · e.type=\${e.type} · e.target=&lt;\${(e.target as HTMLElement).tagName.toLowerCase()}&gt; · e.nativeEvent=\${e.nativeEvent.constructor.name}&#96;)}&gt;
        bấm tôi
      &lt;/button&gt;
      &lt;input id="o" className="block rounded border px-2" placeholder="gõ…"
        onChange={(e) =&gt; ghi(&#96;change · e.target.value="\${e.target.value}"&#96;)}
        onKeyDown={(e) =&gt; { if (e.key === 'Enter') ghi(&#96;keydown · e.key=Enter · isComposing=\${e.nativeEvent.isComposing}&#96;); }} /&gt;
      &lt;a id="lk" href="#da-di" className="text-blue-600 underline" onClick={() =&gt; { ghi('click link · return false'); return false; }}&gt;link có return false&lt;/a&gt;
      &lt;ol id="nhat" className="list-decimal pl-6 text-base"&gt;{nhat.map((s, i) =&gt; &lt;li key={i}&gt;{s}&lt;/li&gt;)}&lt;/ol&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">bấm, gõ "h" "i", Enter, bấm liên kết có return false:
  click · e.type=click · e.target=&lt;button&gt; · e.nativeEvent=PointerEvent
  change · e.target.value="h"
  change · e.target.value="hi"
  keydown · e.key=Enter · isComposing=false
  click link · return false
  location.hash = #da-di</div>
<div class="out">1000 nút, mỗi nút một onClick (Chrome DevTools Protocol · getEventListeners):
  listener click trên các nút  : 1000  (button.onclick = function tM(){})
  document                    : click 2 (capture + bubble) · mọi loại 144
  html / body                 : click 0 / 0
  bấm nút 42                 ⇒ đã chọn: 42</div>
<div class="out">Chromium · Input.imeSetComposition("việ") → Enter → chốt "việt" → Enter:
  change · e.target.value="việ"
  keydown · e.key=Enter · isComposing=true
  change · e.target.value="việt"
  keydown · e.key=Enter · isComposing=false</div>
<p><code>return false</code> không chặn được liên kết (hash đổi thành <code>#da-di</code>). Và khi bộ gõ đang ghép chữ, Enter vẫn tới <code>onKeyDown</code> với <code>isComposing=true</code> — câu chặn <code>if (e.nativeEvent.isComposing) return;</code> là bắt buộc.</p>
<p>Cuối cùng là form — trang <code>/form-tai</code>:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function FormTai() {
  const [dem, setDem] = useState(0);
  const [gui, setGui] = useState&lt;string[]&gt;([]);
  const them = (s: string) =&gt; setGui((g) =&gt; [...g, s]);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;p id="trang-thai"&gt;dem = {dem} · đã chạy: [{gui.join(', ')}]&lt;/p&gt;
      &lt;button id="tang" type="button" className="rounded border px-2" onClick={() =&gt; setDem(dem + 1)}&gt;+1&lt;/button&gt;
      &lt;form id="f1" className="rounded border p-2" onSubmit={() =&gt; them('f1')}&gt;
        ✗ quên preventDefault &lt;input id="q1" name="q" className="rounded border px-2" /&gt;
      &lt;/form&gt;
      &lt;form id="f2" className="rounded border p-2" onSubmit={(e) =&gt; { e.preventDefault(); them('f2'); }}&gt;
        ✓ e.preventDefault() &lt;input id="q2" name="q" className="rounded border px-2" /&gt;
      &lt;/form&gt;
      &lt;form id="f3" className="rounded border p-2" onSubmit={(e) =&gt; { e.preventDefault(); them('f3 onSubmit'); }}&gt;
        &lt;input id="q3" className="rounded border px-2" /&gt; &lt;button id="nut3" className="rounded border px-2" onClick={() =&gt; them('f3 onClick nút')}&gt;gửi&lt;/button&gt;
      &lt;/form&gt;
      &lt;div className="rounded border p-2"&gt;
        &lt;input id="q4" className="rounded border px-2" /&gt; &lt;button id="nut4" className="rounded border px-2" onClick={() =&gt; them('nut4 onClick')}&gt;gửi (không có form)&lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">bấm +1 ×3; Enter ở form 2, form 3, ô không có form:
  dem = 3 · đã chạy: [f2, f3 onClick nút, f3 onSubmit]
Enter ở form 1 (quên preventDefault):
  URL localhost:3000/form-tai?q=x · dem = 0 · đã chạy: [] · navigation: navigate</div>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|su-kien|form-tai|nghin'</code></pre><div class="out">✓ Compiled successfully in 178ms
├ ○ /form-tai
├ ○ /nghin
├ ○ /su-kien</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npx tsc --noEmit              <span class="tok-comment">  # khi còn /goi-ngay: TS2322 void / string</span>
npx next dev                  <span class="tok-comment">  # mở /goi-ngay* và xem terminal — rồi XOÁ các trang đó trước khi build</span>
npm run build &amp;&amp; npm start    <span class="tok-comment">  # /su-kien, /form-tai, /nghin</span>
<span class="tok-comment"># DevTools → Elements → chọn một nút → Event Listeners: onclick rỗng; chọn document: các listener của React</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-2-2-su-kien" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 2.2 — Sự kiện</span><span class="lc-sub">onClick nhận một hàm, nổi bọt và stopPropagation, form tải lại trang, nút không ghi type — đo bằng Chromium thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-6-2-slot11-events-slides" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · 6.2 — Event handling (Slot 11–12)</span><span class="lc-sub">Bài trên trường: khai báo handler, tham số, SyntheticEvent</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-6-ex16-event-handling" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 16 — Event handling</span><span class="lc-sub">Luyện tay: inline vs named, tham số qua arrow, preventDefault</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Event handler</span><span class="v">Một hàm bạn truyền vào prop sự kiện như <code>onClick</code>.</span></div>
  <div class="kv"><span class="k">Synthetic event</span><span class="v">Lớp bọc đa trình duyệt của React quanh sự kiện DOM gốc.</span></div>
  <div class="kv"><span class="k">Truyền vs gọi</span><span class="v"><code>onClick={fn}</code> truyền hàm; <code>onClick={fn()}</code> gọi nó lúc render.</span></div>
  <div class="kv"><span class="k">Vỏ arrow</span><span class="v"><code>() =&gt; fn(arg)</code> để truyền tham số mà không gọi sớm.</span></div>
  <div class="kv"><span class="k">event.target</span><span class="v">Phần tử DOM phát ra sự kiện (<code>.value</code> của nó với input).</span></div>
  <div class="kv"><span class="k">preventDefault</span><span class="v">Chặn hành vi mặc định của trình duyệt (vd điều hướng khi submit form).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Gắn handler qua prop camelCase (<code>onClick</code>, <code>onChange</code>) nhận vào một hàm.</li><li>Truyền chính hàm (<code>onClick={fn}</code>), đừng gọi nó — bọc arrow để truyền tham số.</li><li>Handler nhận một synthetic event; đọc <code>event.target.value</code> với input.</li><li>Dùng <code>preventDefault</code> để chặn hành vi mặc định của trình duyệt khi cần.</li></ul>

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
${G04_2}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>The input's value lives in state, not in the DOM</h2>
<p class="lead">A <strong>controlled input</strong> is the central pattern of every React form: React state holds the value, the input displays that state, and every keystroke updates the state, which re-renders the input. The DOM stops being the source of truth — your state is.</p>

<h3>The two-way wire that is really one-way</h3>
<pre><code class="language-typescript">function NameField() {
  const [name, setName] = useState('');
  return (
    &lt;input
      value={name}                              <span class="tok-comment">// state → input</span>
      onChange={(e) =&gt; setName(e.target.value)} <span class="tok-comment">// input → state</span>
    /&gt;
  );
}</code></pre>
<p>Read it as a loop. The input's <code>value</code> is always whatever <code>name</code> currently is. When the user types, <code>onChange</code> fires, you read <code>e.target.value</code>, and call <code>setName</code>. That re-renders the component, <code>name</code> is the new text, and the input shows it. It looks two-way, but data only ever flows <em>state → input</em>; the keystroke is just an event that asks state to change.</p>
<p>Rendered to HTML, a controlled input carries its value in the DOM — verified. (So does an uncontrolled <code>defaultValue</code> input: the markup is identical, the difference lives in React — see the measurement below.)</p>
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
<p><strong>The <code>value</code>-without-<code>onChange</code> warning.</strong> If you set <code>value={name}</code> but forget <code>onChange</code>, React makes the field read-only and warns: <em>"You provided a <code>value</code> prop to a form field without an <code>onChange</code> handler."</em> You told React "the value is always <code>name</code>", so it refuses to let the DOM diverge — with no <code>onChange</code>, typing can never update <code>name</code>, so the field is frozen. Either add <code>onChange</code> (controlled) or use <code>defaultValue</code> instead of <code>value</code> (uncontrolled — Lesson 4.4). A related trap: never initialise state to <code>null</code>/<code>undefined</code> for an input, or it flips between uncontrolled and controlled and warns; start with an empty string.</p>
</div>
<h3>A controlled input, in one loop</h3>
<div class="lz-map">
  <div class="lz-stage">State is the truth; the input just displays it</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">value comes from state</div><div class="lz-nsub"><code>value={text}</code>. The input shows what state says, always — there is no second copy of the truth living in the DOM.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">onChange writes back</div><div class="lz-nsub"><code>onChange={e =&gt; setText(e.target.value)}</code>. Every keystroke updates state, which re-renders, which sets the value.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">So you can transform on the way</div><div class="lz-nsub">Uppercase it, strip spaces, cap the length, reject non-digits — because every character passes through your code. (Mind the caret: writing back a <i>different</i> string moves it to the end — measured below.)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">And read it anywhere</div><div class="lz-nsub">Validation, a live preview, a disabled submit button. They all read the same variable, so nothing can disagree.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>value={user.name}</code> with no <code>onChange</code>, giving a field nobody can type in.</strong> React ties the input to state, state never changes, so every keypress is immediately overwritten by the old value — the field looks enabled and simply refuses input. The console says so (&quot;You provided a <code>value</code> prop to a form field without an <code>onChange</code> handler&quot;), but it is one warning among many and easy to miss. Three fixes depending on intent: add the handler, add <code>readOnly</code> if it is meant to be read-only, or use <code>defaultValue</code> if you wanted an uncontrolled field with an initial value.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/input" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">react.dev — The input component</span><span class="lc-sub">Controlled vs uncontrolled, with every prop and the warnings each triggers.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/reacting-to-input-with-state" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">react.dev — Reacting to input with state</span><span class="lc-sub">How to model a form as states rather than as a pile of booleans.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Make a controlled text input: <code>value={text}</code> and <code>onChange={e =&gt; setText(e.target.value)}</code>.</li>
<li>Set <code>value</code> without an <code>onChange</code> and read the React warning about a read-only input.</li>
<li>Transform input as the user types (uppercase it, strip spaces) to prove state is the single source of truth.</li>
</ol>
<p><strong>Done when:</strong> you can build a controlled input and explain why value + onChange go together.</p></div>

<h3>🔬 Measured: controlled inputs on React 19.3.0 · Next.js 16.4.6</h3>
<p>Server HTML first — controlled, uncontrolled and read-only side by side:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
console.log(renderToStaticMarkup(h('input', { value: 'hello', onChange: () =&gt; {} })));
console.log(renderToStaticMarkup(h('input', { defaultValue: 'hello' })));
console.log(renderToStaticMarkup(h('input', { value: 'hello', readOnly: true })));</code></pre><pre><code class="language-bash">$ node input-html.cjs</code></pre><div class="out">&lt;input value="hello"/&gt;
&lt;input value="hello"/&gt;
&lt;input readOnly="" value="hello"/&gt;</div>
<p>Lines 1 and 2 are identical: the HTML cannot tell a controlled input from a <code>defaultValue</code> one. What makes it controlled is React re-asserting <code>value</code> on every render.</p>
<p>Then one page with every case, typed into a real browser:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

function NameField() {
  const [name, setName] = useState('');
  const tooShort = name.length &lt; 3;                    <span class="tok-comment">  // suy ra, không lưu</span>
  return (
    &lt;div id="a" className="rounded border p-2"&gt;
      &lt;input id="ten" className="rounded border px-2" value={name} onChange={(e) =&gt; setName(e.target.value)} /&gt;
      &lt;button id="gui" className="ml-2 rounded border px-2 disabled:opacity-40" disabled={name.trim() === ''}&gt;gửi&lt;/button&gt;
      &lt;button id="xoa" className="ml-2 rounded border px-2" onClick={() =&gt; setName('')}&gt;xoá&lt;/button&gt;
      &lt;p id="xem"&gt;xem trước: “{name}” · {tooShort ? 'quá ngắn (&lt; 3)' : 'ổn'}&lt;/p&gt;
    &lt;/div&gt;
  );
}

function ChiDoc() {
  const [text] = useState('Bình');
  return &lt;input id="chet" className="rounded border px-2" value={text} /&gt;; <span class="tok-comment">  // ✗ value mà không onChange</span>
}

function VietHoa() {
  const [s, setS] = useState('');
  return &lt;input id="hoa" className="rounded border px-2" value={s} onChange={(e) =&gt; setS(e.target.value.toUpperCase())} /&gt;;
}

function SoDienThoai() {
  const [so, setSo] = useState('');
  const dep = so.replace(/^(\\d{4})(\\d{0,3})(\\d{0,3}).*/, (_, a, b, c) =&gt; [a, b, c].filter(Boolean).join(' '));
  return &lt;input id="sdt" className="rounded border px-2" value={dep} onChange={(e) =&gt; setSo(e.target.value.replace(/\\D/g, '').slice(0, 10))} /&gt;;
}

function BatDauNull() {
  const [v, setV] = useState&lt;string | null&gt;(null);       <span class="tok-comment">  // ✗ khởi tạo null</span>
  return &lt;input id="null" className="rounded border px-2" value={v as string} onChange={(e) =&gt; setV(e.target.value)} /&gt;;
}

export default function KiemSoat() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;NameField /&gt;
      &lt;p&gt;chỉ value: &lt;ChiDoc /&gt;&lt;/p&gt;
      &lt;p&gt;viết hoa: &lt;VietHoa /&gt;&lt;/p&gt;
      &lt;p&gt;số điện thoại: &lt;SoDienThoai /&gt;&lt;/p&gt;
      &lt;p&gt;bắt đầu null: &lt;BatDauNull /&gt;&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">type "An"            → xem trước: “An” · quá ngắn (&lt; 3) · gửi disabled=false
type "h"             → xem trước: “Anh” · ổn
click xoá            → input="" · gửi disabled=true
read-only: type "XY" → "Bình"
uppercase: a, b, ←, x → "AXB" · selectionStart = 3
phone: 0901a234567   → "0901 234 567"</div><div class="out">console.error (next dev):
  1. You provided a &#96;value&#96; prop to a form field without an &#96;onChange&#96; handler. This will render a read-only field. If the field should be mutable use &#96;defaultValue&#96;. Otherwise, set either &#96;onChange&#96; or &#96;readOnly&#96;.
  2. &#96;value&#96; prop on &#96;input&#96; should not be null. Consider using an empty string to clear the component or &#96;undefined&#96; for uncontrolled components.
  3. A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components</div><div class="out">next start: read-only field still "Bình" · uppercase "AXB" caret 3 · console: 0 messages</div>
<p>Three things the lesson text alone would not tell you: the caret <b>jumps to the end</b> when <code>onChange</code> writes back a different string (selectionStart 3, not 2 — in production too); the read-only warning is <b>development-only</b> — production just silently refuses input; and the <code>null</code> start produces <b>two</b> warnings, one on the first render and one when typing flips it to controlled. TypeScript stayed quiet because of the <code>as string</code> cast.</p>
<p>Fixing the caret: if uppercase is only for looks, use CSS <code>text-transform: uppercase</code>; if the data must be uppercase, transform on <code>onBlur</code> or on submit; if it must happen live, save <code>selectionStart</code> before <code>setState</code> and restore it with a ref (Chapter 6).</p>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|kiem-soat'</code></pre><div class="out">✓ Compiled successfully in 781ms
├ ○ /kiem-soat</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">node input-html.cjs
npx next dev                  <span class="tok-comment">  # open /kiem-soat with DevTools → Console; type in every field</span>
npm run build &amp;&amp; npm start    <span class="tok-comment">  # same page: the field is still frozen, the console is empty</span>
<span class="tok-comment"># caret: in DevTools run  $0.selectionStart  after typing in the middle</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — Controlled and uncontrolled inputs</span><span class="lc-sub">DOM-owned vs state-owned; commits per keystroke measured, both real warnings, many fields one handler</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-4-ex8-form-controls" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 8 — Form controls</span><span class="lc-sub">The university exercise where value ↔ state first appears</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Controlled input</span><span class="v">Its value comes from state; React owns what is shown.</span></div>
  <div class="kv"><span class="k">value + onChange</span><span class="v">The pair that makes an input controlled.</span></div>
  <div class="kv"><span class="k">Single source of truth</span><span class="v">State is the one place the input's value lives.</span></div>
  <div class="kv"><span class="k">Read-only warning</span><span class="v">Setting <code>value</code> with no <code>onChange</code> freezes the input.</span></div>
  <div class="kv"><span class="k">Derived input</span><span class="v">You can transform the typed value before storing it.</span></div>
  <div class="kv"><span class="k">Two-way binding feel</span><span class="v">State drives the UI; the UI updates state — but still one-way under the hood.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A controlled input binds <code>value</code> to state and updates state in <code>onChange</code>.</li><li>State is the single source of truth — the input shows whatever state says.</li><li>Setting <code>value</code> with no <code>onChange</code> makes it read-only (and React warns).</li><li>Because you own the value, you can validate or transform it as the user types.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Giá trị của input nằm trong state, không phải trong DOM</h2>
<p class="lead">Một <strong>input có kiểm soát</strong> là khuôn mẫu trung tâm của mọi form React: state React giữ giá trị, input hiển thị state đó, và mỗi phím gõ cập nhật state, việc này render lại input. DOM thôi làm nguồn sự thật — state của bạn mới là.</p>

<h3>Sợi dây hai chiều thật ra là một chiều</h3>
<pre><code class="language-typescript">function NameField() {
  const [name, setName] = useState('');
  return (
    &lt;input
      value={name}                              <span class="tok-comment">// state → input</span>
      onChange={(e) =&gt; setName(e.target.value)} <span class="tok-comment">// input → state</span>
    /&gt;
  );
}</code></pre>
<p>Hãy đọc nó như một vòng lặp. <code>value</code> của input luôn là bất kể <code>name</code> đang là gì. Khi người dùng gõ, <code>onChange</code> nổ, bạn đọc <code>e.target.value</code>, và gọi <code>setName</code>. Việc đó render lại component, <code>name</code> là chữ mới, và input hiện nó. Trông như hai chiều, nhưng dữ liệu chỉ luôn chảy <em>state → input</em>; phím gõ chỉ là một sự kiện xin state đổi.</p>
<p>Render ra HTML, một input có kiểm soát mang giá trị của nó trong DOM — đã kiểm. (Ô không kiểm soát dùng <code>defaultValue</code> cũng vậy: HTML giống hệt, khác biệt nằm trong React — xem số đo bên dưới.)</p>
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
<p><strong>Cảnh báo <code>value</code> mà thiếu <code>onChange</code>.</strong> Nếu bạn đặt <code>value={name}</code> mà quên <code>onChange</code>, React biến ô thành chỉ đọc và cảnh báo: <em>"You provided a <code>value</code> prop to a form field without an <code>onChange</code> handler."</em> Bạn đã bảo React "giá trị luôn là <code>name</code>", nên nó từ chối để DOM lệch đi — không có <code>onChange</code>, gõ không bao giờ cập nhật được <code>name</code>, nên ô bị đóng băng. Hoặc thêm <code>onChange</code> (có kiểm soát) hoặc dùng <code>defaultValue</code> thay cho <code>value</code> (không kiểm soát — Bài 4.4). Một bẫy liên quan: đừng bao giờ khởi tạo state cho một input bằng <code>null</code>/<code>undefined</code>, kẻo nó lật qua lại giữa không-kiểm-soát và có-kiểm-soát rồi cảnh báo; hãy bắt đầu bằng một chuỗi rỗng.</p>
</div>
<h3>Một ô nhập có kiểm soát, trong một vòng</h3>
<div class="lz-map">
  <div class="lz-stage">State là sự thật; ô nhập chỉ hiển thị nó</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">value đến từ state</div><div class="lz-nsub"><code>value={text}</code>. Ô nhập hiện đúng thứ state nói, luôn luôn — không có bản sao thứ hai của sự thật nằm trong DOM.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">onChange ghi ngược lại</div><div class="lz-nsub"><code>onChange={e =&gt; setText(e.target.value)}</code>. Mỗi lần gõ phím là một lần cập nhật state, kéo theo render lại, kéo theo đặt lại value.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Nên bạn biến đổi được trên đường đi</div><div class="lz-nsub">Viết hoa, bỏ dấu cách, chặn độ dài, từ chối ký tự không phải số — vì mọi ký tự đều đi qua mã của bạn. (Nhớ con trỏ: ghi lại một chuỗi <i>khác</i> sẽ đẩy nó về cuối — có số đo bên dưới.)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Và đọc nó ở bất cứ đâu</div><div class="lz-nsub">Kiểm dữ liệu, một khung xem trước trực tiếp, một nút gửi bị khoá. Tất cả đều đọc cùng một biến, nên không gì có thể bất đồng.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>value={user.name}</code> mà không có <code>onChange</code>, cho ra một ô chẳng ai gõ vào được.</strong> React buộc ô nhập vào state, state chẳng bao giờ đổi, nên mọi lần gõ phím đều bị ghi đè ngay bằng giá trị cũ — cái ô trông vẫn dùng được mà đơn giản là từ chối nhận chữ. Console có nói (&quot;You provided a <code>value</code> prop to a form field without an <code>onChange</code> handler&quot;), nhưng đó là một cảnh báo giữa cả đống và rất dễ bỏ sót. Ba cách chữa tuỳ ý định: thêm handler vào, thêm <code>readOnly</code> nếu nó vốn để chỉ-đọc, hoặc dùng <code>defaultValue</code> nếu bạn muốn một ô không kiểm soát có giá trị ban đầu.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/input" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Component input</span><span class="lc-sub">Có kiểm soát với không kiểm soát, kèm mọi prop và cảnh báo mà mỗi cái sinh ra.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/reacting-to-input-with-state" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">react.dev — Phản ứng với đầu vào bằng state</span><span class="lc-sub">Cách mô hình hoá một form thành các trạng thái thay vì một đống boolean.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Làm một input chữ có kiểm soát: <code>value={text}</code> và <code>onChange={e =&gt; setText(e.target.value)}</code>.</li>
<li>Đặt <code>value</code> mà không có <code>onChange</code> và đọc cảnh báo của React về input chỉ-đọc.</li>
<li>Biến đổi input khi người dùng gõ (viết hoa, bỏ dấu cách) để chứng minh state là nguồn sự thật duy nhất.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dựng được input có kiểm soát và giải thích vì sao value đi cùng onChange.</p></div>

<h3>🔬 Đo thật: input có kiểm soát trên React 19.3.0 · Next.js 16.4.6</h3>
<p>Trước hết là HTML máy chủ — có kiểm soát, không kiểm soát và chỉ đọc, đặt cạnh nhau:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
console.log(renderToStaticMarkup(h('input', { value: 'hello', onChange: () =&gt; {} })));
console.log(renderToStaticMarkup(h('input', { defaultValue: 'hello' })));
console.log(renderToStaticMarkup(h('input', { value: 'hello', readOnly: true })));</code></pre><pre><code class="language-bash">$ node input-html.cjs</code></pre><div class="out">&lt;input value="hello"/&gt;
&lt;input value="hello"/&gt;
&lt;input readOnly="" value="hello"/&gt;</div>
<p>Dòng 1 và 2 giống hệt: HTML không phân biệt được ô có kiểm soát với ô <code>defaultValue</code>. Cái làm nên "có kiểm soát" là React đặt lại <code>value</code> sau mỗi lần render.</p>
<p>Rồi một trang chứa mọi trường hợp, gõ trên trình duyệt thật:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

function NameField() {
  const [name, setName] = useState('');
  const tooShort = name.length &lt; 3;                    <span class="tok-comment">  // suy ra, không lưu</span>
  return (
    &lt;div id="a" className="rounded border p-2"&gt;
      &lt;input id="ten" className="rounded border px-2" value={name} onChange={(e) =&gt; setName(e.target.value)} /&gt;
      &lt;button id="gui" className="ml-2 rounded border px-2 disabled:opacity-40" disabled={name.trim() === ''}&gt;gửi&lt;/button&gt;
      &lt;button id="xoa" className="ml-2 rounded border px-2" onClick={() =&gt; setName('')}&gt;xoá&lt;/button&gt;
      &lt;p id="xem"&gt;xem trước: “{name}” · {tooShort ? 'quá ngắn (&lt; 3)' : 'ổn'}&lt;/p&gt;
    &lt;/div&gt;
  );
}

function ChiDoc() {
  const [text] = useState('Bình');
  return &lt;input id="chet" className="rounded border px-2" value={text} /&gt;; <span class="tok-comment">  // ✗ value mà không onChange</span>
}

function VietHoa() {
  const [s, setS] = useState('');
  return &lt;input id="hoa" className="rounded border px-2" value={s} onChange={(e) =&gt; setS(e.target.value.toUpperCase())} /&gt;;
}

function SoDienThoai() {
  const [so, setSo] = useState('');
  const dep = so.replace(/^(\\d{4})(\\d{0,3})(\\d{0,3}).*/, (_, a, b, c) =&gt; [a, b, c].filter(Boolean).join(' '));
  return &lt;input id="sdt" className="rounded border px-2" value={dep} onChange={(e) =&gt; setSo(e.target.value.replace(/\\D/g, '').slice(0, 10))} /&gt;;
}

function BatDauNull() {
  const [v, setV] = useState&lt;string | null&gt;(null);       <span class="tok-comment">  // ✗ khởi tạo null</span>
  return &lt;input id="null" className="rounded border px-2" value={v as string} onChange={(e) =&gt; setV(e.target.value)} /&gt;;
}

export default function KiemSoat() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;NameField /&gt;
      &lt;p&gt;chỉ value: &lt;ChiDoc /&gt;&lt;/p&gt;
      &lt;p&gt;viết hoa: &lt;VietHoa /&gt;&lt;/p&gt;
      &lt;p&gt;số điện thoại: &lt;SoDienThoai /&gt;&lt;/p&gt;
      &lt;p&gt;bắt đầu null: &lt;BatDauNull /&gt;&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">gõ "An"              → xem trước: “An” · quá ngắn (&lt; 3) · gửi disabled=false
gõ "h"               → xem trước: “Anh” · ổn
bấm xoá              → input="" · gửi disabled=true
chỉ value: gõ "XY"   → "Bình"
viết hoa: a, b, ←, x → "AXB" · selectionStart = 3
số ĐT: 0901a234567   → "0901 234 567"</div><div class="out">console.error (next dev):
  1. You provided a &#96;value&#96; prop to a form field without an &#96;onChange&#96; handler. This will render a read-only field. If the field should be mutable use &#96;defaultValue&#96;. Otherwise, set either &#96;onChange&#96; or &#96;readOnly&#96;.
  2. &#96;value&#96; prop on &#96;input&#96; should not be null. Consider using an empty string to clear the component or &#96;undefined&#96; for uncontrolled components.
  3. A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components</div><div class="out">next start: ô chỉ value vẫn "Bình" · viết hoa "AXB" con trỏ 3 · console: 0 dòng</div>
<p>Ba điều chỉ đọc bài không thấy: con trỏ <b>nhảy về cuối</b> khi <code>onChange</code> ghi lại một chuỗi khác (vị trí 3, không phải 2 — cả production); cảnh báo chỉ-đọc <b>chỉ có ở dev</b> — production lặng lẽ từ chối nhận chữ; và bắt đầu từ <code>null</code> sinh <b>hai</b> cảnh báo, một ở lần render đầu, một khi gõ làm nó chuyển sang có kiểm soát. TypeScript im lặng vì phép ép <code>as string</code>.</p>
<p>Sửa con trỏ: nếu viết hoa chỉ để trông, dùng CSS <code>text-transform: uppercase</code>; nếu dữ liệu phải viết hoa, biến đổi ở <code>onBlur</code> hoặc khi gửi; nếu bắt buộc biến đổi ngay, lưu <code>selectionStart</code> trước <code>setState</code> rồi trả lại bằng ref (Chương 6).</p>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|kiem-soat'</code></pre><div class="out">✓ Compiled successfully in 781ms
├ ○ /kiem-soat</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">node input-html.cjs
npx next dev                  <span class="tok-comment">  # mở /kiem-soat kèm DevTools → Console; gõ vào từng ô</span>
npm run build &amp;&amp; npm start    <span class="tok-comment">  # cùng trang: ô vẫn đóng băng, console trống</span>
<span class="tok-comment"># con trỏ: trong DevTools chạy  $0.selectionStart  sau khi gõ vào giữa</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — Ô có kiểm soát và không kiểm soát</span><span class="lc-sub">Để DOM giữ hay để state giữ; đo số lần commit mỗi phím, hai cảnh báo thật, nhiều ô một handler</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-4-ex8-form-controls" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 8 — Form controls</span><span class="lc-sub">Bài trên trường: ý niệm nối value ↔ state xuất hiện lần đầu</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Input có kiểm soát</span><span class="v">Giá trị của nó đến từ state; React nắm cái được hiển thị.</span></div>
  <div class="kv"><span class="k">value + onChange</span><span class="v">Cặp đôi làm cho một input trở nên có kiểm soát.</span></div>
  <div class="kv"><span class="k">Một nguồn sự thật</span><span class="v">State là nơi duy nhất giá trị input tồn tại.</span></div>
  <div class="kv"><span class="k">Cảnh báo chỉ-đọc</span><span class="v">Đặt <code>value</code> mà không <code>onChange</code> làm input bị đứng.</span></div>
  <div class="kv"><span class="k">Input dẫn xuất</span><span class="v">Bạn có thể biến đổi giá trị gõ vào trước khi lưu.</span></div>
  <div class="kv"><span class="k">Cảm giác hai chiều</span><span class="v">State điều khiển UI; UI cập nhật state — nhưng bản chất vẫn một chiều.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Input có kiểm soát gắn <code>value</code> vào state và cập nhật state trong <code>onChange</code>.</li><li>State là nguồn sự thật duy nhất — input hiện đúng cái state nói.</li><li>Đặt <code>value</code> mà không <code>onChange</code> khiến nó chỉ-đọc (và React cảnh báo).</li><li>Vì bạn sở hữu giá trị, bạn validate hoặc biến đổi được nó ngay khi người dùng gõ.</li></ul>

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
${G04_3}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>One state object, one change handler, one submit</h2>
<p class="lead">A real form has many fields. Rather than a <code>useState</code> per field, most forms keep one object in state and one handler that updates the right key by the input's <code>name</code>. This is the pattern you'll type hundreds of times.</p>

<h3>The many-fields pattern</h3>
<pre><code class="language-typescript">function SignupForm() {
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
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Handle onSubmit on the form</b> — Not onClick on the button. Enter inside a form does "click" its default submit button (measured in Lesson 4.1), but that breaks the moment the button becomes <code>type="button"</code> or leaves the form — <code>onSubmit</code> catches every path, and screen readers announce it as a form.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Call e.preventDefault() first</b> — Otherwise the browser does a full page navigation and your handler&#39;s work is thrown away mid-flight.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Disable the button while it is in flight</b> — A second submit creates a second order. This is the cheapest fix for the most expensive bug in this lesson.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Then show the outcome</b> — Success, or the server&#39;s error message. A form that appears to do nothing is indistinguishable from a broken one.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a submit handler that is <code>async</code> and calls <code>preventDefault</code> after an <code>await</code>.</strong> <code>async function onSubmit(e) { await check(); e.preventDefault(); }</code> is too late: React&#39;s event object is dispatched synchronously, and by the time the promise resolves the browser has already decided to navigate. The page reloads mid-request, the network tab shows a cancelled call, and the bug only appears when <code>check()</code> actually takes time — so it passes locally and fails on a slow connection. Call <code>preventDefault()</code> on the first line of the handler, before any <code>await</code>, every time.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/form" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">react.dev — The form component</span><span class="lc-sub">onSubmit, the action prop, and how forms work in modern React.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault" target="_blank" rel="noopener">
  <span class="lc-ico">🛑</span>
  <span class="lc-body"><span class="lc-title">MDN — Event.preventDefault</span><span class="lc-sub">Why it must run synchronously, and what happens when it does not.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build a form with name, email and a message using one state object and a single generic <code>onChange</code> keyed by <code>name</code>.</li>
<li>Handle submit with <code>onSubmit</code> + <code>event.preventDefault()</code> and log the whole form object.</li>
<li>Add a simple required-field check and show an error message next to the empty field.</li>
</ol>
<p><strong>Done when:</strong> you can manage many fields with one state object and submit without a page reload.</p></div>

<h3>🔬 Measured: one form, every trap (React 19.3.0 · Next.js 16.4.6)</h3>
<p>First the server HTML of controlled <code>select</code>, <code>textarea</code> and checkbox:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
const noop = () =&gt; {};
console.log(renderToStaticMarkup(h('select', { value: 'vi', onChange: noop }, h('option', { value: 'en' }, 'English'), h('option', { value: 'vi' }, 'Tiếng Việt'))));
console.log(renderToStaticMarkup(h('textarea', { value: 'note', onChange: noop })));
console.log(renderToStaticMarkup(h('input', { type: 'checkbox', checked: true, onChange: noop })));</code></pre><pre><code class="language-bash">$ node select-html.cjs</code></pre><div class="out">&lt;select&gt;&lt;option value="en"&gt;English&lt;/option&gt;&lt;option value="vi" selected=""&gt;Tiếng Việt&lt;/option&gt;&lt;/select&gt;
&lt;textarea&gt;note&lt;/textarea&gt;
&lt;input type="checkbox" checked=""/&gt;</div>
<p>Then one page — the sign-up form plus each trap as its own component — clicked through in a real browser under <code>next start</code>:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

type Truong = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const cho = (ms: number) =&gt; new Promise((r) =&gt; setTimeout(r, ms));

function SignupForm() {
  const [form, setForm] = useState({ email: '', password: '', lang: 'vi', note: '', agree: false });
  const [loi, setLoi] = useState('');
  const [gui, setGui] = useState('');

  function handleChange(e: React.ChangeEvent&lt;Truong&gt;) {
    const { name, value } = e.target;
    setForm((prev) =&gt; ({ ...prev, [name]: value }));      <span class="tok-comment">  // một khoá theo name</span>
  }
  function handleCheck(e: React.ChangeEvent&lt;HTMLInputElement&gt;) {
    const { name, checked } = e.target;
    setForm((prev) =&gt; ({ ...prev, [name]: checked }));    <span class="tok-comment">  // checkbox: checked, không phải value</span>
  }
  function handleSubmit(e: React.FormEvent&lt;HTMLFormElement&gt;) {
    e.preventDefault();
    if (form.password.length &lt; 8) { setLoi('Mật khẩu tối thiểu 8 ký tự'); return; }
    setLoi('');
    setGui(JSON.stringify(form));
  }

  return (
    &lt;form id="f" onSubmit={handleSubmit} className="space-y-1 rounded border p-2"&gt;
      &lt;input id="email" name="email" placeholder="email" value={form.email} onChange={handleChange} className="rounded border px-2" /&gt;
      &lt;input id="pw" name="password" type="password" placeholder="mật khẩu" value={form.password} onChange={handleChange} className="ml-2 rounded border px-2" /&gt;
      &lt;span id="loi" className="ml-2 text-red-600"&gt;{loi}&lt;/span&gt;
      &lt;div&gt;
        &lt;select id="lang" name="lang" value={form.lang} onChange={handleChange} className="rounded border"&gt;
          &lt;option value="en"&gt;English&lt;/option&gt;
          &lt;option value="vi"&gt;Tiếng Việt&lt;/option&gt;
        &lt;/select&gt;
        &lt;textarea id="note" name="note" rows={1} value={form.note} onChange={handleChange} className="ml-2 rounded border px-2 align-middle" /&gt;
        &lt;label className="ml-2"&gt;&lt;input id="agree" name="agree" type="checkbox" checked={form.agree} onChange={handleCheck} /&gt; đồng ý&lt;/label&gt;
        &lt;button id="dk" disabled={!form.email} className="ml-2 rounded border px-2 disabled:opacity-40"&gt;Đăng ký&lt;/button&gt;
      &lt;/div&gt;
      &lt;p id="kq" className="text-sm"&gt;{gui}&lt;/p&gt;
    &lt;/form&gt;
  );
}

function CheckSai() {
  const [v, setV] = useState&lt;Record&lt;string, string | boolean&gt;&gt;({ agree: false });
  return (
    &lt;label className="block"&gt;
      &lt;input id="cb-sai" name="agree" type="checkbox"
        onChange={(e) =&gt; setV((p) =&gt; ({ ...p, [e.target.name]: e.target.value }))} /&gt;   {/* ✗ đọc value */}
      {' '}checkbox đọc e.target.value ⇒ &lt;span id="cb-sai-kq"&gt;{JSON.stringify(v)}&lt;/span&gt;
    &lt;/label&gt;
  );
}

function DienMau() {
  const [f, setF] = useState({ ten: '', email: '' });
  return (
    &lt;div&gt;
      &lt;button id="mau1" type="button" className="rounded border px-2" onClick={() =&gt; { setF({ ...f, ten: 'An' }); setF({ ...f, email: 'an@vd.vn' }); }}&gt;điền mẫu (…f)&lt;/button&gt;
      &lt;button id="mau2" type="button" className="ml-2 rounded border px-2" onClick={() =&gt; { setF((p) =&gt; ({ ...p, ten: 'An' })); setF((p) =&gt; ({ ...p, email: 'an@vd.vn' })); }}&gt;điền mẫu (prev =&amp;gt;)&lt;/button&gt;
      &lt;button id="mau0" type="button" className="ml-2 rounded border px-2" onClick={() =&gt; setF({ ten: '', email: '' })}&gt;xoá&lt;/button&gt;
      &lt;span id="mau-kq" className="ml-2"&gt;{JSON.stringify(f)}&lt;/span&gt;
    &lt;/div&gt;
  );
}

function GuiMuon() {
  const [n, setN] = useState(0);
  async function onSubmit(e: React.FormEvent&lt;HTMLFormElement&gt;) {
    await cho(300);
    e.preventDefault();                                   <span class="tok-comment">  // ✗ sau await: quá muộn</span>
    setN((x) =&gt; x + 1);
  }
  return &lt;form id="fm" onSubmit={onSubmit}&gt;async + preventDefault sau await: &lt;input id="qm" name="q" className="rounded border px-2" /&gt; &lt;span id="nm"&gt;đã xử lý {n}&lt;/span&gt;&lt;/form&gt;;
}

let soDon = 0;
function GuiHaiLan() {
  const [dang, setDang] = useState(false);
  const [log, setLog] = useState&lt;string[]&gt;([]);
  async function datHang(khoa: boolean) {
    if (khoa) setDang(true);
    const so = ++soDon;
    await cho(500);                                       <span class="tok-comment">  // giả lập gọi API</span>
    setLog((l) =&gt; [...l, &#96;đơn #\${so}\${khoa ? ' (khoá)' : ''}&#96;]);
    if (khoa) setDang(false);
  }
  return (
    &lt;div&gt;
      &lt;button id="h1" className="rounded border px-2" onClick={() =&gt; datHang(false)}&gt;đặt hàng (không khoá)&lt;/button&gt;
      &lt;button id="h2" className="ml-2 rounded border px-2 disabled:opacity-40" disabled={dang} onClick={() =&gt; datHang(true)}&gt;{dang ? 'đang gửi…' : 'đặt hàng (khoá)'}&lt;/button&gt;
      &lt;span id="hkq" className="ml-2"&gt;{log.join(', ')}&lt;/span&gt;
    &lt;/div&gt;
  );
}

export default function DangKy() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;SignupForm /&gt;
      &lt;CheckSai /&gt;
      &lt;DienMau /&gt;
      &lt;GuiMuon /&gt;
      &lt;GuiHaiLan /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">Đăng ký disabled before typing      : true
password "1234" → submit           : Mật khẩu tối thiểu 8 ký tự
password "12345678" → submit       : {"email":"an@vd.vn","password":"12345678","lang":"vi","note":"hi","agree":true}
checkbox reading value, click ×2   : {"agree":"on"} · {"agree":"on"}
fill sample with { ...f } ×2       : {"ten":"","email":"an@vd.vn"}
fill sample with prev =&gt;           : {"ten":"An","email":"an@vd.vn"}
two clicks 80 ms apart, each button: đơn #1, đơn #2, đơn #3 (khoá)
async, preventDefault after await  : localhost:3000/dang-ky?q=x · đã xử lý 0 · navigation navigate</div>
<p>Read the middle lines twice. The checkbox wired to a value-reading handler says <code>"on"</code> whether ticked or not. Two spreads of the same snapshot <code>f</code> lost the name. The await version reloaded the page (the URL gained <code>?q=x</code>, the counter never moved). And without the lock, a double click produced two orders.</p>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|dang-ky'</code></pre><div class="out">✓ Compiled successfully in 909ms
├ ○ /dang-ky</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">node select-html.cjs
npm run build &amp;&amp; npm start    <span class="tok-comment">  # open /dang-ky — fill the form, then try each trap</span>
<span class="tok-comment"># DevTools → Network: the await version shows the page request again (a full reload)</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — Controlled vs uncontrolled</span><span class="lc-sub">Many fields one handler, checkbox/select/number, both real warnings</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-2-react-hook-form" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.2 — react-hook-form + Zod</span><span class="lc-sub">The same form three ways; register, handleSubmit, a Zod schema</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-4-ex8-form-controls" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 8 — Form controls</span><span class="lc-sub">The university exercise: a form with Bootstrap controls</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Form state</span><span class="v">One object holding every field's value.</span></div>
  <div class="kv"><span class="k">Generic onChange</span><span class="v">A single handler keyed by <code>e.target.name</code>.</span></div>
  <div class="kv"><span class="k">onSubmit</span><span class="v">The form-level event; call <code>preventDefault()</code> to stop navigation.</span></div>
  <div class="kv"><span class="k">preventDefault</span><span class="v">Stops the browser's default form POST + page reload.</span></div>
  <div class="kv"><span class="k">Validation</span><span class="v">Checking values before accepting the submit.</span></div>
  <div class="kv"><span class="k">Error message</span><span class="v">UI shown when a field fails validation.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Hold many fields in one state object and update it with a single <code>name</code>-keyed <code>onChange</code>.</li><li>Submit via <code>onSubmit</code> and call <code>preventDefault()</code> to avoid a full page reload.</li><li>Validate before accepting and show errors next to the offending field.</li><li>This hand-rolled approach is the foundation Chapter 16 replaces with react-hook-form + Zod.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Một object state, một handler đổi, một lần gửi</h2>
<p class="lead">Một form thật có nhiều trường. Thay vì một <code>useState</code> cho mỗi trường, phần lớn form giữ một object trong state và một handler cập nhật đúng khoá theo <code>name</code> của input. Đây là khuôn mẫu bạn sẽ gõ hàng trăm lần.</p>

<h3>Khuôn mẫu nhiều trường</h3>
<pre><code class="language-typescript">function SignupForm() {
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
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Xử onSubmit trên thẻ form</b> — Đừng xử onClick trên cái nút. Enter trong form có "bấm" nút submit mặc định (đã đo ở Bài 4.1), nhưng hỏng ngay khi nút thành <code>type="button"</code> hoặc ra khỏi form — <code>onSubmit</code> bắt mọi đường gửi, và trình đọc màn hình xướng nó lên là một form.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Gọi e.preventDefault() trước đã</b> — Không thì trình duyệt chuyển trang toàn phần và phần việc của handler bị vứt bỏ giữa chừng.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Khoá cái nút trong lúc đang gửi</b> — Một lần gửi thứ hai tạo ra một đơn hàng thứ hai. Đây là cách chữa rẻ nhất cho cái lỗi đắt nhất trong bài này.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Rồi hiện kết cục ra</b> — Thành công, hoặc thông điệp lỗi của máy chủ. Một form có vẻ chẳng làm gì thì không phân biệt được với một form hỏng.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một handler submit là <code>async</code> và gọi <code>preventDefault</code> SAU một <code>await</code>.</strong> <code>async function onSubmit(e) { await check(); e.preventDefault(); }</code> là quá muộn: object sự kiện của React được điều phối đồng bộ, và tới lúc promise xong thì trình duyệt đã quyết định chuyển trang rồi. Trang tải lại giữa chừng request, tab Network hiện một lời gọi bị huỷ, và cái lỗi chỉ lộ ra khi <code>check()</code> thật sự tốn thời gian — nên nó qua được ở máy bạn và hỏng trên đường truyền chậm. Hãy gọi <code>preventDefault()</code> ở dòng đầu tiên của handler, trước mọi <code>await</code>, lần nào cũng vậy.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/form" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">react.dev — Component form</span><span class="lc-sub">onSubmit, prop action, và form hoạt động ra sao trong React hiện đại.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault" target="_blank" rel="noopener">
  <span class="lc-ico">🛑</span>
  <span class="lc-body"><span class="lc-title">MDN — Event.preventDefault</span><span class="lc-sub">Vì sao nó phải chạy đồng bộ, và chuyện gì xảy ra khi không.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng form gồm tên, email và lời nhắn dùng MỘT object state và một <code>onChange</code> chung lấy khoá theo <code>name</code>.</li>
<li>Xử lý submit bằng <code>onSubmit</code> + <code>event.preventDefault()</code> và log cả object form.</li>
<li>Thêm một kiểm tra trường bắt buộc đơn giản và hiện thông báo lỗi cạnh trường bỏ trống.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn quản được nhiều trường bằng một object state và submit mà không tải lại trang.</p></div>

<h3>🔬 Đo thật: một form, đủ mọi bẫy (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Trước hết là HTML máy chủ của <code>select</code>, <code>textarea</code> và checkbox có kiểm soát:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
const noop = () =&gt; {};
console.log(renderToStaticMarkup(h('select', { value: 'vi', onChange: noop }, h('option', { value: 'en' }, 'English'), h('option', { value: 'vi' }, 'Tiếng Việt'))));
console.log(renderToStaticMarkup(h('textarea', { value: 'note', onChange: noop })));
console.log(renderToStaticMarkup(h('input', { type: 'checkbox', checked: true, onChange: noop })));</code></pre><pre><code class="language-bash">$ node select-html.cjs</code></pre><div class="out">&lt;select&gt;&lt;option value="en"&gt;English&lt;/option&gt;&lt;option value="vi" selected=""&gt;Tiếng Việt&lt;/option&gt;&lt;/select&gt;
&lt;textarea&gt;note&lt;/textarea&gt;
&lt;input type="checkbox" checked=""/&gt;</div>
<p>Rồi một trang — form đăng ký và mỗi cái bẫy là một component riêng — bấm qua trên trình duyệt thật dưới <code>next start</code>:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

type Truong = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const cho = (ms: number) =&gt; new Promise((r) =&gt; setTimeout(r, ms));

function SignupForm() {
  const [form, setForm] = useState({ email: '', password: '', lang: 'vi', note: '', agree: false });
  const [loi, setLoi] = useState('');
  const [gui, setGui] = useState('');

  function handleChange(e: React.ChangeEvent&lt;Truong&gt;) {
    const { name, value } = e.target;
    setForm((prev) =&gt; ({ ...prev, [name]: value }));      <span class="tok-comment">  // một khoá theo name</span>
  }
  function handleCheck(e: React.ChangeEvent&lt;HTMLInputElement&gt;) {
    const { name, checked } = e.target;
    setForm((prev) =&gt; ({ ...prev, [name]: checked }));    <span class="tok-comment">  // checkbox: checked, không phải value</span>
  }
  function handleSubmit(e: React.FormEvent&lt;HTMLFormElement&gt;) {
    e.preventDefault();
    if (form.password.length &lt; 8) { setLoi('Mật khẩu tối thiểu 8 ký tự'); return; }
    setLoi('');
    setGui(JSON.stringify(form));
  }

  return (
    &lt;form id="f" onSubmit={handleSubmit} className="space-y-1 rounded border p-2"&gt;
      &lt;input id="email" name="email" placeholder="email" value={form.email} onChange={handleChange} className="rounded border px-2" /&gt;
      &lt;input id="pw" name="password" type="password" placeholder="mật khẩu" value={form.password} onChange={handleChange} className="ml-2 rounded border px-2" /&gt;
      &lt;span id="loi" className="ml-2 text-red-600"&gt;{loi}&lt;/span&gt;
      &lt;div&gt;
        &lt;select id="lang" name="lang" value={form.lang} onChange={handleChange} className="rounded border"&gt;
          &lt;option value="en"&gt;English&lt;/option&gt;
          &lt;option value="vi"&gt;Tiếng Việt&lt;/option&gt;
        &lt;/select&gt;
        &lt;textarea id="note" name="note" rows={1} value={form.note} onChange={handleChange} className="ml-2 rounded border px-2 align-middle" /&gt;
        &lt;label className="ml-2"&gt;&lt;input id="agree" name="agree" type="checkbox" checked={form.agree} onChange={handleCheck} /&gt; đồng ý&lt;/label&gt;
        &lt;button id="dk" disabled={!form.email} className="ml-2 rounded border px-2 disabled:opacity-40"&gt;Đăng ký&lt;/button&gt;
      &lt;/div&gt;
      &lt;p id="kq" className="text-sm"&gt;{gui}&lt;/p&gt;
    &lt;/form&gt;
  );
}

function CheckSai() {
  const [v, setV] = useState&lt;Record&lt;string, string | boolean&gt;&gt;({ agree: false });
  return (
    &lt;label className="block"&gt;
      &lt;input id="cb-sai" name="agree" type="checkbox"
        onChange={(e) =&gt; setV((p) =&gt; ({ ...p, [e.target.name]: e.target.value }))} /&gt;   {/* ✗ đọc value */}
      {' '}checkbox đọc e.target.value ⇒ &lt;span id="cb-sai-kq"&gt;{JSON.stringify(v)}&lt;/span&gt;
    &lt;/label&gt;
  );
}

function DienMau() {
  const [f, setF] = useState({ ten: '', email: '' });
  return (
    &lt;div&gt;
      &lt;button id="mau1" type="button" className="rounded border px-2" onClick={() =&gt; { setF({ ...f, ten: 'An' }); setF({ ...f, email: 'an@vd.vn' }); }}&gt;điền mẫu (…f)&lt;/button&gt;
      &lt;button id="mau2" type="button" className="ml-2 rounded border px-2" onClick={() =&gt; { setF((p) =&gt; ({ ...p, ten: 'An' })); setF((p) =&gt; ({ ...p, email: 'an@vd.vn' })); }}&gt;điền mẫu (prev =&amp;gt;)&lt;/button&gt;
      &lt;button id="mau0" type="button" className="ml-2 rounded border px-2" onClick={() =&gt; setF({ ten: '', email: '' })}&gt;xoá&lt;/button&gt;
      &lt;span id="mau-kq" className="ml-2"&gt;{JSON.stringify(f)}&lt;/span&gt;
    &lt;/div&gt;
  );
}

function GuiMuon() {
  const [n, setN] = useState(0);
  async function onSubmit(e: React.FormEvent&lt;HTMLFormElement&gt;) {
    await cho(300);
    e.preventDefault();                                   <span class="tok-comment">  // ✗ sau await: quá muộn</span>
    setN((x) =&gt; x + 1);
  }
  return &lt;form id="fm" onSubmit={onSubmit}&gt;async + preventDefault sau await: &lt;input id="qm" name="q" className="rounded border px-2" /&gt; &lt;span id="nm"&gt;đã xử lý {n}&lt;/span&gt;&lt;/form&gt;;
}

let soDon = 0;
function GuiHaiLan() {
  const [dang, setDang] = useState(false);
  const [log, setLog] = useState&lt;string[]&gt;([]);
  async function datHang(khoa: boolean) {
    if (khoa) setDang(true);
    const so = ++soDon;
    await cho(500);                                       <span class="tok-comment">  // giả lập gọi API</span>
    setLog((l) =&gt; [...l, &#96;đơn #\${so}\${khoa ? ' (khoá)' : ''}&#96;]);
    if (khoa) setDang(false);
  }
  return (
    &lt;div&gt;
      &lt;button id="h1" className="rounded border px-2" onClick={() =&gt; datHang(false)}&gt;đặt hàng (không khoá)&lt;/button&gt;
      &lt;button id="h2" className="ml-2 rounded border px-2 disabled:opacity-40" disabled={dang} onClick={() =&gt; datHang(true)}&gt;{dang ? 'đang gửi…' : 'đặt hàng (khoá)'}&lt;/button&gt;
      &lt;span id="hkq" className="ml-2"&gt;{log.join(', ')}&lt;/span&gt;
    &lt;/div&gt;
  );
}

export default function DangKy() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;SignupForm /&gt;
      &lt;CheckSai /&gt;
      &lt;DienMau /&gt;
      &lt;GuiMuon /&gt;
      &lt;GuiHaiLan /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">Đăng ký bị khoá trước khi gõ        : true
mật khẩu "1234" → gửi              : Mật khẩu tối thiểu 8 ký tự
mật khẩu "12345678" → gửi          : {"email":"an@vd.vn","password":"12345678","lang":"vi","note":"hi","agree":true}
checkbox đọc value, bấm ×2         : {"agree":"on"} · {"agree":"on"}
điền mẫu bằng { ...f } ×2          : {"ten":"","email":"an@vd.vn"}
điền mẫu bằng prev =&gt;              : {"ten":"An","email":"an@vd.vn"}
hai cú bấm cách 80 ms, mỗi nút     : đơn #1, đơn #2, đơn #3 (khoá)
async, preventDefault sau await    : localhost:3000/dang-ky?q=x · đã xử lý 0 · navigation navigate</div>
<p>Đọc kỹ các dòng giữa. Checkbox cắm vào handler đọc value luôn ra <code>"on"</code>, tích hay không cũng vậy. Hai lần spread cùng một ảnh chụp <code>f</code> làm mất tên. Bản await tải lại trang (URL thêm <code>?q=x</code>, bộ đếm không nhích). Và không khoá thì bấm đúp ra hai đơn hàng.</p>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|dang-ky'</code></pre><div class="out">✓ Compiled successfully in 909ms
├ ○ /dang-ky</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">node select-html.cjs
npm run build &amp;&amp; npm start    <span class="tok-comment">  # mở /dang-ky — điền form, rồi thử từng cái bẫy</span>
<span class="tok-comment"># DevTools → Network: bản await hiện lại request của cả trang (tải lại toàn phần)</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — Có kiểm soát vs không kiểm soát</span><span class="lc-sub">Nhiều ô một handler, checkbox/select/number, hai cảnh báo thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-2-react-hook-form" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.2 — react-hook-form + Zod</span><span class="lc-sub">Cùng một form viết ba cách; register, handleSubmit, schema Zod</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-4-ex8-form-controls" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 8 — Form controls</span><span class="lc-sub">Bài trên trường: form với các control Bootstrap</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">State của form</span><span class="v">Một object giữ giá trị của mọi trường.</span></div>
  <div class="kv"><span class="k">onChange chung</span><span class="v">Một handler duy nhất lấy khoá theo <code>e.target.name</code>.</span></div>
  <div class="kv"><span class="k">onSubmit</span><span class="v">Sự kiện cấp form; gọi <code>preventDefault()</code> để chặn điều hướng.</span></div>
  <div class="kv"><span class="k">preventDefault</span><span class="v">Chặn POST form mặc định + tải lại trang của trình duyệt.</span></div>
  <div class="kv"><span class="k">Validation</span><span class="v">Kiểm tra giá trị trước khi chấp nhận submit.</span></div>
  <div class="kv"><span class="k">Thông báo lỗi</span><span class="v">UI hiện khi một trường không đạt validation.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Giữ nhiều trường trong một object state và cập nhật bằng một <code>onChange</code> lấy khoá theo <code>name</code>.</li><li>Submit qua <code>onSubmit</code> và gọi <code>preventDefault()</code> để tránh tải lại cả trang.</li><li>Validate trước khi chấp nhận và hiện lỗi cạnh trường sai.</li><li>Cách tự-viết này là nền mà Chương 16 thay bằng react-hook-form + Zod.</li></ul>

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
${G04_4}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>The other kind of input, and the escape hatch to the DOM</h2>
<p class="lead">Controlled inputs are the default and the right choice almost always. But there is a second style — uncontrolled — where the DOM keeps the value and you read it only when you need it. Knowing both, and knowing <code>useRef</code>, rounds out forms.</p>

<h3>Uncontrolled: let the DOM hold the value</h3>
<p>An uncontrolled input has no <code>value</code> prop and no <code>onChange</code>. It manages its own text, exactly like a plain HTML input; you grab the value at submit time with a ref:</p>
<pre><code class="language-typescript">function SearchForm() {
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputRef.current.value);   <span class="tok-comment">// read the DOM node's value once</span>
  }

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input ref={inputRef} defaultValue="" /&gt;   <span class="tok-comment">{/* defaultValue, not value */}</span>
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
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Do not switch mid-life</div><div class="lz-nsub">Going from <code>undefined</code> to a value flips an input from uncontrolled to controlled and React warns loudly. Initialise with <code>&#39;&#39;</code>, never <code>undefined</code>.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — initialising a controlled input from data that has not loaded yet.</strong> <code>value={user?.name}</code> is <code>undefined</code> on the first render, so React treats the input as uncontrolled; when the fetch resolves, the value becomes a string and React switches it to controlled — logging &quot;A component is changing an uncontrolled input to be controlled&quot; and, more practically, discarding anything the user typed in the meantime. Default the value instead (<code>value={user?.name ?? &#39;&#39;}</code>), or do not render the form until the data is there. The warning is precise; it is worth reading rather than filtering out.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Controlling an input with state</span><span class="lc-sub">The controlled pattern, and the exact conditions that trigger the switch warning.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData</span><span class="lc-sub">Reading an uncontrolled form in one line on submit, without refs.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build the same input twice: once controlled (<code>value</code>/<code>onChange</code>) and once uncontrolled (<code>defaultValue</code> + a <code>ref</code> read on submit).</li>
<li>Read the uncontrolled value with <code>inputRef.current.value</code> only when submitting.</li>
<li>Write one sentence on when uncontrolled is the better choice (e.g. a file input, or a form you only read on submit).</li>
</ol>
<p><strong>Done when:</strong> you can build both input styles and choose between them deliberately.</p></div>

<h3>🔬 Measured: controlled, uncontrolled and refs (React 19.3.0 · Next.js 16.4.6)</h3>
<p>One page, each idea as a component (module-level render counters — fine for a measurement under <code>next start</code>, never in real code):</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useRef, useState } from 'react';

const lan = { coKS: 0, khongKS: 0 };

function CoKiemSoat() {
  lan.coKS++;
  const [q, setQ] = useState('');
  return &lt;p&gt;có kiểm soát: &lt;input id="ks" className="rounded border px-2" value={q} onChange={(e) =&gt; setQ(e.target.value)} /&gt; &lt;span id="ks-lan"&gt;render {lan.coKS}&lt;/span&gt;&lt;/p&gt;;
}

function SearchForm() {
  lan.khongKS++;
  const inputRef = useRef&lt;HTMLInputElement&gt;(null);
  const [doc, setDoc] = useState('');
  function handleSubmit(e: React.FormEvent&lt;HTMLFormElement&gt;) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)); <span class="tok-comment">  // cách 2: FormData</span>
    setDoc(&#96;ref: "\${inputRef.current!.value}" · FormData: \${JSON.stringify(fd)}&#96;);
  }
  return (
    &lt;form onSubmit={handleSubmit}&gt;
      không kiểm soát: &lt;input id="kks" name="q" ref={inputRef} defaultValue="" className="rounded border px-2" /&gt;
      &lt;button id="tim" className="ml-2 rounded border px-2"&gt;Tìm&lt;/button&gt; &lt;span id="kks-lan"&gt;render {lan.khongKS}&lt;/span&gt;
      &lt;span id="kks-doc" className="block text-sm"&gt;{doc}&lt;/span&gt;
    &lt;/form&gt;
  );
}

function FocusVaHop() {
  const oRef = useRef&lt;HTMLInputElement&gt;(null);
  const demRef = useRef(0);
  const [, setLai] = useState(0);
  return (
    &lt;p&gt;
      &lt;input id="o-focus" ref={oRef} className="rounded border px-2" /&gt;
      &lt;button id="focus" className="ml-2 rounded border px-2" onClick={() =&gt; oRef.current!.focus()}&gt;focus ô&lt;/button&gt;
      &lt;button id="ref1" className="ml-2 rounded border px-2" onClick={() =&gt; { demRef.current++; }}&gt;ref +1&lt;/button&gt;
      &lt;button id="ve" className="ml-2 rounded border px-2" onClick={() =&gt; setLai((x) =&gt; x + 1)}&gt;render lại&lt;/button&gt;
      &lt;span id="ref-kq" className="ml-2"&gt;ref.current = {demRef.current}&lt;/span&gt;
    &lt;/p&gt;
  );
}

function TepTin() {
  const fRef = useRef&lt;HTMLInputElement&gt;(null);
  const [ten, setTen] = useState('');
  return &lt;p&gt;tệp: &lt;input id="tep" type="file" ref={fRef} onChange={() =&gt; setTen(fRef.current!.files![0]!.name)} /&gt; &lt;span id="tep-kq"&gt;{ten}&lt;/span&gt;&lt;/p&gt;;
}

function DuLieuCham() {
  const [user, setUser] = useState&lt;{ name: string } | null&gt;(null);
  useEffect(() =&gt; { const t = setTimeout(() =&gt; setUser({ name: 'An' }), 1500); return () =&gt; clearTimeout(t); }, []);
  return &lt;p&gt;hồ sơ (tải 1,5 s): &lt;input id="cham" className="rounded border px-2" value={user?.name} onChange={(e) =&gt; setUser({ name: e.target.value })} /&gt;&lt;/p&gt;; <span class="tok-comment">  // ✗ undefined lúc đầu</span>
}

export default function KhongKiemSoat() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;CoKiemSoat /&gt;
      &lt;SearchForm /&gt;
      &lt;FocusVaHop /&gt;
      &lt;TepTin /&gt;
      &lt;DuLieuCham /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">type "abcde" — controlled field   : render 6
type "abcde" — uncontrolled field : render 1
click Tìm                         : ref: "abcde" · FormData: {"q":"abcde"} · render 2
click "focus ô"                   : document.activeElement.id = o-focus
3 × "ref +1", then "render lại"   : ref.current = 0 → ref.current = 3
pick a file                       : tep-thu.txt
type "xyz" while user loads       : "xyz" → 1,5 s → "An"</div>
<p>Six renders against one: every controlled keystroke is a state update. The ref changed to 3 without the screen noticing until something else re-rendered. And the slow-data input accepted typing while it was uncontrolled, then the arriving data overwrote it — production says nothing; <code>next dev</code> logs:</p>
<div class="out">A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components</div>
<p>A file input cannot be controlled at all. Given <code>value="C:\\\\a.txt"</code>, React puts the attribute in the server HTML and the browser ignores it:</p>
<div class="out">server HTML : &lt;input type="file" value="C:\\\\a.txt"&gt;
input.value : ""</div>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|khong-kiem-soat'</code></pre><div class="out">✓ Compiled successfully in 809ms
├ ○ /khong-kiem-soat</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm start    <span class="tok-comment">  # open /khong-kiem-soat — type in both fields, watch the render counters</span>
npx next dev                  <span class="tok-comment">  # reload, type into the profile field within 1.5 s — Console shows the warning</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — DOM-owned or state-owned</span><span class="lc-sub">defaultValue + useRef, FormData; commits per keystroke measured; useRef to focus</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-3-slot9-hooks-slides" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.3 — Hooks (Slot 9–10)</span><span class="lc-sub">The university deck: the built-in hooks</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Controlled</span><span class="v">React state drives the value (<code>value</code>+<code>onChange</code>).</span></div>
  <div class="kv"><span class="k">Uncontrolled</span><span class="v">The DOM holds the value; you read it with a ref when needed.</span></div>
  <div class="kv"><span class="k">defaultValue</span><span class="v">The initial value for an uncontrolled input (not <code>value</code>).</span></div>
  <div class="kv"><span class="k">useRef</span><span class="v">A box holding a reference to the DOM node to read later.</span></div>
  <div class="kv"><span class="k">File input</span><span class="v">Must be uncontrolled — its value cannot be set from state.</span></div>
  <div class="kv"><span class="k">When to use which</span><span class="v">Controlled for live validation; uncontrolled for read-on-submit/simple forms.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Controlled inputs bind value to state; uncontrolled inputs leave the value in the DOM and read it with a ref.</li><li>Use <code>defaultValue</code> (not <code>value</code>) for an uncontrolled input.</li><li>File inputs are always uncontrolled.</li><li>Prefer controlled for live validation; uncontrolled is fine when you only read on submit.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Loại input còn lại, và cửa thoát tới DOM</h2>
<p class="lead">Input có kiểm soát là mặc định và là lựa chọn đúng gần như luôn luôn. Nhưng có một kiểu thứ hai — không kiểm soát — nơi DOM giữ giá trị và bạn chỉ đọc khi cần. Biết cả hai, và biết <code>useRef</code>, làm tròn phần form.</p>

<h3>Không kiểm soát: để DOM giữ giá trị</h3>
<p>Một input không kiểm soát không có prop <code>value</code> và không có <code>onChange</code>. Nó tự quản chữ của mình, y như một input HTML thường; bạn lấy giá trị lúc submit bằng một ref:</p>
<pre><code class="language-typescript">function SearchForm() {
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputRef.current.value);   <span class="tok-comment">// đọc value của nút DOM một lần</span>
  }

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input ref={inputRef} defaultValue="" /&gt;   <span class="tok-comment">{/* defaultValue, không phải value */}</span>
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
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Đừng đổi giữa chừng</div><div class="lz-nsub">Đi từ <code>undefined</code> sang một giá trị là lật một ô nhập từ không-kiểm-soát sang có-kiểm-soát và React cảnh báo to tiếng. Hãy khởi tạo bằng <code>&#39;&#39;</code>, đừng bao giờ bằng <code>undefined</code>.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — khởi tạo một ô nhập có kiểm soát từ dữ liệu chưa tải xong.</strong> <code>value={user?.name}</code> là <code>undefined</code> ở lần render đầu, nên React coi ô nhập là không-kiểm-soát; tới khi phép fetch xong, giá trị thành một chuỗi và React chuyển nó sang có-kiểm-soát — ghi ra &quot;A component is changing an uncontrolled input to be controlled&quot; và, thực tế hơn, vứt bỏ mọi thứ người dùng đã gõ trong khoảng đó. Hãy đặt giá trị dự phòng (<code>value={user?.name ?? &#39;&#39;}</code>), hoặc đừng vẽ form ra cho tới khi có dữ liệu. Cảnh báo ấy nói rất chính xác; nó đáng đọc chứ không đáng lọc bỏ.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Kiểm soát một ô nhập bằng state</span><span class="lc-sub">Mẫu có-kiểm-soát, và đúng những điều kiện làm nổ cảnh báo chuyển đổi.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData</span><span class="lc-sub">Đọc một form không kiểm soát trong một dòng lúc submit, không cần ref.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng cùng một input hai lần: một có kiểm soát (<code>value</code>/<code>onChange</code>) và một không kiểm soát (<code>defaultValue</code> + một <code>ref</code> đọc lúc submit).</li>
<li>Đọc giá trị uncontrolled bằng <code>inputRef.current.value</code> chỉ khi submit.</li>
<li>Viết một câu khi nào uncontrolled là lựa chọn tốt hơn (vd input file, hoặc form chỉ đọc lúc submit).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dựng được cả hai kiểu input và chọn giữa chúng một cách có chủ đích.</p></div>

<h3>🔬 Đo thật: có kiểm soát, không kiểm soát và ref (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Một trang, mỗi ý là một component (bộ đếm render cấp module — được để đo dưới <code>next start</code>, không dùng trong mã thật):</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useRef, useState } from 'react';

const lan = { coKS: 0, khongKS: 0 };

function CoKiemSoat() {
  lan.coKS++;
  const [q, setQ] = useState('');
  return &lt;p&gt;có kiểm soát: &lt;input id="ks" className="rounded border px-2" value={q} onChange={(e) =&gt; setQ(e.target.value)} /&gt; &lt;span id="ks-lan"&gt;render {lan.coKS}&lt;/span&gt;&lt;/p&gt;;
}

function SearchForm() {
  lan.khongKS++;
  const inputRef = useRef&lt;HTMLInputElement&gt;(null);
  const [doc, setDoc] = useState('');
  function handleSubmit(e: React.FormEvent&lt;HTMLFormElement&gt;) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)); <span class="tok-comment">  // cách 2: FormData</span>
    setDoc(&#96;ref: "\${inputRef.current!.value}" · FormData: \${JSON.stringify(fd)}&#96;);
  }
  return (
    &lt;form onSubmit={handleSubmit}&gt;
      không kiểm soát: &lt;input id="kks" name="q" ref={inputRef} defaultValue="" className="rounded border px-2" /&gt;
      &lt;button id="tim" className="ml-2 rounded border px-2"&gt;Tìm&lt;/button&gt; &lt;span id="kks-lan"&gt;render {lan.khongKS}&lt;/span&gt;
      &lt;span id="kks-doc" className="block text-sm"&gt;{doc}&lt;/span&gt;
    &lt;/form&gt;
  );
}

function FocusVaHop() {
  const oRef = useRef&lt;HTMLInputElement&gt;(null);
  const demRef = useRef(0);
  const [, setLai] = useState(0);
  return (
    &lt;p&gt;
      &lt;input id="o-focus" ref={oRef} className="rounded border px-2" /&gt;
      &lt;button id="focus" className="ml-2 rounded border px-2" onClick={() =&gt; oRef.current!.focus()}&gt;focus ô&lt;/button&gt;
      &lt;button id="ref1" className="ml-2 rounded border px-2" onClick={() =&gt; { demRef.current++; }}&gt;ref +1&lt;/button&gt;
      &lt;button id="ve" className="ml-2 rounded border px-2" onClick={() =&gt; setLai((x) =&gt; x + 1)}&gt;render lại&lt;/button&gt;
      &lt;span id="ref-kq" className="ml-2"&gt;ref.current = {demRef.current}&lt;/span&gt;
    &lt;/p&gt;
  );
}

function TepTin() {
  const fRef = useRef&lt;HTMLInputElement&gt;(null);
  const [ten, setTen] = useState('');
  return &lt;p&gt;tệp: &lt;input id="tep" type="file" ref={fRef} onChange={() =&gt; setTen(fRef.current!.files![0]!.name)} /&gt; &lt;span id="tep-kq"&gt;{ten}&lt;/span&gt;&lt;/p&gt;;
}

function DuLieuCham() {
  const [user, setUser] = useState&lt;{ name: string } | null&gt;(null);
  useEffect(() =&gt; { const t = setTimeout(() =&gt; setUser({ name: 'An' }), 1500); return () =&gt; clearTimeout(t); }, []);
  return &lt;p&gt;hồ sơ (tải 1,5 s): &lt;input id="cham" className="rounded border px-2" value={user?.name} onChange={(e) =&gt; setUser({ name: e.target.value })} /&gt;&lt;/p&gt;; <span class="tok-comment">  // ✗ undefined lúc đầu</span>
}

export default function KhongKiemSoat() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;CoKiemSoat /&gt;
      &lt;SearchForm /&gt;
      &lt;FocusVaHop /&gt;
      &lt;TepTin /&gt;
      &lt;DuLieuCham /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">gõ "abcde" — ô có kiểm soát       : render 6
gõ "abcde" — ô không kiểm soát    : render 1
bấm Tìm                           : ref: "abcde" · FormData: {"q":"abcde"} · render 2
bấm "focus ô"                     : document.activeElement.id = o-focus
3 × "ref +1", rồi "render lại"    : ref.current = 0 → ref.current = 3
chọn một tệp                      : tep-thu.txt
gõ "xyz" khi user đang tải        : "xyz" → 1,5 s → "An"</div>
<p>Sáu lần render so với một: mỗi phím của ô có kiểm soát là một lần cập nhật state. Ref đổi thành 3 mà màn hình không biết cho tới khi có thứ khác render lại. Và ô dữ liệu chậm nhận chữ khi còn không kiểm soát, rồi dữ liệu tới đè mất — production im lặng; <code>next dev</code> ghi:</p>
<div class="out">A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components</div>
<p>Ô chọn tệp hoàn toàn không kiểm soát được. Cho <code>value="C:\\\\a.txt"</code>, React đặt thuộc tính vào HTML máy chủ còn trình duyệt lờ đi:</p>
<div class="out">server HTML : &lt;input type="file" value="C:\\\\a.txt"&gt;
input.value : ""</div>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|khong-kiem-soat'</code></pre><div class="out">✓ Compiled successfully in 809ms
├ ○ /khong-kiem-soat</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm start    <span class="tok-comment">  # mở /khong-kiem-soat — gõ vào hai ô, xem bộ đếm render</span>
npx next dev                  <span class="tok-comment">  # tải lại, gõ vào ô hồ sơ trong 1,5 s — Console hiện cảnh báo</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — Để DOM giữ hay để state giữ</span><span class="lc-sub">defaultValue + useRef, FormData; đo số lần commit mỗi phím; useRef để focus</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-3-slot9-hooks-slides" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.3 — Hooks (Slot 9–10)</span><span class="lc-sub">Bài trên trường: các hook dựng sẵn</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Controlled</span><span class="v">State React điều khiển giá trị (<code>value</code>+<code>onChange</code>).</span></div>
  <div class="kv"><span class="k">Uncontrolled</span><span class="v">DOM giữ giá trị; bạn đọc bằng ref khi cần.</span></div>
  <div class="kv"><span class="k">defaultValue</span><span class="v">Giá trị khởi tạo cho input uncontrolled (không phải <code>value</code>).</span></div>
  <div class="kv"><span class="k">useRef</span><span class="v">Một hộp giữ tham chiếu tới node DOM để đọc về sau.</span></div>
  <div class="kv"><span class="k">Input file</span><span class="v">Bắt buộc uncontrolled — giá trị không đặt được từ state.</span></div>
  <div class="kv"><span class="k">Khi nào dùng cái nào</span><span class="v">Controlled để validate trực tiếp; uncontrolled cho form đọc-lúc-submit/đơn giản.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Input controlled gắn value vào state; input uncontrolled để value trong DOM và đọc bằng ref.</li><li>Dùng <code>defaultValue</code> (không phải <code>value</code>) cho input uncontrolled.</li><li>Input file luôn là uncontrolled.</li><li>Ưu tiên controlled để validate trực tiếp; uncontrolled ổn khi bạn chỉ đọc lúc submit.</li></ul>

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
