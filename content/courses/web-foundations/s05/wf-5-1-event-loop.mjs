/**
 * Bài 5.1 — Event loop (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/5-1; đo khung hình bằng requestAnimationFrame).
 * Deck: scripts/slides-src/wf-5-1.mjs (9 slide, WF/v1/wf-5-1). Code Lab: module 5.1 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-5-1', 'The event loop', 'Event loop', [
  [1, 'The event loop',
    '<p>JavaScript does one thing at a time, yet a page can download data, run a timer and respond to clicks all at once. The mechanism that makes this possible is the event loop. Understanding it explains why some code runs "later" and why a page sometimes freezes.</p>',
    '<p>JavaScript làm một việc mỗi lúc, vậy mà một trang vẫn vừa tải dữ liệu, vừa chạy hẹn giờ, vừa phản hồi cú bấm. Cơ chế cho phép điều đó là event loop. Hiểu nó giải thích vì sao có mã chạy "sau đó" và vì sao đôi khi trang bị đơ.</p>'],
  [2, 'After this lesson you can…',
    '<p>The practical payoff is the last outcome: keeping a page responsive. When the browser is busy running your code, it cannot repaint or react to the user. Measuring that, rather than guessing, is what this lesson does.</p>',
    '<p>Lợi ích thực tế nằm ở kết quả cuối: giữ trang luôn phản hồi. Khi trình duyệt đang bận chạy mã của bạn, nó không vẽ lại được và không phản ứng với người dùng. Bài này đo điều đó, thay vì đoán.</p>'],
  [3, 'One thread, one call stack',
    '<p>The JavaScript engine has a single call stack: functions run one at a time, to completion. Slow jobs like timers and network requests are handed to the browser, which works on them in the background and queues a callback when they finish.</p>',
    '<p>Bộ máy JavaScript có một ngăn xếp lời gọi duy nhất: các hàm chạy từng cái một, cho tới khi xong. Việc chậm như hẹn giờ và request mạng được giao cho trình duyệt, nó làm ở nền và xếp một callback vào hàng đợi khi xong.</p>'],
  [4, 'Predict the order',
    '<p>Five lines; most people get the order wrong. Synchronous code runs first, all of it. Then every microtask, such as promise callbacks. Only then the next macrotask, such as a timer, even one set to zero milliseconds. Zero means "as soon as possible", not "now".</p>',
    '<p>Năm dòng; đa số người đoán sai thứ tự. Mã đồng bộ chạy trước, hết sạch. Rồi mọi microtask, như callback của promise. Chỉ sau đó mới tới macrotask kế tiếp, như hẹn giờ, kể cả khi đặt 0 mili giây. Số 0 nghĩa là "sớm nhất có thể", không phải "ngay bây giờ".</p>'],
  [5, 'The loop, step by step',
    '<p>One task from the queue runs to completion. Then all microtasks are drained. Then the browser may repaint the screen. Then the next task. Everything you will meet in this chapter — promises, async functions, fetch — fits into this cycle.</p>',
    '<p>Một task trong hàng đợi chạy tới khi xong. Rồi mọi microtask được xả hết. Rồi trình duyệt có thể vẽ lại màn hình. Rồi tới task kế tiếp. Mọi thứ bạn gặp trong chương này — promise, hàm async, fetch — đều nằm trong vòng này.</p>'],
  [6, 'A timer cannot interrupt',
    '<p>The timer asked for zero milliseconds and ran after about 300, because a busy loop held the call stack for 300. Timers give a minimum delay, never a guarantee. The same is true for clicks: while your code runs, the user’s click waits in the queue.</p>',
    '<p>Hẹn giờ xin 0 mili giây mà chạy sau khoảng 300, vì một vòng lặp bận chiếm ngăn xếp suốt 300. Hẹn giờ chỉ cho độ trễ tối thiểu, không bao giờ là cam kết. Cú bấm cũng vậy: khi mã của bạn đang chạy, cú bấm của người dùng chờ trong hàng đợi.</p>'],
  [7, 'Measured: a frozen page',
    '<p>The browser normally paints a frame many times per second; on the test machine, 121 frames in one second. Add 800 milliseconds of heavy work and only 27 frames were painted. Animations stutter and clicks feel ignored. That is what "blocking the main thread" means.</p>',
    '<p>Bình thường trình duyệt vẽ một khung hình nhiều lần mỗi giây; trên máy thử là 121 khung trong một giây. Thêm 800 mili giây việc nặng thì chỉ vẽ được 27 khung. Hiệu ứng giật và cú bấm như bị lờ đi. Đó là ý nghĩa của "chặn luồng chính".</p>'],
  [8, 'Keeping the page responsive',
    '<p>Split long work into chunks and give the loop a turn between them with <code>setTimeout</code>; here another timer ran in between. For truly heavy computation, move it to a Web Worker. And remember that network work is already asynchronous; just do not block while waiting.</p>',
    '<p>Chia việc dài thành từng phần nhỏ và nhường cho vòng lặp một lượt giữa chúng bằng <code>setTimeout</code>; ở đây một hẹn giờ khác đã chạy chen giữa. Với tính toán thật sự nặng, chuyển nó sang Web Worker. Và nhớ rằng việc mạng vốn đã bất đồng bộ; chỉ cần đừng chặn trong lúc chờ.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to predict the output of a mixed script, then to fix a page that freezes when a button is pressed. "Done when" is measured with the same frame counter as this lesson.</p>',
    '<p>Bài luyện yêu cầu bạn đoán output của một đoạn mã trộn lẫn, rồi sửa một trang bị đơ khi bấm nút. "Xong khi" được đo bằng chính bộ đếm khung hình trong bài.</p>'],
]);

export default {
  title: '5.1 — The event loop: how JS does one thing at a time|||5.1 — Event loop: JS làm từng việc một thế nào',
  slug: 'wf-5-1-event-loop',
  type: 'VIDEO',
  isFreePreview: true,
  video: { url: 'https://youtu.be/8aGhZQkoFbQ', durationSeconds: 0 },
  description: 'Một luồng, một ngăn xếp lời gọi; trình duyệt làm việc chậm ở nền; đoán thứ tự đồng bộ/microtask/macrotask (output thật); vòng event loop từng bước; hẹn giờ 0 ms chạy sau ~300 ms vì bị chặn; đo khung hình khi trang đơ (121 so với 27); chia nhỏ việc và Web Worker.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>How JavaScript does one thing at a time — and still never waits</h2>
<p class="lead">After this lesson you can explain what "single-threaded" means, predict the order in which synchronous code, promise callbacks and timers run, explain why a 0 ms timer is not instant, recognise code that freezes a page, and keep a page responsive during heavy work. You need this because the rest of this chapter — promises, <code>async</code>/<code>await</code>, <code>fetch</code> — is built on this one mechanism. Without it, asynchronous code looks like it runs in a random order; with it, every output becomes predictable.</p>

<h3>Step 1 — one call stack</h3>
<p>The JavaScript engine in a tab runs your code on a single <strong>thread</strong>, with a single <strong>call stack</strong>: the list of functions currently running. When a function is called it goes on top; when it returns, it is removed. Only the function on top runs. There is no way for two pieces of your code to run at the same moment.</p>
<p>So how does a page wait two seconds for a server without freezing? It does not wait. Slow jobs are handed to the <strong>browser</strong>, which has its own threads for timers, network requests and so on. Your code continues immediately. When the job finishes, the browser puts your callback in a <strong>queue</strong>, and the event loop runs it when the call stack is empty.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Call stack</span><span class="lz-t">running now</span><span class="lz-d">One function at a time, always to completion.</span></div>
<div class="lz-layer"><span class="lz-k">Web APIs</span><span class="lz-t">the browser, in the background</span><span class="lz-d">Timers, <code>fetch</code>, events. They do the waiting.</span></div>
<div class="lz-layer"><span class="lz-k">Microtask queue</span><span class="lz-t">urgent callbacks</span><span class="lz-d">Promise <code>.then</code>, <code>await</code> continuations, <code>queueMicrotask</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Task queue</span><span class="lz-t">everything else</span><span class="lz-d">Timers, clicks, network events: one per turn of the loop.</span></div>
</div>

<h3>Step 2 — predict the order</h3>
<p>Cover the output and write down the order you expect:</p>
${ma('javascript', CODE['5-1/thu-tu.js'])}
${ra(OUT['5-1/thu-tu'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Run the current script</span><span class="lz-d">Lines 1 and 2 print. The timer and the promise are only <em>scheduled</em>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Drain all microtasks</span><span class="lz-d">Promise callback, then <code>queueMicrotask</code>. New microtasks added now also run now.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Maybe repaint</span><span class="lz-d">The browser updates the screen if something changed.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Take the next task</span><span class="lz-d">The timer, even at 0 ms. Then back to step 2.</span></div>
</div>
<p>The rule: <strong>synchronous code first, then all microtasks, then one macrotask</strong>. Promise callbacks always beat timers that were scheduled at the same time.</p>

<h3>Step 3 — a timer cannot interrupt your code</h3>
${ma('javascript', CODE['5-1/chan.js'])}
${ra(OUT['5-1/chan'])}
<p>The timer was set to 0 milliseconds, and ran after 301 (see the output). The busy loop held the call stack for 300 milliseconds, and the event loop cannot take the next task until the stack is empty. <strong>A delay is a minimum, never a promise</strong>. The same applies to everything in the task queue: a click, a network response, a scroll event. While your code runs, they wait.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>setTimeout(fn, 0)</code> to "run it now".</strong> Beginners use it to fix ordering problems, and it appears to work, by luck. It only means "after the current code and all microtasks". It does not mean soon if something heavy is running, and browsers raise the minimum delay to about 4 ms for nested timers and much more in background tabs. If you need a result before continuing, use the promise or the event that signals it (Lessons 5.2–5.3).</p></div>

<h3>Step 4 — measured: a frozen page</h3>
<p>The browser repaints between tasks. If a task never ends, the screen never updates. This page counts how many frames are painted during one second, first calm, then with 800 milliseconds of heavy work inside that second:</p>
${ma('html', CODE['5-1/dong-bang.html'], [6, 23])}
${ra(OUT['5-1/dong-bang'])}
<p>The test machine paints at 120 Hz, so a calm second gave 121 frames (60 is typical on many screens). With the busy loop, only 27: for 800 milliseconds, nothing on the page moved, no hover effect appeared, and a click would have been answered only afterwards. Users describe this as "the site froze". Anything over about 50 ms on the main thread is a noticeable delay; Lesson 14.4 measures it as Total Blocking Time.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a big synchronous job in a click handler.</strong> Sorting 100 000 rows, parsing a huge JSON file, or a tight loop inside a click handler freezes the button that was just clicked: no pressed state, no spinner, nothing, because the spinner can only be painted <em>after</em> your handler returns. Show the loading state, then yield (Step 5), then do the work.</p></div>

<h3>Step 5 — keeping the page responsive</h3>
${ma('javascript', CODE['5-1/chia-nho.js'])}
${ra(OUT['5-1/chia-nho'])}
<p>The same sum, split into three chunks with <code>setTimeout(step, 0)</code> between them. Another timer ran in between: the event loop got its turns, so clicks and repaints could happen too. Your options, from simplest:</p>
<table>
<thead><tr><th>Situation</th><th>What to do</th></tr></thead>
<tbody>
<tr><td>Waiting for a server or a file</td><td>Nothing special: <code>fetch</code> is already asynchronous. Just use <code>await</code> (Lesson 5.3)</td></tr>
<tr><td>A long loop over data</td><td>Split it into chunks and yield between them</td></tr>
<tr><td>Real number-crunching (images, big data)</td><td>A Web Worker: a separate thread with its own call stack</td></tr>
<tr><td>Rendering thousands of rows</td><td>Render only what is visible ("virtualisation")</td></tr>
</tbody>
</table>
<p>Node.js uses the same model on the server (with a few extra queues), which is why one slow synchronous function in a Node API delays <em>every</em> user at once. The Node.js course measures that in detail.</p>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — predict, then unfreeze</strong></p>
<ol>
<li>Predict the output of this, then run it:
<pre><code class="language-javascript">console.log('A');
setTimeout(() =&gt; console.log('B'), 0);
Promise.resolve().then(() =&gt; { console.log('C'); setTimeout(() =&gt; console.log('D'), 0); });
Promise.resolve().then(() =&gt; console.log('E'));
console.log('F');</code></pre></li>
<li>Build a page with a button "Calculate" that sums the numbers from 0 to 300 million in one loop, and a CSS spinner that rotates continuously. Click it and watch the spinner.</li>
<li>Rewrite the calculation in chunks of 10 million with <code>setTimeout</code>, showing the progress as a percentage.</li>
</ol>
<p>Hint: a CSS animation on <code>transform</code> may keep running on another thread, so also show a counter updated by <code>requestAnimationFrame</code> to see the freeze clearly.</p>
<p><strong>Done when:</strong> your prediction is <code>A F C E B D</code>; in the first version the counter stops during the calculation; in the chunked version it keeps moving and the percentage rises in steps; and both versions print the same final sum. Then Code Lab module 5.1.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">single-threaded</span><span class="v">đơn luồng — chạy một việc mỗi lúc.</span></div>
  <div class="kv"><span class="k">call stack</span><span class="v">ngăn xếp lời gọi — các hàm đang chạy.</span></div>
  <div class="kv"><span class="k">synchronous / asynchronous</span><span class="v">đồng bộ / bất đồng bộ.</span></div>
  <div class="kv"><span class="k">Web APIs</span><span class="v">các dịch vụ của trình duyệt chạy ở nền.</span></div>
  <div class="kv"><span class="k">task (macrotask)</span><span class="v">việc trong hàng đợi chính — hẹn giờ, sự kiện.</span></div>
  <div class="kv"><span class="k">microtask</span><span class="v">việc ưu tiên — callback của promise.</span></div>
  <div class="kv"><span class="k">event loop</span><span class="v">vòng lặp sự kiện — lấy việc từ hàng đợi khi ngăn xếp trống.</span></div>
  <div class="kv"><span class="k">main thread</span><span class="v">luồng chính — nơi JS, bố cục và vẽ chia nhau.</span></div>
  <div class="kv"><span class="k">blocking</span><span class="v">chặn — chiếm luồng quá lâu.</span></div>
  <div class="kv"><span class="k">yield</span><span class="v">nhường lượt cho vòng lặp.</span></div>
  <div class="kv"><span class="k">Web Worker</span><span class="v">luồng riêng cho việc nặng.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Your JavaScript runs on one thread, one function at a time, each to completion.</li>
  <li>Slow jobs are done by the browser; their callbacks wait in queues.</li>
  <li>Order: synchronous code, then all microtasks (promises), then one task (timers, events).</li>
  <li>A timer delay is a minimum; nothing can interrupt running code.</li>
  <li>Long synchronous work freezes the page: measured 121 frames dropping to 27.</li>
  <li>Yield between chunks, or use a Web Worker for heavy computation.</li>
</ul>
${nguon('📗', 'MDN — The event loop', 'Stack, queue and run-to-completion', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop')}
${nguon('🎥', 'Jake Archibald — In the Loop (JSConf)', 'The best visual explanation of tasks, microtasks and rendering', 'https://www.youtube.com/watch?v=cCOL7MC4Pl0')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-2-2-event-loop', title: 'Node.js 2.2 — the event loop, phase by phase', sub: 'The same loop on the server, with its extra queues', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>JavaScript làm từng việc một — mà vẫn không bao giờ phải chờ</h2>
<p class="lead">Học xong bài này bạn giải thích được "đơn luồng" nghĩa là gì, đoán được thứ tự chạy của mã đồng bộ, callback của promise và hẹn giờ, giải thích được vì sao hẹn giờ 0 ms không chạy tức thì, nhận ra mã làm đơ trang, và giữ trang phản hồi trong lúc làm việc nặng. Bạn cần điều này vì phần còn lại của chương — promise, <code>async</code>/<code>await</code>, <code>fetch</code> — đều dựng trên đúng một cơ chế này. Thiếu nó, mã bất đồng bộ trông như chạy theo thứ tự ngẫu nhiên; có nó, mọi output đều đoán trước được.</p>

<h3>Bước 1 — một ngăn xếp lời gọi</h3>
<p>Bộ máy JavaScript trong một thẻ trình duyệt chạy mã của bạn trên một <strong>luồng (thread)</strong> duy nhất, với một <strong>ngăn xếp lời gọi (call stack)</strong> duy nhất: danh sách các hàm đang chạy. Gọi một hàm thì nó lên đỉnh; trả về thì nó bị gỡ ra. Chỉ hàm trên đỉnh được chạy. Không có cách nào để hai đoạn mã của bạn chạy cùng một lúc.</p>
<p>Vậy làm sao một trang chờ máy chủ hai giây mà không đơ? Nó không chờ. Việc chậm được giao cho <strong>trình duyệt</strong>, vốn có luồng riêng cho hẹn giờ, request mạng và các thứ khác. Mã của bạn chạy tiếp ngay lập tức. Khi việc xong, trình duyệt đặt callback của bạn vào một <strong>hàng đợi (queue)</strong>, và event loop chạy nó khi ngăn xếp trống.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Ngăn xếp lời gọi</span><span class="lz-t">đang chạy</span><span class="lz-d">Mỗi lúc một hàm, luôn chạy tới khi xong.</span></div>
<div class="lz-layer"><span class="lz-k">Web API</span><span class="lz-t">trình duyệt, ở nền</span><span class="lz-d">Hẹn giờ, <code>fetch</code>, sự kiện. Chúng làm phần chờ.</span></div>
<div class="lz-layer"><span class="lz-k">Hàng đợi microtask</span><span class="lz-t">callback ưu tiên</span><span class="lz-d"><code>.then</code> của promise, phần tiếp sau <code>await</code>, <code>queueMicrotask</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Hàng đợi task</span><span class="lz-t">mọi thứ khác</span><span class="lz-d">Hẹn giờ, cú bấm, sự kiện mạng: mỗi vòng lặp một cái.</span></div>
</div>

<h3>Bước 2 — đoán thứ tự</h3>
<p>Che output lại và viết ra thứ tự bạn mong đợi:</p>
${ma('javascript', CODE['5-1/thu-tu.js'])}
${ra(OUT['5-1/thu-tu'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chạy script hiện tại</span><span class="lz-d">Dòng 1 và 2 được in. Hẹn giờ và promise chỉ mới được <em>lên lịch</em>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Xả hết microtask</span><span class="lz-d">Callback của promise, rồi <code>queueMicrotask</code>. Microtask mới thêm vào lúc này cũng chạy luôn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Có thể vẽ lại</span><span class="lz-d">Trình duyệt cập nhật màn hình nếu có gì thay đổi.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Lấy task tiếp theo</span><span class="lz-d">Hẹn giờ, kể cả 0 ms. Rồi quay lại bước 2.</span></div>
</div>
<p>Luật: <strong>mã đồng bộ trước, rồi mọi microtask, rồi một macrotask</strong>. Callback của promise luôn thắng hẹn giờ được lên lịch cùng lúc.</p>

<h3>Bước 3 — hẹn giờ không ngắt được mã của bạn</h3>
${ma('javascript', CODE['5-1/chan.js'])}
${ra(OUT['5-1/chan'])}
<p>Hẹn giờ đặt 0 mili giây, mà chạy sau 301 (xem output). Vòng lặp bận giữ ngăn xếp suốt 300 mili giây, và event loop không lấy được task tiếp theo khi ngăn xếp chưa trống. <strong>Độ trễ là mức tối thiểu, không bao giờ là cam kết</strong>. Mọi thứ trong hàng đợi task cũng vậy: cú bấm, phản hồi mạng, sự kiện cuộn. Khi mã của bạn đang chạy, chúng phải chờ.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>setTimeout(fn, 0)</code> để "chạy ngay".</strong> Người mới dùng nó để sửa lỗi thứ tự, và có vẻ chạy được, do may mắn. Nó chỉ có nghĩa "sau mã hiện tại và mọi microtask". Nó không có nghĩa là sớm nếu có việc nặng đang chạy, và trình duyệt nâng độ trễ tối thiểu lên khoảng 4 ms với hẹn giờ lồng nhau, nhiều hơn hẳn ở thẻ chạy nền. Nếu cần một kết quả trước khi đi tiếp, hãy dùng promise hoặc sự kiện báo hiệu nó (Bài 5.2–5.3).</p></div>

<h3>Bước 4 — đo thật: một trang bị đơ</h3>
<p>Trình duyệt vẽ lại giữa các task. Nếu một task không bao giờ xong, màn hình không bao giờ cập nhật. Trang này đếm số khung hình được vẽ trong một giây, lần đầu bình thường, lần sau có 800 mili giây việc nặng nằm trong giây đó:</p>
${ma('html', CODE['5-1/dong-bang.html'], [6, 23])}
${ra(OUT['5-1/dong-bang'])}
<p>Máy thử vẽ ở 120 Hz, nên một giây bình thường cho 121 khung (60 là con số thường gặp trên nhiều màn hình). Có vòng lặp bận thì chỉ còn 27: suốt 800 mili giây không gì trên trang chuyển động, hiệu ứng hover không hiện, và một cú bấm chỉ được trả lời sau đó. Người dùng gọi đó là "trang bị treo". Bất cứ thứ gì chiếm luồng chính quá khoảng 50 ms là độ trễ thấy rõ; Bài 14.4 đo nó bằng chỉ số Total Blocking Time.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — việc đồng bộ lớn trong hàm xử lý cú bấm.</strong> Sắp xếp 100 000 dòng, phân tích một tệp JSON khổng lồ, hay một vòng lặp chặt trong hàm xử lý cú bấm sẽ làm đơ chính cái nút vừa được bấm: không có trạng thái nhấn, không có vòng quay chờ, không gì cả, vì vòng quay chỉ được vẽ <em>sau khi</em> hàm xử lý của bạn trả về. Hãy hiện trạng thái đang tải, rồi nhường lượt (Bước 5), rồi mới làm việc.</p></div>

<h3>Bước 5 — giữ trang luôn phản hồi</h3>
${ma('javascript', CODE['5-1/chia-nho.js'])}
${ra(OUT['5-1/chia-nho'])}
<p>Cùng một phép cộng, chia thành ba phần với <code>setTimeout(step, 0)</code> ở giữa. Một hẹn giờ khác đã chạy chen vào: event loop có được lượt của nó, nên cú bấm và việc vẽ lại cũng xảy ra được. Các lựa chọn, từ đơn giản nhất:</p>
<table>
<thead><tr><th>Tình huống</th><th>Nên làm gì</th></tr></thead>
<tbody>
<tr><td>Chờ máy chủ hay tệp</td><td>Không gì đặc biệt: <code>fetch</code> vốn bất đồng bộ. Chỉ cần dùng <code>await</code> (Bài 5.3)</td></tr>
<tr><td>Vòng lặp dài trên dữ liệu</td><td>Chia thành từng phần và nhường lượt giữa chúng</td></tr>
<tr><td>Tính toán nặng thật sự (ảnh, dữ liệu lớn)</td><td>Web Worker: một luồng riêng có ngăn xếp riêng</td></tr>
<tr><td>Hiển thị hàng nghìn dòng</td><td>Chỉ vẽ phần nhìn thấy ("virtualisation")</td></tr>
</tbody>
</table>
<p>Node.js dùng cùng mô hình ở máy chủ (thêm vài hàng đợi), vì vậy một hàm đồng bộ chậm trong API Node làm trễ <em>mọi</em> người dùng cùng lúc. Khoá Node.js đo điều đó chi tiết.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — đoán, rồi gỡ đơ</strong></p>
<ol>
<li>Đoán output của đoạn này, rồi chạy:
<pre><code class="language-javascript">console.log('A');
setTimeout(() =&gt; console.log('B'), 0);
Promise.resolve().then(() =&gt; { console.log('C'); setTimeout(() =&gt; console.log('D'), 0); });
Promise.resolve().then(() =&gt; console.log('E'));
console.log('F');</code></pre></li>
<li>Dựng một trang có nút "Tính" cộng các số từ 0 tới 300 triệu trong một vòng lặp, và một vòng quay CSS xoay liên tục. Bấm nút và nhìn vòng quay.</li>
<li>Viết lại phép tính thành từng phần 10 triệu với <code>setTimeout</code>, hiện tiến độ bằng phần trăm.</li>
</ol>
<p>Gợi ý: hiệu ứng CSS trên <code>transform</code> có thể vẫn chạy ở luồng khác, nên hãy hiện thêm một bộ đếm cập nhật bằng <code>requestAnimationFrame</code> để thấy rõ chỗ đơ.</p>
<p><strong>Xong khi:</strong> bạn đoán là <code>A F C E B D</code>; ở bản đầu bộ đếm dừng trong lúc tính; ở bản chia nhỏ nó vẫn chạy và phần trăm tăng theo bậc; và cả hai bản in cùng một tổng cuối. Sau đó làm module Code Lab 5.1.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">single-threaded</span><span class="v">đơn luồng — chạy một việc mỗi lúc.</span></div>
  <div class="kv"><span class="k">call stack</span><span class="v">ngăn xếp lời gọi — các hàm đang chạy.</span></div>
  <div class="kv"><span class="k">synchronous / asynchronous</span><span class="v">đồng bộ / bất đồng bộ.</span></div>
  <div class="kv"><span class="k">Web APIs</span><span class="v">các dịch vụ của trình duyệt chạy ở nền.</span></div>
  <div class="kv"><span class="k">task (macrotask)</span><span class="v">việc trong hàng đợi chính — hẹn giờ, sự kiện.</span></div>
  <div class="kv"><span class="k">microtask</span><span class="v">việc ưu tiên — callback của promise.</span></div>
  <div class="kv"><span class="k">event loop</span><span class="v">vòng lặp sự kiện — lấy việc từ hàng đợi khi ngăn xếp trống.</span></div>
  <div class="kv"><span class="k">main thread</span><span class="v">luồng chính — nơi JS, bố cục và vẽ chia nhau.</span></div>
  <div class="kv"><span class="k">blocking</span><span class="v">chặn — chiếm luồng quá lâu.</span></div>
  <div class="kv"><span class="k">yield</span><span class="v">nhường lượt cho vòng lặp.</span></div>
  <div class="kv"><span class="k">Web Worker</span><span class="v">luồng riêng cho việc nặng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>JavaScript của bạn chạy trên một luồng, mỗi lúc một hàm, hàm nào cũng chạy tới khi xong.</li>
  <li>Việc chậm do trình duyệt làm; callback của chúng chờ trong hàng đợi.</li>
  <li>Thứ tự: mã đồng bộ, rồi mọi microtask (promise), rồi một task (hẹn giờ, sự kiện).</li>
  <li>Độ trễ hẹn giờ là mức tối thiểu; không gì ngắt được mã đang chạy.</li>
  <li>Việc đồng bộ dài làm đơ trang: đo được 121 khung tụt còn 27.</li>
  <li>Nhường lượt giữa các phần, hoặc dùng Web Worker cho tính toán nặng.</li>
</ul>
${nguon('📗', 'MDN — The event loop', 'Ngăn xếp, hàng đợi và chạy-tới-khi-xong', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop')}
${nguon('🎥', 'Jake Archibald — In the Loop (JSConf)', 'Giải thích trực quan nhất về task, microtask và việc vẽ', 'https://www.youtube.com/watch?v=cCOL7MC4Pl0')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-2-2-event-loop', title: 'Node.js 2.2 — event loop theo từng pha', sub: 'Cùng vòng lặp đó ở máy chủ, với các hàng đợi thêm', cta: 'Mở bài' })}
</div>
`,
};
