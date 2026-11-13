/**
 * Next.js & React — Chương 5: useEffect & đồng bộ với bên ngoài.
 * Song ngữ EN/VI. Escape: backtick→&#96;, `${`→\${, < >→&lt; &gt; trong code.
 * Output effect đã CHẠY THẬT (react-dom/client + act, scratchpad/nextjs-verify/c5.mjs):
 *   - vòng đời deps/cleanup: ["effect 1","cleanup 1","effect 2","cleanup 2"]
 *   - StrictMode dev mount: ["run","clean","run"]  (effect chạy hai lần ở dev)
 */

import G05_1 from './giang/nxj-05-1.mjs';
import G05_2 from './giang/nxj-05-2.mjs';
import G05_3 from './giang/nxj-05-3.mjs';
import G05_4 from './giang/nxj-05-4.mjs';
import G05_5 from './giang/nxj-05-5.mjs';
export default {
  title: 'Chapter 5 — useEffect: synchronising with the outside world|||Chương 5 — useEffect: đồng bộ với bên ngoài',
  description: 'Effect chạy SAU render để đồng bộ component với thứ bên ngoài React. Mảng phụ thuộc, hàm dọn dẹp, chạy hai lần ở dev, đua fetch, và những effect bạn KHÔNG nên viết.',
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — What an effect is, and when it runs|||5.1 — Effect là gì, và chạy khi nào',
      slug: 'nextjs-5-1-effect-la-gi',
      type: 'VIDEO',
      isFreePreview: false,
      // Video: "Mastering React's useEffect".
      video: { url: 'https://youtu.be/dH6i3GurZW8', durationSeconds: 0 },
      description: 'Effect là chỗ để đồng bộ component với hệ thống bên ngoài React — sau khi render đã lên màn hình. Render vẫn thuần; effect mới có tác dụng phụ.',
      content: `
${G05_1}
<div class="ml-en">
<div class="callout ok"><strong>Already took the React course?</strong> This chapter is a quick React refresher &mdash; the same topic is taught in depth in the <a href="/courses/react">React</a> course (Chapter 4). Skim it or skip ahead to <strong>Chapter 8</strong>, where the Next.js-specific material starts. Remember: Next.js is a <em>framework built on React</em> &mdash; every component, prop, state and hook here is still plain React.</div>
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Effects reach outside React — after the render</h2>
<p class="lead">Chapter 2 said render must be pure: no side effects during render. But real apps must talk to the outside world — a browser API, a subscription, a timer, sometimes the network. <code>useEffect</code> is the sanctioned place for that. It runs your code <em>after</em> React has rendered and committed to the DOM, not during.</p>

<h3>What "synchronise with an external system" means</h3>
<p>An effect exists to keep something <em>outside</em> React in step with your component's state. The React docs frame it exactly this way — an effect synchronises with an external system:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Good uses of an effect</span><span class="v">Subscribe to a WebSocket or an event; start/stop a timer; manually control a non-React widget (a map, a chart); set the document title; connect to a browser API.</span></div>
  <div class="kv"><span class="k">NOT effects</span><span class="v">Transforming data for render (do it during render); responding to a click (do it in the handler); deriving state from props. Lesson 5.4 is entirely about these.</span></div>
</div>

<h3>The shape</h3>
<pre><code class="language-javascript">import { useEffect } from 'react';

function ChatRoom({ roomId }) {
  useEffect(() =&gt; {
    const conn = createConnection(roomId);   <span class="tok-comment">// side effect: open a connection</span>
    conn.connect();
    return () =&gt; conn.disconnect();           <span class="tok-comment">// cleanup: close it</span>
  }, [roomId]);                               <span class="tok-comment">// dependencies</span>

  return &lt;h1&gt;Welcome to {roomId}&lt;/h1&gt;;
}</code></pre>
<p>Three parts, each with a job: the <strong>setup function</strong> (runs the effect), the optional <strong>cleanup function</strong> it returns (undoes the effect), and the <strong>dependency array</strong> (decides when to re-run). The next lesson takes the last two apart; here, just fix the timing in your head.</p>

<h3>When exactly does it run?</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">React renders your component (calls the function, builds the element tree).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">React commits the changes to the real DOM — the screen updates.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Then</b> React runs your effects. The DOM is already updated; whether the browser has painted it yet is not guaranteed (measured below).</div></div>
</div>
<p>This ordering is the whole point: an effect cannot decide what the UI looks like — by the time it runs, the DOM already holds the new UI. "Effects run after paint" is the usual case, not a promise: on a Next.js page the first paint is the server HTML, long before any effect, but in the measurement below an effect caused by a click — and even one caused by a timer — ran <em>before</em> the browser painted, so a slow effect froze the screen for its whole duration. If you find yourself wanting an effect to change what renders, that logic almost always belongs in render itself or in an event handler.</p>

<div class="callout warn">
<p><strong>The dependency array is not optional flavour — it changes behaviour completely.</strong> <code>useEffect(fn, [x])</code> re-runs when <code>x</code> changes. <code>useEffect(fn, [])</code> runs once after the first render. <code>useEffect(fn)</code> with <em>no</em> array runs after <em>every</em> render — usually a bug, and a classic cause of infinite loops when the effect also sets state. Next lesson makes the three cases precise.</p>
</div>

<h3>When an effect is the right tool — and when it is not</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Rendering must be pure</b> — A component computes JSX from props and state. Anything that touches the world outside — a subscription, a timer, a DOM measurement — cannot happen during that computation.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>An effect runs after commit</b> — React finishes rendering and updates the DOM, then your effect runs. On a Next.js page the first paint is the server HTML, so an effect never blocks it; for later updates, a slow effect can delay the paint (measured below).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It is for synchronising with something external</b> — A WebSocket, an event listener on <code>window</code>, a third-party widget, a browser API. &quot;External&quot; is the test.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Not for reacting to your own state</b> — Transforming data, resetting a field when a prop changes, updating state from other state — all of those belong in render or in the event handler.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — using an effect to derive one piece of state from another.</strong> <code>useEffect(() =&gt; { setFullName(first + &#39; &#39; + last) }, [first, last])</code> works, and it costs you a second render every time either field changes: React renders with the stale name, paints it, runs the effect, sets state, renders again. That intermediate frame really reaches the screen — measured below on an ordinary machine, not only on a slow device. It also creates a second source of truth that can drift the moment someone sets <code>fullName</code> from somewhere else. Compute it during render instead — <code>const fullName = first + &#39; &#39; + last</code> — which is always correct and costs nothing.</p></div>
<a class="link-card dl" href="https://react.dev/learn/synchronizing-with-effects" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">react.dev — Synchronizing with Effects</span><span class="lc-sub">What effects are actually for, with the lifecycle drawn out.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">react.dev — You Might Not Need an Effect</span><span class="lc-sub">Six common effects that should not exist, each with the replacement.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add a <code>useEffect</code> that sets <code>document.title</code> from state; watch it run after the render paints.</li>
<li>Add a <code>console.log</code> inside the effect and another in the component body, and note the order.</li>
<li>Describe one thing that belongs in an effect (syncing with something outside React) and one that does not (computing a value for render).</li>
</ol>
<p><strong>Done when:</strong> you can write a basic effect and explain that it runs after render, for syncing with the outside world.</p></div>

<h3>🔬 Measured: when an effect really runs (React 19.3.0 · Next.js 16.4.6)</h3>
<p>One page with four components: the order of render and effect, an effect that busy-waits 300 ms, and a full name derived in an effect versus computed in render:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

function ThuTu() {
  const [n, setN] = useState(0);
  console.log(&#96;render n=\${n}&#96;);
  useEffect(() =&gt; {
    const dom = document.getElementById('so')!.textContent;
    console.log(&#96;effect n=\${n} · DOM đang hiện \${dom}&#96;);
    document.title = &#96;Đã bấm \${n} lần&#96;;            <span class="tok-comment">  // đồng bộ một thứ NGOÀI React</span>
  }, [n]);
  return (
    &lt;p&gt;Đã bấm &lt;b id="so"&gt;{n}&lt;/b&gt; lần{' '}
      &lt;button id="bam" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;+1&lt;/button&gt;
    &lt;/p&gt;
  );
}

const ban = (ms: number) =&gt; { const het = performance.now() + ms; while (performance.now() &lt; het) {} };

function DoVe() {
  const [a, setA] = useState(0);
  useEffect(() =&gt; {
    if (a === 0) return;
    (window as unknown as { __effect: number }).__effect = performance.now(); <span class="tok-comment">  // effect bắt đầu lúc nào</span>
    ban(300);                                                                 <span class="tok-comment">  // effect bận 300 ms</span>
  }, [a]);
  return (
    &lt;p&gt;a = &lt;b id="ve-so"&gt;{a}&lt;/b&gt;{' '}
      &lt;button id="ve-bam" onClick={() =&gt; setA(a + 1)} className="rounded border px-2"&gt;bấm&lt;/button&gt;{' '}
      &lt;button id="ve-hen" onClick={() =&gt; setTimeout(() =&gt; setA((x) =&gt; x + 1), 0)} className="rounded border px-2"&gt;hẹn giờ&lt;/button&gt;
    &lt;/p&gt;
  );
}

let demE = 0, demR = 0; <span class="tok-comment">  // đếm render (đo dưới next start)</span>

function HoTenEffect() {
  const [ten, setTen] = useState('An');
  const [hoTen, setHoTen] = useState('');
  demE++;
  useEffect(() =&gt; { setHoTen('Nguyễn ' + ten); }, [ten]); <span class="tok-comment">  // ✗ state dẫn xuất qua effect</span>
  return &lt;p&gt;effect: &lt;input id="ten-e" value={ten} onChange={(e) =&gt; setTen(e.target.value)} className="rounded border px-1" /&gt; → &lt;b id="hoten-e"&gt;{hoTen}&lt;/b&gt; · render &lt;i id="dem-e"&gt;{demE}&lt;/i&gt;&lt;/p&gt;;
}

function HoTenRender() {
  const [ten, setTen] = useState('An');
  const hoTen = 'Nguyễn ' + ten;                          <span class="tok-comment">  // ✓ tính ngay trong lúc render</span>
  demR++;
  return &lt;p&gt;render: &lt;input id="ten-r" value={ten} onChange={(e) =&gt; setTen(e.target.value)} className="rounded border px-1" /&gt; → &lt;b id="hoten-r"&gt;{hoTen}&lt;/b&gt; · render &lt;i id="dem-r"&gt;{demR}&lt;/i&gt;&lt;/p&gt;;
}

export default function HieuUng() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;ThuTu /&gt;
      &lt;DoVe /&gt;
      &lt;HoTenEffect /&gt;
      &lt;HoTenRender /&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>First the server side — build the page, then curl the HTML it sends:</p>
<div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|render n=|effect n=|hieu-ung'
✓ Compiled successfully in 930ms
render n=0
├ ○ /hieu-ung
$ curl -s localhost:3000/hieu-ung | grep -o '&lt;title&gt;[^&lt;]*&lt;/title&gt;'
&lt;title&gt;Create Next App&lt;/title&gt;
$ curl -s localhost:3000/hieu-ung | grep -oE 'id="(so|hoten-e|hoten-r)"&gt;[^&lt;]*&lt;'
id="so"&gt;0&lt;
id="hoten-e"&gt;&lt;
id="hoten-r"&gt;Nguyễn An&lt;</div>
<p>The build printed <code>render n=0</code> (the page is prerendered) but never an effect line. The HTML title is still the layout&#39;s, and the name an effect computes is an empty tag — that is what a visitor with slow JavaScript, or a search engine, receives.</p>
<p>Then the browser — Chromium under <code>next start</code>, every animation frame logged with <code>requestAnimationFrame</code>:</p>
<div class="out">browser console (load, then +1 twice):
  render n=0
  effect n=0 · DOM đang hiện 0
  render n=1
  effect n=1 · DOM đang hiện 1
  render n=2
  effect n=2 · DOM đang hiện 2
document.title before / after          : Create Next App → Đã bấm 2 lần
effect busy 300 ms, click "bấm"        : new value painted 300 ms after the effect started
effect busy 300 ms, click "hẹn giờ"    : new value painted 300 ms after the effect started
renders on load (effect / render)      : 2 / 1
renders after typing "h"               : 4 / 2
frames painted, effect version         : An | Nguyễn An  →  Anh | Nguyễn An  →  Anh | Nguyễn Anh
frames painted, render version         : An | Nguyễn An  →  Anh | Nguyễn Anh</div>
<p>Read the middle lines twice. Render always comes before its effect, and the effect already sees the new DOM. The 300 ms effect delayed the paint by 300 ms whether the update came from a click or from a timer — "after paint" is not guaranteed, so never do slow synchronous work in an effect. And the derived-in-an-effect name costs a second render per keystroke and lets a stale frame (<code>Anh | Nguyễn An</code>) reach the screen.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm start    <span class="tok-comment">  # open /hieu-ung — watch the console and the tab title</span>
curl -s localhost:3000/hieu-ung | grep -o "&lt;title&gt;[^&lt;]*&lt;/title&gt;"
<span class="tok-comment"># DevTools → Performance: record a click on "bấm" — the long task contains the effect, the frame comes after it</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependencies and cleanup</span><span class="lc-sub">When an effect runs, and why Strict Mode runs it twice</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-2-khong-can" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.2 — You might not need an effect</span><span class="lc-sub">Compute in render, reset with a key, act in handlers</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-1-usestate-useeffect" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.1 — useState & useEffect</span><span class="lc-sub">The university lesson: state and side effects in function components</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useEffect</span><span class="v">Runs code after render to sync with systems outside React.</span></div>
  <div class="kv"><span class="k">Side effect</span><span class="v">Anything beyond computing UI: DOM, network, timers, subscriptions.</span></div>
  <div class="kv"><span class="k">After paint</span><span class="v">Effects run after the browser has painted the render.</span></div>
  <div class="kv"><span class="k">Dependency array</span><span class="v">The list that decides when the effect re-runs.</span></div>
  <div class="kv"><span class="k">Escape hatch</span><span class="v">Effects are for leaving React's world, not for ordinary logic.</span></div>
  <div class="kv"><span class="k">Render vs effect</span><span class="v">Render computes UI; effects reach out to the outside.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>An effect runs code after render to synchronise with something outside React (DOM, network, timers).</li><li>Effects run after the browser paints, not during render.</li><li>Treat <code>useEffect</code> as an escape hatch, not a place for ordinary computation.</li><li>If you can compute a value during render, you do not need an effect.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react.dev/learn/synchronizing-with-effects" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">react.dev — Synchronizing with Effects</span><span class="lc-sub">The official mental model for useEffect. Read this once slowly; it reframes everything.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useEffect" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — useEffect API</span><span class="lc-sub">Every parameter, every edge case, with runnable examples.</span></span>
</a>
</div>

<div class="ml-vi">
<div class="callout ok"><strong>Đã học khoá React?</strong> Chương này là phần ôn nhanh React &mdash; cùng chủ đề được dạy kỹ ở khoá <a href="/courses/react">React</a> (Chương 4). Đọc lướt hoặc chuyển thẳng sang <strong>Chương 8</strong>, nơi bắt đầu phần riêng của Next.js. Nhớ: Next.js là <em>framework dựng trên React</em> &mdash; mọi component, props, state, hook ở đây vẫn là React thuần.</div>
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Effect với ra bên ngoài React — sau khi render</h2>
<p class="lead">Chương 2 nói render phải thuần: không tác dụng phụ trong lúc render. Nhưng app thật phải nói chuyện với thế giới bên ngoài — một API trình duyệt, một subscription, một timer, đôi khi là mạng. <code>useEffect</code> là chỗ được phép làm điều đó. Nó chạy code của bạn <em>sau</em> khi React đã render và commit vào DOM, không phải trong lúc render.</p>

<h3>"Đồng bộ với một hệ thống bên ngoài" nghĩa là gì</h3>
<p>Một effect tồn tại để giữ một thứ <em>bên ngoài</em> React bước cùng nhịp với state của component. Tài liệu React diễn đạt đúng như vậy — một effect đồng bộ với một hệ thống bên ngoài:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng effect ĐÚNG</span><span class="v">Subscribe một WebSocket hay sự kiện; bật/tắt một timer; điều khiển tay một widget không-phải-React (bản đồ, biểu đồ); đặt tiêu đề trang; kết nối tới một API trình duyệt.</span></div>
  <div class="kv"><span class="k">KHÔNG phải effect</span><span class="v">Biến đổi dữ liệu để render (làm trong lúc render); phản hồi một cú click (làm trong handler); suy state từ props. Bài 5.4 dành trọn cho những cái này.</span></div>
</div>

<h3>Hình dạng</h3>
<pre><code class="language-javascript">import { useEffect } from 'react';

function ChatRoom({ roomId }) {
  useEffect(() =&gt; {
    const conn = createConnection(roomId);   <span class="tok-comment">// tác dụng phụ: mở kết nối</span>
    conn.connect();
    return () =&gt; conn.disconnect();           <span class="tok-comment">// dọn dẹp: đóng nó</span>
  }, [roomId]);                               <span class="tok-comment">// phụ thuộc</span>

  return &lt;h1&gt;Chào phòng {roomId}&lt;/h1&gt;;
}</code></pre>
<p>Ba phần, mỗi phần một việc: <strong>hàm setup</strong> (chạy effect), <strong>hàm cleanup</strong> tuỳ chọn nó trả về (hoàn tác effect), và <strong>mảng phụ thuộc</strong> (quyết khi nào chạy lại). Bài sau mổ xẻ hai phần cuối; ở đây, chỉ cần ghim đúng thời điểm vào đầu.</p>

<h3>Chính xác thì nó chạy khi nào?</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">React render component của bạn (gọi hàm, dựng cây element).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">React commit thay đổi vào DOM thật — màn hình cập nhật.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Rồi</b> React mới chạy các effect. DOM đã mang giao diện mới; còn trình duyệt đã kịp vẽ ra hay chưa thì không bảo đảm (đo ở dưới).</div></div>
</div>
<p>Thứ tự này chính là điểm mấu chốt: effect không thể quyết UI trông thế nào — tới lúc nó chạy, DOM đã mang giao diện mới rồi. "Effect chạy sau khi vẽ" là trường hợp thường gặp, không phải lời hứa: trên trang Next.js lần vẽ đầu là HTML máy chủ, có từ lâu trước mọi effect; nhưng trong phép đo dưới đây, effect do cú bấm gây ra — và cả effect do bộ hẹn giờ gây ra — đã chạy <em>trước</em> khi trình duyệt vẽ, nên một effect chậm làm màn hình đứng hình suốt thời gian nó chạy. Nếu bạn thấy mình muốn một effect đổi cái được render, logic đó gần như luôn thuộc về chính render hoặc một handler sự kiện.</p>

<div class="callout warn">
<p><strong>Mảng phụ thuộc không phải gia vị tuỳ chọn — nó đổi hành vi hoàn toàn.</strong> <code>useEffect(fn, [x])</code> chạy lại khi <code>x</code> đổi. <code>useEffect(fn, [])</code> chạy một lần sau render đầu. <code>useEffect(fn)</code> <em>không</em> có mảng chạy sau <em>mỗi</em> lần render — thường là bug, và là nguyên nhân kinh điển của vòng lặp vô tận khi effect còn set state. Bài sau làm rõ chính xác ba trường hợp.</p>
</div>

<h3>Khi nào effect là công cụ đúng — và khi nào không</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Việc render phải thuần khiết</b> — Một component tính ra JSX từ props và state. Mọi thứ chạm tới thế giới bên ngoài — một đăng ký, một bộ đếm giờ, một phép đo DOM — đều không được xảy ra trong lúc tính đó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Một effect chạy SAU commit</b> — React render xong và cập nhật DOM, rồi effect của bạn mới chạy. Trên trang Next.js lần vẽ đầu là HTML máy chủ, nên effect không bao giờ chặn nó; còn với các lần cập nhật sau, một effect chậm có thể làm trễ việc vẽ (đo ở dưới).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó dành để đồng bộ với một thứ bên ngoài</b> — Một WebSocket, một listener trên <code>window</code>, một widget của bên thứ ba, một API của trình duyệt. &quot;Bên ngoài&quot; chính là phép thử.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Không dành để phản ứng với state của chính bạn</b> — Biến đổi dữ liệu, đặt lại một trường khi prop đổi, cập nhật state từ state khác — tất cả đều thuộc về lúc render hoặc thuộc về handler sự kiện.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — dùng effect để dẫn xuất một mẩu state từ một mẩu state khác.</strong> <code>useEffect(() =&gt; { setFullName(first + &#39; &#39; + last) }, [first, last])</code> chạy được, và nó tốn của bạn một lần render thừa mỗi khi một trong hai trường đổi: React render với cái tên cũ, vẽ nó ra, chạy effect, đặt state, rồi render lại. Khung hình trung gian đó thật sự lên màn hình — đo ở dưới ngay trên máy thường, không chỉ trên máy chậm. Nó còn tạo ra một nguồn sự thật thứ hai, sẵn sàng trôi dạt ngay khi có người đặt <code>fullName</code> từ chỗ khác. Hãy tính nó trong lúc render — <code>const fullName = first + &#39; &#39; + last</code> — vốn luôn đúng và chẳng tốn gì.</p></div>
<a class="link-card dl" href="https://react.dev/learn/synchronizing-with-effects" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">react.dev — Đồng bộ bằng Effect</span><span class="lc-sub">Effect thật ra dùng để làm gì, kèm vòng đời vẽ ra rõ ràng.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">react.dev — Có thể bạn không cần Effect</span><span class="lc-sub">Sáu effect phổ biến lẽ ra không nên tồn tại, mỗi cái kèm thứ thay thế.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một <code>useEffect</code> đặt <code>document.title</code> từ state; xem nó chạy sau khi render vẽ xong.</li>
<li>Thêm một <code>console.log</code> trong effect và một cái trong thân component, rồi để ý thứ tự.</li>
<li>Mô tả một thứ hợp với effect (đồng bộ với cái ngoài React) và một thứ không (tính giá trị cho render).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn viết được một effect cơ bản và giải thích nó chạy sau render, để đồng bộ với thế giới bên ngoài.</p></div>

<h3>🔬 Đo thật: effect thật sự chạy lúc nào (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Một trang bốn component: thứ tự render và effect, một effect bận 300 ms, và họ tên dẫn xuất bằng effect so với tính ngay trong render:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

function ThuTu() {
  const [n, setN] = useState(0);
  console.log(&#96;render n=\${n}&#96;);
  useEffect(() =&gt; {
    const dom = document.getElementById('so')!.textContent;
    console.log(&#96;effect n=\${n} · DOM đang hiện \${dom}&#96;);
    document.title = &#96;Đã bấm \${n} lần&#96;;            <span class="tok-comment">  // đồng bộ một thứ NGOÀI React</span>
  }, [n]);
  return (
    &lt;p&gt;Đã bấm &lt;b id="so"&gt;{n}&lt;/b&gt; lần{' '}
      &lt;button id="bam" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;+1&lt;/button&gt;
    &lt;/p&gt;
  );
}

const ban = (ms: number) =&gt; { const het = performance.now() + ms; while (performance.now() &lt; het) {} };

function DoVe() {
  const [a, setA] = useState(0);
  useEffect(() =&gt; {
    if (a === 0) return;
    (window as unknown as { __effect: number }).__effect = performance.now(); <span class="tok-comment">  // effect bắt đầu lúc nào</span>
    ban(300);                                                                 <span class="tok-comment">  // effect bận 300 ms</span>
  }, [a]);
  return (
    &lt;p&gt;a = &lt;b id="ve-so"&gt;{a}&lt;/b&gt;{' '}
      &lt;button id="ve-bam" onClick={() =&gt; setA(a + 1)} className="rounded border px-2"&gt;bấm&lt;/button&gt;{' '}
      &lt;button id="ve-hen" onClick={() =&gt; setTimeout(() =&gt; setA((x) =&gt; x + 1), 0)} className="rounded border px-2"&gt;hẹn giờ&lt;/button&gt;
    &lt;/p&gt;
  );
}

let demE = 0, demR = 0; <span class="tok-comment">  // đếm render (đo dưới next start)</span>

function HoTenEffect() {
  const [ten, setTen] = useState('An');
  const [hoTen, setHoTen] = useState('');
  demE++;
  useEffect(() =&gt; { setHoTen('Nguyễn ' + ten); }, [ten]); <span class="tok-comment">  // ✗ state dẫn xuất qua effect</span>
  return &lt;p&gt;effect: &lt;input id="ten-e" value={ten} onChange={(e) =&gt; setTen(e.target.value)} className="rounded border px-1" /&gt; → &lt;b id="hoten-e"&gt;{hoTen}&lt;/b&gt; · render &lt;i id="dem-e"&gt;{demE}&lt;/i&gt;&lt;/p&gt;;
}

function HoTenRender() {
  const [ten, setTen] = useState('An');
  const hoTen = 'Nguyễn ' + ten;                          <span class="tok-comment">  // ✓ tính ngay trong lúc render</span>
  demR++;
  return &lt;p&gt;render: &lt;input id="ten-r" value={ten} onChange={(e) =&gt; setTen(e.target.value)} className="rounded border px-1" /&gt; → &lt;b id="hoten-r"&gt;{hoTen}&lt;/b&gt; · render &lt;i id="dem-r"&gt;{demR}&lt;/i&gt;&lt;/p&gt;;
}

export default function HieuUng() {
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;ThuTu /&gt;
      &lt;DoVe /&gt;
      &lt;HoTenEffect /&gt;
      &lt;HoTenRender /&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Trước hết là phía máy chủ — build trang, rồi curl HTML nó gửi về:</p>
<div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|render n=|effect n=|hieu-ung'
✓ Compiled successfully in 930ms
render n=0
├ ○ /hieu-ung
$ curl -s localhost:3000/hieu-ung | grep -o '&lt;title&gt;[^&lt;]*&lt;/title&gt;'
&lt;title&gt;Create Next App&lt;/title&gt;
$ curl -s localhost:3000/hieu-ung | grep -oE 'id="(so|hoten-e|hoten-r)"&gt;[^&lt;]*&lt;'
id="so"&gt;0&lt;
id="hoten-e"&gt;&lt;
id="hoten-r"&gt;Nguyễn An&lt;</div>
<p>Build in ra <code>render n=0</code> (trang được dựng sẵn) nhưng không bao giờ có dòng effect. Tiêu đề trong HTML vẫn là của layout, và họ tên do effect tính là một thẻ rỗng — đó là thứ người dùng mạng chậm, hay máy tìm kiếm, nhận được.</p>
<p>Rồi phía trình duyệt — Chromium dưới <code>next start</code>, ghi lại từng khung hình bằng <code>requestAnimationFrame</code>:</p>
<div class="out">console trình duyệt (tải, rồi +1 hai lần):
  render n=0
  effect n=0 · DOM đang hiện 0
  render n=1
  effect n=1 · DOM đang hiện 1
  render n=2
  effect n=2 · DOM đang hiện 2
document.title trước / sau            : Create Next App → Đã bấm 2 lần
effect bận 300 ms, bấm "bấm"          : số mới lên màn hình 300 ms sau khi effect bắt đầu
effect bận 300 ms, bấm "hẹn giờ"      : số mới lên màn hình 300 ms sau khi effect bắt đầu
render lúc tải (effect / render)       : 2 / 1
render sau khi gõ "h"                  : 4 / 2
khung hình vẽ ra, bản effect           : An | Nguyễn An  →  Anh | Nguyễn An  →  Anh | Nguyễn Anh
khung hình vẽ ra, bản render           : An | Nguyễn An  →  Anh | Nguyễn Anh</div>
<p>Đọc kỹ các dòng giữa. Render luôn đi trước effect của nó, và effect đã thấy DOM mới. Effect 300 ms làm việc vẽ trễ đúng 300 ms dù cập nhật đến từ cú bấm hay từ bộ hẹn giờ — "sau khi vẽ" không được bảo đảm, nên đừng bao giờ làm việc nặng đồng bộ trong effect. Còn họ tên dẫn xuất bằng effect tốn thêm một lần render mỗi phím và để lọt một khung hình cũ (<code>Anh | Nguyễn An</code>) ra màn hình.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm start    <span class="tok-comment">  # mở /hieu-ung — xem console và tiêu đề tab</span>
curl -s localhost:3000/hieu-ung | grep -o "&lt;title&gt;[^&lt;]*&lt;/title&gt;"
<span class="tok-comment"># DevTools → Performance: ghi lại một cú bấm "bấm" — tác vụ dài chứa effect, khung hình đến sau nó</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependency và cleanup</span><span class="lc-sub">Khi nào effect chạy, vì sao Strict Mode chạy hai lần</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-2-khong-can" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.2 — Có thể bạn không cần effect</span><span class="lc-sub">Tính trong render, reset bằng key, làm trong handler</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-1-usestate-useeffect" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · 8.1 — useState & useEffect</span><span class="lc-sub">Bài trên trường: state và side effect trong function component</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useEffect</span><span class="v">Chạy code sau render để đồng bộ với hệ thống ngoài React.</span></div>
  <div class="kv"><span class="k">Side effect</span><span class="v">Mọi thứ ngoài việc tính UI: DOM, mạng, timer, subscription.</span></div>
  <div class="kv"><span class="k">Sau khi vẽ</span><span class="v">Effect chạy sau khi trình duyệt đã vẽ xong lần render.</span></div>
  <div class="kv"><span class="k">Mảng phụ thuộc</span><span class="v">Danh sách quyết định khi nào effect chạy lại.</span></div>
  <div class="kv"><span class="k">Cửa thoát</span><span class="v">Effect để rời khỏi thế giới React, không phải cho logic thường.</span></div>
  <div class="kv"><span class="k">Render vs effect</span><span class="v">Render tính UI; effect vươn ra bên ngoài.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một effect chạy code sau render để đồng bộ với cái ngoài React (DOM, mạng, timer).</li><li>Effect chạy sau khi trình duyệt vẽ xong, không phải trong lúc render.</li><li>Hãy xem <code>useEffect</code> là cửa thoát, không phải chỗ cho tính toán thường.</li><li>Nếu tính được một giá trị trong lúc render, bạn không cần effect.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react.dev/learn/synchronizing-with-effects" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">react.dev — Synchronizing with Effects</span><span class="lc-sub">Mô hình tư duy chính thức cho useEffect. Đọc chậm một lần; nó định hình lại mọi thứ.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useEffect" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — API useEffect</span><span class="lc-sub">Mọi tham số, mọi ca biên, kèm ví dụ chạy được.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Dependencies & cleanup|||5.2 — Phụ thuộc & dọn dẹp',
      slug: 'nextjs-5-2-phu-thuoc-don-dep',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Mảng phụ thuộc quyết khi effect chạy lại; cleanup chạy trước mỗi lần chạy lại VÀ khi unmount. Xem thứ tự thật.',
      content: `
${G05_2}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>The dependency array and the cleanup function, precisely</h2>
<p class="lead">These two features are where useEffect is won or lost. The dependency array decides <em>when</em> the effect re-runs; the cleanup function undoes the previous run before the next one. Get them right and effects are predictable; get them wrong and you get stale data, leaks and double-subscriptions.</p>

<h3>The three dependency cases</h3>
<pre><code class="language-javascript">useEffect(() =&gt; { /* ... */ });          <span class="tok-comment">// no array → after EVERY render</span>
useEffect(() =&gt; { /* ... */ }, []);      <span class="tok-comment">// empty → once, after the first render</span>
useEffect(() =&gt; { /* ... */ }, [a, b]); <span class="tok-comment">// listed → whenever a or b changes</span></code></pre>
<p>React compares each dependency to its previous value with <code>Object.is</code> (like <code>===</code>). If every dependency is unchanged, it skips the effect. The rule that keeps you out of trouble: <strong>every value from component scope that the effect uses — props, state, functions — must be in the array.</strong> The ESLint rule <code>react-hooks/exhaustive-deps</code> enforces this; do not silence it by deleting a dependency, because a missing dependency is how the effect reads a <em>stale</em> value (the snapshot rule from Chapter 3, back again).</p>

<h3>Cleanup runs before the next effect, and on unmount</h3>
<p>The function you return from an effect is its cleanup. React runs it in two situations: right before re-running the effect (to undo the previous run), and when the component unmounts (to undo the last run). This is a real, captured run — the same effect with dependency <code>dep</code> going <code>1</code> → (unchanged) → <code>2</code> → unmount produced exactly this order:</p>
<pre><code>render dep=1   → <span class="tok-comment">effect runs</span>
render dep=1   → <span class="tok-comment">(unchanged — effect skipped)</span>
render dep=2   → <span class="tok-comment">cleanup of 1, then effect of 2</span>
unmount        → <span class="tok-comment">cleanup of 2</span></code></pre>
<div class="out">["effect 1","cleanup 1","effect 2","cleanup 2"]</div>
<p>Read the order carefully: when <code>dep</code> changed from 1 to 2, React <strong>cleaned up the old effect before running the new one</strong>. That is why a subscription effect must return a matching unsubscribe — otherwise every change stacks another live subscription on top of the old ones. The second render (dep unchanged) did nothing at all: <code>Object.is(1, 1)</code> is true, so the effect was skipped.</p>

<h3>The mental model: each effect is a fresh setup+cleanup pair</h3>
<p>Don't think of an effect as "run on mount, clean on unmount". Think of it as: <em>every time the dependencies change, React tears down the old version and sets up a new one.</em> An effect and its cleanup are a matched pair that describes one synchronised state; when the inputs change, React swaps the whole pair. If your cleanup perfectly undoes your setup, the effect is correct no matter how many times it runs.</p>

<div class="pitfall">
<p><strong>Objects and functions as dependencies re-trigger every render.</strong> <code>{ }</code>, <code>[ ]</code> and <code>() =&gt; {}</code> created during render are a <em>new reference</em> each time, so <code>Object.is</code> always says "changed" and the effect runs on every render. If an effect depends on an object or a function, either move it inside the effect, or memoise it with <code>useMemo</code>/<code>useCallback</code> (Chapter 6). This is one of the most common "why does my effect loop?" causes.</p>
</div>
<h3>The dependency array and the cleanup function</h3>
<div class="lz-map">
  <div class="lz-stage">Two halves of the same contract</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">No array — runs after every render</div><div class="lz-nsub">Almost never what you want. If the effect sets state, this is an infinite loop.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Empty array — runs once on mount</div><div class="lz-nsub">And the cleanup runs once on unmount. Correct for a subscription that never needs to change.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">With dependencies — re-runs when they change</div><div class="lz-nsub">Cleanup for the old values runs first, then the effect for the new ones. React is re-synchronising, not &quot;updating&quot;.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Cleanup undoes exactly what the effect did</div><div class="lz-nsub">Remove the listener, close the socket, clear the timer, cancel the request. If the effect subscribed, the cleanup unsubscribes.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — omitting a dependency to stop an effect from re-running.</strong> The lint rule complains that <code>query</code> is missing; deleting it from the array silences the warning and freezes the effect on the first render&#39;s value forever. The search box then keeps fetching results for whatever was typed first, and no error appears anywhere — the request succeeds, it is just the wrong request. The array is not a &quot;run when I say&quot; switch; it is a claim about which values the effect reads. When re-running is genuinely wrong, the fix is to change what the effect depends on — move the value into a ref, or into the setter&#39;s functional form — not to lie in the array.</p></div>
<a class="link-card dl" href="https://react.dev/learn/lifecycle-of-reactive-effects" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Lifecycle of reactive effects</span><span class="lc-sub">Why an effect re-synchronises rather than &quot;updates&quot;, and what that means for dependencies.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/removing-effect-dependencies" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Removing Effect dependencies</span><span class="lc-sub">How to legitimately shrink a dependency array, instead of deleting entries from it.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add a <code>setInterval</code> in an effect and return a cleanup that clears it; mount/unmount the component and confirm no duplicate timers.</li>
<li>Add a value to the dependency array and watch the effect re-run only when it changes; remove it and see the lint warning.</li>
<li>Explain the three dependency cases: <code>[]</code> (once), <code>[x]</code> (on x change), and no array (every render).</li>
</ol>
<p><strong>Done when:</strong> you can write cleanup, set correct dependencies, and explain the three dependency cases.</p></div>

<h3>🔬 Measured: the array and the cleanup (React 19.3.0 · Next.js 16.4.6)</h3>
<p>One page, one component per rule — counters are module variables exposed on <code>window</code> so a real browser can read them:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

const dem = { khong: 0, rong: 0, coA: 0 };

function BaTruongHop({ a, b }: { a: number; b: number }) {
  useEffect(() =&gt; { dem.khong++; });          <span class="tok-comment">  // không mảng ⇒ sau MỖI render</span>
  useEffect(() =&gt; { dem.rong++; }, []);       <span class="tok-comment">  // mảng rỗng ⇒ một lần</span>
  useEffect(() =&gt; { dem.coA++; }, [a]);       <span class="tok-comment">  // [a] ⇒ khi a đổi</span>
  return &lt;p id="ba"&gt;a={a} b={b}&lt;/p&gt;;
}

const nhatKy: string[] = [];
function VongDoi({ dep }: { dep: number }) {
  useEffect(() =&gt; {
    nhatKy.push(&#96;effect \${dep}&#96;);
    return () =&gt; { nhatKy.push(&#96;cleanup \${dep}&#96;); };
  }, [dep]);
  return &lt;p&gt;dep = {dep}&lt;/p&gt;;
}

const nhip = { tick: 0 };
function DongHo({ donDep }: { donDep: boolean }) {
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; { nhip.tick++; }, 100);
    if (donDep) return () =&gt; clearInterval(id);<span class="tok-comment">  // ✓ cleanup khớp setup</span>
  }, [donDep]);                                 <span class="tok-comment">  // ✗ thiếu cleanup ⇒ interval cũ chạy mãi</span>
  return &lt;span&gt;⏱&lt;/span&gt;;
}

const demObj = { obj: 0, so: 0 };
function PhongChat({ room, b }: { room: string; b: number }) {
  const opt = { room };                           <span class="tok-comment">  // object mới MỖI render</span>
  useEffect(() =&gt; { demObj.obj++; }, [opt]);      <span class="tok-comment">  // ✗ luôn "đã đổi"</span>
  useEffect(() =&gt; { demObj.so++; }, [opt.room]);  <span class="tok-comment">  // ✓ so chuỗi</span>
  return &lt;span id="pc"&gt;{room} {b}&lt;/span&gt;;
}

function TimKiem() {
  const [query, setQuery] = useState('a');
  const [kq, setKq] = useState('');
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; setKq(&#96;tìm "\${query}"&#96;), 200);
    return () =&gt; clearInterval(id);
  }, []);                                         <span class="tok-comment">  // ✗ thiếu query ⇒ đóng băng ở 'a'</span>
  return &lt;p&gt;&lt;input id="q" value={query} onChange={(e) =&gt; setQuery(e.target.value)} className="rounded border px-1" /&gt; &lt;b id="tk"&gt;{kq}&lt;/b&gt;&lt;/p&gt;;
}

