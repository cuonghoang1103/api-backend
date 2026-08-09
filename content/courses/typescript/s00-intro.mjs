/**
 * TypeScript — Mục 0: Giới thiệu khoá học & Hướng dẫn học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi. KHÔNG dùng backtick trần trong content
 * (dùng &#96;), mọi `${` trong code mẫu escape thành \${, và mọi < > trong code
 * phải viết &lt; &gt; (khoá này đầy generic nên cực dễ dính).
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Section 0 — Introduction & How to Study|||Mục 0 — Giới thiệu khoá học & Hướng dẫn học',
  description: 'Đọc trước tiên: khoá học này dạy gì, học theo cách nào, cài đặt ra sao, và mô hình tư duy quan trọng nhất — thời điểm biên dịch khác thời điểm chạy.',
  lessons: [
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — About this course & the full roadmap|||0.1 — Về khoá học này & bản đồ toàn khoá',
      slug: 'typescript-0-1-gioi-thieu',
      type: 'VIDEO',
      isFreePreview: true,
      // Video lịch sử: "TypeScript Origins: The Documentary" (OfferZen) — kể lại
      // sự ra đời của TypeScript với chính Anders Hejlsberg, người sáng lập.
      video: { url: 'https://youtu.be/U6s2pdxebSo', durationSeconds: 0 },
      description: 'TypeScript là gì, ai tạo ra và vì sao, nó giải quyết vấn đề gì của JavaScript, dùng ở đâu — và bản đồ 16 chương.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>TypeScript — from zero to mastering the type system</h2>
<p class="lead">This course teaches you to read and write <strong>types</strong> the way a professional does: not "add a colon and a word" but understanding what the type checker actually proves, where it can't help you, and how to make it catch bugs <em>before</em> your code ever runs. Every single example in this course is fed through the real compiler — if a line is claimed to error, you will see the exact error message.</p>

<h3>What problem does TypeScript solve?</h3>
<p>JavaScript never tells you a mistake until the moment that broken line runs — often in front of a user, in production, hours after you shipped it. You call <code>user.emial</code> instead of <code>user.email</code> and get <code>undefined</code>; you pass a string where a number was expected and get <code>NaN</code> three functions later. TypeScript is a <strong>type checker</strong> that reads your code without running it and reports these mistakes as you type.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Plain JavaScript</span><span class="v">Typo <code>user.emial</code> → <code>undefined</code> at runtime, no warning, ships to production.</span></div>
  <div class="kv"><span class="k">TypeScript</span><span class="v">Red squiggle in the editor: "Property 'emial' does not exist on type 'User'. Did you mean 'email'?"</span></div>
  <div class="kv"><span class="k">Plain JavaScript</span><span class="v">You refactor a function's arguments and forget one of the 20 call sites. It breaks at runtime, later.</span></div>
  <div class="kv"><span class="k">TypeScript</span><span class="v">All 20 call sites light up red instantly. The refactor is safe.</span></div>
</div>
<p>That is the whole pitch: <strong>TypeScript moves errors from runtime (expensive, in front of users) to compile time (cheap, in your editor).</strong> Chapter 1 makes this concrete with real compiler output.</p>

<h3>What is TypeScript, who made it, and what did it replace?</h3>
<p>By 2010, JavaScript was being used to build enormous applications it was never designed for. Microsoft was writing huge web apps (like Office online) in a language with no types, no tooling that understood the code, and no way to catch a rename gone wrong. In <strong>2012</strong>, a team at Microsoft led by <strong>Anders Hejlsberg</strong> — the same engineer behind Turbo Pascal, Delphi and C# — released <strong>TypeScript</strong>: a <em>superset</em> of JavaScript that adds a type layer on top. The documentary above tells that story from the people who lived it.</p>
<p>The key design decision: TypeScript is a <strong>superset</strong>. Every valid JavaScript file is already valid TypeScript. You don't rewrite anything; you add types gradually. And crucially, <strong>the types disappear when the code runs</strong> — TypeScript compiles down to plain JavaScript, the types are erased, and the browser or Node never sees them. It didn't replace JavaScript; it wrapped it in a safety net that the JS engine never has to know about.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Who &amp; when</span><span class="v">Anders Hejlsberg / Microsoft, first release 2012. Open source, developed in the open on GitHub.</span></div>
  <div class="kv"><span class="k">What it is</span><span class="v">A typed superset of JavaScript + a compiler (<code>tsc</code>) that checks types and emits plain JS.</span></div>
  <div class="kv"><span class="k">Where it's used</span><span class="v">Angular, most React/Next apps, VS Code itself, Deno, and this site's entire backend. It is the default choice for new serious JS projects.</span></div>
  <div class="kv"><span class="k">Why learn it</span><span class="v">"TypeScript" is now near the top of nearly every frontend and backend job listing; and it makes large codebases — like the one this course draws from — actually maintainable.</span></div>
</div>

<h3>What you will be able to do</h3>
<ul>
  <li>Read any TypeScript codebase — including generics like <code>Map&lt;string, User[]&gt;</code> and utility types like <code>Partial&lt;T&gt;</code> — without getting lost.</li>
  <li>Model data precisely with unions, discriminated unions and <code>readonly</code>, so invalid states can't even be represented.</li>
  <li>Write generic functions and types that work for any input while keeping full type safety.</li>
  <li>Configure <code>tsconfig.json</code> for a real project and understand every strict flag you turn on.</li>
  <li>Type a real Node/Express backend and a React frontend end to end.</li>
</ul>

<h3>The roadmap — 4 stages, 16 chapters</h3>
<p>Each stage assumes the one before it. The type system is cumulative: chapter 7 (conditional types) is unreadable if chapter 6 (generics) never clicked.</p>
<div class="lz-map">
  <div class="lz-stage">Stage 1 · Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Why TypeScript exists</div><div class="lz-nsub">JavaScript's failure modes, what a type checker proves, the compile step</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">The basic type system</div><div class="lz-nsub">Primitives, arrays, tuples, any / unknown / never, type inference</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Functions</div><div class="lz-nsub">Parameter &amp; return types, optional/default, overloads, void vs undefined</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Objects, interfaces &amp; type aliases</div><div class="lz-nsub">interface vs type, readonly, optional, index signatures, extends</div></div></div>
  <div class="lz-stage">Stage 2 · The real type system</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Unions, literals &amp; narrowing</div><div class="lz-nsub">Discriminated unions, type guards, control-flow narrowing</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Generics</div><div class="lz-nsub">Generic functions, constraints, defaults, generic classes</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Advanced types</div><div class="lz-nsub">keyof, typeof, mapped types, conditional types, infer, template literals</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Utility types</div><div class="lz-nsub">Partial, Pick, Omit, Record, Awaited — and building them from scratch</div></div></div>
  <div class="lz-stage">Stage 3 · TypeScript in practice</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">tsconfig &amp; the compiler</div><div class="lz-nsub">strict flags, target/module, paths, the options that actually matter</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Modules &amp; declaration files</div><div class="lz-nsub">.d.ts, ambient types, module resolution, DefinitelyTyped</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">TypeScript with Node &amp; Express</div><div class="lz-nsub">Typing req/res, async handlers, errors — a real backend</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">TypeScript in the frontend</div><div class="lz-nsub">React props, hooks, events — pairs with the Next.js course</div></div></div>
  <div class="lz-stage">Stage 4 · Mastery</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Type-safe data</div><div class="lz-nsub">Zod, runtime validation, inferring types from schemas, Prisma types</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Classes, decorators &amp; OOP</div><div class="lz-nsub">Access modifiers, abstract, decorators, when OOP earns its place</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Compile performance &amp; build</div><div class="lz-nsub">tsc vs esbuild/swc, isolatedModules, project references, type-check cost</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Advanced patterns &amp; architecture</div><div class="lz-nsub">Branded types, exhaustiveness, module augmentation, migrating JS → TS</div></div></div>
</div>

<h3>Who this is for</h3>
<p>You should already know <strong>basic JavaScript</strong>: variables, functions, objects, arrays, and roughly what <code>async/await</code> does. If that is shaky, do chapters 4–5 of the "Web Foundations" course or chapter 1 of the Node.js course first. You do <strong>not</strong> need any prior TypeScript.</p>
<div class="callout ok">Time budget: roughly <strong>2–3 hours per chapter</strong> if you type every example and run it through the compiler. 16 chapters ≈ 40–50 hours to genuinely absorb. The goal is not to finish — it's to reach the point where you can look at a red squiggle and know exactly why it's there.</div>
<div class="note-ct">This site (cuongthai.com) is written in TypeScript end to end: roughly 244 TypeScript files and 80,000 lines on the backend alone, plus a fully typed React/Next frontend. Every database model, every API route, every service is typed. When a chapter says "here's how it's done in production", it means <em>here</em> — including the enum rename that passed every check and still broke production because one file had a hand-written copy of the type.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice track: TypeScript on Code Lab</span><span class="lc-sub">16 modules · 160 hands-on exercises with solutions — the companion drills for this course.</span></span>
</a>
<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">🔷</span>
  <span class="lc-body"><span class="lc-title">typescriptlang.org — the official Handbook</span><span class="lc-sub">The authoritative reference and guide. More accurate and current than any blog.</span></span>
</a>
<a class="link-card dl" href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">
  <span class="lc-ico">▶️</span>
  <span class="lc-body"><span class="lc-title">TS Playground — try types in the browser</span><span class="lc-sub">Write TypeScript, see the compiled JS and the errors live. Your fastest experiment lab.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>TypeScript — từ số 0 tới làm chủ hệ thống kiểu</h2>
<p class="lead">Khoá này dạy bạn đọc và viết <strong>kiểu (type)</strong> theo cách của dân chuyên nghiệp: không phải "thêm dấu hai chấm và một chữ" mà là hiểu trình kiểm tra kiểu thật sự chứng minh được gì, ở đâu nó bó tay, và làm sao để nó bắt bug <em>trước khi</em> code của bạn chạy. Mọi ví dụ trong khoá đều được đưa qua trình biên dịch thật — nếu một dòng được nói là sẽ lỗi, bạn sẽ thấy đúng thông báo lỗi đó.</p>

<h3>TypeScript giải quyết vấn đề gì?</h3>
<p>JavaScript không bao giờ báo cho bạn biết một lỗi cho tới đúng lúc dòng hỏng đó chạy — thường là trước mặt người dùng, trên production, hàng giờ sau khi bạn ship. Bạn gọi <code>user.emial</code> thay vì <code>user.email</code> và nhận về <code>undefined</code>; bạn truyền một chuỗi vào chỗ cần số và nhận <code>NaN</code> ba hàm sau đó. TypeScript là một <strong>trình kiểm tra kiểu</strong> đọc code của bạn mà không chạy nó, và báo những lỗi này ngay lúc bạn gõ.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">JavaScript thường</span><span class="v">Gõ sai <code>user.emial</code> → <code>undefined</code> lúc chạy, không cảnh báo, ship thẳng lên production.</span></div>
  <div class="kv"><span class="k">TypeScript</span><span class="v">Gạch đỏ trong editor: "Property 'emial' does not exist on type 'User'. Did you mean 'email'?"</span></div>
  <div class="kv"><span class="k">JavaScript thường</span><span class="v">Bạn đổi tham số của một hàm và quên mất một trong 20 chỗ gọi. Nó vỡ lúc chạy, muộn màng.</span></div>
  <div class="kv"><span class="k">TypeScript</span><span class="v">Cả 20 chỗ gọi sáng đỏ ngay lập tức. Việc refactor trở nên an toàn.</span></div>
</div>
<p>Đó là toàn bộ lời chào hàng: <strong>TypeScript dời lỗi từ lúc chạy (đắt đỏ, trước mặt người dùng) sang lúc biên dịch (rẻ, ngay trong editor của bạn).</strong> Chương 1 làm rõ điều này bằng output thật của trình biên dịch.</p>

<h3>TypeScript là gì, ai tạo ra, và nó thay thế cái gì?</h3>
<p>Tới khoảng 2010, JavaScript đang bị dùng để xây những ứng dụng khổng lồ mà nó chưa từng được thiết kế cho. Microsoft viết những web app rất lớn (như Office bản web) bằng một ngôn ngữ không có kiểu, không có công cụ nào hiểu được code, và không có cách nào bắt một lần đổi tên bị sai. Năm <strong>2012</strong>, một nhóm tại Microsoft do <strong>Anders Hejlsberg</strong> dẫn dắt — chính kỹ sư đứng sau Turbo Pascal, Delphi và C# — phát hành <strong>TypeScript</strong>: một <em>superset</em> (tập cha) của JavaScript, thêm một tầng kiểu lên trên. Bộ phim tài liệu phía trên kể lại câu chuyện đó từ chính những người trong cuộc.</p>
<p>Quyết định thiết kế then chốt: TypeScript là một <strong>superset</strong>. Mọi file JavaScript hợp lệ vốn đã là TypeScript hợp lệ. Bạn không viết lại gì cả; bạn thêm kiểu dần dần. Và quan trọng nhất, <strong>các kiểu biến mất khi code chạy</strong> — TypeScript biên dịch xuống thành JavaScript thuần, kiểu bị xoá sạch, trình duyệt hay Node không bao giờ thấy chúng. Nó không thay thế JavaScript; nó bọc JavaScript trong một tấm lưới an toàn mà engine JS chẳng cần biết đến.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ai &amp; khi nào</span><span class="v">Anders Hejlsberg / Microsoft, bản đầu 2012. Mã nguồn mở, phát triển công khai trên GitHub.</span></div>
  <div class="kv"><span class="k">Nó là gì</span><span class="v">Một superset có kiểu của JavaScript + trình biên dịch (<code>tsc</code>) kiểm tra kiểu rồi xuất ra JS thuần.</span></div>
  <div class="kv"><span class="k">Dùng ở đâu</span><span class="v">Angular, phần lớn app React/Next, chính VS Code, Deno, và toàn bộ backend của site này. Là lựa chọn mặc định cho mọi dự án JS nghiêm túc mới.</span></div>
  <div class="kv"><span class="k">Vì sao học</span><span class="v">"TypeScript" nay nằm gần đầu gần như mọi tin tuyển frontend và backend; và nó làm cho những codebase lớn — như codebase khoá này lấy ví dụ — thật sự bảo trì nổi.</span></div>
</div>

<h3>Học xong bạn làm được gì</h3>
<ul>
  <li>Đọc bất kỳ codebase TypeScript nào — kể cả generic như <code>Map&lt;string, User[]&gt;</code> và utility type như <code>Partial&lt;T&gt;</code> — mà không lạc lối.</li>
  <li>Mô hình hoá dữ liệu thật chính xác bằng union, discriminated union và <code>readonly</code>, để những trạng thái không hợp lệ thậm chí không biểu diễn nổi.</li>
  <li>Viết hàm và kiểu generic chạy được với mọi đầu vào mà vẫn giữ trọn an toàn kiểu.</li>
  <li>Cấu hình <code>tsconfig.json</code> cho một dự án thật và hiểu từng cờ strict mà bạn bật.</li>
  <li>Gõ kiểu cho một backend Node/Express thật và một frontend React từ đầu tới cuối.</li>
</ul>

<h3>Bản đồ khoá học — 4 giai đoạn, 16 chương</h3>
<p>Mỗi giai đoạn dựa trên giai đoạn trước. Hệ thống kiểu là dồn tích: chương 7 (conditional types) sẽ không đọc nổi nếu chương 6 (generics) chưa thông.</p>
<div class="lz-map">
  <div class="lz-stage">Giai đoạn 1 · Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Vì sao TypeScript tồn tại</div><div class="lz-nsub">Các kiểu lỗi của JavaScript, trình kiểm tra kiểu chứng minh gì, bước biên dịch</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Hệ thống kiểu cơ bản</div><div class="lz-nsub">Primitive, mảng, tuple, any / unknown / never, suy luận kiểu</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Hàm</div><div class="lz-nsub">Kiểu tham số &amp; trả về, optional/default, overload, void vs undefined</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Object, interface &amp; type alias</div><div class="lz-nsub">interface vs type, readonly, optional, index signature, extends</div></div></div>
  <div class="lz-stage">Giai đoạn 2 · Hệ thống kiểu thật sự</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Union, literal &amp; thu hẹp kiểu</div><div class="lz-nsub">Discriminated union, type guard, thu hẹp theo luồng điều khiển</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Generics</div><div class="lz-nsub">Hàm generic, ràng buộc (constraint), giá trị mặc định, class generic</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Kiểu nâng cao</div><div class="lz-nsub">keyof, typeof, mapped type, conditional type, infer, template literal</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Utility types</div><div class="lz-nsub">Partial, Pick, Omit, Record, Awaited — và tự dựng lại từ số 0</div></div></div>
  <div class="lz-stage">Giai đoạn 3 · TypeScript thực chiến</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">tsconfig &amp; trình biên dịch</div><div class="lz-nsub">Cờ strict, target/module, paths, những tuỳ chọn thật sự quan trọng</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Module &amp; khai báo kiểu</div><div class="lz-nsub">.d.ts, kiểu ambient, module resolution, DefinitelyTyped</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">TypeScript với Node &amp; Express</div><div class="lz-nsub">Gõ kiểu req/res, handler async, lỗi — một backend thật</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">TypeScript ở frontend</div><div class="lz-nsub">Props React, hook, sự kiện — ghép với khoá Next.js</div></div></div>
  <div class="lz-stage">Giai đoạn 4 · Làm chủ</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Kiểu an toàn cho dữ liệu</div><div class="lz-nsub">Zod, validate lúc chạy, suy kiểu từ schema, kiểu do Prisma sinh</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Class, decorator &amp; OOP</div><div class="lz-nsub">Access modifier, abstract, decorator, khi nào OOP xứng công</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Hiệu năng biên dịch &amp; build</div><div class="lz-nsub">tsc vs esbuild/swc, isolatedModules, project references, chi phí kiểm kiểu</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Mẫu nâng cao &amp; kiến trúc</div><div class="lz-nsub">Branded type, exhaustiveness, module augmentation, chuyển JS → TS</div></div></div>
</div>

<h3>Khoá này dành cho ai</h3>
<p>Bạn cần biết <strong>JavaScript cơ bản</strong>: biến, hàm, object, mảng, và đại khái <code>async/await</code> làm gì. Nếu phần đó còn chông chênh, hãy học chương 4–5 khoá "Nền tảng Lập trình Web" hoặc chương 1 khoá Node.js trước. Bạn <strong>không</strong> cần biết TypeScript trước.</p>
<div class="callout ok">Ngân sách thời gian: khoảng <strong>2–3 giờ mỗi chương</strong> nếu bạn gõ mọi ví dụ và cho chạy qua trình biên dịch. 16 chương ≈ 40–50 giờ để thấm thật sự. Mục tiêu không phải học xong — mà là đạt tới lúc nhìn một gạch đỏ là biết ngay vì sao nó ở đó.</div>
<div class="note-ct">Site này (cuongthai.com) viết bằng TypeScript từ đầu tới cuối: khoảng 244 file TypeScript và 80.000 dòng chỉ riêng backend, cộng một frontend React/Next gõ kiểu đầy đủ. Mọi model cơ sở dữ liệu, mọi route API, mọi service đều có kiểu. Khi một chương nói "trong production người ta làm thế này", nghĩa là <em>ở đây</em> — kể cả lần đổi tên một enum qua sạch mọi kiểm tra mà vẫn vỡ production vì có một file giữ bản chép tay của kiểu đó.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Track luyện tập: TypeScript trên Code Lab</span><span class="lc-sub">16 module · 160 bài tập có lời giải — phần thực hành đi kèm khoá học này.</span></span>
</a>
<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">🔷</span>
  <span class="lc-body"><span class="lc-title">typescriptlang.org — Handbook chính thức</span><span class="lc-sub">Tài liệu tham chiếu và hướng dẫn có thẩm quyền. Chính xác và mới hơn mọi bài blog.</span></span>
</a>
<a class="link-card dl" href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">
  <span class="lc-ico">▶️</span>
  <span class="lc-body"><span class="lc-title">TS Playground — thử kiểu ngay trên trình duyệt</span><span class="lc-sub">Viết TypeScript, xem JS biên dịch ra và các lỗi ngay tức thì. Phòng thí nghiệm nhanh nhất của bạn.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — How to study this course|||0.2 — Cách học khoá này cho hiệu quả',
      slug: 'typescript-0-2-cach-hoc',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Vòng lặp học cho một khoá về KIỂU: để trình biên dịch dạy bạn, hover để đọc kiểu, và không tin bất cứ dòng nào chưa qua tsc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>How to study a course about types</h2>
<p class="lead">A course about types has one unusual property: <strong>the compiler is a second teacher that is always right and always available.</strong> The single biggest mistake learners make is reading the type and nodding, instead of hovering over it and letting the editor tell them what the type actually is.</p>

<h3>The loop: five steps per lesson</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Read once</div><div class="lz-d">Whole lesson, no typing. Build the map.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Retype in an editor</div><div class="lz-d">Every example, in VS Code or the Playground.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Hover everything</div><div class="lz-d">Read the type the editor shows on every variable.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Break it</div><div class="lz-d">Make it red on purpose. Read the error.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Practise</div><div class="lz-d">Solve the matching Code Lab exercises.</div></div>
</div>

<h3>Step 3 — hover is the whole game</h3>
<p>In VS Code, resting your cursor on any variable shows the type TypeScript inferred for it. This is not a nice-to-have — it is how you check your mental model against reality on every single line. When you write <code>const x = [1, 2, 3]</code>, hover it: is it <code>number[]</code> or <code>(number | string)[]</code>? When you narrow a union with an <code>if</code>, hover the variable inside the branch and watch the type shrink. Half of "understanding TypeScript" is just <em>looking at what it already knows.</em></p>
<div class="callout ok">Keep the <a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TS Playground</a> open in a browser tab the entire course. It shows the inferred types, the emitted JavaScript, and the errors side by side — no install, no setup, shareable by URL.</div>

<h3>Step 4 — make it red on purpose</h3>
<p>The fastest way to learn what a type <em>prevents</em> is to violate it and read the error. For every example, try at least one:</p>
<ul>
  <li>Assign a <code>string</code> to a <code>number</code> variable — read the exact <code>TS2322</code> message.</li>
  <li>Access a property that doesn't exist — see the "Did you mean…?" suggestion.</li>
  <li>Call a function with the wrong number of arguments.</li>
  <li>Return the wrong type from a function and see <em>which line</em> the error lands on.</li>
</ul>
<p>Error messages are not noise to be dismissed — in TypeScript they are the primary feedback loop. Learning to read <code>TS2345</code>, <code>TS2322</code>, <code>TS2339</code> at a glance is a real, transferable skill, and this course names the codes so you start recognising them.</p>

<h3>The trap unique to TypeScript: "any"</h3>
<p>When TypeScript complains and you don't know how to fix it, the tempting escape is to type <code>any</code>, which switches off all checking for that value. It always makes the red squiggle disappear. It also silently deletes every guarantee you were trying to gain. Treat reaching for <code>any</code> the way a pilot treats an alarm: not as something to mute, but as a signal that you don't yet understand the type. Chapter 2 gives you <code>unknown</code> — the safe tool for "I don't know the type yet".</p>
<div class="pitfall">A course-long rule: if a lesson's example doesn't compile for you, do <strong>not</strong> paper over it with <code>any</code> and move on. Copy the error into the Playground and figure out what it's telling you. The bug you skip today is the concept you fail in chapter 7.</div>

<h3>Step 5 — the practice track</h3>
<p>Code Lab has a TypeScript track that mirrors this course: 16 modules, 160 exercises, each with a worked solution and a live type checker. Use it as the drill ground after each chapter — theory here, reps there.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">After chapters 1–2</span><span class="v">Module: TypeScript basics &amp; the type system</span></div>
  <div class="kv"><span class="k">After chapters 3–4</span><span class="v">Module: Functions, interfaces &amp; object types</span></div>
  <div class="kv"><span class="k">After chapters 5–6</span><span class="v">Module: Unions, narrowing &amp; generics</span></div>
  <div class="kv"><span class="k">After chapters 7–8</span><span class="v">Module: Advanced &amp; utility types</span></div>
</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Open the TypeScript practice track</span><span class="lc-sub">160 exercises with solutions and a live type checker.</span></span>
</a>

<h3>Rules that save months</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trust the compiler over yourself</span><span class="v">If you think the code is fine and tsc says it isn't, tsc is right ~99% of the time. Find out why.</span></div>
  <div class="kv"><span class="k">Read the whole error</span><span class="v">TS errors can be long, but the first line names the problem and the location line names the spot.</span></div>
  <div class="kv"><span class="k">Never let "any" be the answer</span><span class="v">It's the answer to "how do I make the error go away", never to "how do I make the code correct".</span></div>
  <div class="kv"><span class="k">Types describe, they don't run</span><span class="v">A type never executes. If you expect it to validate data at runtime, you want chapter 13 (Zod), not a type.</span></div>
</div>
<div class="note-ct">If you plan to teach or record this material: TypeScript is unforgiving of hand-waving on camera, because a viewer can paste your example and watch it error. Verify every claim in the Playground first — the same discipline this course holds itself to.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cách học một khoá về KIỂU</h2>
<p class="lead">Một khoá về kiểu có một tính chất bất thường: <strong>trình biên dịch là người thầy thứ hai, luôn đúng và luôn có mặt.</strong> Sai lầm lớn nhất của người học là đọc cái kiểu rồi gật gù, thay vì rê chuột lên nó và để editor nói cho biết kiểu thật sự là gì.</p>

<h3>Vòng lặp: năm bước cho mỗi bài</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Đọc một lượt</div><div class="lz-d">Hết bài, chưa gõ. Dựng bản đồ trong đầu.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Gõ lại trong editor</div><div class="lz-d">Mọi ví dụ, trong VS Code hoặc Playground.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Rê chuột lên tất cả</div><div class="lz-d">Đọc kiểu editor hiện trên mỗi biến.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Phá nó</div><div class="lz-d">Cố ý làm nó đỏ. Đọc lỗi.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Luyện tập</div><div class="lz-d">Làm các bài Code Lab tương ứng.</div></div>
</div>

<h3>Bước 3 — rê chuột chính là toàn bộ trò chơi</h3>
<p>Trong VS Code, để con trỏ nghỉ trên bất kỳ biến nào sẽ hiện kiểu mà TypeScript suy ra cho nó. Đây không phải tính năng "có thì tốt" — nó là cách bạn đối chiếu mô hình trong đầu với thực tế trên từng dòng. Khi bạn viết <code>const x = [1, 2, 3]</code>, rê chuột lên: nó là <code>number[]</code> hay <code>(number | string)[]</code>? Khi bạn thu hẹp một union bằng <code>if</code>, rê chuột lên biến bên trong nhánh và xem kiểu co lại. Một nửa của "hiểu TypeScript" chỉ là <em>nhìn vào những gì nó đã biết sẵn.</em></p>
<div class="callout ok">Hãy để <a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TS Playground</a> mở trong một tab suốt khoá học. Nó hiện kiểu suy ra, JavaScript xuất ra, và các lỗi cạnh nhau — không cần cài, không cần thiết lập, chia sẻ được bằng URL.</div>

<h3>Bước 4 — cố ý làm nó đỏ</h3>
<p>Cách nhanh nhất để học một kiểu <em>ngăn</em> điều gì là vi phạm nó và đọc lỗi. Với mỗi ví dụ, thử ít nhất một việc:</p>
<ul>
  <li>Gán một <code>string</code> cho biến <code>number</code> — đọc đúng thông báo <code>TS2322</code>.</li>
  <li>Truy cập một thuộc tính không tồn tại — xem gợi ý "Did you mean…?".</li>
  <li>Gọi hàm với số lượng đối số sai.</li>
  <li>Trả về sai kiểu từ một hàm và xem lỗi rơi vào <em>dòng nào</em>.</li>
</ul>
<p>Thông báo lỗi không phải tiếng ồn để gạt đi — trong TypeScript chúng là vòng phản hồi chính. Học đọc lướt <code>TS2345</code>, <code>TS2322</code>, <code>TS2339</code> là một kỹ năng thật, chuyển giao được, và khoá này gọi tên các mã đó để bạn bắt đầu nhận diện chúng.</p>

<h3>Cái bẫy chỉ TypeScript mới có: "any"</h3>
<p>Khi TypeScript càu nhàu mà bạn không biết sửa sao, lối thoát cám dỗ là gõ <code>any</code> — nó tắt hết mọi kiểm tra cho giá trị đó. Nó luôn làm gạch đỏ biến mất. Nó cũng âm thầm xoá sạch mọi bảo đảm mà bạn đang cố giành lấy. Hãy coi việc với tay tới <code>any</code> như phi công coi một tiếng chuông báo động: không phải thứ để tắt tiếng, mà là tín hiệu rằng bạn chưa hiểu cái kiểu. Chương 2 sẽ cho bạn <code>unknown</code> — công cụ an toàn cho tình huống "tôi chưa biết kiểu".</p>
<div class="pitfall">Một quy tắc xuyên khoá: nếu ví dụ của một bài không biên dịch được với bạn, <strong>đừng</strong> lấy <code>any</code> trét lên rồi đi tiếp. Chép lỗi vào Playground và tìm ra nó đang nói gì. Con bug bạn bỏ qua hôm nay chính là khái niệm bạn tạch ở chương 7.</div>

<h3>Bước 5 — track luyện tập</h3>
<p>Code Lab có track TypeScript phản chiếu đúng khoá này: 16 module, 160 bài tập, mỗi bài có lời giải chi tiết và một trình kiểm tra kiểu ngay tại chỗ. Dùng nó làm thao trường sau mỗi chương — lý thuyết ở đây, số lần lặp ở đó.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Sau chương 1–2</span><span class="v">Module: TypeScript cơ bản &amp; hệ thống kiểu</span></div>
  <div class="kv"><span class="k">Sau chương 3–4</span><span class="v">Module: Hàm, interface &amp; kiểu object</span></div>
  <div class="kv"><span class="k">Sau chương 5–6</span><span class="v">Module: Union, thu hẹp kiểu &amp; generics</span></div>
  <div class="kv"><span class="k">Sau chương 7–8</span><span class="v">Module: Kiểu nâng cao &amp; utility type</span></div>
</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Mở track luyện tập TypeScript</span><span class="lc-sub">160 bài tập có lời giải và trình kiểm tra kiểu tại chỗ.</span></span>
</a>

<h3>Vài nguyên tắc tiết kiệm cho bạn hàng tháng trời</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tin trình biên dịch hơn tin mình</span><span class="v">Nếu bạn nghĩ code ổn mà tsc bảo không, tsc đúng ~99% số lần. Hãy tìm cho ra vì sao.</span></div>
  <div class="kv"><span class="k">Đọc hết cái lỗi</span><span class="v">Lỗi TS có thể dài, nhưng dòng đầu gọi tên vấn đề và dòng vị trí chỉ đúng chỗ.</span></div>
  <div class="kv"><span class="k">Đừng để "any" là câu trả lời</span><span class="v">Nó là đáp án cho "làm sao cho hết lỗi", không bao giờ là đáp án cho "làm sao cho code đúng".</span></div>
  <div class="kv"><span class="k">Kiểu chỉ mô tả, không chạy</span><span class="v">Một kiểu không bao giờ được thực thi. Nếu bạn mong nó kiểm tra dữ liệu lúc chạy, thứ bạn cần là chương 13 (Zod), không phải một kiểu.</span></div>
</div>
<div class="note-ct">Nếu bạn định dạy lại hoặc quay video phần này: TypeScript không dung thứ cho kiểu nói cho có trước ống kính, vì người xem có thể dán ví dụ của bạn vào và thấy nó lỗi. Hãy kiểm chứng mọi khẳng định trong Playground trước — đúng thứ kỷ luật mà khoá này tự áp cho mình.</div>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Setting up your environment|||0.3 — Cài đặt môi trường làm việc',
      slug: 'typescript-0-3-cai-dat',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: Programming with Mosh "TypeScript Tutorial for Beginners" — cài đặt + nền tảng.
      video: { url: 'https://youtu.be/d56mG7DezGs', durationSeconds: 0 },
      description: 'Cài TypeScript, biên dịch file đầu tiên và xem JavaScript nó xuất ra, chạy .ts trực tiếp, và thấy một lỗi kiểu THẬT.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Setting up your environment</h2>
<p class="lead">TypeScript is a package you install with npm — there is no separate "TypeScript app". You need Node.js (which gives you <code>node</code> and <code>npm</code>), then one command installs the compiler. Everything below was run on the machine writing this course; your version numbers may be newer, and that's fine.</p>

<h3>Prerequisite: Node.js</h3>
<p>Install Node 22 LTS through a version manager exactly as the Node.js course chapter 0.3 describes (nvm on macOS/Linux, nvm-windows or fnm on Windows). Verify:</p>
<pre><code>node -v
npm -v</code></pre>
<div class="out">v22.21.0
10.9.4</div>

<h3>Install TypeScript</h3>
<p>Install it <strong>per project</strong>, not globally. A global <code>tsc</code> drifts out of sync with what each project expects; a project-local one is pinned in <code>package.json</code> and everyone on the team gets the same compiler.</p>
<pre><code><span class="tok-comment"># in a fresh folder</span>
npm init -y
npm install -D typescript
npx tsc -v</code></pre>
<div class="out">Version 7.0.2</div>
<p>The <code>-D</code> makes it a <em>dev dependency</em> — it's needed to build, not to run the output. <code>npx tsc</code> runs the project-local compiler. Note the version: TypeScript <strong>7.0</strong> is the new native compiler (rewritten in Go), dramatically faster than the older JavaScript-based <code>tsc</code> — chapter 15 measures exactly how much.</p>

<h3>Your first TypeScript program</h3>
<p>Create <code>hello.ts</code>. Note the type annotations — <code>: string</code> after the parameter and after the parentheses:</p>
<pre><code><span class="tok-comment">// hello.ts</span>
<span class="tok-keyword">const</span> who: <span class="tok-keyword">string</span> = <span class="tok-string">'CuongThai'</span>;

<span class="tok-keyword">function</span> <span class="tok-function">greet</span>(name: <span class="tok-keyword">string</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">return</span> &#96;Xin chào, \${name}!&#96;;
}

<span class="tok-function">console.log</span>(<span class="tok-function">greet</span>(who));</code></pre>
<p>Compile it, then look at what came out:</p>
<pre><code>npx tsc hello.ts   <span class="tok-comment"># produces hello.js next to it</span>
cat hello.js</code></pre>
<div class="out">"use strict";
const who = 'CuongThai';
function greet(name) {
    return &#96;Xin chào, \${name}!&#96;;
}
console.log(greet(who));</div>
<p>This is the single most important thing to notice in the whole setup: <strong>the types are gone.</strong> <code>: string</code> vanished. The output is plain JavaScript that any Node or browser runs. TypeScript's types exist only to check your code — they are <em>erased</em> before execution. Keep this in your head; it explains half of the surprises beginners hit.</p>
<pre><code>node hello.js</code></pre>
<div class="out">Xin chào, CuongThai!</div>

<h3>Skip the compile step: run .ts directly</h3>
<p>Compiling to a <code>.js</code> file and running that is the "build" model (chapter 15). While <em>developing</em>, it's faster to run a <code>.ts</code> file directly. Two ways, both real:</p>
<pre><code><span class="tok-comment"># A) tsx — a tiny runner, most common in projects</span>
npm install -D tsx
npx tsx hello.ts

<span class="tok-comment"># B) Node 22 can strip types by itself, no tool</span>
node hello.ts</code></pre>
<div class="out">Xin chào, CuongThai!</div>
<p>Both print the same line. <code>tsx</code> and Node's built-in stripping both just <em>delete</em> the types and run the JavaScript — they do <strong>not</strong> type-check. That distinction is the point of the next demo.</p>

<h3>See a real type error — and where it is (not) caught</h3>
<p>Create <code>bug.ts</code> that passes a string where a number is required:</p>
<pre><code><span class="tok-comment">// bug.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">double</span>(n: <span class="tok-keyword">number</span>): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">return</span> n * <span class="tok-number">2</span>;
}
<span class="tok-function">double</span>(<span class="tok-string">'5'</span>);   <span class="tok-comment">// a string, not a number</span></code></pre>
<p>Ask the compiler to check it (no output file needed):</p>
<pre><code>npx tsc --noEmit --strict bug.ts</code></pre>
<div class="out">bug.ts(4,8): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.</div>
<p>Read it: file <code>bug.ts</code>, line 4, column 8, error code <code>TS2345</code>, and a plain-English reason. That is the entire value proposition in one line. Now the twist — run the <em>same</em> file with tsx:</p>
<pre><code>npx tsx bug.ts   <span class="tok-comment"># exit code 0 — it RUNS</span></code></pre>
<div class="pitfall">The buggy file runs without complaint under <code>tsx</code> and <code>node</code>, because those tools erase types and don't check them. Only <code>tsc</code> catches the error. Lesson: <strong>type checking (tsc) and running (tsx/node) are two separate steps.</strong> In a real project you run <code>tsc --noEmit</code> in CI to catch type errors, and use a fast runner for execution. Chapters 9 and 15 wire this up properly.</div>

<h3>The editor is where you'll actually live</h3>
<p>Use <strong>VS Code</strong> — it is itself written in TypeScript and ships with the language built in. You don't install an extension for TypeScript; it just works. The two things to internalise:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Hover a variable</span><span class="v">Shows the type TypeScript inferred. Your #1 learning tool this whole course.</span></div>
  <div class="kv"><span class="k">Red squiggle</span><span class="v">A type error, shown as you type — the same <code>TSxxxx</code> you'd get from <code>tsc</code>.</span></div>
  <div class="kv"><span class="k">Error Lens extension</span><span class="v">Optional: prints the error inline on the line instead of hiding it in a panel.</span></div>
</div>
<div class="note-ct">This site pins TypeScript in <code>package.json</code> and runs <code>tsc --noEmit</code> as a required CI step before every deploy — because the runtime (tsx / compiled JS) never checks types, CI is the only gate that does. The project even has a <em>second</em> tsc config just for its database seed script, added after an enum rename passed the main check and still broke production. Chapter 9 tells that story.</div>
<a class="link-card dl" href="https://www.typescriptlang.org/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">typescriptlang.org/download — official install guide</span><span class="lc-sub">Every install path (npm, per-project, editors) from the source of truth.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Cài đặt môi trường làm việc</h2>
<p class="lead">TypeScript là một gói bạn cài bằng npm — không có "ứng dụng TypeScript" riêng. Bạn cần Node.js (cho bạn <code>node</code> và <code>npm</code>), rồi một câu lệnh cài trình biên dịch. Mọi thứ bên dưới đều chạy trên chính máy soạn khoá này; số phiên bản của bạn có thể mới hơn, và không sao cả.</p>

<h3>Điều kiện trước: Node.js</h3>
<p>Cài Node 22 LTS qua trình quản lý phiên bản đúng như bài 0.3 khoá Node.js mô tả (nvm trên macOS/Linux, nvm-windows hoặc fnm trên Windows). Kiểm tra:</p>
<pre><code>node -v
npm -v</code></pre>
<div class="out">v22.21.0
10.9.4</div>

<h3>Cài TypeScript</h3>
<p>Cài <strong>theo dự án</strong>, không cài toàn cục. Một <code>tsc</code> toàn cục sẽ lệch pha với thứ mỗi dự án mong đợi; bản cài trong dự án được ghim trong <code>package.json</code> và cả nhóm đều dùng chung một trình biên dịch.</p>
<pre><code><span class="tok-comment"># trong một thư mục mới</span>
npm init -y
npm install -D typescript
npx tsc -v</code></pre>
<div class="out">Version 7.0.2</div>
<p><code>-D</code> khiến nó thành <em>dev dependency</em> — cần để build, không cần để chạy output. <code>npx tsc</code> chạy trình biên dịch cài trong dự án. Để ý phiên bản: TypeScript <strong>7.0</strong> là trình biên dịch native mới (viết lại bằng Go), nhanh hơn hẳn <code>tsc</code> cũ chạy trên JavaScript — chương 15 sẽ đo chính xác nhanh bao nhiêu.</p>

<h3>Chương trình TypeScript đầu tiên</h3>
<p>Tạo <code>hello.ts</code>. Để ý các chú thích kiểu — <code>: string</code> sau tham số và sau cặp ngoặc:</p>
<pre><code><span class="tok-comment">// hello.ts</span>
<span class="tok-keyword">const</span> who: <span class="tok-keyword">string</span> = <span class="tok-string">'CuongThai'</span>;

<span class="tok-keyword">function</span> <span class="tok-function">greet</span>(name: <span class="tok-keyword">string</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">return</span> &#96;Xin chào, \${name}!&#96;;
}

<span class="tok-function">console.log</span>(<span class="tok-function">greet</span>(who));</code></pre>
<p>Biên dịch nó, rồi nhìn thứ chui ra:</p>
<pre><code>npx tsc hello.ts   <span class="tok-comment"># tạo hello.js ngay cạnh</span>
cat hello.js</code></pre>
<div class="out">"use strict";
const who = 'CuongThai';
function greet(name) {
    return &#96;Xin chào, \${name}!&#96;;
}
console.log(greet(who));</div>
<p>Đây là điều quan trọng nhất cần để ý trong toàn bộ phần cài đặt: <strong>các kiểu đã biến mất.</strong> <code>: string</code> bốc hơi. Output là JavaScript thuần mà Node hay trình duyệt nào cũng chạy. Kiểu của TypeScript chỉ tồn tại để kiểm tra code của bạn — chúng bị <em>xoá</em> trước khi thực thi. Hãy giữ điều này trong đầu; nó giải thích một nửa số bất ngờ mà người mới gặp phải.</p>
<pre><code>node hello.js</code></pre>
<div class="out">Xin chào, CuongThai!</div>

<h3>Bỏ qua bước biên dịch: chạy .ts trực tiếp</h3>
<p>Biên dịch ra file <code>.js</code> rồi chạy file đó là mô hình "build" (chương 15). Còn khi <em>đang phát triển</em>, chạy thẳng một file <code>.ts</code> nhanh hơn. Hai cách, đều thật:</p>
<pre><code><span class="tok-comment"># A) tsx — một trình chạy nhỏ gọn, phổ biến nhất trong dự án</span>
npm install -D tsx
npx tsx hello.ts

<span class="tok-comment"># B) Node 22 tự lột kiểu được, khỏi cần công cụ</span>
node hello.ts</code></pre>
<div class="out">Xin chào, CuongThai!</div>
<p>Cả hai in ra cùng một dòng. <code>tsx</code> và bộ lột kiểu sẵn có của Node đều chỉ <em>xoá</em> kiểu rồi chạy JavaScript — chúng <strong>không</strong> kiểm tra kiểu. Sự phân biệt đó chính là điểm mấu chốt của demo tiếp theo.</p>

<h3>Xem một lỗi kiểu thật — và nơi nó (không) bị bắt</h3>
<p>Tạo <code>bug.ts</code> truyền một chuỗi vào chỗ đòi số:</p>
<pre><code><span class="tok-comment">// bug.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">double</span>(n: <span class="tok-keyword">number</span>): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">return</span> n * <span class="tok-number">2</span>;
}
<span class="tok-function">double</span>(<span class="tok-string">'5'</span>);   <span class="tok-comment">// một chuỗi, không phải số</span></code></pre>
<p>Bảo trình biên dịch kiểm tra nó (không cần file output):</p>
<pre><code>npx tsc --noEmit --strict bug.ts</code></pre>
<div class="out">bug.ts(4,8): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.</div>
<p>Đọc nó: file <code>bug.ts</code>, dòng 4, cột 8, mã lỗi <code>TS2345</code>, và một lý do bằng tiếng Anh dễ hiểu. Đó là toàn bộ giá trị của TypeScript gói trong một dòng. Giờ tới cú lật — chạy <em>chính</em> file đó bằng tsx:</p>
<pre><code>npx tsx bug.ts   <span class="tok-comment"># mã thoát 0 — nó CHẠY</span></code></pre>
<div class="pitfall">File có bug vẫn chạy tỉnh bơ dưới <code>tsx</code> và <code>node</code>, vì các công cụ đó xoá kiểu và không kiểm tra chúng. Chỉ <code>tsc</code> bắt được lỗi. Bài học: <strong>kiểm tra kiểu (tsc) và chạy (tsx/node) là hai bước tách biệt.</strong> Trong dự án thật, bạn chạy <code>tsc --noEmit</code> trong CI để bắt lỗi kiểu, và dùng một trình chạy nhanh để thực thi. Chương 9 và 15 sẽ ráp phần này cho tử tế.</div>

<h3>Editor mới là nơi bạn thật sự sống</h3>
<p>Dùng <strong>VS Code</strong> — bản thân nó viết bằng TypeScript và tích hợp sẵn ngôn ngữ này. Bạn không cần cài extension cho TypeScript; nó chạy luôn. Hai thứ cần khắc cốt ghi tâm:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Rê chuột lên biến</span><span class="v">Hiện kiểu TypeScript suy ra. Công cụ học số 1 của bạn suốt khoá này.</span></div>
  <div class="kv"><span class="k">Gạch đỏ</span><span class="v">Một lỗi kiểu, hiện ngay lúc bạn gõ — đúng mã <code>TSxxxx</code> mà <code>tsc</code> sẽ báo.</span></div>
  <div class="kv"><span class="k">Extension Error Lens</span><span class="v">Tuỳ chọn: in lỗi ngay trên dòng thay vì giấu trong một panel.</span></div>
</div>
<div class="note-ct">Site này ghim TypeScript trong <code>package.json</code> và chạy <code>tsc --noEmit</code> như một bước CI bắt buộc trước mỗi lần deploy — vì môi trường chạy (tsx / JS đã biên dịch) không bao giờ kiểm tra kiểu, CI là cửa gác duy nhất làm việc đó. Dự án thậm chí có một cấu hình tsc <em>thứ hai</em> chỉ dành cho script seed cơ sở dữ liệu, thêm vào sau khi một lần đổi tên enum qua sạch kiểm tra chính mà vẫn vỡ production. Chương 9 kể lại câu chuyện đó.</div>
<a class="link-card dl" href="https://www.typescriptlang.org/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">typescriptlang.org/download — hướng dẫn cài chính thức</span><span class="lc-sub">Mọi cách cài (npm, theo dự án, editor) từ nguồn chuẩn.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — The one mental model: compile time vs runtime|||0.4 — Mô hình tư duy cốt lõi: lúc biên dịch vs lúc chạy',
      slug: 'typescript-0-4-mo-hinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Thứ phân biệt người hiểu TypeScript với người chỉ rải dấu hai chấm: kiểu sống ở lúc biên dịch, dữ liệu sống ở lúc chạy — và hai thế giới đó không gặp nhau.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>The one mental model that makes everything click</h2>
<p class="lead">If you take one idea from this whole section, take this: <strong>TypeScript lives at compile time; your data lives at runtime; and they never meet.</strong> Almost every confusion a beginner has — "why didn't it catch this?", "why is my type suddenly wrong?" — dissolves once this split is real to you.</p>

<h3>Two separate worlds</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Compile time</span><span class="v">When <code>tsc</code> reads your code. Types exist here. This is where errors are caught. Nothing runs.</span></div>
  <div class="kv"><span class="k">Runtime</span><span class="v">When <code>node</code> or the browser executes the emitted JavaScript. Types are already gone. Real data exists here.</span></div>
</div>
<p>You saw this literally in lesson 0.3: <code>: string</code> was in <code>hello.ts</code> but nowhere in the compiled <code>hello.js</code>. The type did its job — checking — and was then erased. Here's the flow:</p>
<pre><code>you write      you type-check         it runs
hello.ts  ──▶  tsc (types exist)  ──▶  hello.js (types erased)
               ↑ errors here                ↑ data here</code></pre>

<h3>What this explains</h3>
<p><strong>Why a wrong type can still run.</strong> In 0.3, <code>double('5')</code> ran fine under tsx — because at runtime there is no <code>number</code> type to enforce; there is only the string <code>'5'</code>. The type was a compile-time promise, and you skipped the compile-time check.</p>
<p><strong>Why you can't check a type at runtime.</strong> This does not work, and it's the most common beginner mistake:</p>
<pre><code><span class="tok-keyword">type</span> User = { name: <span class="tok-keyword">string</span> };

<span class="tok-keyword">function</span> <span class="tok-function">handle</span>(x: <span class="tok-keyword">unknown</span>) {
  <span class="tok-comment">// ❌ does NOT work — &#96;User&#96; doesn't exist at runtime</span>
  <span class="tok-keyword">if</span> (x <span class="tok-keyword">instanceof</span> User) { <span class="tok-comment">/* ... */</span> }
}</code></pre>
<p><code>User</code> is a <em>type</em>. By the time this code runs, <code>User</code> has been erased — there is nothing to compare against. To validate real incoming data (an API request, a JSON file) you need a runtime check written in actual JavaScript, or a library like <strong>Zod</strong> that does it for you. That's chapter 13, and it's why "types" and "validation" are two different jobs.</p>
<div class="pitfall">The trap: types describe what you <em>promise</em> is true. They do not verify it. If you cast some untrusted JSON <code>as User</code>, TypeScript believes you — and if you lied, the crash happens later at runtime with the type system none the wiser. Types are a contract checked between <em>your own files</em>, not a bouncer checking data at the door.</div>

