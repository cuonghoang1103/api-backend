/**
 * TypeScript — Chương 11: Gõ kiểu backend Node/Express.
 * Mọi output tsc là THẬT (tsc --strict, @types/express+node, verified). Song ngữ.
 * < > → &lt; &gt;; & → &amp;; KHÔNG backtick trần (&#96;); ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 11 — Typing a Node/Express backend|||Chương 11 — Gõ kiểu backend Node/Express',
  description: 'Gõ kiểu một API thật: handler Express với params/body có kiểu, Response<T> cho res.json, một envelope ApiResponse<T> dạng discriminated union, lớp service async an toàn null, và process.env.',
  lessons: [
    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — Typing Express handlers|||11.1 — Gõ kiểu handler Express',
      slug: 'typescript-11-1-express-handlers',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Request và Response nhận tham số kiểu: Request<Params, ResBody, ReqBody, Query>. Cách gõ kiểu req.params (luôn là chuỗi) và req.body.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Typing Express handlers</h2>
<p class="lead">Everything from the last ten chapters now meets a real framework. Express's <code>Request</code> is generic — <code>Request&lt;Params, ResBody, ReqBody, Query&gt;</code> — so you can type the URL params and the request body, and the compiler checks every read against them.</p>

<h3>Typed route params</h3>
<p>The first type argument types <code>req.params</code>. One catch worth internalising: URL params are <em>always strings</em>, even <code>/users/42</code> — the <code>42</code> arrives as <code>"42"</code>:</p>
<pre><code><span class="tok-comment">// params.ts</span>
<span class="tok-keyword">import</span> { Request, Response } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">interface</span> UserParams { id: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">getUser</span>(req: Request&lt;UserParams&gt;, res: Response) {
  <span class="tok-keyword">const</span> id: <span class="tok-keyword">string</span> = req.params.id;    <span class="tok-comment">// params are typed strings</span>
  <span class="tok-keyword">const</span> bad: <span class="tok-keyword">number</span> = req.params.id;   <span class="tok-comment">// ...and always strings</span>
  res.<span class="tok-function">json</span>({ id });
}</code></pre>
<div class="out">params.ts(6,9): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>The compiler won't let you pretend <code>req.params.id</code> is a number — because at runtime it isn't. This catches the single most common Express bug: doing math on a param without <code>Number(req.params.id)</code> first. The type is telling the truth about HTTP.</p>

<h3>Typed request body</h3>
<p>The <em>third</em> type argument types <code>req.body</code> (the second is the response body). Skip the ones you don't need with <code>{}</code>:</p>
<pre><code><span class="tok-comment">// body.ts</span>
<span class="tok-keyword">import</span> { Request, Response } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">interface</span> CreateUserBody { name: <span class="tok-keyword">string</span>; email: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">createUser</span>(req: Request&lt;{}, {}, CreateUserBody&gt;, res: Response) {
  <span class="tok-keyword">const</span> name: <span class="tok-keyword">string</span> = req.body.name;   <span class="tok-comment">// typed body</span>
  console.<span class="tok-function">log</span>(req.body.age);            <span class="tok-comment">// age is not in CreateUserBody</span>
  res.<span class="tok-function">status</span>(<span class="tok-number">201</span>).<span class="tok-function">json</span>({ name });
}</code></pre>
<div class="out">body.ts(6,24): error TS2339: Property 'age' does not exist on type 'CreateUserBody'.</div>
<p>Now <code>req.body</code> has a known shape: <code>req.body.name</code> is a typed <code>string</code>, and <code>req.body.age</code> — a field you didn't declare — is a compile error instead of a silent <code>undefined</code>. One caveat carried over from chapter 6: this types what your code <em>expects</em>; it does not validate what actually arrived over the wire. That's chapter 13's job.</p>

<div class="callout ok"><code>Request&lt;Params, ResBody, ReqBody, Query&gt;</code> — the generic slots type <code>req.params</code>, the response body, <code>req.body</code>, and <code>req.query</code>. Params and query are always strings (it's HTTP). The types describe your intent; runtime validation is separate.</div>
<div class="note-ct">Every route in this backend types its handler this way, which is why "I forgot this param is a string" bugs don't survive to runtime — and why each handler still passes its body through validation before trusting it. The type and the validator do different jobs; you need both.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: typed handlers on Code Lab</span><span class="lc-sub">Type a route's params and body with Request generics.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Gõ kiểu handler Express</h2>
<p class="lead">Mọi thứ từ mười chương qua giờ gặp một framework thật. <code>Request</code> của Express là generic — <code>Request&lt;Params, ResBody, ReqBody, Query&gt;</code> — nên bạn gõ kiểu được params trên URL và body của request, và trình biên dịch kiểm mọi lần đọc dựa trên chúng.</p>

<h3>Params route có kiểu</h3>
<p>Đối số kiểu thứ nhất gõ kiểu cho <code>req.params</code>. Một điều cần khắc cốt: params trên URL <em>luôn là chuỗi</em>, kể cả <code>/users/42</code> — số <code>42</code> đến dưới dạng <code>"42"</code>:</p>
<pre><code><span class="tok-comment">// params.ts</span>
<span class="tok-keyword">import</span> { Request, Response } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">interface</span> UserParams { id: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">getUser</span>(req: Request&lt;UserParams&gt;, res: Response) {
  <span class="tok-keyword">const</span> id: <span class="tok-keyword">string</span> = req.params.id;    <span class="tok-comment">// params có kiểu chuỗi</span>
  <span class="tok-keyword">const</span> bad: <span class="tok-keyword">number</span> = req.params.id;   <span class="tok-comment">// ...và luôn là chuỗi</span>
  res.<span class="tok-function">json</span>({ id });
}</code></pre>
<div class="out">params.ts(6,9): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>Trình biên dịch không cho bạn giả vờ <code>req.params.id</code> là số — vì lúc chạy nó không phải. Điều này bắt được lỗi Express phổ biến nhất: làm toán trên một param mà không <code>Number(req.params.id)</code> trước. Kiểu đang nói thật về HTTP.</p>

<h3>Body của request có kiểu</h3>
<p>Đối số kiểu <em>thứ ba</em> gõ kiểu cho <code>req.body</code> (thứ hai là body của response). Bỏ qua các cái không cần bằng <code>{}</code>:</p>
<pre><code><span class="tok-comment">// body.ts</span>
<span class="tok-keyword">import</span> { Request, Response } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">interface</span> CreateUserBody { name: <span class="tok-keyword">string</span>; email: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">createUser</span>(req: Request&lt;{}, {}, CreateUserBody&gt;, res: Response) {
  <span class="tok-keyword">const</span> name: <span class="tok-keyword">string</span> = req.body.name;   <span class="tok-comment">// body có kiểu</span>
  console.<span class="tok-function">log</span>(req.body.age);            <span class="tok-comment">// age không có trong CreateUserBody</span>
  res.<span class="tok-function">status</span>(<span class="tok-number">201</span>).<span class="tok-function">json</span>({ name });
}</code></pre>
<div class="out">body.ts(6,24): error TS2339: Property 'age' does not exist on type 'CreateUserBody'.</div>
<p>Giờ <code>req.body</code> có một hình dạng đã biết: <code>req.body.name</code> là một <code>string</code> có kiểu, và <code>req.body.age</code> — một field bạn không khai — là lỗi biên dịch thay vì một <code>undefined</code> âm thầm. Một cảnh báo mang từ chương 6: cái này gõ kiểu thứ code bạn <em>kỳ vọng</em>; nó không validate thứ thật sự đến qua đường truyền. Đó là việc của chương 13.</p>

<div class="callout ok"><code>Request&lt;Params, ResBody, ReqBody, Query&gt;</code> — các khe generic gõ kiểu <code>req.params</code>, body response, <code>req.body</code>, và <code>req.query</code>. Params và query luôn là chuỗi (vì là HTTP). Kiểu mô tả ý định của bạn; validate lúc chạy là việc riêng.</div>
<div class="note-ct">Mọi route trong backend này gõ kiểu handler theo cách này, đó là lý do lỗi "quên param này là chuỗi" không sống sót tới lúc chạy — và cũng là lý do mỗi handler vẫn cho body qua validate trước khi tin nó. Kiểu và bộ validate làm hai việc khác nhau; bạn cần cả hai.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: handler có kiểu trên Code Lab</span><span class="lc-sub">Gõ kiểu params và body của một route bằng Request generic.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — Typed responses & handlers|||11.2 — Response & handler có kiểu',
      slug: 'typescript-11-2-typed-responses',
      type: 'LESSON',
      description: 'Response<T> gõ kiểu cho res.json để bạn không thể gửi sai hình dạng; RequestHandler gõ kiểu cả một handler/middleware trong một chữ ký.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Typed responses &amp; handlers</h2>
<p class="lead">Typing the request is half the contract; typing the <em>response</em> is the other half. <code>Response&lt;T&gt;</code> constrains what <code>res.json</code> may send, so an incomplete or wrong-shaped payload is a compile error — the response your route promises is the response it actually returns.</p>

<h3>Response&lt;T&gt;: constrain res.json</h3>
<p>Give <code>Response</code> a type argument and <code>res.json</code> will only accept that shape:</p>
<pre><code><span class="tok-comment">// resbody.ts</span>
<span class="tok-keyword">import</span> { Request, Response } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">getUser</span>(req: Request, res: Response&lt;User&gt;) {
  res.<span class="tok-function">json</span>({ id: <span class="tok-number">1</span> });   <span class="tok-comment">// response body must be a full User</span>
}</code></pre>
<div class="out">resbody.ts(5,12): error TS2345: Argument of type '{ id: number; }' is not assignable to parameter of type 'User'.
  Property 'name' is missing in type '{ id: number; }' but required in type 'User'.</div>
<p>You promised the client a <code>User</code>, then tried to send an object missing <code>name</code> — caught. This is how you keep an API's actual output in sync with its documented contract: the response type <em>is</em> the contract, enforced on every <code>res.json</code>.</p>

<h3>RequestHandler: type the whole handler</h3>
<p>Instead of annotating <code>req</code> and <code>res</code> separately, type the function as a <code>RequestHandler</code> — its generics fill in <code>req</code> and <code>res</code> for you, and it's the same type Express middleware uses:</p>
<pre><code><span class="tok-comment">// handler.ts</span>
<span class="tok-keyword">import</span> { RequestHandler } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">interface</span> Params { id: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> getUser: RequestHandler&lt;Params, User&gt; = (req, res) =&gt; {
  <span class="tok-keyword">const</span> id = <span class="tok-function">Number</span>(req.params.id);   <span class="tok-comment">// req/res are typed from the generics</span>
  res.<span class="tok-function">json</span>({ id, name: <span class="tok-string">'Ada'</span> });
};</code></pre>
<p>Because <code>getUser</code> is typed as a <code>RequestHandler</code>, <code>req.params.id</code> and the <code>res.json</code> shape are both inferred from the generics — no per-parameter annotations. Middleware is the same type, so a logger, an auth guard, and a route handler all share one signature.</p>

<div class="callout ok"><code>Response&lt;T&gt;</code> makes <code>res.json</code> only accept <code>T</code> — the response type becomes an enforced contract. <code>RequestHandler&lt;Params, ResBody, ReqBody, Query&gt;</code> types an entire handler or middleware in one place, inferring <code>req</code> and <code>res</code>.</div>
<div class="note-ct">This backend leans on <code>RequestHandler</code> for its middleware chain — auth, rate-limit, error-wrapping all share the type — and on typed responses so a route can't accidentally ship a shape the frontend doesn't expect. When a DTO changes, both ends re-check against the same type.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: typed responses on Code Lab</span><span class="lc-sub">Constrain res.json and write a typed RequestHandler.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Response &amp; handler có kiểu</h2>
<p class="lead">Gõ kiểu request mới là một nửa khế ước; gõ kiểu <em>response</em> là nửa còn lại. <code>Response&lt;T&gt;</code> ràng buộc thứ <code>res.json</code> được gửi, nên một payload thiếu hoặc sai hình dạng là lỗi biên dịch — response route bạn hứa đúng là response nó thật sự trả.</p>

<h3>Response&lt;T&gt;: ràng buộc res.json</h3>
<p>Cho <code>Response</code> một đối số kiểu và <code>res.json</code> sẽ chỉ nhận hình dạng đó:</p>
<pre><code><span class="tok-comment">// resbody.ts</span>
<span class="tok-keyword">import</span> { Request, Response } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">getUser</span>(req: Request, res: Response&lt;User&gt;) {
  res.<span class="tok-function">json</span>({ id: <span class="tok-number">1</span> });   <span class="tok-comment">// body response phải là một User đầy đủ</span>
}</code></pre>
<div class="out">resbody.ts(5,12): error TS2345: Argument of type '{ id: number; }' is not assignable to parameter of type 'User'.
  Property 'name' is missing in type '{ id: number; }' but required in type 'User'.</div>
<p>Bạn hứa client một <code>User</code>, rồi thử gửi một object thiếu <code>name</code> — bị bắt. Đây là cách bạn giữ đầu ra thật của một API khớp với khế ước đã ghi: kiểu response <em>chính là</em> khế ước, được ép trên mọi <code>res.json</code>.</p>

<h3>RequestHandler: gõ kiểu cả handler</h3>
<p>Thay vì chú thích <code>req</code> và <code>res</code> riêng lẻ, gõ kiểu hàm là một <code>RequestHandler</code> — generic của nó điền <code>req</code> và <code>res</code> cho bạn, và đó cũng là kiểu middleware của Express dùng:</p>
<pre><code><span class="tok-comment">// handler.ts</span>
<span class="tok-keyword">import</span> { RequestHandler } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">interface</span> Params { id: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> getUser: RequestHandler&lt;Params, User&gt; = (req, res) =&gt; {
  <span class="tok-keyword">const</span> id = <span class="tok-function">Number</span>(req.params.id);   <span class="tok-comment">// req/res có kiểu từ generic</span>
  res.<span class="tok-function">json</span>({ id, name: <span class="tok-string">'Ada'</span> });
};</code></pre>
<p>Vì <code>getUser</code> được gõ kiểu là một <code>RequestHandler</code>, cả <code>req.params.id</code> lẫn hình dạng <code>res.json</code> đều được suy từ generic — không cần chú thích từng tham số. Middleware cùng kiểu, nên một logger, một auth guard, và một route handler đều chia sẻ một chữ ký.</p>

<div class="callout ok"><code>Response&lt;T&gt;</code> làm <code>res.json</code> chỉ nhận <code>T</code> — kiểu response thành một khế ước được ép. <code>RequestHandler&lt;Params, ResBody, ReqBody, Query&gt;</code> gõ kiểu cả một handler hay middleware ở một chỗ, suy ra <code>req</code> và <code>res</code>.</div>
<div class="note-ct">Backend này dựa vào <code>RequestHandler</code> cho chuỗi middleware — auth, rate-limit, bọc lỗi đều chung kiểu — và dựa vào response có kiểu để một route không vô tình ship một hình dạng frontend không mong đợi. Khi một DTO đổi, cả hai đầu kiểm lại dựa trên cùng một kiểu.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: response có kiểu trên Code Lab</span><span class="lc-sub">Ràng buộc res.json và viết một RequestHandler có kiểu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.3 ─────────────────────────── */
    {
      title: '11.3 — A typed API envelope & errors|||11.3 — Envelope API & lỗi có kiểu',
      slug: 'typescript-11-3-api-envelope-errors',
      type: 'LESSON',
      description: 'Một discriminated union ApiResponse<T> = thành công | lỗi ép mọi bên gọi xử lý cả hai nhánh; một lớp AppError mang statusCode có kiểu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>A typed API envelope &amp; errors</h2>
<p class="lead">A consistent response shape — "success with data, or failure with an error" — is best modelled as a discriminated union (chapter 5, now applied). The <code>ok</code> flag is the discriminant, and the compiler forces every consumer to check it before touching <code>data</code>.</p>

<h3>ApiResponse&lt;T&gt;: success or failure</h3>
<p>Two variants sharing an <code>ok</code> literal. You can only read <code>data</code> after narrowing to the success branch:</p>
<pre><code><span class="tok-comment">// envelope.ts</span>
<span class="tok-keyword">type</span> ApiResponse&lt;T&gt; =
  | { ok: <span class="tok-keyword">true</span>; data: T }
  | { ok: <span class="tok-keyword">false</span>; error: <span class="tok-keyword">string</span> };

<span class="tok-keyword">function</span> <span class="tok-function">render</span>(res: ApiResponse&lt;{ id: <span class="tok-keyword">number</span> }&gt;): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">if</span> (res.ok) {
    <span class="tok-keyword">return</span> <span class="tok-function">String</span>(res.data.id);   <span class="tok-comment">// narrowed to the success branch</span>
  }
  <span class="tok-keyword">return</span> res.data.id;             <span class="tok-comment">// no data on the error branch</span>
}</code></pre>
<div class="out">envelope.ts(10,14): error TS2339: Property 'data' does not exist on type '{ ok: false; error: string; }'.</div>
<p>Inside <code>if (res.ok)</code>, TypeScript knows it's the success variant, so <code>res.data</code> is available. After it, the only possibility is the error variant, which has <code>error</code> but no <code>data</code> — so reading <code>res.data</code> there is a compile error. The union makes "handle the error case" mandatory, not optional.</p>

