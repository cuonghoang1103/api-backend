/**
 * TypeScript — Chương 15: Hiệu năng build.
 * Output tsc THẬT nhưng CHỈ lỗi ổn định (TS1205/TS1484) — KHÔNG nhúng số
 * timing (đổi theo lần chạy). Song ngữ. < > → &lt; &gt;; & → &amp;; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 15 — Build performance|||Chương 15 — Hiệu năng build',
  description: 'Vì sao dự án TypeScript lớn build chậm và cách tăng tốc: skipLibCheck, incremental & project references, tách kiểm-kiểu khỏi transpile (isolatedModules), và cắt đồ thị module bằng import type.',
  lessons: [
    /* ─────────────────────────── 15.1 ─────────────────────────── */
    {
      title: '15.1 — Where the time goes & skipLibCheck|||15.1 — Thời gian đi đâu & skipLibCheck',
      slug: 'typescript-15-1-where-time-goes',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Phần đắt nhất của tsc là kiểm kiểu (so sánh cấu trúc), không phải xuất file. Đo bằng --extendedDiagnostics; skipLibCheck bỏ kiểm bên trong .d.ts.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>Where the time goes &amp; skipLibCheck</h2>
<p class="lead">As a codebase grows, <code>tsc</code> gets slower — and it helps to know <em>why</em>. The expensive part isn't emitting JavaScript; it's the type-checking: comparing structures, resolving generics, walking the graph of every <code>.d.ts</code> you depend on. Speeding up a build starts with measuring that.</p>

<h3>Measure before you optimise</h3>
<p>Ask the compiler where its time goes with <code>--extendedDiagnostics</code>:</p>
<pre><code>npx tsc --noEmit --extendedDiagnostics</code></pre>
<p>It prints a breakdown — <code>Files</code> (how many were loaded), <code>Lines of Library</code> (the built-in and dependency <code>.d.ts</code> you're checking), <code>Check time</code> and <code>Total time</code>. The numbers vary run to run, so read the <em>shape</em>: if <code>Check time</code> dominates and <code>Lines of Library</code> is huge, most of your build is spent verifying declaration files from dependencies — not your own code. That's a specific, fixable problem.</p>

<h3>skipLibCheck: stop re-checking dependencies' types</h3>
<p>The fix for exactly that case is <code>skipLibCheck</code>. It tells TypeScript not to type-check <em>inside</em> <code>.d.ts</code> files — your code is still fully checked against them, but their internals are trusted:</p>
<pre><code>{
  "compilerOptions": {
    "skipLibCheck": true
  }
}</code></pre>
<p>On a real app with dozens of dependencies, the <code>.d.ts</code> files can be hundreds of thousands of lines; checking their internals every build is wasted work, and worse, a conflict deep between two libraries' types can fail a build over code you don't control. <code>skipLibCheck: true</code> is a near-universal setting for that reason — you saw it in chapter 10 as the answer to cross-library declaration conflicts, and here it's also one of the biggest single build-time wins.</p>

<div class="callout ok">Type-checking, not emit, is what makes <code>tsc</code> slow. Measure with <code>tsc --extendedDiagnostics</code> and read the shape (numbers vary per run). If library <code>.d.ts</code> checking dominates, <code>skipLibCheck: true</code> both speeds the build and sidesteps cross-dependency type conflicts.</div>
<div class="note-ct">This project's tsconfig sets <code>skipLibCheck: true</code> — it's why a type mismatch buried inside some dependency's declarations never blocks a deploy, and it keeps the pre-push <code>tsc --noEmit</code> gate fast enough to run on every change. Measure first: the win only matters if library checking is actually your bottleneck.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: measuring builds on Code Lab</span><span class="lc-sub">Read an --extendedDiagnostics report and reason about it.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>Thời gian đi đâu &amp; skipLibCheck</h2>
<p class="lead">Khi một codebase lớn lên, <code>tsc</code> chậm đi — và biết <em>vì sao</em> thì hữu ích. Phần đắt không phải xuất JavaScript; đó là kiểm kiểu: so sánh cấu trúc, phân giải generic, đi qua đồ thị của mọi <code>.d.ts</code> bạn phụ thuộc. Tăng tốc một build bắt đầu bằng việc đo cái đó.</p>

<h3>Đo trước khi tối ưu</h3>
<p>Hỏi trình biên dịch thời gian đi đâu bằng <code>--extendedDiagnostics</code>:</p>
<pre><code>npx tsc --noEmit --extendedDiagnostics</code></pre>
<p>Nó in một bảng phân tích — <code>Files</code> (bao nhiêu file được tải), <code>Lines of Library</code> (các <code>.d.ts</code> có sẵn và của dependency bạn đang kiểm), <code>Check time</code> và <code>Total time</code>. Các con số dao động theo lần chạy, nên hãy đọc <em>hình dạng</em>: nếu <code>Check time</code> chiếm phần lớn và <code>Lines of Library</code> khổng lồ, đa số build của bạn dành cho việc xác minh file khai báo từ dependency — không phải code của chính bạn. Đó là một vấn đề cụ thể, sửa được.</p>

<h3>skipLibCheck: thôi kiểm lại kiểu của dependency</h3>
<p>Cách sửa đúng cho trường hợp đó là <code>skipLibCheck</code>. Nó bảo TypeScript đừng kiểm kiểu <em>bên trong</em> các file <code>.d.ts</code> — code của bạn vẫn được kiểm đầy đủ dựa trên chúng, nhưng phần ruột của chúng được tin:</p>
<pre><code>{
  "compilerOptions": {
    "skipLibCheck": true
  }
}</code></pre>
<p>Trên một app thật với hàng chục dependency, các file <code>.d.ts</code> có thể tới hàng trăm ngàn dòng; kiểm ruột chúng mỗi lần build là công lãng phí, và tệ hơn, một xung đột sâu giữa kiểu của hai thư viện có thể làm build thất bại vì code bạn không kiểm soát. <code>skipLibCheck: true</code> gần như là thiết lập phổ quát vì lẽ đó — bạn đã thấy nó ở chương 10 như câu trả lời cho xung đột khai báo giữa các thư viện, và ở đây nó cũng là một trong những cú tăng tốc build lớn nhất.</p>

<div class="callout ok">Kiểm kiểu, không phải xuất file, là thứ làm <code>tsc</code> chậm. Đo bằng <code>tsc --extendedDiagnostics</code> và đọc hình dạng (số dao động theo lần chạy). Nếu việc kiểm <code>.d.ts</code> thư viện chiếm phần lớn, <code>skipLibCheck: true</code> vừa tăng tốc build vừa né xung đột kiểu giữa các dependency.</div>
<div class="note-ct">tsconfig của dự án này đặt <code>skipLibCheck: true</code> — đó là lý do một chỗ vênh kiểu chôn sâu trong khai báo của một dependency không bao giờ chặn một deploy, và nó giữ cổng <code>tsc --noEmit</code> trước-khi-push đủ nhanh để chạy trên mỗi thay đổi. Đo trước: cú thắng chỉ đáng nếu kiểm thư viện thật sự là nút thắt của bạn.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: đo build trên Code Lab</span><span class="lc-sub">Đọc một báo cáo --extendedDiagnostics và lý giải nó.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.2 ─────────────────────────── */
    {
      title: '15.2 — Incremental & project references|||15.2 — Incremental & project references',
      slug: 'typescript-15-2-incremental-references',
      type: 'LESSON',
      description: 'incremental lưu cache .tsbuildinfo để build sau chỉ kiểm phần đổi; composite + references + tsc -b chia một dự án lớn thành các phần build độc lập.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>Incremental &amp; project references</h2>
<p class="lead">The second lever is not re-doing work. <code>incremental</code> caches the result of a build so the next one only re-checks what changed; <code>project references</code> split a large codebase into independently-buildable pieces. Both trade a little config for a lot less waiting.</p>

<h3>incremental: cache between builds</h3>
<p>Turn on <code>incremental</code> and TypeScript writes a <code>.tsbuildinfo</code> file recording what it checked. The next build reads it and skips the unchanged parts:</p>
<pre><code>{
  "compilerOptions": {
    "incremental": true
  }
}</code></pre>
<p>The first build is full; every build after is proportional to what you touched, not the whole project. It's the cheapest speedup available — one flag, no restructuring — and it's why a watch-mode <code>tsc --watch</code> feels instant after the first pass. Keep the <code>.tsbuildinfo</code> out of git (it's a cache) but do cache it in CI.</p>

<h3>project references: split the build</h3>
<p>For a big repo — say a shared package, a backend, and a frontend — <code>project references</code> let each part be its own TypeScript project that builds separately and depends on the others' <em>compiled outputs</em>. Mark a referenced project <code>composite</code>, and list dependencies under <code>references</code>:</p>
<pre><code><span class="tok-comment">// backend/tsconfig.json</span>
{
  "compilerOptions": { "composite": true },
  "references": [{ "path": "../shared" }]
}</code></pre>
<p>Then build the whole graph with <strong>build mode</strong>, which walks the references in dependency order and only rebuilds what changed:</p>
<pre><code>npx tsc -b</code></pre>
<p>Now editing the backend doesn't re-check the shared package if it didn't change, and the frontend and backend can build in parallel. This is how monorepos keep type-checking fast at scale — the project graph mirrors your package graph.</p>

<div class="callout ok"><code>incremental: true</code> caches a build in <code>.tsbuildinfo</code> so the next one only re-checks changes — one flag, always worth it. <code>project references</code> (<code>composite</code> + <code>references</code>, built with <code>tsc -b</code>) split a big repo into independently-built projects that mirror your package structure.</div>
<div class="note-ct">This repo's backend and frontend are separate TypeScript projects with their own tsconfigs — the pre-push checklist runs <code>tsc --noEmit</code> in each independently, so a backend-only change doesn't pay for re-checking the frontend. That separation is the same idea as project references, applied at the repo's two-package granularity.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: incremental builds on Code Lab</span><span class="lc-sub">Enable incremental and reason about a reference graph.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Incremental &amp; project references</h2>
<p class="lead">Đòn bẩy thứ hai là không làm lại việc. <code>incremental</code> lưu cache kết quả một build để build sau chỉ kiểm lại phần đổi; <code>project references</code> chia một codebase lớn thành các phần build độc lập. Cả hai đánh đổi một chút cấu hình lấy ít chờ đợi hơn nhiều.</p>

<h3>incremental: cache giữa các build</h3>
<p>Bật <code>incremental</code> và TypeScript ghi một file <code>.tsbuildinfo</code> ghi lại những gì nó đã kiểm. Build sau đọc nó và bỏ qua các phần không đổi:</p>
<pre><code>{
  "compilerOptions": {
    "incremental": true
  }
}</code></pre>
<p>Build đầu là đầy đủ; mọi build sau tỉ lệ với thứ bạn đã chạm, không phải cả dự án. Đó là cú tăng tốc rẻ nhất có được — một cờ, không tái cấu trúc — và là lý do một watch-mode <code>tsc --watch</code> thấy như tức thì sau lần đầu. Giữ <code>.tsbuildinfo</code> ngoài git (nó là cache) nhưng nên cache nó trong CI.</p>

<h3>project references: chia build</h3>
<p>Với một repo lớn — ví dụ một package dùng chung, một backend, và một frontend — <code>project references</code> cho mỗi phần là một dự án TypeScript riêng, build tách và phụ thuộc vào <em>đầu ra đã biên dịch</em> của các phần khác. Đánh dấu một dự án được tham chiếu là <code>composite</code>, và liệt kê phụ thuộc dưới <code>references</code>:</p>
<pre><code><span class="tok-comment">// backend/tsconfig.json</span>
{
  "compilerOptions": { "composite": true },
  "references": [{ "path": "../shared" }]
}</code></pre>
<p>Rồi build cả đồ thị bằng <strong>build mode</strong>, thứ đi qua các reference theo thứ tự phụ thuộc và chỉ build lại phần đổi:</p>
<pre><code>npx tsc -b</code></pre>
<p>Giờ sửa backend không kiểm lại package dùng chung nếu nó không đổi, và frontend với backend build song song được. Đây là cách các monorepo giữ kiểm kiểu nhanh ở quy mô lớn — đồ thị dự án phản chiếu đồ thị package của bạn.</p>

<div class="callout ok"><code>incremental: true</code> cache một build vào <code>.tsbuildinfo</code> để build sau chỉ kiểm lại phần đổi — một cờ, luôn đáng. <code>project references</code> (<code>composite</code> + <code>references</code>, build bằng <code>tsc -b</code>) chia một repo lớn thành các dự án build độc lập phản chiếu cấu trúc package của bạn.</div>
<div class="note-ct">Backend và frontend của repo này là các dự án TypeScript riêng với tsconfig của mình — checklist trước-khi-push chạy <code>tsc --noEmit</code> trong mỗi bên độc lập, nên một thay đổi chỉ-backend không phải trả giá kiểm lại frontend. Sự tách đó là cùng ý tưởng với project references, áp ở độ hạt hai-package của repo.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: build incremental trên Code Lab</span><span class="lc-sub">Bật incremental và lý giải một đồ thị reference.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.3 ─────────────────────────── */
    {
      title: '15.3 — Separate checking from transpiling|||15.3 — Tách kiểm kiểu khỏi transpile',
      slug: 'typescript-15-3-isolated-modules',
      type: 'LESSON',
      description: 'Bundler (esbuild/swc/Next/Vite) transpile từng file KHÔNG có thông tin kiểu chéo-file, nên cần isolatedModules; type-check riêng bằng tsc --noEmit.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>Separate checking from transpiling</h2>
<p class="lead">The fastest builds don't use <code>tsc</code> to produce JavaScript at all. Tools like esbuild, SWC, Vite and Next.js transpile TypeScript to JS by <em>erasing types file-by-file</em> — blazingly fast, but they never type-check. That split (chapter 9's <code>tsc --noEmit</code>) is the modern setup, and it comes with one rule.</p>

<h3>Why bundlers need isolatedModules</h3>
<p>A per-file transpiler sees one file at a time with no cross-file type information. Some TypeScript constructs can't be compiled correctly that way, so <code>isolatedModules: true</code> makes the compiler flag them — guaranteeing your code is safe for a fast transpiler. The most common one: re-exporting a type without marking it as a type:</p>
<pre><code><span class="tok-comment">// reexport.ts  (compiled with isolatedModules)</span>
<span class="tok-keyword">export</span> { User } <span class="tok-keyword">from</span> <span class="tok-string">'./types'</span>;   <span class="tok-comment">// User is a type — needs &#96;export type&#96;</span></code></pre>
<div class="out">reexport.ts(2,10): error TS1205: Re-exporting a type when 'isolatedModules' is enabled requires using 'export type'.</div>
<p>A single-file transpiler can't tell whether <code>User</code> is a value or a type — so it doesn't know whether to emit a real re-export or erase it. <code>isolatedModules</code> forces you to be explicit: write <code>export type { User }</code>. The fix is trivial, and the payoff is that esbuild/SWC can safely erase types without ever consulting <code>./types</code>.</p>

<h3>The two-tool setup</h3>
<p>So the modern pipeline is: a fast transpiler (esbuild/SWC/Next) produces the JavaScript, and <code>tsc --noEmit</code> checks the types — run in parallel, or in CI as a separate gate. You get near-instant builds <em>and</em> full type safety, because each tool does the one job it's good at. <code>isolatedModules: true</code> is what keeps your code compatible with the fast half.</p>

<div class="callout ok">Fast builders (esbuild, SWC, Vite, Next) transpile file-by-file and never type-check. <code>isolatedModules: true</code> bans constructs that need cross-file type info (e.g. re-exporting a type without <code>export type</code> → TS1205), keeping your code safe for them. Type-check separately with <code>tsc --noEmit</code>.</div>
<div class="note-ct">This is exactly the split this project runs: the frontend's <code>next build</code> and the backend's build transpile without full type-checking, while <code>tsc --noEmit</code> is the separate correctness gate in the pre-push checklist. The frontend sets <code>isolatedModules</code> because Next transpiles per-file — which is also why an <code>export type</code> slip shows up as a build error there.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: isolatedModules on Code Lab</span><span class="lc-sub">Fix a type re-export for a per-file transpiler.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Tách kiểm kiểu khỏi transpile</h2>
<p class="lead">Các build nhanh nhất không dùng <code>tsc</code> để tạo JavaScript chút nào. Công cụ như esbuild, SWC, Vite và Next.js transpile TypeScript sang JS bằng cách <em>xoá kiểu từng-file</em> — nhanh chóng mặt, nhưng chúng không bao giờ kiểm kiểu. Sự tách đó (chương 9, <code>tsc --noEmit</code>) là thiết lập hiện đại, và nó đi kèm một luật.</p>

<h3>Vì sao bundler cần isolatedModules</h3>
<p>Một bộ transpile từng-file thấy một file mỗi lần, không có thông tin kiểu chéo-file. Vài cấu trúc TypeScript không biên dịch đúng theo cách đó, nên <code>isolatedModules: true</code> làm trình biên dịch tô đỏ chúng — bảo đảm code của bạn an toàn cho một bộ transpile nhanh. Cái phổ biến nhất: re-export một kiểu mà không đánh dấu nó là kiểu:</p>
<pre><code><span class="tok-comment">// reexport.ts  (biên dịch với isolatedModules)</span>
<span class="tok-keyword">export</span> { User } <span class="tok-keyword">from</span> <span class="tok-string">'./types'</span>;   <span class="tok-comment">// User là một kiểu — cần &#96;export type&#96;</span></code></pre>
<div class="out">reexport.ts(2,10): error TS1205: Re-exporting a type when 'isolatedModules' is enabled requires using 'export type'.</div>
<p>Một bộ transpile một-file không biết <code>User</code> là một giá trị hay một kiểu — nên nó không biết nên xuất một re-export thật hay xoá nó đi. <code>isolatedModules</code> ép bạn tường minh: viết <code>export type { User }</code>. Cách sửa tầm thường, và phần thưởng là esbuild/SWC có thể xoá kiểu an toàn mà không bao giờ phải hỏi tới <code>./types</code>.</p>

<h3>Thiết lập hai-công-cụ</h3>
<p>Nên pipeline hiện đại là: một bộ transpile nhanh (esbuild/SWC/Next) tạo JavaScript, và <code>tsc --noEmit</code> kiểm kiểu — chạy song song, hoặc trong CI như một cổng riêng. Bạn được build gần như tức thì <em>và</em> an toàn kiểu đầy đủ, vì mỗi công cụ làm đúng một việc nó giỏi. <code>isolatedModules: true</code> là thứ giữ code của bạn tương thích với nửa nhanh.</p>

<div class="callout ok">Bộ build nhanh (esbuild, SWC, Vite, Next) transpile từng-file và không bao giờ kiểm kiểu. <code>isolatedModules: true</code> cấm các cấu trúc cần thông tin kiểu chéo-file (vd re-export một kiểu không có <code>export type</code> → TS1205), giữ code của bạn an toàn cho chúng. Kiểm kiểu riêng bằng <code>tsc --noEmit</code>.</div>
<div class="note-ct">Đây đúng là sự tách dự án này chạy: <code>next build</code> của frontend và build của backend transpile mà không kiểm kiểu đầy đủ, còn <code>tsc --noEmit</code> là cổng đúng-đắn riêng trong checklist trước-khi-push. Frontend đặt <code>isolatedModules</code> vì Next transpile từng-file — cũng là lý do một lỗi quên <code>export type</code> hiện ra như một lỗi build ở đó.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: isolatedModules trên Code Lab</span><span class="lc-sub">Sửa một re-export kiểu cho một bộ transpile từng-file.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.4 ─────────────────────────── */
    {
      title: '15.4 — Trimming the module graph|||15.4 — Cắt gọn đồ thị module',
      slug: 'typescript-15-4-import-type',
      type: 'LESSON',
      description: 'import type / export type nói rõ phụ thuộc chỉ-kiểu để chúng bị xoá, không thành import lúc chạy; verbatimModuleSyntax ép sự rõ ràng đó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>Trimming the module graph</h2>
<p class="lead">A subtler cost: type-only imports that accidentally become runtime imports pull whole modules into your bundle for no reason. Marking them <code>import type</code> keeps them out — smaller output, faster builds, and no surprise side effects — and <code>verbatimModuleSyntax</code> makes the compiler enforce it.</p>

<h3>The problem, made explicit</h3>
<p><code>verbatimModuleSyntax</code> stops TypeScript from silently guessing which imports are type-only. If you import something used purely as a type without saying so, it's an error — and that's a good thing, because it makes the runtime cost visible:</p>
<pre><code><span class="tok-comment">// verbatim.ts  (compiled with verbatimModuleSyntax)</span>
<span class="tok-keyword">import</span> { User } <span class="tok-keyword">from</span> <span class="tok-string">'./types'</span>;   <span class="tok-comment">// used only as a type — needs &#96;import type&#96;</span>
<span class="tok-keyword">const</span> u: User = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span> };</code></pre>
<div class="out">verbatim.ts(2,10): error TS1484: 'User' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.</div>
<p>The fix is <code>import type { User }</code>. Now the compiler knows the import is types-only and erases it completely — no <code>require('./types')</code> in the output, so <code>./types</code> (and anything it drags in) never loads at runtime. Without the annotation, a plain import of a type <em>might</em> emit a real module load, running its side effects for nothing.</p>

<h3>Why it compounds</h3>
<p>Every erased type-only import is one fewer edge in the module graph the bundler has to follow. Across a big codebase that means a smaller bundle, faster transpiling, and — crucially — no accidental coupling: importing a <em>type</em> from the server layer into the browser can't drag server code along if it's an <code>import type</code>. The rule is simple: if you import something only to use it in a type position, write <code>import type</code>.</p>

<div class="callout ok"><code>import type</code> / <code>export type</code> mark type-only dependencies so they're erased, never emitted as runtime imports — smaller bundles, faster builds, no accidental side effects. <code>verbatimModuleSyntax: true</code> enforces the annotation (TS1484), making every runtime import intentional.</div>
<div class="note-ct">The frontend uses <code>import type</code> for the DTO and model types it shares with the backend — that annotation is exactly what stops a shared <em>type</em> from bundling server code into the browser (chapter 10's boundary point, now also a build-size win). One keyword keeps the client bundle from importing things it only needed at the type level.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: import type on Code Lab</span><span class="lc-sub">Convert a type import and reason about the emitted module.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Cắt gọn đồ thị module</h2>
<p class="lead">Một chi phí tinh vi hơn: import chỉ-kiểu vô tình thành import lúc chạy kéo cả module vào bundle của bạn vô cớ. Đánh dấu chúng <code>import type</code> giữ chúng ở ngoài — đầu ra nhỏ hơn, build nhanh hơn, và không side effect bất ngờ — và <code>verbatimModuleSyntax</code> làm trình biên dịch ép điều đó.</p>

<h3>Vấn đề, làm tường minh</h3>
<p><code>verbatimModuleSyntax</code> chặn TypeScript âm thầm đoán import nào là chỉ-kiểu. Nếu bạn import một thứ dùng thuần như một kiểu mà không nói vậy, đó là lỗi — và đó là điều tốt, vì nó làm chi phí lúc chạy hiện rõ:</p>
<pre><code><span class="tok-comment">// verbatim.ts  (biên dịch với verbatimModuleSyntax)</span>
<span class="tok-keyword">import</span> { User } <span class="tok-keyword">from</span> <span class="tok-string">'./types'</span>;   <span class="tok-comment">// dùng thuần như kiểu — cần &#96;import type&#96;</span>
<span class="tok-keyword">const</span> u: User = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span> };</code></pre>
<div class="out">verbatim.ts(2,10): error TS1484: 'User' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.</div>
<p>Cách sửa là <code>import type { User }</code>. Giờ trình biên dịch biết import là chỉ-kiểu và xoá nó hoàn toàn — không có <code>require('./types')</code> trong đầu ra, nên <code>./types</code> (và mọi thứ nó kéo theo) không bao giờ tải lúc chạy. Không có chú thích, một import trần của một kiểu <em>có thể</em> xuất một lần tải module thật, chạy side effect của nó vô ích.</p>

<h3>Vì sao nó cộng dồn</h3>
<p>Mỗi import chỉ-kiểu bị xoá là bớt một cạnh trong đồ thị module mà bundler phải đi theo. Khắp một codebase lớn điều đó nghĩa là bundle nhỏ hơn, transpile nhanh hơn, và — quan trọng nhất — không ghép cặp vô tình: import một <em>kiểu</em> từ lớp server vào trình duyệt không kéo được code server theo nếu nó là một <code>import type</code>. Luật đơn giản: nếu bạn import một thứ chỉ để dùng ở vị trí kiểu, viết <code>import type</code>.</p>

<div class="callout ok"><code>import type</code> / <code>export type</code> đánh dấu phụ thuộc chỉ-kiểu để chúng bị xoá, không bao giờ xuất thành import lúc chạy — bundle nhỏ hơn, build nhanh hơn, không side effect vô tình. <code>verbatimModuleSyntax: true</code> ép chú thích đó (TS1484), làm mọi import lúc chạy thành có chủ đích.</div>
<div class="note-ct">Frontend dùng <code>import type</code> cho các kiểu DTO và model nó chia sẻ với backend — chú thích đó đúng là thứ chặn một <em>kiểu</em> dùng chung khỏi đóng gói code server vào trình duyệt (điểm biên của chương 10, giờ cũng là một cú thắng về kích thước build). Một từ khoá giữ bundle client khỏi import những thứ nó chỉ cần ở mức kiểu.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: import type trên Code Lab</span><span class="lc-sub">Chuyển một import kiểu và lý giải module xuất ra.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.5 quiz ─────────────────────────── */
    {
      title: '15.5 — Chapter 15 quiz|||15.5 — Kiểm tra Chương 15',
      slug: 'typescript-15-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về nút thắt kiểm kiểu, skipLibCheck, incremental & references, isolatedModules và import type/verbatimModuleSyntax.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on build performance — the config that keeps a growing TypeScript project fast. Questions follow lesson order.</p>
<div class="callout ok">Aim for 7/8. The modern setup to remember: a fast transpiler emits JS while <code>tsc --noEmit</code> checks types — enabled by <code>isolatedModules</code> (15.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về hiệu năng build — cấu hình giữ một dự án TypeScript đang lớn vẫn nhanh. Các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Thiết lập hiện đại cần nhớ: một bộ transpile nhanh xuất JS còn <code>tsc --noEmit</code> kiểm kiểu — được <code>isolatedModules</code> cho phép (15.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is the expensive part of running tsc?|||Phần đắt khi chạy tsc là gì?',
            options: [
              'Emitting JavaScript|||Xuất JavaScript',
              'Type-checking — comparing structures, resolving generics, walking .d.ts graphs|||Kiểm kiểu — so sánh cấu trúc, phân giải generic, đi qua đồ thị .d.ts',
              'Reading the tsconfig|||Đọc tsconfig',
              'Writing .tsbuildinfo|||Ghi .tsbuildinfo',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does skipLibCheck: true do?|||skipLibCheck: true làm gì?',
            options: [
              'Skips checking your code|||Bỏ kiểm code của bạn',
              "Skips type-checking inside .d.ts files (your code is still checked against them)|||Bỏ kiểm kiểu bên trong file .d.ts (code bạn vẫn được kiểm dựa trên chúng)",
              'Skips emitting output|||Bỏ xuất đầu ra',
              'Disables all checking|||Tắt mọi kiểm tra',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does incremental: true give you?|||incremental: true cho bạn gì?',
            options: [
              'Parallel builds|||Build song song',
              'A .tsbuildinfo cache so the next build only re-checks what changed|||Một cache .tsbuildinfo để build sau chỉ kiểm lại phần đổi',
              'Smaller output|||Đầu ra nhỏ hơn',
              'Type-only imports|||Import chỉ-kiểu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'How do you build a project-references graph in dependency order?|||Bạn build một đồ thị project-references theo thứ tự phụ thuộc thế nào?',
            options: [
              'tsc --noEmit',
              'tsc -b (build mode)',
              'tsc --watch',
              'tsc --init',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why do fast transpilers (esbuild, SWC, Next) need isolatedModules?|||Vì sao các bộ transpile nhanh (esbuild, SWC, Next) cần isolatedModules?',
            options: [
              'They type-check very strictly|||Chúng kiểm kiểu rất chặt',
              'They transpile file-by-file with no cross-file type info, so some constructs must be flagged|||Chúng transpile từng-file không có thông tin kiểu chéo-file, nên vài cấu trúc phải bị tô đỏ',
              'They require classes|||Chúng đòi class',
              'They emit .d.ts|||Chúng xuất .d.ts',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Under isolatedModules, export { User } from "./types" (User is a type) gives?|||Dưới isolatedModules, export { User } from "./types" (User là kiểu) cho ra?',
            options: [
              'No error|||Không lỗi',
              "TS1205: re-exporting a type requires export type|||TS1205: re-export một kiểu cần export type",
              'A runtime error|||Một lỗi lúc chạy',
              'It emits a value|||Nó xuất một giá trị',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In the modern setup, which tool checks types?|||Trong thiết lập hiện đại, công cụ nào kiểm kiểu?',
            options: [
              'The bundler (esbuild/SWC/Next)|||Bundler (esbuild/SWC/Next)',
              'tsc --noEmit, run separately from the transpiler|||tsc --noEmit, chạy riêng khỏi bộ transpile',
              'Node at runtime|||Node lúc chạy',
              'The linter|||Bộ lint',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does writing import type { User } instead of import { User } achieve?|||Viết import type { User } thay vì import { User } đạt được gì?',
            options: [
              'Nothing|||Không gì',
              'The import is erased — no runtime module load, smaller bundle, no accidental side effects|||Import bị xoá — không tải module lúc chạy, bundle nhỏ hơn, không side effect vô tình',
              'It imports faster at runtime|||Nó import nhanh hơn lúc chạy',
              'It makes User mutable|||Nó làm User ghi-được',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