<h3>The running example for this course</h3>
<p>Chapters build toward typing a small but real slice of a backend: a <strong>Notes API</strong> — the same shape of thing this website runs. A note has an id, a title, a body, an author, a status. Across the course you'll give it precise types, model its states so invalid ones can't exist, make its functions generic, validate its incoming data, and finally type the Express routes that serve it. Every concept lands on this one concrete object instead of abstract <code>Foo</code> and <code>Bar</code>.</p>
<pre><code><span class="tok-comment">// where we're heading — precise, safe, real (chapter 5+)</span>
<span class="tok-keyword">type</span> NoteStatus = <span class="tok-string">'draft'</span> | <span class="tok-string">'published'</span> | <span class="tok-string">'archived'</span>;

<span class="tok-keyword">interface</span> Note {
  <span class="tok-keyword">readonly</span> id: <span class="tok-keyword">string</span>;
  title: <span class="tok-keyword">string</span>;
  body: <span class="tok-keyword">string</span>;
  status: NoteStatus;
  authorId: <span class="tok-keyword">string</span>;
}</code></pre>
<p>Right now you don't need to understand every line — <code>readonly</code>, the <code>|</code> union, <code>interface</code>. That's the entire point: by chapter 5 this will read as plainly as a sentence, and you'll know exactly which mistakes each keyword prevents.</p>

