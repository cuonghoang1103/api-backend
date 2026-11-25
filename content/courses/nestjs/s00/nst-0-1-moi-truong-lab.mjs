/**
 * 0.1 — Dựng môi trường (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: máy Linux (Fedora, Node v22.22.2, npm 10.9.7) cho nest new / npm / Vitest; container node:22-alpine
 * (Node v22.23.5) cho nest info, nest start + curl; container postgres:16 (16.16) cho psql. Thư mục scratchpad/nst/lab.
 * Hai sự cố THẬT lúc soạn: (1) nest new --type esm với npm 10.9.7 ⇒ "Packages installation failed", npm install báo
 * "Cannot read properties of null (reading 'edgesOut')"; npx npm@11 install qua. (2) nest new --type cjs (Jest 30) trên
 * Node 22 ⇒ "Must use import to load ES Module … Use Node v24.9+"; thử transformIgnorePatterns vẫn hỏng.
 * (3) node_modules cài trên glibc chép vào alpine ⇒ Vitest "Cannot find native binding" (rolldown) — để dành chương 11.
 */
import { nguon, lienKet } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-0-3-cai-dat', title: 'Node.js 0.3 — Cài đặt môi trường làm việc', sub: 'Cài Node, VS Code, terminal từ đầu — nếu máy bạn chưa có gì.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-0-5-bat-dau-tai-day', title: 'Docker — Bắt đầu tại đây', sub: 'Chưa dùng Docker bao giờ? Ta chỉ cần docker run cho PostgreSQL và Redis.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — First steps', 'Cài CLI, nest new, cấu trúc dự án gốc.', 'https://docs.nestjs.com/first-steps'),
  nguon('🏷️', 'NestJS v12.0.0 release notes', 'Node 20.19+/22.12+, nest new hỏi CommonJS hay ESM, Vitest cho ESM, Jest cho CommonJS.', 'https://github.com/nestjs/nest/releases/tag/v12.0.0'),
  nguon('🧪', 'Jest Docs — ECMAScript Modules: require(esm)', 'Jest nạp gói ESM bằng require chỉ từ Node 24.9+.', 'https://jestjs.io/docs/ecmascript-modules'),
].join('\n');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const OUT_VER = `$ node -v
v22.22.2
$ npm -v
10.9.7`;

const OUT_NEW_FAIL = `$ nest new thu --type esm --package-manager npm --skip-git --no-interactive
✨  We will scaffold your app in a few seconds..
CREATE thu/src/main.ts (237 bytes)
…
Failed to execute command: npm install --silent
✖ Installation in progress... ☕
🙀  Packages installation failed!
In case you don't see any errors above, consider manually running the failed command npm install to see more details on why it errored out.
$ cd thu && npm install
npm error Cannot read properties of null (reading 'edgesOut')
npm error A complete log of this run can be found in: /home/…/.npm/_logs/2026-11-23T20_23_40_361Z-debug-0.log`;

const OUT_LOG = `2264 verbose stack TypeError: Cannot read properties of null (reading 'edgesOut')
2264 verbose stack     at #loadPeerSet (/usr/lib/node_modules_22/npm/node_modules/@npmcli/arborist/lib/arborist/build-ideal-tree.js:1289:38)`;

const OUT_NPM11 = `$ npx -y npm@11 install
…
$ ls node_modules/.bin | wc -l
19`;

const OUT_JEST = `$ npm test        # dự án tạo bằng --type cjs (Jest 30), Node 22
FAIL src/app.controller.spec.ts
  ● Test suite failed to run

    Must use import to load ES Module: …/node_modules/@nestjs/testing/index.js

    The file contains ESM syntax (import/export) that could not be executed as CommonJS. Either:
      - Configure a transform (e.g. babel-jest) that compiles this file to CommonJS
      - If the file is in "node_modules", allow it to be transformed by adjusting "transformIgnorePatterns"
      - Use Node v24.9+ where Jest supports require(esm) natively

    > 1 | import { Test, TestingModule } from '@nestjs/testing';
        | ^

Test Suites: 1 failed, 1 total`;

