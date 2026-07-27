/**
 * Node.js — Chương 1: JavaScript nền tảng cho backend.
 * MỌI output trong bài đều lấy từ việc chạy thật trên Node v22.21.0.
 * Nhắc: backtick trong nội dung = &#96; ; mọi `${` trong code mẫu = \${ .
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 1 — The JavaScript a backend developer needs|||Chương 1 — JavaScript nền tảng cho backend',
  description: 'Đúng những phần JavaScript mà code backend dùng hằng ngày: phạm vi biến, closure, this, tham chiếu, bất đồng bộ và module.',
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — Variables & scope: var, let, const|||1.1 — Biến & phạm vi: var, let, const',
      slug: 'nodejs-1-1-bien-pham-vi',
      type: 'VIDEO',
      description: 'Vì sao var bị khai tử trong code hiện đại, TDZ là gì, và const KHÔNG có nghĩa là bất biến.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Variables &amp; scope</h2>
<p class="lead">Three ways to declare a variable, but modern backend code uses two. Understanding <em>why</em> <code>var</code> was retired is not history trivia — the bug it causes shows up the first time you put a database call inside a loop.</p>

<h3>The classic loop trap</h3>
<p>Run this and predict the output before you look:</p>
<pre><code><span class="tok-keyword">for</span> (<span class="tok-keyword">var</span> i = <span class="tok-number">0</span>; i &lt; <span class="tok-number">3</span>; i++) { <span class="tok-function">setTimeout</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'var  i ='</span>, i), <span class="tok-number">0</span>); }
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> j = <span class="tok-number">0</span>; j &lt; <span class="tok-number">3</span>; j++) { <span class="tok-function">setTimeout</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'let  j ='</span>, j), <span class="tok-number">0</span>); }</code></pre>
<div class="out">var  i = 3
var  i = 3
var  i = 3
let  j = 0
let  j = 1
let  j = 2</div>
<p>With <code>var</code> there is <strong>one single variable</strong> shared by all three callbacks. By the time the callbacks run, the loop has finished and <code>i</code> is 3 — so all three print 3. With <code>let</code>, each iteration gets its <strong>own binding</strong>, which is what you almost always mean.</p>
<div class="pitfall">This is not an academic example. Replace <code>setTimeout</code> with "save this row to the database" and you get three writes that all reference the last item of the list. It is one of the most common bugs in beginner Node code, and it is silent — nothing crashes, the data is just wrong.</div>

<h3>Hoisting and the Temporal Dead Zone</h3>
<p><code>var</code> declarations are hoisted and pre-initialised to <code>undefined</code>. <code>let</code> and <code>const</code> are hoisted too, but stay in a <strong>Temporal Dead Zone</strong> (TDZ) until the declaration line runs — touching them there throws:</p>
<pre><code><span class="tok-function">console.log</span>(<span class="tok-string">'var before declaration:'</span>, <span class="tok-keyword">typeof</span> a, a);
<span class="tok-keyword">var</span> a = <span class="tok-number">1</span>;

<span class="tok-keyword">try</span> { <span class="tok-function">console.log</span>(b); <span class="tok-keyword">let</span> b = <span class="tok-number">2</span>; }
<span class="tok-keyword">catch</span> (e) { <span class="tok-function">console.log</span>(<span class="tok-string">'let before declaration:'</span>, e.constructor.name + <span class="tok-string">':'</span>, e.message); }</code></pre>
<div class="out">var before declaration: undefined undefined
let before declaration: ReferenceError: Cannot access 'b' before initialization</div>
<p>The TDZ error is a <em>feature</em>: it turns "I used this variable before I defined it" from a silent <code>undefined</code> into a loud crash pointing at the exact line.</p>

<h3>const does not mean immutable</h3>
<p>This trips up almost everyone. <code>const</code> freezes the <strong>binding</strong>, not the value. You cannot reassign the variable, but you can still mutate the object it points to:</p>
<pre><code><span class="tok-keyword">const</span> user = { name: <span class="tok-string">'An'</span> };
user.name = <span class="tok-string">'Bình'</span>;                <span class="tok-comment">// allowed — we mutated the object</span>
<span class="tok-function">console.log</span>(<span class="tok-string">'mutate property:'</span>, user);

<span class="tok-keyword">try</span> { user = {}; }                <span class="tok-comment">// NOT allowed — reassigning the binding</span>
<span class="tok-keyword">catch</span> (e) { <span class="tok-function">console.log</span>(<span class="tok-string">'reassign  :'</span>, e.constructor.name + <span class="tok-string">':'</span>, e.message); }

<span class="tok-keyword">const</span> frozen = Object.<span class="tok-function">freeze</span>({ name: <span class="tok-string">'An'</span> });
frozen.name = <span class="tok-string">'Bình'</span>;              <span class="tok-comment">// silently ignored (non-strict)</span>
<span class="tok-function">console.log</span>(<span class="tok-string">'after freeze:'</span>, frozen);</code></pre>
<div class="out">mutate property: { name: 'Bình' }
reassign  : TypeError: Assignment to constant variable.
after freeze: { name: 'An' }</div>
<div class="callout warn"><code>Object.freeze</code> is <strong>shallow</strong> — it protects the top level only. <code>Object.freeze({a:{b:1}})</code> still lets you change <code>a.b</code>. And in non-strict code the failed write is silent, which is worse than an error.</div>

<h3>The rule to follow</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">const by default</span><span class="v">Start every declaration as const. It documents "this never gets reassigned" for the next reader — usually you, in three months.</span></div>
  <div class="kv"><span class="k">let when you must</span><span class="v">Counters, accumulators, values assigned inside an if/else.</span></div>
  <div class="kv"><span class="k">var never</span><span class="v">There is no case in new code where var is the right answer.</span></div>
</div>
<div class="note-ct">Every service file on this site declares with <code>const</code> first; ESLint is configured to flag a <code>let</code> that is never reassigned. It sounds pedantic until you are reading an unfamiliar 300-line file and can tell at a glance which values move and which don't.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-318" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 318 — JavaScript Foundations for Node.js</span><span class="lc-sub">Practise scope, closures and async on 10 graded exercises.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Biến &amp; phạm vi</h2>
<p class="lead">Có ba cách khai báo biến, nhưng code backend hiện đại chỉ dùng hai. Hiểu <em>vì sao</em> <code>var</code> bị khai tử không phải chuyện lịch sử cho vui — con bug nó gây ra sẽ xuất hiện ngay lần đầu bạn đặt một lệnh gọi cơ sở dữ liệu vào trong vòng lặp.</p>

<h3>Cái bẫy kinh điển trong vòng lặp</h3>
<p>Chạy đoạn này và tự đoán kết quả trước khi nhìn xuống:</p>
<pre><code><span class="tok-keyword">for</span> (<span class="tok-keyword">var</span> i = <span class="tok-number">0</span>; i &lt; <span class="tok-number">3</span>; i++) { <span class="tok-function">setTimeout</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'var  i ='</span>, i), <span class="tok-number">0</span>); }
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> j = <span class="tok-number">0</span>; j &lt; <span class="tok-number">3</span>; j++) { <span class="tok-function">setTimeout</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'let  j ='</span>, j), <span class="tok-number">0</span>); }</code></pre>
<div class="out">var  i = 3
var  i = 3
var  i = 3
let  j = 0
let  j = 1
let  j = 2</div>
<p>Với <code>var</code>, cả ba callback dùng chung <strong>một biến duy nhất</strong>. Tới lúc callback chạy thì vòng lặp đã xong và <code>i</code> bằng 3 — nên cả ba đều in 3. Với <code>let</code>, mỗi vòng lặp có <strong>ràng buộc riêng</strong>, và đó gần như luôn là ý bạn muốn.</p>
<div class="pitfall">Đây không phải ví dụ lý thuyết. Thay <code>setTimeout</code> bằng "lưu bản ghi này xuống cơ sở dữ liệu", bạn được ba lần ghi mà cả ba đều trỏ vào phần tử CUỐI của danh sách. Đó là một trong những bug phổ biến nhất của người mới viết Node, và nó <em>im lặng</em> — không có gì sập, chỉ là dữ liệu sai.</div>

<h3>Hoisting và Vùng chết tạm thời (TDZ)</h3>
<p>Khai báo bằng <code>var</code> được kéo lên đầu và gán sẵn <code>undefined</code>. <code>let</code> và <code>const</code> cũng được kéo lên, nhưng nằm trong <strong>Vùng chết tạm thời</strong> (Temporal Dead Zone) cho tới khi dòng khai báo thực sự chạy — chạm vào đó là ném lỗi:</p>
<pre><code><span class="tok-function">console.log</span>(<span class="tok-string">'var trước khai báo:'</span>, <span class="tok-keyword">typeof</span> a, a);
<span class="tok-keyword">var</span> a = <span class="tok-number">1</span>;

<span class="tok-keyword">try</span> { <span class="tok-function">console.log</span>(b); <span class="tok-keyword">let</span> b = <span class="tok-number">2</span>; }
<span class="tok-keyword">catch</span> (e) { <span class="tok-function">console.log</span>(<span class="tok-string">'let trước khai báo:'</span>, e.constructor.name + <span class="tok-string">':'</span>, e.message); }</code></pre>
<div class="out">var trước khai báo: undefined undefined
let trước khai báo: ReferenceError: Cannot access 'b' before initialization</div>
<p>Lỗi TDZ thực ra là một <em>tính năng</em>: nó biến chuyện "tôi lỡ dùng biến trước khi định nghĩa" từ một giá trị <code>undefined</code> âm thầm thành một tiếng nổ to, chỉ thẳng vào đúng dòng gây lỗi.</p>

<h3>const KHÔNG có nghĩa là bất biến</h3>
<p>Chỗ này gần như ai cũng vấp. <code>const</code> khoá cái <strong>ràng buộc</strong>, không khoá giá trị. Bạn không gán lại biến được, nhưng vẫn sửa được nội dung object mà nó trỏ tới:</p>
<pre><code><span class="tok-keyword">const</span> user = { name: <span class="tok-string">'An'</span> };
user.name = <span class="tok-string">'Bình'</span>;                <span class="tok-comment">// được — ta sửa nội dung object</span>
<span class="tok-function">console.log</span>(<span class="tok-string">'sửa thuộc tính:'</span>, user);

<span class="tok-keyword">try</span> { user = {}; }                <span class="tok-comment">// KHÔNG được — gán lại ràng buộc</span>
<span class="tok-keyword">catch</span> (e) { <span class="tok-function">console.log</span>(<span class="tok-string">'gán lại  :'</span>, e.constructor.name + <span class="tok-string">':'</span>, e.message); }

<span class="tok-keyword">const</span> frozen = Object.<span class="tok-function">freeze</span>({ name: <span class="tok-string">'An'</span> });
frozen.name = <span class="tok-string">'Bình'</span>;              <span class="tok-comment">// bị bỏ qua âm thầm (không strict)</span>
<span class="tok-function">console.log</span>(<span class="tok-string">'sau freeze:'</span>, frozen);</code></pre>
<div class="out">sửa thuộc tính: { name: 'Bình' }
gán lại  : TypeError: Assignment to constant variable.
sau freeze: { name: 'An' }</div>
<div class="callout warn"><code>Object.freeze</code> chỉ đóng băng <strong>một tầng</strong> — nó bảo vệ tầng ngoài cùng thôi. <code>Object.freeze({a:{b:1}})</code> vẫn cho bạn đổi <code>a.b</code>. Và ở chế độ không strict, lần ghi thất bại đó im lặng — còn tệ hơn cả báo lỗi.</div>

<h3>Nguyên tắc nên theo</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mặc định const</span><span class="v">Cứ khai báo bằng const trước. Nó nói với người đọc sau — thường là chính bạn ba tháng nữa — rằng "giá trị này không bị gán lại".</span></div>
  <div class="kv"><span class="k">let khi buộc phải</span><span class="v">Biến đếm, biến tích luỹ, giá trị được gán bên trong if/else.</span></div>
  <div class="kv"><span class="k">var thì không bao giờ</span><span class="v">Trong code mới, không có tình huống nào var là câu trả lời đúng.</span></div>
</div>
<div class="note-ct">Mọi file service của website này đều khai báo <code>const</code> trước; ESLint được cấu hình để cảnh báo khi một <code>let</code> chẳng bao giờ bị gán lại. Nghe có vẻ khó tính, cho tới lúc bạn phải đọc một file 300 dòng chưa từng thấy và muốn liếc một cái là biết giá trị nào thay đổi, giá trị nào không.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-318" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 318 — Nền tảng JavaScript cho Node.js</span><span class="lc-sub">Luyện phạm vi biến, closure và bất đồng bộ qua 10 bài tập có chấm.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — Functions, closures and this|||1.2 — Hàm, closure và this',
      slug: 'nodejs-1-2-ham-closure-this',
      type: 'VIDEO',
      description: 'Closure là gì và vì sao backend dùng nó khắp nơi; this khác nhau ra sao giữa hàm thường và arrow.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Functions, closures and <code>this</code></h2>
<p class="lead">A closure is a function that remembers the variables around it, even after the code that created them has finished. That one sentence explains database connection pools, rate limiters, caches and middleware factories — all of which you will write later in this course.</p>

<h3>Closure: private state without a class</h3>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">createCounter</span>() {
  <span class="tok-keyword">let</span> count = <span class="tok-number">0</span>;              <span class="tok-comment">// private — nothing outside can touch it</span>
  <span class="tok-keyword">return</span> <span class="tok-keyword">function</span> () { count++; <span class="tok-keyword">return</span> count; };
}
<span class="tok-keyword">const</span> a = <span class="tok-function">createCounter</span>();
<span class="tok-keyword">const</span> b = <span class="tok-function">createCounter</span>();
<span class="tok-function">console.log</span>(<span class="tok-function">a</span>(), <span class="tok-function">a</span>(), <span class="tok-function">a</span>());
<span class="tok-function">console.log</span>(<span class="tok-function">b</span>());
<span class="tok-function">console.log</span>(<span class="tok-string">'is count visible outside?'</span>, <span class="tok-keyword">typeof</span> count);</code></pre>
<div class="out">1 2 3
1
is count visible outside? undefined</div>
<p>Two things to notice. First, <code>a</code> and <code>b</code> have <strong>separate</strong> counters — each call to <code>createCounter</code> creates a fresh scope. Second, <code>count</code> is genuinely unreachable from outside; this is real encapsulation, no class needed.</p>
<div class="callout ok">This shape — a factory function returning a function that closes over configuration — is the single most common pattern in Express. Every middleware you write will look like <code>function requireRole(role) { return (req, res, next) =&gt; { … } }</code>. That inner arrow closes over <code>role</code>.</div>

<h3><code>this</code>: the part everyone gets wrong</h3>
<p>In a regular function, <code>this</code> depends on <strong>how the function is called</strong>, not where it was written. In an arrow function, <code>this</code> is taken from the surrounding scope at definition time and can never be changed:</p>
<pre><code><span class="tok-keyword">const</span> service = {
  name: <span class="tok-string">'NotesAPI'</span>,
  greetNormal: <span class="tok-keyword">function</span> () { <span class="tok-keyword">return</span> <span class="tok-string">'Hello from '</span> + <span class="tok-keyword">this</span>.name; },
  greetArrow: () =&gt; <span class="tok-string">'Hello from '</span> + <span class="tok-keyword">this</span>.name,
};
<span class="tok-function">console.log</span>(service.<span class="tok-function">greetNormal</span>());
<span class="tok-function">console.log</span>(service.<span class="tok-function">greetArrow</span>());

<span class="tok-keyword">const</span> detached = service.greetNormal;   <span class="tok-comment">// pulled off the object</span>
<span class="tok-function">console.log</span>(<span class="tok-function">detached</span>());
<span class="tok-function">console.log</span>(<span class="tok-string">'rebound with bind:'</span>, detached.<span class="tok-function">bind</span>(service)());</code></pre>
<div class="out">Hello from NotesAPI
Hello from (undefined)
Hello from undefined
rebound with bind: Hello from NotesAPI</div>
<p>The third line is the dangerous one: pulling a method off its object <strong>silently</strong> loses <code>this</code>. In a CommonJS file (non-strict) <code>this</code> falls back to the global object, so you get <code>undefined</code> instead of a crash. In an ES module, which is always strict, the same code throws:</p>
<pre><code><span class="tok-comment">// same code, but in a .mjs file (ES module = always strict)</span>
<span class="tok-keyword">const</span> detached = service.greet;
<span class="tok-function">detached</span>();</code></pre>
<div class="out">TypeError: Cannot read properties of undefined (reading 'name')</div>
<div class="pitfall">This bites when you pass a method as a callback: <code>app.get('/notes', controller.list)</code> loses <code>this</code> inside <code>list</code>. Fixes, in order of preference: (1) don't use <code>this</code> — export plain functions; (2) <code>controller.list.bind(controller)</code>; (3) wrap it: <code>(req, res) =&gt; controller.list(req, res)</code>.</div>

<h3>When to use which</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Arrow function</span><span class="v">Callbacks, array methods, middleware bodies, anything where you want the surrounding this. This is your default.</span></div>
  <div class="kv"><span class="k">Regular function</span><span class="v">Object methods that need this, and constructors/prototypes. Arrows cannot be used as constructors.</span></div>
  <div class="kv"><span class="k">Honest advice</span><span class="v">Most modern Node code avoids <code>this</code> almost entirely — plain exported functions plus closures are simpler to test and impossible to unbind.</span></div>
</div>
<div class="note-ct">The service layer of this site is written as plain exported async functions, deliberately: <code>export async function shareNote(noteId, userId)</code>. No <code>this</code>, so it can be called from an Express route, a Socket.IO handler or a background job with no binding ceremony.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Hàm, closure và <code>this</code></h2>
<p class="lead">Closure là một hàm nhớ được những biến quanh nó, kể cả khi đoạn code tạo ra chúng đã chạy xong từ lâu. Chỉ một câu đó thôi đã giải thích được connection pool, bộ giới hạn tần suất, cache và các nhà máy sinh middleware — tất cả đều là thứ bạn sẽ tự viết ở phần sau của khoá.</p>

<h3>Closure: trạng thái riêng tư mà không cần class</h3>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">taoBoDem</span>() {
  <span class="tok-keyword">let</span> soLan = <span class="tok-number">0</span>;            <span class="tok-comment">// riêng tư — bên ngoài không chạm được</span>
  <span class="tok-keyword">return</span> <span class="tok-keyword">function</span> () { soLan++; <span class="tok-keyword">return</span> soLan; };
}
<span class="tok-keyword">const</span> demA = <span class="tok-function">taoBoDem</span>();
<span class="tok-keyword">const</span> demB = <span class="tok-function">taoBoDem</span>();
<span class="tok-function">console.log</span>(<span class="tok-function">demA</span>(), <span class="tok-function">demA</span>(), <span class="tok-function">demA</span>());
<span class="tok-function">console.log</span>(<span class="tok-function">demB</span>());
<span class="tok-function">console.log</span>(<span class="tok-string">'soLan có lộ ra ngoài không?'</span>, <span class="tok-keyword">typeof</span> soLan);</code></pre>
<div class="out">1 2 3
1
soLan có lộ ra ngoài không? undefined</div>
<p>Hai điều đáng chú ý. Thứ nhất, <code>demA</code> và <code>demB</code> có bộ đếm <strong>riêng biệt</strong> — mỗi lần gọi <code>taoBoDem</code> tạo ra một phạm vi mới toanh. Thứ hai, <code>soLan</code> thực sự không với tới được từ bên ngoài; đó là đóng gói thật sự, chẳng cần class nào cả.</p>
<div class="callout ok">Hình dạng này — một hàm nhà máy trả về một hàm "ôm" lấy cấu hình — là mẫu phổ biến bậc nhất trong Express. Mọi middleware bạn viết rồi sẽ trông như <code>function requireRole(role) { return (req, res, next) =&gt; { … } }</code>. Cái arrow bên trong đang ôm lấy biến <code>role</code>.</div>

<h3><code>this</code>: chỗ ai cũng hiểu sai</h3>
<p>Trong hàm thường, <code>this</code> phụ thuộc vào <strong>cách hàm được gọi</strong>, không phải nơi hàm được viết. Trong arrow function, <code>this</code> được lấy từ phạm vi bao quanh ngay lúc định nghĩa và không bao giờ đổi được:</p>
<pre><code><span class="tok-keyword">const</span> dichVu = {
  ten: <span class="tok-string">'NotesAPI'</span>,
  chaoThuong: <span class="tok-keyword">function</span> () { <span class="tok-keyword">return</span> <span class="tok-string">'Xin chào từ '</span> + <span class="tok-keyword">this</span>.ten; },
  chaoArrow: () =&gt; <span class="tok-string">'Xin chào từ '</span> + <span class="tok-keyword">this</span>.ten,
};
<span class="tok-function">console.log</span>(dichVu.<span class="tok-function">chaoThuong</span>());
<span class="tok-function">console.log</span>(dichVu.<span class="tok-function">chaoArrow</span>());

<span class="tok-keyword">const</span> tachRa = dichVu.chaoThuong;   <span class="tok-comment">// tách hàm ra khỏi object</span>
<span class="tok-function">console.log</span>(<span class="tok-function">tachRa</span>());
<span class="tok-function">console.log</span>(<span class="tok-string">'buộc lại bằng bind:'</span>, tachRa.<span class="tok-function">bind</span>(dichVu)());</code></pre>
<div class="out">Xin chào từ NotesAPI
Xin chào từ (undefined)
Xin chào từ undefined
buộc lại bằng bind: Xin chào từ NotesAPI</div>
<p>Dòng thứ ba mới là dòng nguy hiểm: tách một method ra khỏi object sẽ <strong>âm thầm</strong> làm mất <code>this</code>. Trong file CommonJS (không strict), <code>this</code> rơi về đối tượng toàn cục nên bạn nhận <code>undefined</code> thay vì một tiếng nổ. Trong ES module — vốn luôn strict — cùng đoạn code đó ném lỗi:</p>
<pre><code><span class="tok-comment">// vẫn code đó, nhưng đặt trong file .mjs (ES module = luôn strict)</span>
<span class="tok-keyword">const</span> tachRa = dichVu.chao;
<span class="tok-function">tachRa</span>();</code></pre>
<div class="out">TypeError: Cannot read properties of undefined (reading 'ten')</div>
<div class="pitfall">Lỗi này cắn bạn khi truyền một method làm callback: <code>app.get('/notes', controller.list)</code> sẽ làm mất <code>this</code> bên trong <code>list</code>. Cách sửa, xếp theo thứ tự nên dùng: (1) đừng dùng <code>this</code> — cứ export hàm thuần; (2) <code>controller.list.bind(controller)</code>; (3) bọc lại: <code>(req, res) =&gt; controller.list(req, res)</code>.</div>

<h3>Khi nào dùng loại nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Arrow function</span><span class="v">Callback, các method của mảng, thân middleware, mọi chỗ bạn muốn giữ this của phạm vi bao ngoài. Đây là lựa chọn mặc định.</span></div>
  <div class="kv"><span class="k">Hàm thường</span><span class="v">Method của object có dùng this, và constructor/prototype. Arrow không dùng làm constructor được.</span></div>
  <div class="kv"><span class="k">Lời khuyên thật lòng</span><span class="v">Phần lớn code Node hiện đại gần như tránh hẳn <code>this</code> — hàm export thuần cộng closure thì dễ test hơn và không thể bị mất ràng buộc.</span></div>
</div>
<div class="note-ct">Tầng service của website này được viết dưới dạng các hàm async export thuần, một cách có chủ đích: <code>export async function shareNote(noteId, userId)</code>. Không có <code>this</code>, nên nó gọi được từ route Express, từ handler Socket.IO hay từ một job chạy nền mà chẳng cần nghi thức bind nào.</div>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — Objects, arrays and references|||1.3 — Object, mảng và tham chiếu',
      slug: 'nodejs-1-3-object-tham-chieu',
      type: 'VIDEO',
      description: 'Sao chép nông vs sâu, destructuring, spread — và vì sao "sửa bản sao" lại làm hỏng bản gốc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Objects, arrays and references</h2>
<p class="lead">Primitives are copied by value. Objects and arrays are copied <strong>by reference</strong> — the variable holds an address, not the data. Nearly every "why did my original change?" bug in a backend comes from this one fact.</p>

<h3>Shallow copy is only one level deep</h3>
<pre><code><span class="tok-keyword">const</span> original = { name: <span class="tok-string">'An'</span>, address: { city: <span class="tok-string">'Hà Nội'</span> }, tags: [<span class="tok-string">'a'</span>] };

<span class="tok-keyword">const</span> shallow = { ...original };     <span class="tok-comment">// spread = ONE level copied</span>
shallow.name = <span class="tok-string">'Bình'</span>;              <span class="tok-comment">// top level → original safe</span>
shallow.address.city = <span class="tok-string">'Đà Nẵng'</span>;   <span class="tok-comment">// nested → SHARED with original!</span>
<span class="tok-function">console.log</span>(<span class="tok-string">'original after editing shallow copy:'</span>, JSON.<span class="tok-function">stringify</span>(original));

<span class="tok-keyword">const</span> deep = <span class="tok-function">structuredClone</span>(original);  <span class="tok-comment">// built in since Node 17</span>
deep.address.city = <span class="tok-string">'Huế'</span>;
<span class="tok-function">console.log</span>(<span class="tok-string">'original after editing deep copy   :'</span>, JSON.<span class="tok-function">stringify</span>(original));
<span class="tok-function">console.log</span>(<span class="tok-string">'the deep copy                      :'</span>, JSON.<span class="tok-function">stringify</span>(deep));</code></pre>
<div class="out">original after editing shallow copy: {"name":"An","address":{"city":"Đà Nẵng"},"tags":["a"]}
original after editing deep copy   : {"name":"An","address":{"city":"Đà Nẵng"},"tags":["a"]}
the deep copy                      : {"name":"An","address":{"city":"Huế"},"tags":["a"]}</div>
<p>Read the first output line carefully: <code>name</code> stayed <code>'An'</code> (protected), but <code>city</code> became <code>'Đà Nẵng'</code> — the nested object was never copied, both variables point at the same one.</p>
<div class="callout warn">Old tutorials suggest <code>JSON.parse(JSON.stringify(obj))</code> for deep copies. It works for plain data but <strong>destroys</strong> <code>Date</code> (becomes a string), <code>undefined</code>, <code>Map</code>, <code>Set</code>, <code>BigInt</code> (throws) and functions. Use <code>structuredClone</code> — it handles Date, Map and Set correctly.</div>

<h3>Destructuring — how you read request data</h3>
<pre><code><span class="tok-comment">// this exact shape appears in every route handler you will write</span>
<span class="tok-keyword">const</span> { title, body = <span class="tok-string">''</span>, tags = [] } = req.body;    <span class="tok-comment">// defaults for missing fields</span>
<span class="tok-keyword">const</span> { page = <span class="tok-number">1</span>, limit = <span class="tok-number">20</span> } = req.query;
<span class="tok-keyword">const</span> { id: noteId } = req.params;                <span class="tok-comment">// rename while extracting</span></code></pre>
<p>Defaults only fire on <code>undefined</code>, not on <code>null</code> or <code>''</code>. That distinction matters when a client sends <code>{"body": null}</code> — you get <code>null</code>, not the default.</p>

<h3>Spread: update without mutating</h3>
<pre><code><span class="tok-comment">// merge an update onto an existing record — original untouched</span>
<span class="tok-keyword">const</span> updated = { ...note, title: <span class="tok-string">'New title'</span>, updatedAt: <span class="tok-keyword">new</span> <span class="tok-function">Date</span>() };

<span class="tok-comment">// remove a field safely (never send passwordHash to the client)</span>
<span class="tok-keyword">const</span> { passwordHash, ...safeUser } = user;</code></pre>
<div class="callout ok">That second line is a security habit worth building now: strip secrets by destructuring them <em>out</em>, rather than trusting yourself to remember which fields to include.</div>

<h3>Optional chaining and nullish coalescing</h3>
<pre><code><span class="tok-keyword">const</span> city = user?.address?.city ?? <span class="tok-string">'unknown'</span>;   <span class="tok-comment">// no crash if address is missing</span>
<span class="tok-keyword">const</span> limit = req.query.limit ?? <span class="tok-number">20</span>;             <span class="tok-comment">// ?? only falls back on null/undefined</span>
<span class="tok-keyword">const</span> limitBad = req.query.limit || <span class="tok-number">20</span>;          <span class="tok-comment">// || also replaces 0 and '' — usually a bug</span></code></pre>
<div class="pitfall">Use <code>??</code>, not <code>||</code>, for defaults on numbers. With <code>||</code>, a legitimate <code>limit=0</code> or <code>page=0</code> silently becomes 20 — because <code>0</code> is falsy. This is a real and very annoying pagination bug.</div>
<div class="note-ct">On this site the "don't leak secrets" rule is enforced at the serialisation layer: a <code>serializeUser()</code> function builds the response object explicitly, field by field. Adding a column to the database therefore <em>cannot</em> accidentally expose it through the API — the opposite of returning the raw database row.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Object, mảng và tham chiếu</h2>
<p class="lead">Kiểu nguyên thuỷ được sao chép theo giá trị. Object và mảng thì sao chép <strong>theo tham chiếu</strong> — biến giữ một địa chỉ, không giữ dữ liệu. Gần như mọi con bug "sao bản gốc lại đổi?" trong backend đều sinh ra từ đúng sự thật này.</p>

<h3>Sao chép nông chỉ đi được một tầng</h3>
<pre><code><span class="tok-keyword">const</span> goc = { ten: <span class="tok-string">'An'</span>, diaChi: { thanhPho: <span class="tok-string">'Hà Nội'</span> }, tags: [<span class="tok-string">'a'</span>] };

<span class="tok-keyword">const</span> copyNong = { ...goc };          <span class="tok-comment">// spread = chỉ chép MỘT tầng</span>
copyNong.ten = <span class="tok-string">'Bình'</span>;               <span class="tok-comment">// tầng ngoài → bản gốc an toàn</span>
copyNong.diaChi.thanhPho = <span class="tok-string">'Đà Nẵng'</span>;  <span class="tok-comment">// tầng trong → DÙNG CHUNG với bản gốc!</span>
<span class="tok-function">console.log</span>(<span class="tok-string">'gốc sau khi sửa bản sao nông:'</span>, JSON.<span class="tok-function">stringify</span>(goc));

<span class="tok-keyword">const</span> copySau = <span class="tok-function">structuredClone</span>(goc);  <span class="tok-comment">// có sẵn từ Node 17</span>
copySau.diaChi.thanhPho = <span class="tok-string">'Huế'</span>;
<span class="tok-function">console.log</span>(<span class="tok-string">'gốc sau khi sửa bản sao sâu :'</span>, JSON.<span class="tok-function">stringify</span>(goc));
<span class="tok-function">console.log</span>(<span class="tok-string">'bản sao sâu                 :'</span>, JSON.<span class="tok-function">stringify</span>(copySau));</code></pre>
<div class="out">gốc sau khi sửa bản sao nông: {"ten":"An","diaChi":{"thanhPho":"Đà Nẵng"},"tags":["a"]}
gốc sau khi sửa bản sao sâu : {"ten":"An","diaChi":{"thanhPho":"Đà Nẵng"},"tags":["a"]}
bản sao sâu                 : {"ten":"An","diaChi":{"thanhPho":"Huế"},"tags":["a"]}</div>
<p>Hãy đọc kỹ dòng kết quả đầu tiên: <code>ten</code> vẫn là <code>'An'</code> (được bảo vệ), nhưng <code>thanhPho</code> đã thành <code>'Đà Nẵng'</code> — object lồng bên trong chưa từng được sao chép, cả hai biến cùng trỏ vào một chỗ.</p>
<div class="callout warn">Tutorial cũ hay bảo dùng <code>JSON.parse(JSON.stringify(obj))</code> để chép sâu. Nó chạy được với dữ liệu thuần, nhưng <strong>phá hỏng</strong> <code>Date</code> (biến thành chuỗi), <code>undefined</code>, <code>Map</code>, <code>Set</code>, <code>BigInt</code> (ném lỗi) và hàm. Hãy dùng <code>structuredClone</code> — nó xử lý đúng cả Date, Map và Set.</div>

<h3>Destructuring — cách bạn đọc dữ liệu từ request</h3>
<pre><code><span class="tok-comment">// hình dạng này xuất hiện trong mọi route handler bạn sẽ viết</span>
<span class="tok-keyword">const</span> { title, body = <span class="tok-string">''</span>, tags = [] } = req.body;    <span class="tok-comment">// giá trị mặc định cho trường thiếu</span>
<span class="tok-keyword">const</span> { page = <span class="tok-number">1</span>, limit = <span class="tok-number">20</span> } = req.query;
<span class="tok-keyword">const</span> { id: noteId } = req.params;                <span class="tok-comment">// đổi tên ngay khi lấy ra</span></code></pre>
<p>Giá trị mặc định CHỈ kích hoạt khi gặp <code>undefined</code>, không kích hoạt với <code>null</code> hay <code>''</code>. Khác biệt này quan trọng khi client gửi lên <code>{"body": null}</code> — bạn nhận <code>null</code>, không phải giá trị mặc định.</p>

<h3>Spread: cập nhật mà không sửa bản gốc</h3>
<pre><code><span class="tok-comment">// ghép bản cập nhật lên bản ghi cũ — bản gốc không bị đụng</span>
<span class="tok-keyword">const</span> banMoi = { ...note, title: <span class="tok-string">'Tiêu đề mới'</span>, updatedAt: <span class="tok-keyword">new</span> <span class="tok-function">Date</span>() };

<span class="tok-comment">// loại bỏ một trường an toàn (đừng bao giờ gửi passwordHash cho client)</span>
<span class="tok-keyword">const</span> { passwordHash, ...userAnToan } = user;</code></pre>
<div class="callout ok">Dòng thứ hai là một thói quen bảo mật nên xây ngay từ bây giờ: bóc bí mật ra bằng destructuring, thay vì tin vào trí nhớ của mình về việc "được phép trả những trường nào".</div>

<h3>Optional chaining và toán tử nullish</h3>
<pre><code><span class="tok-keyword">const</span> thanhPho = user?.diaChi?.thanhPho ?? <span class="tok-string">'không rõ'</span>;  <span class="tok-comment">// không nổ nếu thiếu diaChi</span>
<span class="tok-keyword">const</span> limit = req.query.limit ?? <span class="tok-number">20</span>;              <span class="tok-comment">// ?? chỉ thay khi null/undefined</span>
<span class="tok-keyword">const</span> limitSai = req.query.limit || <span class="tok-number">20</span>;           <span class="tok-comment">// || thay cả 0 và '' — thường là bug</span></code></pre>
<div class="pitfall">Hãy dùng <code>??</code> chứ đừng dùng <code>||</code> để đặt giá trị mặc định cho số. Với <code>||</code>, một giá trị hợp lệ như <code>limit=0</code> hay <code>page=0</code> sẽ âm thầm biến thành 20 — vì <code>0</code> bị coi là "giá trị giả". Đây là một con bug phân trang có thật và rất khó chịu.</div>
<div class="note-ct">Ở website này, quy tắc "không để rò rỉ bí mật" được thực thi ngay tại tầng chuyển đổi dữ liệu: hàm <code>serializeUser()</code> dựng object phản hồi một cách tường minh, từng trường một. Nhờ vậy, thêm một cột vào cơ sở dữ liệu <em>không thể</em> vô tình phơi nó ra API — ngược hẳn với kiểu trả thẳng bản ghi thô từ database.</div>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Async: callbacks, Promises, async/await|||1.4 — Bất đồng bộ: callback, Promise, async/await',
      slug: 'nodejs-1-4-bat-dong-bo',
      type: 'VIDEO',
      description: 'Bài quan trọng nhất chương: cách Node xử lý việc chờ đợi, và 4 lỗi async khiến API sập.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Async: callbacks, Promises, async/await</h2>
<p class="lead">This is the most important lesson in the chapter. Almost everything a backend does — read the database, call another API, read a file — takes time, and Node's entire design is about <strong>not standing still</strong> while it waits. Get this wrong and your API is either slow, wrong, or dead.</p>

<h3>Three generations of the same idea</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">2010</div><div class="lz-t">Callbacks</div><div class="lz-d">Pass a function to run "when done". Nests badly.</div></div>
  <div class="lz-step"><div class="lz-k">2015</div><div class="lz-t">Promises</div><div class="lz-d">An object representing a future value. Chainable.</div></div>
  <div class="lz-step"><div class="lz-k">2017</div><div class="lz-t">async / await</div><div class="lz-d">Promises that read like ordinary code. Use this.</div></div>
</div>
<pre><code><span class="tok-comment">// callback style — error first, the Node convention</span>
fs.<span class="tok-function">readFile</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'utf8'</span>, (err, data) =&gt; {
  <span class="tok-keyword">if</span> (err) <span class="tok-keyword">return</span> <span class="tok-function">handle</span>(err);
  <span class="tok-function">console.log</span>(data);
});

<span class="tok-comment">// async/await — same thing, readable top to bottom</span>
<span class="tok-keyword">const</span> data = <span class="tok-keyword">await</span> fs.promises.<span class="tok-function">readFile</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'utf8'</span>);
<span class="tok-function">console.log</span>(data);</code></pre>

<h3>Mistake 1 — forgetting await</h3>
<pre><code><span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">getName</span>() { <span class="tok-keyword">await</span> <span class="tok-function">sleep</span>(<span class="tok-number">50</span>); <span class="tok-keyword">return</span> <span class="tok-string">'An'</span>; }

<span class="tok-keyword">const</span> missing = <span class="tok-function">getName</span>();          <span class="tok-comment">// no await</span>
<span class="tok-function">console.log</span>(<span class="tok-string">'without await:'</span>, missing);
<span class="tok-function">console.log</span>(<span class="tok-string">'with await   :'</span>, <span class="tok-keyword">await</span> <span class="tok-function">getName</span>());</code></pre>
<div class="out">without await: Promise { &lt;pending&gt; }
with await   : An</div>
<p>An <code>async</code> function <strong>always</strong> returns a Promise. Forget <code>await</code> and you send the client a Promise object, which serialises to <code>{}</code> — the classic "my API returns an empty object" bug.</p>

<h3>Mistake 2 — awaiting things that could run together</h3>
<pre><code><span class="tok-comment">// sequential: each await blocks the next</span>
<span class="tok-keyword">await</span> <span class="tok-function">sleep</span>(<span class="tok-number">300</span>); <span class="tok-keyword">await</span> <span class="tok-function">sleep</span>(<span class="tok-number">300</span>); <span class="tok-keyword">await</span> <span class="tok-function">sleep</span>(<span class="tok-number">300</span>);

<span class="tok-comment">// parallel: start all three, then wait for the slowest</span>
<span class="tok-keyword">await</span> Promise.<span class="tok-function">all</span>([<span class="tok-function">sleep</span>(<span class="tok-number">300</span>), <span class="tok-function">sleep</span>(<span class="tok-number">300</span>), <span class="tok-function">sleep</span>(<span class="tok-number">300</span>)]);</code></pre>
<div class="out">sequential: 903 ms
parallel  : 302 ms</div>
<p>Three times faster, same work. The rule: <strong>if B does not need A's result, don't await A before starting B.</strong> A dashboard endpoint that loads user + notes + tags sequentially is three round-trips deep for no reason.</p>
<div class="callout warn">The opposite mistake also exists: firing 5,000 database queries in one <code>Promise.all</code> will exhaust your connection pool and take the database down. Parallel means "a handful at once", not "everything at once". Chapter 16 covers batching.</div>

<h3>Mistake 3 — assuming all-or-nothing</h3>
<pre><code><span class="tok-keyword">try</span> { <span class="tok-keyword">await</span> Promise.<span class="tok-function">all</span>([<span class="tok-function">sleep</span>(<span class="tok-number">10</span>), <span class="tok-function">failing</span>()]); }
<span class="tok-keyword">catch</span> (e) { <span class="tok-function">console.log</span>(<span class="tok-string">'Promise.all   → throws immediately:'</span>, e.message); }

<span class="tok-keyword">const</span> results = <span class="tok-keyword">await</span> Promise.<span class="tok-function">allSettled</span>([<span class="tok-function">sleep</span>(<span class="tok-number">10</span>), <span class="tok-function">failing</span>()]);
<span class="tok-function">console.log</span>(<span class="tok-string">'allSettled    →'</span>, results.<span class="tok-function">map</span>(r =&gt; r.status));</code></pre>
<div class="out">Promise.all   → throws immediately: DB connection lost
allSettled    → [ 'fulfilled', 'rejected' ]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Promise.all</span><span class="v">Rejects as soon as ONE fails. Use when you need every result to continue.</span></div>
  <div class="kv"><span class="k">Promise.allSettled</span><span class="v">Never rejects; reports each outcome. Use for "send 10 notifications, some may fail".</span></div>
  <div class="kv"><span class="k">Promise.race</span><span class="v">First to settle wins — the standard way to add a timeout.</span></div>
  <div class="kv"><span class="k">Promise.any</span><span class="v">First to SUCCEED wins; ignores failures until all fail.</span></div>
</div>

<h3>Mistake 4 — the one that kills the process</h3>
<p>try/catch only catches what happens <em>inside</em> its block, synchronously. A throw inside a callback escapes it entirely:</p>
<pre><code><span class="tok-keyword">try</span> {
  <span class="tok-function">setTimeout</span>(() =&gt; { <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">'boom in callback'</span>); }, <span class="tok-number">0</span>);
  <span class="tok-function">console.log</span>(<span class="tok-string">'try/catch finished, feeling safe'</span>);
} <span class="tok-keyword">catch</span> (e) { <span class="tok-function">console.log</span>(<span class="tok-string">'caught?'</span>, e.message); }</code></pre>
<div class="out">try/catch finished, feeling safe
→ escapes to uncaughtException: boom in callback</div>
<p>And an unhandled rejected Promise <strong>terminates the process</strong> in modern Node:</p>
<pre><code>Promise.<span class="tok-function">reject</span>(<span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">'nobody catches me'</span>));
<span class="tok-function">setTimeout</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'does this line run?'</span>), <span class="tok-number">100</span>);</code></pre>
<div class="out">Error: nobody catches me
    at Object.&lt;anonymous&gt; …
Node.js v22.21.0
[process exits with code 1 — "does this line run?" never prints]</div>
<div class="pitfall">This is why an unhandled async error in one request can take down a server that was happily serving thousands of others. Express 4 does <strong>not</strong> catch errors thrown inside async handlers — you must wrap them. Chapter 5 builds the wrapper; for now just register a safety net:
<br><br><code>process.on('unhandledRejection', (err) =&gt; { logger.error(err); });</code></div>

<h3>Rules to internalise</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Await everything that returns a Promise</span><span class="v">Or deliberately handle it with .catch(). Never leave one floating.</span></div>
  <div class="kv"><span class="k">Independent work runs in parallel</span><span class="v">Promise.all for a handful; batches for many.</span></div>
  <div class="kv"><span class="k">Errors need an owner</span><span class="v">Either a try/catch or a .catch() — decide which, don't hope.</span></div>
  <div class="kv"><span class="k">async in array callbacks is a trap</span><span class="v"><code>arr.forEach(async …)</code> does NOT wait. Use <code>for…of</code> with await, or map + Promise.all.</span></div>
</div>
<div class="note-ct">The 24-hour logout bug mentioned in lesson 0.1 lived in exactly this territory: the access token expired, the refresh call failed, and nothing awaited or handled that failure — so every subsequent request just returned 401 with no clue why. The fix was an interceptor that refreshes once and retries, plus proper error propagation.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-318" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practise async — Module 318</span><span class="lc-sub">Promise chaining, error handling and parallelism exercises with solutions.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Bất đồng bộ: callback, Promise, async/await</h2>
<p class="lead">Đây là bài quan trọng nhất chương. Hầu như mọi việc backend làm — đọc cơ sở dữ liệu, gọi API khác, đọc file — đều tốn thời gian, và toàn bộ thiết kế của Node xoay quanh chuyện <strong>không đứng yên</strong> trong lúc chờ. Sai chỗ này thì API của bạn hoặc chậm, hoặc sai, hoặc chết.</p>

<h3>Ba thế hệ của cùng một ý tưởng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">2010</div><div class="lz-t">Callback</div><div class="lz-d">Truyền vào một hàm để chạy "khi xong". Lồng nhau rất tệ.</div></div>
  <div class="lz-step"><div class="lz-k">2015</div><div class="lz-t">Promise</div><div class="lz-d">Một object đại diện cho giá trị tương lai. Nối chuỗi được.</div></div>
  <div class="lz-step"><div class="lz-k">2017</div><div class="lz-t">async / await</div><div class="lz-d">Promise nhưng đọc như code thường. Hãy dùng cái này.</div></div>
</div>
<pre><code><span class="tok-comment">// kiểu callback — lỗi đứng trước, quy ước của Node</span>
fs.<span class="tok-function">readFile</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'utf8'</span>, (err, data) =&gt; {
  <span class="tok-keyword">if</span> (err) <span class="tok-keyword">return</span> <span class="tok-function">xuLyLoi</span>(err);
  <span class="tok-function">console.log</span>(data);
});

<span class="tok-comment">// async/await — vẫn việc đó, đọc từ trên xuống dưới</span>
<span class="tok-keyword">const</span> data = <span class="tok-keyword">await</span> fs.promises.<span class="tok-function">readFile</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'utf8'</span>);
<span class="tok-function">console.log</span>(data);</code></pre>

<h3>Lỗi 1 — quên await</h3>
<pre><code><span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">layTen</span>() { <span class="tok-keyword">await</span> <span class="tok-function">nghi</span>(<span class="tok-number">50</span>); <span class="tok-keyword">return</span> <span class="tok-string">'An'</span>; }

<span class="tok-keyword">const</span> thieuAwait = <span class="tok-function">layTen</span>();        <span class="tok-comment">// không await</span>
<span class="tok-function">console.log</span>(<span class="tok-string">'không await:'</span>, thieuAwait);
<span class="tok-function">console.log</span>(<span class="tok-string">'có await   :'</span>, <span class="tok-keyword">await</span> <span class="tok-function">layTen</span>());</code></pre>
<div class="out">không await: Promise { &lt;pending&gt; }
có await   : An</div>
<p>Hàm <code>async</code> <strong>luôn luôn</strong> trả về một Promise. Quên <code>await</code> là bạn gửi cho client một object Promise, và nó được chuyển thành <code>{}</code> — đúng con bug kinh điển "API của tôi trả về object rỗng".</p>

<h3>Lỗi 2 — chờ tuần tự những việc chạy song song được</h3>
<pre><code><span class="tok-comment">// tuần tự: mỗi await chặn cái kế tiếp</span>
<span class="tok-keyword">await</span> <span class="tok-function">nghi</span>(<span class="tok-number">300</span>); <span class="tok-keyword">await</span> <span class="tok-function">nghi</span>(<span class="tok-number">300</span>); <span class="tok-keyword">await</span> <span class="tok-function">nghi</span>(<span class="tok-number">300</span>);

<span class="tok-comment">// song song: khởi động cả ba, rồi chờ cái chậm nhất</span>
<span class="tok-keyword">await</span> Promise.<span class="tok-function">all</span>([<span class="tok-function">nghi</span>(<span class="tok-number">300</span>), <span class="tok-function">nghi</span>(<span class="tok-number">300</span>), <span class="tok-function">nghi</span>(<span class="tok-number">300</span>)]);</code></pre>
<div class="out">tuần tự  : 903 ms
song song: 302 ms</div>
<p>Nhanh gấp ba, cùng khối lượng công việc. Nguyên tắc: <strong>nếu B không cần kết quả của A thì đừng await A trước khi khởi động B.</strong> Một endpoint dashboard nạp user + ghi chú + thẻ theo kiểu tuần tự là đi ba vòng mạng chồng nhau một cách vô cớ.</p>
<div class="callout warn">Có cả lỗi ngược lại: bắn 5.000 truy vấn trong một <code>Promise.all</code> sẽ vắt kiệt connection pool và làm sập cơ sở dữ liệu. Song song nghĩa là "vài cái một lúc", không phải "tất cả cùng lúc". Chương 16 sẽ nói về chia lô.</div>

<h3>Lỗi 3 — tưởng cứ được ăn cả ngã về không</h3>
<pre><code><span class="tok-keyword">try</span> { <span class="tok-keyword">await</span> Promise.<span class="tok-function">all</span>([<span class="tok-function">nghi</span>(<span class="tok-number">10</span>), <span class="tok-function">hong</span>()]); }
<span class="tok-keyword">catch</span> (e) { <span class="tok-function">console.log</span>(<span class="tok-string">'Promise.all   → ném ngay:'</span>, e.message); }

<span class="tok-keyword">const</span> ketQua = <span class="tok-keyword">await</span> Promise.<span class="tok-function">allSettled</span>([<span class="tok-function">nghi</span>(<span class="tok-number">10</span>), <span class="tok-function">hong</span>()]);
<span class="tok-function">console.log</span>(<span class="tok-string">'allSettled    →'</span>, ketQua.<span class="tok-function">map</span>(r =&gt; r.status));</code></pre>
<div class="out">Promise.all   → ném ngay: DB mất kết nối
allSettled    → [ 'fulfilled', 'rejected' ]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Promise.all</span><span class="v">Ném lỗi ngay khi MỘT cái hỏng. Dùng khi bạn cần đủ mọi kết quả mới đi tiếp được.</span></div>
  <div class="kv"><span class="k">Promise.allSettled</span><span class="v">Không bao giờ ném; báo cáo kết cục từng cái. Dùng cho kiểu "gửi 10 thông báo, vài cái hỏng cũng được".</span></div>
  <div class="kv"><span class="k">Promise.race</span><span class="v">Cái nào xong trước thì thắng — cách chuẩn để gắn thời gian chờ tối đa.</span></div>
  <div class="kv"><span class="k">Promise.any</span><span class="v">Cái nào THÀNH CÔNG trước thì thắng; bỏ qua các lỗi cho tới khi hỏng hết.</span></div>
</div>

<h3>Lỗi 4 — con lỗi giết cả tiến trình</h3>
<p>try/catch chỉ bắt được những gì xảy ra <em>bên trong</em> khối của nó, theo kiểu đồng bộ. Một lệnh throw nằm trong callback sẽ thoát ra ngoài hoàn toàn:</p>
<pre><code><span class="tok-keyword">try</span> {
  <span class="tok-function">setTimeout</span>(() =&gt; { <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">'nổ trong callback'</span>); }, <span class="tok-number">0</span>);
  <span class="tok-function">console.log</span>(<span class="tok-string">'try/catch chạy xong, tưởng an toàn'</span>);
} <span class="tok-keyword">catch</span> (e) { <span class="tok-function">console.log</span>(<span class="tok-string">'bắt được?'</span>, e.message); }</code></pre>
<div class="out">try/catch chạy xong, tưởng an toàn
→ rơi vào uncaughtException: nổ trong callback</div>
<p>Và một Promise bị từ chối mà không ai bắt sẽ <strong>chấm dứt cả tiến trình</strong> trong Node hiện đại:</p>
<pre><code>Promise.<span class="tok-function">reject</span>(<span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">'không ai bắt'</span>));
<span class="tok-function">setTimeout</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'dòng này có chạy không?'</span>), <span class="tok-number">100</span>);</code></pre>
<div class="out">Error: không ai bắt
    at Object.&lt;anonymous&gt; …
Node.js v22.21.0
[tiến trình thoát với mã 1 — "dòng này có chạy không?" KHÔNG bao giờ in ra]</div>
<div class="pitfall">Đây chính là lý do một lỗi async không được xử lý trong MỘT request có thể hạ gục cả server đang phục vụ ngon lành hàng nghìn request khác. Express 4 <strong>không</strong> bắt lỗi ném ra từ handler async — bạn phải tự bọc. Chương 5 sẽ dựng lớp bọc đó; còn bây giờ hãy đặt sẵn một tấm lưới an toàn:
<br><br><code>process.on('unhandledRejection', (err) =&gt; { logger.error(err); });</code></div>

<h3>Những nguyên tắc cần thấm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">await mọi thứ trả về Promise</span><span class="v">Hoặc chủ động xử lý bằng .catch(). Đừng bao giờ để một cái trôi nổi.</span></div>
  <div class="kv"><span class="k">Việc độc lập thì chạy song song</span><span class="v">Promise.all cho vài cái; chia lô khi nhiều.</span></div>
  <div class="kv"><span class="k">Lỗi phải có chủ</span><span class="v">Hoặc try/catch, hoặc .catch() — phải quyết định, đừng hy vọng.</span></div>
  <div class="kv"><span class="k">async trong callback của mảng là cái bẫy</span><span class="v"><code>arr.forEach(async …)</code> KHÔNG chờ. Hãy dùng <code>for…of</code> kèm await, hoặc map + Promise.all.</span></div>
</div>
<div class="note-ct">Con bug "tự đăng xuất sau 24 giờ" nhắc ở bài 0.1 nằm đúng trong địa hạt này: access token hết hạn, lệnh gọi làm mới thất bại, và chẳng có ai await hay xử lý thất bại đó — nên mọi request sau đó chỉ trả về 401 mà không rõ vì sao. Cách sửa là một lớp chặn tự làm mới token một lần rồi thử lại, cộng với việc truyền lỗi cho đúng chỗ.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-318" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện bất đồng bộ — Module 318</span><span class="lc-sub">Bài tập nối chuỗi Promise, xử lý lỗi và chạy song song, có lời giải.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — Modules: CommonJS vs ES Modules|||1.5 — Module: CommonJS và ES Modules',
      slug: 'nodejs-1-5-module',
      type: 'VIDEO',
      description: 'Hai hệ module cùng tồn tại trong Node, khác nhau ở đâu, và chọn cái nào cho dự án mới.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Modules: CommonJS vs ES Modules</h2>
<p class="lead">Node has <strong>two</strong> module systems. CommonJS (<code>require</code>) is the original; ES Modules (<code>import</code>) is the standard the whole JavaScript world converged on. You will meet both — most tutorials use one, most new projects the other — so you need to recognise which file you are in.</p>

<h3>Side by side</h3>
<pre><code><span class="tok-comment">// ─── CommonJS ─── math.cjs</span>
<span class="tok-keyword">function</span> <span class="tok-function">add</span>(a, b) { <span class="tok-keyword">return</span> a + b; }
module.exports = { add };

<span class="tok-comment">// use.cjs</span>
<span class="tok-keyword">const</span> { add } = <span class="tok-function">require</span>(<span class="tok-string">'./math.cjs'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'CJS  :'</span>, <span class="tok-function">add</span>(<span class="tok-number">2</span>, <span class="tok-number">3</span>), <span class="tok-string">'| __dirname available:'</span>, <span class="tok-keyword">typeof</span> __dirname);</code></pre>
<div class="out">CJS  : 5 | __dirname available: string</div>
<pre><code><span class="tok-comment">// ─── ES Modules ─── math.mjs</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">function</span> <span class="tok-function">add</span>(a, b) { <span class="tok-keyword">return</span> a + b; }

<span class="tok-comment">// use.mjs</span>
<span class="tok-keyword">import</span> { add } <span class="tok-keyword">from</span> <span class="tok-string">'./math.mjs'</span>;
<span class="tok-function">console.log</span>(<span class="tok-string">'ESM  :'</span>, <span class="tok-function">add</span>(<span class="tok-number">2</span>, <span class="tok-number">3</span>), <span class="tok-string">'| __dirname:'</span>, <span class="tok-keyword">typeof</span> __dirname);
<span class="tok-keyword">const</span> x = <span class="tok-keyword">await</span> Promise.<span class="tok-function">resolve</span>(<span class="tok-string">'top-level await works'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'ESM  :'</span>, x);</code></pre>
<div class="out">ESM  : 5 | __dirname: undefined
ESM  : top-level await works</div>
<p>Two differences already visible: ESM has <strong>no <code>__dirname</code></strong>, and ESM allows <code>await</code> at the top level of a file. CommonJS does not:</p>
<pre><code><span class="tok-comment">// tla.cjs</span>
<span class="tok-keyword">const</span> x = <span class="tok-keyword">await</span> Promise.<span class="tok-function">resolve</span>(<span class="tok-string">'ok'</span>);</code></pre>
<div class="out">SyntaxError: await is only valid in async functions and the top level bodies of modules</div>

<h3>Getting <code>__dirname</code> back in ESM</h3>
<pre><code><span class="tok-keyword">import</span> { fileURLToPath } <span class="tok-keyword">from</span> <span class="tok-string">'node:url'</span>;
<span class="tok-keyword">import</span> path <span class="tok-keyword">from</span> <span class="tok-string">'node:path'</span>;

<span class="tok-keyword">const</span> __dirname = path.<span class="tok-function">dirname</span>(<span class="tok-function">fileURLToPath</span>(<span class="tok-keyword">import</span>.meta.url));</code></pre>

<h3>How Node decides which mode a file is in</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.mjs</span><span class="v">Always an ES module.</span></div>
  <div class="kv"><span class="k">.cjs</span><span class="v">Always CommonJS.</span></div>
  <div class="kv"><span class="k">.js</span><span class="v">Depends on the nearest package.json: <code>"type": "module"</code> → ESM, otherwise CommonJS.</span></div>
</div>
<div class="pitfall">The most common error in this area reads: <em>"Cannot use import statement outside a module"</em>. It means you wrote <code>import</code> in a file Node is treating as CommonJS. Fix: add <code>"type": "module"</code> to package.json, or rename the file to <code>.mjs</code>. The mirror-image error — <em>"require is not defined in ES module scope"</em> — means the opposite.</div>

<h3>Which should you choose?</h3>
<p><strong>ES Modules, for anything new.</strong> It is the language standard, it works in browsers and Node alike, it enables top-level await, and the whole ecosystem is moving there. CommonJS remains everywhere in older packages and tutorials, so you must be able to read it — but you do not need to write it.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">ESM imports are static</span><span class="v">Resolved before the file runs — you cannot <code>import</code> conditionally inside an if. Use <code>await import('…')</code> for dynamic loading.</span></div>
  <div class="kv"><span class="k">ESM requires file extensions</span><span class="v"><code>import './math.js'</code> — not <code>'./math'</code>. CommonJS was lenient; ESM is not.</span></div>
  <div class="kv"><span class="k">You can import CJS from ESM</span><span class="v">Usually as a default import. The reverse (<code>require</code> an ESM package) is what breaks — that is why some packages say "ESM only".</span></div>
</div>
<div class="note-ct">This site's backend is <code>"type": "module"</code> — pure ESM, TypeScript compiled to ESM output. That is exactly why its maintenance scripts are written with <code>import</code> and can use top-level <code>await</code> without wrapping everything in an async main function.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Module: CommonJS và ES Modules</h2>
<p class="lead">Node có <strong>hai</strong> hệ module. CommonJS (<code>require</code>) là hệ nguyên bản; ES Modules (<code>import</code>) là chuẩn mà cả thế giới JavaScript đã hội tụ về. Bạn sẽ gặp cả hai — phần lớn tutorial dùng hệ này, phần lớn dự án mới dùng hệ kia — nên cần nhận ra mình đang ở trong loại file nào.</p>

<h3>Đặt cạnh nhau</h3>
<pre><code><span class="tok-comment">// ─── CommonJS ─── math.cjs</span>
<span class="tok-keyword">function</span> <span class="tok-function">cong</span>(a, b) { <span class="tok-keyword">return</span> a + b; }
module.exports = { cong };

<span class="tok-comment">// dung.cjs</span>
<span class="tok-keyword">const</span> { cong } = <span class="tok-function">require</span>(<span class="tok-string">'./math.cjs'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'CJS  :'</span>, <span class="tok-function">cong</span>(<span class="tok-number">2</span>, <span class="tok-number">3</span>), <span class="tok-string">'| __dirname có sẵn:'</span>, <span class="tok-keyword">typeof</span> __dirname);</code></pre>
<div class="out">CJS  : 5 | __dirname có sẵn: string</div>
<pre><code><span class="tok-comment">// ─── ES Modules ─── math.mjs</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">function</span> <span class="tok-function">cong</span>(a, b) { <span class="tok-keyword">return</span> a + b; }

<span class="tok-comment">// dung.mjs</span>
<span class="tok-keyword">import</span> { cong } <span class="tok-keyword">from</span> <span class="tok-string">'./math.mjs'</span>;
<span class="tok-function">console.log</span>(<span class="tok-string">'ESM  :'</span>, <span class="tok-function">cong</span>(<span class="tok-number">2</span>, <span class="tok-number">3</span>), <span class="tok-string">'| __dirname:'</span>, <span class="tok-keyword">typeof</span> __dirname);
<span class="tok-keyword">const</span> x = <span class="tok-keyword">await</span> Promise.<span class="tok-function">resolve</span>(<span class="tok-string">'top-level await chạy được'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'ESM  :'</span>, x);</code></pre>
<div class="out">ESM  : 5 | __dirname: undefined
ESM  : top-level await chạy được</div>
<p>Đã thấy ngay hai khác biệt: ESM <strong>không có <code>__dirname</code></strong>, và ESM cho phép dùng <code>await</code> ngay ở cấp cao nhất của file. CommonJS thì không:</p>
<pre><code><span class="tok-comment">// tla.cjs</span>
<span class="tok-keyword">const</span> x = <span class="tok-keyword">await</span> Promise.<span class="tok-function">resolve</span>(<span class="tok-string">'ok'</span>);</code></pre>
<div class="out">SyntaxError: await is only valid in async functions and the top level bodies of modules</div>

<h3>Lấy lại <code>__dirname</code> trong ESM</h3>
<pre><code><span class="tok-keyword">import</span> { fileURLToPath } <span class="tok-keyword">from</span> <span class="tok-string">'node:url'</span>;
<span class="tok-keyword">import</span> path <span class="tok-keyword">from</span> <span class="tok-string">'node:path'</span>;

<span class="tok-keyword">const</span> __dirname = path.<span class="tok-function">dirname</span>(<span class="tok-function">fileURLToPath</span>(<span class="tok-keyword">import</span>.meta.url));</code></pre>

<h3>Node quyết định file thuộc hệ nào bằng cách nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.mjs</span><span class="v">Luôn là ES module.</span></div>
  <div class="kv"><span class="k">.cjs</span><span class="v">Luôn là CommonJS.</span></div>
  <div class="kv"><span class="k">.js</span><span class="v">Phụ thuộc package.json gần nhất: có <code>"type": "module"</code> → ESM, không có → CommonJS.</span></div>
</div>
<div class="pitfall">Lỗi hay gặp nhất ở khu vực này là: <em>"Cannot use import statement outside a module"</em>. Nó có nghĩa bạn viết <code>import</code> trong một file mà Node đang coi là CommonJS. Cách sửa: thêm <code>"type": "module"</code> vào package.json, hoặc đổi đuôi file thành <code>.mjs</code>. Lỗi soi gương của nó — <em>"require is not defined in ES module scope"</em> — nghĩa là ngược lại.</div>

<h3>Nên chọn hệ nào?</h3>
<p><strong>ES Modules, cho mọi thứ mới.</strong> Đó là chuẩn của ngôn ngữ, chạy được cả trên trình duyệt lẫn Node, cho phép top-level await, và cả hệ sinh thái đang dịch chuyển về đó. CommonJS vẫn còn ở khắp nơi trong các gói cũ và tutorial cũ, nên bạn phải đọc được nó — nhưng không cần viết nó nữa.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">import của ESM là tĩnh</span><span class="v">Được phân giải trước khi file chạy — bạn không thể <code>import</code> có điều kiện trong một câu if. Muốn nạp động thì dùng <code>await import('…')</code>.</span></div>
  <div class="kv"><span class="k">ESM bắt buộc ghi đuôi file</span><span class="v"><code>import './math.js'</code> — chứ không phải <code>'./math'</code>. CommonJS dễ tính, ESM thì không.</span></div>
  <div class="kv"><span class="k">Có thể import CJS từ ESM</span><span class="v">Thường dưới dạng default import. Chiều ngược lại (<code>require</code> một gói ESM) mới là chiều gãy — đó là lý do vài gói ghi "ESM only".</span></div>
</div>
<div class="note-ct">Backend của website này đặt <code>"type": "module"</code> — thuần ESM, TypeScript biên dịch ra ESM. Đó chính là lý do các script bảo trì của nó viết bằng <code>import</code> và dùng được <code>await</code> ở cấp cao nhất mà không phải bọc mọi thứ vào một hàm main async.</div>
</div>
`,
    },

    /* ─────────────────────────── 1.6 QUIZ ─────────────────────────── */
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra chương 1',
      slug: 'nodejs-1-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu kiểm tra lại phạm vi biến, closure, tham chiếu, bất đồng bộ và module.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the whole chapter. Answer from memory first — if you have to look something up, that is exactly the lesson worth re-reading. You can retake it as often as you like; the score is not stored.</p>