<h3>How to use this course from here</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">▶</div><div class="lz-t">Next</div><div class="lz-d">Chapter 1 — why TypeScript exists, with real bugs it catches</div></div>
  <div class="lz-step"><div class="lz-k">✎</div><div class="lz-t">Then</div><div class="lz-d">Keep the Playground open, hover everything, break things on purpose</div></div>
  <div class="lz-step"><div class="lz-k">⌨</div><div class="lz-t">After each chapter</div><div class="lz-d">The matching Code Lab TypeScript module</div></div>
</div>
<div class="note-ct">Hold onto the compile-time/runtime split like a handrail. When something surprises you later in the course, the first question to ask is almost always: "is this a compile-time thing or a runtime thing?" Nine times out of ten, that question <em>is</em> the answer.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">TypeScript practice track on Code Lab</span><span class="lc-sub">Warm up with the first module after Chapter 1.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Mô hình tư duy duy nhất khiến mọi thứ vỡ lẽ</h2>
<p class="lead">Nếu bạn chỉ lấy một ý từ cả mục này, hãy lấy ý này: <strong>TypeScript sống ở lúc biên dịch; dữ liệu của bạn sống ở lúc chạy; và hai bên không bao giờ gặp nhau.</strong> Gần như mọi bối rối của người mới — "sao nó không bắt cái này?", "sao kiểu của tôi bỗng dưng sai?" — đều tan biến một khi ranh giới này trở nên thật với bạn.</p>

