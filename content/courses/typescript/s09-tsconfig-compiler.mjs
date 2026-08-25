/**
 * TypeScript — Chương 9: tsconfig & trình biên dịch.
 * Mọi output tsc là THẬT (tsc --strict / cờ tương ứng, verified). Song ngữ.
 * < > → &lt; &gt;; KHÔNG backtick trần (&#96;); ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 9 — tsconfig & the compiler|||Chương 9 — tsconfig & trình biên dịch',
  description: 'tsc làm gì (kiểm kiểu, xoá kiểu, hạ cấp cú pháp), và tsconfig.json điều khiển nó ra sao: strict mode, các cờ an toàn, target/lib/module, và type-check-only với noEmit.',
  lessons: [
    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — What tsc does & tsconfig basics|||9.1 — tsc làm gì & tsconfig căn bản',
      slug: 'typescript-9-1-tsc-and-tsconfig',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Trình biên dịch làm ba việc: kiểm kiểu, xoá kiểu, hạ cấp cú pháp. tsconfig.json là bộ điều khiển — target, module, outDir, strict, include/exclude.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>What tsc does &amp; tsconfig basics</h2>
<p class="lead">The compiler, <code>tsc</code>, does three jobs: it <strong>type-checks</strong> your code, <strong>erases</strong> the types, and <strong>downlevels</strong> modern syntax to an older target. <code>tsconfig.json</code> is the control panel for all three — and once it exists, you just run <code>tsc</code> with no arguments.</p>

<h3>Types are erased — see it</h3>
<p>Take a tiny typed file and compile it targeting ES5. The output is plain JavaScript with every type gone and the modern syntax lowered:</p>
<pre><code><span class="tok-comment">// app.ts</span>
<span class="tok-keyword">const</span> msg: <span class="tok-keyword">string</span> = <span class="tok-string">'hello'</span>;
<span class="tok-keyword">const</span> shout = (s: <span class="tok-keyword">string</span>): <span class="tok-keyword">string</span> =&gt; s.<span class="tok-function">toUpperCase</span>();
console.<span class="tok-function">log</span>(<span class="tok-function">shout</span>(msg));</code></pre>
<p>Run <code>tsc --target ES5 app.ts</code>, and <code>app.js</code> comes out:</p>
<div class="out">var msg = 'hello';
var shout = function (s) { return s.toUpperCase(); };
console.log(shout(msg));</div>
<p>Notice three things: the <code>: string</code> annotations vanished (types never exist at runtime), <code>const</code> became <code>var</code> and the arrow became a <code>function</code> (downleveling to ES5). This is the mental model from chapter 1 made concrete — TypeScript is a <em>compile-time</em> tool that produces ordinary JavaScript.</p>

<h3>tsconfig.json: the control panel</h3>
<p>Rather than passing flags every time, you put them in <code>tsconfig.json</code> at the project root. A sane starting point:</p>
<pre><code>{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}</code></pre>
<p>The essentials: <code>target</code> is the JS version to emit; <code>module</code> the module system; <code>outDir</code>/<code>rootDir</code> where compiled files go and where sources live; <code>strict</code> turns on the safety flags (next lesson); <code>include</code>/<code>exclude</code> which files are part of the program. With this file present, a bare <code>tsc</code> compiles the whole project.</p>

<div class="callout ok">tsc = type-check + erase types + downlevel syntax. <code>tsconfig.json</code> configures it, and its presence lets you run <code>tsc</code> with no arguments. The emitted <code>.js</code> has no types — they existed only to catch your mistakes before this step.</div>
<div class="note-ct">This project's backend <code>tsconfig.json</code> sets <code>rootDir: "./src"</code> — which is exactly why <code>prisma/**</code> can't be in its <code>include</code>, the hole that let a broken seed reach production once (chapter's error log). Knowing what <code>rootDir</code> and <code>include</code> actually scope is the difference between "tsc passed" and "tsc checked the file I cared about".</div>
<h3>What tsc does with one file</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Find the config</span><span class="lz-d">Running bare <code>tsc</code> walks up from the cwd for <code>tsconfig.json</code>. Passing a filename (<code>tsc x.ts</code>) <em>ignores tsconfig entirely</em> and uses defaults — the source of "it works in the editor, not on the command line".</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Build the program</span><span class="lz-d">Resolve <code>include</code>/<code>exclude</code>, then follow every import. A file nobody imports and <code>include</code> does not cover is simply never checked.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Type-check</span><span class="lz-d">All diagnostics are produced here. This is the whole value; everything after it is packaging.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Erase types and emit</span><span class="lz-d">Annotations, interfaces and type aliases vanish — there is no runtime trace. <code>--noEmit</code> stops here and gives you a pure checker.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>tsc</code> emits JavaScript even when the type check failed.</strong> By default a type error is a non-zero exit code <em>and</em> a written <code>dist/</code>. A build script that runs <code>tsc &amp;&amp; node dist/index.js</code> is fine; one that runs <code>tsc; node dist/index.js</code>, or a Dockerfile with two separate <code>RUN</code> lines where the first is <code>tsc || true</code>, ships the broken output and nothing tells you. This repo's own CLAUDE.md rule — run <code>npx tsc --noEmit</code> before pushing — exists for exactly this: check and emit are separate jobs. Set <code>noEmitOnError: true</code> if you want the compiler to refuse, and never let a build pipeline swallow its exit code.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: read a tsconfig on Code Lab</span><span class="lc-sub">Compile a file and inspect the emitted JavaScript.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>tsc làm gì &amp; tsconfig căn bản</h2>
<p class="lead">Trình biên dịch <code>tsc</code> làm ba việc: nó <strong>kiểm kiểu</strong> code của bạn, <strong>xoá</strong> các kiểu, và <strong>hạ cấp</strong> cú pháp hiện đại xuống một target cũ hơn. <code>tsconfig.json</code> là bảng điều khiển cho cả ba — và một khi nó tồn tại, bạn chỉ cần chạy <code>tsc</code> không đối số.</p>

<h3>Kiểu bị xoá — hãy nhìn tận mắt</h3>
<p>Lấy một file có kiểu nhỏ xíu và biên dịch nhắm ES5. Kết quả là JavaScript thuần với mọi kiểu biến mất và cú pháp hiện đại bị hạ xuống:</p>
<pre><code><span class="tok-comment">// app.ts</span>
<span class="tok-keyword">const</span> msg: <span class="tok-keyword">string</span> = <span class="tok-string">'hello'</span>;
<span class="tok-keyword">const</span> shout = (s: <span class="tok-keyword">string</span>): <span class="tok-keyword">string</span> =&gt; s.<span class="tok-function">toUpperCase</span>();
console.<span class="tok-function">log</span>(<span class="tok-function">shout</span>(msg));</code></pre>
<p>Chạy <code>tsc --target ES5 app.ts</code>, và <code>app.js</code> ra đời:</p>
<div class="out">var msg = 'hello';
var shout = function (s) { return s.toUpperCase(); };
console.log(shout(msg));</div>
<p>Để ý ba điều: các chú thích <code>: string</code> biến mất (kiểu không bao giờ tồn tại lúc chạy), <code>const</code> thành <code>var</code> và arrow thành <code>function</code> (hạ cấp xuống ES5). Đây là mô hình tư duy từ chương 1 làm cụ thể — TypeScript là một công cụ <em>lúc-biên-dịch</em> sinh ra JavaScript bình thường.</p>

<h3>tsconfig.json: bảng điều khiển</h3>
<p>Thay vì truyền cờ mỗi lần, bạn đặt chúng vào <code>tsconfig.json</code> ở gốc dự án. Một điểm khởi đầu hợp lý:</p>
<pre><code>{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}</code></pre>
<p>Các cái cốt yếu: <code>target</code> là phiên bản JS để xuất; <code>module</code> là hệ module; <code>outDir</code>/<code>rootDir</code> là nơi file biên dịch ra và nơi mã nguồn ở; <code>strict</code> bật các cờ an toàn (bài kế); <code>include</code>/<code>exclude</code> là những file thuộc chương trình. Có file này, một <code>tsc</code> trần biên dịch cả dự án.</p>

<div class="callout ok">tsc = kiểm kiểu + xoá kiểu + hạ cấp cú pháp. <code>tsconfig.json</code> cấu hình nó, và sự tồn tại của nó cho phép bạn chạy <code>tsc</code> không đối số. File <code>.js</code> xuất ra không có kiểu — chúng chỉ tồn tại để bắt lỗi của bạn trước bước này.</div>
<div class="note-ct"><code>tsconfig.json</code> backend của dự án này đặt <code>rootDir: "./src"</code> — chính vì thế <code>prisma/**</code> không thể nằm trong <code>include</code> của nó, cái lỗ từng để một seed hỏng lọt lên production (nhật ký lỗi của khoá). Biết <code>rootDir</code> và <code>include</code> thật sự bao phủ tới đâu là khác biệt giữa "tsc qua" và "tsc đã kiểm đúng file mình cần".</div>
<h3>tsc làm gì với một file</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tìm cấu hình</span><span class="lz-d">Chạy <code>tsc</code> trơn thì nó đi ngược lên từ thư mục hiện tại tìm <code>tsconfig.json</code>. Truyền một tên file (<code>tsc x.ts</code>) sẽ <em>bỏ qua hoàn toàn tsconfig</em> và dùng mặc định — nguồn gốc của câu "chạy trong editor thì được, ngoài dòng lệnh thì không".</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Dựng chương trình</span><span class="lz-d">Giải <code>include</code>/<code>exclude</code>, rồi lần theo mọi import. Một file chẳng ai import và <code>include</code> không phủ tới thì đơn giản là không bao giờ được kiểm.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kiểm kiểu</span><span class="lz-d">Mọi chẩn đoán được sinh ra ở đây. Đây là toàn bộ giá trị; mọi thứ sau nó chỉ là đóng gói.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Xoá kiểu và sinh mã</span><span class="lz-d">Chú thích kiểu, interface và type alias biến mất — không còn dấu vết nào lúc chạy. <code>--noEmit</code> dừng ở đây và cho bạn một bộ kiểm thuần tuý.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>tsc</code> vẫn sinh ra JavaScript kể cả khi phép kiểm kiểu hỏng.</strong> Mặc định, một lỗi kiểu cho mã thoát khác 0 <em>và</em> một thư mục <code>dist/</code> đã được ghi. Một script build chạy <code>tsc &amp;&amp; node dist/index.js</code> thì ổn; còn chạy <code>tsc; node dist/index.js</code>, hay một Dockerfile với hai dòng <code>RUN</code> riêng mà dòng đầu là <code>tsc || true</code>, sẽ ship luôn bản hỏng và chẳng gì báo cho bạn. Chính luật trong CLAUDE.md của kho này — chạy <code>npx tsc --noEmit</code> trước khi push — tồn tại đúng vì lẽ đó: kiểm và sinh mã là hai việc riêng. Đặt <code>noEmitOnError: true</code> nếu bạn muốn trình biên dịch từ chối, và đừng bao giờ để một đường ống build nuốt mất mã thoát của nó.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: đọc một tsconfig trên Code Lab</span><span class="lc-sub">Biên dịch một file và soi JavaScript xuất ra.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — strict mode|||9.2 — Chế độ strict',
      slug: 'typescript-9-2-strict-mode',
      type: 'LESSON',
      isFreePreview: true,
      description: 'strict: true là công tắc quan trọng nhất — nó gộp noImplicitAny, strictNullChecks và các cờ khác. Không có nó, TypeScript chỉ bắt được một nửa số lỗi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>strict mode</h2>
<p class="lead"><code>"strict": true</code> is the single most important line in a tsconfig. It's an umbrella that turns on a family of flags — and without it, TypeScript quietly lets through exactly the bugs you adopted it to catch. Always start a project with it on.</p>

<h3>noImplicitAny: no silent <code>any</code></h3>
<p>Part of strict. When TypeScript can't infer a type and you didn't annotate one, it would otherwise fall back to <code>any</code> silently. <code>noImplicitAny</code> makes that an error:</p>
<pre><code><span class="tok-comment">// implicit.ts   (compiled with noImplicitAny)</span>
<span class="tok-keyword">function</span> <span class="tok-function">greet</span>(name) { <span class="tok-keyword">return</span> <span class="tok-string">'hi '</span> + name; }</code></pre>
<div class="out">implicit.ts(2,16): error TS7006: Parameter 'name' implicitly has an 'any' type.</div>
<p>Without strict this compiles, and <code>name</code> is <code>any</code> — no checking anywhere it's used. With it, you're forced to say what <code>name</code> is. This one flag closes the most common way types silently disappear from a codebase.</p>

<h3>strictNullChecks: null is its own type</h3>
<p>The highest-value flag in the bundle. With it on, <code>null</code> and <code>undefined</code> are not assignable to other types — you must handle them explicitly:</p>
<pre><code><span class="tok-comment">// nullcheck.ts   (compiled with strictNullChecks)</span>
<span class="tok-keyword">function</span> <span class="tok-function">len</span>(s: <span class="tok-keyword">string</span> | <span class="tok-keyword">null</span>): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> s.length; }</code></pre>
<div class="out">nullcheck.ts(2,49): error TS18047: 's' is possibly 'null'.</div>
<p>Reading <code>.length</code> on something that might be <code>null</code> is exactly the "cannot read property of null" crash, caught at compile time. The fix is to narrow first (<code>if (s === null) return 0;</code>) — the narrowing from chapter 5. Turn this off and every optional value becomes a runtime landmine again.</p>

<h3>Why the umbrella matters</h3>
<p><code>strict</code> also bundles <code>strictFunctionTypes</code>, <code>strictBindCallApply</code>, <code>strictPropertyInitialization</code>, <code>noImplicitThis</code> and <code>alwaysStrict</code>. You don't need to memorise them — the point is that <code>strict: true</code> is the difference between TypeScript-as-safety-net and TypeScript-as-decoration. Enabling it on an existing untyped project surfaces real bugs; enabling it on a new one keeps them from ever being written.</p>

<div class="callout ok"><code>strict: true</code> is not optional in practice. Its two headline flags — <code>noImplicitAny</code> (no silent <code>any</code>) and <code>strictNullChecks</code> (handle null/undefined) — are where most of TypeScript's real-world value comes from. A project without strict is getting a fraction of what it paid for.</div>
<div class="note-ct">This codebase compiles under <code>strict</code>, which is why <code>User | null</code> lookups and <code>string | undefined</code> fields force every caller to handle the missing case — the reason null-dereference crashes are rare here (chapter 5's note, now traced to the flag that enforces it).</div>
<h3>What the strict umbrella actually turns on</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">noImplicitAny</span><span class="lz-t">No silent any</span><span class="lz-d">A parameter with no annotation and nothing to infer from becomes an error instead of an unchecked hole. The single highest-value flag.</span></div>
<div class="lz-layer"><span class="lz-k">strictNullChecks</span><span class="lz-t">null and undefined are their own types</span><span class="lz-d">Without it, <code>null</code> is assignable to everything and the compiler cannot see a single null-dereference. With it, the billion-dollar mistake becomes a compile error.</span></div>
<div class="lz-layer"><span class="lz-k">strictFunctionTypes</span><span class="lz-t">Parameters checked contravariantly</span><span class="lz-d">Stops a handler that expects a narrower argument being passed where a wider one is called. Does not apply to method-syntax members — a deliberate compatibility hole.</span></div>
<div class="lz-layer"><span class="lz-k">…and four more</span><span class="lz-t">strictBindCallApply, strictPropertyInitialization, noImplicitThis, useUnknownInCatchVariables</span><span class="lz-d">Each closes a specific hole. <code>strict: true</code> also opts you into whatever the next version adds, which is the point of using the umbrella rather than the individual flags.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — turning <code>strict</code> on later, then disabling <code>strictNullChecks</code> to make the build pass.</strong> It is the natural move on a large codebase: <code>strict: true</code> produces two thousand errors, most of them null-related, so you set <code>"strictNullChecks": false</code> and keep the rest. But that one flag is where most of the value lives, and worse, its effect is not local — with it off, <code>string | null</code> collapses to <code>string</code> everywhere, so types you write today record a guarantee the compiler is not checking. Turning it back on later is harder, not easier, because the codebase has grown against the loose rules. Migrate file by file instead: leave <code>strict: true</code> on globally and exclude the legacy directories from <code>include</code> until they are converted.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: strict mode on Code Lab</span><span class="lc-sub">Fix an implicit-any and a possibly-null error.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Chế độ strict</h2>
<p class="lead"><code>"strict": true</code> là dòng quan trọng nhất trong một tsconfig. Nó là một chiếc ô bật lên cả một họ cờ — và không có nó, TypeScript âm thầm cho lọt đúng những lỗi bạn dùng nó để bắt. Luôn khởi đầu một dự án với nó bật.</p>

<h3>noImplicitAny: không <code>any</code> âm thầm</h3>
<p>Một phần của strict. Khi TypeScript không suy được kiểu mà bạn cũng không chú thích, mặc định nó rơi về <code>any</code> âm thầm. <code>noImplicitAny</code> biến điều đó thành lỗi:</p>
<pre><code><span class="tok-comment">// implicit.ts   (biên dịch với noImplicitAny)</span>
<span class="tok-keyword">function</span> <span class="tok-function">greet</span>(name) { <span class="tok-keyword">return</span> <span class="tok-string">'hi '</span> + name; }</code></pre>
<div class="out">implicit.ts(2,16): error TS7006: Parameter 'name' implicitly has an 'any' type.</div>
<p>Không có strict thì cái này biên dịch được, và <code>name</code> là <code>any</code> — không kiểm ở bất cứ đâu nó được dùng. Có nó, bạn buộc phải nói <code>name</code> là gì. Riêng cờ này bịt con đường phổ biến nhất khiến kiểu âm thầm biến mất khỏi một codebase.</p>

<h3>strictNullChecks: null là một kiểu riêng</h3>
<p>Cờ giá trị cao nhất trong bó. Bật nó, <code>null</code> và <code>undefined</code> không gán được cho các kiểu khác — bạn phải xử lý chúng tường minh:</p>
<pre><code><span class="tok-comment">// nullcheck.ts   (biên dịch với strictNullChecks)</span>
<span class="tok-keyword">function</span> <span class="tok-function">len</span>(s: <span class="tok-keyword">string</span> | <span class="tok-keyword">null</span>): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> s.length; }</code></pre>
<div class="out">nullcheck.ts(2,49): error TS18047: 's' is possibly 'null'.</div>
<p>Đọc <code>.length</code> trên thứ có thể là <code>null</code> đúng là cú sập "cannot read property of null", bị bắt lúc biên dịch. Cách sửa là thu hẹp trước (<code>if (s === null) return 0;</code>) — thu hẹp kiểu ở chương 5. Tắt cái này đi và mọi giá trị tuỳ chọn lại thành một quả mìn lúc chạy.</p>

<h3>Vì sao chiếc ô lại quan trọng</h3>
<p><code>strict</code> còn gộp <code>strictFunctionTypes</code>, <code>strictBindCallApply</code>, <code>strictPropertyInitialization</code>, <code>noImplicitThis</code> và <code>alwaysStrict</code>. Bạn không cần thuộc lòng chúng — điểm mấu chốt là <code>strict: true</code> là khác biệt giữa TypeScript-như-lưới-an-toàn và TypeScript-như-trang-trí. Bật nó trên một dự án chưa gõ kiểu sẽ lộ ra lỗi thật; bật nó trên một dự án mới giữ cho lỗi không bao giờ được viết ra.</p>

<div class="callout ok"><code>strict: true</code> trên thực tế không phải tuỳ chọn. Hai cờ chủ lực của nó — <code>noImplicitAny</code> (không <code>any</code> âm thầm) và <code>strictNullChecks</code> (xử lý null/undefined) — là nơi phần lớn giá trị thực chiến của TypeScript đến từ đó. Một dự án không strict chỉ nhận một phần nhỏ thứ nó đã trả tiền.</div>
<div class="note-ct">Codebase này biên dịch dưới <code>strict</code>, đó là lý do các truy vấn <code>User | null</code> và field <code>string | undefined</code> ép mọi bên gọi xử lý trường hợp vắng — lý do cú sập null-dereference hiếm ở đây (ghi chú chương 5, giờ truy về đúng cái cờ ép nó).</div>
<h3>Chiếc ô strict thật ra bật những gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">noImplicitAny</span><span class="lz-t">Không any âm thầm</span><span class="lz-d">Một tham số không chú thích và chẳng có gì để suy ra sẽ thành lỗi thay vì một lỗ hổng không kiểm. Cờ có giá trị cao nhất.</span></div>
<div class="lz-layer"><span class="lz-k">strictNullChecks</span><span class="lz-t">null và undefined là kiểu riêng</span><span class="lz-d">Không có nó, <code>null</code> gán được vào mọi thứ và trình biên dịch không thấy nổi một cú tham chiếu null nào. Có nó, sai lầm tỷ đô thành lỗi biên dịch.</span></div>
<div class="lz-layer"><span class="lz-k">strictFunctionTypes</span><span class="lz-t">Tham số kiểm theo chiều nghịch biến</span><span class="lz-d">Chặn việc một handler đòi đối số hẹp hơn bị truyền vào chỗ sẽ gọi với đối số rộng hơn. Không áp cho thành viên viết dạng phương thức — một lỗ tương thích cố ý.</span></div>
<div class="lz-layer"><span class="lz-k">…và bốn cái nữa</span><span class="lz-t">strictBindCallApply, strictPropertyInitialization, noImplicitThis, useUnknownInCatchVariables</span><span class="lz-d">Mỗi cái bịt một lỗ cụ thể. <code>strict: true</code> còn tự động nhận cả những gì phiên bản sau thêm vào, và đó là lý do dùng chiếc ô thay vì từng cờ lẻ.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — bật <code>strict</code> muộn, rồi tắt <code>strictNullChecks</code> cho build qua.</strong> Đó là nước đi tự nhiên trên một kho mã lớn: <code>strict: true</code> nôn ra hai nghìn lỗi, phần lớn liên quan null, thế là bạn đặt <code>"strictNullChecks": false</code> và giữ phần còn lại. Nhưng đúng cái cờ ấy mới là nơi phần lớn giá trị nằm, và tệ hơn, tác dụng của nó không cục bộ — tắt nó đi thì <code>string | null</code> sụp thành <code>string</code> ở khắp nơi, nên những kiểu bạn viết hôm nay ghi lại một bảo đảm mà trình biên dịch không hề kiểm. Bật lại về sau khó hơn chứ không dễ hơn, vì kho mã đã lớn lên theo luật lỏng. Hãy chuyển từng file một: giữ <code>strict: true</code> bật toàn cục và loại các thư mục cũ khỏi <code>include</code> cho tới khi chúng được chuyển xong.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: chế độ strict trên Code Lab</span><span class="lc-sub">Sửa một lỗi implicit-any và một lỗi possibly-null.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — Beyond strict: extra safety flags|||9.3 — Vượt strict: các cờ an toàn thêm',
      slug: 'typescript-9-3-extra-safety-flags',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vài cờ mạnh KHÔNG nằm trong strict, bạn tự bật: noUncheckedIndexedAccess, noImplicitReturns, noUnusedLocals — bắt thêm một lớp lỗi nữa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Beyond strict: extra safety flags</h2>
<p class="lead">Some of the most useful checks are <em>not</em> in <code>strict</code> — you opt into them one at a time. They catch a further layer of real bugs, and turning them on early is far cheaper than retrofitting later.</p>

<h3>noUncheckedIndexedAccess: array access might miss</h3>
<p>By default, <code>arr[i]</code> is typed as the element type even if the index is out of range — a lie, since it could be <code>undefined</code>. This flag tells the truth:</p>
<pre><code><span class="tok-comment">// indexed.ts   (compiled with noUncheckedIndexedAccess)</span>
<span class="tok-keyword">const</span> arr = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];
<span class="tok-keyword">const</span> x = arr[<span class="tok-number">10</span>];   <span class="tok-comment">// number normally, number | undefined here</span>
x.<span class="tok-function">toFixed</span>(<span class="tok-number">2</span>);</code></pre>
<div class="out">indexed.ts(4,1): error TS18048: 'x' is possibly 'undefined'.</div>
<p><code>arr[10]</code> doesn't exist, and this flag makes <code>x</code> be <code>number | undefined</code>, forcing a check before use. It's the difference between catching an off-by-one at compile time and getting <code>undefined is not a function</code> in production.</p>

<h3>noImplicitReturns: every path must return</h3>
<p>If a function declares a return type, this flag insists every code path actually returns:</p>
<pre><code><span class="tok-comment">// returns.ts   (compiled with noImplicitReturns)</span>
<span class="tok-keyword">function</span> <span class="tok-function">classify</span>(x: <span class="tok-keyword">number</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">if</span> (x &gt; <span class="tok-number">0</span>) <span class="tok-keyword">return</span> <span class="tok-string">'positive'</span>;
}</code></pre>
<div class="out">returns.ts(2,31): error TS7030: Not all code paths return a value.</div>
<p>The <code>x &lt;= 0</code> branch falls off the end and returns <code>undefined</code>, contradicting the <code>: string</code> promise. Caught.</p>

<h3>noUnusedLocals: dead code is an error</h3>
<p>Flags variables you declare and never read — usually a leftover or a typo:</p>
<pre><code><span class="tok-comment">// unused.ts   (compiled with noUnusedLocals)</span>
<span class="tok-keyword">function</span> <span class="tok-function">total</span>(): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">const</span> scratch = <span class="tok-number">42</span>;
  <span class="tok-keyword">return</span> <span class="tok-number">1</span>;
}</code></pre>
<div class="out">unused.ts(3,9): error TS6133: 'scratch' is declared but its value is never read.</div>
<p>Its sibling <code>noUnusedParameters</code> does the same for function parameters. Together they keep dead code from accumulating — small, but it compounds.</p>

<div class="callout ok">Not everything good is in <code>strict</code>. <code>noUncheckedIndexedAccess</code> (array/object access may be undefined), <code>noImplicitReturns</code> (all paths return), and <code>noUnusedLocals</code>/<code>noUnusedParameters</code> (no dead code) are opt-in. Turn them on at project start — they're painful to add to a large codebase later.</div>
<div class="note-ct">The pre-push checklist here is <code>tsc --noEmit</code> under this project's flags — so whatever safety flags the tsconfig enables become the gate every change must pass before it can ship. The stricter the config, the more the checklist earns its place.</div>
<h3>Beyond strict — three flags worth the noise</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">noUncheckedIndexedAccess</span><span class="lz-t">Index reads may miss</span><span class="lz-d"><code>arr[0]</code> becomes <code>T | undefined</code>. Loud and often annoying, and it is the only flag that models what an array or dictionary actually promises.</span></div>
<div class="lz-node"><span class="lz-k">noImplicitReturns</span><span class="lz-t">Every path returns</span><span class="lz-d">Catches the branch you forgot in a long <code>if</code>/<code>else</code> chain — the one that silently returns <code>undefined</code>.</span></div>
<div class="lz-node"><span class="lz-k">noUnusedLocals / Parameters</span><span class="lz-t">Dead code is an error</span><span class="lz-d">Mostly tidiness, but it also finds the variable you meant to use — the classic "computed it, then returned the old one".</span></div>
<div class="lz-node"><span class="lz-k">exactOptionalPropertyTypes</span><span class="lz-t">Absent ≠ undefined</span><span class="lz-d">Distinguishes "key not there" from "key set to undefined". It matters for anything that serialises, and it is the one most likely to fight your libraries.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>noUnusedParameters</code> and a leading-underscore convention that only works with the compiler's exact rule.</strong> The flag exempts parameters whose name starts with <code>_</code>, which is why <code>(_req, res)</code> compiles. But it exempts them <em>only</em> in that position: an unused <em>local</em> named <code>_x</code> is exempt under <code>noUnusedLocals</code> too, while an unused <em>import</em> named <code>_foo</code> is not — imports are governed by a different rule and will still error. Teams hit this after enabling the flags, prefix everything with <code>_</code>, and are confused when a handful of import errors survive. Delete the unused import; the underscore convention is for parameters you are contractually required to declare but do not use.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: extra safety flags on Code Lab</span><span class="lc-sub">Fix a possibly-undefined index and a missing return.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Vượt strict: các cờ an toàn thêm</h2>
<p class="lead">Vài phép kiểm hữu ích nhất lại <em>không</em> nằm trong <code>strict</code> — bạn tự bật từng cái. Chúng bắt thêm một lớp lỗi thật nữa, và bật sớm rẻ hơn nhiều so với gắn vào sau.</p>

<h3>noUncheckedIndexedAccess: truy cập mảng có thể hụt</h3>
<p>Mặc định, <code>arr[i]</code> có kiểu là kiểu phần tử ngay cả khi chỉ mục vượt phạm vi — một lời nói dối, vì nó có thể là <code>undefined</code>. Cờ này nói thật:</p>
<pre><code><span class="tok-comment">// indexed.ts   (biên dịch với noUncheckedIndexedAccess)</span>
<span class="tok-keyword">const</span> arr = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];
<span class="tok-keyword">const</span> x = arr[<span class="tok-number">10</span>];   <span class="tok-comment">// bình thường là number, ở đây number | undefined</span>
x.<span class="tok-function">toFixed</span>(<span class="tok-number">2</span>);</code></pre>
<div class="out">indexed.ts(4,1): error TS18048: 'x' is possibly 'undefined'.</div>
<p><code>arr[10]</code> không tồn tại, và cờ này làm <code>x</code> thành <code>number | undefined</code>, ép một phép kiểm trước khi dùng. Đó là khác biệt giữa bắt một lỗi lệch-một lúc biên dịch và nhận <code>undefined is not a function</code> trên production.</p>

<h3>noImplicitReturns: mọi nhánh phải trả về</h3>
<p>Nếu một hàm khai báo kiểu trả về, cờ này nhất quyết mọi nhánh code phải thật sự trả về:</p>
<pre><code><span class="tok-comment">// returns.ts   (biên dịch với noImplicitReturns)</span>
<span class="tok-keyword">function</span> <span class="tok-function">classify</span>(x: <span class="tok-keyword">number</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">if</span> (x &gt; <span class="tok-number">0</span>) <span class="tok-keyword">return</span> <span class="tok-string">'positive'</span>;
}</code></pre>
<div class="out">returns.ts(2,31): error TS7030: Not all code paths return a value.</div>
<p>Nhánh <code>x &lt;= 0</code> rơi ra khỏi cuối hàm và trả về <code>undefined</code>, mâu thuẫn với lời hứa <code>: string</code>. Bị bắt.</p>

<h3>noUnusedLocals: code chết là lỗi</h3>
<p>Đánh dấu các biến bạn khai nhưng không bao giờ đọc — thường là đồ thừa hoặc một lỗi gõ:</p>
<pre><code><span class="tok-comment">// unused.ts   (biên dịch với noUnusedLocals)</span>
<span class="tok-keyword">function</span> <span class="tok-function">total</span>(): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">const</span> scratch = <span class="tok-number">42</span>;
  <span class="tok-keyword">return</span> <span class="tok-number">1</span>;
}</code></pre>
<div class="out">unused.ts(3,9): error TS6133: 'scratch' is declared but its value is never read.</div>
<p>Người anh em <code>noUnusedParameters</code> làm điều tương tự cho tham số hàm. Cùng nhau chúng giữ cho code chết khỏi tích tụ — nhỏ, nhưng cộng dồn lại.</p>

<div class="callout ok">Không phải cái tốt nào cũng nằm trong <code>strict</code>. <code>noUncheckedIndexedAccess</code> (truy cập mảng/object có thể undefined), <code>noImplicitReturns</code> (mọi nhánh trả về), và <code>noUnusedLocals</code>/<code>noUnusedParameters</code> (không code chết) là tự-bật. Bật lúc khởi dự án — thêm vào một codebase lớn về sau rất đau.</div>
<div class="note-ct">Checklist trước-khi-push ở đây là <code>tsc --noEmit</code> dưới các cờ của dự án — nên bất cứ cờ an toàn nào tsconfig bật đều trở thành cổng mọi thay đổi phải qua trước khi ship. Config càng chặt, checklist càng đáng chỗ đứng.</div>
<h3>Ngoài strict — ba cờ đáng chịu ồn</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">noUncheckedIndexedAccess</span><span class="lz-t">Đọc theo chỉ mục có thể hụt</span><span class="lz-d"><code>arr[0]</code> thành <code>T | undefined</code>. Ồn ào và hay gây bực, và nó là cờ duy nhất mô hình đúng thứ mà một mảng hay từ điển thật sự hứa.</span></div>
<div class="lz-node"><span class="lz-k">noImplicitReturns</span><span class="lz-t">Mọi nhánh đều trả về</span><span class="lz-d">Bắt cái nhánh bạn quên trong một chuỗi <code>if</code>/<code>else</code> dài — cái nhánh âm thầm trả <code>undefined</code>.</span></div>
<div class="lz-node"><span class="lz-k">noUnusedLocals / Parameters</span><span class="lz-t">Mã chết là lỗi</span><span class="lz-d">Phần lớn là chuyện gọn gàng, nhưng nó cũng tìm ra cái biến bạn định dùng — kiểu kinh điển "tính xong rồi lại trả về cái cũ".</span></div>
<div class="lz-node"><span class="lz-k">exactOptionalPropertyTypes</span><span class="lz-t">Vắng mặt ≠ undefined</span><span class="lz-d">Phân biệt "không có khoá" với "khoá đặt bằng undefined". Nó quan trọng với mọi thứ có tuần tự hoá, và cũng là cờ dễ đánh nhau với thư viện của bạn nhất.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>noUnusedParameters</code> với quy ước gạch dưới đầu tên chỉ đúng theo luật chính xác của trình biên dịch.</strong> Cờ này miễn trừ các tham số có tên bắt đầu bằng <code>_</code>, và đó là lý do <code>(_req, res)</code> biên dịch được. Nhưng nó chỉ miễn trừ <em>ở vị trí đó</em>: một <em>biến cục bộ</em> không dùng tên <code>_x</code> cũng được miễn dưới <code>noUnusedLocals</code>, còn một <em>import</em> không dùng tên <code>_foo</code> thì KHÔNG — import bị chi phối bởi luật khác và vẫn báo lỗi. Các đội hay dính chuyện này sau khi bật cờ, thêm <code>_</code> vào mọi thứ, rồi ngơ ngác vì vài lỗi import vẫn còn. Hãy xoá cái import không dùng đi; quy ước gạch dưới là dành cho tham số mà hợp đồng buộc bạn khai nhưng bạn không dùng tới.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: cờ an toàn thêm trên Code Lab</span><span class="lc-sub">Sửa một chỉ mục possibly-undefined và một return thiếu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — target, lib, module & noEmit|||9.4 — target, lib, module & noEmit',
      slug: 'typescript-9-4-target-lib-module',
      type: 'LESSON',
      isFreePreview: true,
      description: 'target hạ cấp cú pháp; lib khai báo API runtime bạn có; module chọn hệ import/export; noEmit biến tsc thành chỉ-kiểm-kiểu — đúng cách repo này chạy CI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>target, lib, module &amp; noEmit</h2>
<p class="lead">Four options that decide what your code compiles <em>to</em> and against. Getting them wrong produces confusing errors about missing methods; getting them right is mostly a one-time setup you rarely touch again.</p>

<h3>target vs lib: syntax vs APIs</h3>
<p><code>target</code> controls which JS <em>syntax</em> is emitted (you saw ES5 turn <code>const</code> into <code>var</code>). <code>lib</code> is separate: it declares which runtime <em>APIs</em> TypeScript believes exist. Set a low target without the right lib and modern methods vanish:</p>
<pre><code><span class="tok-comment">// libtarget.ts   (compiled with target ES5)</span>
<span class="tok-keyword">const</span> nums = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];
<span class="tok-keyword">const</span> found = nums.<span class="tok-function">includes</span>(<span class="tok-number">2</span>);   <span class="tok-comment">// Array.includes needs ES2016+</span></code></pre>
<div class="out">libtarget.ts(3,20): error TS2550: Property 'includes' does not exist on type 'number[]'. Do you need to change your target library? Try changing the 'lib' compiler option to 'es2016' or later.</div>
<p><code>Array.prototype.includes</code> was added in ES2016, and with a target of ES5 TypeScript's default lib doesn't include it — so it refuses. The fix is to raise <code>target</code> (which also raises the default <code>lib</code>) or set <code>lib</code> explicitly. The error even tells you which. For a Node app you'd also add <code>"DOM"</code> to <code>lib</code> only if you use browser APIs.</p>

<h3>module: how imports compile</h3>
<p><code>module</code> chooses the output module system — <code>NodeNext</code> / <code>ESNext</code> for modern ES modules, <code>CommonJS</code> for classic Node <code>require</code>. Paired with <code>esModuleInterop: true</code>, it lets <code>import express from 'express'</code> work smoothly against CommonJS packages. This is the setting most likely to differ between a backend and a bundled frontend.</p>

<h3>noEmit: type-check without producing files</h3>
<p><code>noEmit: true</code> — or <code>tsc --noEmit</code> — runs the full type-check and writes <em>nothing</em>. It's how you use TypeScript purely as a checker when another tool (a bundler, <code>ts-node</code>, Next.js) does the actual compiling:</p>
<pre><code><span class="tok-comment"># type-check only — no .js written, exit code says pass/fail</span>
npx tsc --noEmit</code></pre>
<p>This is the exact command in a CI gate: it fails the build if any type is wrong, without cluttering the tree with output. Emit is someone else's job; correctness is tsc's.</p>

<div class="callout ok"><code>target</code> = which JS syntax to emit; <code>lib</code> = which runtime APIs exist; <code>module</code> = which import/export system; <code>noEmit</code> = check only, write nothing. The "does not exist, change your lib" error almost always means target/lib are set below the API you're using.</div>
<div class="note-ct">This repo's pre-push gate is literally <code>npx tsc --noEmit</code> (and a separate <code>tsc --noEmit</code> in the frontend) — TypeScript checks, while Docker/Next build the actual artifacts. That split is why a green <code>tsc --noEmit</code> can still miss a runtime seed break: <code>noEmit</code> checks types, it doesn't run code (the enum-rename incident in the error log).</div>
<h3>target, lib and module answer different questions</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">target — what syntax to emit</span><span class="lz-d">Set it to <code>ES2015</code> and an arrow function stays an arrow. Set it to <code>ES5</code> and it is rewritten into a <code>function</code>, along with classes, <code>async</code>, and destructuring.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">lib — what APIs to assume exist</span><span class="lz-d">Purely a set of type declarations. Adding <code>ES2022</code> to <code>lib</code> makes <code>Array.prototype.at</code> type-check; it does not put the method into an old runtime.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">module — how imports compile</span><span class="lz-d">Whether <code>import x from 'y'</code> becomes <code>require</code> or stays ESM. This is the setting that actually decides whether Node can load your output.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">target sets lib's default, then you override</span><span class="lz-d">Which is why raising <code>target</code> alone can quietly turn on newer APIs — and why an explicit <code>lib</code> is worth writing down.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>lib</code> is a promise about the runtime that nobody verifies.</strong> Adding <code>"lib": ["ES2023"]</code> makes <code>arr.findLast(…)</code> compile perfectly. If the code then runs on a Node version that does not implement it, you get <code>TypeError: arr.findLast is not a function</code> — at runtime, in production, from a line the type checker blessed. <code>lib</code> only ships declarations; it never polyfills. Keep it aligned with the oldest runtime you actually support (this repo pins Node 22 in <code>package.json engines</code>, so the answer is knowable), and remember the same trap in reverse for the browser: a <code>lib</code> that includes <code>DOM</code> in a Node project makes <code>document</code> type-check in code that will crash on the server.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: target, lib &amp; noEmit on Code Lab</span><span class="lc-sub">Fix a missing-lib error and run a type-check-only pass.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>target, lib, module &amp; noEmit</h2>
<p class="lead">Bốn tuỳ chọn quyết định code của bạn biên dịch <em>thành</em> gì và dựa vào cái gì. Đặt sai chúng sinh ra những lỗi khó hiểu về phương thức bị thiếu; đặt đúng thì đa phần là thiết lập một lần, hiếm khi đụng lại.</p>

<h3>target so với lib: cú pháp so với API</h3>
<p><code>target</code> điều khiển <em>cú pháp</em> JS nào được xuất (bạn đã thấy ES5 biến <code>const</code> thành <code>var</code>). <code>lib</code> thì riêng: nó khai báo những <em>API</em> runtime mà TypeScript tin là tồn tại. Đặt target thấp mà thiếu lib đúng thì các phương thức hiện đại biến mất:</p>
<pre><code><span class="tok-comment">// libtarget.ts   (biên dịch với target ES5)</span>
<span class="tok-keyword">const</span> nums = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];
<span class="tok-keyword">const</span> found = nums.<span class="tok-function">includes</span>(<span class="tok-number">2</span>);   <span class="tok-comment">// Array.includes cần ES2016+</span></code></pre>
<div class="out">libtarget.ts(3,20): error TS2550: Property 'includes' does not exist on type 'number[]'. Do you need to change your target library? Try changing the 'lib' compiler option to 'es2016' or later.</div>
<p><code>Array.prototype.includes</code> được thêm ở ES2016, và với target ES5, lib mặc định của TypeScript không có nó — nên nó từ chối. Cách sửa là nâng <code>target</code> (kéo theo nâng <code>lib</code> mặc định) hoặc đặt <code>lib</code> tường minh. Lỗi thậm chí nói bạn nên đặt cái nào. Với một app Node bạn chỉ thêm <code>"DOM"</code> vào <code>lib</code> nếu có dùng API trình duyệt.</p>

<h3>module: import biên dịch ra sao</h3>
<p><code>module</code> chọn hệ module đầu ra — <code>NodeNext</code> / <code>ESNext</code> cho ES module hiện đại, <code>CommonJS</code> cho <code>require</code> kiểu Node cổ điển. Ghép với <code>esModuleInterop: true</code>, nó cho <code>import express from 'express'</code> chạy mượt với các gói CommonJS. Đây là thiết lập dễ khác nhau nhất giữa một backend và một frontend đóng gói (bundle).</p>

<h3>noEmit: kiểm kiểu mà không sinh file</h3>
<p><code>noEmit: true</code> — hay <code>tsc --noEmit</code> — chạy trọn phép kiểm kiểu và <em>không</em> ghi gì. Đó là cách dùng TypeScript thuần như một bộ kiểm khi một công cụ khác (bundler, <code>ts-node</code>, Next.js) mới thật sự biên dịch:</p>
<pre><code><span class="tok-comment"># chỉ kiểm kiểu — không ghi .js, mã thoát cho biết qua/trượt</span>
npx tsc --noEmit</code></pre>
<p>Đây đúng là lệnh trong một cổng CI: nó làm build thất bại nếu có kiểu nào sai, mà không bừa bộn cây thư mục bằng file xuất. Xuất file là việc của người khác; tính đúng đắn là việc của tsc.</p>

<div class="callout ok"><code>target</code> = xuất cú pháp JS nào; <code>lib</code> = API runtime nào tồn tại; <code>module</code> = hệ import/export nào; <code>noEmit</code> = chỉ kiểm, không ghi gì. Lỗi "does not exist, change your lib" gần như luôn nghĩa là target/lib đang đặt thấp hơn API bạn đang dùng.</div>
<div class="note-ct">Cổng trước-khi-push của repo này đúng là <code>npx tsc --noEmit</code> (và một <code>tsc --noEmit</code> riêng ở frontend) — TypeScript kiểm, còn Docker/Next dựng artifact thật. Chính sự tách đó là lý do một <code>tsc --noEmit</code> xanh vẫn có thể bỏ lọt một seed vỡ lúc chạy: <code>noEmit</code> kiểm kiểu, nó không chạy code (sự cố đổi tên enum trong nhật ký lỗi).</div>
<h3>target, lib và module trả lời ba câu hỏi khác nhau</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">target — sinh ra cú pháp nào</span><span class="lz-d">Đặt <code>ES2015</code> thì một arrow function vẫn là arrow. Đặt <code>ES5</code> thì nó bị viết lại thành <code>function</code>, cùng với class, <code>async</code> và phép rã.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">lib — giả định những API nào có sẵn</span><span class="lz-d">Thuần tuý là một tập khai báo kiểu. Thêm <code>ES2022</code> vào <code>lib</code> làm <code>Array.prototype.at</code> qua kiểm kiểu; nó KHÔNG đặt phương thức đó vào một runtime cũ.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">module — import biên dịch ra sao</span><span class="lz-d">Quyết định <code>import x from 'y'</code> thành <code>require</code> hay giữ ESM. Đây mới là thiết lập thật sự định đoạt Node có nạp nổi đầu ra của bạn không.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">target đặt mặc định cho lib, rồi bạn ghi đè</span><span class="lz-d">Đó là lý do chỉ nâng <code>target</code> thôi cũng có thể âm thầm bật các API mới hơn — và là lý do một <code>lib</code> tường minh đáng được viết ra.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>lib</code> là một lời hứa về runtime mà chẳng ai kiểm chứng.</strong> Thêm <code>"lib": ["ES2023"]</code> làm <code>arr.findLast(…)</code> biên dịch ngon lành. Nếu mã đó rồi chạy trên một phiên bản Node không hiện thực nó, bạn nhận <code>TypeError: arr.findLast is not a function</code> — lúc chạy, trên production, từ một dòng mà bộ kiểm kiểu đã ban phước. <code>lib</code> chỉ ship khai báo; nó không bao giờ polyfill. Hãy giữ nó khớp với runtime cũ nhất bạn thật sự hỗ trợ (kho này ghim Node 22 trong <code>package.json engines</code>, nên đáp án là biết được), và nhớ cái bẫy ngược lại phía trình duyệt: một <code>lib</code> có <code>DOM</code> trong dự án Node làm <code>document</code> qua kiểm kiểu trong đoạn mã sẽ sập trên máy chủ.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: target, lib &amp; noEmit trên Code Lab</span><span class="lc-sub">Sửa một lỗi thiếu-lib và chạy một lượt chỉ-kiểm-kiểu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.5 quiz ─────────────────────────── */
    {
      title: '9.5 — Chapter 9 quiz|||9.5 — Kiểm tra Chương 9',
      slug: 'typescript-9-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về việc tsc làm gì, tsconfig, strict mode, các cờ an toàn thêm, và target/lib/module/noEmit.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the compiler and its configuration — the setup every TypeScript project depends on. Questions follow lesson order.</p>
<div class="callout ok">Aim for 7/8. The one that matters most in practice: <code>strict: true</code> and what it buys you (9.2). If you remember nothing else from this chapter, remember to turn it on.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về trình biên dịch và cấu hình của nó — thiết lập mà mọi dự án TypeScript phụ thuộc vào. Các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Câu quan trọng nhất thực chiến: <code>strict: true</code> và thứ nó mang lại (9.2). Nếu không nhớ gì khác từ chương này, hãy nhớ bật nó lên.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which three jobs does tsc do?|||tsc làm ba việc nào?',
            options: [
              'Minify, bundle, and deploy|||Nén, gói, và triển khai',
              'Type-check, erase types, and downlevel syntax to the target|||Kiểm kiểu, xoá kiểu, và hạ cấp cú pháp xuống target',
              'Lint, format, and test|||Kiểm lint, định dạng, và test',
              'Type-check only|||Chỉ kiểm kiểu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After tsc compiles a .ts file, do the type annotations exist in the emitted .js?|||Sau khi tsc biên dịch một file .ts, các chú thích kiểu có tồn tại trong .js xuất ra không?',
            options: [
              'Yes — they are kept as comments|||Có — chúng được giữ làm chú thích',
              'No — types are erased; the output is plain JavaScript|||Không — kiểu bị xoá; đầu ra là JavaScript thuần',
              'Only in strict mode|||Chỉ trong chế độ strict',
              'Only interfaces are kept|||Chỉ interface được giữ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does "strict": true do?|||"strict": true làm gì?',
            options: [
              'Turns on a family of safety flags including noImplicitAny and strictNullChecks|||Bật cả một họ cờ an toàn gồm noImplicitAny và strictNullChecks',
              'Makes the compiler run faster|||Làm trình biên dịch chạy nhanh hơn',
              'Only one flag: noImplicitAny|||Chỉ một cờ: noImplicitAny',
              'Disables type checking|||Tắt kiểm kiểu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'function len(s: string | null) { return s.length } under strictNullChecks gives?|||function len(s: string | null) { return s.length } dưới strictNullChecks cho ra?',
            options: [
              'No error|||Không lỗi',
              "TS18047: 's' is possibly 'null' — you must narrow first|||TS18047: 's' is possibly 'null' — phải thu hẹp trước",
              'A runtime error only|||Chỉ lỗi lúc chạy',
              'It coerces null to ""|||Nó ép null thành ""',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Is noUncheckedIndexedAccess included in strict?|||noUncheckedIndexedAccess có nằm trong strict không?',
            options: [
              'Yes|||Có',
              'No — it is opt-in; you enable it separately|||Không — nó là tự-bật; bạn bật riêng',
              'Only with strictNullChecks|||Chỉ khi có strictNullChecks',
              'It is on by default always|||Nó luôn bật mặc định',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With noUncheckedIndexedAccess, what type is arr[10] for const arr = [1,2,3]?|||Với noUncheckedIndexedAccess, arr[10] có kiểu gì với const arr = [1,2,3]?',
            options: [
              'number',
              'number | undefined',
              'never',
              'any',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You get "Property includes does not exist… change your lib to es2016". What is wrong?|||Bạn gặp "Property includes does not exist… change your lib to es2016". Sai ở đâu?',
            options: [
              'includes is not a real method|||includes không phải phương thức thật',
              'target/lib is set below the ES version that added the API|||target/lib đang đặt thấp hơn phiên bản ES đã thêm API đó',
              'You must import includes|||Bạn phải import includes',
              'The array is the wrong type|||Mảng sai kiểu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does tsc --noEmit do?|||tsc --noEmit làm gì?',
            options: [
              'Compiles but skips type checking|||Biên dịch nhưng bỏ kiểm kiểu',
              'Runs the full type-check and writes no output files|||Chạy trọn phép kiểm kiểu và không ghi file đầu ra nào',
              'Emits only .d.ts files|||Chỉ xuất file .d.ts',
              'Deletes the dist folder|||Xoá thư mục dist',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
