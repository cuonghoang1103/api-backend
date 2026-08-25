/**
 * TypeScript — Chương 16 (CUỐI): Kiến trúc & tư duy type-driven.
 * Mọi output tsc là THẬT (tsc --strict, verified). Song ngữ .ml-en/.ml-vi.
 * < > → &lt; &gt;; & → &amp;; KHÔNG backtick trần (&#96;); ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 16 — Architecture & type-driven design|||Chương 16 — Kiến trúc & tư duy type-driven',
  description: 'Chương cuối: thiết kế để trạng thái sai không biểu diễn được, dùng đúng any/unknown/never, tổ chức kiểu quanh một nguồn sự thật, và bức tranh toàn cảnh — validate tại biên, tin bên trong.',
  lessons: [
    /* ─────────────────────────── 16.1 ─────────────────────────── */
    {
      title: '16.1 — Make illegal states unrepresentable|||16.1 — Làm trạng thái sai không biểu diễn được',
      slug: 'typescript-16-1-illegal-states',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tư duy type-driven: thiết kế kiểu sao cho tổ hợp sai (vừa loading vừa có lỗi) đơn giản là không viết ra được — discriminated union thay cho object phẳng với cờ tuỳ chọn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1</span>
<h2>Make illegal states unrepresentable</h2>
<p class="lead">The highest form of type safety isn't catching bad values — it's designing types so bad <em>combinations</em> can't be written at all. When your model only allows valid states, whole categories of bugs stop existing, and you stop writing defensive checks for cases that can't happen.</p>

<h3>The flat-object trap</h3>
<p>A common shape for "loading / loaded / failed" is a flat object with optional flags: <code>{ loading: boolean; data?: string; error?: string }</code>. The problem: it permits nonsense — <code>loading: true</code> <em>with</em> an <code>error</code>, or <code>data</code> <em>and</em> <code>error</code> at once. Every consumer must defensively guard combinations that should never occur.</p>

<h3>A discriminated union allows only the valid states</h3>
<p>Model it as a discriminated union instead (chapter 5): each state lists exactly the fields it has, and the <code>status</code> discriminant makes them mutually exclusive:</p>
<pre><code><span class="tok-comment">// states.ts</span>
<span class="tok-keyword">type</span> State =
  | { status: <span class="tok-string">'loading'</span> }
  | { status: <span class="tok-string">'success'</span>; data: <span class="tok-keyword">string</span> }
  | { status: <span class="tok-string">'error'</span>; error: <span class="tok-keyword">string</span> };
<span class="tok-keyword">function</span> <span class="tok-function">render</span>(s: State): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">if</span> (s.status === <span class="tok-string">'success'</span>) <span class="tok-keyword">return</span> s.data;
  <span class="tok-keyword">if</span> (s.status === <span class="tok-string">'error'</span>) <span class="tok-keyword">return</span> s.error;
  <span class="tok-keyword">return</span> s.data;   <span class="tok-comment">// the loading state has no data</span>
}</code></pre>
<div class="out">states.ts(9,12): error TS2339: Property 'data' does not exist on type '{ status: "loading"; }'.</div>
<p>Now <code>data</code> only exists in the <code>success</code> state, <code>error</code> only in the <code>error</code> state — and "loading with data" is simply not a type you can construct. The compiler even caught the leftover <code>s.data</code> in the loading branch. You didn't validate anything at runtime; you made the invalid state <em>impossible to represent</em>, which is stronger.</p>

<div class="callout ok">Type-driven design: instead of allowing bad states and guarding against them, shape the types so bad states can't be written. A discriminated union that lists exactly the fields each variant has beats a flat object with optional flags every time — the illegal combinations stop existing.</div>
<div class="note-ct">This is the principle behind the discriminated unions all through this course — the content-type union, the API envelope, the loading states in the frontend. Each one turns "did I handle every case, and can these fields even coexist?" from a runtime worry into a shape the compiler guarantees. Designing the type well is cheaper than testing the bugs it prevents.</div>
<h3>From flat flags to a state union</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The flat object allows nonsense</span><span class="lz-d"><code>{ loading: boolean; data?: T; error?: string }</code> has eight combinations and only three are real. <code>loading: true</code> with an <code>error</code> set is representable, so someone will produce it.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Every consumer pays for the extra states</span><span class="lz-d">Each one writes its own guard, and the guards disagree. This is where "it shows the spinner and the error at once" comes from.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Name the states instead</span><span class="lz-d"><code>{ status: 'loading' } | { status: 'ok', data: T } | { status: 'error', message: string }</code>. Three variants, and the fields exist only where they mean something.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Now the compiler enforces the guards</span><span class="lz-d">Reading <code>data</code> outside the <code>ok</code> branch is an error, not a convention. The impossible states are not merely discouraged — they cannot be written down.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — modelling a state union and then flattening it at the boundary.</strong> The union survives right up to the API response, where someone writes <code>res.json({ loading: false, data: result.data, error: result.message })</code> to keep an existing client working — and every consumer on the other side is back to the eight-combination guessing game, with no compiler to help. The guarantee is only as strong as the narrowest point it passes through. Keep the discriminated shape across the wire (the <code>ok: true / ok: false</code> envelope from chapter 11 is exactly this), so the client can narrow instead of inferring.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: illegal states on Code Lab</span><span class="lc-sub">Refactor a flag-object into a discriminated union.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1</span>
<h2>Làm trạng thái sai không biểu diễn được</h2>
<p class="lead">Hình thức cao nhất của an toàn kiểu không phải bắt giá trị xấu — mà là thiết kế kiểu sao cho <em>tổ hợp</em> xấu không viết ra được chút nào. Khi mô hình của bạn chỉ cho phép trạng thái hợp lệ, cả loại lỗi thôi tồn tại, và bạn thôi viết các phép kiểm phòng thủ cho những trường hợp không thể xảy ra.</p>

<h3>Bẫy object phẳng</h3>
<p>Một hình dạng phổ biến cho "loading / đã tải / thất bại" là một object phẳng với cờ tuỳ chọn: <code>{ loading: boolean; data?: string; error?: string }</code>. Vấn đề: nó cho phép điều vô nghĩa — <code>loading: true</code> <em>kèm</em> một <code>error</code>, hoặc <code>data</code> <em>và</em> <code>error</code> cùng lúc. Mọi bên tiêu thụ phải phòng thủ gác các tổ hợp lẽ ra không bao giờ xảy ra.</p>