<h3>Typed errors with a class</h3>
<p>A custom <code>Error</code> subclass carries typed extra fields — a status code your error handler can read without guessing:</p>
<pre><code><span class="tok-comment">// apperror.ts</span>
<span class="tok-keyword">class</span> AppError <span class="tok-keyword">extends</span> Error {
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">public</span> statusCode: <span class="tok-keyword">number</span>, message: <span class="tok-keyword">string</span>) {
    <span class="tok-keyword">super</span>(message);
  }
}
<span class="tok-keyword">const</span> e = <span class="tok-keyword">new</span> <span class="tok-function">AppError</span>(<span class="tok-number">500</span>, <span class="tok-string">'Boom'</span>);
<span class="tok-keyword">const</span> s: <span class="tok-keyword">string</span> = e.statusCode;   <span class="tok-comment">// statusCode is a number</span></code></pre>
<div class="out">apperror.ts(9,7): error TS2322: Type 'number' is not assignable to type 'string'.</div>
<p>The <code>public statusCode: number</code> parameter property both declares and assigns the field (chapter 14's class shortcut), so <code>e.statusCode</code> is a typed <code>number</code> everywhere. Your central error middleware can read <code>err.statusCode</code> with confidence instead of <code>(err as any).statusCode</code>.</p>

<div class="callout ok">Model an API response as a discriminated union <code>{ ok: true; data } | { ok: false; error }</code> — the <code>ok</code> flag forces callers to handle failure before reaching <code>data</code>. Carry structured error info in a typed <code>Error</code> subclass so your handler reads real fields, not casts.</div>
<div class="note-ct">This project wraps responses in exactly this success/error envelope, and its <code>AppError</code>-style class lets one error middleware map any thrown error to the right HTTP status by reading a typed <code>statusCode</code> — the discriminated-union and typed-error patterns from earlier chapters, now load-bearing in production code.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: API envelope on Code Lab</span><span class="lc-sub">Build an ApiResponse union and a typed error class.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Envelope API &amp; lỗi có kiểu</h2>
<p class="lead">Một hình dạng response nhất quán — "thành công kèm data, hoặc thất bại kèm lỗi" — được mô hình hoá tốt nhất bằng một discriminated union (chương 5, giờ áp dụng). Cờ <code>ok</code> là discriminant, và trình biên dịch ép mọi bên tiêu thụ kiểm nó trước khi đụng vào <code>data</code>.</p>

<h3>ApiResponse&lt;T&gt;: thành công hay thất bại</h3>
<p>Hai biến thể chia sẻ một literal <code>ok</code>. Bạn chỉ đọc được <code>data</code> sau khi thu hẹp về nhánh thành công:</p>
<pre><code><span class="tok-comment">// envelope.ts</span>
<span class="tok-keyword">type</span> ApiResponse&lt;T&gt; =
  | { ok: <span class="tok-keyword">true</span>; data: T }
  | { ok: <span class="tok-keyword">false</span>; error: <span class="tok-keyword">string</span> };

<span class="tok-keyword">function</span> <span class="tok-function">render</span>(res: ApiResponse&lt;{ id: <span class="tok-keyword">number</span> }&gt;): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">if</span> (res.ok) {
    <span class="tok-keyword">return</span> <span class="tok-function">String</span>(res.data.id);   <span class="tok-comment">// đã thu hẹp về nhánh thành công</span>
  }
  <span class="tok-keyword">return</span> res.data.id;             <span class="tok-comment">// nhánh lỗi không có data</span>
}</code></pre>
<div class="out">envelope.ts(10,14): error TS2339: Property 'data' does not exist on type '{ ok: false; error: string; }'.</div>
<p>Bên trong <code>if (res.ok)</code>, TypeScript biết đó là biến thể thành công, nên <code>res.data</code> có sẵn. Sau nó, khả năng duy nhất là biến thể lỗi, vốn có <code>error</code> nhưng không <code>data</code> — nên đọc <code>res.data</code> ở đó là lỗi biên dịch. Union làm việc "xử lý trường hợp lỗi" thành bắt buộc, không phải tuỳ chọn.</p>

