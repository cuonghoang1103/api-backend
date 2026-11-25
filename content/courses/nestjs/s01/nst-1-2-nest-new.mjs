/**
 * 1.2 — Giải phẫu ứng dụng Nest (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0, Express 5.3.0, Fastify 5.12.8) cho nest g resource, build,
 * start, start:dev, lỗi thiếu provider (exit 1) / thiếu controller (404 im lặng), Fastify adapter (res.cookie is not a function).
 * Máy nhà (Fedora, Node v22.22.2) cho SWC (@swc/core 1.16.22 bản glibc): tsc ~1,7 s vs swc ~0,9 s cả lệnh; swc KHÔNG kiểm kiểu
 * (exit 0 với lỗi TS2322), --type-check thì exit 1. Thư mục scratchpad/nst/lab/c1 (o12/ chứa output đã cắt gọn).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-1-tu-http-toi-express', title: 'Node.js 5.1 — Từ http tới Express', sub: 'Express làm gì bên dưới — Nest mặc định chạy trên chính nó.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-18-2-to-chuc-ma-nguon', title: 'Node.js 18.2 — Tổ chức mã nguồn', sub: 'Chia theo tầng và theo tính năng — Nest biến quy ước đó thành module.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — First steps', 'main.ts, NestFactory, các tệp lõi của dự án.', 'https://docs.nestjs.com/first-steps'),
  nguon('📘', 'NestJS Docs — Performance (Fastify)', 'Đổi sang FastifyAdapter và những gì thay đổi theo.', 'https://docs.nestjs.com/techniques/performance'),
  nguon('📘', 'NestJS Docs — CLI: SWC builder', 'nest start -b swc, tuỳ chọn --type-check.', 'https://docs.nestjs.com/recipes/swc'),
].join('\n');
const MA_MAIN = "import { NestFactory } from '@nestjs/core';\nimport { AppModule } from './app.module.js';\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule);\n  await app.listen(process.env.PORT ?? 3000);\n}\nawait bootstrap();";
const OUT_GEN = "$ npx nest g resource notes --no-spec\nNot prompting, so using the defaults: --type rest, --crud. Pass the flags to choose otherwise.\nCREATE src/notes/notes.controller.ts (903 bytes)\nCREATE src/notes/notes.module.ts (254 bytes)\nCREATE src/notes/notes.service.ts (615 bytes)\nCREATE src/notes/dto/create-note.dto.ts (30 bytes)\nCREATE src/notes/dto/update-note.dto.ts (172 bytes)\nCREATE src/notes/entities/note.entity.ts (21 bytes)\nUPDATE src/app.module.ts (321 bytes)";
const MA_APPMOD = "import { Module } from '@nestjs/common';\nimport { AppController } from './app.controller.js';\nimport { AppService } from './app.service.js';\nimport { NotesModule } from './notes/notes.module.js';\n\n@Module({\n  imports: [NotesModule],\n  controllers: [AppController],\n  providers: [AppService],\n})\nexport class AppModule {}";
const OUT_START = "$ npm run build && node dist/main.js\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [NestFactory] Starting Nest application...\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [InstanceLoader] AppModule dependencies initialized +7ms\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [InstanceLoader] NotesModule dependencies initialized +0ms\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [RoutesResolver] AppController {/}: +3ms\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [RouterExplorer] Mapped {/, GET} route +2ms\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [RoutesResolver] NotesController {/notes}: +0ms\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [RouterExplorer] Mapped {/notes, POST} route +1ms\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [RouterExplorer] Mapped {/notes, GET} route +0ms\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [RouterExplorer] Mapped {/notes/:id, GET} route +0ms\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [RouterExplorer] Mapped {/notes/:id, PATCH} route +1ms\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [RouterExplorer] Mapped {/notes/:id, DELETE} route +0ms\n[Nest] 67  - 11/23/2026, 9:15:12 PM     LOG [NestApplication] Nest application successfully started +1ms\n$ curl -X POST localhost:3000/notes\nThis action adds a new note\n$ curl localhost:3000/notes/7\nThis action returns a #7 note";
const OUT_DIST = "$ ls dist dist/notes\ndist:\napp.controller.d.ts    app.controller.js    app.controller.js.map\napp.module.d.ts        app.module.js        app.module.js.map\napp.service.d.ts       app.service.js       app.service.js.map\nmain.d.ts              main.js              main.js.map\nnotes\n\ndist/notes:\ndto  entities\nnotes.controller.d.ts  notes.controller.js  notes.controller.js.map\nnotes.module.d.ts      notes.module.js      notes.module.js.map\nnotes.service.d.ts     notes.service.js     notes.service.js.map";
const OUT_DISTJS = "// dist/app.controller.js (bỏ phần định nghĩa __decorate/__metadata ở đầu tệp)\nimport { Controller, Get } from '@nestjs/common';\nimport { AppService } from './app.service.js';\nlet AppController = class AppController {\n    appService;\n    constructor(appService) {\n        this.appService = appService;\n    }\n    getHello() {\n        return this.appService.getHello();\n    }\n};\n__decorate([\n    Get(),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", []),\n    __metadata(\"design:returntype\", String)\n], AppController.prototype, \"getHello\", null);\nAppController = __decorate([\n    Controller(),\n    __metadata(\"design:paramtypes\", [AppService])\n], AppController);\nexport { AppController };";
const OUT_THIEUPROV = "$ node dist/main.js        # NotesModule: providers: []  (quên khai NotesService)\n[Nest] 117  - 11/23/2026, 9:15:33 PM     LOG [NestFactory] Starting Nest application...\n[Nest] 117  - 11/23/2026, 9:15:33 PM   ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the NotesController (?). Please make sure that the argument NotesService at index [0] is available in the NotesModule module.\n\nPotential solutions:\n- Is NotesModule a valid NestJS module?\n- If NotesService is a provider, is it part of the current NotesModule?\n- If NotesService is exported from a separate @Module, is that module imported within NotesModule?\n  @Module({\n    imports: [ /* the Module containing NotesService */ ]\n  })\n\nFor more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\n    at Injector.lookupComponentInParentModules (file:///app/nst-esm/node_modules/@nestjs/core/injector/injector.js:471:19) {\n…\n$ echo $?\n1";
const OUT_THIEUCTL = "$ node dist/main.js        # NotesModule: controllers: []  (quên khai NotesController)\n…   (không có dòng \"NotesController {/notes}\" nào trong log — và không có lỗi)\n$ curl localhost:3000/notes\n{\"message\":\"Cannot GET /notes\",\"error\":\"Not Found\",\"statusCode\":404}";
const OUT_WATCH = "$ npm run start:dev\n[9:15:37 PM] Starting compilation in watch mode...\n[9:15:38 PM] Found 0 errors. Watching for file changes.\n[Nest] 187  - 11/23/2026, 9:15:38 PM     LOG [NestFactory] Starting Nest application...\n…\n[Nest] 187  - 11/23/2026, 9:15:38 PM     LOG [NestApplication] Nest application successfully started +1ms\n$ curl localhost:3000\nHello World!\n      (sửa app.service.ts: 'Hello World!' → 'Xin chào Nest!', lưu tệp)\n[9:15:43 PM] File change detected. Starting incremental compilation...\n[9:15:43 PM] Found 0 errors. Watching for file changes.\n[Nest] 199  - 11/23/2026, 9:15:43 PM     LOG [NestFactory] Starting Nest application...\n…\n$ curl localhost:3000\nXin chào Nest!";
const OUT_SWC = "$ npm i -D @swc/cli @swc/core\n$ npx nest build -b swc\n>  SWC  Running...\nSuccessfully compiled: 10 files with swc (69.53ms)\n# đo cả lệnh (gồm khởi động CLI), 3 lần:   tsc 1755 / 1778 / 1669 ms   ·   swc 935 / 1004 / 817 ms";
const OUT_SWCLOI = "# cố tình viết sai kiểu trong app.controller.ts:   const x: number = \"chuoi\";\n$ npx nest build; echo \"exit=$?\"\nsrc/app.controller.ts:10:11 - error TS2322: Type 'string' is not assignable to type 'number'.\n\n10     const x: number = \"chuoi\"; return this.appService.getHello();\n             ~\n\n Error  Found 1 compilation error(s).\nexit=1\n$ npx nest build -b swc; echo \"exit=$?\"\n>  SWC  Running...\nSuccessfully compiled: 10 files with swc (101.54ms)\nexit=0\n$ npx nest build -b swc --type-check; echo \"exit=$?\"\nsrc/app.controller.ts:10:11 - error TS2322: Type 'string' is not assignable to type 'number'.\n…\n Error  Found 1 type error(s) during compilation.\nexit=1";
const OUT_FASTIFY = "# main.ts: NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())\n$ curl -i localhost:3000/demo/users/42\nHTTP/1.1 200 OK\ncontent-type: application/json; charset=utf-8\ncontent-length: 27\nDate: Mon, 23 Nov 2026 21:00:11 GMT\nConnection: keep-alive\nKeep-Alive: timeout=72\n\n{\"id\":\"42\",\"kieu\":\"string\"}\n$ curl localhost:3000/demo/res-passthrough        # handler gọi res.cookie(...) kiểu Express\n{\"statusCode\":500,\"message\":\"Internal server error\"}\n# log server:\nERROR [ExceptionsHandler] TypeError: res.cookie is not a function\n    at DemoController.resPass (file:///app/c1/app/dist/demo.controller.js:55:13)";
const OUT_EXPRESS = "# main.ts mặc định: NestFactory.create(AppModule)  ⇒ Express 5.3.0 bên dưới\n$ curl -i localhost:3000/demo/res-passthrough\nHTTP/1.1 200 OK\nX-Powered-By: Express\nSet-Cookie: xem=1; Path=/; HttpOnly\nContent-Type: application/json; charset=utf-8\nContent-Length: 26\nETag: W/\"1a-fEi2iAH/3QjqRg+S1FtJnHZu2/c\"\n…\n{\"van\":\"Nest gửi giúp\"}";
const OUT_LOGGER = "# main.ts: NestFactory.create(AppModule, { logger: ['error', 'warn'] })\n$ node dist/main.js\n      (không in dòng LOG nào — ứng dụng vẫn chạy; chỉ lỗi và cảnh báo mới hiện)";

export default {
  title: '1.2 — Anatomy of a Nest app: main.ts, NestFactory, AppModule, build and watch|||1.2 — Giải phẫu ứng dụng Nest: main.ts, NestFactory, AppModule, build và watch',
  slug: 'nst-1-2-nest-new',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Điều gì xảy ra từ node dist/main.js tới "successfully started": NestFactory dựng cây module, tạo provider, nối route; đọc từng dòng log khởi động. Express hay Fastify bên dưới (và cái giá khi đổi). nest build sinh gì trong dist, start:dev, SWC nhanh gấp đôi nhưng không kiểm kiểu. nest g resource sinh gì, hai lỗi kinh điển: quên provider (sập ngay, exit 1) và quên controller (404 im lặng).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>1.2 — From <code>node dist/main.js</code> to "successfully started": what Nest does in 10 milliseconds</h2>
<p class="lead">In lesson 1.1 your mini Nest read labels and mapped routes. Real Nest does the same in a fixed order, and it prints every step. If you can read those log lines, most startup errors explain themselves. We also look at what <code>nest build</code> produces, the faster SWC builder and its trap, and the two mistakes every beginner makes with modules.</p>

<h3>Step 1 — generate a resource and look at the wiring</h3>
<div class="out">${esc(OUT_GEN)}</div>
<p>The generator created a <strong>feature module</strong> (<code>notes.module.ts</code> with its controller and service) and edited the root module to import it:</p>
<pre><code class="language-ts">${esc(MA_APPMOD)}</code></pre>
<p>Remember the word <code>UPDATE</code>: the CLI edits <code>app.module.ts</code> for you. If you create files by hand (or copy them from another project), nobody adds that line — keep reading for what happens then.</p>

<h3>Step 2 — main.ts and the startup log, line by line</h3>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<div class="out">${esc(OUT_START)}</div>
<table>
<thead><tr><th>Log line</th><th>What just happened</th></tr></thead>
<tbody>
<tr><td><code>[NestFactory] Starting</code></td><td><code>NestFactory.create(AppModule)</code> starts scanning: it walks <code>imports</code> recursively and builds the <strong>module graph</strong>.</td></tr>
<tr><td><code>[InstanceLoader] … dependencies initialized</code></td><td>For each module, every provider and controller is <strong>instantiated</strong> in dependency order, using <code>design:paramtypes</code> (lesson 1.1). If a dependency is missing, startup stops here.</td></tr>
<tr><td><code>[RoutesResolver] NotesController {/notes}</code></td><td>The controller's <code>@Controller('notes')</code> label is read: prefix <code>/notes</code>.</td></tr>
<tr><td><code>[RouterExplorer] Mapped {/notes/:id, GET}</code></td><td>Each <code>@Get/@Post…</code> label becomes a route on the HTTP adapter (Express here). The order printed is the order routes are tried.</td></tr>
<tr><td><code>[NestApplication] successfully started</code></td><td><code>app.listen()</code> opened the port. Before this line, no request can arrive.</td></tr>
</tbody>
</table>
<p>The <code>+7ms</code> at the end of each line is the time since the previous line. On a big project, a module that takes 2 seconds to initialize (a slow database connection in a factory, say) stands out immediately.</p>

<h3>Step 3 — what <code>nest build</code> really produces</h3>
<div class="out">${esc(OUT_DIST)}</div>
<pre><code class="language-js">${esc(OUT_DISTJS)}</code></pre>
<p>Nothing more than lesson 1.1's <code>tsc</code> output: plain JavaScript where each decorator became a <code>__decorate(...)</code> call plus <code>__metadata("design:paramtypes", [AppService])</code>. In production you run <code>node dist/main.js</code> (script <code>start:prod</code>) — no TypeScript, no CLI. The <code>.d.ts</code> and <code>.js.map</code> files are for type information and readable stack traces.</p>

<h3>Step 4 — watch mode while you code</h3>
<div class="out">${esc(OUT_WATCH)}</div>
<p><code>start:dev</code> recompiles only what changed and restarts the process. Note the new process id (187 → 199): it is a <em>restart</em>, so anything kept in memory (our notes list in the lab) is lost on every save. That is normal; real data lives in a database from chapter 6.</p>

<h3>Step 5 — SWC: twice as fast, and it does not check types</h3>
<div class="out">${esc(OUT_SWC)}</div>
<p>The compile step itself is about 70 ms instead of most of the 1.7 s. Tempting — but look at what happens with a type error:</p>
<div class="out">${esc(OUT_SWCLOI)}</div>
<div class="callout warn"><strong>SWC strips types, it does not check them.</strong> With <code>-b swc</code> a wrong type compiles and exits 0. Fine for <code>start:dev</code> on your machine if your editor shows errors; <strong>not fine</strong> as the only build in CI. Either add <code>--type-check</code>, or run <code>npx tsc --noEmit</code> as a separate CI step (chapter 11).</div>

<h3>Step 6 — Express or Fastify underneath</h3>
<p>Nest does not handle HTTP itself; an <strong>adapter</strong> does. The default is Express (here 5.3.0). Switching to Fastify is one line in <code>main.ts</code> — and that line changes more than speed:</p>
<div class="out">${esc(OUT_EXPRESS)}</div>
<div class="out">${esc(OUT_FASTIFY)}</div>
<p>Everything written with Nest decorators (<code>@Param</code>, <code>@Body</code>, return values) worked unchanged. What broke is the one handler that touched the Express <code>res</code> object directly. Rule: the more you stay inside Nest's abstractions, the cheaper it is to change the platform. Lesson 1.3 shows when touching <code>res</code> is still worth it, and lesson 11.4 measures the speed difference.</p>

<h3>Step 7 — the two classic module mistakes</h3>
<p><strong>Mistake A — the service is not registered as a provider.</strong></p>
<div class="out">${esc(OUT_THIEUPROV)}</div>
<p>Read it like a sentence: <em>dependencies of NotesController (?)</em> — the <code>?</code> marks the position that could not be resolved; <em>argument NotesService at index [0]</em> — which one; <em>in the NotesModule module</em> — where Nest looked. The process exits with code 1, so a broken deploy fails loudly instead of serving errors. This is the single most common Nest error; chapter 2 covers every variant (export missing, circular import, interface token).</p>
<p><strong>Mistake B — the controller is not registered.</strong></p>
<div class="out">${esc(OUT_THIEUCTL)}</div>
<p>This one is silent: no error, the app starts, and the route simply does not exist. The tell is in the startup log — no <code>RoutesResolver</code> line for your controller. When a route returns 404 "for no reason", <strong>search the startup log for <code>Mapped</code></strong> before reading any code.</p>
<div class="out">${esc(OUT_LOGGER)}</div>
<p>The <code>logger</code> option of <code>NestFactory.create</code> controls those lines. Teams often silence <code>LOG</code> in production — which also hides the route map. Keep it on in development.</p>

<h3>💼 At work</h3>
<p>Your first ticket on an outsourcing project: "The new endpoint <code>/reports/monthly</code> returns 404 on staging, works on my machine." Before opening any controller, ask for the staging startup log and search for <code>Mapped {/reports</code>. Missing line ⇒ the module is not imported (often a merge that dropped one line from <code>app.module.ts</code>). Present but different path ⇒ a global prefix or a typo. This takes two minutes and is the first thing a senior will ask you anyway.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<ol>
<li>Generate <code>nest g resource rooms</code>. Before starting, predict every <code>Mapped</code> line; then start and compare.</li>
<li>Remove <code>RoomsService</code> from <code>providers</code>; read the error aloud as a sentence. Put it back.</li>
<li>Remove <code>RoomsModule</code> from <code>AppModule.imports</code>. What does the log show? What does <code>curl /rooms</code> return?</li>
<li>Introduce a type error and build with <code>-b swc</code>, then with <code>--type-check</code>. Write in your README which one your CI will use and why.</li>
</ol>
<details><summary>Show answer for 3</summary>
<p>No <code>InstanceLoader] RoomsModule</code> line, no <code>RoomsController {/rooms}</code>, no error. <code>curl /rooms</code> ⇒ <code>{"message":"Cannot GET /rooms","error":"Not Found","statusCode":404}</code>. A module nobody imports is not part of the graph — its files are compiled but never used.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NestFactory</span><span class="v">Builds the application: scans modules, creates instances, maps routes onto the HTTP adapter.</span></div>
  <div class="kv"><span class="k">module graph</span><span class="v">The tree of modules reachable from the root module through <code>imports</code>.</span></div>
  <div class="kv"><span class="k">feature module</span><span class="v">A module grouping one feature's controller, service and related files.</span></div>
  <div class="kv"><span class="k">HTTP adapter</span><span class="v">The library that actually speaks HTTP: Express (default) or Fastify.</span></div>
  <div class="kv"><span class="k">SWC</span><span class="v">A Rust compiler that strips TypeScript types very fast, without type checking.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Startup order: scan modules → instantiate providers/controllers → map routes → listen; the log shows each step.</li>
<li><code>dist/</code> is plain JS with <code>__decorate</code>/<code>__metadata</code>; production runs <code>node dist/main.js</code>.</li>
<li>Missing provider ⇒ loud failure at startup (exit 1). Missing controller or module import ⇒ silent 404 — check <code>Mapped</code> lines.</li>
<li>SWC is ~2× faster overall but does not type-check; CI needs <code>--type-check</code> or <code>tsc --noEmit</code>.</li>
<li>Code that stays in Nest decorators survives a switch to Fastify; code that touches Express <code>res</code> does not.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>1.2 — Từ <code>node dist/main.js</code> tới "successfully started": Nest làm gì trong 10 mili giây</h2>
<p class="lead">Ở bài 1.1, Nest tí hon của bạn đọc nhãn rồi nối route. Nest thật làm đúng việc đó theo một thứ tự cố định, và in ra từng bước. Đọc được mấy dòng log ấy thì phần lớn lỗi khởi động tự giải thích. Bài này còn xem <code>nest build</code> sinh ra gì, trình build SWC nhanh hơn cùng cái bẫy của nó, và hai lỗi module mà người mới nào cũng mắc.</p>

<h3>Bước 1 — sinh một resource và xem nó được nối ra sao</h3>
<div class="out">${esc(OUT_GEN)}</div>
<p>Lệnh sinh tạo một <strong>module tính năng</strong> (<code>notes.module.ts</code> kèm controller và service) rồi sửa module gốc để import nó:</p>
<pre><code class="language-ts">${esc(MA_APPMOD)}</code></pre>
<p>Nhớ chữ <code>UPDATE</code>: CLI sửa <code>app.module.ts</code> giúp bạn. Nếu bạn tự tạo tệp bằng tay (hoặc chép từ dự án khác), không ai thêm dòng đó — đọc tiếp để thấy chuyện gì xảy ra.</p>

<h3>Bước 2 — main.ts và log khởi động, từng dòng</h3>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<div class="out">${esc(OUT_START)}</div>
<table>
<thead><tr><th>Dòng log</th><th>Việc vừa xảy ra</th></tr></thead>
<tbody>
<tr><td><code>[NestFactory] Starting</code></td><td><code>NestFactory.create(AppModule)</code> bắt đầu quét: đi theo <code>imports</code> một cách đệ quy và dựng <strong>đồ thị module</strong>.</td></tr>
<tr><td><code>[InstanceLoader] … dependencies initialized</code></td><td>Với từng module, mọi provider và controller được <strong>tạo đối tượng</strong> theo thứ tự phụ thuộc, dựa trên <code>design:paramtypes</code> (bài 1.1). Thiếu phụ thuộc thì khởi động dừng ở đây.</td></tr>
<tr><td><code>[RoutesResolver] NotesController {/notes}</code></td><td>Nhãn <code>@Controller('notes')</code> được đọc: tiền tố <code>/notes</code>.</td></tr>
<tr><td><code>[RouterExplorer] Mapped {/notes/:id, GET}</code></td><td>Mỗi nhãn <code>@Get/@Post…</code> thành một route trên HTTP adapter (ở đây là Express). Thứ tự in ra là thứ tự route được thử.</td></tr>
<tr><td><code>[NestApplication] successfully started</code></td><td><code>app.listen()</code> đã mở cổng. Trước dòng này, không request nào tới được.</td></tr>
</tbody>
</table>
<p><code>+7ms</code> ở cuối mỗi dòng là thời gian kể từ dòng trước. Ở dự án lớn, module nào mất 2 giây để khởi tạo (chẳng hạn một factory kết nối cơ sở dữ liệu chậm) sẽ lộ ra ngay.</p>

<h3>Bước 3 — <code>nest build</code> thật sự sinh ra gì</h3>
<div class="out">${esc(OUT_DIST)}</div>
<pre><code class="language-js">${esc(OUT_DISTJS)}</code></pre>
<p>Không hơn gì output <code>tsc</code> của bài 1.1: JavaScript thường, mỗi decorator thành một lời gọi <code>__decorate(...)</code> kèm <code>__metadata("design:paramtypes", [AppService])</code>. Trên production bạn chạy <code>node dist/main.js</code> (script <code>start:prod</code>) — không TypeScript, không CLI. Các tệp <code>.d.ts</code> và <code>.js.map</code> để mang thông tin kiểu và cho stack trace đọc được.</p>

<h3>Bước 4 — chế độ watch khi đang viết mã</h3>
<div class="out">${esc(OUT_WATCH)}</div>
<p><code>start:dev</code> chỉ biên dịch lại phần đã đổi rồi khởi động lại tiến trình. Để ý mã tiến trình mới (187 → 199): đây là <em>khởi động lại</em>, nên mọi thứ giữ trong bộ nhớ (danh sách ghi chú trong lab) mất sau mỗi lần lưu. Bình thường thôi; dữ liệu thật nằm trong cơ sở dữ liệu từ chương 6.</p>

<h3>Bước 5 — SWC: nhanh gấp đôi, và không kiểm kiểu</h3>
<div class="out">${esc(OUT_SWC)}</div>
<p>Riêng bước biên dịch chỉ khoảng 70 mili giây thay vì phần lớn của 1,7 giây. Hấp dẫn — nhưng xem chuyện gì xảy ra khi có lỗi kiểu:</p>
<div class="out">${esc(OUT_SWCLOI)}</div>
<div class="callout warn"><strong>SWC bóc kiểu, không kiểm kiểu.</strong> Với <code>-b swc</code>, mã sai kiểu vẫn biên dịch và trả exit 0. Dùng cho <code>start:dev</code> trên máy bạn thì được, nếu trình soạn thảo đã báo lỗi; <strong>không được</strong> làm bước build duy nhất trong CI. Hoặc thêm <code>--type-check</code>, hoặc chạy <code>npx tsc --noEmit</code> thành một bước CI riêng (chương 11).</div>

<h3>Bước 6 — Express hay Fastify bên dưới</h3>
<p>Nest không tự xử lý HTTP; một <strong>adapter</strong> làm việc đó. Mặc định là Express (ở đây bản 5.3.0). Đổi sang Fastify chỉ là một dòng trong <code>main.ts</code> — và dòng ấy đổi nhiều hơn tốc độ:</p>
<div class="out">${esc(OUT_EXPRESS)}</div>
<div class="out">${esc(OUT_FASTIFY)}</div>
<p>Mọi thứ viết bằng decorator của Nest (<code>@Param</code>, <code>@Body</code>, giá trị trả về) chạy nguyên vẹn. Thứ hỏng là đúng một handler đụng thẳng vào đối tượng <code>res</code> của Express. Quy tắc: càng ở trong lớp trừu tượng của Nest, đổi nền tảng càng rẻ. Bài 1.3 chỉ khi nào đụng <code>res</code> vẫn đáng, bài 11.4 đo chênh lệch tốc độ.</p>

<h3>Bước 7 — hai lỗi module kinh điển</h3>
<p><strong>Lỗi A — service chưa được khai là provider.</strong></p>
<div class="out">${esc(OUT_THIEUPROV)}</div>
<p>Đọc nó như một câu: <em>dependencies of NotesController (?)</em> — dấu <code>?</code> đánh dấu vị trí không giải được; <em>argument NotesService at index [0]</em> — là cái nào; <em>in the NotesModule module</em> — Nest đã tìm ở đâu. Tiến trình thoát với mã 1, nên một bản triển khai hỏng sẽ đổ ầm ĩ thay vì âm thầm trả lỗi. Đây là lỗi Nest phổ biến nhất; chương 2 đi qua mọi biến thể (thiếu export, import vòng, token cho interface).</p>
<p><strong>Lỗi B — controller chưa được khai.</strong></p>
<div class="out">${esc(OUT_THIEUCTL)}</div>
<p>Lỗi này im lặng: không báo gì, ứng dụng vẫn chạy, chỉ là route không tồn tại. Dấu hiệu nằm trong log khởi động — không có dòng <code>RoutesResolver</code> nào cho controller của bạn. Khi một route trả 404 "chẳng vì sao cả", <strong>tìm chữ <code>Mapped</code> trong log khởi động</strong> trước khi đọc mã.</p>
<div class="out">${esc(OUT_LOGGER)}</div>
<p>Tuỳ chọn <code>logger</code> của <code>NestFactory.create</code> quyết định mấy dòng đó. Nhiều đội tắt mức <code>LOG</code> trên production — đồng thời giấu luôn bản đồ route. Ở môi trường dev, cứ để bật.</p>

<h3>💼 Tình huống đi làm</h3>
<p>Ticket đầu tiên của bạn ở một dự án outsourcing: "Endpoint mới <code>/reports/monthly</code> trả 404 trên staging, máy em chạy được." Trước khi mở controller nào, xin log khởi động của staging và tìm <code>Mapped {/reports</code>. Không có dòng đó ⇒ module chưa được import (thường do một lần merge làm rơi một dòng trong <code>app.module.ts</code>). Có nhưng đường dẫn khác ⇒ tiền tố toàn cục hoặc gõ sai. Việc này mất hai phút, và đằng nào anh chị senior cũng hỏi bạn câu đó đầu tiên.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Sinh <code>nest g resource rooms</code>. Trước khi chạy, đoán mọi dòng <code>Mapped</code>; rồi chạy và so.</li>
<li>Bỏ <code>RoomsService</code> khỏi <code>providers</code>; đọc to thông báo lỗi như một câu. Trả lại như cũ.</li>
<li>Bỏ <code>RoomsModule</code> khỏi <code>AppModule.imports</code>. Log hiện gì? <code>curl /rooms</code> trả gì?</li>
<li>Cố tình viết sai kiểu rồi build bằng <code>-b swc</code>, sau đó bằng <code>--type-check</code>. Ghi vào README CI của bạn sẽ dùng cách nào, vì sao.</li>
</ol>
<details><summary>Xem đáp án câu 3</summary>
<p>Không có dòng <code>InstanceLoader] RoomsModule</code>, không có <code>RoomsController {/rooms}</code>, không có lỗi. <code>curl /rooms</code> ⇒ <code>{"message":"Cannot GET /rooms","error":"Not Found","statusCode":404}</code>. Module không ai import thì không thuộc đồ thị — tệp của nó vẫn được biên dịch nhưng không bao giờ được dùng.</p>
</details>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NestFactory</span><span class="v">Dựng ứng dụng: quét module, tạo đối tượng, nối route lên HTTP adapter.</span></div>
  <div class="kv"><span class="k">đồ thị module</span><span class="v">Cây các module đi tới được từ module gốc qua <code>imports</code>.</span></div>
  <div class="kv"><span class="k">module tính năng</span><span class="v">Module gom controller, service và tệp liên quan của một tính năng.</span></div>
  <div class="kv"><span class="k">HTTP adapter</span><span class="v">Thư viện thật sự nói HTTP: Express (mặc định) hoặc Fastify.</span></div>
  <div class="kv"><span class="k">SWC</span><span class="v">Trình biên dịch viết bằng Rust, bóc kiểu TypeScript rất nhanh, không kiểm kiểu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thứ tự khởi động: quét module → tạo provider/controller → nối route → listen; log in ra từng bước.</li>
<li><code>dist/</code> là JS thường với <code>__decorate</code>/<code>__metadata</code>; production chạy <code>node dist/main.js</code>.</li>
<li>Thiếu provider ⇒ đổ ầm ĩ lúc khởi động (exit 1). Thiếu controller hoặc thiếu import module ⇒ 404 im lặng — kiểm dòng <code>Mapped</code>.</li>
<li>SWC nhanh ~2 lần cả lệnh nhưng không kiểm kiểu; CI cần <code>--type-check</code> hoặc <code>tsc --noEmit</code>.</li>
<li>Mã ở trong decorator của Nest sống sót khi đổi sang Fastify; mã đụng <code>res</code> của Express thì không.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
