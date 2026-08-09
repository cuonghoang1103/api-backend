/**
 * TypeScript — Chương 6: Generics (kiểu tổng quát).
 * Mọi output tsc là THẬT (tsc --strict, verified). Song ngữ .ml-en/.ml-vi.
 * < > trong code → &lt; &gt;; KHÔNG backtick trần (dùng &#96;); ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 6 — Generics|||Chương 6 — Generics (kiểu tổng quát)',
  description: 'Viết hàm, interface và class dùng lại được cho MỌI kiểu mà không mất an toàn kiểu: type parameter, ràng buộc extends, keyof, và suy kiểu tự động.',
  lessons: [
    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — Why generics: keep the type|||6.1 — Vì sao cần generics: giữ lại kiểu',
      slug: 'typescript-6-1-why-generics',
      type: 'LESSON',
      isFreePreview: true,
      description: 'any làm bạn mất kiểu; generics là cách viết một hàm cho MỌI kiểu mà vẫn nhớ chính xác kiểu đi vào là gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Generics: keep the type</h2>
<p class="lead">A generic is a type <em>parameter</em> — a placeholder for a type that gets filled in when the function is called, exactly like a value parameter gets filled in with an argument. It's the tool for "this works for any type, and I want to remember which type it was."</p>

<h3>The problem: <code>any</code> throws the type away</h3>
<p>Say you want a function that returns whatever you give it. The lazy version uses <code>any</code>:</p>
<pre><code><span class="tok-comment">// gen1.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">identity</span>(x: <span class="tok-keyword">any</span>) { <span class="tok-keyword">return</span> x; }
<span class="tok-keyword">const</span> n = <span class="tok-function">identity</span>(<span class="tok-number">42</span>);   <span class="tok-comment">// n: any — the type is gone</span>
n.<span class="tok-function">toUpperCase</span>();          <span class="tok-comment">// no compile error… crashes at runtime</span></code></pre>
<div class="out">(no output — exit code 0)</div>
<p>This compiles cleanly and then explodes at runtime, because <code>any</code> silences the compiler. You passed a number, got back <code>any</code>, and TypeScript no longer remembers it was a number. That is the exact opposite of what you want.</p>

<h3>The fix: a type parameter</h3>
<p>Write <code>&lt;T&gt;</code> after the function name to declare a type parameter, then use <code>T</code> where a type goes. <code>T</code> is not a fixed type — it's filled in per call:</p>
<pre><code><span class="tok-comment">// gen2.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">identity</span>&lt;T&gt;(x: T): T { <span class="tok-keyword">return</span> x; }
<span class="tok-keyword">let</span> count = <span class="tok-number">42</span>;              <span class="tok-comment">// count: number</span>
<span class="tok-keyword">const</span> n = <span class="tok-function">identity</span>(count);   <span class="tok-comment">// n: number (T inferred as number)</span>
<span class="tok-keyword">const</span> s = <span class="tok-function">identity</span>(<span class="tok-string">'hi'</span>);    <span class="tok-comment">// s: string</span>
n.<span class="tok-function">toUpperCase</span>();             <span class="tok-comment">// caught: number has no toUpperCase</span></code></pre>
<div class="out">gen2.ts(6,3): error TS2339: Property 'toUpperCase' does not exist on type 'number'.</div>
<p>Two things happened. First, TypeScript <strong>inferred</strong> <code>T</code> from the argument — you didn't write <code>identity&lt;number&gt;(count)</code>, it figured out <code>T = number</code> on its own. Second, the return type is <code>T</code>, so <code>n</code> came back as <code>number</code>, not <code>any</code> — and calling a string method on it is now a compile error. The type survived the round trip.</p>

<h3>The mental model</h3>
<p>Read <code>&lt;T&gt;</code> as "for some type T, to be decided by the caller". The function body is written once, generically, but every call gets its own concrete <code>T</code>. Here's the same idea preserving element types:</p>
<pre><code><span class="tok-comment">// gen3.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">first</span>&lt;T&gt;(arr: T[]): T | <span class="tok-keyword">undefined</span> { <span class="tok-keyword">return</span> arr[<span class="tok-number">0</span>]; }
<span class="tok-keyword">const</span> x = <span class="tok-function">first</span>([<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>]);   <span class="tok-comment">// x: number | undefined</span>
<span class="tok-keyword">const</span> y = <span class="tok-function">first</span>([<span class="tok-string">'a'</span>, <span class="tok-string">'b'</span>]);  <span class="tok-comment">// y: string | undefined</span></code></pre>
<div class="out">(no output — exit code 0)</div>
<p>One function, correct types for both calls: <code>first</code> of a <code>number[]</code> gives <code>number | undefined</code>; of a <code>string[]</code> gives <code>string | undefined</code>. The <code>| undefined</code> is honest too — an empty array has no first element.</p>

<h3>Explicit type arguments</h3>
<p>Inference is the norm, but you can pin <code>T</code> yourself with <code>&lt;…&gt;</code> at the call site. When you do, TypeScript checks the argument against it:</p>
<pre><code><span class="tok-comment">// gen4.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">identity</span>&lt;T&gt;(x: T): T { <span class="tok-keyword">return</span> x; }
<span class="tok-keyword">const</span> a = <span class="tok-function">identity</span>&lt;<span class="tok-keyword">string</span>&gt;(<span class="tok-number">42</span>);  <span class="tok-comment">// forcing T = string, passing a number</span></code></pre>
<div class="out">gen4.ts(3,28): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.</div>
<p>You told TypeScript <code>T</code> is <code>string</code>, then handed it a number — contradiction, caught. Most of the time you leave the <code>&lt;…&gt;</code> off and let inference do the work; reach for explicit arguments only when inference can't see enough (an empty array, a bare <code>Promise</code>) to guess.</p>

<div class="callout ok">The one-line takeaway: <code>any</code> means "stop checking"; a generic <code>&lt;T&gt;</code> means "check, but for whatever type the caller brings". They look similar in a signature and could not be more different in what they buy you.</div>
<div class="note-ct">Every reusable helper on this site is generic: the API layer's <code>request&lt;T&gt;(url)</code> returns <code>Promise&lt;T&gt;</code> so each caller gets its own typed payload, and the pagination wrapper is <code>Page&lt;T&gt;</code>. Without generics we'd either duplicate the helper per type or fall back to <code>any</code> and lose every guarantee at the boundary.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: generic functions on Code Lab</span><span class="lc-sub">Write identity, first, and a typed wrapper after this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Generics: giữ lại kiểu</h2>
<p class="lead">Generic là một <em>tham số kiểu</em> — một chỗ trống cho một kiểu, được điền vào khi hàm được gọi, y như tham số giá trị được điền bằng một đối số. Nó là công cụ cho "cái này chạy với mọi kiểu, và tôi muốn nhớ kiểu đó là gì".</p>

<h3>Vấn đề: <code>any</code> vứt bỏ kiểu</h3>
<p>Giả sử bạn muốn một hàm trả lại đúng thứ bạn đưa vào. Bản lười dùng <code>any</code>:</p>
<pre><code><span class="tok-comment">// gen1.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">identity</span>(x: <span class="tok-keyword">any</span>) { <span class="tok-keyword">return</span> x; }
<span class="tok-keyword">const</span> n = <span class="tok-function">identity</span>(<span class="tok-number">42</span>);   <span class="tok-comment">// n: any — kiểu đã mất</span>
n.<span class="tok-function">toUpperCase</span>();          <span class="tok-comment">// không lỗi biên dịch… sập lúc chạy</span></code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Nó biên dịch sạch rồi nổ tung lúc chạy, vì <code>any</code> làm trình biên dịch im lặng. Bạn đưa vào một số, nhận lại <code>any</code>, và TypeScript không còn nhớ đó từng là một số. Đó đúng là điều ngược lại thứ bạn muốn.</p>

<h3>Cách sửa: một tham số kiểu</h3>
<p>Viết <code>&lt;T&gt;</code> sau tên hàm để khai báo một tham số kiểu, rồi dùng <code>T</code> ở chỗ cần một kiểu. <code>T</code> không phải một kiểu cố định — nó được điền theo từng lần gọi:</p>
<pre><code><span class="tok-comment">// gen2.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">identity</span>&lt;T&gt;(x: T): T { <span class="tok-keyword">return</span> x; }
<span class="tok-keyword">let</span> count = <span class="tok-number">42</span>;              <span class="tok-comment">// count: number</span>
<span class="tok-keyword">const</span> n = <span class="tok-function">identity</span>(count);   <span class="tok-comment">// n: number (T suy ra là number)</span>
<span class="tok-keyword">const</span> s = <span class="tok-function">identity</span>(<span class="tok-string">'hi'</span>);    <span class="tok-comment">// s: string</span>
n.<span class="tok-function">toUpperCase</span>();             <span class="tok-comment">// bắt được: number không có toUpperCase</span></code></pre>
<div class="out">gen2.ts(6,3): error TS2339: Property 'toUpperCase' does not exist on type 'number'.</div>
<p>Hai điều đã xảy ra. Thứ nhất, TypeScript <strong>suy ra</strong> <code>T</code> từ đối số — bạn không viết <code>identity&lt;number&gt;(count)</code>, nó tự hiểu <code>T = number</code>. Thứ hai, kiểu trả về là <code>T</code>, nên <code>n</code> trở về là <code>number</code>, không phải <code>any</code> — và gọi một phương thức của chuỗi trên nó giờ là lỗi biên dịch. Kiểu đã sống sót qua trọn chuyến đi.</p>

<h3>Mô hình tư duy</h3>
<p>Đọc <code>&lt;T&gt;</code> là "với một kiểu T nào đó, do bên gọi quyết định". Thân hàm viết một lần, tổng quát, nhưng mỗi lần gọi nhận một <code>T</code> cụ thể riêng. Đây là cùng ý tưởng, giữ nguyên kiểu phần tử:</p>
<pre><code><span class="tok-comment">// gen3.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">first</span>&lt;T&gt;(arr: T[]): T | <span class="tok-keyword">undefined</span> { <span class="tok-keyword">return</span> arr[<span class="tok-number">0</span>]; }
<span class="tok-keyword">const</span> x = <span class="tok-function">first</span>([<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>]);   <span class="tok-comment">// x: number | undefined</span>
<span class="tok-keyword">const</span> y = <span class="tok-function">first</span>([<span class="tok-string">'a'</span>, <span class="tok-string">'b'</span>]);  <span class="tok-comment">// y: string | undefined</span></code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Một hàm, kiểu đúng cho cả hai lần gọi: <code>first</code> của <code>number[]</code> cho <code>number | undefined</code>; của <code>string[]</code> cho <code>string | undefined</code>. Phần <code>| undefined</code> cũng rất thành thật — mảng rỗng thì làm gì có phần tử đầu.</p>

<h3>Đối số kiểu tường minh</h3>
<p>Suy kiểu là mặc định, nhưng bạn có thể tự ghim <code>T</code> bằng <code>&lt;…&gt;</code> tại chỗ gọi. Khi làm vậy, TypeScript kiểm đối số ngược lại nó:</p>
<pre><code><span class="tok-comment">// gen4.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">identity</span>&lt;T&gt;(x: T): T { <span class="tok-keyword">return</span> x; }
<span class="tok-keyword">const</span> a = <span class="tok-function">identity</span>&lt;<span class="tok-keyword">string</span>&gt;(<span class="tok-number">42</span>);  <span class="tok-comment">// ép T = string, lại truyền một số</span></code></pre>
<div class="out">gen4.ts(3,28): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.</div>
<p>Bạn bảo TypeScript <code>T</code> là <code>string</code>, rồi đưa nó một số — mâu thuẫn, bị bắt. Đa số thời gian bạn bỏ <code>&lt;…&gt;</code> đi và để suy kiểu làm việc; chỉ dùng đối số tường minh khi suy kiểu không thấy đủ (một mảng rỗng, một <code>Promise</code> trần) để đoán.</p>

<div class="callout ok">Câu chốt một dòng: <code>any</code> nghĩa là "ngừng kiểm"; một generic <code>&lt;T&gt;</code> nghĩa là "cứ kiểm, nhưng với bất cứ kiểu nào bên gọi mang tới". Chúng trông giống nhau trong một chữ ký và không thể khác nhau hơn về thứ chúng mang lại.</div>
<div class="note-ct">Mọi helper dùng lại trên site này đều generic: lớp API có <code>request&lt;T&gt;(url)</code> trả <code>Promise&lt;T&gt;</code> để mỗi bên gọi nhận payload có kiểu riêng, và bộ bọc phân trang là <code>Page&lt;T&gt;</code>. Không có generics thì hoặc phải chép helper cho mỗi kiểu, hoặc quay về <code>any</code> và mất mọi bảo đảm ngay tại biên.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: hàm generic trên Code Lab</span><span class="lc-sub">Viết identity, first và một bộ bọc có kiểu sau chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — Constraints, keyof & indexed access|||6.2 — Ràng buộc, keyof & truy cập theo chỉ mục',
      slug: 'typescript-6-2-constraints-keyof',
      type: 'LESSON',
      isFreePreview: true,
      description: 'extends ràng buộc T phải có gì; keyof + T[K] cho phép viết getProperty an toàn — trả về đúng kiểu của đúng field.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Constraints, keyof &amp; indexed access</h2>
<p class="lead">A bare <code>T</code> could be <em>anything</em>, so you can't touch its members. A constraint — <code>T extends …</code> — narrows what <code>T</code> is allowed to be, which lets you use the guaranteed parts while still staying generic.</p>

<h3>Why an unconstrained T is untouchable</h3>
<p>Try to read <code>.length</code> off a plain <code>T</code> and TypeScript stops you — nothing promised <code>T</code> has a length:</p>
<pre><code><span class="tok-comment">// con1.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">longest</span>&lt;T&gt;(a: T, b: T) {
  <span class="tok-keyword">return</span> a.length &gt; b.length ? a : b;   <span class="tok-comment">// T could be anything</span>
}</code></pre>
<div class="out">con1.ts(3,12): error TS2339: Property 'length' does not exist on type 'T'.
con1.ts(3,23): error TS2339: Property 'length' does not exist on type 'T'.</div>
<p>Correct: if someone calls <code>longest(10, 20)</code>, numbers have no <code>.length</code>. TypeScript won't let the body assume more than the signature guarantees.</p>

<h3>Constrain with <code>extends</code></h3>
<p>Add <code>T extends { length: number }</code> — "T can be any type, as long as it has a numeric <code>length</code>". Now the body is allowed to read <code>.length</code>, and the <em>caller</em> is checked against the constraint:</p>
<pre><code><span class="tok-comment">// con2.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">longest</span>&lt;T <span class="tok-keyword">extends</span> { length: <span class="tok-keyword">number</span> }&gt;(a: T, b: T): T {
  <span class="tok-keyword">return</span> a.length &gt; b.length ? a : b;
}
<span class="tok-keyword">const</span> arr = <span class="tok-function">longest</span>([<span class="tok-number">1</span>, <span class="tok-number">2</span>], [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>]);   <span class="tok-comment">// number[]</span>
<span class="tok-keyword">const</span> str = <span class="tok-function">longest</span>(<span class="tok-string">'hi'</span>, <span class="tok-string">'world'</span>);       <span class="tok-comment">// string</span>
<span class="tok-function">longest</span>(<span class="tok-number">10</span>, <span class="tok-number">20</span>);                          <span class="tok-comment">// numbers have no .length</span></code></pre>
<div class="out">con2.ts(7,9): error TS2345: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.</div>
<p>Arrays and strings both have <code>.length</code>, so those calls pass — and note <code>longest([1,2], [1,2,3])</code> returns <code>number[]</code>, not the widened constraint type. <code>T</code> is still the caller's real type; the constraint only sets a <em>floor</em> on what it must include. Numbers fail the floor, so that call is rejected.</p>

<h3><code>keyof</code> and <code>T[K]</code>: a truly safe getter</h3>
<p>The famous example. You want "get a property by name", returning exactly that property's type. Two type parameters do it: <code>T</code> for the object, and <code>K extends keyof T</code> for a key that's guaranteed to exist on <code>T</code>. The return type <code>T[K]</code> is an <em>indexed access</em> — "the type of T at key K":</p>
<pre><code><span class="tok-comment">// con3.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">getProp</span>&lt;T, K <span class="tok-keyword">extends</span> <span class="tok-keyword">keyof</span> T&gt;(obj: T, key: K): T[K] {
  <span class="tok-keyword">return</span> obj[key];
}
<span class="tok-keyword">const</span> user = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span> };
<span class="tok-keyword">const</span> uid = <span class="tok-function">getProp</span>(user, <span class="tok-string">'id'</span>);     <span class="tok-comment">// number</span>
<span class="tok-keyword">const</span> uname = <span class="tok-function">getProp</span>(user, <span class="tok-string">'name'</span>); <span class="tok-comment">// string</span>
<span class="tok-function">getProp</span>(user, <span class="tok-string">'email'</span>);              <span class="tok-comment">// 'email' is not a key of user</span></code></pre>
<div class="out">con3.ts(8,15): error TS2345: Argument of type '"email"' is not assignable to parameter of type '"name" | "id"'.</div>
<p>Look at the payoff. <code>getProp(user, 'id')</code> is typed <code>number</code>; <code>getProp(user, 'name')</code> is typed <code>string</code> — the <em>same</em> function returns different types depending on the key. And <code>'email'</code> is rejected because <code>keyof user</code> is exactly <code>"id" | "name"</code>. No <code>any</code>, no cast, no runtime check — the wrong key can't even be written.</p>

<div class="callout ok">Read the three pieces together: <code>keyof T</code> is the union of T's key names; <code>K extends keyof T</code> is "one specific key"; <code>T[K]</code> is "the value type at that key". That trio is the backbone of almost every advanced type you'll meet later.</div>
<div class="note-ct">This <code>getProp</code> shape is exactly how typed ORMs and form libraries work: Prisma's <code>select</code> and React Hook Form's <code>field name</code> both use <code>keyof</code> so a typo in a field name is a compile error, not a silent <code>undefined</code> at runtime. You'll build the mapped-type version of this in chapter 7.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: constraints &amp; keyof on Code Lab</span><span class="lc-sub">Build a constrained helper and a keyof-safe getter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Ràng buộc, keyof &amp; truy cập theo chỉ mục</h2>
<p class="lead">Một <code>T</code> trần có thể là <em>bất cứ thứ gì</em>, nên bạn không đụng được vào thành viên của nó. Một ràng buộc — <code>T extends …</code> — thu hẹp những gì <code>T</code> được phép là, cho phép bạn dùng phần được bảo đảm mà vẫn tổng quát.</p>

<h3>Vì sao T không ràng buộc thì không đụng được</h3>
<p>Thử đọc <code>.length</code> trên một <code>T</code> trần và TypeScript chặn bạn — không có gì hứa <code>T</code> có length:</p>
<pre><code><span class="tok-comment">// con1.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">longest</span>&lt;T&gt;(a: T, b: T) {
  <span class="tok-keyword">return</span> a.length &gt; b.length ? a : b;   <span class="tok-comment">// T có thể là bất cứ gì</span>
}</code></pre>
<div class="out">con1.ts(3,12): error TS2339: Property 'length' does not exist on type 'T'.
con1.ts(3,23): error TS2339: Property 'length' does not exist on type 'T'.</div>
<p>Đúng: nếu ai đó gọi <code>longest(10, 20)</code>, số làm gì có <code>.length</code>. TypeScript không cho thân hàm giả định nhiều hơn thứ chữ ký bảo đảm.</p>

<h3>Ràng buộc bằng <code>extends</code></h3>
<p>Thêm <code>T extends { length: number }</code> — "T có thể là kiểu nào cũng được, miễn là nó có một <code>length</code> kiểu số". Giờ thân hàm được phép đọc <code>.length</code>, và <em>bên gọi</em> bị kiểm ngược lại ràng buộc:</p>
<pre><code><span class="tok-comment">// con2.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">longest</span>&lt;T <span class="tok-keyword">extends</span> { length: <span class="tok-keyword">number</span> }&gt;(a: T, b: T): T {
  <span class="tok-keyword">return</span> a.length &gt; b.length ? a : b;
}
<span class="tok-keyword">const</span> arr = <span class="tok-function">longest</span>([<span class="tok-number">1</span>, <span class="tok-number">2</span>], [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>]);   <span class="tok-comment">// number[]</span>
<span class="tok-keyword">const</span> str = <span class="tok-function">longest</span>(<span class="tok-string">'hi'</span>, <span class="tok-string">'world'</span>);       <span class="tok-comment">// string</span>
<span class="tok-function">longest</span>(<span class="tok-number">10</span>, <span class="tok-number">20</span>);                          <span class="tok-comment">// số không có .length</span></code></pre>
<div class="out">con2.ts(7,9): error TS2345: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.</div>
<p>Mảng và chuỗi đều có <code>.length</code> nên các lần gọi đó qua — và để ý <code>longest([1,2], [1,2,3])</code> trả về <code>number[]</code>, không phải kiểu ràng buộc bị nới rộng. <code>T</code> vẫn là kiểu thật của bên gọi; ràng buộc chỉ đặt một <em>sàn</em> cho những gì nó phải có. Số không đạt sàn, nên lần gọi đó bị từ chối.</p>

<h3><code>keyof</code> và <code>T[K]</code>: một getter thật sự an toàn</h3>
<p>Ví dụ kinh điển. Bạn muốn "lấy một thuộc tính theo tên", trả về đúng kiểu của thuộc tính đó. Hai tham số kiểu làm được: <code>T</code> cho object, và <code>K extends keyof T</code> cho một key được bảo đảm tồn tại trên <code>T</code>. Kiểu trả về <code>T[K]</code> là một <em>truy cập theo chỉ mục</em> — "kiểu của T tại key K":</p>
<pre><code><span class="tok-comment">// con3.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">getProp</span>&lt;T, K <span class="tok-keyword">extends</span> <span class="tok-keyword">keyof</span> T&gt;(obj: T, key: K): T[K] {
  <span class="tok-keyword">return</span> obj[key];
}
<span class="tok-keyword">const</span> user = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span> };
<span class="tok-keyword">const</span> uid = <span class="tok-function">getProp</span>(user, <span class="tok-string">'id'</span>);     <span class="tok-comment">// number</span>
<span class="tok-keyword">const</span> uname = <span class="tok-function">getProp</span>(user, <span class="tok-string">'name'</span>); <span class="tok-comment">// string</span>
<span class="tok-function">getProp</span>(user, <span class="tok-string">'email'</span>);              <span class="tok-comment">// 'email' không phải key của user</span></code></pre>
<div class="out">con3.ts(8,15): error TS2345: Argument of type '"email"' is not assignable to parameter of type '"name" | "id"'.</div>
<p>Nhìn phần thưởng đi. <code>getProp(user, 'id')</code> có kiểu <code>number</code>; <code>getProp(user, 'name')</code> có kiểu <code>string</code> — <em>cùng</em> một hàm trả về kiểu khác nhau tuỳ key. Và <code>'email'</code> bị từ chối vì <code>keyof user</code> đúng là <code>"id" | "name"</code>. Không <code>any</code>, không ép kiểu, không kiểm lúc chạy — key sai còn không viết ra được.</p>

<div class="callout ok">Đọc ba mảnh cùng nhau: <code>keyof T</code> là union các tên key của T; <code>K extends keyof T</code> là "một key cụ thể"; <code>T[K]</code> là "kiểu giá trị tại key đó". Bộ ba đó là xương sống của gần như mọi kiểu nâng cao bạn gặp về sau.</div>
<div class="note-ct">Hình dạng <code>getProp</code> này đúng là cách các ORM và thư viện form có kiểu hoạt động: <code>select</code> của Prisma và <code>field name</code> của React Hook Form đều dùng <code>keyof</code> nên gõ sai tên field là lỗi biên dịch, không phải một <code>undefined</code> âm thầm lúc chạy. Bạn sẽ dựng bản mapped-type của nó ở chương 7.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: ràng buộc &amp; keyof trên Code Lab</span><span class="lc-sub">Dựng một helper có ràng buộc và một getter an toàn theo keyof.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — Generic interfaces, classes & defaults|||6.3 — Interface, class generic & kiểu mặc định',
      slug: 'typescript-6-3-generic-types-classes',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Không chỉ hàm: interface, type và class cũng nhận tham số kiểu. Box<T>, Stack<T>, và tham số kiểu mặc định <T = unknown>.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Generic interfaces, classes &amp; defaults</h2>
<p class="lead">Type parameters aren't just for functions. Interfaces, type aliases and classes take <code>&lt;T&gt;</code> too — that's how one <code>Box</code>, one <code>Result</code>, one <code>Stack</code> shape serves every payload type without duplication.</p>

<h3>A generic interface</h3>
<p>Put <code>&lt;T&gt;</code> after the name and use <code>T</code> in the fields. Now <code>Box&lt;number&gt;</code> and <code>Box&lt;string&gt;</code> are two different, fully-checked types from one declaration:</p>
<pre><code><span class="tok-comment">// box1.ts</span>
<span class="tok-keyword">interface</span> Box&lt;T&gt; { value: T; }
<span class="tok-keyword">const</span> nb: Box&lt;<span class="tok-keyword">number</span>&gt; = { value: <span class="tok-number">42</span> };
<span class="tok-keyword">const</span> sb: Box&lt;<span class="tok-keyword">string</span>&gt; = { value: <span class="tok-string">'hi'</span> };
<span class="tok-keyword">const</span> bad: Box&lt;<span class="tok-keyword">number</span>&gt; = { value: <span class="tok-string">'hi'</span> };  <span class="tok-comment">// wrong payload type</span></code></pre>
<div class="out">box1.ts(5,28): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>When you write <code>Box&lt;number&gt;</code>, TypeScript substitutes <code>T = number</code> throughout, so <code>value</code> must be a number. This is the shape behind every "container of X" type: a paginated <code>Page&lt;T&gt;</code>, an <code>ApiResponse&lt;T&gt;</code>, a <code>Result&lt;T, E&gt;</code>.</p>

<h3>A generic class</h3>
<p>Classes carry their type parameter across all their methods. A <code>Stack&lt;T&gt;</code> stores <code>T[]</code> internally, so <code>push</code> takes a <code>T</code> and <code>pop</code> returns <code>T | undefined</code> — consistently, for whatever <code>T</code> you instantiate with:</p>
<pre><code><span class="tok-comment">// stack1.ts</span>
<span class="tok-keyword">class</span> Stack&lt;T&gt; {
  <span class="tok-keyword">private</span> items: T[] = [];
  <span class="tok-function">push</span>(item: T): <span class="tok-keyword">void</span> { <span class="tok-keyword">this</span>.items.<span class="tok-function">push</span>(item); }
  <span class="tok-function">pop</span>(): T | <span class="tok-keyword">undefined</span> { <span class="tok-keyword">return</span> <span class="tok-keyword">this</span>.items.<span class="tok-function">pop</span>(); }
  <span class="tok-keyword">get</span> <span class="tok-function">size</span>(): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> <span class="tok-keyword">this</span>.items.length; }
}
<span class="tok-keyword">const</span> s = <span class="tok-keyword">new</span> Stack&lt;<span class="tok-keyword">number</span>&gt;();
s.<span class="tok-function">push</span>(<span class="tok-number">1</span>);
s.<span class="tok-function">push</span>(<span class="tok-string">'x'</span>);   <span class="tok-comment">// Stack&lt;number&gt; rejects a string</span></code></pre>
<div class="out">stack1.ts(10,8): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.</div>
<p>You chose <code>Stack&lt;number&gt;</code> at construction, and from then on the instance only accepts numbers. Every method shares the same <code>T</code> — that's the difference between a class type parameter (fixed per instance) and a method-level one (fixed per call).</p>

<h3>Default type parameters</h3>
<p>Like value parameters, type parameters can have a default with <code>= </code>. It makes the argument optional at the use site — handy when a sensible fallback exists:</p>
<pre><code><span class="tok-comment">// def1.ts</span>
<span class="tok-keyword">interface</span> ApiResult&lt;T = <span class="tok-keyword">unknown</span>&gt; { ok: <span class="tok-keyword">boolean</span>; data: T; }
<span class="tok-keyword">const</span> a: ApiResult = { ok: <span class="tok-keyword">true</span>, data: <span class="tok-number">123</span> };        <span class="tok-comment">// T defaults to unknown</span>
<span class="tok-keyword">const</span> b: ApiResult&lt;<span class="tok-keyword">string</span>&gt; = { ok: <span class="tok-keyword">true</span>, data: <span class="tok-string">'x'</span> };
a.data.<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// data is unknown — can't call anything yet</span></code></pre>
<div class="out">def1.ts(5,1): error TS18046: 'a.data' is of type 'unknown'.</div>
<p>Writing <code>ApiResult</code> with no argument uses the default <code>unknown</code>, which is the safe choice: it holds any value but forces you to narrow before use (that's the <code>TS18046</code>). Prefer <code>unknown</code> over <code>any</code> as a default — it keeps the "you must check me" contract instead of throwing it away.</p>

<div class="callout ok">Same idea in three costumes: <code>function f&lt;T&gt;()</code>, <code>interface I&lt;T&gt;</code>, <code>class C&lt;T&gt;</code>. Wherever a type could vary, you can parameterise it — and defaults let callers skip the argument when a fallback makes sense.</div>
<div class="note-ct">The site's API layer is literally <code>interface ApiResponse&lt;T = unknown&gt;</code>: routes that haven't been given a specific payload type still type-check, and every endpoint that <em>has</em> one gets <code>data</code> typed precisely. The <code>unknown</code> default is what stops an un-annotated route from silently becoming <code>any</code>.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: generic containers on Code Lab</span><span class="lc-sub">Build Box, Stack and a Result type with a default parameter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Interface, class generic &amp; kiểu mặc định</h2>
<p class="lead">Tham số kiểu không chỉ dành cho hàm. Interface, type alias và class cũng nhận <code>&lt;T&gt;</code> — đó là cách một hình dạng <code>Box</code>, một <code>Result</code>, một <code>Stack</code> phục vụ mọi kiểu payload mà không lặp lại.</p>

<h3>Một interface generic</h3>
<p>Đặt <code>&lt;T&gt;</code> sau tên và dùng <code>T</code> trong các field. Giờ <code>Box&lt;number&gt;</code> và <code>Box&lt;string&gt;</code> là hai kiểu khác nhau, được kiểm đầy đủ, từ một khai báo:</p>
<pre><code><span class="tok-comment">// box1.ts</span>
<span class="tok-keyword">interface</span> Box&lt;T&gt; { value: T; }
<span class="tok-keyword">const</span> nb: Box&lt;<span class="tok-keyword">number</span>&gt; = { value: <span class="tok-number">42</span> };
<span class="tok-keyword">const</span> sb: Box&lt;<span class="tok-keyword">string</span>&gt; = { value: <span class="tok-string">'hi'</span> };
<span class="tok-keyword">const</span> bad: Box&lt;<span class="tok-keyword">number</span>&gt; = { value: <span class="tok-string">'hi'</span> };  <span class="tok-comment">// sai kiểu payload</span></code></pre>
<div class="out">box1.ts(5,28): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>Khi bạn viết <code>Box&lt;number&gt;</code>, TypeScript thay <code>T = number</code> khắp nơi, nên <code>value</code> phải là số. Đây là hình dạng đằng sau mọi kiểu "hộp chứa X": một <code>Page&lt;T&gt;</code> phân trang, một <code>ApiResponse&lt;T&gt;</code>, một <code>Result&lt;T, E&gt;</code>.</p>

<h3>Một class generic</h3>
<p>Class mang tham số kiểu của nó xuyên suốt mọi phương thức. Một <code>Stack&lt;T&gt;</code> lưu <code>T[]</code> bên trong, nên <code>push</code> nhận một <code>T</code> và <code>pop</code> trả <code>T | undefined</code> — nhất quán, với bất cứ <code>T</code> nào bạn khởi tạo:</p>
<pre><code><span class="tok-comment">// stack1.ts</span>
<span class="tok-keyword">class</span> Stack&lt;T&gt; {
  <span class="tok-keyword">private</span> items: T[] = [];
  <span class="tok-function">push</span>(item: T): <span class="tok-keyword">void</span> { <span class="tok-keyword">this</span>.items.<span class="tok-function">push</span>(item); }
  <span class="tok-function">pop</span>(): T | <span class="tok-keyword">undefined</span> { <span class="tok-keyword">return</span> <span class="tok-keyword">this</span>.items.<span class="tok-function">pop</span>(); }
  <span class="tok-keyword">get</span> <span class="tok-function">size</span>(): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> <span class="tok-keyword">this</span>.items.length; }
}
<span class="tok-keyword">const</span> s = <span class="tok-keyword">new</span> Stack&lt;<span class="tok-keyword">number</span>&gt;();
s.<span class="tok-function">push</span>(<span class="tok-number">1</span>);
s.<span class="tok-function">push</span>(<span class="tok-string">'x'</span>);   <span class="tok-comment">// Stack&lt;number&gt; từ chối một chuỗi</span></code></pre>
<div class="out">stack1.ts(10,8): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.</div>
<p>Bạn chọn <code>Stack&lt;number&gt;</code> lúc khởi tạo, và từ đó thực thể chỉ nhận số. Mọi phương thức chia sẻ cùng <code>T</code> — đó là khác biệt giữa tham số kiểu cấp class (cố định theo thực thể) và cấp phương thức (cố định theo lần gọi).</p>

<h3>Tham số kiểu mặc định</h3>
<p>Như tham số giá trị, tham số kiểu có thể có mặc định với <code>= </code>. Nó làm đối số thành tuỳ chọn tại chỗ dùng — tiện khi có một fallback hợp lý:</p>
<pre><code><span class="tok-comment">// def1.ts</span>
<span class="tok-keyword">interface</span> ApiResult&lt;T = <span class="tok-keyword">unknown</span>&gt; { ok: <span class="tok-keyword">boolean</span>; data: T; }
<span class="tok-keyword">const</span> a: ApiResult = { ok: <span class="tok-keyword">true</span>, data: <span class="tok-number">123</span> };        <span class="tok-comment">// T mặc định là unknown</span>
<span class="tok-keyword">const</span> b: ApiResult&lt;<span class="tok-keyword">string</span>&gt; = { ok: <span class="tok-keyword">true</span>, data: <span class="tok-string">'x'</span> };
a.data.<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// data là unknown — chưa gọi gì được</span></code></pre>
<div class="out">def1.ts(5,1): error TS18046: 'a.data' is of type 'unknown'.</div>
<p>Viết <code>ApiResult</code> không có đối số dùng mặc định <code>unknown</code>, đó là lựa chọn an toàn: nó giữ mọi giá trị nhưng buộc bạn thu hẹp trước khi dùng (đó là <code>TS18046</code>). Hãy chọn <code>unknown</code> thay vì <code>any</code> làm mặc định — nó giữ khế ước "phải kiểm tôi" thay vì vứt đi.</p>

<div class="callout ok">Cùng một ý tưởng trong ba bộ đồ: <code>function f&lt;T&gt;()</code>, <code>interface I&lt;T&gt;</code>, <code>class C&lt;T&gt;</code>. Ở đâu một kiểu có thể thay đổi, bạn có thể tham số hoá nó — và mặc định cho phép bên gọi bỏ đối số khi có fallback hợp lý.</div>
<div class="note-ct">Lớp API của site đúng là <code>interface ApiResponse&lt;T = unknown&gt;</code>: các route chưa được cho một kiểu payload cụ thể vẫn qua kiểm, còn mọi endpoint <em>có</em> một kiểu thì nhận <code>data</code> có kiểu chính xác. Mặc định <code>unknown</code> là thứ chặn một route không chú thích khỏi âm thầm trở thành <code>any</code>.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: hộp chứa generic trên Code Lab</span><span class="lc-sub">Dựng Box, Stack và một kiểu Result với tham số mặc định.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Generics in practice: inference & pitfalls|||6.4 — Generics thực chiến: suy kiểu & bẫy thường gặp',
      slug: 'typescript-6-4-generics-in-practice',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai tham số kiểu để biến đổi (map T→U), một wrapper fetch có kiểu, và bẫy phổ biến: khi nào <T> là thừa, khi nào phép ép "as T" chỉ là lời hứa suông.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Generics in practice: inference &amp; pitfalls</h2>
<p class="lead">You've got the pieces. This lesson is about using them well: multiple type parameters that connect input to output, a real-world typed <code>fetch</code>, and the two mistakes people make most.</p>

<h3>Two parameters: transform T into U</h3>
<p>A <code>map</code>-like helper takes a <code>T[]</code> and a function <code>T → U</code>, and returns <code>U[]</code>. The two parameters connect: <code>U</code> is inferred from what the callback <em>returns</em>, so the result type tracks the transformation automatically:</p>
<pre><code><span class="tok-comment">// map1.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">mapArr</span>&lt;T, U&gt;(arr: T[], fn: (x: T) =&gt; U): U[] {
  <span class="tok-keyword">return</span> arr.<span class="tok-function">map</span>(fn);
}
<span class="tok-keyword">const</span> lens = <span class="tok-function">mapArr</span>([<span class="tok-string">'a'</span>, <span class="tok-string">'bb'</span>, <span class="tok-string">'ccc'</span>], s =&gt; s.length);  <span class="tok-comment">// number[]</span>
<span class="tok-keyword">const</span> up = <span class="tok-function">mapArr</span>([<span class="tok-string">'a'</span>, <span class="tok-string">'b'</span>], s =&gt; s.<span class="tok-function">toUpperCase</span>());     <span class="tok-comment">// string[]</span>
lens[<span class="tok-number">0</span>].<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// elements are numbers</span></code></pre>
<div class="out">map1.ts(7,9): error TS2339: Property 'toUpperCase' does not exist on type 'number'.</div>
<p>Nobody wrote a single explicit type argument. From <code>['a','bb','ccc']</code> TypeScript infers <code>T = string</code>; from <code>s =&gt; s.length</code> it infers <code>U = number</code>; so <code>lens</code> is <code>number[]</code> and the string method on element <code>0</code> is caught. This is exactly how the built-in <code>Array.prototype.map</code> is typed.</p>

<h3>A typed fetch wrapper — and its honest caveat</h3>
<p>The everyday reason to reach for generics: give a network call a payload type. The caller passes <code>T</code>, and everything downstream is typed:</p>
<pre><code><span class="tok-comment">// fetch1.ts</span>
<span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">getJson</span>&lt;T&gt;(url: <span class="tok-keyword">string</span>): <span class="tok-keyword">Promise</span>&lt;T&gt; {
  <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> <span class="tok-function">fetch</span>(url);
  <span class="tok-keyword">return</span> (<span class="tok-keyword">await</span> res.<span class="tok-function">json</span>()) <span class="tok-keyword">as</span> T;   <span class="tok-comment">// an ASSERTION — not validated at runtime</span>
}
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">run</span>() {
  <span class="tok-keyword">const</span> user = <span class="tok-keyword">await</span> <span class="tok-function">getJson</span>&lt;User&gt;(<span class="tok-string">'/api/user'</span>);  <span class="tok-comment">// user: User</span>
  console.<span class="tok-function">log</span>(user.name.<span class="tok-function">toUpperCase</span>());           <span class="tok-comment">// typed all the way through</span>
  console.<span class="tok-function">log</span>(user.emial);                        <span class="tok-comment">// typo caught at compile time</span>
}</code></pre>
<div class="out">fetch1.ts(10,20): error TS2339: Property 'emial' does not exist on type 'User'.</div>
<p>The good part: <code>user</code> is typed <code>User</code>, so <code>user.emial</code> is a compile error — a typo you'd otherwise find in production. The <strong>caveat you must internalise</strong>: <code>as T</code> is an <em>assertion</em>, not a check. If the server actually returns a different shape, TypeScript never notices — it trusted you. Generics guarantee <em>internal</em> consistency, never that runtime data matches. Validating the boundary is a separate job (Zod, chapter 13).</p>

<h3>Pitfall: a type parameter used only once</h3>
<p>A generic earns its keep only when the same <code>T</code> appears in <em>two or more</em> places, linking them. If <code>T</code> shows up once, it's doing nothing a plain type couldn't:</p>
<pre><code><span class="tok-comment">// smell — T appears only in the parameter:</span>
<span class="tok-keyword">function</span> <span class="tok-function">logIt</span>&lt;T&gt;(x: T): <span class="tok-keyword">void</span> { console.<span class="tok-function">log</span>(x); }
<span class="tok-comment">// simpler and identical in effect:</span>
<span class="tok-keyword">function</span> <span class="tok-function">logIt2</span>(x: <span class="tok-keyword">unknown</span>): <span class="tok-keyword">void</span> { console.<span class="tok-function">log</span>(x); }</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Both compile, but the first <code>&lt;T&gt;</code> is decoration — <code>T</code> connects nothing. The rule of thumb: if you can't point to <em>two</em> spots that share the type parameter (a parameter and the return, two parameters, a field and a method), you don't need a generic. Reach for <code>unknown</code> instead.</p>

<div class="callout ok">The heuristic that keeps generics honest: a type parameter is a <em>relationship</em>. It only pays off when it ties one thing to another — input to output, key to value, element to result. One appearance is a smell; a plain type or <code>unknown</code> is clearer.</div>
<div class="note-ct">The site's <code>api.get&lt;T&gt;(url)</code> is the <code>getJson</code> pattern above, and the boundary caveat is exactly why every external payload passes through a Zod schema before it's trusted — the generic types the happy path, Zod proves the data is real. You'll wire those two together in chapter 13.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: map, typed fetch &amp; smells on Code Lab</span><span class="lc-sub">Write a two-parameter transform and spot the needless generic.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Generics thực chiến: suy kiểu &amp; bẫy thường gặp</h2>
<p class="lead">Bạn đã có đủ mảnh ghép. Bài này nói về dùng chúng cho khéo: nhiều tham số kiểu nối đầu vào với đầu ra, một <code>fetch</code> có kiểu thực tế, và hai lỗi người ta hay mắc nhất.</p>

<h3>Hai tham số: biến đổi T thành U</h3>
<p>Một helper kiểu <code>map</code> nhận một <code>T[]</code> và một hàm <code>T → U</code>, rồi trả <code>U[]</code>. Hai tham số nối với nhau: <code>U</code> được suy ra từ thứ callback <em>trả về</em>, nên kiểu kết quả tự động bám theo phép biến đổi:</p>
<pre><code><span class="tok-comment">// map1.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">mapArr</span>&lt;T, U&gt;(arr: T[], fn: (x: T) =&gt; U): U[] {
  <span class="tok-keyword">return</span> arr.<span class="tok-function">map</span>(fn);
}
<span class="tok-keyword">const</span> lens = <span class="tok-function">mapArr</span>([<span class="tok-string">'a'</span>, <span class="tok-string">'bb'</span>, <span class="tok-string">'ccc'</span>], s =&gt; s.length);  <span class="tok-comment">// number[]</span>
<span class="tok-keyword">const</span> up = <span class="tok-function">mapArr</span>([<span class="tok-string">'a'</span>, <span class="tok-string">'b'</span>], s =&gt; s.<span class="tok-function">toUpperCase</span>());     <span class="tok-comment">// string[]</span>
lens[<span class="tok-number">0</span>].<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// phần tử là số</span></code></pre>
<div class="out">map1.ts(7,9): error TS2339: Property 'toUpperCase' does not exist on type 'number'.</div>
<p>Không ai viết lấy một đối số kiểu tường minh. Từ <code>['a','bb','ccc']</code> TypeScript suy <code>T = string</code>; từ <code>s =&gt; s.length</code> nó suy <code>U = number</code>; nên <code>lens</code> là <code>number[]</code> và phương thức chuỗi trên phần tử <code>0</code> bị bắt. Đây đúng là cách <code>Array.prototype.map</code> có sẵn được gõ kiểu.</p>

<h3>Một wrapper fetch có kiểu — và lời cảnh báo thành thật của nó</h3>
<p>Lý do đời thường nhất để cần generics: cho một lời gọi mạng một kiểu payload. Bên gọi truyền <code>T</code>, và mọi thứ phía sau đều có kiểu:</p>
<pre><code><span class="tok-comment">// fetch1.ts</span>
<span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">getJson</span>&lt;T&gt;(url: <span class="tok-keyword">string</span>): <span class="tok-keyword">Promise</span>&lt;T&gt; {
  <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> <span class="tok-function">fetch</span>(url);
  <span class="tok-keyword">return</span> (<span class="tok-keyword">await</span> res.<span class="tok-function">json</span>()) <span class="tok-keyword">as</span> T;   <span class="tok-comment">// một PHÉP ÉP — không validate lúc chạy</span>
}
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">run</span>() {
  <span class="tok-keyword">const</span> user = <span class="tok-keyword">await</span> <span class="tok-function">getJson</span>&lt;User&gt;(<span class="tok-string">'/api/user'</span>);  <span class="tok-comment">// user: User</span>
  console.<span class="tok-function">log</span>(user.name.<span class="tok-function">toUpperCase</span>());           <span class="tok-comment">// có kiểu suốt cả chuỗi</span>
  console.<span class="tok-function">log</span>(user.emial);                        <span class="tok-comment">// gõ sai bị bắt lúc biên dịch</span>
}</code></pre>
<div class="out">fetch1.ts(10,20): error TS2339: Property 'emial' does not exist on type 'User'.</div>
<p>Phần hay: <code>user</code> có kiểu <code>User</code>, nên <code>user.emial</code> là lỗi biên dịch — một lỗi gõ mà lẽ ra bạn chỉ thấy trên production. <strong>Cảnh báo bạn phải khắc cốt</strong>: <code>as T</code> là một <em>phép ép</em>, không phải phép kiểm. Nếu máy chủ thật sự trả về một hình dạng khác, TypeScript chẳng bao giờ hay biết — nó tin bạn. Generics bảo đảm nhất quán <em>bên trong</em>, không bao giờ bảo đảm dữ liệu lúc chạy khớp. Validate tại biên là một việc riêng (Zod, chương 13).</p>

<h3>Bẫy: một tham số kiểu chỉ dùng một lần</h3>
<p>Một generic chỉ đáng đồng tiền khi cùng một <code>T</code> xuất hiện ở <em>hai chỗ trở lên</em>, nối chúng lại. Nếu <code>T</code> hiện ra đúng một lần, nó chẳng làm gì mà một kiểu thường không làm được:</p>
<pre><code><span class="tok-comment">// mùi lạ — T chỉ hiện trong tham số:</span>
<span class="tok-keyword">function</span> <span class="tok-function">logIt</span>&lt;T&gt;(x: T): <span class="tok-keyword">void</span> { console.<span class="tok-function">log</span>(x); }
<span class="tok-comment">// đơn giản hơn và hiệu quả y hệt:</span>
<span class="tok-keyword">function</span> <span class="tok-function">logIt2</span>(x: <span class="tok-keyword">unknown</span>): <span class="tok-keyword">void</span> { console.<span class="tok-function">log</span>(x); }</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Cả hai đều biên dịch, nhưng <code>&lt;T&gt;</code> đầu tiên chỉ là trang trí — <code>T</code> không nối gì cả. Nguyên tắc: nếu bạn không chỉ ra được <em>hai</em> chỗ chia sẻ tham số kiểu (một tham số và kiểu trả về, hai tham số, một field và một phương thức), bạn không cần generic. Hãy dùng <code>unknown</code>.</p>

<div class="callout ok">Kinh nghiệm giữ generics cho lành mạnh: một tham số kiểu là một <em>mối quan hệ</em>. Nó chỉ có lời khi buộc thứ này với thứ kia — đầu vào với đầu ra, key với value, phần tử với kết quả. Xuất hiện một lần là một mùi lạ; một kiểu thường hay <code>unknown</code> rõ ràng hơn.</div>
<div class="note-ct"><code>api.get&lt;T&gt;(url)</code> của site đúng là pattern <code>getJson</code> ở trên, và cảnh báo tại biên đúng là lý do mọi payload từ ngoài đi qua một schema Zod trước khi được tin — generic gõ kiểu cho đường đi đẹp, Zod chứng minh dữ liệu là thật. Bạn sẽ nối hai thứ đó ở chương 13.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: map, fetch có kiểu &amp; mùi lạ trên Code Lab</span><span class="lc-sub">Viết một phép biến đổi hai tham số và phát hiện generic thừa.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.5 quiz ─────────────────────────── */
    {
      title: '6.5 — Chapter 6 quiz|||6.5 — Kiểm tra Chương 6',
      slug: 'typescript-6-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về type parameter, suy kiểu, ràng buộc extends, keyof/T[K], interface & class generic, kiểu mặc định và bẫy thực chiến.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on generics — from the basic <code>&lt;T&gt;</code> to constraints, keyof and the assertion caveat. Answer from memory; questions follow lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real code: <code>K extends keyof T</code> (6.2) and the fact that <code>as T</code> in a typed fetch is a promise, not a check (6.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về generics — từ <code>&lt;T&gt;</code> cơ bản tới ràng buộc, keyof và cảnh báo về phép ép. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong code thật: <code>K extends keyof T</code> (6.2) và việc <code>as T</code> trong một fetch có kiểu là một lời hứa, không phải phép kiểm (6.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is the core difference between function f(x: any) and function f<T>(x: T): T?|||Khác biệt cốt lõi giữa function f(x: any) và function f<T>(x: T): T là gì?',
            options: [
              'None — they behave the same|||Không có — chúng hành xử như nhau',
              'any stops checking and loses the type; <T> keeps checking and remembers the caller\'s type|||any ngừng kiểm và mất kiểu; <T> vẫn kiểm và nhớ kiểu của bên gọi',
              '<T> is slower at runtime|||<T> chậm hơn lúc chạy',
              'any is safer|||any an toàn hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In const s = identity("hi") where identity is generic, do you need to write identity<string>?|||Trong const s = identity("hi") với identity là generic, bạn có cần viết identity<string> không?',
            options: [
              'Yes, always|||Có, luôn luôn',
              'No — T is inferred as string from the argument|||Không — T được suy ra là string từ đối số',
              'Only in strict mode|||Chỉ trong chế độ strict',
              'Only for numbers|||Chỉ với số',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does function longest<T>(a: T, b: T) { return a.length > b.length } fail to compile?|||Vì sao function longest<T>(a: T, b: T) { return a.length > b.length } không biên dịch được?',
            options: [
              'T is not a valid name|||T không phải tên hợp lệ',
              "TS2339: Property 'length' does not exist on type 'T' — a bare T guarantees no members|||TS2339: Property 'length' does not exist on type 'T' — một T trần không bảo đảm thành viên nào",
              'You cannot compare with >|||Không thể so sánh bằng >',
              'It needs two type parameters|||Nó cần hai tham số kiểu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does T extends { length: number } do?|||T extends { length: number } làm gì?',
            options: [
              'Makes T inherit from a class|||Làm T kế thừa từ một class',
              'Constrains T to types that have a numeric length, so the body can read .length and non-matching callers are rejected|||Ràng buộc T về các kiểu có length kiểu số, nên thân hàm đọc được .length và bên gọi không khớp bị từ chối',
              'Converts T to a number|||Biến T thành number',
              'Nothing at compile time|||Không gì lúc biên dịch',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In getProp<T, K extends keyof T>(obj: T, key: K): T[K], what is T[K]?|||Trong getProp<T, K extends keyof T>(obj: T, key: K): T[K], T[K] là gì?',
            options: [
              'An array of T|||Một mảng của T',
              'The value type stored at key K of T (indexed access)|||Kiểu giá trị lưu tại key K của T (truy cập theo chỉ mục)',
              'Always any|||Luôn là any',
              'The key name as a string|||Tên key dạng chuỗi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'For const user = { id: 1, name: "Ada" }, what is keyof typeof user?|||Với const user = { id: 1, name: "Ada" }, keyof typeof user là gì?',
            options: [
              'string',
              '"id" | "name"',
              'number | string',
              '{ id: number; name: string }',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does the default in interface ApiResult<T = unknown> mean?|||Mặc định trong interface ApiResult<T = unknown> nghĩa là gì?',
            options: [
              'T must always be unknown|||T phải luôn là unknown',
              'Writing ApiResult with no type argument uses unknown for T|||Viết ApiResult không có đối số kiểu thì dùng unknown cho T',
              'It disables type checking|||Nó tắt kiểm kiểu',
              'T becomes any|||T trở thành any',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In async getJson<T>(): Promise<T> { return (await res.json()) as T }, does the return type guarantee the server data matches T?|||Trong async getJson<T>(): Promise<T> { return (await res.json()) as T }, kiểu trả về có bảo đảm dữ liệu máy chủ khớp T không?',
            options: [
              'Yes — TypeScript validates it|||Có — TypeScript validate nó',
              'No — as T is an assertion; runtime data is never checked, you need Zod or similar|||Không — as T là một phép ép; dữ liệu lúc chạy không hề được kiểm, cần Zod hay tương tự',
              'Only in strict mode|||Chỉ trong chế độ strict',
              'Yes, if T is an interface|||Có, nếu T là một interface',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