if (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __nhatKy: nhatKy, __nhip: nhip, __demObj: demObj }); <span class="tok-comment">  // để đo</span>

export default function PhuThuoc() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [dep, setDep] = useState(1);
  const [coVD, setCoVD] = useState(true);
  const [dh, setDh] = useState&lt;'' | 'thieu' | 'du'&gt;('');
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;BaTruongHop a={a} b={b} /&gt;
      &lt;button id="a1" onClick={() =&gt; setA(a + 1)} className="rounded border px-2"&gt;a+1&lt;/button&gt;{' '}
      &lt;button id="b1" onClick={() =&gt; setB(b + 1)} className="rounded border px-2"&gt;b+1&lt;/button&gt;
      &lt;div&gt;{coVD &amp;&amp; &lt;VongDoi dep={dep} /&gt;}
        &lt;button id="d1" onClick={() =&gt; setDep(1)} className="rounded border px-2"&gt;dep=1&lt;/button&gt;{' '}
        &lt;button id="d2" onClick={() =&gt; setDep(2)} className="rounded border px-2"&gt;dep=2&lt;/button&gt;{' '}
        &lt;button id="go" onClick={() =&gt; setCoVD(false)} className="rounded border px-2"&gt;gỡ&lt;/button&gt;&lt;/div&gt;
      &lt;div&gt;{dh &amp;&amp; &lt;DongHo key={dh + b} donDep={dh === 'du'} /&gt;}
        &lt;button id="thieu" onClick={() =&gt; setDh('thieu')} className="rounded border px-2"&gt;đồng hồ thiếu cleanup&lt;/button&gt;{' '}
        &lt;button id="du" onClick={() =&gt; setDh('du')} className="rounded border px-2"&gt;đồng hồ đủ cleanup&lt;/button&gt;{' '}
        &lt;button id="tat" onClick={() =&gt; setDh('')} className="rounded border px-2"&gt;tắt&lt;/button&gt;&lt;/div&gt;
      &lt;PhongChat room="react" b={b} /&gt;
      &lt;TimKiem /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint src/app/phu-thuoc/page.tsx