<h3>Lỗi có kiểu bằng một class</h3>
<p>Một lớp con của <code>Error</code> mang các field phụ có kiểu — một mã trạng thái mà error handler của bạn đọc được không cần đoán:</p>
<pre><code><span class="tok-comment">// apperror.ts</span>
<span class="tok-keyword">class</span> AppError <span class="tok-keyword">extends</span> Error {
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">public</span> statusCode: <span class="tok-keyword">number</span>, message: <span class="tok-keyword">string</span>) {
    <span class="tok-keyword">super</span>(message);
  }
}
<span class="tok-keyword">const</span> e = <span class="tok-keyword">new</span> <span class="tok-function">AppError</span>(<span class="tok-number">500</span>, <span class="tok-string">'Boom'</span>);
<span class="tok-keyword">const</span> s: <span class="tok-keyword">string</span> = e.statusCode;   <span class="tok-comment">// statusCode là number</span></code></pre>
<div class="out">apperror.ts(9,7): error TS2322: Type 'number' is not assignable to type 'string'.</div>
<p>Tham số <code>public statusCode: number</code> vừa khai vừa gán field (lối tắt class của chương 14), nên <code>e.statusCode</code> là một <code>number</code> có kiểu ở khắp nơi. Middleware lỗi trung tâm của bạn đọc <code>err.statusCode</code> tự tin thay vì <code>(err as any).statusCode</code>.</p>

