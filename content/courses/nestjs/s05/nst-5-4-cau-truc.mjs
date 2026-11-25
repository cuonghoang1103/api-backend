/**
 * 5.4 — Cấu trúc dự án lớn lên được: thư mục theo tính năng, module dùng chung, thư viện monorepo (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: scratchpad/nst/lab/c5 — a54 (tsconfig "paths": tsc exit 0 nhưng node ERR_MODULE_NOT_FOUND; nest build viết lại thành
 * ../common/clock.js), a54b (Node subpath imports "#common/*.js" + điều kiện "source"; Vitest phải khai ssr.resolve.conditions, khai
 * resolve.conditions thì vẫn hỏng), a54lib (bản sao mốc 4: nest g library common ⇒ Nest 12 tự đổi builder sang rspack + thêm 4 gói,
 * npm install treo khi không mạng; builder tsc + rootDir "./src" ⇒ TS6059; sửa rootDir "." ⇒ dist/src/main.js, lệnh start:prod cũ hỏng),
 * kien-truc.spec.ts (test kiến trúc: luật phụ thuộc giữa thư mục, đỏ đúng 2 vi phạm cài thử). Vitest 4.1.12 trên máy nhà.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-18-2-to-chuc-ma-nguon', title: 'Node.js 18.2 — Tổ chức theo tính năng, và cái file 3.607 dòng', sub: 'Vì sao chia theo tính năng thay vì theo loại tệp — nền chung, bài này chỉ làm phần của Nest.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-2-3-module', title: 'NestJS 2.3 — Module: imports, exports, phụ thuộc vòng', sub: 'Ranh giới module và vòng import ESM — gốc của các luật trong bài này.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Workspaces (monorepo)', 'Chế độ standard và monorepo, nest g app, nest g library.', 'https://docs.nestjs.com/cli/monorepo'),
  nguon('📘', 'NestJS Docs — Libraries', 'Thư viện trong monorepo, tiền tố đường dẫn, cách build.', 'https://docs.nestjs.com/cli/libraries'),
  nguon('📘', 'Node.js — Subpath imports', 'Trường "imports" trong package.json: bí danh #… chạy được không cần công cụ.', 'https://nodejs.org/api/packages.html#subpath-imports'),
  nguon('📘', 'TypeScript — paths', 'paths chỉ đổi cách TypeScript tìm kiểu; không viết lại đường dẫn khi xuất mã.', 'https://www.typescriptlang.org/tsconfig/#paths'),
].join('\n');
const OUT_CAY = "$ find src -type f | sort\nsrc/app.module.ts\nsrc/bookings/booking.entity.ts\nsrc/bookings/bookings.controller.ts\nsrc/bookings/bookings.module.ts\nsrc/bookings/bookings.service.spec.ts\nsrc/bookings/bookings.service.ts\nsrc/bookings/dto/booking.response.ts\nsrc/bookings/dto/create-booking.dto.ts\nsrc/common/api-key.guard.ts\nsrc/common/clock.module.ts\nsrc/common/moc4.e2e.spec.ts\nsrc/common/moc5.e2e.spec.ts\nsrc/common/pipeline.e2e.spec.ts\nsrc/common/problem.filter.ts\nsrc/config/app-config.module.ts\nsrc/config/env.schema.spec.ts\nsrc/config/env.schema.ts\nsrc/config/logger.config.ts\nsrc/main.ts\nsrc/rooms/dto/create-room.dto.ts\nsrc/rooms/dto/update-room.dto.ts\nsrc/rooms/entities/room.entity.ts\nsrc/rooms/rooms.controller.ts\nsrc/rooms/rooms.module.ts\nsrc/rooms/rooms.service.ts";
const OUT_ALIAS = "$ tsc && node dist/main.js\ntsc exit=0\nError [ERR_MODULE_NOT_FOUND]: Cannot find package '@common/clock.js' imported from /app/c5/a54/dist/rooms/rooms.service.js\n$ grep import dist/rooms/rooms.service.js\nimport { now } from '@common/clock.js'; // alias khai trong tsconfig \"paths\"";
const OUT_NESTBUILD = "$ nest build && node dist/main.js\nrooms lúc 2027-01-05T00:30:00.000Z\n$ grep import dist/rooms/rooms.service.js\nimport { now } from \"../common/clock.js\"; // alias khai trong tsconfig \"paths\"";
const OUT_IMPORTS = "{\n  \"name\": \"a54b\",\n  \"type\": \"module\",\n  \"imports\": {\n    \"#common/*\": \"./dist/common/*\"\n  }\n}\n$ tsc && node dist/main.js\nrooms lúc 2027-01-05T00:30:00.000Z";
const OUT_VITEST = "$ cat vitest.sai.ts\nimport { defineConfig } from 'vitest/config';\nexport default defineConfig({ resolve: { conditions: ['source'] } });   // tưởng đúng — nhưng test chạy ở môi trường ssr\n$ rm -rf dist && npx vitest run -c vitest.sai.ts\nError: Cannot find module '#common/clock.js' imported from /home/sv/a54b/src/rooms/rooms.service.ts\n Test Files  1 failed (1)\n      Tests  no tests\n$ cat vitest.ssr.ts\nimport { defineConfig } from 'vitest/config';\n// test chạy ở môi trường \"ssr\" của Vite ⇒ điều kiện phải khai ở ssr.resolve, không phải resolve\nexport default defineConfig({ ssr: { resolve: { conditions: ['source'] } } });\n$ rm -rf dist && npx vitest run -c vitest.ssr.ts\n Test Files  1 passed (1)\n      Tests  1 passed (1)";
const OUT_LIB = "$ nest g library common --prefix @lab\n    Added @rspack/core, fork-ts-checker-webpack-plugin, tsconfig-paths-webpack-plugin and webpack-node-externals for the rspack builder; running \"npm install\"\nCREATE libs/common/tsconfig.lib.json (244 bytes)\nCREATE libs/common/src/index.ts (73 bytes)\nCREATE libs/common/src/common.module.ts (195 bytes)\nCREATE libs/common/src/common.service.spec.ts (463 bytes)\nCREATE libs/common/src/common.service.ts (90 bytes)\nUPDATE nest-cli.json (631 bytes)\nUPDATE package.json (1805 bytes)\nUPDATE tsconfig.json (772 bytes)\n$ grep builder nest-cli.json\n    \"builder\": \"rspack\"\n$ grep -A7 '\"paths\"' tsconfig.json\n    \"paths\": {\n      \"@lab/common\": [\n        \"./libs/common/src/index.ts\"\n      ],\n      \"@lab/common/*\": [\n        \"./libs/common/src/*\"\n      ]\n    }";
const OUT_LIB_LOI = "$ nest build   # tsconfig.build.json vẫn \"rootDir\": \"./src\" như lúc nest new\nlibs/common/src/common.module.ts:2:31 - error TS6059: File '/app/c5/a54lib/libs/common/src/common.service.ts' is not under 'rootDir' '/app/c5/a54lib/src'. 'rootDir' is expected to contain all source files.\nlibs/common/src/index.ts:1:15 - error TS6059: File '/app/c5/a54lib/libs/common/src/common.module.ts' is not under 'rootDir' '/app/c5/a54lib/src'. 'rootDir' is expected to contain all source files.\nsrc/slug-demo.ts:5:45 - error TS6059: File '/app/c5/a54lib/libs/common/src/index.ts' is not under 'rootDir' '/app/c5/a54lib/src'. 'rootDir' is expected to contain all source files.";
const OUT_LIB_BUILD = "$ cat tsconfig.build.json\n{\n  \"extends\": \"./tsconfig.json\",\n  \"compilerOptions\": { \"rootDir\": \".\" },\n  \"include\": [\"src\", \"libs\"],\n  \"exclude\": [\"node_modules\", \"test\", \"dist\", \"**/*spec.ts\"]\n}\n$ nest build && find dist -name \"*.js\" | sort | head -4\ndist/libs/common/src/common.module.js\ndist/libs/common/src/common.service.js\ndist/libs/common/src/index.js\ndist/src/main.js\ndist/src/slug-demo.js\n$ node dist/src/slug-demo.js\nphong-lab-dien-tu-304\n$ grep \"from\" dist/src/slug-demo.js | tail -1\nimport { CommonModule, CommonService } from \"../libs/common/src/index.js\";\n$ node dist/main.js   # lệnh start:prod cũ\nError: Cannot find module '/app/c5/a54lib/dist/main.js'";
const MA_ARCH = "// kien-truc.spec.ts — \"test kiến trúc\" (giống ArchUnit bên Java): luật phụ thuộc giữa các thư mục tính năng\nimport { readdirSync, readFileSync } from 'node:fs';\nimport { join, relative, dirname, resolve } from 'node:path';\n\nconst SRC = resolve(import.meta.dirname);\nconst tatCa = (d: string): string[] => readdirSync(d, { withFileTypes: true })\n  .flatMap((e) => (e.isDirectory() ? tatCa(join(d, e.name)) : e.name.endsWith('.ts') && !e.name.endsWith('.spec.ts') ? [join(d, e.name)] : []));\nconst vung = (f: string) => relative(SRC, f).split('/')[0];          // 'rooms' | 'bookings' | 'common' | 'main.ts'…\n\nconst vi: string[] = [];\nfor (const f of tatCa(SRC)) {\n  for (const [, dich] of readFileSync(f, 'utf8').matchAll(/from '(\\.[^']+)'/g)) {\n    const toi = resolve(dirname(f), dich);\n    const [tu, den] = [vung(f), vung(toi)];\n    if (tu === den || !den) continue;\n    const ten = relative(SRC, toi);\n    if (tu === 'common') vi.push(`${relative(SRC, f)} → ${ten}: common không được phụ thuộc tính năng`);\n    else if (den !== 'common' && !/\\.(module|service)\\.js$/.test(ten)) vi.push(`${relative(SRC, f)} → ${ten}: chỉ được dùng module/service của tính năng khác`);\n  }\n}\ntest('luật phụ thuộc giữa các thư mục', () => { expect(vi).toEqual([]); });";
const OUT_ARCH = "$ npx vitest run src/kien-truc.spec.ts\n      Tests  1 passed (1)\n# thêm vào bookings.controller.ts: import { Room } from '../rooms/entities/room.entity.js';\n# và tạo common/xau.ts import rooms.service\n$ npx vitest run src/kien-truc.spec.ts\n   × luật phụ thuộc giữa các thư mục 9ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n+   \"bookings/bookings.controller.ts → rooms/entities/room.entity.js: chỉ được dùng module/service của tính năng khác\",\n+   \"common/xau.ts → rooms/rooms.service.js: common không được phụ thuộc tính năng\",\n      Tests  1 failed (1)";

