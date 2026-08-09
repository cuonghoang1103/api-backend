/**
 * TypeScript — Chương 13: Validate runtime với Zod & suy kiểu từ Prisma.
 * Mọi output tsc là THẬT (tsc --strict, zod 3.25 + @prisma/client 5.22, verified).
 * < > → &lt; &gt;; & → &amp;; KHÔNG backtick trần (&#96;); ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 13 — Runtime validation: Zod & Prisma|||Chương 13 — Validate runtime: Zod & Prisma',
  description: 'Kiểu bị xoá lúc chạy, nên dữ liệu từ ngoài chưa được kiểm. Zod validate VÀ suy ra kiểu (một nguồn sự thật); Prisma sinh kiểu cho mọi model — đóng lại lỗ hổng "as T không validate".',
  lessons: [
    /* ─────────────────────────── 13.1 ─────────────────────────── */
    {
      title: '13.1 — The boundary problem & Zod|||13.1 — Vấn đề tại biên & Zod',
      slug: 'typescript-13-1-boundary-zod',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Kiểu bị xoá lúc chạy nên dữ liệu từ mạng/DB chưa được kiểm. Một schema Zod vừa validate lúc chạy vừa cho ra một kiểu qua z.infer.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>The boundary problem &amp; Zod</h2>
<p class="lead">Every chapter has warned about it: types are erased at runtime, so <code>as T</code> on incoming data is a promise, not a check. At the boundary — a request body, an API response, an env var — you need something that actually inspects the value. Zod is that something, and it gives you the type for free.</p>

<h3>A schema that validates and infers</h3>
<p>A Zod schema is a runtime value that describes a shape. From it, <code>z.infer</code> extracts a static type — so the validator and the type come from one declaration and can never disagree:</p>
<pre><code><span class="tok-comment">// infer.ts</span>
<span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">'zod'</span>;
<span class="tok-keyword">const</span> UserSchema = z.<span class="tok-function">object</span>({
  id: z.<span class="tok-function">number</span>(),
  name: z.<span class="tok-function">string</span>(),
  email: z.<span class="tok-function">string</span>().<span class="tok-function">email</span>(),
});
<span class="tok-keyword">type</span> User = z.infer&lt;<span class="tok-keyword">typeof</span> UserSchema&gt;;   <span class="tok-comment">// { id: number; name: string; email: string }</span>
<span class="tok-keyword">const</span> ok: User = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span>, email: <span class="tok-string">'a@b.c'</span> };
<span class="tok-keyword">const</span> bad: User = { id: <span class="tok-string">'1'</span>, name: <span class="tok-string">'Ada'</span>, email: <span class="tok-string">'a@b.c'</span> };   <span class="tok-comment">// id should be number</span></code></pre>
<div class="out">infer.ts(10,21): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>The type <code>User</code> was <em>derived</em> from the schema, so <code>id: '1'</code> is a compile error just as if you'd written the interface by hand. But the schema is more than a type: at runtime, <code>UserSchema</code> can actually check that a value coming off the wire has a numeric <code>id</code> and a valid email — something a plain <code>interface</code> can never do because it doesn't exist at runtime.</p>

<h3>Why this closes the gap</h3>
<p>Recall the typed fetch from chapter 6: <code>getJson&lt;User&gt;(url)</code> asserted the shape and hoped. With Zod you <em>validate</em> instead — parse the response through <code>UserSchema</code>, and if the server sent something else, you find out immediately at the boundary rather than three function calls later as a mysterious <code>undefined</code>. The type system guards your code; Zod guards the door.</p>

<div class="callout ok">Types vanish at runtime; Zod schemas don't. Write the shape once as a Zod schema, get the runtime validator <em>and</em> the static type (<code>z.infer&lt;typeof schema&gt;</code>) from that single source. This is the tool that finally makes external data trustworthy.</div>
<div class="note-ct">This is exactly why the earlier chapters kept deferring "but does the data match?" to here. On this site, every request body and every external payload is parsed through a Zod schema before the typed code touches it — the schema is the one place the shape is declared, and both the validator and the TypeScript type flow out of it.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: Zod schemas on Code Lab</span><span class="lc-sub">Write a schema and infer its type with z.infer.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Vấn đề tại biên &amp; Zod</h2>
<p class="lead">Mọi chương đều đã cảnh báo: kiểu bị xoá lúc chạy, nên <code>as T</code> trên dữ liệu đến là một lời hứa, không phải phép kiểm. Tại biên — một body request, một phản hồi API, một biến env — bạn cần thứ gì đó thật sự soi giá trị. Zod là thứ đó, và nó cho bạn kiểu miễn phí.</p>