<h3>Một discriminated union chỉ cho các trạng thái hợp lệ</h3>
<p>Hãy mô hình nó thành một discriminated union (chương 5): mỗi trạng thái liệt kê đúng các field nó có, và discriminant <code>status</code> làm chúng loại trừ lẫn nhau:</p>
<pre><code><span class="tok-comment">// states.ts</span>
<span class="tok-keyword">type</span> State =
  | { status: <span class="tok-string">'loading'</span> }
  | { status: <span class="tok-string">'success'</span>; data: <span class="tok-keyword">string</span> }
  | { status: <span class="tok-string">'error'</span>; error: <span class="tok-keyword">string</span> };
<span class="tok-keyword">function</span> <span class="tok-function">render</span>(s: State): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">if</span> (s.status === <span class="tok-string">'success'</span>) <span class="tok-keyword">return</span> s.data;
  <span class="tok-keyword">if</span> (s.status === <span class="tok-string">'error'</span>) <span class="tok-keyword">return</span> s.error;
  <span class="tok-keyword">return</span> s.data;   <span class="tok-comment">// trạng thái loading không có data</span>
}</code></pre>
<div class="out">states.ts(9,12): error TS2339: Property 'data' does not exist on type '{ status: "loading"; }'.</div>
<p>Giờ <code>data</code> chỉ tồn tại trong trạng thái <code>success</code>, <code>error</code> chỉ trong trạng thái <code>error</code> — và "loading kèm data" đơn giản không phải một kiểu bạn dựng được. Trình biên dịch còn bắt luôn <code>s.data</code> sót lại ở nhánh loading. Bạn không validate gì lúc chạy; bạn làm trạng thái không hợp lệ <em>không thể biểu diễn</em>, thứ mạnh hơn.</p>

<div class="callout ok">Tư duy type-driven: thay vì cho phép trạng thái xấu rồi gác chúng, tạo hình kiểu sao cho trạng thái xấu không viết ra được. Một discriminated union liệt kê đúng các field mỗi biến thể có luôn thắng một object phẳng với cờ tuỳ chọn — các tổ hợp không hợp lệ thôi tồn tại.</div>
<div class="note-ct">Đây là nguyên tắc đằng sau các discriminated union xuyên suốt khoá này — union kiểu-nội-dung, envelope API, các trạng thái loading ở frontend. Mỗi cái biến "mình đã xử lý mọi case chưa, và các field này có thể cùng tồn tại không?" từ một nỗi lo lúc chạy thành một hình dạng trình biên dịch bảo đảm. Thiết kế kiểu cho tốt rẻ hơn test các lỗi nó ngăn.</div>
<h3>Từ cờ phẳng sang một union trạng thái</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Object phẳng cho phép thứ vô nghĩa</span><span class="lz-d"><code>{ loading: boolean; data?: T; error?: string }</code> có tám tổ hợp mà chỉ ba cái là thật. <code>loading: true</code> kèm một <code>error</code> là biểu diễn được, nên rồi sẽ có người tạo ra nó.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mọi chỗ tiêu thụ phải trả giá cho các trạng thái thừa</span><span class="lz-d">Mỗi chỗ tự viết chốt chặn riêng, và các chốt ấy bất đồng nhau. Đây là nguồn gốc của cảnh "vừa hiện vòng quay vừa hiện lỗi".</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hãy gọi tên các trạng thái</span><span class="lz-d"><code>{ status: 'loading' } | { status: 'ok', data: T } | { status: 'error', message: string }</code>. Ba biến thể, và các field chỉ tồn tại ở nơi chúng có nghĩa.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Giờ trình biên dịch cưỡng chế các chốt chặn</span><span class="lz-d">Đọc <code>data</code> ngoài nhánh <code>ok</code> là lỗi, không phải quy ước. Trạng thái bất khả không chỉ bị khuyên tránh — nó không viết ra được.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — mô hình hoá một union trạng thái rồi làm phẳng nó ở biên.</strong> Union sống nguyên vẹn cho tới tận phản hồi API, nơi ai đó viết <code>res.json({ loading: false, data: result.data, error: result.message })</code> để giữ một client cũ chạy được — và mọi chỗ tiêu thụ phía bên kia quay lại trò đoán tám tổ hợp, không còn trình biên dịch nào giúp. Bảo đảm chỉ mạnh bằng điểm hẹp nhất mà nó đi qua. Hãy giữ dáng discriminated qua đường truyền (chiếc phong bì <code>ok: true / ok: false</code> ở chương 11 đúng là cái này), để client thu hẹp thay vì suy đoán.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: trạng thái sai trên Code Lab</span><span class="lc-sub">Tái cấu trúc một object-cờ thành một discriminated union.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.2 ─────────────────────────── */
    {
      title: '16.2 — any, unknown & never|||16.2 — any, unknown & never',
      slug: 'typescript-16-2-any-unknown-never',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba kiểu đặc biệt và khi nào dùng: any tắt kiểm (tránh); unknown giữ giá trị nhưng ép kiểm trước khi dùng (an toàn); never là kiểu rỗng, dùng cho exhaustiveness.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2</span>
<h2>any, unknown &amp; never</h2>
<p class="lead">Three special types sit at the edges of the system, and knowing which to reach for is a mark of fluency. <code>any</code> turns checking off (avoid it), <code>unknown</code> holds anything but forces you to check before use (the safe top type), and <code>never</code> is the empty type (nothing is one).</p>

<h3>unknown: anything, but prove it first</h3>
<p><code>unknown</code> is the type-safe counterpart to <code>any</code>. It accepts any value — but you can't <em>do</em> anything with it until you narrow:</p>
<pre><code><span class="tok-comment">// unknown.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">handle</span>(input: <span class="tok-keyword">unknown</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">return</span> input.<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// unknown must be narrowed first</span>
}</code></pre>
<div class="out">unknown.ts(3,10): error TS18046: 'input' is of type 'unknown'.</div>
<p>The fix is a guard — <code>if (typeof input === 'string') return input.toUpperCase();</code>. This is the right type for anything coming from outside your control: JSON, a caught <code>error</code>, a third-party callback. It says "I'll hold whatever you give me, but I refuse to let you use it blindly."</p>

<h3>never: the empty type, for exhaustiveness</h3>
<p><code>never</code> is the type with no values — nothing is assignable to it:</p>
<pre><code><span class="tok-comment">// never.ts</span>
<span class="tok-keyword">const</span> n: <span class="tok-keyword">never</span> = <span class="tok-number">5</span>;   <span class="tok-comment">// no value is assignable to never</span></code></pre>
<div class="out">never.ts(2,7): error TS2322: Type '5' is not assignable to type 'never'.</div>
<p>That looks useless until you remember the exhaustiveness check from chapter 5: assigning the "impossible" leftover to a <code>never</code> variable in a <code>switch</code>'s default makes the compiler prove you handled every case. It's also the return type of a function that never returns (one that always throws).</p>

