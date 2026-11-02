/**
 * Bài 5.2 — Promise (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/5-2).
 * Deck: scripts/slides-src/wf-5-2.mjs (9 slide, WF/v1/wf-5-2). Code Lab: module 5.2 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-5-2', 'Promises', 'Promise', [
  [1, 'Promises',
    '<p>A promise is an object that stands for a value you do not have yet: the response from a server, a file being read, a timer. It lets you say what should happen when the value arrives, or when something goes wrong. Every modern asynchronous API in JavaScript returns one.</p>',
    '<p>Promise là một object đại diện cho một giá trị bạn chưa có: phản hồi từ máy chủ, một tệp đang đọc, một hẹn giờ. Nó cho bạn nói điều gì nên xảy ra khi giá trị tới, hoặc khi có sự cố. Mọi API bất đồng bộ hiện đại trong JavaScript đều trả về một promise.</p>'],
  [2, 'After this lesson you can…',
    '<p>Most promise bugs come from two places: a chain that silently breaks because one step forgot to return, and errors that nobody catches. Both are shown on real output here, together with the four ways of combining several promises.</p>',
    '<p>Phần lớn lỗi promise đến từ hai chỗ: một chuỗi âm thầm gãy vì một bước quên return, và lỗi không ai bắt. Cả hai được trình bày bằng output thật ở đây, cùng với bốn cách kết hợp nhiều promise.</p>'],
  [3, 'Three states',
    '<p>A promise starts pending. It then settles exactly once: fulfilled with a value, or rejected with an error. Printed right away, it is still pending; one hundred milliseconds later the callback receives the value. <code>catch</code> handles the rejection and <code>finally</code> runs either way.</p>',
    '<p>Promise bắt đầu ở trạng thái chờ. Rồi nó chốt đúng một lần: thành công với một giá trị, hoặc thất bại với một lỗi. In ra ngay, nó vẫn đang chờ; một trăm mili giây sau callback nhận được giá trị. <code>catch</code> xử lý thất bại và <code>finally</code> chạy trong mọi trường hợp.</p>'],
  [4, 'Chaining',
    '<p>Each <code>then</code> returns a new promise, so steps can follow each other. If a step returns a promise, the next step waits for it; if it returns a plain value, that value is passed straight on. Forget the <code>return</code>, and the next step runs immediately with <code>undefined</code>.</p>',
    '<p>Mỗi <code>then</code> trả về một promise mới, nên các bước có thể nối tiếp nhau. Nếu một bước trả về promise, bước sau chờ nó; nếu trả về giá trị thường, giá trị đó được chuyển thẳng đi. Quên <code>return</code>, bước sau chạy ngay với <code>undefined</code>.</p>'],
  [5, 'Errors flow to catch',
    '<p>A thrown error anywhere in a chain skips the following steps and jumps to the nearest <code>catch</code>. What <code>catch</code> returns continues the chain normally. A rejected promise with no <code>catch</code> at all becomes an unhandled rejection, reported in red in the console.</p>',
    '<p>Một lỗi bị ném ở bất cứ đâu trong chuỗi sẽ bỏ qua các bước tiếp theo và nhảy tới <code>catch</code> gần nhất. Thứ <code>catch</code> trả về tiếp tục chuỗi bình thường. Promise thất bại mà không có <code>catch</code> nào trở thành unhandled rejection, báo đỏ trong console.</p>'],
  [6, 'Combining promises',
    '<p>Four tools for several promises at once. <code>all</code> waits for all and fails fast. <code>allSettled</code> waits for all and reports each result. <code>race</code> takes the first to settle; <code>any</code> the first success. Started together, three requests take as long as the slowest, not their sum.</p>',
    '<p>Bốn công cụ cho nhiều promise cùng lúc. <code>all</code> chờ tất cả và thất bại sớm. <code>allSettled</code> chờ tất cả và báo kết quả từng cái. <code>race</code> lấy cái chốt đầu tiên; <code>any</code> lấy cái thành công đầu tiên. Bắt đầu cùng lúc, ba request tốn thời gian bằng cái chậm nhất, không phải tổng.</p>'],
  [7, 'Wrapping a callback API',
    '<p>Old APIs report results through callbacks, and three steps in a row become a pyramid. Wrapping such an API in <code>new Promise</code> takes three lines, and afterwards you can use <code>then</code>, <code>all</code> and <code>await</code> with it.</p>',
    '<p>API cũ báo kết quả qua callback, và ba bước liên tiếp thành một kim tự tháp. Bọc một API như vậy trong <code>new Promise</code> tốn ba dòng, và sau đó bạn dùng được <code>then</code>, <code>all</code> và <code>await</code> với nó.</p>'],
  [8, 'Where promises meet the event loop',
    '<p>Promise callbacks are microtasks. Even an already-fulfilled promise runs its <code>then</code> after the current code, never during it. That is why the order you saw in Lesson 5.1 is predictable, and why a promise never calls you back synchronously.</p>',
    '<p>Callback của promise là microtask. Kể cả promise đã thành công rồi cũng chạy <code>then</code> sau mã hiện tại, không bao giờ chen giữa. Vì vậy thứ tự bạn thấy ở Bài 5.1 đoán trước được, và promise không bao giờ gọi lại bạn một cách đồng bộ.</p>'],
  [9, 'Summary & practice',
    '<p>The practice builds a small "dashboard loader" from fake requests: a chain, a failure handled in the middle, and three requests in parallel. "Done when" compares timings and outputs with exact expected values.</p>',
    '<p>Bài luyện dựng một "bộ tải bảng điều khiển" nhỏ từ các request giả: một chuỗi, một lỗi được xử lý ở giữa, và ba request song song. "Xong khi" so thời gian và output với các giá trị mong đợi chính xác.</p>'],
]);

export default {
  title: '5.2 — Promises: values that arrive later|||5.2 — Promise: giá trị đến sau',
  slug: 'wf-5-2-promises',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/DHvZLI7Db8E', durationSeconds: 0 },
  description: 'Ba trạng thái của promise, then/catch/finally, chuỗi then và lỗi quên return (output thật cho thấy chuỗi gãy), lỗi chảy về catch, unhandled rejection, all/allSettled/race/any có đo thời gian, bọc API callback, promise và microtask.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>A placeholder for a value that is not ready yet</h2>
<p class="lead">After this lesson you can create a promise, react to its result with <code>then</code>, <code>catch</code> and <code>finally</code>, chain steps without breaking the chain, handle errors in one place, run several operations in parallel, and turn an old callback API into a promise. You need this because <code>fetch</code>, file reading, databases, timers wrapped for modern code — nearly every asynchronous API returns a promise. <code>async</code>/<code>await</code> in the next lesson is just a nicer way to write promises, so its bugs are promise bugs.</p>

<h3>Step 1 — three states</h3>
${ma('javascript', CODE['5-2/tao-promise.js'])}
${ra(OUT['5-2/tao-promise'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">pending</span><span class="lz-t">waiting</span><span class="lz-d">The work is in progress. DevTools shows <code>Promise {&lt;pending&gt;}</code>.</span></div>
<div class="lz-step"><span class="lz-k">fulfilled</span><span class="lz-t">a value arrived</span><span class="lz-d"><code>resolve(value)</code> was called. Every <code>then</code> receives the value.</span></div>
<div class="lz-step"><span class="lz-k">rejected</span><span class="lz-t">it failed</span><span class="lz-d"><code>reject(error)</code> was called. <code>catch</code> receives the error.</span></div>
</div>
<p>A promise settles <strong>once</strong>: after fulfilling it cannot reject, and calling <code>resolve</code> twice does nothing. Look at the order of the output: the failure came first (after 50 ms), the coffee after 100 ms. Callbacks run when their promise settles, not in the order you wrote them. <code>finally</code> is for clean-up that must happen either way, like hiding a loading spinner.</p>
<p>You will rarely write <code>new Promise</code> yourself: most of the time an API hands you a promise and you only use <code>then</code> or <code>await</code>. Writing a few by hand is how you understand them.</p>

<h3>Step 2 — chaining, and the missing <code>return</code></h3>
${ma('javascript', CODE['5-2/chuoi.js'])}
${ra(OUT['5-2/chuoi'])}
<p>Every <code>then</code> returns a <strong>new</strong> promise, settled with whatever its callback returns. That gives you a chain:</p>
<ul>
<li>Return a <strong>promise</strong>: the next step waits for it (step 2 waited for the "orders" request).</li>
<li>Return a <strong>plain value</strong>: it is passed on at once (step 3 got 71).</li>
<li>Return <strong>nothing</strong>: the next step receives <code>undefined</code>, immediately.</li>
</ul>
<p>The second half shows the bug. Step B started a request but did not return it. The chain did not wait: C printed <code>received undefined</code> <em>before</em> B even finished. No error, just wrong data in the wrong order.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — the forgotten <code>return</code> in <code>then</code>.</strong> With braces, an arrow needs an explicit <code>return</code> (Lesson 4.3). Inside <code>.then(x =&gt; { doAsync(x); })</code> that mistake also breaks the timing: the next step runs too early, and an error inside <code>doAsync</code> escapes the chain's <code>catch</code>. Rule: inside <code>then</code>, always return the promise you start. Or use <code>async</code>/<code>await</code>, which makes this mistake much harder.</p></div>

<h3>Step 3 — errors flow to the nearest <code>catch</code></h3>
${ma('javascript', CODE['5-2/loi.js'])}
${ra(OUT['5-2/loi'])}
<p>The error thrown in step 2 skipped the next <code>then</code> ("skipped" never printed) and landed in <code>catch</code>. Whatever <code>catch</code> returns <strong>continues</strong> the chain as a normal value: "recovered". So one <code>catch</code> at the end of a chain handles a failure at any step. That is the same idea as <code>try/catch</code>, for asynchronous code.</p>
<p>The last line of the output is the second promise, rejected with no <code>catch</code>. The browser reports it as an <strong>unhandled rejection</strong>, in red, but your page keeps running, often in a broken state.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a chain with no <code>catch</code>.</strong> In the browser you get a red line in a console nobody watches; the loading spinner spins for ever. In Node.js an unhandled rejection stops the whole server process by default. Every chain needs a <code>catch</code>, or a <code>try/catch</code> around its <code>await</code>, at the place where you can actually do something: show a message, retry, log it.</p></div>

<h3>Step 4 — combining several promises</h3>
${ma('javascript', CODE['5-2/ket-hop.js'])}
${ra(OUT['5-2/ket-hop'])}
<table>
<thead><tr><th>Method</th><th>Waits for</th><th>Result</th><th>Use for</th></tr></thead>
<tbody>
<tr><td><code>Promise.all</code></td><td>all to fulfil</td><td>array of values; rejects at the first failure</td><td>Data you need all of</td></tr>
<tr><td><code>Promise.allSettled</code></td><td>all to settle</td><td>a status per promise; never rejects</td><td>Independent jobs, report each</td></tr>
<tr><td><code>Promise.race</code></td><td>the first to settle</td><td>its value or error</td><td>Timeouts</td></tr>
<tr><td><code>Promise.any</code></td><td>the first to fulfil</td><td>its value; rejects only if all fail</td><td>Fastest mirror</td></tr>
</tbody>
</table>
<p>Note the timing: <code>all</code> finished after about 200 ms, the slowest of 100, 200 and 150, not their sum of 450. The three started together. And <code>all</code> with one broken input failed after 50 ms, without waiting for the rest.</p>

<h3>Step 5 — wrapping an old callback API</h3>
${ma('javascript', CODE['5-2/boc-callback.js'])}
${ra(OUT['5-2/boc-callback'])}
<p>Before promises, asynchronous APIs took callbacks: one for success, one for failure. Three steps in a row nest inside each other, the "pyramid of doom" at the bottom of the code, where error handling must be repeated at every level. Wrapping the API once — <code>new Promise((resolve, reject) =&gt; oldApi(arg, resolve, reject))</code> — turns it into something you can chain, combine with <code>Promise.all</code>, and <code>await</code>. Node.js even ships a helper for this, <code>util.promisify</code>.</p>

<h3>Promises and the event loop</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Your code</span><span class="lz-t">runs to completion</span><span class="lz-d"><code>then</code> only <em>registers</em> a callback.</span></div>
<div class="lz-layer"><span class="lz-k">Microtask queue</span><span class="lz-t">promise callbacks</span><span class="lz-d">Run as soon as the stack is empty, before any timer (Lesson 5.1).</span></div>
<div class="lz-layer"><span class="lz-k">Task queue</span><span class="lz-t">timers, network, events</span><span class="lz-d">The work that eventually resolves the promise lives here.</span></div>
</div>
<p>Even <code>Promise.resolve(5).then(…)</code>, whose value is ready, runs the callback <em>after</em> the current code. A promise never calls you back in the middle of your own function, which makes the order predictable.</p>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — a dashboard loader</strong></p>
<pre><code class="language-javascript">const fake = (name, ms, fail = false) =&gt;
  new Promise((res, rej) =&gt; setTimeout(() =&gt; (fail ? rej(new Error(name + ' failed')) : res(name)), ms));</code></pre>
<ol>
<li>Chain: <code>fake('login', 100)</code> → then <code>fake('profile', 100)</code> → then print both names. Measure the time with <code>performance.now()</code>.</li>
<li>Add a failing step <code>fake('settings', 50, true)</code> in the middle, and a <code>catch</code> that returns <code>'default settings'</code> so the chain continues.</li>
<li>Load <code>fake('news', 300)</code>, <code>fake('weather', 200)</code> and <code>fake('ads', 100, true)</code> together with <code>allSettled</code>, and print which succeeded.</li>
<li>Build <code>withTimeout(promise, ms)</code> using <code>Promise.race</code>.</li>
</ol>
<p>Hint: in step 1, return the inner promise in each <code>then</code>.</p>
<p><strong>Done when:</strong> step 1 takes about 200 ms and prints both names; step 2 prints <code>default settings</code> and still reaches the end; step 3 finishes in about 300 ms (not 600) with statuses <code>fulfilled, fulfilled, rejected</code>; and <code>withTimeout(fake('slow', 500), 200)</code> rejects after about 200 ms. Then Code Lab module 5.2.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">promise</span><span class="v">lời hứa — đại diện cho giá trị đến sau.</span></div>
  <div class="kv"><span class="k">pending / fulfilled / rejected</span><span class="v">đang chờ / thành công / thất bại.</span></div>
  <div class="kv"><span class="k">settle</span><span class="v">chốt — không còn chờ nữa.</span></div>
  <div class="kv"><span class="k">resolve / reject</span><span class="v">báo thành công / báo thất bại.</span></div>
  <div class="kv"><span class="k">then / catch / finally</span><span class="v">khi thành công / khi lỗi / dù sao cũng chạy.</span></div>
  <div class="kv"><span class="k">chain</span><span class="v">chuỗi then nối tiếp.</span></div>
  <div class="kv"><span class="k">unhandled rejection</span><span class="v">promise thất bại không ai bắt.</span></div>
  <div class="kv"><span class="k">parallel</span><span class="v">song song — chạy cùng lúc.</span></div>
  <div class="kv"><span class="k">callback hell</span><span class="v">kim tự tháp callback lồng nhau.</span></div>
  <div class="kv"><span class="k">promisify</span><span class="v">bọc API callback thành promise.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A promise is pending, then settles once: fulfilled with a value or rejected with an error.</li>
  <li><code>then</code> returns a new promise; return the inner promise or the chain will not wait.</li>
  <li>Errors skip to the nearest <code>catch</code>; what it returns continues the chain.</li>
  <li>Always end a chain with a <code>catch</code>; unhandled rejections crash Node.js.</li>
  <li><code>all</code>, <code>allSettled</code>, <code>race</code>, <code>any</code>: started together, they take as long as the slowest.</li>
  <li>Wrap old callback APIs in <code>new Promise</code> once.</li>
  <li>Promise callbacks are microtasks: never synchronous, always before timers.</li>
</ul>
${nguon('📗', 'MDN — Using promises', 'Chaining, errors and composition', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises')}
${nguon('📘', 'javascript.info — Promises, async/await', 'The full chapter, with tasks', 'https://javascript.info/async')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Chỗ giữ chỗ cho một giá trị chưa sẵn sàng</h2>
<p class="lead">Học xong bài này bạn tạo được promise, phản ứng với kết quả bằng <code>then</code>, <code>catch</code> và <code>finally</code>, nối các bước mà không làm gãy chuỗi, xử lý lỗi ở một chỗ, chạy song song nhiều thao tác, và biến một API callback cũ thành promise. Bạn cần điều này vì <code>fetch</code>, đọc tệp, cơ sở dữ liệu, hẹn giờ bọc cho mã hiện đại — gần như mọi API bất đồng bộ đều trả về promise. <code>async</code>/<code>await</code> ở bài sau chỉ là cách viết promise đẹp hơn, nên lỗi của nó chính là lỗi promise.</p>

<h3>Bước 1 — ba trạng thái</h3>
${ma('javascript', CODE['5-2/tao-promise.js'])}
${ra(OUT['5-2/tao-promise'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">pending</span><span class="lz-t">đang chờ</span><span class="lz-d">Việc đang làm. DevTools hiện <code>Promise {&lt;pending&gt;}</code>.</span></div>
<div class="lz-step"><span class="lz-k">fulfilled</span><span class="lz-t">đã có giá trị</span><span class="lz-d"><code>resolve(value)</code> đã được gọi. Mọi <code>then</code> nhận giá trị đó.</span></div>
<div class="lz-step"><span class="lz-k">rejected</span><span class="lz-t">thất bại</span><span class="lz-d"><code>reject(error)</code> đã được gọi. <code>catch</code> nhận lỗi.</span></div>
</div>
<p>Promise chốt <strong>một lần</strong>: đã thành công thì không thất bại được nữa, và gọi <code>resolve</code> hai lần chẳng làm gì. Nhìn thứ tự output: thất bại tới trước (sau 50 ms), cà phê sau 100 ms. Callback chạy khi promise của nó chốt, không theo thứ tự bạn viết. <code>finally</code> dành cho việc dọn dẹp phải làm dù sao đi nữa, như ẩn vòng quay chờ.</p>
<p>Bạn hiếm khi tự viết <code>new Promise</code>: đa số lúc một API trao cho bạn promise và bạn chỉ dùng <code>then</code> hay <code>await</code>. Tự viết vài cái là cách để hiểu chúng.</p>

<h3>Bước 2 — nối chuỗi, và <code>return</code> bị quên</h3>
${ma('javascript', CODE['5-2/chuoi.js'])}
${ra(OUT['5-2/chuoi'])}
<p>Mỗi <code>then</code> trả về một promise <strong>mới</strong>, chốt bằng thứ callback của nó trả về. Nhờ vậy có chuỗi:</p>
<ul>
<li>Trả về một <strong>promise</strong>: bước sau chờ nó (bước 2 chờ request "orders").</li>
<li>Trả về <strong>giá trị thường</strong>: chuyển đi ngay (bước 3 nhận 71).</li>
<li>Không trả về <strong>gì</strong>: bước sau nhận <code>undefined</code>, ngay lập tức.</li>
</ul>
<p>Nửa sau cho thấy lỗi. Bước B bắt đầu một request mà không trả nó về. Chuỗi không chờ: C in <code>received undefined</code> <em>trước khi</em> B kịp xong. Không có lỗi, chỉ có dữ liệu sai theo thứ tự sai.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — quên <code>return</code> trong <code>then</code>.</strong> Có ngoặc nhọn thì arrow cần <code>return</code> tường minh (Bài 4.3). Trong <code>.then(x =&gt; { doAsync(x); })</code>, sai lầm đó còn làm hỏng thời điểm: bước sau chạy quá sớm, và lỗi bên trong <code>doAsync</code> thoát khỏi <code>catch</code> của chuỗi. Luật: trong <code>then</code>, luôn trả về promise bạn khởi động. Hoặc dùng <code>async</code>/<code>await</code>, khiến lỗi này khó mắc hơn nhiều.</p></div>

<h3>Bước 3 — lỗi chảy về <code>catch</code> gần nhất</h3>
${ma('javascript', CODE['5-2/loi.js'])}
${ra(OUT['5-2/loi'])}
<p>Lỗi ném ở bước 2 bỏ qua <code>then</code> kế tiếp ("skipped" không bao giờ in) và rơi vào <code>catch</code>. Thứ <code>catch</code> trả về <strong>tiếp tục</strong> chuỗi như một giá trị bình thường: "recovered". Nên một <code>catch</code> ở cuối chuỗi xử lý được lỗi ở bất kỳ bước nào. Cùng ý tưởng với <code>try/catch</code>, cho mã bất đồng bộ.</p>
<p>Dòng cuối output là promise thứ hai, thất bại mà không có <code>catch</code>. Trình duyệt báo nó là <strong>unhandled rejection</strong>, màu đỏ, nhưng trang vẫn chạy tiếp, thường trong tình trạng hỏng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chuỗi không có <code>catch</code>.</strong> Trong trình duyệt bạn nhận một dòng đỏ trong console chẳng ai xem; vòng quay chờ quay mãi. Trong Node.js, unhandled rejection mặc định dừng cả tiến trình máy chủ. Chuỗi nào cũng cần một <code>catch</code>, hoặc một <code>try/catch</code> quanh <code>await</code> của nó, ở chỗ bạn thực sự làm được gì đó: hiện thông báo, thử lại, ghi log.</p></div>

<h3>Bước 4 — kết hợp nhiều promise</h3>
${ma('javascript', CODE['5-2/ket-hop.js'])}
${ra(OUT['5-2/ket-hop'])}
<table>
<thead><tr><th>Phương thức</th><th>Chờ</th><th>Kết quả</th><th>Dùng cho</th></tr></thead>
<tbody>
<tr><td><code>Promise.all</code></td><td>tất cả thành công</td><td>mảng giá trị; thất bại ở lỗi đầu tiên</td><td>Dữ liệu cần đủ cả</td></tr>
<tr><td><code>Promise.allSettled</code></td><td>tất cả chốt</td><td>trạng thái từng promise; không bao giờ thất bại</td><td>Việc độc lập, báo từng cái</td></tr>
<tr><td><code>Promise.race</code></td><td>cái chốt đầu tiên</td><td>giá trị hoặc lỗi của nó</td><td>Hết giờ chờ</td></tr>
<tr><td><code>Promise.any</code></td><td>cái thành công đầu tiên</td><td>giá trị của nó; chỉ thất bại nếu tất cả hỏng</td><td>Nguồn nhanh nhất</td></tr>
</tbody>
</table>
<p>Để ý thời gian: <code>all</code> xong sau khoảng 200 ms, bằng cái chậm nhất trong 100, 200 và 150, không phải tổng 450. Ba cái bắt đầu cùng lúc. Và <code>all</code> có một đầu vào hỏng thì thất bại sau 50 ms, không chờ phần còn lại.</p>

<h3>Bước 5 — bọc một API callback cũ</h3>
${ma('javascript', CODE['5-2/boc-callback.js'])}
${ra(OUT['5-2/boc-callback'])}
<p>Trước khi có promise, API bất đồng bộ nhận callback: một cho thành công, một cho thất bại. Ba bước liên tiếp lồng vào nhau, thành "kim tự tháp tai hoạ" ở cuối đoạn mã, nơi việc xử lý lỗi phải lặp lại ở mỗi tầng. Bọc API một lần — <code>new Promise((resolve, reject) =&gt; oldApi(arg, resolve, reject))</code> — biến nó thành thứ nối chuỗi được, kết hợp được với <code>Promise.all</code>, và <code>await</code> được. Node.js còn có sẵn công cụ cho việc này, <code>util.promisify</code>.</p>

<h3>Promise và event loop</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Mã của bạn</span><span class="lz-t">chạy tới khi xong</span><span class="lz-d"><code>then</code> chỉ <em>đăng ký</em> một callback.</span></div>
<div class="lz-layer"><span class="lz-k">Hàng đợi microtask</span><span class="lz-t">callback của promise</span><span class="lz-d">Chạy ngay khi ngăn xếp trống, trước mọi hẹn giờ (Bài 5.1).</span></div>
<div class="lz-layer"><span class="lz-k">Hàng đợi task</span><span class="lz-t">hẹn giờ, mạng, sự kiện</span><span class="lz-d">Công việc rốt cuộc làm promise chốt nằm ở đây.</span></div>
</div>
<p>Kể cả <code>Promise.resolve(5).then(…)</code>, có giá trị sẵn rồi, cũng chạy callback <em>sau</em> mã hiện tại. Promise không bao giờ gọi lại bạn giữa chừng hàm của chính bạn, nên thứ tự đoán trước được.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — bộ tải bảng điều khiển</strong></p>
<pre><code class="language-javascript">const fake = (name, ms, fail = false) =&gt;
  new Promise((res, rej) =&gt; setTimeout(() =&gt; (fail ? rej(new Error(name + ' failed')) : res(name)), ms));</code></pre>
<ol>
<li>Chuỗi: <code>fake('login', 100)</code> → rồi <code>fake('profile', 100)</code> → rồi in cả hai tên. Đo thời gian bằng <code>performance.now()</code>.</li>
<li>Thêm một bước hỏng <code>fake('settings', 50, true)</code> ở giữa, và một <code>catch</code> trả về <code>'default settings'</code> để chuỗi đi tiếp.</li>
<li>Tải <code>fake('news', 300)</code>, <code>fake('weather', 200)</code> và <code>fake('ads', 100, true)</code> cùng lúc bằng <code>allSettled</code>, và in cái nào thành công.</li>
<li>Viết <code>withTimeout(promise, ms)</code> bằng <code>Promise.race</code>.</li>
</ol>
<p>Gợi ý: ở bước 1, trả về promise bên trong ở mỗi <code>then</code>.</p>
<p><strong>Xong khi:</strong> bước 1 tốn khoảng 200 ms và in cả hai tên; bước 2 in <code>default settings</code> và vẫn tới được cuối chuỗi; bước 3 xong trong khoảng 300 ms (không phải 600) với các trạng thái <code>fulfilled, fulfilled, rejected</code>; và <code>withTimeout(fake('slow', 500), 200)</code> thất bại sau khoảng 200 ms. Sau đó làm module Code Lab 5.2.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">promise</span><span class="v">lời hứa — đại diện cho giá trị đến sau.</span></div>
  <div class="kv"><span class="k">pending / fulfilled / rejected</span><span class="v">đang chờ / thành công / thất bại.</span></div>
  <div class="kv"><span class="k">settle</span><span class="v">chốt — không còn chờ nữa.</span></div>
  <div class="kv"><span class="k">resolve / reject</span><span class="v">báo thành công / báo thất bại.</span></div>
  <div class="kv"><span class="k">then / catch / finally</span><span class="v">khi thành công / khi lỗi / dù sao cũng chạy.</span></div>
  <div class="kv"><span class="k">chain</span><span class="v">chuỗi then nối tiếp.</span></div>
  <div class="kv"><span class="k">unhandled rejection</span><span class="v">promise thất bại không ai bắt.</span></div>
  <div class="kv"><span class="k">parallel</span><span class="v">song song — chạy cùng lúc.</span></div>
  <div class="kv"><span class="k">callback hell</span><span class="v">kim tự tháp callback lồng nhau.</span></div>
  <div class="kv"><span class="k">promisify</span><span class="v">bọc API callback thành promise.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Promise đang chờ, rồi chốt một lần: thành công với giá trị hoặc thất bại với lỗi.</li>
  <li><code>then</code> trả về promise mới; hãy trả về promise bên trong, nếu không chuỗi sẽ không chờ.</li>
  <li>Lỗi nhảy tới <code>catch</code> gần nhất; thứ nó trả về tiếp tục chuỗi.</li>
  <li>Luôn kết thúc chuỗi bằng <code>catch</code>; unhandled rejection làm sập Node.js.</li>
  <li><code>all</code>, <code>allSettled</code>, <code>race</code>, <code>any</code>: bắt đầu cùng lúc, tốn thời gian bằng cái chậm nhất.</li>
  <li>Bọc API callback cũ trong <code>new Promise</code> một lần.</li>
  <li>Callback của promise là microtask: không bao giờ đồng bộ, luôn trước hẹn giờ.</li>
</ul>
${nguon('📗', 'MDN — Using promises', 'Nối chuỗi, lỗi và kết hợp', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises')}
${nguon('📘', 'javascript.info — Promises, async/await', 'Trọn chương, kèm bài tập', 'https://javascript.info/async')}
</div>
`,
};
