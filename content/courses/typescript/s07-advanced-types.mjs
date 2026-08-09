/**
 * TypeScript — Chương 7: Kiểu nâng cao (mapped, conditional, template literal).
 * Mọi output tsc là THẬT (tsc --strict, verified). Song ngữ .ml-en/.ml-vi.
 * < > → &lt; &gt;;  & → &amp;;  backtick → &#96;;  ${ → \${  (tránh nội suy JS).
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 7 — Advanced types|||Chương 7 — Kiểu nâng cao',
  description: 'Kiểu tính ra từ kiểu khác: mapped types (biến đổi mọi field), modifiers (?/readonly), conditional types với infer, và template literal types — cỗ máy đằng sau mọi thư viện gõ kiểu tinh vi.',
  lessons: [
    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — Mapped types|||7.1 — Mapped types (kiểu ánh xạ)',
      slug: 'typescript-7-1-mapped-types',
      type: 'LESSON',
      isFreePreview: true,
      description: '{ [K in keyof T]: … } đi qua từng key của một kiểu và dựng lại nó — cách bạn tự viết Readonly<T> và Partial<T> từ số 0.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Mapped types</h2>
<p class="lead">A mapped type walks over every key of an existing type and builds a new type from it — a <code>for…of</code> loop, but at the type level. It's how one line turns <code>User</code> into "User but all fields optional", or "User but all fields readonly", without writing them out by hand.</p>

<h3>The shape</h3>
<p>The syntax is <code>{ [K in keyof T]: … }</code>. Read it as "for each key <code>K</code> in the keys of <code>T</code>, produce a property". Here it copies a type unchanged — the identity mapping — which is the skeleton everything else builds on:</p>
<pre><code><span class="tok-keyword">type</span> Identity&lt;T&gt; = { [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> T]: T[K] };</code></pre>
<p><code>keyof T</code> gives the union of key names (chapter 6); <code>K in …</code> iterates it; <code>T[K]</code> is the value type at that key. Change what's on the right of the colon and you have a transformation.</p>

<h3>Make everything readonly</h3>
<p>Add the <code>readonly</code> modifier in front and every key comes out read-only:</p>
<pre><code><span class="tok-comment">// map-basic.ts</span>
<span class="tok-keyword">type</span> Flags = { darkMode: <span class="tok-keyword">boolean</span>; sidebar: <span class="tok-keyword">boolean</span> };
<span class="tok-keyword">type</span> ReadonlyFlags = { <span class="tok-keyword">readonly</span> [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> Flags]: Flags[K] };
<span class="tok-keyword">const</span> f: ReadonlyFlags = { darkMode: <span class="tok-keyword">true</span>, sidebar: <span class="tok-keyword">false</span> };
f.darkMode = <span class="tok-keyword">false</span>;   <span class="tok-comment">// readonly — can't reassign</span></code></pre>
<div class="out">map-basic.ts(5,3): error TS2540: Cannot assign to 'darkMode' because it is a read-only property.</div>
<p>You wrote the mapping once and both fields became read-only. This is <em>exactly</em> how the built-in <code>Readonly&lt;T&gt;</code> is defined — no magic, just a mapped type.</p>

<h3>Make everything optional — rebuild Partial</h3>
<p>Add a <code>?</code> after the key and every property becomes optional. That single line is the entire definition of <code>Partial&lt;T&gt;</code>:</p>
<pre><code><span class="tok-comment">// my-partial.ts</span>
<span class="tok-keyword">type</span> MyPartial&lt;T&gt; = { [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> T]?: T[K] };
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> patch: MyPartial&lt;User&gt; = { name: <span class="tok-string">'Ada'</span> };   <span class="tok-comment">// ok — id now optional</span>
<span class="tok-keyword">const</span> bad: MyPartial&lt;User&gt; = { name: <span class="tok-number">123</span> };        <span class="tok-comment">// still type-checked</span></code></pre>
<div class="out">my-partial.ts(5,32): error TS2322: Type 'number' is not assignable to type 'string'.</div>
<p>Two things worth noticing. <code>patch</code> omits <code>id</code> and is fine — every field is optional now. But <code>bad</code> still fails: making fields optional does <em>not</em> make them untyped. <code>name</code> is still <code>string</code>, so <code>123</code> is rejected. Optional means "may be absent", never "may be wrong".</p>

<div class="callout ok">A mapped type is a type-level loop over keys. <code>{ [K in keyof T]: T[K] }</code> is the copy; put a modifier in front (<code>readonly</code>) or after the key (<code>?</code>), or change <code>T[K]</code> on the right, and you've transformed the whole shape in one line.</div>
<div class="note-ct">You don't often hand-write these — you use the built-ins from chapter 8 — but knowing they're <em>just mapped types</em> is what lets you read Prisma's generated types and libraries like Zod. Every <code>Partial</code>, <code>Readonly</code>, <code>Record</code> you'll use is one of these under the hood, and when a library type surprises you, this is the syntax you'll be decoding.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: mapped types on Code Lab</span><span class="lc-sub">Rebuild Readonly and Partial from scratch.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Mapped types (kiểu ánh xạ)</h2>
<p class="lead">Một mapped type đi qua từng key của một kiểu có sẵn và dựng một kiểu mới từ đó — một vòng <code>for…of</code>, nhưng ở tầng kiểu. Đó là cách một dòng biến <code>User</code> thành "User nhưng mọi field là tuỳ chọn", hay "User nhưng mọi field readonly", mà không phải viết tay từng cái.</p>

<h3>Hình dạng</h3>
<p>Cú pháp là <code>{ [K in keyof T]: … }</code>. Đọc là "với mỗi key <code>K</code> trong các key của <code>T</code>, sinh ra một thuộc tính". Ở đây nó chép một kiểu nguyên vẹn — phép ánh xạ đồng nhất — bộ khung mà mọi thứ khác dựng lên trên:</p>
<pre><code><span class="tok-keyword">type</span> Identity&lt;T&gt; = { [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> T]: T[K] };</code></pre>
<p><code>keyof T</code> cho union các tên key (chương 6); <code>K in …</code> lặp qua nó; <code>T[K]</code> là kiểu giá trị tại key đó. Đổi thứ nằm bên phải dấu hai chấm là bạn có một phép biến đổi.</p>

<h3>Cho mọi thứ thành readonly</h3>
<p>Thêm modifier <code>readonly</code> ở phía trước và mọi key ra đời ở dạng chỉ-đọc:</p>
<pre><code><span class="tok-comment">// map-basic.ts</span>
<span class="tok-keyword">type</span> Flags = { darkMode: <span class="tok-keyword">boolean</span>; sidebar: <span class="tok-keyword">boolean</span> };
<span class="tok-keyword">type</span> ReadonlyFlags = { <span class="tok-keyword">readonly</span> [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> Flags]: Flags[K] };
<span class="tok-keyword">const</span> f: ReadonlyFlags = { darkMode: <span class="tok-keyword">true</span>, sidebar: <span class="tok-keyword">false</span> };
f.darkMode = <span class="tok-keyword">false</span>;   <span class="tok-comment">// readonly — không gán lại được</span></code></pre>
<div class="out">map-basic.ts(5,3): error TS2540: Cannot assign to 'darkMode' because it is a read-only property.</div>
<p>Bạn viết phép ánh xạ một lần và cả hai field thành chỉ-đọc. Đây <em>đúng</em> là cách <code>Readonly&lt;T&gt;</code> có sẵn được định nghĩa — không phép màu, chỉ là một mapped type.</p>

<h3>Cho mọi thứ thành tuỳ chọn — dựng lại Partial</h3>
<p>Thêm một <code>?</code> sau key và mọi thuộc tính thành tuỳ chọn. Dòng duy nhất đó là toàn bộ định nghĩa của <code>Partial&lt;T&gt;</code>:</p>
<pre><code><span class="tok-comment">// my-partial.ts</span>
<span class="tok-keyword">type</span> MyPartial&lt;T&gt; = { [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> T]?: T[K] };
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> patch: MyPartial&lt;User&gt; = { name: <span class="tok-string">'Ada'</span> };   <span class="tok-comment">// ok — id giờ tuỳ chọn</span>
<span class="tok-keyword">const</span> bad: MyPartial&lt;User&gt; = { name: <span class="tok-number">123</span> };        <span class="tok-comment">// vẫn bị kiểm kiểu</span></code></pre>
<div class="out">my-partial.ts(5,32): error TS2322: Type 'number' is not assignable to type 'string'.</div>
<p>Hai điều đáng để ý. <code>patch</code> bỏ <code>id</code> và vẫn ổn — giờ mọi field tuỳ chọn. Nhưng <code>bad</code> vẫn hỏng: làm field thành tuỳ chọn <em>không</em> làm nó mất kiểu. <code>name</code> vẫn là <code>string</code>, nên <code>123</code> bị từ chối. Tuỳ chọn nghĩa là "có thể vắng mặt", không bao giờ là "có thể sai".</p>

<div class="callout ok">Một mapped type là một vòng lặp qua các key ở tầng kiểu. <code>{ [K in keyof T]: T[K] }</code> là bản chép; đặt một modifier phía trước (<code>readonly</code>) hoặc sau key (<code>?</code>), hoặc đổi <code>T[K]</code> bên phải, là bạn đã biến đổi cả hình dạng trong một dòng.</div>
<div class="note-ct">Bạn ít khi tự viết những cái này — bạn dùng bản có sẵn ở chương 8 — nhưng biết chúng <em>chỉ là mapped type</em> mới giúp bạn đọc được các kiểu Prisma sinh ra và thư viện như Zod. Mọi <code>Partial</code>, <code>Readonly</code>, <code>Record</code> bạn dùng đều là một trong số này bên dưới, và khi một kiểu thư viện làm bạn ngạc nhiên, đây là cú pháp bạn sẽ giải mã.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: mapped types trên Code Lab</span><span class="lc-sub">Dựng lại Readonly và Partial từ số 0.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — Mapping modifiers: add & remove ? and readonly|||7.2 — Modifier ánh xạ: thêm & gỡ ? và readonly',
      slug: 'typescript-7-2-mapping-modifiers',
      type: 'LESSON',
      description: 'Mapped type không chỉ thêm ?/readonly — nó còn GỠ chúng với -? và -readonly. Đó là cách viết Mutable<T> và Required<T>.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Mapping modifiers: add &amp; remove</h2>
<p class="lead">Adding <code>?</code> and <code>readonly</code> is only half the story. A mapped type can also <em>strip</em> them, with <code>-?</code> and <code>-readonly</code>. That's how you turn a locked-down type back into a mutable or fully-required one.</p>

<h3>Remove readonly with <code>-readonly</code></h3>
<p>Prefix the modifier with a minus to subtract it. <code>Mutable&lt;T&gt;</code> takes a type whose fields are read-only and gives back one you can assign to:</p>
<pre><code><span class="tok-comment">// mutable.ts</span>
<span class="tok-keyword">interface</span> Config { <span class="tok-keyword">readonly</span> host: <span class="tok-keyword">string</span>; <span class="tok-keyword">readonly</span> port: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">type</span> Mutable&lt;T&gt; = { -<span class="tok-keyword">readonly</span> [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> T]: T[K] };
<span class="tok-keyword">const</span> c: Mutable&lt;Config&gt; = { host: <span class="tok-string">'localhost'</span>, port: <span class="tok-number">5432</span> };
c.port = <span class="tok-number">5433</span>;   <span class="tok-comment">// Mutable stripped readonly — allowed</span>
<span class="tok-keyword">const</span> orig: Config = { host: <span class="tok-string">'x'</span>, port: <span class="tok-number">1</span> };
orig.port = <span class="tok-number">2</span>;   <span class="tok-comment">// original is still readonly</span></code></pre>
<div class="out">mutable.ts(7,6): error TS2540: Cannot assign to 'port' because it is a read-only property.</div>
<p>The contrast is the whole point: <code>c.port = 5433</code> compiles because <code>Mutable&lt;Config&gt;</code> removed <code>readonly</code>; <code>orig.port = 2</code> fails because the original <code>Config</code> still has it. One mapped type, and you have a writable twin of any readonly type.</p>

<h3>Remove optional with <code>-?</code></h3>
<p>Symmetrically, <code>-?</code> makes every optional field required. That's the built-in <code>Required&lt;T&gt;</code>:</p>
<pre><code><span class="tok-comment">// required.ts</span>
<span class="tok-keyword">interface</span> Draft { title?: <span class="tok-keyword">string</span>; body?: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">type</span> Complete&lt;T&gt; = { [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> T]-?: T[K] };
<span class="tok-keyword">const</span> d: Complete&lt;Draft&gt; = { title: <span class="tok-string">'Hi'</span> };   <span class="tok-comment">// body is now required</span></code></pre>
<div class="out">required.ts(4,7): error TS2741: Property 'body' is missing in type '{ title: string; }' but required in type 'Complete&lt;Draft&gt;'.</div>
<p><code>Draft</code> had both fields optional; <code>Complete&lt;Draft&gt;</code> made both mandatory, so leaving out <code>body</code> is now an error. This pairs with <code>Partial</code> from the last lesson: one adds <code>?</code>, the other removes it, and together they let a type flip between "draft" and "complete" states.</p>

<h3>Why removal matters</h3>
<p>Adding modifiers is common; removing them is the trick people forget exists. It shows up whenever a type arrives more locked-down than you need — a <code>readonly</code> config you must build up mutably before freezing, an all-optional API input you want to assert is complete after validation. The <code>-</code> prefix is the escape hatch.</p>

<div class="callout ok">Four moves on a mapped type: <code>readonly</code> / <code>?</code> add, <code>-readonly</code> / <code>-?</code> remove. Plain <code>readonly</code> and <code>?</code> with no sign always <em>add</em>; only the minus subtracts. That's the full grammar of the built-in <code>Partial</code>, <code>Required</code>, <code>Readonly</code>.</div>
<div class="note-ct">On this site the update endpoints take a <code>Partial&lt;Dto&gt;</code> (patch only the fields you send), while a validated payload is asserted back to <code>Required</code> once every field is confirmed present. The add/remove pair is what lets one base type serve both the lenient input shape and the strict internal shape.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: mapping modifiers on Code Lab</span><span class="lc-sub">Write Mutable and Required with the minus modifiers.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Modifier ánh xạ: thêm &amp; gỡ</h2>
<p class="lead">Thêm <code>?</code> và <code>readonly</code> mới là một nửa câu chuyện. Một mapped type còn có thể <em>gỡ bỏ</em> chúng, bằng <code>-?</code> và <code>-readonly</code>. Đó là cách biến một kiểu bị khoá chặt trở lại thành kiểu có thể ghi hoặc bắt buộc đầy đủ.</p>

<h3>Gỡ readonly bằng <code>-readonly</code></h3>
<p>Thêm dấu trừ trước modifier để trừ nó đi. <code>Mutable&lt;T&gt;</code> nhận một kiểu có các field chỉ-đọc và trả lại một kiểu bạn gán được:</p>
<pre><code><span class="tok-comment">// mutable.ts</span>
<span class="tok-keyword">interface</span> Config { <span class="tok-keyword">readonly</span> host: <span class="tok-keyword">string</span>; <span class="tok-keyword">readonly</span> port: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">type</span> Mutable&lt;T&gt; = { -<span class="tok-keyword">readonly</span> [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> T]: T[K] };
<span class="tok-keyword">const</span> c: Mutable&lt;Config&gt; = { host: <span class="tok-string">'localhost'</span>, port: <span class="tok-number">5432</span> };
c.port = <span class="tok-number">5433</span>;   <span class="tok-comment">// Mutable đã gỡ readonly — được phép</span>
<span class="tok-keyword">const</span> orig: Config = { host: <span class="tok-string">'x'</span>, port: <span class="tok-number">1</span> };
orig.port = <span class="tok-number">2</span>;   <span class="tok-comment">// bản gốc vẫn readonly</span></code></pre>
<div class="out">mutable.ts(7,6): error TS2540: Cannot assign to 'port' because it is a read-only property.</div>
<p>Sự tương phản chính là điểm mấu chốt: <code>c.port = 5433</code> biên dịch được vì <code>Mutable&lt;Config&gt;</code> đã gỡ <code>readonly</code>; <code>orig.port = 2</code> hỏng vì <code>Config</code> gốc vẫn còn nó. Một mapped type, và bạn có một bản sinh đôi ghi-được của bất cứ kiểu readonly nào.</p>

<h3>Gỡ tuỳ chọn bằng <code>-?</code></h3>
<p>Đối xứng, <code>-?</code> làm mọi field tuỳ chọn thành bắt buộc. Đó là <code>Required&lt;T&gt;</code> có sẵn:</p>
<pre><code><span class="tok-comment">// required.ts</span>
<span class="tok-keyword">interface</span> Draft { title?: <span class="tok-keyword">string</span>; body?: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">type</span> Complete&lt;T&gt; = { [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> T]-?: T[K] };
<span class="tok-keyword">const</span> d: Complete&lt;Draft&gt; = { title: <span class="tok-string">'Hi'</span> };   <span class="tok-comment">// body giờ bắt buộc</span></code></pre>
<div class="out">required.ts(4,7): error TS2741: Property 'body' is missing in type '{ title: string; }' but required in type 'Complete&lt;Draft&gt;'.</div>
<p><code>Draft</code> có cả hai field tuỳ chọn; <code>Complete&lt;Draft&gt;</code> làm cả hai bắt buộc, nên thiếu <code>body</code> giờ là lỗi. Cái này cặp với <code>Partial</code> ở bài trước: một cái thêm <code>?</code>, cái kia gỡ nó, và cùng nhau chúng cho một kiểu lật qua lại giữa trạng thái "nháp" và "hoàn chỉnh".</p>

<h3>Vì sao gỡ bỏ lại quan trọng</h3>
<p>Thêm modifier thì phổ biến; gỡ chúng là mẹo người ta quên là có tồn tại. Nó xuất hiện mỗi khi một kiểu đến tay bạn bị khoá chặt hơn mức cần — một config <code>readonly</code> bạn phải dựng dần theo kiểu ghi-được trước khi đóng băng, một input API toàn tuỳ chọn mà bạn muốn khẳng định là đã đủ sau khi validate. Tiền tố <code>-</code> là cửa thoát.</p>

<div class="callout ok">Bốn nước đi trên một mapped type: <code>readonly</code> / <code>?</code> thêm, <code>-readonly</code> / <code>-?</code> gỡ. <code>readonly</code> và <code>?</code> trần không dấu luôn <em>thêm</em>; chỉ dấu trừ mới trừ đi. Đó là toàn bộ ngữ pháp của <code>Partial</code>, <code>Required</code>, <code>Readonly</code> có sẵn.</div>
<div class="note-ct">Trên site này các endpoint cập nhật nhận một <code>Partial&lt;Dto&gt;</code> (chỉ vá những field bạn gửi), còn một payload đã validate được khẳng định trở lại thành <code>Required</code> một khi mọi field xác nhận có mặt. Cặp thêm/gỡ là thứ cho một kiểu nền phục vụ cả hình dạng input dễ dãi lẫn hình dạng nội bộ nghiêm ngặt.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: modifier ánh xạ trên Code Lab</span><span class="lc-sub">Viết Mutable và Required với modifier dấu trừ.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — Conditional types & infer|||7.3 — Conditional types & infer',
      slug: 'typescript-7-3-conditional-infer',
      type: 'LESSON',
      description: 'T extends U ? X : Y là một if…else ở tầng kiểu; infer bắt lấy một kiểu bên trong — cách bạn tự dựng ReturnType<T>.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Conditional types &amp; infer</h2>
<p class="lead">A conditional type is an <code>if…else</code> at the type level: <code>T extends U ? X : Y</code>. Pair it with <code>infer</code> — which grabs a type from <em>inside</em> another type — and you can pull the element out of an array, or the return value out of a function signature.</p>

<h3>The ternary, for types</h3>
<p><code>T extends U ? X : Y</code> reads "if <code>T</code> is assignable to <code>U</code>, the result is <code>X</code>, otherwise <code>Y</code>". It's the same shape as a value ternary, resolved by the compiler:</p>
<pre><code><span class="tok-comment">// cond.ts</span>
<span class="tok-keyword">type</span> IsString&lt;T&gt; = T <span class="tok-keyword">extends</span> <span class="tok-keyword">string</span> ? <span class="tok-string">'yes'</span> : <span class="tok-string">'no'</span>;
<span class="tok-keyword">type</span> X = IsString&lt;<span class="tok-keyword">string</span>&gt;;   <span class="tok-comment">// 'yes'</span>
<span class="tok-keyword">const</span> x: IsString&lt;<span class="tok-keyword">number</span>&gt; = <span class="tok-string">'yes'</span>;   <span class="tok-comment">// IsString&lt;number&gt; is 'no'</span></code></pre>
<div class="out">cond.ts(4,7): error TS2322: Type '"yes"' is not assignable to type '"no"'.</div>
<p><code>IsString&lt;string&gt;</code> resolves to the literal type <code>'yes'</code>; <code>IsString&lt;number&gt;</code> resolves to <code>'no'</code>, so assigning <code>'yes'</code> to it is a real error. The condition was <em>computed</em> — you didn't pick the branch, the compiler did, from the type you passed.</p>

<h3><code>infer</code>: capture a type from inside</h3>
<p><code>infer R</code> introduces a fresh type variable inside the <code>extends</code> clause and binds it to whatever fills that slot. "If <code>T</code> is an array of something, call that something <code>U</code> and return it":</p>
<pre><code><span class="tok-comment">// infer.ts</span>
<span class="tok-keyword">type</span> ElementType&lt;T&gt; = T <span class="tok-keyword">extends</span> (<span class="tok-keyword">infer</span> U)[] ? U : T;
<span class="tok-keyword">type</span> A = ElementType&lt;<span class="tok-keyword">string</span>[]&gt;;   <span class="tok-comment">// string</span>
<span class="tok-keyword">type</span> B = ElementType&lt;<span class="tok-keyword">number</span>&gt;;     <span class="tok-comment">// number (not an array — falls through)</span></code></pre>
<p><code>ElementType&lt;string[]&gt;</code> matches the array pattern, so <code>U</code> binds to <code>string</code> and that's the result. <code>ElementType&lt;number&gt;</code> isn't an array, so it takes the else branch and returns <code>number</code> unchanged.</p>

<h3>Rebuild ReturnType with infer</h3>
<p>The classic. Match a function signature and infer its return type — this is exactly how the built-in <code>ReturnType&lt;T&gt;</code> works:</p>
<pre><code><span class="tok-keyword">type</span> MyReturnType&lt;T&gt; = T <span class="tok-keyword">extends</span> (...args: <span class="tok-keyword">any</span>[]) =&gt; <span class="tok-keyword">infer</span> R ? R : <span class="tok-keyword">never</span>;
<span class="tok-keyword">function</span> <span class="tok-function">makeUser</span>() { <span class="tok-keyword">return</span> { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span> }; }
<span class="tok-keyword">type</span> U = MyReturnType&lt;<span class="tok-keyword">typeof</span> makeUser&gt;;   <span class="tok-comment">// { id: number; name: string }</span>
<span class="tok-keyword">const</span> u: U = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'x'</span> };
u.id.<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// id is number</span></code></pre>
<div class="out">infer.ts(9,6): error TS2339: Property 'toUpperCase' does not exist on type 'number'.</div>
<p><code>MyReturnType&lt;typeof makeUser&gt;</code> extracted <code>{ id: number; name: string }</code> without you ever writing that shape — it was inferred from the function's body. So <code>u.id</code> is <code>number</code>, and the string method is caught. This is the deep reason utility types feel like magic: they're conditional types with <code>infer</code> reaching into your existing declarations.</p>

<div class="callout ok"><code>T extends U ? X : Y</code> chooses a type by a condition; <code>infer R</code> captures a piece of the matched type to reuse in the result. Together they let a type be <em>computed</em> from another type — the foundation of <code>ReturnType</code>, <code>Parameters</code>, <code>Awaited</code>, and most of chapter 8.</div>
<div class="note-ct">When you write <code>type Result = Awaited&lt;ReturnType&lt;typeof fetchUser&gt;&gt;</code> to get the resolved value of an async function, both of those are conditional-plus-infer types unwrapping your code. You rarely author them, but reading them turns "why is this type <code>never</code>?" from a mystery into a two-line trace.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: conditional types on Code Lab</span><span class="lc-sub">Build ElementType and ReturnType with infer.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Conditional types &amp; infer</h2>
<p class="lead">Một conditional type là một <code>if…else</code> ở tầng kiểu: <code>T extends U ? X : Y</code>. Ghép nó với <code>infer</code> — thứ tóm một kiểu từ <em>bên trong</em> một kiểu khác — và bạn có thể rút phần tử ra khỏi một mảng, hay giá trị trả về ra khỏi một chữ ký hàm.</p>

<h3>Toán tử ba ngôi, cho kiểu</h3>
<p><code>T extends U ? X : Y</code> đọc là "nếu <code>T</code> gán được cho <code>U</code>, kết quả là <code>X</code>, ngược lại <code>Y</code>". Cùng hình dạng với ternary giá trị, được trình biên dịch giải:</p>
<pre><code><span class="tok-comment">// cond.ts</span>
<span class="tok-keyword">type</span> IsString&lt;T&gt; = T <span class="tok-keyword">extends</span> <span class="tok-keyword">string</span> ? <span class="tok-string">'yes'</span> : <span class="tok-string">'no'</span>;
<span class="tok-keyword">type</span> X = IsString&lt;<span class="tok-keyword">string</span>&gt;;   <span class="tok-comment">// 'yes'</span>
<span class="tok-keyword">const</span> x: IsString&lt;<span class="tok-keyword">number</span>&gt; = <span class="tok-string">'yes'</span>;   <span class="tok-comment">// IsString&lt;number&gt; là 'no'</span></code></pre>
<div class="out">cond.ts(4,7): error TS2322: Type '"yes"' is not assignable to type '"no"'.</div>
<p><code>IsString&lt;string&gt;</code> giải ra kiểu literal <code>'yes'</code>; <code>IsString&lt;number&gt;</code> giải ra <code>'no'</code>, nên gán <code>'yes'</code> cho nó là một lỗi thật. Điều kiện đã được <em>tính ra</em> — bạn không chọn nhánh, trình biên dịch chọn, từ kiểu bạn truyền vào.</p>

<h3><code>infer</code>: bắt một kiểu từ bên trong</h3>
<p><code>infer R</code> giới thiệu một biến kiểu mới bên trong mệnh đề <code>extends</code> và buộc nó vào bất cứ thứ gì lấp vào chỗ đó. "Nếu <code>T</code> là một mảng của thứ gì đó, gọi thứ đó là <code>U</code> và trả nó về":</p>
<pre><code><span class="tok-comment">// infer.ts</span>
<span class="tok-keyword">type</span> ElementType&lt;T&gt; = T <span class="tok-keyword">extends</span> (<span class="tok-keyword">infer</span> U)[] ? U : T;
<span class="tok-keyword">type</span> A = ElementType&lt;<span class="tok-keyword">string</span>[]&gt;;   <span class="tok-comment">// string</span>
<span class="tok-keyword">type</span> B = ElementType&lt;<span class="tok-keyword">number</span>&gt;;     <span class="tok-comment">// number (không phải mảng — rơi xuống else)</span></code></pre>
<p><code>ElementType&lt;string[]&gt;</code> khớp mẫu mảng, nên <code>U</code> buộc vào <code>string</code> và đó là kết quả. <code>ElementType&lt;number&gt;</code> không phải mảng, nên nó đi nhánh else và trả <code>number</code> nguyên vẹn.</p>

<h3>Dựng lại ReturnType bằng infer</h3>
<p>Ví dụ kinh điển. Khớp một chữ ký hàm và suy ra kiểu trả về của nó — đây đúng là cách <code>ReturnType&lt;T&gt;</code> có sẵn hoạt động:</p>
<pre><code><span class="tok-keyword">type</span> MyReturnType&lt;T&gt; = T <span class="tok-keyword">extends</span> (...args: <span class="tok-keyword">any</span>[]) =&gt; <span class="tok-keyword">infer</span> R ? R : <span class="tok-keyword">never</span>;
<span class="tok-keyword">function</span> <span class="tok-function">makeUser</span>() { <span class="tok-keyword">return</span> { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span> }; }
<span class="tok-keyword">type</span> U = MyReturnType&lt;<span class="tok-keyword">typeof</span> makeUser&gt;;   <span class="tok-comment">// { id: number; name: string }</span>
<span class="tok-keyword">const</span> u: U = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'x'</span> };
u.id.<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// id là number</span></code></pre>
<div class="out">infer.ts(9,6): error TS2339: Property 'toUpperCase' does not exist on type 'number'.</div>
<p><code>MyReturnType&lt;typeof makeUser&gt;</code> rút ra <code>{ id: number; name: string }</code> mà bạn không hề viết hình dạng đó — nó được suy từ thân hàm. Nên <code>u.id</code> là <code>number</code>, và phương thức chuỗi bị bắt. Đây là lý do sâu xa vì sao utility types thấy như phép màu: chúng là conditional types với <code>infer</code> thò vào các khai báo có sẵn của bạn.</p>

<div class="callout ok"><code>T extends U ? X : Y</code> chọn một kiểu theo điều kiện; <code>infer R</code> bắt một mảnh của kiểu đã khớp để tái dùng trong kết quả. Cùng nhau chúng cho một kiểu được <em>tính ra</em> từ một kiểu khác — nền tảng của <code>ReturnType</code>, <code>Parameters</code>, <code>Awaited</code>, và phần lớn chương 8.</div>
<div class="note-ct">Khi bạn viết <code>type Result = Awaited&lt;ReturnType&lt;typeof fetchUser&gt;&gt;</code> để lấy giá trị đã giải của một hàm async, cả hai đều là kiểu conditional-cộng-infer đang bóc code của bạn. Bạn hiếm khi tự viết chúng, nhưng đọc được chúng biến câu "sao kiểu này lại là <code>never</code>?" từ một bí ẩn thành một dấu vết hai dòng.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: conditional types trên Code Lab</span><span class="lc-sub">Dựng ElementType và ReturnType bằng infer.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Template literal types|||7.4 — Template literal types (kiểu chuỗi mẫu)',
      slug: 'typescript-7-4-template-literal-types',
      type: 'LESSON',
      description: 'Kiểu có thể ghép chuỗi: `/${Lang}/home` sinh ra union đường dẫn; ghép với key remapping để tự sinh getName/getAge.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Template literal types</h2>
<p class="lead">Template literals aren't just for values — TypeScript has them at the type level too. A type like <code>&#96;/\${Lang}/home&#96;</code> builds a set of string literal types by substitution, and combined with key remapping it can generate property names like <code>getName</code> from <code>name</code>.</p>

<h3>Building strings in the type system</h3>
<p>Use the same backtick-and-<code>\${…}</code> syntax you know from values, but with types inside the slots. When a slot is a union, the result is the union of every combination:</p>
<pre><code><span class="tok-comment">// tpl.ts</span>
<span class="tok-keyword">type</span> Lang = <span class="tok-string">'en'</span> | <span class="tok-string">'vi'</span>;
<span class="tok-keyword">type</span> Route = <span class="tok-string">&#96;/\${Lang}/home&#96;</span>;   <span class="tok-comment">// '/en/home' | '/vi/home'</span>
<span class="tok-keyword">const</span> r: Route = <span class="tok-string">'/en/home'</span>;    <span class="tok-comment">// ok</span>
<span class="tok-keyword">const</span> bad: Route = <span class="tok-string">'/fr/home'</span>;  <span class="tok-comment">// 'fr' is not a Lang</span></code></pre>
<div class="out">tpl.ts(5,7): error TS2322: Type '"/fr/home"' is not assignable to type '"/en/home" | "/vi/home"'.</div>
<p><code>Route</code> expanded to exactly the two valid paths, so <code>'/fr/home'</code> — with a language that isn't in <code>Lang</code> — is a compile error. You've turned a naming convention ("paths look like <code>/{lang}/home</code>") into a type the compiler enforces.</p>

<h3>Intrinsic string types</h3>
<p>TypeScript ships four built-in string transformers you can use inside template types: <code>Uppercase</code>, <code>Lowercase</code>, <code>Capitalize</code>, <code>Uncapitalize</code>. They matter most for the next trick — turning a field name into a method name.</p>

<h3>Key remapping: generate getters</h3>
<p>Combine a mapped type's <code>as</code> clause (remap each key to a new name) with a template literal and <code>Capitalize</code>. This derives a getter interface from any object type:</p>
<pre><code><span class="tok-comment">// getters.ts</span>
<span class="tok-keyword">type</span> Getters&lt;T&gt; = { [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> T <span class="tok-keyword">as</span> <span class="tok-string">&#96;get\${Capitalize&lt;<span class="tok-keyword">string</span> &amp; K&gt;}&#96;</span>]: () =&gt; T[K] };
<span class="tok-keyword">interface</span> Person { name: <span class="tok-keyword">string</span>; age: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">const</span> p: Getters&lt;Person&gt; = { getName: () =&gt; <span class="tok-string">'Ada'</span>, getAge: () =&gt; <span class="tok-number">3</span> };
p.<span class="tok-function">getAge</span>().<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// getAge returns number</span></code></pre>
<div class="out">getters.ts(5,12): error TS2339: Property 'toUpperCase' does not exist on type 'number'.</div>
<p>From <code>Person</code> the type computed <code>{ getName: () =&gt; string; getAge: () =&gt; number }</code> — the key <code>name</code> became <code>getName</code>, and each getter returns the original field's type. So <code>p.getAge()</code> is <code>number</code> and the string method is caught. The <code>string &amp; K</code> is a small tax: <code>K</code> can in theory be a symbol, and <code>Capitalize</code> needs a string, so you intersect to keep the string keys.</p>

<div class="callout ok">Template literal types compute string literal types by substitution; with <code>as</code> in a mapped type they rewrite keys. This is the machinery behind typed routers, typed event names (<code>&#96;on\${Event}&#96;</code>), and libraries that infer <code>getX</code>/<code>setX</code> from a shape — the fanciest-looking types you'll meet are usually just this.</div>
<div class="note-ct">Typed route helpers on this site lean on template literal types so a path like <code>&#96;/api/v1/\${Resource}&#96;</code> only accepts real resources, and event-emitter names are checked the same way. You may never write one, but when a library's autocomplete magically knows your field names, this is why.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: template literal types on Code Lab</span><span class="lc-sub">Build a typed route union and a Getters remapper.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Template literal types (kiểu chuỗi mẫu)</h2>
<p class="lead">Template literal không chỉ dành cho giá trị — TypeScript có chúng ở tầng kiểu nữa. Một kiểu như <code>&#96;/\${Lang}/home&#96;</code> dựng một tập kiểu chuỗi literal bằng phép thay thế, và kết hợp với key remapping nó có thể sinh ra các tên thuộc tính như <code>getName</code> từ <code>name</code>.</p>

<h3>Ghép chuỗi trong hệ thống kiểu</h3>
<p>Dùng đúng cú pháp backtick-và-<code>\${…}</code> bạn đã biết từ giá trị, nhưng đặt kiểu trong các khe. Khi một khe là một union, kết quả là union của mọi tổ hợp:</p>
<pre><code><span class="tok-comment">// tpl.ts</span>
<span class="tok-keyword">type</span> Lang = <span class="tok-string">'en'</span> | <span class="tok-string">'vi'</span>;
<span class="tok-keyword">type</span> Route = <span class="tok-string">&#96;/\${Lang}/home&#96;</span>;   <span class="tok-comment">// '/en/home' | '/vi/home'</span>
<span class="tok-keyword">const</span> r: Route = <span class="tok-string">'/en/home'</span>;    <span class="tok-comment">// ok</span>
<span class="tok-keyword">const</span> bad: Route = <span class="tok-string">'/fr/home'</span>;  <span class="tok-comment">// 'fr' không phải một Lang</span></code></pre>
<div class="out">tpl.ts(5,7): error TS2322: Type '"/fr/home"' is not assignable to type '"/en/home" | "/vi/home"'.</div>
<p><code>Route</code> nở ra đúng hai đường dẫn hợp lệ, nên <code>'/fr/home'</code> — với một ngôn ngữ không có trong <code>Lang</code> — là lỗi biên dịch. Bạn đã biến một quy ước đặt tên ("đường dẫn trông như <code>/{lang}/home</code>") thành một kiểu mà trình biên dịch bắt tuân thủ.</p>

<h3>Kiểu chuỗi có sẵn</h3>
<p>TypeScript kèm sẵn bốn bộ biến đổi chuỗi bạn dùng được bên trong kiểu template: <code>Uppercase</code>, <code>Lowercase</code>, <code>Capitalize</code>, <code>Uncapitalize</code>. Chúng quan trọng nhất cho mẹo kế tiếp — biến một tên field thành một tên phương thức.</p>

<h3>Key remapping: sinh getter</h3>
<p>Kết hợp mệnh đề <code>as</code> của mapped type (ánh xạ lại mỗi key thành một tên mới) với một template literal và <code>Capitalize</code>. Cái này suy ra một interface getter từ bất cứ kiểu object nào:</p>
<pre><code><span class="tok-comment">// getters.ts</span>
<span class="tok-keyword">type</span> Getters&lt;T&gt; = { [K <span class="tok-keyword">in</span> <span class="tok-keyword">keyof</span> T <span class="tok-keyword">as</span> <span class="tok-string">&#96;get\${Capitalize&lt;<span class="tok-keyword">string</span> &amp; K&gt;}&#96;</span>]: () =&gt; T[K] };
<span class="tok-keyword">interface</span> Person { name: <span class="tok-keyword">string</span>; age: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">const</span> p: Getters&lt;Person&gt; = { getName: () =&gt; <span class="tok-string">'Ada'</span>, getAge: () =&gt; <span class="tok-number">3</span> };
p.<span class="tok-function">getAge</span>().<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// getAge trả về number</span></code></pre>
<div class="out">getters.ts(5,12): error TS2339: Property 'toUpperCase' does not exist on type 'number'.</div>
<p>Từ <code>Person</code>, kiểu tính ra <code>{ getName: () =&gt; string; getAge: () =&gt; number }</code> — key <code>name</code> thành <code>getName</code>, và mỗi getter trả về kiểu của field gốc. Nên <code>p.getAge()</code> là <code>number</code> và phương thức chuỗi bị bắt. Phần <code>string &amp; K</code> là một khoản thuế nhỏ: <code>K</code> về lý thuyết có thể là một symbol, mà <code>Capitalize</code> cần một chuỗi, nên ta giao (intersect) để giữ lại các key kiểu chuỗi.</p>

<div class="callout ok">Template literal types tính ra kiểu chuỗi literal bằng phép thay thế; với <code>as</code> trong một mapped type chúng viết lại các key. Đây là cỗ máy đằng sau router có kiểu, tên sự kiện có kiểu (<code>&#96;on\${Event}&#96;</code>), và các thư viện suy ra <code>getX</code>/<code>setX</code> từ một hình dạng — những kiểu trông hoa mỹ nhất bạn gặp thường chỉ là cái này.</div>
<div class="note-ct">Các helper route có kiểu trên site này dựa vào template literal types để một đường dẫn như <code>&#96;/api/v1/\${Resource}&#96;</code> chỉ nhận các resource thật, và tên của bộ phát sự kiện được kiểm y hệt. Bạn có thể không bao giờ tự viết một cái, nhưng khi autocomplete của một thư viện biết thần kỳ tên field của bạn, đây là lý do.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: template literal types trên Code Lab</span><span class="lc-sub">Dựng một union route có kiểu và một bộ remap Getters.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 7.5 quiz ─────────────────────────── */
    {
      title: '7.5 — Chapter 7 quiz|||7.5 — Kiểm tra Chương 7',
      slug: 'typescript-7-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về mapped types, modifier thêm/gỡ (?/readonly/-?/-readonly), conditional types, infer và template literal types.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the type-computing tools — mapped, conditional and template literal types. These are read more than written, so the goal is recognising them. Questions follow lesson order.</p>
<div class="callout ok">Aim for 6/8 — this is the densest chapter so far. The two ideas to hold onto: a mapped type is a loop over keys, and conditional + infer is how utility types are built.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về các công cụ tính kiểu — mapped, conditional và template literal types. Chúng được đọc nhiều hơn viết, nên mục tiêu là nhận ra chúng. Các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 6/8 — đây là chương đậm đặc nhất tới giờ. Hai ý cần giữ: mapped type là một vòng lặp qua các key, và conditional + infer là cách utility types được dựng nên.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does { [K in keyof T]: T[K] } do?|||{ [K in keyof T]: T[K] } làm gì?',
            options: [
              'Deletes all keys of T|||Xoá mọi key của T',
              'Loops over every key of T and rebuilds the same type (the identity mapping)|||Lặp qua từng key của T và dựng lại cùng kiểu (ánh xạ đồng nhất)',
              'Turns T into an array|||Biến T thành mảng',
              'Makes T a union|||Biến T thành union',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'type MyPartial<T> = { [K in keyof T]?: T[K] } — does making a field optional also make it untyped?|||type MyPartial<T> = { [K in keyof T]?: T[K] } — làm một field tuỳ chọn có làm nó mất kiểu không?',
            options: [
              'Yes — optional fields accept anything|||Có — field tuỳ chọn nhận mọi thứ',
              "No — the field may be absent, but if present it still has its original type|||Không — field có thể vắng, nhưng nếu có mặt nó vẫn giữ kiểu gốc",
              'Yes, it becomes any|||Có, nó thành any',
              'Only in non-strict mode|||Chỉ trong chế độ không strict',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does the minus in { -readonly [K in keyof T]: T[K] } do?|||Dấu trừ trong { -readonly [K in keyof T]: T[K] } làm gì?',
            options: [
              'Adds readonly to every key|||Thêm readonly vào mọi key',
              'Removes readonly from every key, producing a mutable type|||Gỡ readonly khỏi mọi key, tạo một kiểu ghi-được',
              'Deletes readonly keys|||Xoá các key readonly',
              'It is a syntax error|||Đó là lỗi cú pháp',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which mapped type is equivalent to the built-in Required<T>?|||Mapped type nào tương đương Required<T> có sẵn?',
            options: [
              '{ [K in keyof T]?: T[K] }',
              '{ [K in keyof T]-?: T[K] }',
              '{ readonly [K in keyof T]: T[K] }',
              '{ [K in keyof T]: T[K] | undefined }',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does T extends U ? X : Y mean?|||T extends U ? X : Y nghĩa là gì?',
            options: [
              'T inherits from U at runtime|||T kế thừa U lúc chạy',
              'A type-level if: if T is assignable to U the result is X, otherwise Y|||Một if ở tầng kiểu: nếu T gán được cho U thì kết quả là X, ngược lại Y',
              'A runtime conditional|||Một điều kiện lúc chạy',
              'It always resolves to X|||Nó luôn giải ra X',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In type ElementType<T> = T extends (infer U)[] ? U : T, what is ElementType<string[]>?|||Trong type ElementType<T> = T extends (infer U)[] ? U : T, ElementType<string[]> là gì?',
            options: [
              'string[]',
              'string',
              'never',
              'T',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'How does MyReturnType<T> = T extends (...a: any[]) => infer R ? R : never work?|||MyReturnType<T> = T extends (...a: any[]) => infer R ? R : never hoạt động thế nào?',
            options: [
              'It captures the function\'s return type into R and returns it|||Nó bắt kiểu trả về của hàm vào R và trả nó về',
              'It returns the parameter types|||Nó trả về kiểu các tham số',
              'It always returns never|||Nó luôn trả về never',
              'It runs the function|||Nó chạy hàm',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'type Route = `/${Lang}/home` where Lang = "en" | "vi" produces?|||type Route = `/${Lang}/home` với Lang = "en" | "vi" sinh ra?',
            options: [
              'string',
              "'/en/home' | '/vi/home'",
              "'/${Lang}/home' as a literal|||'/${Lang}/home' dạng literal",
              'never',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