<h3>Hai thế giới tách biệt</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lúc biên dịch</span><span class="v">Khi <code>tsc</code> đọc code của bạn. Kiểu tồn tại ở đây. Đây là nơi lỗi bị bắt. Không có gì chạy cả.</span></div>
  <div class="kv"><span class="k">Lúc chạy</span><span class="v">Khi <code>node</code> hay trình duyệt thực thi JavaScript đã xuất ra. Kiểu đã biến mất. Dữ liệu thật tồn tại ở đây.</span></div>
</div>
<p>Bạn đã thấy điều này theo đúng nghĩa đen ở bài 0.3: <code>: string</code> nằm trong <code>hello.ts</code> nhưng chẳng có ở đâu trong <code>hello.js</code> đã biên dịch. Cái kiểu đã làm xong việc của nó — kiểm tra — rồi bị xoá. Đây là dòng chảy:</p>
<pre><code>bạn viết       bạn kiểm kiểu          nó chạy
hello.ts  ──▶  tsc (kiểu tồn tại)  ──▶  hello.js (kiểu bị xoá)
               ↑ lỗi ở đây                  ↑ dữ liệu ở đây</code></pre>

<h3>Điều này giải thích những gì</h3>
<p><strong>Vì sao một kiểu sai vẫn chạy được.</strong> Ở bài 0.3, <code>double('5')</code> chạy ngon dưới tsx — vì lúc chạy không có kiểu <code>number</code> nào để ép buộc; chỉ có chuỗi <code>'5'</code>. Cái kiểu là một lời hứa của lúc biên dịch, và bạn đã bỏ qua bước kiểm tra lúc biên dịch.</p>
<p><strong>Vì sao bạn không thể kiểm tra một kiểu lúc chạy.</strong> Đoạn này không chạy được, và là lỗi phổ biến nhất của người mới:</p>
<pre><code><span class="tok-keyword">type</span> User = { name: <span class="tok-keyword">string</span> };

