/**
 * Bài 11.2 — this (nâng cấp 01/11/2026). Mã + output: ../_ma.mjs (chạy thật trong Chromium). Deck: scripts/slides-src/wf-11-2.mjs (12 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-11-2', 'this', 'this', [
  [1, 'this',
    '<p><code>this</code> is the word that confuses more JavaScript learners than any other. The good news: four short rules decide its value every single time, and one kind of function — the arrow — simply ignores all four.</p>',
    '<p><code>this</code> là từ khoá làm người học JavaScript rối nhất. Tin tốt: bốn luật ngắn quyết định giá trị của nó trong mọi trường hợp, và một loại hàm — hàm mũi tên — bỏ qua cả bốn.</p>'],
  [2, 'After this lesson you can…',
    '<p>The single sentence to keep: <code>this</code> is decided by how a function is <em>called</em>, not by where it is written. Everything else in the lesson is that sentence applied to real situations — methods, callbacks, timers and DOM events.</p>',
    '<p>Câu duy nhất cần giữ: <code>this</code> do CÁCH GỌI hàm quyết định, không do nơi hàm được viết. Mọi thứ còn lại trong bài là áp câu đó vào tình huống thật — method, callback, hẹn giờ và sự kiện DOM.</p>'],
  [3, 'The four rules',
    '<p>The same function <code>whoAmI</code> returns four different answers depending only on the call. With <code>new</code> it is the new object; with <code>call</code> or <code>bind</code> it is whatever you pass; with <code>user.whoAmI()</code> it is the object before the dot; with a bare call it is <code>undefined</code>.</p>',
    '<p>Cùng một hàm <code>whoAmI</code> trả bốn đáp án khác nhau chỉ vì cách gọi. Với <code>new</code> là object mới; với <code>call</code> hay <code>bind</code> là thứ bạn đưa vào; với <code>user.whoAmI()</code> là object đứng trước dấu chấm; gọi trơn thì là <code>undefined</code>.</p>'],
  [4, 'Losing this',
    '<p>Copying a method into a variable copies only the function. The call <code>greet()</code> has nothing before the dot, so rule 4 applies, <code>this</code> is <code>undefined</code>, and reading <code>.name</code> throws a TypeError. The function did not change — the call did.</p>',
    '<p>Chép method vào một biến chỉ chép cái hàm. Lời gọi <code>greet()</code> không có gì trước dấu chấm, nên luật 4 áp dụng, <code>this</code> là <code>undefined</code>, đọc <code>.name</code> ném TypeError. Hàm không đổi — lời gọi đổi.</p>'],
  [5, 'Silent in old scripts',
    '<p>The same code in an old-style script without strict mode does not crash: <code>this</code> becomes <code>window</code>, whose <code>name</code> is an empty string, so you get "Hi, I am" and no error. That silent version is far more expensive to debug. Modern tooling is always strict.</p>',
    '<p>Cùng đoạn code trong script kiểu cũ không có strict mode thì không sập: <code>this</code> thành <code>window</code>, mà <code>window.name</code> là chuỗi rỗng, nên bạn nhận "Hi, I am" và không lỗi nào. Phiên bản im lặng đó tốn công gỡ hơn nhiều. Công cụ hiện đại luôn chạy strict.</p>'],
  [6, 'Callbacks detach methods',
    '<p>Passing <code>t.tick</code> to <code>map</code> hands over the function without the object; <code>map</code> calls it bare. Fix one: wrap it, <code>() =&gt; t.tick()</code>, so the dot is back. Fix two: <code>t.tick.bind(t)</code>. <code>setTimeout</code> with a normal function gives <code>window</code>.</p>',
    '<p>Đưa <code>t.tick</code> cho <code>map</code> là trao cái hàm mà không kèm object; <code>map</code> gọi nó trơn. Cách sửa một: bọc lại, <code>() =&gt; t.tick()</code>, để dấu chấm quay về. Cách hai: <code>t.tick.bind(t)</code>. <code>setTimeout</code> với hàm thường cho <code>window</code>.</p>'],
  [7, 'call, apply, bind',
    '<p>Three ways to choose <code>this</code> yourself. <code>call</code> and <code>apply</code> run the function immediately — one takes arguments one by one, the other an array. <code>bind</code> runs nothing; it returns a new function whose <code>this</code> is fixed forever, even when attached to another object.</p>',
    '<p>Ba cách tự chọn <code>this</code>. <code>call</code> và <code>apply</code> chạy hàm ngay — một cái nhận đối số lần lượt, cái kia nhận mảng. <code>bind</code> không chạy gì; nó trả về hàm mới có <code>this</code> cố định vĩnh viễn, kể cả khi gắn vào object khác.</p>'],
  [8, 'Arrows have no this',
    '<p>An arrow function does not get its own <code>this</code>; it uses the <code>this</code> of the code around it. Inside <code>startFixed</code> that is the clock, so <code>seconds</code> goes up. The normal function in <code>startBroken</code> got its own <code>this</code> from the timer — not the clock.</p>',
    '<p>Hàm mũi tên không có <code>this</code> riêng; nó dùng <code>this</code> của đoạn code bao quanh. Trong <code>startFixed</code> đó là đồng hồ, nên <code>seconds</code> tăng. Hàm thường trong <code>startBroken</code> nhận <code>this</code> riêng từ hẹn giờ — không phải đồng hồ.</p>'],
  [9, 'Arrow as a method: the opposite trap',
    '<p>Because an arrow looks outward, using it as an object method backfires. An object literal does not create a <code>this</code>, so the arrow sees the module top level, where <code>this</code> is <code>undefined</code>. Methods are written with the short method syntax; arrows go inside them.</p>',
    '<p>Vì hàm mũi tên nhìn ra ngoài, dùng nó làm method của object là phản tác dụng. Object literal không tạo <code>this</code>, nên arrow thấy cấp cao nhất của module, nơi <code>this</code> là <code>undefined</code>. Method viết bằng cú pháp method ngắn; arrow nằm BÊN TRONG chúng.</p>'],
  [10, 'this in DOM events',
    '<p>A real page in Chromium. In a normal-function handler, <code>this</code> is the element the listener is attached to — the button turned green. The arrow handler saw <code>undefined</code>. <code>e.currentTarget</code> gives the element in both, which is why it is the safer habit.</p>',
    '<p>Một trang thật trong Chromium. Trong handler là hàm thường, <code>this</code> là phần tử gắn listener — nút chuyển xanh. Handler mũi tên thấy <code>undefined</code>. <code>e.currentTarget</code> cho đúng phần tử ở cả hai, vì vậy nó là thói quen an toàn hơn.</p>'],
  [11, 'Normal function or arrow?',
    '<p>Methods, constructors and handlers that genuinely use <code>this</code>: normal functions. Callbacks inside methods and small helpers: arrows. And when you see "Cannot read properties of undefined" inside a method, look at the call site first.</p>',
    '<p>Method, constructor và handler thật sự dùng <code>this</code>: hàm thường. Callback bên trong method và hàm tiện ích nhỏ: hàm mũi tên. Khi thấy "Cannot read properties of undefined" bên trong một method, hãy nhìn chỗ GỌI trước tiên.</p>'],
  [12, 'Summary & practice',
    '<p>The stopwatch exercise combines both traps: a timer callback that loses <code>this</code>, and a method passed to a button. Fix both and you have practised every rule in the lesson.</p>',
    '<p>Bài đồng hồ bấm giờ gộp cả hai bẫy: callback của hẹn giờ làm mất <code>this</code>, và một method được đưa cho nút bấm. Sửa được cả hai là bạn đã luyện mọi luật trong bài.</p>'],
]);

export default {
  title: '11.2 — this: four rules that explain everything|||11.2 — this: bốn luật giải thích tất cả',
  slug: 'wf-11-2-this',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Bốn luật quyết định this (new, call/bind, method, gọi trơn), vì sao tách method ra là mất this, strict mode, callback và hẹn giờ, call/apply/bind, hàm mũi tên không có this riêng, this trong handler DOM — chạy thật trong Chromium.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>this is decided by the call, not by the function</h2>
<p class="lead">After this lesson you can look at any line that calls a function and say what <code>this</code> will be inside it, fix the "Cannot read properties of undefined" crash that appears when a method is passed around, and choose between a normal function and an arrow function on purpose instead of by habit. You need this because methods are passed around constantly — to <code>map</code>, to <code>setTimeout</code>, to <code>addEventListener</code> — and every one of those hand-offs is a chance to lose <code>this</code>.</p>

<h3>What <code>this</code> is for</h3>
<p>A method often needs "the object I belong to". <code>this</code> is that reference. The twist that confuses everyone: a JavaScript function does not belong to any object permanently. The same function can be attached to many objects, or to none. So JavaScript decides <code>this</code> fresh at <strong>every call</strong>, by looking at how the call is written.</p>

<h3>The four rules, in priority order</h3>
${ma('javascript', CODE['11-2/four-rules.mjs'])}
${ra(OUT['11-2/four-rules'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Called with new?</span><span class="lz-d"><code>new Person('Lan')</code> ⇒ <code>this</code> is the brand-new object being built.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Called with call / apply / bind?</span><span class="lz-d"><code>f.call(x)</code> ⇒ <code>this</code> is <code>x</code>. You chose it explicitly.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Called as obj.f()?</span><span class="lz-d"><code>this</code> is the object <strong>left of the dot</strong> at the moment of the call.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Plain f()</span><span class="lz-d">Nothing decides it ⇒ <code>undefined</code> in strict mode (modules, classes, every modern tool).</span></div>
</div>
<p>Check the rules from top to bottom; the first one that matches wins. Notice that <code>whoAmI</code> itself never changed. Only the way we called it changed — and that alone gave four different results.</p>

<h3>The everyday crash: pulling a method out of its object</h3>
${ma('javascript', CODE['11-2/lost-this.mjs'])}
${ra(OUT['11-2/lost-this'])}
<p><code>const greet = user.greet</code> copies the <em>function</em>, not the relationship with <code>user</code>. When we call <code>greet()</code> there is nothing before the dot, so rule 4 applies: <code>this</code> is <code>undefined</code>, and <code>undefined.name</code> throws. The error message is your clue — "Cannot read properties of undefined (reading 'name')" inside a method almost always means "this method was called without its object".</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — the silent version in old scripts.</strong> Run exactly the same idea in a classic script without strict mode and nothing crashes:</p></div>
${ma('javascript', CODE['11-2/lost-this-sloppy.js'])}
${ra(OUT['11-2/lost-this-sloppy'])}
<p>In sloppy (non-strict) mode, rule 4 gives the global object <code>window</code> instead of <code>undefined</code>. <code>window.name</code> happens to be an empty string, so the program prints "Hi, I am " and carries on with wrong data. That is much harder to find than a crash. The good news: ES modules, classes, and everything built with Vite, React or Next.js run in strict mode automatically — you get the loud error.</p>

<h3>Callbacks are the same mistake in disguise</h3>
<p>Passing <code>obj.method</code> as an argument is the same as copying it into a variable: the receiving function gets the bare function and calls it bare.</p>
${ma('javascript', CODE['11-2/callbacks.mjs'])}
${ra(OUT['11-2/callbacks'])}
<p><code>[1, 2].map(t.tick)</code> crashed: <code>map</code> calls the function plainly, so <code>this.ticks</code> fails. Two fixes, both shown:</p>
<ul>
<li><strong>Wrap it in an arrow:</strong> <code>() =&gt; t.tick()</code>. Inside the arrow the call is written with a dot again, so rule 3 applies. This is the most common fix and reads clearly.</li>
<li><strong>Bind it once:</strong> <code>t.tick.bind(t)</code> returns a new function whose <code>this</code> is locked to <code>t</code>. Useful when you must pass the same function in several places, or later remove an event listener (you need the same function reference to remove it).</li>
</ul>
<p>The last line shows <code>setTimeout</code> with a normal function: the browser calls it with <code>this</code> set to <code>window</code> (<code>[object Window]</code>) — not your object either.</p>

<h3>Choosing <code>this</code> yourself: call, apply, bind</h3>
${ma('javascript', CODE['11-2/call-apply-bind.mjs'])}
${ra(OUT['11-2/call-apply-bind'])}
<div class="kv-grid">
  <div class="kv"><span class="k">call(thisArg, a, b)</span><span class="v">Runs the function now. Arguments one by one.</span></div>
  <div class="kv"><span class="k">apply(thisArg, [a, b])</span><span class="v">Runs the function now. Arguments as one array (handy when you already have an array).</span></div>
  <div class="kv"><span class="k">bind(thisArg, a?)</span><span class="v">Runs nothing. Returns a NEW function with <code>this</code> fixed and, optionally, the first arguments pre-filled.</span></div>
</div>
<p>The last output line proves that binding is permanent: <code>lanIntro</code> was placed on an object called Minh and called as <code>other.lanIntro()</code>, which would normally make <code>this</code> Minh by rule 3 — but rule 2 has higher priority, and the bound function still says "I am Lan".</p>

<h3>Arrow functions: no <code>this</code> of their own</h3>
<p>An arrow function does not take part in the four rules at all. It has no <code>this</code>; when you write <code>this</code> inside it, JavaScript looks <strong>outward</strong> to the surrounding code, exactly like it looks up any other variable (the closure idea from lesson 11.1).</p>
${ma('javascript', CODE['11-2/arrow.mjs'])}
${ra(OUT['11-2/arrow'])}
<p>Read the output in time order. The first line printed immediately; the other two printed later, when the timers ran. In <code>startBroken</code>, the normal function received its own <code>this</code> from the timer (the window), so it is not the clock. In <code>startFixed</code>, the arrow borrowed <code>startFixed</code>'s <code>this</code> — which is the clock, because we called <code>clock.startFixed()</code> — so <code>this.seconds++</code> worked.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — an arrow function as an object method.</strong> <code>title: () =&gt; this.name</code> looks tidy and is wrong. The arrow looks outward; an object literal is not a function and does not create a <code>this</code>; so the arrow sees the module's top level, where <code>this</code> is <code>undefined</code>. Use method syntax for methods (<code>title() { return this.name; }</code>) and keep arrows for the callbacks <em>inside</em> methods.</p></div>

<h3><code>this</code> in DOM event handlers</h3>
${ma('html', CODE['11-2/dom-this.html'], [9, 24])}
${ra(OUT['11-2/dom-this'])}
<p>For a normal-function handler, the browser calls it with <code>this</code> set to the element the listener is attached to — the screenshot on slide 10 shows button A turned green through <code>this.classList</code>. The arrow handler has no <code>this</code> of its own; this script is a module, so it saw <code>undefined</code>. In both cases <code>e.currentTarget</code> is the element. Prefer it: it works everywhere, survives a refactor from function to arrow, and says exactly what you mean.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — currentTarget vs target.</strong> <code>e.target</code> is the element the user actually clicked, which may be a child (an icon inside a button). <code>e.currentTarget</code> is the element you attached the listener to. When the button contains an <code>&lt;svg&gt;</code>, <code>e.target.id</code> is suddenly empty while <code>e.currentTarget.id</code> stays correct.</p></div>

<h3>Normal function or arrow — a decision table</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Object / class method</span><span class="v">Method syntax <code>name() { }</code>. It needs rule 3.</span></div>
  <div class="kv"><span class="k">Callback inside a method</span><span class="v">Arrow. It keeps the method's <code>this</code>.</span></div>
  <div class="kv"><span class="k">Constructor</span><span class="v">Normal function or <code>class</code> — arrows cannot be used with <code>new</code>.</span></div>
  <div class="kv"><span class="k">Event handler</span><span class="v">Either; read the element through <code>e.currentTarget</code>.</span></div>
  <div class="kv"><span class="k">React component or handler</span><span class="v">Arrow or function — there is no <code>this</code> in function components at all, one reason hooks replaced class components.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (15 minutes)</strong></p>
<p>Paste this into the browser console and make it work without changing the call sites at the bottom:</p>
<pre><code class="language-javascript">class Stopwatch {
  seconds = 0;
  start() { this.id = setInterval(function () { this.seconds++; }, 1000); }
  stop() { clearInterval(this.id); }
  reset() { this.seconds = 0; }
}
const sw = new Stopwatch();
sw.start();
document.body.onclick = sw.reset;   // click the page to reset</code></pre>
<p>Hints: one fix is inside <code>start</code> (which function type keeps the outer <code>this</code>?); the other is about what <code>onclick</code> receives (bind it, or make <code>reset</code> a class field holding an arrow).</p>
<p><strong>Done when:</strong> after three seconds <code>sw.seconds</code> is 3 (not <code>NaN</code>), clicking the page sets it back to 0, and the console shows no errors. Code Lab module 11.2 has graded versions of these fixes.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">this</span><span class="v">đối tượng ngữ cảnh của lời gọi hiện tại — do cách gọi quyết định.</span></div>
  <div class="kv"><span class="k">method call</span><span class="v">gọi kiểu method — <code>obj.f()</code>, <code>this</code> là object trước dấu chấm.</span></div>
  <div class="kv"><span class="k">strict mode</span><span class="v">chế độ nghiêm ngặt — gọi trơn cho <code>this = undefined</code>; luôn bật trong module và class.</span></div>
  <div class="kv"><span class="k">sloppy mode</span><span class="v">chế độ "lỏng" (không strict) — gọi trơn cho <code>this = window</code>.</span></div>
  <div class="kv"><span class="k">bind / call / apply</span><span class="v">gắn / gọi / áp — ba cách tự chọn <code>this</code>.</span></div>
  <div class="kv"><span class="k">arrow function</span><span class="v">hàm mũi tên — không có <code>this</code> riêng, mượn của bên ngoài.</span></div>
  <div class="kv"><span class="k">callback</span><span class="v">hàm gọi lại — hàm bạn đưa cho người khác gọi sau.</span></div>
  <div class="kv"><span class="k">currentTarget</span><span class="v">phần tử đang gắn listener (khác <code>target</code> = phần tử bị bấm thật).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>this</code> is decided at every call: <strong>new</strong> → new object, <strong>call/apply/bind</strong> → what you pass, <strong>obj.f()</strong> → obj, <strong>f()</strong> → <code>undefined</code> (strict).</li>
  <li>Copying or passing a method (<code>const f = obj.m</code>, <code>map(obj.m)</code>) loses the object.</li>
  <li>Fix with an arrow wrapper <code>() =&gt; obj.m()</code> or <code>obj.m.bind(obj)</code>.</li>
  <li>Arrows have no <code>this</code>: great for callbacks inside methods, wrong as methods.</li>
  <li>In handlers, read the element through <code>e.currentTarget</code>.</li>
  <li>Strict mode turns a silent wrong value into a loud error — that is a gift.</li>
</ul>
${nguon('📘', 'javascript.info — Object methods, "this"', 'The rules with exercises; continue with "Function binding"', 'https://javascript.info/object-methods')}
${nguon('📗', 'MDN — this', 'Full reference, including classes, callbacks and the global context', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this')}
${lienKet({ khoa: 'typescript', bai: 'typescript-3-4-this', title: 'TypeScript 3.4 — this: the parameter you did not know you had', sub: 'Make the compiler catch a lost this before you run the code', cta: 'Open lesson' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-2-ham-closure-this', title: 'Node.js 1.2 — functions, closure and this', sub: 'this in server code: class-based services and passing handlers to Express', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>this do lời gọi quyết định, không do cái hàm</h2>
<p class="lead">Học xong bài này bạn nhìn bất kỳ dòng gọi hàm nào cũng nói được <code>this</code> bên trong sẽ là gì, sửa được lỗi sập "Cannot read properties of undefined" hiện ra khi một method bị đưa đi nơi khác, và chọn giữa hàm thường và hàm mũi tên có chủ đích thay vì theo thói quen. Bạn cần điều này vì method bị chuyền đi liên tục — cho <code>map</code>, cho <code>setTimeout</code>, cho <code>addEventListener</code> — và mỗi lần chuyền là một cơ hội đánh mất <code>this</code>.</p>

<h3><code>this</code> dùng để làm gì</h3>
<p>Một method thường cần "cái object mà tôi thuộc về". <code>this</code> là tham chiếu đó. Điểm gây rối: hàm JavaScript không thuộc vĩnh viễn về object nào. Cùng một hàm có thể gắn vào nhiều object, hoặc không object nào. Nên JavaScript quyết định <code>this</code> mới ở <strong>mỗi lần gọi</strong>, bằng cách nhìn lời gọi được viết thế nào.</p>

<h3>Bốn luật, theo thứ tự ưu tiên</h3>
${ma('javascript', CODE['11-2/four-rules.mjs'])}
${ra(OUT['11-2/four-rules'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Gọi bằng new?</span><span class="lz-d"><code>new Person('Lan')</code> ⇒ <code>this</code> là object mới đang được dựng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Gọi bằng call / apply / bind?</span><span class="lz-d"><code>f.call(x)</code> ⇒ <code>this</code> là <code>x</code>. Bạn chọn tường minh.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Gọi dạng obj.f()?</span><span class="lz-d"><code>this</code> là object <strong>bên trái dấu chấm</strong> tại lúc gọi.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Gọi trơn f()</span><span class="lz-d">Không gì quyết định ⇒ <code>undefined</code> ở strict mode (module, class, mọi công cụ hiện đại).</span></div>
</div>
<p>Dò từ trên xuống; luật đầu tiên khớp sẽ thắng. Để ý chính <code>whoAmI</code> không hề đổi. Chỉ cách ta gọi nó đổi — và riêng điều đó cho ra bốn kết quả khác nhau.</p>

<h3>Lỗi sập hằng ngày: lôi method ra khỏi object</h3>
${ma('javascript', CODE['11-2/lost-this.mjs'])}
${ra(OUT['11-2/lost-this'])}
<p><code>const greet = user.greet</code> chép <em>cái hàm</em>, không chép mối quan hệ với <code>user</code>. Khi gọi <code>greet()</code> không có gì trước dấu chấm, nên luật 4 áp dụng: <code>this</code> là <code>undefined</code>, và <code>undefined.name</code> ném lỗi. Thông báo lỗi chính là manh mối — "Cannot read properties of undefined (reading 'name')" bên trong một method gần như luôn có nghĩa "method này bị gọi mà không kèm object của nó".</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — bản im lặng trong script kiểu cũ.</strong> Chạy đúng ý tưởng đó trong script cổ điển không có strict mode thì không có gì sập:</p></div>
${ma('javascript', CODE['11-2/lost-this-sloppy.js'])}
${ra(OUT['11-2/lost-this-sloppy'])}
<p>Ở chế độ "lỏng" (không strict), luật 4 cho object toàn cục <code>window</code> thay vì <code>undefined</code>. <code>window.name</code> tình cờ là chuỗi rỗng, nên chương trình in "Hi, I am " rồi chạy tiếp với dữ liệu sai. Tìm lỗi kiểu này khó hơn nhiều so với một lần sập. Tin tốt: ES module, class, và mọi thứ dựng bằng Vite, React hay Next.js đều tự chạy strict mode — bạn nhận được lỗi "ồn ào".</p>

<h3>Callback là cùng lỗi đó đội lốt</h3>
<p>Đưa <code>obj.method</code> làm đối số cũng y như chép nó vào một biến: hàm nhận được cái hàm trần và gọi nó trơn.</p>
${ma('javascript', CODE['11-2/callbacks.mjs'])}
${ra(OUT['11-2/callbacks'])}
<p><code>[1, 2].map(t.tick)</code> sập: <code>map</code> gọi hàm kiểu trơn, nên <code>this.ticks</code> hỏng. Hai cách sửa, đều có trong ví dụ:</p>
<ul>
<li><strong>Bọc trong hàm mũi tên:</strong> <code>() =&gt; t.tick()</code>. Bên trong arrow lời gọi lại được viết có dấu chấm, nên luật 3 áp dụng. Đây là cách sửa phổ biến nhất và đọc rõ ràng.</li>
<li><strong>bind một lần:</strong> <code>t.tick.bind(t)</code> trả về hàm mới có <code>this</code> khoá vào <code>t</code>. Hữu ích khi phải đưa cùng một hàm ở nhiều chỗ, hoặc sau này cần gỡ event listener (gỡ thì phải đưa đúng tham chiếu hàm cũ).</li>
</ul>
<p>Dòng cuối là <code>setTimeout</code> với hàm thường: trình duyệt gọi nó với <code>this</code> là <code>window</code> (<code>[object Window]</code>) — cũng không phải object của bạn.</p>

<h3>Tự chọn <code>this</code>: call, apply, bind</h3>
${ma('javascript', CODE['11-2/call-apply-bind.mjs'])}
${ra(OUT['11-2/call-apply-bind'])}
<div class="kv-grid">
  <div class="kv"><span class="k">call(thisArg, a, b)</span><span class="v">Chạy hàm ngay. Đối số đưa lần lượt.</span></div>
  <div class="kv"><span class="k">apply(thisArg, [a, b])</span><span class="v">Chạy hàm ngay. Đối số gói trong một mảng (tiện khi đã có sẵn mảng).</span></div>
  <div class="kv"><span class="k">bind(thisArg, a?)</span><span class="v">Không chạy gì. Trả về hàm MỚI có <code>this</code> cố định và, nếu muốn, điền sẵn vài đối số đầu.</span></div>
</div>
<p>Dòng output cuối chứng minh bind là vĩnh viễn: <code>lanIntro</code> được đặt lên một object tên Minh và gọi bằng <code>other.lanIntro()</code>, lẽ ra luật 3 cho <code>this</code> là Minh — nhưng luật 2 ưu tiên cao hơn, và hàm đã bind vẫn nói "I am Lan".</p>

<h3>Hàm mũi tên: không có <code>this</code> riêng</h3>
<p>Hàm mũi tên không tham gia bốn luật. Nó không có <code>this</code>; khi bạn viết <code>this</code> bên trong nó, JavaScript nhìn <strong>ra ngoài</strong> vào đoạn code bao quanh, y hệt cách tra mọi biến khác (ý tưởng closure ở bài 11.1).</p>
${ma('javascript', CODE['11-2/arrow.mjs'])}
${ra(OUT['11-2/arrow'])}
<p>Đọc output theo thời gian. Dòng đầu in ngay; hai dòng kia in sau, khi hẹn giờ chạy. Trong <code>startBroken</code>, hàm thường nhận <code>this</code> riêng từ hẹn giờ (window), nên không phải đồng hồ. Trong <code>startFixed</code>, arrow mượn <code>this</code> của <code>startFixed</code> — chính là đồng hồ, vì ta gọi <code>clock.startFixed()</code> — nên <code>this.seconds++</code> chạy đúng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — hàm mũi tên làm method của object.</strong> <code>title: () =&gt; this.name</code> trông gọn và sai. Arrow nhìn ra ngoài; object literal không phải hàm và không tạo <code>this</code>; nên arrow thấy cấp cao nhất của module, nơi <code>this</code> là <code>undefined</code>. Viết method bằng cú pháp method (<code>title() { return this.name; }</code>) và để arrow cho các callback <em>bên trong</em> method.</p></div>

<h3><code>this</code> trong handler sự kiện DOM</h3>
${ma('html', CODE['11-2/dom-this.html'], [9, 24])}
${ra(OUT['11-2/dom-this'])}
<p>Với handler là hàm thường, trình duyệt gọi nó với <code>this</code> là phần tử gắn listener — ảnh chụp ở slide 10 cho thấy nút A chuyển xanh nhờ <code>this.classList</code>. Handler mũi tên không có <code>this</code> riêng; script này là module, nên nó thấy <code>undefined</code>. Ở cả hai, <code>e.currentTarget</code> là phần tử. Hãy ưu tiên nó: chạy ở mọi nơi, không vỡ khi đổi hàm thường thành arrow, và nói đúng ý bạn muốn.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — currentTarget khác target.</strong> <code>e.target</code> là phần tử người dùng bấm thật, có thể là phần tử con (một icon trong nút). <code>e.currentTarget</code> là phần tử bạn gắn listener. Khi nút chứa một <code>&lt;svg&gt;</code>, <code>e.target.id</code> bỗng rỗng trong khi <code>e.currentTarget.id</code> vẫn đúng.</p></div>

<h3>Hàm thường hay hàm mũi tên — bảng quyết định</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Method của object / class</span><span class="v">Cú pháp method <code>name() { }</code>. Nó cần luật 3.</span></div>
  <div class="kv"><span class="k">Callback bên trong method</span><span class="v">Hàm mũi tên. Nó giữ <code>this</code> của method.</span></div>
  <div class="kv"><span class="k">Constructor</span><span class="v">Hàm thường hoặc <code>class</code> — arrow không dùng được với <code>new</code>.</span></div>
  <div class="kv"><span class="k">Handler sự kiện</span><span class="v">Loại nào cũng được; đọc phần tử qua <code>e.currentTarget</code>.</span></div>
  <div class="kv"><span class="k">Component hay handler React</span><span class="v">Arrow hay function đều được — function component không có <code>this</code>, một lý do hook thay thế class component.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (15 phút)</strong></p>
<p>Dán đoạn sau vào Console của trình duyệt và làm cho nó chạy đúng mà không sửa các dòng gọi ở cuối:</p>
<pre><code class="language-javascript">class Stopwatch {
  seconds = 0;
  start() { this.id = setInterval(function () { this.seconds++; }, 1000); }
  stop() { clearInterval(this.id); }
  reset() { this.seconds = 0; }
}
const sw = new Stopwatch();
sw.start();
document.body.onclick = sw.reset;   // bấm vào trang để đặt lại</code></pre>
<p>Gợi ý: một chỗ sửa nằm trong <code>start</code> (loại hàm nào giữ được <code>this</code> bên ngoài?); chỗ còn lại là thứ mà <code>onclick</code> nhận (bind nó, hoặc biến <code>reset</code> thành class field chứa một arrow).</p>
<p><strong>Xong khi:</strong> sau ba giây <code>sw.seconds</code> là 3 (không phải <code>NaN</code>), bấm vào trang đặt nó về 0, và Console không có lỗi nào. Code Lab module 11.2 có các bài chấm tự động cho những cách sửa này.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">this</span><span class="v">đối tượng ngữ cảnh của lời gọi hiện tại — do cách gọi quyết định.</span></div>
  <div class="kv"><span class="k">method call</span><span class="v">gọi kiểu method — <code>obj.f()</code>, <code>this</code> là object trước dấu chấm.</span></div>
  <div class="kv"><span class="k">strict mode</span><span class="v">chế độ nghiêm ngặt — gọi trơn cho <code>this = undefined</code>; luôn bật trong module và class.</span></div>
  <div class="kv"><span class="k">sloppy mode</span><span class="v">chế độ "lỏng" (không strict) — gọi trơn cho <code>this = window</code>.</span></div>
  <div class="kv"><span class="k">bind / call / apply</span><span class="v">gắn / gọi / áp — ba cách tự chọn <code>this</code>.</span></div>
  <div class="kv"><span class="k">arrow function</span><span class="v">hàm mũi tên — không có <code>this</code> riêng, mượn của bên ngoài.</span></div>
  <div class="kv"><span class="k">callback</span><span class="v">hàm gọi lại — hàm bạn đưa cho người khác gọi sau.</span></div>
  <div class="kv"><span class="k">currentTarget</span><span class="v">phần tử đang gắn listener (khác <code>target</code> = phần tử bị bấm thật).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>this</code> được quyết định ở mỗi lần gọi: <strong>new</strong> → object mới, <strong>call/apply/bind</strong> → thứ bạn đưa, <strong>obj.f()</strong> → obj, <strong>f()</strong> → <code>undefined</code> (strict).</li>
  <li>Chép hoặc chuyền một method (<code>const f = obj.m</code>, <code>map(obj.m)</code>) là đánh mất object.</li>
  <li>Sửa bằng arrow bọc ngoài <code>() =&gt; obj.m()</code> hoặc <code>obj.m.bind(obj)</code>.</li>
  <li>Arrow không có <code>this</code>: tuyệt cho callback trong method, sai khi làm method.</li>
  <li>Trong handler, đọc phần tử qua <code>e.currentTarget</code>.</li>
  <li>Strict mode biến một giá trị sai im lặng thành lỗi ồn ào — đó là món quà.</li>
</ul>
${nguon('📘', 'javascript.info — Object methods, "this"', 'Các luật kèm bài tập; đọc tiếp "Function binding"', 'https://javascript.info/object-methods')}
${nguon('📗', 'MDN — this', 'Tham chiếu đầy đủ, gồm class, callback và ngữ cảnh toàn cục', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this')}
${lienKet({ khoa: 'typescript', bai: 'typescript-3-4-this', title: 'TypeScript 3.4 — this: tham số bạn không biết mình có', sub: 'Để trình biên dịch bắt lỗi mất this trước khi chạy code', cta: 'Mở bài' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-2-ham-closure-this', title: 'Node.js 1.2 — hàm, closure và this', sub: 'this trong code máy chủ: service dạng class và đưa handler cho Express', cta: 'Mở bài' })}
</div>
`,
};