<div class="callout ok">Mô hình một response API như một discriminated union <code>{ ok: true; data } | { ok: false; error }</code> — cờ <code>ok</code> ép bên gọi xử lý thất bại trước khi chạm <code>data</code>. Mang thông tin lỗi có cấu trúc trong một lớp con của <code>Error</code> có kiểu để handler đọc field thật, không phải ép kiểu.</div>
<div class="note-ct">Dự án này bọc response trong đúng envelope thành-công/lỗi này, và lớp kiểu <code>AppError</code> của nó cho một middleware lỗi ánh xạ bất kỳ lỗi nào ném ra sang đúng HTTP status bằng cách đọc một <code>statusCode</code> có kiểu — pattern discriminated-union và lỗi-có-kiểu từ các chương trước, giờ gánh vai trong code production.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: envelope API trên Code Lab</span><span class="lc-sub">Dựng một union ApiResponse và một lớp lỗi có kiểu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — End-to-end safety: services & config|||11.4 — An toàn đầu-cuối: service & cấu hình',
      slug: 'typescript-11-4-services-and-config',
      type: 'LESSON',
      description: 'Lớp service async trả Promise<User | null> ép route xử lý "không tìm thấy"; và process.env là string | undefined, nên phải phân tích cấu hình cẩn thận.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>End-to-end safety: services &amp; config</h2>