<h3>any: the escape hatch that removes the net</h3>
<p><code>any</code> switches off type-checking entirely — and unlike the two above, it fails <em>silently</em>:</p>
<pre><code><span class="tok-comment">// anytrap.ts</span>
<span class="tok-keyword">const</span> x: <span class="tok-keyword">any</span> = <span class="tok-string">'hello'</span>;
x.foo.bar.<span class="tok-function">baz</span>();   <span class="tok-comment">// any turns off all checking — no error, crashes at runtime</span></code></pre>
<div class="out">(no output — exit code 0)</div>
<p>This compiles with zero complaints and explodes at runtime — the exact failure TypeScript exists to prevent, re-enabled by one keyword. Reach for <code>any</code> only as a deliberate, temporary escape hatch; where you're tempted to use it for "some external value", use <code>unknown</code> instead and narrow. Every <code>any</code> is a hole in the net.</p>

<div class="callout ok">Pick deliberately: <code>unknown</code> for external/unknown values (holds anything, forces a check — the safe default); <code>never</code> for "impossible" (exhaustiveness checks, never-returning functions); <code>any</code> almost never (it silently disables checking). When tempted by <code>any</code>, try <code>unknown</code> first.</div>
<div class="note-ct">This is the "know when to use any, unknown or never" the course promised. The discipline here: external boundaries take <code>unknown</code> and get validated (chapter 13); switch-defaults use the <code>never</code> exhaustiveness trick; and <code>any</code> is treated as a code smell to be justified, not a convenience — which is a large part of why the strict pipeline actually catches things.</div>
<h3>Three types that look similar and behave oppositely</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">any</span><span class="lz-t">Every value in, every operation allowed</span><span class="lz-d">Turns checking off in both directions, and it spreads: anything derived from an <code>any</code> is also unchecked.</span></div>
<div class="lz-node"><span class="lz-k">unknown</span><span class="lz-t">Every value in, no operation allowed</span><span class="lz-d">The honest top type. You must narrow before use, so the check is deferred to where the evidence exists, not removed.</span></div>
<div class="lz-node"><span class="lz-k">never</span><span class="lz-t">No value in at all</span><span class="lz-d">The empty type. It is what a function that always throws returns, and what an exhausted union narrows to.</span></div>
<div class="lz-node"><span class="lz-k">The rule</span><span class="lz-t">unknown at the edges, never at the ends</span><span class="lz-d">Accept <code>unknown</code> from outside and prove what it is; use <code>never</code> to assert a branch is unreachable. <code>any</code> is for a migration you intend to finish.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — one <code>any</code> silently disables checking for everything downstream of it.</strong> <code>const cfg: any = JSON.parse(raw)</code> and then <code>const port = cfg.server.port</code> makes <code>port</code> an <code>any</code> too; pass it to a function typed <code>(p: number)</code> and there is no error, because <code>any</code> is assignable to everything. The hole is not the one line you wrote — it is every expression that touched it, and it crosses module boundaries through return types. That is why <code>unknown</code> is the right default at a boundary: it propagates the <em>need to check</em> instead of propagating permission. Turn on <code>noImplicitAny</code> so the accidental ones are errors, and grep for the deliberate ones periodically.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: any/unknown/never on Code Lab</span><span class="lc-sub">Replace an any with a narrowed unknown.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2</span>
<h2>any, unknown &amp; never</h2>
<p class="lead">Ba kiểu đặc biệt nằm ở các rìa của hệ thống, và biết chọn cái nào là dấu hiệu của sự thành thạo. <code>any</code> tắt kiểm (tránh nó), <code>unknown</code> giữ mọi thứ nhưng ép bạn kiểm trước khi dùng (top type an toàn), và <code>never</code> là kiểu rỗng (không gì là nó).</p>

<h3>unknown: bất cứ gì, nhưng chứng minh trước đã</h3>
<p><code>unknown</code> là bản an-toàn-kiểu của <code>any</code>. Nó nhận mọi giá trị — nhưng bạn không <em>làm</em> được gì với nó tới khi thu hẹp:</p>
<pre><code><span class="tok-comment">// unknown.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">handle</span>(input: <span class="tok-keyword">unknown</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">return</span> input.<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// unknown phải được thu hẹp trước</span>
}</code></pre>
<div class="out">unknown.ts(3,10): error TS18046: 'input' is of type 'unknown'.</div>
<p>Cách sửa là một guard — <code>if (typeof input === 'string') return input.toUpperCase();</code>. Đây là kiểu đúng cho bất cứ thứ gì đến từ ngoài tầm kiểm soát của bạn: JSON, một <code>error</code> bắt được, một callback bên thứ ba. Nó nói "tôi sẽ giữ bất cứ thứ gì bạn đưa, nhưng tôi từ chối để bạn dùng nó một cách mù quáng."</p>

<h3>never: kiểu rỗng, cho exhaustiveness</h3>
<p><code>never</code> là kiểu không có giá trị nào — không gì gán được cho nó:</p>
<pre><code><span class="tok-comment">// never.ts</span>
<span class="tok-keyword">const</span> n: <span class="tok-keyword">never</span> = <span class="tok-number">5</span>;   <span class="tok-comment">// không giá trị nào gán được cho never</span></code></pre>
<div class="out">never.ts(2,7): error TS2322: Type '5' is not assignable to type 'never'.</div>
<p>Nhìn có vẻ vô dụng tới khi bạn nhớ phép kiểm đầy đủ ở chương 5: gán phần "không thể có" còn sót cho một biến <code>never</code> trong default của một <code>switch</code> làm trình biên dịch chứng minh bạn đã xử lý mọi case. Nó cũng là kiểu trả về của một hàm không bao giờ trả về (một hàm luôn ném).</p>

<h3>any: cửa thoát gỡ luôn tấm lưới</h3>
<p><code>any</code> tắt kiểm kiểu hoàn toàn — và khác hai cái trên, nó thất bại <em>âm thầm</em>:</p>
<pre><code><span class="tok-comment">// anytrap.ts</span>
<span class="tok-keyword">const</span> x: <span class="tok-keyword">any</span> = <span class="tok-string">'hello'</span>;
x.foo.bar.<span class="tok-function">baz</span>();   <span class="tok-comment">// any tắt mọi kiểm — không lỗi, sập lúc chạy</span></code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Cái này biên dịch không một lời phàn nàn và nổ tung lúc chạy — đúng cú thất bại TypeScript tồn tại để ngăn, được bật lại bởi một từ khoá. Chỉ dùng <code>any</code> như một cửa thoát có chủ đích, tạm thời; nơi bạn bị cám dỗ dùng nó cho "một giá trị ngoài nào đó", hãy dùng <code>unknown</code> thay vào và thu hẹp. Mỗi <code>any</code> là một lỗ trên tấm lưới.</p>

