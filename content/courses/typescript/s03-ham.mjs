/**
 * TypeScript — Chương 3: Hàm.
 * Mọi output tsc là THẬT (tsc 7.0.2, --strict). Song ngữ .ml-en/.ml-vi.
 * < > trong code → &lt; &gt;; backtick trần → &#96;; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 3 — Functions|||Chương 3 — Hàm',
  description: 'Gõ kiểu tham số (bắt buộc, optional, mặc định, rest), hàm như một giá trị và callback, overload, và this.',
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — Typing parameters: required, optional, default, rest|||3.1 — Gõ kiểu tham số: bắt buộc, optional, mặc định, rest',
      slug: 'typescript-3-1-tham-so',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tham số bắt buộc, optional với ?, giá trị mặc định, rest ...args, và vì sao kiểu trả về thường để cho suy luận lo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Typing parameters: required, optional, default, rest</h2>
<p class="lead">Functions are the boundaries where values enter your code, so — from chapter 1 — they're the one place you almost always annotate. TypeScript gives you four flavours of parameter, and it checks every call against them.</p>

<h3>Required parameters and inferred returns</h3>
<p>Annotate the parameters; let the return type be inferred from what you actually return. TypeScript works it out precisely:</p>
<pre><code><span class="tok-comment">// retinfer.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">makeUser</span>(name: <span class="tok-keyword">string</span>) {
  <span class="tok-keyword">return</span> { name, createdAt: Date.<span class="tok-function">now</span>() };
}</code></pre>
<div class="out">declare function makeUser(name: string): {
    name: string;
    createdAt: number;
};</div>
<p>You wrote one annotation (<code>name: string</code>); TypeScript inferred the entire return shape. Annotating the return type is optional — but doing it on exported/public functions is good practice: it documents intent and turns "I accidentally returned the wrong shape" into an error at the function, not at some distant caller.</p>

<h3>Optional parameters with ?</h3>
<p>A <code>?</code> after the name makes a parameter optional — callers may omit it, and inside the function its type includes <code>undefined</code>. TypeScript then forces you to handle the missing case:</p>
<pre><code><span class="tok-comment">// opt.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">greet</span>(name: <span class="tok-keyword">string</span>, title?: <span class="tok-keyword">string</span>) {
  <span class="tok-keyword">return</span> title.<span class="tok-function">toUpperCase</span>() + <span class="tok-string">' '</span> + name;
}</code></pre>
<div class="out">opt.ts(2,10): error TS18048: 'title' is possibly 'undefined'.</div>
<p>Because <code>title</code> might not be passed, its type is <code>string | undefined</code>, and calling <code>.toUpperCase()</code> on possibly-undefined is blocked. The fix is a check: <code>if (title) ...</code> or a default. Optional parameters must come <em>after</em> required ones.</p>

<h3>Default parameters</h3>
<p>Give a parameter a default value and two things happen: callers may omit it, and inside the function it's never <code>undefined</code> (the default fills in). Notice the inferred signature makes it optional automatically:</p>
<pre><code><span class="tok-comment">// deflt.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">paginate</span>(page: <span class="tok-keyword">number</span>, size = <span class="tok-number">20</span>) {
  <span class="tok-keyword">return</span> { page, size };
}</code></pre>
<div class="out">declare function paginate(page: number, size?: number): {
    page: number;
    size: number;
};</div>
<p>You didn't annotate <code>size</code> — TypeScript inferred <code>number</code> from the default <code>20</code>, and marked it optional (<code>size?</code>) in the signature. Inside the body, <code>size</code> is a plain <code>number</code>, no undefined to guard. This is usually nicer than an optional parameter: the caller gets a sensible value instead of <code>undefined</code>.</p>

<h3>Rest parameters</h3>
<p>To accept "any number of arguments", use a rest parameter — it collects the extras into a typed array:</p>
<pre><code><span class="tok-comment">// rest.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">sum</span>(...nums: <span class="tok-keyword">number</span>[]): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">return</span> nums.<span class="tok-function">reduce</span>((a, b) => a + b, <span class="tok-number">0</span>);
}
<span class="tok-function">sum</span>(<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-string">'x'</span>);</code></pre>
<div class="out">rest.ts(4,11): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.</div>
<p>Every argument is checked against the rest element type. <code>sum(1, 2)</code>, <code>sum(1, 2, 3, 4)</code> — all fine; <code>sum(1, 2, 'x')</code> — the string is rejected at the exact argument.</p>
<div class="callout ok">The rule of thumb from chapter 1, made concrete: <strong>annotate parameters, let returns infer</strong> (annotate returns too on public APIs for safety). Optional vs default: prefer a default when there's a sensible one; use optional when "absent" is genuinely different from any value.</div>
<div class="note-ct">This site's list endpoints use exactly this <code>paginate(page, size = 20)</code> shape — a required page, a sensible default page size — so a caller that omits the size gets 20, never <code>undefined</code> flowing into a database <code>LIMIT</code>.</div>
<h3>Optional, default, rest — three different promises</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">name?: string</span><span class="lz-lnote">May be omitted; inside the function its type is <code>string | undefined</code> and you must handle that. Optional parameters must come last.</span></div>
<div class="lz-layer"><span class="lz-lname">name = 'guest'</span><span class="lz-lnote">May be omitted; inside the function it is simply <code>string</code>, because the default filled it. Usually the better choice — it removes a branch.</span></div>
<div class="lz-layer"><span class="lz-lname">...rest: number[]</span><span class="lz-lnote">Collects everything remaining into an array. Typed as an array, and it too must be last.</span></div>
<div class="lz-layer"><span class="lz-lname">an options object</span><span class="lz-lnote">Past three parameters, take one object instead. Call sites become self-documenting and adding a field later stops being a breaking change.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>x?: number</code> and <code>x: number | undefined</code> read as the same thing.</strong> They are not. The first may be left out entirely; the second must be passed, even if you pass <code>undefined</code> explicitly. That distinction is invisible until a refactor removes an argument and the compiler stays silent because the parameter was optional — the call now means something different and nothing said so. Use <code>?</code> when omitting it is genuinely valid, and the explicit union when the caller must make a decision. <code>exactOptionalPropertyTypes</code> (9.3) makes the difference enforceable.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: functions on Code Lab</span><span class="lc-sub">Drill parameter typing after this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Gõ kiểu tham số: bắt buộc, optional, mặc định, rest</h2>
<p class="lead">Hàm là những ranh giới nơi giá trị đi vào code của bạn, nên — từ chương 1 — đó là chỗ bạn gần như luôn chú thích. TypeScript cho bạn bốn loại tham số, và nó kiểm mọi lời gọi theo chúng.</p>

<h3>Tham số bắt buộc và kiểu trả về suy luận</h3>
<p>Chú thích tham số; để kiểu trả về được suy ra từ thứ bạn thật sự trả về. TypeScript tính ra chính xác:</p>
<pre><code><span class="tok-comment">// retinfer.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">makeUser</span>(name: <span class="tok-keyword">string</span>) {
  <span class="tok-keyword">return</span> { name, createdAt: Date.<span class="tok-function">now</span>() };
}</code></pre>
<div class="out">declare function makeUser(name: string): {
    name: string;
    createdAt: number;
};</div>
<p>Bạn viết một chú thích (<code>name: string</code>); TypeScript suy ra toàn bộ dáng trả về. Chú thích kiểu trả về là tuỳ chọn — nhưng làm điều đó trên các hàm export/công khai là thói quen tốt: nó tài liệu hoá ý định và biến "tôi lỡ trả về sai dáng" thành một lỗi ngay tại hàm, không phải ở một chỗ gọi xa lắc.</p>

<h3>Tham số optional với ?</h3>
<p>Một dấu <code>?</code> sau tên khiến tham số thành optional — chỗ gọi có thể bỏ qua, và bên trong hàm kiểu của nó bao gồm <code>undefined</code>. TypeScript khi đó ép bạn xử lý trường hợp vắng mặt:</p>
<pre><code><span class="tok-comment">// opt.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">greet</span>(name: <span class="tok-keyword">string</span>, title?: <span class="tok-keyword">string</span>) {
  <span class="tok-keyword">return</span> title.<span class="tok-function">toUpperCase</span>() + <span class="tok-string">' '</span> + name;
}</code></pre>
<div class="out">opt.ts(2,10): error TS18048: 'title' is possibly 'undefined'.</div>
<p>Vì <code>title</code> có thể không được truyền, kiểu của nó là <code>string | undefined</code>, và gọi <code>.toUpperCase()</code> lên thứ có-thể-undefined bị chặn. Cách sửa là một phép kiểm: <code>if (title) ...</code> hoặc một giá trị mặc định. Tham số optional phải nằm <em>sau</em> tham số bắt buộc.</p>

<h3>Tham số mặc định</h3>
<p>Cho một tham số một giá trị mặc định thì hai điều xảy ra: chỗ gọi có thể bỏ qua, và bên trong hàm nó không bao giờ là <code>undefined</code> (mặc định điền vào). Để ý chữ ký suy ra tự động đánh dấu nó optional:</p>
<pre><code><span class="tok-comment">// deflt.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">paginate</span>(page: <span class="tok-keyword">number</span>, size = <span class="tok-number">20</span>) {
  <span class="tok-keyword">return</span> { page, size };
}</code></pre>
<div class="out">declare function paginate(page: number, size?: number): {
    page: number;
    size: number;
};</div>
<p>Bạn không chú thích <code>size</code> — TypeScript suy ra <code>number</code> từ mặc định <code>20</code>, và đánh dấu nó optional (<code>size?</code>) trong chữ ký. Bên trong thân hàm, <code>size</code> là một <code>number</code> thuần, không có undefined để canh. Cái này thường dễ chịu hơn tham số optional: chỗ gọi nhận một giá trị hợp lý thay vì <code>undefined</code>.</p>

<h3>Tham số rest</h3>
<p>Để nhận "bao nhiêu đối số cũng được", dùng một tham số rest — nó gom các phần thừa vào một mảng có kiểu:</p>
<pre><code><span class="tok-comment">// rest.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">sum</span>(...nums: <span class="tok-keyword">number</span>[]): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">return</span> nums.<span class="tok-function">reduce</span>((a, b) => a + b, <span class="tok-number">0</span>);
}
<span class="tok-function">sum</span>(<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-string">'x'</span>);</code></pre>
<div class="out">rest.ts(4,11): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.</div>
<p>Mọi đối số bị kiểm theo kiểu phần tử của rest. <code>sum(1, 2)</code>, <code>sum(1, 2, 3, 4)</code> — đều ổn; <code>sum(1, 2, 'x')</code> — chuỗi bị từ chối đúng ngay đối số đó.</p>
<div class="callout ok">Quy tắc bỏ túi từ chương 1, làm cho cụ thể: <strong>chú thích tham số, để kiểu trả về tự suy</strong> (chú thích cả kiểu trả về trên API công khai cho an toàn). Optional vs mặc định: ưu tiên mặc định khi có một giá trị hợp lý; dùng optional khi "vắng mặt" thật sự khác với bất kỳ giá trị nào.</div>
<div class="note-ct">Các endpoint danh sách của site này dùng đúng dáng <code>paginate(page, size = 20)</code> — một page bắt buộc, một cỡ trang mặc định hợp lý — nên một chỗ gọi bỏ qua cỡ sẽ nhận 20, không bao giờ có <code>undefined</code> trôi vào <code>LIMIT</code> của cơ sở dữ liệu.</div>
<h3>Tuỳ chọn, mặc định, rest — ba lời hứa khác nhau</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">name?: string</span><span class="lz-lnote">Được phép BỎ QUA; bên trong hàm kiểu của nó là <code>string | undefined</code> và bạn phải xử lý điều đó. Tham số tuỳ chọn phải đứng CUỐI.</span></div>
<div class="lz-layer"><span class="lz-lname">name = 'guest'</span><span class="lz-lnote">Được phép bỏ qua; bên trong hàm nó đơn giản là <code>string</code>, vì giá trị mặc định đã lấp vào. Thường là lựa chọn TỐT HƠN — nó bỏ đi một nhánh rẽ.</span></div>
<div class="lz-layer"><span class="lz-lname">...rest: number[]</span><span class="lz-lnote">Gom mọi thứ còn lại vào một mảng. Gõ kiểu như một mảng, và nó cũng phải đứng cuối.</span></div>
<div class="lz-layer"><span class="lz-lname">một đối tượng tuỳ chọn</span><span class="lz-lnote">Quá ba tham số thì hãy nhận MỘT đối tượng thay vì. Chỗ gọi tự nó thành tài liệu, và thêm một trường về sau thôi là một thay đổi phá vỡ.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — đọc <code>x?: number</code> và <code>x: number | undefined</code> thành cùng một thứ.</strong> Chúng KHÔNG giống nhau. Cái đầu được phép bỏ hẳn ra; cái sau BẮT BUỘC phải truyền, dù bạn truyền <code>undefined</code> một cách tường minh. Phân biệt ấy vô hình cho tới khi một cú tái cấu trúc bỏ đi một đối số mà trình biên dịch im lặng vì tham số ấy vốn tuỳ chọn — lời gọi giờ mang nghĩa KHÁC và không gì nói ra. Hãy dùng <code>?</code> khi việc bỏ qua là thật sự hợp lệ, và dùng union tường minh khi bên gọi BẮT BUỘC phải quyết định. <code>exactOptionalPropertyTypes</code> (9.3) làm cho khác biệt ấy thi hành được.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: hàm trên Code Lab</span><span class="lc-sub">Rèn gõ kiểu tham số sau chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Functions as values: function types & callbacks|||3.2 — Hàm như một giá trị: kiểu hàm & callback',
      slug: 'typescript-3-2-callback',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Kiểu biểu thức hàm (a: T) => R, gõ kiểu callback, và vì sao TypeScript bắt được một callback sai chữ ký.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Functions as values: function types &amp; callbacks</h2>
<p class="lead">In JavaScript, functions are values — you pass them around, store them, return them. TypeScript needs a way to describe "a function with this signature", and it has a compact one: the <strong>function type expression</strong>.</p>

<h3>The function type syntax</h3>
<p>It reads like an arrow function with types instead of a body: <code>(params) =&gt; ReturnType</code>.</p>
<pre><code><span class="tok-keyword">type</span> Formatter = (value: <span class="tok-keyword">number</span>) => <span class="tok-keyword">string</span>;

<span class="tok-keyword">const</span> money: Formatter = (v) => <span class="tok-string">'\$'</span> + v.<span class="tok-function">toFixed</span>(<span class="tok-number">2</span>);
<span class="tok-keyword">const</span> percent: Formatter = (v) => v + <span class="tok-string">'%'</span>;</code></pre>
<p>Both <code>money</code> and <code>percent</code> match "takes a number, returns a string". Note you didn't re-annotate <code>v</code> — TypeScript infers it's a <code>number</code> from the <code>Formatter</code> type. This "contextual typing" is why callbacks often need no annotations at all.</p>

<h3>Typing a callback parameter</h3>
<p>The common case: a function that takes another function. Describe the callback inline:</p>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">onClick</span>(handler: (x: <span class="tok-keyword">number</span>) => <span class="tok-keyword">void</span>) {
  handler(<span class="tok-number">42</span>);
}</code></pre>
<p>Now <code>onClick</code> only accepts a handler that takes a number. Pass one with the wrong parameter type and TypeScript explains precisely what's wrong:</p>
<pre><code><span class="tok-comment">// cb.ts</span>
<span class="tok-function">onClick</span>((x: <span class="tok-keyword">string</span>) => {});</code></pre>
<div class="out">cb.ts(2,9): error TS2345: Argument of type '(x: string) => void' is not assignable to parameter of type '(x: number) => void'.
  Types of parameters 'x' and 'x' are incompatible.
    Type 'number' is not assignable to type 'string'.</div>
<p>Read the indentation: the outer message says the whole function doesn't fit, then it drills in — "the <code>x</code> parameters are incompatible" — and gives the root cause. Learning to read these nested errors from the innermost line outward is a skill that pays off constantly.</p>

<h3>Where this shows up: the array methods</h3>
<p>Every <code>map</code>, <code>filter</code>, <code>forEach</code> takes a callback, and TypeScript types them for you. Hover the parameter and it already knows the element type:</p>
<pre><code><span class="tok-keyword">const</span> names = [<span class="tok-string">'An'</span>, <span class="tok-string">'Bình'</span>];
<span class="tok-keyword">const</span> upper = names.<span class="tok-function">map</span>((n) => n.<span class="tok-function">toUpperCase</span>());   <span class="tok-comment">// n is string, upper is string[]</span></code></pre>
<p>You never annotated <code>n</code> — the array's element type flowed into the callback automatically. This is contextual typing again, and it's most of why day-to-day TypeScript feels light.</p>
<div class="callout ok">A function type <code>(a: A) =&gt; B</code> is a value-level type just like <code>string</code> or <code>User</code>. You can name it with <code>type</code>, use it as a parameter, put it in an interface, store it in an array. Chapter 6 makes these generic so one type describes callbacks for <em>any</em> element type.</div>
<div class="note-ct">This site's request handlers are values of a function type from Express — <code>(req, res) =&gt; void</code>-ish — and typing them means a handler that forgets to send a response, or reads a field that isn't on the request, is caught before it ever runs. Chapter 11 types these end to end.</div>
<h3>Why a callback may take fewer arguments</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Fewer parameters is always safe</span><span class="lz-d"><code>arr.map(x =&gt; x * 2)</code> is legal even though <code>map</code> passes three arguments. Ignoring an argument cannot break anything, so TypeScript allows it.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">More parameters is not</span><span class="lz-d">A callback expecting four arguments where three are supplied would read <code>undefined</code>, so the compiler rejects it.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Return types are covariant</span><span class="lz-d">A callback may return a <em>more specific</em> type than promised. Returning less specific is rejected — the caller was promised more.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">void means "I ignore your return"</span><span class="lz-d">A <code>() =&gt; void</code> slot accepts a function returning anything. That is why <code>arr.forEach(x =&gt; set.add(x))</code> compiles despite <code>add</code> returning the set.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>['1','2','3'].map(parseInt)</code>.</strong> It returns <code>[1, NaN, NaN]</code>, and TypeScript does not stop you, because the types genuinely line up: <code>map</code> passes <code>(value, index)</code> and <code>parseInt(string, radix)</code> accepts two arguments, so index 1 becomes radix 1. The rule that makes point-free callbacks pleasant is the same rule that hides this bug. Pass the argument you mean explicitly — <code>.map(s =&gt; parseInt(s, 10))</code> — whenever the target function has optional parameters, which most standard-library functions do.</p></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Hàm như một giá trị: kiểu hàm &amp; callback</h2>
<p class="lead">Trong JavaScript, hàm là giá trị — bạn truyền chúng đi, lưu chúng, trả chúng về. TypeScript cần một cách để mô tả "một hàm có chữ ký như thế này", và nó có một cách gọn: <strong>biểu thức kiểu hàm</strong>.</p>

<h3>Cú pháp kiểu hàm</h3>
<p>Nó đọc như một arrow function với kiểu thay cho thân: <code>(tham-số) =&gt; KiểuTrảVề</code>.</p>
<pre><code><span class="tok-keyword">type</span> Formatter = (value: <span class="tok-keyword">number</span>) => <span class="tok-keyword">string</span>;

<span class="tok-keyword">const</span> money: Formatter = (v) => <span class="tok-string">'\$'</span> + v.<span class="tok-function">toFixed</span>(<span class="tok-number">2</span>);
<span class="tok-keyword">const</span> percent: Formatter = (v) => v + <span class="tok-string">'%'</span>;</code></pre>
<p>Cả <code>money</code> và <code>percent</code> đều khớp "nhận một số, trả về một chuỗi". Để ý bạn không chú thích lại <code>v</code> — TypeScript suy ra nó là <code>number</code> từ kiểu <code>Formatter</code>. "Gõ kiểu theo ngữ cảnh" này là lý do callback thường chẳng cần chú thích nào cả.</p>

<h3>Gõ kiểu một tham số callback</h3>
<p>Trường hợp thường gặp: một hàm nhận một hàm khác. Mô tả callback ngay tại chỗ:</p>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">onClick</span>(handler: (x: <span class="tok-keyword">number</span>) => <span class="tok-keyword">void</span>) {
  handler(<span class="tok-number">42</span>);
}</code></pre>
<p>Giờ <code>onClick</code> chỉ nhận một handler nhận một số. Truyền vào một cái sai kiểu tham số thì TypeScript giải thích chính xác chỗ sai:</p>
<pre><code><span class="tok-comment">// cb.ts</span>
<span class="tok-function">onClick</span>((x: <span class="tok-keyword">string</span>) => {});</code></pre>
<div class="out">cb.ts(2,9): error TS2345: Argument of type '(x: string) => void' is not assignable to parameter of type '(x: number) => void'.
  Types of parameters 'x' and 'x' are incompatible.
    Type 'number' is not assignable to type 'string'.</div>
<p>Đọc theo lề thụt: thông báo ngoài nói cả cái hàm không vừa, rồi nó khoan vào — "hai tham số <code>x</code> không tương thích" — và cho nguyên nhân gốc. Học đọc các lỗi lồng nhau này từ dòng trong cùng ra ngoài là một kỹ năng sinh lời liên tục.</p>

<h3>Nó xuất hiện ở đâu: các method của mảng</h3>
<p>Mọi <code>map</code>, <code>filter</code>, <code>forEach</code> đều nhận một callback, và TypeScript gõ kiểu chúng hộ bạn. Rê chuột lên tham số và nó đã biết sẵn kiểu phần tử:</p>
<pre><code><span class="tok-keyword">const</span> names = [<span class="tok-string">'An'</span>, <span class="tok-string">'Bình'</span>];
<span class="tok-keyword">const</span> upper = names.<span class="tok-function">map</span>((n) => n.<span class="tok-function">toUpperCase</span>());   <span class="tok-comment">// n là string, upper là string[]</span></code></pre>
<p>Bạn chẳng bao giờ chú thích <code>n</code> — kiểu phần tử của mảng tự trôi vào callback. Đây lại là gõ kiểu theo ngữ cảnh, và nó là phần lớn lý do TypeScript hằng ngày thấy nhẹ nhàng.</p>
<div class="callout ok">Một kiểu hàm <code>(a: A) =&gt; B</code> là một kiểu ở tầng giá trị y như <code>string</code> hay <code>User</code>. Bạn đặt tên nó bằng <code>type</code>, dùng làm tham số, đặt vào một interface, lưu vào một mảng. Chương 6 làm chúng generic để một kiểu mô tả callback cho <em>bất kỳ</em> kiểu phần tử nào.</div>
<div class="note-ct">Các handler request của site này là giá trị của một kiểu hàm từ Express — kiểu <code>(req, res) =&gt; void</code> — và gõ kiểu chúng nghĩa là một handler quên gửi phản hồi, hoặc đọc một field không có trên request, bị bắt trước khi nó kịp chạy. Chương 11 gõ kiểu những cái này từ đầu tới cuối.</div>
<h3>Vì sao một callback được phép nhận ÍT đối số hơn</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Ít tham số hơn thì LUÔN an toàn</span><span class="lz-d"><code>arr.map(x =&gt; x * 2)</code> hợp lệ dù <code>map</code> truyền vào ba đối số. Lờ đi một đối số thì không phá được gì, nên TypeScript cho phép.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nhiều tham số hơn thì KHÔNG</span><span class="lz-d">Một callback chờ bốn đối số mà chỉ được đưa ba sẽ đọc phải <code>undefined</code>, nên trình biên dịch từ chối.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kiểu TRẢ VỀ thì hiệp biến</span><span class="lz-d">Một callback được phép trả về kiểu CỤ THỂ HƠN mức đã hứa. Trả về kiểu kém cụ thể hơn thì bị từ chối — bên gọi đã được hứa nhiều hơn thế.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">void nghĩa là "tôi lờ giá trị trả về của bạn"</span><span class="lz-d">Một chỗ nhận <code>() =&gt; void</code> chấp nhận hàm trả về bất cứ thứ gì. Đó là lý do <code>arr.forEach(x =&gt; set.add(x))</code> biên dịch được dù <code>add</code> trả về chính cái set.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>['1','2','3'].map(parseInt)</code>.</strong> Nó trả về <code>[1, NaN, NaN]</code>, và TypeScript KHÔNG chặn bạn, vì các kiểu thật sự khớp nhau: <code>map</code> truyền <code>(value, index)</code> còn <code>parseInt(string, radix)</code> nhận hai đối số, nên index 1 trở thành cơ số 1. Chính cái luật làm cho callback dạng point-free trở nên dễ chịu cũng là cái luật giấu con bug này đi. Hãy truyền tường minh đúng đối số bạn muốn — <code>.map(s =&gt; parseInt(s, 10))</code> — bất cứ khi nào hàm đích có tham số tuỳ chọn, mà phần lớn hàm thư viện chuẩn thì có.</p></div>
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Overloads & the void-return subtlety|||3.3 — Overload & điều tinh tế của void',
      slug: 'typescript-3-3-overload-void',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Nhiều chữ ký cho một hàm (overload), và vì sao một callback kiểu () => void vẫn nhận một hàm trả về giá trị.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Overloads &amp; the void-return subtlety</h2>
<p class="lead">Two features here look advanced but explain real, everyday behaviour: how one function can have several typed shapes (overloads), and why a callback declared to return <code>void</code> happily accepts a function that returns something.</p>

<h3>Overloads: multiple signatures, one implementation</h3>
<p>Sometimes a function's return type depends on how it's called. You declare several <em>overload signatures</em>, then one implementation that covers them all:</p>
<pre><code><span class="tok-comment">// over.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">len</span>(x: <span class="tok-keyword">string</span>): <span class="tok-keyword">number</span>;
<span class="tok-keyword">function</span> <span class="tok-function">len</span>(x: <span class="tok-keyword">unknown</span>[]): <span class="tok-keyword">number</span>;
<span class="tok-keyword">function</span> <span class="tok-function">len</span>(x: <span class="tok-keyword">string</span> | <span class="tok-keyword">unknown</span>[]): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">return</span> x.length;
}
<span class="tok-function">len</span>(<span class="tok-number">42</span>);</code></pre>
<div class="out">over.ts(6,5): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type 'number' is not assignable to parameter of type 'unknown[]'.</div>
<p>The first two lines are the <em>public</em> signatures a caller sees; the third (the one with the body) is the implementation and is <strong>not</strong> visible to callers. <code>len('hi')</code> and <code>len([1,2,3])</code> work; <code>len(42)</code> matches no overload — <code>TS2769</code>.</p>
<div class="callout warn">Overloads are often overkill. Before reaching for them, ask whether a union parameter (<code>x: string | unknown[]</code>) or a generic (chapter 6) would be simpler. Overloads earn their place mainly when the return type genuinely <em>changes</em> based on the argument types in a way a union can't express.</div>

<h3>The void-return subtlety</h3>
<p>Here's a rule that surprises everyone, and it is deliberate. A callback typed to return <code>void</code> will accept a function that <em>does</em> return a value — the return is simply ignored:</p>
<pre><code><span class="tok-comment">// voidcb.ts</span>
<span class="tok-keyword">type</span> Cb = () => <span class="tok-keyword">void</span>;
<span class="tok-keyword">const</span> f: Cb = () => <span class="tok-number">42</span>;          <span class="tok-comment">// returns a number — still allowed</span>

<span class="tok-keyword">const</span> nums = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];
<span class="tok-keyword">const</span> dst: <span class="tok-keyword">number</span>[] = [];
nums.<span class="tok-function">forEach</span>(n => dst.<span class="tok-function">push</span>(n));  <span class="tok-comment">// push returns a number; forEach wants void — OK</span></code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Why allow it? Because <code>void</code> here means "I will not <em>use</em> your return value", not "you must return nothing". This is exactly what makes <code>arr.forEach(n =&gt; dst.push(n))</code> compile — <code>push</code> returns the new length, but <code>forEach</code>'s callback is <code>void</code>, so the number is harmlessly discarded. If <code>void</code> demanded a truly empty return, half of everyday callback code wouldn't type-check.</p>
<div class="pitfall">The flip side: don't <em>rely</em> on a <code>void</code> callback's return value — the type says it's ignored, so nothing guarantees anyone reads it. And when <em>you</em> define a callback type, choose <code>void</code> (not <code>undefined</code>) for "return ignored", so callers aren't forced to return nothing.</div>
<div class="note-ct">This distinction bites in real code when people write <code>array.forEach(async (x) =&gt; ...)</code> expecting it to await — the callback's returned promise is <code>void</code> to <code>forEach</code>, so it's dropped on the floor and nothing is awaited. Knowing <code>void</code> means "ignored" tells you instantly why. (Use a <code>for...of</code> loop with <code>await</code> instead.)</div>
<h3>Overloads, and the cheaper alternatives</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Overload signatures</span><span class="lz-lnote">Several public shapes over one implementation. The implementation signature is not callable — a detail that confuses everyone once.</span></div>
<div class="lz-layer"><span class="lz-lname">Union parameters first</span><span class="lz-lnote">If the return type does not depend on which argument you passed, a union parameter is simpler and does not need overloads at all.</span></div>
<div class="lz-layer"><span class="lz-lname">Generics next</span><span class="lz-lnote">When the return type is <em>derived</em> from the argument, a generic expresses that once instead of enumerating cases.</span></div>
<div class="lz-layer"><span class="lz-lname">Overloads last</span><span class="lz-lnote">Reach for them when the argument shapes are genuinely unrelated — <code>createElement('a')</code> vs <code>createElement('div')</code> returning different element types.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — overload signatures the implementation does not actually satisfy.</strong> TypeScript checks the implementation loosely against its overloads, so you can declare an overload returning <code>string</code> while the body can return <code>undefined</code> on one path, and it compiles. Callers then get a <code>string</code> the compiler vouched for and a crash at runtime, with the annotation pointing away from the cause. Keep the implementation signature as narrow as the union of the overloads allows, and write one test per overload — the type system is deliberately not checking this for you.</p></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Overload &amp; điều tinh tế của void</h2>
<p class="lead">Hai tính năng ở đây trông nâng cao nhưng giải thích hành vi thật, hằng ngày: làm sao một hàm có nhiều dáng có kiểu (overload), và vì sao một callback khai báo trả về <code>void</code> vẫn vui vẻ nhận một hàm có trả về gì đó.</p>

<h3>Overload: nhiều chữ ký, một phần cài đặt</h3>
<p>Đôi khi kiểu trả về của một hàm phụ thuộc vào cách nó được gọi. Bạn khai báo vài <em>chữ ký overload</em>, rồi một phần cài đặt bao trọn tất cả:</p>
<pre><code><span class="tok-comment">// over.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">len</span>(x: <span class="tok-keyword">string</span>): <span class="tok-keyword">number</span>;
<span class="tok-keyword">function</span> <span class="tok-function">len</span>(x: <span class="tok-keyword">unknown</span>[]): <span class="tok-keyword">number</span>;
<span class="tok-keyword">function</span> <span class="tok-function">len</span>(x: <span class="tok-keyword">string</span> | <span class="tok-keyword">unknown</span>[]): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">return</span> x.length;
}
<span class="tok-function">len</span>(<span class="tok-number">42</span>);</code></pre>
<div class="out">over.ts(6,5): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type 'number' is not assignable to parameter of type 'unknown[]'.</div>
<p>Hai dòng đầu là các chữ ký <em>công khai</em> mà chỗ gọi thấy; dòng thứ ba (cái có thân) là phần cài đặt và <strong>không</strong> hiện với chỗ gọi. <code>len('hi')</code> và <code>len([1,2,3])</code> chạy; <code>len(42)</code> không khớp overload nào — <code>TS2769</code>.</p>
<div class="callout warn">Overload thường là thừa. Trước khi với tay tới nó, hãy hỏi một tham số union (<code>x: string | unknown[]</code>) hay một generic (chương 6) có đơn giản hơn không. Overload xứng chỗ chủ yếu khi kiểu trả về thật sự <em>thay đổi</em> theo kiểu đối số theo cách mà một union không diễn đạt nổi.</div>

<h3>Điều tinh tế của void</h3>
<p>Đây là một quy tắc làm ai cũng bất ngờ, và nó là chủ ý. Một callback khai kiểu trả về <code>void</code> sẽ nhận một hàm <em>có</em> trả về giá trị — cái trả về đơn giản bị phớt lờ:</p>
<pre><code><span class="tok-comment">// voidcb.ts</span>
<span class="tok-keyword">type</span> Cb = () => <span class="tok-keyword">void</span>;
<span class="tok-keyword">const</span> f: Cb = () => <span class="tok-number">42</span>;          <span class="tok-comment">// trả về một số — vẫn được phép</span>

<span class="tok-keyword">const</span> nums = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];
<span class="tok-keyword">const</span> dst: <span class="tok-keyword">number</span>[] = [];
nums.<span class="tok-function">forEach</span>(n => dst.<span class="tok-function">push</span>(n));  <span class="tok-comment">// push trả về số; forEach cần void — OK</span></code></pre>
<div class="out">(không có output — mã thoát 0)</div>
<p>Vì sao cho phép? Vì <code>void</code> ở đây nghĩa là "tôi sẽ không <em>dùng</em> giá trị trả về của bạn", chứ không phải "bạn phải không trả về gì". Đây đúng là thứ khiến <code>arr.forEach(n =&gt; dst.push(n))</code> biên dịch được — <code>push</code> trả về độ dài mới, nhưng callback của <code>forEach</code> là <code>void</code>, nên con số bị bỏ đi vô hại. Nếu <code>void</code> đòi một cái trả về thật sự rỗng, một nửa code callback hằng ngày sẽ không qua kiểm kiểu.</p>
<div class="pitfall">Mặt trái: đừng <em>trông cậy</em> vào giá trị trả về của một callback <code>void</code> — kiểu nói nó bị phớt lờ, nên chẳng gì bảo đảm có ai đọc nó. Và khi <em>bạn</em> định nghĩa một kiểu callback, hãy chọn <code>void</code> (không phải <code>undefined</code>) cho ý "trả về bị bỏ qua", để chỗ gọi không bị ép phải trả về rỗng.</div>
<div class="note-ct">Sự phân biệt này cắn trong code thật khi người ta viết <code>array.forEach(async (x) =&gt; ...)</code> tưởng nó sẽ await — promise trả về của callback là <code>void</code> với <code>forEach</code>, nên nó bị rơi xuống sàn và chẳng có gì được await. Biết <code>void</code> nghĩa là "bị phớt lờ" cho bạn ngay lời giải thích. (Hãy dùng vòng <code>for...of</code> với <code>await</code> thay vào đó.)</div>
<h3>Overload, và những lựa chọn rẻ hơn</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Chữ ký overload</span><span class="lz-lnote">Nhiều hình dạng CÔNG KHAI trên một phần cài đặt. Chữ ký cài đặt thì KHÔNG gọi được — một chi tiết làm ai cũng bối rối đúng một lần.</span></div>
<div class="lz-layer"><span class="lz-lname">Tham số union trước đã</span><span class="lz-lnote">Nếu kiểu TRẢ VỀ không phụ thuộc vào việc bạn truyền đối số nào, thì một tham số union đơn giản hơn và chẳng cần overload nào cả.</span></div>
<div class="lz-layer"><span class="lz-lname">Rồi tới generic</span><span class="lz-lnote">Khi kiểu trả về được DẪN XUẤT từ đối số, một generic diễn đạt điều đó MỘT lần thay vì liệt kê từng trường hợp.</span></div>
<div class="lz-layer"><span class="lz-lname">Overload sau cùng</span><span class="lz-lnote">Chỉ với tay lấy nó khi các hình dạng đối số thật sự KHÔNG liên quan gì nhau — <code>createElement('a')</code> so với <code>createElement('div')</code> trả về hai kiểu phần tử khác nhau.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — chữ ký overload mà phần cài đặt thật ra KHÔNG thoả mãn.</strong> TypeScript kiểm phần cài đặt một cách LỎNG so với các overload của nó, nên bạn khai được một overload trả <code>string</code> trong khi thân hàm có một nhánh trả <code>undefined</code>, và nó vẫn biên dịch. Bên gọi khi ấy nhận một <code>string</code> được trình biên dịch bảo chứng và một cú sập lúc chạy, với cái chú thích chỉ đi HƯỚNG NGƯỢC LẠI với nguyên nhân. Hãy giữ chữ ký cài đặt HẸP hết mức mà hợp của các overload cho phép, và viết một bài test cho MỖI overload — hệ kiểu cố ý không kiểm giùm bạn chuyện này.</p></div>
</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — this: the parameter you did not know you had|||3.4 — this: tham số bạn không biết mình có',
      slug: 'typescript-3-4-this',
      type: 'LESSON',
      isFreePreview: true,
      description: 'noImplicitThis chặn this mập mờ, tham số this cho phép TypeScript kiểm ngữ cảnh gọi, và vì sao arrow function không có this riêng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>this: the parameter you didn't know you had</h2>
<p class="lead"><code>this</code> is the most confusing word in JavaScript because it isn't fixed by where a function is written — it's decided by <em>how the function is called</em>. TypeScript can't change that, but under strict mode it refuses to let <code>this</code> be silently <code>any</code>, and it gives you a way to type it.</p>

<h3>strict mode forbids an untyped this</h3>
<p>Use <code>this</code> in a standalone function and, because TypeScript can't know what it will be, strict mode stops you:</p>
<pre><code><span class="tok-comment">// this2.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">whoAmI</span>() {
  <span class="tok-keyword">return</span> this.name;
}</code></pre>
<div class="out">this2.ts(2,10): error TS2683: 'this' implicitly has type 'any' because it does not have a type annotation.</div>
<p>This is <code>noImplicitThis</code> (part of <code>strict</code>) doing its job: rather than let <code>this</code> be an unchecked <code>any</code> — the very thing chapter 1 warned about — it demands you say what <code>this</code> is meant to be.</p>

<h3>The this parameter</h3>
<p>TypeScript lets you declare <code>this</code> as a special <em>first parameter</em> that isn't a real argument — it only tells the compiler what context the function expects. Then callers who use the wrong context are caught:</p>
<pre><code><span class="tok-comment">// this3.ts</span>
<span class="tok-keyword">interface</span> Box { value: <span class="tok-keyword">number</span>; }

<span class="tok-keyword">function</span> <span class="tok-function">reset</span>(<span class="tok-keyword">this</span>: Box) {
  <span class="tok-keyword">this</span>.value = <span class="tok-number">0</span>;
}
<span class="tok-function">reset</span>();   <span class="tok-comment">// called with no object as this</span></code></pre>
<div class="out">this3.ts(5,1): error TS2684: The 'this' context of type 'void' is not assignable to method's 'this' of type 'Box'.</div>
<p>Calling <code>reset()</code> plainly gives it a <code>this</code> of <code>void</code> (no object), which doesn't match the required <code>Box</code>. It would have to be called as <code>someBox.reset()</code> or <code>reset.call(someBox)</code>. The <code>this</code> parameter is erased at compile time — it never appears in the emitted JavaScript.</p>

<h3>Arrow functions don't have their own this</h3>
<p>The reliable escape from <code>this</code> confusion: an arrow function captures <code>this</code> from where it was <em>written</em>, not where it's called. Inside a class, an arrow-function property always points at the instance, even when passed around as a callback:</p>
<pre><code><span class="tok-keyword">class</span> Counter {
  count = <span class="tok-number">0</span>;
  inc = () => { <span class="tok-keyword">this</span>.count++; };   <span class="tok-comment">// arrow: this is always this Counter</span>
}
<span class="tok-keyword">const</span> c = <span class="tok-keyword">new</span> <span class="tok-function">Counter</span>();
<span class="tok-keyword">const</span> go = c.inc;   <span class="tok-comment">// detached...</span>
<span class="tok-function">go</span>();               <span class="tok-comment">// ...but still increments c, because the arrow captured this</span></code></pre>
<p>Had <code>inc</code> been a normal method, <code>go()</code> would call it with the wrong <code>this</code> and crash at runtime. This is why React class components and event handlers so often used arrow-function properties — and why, in modern function-component code, you mostly sidestep <code>this</code> entirely.</p>
<div class="callout ok">Practical guidance: prefer plain functions and closures over <code>this</code> when you can (most app code). When you do use methods that get passed around as callbacks, make them arrow-function properties so <code>this</code> is captured. Reach for an explicit <code>this</code> parameter only when writing library-style code that's meant to be called in a specific context.</div>
<div class="note-ct">Most of this site's backend is plain functions and modules, not classes — so <code>this</code> rarely appears at all, which is itself a design choice: fewer <code>this</code>-binding footguns. The places it does use classes lean on arrow properties for anything handed to a callback.</div>
<h3>this in a typed world</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Arrow functions capture this</span><span class="lz-d">They take <code>this</code> from where they were written, not from how they were called. This is why class properties written as arrows survive being passed as callbacks.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">function expressions do not</span><span class="lz-d">Their <code>this</code> depends on the call site, so pulling a method off an object detaches it — the classic <code>const f = obj.method</code> bug.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Declare a this parameter</span><span class="lz-d"><code>function handler(this: HTMLElement, e: Event)</code> types <code>this</code> without adding a real argument — it is erased at compile time.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">noImplicitThis catches the rest</span><span class="lz-d">Part of <code>strict</code>. It turns the silent <code>any</code> that <code>this</code> becomes in a loose function into an error you can fix.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — passing a method as a callback and losing <code>this</code>.</strong> <code>setTimeout(user.greet, 100)</code> compiles cleanly and throws "cannot read properties of undefined" at runtime, because <code>greet</code> was called with no receiver. TypeScript can catch this — but only if the method declares a <code>this</code> parameter, which almost none do. The reliable fixes are to wrap it (<code>() =&gt; user.greet()</code>) or to define the method as an arrow-function property. Reach for <code>.bind(user)</code> only when neither is possible; it creates a new function every call, which matters inside a render loop.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: functions &amp; this on Code Lab</span><span class="lc-sub">Cement chapter 3 with the matching exercises.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>this: tham số bạn không biết mình có</h2>
<p class="lead"><code>this</code> là từ khó hiểu nhất trong JavaScript vì nó không bị cố định bởi nơi hàm được viết — nó do <em>cách hàm được gọi</em> quyết định. TypeScript không đổi được điều đó, nhưng dưới chế độ strict nó từ chối để <code>this</code> âm thầm thành <code>any</code>, và cho bạn một cách gõ kiểu nó.</p>

<h3>Chế độ strict cấm một this không kiểu</h3>
<p>Dùng <code>this</code> trong một hàm độc lập và, vì TypeScript không thể biết nó sẽ là gì, chế độ strict chặn bạn:</p>
<pre><code><span class="tok-comment">// this2.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">whoAmI</span>() {
  <span class="tok-keyword">return</span> this.name;
}</code></pre>
<div class="out">this2.ts(2,10): error TS2683: 'this' implicitly has type 'any' because it does not have a type annotation.</div>
<p>Đây là <code>noImplicitThis</code> (một phần của <code>strict</code>) làm việc của nó: thay vì để <code>this</code> thành một <code>any</code> không kiểm — chính thứ chương 1 cảnh báo — nó đòi bạn nói <code>this</code> phải là cái gì.</p>

<h3>Tham số this</h3>
<p>TypeScript cho bạn khai <code>this</code> như một <em>tham số đầu tiên</em> đặc biệt không phải đối số thật — nó chỉ nói với trình biên dịch hàm mong ngữ cảnh nào. Rồi chỗ gọi dùng sai ngữ cảnh sẽ bị bắt:</p>
<pre><code><span class="tok-comment">// this3.ts</span>
<span class="tok-keyword">interface</span> Box { value: <span class="tok-keyword">number</span>; }

<span class="tok-keyword">function</span> <span class="tok-function">reset</span>(<span class="tok-keyword">this</span>: Box) {
  <span class="tok-keyword">this</span>.value = <span class="tok-number">0</span>;
}
<span class="tok-function">reset</span>();   <span class="tok-comment">// gọi mà không có object nào làm this</span></code></pre>
<div class="out">this3.ts(5,1): error TS2684: The 'this' context of type 'void' is not assignable to method's 'this' of type 'Box'.</div>
<p>Gọi <code>reset()</code> trơ trọi cho nó một <code>this</code> kiểu <code>void</code> (không object), không khớp <code>Box</code> đòi hỏi. Nó phải được gọi kiểu <code>someBox.reset()</code> hoặc <code>reset.call(someBox)</code>. Tham số <code>this</code> bị xoá lúc biên dịch — nó không bao giờ xuất hiện trong JavaScript sinh ra.</p>

<h3>Arrow function không có this riêng</h3>
<p>Lối thoát đáng tin khỏi mớ bòng bong <code>this</code>: một arrow function bắt <code>this</code> từ nơi nó được <em>viết</em>, không phải nơi nó được gọi. Bên trong một class, một thuộc tính arrow-function luôn trỏ về instance, kể cả khi được truyền đi làm callback:</p>
<pre><code><span class="tok-keyword">class</span> Counter {
  count = <span class="tok-number">0</span>;
  inc = () => { <span class="tok-keyword">this</span>.count++; };   <span class="tok-comment">// arrow: this luôn là Counter này</span>
}
<span class="tok-keyword">const</span> c = <span class="tok-keyword">new</span> <span class="tok-function">Counter</span>();
<span class="tok-keyword">const</span> go = c.inc;   <span class="tok-comment">// tách rời...</span>
<span class="tok-function">go</span>();               <span class="tok-comment">// ...nhưng vẫn tăng c, vì arrow đã bắt this</span></code></pre>
<p>Nếu <code>inc</code> là một method thường, <code>go()</code> sẽ gọi nó với <code>this</code> sai và sập lúc chạy. Đây là lý do component class React và các event handler ngày xưa hay dùng thuộc tính arrow-function — và vì sao, trong code function-component hiện đại, bạn phần lớn né hẳn <code>this</code>.</p>
<div class="callout ok">Lời khuyên thực tế: ưu tiên hàm thuần và closure hơn <code>this</code> khi có thể (phần lớn code ứng dụng). Khi bạn có dùng method được truyền đi làm callback, hãy làm chúng thành thuộc tính arrow-function để <code>this</code> được bắt. Chỉ với tay tới tham số <code>this</code> tường minh khi viết code kiểu thư viện, vốn để được gọi trong một ngữ cảnh cụ thể.</div>
<div class="note-ct">Phần lớn backend site này là hàm thuần và module, không phải class — nên <code>this</code> hiếm khi xuất hiện, và đó tự nó là một lựa chọn thiết kế: ít cạm bẫy ràng buộc <code>this</code> hơn. Những chỗ có dùng class thì dựa vào thuộc tính arrow cho bất cứ gì trao cho một callback.</div>
<h3>this trong một thế giới đã gõ kiểu</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Hàm mũi tên BẮT lấy this</span><span class="lz-d">Chúng lấy <code>this</code> từ nơi chúng được VIẾT RA, không phải từ cách chúng được gọi. Đó là lý do các thuộc tính lớp viết dạng mũi tên sống sót khi bị truyền đi làm callback.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Biểu thức function thì KHÔNG</span><span class="lz-d"><code>this</code> của chúng phụ thuộc vào CHỖ GỌI, nên rút một phương thức ra khỏi đối tượng là tách rời nó — con bug kinh điển <code>const f = obj.method</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Khai một tham số this</span><span class="lz-d"><code>function handler(this: HTMLElement, e: Event)</code> gõ kiểu cho <code>this</code> mà không thêm một đối số thật nào — nó bị xoá lúc biên dịch.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">noImplicitThis bắt phần còn lại</span><span class="lz-d">Một phần của <code>strict</code>. Nó biến cái <code>any</code> im lặng mà <code>this</code> trở thành trong một hàm lỏng lẻo thành một LỖI bạn sửa được.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — truyền một phương thức đi làm callback rồi MẤT <code>this</code>.</strong> <code>setTimeout(user.greet, 100)</code> biên dịch sạch sẽ và ném "cannot read properties of undefined" lúc chạy, vì <code>greet</code> được gọi mà không có bên nhận. TypeScript BẮT được chuyện này — nhưng chỉ khi phương thức khai một tham số <code>this</code>, mà gần như không phương thức nào khai cả. Cách chữa đáng tin là bọc nó lại (<code>() =&gt; user.greet()</code>) hoặc định nghĩa phương thức thành một thuộc tính hàm mũi tên. Chỉ với tay lấy <code>.bind(user)</code> khi cả hai cách kia bất khả; nó tạo một hàm MỚI ở mỗi lần gọi, thứ có ý nghĩa khi nằm trong một vòng render.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: hàm &amp; this trên Code Lab</span><span class="lc-sub">Củng cố chương 3 bằng các bài tập tương ứng.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 3.5 quiz ─────────────────────────── */
    {
      title: '3.5 — Chapter 3 quiz|||3.5 — Kiểm tra Chương 3',
      slug: 'typescript-3-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về tham số optional/mặc định/rest, kiểu hàm & callback, overload, void, và this.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on typing functions. Answer from memory; the questions follow lesson order so a miss points straight at what to revisit.</p>
<div class="callout ok">Aim for 7/8. The void-return and this questions are the subtle ones — if they trip you, re-read 3.3 and 3.4.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về gõ kiểu hàm. Trả lời bằng trí nhớ; các câu xếp theo thứ tự bài nên câu sai chỉ thẳng chỗ cần xem lại.</p>
<div class="callout ok">Hãy nhắm 7/8. Câu về void và this là những câu tinh tế — nếu vấp, đọc lại 3.3 và 3.4.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Inside function greet(name: string, title?: string), what is the type of title?|||Bên trong function greet(name: string, title?: string), kiểu của title là gì?',
            options: [
              'string',
              'string | undefined — you must check before using it|||string | undefined — phải kiểm trước khi dùng',
              'any',
              'null',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'For function paginate(page: number, size = 20), the inferred signature makes size…|||Với function paginate(page: number, size = 20), chữ ký suy ra khiến size…',
            options: [
              'required and number|||bắt buộc và number',
              'optional (size?: number), and inside the body it is a plain number|||optional (size?: number), và trong thân là number thuần',
              'string',
              'never',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does the type (value: number) => string describe?|||Kiểu (value: number) => string mô tả gì?',
            options: [
              'An object with value and string keys|||Một object có khoá value và string',
              'A function taking a number and returning a string|||Một hàm nhận một số và trả về một chuỗi',
              'A tuple of number and string|||Một tuple gồm number và string',
              'A generic type|||Một kiểu generic',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'onClick(handler: (x: number) => void); calling onClick((x: string) => {}) does what?|||onClick(handler: (x: number) => void); gọi onClick((x: string) => {}) ra sao?',
            options: [
              'Compiles fine|||Biên dịch bình thường',
              'Errors TS2345 — the parameter types are incompatible|||Lỗi TS2345 — kiểu tham số không tương thích',
              'Errors only at runtime|||Chỉ lỗi lúc chạy',
              'Coerces string to number|||Ép string thành number',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In an overloaded function, which signature can callers actually call?|||Trong một hàm overload, chỗ gọi thật sự gọi được chữ ký nào?',
            options: [
              'Only the implementation signature (the one with the body)|||Chỉ chữ ký cài đặt (cái có thân)',
              'Only the overload signatures listed above the implementation|||Chỉ các chữ ký overload liệt kê phía trên phần cài đặt',
              'All of them equally|||Tất cả như nhau',
              'None — overloads are documentation only|||Không cái nào — overload chỉ để tài liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'const f: () => void = () => 42; — what happens?|||const f: () => void = () => 42; — điều gì xảy ra?',
            options: [
              'Error: void functions cannot return a value|||Lỗi: hàm void không được trả về giá trị',
              'Allowed — void means the return value is ignored|||Được phép — void nghĩa là giá trị trả về bị phớt lờ',
              'f becomes number|||f trở thành number',
              'Runtime crash|||Sập lúc chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does array.forEach(async x => ...) usually NOT await anything?|||Vì sao array.forEach(async x => ...) thường KHÔNG await gì cả?',
            options: [
              "forEach is synchronous and treats the callback's returned promise as void (ignored)|||forEach đồng bộ và coi promise trả về của callback là void (bị bỏ)",
              'async is not allowed in forEach|||async không được phép trong forEach',
              'forEach reverses the array first|||forEach đảo mảng trước',
              'It awaits but silently|||Nó có await nhưng âm thầm',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Under strict mode, a standalone function using this without annotation gives?|||Dưới chế độ strict, một hàm độc lập dùng this mà không chú thích cho ra?',
            options: [
              "TS2683: 'this' implicitly has type 'any'|||TS2683: 'this' implicitly has type 'any'",
              'No error|||Không lỗi',
              'A runtime TypeError|||Một TypeError lúc chạy',
              'this becomes the global object silently|||this âm thầm thành object toàn cục',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