<p class="lead">The types pay off most at the two edges of a backend: the data layer (where a lookup can miss) and configuration (where everything arrives as a string). Getting both right means "not found" and "bad config" become compile errors, not 500s.</p>

<h3>Async services return honest types</h3>
<p>A lookup that might not find a row should say so — <code>Promise&lt;User | null&gt;</code>. The <code>| null</code> then forces every caller to handle the miss:</p>
<pre><code><span class="tok-comment">// service.ts</span>
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">findUser</span>(id: <span class="tok-keyword">number</span>): <span class="tok-keyword">Promise</span>&lt;User | <span class="tok-keyword">null</span>&gt; {
  <span class="tok-keyword">return</span> id === <span class="tok-number">1</span> ? { id, name: <span class="tok-string">'Ada'</span> } : <span class="tok-keyword">null</span>;
}
<span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">run</span>() {
  <span class="tok-keyword">const</span> u = <span class="tok-keyword">await</span> <span class="tok-function">findUser</span>(<span class="tok-number">1</span>);
  console.<span class="tok-function">log</span>(u.name);   <span class="tok-comment">// findUser may return null</span>
}</code></pre>
<div class="out">service.ts(8,15): error TS18047: 'u' is possibly 'null'.</div>
<p>After <code>await</code>, <code>u</code> is <code>User | null</code>, so <code>u.name</code> is rejected until you narrow (<code>if (!u) return res.status(404)…</code>). This is the whole point of the strict-null flag from chapter 9, applied where it matters most: the compiler makes "handle the 404" impossible to forget. A service that returned <code>Promise&lt;User&gt;</code> and threw on miss would lose this — the honest <code>| null</code> is what carries the missing case to the caller.</p>

