/**
 * Bài 11.1 — Closure (nâng cấp 01/11/2026). Mã + output: ../_ma.mjs (chạy thật trong Chromium, scripts/wf/chay-demo.mjs).
 * Deck: scripts/slides-src/wf-11-1.mjs (12 slide, WF/v1/wf-11-1).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-11-1', 'Closure', 'Closure', [
  [1, 'Closure — a function that remembers',
    '<p>This lesson is about one idea that sits under almost everything you will write in JavaScript: a function keeps a link to the variables of the place where it was written. That bundle — the function plus those variables — is called a <strong>closure</strong>.</p>',
    '<p>Bài này nói về một ý tưởng nằm dưới gần như mọi thứ bạn sẽ viết bằng JavaScript: một hàm giữ đường dẫn tới các biến ở nơi nó được viết ra. Cái gói đó — hàm cộng với những biến ấy — gọi là <strong>closure (bao đóng)</strong>.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five concrete skills. The most practical ones are private state and spotting a stale value. The <code>var</code> loop is the most famous interview question about JavaScript, and after today you can explain it instead of memorising the answer.</p>',
    '<p>Năm kỹ năng cụ thể. Thực dụng nhất là tạo state riêng tư và nhận ra một giá trị "cũ". Vòng lặp <code>var</code> là câu phỏng vấn nổi tiếng nhất về JavaScript — học xong bạn giải thích được, không phải học thuộc đáp án.</p>'],
  [3, 'Scope: who can see which variable',
    '<p>Before closures, scope. The inner function prints all three names because it can look outward. The outer function cannot see <code>item</code>, and the global code cannot see <code>user</code> — both print <code>undefined</code>. What decides this is where the code is written, not where it is called.</p>',
    '<p>Trước closure là phạm vi. Hàm trong in được cả ba tên vì nó nhìn được ra ngoài. Hàm ngoài không thấy <code>item</code>, code toàn cục không thấy <code>user</code> — cả hai in <code>undefined</code>. Thứ quyết định là code được VIẾT ở đâu, không phải được GỌI ở đâu.</p>'],
  [4, 'A function that outlives its parent',
    '<p><code>makeCounter</code> returns, and normally its local variable would disappear. It does not: the returned function still refers to <code>count</code>, so JavaScript keeps it alive. Calling <code>makeCounter</code> twice gives two separate counters — that is why <code>a</code> reaches 4 while <code>b</code> is 1.</p>',
    '<p><code>makeCounter</code> chạy xong, lẽ ra biến cục bộ của nó biến mất. Nó không mất: hàm được trả về vẫn trỏ tới <code>count</code>, nên JavaScript giữ nó sống. Gọi <code>makeCounter</code> hai lần cho hai bộ đếm riêng — vì vậy <code>a</code> lên 4 còn <code>b</code> là 1.</p>'],
  [5, 'What JavaScript keeps in memory',
    '<p>Picture a backpack. When a function is created it packs the variables around it and carries them wherever it goes. As long as anyone can still call the function, the backpack stays; when nobody can, the garbage collector frees it.</p>',
    '<p>Hãy hình dung một cái ba lô. Khi được tạo ra, hàm xếp các biến xung quanh vào ba lô và mang theo đi khắp nơi. Còn ai gọi được hàm thì ba lô còn; không còn ai gọi được thì bộ thu gom rác giải phóng nó.</p>'],
  [6, 'Private state',
    '<p>A plain object field can be overwritten by any line of code. Here <code>balance</code> lives only in the closure. Writing <code>acc.balance = 1000000</code> just adds a new, unrelated property — the real balance stays 150, and the only way to change it is <code>deposit</code>, which rejects negative amounts.</p>',
    '<p>Thuộc tính của object thường thì dòng code nào cũng ghi đè được. Ở đây <code>balance</code> chỉ sống trong closure. Viết <code>acc.balance = 1000000</code> chỉ thêm một thuộc tính mới chẳng liên quan — số dư thật vẫn 150, và đường duy nhất để đổi nó là <code>deposit</code>, hàm này từ chối số âm.</p>'],
  [7, 'Function factories',
    '<p>A function that returns a configured function. <code>multiplyBy(2)</code> bakes <code>factor = 2</code> into a new function. The formatter example also shows a performance benefit: the expensive <code>Intl.NumberFormat</code> object is created once and reused by every call.</p>',
    '<p>Một hàm trả về một hàm đã cấu hình sẵn. <code>multiplyBy(2)</code> "nướng" <code>factor = 2</code> vào một hàm mới. Ví dụ định dạng tiền còn cho thấy lợi ích hiệu năng: đối tượng <code>Intl.NumberFormat</code> tốn kém chỉ tạo một lần rồi mọi lần gọi dùng lại.</p>'],
  [8, 'Event handlers are closures',
    '<p>This is a real page run in Chromium. Every button gets its own handler, and each handler remembers its own <code>index</code> and its own <code>clicks</code>. Like was clicked twice and shows 2; Save shows 1. No global variables, no lookup table — the closure is the storage.</p>',
    '<p>Đây là trang thật chạy trong Chromium. Mỗi nút có handler riêng, mỗi handler nhớ <code>index</code> riêng và <code>clicks</code> riêng. Like được bấm hai lần nên hiện 2; Save hiện 1. Không biến toàn cục, không bảng tra — chính closure là chỗ lưu.</p>'],
  [9, 'The var-loop trap',
    '<p>With <code>var</code> there is a single <code>i</code> for the whole loop. The timers run after the loop has finished, so all three read 3. With <code>let</code>, each turn of the loop gets a fresh <code>j</code>, so the three timers print 0, 1, 2. This is why modern code never uses <code>var</code>.</p>',
    '<p>Với <code>var</code> chỉ có MỘT <code>i</code> cho cả vòng lặp. Hẹn giờ chạy sau khi vòng lặp xong, nên cả ba đọc ra 3. Với <code>let</code>, mỗi vòng có một <code>j</code> mới, nên ba hẹn giờ in 0, 1, 2. Đó là lý do code hiện đại không bao giờ dùng <code>var</code>.</p>'],
  [10, 'The variable, not the value',
    '<p>A closure does not copy the value; it keeps the variable. Change <code>price</code> later and the closure sees the new number. In React this appears as a stale value: a handler from an old render. The cure there is the updater form <code>setCount(c =&gt; c + 1)</code>.</p>',
    '<p>Closure không chép giá trị; nó giữ cái biến. Đổi <code>price</code> sau đó thì closure thấy số mới. Trong React chuyện này hiện ra thành "giá trị cũ": handler của một lần render cũ. Cách chữa là dạng cập nhật bằng hàm <code>setCount(c =&gt; c + 1)</code>.</p>'],
  [11, 'once and memoize',
    '<p>Two small helpers you will meet in real codebases. <code>once</code> remembers whether it already ran. <code>memoize</code> remembers results in a private Map: four calls, but the slow function ran only twice. Both are just a function plus a backpack.</p>',
    '<p>Hai hàm tiện ích nhỏ bạn sẽ gặp trong dự án thật. <code>once</code> nhớ mình đã chạy chưa. <code>memoize</code> nhớ kết quả trong một Map riêng: bốn lần gọi mà hàm chậm chỉ chạy hai lần. Cả hai chỉ là một hàm cộng một cái ba lô.</p>'],
  [12, 'Summary & practice',
    '<p>Remember five lines, then do the practice: a rate limiter is a closure with a counter inside. When a second limiter starts fresh, you have proved you understand that every call of the outer function creates new variables.</p>',
    '<p>Nhớ năm dòng, rồi làm bài luyện: bộ giới hạn lượt gọi là một closure có bộ đếm bên trong. Khi bộ giới hạn thứ hai bắt đầu lại từ đầu, bạn đã chứng minh mình hiểu rằng mỗi lần gọi hàm ngoài tạo ra những biến mới.</p>'],
]);

export default {
  title: '11.1 — Closure: a function that remembers|||11.1 — Closure: hàm nhớ được nơi nó sinh ra',
  slug: 'wf-11-1-closure',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Phạm vi (scope), closure là gì và vì sao biến không mất, state riêng tư, hàm sinh hàm, handler sự kiện, bẫy var trong vòng lặp, closure giữ BIẾN chứ không giữ giá trị, once/memoize — mọi ví dụ chạy thật trong Chromium.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>A closure is a function plus the variables it was born with</h2>
<p class="lead">After this lesson you can read any JavaScript function and say exactly which variables it can see, build state that no other code can overwrite, write functions that build functions, and explain — not just recite — why a <code>var</code> loop prints 3, 3, 3. This matters because every event handler, every <code>setTimeout</code> callback and every React hook you will ever write is a closure. If you have a model of how they work, a whole family of "it uses old data" bugs stops being mysterious.</p>

<h3>Step 0 — scope: which variables can a line of code see?</h3>
<p>A <strong>scope</strong> is a region of code where a variable exists. Every function creates a new scope; so does every block <code>{ … }</code> for <code>let</code> and <code>const</code>. The rule is short: code can look <strong>outward</strong> into the scopes that surround it, never <strong>inward</strong> into scopes nested inside it.</p>
${ma('javascript', CODE['11-1/scope.js'])}
${ra(OUT['11-1/scope'])}
<p>The inner function printed all three names. The outer function asked <code>typeof item</code> and got <code>undefined</code>: <code>item</code> exists only inside <code>inner</code>. The last line is the same story one level up. Notice what decided all of this — the position of the code in the file. That is why this kind of scope is called <strong>lexical scope</strong> ("lexical" = based on the text you wrote).</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Global scope</span><span class="lz-t">app</span><span class="lz-d">Visible to every function in the file.</span></div>
<div class="lz-layer"><span class="lz-k">outer()</span><span class="lz-t">user</span><span class="lz-d">Visible to outer and to everything written inside it.</span></div>
<div class="lz-layer"><span class="lz-k">inner()</span><span class="lz-t">item</span><span class="lz-d">Visible only inside inner. Looking up a name walks outward: inner → outer → global.</span></div>
</div>

<h3>Step 1 — a function that outlives the function that made it</h3>
<p>Now the surprising part. Normally, when a function finishes, its local variables are thrown away. But if the function <em>returns another function</em> that still uses those variables, JavaScript cannot throw them away — someone might still need them.</p>
${ma('javascript', CODE['11-1/counter.js'])}
${ra(OUT['11-1/counter'])}
<p><code>makeCounter</code> ran once and finished. Yet every call to <code>next()</code> still reads and updates <code>count</code>. There is no global <code>count</code> (<code>typeof count</code> is <code>undefined</code>), so the variable is reachable <strong>only</strong> through <code>next</code>. That combination — a function plus the variables it captured from where it was created — is the closure.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Call makeCounter()</span><span class="lz-d">A fresh scope is created with <code>count = 0</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Return the inner function</span><span class="lz-d">The inner function holds a reference to that scope — its "backpack".</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">makeCounter ends</span><span class="lz-d">Its scope is NOT freed, because the returned function still points at it.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Call next() later</span><span class="lz-d">It reads and changes the same <code>count</code>. Once nobody can call it any more, the garbage collector frees everything.</span></div>
</div>
<p>The last line of output shows the second rule: <strong>each call of the outer function creates new variables</strong>. <code>a</code> and <code>b</code> were made by two different calls, so they have two different <code>count</code> variables — <code>a</code> reached 4 while <code>b</code> is still 1. This is exactly why two <code>&lt;Counter /&gt;</code> components in React do not share a number.</p>

<h3>Use 1 — private state that nobody can cheat</h3>
<p>JavaScript objects are open: any code that holds the object can change any field. A closure gives you a variable that is physically unreachable from outside. The only way to touch it is through the functions you choose to return — and those functions can validate.</p>
${ma('javascript', CODE['11-1/account.js'])}
${ra(OUT['11-1/account'])}
<p>The plain object was set to a million with one line. The closure version still reports 150: <code>acc.balance = 1000000</code> did run, but it created a brand-new property on the returned object. The real <code>balance</code> variable lives in the backpack, where that line cannot reach. And <code>deposit(-5)</code> was rejected by our own check.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — thinking you changed the private value.</strong> <code>acc.balance = 1000000</code> throws no error and even reads back as a million (<code>acc.balance</code> → 1000000). Beginners conclude the closure "did not work". It worked: you are now looking at a different, public property that the code never uses. If a value must be private, never also expose a property with the same name — it only confuses readers. (Classes have a dedicated syntax for this, <code>#balance</code>, in lesson 11.3.)</p></div>

<h3>Use 2 — function factories</h3>
<p>A <strong>factory</strong> is a function that builds and returns a configured function. The configuration is captured once; the returned function uses it on every call.</p>
${ma('javascript', CODE['11-1/factory.js'])}
${ra(OUT['11-1/factory'])}
<p><code>double</code> and <code>triple</code> are two closures over two different <code>factor</code> values. The second example adds a performance reason: building an <code>Intl.NumberFormat</code> is relatively expensive, so the factory builds it once and the returned function reuses it. Notice the real output — Vietnamese dong is written <code>125.000 ₫</code> (dot for thousands), US dollars <code>$19.50</code>.</p>

<h3>Use 3 — the closures you already wrote: event handlers</h3>
<p>Every time you pass a function to <code>addEventListener</code>, <code>setTimeout</code>, <code>fetch(...).then</code> or <code>array.map</code>, you create a closure. Here is a real page, opened in Chromium; the script clicks Like twice and Save once, like a user would.</p>
${ma('html', CODE['11-1/buttons.html'], [14, 31])}
${ra(OUT['11-1/buttons'])}
<p>One loop creates three handlers. Each one captured <em>its own</em> <code>btn</code>, <code>index</code> and <code>clicks</code>, because <code>forEach</code> calls the arrow function three times and each call makes a fresh scope. No global counter, no array of counts — the closures are the storage. (The screenshot of this page is on slide 8.)</p>

<h3>The classic trap: <code>var</code> in a loop</h3>
${ma('javascript', CODE['11-1/var-let.js'])}
${ra(OUT['11-1/var-let'])}
<p>Why 3, 3, 3? <code>var</code> is scoped to the whole function (here, the whole script), so there is exactly <strong>one</strong> <code>i</code>. The loop runs to completion first — <code>i</code> ends at 3 — and only then do the timers fire. All three closures captured the same single variable, and they all read it after it became 3.</p>
<p><code>let</code> is scoped to the block, and a <code>for</code> loop with <code>let</code> creates a <strong>new binding for every iteration</strong>. Three iterations, three different <code>j</code> variables, three closures each holding its own. Hence 0, 1, 2.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>var</code> survives in old tutorials and Stack Overflow answers.</strong> Copy-pasting a loop that uses <code>var</code> into code with callbacks gives you the 3, 3, 3 bug silently: no error, just wrong data — for example every "Delete" button deleting the last row. Rule for this course and for real projects: write <code>const</code> by default, <code>let</code> when you must reassign, and never <code>var</code>. A linter rule (<code>no-var</code>) can enforce it.</p></div>

<h3>A closure holds the variable, not a snapshot of the value</h3>
${ma('javascript', CODE['11-1/variable-not-value.js'])}
${ra(OUT['11-1/variable-not-value'])}
<p><code>showPrice</code> was created when <code>price</code> was 100, but it printed 200 the second time: it holds the <em>variable</em>, so it always reads the current value. If you want to freeze a value, put it into a new variable at that moment — passing it as an argument does exactly that (<code>snapshot(price)</code> captured 200, and later changes to <code>price</code> did not affect it).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — the stale value in React.</strong> In React the opposite happens: each render is a new function call, so a handler created during render 1 captured render 1's <code>count</code> — a separate variable that never changes. Calling <code>setCount(count + 1)</code> three times inside one handler therefore adds only 1. The fix is the updater form <code>setCount(c =&gt; c + 1)</code>, which asks React for the latest value instead of trusting the captured one. You will meet this again in the React course (lesson on infinite loops and stale closures).</p></div>

<h3>Two helpers built from closures: <code>once</code> and <code>memoize</code></h3>
${ma('javascript', CODE['11-1/once-memo.js'])}
${ra(OUT['11-1/once-memo'])}
<p><code>once</code> keeps <code>done</code> and <code>result</code> in its backpack, so "connecting..." printed a single time although we called <code>init</code> three times. <code>memoize</code> keeps a private <code>Map</code> of answers: four calls, but <code>slowSquare</code> really ran only twice (for 9 and for 4). Both helpers are a dozen lines because the closure does the remembering for free.</p>

<h3>When is a closure the right tool?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hide a value</span><span class="v">State that must change only through rules you control (a balance, a counter, a cache).</span></div>
  <div class="kv"><span class="k">Configure once, call many times</span><span class="v">Factories: <code>multiplyBy(2)</code>, a formatter, a pre-filled API client <code>makeClient(baseUrl)</code>.</span></div>
  <div class="kv"><span class="k">Remember context for later</span><span class="v">Event handlers, timers, promise callbacks — they run later but need data from now.</span></div>
  <div class="kv"><span class="k">Not the right tool</span><span class="v">When many objects of the same kind need methods — a class (lesson 11.3) shares one copy of each method instead of creating new functions per object.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — closures keep big data alive.</strong> A closure keeps <em>every</em> variable it references alive for as long as the function lives. An event listener on <code>window</code> that mentions a 50&nbsp;MB array keeps that array in memory until the listener is removed. In single-page apps this is a common memory leak: always remove listeners and clear intervals when a component goes away (React's effect cleanup exists for exactly this).</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (15 minutes)</strong></p>
<p>Write <code>makeRateLimiter(limit)</code>. It returns a function; each call of that function returns <code>true</code> while fewer than <code>limit</code> calls have been allowed, and <code>false</code> after that. Then add a second method: make the factory return an object <code>{ tryCall, remaining }</code> where <code>remaining()</code> says how many calls are left.</p>
<p>Hint: the counter belongs in the factory's scope, not in a global variable and not on the returned object.</p>
<p><strong>Done when:</strong> in the browser console, <code>const l = makeRateLimiter(2)</code> then <code>l.tryCall()</code> three times prints <code>true</code>, <code>true</code>, <code>false</code>; <code>l.remaining()</code> prints <code>0</code>; a second limiter created afterwards starts again at <code>true</code>; and <code>l.count = 99</code> changes nothing. The same exercise, auto-graded, is in Code Lab module 11.1.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">scope</span><span class="v">phạm vi — vùng code nơi một biến tồn tại và nhìn thấy được.</span></div>
  <div class="kv"><span class="k">lexical scope</span><span class="v">phạm vi từ vựng — phạm vi quyết định bởi VỊ TRÍ code được viết.</span></div>
  <div class="kv"><span class="k">closure</span><span class="v">bao đóng — hàm cộng các biến nó bắt giữ từ nơi nó được tạo.</span></div>
  <div class="kv"><span class="k">capture</span><span class="v">bắt giữ — closure giữ đường dẫn tới biến bên ngoài.</span></div>
  <div class="kv"><span class="k">factory function</span><span class="v">hàm nhà máy — hàm trả về một hàm/đối tượng đã cấu hình.</span></div>
  <div class="kv"><span class="k">stale value / stale closure</span><span class="v">giá trị cũ — closure đọc biến của một lần chạy đã qua.</span></div>
  <div class="kv"><span class="k">memoize</span><span class="v">ghi nhớ kết quả — lưu kết quả theo đầu vào để không tính lại.</span></div>
  <div class="kv"><span class="k">garbage collector</span><span class="v">bộ thu gom rác — phần của engine tự giải phóng bộ nhớ không ai với tới.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Scope is decided by <strong>where code is written</strong>: look outward, never inward.</li>
  <li>A function returned from another function keeps the outer variables alive — that is a closure.</li>
  <li>Every call of the outer function creates <strong>new</strong> variables, so closures from two calls never share state.</li>
  <li>Closures give you private state, factories, and the memory behind every callback.</li>
  <li><code>var</code> has one variable per function; <code>let</code> has one per loop iteration — never use <code>var</code>.</li>
  <li>A closure holds the <strong>variable</strong>, not a copy of its value — the root of stale-value bugs.</li>
</ul>
${nguon('📘', 'javascript.info — Variable scope, closure', 'Lexical environments explained step by step, with exercises', 'https://javascript.info/closure')}
${nguon('📗', 'MDN — Closures', 'The reference page, including closures in loops and performance notes', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures')}
${lienKet({ khoa: 'react', bai: 'rx-4-3-vong-lap', title: 'React 4.3 — infinite loops and stale closures', sub: 'The same "captures the variable" rule inside useEffect and event handlers', cta: 'Open lesson' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-2-ham-closure-this', title: 'Node.js 1.2 — functions, closure and this', sub: 'Closures in server code: middleware factories and configuration', cta: 'Open lesson' })}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-2-1-es6-basics', title: 'FER202 (Academy) — ES6 basics', sub: 'let/const and arrow functions as the FER202 syllabus teaches them', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Closure là một hàm cộng với những biến nó sinh ra cùng</h2>
<p class="lead">Học xong bài này bạn đọc được bất kỳ hàm JavaScript nào và nói chính xác nó nhìn thấy những biến nào, tạo được state mà không đoạn code nào khác ghi đè được, viết được hàm sinh ra hàm, và giải thích — chứ không học thuộc — vì sao vòng lặp <code>var</code> in ra 3, 3, 3. Điều này quan trọng vì mọi handler sự kiện, mọi callback của <code>setTimeout</code> và mọi hook React bạn sẽ viết đều là closure. Có mô hình trong đầu về cách chúng chạy thì cả một họ bug "nó dùng dữ liệu cũ" hết còn bí ẩn.</p>

<h3>Bước 0 — phạm vi: một dòng code nhìn thấy những biến nào?</h3>
<p><strong>Phạm vi (scope)</strong> là một vùng code nơi một biến tồn tại. Mỗi hàm tạo một phạm vi mới; mỗi khối <code>{ … }</code> cũng vậy đối với <code>let</code> và <code>const</code>. Luật rất ngắn: code nhìn được <strong>ra ngoài</strong> vào các phạm vi bao quanh nó, không bao giờ nhìn <strong>vào trong</strong> các phạm vi lồng bên trong.</p>
${ma('javascript', CODE['11-1/scope.js'])}
${ra(OUT['11-1/scope'])}
<p>Hàm trong in được cả ba tên. Hàm ngoài hỏi <code>typeof item</code> và nhận <code>undefined</code>: <code>item</code> chỉ tồn tại trong <code>inner</code>. Dòng cuối là cùng câu chuyện ở tầng trên. Để ý thứ quyết định tất cả: vị trí của code trong file. Vì vậy loại phạm vi này gọi là <strong>lexical scope (phạm vi từ vựng)</strong> — "từ vựng" nghĩa là dựa trên chữ bạn đã viết.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Phạm vi toàn cục</span><span class="lz-t">app</span><span class="lz-d">Mọi hàm trong file đều thấy.</span></div>
<div class="lz-layer"><span class="lz-k">outer()</span><span class="lz-t">user</span><span class="lz-d">outer và mọi thứ viết bên trong nó thấy.</span></div>
<div class="lz-layer"><span class="lz-k">inner()</span><span class="lz-t">item</span><span class="lz-d">Chỉ inner thấy. Tra một cái tên là đi dần ra ngoài: inner → outer → toàn cục.</span></div>
</div>

<h3>Bước 1 — một hàm sống lâu hơn hàm đã sinh ra nó</h3>
<p>Giờ tới phần bất ngờ. Bình thường khi một hàm chạy xong, biến cục bộ của nó bị vứt đi. Nhưng nếu hàm đó <em>trả về một hàm khác</em> vẫn dùng những biến ấy, JavaScript không thể vứt chúng — có thể vẫn còn người cần.</p>
${ma('javascript', CODE['11-1/counter.js'])}
${ra(OUT['11-1/counter'])}
<p><code>makeCounter</code> chạy một lần rồi xong. Vậy mà mỗi lần gọi <code>next()</code> vẫn đọc và cập nhật <code>count</code>. Không có <code>count</code> toàn cục nào (<code>typeof count</code> là <code>undefined</code>), nên biến này <strong>chỉ</strong> với tới được qua <code>next</code>. Sự kết hợp ấy — một hàm cộng các biến nó bắt giữ từ nơi nó được tạo — chính là closure.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Gọi makeCounter()</span><span class="lz-d">Một phạm vi mới được tạo với <code>count = 0</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Trả về hàm trong</span><span class="lz-d">Hàm trong giữ tham chiếu tới phạm vi đó — "cái ba lô" của nó.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">makeCounter kết thúc</span><span class="lz-d">Phạm vi của nó KHÔNG bị giải phóng, vì hàm được trả về vẫn trỏ tới.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Gọi next() về sau</span><span class="lz-d">Nó đọc và sửa đúng cái <code>count</code> ấy. Khi không còn ai gọi được nữa, bộ thu gom rác giải phóng tất cả.</span></div>
</div>
<p>Dòng output cuối cho thấy luật thứ hai: <strong>mỗi lần gọi hàm ngoài tạo ra những biến mới</strong>. <code>a</code> và <code>b</code> được tạo bởi hai lần gọi khác nhau, nên có hai biến <code>count</code> khác nhau — <code>a</code> lên tới 4 trong khi <code>b</code> vẫn là 1. Đó chính là lý do hai component <code>&lt;Counter /&gt;</code> trong React không dùng chung một con số.</p>

<h3>Công dụng 1 — state riêng tư không ai gian lận được</h3>
<p>Object JavaScript là "mở": đoạn code nào cầm object cũng sửa được mọi thuộc tính. Closure cho bạn một biến mà bên ngoài về mặt vật lý không với tới được. Cách duy nhất để chạm vào nó là qua những hàm bạn chọn trả về — và những hàm ấy kiểm tra được dữ liệu.</p>
${ma('javascript', CODE['11-1/account.js'])}
${ra(OUT['11-1/account'])}
<p>Object thường bị đặt thành một triệu chỉ bằng một dòng. Bản closure vẫn báo 150: <code>acc.balance = 1000000</code> có chạy, nhưng nó tạo ra một thuộc tính hoàn toàn mới trên object được trả về. Biến <code>balance</code> thật nằm trong ba lô, nơi dòng đó không với tới. Còn <code>deposit(-5)</code> bị chính phép kiểm của ta từ chối.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tưởng mình đã đổi được giá trị riêng tư.</strong> <code>acc.balance = 1000000</code> không báo lỗi, đọc lại còn ra một triệu (<code>acc.balance</code> → 1000000). Người mới kết luận "closure không chạy". Nó chạy đúng: bạn đang nhìn một thuộc tính công khai KHÁC mà code không bao giờ dùng. Giá trị đã riêng tư thì đừng phơi thêm một thuộc tính cùng tên — chỉ làm người đọc rối. (Class có cú pháp riêng cho việc này, <code>#balance</code>, ở bài 11.3.)</p></div>

<h3>Công dụng 2 — hàm nhà máy (factory)</h3>
<p><strong>Factory</strong> là hàm dựng rồi trả về một hàm đã được cấu hình. Cấu hình được bắt giữ một lần; hàm trả về dùng nó ở mọi lần gọi.</p>
${ma('javascript', CODE['11-1/factory.js'])}
${ra(OUT['11-1/factory'])}
<p><code>double</code> và <code>triple</code> là hai closure trên hai giá trị <code>factor</code> khác nhau. Ví dụ thứ hai thêm lý do hiệu năng: tạo một <code>Intl.NumberFormat</code> khá tốn kém, nên factory tạo nó một lần và hàm trả về dùng lại. Để ý output thật — tiền đồng viết <code>125.000 ₫</code> (dấu chấm ngăn nghìn), đô la Mỹ viết <code>$19.50</code>.</p>

<h3>Công dụng 3 — những closure bạn đã viết: handler sự kiện</h3>
<p>Mỗi lần bạn đưa một hàm cho <code>addEventListener</code>, <code>setTimeout</code>, <code>fetch(...).then</code> hay <code>array.map</code>, bạn tạo một closure. Đây là một trang thật mở trong Chromium; script tự bấm Like hai lần và Save một lần như người dùng.</p>
${ma('html', CODE['11-1/buttons.html'], [14, 31])}
${ra(OUT['11-1/buttons'])}
<p>Một vòng lặp tạo ba handler. Mỗi handler bắt giữ <em>riêng</em> <code>btn</code>, <code>index</code> và <code>clicks</code> của nó, vì <code>forEach</code> gọi hàm mũi tên ba lần và mỗi lần gọi tạo một phạm vi mới. Không bộ đếm toàn cục, không mảng đếm — chính closure là chỗ lưu. (Ảnh chụp trang này ở slide 8.)</p>

<h3>Bẫy kinh điển: <code>var</code> trong vòng lặp</h3>
${ma('javascript', CODE['11-1/var-let.js'])}
${ra(OUT['11-1/var-let'])}
<p>Vì sao 3, 3, 3? <code>var</code> có phạm vi cả hàm (ở đây là cả script), nên chỉ có đúng <strong>một</strong> <code>i</code>. Vòng lặp chạy hết trước — <code>i</code> dừng ở 3 — rồi hẹn giờ mới chạy. Cả ba closure bắt giữ cùng một biến duy nhất, và đều đọc nó sau khi nó đã thành 3.</p>
<p><code>let</code> có phạm vi khối, và vòng <code>for</code> dùng <code>let</code> tạo <strong>một biến mới cho mỗi vòng</strong>. Ba vòng, ba biến <code>j</code> khác nhau, ba closure mỗi cái giữ biến riêng. Vì vậy ra 0, 1, 2.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>var</code> còn sống trong tutorial cũ và câu trả lời Stack Overflow.</strong> Chép một vòng lặp dùng <code>var</code> vào code có callback là dính bug 3, 3, 3 trong im lặng: không lỗi, chỉ sai dữ liệu — ví dụ mọi nút "Xoá" đều xoá dòng cuối. Luật cho khoá này và cho dự án thật: mặc định viết <code>const</code>, phải gán lại thì <code>let</code>, không bao giờ <code>var</code>. Một luật linter (<code>no-var</code>) cưỡng chế được việc này.</p></div>

<h3>Closure giữ CÁI BIẾN, không giữ bản chụp giá trị</h3>
${ma('javascript', CODE['11-1/variable-not-value.js'])}
${ra(OUT['11-1/variable-not-value'])}
<p><code>showPrice</code> được tạo lúc <code>price</code> là 100, nhưng lần thứ hai nó in 200: nó giữ <em>biến</em>, nên luôn đọc giá trị hiện tại. Muốn đóng băng một giá trị thì đưa nó vào một biến mới ngay lúc đó — truyền làm đối số chính là làm vậy (<code>snapshot(price)</code> bắt giữ 200, và các lần đổi <code>price</code> sau không ảnh hưởng).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — giá trị cũ trong React.</strong> Trong React điều ngược lại xảy ra: mỗi lần render là một lần gọi hàm mới, nên handler tạo ở lần render 1 bắt giữ <code>count</code> của lần render 1 — một biến riêng không bao giờ đổi. Vì vậy gọi <code>setCount(count + 1)</code> ba lần trong một handler chỉ cộng được 1. Cách sửa là dạng cập nhật bằng hàm <code>setCount(c =&gt; c + 1)</code>: nó hỏi React giá trị mới nhất thay vì tin giá trị đã bắt giữ. Bạn sẽ gặp lại chuyện này ở khoá React (bài vòng lặp vô hạn và closure cũ).</p></div>

<h3>Hai hàm tiện ích dựng từ closure: <code>once</code> và <code>memoize</code></h3>
${ma('javascript', CODE['11-1/once-memo.js'])}
${ra(OUT['11-1/once-memo'])}
<p><code>once</code> giữ <code>done</code> và <code>result</code> trong ba lô, nên "connecting..." chỉ in một lần dù ta gọi <code>init</code> ba lần. <code>memoize</code> giữ một <code>Map</code> đáp án riêng: bốn lần gọi mà <code>slowSquare</code> thật sự chỉ chạy hai lần (cho 9 và cho 4). Cả hai chỉ chục dòng vì closure làm hộ việc ghi nhớ.</p>

<h3>Khi nào closure là công cụ đúng?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Giấu một giá trị</span><span class="v">State chỉ được đổi theo luật bạn kiểm soát (số dư, bộ đếm, bộ nhớ đệm).</span></div>
  <div class="kv"><span class="k">Cấu hình một lần, gọi nhiều lần</span><span class="v">Factory: <code>multiplyBy(2)</code>, bộ định dạng, client API điền sẵn <code>makeClient(baseUrl)</code>.</span></div>
  <div class="kv"><span class="k">Nhớ bối cảnh để dùng sau</span><span class="v">Handler sự kiện, hẹn giờ, callback của promise — chạy sau nhưng cần dữ liệu của bây giờ.</span></div>
  <div class="kv"><span class="k">Không phải công cụ đúng</span><span class="v">Khi nhiều object cùng loại cần method — class (bài 11.3) dùng chung một bản mỗi method thay vì tạo hàm mới cho từng object.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — closure giữ dữ liệu lớn sống mãi.</strong> Closure giữ sống <em>mọi</em> biến nó nhắc tới chừng nào hàm còn sống. Một listener trên <code>window</code> có nhắc tới một mảng 50&nbsp;MB thì mảng đó nằm trong bộ nhớ tới khi listener bị gỡ. Trong ứng dụng một trang đây là kiểu rò rỉ bộ nhớ hay gặp: luôn gỡ listener và xoá interval khi component biến mất (phần cleanup của effect trong React sinh ra đúng vì việc này).</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (15 phút)</strong></p>
<p>Viết <code>makeRateLimiter(limit)</code>. Nó trả về một hàm; mỗi lần gọi hàm đó trả <code>true</code> khi số lần đã cho phép còn ít hơn <code>limit</code>, sau đó trả <code>false</code>. Rồi nâng cấp: cho factory trả về object <code>{ tryCall, remaining }</code>, trong đó <code>remaining()</code> cho biết còn bao nhiêu lượt.</p>
<p>Gợi ý: bộ đếm thuộc về phạm vi của factory — không phải biến toàn cục, cũng không phải thuộc tính trên object trả về.</p>
<p><strong>Xong khi:</strong> trong Console của trình duyệt, <code>const l = makeRateLimiter(2)</code> rồi gọi <code>l.tryCall()</code> ba lần in <code>true</code>, <code>true</code>, <code>false</code>; <code>l.remaining()</code> in <code>0</code>; một bộ giới hạn thứ hai tạo sau đó bắt đầu lại bằng <code>true</code>; và <code>l.count = 99</code> không đổi được gì. Bài y hệt, có máy chấm, nằm trong Code Lab module 11.1.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">scope</span><span class="v">phạm vi — vùng code nơi một biến tồn tại và nhìn thấy được.</span></div>
  <div class="kv"><span class="k">lexical scope</span><span class="v">phạm vi từ vựng — phạm vi quyết định bởi VỊ TRÍ code được viết.</span></div>
  <div class="kv"><span class="k">closure</span><span class="v">bao đóng — hàm cộng các biến nó bắt giữ từ nơi nó được tạo.</span></div>
  <div class="kv"><span class="k">capture</span><span class="v">bắt giữ — closure giữ đường dẫn tới biến bên ngoài.</span></div>
  <div class="kv"><span class="k">factory function</span><span class="v">hàm nhà máy — hàm trả về một hàm/đối tượng đã cấu hình.</span></div>
  <div class="kv"><span class="k">stale value / stale closure</span><span class="v">giá trị cũ — closure đọc biến của một lần chạy đã qua.</span></div>
  <div class="kv"><span class="k">memoize</span><span class="v">ghi nhớ kết quả — lưu kết quả theo đầu vào để không tính lại.</span></div>
  <div class="kv"><span class="k">garbage collector</span><span class="v">bộ thu gom rác — phần của engine tự giải phóng bộ nhớ không ai với tới.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Phạm vi do <strong>vị trí viết code</strong> quyết định: nhìn ra ngoài, không bao giờ nhìn vào trong.</li>
  <li>Hàm được trả về từ một hàm khác giữ sống các biến bên ngoài — đó là closure.</li>
  <li>Mỗi lần gọi hàm ngoài tạo ra biến <strong>mới</strong>, nên closure từ hai lần gọi không bao giờ dùng chung state.</li>
  <li>Closure cho bạn state riêng tư, factory, và là bộ nhớ đằng sau mọi callback.</li>
  <li><code>var</code> có một biến cho cả hàm; <code>let</code> có một biến cho mỗi vòng lặp — đừng bao giờ dùng <code>var</code>.</li>
  <li>Closure giữ <strong>cái biến</strong>, không giữ bản sao giá trị — gốc rễ của bug "giá trị cũ".</li>
</ul>
${nguon('📘', 'javascript.info — Variable scope, closure', 'Lexical environment giải thích từng bước, có bài tập', 'https://javascript.info/closure')}
${nguon('📗', 'MDN — Closures', 'Trang tham chiếu, gồm closure trong vòng lặp và ghi chú hiệu năng', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures')}
${lienKet({ khoa: 'react', bai: 'rx-4-3-vong-lap', title: 'React 4.3 — vòng lặp vô hạn và closure cũ', sub: 'Cùng luật "giữ cái biến" bên trong useEffect và handler sự kiện', cta: 'Mở bài' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-2-ham-closure-this', title: 'Node.js 1.2 — hàm, closure và this', sub: 'Closure trong code máy chủ: factory cho middleware và cấu hình', cta: 'Mở bài' })}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-2-1-es6-basics', title: 'FER202 (Academy) — ES6 cơ bản', sub: 'let/const và hàm mũi tên theo đúng giáo trình FER202', cta: 'Mở bài' })}
</div>
`,
};