<h3>Một schema vừa validate vừa suy kiểu</h3>
<p>Một schema Zod là một giá trị lúc chạy mô tả một hình dạng. Từ nó, <code>z.infer</code> rút ra một kiểu tĩnh — nên bộ validate và kiểu đến từ một khai báo và không bao giờ bất đồng:</p>
<pre><code><span class="tok-comment">// infer.ts</span>
<span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">'zod'</span>;
<span class="tok-keyword">const</span> UserSchema = z.<span class="tok-function">object</span>({
  id: z.<span class="tok-function">number</span>(),
  name: z.<span class="tok-function">string</span>(),
  email: z.<span class="tok-function">string</span>().<span class="tok-function">email</span>(),
});
<span class="tok-keyword">type</span> User = z.infer&lt;<span class="tok-keyword">typeof</span> UserSchema&gt;;   <span class="tok-comment">// { id: number; name: string; email: string }</span>
<span class="tok-keyword">const</span> ok: User = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span>, email: <span class="tok-string">'a@b.c'</span> };
<span class="tok-keyword">const</span> bad: User = { id: <span class="tok-string">'1'</span>, name: <span class="tok-string">'Ada'</span>, email: <span class="tok-string">'a@b.c'</span> };   <span class="tok-comment">// id phải là number</span></code></pre>
<div class="out">infer.ts(10,21): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>Kiểu <code>User</code> được <em>suy ra</em> từ schema, nên <code>id: '1'</code> là lỗi biên dịch y như thể bạn tự viết interface bằng tay. Nhưng schema còn hơn một kiểu: lúc chạy, <code>UserSchema</code> có thể thật sự kiểm rằng một giá trị đến từ đường truyền có một <code>id</code> kiểu số và một email hợp lệ — điều một <code>interface</code> trần không bao giờ làm được vì nó không tồn tại lúc chạy.</p>

<h3>Vì sao điều này đóng lại lỗ hổng</h3>
<p>Nhớ lại fetch có kiểu ở chương 6: <code>getJson&lt;User&gt;(url)</code> khẳng định hình dạng rồi hy vọng. Với Zod bạn <em>validate</em> thay vào đó — phân tích phản hồi qua <code>UserSchema</code>, và nếu máy chủ gửi thứ khác, bạn biết ngay tại biên thay vì ba lời gọi hàm sau đó dưới dạng một <code>undefined</code> bí ẩn. Hệ thống kiểu gác code của bạn; Zod gác cánh cửa.</p>

<div class="callout ok">Kiểu biến mất lúc chạy; schema Zod thì không. Viết hình dạng một lần dưới dạng schema Zod, nhận bộ validate lúc chạy <em>và</em> kiểu tĩnh (<code>z.infer&lt;typeof schema&gt;</code>) từ nguồn duy nhất đó. Đây là công cụ cuối cùng làm cho dữ liệu từ ngoài đáng tin.</div>
<div class="note-ct">Đây đúng là lý do các chương trước cứ hoãn câu "nhưng dữ liệu có khớp không?" tới đây. Trên site này, mọi body request và mọi payload từ ngoài được phân tích qua một schema Zod trước khi code có kiểu chạm vào — schema là một chỗ duy nhất khai hình dạng, và cả bộ validate lẫn kiểu TypeScript đều chảy ra từ nó.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: schema Zod trên Code Lab</span><span class="lc-sub">Viết một schema và suy kiểu của nó bằng z.infer.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.2 ─────────────────────────── */
    {
      title: '13.2 — parse vs safeParse|||13.2 — parse so với safeParse',
      slug: 'typescript-13-2-parse-safeparse',
      type: 'LESSON',
      description: 'parse ném lỗi khi sai; safeParse trả một discriminated union { success, data | error } — bạn phải kiểm success trước khi đọc data.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>parse vs safeParse</h2>
<p class="lead">A schema gives you two ways to run it. <code>parse</code> returns the typed value or <strong>throws</strong> a <code>ZodError</code>; <code>safeParse</code> never throws — it returns a discriminated union you narrow, exactly like chapter 5's <code>{ ok: true } | { ok: false }</code>.</p>

<h3>safeParse returns a union you must narrow</h3>
<p>The result is <code>{ success: true; data: T } | { success: false; error: ZodError }</code>. Reach for <code>data</code> without checking <code>success</code> and the compiler stops you:</p>
<pre><code><span class="tok-comment">// safeparse.ts</span>
<span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">'zod'</span>;
<span class="tok-keyword">const</span> UserSchema = z.<span class="tok-function">object</span>({ id: z.<span class="tok-function">number</span>(), name: z.<span class="tok-function">string</span>() });
<span class="tok-keyword">function</span> <span class="tok-function">handle</span>(raw: <span class="tok-keyword">unknown</span>) {
  <span class="tok-keyword">const</span> result = UserSchema.<span class="tok-function">safeParse</span>(raw);
  <span class="tok-keyword">return</span> result.data.name;   <span class="tok-comment">// data only exists when success is true</span>
}</code></pre>
<div class="out">safeparse.ts(6,10): error TS18048: 'result.data' is possibly 'undefined'.</div>
<p>The type system enforces the check: you can't read <code>result.data</code> until you've confirmed <code>result.success</code>. This is the discriminated-union safety of chapter 5, applied to validation — "handle the invalid case" is mandatory.</p>

<h3>Narrow first, then use the typed data</h3>
<p>Check <code>success</code> and each branch is fully typed — <code>error</code> on failure, the typed value on success:</p>
<pre><code><span class="tok-comment">// narrow.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">handle</span>(raw: <span class="tok-keyword">unknown</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">const</span> result = UserSchema.<span class="tok-function">safeParse</span>(raw);
  <span class="tok-keyword">if</span> (!result.success) {
    <span class="tok-keyword">return</span> result.error.message;   <span class="tok-comment">// ZodError on the failure branch</span>
  }
  <span class="tok-keyword">return</span> result.data.name;         <span class="tok-comment">// narrowed: data is the typed User</span>
}</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>After the early return, <code>result</code> is the success variant, so <code>result.data</code> is a fully typed value — no cast, no <code>any</code>. Use <code>safeParse</code> at boundaries where invalid input is expected (a request body) and you want to return a 400; use <code>parse</code> where invalid input is a bug that should crash loudly (parsing your own config at startup).</p>