<div class="callout ok">Chọn có chủ đích: <code>unknown</code> cho giá trị từ ngoài/chưa biết (giữ mọi thứ, ép một phép kiểm — mặc định an toàn); <code>never</code> cho "không thể có" (kiểm đầy đủ, hàm không trả về); <code>any</code> gần như không bao giờ (nó âm thầm tắt kiểm). Khi bị cám dỗ dùng <code>any</code>, thử <code>unknown</code> trước.</div>
<div class="note-ct">Đây là phần "biết khi nào dùng any, unknown hay never" khoá học đã hứa. Kỷ luật ở đây: các biên ngoài nhận <code>unknown</code> và được validate (chương 13); default của switch dùng mẹo exhaustiveness với <code>never</code>; và <code>any</code> bị coi là một mùi lạ cần biện minh, không phải một tiện lợi — đó là phần lớn lý do pipeline strict thật sự bắt được mọi thứ.</div>
<h3>Ba kiểu nhìn na ná mà hành xử ngược nhau</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">any</span><span class="lz-t">Nhận mọi giá trị, cho phép mọi thao tác</span><span class="lz-d">Tắt việc kiểm ở cả hai chiều, và nó lan: bất cứ thứ gì dẫn xuất từ một <code>any</code> cũng không được kiểm.</span></div>
<div class="lz-node"><span class="lz-k">unknown</span><span class="lz-t">Nhận mọi giá trị, không cho thao tác nào</span><span class="lz-d">Kiểu đỉnh thành thật. Bạn phải thu hẹp trước khi dùng, nên phép kiểm được hoãn tới nơi có bằng chứng, chứ không bị gỡ bỏ.</span></div>
<div class="lz-node"><span class="lz-k">never</span><span class="lz-t">Chẳng nhận giá trị nào cả</span><span class="lz-d">Kiểu rỗng. Nó là thứ một hàm luôn ném lỗi trả về, và là thứ một union đã xử đủ thu hẹp về.</span></div>
<div class="lz-node"><span class="lz-k">Quy tắc</span><span class="lz-t">unknown ở rìa, never ở cuối</span><span class="lz-d">Nhận <code>unknown</code> từ bên ngoài rồi chứng minh nó là gì; dùng <code>never</code> để khẳng định một nhánh không tới được. <code>any</code> dành cho một cuộc di trú mà bạn có ý định làm xong.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một chữ <code>any</code> âm thầm tắt việc kiểm cho mọi thứ phía sau nó.</strong> <code>const cfg: any = JSON.parse(raw)</code> rồi <code>const port = cfg.server.port</code> làm <code>port</code> cũng thành <code>any</code>; truyền nó vào một hàm khai <code>(p: number)</code> thì chẳng lỗi nào, vì <code>any</code> gán được vào mọi thứ. Cái lỗ không phải là một dòng bạn viết — nó là mọi biểu thức đã chạm vào nó, và nó vượt qua cả biên module qua các kiểu trả về. Đó là lý do <code>unknown</code> mới là mặc định đúng ở một cái biên: nó lan truyền <em>nhu cầu phải kiểm</em> thay vì lan truyền sự cho phép. Hãy bật <code>noImplicitAny</code> để những cái vô tình thành lỗi, và định kỳ grep tìm những cái cố ý.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: any/unknown/never trên Code Lab</span><span class="lc-sub">Thay một any bằng một unknown đã thu hẹp.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.3 ─────────────────────────── */
    {
      title: '16.3 — Organizing types|||16.3 — Tổ chức kiểu',
      slug: 'typescript-16-3-organizing-types',
      type: 'LESSON',
      isFreePreview: true,
      description: 'type so với interface (interface gộp khai báo, type thì không); một nguồn sự thật (suy từ Zod/Prisma thay vì chép tay); kiểu nên ở gần nơi dùng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3</span>
<h2>Organizing types</h2>
<p class="lead">As a codebase grows, <em>where</em> types live and <em>how</em> you declare them matters as much as the types themselves. Two decisions come up constantly: <code>type</code> vs <code>interface</code>, and where a shape's single source of truth should be.</p>

<h3>type vs interface: the one real difference</h3>
<p>They overlap heavily, but interfaces support <em>declaration merging</em> — declare the same interface twice and they combine (that's how the Express augmentation in chapter 10 worked). Type aliases can't:</p>
<pre><code><span class="tok-comment">// duptype.ts</span>
<span class="tok-keyword">type</span> Point = { x: <span class="tok-keyword">number</span> };
<span class="tok-keyword">type</span> Point = { y: <span class="tok-keyword">number</span> };   <span class="tok-comment">// type aliases can't be declared twice</span></code></pre>
<div class="out">duptype.ts(2,6): error TS2300: Duplicate identifier 'Point'.</div>
<p>An <code>interface Point</code> declared twice would silently merge into <code>{ x; y }</code>; a <code>type</code> is a hard error. The practical rule: use <code>interface</code> for object shapes that are a public API or might be augmented (they give better error messages and allow merging); use <code>type</code> for everything a union, tuple, mapped or conditional type needs — things <code>interface</code> can't express. When in doubt for a plain object, either is fine; pick one and be consistent.</p>

<h3>One source of truth, always</h3>
<p>The single most important organizing principle, repeated all course: never hand-maintain a type that can be <em>derived</em>. Infer it from the schema (<code>z.infer</code>), from the database (Prisma's generated types), from a function (<code>ReturnType</code>), from a constant (<code>typeof</code>). Every hand-copied type is a future drift bug — the enum-rename incident, the copy that fell out of sync. Derive, don't duplicate.</p>

<h3>Where types live</h3>
<p>Keep a type as close as possible to what uses it: a component's props next to the component, a route's DTO next to the route. Promote a type to a shared module only when two places genuinely need it — and share it with <code>import type</code> so it never drags runtime code across a boundary (chapter 15). Co-location beats a giant <code>types.ts</code> that everything imports and nothing owns.</p>

<div class="callout ok"><code>interface</code> for object shapes that are public or augmentable (it merges); <code>type</code> for unions, tuples, and computed types (it doesn't). Derive types from a single source (Zod, Prisma, <code>ReturnType</code>, <code>typeof</code>) instead of hand-copying. Co-locate types with their use; share via <code>import type</code> only when truly shared.</div>
<div class="note-ct">Across this codebase the pattern holds: Prisma's generated types are the source for database shapes, Zod schemas for validated input, and <code>import type</code> carries the few genuinely-shared DTOs between frontend and backend. Almost nothing is a hand-written duplicate — which is exactly why a schema change propagates instead of silently drifting.</div>
<h3>Where a type should live</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Next to what it describes</span><span class="lz-t">The default</span><span class="lz-d">A route's request type beside the route, a service's return type beside the service. It changes in the same commit as the code it belongs to.</span></div>
<div class="lz-layer"><span class="lz-k">A shared module for real contracts</span><span class="lz-t">Only when several places need the same shape</span><span class="lz-d">The API envelope, the domain entities. Small and stable — if it is churning, the boundary is in the wrong place.</span></div>
<div class="lz-layer"><span class="lz-k">Derived, not duplicated</span><span class="lz-t">z.infer, Prisma's models, Pick/Omit</span><span class="lz-d">Every hand-written copy of a generated shape is a second source of truth waiting to drift — chapter 13's production outage in one sentence.</span></div>
<div class="lz-layer"><span class="lz-k">Not a global types/ dumping ground</span><span class="lz-t">The failure mode to avoid</span><span class="lz-d">One folder every module imports from couples everything to everything, and nothing can be deleted because nobody knows who uses it.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — a barrel file (<code>index.ts</code> re-exporting everything) turns one import into hundreds of loaded modules.</strong> It reads beautifully — <code>import { User, Note, Tag } from '@/types'</code> — and it means every file that touches one type pulls the whole graph into the program, slowing <code>tsc</code>, defeating tree-shaking, and creating import cycles that surface as <code>undefined</code> at runtime in whichever module happened to load first. The cycles are the worst part: they depend on load order, so they appear on the server and not locally. Import from the specific module, keep barrels for genuinely public package boundaries, and if a barrel already exists, at least make its re-exports <code>export type</code> so the runtime graph stays empty.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: organizing types on Code Lab</span><span class="lc-sub">Choose type vs interface and derive from a source.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3</span>
<h2>Tổ chức kiểu</h2>
<p class="lead">Khi một codebase lớn lên, <em>nơi</em> kiểu sống và <em>cách</em> bạn khai chúng quan trọng ngang bản thân các kiểu. Hai quyết định gặp liên tục: <code>type</code> so với <code>interface</code>, và nguồn sự thật duy nhất của một hình dạng nên ở đâu.</p>

<h3>type so với interface: khác biệt thật duy nhất</h3>
<p>Chúng trùng nhau rất nhiều, nhưng interface hỗ trợ <em>gộp khai báo</em> — khai cùng một interface hai lần và chúng kết hợp (đó là cách phần bổ sung Express ở chương 10 hoạt động). Type alias thì không:</p>
<pre><code><span class="tok-comment">// duptype.ts</span>
<span class="tok-keyword">type</span> Point = { x: <span class="tok-keyword">number</span> };
<span class="tok-keyword">type</span> Point = { y: <span class="tok-keyword">number</span> };   <span class="tok-comment">// type alias không khai hai lần được</span></code></pre>
<div class="out">duptype.ts(2,6): error TS2300: Duplicate identifier 'Point'.</div>
<p>Một <code>interface Point</code> khai hai lần sẽ âm thầm gộp thành <code>{ x; y }</code>; một <code>type</code> là lỗi cứng. Nguyên tắc thực dụng: dùng <code>interface</code> cho các hình dạng object là API công khai hoặc có thể bị bổ sung (chúng cho thông báo lỗi tốt hơn và cho phép gộp); dùng <code>type</code> cho mọi thứ một union, tuple, mapped hay conditional type cần — những thứ <code>interface</code> không diễn đạt được. Khi lưỡng lự với một object thường, cái nào cũng được; chọn một và nhất quán.</p>

<h3>Một nguồn sự thật, luôn luôn</h3>
<p>Nguyên tắc tổ chức quan trọng nhất, lặp suốt khoá: đừng bao giờ tự bảo trì một kiểu có thể <em>suy ra được</em>. Suy nó từ schema (<code>z.infer</code>), từ cơ sở dữ liệu (kiểu sinh của Prisma), từ một hàm (<code>ReturnType</code>), từ một hằng (<code>typeof</code>). Mỗi kiểu chép tay là một lỗi trôi dạt tương lai — sự cố đổi tên enum, bản sao rớt khỏi đồng bộ. Suy ra, đừng nhân bản.</p>

<h3>Kiểu sống ở đâu</h3>
<p>Giữ một kiểu càng gần thứ dùng nó càng tốt: props của một component cạnh component, DTO của một route cạnh route. Chỉ đưa một kiểu lên một module dùng chung khi hai nơi thật sự cần — và chia sẻ nó bằng <code>import type</code> để nó không bao giờ kéo code lúc chạy qua một biên (chương 15). Đặt-cùng-chỗ thắng một <code>types.ts</code> khổng lồ mà mọi thứ import và không gì sở hữu.</p>

<div class="callout ok"><code>interface</code> cho hình dạng object công khai hoặc bổ-sung-được (nó gộp); <code>type</code> cho union, tuple, và kiểu tính ra (nó không gộp). Suy kiểu từ một nguồn duy nhất (Zod, Prisma, <code>ReturnType</code>, <code>typeof</code>) thay vì chép tay. Đặt kiểu cùng chỗ với nơi dùng; chia sẻ qua <code>import type</code> chỉ khi thật sự dùng chung.</div>
<div class="note-ct">Khắp codebase này pattern giữ vững: kiểu sinh của Prisma là nguồn cho hình dạng cơ sở dữ liệu, schema Zod cho input đã validate, và <code>import type</code> mang vài DTO thật sự dùng chung giữa frontend và backend. Gần như không gì là bản chép tay — đúng lý do một thay đổi schema lan đi thay vì âm thầm trôi dạt.</div>
<h3>Một kiểu nên sống ở đâu</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Cạnh thứ nó mô tả</span><span class="lz-t">Mặc định</span><span class="lz-d">Kiểu request của một route nằm cạnh route, kiểu trả về của một service nằm cạnh service. Nó đổi trong cùng một commit với đoạn mã nó thuộc về.</span></div>
<div class="lz-layer"><span class="lz-k">Một module dùng chung cho hợp đồng thật</span><span class="lz-t">Chỉ khi nhiều nơi cần cùng một dáng</span><span class="lz-d">Chiếc phong bì API, các thực thể nghiệp vụ. Nhỏ và ổn định — nếu nó cứ đổi xoành xoạch thì cái biên đang đặt sai chỗ.</span></div>
<div class="lz-layer"><span class="lz-k">Dẫn xuất, đừng nhân bản</span><span class="lz-t">z.infer, model của Prisma, Pick/Omit</span><span class="lz-d">Mỗi bản chép tay của một dáng sinh tự động là một nguồn sự thật thứ hai đang chờ trôi dạt — sự cố production ở chương 13 gói trong một câu.</span></div>
<div class="lz-layer"><span class="lz-k">Không phải một bãi rác types/ toàn cục</span><span class="lz-t">Kiểu hỏng cần tránh</span><span class="lz-d">Một thư mục mà mọi module đều import từ đó sẽ buộc mọi thứ vào mọi thứ, và chẳng gì xoá được vì không ai biết ai đang dùng.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một file thùng (<code>index.ts</code> xuất lại tất cả) biến một lời import thành hàng trăm module được nạp.</strong> Nó đọc lên rất đẹp — <code>import { User, Note, Tag } from '@/types'</code> — và nó có nghĩa là mọi file chạm tới một kiểu đều kéo cả đồ thị vào chương trình, làm <code>tsc</code> chậm đi, phá tree-shaking, và tạo ra những vòng import lộ ra dạng <code>undefined</code> lúc chạy ở đúng cái module tình cờ nạp trước. Vòng import mới là phần tệ nhất: chúng phụ thuộc thứ tự nạp, nên chúng hiện trên máy chủ mà không hiện ở máy bạn. Hãy import từ đúng module cụ thể, để dành file thùng cho những biên package thật sự công khai, và nếu đã trót có một cái thì ít nhất hãy cho các phép xuất lại của nó thành <code>export type</code> để đồ thị lúc chạy vẫn rỗng.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: tổ chức kiểu trên Code Lab</span><span class="lc-sub">Chọn type vs interface và suy từ một nguồn.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.4 ─────────────────────────── */
    {
      title: '16.4 — The whole picture & where to go next|||16.4 — Bức tranh toàn cảnh & đi tiếp',
      slug: 'typescript-16-4-whole-picture',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ghép mọi thứ: validate tại biên, tin bên trong. Một ví dụ tích hợp Zod + z.infer + Result union, và hướng đi tiếp sau khoá học.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4</span>
<h2>The whole picture &amp; where to go next</h2>
<p class="lead">Sixteen chapters come down to one architecture: <strong>validate at the edges, trust the inside</strong>. External data enters through a validator, becomes a precise type, and from there the compiler carries that guarantee through every function, module, and boundary. Here is the whole idea in one function.</p>

<h3>Validate at the edge, trust inside</h3>
<pre><code><span class="tok-comment">// capstone.ts — validate at the edge, trust inside</span>
<span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">'zod'</span>;
<span class="tok-keyword">const</span> UserSchema = z.<span class="tok-function">object</span>({ id: z.<span class="tok-function">number</span>(), name: z.<span class="tok-function">string</span>() });
<span class="tok-keyword">type</span> User = z.infer&lt;<span class="tok-keyword">typeof</span> UserSchema&gt;;
<span class="tok-keyword">type</span> Result&lt;T&gt; = { ok: <span class="tok-keyword">true</span>; value: T } | { ok: <span class="tok-keyword">false</span>; error: <span class="tok-keyword">string</span> };
<span class="tok-keyword">function</span> <span class="tok-function">parseUser</span>(raw: <span class="tok-keyword">unknown</span>): Result&lt;User&gt; {
  <span class="tok-keyword">const</span> r = UserSchema.<span class="tok-function">safeParse</span>(raw);
  <span class="tok-keyword">return</span> r.success ? { ok: <span class="tok-keyword">true</span>, value: r.data } : { ok: <span class="tok-keyword">false</span>, error: <span class="tok-string">'invalid user'</span> };
}
<span class="tok-keyword">const</span> res = <span class="tok-function">parseUser</span>(JSON.<span class="tok-function">parse</span>(<span class="tok-string">'{}'</span>));
<span class="tok-keyword">if</span> (res.ok) {
  console.<span class="tok-function">log</span>(res.value.name.<span class="tok-function">toUpperCase</span>());   <span class="tok-comment">// fully typed &amp; validated</span>
}</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Count the chapters in those twelve lines. The input is <code>unknown</code> (16.2), validated by a Zod schema (13); the type is <em>inferred</em> from that schema, one source of truth (16.3); the outcome is a discriminated-union <code>Result&lt;T&gt;</code> — a generic (6) that makes the failure case impossible to ignore (16.1); and after narrowing on <code>res.ok</code> (5), <code>res.value.name</code> is a fully typed, validated <code>string</code>. Raw <code>unknown</code> at the top, provable safety at the bottom. That is the entire discipline.</p>

<h3>What you can do now</h3>
<p>You can read and write any type from primitives to conditional types; narrow safely; build and use generics and utility types; configure <code>tsc</code> and understand what it does; type a real Node/Express backend and a React frontend; validate boundaries with Zod and derive types from Prisma; and design so illegal states can't exist. That is the working TypeScript of a professional codebase.</p>

<h3>Where to go next</h3>
<p>Three directions from here. <strong>Depth:</strong> the type-challenges collection drills advanced conditional and mapped types until they're second nature. <strong>Breadth:</strong> apply the boundary pattern in a framework that leans on it harder — tRPC (end-to-end types with no codegen), or a typed ORM like Drizzle. <strong>Practice:</strong> turn on <code>strict</code> and the extra flags from chapter 9 in your own project and fix what lights up — nothing teaches faster than a real codebase pushing back. The Handbook at typescriptlang.org and the Playground are your references; the compiler is your tutor.</p>

<div class="callout ok">The whole course in one line: validate at the edges, trust the inside. Give external data <code>unknown</code>, prove it with a schema, infer the type from that one source, model outcomes so bad states can't be written — and the compiler carries the guarantee everywhere else. Now go turn on <code>strict</code> and build something.</div>
<div class="note-ct">Everything you've read describes how this very site is built — Prisma and Zod at the boundaries, discriminated unions for state and responses, <code>strict</code> plus the extra flags, <code>import type</code> across the frontend/backend line. The examples weren't hypothetical; they were the codebase this course lives in, proven by the same compiler that checked every snippet you just read.</div>
<h3>The whole course, as one pipeline</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Data enters as unknown</span><span class="lz-d">HTTP bodies, env vars, third-party responses. The compiler cannot see any of it, so nothing here may be asserted — only parsed.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A schema turns it into a type</span><span class="lz-d">Validation at the boundary is the only place a runtime check and a compile-time type meet. Everything inward of it can be trusted <em>because</em> of this step.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Inside, model states not flags</span><span class="lz-d">Discriminated unions, exhaustive switches, <code>never</code> at the ends. The impossible states are unrepresentable rather than merely unlikely.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Data leaves through an explicit shape</span><span class="lz-d">A DTO built with <code>Pick</code>, an envelope the client can narrow. What leaves the process is a decision, not a side effect of the model.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — believing a green <code>tsc</code> means the program is correct.</strong> Everything in this course is a check on <em>the code you wrote against itself</em>: it proves internal consistency, and it proves nothing about the bytes arriving at runtime, the database's actual contents, the version of the library installed, or whether the deployed image is the one you built. This repo's history is a list of exactly those gaps — a seed that type-checked against its own hand-copied union and broke production, a build that was green because <code>tsc</code> never looked at <code>prisma/**</code>, an image that built and pushed cleanly with the wrong libc. Types remove a category of bugs completely. Treat the remaining categories as still yours: validate at the boundary, run the thing, and check what actually shipped.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: the whole pattern on Code Lab</span><span class="lc-sub">Build a validate-at-the-edge function end to end.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4</span>
<h2>Bức tranh toàn cảnh &amp; đi tiếp</h2>
<p class="lead">Mười sáu chương quy về một kiến trúc: <strong>validate tại các biên, tin bên trong</strong>. Dữ liệu từ ngoài vào qua một bộ validate, trở thành một kiểu chính xác, và từ đó trình biên dịch mang bảo đảm ấy qua mọi hàm, module, và biên giới. Đây là trọn ý tưởng trong một hàm.</p>

<h3>Validate tại biên, tin bên trong</h3>
<pre><code><span class="tok-comment">// capstone.ts — validate tại biên, tin bên trong</span>
<span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">'zod'</span>;
<span class="tok-keyword">const</span> UserSchema = z.<span class="tok-function">object</span>({ id: z.<span class="tok-function">number</span>(), name: z.<span class="tok-function">string</span>() });
<span class="tok-keyword">type</span> User = z.infer&lt;<span class="tok-keyword">typeof</span> UserSchema&gt;;
<span class="tok-keyword">type</span> Result&lt;T&gt; = { ok: <span class="tok-keyword">true</span>; value: T } | { ok: <span class="tok-keyword">false</span>; error: <span class="tok-keyword">string</span> };
<span class="tok-keyword">function</span> <span class="tok-function">parseUser</span>(raw: <span class="tok-keyword">unknown</span>): Result&lt;User&gt; {
  <span class="tok-keyword">const</span> r = UserSchema.<span class="tok-function">safeParse</span>(raw);
  <span class="tok-keyword">return</span> r.success ? { ok: <span class="tok-keyword">true</span>, value: r.data } : { ok: <span class="tok-keyword">false</span>, error: <span class="tok-string">'invalid user'</span> };
}
<span class="tok-keyword">const</span> res = <span class="tok-function">parseUser</span>(JSON.<span class="tok-function">parse</span>(<span class="tok-string">'{}'</span>));
<span class="tok-keyword">if</span> (res.ok) {
  console.<span class="tok-function">log</span>(res.value.name.<span class="tok-function">toUpperCase</span>());   <span class="tok-comment">// có kiểu &amp; đã validate đầy đủ</span>
}</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Đếm số chương trong mười hai dòng đó. Input là <code>unknown</code> (16.2), được validate bởi một schema Zod (13); kiểu được <em>suy ra</em> từ schema đó, một nguồn sự thật (16.3); kết quả là một <code>Result&lt;T&gt;</code> discriminated-union — một generic (6) làm trường hợp thất bại không thể phớt lờ (16.1); và sau khi thu hẹp trên <code>res.ok</code> (5), <code>res.value.name</code> là một <code>string</code> có kiểu, đã validate đầy đủ. <code>unknown</code> thô ở trên, an toàn chứng minh được ở dưới. Đó là trọn kỷ luật.</p>

<h3>Giờ bạn làm được gì</h3>
<p>Bạn đọc và viết được mọi kiểu từ primitive tới conditional type; thu hẹp an toàn; dựng và dùng generic và utility type; cấu hình <code>tsc</code> và hiểu nó làm gì; gõ kiểu một backend Node/Express thật và một frontend React; validate biên bằng Zod và suy kiểu từ Prisma; và thiết kế sao cho trạng thái sai không thể tồn tại. Đó là TypeScript thực chiến của một codebase chuyên nghiệp.</p>

<h3>Đi tiếp hướng nào</h3>
<p>Ba hướng từ đây. <strong>Chiều sâu:</strong> bộ type-challenges luyện conditional và mapped type nâng cao tới khi thành bản năng. <strong>Chiều rộng:</strong> áp pattern biên trong một framework dựa vào nó mạnh hơn — tRPC (kiểu đầu-cuối không cần sinh mã), hay một ORM có kiểu như Drizzle. <strong>Thực hành:</strong> bật <code>strict</code> và các cờ thêm ở chương 9 trong dự án của chính bạn và sửa những gì sáng đỏ — không gì dạy nhanh hơn một codebase thật phản kháng. Handbook ở typescriptlang.org và Playground là tài liệu tham chiếu; trình biên dịch là gia sư của bạn.</p>

<div class="callout ok">Trọn khoá trong một dòng: validate tại các biên, tin bên trong. Cho dữ liệu ngoài kiểu <code>unknown</code>, chứng minh nó bằng một schema, suy kiểu từ một nguồn đó, mô hình kết quả sao cho trạng thái xấu không viết ra được — và trình biên dịch mang bảo đảm đi khắp nơi còn lại. Giờ hãy bật <code>strict</code> và dựng một thứ gì đó.</div>
<div class="note-ct">Mọi thứ bạn vừa đọc mô tả đúng cách chính site này được dựng — Prisma và Zod ở các biên, discriminated union cho trạng thái và response, <code>strict</code> cộng các cờ thêm, <code>import type</code> qua ranh giới frontend/backend. Các ví dụ không phải giả định; chúng là chính codebase mà khoá này sống trong đó, được chứng minh bởi cùng trình biên dịch đã kiểm mọi đoạn code bạn vừa đọc.</div>
<h3>Cả khoá học, dưới dạng một đường ống</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dữ liệu đi vào dưới dạng unknown</span><span class="lz-d">Thân HTTP, biến môi trường, phản hồi của bên thứ ba. Trình biên dịch không nhìn thấy gì trong đó, nên ở đây không được khẳng định — chỉ được phân tích.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một schema biến nó thành kiểu</span><span class="lz-d">Kiểm dữ liệu ở biên là nơi duy nhất một phép kiểm lúc chạy gặp một kiểu lúc biên dịch. Mọi thứ phía trong tin được <em>là nhờ</em> bước này.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bên trong, mô hình hoá trạng thái chứ không phải cờ</span><span class="lz-d">Discriminated union, switch xử đủ, <code>never</code> ở cuối. Trạng thái bất khả trở nên không biểu diễn được, chứ không chỉ là khó xảy ra.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Dữ liệu đi ra qua một dáng tường minh</span><span class="lz-d">Một DTO dựng bằng <code>Pick</code>, một phong bì mà client thu hẹp được. Thứ rời khỏi tiến trình là một quyết định, không phải tác dụng phụ của model.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tin rằng một <code>tsc</code> xanh nghĩa là chương trình đúng.</strong> Mọi thứ trong khoá này là một phép kiểm <em>mã bạn viết với chính nó</em>: nó chứng minh tính nhất quán bên trong, và nó chẳng chứng minh gì về các byte tới lúc chạy, về nội dung thật của cơ sở dữ liệu, về phiên bản thư viện đang cài, hay về việc ảnh đã triển khai có đúng là ảnh bạn dựng không. Lịch sử của kho này là một danh sách đúng những khoảng trống ấy — một seed tự kiểm với union nó tự chép rồi làm vỡ production, một bản build xanh vì <code>tsc</code> chưa từng nhìn vào <code>prisma/**</code>, một ảnh dựng xanh đẩy xanh mà mang sai libc. Kiểu xoá sạch một loại lỗi. Hãy coi những loại còn lại vẫn là của bạn: kiểm ở biên, chạy thật, và xem thứ đã thật sự lên là gì.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: trọn pattern trên Code Lab</span><span class="lc-sub">Dựng một hàm validate-tại-biên từ đầu tới cuối.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.5 quiz ─────────────────────────── */
    {
      title: '16.5 — Final quiz|||16.5 — Kiểm tra cuối khoá',
      slug: 'typescript-16-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu tổng kết cả nửa sau khoá: type-driven design, any/unknown/never, type vs interface, và kiến trúc validate-tại-biên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Final quiz</span>
<h2>The finish line</h2>
<p class="lead">Eight questions spanning this final stretch — design, the special types, organisation, and the architecture that ties it all together. If these feel easy, you've internalised the way TypeScript wants you to think.</p>
<div class="callout ok">Aim for 7/8. The one idea that outlasts every syntax detail: validate at the edges, trust the inside.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Kiểm tra cuối</span>
<h2>Vạch đích</h2>
<p class="lead">Tám câu bao trọn chặng cuối này — thiết kế, các kiểu đặc biệt, tổ chức, và kiến trúc buộc tất cả lại. Nếu thấy dễ, bạn đã thấm cách TypeScript muốn bạn tư duy.</p>
<div class="callout ok">Hãy nhắm 7/8. Ý sống lâu hơn mọi chi tiết cú pháp: validate tại các biên, tin bên trong.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does "make illegal states unrepresentable" mean?|||"Làm trạng thái sai không biểu diễn được" nghĩa là gì?',
            options: [
              'Validate every value at runtime|||Validate mọi giá trị lúc chạy',
              'Design types (e.g. a discriminated union) so invalid combinations can\'t be constructed at all|||Thiết kế kiểu (vd một discriminated union) sao cho tổ hợp không hợp lệ không dựng được chút nào',
              'Throw errors for bad states|||Ném lỗi cho trạng thái xấu',
              'Use any for flexibility|||Dùng any cho linh hoạt',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A flat { loading: boolean; data?: string; error?: string } is worse than a discriminated union because?|||Một object phẳng { loading; data?; error? } tệ hơn một discriminated union vì?',
            options: [
              'It is slower|||Nó chậm hơn',
              'It permits contradictory combinations (loading + error, data + error) that a union forbids|||Nó cho phép các tổ hợp mâu thuẫn (loading + error, data + error) mà union cấm',
              'It uses more memory|||Nó tốn nhiều bộ nhớ hơn',
              'It cannot be typed|||Nó không gõ kiểu được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What must you do before using a value typed unknown?|||Bạn phải làm gì trước khi dùng một giá trị kiểu unknown?',
            options: [
              'Nothing — it works like any|||Không gì — nó như any',
              'Narrow it (e.g. a typeof guard); the compiler rejects direct use (TS18046)|||Thu hẹp nó (vd một guard typeof); trình biên dịch từ chối dùng trực tiếp (TS18046)',
              'Cast it to any|||Ép nó thành any',
              'Await it|||Await nó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which type is the empty type that nothing is assignable to?|||Kiểu nào là kiểu rỗng mà không gì gán được cho?',
            options: [
              'unknown',
              'never',
              'any',
              'void',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is const x: any; x.foo.bar.baz() dangerous?|||Vì sao const x: any; x.foo.bar.baz() nguy hiểm?',
            options: [
              'It is a compile error|||Nó là lỗi biên dịch',
              'any turns off all checking, so it compiles with no error and crashes at runtime|||any tắt mọi kiểm, nên nó biên dịch không lỗi và sập lúc chạy',
              'It is slow|||Nó chậm',
              'baz is reserved|||baz là từ khoá',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What can interface do that type cannot?|||interface làm được gì mà type không?',
            options: [
              'Express unions and tuples|||Diễn đạt union và tuple',
              'Declaration merging — declare it twice and the members combine|||Gộp khai báo — khai hai lần và các thành viên kết hợp',
              'Use generics|||Dùng generic',
              'Nothing|||Không gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the best practice for a type that could be derived from a Zod schema or Prisma model?|||Thực hành tốt nhất cho một kiểu có thể suy từ một schema Zod hoặc model Prisma là?',
            options: [
              'Hand-write it as an interface too, for clarity|||Cũng tự viết nó thành một interface, cho rõ',
              'Derive it (z.infer / generated types) — one source of truth, no drift|||Suy nó (z.infer / kiểu sinh) — một nguồn sự thật, không trôi dạt',
              'Copy it into every file that needs it|||Chép nó vào mọi file cần',
              'Use any|||Dùng any',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the core architecture the whole course builds toward?|||Kiến trúc cốt lõi cả khoá hướng tới là gì?',
            options: [
              'Type everything as any for speed|||Gõ mọi thứ là any cho nhanh',
              'Validate at the edges (unknown → schema → inferred type), then trust the typed inside|||Validate tại các biên (unknown → schema → kiểu suy ra), rồi tin phần bên trong có kiểu',
              'Avoid generics|||Tránh generic',
              'Put all types in one file|||Để mọi kiểu trong một file',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
