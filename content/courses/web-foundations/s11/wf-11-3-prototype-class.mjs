/**
 * Bài 11.3 — Prototype & class (nâng cấp 01/11/2026). Mã + output: ../_ma.mjs (Chromium thật). Deck: scripts/slides-src/wf-11-3.mjs (13 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-11-3', 'Prototype & class', 'Prototype & class', [
  [1, 'Prototype & class',
    '<p>JavaScript has classes, but underneath them is an older and simpler mechanism: every object can point at another object, its prototype, and borrow whatever it lacks. Learn the mechanism once and classes stop being magic.</p>',
    '<p>JavaScript có class, nhưng bên dưới là một cơ chế cũ hơn và đơn giản hơn: mỗi object có thể trỏ tới một object khác — prototype (nguyên mẫu) của nó — và mượn những gì nó thiếu. Hiểu cơ chế một lần là class hết còn phép thuật.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five skills: reading a property lookup as a walk up a chain, saying what <code>new</code> does, writing a complete class, using inheritance correctly, and knowing the cost difference between a method and an arrow field. Every array, DOM element and Error you touch is built this way.</p>',
    '<p>Năm kỹ năng: đọc một lần tra thuộc tính như một chuyến đi lên chuỗi, nói được <code>new</code> làm gì, viết một class đầy đủ, dùng kế thừa đúng, và biết khác biệt chi phí giữa method và arrow field. Mọi mảng, phần tử DOM và Error bạn chạm vào đều được dựng theo cách này.</p>'],
  [3, 'The prototype chain',
    '<p><code>rabbit</code> owns only <code>jumps</code>. Asking for <code>eats</code> fails on rabbit, so JavaScript asks rabbit’s prototype, <code>animal</code>, and finds it. Asking for <code>flies</code> walks all the way to <code>null</code> and returns <code>undefined</code> — no error. The loop at the end prints each step of that walk.</p>',
    '<p><code>rabbit</code> chỉ sở hữu <code>jumps</code>. Hỏi <code>eats</code> thì rabbit không có, nên JavaScript hỏi prototype của rabbit là <code>animal</code> và tìm thấy. Hỏi <code>flies</code> thì đi tới tận <code>null</code> và trả <code>undefined</code> — không lỗi. Vòng lặp cuối in từng bước của chuyến đi đó.</p>'],
  [4, 'What the chain looks like',
    '<p>Four boxes: the object, its prototype, the shared <code>Object.prototype</code> that gives every object <code>toString</code>, and finally <code>null</code>. Reading walks upward. Writing does not: assigning a property always creates it on the object itself.</p>',
    '<p>Bốn hộp: object, prototype của nó, <code>Object.prototype</code> dùng chung cho mọi object <code>toString</code>, và cuối cùng là <code>null</code>. ĐỌC thì đi ngược lên. GHI thì không: gán thuộc tính luôn tạo nó trên chính object.</p>'],
  [5, 'Constructor functions',
    '<p>Before 2015 this was how you made many similar objects. Data goes on <code>this</code> — one copy per user. The method goes on <code>User.prototype</code> — one copy for everyone, which is why <code>a.greet === b.greet</code> is true.</p>',
    '<p>Trước 2015 đây là cách tạo nhiều object giống nhau. Dữ liệu đặt trên <code>this</code> — mỗi user một bản. Method đặt trên <code>User.prototype</code> — một bản cho tất cả, vì vậy <code>a.greet === b.greet</code> là true.</p>'],
  [6, 'What new does',
    '<p><code>fakeNew</code> rebuilds <code>new</code> in three lines: make an object linked to the prototype, run the constructor with <code>this</code> set to it, return it. No methods are copied — the link is enough.</p>',
    '<p><code>fakeNew</code> dựng lại <code>new</code> bằng ba dòng: tạo một object nối tới prototype, chạy constructor với <code>this</code> là object đó, trả nó về. Không method nào bị chép — chỉ cần mối nối.</p>'],
  [7, 'class syntax',
    '<p>The same idea, written cleanly. <code>static count</code> belongs to the class. <code>#price</code> is private: only code inside the class body can read it. <code>get price()</code> lets outsiders read it like a property but not write it.</p>',
    '<p>Cùng ý tưởng, viết gọn gàng. <code>static count</code> thuộc về class. <code>#price</code> là riêng tư: chỉ code trong thân class đọc được. <code>get price()</code> cho người ngoài đọc như thuộc tính nhưng không ghi được.</p>'],
  [8, 'Using the class',
    '<p>The discount ran, and the getter returned 450,000. Then <code>p.price = 1</code> threw, because class code is always strict and a getter without a setter is read-only. Because <code>applyDiscount</code> returns <code>this</code>, calls can be chained.</p>',
    '<p>Giảm giá đã chạy, getter trả 450.000. Rồi <code>p.price = 1</code> ném lỗi, vì code class luôn strict và getter không có setter là chỉ-đọc. Vì <code>applyDiscount</code> trả về <code>this</code>, các lời gọi có thể nối chuỗi.</p>'],
  [9, 'Still prototypes underneath',
    '<p>Proof that <code>class</code> is syntax over prototypes: <code>typeof Product</code> is "function", <code>describe</code> sits on <code>Product.prototype</code>, and the object owns only <code>name</code>. Unlike old constructor functions, a class refuses to be called without <code>new</code>.</p>',
    '<p>Bằng chứng <code>class</code> là cú pháp phủ lên prototype: <code>typeof Product</code> là "function", <code>describe</code> nằm trên <code>Product.prototype</code>, object chỉ sở hữu <code>name</code>. Khác hàm constructor cũ, class từ chối bị gọi khi thiếu <code>new</code>.</p>'],
  [10, 'extends and super',
    '<p><code>Circle</code> extends <code>Shape</code>: it inherits <code>describe</code> and overrides <code>area</code>. <code>Square</code> also extends <code>describe</code> by calling <code>super.describe()</code>. A subclass constructor must call <code>super()</code> before touching <code>this</code> — otherwise a ReferenceError.</p>',
    '<p><code>Circle</code> kế thừa <code>Shape</code>: nhận <code>describe</code> và ghi đè <code>area</code>. <code>Square</code> còn mở rộng <code>describe</code> bằng cách gọi <code>super.describe()</code>. Constructor của lớp con phải gọi <code>super()</code> trước khi chạm vào <code>this</code> — nếu không là ReferenceError.</p>'],
  [11, 'Methods vs arrow fields',
    '<p>A method lives once on the prototype; an arrow written as a class field is created again for every instance. The arrow keeps <code>this</code> when detached (handy for event handlers); the method does not. Choose the arrow field only when you really pass the function around.</p>',
    '<p>Method nằm một lần trên prototype; arrow viết thành class field được tạo lại cho từng thực thể. Arrow giữ <code>this</code> khi bị tách (tiện cho handler sự kiện); method thì không. Chỉ chọn arrow field khi bạn thật sự chuyền hàm đi nơi khác.</p>'],
  [12, 'Do not patch built-ins',
    '<p>Adding <code>last</code> to <code>Array.prototype</code> works — and changes every array on the page, even leaking into <code>for…in</code>. When a library did this with <code>flatten</code>, the language standard had to rename its own new method to <code>flat</code>.</p>',
    '<p>Thêm <code>last</code> vào <code>Array.prototype</code> chạy được — và đổi mọi mảng trong trang, còn lọt cả vào <code>for…in</code>. Khi một thư viện làm vậy với <code>flatten</code>, chính chuẩn ngôn ngữ phải đổi tên method mới của mình thành <code>flat</code>.</p>'],
  [13, 'Summary & practice',
    '<p>The cart exercise uses everything: a private field, a getter, a method, a subclass that changes one behaviour with <code>super</code>. If <code>VipCart</code> gives 180,000 without copying any code from <code>Cart</code>, inheritance is doing its job.</p>',
    '<p>Bài giỏ hàng dùng tất cả: field riêng tư, getter, method, lớp con đổi một hành vi bằng <code>super</code>. Nếu <code>VipCart</code> ra 180.000 mà không chép dòng nào từ <code>Cart</code>, kế thừa đã làm đúng việc của nó.</p>'],
]);

export default {
  title: '11.3 — Prototype and class: how objects inherit|||11.3 — Prototype và class: object kế thừa thế nào',
  slug: 'wf-11-3-prototype-class',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Chuỗi prototype và cách tra thuộc tính, hàm constructor và new làm gì, class (constructor, method, getter, static, #private), extends/super, method khác arrow field, vì sao không sửa prototype có sẵn — chạy thật trong Chromium.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Objects inherit by pointing at other objects</h2>
<p class="lead">After this lesson you can explain where <code>[1, 2].map</code> actually comes from, write a complete class with private data, build a subclass with <code>extends</code> and <code>super</code>, and read the "Class constructor cannot be invoked without 'new'" kind of error without panic. Why it matters: React's old class components, Node's <code>EventEmitter</code>, every <code>Error</code> subclass and most libraries you will read are built from these pieces — and interviewers love asking "what does <code>new</code> do?".</p>

<h3>Step 1 — the prototype chain</h3>
<p>Every object has a hidden link to another object called its <strong>prototype</strong>. When you read a property the object does not have, JavaScript follows that link and looks there, then follows the next link, and so on. That sequence of links is the <strong>prototype chain</strong>.</p>
${ma('javascript', CODE['11-3/chain.js'])}
${ra(OUT['11-3/chain'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">rabbit</span><span class="lz-d">Own property: <code>jumps</code>. Asked for <code>eats</code> ⇒ not here ⇒ go up.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">animal</span><span class="lz-d">Has <code>eats</code> and <code>describe</code> ⇒ found, stop.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Object.prototype</span><span class="lz-d">Shared by every ordinary object: <code>toString</code>, <code>hasOwnProperty</code>…</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">null</span><span class="lz-d">End of the chain. A name not found by now ⇒ <code>undefined</code> (no error).</span></div>
</div>
<p>Two tests to tell "mine" from "borrowed": <code>Object.hasOwn(obj, key)</code> checks only the object itself; <code>key in obj</code> checks the whole chain. And <code>rabbit.describe()</code> printed "eats: true" — the method lives on <code>animal</code>, but <code>this</code> is <code>rabbit</code> (rule 3 from lesson 11.2: the object before the dot), and <code>this.eats</code> is found by walking the chain again.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — reading walks the chain, writing does not.</strong> <code>rabbit.eats = false</code> does NOT change <code>animal</code>. It creates a new own property on <code>rabbit</code> that hides (shadows) the inherited one. Other objects that share <code>animal</code> are unaffected. Beginners expect assignment to "update the parent" and are surprised when it does not.</p></div>

<h3>Step 2 — making many similar objects: constructor + prototype</h3>
<p>Before classes existed (2015), JavaScript programmers wrote a <strong>constructor function</strong> and put shared methods on its <code>prototype</code> object. You will still meet this in older code and in library sources.</p>
${ma('javascript', CODE['11-3/constructor.js'])}
${ra(OUT['11-3/constructor'])}
<p>Each user has its own <code>name</code>, but <code>a.greet === b.greet</code> is <code>true</code>: there is exactly one <code>greet</code> function, on <code>User.prototype</code>, and every user reaches it through the chain. A thousand users cost a thousand names, not a thousand copies of every method.</p>
<p>The second half rewrites <code>new</code> by hand. That is all <code>new</code> does:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Create and link</span><span class="lz-d">A new empty object whose prototype is <code>User.prototype</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Run the constructor</span><span class="lz-d">With <code>this</code> = the new object, so <code>this.name = name</code> fills it in.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Return it</span><span class="lz-d">Unless the constructor itself returned a different object.</span></div>
</div>

<h3>Step 3 — the class syntax</h3>
<p>A <code>class</code> writes the same structure more clearly, and adds a few things the old style could not do well: real private fields, static members and getters in one place.</p>
${ma('javascript', CODE['11-3/class.mjs'])}
${ra(OUT['11-3/class'])}
<div class="kv-grid">
  <div class="kv"><span class="k">constructor(name, price)</span><span class="v">Runs on <code>new Product(...)</code>; sets up the instance.</span></div>
  <div class="kv"><span class="k">static count</span><span class="v">Belongs to the class itself — read it as <code>Product.count</code>, not <code>p.count</code>.</span></div>
  <div class="kv"><span class="k">#price</span><span class="v">A private field. Code outside the class body cannot read or write it — even writing <code>p.#price</code> outside the class is a SyntaxError, so the file does not load.</span></div>
  <div class="kv"><span class="k">get price()</span><span class="v">A getter: outsiders read <code>p.price</code> like a property. With no setter, assigning throws (output line 3).</span></div>
  <div class="kv"><span class="k">return this</span><span class="v">Returning the object lets calls chain: <code>p.applyDiscount(10).applyDiscount(5)</code>.</span></div>
</div>
<p>Note the last output line: <code>p.price = 1</code> threw a <code>TypeError</code>. Class bodies are always strict mode, so writing to a getter-only property is an error rather than a silent no-op — exactly the "loud bug" behaviour from lesson 11.2.</p>

<h3>Proof that a class is still prototypes</h3>
${ma('javascript', CODE['11-3/class-under-hood.mjs'])}
${ra(OUT['11-3/class-under-hood'])}
<p><code>typeof Product</code> is <code>function</code>; <code>describe</code> lives on <code>Product.prototype</code>; the instance owns only <code>name</code>. <code>JSON.stringify</code> serialises own, public, enumerable properties only — no methods, and no <code>#price</code>. One real difference from old constructor functions: calling a class without <code>new</code> throws, instead of silently running with the wrong <code>this</code>.</p>

<h3>Step 4 — inheritance with <code>extends</code> and <code>super</code></h3>
${ma('javascript', CODE['11-3/extends.mjs'])}
${ra(OUT['11-3/extends'])}
<ul>
<li><strong>extends</strong> links <code>Circle.prototype</code> to <code>Shape.prototype</code> — the output line "chain: true true" checks both links. That is why <code>c instanceof Shape</code> is true: <code>instanceof</code> simply walks the chain.</li>
<li><strong>Override:</strong> <code>Circle</code> defines its own <code>area</code>. The inherited <code>describe</code> calls <code>this.area()</code>, and because <code>this</code> is the circle, the circle's version runs. That is polymorphism in one line.</li>
<li><strong>super.method():</strong> <code>Square.describe</code> reuses the parent's version and wraps it in brackets instead of rewriting it.</li>
<li><strong>super(...) in the constructor</strong> must come first. The parent creates the object; until it has run, there is no <code>this</code> — hence the ReferenceError in the last line.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Trap — deep inheritance trees.</strong> <code>extends</code> is easy to overuse: <code>Animal → Mammal → Dog → ServiceDog → …</code>. Every change high up ripples down, and a method in the middle is hard to find. Real projects keep inheritance shallow (one level, often from a framework class like <code>Error</code> or <code>HTMLElement</code>) and prefer <strong>composition</strong>: give an object the helpers it needs as properties instead of inheriting from them.</p></div>

<h3>Methods versus arrow-function fields</h3>
${ma('javascript', CODE['11-3/arrow-field.mjs'])}
${ra(OUT['11-3/arrow-field'])}
<p><code>inc</code> is a method: one function on the prototype, shared, and — as lesson 11.2 showed — it loses <code>this</code> when detached. <code>incArrow</code> is a class <em>field</em> holding an arrow: every instance gets its own new function (the <code>false</code> in line 2), which captures that instance's <code>this</code>, so it keeps working when detached. That makes arrow fields convenient for event handlers you pass around, at the cost of one extra function per object.</p>

<h3>Built-in objects use the same chain — leave theirs alone</h3>
${ma('javascript', CODE['11-3/builtins.js'])}
${ra(OUT['11-3/builtins'])}
<p>An array owns only its indexes (<code>'0'</code>, <code>'1'</code>, <code>'2'</code>); <code>map</code>, <code>filter</code> and friends come from <code>Array.prototype</code>. Because the prototype is shared, adding <code>last</code> to it instantly gave every array on the page a <code>last()</code> method — and also made <code>for...in</code> list it as a key.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "monkey-patching" built-in prototypes.</strong> It looks convenient and is banned in real projects. It affects code you did not write, and it can collide with future versions of JavaScript: a popular old library added <code>Array.prototype.flatten</code>, so when the standard wanted to add a built-in <code>flatten</code>, it would have broken real websites — the committee renamed the new method to <code>flat</code>. Write a normal function instead: <code>const last = (arr) =&gt; arr.at(-1)</code>.</p></div>

<h3>Which tool when?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">One-off object</span><span class="v">Object literal <code>{ … }</code>.</span></div>
  <div class="kv"><span class="k">Many objects, same behaviour</span><span class="v"><code>class</code>, methods on the prototype.</span></div>
  <div class="kv"><span class="k">Hidden data</span><span class="v"><code>#private</code> fields (or a closure, lesson 11.1).</span></div>
  <div class="kv"><span class="k">"Is a kind of"</span><span class="v"><code>extends</code>, one level — e.g. <code>class ValidationError extends Error</code>.</span></div>
  <div class="kv"><span class="k">"Has a"</span><span class="v">Composition: store the helper as a property.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes)</strong></p>
<p>Write <code>class Cart</code> with a private <code>#items</code> array; a method <code>add(name, price, qty = 1)</code> that rejects a quantity below 1 with a <code>RangeError</code> and returns <code>this</code>; a getter <code>total</code>; and <code>clear()</code>. Then write <code>class VipCart extends Cart</code> whose <code>total</code> is 10% lower — reuse the parent's total with <code>super.total</code> instead of recomputing.</p>
<p><strong>Done when:</strong> <code>new Cart().add('pen', 50000, 2).add('book', 100000).total</code> is <code>200000</code>; the same items in a <code>VipCart</code> give <code>180000</code>; <code>add('x', 1, 0)</code> throws a RangeError; <code>Object.keys(cart)</code> is an empty array (the items are private); and <code>cart instanceof Cart</code> is true for both carts. Code Lab module 11.3 grades this cart automatically.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">prototype</span><span class="v">nguyên mẫu — object mà một object khác trỏ tới để mượn thuộc tính.</span></div>
  <div class="kv"><span class="k">prototype chain</span><span class="v">chuỗi nguyên mẫu — dãy liên kết JavaScript đi theo khi tra một thuộc tính.</span></div>
  <div class="kv"><span class="k">own property</span><span class="v">thuộc tính riêng — nằm trên chính object, không phải mượn.</span></div>
  <div class="kv"><span class="k">constructor</span><span class="v">hàm dựng — chạy khi <code>new</code>, khởi tạo thực thể.</span></div>
  <div class="kv"><span class="k">instance</span><span class="v">thực thể — một object được tạo từ class.</span></div>
  <div class="kv"><span class="k">private field (#)</span><span class="v">trường riêng tư — chỉ code trong thân class đọc/ghi được.</span></div>
  <div class="kv"><span class="k">getter / setter</span><span class="v">hàm đọc / hàm ghi — trông như thuộc tính, chạy như hàm.</span></div>
  <div class="kv"><span class="k">static</span><span class="v">tĩnh — thuộc về chính class, không thuộc từng thực thể.</span></div>
  <div class="kv"><span class="k">inheritance / override</span><span class="v">kế thừa / ghi đè — lớp con nhận và thay hành vi lớp cha.</span></div>
  <div class="kv"><span class="k">composition</span><span class="v">kết hợp — "có một" thay vì "là một".</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Reading a property walks the <strong>prototype chain</strong> until it finds it or reaches <code>null</code>; writing always creates an own property.</li>
  <li><code>new</code> = create an object linked to the prototype, run the constructor with that <code>this</code>, return it.</li>
  <li>Methods live once on the prototype and are shared; data lives on each instance.</li>
  <li><code>class</code> is cleaner syntax over the same mechanism, with <code>#private</code>, <code>static</code>, getters, and a mandatory <code>new</code>.</li>
  <li><code>extends</code> links prototypes; call <code>super()</code> before using <code>this</code>; keep hierarchies shallow.</li>
  <li>Never add methods to built-in prototypes.</li>
</ul>
${nguon('📘', 'javascript.info — Prototypes, inheritance', 'The chain, F.prototype and native prototypes, with exercises', 'https://javascript.info/prototypes')}
${nguon('📗', 'MDN — Classes', 'Constructor, fields, private members, static, extends and super', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes')}
${lienKet({ khoa: 'typescript', bai: 'typescript-14-1-classes-access', title: 'TypeScript 14.1 — classes and access modifiers', sub: 'public / private / protected and how they differ from #private', cta: 'Open lesson' })}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-5-2-state-class-vs-function', title: 'FER202 (Academy) — class vs function components', sub: 'Where this lesson pays off: reading class components with this.state', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Object kế thừa bằng cách trỏ tới object khác</h2>
<p class="lead">Học xong bài này bạn giải thích được <code>[1, 2].map</code> thật ra đến từ đâu, viết được một class hoàn chỉnh có dữ liệu riêng tư, dựng lớp con bằng <code>extends</code> và <code>super</code>, và đọc được lỗi kiểu "Class constructor cannot be invoked without 'new'" mà không hoảng. Vì sao cần: class component đời cũ của React, <code>EventEmitter</code> của Node, mọi lớp con của <code>Error</code> và phần lớn thư viện bạn sẽ đọc đều được dựng từ những mảnh này — và người phỏng vấn rất thích hỏi "<code>new</code> làm gì?".</p>

<h3>Bước 1 — chuỗi prototype</h3>
<p>Mỗi object có một liên kết ẩn tới một object khác gọi là <strong>prototype (nguyên mẫu)</strong> của nó. Khi bạn đọc một thuộc tính mà object không có, JavaScript đi theo liên kết đó và tìm ở đấy, rồi theo liên kết kế tiếp, cứ thế. Dãy liên kết ấy là <strong>chuỗi prototype</strong>.</p>
${ma('javascript', CODE['11-3/chain.js'])}
${ra(OUT['11-3/chain'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">rabbit</span><span class="lz-d">Thuộc tính riêng: <code>jumps</code>. Hỏi <code>eats</code> ⇒ không có ⇒ đi lên.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">animal</span><span class="lz-d">Có <code>eats</code> và <code>describe</code> ⇒ thấy, dừng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Object.prototype</span><span class="lz-d">Mọi object thường dùng chung: <code>toString</code>, <code>hasOwnProperty</code>…</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">null</span><span class="lz-d">Hết chuỗi. Tới đây chưa thấy ⇒ <code>undefined</code> (không lỗi).</span></div>
</div>
<p>Hai phép thử để phân biệt "của tôi" với "đi mượn": <code>Object.hasOwn(obj, key)</code> chỉ xét chính object; <code>key in obj</code> xét cả chuỗi. Và <code>rabbit.describe()</code> in ra "eats: true" — method nằm trên <code>animal</code>, nhưng <code>this</code> là <code>rabbit</code> (luật 3 ở bài 11.2: object trước dấu chấm), và <code>this.eats</code> lại được tìm bằng cách đi theo chuỗi lần nữa.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đọc thì đi theo chuỗi, ghi thì không.</strong> <code>rabbit.eats = false</code> KHÔNG đổi <code>animal</code>. Nó tạo một thuộc tính riêng mới trên <code>rabbit</code>, che (shadow) thuộc tính kế thừa. Các object khác dùng chung <code>animal</code> không bị ảnh hưởng. Người mới tưởng phép gán "cập nhật lên cha" rồi ngạc nhiên khi không phải vậy.</p></div>

<h3>Bước 2 — tạo nhiều object giống nhau: constructor + prototype</h3>
<p>Trước khi có class (2015), lập trình viên JavaScript viết một <strong>hàm constructor</strong> và đặt các method dùng chung lên object <code>prototype</code> của nó. Bạn vẫn gặp kiểu này trong code cũ và trong mã nguồn thư viện.</p>
${ma('javascript', CODE['11-3/constructor.js'])}
${ra(OUT['11-3/constructor'])}
<p>Mỗi user có <code>name</code> riêng, nhưng <code>a.greet === b.greet</code> là <code>true</code>: chỉ có đúng một hàm <code>greet</code>, trên <code>User.prototype</code>, và mọi user với tới nó qua chuỗi. Một nghìn user tốn một nghìn cái tên, không phải một nghìn bản sao của mọi method.</p>
<p>Nửa sau viết lại <code>new</code> bằng tay. <code>new</code> chỉ làm đúng chừng này:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tạo và nối</span><span class="lz-d">Một object rỗng mới có prototype là <code>User.prototype</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chạy constructor</span><span class="lz-d">Với <code>this</code> = object mới, nên <code>this.name = name</code> điền dữ liệu vào.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Trả nó về</span><span class="lz-d">Trừ khi chính constructor trả về một object khác.</span></div>
</div>

<h3>Bước 3 — cú pháp class</h3>
<p><code>class</code> viết cùng cấu trúc đó rõ ràng hơn, và thêm vài thứ kiểu cũ làm không tốt: field riêng tư thật, thành viên tĩnh và getter ở cùng một chỗ.</p>
${ma('javascript', CODE['11-3/class.mjs'])}
${ra(OUT['11-3/class'])}
<div class="kv-grid">
  <div class="kv"><span class="k">constructor(name, price)</span><span class="v">Chạy khi <code>new Product(...)</code>; khởi tạo thực thể.</span></div>
  <div class="kv"><span class="k">static count</span><span class="v">Thuộc về chính class — đọc bằng <code>Product.count</code>, không phải <code>p.count</code>.</span></div>
  <div class="kv"><span class="k">#price</span><span class="v">Field riêng tư. Code ngoài thân class không đọc/ghi được — thậm chí viết <code>p.#price</code> ngoài class đã là SyntaxError, file không nạp nổi.</span></div>
  <div class="kv"><span class="k">get price()</span><span class="v">Getter: người ngoài đọc <code>p.price</code> như thuộc tính. Không có setter thì gán sẽ ném lỗi (dòng output 3).</span></div>
  <div class="kv"><span class="k">return this</span><span class="v">Trả về chính object cho phép nối lời gọi: <code>p.applyDiscount(10).applyDiscount(5)</code>.</span></div>
</div>
<p>Để ý dòng output cuối: <code>p.price = 1</code> ném <code>TypeError</code>. Thân class luôn ở strict mode, nên ghi vào thuộc tính chỉ có getter là lỗi chứ không phải lặng lẽ bỏ qua — đúng hành vi "bug ồn ào" ở bài 11.2.</p>

<h3>Bằng chứng class vẫn là prototype</h3>
${ma('javascript', CODE['11-3/class-under-hood.mjs'])}
${ra(OUT['11-3/class-under-hood'])}
<p><code>typeof Product</code> là <code>function</code>; <code>describe</code> nằm trên <code>Product.prototype</code>; thực thể chỉ sở hữu <code>name</code>. <code>JSON.stringify</code> chỉ tuần tự hoá thuộc tính riêng, công khai, liệt kê được — không có method, không có <code>#price</code>. Một khác biệt thật so với hàm constructor cũ: gọi class mà thiếu <code>new</code> sẽ ném lỗi, thay vì lặng lẽ chạy với <code>this</code> sai.</p>

<h3>Bước 4 — kế thừa với <code>extends</code> và <code>super</code></h3>
${ma('javascript', CODE['11-3/extends.mjs'])}
${ra(OUT['11-3/extends'])}
<ul>
<li><strong>extends</strong> nối <code>Circle.prototype</code> tới <code>Shape.prototype</code> — dòng output "chain: true true" kiểm cả hai mối nối. Vì vậy <code>c instanceof Shape</code> là true: <code>instanceof</code> chỉ đơn giản là đi theo chuỗi.</li>
<li><strong>Ghi đè (override):</strong> <code>Circle</code> định nghĩa <code>area</code> riêng. <code>describe</code> kế thừa gọi <code>this.area()</code>, và vì <code>this</code> là hình tròn, phiên bản của hình tròn chạy. Đó là đa hình (polymorphism) trong một dòng.</li>
<li><strong>super.method():</strong> <code>Square.describe</code> dùng lại phiên bản của cha và bọc trong ngoặc vuông thay vì viết lại.</li>
<li><strong>super(...) trong constructor</strong> phải đứng đầu. Lớp cha tạo ra object; trước khi nó chạy chưa có <code>this</code> — vì vậy có ReferenceError ở dòng cuối.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — cây kế thừa quá sâu.</strong> <code>extends</code> dễ bị lạm dụng: <code>Animal → Mammal → Dog → ServiceDog → …</code>. Mỗi thay đổi ở tầng trên lan xuống mọi tầng dưới, và một method ở giữa rất khó tìm. Dự án thật giữ kế thừa nông (một tầng, thường từ class của framework như <code>Error</code> hay <code>HTMLElement</code>) và ưu tiên <strong>kết hợp (composition)</strong>: đưa cho object những helper nó cần dưới dạng thuộc tính thay vì kế thừa chúng.</p></div>

<h3>Method khác arrow field thế nào</h3>
${ma('javascript', CODE['11-3/arrow-field.mjs'])}
${ra(OUT['11-3/arrow-field'])}
<p><code>inc</code> là method: một hàm trên prototype, dùng chung, và — như bài 11.2 đã thấy — mất <code>this</code> khi bị tách. <code>incArrow</code> là một class <em>field</em> chứa arrow: mỗi thực thể nhận một hàm mới riêng (chữ <code>false</code> ở dòng 2), hàm đó bắt giữ <code>this</code> của thực thể ấy, nên vẫn chạy đúng khi bị tách. Điều đó làm arrow field tiện cho handler sự kiện bạn chuyền đi, đổi lại tốn thêm một hàm cho mỗi object.</p>

<h3>Object có sẵn dùng cùng chuỗi đó — đừng đụng vào của chúng</h3>
${ma('javascript', CODE['11-3/builtins.js'])}
${ra(OUT['11-3/builtins'])}
<p>Một mảng chỉ sở hữu các chỉ số (<code>'0'</code>, <code>'1'</code>, <code>'2'</code>); <code>map</code>, <code>filter</code> và các anh em đến từ <code>Array.prototype</code>. Vì prototype dùng chung, thêm <code>last</code> vào đó lập tức cho mọi mảng trong trang một method <code>last()</code> — và còn khiến <code>for...in</code> liệt kê nó như một khoá.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "vá khỉ" (monkey-patching) prototype có sẵn.</strong> Trông tiện và bị cấm trong dự án thật. Nó ảnh hưởng tới code bạn không viết, và có thể va chạm với phiên bản JavaScript tương lai: một thư viện cũ phổ biến đã thêm <code>Array.prototype.flatten</code>, nên khi chuẩn muốn thêm <code>flatten</code> có sẵn thì sẽ làm vỡ các website thật — uỷ ban phải đổi tên method mới thành <code>flat</code>. Hãy viết một hàm bình thường: <code>const last = (arr) =&gt; arr.at(-1)</code>.</p></div>

<h3>Công cụ nào cho việc nào?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Một object dùng một lần</span><span class="v">Object literal <code>{ … }</code>.</span></div>
  <div class="kv"><span class="k">Nhiều object, cùng hành vi</span><span class="v"><code>class</code>, method trên prototype.</span></div>
  <div class="kv"><span class="k">Dữ liệu cần giấu</span><span class="v">Field <code>#private</code> (hoặc closure, bài 11.1).</span></div>
  <div class="kv"><span class="k">"Là một loại"</span><span class="v"><code>extends</code>, một tầng — ví dụ <code>class ValidationError extends Error</code>.</span></div>
  <div class="kv"><span class="k">"Có một"</span><span class="v">Kết hợp: cất helper thành thuộc tính.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút)</strong></p>
<p>Viết <code>class Cart</code> có mảng riêng tư <code>#items</code>; method <code>add(name, price, qty = 1)</code> từ chối số lượng dưới 1 bằng <code>RangeError</code> và trả về <code>this</code>; getter <code>total</code>; và <code>clear()</code>. Rồi viết <code>class VipCart extends Cart</code> có <code>total</code> thấp hơn 10% — dùng lại tổng của cha bằng <code>super.total</code> thay vì tính lại.</p>
<p><strong>Xong khi:</strong> <code>new Cart().add('pen', 50000, 2).add('book', 100000).total</code> là <code>200000</code>; cùng các món đó trong <code>VipCart</code> cho <code>180000</code>; <code>add('x', 1, 0)</code> ném RangeError; <code>Object.keys(cart)</code> là mảng rỗng (các món là riêng tư); và <code>cart instanceof Cart</code> đúng với cả hai giỏ. Code Lab module 11.3 chấm tự động giỏ hàng này.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">prototype</span><span class="v">nguyên mẫu — object mà một object khác trỏ tới để mượn thuộc tính.</span></div>
  <div class="kv"><span class="k">prototype chain</span><span class="v">chuỗi nguyên mẫu — dãy liên kết JavaScript đi theo khi tra một thuộc tính.</span></div>
  <div class="kv"><span class="k">own property</span><span class="v">thuộc tính riêng — nằm trên chính object, không phải mượn.</span></div>
  <div class="kv"><span class="k">constructor</span><span class="v">hàm dựng — chạy khi <code>new</code>, khởi tạo thực thể.</span></div>
  <div class="kv"><span class="k">instance</span><span class="v">thực thể — một object được tạo từ class.</span></div>
  <div class="kv"><span class="k">private field (#)</span><span class="v">trường riêng tư — chỉ code trong thân class đọc/ghi được.</span></div>
  <div class="kv"><span class="k">getter / setter</span><span class="v">hàm đọc / hàm ghi — trông như thuộc tính, chạy như hàm.</span></div>
  <div class="kv"><span class="k">static</span><span class="v">tĩnh — thuộc về chính class, không thuộc từng thực thể.</span></div>
  <div class="kv"><span class="k">inheritance / override</span><span class="v">kế thừa / ghi đè — lớp con nhận và thay hành vi lớp cha.</span></div>
  <div class="kv"><span class="k">composition</span><span class="v">kết hợp — "có một" thay vì "là một".</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đọc thuộc tính là đi theo <strong>chuỗi prototype</strong> tới khi thấy hoặc chạm <code>null</code>; ghi luôn tạo thuộc tính riêng.</li>
  <li><code>new</code> = tạo object nối tới prototype, chạy constructor với <code>this</code> đó, trả nó về.</li>
  <li>Method nằm một lần trên prototype và dùng chung; dữ liệu nằm trên từng thực thể.</li>
  <li><code>class</code> là cú pháp gọn hơn trên cùng cơ chế, có <code>#private</code>, <code>static</code>, getter, và bắt buộc <code>new</code>.</li>
  <li><code>extends</code> nối các prototype; gọi <code>super()</code> trước khi dùng <code>this</code>; giữ cây kế thừa nông.</li>
  <li>Đừng bao giờ thêm method vào prototype có sẵn.</li>
</ul>
${nguon('📘', 'javascript.info — Prototypes, inheritance', 'Chuỗi, F.prototype và prototype có sẵn, kèm bài tập', 'https://javascript.info/prototypes')}
${nguon('📗', 'MDN — Classes', 'Constructor, field, thành viên riêng tư, static, extends và super', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes')}
${lienKet({ khoa: 'typescript', bai: 'typescript-14-1-classes-access', title: 'TypeScript 14.1 — class và modifier truy cập', sub: 'public / private / protected khác #private thế nào', cta: 'Mở bài' })}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-5-2-state-class-vs-function', title: 'FER202 (Academy) — class component và function component', sub: 'Nơi bài này phát huy: đọc class component có this.state', cta: 'Mở bài' })}
</div>
`,
};
