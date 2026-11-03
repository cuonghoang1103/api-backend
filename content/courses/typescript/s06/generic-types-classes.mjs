/**
 * TypeScript · Chương 6 · 6.3 — Interface, class generic & kiểu mặc định. Slug giữ: typescript-6-3-generic-types-classes.
 * Soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md. Code/output từ ./_ma-ts-06-3.mjs (demo6/ts-06-3, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-06-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-06-3.mjs';

const BANG_EN = `<table>
<thead><tr><th>Generic kind</th><th>Syntax</th><th>In LabFlow</th></tr></thead>
<tbody>
<tr><td>type alias</td><td><code>type Result&lt;T, E = string&gt; = …</code></td><td>the success-or-failure result</td></tr>
<tr><td>default type parameter</td><td><code>E = string</code></td><td><code>Result&lt;number&gt;</code> means <code>Result&lt;number, string&gt;</code></td></tr>
<tr><td>interface</td><td><code>interface Stack&lt;T&gt; { … }</code></td><td>a contract reused across element types</td></tr>
<tr><td>class</td><td><code>class Repo&lt;T extends { id: number }&gt; { … }</code></td><td>the repository (Lab 6)</td></tr>
<tr><td>generic method</td><td><code>map&lt;U&gt;(f: (v: T) =&gt; U): Box&lt;U&gt;</code></td><td>a method with its own type parameter</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Loại generic</th><th>Cú pháp</th><th>Trong LabFlow</th></tr></thead>
<tbody>
<tr><td>type alias</td><td><code>type Result&lt;T, E = string&gt; = …</code></td><td>kết quả thành-công-hoặc-thất-bại</td></tr>
<tr><td>tham số kiểu mặc định</td><td><code>E = string</code></td><td><code>Result&lt;number&gt;</code> nghĩa là <code>Result&lt;number, string&gt;</code></td></tr>
<tr><td>interface</td><td><code>interface Stack&lt;T&gt; { … }</code></td><td>một hợp đồng dùng lại cho nhiều kiểu phần tử</td></tr>
<tr><td>class</td><td><code>class Repo&lt;T extends { id: number }&gt; { … }</code></td><td>repository (Lab 6)</td></tr>
<tr><td>method generic</td><td><code>map&lt;U&gt;(f: (v: T) =&gt; U): Box&lt;U&gt;</code></td><td>một method có tham số kiểu riêng</td></tr>
</tbody>
</table>`;

export default {
  title: '6.3 — Generic interfaces, classes & defaults|||6.3 — Interface, class generic & kiểu mặc định',
  slug: 'typescript-6-3-generic-types-classes',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Không chỉ hàm: type alias, interface và class đều nhận tham số kiểu. Result<T, E = string> là Result generic (tổng quát hoá SlotResult) với E mặc định string — Result<number> = Result<number, string>, đổi E ⇒ error phải đúng kiểu đó (TS2322). Interface Stack<T> làm hợp đồng cho mọi kiểu phần tử; class Repo<T extends {id}> là repository của Lab 6, mỗi method nói kiểu T. Method có tham số kiểu RIÊNG (map<U>). Bẫy erasableSyntaxOnly: parameter property constructor(readonly value) ⇒ TS1294 (phải viết field + gán tay để Node strip được). Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Generic interfaces, classes &amp; defaults</h2>
<p class="lead">Type parameters are not just for functions. A <strong>type alias</strong>, an <strong>interface</strong> and a <strong>class</strong> can all take them — that is how <code>Map&lt;K, V&gt;</code>, <code>Promise&lt;T&gt;</code> and <code>Array&lt;T&gt;</code> are declared, and how you write LabFlow’s <code>Result&lt;T, E&gt;</code> and <code>Repo&lt;T&gt;</code>. This lesson adds <strong>default type parameters</strong> and generic methods, and builds the two generics Lab 6 wants.</p>

<h3>A generic type alias — and a default</h3>
<p>Chapter 5’s <code>SlotResult</code> was “ok with minutes, or failed with a code”. Make it generic over both the value and the error, with a sensible default for the error:</p>
${ma('typescript', CODE.result)}
${ra(OUT['11-result'])}
<p><code>Result&lt;T, E = string&gt;</code> is a generic type alias. The <strong>default type parameter</strong> <code>E = string</code> means you can write <code>Result&lt;number&gt;</code> and get <code>Result&lt;number, string&gt;</code> — the common case stays short. <code>parseSeats</code> returns <code>Result&lt;number&gt;</code>; the caller narrows on <code>.ok</code> exactly as in 5.2. This is the <code>Result</code> you will export in Lab 6.</p>

<h3>Overriding the default</h3>
${ma('typescript', CODE.override)}
${ra(OUT['12-override'])}
<p>Pass a second type argument and the error is that type: <code>Result&lt;number, Code&gt;</code> accepts only a <code>Code</code> for <code>error</code>, so <code>error: 'typo'</code> is <strong>TS2322</strong>. A default is a starting point, not a cage — override it when the error has real structure (a code, a validation object).</p>

<h3>A generic interface</h3>
${ma('typescript', CODE.iface)}
${ra(OUT['13-iface'])}
<p><code>interface Stack&lt;T&gt;</code> is one contract for every element type; <code>ArrayStack&lt;T&gt; implements Stack&lt;T&gt;</code> fulfils it. A <code>Stack&lt;string&gt;</code> accepts and returns strings, a <code>Stack&lt;User&gt;</code> users — the interface describes the shape, the class provides it, and the type flows through both.</p>

<h3>A generic class: the repository</h3>
${ma('typescript', CODE.klass)}
${ra(OUT['14-class'])}
<p>A <strong>generic class</strong> fixes its type parameter when you write <code>new Repo&lt;User&gt;()</code>, and every method then speaks that type: <code>add</code> takes a <code>User</code>, <code>get</code> returns <code>User | undefined</code>. The constraint <code>T extends { id: number }</code> (6.2) is what lets <code>add</code> use <code>item.id</code>. This is Lab 6’s class, in miniature — the full one returns a <code>Result</code> instead of <code>| undefined</code>.</p>

<h3>A method with its own type parameter</h3>
${ma('typescript', CODE.method)}
${ra(OUT['15-method'])}
<p><code>map&lt;U&gt;</code> introduces a new type parameter <code>U</code>, independent of the class’s <code>T</code>: a <code>Box&lt;number&gt;</code> mapped with <code>x =&gt; 'seats: ' + x</code> becomes a <code>Box&lt;string&gt;</code>. Methods, like functions, can be generic on their own.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a parameter property does not survive <code>erasableSyntaxOnly</code>.</strong> The short constructor <code>constructor(readonly value: T) {}</code> looks tidy, but it <em>emits</em> an assignment, so it is not type-only:</p>
${ma('typescript', CODE.paramprop)}
${ra(OUT['16-paramprop'])}
<p><strong>TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.</strong> The course tsconfig turns that flag on so Node can run <code>.ts</code> by stripping types (0.4) — and a parameter property is one of the few constructs that emit code (like <code>enum</code> and <code>namespace</code>). Write the field and assign it in the constructor body, as <code>Box</code> above does; Chapter 14 covers classes and this flag in full.</p>
</div>

<h3>Which generic kind, when</h3>
${BANG_EN}

<h3>💼 Interview corner</h3>
<p><strong>“Can a class be generic?”</strong> Yes — <code>class Repo&lt;T&gt;</code>; the type parameter is fixed at <code>new Repo&lt;User&gt;()</code> and every method uses it. <strong>“What is a default type parameter?”</strong> <code>&lt;E = string&gt;</code> — a fallback used when the caller omits that argument, so <code>Result&lt;number&gt;</code> works. <strong>“Interface or type alias for generics?”</strong> Either; an interface for a shape you implement or extend, a type alias when you also need unions — <code>Result</code> is a union, so it must be a type alias (4.2).</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo6/ts-06-3/practice/start/queue.ts</code> — a <code>Queue</code> hard-coded to <code>string</code>; enqueuing a number is refused for the wrong reason:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['17-pr-start'])}
<ol>
<li>Make <code>Queue</code> generic over <code>T</code>: <code>class Queue&lt;T&gt;</code>, with <code>T[]</code>, <code>enqueue(item: T)</code>, <code>dequeue(): T | undefined</code>.</li>
<li>Then <code>new Queue&lt;number&gt;()</code> accepts <code>42</code> and <code>dequeue</code> returns <code>number | undefined</code>.</li>
</ol>
<p><strong>Solution</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['18-pr-sol'])}
<p><strong>Done when:</strong> <code>new Queue&lt;number&gt;()</code> compiles and Node prints <code>42 0</code>. Code Lab adds: a generic <code>Result</code> with a default, a generic <code>Box</code> interface, and the <code>Repo</code> class.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">generic type alias</span><span class="v"><code>type Result&lt;T, E&gt; = …</code> — a named type with parameters.</span></div>
  <div class="kv"><span class="k">default type parameter</span><span class="v"><code>&lt;E = string&gt;</code> — used when the caller omits the argument.</span></div>
  <div class="kv"><span class="k">generic interface</span><span class="v"><code>interface Stack&lt;T&gt;</code> — one contract across element types.</span></div>
  <div class="kv"><span class="k">generic class</span><span class="v"><code>class Repo&lt;T&gt;</code> — fixed at <code>new</code>; every method speaks T.</span></div>
  <div class="kv"><span class="k">parameter property</span><span class="v"><code>constructor(readonly x: T)</code> — emits code, refused by <code>erasableSyntaxOnly</code> (TS1294).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Type aliases, interfaces and classes all take type parameters — that is how <code>Map</code>, <code>Promise</code> and LabFlow’s <code>Result</code>/<code>Repo</code> are built.</li>
<li>A default type parameter (<code>E = string</code>) keeps the common case short; override it when the error has structure (TS2322 if the value does not fit).</li>
<li>A generic class fixes <code>T</code> at <code>new Repo&lt;User&gt;()</code>; methods may add their own parameter (<code>map&lt;U&gt;</code>).</li>
<li>A parameter property emits code, so <code>erasableSyntaxOnly</code> refuses it (TS1294) — write the field by hand.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Generic Classes & Default Type Parameters', 'Generic classes, interfaces and default type parameters. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-classes')}
${nguon('📘', 'TypeScript 5.8 — erasableSyntaxOnly', 'Which TypeScript constructs emit code and are refused when type stripping. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html#the---erasablesyntaxonly-option')}
${lienKet({ khoa: 'api-design', bai: 'api-2-3-envelope', title: 'The same success-or-failure shape at the API edge — API Design 2.3: The response envelope', sub: 'Same: a response is “a value or an error”, modelled once and reused for every resource — exactly <code>Result&lt;T, E&gt;</code>. Different: there the envelope is a JSON shape sent over the wire with an HTTP status; here it is a generic TypeScript type alias with a default error (<code>E = string</code>) that tsc narrows on <code>ok</code> at compile time, the Result you export in Lab 6.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Interface, class generic &amp; kiểu mặc định</h2>
<p class="lead">Tham số kiểu không chỉ cho hàm. Một <strong>type alias</strong>, một <strong>interface</strong> và một <strong>class</strong> đều nhận được — đó là cách <code>Map&lt;K, V&gt;</code>, <code>Promise&lt;T&gt;</code> và <code>Array&lt;T&gt;</code> được khai báo, và cách bạn viết <code>Result&lt;T, E&gt;</code> và <code>Repo&lt;T&gt;</code> của LabFlow. Bài này thêm <strong>tham số kiểu mặc định</strong> và method generic, và dựng hai generic mà Lab 6 cần.</p>

<h3>Một type alias generic — và một kiểu mặc định</h3>
<p><code>SlotResult</code> của Chương 5 là “ổn kèm số phút, hoặc hỏng kèm một mã”. Làm nó generic trên cả giá trị lẫn lỗi, với một mặc định hợp lý cho lỗi:</p>
${ma('typescript', CODE.result)}
${ra(OUT['11-result'])}
<p><code>Result&lt;T, E = string&gt;</code> là một type alias generic. <strong>Tham số kiểu mặc định</strong> <code>E = string</code> nghĩa là bạn viết <code>Result&lt;number&gt;</code> và được <code>Result&lt;number, string&gt;</code> — trường hợp hay gặp giữ cho ngắn. <code>parseSeats</code> trả <code>Result&lt;number&gt;</code>; người gọi narrow trên <code>.ok</code> đúng như 5.2. Đây là <code>Result</code> bạn sẽ export ở Lab 6.</p>

<h3>Đè kiểu mặc định</h3>
${ma('typescript', CODE.override)}
${ra(OUT['12-override'])}
<p>Truyền một đối số kiểu thứ hai và lỗi là kiểu đó: <code>Result&lt;number, Code&gt;</code> chỉ nhận một <code>Code</code> cho <code>error</code>, nên <code>error: 'typo'</code> là <strong>TS2322</strong>. Một mặc định là điểm bắt đầu, không phải cái lồng — đè nó khi lỗi có cấu trúc thật (một mã, một object kiểm lệ).</p>

<h3>Một interface generic</h3>
${ma('typescript', CODE.iface)}
${ra(OUT['13-iface'])}
<p><code>interface Stack&lt;T&gt;</code> là một hợp đồng cho mọi kiểu phần tử; <code>ArrayStack&lt;T&gt; implements Stack&lt;T&gt;</code> thực hiện nó. Một <code>Stack&lt;string&gt;</code> nhận và trả chuỗi, một <code>Stack&lt;User&gt;</code> trả user — interface mô tả dáng, class cung cấp nó, và kiểu chảy qua cả hai.</p>

<h3>Một class generic: repository</h3>
${ma('typescript', CODE.klass)}
${ra(OUT['14-class'])}
<p>Một <strong>class generic</strong> cố định tham số kiểu khi bạn viết <code>new Repo&lt;User&gt;()</code>, và mọi method sau đó nói kiểu đó: <code>add</code> nhận một <code>User</code>, <code>get</code> trả <code>User | undefined</code>. Ràng buộc <code>T extends { id: number }</code> (6.2) là thứ cho <code>add</code> dùng <code>item.id</code>. Đây là class của Lab 6, thu nhỏ — bản đầy đủ trả một <code>Result</code> thay vì <code>| undefined</code>.</p>

<h3>Một method có tham số kiểu riêng</h3>
${ma('typescript', CODE.method)}
${ra(OUT['15-method'])}
<p><code>map&lt;U&gt;</code> giới thiệu một tham số kiểu mới <code>U</code>, độc lập với <code>T</code> của class: một <code>Box&lt;number&gt;</code> map bằng <code>x =&gt; 'seats: ' + x</code> thành một <code>Box&lt;string&gt;</code>. Method, như hàm, cũng có thể generic riêng.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — parameter property không sống sót qua <code>erasableSyntaxOnly</code>.</strong> Constructor ngắn <code>constructor(readonly value: T) {}</code> trông gọn, nhưng nó <em>sinh ra</em> một phép gán, nên không phải chỉ-kiểu:</p>
${ma('typescript', CODE.paramprop)}
${ra(OUT['16-paramprop'])}
<p><strong>TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.</strong> tsconfig của khoá bật cờ đó để Node chạy <code>.ts</code> bằng cách bỏ kiểu (0.4) — và parameter property là một trong vài cấu trúc sinh ra code (như <code>enum</code> và <code>namespace</code>). Hãy viết field và gán nó trong thân constructor, như <code>Box</code> ở trên; Chương 14 nói trọn về class và cờ này.</p>
</div>

<h3>Loại generic nào, khi nào</h3>
${BANG_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Class có generic được không?”</strong> Được — <code>class Repo&lt;T&gt;</code>; tham số kiểu cố định ở <code>new Repo&lt;User&gt;()</code> và mọi method dùng nó. <strong>“Tham số kiểu mặc định là gì?”</strong> <code>&lt;E = string&gt;</code> — giá trị lùi dùng khi người gọi bỏ đối số đó, nên <code>Result&lt;number&gt;</code> chạy. <strong>“Interface hay type alias cho generic?”</strong> Cái nào cũng được; interface cho một dáng bạn implement hay extends, type alias khi còn cần union — <code>Result</code> là một union, nên phải là type alias (4.2).</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo6/ts-06-3/practice/start/queue.ts</code> — một <code>Queue</code> gắn cứng <code>string</code>; thêm một số bị từ chối vì lý do sai:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['17-pr-start'])}
<ol>
<li>Làm <code>Queue</code> generic trên <code>T</code>: <code>class Queue&lt;T&gt;</code>, với <code>T[]</code>, <code>enqueue(item: T)</code>, <code>dequeue(): T | undefined</code>.</li>
<li>Rồi <code>new Queue&lt;number&gt;()</code> nhận <code>42</code> và <code>dequeue</code> trả <code>number | undefined</code>.</li>
</ol>
<p><strong>Lời giải</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['18-pr-sol'])}
<p><strong>Đạt khi:</strong> <code>new Queue&lt;number&gt;()</code> biên dịch và Node in <code>42 0</code>. Code Lab thêm: một <code>Result</code> generic có mặc định, một interface <code>Box</code> generic, và class <code>Repo</code>.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">generic type alias</span><span class="v"><code>type Result&lt;T, E&gt; = …</code> — một kiểu có tên kèm tham số.</span></div>
  <div class="kv"><span class="k">default type parameter (tham số kiểu mặc định)</span><span class="v"><code>&lt;E = string&gt;</code> — dùng khi người gọi bỏ đối số.</span></div>
  <div class="kv"><span class="k">generic interface</span><span class="v"><code>interface Stack&lt;T&gt;</code> — một hợp đồng cho nhiều kiểu phần tử.</span></div>
  <div class="kv"><span class="k">generic class</span><span class="v"><code>class Repo&lt;T&gt;</code> — cố định ở <code>new</code>; mọi method nói T.</span></div>
  <div class="kv"><span class="k">parameter property</span><span class="v"><code>constructor(readonly x: T)</code> — sinh ra code, bị <code>erasableSyntaxOnly</code> từ chối (TS1294).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Type alias, interface và class đều nhận tham số kiểu — đó là cách <code>Map</code>, <code>Promise</code> và <code>Result</code>/<code>Repo</code> của LabFlow được dựng.</li>
<li>Tham số kiểu mặc định (<code>E = string</code>) giữ trường hợp hay gặp cho ngắn; đè nó khi lỗi có cấu trúc (TS2322 nếu giá trị không vừa).</li>
<li>Một class generic cố định <code>T</code> ở <code>new Repo&lt;User&gt;()</code>; method có thể thêm tham số riêng (<code>map&lt;U&gt;</code>).</li>
<li>Một parameter property sinh ra code, nên <code>erasableSyntaxOnly</code> từ chối (TS1294) — viết field bằng tay.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Generic Classes & Default Type Parameters', 'Class, interface generic và tham số kiểu mặc định. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-classes')}
${nguon('📘', 'TypeScript 5.8 — erasableSyntaxOnly', 'Cấu trúc TypeScript nào sinh ra code và bị từ chối khi bỏ kiểu. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html#the---erasablesyntaxonly-option')}
${lienKet({ khoa: 'api-design', bai: 'api-2-3-envelope', title: 'Cùng một dáng thành-công-hoặc-thất-bại ở biên API — API Design 2.3: Vỏ phản hồi', sub: 'Giống: một phản hồi là “một giá trị hoặc một lỗi”, mô hình một lần và dùng lại cho mọi tài nguyên — đúng <code>Result&lt;T, E&gt;</code>. Khác: ở đó cái vỏ là một dáng JSON gửi qua mạng kèm HTTP status; ở đây là một type alias generic của TypeScript với lỗi mặc định (<code>E = string</code>) mà tsc thu hẹp trên <code>ok</code> lúc biên dịch, chính Result bạn export ở Lab 6.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
