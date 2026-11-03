/**
 * Bài 5.3 — async/await (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/5-3).
 * Deck: scripts/slides-src/wf-5-3.mjs (9 slide, WF/v1/wf-5-3). Code Lab: module 5.3 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-5-3', 'async and await', 'async và await', [
  [1, 'async and await',
    '<p>Promises solved callback pyramids, but chains are still harder to read than normal code. <code>async</code> and <code>await</code> let you write asynchronous code that reads from top to bottom, with ordinary <code>try</code> and <code>catch</code>. Underneath, it is still promises.</p>',
    '<p>Promise đã giải quyết kim tự tháp callback, nhưng chuỗi then vẫn khó đọc hơn mã thường. <code>async</code> và <code>await</code> cho phép viết mã bất đồng bộ đọc từ trên xuống, với <code>try</code> và <code>catch</code> bình thường. Bên dưới, nó vẫn là promise.</p>'],
  [2, 'After this lesson you can…',
    '<p>Two outcomes here make a real difference in production code: running independent requests in parallel instead of one after another, and not using <code>forEach</code> with <code>await</code>. Both are measured with real timings.</p>',
    '<p>Hai kết quả ở đây tạo khác biệt thật trong mã chạy thật: chạy song song các request độc lập thay vì lần lượt, và không dùng <code>forEach</code> với <code>await</code>. Cả hai đều được đo bằng thời gian thật.</p>'],
  [3, 'The same code, two ways',
    '<p>The chain at the top and the async function below do exactly the same thing and print the same line. The second reads like a recipe: get the user, then get the orders, then print. Notice the first output line: an async function always returns a promise, immediately.</p>',
    '<p>Chuỗi ở trên và hàm async bên dưới làm đúng cùng một việc và in cùng một dòng. Cái thứ hai đọc như công thức nấu ăn: lấy người dùng, rồi lấy đơn hàng, rồi in ra. Để ý dòng output đầu: hàm async luôn trả về một promise, ngay lập tức.</p>'],
  [4, 'What await does',
    '<p><code>await</code> pauses only the async function it is in, until the promise settles, and then continues with the value. The rest of the page keeps running in the meantime. If the promise rejects, <code>await</code> throws the error right there, as if it were a normal exception.</p>',
    '<p><code>await</code> chỉ tạm dừng hàm async chứa nó, tới khi promise chốt, rồi chạy tiếp với giá trị. Phần còn lại của trang vẫn chạy trong lúc đó. Nếu promise thất bại, <code>await</code> ném lỗi ngay tại chỗ, như một ngoại lệ thường.</p>'],
  [5, 'try, catch and finally',
    '<p>Errors from awaited promises are caught with an ordinary <code>try</code> block. Here the unknown product is handled inside the function, so the caller receives a normal message, and <code>finally</code> runs in both cases — the right place to hide a spinner.</p>',
    '<p>Lỗi từ promise được await bắt bằng khối <code>try</code> bình thường. Ở đây sản phẩm không tồn tại được xử lý bên trong hàm, nên bên gọi nhận một thông báo bình thường, và <code>finally</code> chạy trong cả hai trường hợp — đúng chỗ để ẩn vòng quay chờ.</p>'],
  [6, 'Forgetting await',
    '<p>Without <code>await</code> you hold the promise, not the value. Joined to text it prints "object Promise"; compared with a string it is false. No error appears anywhere. When you see "object Promise" on a page, look for a missing await.</p>',
    '<p>Thiếu <code>await</code>, bạn đang giữ promise chứ không phải giá trị. Nối vào chữ thì in ra "object Promise"; so với chuỗi thì sai. Không có lỗi nào ở đâu cả. Khi thấy "object Promise" trên trang, hãy tìm chỗ thiếu await.</p>'],
  [7, 'Sequential or parallel?',
    '<p>Three requests of 200 milliseconds each. Awaiting them one by one took 600; starting them together and awaiting <code>Promise.all</code> took 200. If one request does not need the result of another, start them all first. This is the most common easy speed-up in real apps.</p>',
    '<p>Ba request, mỗi cái 200 mili giây. Await lần lượt từng cái tốn 600; khởi động cùng lúc rồi await <code>Promise.all</code> chỉ tốn 200. Nếu một request không cần kết quả của request khác, hãy khởi động tất cả trước. Đây là cách tăng tốc dễ dàng phổ biến nhất trong ứng dụng thật.</p>'],
  [8, 'await in loops',
    '<p><code>forEach</code> does not wait for async callbacks: it printed "done" before anything was saved, and the saves finished in the wrong order. A <code>for...of</code> loop with <code>await</code> runs them one after another, in order. For all at once, use <code>map</code> plus <code>Promise.all</code>.</p>',
    '<p><code>forEach</code> không chờ callback async: nó in "done" trước khi có gì được lưu, và các lần lưu xong theo thứ tự sai. Vòng <code>for...of</code> có <code>await</code> chạy lần lượt, đúng thứ tự. Muốn chạy tất cả cùng lúc, dùng <code>map</code> cộng <code>Promise.all</code>.</p>'],
  [9, 'Summary & practice',
    '<p>The practice rewrites the dashboard loader from Lesson 5.2 with async and await, then makes it faster. "Done when" uses measured timings: the parallel version must take about as long as the slowest request.</p>',
    '<p>Bài luyện viết lại bộ tải bảng điều khiển ở Bài 5.2 bằng async và await, rồi làm nó nhanh hơn. "Xong khi" dùng thời gian đo được: bản song song phải tốn khoảng bằng request chậm nhất.</p>'],
]);

export default {
  title: '5.3 — async/await: asynchronous code that reads top to bottom|||5.3 — async/await: mã bất đồng bộ đọc từ trên xuống',
  slug: 'wf-5-3-async-await',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/V_Kr9OSfDeU', durationSeconds: 0 },
  description: 'Viết lại chuỗi then bằng async/await, await làm gì, hàm async luôn trả promise, try/catch/finally, quên await ra "[object Promise]", tuần tự 600 ms so với song song 200 ms (đo thật), forEach không chờ còn for...of thì chờ, top-level await trong module.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Asynchronous code that reads like a recipe</h2>
<p class="lead">After this lesson you can write async functions, use <code>await</code> to get the value of a promise, handle errors with <code>try</code>/<code>catch</code>, spot a missing <code>await</code> from its symptom, decide between running requests one by one or in parallel, and loop over asynchronous work correctly. You need this because <code>async</code>/<code>await</code> is how almost all modern JavaScript — browser code, Node.js servers, React data loading — is written. Promises are still underneath, so every rule from Lesson 5.2 still applies.</p>

<h3>Step 1 — the same code, two ways</h3>
${ma('javascript', CODE['5-3/viet-lai.js'])}
${ra(OUT['5-3/viet-lai'])}
<p>Both versions fetch a user, then the user's orders, then print. The <code>.then</code> version needs a nested chain to keep <code>user</code> available for the last step. The <code>async</code> version simply uses variables, top to bottom. Look at the first output line: it was printed <em>before</em> either result, because calling an async function returns a promise immediately and continues; the body runs in the background.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">async function f() {…}</span><span class="v">The function always returns a promise. <code>return x</code> fulfils it with <code>x</code>; <code>throw</code> rejects it.</span></div>
  <div class="kv"><span class="k">await promise</span><span class="v">Pauses this function until the promise settles; gives the value, or throws the error.</span></div>
  <div class="kv"><span class="k">Where</span><span class="v">Only inside an async function, or at the top level of a module (Step 6).</span></div>
</div>

<h3>Step 2 — what <code>await</code> really does</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Reach <code>await</code></span><span class="lz-d">The function is suspended. Control returns to the caller.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The page keeps running</span><span class="lz-d">Other code, clicks and repaints happen. Nothing is blocked.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The promise settles</span><span class="lz-d">The rest of the function is queued as a microtask (Lesson 5.1).</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Resume</span><span class="lz-d">With the value; or, if rejected, by throwing the error at that line.</span></div>
</div>
<p>So <code>await</code> pauses <strong>only the function it is in</strong>, never the page. It is not like a sleep in other languages.</p>

<h3>Step 3 — errors with <code>try</code>/<code>catch</code></h3>
${ma('javascript', CODE['5-3/try-catch.js'])}
${ra(OUT['5-3/try-catch'])}
<p>A rejected promise makes <code>await</code> throw, so an ordinary <code>try</code>/<code>catch</code> handles it. Here the function catches the error itself and returns a normal message, so the caller never sees a rejection. <code>finally</code> ran both times: hide the loading indicator there. Decide <em>where</em> to catch: at the place that can do something useful, such as showing a message. Catching everything deep inside and returning <code>null</code> hides problems.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — an async function called without handling its promise.</strong> <code>saveForm();</code> on its own starts the work and ignores the result. If it fails, you get an unhandled rejection and the user sees nothing. Either <code>await</code> it inside a <code>try</code>, or attach a <code>.catch</code>. In event handlers: <code>button.addEventListener('click', () =&gt; saveForm().catch(showError));</code></p></div>

<h3>Step 4 — the missing <code>await</code></h3>
${ma('javascript', CODE['5-3/quen-await.js'])}
${ra(OUT['5-3/quen-await'])}
<p>Without <code>await</code>, <code>name</code> is the promise itself. Joined to text it becomes <code>[object Promise]</code>, it is not equal to <code>'Linh'</code>, and it has a <code>then</code> method. No error is thrown, so the bug travels until it appears on screen.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "[object Promise]" or a value that is always truthy.</strong> If your page shows <code>[object Promise]</code>, or <code>if (await isAdmin())</code> without the <code>await</code> always passes (a promise is truthy, Lesson 4.1), you forgot an <code>await</code>. TypeScript (Chapter 9) and ESLint's <code>no-floating-promises</code> rule catch this before you run anything.</p></div>

<h3>Step 5 — one by one, or all together?</h3>
${ma('javascript', CODE['5-3/tuan-tu-song-song.js'])}
${ra(OUT['5-3/tuan-tu-song-song'])}
<p>The same three 200 ms requests. The first function awaited each before starting the next, so their times added up to 600 ms. The second started all three at once, then awaited <code>Promise.all</code>: 200 ms, as long as the slowest. On a real page with three API calls, that is the difference between a snappy page and a slow one.</p>
<table>
<thead><tr><th>Situation</th><th>Write</th></tr></thead>
<tbody>
<tr><td>B needs A's result (orders need the user id)</td><td>Sequential: <code>const a = await A(); const b = await B(a);</code></td></tr>
<tr><td>A and B are independent</td><td>Parallel: <code>const [a, b] = await Promise.all([A(), B()]);</code></td></tr>
<tr><td>Independent, and some may fail</td><td><code>await Promise.allSettled([...])</code></td></tr>
</tbody>
</table>

<h3>Step 6 — <code>await</code> in loops</h3>
${ma('javascript', CODE['5-3/vong-lap-await.js'])}
${ra(OUT['5-3/vong-lap-await'])}
<p><code>forEach</code> calls your async callback three times and ignores the promises it returns. So "done" was printed first, and the three saves finished in the reverse order (their delays differed). <code>for...of</code> with <code>await</code> waits for each one before the next: in order, and "done" really means done.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>forEach(async …)</code>.</strong> It looks right and fails in two ways: the code after it runs before the work finishes, and errors inside become unhandled. Use <code>for...of</code> for one-at-a-time work, or <code>await Promise.all(items.map(async (item) =&gt; …))</code> to run them all together. The same goes for <code>filter</code> and <code>reduce</code>: they do not understand promises.</p></div>
<p>Finally, in a module you may <code>await</code> at the top level, outside any function:</p>
${ma('javascript', CODE['5-3/top-level.mjs'])}
${ra(OUT['5-3/top-level'])}
<p>That works in <code>&lt;script type="module"&gt;</code> and in Node.js <code>.mjs</code> files (Lesson 5.5). In a classic script, wrap the code in an async function instead.</p>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — the dashboard loader, rewritten</strong></p>
<p>Reuse <code>fake(name, ms, fail)</code> from Lesson 5.2.</p>
<ol>
<li>Write <code>async function loadDashboard()</code> that awaits <code>fake('user', 200)</code>, then <code>fake('orders', 200)</code>, then <code>fake('notifications', 200)</code>, and returns all three. Time it.</li>
<li>Orders need the user, but notifications do not. Rewrite it so that notifications load at the same time as the user-then-orders sequence. Time it again.</li>
<li>Make notifications fail. Wrap the call so that the dashboard still returns, with <code>notifications: []</code>.</li>
<li>Save five items with a delay each, first with <code>forEach</code>, then with <code>for...of</code>, then with <code>Promise.all</code>, printing "done" after each version.</li>
</ol>
<p>Hint: start a promise without awaiting it (<code>const n = fake('notifications', 200);</code>), and await it later.</p>
<p><strong>Done when:</strong> version 1 takes about 600 ms and version 2 about 400 ms; version 3 returns an empty notification list without an unhandled rejection; and in step 4 only the <code>forEach</code> version prints "done" before the saves. Then Code Lab module 5.3.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">async function</span><span class="v">hàm bất đồng bộ — luôn trả về promise.</span></div>
  <div class="kv"><span class="k">await</span><span class="v">chờ promise chốt, lấy giá trị hoặc ném lỗi.</span></div>
  <div class="kv"><span class="k">suspend / resume</span><span class="v">tạm dừng / chạy tiếp hàm.</span></div>
  <div class="kv"><span class="k">sequential</span><span class="v">tuần tự — xong cái này mới tới cái kia.</span></div>
  <div class="kv"><span class="k">parallel / concurrent</span><span class="v">song song / đồng thời — chạy cùng lúc.</span></div>
  <div class="kv"><span class="k">floating promise</span><span class="v">promise trôi nổi — không ai await hay catch.</span></div>
  <div class="kv"><span class="k">top-level await</span><span class="v">await ở cấp ngoài cùng của module.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>async</code> functions return promises; <code>await</code> unwraps them, top to bottom.</li>
  <li><code>await</code> pauses only its own function, never the page.</li>
  <li>A rejected promise makes <code>await</code> throw: use <code>try</code>/<code>catch</code>/<code>finally</code>.</li>
  <li>"[object Promise]" means a missing <code>await</code>.</li>
  <li>Independent requests: start them together, <code>await Promise.all</code> (600 ms became 200 ms).</li>
  <li>Never <code>forEach(async …)</code>: use <code>for...of</code> or <code>Promise.all(map(…))</code>.</li>
  <li>Top-level <code>await</code> works in modules.</li>
</ul>
${nguon('📗', 'MDN — async function', 'Reference, with examples of sequential and parallel code', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function')}
${nguon('📘', 'javascript.info — Async/await', 'Short chapter with tasks', 'https://javascript.info/async-await')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', title: 'Node.js 1.4 — asynchronous code on the server', sub: 'The same tools with files, databases and errors that can crash a process', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Mã bất đồng bộ đọc như một công thức nấu ăn</h2>
<p class="lead">Học xong bài này bạn viết được hàm async, dùng <code>await</code> để lấy giá trị của promise, xử lý lỗi bằng <code>try</code>/<code>catch</code>, nhận ra chỗ thiếu <code>await</code> từ triệu chứng của nó, quyết định chạy request lần lượt hay song song, và lặp qua công việc bất đồng bộ cho đúng. Bạn cần điều này vì <code>async</code>/<code>await</code> là cách viết gần như toàn bộ JavaScript hiện đại — mã trình duyệt, máy chủ Node.js, tải dữ liệu trong React. Bên dưới vẫn là promise, nên mọi luật ở Bài 5.2 vẫn còn hiệu lực.</p>

<h3>Bước 1 — cùng một đoạn mã, hai cách viết</h3>
${ma('javascript', CODE['5-3/viet-lai.js'])}
${ra(OUT['5-3/viet-lai'])}
<p>Cả hai bản đều lấy người dùng, rồi đơn hàng của người đó, rồi in ra. Bản <code>.then</code> cần một chuỗi lồng để giữ <code>user</code> dùng được ở bước cuối. Bản <code>async</code> chỉ đơn giản dùng biến, từ trên xuống. Nhìn dòng output đầu: nó được in <em>trước</em> cả hai kết quả, vì gọi hàm async trả về promise ngay lập tức và chạy tiếp; thân hàm chạy ở nền.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">async function f() {…}</span><span class="v">Hàm luôn trả về promise. <code>return x</code> làm nó thành công với <code>x</code>; <code>throw</code> làm nó thất bại.</span></div>
  <div class="kv"><span class="k">await promise</span><span class="v">Tạm dừng hàm này tới khi promise chốt; cho giá trị, hoặc ném lỗi.</span></div>
  <div class="kv"><span class="k">Dùng ở đâu</span><span class="v">Chỉ trong hàm async, hoặc ở cấp ngoài cùng của module (Bước 6).</span></div>
</div>

<h3>Bước 2 — <code>await</code> thật sự làm gì</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Gặp <code>await</code></span><span class="lz-d">Hàm bị tạm dừng. Quyền điều khiển trở về bên gọi.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Trang vẫn chạy</span><span class="lz-d">Mã khác, cú bấm và việc vẽ lại vẫn xảy ra. Không gì bị chặn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Promise chốt</span><span class="lz-d">Phần còn lại của hàm được xếp hàng như một microtask (Bài 5.1).</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chạy tiếp</span><span class="lz-d">Với giá trị; hoặc, nếu thất bại, ném lỗi ngay tại dòng đó.</span></div>
</div>
<p>Vậy <code>await</code> chỉ tạm dừng <strong>hàm chứa nó</strong>, không bao giờ dừng trang. Nó không giống lệnh sleep ở ngôn ngữ khác.</p>

<h3>Bước 3 — lỗi với <code>try</code>/<code>catch</code></h3>
${ma('javascript', CODE['5-3/try-catch.js'])}
${ra(OUT['5-3/try-catch'])}
<p>Promise thất bại làm <code>await</code> ném lỗi, nên <code>try</code>/<code>catch</code> bình thường xử lý được. Ở đây hàm tự bắt lỗi và trả về một thông báo bình thường, nên bên gọi không bao giờ thấy thất bại. <code>finally</code> chạy cả hai lần: hãy ẩn chỉ báo đang tải ở đó. Hãy quyết định bắt lỗi <em>ở đâu</em>: ở chỗ làm được gì đó hữu ích, như hiện thông báo. Bắt mọi thứ ở tận sâu bên trong rồi trả <code>null</code> sẽ giấu mất vấn đề.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — gọi hàm async mà không xử lý promise của nó.</strong> <code>saveForm();</code> đứng một mình khởi động công việc và bỏ qua kết quả. Nếu nó hỏng, bạn nhận một unhandled rejection và người dùng chẳng thấy gì. Hoặc <code>await</code> nó trong <code>try</code>, hoặc gắn <code>.catch</code>. Trong hàm xử lý sự kiện: <code>button.addEventListener('click', () =&gt; saveForm().catch(showError));</code></p></div>

<h3>Bước 4 — thiếu <code>await</code></h3>
${ma('javascript', CODE['5-3/quen-await.js'])}
${ra(OUT['5-3/quen-await'])}
<p>Thiếu <code>await</code>, <code>name</code> chính là promise. Nối vào chữ nó thành <code>[object Promise]</code>, nó không bằng <code>'Linh'</code>, và nó có phương thức <code>then</code>. Không lỗi nào được ném, nên lỗi cứ trôi đi cho tới khi lộ ra trên màn hình.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "[object Promise]" hay một giá trị luôn truthy.</strong> Nếu trang hiện <code>[object Promise]</code>, hoặc <code>if (await isAdmin())</code> mà thiếu <code>await</code> thì luôn qua (promise là truthy, Bài 4.1), bạn đã quên một <code>await</code>. TypeScript (Chương 9) và luật <code>no-floating-promises</code> của ESLint bắt được lỗi này trước khi chạy.</p></div>

<h3>Bước 5 — lần lượt, hay cùng lúc?</h3>
${ma('javascript', CODE['5-3/tuan-tu-song-song.js'])}
${ra(OUT['5-3/tuan-tu-song-song'])}
<p>Cùng ba request 200 ms. Hàm đầu await từng cái rồi mới bắt đầu cái tiếp theo, nên thời gian cộng dồn thành 600 ms. Hàm thứ hai khởi động cả ba cùng lúc, rồi await <code>Promise.all</code>: 200 ms, bằng cái chậm nhất. Trên một trang thật có ba lời gọi API, đó là khác biệt giữa trang nhanh nhẹn và trang chậm chạp.</p>
<table>
<thead><tr><th>Tình huống</th><th>Viết</th></tr></thead>
<tbody>
<tr><td>B cần kết quả của A (đơn hàng cần id người dùng)</td><td>Tuần tự: <code>const a = await A(); const b = await B(a);</code></td></tr>
<tr><td>A và B độc lập</td><td>Song song: <code>const [a, b] = await Promise.all([A(), B()]);</code></td></tr>
<tr><td>Độc lập, và có thể có cái hỏng</td><td><code>await Promise.allSettled([...])</code></td></tr>
</tbody>
</table>

<h3>Bước 6 — <code>await</code> trong vòng lặp</h3>
${ma('javascript', CODE['5-3/vong-lap-await.js'])}
${ra(OUT['5-3/vong-lap-await'])}
<p><code>forEach</code> gọi callback async của bạn ba lần và bỏ qua các promise nó trả về. Nên "done" được in trước, và ba lần lưu xong theo thứ tự ngược (độ trễ của chúng khác nhau). <code>for...of</code> có <code>await</code> chờ từng cái trước khi tới cái sau: đúng thứ tự, và "done" thật sự là xong.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>forEach(async …)</code>.</strong> Trông đúng mà hỏng theo hai kiểu: mã phía sau chạy trước khi công việc xong, và lỗi bên trong thành unhandled. Dùng <code>for...of</code> cho việc làm từng cái một, hoặc <code>await Promise.all(items.map(async (item) =&gt; …))</code> để chạy tất cả cùng lúc. <code>filter</code> và <code>reduce</code> cũng vậy: chúng không hiểu promise.</p></div>
<p>Cuối cùng, trong module bạn có thể <code>await</code> ở cấp ngoài cùng, ngoài mọi hàm:</p>
${ma('javascript', CODE['5-3/top-level.mjs'])}
${ra(OUT['5-3/top-level'])}
<p>Điều đó chạy được trong <code>&lt;script type="module"&gt;</code> và trong tệp <code>.mjs</code> của Node.js (Bài 5.5). Ở script cổ điển, hãy bọc mã trong một hàm async.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — viết lại bộ tải bảng điều khiển</strong></p>
<p>Dùng lại <code>fake(name, ms, fail)</code> ở Bài 5.2.</p>
<ol>
<li>Viết <code>async function loadDashboard()</code> await <code>fake('user', 200)</code>, rồi <code>fake('orders', 200)</code>, rồi <code>fake('notifications', 200)</code>, và trả về cả ba. Đo thời gian.</li>
<li>Đơn hàng cần người dùng, còn thông báo thì không. Viết lại để thông báo tải cùng lúc với chuỗi người dùng-rồi-đơn-hàng. Đo lại.</li>
<li>Cho thông báo hỏng. Bọc lời gọi để bảng điều khiển vẫn trả về, với <code>notifications: []</code>.</li>
<li>Lưu năm mục, mỗi mục có độ trễ, lần lượt bằng <code>forEach</code>, rồi <code>for...of</code>, rồi <code>Promise.all</code>, in "done" sau mỗi bản.</li>
</ol>
<p>Gợi ý: khởi động promise mà chưa await (<code>const n = fake('notifications', 200);</code>), rồi await nó sau.</p>
<p><strong>Xong khi:</strong> bản 1 tốn khoảng 600 ms và bản 2 khoảng 400 ms; bản 3 trả về danh sách thông báo rỗng mà không có unhandled rejection; và ở bước 4 chỉ bản <code>forEach</code> in "done" trước các lần lưu. Sau đó làm module Code Lab 5.3.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">async function</span><span class="v">hàm bất đồng bộ — luôn trả về promise.</span></div>
  <div class="kv"><span class="k">await</span><span class="v">chờ promise chốt, lấy giá trị hoặc ném lỗi.</span></div>
  <div class="kv"><span class="k">suspend / resume</span><span class="v">tạm dừng / chạy tiếp hàm.</span></div>
  <div class="kv"><span class="k">sequential</span><span class="v">tuần tự — xong cái này mới tới cái kia.</span></div>
  <div class="kv"><span class="k">parallel / concurrent</span><span class="v">song song / đồng thời — chạy cùng lúc.</span></div>
  <div class="kv"><span class="k">floating promise</span><span class="v">promise trôi nổi — không ai await hay catch.</span></div>
  <div class="kv"><span class="k">top-level await</span><span class="v">await ở cấp ngoài cùng của module.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Hàm <code>async</code> trả về promise; <code>await</code> mở chúng ra, từ trên xuống.</li>
  <li><code>await</code> chỉ tạm dừng hàm của nó, không bao giờ dừng trang.</li>
  <li>Promise thất bại làm <code>await</code> ném lỗi: dùng <code>try</code>/<code>catch</code>/<code>finally</code>.</li>
  <li>"[object Promise]" nghĩa là thiếu <code>await</code>.</li>
  <li>Request độc lập: khởi động cùng lúc, <code>await Promise.all</code> (600 ms thành 200 ms).</li>
  <li>Đừng bao giờ <code>forEach(async …)</code>: dùng <code>for...of</code> hoặc <code>Promise.all(map(…))</code>.</li>
  <li><code>await</code> ở cấp ngoài cùng chạy được trong module.</li>
</ul>
${nguon('📗', 'MDN — async function', 'Tài liệu tham chiếu, có ví dụ mã tuần tự và song song', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function')}
${nguon('📘', 'javascript.info — Async/await', 'Chương ngắn kèm bài tập', 'https://javascript.info/async-await')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', title: 'Node.js 1.4 — mã bất đồng bộ ở máy chủ', sub: 'Cùng các công cụ đó với tệp, cơ sở dữ liệu và những lỗi có thể làm sập tiến trình', cta: 'Mở bài' })}
</div>
`,
};