<div class="callout ok">Aim for 7/8. Anything below 6 means one of the five lessons did not land — the questions are grouped in lesson order, so the ones you miss point straight at what to revisit.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu cho toàn chương. Hãy trả lời bằng trí nhớ trước — nếu phải mở lại tra cứu thì đó đúng là bài đáng đọc lại. Bạn làm lại bao nhiêu lần cũng được; điểm không được lưu.</p>
<div class="callout ok">Hãy nhắm 7/8. Dưới 6 nghĩa là một trong năm bài chưa thấm — các câu hỏi xếp theo thứ tự bài, nên câu nào sai sẽ chỉ thẳng vào chỗ cần xem lại.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A loop using var creates three setTimeout callbacks printing i. What do they print?|||Một vòng lặp dùng var tạo ba callback setTimeout in ra i. Chúng in ra gì?',
            options: ['0, 1, 2', '3, 3, 3', '0, 0, 0', 'undefined, undefined, undefined'],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What happens when you read a let variable before its declaration line?|||Chuyện gì xảy ra khi bạn đọc một biến let trước dòng khai báo của nó?',
            options: [
              'It returns undefined|||Trả về undefined',
              'It returns null|||Trả về null',
              'It throws a ReferenceError (Temporal Dead Zone)|||Ném ReferenceError (Vùng chết tạm thời)',
              'It silently creates a global variable|||Âm thầm tạo ra một biến toàn cục',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Given const user = { name: "An" }, which line throws?|||Cho const user = { name: "An" }, dòng nào ném lỗi?',
            options: [
              'user.name = "Bình"',
              'user = {}',
              'Object.freeze(user)',
              'delete user.name',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does a method lose "this" when passed directly as a callback?|||Vì sao một method bị mất "this" khi được truyền thẳng làm callback?',
            options: [
              'Because this depends on HOW the function is called, not where it was written|||Vì this phụ thuộc vào CÁCH hàm được gọi, không phải nơi hàm được viết',
              'Because callbacks always run in strict mode|||Vì callback luôn chạy ở chế độ strict',
              'Because JavaScript deletes this after the first call|||Vì JavaScript xoá this sau lần gọi đầu tiên',
              'Because arrow functions cannot be callbacks|||Vì arrow function không dùng làm callback được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'After const copy = { ...original }, you change copy.address.city. What happens to original.address.city?|||Sau const copy = { ...original }, bạn đổi copy.address.city. Điều gì xảy ra với original.address.city?',
            options: [
              'It stays unchanged — spread copies everything|||Nó giữ nguyên — spread sao chép tất cả',
              'It also changes — spread only copies one level|||Nó cũng đổi theo — spread chỉ sao chép một tầng',
              'It becomes undefined|||Nó thành undefined',
              'It throws a TypeError|||Nó ném TypeError',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An async function is called WITHOUT await. What does the variable hold?|||Một hàm async được gọi mà KHÔNG có await. Biến nhận được giữ cái gì?',
            options: [
              'The resolved value|||Giá trị đã được giải quyết',
              'undefined',
              'A pending Promise|||Một Promise đang chờ',
              'The function itself|||Chính hàm đó',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You must run 3 independent queries. Which is correct AND fastest?|||Bạn phải chạy 3 truy vấn độc lập nhau. Cách nào vừa đúng vừa nhanh nhất?',
            options: [
              'await q1(); await q2(); await q3();',
              'await Promise.all([q1(), q2(), q3()]);',
              'q1(); q2(); q3();  // no await|||q1(); q2(); q3();  // không await',
              'arr.forEach(async q => await q());',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You wrote import in a .js file and got "Cannot use import statement outside a module". Why?|||Bạn viết import trong file .js và nhận lỗi "Cannot use import statement outside a module". Vì sao?',
            options: [
              'Node does not support import at all|||Node hoàn toàn không hỗ trợ import',
              'The package.json is missing "type": "module", so the file is treated as CommonJS|||package.json thiếu "type": "module" nên file bị coi là CommonJS',
              'You must always use the .cjs extension|||Luôn phải dùng đuôi .cjs',
              'import only works inside async functions|||import chỉ chạy được bên trong hàm async',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
