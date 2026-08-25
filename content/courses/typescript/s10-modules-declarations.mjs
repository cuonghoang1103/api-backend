/**
 * TypeScript — Chương 10: Module & khai báo kiểu (.d.ts).
 * Mọi output tsc là THẬT (tsc --strict, verified). Song ngữ .ml-en/.ml-vi.
 * < > → &lt; &gt;; & → &amp;; KHÔNG backtick trần (&#96;); ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 10 — Modules & declarations|||Chương 10 — Module & khai báo kiểu (.d.ts)',
  description: 'Kiểu đi qua biên giới module: export/import & import type; file khai báo .d.ts cho thư viện JS không kiểu; declare global & module augmentation; và lấy kiểu từ package (@types).',
  lessons: [
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — ES modules & the type boundary|||10.1 — ES module & biên giới kiểu',
      slug: 'typescript-10-1-es-modules',
      type: 'LESSON',
      isFreePreview: true,
      description: 'export/import (named, default, import type) — và điều quan trọng: kiểu đi qua biên giới module, nên gọi sai một hàm ở file khác vẫn bị bắt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>ES modules &amp; the type boundary</h2>
<p class="lead">Every <code>.ts</code> file with an <code>import</code> or <code>export</code> is a module — a self-contained unit whose top-level names are private unless exported. The important part for TypeScript: types travel across that boundary, so a wrong call in one file is caught against the declaration in another.</p>

<h3>Exporting: named, default, and types</h3>
<p>You can export values and types side by side. <code>export</code> in front of a declaration is a named export; <code>export default</code> marks the one main export:</p>
<pre><code><span class="tok-comment">// math.ts</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">function</span> <span class="tok-function">add</span>(a: <span class="tok-keyword">number</span>, b: <span class="tok-keyword">number</span>): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> a + b; }
<span class="tok-keyword">export</span> <span class="tok-keyword">const</span> PI = <span class="tok-number">3.14159</span>;
<span class="tok-keyword">export</span> <span class="tok-keyword">type</span> Vec2 = { x: <span class="tok-keyword">number</span>; y: <span class="tok-keyword">number</span> };
<span class="tok-keyword">export</span> <span class="tok-keyword">default</span> <span class="tok-keyword">function</span> <span class="tok-function">identity</span>&lt;T&gt;(x: T): T { <span class="tok-keyword">return</span> x; }</code></pre>

<h3>Importing — and <code>import type</code></h3>
<p>The default import needs no braces; named imports go in braces. A type-only import uses <code>import type</code> (or the inline <code>type</code> keyword), which the compiler erases entirely — it never becomes a runtime <code>require</code>:</p>
<pre><code><span class="tok-comment">// app.ts</span>
<span class="tok-keyword">import</span> identity, { add, PI, <span class="tok-keyword">type</span> Vec2 } <span class="tok-keyword">from</span> <span class="tok-string">'./math.js'</span>;
<span class="tok-keyword">const</span> v: Vec2 = { x: <span class="tok-number">1</span>, y: <span class="tok-number">2</span> };
<span class="tok-keyword">const</span> sum: <span class="tok-keyword">number</span> = <span class="tok-function">add</span>(v.x, v.y);
<span class="tok-function">identity</span>(PI);
<span class="tok-function">add</span>(<span class="tok-number">1</span>, <span class="tok-string">'two'</span>);   <span class="tok-comment">// wrong arg type crosses the module boundary</span></code></pre>
<div class="out">app.ts(6,8): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.</div>
<p>The mistake is in <code>app.ts</code>, but it's caught against <code>add</code>'s signature declared in <code>math.ts</code> — types are checked <em>across</em> files, not just within one. Two details worth noting: the import path ends in <code>.js</code> (under modern <code>NodeNext</code> resolution you reference the compiled output), and <code>import type</code> is the right choice when you only need a type — it makes the type-only dependency explicit and guarantees it vanishes from the emitted JavaScript.</p>

<div class="callout ok">A module's exported names are its public API; everything else is private. Types cross the import boundary just like values, so the compiler checks a call site in one file against the declaration in another. Use <code>import type</code> for type-only imports so they never leak into runtime code.</div>
<div class="note-ct">This is why a change to a service's signature immediately red-flags every route that calls it wrong — the type crosses the module boundary. The frontend uses <code>import type</code> heavily for shared DTO types so pulling a type from the API layer never accidentally bundles server code into the browser.</div>
<h3>Why import type exists</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A plain import is a runtime dependency</span><span class="lz-d"><code>import { User } from './user'</code> emits a real <code>require</code>/<code>import</code> — unless the compiler can see every use was type-only and elides it.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Elision is a whole-file decision</span><span class="lz-d">The compiler drops the import only when <em>nothing</em> in it is used as a value. One value use keeps the whole statement, and with it the module's side effects.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">import type states the intent</span><span class="lz-d">It is guaranteed erased, and it is an error to use the binding as a value. No guessing, and no accidental runtime edge.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Single-file transpilers need it</span><span class="lz-d">esbuild, swc and Babel compile one file at a time and cannot know whether a name is a type. <code>isolatedModules</code> (chapter 15) makes that requirement explicit.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — import elision silently removes a module's side effects.</strong> A module whose only job is to run something on load — registering a Prisma middleware, patching a global, installing a polyfill — is dropped entirely if you import only types from it: <code>import { Handler } from './register-hooks'</code> compiles to nothing, and the hooks never register. The failure appears at runtime as "the feature just does not happen", far from the import that caused it, and it can flip based on an unrelated edit that adds or removes a value use. Import a module for its side effects with the bare form: <code>import './register-hooks'</code>, on its own line, with a comment saying why.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: modules on Code Lab</span><span class="lc-sub">Split code into modules and import across the boundary.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>ES module &amp; biên giới kiểu</h2>
<p class="lead">Mỗi file <code>.ts</code> có một <code>import</code> hay <code>export</code> là một module — một đơn vị khép kín mà các tên ở cấp cao nhất là riêng tư trừ khi được export. Phần quan trọng với TypeScript: kiểu đi qua biên giới đó, nên một lời gọi sai ở một file bị bắt dựa trên khai báo ở file khác.</p>

<h3>Export: named, default, và kiểu</h3>
<p>Bạn export cả giá trị lẫn kiểu song song. <code>export</code> trước một khai báo là named export; <code>export default</code> đánh dấu export chính duy nhất:</p>
<pre><code><span class="tok-comment">// math.ts</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">function</span> <span class="tok-function">add</span>(a: <span class="tok-keyword">number</span>, b: <span class="tok-keyword">number</span>): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> a + b; }
<span class="tok-keyword">export</span> <span class="tok-keyword">const</span> PI = <span class="tok-number">3.14159</span>;
<span class="tok-keyword">export</span> <span class="tok-keyword">type</span> Vec2 = { x: <span class="tok-keyword">number</span>; y: <span class="tok-keyword">number</span> };
<span class="tok-keyword">export</span> <span class="tok-keyword">default</span> <span class="tok-keyword">function</span> <span class="tok-function">identity</span>&lt;T&gt;(x: T): T { <span class="tok-keyword">return</span> x; }</code></pre>

<h3>Import — và <code>import type</code></h3>
<p>Import default không cần ngoặc nhọn; import named đặt trong ngoặc nhọn. Một import chỉ-kiểu dùng <code>import type</code> (hoặc từ khoá <code>type</code> nội dòng), thứ mà trình biên dịch xoá hoàn toàn — nó không bao giờ thành một <code>require</code> lúc chạy:</p>
<pre><code><span class="tok-comment">// app.ts</span>
<span class="tok-keyword">import</span> identity, { add, PI, <span class="tok-keyword">type</span> Vec2 } <span class="tok-keyword">from</span> <span class="tok-string">'./math.js'</span>;
<span class="tok-keyword">const</span> v: Vec2 = { x: <span class="tok-number">1</span>, y: <span class="tok-number">2</span> };
<span class="tok-keyword">const</span> sum: <span class="tok-keyword">number</span> = <span class="tok-function">add</span>(v.x, v.y);
<span class="tok-function">identity</span>(PI);
<span class="tok-function">add</span>(<span class="tok-number">1</span>, <span class="tok-string">'two'</span>);   <span class="tok-comment">// đối số sai kiểu, băng qua biên giới module</span></code></pre>
<div class="out">app.ts(6,8): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.</div>
<p>Lỗi nằm ở <code>app.ts</code>, nhưng bị bắt dựa trên chữ ký của <code>add</code> khai báo trong <code>math.ts</code> — kiểu được kiểm <em>xuyên</em> file, không chỉ trong một file. Hai chi tiết đáng để ý: đường dẫn import kết thúc bằng <code>.js</code> (dưới resolution <code>NodeNext</code> hiện đại, bạn tham chiếu tới đầu ra đã biên dịch), và <code>import type</code> là lựa chọn đúng khi bạn chỉ cần một kiểu — nó làm phụ thuộc chỉ-kiểu tường minh và bảo đảm nó biến mất khỏi JavaScript xuất ra.</p>

<div class="callout ok">Các tên được export của một module là API công khai của nó; mọi thứ khác là riêng tư. Kiểu băng qua biên giới import y như giá trị, nên trình biên dịch kiểm một chỗ gọi ở file này dựa trên khai báo ở file khác. Dùng <code>import type</code> cho import chỉ-kiểu để chúng không bao giờ rò vào code lúc chạy.</div>
<div class="note-ct">Đây là lý do một thay đổi ở chữ ký của một service lập tức tô đỏ mọi route gọi nó sai — kiểu băng qua biên giới module. Frontend dùng <code>import type</code> nhiều cho các kiểu DTO dùng chung, để lấy một kiểu từ lớp API không vô tình đóng gói code server vào trình duyệt.</div>
<h3>Vì sao có import type</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một import thường là phụ thuộc lúc chạy</span><span class="lz-d"><code>import { User } from './user'</code> sinh ra một <code>require</code>/<code>import</code> thật — trừ khi trình biên dịch thấy được mọi chỗ dùng đều chỉ là kiểu rồi bỏ nó đi.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Việc bỏ đi là quyết định trên cả file</span><span class="lz-d">Trình biên dịch chỉ bỏ import khi <em>không gì</em> trong đó được dùng như giá trị. Một chỗ dùng như giá trị là giữ lại cả câu lệnh, và giữ luôn tác dụng phụ của module.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">import type nói rõ ý định</span><span class="lz-d">Nó chắc chắn bị xoá, và dùng tên đó như giá trị là lỗi. Không phải đoán, và không có cạnh runtime ngoài ý muốn.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Trình dịch từng-file cần nó</span><span class="lz-d">esbuild, swc và Babel dịch mỗi lần một file và không biết được một cái tên là kiểu hay không. <code>isolatedModules</code> (chương 15) biến đòi hỏi đó thành tường minh.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — việc bỏ import âm thầm gỡ luôn tác dụng phụ của một module.</strong> Một module mà việc duy nhất là chạy cái gì đó lúc nạp — đăng ký một middleware Prisma, vá một biến toàn cục, cài một polyfill — sẽ bị bỏ sạch nếu bạn chỉ import kiểu từ nó: <code>import { Handler } from './register-hooks'</code> biên dịch ra con số không, và các hook chẳng bao giờ được đăng ký. Sự cố hiện ra lúc chạy dưới dạng "tính năng đơn giản là không xảy ra", xa tít cái import đã gây ra nó, và nó có thể lật qua lật lại theo một chỉnh sửa chẳng liên quan làm thêm hay bớt một chỗ dùng giá trị. Hãy import một module vì tác dụng phụ bằng dạng trần: <code>import './register-hooks'</code>, đứng riêng một dòng, kèm một comment nói vì sao.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: module trên Code Lab</span><span class="lc-sub">Tách code thành module và import qua biên giới.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — Declaration files (.d.ts)|||10.2 — File khai báo (.d.ts)',
      slug: 'typescript-10-2-declaration-files',
      type: 'LESSON',
      isFreePreview: true,
      description: 'File .d.ts chỉ chứa kiểu, không code. Cách gõ kiểu cho một package JS không có kiểu bằng declare module, và cho một file JS tương đối bằng .d.ts đặt cạnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Declaration files (.d.ts)</h2>
<p class="lead">A <code>.d.ts</code> file contains <em>only</em> types — declarations, no implementations. It's how you describe the shape of code that has none of its own: an untyped JavaScript library, a global injected by a script, or a compiled output. Think of it as a header file for JavaScript.</p>

<h3>The problem: an untyped import is <code>any</code></h3>
<p>Import from a JavaScript package that ships no types and, under strict settings, TypeScript refuses rather than silently giving you <code>any</code>:</p>
<pre><code><span class="tok-comment">// use.ts — importing a JS package with no bundled types</span>
<span class="tok-keyword">import</span> { fire } <span class="tok-keyword">from</span> <span class="tok-string">'confetti-cannon'</span>;
<span class="tok-function">fire</span>(<span class="tok-number">100</span>);</code></pre>
<div class="out">error TS7016: Could not find a declaration file for module 'confetti-cannon'. … implicitly has an 'any' type.</div>
<p>You could reach for <code>any</code>, but the better fix is to <em>describe</em> the module once.</p>

<h3>declare module: type an untyped package</h3>
<p>An ambient declaration names a module and lists its exports. Put this in a <code>.d.ts</code> anywhere the compiler includes:</p>
<pre><code><span class="tok-comment">// shims.d.ts — hand-written types for an untyped package</span>
<span class="tok-keyword">declare</span> <span class="tok-keyword">module</span> <span class="tok-string">'confetti-cannon'</span> {
  <span class="tok-keyword">export</span> <span class="tok-keyword">function</span> <span class="tok-function">fire</span>(count: <span class="tok-keyword">number</span>): <span class="tok-keyword">void</span>;
}</code></pre>
<p>Now the import resolves and, crucially, is <em>checked</em>: the wrong argument type is caught just like any typed function.</p>
<pre><code><span class="tok-function">fire</span>(<span class="tok-number">100</span>);        <span class="tok-comment">// ok — matches the ambient declaration</span>
<span class="tok-function">fire</span>(<span class="tok-string">'lots'</span>);     <span class="tok-comment">// wrong arg type, still checked</span></code></pre>
<div class="out">use.ts(4,6): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.</div>

<h3>Sidecar .d.ts for a relative JS file</h3>
<p>For a local <code>.js</code> file you're gradually typing, don't use <code>declare module</code> (it can't name a relative path). Instead put a <code>.d.ts</code> with the <em>same basename</em> next to it — <code>legacy.js</code> gets a <code>legacy.d.ts</code> — and export the types directly:</p>
<pre><code><span class="tok-comment">// legacy.d.ts — sits next to legacy.js, same basename</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">function</span> <span class="tok-function">shout</span>(s: <span class="tok-keyword">string</span>): <span class="tok-keyword">string</span>;</code></pre>
<div class="out">use.ts(2,7): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.</div>
<p>TypeScript pairs <code>legacy.d.ts</code> with <code>legacy.js</code> automatically, and now <code>shout(42)</code> is a compile error. The <code>.d.ts</code> is the bridge between untyped JS and your typed code.</p>

<div class="callout ok">A <code>.d.ts</code> is types-only. Use <code>declare module 'name'</code> to type an untyped <em>package</em>; use a same-basename sidecar <code>.d.ts</code> to type a relative <em>JS file</em>. Both turn "implicitly any" into real, checked types.</div>
<div class="note-ct">When TypeScript emits, it can generate <code>.d.ts</code> files for your own code (the <code>declaration</code> option) — that's how a published library ships its types. You mostly consume declaration files rather than write them, but writing a small <code>declare module</code> shim is the standard escape hatch for that one dependency that never added types.</div>
<h3>Three ways a package gets types</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Bundled</span><span class="lz-t">types field in package.json</span><span class="lz-d">The library ships its own <code>.d.ts</code>. Always in sync with the code, because the same release produced both. The best case.</span></div>
<div class="lz-node"><span class="lz-k">@types/*</span><span class="lz-t">DefinitelyTyped, a separate package</span><span class="lz-d">Community-maintained and versioned independently — which is exactly why it can drift from the library it describes.</span></div>
<div class="lz-node"><span class="lz-k">declare module 'x'</span><span class="lz-t">Your own stub</span><span class="lz-d">For a package with no types anywhere. Declare only what you use; an empty <code>declare module 'x';</code> makes the whole thing <code>any</code>.</span></div>
<div class="lz-node"><span class="lz-k">Sidecar .d.ts</span><span class="lz-t">For your own JS files</span><span class="lz-d"><code>legacy.js</code> + <code>legacy.d.ts</code> next to it. The compiler pairs them by filename, no config needed.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>@types</code> is a separate package, so it can describe a version you are not running.</strong> Nothing links <code>@types/express</code> 4.17 to <code>express</code> 5.x: install the new major and keep the old types and the compiler happily checks your code against an API that no longer exists — <code>res.send</code> signatures that changed, middleware that moved, options that were removed. Everything builds; the failure is a runtime <code>TypeError</code> or, worse, a silently ignored option. When a library's behaviour disagrees with its types, check the two versions before you doubt your code: <code>npm ls express @types/express</code>. And prefer libraries that bundle their own types — there is no drift when one release ships both.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: declaration files on Code Lab</span><span class="lc-sub">Write a declare-module shim and a sidecar .d.ts.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>File khai báo (.d.ts)</h2>
<p class="lead">Một file <code>.d.ts</code> chỉ chứa <em>kiểu</em> — khai báo, không có phần cài đặt. Đó là cách bạn mô tả hình dạng của code vốn chẳng có kiểu nào: một thư viện JavaScript không kiểu, một biến toàn cục do một script tiêm vào, hay một đầu ra đã biên dịch. Hãy xem nó như một file header cho JavaScript.</p>

<h3>Vấn đề: import không kiểu là <code>any</code></h3>
<p>Import từ một package JavaScript không kèm kiểu, và dưới thiết lập strict, TypeScript từ chối thay vì âm thầm cho bạn <code>any</code>:</p>
<pre><code><span class="tok-comment">// use.ts — import một package JS không đóng gói kiểu</span>
<span class="tok-keyword">import</span> { fire } <span class="tok-keyword">from</span> <span class="tok-string">'confetti-cannon'</span>;
<span class="tok-function">fire</span>(<span class="tok-number">100</span>);</code></pre>
<div class="out">error TS7016: Could not find a declaration file for module 'confetti-cannon'. … implicitly has an 'any' type.</div>
<p>Bạn có thể dùng tới <code>any</code>, nhưng cách tốt hơn là <em>mô tả</em> module đó một lần.</p>

<h3>declare module: gõ kiểu một package không kiểu</h3>
<p>Một khai báo ambient đặt tên một module và liệt kê các export của nó. Đặt cái này vào một <code>.d.ts</code> ở bất cứ đâu trình biên dịch có bao gồm:</p>
<pre><code><span class="tok-comment">// shims.d.ts — kiểu viết tay cho một package không kiểu</span>
<span class="tok-keyword">declare</span> <span class="tok-keyword">module</span> <span class="tok-string">'confetti-cannon'</span> {
  <span class="tok-keyword">export</span> <span class="tok-keyword">function</span> <span class="tok-function">fire</span>(count: <span class="tok-keyword">number</span>): <span class="tok-keyword">void</span>;
}</code></pre>
<p>Giờ import phân giải được và, quan trọng nhất, được <em>kiểm</em>: đối số sai kiểu bị bắt y như bất kỳ hàm có kiểu nào.</p>
<pre><code><span class="tok-function">fire</span>(<span class="tok-number">100</span>);        <span class="tok-comment">// ok — khớp khai báo ambient</span>
<span class="tok-function">fire</span>(<span class="tok-string">'lots'</span>);     <span class="tok-comment">// đối số sai kiểu, vẫn bị kiểm</span></code></pre>
<div class="out">use.ts(4,6): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.</div>

<h3>.d.ts đặt cạnh cho một file JS tương đối</h3>
<p>Với một file <code>.js</code> cục bộ bạn đang dần gõ kiểu, đừng dùng <code>declare module</code> (nó không đặt tên được đường dẫn tương đối). Thay vào đó đặt một <code>.d.ts</code> <em>cùng basename</em> bên cạnh nó — <code>legacy.js</code> có một <code>legacy.d.ts</code> — và export kiểu trực tiếp:</p>
<pre><code><span class="tok-comment">// legacy.d.ts — nằm cạnh legacy.js, cùng basename</span>
<span class="tok-keyword">export</span> <span class="tok-keyword">function</span> <span class="tok-function">shout</span>(s: <span class="tok-keyword">string</span>): <span class="tok-keyword">string</span>;</code></pre>
<div class="out">use.ts(2,7): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.</div>
<p>TypeScript tự ghép <code>legacy.d.ts</code> với <code>legacy.js</code>, và giờ <code>shout(42)</code> là lỗi biên dịch. File <code>.d.ts</code> là cây cầu giữa JS không kiểu và code có kiểu của bạn.</p>

<div class="callout ok">Một <code>.d.ts</code> chỉ có kiểu. Dùng <code>declare module 'name'</code> để gõ kiểu một <em>package</em> không kiểu; dùng một <code>.d.ts</code> cùng basename đặt cạnh để gõ kiểu một <em>file JS</em> tương đối. Cả hai biến "implicitly any" thành kiểu thật, được kiểm.</div>
<div class="note-ct">Khi TypeScript xuất, nó có thể sinh file <code>.d.ts</code> cho chính code của bạn (tuỳ chọn <code>declaration</code>) — đó là cách một thư viện xuất bản kèm kiểu của nó. Bạn chủ yếu tiêu thụ file khai báo hơn là viết chúng, nhưng viết một shim <code>declare module</code> nhỏ là cửa thoát chuẩn cho đúng cái dependency chẳng bao giờ thêm kiểu.</div>
<h3>Ba đường để một package có kiểu</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Đóng gói sẵn</span><span class="lz-t">Trường types trong package.json</span><span class="lz-d">Thư viện tự ship <code>.d.ts</code> của nó. Luôn đồng bộ với mã, vì cùng một bản phát hành sinh ra cả hai. Trường hợp tốt nhất.</span></div>
<div class="lz-node"><span class="lz-k">@types/*</span><span class="lz-t">DefinitelyTyped, một package riêng</span><span class="lz-d">Cộng đồng bảo trì và đánh số phiên bản độc lập — và chính vì thế nó trôi dạt khỏi thư viện mà nó mô tả được.</span></div>
<div class="lz-node"><span class="lz-k">declare module 'x'</span><span class="lz-t">Bản khai của chính bạn</span><span class="lz-d">Cho package chẳng có kiểu ở đâu cả. Chỉ khai những gì bạn dùng; một <code>declare module 'x';</code> rỗng biến cả thư viện thành <code>any</code>.</span></div>
<div class="lz-node"><span class="lz-k">.d.ts đặt cạnh</span><span class="lz-t">Cho file JS của chính bạn</span><span class="lz-d"><code>legacy.js</code> + <code>legacy.d.ts</code> nằm kề. Trình biên dịch ghép chúng theo tên file, không cần cấu hình.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>@types</code> là package riêng, nên nó có thể mô tả một phiên bản bạn không hề chạy.</strong> Chẳng có gì buộc <code>@types/express</code> 4.17 với <code>express</code> 5.x: cài bản major mới mà giữ kiểu cũ thì trình biên dịch vui vẻ kiểm mã của bạn với một API không còn tồn tại — chữ ký <code>res.send</code> đã đổi, middleware đã dời chỗ, tuỳ chọn đã bị gỡ. Mọi thứ build được; sự cố là một <code>TypeError</code> lúc chạy hoặc, tệ hơn, một tuỳ chọn bị lặng lẽ bỏ qua. Khi hành vi của thư viện bất đồng với kiểu của nó, hãy kiểm hai số phiên bản trước khi nghi ngờ mã của mình: <code>npm ls express @types/express</code>. Và hãy ưu tiên thư viện tự đóng gói kiểu — một bản phát hành ship cả hai thì không có chỗ nào trôi dạt.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: file khai báo trên Code Lab</span><span class="lc-sub">Viết một shim declare-module và một .d.ts đặt cạnh.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Global & module augmentation|||10.3 — Bổ sung toàn cục & bổ sung module',
      slug: 'typescript-10-3-augmentation',
      type: 'LESSON',
      isFreePreview: true,
      description: 'declare global thêm thành viên vào một kiểu toàn cục (như Window); module augmentation mở rộng kiểu của một thư viện — pattern gắn req.user vào Express Request.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Global &amp; module augmentation</h2>
<p class="lead">Sometimes you need to <em>add</em> to a type you don't own — a property on the global <code>Window</code>, or a field on a library's interface. Declaration merging lets you do exactly that: <code>declare global</code> for globals, module augmentation for a package's types.</p>

<h3>declare global: extend a global type</h3>
<p>Inside a module (a file with an <code>import</code>/<code>export</code>), a <code>declare global</code> block reopens a global interface and adds to it. Here we tell TypeScript that <code>window</code> has an <code>appVersion</code>:</p>
<pre><code><span class="tok-comment">// global-aug.ts</span>
<span class="tok-keyword">export</span> {};   <span class="tok-comment">// makes this a module so &#96;declare global&#96; is allowed</span>
<span class="tok-keyword">declare</span> <span class="tok-keyword">global</span> {
  <span class="tok-keyword">interface</span> Window {
    appVersion: <span class="tok-keyword">string</span>;
  }
}
window.appVersion = <span class="tok-string">'1.0'</span>;        <span class="tok-comment">// now typed on window</span>
console.<span class="tok-function">log</span>(window.appVresion);   <span class="tok-comment">// typo caught by the augmentation</span></code></pre>
<div class="out">global-aug.ts(9,20): error TS2551: Property 'appVresion' does not exist on type 'Window &amp; typeof globalThis'. Did you mean 'appVersion'?</div>
<p>Because <code>appVersion</code> is now a real member of <code>Window</code>, the typo <code>appVresion</code> is a compile error with a suggestion. The <code>export {}</code> is a small requirement: <code>declare global</code> is only allowed inside a module, so an otherwise-import-free file needs it.</p>

<h3>Module augmentation: extend a library's type</h3>
<p>The same merging works on a package. Reopen one of its interfaces with <code>declare module 'pkg'</code> and add fields. The canonical backend example is attaching the authenticated user to Express's <code>Request</code>:</p>
<pre><code><span class="tok-comment">// express-augment.d.ts</span>
<span class="tok-keyword">import</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">declare</span> <span class="tok-keyword">module</span> <span class="tok-string">'express'</span> {
  <span class="tok-keyword">interface</span> Request {
    user?: { id: <span class="tok-keyword">number</span>; role: <span class="tok-keyword">string</span> };
  }
}</code></pre>
<p>After this, <code>req.user</code> is a known, typed property everywhere in the app — your auth middleware sets it, and every route reads <code>req.user?.id</code> with full type safety, no cast. You extended a third-party type without touching its source.</p>

<div class="callout ok">Declaration merging lets you add to types you don't own. <code>declare global { interface X }</code> augments a global; <code>declare module 'pkg' { interface Y }</code> augments a library. It's additive — you're merging new members into the existing interface, not replacing it.</div>
<div class="note-ct">The <code>req.user</code> augmentation is exactly how auth works across this backend: middleware attaches the decoded token to <code>req.user</code>, and because the Express <code>Request</code> interface is augmented once, every handler gets <code>req.user</code> typed without importing anything or casting. Break the shape here and every route that reads it re-checks.</div>
<h3>Augmentation: the rules that make it work</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">It relies on interface merging</span><span class="lz-t">Chapter 4's mechanism, used deliberately</span><span class="lz-d">You reopen an existing interface and add members. Only interfaces merge — a library that exports its shape as a <code>type</code> cannot be augmented this way.</span></div>
<div class="lz-layer"><span class="lz-k">declare global</span><span class="lz-t">For truly global types</span><span class="lz-d">Reaches <code>globalThis</code>, <code>Window</code>, <code>NodeJS.ProcessEnv</code>. Legal only inside a module (a file with an import or export).</span></div>
<div class="lz-layer"><span class="lz-k">declare module 'pkg'</span><span class="lz-t">For a library's own types</span><span class="lz-d">The classic case is <code>Express.Request</code>, so <code>req.user</code> type-checks after your auth middleware sets it.</span></div>
<div class="lz-layer"><span class="lz-k">The file must be in the program</span><span class="lz-t">Or nothing happens at all</span><span class="lz-d">Augmentations apply only if <code>tsc</code> includes the file. A <code>types/</code> directory outside <code>include</code> is invisible — the commonest reason "it works for me".</span></div>
</div>
<div class="pitfall"><p><strong>Trap — augmenting <code>Express.Request</code> with <code>user: User</code> instead of <code>user?: User</code>.</strong> The augmentation is a claim about <em>every</em> request object, and it is false: on any route that runs before (or without) your auth middleware, <code>req.user</code> is genuinely <code>undefined</code>. Declaring it non-optional makes the compiler stop asking, so a handler mounted on a public route reads <code>req.user.id</code>, type-checks perfectly, and throws in production. Declare it optional and let each handler narrow — or, better, have the middleware hand the value on in a typed local rather than smuggling it through a global shape, so the type reflects where the value actually exists.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: augmentation on Code Lab</span><span class="lc-sub">Augment a global and a library interface.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Bổ sung toàn cục &amp; bổ sung module</h2>
<p class="lead">Đôi khi bạn cần <em>thêm</em> vào một kiểu bạn không sở hữu — một thuộc tính trên <code>Window</code> toàn cục, hay một field trên interface của một thư viện. Gộp khai báo (declaration merging) cho bạn làm đúng điều đó: <code>declare global</code> cho toàn cục, module augmentation cho kiểu của một package.</p>

<h3>declare global: mở rộng một kiểu toàn cục</h3>
<p>Bên trong một module (một file có <code>import</code>/<code>export</code>), một khối <code>declare global</code> mở lại một interface toàn cục và thêm vào nó. Ở đây ta báo cho TypeScript rằng <code>window</code> có một <code>appVersion</code>:</p>
<pre><code><span class="tok-comment">// global-aug.ts</span>
<span class="tok-keyword">export</span> {};   <span class="tok-comment">// biến file này thành module để cho phép declare global</span>
<span class="tok-keyword">declare</span> <span class="tok-keyword">global</span> {
  <span class="tok-keyword">interface</span> Window {
    appVersion: <span class="tok-keyword">string</span>;
  }
}
window.appVersion = <span class="tok-string">'1.0'</span>;        <span class="tok-comment">// giờ có kiểu trên window</span>
console.<span class="tok-function">log</span>(window.appVresion);   <span class="tok-comment">// lỗi gõ bị bắt bởi phần bổ sung</span></code></pre>
<div class="out">global-aug.ts(9,20): error TS2551: Property 'appVresion' does not exist on type 'Window &amp; typeof globalThis'. Did you mean 'appVersion'?</div>
<p>Vì <code>appVersion</code> giờ là một thành viên thật của <code>Window</code>, lỗi gõ <code>appVresion</code> là một lỗi biên dịch kèm gợi ý. Phần <code>export {}</code> là một yêu cầu nhỏ: <code>declare global</code> chỉ được phép bên trong một module, nên một file vốn không có import cần nó.</p>

<h3>Module augmentation: mở rộng kiểu của một thư viện</h3>
<p>Cùng cơ chế gộp hoạt động trên một package. Mở lại một interface của nó bằng <code>declare module 'pkg'</code> và thêm field. Ví dụ backend kinh điển là gắn người dùng đã xác thực vào <code>Request</code> của Express:</p>
<pre><code><span class="tok-comment">// express-augment.d.ts</span>
<span class="tok-keyword">import</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">declare</span> <span class="tok-keyword">module</span> <span class="tok-string">'express'</span> {
  <span class="tok-keyword">interface</span> Request {
    user?: { id: <span class="tok-keyword">number</span>; role: <span class="tok-keyword">string</span> };
  }
}</code></pre>
<p>Sau cái này, <code>req.user</code> là một thuộc tính đã biết, có kiểu ở khắp app — middleware xác thực của bạn đặt nó, và mọi route đọc <code>req.user?.id</code> với an toàn kiểu đầy đủ, không ép kiểu. Bạn đã mở rộng một kiểu bên thứ ba mà không đụng vào mã nguồn của nó.</p>

<div class="callout ok">Gộp khai báo cho bạn thêm vào các kiểu bạn không sở hữu. <code>declare global { interface X }</code> bổ sung một toàn cục; <code>declare module 'pkg' { interface Y }</code> bổ sung một thư viện. Nó có tính cộng dồn — bạn gộp các thành viên mới vào interface có sẵn, không thay thế nó.</div>
<div class="note-ct">Phần bổ sung <code>req.user</code> đúng là cách xác thực hoạt động khắp backend này: middleware gắn token đã giải mã vào <code>req.user</code>, và vì interface <code>Request</code> của Express được bổ sung một lần, mọi handler nhận <code>req.user</code> có kiểu mà không import gì hay ép kiểu. Làm hỏng hình dạng ở đây thì mọi route đọc nó bị kiểm lại.</div>
<h3>Mở rộng kiểu: những luật làm nó chạy được</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Nó dựa trên hợp nhất interface</span><span class="lz-t">Cơ chế của chương 4, dùng một cách có chủ đích</span><span class="lz-d">Bạn mở lại một interface có sẵn và thêm thành viên. Chỉ interface mới hợp nhất — một thư viện xuất dáng của nó bằng <code>type</code> thì không mở rộng kiểu này được.</span></div>
<div class="lz-layer"><span class="lz-k">declare global</span><span class="lz-t">Cho kiểu thật sự toàn cục</span><span class="lz-d">Với tới <code>globalThis</code>, <code>Window</code>, <code>NodeJS.ProcessEnv</code>. Chỉ hợp lệ bên trong một module (file có import hoặc export).</span></div>
<div class="lz-layer"><span class="lz-k">declare module 'pkg'</span><span class="lz-t">Cho kiểu của chính một thư viện</span><span class="lz-d">Ca kinh điển là <code>Express.Request</code>, để <code>req.user</code> qua kiểm kiểu sau khi middleware xác thực của bạn đặt nó.</span></div>
<div class="lz-layer"><span class="lz-k">File phải nằm trong chương trình</span><span class="lz-t">Không thì chẳng có gì xảy ra cả</span><span class="lz-d">Phần mở rộng chỉ có tác dụng nếu <code>tsc</code> có nạp file đó. Một thư mục <code>types/</code> nằm ngoài <code>include</code> là vô hình — lý do phổ biến nhất của câu "máy tôi chạy được mà".</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — mở rộng <code>Express.Request</code> bằng <code>user: User</code> thay vì <code>user?: User</code>.</strong> Phần mở rộng là một khẳng định về <em>mọi</em> object request, và nó sai: ở bất cứ route nào chạy trước (hoặc không có) middleware xác thực, <code>req.user</code> đúng là <code>undefined</code>. Khai nó không-tuỳ-chọn làm trình biên dịch thôi hỏi, thế là một handler gắn trên route công khai đọc <code>req.user.id</code>, qua kiểm kiểu hoàn hảo, rồi ném lỗi trên production. Hãy khai nó tuỳ chọn và để từng handler tự thu hẹp — hoặc tốt hơn, để middleware chuyền giá trị đi trong một biến cục bộ có kiểu thay vì buôn lậu nó qua một dáng toàn cục, để kiểu phản ánh đúng nơi giá trị thật sự tồn tại.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: bổ sung kiểu trên Code Lab</span><span class="lc-sub">Bổ sung một toàn cục và một interface thư viện.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — Getting types from packages|||10.4 — Lấy kiểu từ package',
      slug: 'typescript-10-4-types-from-packages',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Package hiện đại kèm sẵn kiểu; package cũ cần @types/* từ DefinitelyTyped. Lỗi TS2307 và cách sửa bằng npm i -D @types/x; vai trò của skipLibCheck.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Getting types from packages</h2>
<p class="lead">Most of the time you don't write declarations — you install them. A package either bundles its own types, or the community publishes them separately as <code>@types/*</code>. Knowing which, and how TypeScript finds them, turns a scary "cannot find module" into a one-line fix.</p>

<h3>Bundled types vs @types</h3>
<p>Modern packages ship a <code>.d.ts</code> inside the package (its <code>package.json</code> points at it via <code>"types"</code>) — install and the types are just there. Older or plain-JS packages don't, so DefinitelyTyped provides types under the <code>@types</code> scope. When neither exists, the import fails:</p>
<pre><code><span class="tok-comment">// notypes.ts</span>
<span class="tok-keyword">import</span> leftpad <span class="tok-keyword">from</span> <span class="tok-string">'left-pad'</span>;   <span class="tok-comment">// installed, but ships no types</span>
console.<span class="tok-function">log</span>(<span class="tok-function">leftpad</span>(<span class="tok-string">'7'</span>, <span class="tok-number">3</span>));</code></pre>
<div class="out">notypes.ts(2,21): error TS2307: Cannot find module 'left-pad' or its corresponding type declarations.</div>
<p>The fix is almost always to install the community types alongside the package:</p>
<pre><code>npm install --save-dev @types/left-pad</code></pre>
<p>TypeScript automatically looks in <code>node_modules/@types</code>, so once installed the import resolves and <code>leftpad</code> is fully typed — no config needed. (If truly no types exist anywhere, fall back to the <code>declare module</code> shim from 10.2.)</p>

<h3>How TypeScript finds types</h3>
<p>Resolution order for an import: the package's own bundled types first, then <code>node_modules/@types/&lt;name&gt;</code>. Two options tune this: <code>types</code>/<code>typeRoots</code> narrow where it looks (rarely needed), and <code>skipLibCheck: true</code> tells it not to type-check inside <code>.d.ts</code> files — a near-universal setting that speeds builds and sidesteps conflicts between two libraries' declarations.</p>

<div class="callout ok">Types come from three places, in order: bundled with the package, from <code>@types/*</code> (DefinitelyTyped), or a hand-written <code>declare module</code> shim. <code>TS2307 "cannot find module or its type declarations"</code> almost always means "run <code>npm i -D @types/&lt;name&gt;</code>". Keep <code>skipLibCheck: true</code> on.</div>
<div class="note-ct">This project's <code>package.json</code> has a <code>devDependencies</code> block full of <code>@types/*</code> entries — <code>@types/express</code>, <code>@types/node</code> and friends — precisely because those packages predate bundled types. And <code>skipLibCheck: true</code> is set so a mismatch deep inside some dependency's declarations never blocks a build over code you don't control.</div>
<h3>How TypeScript resolves a package's types</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Look for bundled declarations</span><span class="lz-d">Read <code>types</code> / <code>typings</code> in the package's <code>package.json</code>, or the <code>exports</code> map's <code>types</code> condition for modern packages.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Fall back to index.d.ts</span><span class="lz-d">Beside the package's main file. Older packages relied on this convention alone.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Try node_modules/@types/&lt;name&gt;</span><span class="lz-d">The DefinitelyTyped location, resolved by walking up parent directories exactly like Node resolves modules.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Give up → implicit any</span><span class="lz-d">Under <code>noImplicitAny</code> this is TS7016, telling you which package needs types. Without it, the import is silently <code>any</code>.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — every <code>@types</code> package under <code>node_modules/@types</code> is loaded globally, whether you import it or not.</strong> That is by design (it is how <code>@types/node</code> gives you <code>process</code> without an import), but it means an unrelated transitive dependency can drag in types that collide with yours — the classic being two testing frameworks both declaring a global <code>describe</code>, producing TS2300 errors in files that import neither. It also makes builds slower, since all of them are parsed. The fix is the <code>types</code> compiler option: <code>"types": ["node"]</code> restricts automatic inclusion to exactly that list, and anything else must be imported explicitly. Set it once and the surprise cannot recur.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: package types on Code Lab</span><span class="lc-sub">Resolve a TS2307 and reason about where types come from.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Lấy kiểu từ package</h2>
<p class="lead">Phần lớn thời gian bạn không viết khai báo — bạn cài chúng. Một package hoặc tự đóng gói kiểu của nó, hoặc cộng đồng xuất bản chúng riêng dưới dạng <code>@types/*</code>. Biết là cái nào, và TypeScript tìm chúng ra sao, biến một cú "cannot find module" đáng sợ thành một dòng sửa.</p>

<h3>Kiểu đóng gói sẵn so với @types</h3>
<p>Các package hiện đại kèm một <code>.d.ts</code> bên trong package (<code>package.json</code> của nó trỏ tới qua <code>"types"</code>) — cài xong là kiểu đã ở đó. Các package cũ hay JS thuần thì không, nên DefinitelyTyped cung cấp kiểu dưới scope <code>@types</code>. Khi không cái nào tồn tại, import thất bại:</p>
<pre><code><span class="tok-comment">// notypes.ts</span>
<span class="tok-keyword">import</span> leftpad <span class="tok-keyword">from</span> <span class="tok-string">'left-pad'</span>;   <span class="tok-comment">// đã cài, nhưng không kèm kiểu</span>
console.<span class="tok-function">log</span>(<span class="tok-function">leftpad</span>(<span class="tok-string">'7'</span>, <span class="tok-number">3</span>));</code></pre>
<div class="out">notypes.ts(2,21): error TS2307: Cannot find module 'left-pad' or its corresponding type declarations.</div>
<p>Cách sửa gần như luôn là cài kiểu cộng đồng cùng với package:</p>
<pre><code>npm install --save-dev @types/left-pad</code></pre>
<p>TypeScript tự động tìm trong <code>node_modules/@types</code>, nên cài xong là import phân giải được và <code>leftpad</code> có kiểu đầy đủ — không cần cấu hình. (Nếu thật sự không có kiểu ở đâu cả, quay về shim <code>declare module</code> ở bài 10.2.)</p>

<h3>TypeScript tìm kiểu ra sao</h3>
<p>Thứ tự phân giải cho một import: kiểu đóng gói sẵn của package trước, rồi <code>node_modules/@types/&lt;name&gt;</code>. Hai tuỳ chọn tinh chỉnh điều này: <code>types</code>/<code>typeRoots</code> thu hẹp nơi nó tìm (hiếm khi cần), và <code>skipLibCheck: true</code> bảo nó đừng kiểm kiểu bên trong các file <code>.d.ts</code> — một thiết lập gần như phổ quát giúp build nhanh hơn và né xung đột giữa khai báo của hai thư viện.</p>

<div class="callout ok">Kiểu đến từ ba nơi, theo thứ tự: đóng gói cùng package, từ <code>@types/*</code> (DefinitelyTyped), hoặc một shim <code>declare module</code> viết tay. Lỗi <code>TS2307 "cannot find module or its type declarations"</code> gần như luôn nghĩa là "chạy <code>npm i -D @types/&lt;name&gt;</code>". Cứ để <code>skipLibCheck: true</code>.</div>
<div class="note-ct"><code>package.json</code> của dự án này có một khối <code>devDependencies</code> đầy các mục <code>@types/*</code> — <code>@types/express</code>, <code>@types/node</code> và bạn bè — chính vì các package đó có trước thời kiểu-đóng-gói-sẵn. Và <code>skipLibCheck: true</code> được đặt để một chỗ vênh sâu trong khai báo của một dependency nào đó không bao giờ chặn một build vì code bạn không kiểm soát.</div>
<h3>TypeScript tìm kiểu của một package thế nào</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tìm khai báo đóng gói sẵn</span><span class="lz-d">Đọc <code>types</code> / <code>typings</code> trong <code>package.json</code> của package, hoặc điều kiện <code>types</code> trong bản đồ <code>exports</code> với các package hiện đại.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Lùi về index.d.ts</span><span class="lz-d">Nằm cạnh file chính của package. Các package cũ chỉ dựa vào quy ước này.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thử node_modules/@types/&lt;tên&gt;</span><span class="lz-d">Vị trí của DefinitelyTyped, giải bằng cách đi ngược lên các thư mục cha y hệt cách Node giải module.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chịu thua → any ngầm</span><span class="lz-d">Dưới <code>noImplicitAny</code> đây là TS7016, nói cho bạn biết package nào cần kiểu. Không có nó, import âm thầm thành <code>any</code>.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — mọi package <code>@types</code> nằm dưới <code>node_modules/@types</code> đều được nạp toàn cục, dù bạn có import nó hay không.</strong> Đó là thiết kế cố ý (nhờ nó mà <code>@types/node</code> cho bạn <code>process</code> mà không cần import), nhưng nó cũng nghĩa là một phụ thuộc gián tiếp chẳng liên quan có thể lôi vào những kiểu va chạm với kiểu của bạn — kinh điển là hai framework kiểm thử cùng khai một <code>describe</code> toàn cục, sinh ra lỗi TS2300 trong những file chẳng import cái nào. Nó cũng làm build chậm đi, vì tất cả đều bị phân tích. Cách chữa là tuỳ chọn <code>types</code>: <code>"types": ["node"]</code> giới hạn phần nạp tự động đúng bằng danh sách đó, còn lại phải import tường minh. Đặt một lần là chuyện bất ngờ ấy không tái diễn được.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: kiểu từ package trên Code Lab</span><span class="lc-sub">Xử lý một TS2307 và lý giải kiểu đến từ đâu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.5 quiz ─────────────────────────── */
    {
      title: '10.5 — Chapter 10 quiz|||10.5 — Kiểm tra Chương 10',
      slug: 'typescript-10-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về module & import type, file .d.ts, declare module, declare global & module augmentation, và @types.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on modules and declarations — the glue between your typed code and everything around it. Questions follow lesson order.</p>
<div class="callout ok">Aim for 7/8. The two you'll actually use: <code>declare module 'pkg'</code> to type an untyped package (10.2) and <code>npm i -D @types/x</code> for a TS2307 (10.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về module và khai báo — chất keo giữa code có kiểu của bạn và mọi thứ xung quanh. Các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu bạn thật sự dùng: <code>declare module 'pkg'</code> để gõ kiểu một package không kiểu (10.2) và <code>npm i -D @types/x</code> cho một TS2307 (10.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'add(1, "two") in app.ts, where add comes from math.ts, gives?|||add(1, "two") trong app.ts, với add đến từ math.ts, cho ra?',
            options: [
              'No error — different files are checked separately|||Không lỗi — các file khác nhau được kiểm riêng',
              "TS2345: types are checked across the module boundary against add's signature|||TS2345: kiểu được kiểm xuyên biên giới module dựa trên chữ ký của add",
              'A runtime error only|||Chỉ lỗi lúc chạy',
              'It coerces "two" to a number|||Nó ép "two" thành số',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does import type { Foo } from "./x" guarantee?|||import type { Foo } from "./x" bảo đảm điều gì?',
            options: [
              'Foo is imported faster|||Foo được import nhanh hơn',
              'The import is type-only and is erased — it never becomes a runtime require|||Import chỉ-kiểu và bị xoá — không bao giờ thành một require lúc chạy',
              'Foo must be a class|||Foo phải là một class',
              'It imports every export|||Nó import mọi export',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does a .d.ts file contain?|||Một file .d.ts chứa gì?',
            options: [
              'Only type declarations, no implementations|||Chỉ khai báo kiểu, không có phần cài đặt',
              'Compiled JavaScript|||JavaScript đã biên dịch',
              'Both types and runtime code|||Cả kiểu lẫn code lúc chạy',
              'Test cases|||Các ca kiểm thử',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How do you type an untyped npm package "confetti-cannon" yourself?|||Bạn tự gõ kiểu một package npm không kiểu "confetti-cannon" thế nào?',
            options: [
              'You cannot — you must use any|||Không thể — phải dùng any',
              "declare module 'confetti-cannon' { ... } in a .d.ts|||declare module 'confetti-cannon' { ... } trong một .d.ts",
              'Rename the package|||Đổi tên package',
              'Add it to tsconfig include|||Thêm nó vào include của tsconfig',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is export {} needed in a file that uses declare global?|||Vì sao cần export {} trong một file dùng declare global?',
            options: [
              'To export the globals|||Để export các biến toàn cục',
              'declare global is only allowed inside a module; export {} makes the file a module|||declare global chỉ được phép trong một module; export {} biến file thành module',
              'It disables strict mode|||Nó tắt chế độ strict',
              'It is optional|||Nó là tuỳ chọn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Adding user?: {...} to Express Request via declare module "express" is an example of?|||Thêm user?: {...} vào Express Request qua declare module "express" là ví dụ của?',
            options: [
              'Overwriting the Request type|||Ghi đè kiểu Request',
              'Module augmentation — merging new members into a library interface|||Module augmentation — gộp thành viên mới vào một interface thư viện',
              'A generic constraint|||Một ràng buộc generic',
              'A conditional type|||Một conditional type',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'import x from "left-pad" gives TS2307 "Cannot find module or its type declarations". The usual fix?|||import x from "left-pad" cho TS2307 "Cannot find module or its type declarations". Cách sửa thường gặp?',
            options: [
              'Reinstall Node|||Cài lại Node',
              'npm install --save-dev @types/left-pad|||npm install --save-dev @types/left-pad',
              'Add "any" to tsconfig|||Thêm "any" vào tsconfig',
              'Delete the import|||Xoá import đi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does skipLibCheck: true do?|||skipLibCheck: true làm gì?',
            options: [
              'Skips checking your own code|||Bỏ kiểm code của chính bạn',
              'Skips type-checking inside .d.ts files, speeding builds and avoiding cross-library conflicts|||Bỏ kiểm kiểu bên trong các file .d.ts, giúp build nhanh và tránh xung đột giữa các thư viện',
              'Skips emitting output|||Bỏ xuất đầu ra',
              'Disables @types resolution|||Tắt phân giải @types',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
