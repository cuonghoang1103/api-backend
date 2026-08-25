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
<h3>Measure first — where tsc actually spends time</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">tsc --diagnostics</span><span class="lz-d">Prints files, lines, and time split across parse / bind / check / emit. Two minutes of reading beats an afternoon of guessing.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Check time high → your types</span><span class="lz-d">Deep conditional types, large unions, recursive mapped types. This is where a clever type costs the whole team on every build.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Parse time high → too many files</span><span class="lz-d">Often <code>node_modules</code> declarations. <code>skipLibCheck</code> and a tight <code>types</code> array are the levers.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">tsc --generateTrace for the hard cases</span><span class="lz-d">Emits a trace you can open in a profiler and see which type instantiation is expensive, by name.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>skipLibCheck</code> speeds up the build by not checking the types you depend on.</strong> It is the standard recommendation and usually right, but it is a trade, not a free win: it stops <code>tsc</code> from checking <code>.d.ts</code> files, so two packages whose declarations genuinely conflict — the classic being mismatched <code>@types/node</code> versions in a monorepo — no longer produce an error at build time. The conflict is still real; you just meet it later, as a type that resolves differently in two places and an error message that makes no sense. Keep <code>skipLibCheck</code> on for day-to-day speed, and run one CI job without it so the conflicts still surface somewhere.</p></div>
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
<h3>Đo trước — tsc thật sự tiêu thời gian ở đâu</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">tsc --diagnostics</span><span class="lz-d">In ra số file, số dòng, và thời gian chia theo parse / bind / check / emit. Hai phút đọc hơn một buổi chiều đoán.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Thời gian check cao → do kiểu của bạn</span><span class="lz-d">Conditional type sâu, union lớn, mapped type đệ quy. Đây là chỗ một kiểu "thông minh" bắt cả đội trả giá ở mọi lần build.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thời gian parse cao → quá nhiều file</span><span class="lz-d">Thường là khai báo trong <code>node_modules</code>. <code>skipLibCheck</code> và một mảng <code>types</code> chặt là hai cái cần gạt.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">tsc --generateTrace cho ca khó</span><span class="lz-d">Sinh ra một vết bạn mở được trong profiler và thấy phép tạo kiểu nào đắt, kèm tên.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>skipLibCheck</code> làm build nhanh lên bằng cách không kiểm những kiểu bạn đang phụ thuộc.</strong> Nó là khuyến nghị chuẩn và thường là đúng, nhưng nó là một cuộc đánh đổi chứ không phải món hời miễn phí: nó chặn <code>tsc</code> kiểm các file <code>.d.ts</code>, nên hai package có khai báo thật sự xung đột — kinh điển là hai phiên bản <code>@types/node</code> lệch nhau trong một monorepo — không còn sinh lỗi lúc build. Xung đột vẫn có thật; bạn chỉ gặp nó muộn hơn, dưới dạng một kiểu giải ra khác nhau ở hai chỗ và một thông báo lỗi chẳng ra nghĩa gì. Hãy bật <code>skipLibCheck</code> cho tốc độ hằng ngày, và chạy một việc CI không có nó để xung đột vẫn lộ ra ở đâu đó.</p></div>
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
      isFreePreview: true,
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
<h3>Two ways to stop redoing work</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">incremental: true</span><span class="lz-t">Cache across runs</span><span class="lz-d">Writes a <code>.tsbuildinfo</code> and re-checks only what changed. One line of config, works on any project.</span></div>
<div class="lz-node"><span class="lz-k">Project references</span><span class="lz-t">Split into buildable units</span><span class="lz-d">Each sub-project emits its own <code>.d.ts</code>, and dependents check against that instead of re-checking the source.</span></div>
<div class="lz-node"><span class="lz-k">composite: true</span><span class="lz-t">Required on a referenced project</span><span class="lz-d">Forces declaration emit and a rootDir, which is what makes a referenced project consumable without its sources.</span></div>
<div class="lz-node"><span class="lz-k">tsc --build</span><span class="lz-t">The orchestrator</span><span class="lz-d">Walks the reference graph, builds only stale projects, in dependency order. Plain <code>tsc</code> ignores references entirely.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — a stale <code>.tsbuildinfo</code> makes <code>tsc</code> skip work that genuinely needed redoing.</strong> The cache keys on file timestamps and sizes, so anything that changes a file's meaning without changing those — a <code>git checkout</code> that restores an older version byte-for-byte, a Docker layer that copies files with a fixed mtime, a branch switch on a fast filesystem — can leave the build convinced nothing changed. You get a green build of the previous code, which is worse than a red one. Add <code>*.tsbuildinfo</code> to <code>.gitignore</code> (a committed one poisons every clone), never copy it into a Docker image, and when a build result is inexplicable, delete it and re-run before you debug anything else.</p></div>
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
<h3>Hai cách để thôi làm lại việc đã làm</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">incremental: true</span><span class="lz-t">Nhớ đệm giữa các lần chạy</span><span class="lz-d">Ghi một file <code>.tsbuildinfo</code> và chỉ kiểm lại phần đã đổi. Một dòng cấu hình, chạy được với mọi dự án.</span></div>
<div class="lz-node"><span class="lz-k">Project references</span><span class="lz-t">Chia thành các đơn vị dựng được</span><span class="lz-d">Mỗi dự án con sinh <code>.d.ts</code> riêng, và các dự án phụ thuộc kiểm với cái đó thay vì kiểm lại mã nguồn.</span></div>
<div class="lz-node"><span class="lz-k">composite: true</span><span class="lz-t">Bắt buộc trên dự án được tham chiếu</span><span class="lz-d">Ép sinh khai báo và một rootDir, và chính điều đó làm một dự án được tham chiếu dùng được mà không cần mã nguồn của nó.</span></div>
<div class="lz-node"><span class="lz-k">tsc --build</span><span class="lz-t">Người điều phối</span><span class="lz-d">Đi qua đồ thị tham chiếu, chỉ dựng những dự án đã cũ, theo thứ tự phụ thuộc. <code>tsc</code> trơn bỏ qua hoàn toàn các tham chiếu.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một <code>.tsbuildinfo</code> cũ làm <code>tsc</code> bỏ qua đúng phần việc thật sự cần làm lại.</strong> Bộ nhớ đệm khoá theo dấu thời gian và kích thước file, nên bất cứ thứ gì đổi ý nghĩa của file mà không đổi hai thứ đó — một <code>git checkout</code> khôi phục bản cũ giống hệt từng byte, một lớp Docker chép file với mtime cố định, một cú đổi nhánh trên hệ tệp nhanh — đều có thể làm bản dựng đinh ninh là chẳng có gì đổi. Bạn nhận một bản build xanh của mã trước đó, thứ còn tệ hơn một bản đỏ. Hãy thêm <code>*.tsbuildinfo</code> vào <code>.gitignore</code> (lỡ commit một cái là đầu độc mọi bản clone), đừng bao giờ chép nó vào ảnh Docker, và khi một kết quả build không sao giải thích nổi thì hãy xoá nó chạy lại trước khi gỡ lỗi bất cứ thứ gì khác.</p></div>
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
      isFreePreview: true,
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
<h3>Why a bundler needs isolatedModules</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">tsc sees the whole program</span><span class="lz-d">It resolves every import, so it knows whether a re-exported name is a type or a value and can drop it correctly.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">esbuild / swc see one file</span><span class="lz-d">They transpile in isolation for speed. Given <code>export { User } from './types'</code> they cannot tell whether <code>User</code> exists at runtime.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">isolatedModules bans the ambiguity</span><span class="lz-d">It turns every construct a single-file transpiler cannot handle into a compile error, so <code>tsc</code> catches them before the bundler mis-emits.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The two-tool setup</span><span class="lz-d">Bundler transpiles (fast, no type info), <code>tsc --noEmit</code> checks. Neither does the other's job, and CI must run both.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — the bundler emits your code even when the types are wrong, because it never looked at them.</strong> esbuild strips types without checking a single one; that is why it is fast. So a dev server keeps serving a broken build, and a Docker image built with only the bundler ships type errors to production — the whole guarantee is gone and nothing in the output says so. The <code>tsc --noEmit</code> step is not optional overhead, it is where the checking happens: put it in the same script as the build (<code>tsc --noEmit &amp;&amp; vite build</code>) so it cannot be skipped by accident, and run it in CI on every push.</p></div>
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
<h3>Vì sao một bundler cần isolatedModules</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">tsc nhìn thấy cả chương trình</span><span class="lz-d">Nó giải mọi import, nên nó biết một cái tên được xuất lại là kiểu hay giá trị và bỏ nó đi đúng cách.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">esbuild / swc chỉ nhìn một file</span><span class="lz-d">Chúng dịch trong cô lập để lấy tốc độ. Với <code>export { User } from './types'</code> chúng không biết được <code>User</code> có tồn tại lúc chạy hay không.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">isolatedModules cấm sự mập mờ</span><span class="lz-d">Nó biến mọi cấu trúc mà một trình dịch từng-file không xử nổi thành lỗi biên dịch, để <code>tsc</code> bắt chúng trước khi bundler sinh sai.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Bộ đôi công cụ</span><span class="lz-d">Bundler dịch (nhanh, không thông tin kiểu), <code>tsc --noEmit</code> kiểm. Không cái nào làm việc của cái kia, và CI phải chạy cả hai.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — bundler vẫn sinh mã kể cả khi kiểu sai, vì nó chưa bao giờ nhìn vào kiểu.</strong> esbuild tước kiểu đi mà không kiểm lấy một cái; đó chính là lý do nó nhanh. Nên một dev server cứ phục vụ một bản dựng hỏng, và một ảnh Docker dựng bằng mỗi bundler sẽ ship lỗi kiểu lên production — cả cái bảo đảm biến mất mà chẳng gì trong đầu ra nói cho bạn. Bước <code>tsc --noEmit</code> không phải phần phụ trội tuỳ chọn, nó là nơi việc kiểm diễn ra: hãy đặt nó cùng một script với lệnh build (<code>tsc --noEmit &amp;&amp; vite build</code>) để không thể lỡ tay bỏ qua, và chạy nó trong CI ở mọi lần push.</p></div>
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
      isFreePreview: true,
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
<h3>import type, and its config switches</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">import type { T }</span><span class="lz-t">Guaranteed erased</span><span class="lz-d">Explicit and unambiguous, which is what a single-file transpiler needs. Using the binding as a value is an error.</span></div>
<div class="lz-layer"><span class="lz-k">import { type T, value }</span><span class="lz-t">Inline, mixed</span><span class="lz-d">TS 4.5+. Lets one statement bring in both, with the type-only part marked. Handy when a module exports both kinds.</span></div>
<div class="lz-layer"><span class="lz-k">verbatimModuleSyntax</span><span class="lz-t">No guessing at all</span><span class="lz-d">Emits imports exactly as written: anything not marked <code>type</code> stays in the output. Removes the elision rules entirely — the modern recommendation.</span></div>
<div class="lz-layer"><span class="lz-k">Side-effect imports survive</span><span class="lz-t">import './register'</span><span class="lz-d">The bare form is never elided under any setting, which is why it is the correct way to depend on a module's load-time behaviour.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>import type</code> on something you need at runtime compiles, then throws.</strong> The rule is what the value is used <em>for</em>, not what it looks like: a class is both a type and a value, so <code>import type { ApiError } from './errors'</code> is legal, and <code>catch (e) { if (e instanceof ApiError) }</code> then fails with TS1361 — "cannot be used as a value because it was imported using 'import type'". That one is caught. The uncaught version is a Zod schema or a Prisma enum object imported as a type in a file that only uses it in a type position today; add a runtime use later and the error is immediate and clear. The real danger stays the side-effect module from chapter 10 — no error, just behaviour that quietly stops happening.</p></div>
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
<h3>import type, và các công tắc cấu hình của nó</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">import type { T }</span><span class="lz-t">Chắc chắn bị xoá</span><span class="lz-d">Tường minh và không mập mờ, đúng thứ một trình dịch từng-file cần. Dùng tên đó như giá trị là lỗi.</span></div>
<div class="lz-layer"><span class="lz-k">import { type T, value }</span><span class="lz-t">Đánh dấu tại chỗ, trộn lẫn</span><span class="lz-d">TS 4.5+. Cho một câu lệnh mang vào cả hai loại, với phần chỉ-kiểu được đánh dấu. Tiện khi một module xuất cả hai.</span></div>
<div class="lz-layer"><span class="lz-k">verbatimModuleSyntax</span><span class="lz-t">Không đoán gì cả</span><span class="lz-d">Sinh import đúng như đã viết: thứ gì không đánh dấu <code>type</code> thì ở lại trong đầu ra. Gỡ bỏ hoàn toàn các luật bỏ-import — khuyến nghị hiện đại.</span></div>
<div class="lz-layer"><span class="lz-k">Import vì tác dụng phụ thì sống sót</span><span class="lz-t">import './register'</span><span class="lz-d">Dạng trần không bao giờ bị bỏ dưới bất kỳ thiết lập nào, và đó là lý do nó là cách đúng để phụ thuộc vào hành vi lúc nạp của một module.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>import type</code> cho thứ bạn cần lúc chạy thì biên dịch được, rồi ném lỗi.</strong> Luật nằm ở chỗ giá trị được dùng <em>để làm gì</em>, không phải ở hình dáng của nó: một class vừa là kiểu vừa là giá trị, nên <code>import type { ApiError } from './errors'</code> hợp lệ, rồi <code>catch (e) { if (e instanceof ApiError) }</code> hỏng với TS1361 — "cannot be used as a value because it was imported using 'import type'". Cái đó có bắt được. Bản không bắt được là một schema Zod hay một object enum Prisma import dạng kiểu trong một file hôm nay chỉ dùng nó ở vị trí kiểu; thêm một chỗ dùng lúc chạy sau này thì lỗi hiện ra ngay và rõ. Cái nguy hiểm thật vẫn là module có tác dụng phụ ở chương 10 — không lỗi nào, chỉ có hành vi lặng lẽ thôi xảy ra.</p></div>
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