src/app/phu-thuoc/page.tsx
  33:9  warning  The 'opt' object makes the dependencies of useEffect Hook (at line 34) change on every render. To fix this, wrap the initialization of 'opt' in its own useMemo() Hook  react-hooks/exhaustive-deps
  45:6  warning  React Hook useEffect has a missing dependency: 'query'. Either include it or remove the dependency array. You can also replace multiple useState variables with useReducer if 'setKq' needs the current value of 'query'  react-hooks/exhaustive-deps

✖ 2 problems (0 errors, 2 warnings)
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|phu-thuoc'
✓ Compiled successfully in 326ms
├ ○ /phu-thuoc
$ curl -s -o /dev/null -w 'GET /phu-thuoc → %{http_code}\\n' localhost:3000/phu-thuoc
GET /phu-thuoc → 200</div>
<p>ESLint already names both bugs before anything runs: the object that changes every render, and the missing <code>query</code>. Then, clicking through in Chromium under <code>next start</code>:</p>
<div class="out">load, then b+1, b+1, a+1 (4 renders) : {"khong":4,"rong":1,"coA":2}
object dependency, same 4 renders    : {"obj":4,"so":1}   (obj = [opt], so = [opt.room])
cleanup log: load                    : ["effect 1"]
             re-render, dep still 1  : ["effect 1"]
             dep = 2                 : ["effect 1","cleanup 1","effect 2"]
             unmount                 : ["effect 1","cleanup 1","effect 2","cleanup 2"]
100 ms timer, 3 remounts, NO cleanup : 40 ticks/s · after unmount 40
                       WITH cleanup  : 10 ticks/s · after unmount 0
query missing from [], typed "bc"    : abc → tìm "a"</div>
<p>Every line matches the rules above. No array ran on all four renders, <code>[]</code> once, <code>[a]</code> twice. The cleanup for the old value always ran before the effect for the new one. The clock without a cleanup kept four intervals alive after the component was gone. And the effect without <code>query</code> searched for <code>"a"</code> forever — no error, just the wrong request.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npx eslint src/app/phu-thuoc/page.tsx
npm run build &amp;&amp; npm start    <span class="tok-comment">  # open /phu-thuoc</span>
<span class="tok-comment"># DevTools console: JSON.stringify(__dem), __nhatKy — click a+1 / b+1 / dep=2 / gỡ and read again</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependencies and cleanup</span><span class="lc-sub">The three array shapes, cleanup order, Strict Mode</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-3-vong-lap" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.3 — Infinite loops and stale closures</span><span class="lc-sub">Unstable dependencies, useEffectEvent</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-ex13-useeffect" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 13 — useEffect</span><span class="lc-sub">The university exercise on useEffect</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dependencies</span><span class="v">Values the effect reads; it re-runs when they change.</span></div>
  <div class="kv"><span class="k">Empty array []</span><span class="v">Run once after mount (and clean up on unmount).</span></div>
  <div class="kv"><span class="k">Cleanup function</span><span class="v">Returned from the effect; runs before re-run and on unmount.</span></div>
  <div class="kv"><span class="k">Stale closure</span><span class="v">An effect reading an old value because a dep was omitted.</span></div>
  <div class="kv"><span class="k">No array</span><span class="v">Effect runs after every render (rarely what you want).</span></div>
  <div class="kv"><span class="k">exhaustive-deps</span><span class="v">The lint rule that catches missing dependencies.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The dependency array controls when an effect re-runs: <code>[]</code> once, <code>[x]</code> when x changes, none = every render.</li><li>Return a cleanup function to tear down timers, subscriptions and listeners.</li><li>Cleanup runs before each re-run and on unmount — this prevents leaks and duplicates.</li><li>Follow the <code>exhaustive-deps</code> lint rule; a missing dep causes stale-value bugs.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Mảng phụ thuộc và hàm dọn dẹp, cho chính xác</h2>
<p class="lead">Hai tính năng này là nơi useEffect thắng hay thua. Mảng phụ thuộc quyết <em>khi nào</em> effect chạy lại; hàm cleanup hoàn tác lần chạy trước đó trước lần kế. Làm đúng thì effect dự đoán được; làm sai thì bạn được dữ liệu cũ, rò rỉ và subscribe nhân đôi.</p>

<h3>Ba trường hợp phụ thuộc</h3>
<pre><code class="language-javascript">useEffect(() =&gt; { /* ... */ });          <span class="tok-comment">// không mảng → sau MỖI render</span>
useEffect(() =&gt; { /* ... */ }, []);      <span class="tok-comment">// rỗng → một lần, sau render đầu</span>
useEffect(() =&gt; { /* ... */ }, [a, b]); <span class="tok-comment">// liệt kê → mỗi khi a hoặc b đổi</span></code></pre>
<p>React so mỗi phụ thuộc với giá trị trước bằng <code>Object.is</code> (như <code>===</code>). Nếu mọi phụ thuộc không đổi, nó bỏ qua effect. Quy tắc giữ bạn khỏi rắc rối: <strong>mọi giá trị từ phạm vi component mà effect dùng — props, state, hàm — đều phải nằm trong mảng.</strong> Luật ESLint <code>react-hooks/exhaustive-deps</code> ép điều này; đừng làm nó im bằng cách xoá một phụ thuộc, vì một phụ thuộc thiếu chính là cách effect đọc một giá trị <em>cũ</em> (quy tắc ảnh chụp từ Chương 3, quay lại).</p>

<h3>Cleanup chạy trước effect kế, và khi unmount</h3>
<p>Hàm bạn trả về từ một effect là cleanup của nó. React chạy nó trong hai tình huống: ngay trước khi chạy lại effect (để hoàn tác lần trước), và khi component bị gỡ (để hoàn tác lần cuối). Đây là một lần chạy THẬT đã ghi lại — cùng một effect với phụ thuộc <code>dep</code> đi <code>1</code> → (không đổi) → <code>2</code> → unmount cho ra đúng thứ tự này:</p>
<pre><code>render dep=1   → <span class="tok-comment">effect chạy</span>
render dep=1   → <span class="tok-comment">(không đổi — bỏ qua effect)</span>
render dep=2   → <span class="tok-comment">cleanup của 1, rồi effect của 2</span>
unmount        → <span class="tok-comment">cleanup của 2</span></code></pre>
<div class="out">["effect 1","cleanup 1","effect 2","cleanup 2"]</div>
<p>Đọc kỹ thứ tự: khi <code>dep</code> đổi từ 1 sang 2, React <strong>dọn dẹp effect cũ TRƯỚC khi chạy effect mới</strong>. Vì thế một effect subscribe phải trả về một unsubscribe khớp — nếu không mỗi lần đổi lại chồng thêm một subscription sống lên đống cũ. Lần render thứ hai (dep không đổi) chẳng làm gì cả: <code>Object.is(1, 1)</code> là true, nên effect bị bỏ qua.</p>

<h3>Mô hình tư duy: mỗi effect là một cặp setup+cleanup mới tinh</h3>
<p>Đừng nghĩ effect là "chạy lúc mount, dọn lúc unmount". Hãy nghĩ: <em>mỗi khi phụ thuộc đổi, React phá bản cũ và dựng bản mới.</em> Một effect và cleanup của nó là một cặp khớp mô tả một trạng thái đồng bộ; khi đầu vào đổi, React tráo cả cặp. Nếu cleanup hoàn tác hoàn hảo setup, effect đúng bất kể chạy bao nhiêu lần.</p>

<div class="pitfall">
<p><strong>Object và hàm làm phụ thuộc kích hoạt lại mỗi render.</strong> <code>{ }</code>, <code>[ ]</code> và <code>() =&gt; {}</code> tạo trong lúc render là một <em>tham chiếu mới</em> mỗi lần, nên <code>Object.is</code> luôn nói "đã đổi" và effect chạy mỗi render. Nếu một effect phụ thuộc một object hay một hàm, hoặc đưa nó vào trong effect, hoặc ghi nhớ nó bằng <code>useMemo</code>/<code>useCallback</code> (Chương 6). Đây là một trong những nguyên nhân "sao effect của tôi lặp?" phổ biến nhất.</p>
</div>
<h3>Mảng phụ thuộc và hàm dọn dẹp</h3>
<div class="lz-map">
  <div class="lz-stage">Hai nửa của cùng một bản hợp đồng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Không có mảng — chạy sau MỌI lần render</div><div class="lz-nsub">Gần như chẳng bao giờ là thứ bạn muốn. Nếu effect có đặt state thì đây là một vòng lặp vô tận.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Mảng rỗng — chạy một lần lúc gắn vào</div><div class="lz-nsub">Và phần dọn dẹp chạy một lần lúc gỡ ra. Đúng cho một đăng ký chẳng bao giờ cần đổi.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Có phụ thuộc — chạy lại khi chúng đổi</div><div class="lz-nsub">Phần dọn dẹp cho giá trị cũ chạy trước, rồi mới tới effect cho giá trị mới. React đang ĐỒNG BỘ LẠI, chứ không phải &quot;cập nhật&quot;.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Dọn dẹp hoàn tác đúng thứ effect đã làm</div><div class="lz-nsub">Gỡ listener, đóng socket, xoá bộ đếm giờ, huỷ request. Effect đã đăng ký thì dọn dẹp phải huỷ đăng ký.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — bỏ bớt một phụ thuộc để effect thôi chạy lại.</strong> Luật lint kêu là thiếu <code>query</code>; xoá nó khỏi mảng thì cảnh báo im đi và effect bị đóng băng ở giá trị của lần render đầu, mãi mãi. Ô tìm kiếm từ đó cứ lấy kết quả cho đúng cái người ta gõ đầu tiên, và chẳng có lỗi nào hiện ra ở đâu — request vẫn thành công, chỉ là sai request. Cái mảng không phải một công tắc &quot;chạy khi tôi bảo&quot;; nó là một khẳng định về những giá trị mà effect đọc. Khi việc chạy lại thật sự là sai, cách chữa là đổi thứ mà effect phụ thuộc vào — đưa giá trị vào một ref, hoặc vào dạng nhận hàm của setter — chứ không phải nói dối trong cái mảng.</p></div>
<a class="link-card dl" href="https://react.dev/learn/lifecycle-of-reactive-effects" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Vòng đời của effect phản ứng</span><span class="lc-sub">Vì sao một effect đồng bộ lại chứ không &quot;cập nhật&quot;, và điều đó nghĩa gì với phụ thuộc.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/removing-effect-dependencies" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Gỡ bớt phụ thuộc của Effect</span><span class="lc-sub">Cách thu nhỏ mảng phụ thuộc một cách chính đáng, thay vì xoá bớt mục trong đó.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một <code>setInterval</code> trong effect và trả về cleanup để clear nó; mount/unmount component và xác nhận không có timer trùng.</li>
<li>Thêm một giá trị vào mảng phụ thuộc và xem effect chỉ chạy lại khi nó đổi; bỏ nó ra và thấy cảnh báo lint.</li>
<li>Giải thích ba trường hợp phụ thuộc: <code>[]</code> (một lần), <code>[x]</code> (khi x đổi), và không có mảng (mỗi lần render).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn viết được cleanup, đặt đúng phụ thuộc, và giải thích ba trường hợp mảng phụ thuộc.</p></div>

<h3>🔬 Đo thật: mảng phụ thuộc và cleanup (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Một trang, mỗi luật một component — bộ đếm là biến cấp module gắn lên <code>window</code> để trình duyệt thật đọc được:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

const dem = { khong: 0, rong: 0, coA: 0 };

function BaTruongHop({ a, b }: { a: number; b: number }) {
  useEffect(() =&gt; { dem.khong++; });          <span class="tok-comment">  // không mảng ⇒ sau MỖI render</span>
  useEffect(() =&gt; { dem.rong++; }, []);       <span class="tok-comment">  // mảng rỗng ⇒ một lần</span>
  useEffect(() =&gt; { dem.coA++; }, [a]);       <span class="tok-comment">  // [a] ⇒ khi a đổi</span>
  return &lt;p id="ba"&gt;a={a} b={b}&lt;/p&gt;;
}

const nhatKy: string[] = [];
function VongDoi({ dep }: { dep: number }) {
  useEffect(() =&gt; {
    nhatKy.push(&#96;effect \${dep}&#96;);
    return () =&gt; { nhatKy.push(&#96;cleanup \${dep}&#96;); };
  }, [dep]);
  return &lt;p&gt;dep = {dep}&lt;/p&gt;;
}

const nhip = { tick: 0 };
function DongHo({ donDep }: { donDep: boolean }) {
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; { nhip.tick++; }, 100);
    if (donDep) return () =&gt; clearInterval(id);<span class="tok-comment">  // ✓ cleanup khớp setup</span>
  }, [donDep]);                                 <span class="tok-comment">  // ✗ thiếu cleanup ⇒ interval cũ chạy mãi</span>
  return &lt;span&gt;⏱&lt;/span&gt;;
}

const demObj = { obj: 0, so: 0 };
function PhongChat({ room, b }: { room: string; b: number }) {
  const opt = { room };                           <span class="tok-comment">  // object mới MỖI render</span>
  useEffect(() =&gt; { demObj.obj++; }, [opt]);      <span class="tok-comment">  // ✗ luôn "đã đổi"</span>
  useEffect(() =&gt; { demObj.so++; }, [opt.room]);  <span class="tok-comment">  // ✓ so chuỗi</span>
  return &lt;span id="pc"&gt;{room} {b}&lt;/span&gt;;
}

function TimKiem() {
  const [query, setQuery] = useState('a');
  const [kq, setKq] = useState('');
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; setKq(&#96;tìm "\${query}"&#96;), 200);
    return () =&gt; clearInterval(id);
  }, []);                                         <span class="tok-comment">  // ✗ thiếu query ⇒ đóng băng ở 'a'</span>
  return &lt;p&gt;&lt;input id="q" value={query} onChange={(e) =&gt; setQuery(e.target.value)} className="rounded border px-1" /&gt; &lt;b id="tk"&gt;{kq}&lt;/b&gt;&lt;/p&gt;;
}

if (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __nhatKy: nhatKy, __nhip: nhip, __demObj: demObj }); <span class="tok-comment">  // để đo</span>

export default function PhuThuoc() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [dep, setDep] = useState(1);
  const [coVD, setCoVD] = useState(true);
  const [dh, setDh] = useState&lt;'' | 'thieu' | 'du'&gt;('');
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;BaTruongHop a={a} b={b} /&gt;
      &lt;button id="a1" onClick={() =&gt; setA(a + 1)} className="rounded border px-2"&gt;a+1&lt;/button&gt;{' '}
      &lt;button id="b1" onClick={() =&gt; setB(b + 1)} className="rounded border px-2"&gt;b+1&lt;/button&gt;
      &lt;div&gt;{coVD &amp;&amp; &lt;VongDoi dep={dep} /&gt;}
        &lt;button id="d1" onClick={() =&gt; setDep(1)} className="rounded border px-2"&gt;dep=1&lt;/button&gt;{' '}
        &lt;button id="d2" onClick={() =&gt; setDep(2)} className="rounded border px-2"&gt;dep=2&lt;/button&gt;{' '}
        &lt;button id="go" onClick={() =&gt; setCoVD(false)} className="rounded border px-2"&gt;gỡ&lt;/button&gt;&lt;/div&gt;
      &lt;div&gt;{dh &amp;&amp; &lt;DongHo key={dh + b} donDep={dh === 'du'} /&gt;}
        &lt;button id="thieu" onClick={() =&gt; setDh('thieu')} className="rounded border px-2"&gt;đồng hồ thiếu cleanup&lt;/button&gt;{' '}
        &lt;button id="du" onClick={() =&gt; setDh('du')} className="rounded border px-2"&gt;đồng hồ đủ cleanup&lt;/button&gt;{' '}
        &lt;button id="tat" onClick={() =&gt; setDh('')} className="rounded border px-2"&gt;tắt&lt;/button&gt;&lt;/div&gt;
      &lt;PhongChat room="react" b={b} /&gt;
      &lt;TimKiem /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint src/app/phu-thuoc/page.tsx

