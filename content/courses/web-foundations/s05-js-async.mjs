/**
 * Web Foundations — Chương 5: JavaScript nâng cao (bất đồng bộ, event loop,
 * Promise, async/await, fetch, ES modules). Song ngữ EN/VI (.ml-en / .ml-vi,
 * số khối bằng nhau). ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${`
 * trong code escape thành \${. Câu "in ra gì" (thứ tự event loop) đã CHẠY THẬT.
 */

export default {
  title: 'Chapter 5 — Asynchronous JavaScript & modules|||Chương 5 — JavaScript bất đồng bộ & modules',
  description: 'Web đầy những việc phải chờ: tải dữ liệu từ server, đọc file, hẹn giờ. JavaScript xử lý chúng mà không "đứng hình" nhờ mô hình bất đồng bộ. Học event loop, Promise, async/await, gọi API bằng fetch, và cách chia code thành module với import/export — đúng những thứ Node.js và React dựa vào.',
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — Synchronous vs asynchronous: the event loop|||5.1 — Đồng bộ vs bất đồng bộ: event loop',
      slug: 'wf-5-1-event-loop',
      type: 'VIDEO',
      isFreePreview: true,
      video: { url: 'https://youtu.be/8aGhZQkoFbQ', durationSeconds: 0 },
      description: 'Vì sao JavaScript đơn luồng nhưng không bị treo khi chờ; call stack, hàng đợi tác vụ, và thứ tự chạy của setTimeout — nền tảng của mọi thứ bất đồng bộ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>JavaScript does one thing at a time — but never waits idly</h2>
<p class="lead">JavaScript is <strong>single-threaded</strong>: it runs one line at a time. So how does a page stay responsive while waiting two seconds for a server? The answer is the <strong>event loop</strong> — the mechanism that lets slow work happen "in the background" and run its follow-up code later.</p>

<h3>Synchronous code blocks; asynchronous code does not</h3>
<pre><code>// synchronous — runs top to bottom, each line waits for the previous
console.log("1");
console.log("2");   // 1, then 2

// a slow synchronous task would FREEZE the whole page until it finished</code></pre>
<p>If fetching data were synchronous, the entire browser tab would freeze — no scrolling, no clicks — until the server replied. Unacceptable. So slow operations are made <strong>asynchronous</strong>: you start them, and JavaScript keeps going.</p>

<h3>The classic surprise: setTimeout runs last</h3>
<pre><code>console.log("start");
setTimeout(() =&gt; console.log("timeout"), 0);   // even with 0 ms!
console.log("end");

// prints:  start  →  end  →  timeout</code></pre>
<p>Even a <code>0 ms</code> timer prints last. Why? Because the callback does not run inline — it is put in a queue and only runs <em>after</em> all the current synchronous code finishes.</p>

<h3>The mental model</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Call stack</span><span class="v">Where the current synchronous code runs, one frame at a time.</span></div>
  <div class="kv"><span class="k">Web APIs</span><span class="v">The browser handles the slow thing (timer, network) off to the side.</span></div>
  <div class="kv"><span class="k">Task queue</span><span class="v">When the slow thing is done, its callback waits here.</span></div>
  <div class="kv"><span class="k">Event loop</span><span class="v">Keeps checking: is the stack empty? Then take the next callback from the queue and run it.</span></div>
</div>

<h3>Why this matters</h3>
<p class="note-ct"><strong>This model is the "why" behind everything in this chapter.</strong> Promises and async/await are nicer syntax on top of exactly this machinery. When code runs in an order that surprises you, come back to one rule: synchronous code runs to completion first, then queued callbacks run. Watch the linked Philip Roberts talk — it makes the event loop unforgettable.</p>
<h3>Why JavaScript can wait without blocking</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">One thread runs your code</span><span class="lz-d">There is exactly one call stack. While a function is running, nothing else can run — not a click handler, not a timer, not the page repainting.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Slow work is handed off</span><span class="lz-d">A network request or a timer is given to the browser (or Node), which handles it outside your thread. Your code returns immediately.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Finished work queues a callback</span><span class="lz-d">When the response arrives, your callback goes into a queue. It does not interrupt anything — it waits its turn.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The loop runs it when the stack is empty</span><span class="lz-d">Only when your current code has finished completely. This is why the order of <code>console.log</code>s often surprises people.</span></div>
</div>
<pre><code>console.log('first');
setTimeout(() =&gt; console.log('third'), 0);
Promise.resolve().then(() =&gt; console.log('second'));
console.log('done sync');</code></pre>
<div class="out">first
done sync
second
third</div>
<div class="pitfall"><p><strong>Trap — <code>setTimeout(fn, 0)</code> does not mean "run now".</strong> It means "run after the current code finishes, and after every promise callback already queued". So the output above puts <code>third</code> last, even though its delay is zero and the promise had no delay at all: promise callbacks live in a higher-priority queue than timers. The practical consequence is that a long synchronous loop blocks <em>everything</em> — timers, clicks, even the spinner you just showed, because the browser cannot repaint until your function returns. If a page freezes while "loading", look for a loop, not a network call.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop" target="_blank" rel="noopener">MDN — The event loop, stack and queues</a></div>
<div class="link-card"><a href="http://latentflip.com/loupe/" target="_blank" rel="noopener">Loupe — watch the stack and queue run your code, live</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>JavaScript làm một việc mỗi lúc — nhưng không bao giờ chờ trong vô ích</h2>
<p class="lead">JavaScript <strong>đơn luồng (single-threaded)</strong>: nó chạy một dòng mỗi lúc. Vậy làm sao trang vẫn mượt khi chờ server hai giây? Câu trả lời là <strong>event loop</strong> — cơ chế cho việc chậm diễn ra "ở nền" và chạy đoạn code tiếp nối sau đó.</p>

<h3>Code đồng bộ thì chặn; code bất đồng bộ thì không</h3>
<pre><code>// đồng bộ — chạy từ trên xuống, mỗi dòng chờ dòng trước
console.log("1");
console.log("2");   // 1, rồi 2

// một tác vụ đồng bộ chậm sẽ ĐÓNG BĂNG cả trang tới khi nó xong</code></pre>
<p>Nếu tải dữ liệu là đồng bộ, cả tab trình duyệt sẽ đóng băng — không cuộn, không bấm — cho tới khi server trả lời. Không chấp nhận được. Nên các thao tác chậm được làm <strong>bất đồng bộ (asynchronous)</strong>: bạn khởi động chúng, và JavaScript đi tiếp.</p>

<h3>Bất ngờ kinh điển: setTimeout chạy cuối cùng</h3>
<pre><code>console.log("start");
setTimeout(() =&gt; console.log("timeout"), 0);   // dù là 0 mili-giây!
console.log("end");

// in ra:  start  →  end  →  timeout</code></pre>
<p>Ngay cả bộ hẹn <code>0 ms</code> cũng in ra cuối cùng. Vì sao? Vì callback không chạy tại chỗ — nó được đưa vào một hàng đợi và chỉ chạy <em>sau khi</em> toàn bộ code đồng bộ hiện tại kết thúc.</p>

<h3>Mô hình tư duy</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Call stack</span><span class="v">Nơi code đồng bộ hiện tại chạy, một khung mỗi lúc.</span></div>
  <div class="kv"><span class="k">Web APIs</span><span class="v">Trình duyệt lo việc chậm (hẹn giờ, mạng) ở một bên.</span></div>
  <div class="kv"><span class="k">Task queue</span><span class="v">Khi việc chậm xong, callback của nó chờ ở đây.</span></div>
  <div class="kv"><span class="k">Event loop</span><span class="v">Liên tục kiểm tra: stack rỗng chưa? Thì lấy callback kế trong hàng đợi ra chạy.</span></div>
</div>

<h3>Vì sao điều này quan trọng</h3>
<p class="note-ct"><strong>Mô hình này là chữ "vì sao" đằng sau mọi thứ trong chương.</strong> Promise và async/await chỉ là cú pháp đẹp hơn đặt trên đúng bộ máy này. Khi code chạy theo thứ tự làm bạn bất ngờ, hãy quay về một luật: code đồng bộ chạy xong hết trước, rồi các callback trong hàng đợi mới chạy. Xem bài nói của Philip Roberts đã liên kết — nó khiến event loop không thể quên.</p>
<h3>Vì sao JavaScript chờ được mà không chặn</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một luồng duy nhất chạy mã của bạn</span><span class="lz-d">Chỉ có đúng một ngăn xếp gọi. Trong lúc một hàm đang chạy, không gì khác chạy được — không handler bấm chuột, không bộ đếm giờ, không cả việc vẽ lại trang.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Việc chậm được giao đi nơi khác</span><span class="lz-d">Một request mạng hay một bộ đếm giờ được giao cho trình duyệt (hoặc Node) lo bên ngoài luồng của bạn. Mã của bạn trả về ngay lập tức.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Việc xong thì xếp một callback vào hàng</span><span class="lz-d">Khi phản hồi về, callback của bạn vào một hàng đợi. Nó không ngắt bất cứ thứ gì — nó chờ tới lượt.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Vòng lặp chạy nó khi ngăn xếp rỗng</span><span class="lz-d">Chỉ khi mã hiện tại của bạn đã xong hoàn toàn. Đó là lý do thứ tự các <code>console.log</code> hay làm người ta ngạc nhiên.</span></div>
</div>
<pre><code>console.log('first');
setTimeout(() =&gt; console.log('third'), 0);
Promise.resolve().then(() =&gt; console.log('second'));
console.log('done sync');</code></pre>
<div class="out">first
done sync
second
third</div>
<div class="pitfall"><p><strong>Bẫy — <code>setTimeout(fn, 0)</code> KHÔNG có nghĩa là "chạy ngay".</strong> Nó nghĩa là "chạy sau khi mã hiện tại xong, và sau mọi callback promise đã xếp hàng". Nên đầu ra ở trên đặt <code>third</code> xuống cuối, dù độ trễ của nó bằng không và promise thì chẳng có độ trễ nào cả: callback của promise nằm ở một hàng đợi ưu tiên cao hơn bộ đếm giờ. Hệ quả thực tế là một vòng lặp đồng bộ dài sẽ chặn <em>mọi thứ</em> — bộ đếm giờ, cú bấm, kể cả cái vòng quay bạn vừa hiện ra, vì trình duyệt không vẽ lại được cho tới khi hàm của bạn trả về. Nếu một trang đơ trong lúc "đang tải", hãy tìm một vòng lặp, đừng tìm một lời gọi mạng.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop" target="_blank" rel="noopener">MDN — Vòng lặp sự kiện, ngăn xếp và các hàng đợi</a></div>
<div class="link-card"><a href="http://latentflip.com/loupe/" target="_blank" rel="noopener">Loupe — xem ngăn xếp và hàng đợi chạy mã của bạn, trực tiếp</a></div>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Promises: a value that arrives later|||5.2 — Promise: một giá trị đến sau',
      slug: 'wf-5-2-promises',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/DHvZLI7Db8E', durationSeconds: 0 },
      description: 'Ba trạng thái của Promise, .then/.catch/.finally, và chuỗi Promise — cách JavaScript biểu diễn một kết quả chưa sẵn sàng mà không rơi vào "callback hell".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>A Promise is an IOU for a future value</h2>
<p class="lead">Before Promises, async code nested callbacks inside callbacks until it became unreadable ("callback hell"). A <strong>Promise</strong> is an object representing a result that is not ready yet — it will either succeed with a value or fail with an error, and you attach code to handle each case.</p>

<h3>The three states</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pending</span><span class="v">The work is still going; no result yet.</span></div>
  <div class="kv"><span class="k">Fulfilled</span><span class="v">It succeeded — a value is available (via .then).</span></div>
  <div class="kv"><span class="k">Rejected</span><span class="v">It failed — an error is available (via .catch).</span></div>
</div>
<p>A Promise settles <strong>once</strong>: from pending to either fulfilled or rejected, and then never changes again.</p>

<h3>Consuming a Promise</h3>
<pre><code>somePromise
  .then(result =&gt; {
    console.log("got:", result);   // runs if fulfilled
  })
  .catch(error =&gt; {
    console.log("failed:", error); // runs if rejected
  })
  .finally(() =&gt; {
    console.log("done either way"); // always runs
  });</code></pre>

<h3>Chaining — flatten the pyramid</h3>
<p>Each <code>.then</code> returns a new Promise, so you can line steps up vertically instead of nesting them. If any step rejects, control jumps straight to the nearest <code>.catch</code>:</p>
<pre><code>fetchUser(1)
  .then(user =&gt; fetchPosts(user.id))   // return another Promise
  .then(posts =&gt; console.log(posts.length))
  .catch(err =&gt; console.log("something failed:", err));</code></pre>

<h3>Where Promises come from</h3>
<p>You rarely build them by hand — most async APIs already return one. <code>fetch()</code> (next lesson) returns a Promise; so do many Node.js and browser functions. You mostly <em>consume</em> Promises. This is what you will meet:</p>
<pre><code>// creating one (for illustration)
const wait = ms =&gt; new Promise(resolve =&gt; setTimeout(resolve, ms));
wait(1000).then(() =&gt; console.log("one second later"));</code></pre>
<p class="note-ct"><strong>Promises are the foundation, async/await is the comfort.</strong> The next lesson shows a cleaner syntax for exactly these Promises — but it is still Promises underneath, so understanding <code>.then</code>/<code>.catch</code> here makes async/await obvious rather than magical.</p>
<h3>The three states of a promise</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Pending</span><span class="lz-t">The work is in flight</span><span class="lz-d">The promise object exists immediately; the value does not exist yet. Printing it here shows <code>Promise { &lt;pending&gt; }</code>, which is not a bug.</span></div>
<div class="lz-layer"><span class="lz-k">Fulfilled</span><span class="lz-t">A value arrived</span><span class="lz-d">Whatever you passed to <code>resolve</code>, or returned from an <code>async</code> function. <code>.then(cb)</code> runs <code>cb</code> with it.</span></div>
<div class="lz-layer"><span class="lz-k">Rejected</span><span class="lz-t">Something failed</span><span class="lz-d">An error was thrown or <code>reject</code> was called. <code>.catch(cb)</code> runs; without one, you get an unhandled rejection warning.</span></div>
<div class="lz-layer"><span class="lz-k">Settled once, forever</span><span class="lz-t">No going back</span><span class="lz-d">A promise moves out of pending exactly once. Calling <code>resolve</code> twice does nothing the second time — useful to know when wrapping callback APIs.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — forgetting to return the promise inside a <code>.then</code>, which breaks the chain silently.</strong> <code>fetch(a).then(r =&gt; { fetch(b) }).then(() =&gt; console.log('both done'))</code> prints "both done" immediately, before the second request has finished, because the first <code>.then</code> returned <code>undefined</code> instead of the inner promise. Nothing errors; the ordering is just wrong, and an error in that inner request never reaches your <code>.catch</code> either — it becomes an unhandled rejection. Return every promise you create inside a chain (<code>r =&gt; fetch(b)</code>, no braces), or use <code>await</code>, where the language does the returning for you.</p></div>
<div class="link-card"><a href="https://javascript.info/promise-basics" target="_blank" rel="noopener">JavaScript.info — Promises from first principles</a></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises" target="_blank" rel="noopener">MDN — Using promises, including chaining mistakes</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Promise là một "giấy hẹn" cho một giá trị tương lai</h2>
<p class="lead">Trước Promise, code bất đồng bộ lồng callback trong callback tới mức không đọc nổi ("callback hell"). Một <strong>Promise</strong> là một đối tượng biểu diễn một kết quả chưa sẵn sàng — nó sẽ hoặc thành công với một giá trị, hoặc thất bại với một lỗi, và bạn gắn code để xử lý từng trường hợp.</p>

<h3>Ba trạng thái</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pending (chờ)</span><span class="v">Việc vẫn đang chạy; chưa có kết quả.</span></div>
  <div class="kv"><span class="k">Fulfilled (hoàn thành)</span><span class="v">Thành công — một giá trị sẵn sàng (qua .then).</span></div>
  <div class="kv"><span class="k">Rejected (từ chối)</span><span class="v">Thất bại — một lỗi sẵn sàng (qua .catch).</span></div>
</div>
<p>Một Promise "chốt" <strong>một lần</strong>: từ pending sang fulfilled hoặc rejected, rồi không đổi nữa.</p>

<h3>Tiêu thụ một Promise</h3>
<pre><code>somePromise
  .then(result =&gt; {
    console.log("nhận:", result);  // chạy nếu fulfilled
  })
  .catch(error =&gt; {
    console.log("hỏng:", error);   // chạy nếu rejected
  })
  .finally(() =&gt; {
    console.log("xong dù thế nào"); // luôn chạy
  });</code></pre>

<h3>Nối chuỗi — làm phẳng kim tự tháp</h3>
<p>Mỗi <code>.then</code> trả về một Promise mới, nên bạn xếp các bước thẳng đứng thay vì lồng nhau. Nếu bất kỳ bước nào rejected, quyền điều khiển nhảy thẳng tới <code>.catch</code> gần nhất:</p>
<pre><code>fetchUser(1)
  .then(user =&gt; fetchPosts(user.id))   // trả về một Promise khác
  .then(posts =&gt; console.log(posts.length))
  .catch(err =&gt; console.log("có gì đó hỏng:", err));</code></pre>

<h3>Promise đến từ đâu</h3>
<p>Bạn hiếm khi tự tạo tay — phần lớn API bất đồng bộ đã trả về sẵn một cái. <code>fetch()</code> (bài kế) trả về một Promise; nhiều hàm của Node.js và trình duyệt cũng vậy. Bạn chủ yếu <em>tiêu thụ</em> Promise. Đây là thứ bạn sẽ gặp:</p>
<pre><code>// tạo một cái (để minh hoạ)
const wait = ms =&gt; new Promise(resolve =&gt; setTimeout(resolve, ms));
wait(1000).then(() =&gt; console.log("một giây sau"));</code></pre>
<p class="note-ct"><strong>Promise là nền tảng, async/await là sự dễ chịu.</strong> Bài kế cho một cú pháp gọn hơn cho đúng những Promise này — nhưng bên dưới vẫn là Promise, nên hiểu <code>.then</code>/<code>.catch</code> ở đây khiến async/await trở nên hiển nhiên thay vì huyền bí.</p>
<h3>Ba trạng thái của một promise</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Pending (đang chờ)</span><span class="lz-t">Việc đang trên đường</span><span class="lz-d">Object promise tồn tại ngay lập tức; còn giá trị thì chưa. In nó ra lúc này thấy <code>Promise { &lt;pending&gt; }</code>, và đó không phải lỗi.</span></div>
<div class="lz-layer"><span class="lz-k">Fulfilled (đã xong)</span><span class="lz-t">Một giá trị đã về</span><span class="lz-d">Là thứ bạn truyền vào <code>resolve</code>, hoặc trả về từ một hàm <code>async</code>. <code>.then(cb)</code> chạy <code>cb</code> với nó.</span></div>
<div class="lz-layer"><span class="lz-k">Rejected (đã hỏng)</span><span class="lz-t">Có gì đó thất bại</span><span class="lz-d">Một lỗi đã bị ném ra hoặc <code>reject</code> đã được gọi. <code>.catch(cb)</code> chạy; không có nó thì bạn nhận cảnh báo unhandled rejection.</span></div>
<div class="lz-layer"><span class="lz-k">Chốt một lần, vĩnh viễn</span><span class="lz-t">Không quay lại được</span><span class="lz-d">Một promise rời khỏi trạng thái chờ đúng một lần. Gọi <code>resolve</code> lần thứ hai chẳng làm gì — biết điều này có ích khi bọc các API kiểu callback.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — quên return cái promise bên trong một <code>.then</code>, và chuỗi đứt một cách lặng lẽ.</strong> <code>fetch(a).then(r =&gt; { fetch(b) }).then(() =&gt; console.log('xong cả hai'))</code> in ra "xong cả hai" ngay lập tức, trước khi request thứ hai kịp xong, vì cái <code>.then</code> đầu đã trả về <code>undefined</code> thay vì cái promise bên trong. Chẳng lỗi nào cả; chỉ là thứ tự sai, và một lỗi trong request bên trong đó cũng chẳng bao giờ tới được <code>.catch</code> của bạn — nó thành unhandled rejection. Hãy return mọi promise bạn tạo ra trong một chuỗi (<code>r =&gt; fetch(b)</code>, không ngoặc nhọn), hoặc dùng <code>await</code>, nơi ngôn ngữ tự làm việc trả về giùm bạn.</p></div>
<div class="link-card"><a href="https://javascript.info/promise-basics" target="_blank" rel="noopener">JavaScript.info — Promise từ nguyên lý đầu tiên</a></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises" target="_blank" rel="noopener">MDN — Dùng promise, gồm cả các lỗi nối chuỗi</a></div>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — async / await: async code that reads like sync|||5.3 — async / await: code bất đồng bộ đọc như đồng bộ',
      slug: 'wf-5-3-async-await',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/V_Kr9OSfDeU', durationSeconds: 0 },
      description: 'Từ khoá async/await, try/catch cho lỗi, và khác biệt giữa chờ tuần tự và chạy song song bằng Promise.all — cách viết code bất đồng bộ hiện đại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>await pauses inside a function until a Promise settles</h2>
<p class="lead"><strong>async/await</strong> is syntactic sugar over Promises that lets you write asynchronous code in a straight, top-to-bottom style — no <code>.then</code> chains. It is the style you will use almost all the time in Node.js and React.</p>

<h3>The same task, two ways</h3>
<pre><code>// with .then
function load() {
  return fetchUser(1).then(user =&gt; console.log(user.name));
}

// with async/await — reads like ordinary code
async function load() {
  const user = await fetchUser(1);   // pause here until it resolves
  console.log(user.name);
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">async</span><span class="v">Put before a function. It makes the function return a Promise and allows await inside.</span></div>
  <div class="kv"><span class="k">await</span><span class="v">Pauses the function until the Promise settles, then gives you its value. Only usable inside an async function.</span></div>
</div>

<h3>Handling errors with try/catch</h3>
<p>Instead of <code>.catch</code>, you wrap awaited calls in the ordinary <code>try/catch</code> you already know:</p>
<pre><code>async function load() {
  try {
    const user = await fetchUser(1);
    const posts = await fetchPosts(user.id);
    console.log(posts.length);
  } catch (err) {
    console.log("failed:", err);   // any rejection above lands here
  }
}</code></pre>

<h3>Sequential vs parallel — a real performance trap</h3>
<pre><code>// SEQUENTIAL: waits for A to finish before starting B (slow if independent)
const a = await fetchA();
const b = await fetchB();

// PARALLEL: start both, then wait for both (faster)
const [a, b] = await Promise.all([fetchA(), fetchB()]);</code></pre>
<p class="pitfall"><strong>Do not await in a loop when the calls are independent.</strong> Awaiting one-by-one turns three 1-second calls into 3 seconds. If they do not depend on each other, fire them together with <code>Promise.all</code> and wait once — 1 second total. This is one of the most common real-world performance mistakes.</p>

<p class="note-ct"><strong>Rule of thumb:</strong> use <code>await</code> when step B needs step A's result; use <code>Promise.all</code> when steps are independent. Getting this right is a genuine, measurable difference in how fast your apps feel.</p>
<h3>await, and what it does not change</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">async makes a function return a promise</span><span class="lz-d">Always, even if you return a plain number. Callers still have to <code>await</code> it or <code>.then</code> it.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">await pauses this function only</span><span class="lz-d">The rest of the program keeps running — clicks are handled, timers fire. It is not a blocking sleep.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">try/catch works again</span><span class="lz-d">A rejected promise becomes a thrown error, so ordinary <code>try { } catch { }</code> handles it. This is the main reason to prefer <code>await</code> over <code>.then</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Sequential unless you say otherwise</span><span class="lz-d">Two <code>await</code>s in a row wait one after the other. Independent work belongs in <code>Promise.all</code>.</span></div>
</div>
<pre><code>// Sequential: 2 seconds total
const a = await slow();   // 1s
const b = await slow();   // 1s

// Parallel: 1 second total
const [a, b] = await Promise.all([slow(), slow()]);</code></pre>
<div class="pitfall"><p><strong>Trap — <code>await</code> inside <code>forEach</code> does nothing at all.</strong> <code>items.forEach(async item =&gt; { await save(item) })</code> looks like it saves each item in turn; in fact <code>forEach</code> ignores the promise each callback returns, so it fires all of them at once and moves on immediately. The line after the loop runs before a single save has finished, and any error inside becomes an unhandled rejection. Use <code>for (const item of items) { await save(item) }</code> when order matters, or <code>await Promise.all(items.map(save))</code> when it does not. The <code>for…of</code> is the one that respects <code>await</code>.</p></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>await tạm dừng bên trong một hàm tới khi một Promise chốt</h2>
<p class="lead"><strong>async/await</strong> là "đường cú pháp" đặt trên Promise, cho bạn viết code bất đồng bộ theo lối thẳng, trên-xuống — không chuỗi <code>.then</code>. Đây là lối bạn sẽ dùng gần như luôn luôn trong Node.js và React.</p>

<h3>Cùng một việc, hai cách</h3>
<pre><code>// với .then
function load() {
  return fetchUser(1).then(user =&gt; console.log(user.name));
}

// với async/await — đọc như code thường
async function load() {
  const user = await fetchUser(1);   // dừng ở đây tới khi nó xong
  console.log(user.name);
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">async</span><span class="v">Đặt trước một hàm. Nó khiến hàm trả về một Promise và cho phép await bên trong.</span></div>
  <div class="kv"><span class="k">await</span><span class="v">Dừng hàm tới khi Promise chốt, rồi trao cho bạn giá trị của nó. Chỉ dùng được trong một hàm async.</span></div>
</div>

<h3>Xử lý lỗi bằng try/catch</h3>
<p>Thay cho <code>.catch</code>, bạn bọc các lời gọi có await trong <code>try/catch</code> quen thuộc:</p>
<pre><code>async function load() {
  try {
    const user = await fetchUser(1);
    const posts = await fetchPosts(user.id);
    console.log(posts.length);
  } catch (err) {
    console.log("hỏng:", err);   // bất kỳ rejection nào ở trên rơi vào đây
  }
}</code></pre>

<h3>Tuần tự vs song song — một cái bẫy hiệu năng thật</h3>
<pre><code>// TUẦN TỰ: chờ A xong mới bắt đầu B (chậm nếu chúng độc lập)
const a = await fetchA();
const b = await fetchB();

// SONG SONG: khởi động cả hai, rồi chờ cả hai (nhanh hơn)
const [a, b] = await Promise.all([fetchA(), fetchB()]);</code></pre>
<p class="pitfall"><strong>Đừng await trong vòng lặp khi các lời gọi độc lập.</strong> Await từng cái một biến ba lời gọi 1 giây thành 3 giây. Nếu chúng không phụ thuộc nhau, bắn chúng cùng lúc bằng <code>Promise.all</code> và chờ một lần — tổng 1 giây. Đây là một trong những lỗi hiệu năng phổ biến nhất thực tế.</p>

<p class="note-ct"><strong>Quy tắc bỏ túi:</strong> dùng <code>await</code> khi bước B cần kết quả bước A; dùng <code>Promise.all</code> khi các bước độc lập. Làm đúng điều này là một khác biệt thật, đo được, về việc app của bạn cảm giác nhanh thế nào.</p>
<h3>await, và những gì nó KHÔNG đổi</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">async làm một hàm trả về promise</span><span class="lz-d">Luôn luôn, kể cả khi bạn trả về một con số trơn. Chỗ gọi vẫn phải <code>await</code> nó hoặc <code>.then</code> nó.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">await chỉ tạm dừng CHÍNH hàm này</span><span class="lz-d">Phần còn lại của chương trình vẫn chạy — cú bấm vẫn được xử, bộ đếm giờ vẫn nổ. Nó không phải một lệnh ngủ gây chặn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">try/catch lại dùng được</span><span class="lz-d">Một promise bị từ chối trở thành một lỗi được ném ra, nên <code>try { } catch { }</code> thông thường xử được. Đây là lý do chính để chọn <code>await</code> thay vì <code>.then</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tuần tự, trừ khi bạn nói khác</span><span class="lz-d">Hai <code>await</code> liền nhau sẽ chờ cái này rồi tới cái kia. Việc độc lập với nhau thì thuộc về <code>Promise.all</code>.</span></div>
</div>
<pre><code>// Tuần tự: tổng 2 giây
const a = await slow();   // 1s
const b = await slow();   // 1s

// Song song: tổng 1 giây
const [a, b] = await Promise.all([slow(), slow()]);</code></pre>
<div class="pitfall"><p><strong>Bẫy — <code>await</code> bên trong <code>forEach</code> chẳng làm gì cả.</strong> <code>items.forEach(async item =&gt; { await save(item) })</code> nhìn như đang lưu từng mục lần lượt; thật ra <code>forEach</code> lờ đi cái promise mà mỗi callback trả về, nên nó bắn hết cùng một lúc rồi đi tiếp ngay. Dòng sau vòng lặp chạy trước khi có lấy một lần lưu nào xong, và mọi lỗi bên trong đều thành unhandled rejection. Hãy dùng <code>for (const item of items) { await save(item) }</code> khi thứ tự có ý nghĩa, hoặc <code>await Promise.all(items.map(save))</code> khi không. Chính <code>for…of</code> mới là thứ tôn trọng <code>await</code>.</p></div>
</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — fetch: talking to APIs|||5.4 — fetch: nói chuyện với API',
      slug: 'wf-5-4-fetch-apis',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/cuEtnrL9-H0', durationSeconds: 0 },
      description: 'fetch trả về Promise, await response.json(), kiểm tra response.ok, và gửi dữ liệu bằng POST — cách trình duyệt lấy và gửi dữ liệu tới một backend.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>fetch is how the browser asks a server for data</h2>
<p class="lead">This lesson is where async pays off. <strong>fetch()</strong> makes an HTTP request from JavaScript and returns a Promise. It is the exact tool your frontend will use to call the Node.js backend you build later — the whole point of learning async.</p>

<h3>A GET request, with async/await</h3>
<pre><code>async function loadUser() {
  const response = await fetch("https://api.example.com/users/1");
  const user = await response.json();   // parse the JSON body (also a Promise)
  console.log(user.name);
}</code></pre>
<p>Two awaits: one for the response to arrive, one to read and parse its body. The body arrives as text and <code>.json()</code> turns it into a real JavaScript object.</p>

<h3>Always check the status</h3>
<p class="pitfall"><strong>fetch does NOT reject on 404 or 500.</strong> A Promise from fetch only rejects on a network failure — a <code>404 Not Found</code> or <code>500 Server Error</code> still fulfils. You must check <code>response.ok</code> yourself:</p>
<pre><code>async function loadUser() {
  try {
    const response = await fetch("https://api.example.com/users/1");
    if (!response.ok) {
      throw new Error("HTTP " + response.status);   // 404, 500, ...
    }
    const user = await response.json();
    return user;
  } catch (err) {
    console.log("could not load user:", err.message);
  }
}</code></pre>

<h3>Sending data with POST</h3>
<pre><code>await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Lan", age: 25 }),
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">method</span><span class="v">GET to read (default), POST to create, PUT/PATCH to update, DELETE to remove.</span></div>
  <div class="kv"><span class="k">headers</span><span class="v">Metadata about the request — here, "I am sending JSON".</span></div>
  <div class="kv"><span class="k">body</span><span class="v">The data, stringified. JSON.stringify turns an object into a JSON text string.</span></div>
</div>
<p class="note-ct"><strong>You have just met the client half of an API call.</strong> Chapter 6 explains the other half — HTTP methods, status codes and REST — from the server's point of view. Together they are the full request/response cycle that every web app runs on.</p>

<h3>A fetch call, checked properly</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">await fetch(url)</span><span class="lz-d">Resolves as soon as the headers arrive — the body has not been read yet. This is why there is a second <code>await</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Check res.ok</span><span class="lz-d">True for status 200–299. Skipping this is the single most common fetch bug; see the trap below.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">await res.json()</span><span class="lz-d">Reads and parses the body. It throws if the body is not valid JSON — an HTML error page, for instance.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Wrap it in try/catch</span><span class="lz-d">Only network-level failures reject: no connection, DNS failure, CORS block. Those are different from a 500, and both need handling.</span></div>
</div>
<pre><code>const res = await fetch('/api/v1/notes');
if (!res.ok) throw new Error(&#96;HTTP \${res.status}&#96;);
const data = await res.json();</code></pre>
<div class="pitfall"><p><strong>Trap — <code>fetch</code> does not reject on 404 or 500.</strong> An HTTP error is still a successful round trip as far as <code>fetch</code> is concerned, so the promise fulfils and your <code>catch</code> never runs. What happens next depends on the server: if it returned an HTML error page, <code>res.json()</code> throws "Unexpected token &lt;" — an error about JSON parsing that tells you nothing about the 500 that caused it. If it returned JSON, you happily render an error object as if it were data. Always check <code>res.ok</code> before reading the body; it is one line, and it turns a mystifying parse error into the real status code.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" target="_blank" rel="noopener">MDN — Using the Fetch API</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>fetch là cách trình duyệt hỏi server để lấy dữ liệu</h2>
<p class="lead">Bài này là nơi bất đồng bộ đơm hoa kết trái. <strong>fetch()</strong> tạo một yêu cầu HTTP từ JavaScript và trả về một Promise. Đây đúng là công cụ frontend của bạn sẽ dùng để gọi backend Node.js bạn dựng về sau — chính là lý do học bất đồng bộ.</p>

<h3>Một yêu cầu GET, với async/await</h3>
<pre><code>async function loadUser() {
  const response = await fetch("https://api.example.com/users/1");
  const user = await response.json();   // phân tích phần thân JSON (cũng là Promise)
  console.log(user.name);
}</code></pre>
<p>Hai lần await: một chờ phản hồi tới, một để đọc và phân tích phần thân. Thân đến dưới dạng chữ và <code>.json()</code> biến nó thành một đối tượng JavaScript thật.</p>

<h3>Luôn kiểm tra trạng thái</h3>
<p class="pitfall"><strong>fetch KHÔNG reject khi 404 hay 500.</strong> Promise từ fetch chỉ reject khi lỗi mạng — một <code>404 Not Found</code> hay <code>500 Server Error</code> vẫn fulfilled. Bạn phải tự kiểm <code>response.ok</code>:</p>
<pre><code>async function loadUser() {
  try {
    const response = await fetch("https://api.example.com/users/1");
    if (!response.ok) {
      throw new Error("HTTP " + response.status);   // 404, 500, ...
    }
    const user = await response.json();
    return user;
  } catch (err) {
    console.log("không tải được user:", err.message);
  }
}</code></pre>

<h3>Gửi dữ liệu bằng POST</h3>
<pre><code>await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Lan", age: 25 }),
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">method</span><span class="v">GET để đọc (mặc định), POST để tạo, PUT/PATCH để cập nhật, DELETE để xoá.</span></div>
  <div class="kv"><span class="k">headers</span><span class="v">Siêu dữ liệu về yêu cầu — ở đây, "tôi đang gửi JSON".</span></div>
  <div class="kv"><span class="k">body</span><span class="v">Dữ liệu, đã stringify. JSON.stringify biến một đối tượng thành một chuỗi JSON.</span></div>
</div>
<p class="note-ct"><strong>Bạn vừa gặp nửa phía client của một lời gọi API.</strong> Chương 6 giải thích nửa còn lại — HTTP method, mã trạng thái và REST — từ góc nhìn server. Cùng nhau, chúng là trọn chu trình yêu cầu/phản hồi mà mọi ứng dụng web đứng trên.</p>

<h3>Một lời gọi fetch, kiểm cho đúng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">await fetch(url)</span><span class="lz-d">Xong ngay khi các header về — phần thân thì chưa hề được đọc. Đó là lý do có một <code>await</code> thứ hai.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kiểm res.ok</span><span class="lz-d">Đúng với mã trạng thái 200–299. Bỏ qua bước này là lỗi fetch phổ biến nhất; xem cái bẫy bên dưới.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">await res.json()</span><span class="lz-d">Đọc và phân tích phần thân. Nó ném lỗi nếu thân không phải JSON hợp lệ — chẳng hạn một trang lỗi HTML.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Bọc nó trong try/catch</span><span class="lz-d">Chỉ những sự cố ở mức mạng mới bị từ chối: mất kết nối, hỏng DNS, bị CORS chặn. Chúng khác với một cú 500, và cả hai đều cần xử lý.</span></div>
</div>
<pre><code>const res = await fetch('/api/v1/notes');
if (!res.ok) throw new Error(&#96;HTTP \${res.status}&#96;);
const data = await res.json();</code></pre>
<div class="pitfall"><p><strong>Bẫy — <code>fetch</code> KHÔNG từ chối khi gặp 404 hay 500.</strong> Với <code>fetch</code> thì một lỗi HTTP vẫn là một lượt đi về thành công, nên promise hoàn tất và cái <code>catch</code> của bạn chẳng bao giờ chạy. Chuyện tiếp theo tuỳ máy chủ: nếu nó trả về một trang lỗi HTML thì <code>res.json()</code> ném ra "Unexpected token &lt;" — một lỗi về phân tích JSON chẳng nói gì với bạn về cú 500 đã gây ra nó. Nếu nó trả về JSON thì bạn vui vẻ vẽ một object lỗi ra như thể đó là dữ liệu. Hãy luôn kiểm <code>res.ok</code> trước khi đọc thân; chỉ một dòng, và nó biến một lỗi phân tích khó hiểu thành đúng cái mã trạng thái thật.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" target="_blank" rel="noopener">MDN — Dùng Fetch API</a></div>
</div>
`,
    },

    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — ES modules: splitting code into files|||5.5 — ES modules: chia code thành nhiều file',
      slug: 'wf-5-5-es-modules',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/qgRUr-YUk1Q', durationSeconds: 0 },
      description: 'export và import, xuất có tên vs mặc định, và vì sao chia nhỏ code thành module là nền của mọi dự án Node.js và React thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Real projects are many small files that import each other</h2>
<p class="lead">You cannot put a whole app in one file. <strong>ES modules</strong> let each file <code>export</code> the pieces it wants to share and <code>import</code> what it needs from others. Every Node.js and React project is organised this way — it is how code stays navigable as it grows.</p>

<h3>Named exports — share several things</h3>
<pre><code>// file: math.js
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }
export const PI = 3.14159;</code></pre>
<pre><code>// file: app.js
import { add, PI } from "./math.js";   // pick exactly what you need
console.log(add(2, 3));                // 5
console.log(PI);                       // 3.14159</code></pre>
<p>Note the relative path <code>./math.js</code> — the very same relative-path idea from Lesson 1.1, now connecting your own files.</p>

<h3>Default export — one main thing per file</h3>
<pre><code>// file: User.js
export default function User(name) {
  return { name };
}</code></pre>
<pre><code>// file: app.js
import User from "./User.js";   // no braces; you choose the name
const u = User("Lan");</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Named export</span><span class="v">export function foo — import with braces: import { foo }. A file can have many.</span></div>
  <div class="kv"><span class="k">Default export</span><span class="v">export default — import without braces, any name. One per file.</span></div>
</div>

<h3>Modules and npm connect</h3>
<p>When you <code>npm install</code> a library (Lesson 1.5) and then <code>import</code> it, you are using this same system — just importing from a package name instead of a relative path:</p>
<pre><code>import express from "express";      // a library installed via npm
import { useState } from "react";  // a named export from React</code></pre>
<p class="note-ct"><strong>This is the last foundational JavaScript idea before the specialised chapters.</strong> Node.js code is modules importing modules; a React component imports React and other components. You now have the whole JavaScript vocabulary those courses assume — variables, functions, arrays, async, and modules. Chapters 6–8 turn to the server side: HTTP, auth, and data.</p>

<h3>import and export, in one picture</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">export function f()</span><span class="lz-t">Named export</span><span class="lz-d">Imported as <code>import { f } from './x.js'</code>. The name must match, which is what makes rename-across-files work in the editor.</span></div>
<div class="lz-node"><span class="lz-k">export default x</span><span class="lz-t">One per file</span><span class="lz-d">Imported with any name you like. Convenient, and slightly worse for tooling — two files can import the same thing under different names.</span></div>
<div class="lz-node"><span class="lz-k">The path is a real path</span><span class="lz-t">./ or ../, with the extension</span><span class="lz-d">In the browser, <code>./utils.js</code> — not <code>./utils</code>. Bundlers let you omit it, which is why moving code to the browser sometimes breaks the imports.</span></div>
<div class="lz-node"><span class="lz-k">Modules run once</span><span class="lz-t">And are cached</span><span class="lz-d">Importing the same file from five places executes it once. Top-level code in a module is effectively a one-time setup step.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — opening an HTML file that uses modules with a <code>file://</code> URL.</strong> Double-clicking <code>index.html</code> opens it from disk, and ES modules are blocked there by the browser's origin rules: you get "CORS policy: Cross origin requests are only supported for protocol schemes: http…", an error that mentions CORS even though there is no server involved. Nothing is wrong with your code, only with how the page was opened. Serve the folder over HTTP instead — <code>npx serve</code> or VS Code's Live Server extension — and the same files work. This is also the first taste of a rule you will meet again: the browser's security model depends on the origin, and <code>file://</code> has none.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" target="_blank" rel="noopener">MDN — JavaScript modules</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Dự án thật là nhiều file nhỏ import lẫn nhau</h2>
<p class="lead">Bạn không thể nhét cả app vào một file. <strong>ES modules</strong> cho mỗi file <code>export</code> những mảnh nó muốn chia sẻ và <code>import</code> thứ nó cần từ file khác. Mọi dự án Node.js và React đều tổ chức thế này — đó là cách code vẫn dò được khi lớn lên.</p>

<h3>Xuất có tên (named export) — chia sẻ nhiều thứ</h3>
<pre><code>// file: math.js
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }
export const PI = 3.14159;</code></pre>
<pre><code>// file: app.js
import { add, PI } from "./math.js";   // lấy đúng thứ bạn cần
console.log(add(2, 3));                // 5
console.log(PI);                       // 3.14159</code></pre>
<p>Để ý đường dẫn tương đối <code>./math.js</code> — đúng ý tưởng đường dẫn tương đối ở Bài 1.1, giờ nối các file của chính bạn.</p>

<h3>Xuất mặc định (default export) — một thứ chính mỗi file</h3>
<pre><code>// file: User.js
export default function User(name) {
  return { name };
}</code></pre>
<pre><code>// file: app.js
import User from "./User.js";   // không ngoặc; bạn tự chọn tên
const u = User("Lan");</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Named export</span><span class="v">export function foo — import có ngoặc: import { foo }. Một file có thể có nhiều.</span></div>
  <div class="kv"><span class="k">Default export</span><span class="v">export default — import không ngoặc, tên tuỳ ý. Mỗi file một cái.</span></div>
</div>

<h3>Module và npm gặp nhau</h3>
<p>Khi bạn <code>npm install</code> một thư viện (Bài 1.5) rồi <code>import</code> nó, bạn đang dùng đúng hệ này — chỉ là import từ một tên gói thay vì một đường dẫn tương đối:</p>
<pre><code>import express from "express";      // một thư viện cài qua npm
import { useState } from "react";  // một named export từ React</code></pre>
<p class="note-ct"><strong>Đây là ý tưởng JavaScript nền tảng cuối cùng trước các chương chuyên sâu.</strong> Code Node.js là các module import module; một component React import React và các component khác. Giờ bạn đã có trọn vốn từ JavaScript mà các khoá đó mặc định — biến, hàm, mảng, bất đồng bộ, và module. Chương 6–8 chuyển sang phía server: HTTP, xác thực, và dữ liệu.</p>

<h3>import và export, trong một bức tranh</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">export function f()</span><span class="lz-t">Export có tên</span><span class="lz-d">Import bằng <code>import { f } from './x.js'</code>. Tên phải khớp, và chính điều đó làm tính năng đổi-tên-khắp-file trong trình soạn thảo chạy được.</span></div>
<div class="lz-node"><span class="lz-k">export default x</span><span class="lz-t">Mỗi file một cái</span><span class="lz-d">Import với cái tên nào tuỳ bạn. Tiện, và hơi tệ hơn cho công cụ — hai file có thể import cùng một thứ dưới hai cái tên khác nhau.</span></div>
<div class="lz-node"><span class="lz-k">Đường dẫn là đường dẫn thật</span><span class="lz-t">./ hoặc ../, kèm phần mở rộng</span><span class="lz-d">Trong trình duyệt là <code>./utils.js</code> — không phải <code>./utils</code>. Bundler cho phép bỏ nó, và đó là lý do đem mã sang trình duyệt đôi khi làm hỏng các import.</span></div>
<div class="lz-node"><span class="lz-k">Module chỉ chạy một lần</span><span class="lz-t">Và được nhớ đệm</span><span class="lz-d">Import cùng một file từ năm chỗ thì nó chỉ thực thi một lần. Mã ở cấp cao nhất của một module thực chất là một bước thiết lập chạy đúng một lần.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — mở một file HTML có dùng module bằng URL <code>file://</code>.</strong> Bấm đúp vào <code>index.html</code> là mở nó từ đĩa, và ES module bị chặn ở đó bởi luật origin của trình duyệt: bạn nhận "CORS policy: Cross origin requests are only supported for protocol schemes: http…", một lỗi nhắc tới CORS dù chẳng có máy chủ nào dính vào. Mã của bạn không sai gì cả, chỉ có cách mở trang là sai. Hãy phục vụ thư mục đó qua HTTP — <code>npx serve</code> hoặc extension Live Server của VS Code — là đúng những file ấy chạy được. Đây cũng là lần đầu bạn nếm một luật sẽ gặp lại: mô hình an toàn của trình duyệt dựa trên origin, mà <code>file://</code> thì chẳng có origin nào.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" target="_blank" rel="noopener">MDN — Module JavaScript</a></div>
</div>
`,
    },

    /* ─────────────────────────── 5.6 quiz ─────────────────────────── */
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra chương 5',
      slug: 'wf-5-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về event loop, Promise, async/await, fetch và ES modules — có câu thứ tự in ra đã chạy thật.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 5: synchronous vs asynchronous, the event loop and print order, Promise states, async/await and try/catch, fetch and response.ok, and ES module import/export. The ordering answers were verified by running the code.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> Async is best learned hands-on. On Code Lab, write Promises, async/await and fetch-style tasks with instant checks.</p>
<div class="link-card"><a href="/code-lab/javascript">Practice on Code Lab → JavaScript track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 5: đồng bộ vs bất đồng bộ, event loop và thứ tự in ra, các trạng thái Promise, async/await và try/catch, fetch và response.ok, và import/export ES module. Đáp án thứ tự đã được xác minh bằng cách chạy code.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Bất đồng bộ học tốt nhất qua thực hành. Trên Code Lab, hãy viết Promise, async/await và bài kiểu fetch với chấm điểm tức thì.</p>
<div class="link-card"><a href="/code-lab/javascript">Luyện tập ở Code Lab → track JavaScript</a></div></div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'JavaScript is single-threaded. How does it stay responsive while waiting?|||JavaScript đơn luồng. Làm sao nó vẫn mượt khi đang chờ?',
            options: [
              'The event loop runs queued callbacks after the current sync code finishes|||Event loop chạy các callback trong hàng đợi sau khi code đồng bộ hiện tại xong',
              'It creates a new thread for each task|||Nó tạo một luồng mới cho mỗi tác vụ',
              'It pauses the whole program until done|||Nó tạm dừng cả chương trình tới khi xong',
              'It runs everything at random|||Nó chạy mọi thứ ngẫu nhiên',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does this print?  console.log("start"); setTimeout(() => console.log("timeout"), 0); console.log("end");|||Đoạn này in ra gì?  console.log("start"); setTimeout(() => console.log("timeout"), 0); console.log("end");',
            options: [
              'start, end, timeout|||start, end, timeout',
              'start, timeout, end|||start, timeout, end',
              'timeout, start, end|||timeout, start, end',
              'start, end (timeout never runs)|||start, end (timeout không bao giờ chạy)',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A Promise callback (microtask) and a setTimeout callback are both queued. Which runs first?|||Một callback Promise (microtask) và một callback setTimeout cùng vào hàng đợi. Cái nào chạy trước?',
            options: [
              'The Promise microtask runs before the setTimeout callback|||Microtask Promise chạy trước callback setTimeout',
              'The setTimeout callback runs first|||Callback setTimeout chạy trước',
              'They run at exactly the same time|||Chúng chạy đúng cùng lúc',
              'Whichever was written first in the code|||Cái nào viết trước trong code',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What are the three states of a Promise?|||Ba trạng thái của một Promise là gì?',
            options: [
              'pending, fulfilled, rejected|||pending, fulfilled, rejected',
              'start, running, stop|||start, running, stop',
              'open, closed, error|||open, closed, error',
              'true, false, undefined|||true, false, undefined',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the "await" keyword do inside an async function?|||Từ khoá "await" làm gì bên trong một hàm async?',
            options: [
              'Pauses the function until the Promise settles, then gives its value|||Dừng hàm tới khi Promise chốt, rồi trao giá trị của nó',
              'Blocks the entire browser thread|||Chặn cả luồng trình duyệt',
              'Cancels the Promise|||Huỷ Promise',
              'Converts a value into a string|||Chuyển một giá trị thành chuỗi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How do you catch an error from an awaited call?|||Làm sao bắt lỗi từ một lời gọi có await?',
            options: [
              'Wrap it in try/catch|||Bọc nó trong try/catch',
              'It cannot be caught|||Không bắt được',
              'Use an if statement on the value|||Dùng câu if trên giá trị',
              'Add a second await|||Thêm một await thứ hai',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Two independent requests each take 1 second. What runs them in ~1 second total?|||Hai yêu cầu độc lập mỗi cái tốn 1 giây. Cái gì chạy chúng trong ~1 giây tổng?',
            options: [
              'await Promise.all([fetchA(), fetchB()])|||await Promise.all([fetchA(), fetchB()])',
              'await fetchA(); await fetchB();|||await fetchA(); await fetchB();',
              'Awaiting them one at a time in a loop|||Await từng cái một trong vòng lặp',
              'They can never overlap|||Chúng không bao giờ chồng lặp được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Does fetch() reject its Promise on an HTTP 404 response?|||fetch() có reject Promise của nó khi phản hồi HTTP 404 không?',
            options: [
              'No — it fulfils; you must check response.ok yourself|||Không — nó fulfilled; bạn phải tự kiểm response.ok',
              'Yes — 404 always rejects|||Có — 404 luôn reject',
              'Yes — any status other than 200 rejects|||Có — mọi mã khác 200 đều reject',
              'It throws a syntax error|||Nó ném một lỗi cú pháp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'To read the JSON body of a fetch response, you…|||Để đọc phần thân JSON của một phản hồi fetch, bạn…',
            options: [
              'await response.json()|||await response.json()',
              'read response.body directly as an object|||đọc response.body trực tiếp như một đối tượng',
              'call JSON.parse(response)|||gọi JSON.parse(response)',
              'use response.text without await|||dùng response.text không cần await',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which import matches  export default function User(){}  in User.js?|||Import nào khớp với  export default function User(){}  trong User.js?',
            options: [
              'import User from "./User.js"|||import User from "./User.js"',
              'import { User } from "./User.js"|||import { User } from "./User.js"',
              'import * User from "./User.js"|||import * User from "./User.js"',
              'require User from "./User.js"|||require User from "./User.js"',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