const CAY = `nst-esm/
├── AGENTS.md              ← ghi chú cho trợ lý AI (Nest 12 sinh sẵn)
├── nest-cli.json          ← cấu hình CLI: thư mục nguồn, xoá dist trước khi build
├── package.json           ← scripts: start, start:dev, build, test, test:e2e, lint
├── tsconfig.json          ← module nodenext, experimentalDecorators, emitDecoratorMetadata
├── tsconfig.build.json    ← loại test khỏi bản build
├── vitest.config.ts       ← test đơn vị: **/*.spec.ts
├── vitest.config.e2e.ts   ← test e2e: **/*.e2e-spec.ts
├── .oxlintrc.json, .prettierrc
├── src/
│   ├── main.ts            ← điểm vào: NestFactory.create + listen
│   ├── app.module.ts      ← module gốc
│   ├── app.controller.ts  ← GET /
│   ├── app.service.ts     ← trả 'Hello World!'
│   └── app.controller.spec.ts
└── test/
    └── app.e2e-spec.ts`;

const MAIN = `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();`;

const MODULE = `import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}`;

const OUT_INFO = `$ npx nest info
[System Information]
OS Version     : Linux 7.1.3-201.fc44.x86_64
NodeJS Version : v22.23.5
NPM Version    : 10.9.9
[Nest CLI]
Nest CLI Version : 12.0.15
[Nest Platform Information]
platform-express version : 12.6.0
schematics version       : 12.0.16
testing version          : 12.6.0
common version           : 12.6.0
core version             : 12.6.0
cli version              : 12.0.15`;

const OUT_START = `$ npm run start
> nst-esm@0.0.1 start
> nest start
[Nest] 33  - 11/23/2026, 8:35:40 PM     LOG [NestFactory] Starting Nest application...
[Nest] 33  - 11/23/2026, 8:35:40 PM     LOG [InstanceLoader] AppModule dependencies initialized +6ms
[Nest] 33  - 11/23/2026, 8:35:40 PM     LOG [RoutesResolver] AppController {/}: +2ms
[Nest] 33  - 11/23/2026, 8:35:40 PM     LOG [RouterExplorer] Mapped {/, GET} route +2ms
[Nest] 33  - 11/23/2026, 8:35:40 PM     LOG [NestApplication] Nest application successfully started +1ms
$ curl -s localhost:3000
Hello World!`;

const OUT_TEST = `$ npx vitest run --reporter=verbose
 RUN  v4.1.12 /home/…/nst-esm
 ✓ src/app.controller.spec.ts > AppController > root > should return "Hello World!" 58ms
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Duration  444ms (transform 31ms, setup 0ms, import 230ms, tests 59ms, environment 0ms)
$ npm run test:e2e
> nst-esm@0.0.1 test:e2e
> vitest run --config ./vitest.config.e2e.ts
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Duration  570ms (transform 81ms, setup 0ms, import 333ms, tests 78ms, environment 0ms)`;

const OUT_PG = `$ docker run -d --name nest-pg -e POSTGRES_PASSWORD=matkhau-dev -e POSTGRES_DB=nestlab -p 127.0.0.1:5432:5432 postgres:16
$ docker exec nest-pg pg_isready -U postgres
/var/run/postgresql:5432 - accepting connections
$ docker exec nest-pg psql -U postgres -d nestlab -c 'select version();'
 PostgreSQL 16.16 (Debian 16.16-1.pgdg13+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
(1 row)`;