src/app/phu-thuoc/page.tsx
  33:9  warning  The 'opt' object makes the dependencies of useEffect Hook (at line 34) change on every render. To fix this, wrap the initialization of 'opt' in its own useMemo() Hook  react-hooks/exhaustive-deps
  45:6  warning  React Hook useEffect has a missing dependency: 'query'. Either include it or remove the dependency array. You can also replace multiple useState variables with useReducer if 'setKq' needs the current value of 'query'  react-hooks/exhaustive-deps

✖ 2 problems (0 errors, 2 warnings)
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|phu-thuoc'
✓ Compiled successfully in 326ms
├ ○ /phu-thuoc
$ curl -s -o /dev/null -w 'GET /phu-thuoc → %{http_code}\\n' localhost:3000/phu-thuoc
GET /phu-thuoc → 200</div>
<p>ESLint đã gọi tên cả hai lỗi trước khi chạy gì: object đổi mỗi render, và <code>query</code> bị thiếu. Rồi bấm qua trên Chromium dưới <code>next start</code>:</p>
<div class="out">tải, rồi b+1, b+1, a+1 (4 render)     : {"khong":4,"rong":1,"coA":2}
phụ thuộc object, cùng 4 render       : {"obj":4,"so":1}   (obj = [opt], so = [opt.room])
nhật ký cleanup: tải                  : ["effect 1"]
                 render lại, dep vẫn 1 : ["effect 1"]
                 dep = 2               : ["effect 1","cleanup 1","effect 2"]
                 gỡ                    : ["effect 1","cleanup 1","effect 2","cleanup 2"]
hẹn giờ 100 ms, gắn lại 3 lần, THIẾU  : 40 nhịp/giây · sau khi gỡ 40
                              ĐỦ     : 10 nhịp/giây · sau khi gỡ 0
thiếu query trong [], gõ "bc"         : abc → tìm "a"</div>
<p>Dòng nào cũng khớp luật ở trên. Không mảng chạy cả bốn render, <code>[]</code> một lần, <code>[a]</code> hai lần. Cleanup của giá trị cũ luôn chạy trước effect của giá trị mới. Đồng hồ thiếu cleanup giữ bốn interval sống cả khi component đã gỡ. Và effect thiếu <code>query</code> tìm <code>"a"</code> mãi mãi — không lỗi, chỉ là sai request.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npx eslint src/app/phu-thuoc/page.tsx
npm run build &amp;&amp; npm start    <span class="tok-comment">  # mở /phu-thuoc</span>
<span class="tok-comment"># DevTools console: JSON.stringify(__dem), __nhatKy — bấm a+1 / b+1 / dep=2 / gỡ rồi đọc lại</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependency và cleanup</span><span class="lc-sub">Ba dạng mảng, thứ tự cleanup, Strict Mode</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-3-vong-lap" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.3 — Vòng lặp vô hạn và closure cũ</span><span class="lc-sub">Phụ thuộc không ổn định, useEffectEvent</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-ex13-useeffect" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 13 — useEffect</span><span class="lc-sub">Bài tập trên trường về useEffect</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Phụ thuộc</span><span class="v">Giá trị effect đọc; nó chạy lại khi chúng đổi.</span></div>
  <div class="kv"><span class="k">Mảng rỗng []</span><span class="v">Chạy một lần sau mount (và dọn khi unmount).</span></div>
  <div class="kv"><span class="k">Hàm cleanup</span><span class="v">Trả về từ effect; chạy trước khi chạy lại và khi unmount.</span></div>
  <div class="kv"><span class="k">Stale closure</span><span class="v">Effect đọc giá trị cũ vì thiếu một phụ thuộc.</span></div>
  <div class="kv"><span class="k">Không có mảng</span><span class="v">Effect chạy sau mỗi lần render (hiếm khi là ý bạn muốn).</span></div>
  <div class="kv"><span class="k">exhaustive-deps</span><span class="v">Luật lint bắt phụ thuộc còn thiếu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Mảng phụ thuộc điều khiển khi effect chạy lại: <code>[]</code> một lần, <code>[x]</code> khi x đổi, không có = mỗi render.</li><li>Trả về một hàm cleanup để gỡ timer, subscription và listener.</li><li>Cleanup chạy trước mỗi lần chạy lại và khi unmount — tránh rò rỉ và trùng lặp.</li><li>Theo luật lint <code>exhaustive-deps</code>; thiếu một phụ thuộc gây bug giá trị cũ.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Why effects run twice in dev|||5.3 — Vì sao effect chạy hai lần ở dev',
      slug: 'nextjs-5-3-chay-hai-lan-dev',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'StrictMode cố ý mount rồi unmount rồi mount lại ở dev để lộ effect thiếu cleanup. Cách vá không phải là tắt nó.',
      content: `
${G05_3}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>"My effect runs twice!" — that is React helping you</h2>
<p class="lead">In development, you will see effects run twice on mount. This surprises everyone. It is not a bug and you must not "fix" it by removing StrictMode — it is React deliberately stress-testing your cleanup so a real bug shows up on your machine instead of in production.</p>

<h3>What StrictMode does</h3>
<p>Next.js turns on React <strong>StrictMode</strong> in development. For every component, on its first mount, StrictMode runs each effect, immediately runs its cleanup, then runs the effect again — mount, unmount, mount. Captured live from a real render in dev:</p>
<div class="out">["run","clean","run"]</div>
<p>So an effect that logs "run" on setup and "clean" on cleanup produces <strong>run → clean → run</strong> on a single mount in development. In production this does not happen — the effect runs once. StrictMode is a dev-only x-ray.</p>

<h3>Why on earth would React do this?</h3>
<p>Because it is the cheapest possible way to catch the most common effect bug: <strong>a setup with no matching cleanup.</strong> If your effect opens a connection, starts an interval, or adds a listener but doesn't return a cleanup that closes it, running it twice leaves <em>two</em> connections, two intervals, two listeners — and the bug is visible immediately, on your machine, instead of as a slow leak in production. An effect that survives being run twice with no ill effect is a correct effect.</p>
<pre><code class="language-javascript">useEffect(() =&gt; {
  const id = setInterval(tick, 1000);
  return () =&gt; clearInterval(id);   <span class="tok-comment">// ← without this, StrictMode leaves 2 intervals running</span>
}, []);</code></pre>

<h3>The fix is always the same: make the effect idempotent</h3>
<p>Don't try to detect "is this the second run?" — that fights the tool. Instead, make setup and cleanup a perfect pair, so running the pair any number of times leaves the world in the same state:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Subscribe</span><span class="v">return an unsubscribe.</span></div>
  <div class="kv"><span class="k">setInterval / setTimeout</span><span class="v">return a clearInterval / clearTimeout.</span></div>
  <div class="kv"><span class="k">addEventListener</span><span class="v">return a removeEventListener with the same function.</span></div>
  <div class="kv"><span class="k">Open a connection</span><span class="v">return a close/disconnect.</span></div>
</div>
<p>If you cannot write a cleanup for something, that is a strong sign it should not be in an effect at all — for example, a one-off action that should live in an event handler. The next lesson is exactly that list of "effects that shouldn't be effects".</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it</strong> — the site runs with StrictMode on in dev. Socket.IO connections, event listeners on <code>window</code>, and IntersectionObservers in the feed all pair their setup with a cleanup, precisely so the double-invoke leaves exactly one live connection/observer. When a new feature "connects twice" or a listener fires twice in dev, the fix is never to disable StrictMode — it is to add the missing cleanup.</p>
</div>
<h3>Why StrictMode runs your effect twice</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Only in development, only in StrictMode</b> — Production runs it once. This is a test React performs on your code, not a behaviour users experience.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It mounts, unmounts, mounts again</b> — So the sequence is: effect, cleanup, effect. If your cleanup is correct, the end state is identical to running once.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>A doubled result is a missing cleanup</b> — Two sockets open, two listeners attached, two requests fired — each is the same bug that would appear in production the moment the component re-mounted.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>So do not disable it</b> — The double invocation is finding a real defect. Removing StrictMode hides the symptom and keeps the bug.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a <code>useEffect</code> that fires an analytics event or a POST, seen twice in development.</strong> The instinct is to add a ref guard (<code>if (ran.current) return</code>) so it only happens once. Measured below, that guard hides one bug and creates another. In development the cleanup closed the connection and the guard then stopped the setup from reopening it — zero open connections, silently. And it never bought "once" anyway: a real remount (a key change, a route change back and forth) creates a fresh ref, so the POST ran again, in development and in production. The honest fixes are to make the operation idempotent (send an id the server deduplicates on), or to move it out of an effect entirely: a POST caused by a click belongs in the click handler, where it happens exactly as often as the user asked.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/StrictMode" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">react.dev — StrictMode</span><span class="lc-sub">Everything it double-invokes, and the class of bug each check is hunting.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development" target="_blank" rel="noopener">
  <span class="lc-ico">2️⃣</span>
  <span class="lc-body"><span class="lc-title">react.dev — Handling the effect firing twice</span><span class="lc-sub">The official answer, case by case: fetch, subscription, animation, analytics.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Put a <code>console.log</code> in an effect with <code>[]</code> deps and run in dev; see it log twice, then build + start and see it log once.</li>
<li>Add a cleanup and observe the mount → cleanup → mount sequence Strict Mode forces.</li>
<li>Explain why the double-run is a feature that surfaces missing cleanup, not a bug to silence.</li>
</ol>
<p><strong>Done when:</strong> you understand the Strict Mode double-run and why writing proper cleanup makes it harmless.</p></div>

<h3>🔬 Measured: the same page under next dev and next start (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Three components: one that logs setup and cleanup, a "connection" with and without a cleanup, and the ref guard from the trap above:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useRef, useState } from 'react';

const nhatKy: string[] = [];
function GhiLog() {
  useEffect(() =&gt; {
    nhatKy.push('run');
    return () =&gt; { nhatKy.push('clean'); };
  }, []);
  return null;
}

const ketNoi = { thieu: { mo: 0, nhip: 0 }, du: { mo: 0, nhip: 0 } };
function KetNoi({ ten, donDep }: { ten: 'thieu' | 'du'; donDep: boolean }) {
  useEffect(() =&gt; {
    const k = ketNoi[ten];
    k.mo++;                                        <span class="tok-comment">  // mở một kết nối</span>
    const id = setInterval(() =&gt; { k.nhip++; }, 100);
    if (!donDep) return;                           <span class="tok-comment">  // ✗ không dọn</span>
    return () =&gt; { k.mo--; clearInterval(id); };   <span class="tok-comment">  // ✓ đóng đúng cái đã mở</span>
  }, [ten, donDep]);
  return null;
}

const chot = { post: 0, mo: 0 };
function ChotRef() {
  const ran = useRef(false);
  useEffect(() =&gt; {
    if (ran.current) return;                       <span class="tok-comment">  // ✗ chốt "chỉ chạy một lần"</span>
    ran.current = true;
    chot.post++;                                   <span class="tok-comment">  // giả lập POST analytics</span>
    chot.mo++;                                     <span class="tok-comment">  // mở kết nối</span>
    return () =&gt; { chot.mo--; };                   <span class="tok-comment">  // đóng kết nối</span>
  }, []);
  return null;
}

if (typeof window !== 'undefined') Object.assign(window, { __nhatKy: nhatKy, __ketNoi: ketNoi, __chot: chot }); <span class="tok-comment">  // để đo</span>

export default function HaiLan() {
  const [k, setK] = useState(0);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;GhiLog /&gt;
      &lt;KetNoi ten="thieu" donDep={false} /&gt;
      &lt;KetNoi ten="du" donDep /&gt;
      &lt;ChotRef key={k} /&gt;
      &lt;p&gt;Trang đo effect chạy mấy lần &lt;button id="gan-lai" onClick={() =&gt; setK(k + 1)} className="rounded border px-2"&gt;gắn lại ChotRef (đổi key)&lt;/button&gt;&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|hai-lan'
✓ Compiled successfully in 1158ms
├ ○ /hai-lan
$ curl -s -o /dev/null -w 'next start GET /hai-lan → %{http_code}\\n' localhost:3001/hai-lan
next start GET /hai-lan → 200
$ curl -s -o /dev/null -w 'next dev   GET /hai-lan → %{http_code}\\n' localhost:3000/hai-lan
next dev   GET /hai-lan → 200</div>
<p>Both servers ran side by side; Chromium loaded each, waited, then clicked "gắn lại" (a key change = a real remount):</p>
<div class="out">                         next dev                        next start
effect log after load  : ["run","clean","run"]           ["run"]
no cleanup             : 2 open, 20 ticks/s              1 open, 10 ticks/s
with cleanup           : 1 open, 10 ticks/s              1 open, 10 ticks/s
ref guard, after load  : POST 1, 0 open                  POST 1, 1 open
ref guard, key change  : POST 2, 0 open                  POST 2, 1 open</div>
<p>Development really runs run → clean → run, and the missing cleanup shows up as two connections and double the ticks — production hides it. The ref guard: in dev the connection count dropped to <b>0</b> (closed by the cleanup, never reopened), and after a real remount the POST count reached <b>2</b> in both modes.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001 &amp;
npx next dev -p 3000
<span class="tok-comment"># open both /hai-lan in DevTools console: __nhatKy, JSON.stringify(__ketNoi), JSON.stringify(__chot)</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependencies and cleanup</span><span class="lc-sub">Includes why Strict Mode runs effects twice</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-1-1-connect" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">Socket.IO · 1.1 — Connect</span><span class="lc-sub">The lifecycle of a real connection: open, close, reconnect</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-6-3-exactly-once" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">Socket.IO · 6.3 — Exactly-once</span><span class="lc-sub">A dedupe layer: resending any number of times is harmless</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Strict Mode</span><span class="v">A dev-only wrapper that double-invokes effects to surface bugs.</span></div>
  <div class="kv"><span class="k">Dev vs production</span><span class="v">The double-run happens in dev only, never in the production build.</span></div>
  <div class="kv"><span class="k">Idempotent effect</span><span class="v">An effect safe to run twice because it cleans up after itself.</span></div>
  <div class="kv"><span class="k">Mount/unmount probe</span><span class="v">Strict Mode mounts, cleans up, then mounts again.</span></div>
  <div class="kv"><span class="k">Missing cleanup</span><span class="v">The double-run exposes effects that leak without cleanup.</span></div>
  <div class="kv"><span class="k">Not a bug</span><span class="v">Double firing is intentional, not something to disable.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>In dev, React Strict Mode runs effects twice to expose missing cleanup; production runs them once.</li><li>The sequence is mount → cleanup → mount, which proves whether your effect tears down correctly.</li><li>Write a correct cleanup and the double-run becomes harmless.</li><li>Do not disable Strict Mode to hide it — fix the effect instead.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>"Effect của tôi chạy hai lần!" — đó là React đang giúp bạn</h2>
<p class="lead">Ở môi trường phát triển, bạn sẽ thấy effect chạy hai lần lúc mount. Điều này làm ai cũng bất ngờ. Nó không phải bug và bạn không được "sửa" bằng cách bỏ StrictMode — đó là React cố ý thử sức cleanup của bạn để một bug thật lộ ra trên máy bạn thay vì ở production.</p>

<h3>StrictMode làm gì</h3>
<p>Next.js bật React <strong>StrictMode</strong> ở dev. Với mỗi component, ở lần mount đầu, StrictMode chạy mỗi effect, chạy cleanup của nó ngay, rồi chạy effect lần nữa — mount, unmount, mount. Ghi trực tiếp từ một render thật ở dev:</p>
<div class="out">["run","clean","run"]</div>
<p>Vậy một effect log "run" lúc setup và "clean" lúc cleanup cho ra <strong>run → clean → run</strong> trong một lần mount ở dev. Ở production điều này không xảy ra — effect chạy một lần. StrictMode là một tia X chỉ có ở dev.</p>

<h3>Vì cớ gì React lại làm vậy?</h3>
<p>Vì đó là cách rẻ nhất có thể để bắt bug effect phổ biến nhất: <strong>một setup không có cleanup khớp.</strong> Nếu effect của bạn mở một kết nối, khởi động một interval, hay thêm một listener mà không trả về cleanup để đóng nó, chạy hai lần để lại <em>hai</em> kết nối, hai interval, hai listener — và bug hiện ra ngay, trên máy bạn, thay vì rò rỉ chậm ở production. Một effect sống sót qua hai lần chạy mà không gây hại là một effect đúng.</p>
<pre><code class="language-javascript">useEffect(() =&gt; {
  const id = setInterval(tick, 1000);
  return () =&gt; clearInterval(id);   <span class="tok-comment">// ← thiếu dòng này, StrictMode để lại 2 interval chạy</span>
}, []);</code></pre>

<h3>Cách vá luôn giống nhau: làm effect idempotent</h3>
<p>Đừng cố dò "đây có phải lần chạy thứ hai không?" — làm vậy là chống lại công cụ. Thay vào đó, làm setup và cleanup thành một cặp hoàn hảo, để chạy cặp đó bao nhiêu lần cũng để thế giới ở cùng một trạng thái:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Subscribe</span><span class="v">trả về một unsubscribe.</span></div>
  <div class="kv"><span class="k">setInterval / setTimeout</span><span class="v">trả về một clearInterval / clearTimeout.</span></div>
  <div class="kv"><span class="k">addEventListener</span><span class="v">trả về một removeEventListener với cùng hàm.</span></div>
  <div class="kv"><span class="k">Mở một kết nối</span><span class="v">trả về một close/disconnect.</span></div>
</div>
<p>Nếu bạn không viết được cleanup cho một thứ, đó là dấu hiệu mạnh rằng nó không nên nằm trong một effect chút nào — ví dụ, một hành động một-lần đáng lẽ ở trong một handler sự kiện. Bài sau đúng là danh sách những "effect không nên là effect" đó.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào</strong> — site chạy với StrictMode bật ở dev. Kết nối Socket.IO, listener trên <code>window</code>, và IntersectionObserver trong feed đều ghép setup với một cleanup, chính xác để cú double-invoke để lại đúng một kết nối/observer sống. Khi một tính năng mới "kết nối hai lần" hay một listener nổ hai lần ở dev, cách vá không bao giờ là tắt StrictMode — mà là thêm cleanup còn thiếu.</p>
</div>
<h3>Vì sao StrictMode chạy effect của bạn hai lần</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Chỉ ở môi trường phát triển, chỉ trong StrictMode</b> — Bản production chạy một lần. Đây là một phép thử React làm với mã của bạn, không phải hành vi người dùng gặp phải.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó gắn vào, gỡ ra, rồi gắn lại</b> — Nên trình tự là: effect, dọn dẹp, effect. Nếu phần dọn dẹp của bạn đúng thì trạng thái cuối y hệt như chạy một lần.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Kết quả nhân đôi là dấu hiệu thiếu dọn dẹp</b> — Hai socket mở ra, hai listener gắn vào, hai request bắn đi — mỗi cái đều là đúng cái lỗi sẽ hiện ra trên production ngay khi component được gắn lại.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nên đừng tắt nó đi</b> — Việc gọi hai lần đang tìm ra một khiếm khuyết thật. Gỡ StrictMode là giấu triệu chứng và giữ lại cái lỗi.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một <code>useEffect</code> bắn một sự kiện analytics hay một POST, thấy chạy hai lần ở môi trường phát triển.</strong> Phản xạ là thêm một chốt bằng ref (<code>if (ran.current) return</code>) để nó chỉ xảy ra một lần. Đo ở dưới: cái chốt ấy giấu một lỗi và đẻ thêm một lỗi. Ở môi trường phát triển, cleanup đóng kết nối rồi chốt chặn setup mở lại — không còn kết nối nào, mà chẳng báo gì. Và nó cũng chưa bao giờ đổi được "chỉ một lần": gắn lại thật (đổi key, đổi route đi rồi quay lại) tạo ra một ref mới, nên POST vẫn gửi lần hai, ở cả dev lẫn production. Cách chữa thành thật là làm cho thao tác trở nên lặp-lại-vô-hại (gửi kèm một id để máy chủ khử trùng lặp), hoặc dời hẳn nó ra khỏi effect: một POST do một cú bấm gây ra thì thuộc về handler bấm, nơi nó xảy ra đúng bằng số lần người dùng yêu cầu.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/StrictMode" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">react.dev — StrictMode</span><span class="lc-sub">Mọi thứ nó gọi hai lần, và loại lỗi mà từng phép kiểm đang săn.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development" target="_blank" rel="noopener">
  <span class="lc-ico">2️⃣</span>
  <span class="lc-body"><span class="lc-title">react.dev — Xử lý effect chạy hai lần</span><span class="lc-sub">Câu trả lời chính thức, theo từng ca: fetch, đăng ký, hoạt ảnh, analytics.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Đặt một <code>console.log</code> trong effect với mảng <code>[]</code> và chạy ở dev; thấy nó log hai lần, rồi build + start và thấy log một lần.</li>
<li>Thêm cleanup và quan sát chuỗi mount → cleanup → mount mà Strict Mode ép ra.</li>
<li>Giải thích vì sao chạy hai lần là một tính năng để lộ cleanup còn thiếu, không phải bug cần dập.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn hiểu việc chạy hai lần của Strict Mode và vì sao viết cleanup đúng làm nó vô hại.</p></div>

<h3>🔬 Đo thật: cùng một trang dưới next dev và next start (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Ba component: một cái ghi nhật ký setup và cleanup, một "kết nối" có và không có cleanup, và cái chốt ref trong bẫy ở trên:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useRef, useState } from 'react';

const nhatKy: string[] = [];
function GhiLog() {
  useEffect(() =&gt; {
    nhatKy.push('run');
    return () =&gt; { nhatKy.push('clean'); };
  }, []);
  return null;
}

const ketNoi = { thieu: { mo: 0, nhip: 0 }, du: { mo: 0, nhip: 0 } };
function KetNoi({ ten, donDep }: { ten: 'thieu' | 'du'; donDep: boolean }) {
  useEffect(() =&gt; {
    const k = ketNoi[ten];
    k.mo++;                                        <span class="tok-comment">  // mở một kết nối</span>
    const id = setInterval(() =&gt; { k.nhip++; }, 100);
    if (!donDep) return;                           <span class="tok-comment">  // ✗ không dọn</span>
    return () =&gt; { k.mo--; clearInterval(id); };   <span class="tok-comment">  // ✓ đóng đúng cái đã mở</span>
  }, [ten, donDep]);
  return null;
}

const chot = { post: 0, mo: 0 };
function ChotRef() {
  const ran = useRef(false);
  useEffect(() =&gt; {
    if (ran.current) return;                       <span class="tok-comment">  // ✗ chốt "chỉ chạy một lần"</span>
    ran.current = true;
    chot.post++;                                   <span class="tok-comment">  // giả lập POST analytics</span>
    chot.mo++;                                     <span class="tok-comment">  // mở kết nối</span>
    return () =&gt; { chot.mo--; };                   <span class="tok-comment">  // đóng kết nối</span>
  }, []);
  return null;
}

if (typeof window !== 'undefined') Object.assign(window, { __nhatKy: nhatKy, __ketNoi: ketNoi, __chot: chot }); <span class="tok-comment">  // để đo</span>

export default function HaiLan() {
  const [k, setK] = useState(0);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;GhiLog /&gt;
      &lt;KetNoi ten="thieu" donDep={false} /&gt;
      &lt;KetNoi ten="du" donDep /&gt;
      &lt;ChotRef key={k} /&gt;
      &lt;p&gt;Trang đo effect chạy mấy lần &lt;button id="gan-lai" onClick={() =&gt; setK(k + 1)} className="rounded border px-2"&gt;gắn lại ChotRef (đổi key)&lt;/button&gt;&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|hai-lan'
✓ Compiled successfully in 1158ms
├ ○ /hai-lan
$ curl -s -o /dev/null -w 'next start GET /hai-lan → %{http_code}\\n' localhost:3001/hai-lan
next start GET /hai-lan → 200
$ curl -s -o /dev/null -w 'next dev   GET /hai-lan → %{http_code}\\n' localhost:3000/hai-lan
next dev   GET /hai-lan → 200</div>
<p>Hai máy chủ chạy song song; Chromium tải từng trang, chờ, rồi bấm "gắn lại" (đổi key = gắn lại thật):</p>
<div class="out">                         next dev                        next start
nhật ký effect khi tải : ["run","clean","run"]           ["run"]
thiếu cleanup          : 2 open, 20 ticks/s              1 open, 10 ticks/s
đủ cleanup             : 1 open, 10 ticks/s              1 open, 10 ticks/s
chốt ref, khi tải      : POST 1, 0 open                  POST 1, 1 open
chốt ref, đổi key      : POST 2, 0 open                  POST 2, 1 open</div>
<p>Dev chạy đúng run → clean → run, và lỗi thiếu cleanup lộ ra thành hai kết nối và gấp đôi số nhịp — production giấu nó đi. Chốt ref: ở dev số kết nối tụt về <b>0</b> (cleanup đóng, không mở lại), và sau một lần gắn lại thật số POST thành <b>2</b> ở cả hai chế độ.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001 &amp;
npx next dev -p 3000
<span class="tok-comment"># mở /hai-lan ở cả hai, console DevTools: __nhatKy, JSON.stringify(__ketNoi), JSON.stringify(__chot)</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependency và cleanup</span><span class="lc-sub">Có phần vì sao Strict Mode chạy effect hai lần</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-1-1-connect" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">Socket.IO · 1.1 — Connect</span><span class="lc-sub">Vòng đời một kết nối thật: mở, đóng, gắn lại</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-6-3-exactly-once" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">Socket.IO · 6.3 — Exactly-once</span><span class="lc-sub">Lớp khử trùng lặp: gửi lại bao nhiêu lần cũng vô hại</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Strict Mode</span><span class="v">Lớp bọc chỉ-ở-dev gọi effect hai lần để lộ bug.</span></div>
  <div class="kv"><span class="k">Dev vs production</span><span class="v">Việc chạy hai lần chỉ ở dev, không bao giờ ở bản production.</span></div>
  <div class="kv"><span class="k">Effect idempotent</span><span class="v">Effect an toàn khi chạy hai lần vì nó tự dọn sau mình.</span></div>
  <div class="kv"><span class="k">Mũi dò mount/unmount</span><span class="v">Strict Mode mount, dọn, rồi mount lại.</span></div>
  <div class="kv"><span class="k">Thiếu cleanup</span><span class="v">Việc chạy hai lần phơi ra effect rò rỉ vì thiếu cleanup.</span></div>
  <div class="kv"><span class="k">Không phải bug</span><span class="v">Kích hoạt hai lần là cố ý, không phải thứ cần tắt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ở dev, React Strict Mode chạy effect hai lần để lộ cleanup còn thiếu; production chạy một lần.</li><li>Chuỗi là mount → cleanup → mount, chứng tỏ effect của bạn có gỡ đúng không.</li><li>Viết cleanup đúng thì việc chạy hai lần thành vô hại.</li><li>Đừng tắt Strict Mode để giấu nó — hãy sửa effect.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Effects you should NOT write|||5.4 — Những effect bạn KHÔNG nên viết',
      slug: 'nextjs-5-4-effect-khong-nen-viet',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Phần lớn effect người mới viết là thừa: suy state trong effect, đồng bộ props→state, chạy logic sự kiện trong effect. Cách bỏ chúng.',
      content: `