<h3>process.env is <code>string | undefined</code></h3>
<p>Every environment variable is a string that might not be set. TypeScript types <code>process.env.X</code> as <code>string | undefined</code>, so you can't feed it straight into a number:</p>
<pre><code><span class="tok-comment">// env.ts</span>
<span class="tok-keyword">const</span> port: <span class="tok-keyword">number</span> = process.env.PORT;   <span class="tok-comment">// env values are string | undefined</span></code></pre>
<div class="out">env.ts(2,7): error TS2322: Type 'string | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.</div>
<p>The fix forces you to confront both problems at once — the string, and the maybe-missing: <code>const port = Number(process.env.PORT ?? 3000);</code>. Centralising this into a typed <code>config</code> object, parsed and validated once at startup, is the pattern — it turns "the env var was missing in production" from a mystery crash into a loud failure at boot.</p>

<div class="callout ok">Two edges, two habits: return <code>Promise&lt;T | null&gt;</code> from lookups so callers must handle the miss, and treat <code>process.env.X</code> as <code>string | undefined</code> — parse and default it once. Both turn a class of runtime crash into a compile error.</div>
<div class="note-ct">This backend's services return nullable types for lookups (so every route handles the not-found branch) and read all configuration through a single parsed config module rather than sprinkling <code>process.env</code> across the code — the exact discipline that stops a missing env var from surfacing as a 500 three requests later.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: services &amp; config on Code Lab</span><span class="lc-sub">Handle a nullable lookup and parse an env var safely.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>An toàn đầu-cuối: service &amp; cấu hình</h2>
<p class="lead">Kiểu có lời nhất ở hai rìa của một backend: lớp dữ liệu (nơi một truy vấn có thể hụt) và cấu hình (nơi mọi thứ đến dưới dạng chuỗi). Làm đúng cả hai nghĩa là "không tìm thấy" và "cấu hình sai" trở thành lỗi biên dịch, không phải 500.</p>

