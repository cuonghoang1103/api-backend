/**
 * Bài 9.5 — TypeScript trong dự án thật (nâng cấp 02/11/2026). Output thật: _demo/_t9/chay.sh (tsc 5.9: legacy.ts 0 lỗi khi tắt strict,
 * 7 lỗi khi bật; dự án nhỏ tsconfig → dist → chạy bằng Node 22.23 với/không DATABASE_URL; thiếu @types/node; enum bị Node từ chối
 * ở chế độ bóc kiểu, tsx chạy được; zod kiểm dữ liệu ở ranh giới). Deck: scripts/slides-src/wf-9-5.mjs (9 slide, WF/v1/wf-9-5).
 * Code Lab: wf-9-5-ts-in-practice.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-9-5', 'TypeScript in a real project', 'TypeScript trong dự án thật', [
  [1, 'TypeScript in a real project',
    '<p>The first four lessons checked single files. Real projects have a configuration file, many folders, packages with their own types, a build step and data arriving from outside. This lesson sets up a tiny project the way real ones are set up, and shows the settings and tools you will meet in every TypeScript codebase.</p>',
    '<p>Bốn bài đầu kiểm từng tệp lẻ. Dự án thật có một tệp cấu hình, nhiều thư mục, các gói có kiểu riêng, một bước build và dữ liệu đến từ bên ngoài. Bài này dựng một dự án nhỏ theo đúng cách dự án thật được dựng, và cho thấy những thiết lập và công cụ bạn sẽ gặp ở mọi codebase TypeScript.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to read a tsconfig, explain what strict mode adds, build a project to plain JavaScript and run it, add the types a package needs, choose between tsc, tsx and Node\'s type stripping, and validate data at the edge of your program so that your types are actually true.</p>',
    '<p>Bạn sẽ đọc được một tsconfig, giải thích strict thêm gì, build dự án ra JavaScript thuần rồi chạy, thêm kiểu mà một gói cần, chọn giữa tsc, tsx và chế độ bóc kiểu của Node, và kiểm dữ liệu ở rìa chương trình để kiểu của bạn thật sự đúng.</p>'],
  [3, 'Strict mode matters',
    '<p>The same old JavaScript file, renamed to TypeScript, produced zero errors with default settings and seven with strict on: six parameters silently typed any, and a variable that may be undefined. Without strict, TypeScript checks much less than you think.</p>',
    '<p>Cùng một tệp JavaScript cũ, đổi tên thành TypeScript, cho không lỗi nào với thiết lập mặc định và bảy lỗi khi bật strict: sáu tham số lặng lẽ thành any, và một biến có thể là undefined. Không có strict, TypeScript kiểm ít hơn nhiều so với bạn tưởng.</p>'],
  [4, 'tsconfig.json',
    '<p>The project file tells the compiler which files to check, which JavaScript version to produce, how modules work, where the output goes, and how strict to be. Every TypeScript project has one, and new projects should start with strict set to true.</p>',
    '<p>Tệp dự án cho trình biên dịch biết kiểm những tệp nào, sinh JavaScript phiên bản nào, module hoạt động ra sao, đầu ra đặt ở đâu, và chặt chẽ tới mức nào. Dự án TypeScript nào cũng có một tệp như vậy, và dự án mới nên bắt đầu với strict là true.</p>'],
  [5, 'Build, then run JavaScript',
    '<p>tsc with the project flag checked both files and wrote JavaScript into dist. Node ran that JavaScript. Without DATABASE_URL, the configuration check stopped the program at start-up with a clear message, instead of failing later on the first query.</p>',
    '<p>tsc với cờ dự án kiểm cả hai tệp và ghi JavaScript vào dist. Node chạy JavaScript đó. Thiếu DATABASE_URL, phép kiểm cấu hình dừng chương trình ngay lúc khởi động với một thông báo rõ ràng, thay vì hỏng muộn hơn ở truy vấn đầu tiên.</p>'],
  [6, 'Types for packages',
    '<p>Without the Node type package, the compiler did not know what process is, and even suggested the install command. Many libraries ship their own types; for others you install an @types package as a development dependency.</p>',
    '<p>Thiếu gói kiểu của Node, trình biên dịch không biết process là gì, và còn gợi ý luôn lệnh cài. Nhiều thư viện tự mang kiểu theo; với thư viện khác bạn cài một gói @types làm dependency phát triển.</p>'],
  [7, 'Running TypeScript directly',
    '<p>Node twenty-two can run TypeScript by simply erasing the types, but it refused an enum, because an enum creates real JavaScript code. tsx ran the same file. Remember that neither of them checks types: tsc does.</p>',
    '<p>Node hai mươi hai chạy được TypeScript bằng cách xoá kiểu, nhưng nó từ chối một enum, vì enum tạo ra mã JavaScript thật. tsx chạy được cùng tệp đó. Nhớ rằng cả hai đều không kiểm kiểu: tsc mới kiểm.</p>'],
  [8, 'Validate at the boundary',
    '<p>One zod schema gives two things: a runtime check and the TypeScript type. Valid JSON passed and was safely used; the wrong shape from Lesson 9.1 was rejected with the exact fields: name missing, price a string. Inside the boundary, types are now true.</p>',
    '<p>Một schema zod cho hai thứ: phép kiểm lúc chạy và kiểu TypeScript. JSON hợp lệ được nhận và dùng an toàn; hình dạng sai ở Bài 9.1 bị từ chối kèm đúng các trường: thiếu name, price là chuỗi. Bên trong ranh giới, kiểu giờ là thật.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to create a small TypeScript project from scratch with strict on, build and run it, add a zod-validated configuration, and wire type checking into an npm script. "Done when" checks a build, a failing start without configuration, and a clean check.</p>',
    '<p>Bài luyện yêu cầu bạn tạo một dự án TypeScript nhỏ từ đầu với strict bật, build và chạy nó, thêm cấu hình được kiểm bằng zod, và gắn bước kiểm kiểu vào một script npm. "Xong khi" kiểm một lần build, một lần khởi động hỏng khi thiếu cấu hình, và một lần kiểm sạch.</p>'],
]);

export default {
  title: '9.5 — TypeScript in a real project|||9.5 — TypeScript trong một dự án thật',
  slug: 'wf-9-5-ts-in-practice',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/30LWjhZzg50', durationSeconds: 0 },
  description: 'strict đo thật: legacy.ts 0 lỗi khi tắt, 7 lỗi khi bật; đọc tsconfig.json; tsc -p build ra dist rồi Node chạy (thiếu DATABASE_URL thì dừng ngay lúc khởi động); thiếu @types/node ⇒ "Cannot find name process"; Node 22.23 bóc kiểu nhưng từ chối enum, tsx chạy được, cả hai không kiểm kiểu; zod kiểm dữ liệu ở ranh giới và sinh kiểu; gắn tsc --noEmit vào npm script và CI.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>From single files to a project: settings, builds, packages and the boundary</h2>
<p class="lead">After this lesson you can read a <code>tsconfig.json</code>, explain why <code>strict</code> must be on, build a project into JavaScript and run it, give the compiler the types a package needs, choose the right tool to run TypeScript (and know that only <code>tsc</code> checks), and validate outside data at the boundary so that the types inside your program are actually true. This is exactly the setup of the Node.js, Next.js and NestJS projects in the next courses — and of this website's own backend.</p>

<h3>Step 1 — strict mode, measured</h3>
<p>An old JavaScript file renamed to <code>.ts</code>, checked twice:</p>
${ma('typescript', CODE['_t9/9-5/legacy.ts'])}
${ra(OUT['_t9/out/strict'])}
<p>With default settings: <strong>zero</strong> errors — untyped parameters silently became <code>any</code>, and <code>count + 1</code> on a variable that was never assigned (line 11) was allowed. With <code>--strict</code>: seven errors. Notice what is <em>still</em> missing: <code>user.name</code> on line 9 reads a user that does not exist (id 2), yet even strict mode says nothing — <code>findUser</code> returns <code>any</code> because its parameters were <code>any</code>, and <code>any</code> switches checking off for everything it touches (Lesson 9.2). Fix the parameter types and that line becomes an error too. <code>strict</code> is a bundle of flags; the two that matter most:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">noImplicitAny</span><span class="v">A parameter without a type and nothing to infer it from is an error instead of a silent <code>any</code> (six errors above).</span></div>
  <div class="kv"><span class="k">strictNullChecks</span><span class="v"><code>null</code> and <code>undefined</code> are separate types you must handle. Without it, every "possibly null" error of Lesson 9.1 disappears.</span></div>
  <div class="kv"><span class="k">Also useful</span><span class="v"><code>noUncheckedIndexedAccess</code> (array and record lookups may be undefined — Lesson 9.3's trap), <code>noImplicitReturns</code>.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — a project with <code>"strict": false</code>.</strong> It looks like TypeScript and catches far fewer bugs than you think: the measurement above found nothing at all. Start every new project with <code>"strict": true</code>. Converting an existing JavaScript project? Turn strict on and fix file by file, or use <code>// @ts-nocheck</code> on the files not converted yet — never leave the whole project unchecked.</p></div>

<h3>Step 2 — the project: tsconfig, build, run</h3>
<p>A two-file project in <code>src/</code>: a configuration loader and an entry point.</p>
${ma('typescript', CODE['_t9/9-5/shop/src/config.ts'])}
${ma('typescript', CODE['_t9/9-5/shop/src/index.ts'])}
${ra(OUT['_t9/out/project'])}
<table>
<thead><tr><th>Setting</th><th>Here</th><th>Means</th></tr></thead>
<tbody>
<tr><td><code>target</code></td><td>ES2022</td><td>Which JavaScript to produce — modern syntax kept for Node 22.</td></tr>
<tr><td><code>module</code> / <code>moduleResolution</code></td><td>NodeNext</td><td>Follow Node's ES module rules — why <code>index.ts</code> imports <code>'./config.js'</code> (Lesson 5.5: extensions are required).</td></tr>
<tr><td><code>strict</code></td><td>true</td><td>Step 1.</td></tr>
<tr><td><code>rootDir</code> / <code>outDir</code></td><td>src → dist</td><td>Source in, JavaScript out — <code>dist</code> is what you deploy, never edit it.</td></tr>
<tr><td><code>types</code></td><td>["node"]</td><td>Load Node's type definitions (Step 3).</td></tr>
<tr><td><code>include</code></td><td>["src"]</td><td>Which files belong to the project.</td></tr>
</tbody>
</table>
<p><code>npx tsc -p .</code> printed nothing and exit code 0 — checked and built. Node ran the JavaScript in <code>dist</code>. Without <code>DATABASE_URL</code>, <code>loadConfig</code> stopped the program at start-up with a clear message ("fail fast"), instead of a confusing crash on the first query. That function is also a boundary check (Step 5): <code>process.env</code> values are <code>string | undefined</code>, and it turns them into a typed <code>Config</code> only after checking.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Develop</span><span class="lz-t">tsx / Node strip / Vite</span><span class="lz-d">Run .ts directly for a fast loop; the editor shows type errors.</span></div>
<div class="lz-step"><span class="lz-k">Check</span><span class="lz-t">tsc --noEmit</span><span class="lz-d">In an npm script and in CI: <code>"typecheck": "tsc --noEmit"</code>.</span></div>
<div class="lz-step"><span class="lz-k">Build</span><span class="lz-t">tsc -p .</span><span class="lz-d">Produce <code>dist/</code> (or let a bundler such as Vite or Next.js do it).</span></div>
<div class="lz-step"><span class="lz-k">Run</span><span class="lz-t">node dist/index.js</span><span class="lz-d">Production runs plain JavaScript.</span></div>
</div>

<h3>Step 3 — types for packages</h3>
${ra(OUT['_t9/out/types-node'])}
<p>The same project with <code>"types": []</code>: the compiler no longer knows what <code>process</code> is — and the message says exactly what to install. Packages get types in one of two ways: they ship them (zod, Prisma, Axios: nothing to do), or the community publishes them under <code>@types/…</code> (<code>@types/node</code>, <code>@types/express</code>), installed with <code>npm i -D</code>. If neither exists, you can write a small declaration yourself — or check how well-maintained that package is.</p>

<h3>Step 4 — running TypeScript directly</h3>
${ma('typescript', CODE['_t9/9-5/enum.ts'])}
${ra(OUT['_t9/out/enum'])}
<table>
<thead><tr><th>Tool</th><th>How</th><th>Checks types?</th><th>Use for</th></tr></thead>
<tbody>
<tr><td><code>tsc</code></td><td>the real compiler</td><td>✅ yes</td><td>type-checking, building a library or server</td></tr>
<tr><td><code>node --experimental-strip-types</code></td><td>erases types, runs the rest (Node 22.6+; on by default from Node 23.6)</td><td>❌ no</td><td>quick scripts; only "erasable" syntax — no <code>enum</code>, no <code>namespace</code></td></tr>
<tr><td><code>tsx</code></td><td>compiles each file on the fly with esbuild</td><td>❌ no</td><td>development servers, scripts (this repository uses it)</td></tr>
<tr><td>Vite / Next.js</td><td>bundler transforms</td><td>❌ no (Next runs a check during <code>build</code>)</td><td>front-end apps</td></tr>
</tbody>
</table>
<p>Node refused the <code>enum</code> because an enum is not just a type — it creates a real JavaScript object, so it cannot simply be erased. A literal union (<code>type Role = 'user' | 'admin'</code>, Lesson 9.2) does the same job and erases cleanly, which is why many teams avoid enums.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "it runs, so the types are fine".</strong> tsx, Node and Vite strip types without checking them: code full of type errors runs until it hits the bug at runtime. Keep a separate <code>tsc --noEmit</code> step — in an npm script (<code>npm run typecheck</code>), in a pre-push hook, and in CI — so type errors block the merge instead of reaching users. This repository's own instructions require exactly that before every push.</p></div>

<h3>Step 5 — validate at the boundary</h3>
<p>Lesson 9.1 ended with the problem: types cannot check data that arrives at runtime. The solution is to check it once, where it enters, with a schema library that also gives you the type:</p>
${ma('typescript', CODE['_t9/9-5/validate.ts'])}
${ra(OUT['_t9/out/validate'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Outside</span><span class="lz-t">unknown</span><span class="lz-d">HTTP bodies, <code>res.json()</code>, <code>process.env</code>, files, <code>localStorage</code>, URL parameters.</span></div>
<div class="lz-layer"><span class="lz-k">Boundary</span><span class="lz-t">Product.safeParse(value)</span><span class="lz-d">One runtime check; on failure a list of exact problems — ready for a 422 response (Lesson 6.3).</span></div>
<div class="lz-layer"><span class="lz-k">Inside</span><span class="lz-t">z.infer&lt;typeof Product&gt;</span><span class="lz-d">The type comes from the schema, so the two can never disagree. Everything inside can trust it.</span></div>
</div>
<p>The bad JSON from Lesson 9.1 was rejected with <code>name - Required</code> and <code>price - Expected number, received string</code> — before any code could crash on it.</p>

<div class="callout ok">
<p><strong>🧪 Practice (45 minutes) — a TypeScript project from scratch</strong></p>
<ol>
<li>New folder: <code>npm init -y</code>, <code>npm i -D typescript @types/node tsx</code>, <code>npm i zod</code>. Add <code>"type": "module"</code> to <code>package.json</code>.</li>
<li>Write the <code>tsconfig.json</code> from Step 2 and the two files in <code>src/</code>.</li>
<li>Add scripts: <code>"dev": "tsx src/index.ts"</code>, <code>"typecheck": "tsc --noEmit"</code>, <code>"build": "tsc -p ."</code>, <code>"start": "node dist/index.js"</code>.</li>
<li>Rewrite <code>loadConfig</code> with a zod schema (<code>z.object({ PORT: z.coerce.number().int().default(3000), DATABASE_URL: z.string().url() })</code>) and export its inferred type.</li>
<li>Copy <code>legacy.ts</code> into <code>src/</code>, run <code>npm run typecheck</code>, fix all seven errors properly, then delete it.</li>
</ol>
<p>Hint: <code>z.coerce.number()</code> turns the string <code>"8080"</code> from the environment into a number before checking it.</p>
<p><strong>Done when:</strong> <code>npm run typecheck</code> exits 0; <code>npm run build &amp;&amp; npm start</code> without <code>DATABASE_URL</code> stops with zod's message, and with <code>DATABASE_URL=postgres://localhost/shop</code> prints the port; and <code>npm run dev</code> works without a build. Then Code Lab module 9.5.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tsconfig.json</span><span class="v">tệp cấu hình dự án TypeScript.</span></div>
  <div class="kv"><span class="k">strict mode</span><span class="v">chế độ chặt — bộ cờ kiểm quan trọng nhất.</span></div>
  <div class="kv"><span class="k">noImplicitAny</span><span class="v">cấm any ngầm định.</span></div>
  <div class="kv"><span class="k">strictNullChecks</span><span class="v">null/undefined là kiểu riêng phải xử lý.</span></div>
  <div class="kv"><span class="k">outDir / rootDir</span><span class="v">thư mục đầu ra / thư mục nguồn.</span></div>
  <div class="kv"><span class="k">@types</span><span class="v">gói định nghĩa kiểu cho thư viện.</span></div>
  <div class="kv"><span class="k">type stripping</span><span class="v">bóc kiểu — chạy mà không kiểm.</span></div>
  <div class="kv"><span class="k">erasable syntax</span><span class="v">cú pháp xoá được — không sinh mã JS.</span></div>
  <div class="kv"><span class="k">schema validation</span><span class="v">kiểm dữ liệu theo schema lúc chạy (zod).</span></div>
  <div class="kv"><span class="k">fail fast</span><span class="v">hỏng sớm — dừng ngay khi cấu hình sai.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Turn <code>strict</code> on: without it, the same file had 0 errors instead of 7.</li>
  <li><code>tsconfig.json</code> sets files, target, modules, output and strictness.</li>
  <li><code>tsc -p .</code> checks and builds to <code>dist/</code>; production runs plain JavaScript.</li>
  <li>Packages need types: built in, or <code>npm i -D @types/…</code>.</li>
  <li>tsx, Node's type stripping and bundlers run code without checking — keep <code>tsc --noEmit</code> in scripts and CI.</li>
  <li>Validate outside data once at the boundary (zod); infer the type from the schema.</li>
</ul>
${nguon('📗', 'TypeScript — tsconfig reference', 'Every compiler option, including the strict family', 'https://www.typescriptlang.org/tsconfig/')}
${nguon('📘', 'Node.js — Running TypeScript natively', 'Type stripping, its limits and erasable syntax', 'https://nodejs.org/api/typescript.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-9-1-tsc-and-tsconfig', title: 'TypeScript 9.1 — tsc and tsconfig', sub: 'Compiler options, strict flags and module settings in depth', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Từ tệp lẻ tới dự án: thiết lập, build, gói và ranh giới</h2>
<p class="lead">Học xong bài này bạn đọc được một <code>tsconfig.json</code>, giải thích vì sao <code>strict</code> phải bật, build một dự án ra JavaScript rồi chạy, cho trình biên dịch kiểu mà một gói cần, chọn đúng công cụ để chạy TypeScript (và biết rằng chỉ <code>tsc</code> mới kiểm), và kiểm dữ liệu từ bên ngoài ở ranh giới để kiểu bên trong chương trình thật sự đúng. Đây chính là cách dựng các dự án Node.js, Next.js và NestJS ở những khoá tiếp theo — và của backend chính website này.</p>

<h3>Bước 1 — chế độ strict, đo thật</h3>
<p>Một tệp JavaScript cũ đổi tên thành <code>.ts</code>, kiểm hai lần:</p>
${ma('typescript', CODE['_t9/9-5/legacy.ts'])}
${ra(OUT['_t9/out/strict'])}
<p>Với thiết lập mặc định: <strong>không</strong> lỗi nào — tham số không có kiểu lặng lẽ thành <code>any</code>, và <code>count + 1</code> trên một biến chưa từng được gán (dòng 11) được cho qua. Với <code>--strict</code>: bảy lỗi. Để ý thứ <em>vẫn</em> còn sót: <code>user.name</code> ở dòng 9 đọc một người dùng không tồn tại (id 2), vậy mà cả chế độ strict cũng im lặng — <code>findUser</code> trả về <code>any</code> vì tham số của nó là <code>any</code>, và <code>any</code> tắt việc kiểm cho mọi thứ nó chạm vào (Bài 9.2). Gắn kiểu cho tham số là dòng đó cũng thành lỗi. <code>strict</code> là một bó cờ; hai cờ quan trọng nhất:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">noImplicitAny</span><span class="v">Tham số không có kiểu và không có gì để suy ra là lỗi thay vì một <code>any</code> lặng lẽ (sáu lỗi ở trên).</span></div>
  <div class="kv"><span class="k">strictNullChecks</span><span class="v"><code>null</code> và <code>undefined</code> là kiểu riêng mà bạn phải xử lý. Không có nó, mọi lỗi "có thể null" ở Bài 9.1 biến mất.</span></div>
  <div class="kv"><span class="k">Cũng có ích</span><span class="v"><code>noUncheckedIndexedAccess</code> (tra mảng và record có thể ra undefined — bẫy ở Bài 9.3), <code>noImplicitReturns</code>.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — một dự án đặt <code>"strict": false</code>.</strong> Nó trông như TypeScript mà bắt được ít lỗi hơn bạn tưởng rất nhiều: phép đo ở trên không tìm ra gì cả. Hãy bắt đầu mọi dự án mới với <code>"strict": true</code>. Chuyển một dự án JavaScript có sẵn? Bật strict rồi sửa từng tệp, hoặc dùng <code>// @ts-nocheck</code> cho những tệp chưa chuyển — đừng bao giờ để cả dự án không được kiểm.</p></div>

<h3>Bước 2 — dự án: tsconfig, build, chạy</h3>
<p>Một dự án hai tệp trong <code>src/</code>: một hàm nạp cấu hình và một điểm vào.</p>
${ma('typescript', CODE['_t9/9-5/shop/src/config.ts'])}
${ma('typescript', CODE['_t9/9-5/shop/src/index.ts'])}
${ra(OUT['_t9/out/project'])}
<table>
<thead><tr><th>Thiết lập</th><th>Ở đây</th><th>Nghĩa là</th></tr></thead>
<tbody>
<tr><td><code>target</code></td><td>ES2022</td><td>Sinh JavaScript nào — giữ cú pháp hiện đại cho Node 22.</td></tr>
<tr><td><code>module</code> / <code>moduleResolution</code></td><td>NodeNext</td><td>Theo luật ES module của Node — vì vậy <code>index.ts</code> import <code>'./config.js'</code> (Bài 5.5: phải có đuôi).</td></tr>
<tr><td><code>strict</code></td><td>true</td><td>Bước 1.</td></tr>
<tr><td><code>rootDir</code> / <code>outDir</code></td><td>src → dist</td><td>Nguồn vào, JavaScript ra — <code>dist</code> là thứ bạn deploy, đừng bao giờ sửa nó.</td></tr>
<tr><td><code>types</code></td><td>["node"]</td><td>Nạp định nghĩa kiểu của Node (Bước 3).</td></tr>
<tr><td><code>include</code></td><td>["src"]</td><td>Những tệp thuộc dự án.</td></tr>
</tbody>
</table>
<p><code>npx tsc -p .</code> không in gì và mã thoát 0 — đã kiểm và đã build. Node chạy JavaScript trong <code>dist</code>. Thiếu <code>DATABASE_URL</code>, <code>loadConfig</code> dừng chương trình ngay lúc khởi động với thông báo rõ ràng ("hỏng sớm"), thay vì sập khó hiểu ở truy vấn đầu tiên. Hàm đó cũng là một phép kiểm ở ranh giới (Bước 5): giá trị trong <code>process.env</code> là <code>string | undefined</code>, và nó chỉ biến chúng thành <code>Config</code> có kiểu sau khi đã kiểm.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Phát triển</span><span class="lz-t">tsx / Node bóc kiểu / Vite</span><span class="lz-d">Chạy thẳng .ts cho vòng lặp nhanh; trình soạn thảo hiện lỗi kiểu.</span></div>
<div class="lz-step"><span class="lz-k">Kiểm</span><span class="lz-t">tsc --noEmit</span><span class="lz-d">Trong script npm và trong CI: <code>"typecheck": "tsc --noEmit"</code>.</span></div>
<div class="lz-step"><span class="lz-k">Build</span><span class="lz-t">tsc -p .</span><span class="lz-d">Sinh ra <code>dist/</code> (hoặc để bundler như Vite hay Next.js làm).</span></div>
<div class="lz-step"><span class="lz-k">Chạy</span><span class="lz-t">node dist/index.js</span><span class="lz-d">Production chạy JavaScript thuần.</span></div>
</div>

<h3>Bước 3 — kiểu cho các gói</h3>
${ra(OUT['_t9/out/types-node'])}
<p>Cùng dự án đó với <code>"types": []</code>: trình biên dịch không còn biết <code>process</code> là gì — và thông báo nói chính xác cần cài gì. Gói có kiểu theo một trong hai cách: tự mang theo (zod, Prisma, Axios: không cần làm gì), hoặc cộng đồng đăng chúng dưới tên <code>@types/…</code> (<code>@types/node</code>, <code>@types/express</code>), cài bằng <code>npm i -D</code>. Nếu không có cả hai, bạn có thể tự viết một khai báo nhỏ — hoặc kiểm xem gói đó được bảo trì tốt tới đâu.</p>

<h3>Bước 4 — chạy TypeScript trực tiếp</h3>
${ma('typescript', CODE['_t9/9-5/enum.ts'])}
${ra(OUT['_t9/out/enum'])}
<table>
<thead><tr><th>Công cụ</th><th>Cách làm</th><th>Có kiểm kiểu?</th><th>Dùng cho</th></tr></thead>
<tbody>
<tr><td><code>tsc</code></td><td>trình biên dịch thật</td><td>✅ có</td><td>kiểm kiểu, build thư viện hay máy chủ</td></tr>
<tr><td><code>node --experimental-strip-types</code></td><td>xoá kiểu, chạy phần còn lại (Node 22.6+; bật sẵn từ Node 23.6)</td><td>❌ không</td><td>script nhanh; chỉ cú pháp "xoá được" — không <code>enum</code>, không <code>namespace</code></td></tr>
<tr><td><code>tsx</code></td><td>biên dịch từng tệp ngay lúc chạy bằng esbuild</td><td>❌ không</td><td>máy chủ khi phát triển, script (repo này dùng nó)</td></tr>
<tr><td>Vite / Next.js</td><td>bundler biến đổi mã</td><td>❌ không (Next có kiểm trong lúc <code>build</code>)</td><td>app front-end</td></tr>
</tbody>
</table>
<p>Node từ chối <code>enum</code> vì enum không chỉ là kiểu — nó tạo ra một object JavaScript thật, nên không thể đơn giản xoá đi. Một union literal (<code>type Role = 'user' | 'admin'</code>, Bài 9.2) làm cùng việc và xoá sạch được, đó là lý do nhiều nhóm tránh enum.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "chạy được, vậy là kiểu ổn".</strong> tsx, Node và Vite bóc kiểu mà không kiểm: mã đầy lỗi kiểu vẫn chạy cho tới khi đụng lỗi lúc chạy. Hãy giữ một bước <code>tsc --noEmit</code> riêng — trong script npm (<code>npm run typecheck</code>), trong hook trước khi push, và trong CI — để lỗi kiểu chặn việc gộp mã thay vì tới tay người dùng. Hướng dẫn của chính repo này đòi đúng việc đó trước mỗi lần push.</p></div>

<h3>Bước 5 — kiểm dữ liệu ở ranh giới</h3>
<p>Bài 9.1 kết thúc với vấn đề: kiểu không kiểm được dữ liệu đến lúc chạy. Cách giải là kiểm nó một lần, ở chỗ nó đi vào, bằng một thư viện schema đồng thời cho bạn kiểu:</p>
${ma('typescript', CODE['_t9/9-5/validate.ts'])}
${ra(OUT['_t9/out/validate'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Bên ngoài</span><span class="lz-t">unknown</span><span class="lz-d">Phần thân HTTP, <code>res.json()</code>, <code>process.env</code>, tệp, <code>localStorage</code>, tham số URL.</span></div>
<div class="lz-layer"><span class="lz-k">Ranh giới</span><span class="lz-t">Product.safeParse(value)</span><span class="lz-d">Một phép kiểm lúc chạy; hỏng thì có danh sách vấn đề chính xác — sẵn cho response 422 (Bài 6.3).</span></div>
<div class="lz-layer"><span class="lz-k">Bên trong</span><span class="lz-t">z.infer&lt;typeof Product&gt;</span><span class="lz-d">Kiểu sinh từ schema, nên hai thứ không bao giờ lệch nhau. Mọi thứ bên trong tin được nó.</span></div>
</div>
<p>JSON sai ở Bài 9.1 bị từ chối với <code>name - Required</code> và <code>price - Expected number, received string</code> — trước khi bất kỳ đoạn mã nào kịp sập vì nó.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (45 phút) — một dự án TypeScript từ đầu</strong></p>
<ol>
<li>Thư mục mới: <code>npm init -y</code>, <code>npm i -D typescript @types/node tsx</code>, <code>npm i zod</code>. Thêm <code>"type": "module"</code> vào <code>package.json</code>.</li>
<li>Viết <code>tsconfig.json</code> ở Bước 2 và hai tệp trong <code>src/</code>.</li>
<li>Thêm script: <code>"dev": "tsx src/index.ts"</code>, <code>"typecheck": "tsc --noEmit"</code>, <code>"build": "tsc -p ."</code>, <code>"start": "node dist/index.js"</code>.</li>
<li>Viết lại <code>loadConfig</code> bằng schema zod (<code>z.object({ PORT: z.coerce.number().int().default(3000), DATABASE_URL: z.string().url() })</code>) và export kiểu suy ra của nó.</li>
<li>Chép <code>legacy.ts</code> vào <code>src/</code>, chạy <code>npm run typecheck</code>, sửa cả bảy lỗi cho đúng cách, rồi xoá nó.</li>
</ol>
<p>Gợi ý: <code>z.coerce.number()</code> đổi chuỗi <code>"8080"</code> từ biến môi trường thành số trước khi kiểm.</p>
<p><strong>Xong khi:</strong> <code>npm run typecheck</code> thoát với 0; <code>npm run build &amp;&amp; npm start</code> khi thiếu <code>DATABASE_URL</code> dừng với thông báo của zod, và với <code>DATABASE_URL=postgres://localhost/shop</code> in ra cổng; và <code>npm run dev</code> chạy được không cần build. Sau đó làm module Code Lab 9.5.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tsconfig.json</span><span class="v">tệp cấu hình dự án TypeScript.</span></div>
  <div class="kv"><span class="k">strict mode</span><span class="v">chế độ chặt — bộ cờ kiểm quan trọng nhất.</span></div>
  <div class="kv"><span class="k">noImplicitAny</span><span class="v">cấm any ngầm định.</span></div>
  <div class="kv"><span class="k">strictNullChecks</span><span class="v">null/undefined là kiểu riêng phải xử lý.</span></div>
  <div class="kv"><span class="k">outDir / rootDir</span><span class="v">thư mục đầu ra / thư mục nguồn.</span></div>
  <div class="kv"><span class="k">@types</span><span class="v">gói định nghĩa kiểu cho thư viện.</span></div>
  <div class="kv"><span class="k">type stripping</span><span class="v">bóc kiểu — chạy mà không kiểm.</span></div>
  <div class="kv"><span class="k">erasable syntax</span><span class="v">cú pháp xoá được — không sinh mã JS.</span></div>
  <div class="kv"><span class="k">schema validation</span><span class="v">kiểm dữ liệu theo schema lúc chạy (zod).</span></div>
  <div class="kv"><span class="k">fail fast</span><span class="v">hỏng sớm — dừng ngay khi cấu hình sai.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bật <code>strict</code>: không có nó, cùng một tệp cho 0 lỗi thay vì 7.</li>
  <li><code>tsconfig.json</code> đặt tệp, target, module, đầu ra và độ chặt.</li>
  <li><code>tsc -p .</code> kiểm và build ra <code>dist/</code>; production chạy JavaScript thuần.</li>
  <li>Gói cần kiểu: có sẵn, hoặc <code>npm i -D @types/…</code>.</li>
  <li>tsx, chế độ bóc kiểu của Node và bundler chạy mã mà không kiểm — giữ <code>tsc --noEmit</code> trong script và CI.</li>
  <li>Kiểm dữ liệu từ bên ngoài một lần ở ranh giới (zod); suy kiểu từ schema.</li>
</ul>
${nguon('📗', 'TypeScript — tsconfig reference', 'Mọi tuỳ chọn trình biên dịch, kể cả họ strict', 'https://www.typescriptlang.org/tsconfig/')}
${nguon('📘', 'Node.js — Running TypeScript natively', 'Bóc kiểu, giới hạn của nó và cú pháp xoá được', 'https://nodejs.org/api/typescript.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-9-1-tsc-and-tsconfig', title: 'TypeScript 9.1 — tsc và tsconfig', sub: 'Tuỳ chọn trình biên dịch, cờ strict và thiết lập module, chuyên sâu', cta: 'Mở bài' })}
</div>
`,
};
