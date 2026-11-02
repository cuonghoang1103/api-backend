/**
 * Bài 4.3 — Hàm (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/4-3).
 * Deck: scripts/slides-src/wf-4-3.mjs (9 slide, WF/v1/wf-4-3). Code Lab: module 4.3 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-4-3', 'Functions', 'Hàm', [
  [1, 'Functions',
    '<p>A function is a named piece of work you can run as often as you like. Functions are how programs stay readable: instead of one long list of steps, you get small parts with clear names. In JavaScript they are also values, which is the key to events, arrays and React.</p>',
    '<p>Hàm là một phần việc có tên, chạy bao nhiêu lần cũng được. Hàm giúp chương trình dễ đọc: thay vì một danh sách bước dài, bạn có những phần nhỏ với tên rõ ràng. Trong JavaScript hàm còn là giá trị, và đó là chìa khoá cho sự kiện, mảng và React.</p>'],
  [2, 'After this lesson you can…',
    '<p>The outcome that matters most later is the fifth: understanding that a function is a value you can pass around. Every click handler and every array method in the next lessons relies on it, and so does nearly every line of React.</p>',
    '<p>Kết quả quan trọng nhất về sau là điều thứ năm: hiểu rằng hàm là một giá trị có thể truyền đi. Mọi bộ xử lý cú bấm và mọi phương thức mảng ở các bài sau đều dựa vào nó, và gần như mọi dòng React cũng vậy.</p>'],
  [3, 'Three ways to write a function',
    '<p>A declaration, an expression and an arrow function do the same job. Declarations are hoisted, so you can call them before the line where they are written; a <code>const</code> arrow cannot be used before its line, as the error shows. Arrows are the everyday choice for short functions.</p>',
    '<p>Khai báo, biểu thức và arrow function làm cùng một việc. Khai báo được nâng lên, nên bạn gọi được trước dòng định nghĩa; arrow gán vào <code>const</code> thì không dùng được trước dòng của nó, như lỗi cho thấy. Arrow là lựa chọn hằng ngày cho hàm ngắn.</p>'],
  [4, 'return, and the ways it goes missing',
    '<p>A function without <code>return</code> gives <code>undefined</code>. An arrow with braces needs an explicit return. Returning an object from an arrow needs parentheses. And a line break straight after <code>return</code> ends the statement. All four mistakes produce <code>undefined</code> silently.</p>',
    '<p>Hàm không có <code>return</code> cho ra <code>undefined</code>. Arrow có ngoặc nhọn cần return tường minh. Trả về object từ arrow cần ngoặc tròn. Và một lần xuống dòng ngay sau <code>return</code> sẽ kết thúc câu lệnh. Cả bốn lỗi đều âm thầm cho ra <code>undefined</code>.</p>'],
  [5, 'Parameters',
    '<p>Defaults are used when an argument is missing or undefined, but not when it is null. Rest parameters collect any number of arguments into an array. An options object with destructuring makes calls readable. And an object passed in is the same object, so changing it changes the caller’s copy.</p>',
    '<p>Giá trị mặc định được dùng khi thiếu đối số hoặc đối số là undefined, nhưng không dùng khi là null. Tham số rest gom bao nhiêu đối số cũng được vào một mảng. Một object tuỳ chọn có destructuring giúp lời gọi dễ đọc. Và object truyền vào là chính object đó, nên sửa nó là sửa luôn bản của bên gọi.</p>'],
  [6, 'Scope',
    '<p>A function can see variables outside it, but the outside cannot see inside. Each block gets its own scope, so an inner <code>x</code> can shadow an outer one. Globals that anyone can change, like <code>count</code> here, make bugs hard to trace.</p>',
    '<p>Hàm nhìn thấy biến bên ngoài nó, nhưng bên ngoài không nhìn vào trong. Mỗi khối có phạm vi riêng, nên một <code>x</code> bên trong có thể che <code>x</code> bên ngoài. Biến toàn cục ai cũng sửa được, như <code>count</code> ở đây, khiến lỗi rất khó lần.</p>'],
  [7, 'Functions are values',
    '<p>You can store a function in an object, pass it to another function, and return it from a function. A function passed in to be called later is a callback. The last lines show the classic mistake: writing the parentheses calls the function now instead of handing it over.</p>',
    '<p>Bạn có thể cất hàm trong object, truyền nó vào hàm khác, và trả nó ra từ một hàm. Hàm được truyền vào để gọi sau gọi là callback. Mấy dòng cuối cho thấy lỗi kinh điển: viết thêm dấu ngoặc là gọi hàm ngay thay vì trao nó đi.</p>'],
  [8, 'Pure functions',
    '<p>A pure function depends only on its inputs and changes nothing outside. The pure version returned a new array and left the original alone; the impure one changed both the input and a global counter. Pure functions are easy to test and are what React expects.</p>',
    '<p>Hàm thuần chỉ phụ thuộc vào đầu vào và không thay đổi gì bên ngoài. Bản thuần trả về mảng mới và để yên mảng gốc; bản không thuần sửa cả đầu vào lẫn một bộ đếm toàn cục. Hàm thuần dễ kiểm thử và là thứ React mong đợi.</p>'],
  [9, 'Summary & practice',
    '<p>The practice builds a few small, pure helper functions for a shop and calls them through a callback. "Done when" includes exact outputs and a check that the original data was not changed.</p>',
    '<p>Bài luyện dựng vài hàm trợ giúp nhỏ, thuần, cho một cửa hàng và gọi chúng qua callback. "Xong khi" gồm output chính xác và một phép kiểm rằng dữ liệu gốc không bị đổi.</p>'],
]);

export default {
  title: '4.3 — Functions: reusable logic|||4.3 — Hàm: logic dùng lại được',
  slug: 'wf-4-3-functions',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/xUI5Tsl2JpY', durationSeconds: 0 },
  description: 'Ba cách viết hàm và hoisting, return và bốn cách nó âm thầm biến mất, tham số mặc định/rest/object tuỳ chọn, object truyền vào là dùng chung, phạm vi và che biến, hàm là giá trị (callback, trả về hàm, truyền vs gọi), hàm thuần. Output chạy thật trong Chromium.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Naming a piece of work, and using it again</h2>
<p class="lead">After this lesson you can write functions in all three styles, return values reliably, use default and rest parameters, predict which variables a function can see, pass functions to other functions, and write pure functions that are easy to test. You need this because a program of any size is built from functions, and because in JavaScript a function is also a value: event handlers (Lesson 4.5), array methods (Lesson 4.4), promises (Chapter 5) and every React component are functions passed around.</p>

<h3>Step 1 — three ways to write a function</h3>
${ma('javascript', CODE['4-3/ba-kieu.js'])}
${ra(OUT['4-3/ba-kieu'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Define</span><span class="lz-t">Parameters</span><span class="lz-d">The names in the parentheses: <code>a</code>, <code>b</code>. Placeholders for input.</span></div>
<div class="lz-step"><span class="lz-k">Call</span><span class="lz-t">Arguments</span><span class="lz-d">The real values: <code>add(2, 3)</code>. They fill the parameters in order.</span></div>
<div class="lz-step"><span class="lz-k">Run</span><span class="lz-t">The body</span><span class="lz-d">Runs from the top, with its own fresh variables, every time.</span></div>
<div class="lz-step"><span class="lz-k">Return</span><span class="lz-t">The result</span><span class="lz-d"><code>return</code> sends a value back to where it was called, and stops the function.</span></div>
</div>
<table>
<thead><tr><th>Style</th><th>Written as</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>Declaration</td><td><code>function add(a, b) { … }</code></td><td>Hoisted: can be called before its line</td></tr>
<tr><td>Expression</td><td><code>const add = function (a, b) { … };</code></td><td>A value stored in a variable</td></tr>
<tr><td>Arrow</td><td><code>const add = (a, b) =&gt; a + b;</code></td><td>Short; implicit return without braces; its own rules for <code>this</code> (Lesson 11.2)</td></tr>
</tbody>
</table>
<p>The error in the output comes from calling an arrow stored in a <code>const</code> before its line. Declarations do not have that problem. In everyday code, top-level helpers are often declarations, and short functions passed around are arrows.</p>

<h3>Step 2 — <code>return</code>, and four ways it silently goes missing</h3>
${ma('javascript', CODE['4-3/tra-ve.js'])}
${ra(OUT['4-3/tra-ve'])}
<ol>
<li><strong>Arrow with braces:</strong> <code>(x) =&gt; { x * 2; }</code> calculates and throws the result away. With braces you must write <code>return</code>.</li>
<li><strong>No return at all:</strong> <code>log</code> printed "hello" and returned <code>undefined</code>. Printing is not returning.</li>
<li><strong>Returning an object from an arrow:</strong> <code>{ name }</code> after the arrow is read as a function body. Wrap it: <code>({ name })</code>.</li>
<li><strong>A line break after <code>return</code>:</strong> JavaScript inserts a semicolon there, so the function returns nothing. Keep the value on the same line, or open the bracket on it.</li>
</ol>
<p>The last example shows that <code>return</code> ends the function immediately, even inside a loop. That is useful: as soon as you find what you need, stop.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>console.log</code> instead of <code>return</code>.</strong> Beginners often "return" a result by printing it. It looks right in the Console, and then <code>const total = sum(cart)</code> is <code>undefined</code>. A function that calculates something should return it; the caller decides whether to print it. Keep calculation and display separate.</p></div>

<h3>Step 3 — parameters</h3>
${ma('javascript', CODE['4-3/tham-so.js'])}
${ra(OUT['4-3/tham-so'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Default value</span><span class="v"><code>name = 'friend'</code> is used when the argument is missing or <code>undefined</code>. Not for <code>null</code>: "Hello null!" above.</span></div>
  <div class="kv"><span class="k">Rest parameter</span><span class="v"><code>...nums</code> collects the remaining arguments into a real array, even an empty one.</span></div>
  <div class="kv"><span class="k">Options object</span><span class="v"><code>createCard({ title, price = 0 })</code>: named arguments, any order, easy to extend. React components receive their props this way.</span></div>
</div>
<p>Calling a function with the wrong number of arguments is allowed: missing ones are <code>undefined</code>, extra ones are ignored. That is flexible, and it hides typos, which is one reason for TypeScript (Chapter 9).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a function that changes its argument.</strong> <code>addTax(cart)</code> received the caller's object, not a copy (Lesson 4.1), and the total changed outside the function, including a floating-point tail: <code>110.00000000000001</code>. Callers do not expect that. Return a new object instead: <code>return { ...cart, total: cart.total * 1.1 };</code>.</p></div>

<h3>Step 4 — scope: who can see what</h3>
${ma('javascript', CODE['4-3/pham-vi.js'])}
${ra(OUT['4-3/pham-vi'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Global scope</span><span class="lz-t">the whole file</span><span class="lz-d"><code>site</code>. Visible everywhere, so also changeable from everywhere.</span></div>
<div class="lz-layer"><span class="lz-k">Function scope</span><span class="lz-t">inside <code>outer</code></span><span class="lz-d"><code>a</code>. Visible to <code>outer</code> and to functions written inside it.</span></div>
<div class="lz-layer"><span class="lz-k">Inner scope</span><span class="lz-t">inside <code>inner</code></span><span class="lz-d"><code>b</code>. Visible only here.</span></div>
</div>
<p>When code uses a name, JavaScript looks in the current scope, then outward, layer by layer, and stops at the first match. It never looks inward, which is why <code>typeof b</code> outside is <code>undefined</code>. A nearer variable with the same name <strong>shadows</strong> the outer one.</p>
<p>Keep variables in the smallest scope that works. The last example shows why: <code>count</code> is global, so any function can change it, and when it holds a wrong value you have to read the whole program to find out who did it.</p>

<h3>Step 5 — functions are values</h3>
${ma('javascript', CODE['4-3/gia-tri-ham.js'])}
${ra(OUT['4-3/gia-tri-ham'])}
<p>A function can be stored in an object, passed in, and returned, just like a number. A function passed to another function, to be called by it, is a <strong>callback</strong>: <code>twice</code> calls <code>fn</code> twice, and <code>map</code> calls your arrow once per item. <code>makeCounter</code> returns a function that keeps its own <code>n</code>; Lesson 11.1 explains this <em>closure</em> in depth.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — calling instead of passing.</strong> <code>button.onClick = shout</code> hands over the function. <code>button.onClick = shout('x')</code> calls it <em>now</em> and stores its result, a string: the output shows <code>function</code> then <code>string</code>. In the DOM this is the bug where a handler runs once when the page loads and never on click: <code>addEventListener('click', save())</code> instead of <code>addEventListener('click', save)</code>. If you need to pass arguments, wrap it: <code>() =&gt; save(id)</code>.</p></div>

<h3>Step 6 — pure functions</h3>
${ma('javascript', CODE['4-3/thuan-khiet.js'])}
${ra(OUT['4-3/thuan-khiet'])}
<p>A <strong>pure function</strong> returns the same output for the same input and changes nothing outside: no global variables, no modified arguments, no printing. <code>addPure</code> left <code>a</code> alone and returned a new array. <code>addImpure</code> changed its input and a global counter. Pure functions are easy to test (one input, one expected output; Lesson 13.2), safe to reuse, and they are exactly what React expects from components. Programs still need side effects — saving data, updating the page — but keep them at the edges, in a few clearly named places.</p>

<h3>Writing good functions</h3>
<ul>
<li><strong>One job.</strong> If the name needs "and", split it.</li>
<li><strong>A verb for a name:</strong> <code>calculateTotal</code>, <code>formatPrice</code>, <code>isValidEmail</code> (a question for booleans).</li>
<li><strong>Short.</strong> If it does not fit on a screen, it is probably several functions.</li>
<li><strong>Few parameters.</strong> More than three: use an options object.</li>
</ul>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — shop helpers</strong></p>
<pre><code class="language-javascript">const cart = [
  { name: 'Pen', price: 15000, qty: 2 },
  { name: 'Book', price: 120000, qty: 1 },
];</code></pre>
<ol>
<li>Write a pure <code>lineTotal(item)</code> and <code>cartTotal(cart)</code> (use a loop or <code>reduce</code>).</li>
<li>Write <code>formatVnd(n)</code> that returns <code>"150.000 ₫"</code> using <code>n.toLocaleString('vi-VN')</code>.</li>
<li>Write <code>applyDiscount(cart, percent = 0)</code> that returns a <em>new</em> cart with lower prices.</li>
<li>Write <code>report(cart, format)</code> that takes a formatting function as a callback, and call it with <code>formatVnd</code>.</li>
</ol>
<p>Hint: test each function alone in the Console before combining them.</p>
<p><strong>Done when:</strong> <code>report(cart, formatVnd)</code> prints <code>150.000 ₫</code>; <code>cartTotal(applyDiscount(cart, 10))</code> is 135000; <code>cart[0].price</code> is still 15000 afterwards; and none of your functions use <code>console.log</code> except <code>report</code>. Then Code Lab module 4.3.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">function</span><span class="v">hàm — một phần việc có tên.</span></div>
  <div class="kv"><span class="k">parameter / argument</span><span class="v">tham số (tên) / đối số (giá trị thật khi gọi).</span></div>
  <div class="kv"><span class="k">return value</span><span class="v">giá trị trả về.</span></div>
  <div class="kv"><span class="k">arrow function</span><span class="v">hàm mũi tên — cú pháp ngắn.</span></div>
  <div class="kv"><span class="k">implicit return</span><span class="v">trả về ngầm — arrow không có ngoặc nhọn.</span></div>
  <div class="kv"><span class="k">default / rest parameter</span><span class="v">tham số mặc định / tham số gom phần còn lại.</span></div>
  <div class="kv"><span class="k">scope</span><span class="v">phạm vi — nơi một tên nhìn thấy được.</span></div>
  <div class="kv"><span class="k">shadowing</span><span class="v">che biến — tên gần hơn che tên xa hơn.</span></div>
  <div class="kv"><span class="k">callback</span><span class="v">hàm được truyền vào để gọi sau.</span></div>
  <div class="kv"><span class="k">pure function</span><span class="v">hàm thuần — không tác dụng phụ.</span></div>
  <div class="kv"><span class="k">side effect</span><span class="v">tác dụng phụ — thay đổi bên ngoài hàm.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Declarations are hoisted; <code>const</code> arrows cannot be used before their line.</li>
  <li>Braces need <code>return</code>; objects from arrows need <code>( )</code>; no line break after <code>return</code>.</li>
  <li>Return results; print only at the edge.</li>
  <li>Defaults replace <code>undefined</code>, not <code>null</code>; rest collects into an array; use an options object for many arguments.</li>
  <li>Objects passed in are shared: return a new one instead of changing it.</li>
  <li>Scope looks outward, never inward. Keep variables local.</li>
  <li>Functions are values: pass <code>save</code>, not <code>save()</code>.</li>
  <li>Prefer pure functions; keep side effects at the edges.</li>
</ul>
${nguon('📗', 'MDN — Functions', 'The guide, from declarations to closures', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions')}
${nguon('📘', 'javascript.info — Functions', 'Basics, arrow functions and function expressions, with tasks', 'https://javascript.info/function-basics')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-2-ham-closure-this', title: 'Node.js 1.2 — functions, closures and this', sub: 'The same ideas one step further, in a backend context', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Đặt tên cho một phần việc, và dùng lại nó</h2>
<p class="lead">Học xong bài này bạn viết được hàm theo cả ba kiểu, trả về giá trị một cách chắc chắn, dùng tham số mặc định và rest, đoán được hàm nhìn thấy những biến nào, truyền hàm vào hàm khác, và viết hàm thuần dễ kiểm thử. Bạn cần điều này vì chương trình cỡ nào cũng dựng từ hàm, và vì trong JavaScript hàm còn là một giá trị: bộ xử lý sự kiện (Bài 4.5), phương thức mảng (Bài 4.4), promise (Chương 5) và mọi component React đều là hàm được truyền qua lại.</p>

<h3>Bước 1 — ba cách viết một hàm</h3>
${ma('javascript', CODE['4-3/ba-kieu.js'])}
${ra(OUT['4-3/ba-kieu'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Định nghĩa</span><span class="lz-t">Tham số</span><span class="lz-d">Các tên trong ngoặc: <code>a</code>, <code>b</code>. Chỗ giữ cho đầu vào.</span></div>
<div class="lz-step"><span class="lz-k">Gọi</span><span class="lz-t">Đối số</span><span class="lz-d">Giá trị thật: <code>add(2, 3)</code>. Chúng lấp vào tham số theo thứ tự.</span></div>
<div class="lz-step"><span class="lz-k">Chạy</span><span class="lz-t">Thân hàm</span><span class="lz-d">Chạy từ trên xuống, với bộ biến mới tinh, ở mỗi lần gọi.</span></div>
<div class="lz-step"><span class="lz-k">Trả về</span><span class="lz-t">Kết quả</span><span class="lz-d"><code>return</code> gửi một giá trị về chỗ gọi, và dừng hàm.</span></div>
</div>
<table>
<thead><tr><th>Kiểu</th><th>Viết là</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>Khai báo</td><td><code>function add(a, b) { … }</code></td><td>Được nâng lên: gọi được trước dòng của nó</td></tr>
<tr><td>Biểu thức</td><td><code>const add = function (a, b) { … };</code></td><td>Một giá trị cất trong biến</td></tr>
<tr><td>Arrow</td><td><code>const add = (a, b) =&gt; a + b;</code></td><td>Ngắn; trả về ngầm khi không có ngoặc nhọn; có luật riêng về <code>this</code> (Bài 11.2)</td></tr>
</tbody>
</table>
<p>Lỗi trong output đến từ việc gọi một arrow cất trong <code>const</code> trước dòng của nó. Khai báo không gặp vấn đề đó. Trong mã hằng ngày, hàm trợ giúp ở cấp trên cùng thường là khai báo, còn hàm ngắn được truyền đi là arrow.</p>

<h3>Bước 2 — <code>return</code>, và bốn cách nó âm thầm biến mất</h3>
${ma('javascript', CODE['4-3/tra-ve.js'])}
${ra(OUT['4-3/tra-ve'])}
<ol>
<li><strong>Arrow có ngoặc nhọn:</strong> <code>(x) =&gt; { x * 2; }</code> tính xong rồi vứt kết quả. Có ngoặc nhọn thì phải viết <code>return</code>.</li>
<li><strong>Không có return:</strong> <code>log</code> in "hello" và trả về <code>undefined</code>. In ra không phải trả về.</li>
<li><strong>Trả object từ arrow:</strong> <code>{ name }</code> sau mũi tên bị đọc thành thân hàm. Hãy bọc lại: <code>({ name })</code>.</li>
<li><strong>Xuống dòng sau <code>return</code>:</strong> JavaScript tự chèn dấu chấm phẩy ở đó, nên hàm không trả gì. Giữ giá trị trên cùng dòng, hoặc mở ngoặc ngay trên dòng đó.</li>
</ol>
<p>Ví dụ cuối cho thấy <code>return</code> kết thúc hàm ngay lập tức, kể cả trong vòng lặp. Điều đó có ích: tìm thấy thứ cần tìm là dừng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>console.log</code> thay cho <code>return</code>.</strong> Người mới hay "trả về" kết quả bằng cách in nó ra. Trong Console trông đúng, rồi <code>const total = sum(cart)</code> lại là <code>undefined</code>. Hàm tính toán thì nên trả về; bên gọi quyết định có in hay không. Hãy tách việc tính và việc hiển thị.</p></div>

<h3>Bước 3 — tham số</h3>
${ma('javascript', CODE['4-3/tham-so.js'])}
${ra(OUT['4-3/tham-so'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Giá trị mặc định</span><span class="v"><code>name = 'friend'</code> được dùng khi thiếu đối số hoặc là <code>undefined</code>. Không dùng cho <code>null</code>: "Hello null!" ở trên.</span></div>
  <div class="kv"><span class="k">Tham số rest</span><span class="v"><code>...nums</code> gom các đối số còn lại vào một mảng thật, kể cả mảng rỗng.</span></div>
  <div class="kv"><span class="k">Object tuỳ chọn</span><span class="v"><code>createCard({ title, price = 0 })</code>: đối số có tên, thứ tự tuỳ ý, dễ mở rộng. Component React nhận props đúng kiểu này.</span></div>
</div>
<p>Gọi hàm sai số đối số vẫn được phép: thiếu thì là <code>undefined</code>, thừa thì bị bỏ qua. Linh hoạt, nhưng giấu lỗi gõ, đó là một lý do cho TypeScript (Chương 9).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — hàm sửa đối số của nó.</strong> <code>addTax(cart)</code> nhận chính object của bên gọi, không phải bản sao (Bài 4.1), và tổng tiền đổi ra cả bên ngoài hàm, kèm theo đuôi dấu phẩy động: <code>110.00000000000001</code>. Bên gọi không ngờ tới điều đó. Hãy trả về object mới: <code>return { ...cart, total: cart.total * 1.1 };</code>.</p></div>

<h3>Bước 4 — phạm vi: ai nhìn thấy gì</h3>
${ma('javascript', CODE['4-3/pham-vi.js'])}
${ra(OUT['4-3/pham-vi'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Phạm vi toàn cục</span><span class="lz-t">cả tệp</span><span class="lz-d"><code>site</code>. Thấy được ở mọi nơi, nên cũng bị sửa từ mọi nơi.</span></div>
<div class="lz-layer"><span class="lz-k">Phạm vi hàm</span><span class="lz-t">bên trong <code>outer</code></span><span class="lz-d"><code>a</code>. Thấy được trong <code>outer</code> và các hàm viết bên trong nó.</span></div>
<div class="lz-layer"><span class="lz-k">Phạm vi trong</span><span class="lz-t">bên trong <code>inner</code></span><span class="lz-d"><code>b</code>. Chỉ thấy ở đây.</span></div>
</div>
<p>Khi mã dùng một cái tên, JavaScript tìm ở phạm vi hiện tại, rồi đi ra ngoài, từng lớp, và dừng ở chỗ khớp đầu tiên. Nó không bao giờ nhìn vào trong, nên <code>typeof b</code> ở ngoài là <code>undefined</code>. Biến gần hơn cùng tên sẽ <strong>che (shadow)</strong> biến bên ngoài.</p>
<p>Giữ biến ở phạm vi nhỏ nhất có thể. Ví dụ cuối cho thấy lý do: <code>count</code> là toàn cục, hàm nào cũng sửa được, và khi nó mang giá trị sai, bạn phải đọc cả chương trình để biết ai đã làm.</p>

<h3>Bước 5 — hàm là giá trị</h3>
${ma('javascript', CODE['4-3/gia-tri-ham.js'])}
${ra(OUT['4-3/gia-tri-ham'])}
<p>Hàm có thể cất trong object, truyền vào, và trả ra, y như một con số. Hàm được truyền vào hàm khác để hàm đó gọi là <strong>callback</strong>: <code>twice</code> gọi <code>fn</code> hai lần, còn <code>map</code> gọi arrow của bạn một lần cho mỗi phần tử. <code>makeCounter</code> trả về một hàm giữ <code>n</code> của riêng nó; Bài 11.1 giải thích sâu về <em>closure</em> này.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — gọi thay vì truyền.</strong> <code>button.onClick = shout</code> trao đi cái hàm. <code>button.onClick = shout('x')</code> gọi nó <em>ngay bây giờ</em> và cất kết quả, một chuỗi: output cho thấy <code>function</code> rồi <code>string</code>. Trong DOM, đây là lỗi bộ xử lý chạy một lần lúc trang tải và không bao giờ chạy khi bấm: <code>addEventListener('click', save())</code> thay vì <code>addEventListener('click', save)</code>. Cần truyền đối số thì bọc lại: <code>() =&gt; save(id)</code>.</p></div>

<h3>Bước 6 — hàm thuần</h3>
${ma('javascript', CODE['4-3/thuan-khiet.js'])}
${ra(OUT['4-3/thuan-khiet'])}
<p><strong>Hàm thuần (pure function)</strong> trả cùng đầu ra cho cùng đầu vào và không đổi gì bên ngoài: không biến toàn cục, không sửa đối số, không in ra. <code>addPure</code> để yên <code>a</code> và trả về mảng mới. <code>addImpure</code> sửa đầu vào và một bộ đếm toàn cục. Hàm thuần dễ kiểm thử (một đầu vào, một đầu ra mong đợi; Bài 13.2), an toàn khi dùng lại, và đúng là thứ React mong đợi ở component. Chương trình vẫn cần tác dụng phụ — lưu dữ liệu, cập nhật trang — nhưng hãy để chúng ở rìa, trong vài chỗ có tên rõ ràng.</p>

<h3>Viết hàm tốt</h3>
<ul>
<li><strong>Một việc.</strong> Nếu tên cần chữ "và", hãy tách ra.</li>
<li><strong>Tên là động từ:</strong> <code>calculateTotal</code>, <code>formatPrice</code>, <code>isValidEmail</code> (dạng câu hỏi cho boolean).</li>
<li><strong>Ngắn.</strong> Không vừa một màn hình thì có lẽ là vài hàm.</li>
<li><strong>Ít tham số.</strong> Hơn ba: dùng object tuỳ chọn.</li>
</ul>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — hàm trợ giúp cho cửa hàng</strong></p>
<pre><code class="language-javascript">const cart = [
  { name: 'Pen', price: 15000, qty: 2 },
  { name: 'Book', price: 120000, qty: 1 },
];</code></pre>
<ol>
<li>Viết hàm thuần <code>lineTotal(item)</code> và <code>cartTotal(cart)</code> (dùng vòng lặp hoặc <code>reduce</code>).</li>
<li>Viết <code>formatVnd(n)</code> trả về <code>"150.000 ₫"</code> bằng <code>n.toLocaleString('vi-VN')</code>.</li>
<li>Viết <code>applyDiscount(cart, percent = 0)</code> trả về giỏ hàng <em>mới</em> với giá thấp hơn.</li>
<li>Viết <code>report(cart, format)</code> nhận một hàm định dạng làm callback, và gọi nó với <code>formatVnd</code>.</li>
</ol>
<p>Gợi ý: thử từng hàm riêng trong Console trước khi ghép lại.</p>
<p><strong>Xong khi:</strong> <code>report(cart, formatVnd)</code> in <code>150.000 ₫</code>; <code>cartTotal(applyDiscount(cart, 10))</code> là 135000; <code>cart[0].price</code> vẫn là 15000 sau đó; và không hàm nào dùng <code>console.log</code> ngoại trừ <code>report</code>. Sau đó làm module Code Lab 4.3.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">function</span><span class="v">hàm — một phần việc có tên.</span></div>
  <div class="kv"><span class="k">parameter / argument</span><span class="v">tham số (tên) / đối số (giá trị thật khi gọi).</span></div>
  <div class="kv"><span class="k">return value</span><span class="v">giá trị trả về.</span></div>
  <div class="kv"><span class="k">arrow function</span><span class="v">hàm mũi tên — cú pháp ngắn.</span></div>
  <div class="kv"><span class="k">implicit return</span><span class="v">trả về ngầm — arrow không có ngoặc nhọn.</span></div>
  <div class="kv"><span class="k">default / rest parameter</span><span class="v">tham số mặc định / tham số gom phần còn lại.</span></div>
  <div class="kv"><span class="k">scope</span><span class="v">phạm vi — nơi một tên nhìn thấy được.</span></div>
  <div class="kv"><span class="k">shadowing</span><span class="v">che biến — tên gần hơn che tên xa hơn.</span></div>
  <div class="kv"><span class="k">callback</span><span class="v">hàm được truyền vào để gọi sau.</span></div>
  <div class="kv"><span class="k">pure function</span><span class="v">hàm thuần — không tác dụng phụ.</span></div>
  <div class="kv"><span class="k">side effect</span><span class="v">tác dụng phụ — thay đổi bên ngoài hàm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Khai báo được nâng lên; arrow trong <code>const</code> không dùng được trước dòng của nó.</li>
  <li>Có ngoặc nhọn thì cần <code>return</code>; object từ arrow cần <code>( )</code>; không xuống dòng sau <code>return</code>.</li>
  <li>Trả kết quả về; chỉ in ra ở rìa.</li>
  <li>Mặc định thay <code>undefined</code>, không thay <code>null</code>; rest gom vào mảng; nhiều đối số thì dùng object tuỳ chọn.</li>
  <li>Object truyền vào là dùng chung: trả về object mới thay vì sửa nó.</li>
  <li>Phạm vi nhìn ra ngoài, không bao giờ nhìn vào trong. Giữ biến cục bộ.</li>
  <li>Hàm là giá trị: truyền <code>save</code>, không phải <code>save()</code>.</li>
  <li>Ưu tiên hàm thuần; để tác dụng phụ ở rìa.</li>
</ul>
${nguon('📗', 'MDN — Functions', 'Hướng dẫn, từ khai báo tới closure', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions')}
${nguon('📘', 'javascript.info — Functions', 'Cơ bản, arrow function và biểu thức hàm, kèm bài tập', 'https://javascript.info/function-basics')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-2-ham-closure-this', title: 'Node.js 1.2 — hàm, closure và this', sub: 'Cùng những ý này, tiến thêm một bước, trong bối cảnh backend', cta: 'Mở bài' })}
</div>
`,
};