<h3>Service async trả kiểu thành thật</h3>
<p>Một truy vấn có thể không tìm thấy hàng nào thì nên nói vậy — <code>Promise&lt;User | null&gt;</code>. Phần <code>| null</code> khi đó ép mọi bên gọi xử lý trường hợp hụt:</p>
<pre><code><span class="tok-comment">// service.ts</span>
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">findUser</span>(id: <span class="tok-keyword">number</span>): <span class="tok-keyword">Promise</span>&lt;User | <span class="tok-keyword">null</span>&gt; {
  <span class="tok-keyword">return</span> id === <span class="tok-number">1</span> ? { id, name: <span class="tok-string">'Ada'</span> } : <span class="tok-keyword">null</span>;
}
<span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">run</span>() {
  <span class="tok-keyword">const</span> u = <span class="tok-keyword">await</span> <span class="tok-function">findUser</span>(<span class="tok-number">1</span>);
  console.<span class="tok-function">log</span>(u.name);   <span class="tok-comment">// findUser có thể trả null</span>
}</code></pre>
<div class="out">service.ts(8,15): error TS18047: 'u' is possibly 'null'.</div>
<p>Sau <code>await</code>, <code>u</code> là <code>User | null</code>, nên <code>u.name</code> bị từ chối tới khi bạn thu hẹp (<code>if (!u) return res.status(404)…</code>). Đây đúng là điểm mấu chốt của cờ strict-null ở chương 9, áp dụng nơi quan trọng nhất: trình biên dịch làm việc "xử lý 404" thành không thể quên. Một service trả <code>Promise&lt;User&gt;</code> và ném khi hụt sẽ mất điều này — cái <code>| null</code> thành thật mới mang trường hợp vắng tới bên gọi.</p>

<h3>process.env là <code>string | undefined</code></h3>
<p>Mọi biến môi trường là một chuỗi có thể chưa được đặt. TypeScript gõ kiểu <code>process.env.X</code> là <code>string | undefined</code>, nên bạn không thể đưa thẳng nó vào một số:</p>
<pre><code><span class="tok-comment">// env.ts</span>
<span class="tok-keyword">const</span> port: <span class="tok-keyword">number</span> = process.env.PORT;   <span class="tok-comment">// giá trị env là string | undefined</span></code></pre>
<div class="out">env.ts(2,7): error TS2322: Type 'string | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.</div>
<p>Cách sửa ép bạn đối mặt cả hai vấn đề một lúc — cái chuỗi, và cái có-thể-vắng: <code>const port = Number(process.env.PORT ?? 3000);</code>. Gom việc này vào một object <code>config</code> có kiểu, phân tích và validate một lần lúc khởi động, là pattern — nó biến "biến env bị thiếu trên production" từ một cú sập bí ẩn thành một thất bại lớn tiếng ngay lúc khởi động.</p>

