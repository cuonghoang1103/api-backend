/**
 * Bài 10.2 — Đọc lỗi & vòng lặp gỡ lỗi (nâng cấp 02/11/2026). Output thật: _demo/_t10/10-2/chay.sh (Node 22.23: stack trace
 * qua 3 tệp, 6 loại lỗi, promise bị từ chối có cause; git bisect run trong kho tạm) + 10-2/chay.mjs (Chromium thật: lỗi trên
 * trang với dòng:cột, và BREAKPOINT thật qua Chrome DevTools Protocol đọc biến cục bộ). Deck: scripts/slides-src/wf-10-2.mjs.
 * Code Lab: wf-10-2-reading-errors-debugging.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-10-2', 'Reading errors and debugging', 'Đọc lỗi và gỡ lỗi', [
  [1, 'Reading errors and debugging',
    '<p>Every developer spends a large part of the day on things that do not work. The difference between a beginner and an experienced developer is not fewer bugs, it is a method: read the error, find the line, look at the real values, form a guess and test it. This lesson runs that method on real errors from Node and from Chromium.</p>',
    '<p>Lập trình viên nào cũng dành phần lớn thời gian trong ngày cho những thứ không chạy. Khác biệt giữa người mới và người có kinh nghiệm không phải là ít lỗi hơn, mà là có phương pháp: đọc lỗi, tìm dòng, nhìn giá trị thật, đặt giả thuyết rồi kiểm tra. Bài này chạy phương pháp đó trên lỗi thật từ Node và từ Chromium.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to read an error message and its file, line and column, follow a stack trace through several files, recognise the six most common error names, handle errors from async code, stop the browser on a breakpoint and read the variables, and use git bisect to find which commit broke something.</p>',
    '<p>Bạn sẽ đọc được thông điệp lỗi kèm tệp, dòng và cột, lần theo stack trace qua nhiều tệp, nhận ra sáu tên lỗi hay gặp nhất, xử lý lỗi của mã bất đồng bộ, dừng trình duyệt ở một breakpoint và đọc các biến, và dùng git bisect để tìm commit đã làm hỏng.</p>'],
  [3, 'A stack trace, read bottom up',
    '<p>The first order printed fine; the second crashed. Node printed the exact line with a caret under the failing spot, the message, and three lines of stack: the crash in shippingLabel, called by checkout, called by index. The message says what was undefined: the address.</p>',
    '<p>Đơn đầu in bình thường; đơn thứ hai sập. Node in đúng dòng kèm dấu mũ dưới chỗ hỏng, thông điệp, và ba dòng stack: sập trong shippingLabel, được checkout gọi, checkout được index gọi. Thông điệp nói rõ cái gì undefined: địa chỉ.</p>'],
  [4, 'Six error names',
    '<p>ReferenceError means a name that does not exist, often a typo. TypeError means the value is the wrong kind: not a function, or undefined. SyntaxError from JSON parse means bad JSON. RangeError means a number out of range, or recursion that never stops. The name tells you where to look.</p>',
    '<p>ReferenceError là một tên không tồn tại, thường do gõ sai. TypeError là giá trị sai loại: không phải hàm, hoặc undefined. SyntaxError từ JSON parse là JSON sai. RangeError là số ngoài khoảng, hoặc đệ quy không dừng. Tên lỗi cho biết phải nhìn chỗ nào.</p>'],
  [5, 'Async errors arrive later',
    '<p>An async function threw, but nobody awaited it. The next line ran first, then the rejection crashed the program. Always await promises or attach a catch, and pass the original error as the cause so the context is kept.</p>',
    '<p>Một hàm async ném lỗi nhưng không ai await nó. Dòng kế tiếp chạy trước, rồi lời từ chối làm sập chương trình. Luôn await promise hoặc gắn catch, và truyền lỗi gốc vào cause để giữ ngữ cảnh.</p>'],
  [6, 'Errors in the browser',
    '<p>In Chromium the click printed a total of fifty five million and fifteen thousand, as a string, and then an uncaught TypeError at line sixteen of cart dot js. The wrong total was not an error at all. Only looking at the values would show it.</p>',
    '<p>Trong Chromium, cú bấm in ra tổng năm mươi lăm triệu không trăm mười lăm nghìn, dạng chuỗi, rồi một TypeError không được bắt ở dòng mười sáu của cart chấm js. Tổng sai hoàn toàn không phải lỗi. Chỉ nhìn giá trị mới thấy.</p>'],
  [7, 'A real breakpoint',
    '<p>We paused the page on line seven, the return of cartTotal, and read the local variables the way the Sources panel shows them: total is fifty five thousand, a number, and shipping is the string fifteen thousand. The plus sign joins them. One look at the values explained the bug.</p>',
    '<p>Ta dừng trang ở dòng bảy, lệnh return của cartTotal, và đọc biến cục bộ như panel Sources hiển thị: total là năm mươi lăm nghìn, một số, còn shipping là chuỗi mười lăm nghìn. Dấu cộng nối chúng lại. Nhìn giá trị một lần là hiểu lỗi.</p>'],
  [8, 'Find when it broke: git bisect',
    '<p>A test that passed a week ago fails today, after seven commits. git bisect checks out the middle commit, runs the test, and halves the range each time. After two runs it named the commit that changed price times one point one into price times one plus zero point one.</p>',
    '<p>Một phép kiểm tuần trước đạt nay hỏng, sau bảy commit. git bisect lấy commit ở giữa, chạy phép kiểm, và chia đôi khoảng mỗi lần. Sau hai lần chạy, nó chỉ ra commit đã đổi price nhân một phẩy một thành price nhân một cộng không phẩy một.</p>'],
  [9, 'Summary & practice',
    '<p>The practice gives you three broken programs. For each one, read the error, write your hypothesis before changing anything, confirm it with a log or a breakpoint, then fix it. Done when all three run correctly and your notes say what the cause was.</p>',
    '<p>Bài luyện cho bạn ba chương trình hỏng. Với mỗi cái, đọc lỗi, viết giả thuyết trước khi sửa gì, xác nhận bằng log hoặc breakpoint, rồi sửa. Xong khi cả ba chạy đúng và ghi chú của bạn nói rõ nguyên nhân.</p>'],
]);

export default {
  title: '10.2 — Reading errors & the debugging loop|||10.2 — Đọc lỗi & vòng lặp gỡ lỗi',
  slug: 'wf-10-2-reading-errors-debugging',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/H0XScE08hy8', durationSeconds: 0 },
  description: 'Đọc stack trace thật của Node 22.23 qua 3 tệp (dấu mũ, tệp:dòng:cột), sáu tên lỗi hay gặp, promise bị từ chối không ai await (có cause); trong Chromium thật: tổng "5500015000" là chuỗi, lỗi không bắt ở cart.js:16:32, BREAKPOINT thật đọc biến (shipping = "15000"); vòng lặp giả thuyết → kiểm; git bisect run tìm commit làm hỏng sau 2 lần chạy.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>An error message is not an attack — it is a clue</h2>
<p class="lead">After this lesson you can read an error message and its <code>file:line:column</code>, follow a stack trace through several files, recognise the six error names you will meet most, deal with errors that come from async code, stop the browser on a breakpoint and read the real values, and let <code>git bisect</code> find the commit that broke a test. All output below is real: Node 22.23, Chromium driven by Playwright, and Git 2.51.</p>

<h3>Step 1 — read the whole message, then the line</h3>
<p>A small shop: <code>index.mjs</code> calls <code>checkout()</code>, which calls <code>shippingLabel()</code>. The first order works; the second is a pick-up order with no address.</p>
${ma('javascript', CODE['_t10/10-2/shop/index.mjs'])}
${ma('javascript', CODE['_t10/10-2/shop/checkout.mjs'])}
${ma('javascript', CODE['_t10/10-2/shop/format.mjs'])}
${ra(OUT['_t10/out/stack'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">1 · where</span><span class="lz-t">shop/format.mjs:3 + the caret ^</span><span class="lz-d">Node prints the exact line and points at the spot: <code>.city</code>.</span></div>
<div class="lz-layer"><span class="lz-k">2 · what</span><span class="lz-t">TypeError: Cannot read properties of undefined (reading 'city')</span><span class="lz-d">Something was <code>undefined</code>, and we tried to read <code>.city</code> from it ⇒ <code>order.customer.address</code> is undefined.</span></div>
<div class="lz-layer"><span class="lz-k">3 · how we got there</span><span class="lz-t">the stack, top = innermost</span><span class="lz-d"><code>shippingLabel</code> (format.mjs:3:62) ← <code>checkout</code> (checkout.mjs:5:26) ← index.mjs:9. The <code>node:internal</code> lines are Node itself — skip them.</span></div>
<div class="lz-layer"><span class="lz-k">4 · which data</span><span class="lz-t">"order 1" printed, then the crash</span><span class="lz-d">So the bad data is order 2 — the one without an address.</span></div>
</div>
<p>Reading "the bottom of your own code" in the stack (index.mjs:9) tells you <em>which call</em> triggered it; the top tells you <em>where</em> it broke. The fix is a decision, not a guess: pick-up orders have no address, so <code>shippingLabel</code> must handle that (<code>order.customer.address?.city ?? 'pick-up'</code>), or <code>checkout</code> must not ask for a label.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — reading only the first word of the error.</strong> "TypeError" alone says almost nothing; the rest of the line says <em>which</em> property and <em>which</em> value. And "Cannot read properties of undefined (reading 'city')" does not mean <code>city</code> is missing — it means the thing <em>before</em> <code>.city</code> is undefined. Read the whole message, slowly, every time.</p></div>

<h3>Step 2 — six error names and what they point at</h3>
${ma('javascript', CODE['_t10/10-2/errors.mjs'])}
${ra(OUT['_t10/out/errors'])}
<table>
<thead><tr><th>Name</th><th>Usually means</th><th>Look at</th></tr></thead>
<tbody>
<tr><td><code>ReferenceError</code></td><td>a name that does not exist</td><td>spelling, scope, a missing import</td></tr>
<tr><td><code>TypeError: … is not a function</code></td><td>calling something that is not a function</td><td>the method name, what the object really is</td></tr>
<tr><td><code>TypeError: Cannot read properties of undefined</code></td><td>reading through a missing value</td><td>the thing <em>before</em> the dot</td></tr>
<tr><td><code>SyntaxError</code> (from <code>JSON.parse</code>)</td><td>the text is not valid JSON</td><td>the position it gives; often HTML or single quotes</td></tr>
<tr><td><code>RangeError</code></td><td>a number out of the allowed range</td><td>the argument; for "call stack" a recursion with no stop</td></tr>
</tbody>
</table>

<h3>Step 3 — errors from async code</h3>
${ma('javascript', CODE['_t10/10-2/async-error.mjs'])}
${ra(OUT['_t10/out/async-error'])}
<p>The message printed <em>before</em> the crash: the async function threw, but nobody was waiting for it, so the program went on and crashed later with an "unhandled rejection". In a server this is worse — the error may arrive while another request is being handled. Two rules: always <code>await</code> (or <code>.catch()</code>) a promise; and when you rethrow, keep the original as <code>cause</code>, which Node printed as <code>[cause]: { id: 42 }</code>.</p>

<h3>Step 4 — errors in the browser, and bugs that are not errors</h3>
<p>The same habits work in Chromium's DevTools. A cart page: the "Add pen" button reads its price and shipping cost from <code>data-*</code> attributes.</p>
${ma('xml', CODE['_t10/10-2/page.html'])}
${ma('javascript', CODE['_t10/10-2/cart.js'])}
${ra(OUT['_t10/out/page-console'])}
<p>Two problems, very different. The <strong>error</strong> is easy: DevTools names it and gives <code>cart.js:16:32</code> — <code>window.lastLabel</code> was never created. The <strong>wrong total</strong> — <code>5500015000</code>, a string — produced no error at all. JavaScript happily joined a number and a string. Bugs that do not throw can only be found by looking at values.</p>

<h3>Step 5 — a breakpoint: stop the program and look</h3>
<p><code>console.log</code> works, but you must guess in advance what to print. A breakpoint pauses the program on a line and shows <em>every</em> variable. In DevTools: Sources → cart.js → click the line number 7 → click the button. Here the same thing done through the Chrome DevTools Protocol, which is what the Sources panel itself uses:</p>
${ra(OUT['_t10/out/breakpoint'])}
<p>Paused on <code>return total + shipping</code>: <code>total = 55000</code> is a number (multiplication turned <code>"5000"</code> into a number and hid the problem), <code>shipping = "15000"</code> is a string. The <code>+</code> joins them. Fix at the boundary: <code>Number(event.target.dataset.shipping)</code> — or better, validate like Lesson 9.5.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Reproduce</span><span class="lz-d">The exact steps that show the bug, every time.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Hypothesis</span><span class="lz-d">Write it down: "shipping is a string".</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Test it</span><span class="lz-d">A breakpoint or one <code>console.log</code> that can prove it wrong.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Fix + re-run</span><span class="lz-d">The reproduction now passes — and add a test so it stays fixed.</span></div>
</div>
<table>
<thead><tr><th>DevTools control</th><th>Does</th></tr></thead>
<tbody>
<tr><td>Resume (F8)</td><td>run until the next breakpoint</td></tr>
<tr><td>Step over (F10)</td><td>run the current line, stop at the next one</td></tr>
<tr><td>Step into (F11)</td><td>go inside the function called on this line</td></tr>
<tr><td>Conditional breakpoint</td><td>pause only when an expression is true, e.g. <code>typeof shipping === 'string'</code></td></tr>
<tr><td><code>debugger;</code> in code</td><td>a breakpoint written in the source (remove it before committing)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — changing code at random until it works.</strong> Adding <code>Number()</code> in three places, swapping <code>+</code> for <code>-</code>, "trying" things: when it finally works you do not know why, and the real cause is often still there. Every change should test one written hypothesis. If the hypothesis was wrong, undo the change before trying the next one.</p></div>

<h3>Step 6 — find <em>when</em> it broke: <code>git bisect</code></h3>
<p>Sometimes the question is not "which line" but "which change". A price test passed a week ago and fails now, seven commits later. <code>git bisect</code> does a binary search through history: it checks out a commit in the middle, you (or a script) say good or bad, it halves the range again.</p>
${ra(OUT['_t10/out/bisect'])}
<p>Seven commits, two test runs, one answer: "use VAT constant" changed <code>price * 1.1</code> into <code>price * 1 + 0.1</code>. With 1 000 commits it takes about 10 runs. <code>git bisect run</code> needs a command that exits 0 for good and non-zero for bad — exactly what a test does (Lesson 10.1).</p>

<div class="callout ok">
<p><strong>🧪 Practice (40 minutes) — three broken programs</strong></p>
<ol>
<li>Copy the <code>shop/</code> folder and run it. Before changing anything, write in a comment: the file and line, the message, which data caused it. Then fix it so pick-up orders print <code>Minh, pick-up</code>.</li>
<li>Copy <code>page.html</code> + <code>cart.js</code>, open them through a local server (<code>npx serve</code> or VS Code Live Server), set a breakpoint on line 7, click the button and write down the type of each variable. Fix both problems.</li>
<li>Copy <code>async-error.mjs</code> and make it print <code>could not load user 42: HTTP 404 for user 42</code> instead of crashing, using <code>try/await/catch</code>.</li>
<li>Optional: in a scratch repository, make five commits where the third breaks a small test, and find it with <code>git bisect run</code>.</li>
</ol>
<p>Hint: in DevTools, hover over a variable while paused to see its value; the Scope pane lists them all.</p>
<p><strong>Done when:</strong> all three programs run without an uncaught error, the cart shows <code>Total: 70000 VND</code>, and for each one you wrote the hypothesis <em>before</em> the fix. Then Code Lab module 10.2.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">error message</span><span class="v">thông điệp lỗi.</span></div>
  <div class="kv"><span class="k">stack trace</span><span class="v">vệt ngăn xếp — chuỗi lời gọi dẫn tới lỗi.</span></div>
  <div class="kv"><span class="k">file:line:column</span><span class="v">tệp:dòng:cột.</span></div>
  <div class="kv"><span class="k">uncaught / unhandled rejection</span><span class="v">lỗi không bắt / promise bị từ chối không xử lý.</span></div>
  <div class="kv"><span class="k">cause</span><span class="v">nguyên nhân gốc — <code>new Error(msg, { cause })</code>.</span></div>
  <div class="kv"><span class="k">breakpoint</span><span class="v">điểm dừng.</span></div>
  <div class="kv"><span class="k">step over / into</span><span class="v">chạy qua / đi vào hàm.</span></div>
  <div class="kv"><span class="k">hypothesis</span><span class="v">giả thuyết.</span></div>
  <div class="kv"><span class="k">reproduce</span><span class="v">tái hiện lỗi.</span></div>
  <div class="kv"><span class="k">git bisect</span><span class="v">tìm commit gây lỗi bằng chia đôi.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Read the whole message, then the line and the caret; "reading 'x'" means the thing <em>before</em> <code>.x</code> is missing.</li>
  <li>A stack trace lists calls innermost first; find your own files, skip <code>node:internal</code>.</li>
  <li>The error name points at the kind of problem: Reference, Type, Syntax, Range.</li>
  <li>Await or catch every promise; keep the original error as <code>cause</code>.</li>
  <li>Bugs that do not throw are found by looking at values: <code>console.log</code> or a breakpoint.</li>
  <li>Hypothesis → test → fix; <code>git bisect run</code> finds which commit broke a test.</li>
</ul>
${nguon('📗', 'Chrome DevTools — Debug JavaScript', 'Breakpoints, stepping and the Scope pane', 'https://developer.chrome.com/docs/devtools/javascript')}
${nguon('📘', 'MDN — JavaScript error reference', 'Every error message with causes and fixes', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors')}
${lienKet({ khoa: 'git', bai: 'git-2-4-bisect', title: 'Git 2.4 — git bisect', sub: 'Binary search through history, by hand and with bisect run', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Thông điệp lỗi không phải đòn tấn công — đó là manh mối</h2>
<p class="lead">Học xong bài này bạn đọc được thông điệp lỗi và <code>tệp:dòng:cột</code> của nó, lần theo stack trace qua nhiều tệp, nhận ra sáu tên lỗi hay gặp nhất, xử lý lỗi đến từ mã bất đồng bộ, dừng trình duyệt ở một breakpoint và đọc giá trị thật, và để <code>git bisect</code> tìm commit đã làm hỏng một phép kiểm. Mọi output dưới đây là thật: Node 22.23, Chromium điều khiển bằng Playwright, và Git 2.51.</p>

<h3>Bước 1 — đọc hết thông điệp, rồi tới dòng</h3>
<p>Một cửa hàng nhỏ: <code>index.mjs</code> gọi <code>checkout()</code>, hàm này gọi <code>shippingLabel()</code>. Đơn đầu chạy; đơn thứ hai là đơn tự đến lấy, không có địa chỉ.</p>
${ma('javascript', CODE['_t10/10-2/shop/index.mjs'])}
${ma('javascript', CODE['_t10/10-2/shop/checkout.mjs'])}
${ma('javascript', CODE['_t10/10-2/shop/format.mjs'])}
${ra(OUT['_t10/out/stack'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">1 · ở đâu</span><span class="lz-t">shop/format.mjs:3 + dấu mũ ^</span><span class="lz-d">Node in đúng dòng và chỉ vào chỗ hỏng: <code>.city</code>.</span></div>
<div class="lz-layer"><span class="lz-k">2 · cái gì</span><span class="lz-t">TypeError: Cannot read properties of undefined (reading 'city')</span><span class="lz-d">Có thứ là <code>undefined</code>, và ta cố đọc <code>.city</code> từ nó ⇒ <code>order.customer.address</code> là undefined.</span></div>
<div class="lz-layer"><span class="lz-k">3 · đường đi</span><span class="lz-t">stack, trên cùng = trong cùng</span><span class="lz-d"><code>shippingLabel</code> (format.mjs:3:62) ← <code>checkout</code> (checkout.mjs:5:26) ← index.mjs:9. Các dòng <code>node:internal</code> là của Node — bỏ qua.</span></div>
<div class="lz-layer"><span class="lz-k">4 · dữ liệu nào</span><span class="lz-t">"order 1" in ra, rồi sập</span><span class="lz-d">Vậy dữ liệu xấu là đơn 2 — đơn không có địa chỉ.</span></div>
</div>
<p>Đọc "dòng dưới cùng thuộc mã của bạn" trong stack (index.mjs:9) cho biết <em>lời gọi nào</em> gây ra; dòng trên cùng cho biết <em>chỗ nào</em> hỏng. Cách sửa là một quyết định, không phải đoán: đơn tự lấy không có địa chỉ, nên <code>shippingLabel</code> phải xử lý trường hợp đó (<code>order.customer.address?.city ?? 'pick-up'</code>), hoặc <code>checkout</code> không được xin nhãn.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ đọc chữ đầu tiên của lỗi.</strong> Riêng "TypeError" hầu như không nói gì; phần còn lại của dòng nói <em>thuộc tính nào</em> và <em>giá trị nào</em>. Và "Cannot read properties of undefined (reading 'city')" không có nghĩa là thiếu <code>city</code> — mà là thứ <em>đứng trước</em> <code>.city</code> là undefined. Đọc hết thông điệp, chậm rãi, lần nào cũng vậy.</p></div>

<h3>Bước 2 — sáu tên lỗi và chúng chỉ vào đâu</h3>
${ma('javascript', CODE['_t10/10-2/errors.mjs'])}
${ra(OUT['_t10/out/errors'])}
<table>
<thead><tr><th>Tên</th><th>Thường nghĩa là</th><th>Nhìn vào</th></tr></thead>
<tbody>
<tr><td><code>ReferenceError</code></td><td>một tên không tồn tại</td><td>chính tả, phạm vi, thiếu import</td></tr>
<tr><td><code>TypeError: … is not a function</code></td><td>gọi một thứ không phải hàm</td><td>tên phương thức, object thật sự là gì</td></tr>
<tr><td><code>TypeError: Cannot read properties of undefined</code></td><td>đọc xuyên qua một giá trị bị thiếu</td><td>thứ <em>trước</em> dấu chấm</td></tr>
<tr><td><code>SyntaxError</code> (từ <code>JSON.parse</code>)</td><td>chuỗi không phải JSON hợp lệ</td><td>vị trí nó báo; thường là HTML hoặc nháy đơn</td></tr>
<tr><td><code>RangeError</code></td><td>số ngoài khoảng cho phép</td><td>đối số; với "call stack" là đệ quy không có điểm dừng</td></tr>
</tbody>
</table>

<h3>Bước 3 — lỗi từ mã bất đồng bộ</h3>
${ma('javascript', CODE['_t10/10-2/async-error.mjs'])}
${ra(OUT['_t10/out/async-error'])}
<p>Câu thông báo in ra <em>trước</em> khi sập: hàm async ném lỗi, nhưng không ai chờ nó, nên chương trình chạy tiếp rồi mới sập vì "unhandled rejection". Ở máy chủ còn tệ hơn — lỗi có thể đến khi một request khác đang được xử lý. Hai luật: luôn <code>await</code> (hoặc <code>.catch()</code>) một promise; và khi ném lại, giữ lỗi gốc trong <code>cause</code>, thứ Node in ra là <code>[cause]: { id: 42 }</code>.</p>

<h3>Bước 4 — lỗi trong trình duyệt, và những bug không phải lỗi</h3>
<p>Cùng thói quen đó dùng được trong DevTools của Chromium. Một trang giỏ hàng: nút "Add pen" đọc giá và phí ship từ thuộc tính <code>data-*</code>.</p>
${ma('xml', CODE['_t10/10-2/page.html'])}
${ma('javascript', CODE['_t10/10-2/cart.js'])}
${ra(OUT['_t10/out/page-console'])}
<p>Hai vấn đề, rất khác nhau. <strong>Lỗi</strong> thì dễ: DevTools gọi tên và chỉ <code>cart.js:16:32</code> — <code>window.lastLabel</code> chưa từng được tạo. <strong>Tổng sai</strong> — <code>5500015000</code>, một chuỗi — không sinh lỗi nào cả. JavaScript vui vẻ nối một số với một chuỗi. Bug không ném lỗi chỉ tìm được bằng cách nhìn giá trị.</p>

<h3>Bước 5 — breakpoint: dừng chương trình và nhìn</h3>
<p><code>console.log</code> dùng được, nhưng bạn phải đoán trước cần in gì. Breakpoint dừng chương trình ở một dòng và cho thấy <em>mọi</em> biến. Trong DevTools: Sources → cart.js → bấm số dòng 7 → bấm nút. Đây là đúng việc đó làm qua Chrome DevTools Protocol, chính thứ panel Sources dùng:</p>
${ra(OUT['_t10/out/breakpoint'])}
<p>Dừng ở <code>return total + shipping</code>: <code>total = 55000</code> là số (phép nhân đã biến <code>"5000"</code> thành số và che mất vấn đề), <code>shipping = "15000"</code> là chuỗi. Dấu <code>+</code> nối chúng lại. Sửa ở ranh giới: <code>Number(event.target.dataset.shipping)</code> — hoặc tốt hơn, kiểm dữ liệu như Bài 9.5.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tái hiện</span><span class="lz-d">Đúng các bước làm lộ lỗi, lần nào cũng được.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Giả thuyết</span><span class="lz-d">Viết ra: "shipping là chuỗi".</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kiểm nó</span><span class="lz-d">Một breakpoint hay một <code>console.log</code> có thể chứng minh nó sai.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Sửa + chạy lại</span><span class="lz-d">Bước tái hiện giờ qua — và thêm một phép kiểm để nó không quay lại.</span></div>
</div>
<table>
<thead><tr><th>Nút DevTools</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td>Resume (F8)</td><td>chạy tới breakpoint kế tiếp</td></tr>
<tr><td>Step over (F10)</td><td>chạy dòng hiện tại, dừng ở dòng sau</td></tr>
<tr><td>Step into (F11)</td><td>đi vào trong hàm được gọi ở dòng này</td></tr>
<tr><td>Breakpoint có điều kiện</td><td>chỉ dừng khi biểu thức đúng, vd <code>typeof shipping === 'string'</code></td></tr>
<tr><td><code>debugger;</code> trong mã</td><td>breakpoint viết thẳng trong nguồn (xoá trước khi commit)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đổi mã lung tung tới khi chạy được.</strong> Thêm <code>Number()</code> ở ba chỗ, đổi <code>+</code> thành <code>-</code>, "thử" đủ thứ: khi cuối cùng chạy được, bạn không biết vì sao, và nguyên nhân thật thường vẫn còn đó. Mỗi thay đổi nên kiểm đúng một giả thuyết đã viết ra. Giả thuyết sai thì hoàn tác thay đổi trước khi thử cái tiếp theo.</p></div>

<h3>Bước 6 — tìm <em>khi nào</em> nó hỏng: <code>git bisect</code></h3>
<p>Đôi khi câu hỏi không phải "dòng nào" mà là "thay đổi nào". Một phép kiểm giá tuần trước đạt nay hỏng, sau bảy commit. <code>git bisect</code> tìm kiếm nhị phân trong lịch sử: lấy một commit ở giữa, bạn (hoặc một script) nói tốt hay xấu, nó lại chia đôi khoảng.</p>
${ra(OUT['_t10/out/bisect'])}
<p>Bảy commit, hai lần chạy kiểm, một câu trả lời: "use VAT constant" đã đổi <code>price * 1.1</code> thành <code>price * 1 + 0.1</code>. Với 1 000 commit thì mất khoảng 10 lần chạy. <code>git bisect run</code> cần một lệnh thoát 0 khi tốt và khác 0 khi xấu — đúng thứ một phép kiểm làm (Bài 10.1).</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (40 phút) — ba chương trình hỏng</strong></p>
<ol>
<li>Chép thư mục <code>shop/</code> và chạy. Trước khi sửa gì, viết vào chú thích: tệp và dòng, thông điệp, dữ liệu nào gây ra. Rồi sửa để đơn tự lấy in <code>Minh, pick-up</code>.</li>
<li>Chép <code>page.html</code> + <code>cart.js</code>, mở qua một máy chủ cục bộ (<code>npx serve</code> hoặc Live Server của VS Code), đặt breakpoint ở dòng 7, bấm nút và ghi lại kiểu của từng biến. Sửa cả hai vấn đề.</li>
<li>Chép <code>async-error.mjs</code> và làm nó in <code>could not load user 42: HTTP 404 for user 42</code> thay vì sập, bằng <code>try/await/catch</code>.</li>
<li>Tuỳ chọn: trong một kho nháp, tạo năm commit mà commit thứ ba làm hỏng một phép kiểm nhỏ, rồi tìm nó bằng <code>git bisect run</code>.</li>
</ol>
<p>Gợi ý: trong DevTools, khi đang dừng hãy rê chuột lên một biến để xem giá trị; khung Scope liệt kê tất cả.</p>
<p><strong>Xong khi:</strong> cả ba chương trình chạy không còn lỗi không bắt, giỏ hàng hiện <code>Total: 70000 VND</code>, và với mỗi cái bạn đã viết giả thuyết <em>trước</em> khi sửa. Sau đó làm module Code Lab 10.2.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">error message</span><span class="v">thông điệp lỗi.</span></div>
  <div class="kv"><span class="k">stack trace</span><span class="v">vệt ngăn xếp — chuỗi lời gọi dẫn tới lỗi.</span></div>
  <div class="kv"><span class="k">file:line:column</span><span class="v">tệp:dòng:cột.</span></div>
  <div class="kv"><span class="k">uncaught / unhandled rejection</span><span class="v">lỗi không bắt / promise bị từ chối không xử lý.</span></div>
  <div class="kv"><span class="k">cause</span><span class="v">nguyên nhân gốc — <code>new Error(msg, { cause })</code>.</span></div>
  <div class="kv"><span class="k">breakpoint</span><span class="v">điểm dừng.</span></div>
  <div class="kv"><span class="k">step over / into</span><span class="v">chạy qua / đi vào hàm.</span></div>
  <div class="kv"><span class="k">hypothesis</span><span class="v">giả thuyết.</span></div>
  <div class="kv"><span class="k">reproduce</span><span class="v">tái hiện lỗi.</span></div>
  <div class="kv"><span class="k">git bisect</span><span class="v">tìm commit gây lỗi bằng chia đôi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đọc hết thông điệp, rồi dòng và dấu mũ; "reading 'x'" nghĩa là thứ <em>trước</em> <code>.x</code> bị thiếu.</li>
  <li>Stack trace liệt kê lời gọi từ trong ra ngoài; tìm tệp của bạn, bỏ qua <code>node:internal</code>.</li>
  <li>Tên lỗi chỉ ra loại vấn đề: Reference, Type, Syntax, Range.</li>
  <li>Await hoặc catch mọi promise; giữ lỗi gốc trong <code>cause</code>.</li>
  <li>Bug không ném lỗi được tìm bằng cách nhìn giá trị: <code>console.log</code> hoặc breakpoint.</li>
  <li>Giả thuyết → kiểm → sửa; <code>git bisect run</code> tìm commit đã làm hỏng một phép kiểm.</li>
</ul>
${nguon('📗', 'Chrome DevTools — Debug JavaScript', 'Breakpoint, chạy từng bước và khung Scope', 'https://developer.chrome.com/docs/devtools/javascript')}
${nguon('📘', 'MDN — JavaScript error reference', 'Mọi thông điệp lỗi kèm nguyên nhân và cách sửa', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors')}
${lienKet({ khoa: 'git', bai: 'git-2-4-bisect', title: 'Git 2.4 — git bisect', sub: 'Tìm kiếm nhị phân trong lịch sử, bằng tay và bằng bisect run', cta: 'Mở bài' })}
</div>
`,
};