${G05_4}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Most effects beginners write shouldn't exist</h2>
<p class="lead">useEffect is powerful, so people reach for it constantly — and most of those reaches are wrong. The React team wrote a whole page called "You Might Not Need an Effect" because the overuse is that common. Here are the effects to delete, and what to do instead. An AI assistant will happily write all three; recognising them is a big part of the judgement this course is for.</p>

<h3>Anti-pattern 1 — deriving state in an effect</h3>
<pre><code class="language-javascript"><span class="tok-comment">// ❌ an effect to compute state from other state</span>
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);
useEffect(() =&gt; { setTotal(items.reduce((s, i) =&gt; s + i.price, 0)); }, [items]);

<span class="tok-comment">// ✅ just compute it during render — no effect, no extra state</span>
const [items, setItems] = useState([]);
const total = items.reduce((s, i) =&gt; s + i.price, 0);</code></pre>
<p>This is the derived-state rule from Chapter 3 wearing effect clothing. Computing during render is simpler, always in sync, and avoids an extra render (the effect version renders once with the old total, then again after the effect sets the new one).</p>

<h3>Anti-pattern 2 — syncing props into state</h3>
<pre><code class="language-javascript"><span class="tok-comment">// ❌ copying a prop into state and "keeping it in sync" with an effect</span>
function Profile({ user }) {
  const [name, setName] = useState(user.name);
  useEffect(() =&gt; { setName(user.name); }, [user.name]);   <span class="tok-comment">// fights the prop</span>

<span class="tok-comment">// ✅ if it's really just the prop, use the prop; if you need editable local state,</span>
<span class="tok-comment">//    reset it with a key instead (Chapter 7).</span>
}</code></pre>
<p>Copying props into state creates two sources of truth that you then spend effects trying to reconcile — exactly the bug React is built to prevent. Use the prop directly, or, when you truly need a local editable copy that resets when the prop changes, give the component a <code>key</code> so React remounts it (Chapter 7).</p>

<h3>Anti-pattern 3 — putting event logic in an effect</h3>
<pre><code class="language-javascript"><span class="tok-comment">// ❌ react to a state change with an effect to send an analytics event</span>
useEffect(() =&gt; {
  if (submitted) fetch('/api/track', { method: 'POST' });
}, [submitted]);

<span class="tok-comment">// ✅ the event caused it — do it in the handler where the event happened</span>
function handleSubmit() {
  setSubmitted(true);
  fetch('/api/track', { method: 'POST' });
}</code></pre>
<p>If something should happen <em>because the user did X</em>, that logic belongs in the handler for X, not in an effect watching a state flag. Effects are for synchronising with external systems, not for reacting to events — the handler already knows the event happened, with all its context.</p>

<h3>The test: "am I synchronising, or reacting?"</h3>
<p>Before writing an effect, ask what it is for. If the answer is "keep an external system in step with my state" (a subscription, the document title, a non-React widget) — it's a real effect. If the answer is "compute a value", "copy a prop", or "respond to a click" — it is not an effect, and there is a simpler place for it. When in doubt, read the react.dev page below; it has a decision tree for exactly this.</p>

<h3>Four effects that should not exist</h3>
<div class="lz-map">
  <div class="lz-stage">Each one has a simpler replacement</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Transforming data for rendering</div><div class="lz-nsub"><code>useEffect(() =&gt; setVisible(items.filter(…)))</code>. Compute it during render — it is always in sync and costs one line.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Handling a user event</div><div class="lz-nsub"><code>useEffect(() =&gt; { if (submitted) send() })</code>. Put the call in the submit handler, where the cause actually is.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Resetting state when a prop changes</div><div class="lz-nsub">An effect that clears a form when the id changes. Pass a <code>key</code> instead and let React remount the component.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Chaining state updates</div><div class="lz-nsub">One effect sets state that triggers another effect. Each link is a render; compute the final value in one place instead.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — an effect that sets state on a dependency it also changes.</strong> <code>useEffect(() =&gt; { setTotal(items.length) }, [items, total])</code> looks like an infinite loop — the effect sets <code>total</code>, which is a dependency — but measured it ran twice and stopped: the second run sets the <em>same</em> value and React bails out. A real loop needs a new value every time, like <code>setN(n + 1)</code> with <code>[n]</code>: in production that rendered tens of thousands of times a second with no message at all, while development filled the console with "Maximum update depth exceeded … calls setState inside useEffect, but useEffect either doesn&#39;t have a dependency array, or one of the dependencies changes on every render" — so the message does name the effect and its array. The same shape appears more subtly when the dependency is an object or array literal created during render — it is a new reference every time, so the effect re-runs on every render even though nothing changed. Read the array as a claim: &quot;these are the values I read&quot;. If one of them is also a value you write, the effect is the wrong tool.</p></div>
<a class="link-card dl" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">react.dev — You Might Not Need an Effect</span><span class="lc-sub">The canonical list, with the before-and-after code for each case.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/separating-events-from-effects" target="_blank" rel="noopener">
  <span class="lc-ico">🪓</span>
  <span class="lc-body"><span class="lc-title">react.dev — Separating events from Effects</span><span class="lc-sub">How to tell which logic is reactive and which is a one-off — the distinction this lesson rests on.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Find an effect that only computes a value from state/props and delete it — compute during render instead.</li>
<li>Replace an effect that resets state when a prop changes with a <code>key</code> on the component (remount instead).</li>
<li>Move data-changing logic out of an effect and into the event handler that caused it.</li>
</ol>
<p><strong>Done when:</strong> you can spot the three most common unnecessary effects and remove each the right way.</p></div>

<h3>🔬 Measured: what each unnecessary effect costs (React 19.3.0 · Next.js 16.4.6)</h3>
<p>One page, each anti-pattern next to its fix, render counts kept in a module variable:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

const dem: Record&lt;string, number&gt; = {};
const tang = (k: string) =&gt; { dem[k] = (dem[k] ?? 0) + 1; };        <span class="tok-comment">  // đếm render (đo dưới next start)</span>

<span class="tok-comment">// 1 — dẫn xuất state trong effect</span>
function GioEffect({ items }: { items: number[] }) {
  tang('gioEffect');
  const [total, setTotal] = useState(0);
  useEffect(() =&gt; { setTotal(items.reduce((s, x) =&gt; s + x, 0)); }, [items]); <span class="tok-comment">  // ✗</span>
  return &lt;p&gt;effect: tổng &lt;b id="t-e"&gt;{total}&lt;/b&gt;&lt;/p&gt;;
}
function GioRender({ items }: { items: number[] }) {
  tang('gioRender');
  const total = items.reduce((s, x) =&gt; s + x, 0);                          <span class="tok-comment">  // ✓</span>
  return &lt;p&gt;render: tổng &lt;b id="t-r"&gt;{total}&lt;/b&gt;&lt;/p&gt;;
}

<span class="tok-comment">// 2 — đặt lại state khi prop đổi</span>
function HoSoEffect({ user }: { user: string }) {
  tang('hoSoEffect');
  const [nhap, setNhap] = useState(user);
  useEffect(() =&gt; { setNhap(user); }, [user]);                             <span class="tok-comment">  // ✗</span>
  return &lt;input id="hs-e" value={nhap} onChange={(e) =&gt; setNhap(e.target.value)} className="rounded border px-1" /&gt;;
}
function HoSoKey({ user }: { user: string }) {
  tang('hoSoKey');
  const [nhap, setNhap] = useState(user);                                  <span class="tok-comment">  // ✓ cha đặt key={user}</span>
  return &lt;input id="hs-k" value={nhap} onChange={(e) =&gt; setNhap(e.target.value)} className="rounded border px-1" /&gt;;
}

<span class="tok-comment">// 3 — logic sự kiện trong effect</span>
const post = { effect: 0, handler: 0 };
function TheoDoi({ daGui }: { daGui: boolean }) {
  useEffect(() =&gt; { if (daGui) post.effect++; }, [daGui]);                 <span class="tok-comment">  // ✗ phản ứng theo cờ</span>
  return &lt;span&gt;📊&lt;/span&gt;;
}

<span class="tok-comment">// 4 — effect đặt state lên chính phụ thuộc của nó</span>
function VongWeb({ items }: { items: number[] }) {
  const [total, setTotal] = useState(0);
  useEffect(() =&gt; { tang('vongWebEffect'); setTotal(items.length); }, [items, total]); <span class="tok-comment">  // ví dụ của bài web</span>
  return &lt;span id="vw"&gt;{total}&lt;/span&gt;;
}
function VongThat() {
  const [n, setN] = useState(0);
  useEffect(() =&gt; { setN(n + 1); }, [n]);                                  <span class="tok-comment">  // ✗ mỗi lần một giá trị mới</span>
  return &lt;span id="vt"&gt;{n}&lt;/span&gt;;
}

<span class="tok-comment">// 5 — chuỗi effect</span>
function Chuoi() {
  tang('chuoi');
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  useEffect(() =&gt; { setB(a * 2); }, [a]);
  useEffect(() =&gt; { setC(b + 1); }, [b]);
  return &lt;button id="ch" onClick={() =&gt; setA(a + 1)} className="rounded border px-2"&gt;a={a} b={b} c={c}&lt;/button&gt;;
}

if (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __post: post }); <span class="tok-comment">  // để đo</span>