<div class="callout ok">Hai rìa, hai thói quen: trả <code>Promise&lt;T | null&gt;</code> từ các truy vấn để bên gọi buộc phải xử lý hụt, và coi <code>process.env.X</code> là <code>string | undefined</code> — phân tích và đặt mặc định một lần. Cả hai biến một lớp cú sập lúc chạy thành lỗi biên dịch.</div>
<div class="note-ct">Các service của backend này trả kiểu nullable cho truy vấn (để mọi route xử lý nhánh không-tìm-thấy) và đọc mọi cấu hình qua một module config đã phân tích duy nhất thay vì rải <code>process.env</code> khắp code — đúng kỷ luật ngăn một biến env thiếu hiện thành một 500 ba request sau đó.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: service &amp; cấu hình trên Code Lab</span><span class="lc-sub">Xử lý một truy vấn nullable và phân tích một biến env an toàn.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.5 quiz ─────────────────────────── */
    {
      title: '11.5 — Chapter 11 quiz|||11.5 — Kiểm tra Chương 11',
      slug: 'typescript-11-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về Request/Response generic, req.params/body, Response<T>, RequestHandler, envelope ApiResponse, service nullable và process.env.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on typing a real backend — where the type system stops being abstract and starts catching production bugs. Questions follow lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that save the most pain: params/query are always strings (11.1), and <code>process.env.X</code> is <code>string | undefined</code> (11.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về gõ kiểu một backend thật — nơi hệ thống kiểu thôi trừu tượng và bắt đầu bắt lỗi production. Các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu tránh đau nhất: params/query luôn là chuỗi (11.1), và <code>process.env.X</code> là <code>string | undefined</code> (11.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'In Request<Params, ResBody, ReqBody, Query>, which slot types req.body?|||Trong Request<Params, ResBody, ReqBody, Query>, khe nào gõ kiểu req.body?',
            options: [
              'The 1st (Params)|||Thứ 1 (Params)',
              'The 3rd (ReqBody)|||Thứ 3 (ReqBody)',
              'The 2nd (ResBody)|||Thứ 2 (ResBody)',
              'The 4th (Query)|||Thứ 4 (Query)',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What type does req.params.id have, even for the URL /users/42?|||req.params.id có kiểu gì, kể cả với URL /users/42?',
            options: [
              'number',
              'string — URL params are always strings|||string — params trên URL luôn là chuỗi',
              'number | string',
              'any',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With res: Response<User>, calling res.json({ id: 1 }) (no name) gives?|||Với res: Response<User>, gọi res.json({ id: 1 }) (thiếu name) cho ra?',
            options: [
              'No error|||Không lỗi',
              "TS2345: property 'name' is missing — res.json must send a full User|||TS2345: thiếu 'name' — res.json phải gửi một User đầy đủ",
              'It adds name automatically|||Nó tự thêm name',
              'A runtime error only|||Chỉ lỗi lúc chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is RequestHandler used for?|||RequestHandler dùng để làm gì?',
            options: [
              'Only for error handlers|||Chỉ cho error handler',
              'Typing an entire handler or middleware in one signature, inferring req and res|||Gõ kiểu cả một handler hay middleware trong một chữ ký, suy ra req và res',
              'Validating the request body at runtime|||Validate body request lúc chạy',
              'Parsing JSON|||Phân tích JSON',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'For type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string }, when can you read res.data?|||Với type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string }, khi nào đọc được res.data?',
            options: [
              'Always|||Luôn luôn',
              'Only after narrowing with if (res.ok) to the success branch|||Chỉ sau khi thu hẹp bằng if (res.ok) về nhánh thành công',
              'Never|||Không bao giờ',
              'Only on the error branch|||Chỉ trên nhánh lỗi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A service returns Promise<User | null>. After const u = await service(), can you use u.name directly?|||Một service trả Promise<User | null>. Sau const u = await service(), dùng u.name trực tiếp được không?',
            options: [
              'Yes|||Được',
              "No — TS18047 'u' is possibly 'null'; you must narrow first|||Không — TS18047 'u' is possibly 'null'; phải thu hẹp trước",
              'Only inside async functions|||Chỉ trong hàm async',
              'Only if User has a name|||Chỉ khi User có name',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What type is process.env.PORT?|||process.env.PORT có kiểu gì?',
            options: [
              'number',
              'string | undefined',
              'string',
              'any',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why return Promise<User | null> instead of Promise<User> from a lookup?|||Vì sao trả Promise<User | null> thay vì Promise<User> từ một truy vấn?',
            options: [
              'It is faster|||Nó nhanh hơn',
              'The | null forces every caller to handle the not-found case at compile time|||Cái | null ép mọi bên gọi xử lý trường hợp không-tìm-thấy lúc biên dịch',
              'null is required by Express|||Express đòi null',
              'It avoids using async|||Nó tránh dùng async',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