<span class="tok-keyword">function</span> <span class="tok-function">handle</span>(x: <span class="tok-keyword">unknown</span>) {
  <span class="tok-comment">// ❌ KHÔNG chạy được — &#96;User&#96; không tồn tại lúc chạy</span>
  <span class="tok-keyword">if</span> (x <span class="tok-keyword">instanceof</span> User) { <span class="tok-comment">/* ... */</span> }
}</code></pre>
<p><code>User</code> là một <em>kiểu</em>. Tới lúc code này chạy, <code>User</code> đã bị xoá — chẳng còn gì để so sánh. Để validate dữ liệu thật đi vào (một request API, một file JSON) bạn cần một phép kiểm tra lúc chạy viết bằng JavaScript thật sự, hoặc một thư viện như <strong>Zod</strong> làm hộ. Đó là chương 13, và đó là lý do "kiểu" và "validate" là hai công việc khác nhau.</p>
<div class="pitfall">Cái bẫy: kiểu mô tả điều bạn <em>hứa</em> là đúng. Chúng không kiểm chứng điều đó. Nếu bạn ép một mớ JSON không đáng tin <code>as User</code>, TypeScript sẽ tin bạn — và nếu bạn nói dối, cú sập xảy ra muộn hơn lúc chạy trong khi hệ thống kiểu chẳng hề hay biết. Kiểu là một hợp đồng được kiểm giữa <em>các file của chính bạn</em>, không phải một bảo vệ chặn dữ liệu ở cửa.</div>