const ITEMS = [[10, 20], [10, 20, 30]];
export default function KhongNen() {
  const [i, setI] = useState(0);
  const [user, setUser] = useState('An');
  const [daGui, setDaGui] = useState(false);
  const [kTheoDoi, setKTheoDoi] = useState(0);
  const [vong, setVong] = useState(false);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;GioEffect items={ITEMS[i]!} /&gt; &lt;GioRender items={ITEMS[i]!} /&gt;
      &lt;button id="them" onClick={() =&gt; setI(1)} className="rounded border px-2"&gt;thêm món 30&lt;/button&gt;
      &lt;p&gt;&lt;HoSoEffect user={user} /&gt; &lt;HoSoKey key={user} user={user} /&gt;{' '}
        &lt;button id="doi" onClick={() =&gt; setUser('Bình')} className="rounded border px-2"&gt;đổi người dùng&lt;/button&gt;&lt;/p&gt;
      &lt;p&gt;&lt;TheoDoi key={kTheoDoi} daGui={daGui} /&gt;{' '}
        &lt;button id="gui" onClick={() =&gt; { setDaGui(true); post.handler++; }} className="rounded border px-2"&gt;gửi&lt;/button&gt;{' '}
        &lt;button id="lai" onClick={() =&gt; setKTheoDoi(kTheoDoi + 1)} className="rounded border px-2"&gt;quay lại tab (gắn lại)&lt;/button&gt;&lt;/p&gt;
      &lt;p&gt;bài web: &lt;VongWeb items={ITEMS[0]!} /&gt; · {vong &amp;&amp; &lt;VongThat /&gt;}{' '}
        &lt;button id="vong" onClick={() =&gt; setVong(!vong)} className="rounded border px-2"&gt;vòng lặp thật&lt;/button&gt;&lt;/p&gt;
      &lt;Chuoi /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint src/app/khong-nen/page.tsx
11:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders
24:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders
43:44  error  Error: Calling setState synchronously within an effect can trigger cascading renders
48:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders
58:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders
59:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders
✖ 6 problems (6 errors, 0 warnings)
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|khong-nen'
✓ Compiled successfully in 1309ms
├ ○ /khong-nen</div>
<p>ESLint 7 already reports every <code>setState</code> called synchronously in an effect body (<code>react-hooks/set-state-in-effect</code>) — yet <code>next build</code> compiles it, because Next.js 16 does not lint during the build. Clicking through in Chromium:</p>
<div class="out">                                  effect version   fixed version
1 derived total — renders on load : 2                1
                — after adding 30 : +2               +1
                — frames painted  : 30 | 30  →  30 | 60  →  60 | 60
2 prop → state  — after user change: +2               +1   (key)
                — frames painted  : Anx | Anx  →  Anx | Bình  →  Bình | Bình
3 event in effect — POSTs after remount, no click: effect 2 · handler 1
chain of 2 effects — renders for one click: 3  ("a=1 b=2 c=3")
the lesson's loop example — effect runs: 2 (then stops)
setN(n + 1) with [n], next start, 1 s : 44,132 renders · console: 0
setN(n + 1) with [n], next dev, 1.5 s : 275 × "Maximum update depth exceeded…"</div>
<p>Every fix rendered once where the effect rendered twice, and two of them let a stale frame reach the screen. The analytics effect sent a POST nobody clicked for. And only a value that changes every time truly loops — silently in production.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npx eslint src/app/khong-nen/page.tsx
npm run build &amp;&amp; npm start    <span class="tok-comment">  # open /khong-nen, console: JSON.stringify(__dem), JSON.stringify(__post)</span>
<span class="tok-comment"># "vòng lặp thật": watch the number race — then click it again to unmount and stop it</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-2-khong-can" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.2 — You might not need an effect</span><span class="lc-sub">Compute in render, reset with a key, act in handlers</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-3-vong-lap" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.3 — Infinite loops and stale closures</span><span class="lc-sub">Unstable dependencies and useEffectEvent</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-ex13-useeffect" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 13 — useEffect</span><span class="lc-sub">The university exercise on useEffect</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Unnecessary effect</span><span class="v">An effect doing work that belongs in render or an event handler.</span></div>
  <div class="kv"><span class="k">Derive in render</span><span class="v">Compute values from state/props directly, not in an effect.</span></div>
  <div class="kv"><span class="k">Reset via key</span><span class="v">Change a component's <code>key</code> to reset its state by remounting.</span></div>
  <div class="kv"><span class="k">Event logic</span><span class="v">Do user-triggered work in the handler, not in an effect that watches state.</span></div>
  <div class="kv"><span class="k">Chained effects</span><span class="v">Effects that set state to trigger more effects — avoid.</span></div>
  <div class="kv"><span class="k">You Might Not Need an Effect</span><span class="v">The React docs guide this lesson follows.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Many effects are unnecessary: if a value can be computed during render, do not store it via an effect.</li><li>To reset state when a prop changes, give the component a <code>key</code> instead of an effect.</li><li>Put user-triggered logic in the event handler, not in an effect that watches state.</li><li>Avoid chains of effects that set state to trigger more effects.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">react.dev — You Might Not Need an Effect</span><span class="lc-sub">The single most valuable page for writing good React. Read it after this lesson; you will delete effects.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Phần lớn effect người mới viết lẽ ra không nên tồn tại</h2>
<p class="lead">useEffect mạnh, nên người ta với tay tới nó liên tục — và phần lớn những cú với đó là sai. Đội React viết hẳn một trang tên "You Might Not Need an Effect" vì lạm dụng phổ biến tới mức đó. Đây là những effect cần xoá, và làm gì thay thế. Một trợ lý AI sẽ vui vẻ viết cả ba; nhận ra chúng là một phần lớn cái phán đoán mà khoá này hướng tới.</p>

<h3>Phản mẫu 1 — suy state trong một effect</h3>
<pre><code class="language-javascript"><span class="tok-comment">// ❌ một effect để tính state từ state khác</span>
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);
useEffect(() =&gt; { setTotal(items.reduce((s, i) =&gt; s + i.price, 0)); }, [items]);

<span class="tok-comment">// ✅ chỉ cần tính trong lúc render — không effect, không state thừa</span>
const [items, setItems] = useState([]);
const total = items.reduce((s, i) =&gt; s + i.price, 0);</code></pre>
<p>Đây là quy tắc state-suy-ra từ Chương 3 khoác áo effect. Tính trong lúc render thì đơn giản hơn, luôn đồng bộ, và tránh một lần render thừa (bản effect render một lần với total cũ, rồi render lần nữa sau khi effect set giá trị mới).</p>

<h3>Phản mẫu 2 — đồng bộ props vào state</h3>
<pre><code class="language-javascript"><span class="tok-comment">// ❌ chép một prop vào state rồi "giữ đồng bộ" bằng một effect</span>
function Profile({ user }) {
  const [name, setName] = useState(user.name);
  useEffect(() =&gt; { setName(user.name); }, [user.name]);   <span class="tok-comment">// đánh nhau với prop</span>

<span class="tok-comment">// ✅ nếu thật ra chỉ là prop, dùng prop; nếu cần state cục bộ sửa được,</span>
<span class="tok-comment">//    reset nó bằng một key thay vì effect (Chương 7).</span>
}</code></pre>
<p>Chép props vào state tạo hai nguồn sự thật mà bạn rồi phải tốn effect để hoà giải — đúng cái bug React sinh ra để ngăn. Dùng prop trực tiếp, hoặc, khi thật sự cần một bản sao cục bộ sửa được mà reset khi prop đổi, cho component một <code>key</code> để React remount nó (Chương 7).</p>

<h3>Phản mẫu 3 — đặt logic sự kiện trong một effect</h3>
<pre><code class="language-javascript"><span class="tok-comment">// ❌ phản ứng một thay đổi state bằng effect để gửi sự kiện analytics</span>
useEffect(() =&gt; {
  if (submitted) fetch('/api/track', { method: 'POST' });
}, [submitted]);

<span class="tok-comment">// ✅ sự kiện gây ra nó — làm trong handler nơi sự kiện xảy ra</span>
function handleSubmit() {
  setSubmitted(true);
  fetch('/api/track', { method: 'POST' });
}</code></pre>
<p>Nếu một thứ nên xảy ra <em>vì người dùng làm X</em>, logic đó thuộc về handler của X, không phải một effect canh một cờ state. Effect để đồng bộ với hệ thống bên ngoài, không phải để phản ứng sự kiện — handler đã biết sự kiện xảy ra rồi, với đủ ngữ cảnh của nó.</p>

<h3>Phép thử: "mình đang đồng bộ, hay đang phản ứng?"</h3>
<p>Trước khi viết một effect, hãy hỏi nó để làm gì. Nếu câu trả lời là "giữ một hệ thống bên ngoài bước cùng state của mình" (một subscription, tiêu đề trang, một widget không-phải-React) — đó là effect thật. Nếu câu trả lời là "tính một giá trị", "chép một prop", hay "phản hồi một cú click" — nó không phải effect, và có một chỗ đơn giản hơn cho nó. Khi phân vân, đọc trang react.dev bên dưới; nó có một cây quyết định cho đúng việc này.</p>

<h3>Bốn effect lẽ ra không nên tồn tại</h3>
<div class="lz-map">
  <div class="lz-stage">Cái nào cũng có thứ thay thế đơn giản hơn</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Biến đổi dữ liệu để vẽ ra</div><div class="lz-nsub"><code>useEffect(() =&gt; setVisible(items.filter(…)))</code>. Hãy tính nó trong lúc render — nó luôn đồng bộ và tốn một dòng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Xử lý một sự kiện người dùng</div><div class="lz-nsub"><code>useEffect(() =&gt; { if (submitted) send() })</code>. Hãy đặt lời gọi vào handler submit, nơi nguyên nhân thật sự nằm ở đó.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Đặt lại state khi một prop đổi</div><div class="lz-nsub">Một effect xoá trắng form khi id đổi. Hãy truyền một <code>key</code> thay thế và để React dựng lại component.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Nối chuỗi các lần cập nhật state</div><div class="lz-nsub">Một effect đặt state, kéo theo một effect khác. Mỗi mắt xích là một lần render; hãy tính giá trị cuối ở một chỗ thôi.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một effect đặt state lên chính cái phụ thuộc mà nó cũng thay đổi.</strong> <code>useEffect(() =&gt; { setTotal(items.length) }, [items, total])</code> trông như lặp vô tận — effect đặt <code>total</code>, mà <code>total</code> là một phụ thuộc — nhưng đo thật thì nó chạy hai lần rồi dừng: lần hai đặt <em>cùng</em> giá trị nên React bỏ qua. Lặp thật cần một giá trị mới mỗi lần, như <code>setN(n + 1)</code> với <code>[n]</code>: ở production nó render hàng chục nghìn lần mỗi giây mà không một dòng báo lỗi, còn ở dev console đầy "Maximum update depth exceeded … calls setState inside useEffect, but useEffect either doesn&#39;t have a dependency array, or one of the dependencies changes on every render" — tức là thông điệp CÓ nói thẳng tới effect và cái mảng. Cùng hình dạng ấy hiện ra tinh vi hơn khi phụ thuộc là một object hay mảng viết thẳng trong lúc render — nó là một tham chiếu mới mỗi lần, nên effect chạy lại ở mọi lần render dù chẳng có gì đổi. Hãy đọc cái mảng như một lời khẳng định: &quot;đây là những giá trị tôi ĐỌC&quot;. Nếu một trong số đó cũng là giá trị bạn GHI thì effect là công cụ sai.</p></div>
<a class="link-card dl" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">react.dev — Có thể bạn không cần Effect</span><span class="lc-sub">Danh sách kinh điển, kèm mã trước-và-sau cho từng ca.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/separating-events-from-effects" target="_blank" rel="noopener">
  <span class="lc-ico">🪓</span>
  <span class="lc-body"><span class="lc-title">react.dev — Tách sự kiện khỏi Effect</span><span class="lc-sub">Cách phân biệt logic nào là phản ứng và logic nào chỉ chạy một lần — chỗ phân biệt mà bài này dựa vào.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tìm một effect chỉ tính một giá trị từ state/props và xoá nó — tính trong lúc render thay vì vậy.</li>
<li>Thay một effect reset state khi prop đổi bằng một <code>key</code> trên component (remount thay vì vậy).</li>
<li>Chuyển logic đổi dữ liệu ra khỏi effect và vào đúng event handler đã gây ra nó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nhận ra ba effect thừa phổ biến nhất và gỡ từng cái đúng cách.</p></div>

<h3>🔬 Đo thật: mỗi effect thừa tốn gì (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Một trang, mỗi phản mẫu đặt cạnh bản sửa, số lần render giữ trong một biến cấp module:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

const dem: Record&lt;string, number&gt; = {};
const tang = (k: string) =&gt; { dem[k] = (dem[k] ?? 0) + 1; };        <span class="tok-comment">  // đếm render (đo dưới next start)</span>

<span class="tok-comment">// 1 — dẫn xuất state trong effect</span>
function GioEffect({ items }: { items: number[] }) {
  tang('gioEffect');
  const [total, setTotal] = useState(0);
  useEffect(() =&gt; { setTotal(items.reduce((s, x) =&gt; s + x, 0)); }, [items]); <span class="tok-comment">  // ✗</span>
  return &lt;p&gt;effect: tổng &lt;b id="t-e"&gt;{total}&lt;/b&gt;&lt;/p&gt;;
}
function GioRender({ items }: { items: number[] }) {
  tang('gioRender');
  const total = items.reduce((s, x) =&gt; s + x, 0);                          <span class="tok-comment">  // ✓</span>
  return &lt;p&gt;render: tổng &lt;b id="t-r"&gt;{total}&lt;/b&gt;&lt;/p&gt;;
}

<span class="tok-comment">// 2 — đặt lại state khi prop đổi</span>
function HoSoEffect({ user }: { user: string }) {
  tang('hoSoEffect');
  const [nhap, setNhap] = useState(user);
  useEffect(() =&gt; { setNhap(user); }, [user]);                             <span class="tok-comment">  // ✗</span>
  return &lt;input id="hs-e" value={nhap} onChange={(e) =&gt; setNhap(e.target.value)} className="rounded border px-1" /&gt;;
}
function HoSoKey({ user }: { user: string }) {
  tang('hoSoKey');
  const [nhap, setNhap] = useState(user);                                  <span class="tok-comment">  // ✓ cha đặt key={user}</span>
  return &lt;input id="hs-k" value={nhap} onChange={(e) =&gt; setNhap(e.target.value)} className="rounded border px-1" /&gt;;
}

<span class="tok-comment">// 3 — logic sự kiện trong effect</span>
const post = { effect: 0, handler: 0 };
function TheoDoi({ daGui }: { daGui: boolean }) {
  useEffect(() =&gt; { if (daGui) post.effect++; }, [daGui]);                 <span class="tok-comment">  // ✗ phản ứng theo cờ</span>
  return &lt;span&gt;📊&lt;/span&gt;;
}

<span class="tok-comment">// 4 — effect đặt state lên chính phụ thuộc của nó</span>
function VongWeb({ items }: { items: number[] }) {
  const [total, setTotal] = useState(0);
  useEffect(() =&gt; { tang('vongWebEffect'); setTotal(items.length); }, [items, total]); <span class="tok-comment">  // ví dụ của bài web</span>
  return &lt;span id="vw"&gt;{total}&lt;/span&gt;;
}
function VongThat() {
  const [n, setN] = useState(0);
  useEffect(() =&gt; { setN(n + 1); }, [n]);                                  <span class="tok-comment">  // ✗ mỗi lần một giá trị mới</span>
  return &lt;span id="vt"&gt;{n}&lt;/span&gt;;
}

<span class="tok-comment">// 5 — chuỗi effect</span>
function Chuoi() {
  tang('chuoi');
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  useEffect(() =&gt; { setB(a * 2); }, [a]);
  useEffect(() =&gt; { setC(b + 1); }, [b]);
  return &lt;button id="ch" onClick={() =&gt; setA(a + 1)} className="rounded border px-2"&gt;a={a} b={b} c={c}&lt;/button&gt;;
}

if (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __post: post }); <span class="tok-comment">  // để đo</span>