<div class="callout ok"><code>schema.parse(x)</code> returns <code>T</code> or throws; <code>schema.safeParse(x)</code> returns <code>{ success: true; data: T } | { success: false; error }</code> — narrow on <code>success</code> before touching <code>data</code>. Same discriminated-union discipline as chapter 5, now guarding real input.</div>
<div class="note-ct">Validation middleware on this backend runs <code>schema.safeParse(req.body)</code> and returns a 400 with the <code>ZodError</code> details when it fails, or hands the typed <code>data</code> to the handler when it succeeds — so a route body is both validated and typed by the time your code sees it, and a malformed request becomes a clean 400 instead of a 500 deeper in.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: safeParse on Code Lab</span><span class="lc-sub">Narrow a safeParse result and handle both branches.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>parse so với safeParse</h2>
<p class="lead">Một schema cho bạn hai cách chạy nó. <code>parse</code> trả về giá trị có kiểu hoặc <strong>ném</strong> một <code>ZodError</code>; <code>safeParse</code> không bao giờ ném — nó trả một discriminated union bạn thu hẹp, y như <code>{ ok: true } | { ok: false }</code> ở chương 5.</p>

<h3>safeParse trả một union bạn phải thu hẹp</h3>
<p>Kết quả là <code>{ success: true; data: T } | { success: false; error: ZodError }</code>. Với tới <code>data</code> mà không kiểm <code>success</code> thì trình biên dịch chặn bạn:</p>
<pre><code><span class="tok-comment">// safeparse.ts</span>
<span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">'zod'</span>;
<span class="tok-keyword">const</span> UserSchema = z.<span class="tok-function">object</span>({ id: z.<span class="tok-function">number</span>(), name: z.<span class="tok-function">string</span>() });
<span class="tok-keyword">function</span> <span class="tok-function">handle</span>(raw: <span class="tok-keyword">unknown</span>) {
  <span class="tok-keyword">const</span> result = UserSchema.<span class="tok-function">safeParse</span>(raw);
  <span class="tok-keyword">return</span> result.data.name;   <span class="tok-comment">// data chỉ tồn tại khi success là true</span>
}</code></pre>
<div class="out">safeparse.ts(6,10): error TS18048: 'result.data' is possibly 'undefined'.</div>
<p>Hệ thống kiểu ép phép kiểm: bạn không đọc được <code>result.data</code> tới khi đã xác nhận <code>result.success</code>. Đây là an toàn discriminated-union của chương 5, áp lên validation — "xử lý trường hợp không hợp lệ" là bắt buộc.</p>