export default {
  title: '5.4 — Project structure that scales: feature folders, shared modules, monorepo libraries|||5.4 — Cấu trúc dự án lớn lên được: thư mục theo tính năng, module dùng chung, thư viện monorepo',
  slug: 'nst-5-4-cau-truc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Thư mục theo tính năng, mỗi tính năng một module với cửa ra là exports; common/ và config/ không phụ thuộc tính năng. Chạy thật các bẫy đường dẫn: tsconfig "paths" qua tsc vẫn exit 0 nhưng node báo ERR_MODULE_NOT_FOUND, nest build thì tự viết lại; Node subpath imports "#common" chạy không cần công cụ nhưng Vitest phải khai ssr.resolve.conditions; nest g library ở Nest 12 đổi builder sang rspack và làm hỏng rootDir. Bài tập: test kiến trúc chặn import sai giữa các thư mục.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>5.4 — A structure that survives the third developer</h2>
<p class="lead">Nest generates a tidy project, but tidiness does not survive months of deadlines on its own. This lesson gives a folder layout and three rules that keep a Nest project navigable, then runs the import-path tricks people reach for when relative paths get long — two of which build fine and crash at runtime. The general argument for organising by feature is in Node.js 18.2; here we apply it to Nest modules and tooling.</p>

<h3>Everyday analogy: a hospital by department</h3>
<p>A hospital is not organised as "all beds on floor 1, all medicines on floor 2, all doctors on floor 3". It is organised by department: cardiology has its own beds, nurses and medicines, and talks to radiology through a request form. Shared services (laundry, pharmacy stock) serve everyone but never depend on one department. Feature folders are departments; a module's <code>exports</code> is the request form; <code>common/</code> is the laundry.</p>

<h3>The layout used in this course</h3>
<div class="out">${esc(OUT_CAY)}</div>
<p>This is the course project after Milestone 5 (Lesson 5.6). The rules:</p>
<ol>
<li><strong>One folder per feature</strong> (<code>rooms/</code>, <code>bookings/</code>), containing its module, controller, service, DTOs, entities and unit tests. A change to "bookings" touches one folder. <code>nest g resource</code> already generates this shape.</li>
<li><strong>A feature talks to another only through what its module exports</strong> — here <code>RoomsModule</code> exports <code>RoomsService</code> and nothing else. <code>bookings</code> never imports <code>rooms/entities</code> or <code>rooms/dto</code> directly; if it needs data it calls the service, which returns a response type. This is Lesson 2.3's encapsulation applied to files.</li>
<li><strong><code>common/</code> and <code>config/</code> depend on no feature.</strong> Guards, filters, clock, logging configuration. If something in <code>common</code> needs "rooms", it is not common — move it into the feature.</li>
</ol>
<p>Naming conventions Nest teams expect: kebab-case file names with a role suffix (<code>create-booking.dto.ts</code>, <code>api-key.guard.ts</code>), one class per file, <code>*.spec.ts</code> next to the code, <code>*.e2e.spec.ts</code> for tests that start the app. Avoid <code>index.ts</code> "barrel" files inside the app: with ESM they make import cycles (Lesson 2.3) easy and hard to see.</p>

<h3>Experiment 1 — <code>tsconfig</code> paths: compiles, then crashes</h3>
<p>Relative paths like <code>../../../common/clock.js</code> are ugly, so people add <code>"paths": { "@common/*": ["./src/common/*"] }</code> to <code>tsconfig.json</code> and import <code>'@common/clock.js'</code>.</p>
<div class="out">${esc(OUT_ALIAS)}</div>
<p><code>tsc</code> exits 0 and the emitted JavaScript still says <code>'@common/clock.js'</code>; Node looks for a package of that name and fails. <code>paths</code> only tells TypeScript where to find <em>types</em>; it never rewrites import strings. Your editor is happy, your build is green, and the container crashes on start.</p>
<div class="out">${esc(OUT_NESTBUILD)}</div>
<p><code>nest build</code> works because the Nest CLI runs a transformer that rewrites aliases to relative paths (<code>"../common/clock.js"</code>). So aliases are safe <em>only</em> if every build goes through <code>nest build</code> — not a plain <code>tsc</code> in a Dockerfile, not a script run with another tool.</p>

<h3>Experiment 2 — Node's own aliases: subpath imports</h3>
<p>Node supports aliases natively: an <code>"imports"</code> field in <code>package.json</code> whose keys start with <code>#</code>. TypeScript (<code>moduleResolution: nodenext</code>) understands them, maps <code>dist</code> back to <code>src</code> for type checking, and no rewriting is needed:</p>
<div class="out">${esc(OUT_IMPORTS)}</div>
<p>One more trap appears in tests: Vitest runs TypeScript sources directly, and <code>./dist/common/*</code> does not exist before a build. The fix is a <em>condition</em> that points at sources (<code>"source": "./src/common/*.ts"</code>), enabled only for tests — but in the right place:</p>
<div class="out">${esc(OUT_VITEST)}</div>
<p>Vitest executes test files in Vite's server-side ("ssr") environment, so the condition must be in <code>ssr.resolve.conditions</code>; the top-level <code>resolve.conditions</code> applies to browser code and changed nothing. Two config lines, half an hour of confusion if you do not know it.</p>
<p>Recommendation for this course: relative imports inside a feature, <code>#common/…</code> subpath imports if <code>common</code> paths get long, and no <code>tsconfig</code> paths unless you use the Nest monorepo mode below.</p>

<h3>Experiment 3 — <code>nest g library</code>: when one app becomes several</h3>
<p>A monorepo makes sense when you have <strong>several deployables</strong> sharing code — an API and a worker that processes the queue (Chapter 9), or an API and an admin service. We ran the generator in a copy of the course project:</p>
<div class="out">${esc(OUT_LIB)}</div>
<p>Two things the documentation does not shout about. First, Nest 12 switched the project's <code>builder</code> to <code>rspack</code> and added four dev dependencies, then started <code>npm install</code> (which hung in our network-less lab container — run it with network). A bundler is how Nest builds several apps from one repository; it changes how <code>dist</code> looks. Second, after setting the builder back to <code>tsc</code>:</p>
<div class="out">${esc(OUT_LIB_LOI)}</div>
<p>The application's <code>tsconfig.build.json</code> still says <code>"rootDir": "./src"</code>, and the library lives outside it. Fixing it moves the output:</p>
<div class="out">${esc(OUT_LIB_BUILD)}</div>
<p>The library works (<code>@lab/common</code> was rewritten to <code>../libs/common/src/index.js</code>), but the entry point is now <code>dist/src/main.js</code>, so the old <code>start:prod</code> script and any Dockerfile with <code>node dist/main.js</code> break. Lesson: do not run <code>nest g library</code> on a deadline. For a single API, a <code>common/</code> folder is enough; convert to a monorepo (<code>nest g app</code>, which also moves the app to <code>apps/</code>) when the second deployable really arrives, and update Docker and CI in the same pull request.</p>

<h3>🧪 Exercise (25 min) — enforce the rules with a test</h3>
<p>Rules that live only in a wiki are broken in the first rush. Write a unit test that reads every <code>.ts</code> file under <code>src/</code> and fails if <code>common/</code> imports a feature, or a feature imports anything other than another feature's <code>*.module.js</code>/<code>*.service.js</code>. Then plant two violations and see it fail.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_ARCH)}</code></pre>
<div class="out">${esc(OUT_ARCH)}</div>
<p>This is an "architecture test" — the Java world has ArchUnit for it; in TypeScript teams often use <code>dependency-cruiser</code> or ESLint boundary rules. A 20-line test is enough to start, runs with the normal test suite, and the failure message tells the developer exactly which import to change.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you organise a Nest project?</strong> By feature: one module per business area, communication through exported providers, shared infrastructure in <code>common</code>/<code>config</code> with no dependency on features.</li>
<li><strong>Why can a <code>tsconfig</code> path alias build but fail at runtime?</strong> <code>paths</code> affects type resolution only; plain <code>tsc</code> leaves the alias in the output. Use <code>nest build</code> (which rewrites) or Node subpath imports.</li>
<li><strong>When would you choose a Nest monorepo?</strong> When two or more deployables share code (API + worker). Not for one API — it changes build output and tooling.</li>
<li><strong>How do you stop the structure from decaying?</strong> Code review plus an automated architecture test or lint rule that fails the build on forbidden imports.</li>
</ol>

<h3>💼 On the job</h3>
<p>Joining an existing project, spend the first hour reading <code>app.module.ts</code> and the folder tree: the imports of the root module are the map of the system. In outsourcing teams the structure is often fixed by the customer's architect; if it differs from this lesson (layers instead of features, a <code>shared</code> library), follow it and apply the same principle — dependencies point in one direction. When you propose a change, bring the architecture test, not an opinion.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Feature folder</span><span class="v">Everything for one business area in one folder, wrapped by its Nest module.</span></div>
  <div class="kv"><span class="k">tsconfig paths</span><span class="v">Type-resolution aliases; not rewritten by tsc, rewritten by nest build.</span></div>
  <div class="kv"><span class="k">Subpath imports</span><span class="v">package.json "imports" with #-prefixed keys; Node resolves them at runtime.</span></div>
  <div class="kv"><span class="k">ssr.resolve.conditions</span><span class="v">Where Vitest (Node tests) takes export/import conditions from.</span></div>
  <div class="kv"><span class="k">Nest monorepo</span><span class="v">nest-cli.json with projects (apps + libs); Nest 12 builds it with rspack.</span></div>
  <div class="kv"><span class="k">Architecture test</span><span class="v">An automated test that fails on forbidden dependencies between parts of the code.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Organise by feature; features talk through module exports; <code>common</code> depends on nothing.</li>
<li><code>tsconfig</code> paths + plain <code>tsc</code> = ERR_MODULE_NOT_FOUND at runtime; <code>nest build</code> rewrites them.</li>
<li>Node subpath imports are native aliases; for Vitest add the source condition under <code>ssr.resolve</code>.</li>
<li><code>nest g library</code> switches to rspack and moves the build output — a decision, not a shortcut.</li>
<li>Encode structure rules as a test so they survive deadlines.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>5.4 — Một cấu trúc sống sót qua lập trình viên thứ ba</h2>
<p class="lead">Nest sinh ra một dự án gọn gàng, nhưng sự gọn gàng không tự sống sót qua nhiều tháng chạy deadline. Bài này đưa ra một bố cục thư mục và ba luật giữ cho dự án Nest dễ tìm đường, rồi chạy thật các mẹo đường dẫn import mà người ta hay dùng khi đường dẫn tương đối dài ra — hai trong số đó build được rồi sập lúc chạy. Lập luận chung cho việc chia theo tính năng nằm ở Node.js 18.2; ở đây ta áp nó vào module và công cụ của Nest.</p>

<h3>Liên hệ đời thường: bệnh viện chia theo khoa</h3>
<p>Bệnh viện không chia kiểu "mọi giường ở tầng 1, mọi thuốc ở tầng 2, mọi bác sĩ ở tầng 3". Nó chia theo khoa: khoa tim mạch có giường, y tá, thuốc của riêng mình, và làm việc với khoa chẩn đoán hình ảnh qua phiếu yêu cầu. Dịch vụ chung (giặt là, kho dược) phục vụ mọi khoa nhưng không bao giờ phụ thuộc một khoa nào. Thư mục theo tính năng là các khoa; <code>exports</code> của module là phiếu yêu cầu; <code>common/</code> là phòng giặt là.</p>

<h3>Bố cục dùng trong khoá này</h3>
<div class="out">${esc(OUT_CAY)}</div>
<p>Đây là dự án của khoá sau Mốc 5 (Bài 5.6). Ba luật:</p>
<ol>
<li><strong>Mỗi tính năng một thư mục</strong> (<code>rooms/</code>, <code>bookings/</code>), chứa module, controller, service, DTO, entity và test đơn vị của nó. Sửa "bookings" chỉ đụng một thư mục. <code>nest g resource</code> sinh sẵn đúng hình này.</li>
<li><strong>Tính năng này chỉ nói chuyện với tính năng kia qua thứ module của nó exports</strong> — ở đây <code>RoomsModule</code> exports <code>RoomsService</code> và không gì khác. <code>bookings</code> không bao giờ import thẳng <code>rooms/entities</code> hay <code>rooms/dto</code>; cần dữ liệu thì gọi service, service trả về kiểu phản hồi. Đó là tính đóng gói của Bài 2.3 áp vào tệp.</li>
<li><strong><code>common/</code> và <code>config/</code> không phụ thuộc tính năng nào.</strong> Guard, filter, đồng hồ, cấu hình log. Nếu thứ gì trong <code>common</code> cần tới "rooms", nó không phải là dùng chung — chuyển nó vào tính năng.</li>
</ol>
<p>Quy ước đặt tên mà đội Nest mong đợi: tên tệp kebab-case có hậu tố vai trò (<code>create-booking.dto.ts</code>, <code>api-key.guard.ts</code>), mỗi tệp một class, <code>*.spec.ts</code> nằm cạnh mã, <code>*.e2e.spec.ts</code> cho test khởi động cả ứng dụng. Tránh tệp "barrel" <code>index.ts</code> bên trong ứng dụng: với ESM chúng làm vòng import (Bài 2.3) dễ xảy ra và khó thấy.</p>

<h3>Thí nghiệm 1 — paths của <code>tsconfig</code>: biên dịch được, rồi sập</h3>
<p>Đường dẫn tương đối kiểu <code>../../../common/clock.js</code> xấu, nên người ta thêm <code>"paths": { "@common/*": ["./src/common/*"] }</code> vào <code>tsconfig.json</code> và import <code>'@common/clock.js'</code>.</p>
<div class="out">${esc(OUT_ALIAS)}</div>
<p><code>tsc</code> thoát mã 0 và JavaScript xuất ra vẫn ghi <code>'@common/clock.js'</code>; Node đi tìm một gói tên như vậy và thất bại. <code>paths</code> chỉ bảo TypeScript tìm <em>kiểu</em> ở đâu; nó không bao giờ viết lại chuỗi import. Trình soạn thảo vui vẻ, build xanh, còn container thì sập khi khởi động.</p>
<div class="out">${esc(OUT_NESTBUILD)}</div>
<p><code>nest build</code> chạy được vì Nest CLI có một bộ biến đổi viết lại bí danh thành đường dẫn tương đối (<code>"../common/clock.js"</code>). Vậy bí danh chỉ an toàn <em>khi</em> mọi bản build đều đi qua <code>nest build</code> — không phải một lệnh <code>tsc</code> trần trong Dockerfile, không phải một script chạy bằng công cụ khác.</p>

<h3>Thí nghiệm 2 — bí danh của chính Node: subpath imports</h3>
<p>Node hỗ trợ bí danh sẵn: trường <code>"imports"</code> trong <code>package.json</code> với khoá bắt đầu bằng <code>#</code>. TypeScript (<code>moduleResolution: nodenext</code>) hiểu chúng, tự ánh xạ <code>dist</code> về <code>src</code> để kiểm kiểu, và không cần viết lại gì:</p>
<div class="out">${esc(OUT_IMPORTS)}</div>
<p>Thêm một cái bẫy ở phần test: Vitest chạy thẳng mã nguồn TypeScript, còn <code>./dist/common/*</code> chưa tồn tại trước khi build. Cách sửa là một <em>điều kiện</em> trỏ vào mã nguồn (<code>"source": "./src/common/*.ts"</code>), chỉ bật khi test — nhưng phải đặt đúng chỗ:</p>
<div class="out">${esc(OUT_VITEST)}</div>
<p>Vitest chạy tệp test trong môi trường phía máy chủ ("ssr") của Vite, nên điều kiện phải nằm ở <code>ssr.resolve.conditions</code>; <code>resolve.conditions</code> cấp cao nhất áp cho mã trình duyệt và không đổi được gì. Hai dòng cấu hình, nửa giờ bối rối nếu bạn không biết.</p>
<p>Khuyến nghị cho khoá này: trong một tính năng dùng import tương đối, dùng subpath import <code>#common/…</code> nếu đường dẫn tới <code>common</code> dài, và không dùng paths của <code>tsconfig</code> trừ khi dùng chế độ monorepo của Nest bên dưới.</p>

<h3>Thí nghiệm 3 — <code>nest g library</code>: khi một ứng dụng thành nhiều</h3>
<p>Monorepo có lý khi bạn có <strong>nhiều thứ triển khai riêng</strong> dùng chung mã — một API và một worker xử lý hàng đợi (Chương 9), hoặc một API và một dịch vụ quản trị. Ta chạy lệnh sinh trên một bản sao của dự án khoá:</p>
<div class="out">${esc(OUT_LIB)}</div>
<p>Hai điều tài liệu không nói to. Thứ nhất, Nest 12 đổi <code>builder</code> của dự án sang <code>rspack</code>, thêm bốn gói devDependencies, rồi tự chạy <code>npm install</code> (lệnh này treo trong container lab không mạng của ta — hãy chạy khi có mạng). Bundler là cách Nest build nhiều ứng dụng từ một kho; nó làm thay đổi hình dạng <code>dist</code>. Thứ hai, sau khi đặt builder về lại <code>tsc</code>:</p>
<div class="out">${esc(OUT_LIB_LOI)}</div>
<p><code>tsconfig.build.json</code> của ứng dụng vẫn ghi <code>"rootDir": "./src"</code>, mà thư viện nằm ngoài thư mục đó. Sửa thì đầu ra bị dời chỗ:</p>
<div class="out">${esc(OUT_LIB_BUILD)}</div>
<p>Thư viện chạy được (<code>@lab/common</code> được viết lại thành <code>../libs/common/src/index.js</code>), nhưng điểm vào giờ là <code>dist/src/main.js</code>, nên script <code>start:prod</code> cũ và mọi Dockerfile có <code>node dist/main.js</code> đều hỏng. Bài học: đừng chạy <code>nest g library</code> khi đang gấp deadline. Với một API, thư mục <code>common/</code> là đủ; chuyển sang monorepo (<code>nest g app</code>, lệnh này còn dời ứng dụng vào <code>apps/</code>) khi thứ triển khai thứ hai thật sự xuất hiện, và sửa Docker cùng CI trong cùng một pull request.</p>

<h3>🧪 Bài tập (25 phút) — ép luật bằng một test</h3>
<p>Luật chỉ nằm trên wiki sẽ bị phá trong đợt gấp đầu tiên. Viết một test đơn vị đọc mọi tệp <code>.ts</code> dưới <code>src/</code> và báo đỏ nếu <code>common/</code> import một tính năng, hoặc một tính năng import bất cứ thứ gì khác ngoài <code>*.module.js</code>/<code>*.service.js</code> của tính năng kia. Rồi cài thử hai vi phạm và xem nó đỏ.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_ARCH)}</code></pre>
<div class="out">${esc(OUT_ARCH)}</div>
<p>Đây là "test kiến trúc" — thế giới Java có ArchUnit cho việc này; đội TypeScript hay dùng <code>dependency-cruiser</code> hoặc luật ranh giới của ESLint. Một test 20 dòng là đủ để bắt đầu, chạy cùng bộ test bình thường, và thông báo lỗi nói đúng import nào cần đổi.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Bạn tổ chức dự án Nest thế nào?</strong> Theo tính năng: mỗi mảng nghiệp vụ một module, giao tiếp qua provider được exports, hạ tầng dùng chung ở <code>common</code>/<code>config</code> và không phụ thuộc tính năng.</li>
<li><strong>Vì sao bí danh paths của <code>tsconfig</code> build được mà chạy thì hỏng?</strong> <code>paths</code> chỉ ảnh hưởng việc tìm kiểu; <code>tsc</code> trần để nguyên bí danh trong output. Dùng <code>nest build</code> (có viết lại) hoặc subpath imports của Node.</li>
<li><strong>Khi nào chọn monorepo của Nest?</strong> Khi có từ hai thứ triển khai riêng trở lên dùng chung mã (API + worker). Không dùng cho một API — nó đổi đầu ra build và công cụ.</li>
<li><strong>Làm sao để cấu trúc không xuống cấp?</strong> Review mã cộng một test kiến trúc hoặc luật lint tự động làm build đỏ khi có import bị cấm.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Khi vào một dự án có sẵn, dành giờ đầu tiên đọc <code>app.module.ts</code> và cây thư mục: các import của module gốc chính là bản đồ hệ thống. Ở đội outsourcing, cấu trúc thường do kiến trúc sư phía khách chốt; nếu nó khác bài này (chia theo tầng thay vì theo tính năng, có thư viện <code>shared</code>), hãy theo nó và áp cùng nguyên tắc — phụ thuộc chỉ đi một chiều. Khi đề xuất thay đổi, mang theo test kiến trúc, đừng mang theo ý kiến.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Thư mục theo tính năng</span><span class="v">Mọi thứ của một mảng nghiệp vụ trong một thư mục, bọc bởi module Nest của nó.</span></div>
  <div class="kv"><span class="k">tsconfig paths</span><span class="v">Bí danh để tìm kiểu; tsc không viết lại, nest build thì có.</span></div>
  <div class="kv"><span class="k">Subpath imports</span><span class="v">Trường "imports" trong package.json với khoá bắt đầu bằng #; Node tự phân giải lúc chạy.</span></div>
  <div class="kv"><span class="k">ssr.resolve.conditions</span><span class="v">Nơi Vitest (test chạy trên Node) lấy điều kiện import/export.</span></div>
  <div class="kv"><span class="k">Monorepo của Nest</span><span class="v">nest-cli.json có projects (apps + libs); Nest 12 build bằng rspack.</span></div>
  <div class="kv"><span class="k">Test kiến trúc</span><span class="v">Test tự động báo đỏ khi có phụ thuộc bị cấm giữa các phần của mã.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chia theo tính năng; tính năng nói chuyện qua exports của module; <code>common</code> không phụ thuộc gì.</li>
<li>paths của <code>tsconfig</code> + <code>tsc</code> trần = ERR_MODULE_NOT_FOUND lúc chạy; <code>nest build</code> thì viết lại.</li>
<li>Subpath imports là bí danh gốc của Node; với Vitest thêm điều kiện source dưới <code>ssr.resolve</code>.</li>
<li><code>nest g library</code> đổi sang rspack và dời đầu ra build — đó là một quyết định, không phải lối tắt.</li>
<li>Viết luật cấu trúc thành test để chúng sống sót qua deadline.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
