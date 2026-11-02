/**
 * Bài 9.4 — Hàm và generic (nâng cấp 02/11/2026). Output thật: _demo/_t9/chay.sh (tsc 5.9: 5 lỗi về tham số/kiểu trả về/kiểu hàm;
 * tsc --declaration cho thấy generic giữ đúng kiểu; chạy bằng Node 22.23; 3 lỗi generic vẫn chặn).
 * Deck: scripts/slides-src/wf-9-4.mjs (9 slide, WF/v1/wf-9-4). Code Lab: wf-9-4-functions-generics.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-9-4', 'Functions and generics', 'Hàm và generic', [
  [1, 'Functions and generics',
    '<p>Functions are where types pay off most: every call in the project is checked against what the function says it needs and returns. Generics then let one function work with many types without losing track of which one. This lesson types functions step by step and shows what generics keep and refuse.</p>',
    '<p>Hàm là nơi kiểu đáng giá nhất: mọi lời gọi trong dự án đều được kiểm theo thứ hàm nói nó cần và trả về. Generic khiến một hàm làm việc với nhiều kiểu mà không mất dấu đang là kiểu nào. Bài này gắn kiểu cho hàm từng bước và cho thấy generic giữ lại gì và từ chối gì.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to type parameters and return values, use optional and default parameters, describe a callback with a function type, write a generic function that returns the same type it receives, constrain a generic with extends, and read the errors these produce.</p>',
    '<p>Bạn sẽ gắn kiểu được cho tham số và giá trị trả về, dùng tham số tuỳ chọn và mặc định, mô tả callback bằng kiểu hàm, viết hàm generic trả về đúng kiểu nó nhận, ràng buộc generic bằng extends, và đọc được các lỗi chúng sinh ra.</p>'],
  [3, 'Parameters and return types',
    '<p>Each parameter gets a type; the return type comes after the parentheses. A default value makes a parameter optional. The compiler refused a string where a number was expected, a call with too many arguments, and a function that does not return on every path.</p>',
    '<p>Mỗi tham số có một kiểu; kiểu trả về đứng sau dấu ngoặc. Giá trị mặc định làm tham số thành tuỳ chọn. Trình biên dịch từ chối một chuỗi ở chỗ cần số, một lời gọi thừa tham số, và một hàm không trả về ở mọi nhánh.</p>'],
  [4, 'Optional parameters and void',
    '<p>A question mark makes a parameter optional, so its type includes undefined. A literal union restricts the allowed values. A function that returns nothing useful has the return type void. The level warning was rejected because it is not info or error.</p>',
    '<p>Dấu hỏi làm tham số thành tuỳ chọn, nên kiểu của nó gồm cả undefined. Union literal giới hạn các giá trị được phép. Hàm không trả về gì hữu ích có kiểu trả về void. Mức warning bị từ chối vì nó không phải info hay error.</p>'],
  [5, 'Function types for callbacks',
    '<p>A type can describe a whole function: what it receives and what it returns. Assigning an arrow function to that type gives its parameter a type for free. Reading a property the event does not have was caught immediately.</p>',
    '<p>Một kiểu có thể mô tả cả một hàm: nó nhận gì và trả gì. Gán một arrow function vào kiểu đó là tham số của nó có kiểu miễn phí. Đọc một thuộc tính mà sự kiện không có bị bắt ngay.</p>'],
  [6, 'Generics keep the type',
    '<p>The letter T stands for "whatever type the caller passes". first of an array of products returns a product or undefined; first of an array of strings returns a string or undefined. One function, and the exact type survives in both cases.</p>',
    '<p>Chữ T nghĩa là "kiểu bất kỳ người gọi truyền vào". first của mảng sản phẩm trả về một sản phẩm hoặc undefined; first của mảng chuỗi trả về một chuỗi hoặc undefined. Một hàm, và kiểu chính xác được giữ nguyên ở cả hai trường hợp.</p>'],
  [7, 'Constraints with extends',
    '<p>findById only makes sense for things that have an id, so T extends an object with a numeric id. Passing an array of strings was refused. The result may be undefined when nothing matches, and it keeps the real shape, so a missing field is still caught.</p>',
    '<p>findById chỉ có nghĩa với thứ có id, nên T mở rộng một object có id kiểu số. Truyền mảng chuỗi bị từ chối. Kết quả có thể là undefined khi không khớp gì, và nó giữ đúng hình dạng thật, nên trường không tồn tại vẫn bị bắt.</p>'],
  [8, 'Generic types',
    '<p>Types can be generic too: an API response wraps any data with the time it was fetched. You already use generics every day: arrays of strings, promises of products, records of numbers. Writing your own is the same idea.</p>',
    '<p>Kiểu cũng có thể là generic: một response API bọc dữ liệu bất kỳ kèm thời điểm lấy về. Bạn đã dùng generic hằng ngày: mảng chuỗi, promise sản phẩm, record số. Tự viết cũng là cùng ý tưởng đó.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to type five small functions, write a generic groupBy and a generic fetch helper, and fix the five errors in the examples. "Done when" checks the inferred types in a declaration file and a clean compile.</p>',
    '<p>Bài luyện yêu cầu bạn gắn kiểu cho năm hàm nhỏ, viết groupBy generic và một hàm fetch generic, và sửa năm lỗi trong ví dụ. "Xong khi" kiểm các kiểu suy ra trong tệp khai báo và một lần biên dịch sạch.</p>'],
]);

export default {
  title: '9.4 — Typing functions, and a first look at generics|||9.4 — Gắn kiểu cho hàm, và làm quen với generic',
  slug: 'wf-9-4-functions-generics',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/gp5H0Vw39yw', durationSeconds: 0 },
  description: 'Kiểu tham số và kiểu trả về; tham số mặc định và tuỳ chọn; void; kiểu hàm cho callback; năm lỗi tsc 5.9 chặn (sai kiểu đối số, thừa đối số, thiếu return, mức log sai, thuộc tính không có); generic first<T>/findById<T extends { id: number }>/ApiResponse<T> với tsc --declaration in đúng kiểu được giữ; ba lỗi generic vẫn chặn.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Typing functions — and generics, the functions that remember types</h2>
<p class="lead">After this lesson you can annotate parameters and return values, use default and optional parameters, describe callbacks with function types, write generic functions and types that keep the caller's exact type, constrain generics with <code>extends</code>, and read the errors all of these produce. Every React component, Express handler and helper you write in later courses is a typed function, and <code>useState&lt;T&gt;</code>, <code>Promise&lt;T&gt;</code> and <code>Array&lt;T&gt;</code> are generics you will use daily.</p>

<h3>Step 1 — parameters, return types, defaults</h3>
${ma('typescript', CODE['_t9/9-4/functions.ts'])}
${ra(OUT['_t9/out/functions'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Line 2</span><span class="v"><code>(price: number, rate: number = 0.1): number</code> — parameter types, a default, and the return type after the parentheses.</span></div>
  <div class="kv"><span class="k">Line 6</span><span class="v">The string <code>'25000'</code> from a form (Lesson 9.1) is refused before it can be multiplied.</span></div>
  <div class="kv"><span class="k">Line 7</span><span class="v">"Expected 1-2 arguments" — a default makes a parameter optional, the count is still checked.</span></div>
  <div class="kv"><span class="k">Line 9</span><span class="v">With an explicit return type, a path that forgets to return is an error, not a hidden <code>undefined</code>.</span></div>
</div>

<h3>Step 2 — optional parameters and <code>void</code></h3>
<p>In <code>log(message: string, level?: 'info' | 'error'): void</code> (line 13), the <code>?</code> makes <code>level</code> optional, so inside the function it is <code>'info' | 'error' | undefined</code> — hence <code>level ?? 'info'</code>. The literal union rejected <code>'warning'</code> on line 17. <code>void</code> means "returns nothing useful": callers cannot accidentally use its result.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — boolean parameters nobody can read.</strong> <code>createUser('Lan', true, false)</code> type-checks perfectly and tells the reader nothing. When a function grows past two or three parameters, or has flags, take one object: <code>createUser({ name: 'Lan', isAdmin: true, sendEmail: false })</code> with an interface for it. TypeScript checks the field names, and calls explain themselves.</p></div>

<h3>Step 3 — function types for callbacks</h3>
<p><code>type Handler = (event: { type: string; at: number }) =&gt; void</code> (line 19) describes a whole function. Assigning an arrow function to it types the parameter <code>e</code> automatically (line 20) — this is how event handlers in React and route handlers in Express get their parameter types without you writing them. Line 21 read <code>e.time</code>, which the event does not have.</p>

<h3>Step 4 — generics: one function, the caller's type preserved</h3>
${ma('typescript', CODE['_t9/9-4/generics.ts'])}
${ra(OUT['_t9/out/generics'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">&lt;T&gt;</span><span class="lz-t">a type parameter</span><span class="lz-d">"Some type, chosen by the caller." Like a function parameter, but for types.</span></div>
<div class="lz-step"><span class="lz-k">items: T[]</span><span class="lz-t">T is inferred from the call</span><span class="lz-d"><code>first(products)</code> → T = the product shape; <code>first(['sql'])</code> → T = <code>string</code>.</span></div>
<div class="lz-step"><span class="lz-k">: T | undefined</span><span class="lz-t">the result uses T</span><span class="lz-d">So <code>a</code> is a product (or undefined) and <code>b</code> a string (or undefined) — the declaration file shows both.</span></div>
</div>
<p>Without generics you would choose between <code>first(items: any[]): any</code> (loses every type, Lesson 9.2) or one copy per type. <code>ApiResponse&lt;T&gt;</code> shows a generic <em>type</em>: <code>wrap(products)</code> returned <code>ApiResponse&lt;{ id; name; price }[]&gt;</code>.</p>

<h3>Step 5 — constraints: what generics still refuse</h3>
${ma('typescript', CODE['_t9/9-4/generics-errors.ts'])}
${ra(OUT['_t9/out/generics-errors'])}
<p><code>T extends { id: number }</code> means "any type, as long as it has a numeric id". An array of strings does not (line 6). The result may be <code>undefined</code> (line 9) — <code>find</code> can fail. And because T is the <em>real</em> element type, not just <code>{ id: number }</code>, TypeScript knows <code>pen</code> has <code>name</code> and <code>price</code> but no <code>colour</code> (line 10).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a generic that is really <code>any</code>.</strong> <code>function parse&lt;T&gt;(json: string): T { return JSON.parse(json); }</code> compiles and looks typed: <code>parse&lt;User&gt;(text)</code> returns a <code>User</code>. But nothing checked it — it is <code>as User</code> in disguise (Lesson 9.1). A type parameter that appears only in the return type is a red flag. Validate (Lesson 9.5) and let the validator produce the type.</p></div>
<table>
<thead><tr><th>Generic you already use</th><th>T is</th></tr></thead>
<tbody>
<tr><td><code>Array&lt;string&gt;</code> / <code>string[]</code></td><td>the element type</td></tr>
<tr><td><code>Promise&lt;ProductList&gt;</code></td><td>what <code>await</code> gives you</td></tr>
<tr><td><code>Record&lt;string, number&gt;</code></td><td>key and value types</td></tr>
<tr><td><code>Map&lt;number, User&gt;</code></td><td>key and value types</td></tr>
<tr><td><code>useState&lt;string | null&gt;(null)</code> (React)</td><td>the state's type</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Practice (40 minutes) — typed helpers</strong></p>
<ol>
<li>Copy <code>functions.ts</code> and fix its five errors (change the calls, not the function types).</li>
<li>Type these: <code>slugify(title)</code> → string; <code>clamp(n, min = 0, max = 100)</code> → number; <code>formatVnd(amount, withSymbol?)</code> → string; <code>debounce(fn, ms)</code> where fn is <code>() =&gt; void</code>; <code>onSubmit</code> as a function type taking <code>{ email: string; password: string }</code>.</li>
<li>Write <code>function groupBy&lt;T, K extends string&gt;(items: T[], key: (item: T) =&gt; K): Record&lt;K, T[]&gt;</code> and group the Chapter 8 posts by <code>published ? 'live' : 'draft'</code>.</li>
<li>Write <code>async function getJson&lt;T&gt;(url: string, check: (v: unknown) =&gt; v is T): Promise&lt;T&gt;</code> that throws if <code>check</code> fails — a generic that does <em>not</em> lie.</li>
<li>Emit declarations (<code>npx tsc --declaration --emitDeclarationOnly --outDir out</code>) and read the inferred types.</li>
</ol>
<p>Hint: <code>v is T</code> is a "type predicate": a function returning boolean that also tells TypeScript what was proven.</p>
<p><strong>Done when:</strong> tsc reports no errors; the declaration file shows <code>groupBy</code> returning <code>Record&lt;"live" | "draft", …[]&gt;</code>; and <code>getJson</code> throws for a response that fails <code>check</code> instead of returning it. Then Code Lab module 9.4.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">parameter type</span><span class="v">kiểu tham số.</span></div>
  <div class="kv"><span class="k">return type</span><span class="v">kiểu trả về — sau dấu ngoặc.</span></div>
  <div class="kv"><span class="k">default / optional parameter</span><span class="v">tham số mặc định / tuỳ chọn (?).</span></div>
  <div class="kv"><span class="k">void</span><span class="v">không trả về gì hữu ích.</span></div>
  <div class="kv"><span class="k">function type</span><span class="v">kiểu hàm — <code>(e: E) =&gt; void</code>.</span></div>
  <div class="kv"><span class="k">callback</span><span class="v">hàm truyền vào để được gọi lại.</span></div>
  <div class="kv"><span class="k">generic</span><span class="v">tổng quát — có tham số kiểu &lt;T&gt;.</span></div>
  <div class="kv"><span class="k">type parameter</span><span class="v">tham số kiểu — T.</span></div>
  <div class="kv"><span class="k">constraint (extends)</span><span class="v">ràng buộc — T phải có id…</span></div>
  <div class="kv"><span class="k">type predicate</span><span class="v">vị từ kiểu — <code>v is T</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Annotate parameters; add a return type when you want the function's promise fixed.</li>
  <li>Defaults and <code>?</code> make parameters optional; the argument count is still checked.</li>
  <li>Function types describe callbacks and type their parameters for free.</li>
  <li>Generics (<code>&lt;T&gt;</code>) keep the caller's exact type through a function or a type.</li>
  <li><code>T extends …</code> limits what T can be while keeping its real shape.</li>
  <li>A type parameter only in the return type is usually a hidden <code>as</code> — validate instead.</li>
</ul>
${nguon('📗', 'TypeScript Handbook — More on Functions', 'Function types, optional parameters, void, overloads', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('📘', 'TypeScript Handbook — Generics', 'Type parameters, constraints and generic types', 'https://www.typescriptlang.org/docs/handbook/2/generics.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-6-1-why-generics', title: 'TypeScript 6.1 — Why generics', sub: 'Generics in depth: constraints, keyof, generic classes', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Gắn kiểu cho hàm — và generic, những hàm nhớ được kiểu</h2>
<p class="lead">Học xong bài này bạn chú thích được tham số và giá trị trả về, dùng tham số mặc định và tuỳ chọn, mô tả callback bằng kiểu hàm, viết hàm và kiểu generic giữ đúng kiểu của người gọi, ràng buộc generic bằng <code>extends</code>, và đọc được các lỗi mà tất cả những thứ này sinh ra. Mọi component React, handler Express và hàm tiện ích bạn viết ở các khoá sau đều là hàm có kiểu, và <code>useState&lt;T&gt;</code>, <code>Promise&lt;T&gt;</code>, <code>Array&lt;T&gt;</code> là những generic bạn sẽ dùng hằng ngày.</p>

<h3>Bước 1 — tham số, kiểu trả về, giá trị mặc định</h3>
${ma('typescript', CODE['_t9/9-4/functions.ts'])}
${ra(OUT['_t9/out/functions'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Dòng 2</span><span class="v"><code>(price: number, rate: number = 0.1): number</code> — kiểu tham số, một giá trị mặc định, và kiểu trả về sau dấu ngoặc.</span></div>
  <div class="kv"><span class="k">Dòng 6</span><span class="v">Chuỗi <code>'25000'</code> từ form (Bài 9.1) bị từ chối trước khi kịp bị nhân.</span></div>
  <div class="kv"><span class="k">Dòng 7</span><span class="v">"Expected 1-2 arguments" — giá trị mặc định làm tham số thành tuỳ chọn, nhưng số lượng vẫn được kiểm.</span></div>
  <div class="kv"><span class="k">Dòng 9</span><span class="v">Có kiểu trả về rõ ràng, một nhánh quên return là lỗi, không phải một <code>undefined</code> ẩn.</span></div>
</div>

<h3>Bước 2 — tham số tuỳ chọn và <code>void</code></h3>
<p>Trong <code>log(message: string, level?: 'info' | 'error'): void</code> (dòng 13), dấu <code>?</code> làm <code>level</code> thành tuỳ chọn, nên bên trong hàm nó là <code>'info' | 'error' | undefined</code> — vì vậy có <code>level ?? 'info'</code>. Union literal từ chối <code>'warning'</code> ở dòng 17. <code>void</code> nghĩa là "không trả về gì hữu ích": người gọi không thể vô tình dùng kết quả của nó.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tham số boolean không ai đọc hiểu.</strong> <code>createUser('Lan', true, false)</code> qua kiểm kiểu hoàn hảo mà chẳng nói gì với người đọc. Khi hàm có hơn hai ba tham số, hay có cờ, hãy nhận một object: <code>createUser({ name: 'Lan', isAdmin: true, sendEmail: false })</code> kèm một interface cho nó. TypeScript kiểm tên trường, và lời gọi tự giải thích.</p></div>

<h3>Bước 3 — kiểu hàm cho callback</h3>
<p><code>type Handler = (event: { type: string; at: number }) =&gt; void</code> (dòng 19) mô tả cả một hàm. Gán một arrow function vào nó là tham số <code>e</code> tự có kiểu (dòng 20) — đó là cách handler sự kiện trong React và route handler trong Express có kiểu tham số mà bạn không cần viết. Dòng 21 đọc <code>e.time</code>, thứ sự kiện không có.</p>

<h3>Bước 4 — generic: một hàm, giữ đúng kiểu của người gọi</h3>
${ma('typescript', CODE['_t9/9-4/generics.ts'])}
${ra(OUT['_t9/out/generics'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">&lt;T&gt;</span><span class="lz-t">một tham số kiểu</span><span class="lz-d">"Một kiểu nào đó, do người gọi chọn." Như tham số hàm, nhưng dành cho kiểu.</span></div>
<div class="lz-step"><span class="lz-k">items: T[]</span><span class="lz-t">T được suy ra từ lời gọi</span><span class="lz-d"><code>first(products)</code> → T = hình dạng sản phẩm; <code>first(['sql'])</code> → T = <code>string</code>.</span></div>
<div class="lz-step"><span class="lz-k">: T | undefined</span><span class="lz-t">kết quả dùng T</span><span class="lz-d">Nên <code>a</code> là một sản phẩm (hoặc undefined) và <code>b</code> là một chuỗi (hoặc undefined) — tệp khai báo cho thấy cả hai.</span></div>
</div>
<p>Không có generic, bạn phải chọn giữa <code>first(items: any[]): any</code> (mất hết kiểu, Bài 9.2) hoặc mỗi kiểu một bản sao. <code>ApiResponse&lt;T&gt;</code> cho thấy một <em>kiểu</em> generic: <code>wrap(products)</code> trả về <code>ApiResponse&lt;{ id; name; price }[]&gt;</code>.</p>

<h3>Bước 5 — ràng buộc: những gì generic vẫn từ chối</h3>
${ma('typescript', CODE['_t9/9-4/generics-errors.ts'])}
${ra(OUT['_t9/out/generics-errors'])}
<p><code>T extends { id: number }</code> nghĩa là "kiểu bất kỳ, miễn là có id kiểu số". Mảng chuỗi thì không có (dòng 6). Kết quả có thể là <code>undefined</code> (dòng 9) — <code>find</code> có thể không tìm thấy. Và vì T là kiểu phần tử <em>thật</em>, không chỉ <code>{ id: number }</code>, TypeScript biết <code>pen</code> có <code>name</code> và <code>price</code> nhưng không có <code>colour</code> (dòng 10).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — một generic thật ra là <code>any</code>.</strong> <code>function parse&lt;T&gt;(json: string): T { return JSON.parse(json); }</code> biên dịch được và trông có kiểu: <code>parse&lt;User&gt;(text)</code> trả về một <code>User</code>. Nhưng chẳng có gì được kiểm — đó là <code>as User</code> đội lốt (Bài 9.1). Một tham số kiểu chỉ xuất hiện ở kiểu trả về là dấu hiệu đáng ngờ. Hãy kiểm dữ liệu (Bài 9.5) và để bộ kiểm sinh ra kiểu.</p></div>
<table>
<thead><tr><th>Generic bạn đã dùng</th><th>T là</th></tr></thead>
<tbody>
<tr><td><code>Array&lt;string&gt;</code> / <code>string[]</code></td><td>kiểu phần tử</td></tr>
<tr><td><code>Promise&lt;ProductList&gt;</code></td><td>thứ <code>await</code> trả cho bạn</td></tr>
<tr><td><code>Record&lt;string, number&gt;</code></td><td>kiểu khoá và giá trị</td></tr>
<tr><td><code>Map&lt;number, User&gt;</code></td><td>kiểu khoá và giá trị</td></tr>
<tr><td><code>useState&lt;string | null&gt;(null)</code> (React)</td><td>kiểu của state</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Luyện tập (40 phút) — các hàm tiện ích có kiểu</strong></p>
<ol>
<li>Chép <code>functions.ts</code> và sửa năm lỗi của nó (sửa lời gọi, không sửa kiểu của hàm).</li>
<li>Gắn kiểu cho: <code>slugify(title)</code> → string; <code>clamp(n, min = 0, max = 100)</code> → number; <code>formatVnd(amount, withSymbol?)</code> → string; <code>debounce(fn, ms)</code> với fn là <code>() =&gt; void</code>; <code>onSubmit</code> là kiểu hàm nhận <code>{ email: string; password: string }</code>.</li>
<li>Viết <code>function groupBy&lt;T, K extends string&gt;(items: T[], key: (item: T) =&gt; K): Record&lt;K, T[]&gt;</code> và gom các bài của Chương 8 theo <code>published ? 'live' : 'draft'</code>.</li>
<li>Viết <code>async function getJson&lt;T&gt;(url: string, check: (v: unknown) =&gt; v is T): Promise&lt;T&gt;</code> ném lỗi nếu <code>check</code> thất bại — một generic <em>không</em> nói dối.</li>
<li>Xuất khai báo (<code>npx tsc --declaration --emitDeclarationOnly --outDir out</code>) và đọc các kiểu suy ra.</li>
</ol>
<p>Gợi ý: <code>v is T</code> là "vị từ kiểu": một hàm trả boolean đồng thời nói cho TypeScript biết điều gì đã được chứng minh.</p>
<p><strong>Xong khi:</strong> tsc không báo lỗi; tệp khai báo cho thấy <code>groupBy</code> trả <code>Record&lt;"live" | "draft", …[]&gt;</code>; và <code>getJson</code> ném lỗi với response không qua <code>check</code> thay vì trả nó về. Sau đó làm module Code Lab 9.4.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">parameter type</span><span class="v">kiểu tham số.</span></div>
  <div class="kv"><span class="k">return type</span><span class="v">kiểu trả về — sau dấu ngoặc.</span></div>
  <div class="kv"><span class="k">default / optional parameter</span><span class="v">tham số mặc định / tuỳ chọn (?).</span></div>
  <div class="kv"><span class="k">void</span><span class="v">không trả về gì hữu ích.</span></div>
  <div class="kv"><span class="k">function type</span><span class="v">kiểu hàm — <code>(e: E) =&gt; void</code>.</span></div>
  <div class="kv"><span class="k">callback</span><span class="v">hàm truyền vào để được gọi lại.</span></div>
  <div class="kv"><span class="k">generic</span><span class="v">tổng quát — có tham số kiểu &lt;T&gt;.</span></div>
  <div class="kv"><span class="k">type parameter</span><span class="v">tham số kiểu — T.</span></div>
  <div class="kv"><span class="k">constraint (extends)</span><span class="v">ràng buộc — T phải có id…</span></div>
  <div class="kv"><span class="k">type predicate</span><span class="v">vị từ kiểu — <code>v is T</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chú thích tham số; thêm kiểu trả về khi bạn muốn cố định lời hứa của hàm.</li>
  <li>Giá trị mặc định và <code>?</code> làm tham số thành tuỳ chọn; số đối số vẫn được kiểm.</li>
  <li>Kiểu hàm mô tả callback và cho tham số của nó kiểu miễn phí.</li>
  <li>Generic (<code>&lt;T&gt;</code>) giữ đúng kiểu của người gọi qua một hàm hay một kiểu.</li>
  <li><code>T extends …</code> giới hạn T nhưng vẫn giữ hình dạng thật của nó.</li>
  <li>Tham số kiểu chỉ có ở kiểu trả về thường là một <code>as</code> ẩn — hãy kiểm dữ liệu thay vào đó.</li>
</ul>
${nguon('📗', 'TypeScript Handbook — More on Functions', 'Kiểu hàm, tham số tuỳ chọn, void, overload', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('📘', 'TypeScript Handbook — Generics', 'Tham số kiểu, ràng buộc và kiểu generic', 'https://www.typescriptlang.org/docs/handbook/2/generics.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-6-1-why-generics', title: 'TypeScript 6.1 — Vì sao cần generic', sub: 'Generic chuyên sâu: ràng buộc, keyof, lớp generic', cta: 'Mở bài' })}
</div>
`,
};