<h3>Thu hẹp trước, rồi dùng data có kiểu</h3>
<p>Kiểm <code>success</code> và mỗi nhánh có kiểu đầy đủ — <code>error</code> khi thất bại, giá trị có kiểu khi thành công:</p>
<pre><code><span class="tok-comment">// narrow.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">handle</span>(raw: <span class="tok-keyword">unknown</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">const</span> result = UserSchema.<span class="tok-function">safeParse</span>(raw);
  <span class="tok-keyword">if</span> (!result.success) {
    <span class="tok-keyword">return</span> result.error.message;   <span class="tok-comment">// ZodError ở nhánh thất bại</span>
  }
  <span class="tok-keyword">return</span> result.data.name;         <span class="tok-comment">// đã thu hẹp: data là User có kiểu</span>
}</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Sau early return, <code>result</code> là biến thể thành công, nên <code>result.data</code> là một giá trị có kiểu đầy đủ — không ép kiểu, không <code>any</code>. Dùng <code>safeParse</code> tại biên nơi input không hợp lệ là điều dự kiến (một body request) và bạn muốn trả 400; dùng <code>parse</code> nơi input không hợp lệ là một lỗi nên sập lớn tiếng (phân tích config của chính bạn lúc khởi động).</p>

<div class="callout ok"><code>schema.parse(x)</code> trả <code>T</code> hoặc ném; <code>schema.safeParse(x)</code> trả <code>{ success: true; data: T } | { success: false; error }</code> — thu hẹp trên <code>success</code> trước khi chạm <code>data</code>. Cùng kỷ luật discriminated-union của chương 5, giờ gác input thật.</div>
<div class="note-ct">Middleware validation trên backend này chạy <code>schema.safeParse(req.body)</code> và trả 400 kèm chi tiết <code>ZodError</code> khi thất bại, hoặc giao <code>data</code> có kiểu cho handler khi thành công — nên một body route vừa được validate vừa có kiểu lúc code bạn thấy nó, và một request sai định dạng thành một 400 sạch thay vì một 500 sâu bên trong.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: safeParse trên Code Lab</span><span class="lc-sub">Thu hẹp một kết quả safeParse và xử lý cả hai nhánh.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.3 ─────────────────────────── */
    {
      title: '13.3 — Schema as the single source of truth|||13.3 — Schema là nguồn sự thật duy nhất',
      slug: 'typescript-13-3-schema-source-of-truth',
      type: 'LESSON',
      description: 'z.infer giữ kiểu luôn đồng bộ với schema; coerce/transform biến đổi giá trị (input khác output); enum cho union literal — validate cấu hình một lần lúc khởi động.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Schema as the single source of truth</h2>
<p class="lead">Because the type is inferred from the schema, the schema becomes the one place a shape is defined — change it and the type follows automatically. Zod also does <em>work</em> during validation: coercing strings to numbers, restricting to an enum, transforming values. The inferred type reflects all of it.</p>

<h3>Coerce and enum: the config pattern</h3>
<p>Environment variables arrive as strings (chapter 11). <code>z.coerce.number()</code> parses one to a number during validation, and <code>z.enum</code> restricts a string to a fixed set — exactly what you want for config, validated once at startup:</p>
<pre><code><span class="tok-comment">// transform.ts</span>
<span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">'zod'</span>;
<span class="tok-keyword">const</span> EnvSchema = z.<span class="tok-function">object</span>({
  PORT: z.coerce.<span class="tok-function">number</span>(),          <span class="tok-comment">// takes a string, outputs a number</span>
  NODE_ENV: z.<span class="tok-function">enum</span>([<span class="tok-string">'dev'</span>, <span class="tok-string">'prod'</span>]),
});
<span class="tok-keyword">type</span> Env = z.infer&lt;<span class="tok-keyword">typeof</span> EnvSchema&gt;;   <span class="tok-comment">// { PORT: number; NODE_ENV: 'dev' | 'prod' }</span>
<span class="tok-keyword">const</span> bad: Env = { PORT: <span class="tok-number">3000</span>, NODE_ENV: <span class="tok-string">'staging'</span> };   <span class="tok-comment">// staging is not in the enum</span></code></pre>
<div class="out">transform.ts(8,32): error TS2322: Type '"staging"' is not assignable to type '"dev" | "prod"'.</div>
<p>The inferred <code>Env</code> type has <code>PORT: number</code> (after coercion) and <code>NODE_ENV: 'dev' | 'prod'</code> (the enum as a literal union from chapter 5). So <code>'staging'</code> is a compile error, and at runtime a missing or misspelled <code>NODE_ENV</code> fails validation at boot — the "loud failure at startup" pattern from chapter 11, now enforced by one schema.</p>

<h3>One shape, one place</h3>
<p>The real win is <em>no drift</em>. When you add a field to <code>EnvSchema</code>, the <code>Env</code> type gains it automatically, every consumer that forgot to handle it lights up red, and the runtime validator starts requiring it — all from editing one object. Compare this to a hand-written interface plus a separate hand-written validator: two things to keep in sync, and they always drift.</p>

<div class="callout ok">The schema is the single source of truth: <code>z.infer</code> keeps the type in lockstep, <code>z.coerce</code>/<code>z.transform</code> let input and output types differ (string in, number out), and <code>z.enum</code> produces a literal union. Add a field once and the type, the consumers, and the runtime check all update together.</div>
<div class="note-ct">This project validates its environment/config through a Zod schema at startup, so a missing production env var is a loud boot-time failure with a clear message — not a <code>500</code> three requests later (the exact failure mode chapter 11 warned about, now closed). The parsed, typed config object is imported everywhere instead of raw <code>process.env</code>.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: schema as source of truth on Code Lab</span><span class="lc-sub">Build a coerced, enum-checked config schema.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Schema là nguồn sự thật duy nhất</h2>
<p class="lead">Vì kiểu được suy từ schema, schema trở thành một chỗ duy nhất định nghĩa một hình dạng — đổi nó thì kiểu theo sau tự động. Zod còn làm <em>việc</em> trong lúc validate: ép chuỗi thành số, giới hạn về một enum, biến đổi giá trị. Kiểu suy ra phản ánh tất cả.</p>

<h3>Coerce và enum: pattern cấu hình</h3>
<p>Biến môi trường đến dưới dạng chuỗi (chương 11). <code>z.coerce.number()</code> phân tích một chuỗi thành số trong lúc validate, và <code>z.enum</code> giới hạn một chuỗi về một tập cố định — đúng thứ bạn muốn cho config, validate một lần lúc khởi động:</p>
<pre><code><span class="tok-comment">// transform.ts</span>
<span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">'zod'</span>;
<span class="tok-keyword">const</span> EnvSchema = z.<span class="tok-function">object</span>({
  PORT: z.coerce.<span class="tok-function">number</span>(),          <span class="tok-comment">// nhận một chuỗi, xuất một số</span>
  NODE_ENV: z.<span class="tok-function">enum</span>([<span class="tok-string">'dev'</span>, <span class="tok-string">'prod'</span>]),
});
<span class="tok-keyword">type</span> Env = z.infer&lt;<span class="tok-keyword">typeof</span> EnvSchema&gt;;   <span class="tok-comment">// { PORT: number; NODE_ENV: 'dev' | 'prod' }</span>
<span class="tok-keyword">const</span> bad: Env = { PORT: <span class="tok-number">3000</span>, NODE_ENV: <span class="tok-string">'staging'</span> };   <span class="tok-comment">// staging không có trong enum</span></code></pre>
<div class="out">transform.ts(8,32): error TS2322: Type '"staging"' is not assignable to type '"dev" | "prod"'.</div>
<p>Kiểu <code>Env</code> suy ra có <code>PORT: number</code> (sau khi ép) và <code>NODE_ENV: 'dev' | 'prod'</code> (enum thành một union literal từ chương 5). Nên <code>'staging'</code> là lỗi biên dịch, và lúc chạy một <code>NODE_ENV</code> thiếu hay gõ sai sẽ trượt validate ngay lúc khởi động — pattern "thất bại lớn tiếng lúc khởi động" từ chương 11, giờ được một schema ép.</p>

<h3>Một hình dạng, một chỗ</h3>
<p>Cái lợi thật là <em>không trôi lệch</em>. Khi bạn thêm một field vào <code>EnvSchema</code>, kiểu <code>Env</code> tự có nó, mọi bên tiêu thụ quên xử lý sáng đỏ, và bộ validate lúc chạy bắt đầu đòi nó — tất cả từ việc sửa một object. So với một interface viết tay cộng một bộ validate viết tay riêng: hai thứ phải giữ đồng bộ, và chúng luôn trôi lệch.</p>

<div class="callout ok">Schema là nguồn sự thật duy nhất: <code>z.infer</code> giữ kiểu bám sát, <code>z.coerce</code>/<code>z.transform</code> cho kiểu input và output khác nhau (chuỗi vào, số ra), và <code>z.enum</code> sinh một union literal. Thêm một field một lần và kiểu, các bên tiêu thụ, và phép kiểm lúc chạy đều cập nhật cùng lúc.</div>
<div class="note-ct">Dự án này validate môi trường/config qua một schema Zod lúc khởi động, nên một biến env production thiếu là một thất bại lớn tiếng lúc boot kèm thông báo rõ — không phải một <code>500</code> ba request sau đó (đúng kiểu hỏng chương 11 cảnh báo, giờ đóng lại). Object config đã phân tích, có kiểu được import khắp nơi thay cho <code>process.env</code> thô.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: schema là nguồn sự thật trên Code Lab</span><span class="lc-sub">Dựng một schema config có coerce và enum.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.4 ─────────────────────────── */
    {
      title: '13.4 — Types from Prisma|||13.4 — Kiểu từ Prisma',
      slug: 'typescript-13-4-types-from-prisma',
      type: 'LESSON',
      description: 'Prisma sinh kiểu TypeScript cho mọi model từ schema.prisma: field String? thành T | null; Prisma.ModelGetPayload<{ select }> cho kiểu đúng theo truy vấn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>Types from Prisma</h2>
<p class="lead">The other big source of generated types is your database. Prisma reads <code>schema.prisma</code> and generates a fully-typed client — every model becomes a TypeScript type, and every query returns exactly the shape it selected. You never hand-write a "row" interface again.</p>

<h3>Model types mirror the schema — including nullability</h3>
<p>Import a model type straight from the generated client. An optional column (<code>fullName String?</code> in the schema) becomes <code>string | null</code>, so the strict-null discipline applies automatically:</p>
<pre><code><span class="tok-comment">// prisma-model.ts</span>
<span class="tok-keyword">import</span> { User } <span class="tok-keyword">from</span> <span class="tok-string">'@prisma/client'</span>;   <span class="tok-comment">// generated from schema.prisma</span>
<span class="tok-keyword">function</span> <span class="tok-function">greet</span>(user: User): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">const</span> name: <span class="tok-keyword">string</span> = user.fullName;   <span class="tok-comment">// fullName is optional in the schema</span>
  <span class="tok-keyword">return</span> <span class="tok-string">'Hi '</span> + name;
}</code></pre>
<div class="out">prisma-model.ts(4,9): error TS2322: Type 'string | null' is not assignable to type 'string'.
  Type 'null' is not assignable to type 'string'.</div>
<p>The schema said <code>fullName String?</code>, so the generated <code>User.fullName</code> is <code>string | null</code> — and TypeScript forces you to handle the null. Your database schema and your types are the same source: change a column to nullable in <code>schema.prisma</code>, run <code>prisma generate</code>, and every place that assumed it was non-null lights up.</p>

<h3>Query result types with GetPayload</h3>
<p>A query with <code>select</code> or <code>include</code> returns a <em>narrower</em> shape than the full model. <code>Prisma.ModelGetPayload&lt;…&gt;</code> gives you exactly that shape — a type that has only the selected fields:</p>
<pre><code><span class="tok-comment">// prisma-select.ts</span>
<span class="tok-keyword">import</span> { Prisma } <span class="tok-keyword">from</span> <span class="tok-string">'@prisma/client'</span>;
<span class="tok-keyword">type</span> UserPreview = Prisma.UserGetPayload&lt;{ select: { id: <span class="tok-keyword">true</span>; username: <span class="tok-keyword">true</span> } }&gt;;
<span class="tok-keyword">const</span> p: UserPreview = { id: <span class="tok-number">1</span>, username: <span class="tok-string">'ada'</span> };
console.<span class="tok-function">log</span>(p.email);   <span class="tok-comment">// email was not selected</span></code></pre>
<div class="out">prisma-select.ts(5,15): error TS2339: Property 'email' does not exist on type '{ id: number; username: string; }'.</div>
<p><code>UserPreview</code> has only <code>id</code> and <code>username</code>, because that's all the query selected — so reading <code>p.email</code> is a compile error. This is precise: the type of a query result matches what that query actually returns, not the whole table. A route that selects a few columns can't accidentally reference one it didn't fetch.</p>

<div class="callout ok">Prisma generates types from your schema: models become types (with <code>String?</code> → <code>T | null</code>), and <code>Prisma.ModelGetPayload&lt;{ select/include }&gt;</code> types a query's exact result. Between Zod at the input boundary and Prisma at the database boundary, both edges of the app are validated <em>and</em> typed from a single source each.</div>
<div class="note-ct">This is why nothing here hand-writes a database-row interface: the Prisma client's generated types are the source, and a schema change plus <code>prisma generate</code> propagates everywhere. The <code>GetPayload</code> helper types the exact shape each service returns, so a controller can't read a field a query never selected — the drift that plain interfaces would allow simply can't happen.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: Prisma types on Code Lab</span><span class="lc-sub">Use a model type and a GetPayload select type.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Kiểu từ Prisma</h2>
<p class="lead">Nguồn kiểu-sinh-ra lớn còn lại là cơ sở dữ liệu của bạn. Prisma đọc <code>schema.prisma</code> và sinh một client có kiểu đầy đủ — mọi model thành một kiểu TypeScript, và mọi truy vấn trả về đúng hình dạng nó đã chọn. Bạn không bao giờ tự viết một interface "hàng" nữa.</p>

<h3>Kiểu model phản chiếu schema — kể cả tính null</h3>
<p>Import một kiểu model thẳng từ client được sinh. Một cột tuỳ chọn (<code>fullName String?</code> trong schema) thành <code>string | null</code>, nên kỷ luật strict-null áp dụng tự động:</p>
<pre><code><span class="tok-comment">// prisma-model.ts</span>
<span class="tok-keyword">import</span> { User } <span class="tok-keyword">from</span> <span class="tok-string">'@prisma/client'</span>;   <span class="tok-comment">// sinh từ schema.prisma</span>
<span class="tok-keyword">function</span> <span class="tok-function">greet</span>(user: User): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">const</span> name: <span class="tok-keyword">string</span> = user.fullName;   <span class="tok-comment">// fullName là tuỳ chọn trong schema</span>
  <span class="tok-keyword">return</span> <span class="tok-string">'Hi '</span> + name;
}</code></pre>
<div class="out">prisma-model.ts(4,9): error TS2322: Type 'string | null' is not assignable to type 'string'.
  Type 'null' is not assignable to type 'string'.</div>