<h3>Ví dụ xuyên suốt khoá học</h3>
<p>Các chương tiến dần tới việc gõ kiểu cho một lát cắt nhỏ mà thật của một backend: một <strong>Notes API</strong> — đúng dáng thứ mà website này đang chạy. Một ghi chú có id, tiêu đề, thân bài, tác giả, trạng thái. Xuyên khoá bạn sẽ cho nó những kiểu chính xác, mô hình hoá các trạng thái để trạng thái không hợp lệ không tồn tại nổi, làm cho các hàm của nó generic, validate dữ liệu đi vào, và cuối cùng gõ kiểu cho các route Express phục vụ nó. Mọi khái niệm đáp xuống đúng một object cụ thể này thay vì những <code>Foo</code> và <code>Bar</code> trừu tượng.</p>
<pre><code><span class="tok-comment">// nơi ta đang hướng tới — chính xác, an toàn, thật (chương 5+)</span>
<span class="tok-keyword">type</span> NoteStatus = <span class="tok-string">'draft'</span> | <span class="tok-string">'published'</span> | <span class="tok-string">'archived'</span>;

<span class="tok-keyword">interface</span> Note {
  <span class="tok-keyword">readonly</span> id: <span class="tok-keyword">string</span>;
  title: <span class="tok-keyword">string</span>;
  body: <span class="tok-keyword">string</span>;
  status: NoteStatus;
  authorId: <span class="tok-keyword">string</span>;
}</code></pre>
<p>Ngay lúc này bạn chưa cần hiểu mọi dòng — <code>readonly</code>, union <code>|</code>, <code>interface</code>. Đó chính là toàn bộ ý nghĩa: tới chương 5, đoạn này sẽ đọc trơn như một câu văn, và bạn sẽ biết chính xác mỗi từ khoá ngăn được lỗi nào.</p>

<h3>Từ đây dùng khoá học thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">▶</div><div class="lz-t">Tiếp theo</div><div class="lz-d">Chương 1 — vì sao TypeScript tồn tại, với những bug thật nó bắt được</div></div>
  <div class="lz-step"><div class="lz-k">✎</div><div class="lz-t">Rồi</div><div class="lz-d">Để Playground mở, rê chuột lên tất cả, cố ý làm hỏng</div></div>
  <div class="lz-step"><div class="lz-k">⌨</div><div class="lz-t">Sau mỗi chương</div><div class="lz-d">Module TypeScript tương ứng trên Code Lab</div></div>
</div>
<div class="note-ct">Hãy bám vào ranh giới biên-dịch/lúc-chạy như bám một tay vịn. Về sau khi có gì đó làm bạn bất ngờ trong khoá học, câu hỏi đầu tiên cần đặt gần như luôn là: "cái này thuộc lúc biên dịch hay lúc chạy?". Chín trên mười lần, câu hỏi đó <em>chính là</em> câu trả lời.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Track luyện tập TypeScript trên Code Lab</span><span class="lc-sub">Khởi động với module đầu tiên sau Chương 1.</span></span>
</a>
</div>
`,
    },
  ],
};