export default {
  title: '0.1 — Lab setup: Node 22, Nest CLI 12, ESM vs CommonJS, first run and first test|||0.1 — Dựng môi trường: Node 22, Nest CLI 12, ESM hay CommonJS, chạy và test lần đầu',
  slug: 'nst-0-1-moi-truong-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cài Nest CLI 12 trên Node 22, tạo dự án ESM (Vitest) hoặc CommonJS (Jest), đọc từng tệp sinh ra, chạy và test lần đầu, dựng PostgreSQL trong Docker — kèm hai sự cố thật gặp lúc soạn (npm 10.9 cài hỏng, Jest 30 không nạp được gói ESM trên Node 22) và cách xử lý.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>0.1 — Set up once, correctly: Node 22, Nest CLI 12, a project that runs and a test that passes</h2>
<p class="lead">By the end of this lesson you have a Nest 12 project that starts, answers <code>curl</code>, passes its unit and end-to-end tests, and a PostgreSQL in Docker for later chapters. While preparing it we hit two real problems that you will very likely hit too on Node 22 — they are part of the lesson, with the exact messages and fixes.</p>

<h3>Step 1 — Check Node and npm</h3>
<div class="out">${esc(OUT_VER)}</div>
<p>Nest 12 requires <strong>Node 20.19+ or 22.12+</strong> (the 21.x line is refused). Any Node 22 LTS from 22.12 on is fine. On Windows, install Node with the official installer or <code>nvm-windows</code>; on macOS/Linux, <code>nvm</code> or <code>fnm</code> lets you switch versions per project.</p>

<h3>Step 2 — Upgrade npm before creating a project (real problem #1)</h3>
<p>Node 22 bundles npm 10.9. Creating an ESM project with it failed on our machine:</p>
<div class="out">${esc(OUT_NEW_FAIL)}</div>
<p>The debug log shows the crash is inside npm itself (its dependency-tree builder, while resolving peer dependencies), not in Nest:</p>
<div class="out">${esc(OUT_LOG)}</div>
<p>Running the install with npm 11 worked straight away:</p>
<div class="out">${esc(OUT_NPM11)}</div>
<p><strong>Do this once:</strong> <code>npm install -g npm@11</code> (or run <code>npx -y npm@11 install</code> inside the project). Note the CLI's honest hint: "consider manually running the failed command" — when a tool hides an error, run the underlying command yourself to see it.</p>

<h3>Step 3 — Install the CLI and create the project</h3>
<pre><code class="language-bash">npm install -g @nestjs/cli@12      # or use npx @nestjs/cli@12 each time
nest new nst-lab --type esm --package-manager npm</code></pre>
<p><code>nest new</code> asks two questions you should understand:</p>
<ul>
<li><strong>Module system: ESM or CommonJS?</strong> Since Nest 12 all <code>@nestjs/*</code> packages are ESM. A new ESM project uses <code>import … from './app.module.js'</code> (with <code>.js</code> even in a <code>.ts</code> file — Node's ESM resolver needs the real output file name) and is tested with <strong>Vitest</strong>. A CommonJS project is tested with <strong>Jest</strong>, like most Nest 10/11 projects you will meet at companies.</li>
<li><strong>Observability (<code>@nestjs/observe</code>):</strong> answer no for now (<code>--no-observe</code>); Chapter 5 covers logging.</li>
</ul>

<h3>Real problem #2 — the CommonJS + Jest project fails its first test on Node 22</h3>
<div class="out">${esc(OUT_JEST)}</div>
<p>Jest runs your tests with its own module loader. To <code>require()</code> an ESM package such as <code>@nestjs/testing</code> 12, Jest needs Node <strong>24.9+</strong>. Our attempt to make Jest compile <code>@nestjs/*</code> with <code>transformIgnorePatterns</code> got one file further and failed again. So this course decides:</p>
<table>
<thead><tr><th></th><th>Main project of the course</th><th>Chapter 8, "Jest on existing projects"</th></tr></thead>
<tbody>
<tr><td>Nest</td><td>12, ESM</td><td>11, CommonJS (what most companies run today)</td></tr>
<tr><td>Test runner</td><td>Vitest (Nest 12 default)</td><td>Jest</td></tr>
<tr><td>Node</td><td>22</td><td>22 (Nest 11 packages are CommonJS, Jest works)</td></tr>
</tbody>
</table>
<p>The test API is nearly identical (<code>describe</code>, <code>it</code>, <code>expect</code>; <code>vi.fn()</code> vs <code>jest.fn()</code>), so you learn one and read the other.</p>

<h3>Step 4 — Read every generated file</h3>
<pre><code>${esc(CAY)}</code></pre>
<pre><code class="language-ts">${esc(MAIN)}</code></pre>
<pre><code class="language-ts">${esc(MODULE)}</code></pre>
<p><code>main.ts</code> asks <code>NestFactory</code> to build the application from the <strong>root module</strong>; Nest walks the module tree, creates providers, maps routes, then <code>listen</code> opens the port. <code>tsconfig.json</code> has <code>experimentalDecorators</code> and <code>emitDecoratorMetadata</code> switched on — Chapter 1 shows why DI cannot work without the second one. <code>AGENTS.md</code> is new in Nest 12: notes for AI coding assistants pointing them to the current docs.</p>

<h3>Step 5 — Check versions, run, call it, test it</h3>
<div class="out">${esc(OUT_INFO)}</div>
<div class="out">${esc(OUT_START)}</div>
<div class="out">${esc(OUT_TEST)}</div>
<p>Use <code>npm run start:dev</code> while coding: it recompiles and restarts on every save. <code>nest info</code> is the first thing to paste when you ask for help — versions explain half of all Nest problems.</p>

<h3>Step 6 — PostgreSQL in Docker for later chapters</h3>
<div class="out">${esc(OUT_PG)}</div>
<p>We publish the port on <code>127.0.0.1</code> only. Publishing on all interfaces with a weak password is how databases get found by scanners within hours.</p>

<h3>Troubleshooting table</h3>
<table>
<thead><tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>Packages installation failed</code>, then <code>reading 'edgesOut'</code></td><td>Bug in npm 10.9</td><td><code>npm i -g npm@11</code>, run <code>npm install</code> again</td></tr>
<tr><td><code>Must use import to load ES Module</code> in Jest</td><td>Jest + Nest 12 ESM packages on Node &lt; 24.9</td><td>Use the ESM + Vitest project, or Node 24.9+</td></tr>
<tr><td><code>EADDRINUSE :::3000</code></td><td>Another app holds port 3000</td><td><code>PORT=3001 npm run start</code></td></tr>
<tr><td><code>Cannot find native binding</code> (rolldown) in Docker</td><td><code>node_modules</code> installed on another OS copied into the container</td><td>Install inside the image (Chapter 11)</td></tr>
<tr><td>ESM: <code>Cannot find module './x'</code></td><td>Missing <code>.js</code> in a relative import</td><td>Write <code>'./x.js'</code></td></tr>
</tbody>
</table>

<h3>🧪 Lab (30 min) — a clean environment you can prove</h3>
<div class="callout ok">
<ol>
<li>Upgrade npm, install Nest CLI 12, create <code>nst-lab</code> as ESM.</li>
<li>Change <code>app.service.ts</code> to return <code>Xin chào Nest!</code>. Run <code>npm test</code>: it must <strong>fail</strong>. Read the failure, then fix the test.</li>
<li>Start with <code>PORT=3001 npm run start:dev</code>, call it with <code>curl</code>, edit the message again and watch the automatic restart.</li>
<li>Start PostgreSQL as in step 6 and run <code>select now();</code>.</li>
<li>Paste your <code>nest info</code> into a file <code>MOI-TRUONG.md</code> in the project.</li>
</ol>
<p><strong>Done when:</strong> four outputs saved (failing test, passing test, curl, psql) and <code>MOI-TRUONG.md</code> exists.</p>
<details><summary>Hint for step 2</summary>
<p>The spec expects <code>'Hello World!'</code>. Vitest prints <code>AssertionError: expected 'Xin chào Nest!' to be 'Hello World!'</code> — the test is doing its job: it caught a change in behaviour. Update the expected value in <code>app.controller.spec.ts</code>.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nest CLI</span><span class="v">The <code>nest</code> command: create projects, generate files, build, start.</span></div>
  <div class="kv"><span class="k">ESM</span><span class="v">ECMAScript modules: <code>import</code>/<code>export</code>, the standard module system; Nest 12 packages ship as ESM.</span></div>
  <div class="kv"><span class="k">CommonJS</span><span class="v">Node's older <code>require</code>/<code>module.exports</code> system; most Nest 10/11 projects use it.</span></div>
  <div class="kv"><span class="k">root module</span><span class="v">The module passed to <code>NestFactory.create</code>; the starting point of the module tree.</span></div>
  <div class="kv"><span class="k">e2e test</span><span class="v">End-to-end test: starts the whole Nest app in memory and calls it over HTTP.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Nest 12 needs Node 20.19+/22.12+; upgrade npm to 11 first — npm 10.9 crashed installing a new ESM project.</li>
<li>ESM projects use Vitest; CommonJS projects use Jest, which cannot load Nest 12's ESM packages on Node 22.</li>
<li>This course: Nest 12 ESM + Vitest for the main project, Nest 11 CommonJS + Jest in Chapter 8.</li>
<li><code>main.ts</code> → <code>NestFactory.create(AppModule)</code> → module tree → routes → <code>listen</code>.</li>
<li>Keep databases bound to 127.0.0.1 in development; keep <code>nest info</code> output when asking for help.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>0.1 — Dựng một lần cho đúng: Node 22, Nest CLI 12, một dự án chạy được và một test xanh</h2>
<p class="lead">Hết bài này bạn có một dự án Nest 12 khởi động được, trả lời <code>curl</code>, qua test đơn vị và test end-to-end, cùng một PostgreSQL trong Docker cho các chương sau. Lúc chuẩn bị bài, ta vấp đúng hai sự cố thật mà rất có thể bạn cũng gặp trên Node 22 — chúng là một phần của bài, kèm nguyên văn thông báo lỗi và cách sửa.</p>

<h3>Bước 1 — Kiểm Node và npm</h3>
<div class="out">${esc(OUT_VER)}</div>
<p>Nest 12 cần <strong>Node 20.19+ hoặc 22.12+</strong> (dòng 21.x bị từ chối). Node 22 LTS từ bản 22.12 trở lên đều được. Trên Windows, cài Node bằng bộ cài chính thức hoặc <code>nvm-windows</code>; trên macOS/Linux, <code>nvm</code> hoặc <code>fnm</code> cho phép đổi phiên bản theo từng dự án.</p>

<h3>Bước 2 — Nâng npm trước khi tạo dự án (sự cố thật số 1)</h3>
<p>Node 22 đi kèm npm 10.9. Tạo dự án ESM bằng nó thì hỏng ngay trên máy soạn bài:</p>
<div class="out">${esc(OUT_NEW_FAIL)}</div>
<p>Nhật ký gỡ lỗi cho thấy chỗ sập nằm trong chính npm (bộ dựng cây phụ thuộc, lúc xử lý peer dependency), không phải trong Nest:</p>
<div class="out">${esc(OUT_LOG)}</div>
<p>Cài lại bằng npm 11 thì chạy ngay:</p>
<div class="out">${esc(OUT_NPM11)}</div>
<p><strong>Làm một lần:</strong> <code>npm install -g npm@11</code> (hoặc chạy <code>npx -y npm@11 install</code> trong thư mục dự án). Để ý lời nhắc rất thật thà của CLI: "hãy tự chạy lại lệnh bị lỗi" — khi một công cụ giấu lỗi, tự chạy lệnh bên dưới để thấy nó.</p>

<h3>Bước 3 — Cài CLI và tạo dự án</h3>
<pre><code class="language-bash">npm install -g @nestjs/cli@12      # hoặc mỗi lần dùng npx @nestjs/cli@12
nest new nst-lab --type esm --package-manager npm</code></pre>
<p><code>nest new</code> hỏi hai câu bạn cần hiểu:</p>
<ul>
<li><strong>Hệ module: ESM hay CommonJS?</strong> Từ Nest 12, mọi gói <code>@nestjs/*</code> đều là ESM. Dự án ESM mới viết <code>import … from './app.module.js'</code> (có <code>.js</code> ngay trong tệp <code>.ts</code> — bộ phân giải ESM của Node cần đúng tên tệp đầu ra) và test bằng <strong>Vitest</strong>. Dự án CommonJS test bằng <strong>Jest</strong>, giống phần lớn dự án Nest 10/11 bạn sẽ gặp ở công ty.</li>
<li><strong>Quan sát hệ thống (<code>@nestjs/observe</code>):</strong> tạm trả lời không (<code>--no-observe</code>); chương 5 dạy phần log.</li>
</ul>

<h3>Sự cố thật số 2 — dự án CommonJS + Jest hỏng ngay test đầu tiên trên Node 22</h3>
<div class="out">${esc(OUT_JEST)}</div>
<p>Jest chạy test bằng bộ nạp module của riêng nó. Muốn <code>require()</code> một gói ESM như <code>@nestjs/testing</code> 12, Jest cần Node <strong>24.9+</strong>. Ta thử cho Jest biên dịch luôn <code>@nestjs/*</code> bằng <code>transformIgnorePatterns</code> thì đi thêm được một tệp rồi lại hỏng. Vì vậy khoá này chọn:</p>
<table>
<thead><tr><th></th><th>Dự án chính của khoá</th><th>Chương 8, "Jest trên dự án đang chạy"</th></tr></thead>
<tbody>
<tr><td>Nest</td><td>12, ESM</td><td>11, CommonJS (dạng phần lớn công ty đang chạy)</td></tr>
<tr><td>Trình chạy test</td><td>Vitest (mặc định của Nest 12)</td><td>Jest</td></tr>
<tr><td>Node</td><td>22</td><td>22 (gói Nest 11 là CommonJS, Jest chạy được)</td></tr>
</tbody>
</table>
<p>API test gần như giống hệt (<code>describe</code>, <code>it</code>, <code>expect</code>; <code>vi.fn()</code> thay cho <code>jest.fn()</code>), học một bên là đọc được bên kia.</p>

<h3>Bước 4 — Đọc từng tệp được sinh ra</h3>
<pre><code>${esc(CAY)}</code></pre>
<pre><code class="language-ts">${esc(MAIN)}</code></pre>
<pre><code class="language-ts">${esc(MODULE)}</code></pre>
<p><code>main.ts</code> nhờ <code>NestFactory</code> dựng ứng dụng từ <strong>module gốc</strong>; Nest đi hết cây module, tạo provider, nối route, rồi <code>listen</code> mới mở cổng. <code>tsconfig.json</code> bật <code>experimentalDecorators</code> và <code>emitDecoratorMetadata</code> — chương 1 cho bạn thấy vì sao thiếu cái thứ hai thì DI không chạy được. <code>AGENTS.md</code> là thứ mới của Nest 12: ghi chú cho trợ lý lập trình AI, chỉ chúng tới tài liệu bản mới nhất.</p>

<h3>Bước 5 — Kiểm phiên bản, chạy, gọi thử, test</h3>
<div class="out">${esc(OUT_INFO)}</div>
<div class="out">${esc(OUT_START)}</div>
<div class="out">${esc(OUT_TEST)}</div>
<p>Khi đang viết mã, dùng <code>npm run start:dev</code>: mỗi lần lưu tệp nó tự biên dịch và khởi động lại. <code>nest info</code> là thứ đầu tiên cần dán khi nhờ người khác giúp — phiên bản giải thích được một nửa số lỗi Nest.</p>

<h3>Bước 6 — PostgreSQL trong Docker cho các chương sau</h3>
<div class="out">${esc(OUT_PG)}</div>
<p>Ta chỉ mở cổng trên <code>127.0.0.1</code>. Mở trên mọi giao diện mạng kèm mật khẩu yếu là cách cơ sở dữ liệu bị máy quét tìm ra chỉ sau vài giờ.</p>

<h3>Bảng gỡ rối</h3>
<table>
<thead><tr><th>Triệu chứng</th><th>Nguyên nhân</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td><code>Packages installation failed</code>, rồi <code>reading 'edgesOut'</code></td><td>Lỗi của npm 10.9</td><td><code>npm i -g npm@11</code>, chạy lại <code>npm install</code></td></tr>
<tr><td>Jest báo <code>Must use import to load ES Module</code></td><td>Jest + gói ESM của Nest 12 trên Node &lt; 24.9</td><td>Dùng dự án ESM + Vitest, hoặc Node 24.9+</td></tr>
<tr><td><code>EADDRINUSE :::3000</code></td><td>Ứng dụng khác đang giữ cổng 3000</td><td><code>PORT=3001 npm run start</code></td></tr>
<tr><td>Trong Docker: <code>Cannot find native binding</code> (rolldown)</td><td><code>node_modules</code> cài trên hệ điều hành khác bị chép vào container</td><td>Cài bên trong image (chương 11)</td></tr>
<tr><td>ESM: <code>Cannot find module './x'</code></td><td>Thiếu <code>.js</code> trong import tương đối</td><td>Viết <code>'./x.js'</code></td></tr>
</tbody>
</table>

<h3>🧪 Lab (30 phút) — một môi trường sạch có bằng chứng</h3>
<div class="callout ok">
<ol>
<li>Nâng npm, cài Nest CLI 12, tạo <code>nst-lab</code> dạng ESM.</li>
<li>Sửa <code>app.service.ts</code> để trả <code>Xin chào Nest!</code>. Chạy <code>npm test</code>: nó phải <strong>đỏ</strong>. Đọc lỗi, rồi sửa test.</li>
<li>Chạy <code>PORT=3001 npm run start:dev</code>, gọi bằng <code>curl</code>, sửa lời chào lần nữa và xem nó tự khởi động lại.</li>
<li>Bật PostgreSQL như bước 6 và chạy <code>select now();</code>.</li>
<li>Dán output <code>nest info</code> của bạn vào tệp <code>MOI-TRUONG.md</code> trong dự án.</li>
</ol>
<p><strong>Đạt khi:</strong> lưu đủ bốn output (test đỏ, test xanh, curl, psql) và có tệp <code>MOI-TRUONG.md</code>.</p>
<details><summary>Gợi ý bước 2</summary>
<p>Tệp spec mong <code>'Hello World!'</code>. Vitest in <code>AssertionError: expected 'Xin chào Nest!' to be 'Hello World!'</code> — test đang làm đúng việc: nó bắt được một thay đổi hành vi. Sửa giá trị mong đợi trong <code>app.controller.spec.ts</code>.</p>
</details>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nest CLI</span><span class="v">Lệnh <code>nest</code>: tạo dự án, sinh tệp, build, chạy.</span></div>
  <div class="kv"><span class="k">ESM</span><span class="v">ECMAScript modules: <code>import</code>/<code>export</code>, hệ module chuẩn; gói Nest 12 phát hành dạng ESM.</span></div>
  <div class="kv"><span class="k">CommonJS</span><span class="v">Hệ <code>require</code>/<code>module.exports</code> cũ của Node; phần lớn dự án Nest 10/11 dùng nó.</span></div>
  <div class="kv"><span class="k">module gốc</span><span class="v">Module truyền vào <code>NestFactory.create</code>; điểm bắt đầu của cây module.</span></div>
  <div class="kv"><span class="k">test e2e</span><span class="v">Test end-to-end: bật cả ứng dụng Nest trong bộ nhớ và gọi nó qua HTTP.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Nest 12 cần Node 20.19+/22.12+; nâng npm lên 11 trước — npm 10.9 sập khi cài dự án ESM mới.</li>
<li>Dự án ESM dùng Vitest; dự án CommonJS dùng Jest, mà Jest không nạp được gói ESM của Nest 12 trên Node 22.</li>
<li>Khoá này: dự án chính Nest 12 ESM + Vitest; chương 8 dạy Jest trên Nest 11 CommonJS.</li>
<li><code>main.ts</code> → <code>NestFactory.create(AppModule)</code> → cây module → route → <code>listen</code>.</li>
<li>Ở máy dev chỉ mở cơ sở dữ liệu trên 127.0.0.1; khi nhờ giúp, gửi kèm <code>nest info</code>.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
