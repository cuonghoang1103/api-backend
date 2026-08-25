/**
 * TypeScript — Chương 2: Hệ thống kiểu cơ bản.
 * Mọi output tsc là THẬT (tsc 7.0.2, --strict). Song ngữ .ml-en/.ml-vi.
 * < > trong code → &lt; &gt;; backtick trần → &#96;; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 2 — The basic type system|||Chương 2 — Hệ thống kiểu cơ bản',
  description: 'Các kiểu primitive, null/undefined dưới strict, mảng và tuple, các kiểu đặc biệt any/unknown/never/void, và literal type với as const.',
  lessons: [
    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — Primitives, annotations & strict null checks|||2.1 — Kiểu primitive, chú thích & strict null checks',
      slug: 'typescript-2-1-primitive',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bảy kiểu primitive, cú pháp chú thích, và điều làm TypeScript đáng giá nhất: null và undefined là kiểu riêng, bị chặn dưới strict.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Primitives, annotations &amp; strict null checks</h2>
<p class="lead">Every value in JavaScript is either a primitive or an object. TypeScript gives each a type. This lesson covers the primitives and the single most valuable rule in the whole language: <strong>null and undefined are their own types, and strict mode won't let them sneak in where they don't belong.</strong></p>

<h3>The primitive types</h3>
<p>There are seven primitive value types. You rarely annotate them by hand — inference handles it — but you must recognise them:</p>
<pre><code><span class="tok-comment">// prim.ts — what tsc infers (via a declaration dump)</span>
<span class="tok-keyword">const</span> title = <span class="tok-string">'Notes'</span>;                  <span class="tok-comment">// "Notes"  (string literal)</span>
<span class="tok-keyword">const</span> count = <span class="tok-number">42</span>;                        <span class="tok-comment">// 42       (number literal)</span>
<span class="tok-keyword">const</span> done = <span class="tok-keyword">false</span>;                      <span class="tok-comment">// false    (boolean literal)</span>
<span class="tok-keyword">const</span> big = <span class="tok-number">9007199254740993n</span>;           <span class="tok-comment">// bigint</span>
<span class="tok-keyword">const</span> nothing = <span class="tok-keyword">null</span>;                    <span class="tok-comment">// null</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">string</span><span class="v">Text: <code>'An'</code>, <code>&#96;hi \${name}&#96;</code>.</span></div>
  <div class="kv"><span class="k">number</span><span class="v">All numbers — integers and floats alike: <code>42</code>, <code>3.14</code>, <code>-0</code>.</span></div>
  <div class="kv"><span class="k">boolean</span><span class="v"><code>true</code> / <code>false</code>.</span></div>
  <div class="kv"><span class="k">null</span> &amp; <span class="k">undefined</span><span class="v">The two "empty" values — and, crucially, two distinct types.</span></div>
  <div class="kv"><span class="k">bigint</span><span class="v">Integers beyond number's safe range, written with an <code>n</code> suffix.</span></div>
  <div class="kv"><span class="k">symbol</span><span class="v">Unique identifiers from <code>Symbol()</code>. Rare in app code.</span></div>
</div>

<h3>Annotation syntax: name : Type</h3>
<p>When you do annotate — mainly on function parameters, per chapter 1 — the syntax is a colon after the name:</p>
<pre><code><span class="tok-keyword">let</span> username: <span class="tok-keyword">string</span>;
<span class="tok-keyword">let</span> age: <span class="tok-keyword">number</span> = <span class="tok-number">30</span>;
<span class="tok-keyword">function</span> <span class="tok-function">setAge</span>(value: <span class="tok-keyword">number</span>): <span class="tok-keyword">void</span> { age = value; }</code></pre>
<p>The lowercase names matter: it's <code>string</code>, not <code>String</code>. <code>String</code> (capital) is the wrapper object and is almost always a mistake — one of the first things a linter will flag.</p>

<h3>The rule that pays for TypeScript: strict null checks</h3>
<p>In plain JavaScript, <code>null</code> and <code>undefined</code> can appear anywhere, and dereferencing them (<code>x.foo</code> when <code>x</code> is null) is the single most common runtime crash — the billion-dollar mistake. Under strict mode, TypeScript treats them as their own types that are <em>not</em> automatically part of <code>string</code>, <code>number</code>, etc.:</p>
<pre><code><span class="tok-comment">// null3.ts</span>
<span class="tok-keyword">let</span> title: <span class="tok-keyword">string</span> = <span class="tok-string">'An'</span>;
title = <span class="tok-keyword">null</span>;</code></pre>
<div class="out">null3.ts(2,1): error TS2322: Type 'null' is not assignable to type 'string'.</div>
<p>A <code>string</code> variable simply cannot hold <code>null</code>. If a value legitimately might be missing, you say so explicitly with a union (chapter 5): <code>string | null</code>. And once you do, TypeScript forces you to check before you use it:</p>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">firstChar</span>(s: <span class="tok-keyword">string</span> | <span class="tok-keyword">null</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">return</span> s[<span class="tok-number">0</span>];   <span class="tok-comment">// s could be null here!</span>
}</code></pre>
<div class="out">null2.ts(2,10): error TS18047: 's' is possibly 'null'.</div>
<p>This is TypeScript earning its keep: it makes the possibility of <code>null</code> visible in the type, then refuses to let you ignore it. The fix is a guard — <code>if (s === null) return ''</code> — which chapter 5 formalises as "narrowing".</p>
<div class="pitfall"><code>strictNullChecks</code> is part of <code>strict</code>. Turn strict off and this entire class of protection vanishes — <code>null</code> silently becomes assignable to everything, and you're back to JavaScript's billion-dollar mistake with extra syntax. This is the #1 reason to never disable strict.</div>
<div class="note-ct">This site's <code>strictNullChecks</code> is on everywhere. When a database query "might return null" (a record that may not exist), the type is <code>User | null</code>, and every caller is forced by the compiler to handle the not-found case — which is why "cannot read property of undefined" almost never reaches production here.</div>
<h3>The primitive types, and the two that are traps</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">string · number · boolean</span><span class="lz-lnote">Lowercase, always. <code>number</code> covers integers and floats alike — there is no <code>int</code>, because JavaScript has none.</span></div>
<div class="lz-layer"><span class="lz-lname">null · undefined</span><span class="lz-lnote">Two distinct types for two distinct ideas: "deliberately empty" and "never set". Under <code>strictNullChecks</code> neither is assignable to anything else, which is the whole point.</span></div>
<div class="lz-layer"><span class="lz-lname">bigint · symbol</span><span class="lz-lnote">Real primitives you will rarely annotate by hand. <code>bigint</code> matters for values beyond 2^53 — a database id column, for instance.</span></div>
<div class="lz-layer"><span class="lz-lname">String · Number · Boolean</span><span class="lz-lnote">Capitalised wrapper objects. Almost never what you want, and TypeScript accepts them silently — the lint rule <code>ban-types</code> exists for exactly this.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>number</code> for money, exactly as in SQL.</strong> TypeScript's <code>number</code> is a 64-bit float, so <code>0.1 + 0.2 !== 0.3</code> in typed code just as in untyped code — the annotation guarantees nothing about precision. It also silently loses integers above 2^53, which is why a <code>bigint</code> id from PostgreSQL arrives correct and becomes wrong the moment it passes through <code>Number()</code>. Keep monetary amounts as integer minor units or as strings, and keep large ids as <code>string</code> or <code>bigint</code> end to end. The type system will not warn you, because nothing is inconsistent — only wrong.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: TypeScript basics on Code Lab</span><span class="lc-sub">Drill primitives and null-safety after this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Kiểu primitive, chú thích &amp; strict null checks</h2>
<p class="lead">Mọi giá trị trong JavaScript hoặc là primitive hoặc là object. TypeScript gán cho mỗi loại một kiểu. Bài này bàn về các primitive và một quy tắc đáng giá nhất trong cả ngôn ngữ: <strong>null và undefined là kiểu riêng, và chế độ strict không cho chúng lẻn vào chỗ không thuộc về chúng.</strong></p>

<h3>Các kiểu primitive</h3>
<p>Có bảy kiểu giá trị primitive. Bạn hiếm khi chú thích chúng bằng tay — suy luận lo hết — nhưng phải nhận ra chúng:</p>
<pre><code><span class="tok-comment">// prim.ts — tsc suy ra gì (qua bản dump khai báo)</span>
<span class="tok-keyword">const</span> title = <span class="tok-string">'Notes'</span>;                  <span class="tok-comment">// "Notes"  (literal chuỗi)</span>
<span class="tok-keyword">const</span> count = <span class="tok-number">42</span>;                        <span class="tok-comment">// 42       (literal số)</span>
<span class="tok-keyword">const</span> done = <span class="tok-keyword">false</span>;                      <span class="tok-comment">// false    (literal boolean)</span>
<span class="tok-keyword">const</span> big = <span class="tok-number">9007199254740993n</span>;           <span class="tok-comment">// bigint</span>
<span class="tok-keyword">const</span> nothing = <span class="tok-keyword">null</span>;                    <span class="tok-comment">// null</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">string</span><span class="v">Văn bản: <code>'An'</code>, <code>&#96;hi \${name}&#96;</code>.</span></div>
  <div class="kv"><span class="k">number</span><span class="v">Mọi số — nguyên và thực như nhau: <code>42</code>, <code>3.14</code>, <code>-0</code>.</span></div>
  <div class="kv"><span class="k">boolean</span><span class="v"><code>true</code> / <code>false</code>.</span></div>
  <div class="kv"><span class="k">null</span> &amp; <span class="k">undefined</span><span class="v">Hai giá trị "rỗng" — và, mấu chốt, là hai kiểu tách biệt.</span></div>
  <div class="kv"><span class="k">bigint</span><span class="v">Số nguyên vượt khỏi vùng an toàn của number, viết kèm hậu tố <code>n</code>.</span></div>
  <div class="kv"><span class="k">symbol</span><span class="v">Định danh duy nhất từ <code>Symbol()</code>. Hiếm trong code ứng dụng.</span></div>
</div>

<h3>Cú pháp chú thích: tên : Kiểu</h3>
<p>Khi bạn có chú thích — chủ yếu trên tham số hàm, theo chương 1 — cú pháp là một dấu hai chấm sau tên:</p>
<pre><code><span class="tok-keyword">let</span> username: <span class="tok-keyword">string</span>;
<span class="tok-keyword">let</span> age: <span class="tok-keyword">number</span> = <span class="tok-number">30</span>;
<span class="tok-keyword">function</span> <span class="tok-function">setAge</span>(value: <span class="tok-keyword">number</span>): <span class="tok-keyword">void</span> { age = value; }</code></pre>
<p>Tên viết thường rất quan trọng: là <code>string</code>, không phải <code>String</code>. <code>String</code> (viết hoa) là object bao bọc và gần như luôn là một lỗi — một trong những thứ đầu tiên mà linter sẽ tô đỏ.</p>

<h3>Quy tắc khiến TypeScript đáng đồng tiền: strict null checks</h3>
<p>Trong JavaScript thuần, <code>null</code> và <code>undefined</code> có thể xuất hiện ở bất cứ đâu, và truy cập chúng (<code>x.foo</code> khi <code>x</code> là null) là cú sập lúc chạy phổ biến nhất — "sai lầm tỷ đô". Dưới chế độ strict, TypeScript coi chúng là kiểu riêng <em>không</em> tự động thuộc về <code>string</code>, <code>number</code>… :</p>
<pre><code><span class="tok-comment">// null3.ts</span>
<span class="tok-keyword">let</span> title: <span class="tok-keyword">string</span> = <span class="tok-string">'An'</span>;
title = <span class="tok-keyword">null</span>;</code></pre>
<div class="out">null3.ts(2,1): error TS2322: Type 'null' is not assignable to type 'string'.</div>
<p>Một biến <code>string</code> đơn giản là không thể chứa <code>null</code>. Nếu một giá trị thật sự có thể vắng mặt, bạn nói rõ điều đó bằng một union (chương 5): <code>string | null</code>. Và một khi bạn làm vậy, TypeScript ép bạn kiểm tra trước khi dùng:</p>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">firstChar</span>(s: <span class="tok-keyword">string</span> | <span class="tok-keyword">null</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">return</span> s[<span class="tok-number">0</span>];   <span class="tok-comment">// s có thể là null ở đây!</span>
}</code></pre>
<div class="out">null2.ts(2,10): error TS18047: 's' is possibly 'null'.</div>
<p>Đây là lúc TypeScript kiếm cơm: nó làm cho khả năng <code>null</code> hiện rõ trong kiểu, rồi từ chối để bạn phớt lờ nó. Cách sửa là một chốt chặn — <code>if (s === null) return ''</code> — mà chương 5 sẽ chính thức gọi là "thu hẹp kiểu".</p>
<div class="pitfall"><code>strictNullChecks</code> là một phần của <code>strict</code>. Tắt strict đi thì cả loại bảo vệ này biến mất — <code>null</code> âm thầm gán được vào mọi thứ, và bạn quay về "sai lầm tỷ đô" của JavaScript kèm thêm cú pháp. Đây là lý do số 1 để không bao giờ tắt strict.</div>
<div class="note-ct">Site này bật <code>strictNullChecks</code> ở mọi nơi. Khi một truy vấn cơ sở dữ liệu "có thể trả về null" (một bản ghi có thể không tồn tại), kiểu là <code>User | null</code>, và mọi chỗ gọi đều bị trình biên dịch ép xử lý trường hợp không tìm thấy — nên "cannot read property of undefined" gần như không bao giờ tới được production ở đây.</div>
<h3>Các kiểu nguyên thuỷ, và hai cái là bẫy</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">string · number · boolean</span><span class="lz-lnote">Luôn viết thường. <code>number</code> bao cả số nguyên lẫn số thực — không có <code>int</code>, vì JavaScript không có.</span></div>
<div class="lz-layer"><span class="lz-lname">null · undefined</span><span class="lz-lnote">Hai kiểu RIÊNG cho hai ý niệm riêng: "cố ý để rỗng" và "chưa từng được gán". Dưới <code>strictNullChecks</code>, không cái nào gán được cho thứ khác, và đó chính là chủ đích.</span></div>
<div class="lz-layer"><span class="lz-lname">bigint · symbol</span><span class="lz-lnote">Nguyên thuỷ thật mà bạn hiếm khi chú thích bằng tay. <code>bigint</code> quan trọng với giá trị vượt 2^53 — chẳng hạn một cột id trong cơ sở dữ liệu.</span></div>
<div class="lz-layer"><span class="lz-lname">String · Number · Boolean</span><span class="lz-lnote">Các đối tượng bọc viết hoa. Gần như không bao giờ là thứ bạn muốn, và TypeScript chấp nhận chúng trong im lặng — luật lint <code>ban-types</code> tồn tại đúng vì chuyện này.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — dùng <code>number</code> cho TIỀN, y hệt như trong SQL.</strong> <code>number</code> của TypeScript là số thực 64 bit, nên <code>0.1 + 0.2 !== 0.3</code> trong mã đã gõ kiểu y như trong mã chưa gõ — chú thích không bảo đảm gì về độ chính xác. Nó cũng âm thầm làm mất các số nguyên trên 2^53, và đó là lý do một id kiểu <code>bigint</code> từ PostgreSQL về thì đúng rồi thành sai ngay khoảnh khắc đi qua <code>Number()</code>. Hãy giữ số tiền dưới dạng đơn vị nhỏ số nguyên hoặc dạng chuỗi, và giữ id lớn dưới dạng <code>string</code> hay <code>bigint</code> suốt từ đầu đến cuối. Hệ kiểu sẽ KHÔNG cảnh báo bạn, vì không có gì mâu thuẫn cả — chỉ là SAI.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: TypeScript cơ bản trên Code Lab</span><span class="lc-sub">Rèn primitive và an-toàn-null sau chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — Arrays, tuples & readonly|||2.2 — Mảng, tuple & readonly',
      slug: 'typescript-2-2-mang-tuple',
      type: 'LESSON',
      isFreePreview: true,
      description: 'T[] và Array<T>, mảng readonly chặn mutation, và tuple — mảng có độ dài và kiểu từng vị trí cố định.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Arrays, tuples &amp; readonly</h2>
<p class="lead">Arrays are the workhorse collection. TypeScript gives you three refinements over "an array": the element type, immutability, and — for fixed-shape data — tuples, where each position has its own type.</p>

<h3>Typed arrays: two spellings, one meaning</h3>
<pre><code><span class="tok-keyword">const</span> scores: <span class="tok-keyword">number</span>[] = [<span class="tok-number">10</span>, <span class="tok-number">20</span>, <span class="tok-number">30</span>];
<span class="tok-keyword">const</span> names: <span class="tok-keyword">Array</span>&lt;<span class="tok-keyword">string</span>&gt; = [<span class="tok-string">'An'</span>, <span class="tok-string">'Bình'</span>];   <span class="tok-comment">// identical to string[]</span></code></pre>
<p><code>number[]</code> and <code>Array&lt;number&gt;</code> are exactly the same type — the second is the "generic" spelling you'll understand fully in chapter 6. An array's type says "every element is a number", so the compiler stops you putting a string in:</p>
<pre><code>scores.<span class="tok-function">push</span>(<span class="tok-string">'oops'</span>);   <span class="tok-comment">// error: 'oops' is not assignable to 'number'</span></code></pre>

<h3>readonly arrays — freeze at the type level</h3>
<p>Prefix with <code>readonly</code> and the array can be read but never mutated. Every method that would change it is removed from the type:</p>
<pre><code><span class="tok-comment">// roarr.ts</span>
<span class="tok-keyword">const</span> ids: <span class="tok-keyword">readonly</span> <span class="tok-keyword">number</span>[] = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];
ids.<span class="tok-function">push</span>(<span class="tok-number">4</span>);</code></pre>
<div class="out">roarr.ts(2,5): error TS2339: Property 'push' does not exist on type 'readonly number[]'.</div>
<p>This is a compile-time guarantee, not a runtime freeze (remember: types are erased). It's how you express "this function receives a list but promises not to change it" — a contract that prevents a whole class of "who mutated my array?" bugs.</p>

<h3>Tuples — fixed length, position-typed</h3>
<p>A tuple is an array whose length is fixed and whose <em>each position</em> has its own type. Perfect for a coordinate, an RGB colour, or a "return two things" pair:</p>
<pre><code><span class="tok-keyword">let</span> point: [<span class="tok-keyword">number</span>, <span class="tok-keyword">number</span>] = [<span class="tok-number">10</span>, <span class="tok-number">20</span>];
<span class="tok-keyword">let</span> row: [<span class="tok-keyword">string</span>, <span class="tok-keyword">number</span>, <span class="tok-keyword">boolean</span>] = [<span class="tok-string">'An'</span>, <span class="tok-number">30</span>, <span class="tok-keyword">true</span>];</code></pre>
<p>The tuple type enforces both the length and the type at each slot:</p>
<pre><code><span class="tok-comment">// tuple.ts</span>
<span class="tok-keyword">let</span> point: [<span class="tok-keyword">number</span>, <span class="tok-keyword">number</span>] = [<span class="tok-number">10</span>, <span class="tok-number">20</span>];
point = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];</code></pre>
<div class="out">tuple.ts(2,1): error TS2322: Type '[number, number, number]' is not assignable to type '[number, number]'.
  Source has 3 element(s) but target allows only 2.</div>
<p>If you've used React, you've used a tuple every day: <code>useState</code> returns <code>[value, setValue]</code> — a tuple of "the value" and "a function to change it", which is why array-destructuring it works so cleanly.</p>

<h3>When to use which</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>T[]</code></span><span class="v">A list of unknown length, all the same type. The default.</span></div>
  <div class="kv"><span class="k"><code>readonly T[]</code></span><span class="v">A list you receive and promise not to mutate. Great for function parameters.</span></div>
  <div class="kv"><span class="k"><code>[A, B]</code></span><span class="v">A fixed, small, ordered group of different types. A pair, a coordinate, a state hook.</span></div>
</div>
<div class="callout warn">Reach for a tuple only for genuinely positional data. If someone has to remember "index 0 is the name, index 1 is the age", an object <code>{ name, age }</code> (chapter 4) is clearer. Tuples shine when the positions are obvious (x/y) or the pairing is a well-known idiom (useState).</div>
<div class="note-ct">This site uses <code>readonly</code> array parameters in service functions that receive a list to render but must not change it — the type makes the "read-only" intent a compiler-enforced fact, not a comment someone can ignore.</div>
<h3>Array or tuple — the question is whether position means something</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Array: many of the same thing</span><span class="lz-d"><code>string[]</code> has any length and every element is interchangeable. Position carries no meaning — the third item is not special.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tuple: a fixed record with positions</span><span class="lz-d"><code>[number, string]</code> has exactly two elements with different meanings. This is what <code>useState</code> returns and what <code>Object.entries</code> yields.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">readonly changes the contract</span><span class="lz-d"><code>readonly string[]</code> forbids <code>push</code> and <code>sort</code> at compile time. Excellent for function parameters: it documents that you will not mutate the caller's array.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Name your tuple elements</span><span class="lz-d"><code>[x: number, y: number]</code> costs nothing and turns an unreadable pair into a labelled one in every tooltip.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — indexing an array and getting a type that lies.</strong> <code>const first: string = names[0]</code> compiles even when <code>names</code> is empty, because TypeScript types array access as <code>T</code> rather than <code>T | undefined</code> by default. The result is a confident <code>string</code> that is actually <code>undefined</code> at runtime — the exact class of bug types were supposed to remove. Turn on <code>noUncheckedIndexedAccess</code> (Chapter 9.3) and the compiler starts telling the truth; expect it to find real bugs in existing code, which is the point.</p></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Mảng, tuple &amp; readonly</h2>
<p class="lead">Mảng là bộ sưu tập chủ lực. TypeScript cho bạn ba tinh chỉnh so với "một mảng": kiểu phần tử, tính bất biến, và — cho dữ liệu dáng cố định — tuple, nơi mỗi vị trí có kiểu riêng.</p>

<h3>Mảng có kiểu: hai cách viết, một ý nghĩa</h3>
<pre><code><span class="tok-keyword">const</span> scores: <span class="tok-keyword">number</span>[] = [<span class="tok-number">10</span>, <span class="tok-number">20</span>, <span class="tok-number">30</span>];
<span class="tok-keyword">const</span> names: <span class="tok-keyword">Array</span>&lt;<span class="tok-keyword">string</span>&gt; = [<span class="tok-string">'An'</span>, <span class="tok-string">'Bình'</span>];   <span class="tok-comment">// giống hệt string[]</span></code></pre>
<p><code>number[]</code> và <code>Array&lt;number&gt;</code> là đúng cùng một kiểu — cách viết thứ hai là dạng "generic" mà bạn sẽ hiểu trọn ở chương 6. Kiểu của mảng nói "mọi phần tử là số", nên trình biên dịch chặn bạn bỏ một chuỗi vào:</p>
<pre><code>scores.<span class="tok-function">push</span>(<span class="tok-string">'oops'</span>);   <span class="tok-comment">// lỗi: 'oops' không gán được cho 'number'</span></code></pre>

<h3>Mảng readonly — đóng băng ở tầng kiểu</h3>
<p>Thêm tiền tố <code>readonly</code> và mảng đọc được nhưng không bao giờ sửa được. Mọi method có thể làm thay đổi nó đều bị gỡ khỏi kiểu:</p>
<pre><code><span class="tok-comment">// roarr.ts</span>
<span class="tok-keyword">const</span> ids: <span class="tok-keyword">readonly</span> <span class="tok-keyword">number</span>[] = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];
ids.<span class="tok-function">push</span>(<span class="tok-number">4</span>);</code></pre>
<div class="out">roarr.ts(2,5): error TS2339: Property 'push' does not exist on type 'readonly number[]'.</div>
<p>Đây là bảo đảm lúc biên dịch, không phải đóng băng lúc chạy (nhớ: kiểu bị xoá). Nó là cách bạn diễn đạt "hàm này nhận một danh sách nhưng hứa không đổi nó" — một hợp đồng ngăn cả loại bug "ai đã sửa mảng của tôi?".</p>

<h3>Tuple — độ dài cố định, kiểu theo vị trí</h3>
<p>Tuple là một mảng có độ dài cố định và <em>mỗi vị trí</em> mang kiểu riêng. Hoàn hảo cho một toạ độ, một màu RGB, hay một cặp "trả về hai thứ":</p>
<pre><code><span class="tok-keyword">let</span> point: [<span class="tok-keyword">number</span>, <span class="tok-keyword">number</span>] = [<span class="tok-number">10</span>, <span class="tok-number">20</span>];
<span class="tok-keyword">let</span> row: [<span class="tok-keyword">string</span>, <span class="tok-keyword">number</span>, <span class="tok-keyword">boolean</span>] = [<span class="tok-string">'An'</span>, <span class="tok-number">30</span>, <span class="tok-keyword">true</span>];</code></pre>
<p>Kiểu tuple ép cả độ dài lẫn kiểu ở từng ô:</p>
<pre><code><span class="tok-comment">// tuple.ts</span>
<span class="tok-keyword">let</span> point: [<span class="tok-keyword">number</span>, <span class="tok-keyword">number</span>] = [<span class="tok-number">10</span>, <span class="tok-number">20</span>];
point = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];</code></pre>
<div class="out">tuple.ts(2,1): error TS2322: Type '[number, number, number]' is not assignable to type '[number, number]'.
  Source has 3 element(s) but target allows only 2.</div>
<p>Nếu từng dùng React, bạn đã dùng tuple mỗi ngày: <code>useState</code> trả về <code>[value, setValue]</code> — một tuple gồm "giá trị" và "một hàm để đổi nó", chính vì thế mà destructuring theo mảng nó gọn gàng đến vậy.</p>

<h3>Khi nào dùng cái nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>T[]</code></span><span class="v">Một danh sách độ dài chưa biết, cùng một kiểu. Mặc định.</span></div>
  <div class="kv"><span class="k"><code>readonly T[]</code></span><span class="v">Một danh sách bạn nhận và hứa không sửa. Rất hợp cho tham số hàm.</span></div>
  <div class="kv"><span class="k"><code>[A, B]</code></span><span class="v">Một nhóm nhỏ, cố định, có thứ tự gồm các kiểu khác nhau. Một cặp, một toạ độ, một state hook.</span></div>
</div>
<div class="callout warn">Chỉ với tay tới tuple cho dữ liệu thật sự mang tính vị trí. Nếu ai đó phải nhớ "chỉ số 0 là tên, chỉ số 1 là tuổi", thì một object <code>{ name, age }</code> (chương 4) rõ hơn. Tuple toả sáng khi các vị trí hiển nhiên (x/y) hoặc cặp đôi là một thành ngữ ai cũng biết (useState).</div>
<div class="note-ct">Site này dùng tham số mảng <code>readonly</code> trong các service nhận một danh sách để render nhưng không được đổi — cái kiểu biến ý định "chỉ đọc" thành một sự thật do trình biên dịch ép, không phải một câu chú thích ai đó có thể phớt lờ.</div>
<h3>Mảng hay tuple — câu hỏi là VỊ TRÍ có mang nghĩa không</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mảng: nhiều thứ CÙNG loại</span><span class="lz-d"><code>string[]</code> có độ dài bất kỳ và mọi phần tử thay thế được cho nhau. Vị trí không mang nghĩa gì — phần tử thứ ba không có gì đặc biệt.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tuple: một bản ghi CỐ ĐỊNH có vị trí</span><span class="lz-d"><code>[number, string]</code> có đúng hai phần tử mang hai nghĩa khác nhau. Đây là thứ <code>useState</code> trả về và thứ <code>Object.entries</code> sinh ra.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">readonly đổi cả hợp đồng</span><span class="lz-d"><code>readonly string[]</code> cấm <code>push</code> và <code>sort</code> ngay lúc biên dịch. Tuyệt vời cho tham số hàm: nó ghi rõ rằng bạn sẽ KHÔNG sửa mảng của bên gọi.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đặt tên cho phần tử tuple</span><span class="lz-d"><code>[x: number, y: number]</code> không tốn gì và biến một cặp không đọc nổi thành một cặp CÓ NHÃN trong mọi tooltip.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — truy cập mảng theo chỉ số và nhận về một cái kiểu NÓI DỐI.</strong> <code>const first: string = names[0]</code> biên dịch được ngay cả khi <code>names</code> rỗng, vì mặc định TypeScript gán kiểu cho phép truy cập mảng là <code>T</code> chứ không phải <code>T | undefined</code>. Kết quả là một <code>string</code> đầy tự tin mà lúc chạy thật ra là <code>undefined</code> — đúng cái họ lỗi mà kiểu sinh ra để dẹp. Hãy bật <code>noUncheckedIndexedAccess</code> (Bài 9.3) và trình biên dịch bắt đầu nói thật; hãy chuẩn bị tinh thần là nó sẽ tìm ra bug THẬT trong mã đang có, và đó chính là mục đích.</p></div>
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — The special types: any, unknown, never, void|||2.3 — Các kiểu đặc biệt: any, unknown, never, void',
      slug: 'typescript-2-3-kieu-dac-biet',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn kiểu không đại diện dữ liệu thường: any (tắt kiểm), unknown (đỉnh an toàn), never (đáy, không giá trị nào), void (hàm không trả về).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The special types: any, unknown, never, void</h2>
<p class="lead">Four types don't describe ordinary data — they describe situations. You met <code>any</code> and <code>unknown</code> in chapter 1; here they join <code>never</code> and <code>void</code> so you can see the full set and how they relate.</p>

<h3>unknown — the safe top type</h3>
<p><code>unknown</code> is the type of "could be anything". You can assign anything to it, but you can't <em>use</em> it until you prove what it is:</p>
<pre><code><span class="tok-comment">// unk.ts</span>
<span class="tok-keyword">const</span> data: <span class="tok-keyword">unknown</span> = <span class="tok-string">'hello'</span>;
data.<span class="tok-function">toUpperCase</span>();</code></pre>
<div class="out">unk.ts(2,1): error TS18046: 'data' is of type 'unknown'.</div>
<p>Even though we can see it's a string, the type is <code>unknown</code>, so TypeScript blocks the method call until you narrow (<code>if (typeof data === 'string')</code>). This is the correct type for anything crossing your program's boundary.</p>

<h3>any — the unsafe escape hatch (recap)</h3>
<p>Contrast: <code>any</code> is "stop checking". The same call is allowed, and so is nonsense:</p>
<pre><code><span class="tok-keyword">const</span> x: <span class="tok-keyword">any</span> = <span class="tok-string">'hello'</span>;
x.foo.bar.<span class="tok-function">baz</span>();     <span class="tok-comment">// no error — checking is off</span></code></pre>
<div class="callout warn"><code>unknown</code> and <code>any</code> both mean "I don't know the type". <code>unknown</code> keeps you safe by forcing a check; <code>any</code> abandons safety. Prefer <code>unknown</code> every time you're tempted by <code>any</code>.</div>

<h3>void — "this function returns nothing useful"</h3>
<p><code>void</code> is the return type of a function that doesn't return a value — it runs for its side effect (logging, saving) and gives you nothing back:</p>
<pre><code><span class="tok-comment">// voidret.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">log</span>(m: <span class="tok-keyword">string</span>): <span class="tok-keyword">void</span> {
  <span class="tok-function">console.log</span>(m);
}
<span class="tok-keyword">const</span> r: <span class="tok-keyword">number</span> = <span class="tok-function">log</span>(<span class="tok-string">'hi'</span>);   <span class="tok-comment">// trying to use the "return"</span></code></pre>
<div class="out">voidret.ts(4,7): error TS2322: Type 'void' is not assignable to type 'number'.</div>
<p>Trying to capture a <code>void</code> function's return into a <code>number</code> fails — there is nothing to capture. <code>void</code> is subtly different from <code>undefined</code>: it means "ignore whatever comes back", which matters for callbacks (a common gotcha covered in chapter 3).</p>

<h3>never — the bottom type, "this cannot happen"</h3>
<p><code>never</code> is the type of a value that can <em>never</em> exist. A function that always throws, or loops forever, never actually returns a value — so its return type is <code>never</code>:</p>
<pre><code><span class="tok-comment">// never1.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">fail</span>(msg: <span class="tok-keyword">string</span>): <span class="tok-keyword">never</span> {
  <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(msg);
}
<span class="tok-keyword">const</span> x = <span class="tok-function">fail</span>(<span class="tok-string">'boom'</span>);   <span class="tok-comment">// x: never — no value ever gets here</span></code></pre>
<p>It feels abstract now, but <code>never</code> powers one of TypeScript's best safety tricks: <strong>exhaustiveness checking</strong>. In chapter 5 you'll use it to make the compiler force you to handle every case of a union — add a new status and forget to handle it, and a <code>never</code> assignment lights up red. It's the type that means "if you reached here, you made a mistake".</p>

<h3>The relationships</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">unknown (top)</span><span class="v">Everything is assignable TO it. You must narrow before use. Safe.</span></div>
  <div class="kv"><span class="k">any (opt-out)</span><span class="v">Assignable both ways, all checks off. Unsafe — avoid.</span></div>
  <div class="kv"><span class="k">void</span><span class="v">A function's "returns nothing" result.</span></div>
  <div class="kv"><span class="k">never (bottom)</span><span class="v">No value has this type. For code that can't be reached or a function that never returns.</span></div>
</div>
<div class="note-ct">This site uses a <code>never</code>-based exhaustiveness check on its content-type union: when a new content type is added and a switch statement forgets it, the build fails on a <code>never</code> assignment — a compile-time reminder that would have caught more than one "we forgot to handle X" bug before it shipped.</div>
<h3>any, unknown, never, void — four very different ideas</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">any</span><span class="lz-lnote">"Stop checking." It is assignable both ways, so one <code>any</code> spreads outward through everything it touches. A deliberate escape hatch, not a placeholder.</span></div>
<div class="lz-layer"><span class="lz-lname">unknown</span><span class="lz-lnote">"Something, but prove what before you use it." Assignable <em>from</em> anything, assignable <em>to</em> nothing until you narrow it. This is what every parsed JSON should be.</span></div>
<div class="lz-layer"><span class="lz-lname">never</span><span class="lz-lnote">"This cannot happen." The return type of a function that always throws, and the type of a variable in an unreachable branch — which is how exhaustiveness checking works (5.4).</span></div>
<div class="lz-layer"><span class="lz-lname">void</span><span class="lz-lnote">"Returns nothing you should use." Different from <code>undefined</code>: a <code>void</code>-returning callback may return a value, and the caller simply ignores it.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>any</code> used as a temporary fix that becomes permanent.</strong> It silences the error instantly, which is exactly why it survives code review and lives in the file for years. The damage is not local: any value derived from an <code>any</code> is also <code>any</code>, so one annotation can quietly disable checking across a whole call chain, and nothing ever reports it. When you genuinely do not know a type, write <code>unknown</code> — the errors it produces are the list of places that need a real check. Turn on <code>noImplicitAny</code> so the compiler stops inserting them for you.</p></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Các kiểu đặc biệt: any, unknown, never, void</h2>
<p class="lead">Bốn kiểu không mô tả dữ liệu thông thường — chúng mô tả các tình huống. Bạn đã gặp <code>any</code> và <code>unknown</code> ở chương 1; ở đây chúng hợp cùng <code>never</code> và <code>void</code> để bạn thấy trọn bộ và cách chúng liên hệ.</p>

<h3>unknown — kiểu đỉnh an toàn</h3>
<p><code>unknown</code> là kiểu của "có thể là bất cứ gì". Bạn gán được mọi thứ vào nó, nhưng không <em>dùng</em> được nó cho tới khi chứng minh nó là gì:</p>
<pre><code><span class="tok-comment">// unk.ts</span>
<span class="tok-keyword">const</span> data: <span class="tok-keyword">unknown</span> = <span class="tok-string">'hello'</span>;
data.<span class="tok-function">toUpperCase</span>();</code></pre>
<div class="out">unk.ts(2,1): error TS18046: 'data' is of type 'unknown'.</div>
<p>Dù ta thấy rõ nó là chuỗi, kiểu vẫn là <code>unknown</code>, nên TypeScript chặn lời gọi method cho tới khi bạn thu hẹp (<code>if (typeof data === 'string')</code>). Đây là kiểu đúng cho bất cứ gì băng qua ranh giới chương trình của bạn.</p>

<h3>any — lối thoát hiểm không an toàn (nhắc lại)</h3>
<p>Đối lại: <code>any</code> là "ngừng kiểm tra". Cùng lời gọi đó được cho qua, và cả những thứ vô nghĩa cũng vậy:</p>
<pre><code><span class="tok-keyword">const</span> x: <span class="tok-keyword">any</span> = <span class="tok-string">'hello'</span>;
x.foo.bar.<span class="tok-function">baz</span>();     <span class="tok-comment">// không lỗi — kiểm tra bị tắt</span></code></pre>
<div class="callout warn"><code>unknown</code> và <code>any</code> đều nghĩa là "tôi không biết kiểu". <code>unknown</code> giữ bạn an toàn bằng cách ép một phép kiểm; <code>any</code> vứt bỏ an toàn. Hãy chọn <code>unknown</code> mỗi khi bị <code>any</code> cám dỗ.</div>

<h3>void — "hàm này không trả về gì hữu ích"</h3>
<p><code>void</code> là kiểu trả về của một hàm không trả về giá trị — nó chạy vì tác dụng phụ (ghi log, lưu) và không đưa lại gì cho bạn:</p>
<pre><code><span class="tok-comment">// voidret.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">log</span>(m: <span class="tok-keyword">string</span>): <span class="tok-keyword">void</span> {
  <span class="tok-function">console.log</span>(m);
}
<span class="tok-keyword">const</span> r: <span class="tok-keyword">number</span> = <span class="tok-function">log</span>(<span class="tok-string">'hi'</span>);   <span class="tok-comment">// cố dùng cái "trả về"</span></code></pre>
<div class="out">voidret.ts(4,7): error TS2322: Type 'void' is not assignable to type 'number'.</div>
<p>Cố hứng giá trị trả về của một hàm <code>void</code> vào một <code>number</code> sẽ thất bại — chẳng có gì để hứng. <code>void</code> khác <code>undefined</code> một cách tinh tế: nó nghĩa là "kệ thứ gì quay lại", điều này quan trọng với callback (một cái bẫy hay gặp, bàn ở chương 3).</p>

<h3>never — kiểu đáy, "điều này không thể xảy ra"</h3>
<p><code>never</code> là kiểu của một giá trị <em>không bao giờ</em> tồn tại được. Một hàm luôn ném lỗi, hoặc lặp vô tận, không bao giờ thật sự trả về một giá trị — nên kiểu trả về của nó là <code>never</code>:</p>
<pre><code><span class="tok-comment">// never1.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">fail</span>(msg: <span class="tok-keyword">string</span>): <span class="tok-keyword">never</span> {
  <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(msg);
}
<span class="tok-keyword">const</span> x = <span class="tok-function">fail</span>(<span class="tok-string">'boom'</span>);   <span class="tok-comment">// x: never — không giá trị nào tới được đây</span></code></pre>
<p>Bây giờ nghe trừu tượng, nhưng <code>never</code> tiếp sức cho một trong những mẹo an toàn hay nhất của TypeScript: <strong>kiểm tra đầy đủ (exhaustiveness)</strong>. Ở chương 5 bạn sẽ dùng nó để ép trình biên dịch bắt bạn xử lý mọi trường hợp của một union — thêm một trạng thái mới mà quên xử lý, thì một phép gán <code>never</code> sẽ sáng đỏ. Nó là kiểu mang nghĩa "nếu bạn tới được đây thì bạn đã sai".</p>

<h3>Các mối quan hệ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">unknown (đỉnh)</span><span class="v">Mọi thứ gán ĐƯỢC VÀO nó. Phải thu hẹp trước khi dùng. An toàn.</span></div>
  <div class="kv"><span class="k">any (thoát kiểm)</span><span class="v">Gán được cả hai chiều, tắt hết kiểm. Không an toàn — tránh.</span></div>
  <div class="kv"><span class="k">void</span><span class="v">Kết quả "không trả về gì" của một hàm.</span></div>
  <div class="kv"><span class="k">never (đáy)</span><span class="v">Không giá trị nào mang kiểu này. Cho code không thể tới được hoặc hàm không bao giờ trả về.</span></div>
</div>
<div class="note-ct">Site này dùng một phép kiểm đầy đủ dựa trên <code>never</code> lên union kiểu-nội-dung: khi thêm một kiểu nội dung mới mà một câu switch quên nó, bản build hỏng ở một phép gán <code>never</code> — một lời nhắc lúc biên dịch đã có thể bắt được hơn một con bug "chúng ta quên xử lý X" trước khi nó lên production.</div>
<h3>any, unknown, never, void — bốn ý niệm rất khác nhau</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">any</span><span class="lz-lnote">"Thôi đừng kiểm nữa." Nó gán được theo CẢ HAI chiều, nên một cái <code>any</code> LAN RA qua mọi thứ nó chạm vào. Một lối thoát hiểm CÓ CHỦ Ý, không phải một chỗ giữ tạm.</span></div>
<div class="lz-layer"><span class="lz-lname">unknown</span><span class="lz-lnote">"Một thứ gì đó, nhưng chứng minh là gì trước khi dùng." Gán được TỪ mọi thứ, gán được CHO không thứ gì cho tới khi bạn thu hẹp nó. Đây là thứ mà mọi JSON vừa phân tích nên mang.</span></div>
<div class="lz-layer"><span class="lz-lname">never</span><span class="lz-lnote">"Chuyện này không thể xảy ra." Kiểu trả về của một hàm luôn ném lỗi, và kiểu của một biến trong nhánh không thể tới được — đó chính là cách kiểm vét cạn hoạt động (5.4).</span></div>
<div class="lz-layer"><span class="lz-lname">void</span><span class="lz-lnote">"Không trả về thứ gì bạn nên dùng." Khác <code>undefined</code>: một callback kiểu <code>void</code> VẪN được phép trả về giá trị, và bên gọi đơn giản là lờ nó đi.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — dùng <code>any</code> như một miếng vá tạm rồi nó thành vĩnh viễn.</strong> Nó dập tắt lỗi ngay lập tức, và chính vì thế nó sống sót qua review rồi nằm lại trong tệp hàng năm trời. Thiệt hại không cục bộ: mọi giá trị dẫn xuất từ một <code>any</code> cũng là <code>any</code>, nên MỘT chú thích có thể lặng lẽ tắt phép kiểm trên cả một chuỗi lời gọi, và không gì báo cáo chuyện đó. Khi bạn thật sự chưa biết kiểu, hãy viết <code>unknown</code> — những lỗi nó sinh ra chính là DANH SÁCH các chỗ cần một phép kiểm thật. Hãy bật <code>noImplicitAny</code> để trình biên dịch thôi tự chèn <code>any</code> giùm bạn.</p></div>
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Literal types & as const|||2.4 — Kiểu literal & as const',
      slug: 'typescript-2-4-literal-as-const',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Kiểu literal thu hẹp một giá trị xuống đúng một khả năng, as const khoá cả object/mảng thành literal readonly — nền cho union ở chương 5.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Literal types &amp; as const</h2>
<p class="lead">A literal type is a type that is exactly one value — not "a string" but the string <code>"draft"</code>. On their own they look pointless; combined with unions (chapter 5) they become one of TypeScript's most powerful modelling tools. This lesson plants that seed.</p>

<h3>A single-value type</h3>
<p>You saw in chapter 1 that <code>const b = 'CuongThai'</code> is inferred as the literal type <code>"CuongThai"</code>, not <code>string</code>. You can also write literal types by hand:</p>
<pre><code><span class="tok-keyword">let</span> mode: <span class="tok-string">'dark'</span>;
mode = <span class="tok-string">'dark'</span>;    <span class="tok-comment">// OK</span>
mode = <span class="tok-string">'light'</span>;   <span class="tok-comment">// error: '"light"' is not assignable to type '"dark"'</span></code></pre>
<p>A variable of type <code>'dark'</code> can only ever be the string <code>'dark'</code>. Useless alone — but now preview where this goes:</p>
<pre><code><span class="tok-keyword">type</span> Mode = <span class="tok-string">'dark'</span> | <span class="tok-string">'light'</span>;   <span class="tok-comment">// a union of literals (chapter 5)</span>
<span class="tok-keyword">let</span> theme: Mode = <span class="tok-string">'dark'</span>;         <span class="tok-comment">// only 'dark' or 'light', nothing else</span></code></pre>
<p>That single line replaces a comment ("mode should be 'dark' or 'light'") with a rule the compiler enforces. Typos like <code>'drak'</code> become errors. This is how TypeScript models the finite sets that fill real apps — statuses, roles, sizes, directions.</p>

<h3>as const — freeze a whole value into literals</h3>
<p>By default, TypeScript widens object properties to general types (<code>{ mode: string }</code>), because objects are usually mutable. Add <code>as const</code> and it does the opposite: every property becomes a <code>readonly</code> literal.</p>
<pre><code><span class="tok-comment">// asconst.ts</span>
<span class="tok-keyword">const</span> config = { mode: <span class="tok-string">'dark'</span>, retries: <span class="tok-number">3</span> } <span class="tok-keyword">as const</span>;
<span class="tok-keyword">const</span> tags = [<span class="tok-string">'a'</span>, <span class="tok-string">'b'</span>] <span class="tok-keyword">as const</span>;</code></pre>
<p>The inferred types (from a declaration dump):</p>
<div class="out">declare const config: {
    readonly mode: 'dark';
    readonly retries: 3;
};
declare const tags: readonly ['a', 'b'];</div>
<p>Without <code>as const</code>, <code>config.mode</code> would be <code>string</code> and <code>tags</code> would be <code>string[]</code>. With it, <code>mode</code> is exactly <code>'dark'</code>, <code>retries</code> is exactly <code>3</code>, and the whole thing is deeply <code>readonly</code>. This is how you turn a plain object of constants into precise, locked-down types.</p>
<div class="callout ok">A common professional pattern: define your allowed values once as an <code>as const</code> array, then derive the union type from it (chapter 7's <code>typeof</code> + indexed access). One source of truth, used both as runtime data and as a compile-time type.</div>

<h3>Why this matters going forward</h3>
<p>Literal types are the atom. Unions of them (chapter 5) let you say "one of these exact values". <code>as const</code> lets you lock real data into those precise types. Together they're how you make invalid states <em>unrepresentable</em> — the north star of good TypeScript modelling, which the rest of Stage 2 builds toward.</p>
<div class="pitfall">Widening surprises beginners constantly. <code>const obj = { status: 'draft' }</code> gives <code>obj.status</code> the type <code>string</code>, not <code>'draft'</code> — so passing it where a <code>'draft' | 'published'</code> is expected fails. The fix is usually <code>as const</code> or an explicit type on the variable. When a literal "downgrades" to <code>string</code> unexpectedly, widening is the culprit.</div>
<div class="note-ct">This site models things like content type, note status and user role as unions of string literals — the exact enum rename that broke production (chapter 9) was one of these. The lesson the codebase learned: derive the union from one source, never hand-copy the literals into a second file where they can drift.</div>
<h3>How a literal type appears — and disappears</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">const gives you the literal</span><span class="lz-d"><code>const dir = 'left'</code> has type <code>'left'</code>, because a <code>const</code> can never hold anything else.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">let widens it</span><span class="lz-d"><code>let dir = 'left'</code> has type <code>string</code>. The variable is reassignable, so TypeScript picks the wider type — and it no longer fits <code>'left' | 'right'</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Object properties widen too</span><span class="lz-d"><code>const o = { dir: 'left' }</code> gives <code>{ dir: string }</code>, because the property is mutable. This is the version that surprises people.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">as const freezes everything</span><span class="lz-d">It makes every property <code>readonly</code> and every value its literal type, recursively — turning a config object into a precise type you can derive unions from with <code>typeof</code> and <code>keyof</code>.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — passing an object literal to a function expecting a literal union.</strong> <code>request({ method: 'GET' })</code> works, but assigning it to a variable first and passing that fails: <code>const opts = { method: 'GET' }</code> widens <code>method</code> to <code>string</code>, and <code>string</code> is not <code>'GET' | 'POST'</code>. The error message talks about types you never wrote, and the fix looks arbitrary until you know the rule. Use <code>as const</code> on the object, or annotate the variable with the option type so the literal is preserved.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: types &amp; literals on Code Lab</span><span class="lc-sub">Cement chapter 2 with the matching exercises.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Kiểu literal &amp; as const</h2>
<p class="lead">Kiểu literal là một kiểu chỉ đúng một giá trị — không phải "một chuỗi" mà là chuỗi <code>"draft"</code>. Đứng một mình chúng trông vô dụng; kết hợp với union (chương 5) chúng trở thành một trong những công cụ mô hình hoá mạnh nhất của TypeScript. Bài này gieo cái hạt đó.</p>

<h3>Một kiểu chỉ-một-giá-trị</h3>
<p>Chương 1 bạn đã thấy <code>const b = 'CuongThai'</code> được suy ra là kiểu literal <code>"CuongThai"</code>, không phải <code>string</code>. Bạn cũng viết kiểu literal bằng tay được:</p>
<pre><code><span class="tok-keyword">let</span> mode: <span class="tok-string">'dark'</span>;
mode = <span class="tok-string">'dark'</span>;    <span class="tok-comment">// OK</span>
mode = <span class="tok-string">'light'</span>;   <span class="tok-comment">// lỗi: '"light"' không gán được cho kiểu '"dark"'</span></code></pre>
<p>Một biến kiểu <code>'dark'</code> chỉ có thể mãi là chuỗi <code>'dark'</code>. Vô dụng nếu đứng một mình — nhưng giờ xem trước nó đi tới đâu:</p>
<pre><code><span class="tok-keyword">type</span> Mode = <span class="tok-string">'dark'</span> | <span class="tok-string">'light'</span>;   <span class="tok-comment">// một union của literal (chương 5)</span>
<span class="tok-keyword">let</span> theme: Mode = <span class="tok-string">'dark'</span>;         <span class="tok-comment">// chỉ 'dark' hoặc 'light', không gì khác</span></code></pre>
<p>Đúng một dòng đó thay một câu chú thích ("mode nên là 'dark' hoặc 'light'") bằng một quy tắc trình biên dịch ép tuân. Gõ sai như <code>'drak'</code> trở thành lỗi. Đây là cách TypeScript mô hình hoá những tập hữu hạn đầy rẫy trong app thật — trạng thái, vai trò, kích cỡ, hướng.</p>

<h3>as const — khoá cả một giá trị thành literal</h3>
<p>Mặc định, TypeScript nới rộng thuộc tính object thành kiểu chung (<code>{ mode: string }</code>), vì object thường thay đổi được. Thêm <code>as const</code> và nó làm ngược lại: mọi thuộc tính trở thành một literal <code>readonly</code>.</p>
<pre><code><span class="tok-comment">// asconst.ts</span>
<span class="tok-keyword">const</span> config = { mode: <span class="tok-string">'dark'</span>, retries: <span class="tok-number">3</span> } <span class="tok-keyword">as const</span>;
<span class="tok-keyword">const</span> tags = [<span class="tok-string">'a'</span>, <span class="tok-string">'b'</span>] <span class="tok-keyword">as const</span>;</code></pre>
<p>Kiểu suy ra (từ bản dump khai báo):</p>
<div class="out">declare const config: {
    readonly mode: 'dark';
    readonly retries: 3;
};
declare const tags: readonly ['a', 'b'];</div>
<p>Không có <code>as const</code>, <code>config.mode</code> sẽ là <code>string</code> và <code>tags</code> sẽ là <code>string[]</code>. Có nó, <code>mode</code> đúng là <code>'dark'</code>, <code>retries</code> đúng là <code>3</code>, và toàn bộ trở nên <code>readonly</code> sâu. Đây là cách bạn biến một object hằng số bình thường thành các kiểu chính xác, đã khoá chặt.</p>
<div class="callout ok">Một mẫu chuyên nghiệp hay gặp: định nghĩa các giá trị được phép một lần dưới dạng mảng <code>as const</code>, rồi rút ra kiểu union từ nó (dùng <code>typeof</code> + truy cập chỉ số ở chương 7). Một nguồn sự thật duy nhất, dùng vừa làm dữ liệu lúc chạy vừa làm kiểu lúc biên dịch.</div>

<h3>Vì sao điều này quan trọng về sau</h3>
<p>Kiểu literal là nguyên tử. Union của chúng (chương 5) cho bạn nói "một trong những giá trị chính xác này". <code>as const</code> cho bạn khoá dữ liệu thật vào đúng các kiểu đó. Cùng nhau chúng là cách bạn khiến những trạng thái không hợp lệ <em>không biểu diễn nổi</em> — sao Bắc Đẩu của việc mô hình hoá TypeScript tốt, mà cả phần còn lại của Giai đoạn 2 hướng tới.</p>
<div class="pitfall">Sự nới rộng làm người mới bất ngờ liên tục. <code>const obj = { status: 'draft' }</code> cho <code>obj.status</code> kiểu <code>string</code>, không phải <code>'draft'</code> — nên truyền nó vào chỗ chờ <code>'draft' | 'published'</code> sẽ thất bại. Cách sửa thường là <code>as const</code> hoặc một kiểu tường minh trên biến. Khi một literal bất ngờ "tụt hạng" xuống <code>string</code>, thủ phạm là nới rộng.</div>
<div class="note-ct">Site này mô hình hoá những thứ như kiểu nội dung, trạng thái ghi chú và vai trò người dùng thành union của các literal chuỗi — chính lần đổi tên enum làm vỡ production (chương 9) là một trong số đó. Bài học codebase rút ra: rút union từ một nguồn, đừng bao giờ chép tay các literal sang một file thứ hai nơi chúng có thể trôi dạt.</div>
<h3>Một kiểu literal xuất hiện — rồi biến mất — như thế nào</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">const cho bạn cái literal</span><span class="lz-d"><code>const dir = 'left'</code> có kiểu <code>'left'</code>, vì một <code>const</code> không bao giờ giữ được thứ khác.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">let NỚI RỘNG nó ra</span><span class="lz-d"><code>let dir = 'left'</code> có kiểu <code>string</code>. Biến ấy gán lại được, nên TypeScript chọn kiểu rộng hơn — và nó không còn vừa <code>'left' | 'right'</code> nữa.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thuộc tính đối tượng cũng nới rộng</span><span class="lz-d"><code>const o = { dir: 'left' }</code> cho ra <code>{ dir: string }</code>, vì thuộc tính ấy sửa được. Đây là phiên bản làm người ta bất ngờ.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">as const đóng băng tất cả</span><span class="lz-d">Nó biến mọi thuộc tính thành <code>readonly</code> và mọi giá trị thành kiểu literal của nó, theo cả chiều sâu — biến một đối tượng cấu hình thành một kiểu CHÍNH XÁC mà bạn dẫn xuất union ra được bằng <code>typeof</code> và <code>keyof</code>.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — truyền một object literal vào hàm đang chờ một literal union.</strong> <code>request({ method: 'GET' })</code> thì chạy, nhưng gán nó vào một biến rồi truyền biến đó thì hỏng: <code>const opts = { method: 'GET' }</code> nới <code>method</code> thành <code>string</code>, và <code>string</code> không phải <code>'GET' | 'POST'</code>. Thông báo lỗi nói về những kiểu bạn chưa từng viết, và cách chữa trông tuỳ tiện cho tới khi bạn biết cái luật ấy. Hãy dùng <code>as const</code> lên đối tượng, hoặc chú thích cái biến bằng kiểu tuỳ chọn để literal được giữ nguyên.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: kiểu &amp; literal trên Code Lab</span><span class="lc-sub">Củng cố chương 2 bằng các bài tập tương ứng.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 2.5 quiz ─────────────────────────── */
    {
      title: '2.5 — Chapter 2 quiz|||2.5 — Kiểm tra Chương 2',
      slug: 'typescript-2-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về primitive, strict null, mảng/tuple/readonly, any/unknown/never/void, literal & as const.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions across the basic type system. Answer from memory; the questions follow lesson order so a miss points straight at what to revisit.</p>
<div class="callout ok">Aim for 7/8. If <code>never</code> vs <code>void</code> or widening trips you up, re-read lessons 2.3 and 2.4 — they underpin all of Stage 2.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu xuyên hệ thống kiểu cơ bản. Trả lời bằng trí nhớ; các câu xếp theo thứ tự bài nên câu sai chỉ thẳng chỗ cần xem lại.</p>
<div class="callout ok">Hãy nhắm 7/8. Nếu <code>never</code> vs <code>void</code> hoặc sự nới rộng làm bạn vấp, đọc lại bài 2.3 và 2.4 — chúng là nền cho cả Giai đoạn 2.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Under strict mode, let title: string = "An"; title = null; does what?|||Dưới chế độ strict, let title: string = "An"; title = null; ra sao?',
            options: [
              'Compiles fine|||Biên dịch bình thường',
              "Errors: Type 'null' is not assignable to type 'string'|||Lỗi: Type 'null' is not assignable to type 'string'",
              'Sets title to undefined|||Đặt title thành undefined',
              'Only warns, does not error|||Chỉ cảnh báo, không lỗi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the difference between number[] and Array<number>?|||Khác biệt giữa number[] và Array<number> là gì?',
            options: [
              'None — they are exactly the same type|||Không có — chúng đúng là cùng một kiểu',
              'Array<number> is faster at runtime|||Array<number> nhanh hơn lúc chạy',
              'number[] is readonly|||number[] là readonly',
              'Array<number> can hold strings too|||Array<number> chứa được cả chuỗi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Calling ids.push(4) on const ids: readonly number[] gives?|||Gọi ids.push(4) trên const ids: readonly number[] cho ra?',
            options: [
              'It appends 4 at runtime|||Nó thêm 4 vào lúc chạy',
              "Error: Property 'push' does not exist on type 'readonly number[]'|||Lỗi: Property 'push' does not exist on type 'readonly number[]'",
              'A runtime freeze error|||Một lỗi đóng băng lúc chạy',
              'Nothing — readonly is a comment|||Không gì cả — readonly chỉ là chú thích',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A [number, number] tuple assigned [1, 2, 3] errors because…|||Một tuple [number, number] bị gán [1, 2, 3] báo lỗi vì…',
            options: [
              'The values are too large|||Các giá trị quá lớn',
              'Source has 3 elements but the target allows only 2|||Nguồn có 3 phần tử nhưng đích chỉ cho phép 2',
              'Tuples cannot hold numbers|||Tuple không chứa số được',
              'You must use readonly|||Bạn phải dùng readonly',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which type forces you to check before using the value?|||Kiểu nào ép bạn kiểm tra trước khi dùng giá trị?',
            options: ['any', 'unknown', 'void', 'never'],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the return type of a function that always throws?|||Kiểu trả về của một hàm luôn ném lỗi là gì?',
            options: ['void', 'undefined', 'never', 'any'],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'const config = { mode: "dark" } as const makes config.mode have which type?|||const config = { mode: "dark" } as const khiến config.mode mang kiểu nào?',
            options: [
              'string',
              'The literal "dark" (and readonly)|||Literal "dark" (và readonly)',
              'any',
              'Mode',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'const obj = { status: "draft" } — what type does obj.status have (no as const)?|||const obj = { status: "draft" } — obj.status mang kiểu gì (không as const)?',
            options: [
              'The literal "draft"|||Literal "draft"',
              'string (widening) — which can surprise you|||string (nới rộng) — điều có thể làm bạn bất ngờ',
              'never',
              'readonly "draft"',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
