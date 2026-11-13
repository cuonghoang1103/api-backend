/**
 * Next.js & React — Chương 1: JSX & mô hình render.
 * Song ngữ EN/VI qua .ml-en / .ml-vi. KHÔNG dùng backtick trần trong content
 * (dùng &#96;), mọi `${` trong code mẫu phải escape thành \${, và mọi < > trong
 * code hiển thị phải là &lt; &gt;.
 *
 * Các output React trong chương đã chạy thật bằng react + react-dom/server
 * (scratchpad/nextjs-verify/c1.mjs): element là object thuần, và các đoạn JSX
 * render ra HTML đúng như in.
 */

import G01_1 from './giang/nxj-01-1.mjs';
import G01_2 from './giang/nxj-01-2.mjs';
import G01_3 from './giang/nxj-01-3.mjs';
import G01_4 from './giang/nxj-01-4.mjs';
import G01_5 from './giang/nxj-01-5.mjs';
export default {
  title: 'Chapter 1 — JSX & the rendering model|||Chương 1 — JSX & mô hình render',
  description: 'React thật sự làm gì: bạn mô tả giao diện, React đưa màn hình tới đó. JSX là JavaScript trá hình, và element chỉ là một object thuần.',
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — What React actually does|||1.1 — React thật sự làm gì',
      slug: 'nextjs-1-1-react-lam-gi',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Cách làm mệnh lệnh (tự sờ vào DOM) so với cách khai báo của React: bạn mô tả kết quả, React lo cách đạt tới.',
      content: `
${G01_1}
<div class="ml-en">
<div class="callout ok"><strong>Already took the React course?</strong> This chapter is a quick React refresher &mdash; the same topic is taught in depth in the <a href="/courses/react">React</a> course (Section 0, the JSX lesson, and Chapter 1). Skim it or skip ahead to <strong>Chapter 8</strong>, where the Next.js-specific material starts. Remember: Next.js is a <em>framework built on React</em> &mdash; every component, prop, state and hook here is still plain React.</div>
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>You describe the UI. React makes the screen match.</h2>
<p class="lead">The single idea that everything in React is built on: you never tell the browser "create this element, put it here, now change that text". You write a function that says <em>what the screen should look like for the current data</em>, and React figures out the smallest set of DOM changes to make that true.</p>

<h3>The old way: commanding the DOM by hand</h3>
<p>Before React, you updated the page imperatively — one instruction at a time. A counter with a button looked like this:</p>
<pre><code class="language-javascript">let count = 0;

const p = document.createElement('p');
const button = document.createElement('button');
button.textContent = 'Add';
p.textContent = &#96;Count: \${count}&#96;;

button.addEventListener('click', () =&gt; {
  count = count + 1;
  p.textContent = &#96;Count: \${count}&#96;;   <span class="tok-comment">// you must remember to update this by hand</span>
});

document.body.append(p, button);</code></pre>
<p>Notice the problem. The truth (<code>count</code>) lives in one place, but the screen (<code>p.textContent</code>) is a <em>copy</em> you have to keep in sync by hand, in every single place that changes it. Miss one spot and the screen silently shows a stale value. A real app has hundreds of these. This is where most UI bugs come from: the data and the screen drifting apart.</p>

<h3>The React way: describe the result</h3>
<p>In React you write what the UI <em>is</em> for a given <code>count</code>, and stop worrying about the transitions:</p>
<pre><code class="language-typescript">function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;Add&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>There is no "update the text" instruction anywhere. You said: <em>the paragraph shows <code>count</code></em>. When <code>count</code> changes, React re-runs this function, gets a new description, compares it with the old one, and changes only the text node that actually differs. You describe; React commits.</p>

<h3>The loop, in four words</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>State</b> — the data that can change (<code>count</code>).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Render</b> — React calls your component function; it returns a description of the UI (a tree of elements).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Reconcile</b> — React compares the new description with the previous one and finds the differences.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Commit</b> — React applies <em>only those differences</em> to the real DOM.</div></div>
</div>
<p>This is why React is called <strong>declarative</strong>: your code declares the destination, not the route. "Declarative" isn't jargon for its own sake — it is the exact reason the counter above has no bug and the vanilla one is one forgotten line away from one.</p>

<div class="callout ok">
<p><strong>Hold onto this:</strong> a component is a function of state. Same state in → same UI description out. Every confusing thing later — why it re-rendered, why the value was stale, why the effect ran twice — dissolves once you truly believe that a component is just a function that describes the screen.</p>
</div>
<h3>Where React sits between your data and the screen</h3>
<div class="lz-map">
  <div class="lz-stage">One render, four steps</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">You describe, you do not command</div><div class="lz-nsub">A component returns what the UI <em>should</em> look like for the current data. You never write &#96;element.appendChild&#96; — that is React&#39;s job, not yours.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">React builds a tree of elements</div><div class="lz-nsub">The returned JSX becomes plain objects: type, props, children. Cheap to create, cheap to throw away — nothing has touched the DOM yet.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">It diffs against the previous tree</div><div class="lz-nsub">Same position, same type → keep the DOM node and update what changed. Different type → tear it down and build a new one.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">It applies the smallest set of DOM edits</div><div class="lz-nsub">One text node updated instead of a whole list rebuilt. This is why you can re-render on every keystroke without the page feeling slow.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — reaching for the DOM directly inside a component.</strong> &#96;document.getElementById(&#39;total&#39;).textContent = sum&#96; works the first time and then fights React forever: on the next render React restores what its own tree says should be there, and your change silently disappears. Worse, the two can disagree for a while, so the screen shows one number and the state holds another. If a value is on screen, it must come from state or props. Reach for the DOM only through a ref, and only for things React does not model — focus, scroll position, measuring a node.</p></div>
<a class="link-card dl" href="https://react.dev/learn" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Learn React</span><span class="lc-sub">The official tutorial, rewritten for hooks and modern React. Start here, not with an old blog post.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/render-and-commit" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">react.dev — Render and commit</span><span class="lc-sub">The two phases in detail: what React computes, and when it touches the DOM.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write a tiny page with plain DOM calls (<code>document.createElement</code>, <code>textContent</code>) that shows a counter and a button; note every line where you manually keep the screen in sync with the number.</li>
<li>Rewrite the same counter as a React component that just describes the UI for the current count; compare how many lines you spend on &quot;syncing&quot;.</li>
<li>In one sentence, state the difference between <em>commanding</em> the DOM and <em>describing</em> the UI.</li>
</ol>
<p><strong>Done when:</strong> you have felt manual DOM syncing, seen React remove it, and can state describe-vs-command in your own words.</p></div>

<h3>🔬 Measured: what React really touches</h3>
<p>The counter above, built with Next.js 16.4.6 / React 19.3.0 and opened in Chromium (Playwright). A <code>MutationObserver</code> recorded every DOM change while the button was clicked three times:</p>
<div class="out">#1  characterData  #text  '0' → '1'
#2  characterData  #text  '1' → '2'
#3  characterData  #text  '2' → '3'</div>
<p>Three clicks, exactly three mutations — each a <code>characterData</code> edit of a single text node. The <code>&lt;p&gt;</code> and the <code>&lt;button&gt;</code> were never rebuilt: React re-ran <code>Counter()</code> three times but committed only the difference.</p>
<p><strong>An element is a plain object</strong> — React called directly from Node:</p>
<pre><code class="language-bash">$ node -e "console.log(React.createElement('p', null, 'Count: 0'))"</code></pre><div class="out">{
  '$$typeof': Symbol(react.transitional.element),
  type: 'p',
  key: null,
  props: { children: 'Count: 0' },
  _owner: null,
  _store: {}
}</div>
<p><strong>The trap, measured.</strong> A button that writes into the DOM by hand, next to one that calls <code>setState</code>:</p>
<pre><code class="language-typescript">'use client';
import { useState } from 'react';

export default function Tong() {
  const [sum, setSum] = useState(100);
  return (
    &lt;div className="p-8 font-sans"&gt;
      &lt;p&gt;Tổng: &lt;b id="total"&gt;{sum}&lt;/b&gt;&lt;/p&gt;
      &lt;button className="mr-2 rounded border px-3" onClick={() =&gt; {
        document.getElementById('total')!.textContent = '999'; <span class="tok-comment">  // ✗ với tay vào DOM</span>
      }}&gt;Sửa tay DOM&lt;/button&gt;
      &lt;button className="rounded border px-3" onClick={() =&gt; setSum(sum + 1)}&gt;+1 (setState)&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Clicking "Sửa tay DOM" showed <strong>999</strong> while the state was still 100; the next <code>setSum</code> made React render <strong>101</strong> and the 999 vanished.</p>
<h3>🔁 Run it yourself</h3>
<p>Open any React page, paste this into the DevTools console, click around, then type <code>m</code>:</p>
<pre><code class="language-javascript">const m = [];
new MutationObserver((ds) =&gt; ds.forEach((x) =&gt; m.push([x.type, x.target.nodeName, x.oldValue, x.target.textContent])))
  .observe(document.body, { subtree: true, childList: true, characterData: true, characterDataOldValue: true, attributes: true });
<span class="tok-comment">// click a few times, then type: m</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-4-5-dom-events" target="_blank" rel="noopener"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Web Foundations · 4.5 — DOM and events</span><span class="lc-sub">The "command the DOM" style React replaced — from the ground up</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-1-jsx-basics" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.1 — JSX basics</span><span class="lc-sub">The university-course view of JSX and elements</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Declarative</span><span class="v">You describe the UI for the current data; React figures out the DOM changes.</span></div>
  <div class="kv"><span class="k">Imperative</span><span class="v">You command the DOM step by step (the old jQuery / raw-DOM way).</span></div>
  <div class="kv"><span class="k">React element</span><span class="v">A plain object describing what to render — not a DOM node yet.</span></div>
  <div class="kv"><span class="k">Virtual tree</span><span class="v">React's in-memory picture of the UI it diffs against the previous one.</span></div>
  <div class="kv"><span class="k">Render</span><span class="v">Calling your components to produce elements for the current state.</span></div>
  <div class="kv"><span class="k">Component</span><span class="v">A function that returns elements describing a piece of UI.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>React's one job: given the data, produce the UI — and update the DOM for you when the data changes.</li><li>You write declarative code (describe) instead of imperative DOM commands (step-by-step).</li><li>Components return React elements — plain objects — which React diffs to make minimal DOM changes.</li><li>This removes the manual sync that made pre-React UIs drift out of step with their data.</li></ul>

</div>

<div class="ml-vi">
<div class="callout ok"><strong>Đã học khoá React?</strong> Chương này là phần ôn nhanh React &mdash; cùng chủ đề được dạy kỹ ở khoá <a href="/courses/react">React</a> (Mục 0 bài JSX, và Chương 1). Đọc lướt hoặc chuyển thẳng sang <strong>Chương 8</strong>, nơi bắt đầu phần riêng của Next.js. Nhớ: Next.js là <em>framework dựng trên React</em> &mdash; mọi component, props, state, hook ở đây vẫn là React thuần.</div>
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Bạn MÔ TẢ giao diện. React làm cho màn hình khớp với mô tả đó.</h2>
<p class="lead">Ý tưởng duy nhất mà mọi thứ trong React dựng lên từ đó: bạn không bao giờ bảo trình duyệt "tạo phần tử này, đặt vào đây, giờ đổi đoạn chữ kia". Bạn viết một hàm nói <em>màn hình nên trông thế nào với dữ liệu hiện tại</em>, và React tự tìm ra tập thay đổi DOM nhỏ nhất để biến điều đó thành thật.</p>

<h3>Cách cũ: tự tay ra lệnh cho DOM</h3>
<p>Trước React, bạn cập nhật trang theo kiểu mệnh lệnh — mỗi lần một chỉ thị. Một counter có nút bấm trông thế này:</p>
<pre><code class="language-javascript">let count = 0;

const p = document.createElement('p');
const button = document.createElement('button');
button.textContent = 'Add';
p.textContent = &#96;Count: \${count}&#96;;

button.addEventListener('click', () =&gt; {
  count = count + 1;
  p.textContent = &#96;Count: \${count}&#96;;   <span class="tok-comment">// bạn phải TỰ NHỚ cập nhật dòng này</span>
});

document.body.append(p, button);</code></pre>
<p>Để ý vấn đề. Sự thật (<code>count</code>) nằm một nơi, nhưng màn hình (<code>p.textContent</code>) là một <em>bản sao</em> bạn phải tự tay giữ đồng bộ, ở mọi chỗ làm nó thay đổi. Quên một chỗ là màn hình âm thầm hiện giá trị cũ. Một app thật có hàng trăm chỗ như vậy. Đây chính là nguồn gốc phần lớn bug giao diện: dữ liệu và màn hình trôi xa nhau.</p>

<h3>Cách React: mô tả kết quả</h3>
<p>Trong React bạn viết giao diện <em>là gì</em> với một <code>count</code> cho trước, và thôi lo về các bước chuyển tiếp:</p>
<pre><code class="language-typescript">function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;Add&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Không hề có chỉ thị "cập nhật đoạn chữ" ở đâu cả. Bạn nói: <em>đoạn văn hiện <code>count</code></em>. Khi <code>count</code> đổi, React chạy lại hàm này, lấy một mô tả mới, so với mô tả cũ, và chỉ đổi đúng nút chữ thật sự khác. Bạn mô tả; React thực thi.</p>

<h3>Vòng lặp, gói trong bốn từ</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>State</b> — dữ liệu có thể đổi (<code>count</code>).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Render</b> — React gọi hàm component của bạn; nó trả về một mô tả giao diện (một cây element).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Reconcile</b> — React so mô tả mới với mô tả trước và tìm ra chỗ khác nhau.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Commit</b> — React chỉ áp <em>đúng những chỗ khác đó</em> vào DOM thật.</div></div>
</div>
<p>Vì thế React được gọi là <strong>khai báo (declarative)</strong>: code của bạn khai báo đích đến, không phải lộ trình. "Khai báo" không phải thuật ngữ cho oai — nó chính là lý do counter phía trên không có bug, còn bản vanilla thì chỉ cách một dòng bị quên là dính bug.</p>

<div class="callout ok">
<p><strong>Giữ chặt điều này:</strong> một component là một hàm của state. Cùng state vào → cùng mô tả giao diện ra. Mọi thứ khó hiểu sau này — vì sao nó render lại, vì sao giá trị bị cũ, vì sao effect chạy hai lần — đều tan biến khi bạn thật sự tin rằng component chỉ là một hàm mô tả màn hình.</p>
</div>
<h3>React đứng ở đâu giữa dữ liệu của bạn và màn hình</h3>
<div class="lz-map">
  <div class="lz-stage">Một lần render, bốn bước</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Bạn mô tả, bạn không ra lệnh</div><div class="lz-nsub">Một component trả về giao diện <em>nên</em> trông thế nào với dữ liệu hiện tại. Bạn chẳng bao giờ viết &#96;element.appendChild&#96; — đó là việc của React, không phải của bạn.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">React dựng một cây các element</div><div class="lz-nsub">Đoạn JSX trả về thành những object thuần: kiểu, props, con. Tạo rẻ, vứt đi cũng rẻ — chưa gì chạm vào DOM cả.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Nó so cây mới với cây cũ</div><div class="lz-nsub">Cùng vị trí, cùng kiểu → giữ nút DOM và chỉ cập nhật phần đã đổi. Khác kiểu → phá đi dựng lại.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Nó áp tập chỉnh sửa DOM nhỏ nhất</div><div class="lz-nsub">Một nút văn bản được cập nhật thay vì dựng lại cả danh sách. Đó là lý do bạn render lại mỗi lần gõ phím mà trang vẫn không ì.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — với tay vào DOM trực tiếp bên trong một component.</strong> &#96;document.getElementById(&#39;total&#39;).textContent = sum&#96; chạy được lần đầu rồi đánh nhau với React mãi mãi: ở lần render sau React khôi phục lại đúng thứ cây của nó nói là phải có ở đó, và thay đổi của bạn biến mất lặng lẽ. Tệ hơn, hai bên có thể bất đồng một lúc, nên màn hình hiện một con số còn state giữ một con số khác. Nếu một giá trị có trên màn hình thì nó phải đến từ state hoặc props. Chỉ với tay vào DOM qua một ref, và chỉ cho những thứ React không mô hình hoá — tiêu điểm, vị trí cuộn, đo kích thước một nút.</p></div>
<a class="link-card dl" href="https://react.dev/learn" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Học React</span><span class="lc-sub">Hướng dẫn chính thức, viết lại cho hook và React hiện đại. Hãy bắt đầu ở đây, đừng bắt đầu bằng một bài blog cũ.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/render-and-commit" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">react.dev — Render và commit</span><span class="lc-sub">Hai giai đoạn, chi tiết: React tính gì, và khi nào nó chạm vào DOM.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết một trang nhỏ bằng lệnh DOM trần (<code>document.createElement</code>, <code>textContent</code>) hiện một counter và một nút; ghi lại mọi dòng bạn phải TỰ giữ màn hình đồng bộ với con số.</li>
<li>Viết lại counter đó thành một component React chỉ mô tả UI cho giá trị hiện tại; so xem bạn tốn bao nhiêu dòng cho việc &quot;đồng bộ&quot;.</li>
<li>Nói một câu khác biệt giữa <em>ra lệnh</em> cho DOM và <em>mô tả</em> UI.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã thấm việc tự đồng bộ DOM, thấy React bỏ nó đi, và nói được mô-tả-so-với-ra-lệnh bằng lời của bạn.</p></div>

<h3>🔬 Đo thật: React thật sự chạm vào gì</h3>
<p>Chính counter ở trên, dựng bằng Next.js 16.4.6 / React 19.3.0 và mở trong Chromium (Playwright). Một <code>MutationObserver</code> ghi lại mọi thay đổi DOM trong lúc bấm nút ba lần:</p>
<div class="out">#1  characterData  #text  '0' → '1'
#2  characterData  #text  '1' → '2'
#3  characterData  #text  '2' → '3'</div>
<p>Ba lần bấm, đúng ba thay đổi — mỗi cái là một lần sửa <code>characterData</code> trên một nút văn bản duy nhất. <code>&lt;p&gt;</code> và <code>&lt;button&gt;</code> không bị dựng lại lần nào: React gọi lại <code>Counter()</code> ba lần nhưng chỉ commit đúng phần khác biệt.</p>
<p><strong>Element là một object thuần</strong> — gọi React thẳng từ Node:</p>
<pre><code class="language-bash">$ node -e "console.log(React.createElement('p', null, 'Count: 0'))"</code></pre><div class="out">{
  '$$typeof': Symbol(react.transitional.element),
  type: 'p',
  key: null,
  props: { children: 'Count: 0' },
  _owner: null,
  _store: {}
}</div>
<p><strong>Cái bẫy, đo thật.</strong> Một nút ghi tay vào DOM, cạnh một nút gọi <code>setState</code>:</p>
<pre><code class="language-typescript">'use client';
import { useState } from 'react';

export default function Tong() {
  const [sum, setSum] = useState(100);
  return (
    &lt;div className="p-8 font-sans"&gt;
      &lt;p&gt;Tổng: &lt;b id="total"&gt;{sum}&lt;/b&gt;&lt;/p&gt;
      &lt;button className="mr-2 rounded border px-3" onClick={() =&gt; {
        document.getElementById('total')!.textContent = '999'; <span class="tok-comment">  // ✗ với tay vào DOM</span>
      }}&gt;Sửa tay DOM&lt;/button&gt;
      &lt;button className="rounded border px-3" onClick={() =&gt; setSum(sum + 1)}&gt;+1 (setState)&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Bấm "Sửa tay DOM" thì màn hình hiện <strong>999</strong> trong khi state vẫn là 100; lần <code>setSum</code> kế tiếp làm React vẽ <strong>101</strong> và số 999 biến mất.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Mở một trang React bất kỳ, dán đoạn này vào console của DevTools, bấm vài lần, rồi gõ <code>m</code>:</p>
<pre><code class="language-javascript">const m = [];
new MutationObserver((ds) =&gt; ds.forEach((x) =&gt; m.push([x.type, x.target.nodeName, x.oldValue, x.target.textContent])))
  .observe(document.body, { subtree: true, childList: true, characterData: true, characterDataOldValue: true, attributes: true });
<span class="tok-comment">// bấm nút vài lần, rồi gõ: m</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-4-5-dom-events" target="_blank" rel="noopener"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Nền tảng Lập trình Web · 4.5 — DOM và sự kiện</span><span class="lc-sub">Kiểu "ra lệnh cho DOM" mà React thay thế — học từ gốc</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-1-jsx-basics" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.1 — JSX cơ bản</span><span class="lc-sub">Góc nhìn môn học ở trường về JSX và element</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Khai báo (declarative)</span><span class="v">Bạn mô tả UI cho dữ liệu hiện tại; React tự tính thay đổi DOM.</span></div>
  <div class="kv"><span class="k">Mệnh lệnh (imperative)</span><span class="v">Bạn ra lệnh cho DOM từng bước (kiểu jQuery / DOM trần cũ).</span></div>
  <div class="kv"><span class="k">React element</span><span class="v">Một object thuần mô tả cái cần render — chưa phải node DOM.</span></div>
  <div class="kv"><span class="k">Cây ảo</span><span class="v">Bức tranh UI trong bộ nhớ của React để so với bản trước đó.</span></div>
  <div class="kv"><span class="k">Render</span><span class="v">Gọi component của bạn để sinh ra element cho state hiện tại.</span></div>
  <div class="kv"><span class="k">Component</span><span class="v">Một hàm trả về element mô tả một mảnh UI.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Nhiệm vụ duy nhất của React: với dữ liệu này, sinh ra UI — và tự cập nhật DOM khi dữ liệu đổi.</li><li>Bạn viết code khai báo (mô tả) thay cho lệnh DOM mệnh lệnh (từng bước).</li><li>Component trả về React element — object thuần — rồi React so sánh để đổi DOM tối thiểu.</li><li>Điều này bỏ đi việc tự đồng bộ vốn làm UI trước-React trôi lệch khỏi dữ liệu.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — JSX is JavaScript in disguise|||1.2 — JSX là JavaScript trá hình',
      slug: 'nextjs-1-2-jsx-la-javascript',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'JSX không phải HTML. Nó biên dịch ra lời gọi hàm, và một element React chỉ là một object thuần { type, props }.',
      content: `
${G01_2}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>The angle brackets are a lie your build tool tells</h2>
<p class="lead">JSX looks like HTML sitting inside JavaScript, which feels illegal. It is not HTML, and it is not magic. Before your code runs, a compiler rewrites every JSX tag into a plain function call. Understanding that rewrite removes ninety percent of "why won't this work" confusion.</p>

<h3>What JSX compiles to</h3>
<p>This JSX:</p>
<pre><code class="language-javascript">const el = &lt;h1 className="title"&gt;Hello&lt;/h1&gt;;</code></pre>
<p>is compiled — by Babel or the TypeScript/Next compiler, before it ever reaches the browser — into this ordinary JavaScript:</p>
<pre><code class="language-javascript">const el = React.createElement('h1', { className: 'title' }, 'Hello');</code></pre>
<p>That is the whole trick. JSX is <em>syntax sugar</em> for <code>createElement</code> calls. A tag name becomes the first argument, the attributes become an object (the second argument), and the children become the rest. There is no HTML being parsed at runtime — by the time your code runs, the brackets are gone.</p>

<h3>An element is just an object</h3>
<p>And what does <code>createElement</code> return? Not a DOM node, not HTML — a plain JavaScript object describing what you want. Run it and look:</p>
<pre><code class="language-javascript">const el = React.createElement('h1', { className: 'title' }, 'Hello');
console.log(JSON.stringify({ type: el.type, props: el.props }));</code></pre>
<div class="out">{"type":"h1","props":{"className":"title","children":"Hello"}}</div>
<p>That is a real, verified log. An element is a lightweight description: <code>type</code> is what to render (a string like <code>'h1'</code> for a DOM tag, or a function for a component), and <code>props</code> is the bag of everything passed to it — including <code>children</code>. Because it is only an object, creating one is cheap; React can build a whole tree of them on every render and throw it away, and that is exactly what it does.</p>

<h3>A component is a function that returns elements</h3>
<p>A component is just a function whose name starts with a capital letter and that returns an element tree:</p>
<pre><code class="language-typescript">function Greeting({ name }) {
  return &lt;p&gt;Hi, {name}!&lt;/p&gt;;
}</code></pre>
<p>Render it to HTML and you get exactly what you'd expect — this output is from actually running it through <code>react-dom/server</code>:</p>
<pre><code>renderToStaticMarkup(&lt;Greeting name="Bình" /&gt;)</code></pre>
<div class="out">&lt;p&gt;Hi, Bình!&lt;/p&gt;</div>
<p>The capital letter is not a style choice — it is how the compiler decides. <code>&lt;Greeting /&gt;</code> compiles to <code>createElement(Greeting, ...)</code> (pass the function itself); <code>&lt;greeting /&gt;</code> compiles to <code>createElement('greeting', ...)</code> (a string — a DOM tag that doesn't exist). Lowercase means "HTML tag", capitalised means "my component". Forget the capital and React silently renders nothing.</p>

<div class="pitfall">
<p><strong>Why you sometimes still see <code>import React from 'react'</code> and sometimes not.</strong> Old JSX compiled to <code>React.createElement(...)</code>, so <code>React</code> had to be in scope — every file imported it. Since React 17 the "automatic runtime" imports the helper for you behind the scenes, so modern Next.js files use JSX without importing <code>React</code> at all. Both are the same mechanism; only the import changed. If a tutorial's first line is <code>import React from 'react'</code> and yours isn't, nothing is wrong.</p>
</div>
<h3>What the compiler does to your JSX</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It is not HTML</b> — &#96;&lt;Card title="Hi" /&gt;&#96; compiles to a function call that returns an object. That is why JSX obeys JavaScript&#39;s rules, not HTML&#39;s.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Attributes become props</b> — And they use JavaScript names: &#96;className&#96;, &#96;htmlFor&#96;, &#96;onClick&#96; — because &#96;class&#96; and &#96;for&#96; are reserved words in the language.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Children become an argument</b> — Whatever sits between the tags is passed along as &#96;props.children&#96;, which is what makes wrapper components possible.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>So a component is just a function</b> — It takes props and returns elements. Everything you know about functions — defaults, destructuring, early returns — applies unchanged.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — writing &#96;class&#96; instead of &#96;className&#96;.</strong> Measured on React 19.3.0: it does <em>not</em> fail loudly — React passes &#96;class="card"&#96; and &#96;for="email"&#96; through to the HTML and only prints a dev warning, <em>Invalid DOM property &#96;class&#96;. Did you mean &#96;className&#96;?</em>, which is easy to scroll past (older advice says the class is dropped; not on this version). In a &#96;.tsx&#96; file TypeScript refuses it outright: <em>TS2322 … Property 'class' does not exist … Did you mean 'className'?</em> (output below). Both are a consequence of JSX being JavaScript: &#96;class&#96; and &#96;for&#96; are keywords. Turn on the React ESLint plugin and it flags these as you type.</p></div>
<a class="link-card dl" href="https://react.dev/learn/writing-markup-with-jsx" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">react.dev — Writing markup with JSX</span><span class="lc-sub">The rules, and the three that catch everyone.</span></span>
</a>
<a class="link-card dl" href="https://babeljs.io/repl" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Babel REPL — see what JSX compiles to</span><span class="lc-sub">Paste a component, watch it become plain function calls. Ten minutes here removes most JSX confusion.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Take a small JSX snippet and paste it into the Babel REPL (or the SWC playground) to see what it compiles to — note the <code>React.createElement</code> / <code>jsx(...)</code> calls.</li>
<li>Rewrite one JSX element by hand as the equivalent function call, then back to JSX; confirm they are the same thing.</li>
<li>Explain why JSX can appear anywhere a JavaScript expression can (a variable, an argument, a return value).</li>
</ol>
<p><strong>Done when:</strong> you have seen JSX compile to function calls and can convert a small element both ways.</p></div>

<h3>🔬 Measured: run the compiler yourself</h3>
<p>One line of JSX through the TypeScript compiler (the same rewrite Next.js does with SWC), both runtimes:</p>
<pre><code class="language-javascript">import ts from 'typescript';
const src = &#96;const el = &lt;h1 className="title"&gt;Hello&lt;/h1&gt;;&#96;;
for (const jsx of ['react', 'react-jsx']) {
  const out = ts.transpileModule(src, { compilerOptions: { jsx: jsx === 'react' ? ts.JsxEmit.React : ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  console.log(&#96;--- jsx: \${jsx}\\n\${out.outputText.trim()}&#96;);
}</code></pre><pre><code class="language-bash">$ node jsx-demo.mjs</code></pre><div class="out">--- jsx: react
const el = React.createElement("h1", { className: "title" }, "Hello");
--- jsx: react-jsx
import { jsx as _jsx } from "react/jsx-runtime";
const el = _jsx("h1", { className: "title", children: "Hello" });</div>
<p>Capital vs lowercase, rendered for real with react-dom/server — the lowercase one becomes an unknown tag and your component never runs:</p>
<pre><code class="language-bash">$ node greet.cjs</code></pre><div class="out">&lt;p&gt;Hi, Bình!&lt;/p&gt;
&lt;greeting name="Bình"&gt;&lt;/greeting&gt;</div>
<p>class / for on React 19, and the same thing in a .tsx file:</p>
<pre><code class="language-bash">$ NODE_ENV=development node cls.cjs</code></pre><div class="out">&lt;div class="card"&gt;Thẻ&lt;/div&gt;
&lt;label for="email"&gt;Email&lt;/label&gt;
Invalid DOM property &#96;class&#96;. Did you mean &#96;className&#96;?
Invalid DOM property &#96;for&#96;. Did you mean &#96;htmlFor&#96;?</div><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/cls/page.tsx(2,15): error TS2322: Type '{ children: string; class: string; }' is not assignable to type 'DetailedHTMLProps&lt;HTMLAttributes&lt;HTMLDivElement&gt;, HTMLDivElement&gt;'.
  Property 'class' does not exist on type 'DetailedHTMLProps&lt;HTMLAttributes&lt;HTMLDivElement&gt;, HTMLDivElement&gt;'. Did you mean 'className'?</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">node jsx-demo.mjs      <span class="tok-comment">  # needs typescript installed (any Next.js app has it)</span>
node greet.cjs
NODE_ENV=development node cls.cjs</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-2-jsx" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 0.2 — JSX, explained</span><span class="lc-sub">What JSX becomes and what appears on screen — the same topic, deeper</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-1-jsx-basics" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.1 — JSX basics</span><span class="lc-sub">The university-course view</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JSX</span><span class="v">HTML-like syntax that compiles to JavaScript function calls.</span></div>
  <div class="kv"><span class="k">React.createElement</span><span class="v">The call JSX compiles to (classic runtime); builds an element object.</span></div>
  <div class="kv"><span class="k">Transpiler</span><span class="v">A tool (Babel/SWC) that turns JSX into plain JavaScript before it runs.</span></div>
  <div class="kv"><span class="k">Expression</span><span class="v">A piece of code that produces a value; JSX is one, so it goes anywhere a value can.</span></div>
  <div class="kv"><span class="k">Element object</span><span class="v">The <code>{ type, props, children }</code> object a JSX tag becomes.</span></div>
  <div class="kv"><span class="k">Fragment</span><span class="v"><code>&lt;&gt;...&lt;/&gt;</code> — group elements without adding a DOM node.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>JSX is not HTML and not magic — it compiles to plain JavaScript (<code>React.createElement</code> / <code>jsx()</code> calls).</li><li>Because the result is an expression, JSX can be stored in a variable, passed as an argument, or returned.</li><li>A JSX tag becomes a <code>{ type, props, children }</code> object, not a DOM node — React turns that into DOM later.</li><li>Seeing the compiled output removes the mystery and explains most JSX rules.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Dấu ngoặc nhọn là một lời nói dối của công cụ build</h2>
<p class="lead">JSX trông như HTML nằm trong JavaScript, cảm giác như phạm luật. Nó không phải HTML, và cũng không phải phép màu. Trước khi code chạy, một trình biên dịch viết lại mọi thẻ JSX thành một lời gọi hàm thuần. Hiểu bước viết lại đó xoá đi chín mươi phần trăm nỗi bối rối "sao cái này không chạy".</p>

<h3>JSX biên dịch ra gì</h3>
<p>Đoạn JSX này:</p>
<pre><code class="language-javascript">const el = &lt;h1 className="title"&gt;Hello&lt;/h1&gt;;</code></pre>
<p>được biên dịch — bởi Babel hoặc trình biên dịch của TypeScript/Next, trước khi nó chạm tới trình duyệt — thành JavaScript bình thường sau đây:</p>
<pre><code class="language-javascript">const el = React.createElement('h1', { className: 'title' }, 'Hello');</code></pre>
<p>Đó là toàn bộ mẹo. JSX là <em>đường cú pháp</em> cho các lời gọi <code>createElement</code>. Tên thẻ thành đối số thứ nhất, thuộc tính thành một object (đối số thứ hai), và các con thành phần còn lại. Không có HTML nào được phân tích lúc chạy — tới lúc code chạy, dấu ngoặc đã biến mất.</p>

<h3>Một element chỉ là một object</h3>
<p>Vậy <code>createElement</code> trả về gì? Không phải nút DOM, không phải HTML — một object JavaScript thuần mô tả cái bạn muốn. Chạy thử và nhìn:</p>
<pre><code class="language-javascript">const el = React.createElement('h1', { className: 'title' }, 'Hello');
console.log(JSON.stringify({ type: el.type, props: el.props }));</code></pre>
<div class="out">{"type":"h1","props":{"className":"title","children":"Hello"}}</div>
<p>Đó là một log thật, đã kiểm chứng. Một element là một mô tả nhẹ: <code>type</code> là cái cần render (một chuỗi như <code>'h1'</code> cho thẻ DOM, hoặc một hàm cho component), và <code>props</code> là túi chứa mọi thứ truyền vào nó — kể cả <code>children</code>. Vì nó chỉ là một object, tạo ra một cái rất rẻ; React có thể dựng cả một cây element ở mỗi lần render rồi vứt đi, và đó đúng là điều nó làm.</p>

<h3>Một component là một hàm trả về element</h3>
<p>Component chỉ là một hàm có tên bắt đầu bằng chữ hoa và trả về một cây element:</p>
<pre><code class="language-typescript">function Greeting({ name }) {
  return &lt;p&gt;Hi, {name}!&lt;/p&gt;;
}</code></pre>
<p>Render nó ra HTML và bạn được đúng cái mong đợi — output này lấy từ việc CHẠY THẬT qua <code>react-dom/server</code>:</p>
<pre><code>renderToStaticMarkup(&lt;Greeting name="Bình" /&gt;)</code></pre>
<div class="out">&lt;p&gt;Hi, Bình!&lt;/p&gt;</div>
<p>Chữ hoa không phải chuyện thẩm mỹ — nó là cách trình biên dịch quyết định. <code>&lt;Greeting /&gt;</code> biên dịch thành <code>createElement(Greeting, ...)</code> (truyền chính hàm đó); <code>&lt;greeting /&gt;</code> biên dịch thành <code>createElement('greeting', ...)</code> (một chuỗi — một thẻ DOM không tồn tại). Chữ thường nghĩa là "thẻ HTML", chữ hoa nghĩa là "component của tôi". Quên chữ hoa là React âm thầm render ra rỗng.</p>

<div class="pitfall">
<p><strong>Vì sao có lúc bạn vẫn thấy <code>import React from 'react'</code> và có lúc không.</strong> JSX cũ biên dịch thành <code>React.createElement(...)</code>, nên <code>React</code> phải nằm trong phạm vi — mọi file đều import nó. Từ React 17 "automatic runtime" tự import hàm phụ trợ hộ bạn ở hậu trường, nên file Next.js hiện đại dùng JSX mà chẳng import <code>React</code> gì cả. Cả hai là cùng một cơ chế; chỉ dòng import đổi. Nếu dòng đầu của một tutorial là <code>import React from 'react'</code> còn của bạn thì không, chẳng có gì sai.</p>
</div>
<h3>Trình biên dịch làm gì với JSX của bạn</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó không phải HTML</b> — &#96;&lt;Card title="Hi" /&gt;&#96; biên dịch thành một lời gọi hàm trả về một object. Đó là lý do JSX tuân luật của JavaScript, không phải luật của HTML.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Thuộc tính thành props</b> — Và chúng dùng tên kiểu JavaScript: &#96;className&#96;, &#96;htmlFor&#96;, &#96;onClick&#96; — vì &#96;class&#96; và &#96;for&#96; là từ khoá của ngôn ngữ.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Phần con thành một đối số</b> — Bất cứ thứ gì nằm giữa hai thẻ đều được truyền tiếp dưới dạng &#96;props.children&#96;, và chính điều đó cho phép có component bọc.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nên một component chỉ là một hàm</b> — Nó nhận props và trả về element. Mọi thứ bạn biết về hàm — giá trị mặc định, phép rã, trả về sớm — đều áp dụng nguyên vẹn.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — viết &#96;class&#96; thay vì &#96;className&#96;.</strong> Đo trên React 19.3.0: nó <em>không</em> hỏng ầm ĩ — React vẫn đưa &#96;class="card"&#96; và &#96;for="email"&#96; ra HTML và chỉ in một cảnh báo lúc dev, <em>Invalid DOM property &#96;class&#96;. Did you mean &#96;className&#96;?</em>, rất dễ lướt qua (lời khuyên cũ nói class bị bỏ đi; với bản này thì không). Trong tệp &#96;.tsx&#96;, TypeScript từ chối luôn: <em>TS2322 … Property 'class' does not exist … Did you mean 'className'?</em> (output bên dưới). Cả hai đều là hệ quả của việc JSX là JavaScript: &#96;class&#96; và &#96;for&#96; là từ khoá. Hãy bật plugin ESLint của React và nó báo ngay lúc bạn gõ.</p></div>
<a class="link-card dl" href="https://react.dev/learn/writing-markup-with-jsx" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">react.dev — Viết markup bằng JSX</span><span class="lc-sub">Các luật, và ba luật bắt hụt chân tất cả mọi người.</span></span>
</a>
<a class="link-card dl" href="https://babeljs.io/repl" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Babel REPL — xem JSX biên dịch ra gì</span><span class="lc-sub">Dán một component vào, xem nó thành các lời gọi hàm thuần. Mười phút ở đây gỡ được phần lớn nhầm lẫn về JSX.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy một đoạn JSX nhỏ và dán vào Babel REPL (hoặc sân chơi SWC) để xem nó biên dịch thành gì — để ý các lời gọi <code>React.createElement</code> / <code>jsx(...)</code>.</li>
<li>Viết tay một element JSX thành lời gọi hàm tương đương, rồi đổi ngược lại; xác nhận chúng là một.</li>
<li>Giải thích vì sao JSX xuất hiện được ở bất cứ đâu một biểu thức JavaScript xuất hiện được (biến, tham số, giá trị trả về).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã thấy JSX biên dịch thành lời gọi hàm và chuyển qua lại được một element nhỏ.</p></div>

<h3>🔬 Đo thật: tự chạy trình biên dịch</h3>
<p>Một dòng JSX qua trình biên dịch TypeScript (cùng phép viết lại Next.js làm bằng SWC), cả hai runtime:</p>
<pre><code class="language-javascript">import ts from 'typescript';
const src = &#96;const el = &lt;h1 className="title"&gt;Hello&lt;/h1&gt;;&#96;;
for (const jsx of ['react', 'react-jsx']) {
  const out = ts.transpileModule(src, { compilerOptions: { jsx: jsx === 'react' ? ts.JsxEmit.React : ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  console.log(&#96;--- jsx: \${jsx}\\n\${out.outputText.trim()}&#96;);
}</code></pre><pre><code class="language-bash">$ node jsx-demo.mjs</code></pre><div class="out">--- jsx: react
const el = React.createElement("h1", { className: "title" }, "Hello");
--- jsx: react-jsx
import { jsx as _jsx } from "react/jsx-runtime";
const el = _jsx("h1", { className: "title", children: "Hello" });</div>
<p>Chữ hoa và chữ thường, render thật bằng react-dom/server — bản viết thường thành một thẻ lạ và component của bạn không hề chạy:</p>
<pre><code class="language-bash">$ node greet.cjs</code></pre><div class="out">&lt;p&gt;Hi, Bình!&lt;/p&gt;
&lt;greeting name="Bình"&gt;&lt;/greeting&gt;</div>
<p>class / for trên React 19, và cùng điều đó trong tệp .tsx:</p>
<pre><code class="language-bash">$ NODE_ENV=development node cls.cjs</code></pre><div class="out">&lt;div class="card"&gt;Thẻ&lt;/div&gt;
&lt;label for="email"&gt;Email&lt;/label&gt;
Invalid DOM property &#96;class&#96;. Did you mean &#96;className&#96;?
Invalid DOM property &#96;for&#96;. Did you mean &#96;htmlFor&#96;?</div><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/cls/page.tsx(2,15): error TS2322: Type '{ children: string; class: string; }' is not assignable to type 'DetailedHTMLProps&lt;HTMLAttributes&lt;HTMLDivElement&gt;, HTMLDivElement&gt;'.
  Property 'class' does not exist on type 'DetailedHTMLProps&lt;HTMLAttributes&lt;HTMLDivElement&gt;, HTMLDivElement&gt;'. Did you mean 'className'?</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">node jsx-demo.mjs      <span class="tok-comment">  # cần typescript (dự án Next.js nào cũng có)</span>
node greet.cjs
NODE_ENV=development node cls.cjs</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-2-jsx" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 0.2 — JSX, giải thích cho rõ</span><span class="lc-sub">JSX thành gì và cái gì hiện lên màn hình — cùng chủ đề, đi sâu hơn</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-1-jsx-basics" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.1 — JSX cơ bản</span><span class="lc-sub">Góc nhìn môn học ở trường</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JSX</span><span class="v">Cú pháp giống HTML, biên dịch thành lời gọi hàm JavaScript.</span></div>
  <div class="kv"><span class="k">React.createElement</span><span class="v">Lời gọi mà JSX biên dịch ra (runtime cổ điển); dựng object element.</span></div>
  <div class="kv"><span class="k">Transpiler</span><span class="v">Công cụ (Babel/SWC) biến JSX thành JavaScript thuần trước khi chạy.</span></div>
  <div class="kv"><span class="k">Biểu thức</span><span class="v">Đoạn code sinh ra một giá trị; JSX là một biểu thức nên đặt được ở bất cứ đâu.</span></div>
  <div class="kv"><span class="k">Object element</span><span class="v">Object <code>{ type, props, children }</code> mà một thẻ JSX trở thành.</span></div>
  <div class="kv"><span class="k">Fragment</span><span class="v"><code>&lt;&gt;...&lt;/&gt;</code> — gom element mà không thêm node DOM.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>JSX không phải HTML và không phải phép thuật — nó biên dịch thành JavaScript thuần (lời gọi <code>React.createElement</code> / <code>jsx()</code>).</li><li>Vì kết quả là một biểu thức, JSX lưu được vào biến, truyền làm tham số, hoặc trả về.</li><li>Một thẻ JSX thành object <code>{ type, props, children }</code>, không phải node DOM — React dựng DOM sau.</li><li>Nhìn bản biên dịch gỡ bỏ sự huyền bí và giải thích hầu hết luật JSX.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — Putting values into JSX: the curly braces|||1.3 — Nhét giá trị vào JSX: dấu ngoặc nhọn',
      slug: 'nextjs-1-3-ngoac-nhon',
      type: 'VIDEO',
      isFreePreview: false,
      description: '{ } mở một cửa sổ trở lại JavaScript bên trong JSX. Thuộc tính là camelCase, className thay class, và style là một object.',
      content: `
${G01_3}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Curly braces: a window back into JavaScript</h2>
<p class="lead">Inside JSX, anything in <code>{ }</code> is evaluated as a JavaScript <em>expression</em> and its result is inserted. That is the only escape hatch you need — and it's a strict one: expressions only, never statements.</p>

<h3>Any expression goes in braces</h3>
<pre><code class="language-typescript">function Card({ user }) {
  return (
    &lt;div&gt;
      &lt;h2&gt;{user.name}&lt;/h2&gt;
      &lt;p&gt;{user.age * 2} in dog years&lt;/p&gt;
      &lt;p&gt;{user.name.toUpperCase()}&lt;/p&gt;
      &lt;p&gt;Joined {new Date(user.joinedAt).getFullYear()}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>A variable, arithmetic, a method call, a ternary — all fine, because all of them are expressions that <em>produce a value</em>. What you cannot put in braces is a statement: no <code>if</code>, no <code>for</code>, no <code>const</code>. <code>{if (x) ...}</code> is a syntax error. When you need a condition, use a ternary or <code>&amp;&amp;</code> (next lesson); when you need a loop, use <code>.map()</code>. If the logic is bigger than that, compute it <em>above</em> the <code>return</code> in plain JavaScript and drop the result into braces.</p>

<h3>What React renders, and what it drops</h3>
<p>When an expression evaluates to a string or number, React prints it. When it evaluates to <code>null</code>, <code>undefined</code>, <code>true</code> or <code>false</code>, React renders <strong>nothing</strong> — it just skips it. This is deliberate and you will lean on it constantly. (One exception is a famous trap, covered next: the number <code>0</code> is <em>not</em> skipped.)</p>

<h3>Attributes are props, and they are camelCase</h3>
<p>JSX attributes look like HTML attributes but they are really props passed to <code>createElement</code>, and they follow JavaScript naming, not HTML naming:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">class → className</span><span class="v"><code>class</code> is a reserved word in JavaScript, so JSX uses <code>className</code>.</span></div>
  <div class="kv"><span class="k">for → htmlFor</span><span class="v">Same reason — <code>for</code> is reserved. A <code>&lt;label&gt;</code> uses <code>htmlFor</code>.</span></div>
  <div class="kv"><span class="k">onclick → onClick</span><span class="v">Event handlers are camelCase and take a function, not a string: <code>onClick={handleClick}</code>.</span></div>
  <div class="kv"><span class="k">style is an object</span><span class="v"><code>style={{ color: 'red', fontSize: 16 }}</code> — an object with camelCased CSS keys, not a CSS string.</span></div>
</div>
<pre><code class="language-html">&lt;button className="btn" onClick={handleSave} style={{ marginTop: 8 }}&gt;
  Save
&lt;/button&gt;</code></pre>
<p>The double braces on <code>style</code> confuse everyone once: the outer <code>{ }</code> is "enter JavaScript", the inner <code>{ }</code> is "an object literal". So <code>style={{...}}</code> means "the value of the <code>style</code> prop is this object".</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it</strong> — this site styles almost everything with Tailwind utility classes in <code>className</code> (<code>className="flex items-center gap-2"</code>), and reserves the <code>style</code> object for the few truly dynamic values that can't be a class — a computed width, an aspect-ratio measured from a video, a CSS variable set at runtime. Chapter 13 is entirely about this choice.</p>
</div>
<h3>What braces mean in each position</h3>
<div class="lz-map">
  <div class="lz-stage">Four places, one rule: a JavaScript expression</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">In text: {value}</div><div class="lz-nsub">Renders the value. Strings and numbers print; &#96;null&#96;, &#96;undefined&#96;, &#96;false&#96; and &#96;true&#96; render nothing at all — which is what makes conditional rendering work.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">In an attribute: prop={expr}</div><div class="lz-nsub">No quotes around the braces. &#96;title={&#39;Hi&#39;}&#96; and &#96;title="Hi"&#96; are the same; &#96;title="{x}"&#96; passes the literal three characters <code>{x}</code> — measured: the server HTML really contains <code>title="{x}"</code>.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Double braces: style={{…}}</div><div class="lz-nsub">Not special syntax — the outer pair is the expression slot, the inner pair is an object literal. Same for &#96;data={{ id: 1 }}&#96;.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Expressions only, never statements</div><div class="lz-nsub">&#96;{if (x) …}&#96; is a syntax error. Use a ternary, &#96;&amp;&amp;&#96;, or compute the value in a variable above the &#96;return&#96;.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — &#96;{count &amp;&amp; &lt;Badge /&gt;}&#96; renders a literal 0 when the count is zero.</strong> &#96;&amp;&amp;&#96; returns its left operand when that operand is falsy, and React renders the number &#96;0&#96; because zero is a perfectly good thing to display. So an empty cart shows a bare &quot;0&quot; floating in the layout, and it only happens at exactly one value — which is why it survives testing. The same bug hits &#96;items.length &amp;&amp; …&#96;. Force a boolean (&#96;count &gt; 0 &amp;&amp; …&#96;) or use a ternary with &#96;null&#96;. Empty string does the same thing in some positions, so &#96;name &amp;&amp; …&#96; is worth the same care.</p></div>
<a class="link-card dl" href="https://react.dev/learn/javascript-in-jsx-with-curly-braces" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">react.dev — JavaScript in JSX with curly braces</span><span class="lc-sub">Every position braces are allowed, and what each one accepts.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/conditional-rendering" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">react.dev — Conditional rendering</span><span class="lc-sub">Ternary, &amp;&amp;, and early return — with the falsy-value trap called out.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Render a variable, a math expression, and a function call inside JSX using <code>{ }</code>; confirm each prints its value.</li>
<li>Try putting a statement (an <code>if</code>, a <code>for</code>) inside the braces and read the error — then rewrite it as an expression (ternary, <code>.map</code>).</li>
<li>Pass a value into an attribute with braces (<code>src={url}</code>) and note the difference from a string attribute.</li>
</ol>
<p><strong>Done when:</strong> you can embed any expression in JSX and know why statements are not allowed inside the braces.</p></div>

<h3>🔬 Measured: what the braces really do (Next.js 16.4.6 · React 19.3.0)</h3>
<p>A statement inside braces — the page does not even compile. TypeScript and the production build:</p>
<pre><code class="language-tsx">const user = { name: 'Bình', age: 20 };

export default function Loi() {
  return (
    &lt;div&gt;
      {if (user.age &gt;= 18) { 'Người lớn' }}
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/loi/page.tsx(6,8): error TS1109: Expression expected.
src/app/loi/page.tsx(6,21): error TS1382: Unexpected token. Did you mean &#96;{'&gt;'}&#96; or &#96;&amp;gt;&#96;?
src/app/loi/page.tsx(6,43): error TS1381: Unexpected token. Did you mean &#96;{'}'}&#96; or &#96;&amp;rbrace;&#96;?</div><pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -A12 'Build error'</code></pre><div class="out">&gt; Build error occurred
Error: Turbopack build failed with 1 error:
./src/app/loi/page.tsx:6:8
Error: Expected '&lt;/', got 'if'
  4 |   return (
  5 |     &lt;div&gt;
&gt; 6 |       {if (user.age &gt;= 18) { 'Người lớn' }}
    |        ^^
  7 |     &lt;/div&gt;
  8 |   );
  9 | }

Parsing ecmascript source code failed</div>
<p>In <code>next dev</code> the whole page becomes a <b>Build Error</b> overlay with the same message, pointing at line 6.</p>
<p>What React prints and what it skips, rendered for real with react-dom/server (a browser shows the same):</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const thu = [["'Bình'", 'Bình'], ['42', 42], ['0', 0], ['NaN', NaN], ["''", ''], ['null', null],
  ['undefined', undefined], ['true', true], ['false', false], ["['a', null, 'b']", ['a', null, 'b']]];
for (const [nhan, v] of thu) {
  console.log(&#96;{\${nhan}}&#96;.padEnd(19) + '→ ' + renderToStaticMarkup(React.createElement('p', null, v)));
}
try { renderToStaticMarkup(React.createElement('p', null, { a: 1 })); }
catch (e) { console.log('{{ a: 1 }}'.padEnd(19) + '→ ' + e.message.split('.')[0]); }</code></pre><pre><code class="language-bash">$ node hien.cjs</code></pre><div class="out">{'Bình'}           → &lt;p&gt;Bình&lt;/p&gt;
{42}               → &lt;p&gt;42&lt;/p&gt;
{0}                → &lt;p&gt;0&lt;/p&gt;
{NaN}              → &lt;p&gt;NaN&lt;/p&gt;
{''}               → &lt;p&gt;&lt;/p&gt;
{null}             → &lt;p&gt;&lt;/p&gt;
{undefined}        → &lt;p&gt;&lt;/p&gt;
{true}             → &lt;p&gt;&lt;/p&gt;
{false}            → &lt;p&gt;&lt;/p&gt;
{['a', null, 'b']} → &lt;p&gt;ab&lt;/p&gt;
{{ a: 1 }}         → Objects are not valid as a React child (found: object with keys {a})
Received NaN for the &#96;children&#96; attribute. If this is expected, cast the value to a string.</div>
<p>Quotes vs braces — the real server HTML of a page with four <code>title</code> attributes and a styled button:</p>
<pre><code class="language-tsx">'use client';
const x = 'Hi';

export default function Thuoc() {
  const handleSave = () =&gt; alert('Đã lưu');
  return (
    &lt;div className="space-y-2 p-8 font-mono text-lg"&gt;
      &lt;p id="a" title="Hi"&gt;title="Hi"&lt;/p&gt;
      &lt;p id="b" title={'Hi'}&gt;title={"{'Hi'}"}&lt;/p&gt;
      &lt;p id="c" title="{x}"&gt;title="{'{x}'}"&lt;/p&gt;
      &lt;p id="d" title={x}&gt;title={'{x}'}&lt;/p&gt;
      &lt;button className="btn rounded border px-3" onClick={handleSave} style={{ marginTop: 8 }}&gt;
        Save
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-bash">$ curl -s localhost:3000/thuoc | grep -oE '&lt;(p id|button)[^&gt;]*&gt;'</code></pre><div class="out">&lt;p id="a" title="Hi"&gt;
&lt;p id="b" title="Hi"&gt;
&lt;p id="c" title="{x}"&gt;
&lt;p id="d" title="Hi"&gt;
&lt;button class="btn rounded border px-3" style="margin-top:8px"&gt;</div>
<p>style as an object (React adds px) vs a CSS string, and the same mistakes in a .tsx file:</p>
<pre><code class="language-bash">$ node style.cjs</code></pre><div class="out">&lt;button class="btn" style="margin-top:8px;font-size:16px;color:red"&gt;Save&lt;/button&gt;
The &#96;style&#96; prop expects a mapping from style properties to values, not a string</div><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/sai/page.tsx(3,13): error TS2322: Type 'string' is not assignable to type 'MouseEventHandler&lt;HTMLButtonElement&gt;'.
src/app/sai/page.tsx(3,36): error TS2559: Type 'string' has no properties in common with type 'Properties&lt;string | number, string &amp; {}&gt;'.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># in any Next.js app (React + react-dom are installed)</span>
node hien.cjs
node style.cjs
<span class="tok-comment"># put {if (…) …} in a page, then:</span>
npx tsc --noEmit
npm run build</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-2-jsx" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 0.2 — JSX, explained</span><span class="lc-sub">The "What shows up inside { }" part: 0 shows, true/null vanish, strings are escaped</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-3-js-cho-react" target="_blank" rel="noopener"><span class="lc-ico">🧠</span><span class="lc-body"><span class="lc-title">React · 0.3 — JavaScript for React</span><span class="lc-sub">Truthy and falsy, ?. and ?? — the basis of every expression inside braces</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-1-jsx-basics" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.1 — JSX basics</span><span class="lc-sub">The university-course view</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Curly braces { }</span><span class="v">An escape hatch to put a JavaScript expression inside JSX.</span></div>
  <div class="kv"><span class="k">Expression vs statement</span><span class="v">Braces take expressions (produce a value), not statements (<code>if</code>, <code>for</code>).</span></div>
  <div class="kv"><span class="k">Interpolation</span><span class="v">Dropping a computed value into the markup.</span></div>
  <div class="kv"><span class="k">Attribute value</span><span class="v"><code>attr={expr}</code> passes a real value; quotes pass a literal string.</span></div>
  <div class="kv"><span class="k">Falsy render</span><span class="v"><code>false</code>, <code>null</code>, <code>undefined</code> render nothing; <code>0</code> and <code>&quot;&quot;</code> can surprise you.</span></div>
  <div class="kv"><span class="k">Children expression</span><span class="v">Text and <code>{expr}</code> between tags become the element's children.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Curly braces <code>{ }</code> embed any JavaScript expression into JSX — values, math, function calls.</li><li>Braces take expressions, not statements: no <code>if</code> or <code>for</code> inside — use a ternary or <code>.map</code>.</li><li><code>attr={expr}</code> passes a real value; <code>attr=&quot;x&quot;</code> passes a literal string.</li><li>Falsy values render nothing, but <code>0</code> and empty strings can leak onto the screen — guard them.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Dấu ngoặc nhọn: một cửa sổ trở lại JavaScript</h2>
<p class="lead">Bên trong JSX, bất cứ thứ gì trong <code>{ }</code> đều được tính như một <em>biểu thức</em> JavaScript và kết quả của nó được chèn vào. Đó là cửa thoát duy nhất bạn cần — và là một cửa nghiêm ngặt: chỉ biểu thức, không bao giờ là câu lệnh.</p>

<h3>Bất kỳ biểu thức nào cũng vào được trong ngoặc</h3>
<pre><code class="language-typescript">function Card({ user }) {
  return (
    &lt;div&gt;
      &lt;h2&gt;{user.name}&lt;/h2&gt;
      &lt;p&gt;{user.age * 2} tuổi chó&lt;/p&gt;
      &lt;p&gt;{user.name.toUpperCase()}&lt;/p&gt;
      &lt;p&gt;Tham gia {new Date(user.joinedAt).getFullYear()}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Một biến, phép tính, một lời gọi phương thức, một ternary — đều ổn, vì tất cả đều là biểu thức <em>sinh ra một giá trị</em>. Cái bạn KHÔNG thể nhét vào ngoặc là câu lệnh: không <code>if</code>, không <code>for</code>, không <code>const</code>. <code>{if (x) ...}</code> là lỗi cú pháp. Khi cần điều kiện, dùng ternary hoặc <code>&amp;&amp;</code> (bài sau); khi cần vòng lặp, dùng <code>.map()</code>. Nếu logic to hơn thế, hãy tính nó <em>phía trên</em> câu <code>return</code> bằng JavaScript thuần rồi thả kết quả vào ngoặc.</p>

<h3>React render cái gì, và bỏ qua cái gì</h3>
<p>Khi một biểu thức cho ra chuỗi hoặc số, React in nó. Khi nó cho ra <code>null</code>, <code>undefined</code>, <code>true</code> hoặc <code>false</code>, React render ra <strong>rỗng</strong> — nó chỉ bỏ qua. Điều này là cố ý và bạn sẽ dựa vào nó liên tục. (Một ngoại lệ là cái bẫy nổi tiếng, bàn ở bài sau: số <code>0</code> <em>không</em> bị bỏ qua.)</p>

<h3>Thuộc tính là props, và chúng viết camelCase</h3>
<p>Thuộc tính JSX trông như thuộc tính HTML nhưng thực ra là props truyền vào <code>createElement</code>, và chúng theo cách đặt tên của JavaScript, không phải HTML:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">class → className</span><span class="v"><code>class</code> là từ khoá dành riêng trong JavaScript, nên JSX dùng <code>className</code>.</span></div>
  <div class="kv"><span class="k">for → htmlFor</span><span class="v">Cùng lý do — <code>for</code> là từ khoá. Một <code>&lt;label&gt;</code> dùng <code>htmlFor</code>.</span></div>
  <div class="kv"><span class="k">onclick → onClick</span><span class="v">Handler sự kiện viết camelCase và nhận một HÀM, không phải chuỗi: <code>onClick={handleClick}</code>.</span></div>
  <div class="kv"><span class="k">style là một object</span><span class="v"><code>style={{ color: 'red', fontSize: 16 }}</code> — một object có khoá CSS viết camelCase, không phải chuỗi CSS.</span></div>
</div>
<pre><code class="language-html">&lt;button className="btn" onClick={handleSave} style={{ marginTop: 8 }}&gt;
  Save
&lt;/button&gt;</code></pre>
<p>Cặp ngoặc đôi ở <code>style</code> làm ai cũng bối rối một lần: <code>{ }</code> ngoài là "vào JavaScript", <code>{ }</code> trong là "một object literal". Vậy <code>style={{...}}</code> nghĩa là "giá trị của prop <code>style</code> là object này".</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào</strong> — site này style gần như mọi thứ bằng class tiện ích Tailwind trong <code>className</code> (<code>className="flex items-center gap-2"</code>), và để dành object <code>style</code> cho vài giá trị thật sự động không thể thành class — một chiều rộng tính toán, một tỉ lệ khung hình đo từ video, một biến CSS đặt lúc chạy. Chương 13 dành trọn để bàn lựa chọn này.</p>
</div>
<h3>Dấu ngoặc nhọn nghĩa là gì ở từng vị trí</h3>
<div class="lz-map">
  <div class="lz-stage">Bốn chỗ, một luật: một biểu thức JavaScript</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Trong chữ: {value}</div><div class="lz-nsub">Vẽ ra giá trị. Chuỗi và số thì in ra; &#96;null&#96;, &#96;undefined&#96;, &#96;false&#96; và &#96;true&#96; chẳng vẽ ra gì cả — và chính điều đó làm phép vẽ có điều kiện chạy được.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Trong thuộc tính: prop={expr}</div><div class="lz-nsub">Không có dấu nháy bọc quanh ngoặc. &#96;title={&#39;Hi&#39;}&#96; và &#96;title="Hi"&#96; là một; còn &#96;title="{x}"&#96; truyền đúng ba ký tự <code>{x}</code> đó — đo thật: HTML máy chủ trả về chứa nguyên <code>title="{x}"</code>.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Hai lớp ngoặc: style={{…}}</div><div class="lz-nsub">Không phải cú pháp đặc biệt — lớp ngoài là ô biểu thức, lớp trong là một object literal. Với &#96;data={{ id: 1 }}&#96; cũng vậy.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Chỉ biểu thức, không bao giờ là câu lệnh</div><div class="lz-nsub">&#96;{if (x) …}&#96; là lỗi cú pháp. Hãy dùng toán tử ba ngôi, &#96;&amp;&amp;&#96;, hoặc tính giá trị ra một biến ở trên &#96;return&#96;.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — &#96;{count &amp;&amp; &lt;Badge /&gt;}&#96; vẽ ra một số 0 chình ình khi count bằng không.</strong> &#96;&amp;&amp;&#96; trả về vế trái khi vế đó là falsy, và React vẽ số &#96;0&#96; ra vì số không là một thứ hoàn toàn hiển thị được. Thế là một giỏ hàng rỗng hiện một chữ &quot;0&quot; trơ trọi giữa bố cục, và nó chỉ xảy ra ở đúng một giá trị — đó là lý do nó sống sót qua khâu thử. Cùng lỗi ấy đánh vào &#96;items.length &amp;&amp; …&#96;. Hãy ép thành boolean (&#96;count &gt; 0 &amp;&amp; …&#96;) hoặc dùng ba ngôi với &#96;null&#96;. Chuỗi rỗng cũng gây chuyện tương tự ở vài vị trí, nên &#96;name &amp;&amp; …&#96; cũng đáng cẩn thận như thế.</p></div>
<a class="link-card dl" href="https://react.dev/learn/javascript-in-jsx-with-curly-braces" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">react.dev — JavaScript trong JSX bằng ngoặc nhọn</span><span class="lc-sub">Mọi vị trí được phép đặt ngoặc, và mỗi chỗ nhận cái gì.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/conditional-rendering" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">react.dev — Vẽ có điều kiện</span><span class="lc-sub">Ba ngôi, &amp;&amp;, và trả về sớm — có nêu rõ cái bẫy giá trị falsy.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Render một biến, một biểu thức toán, và một lời gọi hàm trong JSX bằng <code>{ }</code>; xác nhận mỗi cái in ra giá trị.</li>
<li>Thử đặt một câu lệnh (<code>if</code>, <code>for</code>) trong ngoặc và đọc lỗi — rồi viết lại thành biểu thức (ternary, <code>.map</code>).</li>
<li>Truyền giá trị vào thuộc tính bằng ngoặc nhọn (<code>src={url}</code>) và để ý khác với thuộc tính dạng chuỗi.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nhúng được biểu thức bất kỳ vào JSX và biết vì sao câu lệnh không được phép trong ngoặc.</p></div>

<h3>🔬 Đo thật: ngoặc nhọn thật sự làm gì (Next.js 16.4.6 · React 19.3.0)</h3>
<p>Một câu lệnh trong ngoặc — trang không hề biên dịch. TypeScript và bản build:</p>
<pre><code class="language-tsx">const user = { name: 'Bình', age: 20 };

export default function Loi() {
  return (
    &lt;div&gt;
      {if (user.age &gt;= 18) { 'Người lớn' }}
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/loi/page.tsx(6,8): error TS1109: Expression expected.
src/app/loi/page.tsx(6,21): error TS1382: Unexpected token. Did you mean &#96;{'&gt;'}&#96; or &#96;&amp;gt;&#96;?
src/app/loi/page.tsx(6,43): error TS1381: Unexpected token. Did you mean &#96;{'}'}&#96; or &#96;&amp;rbrace;&#96;?</div><pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -A12 'Build error'</code></pre><div class="out">&gt; Build error occurred
Error: Turbopack build failed with 1 error:
./src/app/loi/page.tsx:6:8
Error: Expected '&lt;/', got 'if'
  4 |   return (
  5 |     &lt;div&gt;
&gt; 6 |       {if (user.age &gt;= 18) { 'Người lớn' }}
    |        ^^
  7 |     &lt;/div&gt;
  8 |   );
  9 | }

Parsing ecmascript source code failed</div>
<p>Ở <code>next dev</code> cả trang thành lớp phủ <b>Build Error</b> với đúng thông báo đó, chỉ vào dòng 6.</p>
<p>React in gì và bỏ qua gì, render thật bằng react-dom/server (trình duyệt cho kết quả y hệt):</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const thu = [["'Bình'", 'Bình'], ['42', 42], ['0', 0], ['NaN', NaN], ["''", ''], ['null', null],
  ['undefined', undefined], ['true', true], ['false', false], ["['a', null, 'b']", ['a', null, 'b']]];
for (const [nhan, v] of thu) {
  console.log(&#96;{\${nhan}}&#96;.padEnd(19) + '→ ' + renderToStaticMarkup(React.createElement('p', null, v)));
}
try { renderToStaticMarkup(React.createElement('p', null, { a: 1 })); }
catch (e) { console.log('{{ a: 1 }}'.padEnd(19) + '→ ' + e.message.split('.')[0]); }</code></pre><pre><code class="language-bash">$ node hien.cjs</code></pre><div class="out">{'Bình'}           → &lt;p&gt;Bình&lt;/p&gt;
{42}               → &lt;p&gt;42&lt;/p&gt;
{0}                → &lt;p&gt;0&lt;/p&gt;
{NaN}              → &lt;p&gt;NaN&lt;/p&gt;
{''}               → &lt;p&gt;&lt;/p&gt;
{null}             → &lt;p&gt;&lt;/p&gt;
{undefined}        → &lt;p&gt;&lt;/p&gt;
{true}             → &lt;p&gt;&lt;/p&gt;
{false}            → &lt;p&gt;&lt;/p&gt;
{['a', null, 'b']} → &lt;p&gt;ab&lt;/p&gt;
{{ a: 1 }}         → Objects are not valid as a React child (found: object with keys {a})
Received NaN for the &#96;children&#96; attribute. If this is expected, cast the value to a string.</div>
<p>Dấu nháy và ngoặc nhọn — HTML thật máy chủ trả về cho một trang có bốn thuộc tính <code>title</code> và một nút có style:</p>
<pre><code class="language-tsx">'use client';
const x = 'Hi';

export default function Thuoc() {
  const handleSave = () =&gt; alert('Đã lưu');
  return (
    &lt;div className="space-y-2 p-8 font-mono text-lg"&gt;
      &lt;p id="a" title="Hi"&gt;title="Hi"&lt;/p&gt;
      &lt;p id="b" title={'Hi'}&gt;title={"{'Hi'}"}&lt;/p&gt;
      &lt;p id="c" title="{x}"&gt;title="{'{x}'}"&lt;/p&gt;
      &lt;p id="d" title={x}&gt;title={'{x}'}&lt;/p&gt;
      &lt;button className="btn rounded border px-3" onClick={handleSave} style={{ marginTop: 8 }}&gt;
        Save
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-bash">$ curl -s localhost:3000/thuoc | grep -oE '&lt;(p id|button)[^&gt;]*&gt;'</code></pre><div class="out">&lt;p id="a" title="Hi"&gt;
&lt;p id="b" title="Hi"&gt;
&lt;p id="c" title="{x}"&gt;
&lt;p id="d" title="Hi"&gt;
&lt;button class="btn rounded border px-3" style="margin-top:8px"&gt;</div>
<p>style là object (React tự thêm px) và style là chuỗi CSS, cùng hai lỗi đó trong tệp .tsx:</p>
<pre><code class="language-bash">$ node style.cjs</code></pre><div class="out">&lt;button class="btn" style="margin-top:8px;font-size:16px;color:red"&gt;Save&lt;/button&gt;
The &#96;style&#96; prop expects a mapping from style properties to values, not a string</div><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/sai/page.tsx(3,13): error TS2322: Type 'string' is not assignable to type 'MouseEventHandler&lt;HTMLButtonElement&gt;'.
src/app/sai/page.tsx(3,36): error TS2559: Type 'string' has no properties in common with type 'Properties&lt;string | number, string &amp; {}&gt;'.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># trong dự án Next.js bất kỳ (đã có react + react-dom)</span>
node hien.cjs
node style.cjs
<span class="tok-comment"># đặt {if (…) …} vào một trang, rồi:</span>
npx tsc --noEmit
npm run build</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-2-jsx" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 0.2 — JSX, giải thích cho rõ</span><span class="lc-sub">Phần "Cái gì hiện ra trong { }": số 0 hiện, true/null biến mất, chuỗi bị thoát</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-3-js-cho-react" target="_blank" rel="noopener"><span class="lc-ico">🧠</span><span class="lc-body"><span class="lc-title">React · 0.3 — JavaScript cho React</span><span class="lc-sub">Truthy và falsy, ?. và ?? — nền của mọi biểu thức trong ngoặc nhọn</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-1-jsx-basics" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.1 — JSX cơ bản</span><span class="lc-sub">Góc nhìn môn học ở trường</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ngoặc nhọn { }</span><span class="v">Cửa thoát để đặt một biểu thức JavaScript vào trong JSX.</span></div>
  <div class="kv"><span class="k">Biểu thức vs câu lệnh</span><span class="v">Ngoặc nhận biểu thức (sinh giá trị), không nhận câu lệnh (<code>if</code>, <code>for</code>).</span></div>
  <div class="kv"><span class="k">Nội suy</span><span class="v">Thả một giá trị đã tính vào markup.</span></div>
  <div class="kv"><span class="k">Giá trị thuộc tính</span><span class="v"><code>attr={expr}</code> truyền giá trị thật; dấu nháy truyền chuỗi literal.</span></div>
  <div class="kv"><span class="k">Render falsy</span><span class="v"><code>false</code>, <code>null</code>, <code>undefined</code> render ra rỗng; <code>0</code> và <code>&quot;&quot;</code> dễ gây bất ngờ.</span></div>
  <div class="kv"><span class="k">Biểu thức con</span><span class="v">Chữ và <code>{expr}</code> giữa các thẻ trở thành children của element.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ngoặc nhọn <code>{ }</code> nhúng biểu thức JavaScript bất kỳ vào JSX — giá trị, phép toán, lời gọi hàm.</li><li>Ngoặc nhận biểu thức, không nhận câu lệnh: không <code>if</code> hay <code>for</code> bên trong — dùng ternary hoặc <code>.map</code>.</li><li><code>attr={expr}</code> truyền giá trị thật; <code>attr=&quot;x&quot;</code> truyền chuỗi literal.</li><li>Giá trị falsy render ra rỗng, nhưng <code>0</code> và chuỗi rỗng có thể lọt lên màn hình — hãy chặn.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Lists and conditionals|||1.4 — Danh sách và điều kiện',
      slug: 'nextjs-1-4-danh-sach-dieu-kien',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Render danh sách bằng .map() (và key), điều kiện bằng && và ternary — và cái bẫy kinh điển: số 0.',
      content: `
${G01_4}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Rendering many things, and rendering sometimes</h2>
<p class="lead">Two patterns cover almost every dynamic UI: turning an array into elements with <code>.map()</code>, and showing something only when a condition holds. Both are just JavaScript expressions living inside curly braces.</p>

<h3>Lists: <code>.map()</code> an array into elements</h3>
<p>There is no loop syntax in JSX. To render a list you transform an array of data into an array of elements — and React knows how to render an array of elements:</p>
<pre><code class="language-typescript">function List() {
  const items = ['a', 'b', 'c'];
  return (
    &lt;ul&gt;
      {items.map((t, i) =&gt; &lt;li key={i}&gt;{t}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}</code></pre>
<p>Rendered for real through <code>react-dom/server</code>:</p>
<div class="out">&lt;ul&gt;&lt;li&gt;a&lt;/li&gt;&lt;li&gt;b&lt;/li&gt;&lt;li&gt;c&lt;/li&gt;&lt;/ul&gt;</div>
<p>Every element in a mapped list needs a <code>key</code> — a stable identifier React uses to track which item is which across re-renders. Here we used the index <code>i</code>, which is fine for a static list but is a real bug for a list that reorders or has items inserted and removed. That bug is important enough to get its own treatment in Chapter 7; for now, the rule is: <em>every <code>.map()</code> that returns elements needs a <code>key</code>, and prefer a stable id (<code>item.id</code>) over the index.</em></p>

<h3>Conditionals: <code>&amp;&amp;</code> and the ternary</h3>
<p>To show an element only when a condition is true, use the <code>&amp;&amp;</code> operator. If the left side is truthy, the expression evaluates to the right side (the element); if falsy, it evaluates to the falsy value, which React skips:</p>
<pre><code class="language-html">{isLoggedIn &amp;&amp; &lt;p&gt;Welcome back!&lt;/p&gt;}
{error &amp;&amp; &lt;p className="err"&gt;{error}&lt;/p&gt;}</code></pre>
<p>To choose between two things, use a ternary:</p>
<pre><code class="language-typescript">{isLoggedIn ? &lt;Dashboard /&gt; : &lt;LoginForm /&gt;}</code></pre>

<div class="pitfall">
<p><strong>The <code>0</code> trap — the most reported React "bug" that isn't one.</strong> React skips <code>false</code>, but it does <em>not</em> skip <code>0</code> — <code>0</code> is a number, and React prints numbers. So this, when the array is empty:</p>
<pre><code class="language-typescript">{items.length &amp;&amp; &lt;List items={items} /&gt;}</code></pre>
<p>evaluates <code>0 &amp;&amp; ...</code> to <code>0</code>, and a stray <strong>0</strong> appears on your page. Verified — rendering <code>{0}</code> next to a span produces:</p>
<div class="out">&lt;div&gt;0&lt;span&gt;x&lt;/span&gt;&lt;/div&gt;</div>
<p>whereas <code>{false}</code> in the same spot produces just <code>&lt;div&gt;&lt;span&gt;x&lt;/span&gt;&lt;/div&gt;</code>. The fix is to make the left side a real boolean: <code>{items.length &gt; 0 &amp;&amp; ...}</code> or <code>{items.length ? ... : null}</code>. Any time a naked number leaks onto the screen, look for an <code>&amp;&amp;</code> with a <code>.length</code> on its left.</p>
</div>

<h3>Extracting a variable when it gets big</h3>
<p>When the condition or the branch grows, don't cram it into JSX — compute above the return:</p>
<pre><code class="language-typescript">function Feed({ posts, loading }) {
  let body;
  if (loading) body = &lt;Spinner /&gt;;
  else if (posts.length === 0) body = &lt;Empty /&gt;;
  else body = posts.map((p) =&gt; &lt;Post key={p.id} post={p} /&gt;);

  return &lt;section&gt;{body}&lt;/section&gt;;
}</code></pre>
<p>This reads far better than three nested ternaries, and it uses real <code>if</code> statements — legal here because we are above the <code>return</code>, in ordinary JavaScript, not inside the JSX.</p>
<h3>Rendering a list, correctly</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>map, not forEach</b> — &#96;map&#96; returns an array of elements; &#96;forEach&#96; returns &#96;undefined&#96; and renders nothing. This is the commonest &quot;my list is blank&quot; cause.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Return the element</b> — Inside &#96;map(item =&gt; { … })&#96; you need an explicit &#96;return&#96;. With &#96;map(item =&gt; (…))&#96; the parentheses return it for you.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Give each item a stable key</b> — From the data — an id — not from the index. The key is how React matches items between renders.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Handle the empty case</b> — An empty array renders nothing at all, which looks like a bug to a user. Show a message instead of a blank space.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — using the array index as a key in a list that can change.</strong> &#96;items.map((item, i) =&gt; &lt;Row key={i} /&gt;)&#96; is what the warning message makes people write, and it is correct only for a list that never reorders, never has items inserted, and never has items removed. Delete the first row and every remaining item&#39;s index shifts by one, so React thinks item 2 <em>became</em> item 1 rather than that item 1 was removed: it keeps the old DOM node and just updates the text. Any state living in those rows — a checked box, a half-typed input, an open menu — stays behind on the wrong row. Use an id from your data.</p></div>
<a class="link-card dl" href="https://react.dev/learn/rendering-lists" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">react.dev — Rendering lists</span><span class="lc-sub">map, keys, and why the index is usually wrong.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/preserving-and-resetting-state" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">react.dev — Preserving and resetting state</span><span class="lc-sub">What a key actually controls: whether React keeps a component's state or throws it away.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Render an array of items with <code>.map()</code>, giving each a stable <code>key</code> (not the array index); watch the console warning disappear.</li>
<li>Show one of three states with a ternary, and show-or-hide a badge with <code>&&</code>; then break it by using <code>count && ...</code> where count can be <code>0</code> and see the stray <code>0</code>.</li>
<li>Combine both: map a list and conditionally render a &quot;no items&quot; message when it is empty.</li>
</ol>
<p><strong>Done when:</strong> you can render a list with proper keys and handle conditions with ternary and <code>&&</code> without the <code>0</code> trap.</p></div>

<h3>🔬 Measured: lists and conditions (Next.js 16.4.6 · React 19.3.0)</h3>
<p>map vs forEach vs a map that forgets its return, plus the 0 trap — rendered with react-dom/server:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
const items = ['a', 'b', 'c'];
const r = (nhan, el) =&gt; console.log(nhan.padEnd(18) + renderToStaticMarkup(el));
r('map', h('ul', null, items.map((t) =&gt; h('li', { key: t }, t))));
r('forEach', h('ul', null, items.forEach((t) =&gt; h('li', { key: t }, t))));
r('map, quên return', h('ul', null, items.map((t) =&gt; { h('li', { key: t }, t); })));
r('{0}', h('div', null, 0, h('span', null, 'x')));
r('{false}', h('div', null, false, h('span', null, 'x')));</code></pre><pre><code class="language-bash">$ node ds.cjs</code></pre><div class="out">map               &lt;ul&gt;&lt;li&gt;a&lt;/li&gt;&lt;li&gt;b&lt;/li&gt;&lt;li&gt;c&lt;/li&gt;&lt;/ul&gt;
forEach           &lt;ul&gt;&lt;/ul&gt;
map, quên return  &lt;ul&gt;&lt;/ul&gt;
{0}               &lt;div&gt;0&lt;span&gt;x&lt;/span&gt;&lt;/div&gt;
{false}           &lt;div&gt;&lt;span&gt;x&lt;/span&gt;&lt;/div&gt;</div>
<p>The same two mistakes in a .tsx file — TypeScript refuses both:</p>
<pre><code class="language-tsx">const items = ['a', 'b', 'c'];

export default function DanhSach() {
  return (
    &lt;&gt;
      &lt;ul&gt;{items.forEach((t) =&gt; &lt;li key={t}&gt;{t}&lt;/li&gt;)}&lt;/ul&gt;
      &lt;ul&gt;{items.map((t) =&gt; { &lt;li key={t}&gt;{t}&lt;/li&gt;; })}&lt;/ul&gt;
    &lt;/&gt;
  );
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/map/page.tsx(6,11): error TS2322: Type 'void' is not assignable to type 'ReactNode'.
src/app/map/page.tsx(7,11): error TS2322: Type 'void[]' is not assignable to type 'ReactNode'.
  Type 'void[]' is not assignable to type 'Iterable&lt;ReactNode&gt;'.</div>
<p>A list without keys in <code>next dev</code> — the real browser console:</p>
<div class="out">Each child in a list should have a unique "key" prop. See https://react.dev/link/warning-keys for more information.
Check the render method of &#96;ThieuKey&#96;.</div>
<p>Index keys, measured in Chromium: two lists of <code>An, Bình, Chi</code> with a checkbox per row (left <code>key={i}</code>, right <code>key={p.id}</code>). Tick “An” in both, click “Xoá dòng đầu” in both, then read the checkboxes:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

const DS = [{ id: 'an', ten: 'An' }, { id: 'binh', ten: 'Bình' }, { id: 'chi', ten: 'Chi' }];

function Danh({ tieuDe, theoChiSo }: { tieuDe: string; theoChiSo: boolean }) {
  const [ds, setDs] = useState(DS);
  return (
    &lt;section className="rounded-xl border p-4"&gt;
      &lt;h2 className="mb-2 font-bold"&gt;{tieuDe}&lt;/h2&gt;
      {ds.map((p, i) =&gt; (
        &lt;label key={theoChiSo ? i : p.id} className="flex gap-2"&gt;
          &lt;input type="checkbox" /&gt; {p.ten}
        &lt;/label&gt;
      ))}
      &lt;button className="mt-2 rounded border px-2" onClick={() =&gt; setDs(ds.slice(1))}&gt;Xoá dòng đầu&lt;/button&gt;
    &lt;/section&gt;
  );
}

export default function Key() {
  return (
    &lt;div className="grid grid-cols-2 gap-4 p-5 font-sans"&gt;
      &lt;Danh tieuDe="✗ key={i}" theoChiSo /&gt;
      &lt;Danh tieuDe="✓ key={p.id}" theoChiSo={false} /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">key={i}    ⇒ Bình ☑, Chi ☐   ← the tick moved to Bình
key={p.id} ⇒ Bình ☐, Chi ☐</div>
<p>The 0 trap in a real browser: a cart page with both versions side by side, after clicking “Xoá hết” (innerHTML read back from the page):</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

const BAN_DAU = [{ id: 1, ten: 'Bàn phím' }, { id: 2, ten: 'Chuột' }, { id: 3, ten: 'Lót chuột' }];

export default function Gio() {
  const [items, setItems] = useState(BAN_DAU);
  return (
    &lt;div className="grid grid-cols-2 gap-4 p-5 font-sans"&gt;
      &lt;section id="sai" className="rounded-xl border p-4"&gt;
        &lt;h2 className="font-bold"&gt;✗ items.length &amp;amp;&amp;amp; …&lt;/h2&gt;
        {items.length &amp;&amp; &lt;ul className="list-disc pl-5"&gt;{items.map((m) =&gt; &lt;li key={m.id}&gt;{m.ten}&lt;/li&gt;)}&lt;/ul&gt;}
      &lt;/section&gt;
      &lt;section id="dung" className="rounded-xl border p-4"&gt;
        &lt;h2 className="font-bold"&gt;✓ items.length &amp;gt; 0 ? … : …&lt;/h2&gt;
        {items.length &gt; 0 ? (
          &lt;ul className="list-disc pl-5"&gt;{items.map((m) =&gt; &lt;li key={m.id}&gt;{m.ten}&lt;/li&gt;)}&lt;/ul&gt;
        ) : (
          &lt;p className="text-gray-500"&gt;Giỏ hàng trống&lt;/p&gt;
        )}
      &lt;/section&gt;
      &lt;button className="col-span-2 rounded border px-3 py-1" onClick={() =&gt; setItems([])}&gt;Xoá hết&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">#sai  ⇒ &lt;h2 class="font-bold"&gt;✗ items.length &amp;amp;&amp;amp; …&lt;/h2&gt;0
#dung ⇒ &lt;h2 class="font-bold"&gt;✓ items.length &amp;gt; 0 ? … : …&lt;/h2&gt;&lt;p class="text-gray-500"&gt;Giỏ hàng trống&lt;/p&gt;</div>
<p>The Feed pattern (if/else above return), rendered in its three states:</p>
<pre><code class="language-bash">$ node feed.cjs</code></pre><div class="out">&lt;section&gt;&lt;p&gt;Đang tải…&lt;/p&gt;&lt;/section&gt;
&lt;section&gt;&lt;p&gt;Chưa có bài nào&lt;/p&gt;&lt;/section&gt;
&lt;section&gt;&lt;article&gt;Bài 1&lt;/article&gt;&lt;article&gt;Bài 2&lt;/article&gt;&lt;/section&gt;</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># in any Next.js app</span>
node ds.cjs
node feed.cjs
<span class="tok-comment"># pages above under src/app/gio and src/app/key, then:</span>
npm run dev  <span class="tok-comment">  # open /gio, click “Xoá hết”; open /key, tick An, delete the first row</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-3-danh-sach" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.3 — Lists</span><span class="lc-sub">map, the missing-key warning, the key={index} bug captured in a real browser</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-2-fragments-conditional" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.2 — Fragments and conditional rendering</span><span class="lc-sub">The university-course view</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.map()</span><span class="v">Turn an array of data into an array of elements to render.</span></div>
  <div class="kv"><span class="k">key</span><span class="v">A stable identity per list item so React tracks it across renders.</span></div>
  <div class="kv"><span class="k">Ternary</span><span class="v"><code>cond ? a : b</code> — the expression way to choose between two outputs.</span></div>
  <div class="kv"><span class="k">Logical &&</span><span class="v"><code>cond && element</code> — render the element only when cond is truthy.</span></div>
  <div class="kv"><span class="k">The 0 trap</span><span class="v"><code>0 && ...</code> renders <code>0</code>; coerce to boolean (<code>count &gt; 0 && ...</code>).</span></div>
  <div class="kv"><span class="k">Empty state</span><span class="v">The branch you render when a list has no items.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Render lists with <code>.map()</code> and give each item a stable <code>key</code> — never the array index when the list can change.</li><li>Choose between outputs with a ternary; show-or-nothing with <code>&&</code>.</li><li>Watch the <code>&&</code> trap: a left side of <code>0</code> renders a stray <code>0</code> — coerce to boolean.</li><li>Always handle the empty-list state explicitly.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Render nhiều thứ, và render tuỳ lúc</h2>
<p class="lead">Hai khuôn mẫu bao gần hết mọi UI động: biến một mảng thành element bằng <code>.map()</code>, và chỉ hiện thứ gì đó khi một điều kiện đúng. Cả hai chỉ là biểu thức JavaScript nằm trong ngoặc nhọn.</p>

<h3>Danh sách: <code>.map()</code> một mảng thành element</h3>
<p>JSX không có cú pháp vòng lặp. Để render một danh sách, bạn biến một mảng dữ liệu thành một mảng element — và React biết cách render một mảng element:</p>
<pre><code class="language-typescript">function List() {
  const items = ['a', 'b', 'c'];
  return (
    &lt;ul&gt;
      {items.map((t, i) =&gt; &lt;li key={i}&gt;{t}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}</code></pre>
<p>Render thật qua <code>react-dom/server</code>:</p>
<div class="out">&lt;ul&gt;&lt;li&gt;a&lt;/li&gt;&lt;li&gt;b&lt;/li&gt;&lt;li&gt;c&lt;/li&gt;&lt;/ul&gt;</div>
<p>Mỗi element trong danh sách map cần một <code>key</code> — một định danh ổn định React dùng để theo dõi phần tử nào là phần tử nào qua các lần render lại. Ở đây ta dùng chỉ số <code>i</code>, ổn với danh sách tĩnh nhưng là một bug thật với danh sách có sắp xếp lại hoặc chèn/xoá phần tử. Bug đó đủ quan trọng để có riêng một phần ở Chương 7; giờ thì quy tắc là: <em>mọi <code>.map()</code> trả về element đều cần <code>key</code>, và ưu tiên một id ổn định (<code>item.id</code>) hơn chỉ số.</em></p>

<h3>Điều kiện: <code>&amp;&amp;</code> và ternary</h3>
<p>Để chỉ hiện một element khi điều kiện đúng, dùng toán tử <code>&amp;&amp;</code>. Nếu vế trái là truthy, biểu thức cho ra vế phải (element); nếu falsy, nó cho ra giá trị falsy, mà React bỏ qua:</p>
<pre><code class="language-html">{isLoggedIn &amp;&amp; &lt;p&gt;Chào bạn quay lại!&lt;/p&gt;}
{error &amp;&amp; &lt;p className="err"&gt;{error}&lt;/p&gt;}</code></pre>
<p>Để chọn giữa hai thứ, dùng ternary:</p>
<pre><code class="language-typescript">{isLoggedIn ? &lt;Dashboard /&gt; : &lt;LoginForm /&gt;}</code></pre>

<div class="pitfall">
<p><strong>Bẫy <code>0</code> — cái "bug" React bị báo nhiều nhất mà thật ra không phải bug.</strong> React bỏ qua <code>false</code>, nhưng <em>không</em> bỏ qua <code>0</code> — <code>0</code> là một số, và React in số. Vậy đoạn này, khi mảng rỗng:</p>
<pre><code class="language-typescript">{items.length &amp;&amp; &lt;List items={items} /&gt;}</code></pre>
<p>tính <code>0 &amp;&amp; ...</code> ra <code>0</code>, và một số <strong>0</strong> lạc lõng hiện lên trang. Đã kiểm — render <code>{0}</code> cạnh một span cho ra:</p>
<div class="out">&lt;div&gt;0&lt;span&gt;x&lt;/span&gt;&lt;/div&gt;</div>
<p>trong khi <code>{false}</code> ở đúng chỗ đó chỉ cho ra <code>&lt;div&gt;&lt;span&gt;x&lt;/span&gt;&lt;/div&gt;</code>. Cách sửa là làm vế trái thành boolean thật: <code>{items.length &gt; 0 &amp;&amp; ...}</code> hoặc <code>{items.length ? ... : null}</code>. Mỗi khi một con số trần lọt lên màn hình, hãy tìm một <code>&amp;&amp;</code> có <code>.length</code> ở bên trái.</p>
</div>

<h3>Tách biến khi nó phình to</h3>
<p>Khi điều kiện hoặc nhánh phình to, đừng nhồi vào JSX — tính phía trên câu return:</p>
<pre><code class="language-typescript">function Feed({ posts, loading }) {
  let body;
  if (loading) body = &lt;Spinner /&gt;;
  else if (posts.length === 0) body = &lt;Empty /&gt;;
  else body = posts.map((p) =&gt; &lt;Post key={p.id} post={p} /&gt;);

  return &lt;section&gt;{body}&lt;/section&gt;;
}</code></pre>
<p>Đoạn này dễ đọc hơn hẳn ba ternary lồng nhau, và nó dùng câu <code>if</code> thật — hợp lệ ở đây vì ta đang ở phía trên <code>return</code>, trong JavaScript bình thường, không phải bên trong JSX.</p>
<h3>Vẽ một danh sách, cho đúng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>map, đừng forEach</b> — &#96;map&#96; trả về một mảng element; &#96;forEach&#96; trả về &#96;undefined&#96; và chẳng vẽ ra gì. Đây là nguyên nhân phổ biến nhất của &quot;danh sách của tôi trống trơn&quot;.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nhớ return cái element</b> — Trong &#96;map(item =&gt; { … })&#96; bạn cần một &#96;return&#96; tường minh. Với &#96;map(item =&gt; (…))&#96; thì cặp ngoặc tròn trả về giùm bạn.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Cho mỗi phần tử một key ổn định</b> — Lấy từ dữ liệu — một id — chứ đừng lấy từ chỉ số. Key là cách React ghép các phần tử giữa hai lần render.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Xử lý trường hợp rỗng</b> — Một mảng rỗng chẳng vẽ ra gì cả, và với người dùng thì nó trông như một lỗi. Hãy hiện một thông điệp thay vì một khoảng trắng.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — dùng chỉ số mảng làm key trong một danh sách có thể thay đổi.</strong> &#96;items.map((item, i) =&gt; &lt;Row key={i} /&gt;)&#96; là thứ mà cái cảnh báo khiến người ta viết ra, và nó chỉ đúng với một danh sách không bao giờ đổi thứ tự, không bao giờ chèn thêm, và không bao giờ bị xoá bớt. Xoá dòng đầu tiên là chỉ số của mọi phần tử còn lại dịch đi một, nên React tưởng phần tử 2 đã <em>trở thành</em> phần tử 1 chứ không phải phần tử 1 bị xoá: nó giữ nguyên nút DOM cũ và chỉ cập nhật chữ. Mọi state sống trong những dòng đó — một ô đã tích, một ô nhập đang gõ dở, một menu đang mở — đều ở lại nhầm dòng. Hãy dùng một id lấy từ dữ liệu.</p></div>
<a class="link-card dl" href="https://react.dev/learn/rendering-lists" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">react.dev — Vẽ danh sách</span><span class="lc-sub">map, key, và vì sao chỉ số thường là sai.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/preserving-and-resetting-state" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">react.dev — Giữ và đặt lại state</span><span class="lc-sub">Key thật ra điều khiển cái gì: React giữ state của một component hay vứt nó đi.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Render một mảng item bằng <code>.map()</code>, cho mỗi cái một <code>key</code> ổn định (không phải chỉ số mảng); xem cảnh báo console biến mất.</li>
<li>Hiện một trong ba trạng thái bằng ternary, và hiện/ẩn một badge bằng <code>&&</code>; rồi phá nó bằng <code>count && ...</code> khi count có thể là <code>0</code> và thấy số <code>0</code> lạc lên màn hình.</li>
<li>Ghép cả hai: map một danh sách và render có điều kiện thông báo &quot;không có item&quot; khi rỗng.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn render được danh sách với key đúng và xử lý điều kiện bằng ternary và <code>&&</code> mà không dính bẫy số <code>0</code>.</p></div>

<h3>🔬 Đo thật: danh sách và điều kiện (Next.js 16.4.6 · React 19.3.0)</h3>
<p>map, forEach, và map quên return, kèm bẫy số 0 — render bằng react-dom/server:</p>
<pre><code class="language-javascript">const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const h = React.createElement;
const items = ['a', 'b', 'c'];
const r = (nhan, el) =&gt; console.log(nhan.padEnd(18) + renderToStaticMarkup(el));
r('map', h('ul', null, items.map((t) =&gt; h('li', { key: t }, t))));
r('forEach', h('ul', null, items.forEach((t) =&gt; h('li', { key: t }, t))));
r('map, quên return', h('ul', null, items.map((t) =&gt; { h('li', { key: t }, t); })));
r('{0}', h('div', null, 0, h('span', null, 'x')));
r('{false}', h('div', null, false, h('span', null, 'x')));</code></pre><pre><code class="language-bash">$ node ds.cjs</code></pre><div class="out">map               &lt;ul&gt;&lt;li&gt;a&lt;/li&gt;&lt;li&gt;b&lt;/li&gt;&lt;li&gt;c&lt;/li&gt;&lt;/ul&gt;
forEach           &lt;ul&gt;&lt;/ul&gt;
map, quên return  &lt;ul&gt;&lt;/ul&gt;
{0}               &lt;div&gt;0&lt;span&gt;x&lt;/span&gt;&lt;/div&gt;
{false}           &lt;div&gt;&lt;span&gt;x&lt;/span&gt;&lt;/div&gt;</div>
<p>Cùng hai lỗi đó trong tệp .tsx — TypeScript từ chối cả hai:</p>
<pre><code class="language-tsx">const items = ['a', 'b', 'c'];

export default function DanhSach() {
  return (
    &lt;&gt;
      &lt;ul&gt;{items.forEach((t) =&gt; &lt;li key={t}&gt;{t}&lt;/li&gt;)}&lt;/ul&gt;
      &lt;ul&gt;{items.map((t) =&gt; { &lt;li key={t}&gt;{t}&lt;/li&gt;; })}&lt;/ul&gt;
    &lt;/&gt;
  );
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/map/page.tsx(6,11): error TS2322: Type 'void' is not assignable to type 'ReactNode'.
src/app/map/page.tsx(7,11): error TS2322: Type 'void[]' is not assignable to type 'ReactNode'.
  Type 'void[]' is not assignable to type 'Iterable&lt;ReactNode&gt;'.</div>
<p>Danh sách thiếu key ở <code>next dev</code> — console thật của trình duyệt:</p>
<div class="out">Each child in a list should have a unique "key" prop. See https://react.dev/link/warning-keys for more information.
Check the render method of &#96;ThieuKey&#96;.</div>
<p>Key bằng chỉ số, đo trên Chromium: hai danh sách <code>An, Bình, Chi</code>, mỗi dòng một ô tích (trái <code>key={i}</code>, phải <code>key={p.id}</code>). Tích “An” ở cả hai, bấm “Xoá dòng đầu” ở cả hai, rồi đọc các ô tích:</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

const DS = [{ id: 'an', ten: 'An' }, { id: 'binh', ten: 'Bình' }, { id: 'chi', ten: 'Chi' }];

function Danh({ tieuDe, theoChiSo }: { tieuDe: string; theoChiSo: boolean }) {
  const [ds, setDs] = useState(DS);
  return (
    &lt;section className="rounded-xl border p-4"&gt;
      &lt;h2 className="mb-2 font-bold"&gt;{tieuDe}&lt;/h2&gt;
      {ds.map((p, i) =&gt; (
        &lt;label key={theoChiSo ? i : p.id} className="flex gap-2"&gt;
          &lt;input type="checkbox" /&gt; {p.ten}
        &lt;/label&gt;
      ))}
      &lt;button className="mt-2 rounded border px-2" onClick={() =&gt; setDs(ds.slice(1))}&gt;Xoá dòng đầu&lt;/button&gt;
    &lt;/section&gt;
  );
}

export default function Key() {
  return (
    &lt;div className="grid grid-cols-2 gap-4 p-5 font-sans"&gt;
      &lt;Danh tieuDe="✗ key={i}" theoChiSo /&gt;
      &lt;Danh tieuDe="✓ key={p.id}" theoChiSo={false} /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">key={i}    ⇒ Bình ☑, Chi ☐   ← dấu tích nhảy sang Bình
key={p.id} ⇒ Bình ☐, Chi ☐</div>
<p>Bẫy số 0 trên trình duyệt thật: trang giỏ hàng có cả hai cách cạnh nhau, sau khi bấm “Xoá hết” (innerHTML đọc lại từ trang):</p>
<pre><code class="language-tsx">'use client';
import { useState } from 'react';

const BAN_DAU = [{ id: 1, ten: 'Bàn phím' }, { id: 2, ten: 'Chuột' }, { id: 3, ten: 'Lót chuột' }];

export default function Gio() {
  const [items, setItems] = useState(BAN_DAU);
  return (
    &lt;div className="grid grid-cols-2 gap-4 p-5 font-sans"&gt;
      &lt;section id="sai" className="rounded-xl border p-4"&gt;
        &lt;h2 className="font-bold"&gt;✗ items.length &amp;amp;&amp;amp; …&lt;/h2&gt;
        {items.length &amp;&amp; &lt;ul className="list-disc pl-5"&gt;{items.map((m) =&gt; &lt;li key={m.id}&gt;{m.ten}&lt;/li&gt;)}&lt;/ul&gt;}
      &lt;/section&gt;
      &lt;section id="dung" className="rounded-xl border p-4"&gt;
        &lt;h2 className="font-bold"&gt;✓ items.length &amp;gt; 0 ? … : …&lt;/h2&gt;
        {items.length &gt; 0 ? (
          &lt;ul className="list-disc pl-5"&gt;{items.map((m) =&gt; &lt;li key={m.id}&gt;{m.ten}&lt;/li&gt;)}&lt;/ul&gt;
        ) : (
          &lt;p className="text-gray-500"&gt;Giỏ hàng trống&lt;/p&gt;
        )}
      &lt;/section&gt;
      &lt;button className="col-span-2 rounded border px-3 py-1" onClick={() =&gt; setItems([])}&gt;Xoá hết&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">#sai  ⇒ &lt;h2 class="font-bold"&gt;✗ items.length &amp;amp;&amp;amp; …&lt;/h2&gt;0
#dung ⇒ &lt;h2 class="font-bold"&gt;✓ items.length &amp;gt; 0 ? … : …&lt;/h2&gt;&lt;p class="text-gray-500"&gt;Giỏ hàng trống&lt;/p&gt;</div>
<p>Khuôn Feed (if/else phía trên return), render ở cả ba trạng thái:</p>
<pre><code class="language-bash">$ node feed.cjs</code></pre><div class="out">&lt;section&gt;&lt;p&gt;Đang tải…&lt;/p&gt;&lt;/section&gt;
&lt;section&gt;&lt;p&gt;Chưa có bài nào&lt;/p&gt;&lt;/section&gt;
&lt;section&gt;&lt;article&gt;Bài 1&lt;/article&gt;&lt;article&gt;Bài 2&lt;/article&gt;&lt;/section&gt;</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># trong dự án Next.js bất kỳ</span>
node ds.cjs
node feed.cjs
<span class="tok-comment"># đặt hai trang trên vào src/app/gio và src/app/key, rồi:</span>
npm run dev  <span class="tok-comment">  # mở /gio, bấm “Xoá hết”; mở /key, tích An, xoá dòng đầu</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-3-danh-sach" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.3 — Danh sách</span><span class="lc-sub">map, cảnh báo thiếu key, bug key={index} chụp thật trên trình duyệt</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-2-fragments-conditional" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.2 — Fragment và vẽ có điều kiện</span><span class="lc-sub">Góc nhìn môn học ở trường</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.map()</span><span class="v">Biến mảng dữ liệu thành mảng element để render.</span></div>
  <div class="kv"><span class="k">key</span><span class="v">Một danh tính ổn định cho mỗi item để React theo dõi qua các lần render.</span></div>
  <div class="kv"><span class="k">Ternary</span><span class="v"><code>cond ? a : b</code> — cách biểu thức để chọn giữa hai kết quả.</span></div>
  <div class="kv"><span class="k">Logical &&</span><span class="v"><code>cond && element</code> — chỉ render element khi cond truthy.</span></div>
  <div class="kv"><span class="k">Bẫy số 0</span><span class="v"><code>0 && ...</code> render ra <code>0</code>; ép sang boolean (<code>count &gt; 0 && ...</code>).</span></div>
  <div class="kv"><span class="k">Trạng thái rỗng</span><span class="v">Nhánh bạn render khi danh sách không có item.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Render danh sách bằng <code>.map()</code> và cho mỗi item một <code>key</code> ổn định — đừng dùng chỉ số mảng khi danh sách có thể đổi.</li><li>Chọn giữa các kết quả bằng ternary; hiện-hoặc-không bằng <code>&&</code>.</li><li>Coi chừng bẫy <code>&&</code>: vế trái là <code>0</code> sẽ render ra số <code>0</code> lạc — hãy ép sang boolean.</li><li>Luôn xử lý rõ trạng thái danh sách rỗng.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — The rules of JSX & the mental model|||1.5 — Luật của JSX & mô hình tư duy',
      slug: 'nextjs-1-5-luat-jsx',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Một gốc duy nhất (hoặc Fragment), đóng mọi thẻ, props camelCase — và tại sao mọi luật này đều suy ra từ "JSX là lời gọi hàm".',
      content: `
${G01_5}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Every JSX rule is really a JavaScript rule</h2>
<p class="lead">JSX has a short list of rules that feel arbitrary until you remember what they compile to. Once you see that a component <code>return</code>s a single expression, every rule below explains itself.</p>

<h3>1 · A component returns exactly one element</h3>
<p>A function can only <code>return</code> one value. <code>createElement</code> produces one element. So a component must return a single root:</p>
<pre><code class="language-html"><span class="tok-comment">// ❌ two siblings, no wrapper — syntax error</span>
return (
  &lt;h1&gt;Title&lt;/h1&gt;
  &lt;p&gt;Body&lt;/p&gt;
);</code></pre>
<p>Wrap them. If you want a wrapper DOM node, use a <code>&lt;div&gt;</code>. If you <em>don't</em> want an extra node in the DOM, use a <strong>Fragment</strong> — the empty tag <code>&lt;&gt;...&lt;/&gt;</code>:</p>
<pre><code class="language-html">return (
  &lt;&gt;
    &lt;h1&gt;Title&lt;/h1&gt;
    &lt;p&gt;Body&lt;/p&gt;
  &lt;/&gt;
);</code></pre>
<p>A Fragment groups children without rendering any wrapper element — it exists purely to satisfy "return one thing" without polluting your HTML with layout-breaking <code>&lt;div&gt;</code>s.</p>

<h3>2 · Close every tag</h3>
<p>HTML forgives <code>&lt;br&gt;</code> and <code>&lt;img src="..."&gt;</code> with no closing slash. JSX does not, because each tag is a function call that has to end somewhere. Self-closing tags need the slash: <code>&lt;br /&gt;</code>, <code>&lt;img src="..." /&gt;</code>, <code>&lt;input /&gt;</code>.</p>

<h3>3 · Props are camelCase (with the two renames)</h3>
<p>From Lesson 1.3: <code>className</code> not <code>class</code>, <code>htmlFor</code> not <code>for</code>, <code>onClick</code> not <code>onclick</code>, <code>tabIndex</code>, <code>readOnly</code>, and so on. The compiler passes them straight through as an object key, so they follow JavaScript identifier conventions.</p>

<h3>4 · JSX is a value — treat it like one</h3>
<p>Because an element is just an object, you can do everything with it you can do with any value: store it in a variable, put it in an array, return it from a function, pass it as a prop:</p>
<pre><code class="language-typescript">const badge = &lt;span className="badge"&gt;New&lt;/span&gt;;
const rows = data.map((d) =&gt; &lt;Row key={d.id} data={d} /&gt;);
return &lt;Header title="Feed" action={badge} /&gt;;</code></pre>
<p>This is the deepest point of the chapter: JSX is not a template language bolted onto JavaScript. It is JavaScript. The full power of the language — variables, functions, arrays, conditionals — is available because you never actually left it.</p>

<h3>The mental model to carry into Chapter 2</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">You write components — functions that return element trees describing the UI.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">JSX is sugar; it compiles to <code>createElement</code> calls that build plain objects.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">React renders your description into the DOM, and re-renders it — efficiently — whenever the data changes.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb">You describe the destination; React finds the route.</div></div>
</div>
<div class="callout ok">
<p>Next: where the "data that changes" comes from. Chapter 2 introduces <strong>props</strong> — how a parent hands data down to a child — and composition, the art of building big UIs out of small components. Then Chapter 3 gives components a memory with <strong>state</strong>, and the whole loop comes alive.</p>
</div>
<h3>The JSX rules the compiler enforces</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>One root element per return</b> — Because a function returns one value. Wrap siblings in a &#96;&lt;&gt;…&lt;/&gt;&#96; fragment when you do not want an extra div in the DOM.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Every tag closes</b> — Including &#96;&lt;img /&gt;&#96;, &#96;&lt;br /&gt;&#96; and &#96;&lt;input /&gt;&#96;, which HTML lets you leave open. JSX is XML-strict here.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Component names start uppercase</b> — &#96;&lt;card /&gt;&#96; compiles to the string &quot;card&quot; — an unknown DOM tag that renders empty. &#96;&lt;Card /&gt;&#96; compiles to the variable.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Whitespace between tags is dropped</b> — Newlines and indentation vanish. If you need a space between two elements, write &#96;{&#39; &#39;}&#96; explicitly.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a lowercase component name renders nothing, and the clues are easy to miss.</strong> &#96;&lt;userCard name={n} /&gt;&#96; does not call your function. JSX treats a lowercase tag as a DOM element name, so this compiles to &#96;createElement(&#39;userCard&#39;, …)&#96; — a custom element the browser knows nothing about, which renders as an empty node. Measured on React 19.3.0 it is not completely silent: in a <code>.tsx</code> file TypeScript refuses it (<em>TS2339 Property 'userCard' does not exist on type 'JSX.IntrinsicElements'</em>), and <code>next dev</code> prints <em>&lt;userCard /&gt; is using incorrect casing. Use PascalCase for React components…</em> — in the dev-server terminal, not the browser. In a plain <code>.jsx</code> file that terminal line is the only clue; the page just shows a gap where your component should be (the browser gets an empty <code>&lt;usercard&gt;</code>, 0×0). It usually appears after a rename or a copy-paste, and people go hunting in the component&#39;s own code. Check the capital letter first: it is the difference between a variable reference and a string.</p></div>
<a class="link-card dl" href="https://react.dev/learn/writing-markup-with-jsx#the-rules-of-jsx" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">react.dev — The rules of JSX</span><span class="lc-sub">The three hard rules, with the error each one produces.</span></span>
</a>
<a class="link-card dl" href="https://transform.tools/html-to-jsx" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">transform.tools — HTML to JSX</span><span class="lc-sub">Paste HTML from anywhere and get valid JSX back, with the attribute renames applied.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Return two sibling elements without a wrapper and read the error; fix it with a <code>&lt;div&gt;</code> and then with a Fragment <code>&lt;&gt;...&lt;/&gt;</code>.</li>
<li>Rename HTML attributes to their JSX form: <code>class</code> → <code>className</code>, <code>for</code> → <code>htmlFor</code>, <code>onclick</code> → <code>onClick</code>, and self-close an <code>&lt;img /&gt;</code>.</li>
<li>Write one component that violates three JSX rules on purpose, then fix each and note which error message pointed at which rule.</li>
</ol>
<p><strong>Done when:</strong> you can state the core JSX rules and fix each from its error message.</p></div>

<h3>🔬 Measured: each rule and the error it produces (Next.js 16.4.6 · React 19.3.0)</h3>
<p>Rule 1 — two siblings with no wrapper. TypeScript is clear; the SWC parser of <code>next build</code> reads the slash of <code>&lt;/p&gt;</code> as a regex:</p>
<pre><code class="language-tsx">export default function AnhEm() {
  return (
    &lt;h1&gt;Title&lt;/h1&gt;
    &lt;p&gt;Body&lt;/p&gt;
  );
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/anhem/page.tsx(3,5): error TS2657: JSX expressions must have one parent element.</div><pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -A12 'Build error'</code></pre><div class="out">&gt; Build error occurred
Error: Turbopack build failed with 1 error:
./src/app/anhem/page.tsx:4:13
Error: Unterminated regexp literal
  2 |   return (
  3 |     &lt;h1&gt;Title&lt;/h1&gt;
&gt; 4 |     &lt;p&gt;Body&lt;/p&gt;
    |             ^^^
  5 |   );
  6 | }
  7 |

Parsing ecmascript source code failed</div>
<p>div vs Fragment, rendered with react-dom/server — the Fragment leaves no node behind:</p>
<pre><code class="language-bash">$ node frag.cjs</code></pre><div class="out">&lt;div&gt;      &lt;div&gt;&lt;h1&gt;Title&lt;/h1&gt;&lt;p&gt;Body&lt;/p&gt;&lt;/div&gt;
&lt;&gt;…&lt;/&gt;     &lt;h1&gt;Title&lt;/h1&gt;&lt;p&gt;Body&lt;/p&gt;</div>
<p>Rule 2 — <code>&lt;br&gt;</code> and <code>&lt;img&gt;</code> left open: one mistake, five errors:</p>
<pre><code class="language-tsx">export default function Dong() {
  return (
    &lt;div&gt;
      Dòng một&lt;br&gt;
      &lt;img src="/next.svg" alt="logo"&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/dong/page.tsx(3,6): error TS17008: JSX element 'div' has no corresponding closing tag.
src/app/dong/page.tsx(4,16): error TS17008: JSX element 'br' has no corresponding closing tag.
src/app/dong/page.tsx(6,7): error TS17002: Expected corresponding JSX closing tag for 'img'.
src/app/dong/page.tsx(8,1): error TS1381: Unexpected token. Did you mean &#96;{'}'}&#96; or &#96;&amp;rbrace;&#96;?
src/app/dong/page.tsx(9,1): error TS1005: '&lt;/' expected.</div>
<p>Rule 4 — whitespace: the real server HTML of two paragraphs, without and with <code>{' '}</code>:</p>
<pre><code class="language-tsx">export default function Khoang() {
  return (
    &lt;div className="space-y-3 p-6 font-sans text-2xl"&gt;
      &lt;p id="mot"&gt;
        &lt;b&gt;Xin&lt;/b&gt;
        &lt;i&gt;chào&lt;/i&gt;
      &lt;/p&gt;
      &lt;p id="hai"&gt;
        &lt;b&gt;Xin&lt;/b&gt;{' '}
        &lt;i&gt;chào&lt;/i&gt;
      &lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-bash">$ curl -s localhost:3000/khoang | grep -oE '&lt;p id="(mot|hai)"&gt;.*?&lt;/p&gt;'</code></pre><div class="out">&lt;p id="mot"&gt;&lt;b&gt;Xin&lt;/b&gt;&lt;i&gt;chào&lt;/i&gt;&lt;/p&gt;
&lt;p id="hai"&gt;&lt;b&gt;Xin&lt;/b&gt; &lt;i&gt;chào&lt;/i&gt;&lt;/p&gt;</div>
<p>The lowercase trap — TypeScript, the dev-server terminal, and what the browser actually received:</p>
<pre><code class="language-tsx">'use client';
function userCard({ name }: { name: string }) {
  return &lt;p className="rounded border p-3"&gt;Thẻ của {name}&lt;/p&gt;;
}

export default function Thuong() {
  return (
    &lt;div className="p-6 font-sans"&gt;
      &lt;h2 className="text-xl font-bold"&gt;Danh sách&lt;/h2&gt;
      &lt;userCard name="An" /&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/thuong/page.tsx(10,7): error TS2339: Property 'userCard' does not exist on type 'JSX.IntrinsicElements'.</div><div class="out"># next dev terminal
&lt;userCard /&gt; is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.</div><div class="out"># innerHTML in Chromium
&lt;h2 class="text-xl font-bold"&gt;Danh sách&lt;/h2&gt;&lt;usercard name="An"&gt;&lt;/usercard&gt;</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># put each broken page under src/app/&lt;name&gt;/page.tsx, then:</span>
npx tsc --noEmit
npm run build
node frag.cjs
npm run dev  <span class="tok-comment">  # watch the terminal for the casing warning</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-2-jsx" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 0.2 — JSX, explained</span><span class="lc-sub">Four JSX rules, each with the real tsc error</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-1-jsx-basics" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.1 — JSX basics</span><span class="lc-sub">The university-course view</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-2-fragments-conditional" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.2 — Fragments and conditional rendering</span><span class="lc-sub">Fragments in the university course</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Single root</span><span class="v">A component must return one root element (use a Fragment to avoid an extra div).</span></div>
  <div class="kv"><span class="k">className</span><span class="v">JSX uses <code>className</code>, not <code>class</code> (a reserved word in JS).</span></div>
  <div class="kv"><span class="k">htmlFor</span><span class="v">JSX uses <code>htmlFor</code> instead of the HTML <code>for</code> attribute.</span></div>
  <div class="kv"><span class="k">camelCase events</span><span class="v"><code>onClick</code>, <code>onChange</code> — event props are camelCased.</span></div>
  <div class="kv"><span class="k">Self-closing</span><span class="v">Void tags must close: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code>.</span></div>
  <div class="kv"><span class="k">Mental model</span><span class="v">JSX is JS, so attributes map to object props — HTML names change to valid JS names.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A component returns a single root — wrap siblings in a Fragment to avoid an extra DOM node.</li><li>HTML names become JS-safe: <code>class</code> → <code>className</code>, <code>for</code> → <code>htmlFor</code>, events are camelCased.</li><li>Void elements self-close (<code>&lt;img /&gt;</code>).</li><li>The rules all follow from one fact: JSX is JavaScript, and attributes are object properties.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Mọi luật của JSX thật ra là một luật của JavaScript</h2>
<p class="lead">JSX có một danh sách luật ngắn, nghe tuỳ tiện cho tới khi bạn nhớ chúng biên dịch ra gì. Một khi thấy rằng component <code>return</code> một biểu thức duy nhất, mọi luật dưới đây tự giải thích chính nó.</p>

<h3>1 · Một component trả về đúng một element</h3>
<p>Một hàm chỉ <code>return</code> được một giá trị. <code>createElement</code> tạo ra một element. Nên một component phải trả về một gốc duy nhất:</p>
<pre><code class="language-html"><span class="tok-comment">// ❌ hai anh em, không bọc — lỗi cú pháp</span>
return (
  &lt;h1&gt;Title&lt;/h1&gt;
  &lt;p&gt;Body&lt;/p&gt;
);</code></pre>
<p>Hãy bọc lại. Nếu bạn muốn một nút DOM bao ngoài, dùng <code>&lt;div&gt;</code>. Nếu bạn <em>không</em> muốn thêm một nút vào DOM, dùng <strong>Fragment</strong> — thẻ rỗng <code>&lt;&gt;...&lt;/&gt;</code>:</p>
<pre><code class="language-html">return (
  &lt;&gt;
    &lt;h1&gt;Title&lt;/h1&gt;
    &lt;p&gt;Body&lt;/p&gt;
  &lt;/&gt;
);</code></pre>
<p>Fragment gom các con lại mà không render bất kỳ phần tử bao nào — nó tồn tại thuần tuý để thoả "trả về một thứ" mà không làm bẩn HTML của bạn bằng những <code>&lt;div&gt;</code> phá vỡ layout.</p>

<h3>2 · Đóng mọi thẻ</h3>
<p>HTML tha thứ cho <code>&lt;br&gt;</code> và <code>&lt;img src="..."&gt;</code> không có dấu đóng. JSX thì không, vì mỗi thẻ là một lời gọi hàm phải kết thúc ở đâu đó. Thẻ tự đóng cần dấu gạch: <code>&lt;br /&gt;</code>, <code>&lt;img src="..." /&gt;</code>, <code>&lt;input /&gt;</code>.</p>

<h3>3 · Props viết camelCase (với hai chỗ đổi tên)</h3>
<p>Từ Bài 1.3: <code>className</code> chứ không phải <code>class</code>, <code>htmlFor</code> chứ không phải <code>for</code>, <code>onClick</code> chứ không phải <code>onclick</code>, <code>tabIndex</code>, <code>readOnly</code>, v.v. Trình biên dịch truyền chúng thẳng qua thành khoá của một object, nên chúng theo quy ước định danh của JavaScript.</p>

<h3>4 · JSX là một giá trị — hãy đối xử với nó như vậy</h3>
<p>Vì một element chỉ là một object, bạn làm được với nó mọi thứ làm được với bất kỳ giá trị nào: lưu vào biến, bỏ vào mảng, trả về từ một hàm, truyền làm prop:</p>
<pre><code class="language-typescript">const badge = &lt;span className="badge"&gt;New&lt;/span&gt;;
const rows = data.map((d) =&gt; &lt;Row key={d.id} data={d} /&gt;);
return &lt;Header title="Feed" action={badge} /&gt;;</code></pre>
<p>Đây là ý sâu nhất của chương: JSX không phải một ngôn ngữ template gắn thêm vào JavaScript. Nó LÀ JavaScript. Toàn bộ sức mạnh của ngôn ngữ — biến, hàm, mảng, điều kiện — đều dùng được vì bạn chưa từng rời khỏi nó.</p>

<h3>Mô hình tư duy mang sang Chương 2</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Bạn viết component — hàm trả về cây element mô tả giao diện.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">JSX là đường cú pháp; nó biên dịch thành lời gọi <code>createElement</code> dựng object thuần.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">React render mô tả của bạn vào DOM, và render lại — hiệu quả — mỗi khi dữ liệu đổi.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb">Bạn mô tả đích đến; React tìm lộ trình.</div></div>
</div>
<div class="callout ok">
<p>Tiếp theo: "dữ liệu có thể đổi" đến từ đâu. Chương 2 giới thiệu <strong>props</strong> — cách cha trao dữ liệu xuống con — và cách ghép, nghệ thuật dựng UI to từ những component nhỏ. Rồi Chương 3 cho component một trí nhớ bằng <strong>state</strong>, và cả vòng lặp sống dậy.</p>
</div>
<h3>Những luật JSX mà trình biên dịch cưỡng chế</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Mỗi lần return một phần tử gốc</b> — Vì một hàm trả về một giá trị. Hãy bọc các phần tử anh em trong một fragment &#96;&lt;&gt;…&lt;/&gt;&#96; khi bạn không muốn thêm một div thừa vào DOM.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Thẻ nào cũng phải đóng</b> — Kể cả &#96;&lt;img /&gt;&#96;, &#96;&lt;br /&gt;&#96; và &#96;&lt;input /&gt;&#96;, những thẻ mà HTML cho phép bỏ ngỏ. JSX ở đây nghiêm ngặt kiểu XML.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Tên component viết hoa chữ đầu</b> — &#96;&lt;card /&gt;&#96; biên dịch thành chuỗi &quot;card&quot; — một thẻ DOM lạ, vẽ ra rỗng. &#96;&lt;Card /&gt;&#96; mới biên dịch thành cái biến.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Khoảng trắng giữa các thẻ bị bỏ</b> — Xuống dòng và thụt lề biến mất. Nếu bạn cần một dấu cách giữa hai phần tử, hãy viết &#96;{&#39; &#39;}&#96; tường minh.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tên component viết thường thì chẳng vẽ ra gì, và manh mối rất dễ bỏ lỡ.</strong> &#96;&lt;userCard name={n} /&gt;&#96; không hề gọi hàm của bạn. JSX coi một thẻ viết thường là tên một phần tử DOM, nên nó biên dịch thành &#96;createElement(&#39;userCard&#39;, …)&#96; — một thẻ tuỳ chỉnh mà trình duyệt chẳng biết là gì, và nó vẽ ra một nút rỗng. Đo trên React 19.3.0 thì nó không hoàn toàn im lặng: trong tệp <code>.tsx</code>, TypeScript từ chối (<em>TS2339 Property 'userCard' does not exist on type 'JSX.IntrinsicElements'</em>), và <code>next dev</code> in <em>&lt;userCard /&gt; is using incorrect casing. Use PascalCase for React components…</em> — ở terminal của máy chủ dev, không phải trình duyệt. Với tệp <code>.jsx</code> thường, dòng terminal đó là manh mối duy nhất; trang chỉ có một khoảng trống ở đúng chỗ component lẽ ra phải nằm (trình duyệt nhận một thẻ <code>&lt;usercard&gt;</code> rỗng, 0×0). Nó thường xuất hiện sau một lần đổi tên hay chép-dán, và người ta lao đi lùng trong chính mã của component. Hãy kiểm chữ hoa đầu tiên trước: đó là khác biệt giữa một tham chiếu biến và một chuỗi.</p></div>
<a class="link-card dl" href="https://react.dev/learn/writing-markup-with-jsx#the-rules-of-jsx" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">react.dev — Các luật của JSX</span><span class="lc-sub">Ba luật cứng, kèm lỗi mà mỗi cái sinh ra.</span></span>
</a>
<a class="link-card dl" href="https://transform.tools/html-to-jsx" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">transform.tools — HTML sang JSX</span><span class="lc-sub">Dán HTML từ bất cứ đâu và nhận lại JSX hợp lệ, đã đổi sẵn tên thuộc tính.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trả về hai element anh em không có vỏ bọc và đọc lỗi; sửa bằng một <code>&lt;div&gt;</code> rồi bằng Fragment <code>&lt;&gt;...&lt;/&gt;</code>.</li>
<li>Đổi tên thuộc tính HTML sang dạng JSX: <code>class</code> → <code>className</code>, <code>for</code> → <code>htmlFor</code>, <code>onclick</code> → <code>onClick</code>, và tự đóng một <code>&lt;img /&gt;</code>.</li>
<li>Viết một component cố tình vi phạm ba luật JSX, rồi sửa từng cái và ghi lại lỗi nào chỉ vào luật nào.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được các luật JSX cốt lõi và sửa từng cái dựa trên thông báo lỗi.</p></div>

<h3>🔬 Đo thật: mỗi luật và lỗi nó sinh ra (Next.js 16.4.6 · React 19.3.0)</h3>
<p>Luật 1 — hai anh em không vỏ bọc. TypeScript nói rõ; trình phân tích SWC của <code>next build</code> đọc dấu gạch của <code>&lt;/p&gt;</code> thành biểu thức chính quy:</p>
<pre><code class="language-tsx">export default function AnhEm() {
  return (
    &lt;h1&gt;Title&lt;/h1&gt;
    &lt;p&gt;Body&lt;/p&gt;
  );
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/anhem/page.tsx(3,5): error TS2657: JSX expressions must have one parent element.</div><pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -A12 'Build error'</code></pre><div class="out">&gt; Build error occurred
Error: Turbopack build failed with 1 error:
./src/app/anhem/page.tsx:4:13
Error: Unterminated regexp literal
  2 |   return (
  3 |     &lt;h1&gt;Title&lt;/h1&gt;
&gt; 4 |     &lt;p&gt;Body&lt;/p&gt;
    |             ^^^
  5 |   );
  6 | }
  7 |

Parsing ecmascript source code failed</div>
<p>div và Fragment, render bằng react-dom/server — Fragment không để lại nút nào:</p>
<pre><code class="language-bash">$ node frag.cjs</code></pre><div class="out">&lt;div&gt;      &lt;div&gt;&lt;h1&gt;Title&lt;/h1&gt;&lt;p&gt;Body&lt;/p&gt;&lt;/div&gt;
&lt;&gt;…&lt;/&gt;     &lt;h1&gt;Title&lt;/h1&gt;&lt;p&gt;Body&lt;/p&gt;</div>
<p>Luật 2 — <code>&lt;br&gt;</code> và <code>&lt;img&gt;</code> không đóng: một lỗi, năm thông báo:</p>
<pre><code class="language-tsx">export default function Dong() {
  return (
    &lt;div&gt;
      Dòng một&lt;br&gt;
      &lt;img src="/next.svg" alt="logo"&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/dong/page.tsx(3,6): error TS17008: JSX element 'div' has no corresponding closing tag.
src/app/dong/page.tsx(4,16): error TS17008: JSX element 'br' has no corresponding closing tag.
src/app/dong/page.tsx(6,7): error TS17002: Expected corresponding JSX closing tag for 'img'.
src/app/dong/page.tsx(8,1): error TS1381: Unexpected token. Did you mean &#96;{'}'}&#96; or &#96;&amp;rbrace;&#96;?
src/app/dong/page.tsx(9,1): error TS1005: '&lt;/' expected.</div>
<p>Luật 4 — khoảng trắng: HTML thật máy chủ trả về cho hai đoạn, không có và có <code>{' '}</code>:</p>
<pre><code class="language-tsx">export default function Khoang() {
  return (
    &lt;div className="space-y-3 p-6 font-sans text-2xl"&gt;
      &lt;p id="mot"&gt;
        &lt;b&gt;Xin&lt;/b&gt;
        &lt;i&gt;chào&lt;/i&gt;
      &lt;/p&gt;
      &lt;p id="hai"&gt;
        &lt;b&gt;Xin&lt;/b&gt;{' '}
        &lt;i&gt;chào&lt;/i&gt;
      &lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-bash">$ curl -s localhost:3000/khoang | grep -oE '&lt;p id="(mot|hai)"&gt;.*?&lt;/p&gt;'</code></pre><div class="out">&lt;p id="mot"&gt;&lt;b&gt;Xin&lt;/b&gt;&lt;i&gt;chào&lt;/i&gt;&lt;/p&gt;
&lt;p id="hai"&gt;&lt;b&gt;Xin&lt;/b&gt; &lt;i&gt;chào&lt;/i&gt;&lt;/p&gt;</div>
<p>Bẫy chữ thường — TypeScript, terminal máy chủ dev, và thứ trình duyệt thật sự nhận được:</p>
<pre><code class="language-tsx">'use client';
function userCard({ name }: { name: string }) {
  return &lt;p className="rounded border p-3"&gt;Thẻ của {name}&lt;/p&gt;;
}

export default function Thuong() {
  return (
    &lt;div className="p-6 font-sans"&gt;
      &lt;h2 className="text-xl font-bold"&gt;Danh sách&lt;/h2&gt;
      &lt;userCard name="An" /&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/thuong/page.tsx(10,7): error TS2339: Property 'userCard' does not exist on type 'JSX.IntrinsicElements'.</div><div class="out"># terminal của next dev
&lt;userCard /&gt; is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.</div><div class="out"># innerHTML trên Chromium
&lt;h2 class="text-xl font-bold"&gt;Danh sách&lt;/h2&gt;&lt;usercard name="An"&gt;&lt;/usercard&gt;</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># đặt từng trang lỗi vào src/app/&lt;tên&gt;/page.tsx, rồi:</span>
npx tsc --noEmit
npm run build
node frag.cjs
npm run dev  <span class="tok-comment">  # xem terminal: cảnh báo casing</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-2-jsx" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 0.2 — JSX, giải thích cho rõ</span><span class="lc-sub">Bốn luật JSX, mỗi luật kèm lỗi tsc thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-1-jsx-basics" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.1 — JSX cơ bản</span><span class="lc-sub">Góc nhìn môn học ở trường</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-2-fragments-conditional" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 3.2 — Fragment và vẽ có điều kiện</span><span class="lc-sub">Fragment trong môn học ở trường</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Một gốc duy nhất</span><span class="v">Component phải trả về một element gốc (dùng Fragment để khỏi thêm div thừa).</span></div>
  <div class="kv"><span class="k">className</span><span class="v">JSX dùng <code>className</code>, không phải <code>class</code> (từ khoá trong JS).</span></div>
  <div class="kv"><span class="k">htmlFor</span><span class="v">JSX dùng <code>htmlFor</code> thay cho thuộc tính HTML <code>for</code>.</span></div>
  <div class="kv"><span class="k">Sự kiện camelCase</span><span class="v"><code>onClick</code>, <code>onChange</code> — prop sự kiện viết camelCase.</span></div>
  <div class="kv"><span class="k">Tự đóng thẻ</span><span class="v">Thẻ rỗng phải đóng: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code>.</span></div>
  <div class="kv"><span class="k">Mô hình tư duy</span><span class="v">JSX là JS, nên thuộc tính ánh xạ sang prop của object — tên HTML đổi thành tên JS hợp lệ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Component trả về một gốc duy nhất — bọc các anh em trong Fragment để khỏi thêm node DOM thừa.</li><li>Tên HTML đổi thành tên JS hợp lệ: <code>class</code> → <code>className</code>, <code>for</code> → <code>htmlFor</code>, sự kiện viết camelCase.</li><li>Thẻ rỗng tự đóng (<code>&lt;img /&gt;</code>).</li><li>Mọi luật đều ra từ một sự thật: JSX là JavaScript, và thuộc tính là property của object.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 1.6 quiz ─────────────────────────── */
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra chương 1',
      slug: 'nextjs-1-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về JSX, element, biểu thức trong ngoặc, danh sách, điều kiện và bẫy số 0.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 1: what JSX compiles to, why an element is a plain object, what goes inside the curly braces, rendering lists and conditionals, and the number-<code>0</code> trap. Read each snippet as code, not as a guess.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 1: JSX biên dịch ra gì, vì sao một element là object thuần, cái gì vào được trong ngoặc nhọn, render danh sách và điều kiện, và bẫy số <code>0</code>. Hãy đọc mỗi đoạn như đọc code, đừng đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does the JSX <h1 className="t">Hi</h1> compile to?|||JSX <h1 className="t">Hi</h1> biên dịch ra gì?',
            options: [
              'A string of HTML "<h1 class=\'t\'>Hi</h1>"|||Một chuỗi HTML "<h1 class=\'t\'>Hi</h1>"',
              'A real DOM node created immediately|||Một nút DOM thật được tạo ngay lập tức',
              'React.createElement(\'h1\', { className: \'t\' }, \'Hi\')|||React.createElement(\'h1\', { className: \'t\' }, \'Hi\')',
              'Nothing — JSX runs as-is in the browser|||Không gì cả — JSX chạy nguyên trạng trong trình duyệt',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A React element returned by createElement is fundamentally a…|||Một React element do createElement trả về về cơ bản là một…',
            options: [
              'plain JavaScript object describing the UI|||object JavaScript thuần mô tả giao diện',
              'DOM node attached to the document|||nút DOM đã gắn vào tài liệu',
              'string of HTML|||chuỗi HTML',
              'CSS rule|||luật CSS',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why must a component name be capitalised, e.g. <Greeting /> not <greeting />?|||Vì sao tên component phải viết hoa, vd <Greeting /> chứ không <greeting />?',
            options: [
              'It is only a style convention with no effect|||Chỉ là quy ước thẩm mỹ, không ảnh hưởng gì',
              'Lowercase compiles to a string DOM tag; capitalised compiles to your component function|||Chữ thường biên dịch thành thẻ DOM dạng chuỗi; chữ hoa biên dịch thành hàm component của bạn',
              'Lowercase is faster|||Chữ thường chạy nhanh hơn',
              'React requires all identifiers to be uppercase|||React yêu cầu mọi định danh phải viết hoa',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which can you NOT put directly inside JSX curly braces { }?|||Cái nào bạn KHÔNG thể đặt trực tiếp trong ngoặc nhọn JSX { }?',
            options: [
              'A function call like user.name.toUpperCase()|||Một lời gọi hàm như user.name.toUpperCase()',
              'A ternary like x ? a : b|||Một ternary như x ? a : b',
              'An if statement like if (x) {...}|||Một câu if như if (x) {...}',
              'A variable like count|||Một biến như count',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'What does React render for the expression {false} inside JSX?|||React render gì cho biểu thức {false} bên trong JSX?',
            options: [
              'The text "false"|||Chữ "false"',
              'Nothing — it is skipped|||Không gì cả — bị bỏ qua',
              'An empty <span>|||Một <span> rỗng',
              'It throws an error|||Nó ném lỗi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The list is empty. What appears on screen for {items.length && <List/>} when items = []?|||Danh sách rỗng. Cái gì hiện trên màn hình với {items.length && <List/>} khi items = []?',
            options: [
              'Nothing|||Không gì cả',
              'The <List/> component|||Component <List/>',
              'A stray 0|||Một số 0 lạc lõng',
              'The text "false"|||Chữ "false"',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'What is the correct fix for the 0 trap above?|||Cách sửa đúng cho bẫy số 0 phía trên là gì?',
            options: [
              'Wrap it in a try/catch|||Bọc trong try/catch',
              'Use {items.length > 0 && <List/>} or a ternary|||Dùng {items.length > 0 && <List/>} hoặc một ternary',
              'Add a key prop|||Thêm prop key',
              'Move it out of the return|||Đưa nó ra ngoài câu return',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does every element in a .map() need a key?|||Vì sao mỗi element trong một .map() cần một key?',
            options: [
              'To style the list items|||Để tạo kiểu cho các mục danh sách',
              'It is a stable identifier React uses to track which item is which across re-renders|||Nó là định danh ổn định React dùng để theo dõi phần tử nào là phần tử nào qua các lần render lại',
              'To sort the list automatically|||Để tự sắp xếp danh sách',
              'Keys are optional and only silence a warning|||Key là tuỳ chọn, chỉ để tắt một cảnh báo',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A component needs to return an <h1> and a <p> as siblings with NO extra DOM wrapper. What do you use?|||Một component cần trả về một <h1> và một <p> làm anh em mà KHÔNG thêm nút DOM bao ngoài. Bạn dùng gì?',
            options: [
              'A <div> wrapper|||Một <div> bao ngoài',
              'A Fragment <>...</>|||Một Fragment <>...</>',
              'Two separate return statements|||Hai câu return riêng',
              'An array without keys|||Một mảng không có key',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which statement best captures React being "declarative"?|||Câu nào nắm đúng nhất việc React là "khai báo"?',
            options: [
              'You issue step-by-step DOM instructions to update the screen|||Bạn ra chỉ thị DOM từng bước để cập nhật màn hình',
              'You describe what the UI should be for the current state; React computes the DOM changes|||Bạn mô tả giao diện NÊN là gì với state hiện tại; React tính ra các thay đổi DOM',
              'You write HTML files and React serves them|||Bạn viết file HTML và React phục vụ chúng',
              'You must manually keep the data and the DOM in sync|||Bạn phải tự tay giữ dữ liệu và DOM đồng bộ',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