<p>Schema nói <code>fullName String?</code>, nên <code>User.fullName</code> được sinh là <code>string | null</code> — và TypeScript ép bạn xử lý null. Schema cơ sở dữ liệu và kiểu của bạn là cùng một nguồn: đổi một cột thành nullable trong <code>schema.prisma</code>, chạy <code>prisma generate</code>, và mọi chỗ giả định nó không-null sáng lên.</p>

<h3>Kiểu kết quả truy vấn với GetPayload</h3>
<p>Một truy vấn có <code>select</code> hay <code>include</code> trả về một hình dạng <em>hẹp hơn</em> model đầy đủ. <code>Prisma.ModelGetPayload&lt;…&gt;</code> cho bạn đúng hình dạng đó — một kiểu chỉ có các field đã chọn:</p>
<pre><code><span class="tok-comment">// prisma-select.ts</span>
<span class="tok-keyword">import</span> { Prisma } <span class="tok-keyword">from</span> <span class="tok-string">'@prisma/client'</span>;
<span class="tok-keyword">type</span> UserPreview = Prisma.UserGetPayload&lt;{ select: { id: <span class="tok-keyword">true</span>; username: <span class="tok-keyword">true</span> } }&gt;;
<span class="tok-keyword">const</span> p: UserPreview = { id: <span class="tok-number">1</span>, username: <span class="tok-string">'ada'</span> };
console.<span class="tok-function">log</span>(p.email);   <span class="tok-comment">// email không được select</span></code></pre>
<div class="out">prisma-select.ts(5,15): error TS2339: Property 'email' does not exist on type '{ id: number; username: string; }'.</div>
<p><code>UserPreview</code> chỉ có <code>id</code> và <code>username</code>, vì đó là tất cả truy vấn đã chọn — nên đọc <code>p.email</code> là lỗi biên dịch. Điều này chính xác: kiểu của một kết quả truy vấn khớp thứ truy vấn đó thật sự trả về, không phải cả bảng. Một route chọn vài cột không thể vô tình tham chiếu một cột nó không lấy.</p>