const ITEMS = [[10, 20], [10, 20, 30]];
export default function KhongNen() {
  const [i, setI] = useState(0);
  const [user, setUser] = useState('An');
  const [daGui, setDaGui] = useState(false);
  const [kTheoDoi, setKTheoDoi] = useState(0);
  const [vong, setVong] = useState(false);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;GioEffect items={ITEMS[i]!} /&gt; &lt;GioRender items={ITEMS[i]!} /&gt;
      &lt;button id="them" onClick={() =&gt; setI(1)} className="rounded border px-2"&gt;thêm món 30&lt;/button&gt;
      &lt;p&gt;&lt;HoSoEffect user={user} /&gt; &lt;HoSoKey key={user} user={user} /&gt;{' '}
        &lt;button id="doi" onClick={() =&gt; setUser('Bình')} className="rounded border px-2"&gt;đổi người dùng&lt;/button&gt;&lt;/p&gt;
      &lt;p&gt;&lt;TheoDoi key={kTheoDoi} daGui={daGui} /&gt;{' '}
        &lt;button id="gui" onClick={() =&gt; { setDaGui(true); post.handler++; }} className="rounded border px-2"&gt;gửi&lt;/button&gt;{' '}
        &lt;button id="lai" onClick={() =&gt; setKTheoDoi(kTheoDoi + 1)} className="rounded border px-2"&gt;quay lại tab (gắn lại)&lt;/button&gt;&lt;/p&gt;
      &lt;p&gt;bài web: &lt;VongWeb items={ITEMS[0]!} /&gt; · {vong &amp;&amp; &lt;VongThat /&gt;}{' '}
        &lt;button id="vong" onClick={() =&gt; setVong(!vong)} className="rounded border px-2"&gt;vòng lặp thật&lt;/button&gt;&lt;/p&gt;
      &lt;Chuoi /&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint src/app/khong-nen/page.tsx
11:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders
24:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders
43:44  error  Error: Calling setState synchronously within an effect can trigger cascading renders
48:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders
58:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders
59:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders
✖ 6 problems (6 errors, 0 warnings)
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|khong-nen'
✓ Compiled successfully in 1309ms
├ ○ /khong-nen</div>
<p>ESLint 7 đã báo mọi <code>setState</code> gọi đồng bộ trong thân effect (<code>react-hooks/set-state-in-effect</code>) — vậy mà <code>next build</code> vẫn biên dịch được, vì Next.js 16 không lint lúc build. Bấm qua trên Chromium:</p>
<div class="out">                                  bản effect       bản đã sửa
1 tổng dẫn xuất — render lúc tải  : 2                1
                — sau khi thêm 30 : +2               +1
                — khung hình vẽ   : 30 | 30  →  30 | 60  →  60 | 60
2 prop → state  — sau khi đổi user: +2               +1   (key)
                — khung hình vẽ   : Anx | Anx  →  Anx | Bình  →  Bình | Bình
3 sự kiện trong effect — POST sau khi gắn lại, không bấm: effect 2 · handler 1
chuỗi 2 effect — render cho một cú bấm: 3  ("a=1 b=2 c=3")
ví dụ vòng lặp của bài — effect chạy: 2 (rồi dừng)
setN(n + 1) với [n], next start, 1 s  : 44,132 renders · console: 0
setN(n + 1) với [n], next dev, 1,5 s : 275 × "Maximum update depth exceeded…"</div>
<p>Bản sửa nào cũng render một lần ở chỗ bản effect render hai lần, và hai trong số đó để lọt một khung hình cũ ra màn hình. Effect gửi số liệu đã gửi một POST không ai bấm. Và chỉ giá trị đổi mỗi lần mới thật sự lặp — âm thầm ở production.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npx eslint src/app/khong-nen/page.tsx
npm run build &amp;&amp; npm start    <span class="tok-comment">  # mở /khong-nen, console: JSON.stringify(__dem), JSON.stringify(__post)</span>
<span class="tok-comment"># "vòng lặp thật": xem con số chạy — rồi bấm lại để gỡ component và dừng nó</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-2-khong-can" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.2 — Có thể bạn không cần effect</span><span class="lc-sub">Tính trong render, reset bằng key, làm trong handler</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-3-vong-lap" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.3 — Vòng lặp vô hạn và closure cũ</span><span class="lc-sub">Phụ thuộc không ổn định và useEffectEvent</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-8-ex13-useeffect" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · Exercise 13 — useEffect</span><span class="lc-sub">Bài tập trên trường về useEffect</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Effect thừa</span><span class="v">Effect làm việc lẽ ra thuộc về render hoặc event handler.</span></div>
  <div class="kv"><span class="k">Dẫn xuất trong render</span><span class="v">Tính giá trị thẳng từ state/props, không trong effect.</span></div>
  <div class="kv"><span class="k">Reset bằng key</span><span class="v">Đổi <code>key</code> của component để reset state bằng remount.</span></div>
  <div class="kv"><span class="k">Logic sự kiện</span><span class="v">Làm việc do người dùng kích hoạt trong handler, không phải effect rình state.</span></div>
  <div class="kv"><span class="k">Effect dây chuyền</span><span class="v">Effect set state để kích thêm effect — nên tránh.</span></div>
  <div class="kv"><span class="k">You Might Not Need an Effect</span><span class="v">Trang tài liệu React mà bài này theo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Nhiều effect là thừa: nếu một giá trị tính được trong lúc render, đừng lưu nó qua effect.</li><li>Để reset state khi prop đổi, hãy cho component một <code>key</code> thay vì một effect.</li><li>Đặt logic do người dùng kích hoạt vào event handler, không vào effect rình state.</li><li>Tránh chuỗi effect set state để kích thêm effect.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">react.dev — You Might Not Need an Effect</span><span class="lc-sub">Trang giá trị nhất để viết React tốt. Đọc sau bài này; bạn sẽ xoá bớt effect.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Fetching data & the race condition|||5.5 — Fetch dữ liệu & cuộc đua',
      slug: 'nextjs-5-5-fetch-va-cuoc-dua',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Fetch trong effect thì phải chống đua bằng cờ bỏ-qua trong cleanup — và trong Next.js, phần lớn việc này chuyển sang Server Components.',
      content: `
${G05_5}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Fetching in an effect — and the bug that hides in it</h2>
<p class="lead">The most common effect people write is "fetch data when this component mounts or its id changes". It works, and it hides a race condition that only shows up when responses come back out of order. You must handle it, and then — in Next.js — you will often not write this effect at all.</p>

<h3>The naive version, and why it races</h3>
<pre><code class="language-javascript">function Profile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() =&gt; {
    fetch(<code>/api/users/\${userId}</code>)
      .then(r =&gt; r.json())
      .then(setUser);           <span class="tok-comment">// ❌ what if userId changed while this was in flight?</span>
  }, [userId]);
}</code></pre>
<p>Imagine <code>userId</code> goes 1 → 2 quickly. Two fetches are now in flight. If the response for <strong>1</strong> arrives <em>after</em> the response for 2 (networks do this), <code>setUser</code> runs last with user 1's data — and you show the wrong profile, with no error anywhere. This is a race condition, and it is invisible until it bites a real user on a slow connection.</p>

<h3>The fix: an "ignore" flag in the cleanup</h3>
<pre><code class="language-javascript">useEffect(() =&gt; {
  let ignore = false;
  fetch(<code>/api/users/\${userId}</code>)
    .then(r =&gt; r.json())
    .then(data =&gt; { if (!ignore) setUser(data); });   <span class="tok-comment">// only apply if still current</span>
  return () =&gt; { ignore = true; };                      <span class="tok-comment">// cleanup marks this fetch stale</span>
}, [userId]);</code></pre>
<p>Now, when <code>userId</code> changes, React runs the cleanup of the old effect first (Lesson 5.2) — setting its <code>ignore</code> to <code>true</code> — before starting the new one. The stale response still arrives, but its <code>if (!ignore)</code> is now false, so it is dropped. Only the current request updates state. This same flag also handles the StrictMode double-run cleanly, which is a bonus of doing it right.</p>

<h3>In Next.js, you often skip this entirely</h3>
<p>Everything above is client-side fetching, and it is genuinely fiddly — loading states, error states, races, caching. This is a big reason the Next.js App Router exists. In a <strong>Server Component</strong> (Chapters 9–10) you fetch data on the server, before the page is sent, with a plain <code>await</code> and no effect, no <code>useState</code>, no race:</p>
<pre><code class="language-javascript">// A Server Component — runs on the server
async function Profile({ userId }) {
  const user = await getUser(userId);   <span class="tok-comment">// just await; no effect, no loading state to juggle</span>
  return &lt;h1&gt;{user.name}&lt;/h1&gt;;
}</code></pre>
<p>You still use effect-based fetching for data that must load <em>in response to user interaction after the page is live</em> (typeahead search, infinite scroll), and libraries like TanStack Query (Chapter 14) wrap the races and caching for you. But the default "load the page's data" case moves to the server. Learn the effect version — you'll need it, and it teaches the mechanics — then be glad Next.js lets you avoid it for most pages.</p>

<div class="callout ok">
<p><strong>Effects, in one paragraph.</strong> An effect synchronises an external system with your state; it runs after render, re-runs when its dependencies change, and cleans up before each re-run and on unmount. In dev it runs twice to prove your cleanup is right. Most effects you're tempted to write are really derived state, event logic, or data fetching that belongs on the server. Next up, Chapter 6: the rest of the hooks — <code>useRef</code>, <code>useMemo</code>, <code>useCallback</code>, <code>useReducer</code>, <code>useContext</code>, and writing your own.</p>
</div>
<h3>Fetching in an effect, without the race</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>The user types fast</b> — Three keystrokes fire three requests. They come back in whatever order the network decides, not the order you sent them.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>So the slow one can land last</b> — Request for &quot;ab&quot; resolves after the request for &quot;abc&quot;, and the results shown belong to a query the user has already moved past.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Ignore stale responses</b> — A local <code>let ignore = false</code> captured by the effect, set to <code>true</code> in the cleanup. Check it before calling <code>setState</code>.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Or cancel with AbortController</b> — <code>signal</code> into <code>fetch</code>, <code>controller.abort()</code> in the cleanup. This also stops the request rather than merely ignoring it.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — the race that only appears on a slow connection, and only sometimes.</strong> An effect that fetches on every keystroke works perfectly on localhost, where every response arrives in two milliseconds in the order it was sent. On a real network the ordering is not guaranteed, so the search results occasionally show the wrong query — and because it depends on timing, it will not reproduce when you go looking. Throttle your DevTools network to Slow 3G and type quickly; the bug appears immediately. Then add the <code>ignore</code> flag or the abort signal. In Next.js, the better answer is often to move the fetch to a Server Component or a data library, where this is handled for you.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/useEffect#fetching-data-with-effects" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">react.dev — Fetching data with Effects</span><span class="lc-sub">The ignore-flag pattern, and why React recommends a framework or library instead.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noopener">
  <span class="lc-ico">🛑</span>
  <span class="lc-body"><span class="lc-title">MDN — AbortController</span><span class="lc-sub">Cancelling a fetch properly, including what error it throws when you do.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Fetch data in an effect keyed on a search term; type fast and watch an older response overwrite a newer one.</li>
<li>Fix the race with an <code>ignore</code> flag (or <code>AbortController</code>) in the cleanup so stale responses are dropped.</li>
<li>Note why Chapter 10's Server Components remove this whole problem for initial data.</li>
</ol>
<p><strong>Done when:</strong> you can reproduce a fetch race and fix it with a cleanup guard.</p></div>

<h3>🔬 Measured: the race, both fixes, and the server version (React 19.3.0 · Next.js 16.4.6)</h3>
<p>A fake API (a Route Handler — Chapter 11) answers user 1 slowly and user 2 fast; three components fetch the same user three ways; and a Server Component fetches it with a plain <code>await</code>:</p>
<pre><code class="language-typescript">const TEN: Record&lt;string, string&gt; = { '1': 'An (người dùng 1)', '2': 'Bình (người dùng 2)' };
const TRE: Record&lt;string, number&gt; = { '1': 1200, '2': 200 };   <span class="tok-comment">  // mạng thật: không ai hứa thứ tự</span>

export async function layNguoiDung(id: string) {
  await new Promise((r) =&gt; setTimeout(r, TRE[id] ?? 300));
  return { id, name: TEN[id] ?? '?' };
}</code></pre><pre><code class="language-typescript">import { layNguoiDung } from '../../../cuoc-dua/du-lieu';

export async function GET(_req: Request, { params }: { params: Promise&lt;{ id: string }&gt; }) {
  const { id } = await params;
  return Response.json(await layNguoiDung(id));
}</code></pre><pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

type ND = { id: string; name: string };
const nhatKy: string[] = [];

function NgayTho({ userId }: { userId: string }) {
  const [user, setUser] = useState&lt;ND | null&gt;(null);
  useEffect(() =&gt; {
    fetch(&#96;/api/nguoi-dung/\${userId}&#96;)
      .then((r) =&gt; r.json())
      .then((d: ND) =&gt; { nhatKy.push(&#96;ngây thơ: về \${d.id}&#96;); setUser(d); }); <span class="tok-comment">  // ✗ ai về sau thắng</span>
  }, [userId]);
  return &lt;p&gt;ngây thơ: &lt;b id="u-ngay"&gt;{user?.name ?? '…'}&lt;/b&gt;&lt;/p&gt;;
}

function CoBoQua({ userId }: { userId: string }) {
  const [user, setUser] = useState&lt;ND | null&gt;(null);
  useEffect(() =&gt; {
    let ignore = false;
    fetch(&#96;/api/nguoi-dung/\${userId}&#96;)
      .then((r) =&gt; r.json())
      .then((d: ND) =&gt; {
        nhatKy.push(&#96;ignore: về \${d.id}\${ignore ? ' — bỏ qua' : ''}&#96;);
        if (!ignore) setUser(d);                  <span class="tok-comment">  // ✓ chỉ áp nếu còn hiện hành</span>
      });
    return () =&gt; { ignore = true; };              <span class="tok-comment">  // cleanup đánh dấu fetch này đã cũ</span>
  }, [userId]);
  return &lt;p&gt;cờ ignore: &lt;b id="u-ignore"&gt;{user?.name ?? '…'}&lt;/b&gt;&lt;/p&gt;;
}

function CoHuy({ userId }: { userId: string }) {
  const [user, setUser] = useState&lt;ND | null&gt;(null);
  useEffect(() =&gt; {
    const ctrl = new AbortController();
    fetch(&#96;/api/nguoi-dung/\${userId}&#96;, { signal: ctrl.signal })
      .then((r) =&gt; r.json())
      .then((d: ND) =&gt; { nhatKy.push(&#96;abort: về \${d.id}&#96;); setUser(d); })
      .catch((e: Error) =&gt; { nhatKy.push(&#96;abort: huỷ \${userId} (\${e.name})&#96;); });
    return () =&gt; ctrl.abort();                    <span class="tok-comment">  // ✓ huỷ hẳn request cũ</span>
  }, [userId]);
  return &lt;p&gt;AbortController: &lt;b id="u-abort"&gt;{user?.name ?? '…'}&lt;/b&gt;&lt;/p&gt;;
}

if (typeof window !== 'undefined') Object.assign(window, { __nhatKy: nhatKy }); <span class="tok-comment">  // để đo</span>

export default function CuocDua() {
  const [userId, setUserId] = useState('1');
  const [hien, setHien] = useState(false);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;p&gt;userId = &lt;b id="uid"&gt;{userId}&lt;/b&gt;{' '}
        &lt;button id="u1" onClick={() =&gt; setUserId('1')} className="rounded border px-2"&gt;người dùng 1 (chậm 1200 ms)&lt;/button&gt;{' '}
        &lt;button id="u2" onClick={() =&gt; setUserId('2')} className="rounded border px-2"&gt;người dùng 2 (nhanh 200 ms)&lt;/button&gt;{' '}
        &lt;button id="mo" onClick={() =&gt; setHien(true)} className="rounded border px-2"&gt;gắn&lt;/button&gt;&lt;/p&gt;
      {hien &amp;&amp; &lt;&gt;&lt;NgayTho userId={userId} /&gt;&lt;CoBoQua userId={userId} /&gt;&lt;CoHuy userId={userId} /&gt;&lt;/&gt;}
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-tsx">import { layNguoiDung } from '../../du-lieu';

export default async function HoSoServer({ params }: { params: Promise&lt;{ id: string }&gt; }) {
  const { id } = await params;
  const user = await layNguoiDung(id);            <span class="tok-comment">  // chỉ await: không effect, không state loading, không đua</span>
  return &lt;h1 id="sv" className="p-6 font-sans text-2xl"&gt;{user.name}&lt;/h1&gt;;
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint src/app/cuoc-dua &amp;&amp; echo 'eslint: 0 lỗi'
eslint: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|cuoc-dua|nguoi-dung'
✓ Compiled successfully in 682ms
├ ƒ /api/nguoi-dung/[id]
├ ○ /cuoc-dua
├ ƒ /cuoc-dua/sv/[id]
$ curl -s localhost:3000/api/nguoi-dung/2
{"id":"2","name":"Bình (người dùng 2)"}
$ curl -s -o /dev/null -w 'GET /api/nguoi-dung/1 → %{http_code} trong %{time_total} s\\n' localhost:3000/api/nguoi-dung/1
GET /api/nguoi-dung/1 → 200 trong 1.206815 s
$ curl -s localhost:3000/cuoc-dua/sv/2 | grep -o '&lt;h1 id="sv"[^&lt;]*&lt;/h1&gt;'
&lt;h1 id="sv" class="p-6 font-sans text-2xl"&gt;Bình (người dùng 2)&lt;/h1&gt;</div>
<p>Then Chromium:</p>
<div class="out">mount with userId = 1 (1200 ms), switch to 2 (200 ms) after 100 ms — next start
  at 400 ms   naive : Bình (người dùng 2)
  at 2 s      naive : An (người dùng 1)   ← userId is 2
              ignore: Bình (người dùng 2)
              abort : Bình (người dùng 2)
  arrival log: abort: huỷ 1 (AbortError) → ngây thơ: về 2 → ignore: về 2 → abort: về 2 → ngây thơ: về 1 → ignore: về 1 — bỏ qua
next dev (Strict Mode), mount with userId = 1:
  abort: huỷ 1 (AbortError) → ngây thơ: về 1 → ignore: về 1 — bỏ qua → ngây thơ: về 1 → ignore: về 1 → abort: về 1</div>
<p>The naive version was right at 400 ms and wrong at 2 s — the page says userId 2 and shows user 1, with no error anywhere. The <code>ignore</code> version let the stale response arrive and dropped it; the abort version cancelled it before user 2 even arrived. In dev the same cleanup handled Strict Mode&#39;s double mount. And the Server Component needed none of it: the name is already in the HTML curl received.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm start
curl -s localhost:3000/cuoc-dua/sv/2 | grep -o "&lt;h1[^&lt;]*&lt;/h1&gt;"
<span class="tok-comment"># open /cuoc-dua: click "gắn" then "người dùng 2" within a second; console: __nhatKy</span>
<span class="tok-comment"># DevTools → Network → Slow 3G makes the race easy to see on any fetch</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-6-1-fetch" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 6.1 — Fetching in effects and why it hurts</span><span class="lc-sub">MSW, a measured race, AbortController</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-6-2-tanstack" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 6.2 — TanStack Query</span><span class="lc-sub">useQuery, query keys, staleTime/gcTime — a library handles the race for you</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-11-1-fetch-async" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · 11.1 — fetch, promises & async/await</span><span class="lc-sub">The groundwork at university</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Race condition</span><span class="v">Two requests resolve out of order; the stale one wins.</span></div>
  <div class="kv"><span class="k">ignore flag</span><span class="v">A cleanup-set boolean that discards a response from an old effect run.</span></div>
  <div class="kv"><span class="k">AbortController</span><span class="v">Cancels an in-flight fetch in the cleanup.</span></div>
  <div class="kv"><span class="k">Cleanup guard</span><span class="v">Logic in cleanup that prevents a stale update.</span></div>
  <div class="kv"><span class="k">Loading/error state</span><span class="v">The states a client fetch must handle.</span></div>
  <div class="kv"><span class="k">Server-side fetch</span><span class="v">Fetching in a Server Component avoids the race for initial data.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Fetching in an effect can race: a slow earlier request can overwrite a fast later one.</li><li>Guard against it with an <code>ignore</code> flag or <code>AbortController</code> in the cleanup.</li><li>Always handle loading and error states for client fetches.</li><li>Chapter 10 shows Server Components fetch initial data without this problem at all.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Fetch trong một effect — và cái bug ẩn trong đó</h2>
<p class="lead">Effect phổ biến nhất người ta viết là "fetch dữ liệu khi component này mount hoặc id của nó đổi". Nó chạy được, và giấu một cuộc đua chỉ lộ ra khi các phản hồi về không đúng thứ tự. Bạn phải xử lý nó, và rồi — trong Next.js — bạn sẽ thường không viết effect này chút nào.</p>

<h3>Bản ngây thơ, và vì sao nó đua</h3>
<pre><code class="language-javascript">function Profile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() =&gt; {
    fetch(<code>/api/users/\${userId}</code>)
      .then(r =&gt; r.json())
      .then(setUser);           <span class="tok-comment">// ❌ nếu userId đổi khi cái này còn đang bay thì sao?</span>
  }, [userId]);
}</code></pre>
<p>Hình dung <code>userId</code> đi 1 → 2 thật nhanh. Hai fetch giờ đang bay. Nếu phản hồi cho <strong>1</strong> về <em>sau</em> phản hồi cho 2 (mạng vẫn thế), <code>setUser</code> chạy cuối cùng với dữ liệu của user 1 — và bạn hiện sai hồ sơ, không lỗi ở đâu cả. Đây là một cuộc đua (race condition), và nó vô hình cho tới khi cắn một người dùng thật trên mạng chậm.</p>

<h3>Cách vá: một cờ "bỏ qua" trong cleanup</h3>
<pre><code class="language-javascript">useEffect(() =&gt; {
  let ignore = false;
  fetch(<code>/api/users/\${userId}</code>)
    .then(r =&gt; r.json())
    .then(data =&gt; { if (!ignore) setUser(data); });   <span class="tok-comment">// chỉ áp nếu vẫn còn hiện hành</span>
  return () =&gt; { ignore = true; };                      <span class="tok-comment">// cleanup đánh dấu fetch này đã cũ</span>
}, [userId]);</code></pre>
<p>Giờ, khi <code>userId</code> đổi, React chạy cleanup của effect cũ trước (Bài 5.2) — đặt <code>ignore</code> của nó thành <code>true</code> — trước khi bắt đầu cái mới. Phản hồi cũ vẫn về, nhưng <code>if (!ignore)</code> của nó giờ là false, nên nó bị bỏ. Chỉ request hiện hành cập nhật state. Chính cờ này cũng xử lý gọn cú double-run của StrictMode, một phần thưởng của việc làm đúng.</p>

<h3>Trong Next.js, bạn thường bỏ qua toàn bộ việc này</h3>
<p>Mọi thứ phía trên là fetch phía client, và nó thật sự lằng nhằng — trạng thái loading, trạng thái lỗi, đua, cache. Đây là lý do lớn khiến Next.js App Router tồn tại. Trong một <strong>Server Component</strong> (Chương 9–10) bạn fetch dữ liệu trên server, trước khi trang được gửi đi, bằng một <code>await</code> thuần, không effect, không <code>useState</code>, không đua:</p>
<pre><code class="language-javascript">// Một Server Component — chạy trên server
async function Profile({ userId }) {
  const user = await getUser(userId);   <span class="tok-comment">// chỉ await; không effect, không loading state phải tung hứng</span>
  return &lt;h1&gt;{user.name}&lt;/h1&gt;;
}</code></pre>
<p>Bạn vẫn dùng fetch bằng effect cho dữ liệu phải tải <em>để đáp lại tương tác của người dùng sau khi trang đã sống</em> (tìm kiếm gợi ý, cuộn vô tận), và các thư viện như TanStack Query (Chương 14) bọc phần đua và cache hộ bạn. Nhưng trường hợp mặc định "tải dữ liệu của trang" chuyển sang server. Hãy học bản effect — bạn sẽ cần, và nó dạy cơ chế — rồi mừng vì Next.js cho phép bạn tránh nó với phần lớn trang.</p>

<div class="callout ok">
<p><strong>Effect, trong một đoạn.</strong> Một effect đồng bộ một hệ thống bên ngoài với state của bạn; nó chạy sau render, chạy lại khi phụ thuộc đổi, và dọn dẹp trước mỗi lần chạy lại và khi unmount. Ở dev nó chạy hai lần để chứng minh cleanup của bạn đúng. Phần lớn effect bạn bị cám dỗ viết thật ra là state suy ra, logic sự kiện, hoặc fetch dữ liệu thuộc về server. Tiếp theo, Chương 6: phần còn lại của hooks — <code>useRef</code>, <code>useMemo</code>, <code>useCallback</code>, <code>useReducer</code>, <code>useContext</code>, và tự viết hook của bạn.</p>
</div>
<h3>Fetch trong một effect, mà không dính cuộc đua</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Người dùng gõ nhanh</b> — Ba lần gõ phím bắn ra ba request. Chúng về theo thứ tự mà mạng quyết định, không phải thứ tự bạn gửi đi.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nên cái chậm có thể về sau cùng</b> — Request cho &quot;ab&quot; xong sau request cho &quot;abc&quot;, và kết quả hiện ra thuộc về một truy vấn mà người dùng đã bỏ qua từ lâu.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Hãy lờ đi những phản hồi đã cũ</b> — Một biến cục bộ <code>let ignore = false</code> được effect bắt lấy, đặt thành <code>true</code> trong phần dọn dẹp. Kiểm nó trước khi gọi <code>setState</code>.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Hoặc huỷ bằng AbortController</b> — Truyền <code>signal</code> vào <code>fetch</code>, gọi <code>controller.abort()</code> trong phần dọn dẹp. Cách này còn dừng hẳn request chứ không chỉ lờ nó đi.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — cuộc đua chỉ hiện ra trên đường truyền chậm, và chỉ thỉnh thoảng.</strong> Một effect fetch ở mỗi lần gõ phím chạy hoàn hảo trên localhost, nơi mọi phản hồi về trong hai mili giây và đúng thứ tự đã gửi. Trên mạng thật thì thứ tự không được bảo đảm, nên kết quả tìm kiếm thỉnh thoảng hiện sai truy vấn — và vì nó phụ thuộc thời điểm, nó sẽ không tái hiện khi bạn đi tìm. Hãy bóp băng thông trong DevTools xuống Slow 3G rồi gõ thật nhanh; cái lỗi hiện ra ngay. Rồi thêm cờ <code>ignore</code> hoặc tín hiệu huỷ vào. Trong Next.js, câu trả lời tốt hơn thường là dời phép fetch sang Server Component hoặc một thư viện dữ liệu, nơi chuyện này đã được lo giùm.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/useEffect#fetching-data-with-effects" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">react.dev — Lấy dữ liệu bằng Effect</span><span class="lc-sub">Mẫu dùng cờ ignore, và vì sao React khuyên dùng framework hoặc thư viện thay thế.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noopener">
  <span class="lc-ico">🛑</span>
  <span class="lc-body"><span class="lc-title">MDN — AbortController</span><span class="lc-sub">Huỷ một phép fetch cho đúng, gồm cả lỗi nó ném ra khi bạn huỷ.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Fetch dữ liệu trong effect lấy khoá theo từ khoá tìm kiếm; gõ nhanh và xem một response cũ đè lên một cái mới hơn.</li>
<li>Sửa cuộc đua bằng một cờ <code>ignore</code> (hoặc <code>AbortController</code>) trong cleanup để bỏ response cũ.</li>
<li>Để ý vì sao Server Components ở Chương 10 loại bỏ cả vấn đề này cho dữ liệu khởi tạo.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tái hiện được một cuộc đua fetch và sửa bằng một guard trong cleanup.</p></div>

<h3>🔬 Đo thật: cuộc đua, hai cách vá, và bản máy chủ (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Một API giả (Route Handler — Chương 11) trả người dùng 1 chậm, người dùng 2 nhanh; ba component fetch cùng một người dùng theo ba cách; và một Server Component lấy nó bằng một <code>await</code>:</p>
<pre><code class="language-typescript">const TEN: Record&lt;string, string&gt; = { '1': 'An (người dùng 1)', '2': 'Bình (người dùng 2)' };
const TRE: Record&lt;string, number&gt; = { '1': 1200, '2': 200 };   <span class="tok-comment">  // mạng thật: không ai hứa thứ tự</span>

export async function layNguoiDung(id: string) {
  await new Promise((r) =&gt; setTimeout(r, TRE[id] ?? 300));
  return { id, name: TEN[id] ?? '?' };
}</code></pre><pre><code class="language-typescript">import { layNguoiDung } from '../../../cuoc-dua/du-lieu';

export async function GET(_req: Request, { params }: { params: Promise&lt;{ id: string }&gt; }) {
  const { id } = await params;
  return Response.json(await layNguoiDung(id));
}</code></pre><pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

type ND = { id: string; name: string };
const nhatKy: string[] = [];

function NgayTho({ userId }: { userId: string }) {
  const [user, setUser] = useState&lt;ND | null&gt;(null);
  useEffect(() =&gt; {
    fetch(&#96;/api/nguoi-dung/\${userId}&#96;)
      .then((r) =&gt; r.json())
      .then((d: ND) =&gt; { nhatKy.push(&#96;ngây thơ: về \${d.id}&#96;); setUser(d); }); <span class="tok-comment">  // ✗ ai về sau thắng</span>
  }, [userId]);
  return &lt;p&gt;ngây thơ: &lt;b id="u-ngay"&gt;{user?.name ?? '…'}&lt;/b&gt;&lt;/p&gt;;
}

function CoBoQua({ userId }: { userId: string }) {
  const [user, setUser] = useState&lt;ND | null&gt;(null);
  useEffect(() =&gt; {
    let ignore = false;
    fetch(&#96;/api/nguoi-dung/\${userId}&#96;)
      .then((r) =&gt; r.json())
      .then((d: ND) =&gt; {
        nhatKy.push(&#96;ignore: về \${d.id}\${ignore ? ' — bỏ qua' : ''}&#96;);
        if (!ignore) setUser(d);                  <span class="tok-comment">  // ✓ chỉ áp nếu còn hiện hành</span>
      });
    return () =&gt; { ignore = true; };              <span class="tok-comment">  // cleanup đánh dấu fetch này đã cũ</span>
  }, [userId]);
  return &lt;p&gt;cờ ignore: &lt;b id="u-ignore"&gt;{user?.name ?? '…'}&lt;/b&gt;&lt;/p&gt;;
}

function CoHuy({ userId }: { userId: string }) {
  const [user, setUser] = useState&lt;ND | null&gt;(null);
  useEffect(() =&gt; {
    const ctrl = new AbortController();
    fetch(&#96;/api/nguoi-dung/\${userId}&#96;, { signal: ctrl.signal })
      .then((r) =&gt; r.json())
      .then((d: ND) =&gt; { nhatKy.push(&#96;abort: về \${d.id}&#96;); setUser(d); })
      .catch((e: Error) =&gt; { nhatKy.push(&#96;abort: huỷ \${userId} (\${e.name})&#96;); });
    return () =&gt; ctrl.abort();                    <span class="tok-comment">  // ✓ huỷ hẳn request cũ</span>
  }, [userId]);
  return &lt;p&gt;AbortController: &lt;b id="u-abort"&gt;{user?.name ?? '…'}&lt;/b&gt;&lt;/p&gt;;
}

if (typeof window !== 'undefined') Object.assign(window, { __nhatKy: nhatKy }); <span class="tok-comment">  // để đo</span>

export default function CuocDua() {
  const [userId, setUserId] = useState('1');
  const [hien, setHien] = useState(false);
  return (
    &lt;div className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;p&gt;userId = &lt;b id="uid"&gt;{userId}&lt;/b&gt;{' '}
        &lt;button id="u1" onClick={() =&gt; setUserId('1')} className="rounded border px-2"&gt;người dùng 1 (chậm 1200 ms)&lt;/button&gt;{' '}
        &lt;button id="u2" onClick={() =&gt; setUserId('2')} className="rounded border px-2"&gt;người dùng 2 (nhanh 200 ms)&lt;/button&gt;{' '}
        &lt;button id="mo" onClick={() =&gt; setHien(true)} className="rounded border px-2"&gt;gắn&lt;/button&gt;&lt;/p&gt;
      {hien &amp;&amp; &lt;&gt;&lt;NgayTho userId={userId} /&gt;&lt;CoBoQua userId={userId} /&gt;&lt;CoHuy userId={userId} /&gt;&lt;/&gt;}
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-tsx">import { layNguoiDung } from '../../du-lieu';

export default async function HoSoServer({ params }: { params: Promise&lt;{ id: string }&gt; }) {
  const { id } = await params;
  const user = await layNguoiDung(id);            <span class="tok-comment">  // chỉ await: không effect, không state loading, không đua</span>
  return &lt;h1 id="sv" className="p-6 font-sans text-2xl"&gt;{user.name}&lt;/h1&gt;;
}</code></pre><div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint src/app/cuoc-dua &amp;&amp; echo 'eslint: 0 lỗi'
eslint: 0 lỗi
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|cuoc-dua|nguoi-dung'
✓ Compiled successfully in 682ms
├ ƒ /api/nguoi-dung/[id]
├ ○ /cuoc-dua
├ ƒ /cuoc-dua/sv/[id]
$ curl -s localhost:3000/api/nguoi-dung/2
{"id":"2","name":"Bình (người dùng 2)"}
$ curl -s -o /dev/null -w 'GET /api/nguoi-dung/1 → %{http_code} trong %{time_total} s\\n' localhost:3000/api/nguoi-dung/1
GET /api/nguoi-dung/1 → 200 trong 1.206815 s
$ curl -s localhost:3000/cuoc-dua/sv/2 | grep -o '&lt;h1 id="sv"[^&lt;]*&lt;/h1&gt;'
&lt;h1 id="sv" class="p-6 font-sans text-2xl"&gt;Bình (người dùng 2)&lt;/h1&gt;</div>
<p>Rồi trên Chromium:</p>
<div class="out">gắn với userId = 1 (1200 ms), 100 ms sau đổi sang 2 (200 ms) — next start
  lúc 400 ms  ngây thơ: Bình (người dùng 2)
  lúc 2 s     ngây thơ: An (người dùng 1)   ← userId đang là 2
              ignore  : Bình (người dùng 2)
              abort   : Bình (người dùng 2)
  thứ tự về  : abort: huỷ 1 (AbortError) → ngây thơ: về 2 → ignore: về 2 → abort: về 2 → ngây thơ: về 1 → ignore: về 1 — bỏ qua
next dev (Strict Mode), gắn với userId = 1:
  abort: huỷ 1 (AbortError) → ngây thơ: về 1 → ignore: về 1 — bỏ qua → ngây thơ: về 1 → ignore: về 1 → abort: về 1</div>
<p>Bản ngây thơ đúng lúc 400 ms và sai lúc 2 s — trang ghi userId 2 mà hiện người dùng 1, không một lỗi nào. Bản <code>ignore</code> để phản hồi cũ về rồi bỏ đi; bản abort huỷ nó trước cả khi người dùng 2 về. Ở dev, cùng cleanup đó xử lý luôn lần gắn đôi của Strict Mode. Còn Server Component không cần thứ gì trong số đó: tên đã nằm sẵn trong HTML mà curl nhận được.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm start
curl -s localhost:3000/cuoc-dua/sv/2 | grep -o "&lt;h1[^&lt;]*&lt;/h1&gt;"
<span class="tok-comment"># mở /cuoc-dua: bấm "gắn" rồi "người dùng 2" trong vòng một giây; console: __nhatKy</span>
<span class="tok-comment"># DevTools → Network → Slow 3G làm cuộc đua dễ thấy với mọi phép fetch</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-6-1-fetch" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 6.1 — Fetch trong effect, và vì sao đau đầu</span><span class="lc-sub">MSW, cuộc đua đo thật, AbortController</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-6-2-tanstack" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 6.2 — TanStack Query</span><span class="lc-sub">useQuery, query key, staleTime/gcTime — thư viện lo cuộc đua hộ bạn</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-11-1-fetch-async" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy FER202 · 11.1 — fetch, promise & async/await</span><span class="lc-sub">Phần nền ở trường</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cuộc đua (race)</span><span class="v">Hai request trả về sai thứ tự; cái cũ thắng.</span></div>
  <div class="kv"><span class="k">Cờ ignore</span><span class="v">Một boolean do cleanup đặt để bỏ response từ lần effect cũ.</span></div>
  <div class="kv"><span class="k">AbortController</span><span class="v">Huỷ một fetch đang bay trong cleanup.</span></div>
  <div class="kv"><span class="k">Guard trong cleanup</span><span class="v">Logic trong cleanup chặn một cập nhật cũ.</span></div>
  <div class="kv"><span class="k">State loading/error</span><span class="v">Các trạng thái một fetch phía client phải xử lý.</span></div>
  <div class="kv"><span class="k">Fetch phía server</span><span class="v">Fetch trong Server Component tránh cuộc đua cho dữ liệu khởi tạo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Fetch trong effect có thể đua: một request chậm đến trước có thể đè một cái nhanh đến sau.</li><li>Chặn bằng một cờ <code>ignore</code> hoặc <code>AbortController</code> trong cleanup.</li><li>Luôn xử lý trạng thái loading và error cho fetch phía client.</li><li>Chương 10 cho thấy Server Components fetch dữ liệu khởi tạo mà không dính vấn đề này.</li></ul>

</div>
`,
    },

    /* ─────────────────────────── 5.6 quiz ─────────────────────────── */
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra chương 5',
      slug: 'nextjs-5-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về effect chạy khi nào, phụ thuộc, cleanup, StrictMode chạy hai lần, đua fetch và effect không nên viết.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 5: when effects run, the dependency array, cleanup order, the StrictMode double-run, the fetch race, and effects you shouldn't write.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 5: effect chạy khi nào, mảng phụ thuộc, thứ tự cleanup, cú chạy-hai-lần của StrictMode, cuộc đua fetch, và effect không nên viết.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'When does a useEffect run relative to render?|||useEffect chạy khi nào so với render?',
            options: [
              'During render, before the DOM updates|||Trong lúc render, trước khi DOM cập nhật',
              'After React commits to the DOM — the screen has already updated|||Sau khi React commit vào DOM — màn hình đã cập nhật',
              'Only on the very first render, never again|||Chỉ ở lần render đầu tiên, không bao giờ nữa',
              'Before the component function is called|||Trước khi hàm component được gọi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'useEffect(fn, []) with an empty array runs…|||useEffect(fn, []) với mảng rỗng chạy…',
            options: [
              'after every render|||sau mỗi render',
              'once, after the first render|||một lần, sau render đầu',
              'never|||không bao giờ',
              'only on unmount|||chỉ khi unmount',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An effect with dependency dep goes 1 → (same 1) → 2 → unmount. What is the log order of "effect N"/"cleanup N"?|||Một effect có phụ thuộc dep đi 1 → (vẫn 1) → 2 → unmount. Thứ tự log "effect N"/"cleanup N" là gì?',
            options: [
              'effect 1, effect 2, cleanup 1, cleanup 2|||effect 1, effect 2, cleanup 1, cleanup 2',
              'effect 1, cleanup 1, effect 2, cleanup 2|||effect 1, cleanup 1, effect 2, cleanup 2',
              'effect 1, effect 1, effect 2, cleanup 2|||effect 1, effect 1, effect 2, cleanup 2',
              'effect 1, cleanup 2|||effect 1, cleanup 2',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When dep changes from 1 to 2, React runs cleanup of the old effect…|||Khi dep đổi từ 1 sang 2, React chạy cleanup của effect cũ…',
            options: [
              'after running the new effect|||sau khi chạy effect mới',
              'before running the new effect|||trước khi chạy effect mới',
              'never — cleanup only runs on unmount|||không bao giờ — cleanup chỉ chạy khi unmount',
              'at the same time as the new effect|||cùng lúc với effect mới',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In development you see an effect log run → clean → run on one mount. Why?|||Ở dev bạn thấy một effect log run → clean → run trong một lần mount. Vì sao?',
            options: [
              'A bug in your code|||Một bug trong code bạn',
              'StrictMode double-invokes effects in dev to surface a missing cleanup|||StrictMode chạy đôi effect ở dev để lộ cleanup còn thiếu',
              'The component rendered twice by accident|||Component render hai lần do vô tình',
              'React always runs effects twice, even in production|||React luôn chạy effect hai lần, kể cả production',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The correct way to handle the StrictMode double-run is to…|||Cách đúng để xử lý cú chạy-hai-lần của StrictMode là…',
            options: [
              'disable StrictMode|||tắt StrictMode',
              'detect the second run with a flag and skip it|||dò lần chạy thứ hai bằng cờ và bỏ qua',
              'write a matching cleanup so the effect is idempotent|||viết một cleanup khớp để effect idempotent',
              'move the effect into render|||chuyển effect vào render',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You have items in state and want their total. Best approach?|||Bạn có items trong state và muốn tổng của chúng. Cách tốt nhất?',
            options: [
              'A useEffect that calls setTotal when items changes|||Một useEffect gọi setTotal khi items đổi',
              'Compute const total = items.reduce(...) during render, no effect|||Tính const total = items.reduce(...) trong lúc render, không effect',
              'Store total in a ref|||Lưu total trong một ref',
              'Two separate state variables kept in sync|||Hai biến state riêng giữ đồng bộ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does an object literal { } in the dependency array make the effect run every render?|||Vì sao một object literal { } trong mảng phụ thuộc làm effect chạy mỗi render?',
            options: [
              'Objects are not allowed as dependencies|||Object không được phép làm phụ thuộc',
              'It is a new reference each render, so Object.is always sees a change|||Nó là tham chiếu mới mỗi render, nên Object.is luôn thấy thay đổi',
              'React re-reads objects continuously|||React đọc lại object liên tục',
              'It never runs the effect at all|||Nó không bao giờ chạy effect',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A fetch-on-userId effect can show the wrong data because…|||Một effect fetch theo userId có thể hiện sai dữ liệu vì…',
            options: [
              'fetch is always synchronous|||fetch luôn đồng bộ',
              'responses can arrive out of order (a race); the stale one may setState last|||phản hồi có thể về không đúng thứ tự (đua); cái cũ có thể setState cuối',
              'useState is too slow|||useState quá chậm',
              'effects cannot call fetch|||effect không gọi được fetch',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In Next.js App Router, the default "load this page\'s data" case is best done…|||Trong Next.js App Router, trường hợp mặc định "tải dữ liệu của trang này" tốt nhất là…',
            options: [
              'in a useEffect on the client with a race guard|||trong một useEffect ở client có chống đua',
              'in a Server Component with a plain await, no effect|||trong một Server Component với await thuần, không effect',
              'in a global variable|||trong một biến toàn cục',
              'it cannot be done in Next.js|||không làm được trong Next.js',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