<div class="callout ok">Prisma sinh kiểu từ schema của bạn: model thành kiểu (với <code>String?</code> → <code>T | null</code>), và <code>Prisma.ModelGetPayload&lt;{ select/include }&gt;</code> gõ kiểu kết quả chính xác của một truy vấn. Giữa Zod ở biên input và Prisma ở biên cơ sở dữ liệu, cả hai rìa của app đều được validate <em>và</em> có kiểu từ một nguồn duy nhất mỗi bên.</div>
<div class="note-ct">Đây là lý do ở đây không có gì tự viết một interface hàng-cơ-sở-dữ-liệu: kiểu sinh ra của Prisma client là nguồn, và một thay đổi schema cộng <code>prisma generate</code> lan khắp nơi. Helper <code>GetPayload</code> gõ kiểu chính xác hình dạng mỗi service trả về, nên một controller không thể đọc một field truy vấn chưa bao giờ chọn — sự trôi lệch mà interface trần cho phép đơn giản là không thể xảy ra.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: kiểu Prisma trên Code Lab</span><span class="lc-sub">Dùng một kiểu model và một kiểu GetPayload select.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.5 quiz ─────────────────────────── */
    {
      title: '13.5 — Chapter 13 quiz|||13.5 — Kiểm tra Chương 13',
      slug: 'typescript-13-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về biên runtime, z.infer, parse vs safeParse, schema là nguồn sự thật, và kiểu sinh từ Prisma.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on runtime validation and generated types — the answer to every "but does the data actually match?" from earlier chapters. Questions follow lesson order.</p>
<div class="callout ok">Aim for 7/8. The core idea: types are compile-time only, so Zod guards the input door and Prisma generates the database types — one source each, no drift.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về validate lúc chạy và kiểu sinh ra — câu trả lời cho mọi "nhưng dữ liệu có thật sự khớp không?" từ các chương trước. Các câu theo thứ tự bài.</p>
<div class="callout ok">Ý cốt lõi: kiểu chỉ có lúc biên dịch, nên Zod gác cửa input và Prisma sinh kiểu cơ sở dữ liệu — một nguồn mỗi bên, không trôi lệch.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why is `as T` on a fetch response not enough to trust the data?|||Vì sao `as T` trên một phản hồi fetch không đủ để tin dữ liệu?',
            options: [
              'It is enough|||Nó đủ rồi',
              'Types are erased at runtime; `as T` is an assertion, it never inspects the actual value|||Kiểu bị xoá lúc chạy; `as T` là một phép ép, nó không bao giờ soi giá trị thật',
              'as T is slow|||as T chậm',
              'Only in non-strict mode|||Chỉ trong chế độ không strict',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does z.infer<typeof UserSchema> give you?|||z.infer<typeof UserSchema> cho bạn gì?',
            options: [
              'A runtime value|||Một giá trị lúc chạy',
              'The static TypeScript type derived from the schema|||Kiểu TypeScript tĩnh suy ra từ schema',
              'A validation function|||Một hàm validate',
              'nothing|||không gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does schema.safeParse(x) return?|||schema.safeParse(x) trả về gì?',
            options: [
              'The value or throws|||Giá trị hoặc ném lỗi',
              'A discriminated union { success: true; data } | { success: false; error }|||Một discriminated union { success: true; data } | { success: false; error }',
              'Always the data|||Luôn là data',
              'A boolean|||Một boolean',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After const r = schema.safeParse(x), can you read r.data directly?|||Sau const r = schema.safeParse(x), đọc r.data trực tiếp được không?',
            options: [
              'Yes|||Được',
              "No — you must narrow on r.success first (TS18048 possibly undefined)|||Không — phải thu hẹp trên r.success trước (TS18048 possibly undefined)",
              'Only for objects|||Chỉ với object',
              'Only after parse|||Chỉ sau parse',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When should you use parse (throws) instead of safeParse?|||Khi nào nên dùng parse (ném lỗi) thay vì safeParse?',
            options: [
              'Never|||Không bao giờ',
              'When invalid input is a bug that should crash loudly (e.g. parsing your own config at startup)|||Khi input không hợp lệ là một lỗi nên sập lớn tiếng (vd phân tích config của chính bạn lúc khởi động)',
              'Only for request bodies|||Chỉ cho body request',
              'Always|||Luôn luôn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'z.coerce.number() in a schema means the field\'s input and output types are?|||z.coerce.number() trong một schema nghĩa là kiểu input và output của field là?',
            options: [
              'Both number|||Cả hai là number',
              'Input can be a string, output is a number (coerced during validation)|||Input có thể là chuỗi, output là number (ép trong lúc validate)',
              'Both string|||Cả hai là string',
              'Both any|||Cả hai là any',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A Prisma schema has fullName String?. What is the generated type of user.fullName?|||Một schema Prisma có fullName String?. Kiểu sinh ra của user.fullName là gì?',
            options: [
              'string',
              'string | null',
              'string | undefined',
              'any',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does Prisma.UserGetPayload<{ select: { id: true; username: true } }> produce?|||Prisma.UserGetPayload<{ select: { id: true; username: true } }> sinh ra gì?',
            options: [
              'The full User type|||Kiểu User đầy đủ',
              'A type with only the selected fields ({ id; username }) — reading other fields errors|||Một kiểu chỉ có các field đã chọn ({ id; username }) — đọc field khác báo lỗi',
              'An array of User|||Một mảng User',
              'any',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
